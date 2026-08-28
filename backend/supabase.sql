-- Run this entire file in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar text,
  bio text default '',
  level integer not null default 1,
  vip_level integer not null default 0,
  xp integer not null default 0,
  coins bigint not null default 1000,
  gems bigint not null default 100,
  is_online boolean not null default false,
  public_profile boolean not null default true,
  show_online_status boolean not null default true,
  notifications boolean not null default true,
  sound boolean not null default true,
  haptics boolean not null default true,
  language text not null default 'en',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, username, avatar) values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1)),
    'https://api.dicebear.com/9.x/avataaars/svg?seed=' || encode(gen_random_bytes(8),'hex')
  ) on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_a, user_b),
  check(user_a <> user_b)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check(char_length(content) between 1 and 4000),
  type text not null default 'text',
  created_at timestamptz not null default now()
);
create index if not exists messages_room_created_idx on public.messages(room_id, created_at);

create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  game text not null,
  host_id uuid not null references public.profiles(id) on delete cascade,
  guest_id uuid references public.profiles(id) on delete set null,
  status text not null default 'waiting',
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists game_rooms_status_idx on public.game_rooms(game, status);

alter table public.profiles enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.messages enable row level security;
alter table public.game_rooms enable row level security;

drop policy if exists "profiles are public when enabled" on public.profiles;
create policy "profiles are public when enabled" on public.profiles for select using (public_profile or auth.uid() = id);
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
drop policy if exists "users read own chats" on public.chat_rooms;
create policy "users read own chats" on public.chat_rooms for select using (auth.uid() = user_a or auth.uid() = user_b);
drop policy if exists "users create chats" on public.chat_rooms;
create policy "users create chats" on public.chat_rooms for insert with check (auth.uid() = user_a or auth.uid() = user_b);
drop policy if exists "chat members read messages" on public.messages;
create policy "chat members read messages" on public.messages for select using (exists(select 1 from public.chat_rooms c where c.id = room_id and (c.user_a = auth.uid() or c.user_b = auth.uid())));
drop policy if exists "chat members send messages" on public.messages;
create policy "chat members send messages" on public.messages for insert with check (sender_id = auth.uid() and exists(select 1 from public.chat_rooms c where c.id = room_id and (c.user_a = auth.uid() or c.user_b = auth.uid())));
drop policy if exists "players read game rooms" on public.game_rooms;
create policy "players read game rooms" on public.game_rooms for select using (host_id = auth.uid() or guest_id = auth.uid());
drop policy if exists "players create game rooms" on public.game_rooms;
create policy "players create game rooms" on public.game_rooms for insert with check (host_id = auth.uid());
drop policy if exists "players update game rooms" on public.game_rooms;
create policy "players update game rooms" on public.game_rooms for update using (host_id = auth.uid() or guest_id = auth.uid());

-- Enable Realtime for chat and game rooms in the Supabase dashboard if desired.

-- Optional Realtime: in Supabase Dashboard > Database > Replication, enable
-- `messages` and `game_rooms`. The app already uses shared database polling,
-- so it remains functional even when Realtime is disabled.

-- Production WebRTC signaling + live/voice rooms
create table if not exists public.live_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null default 'Gaming',
  status text not null default 'live',
  viewer_count integer not null default 0,
  created_at timestamptz not null default now(),
  ended_at timestamptz
);
create index if not exists live_rooms_status_created_idx on public.live_rooms(status, created_at desc);

