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
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY

if (!FOOTBALL_DATA_KEY || !API_FOOTBALL_KEY) {
  console.error('Missing FOOTBALL_DATA_API_KEY or API_FOOTBALL_KEY in .env.local')
  process.exit(1)
}

// World Cup league id 1 in api-football.com's database; verify against
// GET /leagues?name=World Cup if matches stop resolving in a future edition.
const LEAGUE_ID = 1
const SEASON = 2026

async function footballData(pathname) {
  const res = await fetch(`https://api.football-data.org/v4${pathname}`, {
    headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
  })
  if (!res.ok) throw new Error(`football-data.org ${res.status}`)
  return res.json()
}

async function apiFootball(pathname) {
  const res = await fetch(`https://v3.football.api-sports.io${pathname}`, {
    headers: { 'x-apisports-key': API_FOOTBALL_KEY },
  })
  if (!res.ok) throw new Error(`api-football ${res.status}`)
  return res.json()
}

function normalizeName(n) {
  return n.toLowerCase().replace(/[^a-z]/g, '')
}

async function findFixture(match) {
  const date = match.utcDate.slice(0, 10)
  const data = await apiFootball(`/fixtures?date=${date}&league=${LEAGUE_ID}&season=${SEASON}`)
  const home = normalizeName(match.homeTeam.name)
  const away = normalizeName(match.awayTeam.name)
  return data.response.find(f => {
    const fh = normalizeName(f.teams.home.name)
    const fa = normalizeName(f.teams.away.name)
    return (fh.includes(home) || home.includes(fh)) && (fa.includes(away) || away.includes(fa))
  })
}

function extractStat(statistics, name) {
  const found = statistics?.find(s => s.type === name)
  if (!found || found.value === null || found.value === undefined) return null
  if (typeof found.value === 'string' && found.value.endsWith('%')) return parseInt(found.value, 10)
  return found.value
}

function toTeamStats(block) {
  if (!block) return null
  return {
    possession: extractStat(block.statistics, 'Ball Possession'),
    fouls: extractStat(block.statistics, 'Fouls'),
    passes: extractStat(block.statistics, 'Total passes'),
    passAccuracy: extractStat(block.statistics, 'Passes %'),
    goalkeeperSaves: extractStat(block.statistics, 'Goalkeeper Saves'),
    yellowCards: extractStat(block.statistics, 'Yellow Cards'),
    redCards: extractStat(block.statistics, 'Red Cards'),
    corners: extractStat(block.statistics, 'Corner Kicks'),
  }
}

async function syncMatch(match, fixture) {
  const fixtureId = fixture.fixture.id
  const statsRes = await apiFootball(`/fixtures/statistics?fixture=${fixtureId}`)
  const [homeBlock, awayBlock] = statsRes.response

  const eventsRes = await apiFootball(`/fixtures/events?fixture=${fixtureId}`)
  const homeName = fixture.teams.home.name
  const cards = eventsRes.response
    .filter(e => e.type === 'Card')
    .map(e => ({
      playerId: e.player.id,
      playerName: e.player.name,
      team: e.team.name === homeName ? match.homeTeam.tla : match.awayTeam.tla,
      type: e.detail === 'Red Card' ? 'red' : e.detail === 'Yellow Card' ? 'yellow' : 'second-yellow',
      minute: e.time.elapsed,
    }))

  return {
    homeTeam: { tla: match.homeTeam.tla, name: match.homeTeam.name },
    awayTeam: { tla: match.awayTeam.tla, name: match.awayTeam.name },
    stats: { home: toTeamStats(homeBlock), away: toTeamStats(awayBlock) },
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
      const fixture = await findFixture(match)
      if (!fixture) {
        console.log('  no matching api-football fixture found, skipping')
        continue
      }
      store[match.id] = await syncMatch(match, fixture)
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
