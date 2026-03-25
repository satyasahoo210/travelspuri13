import { api } from '@/lib/api'
import HotelsListingClient from '@/components/HotelsListingClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Hotels in Puri | Travels Puri 13',
  description: 'Browse all available hotels in Puri. Filter by price, rating, and amenities to find your ideal accommodation.',
}

export default async function HotelsPage() {
  const hotels = await api.getHotels()
  
  return <HotelsListingClient initialHotels={hotels} />
}
