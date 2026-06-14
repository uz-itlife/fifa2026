import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { Match, CachedResponse } from '@/types/football'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const key = `match-${id}`
  const cached = getCache<Match>(key)
  if (cached) return NextResponse.json<CachedResponse<Match>>({ data: cached, stale: false })
  try {
    // football-data.org v4 /matches/{id} returns full match with goals+bookings
    const raw = await footballFetch<Record<string, unknown>>(`/matches/${id}`)
    // Ensure goals/bookings are arrays even if API returns null
    const match: Match = {
      ...(raw as unknown as Match),
      goals: Array.isArray(raw.goals) ? raw.goals as Match['goals'] : [],
      bookings: Array.isArray(raw.bookings) ? raw.bookings as Match['bookings'] : [],
    }
    setCache(key, match, 60)
    return NextResponse.json<CachedResponse<Match>>({ data: match, stale: false })
  } catch {
    const stale = getCache<Match>(key)
    if (stale) return NextResponse.json<CachedResponse<Match>>({ data: stale, stale: true })
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 502 })
  }
}
