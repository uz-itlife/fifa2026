import type { Match } from '@/types/football'
import { BracketNode } from './BracketNode'

interface Props { matches: Match[] }

const STAGES = [
  { key: 'LAST_32',        label: '1/16 финала',  count: 16, alias: 'ROUND_OF_32', compact: true  },
  { key: 'LAST_16',        label: '1/8 финала',   count: 8,  alias: 'ROUND_OF_16', compact: false },
  { key: 'QUARTER_FINALS', label: '1/4 финала',   count: 4,  alias: null,          compact: false },
  { key: 'SEMI_FINALS',    label: '1/2 финала',   count: 2,  alias: null,          compact: false },
  { key: 'THIRD_PLACE',    label: 'За 3-е место', count: 1,  alias: null,          compact: false },
  { key: 'FINAL',          label: 'Финал',         count: 1,  alias: null,          compact: false },
]

const LAST32_SEEDINGS = [
  'Германия — Парагвай',
  'Франция — Швеция',
  'ЮАР — Канада',
  'Нидерланды — Марокко',
  'Португалия — Хорватия',
  'Испания — Австрия',
  'США — Босния',
  'Бельгия — Сенегал',
  'Бразилия — Япония',
  "Кот-д'Ивуар — Норвегия",
  'Мексика — Эквадор',
  'Англия — ДР Конго',
  'Аргентина — Кабо-Верде',
  'Австралия — Египет',
  'Швейцария — Алжир',
  'Колумбия — Гана',
]

const LAST16_SEEDINGS = [
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
    <div className="flex gap-4 overflow-x-auto pb-4 items-stretch">
      {STAGES.map((stage, stageIdx) => {
        const stageMatches = matches
          .filter(m => m.stage === stage.key || (stage.alias && m.stage === stage.alias))
          .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
        const slots = Array.from({ length: stage.count }, (_, i) => stageMatches[i] ?? null)
        const isFinal = stage.key === 'FINAL' || stage.key === 'THIRD_PLACE'
        const isLast32 = stage.key === 'LAST_32'
        const isLast16 = stage.key === 'LAST_16'
        const flexGrow = isFinal ? 1 : Math.pow(2, Math.min(stageIdx, 4))
        return (
          <div key={stage.key} className="flex flex-col gap-2 shrink-0">
            <h3 className="text-[10px] font-bold text-gold uppercase tracking-widest text-center mb-1">
              {stage.label}
            </h3>
            {slots.map((m, i) => (
              <div
                key={i}
                className="flex flex-col justify-center"
                style={{ flex: flexGrow }}
              >
                <BracketNode
                  match={m}
                  label={`Матч ${i + 1}`}
                  seeding={
                    !m && isLast32 ? LAST32_SEEDINGS[i] :
                    !m && isLast16 ? LAST16_SEEDINGS[i] :
                    undefined
                  }
                  compact={stage.compact}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
