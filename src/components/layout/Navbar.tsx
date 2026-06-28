'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useLiveMatches } from '@/hooks/useLiveMatches'

const tabs = [
  { href: '/groups', label: 'Группы' },
  { href: '/knockout', label: 'Плей-офф' },
  { href: '/matches', label: 'Матчи' },
  { href: '/teams', label: 'Команды' },
  { href: '/stats', label: 'Статистика' },
  { href: '/stadiums', label: 'Стадионы' },
  { href: '/gallery', label: 'Галерея' },
]

export function Navbar() {
  const pathname = usePathname()
  const { matches: liveMatches } = useLiveMatches()
  const isLive = liveMatches.length > 0

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-card border-b border-light-border dark:border-dark-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/trophy.png" alt="FIFA WC Trophy" width={32} height={32} className="rounded-full object-cover" />
          <span className="text-gold font-bold text-lg tracking-widest">FIFA 2026</span>
          {isLive && (
            <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              ● LIVE
            </span>
          )}
        </Link>

        <div className="flex-1 flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const active = pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={[
                  'shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'bg-gold text-dark-bg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        <ThemeToggle />
      </div>
    </nav>
  )
}
