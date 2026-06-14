import useSWR from 'swr'
import type { CachedResponse, ScorersResponse } from '@/types/football'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useScorers() {
  const { data, error, isLoading } = useSWR<CachedResponse<ScorersResponse>>(
    '/api/scorers', fetcher, { refreshInterval: 300_000 }
  )
  return { scorers: data?.data?.scorers ?? [], stale: data?.stale ?? false, isLoading, error }
}
