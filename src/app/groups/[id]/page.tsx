'use client'
import { useParams } from 'next/navigation'
import { useStandings } from '@/hooks/useStandings'
import { useMatches } from '@/hooks/useMatches'
import { StandingsTable } from '@/components/standings/StandingsTable'
import { MatchCard } from '@/components/matches/MatchCard'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'

export default function GroupPage() {
  const { id } = useParams<{ id: string }>()
  const groupKey = `GROUP_${id.toUpperCase()}`
  const { standings, stale } = useStandings()
  const { matches } = useMatches()

  const group = standings.find(g => g.group === groupKey)
  const groupMatches = matches.filter(m => m.group === groupKey)

  if (!group) return <div className="text-gray-500 text-center py-20">Загрузка...</div>

  return (
    <div className="max-w-2xl mx-auto">
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-6">Группа {id.toUpperCase()}</h1>
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border mb-6">
        <StandingsTable rows={group.table} highlightTla={id.toUpperCase() === 'K' ? 'UZB' : undefined} showAll />
      </div>
      <h2 className="text-lg font-semibold mb-3">Матчи</h2>
      <div className="flex flex-col gap-3">
        {groupMatches.map(m => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  )
}
