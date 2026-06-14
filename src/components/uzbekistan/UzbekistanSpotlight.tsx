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
          width={44}
          height={44}
          className="object-contain mx-auto mb-1"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="w-11 h-11 mx-auto mb-1 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
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
      <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gold/40 hover:border-gold transition-colors hover:scale-[1.01]">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🇺🇿</span>
          <div>
            <h3 className="font-bold text-gold">Сборная Узбекистана</h3>
            <p className="text-xs text-gray-400">Группа K · ЧМ 2026</p>
          </div>
        </div>

        {nextMatch && uzbTeam && opponent && (
          <div className="mb-3 rounded-lg bg-black/10 dark:bg-white/5 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Следующий матч</p>
            <div className="flex items-center justify-between gap-2">
              <TeamBadge team={uzbTeam} label="Узбекистан" />
              <div className="text-center shrink-0 px-2">
                <p className="text-xs text-gray-400 leading-tight">{nextDate}</p>
                {countdown && (
                  <p className="text-gold font-bold text-xs mt-1">⏱ через {countdown}</p>
                )}
              </div>
              <TeamBadge team={opponent} />
            </div>
          </div>
        )}

        {lastMatch && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Последний результат</p>
            <div className="flex items-center gap-3">
              {lastMatch.homeTeam.crest && (
                <img src={lastMatch.homeTeam.crest} alt="" width={28} height={28} className="object-contain" />
              )}
              <span className="font-semibold text-sm">{teamRu(lastMatch.homeTeam.tla, lastMatch.homeTeam.shortName)}</span>
              <span className="text-gold font-black text-lg">
                {lastMatch.score.fullTime.home ?? '–'} : {lastMatch.score.fullTime.away ?? '–'}
              </span>
              <span className="font-semibold text-sm">{teamRu(lastMatch.awayTeam.tla, lastMatch.awayTeam.shortName)}</span>
              {lastMatch.awayTeam.crest && (
                <img src={lastMatch.awayTeam.crest} alt="" width={28} height={28} className="object-contain" />
              )}
            </div>
          </div>
        )}

        {!nextMatch && !lastMatch && (
          <p className="text-sm text-gray-500">Расписание уточняется</p>
        )}

        <p className="text-xs text-gold mt-4">Подробнее →</p>
      </div>
    </Link>
  )
}
