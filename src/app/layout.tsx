import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { PageTransition } from '@/components/layout/PageTransition'
import { BgSlideshow } from '@/components/layout/BgSlideshow'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })

const SITE_URL = 'https://fifa2026-ru.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'FIFA World Cup 2026 — Результаты, расписание, статистика',
    template: '%s | FIFA 2026',
  },
  description:
    'Следи за Чемпионатом мира по футболу 2026 в режиме реального времени: результаты матчей, таблица групп, плей-офф сетка, статистика игроков и команд. США, Канада, Мексика.',
  keywords: [
    'FIFA World Cup 2026', 'ЧМ 2026', 'Чемпионат мира 2026', 'FIFA 2026',
    'расписание матчей ЧМ 2026', 'результаты ЧМ 2026', 'таблица групп ЧМ 2026',
    'плей-офф ЧМ 2026', 'статистика ЧМ 2026', 'World Cup 2026 schedule',
    'World Cup 2026 results', 'ЧМ по футболу 2026', 'футбол 2026',
  ],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'FIFA 2026',
    title: 'FIFA World Cup 2026 — Результаты, расписание, статистика',
    description: 'Следи за ЧМ-2026 в режиме реального времени: матчи, группы, плей-офф, статистика.',
    images: [{ url: '/trophy.png', width: 800, height: 1200, alt: 'FIFA World Cup Trophy 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026',
    description: 'Результаты, расписание и статистика ЧМ-2026',
    images: ['/trophy.png'],
  },
  icons: { icon: '/trophy.png', apple: '/trophy.png' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} h-full`}>
      <body className="font-sans antialiased min-h-full flex flex-col">
        <ThemeProvider>
          <BgSlideshow />
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
