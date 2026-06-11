import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026',
  description: 'Таблица, результаты и статистика Чемпионата мира 2026',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
    >
      <body className={`${inter.variable} font-sans antialiased min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
