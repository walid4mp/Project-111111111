import { NextResponse } from 'next/server';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){
  try{
    const r=await supabaseServiceFetch('/rest/v1/game_rooms?select=id,status,guest_id&order=created_at.desc&limit=500');
    if(!r.ok)return NextResponse.json({rooms:0,playing:0,waiting:0});
    const rows=await r.json();
    return NextResponse.json({rooms:rows.length,playing:rows.filter((x:any)=>x.status==='playing').length,waiting:rows.filter((x:any)=>x.status==='waiting').length});
  }catch{return NextResponse.json({rooms:0,playing:0,waiting:0})}
}
