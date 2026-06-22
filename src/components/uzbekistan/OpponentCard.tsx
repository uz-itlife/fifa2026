import type { Standing } from '@/types/football'
import { TeamFlag } from '@/components/ui/TeamFlag'
import { teamRu } from '@/lib/russian-teams'

interface Props {
  standing: Standing
  uzbRecord: { w: number; d: number; l: number }
}

export function OpponentCard({ standing, uzbRecord }: Props) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border">
      <TeamFlag tla={standing.team.tla} name={teamRu(standing.team.tla, standing.team.name)} crest={standing.team.crest} size="md" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div><p className="text-gray-500">И</p><p className="font-bold">{standing.playedGames}</p></div>
        <div><p className="text-gray-500">ОЧ</p><p className="font-bold text-gold">{standing.points}</p></div>
        <div><p className="text-gray-500">ГР</p><p className="font-bold">{standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}</p></div>
      </div>
      <div className="mt-3 text-xs text-center text-gray-500">
        Личные встречи с Узбекистаном:{' '}
        <span className="text-win">{uzbRecord.w}В</span>{' '}
        <span className="text-draw">{uzbRecord.d}Н</span>{' '}
        <span className="text-loss">{uzbRecord.l}П</span>
      </div>
    </div>
  )
}
