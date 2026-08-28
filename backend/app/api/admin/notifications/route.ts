import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('notifications');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/admin_notifications?select=*&order=created_at.desc&limit=200');return NextResponse.json({notifications:r.ok?await r.json():[]});}
export async function POST(req:Request){const a=await requireAdminPermission('notifications');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const b=await req.json();const r=await supabaseServiceFetch('/rest/v1/admin_notifications',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({title:b.title,body:b.body,target:b.target||'all',active:true})});return NextResponse.json({ok:r.ok});}
