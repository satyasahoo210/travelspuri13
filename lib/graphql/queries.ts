import { gql, TypedDocumentNode } from '@apollo/client';
import { Hotel, Room } from '@/types';

export const HOTEL_FIELDS_FRAGMENT = gql`
  fragment HotelFields on PublicHotel {
    id
    name
    slug
    location
    area
    lat
    lng
    rating
    rating_count
    starting_price
    amenities
    amenities_search
    cover_image
    image_urls
    is_sponsored
    is_active
    created_at
  }
`;

export const ROOM_FIELDS_FRAGMENT = gql`
  fragment RoomFields on PublicRoom {
    id
    hotel_id
    name
    description
    price
    capacity
    amenities
    amenities_search
    image_urls
    check_in
    check_out
    rules
    cancellation_policy
    is_active
  }
`;

export const GET_PUBLIC_HOTELS: TypedDocumentNode<
  { getPublicHotels: Hotel[] },
  Record<string, never>
> = gql`
  ${HOTEL_FIELDS_FRAGMENT}
  query GetPublicHotels {
    getPublicHotels {
      ...HotelFields
    }
  }
`;

export const GET_PUBLIC_HOTEL_BY_SLUG: TypedDocumentNode<
  { getPublicHotelBySlug: Hotel | null },
  { slug: string }
> = gql`
  ${HOTEL_FIELDS_FRAGMENT}
  query GetPublicHotelBySlug($slug: String!) {
    getPublicHotelBySlug(slug: $slug) {
      ...HotelFields
    }
  }
`;

export const GET_PUBLIC_ROOMS: TypedDocumentNode<
  { getPublicRooms: Room[] },
  { hotelId: string }
> = gql`
  ${ROOM_FIELDS_FRAGMENT}
  query GetPublicRooms($hotelId: String!) {
    getPublicRooms(hotelId: $hotelId) {
      ...RoomFields
    }
  }
`;
