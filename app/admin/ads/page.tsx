import { redirect } from 'next/navigation';
import { requireUser } from '@/app/lib/server/supabase';
import { isAdmin } from '@/app/lib/server/admin';
import AdminAdsClient from './AdminAdsClient';

export default async function AdminAdsPage() {
  const auth = await requireUser();
  if (!auth) redirect('/auth/login?next=%2Fadmin%2Fads');
  if (!isAdmin(auth.user)) redirect('/');
  return <AdminAdsClient />;
}
