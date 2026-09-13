import { currentUser } from '@/app/data/mockData';
import FeaturePage from '@/app/components/layout/FeaturePage';

export default function VipPage() {
  return (
    <FeaturePage
      title={`VIP Level ${currentUser.vipLevel}`}
      subtitle="Exclusive identity, premium frames, bonus rewards, and member perks are presented in a complete flow that preserves the existing luxury styling."
      eyebrow="VIP Lounge"
      statusText="Membership experience online"
      primaryActionHref="/store"
      primaryActionLabel="View VIP Offers"
      secondaryActionHref="/profile"
      secondaryActionLabel="Back to Profile"
      cards={[
        { title: 'Current Tier Benefits', description: 'Daily bonus gems, premium badge visibility, faster support queue, and exclusive room access are highlighted in a polished summary.', badge: 'Active' },
        { title: 'Upgrade Progress', description: 'The next VIP tier can hook directly into live XP, spending, or mission systems while keeping the same premium presentation.' },
        { title: 'Exclusive Cosmetics', description: 'Avatar frames, entrance effects, and chat decorations remain grouped in one upgrade-friendly hub.', badge: 'Cosmetics' },
        { title: 'Member Rewards', description: 'Seasonal bundles and event claims can be connected without altering the current artistic direction.' },
      ]}
      quickLinks={[
        { label: 'Store', href: '/store' },
        { label: 'Missions', href: '/missions' },
        { label: 'Achievements', href: '/achievements' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
