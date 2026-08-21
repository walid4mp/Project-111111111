'use client';

import { useWarHexData } from '@/app/data/runtime';
import { formatNumber } from '../lib/utils';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Coins,
  Crown,
  Flame,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { type ComponentProps, useState } from 'react';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const statuses = ['All', 'Active', 'Upcoming', 'Ended'];
const games = ['All', 'Ludo', 'Chess', 'Domino', 'Pool'];

export default function TournamentsPage() {
  const { tournaments } = useWarHexData();
  const activeTournaments = tournaments.filter((tournament) => tournament.status === 'active');
  const totalPlayers = tournaments.reduce((sum, tournament) => sum + tournament.participants, 0);
  const totalPrize = tournaments.reduce((sum, tournament) => sum + tournament.prize, 0);
  const featuredTournament = activeTournaments[0] ?? tournaments[0] ?? null;
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedGame, setSelectedGame] = useState('All');

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case 'active':
        return 'emerald';
      case 'upcoming':
        return 'purple';
      case 'ended':
        return 'default';
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
              <Trophy className="w-7 h-7 text-yellow-500" />
              Tournaments
            </h1>
            <Button variant="gold" size="sm">
              <Crown className="w-4 h-4 mr-1" />
              My Tournaments
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Featured Tournament Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600">
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center px-6">
            {featuredTournament ? <>
              <Badge variant="default" size="md" className="w-fit mb-2 bg-black/50">
                <Flame className="w-4 h-4 mr-1 text-orange-500" />
                {featuredTournament.status === 'active' ? 'LIVE NOW' : 'UPCOMING'}
              </Badge>
              <h2 className="text-3xl font-bold mb-2">{featuredTournament.name}</h2>
              <p className="text-white/90 mb-3">Prize Pool: {formatNumber(featuredTournament.prize)} Coins</p>
              <Link href={`/tournaments/${featuredTournament.id}`}>
                <Button variant="gold" size="lg" className="w-fit">View Tournament</Button>
              </Link>
            </> : <>
              <Badge variant="default" size="md" className="w-fit mb-2 bg-black/50">TOURNAMENTS</Badge>
              <h2 className="text-3xl font-bold mb-2">No tournaments yet</h2>
              <p className="text-white/90">Tournament schedules will appear here when an admin publishes them.</p>
            </>}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(activeTournaments.length)}</p>
            <p className="text-xs text-gray-400">Active</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-2 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(totalPlayers)}</p>
            <p className="text-xs text-gray-400">Players</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 mx-auto mb-2 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(totalPrize)}</p>
            <p className="text-xs text-gray-400">Total Prize</p>
          </Card>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Game Filter */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {games.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedGame === game
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {tournaments.map((tournament, i) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/tournaments/${tournament.id}`}>
                <Card
                  variant={tournament.status === 'active' ? 'glow' : 'premium'}
                  interactive
                  className="cursor-pointer overflow-hidden"
                >
                  <div className="flex gap-4">
                    {/* Tournament Image */}
                    <div className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden">
                      <img
                        src={tournament.image}
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant={getStatusColor(tournament.status)} size="sm" className="capitalize">
                          {tournament.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Tournament Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2">{tournament.name}</h3>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-400">Prize:</span>
                          <span className="font-bold gradient-text-gold">
                            {formatNumber(tournament.prize)} 💰
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Coins className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-400">Entry:</span>
                          <span className="font-bold text-blue-400">
                            {formatNumber(tournament.entryFee)} 💎
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-400">
                            {tournament.participants}/{tournament.maxParticipants} players
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div
                          style={{
                            width: `${(tournament.participants / tournament.maxParticipants) * 100}%`,
                          }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                        />
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tournament.startDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(tournament.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <div className="mt-4">
                    <Button
                      variant={tournament.status === 'active' ? 'gold' : 'primary'}
                      size="lg"
                      fullWidth
                    >
                      {tournament.status === 'active' ? (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Join Tournament
                        </>
                      ) : tournament.status === 'upcoming' ? (
                        <>
                          <Star className="w-5 h-5 mr-2" />
                          Register Now
                        </>
                      ) : (
                        'View Results'
                      )}
                    </Button>
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
