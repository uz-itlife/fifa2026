'use client'
import { useParams } from 'next/navigation'
import { useStandings } from '@/hooks/useStandings'
import { useMatches } from '@/hooks/useMatches'
import { StandingsTable } from '@/components/standings/StandingsTable'
import { MatchCard } from '@/components/matches/MatchCard'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { getBest8ThirdPlace } from '@/lib/standings-utils'

// Normalise group string to just the letter: 'GROUP_A', 'Group A', 'a' → 'A'
function groupLetter(g: string | null | undefined): string {
  if (!g) return ''
  return g.replace(/^group[_\s]*/i, '').trim().toUpperCase()
}

export default function GroupPage() {
  const { id } = useParams<{ id: string }>()
  const letter = id.toUpperCase()

  const { standings, stale, isLoading: standingsLoading } = useStandings()
  const { matches, isLoading: matchesLoading } = useMatches()

  const group = standings.find(g => groupLetter(g.group) === letter)
  const qualifiedThirdTlas = getBest8ThirdPlace(standings)

  // Match group field can be 'GROUP_A', 'Group A', or just 'A'
  const groupMatches = matches
    .filter(m => groupLetter(m.group) === letter)
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

  if (standingsLoading) {
    return <div className="text-gray-500 text-center py-20">Загрузка...</div>
  }

  if (!group) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Группа {letter} не найдена</p>
        <p className="text-gray-500 text-sm mt-2">Данные ещё не загружены</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {stale && <StaleDataBanner />}

      <h1 className="text-2xl font-bold mb-6">Группа {letter}</h1>

      {/* Full standings table */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border mb-6">
        <StandingsTable
          rows={group.table}
          highlightTla={letter === 'K' ? 'UZB' : undefined}
          showAll
          qualifiedThirdTlas={qualifiedThirdTlas}
        />
      </div>

      {/* Group matches */}
      <h2 className="text-lg font-semibold mb-3">Матчи группы {letter}</h2>
      {matchesLoading ? (
        <div className="text-gray-500 text-sm text-center py-8">Загрузка матчей...</div>
      ) : groupMatches.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">Матчи не найдены</p>
      ) : (
        <div className="flex flex-col gap-3">
          {groupMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}
