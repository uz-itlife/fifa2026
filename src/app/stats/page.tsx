'use client'
import { useState } from 'react'
import { useScorers } from '@/hooks/useScorers'
import { useStandings } from '@/hooks/useStandings'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { StaleDataBanner } from '@/components/ui/StaleDataBanner'
import { teamRu } from '@/lib/russian-teams'
import { playerRu } from '@/lib/player-names-ru'
import { getBest8ThirdPlace } from '@/lib/standings-utils'
import fifaRankingData from '@/data/fifa-ranking.json'
import matchStatsData from '@/data/match-stats.json'

interface TeamMatchStats {
  possession: number | null
  fouls: number | null
  passes: number | null
  passAccuracy: number | null
  goalkeeperSaves: number | null
  yellowCards: number | null
  redCards: number | null
  corners: number | null
}

interface MatchStatsEntry {
  homeTeam: { tla: string; name: string }
  awayTeam: { tla: string; name: string }
  stats: { home: TeamMatchStats | null; away: TeamMatchStats | null }
  cards: { playerId: string; playerName: string; team: string; type: 'yellow' | 'red' | 'second-yellow'; minute: string }[]
}

const matchStats = matchStatsData as unknown as Record<string, MatchStatsEntry>
const matchStatsList = Object.entries(matchStats).map(([id, m]) => ({ id, ...m }))

const TABS = [
  { key: 'teams', label: 'Лучшие команды' },
  { key: 'players', label: 'Лучшие игроки' },
  { key: 'assists', label: 'Ассисты' },
  { key: 'fifa', label: 'Рейтинг FIFA' },
  { key: 'cards', label: 'Карточки' },
  { key: 'fouls', label: 'Нарушения' },
  { key: 'keepers', label: 'Вратари' },
  { key: 'possession', label: 'Владение' },
  { key: 'passes', label: 'Передачи' },
] as const

type TabKey = typeof TABS[number]['key']

function PendingSync({ label }: { label: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-gray-400 mb-2">{label}</p>
      <p className="text-sm text-gray-500">Появится после синхронизации статистики матчей</p>
    </div>
  )
}

function MatchStatRow({ entry, statKey, suffix }: {
  entry: typeof matchStatsList[number]
  statKey: keyof TeamMatchStats
  suffix?: string
}) {
  const home = entry.stats?.home?.[statKey]
  const away = entry.stats?.away?.[statKey]
  return (
    <tr className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
      <td className="py-2 px-4 text-left">{teamRu(entry.homeTeam.tla, entry.homeTeam.name)}</td>
      <td className="py-2 px-4 text-center font-bold text-gold">{home ?? '–'}{home != null && suffix}</td>
      <td className="py-2 px-4 text-center text-gray-500">vs</td>
      <td className="py-2 px-4 text-center font-bold text-gold">{away ?? '–'}{away != null && suffix}</td>
      <td className="py-2 px-4 text-left">{teamRu(entry.awayTeam.tla, entry.awayTeam.name)}</td>
    </tr>
  )
}

