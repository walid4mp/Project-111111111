import { NextResponse } from 'next/server';
import { supabaseFetch, supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function POST(request: Request) {
  try {
    const body=await request.json().catch(()=>({}));
    const username=String(body.username||'').trim();
    const email=String(body.email||'').trim().toLowerCase();
    const password=String(body.password||'');
    if(!/^[A-Za-z0-9_]{3,24}$/.test(username)) return NextResponse.json({error:'Username must be 3–24 characters using letters, numbers or underscore.'},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({error:'Enter a valid email address.'},{status:400});
    if(password.length<8) return NextResponse.json({error:'Password must contain at least 8 characters.'},{status:400});

    try {
      const existing=await supabaseServiceFetch(`/rest/v1/profiles?username=eq.${encodeURIComponent(username)}&select=id&limit=1`);
      if(existing.ok && (await existing.json()).length) return NextResponse.json({error:'That username is already taken.'},{status:409});
    } catch {}

    const response=await supabaseFetch('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password,data:{username}})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) {
      const message=data.msg||data.message||data.error_description||'Unable to create account.';
      return NextResponse.json({error:message},{status:response.status});
    }
    const mobile = request.headers.get('x-warhex-mobile') === '1';
    const out=NextResponse.json(mobile
      ? {user:data.user, needsEmailConfirmation:!data.access_token, verifyPath: !data.access_token ? `/auth/verify?email=${encodeURIComponent(email)}` : '/', access_token:data.access_token ?? null, refresh_token:data.refresh_token ?? null}
      : {user:data.user,needsEmailConfirmation:!data.access_token,verifyPath: !data.access_token ? `/auth/verify?email=${encodeURIComponent(email)}` : '/'});
    if(data.access_token) {
      out.cookies.set('warhex_access_token',data.access_token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60});
      if(data.refresh_token)out.cookies.set('warhex_refresh_token',data.refresh_token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
    }
    return out;
  } catch(error) {
    const message=error instanceof Error?error.message:'Server error';
    return NextResponse.json({error:message.includes('Supabase')?`${message} Set the Supabase environment variables in Render.`:message},{status:500});
  }
}
