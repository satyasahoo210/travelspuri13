'use client'

import AmenityChips from '@/components/AmenityChips'
import HotelCard from '@/components/HotelCard'
import RoomCard from '@/components/RoomCard'
import { api } from '@/lib/api'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Hotel, Room } from '@/types'
import {
  ChevronLeft,
  ChevronRight,
  LocationOn,
  Phone,
  Policy,
  WhatsApp,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Bed, Calendar, Info, Minus, Plus, Users } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface HotelDetailClientProps {
  hotel: Hotel
  rooms: Room[]
  relatedHotels: Hotel[]
}

export default function HotelDetailClient({
  hotel,
  rooms,
  relatedHotels,
}: HotelDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // Booking State
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [noOfRooms, setNoOfRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '')
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setAdults(
      Math.min(
        (rooms.find((r) => r.id === selectedRoomId)?.capacity || 3) * noOfRooms,
        adults,
      ),
    )
    setChildren(Math.min(3 * noOfRooms, children))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noOfRooms])

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0]

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!checkIn) newErrors.checkIn = 'Check-in date is required'
    if (!checkOut) newErrors.checkOut = 'Check-out date is required'
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      newErrors.checkOut = 'Check-out must be after check-in'
    }
    if (adults < 1) newErrors.adults = 'At least 1 adult is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const totalPrice = getNights() * (selectedRoom?.price || 0)

  const handleProceed = () => {
    if (validate()) {
      setIsBreakdownOpen(true)
    }
  }

  const whatsappMessage = `Hi, I want to inquire about booking:

Hotel: ${hotel!.name}
Room: ${selectedRoom?.name}
Check-in: ${checkIn}
Check-out: ${checkOut}
Nights: ${getNights()}
Guests: ${adults} Adults, ${children} Children

Approx Price: ₹${totalPrice}

Please confirm availability.`

  const bookingWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
    const element = document.getElementById('booking-widget')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleNext = () =>
    setActiveImage((prev) => (prev + 1) % hotel!.image_urls.length)
  const handlePrev = () =>
    setActiveImage(
      (prev) =>
        (prev - 1 + hotel!.image_urls.length) % hotel!.image_urls.length,
    )

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (diff > 50) handleNext()
    if (diff < -50) handlePrev()
    setTouchStart(null)
  }

  if (!hotel) return null

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            fontWeight={950}
            sx={{ mb: 2, tracking: 'tight', color: 'primary.main' }}
          >
            {hotel.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              icon={<LocationOn />}
              label={`${hotel.area}, Puri`}
              sx={{
                borderRadius: '12px',
                bgcolor: 'primary.50',
                color: 'primary.main',
                fontWeight: 700,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating
                value={Number(hotel.rating)}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" fontWeight={700}>
                ({hotel.rating_count} Reviews)
              </Typography>
            </Box>
            {hotel.is_sponsored && (
              <Chip
                label="Top Choice"
                size="small"
                color="secondary"
                sx={{ fontWeight: 800, px: 1 }}
              />
            )}
          </Box>
        </Box>

        {/* Gallery Section */}
        <Box
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          sx={{
            mb: 6,
            position: 'relative',
            height: { xs: 350, md: 600 },
            width: '100%',
            borderRadius: { xs: '24px', md: '40px' },
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            bgcolor: '#000',
          }}
        >
          <Image
            fill
            src={hotel.image_urls[activeImage]}
            alt={hotel.name}
            draggable={false}
            className="object-cover transition-all duration-700 ease-in-out select-none pointer-events-none"
            priority
          />

          {hotel.image_urls.length > 1 && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1.5,
                  zIndex: 10,
                }}
              >
                {hotel.image_urls.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    sx={{
                      width: activeImage === idx ? 24 : 8,
                      height: 8,
                      bgcolor: 'white',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      opacity: activeImage === idx ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: 'primary.main',
                  width: 48,
                  height: 48,
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: '#fff',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: 'primary.main',
                  width: 48,
                  height: 48,
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: '#fff',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}
        </Box>

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Amenities & Description */}
            <Paper
              className="claymorphic"
              sx={{ p: { xs: 3, md: 5 }, borderRadius: '32px', mb: 6 }}
            >
              <Typography variant="h4" fontWeight={900} gutterBottom>
                About {hotel.name}
              </Typography>
              <Typography
                variant="body1"
                className="text-secondary/80 leading-relaxed mb-6"
                sx={{ fontSize: '1.1rem' }}
              >
                Discover comfort and tranquility at {hotel.name}. Located in the
                heart of {hotel.area}, our property offers the perfect blend of
                local hospitality and modern conveniences.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
                Amenities
              </Typography>
              <AmenityChips amenities={hotel.amenities} max={20} />
            </Paper>

            {/* Booking Widget */}
            <Paper
              id="booking-widget"
              className="claymorphic"
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '32px',
                mb: 6,
                border: '1px solid #E5E7EB',
                bgcolor: '#fff',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'primary.50',
                    borderRadius: '14px',
                    color: 'primary.main',
                  }}
                >
                  <Calendar size={24} />
                </Box>
                <Typography variant="h4" fontWeight={900}>
                  Book Your Stay
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Check-in Date"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    error={!!errors.checkIn}
                    helperText={errors.checkIn}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Check-out Date"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    error={!!errors.checkOut}
                    helperText={errors.checkOut}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '16px' },
                    }}
                  >
                    <InputLabel>Select Room</InputLabel>
                    <Select
                      value={selectedRoomId}
                      label="Select Room"
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name} - ₹{room.price}/night
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      No. of Rooms
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#F8FAFC',
                        borderRadius: '16px',
                        p: 0.5,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setNoOfRooms(Math.max(1, noOfRooms - 1))}
                        disabled={noOfRooms <= 1}
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <Minus size={18} />
                      </IconButton>
                      <Typography fontWeight={900} variant="h6">
                        {noOfRooms}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setNoOfRooms(
                            Math.min(
                              selectedRoom.no_of_rooms_available || 1,
                              noOfRooms + 1,
                            ),
                          )
                        }
                        disabled={
                          noOfRooms >= (selectedRoom.no_of_rooms_available || 1)
                        }
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <Plus size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      Adults
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#F8FAFC',
                        borderRadius: '16px',
                        p: 0.5,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <Minus size={18} />
                      </IconButton>
                      <Typography fontWeight={900} variant="h6">
                        {adults}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setAdults(
                            Math.min(
                              (selectedRoom?.capacity || 3) * noOfRooms,
                              adults + 1,
                            ),
                          )
                        }
                        disabled={
                          adults >= (selectedRoom?.capacity || 3) * noOfRooms
                        }
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <Plus size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      Children
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#F8FAFC',
                        borderRadius: '16px',
                        p: 0.5,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        disabled={children <= 0}
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <Minus size={18} />
                      </IconButton>
                      <Typography fontWeight={900} variant="h6">
                        {children}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setChildren(Math.min(3 * noOfRooms, children + 1))
                        }
                        disabled={children >= 3 * noOfRooms}
                        sx={{
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <Plus size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleProceed}
                    sx={{
                      borderRadius: '16px',
                      py: 2,
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    }}
                  >
                    Check Approx Price & Book
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Rooms List */}
            <Typography
              variant="h3"
              fontWeight={950}
              sx={{ mb: 4, tracking: 'tight' }}
            >
              Available Rooms
            </Typography>
            {rooms.length === 0 ? (
              <Paper sx={{ p: 5, borderRadius: '32px', textAlign: 'center' }}>
                <Typography variant="h6">
                  No rooms listed for this hotel at the moment.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={4}>
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    hotelName={hotel.name}
                    onSelect={() => handleRoomSelect(room.id)}
                  />
                ))}
              </Stack>
            )}

            {/* Policies Section */}
            <Paper
              className="claymorphic"
              sx={{ p: { xs: 3, md: 5 }, borderRadius: '32px', mt: 8 }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}
              >
                <Policy color="primary" fontSize="large" />
                <Typography variant="h4" fontWeight={900}>
                  Booking Policies
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    gutterBottom
                    sx={{ color: '#111111' }}
                  >
                    Check-In / Out
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        color: '#0369A1',
                        borderRadius: '16px',
                        flex: 1,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#0284C7',
                          fontWeight: 800,
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        Check-in
                      </Typography>
                      <Typography variant="h6" fontWeight={900}>
                        10:00 AM
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        color: '#374151',
                        borderRadius: '16px',
                        flex: 1,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6B7280',
                          fontWeight: 800,
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        Check-out
                      </Typography>
                      <Typography variant="h6" fontWeight={900}>
                        08:00 AM
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Cancellation Policy
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #E5E7EB',
                      boxShadow: 'none',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight={600}
                    >
                      Cancel up to 48 hours before check-in for a full refund.
                      Late cancellations may incur a one-night charge.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 3 }} />
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    gutterBottom
                    sx={{ color: '#111111' }}
                  >
                    Rules & Guidelines
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#F9FAFB',
                      p: 3,
                      borderRadius: '24px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Box
                      component="ul"
                      sx={{
                        listStyleType: 'disc',
                        pl: 3,
                        color: 'text.primary',
                        '& li': {
                          mb: 1.5,
                          fontWeight: 500,
                          fontSize: '0.95rem',
                        },
                      }}
                    >
                      <li>
                        A valid Government ID (Aadhar Card, Voter ID, or
                        Passport) is mandatory for all guests at check-in.
                      </li>
                      <li>
                        Outside food is allowed only in specified common areas.
                      </li>
                      <li>
                        Smoking and alcohol consumption are strictly prohibited
                        inside the rooms.
                      </li>
                      <li>
                        Quiet hours are observed from 10:00 PM to 7:00 AM to
                        ensure comfort for all guests.
                      </li>
                      <li>
                        Visitors are restricted to the lobby area and are not
                        allowed in guest rooms after 8:00 PM.
                      </li>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar CTAs */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
              <Paper
                className="claymorphic"
                sx={{
                  p: 4,
                  borderRadius: '32px',
                  bgcolor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  color: 'text.primary',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Starting at
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={950}
                  sx={{ mb: 4, color: 'primary.main' }}
                >
                  ₹{hotel.starting_price}
                </Typography>

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<WhatsApp />}
                    onClick={handleProceed}
                    sx={{
                      bgcolor: '#25D366',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#1fad53',
                        transform: 'scale(1.02)',
                      },
                      borderRadius: '16px',
                      py: 2.5,
                      fontWeight: 900,
                      textTransform: 'none',
                      fontSize: '1.2rem',
                      boxShadow: '0 10px 20px rgba(37, 211, 102, 0.3)',
                    }}
                  >
                    Book via WhatsApp
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Phone />}
                    href={`tel:${WHATSAPP_NUMBER}`}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.50',
                        borderWidth: '2px',
                      },
                      borderRadius: '16px',
                      py: 2,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Call for Enquiry
                  </Button>
                </Stack>
              </Paper>

              {/* Related Hotels */}
              {relatedHotels.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" fontWeight={900} sx={{ mb: 3 }}>
                    Similar Options
                  </Typography>
                  <Stack spacing={3}>
                    {relatedHotels.map((h) => (
                      <HotelCard key={h.id} hotel={h} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
        {/* Price Breakdown Dialog */}
        <Dialog
          open={isBreakdownOpen}
          onClose={() => setIsBreakdownOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '32px',
              p: 2,
              maxWidth: '500px',
              width: '100%',
              m: 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', pb: 1 }}>
            Booking Summary
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                bgcolor: '#F8FAFC',
                p: 3,
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                mb: 3,
              }}
            >
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'primary.main' }}>
                      <Bed size={20} />
                    </Box>
                    <Typography fontWeight={700}>
                      {selectedRoom?.name}
                    </Typography>
                  </Box>
                  <Typography fontWeight={800} color="primary">
                    ₹{selectedRoom?.price}/night
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'text.secondary' }}>
                      <Calendar size={20} />
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {checkIn || '---'} to {checkOut || '---'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    {getNights()} Nights
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'text.secondary' }}>
                      <Users size={20} />
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {adults} Adults, {children} Children
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" fontWeight={900}>
                    Total (approx)
                  </Typography>
                  <Typography variant="h5" fontWeight={950} color="primary">
                    ₹{totalPrice}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    textAlign: 'right',
                    mt: -1,
                    display: 'block',
                  }}
                >
                  *Excluding taxes and service fees
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
                gap: 1.5,
                p: 2,
                bgcolor: 'primary.50',
                borderRadius: '16px',
                color: 'primary.dark',
              }}
            >
              <Box sx={{ mt: 0.5 }}>
                <Info size={18} />
              </Box>
              <Typography variant="body2" fontWeight={500}>
                Clicking proceed will open WhatsApp with these details. Our team
                will then confirm the availability.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<WhatsApp />}
              href={bookingWhatsappUrl}
              target="_blank"
              onClick={() => setIsBreakdownOpen(false)}
              sx={{
                bgcolor: '#25D366',
                color: 'white',
                '&:hover': { bgcolor: '#1fad53' },
                borderRadius: '16px',
                py: 2,
                fontWeight: 900,
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              Proceed to WhatsApp
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setIsBreakdownOpen(false)}
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'none',
              }}
            >
              Modify Selection
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  )
}
