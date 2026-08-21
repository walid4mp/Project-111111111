'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_PATHS = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/privacy', '/terms'];

type Status = 'checking' | 'authenticated' | 'unauthenticated';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const [status, setStatus] = useState<Status>(isPublic ? 'authenticated' : 'checking');

  useEffect(() => {
    if (isPublic) return;
    let alive = true;
    fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' })
      .then((response) => {
        if (!alive) return;
        if (response.ok) setStatus('authenticated');
        else setStatus('unauthenticated');
      })
      .catch(() => {
        if (alive) setStatus('unauthenticated');
      });
    return () => { alive = false; };
  }, [isPublic, pathname]);

  useEffect(() => {
    if (status !== 'unauthenticated' || isPublic) return;
    const next = pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
    router.replace(`/auth/login${next}`);
  }, [isPublic, pathname, router, status]);

  if (isPublic || status === 'authenticated') return <>{children}</>;

  return (
    <main className="min-h-screen grid place-items-center bg-[#050816] text-white px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 grid place-items-center text-2xl font-black shadow-2xl">W</div>
        <h1 className="text-2xl font-black">WarHex</h1>
        <p className="mt-2 text-sm text-slate-400">Checking your secure session…</p>
      </div>
    </main>
  );
}
