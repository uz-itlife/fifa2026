'use client'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type { CachedResponse, Match, Goal, Booking } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'
import { teamRu } from '@/lib/russian-teams'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Event =
  | { kind: 'goal'; minute: number; injuryTime?: number | null; data: Goal }
  | { kind: 'booking'; minute: number; injuryTime?: number | null; data: Booking }

function buildTimeline(goals: Goal[], bookings: Booking[]): Event[] {
  const events: Event[] = [
    ...goals.map(g => ({ kind: 'goal' as const, minute: g.minute, injuryTime: g.injuryTime, data: g })),
    ...bookings.map(b => ({ kind: 'booking' as const, minute: b.minute, injuryTime: undefined, data: b })),
  ]
  return events.sort((a, b) => a.minute - b.minute)
}

function CardBox({ card }: { card: Booking['card'] }) {
  if (card === 'RED_CARD') return <span className="inline-block w-3 h-4 bg-red-500 rounded-sm shrink-0" />
  if (card === 'YELLOW_RED_CARD') return <span className="inline-block w-3 h-4 bg-orange-400 rounded-sm shrink-0" />
  return <span className="inline-block w-3 h-4 bg-yellow-400 rounded-sm shrink-0" />
}

function MinuteBadge({ minute, injury }: { minute: number; injury?: number | null }) {
  return (
    <span className="text-xs text-gray-500 font-mono w-10 shrink-0 text-right">
      {minute}{injury ? `+${injury}` : ''}&apos;
    </span>
  )
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<CachedResponse<Match>>(`/api/matches/${id}`, fetcher, { refreshInterval: 60_000 })
  const match = data?.data

  if (!match) return <div className="text-gray-500 text-center py-20">Загрузка...</div>

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const isUzb = match.homeTeam.tla === 'UZB' || match.awayTeam.tla === 'UZB'
  const goals = match.goals ?? []
  const bookings = match.bookings ?? []
  const timeline = buildTimeline(goals, bookings)

  const groupLabel = match.group
    ? `Группа ${match.group.replace(/^GROUP[_\s]*/i, '').toUpperCase()}`
    : match.stage?.replace(/_/g, ' ')

  const homeRu = teamRu(match.homeTeam.tla, match.homeTeam.shortName)
  const awayRu = teamRu(match.awayTeam.tla, match.awayTeam.shortName)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {isUzb && isLive && <WatchBanner />}

      {/* Score card */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-light-border dark:border-dark-border">
        <div className="text-center text-xs text-gray-500 mb-4 flex items-center justify-center gap-2">
          <span>{groupLabel}</span>
          {isLive && <LiveBadge minute={match.minute} />}
          {isFinished && <span className="text-gray-400">Завершён</span>}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-center flex-1">
            <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} size="lg" />
          </div>
          <div className="text-4xl font-black text-gold shrink-0 tabular-nums">
            {match.score.fullTime.home ?? '–'} : {match.score.fullTime.away ?? '–'}
          </div>
          <div className="text-center flex-1">
            <TeamFlag tla={match.awayTeam.tla} name={awayRu} crest={match.awayTeam.crest} size="lg" />
          </div>
        </div>

        {match.score.halfTime.home !== null && (
          <p className="text-center text-xs text-gray-500 mt-3">
            Перерыв: {match.score.halfTime.home} : {match.score.halfTime.away}
          </p>
        )}
      </div>

      {/* Timeline */}
      {timeline.length > 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">События матча</h3>
          <div className="space-y-2">
            {timeline.map((ev, i) => {
              const isHome = ev.kind === 'goal'
                ? ev.data.team.name === match.homeTeam.name || ev.data.team.id === match.homeTeam.id
                : ev.data.team.name === match.homeTeam.name || ev.data.team.id === match.homeTeam.id

              if (ev.kind === 'goal') {
                return (
                  <div key={i} className={['flex items-center gap-2', isHome ? 'flex-row' : 'flex-row-reverse'].join(' ')}>
                    <MinuteBadge minute={ev.minute} injury={ev.injuryTime} />
                    <span className="text-base shrink-0">⚽</span>
                    <div className={['flex-1', isHome ? 'text-left' : 'text-right'].join(' ')}>
                      <span className="text-sm font-semibold text-white">
                        {ev.data.scorer?.name ?? 'Автогол'}
                      </span>
                      {ev.data.assist && (
                        <span className="text-xs text-gray-500 ml-1.5">пас: {ev.data.assist.name}</span>
                      )}
                    </div>
                  </div>
                )
              }

              return (
                <div key={i} className={['flex items-center gap-2', isHome ? 'flex-row' : 'flex-row-reverse'].join(' ')}>
                  <MinuteBadge minute={ev.minute} />
                  <CardBox card={ev.data.card} />
                  <div className={['flex-1', isHome ? 'text-left' : 'text-right'].join(' ')}>
                    <span className="text-sm font-semibold text-white">{ev.data.player.name}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Goal summary under timeline */}
          <div className="mt-4 pt-3 border-t border-dark-border/50 flex justify-between text-xs text-gray-500">
            <div>
              {goals.filter(g => g.team.id === match.homeTeam.id || g.team.name === match.homeTeam.name)
                .map(g => `${g.scorer?.name ?? '?'} ${g.minute}'`).join(', ')}
            </div>
            <div className="text-right">
              {goals.filter(g => g.team.id === match.awayTeam.id || g.team.name === match.awayTeam.name)
                .map(g => `${g.scorer?.name ?? '?'} ${g.minute}'`).join(', ')}
            </div>
          </div>
        </div>
      ) : (isFinished || isLive) ? (
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border text-center text-sm text-gray-500">
          {isLive ? 'События матча обновляются...' : 'Подробная статистика недоступна'}
        </div>
      ) : null}

      {isUzb && !isLive && <WatchBanner compact />}
    </div>
  )
}
