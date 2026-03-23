import { ApiResponse, Package, Room } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export const api = {
  getRooms: async (): Promise<Room[]> => {
    const res = await fetch(`${API_URL}?action=getRooms`)
    const json = await res.json()
    return (json.data || []).map((room: Room) => ({
      ...room,
      image_url: api.transformImageUrl(room.image_url),
    }))
  },

  getPackages: async (): Promise<Package[]> => {
    const res = await fetch(`${API_URL}?action=getPackages`)
    const json = await res.json()
    return (json.data || []).map((pkg: Package) => ({
      ...pkg,
      image_url: api.transformImageUrl(pkg.image_url),
    }))
  },

  addItem: async (
    type: 'rooms' | 'packages',
    item: any,
  ): Promise<ApiResponse<any>> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', type, ...item }),
    })
    return res.json()
  },

  updateItem: async (
    type: 'rooms' | 'packages',
    item: any,
  ): Promise<ApiResponse<any>> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'update', type, ...item }),
    })
    return res.json()
  },

  deleteItem: async (
    type: 'rooms' | 'packages',
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
      const imageUrl = new URL(url)
      const FILE_ID = imageUrl.pathname.split('/')[3]
      // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      // https://drive.google.com/uc?export=view&id=FILE_ID
      return `https://drive.google.com/uc?export=view&id=${FILE_ID}`
    }

    if (Array.isArray(urls)) {
      return urls.map(transformUrlString)
    } else {
      const urlArray = urls.split(',')
      return urlArray.map(transformUrlString)
    }
  },
  deTransformImageUrl: (urls: string[] | undefined): string => {
    if (!urls?.length) return ''
    return urls
      .map((url: string) => {
        const imageUrl = new URL(url)
        const FILE_ID = imageUrl.searchParams.get('id') as string
        // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        // https://drive.google.com/uc?export=view&id=FILE_ID
        return `https://drive.google.com/file/d/${FILE_ID}/view?usp=sharing`
      })
      .join(',')
  },
}
