import Image from 'next/image'

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

function tlaToFlag(tla: string): string {
  try {
    return tla.toUpperCase().split('').map(c =>
      String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
    ).join('')
  } catch { return '🏳️' }
}
