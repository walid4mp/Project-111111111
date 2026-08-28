import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){const a=await requireAdminPermission('ad_analytics');if(!a)return NextResponse.json({error:'Forbidden'},{status:403});const r=await supabaseServiceFetch('/rest/v1/ad_events?select=event,created_at,ad_id&order=created_at.desc&limit=1000');const rows=r.ok?await r.json():[];const byEvent:Record<string,number>={};for(const x of rows)byEvent[x.event]=(byEvent[x.event]||0)+1;return NextResponse.json({events:rows,summary:byEvent});}
