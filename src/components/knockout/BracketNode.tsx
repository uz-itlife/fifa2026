import Link from 'next/link'
import type { Match } from '@/types/football'
import { LiveBadge } from '@/components/ui/LiveBadge'

interface Props { match: Match | null; label?: string }

export function BracketNode({ match, label }: Props) {
  if (!match) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-light-border/40 dark:border-dark-border/40 min-w-[160px] opacity-40">
        <p className="text-xs text-gray-600 text-center">{label ?? 'TBD'}</p>
      </div>
    )
  }
  const isLive = match.status === 'IN_PLAY'
  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-light-border dark:border-dark-border min-w-[180px] hover:border-gold transition-colors cursor-pointer">
        {isLive && <div className="mb-1"><LiveBadge minute={match.minute} /></div>}
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="font-medium truncate">{match.homeTeam.shortName}</span>
          <span className={`font-bold ml-2 ${match.score.winner === 'HOME_TEAM' ? 'text-win' : ''}`}>
            {match.score.fullTime.home ?? '–'}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium truncate">{match.awayTeam.shortName}</span>
          <span className={`font-bold ml-2 ${match.score.winner === 'AWAY_TEAM' ? 'text-win' : ''}`}>
            {match.score.fullTime.away ?? '–'}
          </span>
        </div>
      </div>
    </Link>
  )
}
