'use client'
import { useStandings } from '@/hooks/useStandings'
import { GroupCard } from '@/components/standings/GroupCard'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'

export default function GroupsPage() {
  const { standings, stale, isLoading } = useStandings()

  if (isLoading) return <div className="text-gray-500 text-center py-20">Загрузка...</div>

  const sorted = [...standings].sort((a, b) => {
    if (a.group === 'GROUP_K') return -1
    if (b.group === 'GROUP_K') return 1
    return (a.group ?? '').localeCompare(b.group ?? '')
  })

  return (
    <div>
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-6">Групповой этап</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map(group => (
          <GroupCard key={group.group ?? Math.random()} group={group} highlight={group.group === 'GROUP_K'} />
        ))}
      </div>
    </div>
  )
}
