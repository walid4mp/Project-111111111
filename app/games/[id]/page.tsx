'use client';

import { useWarHexData } from '@/app/data/runtime';
import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CircleDot, Dice5, Gamepad2, RotateCcw, Trophy, Users, Zap } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { api } from '@/app/lib/client/api';
import { playUiSound } from '@/app/lib/client/sound';

type Cell = string | null;

const tttLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function getTttWinner(board: Cell[]) {
  for (const [a, b, c] of tttLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}

function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const winner = getTttWinner(board);

  const play = (index: number) => {
    if (board[index] || winner) return;
    const next = [...board];
    next[index] = turn;
    setBoard(next);
    setTurn(turn === 'X' ? 'O' : 'X');
    playUiSound('move');
    if (getTttWinner(next)) playUiSound('win');
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    playUiSound('tap');
  };

  return (
    <BoardShell title="Tic Tac Toe">
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <button key={index} onClick={() => play(index)} className="aspect-square rounded-2xl border border-white/10 bg-slate-900/80 text-5xl font-black transition hover:border-cyan-400/60">
            {value && <span className={value === 'X' ? 'text-cyan-400' : 'text-fuchsia-400'}>{value}</span>}
          </button>
        ))}
      </div>
      <Status winner={winner} turn={turn} />
      <Reset onClick={reset} />
    </BoardShell>
  );
}

function ConnectFour() {
  const [board, setBoard] = useState<Cell[]>(Array(42).fill(null));
  const [turn, setTurn] = useState('R');

  const winner = (() => {
    const directions = [[1,0],[0,1],[1,1],[1,-1]];
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const value = board[row * 7 + col];
        if (!value) continue;
        for (const [dr, dc] of directions) {
          const cells: Cell[] = [];
          for (let k = 0; k < 4; k += 1) {
            const r = row + dr * k;
            const c = col + dc * k;
            if (r < 0 || r >= 6 || c < 0 || c >= 7) break;
            cells.push(board[r * 7 + c]);
          }
          if (cells.length === 4 && cells.every((cell) => cell === value)) return value;
        }
      }
    }
    return board.every(Boolean) ? 'draw' : null;
  })();

  const drop = (column: number) => {
    if (winner) return;
    const next = [...board];
    for (let row = 5; row >= 0; row -= 1) {
      const index = row * 7 + column;
      if (!next[index]) {
        next[index] = turn;
        setBoard(next);
        setTurn(turn === 'R' ? 'Y' : 'R');
        playUiSound('move');
        if (next.filter(Boolean).length >= 4) playUiSound('move');
        return;
      }
    }
  };

  return (
    <BoardShell title="Connect Four">
      <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950 to-slate-950 p-3 shadow-2xl">
        <div className="grid grid-cols-7 gap-1.5">
          {board.map((value, index) => (
            <button key={index} onClick={() => drop(index % 7)} className="aspect-square rounded-full border border-white/5 bg-slate-950/90">
              <span className={`mx-auto block h-4/5 w-4/5 rounded-full shadow-lg ${value === 'R' ? 'bg-gradient-to-br from-red-400 to-red-700' : value === 'Y' ? 'bg-gradient-to-br from-yellow-200 to-amber-500' : 'bg-slate-800'}`} />
            </button>
          ))}
        </div>
      </div>
      <Status winner={winner} turn={turn === 'R' ? 'Red' : 'Yellow'} />
      <Reset onClick={() => { setBoard(Array(42).fill(null)); setTurn('R'); }} />
    </BoardShell>
  );
}

function Checkers() {
  const initial = () => {
    const pieces: Record<string, string> = {};
    for (let row = 0; row < 3; row += 1) for (let col = 0; col < 8; col += 1) if ((row + col) % 2) pieces[`${row}-${col}`] = 'light';
    for (let row = 5; row < 8; row += 1) for (let col = 0; col < 8; col += 1) if ((row + col) % 2) pieces[`${row}-${col}`] = 'dark';
    return pieces;
  };
  const [pieces, setPieces] = useState(initial);
  const [turn, setTurn] = useState('dark');
  const [selected, setSelected] = useState<string | null>(null);

  const move = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (selected) {
      if ((row + col) % 2 === 1 && !pieces[key]) {
        const next = { ...pieces };
        delete next[selected];
        next[key] = turn;
        setPieces(next);
        setTurn(turn === 'dark' ? 'light' : 'dark');
        playUiSound('move');
      }
      setSelected(null);
    } else if (pieces[key] === turn) {
      setSelected(key);
    }
  };

  return (
    <BoardShell title="Checkers">
      <div className="grid grid-cols-8 overflow-hidden rounded-2xl border-4 border-amber-950 shadow-2xl">
        {Array.from({ length: 64 }, (_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const key = `${row}-${col}`;
          return (
            <button key={key} onClick={() => move(row, col)} className={`aspect-square flex items-center justify-center ${(row + col) % 2 ? 'bg-amber-900' : 'bg-amber-100'} ${selected === key ? 'ring-4 ring-inset ring-cyan-400' : ''}`}>
              {pieces[key] && <span className={`h-4/5 w-4/5 rounded-full border-2 border-black/50 shadow-xl ${pieces[key] === 'dark' ? 'bg-gradient-to-br from-slate-400 to-black' : 'bg-gradient-to-br from-white to-slate-300'}`} />}
            </button>
          );
        })}
      </div>
      <p className="my-4 text-center text-sm text-slate-400">{turn === 'dark' ? 'Dark' : 'Light'} player&apos;s turn</p>
      <Reset onClick={() => { setPieces(initial()); setTurn('dark'); setSelected(null); }} />
    </BoardShell>
  );
}

