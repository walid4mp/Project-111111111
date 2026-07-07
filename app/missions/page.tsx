import { missions } from '@/app/data/mockData';
import FeaturePage from '@/app/components/layout/FeaturePage';

export default function MissionsPage() {
  return (
    <FeaturePage
      title="Missions"
      subtitle="Daily and weekly objectives now have a dedicated screen so every home-page CTA lands on a complete, usable destination."
      eyebrow="Progress Hub"
      statusText="Objective tracking ready"
      primaryActionHref="/games"
      primaryActionLabel="Play Games"
      secondaryActionHref="/"
      secondaryActionLabel="Back to Home"
      cards={missions.map((mission) => ({
        title: mission.title,
        description: `${mission.description} • Progress ${mission.progress}/${mission.target} • Reward ${mission.reward.amount} ${mission.reward.type}`,
        badge: mission.completed ? 'Done' : mission.type,
      }))}
      quickLinks={[
        { label: 'Tournaments', href: '/tournaments' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'VIP', href: '/vip' },
        { label: 'Profile', href: '/profile' },
      ]}
    />
  );
}
