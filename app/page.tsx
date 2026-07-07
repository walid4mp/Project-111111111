'use client';

import { currentUser, games, leaderboardData, liveStreams, missions, voiceRooms } from './data/mockData';
import { formatNumber } from './lib/utils';
import Avatar from './components/ui/Avatar';
import Badge from './components/ui/Badge';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import { motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  Coins,
  Crown,
  Flame,
  Gamepad2,
  Gift,
  Mail,
  Mic,
  Play,
  Radio,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={currentUser.avatar}
                size="lg"
                vipLevel={currentUser.vipLevel}
                online
              />
              <div>
                <h2 className="font-bold text-lg">{currentUser.username}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="purple" size="sm">
                    Level {currentUser.level}
                  </Badge>
                  <span className="text-gray-400">
                    {formatNumber(currentUser.xp)} XP
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-xl relative">
                <Mail className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link href="/settings">
                <button className="p-2 hover:bg-white/10 rounded-xl">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Currency Display */}
        <Card variant="glass" className="flex items-center justify-around p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Coins</p>
              <p className="font-bold text-lg">{formatNumber(currentUser.coins)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Gems</p>
              <p className="font-bold text-lg">{formatNumber(currentUser.gems)}</p>
            </div>
          </div>
          <Link href="/store">
            <Button variant="gold" size="sm">
              <span className="text-sm">Recharge</span>
            </Button>
          </Link>
        </Card>

        {/* Hero Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center px-8">
            <Badge variant="gold" size="md" className="w-fit mb-2">
              <Crown className="w-4 h-4 mr-1" />
              VIP EXCLUSIVE
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Join VIP Club</h2>
            <p className="text-white/90 mb-4">Get exclusive rewards & benefits</p>
            <Link href="/vip">
              <Button variant="gold" size="md" className="w-fit">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Play, label: 'Quick Play', href: '/games', gradient: 'from-blue-500 to-blue-600' },
            { icon: Radio, label: 'Live', href: '/live', gradient: 'from-red-500 to-pink-600' },
            { icon: Mic, label: 'Voice', href: '/voice', gradient: 'from-purple-500 to-purple-600' },
            { icon: Gift, label: 'Store', href: '/store', gradient: 'from-yellow-500 to-orange-500' },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-effect rounded-2xl p-4 text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} mx-auto mb-2 flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Daily Rewards & Lucky Wheel */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="premium" interactive className="cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-3">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-1">Daily Reward</h3>
              <p className="text-xs text-gray-400">Claim your bonus</p>
              <Badge variant="gold" size="sm" className="mt-2">
                Day 7/7
              </Badge>
            </div>
          </Card>
          <Card variant="premium" interactive className="cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3 animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-1">Lucky Wheel</h3>
              <p className="text-xs text-gray-400">Spin to win</p>
              <Badge variant="purple" size="sm" className="mt-2">
                3 Spins
              </Badge>
            </div>
          </Card>
        </div>

        {/* Featured Games */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-blue-500" />
              Featured Games
            </h2>
            <Link href="/games">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {games.slice(0, 4).map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <Card variant="premium" interactive className="cursor-pointer">
                  <div className="aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{game.name}</h3>
                    <span className="text-2xl">{game.icon}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Users className="w-3 h-3" />
                      {formatNumber(game.players)}
                    </span>
                    <Badge variant="emerald" size="sm">
                      {game.category}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Streams */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500" />
              Live Now
            </h2>
            <Link href="/live">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {liveStreams.map((stream) => (
              <Link key={stream.id} href={`/live/${stream.id}`}>
                <Card variant="premium" interactive className="cursor-pointer">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden">
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        variant="red"
                        size="sm"
                        className="absolute top-2 left-2 animate-pulse"
                      >
                        <div className="w-2 h-2 bg-white rounded-full mr-1" />
                        LIVE
                      </Badge>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(stream.viewers)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar
                          src={stream.host.avatar}
                          size="sm"
                          vipLevel={stream.host.vipLevel}
                          online
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{stream.title}</h3>
                          <p className="text-sm text-gray-400">{stream.host.username}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stream.tags.map((tag, i) => (
                          <Badge key={i} variant="default" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Voice Rooms */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="w-6 h-6 text-purple-500" />
              Voice Rooms
            </h2>
            <Link href="/voice">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {voiceRooms.map((room) => (
              <Link key={room.id} href={`/voice/${room.id}`}>
                <Card variant="premium" interactive className="cursor-pointer">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                      <img
                        src={room.background}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate mb-1">{room.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar src={room.host.avatar} size="xs" vipLevel={room.host.vipLevel} />
                        <span className="text-sm text-gray-400">{room.host.username}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.occupiedSeats}/{room.seats}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          {room.listeners} listening
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily Missions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Daily Missions
            </h2>
            <Link href="/missions">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {missions.map((mission) => (
              <Card key={mission.id} variant="glass">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{mission.title}</h3>
                  <Badge variant="gold" size="sm">
                    +{mission.reward.amount}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Progress: {mission.progress}/{mission.target}
                    </span>
                    <span className="text-blue-400">
                      {Math.round((mission.progress / mission.target) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Leaderboard
            </h2>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <Card variant="premium">
            {leaderboardData.slice(0, 5).map((entry) => (
              <div
                key={entry.user.id}
                className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors"
              >
                <div className="flex items-center justify-center w-8">
                  {entry.rank <= 3 ? (
                    <div className={`text-2xl ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-400' : 'text-orange-600'}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  ) : (
                    <span className="text-gray-400 font-bold">{entry.rank}</span>
                  )}
                </div>
                <Avatar
                  src={entry.user.avatar}
                  size="md"
                  vipLevel={entry.user.vipLevel}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold truncate">{entry.user.username}</h4>
                  <p className="text-sm text-gray-400">Level {entry.user.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold gradient-text">{formatNumber(entry.score)}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {entry.change > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">+{entry.change}</span>
                      </>
                    ) : entry.change < 0 ? (
                      <>
                        <Flame className="w-3 h-3 text-red-500" />
                        <span className="text-red-500">{entry.change}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Events Banner */}
        <Link href="/tournaments">
          <Card variant="glow" className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Weekly Tournament</h3>
                <p className="text-sm text-gray-400">Join now for a chance to win 100K coins!</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
