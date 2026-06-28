'use client'
import { useEffect, useState } from 'react'

export function LikeCounter() {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    setLiked(!!localStorage.getItem('_liked'))
    fetch('/api/site-stats')
      .then(r => r.json())
      .then((d: { likes: number }) => setLikes(d.likes))
      .catch(() => {})
  }, [])

  const handleLike = async () => {
    setBump(true)
    setTimeout(() => setBump(false), 300)
    const next = !liked
    setLiked(next)
    if (next) {
      localStorage.setItem('_liked', '1')
      const r = await fetch('/api/like', { method: 'POST' }).then(r => r.json()).catch(() => null)
      if (r?.likes) setLikes(r.likes)
    } else {
      localStorage.removeItem('_liked')
      setLikes(l => Math.max(0, l - 1))
    }
  }

  return (
    <button
      onClick={handleLike}
      title="Нравится"
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
        liked
          ? 'text-red-400 bg-red-500/10'
          : 'text-white/50 hover:text-red-400 hover:bg-red-500/10'
      }`}
    >
      <span className={`text-base transition-transform ${bump ? 'scale-150' : 'scale-100'}`}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{likes.toLocaleString('ru-RU')}</span>
    </button>
  )
}
