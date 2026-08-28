import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/app/lib/server/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const refreshToken = String(body.refresh_token || '');
    if (!refreshToken) return NextResponse.json({ error: 'Refresh token is required.' }, { status: 400 });
    const response = await supabaseFetch('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.access_token) {
      return NextResponse.json({ error: data.error_description || data.msg || 'Session expired.' }, { status: 401 });
    }
    return NextResponse.json({ access_token: data.access_token, refresh_token: data.refresh_token || refreshToken });
  } catch {
    return NextResponse.json({ error: 'Unable to refresh session.' }, { status: 500 });
  }
}
