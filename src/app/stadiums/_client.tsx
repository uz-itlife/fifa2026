'use client'
import { useEffect, useRef } from 'react'

const STADIUMS = [
  { name: 'MetLife Stadium', city: 'East Rutherford, NJ', capacity: 82_500, lat: 40.8135, lng: -74.0745, matches: 8 },
  { name: 'AT&T Stadium', city: 'Arlington, TX', capacity: 80_000, lat: 32.7480, lng: -97.0929, matches: 6 },
  { name: 'SoFi Stadium', city: 'Inglewood, CA', capacity: 70_240, lat: 33.9535, lng: -118.3392, matches: 6 },
  { name: 'Estadio Azteca', city: 'Mexico City, MX', capacity: 87_523, lat: 19.3029, lng: -99.1505, matches: 5 },
  { name: 'BC Place', city: 'Vancouver, CA', capacity: 54_500, lat: 49.2768, lng: -123.1116, matches: 5 },
  { name: "Levi's Stadium", city: 'Santa Clara, CA', capacity: 68_500, lat: 37.4032, lng: -121.9698, matches: 4 },
  { name: 'Lincoln Financial Field', city: 'Philadelphia, PA', capacity: 69_796, lat: 39.9008, lng: -75.1675, matches: 5 },
  { name: 'Arrowhead Stadium', city: 'Kansas City, MO', capacity: 76_416, lat: 39.0489, lng: -94.4839, matches: 4 },
  { name: 'NRG Stadium', city: 'Houston, TX', capacity: 72_220, lat: 29.6847, lng: -95.4107, matches: 5 },
  { name: 'Lumen Field', city: 'Seattle, WA', capacity: 72_000, lat: 47.5952, lng: -122.3316, matches: 4 },
  { name: 'Gillette Stadium', city: 'Foxborough, MA', capacity: 65_878, lat: 42.0909, lng: -71.2643, matches: 5 },
  { name: 'Estadio BBVA', city: 'Monterrey, MX', capacity: 53_500, lat: 25.6694, lng: -100.2358, matches: 4 },
  { name: 'Estadio Akron', city: 'Guadalajara, MX', capacity: 49_850, lat: 20.6693, lng: -103.4504, matches: 4 },
  { name: 'BMO Field', city: 'Toronto, CA', capacity: 45_000, lat: 43.6333, lng: -79.4187, matches: 4 },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', capacity: 71_000, lat: 33.7554, lng: -84.4009, matches: 4 },
  { name: 'Hard Rock Stadium', city: 'Miami Gardens, FL', capacity: 65_326, lat: 25.9579, lng: -80.2389, matches: 5 },
]

export default function StadiumsClient() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return
    let map: ReturnType<typeof import('leaflet')['map']> | null = null
    import('leaflet').then(L => {
      if (!mapRef.current) return
      map = L.map(mapRef.current).setView([30, -90], 3)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)
      STADIUMS.forEach(s => {
        L.marker([s.lat, s.lng])
          .addTo(map!)
          .bindPopup(`<b>${s.name}</b><br>${s.city}<br>Вместимость: ${s.capacity.toLocaleString()}<br>Матчей: ${s.matches}`)
      })
    })
    return () => { map?.remove() }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Стадионы</h1>
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl overflow-hidden border border-light-border dark:border-dark-border mb-8"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STADIUMS.map(s => (
          <div key={s.name} className="bg-white dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border">
            <h3 className="font-bold text-sm mb-1">{s.name}</h3>
            <p className="text-xs text-gray-400 mb-2">📍 {s.city}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🏟️ {s.capacity.toLocaleString()}</span>
              <span>⚽ {s.matches} матчей</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
