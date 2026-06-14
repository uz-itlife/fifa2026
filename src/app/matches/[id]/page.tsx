'use client'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type { CachedResponse, Match } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { WatchBanner } from '@/components/uzbekistan/WatchBanner'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data } = useSWR<CachedResponse<Match>>(`/api/matches/${id}`, fetcher, { refreshInterval: 120_000 })
  const match = data?.data

  if (!match) return <div className="text-gray-500 text-center py-20">Загрузка...</div>

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isUzb = match.homeTeam.tla === 'UZB' || match.awayTeam.tla === 'UZB'

  return (
    <div className="max-w-2xl mx-auto">
      {isUzb && isLive && <WatchBanner />}

      <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-light-border dark:border-dark-border mb-6">
        <div className="text-center text-xs text-gray-500 mb-4 flex items-center justify-center gap-2">
          <span>{match.group?.replace('GROUP_', 'Группа ') ?? match.stage}</span>
          {isLive && <LiveBadge minute={match.minute} />}
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="text-center flex-1">
            <TeamFlag tla={match.homeTeam.tla} name={match.homeTeam.name} crest={match.homeTeam.crest} size="lg" />
          </div>
          <div className="text-4xl font-black text-gold shrink-0">
            {match.score.fullTime.home ?? '–'} : {match.score.fullTime.away ?? '–'}
          </div>
          <div className="text-center flex-1">
            <TeamFlag tla={match.awayTeam.tla} name={match.awayTeam.name} crest={match.awayTeam.crest} size="lg" />
          </div>
        </div>

        {match.score.halfTime.home !== null && (
          <p className="text-center text-xs text-gray-500 mt-3">
            Перерыв: {match.score.halfTime.home} : {match.score.halfTime.away}
          </p>
        )}
      </div>

      {isUzb && !isLive && <WatchBanner compact />}
    </div>
  )
}
