import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { MatchesResponse, CachedResponse } from '@/types/football'
import matchStatsData from '@/data/match-stats.json'

type StatsMap = Record<string, { venue?: { name: string | null; city: string | null; country: string | null } | null }>
const stats = matchStatsData as StatsMap

function enrichVenues(data: MatchesResponse): MatchesResponse {
  return {
    ...data,
    matches: data.matches.map(m => {
      if (m.venue?.city) return m
      const s = stats[String(m.id)]
      if (s?.venue?.city) return { ...m, venue: s.venue }
      return m
    }),
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const team = searchParams.get('team') ?? ''
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (team) params.set('team', team)
  const qs = params.toString() ? `?${params}` : ''
  const CACHE_KEY = `matches${qs ? '-' + qs : '-all'}`

  const cached = getCache<MatchesResponse>(CACHE_KEY)
  if (cached) return NextResponse.json<CachedResponse<MatchesResponse>>({ data: cached, stale: false })
  try {
    const data = await footballFetch<MatchesResponse>(`/competitions/WC/matches${qs}`)
    const enriched = enrichVenues(data)
    setCache(CACHE_KEY, enriched, 60)
    return NextResponse.json<CachedResponse<MatchesResponse>>({ data: enriched, stale: false })
  } catch {
    const stale = getCache<MatchesResponse>(CACHE_KEY)
    if (stale) return NextResponse.json<CachedResponse<MatchesResponse>>({ data: stale, stale: true })
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 502 })
  }
}
