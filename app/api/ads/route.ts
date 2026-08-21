import { NextResponse } from 'next/server';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function GET() {
  try {
    const response = await supabaseServiceFetch(
      '/rest/v1/ads?active=eq.true&select=id,title,body,image_url,click_url,placement,priority&order=priority.desc,created_at.desc&limit=20'
    );
    if (!response.ok) return NextResponse.json({ ads: [] });
    const ads = await response.json();
    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json({ ads: [] });
  }
}
