'use client'
import { useEffect, useRef, useState } from 'react'

interface Stats { views: number; online: number }

export function Footer() {
  const [stats, setStats] = useState<Stats>({ views: 0, online: 1 })
  const [sid, setSid] = useState('')

  useEffect(() => {
    let id = sessionStorage.getItem('_sid')
    if (!id) { id = Math.random().toString(36).slice(2, 10); sessionStorage.setItem('_sid', id) }
    setSid(id)
  }, [])

  const counted = useRef(false)
  useEffect(() => {
    if (counted.current) return
    counted.current = true
    const inc = !sessionStorage.getItem('_viewed')
    if (inc) sessionStorage.setItem('_viewed', '1')
    fetch(`/api/site-stats${inc ? '?inc=1' : ''}`)
      .then(r => r.json())
      .then((d: Stats) => setStats(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!sid) return
    const beat = () =>
      fetch('/api/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid }),
      })
        .then(r => r.json())
        .then((d: { online: number }) => setStats(s => ({ ...s, online: d.online })))
        .catch(() => {})
    beat()
    const t = setInterval(beat, 30_000)
    return () => clearInterval(t)
  }, [sid])

  return (
    <footer className="mt-auto py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <p className="text-white/50 text-xs">
          Разработано{' '}
          <span className="text-gold font-semibold tracking-wide">Bahrom9791</span>
        </p>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span title="Всего просмотров">👁 {stats.views.toLocaleString('ru-RU')}</span>
          <span title="Онлайн сейчас" className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            {stats.online} онлайн
          </span>
        </div>
      </div>
    </footer>
  )
}
