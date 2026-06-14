'use client'
import { useStandings } from '@/hooks/useStandings'
import Link from 'next/link'

function tlaToFlag(tla: string) {
  try { return tla.toUpperCase().split('').map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('') }
  catch { return '🏳️' }
}

export default function TeamsPage() {
  const { standings } = useStandings()
  const teams = standings.flatMap(g => g.table.map(r => ({ ...r.team, group: (g.group ?? '').replace('GROUP_', '') })))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Команды</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {teams.map(team => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border text-center hover:border-gold transition-colors hover:scale-[1.02]">
              <div className="text-3xl mb-2">{tlaToFlag(team.tla)}</div>
              <p className="text-sm font-semibold truncate">{team.shortName}</p>
              <p className="text-xs text-gray-500 mt-1">Группа {team.group}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
