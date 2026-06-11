import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { StandingsResponse, CachedResponse } from '@/types/football'

const CACHE_KEY = 'standings'
const TTL = 60

export async function GET() {
  const cached = getCache<StandingsResponse>(CACHE_KEY)
  if (cached) {
    return NextResponse.json<CachedResponse<StandingsResponse>>({ data: cached, stale: false })
  }
  try {
    const data = await footballFetch<StandingsResponse>('/competitions/WC/standings')
    setCache(CACHE_KEY, data, TTL)
    return NextResponse.json<CachedResponse<StandingsResponse>>({ data, stale: false })
  } catch {
    const staleData = getCache<StandingsResponse>(CACHE_KEY)
    if (staleData) return NextResponse.json<CachedResponse<StandingsResponse>>({ data: staleData, stale: true })
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 502 })
  }
}
