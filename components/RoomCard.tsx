'use client'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Room } from '@/types'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { MapPin, MessageCircle } from 'lucide-react'
import ImageCarousel from './ImageCarousel'

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I want to book ${room.name}. Please assist.`,
  )}`

  return (
    <Card className="h-full flex flex-col minimal-card overflow-hidden group">
      <div className="relative h-64 w-full overflow-hidden">
        <ImageCarousel images={room.image_url} alt={room.name} />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-primary font-bold shadow-soft z-10 text-sm">
          ₹{room.price}{' '}
          <span className="text-gray-500 font-normal">/ night</span>
        </div>
      </div>

      <CardContent className="grow flex flex-col p-6">
        <Box className="flex items-center gap-1 text-accent mb-2">
          <MapPin size={14} />
          <Typography
            variant="caption"
            className="font-semibold uppercase tracking-wider"
          >
            Puri, Odisha
          </Typography>
        </Box>
        <Typography
          variant="h5"
          className="mb-3 font-bold leading-tight group-hover:text-accent transition-colors"
        >
          {room.name}
        </Typography>
        <Typography
          variant="body2"
          className="text-secondary mb-8 line-clamp-3"
        >
          {room.description}
        </Typography>
        <div className="mt-auto">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="rounded-full py-3 gap-2 shadow-soft hover:shadow-soft-md transition-all"
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <MessageCircle size={18} />
            <span className="font-bold">Book Now</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
