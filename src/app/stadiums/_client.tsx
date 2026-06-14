'use client'
import { useState } from 'react'

interface Stadium {
  name: string
  city: string
  country: string
  countryFlag: string
  capacity: number
  lat: number
  lng: number
  matches: number
  finals?: boolean
  photo: string
  description: string
}

const STADIUMS: Stadium[] = [
  {
    name: 'MetLife Stadium',
    city: 'Нью-Йорк / Нью-Джерси',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 82_500, lat: 40.8135, lng: -74.0745, matches: 8, finals: true,
    photo: '/stadiums/metlife.jpg',
    description: 'Крупнейший стадион ЧМ-2026. Примет финал турнира.',
  },
  {
    name: 'AT&T Stadium',
    city: 'Арлингтон, Техас',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 80_000, lat: 32.7480, lng: -97.0929, matches: 6,
    photo: '/stadiums/att.jpg',
    description: 'Домашняя арена Dallas Cowboys. Один из крупнейших крытых стадионов в мире.',
  },
  {
    name: 'SoFi Stadium',
    city: 'Инглвуд, Калифорния',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 70_240, lat: 33.9535, lng: -118.3392, matches: 6,
    photo: '/stadiums/sofi.jpg',
    description: 'Современная крытая арена в Лос-Анджелесе. Открыта в 2020 году.',
  },
  {
    name: 'Estadio Azteca',
    city: 'Мехико',
    country: 'Мексика', countryFlag: '🇲🇽',
    capacity: 87_523, lat: 19.3029, lng: -99.1505, matches: 5,
    photo: '/stadiums/azteca.jpg',
    description: 'Легендарный стадион с историей. Единственная арена, принявшая три ЧМ (1970, 1986, 2026).',
  },
  {
    name: 'BC Place',
    city: 'Ванкувер',
    country: 'Канада', countryFlag: '🇨🇦',
    capacity: 54_500, lat: 49.2768, lng: -123.1116, matches: 5,
    photo: '/stadiums/bcplace.jpg',
    description: 'Единственная крытая арена ЧМ-2026 с воздушной кровлей.',
  },
  {
    name: "Levi's Stadium",
    city: 'Санта-Клара, Калифорния',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 68_500, lat: 37.4032, lng: -121.9698, matches: 4,
    photo: '/stadiums/levis.jpg',
    description: 'Домашняя арена San Francisco 49ers. Расположена в Кремниевой долине.',
  },
  {
    name: 'Lincoln Financial Field',
    city: 'Филадельфия',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 69_796, lat: 39.9008, lng: -75.1675, matches: 5,
    photo: '/stadiums/lincoln.jpg',
    description: 'Домашняя арена Philadelphia Eagles. Открыта в 2003 году.',
  },
  {
    name: 'Arrowhead Stadium',
    city: 'Канзас-Сити',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 76_416, lat: 39.0489, lng: -94.4839, matches: 4,
    photo: '/stadiums/arrowhead.jpg',
    description: 'Домашняя арена Kansas City Chiefs. Известна громкими болельщиками.',
  },
  {
    name: 'NRG Stadium',
    city: 'Хьюстон, Техас',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 72_220, lat: 29.6847, lng: -95.4107, matches: 5,
    photo: '/stadiums/nrg.jpg',
    description: 'Первый стадион NFL с раздвижной кровлей. Открыт в 2002 году.',
  },
  {
    name: 'Lumen Field',
    city: 'Сиэтл',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 72_000, lat: 47.5952, lng: -122.3316, matches: 4,
    photo: '/stadiums/lumen.jpg',
    description: 'Домашняя арена Seattle Seahawks. Открыта в 2002 году.',
  },
  {
    name: 'Gillette Stadium',
    city: 'Фоксборо, Массачусетс',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 65_878, lat: 42.0909, lng: -71.2643, matches: 5,
    photo: '/stadiums/gillette.jpg',
    description: 'Домашняя арена New England Patriots. Открыта в 2002 году.',
  },
  {
    name: 'Estadio BBVA',
    city: 'Монтеррей',
    country: 'Мексика', countryFlag: '🇲🇽',
    capacity: 53_500, lat: 25.6694, lng: -100.2358, matches: 4,
    photo: '/stadiums/bbva.jpg',
    description: 'Современная арена с видом на горы Серро-де-ла-Силья.',
  },
  {
    name: 'Estadio Akron',
    city: 'Гвадалахара',
    country: 'Мексика', countryFlag: '🇲🇽',
    capacity: 49_850, lat: 20.6693, lng: -103.4504, matches: 4,
    photo: '/stadiums/akron.jpg',
    description: 'Домашняя арена ФК «Гвадалахара». Открыта в 2010 году.',
  },
  {
    name: 'BMO Field',
    city: 'Торонто',
    country: 'Канада', countryFlag: '🇨🇦',
    capacity: 45_000, lat: 43.6333, lng: -79.4187, matches: 4,
    photo: '/stadiums/bmo.jpg',
    description: 'Домашняя арена Toronto FC. Открыта в 2007 году.',
  },
  {
    name: 'Mercedes-Benz Stadium',
    city: 'Атланта',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 71_000, lat: 33.7554, lng: -84.4009, matches: 4,
    photo: '/stadiums/mercedesbenz.jpg',
    description: 'Инновационная арена с раздвижной кровлей. Открыта в 2017 году.',
  },
  {
    name: 'Hard Rock Stadium',
    city: 'Майами',
    country: 'США', countryFlag: '🇺🇸',
    capacity: 65_326, lat: 25.9579, lng: -80.2389, matches: 5,
    photo: '/stadiums/hardrock.jpg',
    description: 'Домашняя арена Miami Dolphins. Обновлена в 2016 году.',
  },
]

