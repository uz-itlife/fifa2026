'use client'
import { useFiltersStore } from '@/store/filters'
import { useLiveMatches } from '@/hooks/useLiveMatches'

const GROUPS = ['', ...'ABCDEFGHIJKL'.split('').map(l => `GROUP_${l}`)]

export function MatchFilters() {
  const { statusFilter, groupFilter, setStatusFilter, setGroupFilter, resetFilters } = useFiltersStore()
  const { matches: liveMatches } = useLiveMatches()
  const liveCount = liveMatches.length

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* LIVE button — always prominent */}
      <button
        onClick={() => setStatusFilter(statusFilter === 'IN_PLAY' ? '' : 'IN_PLAY')}
        className={[
          'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold border transition-all',
          statusFilter === 'IN_PLAY'
            ? 'bg-red-600 text-white border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
            : 'border-red-500 text-red-400 hover:bg-red-500/10',
        ].join(' ')}
      >
        <span className={['w-2 h-2 rounded-full bg-red-500', statusFilter !== 'IN_PLAY' ? 'animate-pulse' : ''].join(' ')} />
        В прямом эфире
        {liveCount > 0 && (
          <span className={[
            'ml-1 px-1.5 py-0.5 rounded-full text-xs font-black',
            statusFilter === 'IN_PLAY' ? 'bg-white/20 text-white' : 'bg-red-500 text-white',
          ].join(' ')}>
            {liveCount}
          </span>
        )}
      </button>

      {/* Other filters */}
      {[
        { value: '', label: 'Все' },
        { value: 'FINISHED', label: 'Завершены' },
        { value: 'SCHEDULED', label: 'Предстоящие' },
      ].map(opt => (
        <button
          key={opt.value}
          onClick={() => setStatusFilter(opt.value)}
          className={[
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            statusFilter === opt.value
              ? 'bg-gold text-dark-bg border-gold'
              : 'border-light-border dark:border-dark-border text-gray-400 hover:text-white',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}

      <select
        value={groupFilter}
        onChange={e => setGroupFilter(e.target.value)}
        className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-dark-card border border-light-border dark:border-dark-border text-gray-400"
      >
        {GROUPS.map(g => (
          <option key={g} value={g}>{g ? g.replace(/^GROUP[_\s]*/i, 'Группа ') : 'Все группы'}</option>
        ))}
      </select>

      {(statusFilter || groupFilter) && (
        <button onClick={resetFilters} className="px-3 py-1.5 text-xs text-gray-500 hover:text-white transition-colors">
          Сбросить ×
        </button>
      )}
    </div>
  )
}
