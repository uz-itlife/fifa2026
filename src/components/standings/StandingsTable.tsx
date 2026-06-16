import type { Standing } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { teamRu } from '@/lib/russian-teams'

interface Props {
  rows: Standing[]
  highlightTla?: string
}

export function StandingsTable({ rows, highlightTla }: Props) {
  if (rows.length === 0) {
    return <p className="text-xs text-gray-500 py-3 text-center">Нет данных</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-widest text-gray-500 border-b border-light-border dark:border-dark-border">
            <th className="py-2 text-left w-6">#</th>
            <th className="py-2 text-left">Команда</th>
            <th className="py-2 text-center w-8">И</th>
            <th className="py-2 text-center w-8 hidden sm:table-cell">В</th>
            <th className="py-2 text-center w-8 hidden sm:table-cell">Н</th>
            <th className="py-2 text-center w-8 hidden sm:table-cell">П</th>
            <th className="py-2 text-center w-8 hidden lg:table-cell">ГЗ</th>
            <th className="py-2 text-center w-8 hidden lg:table-cell">ГП</th>
            <th className="py-2 text-center w-10 hidden md:table-cell">РГ</th>
            <th className="py-2 text-center w-8 font-bold text-gold">О</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isHighlighted = highlightTla && row.team.tla === highlightTla
            const qualifying = i < 2
            const gdSign = row.goalDifference > 0 ? '+' : ''

            return (
              <tr
                key={row.team.id}
                data-testid={`standing-row-${row.position}`}
                className={[
                  'border-b border-light-border/50 dark:border-dark-border/50 transition-colors',
                  isHighlighted
                    ? 'bg-blue-900/20 border-l-2 border-l-blue-400'
                    : qualifying
                    ? 'border-l-2 border-l-green-500 bg-green-500/5'
                    : i >= 3
                    ? 'opacity-50'
                    : '',
                ].filter(Boolean).join(' ')}
              >
                <td className="py-2 text-gray-500 text-xs">{row.position}</td>
                <td className="py-2">
                  <TeamFlag
                    tla={row.team.tla}
                    name={teamRu(row.team.tla, row.team.shortName)}
                    crest={row.team.crest}
                    size="sm"
                  />
                </td>
                <td className="py-2 text-center text-gray-400">{row.playedGames}</td>
                <td className="py-2 text-center text-win hidden sm:table-cell">{row.won}</td>
                <td className="py-2 text-center text-draw hidden sm:table-cell">{row.draw}</td>
                <td className="py-2 text-center text-loss hidden sm:table-cell">{row.lost}</td>
                <td className="py-2 text-center text-gray-400 hidden lg:table-cell">{row.goalsFor}</td>
                <td className="py-2 text-center text-gray-400 hidden lg:table-cell">{row.goalsAgainst}</td>
                <td className={[
                  'py-2 text-center text-xs hidden md:table-cell',
                  row.goalDifference > 0 ? 'text-green-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-gray-400',
                ].join(' ')}>
                  {gdSign}{row.goalDifference}
                </td>
                <td className="py-2 text-center font-bold text-gold">{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
