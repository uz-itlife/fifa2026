import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const ENV_FILE = path.join(ROOT, '.env.local')
const DATA_FILE = path.join(ROOT, 'src', 'data', 'match-stats.json')

function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}
loadEnv()

const FOOTBALL_DATA_KEY = process.env.FOOTBALL_DATA_API_KEY

if (!FOOTBALL_DATA_KEY) {
  console.error('Missing FOOTBALL_DATA_API_KEY in .env.local')
  process.exit(1)
}

async function footballData(pathname) {
  const res = await fetch(`https://api.football-data.org/v4${pathname}`, {
    headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
  })
  if (!res.ok) throw new Error(`football-data.org ${res.status}`)
  return res.json()
}

async function espn(pathname) {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world${pathname}`)
  if (!res.ok) throw new Error(`espn ${res.status}`)
  return res.json()
}

function toEspnDate(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

async function findEvent(match) {
  const matchDate = new Date(match.utcDate)
  const prevDate = new Date(matchDate.getTime() - 24 * 60 * 60 * 1000)
  const candidates = [toEspnDate(matchDate), toEspnDate(prevDate)]

  for (const date of candidates) {
    const data = await espn(`/scoreboard?dates=${date}`)
    const found = (data.events || []).find(e => {
      const codes = e.competitions?.[0]?.competitors?.map(c => c.team.abbreviation) || []
      return codes.includes(match.homeTeam.tla) && codes.includes(match.awayTeam.tla)
    })
    if (found) return found
  }
  return undefined
}

function extractStat(statistics, name) {
  const found = statistics?.find(s => s.name === name)
  if (!found || found.displayValue === undefined || found.displayValue === null || found.displayValue === '') return null
  const num = parseFloat(found.displayValue)
  return Number.isNaN(num) ? null : num
}

function toTeamStats(statistics) {
  if (!statistics) return null
  const totalPasses = extractStat(statistics, 'totalPasses')
  const accuratePasses = extractStat(statistics, 'accuratePasses')
  return {
    possession: extractStat(statistics, 'possessionPct'),
    fouls: extractStat(statistics, 'foulsCommitted'),
    passes: totalPasses,
    passAccuracy: totalPasses ? Math.round((accuratePasses / totalPasses) * 100) : null,
    goalkeeperSaves: extractStat(statistics, 'saves'),
    yellowCards: extractStat(statistics, 'yellowCards'),
    redCards: extractStat(statistics, 'redCards'),
    corners: extractStat(statistics, 'wonCorners'),
  }
}

function cardType(typeText) {
  if (typeText === 'Red Card') return 'red'
  if (typeText === 'Yellow Card Second') return 'second-yellow'
  return 'yellow'
}

async function syncMatch(match, event) {
  const summary = await espn(`/summary?event=${event.id}`)
  const teams = summary.boxscore?.teams || []
  const homeBlock = teams.find(t => t.homeAway === 'home')
  const awayBlock = teams.find(t => t.homeAway === 'away')

  const tlaByTeamId = {}
  for (const t of teams) tlaByTeamId[t.team.id] = t.team.abbreviation

  const cards = (summary.keyEvents || [])
    .filter(e => e.type && (e.type.text === 'Yellow Card' || e.type.text === 'Red Card'))
    .map(e => ({
      playerId: e.participants?.[0]?.athlete?.id || null,
      playerName: e.participants?.[0]?.athlete?.displayName || e.shortText || 'Unknown',
      team: tlaByTeamId[e.team?.id] || null,
      type: cardType(e.type.text),
      minute: e.clock?.displayValue || null,
    }))

  return {
    homeTeam: { tla: match.homeTeam.tla, name: match.homeTeam.name },
    awayTeam: { tla: match.awayTeam.tla, name: match.awayTeam.name },
    stats: { home: toTeamStats(homeBlock?.statistics), away: toTeamStats(awayBlock?.statistics) },
    cards,
  }
}

async function main() {
  console.log('Fetching finished matches from football-data.org...')
  const { matches } = await footballData('/competitions/WC/matches?status=FINISHED')
  console.log(`Found ${matches.length} finished matches`)

  const store = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) : {}
  let synced = 0

  for (const match of matches) {
    if (store[match.id]) continue
    console.log(`Syncing match ${match.id}: ${match.homeTeam.tla} vs ${match.awayTeam.tla}`)
    try {
      const event = await findEvent(match)
      if (!event) {
        console.log('  no matching ESPN event found, skipping')
        continue
      }
      store[match.id] = await syncMatch(match, event)
      synced++
    } catch (err) {
      console.error(`  failed: ${err.message}`)
    }
    await new Promise(r => setTimeout(r, 300))
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2))
  console.log(`Synced ${synced} new matches. Saved to ${DATA_FILE}`)
}

main()
