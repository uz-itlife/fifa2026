import { render, screen } from '@testing-library/react'
import { LiveBadge } from '@/components/ui/LiveBadge'

describe('LiveBadge', () => {
  it('renders minute when provided', () => {
    render(<LiveBadge minute={67} />)
    expect(screen.getByText("67'")).toBeInTheDocument()
  })

  it('renders LIVE without minute', () => {
    render(<LiveBadge />)
    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })
})
