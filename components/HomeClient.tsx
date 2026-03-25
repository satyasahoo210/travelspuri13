'use client'

import HotelCard from '@/components/HotelCard'
import { api } from '@/lib/api'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Hotel } from '@/types'
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

interface HomeClientProps {
  initialHotels: Hotel[]
}

export default function HomeClient({ initialHotels }: HomeClientProps) {
  const theme = useTheme()
  const isSmallScreenUp = useMediaQuery(theme.breakpoints.up('sm'))

  const { data: hotels, isLoading: hotelsLoading } = useSWR(
    'getHotels',
    () => api.getHotels(),
    { fallbackData: initialHotels },
  )

  return (
    <div className="flex flex-col gap-0 animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gray-50 overflow-hidden">
        <Container maxWidth="lg" className="relative z-10 pt-20 pb-32">
          <div className="max-w-4xl text-center mx-auto">
            <Typography
              variant="overline"
              className="text-primary font-black tracking-[0.3em] mb-4 block opacity-80"
              sx={{ fontSize: '0.9rem' }}
            >
              DISCOVER PURI&apos;S FINEST
            </Typography>
            <Typography
              variant={isSmallScreenUp ? 'h1' : 'h2'}
              className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-primary"
              sx={{ textShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
            >
              Your Gateway to <br />{' '}
              <span className="text-secondary">Premium Stays</span> in Puri
            </Typography>
            <Typography
              variant="h6"
              className="text-secondary/70 mb-12 font-medium mx-auto max-w-2xl leading-relaxed"
            >
              Compare the best hotels, discover exclusive deals, and book your
              spiritual retreat with zero hassle. Travels Puri 13 — curated for
              the mindful traveler.
            </Typography>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-2">
              <Link href="/hotels" className="w-full sm:w-auto">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth={!isSmallScreenUp}
                  className="rounded-2xl px-12 py-5 text-lg shadow-soft hover:shadow-soft-lg transform transition-all hover:-translate-y-1"
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  Explore All Hotels
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                className="rounded-2xl px-12 py-5 text-lg border-2 hover:bg-white"
                sx={{
                  fontWeight: 800,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  width: { xs: 'fit-content', sm: 'auto' },
                }}
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight * 0.8,
                    behavior: 'smooth',
                  })
                }
              >
                Featured Stays
              </Button>
            </div>
          </div>
        </Container>

        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-15 transform translate-x-1/4"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] opacity-30"></div>
      </section>

      {/* Featured Hotels */}
      <section className="py-32 bg-white">
        <Container maxWidth="lg">
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 px-2 gap-6">
            <div>
              <Typography
                variant={isSmallScreenUp ? 'h3' : 'h4'}
                fontWeight={900}
                className="mb-3 text-primary tracking-tight"
              >
                Featured Collections
              </Typography>
              <Typography
                variant="body1"
                className="text-secondary/60 max-w-md font-medium"
              >
                Handpicked premium accommodations with exceptional service and
                prime locations.
              </Typography>
            </div>
            <Link
              href="/hotels"
              className="group text-primary font-black flex items-center gap-2 hover:text-secondary transition-all no-underline"
            >
              See All{' '}
              <Box
                component="span"
                className="group-hover:translate-x-2 transition-transform"
              >
                <ArrowRight size={24} />
              </Box>
            </Link>
          </Box>

          <Grid container spacing={4}>
            {hotelsLoading && !hotels
              ? [1, 2, 3].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton
                      variant="rectangular"
                      height={400}
                      sx={{ borderRadius: '24px', mb: 2 }}
                    />
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} />
                  </Grid>
                ))
              : hotels?.slice(0, 3).map((hotel: Hotel) => (
                  <Grid key={hotel.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <HotelCard hotel={hotel} />
                  </Grid>
                ))}
          </Grid>

          {/* mobile only see more button */}
          <Box
            sx={{
              display: { xs: 'block', sm: 'none' },
              mt: 6,
              textAlign: 'center',
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              href="/hotels"
              sx={{
                borderRadius: '16px',
                py: 2,
                fontWeight: 800,
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.50' },
              }}
            >
              See More Featured Stays
            </Button>
          </Box>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-50/50 relative overflow-hidden">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative h-150 rounded-[48px] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-700">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
                alt="Puri Coastal Luxury"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                }}
              />
            </div>
            <div>
              <Typography
                variant="overline"
                color="primary"
                fontWeight={900}
                letterSpacing={4}
                sx={{ mb: 2, display: 'block' }}
              >
                EXCELLENCE AS STANDARD
              </Typography>
              <Typography
                variant="h2"
                fontWeight={900}
                className="mb-8 leading-[1.1] text-primary tracking-tight"
              >
                Curating Memories, <br /> Not Just Bookings.
              </Typography>
              <Typography className="text-secondary/70 text-xl mb-12 leading-relaxed font-medium">
                We believe travel should be soul-stirring. Our aggregator
                platform carefully vets every property to ensure your stay in
                Puri is nothing short of divine. From proximity to Lord
                Jagannath temple to the soothing sea breeze of Baliapanda,
                we&apos;ve got you covered.
              </Typography>

              <div className="grid grid-cols-2 gap-10">
                <Box>
                  <Typography className="font-black text-primary text-5xl mb-2 tracking-tighter">
                    100%
                  </Typography>
                  <Typography className="text-xs text-secondary/50 uppercase tracking-[0.2em] font-black">
                    Vetted Listings
                  </Typography>
                </Box>
                <Box>
                  <Typography className="font-black text-primary text-5xl mb-2 tracking-tighter">
                    24/7
                  </Typography>
                  <Typography className="text-xs text-secondary/50 uppercase tracking-[0.2em] font-black">
                    Expert Support
                  </Typography>
                </Box>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white flex justify-center">
        <Container maxWidth="md">
          <Box
            className="claymorphic"
            sx={{
              p: { xs: 6, md: 10 },
              borderRadius: '48px',
              textAlign: 'center',
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: 'text.primary',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
            }}
          >
            <Typography
              variant={isSmallScreenUp ? 'h2' : 'h4'}
              fontWeight={950}
              className="mb-6 tracking-tight text-primary"
            >
              Plan Your Divine Journey
            </Typography>
            <Typography className="text-secondary/70 text-xl mb-12 max-w-xl mx-auto font-medium">
              Need a custom itinerary or group booking? Our Puri travel experts
              are just a message away.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#25D366',
                color: 'white',
                '&:hover': { bgcolor: '#1fad53', transform: 'scale(1.05)' },
                px: 6,
                py: 2.5,
                borderRadius: '20px',
                fontSize: '1.2rem',
                fontWeight: 900,
                textTransform: 'none',
                transition: 'all 0.3s ease',
              }}
              className="shadow-2xl"
              onClick={() =>
                window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')
              }
              startIcon={<MessageCircle size={28} />}
            >
              Chat with an Expert
            </Button>

            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                opacity: 0.03,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                opacity: 0.03,
              }}
            />
          </Box>
        </Container>
      </section>
    </div>
  )
}
