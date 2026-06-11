const BASE = 'https://api.football-data.org/v4'

export async function footballFetch<T>(path: string): Promise<T> {
  const key = process.env.FOOTBALL_DATA_API_KEY?.trim()
  if (!key) throw new Error('FOOTBALL_DATA_API_KEY is not set')

  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': key },
    next: { revalidate: 0 }, // cache handled by api-cache.ts
  })

  if (!res.ok) {
    throw new Error(`football-data.org error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}
