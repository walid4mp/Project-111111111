import { NextResponse } from 'next/server';
import { supabaseServiceFetch } from '@/app/lib/server/supabase';

type Row = Record<string, unknown>;

export async function GET() {
  try {
    const tables = ['game_catalog','gift_catalog','store_items','tournaments','missions','achievements'];
    const results = await Promise.all(tables.map(async (table) => {
      const response = await supabaseServiceFetch(`/rest/v1/${table}?select=*&active=eq.true`, { method: 'GET' });
      return [table, response.ok ? await response.json() as Row[] : []] as const;
    }));
    const map = Object.fromEntries(results) as Record<string, Row[]>;
    const games = (map.game_catalog ?? []).map((x) => ({ id: x.id as string, name: x.name as string, icon: x.icon as string, category: x.category as string, players: Number(x.players ?? 0), maxPlayers: Number(x.max_players), minBet: x.min_bet == null ? undefined : Number(x.min_bet), image: x.image_url as string, description: x.description as string }));
    const gifts = (map.gift_catalog ?? []).map((x) => ({ id: x.id as string, name: x.name as string, image: x.image as string, price: Number(x.price), rarity: x.rarity as 'normal' | 'rare' | 'epic' | 'legendary' | 'vip', category: x.category as string, combo: x.combo == null ? undefined : Number(x.combo) }));
    const storeItems = (map.store_items ?? []).map((x) => ({ id: x.id as string, name: x.name as string, type: x.type as 'gems' | 'vip' | 'gift-pack' | 'offer', price: Number(x.price_usd), value: Number(x.value), bonus: x.bonus == null ? undefined : Number(x.bonus), image: x.image as string, badge: x.badge as string | undefined, featured: Boolean(x.featured) }));
    const tournaments = (map.tournaments ?? []).map((x) => ({ id: x.id as string, name: x.name as string, game: x.game as string, image: x.image_url as string, prize: Number(x.prize), entryFee: Number(x.entry_fee), participants: Number(x.participants), maxParticipants: Number(x.max_participants), startDate: new Date(x.start_date as string), endDate: new Date(x.end_date as string), status: x.status as 'upcoming' | 'active' | 'ended' }));
    const missions = (map.missions ?? []).map((x) => ({ id: x.id as string, title: x.title as string, description: x.description as string, type: x.type as 'daily' | 'weekly' | 'monthly', progress: 0, target: Number(x.target), reward: { type: x.reward_type as 'coins' | 'gems' | 'xp', amount: Number(x.reward_amount) }, completed: false }));
    const achievements = (map.achievements ?? []).map((x) => ({ id: x.id as string, name: x.name as string, description: x.description as string, icon: x.icon as string, progress: 0, target: Number(x.target), reward: { type: x.reward_type as string, amount: Number(x.reward_amount) }, unlocked: false }));
    return NextResponse.json({ games, gifts, storeItems, tournaments, missions, achievements, leaderboardData: [], liveStreams: [], voiceRooms: [], chatRooms: [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Catalog unavailable.' }, { status: 500 });
  }
}
