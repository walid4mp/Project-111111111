'use client';
import { useEffect, useState } from 'react';
import { Megaphone, Plus, Trash2, Power } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { api } from '@/app/lib/client/api';

type Ad={id:string;title:string;body:string;click_url:string|null;image_url:string|null;placement:string;active:boolean;priority:number};
export default function AdsAdminPage(){
  const [ads,setAds]=useState<Ad[]>([]); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const [title,setTitle]=useState(''); const [body,setBody]=useState(''); const [url,setUrl]=useState(''); const [placement,setPlacement]=useState('global');
  const load=async()=>{try{const r=await api<{ads:Ad[]}>('/api/admin/ads');setAds(r.ads)}catch(e){setError(e instanceof Error?e.message:'Admin access required.')}}
  useEffect(()=>{
    let alive = true;
    void api<{ads:Ad[]}>('/api/admin/ads').then(r=>{if(alive)setAds(r.ads)}).catch(e=>{if(alive)setError(e instanceof Error?e.message:'Admin access required.')});
    return ()=>{alive=false};
  },[]);
  const create=async()=>{if(!title.trim()||!body.trim())return;setBusy(true);try{await api('/api/admin/ads',{method:'POST',body:JSON.stringify({title,body,click_url:url,placement})});setTitle('');setBody('');setUrl('');await load()}catch(e){setError(e instanceof Error?e.message:'Unable to create ad.')}finally{setBusy(false)}};
  const toggle=async(ad:Ad)=>{try{await api('/api/admin/ads',{method:'PATCH',body:JSON.stringify({id:ad.id,active:!ad.active})});await load()}catch(e){setError(e instanceof Error?e.message:'Unable to update ad.')}};
  const remove=async(id:string)=>{if(!confirm('Delete this ad?'))return;await api(`/api/admin/ads?id=${encodeURIComponent(id)}`,{method:'DELETE'});await load()};
  return <main className="min-h-screen pb-24"><header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10"><div className="max-w-screen-lg mx-auto px-4 py-4"><p className="text-xs uppercase tracking-[.3em] text-cyan-300">ADMIN CONSOLE</p><h1 className="text-2xl font-black flex items-center gap-2"><Megaphone/> Advertising Manager</h1></div></header>
  <div className="max-w-screen-lg mx-auto p-4 space-y-5">
    {error&&<Card variant="glass" className="p-4 text-red-300">{error}</Card>}
    <Card variant="premium" className="p-5"><h2 className="font-bold mb-4">Create sponsor campaign</h2><div className="grid gap-3"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ad title" className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3"/><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Short advertising message" className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 min-h-24"/><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com (optional)" className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3"/><select value={placement} onChange={e=>setPlacement(e.target.value)} className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3"><option value="global">Everywhere</option><option value="home">Home</option><option value="games">Games</option><option value="live">Live</option></select><Button variant="primary" onClick={()=>void create()} disabled={busy||!title.trim()||!body.trim()}><Plus className="w-4 h-4 mr-2"/>Create Ad</Button></div></Card>
    <div className="grid gap-3">{ads.map(ad=><Card key={ad.id} variant="glass" className="p-4"><div className="flex items-center gap-3"><div className="flex-1 min-w-0"><p className="font-bold truncate">{ad.title}</p><p className="text-sm text-slate-400">{ad.body}</p><p className="text-xs text-slate-500 mt-1">{ad.placement} • priority {ad.priority}</p></div><Button variant="ghost" size="sm" onClick={()=>void toggle(ad)}><Power className={ad.active?'text-emerald-400':'text-slate-500'}/></Button><Button variant="danger" size="sm" onClick={()=>void remove(ad.id)}><Trash2/></Button></div></Card>)}</div>
  </div></main>;
}
