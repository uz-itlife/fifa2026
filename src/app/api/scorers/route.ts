import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { ScorersResponse, CachedResponse } from '@/types/football'

export async function GET() {
  const key = 'scorers'
  const cached = getCache<ScorersResponse>(key)
  if (cached) return NextResponse.json<CachedResponse<ScorersResponse>>({ data: cached, stale: false })
  try {
    const data = await footballFetch<ScorersResponse>('/competitions/WC/scorers?limit=50')
    setCache(key, data, 300)
    return NextResponse.json<CachedResponse<ScorersResponse>>({ data, stale: false })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch scorers' }, { status: 502 })
  }
}
