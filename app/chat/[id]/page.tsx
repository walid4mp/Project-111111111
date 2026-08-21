'use client';
import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react';
import Avatar from '@/app/components/ui/Avatar';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { api } from '@/app/lib/client/api';

type Message = { id: string; content: string; sender_id: string; created_at: string; sender?: { id: string; username: string; avatar?: string } };
export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const [messages,setMessages]=useState<Message[]>([]); const [text,setText]=useState(''); const [me,setMe]=useState(''); const [title,setTitle]=useState('Player'); const bottom=useRef<HTMLDivElement>(null);
  const load=async()=>{try{const m=await api<{user:{id:string}}>('/api/auth/me');setMe(m.user.id);const data=await api<{messages:Message[]}>(`/api/chat/messages?roomId=${id}`);setMessages(data.messages);const last=data.messages.at(-1);if(last?.sender) setTitle(last.sender.id===m.user.id?'Chat':last.sender.username);}catch{}};
  useEffect(()=>{ // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    load();const t=setInterval(load,2000);return()=>clearInterval(t)},[]);useEffect(()=>bottom.current?.scrollIntoView({behavior:'smooth'}),[messages]);
  const send=async()=>{const value=text.trim();if(!value)return;setText('');try{await api('/api/chat/messages',{method:'POST',body:JSON.stringify({roomId:id,content:value})});await load();}catch{setText(value);}};
  return <main className="min-h-screen pb-24"><header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10"><div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center gap-3"><Link href="/chat"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4"/></Button></Link><Avatar src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${id}`} size="sm" online/><div className="flex-1"><h1 className="font-bold">{title}</h1><p className="text-xs text-emerald-400">Online chat</p></div><Button variant="ghost" size="sm"><Phone className="w-4 h-4"/></Button><Button variant="ghost" size="sm"><Video className="w-4 h-4"/></Button></div></header><section className="max-w-screen-lg mx-auto px-4 py-6 space-y-3 min-h-[70vh]">{messages.map(m=><div key={m.id} className={`flex ${m.sender_id===me?'justify-end':'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.sender_id===me?'bg-blue-600':'bg-gray-800'}`}><p>{m.content}</p><p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p></div></div>)}{!messages.length&&<Card variant="glass" className="text-center py-12"><p className="text-gray-400">Start the conversation.</p></Card>}<div ref={bottom}/></section><div className="fixed bottom-0 left-0 right-0 p-3 bg-gray-950/90 backdrop-blur border-t border-white/10"><div className="max-w-screen-lg mx-auto flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Write a message..." className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"/><Button variant="primary" onClick={send}><Send className="w-5 h-5"/></Button></div></div></main>;
}
