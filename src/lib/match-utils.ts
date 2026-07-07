import type { Score } from '@/types/football'

export function scoreClass(winner: Score['winner'], side: 'HOME' | 'AWAY'): string {
  if (!winner || winner === 'DRAW') return 'text-gray-900 dark:text-white'
  if (winner === 'HOME_TEAM') return side === 'HOME' ? 'text-green-500' : 'text-red-500'
  return side === 'AWAY' ? 'text-green-500' : 'text-red-500'
}

// football-data.org v4: fullTime = cumulative total (regular + ET + penalty goals)
//   extraTime = goals scored ONLY in ET period (incremental)
//   penalties = penalty shootout goals only
export function resolveScore(score: Score) {
  const dur = score.duration
  const ft = score.fullTime
  const et = score.extraTime
  const pen = score.penalties

  const hasPen = dur === 'PENALTY_SHOOTOUT' && pen?.home != null
  const hasET = (dur === 'EXTRA_TIME' || dur === 'PENALTY_SHOOTOUT') && et?.home != null

  // Main: final result excluding penalty kicks
  const main = hasPen
    ? { home: (ft.home ?? 0) - (pen!.home ?? 0), away: (ft.away ?? 0) - (pen!.away ?? 0) }
    : ft

  // 90-min score for sub-label
  const reg90 = hasET
    ? {
        home: (ft.home ?? 0) - (et!.home ?? 0) - (hasPen ? (pen!.home ?? 0) : 0),
        away: (ft.away ?? 0) - (et!.away ?? 0) - (hasPen ? (pen!.away ?? 0) : 0),
      }
    : null

  return { main, reg90, hasPen, hasET, pen }
}
