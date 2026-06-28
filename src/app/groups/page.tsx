'use client'
import { useStandings } from '@/hooks/useStandings'
import { GroupCard } from '@/components/standings/GroupCard'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { getBest8ThirdPlace } from '@/lib/standings-utils'

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-3 w-16 bg-gray-700/50 rounded" />
        <div className="h-3 w-12 bg-gray-700/50 rounded" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-2 py-2 border-b border-light-border/30 dark:border-dark-border/30">
          <div className="w-4 h-3 bg-gray-700/50 rounded" />
          <div className="w-5 h-5 bg-gray-700/50 rounded-full" />
          <div className="w-20 h-3 bg-gray-700/50 rounded" />
          <div className="ml-auto flex gap-3">
            <div className="w-5 h-3 bg-gray-700/50 rounded" />
            <div className="w-5 h-3 bg-gray-700/50 rounded" />
            <div className="w-5 h-3 bg-gray-700/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function GroupsPage() {
  const { standings, stale, isLoading, error } = useStandings()

  const header = <h1 className="text-2xl font-bold mb-6">Групповой этап</h1>

  if (isLoading) {
    return (
      <div>
        {header}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {header}
        <div className="text-center py-20">
          <p className="text-lg text-gray-400 mb-2">Не удалось загрузить таблицы</p>
          <p className="text-sm text-gray-500">Попробуйте обновить страницу</p>
        </div>
      </div>
    )
  }

  if (standings.length === 0) {
    return (
      <div>
        {header}
        <div className="text-center py-20">
          <p className="text-lg text-gray-400 mb-2">Групповой этап ещё не начался</p>
          <p className="text-sm text-gray-500">Таблицы появятся после первых матчей</p>
        </div>
      </div>
    )
  }

  const qualifiedThirdTlas = getBest8ThirdPlace(standings)

  const sorted = [...standings].sort((a, b) => {
    if (a.group === 'GROUP_K') return -1
    if (b.group === 'GROUP_K') return 1
    return (a.group ?? '').localeCompare(b.group ?? '')
  })

  return (
    <div>
      {stale && <StaleDataBanner />}
      {header}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((group, i) => (
          <GroupCard
            key={group.group ?? i}
            group={group}
            highlight={group.group === 'GROUP_K'}
            index={i}
            qualifiedThirdTlas={qualifiedThirdTlas}
          />
        ))}
      </div>
    </div>
  )
}
