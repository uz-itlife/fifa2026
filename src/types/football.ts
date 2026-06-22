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
  group: string | null // null during knockout stage
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

export interface Goal {
  minute: number
  injuryTime?: number | null
  type: string
  team: { id: number; name: string }
  scorer: { id: number; name: string } | null
  assist: { id: number; name: string } | null
}

export interface Booking {
  minute: number
  team: { id: number; name: string }
  player: { id: number; name: string }
  card: 'YELLOW_CARD' | 'RED_CARD' | 'YELLOW_RED_CARD'
}

export interface Venue {
  name: string | null
  city: string | null
  country: string | null
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
  goals?: Goal[]
  bookings?: Booking[]
  venue?: Venue | null
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
  position: string | null
  dateOfBirth: string
  nationality: string
  shirtNumber: number | null
}

export interface TeamDetail extends Team {
  founded: number | null
  venue: string | null
  coach: { name: string; nationality: string } | null
  squad: Player[]
}

export interface CachedResponse<T> {
  data: T
  stale: boolean
}
