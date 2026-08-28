import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('live_control');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/live_rooms?select=*&order=created_at.desc&limit=500');return NextResponse.json({rooms:r.ok?await r.json():[]});}
export async function POST(req:Request){const a=await requireAdminPermission('live_control');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const b=await req.json();if(!b.id)return NextResponse.json({error:'id required'},{status:400});const r=await supabaseServiceFetch(`/rest/v1/live_rooms?id=eq.${encodeURIComponent(b.id)}`,{method:'PATCH',body:JSON.stringify({status:'ended',ended_at:new Date().toISOString()})});return NextResponse.json({ok:r.ok});}
