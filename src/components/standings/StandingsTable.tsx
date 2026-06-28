import type { Standing } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { teamRu } from '@/lib/russian-teams'

interface Props {
  rows: Standing[]
  highlightTla?: string
  showAll?: boolean
}

function posBadge(pos: number) {
  if (pos === 1) return 'bg-gold'
  if (pos === 2) return 'bg-green-500'
  if (pos === 3) return 'bg-blue-400'
  return 'bg-gray-400'
}

function rowStyle(pos: number, highlighted: boolean) {
  if (highlighted) return 'bg-blue-900/20 border-l-2 border-l-blue-400'
  if (pos === 1) return 'border-l-2 border-l-gold bg-gold/5'
  if (pos === 2) return 'border-l-2 border-l-green-500 bg-green-500/5'
  if (pos === 3) return 'border-l-2 border-l-blue-400 bg-blue-400/5'
  return 'opacity-50'
}

export function StandingsTable({ rows, highlightTla, showAll }: Props) {
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
                className={`border-b border-light-border/50 dark:border-dark-border/50 transition-colors ${rowStyle(row.position, highlighted)}`}
              >
                <td className="py-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-sm shrink-0 ${posBadge(row.position)}`} />
                    <span className="text-gray-500">{row.position}</span>
                  </div>
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
      {!showAll && (
        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gold" />1-е место</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" />2-е место</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400" />3-е место (возм.)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-400" />Выбывает</span>
        </div>
      )}
    </div>
  )
}
