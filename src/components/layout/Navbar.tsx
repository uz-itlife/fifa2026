'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { LikeCounter } from '@/components/layout/LikeCounter'

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
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-card border-b border-light-border dark:border-dark-border shadow-lg">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src="/trophy.png" alt="FIFA WC Trophy" width={32} height={32} className="rounded-full object-cover" />
          <span className="text-gold font-bold text-lg tracking-widest">FIFA 2026</span>
          {isLive && (
            <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              ● LIVE
            </span>
          )}
        </Link>

        {/* Desktop tabs */}
        <div className="hidden md:flex flex-1 gap-1 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const active = pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={[
                  'shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  active ? 'bg-gold text-dark-bg' : 'text-gray-400 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <LikeCounter />
          <ThemeToggle />
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
            aria-label="Меню"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="4" width="16" height="2" rx="1"/>
                <rect x="2" y="9" width="16" height="2" rx="1"/>
                <rect x="2" y="14" width="16" height="2" rx="1"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map(tab => {
              const active = pathname.startsWith(tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className={[
                    'px-3 py-2.5 rounded-lg text-sm font-medium text-center transition-colors',
                    active ? 'bg-gold text-dark-bg' : 'text-gray-400 hover:text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
