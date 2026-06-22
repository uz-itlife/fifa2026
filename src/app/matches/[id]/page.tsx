'use client'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type { CachedResponse, Match, Goal, Booking } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'
import { teamRu } from '@/lib/russian-teams'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type TimelineItem =
  | { kind: 'goal'; minute: number; injury: number | null; goal: Goal }
  | { kind: 'card'; minute: number; injury: null; booking: Booking }

function buildTimeline(goals: Goal[], bookings: Booking[]): TimelineItem[] {
  const items: TimelineItem[] = [
    ...goals.map(g => ({
      kind: 'goal' as const,
      minute: g.minute,
      injury: g.injuryTime ?? null,
      goal: g,
    })),
    ...bookings.map(b => ({
      kind: 'card' as const,
      minute: b.minute,
      injury: null,
      booking: b,
    })),
  ]
  return items.sort((a, b) => a.minute - b.minute || (a.injury ?? 0) - (b.injury ?? 0))
}

function isHomeEvent(teamName: string, teamId: number, homeName: string, homeId: number) {
  return teamId === homeId || teamName === homeName
}

function BallIcon() {
  return (
    <svg viewBox="0 0 24 24" className="inline-block w-4 h-4 align-middle shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="white" stroke="black" strokeWidth="1.2" />
      <polygon points="12,7 15.5,9.6 14.3,13.6 9.7,13.6 8.5,9.6" fill="black" />
      <path d="M12 7 L12 3 M15.5 9.6 L19.5 8.2 M14.3 13.6 L16.8 17.2 M9.7 13.6 L7.2 17.2 M8.5 9.6 L4.5 8.2" stroke="black" strokeWidth="1" />
    </svg>
  )
}

