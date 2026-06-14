// TLA (3-letter football code) → ISO 3166-1 alpha-2 (for flag emoji)
const TLA_TO_ISO: Record<string, string> = {
  // Europe
  'GER': 'DE', 'NED': 'NL', 'SUI': 'CH', 'POR': 'PT', 'DEN': 'DK',
  'SWE': 'SE', 'NOR': 'NO', 'AUT': 'AT', 'GRE': 'GR', 'ROM': 'RO',
  'CRO': 'HR', 'SRB': 'RS', 'TUR': 'TR', 'BUL': 'BG', 'ALB': 'AL',
  'SVK': 'SK', 'SVN': 'SI', 'MKD': 'MK', 'MNE': 'ME', 'BIH': 'BA',
  'GEO': 'GE', 'ARM': 'AM', 'AZE': 'AZ', 'MDA': 'MD', 'BLR': 'BY',
  'ISL': 'IS', 'MLT': 'MT', 'LUX': 'LU', 'FRO': 'FO', 'ENG': 'GB',
  'SCO': 'GB', 'WAL': 'GB', 'NIR': 'GB', 'POL': 'PL', 'BEL': 'BE',
  'ESP': 'ES', 'FRA': 'FR', 'ITA': 'IT', 'UKR': 'UA',
  // Americas
  'ARG': 'AR', 'BRA': 'BR', 'URU': 'UY', 'CHI': 'CL', 'COL': 'CO',
  'PER': 'PE', 'ECU': 'EC', 'PAR': 'PY', 'BOL': 'BO', 'VEN': 'VE',
  'MEX': 'MX', 'USA': 'US', 'CAN': 'CA', 'PAN': 'PA', 'CRC': 'CR',
  'HON': 'HN', 'GTM': 'GT', 'SLV': 'SV', 'JAM': 'JM', 'TRI': 'TT',
  'HAI': 'HT', 'CUB': 'CU', 'GUY': 'GY', 'SUR': 'SR',
  // Asia
  'KOR': 'KR', 'JPN': 'JP', 'CHN': 'CN', 'AUS': 'AU', 'NZL': 'NZ',
  'UZB': 'UZ', 'JOR': 'JO', 'IRN': 'IR', 'IRQ': 'IQ', 'SYR': 'SY',
  'LIB': 'LB', 'KUW': 'KW', 'OMA': 'OM', 'UAE': 'AE', 'QAT': 'QA',
  'BHR': 'BH', 'SAU': 'SA', 'KSA': 'SA', 'YEM': 'YE', 'PSE': 'PS',
  'KAZ': 'KZ', 'TJK': 'TJ', 'KGZ': 'KG', 'TKM': 'TM', 'MGL': 'MN',
  'THA': 'TH', 'VNM': 'VN', 'VIE': 'VN', 'PHI': 'PH', 'IDN': 'ID',
  'INA': 'ID', 'MAS': 'MY', 'SIN': 'SG', 'TPE': 'TW', 'PRK': 'KP',
  // Africa
  'MAR': 'MA', 'ALG': 'DZ', 'TUN': 'TN', 'EGY': 'EG', 'NGA': 'NG',
  'SEN': 'SN', 'CMR': 'CM', 'CAM': 'CM', 'CIV': 'CI', 'GHA': 'GH',
  'MLI': 'ML', 'BFA': 'BF', 'GUI': 'GN', 'ZIM': 'ZW', 'KEN': 'KE',
  'ETH': 'ET', 'ANG': 'AO', 'MOZ': 'MZ', 'ZAM': 'ZM', 'RSA': 'ZA',
  'LBA': 'LY', 'MTN': 'MR', 'GNB': 'GW', 'GAB': 'GA', 'CGO': 'CG',
  'COD': 'CD', 'TAN': 'TZ', 'UGA': 'UG', 'RWA': 'RW',
}

export function tlaToFlag(tla: string): string {
  try {
    const upper = tla.toUpperCase()
    const iso = TLA_TO_ISO[upper] ?? (upper.length === 2 ? upper : upper.slice(0, 2))
    return iso.split('').map(c =>
      String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
    ).join('')
  } catch { return '🏳️' }
}
