'use client'
import { useStandings } from '@/hooks/useStandings'
import { StandingsTable } from '@/components/standings/StandingsTable'

export function GroupKTable() {
  const { standings } = useStandings()
  const groupK = standings.find(g => g.group === 'GROUP_K')
  if (!groupK) return null
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gold/40 shadow-[0_0_16px_rgba(200,168,75,0.1)]">
      <h3 className="text-gold font-bold tracking-widest text-sm uppercase mb-3">Группа K</h3>
      <StandingsTable rows={groupK.table} highlightTla="UZB" />
    </div>
  )
}
