'use client'
import { useState, useEffect, useCallback } from 'react'

const PHOTOS = Array.from({ length: 23 }, (_, i) => `/gallery/${String(i + 1).padStart(2, '0')}.jpg`)

export default function GalleryPage() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setIdx(i => (i + 1) % PHOTOS.length), [])
  const prev = useCallback(() => setIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length), [])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(next, 5000)
    return () => clearTimeout(t)
  }, [idx, paused, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  return (
    <div
      className="-mx-4 -my-6 relative overflow-hidden bg-black select-none"
      style={{ height: 'calc(100vh - 56px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`FIFA 2026 · ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      <div className="absolute top-4 left-5 text-white font-bold text-base tracking-widest opacity-80">
        FIFA 2026 · Галерея
      </div>

      <div className="absolute top-4 right-5 text-white/60 text-sm bg-black/40 px-3 py-1 rounded-full">
        {idx + 1} / {PHOTOS.length}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 text-white text-3xl hover:bg-black/70 transition-colors"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 text-white text-3xl hover:bg-black/70 transition-colors"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-6">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  )
}
