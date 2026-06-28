'use client'
import { useStandings } from '@/hooks/useStandings'
import Link from 'next/link'
import { tlaToFlag } from '@/lib/flag-utils'
import { teamRu } from '@/lib/russian-teams'

export default function TeamsPage() {
  const { standings } = useStandings()
  const teams = standings.flatMap(g =>
    g.table.map(r => ({
      ...r.team,
      group: (g.group ?? '').replace(/^GROUP[_\s]*/i, ''),
    }))
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Команды</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {teams.map(team => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <div className="relative glass rounded-xl p-4 border border-light-border dark:border-dark-border text-center overflow-hidden hover:border-gold transition-colors hover:scale-[1.02] group">
              {team.crest && (
                <img
                  src={team.crest}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-contain opacity-[0.18] pointer-events-none select-none group-hover:opacity-[0.28] transition-opacity duration-300"
                />
              )}
              <div className="relative z-10">
                <div className="text-3xl mb-2">{tlaToFlag(team.tla)}</div>
                <p className="text-sm font-semibold truncate leading-tight">
                  {teamRu(team.tla, team.shortName)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Группа {team.group}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
