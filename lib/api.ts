import { transformImageUrl } from '@/lib/utils'
import { ApiResponse, Hotel, Room } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export const api = {
  getHotels: async (): Promise<Hotel[]> => {
    const res = await fetch(`${API_URL}?action=getHotels`)
    const json = await res.json()
    const hotels = (json.data || []).map((hotel: any) => ({
      ...hotel,
      image_urls: transformImageUrl(hotel.image_urls || hotel.cover_image),
      cover_image: transformImageUrl(hotel.cover_image)[0] || '',
      is_sponsored:
        hotel.is_sponsored === true || hotel.is_sponsored === 'TRUE',
      is_active: hotel.is_active === true || hotel.is_active === 'TRUE',
    }))

    // Sort: Sponsored first
    return hotels.sort(
      (a: Hotel, b: Hotel) =>
        (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0),
    )
  },

  getRooms: async (hotelId?: string): Promise<Room[]> => {
    const res = await fetch(`${API_URL}?action=getRooms`)
    const json = await res.json()
    let rooms = (json.data || []).map((room: any) => ({
      ...room,
      image_urls: transformImageUrl(room.image_urls),
      is_active: room.is_active === true || room.is_active === 'TRUE',
    }))

    if (hotelId) {
      rooms = rooms.filter((r: Room) => r.hotel_id === hotelId)
    }
    return rooms
  },

  getHotelBySlug: async (slug: string): Promise<Hotel | null> => {
    const hotels = await api.getHotels()
    return hotels.find((h) => h.slug === slug) || null
  },

  addItem: async (
    type: 'hotels' | 'rooms',
    item: any,
  ): Promise<ApiResponse<any>> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', type, ...item }),
    })
    return res.json()
  },

  updateItem: async (
    type: 'hotels' | 'rooms',
    item: any,
  ): Promise<ApiResponse<any>> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'update', type, ...item }),
    })
    return res.json()
  },

  deleteItem: async (
    type: 'hotels' | 'rooms',
    id: string,
  ): Promise<ApiResponse<any>> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', type, id }),
    })
    return res.json()
  },
}
