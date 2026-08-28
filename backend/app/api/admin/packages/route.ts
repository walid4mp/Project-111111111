import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('packages');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/store_items?select=*&order=created_at.desc');return NextResponse.json({packages:r.ok?await r.json():[]});}
export async function PATCH(req:Request){const a=await requireAdminPermission('packages');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const b=await req.json();const r=await supabaseServiceFetch(`/rest/v1/store_items?id=eq.${encodeURIComponent(b.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({active:Boolean(b.active),price_usd:b.price_usd,value:b.value,bonus:b.bonus})});return NextResponse.json({ok:r.ok});}
