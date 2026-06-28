'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useMatches } from '@/hooks/useMatches'
import { BracketView } from '@/components/knockout/BracketView'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { teamRu, stageRu } from '@/lib/russian-teams'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { scoreClass } from '@/lib/match-utils'
import type { Match } from '@/types/football'

const EARLY = ['ROUND_OF_64', 'ROUND_OF_32']
const LATE  = ['ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL']

// Stage label for match card header
const ROUND_LABEL: Record<string, string> = {
  ROUND_OF_64: '1/64 финала',
  ROUND_OF_32: '1/32 финала',
}

function KOMatchCard({ match }: { match: Match }) {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const hasScore = match.status === 'FINISHED' || isLive
  const date = new Date(match.utcDate).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Tashkent',
  })
  const homeRu = teamRu(match.homeTeam.tla, match.homeTeam.shortName)
  const awayRu = teamRu(match.awayTeam.tla, match.awayTeam.shortName)

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border hover:border-gold transition-colors">
        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
          <span className="text-gold font-semibold">{ROUND_LABEL[match.stage] ?? stageRu(match.stage)}</span>
          {isLive ? <LiveBadge minute={match.minute} /> : <span>{date}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} size="sm" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xl font-bold tabular-nums shrink-0 w-20">
            {hasScore ? (
              <>
                <span className={`w-6 text-right ${scoreClass(match.score.winner, 'HOME')}`}>
                  {match.score.fullTime.home}
                </span>
                <span className="text-gray-500 text-base">:</span>
                <span className={`w-6 text-left ${scoreClass(match.score.winner, 'AWAY')}`}>
                  {match.score.fullTime.away}
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-sm">vs</span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex justify-end">
            <TeamFlag tla={match.awayTeam.tla} name={awayRu} crest={match.awayTeam.crest} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function KnockoutPage() {
  const [view, setView] = useState<'early' | 'bracket'>('early')
  const { matches, stale, isLoading } = useMatches()

  const earlyMatches = matches
    .filter(m => EARLY.includes(m.stage))
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

  const bracketMatches = matches.filter(m => LATE.includes(m.stage))

  // Group early matches by stage for headers
  const byStage = EARLY.reduce<Record<string, Match[]>>((acc, s) => {
    const ms = earlyMatches.filter(m => m.stage === s)
    if (ms.length) acc[s] = ms
    return acc
  }, {})

  return (
    <div>
      {stale && <StaleDataBanner />}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold flex-1">Плей-офф</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('early')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'early' ? 'bg-gold text-dark-bg' : 'text-gray-400 border border-light-border dark:border-dark-border hover:text-white'
            }`}
          >
            1/64 — 1/32
          </button>
          <button
            onClick={() => setView('bracket')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'bracket' ? 'bg-gold text-dark-bg' : 'text-gray-400 border border-light-border dark:border-dark-border hover:text-white'
            }`}
          >
            1/16 → Финал
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-20">Загрузка...</div>
      ) : view === 'early' ? (
        earlyMatches.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">Матчи плей-офф ещё не назначены</p>
            <p className="text-sm">Появятся после завершения группового этапа</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byStage).map(([stage, ms]) => (
              <div key={stage}>
                <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-3">
                  {ROUND_LABEL[stage]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ms.map(m => <KOMatchCard key={m.id} match={m} />)}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        bracketMatches.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">Сетка 1/16 ещё не сформирована</p>
            <p className="text-sm">Появится после завершения раунда 1/32</p>
          </div>
        ) : (
          <BracketView matches={bracketMatches} />
        )
      )}
    </div>
  )
}
