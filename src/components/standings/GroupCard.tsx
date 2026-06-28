import Link from 'next/link'
import { motion } from 'framer-motion'
import type { StandingsGroup } from '@/types/football'
import { StandingsTable } from './StandingsTable'

interface Props {
  group: StandingsGroup
  highlight?: boolean
  index: number
  qualifiedThirdTlas?: Set<string>
}

export function GroupCard({ group, highlight, index, qualifiedThirdTlas }: Props) {
  const letter = (group.group ?? '').replace(/^GROUP[_\s]*/i, '').toUpperCase()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={[
        'bg-white dark:bg-dark-card rounded-xl p-4 border',
        highlight
          ? 'border-gold shadow-[0_0_12px_rgba(200,168,75,0.2)]'
          : 'border-light-border dark:border-dark-border',
      ].join(' ')}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-bold tracking-widest text-sm uppercase">Группа {letter}</h3>
        <Link
          href={`/groups/${letter.toLowerCase()}`}
          className="text-xs text-gray-500 hover:text-gold transition-colors px-2 py-1 rounded hover:bg-gold/10"
          onClick={e => e.stopPropagation()}
        >
          Подробнее →
        </Link>
      </div>
      <StandingsTable rows={group.table} qualifiedThirdTlas={qualifiedThirdTlas} />
    </motion.div>
  )
}
