// Mock next/server before it tries to use the Web Request API (unavailable in jsdom)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}))
jest.mock('@/lib/football-api')
jest.mock('@/lib/api-cache')

import { GET } from '@/app/api/standings/route'
import { footballFetch } from '@/lib/football-api'
import { getCache, setCache } from '@/lib/api-cache'
import type { StandingsResponse } from '@/types/football'

const mockFetch = footballFetch as jest.MockedFunction<typeof footballFetch>
const mockGetCache = getCache as jest.MockedFunction<typeof getCache>
const mockSetCache = setCache as jest.MockedFunction<typeof setCache>

const emptyResponse: StandingsResponse = { standings: [] }

describe('GET /api/standings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCache.mockReturnValue(undefined)
    mockSetCache.mockImplementation(() => {})
  })

  it('does not expose auth credentials in the response body', async () => {
    mockFetch.mockResolvedValue(emptyResponse)
    const res = await GET()
    const body = await res.json()
    const bodyText = JSON.stringify(body)

    expect(bodyText).not.toContain('X-Auth-Token')
    expect(bodyText).not.toContain('FOOTBALL_DATA_API_KEY')
    const key = process.env.FOOTBALL_DATA_API_KEY
    if (key && key.length > 4) {
      expect(bodyText).not.toContain(key)
    }
  })

  it('returns 200 with empty standings array without crashing', async () => {
    mockFetch.mockResolvedValue(emptyResponse)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.standings).toEqual([])
    expect(body.stale).toBe(false)
  })

  it('serves from cache without calling the upstream API', async () => {
    const cached: StandingsResponse = { standings: [{ stage: 'GROUP_STAGE', type: 'TOTAL', group: 'GROUP_A', table: [] }] }
    mockGetCache.mockReturnValue(cached)
    const res = await GET()
    expect(res.status).toBe(200)
    expect(mockFetch).not.toHaveBeenCalled()
    const body = await res.json()
    expect(body.data.standings).toHaveLength(1)
    expect(body.stale).toBe(false)
  })

  it('returns stale:true when upstream fails but stale cache exists', async () => {
    const staleData: StandingsResponse = { standings: [{ stage: 'GROUP_STAGE', type: 'TOTAL', group: 'GROUP_B', table: [] }] }
    mockGetCache
      .mockReturnValueOnce(undefined)  // fresh cache: miss
      .mockReturnValueOnce(staleData)  // stale fallback in catch block
    mockFetch.mockRejectedValue(new Error('upstream error'))
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.stale).toBe(true)
    expect(body.data.standings).toHaveLength(1)
  })

  it('returns 502 when upstream fails and no cache exists at all', async () => {
    mockGetCache.mockReturnValue(undefined)
    mockFetch.mockRejectedValue(new Error('network error'))
    const res = await GET()
    expect(res.status).toBe(502)
  })
})