function MatchStatTable({ statKey, suffix, emptyLabel }: {
  statKey: keyof TeamMatchStats
  suffix?: string
  emptyLabel: string
}) {
  const entries = matchStatsList.filter(e => e.stats?.home != null || e.stats?.away != null)
  if (entries.length === 0) return <PendingSync label={emptyLabel} />
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(entry => (
            <MatchStatRow key={entry.id} entry={entry} statKey={statKey} suffix={suffix} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function StatsPage() {
  const [tab, setTab] = useState<TabKey>('teams')
  const [cardsView, setCardsView] = useState<'teams' | 'players'>('teams')
  const { scorers, stale: scorersStale, isLoading: scorersLoading } = useScorers()
  const { standings, stale: standingsStale, isLoading: standingsLoading } = useStandings()

  const stale = scorersStale || standingsStale

  const playersRanked = [...scorers]
    .map(s => ({ ...s, index: s.goals * 2 + (s.assists ?? 0) }))
    .sort((a, b) => b.index - a.index)

  const assistsRanked = [...scorers].sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))

  const qualifiedThirdTlas = getBest8ThirdPlace(standings)

  const teamsRanked = standings
    .flatMap(g => g.table.map(row => ({ ...row, groupLabel: (g.group ?? '').replace(/^GROUP[_\s]*/i, '').toUpperCase() })))
    .sort((a, b) => {
      if (a.position !== b.position) return a.position - b.position
      return b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor
    })

  const cardsRanked = (() => {
    const byPlayer = new Map<string, { playerName: string; team: string; yellow: number; red: number }>()
    const byTeam = new Map<string, { tla: string; yellow: number; red: number }>()
    for (const entry of matchStatsList) {
      for (const c of entry.cards) {
        const ep = byPlayer.get(c.playerId) ?? { playerName: c.playerName, team: c.team, yellow: 0, red: 0 }
        if (c.type === 'red') ep.red += 1; else ep.yellow += 1
        byPlayer.set(c.playerId, ep)
        const et = byTeam.get(c.team) ?? { tla: c.team, yellow: 0, red: 0 }
        if (c.type === 'red') et.red += 1; else et.yellow += 1
        byTeam.set(c.team, et)
      }
    }
    const players = [...byPlayer.values()].sort((a, b) => (b.red * 2 + b.yellow) - (a.red * 2 + a.yellow))
    const teams = [...byTeam.values()].sort((a, b) => (b.red * 2 + b.yellow) - (a.red * 2 + a.yellow))
    return { players, teams }
  })()

  return (
    <div>
      {stale && <StaleDataBanner />}
      <h1 className="text-2xl font-bold mb-4">Статистика</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(t => (
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
                  <th className="py-2 px-4 text-center">Пен</th>
                  <th className="py-2 px-4 text-center text-gold">Индекс</th>
                </tr>
              </thead>
              <tbody>
                {playersRanked.map((s, i) => (
                  <tr key={s.player.id} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                    <td className="py-2 px-4 font-medium">{playerRu(s.player.name)}</td>
                    <td className="py-2 px-4"><TeamFlag tla={s.team.tla} name={teamRu(s.team.tla, s.team.shortName)} crest={s.team.crest} size="sm" /></td>
                    <td className="py-2 px-4 text-center">{s.goals}</td>
                    <td className="py-2 px-4 text-center">{s.assists ?? 0}</td>
                    <td className="py-2 px-4 text-center">{s.penalties ?? 0}</td>
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
                    <td className="py-2 px-4 font-medium">{playerRu(s.player.name)}</td>
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
                  const posColor = row.position === 1 ? 'text-gold' : row.position === 2 ? 'text-green-500' : row.position === 3 ? (qualifiedThirdTlas.has(row.team.tla) ? 'text-blue-400' : 'text-orange-400') : 'text-gray-500'
                  return (
                    <tr key={row.team.id} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className={`py-2 px-4 text-xs font-bold ${posColor}`}>{i + 1}</td>
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

      {tab === 'fifa' && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-light-border dark:border-dark-border">
            {fifaRankingData.source} · обновлено {fifaRankingData.updatedAt}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                <th className="py-2 px-4 text-left w-8">#</th>
                <th className="py-2 px-4 text-left">Команда</th>
                <th className="py-2 px-4 text-center text-gold">Очки</th>
              </tr>
            </thead>
            <tbody>
              {fifaRankingData.ranking.map(r => (
                <tr key={r.tla} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="py-2 px-4 text-gray-500 text-xs">{r.rank}</td>
                  <td className="py-2 px-4"><TeamFlag tla={r.tla} name={teamRu(r.tla, r.tla)} size="sm" /></td>
                  <td className="py-2 px-4 text-center font-bold text-gold">{r.points ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'cards' && (
        cardsRanked.players.length === 0 ? <PendingSync label="Жёлтые и красные карточки" /> : (
          <>
            <div className="flex gap-2 mb-4">
              {(['teams', 'players'] as const).map(v => (
                <button key={v} onClick={() => setCardsView(v)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${cardsView === v ? 'bg-gold text-dark-bg' : 'text-gray-400 border border-light-border dark:border-dark-border hover:text-white'}`}>
                  {v === 'teams' ? 'По командам' : 'По игрокам'}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
              {cardsView === 'teams' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                      <th className="py-2 px-4 text-left w-8">#</th>
                      <th className="py-2 px-4 text-left">Команда</th>
                      <th className="py-2 px-4 text-center">🟨</th>
                      <th className="py-2 px-4 text-center">🟥</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardsRanked.teams.map((c, i) => (
                      <tr key={c.tla} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                        <td className="py-2 px-4"><TeamFlag tla={c.tla} name={teamRu(c.tla, c.tla)} size="sm" /></td>
                        <td className="py-2 px-4 text-center font-bold text-yellow-500">{c.yellow}</td>
                        <td className="py-2 px-4 text-center font-bold text-red-500">{c.red}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-light-border dark:border-dark-border">
                      <th className="py-2 px-4 text-left w-8">#</th>
                      <th className="py-2 px-4 text-left">Игрок</th>
                      <th className="py-2 px-4 text-left">Команда</th>
                      <th className="py-2 px-4 text-center">🟨</th>
                      <th className="py-2 px-4 text-center">🟥</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardsRanked.players.map((c, i) => (
                      <tr key={c.playerName + c.team} className="border-t border-light-border/40 dark:border-dark-border/40 hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="py-2 px-4 text-gray-500 text-xs">{i + 1}</td>
                        <td className="py-2 px-4 font-medium">{playerRu(c.playerName)}</td>
                        <td className="py-2 px-4">{teamRu(c.team, c.team)}</td>
                        <td className="py-2 px-4 text-center font-bold text-yellow-500">{c.yellow}</td>
                        <td className="py-2 px-4 text-center font-bold text-red-500">{c.red}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )
      )}

      {tab === 'fouls' && <MatchStatTable statKey="fouls" emptyLabel="Нарушения" />}
      {tab === 'keepers' && <MatchStatTable statKey="goalkeeperSaves" emptyLabel="Сэйвы вратарей" />}
      {tab === 'possession' && <MatchStatTable statKey="possession" suffix="%" emptyLabel="Владение мячом" />}
      {tab === 'passes' && <MatchStatTable statKey="passAccuracy" suffix="%" emptyLabel="Точность передач" />}
    </div>
  )
}
