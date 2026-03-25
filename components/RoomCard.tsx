'use client'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Room } from '@/types'
import { People, Phone } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import AmenityChips from './AmenityChips'
import ImageCarousel from './ImageCarousel'

interface RoomCardProps {
  room: Room
  hotelName: string
  onSelect?: () => void
}

export default function RoomCard({ room, hotelName, onSelect }: RoomCardProps) {
  return (
    <Card
      className="claymorphic"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        bgcolor: '#fff',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: '40%' },
          height: { xs: 240, sm: 'auto' },
          overflow: 'hidden',
        }}
      >
        <ImageCarousel images={room.image_urls} alt={room.name} />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 4, width: { xs: '100%', sm: '60%' } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ color: 'primary.main' }}
          >
            {room.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              bgcolor: '#F8FAFC',
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <People fontSize="small" />
            <Typography variant="body2" fontWeight={800}>
              {room.capacity} Guests
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            lineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 500,
          }}
        >
          {room.description}
        </Typography>

        <AmenityChips amenities={room.amenities} max={6} />

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h4" color="primary" fontWeight={950}>
              ₹{room.price}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 700, ml: 0.5 }}
              >
                / night
              </Typography>
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={onSelect}
            sx={{
              borderRadius: '16px',
              textTransform: 'none',
              fontWeight: 900,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Select Room
          </Button>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={onSelect}
            sx={{
              borderRadius: '14px',
              textTransform: 'none',
              fontWeight: 900,
              py: 1.5,
              fontSize: '1rem',
              display: { xs: 'block', sm: 'none' },
            }}
          >
            Select to Book
          </Button>
          <Button
            variant="outlined"
            href={`tel:${WHATSAPP_NUMBER}`}
            sx={{
              borderRadius: '14px',
              minWidth: '56px',
              borderColor: '#E5E7EB',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            <Phone />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
