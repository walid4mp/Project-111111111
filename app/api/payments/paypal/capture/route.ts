import { NextRequest, NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
import { getPaymentItem } from '@/app/lib/server/payment-catalog';
import { paypalRequest } from '@/app/lib/server/paypal';

async function grantCapturedOrder(orderId: string, captureId?: string) {
  const lookup = await supabaseServiceFetch(`/rest/v1/payment_orders?provider_order_id=eq.${encodeURIComponent(orderId)}&select=*`);
  const rows = lookup.ok ? await lookup.json() : [];
  const payment = rows[0];
  if (!payment) throw new Error('Payment order not found.');
  const item = await getPaymentItem(payment.item_id);
  if (!item) throw new Error('The purchased item no longer exists.');

  const rpc = await supabaseServiceFetch('/rest/v1/rpc/grant_payment_reward', {
    method: 'POST',
    body: JSON.stringify({
      p_payment_order_id: payment.id,
      p_user_id: payment.user_id,
      p_provider_capture_id: captureId || payment.provider_capture_id || orderId,
      p_item_type: item.type,
      p_value: item.value,
      p_bonus: item.bonus || 0,
    }),
  });
  const result = await rpc.json().catch(() => ({}));
  if (!rpc.ok) throw new Error(result.message || result.error || 'Could not grant the purchased reward.');
  return { payment, item, alreadyCaptured: Boolean(result.already_granted), reward: result.reward ?? item.value + (item.bonus || 0) };
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const orderId = typeof body.orderId === 'string' ? body.orderId : '';
    if (!orderId) return NextResponse.json({ error: 'Missing PayPal order ID.' }, { status: 400 });

    const lookup = await supabaseServiceFetch(`/rest/v1/payment_orders?provider_order_id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(auth.user.id)}&select=*`);
    const rows = lookup.ok ? await lookup.json() : [];
    const payment = rows[0];
    if (!payment) return NextResponse.json({ error: 'This payment does not belong to your account.' }, { status: 403 });
    if (payment.status === 'captured') {
      const item = await getPaymentItem(payment.item_id);
      return NextResponse.json({ success: true, alreadyCaptured: true, item: item?.name || payment.item_id });
    }

    const { response, data } = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: { 'PayPal-Request-Id': crypto.randomUUID() },
    });

    let captureId: string | undefined;
    if (response.ok) {
      captureId = data?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    } else if (data?.name === 'ORDER_ALREADY_CAPTURED') {
      const existing = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, { method: 'GET' });
      if (!existing.response.ok) return NextResponse.json({ error: 'PayPal reports this order as captured, but its status could not be verified.' }, { status: 502 });
      captureId = existing.data?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      if (!captureId) return NextResponse.json({ error: 'Captured PayPal order has no capture ID.' }, { status: 502 });
    } else {
      return NextResponse.json({ error: data?.message || 'PayPal could not capture this payment.', details: data }, { status: 502 });
    }

    const result = await grantCapturedOrder(orderId, captureId);
    return NextResponse.json({
      success: true,
      alreadyCaptured: result.alreadyCaptured,
      item: result.item.name,
      reward: result.reward,
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Payment confirmation failed.' }, { status: 500 });
  }
}
