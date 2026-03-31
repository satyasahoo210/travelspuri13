import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transformImageUrl = (urls: string | string[]): string[] => {
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
        return FILE_ID
          ? `https://drive.google.com/uc?export=view&id=${FILE_ID}`
          : url
      }
      return url
    } catch {
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
}

export const deTransformImageUrl = (urls: string[] | undefined): string => {
  if (!urls?.length) return ''
  return urls
    .map((url: string) => {
      try {
        const imageUrl = new URL(url)
        const FILE_ID = imageUrl.searchParams.get('id') as string
        return FILE_ID
          ? `https://drive.google.com/file/d/${FILE_ID}/view?usp=sharing`
          : url
      } catch {
        return url
      }
    })
    .join('|') // Use pipe as requested in data rules
}
