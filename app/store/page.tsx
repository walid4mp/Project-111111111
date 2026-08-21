'use client';

import { useWarHexData } from '@/app/data/runtime';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Check, Crown, Gift, ShoppingCart, Sparkles, Star, Zap, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const tabs = ['Gems', 'VIP', 'Gift Packs', 'Offers'] as const;

type Currency = 'USD' | 'EUR';

export default function StorePage() {
  const { storeItems } = useWarHexData();
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>('Gems');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState('');

  const startPayment = async (itemId: string) => {
    setPaymentError('');
    setPayingId(itemId);
    try {
      const response = await fetch('/api/payments/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ itemId, currency }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error('Please sign in before buying.');
      if (!response.ok) throw new Error(data.error || 'Could not start payment.');
      if (typeof data.approvalUrl !== 'string' || !data.approvalUrl) throw new Error('PayPal did not return a checkout link.');
      window.location.assign(data.approvalUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not start payment.');
      setPayingId(null);
    }
  };

  const displayPrice = (price: number) => {
    const rate = Number(process.env.NEXT_PUBLIC_PAYPAL_EUR_RATE || '0.92');
    const value = currency === 'EUR' ? price * (Number.isFinite(rate) && rate > 0 ? rate : 0.92) : price;
    return `${currency === 'EUR' ? '€' : '$'}${value.toFixed(2)}`;
  };

  const filteredItems = storeItems.filter((item) => {
    if (selectedTab === 'Gems') return item.type === 'gems';
    if (selectedTab === 'VIP') return item.type === 'vip';
    if (selectedTab === 'Gift Packs') return item.type === 'gift-pack';
    return item.featured;
  });

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="w-7 h-7 text-yellow-500" />Store</h1>
          <div className="flex items-center gap-2">
            <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm">
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
            <Button variant="ghost" size="sm"><Gift className="w-4 h-4 mr-1" />History</Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-40 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600"><div className="absolute inset-0 bg-black/20" /></div>
          <div className="relative z-10 h-full flex flex-col justify-center px-6">
            <Badge variant="default" size="md" className="w-fit mb-2 bg-black/50"><Zap className="w-4 h-4 mr-1 text-yellow-400" />LIMITED OFFER</Badge>
            <h2 className="text-2xl font-bold mb-1">WarHex Store</h2>
            <p className="text-white/90 text-sm">Secure checkout through PayPal.</p>
          </div>
        </motion.div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map((tab) => <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedTab === tab ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white'}`}>{tab}</button>)}
        </div>

        {paymentError && (
          <Card variant="glass" className="border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-red-200">{paymentError}</p>
              <Link href="/auth/login"><Button variant="primary" size="sm"><LogIn className="w-4 h-4 mr-2" />Sign in</Button></Link>
            </div>
          </Card>
        )}

        {selectedTab === 'VIP' && <Card variant="premium"><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl vip-badge flex items-center justify-center"><Crown className="w-6 h-6 text-black" /></div><div><h3 className="font-bold text-lg">VIP Membership Benefits</h3><p className="text-sm text-gray-400">Unlock exclusive privileges</p></div></div><div className="grid grid-cols-2 gap-3">{['Exclusive VIP frame','Daily gem bonus','Priority support','Exclusive gifts','Special entrance effects','VIP-only rooms'].map((benefit) => <div key={benefit} className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-emerald-500" /></div><span className="text-sm text-gray-300">{benefit}</span></div>)}</div></Card>}

        {filteredItems.length === 0 ? <Card variant="glass" className="p-8 text-center"><Sparkles className="w-8 h-8 mx-auto mb-3 text-cyan-400" /><p className="font-semibold">No products available yet.</p><p className="text-sm text-gray-400 mt-1">Add active products to the Supabase store_items table.</p></Card> : <div className="grid grid-cols-2 gap-4">{filteredItems.map((item, i) => <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}><Card variant={item.featured ? 'glow' : 'premium'} interactive className="relative overflow-hidden">{item.badge && <div className="absolute top-2 right-2 z-10"><Badge variant={item.badge.includes('Popular') ? 'purple' : 'gold'} size="sm">{item.badge}</Badge></div>}<div className="text-center mb-4"><div className="text-6xl mb-3">{item.image}</div><h3 className="font-bold text-lg mb-1">{item.name}</h3>{item.bonus ? <Badge variant="emerald" size="sm" className="mb-2"><Gift className="w-3 h-3 mr-1" />+{item.bonus} Bonus</Badge> : null}</div><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-gray-400 text-sm">Value:</span><span className="font-bold gradient-text text-lg">{item.value.toLocaleString()}{item.type === 'gems' ? ' 💎' : item.type === 'vip' ? ' days' : ''}</span></div><Button variant="gold" size="md" fullWidth onClick={() => void startPayment(item.id)} disabled={payingId === item.id}><span className="font-bold">{payingId === item.id ? 'Opening PayPal…' : displayPrice(item.price)}</span></Button></div>{item.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500" />}</Card></motion.div>)}</div>}

        <Card variant="glass"><h3 className="font-bold mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-500" />Secure Payment Methods</h3><div className="flex flex-wrap gap-3">{['💳 Visa / Mastercard*','💰 PayPal','💶 EUR','💵 USD'].map((method) => <Badge key={method} variant="default" size="md">{method}</Badge>)}</div><p className="text-xs text-gray-500 mt-3">Card availability is determined by PayPal and the buyer&apos;s country/account eligibility.</p></Card>
        <Card variant="glow" className="p-5"><div className="flex items-center gap-3"><Star className="w-6 h-6 text-yellow-500" /><div><h2 className="text-xl font-bold">Ready to play?</h2><p className="text-sm text-gray-400">Buy only from the real Supabase catalog. No demo products are used here.</p></div></div></Card>
      </div>
    </div>
  );
}
