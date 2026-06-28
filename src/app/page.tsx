'use client'
import Link from 'next/link'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { MatchCard } from '@/components/matches/MatchCard'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { NextLastMatchCard } from '@/components/home/NextLastMatchCard'

const SECTIONS = [
  { href: '/groups', label: '📊 Таблицы групп', desc: '12 групп · 48 команд' },
  { href: '/knockout', label: '🏆 Плей-офф', desc: 'Сетка 1/8 → Финал' },
  { href: '/matches', label: '📅 Расписание', desc: 'Все матчи с фильтрами' },
  { href: '/teams', label: '🌍 Команды', desc: 'Профили 48 сборных' },
  { href: '/players', label: '⚡ Игроки', desc: 'Бомбардиры и статистика' },
  { href: '/stats', label: '📈 Статистика', desc: 'Команды, игроки, индекс гола' },
  { href: '/stadiums', label: '🏟️ Стадионы', desc: '16 арен США/Канада/Мексика' },
]

export default function HomePage() {
  const { matches: liveMatches } = useLiveMatches()

  return (
    <div className="space-y-8">
      <section>
        <NextLastMatchCard />
      </section>

      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <LiveBadge />
            <h2 className="font-bold">Идут прямо сейчас</h2>
          </div>
          <div className="flex flex-col gap-3">
            {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold mb-3">Разделы</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SECTIONS.map(s => (
            <Link key={s.href} href={s.href}>
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border hover:border-gold transition-colors hover:scale-[1.02]">
                <p className="font-bold text-sm">{s.label}</p>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
