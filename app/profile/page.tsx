'use client';

import { achievements, currentUser } from '../data/mockData';
import { formatNumber } from '../lib/utils';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import {
  Award,
  ChevronRight,
  Coins,
  Crown,
  Edit,
  Gift,
  Heart,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const progressToNextLevel = 75;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card variant="premium">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block mb-4"
            >
              <Avatar
                src={currentUser.avatar}
                size="2xl"
                vipLevel={currentUser.vipLevel}
                online
              />
            </motion.div>
            <h2 className="text-2xl font-bold mb-1">{currentUser.username}</h2>
            <p className="text-gray-400 text-sm mb-4">{currentUser.bio}</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant="purple" size="md">
                <Star className="w-4 h-4 mr-1" />
                Level {currentUser.level}
              </Badge>
              <Badge variant="vip" size="md">
                <Crown className="w-4 h-4 mr-1" />
                VIP {currentUser.vipLevel}
              </Badge>
            </div>
            <Button variant="primary" size="md" fullWidth>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Level Progress */}
        <Card variant="glass">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Level {currentUser.level}</span>
            <span className="text-sm text-blue-400">{progressToNextLevel}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{formatNumber(currentUser.xp)} XP</span>
            <span className="text-gray-400">Next: {formatNumber(100000)} XP</span>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-2 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <p className="text-xl font-bold">{formatNumber(currentUser.coins)}</p>
            <p className="text-xs text-gray-400">Coins</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-2 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-xl font-bold">{formatNumber(currentUser.gems)}</p>
            <p className="text-xs text-gray-400">Gems</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-xl font-bold">{formatNumber(1250)}</p>
            <p className="text-xs text-gray-400">Wins</p>
          </Card>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/followers">
            <Card variant="glass" className="text-center p-4 cursor-pointer hover:bg-white/10 transition-colors">
              <p className="text-2xl font-bold gradient-text">{formatNumber(currentUser.followers)}</p>
              <p className="text-xs text-gray-400">Followers</p>
            </Card>
          </Link>
          <Link href="/following">
            <Card variant="glass" className="text-center p-4 cursor-pointer hover:bg-white/10 transition-colors">
              <p className="text-2xl font-bold gradient-text">{formatNumber(currentUser.following)}</p>
              <p className="text-xs text-gray-400">Following</p>
            </Card>
          </Link>
          <Link href="/friends">
            <Card variant="glass" className="text-center p-4 cursor-pointer hover:bg-white/10 transition-colors">
              <p className="text-2xl font-bold gradient-text">{formatNumber(currentUser.friends)}</p>
              <p className="text-xs text-gray-400">Friends</p>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, label: 'Friends', href: '/friends', count: currentUser.friends },
            { icon: Gift, label: 'Inventory', href: '/inventory', count: 48 },
            { icon: Trophy, label: 'Achievements', href: '/achievements', count: 23 },
            { icon: Heart, label: 'Favorites', href: '/favorites', count: 12 },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <Card variant="premium" interactive className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold">{action.label}</h3>
                    <p className="text-sm text-gray-400">{action.count} items</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Achievements
            </h2>
            <Link href="/achievements">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {achievements.slice(0, 4).map((achievement) => (
              <Card
                key={achievement.id}
                variant={achievement.unlocked ? 'premium' : 'glass'}
                className={achievement.unlocked ? '' : 'opacity-50'}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{achievement.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <Badge variant="gold" size="sm">
                      <Trophy className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  ) : (
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        {achievement.progress}/{achievement.target}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Statistics */}
        <Card variant="premium">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            Game Statistics
          </h3>
          <div className="space-y-3">
            {[
              { game: 'Ludo King', wins: 450, matches: 680, winRate: 66 },
              { game: 'Chess', wins: 320, matches: 520, winRate: 62 },
              { game: '8 Ball Pool', wins: 280, matches: 450, winRate: 62 },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <h4 className="font-bold">{stat.game}</h4>
                  <p className="text-xs text-gray-400">
                    {stat.wins} wins • {stat.matches} matches
                  </p>
                </div>
                <Badge variant={stat.winRate >= 65 ? 'gold' : 'emerald'} size="md">
                  {stat.winRate}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* VIP Status */}
        <Card variant="glow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl vip-badge flex items-center justify-center flex-shrink-0">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">VIP Level {currentUser.vipLevel}</h3>
              <p className="text-sm text-gray-400">Exclusive member since 2024</p>
            </div>
            <Link href="/vip">
              <Button variant="gold" size="md">
                Upgrade
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
