import { render, screen } from '@testing-library/react'
import { MatchCard } from '@/components/matches/MatchCard'
import type { Match } from '@/types/football'

const makeMatch = (overrides: Partial<Match> = {}): Match => ({
  id: 1,
  utcDate: '2026-06-15T18:00:00Z',
  status: 'FINISHED',
  matchday: 1,
  stage: 'GROUP_STAGE',
  group: 'GROUP_A',
  homeTeam: { id: 1, name: 'Бразилия', shortName: 'Бразилия', tla: 'BRA', crest: '' },
  awayTeam: { id: 2, name: 'Аргентина', shortName: 'Аргентина', tla: 'ARG', crest: '' },
  score: { winner: 'HOME_TEAM', fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } },
  ...overrides,
})

describe('MatchCard', () => {
  it('renders team names', () => {
    render(<MatchCard match={makeMatch()} />)
    expect(screen.getByText('Бразилия')).toBeInTheDocument()
    expect(screen.getByText('Аргентина')).toBeInTheDocument()
  })

  it('shows score for finished match', () => {
    render(<MatchCard match={makeMatch()} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows LIVE badge for in-play match', () => {
    render(<MatchCard match={makeMatch({ status: 'IN_PLAY', minute: 55 } as Partial<Match>)} />)
    expect(screen.getByText("55'")).toBeInTheDocument()
  })
})
