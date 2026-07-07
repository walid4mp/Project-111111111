import { games, liveStreams, voiceRooms } from '@/app/data/mockData';
import FeaturePage from '@/app/components/layout/FeaturePage';

const favoriteCards = [
  ...games.slice(0, 2).map((game) => ({
    title: game.name,
    description: `${game.description} • ${game.players.toLocaleString()} active players • Min bet ${game.minBet}`,
    badge: game.category,
  })),
  ...liveStreams.slice(0, 1).map((stream) => ({
    title: stream.title,
    description: `${stream.host.username} is live with ${stream.viewers.toLocaleString()} viewers and ${stream.likes.toLocaleString()} likes.`,
    badge: 'Live',
  })),
  ...voiceRooms.slice(0, 1).map((room) => ({
    title: room.name,
    description: `${room.theme} room • ${room.listeners.toLocaleString()} listeners • ${room.seats} seats`,
    badge: room.isLocked ? 'Private' : 'Public',
  })),
];

export default function FavoritesPage() {
  return (
    <FeaturePage
      title="Favorites"
      subtitle="Pinned games, streams, and rooms are now collected in one complete destination to keep profile shortcuts useful."
      eyebrow="Quick Access"
      statusText="Saved content restored"
      primaryActionHref="/games"
      primaryActionLabel="Browse Games"
      secondaryActionHref="/profile"
      secondaryActionLabel="Back to Profile"
      cards={favoriteCards}
      quickLinks={[
        { label: 'Live', href: '/live' },
        { label: 'Voice', href: '/voice' },
        { label: 'Chat', href: '/chat' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
