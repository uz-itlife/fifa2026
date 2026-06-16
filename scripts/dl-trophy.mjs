import https from 'https'
import fs from 'fs'

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'FIFA2026App/1.0 (educational; bahrom9791@gmail.com)' }
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

const title = encodeURIComponent('File:FIFA World Cup Trophy photo by Djuradj Vujcic.jpg')
const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json`
const r = await get(api)
const j = JSON.parse(r.body)
const page = Object.values(j.query.pages)[0]
console.log(JSON.stringify(page, null, 2))
const url = page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url
console.log('URL:', url)
if (!url) process.exit(1)
const img = await get(url)
fs.writeFileSync('d:\\My projects\\FIFA2026\\public\\trophy.jpg', img.body)
console.log(`Saved ${(img.body.length/1024).toFixed(0)}KB`)
