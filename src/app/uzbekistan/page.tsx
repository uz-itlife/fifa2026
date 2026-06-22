'use client'
import { useEffect, useState } from 'react'
import { useStandings } from '@/hooks/useStandings'
import { useUzbMatches } from '@/hooks/useUzbMatches'
import { useLiveMatches } from '@/hooks/useLiveMatches'
import { GroupKTable } from '@/components/uzbekistan/GroupKTable'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'
import { MatchCard } from '@/components/matches/MatchCard'
import { OpponentCard } from '@/components/uzbekistan/OpponentCard'
import { NewsCard } from '@/components/uzbekistan/NewsCard'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import type { NewsItem } from '@/types/news'
import type { Match } from '@/types/football'

function shouldShowBanner(matches: Match[]) {
  const now = Date.now()
  return matches.some(m => {
    const diff = new Date(m.utcDate).getTime() - now
    return m.status === 'IN_PLAY' || (m.status === 'SCHEDULED' && diff > 0 && diff < 30 * 60 * 1000)
  })
}

export default function UzbekistanPage() {
  const { standings, stale } = useStandings()
  const { matches: uzbMatches } = useUzbMatches()
  const { matches: liveMatches } = useLiveMatches()
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(d => setNews(d.items ?? []))
  }, [])

  const groupK = standings.find(g => g.group === 'GROUP_K')
  const uzbRow = groupK?.table.find(r => r.team.tla === 'UZB')
  const opponents = groupK?.table.filter(r => r.team.tla !== 'UZB') ?? []
  const isUzbLive = liveMatches.some(m => m.homeTeam.tla === 'UZB' || m.awayTeam.tla === 'UZB')
  const showSticky = shouldShowBanner(uzbMatches) || isUzbLive

  return (
    <div className="space-y-8">
      {stale && <StaleDataBanner />}

      {showSticky && (
        <div className="sticky top-16 z-40">
          <WatchBanner />
        </div>
      )}

      <section>
        <h1 className="text-2xl font-bold mb-4">🇺🇿 Сборная Узбекистана · Группа K</h1>
        {uzbRow && (
          <div className="flex gap-4 mb-4 flex-wrap">
            {[
              { label: 'Место', value: uzbRow.position },
              { label: 'Очки', value: uzbRow.points, highlight: true },
              { label: 'Победы', value: uzbRow.won },
              { label: 'Голы', value: `${uzbRow.goalsFor}:${uzbRow.goalsAgainst}` },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border text-center min-w-[80px]">
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.highlight ? 'text-gold' : ''}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}
        <GroupKTable />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Матчи сборной</h2>
        <div className="flex flex-col gap-3">
          {uzbMatches.length === 0
            ? <p className="text-gray-500 text-sm">Матчи загружаются...</p>
            : uzbMatches.map(m => <MatchCard key={m.id} match={m} />)
          }
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Соперники по группе K</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {opponents.map(opp => (
            <OpponentCard key={opp.team.id} standing={opp} uzbRecord={{ w: 0, d: 0, l: 0 }} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Новости</h2>
        {news.length === 0
          ? <p className="text-gray-500 text-sm">Загрузка новостей...</p>
          : <div className="flex flex-col gap-2">{news.map((item, i) => <NewsCard key={i} item={item} />)}</div>
        }
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Обзоры матчей</h2>
        <a
          href="https://www.youtube.com/@QsportUzbekistan"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-gold rounded-xl px-4 py-3 transition-colors group"
        >
          <div>
            <p className="font-bold text-sm">▶️ Qsport Uzbekistan</p>
            <p className="text-gray-400 text-xs mt-0.5">Короткие обзоры матчей на русском на YouTube</p>
          </div>
          <span className="text-gold group-hover:translate-x-1 transition-transform text-lg">→</span>
        </a>
      </section>

      <section>
        <WatchBanner />
      </section>
    </div>
  )
}
