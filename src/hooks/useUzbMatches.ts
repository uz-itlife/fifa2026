import useSWR from 'swr'
import type { CachedResponse, MatchesResponse } from '@/types/football'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useUzbMatches() {
  const { data, error, isLoading } = useSWR<CachedResponse<MatchesResponse>>(
    '/api/matches', fetcher, { refreshInterval: 60_000 }
  )
  const allMatches = data?.data?.matches ?? []
  const matches = allMatches.filter(
    m => m.homeTeam.tla === 'UZB' || m.awayTeam.tla === 'UZB'
  )
  return { matches, stale: data?.stale ?? false, isLoading, error }
}
