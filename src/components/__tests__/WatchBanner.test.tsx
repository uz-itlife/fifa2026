import { render, screen } from '@testing-library/react'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'

describe('WatchBanner', () => {
  it("renders Zo'r TV link with correct href", () => {
    render(<WatchBanner />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.zortv.live/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows broadcast text', () => {
    render(<WatchBanner />)
    expect(screen.getByText(/Zo'r TV/i)).toBeInTheDocument()
  })
})
