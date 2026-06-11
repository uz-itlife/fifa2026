import { NextResponse } from 'next/server'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { TeamDetail, CachedResponse } from '@/types/football'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const key = `team-${id}`
  const cached = getCache<TeamDetail>(key)
  if (cached) return NextResponse.json<CachedResponse<TeamDetail>>({ data: cached, stale: false })
  try {
    const data = await footballFetch<TeamDetail>(`/teams/${id}`)
    setCache(key, data, 3600)
    return NextResponse.json<CachedResponse<TeamDetail>>({ data, stale: false })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 502 })
  }
}
