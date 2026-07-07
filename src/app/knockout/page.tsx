'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useMatches } from '@/hooks/useMatches'
import { BracketView } from '@/components/knockout/BracketView'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { teamRu, stageRu, cityRu } from '@/lib/russian-teams'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { scoreClass } from '@/lib/match-utils'
import type { Match } from '@/types/football'

const LATE = new Set(['LAST_16', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'])
const GROUP = new Set(['GROUP_STAGE', 'REGULAR_SEASON', 'PRELIMINARY_ROUND'])

const LATE_STAGES_LIST = [
  { key: 'LAST_16',        alias: 'ROUND_OF_16', label: '1/8 финала' },
  { key: 'QUARTER_FINALS', alias: null,           label: '1/4 финала' },
  { key: 'SEMI_FINALS',    alias: null,           label: '1/2 финала' },
  { key: 'THIRD_PLACE',    alias: null,           label: 'За 3-е место' },
  { key: 'FINAL',          alias: null,           label: 'Финал' },
]

const STAGE_LABEL: Record<string, string> = {
  LAST_64: '1/32 финала',
  LAST_32: '1/16 финала',
  ROUND_OF_64: '1/32 финала',
  ROUND_OF_32: '1/16 финала',
}

const STAGE_SLOTS: Record<string, number> = {
  LAST_64: 32,
  LAST_32: 16,
  ROUND_OF_64: 32,
  ROUND_OF_32: 16,
}

function KOMatchCard({ match, slot }: { match: Match | null; slot: number }) {
  if (!match) {
    return (
      <div className="glass rounded-xl p-4 border border-light-border/40 dark:border-dark-border/40 opacity-50">
        <div className="text-xs text-gray-500 mb-2">Матч {slot}</div>
        <div className="text-sm text-gray-400 text-center py-2">TBD</div>
      </div>
    )
  }
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
      <div className="glass rounded-xl p-4 border border-light-border dark:border-dark-border hover:border-gold transition-colors">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span className="text-gold font-semibold">Матч {slot}</span>
          {isLive ? <LiveBadge minute={match.minute} /> : <span>{date}</span>}
        </div>
        {match.venue?.city && (
          <div className="text-[11px] text-gray-400 mb-2">📍 {cityRu(match.venue.city) ?? match.venue.city}</div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <TeamFlag tla={match.homeTeam.tla} name={homeRu} crest={match.homeTeam.crest} size="sm" />
          </div>
          <div className="flex flex-col items-center justify-center shrink-0 w-20 gap-0.5">
            {hasScore ? (
              <>
                <div className="flex items-center gap-1 text-xl font-bold tabular-nums">
                  {(() => {
                    const dur = match.score.duration
                    const hasET = (dur === 'EXTRA_TIME' || dur === 'PENALTY_SHOOTOUT') && match.score.extraTime?.home != null
                    const hasPen = dur === 'PENALTY_SHOOTOUT' && match.score.penalties?.home != null
                    const s = hasET ? match.score.extraTime! : match.score.fullTime
                    return (
                      <>
                        <span className={`w-6 text-right ${scoreClass(match.score.winner, 'HOME')}`}>{s.home}</span>
                        <span className="text-gray-500 text-base">:</span>
                        <span className={`w-6 text-left ${scoreClass(match.score.winner, 'AWAY')}`}>{s.away}</span>
                        {hasPen && <span className="text-[10px] font-bold text-blue-400 ml-0.5">СП</span>}
                        {hasET && !hasPen && <span className="text-[10px] font-bold text-amber-400 ml-0.5">ДВ</span>}
                      </>
                    )
                  })()}
                </div>
                {match.score.duration === 'PENALTY_SHOOTOUT' && match.score.penalties?.home != null && (
                  <div className="text-[10px] text-gray-500 tabular-nums">
                    пен. {match.score.penalties.home}:{match.score.penalties.away}
                  </div>
                )}
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

const ROUND_OF_32_STAGES = new Set(['LAST_32', 'ROUND_OF_32'])
const ROUND_OF_16_STAGES = new Set(['LAST_16', 'ROUND_OF_16'])

function getWinner(m: Match) {
  if (m.status !== 'FINISHED' || !m.score.winner || m.score.winner === 'DRAW') return null
  return m.score.winner === 'HOME_TEAM' ? m.homeTeam : m.awayTeam
}

function fillSlots(feeders: Match[], targets: Match[]): Match[] {
  if (!feeders.length || !targets.length) return targets
  const byDate = (a: Match, b: Match) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
  const f = [...feeders].sort(byDate)
  return [...targets].sort(byDate).map((t, i) => {
    const w1 = f[i * 2] ? getWinner(f[i * 2]) : null
    const w2 = f[i * 2 + 1] ? getWinner(f[i * 2 + 1]) : null
    const home = !t.homeTeam?.name && w1 ? w1 : t.homeTeam
    const away = !t.awayTeam?.name && w2 ? w2 : t.awayTeam
    return home === t.homeTeam && away === t.awayTeam ? t : { ...t, homeTeam: home, awayTeam: away }
  })
}

function patchKOBracket(koMatches: Match[]): Match[] {
  const last32 = koMatches.filter(m => ROUND_OF_32_STAGES.has(m.stage))
  const last16 = koMatches.filter(m => ROUND_OF_16_STAGES.has(m.stage))
  const qf = koMatches.filter(m => m.stage === 'QUARTER_FINALS')
  const sf = koMatches.filter(m => m.stage === 'SEMI_FINALS')
  const patched16 = fillSlots(last32, last16)
  const patchedQF = fillSlots(patched16, qf)
  const patchedSF = fillSlots(patchedQF, sf)
  const overrides = new Map<number, Match>()
  ;[...patched16, ...patchedQF, ...patchedSF].forEach(m => overrides.set(m.id, m))
  return koMatches.map(m => overrides.get(m.id) ?? m)
}

export default function KnockoutPage() {
  const [view, setView] = useState<'early' | 'bracket'>('early')
  const { matches, stale, isLoading } = useMatches()

  const earlyMatches = matches
    .filter(m => !GROUP.has(m.stage) && !LATE.has(m.stage))
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

  const allKoMatches = patchKOBracket(matches.filter(m => !GROUP.has(m.stage)))

  // Determine which early stages to show (prefer known ones; fallback to actual stages found)
  const knownEarlyStages = ['LAST_64', 'LAST_32', 'ROUND_OF_64', 'ROUND_OF_32']
  const actualEarlyStages = [...new Set(earlyMatches.map(m => m.stage))]
  const stagesToShow = actualEarlyStages.length > 0
    ? actualEarlyStages
    : knownEarlyStages.filter((_, i) => i === 1) // default: just ROUND_OF_32

  return (
    <div>
      {stale && <StaleDataBanner />}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold flex-1">Плей-офф</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('early')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'early'
                ? 'bg-gold text-dark-bg'
                : 'text-gray-400 border border-light-border dark:border-dark-border hover:text-white'
            }`}
          >
            1/16 финала
          </button>
          <button
            onClick={() => setView('bracket')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'bracket'
                ? 'bg-gold text-dark-bg'
                : 'text-gray-400 border border-light-border dark:border-dark-border hover:text-white'
            }`}
          >
            1/8 → Финал
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-20">Загрузка...</div>
      ) : view === 'early' ? (
        <div className="space-y-8">
          {stagesToShow.map(stage => {
            const stageMs = earlyMatches.filter(m => m.stage === stage)
            const slotCount = STAGE_SLOTS[stage] ?? Math.max(stageMs.length, 16)
            const slots = Array.from({ length: slotCount }, (_, i) => stageMs[i] ?? null)
            return (
              <div key={stage}>
                <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-3">
                  {STAGE_LABEL[stage] ?? stageRu(stage)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((m, i) => (
                    <KOMatchCard key={m?.id ?? `tbd-${i}`} match={m} slot={i + 1} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-10">
          <BracketView matches={allKoMatches} />
          {LATE_STAGES_LIST.map(stage => {
            const stageMs = allKoMatches
              .filter(m => m.stage === stage.key || m.stage === stage.alias)
              .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
            if (stageMs.length === 0) return null
            return (
              <div key={stage.key}>
                <h2 className="text-sm font-bold text-gold uppercase tracking-widest mb-3">{stage.label}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stageMs.map((m, i) => <KOMatchCard key={m.id} match={m} slot={i + 1} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
