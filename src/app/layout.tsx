import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: 'AIPathway - Personalized AI Learning',
  description: 'Generate your personalized AI learning curriculum in minutes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} ${playfair.variable}`}>{children}</body>
    </html>
  )
}

