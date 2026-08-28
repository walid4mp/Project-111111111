import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('payments');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/payment_orders?select=*&order=created_at.desc&limit=500');return NextResponse.json({payments:r.ok?await r.json():[]});}
export async function PATCH(req:Request){const a=await requireAdminPermission('payment_review');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const b=await req.json();const r=await supabaseServiceFetch(`/rest/v1/payment_orders?id=eq.${encodeURIComponent(b.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:b.status})});return NextResponse.json({ok:r.ok});}
