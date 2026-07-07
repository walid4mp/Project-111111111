import { currentUser, leaderboardData } from '@/app/data/mockData';
import FeaturePage from '@/app/components/layout/FeaturePage';

const followerCards = leaderboardData.map((entry) => ({
  title: entry.user.username,
  description: `Level ${entry.user.level} • VIP ${entry.user.vipLevel} • Followers ${entry.user.followers.toLocaleString()}`,
  badge: entry.user.isOnline ? 'Online' : 'Offline',
}));

export default function FollowersPage() {
  return (
    <FeaturePage
      title={`${currentUser.followers.toLocaleString()} Followers`}
      subtitle="Follower traffic now opens into a complete screen with recognizable player summaries and clear return paths."
      eyebrow="Community"
      statusText="Social route fixed"
      primaryActionHref="/profile"
      primaryActionLabel="Back to Profile"
      secondaryActionHref="/following"
      secondaryActionLabel="View Following"
      cards={followerCards}
      quickLinks={[
        { label: 'Friends', href: '/friends' },
        { label: 'Chat', href: '/chat' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
