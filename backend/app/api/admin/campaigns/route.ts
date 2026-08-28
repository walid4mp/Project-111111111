import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('campaigns');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/admin_campaigns?select=*&order=created_at.desc');return NextResponse.json({campaigns:r.ok?await r.json():[]});}
export async function POST(req:Request){const a=await requireAdminPermission('campaigns');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const b=await req.json();const r=await supabaseServiceFetch('/rest/v1/admin_campaigns',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({name:b.name,kind:b.kind||'promotion',active:b.active!==false,budget:b.budget||0,config:b.config||{}})});return NextResponse.json(await r.json().catch(()=>({})),{status:r.ok?200:400});}
