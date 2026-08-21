import { NextResponse } from 'next/server';
export async function GET(){
  return NextResponse.json({
    ok:true,
    supabaseConfigured:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY&&process.env.SUPABASE_SERVICE_ROLE_KEY),
    adminConfigured:Boolean(process.env.ADMIN_EMAILS||process.env.ADMIN_USER_IDS),
    siteUrl:process.env.NEXT_PUBLIC_SITE_URL||null
  });
}
