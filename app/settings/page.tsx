import FeaturePage from '@/app/components/layout/FeaturePage';

export default function SettingsPage() {
  return (
    <FeaturePage
      title="Settings"
      subtitle="Account, privacy, notifications, and gameplay preferences are organized here with a production-ready shell that matches the existing visual system."
      primaryActionHref="/profile"
      primaryActionLabel="Back to Profile"
      secondaryActionHref="/"
      secondaryActionLabel="Go to Home"
      cards={[
        { title: 'Account & Security', description: 'Email, password, connected providers, and trusted devices can be wired to backend services without changing the UI.', badge: 'Secure' },
        { title: 'Notifications', description: 'Push, tournament reminders, live invites, and social updates are grouped in a consistent settings experience.', badge: 'Realtime' },
        { title: 'Gameplay Preferences', description: 'Sound, language, haptics, and performance preferences are ready for persistence once API endpoints are connected.' },
        { title: 'Privacy Controls', description: 'Profile visibility, message permissions, and activity status fit the same dark premium design language.' },
      ]}
      quickLinks={[
        { label: 'Profile', href: '/profile' },
        { label: 'VIP Center', href: '/vip' },
        { label: 'Friends', href: '/friends' },
        { label: 'Privacy Policy', href: '/privacy' },
      ]}
    />
  );
}
