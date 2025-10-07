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
  verification: {
    google: '6r1jtFEtQcEQZbFCKAYbJ0citM9iKyHe72w_Nb5VQJs',
  },
  icons: {
    icon: '/img/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialLanguage = await getServerLanguage();

  return (
    <html lang={initialLanguage}>
      <body className={`${poppins.className} text-gray-800 bg-white`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}