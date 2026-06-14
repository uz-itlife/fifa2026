import { render, screen } from '@testing-library/react'
import { StandingsTable } from '@/components/standings/StandingsTable'
import type { Standing } from '@/types/football'

const mockRows: Standing[] = [
  { position: 1, team: { id: 1, name: 'Бразилия', shortName: 'Бразилия', tla: 'BRA', crest: '' },
    playedGames: 3, won: 3, draw: 0, lost: 0, goalsFor: 7, goalsAgainst: 1, goalDifference: 6, points: 9 },
  { position: 2, team: { id: 2, name: 'Аргентина', shortName: 'Аргентина', tla: 'ARG', crest: '' },
    playedGames: 3, won: 2, draw: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
]

describe('StandingsTable', () => {
  it('renders all rows', () => {
    render(<StandingsTable rows={mockRows} />)
    expect(screen.getByText('Бразилия')).toBeInTheDocument()
    expect(screen.getByText('Аргентина')).toBeInTheDocument()
  })

  it('shows points', () => {
    render(<StandingsTable rows={mockRows} />)
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })
})
