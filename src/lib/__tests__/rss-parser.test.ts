import { parseRssFeed } from '@/lib/rss-parser'

const SAMPLE_RSS = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Узбекистан победил 2:0</title>
      <link>https://uff.uz/news/1</link>
      <pubDate>Wed, 11 Jun 2026 10:00:00 GMT</pubDate>
      <description>Отличная победа</description>
    </item>
  </channel>
</rss>`

describe('parseRssFeed', () => {
  it('extracts title, url, date, description', () => {
    const items = parseRssFeed(SAMPLE_RSS)
    expect(items).toHaveLength(1)
    expect(items[0].title).toBe('Узбекистан победил 2:0')
    expect(items[0].url).toBe('https://uff.uz/news/1')
    expect(items[0].source).toBe('uff.uz')
    expect(items[0].description).toBe('Отличная победа')
  })

  it('returns empty array for malformed XML', () => {
    expect(parseRssFeed('not xml')).toEqual([])
  })
})
