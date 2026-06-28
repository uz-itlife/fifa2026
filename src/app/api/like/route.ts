import { redisPipeline } from '@/lib/redis'

export async function POST() {
  try {
    const r = await redisPipeline([['INCR', 'wc:likes']])
    return Response.json({ likes: Number(r?.[0]?.result ?? 0) })
  } catch {
    return Response.json({ likes: 0 })
  }
}
