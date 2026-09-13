import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart, Radio, Users, Video } from 'lucide-react';
import { liveStreams } from '@/app/data/mockData';
import Avatar from '@/app/components/ui/Avatar';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import RemoteImage from '@/app/components/ui/RemoteImage';
import { formatNumber } from '@/app/lib/utils';

export function generateStaticParams() {
  return liveStreams.map((stream) => ({ id: stream.id }));
}

export default async function LiveDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stream = liveStreams.find((item) => item.id === id);

  if (!stream) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="relative h-80 rounded-3xl overflow-hidden">
          <RemoteImage src={stream.thumbnail} alt={stream.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="red" size="md">LIVE</Badge>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={stream.host.avatar} size="lg" vipLevel={stream.host.vipLevel} online />
              <div>
                <h1 className="text-3xl font-bold">{stream.title}</h1>
                <p className="text-white/80">Hosted by {stream.host.username}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {stream.tags.map((tag) => (
                <Badge key={tag} variant="purple" size="sm">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-5">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatNumber(stream.viewers)}</p>
            <p className="text-sm text-gray-400">Viewers</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatNumber(stream.likes)}</p>
            <p className="text-sm text-gray-400">Likes</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <Radio className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stream.category}</p>
            <p className="text-sm text-gray-400">Category</p>
          </Card>
        </div>

        <Card variant="premium">
          <h2 className="text-xl font-bold mb-3">Stream overview</h2>
          <p className="text-gray-300 leading-7">
            This route now resolves correctly from live discovery surfaces and presents the selected stream with host context,
            engagement metrics, and in-app navigation.
          </p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/live">
            <Button variant="ghost">Back to Live</Button>
          </Link>
          <Link href="/chat">
            <Button variant="primary">
              <Video className="w-4 h-4 mr-2" />
              Open Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
