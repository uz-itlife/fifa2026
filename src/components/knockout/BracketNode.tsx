import Link from 'next/link'
import type { Match } from '@/types/football'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { teamRu, cityRu } from '@/lib/russian-teams'

interface Props { match: Match | null; label?: string; seeding?: string; compact?: boolean }

export function BracketNode({ match, label, seeding, compact }: Props) {
  if (!match) {
    return (
      <div className={`bg-white dark:bg-dark-card rounded-lg border border-light-border/40 dark:border-dark-border/40 opacity-60 ${compact ? 'p-2 min-w-[148px]' : 'p-3 min-w-[180px]'}`}>
        {label && !compact && <p className="text-xs text-gray-500 text-center mb-1">{label}</p>}
        {seeding && (
          <p className={`text-gray-400 text-center leading-tight ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{seeding}</p>
        )}
      </div>
    )
  }
  const isLive = match.status === 'IN_PLAY'
  return (
    <Link href={`/matches/${match.id}`}>
      <div className={`bg-white dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border hover:border-gold transition-colors cursor-pointer ${compact ? 'p-2 min-w-[148px]' : 'p-3 min-w-[180px]'}`}>
        {isLive && <div className="mb-1"><LiveBadge minute={match.minute} /></div>}
        <div className={`flex justify-between items-center mb-0.5 ${compact ? 'text-[11px]' : 'text-sm'}`}>
          <span className="font-medium truncate">{teamRu(match.homeTeam.tla, match.homeTeam.shortName)}</span>
          <span className={`font-bold ml-1 tabular-nums ${match.score.winner === 'HOME_TEAM' ? 'text-win' : ''}`}>
            {match.score.fullTime.home ?? '–'}
          </span>
        </div>
        <div className={`flex justify-between items-center ${compact ? 'text-[11px]' : 'text-sm'}`}>
          <span className="font-medium truncate">{teamRu(match.awayTeam.tla, match.awayTeam.shortName)}</span>
          <span className={`font-bold ml-1 tabular-nums ${match.score.winner === 'AWAY_TEAM' ? 'text-win' : ''}`}>
            {match.score.fullTime.away ?? '–'}
          </span>
        </div>
        {!compact && match.venue?.city && (
          <p className="text-[10px] text-gray-400 mt-1.5 truncate">
            📍 {cityRu(match.venue.city) ?? match.venue.city}
          </p>
        )}
      </div>
    </Link>
  )
}
