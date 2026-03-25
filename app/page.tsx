import { api } from '@/lib/api'
import HomeClient from '@/components/HomeClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travels Puri 13 | Premium Hotel Aggregator in Puri',
  description: 'Find and book the best hotels in Puri. Compare prices, amenities, and locations for a perfect stay near Jagannath Temple and the beach.',
  openGraph: {
    title: 'Travels Puri 13 - Best Hotels in Puri',
    description: 'Your gateway to premium stays in Puri, Odisha.',
    images: ['/og-image.jpg'], // Should exist or use a real URL
  }
}

export default async function Home() {
  const hotels = await api.getHotels()
  
  return <HomeClient initialHotels={hotels} />
}
