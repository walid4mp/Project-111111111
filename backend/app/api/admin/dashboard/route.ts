import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';
export async function GET(){
 const auth=await requireAdminPermission('dashboard'); if(!auth)return NextResponse.json({error:'Forbidden'},{status:403});
 const tables=['profiles','game_rooms','live_rooms','payment_orders','ads','store_items','admin_logs'];
 const counts:Record<string,number>={};
 for(const t of tables){const r=await supabaseServiceFetch(`/rest/v1/${t}?select=id&limit=1000`); counts[t]=r.ok?(await r.json()).length:0;}
 return NextResponse.json({counts,generatedAt:new Date().toISOString()});
}