create table if not exists public.live_signals (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.live_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists live_signals_room_created_idx on public.live_signals(room_id, created_at);

create table if not exists public.live_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.live_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists live_messages_room_created_idx on public.live_messages(room_id, created_at);

create table if not exists public.voice_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  status text not null default 'live',
  created_at timestamptz not null default now(),
  ended_at timestamptz
);
create table if not exists public.voice_signals (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.voice_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists voice_signals_room_created_idx on public.voice_signals(room_id, created_at);

alter table public.live_rooms enable row level security;
alter table public.live_signals enable row level security;
alter table public.live_messages enable row level security;
alter table public.voice_rooms enable row level security;
alter table public.voice_signals enable row level security;

drop policy if exists "live rooms are readable" on public.live_rooms;
create policy "live rooms are readable" on public.live_rooms for select using (true);
drop policy if exists "live signals are server managed" on public.live_signals;
create policy "live signals are server managed" on public.live_signals for all using (false) with check (false);
drop policy if exists "live messages are readable" on public.live_messages;
create policy "live messages are readable" on public.live_messages for select using (true);
drop policy if exists "live messages are server managed" on public.live_messages;
create policy "live messages are server managed" on public.live_messages for all using (false) with check (false);
drop policy if exists "voice rooms are readable" on public.voice_rooms;
create policy "voice rooms are readable" on public.voice_rooms for select using (true);
drop policy if exists "voice signals are server managed" on public.voice_signals;
create policy "voice signals are server managed" on public.voice_signals for all using (false) with check (false);


-- WarHex advertising / sponsorship system.
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  click_url text,
  placement text not null default 'global' check (placement in ('global','home','games','live')),
  active boolean not null default true,
  priority integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists ads_active_priority_idx on public.ads(active, priority desc, created_at desc);
alter table public.ads enable row level security;
drop policy if exists "active ads are public" on public.ads;
create policy "active ads are public" on public.ads for select using (active = true);

-- WarHex PayPal payment ledger and idempotent reward granting.
create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  provider text not null default 'paypal',
  provider_order_id text not null unique,
  provider_capture_id text unique,
  currency text not null check (currency in ('USD','EUR')),
  amount numeric(12,2) not null check (amount > 0),
  status text not null default 'created' check (status in ('created','captured','failed')),
  created_at timestamptz not null default now(),
  captured_at timestamptz
);
create index if not exists payment_orders_user_created_idx on public.payment_orders(user_id, created_at desc);
alter table public.payment_orders enable row level security;
drop policy if exists "users can read their payment orders" on public.payment_orders;
create policy "users can read their payment orders" on public.payment_orders for select using (auth.uid() = user_id);

