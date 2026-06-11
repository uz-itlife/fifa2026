import { getCache, setCache, isFresh } from '@/lib/api-cache'

describe('api-cache', () => {
  beforeEach(() => { jest.useFakeTimers() })
  afterEach(() => { jest.useRealTimers() })

  it('returns undefined for unknown key', () => {
    expect(getCache('missing')).toBeUndefined()
  })

  it('returns stored value within TTL', () => {
    setCache('key', { foo: 1 }, 60)
    expect(getCache('key')).toEqual({ foo: 1 })
  })

  it('returns undefined after TTL expires', () => {
    setCache('key2', { bar: 2 }, 1)
    jest.advanceTimersByTime(2000)
    expect(getCache('key2')).toBeUndefined()
  })

  it('isFresh returns true within TTL', () => {
    setCache('key3', {}, 60)
    expect(isFresh('key3')).toBe(true)
  })

  it('isFresh returns false after TTL', () => {
    setCache('key4', {}, 1)
    jest.advanceTimersByTime(2000)
    expect(isFresh('key4')).toBe(false)
  })
})
