import { NextResponse } from 'next/server';
import { requireAdminPermission, type AdminPermission } from '@/app/lib/server/admin-rbac';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

const CONFIG = {
  games: { table: 'game_catalog', permission: 'catalog_manage', id: 'id', fields: ['id','name','icon','category','players','max_players','min_bet','image_url','description','active'] },
  store: { table: 'store_items', permission: 'catalog_manage', id: 'id', fields: ['id','name','type','price_usd','value','bonus','image','badge','featured','active'] },
  gifts: { table: 'gift_catalog', permission: 'catalog_manage', id: 'id', fields: ['id','name','image','price','rarity','category','combo','active'] },
  tournaments: { table: 'tournaments', permission: 'catalog_manage', id: 'id', fields: ['id','name','game','image_url','prize','entry_fee','participants','max_participants','start_date','end_date','status','active'] },
  missions: { table: 'missions', permission: 'catalog_manage', id: 'id', fields: ['id','title','description','type','target','reward_type','reward_amount','active'] },
  achievements: { table: 'achievements', permission: 'catalog_manage', id: 'id', fields: ['id','name','description','icon','target','reward_type','reward_amount','active'] },
} as const;

type Type = keyof typeof CONFIG;
async function getConfig(params: Promise<{type:string}>) { const {type}=await params; return CONFIG[type as Type] ?? null; }

export async function GET(_req: Request, {params}:{params:Promise<{type:string}>}) {
  const cfg = await getConfig(params); if (!cfg) return NextResponse.json({error:'Unknown catalog'}, {status:404});
  const a = await requireAdminPermission(cfg.permission as AdminPermission); if (!a) return NextResponse.json({error:'Forbidden'}, {status:403});
  const r = await supabaseServiceFetch(`/rest/v1/${cfg.table}?select=*&order=created_at.desc`);
  return NextResponse.json({items:r.ok ? await r.json() : []});
}

export async function POST(req:Request,{params}:{params:Promise<{type:string}>}) {
  const cfg=await getConfig(params); if(!cfg)return NextResponse.json({error:'Unknown catalog'},{status:404});
  const a=await requireAdminPermission(cfg.permission as AdminPermission); if(!a)return NextResponse.json({error:'Forbidden'},{status:403});
  const b=await req.json().catch(()=>({}));
  const payload:Record<string,unknown>={}; for(const f of cfg.fields)if(f in b)payload[f]=b[f];
  if(!payload[cfg.id])return NextResponse.json({error:'id required'},{status:400});
  const r=await supabaseServiceFetch(`/rest/v1/${cfg.table}`,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
  return NextResponse.json({ok:r.ok,item:r.ok?(await r.json())[0]:null},{status:r.ok?200:400});
}

export async function PATCH(req:Request,{params}:{params:Promise<{type:string}>}) {
  const cfg=await getConfig(params); if(!cfg)return NextResponse.json({error:'Unknown catalog'},{status:404});
  const a=await requireAdminPermission(cfg.permission as AdminPermission); if(!a)return NextResponse.json({error:'Forbidden'},{status:403});
  const b=await req.json().catch(()=>({})); if(!b.id)return NextResponse.json({error:'id required'},{status:400});
  const payload:Record<string,unknown>={}; for(const f of cfg.fields)if(f!==cfg.id&&f in b)payload[f]=b[f];
  const r=await supabaseServiceFetch(`/rest/v1/${cfg.table}?${cfg.id}=eq.${encodeURIComponent(String(b.id))}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
  return NextResponse.json({ok:r.ok,item:r.ok?(await r.json())[0]:null},{status:r.ok?200:400});
}

export async function DELETE(req:Request,{params}:{params:Promise<{type:string}>}) {
  const cfg=await getConfig(params); if(!cfg)return NextResponse.json({error:'Unknown catalog'},{status:404});
  const a=await requireAdminPermission(cfg.permission as AdminPermission); if(!a)return NextResponse.json({error:'Forbidden'},{status:403});
  const id=new URL(req.url).searchParams.get('id'); if(!id)return NextResponse.json({error:'id required'},{status:400});
  const r=await supabaseServiceFetch(`/rest/v1/${cfg.table}?${cfg.id}=eq.${encodeURIComponent(id)}`,{method:'DELETE'});
  return NextResponse.json({ok:r.ok},{status:r.ok?200:500});
}
