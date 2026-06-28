import type { Standing } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { teamRu } from '@/lib/russian-teams'

interface Props {
  rows: Standing[]
  highlightTla?: string
  showAll?: boolean
  qualifiedThirdTlas?: Set<string>
}

function posBadge(pos: number, tla: string, qualifiedThirds?: Set<string>): string {
  if (pos === 1) return 'bg-amber-500 text-white'
  if (pos === 2) return 'bg-green-500 text-white'
  if (pos === 3) return (qualifiedThirds === undefined || qualifiedThirds.has(tla)) ? 'bg-sky-500 text-white' : 'bg-gray-400 text-white'
  return 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
}

function rowStyle(pos: number, tla: string, highlighted: boolean, qualifiedThirds?: Set<string>): string {
  if (highlighted) return 'bg-blue-900/20 border-l-2 border-l-blue-400'
  if (pos === 1) return 'border-l-2 border-l-amber-500'
  if (pos === 2) return 'border-l-2 border-l-green-500'
  if (pos === 3) {
    if (qualifiedThirds === undefined || qualifiedThirds.has(tla)) return 'border-l-2 border-l-sky-500'
    return 'opacity-40'
  }
  return 'opacity-40'
}

export function StandingsTable({ rows, highlightTla, showAll, qualifiedThirdTlas }: Props) {
  if (rows.length === 0) {
    return <p className="text-xs text-gray-500 py-3 text-center">Нет данных</p>
  }

  const sm = showAll ? '' : 'hidden sm:table-cell'
  const md = showAll ? '' : 'hidden md:table-cell'
  const lg = showAll ? '' : 'hidden lg:table-cell'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-widest text-gray-500 border-b border-light-border dark:border-dark-border">
            <th className="py-2 text-left w-8">#</th>
            <th className="py-2 text-left">Команда</th>
            <th className="py-2 text-center w-8">И</th>
            <th className={`py-2 text-center w-8 ${sm}`}>В</th>
            <th className={`py-2 text-center w-8 ${sm}`}>Н</th>
            <th className={`py-2 text-center w-8 ${sm}`}>П</th>
            <th className={`py-2 text-center w-8 ${lg}`}>ГЗ</th>
            <th className={`py-2 text-center w-8 ${lg}`}>ГП</th>
            <th className={`py-2 text-center w-10 ${md}`}>РГ</th>
            <th className="py-2 text-center w-8 font-bold text-gold">О</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const highlighted = !!(highlightTla && row.team.tla === highlightTla)
            const gdSign = row.goalDifference > 0 ? '+' : ''
            return (
              <tr
                key={row.team.id}
                data-testid={`standing-row-${row.position}`}
                className={`border-b border-light-border/50 dark:border-dark-border/50 transition-colors ${rowStyle(row.position, row.team.tla, highlighted, qualifiedThirdTlas)}`}
              >
                <td className="py-2 pr-1">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${posBadge(row.position, row.team.tla, qualifiedThirdTlas)}`}>
                    {row.position}
                  </span>
                </td>
                <td className="py-2">
                  <TeamFlag tla={row.team.tla} name={teamRu(row.team.tla, row.team.shortName)} crest={row.team.crest} size="sm" />
                </td>
                <td className="py-2 text-center text-gray-400">{row.playedGames}</td>
                <td className={`py-2 text-center text-win ${sm}`}>{row.won}</td>
                <td className={`py-2 text-center text-draw ${sm}`}>{row.draw}</td>
                <td className={`py-2 text-center text-loss ${sm}`}>{row.lost}</td>
                <td className={`py-2 text-center text-gray-400 ${lg}`}>{row.goalsFor}</td>
                <td className={`py-2 text-center text-gray-400 ${lg}`}>{row.goalsAgainst}</td>
                <td className={[
                  `py-2 text-center text-xs ${md}`,
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
