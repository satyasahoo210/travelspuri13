import HotelDetailClient from '@/components/HotelDetailClient'
import { api } from '@/lib/api'
import { Hotel, Room } from '@/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const hotel = await api.getHotelBySlug(slug)
  
  if (!hotel) return { title: 'Hotel Not Found | Travels Puri 13' }
  
  return {
    title: `${hotel.name} in Puri | Best Price & Booking`,
    description: `Book your stay at ${hotel.name} in ${hotel.area}, Puri. Features: ${hotel.amenities}. Starting from ₹${hotel.starting_price}. Best rates guaranteed.`,
    openGraph: {
      title: hotel.name,
      description: `Stay at ${hotel.name} in Puri. Book now for the best deals.`,
      images: [hotel.cover_image],
    },
  }
}

export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Data fetching (Server Side)
  const hotel = await api.getHotelBySlug(slug)
  if (!hotel) {
    notFound()
  }

  const [rooms, allHotels] = await Promise.all([
    api.getRooms(hotel.id),
    api.getHotels()
  ])

  const relatedHotels = allHotels
    .filter((h: Hotel) => h.id !== hotel.id && (h.area === hotel.area || Math.abs(h.starting_price - hotel.starting_price) < 1000))
    .slice(0, 3)

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    'name': hotel.name,
    'description': `Luxury stay at ${hotel.name} in ${hotel.area}, Puri.`,
    'image': hotel.cover_image,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Puri',
      'addressRegion': 'Odisha',
      'addressCountry': 'IN',
      'streetAddress': hotel.area
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': hotel.rating,
      'reviewCount': hotel.rating_count
    },
    'priceRange': `₹${hotel.starting_price}+`
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HotelDetailClient hotel={hotel} rooms={rooms} relatedHotels={relatedHotels} />
    </>
  )
}
