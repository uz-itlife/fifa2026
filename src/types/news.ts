export interface NewsItem {
  title: string
  date: string       // ISO string
  url: string
  source: 'uff.uz' | 'football-data'
  description?: string
}
