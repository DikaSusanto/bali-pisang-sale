//src/app/layout.tsx

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { getServerLanguage } from '@/lib/getServerLanguage'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bali Pisang Sale',
  description: 'The #1 Leading Pisang Sale Producer in Bali',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get language from server-side cookie
  const initialLanguage = await getServerLanguage();

  return (
    <html lang={initialLanguage}>
      <head>
        <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${poppins.className} text-gray-800 bg-white`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}