# FIFA World Cup 2026 — Web App Design Spec

**Date:** 2026-06-11
**Stack:** Next.js 15 + TypeScript + Tailwind CSS
**Data:** football-data.org API (REST, polling)
**Deploy:** Vercel

---

## 1. Architecture & Routes

### App Router structure

```
app/
├── page.tsx                      # Home: live match hero + Uzbekistan spotlight + section cards
├── uzbekistan/page.tsx           # 🇺🇿 Uzbekistan hub: news, squad, Group K, all matches
├── groups/
│   ├── page.tsx                  # All 12 groups grid (Group K pinned/highlighted)
│   └── [id]/page.tsx             # Single group (A–L): standings + match results
├── knockout/page.tsx             # Bracket: R16 → QF → SF → Final
├── matches/
│   ├── page.tsx                  # All matches with filters
│   └── [id]/page.tsx             # Match detail: lineups, stats, timeline
├── teams/
│   ├── page.tsx                  # All 48 teams grid
│   └── [id]/page.tsx             # Team profile: squad, coach, tournament stats
├── players/page.tsx              # Top scorers / cards / ratings (3 sub-tabs)
├── stadiums/page.tsx             # 16 venues: cards + Leaflet map
│
└── api/
    ├── standings/route.ts        # Proxy → /competitions/WC/standings
    ├── matches/route.ts          # Proxy → /competitions/WC/matches
    ├── matches/[id]/route.ts     # Proxy → /matches/{id}
    ├── scorers/route.ts          # Proxy → /competitions/WC/scorers
    ├── teams/[id]/route.ts       # Proxy → /teams/{id}
    ├── live/route.ts             # Proxy → /competitions/WC/matches?status=IN_PLAY
    └── news/route.ts             # Uzbekistan news: scrape/RSS from UFF + football-data.org
```

### Hosting & secrets

- Deploy to Vercel via GitHub auto-deploy
- `FOOTBALL_DATA_API_KEY` stored in Vercel Environment Variables — never exposed to the client
- All API calls go through Next.js API routes; client never touches football-data.org directly

---

## 2. Data Layer

### football-data.org endpoints

| Data | Endpoint | Cache TTL |
|---|---|---|
| Group standings | `GET /competitions/WC/standings` | 60s (SWR) |
| All matches | `GET /competitions/WC/matches` | 60s |
| Live matches | `GET /competitions/WC/matches?status=IN_PLAY` | 30s |
| Top scorers | `GET /competitions/WC/scorers` | 5 min |
| Team profile | `GET /teams/{id}` | 1h (ISR) |
| Match detail | `GET /matches/{id}` | 2 min |
| Uzbekistan matches | `GET /competitions/WC/matches?team=UZB` | 60s |

### Uzbekistan news source

- **Primary:** UFF official RSS feed at `https://uff.uz/rss` — parsed server-side, cached 15 min
- **Fallback:** Filter football-data.org match events for Uzbekistan team ID and surface as news items (goals, cards, final results)
- News items stored in a lightweight in-memory list (title, date, url, source); no database needed

### Zo'r TV broadcast link

- **URL:** `https://www.zortv.live/` — official licensed broadcaster of all FIFA WC 2026 matches in Uzbekistan
- Shown as a prominent `<WatchBanner>` component in two places:
  1. On every `<MatchCard>` where Uzbekistan is a participant
  2. As a fixed sticky banner at the top of `/uzbekistan` page during and 30 min before a Uzbekistan match (hidden otherwise)
- External link — opens in new tab (`target="_blank" rel="noopener noreferrer"`)

### Caching strategy

- **Live matches** — SWR `refreshInterval: 30000`, client component, pulsing `● LIVE` badge
- **Group standings** — SWR `refreshInterval: 60000` + Next.js `revalidate: 60` on the server
- **Static data** (stadiums, team profiles) — ISR `revalidate: 3600`, rebuilt hourly
- **Global state** — Zustand for selected match, active filters; SWR for all server data

### Rate limit protection

football-data.org free tier: 10 req/min. Each API route maintains an in-memory `Map<string, {data, timestamp}>` cache. Concurrent users share one cached response until TTL expires. On API error: return last cached data with a `"stale"` flag; UI shows "данные могут быть устаревшими".

---

## 3. UI Pages & Components

### Navigation

```
⚽ FIFA 2026  [● LIVE]  |  🇺🇿 Узбекистан  Группы  Плей-офф  Матчи  Команды  Игроки  Стадионы  [🌙/☀️]
```

- **🇺🇿 Узбекистан** — первая и выделенная вкладка (золотая подсветка), ведёт на `/uzbekistan`

- Desktop: horizontal tab bar at top
- Mobile: horizontally scrollable tab strip; logo collapses to icon

### Pages

**Home (`/`)** — Hero block with current live match (score, minute, lineups). Below: **Uzbekistan spotlight card** (🇺🇿 next match countdown or last result, Group K position, quick link to Uzbekistan hub). Then general section card grid.

