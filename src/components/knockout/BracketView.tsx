import type { Match } from '@/types/football'
import { BracketNode } from './BracketNode'

interface Props { matches: Match[] }

const STAGES = [
  { key: 'LAST_16',       label: '1/8 финала',   count: 8, alias: 'ROUND_OF_16' },
  { key: 'QUARTER_FINALS', label: '1/4 финала',  count: 4, alias: null },
  { key: 'SEMI_FINALS',   label: '1/2 финала',   count: 2, alias: null },
  { key: 'THIRD_PLACE',   label: 'За 3-е место', count: 1, alias: null },
  { key: 'FINAL',         label: 'Финал',         count: 1, alias: null },
]

// Round of 16 seedings: winners of consecutive 1/16 match pairs
// Slot labels match the numbered order of LAST_32 matches sorted by date
const LAST16_SEEDING = [
  'Победитель матча 1 — Победитель матча 2',
  'Победитель матча 3 — Победитель матча 4',
  'Победитель матча 5 — Победитель матча 6',
  'Победитель матча 7 — Победитель матча 8',
  'Победитель матча 9 — Победитель матча 10',
  'Победитель матча 11 — Победитель матча 12',
  'Победитель матча 13 — Победитель матча 14',
  'Победитель матча 15 — Победитель матча 16',
]

export function BracketView({ matches }: Props) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {STAGES.map((stage, stageIdx) => {
        const stageMatches = matches.filter(
          m => m.stage === stage.key || (stage.alias && m.stage === stage.alias)
        )
        const slots = Array.from({ length: stage.count }, (_, i) => stageMatches[i] ?? null)
        const isFinal = stage.key === 'FINAL' || stage.key === 'THIRD_PLACE'
        const isLast16 = stage.key === 'LAST_16'
        return (
          <div key={stage.key} className="flex flex-col gap-4 shrink-0">
            <h3 className="text-xs font-bold text-gold uppercase tracking-widest text-center mb-2">
              {stage.label}
            </h3>
            {slots.map((m, i) => (
              <div
                key={i}
                className="flex flex-col justify-center"
                style={{ flex: isFinal ? 1 : Math.pow(2, Math.min(stageIdx, 3)) }}
              >
                <BracketNode
                  match={m}
                  label={`Матч ${i + 1}`}
                  seeding={(!m && isLast16) ? LAST16_SEEDING[i] : undefined}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
