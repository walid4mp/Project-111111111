import { currentUser, chatRooms } from '@/app/data/mockData';
import FeaturePage from '@/app/components/layout/FeaturePage';

const followingCards = chatRooms.flatMap((room) =>
  room.participants
    .filter((participant) => participant.id !== currentUser.id)
    .map((participant) => ({
      title: participant.username,
      description: `Level ${participant.level} • VIP ${participant.vipLevel} • Following ${participant.following.toLocaleString()}`,
      badge: participant.isOnline ? 'Online' : 'Offline',
    }))
);

export default function FollowingPage() {
  return (
    <FeaturePage
      title={`${currentUser.following.toLocaleString()} Following`}
      subtitle="The following list is now reachable and consistent with the rest of the social experience."
      eyebrow="Community"
      statusText="Connected players"
      primaryActionHref="/profile"
      primaryActionLabel="Back to Profile"
      secondaryActionHref="/followers"
      secondaryActionLabel="View Followers"
      cards={followingCards}
      quickLinks={[
        { label: 'Friends', href: '/friends' },
        { label: 'Chat', href: '/chat' },
        { label: 'Live', href: '/live' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
