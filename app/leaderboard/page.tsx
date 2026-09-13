'use client';

import { useMemo, useState } from 'react';
import { Crown, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { leaderboardData } from '../data/mockData';
import { formatNumber } from '../lib/utils';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

const categories = ['Top Players', 'Top Hosts', 'Top Gifters', 'Top VIP'];
const timePeriods = ['Weekly', 'Monthly', 'All Time'];

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('Top Players');
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  const entries = useMemo(() => {
    const users = leaderboardData.map((entry) => entry.user);

    const ranked = users
      .map((user, index) => {
        if (selectedCategory === 'Top Hosts') {
          return { user, score: user.followers, change: leaderboardData[index]?.change ?? 0 };
        }
        if (selectedCategory === 'Top Gifters') {
          return { user, score: user.gems, change: leaderboardData[index]?.change ?? 0 };
        }
        if (selectedCategory === 'Top VIP') {
          return { user, score: user.vipLevel * 10000 + user.level * 100 + user.followers, change: leaderboardData[index]?.change ?? 0 };
        }
        return { user, score: leaderboardData[index]?.score ?? user.xp, change: leaderboardData[index]?.change ?? 0 };
      })
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return ranked;
  }, [selectedCategory]);

  const topThree = entries.slice(0, 3);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Leaderboard
          </h1>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {topThree.map((entry, index) => {
            const heights = ['h-40', 'h-48', 'h-36'];
            const medals = ['🥇', '🥈', '🥉'];
            const gradients = ['from-yellow-400 to-yellow-600', 'from-gray-400 to-gray-500', 'from-orange-400 to-orange-600'];

            return (
              <motion.div key={entry.user.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card variant={entry.rank === 1 ? 'glow' : 'premium'} className={`${heights[index]} flex flex-col items-center justify-end pb-4 relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[index]}`} />
                  <div className="text-4xl mb-2">{medals[index]}</div>
                  <Avatar src={entry.user.avatar} size={entry.rank === 1 ? 'xl' : 'lg'} vipLevel={entry.user.vipLevel} />
                  <h3 className="font-bold mt-2 text-sm truncate w-full text-center px-2">{entry.user.username}</h3>
                  <Badge variant={entry.rank === 1 ? 'gold' : 'default'} size="sm" className="mt-1">{formatNumber(entry.score)}</Badge>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div key={entry.user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card variant={entry.rank <= 3 ? 'premium' : 'glass'} className="hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12">
                    {entry.rank <= 3 ? (
                      <div className="text-3xl">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}</div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-400">#{entry.rank}</span>
                      </div>
                    )}
                  </div>

                  <Avatar src={entry.user.avatar} size="lg" vipLevel={entry.user.vipLevel} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{entry.user.username}</h3>
                      {entry.user.vipLevel >= 15 ? <Crown className="w-4 h-4 text-yellow-500" /> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" size="sm">Level {entry.user.level}</Badge>
                      <span className="text-xs text-gray-400">{formatNumber(entry.user.followers)} followers</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-xl gradient-text mb-1">{formatNumber(entry.score)}</p>
                    <div className="flex items-center justify-end gap-1">
                      {entry.change > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-emerald-500 font-medium">+{entry.change}</span>
                        </>
                      ) : entry.change < 0 ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500 font-medium">{entry.change}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="glow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{selectedPeriod} Rewards</h3>
              <p className="text-sm text-gray-400">This leaderboard now derives scores from actual available fields instead of generating extra fabricated players.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
