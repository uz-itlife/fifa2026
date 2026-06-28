import type { StandingsGroup, Standing } from '@/types/football'

export function getBest8ThirdPlace(standings: StandingsGroup[]): Set<string> {
  const thirds = standings
    .map(g => g.table.find(r => r.position === 3))
    .filter((r): r is Standing => !!r)
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.goalsAgainst - b.goalsAgainst ||
      a.team.tla.localeCompare(b.team.tla)
    )
    .slice(0, 8)
  return new Set(thirds.map(r => r.team.tla))
}
