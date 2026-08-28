import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('settings');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/app_settings?select=key,value');return NextResponse.json({settings:r.ok?await r.json():[]});}
export async function PATCH(req:Request){const a=await requireAdminPermission('settings');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const b=await req.json();const r=await supabaseServiceFetch('/rest/v1/app_settings?key=eq.'+encodeURIComponent(b.key),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({value:b.value,updated_at:new Date().toISOString()})});return NextResponse.json({ok:r.ok});}
