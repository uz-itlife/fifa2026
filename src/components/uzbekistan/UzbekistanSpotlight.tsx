'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUzbMatches } from '@/hooks/useUzbMatches'
import type { Match, Team } from '@/types/football'
import { teamRu } from '@/lib/russian-teams'

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

function TeamBadge({ team, label }: { team: Team; label?: string }) {
  const name = label ?? teamRu(team.tla, team.shortName)
  return (
    <div className="text-center flex-1">
      {team.crest ? (
        <img
          src={team.crest}
          alt={name}
          width={48}
          height={48}
          className="object-contain mx-auto mb-1"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
          {team.tla}
        </div>
      )}
      <p className="text-xs font-semibold leading-tight">{name}</p>
    </div>
  )
}

export function UzbekistanSpotlight() {
  const { matches } = useUzbMatches()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const nextMatch = getNextMatch(matches)
  const lastMatch = getLastMatch(matches)

  const uzbTeam = nextMatch
    ? (nextMatch.homeTeam.tla === 'UZB' ? nextMatch.homeTeam : nextMatch.awayTeam)
    : null
  const opponent = nextMatch
    ? (nextMatch.homeTeam.tla === 'UZB' ? nextMatch.awayTeam : nextMatch.homeTeam)
    : null

  const nextDate = nextMatch
    ? new Date(nextMatch.utcDate).toLocaleString('ru-RU', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : null

  const countdown = nextMatch ? buildCountdown(nextMatch.utcDate, now) : null

  return (
    <Link href="/uzbekistan">
      <div className="glass rounded-xl border border-gold/40 hover:border-gold transition-colors hover:scale-[1.01] divide-y divide-light-border dark:divide-dark-border">

        {/* Следующий матч */}
        {nextMatch && uzbTeam && opponent ? (
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Следующий матч</p>
            <div className="flex items-center justify-between gap-2">
              <TeamBadge team={uzbTeam} label="Узбекистан" />
              <div className="text-center shrink-0 px-2">
                <p className="text-xs text-gray-400 leading-snug">{nextDate}</p>
                {countdown && (
                  <p className="text-gold font-bold text-sm mt-1">⏱ {countdown}</p>
                )}
              </div>
              <TeamBadge team={opponent} />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Следующий матч</p>
            <p className="text-sm text-gray-500">Нет предстоящих матчей</p>
          </div>
        )}

        {/* Последний матч */}
        {lastMatch ? (
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Последний матч</p>
            <div className="flex items-center justify-between gap-2">
              <div className="text-center flex-1">
                {lastMatch.homeTeam.crest && (
                  <img src={lastMatch.homeTeam.crest} alt="" width={48} height={48}
                    className="object-contain mx-auto mb-1"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                )}
                <p className="text-xs font-semibold leading-tight">
                  {teamRu(lastMatch.homeTeam.tla, lastMatch.homeTeam.shortName)}
                </p>
              </div>
              <div className="text-center shrink-0 px-2">
                <p className="text-3xl font-black text-gold">
                  {lastMatch.score.fullTime.home ?? '–'} : {lastMatch.score.fullTime.away ?? '–'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Завершён</p>
              </div>
              <div className="text-center flex-1">
                {lastMatch.awayTeam.crest && (
                  <img src={lastMatch.awayTeam.crest} alt="" width={48} height={48}
                    className="object-contain mx-auto mb-1"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                )}
                <p className="text-xs font-semibold leading-tight">
                  {teamRu(lastMatch.awayTeam.tla, lastMatch.awayTeam.shortName)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Последний матч</p>
            <p className="text-sm text-gray-500">Матчи ещё не сыграны</p>
          </div>
        )}

        <div className="px-4 py-2.5">
          <p className="text-xs text-gold">Все матчи Узбекистана →</p>
        </div>
      </div>
    </Link>
  )
}
