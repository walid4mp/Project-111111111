import FeaturePage from '@/app/components/layout/FeaturePage';

export default function PrivacyPage() {
  return (
    <FeaturePage
      title="Privacy Policy"
      subtitle="WarHex collects only the data required to operate accounts, social features, purchases, moderation tooling, and service analytics."
      eyebrow="Legal"
      statusText="Legal route active"
      primaryActionHref="/auth/login"
      primaryActionLabel="Back to Login"
      secondaryActionHref="/terms"
      secondaryActionLabel="Terms of Service"
      cards={[
        {
          title: 'Account & Profile Data',
          description: 'Usernames, avatars, preferences, progression, and security events are processed to support authentication, personalization, and account recovery.',
        },
        {
          title: 'Messages, Rooms & Moderation',
          description: 'Chat, voice, live-room, and moderation events may be retained for abuse prevention, safety enforcement, and service diagnostics.',
        },
        {
          title: 'Purchases & Security',
          description: 'Payment metadata, subscription status, and transaction records are processed through secure providers and retained for fraud prevention and compliance.',
        },
      ]}
    />
  );
}
