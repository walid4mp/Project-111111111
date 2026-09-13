'use client';

import { storeItems } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import {
  Check,
  Crown,
  Gift,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const tabs = ['Gems', 'VIP', 'Gift Packs', 'Offers'];

export default function StorePage() {
  const [selectedTab, setSelectedTab] = useState('Gems');

  const getFilteredItems = () => {
    switch (selectedTab) {
      case 'Gems':
        return storeItems.filter((item) => item.type === 'gems');
      case 'VIP':
        return storeItems.filter((item) => item.type === 'vip');
      case 'Gift Packs':
        return storeItems.filter((item) => item.type === 'gift-pack');
      case 'Offers':
        return storeItems.filter((item) => item.featured);
      default:
        return storeItems;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-7 h-7 text-yellow-500" />
              Store
            </h1>
            <Link href="/store/history">
              <Button variant="ghost" size="sm">
                <Gift className="w-4 h-4 mr-1" />
                History
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-40 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600">
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center px-6">
            <Badge variant="default" size="md" className="w-fit mb-2 bg-black/50">
              <Zap className="w-4 h-4 mr-1 text-yellow-400" />
              LIMITED OFFER
            </Badge>
            <h2 className="text-2xl font-bold mb-1">Double Gems Weekend!</h2>
            <p className="text-white/90 text-sm">Get 2x bonus on all gem purchases</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* VIP Benefits (shown when VIP tab is selected) */}
        {selectedTab === 'VIP' && (
          <Card variant="premium">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl vip-badge flex items-center justify-center">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg">VIP Membership Benefits</h3>
                <p className="text-sm text-gray-400">Unlock exclusive privileges</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Exclusive VIP frame',
                'Daily gem bonus',
                'Priority support',
                'Exclusive gifts',
                'Special entrance effects',
                'VIP-only rooms',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-sm text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Store Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                variant={item.featured ? 'glow' : 'premium'}
                interactive
                className="cursor-pointer relative overflow-hidden"
              >
                {item.badge && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge
                      variant={item.badge.includes('Popular') ? 'purple' : 'gold'}
                      size="sm"
                    >
                      {item.badge}
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{item.image}</div>
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  {item.bonus && (
                    <Badge variant="emerald" size="sm" className="mb-2">
                      <Gift className="w-3 h-3 mr-1" />
                      +{item.bonus} Bonus
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Value:</span>
                    <span className="font-bold gradient-text text-lg">
                      {item.value.toLocaleString()}
                      {item.type === 'gems' ? ' 💎' : item.type === 'vip' ? ' days' : ''}
                    </span>
                  </div>

                  <Link href={`/store/checkout/${item.id}`}>
                    <Button variant="gold" size="md" fullWidth>
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                    </Button>
                  </Link>
                </div>

                {item.featured && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <Card variant="glass">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Secure Payment Methods
          </h3>
          <div className="flex flex-wrap gap-3">
            {['💳 Credit Card', '🍎 Apple Pay', '📱 Google Pay', '💰 PayPal', '🏦 Bank Transfer'].map((method, i) => (
              <Badge key={i} variant="default" size="md">
                {method}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Special Offers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Daily Deals
            </h2>
            <span className="text-sm text-gray-400">Ends in 23:45:12</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card variant="glow" className="cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl flex-shrink-0">
                  🎁
                </div>
                <div className="flex-1">
                  <Badge variant="red" size="sm" className="mb-2">
                    50% OFF
                  </Badge>
                  <h3 className="font-bold text-lg mb-1">Mega Starter Pack</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    5000 Gems + 7 Days VIP + Exclusive Gifts
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">$99.99</span>
                    <span className="font-bold text-xl gradient-text-gold">$49.99</span>
                  </div>
                </div>
                <Link href="/store/checkout/12">
                  <Button variant="gold" size="lg">
                    Buy Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
