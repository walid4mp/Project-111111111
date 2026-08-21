import { supabaseServiceFetch } from '@/app/lib/server/supabase';

export type PaymentCurrency = 'USD' | 'EUR';
export type PaymentItem = { id: string; name: string; type: 'gems' | 'vip' | 'gift-pack' | 'offer'; price: number; value: number; bonus?: number };

export async function getPaymentItem(itemId: string): Promise<PaymentItem | null> {
  const response = await supabaseServiceFetch(`/rest/v1/store_items?id=eq.${encodeURIComponent(itemId)}&active=eq.true&select=id,name,type,price_usd,value,bonus&limit=1`);
  if (!response.ok) return null;
  const rows = await response.json() as Array<Record<string, unknown>>;
  const x = rows[0];
  if (!x) return null;
  return { id: x.id as string, name: x.name as string, type: x.type as PaymentItem['type'], price: Number(x.price_usd), value: Number(x.value), bonus: x.bonus == null ? undefined : Number(x.bonus) };
}

export function getPaymentAmount(priceUsd: number, currency: PaymentCurrency) {
  if (currency === 'USD') return Number(priceUsd.toFixed(2));
  const rate = Number(process.env.PAYPAL_EUR_RATE || '0.92');
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid PAYPAL_EUR_RATE.');
  return Number((priceUsd * rate).toFixed(2));
}
