import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { PageTransition } from '@/components/layout/PageTransition'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026',
  description: 'Таблица, результаты и статистика Чемпионата мира 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} h-full`}>
      <body className="font-sans antialiased min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-6 w-full">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
