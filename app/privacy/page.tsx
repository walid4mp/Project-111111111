import FeaturePage from '@/app/components/layout/FeaturePage';

export default function PrivacyPage() {
  return (
    <FeaturePage
      title="Privacy Policy"
      subtitle="Authentication and legal journeys now terminate in complete destination pages instead of empty anchors."
      eyebrow="Legal"
      statusText="Route connected"
      primaryActionHref="/auth/login"
      primaryActionLabel="Back to Login"
      secondaryActionHref="/terms"
      secondaryActionLabel="Terms of Service"
      cards={[
        { title: 'Profile Data', description: 'Username, avatar, preferences, and progression fields can be documented cleanly here.' },
        { title: 'Payments & Security', description: 'Store purchases, membership status, and payment flows can be disclosed in a user-friendly structure.' },
        { title: 'Messaging & Voice', description: 'Chat, live, and voice-room privacy behavior has a routed home within the app.' },
      ]}
    />
  );
}
