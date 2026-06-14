import useSWR from 'swr'
import type { CachedResponse, MatchesResponse } from '@/types/football'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useUzbMatches() {
  const { data, error, isLoading } = useSWR<CachedResponse<MatchesResponse>>(
    '/api/matches?team=UZB', fetcher, { refreshInterval: 60_000 }
  )
  return { matches: data?.data?.matches ?? [], stale: data?.stale ?? false, isLoading, error }
}
