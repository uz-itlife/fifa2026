interface LiveBadgeProps { minute?: number }

export function LiveBadge({ minute }: LiveBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      {minute !== undefined ? `${minute}'` : 'LIVE'}
    </span>
  )
}
