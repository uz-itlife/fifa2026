import { type NextRequest } from 'next/server'
import { redisPipeline } from '@/lib/redis'

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json().catch(() => ({}))
  if (!sessionId) return Response.json({ online: 1 })

  const nowSec = Math.floor(Date.now() / 1000)
  const cutoff = nowSec - 120

  try {
    const r = await redisPipeline([
      ['ZADD', 'wc:online', nowSec, sessionId],
      ['ZREMRANGEBYSCORE', 'wc:online', '0', cutoff],
      ['ZCARD', 'wc:online'],
    ])
    return Response.json({ online: Math.max(1, Number(r?.[2]?.result ?? 1)) })
  } catch {
    return Response.json({ online: 1 })
  }
}
