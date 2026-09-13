'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Coins, Crown, Flame, Trophy, Users, Zap } from 'lucide-react';
import { tournaments } from '../data/mockData';
import { formatNumber } from '../lib/utils';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RemoteImage from '../components/ui/RemoteImage';

const statuses = ['All', 'Active', 'Upcoming', 'Ended'];
const games = ['All', ...Array.from(new Set(tournaments.map((tournament) => tournament.game)))];

export default function TournamentsPage() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedGame, setSelectedGame] = useState('All');

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      const matchesStatus = selectedStatus === 'All' || tournament.status === selectedStatus.toLowerCase();
      const matchesGame = selectedGame === 'All' || tournament.game === selectedGame;
      return matchesStatus && matchesGame;
    });
  }, [selectedGame, selectedStatus]);

  const featuredTournament = filteredTournaments[0] ?? tournaments[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'emerald' as const;
      case 'upcoming':
        return 'purple' as const;
      case 'ended':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" />
              Tournaments
            </h1>
            <Link href="/profile">
              <Button variant="gold" size="sm">
                <Crown className="w-4 h-4 mr-1" />
                My Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {featuredTournament ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-48 rounded-3xl overflow-hidden">
            <RemoteImage src={featuredTournament.image} alt={featuredTournament.name} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/85 via-orange-600/75 to-red-600/75" />
            <div className="relative z-10 h-full flex flex-col justify-center px-6">
              <Badge variant="default" size="md" className="w-fit mb-2 bg-black/50">
                <Flame className="w-4 h-4 mr-1 text-orange-500" />
                {featuredTournament.status === 'active' ? 'LIVE NOW' : 'NEXT UP'}
              </Badge>
              <h2 className="text-3xl font-bold mb-2">{featuredTournament.name}</h2>
              <p className="text-white/90 mb-3">Prize Pool: {formatNumber(featuredTournament.prize)} Coins</p>
              <Link href={`/tournaments/${featuredTournament.id}`}>
                <Button variant="gold" size="lg" className="w-fit">Open Tournament</Button>
              </Link>
            </div>
          </motion.div>
        ) : null}

        <div className="grid grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{filteredTournaments.length}</p>
            <p className="text-xs text-gray-400">Visible</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-2 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(filteredTournaments.reduce((sum, item) => sum + item.participants, 0))}</p>
            <p className="text-xs text-gray-400">Players</p>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 mx-auto mb-2 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(filteredTournaments.reduce((sum, item) => sum + item.prize, 0))}</p>
            <p className="text-xs text-gray-400">Prize pool</p>
          </Card>
        </div>

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

        <div className="space-y-4">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament, i) => (
              <motion.div key={tournament.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={`/tournaments/${tournament.id}`}>
                  <Card variant={tournament.status === 'active' ? 'glow' : 'premium'} interactive className="cursor-pointer overflow-hidden">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden">
                        <RemoteImage src={tournament.image} alt={tournament.name} fill sizes="180px" className="object-cover" />
                        <div className="absolute top-2 left-2">
                          <Badge variant={getStatusColor(tournament.status)} size="sm" className="capitalize">{tournament.status}</Badge>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-2">{tournament.name}</h3>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-400">Prize:</span>
                            <span className="font-bold gradient-text-gold">{formatNumber(tournament.prize)} 💰</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Coins className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-400">Entry:</span>
                            <span className="font-bold text-blue-400">{formatNumber(tournament.entryFee)} 💎</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-emerald-500" />
                            <span className="text-gray-400">{tournament.participants}/{tournament.maxParticipants} players</span>
                          </div>
                        </div>

                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                          <div style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-green-600" />
                        </div>

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

                    <div className="mt-4">
                      <Button variant={tournament.status === 'active' ? 'gold' : 'primary'} size="lg" fullWidth>
                        <Zap className="w-5 h-5 mr-2" />
                        {tournament.status === 'active' ? 'Join Tournament' : tournament.status === 'upcoming' ? 'Register Now' : 'View Results'}
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <Card variant="glass" className="text-center py-12">
              <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">No tournaments match the selected filters</h3>
              <p className="text-gray-400">Change the game or status filter to see additional events.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
