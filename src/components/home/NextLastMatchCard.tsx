'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useMatches } from '@/hooks/useMatches'
import type { Match, CachedResponse, Goal, Booking } from '@/types/football'
import { teamRu } from '@/lib/russian-teams'
import { playerRu } from '@/lib/player-names-ru'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function getNextMatches(matches: Match[]) {
  return matches
    .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, 2)
}

function getLastMatches(matches: Match[]) {
  return matches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 2)
}

function buildCountdown(utcDate: string, now: number): string | null {
  const diff = new Date(utcDate).getTime() - now
  if (diff <= 0) return null
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (d > 0) return `${d}д ${h}ч ${m}м`
  if (h > 0) return `${h}ч ${m}м`
  return `${m}м`
}

function CrestBadge({ tla, name, crest }: { tla: string; name: string; crest: string | null }) {
  return (
    <div className="text-center flex-1">
      {crest ? (
        <img src={crest} alt={name} width={48} height={48}
          className="object-contain mx-auto mb-1"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
      ) : (
        <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
          {tla}
        </div>
      )}
      <p className="text-xs font-semibold leading-tight">{name}</p>
    </div>
  )
}

function ScorersList({ matchId }: { matchId: number }) {
  const { data } = useSWR<CachedResponse<Match>>(`/api/matches/${matchId}`, fetcher)
  const goals = data?.data?.goals ?? []
  const bookings = data?.data?.bookings ?? []

  if (goals.length === 0 && bookings.length === 0) return null

  type Ev =
    | { minute: number; kind: 'goal'; scorer: Goal['scorer'] }
    | { minute: number; kind: 'booking'; card: Booking['card']; player: Booking['player'] }

  const events: Ev[] = [
    ...goals.map(g => ({ minute: g.minute, kind: 'goal' as const, scorer: g.scorer })),
    ...bookings.map(b => ({ minute: b.minute, kind: 'booking' as const, card: b.card, player: b.player })),
  ].sort((a, b) => a.minute - b.minute)

  return (
    <div className="mt-3 space-y-0.5">
      {events.map((ev, i) =>
        ev.kind === 'goal' ? (
          <p key={i} className="text-xs text-gray-400 text-center">
            ⚽ {ev.scorer ? playerRu(ev.scorer.name) : 'Автогол'} <span className="text-gray-600">{ev.minute}'</span>
          </p>
        ) : (
          <p key={i} className="text-xs text-gray-400 text-center">
            {ev.card === 'RED_CARD' ? '🟥' : '🟨'} {playerRu(ev.player.name)} <span className="text-gray-600">{ev.minute}'</span>
          </p>
        )
      )}
    </div>
  )
}

export function NextLastMatchCard() {
  const { matches } = useMatches()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const nextMatches = getNextMatches(matches)
  const lastMatches = getLastMatches(matches)

  if (nextMatches.length === 0 && lastMatches.length === 0) return null

  return (
    <div className="glass rounded-xl border border-light-border dark:border-dark-border divide-y divide-light-border dark:divide-dark-border">
      {nextMatches.length > 0 ? nextMatches.map((m, idx) => {
        const date = new Date(m.utcDate).toLocaleString('ru-RU', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        })
        const countdown = buildCountdown(m.utcDate, now)
        return (
          <Link key={m.id} href={`/matches/${m.id}`}>
            <div className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                {idx === 0 ? 'Следующий матч' : 'Следующий матч 2'}
              </p>
              <div className="flex items-center justify-between gap-2">
                <CrestBadge tla={m.homeTeam.tla} crest={m.homeTeam.crest}
                  name={teamRu(m.homeTeam.tla, m.homeTeam.shortName)} />
                <div className="text-center shrink-0 px-2">
                  <p className="text-xs text-gray-400 leading-snug">{date}</p>
                  {countdown && <p className="text-gold font-bold text-sm mt-1">⏱ {countdown}</p>}
                </div>
                <CrestBadge tla={m.awayTeam.tla} crest={m.awayTeam.crest}
                  name={teamRu(m.awayTeam.tla, m.awayTeam.shortName)} />
              </div>
            </div>
          </Link>
        )
      }) : (
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Следующий матч</p>
          <p className="text-sm text-gray-500">Нет предстоящих матчей</p>
        </div>
      )}

      {lastMatches.length > 0 ? lastMatches.map((m, idx) => (
        <Link key={m.id} href={`/matches/${m.id}`}>
          <div className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
              {idx === 0 ? 'Последний матч' : 'Предыдущий матч'}
            </p>
            <div className="flex items-center justify-between gap-2">
              <CrestBadge tla={m.homeTeam.tla} crest={m.homeTeam.crest}
                name={teamRu(m.homeTeam.tla, m.homeTeam.shortName)} />
              <div className="text-center shrink-0 px-2">
                {(() => {
                  const hasET = m.score.extraTime?.home != null
                  const hasPen = m.score.penalties?.home != null
                  const s = hasET ? m.score.extraTime! : m.score.fullTime
                  return (
                    <>
                      <p className="text-3xl font-black text-gold">
                        {s.home ?? '–'} : {s.away ?? '–'}
                      </p>
                      <p className="text-xs mt-0.5">
                        {hasPen
                          ? <span className="text-blue-400 font-bold">СП · пен. {m.score.penalties!.home}:{m.score.penalties!.away}</span>
                          : hasET
                          ? <span className="text-amber-400 font-bold">ДВ</span>
                          : <span className="text-gray-500">Завершён</span>
                        }
                      </p>
                    </>
                  )
                })()}
              </div>
              <CrestBadge tla={m.awayTeam.tla} crest={m.awayTeam.crest}
                name={teamRu(m.awayTeam.tla, m.awayTeam.shortName)} />
            </div>
            <ScorersList matchId={m.id} />
          </div>
        </Link>
      )) : (
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Последний матч</p>
          <p className="text-sm text-gray-500">Матчи ещё не сыграны</p>
        </div>
      )}
    </div>
  )
}
