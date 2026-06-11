import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { MatchesResponse, CachedResponse } from '@/types/football'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const team = searchParams.get('team') ?? ''
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (team) params.set('team', team)
  const qs = params.toString() ? `?${params}` : ''
  const CACHE_KEY = `matches-${qs}`

  const cached = getCache<MatchesResponse>(CACHE_KEY)
  if (cached) return NextResponse.json<CachedResponse<MatchesResponse>>({ data: cached, stale: false })
  try {
    const data = await footballFetch<MatchesResponse>(`/competitions/WC/matches${qs}`)
    setCache(CACHE_KEY, data, 60)
    return NextResponse.json<CachedResponse<MatchesResponse>>({ data, stale: false })
  } catch {
    const stale = getCache<MatchesResponse>(CACHE_KEY)
    if (stale) return NextResponse.json<CachedResponse<MatchesResponse>>({ data: stale, stale: true })
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 502 })
  }
}
