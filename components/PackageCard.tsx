'use client'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Package } from '@/types'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { Clock, MapPin, MessageCircle } from 'lucide-react'
import ImageCarousel from './ImageCarousel'

interface PackageCardProps {
  packageItem: Package
}

export default function PackageCard({ packageItem }: PackageCardProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I am interested in the ${packageItem.name}. Please share details.`,
  )}`

  return (
    <Card className="h-full flex flex-col minimal-card overflow-hidden group">
      <div className="relative h-64 w-full overflow-hidden">
        <ImageCarousel images={packageItem.image_url} alt={packageItem.name} />
        <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-bold shadow-soft z-10 text-sm">
          ₹{packageItem.price}
        </div>
      </div>

      <CardContent className="grow flex flex-col p-6">
        <Box className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-accent">
            <Clock size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {packageItem.duration}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={12} />
            <span className="text-[10px] font-medium uppercase">
              Puri District
            </span>
          </div>
        </Box>
        <Typography
          variant="h5"
          className="mb-3 font-bold leading-tight group-hover:text-accent transition-colors"
        >
          {packageItem.name}
        </Typography>
        <Typography
          variant="body2"
          className="text-secondary mb-8 line-clamp-3"
        >
          {packageItem.description}
        </Typography>
        <div className="mt-auto">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            className="rounded-full py-3 gap-2 border-2 hover:bg-primary hover:text-white transition-all"
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <MessageCircle size={18} />
            <span className="font-bold">Enquire Now</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
