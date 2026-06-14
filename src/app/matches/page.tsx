'use client'
import { useMatches } from '@/hooks/useMatches'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { useFiltersStore } from '@/store/filters'
import { MatchCard } from '@/components/matches/MatchCard'
import { MatchFilters } from '@/components/matches/MatchFilters'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'

export default function MatchesPage() {
  const { statusFilter, groupFilter } = useFiltersStore()
  const { matches, stale, isLoading } = useMatches({ status: statusFilter })
  const { matches: liveMatches } = useLiveMatches()

  const filtered = matches.filter(m =>
    !groupFilter || m.group === groupFilter
  )

  const liveIds = new Set(liveMatches.map(m => m.id))
  const sorted = [...filtered].sort((a, b) => {
    if (liveIds.has(a.id) && !liveIds.has(b.id)) return -1
    if (!liveIds.has(a.id) && liveIds.has(b.id)) return 1
    return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
  })

  return (
    <div>
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-4">Расписание матчей</h1>
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
