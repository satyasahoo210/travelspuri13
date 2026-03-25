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
      image_urls: api.transformImageUrl(hotel.image_urls || hotel.cover_image),
      cover_image: api.transformImageUrl(hotel.cover_image)[0] || '',
      is_sponsored: hotel.is_sponsored === true || hotel.is_sponsored === 'TRUE',
      is_active: hotel.is_active === true || hotel.is_active === 'TRUE',
    }))
    
    // Sort: Sponsored first
    return hotels.sort((a: Hotel, b: Hotel) => (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0))
  },

  getRooms: async (hotelId?: string): Promise<Room[]> => {
    const res = await fetch(`${API_URL}?action=getRooms`)
    const json = await res.json()
    let rooms = (json.data || []).map((room: any) => ({
      ...room,
      image_urls: api.transformImageUrl(room.image_urls),
      is_active: room.is_active === true || room.is_active === 'TRUE',
    }))

    if (hotelId) {
      rooms = rooms.filter((r: Room) => r.hotel_id === hotelId)
    }
    return rooms
  },

  getHotelBySlug: async (slug: string): Promise<Hotel | null> => {
    const hotels = await api.getHotels()
    return hotels.find(h => h.slug === slug) || null
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

  transformImageUrl: (urls: string | string[]): string[] => {
    if (!urls) return []
    const transformUrlString = (url: string) => {
      if (!url || typeof url !== 'string') return ''
      try {
        if (url.includes('drive.google.com')) {
          const imageUrl = new URL(url)
          // Handle both /file/d/ID/view and uc?id=ID formats
          let FILE_ID = ''
          if (imageUrl.pathname.includes('/file/d/')) {
            FILE_ID = imageUrl.pathname.split('/')[3]
          } else if (imageUrl.searchParams.has('id')) {
            FILE_ID = imageUrl.searchParams.get('id') || ''
          }
          return FILE_ID ? `https://drive.google.com/uc?export=view&id=${FILE_ID}` : url
        }
        return url
      } catch (e) {
        return url
      }
    }

    if (Array.isArray(urls)) {
      return urls.map(transformUrlString).filter(Boolean)
    } else {
      // Support both comma and pipe separation
      const urlArray = urls.split(/[|,]/)
      return urlArray.map(transformUrlString).filter(Boolean)
    }
  },

  deTransformImageUrl: (urls: string[] | undefined): string => {
    if (!urls?.length) return ''
    return urls
      .map((url: string) => {
        try {
          const imageUrl = new URL(url)
          const FILE_ID = imageUrl.searchParams.get('id') as string
          return FILE_ID ? `https://drive.google.com/file/d/${FILE_ID}/view?usp=sharing` : url
        } catch (e) {
          return url
        }
      })
      .join('|') // Use pipe as requested in data rules
  },
}
