'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, Video } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { api } from '@/app/lib/client/api';

export default function NewLive(){const router=useRouter();const[title,setTitle]=useState('');const[category,setCategory]=useState('Gaming');const[busy,setBusy]=useState(false);const[error,setError]=useState('');
const create=async()=>{if(!title.trim())return;setBusy(true);setError('');try{const r=await api<{room:{id:string}}>('/api/live/rooms',{method:'POST',body:JSON.stringify({title,category})});router.push(`/live/${r.room.id}`)}catch(e){setError(e instanceof Error?e.message:'Unable to start live stream.')}finally{setBusy(false)}};
return <main className="min-h-screen grid place-items-center p-5"><Card variant="premium" className="w-full max-w-lg p-6"><div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-2xl bg-red-500/20 grid place-items-center"><Radio className="text-red-400"/></div><div><h1 className="text-2xl font-black">Start Live</h1><p className="text-sm text-slate-400">Real camera + microphone WebRTC broadcast</p></div></div><label className="block text-sm mb-2">Stream title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="My WarHex match" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-red-400"/><label className="block text-sm mb-2">Category</label><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 mb-5"><option>Gaming</option><option>Ludo</option><option>Chess</option><option>Music</option><option>Talk Shows</option><option>Entertainment</option></select>{error&&<p className="text-red-400 text-sm mb-4">{error}</p>}<Button variant="primary" fullWidth onClick={create} disabled={busy||!title.trim()}><Video className="w-4 h-4 mr-2"/>{busy?'Starting…':'Start Live'}</Button></Card></main>}
