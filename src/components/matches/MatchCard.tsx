import Link from 'next/link'
import type { Match } from '@/types/football'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'
import { teamRu } from '@/lib/russian-teams'

const UZB_TLA = 'UZB'

interface Props { match: Match }

function scoreClass(winner: string | null | undefined, side: 'HOME' | 'AWAY'): string {
  if (!winner || winner === 'DRAW') return 'text-white'
  if (winner === 'HOME_TEAM') return side === 'HOME' ? 'text-green-500' : 'text-red-500'
  return side === 'AWAY' ? 'text-green-500' : 'text-red-500'
}

export function MatchCard({ match }: Props) {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const hasScore = isFinished || isLive
  const isUzbMatch = match.homeTeam.tla === UZB_TLA || match.awayTeam.tla === UZB_TLA
  const date = new Date(match.utcDate).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
  const homeRu = teamRu(match.homeTeam.tla, match.homeTeam.shortName)
  const awayRu = teamRu(match.awayTeam.tla, match.awayTeam.shortName)

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border hover:scale-[1.01] transition-transform">
      <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
        <span>{match.group ? `Группа ${match.group.replace(/^GROUP[_\s]*/i, '').toUpperCase()}` : match.stage}</span>
        {isLive ? <LiveBadge minute={match.minute} /> : <span>{date}</span>}
      </div>

      <Link href={`/matches/${match.id}`}>
        <div className="flex items-center justify-between gap-4">
          <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} />
          <div className="flex items-center gap-2 text-xl font-bold shrink-0">
            {hasScore ? (
              <>
                <span className={scoreClass(match.score.winner, 'HOME')}>
                  {match.score.fullTime.home}
                </span>
                <span className="text-gray-600">:</span>
                <span className={scoreClass(match.score.winner, 'AWAY')}>
                  {match.score.fullTime.away}
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-sm">{date}</span>
            )}
          </div>
          <div className="text-right">
            <TeamFlag tla={match.awayTeam.tla} name={awayRu} crest={match.awayTeam.crest} />
          </div>
        </div>
      </Link>

      {isUzbMatch && (
        <div className="mt-3">
          <WatchBanner compact />
        </div>
      )}
    </div>
  )
}
