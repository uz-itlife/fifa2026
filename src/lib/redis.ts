type Cmd = (string | number)[]
type PipeResult = { result: string | number | null }[]

export async function redisPipeline(commands: Cmd[]): Promise<PipeResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      cache: 'no-store',
    })
    return res.json()
  } catch {
    return null
  }
}
