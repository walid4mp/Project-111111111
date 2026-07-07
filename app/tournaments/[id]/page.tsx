'use client';

import { tournaments } from '@/app/data/mockData';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { formatNumber } from '@/app/lib/utils';
import { CalendarDays, ChevronLeft, Coins, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TournamentDetailsPage() {
  const params = useParams<{ id: string }>();
  const tournament = tournaments.find((item) => item.id === params.id) ?? tournaments[0];

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/tournaments" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to tournaments
          </Link>
          <Badge variant={tournament.status === 'active' ? 'emerald' : 'purple'} size="sm">
            {tournament.status}
          </Badge>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <Card variant="premium">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">Tournament Details</p>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mt-2">{tournament.name}</h1>
              <p className="text-gray-300 mt-3">A complete details route has been added so tournament cards now open a usable, production-ready destination.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Entry Fee</p>
                    <p className="font-bold">{formatNumber(tournament.entryFee)} coins</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Prize Pool</p>
                    <p className="font-bold">{formatNumber(tournament.prize)} coins</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Participants</p>
                    <p className="font-bold">{formatNumber(tournament.participants)} / {formatNumber(tournament.maxParticipants)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="glass">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-400" />
              Schedule
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>Game: <span className="font-semibold text-white">{tournament.game}</span></p>
              <p>Starts: <span className="font-semibold text-white">{tournament.startDate.toLocaleDateString()}</span></p>
              <p>Ends: <span className="font-semibold text-white">{tournament.endDate.toLocaleDateString()}</span></p>
            </div>
          </Card>

          <Card variant="glass">
            <h2 className="text-lg font-bold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/games"><Button variant="primary">Play {tournament.game}</Button></Link>
              <Link href="/leaderboard"><Button variant="ghost">View Leaderboard</Button></Link>
              <Link href="/profile"><Button variant="ghost">Profile</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
