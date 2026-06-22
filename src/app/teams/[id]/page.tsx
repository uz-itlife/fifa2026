'use client'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type { CachedResponse, TeamDetail } from '@/types/football'
import { teamRu } from '@/lib/russian-teams'
import { playerRu } from '@/lib/player-names-ru'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function TeamPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<CachedResponse<TeamDetail>>(`/api/teams/${id}`, fetcher, { refreshInterval: 3_600_000 })
  const team = data?.data
  if (!team) return <div className="text-gray-500 text-center py-20">Загрузка...</div>
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {team.crest && <img src={team.crest} alt={team.name} className="w-16 h-16 object-contain" />}
        <div>
          <h1 className="text-2xl font-bold">{teamRu(team.tla, team.name)}</h1>
          {team.coach && <p className="text-gray-400 text-sm">Тренер: {playerRu(team.coach.name)}</p>}
          {team.founded && <p className="text-gray-500 text-xs">Основан: {team.founded}</p>}
        </div>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-dark-bg/50 text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 px-4 text-left">Игрок</th>
              <th className="py-2 px-4 text-center">Позиция</th>
              <th className="py-2 px-4 text-center">#</th>
            </tr>
          </thead>
          <tbody>
            {team.squad.map(p => (
              <tr key={p.id} className="border-t border-light-border/50 dark:border-dark-border/50">
                <td className="py-2 px-4">{playerRu(p.name)}</td>
                <td className="py-2 px-4 text-center text-gray-400 text-xs">{p.position ?? '—'}</td>
                <td className="py-2 px-4 text-center text-gray-500">{p.shirtNumber ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
