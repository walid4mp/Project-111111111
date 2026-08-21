import FeaturePage from '@/app/components/layout/FeaturePage';

export default function TermsPage() {
  return (
    <FeaturePage
      title="Terms of Service"
      subtitle="This placeholder legal surface keeps authentication links functional and gives the project a complete navigation flow for production handoff."
      eyebrow="Legal"
      statusText="Route connected"
      primaryActionHref="/auth/login"
      primaryActionLabel="Back to Login"
      secondaryActionHref="/privacy"
      secondaryActionLabel="Privacy Policy"
      cards={[
        { title: 'Account Usage', description: 'Player conduct, account ownership, and fair-play expectations can be integrated here without changing the visual theme.' },
        { title: 'Payments & Rewards', description: 'Gem packs, VIP subscriptions, and tournament payouts have a dedicated legal destination.' },
        { title: 'Community Rules', description: 'Streaming, chat, gifting, and voice room moderation standards fit the same premium layout.' },
      ]}
    />
  );
}
