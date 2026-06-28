import type { NewsItem } from '@/types/news'

interface Props { item: NewsItem }

export function NewsCard({ item }: Props) {
  const date = new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-3 rounded-xl border border-light-border dark:border-dark-border hover:border-gold transition-colors glass"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-snug line-clamp-2">{item.title}</p>
        {item.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded font-medium">{item.source}</span>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
    </a>
  )
}