**Groups (`/groups`)** — 12 group cards in a grid (3 cols desktop / 1 mobile). **Group K is pinned to the top and rendered with a gold border** to draw attention. Each card: standings table (P W D L GF GA Pts) + last results. Qualifying rows highlighted in gold; eliminated rows dimmed.

**Uzbekistan Hub (`/uzbekistan`)** — Dedicated page with 5 sections:
1. **Текущее положение** — Group K standings table with Uzbekistan row highlighted in the national blue-white-green colours; next match countdown timer.
2. **Матчи сборной** — All Uzbekistan matches (played + upcoming): score/date/opponent flag, link to match detail.
3. **Соперники по группе K** — Profile card for each of the 3 opponents: flag, FIFA ranking, key players, head-to-head vs Uzbekistan.
4. **Состав и статистика** — Squad list: player name, club, position, goals/assists/cards in this tournament. Sorted by goals.
5. **Новости** — Latest 10 news items about Uzbekistan national team, sourced from UFF official RSS feed (`uff.uz`) and filtered football-data.org match events. Each item: headline, date, source link. Cached 15 min.
6. **Смотреть матч** — Persistent banner/button on the Uzbekistan hub and on every match card involving Uzbekistan: "📺 Смотреть трансляцию на Zo'r TV" linking to `https://www.zortv.live/`. Zo'r TV holds the official broadcast license for all FIFA WC 2026 matches.

**Knockout (`/knockout`)** — Visual bracket: R16 → QF → SF → Final. Each pair: flag + team name + score. Horizontal scroll on mobile.

**Matches (`/matches`)** — List with filters: by date, group, status (played / upcoming / live). Live matches float to top with pulsing indicator.

**Match detail (`/matches/[id]`)** — Lineups, timeline (goals, cards, subs), match stats (possession, shots, corners).

**Teams (`/teams`)** — Grid of 48 cards: flag, name, group. Click → profile: squad list, coach, tournament stats.

**Players (`/players`)** — Three sub-tabs: Top Scorers / Yellow+Red Cards / Rating. Table with avatar, flag, club, goals/assists.

**Stadiums (`/stadiums`)** — 16 venue cards (photo, city, capacity, matches at this venue) + Leaflet.js map.

### Shared components

| Component | Purpose |
|---|---|
| `<LiveBadge>` | Pulsing red dot + match minute |
| `<TeamFlag>` | Flag emoji + name with fallback |
| `<StandingsTable>` | Reusable group standings table |
| `<MatchCard>` | Score, date, status chip |
| `<BracketNode>` | Knockout bracket pair block |
| `<ThemeToggle>` | 🌙 / ☀️ button, top-right of nav |
| `<UzbekistanSpotlight>` | Homepage card: Group K position + next match countdown |
| `<GroupKTable>` | Group K standings with Uzbekistan row highlighted in national colours |
| `<NewsCard>` | News item: headline, date, source badge, external link |
| `<OpponentCard>` | Group K opponent profile: flag, FIFA rank, key players, H2H |
| `<WatchBanner>` | "📺 Смотреть на Zo'r TV" button → `https://www.zortv.live/`, shown on all Uzbekistan match cards and the Uzbekistan hub |

---

## 4. Design System

### Colors

**Dark theme (default):**
```
Page background:   #0a0e1a
Cards / panels:    #111827
Borders:           #1f2937
Gold accent:       #c8a84b
Gold hover:        #e0b85a
Primary text:      #ffffff
Secondary text:    rgba(255,255,255,0.6)
Muted text:        rgba(255,255,255,0.3)
```

**Light theme:**
```
Page background:   #f0f4ff
Cards / panels:    #ffffff
Borders:           #e2e8f0
Gold accent:       #b8922a
Primary text:      #0f172a
Secondary text:    #475569
```

**Status colors (both themes):**
```
Live / win:        #22c55e
Loss:              #ef4444
Draw:              #facc15
```

### Theme switching

- `next-themes` library — SSR-safe, no flash on load
- Tailwind config: `darkMode: 'class'`
- All components use `dark:bg-... dark:text-...` utility classes
- Preference persisted in `localStorage`

### Typography

- Font: **Inter** (Google Fonts)
- Headings: weight 700–800
- Tables: weight 400–600
- Abbreviations (W D L Pts): `letter-spacing: 1–2px`, uppercase

### Motion

- Framer Motion for tab transitions: fade + slide 150ms
- Live score update: yellow flash on cell change
- Cards: `hover:scale-[1.02]` with shadow

### Icons

Lucide React — lightweight, TypeScript-friendly.

### Responsive breakpoints (Tailwind)

`sm:640` `md:768` `lg:1024` `xl:1280` — mobile-first.
Group standings on mobile: hide D/L columns, show only W and Pts; expand on tap.

---

## 5. Out of scope

- User authentication / accounts
- Comments or social features
- Video highlights
- Push notifications
- Multiple languages (Russian UI only)
