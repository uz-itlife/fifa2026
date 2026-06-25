import type { Score } from '@/types/football'

export function scoreClass(winner: Score['winner'], side: 'HOME' | 'AWAY'): string {
  if (!winner || winner === 'DRAW') return 'text-gray-900 dark:text-white'
  if (winner === 'HOME_TEAM') return side === 'HOME' ? 'text-green-500' : 'text-red-500'
  return side === 'AWAY' ? 'text-green-500' : 'text-red-500'
}
