import { render, screen } from '@testing-library/react'
import { StandingsTable } from '@/components/standings/StandingsTable'
import type { Standing } from '@/types/football'

const makeRow = (position: number, name: string, tla: string, points: number): Standing => ({
  position,
  team: { id: position, name, shortName: name, tla, crest: '' },
  playedGames: 3, won: 0, draw: 0, lost: 0,
  goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
  points,
})

const mockRows: Standing[] = [
  makeRow(1, 'Бразилия', 'BRA', 9),
  makeRow(2, 'Аргентина', 'ARG', 6),
  makeRow(3, 'Германия', 'GER', 3),
  makeRow(4, 'Франция', 'FRA', 0),
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

  it('highlights qualifying positions (1st and 2nd) with green border', () => {
    render(<StandingsTable rows={mockRows} />)
    const row1 = screen.getByTestId('standing-row-1')
    const row2 = screen.getByTestId('standing-row-2')
    expect(row1.className).toContain('border-l-green-500')
    expect(row2.className).toContain('border-l-green-500')
  })

  it('does not apply green qualifying style to 3rd or 4th place', () => {
    render(<StandingsTable rows={mockRows} />)
    const row3 = screen.getByTestId('standing-row-3')
    const row4 = screen.getByTestId('standing-row-4')
    expect(row3.className).not.toContain('border-l-green-500')
    expect(row4.className).not.toContain('border-l-green-500')
  })

  it('renders empty state without crashing', () => {
    render(<StandingsTable rows={[]} />)
    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })

  it('shows goal difference column', () => {
    const rows: Standing[] = [makeRow(1, 'Тест', 'TST', 3)]
    rows[0].goalsFor = 5
    rows[0].goalsAgainst = 2
    rows[0].goalDifference = 3
    render(<StandingsTable rows={rows} />)
    expect(screen.getByText('+3')).toBeInTheDocument()
  })
})
