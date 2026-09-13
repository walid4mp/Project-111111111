'use client';

import { gifts } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Gift, Search, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { type ComponentProps, useState } from 'react';

const categories = ['All', 'Flowers', 'Love', 'Food', 'Drinks', 'Luxury', 'Royal', 'Mythical', 'Cosmic'];
const rarities = ['All', 'normal', 'rare', 'epic', 'legendary', 'vip'];
type BadgeVariant = ComponentProps<typeof Badge>['variant'];

export default function GiftsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGifts = gifts.filter((gift) => {
    const matchesCategory = selectedCategory === 'All' || gift.category === selectedCategory;
    const matchesRarity = selectedRarity === 'All' || gift.rarity === selectedRarity;
    const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRarity && matchesSearch;
  });

  const getRarityColor = (rarity: string): BadgeVariant => {
    switch (rarity) {
      case 'normal':
        return 'default';
      case 'rare':
        return 'purple';
      case 'epic':
        return 'gold';
      case 'legendary':
        return 'red';
      case 'vip':
        return 'vip';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Gift className="w-7 h-7 text-pink-500" />
              Gift Store
            </h1>
            <Badge variant="gold" size="md">
              <Sparkles className="w-4 h-4 mr-1" />
              {gifts.length}+ Gifts
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search gifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
          />
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-32 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600">
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 h-full flex items-center justify-between px-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Send Love ❤️</h2>
              <p className="text-white/90 text-sm">Express your feelings with gifts</p>
            </div>
            <div className="text-6xl animate-pulse-glow">🎁</div>
          </div>
        </motion.div>

        {/* Rarity Filter */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {rarities.map((rarity) => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all capitalize ${
                selectedRarity === rarity
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gifts Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selectedCategory === 'All' ? 'All Gifts' : selectedCategory} Gifts
            </h2>
            <span className="text-sm text-gray-400">{filteredGifts.length} gifts</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGifts.map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  variant={gift.rarity === 'legendary' || gift.rarity === 'vip' ? 'glow' : 'premium'}
                  interactive
                  className="cursor-pointer text-center"
                >
                  <div className="relative mb-3">
                    <div className="text-6xl mb-2">{gift.image}</div>
                    <Badge
                      variant={getRarityColor(gift.rarity)}
                      size="sm"
                      className="capitalize"
                    >
                      {gift.rarity}
                    </Badge>
                  </div>

                  <h3 className="font-bold mb-1">{gift.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{gift.category}</p>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="font-bold gradient-text">{gift.price}</span>
                    </div>
                    <Link href={`/gifts/send/${gift.id}`}>
                      <Button variant="primary" size="sm">
                        Send
                      </Button>
                    </Link>
                  </div>

                  {gift.combo && (
                    <div className="mt-2">
                      <Badge variant="gold" size="sm">
                        <Star className="w-3 h-3 mr-1" />
                        x{gift.combo} Combo
                      </Badge>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gift Packs Promo */}
        <Card variant="glow" className="cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl flex-shrink-0">
              🎁
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Gift Packs Available!</h3>
              <p className="text-sm text-gray-400">Get multiple gifts at discounted prices</p>
            </div>
            <Link href="/store">
              <Button variant="gold" size="md">
                Shop Now
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
