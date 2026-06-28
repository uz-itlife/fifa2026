'use client'
import { useMatches } from '@/hooks/useMatches'
import { BracketView } from '@/components/knockout/BracketView'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'

export default function KnockoutPage() {
  const { matches, stale, isLoading } = useMatches()
  const knockoutMatches = matches.filter(m =>
    ['ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'].includes(m.stage)
  )
  return (
    <div>
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-6">Плей-офф</h1>
      {isLoading
        ? <div className="text-gray-500 text-center py-20">Загрузка...</div>
        : <BracketView matches={knockoutMatches} />}
    </div>
  )
}
