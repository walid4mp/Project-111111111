import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Coins, Play, Trophy, Users } from 'lucide-react';
import { games } from '@/app/data/mockData';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import RemoteImage from '@/app/components/ui/RemoteImage';
import { formatNumber } from '@/app/lib/utils';

export function generateStaticParams() {
  return games.map((game) => ({ id: game.id }));
}

export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = games.find((item) => item.id === id);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="relative h-72 rounded-3xl overflow-hidden">
          <RemoteImage src={game.image} alt={game.name} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <Badge variant="purple" size="md" className="w-fit mb-3">
              {game.category}
            </Badge>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{game.icon}</span>
              <h1 className="text-3xl font-bold">{game.name}</h1>
            </div>
            <p className="text-white/80 max-w-2xl">{game.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-5">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatNumber(game.players)}</p>
            <p className="text-sm text-gray-400">Active players</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{game.minBet ?? 0}</p>
            <p className="text-sm text-gray-400">Minimum bet</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{game.maxPlayers}</p>
            <p className="text-sm text-gray-400">Max players</p>
          </Card>
        </div>

        <Card variant="premium">
          <h2 className="text-xl font-bold mb-3">How to join</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-300">
            <div className="rounded-2xl bg-white/5 p-4">1. Select your preferred mode from the games lobby.</div>
            <div className="rounded-2xl bg-white/5 p-4">2. Review the minimum entry requirement before matching.</div>
            <div className="rounded-2xl bg-white/5 p-4">3. Queue with friends or enter tournaments from the tournament hub.</div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/games">
            <Button variant="ghost">Back to Games</Button>
          </Link>
          <Link href="/tournaments">
            <Button variant="gold">
              <Trophy className="w-4 h-4 mr-2" />
              View Tournaments
            </Button>
          </Link>
          <Link href={`/games/${game.id === 'chess' ? 'chess' : game.id === 'ludo' ? 'ludo' : game.id === 'domino' ? 'domino' : game.id}`}><Button variant="primary"><Play className="w-4 h-4 mr-2" />Play {game.name}</Button></Link>
        </div>
      </div>
    </div>
  );
}
