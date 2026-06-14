import useSWR from 'swr'
import type { CachedResponse, MatchesResponse } from '@/types/football'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useLiveMatches() {
  const { data, error, isLoading } = useSWR<CachedResponse<MatchesResponse>>(
    '/api/live',
    fetcher,
    { refreshInterval: 30_000 }
  )
  return {
    matches: data?.data?.matches ?? [],
    stale: data?.stale ?? false,
    isLoading,
    error,
  }
}
