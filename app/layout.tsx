import ClientThemeProvider from '@/components/ClientThemeProvider'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import WhatsAppButton from '@/components/WhatsAppButton'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

/**
🌟 Welcome to Hotels in  Puri Where Comfort Meets Luxury! 🌟
Contact us: [8249548564]
Experience world-class hospitality, elegant accommodations, and exceptional service at Hotels. Whether you're traveling for business or leisure, our stylish rooms, fine dining, and top-notch amenities ensure a memorable stay.

📍 Prime Location | 🏨 Luxurious Rooms | 🍽️ Exquisite Dining | 🎉 Event Spaces | 🏊‍♂️ Relaxing Ambiance

Book your 📞 Contact us: [8249548564]
 */

export const metadata: Metadata = {
  title: 'Travels Puri 13 | Affordable Stays & Travel Packages in Puri',
  description:
    "Experience world-class hospitality, elegant accommodations, and exceptional service at Hotels. Whether you're traveling for business or leisure, our stylish rooms, fine dining, and top-notch amenities ensure a memorable stay.",
  keywords: [
    'Puri',
    'Hotel Booking',
    'Travel Packages',
    'Travels Puri 13',
    'Odisha Tourism',
  ],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Travels Puri 13 | Affordable Stays & Travel Packages in Puri',
    description:
      'Experience world-class hospitality, elegant accommodations, and exceptional service at Hotels in Puri.',
    url: 'https://travelspuri13.com',
    siteName: 'Travels Puri 13',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Travels Puri 13 - Hotels and Travel Packages',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <ClientThemeProvider>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
          <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} />
        </ClientThemeProvider>
      </body>
    </html>
  )
}
