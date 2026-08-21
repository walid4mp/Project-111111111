let ctx: AudioContext | null = null;
function audio(){ if(typeof window==='undefined') return null; ctx ??= new AudioContext(); if(ctx.state==='suspended') void ctx.resume(); return ctx; }
export function playUiSound(kind:'tap'|'move'|'win'|'error'='tap'){
  const c=audio(); if(!c)return; const o=c.createOscillator(), g=c.createGain();
  const now=c.currentTime; const freq=kind==='win'?660:kind==='error'?180:kind==='move'?420:300;
  o.type=kind==='win'?'triangle':'sine'; o.frequency.setValueAtTime(freq,now); o.frequency.exponentialRampToValueAtTime(kind==='win'?990:freq*.7,now+.12);
  g.gain.setValueAtTime(.0001,now); g.gain.exponentialRampToValueAtTime(.08,now+.01); g.gain.exponentialRampToValueAtTime(.0001,now+.14);
  o.connect(g); g.connect(c.destination); o.start(now); o.stop(now+.15);
}
