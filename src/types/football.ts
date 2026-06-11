export interface Standing {
  position: number
  team: Team
  playedGames: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface StandingsGroup {
  stage: string
  type: string
  group: string // "GROUP_A" … "GROUP_L"
  table: Standing[]
}

export interface StandingsResponse {
  standings: StandingsGroup[]
}

export interface Team {
  id: number
  name: string
  shortName: string
  tla: string       // "BRA", "UZB", etc.
  crest: string     // URL to badge image
}

export interface Score {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
  fullTime: { home: number | null; away: number | null }
  halfTime: { home: number | null; away: number | null }
}

export interface Match {
  id: number
  utcDate: string
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED'
  matchday: number
  stage: string
  group: string | null
  homeTeam: Team
  awayTeam: Team
  score: Score
  minute?: number
}

export interface MatchesResponse {
  matches: Match[]
}

export interface Scorer {
  player: { id: number; name: string; nationality: string }
  team: Team
  goals: number
  assists: number | null
  penalties: number | null
}

export interface ScorersResponse {
  scorers: Scorer[]
}

export interface Player {
  id: number
  name: string
  position: string
  dateOfBirth: string
  nationality: string
  shirtNumber: number | null
}

export interface Squad {
  id: number
  name: string
  position: string
  nationality: string
}

export interface TeamDetail extends Team {
  founded: number | null
  venue: string | null
  coach: { name: string; nationality: string } | null
  squad: Squad[]
}

export interface CachedResponse<T> {
  data: T
  stale: boolean
}
