export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string; // e.g. "per night"
  image_url: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g. "3 Days / 2 Nights"
  image_url: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ItemType = 'room' | 'package';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
