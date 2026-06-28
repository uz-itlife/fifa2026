import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { Match, Goal, Booking, Venue, CachedResponse } from '@/types/football'
import matchStatsData from '@/data/match-stats.json'

interface SyncedGoal {
  playerId: number | null
  playerName: string
  assistId: number | null
  assistName: string | null
  team: string | null
  type: string
  minute: number
  injuryTime: number | null
}
interface SyncedCard {
  playerId: number | null
  playerName: string
  team: string | null
  type: 'yellow' | 'red' | 'second-yellow'
  minute: number
}
interface SyncedMatchStats {
  goals?: SyncedGoal[]
  cards?: SyncedCard[]
  venue?: Venue | null
}

const matchStats = matchStatsData as unknown as Record<string, SyncedMatchStats>

function resolveTeam(tla: string | null, match: Match) {
  if (tla === match.homeTeam.tla) return { id: match.homeTeam.id, name: match.homeTeam.name }
  if (tla === match.awayTeam.tla) return { id: match.awayTeam.id, name: match.awayTeam.name }
  return { id: 0, name: tla ?? 'Unknown' }
}

function fillFromSyncedStats(match: Match) {
  const synced = matchStats[String(match.id)]
  if (!synced) return match

  if (match.goals?.length === 0 && synced.goals?.length) {
    match.goals = synced.goals.map((g): Goal => ({
      minute: g.minute,
      injuryTime: g.injuryTime,
      type: g.type,
      team: resolveTeam(g.team, match),
      scorer: g.playerId ? { id: g.playerId, name: g.playerName } : null,
      assist: g.assistId ? { id: g.assistId, name: g.assistName ?? '' } : null,
    }))
  }

  if (match.bookings?.length === 0 && synced.cards?.length) {
    match.bookings = synced.cards.map((c): Booking => ({
      minute: c.minute,
      team: resolveTeam(c.team, match),
      player: { id: c.playerId ?? 0, name: c.playerName },
      card: c.type === 'red' ? 'RED_CARD' : c.type === 'second-yellow' ? 'YELLOW_RED_CARD' : 'YELLOW_CARD',
    }))
  }

  if (!match.venue && synced.venue) {
    match.venue = synced.venue
  }

  return match
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const key = `match-${id}`
  const cached = getCache<Match>(key)
  if (cached) return NextResponse.json<CachedResponse<Match>>({ data: cached, stale: false })
  try {
    // football-data.org v4 /matches/{id} returns full match with goals+bookings
    const raw = await footballFetch<Record<string, unknown>>(`/matches/${id}`)
    // Ensure goals/bookings are arrays even if API returns null
    const match: Match = fillFromSyncedStats({
      ...(raw as unknown as Match),
      goals: Array.isArray(raw.goals) ? raw.goals as Match['goals'] : [],
      bookings: Array.isArray(raw.bookings) ? raw.bookings as Match['bookings'] : [],
    })
    const ttl = match.status === 'IN_PLAY' || match.status === 'PAUSED' ? 20
      : match.status === 'FINISHED' ? 120
      : 60
    setCache(key, match, ttl)
    return NextResponse.json<CachedResponse<Match>>({ data: match, stale: false })
  } catch {
    const stale = getCache<Match>(key)
    if (stale) return NextResponse.json<CachedResponse<Match>>({ data: stale, stale: true })
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 502 })
  }
}
