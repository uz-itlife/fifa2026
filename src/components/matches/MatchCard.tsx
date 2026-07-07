import Link from 'next/link'
import type { Match } from '@/types/football'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'
import { teamRu, stageRu, cityRu } from '@/lib/russian-teams'
import { scoreClass } from '@/lib/match-utils'

const UZB_TLA = 'UZB'

interface Props { match: Match }

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
    <div className="glass rounded-xl p-4 border border-light-border dark:border-dark-border hover:scale-[1.01] transition-transform">
      <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
        <span>{match.group ? `Группа ${match.group.replace(/^GROUP[_\s]*/i, '').toUpperCase()}` : stageRu(match.stage)}</span>
        {isLive ? <LiveBadge minute={match.minute} /> : <span>{date}</span>}
      </div>
      {match.venue?.city && (
        <div className="text-[11px] text-gray-400 mb-2">📍 {cityRu(match.venue.city) ?? match.venue.city}</div>
      )}

      <Link href={`/matches/${match.id}`}>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} />
          </div>
          <div className="flex flex-col items-center justify-center shrink-0 w-24 gap-0.5">
            {hasScore ? (
              <>
                <div className="flex items-center gap-1 text-xl font-bold tabular-nums">
                  {(() => {
                    const hasET = match.score.extraTime?.home != null
                    const hasPen = match.score.penalties?.home != null
                    const s = hasET ? match.score.extraTime! : match.score.fullTime
                    return (
                      <>
                        <span className={`w-6 text-right ${scoreClass(match.score.winner, 'HOME')}`}>{s.home}</span>
                        <span className="text-gray-600">:</span>
                        <span className={`w-6 text-left ${scoreClass(match.score.winner, 'AWAY')}`}>{s.away}</span>
                        {hasPen && <span className="text-[10px] font-bold text-blue-400 ml-0.5">СП</span>}
                        {hasET && !hasPen && <span className="text-[10px] font-bold text-amber-400 ml-0.5">ДВ</span>}
                      </>
                    )
                  })()}
                </div>
                {match.score.penalties?.home != null && (
                  <div className="text-[11px] text-gray-500 tabular-nums">
                    пен. {match.score.penalties.home}:{match.score.penalties.away}
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-500 text-sm text-center">{date}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex justify-end text-right">
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
