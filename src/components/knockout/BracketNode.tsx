import Link from 'next/link'
import type { Match } from '@/types/football'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { teamRu, cityRu } from '@/lib/russian-teams'
import { tlaToFlag } from '@/lib/flag-utils'
import { resolveScore } from '@/lib/match-utils'

interface Props { match: Match | null; label?: string; seeding?: string; compact?: boolean }

export function BracketNode({ match, label, seeding, compact }: Props) {
  if (!match) {
    return (
      <div className={`glass rounded-lg border border-light-border/40 dark:border-dark-border/40 opacity-60 ${compact ? 'p-2 min-w-[148px]' : 'p-3 min-w-[190px]'}`}>
        {label && !compact && <p className="text-xs text-gray-500 text-center mb-1">{label}</p>}
        {seeding && (
          <p className={`text-gray-400 text-center leading-tight ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{seeding}</p>
        )}
      </div>
    )
  }
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const date = new Date(match.utcDate).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Tashkent',
  })
  const homeRu = teamRu(match.homeTeam.tla, match.homeTeam.shortName)
  const awayRu = teamRu(match.awayTeam.tla, match.awayTeam.shortName)

  const { main, hasPen, pen } = resolveScore(match.score)
  const hasScore = isFinished || isLive

  if (compact) {
    return (
      <Link href={`/matches/${match.id}`}>
        <div className="glass rounded-lg border border-light-border dark:border-dark-border hover:border-gold transition-colors cursor-pointer p-2 min-w-[148px]">
          <div className="text-[9px] text-gray-400 mb-0.5 truncate">
            {isLive ? <LiveBadge minute={match.minute} /> : date}
          </div>
          <div className="flex justify-between items-center text-[11px] mb-0.5">
            <span className="font-medium truncate"><span className="mr-0.5">{tlaToFlag(match.homeTeam.tla)}</span>{homeRu}</span>
            <span className={`font-bold ml-1 tabular-nums shrink-0 ${match.score.winner === 'HOME_TEAM' ? 'text-win' : match.score.winner === 'AWAY_TEAM' ? 'text-loss' : isFinished ? 'text-white' : ''}`}>
              {hasScore ? (hasPen && pen ? pen.home : main.home) ?? '–' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-medium truncate"><span className="mr-0.5">{tlaToFlag(match.awayTeam.tla)}</span>{awayRu}</span>
            <span className={`font-bold ml-1 tabular-nums shrink-0 ${match.score.winner === 'AWAY_TEAM' ? 'text-win' : match.score.winner === 'HOME_TEAM' ? 'text-loss' : isFinished ? 'text-white' : ''}`}>
              {hasScore ? (hasPen && pen ? pen.away : main.away) ?? '–' : ''}
            </span>
          </div>
          {hasPen && pen && isFinished && (
            <div className="text-[9px] text-gray-400 text-right mt-0.5">{main.home}:{main.away} осн.</div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="glass rounded-lg border border-light-border dark:border-dark-border hover:border-gold transition-colors cursor-pointer p-3 min-w-[190px]">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
          {isLive ? <LiveBadge minute={match.minute} /> : <span>{date}</span>}
        </div>
        <div className="flex items-center justify-between mb-1">
          <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} size="sm" />
          <span className={`font-bold ml-2 tabular-nums text-sm shrink-0 ${match.score.winner === 'HOME_TEAM' ? 'text-win' : match.score.winner === 'AWAY_TEAM' ? 'text-loss' : isFinished ? 'text-white' : ''}`}>
            {hasScore ? (hasPen && pen ? pen.home : main.home) ?? '–' : ''}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <TeamFlag tla={match.awayTeam.tla} name={awayRu} crest={match.awayTeam.crest} size="sm" />
          <span className={`font-bold ml-2 tabular-nums text-sm shrink-0 ${match.score.winner === 'AWAY_TEAM' ? 'text-win' : match.score.winner === 'HOME_TEAM' ? 'text-loss' : isFinished ? 'text-white' : ''}`}>
            {hasScore ? (hasPen && pen ? pen.away : main.away) ?? '–' : ''}
          </span>
        </div>
        {hasPen && pen && isFinished && (
          <p className="text-[10px] text-gray-400 mt-1 text-right">{main.home}:{main.away} осн.</p>
        )}
        {match.venue?.city && (
          <p className="text-[10px] text-gray-400 mt-1 truncate">
            📍 {cityRu(match.venue.city) ?? match.venue.city}
          </p>
        )}
      </div>
    </Link>
  )
}
