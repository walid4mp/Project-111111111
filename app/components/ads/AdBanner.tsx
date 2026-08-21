'use client';
import { ExternalLink, Megaphone, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Ad = { id:string; title:string; body:string; image_url?:string|null; click_url?:string|null; placement?:string; priority?:number };

export default function AdBanner({ placement='global' }: { placement?: string }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [hidden, setHidden] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    let alive = true;
    setSelectedIndex(0);
    fetch('/api/ads', { cache: 'no-store' }).then(r => r.json()).then(d => {
      if (!alive) return;
      const list = Array.isArray(d.ads) ? d.ads : [];
      setAds(list.filter((a:Ad) => a.placement === 'global' || a.placement === placement));
    }).catch(() => {});
    return () => { alive = false; };
  }, [placement]);
  if (hidden || ads.length === 0) return null;
  const ad = useMemo(() => ads[selectedIndex % Math.max(ads.length, 1)], [ads, selectedIndex]);
  if (!ad) return null;
  const content = <div className="flex items-center gap-3 p-3">
    {ad.image_url ? <img src={ad.image_url} alt="" className="h-12 w-12 rounded-xl object-cover border border-white/10" /> : <div className="h-12 w-12 rounded-xl bg-cyan-500/15 grid place-items-center"><Megaphone className="text-cyan-300" /></div>}
    <div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-[.2em] text-cyan-300">WarHex Sponsor</p><p className="font-bold truncate">{ad.title}</p><p className="text-xs text-slate-400 truncate">{ad.body}</p></div>
    {ad.click_url && <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />}
  </div>;
  return <div className="fixed left-3 right-3 bottom-[4.5rem] z-30 mx-auto max-w-xl glass-effect-strong rounded-2xl shadow-2xl border border-cyan-400/20">
    {ad.click_url ? <a href={ad.click_url} target="_blank" rel="noreferrer sponsored">{content}</a> : content}
    <button aria-label="Close advertisement" onClick={() => setHidden(true)} className="absolute right-1 top-1 rounded-full p-1 text-slate-500 hover:text-white"><X className="h-3 w-3"/></button>
  </div>;
}
