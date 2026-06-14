import type { Match } from '@/types/football'
import { BracketNode } from './BracketNode'

interface Props { matches: Match[] }

const STAGES = [
  { key: 'ROUND_OF_16', label: '1/8 финала', count: 8 },
  { key: 'QUARTER_FINALS', label: 'Четвертьфиналы', count: 4 },
  { key: 'SEMI_FINALS', label: 'Полуфиналы', count: 2 },
  { key: 'FINAL', label: 'Финал', count: 1 },
]

export function BracketView({ matches }: Props) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {STAGES.map((stage, stageIdx) => {
        const stageMatches = matches.filter(m => m.stage === stage.key)
        const slots = Array.from({ length: stage.count }, (_, i) => stageMatches[i] ?? null)
        return (
          <div key={stage.key} className="flex flex-col gap-4 shrink-0">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest text-center mb-2">
              {stage.label}
            </h3>
            {slots.map((m, i) => (
              <div key={i} className="flex flex-col justify-center" style={{ flex: Math.pow(2, stageIdx) }}>
                <BracketNode match={m} label={`Матч ${i + 1}`} />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
