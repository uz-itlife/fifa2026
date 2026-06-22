'use client'
import { useState } from 'react'
import { useScorers } from '@/hooks/useScorers'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { teamRu } from '@/lib/russian-teams'
import { playerRu } from '@/lib/player-names-ru'

const TABS = [
  { key: 'scorers', label: 'Бомбардиры' },
  { key: 'assists', label: 'Передачи' },
  { key: 'penalties', label: 'Пенальти' },
]

export default function PlayersPage() {
  const [tab, setTab] = useState('scorers')
  const { scorers, stale, isLoading } = useScorers()

  const sorted = [...scorers].sort((a, b) => {
    if (tab === 'assists') return (b.assists ?? 0) - (a.assists ?? 0)
    if (tab === 'penalties') return (b.penalties ?? 0) - (a.penalties ?? 0)
    return b.goals - a.goals
  })

  return (
    <div>
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-4">Статистика игроков</h1>
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-gold text-dark-bg' : 'text-gray-400 hover:text-white border border-light-border dark:border-dark-border'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {isLoading ? <div className="text-gray-500 text-center py-20">Загрузка...</div> : (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                <th className="py-2 px-4 text-left w-8">#</th>
                <th className="py-2 px-4 text-left">Игрок</th>
                <th className="py-2 px-4 text-left">Команда</th>
                <th className="py-2 px-4 text-center text-gold">
                  {tab === 'scorers' ? 'Голы' : tab === 'assists' ? 'Пас' : 'Пен'}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={s.player.id} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                  <td className="py-2 px-4 font-medium">{playerRu(s.player.name)}</td>
                  <td className="py-2 px-4"><TeamFlag tla={s.team.tla} name={teamRu(s.team.tla, s.team.shortName)} crest={s.team.crest} size="sm" /></td>
                  <td className="py-2 px-4 text-center font-bold text-gold">
                    {tab === 'scorers' ? s.goals : tab === 'assists' ? (s.assists ?? 0) : (s.penalties ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
