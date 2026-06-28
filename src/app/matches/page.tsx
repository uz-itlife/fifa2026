'use client'
import { useMatches } from '@/hooks/useMatches'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { useFiltersStore } from '@/store/filters'
import { MatchCard } from '@/components/matches/MatchCard'
import { MatchFilters } from '@/components/matches/MatchFilters'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { LiveBroadcastBar } from '@/components/ui/LiveBroadcastBar'

export default function MatchesPage() {
  const { statusFilter, groupFilter } = useFiltersStore()
  const { matches, stale, isLoading } = useMatches({ status: statusFilter })
  const { matches: liveMatches } = useLiveMatches()

  const filtered = matches.filter(m =>
    !groupFilter || m.group === groupFilter
  )

  const liveIds = new Set(liveMatches.map(m => m.id))
  const sorted = [...filtered].sort((a, b) => {
    const aLive = liveIds.has(a.id), bLive = liveIds.has(b.id)
    if (aLive !== bLive) return aLive ? -1 : 1
    const aUpcoming = a.status === 'SCHEDULED' || a.status === 'TIMED'
    const bUpcoming = b.status === 'SCHEDULED' || b.status === 'TIMED'
    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1
    const ta = new Date(a.utcDate).getTime(), tb = new Date(b.utcDate).getTime()
    return aUpcoming ? ta - tb : tb - ta
  })

  return (
    <div>
      {stale && <StaleDataBanner />}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Расписание матчей</h1>
        <LiveBroadcastBar />
      </div>
      <MatchFilters />
      {isLoading ? (
        <div className="text-gray-500 text-center py-20">Загрузка...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}
