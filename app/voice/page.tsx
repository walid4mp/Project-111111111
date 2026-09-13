'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Lock, Mic, Music, Plus, Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { voiceRooms } from '../data/mockData';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RemoteImage from '../components/ui/RemoteImage';

const categories = ['All', ...Array.from(new Set(voiceRooms.map((room) => room.theme)))];

export default function VoicePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = useMemo(() => {
    return voiceRooms.filter((room) => {
      const matchesCategory = selectedCategory === 'All' || room.theme === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || `${room.name} ${room.host.username} ${room.theme}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="w-7 h-7 text-purple-500" />
              Voice Rooms
            </h1>
            <Link href="/voice/create">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Create Room
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search voice rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

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

        <div className="grid grid-cols-3 gap-3">
          {[
            { size: 8, label: 'Small' },
            { size: 12, label: 'Medium' },
            { size: 16, label: 'Large' },
          ].map((room) => (
            <Card key={room.label} variant="glass" className="text-center p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-bold mb-1">{room.label}</p>
              <p className="text-xs text-gray-400">{room.size} seats</p>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, i) => (
              <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={`/voice/${room.id}`}>
                  <Card variant="premium" interactive className="cursor-pointer overflow-hidden">
                    <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                      <RemoteImage src={room.background} alt={room.name} fill sizes="100vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="purple" size="md">
                          <Music className="w-4 h-4 mr-1" />
                          {room.theme}
                        </Badge>
                      </div>
                      {room.isLocked ? (
                        <div className="absolute top-3 right-3">
                          <Badge variant="red" size="md">
                            <Lock className="w-4 h-4 mr-1" />
                            Private
                          </Badge>
                        </div>
                      ) : null}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={room.host.avatar} size="md" vipLevel={room.host.vipLevel} online />
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
            ))
          ) : (
            <Card variant="glass" className="text-center py-12">
              <Mic className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">No rooms found</h3>
              <p className="text-gray-400">Adjust the search or category filter to see more results.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
