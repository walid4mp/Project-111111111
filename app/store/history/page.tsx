import FeaturePage from '@/app/components/layout/FeaturePage';

export default function StoreHistoryPage() {
  return (
    <FeaturePage
      title="Purchase History"
      subtitle="Review gem recharges, VIP activations, bundle purchases, and related fulfillment records in one route."
      eyebrow="Store"
      statusText="History route active"
      primaryActionHref="/store"
      primaryActionLabel="Back to Store"
      secondaryActionHref="/inventory"
      secondaryActionLabel="Open Inventory"
      cards={[
        { title: 'Gem top-ups', description: 'Track recharge package purchases and bonuses awarded to the account.' },
        { title: 'VIP renewals', description: 'See active or previous subscription terms and renewal timestamps.' },
        { title: 'Bundles', description: 'Review purchased gift packs and limited-time offer claims.' },
      ]}
    />
  );
}
