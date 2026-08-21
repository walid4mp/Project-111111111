'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Users } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { api } from '../lib/client/api';

type Room = { id: string; user_a: string; user_b: string };
type Profile = { id: string; username: string; avatar?: string; is_online?: boolean; vip_level?: number };

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [me, setMe] = useState<string>('');
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const load = async () => {
    try {
      const meData = await api<{ user: { id: string } }>('/api/auth/me'); setMe(meData.user.id);
      const data = await api<{ rooms: Room[] }>('/api/chat/rooms'); setRooms(data.rooms);
      const ids = [...new Set(data.rooms.flatMap(r => [r.user_a, r.user_b]).filter(id => id !== meData.user.id))];
      if (ids.length) {
        const found = await api<{ profiles: Profile[] }>(`/api/profile/batch?ids=${ids.join(',')}`);
        setProfiles(Object.fromEntries(found.profiles.map(p => [p.id, p])));
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Please sign in.'); }
  };
  useEffect(() => { // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);
  const newChat = async () => {
    setError('');
    try { const r = await api<{ room: Room }>('/api/chat/rooms/create', { method: 'POST', body: JSON.stringify({ username }) }); setUsername(''); window.location.href = `/chat/${r.room.id}`; }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to create chat.'); }
  };
  const filtered = rooms.filter(r => { const id = r.user_a === me ? r.user_b : r.user_a; return profiles[id]?.username?.toLowerCase().includes(search.toLowerCase()); });
  return <div className="min-h-screen pb-24"><header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10"><div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between"><h1 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="w-7 h-7 text-blue-500"/>Messages</h1><div className="flex gap-2"><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-32 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm"/><Button variant="primary" size="sm" onClick={newChat}><Users className="w-4 h-4 mr-1"/>New Chat</Button></div></div></header><main className="max-w-screen-xl mx-auto px-4 py-6 space-y-5"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..." className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white"/></div>{error && <Card variant="glass"><p className="text-red-400">{error}</p></Card>}<div className="space-y-3">{filtered.map(room=>{const id=room.user_a===me?room.user_b:room.user_a;const p=profiles[id];return <Link key={room.id} href={`/chat/${room.id}`}><Card variant="premium" interactive><div className="flex items-center gap-4"><Avatar src={p?.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${id}`} size="lg" online={p?.is_online} vipLevel={p?.vip_level}/><div><h3 className="font-bold">{p?.username || 'Player'}</h3><p className="text-sm text-gray-400">Open secure conversation</p></div></div></Card></Link>})}</div>{!filtered.length && !error && <Card variant="glass" className="text-center py-12"><p className="text-gray-400">No online conversations yet. Start one by username.</p></Card>}</main></div>;
}
