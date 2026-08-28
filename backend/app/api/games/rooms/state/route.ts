import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

export async function GET(request: Request) {
  const auth=await requireUser(); if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  const id=new URL(request.url).searchParams.get('roomId'); if(!id)return NextResponse.json({error:'roomId is required.'},{status:400});
  const r=await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(id)}&or=(host_id.eq.${auth.user.id},guest_id.eq.${auth.user.id})&select=*&limit=1`);
  const rows=await r.json(); if(!r.ok||!rows.length)return NextResponse.json({error:'Room not found.'},{status:404});
  return NextResponse.json({room:rows[0]});
}

export async function PATCH(request: Request) {
  const auth=await requireUser(); if(!auth)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {roomId,state,status}=await request.json();
  if(!roomId||!state)return NextResponse.json({error:'roomId and state are required.'},{status:400});
  const get=await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(roomId)}&or=(host_id.eq.${auth.user.id},guest_id.eq.${auth.user.id})&select=*&limit=1`);
  const rows=await get.json(); if(!get.ok||!rows.length)return NextResponse.json({error:'Room not found.'},{status:404});
  const room=rows[0];
  if(room.status==='finished')return NextResponse.json({error:'Match is finished.'},{status:409});
  const expectedTurn=room.host_id===auth.user.id?0:1;
  if(typeof state.turn==='number' && room.status==='playing' && state.turn===expectedTurn) {
    // The client advances the turn after its move. The submitted state must belong to the player who just moved.
  }
  const nextStatus=status||room.status;
  const r=await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(roomId)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({state,status:nextStatus,updated_at:new Date().toISOString()})});
  if(!r.ok)return NextResponse.json({error:'Unable to update game.'},{status:500});
  return NextResponse.json({room:(await r.json())[0]});
}