export default function StadiumsClient() {
  const [selected, setSelected] = useState<Stadium | null>(null)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  function handleImgError(name: string) {
    setImgErrors(prev => new Set(prev).add(name))
  }

  return (
    <div>
      {/* Stat bar */}
      <div className="flex gap-6 mb-6 text-sm">
        <div>
          <span className="font-bold text-gold text-2xl">16</span>
          <span className="text-gray-400 ml-1.5">стадионов</span>
        </div>
        <div>
          <span className="font-bold text-gold text-2xl">3</span>
          <span className="text-gray-400 ml-1.5">страны</span>
        </div>
        <div>
          <span className="font-bold text-gold text-2xl">104</span>
          <span className="text-gray-400 ml-1.5">матча</span>
        </div>
      </div>

      {/* Stadium grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STADIUMS.map(s => (
          <button
            key={s.name}
            onClick={() => setSelected(s)}
            className="text-left group rounded-2xl overflow-hidden border border-light-border dark:border-dark-border hover:border-gold transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,168,75,0.15)] bg-white dark:bg-dark-card"
          >
            {/* Photo */}
            <div className="relative h-48 overflow-hidden bg-gray-800">
              {!imgErrors.has(s.name) ? (
                <img
                  src={s.photo}
                  alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => handleImgError(s.name)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">🏟️</div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Country badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1">
                <span>{s.countryFlag}</span>
                <span className="text-white/90">{s.country}</span>
              </div>
              {/* Final badge */}
              {s.finals && (
                <div className="absolute top-3 left-3 bg-gold text-dark-bg rounded-lg px-2 py-1 text-xs font-black">
                  ФИНАЛ
                </div>
              )}
              {/* Stadium name on photo */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-base leading-tight">{s.name}</h3>
                <p className="text-white/70 text-xs mt-0.5">{s.city}</p>
              </div>
            </div>

            {/* Info row */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">👥</span>
                  {s.capacity.toLocaleString('ru-RU')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">⚽</span>
                  {s.matches} матчей
                </span>
              </div>
              <span className="text-gold text-xs font-medium group-hover:translate-x-0.5 transition-transform">
                Подробнее →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal photo */}
            <div className="relative h-64">
              {!imgErrors.has(selected.name) ? (
                <img
                  src={selected.photo}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                  onError={() => handleImgError(selected.name)}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">🏟️</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {selected.finals && (
                <div className="absolute top-4 left-4 bg-gold text-dark-bg px-3 py-1 rounded-lg text-sm font-black">
                  🏆 ФИНАЛ
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-white text-xl font-bold">{selected.name}</h2>
                <p className="text-white/70 text-sm">{selected.countryFlag} {selected.country}, {selected.city}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors text-sm"
              >✕</button>
            </div>

            {/* Modal info */}
            <div className="p-5">
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{selected.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-light-bg dark:bg-black/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">Вместимость</p>
                  <p className="font-bold text-sm">{selected.capacity.toLocaleString('ru-RU')}</p>
                </div>
                <div className="bg-light-bg dark:bg-black/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">Матчей ЧМ</p>
                  <p className="font-bold text-sm text-gold">{selected.matches}</p>
                </div>
                <div className="bg-light-bg dark:bg-black/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">Страна</p>
                  <p className="font-bold text-sm">{selected.countryFlag}</p>
                </div>
              </div>

              <a
                href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gold/40 hover:border-gold hover:bg-gold/5 text-gold text-sm font-medium transition-colors"
              >
                📍 Открыть на карте
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
