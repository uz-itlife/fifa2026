'use client'
import { useFiltersStore } from '@/store/filters'

const STATUS_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'IN_PLAY', label: '● Live' },
  { value: 'FINISHED', label: 'Завершены' },
  { value: 'SCHEDULED', label: 'Предстоящие' },
]

const GROUPS = ['', ...'ABCDEFGHIJKL'.split('').map(l => `GROUP_${l}`)]

export function MatchFilters() {
  const { statusFilter, groupFilter, setStatusFilter, setGroupFilter, resetFilters } = useFiltersStore()
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {STATUS_OPTIONS.map(opt => (
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
          <option key={g} value={g}>{g ? g.replace('GROUP_', 'Группа ') : 'Все группы'}</option>
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
