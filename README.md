# HyStats — Hypixel Player Statistics Tracker

A premium, full-stack Next.js application for tracking Hypixel Minecraft server player statistics. Built with a **cyber-noir gaming terminal** aesthetic.

## ✨ Features

- 🔍 **Player Search** — Search any Hypixel player by Minecraft username
- 📊 **Detailed Stats** — BedWars, SkyWars, Duels, and Overall stats
- 📈 **Data Visualization** — Charts powered by Recharts
- ⭐ **Favorites System** — Save and track players with localStorage
- 🎨 **Beautiful UI** — Glassmorphism, neon accents, smooth animations
- 💀 **Loading Skeletons** — Professional loading states
- 🔔 **Toast Notifications** — Contextual feedback
- 📱 **Fully Responsive** — Mobile + desktop

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- A Hypixel API key (join Hypixel and type `/api new` in chat)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Hypixel API key:

```env
HYPIXEL_API_KEY=your-api-key-here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
hypixel-stats/
├── app/
│   ├── api/
│   │   ├── player/[username]/route.ts   # Main player data API
│   │   └── uuid/[username]/route.ts     # UUID lookup API
│   ├── player/[username]/
│   │   ├── page.tsx                     # Player stats page (SSR metadata)
│   │   └── PlayerPageClient.tsx         # Client-side player UI
│   ├── favorites/
│   │   ├── page.tsx                     # Favorites page
│   │   └── FavoritesClient.tsx          # Favorites UI
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Home page
│   └── globals.css                      # Global styles
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                   # Navigation bar
│   │   └── Providers.tsx               # React context providers
│   ├── ui/
│   │   ├── StatCard.tsx                # Stat card components
│   │   └── LoadingSkeleton.tsx         # Loading skeleton UIs
│   ├── home/
│   │   └── HeroSection.tsx             # Landing page hero
│   └── player/
│       ├── PlayerHeader.tsx            # Player profile header
│       ├── OverallStats.tsx            # Cross-game overview
│       ├── BedWarsStats.tsx            # BedWars specific stats
│       ├── SkyWarsStats.tsx            # SkyWars specific stats
│       └── DuelsStats.tsx              # Duels specific stats
├── hooks/
│   └── useFavorites.ts                 # Favorites localStorage hook
├── lib/
│   ├── hypixel.ts                      # Hypixel/Mojang API clients
│   └── utils.ts                        # Utility functions
├── types/
│   └── hypixel.ts                      # TypeScript type definitions
└── .env.local.example                  # Environment variable template
```

## 🎨 Design System

**Theme**: Cyber-noir gaming terminal
- **Background**: Deep void (`#050810`) with subtle cyan grid overlay
- **Primary**: Neon cyan (`#00ffd0`) 
- **Secondary**: Electric purple (`#a855f7`)
- **Accent**: Amber (`#f59e0b`)
- **Cards**: Glassmorphism with blur + translucent backgrounds
- **Fonts**: Orbitron (display) + Space Grotesk (body) + JetBrains Mono (data)

## 🌐 Deployment on Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `HYPIXEL_API_KEY` to Environment Variables
4. Deploy!

## ⚡ Rate Limits

The Hypixel API has rate limits. The app handles them gracefully with:
- Server-side caching (60 seconds per player)
- User-friendly error messages
- Retry functionality

## 📄 License

MIT