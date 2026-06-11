interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
}

export function getCache<T>(key: string): T | undefined {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) { store.delete(key); return undefined }
  return entry.data as T
}

export function isFresh(key: string): boolean {
  const entry = store.get(key)
  return !!entry && Date.now() <= entry.expiresAt
}
