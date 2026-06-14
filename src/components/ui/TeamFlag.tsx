'use client'
import { useState } from 'react'
import { tlaToFlag } from '@/lib/flag-utils'

interface TeamFlagProps {
  tla: string
  name: string
  crest?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 20, md: 28, lg: 40 }

export function TeamFlag({ tla, name, crest, size = 'md' }: TeamFlagProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const px = sizes[size]

  return (
    <span className="inline-flex items-center gap-2">
      {crest && !imgFailed ? (
        <img
          src={crest}
          alt={name}
          width={px}
          height={px}
          className="object-contain"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span style={{ fontSize: px * 0.85 }}>{tlaToFlag(tla)}</span>
      )}
      <span className="font-medium">{name}</span>
    </span>
  )
}
