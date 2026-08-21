import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/app/lib/server/supabase';

export async function POST(request: Request) {
  try {
    const {email,password}=await request.json();
    if(!email||!password)return NextResponse.json({error:'Email and password are required.'},{status:400});
    const response=await supabaseFetch('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:String(email).trim().toLowerCase(),password})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)return NextResponse.json({error:data.error_description||data.msg||'Invalid email or password.'},{status:401});
    if(typeof data.access_token!=='string'||!data.access_token)return NextResponse.json({error:'Authentication server returned no access token.'},{status:502});
    if(typeof data.refresh_token!=='string'||!data.refresh_token)return NextResponse.json({error:'Authentication server returned no refresh token.'},{status:502});
    const out=NextResponse.json({user:data.user});
    out.cookies.set('warhex_access_token',data.access_token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60});
    out.cookies.set('warhex_refresh_token',data.refresh_token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
    return out;
  } catch(error) {
    const message=error instanceof Error?error.message:'Server error';
    return NextResponse.json({error:message.includes('Supabase')?`${message} Set the Supabase environment variables in Render.`:message},{status:500});
  }
}
