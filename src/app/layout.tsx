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
    // 1. DEFAULT Icon (for Google): The new brown .png
    icon: '/img/icon-light.png',

    // 2. APPLE/HIGH-RES Icon (Also for Google): The new brown .png
    apple: '/img/icon-light.png',

    // 3. THEMED Icons (for Browser Tabs):
    other: [
      // Light Mode: Use brown icon
      { 
        media: '(prefers-color-scheme: light)', 
        url: '/img/icon-light.png', 
      },
      // Dark Mode: Uses white icon
      { 
        media: '(prefers-color-scheme: dark)', 
        url: '/img/favicon.ico',
      }
    ]
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
        
        {/* SCRIPT TAG FOR SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Bali Pisang Sale",
            "url": "https://bali-pisang-sale.vercel.app/"
          }) }}
        />
        {/* END OF SCRIPT TAG */}

        <LanguageProvider initialLanguage={initialLanguage}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}