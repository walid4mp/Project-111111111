'use client';

import { useEffect, useState } from 'react';
import type { Achievement, ChatRoom, Game, Gift, LeaderboardEntry, LiveStream, Mission, StoreItem, Tournament, User, VoiceRoom } from '@/app/types';

type RuntimeData = {
  currentUser: User;
  games: Game[];
  gifts: Gift[];
  storeItems: StoreItem[];
  tournaments: Tournament[];
  missions: Mission[];
  achievements: Achievement[];
  leaderboardData: LeaderboardEntry[];
  liveStreams: LiveStream[];
  voiceRooms: VoiceRoom[];
  chatRooms: ChatRoom[];
};

const guest: User = { id: '', username: 'Guest', avatar: '', level: 0, vipLevel: 0, xp: 0, coins: 0, gems: 0, isOnline: false, bio: '', followers: 0, following: 0, friends: 0 };

const empty: RuntimeData = {
  currentUser: guest,
  games: [], gifts: [], storeItems: [], tournaments: [], missions: [], achievements: [],
  leaderboardData: [], liveStreams: [], voiceRooms: [], chatRooms: [],
};

export function useWarHexData() {
  const [data, setData] = useState<RuntimeData>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/catalog', { cache: 'no-store' }).then((r) => r.ok ? r.json() : empty),
      fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.ok ? r.json() : ({ profile: null })),
    ]).then(([catalog, me]) => {
      if (cancelled) return;
      const p = me.profile as Record<string, unknown> | null;
      const currentUser = p ? { id: String(p.id), username: String(p.username ?? ''), avatar: String(p.avatar ?? ''), level: Number(p.level ?? 0), vipLevel: Number(p.vip_level ?? 0), xp: Number(p.xp ?? 0), coins: Number(p.coins ?? 0), gems: Number(p.gems ?? 0), isOnline: Boolean(p.is_online), bio: String(p.bio ?? ''), followers: Number(p.followers ?? 0), following: Number(p.following ?? 0), friends: Number(p.friends ?? 0) } : guest;
      const tournaments = Array.isArray(catalog.tournaments) ? catalog.tournaments.map((t: Tournament) => ({ ...t, startDate: new Date(t.startDate), endDate: new Date(t.endDate) })) : [];
      setData({ ...empty, ...catalog, tournaments, currentUser });
    }).catch(() => {
      if (!cancelled) setData(empty);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading };
}
