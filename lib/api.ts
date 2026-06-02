import { ApiResponse, Hotel, Room } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export const api = {
  getHotels: async (): Promise<Hotel[]> => {
    try {
      const res = await fetch(`${API_URL}/public/hotels`)
      if (!res.ok) throw new Error('Failed to fetch hotels')
      const data = await res.json()
      return data;
    } catch (error) {
      console.error('getHotels failed:', error)
      return []
    }
  },

  getRooms: async (hotelId?: string): Promise<Room[]> => {
    try {
      if (!hotelId) return []
      const res = await fetch(`${API_URL}/public/rooms?hotelId=${hotelId}`)
      if (!res.ok) throw new Error('Failed to fetch rooms')
      const data = await res.json()
      return data;
    } catch (error) {
      console.error('getRooms failed:', error)
      return []
    }
  },

  getHotelBySlug: async (slug: string): Promise<Hotel | null> => {
    try {
      const res = await fetch(`${API_URL}/public/hotels/${slug}`)
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch hotel details')
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('getHotelBySlug failed:', error)
      return null
    }
  },
}
