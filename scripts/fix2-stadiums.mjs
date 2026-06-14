import https from 'https'
import fs from 'fs'
import path from 'path'

const outDir = 'd:\\My projects\\FIFA2026\\public\\stadiums'

const targets = [
  { n: 'sofi',     q: 'SoFi Stadium' },
  { n: 'levis',    q: "Levi's Stadium" },
  { n: 'nrg',      q: 'NRG Stadium' },
  { n: 'akron',    q: 'Estadio Akron' },
]

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'FIFA2026App/1.0 (educational project; bahrom9791@gmail.com)',
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(get(res.headers.location)); return
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Search Wikimedia Commons for images
async function searchCommons(q) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=5&format=json`
  const r = await get(api)
  if (r.status !== 200) return []
  const j = JSON.parse(r.body)
  return (j?.query?.search ?? []).map(x => x.title)
}

async function getImageUrl(title) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`
  const r = await get(api)
  if (r.status !== 200) return null
  const j = JSON.parse(r.body)
  const page = Object.values(j?.query?.pages ?? {})[0]
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null
}

for (const s of targets) {
  const dest = path.join(outDir, `${s.n}.jpg`)
  process.stdout.write(`[${s.n}] searching Commons... `)

  try {
    const titles = await searchCommons(s.q)
    console.log(`${titles.length} results`)

    let saved = false
    for (const title of titles) {
      if (!title.toLowerCase().endsWith('.jpg') && !title.toLowerCase().endsWith('.jpeg')) continue
      await sleep(400)
      const url = await getImageUrl(title)
      if (!url) continue
      const r = await get(url)
      if (r.status === 200 && r.body.length > 80_000) {
        fs.writeFileSync(dest, r.body)
        console.log(`  -> ${title.slice(0,60)}  ${(r.body.length/1024).toFixed(0)}KB`)
        saved = true
        break
      }
      console.log(`  skip ${title.slice(0,40)} (${r.body.length}B)`)
    }
    if (!saved) console.log(`  FAILED`)
  } catch(e) {
    console.log(`ERR: ${e.message}`)
  }
  await sleep(1500)
}
