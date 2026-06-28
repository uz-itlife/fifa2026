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
  const href = `/groups/${letter.toLowerCase()}`
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={[
        'glass rounded-xl p-4 border',
        highlight
          ? 'border-gold shadow-[0_0_12px_rgba(200,168,75,0.2)]'
          : 'border-light-border dark:border-dark-border',
      ].join(' ')}
    >
      <Link href={href} className="flex items-center justify-between mb-3 group/header">
        <h3 className="text-gold font-bold tracking-widest text-sm uppercase">Группа {letter}</h3>
        <span className="text-xs text-gray-500 group-hover/header:text-gold transition-colors">Подробнее →</span>
      </Link>
      <StandingsTable rows={group.table} qualifiedThirdTlas={qualifiedThirdTlas} />
    </motion.div>
  )
}
