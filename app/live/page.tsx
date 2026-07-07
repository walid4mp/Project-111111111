'use client';

import { liveStreams } from '../data/mockData';
import { formatNumber } from '../lib/utils';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Flame, Heart, Radio, Search, Sparkles, Star, TrendingUp, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = ['All', 'Ludo', 'Chess', 'Gaming', 'Music', 'Talk Shows', 'Entertainment'];

export default function LivePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Radio className="w-7 h-7 text-red-500 animate-pulse" />
              Live Streams
            </h1>
            <Button variant="primary" size="sm">
              <Video className="w-4 h-4 mr-1" />
              Go Live
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
            placeholder="Search live streams..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 mx-auto mb-2 flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(1250)}</p>
            <p className="text-xs text-gray-400">Live Now</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mx-auto mb-2 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(45280)}</p>
            <p className="text-xs text-gray-400">Viewers</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-2 flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(8900)}</p>
            <p className="text-xs text-gray-400">Hot</p>
          </Card>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Stream */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold">Featured</h2>
          </div>
          <Link href={`/live/${liveStreams[0]?.id}`}>
            <Card variant="glow" interactive className="cursor-pointer overflow-hidden">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <img
                  src={liveStreams[0]?.thumbnail}
                  alt={liveStreams[0]?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <Badge variant="red" size="md" className="absolute top-3 left-3 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  LIVE
                </Badge>
                <div className="absolute bottom-3 right-3 bg-black/70 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-500" />
                  {formatNumber(liveStreams[0]?.viewers)}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Avatar
                  src={liveStreams[0]?.host.avatar}
                  size="lg"
                  vipLevel={liveStreams[0]?.host.vipLevel}
                  online
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{liveStreams[0]?.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{liveStreams[0]?.host.username}</p>
                  <div className="flex flex-wrap gap-2">
                    {liveStreams[0]?.tags.map((tag, i) => (
                      <Badge key={i} variant="purple" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Trending Streams */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {liveStreams.map((stream) => (
              <Link key={stream.id} href={`/live/${stream.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card variant="premium" interactive className="cursor-pointer overflow-hidden">
                    <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge variant="red" size="sm" className="absolute top-2 left-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                        LIVE
                      </Badge>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(stream.viewers)}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        {formatNumber(stream.likes)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        src={stream.host.avatar}
                        size="sm"
                        vipLevel={stream.host.vipLevel}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{stream.title}</h3>
                        <p className="text-xs text-gray-400">{stream.host.username}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Start Streaming CTA */}
        <Card variant="glow" className="cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Start Your Own Stream</h3>
              <p className="text-sm text-gray-400">Share your gameplay and earn rewards</p>
            </div>
            <Button variant="primary" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
