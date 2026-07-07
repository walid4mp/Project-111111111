'use client';

import { voiceRooms } from '../data/mockData';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Lock, Mic, Music, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = ['All', 'Gaming', 'Music', 'Casual', 'Party', 'Language Exchange'];

export default function VoicePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="w-7 h-7 text-purple-500" />
              Voice Rooms
            </h1>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Room
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
            placeholder="Search voice rooms..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Room Sizes */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { size: 8, label: 'Small', icon: Users },
            { size: 12, label: 'Medium', icon: Users },
            { size: 16, label: 'Large', icon: Users },
          ].map((room, i) => (
            <Card key={i} variant="glass" className="text-center p-4">
              <room.icon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-bold mb-1">{room.label}</p>
              <p className="text-xs text-gray-400">{room.size} seats</p>
            </Card>
          ))}
        </div>

        {/* Voice Rooms List */}
        <div className="space-y-4">
          {voiceRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/voice/${room.id}`}>
                <Card variant="premium" interactive className="cursor-pointer overflow-hidden">
                  {/* Room Background */}
                  <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                    <img
                      src={room.background}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="purple" size="md">
                        <Music className="w-4 h-4 mr-1" />
                        {room.theme}
                      </Badge>
                    </div>
                    {room.isLocked && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="red" size="md">
                          <Lock className="w-4 h-4 mr-1" />
                          Private
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={room.host.avatar}
                        size="md"
                        vipLevel={room.host.vipLevel}
                        online
                      />
                      <div>
                        <p className="text-sm font-medium">{room.host.username}</p>
                        <p className="text-xs text-gray-400">Host</p>
                      </div>
                    </div>
                    <Badge variant="emerald" size="md">
                      {room.occupiedSeats}/{room.seats} seats
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Mic className="w-4 h-4 text-purple-500" />
                      {room.occupiedSeats} speaking
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4 text-blue-500" />
                      {room.listeners} listening
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}

          {/* Additional Mock Rooms */}
          {Array.from({ length: 5 }, (_, i) => ({
            id: `room-${i + 3}`,
            name: ['Music Lovers 🎵', 'Game Talk 🎮', 'Midnight Vibes 🌙', 'Learning Corner 📚', 'Party Zone 🎉'][i],
            theme: ['Music', 'Gaming', 'Casual', 'Education', 'Party'][i],
            background: [
              'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
              'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
            ][i],
            host: {
              id: `host-${i}`,
              username: `Host${i + 1}`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Host${i}`,
              level: 30 + i * 5,
              vipLevel: i * 2,
              xp: 50000,
              coins: 80000,
              gems: 3000,
              isOnline: true,
              followers: 5000 + i * 1000,
              following: 300,
              friends: 100,
            },
            seats: [8, 12, 16, 8, 12][i],
            occupiedSeats: [5, 9, 12, 4, 8][i],
            listeners: [20, 35, 48, 15, 28][i],
            isLocked: i === 2,
          })).map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 2) * 0.1 }}
            >
              <Link href={`/voice/${room.id}`}>
                <Card variant="premium" interactive className="cursor-pointer overflow-hidden">
                  <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                    <img
                      src={room.background}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="purple" size="md">
                        <Music className="w-4 h-4 mr-1" />
                        {room.theme}
                      </Badge>
                    </div>
                    {room.isLocked && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="red" size="md">
                          <Lock className="w-4 h-4 mr-1" />
                          Private
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={room.host.avatar}
                        size="md"
                        vipLevel={room.host.vipLevel}
                        online
                      />
                      <div>
                        <p className="text-sm font-medium">{room.host.username}</p>
                        <p className="text-xs text-gray-400">Host</p>
                      </div>
                    </div>
                    <Badge variant="emerald" size="md">
                      {room.occupiedSeats}/{room.seats} seats
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Mic className="w-4 h-4 text-purple-500" />
                      {room.occupiedSeats} speaking
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4 text-blue-500" />
                      {room.listeners} listening
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
