import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

const GAMES = ['Tic Tac Toe','Connect Four','Checkers','Chess','Ludo King','Domino','8 Ball Pool'];

function initial(game: string) {
  if (game === 'Tic Tac Toe') return { board:Array(9).fill(null), turn:0, winner:null };
  if (game === 'Connect Four') return { board:Array(42).fill(null), turn:0, winner:null };
  if (game === 'Checkers') {
    const board=Array(64).fill(null) as (string|null)[];
    for(let r=0;r<3;r++)for(let c=0;c<8;c++)if((r+c)%2===1)board[r*8+c]='O';
    for(let r=5;r<8;r++)for(let c=0;c<8;c++)if((r+c)%2===1)board[r*8+c]='X';
    return {board,turn:0,winner:null};
  }
  if (game === 'Chess') {
    return { board:['♜','♞','♝','♛','♚','♝','♞','♜',...Array(8).fill('♟'),...Array(32).fill(''),...Array(8).fill('♙'),'♖','♘','♗','♕','♔','♗','♘','♖'], turn:0, winner:null };
  }
  if (game === 'Ludo King') return { players:[0,0,0,0], dice:null, turn:0, winner:null };
  if (game === 'Domino') return { chain:[], hands:{host:[],guest:[]}, turn:0, winner:null };
  return { balls:Array.from({length:8},(_,i)=>({id:i+1,x:[12,25,40,55,68,78,45,88][i],y:[12,28,18,34,22,50,65,72][i]})), turn:0, winner:null };
}

export async function POST(request: Request) {
  const auth=await requireUser();
  if(!auth)return NextResponse.json({error:'Sign in required.'},{status:401});
  const body=await request.json().catch(()=>({}));
  const game=String(body.game||'');
  if(!GAMES.includes(game))return NextResponse.json({error:`Unsupported game. Choose one of: ${GAMES.join(', ')}.`},{status:400});
  const r=await supabaseServiceFetch('/rest/v1/game_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({game,host_id:auth.user.id,state:initial(game),status:'waiting'})});
  if(!r.ok)return NextResponse.json({error:'Unable to create online room. Check Supabase configuration.'},{status:500});
  return NextResponse.json({room:(await r.json())[0]});
}
