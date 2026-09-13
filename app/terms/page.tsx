import FeaturePage from '@/app/components/layout/FeaturePage';

export default function TermsPage() {
  return (
    <FeaturePage
      title="Terms of Service"
      subtitle="These terms define account ownership, acceptable use, purchases, moderation, and tournament participation rules for the WarHex platform."
      eyebrow="Legal"
      statusText="Legal route active"
      primaryActionHref="/auth/login"
      primaryActionLabel="Back to Login"
      secondaryActionHref="/privacy"
      secondaryActionLabel="Privacy Policy"
      cards={[
        {
          title: 'Accounts & Access',
          description: 'Users are responsible for securing their credentials, keeping profile information accurate, and complying with age and regional access requirements.',
        },
        {
          title: 'Payments & Virtual Goods',
          description: 'Recharge purchases, VIP subscriptions, and digital gift redemptions are governed by local payment terms, fraud checks, and refund policies where applicable.',
        },
        {
          title: 'Community Conduct',
          description: 'Harassment, cheating, abuse, impersonation, and prohibited content can trigger moderation action, suspensions, or permanent bans.',
        },
      ]}
    />
  );
}
