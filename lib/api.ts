import { Hotel, Room } from '@/types'
import { apolloClient } from './graphql/client'
import { GET_PUBLIC_HOTELS, GET_PUBLIC_HOTEL_BY_SLUG, GET_PUBLIC_ROOMS, CREATE_PUBLIC_BOOKING } from './graphql/queries'

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
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export const api = {
  getHotels: async (): Promise<Hotel[]> => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_HOTELS,
      })
      return data?.getPublicHotels || []
    } catch (error) {
      console.error('getHotels failed:', error)
      return []
    }
  },

  getRooms: async (hotelId?: string): Promise<Room[]> => {
    try {
      if (!hotelId) return []
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_ROOMS,
        variables: { hotelId },
      })
      return data?.getPublicRooms || []
    } catch (error) {
      console.error('getRooms failed:', error)
      return []
    }
  },

  getHotelBySlug: async (slug: string): Promise<Hotel | null> => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PUBLIC_HOTEL_BY_SLUG,
        variables: { slug },
      })
      return data?.getPublicHotelBySlug || null
    } catch (error) {
      console.error('getHotelBySlug failed:', error)
      return null
    }
  },

  createPublicBooking: async (payload: CreateBookingPayload): Promise<BookingResponse> => {
    try {
      const { data } = await apolloClient.mutate<{ createPublicBooking: BookingResponse }>({
        mutation: CREATE_PUBLIC_BOOKING,
        variables: { input: payload },
      })
      return data?.createPublicBooking || {
        success: false,
        message: 'Failed to create booking inquiry',
      }
    } catch (error: any) {
      console.error('createPublicBooking failed:', error)
      return {
        success: false,
        message: error.message || 'Error communicating with PMS server',
      }
    }
  },

}

