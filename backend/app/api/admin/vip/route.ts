import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('vip_pro');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/profiles?select=id,username,vip_level,gems,coins&vip_level=gt.0&order=vip_level.desc');return NextResponse.json({vip:r.ok?await r.json():[]});}
