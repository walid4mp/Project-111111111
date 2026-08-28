import { NextResponse } from 'next/server';

export async function GET() {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!process.env.MASTER_ADMIN_EMAIL) missing.push('MASTER_ADMIN_EMAIL');
  if (String(process.env.MASTER_ADMIN_PASSWORD || '').length < 8) missing.push('MASTER_ADMIN_PASSWORD');
  return NextResponse.json({
    ok: missing.length === 0,
    supabaseConfigured: !missing.includes('NEXT_PUBLIC_SUPABASE_URL') && !missing.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') && !missing.includes('SUPABASE_SERVICE_ROLE_KEY'),
    adminConfigured: !missing.includes('MASTER_ADMIN_EMAIL') && !missing.includes('MASTER_ADMIN_PASSWORD'),
    missing,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  }, { status: missing.length ? 503 : 200 });
}
