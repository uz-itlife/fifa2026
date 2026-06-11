import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { MatchesResponse, CachedResponse } from '@/types/football'

const CACHE_KEY = 'live-matches'
const TTL = 30

export async function GET() {
  const cached = getCache<MatchesResponse>(CACHE_KEY)
  if (cached) return NextResponse.json<CachedResponse<MatchesResponse>>({ data: cached, stale: false })
  try {
    const data = await footballFetch<MatchesResponse>('/competitions/WC/matches?status=IN_PLAY')
    setCache(CACHE_KEY, data, TTL)
    return NextResponse.json<CachedResponse<MatchesResponse>>({ data, stale: false })
  } catch {
    const stale = getCache<MatchesResponse>(CACHE_KEY)
    if (stale) return NextResponse.json<CachedResponse<MatchesResponse>>({ data: stale, stale: true })
    return NextResponse.json({ error: 'Failed to fetch live matches' }, { status: 502 })
  }
}
