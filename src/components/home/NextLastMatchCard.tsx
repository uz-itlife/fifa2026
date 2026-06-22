'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useMatches } from '@/hooks/useMatches'
import type { Match, CachedResponse } from '@/types/football'
import { teamRu } from '@/lib/russian-teams'
import { playerRu } from '@/lib/player-names-ru'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function getNextMatch(matches: Match[]) {
  return matches
    .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())[0] ?? null
}

function getLastMatch(matches: Match[]) {
  return matches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())[0] ?? null
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

  if (goals.length === 0) {
    return <p className="text-xs text-gray-500 text-center mt-2">Детальная статистика недоступна в бесплатном плане API</p>
  }

  return (
    <div className="mt-3 space-y-0.5">
      {goals.map((g, i) => (
        <p key={i} className="text-xs text-gray-400 text-center">
          ⚽ {g.scorer ? playerRu(g.scorer.name) : 'Автогол'} <span className="text-gray-600">{g.minute}'</span>
        </p>
      ))}
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

  const nextMatch = getNextMatch(matches)
  const lastMatch = getLastMatch(matches)

  const nextDate = nextMatch
    ? new Date(nextMatch.utcDate).toLocaleString('ru-RU', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : null
  const countdown = nextMatch ? buildCountdown(nextMatch.utcDate, now) : null

  if (!nextMatch && !lastMatch) return null

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border divide-y divide-light-border dark:divide-dark-border">
      {nextMatch ? (
        <Link href={`/matches/${nextMatch.id}`}>
          <div className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Следующий матч</p>
            <div className="flex items-center justify-between gap-2">
              <CrestBadge tla={nextMatch.homeTeam.tla} crest={nextMatch.homeTeam.crest}
                name={teamRu(nextMatch.homeTeam.tla, nextMatch.homeTeam.shortName)} />
              <div className="text-center shrink-0 px-2">
                <p className="text-xs text-gray-400 leading-snug">{nextDate}</p>
                {countdown && <p className="text-gold font-bold text-sm mt-1">⏱ {countdown}</p>}
              </div>
              <CrestBadge tla={nextMatch.awayTeam.tla} crest={nextMatch.awayTeam.crest}
                name={teamRu(nextMatch.awayTeam.tla, nextMatch.awayTeam.shortName)} />
            </div>
          </div>
        </Link>
      ) : (
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Следующий матч</p>
          <p className="text-sm text-gray-500">Нет предстоящих матчей</p>
        </div>
      )}

      {lastMatch ? (
        <Link href={`/matches/${lastMatch.id}`}>
          <div className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Последний матч</p>
            <div className="flex items-center justify-between gap-2">
              <CrestBadge tla={lastMatch.homeTeam.tla} crest={lastMatch.homeTeam.crest}
                name={teamRu(lastMatch.homeTeam.tla, lastMatch.homeTeam.shortName)} />
              <div className="text-center shrink-0 px-2">
                <p className="text-3xl font-black text-gold">
                  {lastMatch.score.fullTime.home ?? '–'} : {lastMatch.score.fullTime.away ?? '–'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Завершён</p>
              </div>
              <CrestBadge tla={lastMatch.awayTeam.tla} crest={lastMatch.awayTeam.crest}
                name={teamRu(lastMatch.awayTeam.tla, lastMatch.awayTeam.shortName)} />
            </div>
            <ScorersList matchId={lastMatch.id} />
          </div>
        </Link>
      ) : (
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Последний матч</p>
          <p className="text-sm text-gray-500">Матчи ещё не сыграны</p>
        </div>
      )}
    </div>
  )
}
