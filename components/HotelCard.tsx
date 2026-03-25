'use client'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Hotel } from '@/types'
import { LocationOn, Phone, WhatsApp } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import AmenityChips from './AmenityChips'

import { MoreVert } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const router = useRouter()
  const whatsappNumber = WHATSAPP_NUMBER
  const callNumber = WHATSAPP_NUMBER // Assuming same for now

  const whatsappMsg = `Hi, I am interested in ${hotel.name}. Please share details.`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`

  const handleCardClick = () => {
    router.push(`/hotels/${hotel.slug}`)
  }

  return (
    <Card
      className="claymorphic"
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 220 }}>
        <Image
          src={hotel.cover_image || '/placeholder-hotel.jpg'}
          alt={hotel.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Action Menu Toggle (Mobile friendly replacement for details button) */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            bgcolor: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            p: 0.5,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            boxShadow: 2,
          }}
        >
          <MoreVert />
        </Box>

        {hotel.is_sponsored && (
          <Chip
            label="Featured"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontWeight: 700,
              borderRadius: '8px',
              textTransform: 'uppercase',
              fontSize: '0.65rem',
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Rating
            value={Number(hotel.rating)}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="caption" fontWeight={700}>
            {hotel.rating}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          <Typography
            variant="h6"
            component="h2"
            fontWeight={800}
            sx={{ lineHeight: 1.2 }}
          >
            {hotel.name}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 2,
            color: 'text.secondary',
          }}
        >
          <LocationOn sx={{ fontSize: 16 }} />
          <Typography variant="body2" fontWeight={500}>
            {hotel.area}, {hotel.location}
          </Typography>
        </Box>

        <AmenityChips amenities={hotel.amenities} />

        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              Starting from
            </Typography>
            <Typography variant="h6" color="primary" fontWeight={800}>
              ₹{hotel.starting_price}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<WhatsApp />}
            onClick={(e) => {
              e.stopPropagation()
              window.open(whatsappUrl, '_blank')
            }}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#25D366',
              color: '#25D366',
              '&:hover': {
                borderColor: '#128C7E',
                bgcolor: 'rgba(37, 211, 102, 0.04)',
              },
            }}
          >
            Enquiry
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Phone />}
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `tel:${callNumber}`
            }}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Call
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
