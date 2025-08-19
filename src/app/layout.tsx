import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bali Pisang Sale',
  description: 'The #1 Leading Pisang Sale Producer in Bali',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${poppins.className} text-gray-800 bg-white`}>
        {children}
      </body>
    </html>
  )
}