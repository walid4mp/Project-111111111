import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lock, Mic, Users } from 'lucide-react';
import { voiceRooms } from '@/app/data/mockData';
import Avatar from '@/app/components/ui/Avatar';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import RemoteImage from '@/app/components/ui/RemoteImage';

export function generateStaticParams() {
  return voiceRooms.map((room) => ({ id: room.id }));
}

export default async function VoiceRoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = voiceRooms.find((item) => item.id === id);

  if (!room) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="relative h-72 rounded-3xl overflow-hidden">
          <RemoteImage src={room.background} alt={room.name} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="purple" size="md">{room.theme}</Badge>
              {room.isLocked ? (
                <Badge variant="red" size="md">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
            <div className="flex items-center gap-3">
              <Avatar src={room.host.avatar} size="lg" vipLevel={room.host.vipLevel} online />
              <div>
                <p className="font-semibold">{room.host.username}</p>
                <p className="text-sm text-white/80">Room host</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-5">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{room.occupiedSeats}/{room.seats}</p>
            <p className="text-sm text-gray-400">Speaker seats</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <Mic className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{room.occupiedSeats}</p>
            <p className="text-sm text-gray-400">Speakers</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{room.listeners}</p>
            <p className="text-sm text-gray-400">Listeners</p>
          </Card>
        </div>

        <Card variant="premium">
          <h2 className="text-xl font-bold mb-3">Room details</h2>
          <p className="text-gray-300 leading-7">
            This room detail page resolves links from the voice-room discovery feed and displays the room state without falling back to a dead route.
          </p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/voice">
            <Button variant="ghost">Back to Voice Rooms</Button>
          </Link>
          <Button variant="primary">
            <Mic className="w-4 h-4 mr-2" />
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}
