'use client'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type { CachedResponse, Match, Goal, Booking } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function GoalIcon() {
  return <span className="text-base">⚽</span>
}

function CardIcon({ card }: { card: Booking['card'] }) {
  if (card === 'RED_CARD') return <span className="inline-block w-3 h-4 bg-red-500 rounded-sm" />
  if (card === 'YELLOW_RED_CARD') return <span className="inline-block w-3 h-4 bg-orange-400 rounded-sm" />
  return <span className="inline-block w-3 h-4 bg-yellow-400 rounded-sm" />
}

function GoalsList({ goals, teamId }: { goals: Goal[]; teamId: number }) {
  const teamGoals = goals.filter(g => g.team.id === teamId)
  if (!teamGoals.length) return null
  return (
    <div className="mt-2 space-y-1">
      {teamGoals.map((g, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
          <GoalIcon />
          <span className="font-medium text-gray-200">{g.scorer?.name ?? 'Автогол'}</span>
          <span className="text-gray-500">{g.minute}{g.injuryTime ? `+${g.injuryTime}` : ''}&apos;</span>
          {g.assist && <span className="text-gray-500">(пас: {g.assist.name})</span>}
        </div>
      ))}
    </div>
  )
}

function BookingsList({ bookings, teamId }: { bookings: Booking[]; teamId: number }) {
  const teamBookings = bookings.filter(b => b.team.id === teamId)
  if (!teamBookings.length) return null
  return (
    <div className="mt-2 space-y-1">
      {teamBookings.map((b, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
          <CardIcon card={b.card} />
          <span className="font-medium text-gray-200">{b.player.name}</span>
          <span className="text-gray-500">{b.minute}&apos;</span>
        </div>
      ))}
    </div>
  )
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<CachedResponse<Match>>(`/api/matches/${id}`, fetcher, { refreshInterval: 120_000 })
  const match = data?.data

  if (!match) return <div className="text-gray-500 text-center py-20">Загрузка...</div>

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isUzb = match.homeTeam.tla === 'UZB' || match.awayTeam.tla === 'UZB'
  const goals = match.goals ?? []
  const bookings = match.bookings ?? []
  const hasEvents = goals.length > 0 || bookings.length > 0

  const groupLabel = match.group
    ? `Группа ${match.group.replace(/^GROUP[_\s]*/i, '').toUpperCase()}`
    : match.stage

  return (
    <div className="max-w-2xl mx-auto">
      {isUzb && isLive && <WatchBanner />}

      <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-light-border dark:border-dark-border mb-6">
        <div className="text-center text-xs text-gray-500 mb-4 flex items-center justify-center gap-2">
          <span>{groupLabel}</span>
          {isLive && <LiveBadge minute={match.minute} />}
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="text-center flex-1">
            <TeamFlag tla={match.homeTeam.tla} name={match.homeTeam.name} crest={match.homeTeam.crest} size="lg" />
          </div>
          <div className="text-4xl font-black text-gold shrink-0">
            {match.score.fullTime.home ?? '–'} : {match.score.fullTime.away ?? '–'}
          </div>
          <div className="text-center flex-1">
            <TeamFlag tla={match.awayTeam.tla} name={match.awayTeam.name} crest={match.awayTeam.crest} size="lg" />
          </div>
        </div>

        {match.score.halfTime.home !== null && (
          <p className="text-center text-xs text-gray-500 mt-3">
            Перерыв: {match.score.halfTime.home} : {match.score.halfTime.away}
          </p>
        )}
      </div>

      {hasEvents && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{match.homeTeam.shortName}</p>
              <GoalsList goals={goals} teamId={match.homeTeam.id} />
              <BookingsList bookings={bookings} teamId={match.homeTeam.id} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{match.awayTeam.shortName}</p>
              <GoalsList goals={goals} teamId={match.awayTeam.id} />
              <BookingsList bookings={bookings} teamId={match.awayTeam.id} />
            </div>
          </div>
        </div>
      )}

      {isUzb && !isLive && <WatchBanner compact />}
    </div>
  )
}
