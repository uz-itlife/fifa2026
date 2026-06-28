'use client'
import { useState, useEffect, useCallback } from 'react'

const WEBP = new Set([14, 19, 21])
const PHOTOS = Array.from({ length: 22 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/gallery/${n}.${WEBP.has(i + 1) ? 'webp' : 'jpg'}`
})

export function BgSlideshow() {
  const [idx, setIdx] = useState(0)
  const next = useCallback(() => setIdx(i => (i + 1) % PHOTOS.length), [])

  useEffect(() => {
    const t = setTimeout(next, 8000)
    return () => clearTimeout(t)
  }, [idx, next])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDuration: '2000ms' }}
        />
      ))}
      <div className="absolute inset-0 bg-black/55" />
    </div>
  )
}
