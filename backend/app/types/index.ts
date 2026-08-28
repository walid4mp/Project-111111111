export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  vipLevel: number;
  xp: number;
  coins: number;
  gems: number;
  isOnline: boolean;
  bio?: string;
  followers: number;
  following: number;
  friends: number;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  players: number;
  maxPlayers: number;
  minBet?: number;
  image: string;
  description: string;
}

export interface LiveStream {
  id: string;
  host: User;
  title: string;
  thumbnail: string;
  viewers: number;
  likes: number;
  isLive: boolean;
  category: string;
  tags: string[];
}

export interface VoiceRoom {
  id: string;
  name: string;
  host: User;
  theme: string;
  seats: number;
  occupiedSeats: number;
  listeners: number;
  isLocked: boolean;
  background: string;
}

export interface Gift {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: 'normal' | 'rare' | 'epic' | 'legendary' | 'vip';
  category: string;
  animation?: string;
  combo?: number;
}

export interface StoreItem {
  id: string;
  name: string;
  type: 'gems' | 'vip' | 'gift-pack' | 'offer';
  price: number;
  value: number;
  bonus?: number;
  image: string;
  badge?: string;
  featured?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  image: string;
  prize: number;
  entryFee: number;
  participants: number;
  maxParticipants: number;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'ended';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  progress: number;
  target: number;
  reward: {
    type: 'coins' | 'gems' | 'xp';
    amount: number;
  };
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: {
    type: string;
    amount: number;
  };
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  change: number;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  type: 'text' | 'voice' | 'image' | 'gif' | 'gift';
  timestamp: Date;
  replyTo?: Message;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'private' | 'group';
  participants: User[];
  lastMessage?: Message;
  unread: number;
  avatar?: string;
}
