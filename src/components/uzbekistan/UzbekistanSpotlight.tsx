'use client'
import Link from 'next/link'
import { useUzbMatches } from '@/hooks/useUzbMatches'
import type { Match } from '@/types/football'

function getNextMatch(matches: Match[]) {
  return matches
    .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())[0] ?? null
}

function getCountdown(utcDate: string | null) {
  if (!utcDate) return null
  const diff = new Date(utcDate).getTime() - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return `${d}д ${h}ч ${m}м`
}

export function UzbekistanSpotlight() {
  const { matches } = useUzbMatches()
  const nextMatch = getNextMatch(matches)
  const countdown = getCountdown(nextMatch?.utcDate ?? null)
  const lastMatch = matches.filter(m => m.status === 'FINISHED').at(-1) ?? null

  return (
    <Link href="/uzbekistan">
      <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gold/40 hover:border-gold transition-colors hover:scale-[1.01]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🇺🇿</span>
          <div>
            <h3 className="font-bold text-gold">Сборная Узбекистана</h3>
            <p className="text-xs text-gray-400">Группа K · ЧМ 2026</p>
          </div>
        </div>

        {nextMatch && countdown && (
          <div className="text-sm mb-2">
            <span className="text-gray-400">Следующий матч: </span>
            <span className="font-semibold">
              Узбекистан vs {nextMatch.homeTeam.tla === 'UZB' ? nextMatch.awayTeam.shortName : nextMatch.homeTeam.shortName}
            </span>
            <span className="ml-2 text-gold text-xs font-bold">через {countdown}</span>
          </div>
        )}

        {lastMatch && (
          <div className="text-sm text-gray-400">
            Последний результат:{' '}
            <span className="text-white font-semibold">
              {lastMatch.homeTeam.shortName} {lastMatch.score.fullTime.home}:{lastMatch.score.fullTime.away} {lastMatch.awayTeam.shortName}
            </span>
          </div>
        )}

        <p className="text-xs text-gold mt-3">Подробнее →</p>
      </div>
    </Link>
  )
}
