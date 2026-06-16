'use client'
import { useState } from 'react'
import { useScorers } from '@/hooks/useScorers'
import { useStandings } from '@/hooks/useStandings'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { teamRu } from '@/lib/russian-teams'

const AVAILABLE_TABS = [
  { key: 'players', label: 'Лучшие игроки' },
  { key: 'assists', label: 'Ассисты' },
  { key: 'teams', label: 'Лучшие команды' },
] as const

const UNAVAILABLE_TABS = [
  { key: 'cards', label: 'Карточки' },
  { key: 'fifa', label: 'Рейтинг FIFA' },
  { key: 'fouls', label: 'Нарушения' },
  { key: 'keepers', label: 'Вратари' },
  { key: 'possession', label: 'Владение' },
  { key: 'passes', label: 'Передачи' },
] as const

type TabKey = typeof AVAILABLE_TABS[number]['key'] | typeof UNAVAILABLE_TABS[number]['key']

function Unavailable({ label }: { label: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-gray-400 mb-2">{label}</p>
      <p className="text-sm text-gray-500">Недоступно в бесплатном плане football-data.org API</p>
    </div>
  )
}

export default function StatsPage() {
  const [tab, setTab] = useState<TabKey>('players')
  const { scorers, stale: scorersStale, isLoading: scorersLoading } = useScorers()
  const { standings, stale: standingsStale, isLoading: standingsLoading } = useStandings()

  const stale = scorersStale || standingsStale

  const playersRanked = [...scorers]
    .map(s => ({ ...s, index: s.goals * 2 + (s.assists ?? 0) }))
    .sort((a, b) => b.index - a.index)

  const assistsRanked = [...scorers].sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))

  const teamsRanked = standings
    .flatMap(g => g.table.map(row => ({ ...row, groupLabel: (g.group ?? '').replace(/^GROUP[_\s]*/i, '').toUpperCase() })))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)

  return (
    <div>
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-4">Статистика</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[...AVAILABLE_TABS, ...UNAVAILABLE_TABS].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-gold text-dark-bg'
                : 'text-gray-400 hover:text-white border border-light-border dark:border-dark-border'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'players' && (
        scorersLoading ? (
          <div className="text-gray-500 text-center py-20">Загрузка...</div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                  <th className="py-2 px-4 text-left w-8">#</th>
                  <th className="py-2 px-4 text-left">Игрок</th>
                  <th className="py-2 px-4 text-left">Команда</th>
                  <th className="py-2 px-4 text-center">Голы</th>
                  <th className="py-2 px-4 text-center">Пас</th>
                  <th className="py-2 px-4 text-center text-gold">Индекс гола</th>
                </tr>
              </thead>
              <tbody>
                {playersRanked.map((s, i) => (
                  <tr key={s.player.id} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                    <td className="py-2 px-4 font-medium">{s.player.name}</td>
                    <td className="py-2 px-4"><TeamFlag tla={s.team.tla} name={teamRu(s.team.tla, s.team.shortName)} crest={s.team.crest} size="sm" /></td>
                    <td className="py-2 px-4 text-center">{s.goals}</td>
                    <td className="py-2 px-4 text-center">{s.assists ?? 0}</td>
                    <td className="py-2 px-4 text-center font-bold text-gold">{s.index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'assists' && (
        scorersLoading ? (
          <div className="text-gray-500 text-center py-20">Загрузка...</div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                  <th className="py-2 px-4 text-left w-8">#</th>
                  <th className="py-2 px-4 text-left">Игрок</th>
                  <th className="py-2 px-4 text-left">Команда</th>
                  <th className="py-2 px-4 text-center text-gold">Ассисты</th>
                </tr>
              </thead>
              <tbody>
                {assistsRanked.map((s, i) => (
                  <tr key={s.player.id} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                    <td className="py-2 px-4 font-medium">{s.player.name}</td>
                    <td className="py-2 px-4"><TeamFlag tla={s.team.tla} name={teamRu(s.team.tla, s.team.shortName)} crest={s.team.crest} size="sm" /></td>
                    <td className="py-2 px-4 text-center font-bold text-gold">{s.assists ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'teams' && (
        standingsLoading ? (
          <div className="text-gray-500 text-center py-20">Загрузка...</div>
        ) : teamsRanked.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-400 mb-2">Групповой этап ещё не начался</p>
            <p className="text-sm text-gray-500">Рейтинг команд появится после первых матчей</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                  <th className="py-2 px-4 text-left w-8">#</th>
                  <th className="py-2 px-4 text-left">Команда</th>
                  <th className="py-2 px-4 text-center w-12">Гр.</th>
                  <th className="py-2 px-4 text-center w-8">И</th>
                  <th className="py-2 px-4 text-center w-8">В</th>
                  <th className="py-2 px-4 text-center w-8">Н</th>
                  <th className="py-2 px-4 text-center w-8">П</th>
                  <th className="py-2 px-4 text-center w-10">РГ</th>
                  <th className="py-2 px-4 text-center text-gold">О</th>
                </tr>
              </thead>
              <tbody>
                {teamsRanked.map((row, i) => {
                  const gdSign = row.goalDifference > 0 ? '+' : ''
                  return (
                    <tr key={row.team.id} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                      <td className="py-2 px-4"><TeamFlag tla={row.team.tla} name={teamRu(row.team.tla, row.team.shortName)} crest={row.team.crest} size="sm" /></td>
                      <td className="py-2 px-4 text-center text-gray-400 text-xs">{row.groupLabel}</td>
                      <td className="py-2 px-4 text-center text-gray-400">{row.playedGames}</td>
                      <td className="py-2 px-4 text-center text-win">{row.won}</td>
                      <td className="py-2 px-4 text-center text-draw">{row.draw}</td>
                      <td className="py-2 px-4 text-center text-loss">{row.lost}</td>
                      <td className={['py-2 px-4 text-center text-xs', row.goalDifference > 0 ? 'text-green-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'].join(' ')}>
                        {gdSign}{row.goalDifference}
                      </td>
                      <td className="py-2 px-4 text-center font-bold text-gold">{row.points}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'cards' && <Unavailable label="Жёлтые и красные карточки" />}
      {tab === 'fifa' && <Unavailable label="Рейтинг FIFA" />}
      {tab === 'fouls' && <Unavailable label="Нарушения" />}
      {tab === 'keepers' && <Unavailable label="Статистика вратарей" />}
      {tab === 'possession' && <Unavailable label="Владение мячом" />}
      {tab === 'passes' && <Unavailable label="Точность передач" />}
    </div>
  )
}
