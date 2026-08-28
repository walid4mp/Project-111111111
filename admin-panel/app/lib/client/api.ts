const API = process.env.NEXT_PUBLIC_API_URL || 'https://project-111111111.onrender.com';
export async function api<T=unknown>(path:string, options:RequestInit={}) : Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('warhex_admin_access_token') || '' : '';
  const headers = new Headers(options.headers);
  headers.set('Content-Type','application/json');
  headers.set('X-WarHex-Client','admin');
  if(token) headers.set('Authorization',`Bearer ${token}`);
  const controller = new AbortController();
  const timer = window.setTimeout(()=>controller.abort(),15000);
  try {
    const r = await fetch(`${API}${path}`,{...options,headers,cache:'no-store',signal:controller.signal});
    const d = await r.json().catch(()=>({}));
    if(!r.ok) throw new Error((d as any)?.error || `HTTP ${r.status}`);
    return d as T;
  } finally { window.clearTimeout(timer); }
}