function CardIcon({ card }: { card: Booking['card'] }) {
  if (card === 'YELLOW_RED_CARD') {
    return (
      <span className="inline-flex -space-x-1 align-middle shrink-0">
        <span className="w-2 h-3.5 bg-yellow-400 rounded-[1px]" />
        <span className="w-2 h-3.5 bg-red-600 rounded-[1px]" />
      </span>
    )
  }
  const color = card === 'RED_CARD' ? 'bg-red-600' : 'bg-yellow-400'
  return <span className={`inline-block w-2.5 h-3.5 rounded-[1px] align-middle shrink-0 ${color}`} />
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<CachedResponse<Match>>(
    `/api/matches/${id}`,
    fetcher,
    { refreshInterval: 60_000 }
  )
  const match = data?.data

  if (!match) {
    return <div className="text-gray-500 text-center py-20">Загрузка...</div>
  }

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const isUzb = match.homeTeam.tla === 'UZB' || match.awayTeam.tla === 'UZB'

  const goals = match.goals ?? []
  const bookings = match.bookings ?? []
  const timeline = buildTimeline(goals, bookings)

  const groupLabel = match.group
    ? `Группа ${match.group.replace(/^GROUP[_\s]*/i, '').toUpperCase()}`
    : (match.stage ?? '').replace(/_/g, ' ')

  const homeRu = teamRu(match.homeTeam.tla, match.homeTeam.shortName)
  const awayRu = teamRu(match.awayTeam.tla, match.awayTeam.shortName)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {isUzb && isLive && <WatchBanner />}

      {/* Score header */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-light-border dark:border-dark-border">
        <div className="flex items-center justify-center gap-3 mb-5 text-xs text-gray-500">
          <span>{groupLabel}</span>
          <span>·</span>
          {isLive
            ? <LiveBadge minute={match.minute} />
            : isFinished
            ? <span className="text-green-500 font-medium">Завершён</span>
            : <span>{new Date(match.utcDate).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          }
        </div>

        {match.venue?.name && (
          <div className="text-center text-xs text-gray-500 mb-4">
            {match.venue.name}
            {match.venue.city && `, ${match.venue.city}`}
            {match.venue.country && `, ${match.venue.country}`}
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} size="lg" />
          </div>

          {/* Score */}
          <div className="text-center shrink-0">
            <div className="text-5xl font-black text-gold tabular-nums leading-none">
              {match.score.fullTime.home ?? '–'} : {match.score.fullTime.away ?? '–'}
            </div>
            {match.score.halfTime.home !== null && (
              <div className="text-xs text-gray-500 mt-2">
                Перерыв {match.score.halfTime.home} : {match.score.halfTime.away}
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <TeamFlag tla={match.awayTeam.tla} name={awayRu} crest={match.awayTeam.crest} size="lg" />
          </div>
        </div>
      </div>

      {/* Events timeline */}
      {timeline.length > 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
          <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">События матча</h3>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_48px_1fr] text-[10px] text-gray-500 uppercase tracking-wider px-4 py-2 border-b border-light-border/50 dark:border-dark-border/50">
            <span>{homeRu}</span>
            <span className="text-center">мин</span>
            <span className="text-right">{awayRu}</span>
          </div>

          <div className="divide-y divide-light-border/40 dark:divide-dark-border/40">
            {timeline.map((item, i) => {
              const home = item.kind === 'goal'
                ? isHomeEvent(item.goal.team.name, item.goal.team.id, match.homeTeam.name, match.homeTeam.id)
                : isHomeEvent(item.booking.team.name, item.booking.team.id, match.homeTeam.name, match.homeTeam.id)

              const minuteStr = `${item.minute}${item.injury ? `+${item.injury}` : ''}'`

              if (item.kind === 'goal') {
                return (
                  <div key={i} className="grid grid-cols-[1fr_48px_1fr] items-center px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                    {/* Home side */}
                    <div className={home ? 'text-left' : ''}>
                      {home && (
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white inline-flex items-center gap-1.5">
                            <BallIcon /> {item.goal.scorer?.name ?? 'Автогол'}
                            <span className="text-[10px] font-bold text-gold tracking-wide">ГОЛ</span>
                          </span>
                          {item.goal.assist && (
                            <div className="text-[11px] text-gray-500">
                              Пас: {item.goal.assist.name}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Minute */}
                    <div className="text-center text-xs font-mono text-gold font-bold">{minuteStr}</div>
                    {/* Away side */}
                    <div className={!home ? 'text-right' : ''}>
                      {!home && (
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white inline-flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-gold tracking-wide">ГОЛ</span>
                            {item.goal.scorer?.name ?? 'Автогол'} <BallIcon />
                          </span>
                          {item.goal.assist && (
                            <div className="text-[11px] text-gray-500">
                              Пас: {item.goal.assist.name}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }

              // Card event
              return (
                <div key={i} className="grid grid-cols-[1fr_48px_1fr] items-center px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                  <div>
                    {home && (
                      <span className="text-sm text-gray-700 dark:text-gray-300 inline-flex items-center gap-1.5">
                        <CardIcon card={item.booking.card} /> {item.booking.player.name}
                      </span>
                    )}
                  </div>
                  <div className="text-center text-xs font-mono text-gray-500">{minuteStr}</div>
                  <div className="text-right">
                    {!home && (
                      <span className="text-sm text-gray-700 dark:text-gray-300 inline-flex items-center gap-1.5 justify-end">
                        {item.booking.player.name} <CardIcon card={item.booking.card} />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (isFinished || isLive) && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-light-border dark:border-dark-border text-center space-y-1">
          <p className="text-sm text-gray-400">
            {isLive ? '⏱ Матч идёт — события появятся здесь' : 'Детальная статистика недоступна в бесплатном плане API'}
          </p>
          <p className="text-xs text-gray-500">
            Счёт: {match.score.fullTime.home} : {match.score.fullTime.away}
            {match.score.halfTime.home !== null && ` (перерыв ${match.score.halfTime.home}:${match.score.halfTime.away})`}
          </p>
        </div>
      )}

      {isUzb && !isLive && <WatchBanner compact />}
    </div>
  )
}
