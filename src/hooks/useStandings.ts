import useSWR from 'swr'
import type { CachedResponse, StandingsResponse } from '@/types/football'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useStandings() {
  const { data, error, isLoading } = useSWR<CachedResponse<StandingsResponse>>(
    '/api/standings',
    fetcher,
    { refreshInterval: 60_000 }
  )
  return {
    standings: data?.data?.standings ?? [],
    stale: data?.stale ?? false,
    isLoading,
    error,
  }
}
