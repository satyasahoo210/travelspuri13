import { Hotel, Room } from '@/types'
import { apolloClient } from './graphql/client'
import { GET_PUBLIC_HOTELS, GET_PUBLIC_HOTEL_BY_SLUG, GET_PUBLIC_ROOMS } from './graphql/queries'

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
}
