import type { Standing } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { teamRu } from '@/lib/russian-teams'

interface Props {
  rows: Standing[]
  highlightTla?: string
}

export function StandingsTable({ rows, highlightTla }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-widest text-gray-500 border-b border-dark-border dark:border-dark-border border-light-border">
            <th className="py-2 text-left w-6">#</th>
            <th className="py-2 text-left">Команда</th>
            <th className="py-2 text-center w-8">И</th>
            <th className="py-2 text-center w-8 hidden sm:table-cell">В</th>
            <th className="py-2 text-center w-8 hidden sm:table-cell">Н</th>
            <th className="py-2 text-center w-8 hidden sm:table-cell">П</th>
            <th className="py-2 text-center w-12 hidden md:table-cell">ГЗ:ГП</th>
            <th className="py-2 text-center w-8 font-bold text-gold">ОЧ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isUzb = highlightTla && row.team.tla === highlightTla
            const qualifying = i < 2
            return (
              <tr
                key={row.team.id}
                className={[
                  'border-b border-dark-border/50 dark:border-dark-border/50 transition-colors',
                  isUzb ? 'bg-blue-900/20 border-l-2 border-l-blue-400' : '',
                  qualifying && !isUzb ? 'border-l-2 border-l-gold/60' : '',
                  i >= 3 ? 'opacity-50' : '',
                ].join(' ')}
              >
                <td className="py-2 text-gray-500 text-xs">{row.position}</td>
                <td className="py-2">
                  <TeamFlag tla={row.team.tla} name={teamRu(row.team.tla, row.team.shortName)} crest={row.team.crest} size="sm" />
                </td>
                <td className="py-2 text-center text-gray-400">{row.playedGames}</td>
                <td className="py-2 text-center text-win hidden sm:table-cell">{row.won}</td>
                <td className="py-2 text-center text-draw hidden sm:table-cell">{row.draw}</td>
                <td className="py-2 text-center text-loss hidden sm:table-cell">{row.lost}</td>
                <td className="py-2 text-center text-gray-400 hidden md:table-cell">{row.goalsFor}:{row.goalsAgainst}</td>
                <td className="py-2 text-center font-bold text-gold">{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
