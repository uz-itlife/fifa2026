interface Props { compact?: boolean }

export function WatchBanner({ compact }: Props) {
  if (compact) {
    return (
      <a
        href="https://www.zortv.live/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-gold hover:text-gold-hover border border-gold/30 hover:border-gold rounded-lg px-3 py-1.5 transition-colors"
      >
        📺 Смотреть на Zo&apos;r TV →
      </a>
    )
  }

  return (
    <a
      href="https://www.zortv.live/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-4 bg-gold/10 border border-gold/40 hover:border-gold rounded-xl px-4 py-3 transition-colors group"
    >
      <div>
        <p className="text-gold font-bold text-sm">📺 Смотреть трансляцию на Zo&apos;r TV</p>
        <p className="text-gray-400 text-xs mt-0.5">Официальный вещатель ЧМ 2026 в Узбекистане</p>
      </div>
      <span className="text-gold group-hover:translate-x-1 transition-transform text-lg">→</span>
    </a>
  )
}
