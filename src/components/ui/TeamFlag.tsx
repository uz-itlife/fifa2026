import Image from 'next/image'
import { tlaToFlag } from '@/lib/flag-utils'

interface TeamFlagProps {
  tla: string
  name: string
  crest?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 20, md: 28, lg: 40 }

export function TeamFlag({ tla, name, crest, size = 'md' }: TeamFlagProps) {
  const px = sizes[size]
  return (
    <span className="inline-flex items-center gap-2">
      {crest ? (
        <Image src={crest} alt={name} width={px} height={px} className="object-contain" />
      ) : (
        <span className="text-lg">{tlaToFlag(tla)}</span>
      )}
      <span className="font-medium">{name}</span>
    </span>
  )
}
