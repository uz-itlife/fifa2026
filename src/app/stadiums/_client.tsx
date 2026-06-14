'use client'
import { useEffect, useRef, useState } from 'react'

interface Stadium {
  name: string
  city: string
  country: string
  countryFlag: string
  capacity: number
  lat: number
  lng: number
  matches: number
  photo: string
}

const STADIUMS: Stadium[] = [
  { name: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'США', countryFlag: '🇺🇸', capacity: 82_500, lat: 40.8135, lng: -74.0745, matches: 8, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/MetLife_Stadium_Giants_Jets.jpg/1280px-MetLife_Stadium_Giants_Jets.jpg' },
  { name: 'AT&T Stadium', city: 'Arlington, TX', country: 'США', countryFlag: '🇺🇸', capacity: 80_000, lat: 32.7480, lng: -97.0929, matches: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/AT%26T_Stadium_2010.jpg/1280px-AT%26T_Stadium_2010.jpg' },
  { name: 'SoFi Stadium', city: 'Inglewood, CA', country: 'США', countryFlag: '🇺🇸', capacity: 70_240, lat: 33.9535, lng: -118.3392, matches: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/SoFi_Stadium_Aerial.jpg/1280px-SoFi_Stadium_Aerial.jpg' },
  { name: 'Estadio Azteca', city: 'Mexico City', country: 'Мексика', countryFlag: '🇲🇽', capacity: 87_523, lat: 19.3029, lng: -99.1505, matches: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Aztecaestadio.jpg/1280px-Aztecaestadio.jpg' },
  { name: 'BC Place', city: 'Vancouver', country: 'Канада', countryFlag: '🇨🇦', capacity: 54_500, lat: 49.2768, lng: -123.1116, matches: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/BC_Place_Stadium.jpg/1280px-BC_Place_Stadium.jpg' },
  { name: "Levi's Stadium", city: 'Santa Clara, CA', country: 'США', countryFlag: '🇺🇸', capacity: 68_500, lat: 37.4032, lng: -121.9698, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Levi%27s_Stadium.jpg/1280px-Levi%27s_Stadium.jpg' },
  { name: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'США', countryFlag: '🇺🇸', capacity: 69_796, lat: 39.9008, lng: -75.1675, matches: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Lincoln_Financial_Field_2018.jpg/1280px-Lincoln_Financial_Field_2018.jpg' },
  { name: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'США', countryFlag: '🇺🇸', capacity: 76_416, lat: 39.0489, lng: -94.4839, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arrowhead_stadium.jpg/1280px-Arrowhead_stadium.jpg' },
  { name: 'NRG Stadium', city: 'Houston, TX', country: 'США', countryFlag: '🇺🇸', capacity: 72_220, lat: 29.6847, lng: -95.4107, matches: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/NRG_Stadium_Houston_Texans.jpg/1280px-NRG_Stadium_Houston_Texans.jpg' },
  { name: 'Lumen Field', city: 'Seattle, WA', country: 'США', countryFlag: '🇺🇸', capacity: 72_000, lat: 47.5952, lng: -122.3316, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lumen_Field_2021.jpg/1280px-Lumen_Field_2021.jpg' },
  { name: 'Gillette Stadium', city: 'Foxborough, MA', country: 'США', countryFlag: '🇺🇸', capacity: 65_878, lat: 42.0909, lng: -71.2643, matches: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gillette_stadium.jpg/1280px-Gillette_stadium.jpg' },
  { name: 'Estadio BBVA', city: 'Monterrey', country: 'Мексика', countryFlag: '🇲🇽', capacity: 53_500, lat: 25.6694, lng: -100.2358, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Estadio_BBVA.jpg/1280px-Estadio_BBVA.jpg' },
  { name: 'Estadio Akron', city: 'Guadalajara', country: 'Мексика', countryFlag: '🇲🇽', capacity: 49_850, lat: 20.6693, lng: -103.4504, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Estadio_Chivas.jpg/1280px-Estadio_Chivas.jpg' },
  { name: 'BMO Field', city: 'Toronto', country: 'Канада', countryFlag: '🇨🇦', capacity: 45_000, lat: 43.6333, lng: -79.4187, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/BMO_Field_2018.jpg/1280px-BMO_Field_2018.jpg' },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'США', countryFlag: '🇺🇸', capacity: 71_000, lat: 33.7554, lng: -84.4009, matches: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Mercedes-Benz_Stadium.jpg/1280px-Mercedes-Benz_Stadium.jpg' },
  { name: 'Hard Rock Stadium', city: 'Miami Gardens, FL', country: 'США', countryFlag: '🇺🇸', capacity: 65_326, lat: 25.9579, lng: -80.2389, matches: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hard_Rock_Stadium_2016.jpg/1280px-Hard_Rock_Stadium_2016.jpg' },
]

export default function StadiumsClient() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Stadium | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    let map: ReturnType<typeof import('leaflet')['map']> | null = null
    import('leaflet').then(L => {
      if (!mapRef.current) return
      map = L.map(mapRef.current).setView([38, -95], 3)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)
      STADIUMS.forEach(s => {
        L.marker([s.lat, s.lng])
          .addTo(map!)
          .bindPopup(`<b>${s.name}</b><br>${s.countryFlag} ${s.country}, ${s.city}<br>Вместимость: ${s.capacity.toLocaleString()}<br>Матчей: ${s.matches}`)
      })
    })
    return () => { map?.remove() }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Стадионы ЧМ 2026</h1>
      <div ref={mapRef} className="w-full h-[400px] rounded-xl overflow-hidden border border-light-border dark:border-dark-border mb-8" />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={selected.photo} alt={selected.name} className="w-full h-56 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div className="p-5">
              <h2 className="text-xl font-bold mb-1">{selected.name}</h2>
              <p className="text-sm text-gray-400 mb-3">{selected.countryFlag} {selected.country}, {selected.city}</p>
              <div className="flex gap-6 text-sm mb-4">
                <div><p className="text-xs text-gray-500">Вместимость</p><p className="font-bold">{selected.capacity.toLocaleString()}</p></div>
                <div><p className="text-xs text-gray-500">Матчей ЧМ</p><p className="font-bold text-gold">{selected.matches}</p></div>
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold border border-gold/40 hover:border-gold rounded-lg px-4 py-2 transition-colors"
              >
                📍 Открыть на карте →
              </a>
            </div>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">✕</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STADIUMS.map(s => (
          <button
            key={s.name}
            onClick={() => setSelected(s)}
            className="text-left bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-light-border dark:border-dark-border hover:border-gold transition-colors hover:scale-[1.01] group"
          >
            <div className="h-32 overflow-hidden bg-gray-200 dark:bg-gray-800">
              <img
                src={s.photo}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm mb-0.5 truncate">{s.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{s.countryFlag} {s.country}, {s.city}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🏟️ {s.capacity.toLocaleString()}</span>
                <span>⚽ {s.matches} матчей</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
