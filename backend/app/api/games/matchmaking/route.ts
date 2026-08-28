import { NextResponse } from 'next/server';
import { requireUser, supabaseServiceFetch } from '@/app/lib/server/supabase';

const GAMES=['Ludo King','Chess','Domino','Connect Four','Tic Tac Toe','Checkers','8 Ball Pool'];
const initial=(game:string)=> {
  if(game==='Tic Tac Toe')return {board:Array(9).fill(null),turn:0,winner:null};
  if(game==='Connect Four')return {board:Array(42).fill(null),turn:0,winner:null};
  if(game==='Checkers'){const b=Array(64).fill(null) as (string|null)[];for(let r=0;r<3;r++)for(let c=0;c<8;c++)if((r+c)%2)b[r*8+c]='O';for(let r=5;r<8;r++)for(let c=0;c<8;c++)if((r+c)%2)b[r*8+c]='X';return {board:b,turn:0,winner:null};}
  if(game==='Chess')return {board:['♜','♞','♝','♛','♚','♝','♞','♜',...Array(8).fill('♟'),...Array(32).fill(''),...Array(8).fill('♙'),'♖','♘','♗','♕','♔','♗','♘','♖'],turn:0,winner:null};
  if(game==='Ludo King')return {players:[0,0,0,0],dice:null,turn:0,winner:null};
  if(game==='Domino')return {chain:[],hands:{host:[],guest:[]},turn:0,winner:null};
  return {balls:Array.from({length:8},(_,i)=>({id:i+1,x:[12,25,40,55,68,78,45,88][i],y:[12,28,18,34,22,50,65,72][i]})),turn:0,winner:null};
};

export async function POST(request:Request){
  const auth=await requireUser();if(!auth)return NextResponse.json({error:'Sign in required.'},{status:401});
  const b=await request.json().catch(()=>({}));const game=String(b.game||'');
  if(!GAMES.includes(game))return NextResponse.json({error:'Unsupported game.'},{status:400});
  const find=await supabaseServiceFetch(`/rest/v1/game_rooms?game=eq.${encodeURIComponent(game)}&status=eq.waiting&guest_id=is.null&host_id=neq.${encodeURIComponent(auth.user.id)}&select=*&order=created_at.asc&limit=1`);
  if(find.ok){const rows=await find.json();if(rows[0]){
    const join=await supabaseServiceFetch(`/rest/v1/game_rooms?id=eq.${encodeURIComponent(rows[0].id)}&guest_id=is.null`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({guest_id:auth.user.id,status:'playing'})});
    if(join.ok)return NextResponse.json({room:(await join.json())[0],matched:true});
  }}
  const create=await supabaseServiceFetch('/rest/v1/game_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({game,host_id:auth.user.id,state:initial(game),status:'waiting'})});
  if(!create.ok)return NextResponse.json({error:'Unable to enter matchmaking.'},{status:500});
  return NextResponse.json({room:(await create.json())[0],matched:false});
}
