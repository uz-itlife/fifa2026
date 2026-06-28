const MAP: Record<string, string> = {
  // Европа
  'GER': 'Германия',
  'ENG': 'Англия',
  'ESP': 'Испания',
  'FRA': 'Франция',
  'POR': 'Португалия',
  'NED': 'Нидерланды',
  'BEL': 'Бельгия',
  'CRO': 'Хорватия',
  'ITA': 'Италия',
  'DEN': 'Дания',
  'SUI': 'Швейцария',
  'AUT': 'Австрия',
  'TUR': 'Турция',
  'POL': 'Польша',
  'SRB': 'Сербия',
  'HUN': 'Венгрия',
  'SVK': 'Словакия',
  'SCO': 'Шотландия',
  'UKR': 'Украина',
  'WAL': 'Уэльс',
  'NOR': 'Норвегия',
  'SVN': 'Словения',
  'ROU': 'Румыния',
  'CZE': 'Чехия',
  'GRE': 'Греция',
  'ALB': 'Албания',
  'MKD': 'Сев. Македония',
  'BIH': 'Босния',
  'MNE': 'Черногория',
  'IRL': 'Ирландия',
  'ISL': 'Исландия',
  'FIN': 'Финляндия',
  'LUX': 'Люксембург',
  'ISR': 'Израиль',
  'SWE': 'Швеция',
  'RUS': 'Россия',
  // Южная Америка
  'BRA': 'Бразилия',
  'ARG': 'Аргентина',
  'COL': 'Колумбия',
  'URU': 'Уругвай',
  'ECU': 'Эквадор',
  'CHI': 'Чили',
  'PAR': 'Парагвай',
  'VEN': 'Венесуэла',
  'BOL': 'Боливия',
  'PER': 'Перу',
  // Северная/Центральная Америка
  'USA': 'США',
  'MEX': 'Мексика',
  'CAN': 'Канада',
  'PAN': 'Панама',
  'CRC': 'Коста-Рика',
  'JAM': 'Ямайка',
  'HON': 'Гондурас',
  'GUA': 'Гватемала',
  'SLV': 'Сальвадор',
  'HAI': 'Гаити',
  'TRI': 'Тринидад и Тобаго',
  'CUW': 'Кюрасао',
  // Африка
  'MAR': 'Марокко',
  'SEN': 'Сенегал',
  'EGY': 'Египет',
  'CMR': 'Камерун',
  'TUN': 'Тунис',
  'ALG': 'Алжир',
  'NGA': 'Нигерия',
  'GHA': 'Гана',
  'CIV': 'Кот-д\'Ивуар',
  'COD': 'ДР Конго',
  'MLI': 'Мали',
  'RSA': 'ЮАР',
  'BFA': 'Буркина-Фасо',
  'ZIM': 'Зимбабве',
  'ETH': 'Эфиопия',
  'MOZ': 'Мозамбик',
  'CPV': 'Кабо-Верде',
  // Азия
  'JPN': 'Япония',
  'KOR': 'Южная Корея',
  'IRN': 'Иран',
  'AUS': 'Австралия',
  'UZB': 'Узбекистан',
  'KSA': 'Саудовская Аравия',
  'JOR': 'Иордания',
  'IRQ': 'Ирак',
  'QAT': 'Катар',
  'UAE': 'ОАЭ',
  'CHN': 'Китай',
  'OMA': 'Оман',
  'THA': 'Таиланд',
  'IND': 'Индия',
  // Океания
  'NZL': 'Новая Зеландия',
  'NCL': 'Нов. Каледония',
}

export function teamRu(tla: string, fallback: string): string {
  return MAP[tla?.toUpperCase()] ?? fallback
}

const STAGE_MAP: Record<string, string> = {
  'GROUP_STAGE': 'Групповой этап',
  'ROUND_OF_16': '1/8 финала',
  'QUARTER_FINALS': 'Четвертьфинал',
  'SEMI_FINALS': 'Полуфинал',
  'THIRD_PLACE': 'Матч за 3-е место',
  'FINAL': 'Финал',
}

export function stageRu(stage: string | null | undefined): string {
  if (!stage) return ''
  return STAGE_MAP[stage] ?? stage.replace(/_/g, ' ')
}

const COUNTRY_MAP: Record<string, string> = {
  'USA': 'США',
  'Mexico': 'Мексика',
  'Canada': 'Канада',
}

const CITY_MAP: Record<string, string> = {
  'Mexico City': 'Мехико',
  'Guadalajara': 'Гвадалахара',
  'Guadalupe': 'Гваделупе',
  'Toronto': 'Торонто',
  'Vancouver': 'Ванкувер',
  'Arlington, Texas': 'Арлингтон, Техас',
  'Atlanta, Georgia': 'Атланта, Джорджия',
  'East Rutherford, New Jersey': 'Ист-Резерфорд, Нью-Джерси',
  'Foxborough, Massachusetts': 'Фоксборо, Массачусетс',
  'Houston, Texas': 'Хьюстон, Техас',
  'Inglewood, California': 'Инглвуд, Калифорния',
  'Kansas City, Missouri': 'Канзас-Сити, Миссури',
  'Philadelphia, Pennsylvania': 'Филадельфия, Пенсильвания',
  'Santa Clara, California': 'Санта-Клара, Калифорния',
  'Seattle, Washington': 'Сиэтл, Вашингтон',
}

export function cityRu(city: string | null | undefined): string | null {
  if (!city) return null
  return CITY_MAP[city] ?? city
}

export function countryRu(country: string | null | undefined): string | null {
  if (!country) return null
  return COUNTRY_MAP[country] ?? country
}
