# WarHex - Premium Social Gaming Platform

A complete, production-ready social gaming platform built with Next.js, TypeScript, Tailwind CSS v4, and Framer Motion.

## Features

### Core Platform
- ✨ Premium dark luxury theme with glassmorphism effects
- 🎨 Cross-platform responsive design (Mobile, Tablet, Desktop)
- 🌈 Royal Blue, Luxury Purple, Gold, Emerald, Diamond Blue color scheme
- 🎭 60 FPS smooth animations and transitions
- ⚡ Optimized performance with lazy loading

### Pages & Features Implemented

#### 1. **Authentication** (`/auth/login`)
- Email, Google, Apple login
- Forgot password flow
- Premium animated UI

#### 2. **Home Page** (`/`)
- Animated hero banner
- Currency display (Coins & Gems)
- Quick actions (Play, Live, Voice, Store)
- Daily rewards & Lucky wheel
- Featured games grid
- Live streams section
- Voice rooms preview
- Daily missions with progress tracking
- Leaderboard preview
- Events & tournaments banner

#### 3. **Games** (`/games`)
- Game lobby with search
- Category filtering (Board, Strategy, Puzzle, etc.)
- Quick Match, Ranked, Private modes
- Game statistics
- 7 supported games: Ludo, Chess, Domino, Connect Four, Tic Tac Toe, Checkers, 8 Ball Pool

#### 4. **Live Streaming** (`/live`)
- Live stream discovery
- Category filtering
- Featured streams
- Viewer count & likes
- Stream host profiles with VIP frames

#### 5. **Voice Rooms** (`/voice`)
- Multiple room sizes (8, 12, 16 seats)
- Room themes & backgrounds
- Host controls
- Listener count
- Private/Public rooms

#### 6. **Chat System** (`/chat`)
- Private conversations
- Online status indicators
- Unread message badges
- Last message preview
- Time stamps

#### 7. **Gift Store** (`/gifts`)
- 100+ gifts across rarities (Normal, Rare, Epic, Legendary, VIP)
- Category filtering (Flowers, Love, Food, Luxury, etc.)
- Rarity filtering
- Combo support for legendary gifts
- Premium animations

#### 8. **Store** (`/store`)
- Gem packages (6 tiers)
- VIP memberships (7, 30, 90 days)
- Gift packs
- Limited offers & deals
- Secure payment methods

#### 9. **Profile** (`/profile`)
- Animated avatar with VIP frame
- Level & XP progress bar
- Currency display (Coins, Gems)
- Social stats (Followers, Following, Friends)
- Achievements showcase
- Game statistics
- VIP status display

#### 10. **Leaderboards** (`/leaderboard`)
- Multiple categories (Players, Hosts, Gifters, Families, VIP)
- Time filters (Weekly, Monthly, All Time)
- Top 3 podium display
- Rank changes tracking
- VIP badges & rewards

#### 11. **Tournaments** (`/tournaments`)
- Daily, Weekly, Monthly tournaments
- Entry fees & prize pools
- Participant tracking
- Status filtering (Active, Upcoming, Ended)
- Game-specific tournaments

## Tech Stack

- **Framework**: Next.js 16.0.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
app/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ParticleBackground.tsx
│   └── layout/          # Layout components
│       └── BottomNav.tsx
├── data/
│   └── mockData.ts      # Mock data for all features
├── lib/
│   └── utils.ts         # Utility functions
├── types/
│   └── index.ts         # TypeScript type definitions
├── auth/login/          # Authentication pages
├── games/               # Games section
├── live/                # Live streaming
├── voice/               # Voice rooms
├── chat/                # Chat system
├── gifts/               # Gift store
├── store/               # Main store
├── profile/             # User profile
├── leaderboard/         # Leaderboards
├── tournaments/         # Tournaments
└── globals.css          # Global styles & theme
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Design System

### Colors
- **Royal Blue**: #2563eb
- **Luxury Purple**: #7c3aed
- **Gold**: #fbbf24
- **Emerald**: #10b981
- **Diamond Blue**: #06b6d4
- **Dark BG**: #0a0a0f
- **Dark Card**: #1a1a2e

### Components
- **Glass Effect**: Backdrop blur with transparency
- **Premium Cards**: Gradient borders with hover effects
- **VIP Badges**: Gold gradient with glow
- **Gradient Text**: Blue to purple gradient

### Animations
- Smooth page transitions
- Card hover effects (scale, shadow)
- Progress bar animations
- Particle background
- Floating elements
- Pulse glow effects

## Features Highlights

### VIP System
- 20 VIP levels
- Exclusive avatar frames
- Premium badges
- Special entrance effects
- VIP-only gifts and rooms

### Gift System
- Normal, Rare, Epic, Legendary, VIP rarities
- Combo multipliers
- Full-screen legendary effects
- Category organization

### Social Features
- Friends, Followers, Following
- Real-time online status
- Chat with media support
- Gift sending

### Gaming
- Multiple game modes
- Tournament system
- Leaderboards
- Achievements
- Daily missions

## Performance Optimizations

- Lazy loading for images
- Framer Motion for GPU-accelerated animations
- Component-level code splitting
- Optimized re-renders with React best practices
- Tailwind CSS for minimal bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This is a demonstration project built for educational purposes.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS v4
