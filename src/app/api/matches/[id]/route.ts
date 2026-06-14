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
    const data = await footballFetch<Match>(`/matches/${id}`)
    setCache(key, data, 120)
    return NextResponse.json<CachedResponse<Match>>({ data, stale: false })
  } catch {
    const stale = getCache<Match>(key)
    if (stale) return NextResponse.json<CachedResponse<Match>>({ data: stale, stale: true })
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 502 })
  }
}
