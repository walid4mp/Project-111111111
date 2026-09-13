import FeaturePage from '@/app/components/layout/FeaturePage';

export default function InventoryPage() {
  return (
    <FeaturePage
      title="Inventory"
      subtitle="Gift packs, collectible cosmetics, and consumable rewards now have a complete destination instead of a broken profile shortcut."
      eyebrow="Player Assets"
      statusText="Inventory route live"
      primaryActionHref="/store"
      primaryActionLabel="Open Store"
      secondaryActionHref="/profile"
      secondaryActionLabel="Back to Profile"
      cards={[
        { title: 'Gift Packs', description: 'Owned bundles, promo packs, and claimable reward items can be connected without altering the visual style.', badge: '48 items' },
        { title: 'Cosmetics', description: 'Avatar frames, profile flairs, and room themes stay grouped in one clean management surface.' },
        { title: 'Boosters', description: 'Timed XP or coin multipliers can be surfaced here once gameplay services are connected.' },
        { title: 'Redemption History', description: 'Recent claims and usage logs fit naturally into the same premium card layout.' },
      ]}
      quickLinks={[
        { label: 'Gifts', href: '/gifts' },
        { label: 'Store', href: '/store' },
        { label: 'VIP', href: '/vip' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
