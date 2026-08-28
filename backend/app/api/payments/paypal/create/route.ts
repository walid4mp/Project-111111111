import { NextRequest, NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';
import { getPaymentAmount, getPaymentItem, type PaymentCurrency } from '@/app/lib/server/payment-catalog';
import { getSiteUrl, paypalRequest } from '@/app/lib/server/paypal';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const itemId = typeof body.itemId === 'string' ? body.itemId : '';
    const currency: PaymentCurrency = body.currency === 'EUR' ? 'EUR' : 'USD';
    const item = await getPaymentItem(itemId);
    if (!item) return NextResponse.json({ error: 'Invalid store item.' }, { status: 400 });

    const amount = getPaymentAmount(item.price, currency);
    const siteUrl = getSiteUrl(request);
    const customId = `${auth.user.id}:${item.id}`;

    const { response, data } = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      headers: { 'PayPal-Request-Id': crypto.randomUUID() },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: item.id,
          custom_id: customId,
          description: `WarHex ${item.name}`,
          amount: { currency_code: currency, value: amount.toFixed(2) },
        }],
        application_context: {
          brand_name: 'WarHex',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          return_url: `${siteUrl}/store/paypal-return`,
          cancel_url: `${siteUrl}/store?payment=cancelled`,
        },
      }),
    });

    if (!response.ok || !data.id) {
      return NextResponse.json({ error: data.message || 'PayPal could not create the order.', details: data }, { status: 502 });
    }

    const insert = await supabaseServiceFetch('/rest/v1/payment_orders', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        user_id: auth.user.id,
        item_id: item.id,
        provider: 'paypal',
        provider_order_id: data.id,
        currency,
        amount,
        status: 'created',
      }),
    });

    if (!insert.ok) {
      await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(data.id)}`, { method: 'GET' }).catch(() => undefined);
      return NextResponse.json({ error: 'Could not save the payment order. No charge was made.' }, { status: 500 });
    }

    const approvalUrl = Array.isArray(data.links)
      ? data.links.find((link: { rel?: string }) => link.rel === 'approve')?.href
      : undefined;
    if (!approvalUrl) return NextResponse.json({ error: 'PayPal did not return an approval URL.' }, { status: 502 });

    return NextResponse.json({ orderId: data.id, approvalUrl, currency, amount, item: item.name });
  } catch (error) {
    console.error('PayPal create error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not start payment.' }, { status: 500 });
  }
}
