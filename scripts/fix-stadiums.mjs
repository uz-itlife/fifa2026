import https from 'https'
import fs from 'fs'
import path from 'path'

const outDir = 'd:\\My projects\\FIFA2026\\public\\stadiums'

// Try specific known Wikimedia filenames
const directFiles = [
  {
    n: 'sofi',
    files: [
      'SoFi_Stadium_in_Inglewood,_California.jpg',
      'SoFi_Stadium_(aerial)_2022.jpg',
      'SoFi_Stadium_aerial.jpg',
    ]
  },
  {
    n: 'levis',
    files: [
      "Levi%27s_Stadium_aerial.jpg",
      "Levi's_Stadium_field_level.jpg",
      "Levi%27s_Stadium_exterior.jpg",
    ]
  },
  {
    n: 'nrg',
    files: [
      'NRG_Stadium_(Houston_Texas).jpg',
      'NRG_stadium_aerial.jpg',
      'NRG_Stadium_exterior.jpg',
    ]
  },
  {
    n: 'akron',
    files: [
      'Estadio_Akron.jpg',
      'Estadio_Chivas_2014.jpg',
      'Estadio_Chivas_panoramica.jpg',
    ]
  },
]

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'FIFA2026App/1.0 (educational project; bahrom9791@gmail.com)',
        'Accept': '*/*',
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

async function getFileUrl(filename) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`
  const r = await get(api)
  if (r.status !== 200) return null
  const j = JSON.parse(r.body)
  const pages = j?.query?.pages
  const page = Object.values(pages)[0]
  if (page.missing !== undefined) return null
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null
}

for (const s of directFiles) {
  const dest = path.join(outDir, `${s.n}.jpg`)
  let success = false

  for (const fname of s.files) {
    try {
      process.stdout.write(`[${s.n}] trying ${fname}... `)
      const url = await getFileUrl(fname)
      if (!url) { console.log('not found'); await sleep(800); continue }
      const r = await get(url)
      if (r.status !== 200 || r.body.length < 50_000) {
        console.log(`skip (${r.status}, ${r.body.length}B)`)
        await sleep(800)
        continue
      }
      fs.writeFileSync(dest, r.body)
      console.log(`OK ${(r.body.length/1024).toFixed(0)}KB`)
      success = true
      break
    } catch(e) {
      console.log(`ERR: ${e.message}`)
    }
    await sleep(1000)
  }

  if (!success) console.log(`[${s.n}] FAILED - keeping existing`)
  await sleep(1500)
}
