'use client'
import { useLiveMatches } from '@/hooks/useLiveMatches'

const BROADCAST_URL = 'https://www.zortv.live/'

export function LiveBroadcastBar() {
  const { matches: liveMatches } = useLiveMatches()
  const isLive = liveMatches.length > 0

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={BROADCAST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
          isLive
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_16px_rgba(239,68,68,0.5)]'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]',
        ].join(' ')}
      >
        <span className={['w-2 h-2 rounded-full bg-white', isLive ? 'animate-pulse' : ''].join(' ')} />
        {isLive ? `В прямом эфире · ${liveMatches.length}` : 'Прямой эфир'}
      </a>

      <a
        href={BROADCAST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/40 hover:border-gold hover:bg-gold/5 text-gold text-sm font-medium transition-colors"
      >
        📺 Zo&apos;r TV — трансляция
      </a>
    </div>
  )
}
