import FeaturePage from '@/app/components/layout/FeaturePage';

export default function EditProfilePage() {
  return (
    <FeaturePage
      title="Edit Profile"
      subtitle="Update display name, avatar, bio, privacy preferences, and linked social identities from one dedicated route."
      eyebrow="Profile"
      statusText="Editor route active"
      primaryActionHref="/profile"
      primaryActionLabel="Back to Profile"
      secondaryActionHref="/settings"
      secondaryActionLabel="Open Settings"
      cards={[
        { title: 'Public identity', description: 'Control display name, avatar, headline, and profile accent styling.' },
        { title: 'Privacy', description: 'Adjust discoverability, online status, and direct-message permissions.' },
        { title: 'Connections', description: 'Manage linked providers and social account visibility.' },
      ]}
    />
  );
}
