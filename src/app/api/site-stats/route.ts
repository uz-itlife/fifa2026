import { type NextRequest } from 'next/server'
import { redisPipeline } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const increment = req.nextUrl.searchParams.get('inc') === '1'
  const nowSec = Math.floor(Date.now() / 1000)
  const cutoff = nowSec - 120 // 2 minutes window for online

  const cmds = [
    increment ? ['INCR', 'wc:views'] : ['GET', 'wc:views'],
    ['GET', 'wc:likes'],
    ['ZREMRANGEBYSCORE', 'wc:online', '0', cutoff],
    ['ZCARD', 'wc:online'],
  ]

  try {
    const r = await redisPipeline(cmds)
    return Response.json({
      views: Number(r?.[0]?.result ?? 0),
      likes: Number(r?.[1]?.result ?? 0),
      online: Math.max(1, Number(r?.[3]?.result ?? 1)),
    })
  } catch {
    return Response.json({ views: 0, likes: 0, online: 1 })
  }
}
