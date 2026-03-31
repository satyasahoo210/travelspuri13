export interface Hotel {
  id: string
  name: string
  slug: string
  location: string
  area: string
  lat: number
  lng: number
  rating: number
  rating_count: number
  starting_price: number
  amenities: string // comma-separated
  amenities_search: string // space-separated
  cover_image: string
  image_urls: string[]
  is_sponsored: boolean
  is_active: boolean
  created_at: string
}

export interface Room {
  id: string
  hotel_id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string
  amenities_search: string
  image_urls: string[]
  check_in: string
  check_out: string
  rules: string
  cancellation_policy: string
  is_active: boolean
  no_of_rooms_available?: number
}

export type ItemType = 'hotel' | 'room'

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}
