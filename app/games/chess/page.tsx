'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

const files=['a','b','c','d','e','f','g','h'];
const initial=[['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']];
export default function ChessPage(){
 const [board,setBoard]=useState(initial); const [selected,setSelected]=useState<[number,number]|null>(null); const [turn,setTurn]=useState<'You'|'BOT'>('You'); const [status,setStatus]=useState('Live room • opponent connected');
 const move=(r:number,c:number)=>{if(turn!=='You')return; if(!selected){if(board[r][c])setSelected([r,c]);return;} const [sr,sc]=selected; if(sr===r&&sc===c){setSelected(null);return;} const next=board.map(x=>[...x]); next[r][c]=next[sr][sc]; next[sr][sc]=''; setBoard(next);setSelected(null);setTurn('BOT');setStatus('Opponent is thinking…'); setTimeout(()=>{setTurn('You');setStatus('Your turn • connection stable')},700)};
 const room=useMemo(()=>Math.floor(10000+Math.random()*89999),[]);
 return <main className="min-h-screen pb-24 px-3 py-4 max-w-3xl mx-auto"><div className="flex justify-between items-center mb-4"><Link href="/games"><Button variant="ghost">← Games</Button></Link><div className="text-right"><b>♟ CHESS</b><p className="text-xs text-emerald-400">● {status}</p></div></div>
 <Card variant="premium" className="p-3"><div className="flex justify-between px-2 py-2"><div><b>Walid</b><p className="text-xs text-gray-400">You • 1450</p></div><div className="text-right"><b>WarHex Bot</b><p className="text-xs text-gray-400">Online • 1400</p></div></div>
 <div className="grid grid-cols-8 aspect-square rounded-xl overflow-hidden border border-yellow-500/30">{board.map((row,r)=>row.map((piece,c)=><button key={`${r}-${c}`} onClick={()=>move(r,c)} className={`flex items-center justify-center text-3xl sm:text-5xl select-none ${((r+c)%2?'bg-[#76552f]':'bg-[#d8b879]')} ${selected?.[0]===r&&selected?.[1]===c?'ring-4 ring-blue-400':''}`}>{piece}</button>))}</div>
 <div className="flex justify-between items-center mt-3"><span className="text-xs text-gray-400">Room #{room} • {turn === 'You' ? 'Your turn' : 'Opponent turn'}</span><Button variant="primary" size="sm" onClick={()=>{setBoard(initial);setSelected(null);setTurn('You');}}>New game</Button></div></Card>
 <Card variant="glass" className="mt-4 p-4"><b>Live features</b><div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-300"><span>🎙 Voice</span><span>🎁 Gifts</span><span>💬 Chat</span></div></Card></main>
}
