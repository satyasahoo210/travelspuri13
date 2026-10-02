import { Hotel, Room } from '@/types'
import { apolloClient } from './graphql/client'
import {
  GET_PUBLIC_HOTELS,
  GET_PUBLIC_HOTEL_SLUGS,
  GET_PUBLIC_HOTEL_BY_SLUG,
  GET_PUBLIC_ROOMS,
  CREATE_PUBLIC_BOOKING,
} from './graphql/queries'

export interface CreateBookingPayload {
  hotelId: string
  roomTypeId: string
  guestName: string
  guestPhone: string
  guestEmail?: string
  checkInDate: string
  checkOutDate: string
  adults: number
  children?: number
  noOfRooms: number
  notes?: string
}

export interface BookingResponse {
  success: boolean
  bookingId?: string
  referenceNumber?: string
  status?: string
  totalAmount?: number
  message: string
}

export const fetcher = async (url: string) => {
  const startTime = Date.now()
  const isServer = typeof window === 'undefined'
  const prefix = `[REST ${isServer ? 'SSR' : 'Browser'}]`

  console.log(`${prefix} 🚀 Fetching: ${url}`)
  try {
    const res = await fetch(url)
    const elapsed = Date.now() - startTime
    if (!res.ok) {
      console.error(`${prefix} ❌ Fetch failed (${elapsed}ms) - Status: ${res.status} ${res.statusText}: ${url}`)
      throw new Error(`Failed to fetch data (${res.status} ${res.statusText})`)
    }
    const json = await res.json()
    console.log(`${prefix} ✅ Fetch succeeded (${elapsed}ms) - Status: ${res.status}: ${url}`, { data: json })
    return json
  } catch (error) {
    const elapsed = Date.now() - startTime
    console.error(`${prefix} 💥 Fetch error (${elapsed}ms): ${url}`, error)
    throw error
  }
}

export const api = {
  getHotels: async (): Promise<Hotel[]> => {
    try {
      console.log('[API] 🏨 Requesting getHotels...')
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_HOTELS,
      })
      const hotels = data?.getPublicHotels || []
      console.log(`[API] 🏨 getHotels resolved with ${hotels.length} hotels`)
      return hotels
    } catch (error) {
      console.error('[API] ❌ getHotels failed:', error)
      return []
    }
  },

  getHotelSlugs: async (): Promise<{ slug: string }[]> => {
    try {
      console.log('[API] 🏨 Requesting getHotelSlugs...')
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_HOTEL_SLUGS,
      })
      const slugs = data?.getPublicHotels || []
      console.log(`[API] 🏨 getHotelSlugs resolved with ${slugs.length} slugs`)
      return slugs
    } catch (error) {
      console.error('[API] ❌ getHotelSlugs failed:', error)
      return []
    }
  },

  getRooms: async (hotelId?: string): Promise<Room[]> => {
    try {
      if (!hotelId) {
        console.warn('[API] ⚠️ getRooms called without hotelId, returning empty array')
        return []
      }
      console.log(`[API] 🛏️ Requesting getRooms for hotelId: ${hotelId}...`)
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_ROOMS,
        variables: { hotelId },
      })
      const rooms = data?.getPublicRooms || []
      console.log(`[API] 🛏️ getRooms resolved with ${rooms.length} rooms for hotelId: ${hotelId}`)
      return rooms
    } catch (error) {
      console.error(`[API] ❌ getRooms failed for hotelId: ${hotelId}:`, error)
      return []
    }
  },

  getHotelBySlug: async (slug: string): Promise<Hotel | null> => {
    try {
      console.log(`[API] 🏨 Requesting getHotelBySlug for slug: "${slug}"...`)
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_HOTEL_BY_SLUG,
        variables: { slug },
      })
      const hotel = data?.getPublicHotelBySlug || null
      console.log(`[API] 🏨 getHotelBySlug resolved for slug: "${slug}":`, hotel ? hotel.name : 'Not Found')
      return hotel
    } catch (error) {
      console.error(`[API] ❌ getHotelBySlug failed for slug: "${slug}":`, error)
      return null
    }
  },

  createPublicBooking: async (payload: CreateBookingPayload): Promise<BookingResponse> => {
    try {
      console.log('[API] 📝 Submitting createPublicBooking:', payload)
      const { data } = await apolloClient.mutate<{ createPublicBooking: BookingResponse }>({
        mutation: CREATE_PUBLIC_BOOKING,
        variables: { input: payload },
      })
      const response = data?.createPublicBooking || {
        success: false,
        message: 'Failed to create booking inquiry',
      }
      console.log('[API] 📝 createPublicBooking result:', response)
      return response
    } catch (error: any) {
      console.error('[API] ❌ createPublicBooking failed:', error)
      return {
        success: false,
        message: error.message || 'Error communicating with PMS server',
      }
    }
  },
}

