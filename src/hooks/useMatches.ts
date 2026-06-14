import useSWR from 'swr'
import type { CachedResponse, MatchesResponse } from '@/types/football'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMatches(params?: { status?: string; team?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.team) qs.set('team', params.team)
  const url = `/api/matches${qs.toString() ? `?${qs}` : ''}`

  const { data, error, isLoading } = useSWR<CachedResponse<MatchesResponse>>(
    url, fetcher, { refreshInterval: 60_000 }
  )
  return { matches: data?.data?.matches ?? [], stale: data?.stale ?? false, isLoading, error }
}
