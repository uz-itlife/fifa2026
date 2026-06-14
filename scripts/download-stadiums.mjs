import https from 'https'
import fs from 'fs'
import path from 'path'

const outDir = 'd:\\My projects\\FIFA2026\\public\\stadiums'
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const searches = [
  { n: 'metlife',      q: 'MetLife Stadium' },
  { n: 'att',         q: 'AT&T Stadium Arlington' },
  { n: 'sofi',        q: 'SoFi Stadium' },
  { n: 'azteca',      q: 'Estadio Azteca' },
  { n: 'bcplace',     q: 'BC Place Vancouver' },
  { n: 'levis',       q: "Levi's Stadium Santa Clara" },
  { n: 'lincoln',     q: 'Lincoln Financial Field' },
  { n: 'arrowhead',   q: 'Arrowhead Stadium' },
  { n: 'nrg',         q: 'NRG Stadium Houston' },
  { n: 'lumen',       q: 'Lumen Field Seattle' },
  { n: 'gillette',    q: 'Gillette Stadium' },
  { n: 'bbva',        q: 'Estadio BBVA Monterrey' },
  { n: 'akron',       q: 'Estadio Akron Guadalajara' },
  { n: 'bmo',         q: 'BMO Field Toronto' },
  { n: 'mercedesbenz',q: 'Mercedes-Benz Stadium Atlanta' },
  { n: 'hardrock',    q: 'Hard Rock Stadium Miami' },
]

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'FIFA2026App/1.0 (educational project; bahrom9791@gmail.com)',
        'Accept': 'application/json',
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(get(res.headers.location))
        return
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function findImage(q) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=1&format=json`
  const r = await get(api)
  if (r.status !== 200) return null
  const j = JSON.parse(r.body)
  const results = j?.query?.search
  if (!results?.length) return null
  const title = results[0].title
  const api2 = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`
  const r2 = await get(api2)
  if (r2.status !== 200) return null
  const j2 = JSON.parse(r2.body)
  const pages = j2?.query?.pages
  const page = Object.values(pages)[0]
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null
}

async function downloadImg(url, dest) {
  const r = await get(url)
  if (r.status !== 200) throw new Error(`HTTP ${r.status}`)
  fs.writeFileSync(dest, r.body)
  return r.body.length
}

for (const s of searches) {
  const dest = path.join(outDir, `${s.n}.jpg`)
  try {
    process.stdout.write(`[${s.n}] searching... `)
    const url = await findImage(s.q)
    if (!url) { console.log('NOT FOUND'); continue }
    process.stdout.write(`downloading... `)
    const bytes = await downloadImg(url, dest)
    console.log(`OK ${(bytes/1024).toFixed(0)}KB`)
  } catch(e) {
    console.log(`ERR: ${e.message}`)
  }
  await sleep(1500)
}
