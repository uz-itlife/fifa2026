import Link from 'next/link'
import type { StandingsGroup } from '@/types/football'
import { StandingsTable } from './StandingsTable'

interface Props {
  group: StandingsGroup
  highlight?: boolean
}

export function GroupCard({ group, highlight }: Props) {
  const letter = (group.group ?? '').replace('GROUP_', '')
  return (
    <div className={[
      'bg-white dark:bg-dark-card rounded-xl p-4 border',
      highlight
        ? 'border-gold shadow-[0_0_12px_rgba(200,168,75,0.2)]'
        : 'border-light-border dark:border-dark-border',
    ].join(' ')}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-bold tracking-widest text-sm uppercase">Группа {letter}</h3>
        <Link href={`/groups/${letter.toLowerCase()}`} className="text-xs text-gray-500 hover:text-gold transition-colors">
          Подробнее →
        </Link>
      </div>
      <StandingsTable rows={group.table} />
    </div>
  )
}
