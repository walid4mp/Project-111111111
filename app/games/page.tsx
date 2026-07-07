'use client';

import { games } from '../data/mockData';
import { formatNumber } from '../lib/utils';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import {
  Flame,
  Gamepad2,
  Search,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = ['All', 'Board', 'Strategy', 'Classic', 'Puzzle', 'Casual', 'Sports'];

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch = game.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-7 h-7 text-blue-500" />
              Games
            </h1>
            <Button variant="primary" size="sm">
              <Trophy className="w-4 h-4 mr-1" />
              Tournaments
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-2 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(45280)}</p>
            <p className="text-xs text-gray-400">Active Players</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-2 flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(1250)}</p>
            <p className="text-xs text-gray-400">Live Rooms</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(85)}</p>
            <p className="text-xs text-gray-400">Tournaments</p>
          </Card>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: 'Quick Match', subtitle: 'Play instantly', icon: Zap, gradient: 'from-blue-500 to-blue-600' },
            { title: 'Ranked', subtitle: 'Competitive', icon: Trophy, gradient: 'from-purple-500 to-purple-600' },
            { title: 'Private', subtitle: 'With friends', icon: Users, gradient: 'from-pink-500 to-pink-600' },
          ].map((mode, i) => (
            <Card key={i} variant="premium" interactive className="cursor-pointer text-center p-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.gradient} mx-auto mb-2 flex items-center justify-center`}>
                <mode.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-sm">{mode.title}</h3>
              <p className="text-xs text-gray-400">{mode.subtitle}</p>
            </Card>
          ))}
        </div>

        {/* Games Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selectedCategory === 'All' ? 'All Games' : selectedCategory}
            </h2>
            <span className="text-sm text-gray-400">
              {filteredGames.length} games
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredGames.map((game, i) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card variant="premium" interactive className="cursor-pointer">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-500" />
                        {formatNumber(game.players)}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant="purple" size="sm">
                          {game.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{game.name}</h3>
                      <span className="text-2xl">{game.icon}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Min bet: {game.minBet} 💎
                      </span>
                      <Button variant="primary" size="sm">
                        Play
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Tournament Banner */}
        <Link href="/tournaments">
          <Card variant="glow" className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Join Weekly Championship</h3>
                <p className="text-sm text-gray-400">
                  Win up to <span className="text-yellow-400 font-bold">100,000</span> coins!
                </p>
              </div>
              <Badge variant="gold" size="md">
                <Star className="w-4 h-4 mr-1" />
                Live
              </Badge>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
