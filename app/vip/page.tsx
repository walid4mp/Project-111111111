import { redirect } from 'next/navigation';
import FeaturePage from '@/app/components/layout/FeaturePage';
import { requireUser } from '@/app/lib/server/supabase';
import { isAdmin } from '@/app/lib/server/admin';

export default async function VipPage() {
  const auth = await requireUser();
  if (!auth) redirect('/auth/login?next=%2Fvip');
  if (!isAdmin(auth.user)) redirect('/');
  return <FeaturePage
    title="WarHex VIP Admin"
    subtitle="Private administration area for WarHex operators. Membership configuration, premium cosmetics, rewards and monetization controls belong here."
    eyebrow="ADMIN ONLY"
    statusText={`Administrator: ${auth.user.email ?? auth.user.id}`}
    primaryActionHref="/admin/ads"
    primaryActionLabel="Manage Ads"
    secondaryActionHref="/"
    secondaryActionLabel="Back to Home"
    cards={[
      { title:'VIP Configuration', description:'Private controls for VIP tiers, benefits, cosmetics and rewards.', badge:'ADMIN' },
      { title:'Monetization', description:'Manage sponsor placements and advertising campaigns from the admin console.', badge:'REVENUE' },
      { title:'Safety', description:'This route is protected server-side using ADMIN_EMAILS or ADMIN_USER_IDS. Regular players cannot access it.' },
      { title:'Operations', description:'Use this area for future moderation, tournaments and economy controls.' },
    ]}
    quickLinks={[
      { label:'Ads Manager', href:'/admin/ads' },
      { label:'Store', href:'/store' },
      { label:'Home', href:'/' },
    ]}
  />;
}
