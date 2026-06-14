import { NextResponse } from 'next/server'
import { parseRssFeed } from '@/lib/rss-parser'
import { getCache, setCache } from '@/lib/api-cache'
import type { NewsItem } from '@/types/news'

const CACHE_KEY = 'uzb-news'
const TTL = 900 // 15 min

export async function GET() {
  const cached = getCache<NewsItem[]>(CACHE_KEY)
  if (cached) return NextResponse.json({ items: cached, stale: false })

  try {
    const res = await fetch('https://uff.uz/rss', { next: { revalidate: 0 } })
    const xml = await res.text()
    const items = parseRssFeed(xml).slice(0, 10)
    setCache(CACHE_KEY, items, TTL)
    return NextResponse.json({ items, stale: false })
  } catch {
    const stale = getCache<NewsItem[]>(CACHE_KEY)
    if (stale) return NextResponse.json({ items: stale, stale: true })
    return NextResponse.json({ items: [], stale: true })
  }
}