create or replace function public.grant_payment_reward(
  p_payment_order_id uuid,
  p_user_id uuid,
  p_provider_capture_id text,
  p_item_type text,
  p_value integer,
  p_bonus integer default 0
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_reward integer := greatest(p_value, 0) + greatest(coalesce(p_bonus, 0), 0);
begin
  select status into v_status from public.payment_orders where id = p_payment_order_id and user_id = p_user_id for update;
  if not found then raise exception 'payment_order_not_found'; end if;
  if v_status = 'captured' then return jsonb_build_object('already_granted', true); end if;

  if p_item_type = 'gems' then
    update public.profiles set gems = gems + v_reward where id = p_user_id;
  elsif p_item_type = 'vip' then
    update public.profiles set vip_level = vip_level + greatest(p_value, 0) where id = p_user_id;
  elsif p_item_type = 'gift-pack' or p_item_type = 'offer' then
    update public.profiles set gems = gems + v_reward where id = p_user_id;
  else
    raise exception 'unsupported_item_type';
  end if;

  update public.payment_orders
    set status = 'captured', provider_capture_id = p_provider_capture_id, captured_at = now()
    where id = p_payment_order_id;

  return jsonb_build_object('already_granted', false, 'reward', v_reward);
end;
$$;

-- ============================================================
-- WarHex production catalog
-- No demo accounts, balances, leaderboard rows or fake social data.
-- These are only product/game definitions and are safe to manage from the DB.
-- ============================================================
create table if not exists public.game_catalog (
  id text primary key,
  name text not null,
  icon text not null,
  category text not null,
  players integer not null default 0 check (players >= 0),
  max_players integer not null check (max_players > 0),
  min_bet integer,
  image_url text,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gift_catalog (
  id text primary key,
  name text not null,
  image text not null,
  price numeric(12,2) not null check (price >= 0),
  rarity text not null check (rarity in ('normal','rare','epic','legendary','vip')),
  category text not null,
  combo integer,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.store_items (
  id text primary key,
  name text not null,
  type text not null check (type in ('gems','vip','gift-pack','offer')),
  price_usd numeric(12,2) not null check (price_usd > 0),
  value integer not null check (value >= 0),
  bonus integer not null default 0 check (bonus >= 0),
  image text not null,
  badge text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id text primary key,
  name text not null,
  game text not null,
  image_url text,
  prize bigint not null default 0,
  entry_fee bigint not null default 0,
  participants integer not null default 0,
  max_participants integer not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null check (status in ('upcoming','active','ended')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.missions (
  id text primary key,
  title text not null,
  description text not null,
  type text not null check (type in ('daily','weekly','monthly')),
  target integer not null check (target > 0),
  reward_type text not null check (reward_type in ('coins','gems','xp')),
  reward_amount integer not null check (reward_amount >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  target integer not null check (target > 0),
  reward_type text not null,
  reward_amount integer not null check (reward_amount >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.game_catalog enable row level security;
alter table public.gift_catalog enable row level security;
alter table public.store_items enable row level security;
alter table public.tournaments enable row level security;
alter table public.missions enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "public active game catalog" on public.game_catalog;
drop policy if exists "public active game catalog" on public.game_catalog;
create policy "public active game catalog" on public.game_catalog for select using (active = true);
drop policy if exists "public active gift catalog" on public.gift_catalog;
drop policy if exists "public active gift catalog" on public.gift_catalog;
create policy "public active gift catalog" on public.gift_catalog for select using (active = true);
drop policy if exists "public active store catalog" on public.store_items;
drop policy if exists "public active store catalog" on public.store_items;
create policy "public active store catalog" on public.store_items for select using (active = true);
drop policy if exists "public active tournaments" on public.tournaments;
drop policy if exists "public active tournaments" on public.tournaments;
create policy "public active tournaments" on public.tournaments for select using (active = true);
drop policy if exists "public active missions" on public.missions;
drop policy if exists "public active missions" on public.missions;
create policy "public active missions" on public.missions for select using (active = true);
drop policy if exists "public active achievements" on public.achievements;
drop policy if exists "public active achievements" on public.achievements;
create policy "public active achievements" on public.achievements for select using (active = true);

insert into public.game_catalog (id,name,icon,category,max_players,min_bet,image_url,description) values
('ludo','Ludo King','🎲','Board',4,100,'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800','Classic board game with friends'),
('chess','Chess','♟️','Strategy',2,200,'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800','Master the game of kings'),
('domino','Domino','🀄','Classic',4,150,'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800','Traditional domino gameplay'),
('connect-four','Connect Four','🔴','Puzzle',2,50,'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800','Connect four in a row to win'),
('tic-tac-toe','Tic Tac Toe','❌','Casual',2,25,'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800','Classic X and O game'),
('checkers','Checkers','⚫','Board',2,100,'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800','Strategic board game'),
('8-ball-pool','8 Ball Pool','🎱','Sports',2,300,'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800','Realistic pool simulation')
on conflict (id) do update set name=excluded.name,icon=excluded.icon,category=excluded.category,max_players=excluded.max_players,min_bet=excluded.min_bet,image_url=excluded.image_url,description=excluded.description,active=true;

insert into public.store_items (id,name,type,price_usd,value,bonus,image,badge,featured) values
('gems-100','100 Gems','gems',0.99,100,0,'💎',null,false),
('gems-500','500 Gems','gems',4.99,500,50,'💎',null,false),
('gems-1000','1000 Gems','gems',9.99,1000,150,'💎','Popular',true),
('gems-2500','2500 Gems','gems',24.99,2500,500,'💎',null,false),
('gems-5000','5000 Gems','gems',49.99,5000,1200,'💎','Best Value',true),
('gems-10000','10000 Gems','gems',99.99,10000,3000,'💎',null,false),
('vip-7','VIP 7 Days','vip',9.99,7,0,'👑',null,false),
('vip-30','VIP 30 Days','vip',29.99,30,0,'👑','Most Popular',true),
('vip-90','VIP 90 Days','vip',79.99,90,15,'👑','Save 15%',true),
('starter-pack','Starter Pack','gift-pack',4.99,500,0,'🎁',null,false),
('pro-pack','Pro Pack','gift-pack',14.99,1500,0,'🎁',null,false),
('legend-pack','Legend Pack','gift-pack',49.99,5000,0,'🎁','Limited',true)
on conflict (id) do update set name=excluded.name,type=excluded.type,price_usd=excluded.price_usd,value=excluded.value,bonus=excluded.bonus,image=excluded.image,badge=excluded.badge,featured=excluded.featured,active=true;

insert into public.gift_catalog (id,name,image,price,rarity,category,combo) values
('rose','Rose','🌹',10,'normal','Flowers',null),('heart','Heart','❤️',15,'normal','Love',null),('star','Star','⭐',20,'normal','Special',null),('cake','Cake','🎂',25,'normal','Food',null),('coffee','Coffee','☕',12,'normal','Drinks',null),('ice-cream','Ice Cream','🍦',18,'normal','Food',null),('pizza','Pizza','🍕',22,'normal','Food',null),('diamond-ring','Diamond Ring','💍',100,'rare','Luxury',null),('crown','Crown','👑',150,'rare','Royal',null),('trophy','Trophy','🏆',120,'rare','Victory',null),('bouquet','Bouquet','💐',90,'rare','Flowers',null),('sports-car','Sports Car','🏎️',180,'rare','Vehicles',null),('fireworks','Fireworks','🎆',110,'rare','Celebration',null),('yacht','Yacht','🛥️',500,'epic','Luxury',null),('private-jet','Private Jet','✈️',800,'epic','Luxury',null),('mansion','Mansion','🏰',650,'epic','Property',null),('rocket','Rocket','🚀',1000,'epic','Space',null),('rainbow','Rainbow','🌈',450,'epic','Magic',null),('dragon','Dragon','🐉',2000,'legendary','Mythical',5),('phoenix','Phoenix','🔥🦅',2500,'legendary','Mythical',5),('galaxy','Galaxy','🌌',3000,'legendary','Cosmic',10),('universe','Universe','🌍✨',5000,'legendary','Cosmic',10),('vip-badge','VIP Badge','👑💎',10000,'vip','Exclusive',null),('golden-throne','Golden Throne','🪑✨',8000,'vip','Exclusive',null)
on conflict (id) do update set name=excluded.name,image=excluded.image,price=excluded.price,rarity=excluded.rarity,category=excluded.category,combo=excluded.combo,active=true;

insert into public.missions (id,title,description,type,target,reward_type,reward_amount) values
('play-games','Play Games','Complete games','daily',5,'coins',1000),
('win-matches','Win Matches','Win matches in any game','daily',3,'gems',50),
('send-gifts','Send Gifts','Send gifts to other players','weekly',10,'coins',5000)
on conflict (id) do update set title=excluded.title,description=excluded.description,type=excluded.type,target=excluded.target,reward_type=excluded.reward_type,reward_amount=excluded.reward_amount,active=true;

insert into public.achievements (id,name,description,icon,target,reward_type,reward_amount) values
('first-victory','First Victory','Win your first game','🏆',1,'coins',500),
('winning-streak','Winning Streak','Win 10 games in a row','🔥',10,'gems',100)
on conflict (id) do update set name=excluded.name,description=excluded.description,icon=excluded.icon,target=excluded.target,reward_type=excluded.reward_type,reward_amount=excluded.reward_amount,active=true;


-- ============================================================
-- WarHex Admin Control Plane
-- ============================================================
create table if not exists public.admin_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'ADMIN' check (role in ('SUPER_ADMIN','ADMIN')),
  scope text not null default 'both' check (scope in ('web','app','both')),
  permissions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null, target_type text, target_id text, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.admin_campaigns (
  id uuid primary key default gen_random_uuid(), name text not null, kind text not null default 'promotion', active boolean not null default true, budget numeric(12,2) not null default 0, config jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(), title text not null, body text not null, target text not null default 'all', active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.ad_events (
  id uuid primary key default gen_random_uuid(), ad_id uuid references public.ads(id) on delete set null, user_id uuid references public.profiles(id) on delete set null, event text not null check(event in ('impression','click','reward_start','reward_complete')), created_at timestamptz not null default now()
);
create table if not exists public.app_settings (
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);

alter table public.admin_accounts enable row level security;
alter table public.admin_logs enable row level security;
alter table public.admin_campaigns enable row level security;
alter table public.admin_notifications enable row level security;
alter table public.ad_events enable row level security;
alter table public.app_settings enable row level security;

-- Admin data is accessed only through server routes using SUPABASE_SERVICE_ROLE_KEY.
drop policy if exists "no direct admin accounts access" on public.admin_accounts;
create policy "no direct admin accounts access" on public.admin_accounts for all using (false) with check (false);
drop policy if exists "no direct admin logs access" on public.admin_logs;
create policy "no direct admin logs access" on public.admin_logs for all using (false) with check (false);
drop policy if exists "no direct admin campaigns access" on public.admin_campaigns;
create policy "no direct admin campaigns access" on public.admin_campaigns for all using (false) with check (false);
drop policy if exists "no direct admin notifications access" on public.admin_notifications;
create policy "no direct admin notifications access" on public.admin_notifications for all using (false) with check (false);
drop policy if exists "no direct ad analytics access" on public.ad_events;
create policy "no direct ad analytics access" on public.ad_events for all using (false) with check (false);
drop policy if exists "public app settings read" on public.app_settings;
create policy "public app settings read" on public.app_settings for select using (true);
drop policy if exists "no direct app settings write" on public.app_settings;
create policy "no direct app settings write" on public.app_settings for insert with check (false);
drop policy if exists "no direct app settings update" on public.app_settings;
create policy "no direct app settings update" on public.app_settings for update using (false) with check (false);

insert into public.app_settings(key,value) values
('maintenance', 'false'::jsonb),
('games_enabled', 'true'::jsonb),
('live_enabled', 'true'::jsonb),
('registration_enabled', 'true'::jsonb),
('default_language', '"en"'::jsonb)
on conflict (key) do nothing;

-- Existing profiles need moderation state.
alter table public.profiles add column if not exists status text not null default 'ACTIVE' check(status in ('ACTIVE','FROZEN','BANNED'));
create index if not exists profiles_status_idx on public.profiles(status);