function Ludo() {
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const roll = () => {
    setDice(Math.floor(Math.random() * 6) + 1);
    setTurn((value) => (value + 1) % 4);
    playUiSound('move');
  };
  return (
    <BoardShell title="Ludo Arena">
      <div className="mx-auto grid aspect-square max-w-md grid-cols-3 grid-rows-3 overflow-hidden rounded-[2rem] border-8 border-slate-950 bg-white shadow-2xl">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className={`flex items-center justify-center ${index % 3 === 0 ? 'bg-red-400' : index % 3 === 2 ? 'bg-blue-400' : index >= 6 ? 'bg-emerald-400' : 'bg-yellow-300'}`}>
            {index === 4 ? <div className="flex h-2/3 w-2/3 items-center justify-center rounded-full bg-white/80 font-black text-slate-900">HOME</div> : <div className="grid grid-cols-2 gap-2">{[0,1,2,3].map((piece) => <span key={piece} className="h-5 w-5 rounded-full border-2 border-black/10 bg-white/80" />)}</div>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <Button variant="gold" size="lg" onClick={roll}><Dice5 className="mr-2 h-5 w-5" />Roll {dice ?? '—'}</Button>
        <Badge variant="purple">Player {turn + 1}</Badge>
      </div>
    </BoardShell>
  );
}

function Chess() {
  const initial = ['♜','♞','♝','♛','♚','♝','♞','♜','♟','♟','♟','♟','♟','♟','♟','♟','','','','','','','','','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '♙','♙','♙','♙','♙','♙','♙','♙','♖','♘','♗','♕','♔','♗','♘','♖'];
  const [board, setBoard] = useState(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const move = (index: number) => {
    if (selected === null && board[index]) setSelected(index);
    else if (selected !== null && selected !== index) {
      const next = [...board];
      next[index] = next[selected];
      next[selected] = '';
      setBoard(next);
      setSelected(null);
      playUiSound('move');
    } else setSelected(null);
  };
  return (
    <BoardShell title="Chess">
      <div className="mx-auto grid max-w-md grid-cols-8 overflow-hidden rounded-2xl border-4 border-slate-950 shadow-2xl">
        {board.map((piece, index) => <button key={index} onClick={() => move(index)} className={`aspect-square flex items-center justify-center text-3xl sm:text-4xl ${((Math.floor(index / 8) + index) % 2 === 0) ? 'bg-amber-100 text-slate-900' : 'bg-amber-800 text-white'} ${selected === index ? 'ring-4 ring-inset ring-cyan-400' : ''}`}>{piece}</button>)}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">Practice board — select a piece, then a destination.</p>
    </BoardShell>
  );
}

function Domino() {
  const [tiles, setTiles] = useState([[6,6],[6,5],[5,4],[4,4],[4,2],[3,2],[6,1],[5,1]]);
  return (
    <BoardShell title="Domino">
      <div className="flex min-h-72 flex-wrap content-center justify-center gap-3 rounded-3xl border border-emerald-400/20 bg-emerald-950/80 p-5">
        {tiles.map((tile, index) => <button key={index} onClick={() => { setTiles((value) => [...value.slice(1), value[0]]); playUiSound('move'); }} className="flex h-28 w-16 flex-col items-center justify-evenly rounded-xl bg-slate-100 font-black text-slate-900 shadow-xl"><span>{tile[0]}</span><hr className="w-10 border-slate-400" /><span>{tile[1]}</span></button>)}
      </div>
      <p className="mt-4 text-center text-sm text-slate-400">Tap a tile to draw and rearrange your hand.</p>
    </BoardShell>
  );
}

function Pool() {
  const [balls, setBalls] = useState(Array.from({ length: 8 }, (_, index) => index));
  return (
    <BoardShell title="8 Ball Pool">
      <div className="rounded-[3rem] border-[12px] border-amber-900 bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 shadow-2xl">
        <div className="relative aspect-[2/1] overflow-hidden rounded-[2rem] border-4 border-emerald-950 bg-emerald-700">
          {[[8,12],[25,28],[40,18],[55,34],[68,22],[78,50],[45,65],[88,72]].map((position, index) => balls.includes(index) && <button key={index} onClick={() => { setBalls((value) => value.filter((ball) => ball !== index)); playUiSound('move'); }} style={{ left: `${position[0]}%`, top: `${position[1]}%` }} className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-white text-[10px] font-black text-slate-900 shadow-xl">{index + 1}</button>)}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-slate-400">Tap a ball to simulate a shot.</p>
    </BoardShell>
  );
}

function Practice({ name }: { name: string }) {
  return <BoardShell title={name}><div className="py-16 text-center"><Gamepad2 className="mx-auto mb-5 h-20 w-20 text-cyan-400" /><h2 className="mb-2 text-2xl font-black">Practice Arena</h2><p className="mb-6 text-slate-400">Ready for the next round.</p><Button variant="primary" size="lg" onClick={() => playUiSound('win')}><Zap className="mr-2 h-5 w-5" />Start Round</Button></div></BoardShell>;
}

function BoardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mx-auto max-w-xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.25em] text-cyan-400">WARHEX ARENA</p><h2 className="text-2xl font-black">{title}</h2></div><div className="flex gap-2"><Badge variant="emerald">LIVE READY</Badge><Trophy className="h-6 w-6 text-yellow-400" /></div></div>{children}</div>;
}

function Status({ winner, turn }: { winner: string | null; turn: string }) {
  return <div className="my-5 text-center font-bold">{winner === 'draw' ? 'DRAW' : winner ? `${winner} WINS` : `${turn}'s TURN`}</div>;
}

function Reset({ onClick }: { onClick: () => void }) {
  return <Button variant="ghost" fullWidth onClick={onClick}><RotateCcw className="mr-2 h-4 w-4" />Reset Arena</Button>;
}

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { games } = useWarHexData();
  const { id } = use(params);
  const router = useRouter();
  const game = games.find((item) => item.id === id);
  if (!game) return <main className="p-8">Game not found</main>;

  const online = true;
  const createOnline = async () => {
    try {
      const data = await api<{ room: { id: string } }>('/api/games/rooms/create', { method: 'POST', body: JSON.stringify({ game: game.name }) });
      playUiSound('win');
      router.push(`/games/room/${data.room.id}`);
    } catch (error) {
      playUiSound('error');
      alert(error instanceof Error ? error.message : 'Please sign in.');
    }
  };

  const playable = game.name === 'Tic Tac Toe' ? <TicTacToe />
    : game.name === 'Connect Four' ? <ConnectFour />
    : game.name === 'Checkers' ? <Checkers />
    : game.name === 'Chess' ? <Chess />
    : game.name === 'Ludo King' ? <Ludo />
    : game.name === 'Domino' ? <Domino />
    : game.name === '8 Ball Pool' ? <Pool />
    : <Practice name={game.name} />;

  return <main className="min-h-screen pb-24">
    <header className="sticky top-0 z-30 border-b border-white/10 glass-effect-strong"><div className="mx-auto flex max-w-screen-xl items-center gap-3 px-4 py-3"><Link href="/games"><Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" />Games</Button></Link><div className="flex-1"><h1 className="text-xl font-black">{game.icon} {game.name}</h1><p className="text-xs text-slate-400">{game.players.toLocaleString()} players • {game.maxPlayers} max</p></div><Badge variant="emerald"><CircleDot className="mr-1 h-3 w-3" />ONLINE</Badge></div></header>
    <div className="mx-auto max-w-screen-xl px-4 py-8"><Card variant="premium" className="p-5 sm:p-8"><div className="mb-7 flex items-center gap-3"><img src={game.image} alt="" className="h-16 w-16 rounded-2xl border border-white/10 object-cover" /><div><p className="text-xs uppercase tracking-widest text-cyan-400">Official WarHex Game</p><h2 className="text-2xl font-black">{game.name}</h2><p className="text-sm text-slate-400">{game.description}</p></div></div>{playable}{online && <div className="mt-8 border-t border-white/10 pt-6"><Button variant="primary" size="lg" fullWidth onClick={createOnline}><Users className="mr-2 h-5 w-5" />Find Real Player</Button><p className="mt-2 text-center text-xs text-slate-500">WarHex matchmaking searches for a real waiting player first, otherwise it creates a private waiting room you can share.</p></div>}</Card></div>
  </main>;
}
