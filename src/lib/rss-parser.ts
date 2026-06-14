import type { NewsItem } from '@/types/news'

export function parseRssFeed(xml: string): NewsItem[] {
  try {
    const items: NewsItem[] = []
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)
    for (const match of itemMatches) {
      const block = match[1]
      const title =
        block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ??
        block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''
      const url = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? ''
      const date = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? new Date().toISOString()
      const description =
        block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ??
        block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? ''
      if (title && url) {
        items.push({
          title: title.trim(),
          url: url.trim(),
          date: new Date(date).toISOString(),
          source: 'uff.uz',
          description: description.trim(),
        })
      }
    }
    return items
  } catch {
    return []
  }
}
