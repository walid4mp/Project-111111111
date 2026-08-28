import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
import { getPaymentItem } from '@/app/lib/server/payment-catalog';
import { paypalRequest } from '@/app/lib/server/paypal';

export async function POST(request: NextRequest) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 });
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    const verification = await paypalRequest('/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      body: JSON.stringify({
        auth_algo: request.headers.get('paypal-auth-algo'),
        cert_url: request.headers.get('paypal-cert-url'),
        transmission_id: request.headers.get('paypal-transmission-id'),
        transmission_sig: request.headers.get('paypal-transmission-sig'),
        transmission_time: request.headers.get('paypal-transmission-time'),
        webhook_id: webhookId,
        webhook_event: event,
      }),
    });
    if (!verification.response.ok || verification.data.verification_status !== 'SUCCESS') {
      return NextResponse.json({ error: 'Invalid PayPal webhook.' }, { status: 400 });
    }

    if (event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') return NextResponse.json({ received: true });
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    const captureId = event.resource?.id;
    if (!orderId) return NextResponse.json({ received: true });

    const lookup = await supabaseServiceFetch(`/rest/v1/payment_orders?provider_order_id=eq.${encodeURIComponent(orderId)}&select=*`);
    const rows = lookup.ok ? await lookup.json() : [];
    const payment = rows[0];
    if (!payment || payment.status === 'captured') return NextResponse.json({ received: true });
    const item = await getPaymentItem(payment.item_id);
    if (!item) return NextResponse.json({ error: 'Unknown store item.' }, { status: 500 });

    const rpc = await supabaseServiceFetch('/rest/v1/rpc/grant_payment_reward', {
      method: 'POST',
      body: JSON.stringify({
        p_payment_order_id: payment.id,
        p_user_id: payment.user_id,
        p_provider_capture_id: captureId || orderId,
        p_item_type: item.type,
        p_value: item.value,
        p_bonus: item.bonus || 0,
      }),
    });
    if (!rpc.ok) return NextResponse.json({ error: 'Reward processing failed.' }, { status: 500 });
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
