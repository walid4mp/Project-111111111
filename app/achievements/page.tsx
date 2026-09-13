import { achievements } from '@/app/data/mockData';
import FeaturePage from '@/app/components/layout/FeaturePage';

export default function AchievementsPage() {
  return (
    <FeaturePage
      title="Achievements"
      subtitle="The achievement showcase is now a fully navigable destination instead of a dead-end link, while keeping the same premium app identity."
      eyebrow="Player Milestones"
      statusText="Collection screen online"
      primaryActionHref="/profile"
      primaryActionLabel="Back to Profile"
      secondaryActionHref="/games"
      secondaryActionLabel="Find New Challenges"
      cards={achievements.map((achievement) => ({
        title: `${achievement.icon} ${achievement.name}`,
        description: `${achievement.description} • Progress ${achievement.progress}/${achievement.target} • Reward ${achievement.reward.amount} ${achievement.reward.type}`,
        badge: achievement.unlocked ? 'Unlocked' : 'In Progress',
      }))}
      quickLinks={[
        { label: 'Missions', href: '/missions' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Friends', href: '/friends' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
