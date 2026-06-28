import type { MetadataRoute } from 'next'

const BASE = 'https://fifa2026-ru.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/matches`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/groups`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/knockout`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/teams`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/stats`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/stadiums`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/gallery`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
