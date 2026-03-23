'use client'

import PackageCard from '@/components/PackageCard'
import RoomCard from '@/components/RoomCard'
import { api, fetcher } from '@/lib/api'
import { API_URL, WHATSAPP_NUMBER } from '@/lib/constants'
import { Package, Room } from '@/types'
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

export default function Home() {
  const {
    data: roomsData,
    error: roomsError,
    isLoading: roomsLoading,
  } = useSWR(`${API_URL}?action=getRooms`, fetcher)
  const {
    data: packagesData,
    error: packagesError,
    isLoading: packagesLoading,
  } = useSWR(`${API_URL}?action=getPackages`, fetcher)

  return (
    <div className="flex flex-col gap-0 animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gray-50 overflow-hidden">
        <Container maxWidth="lg" className="relative z-10 pt-20 pb-32">
          <div className="max-w-3xl text-center mx-auto">
            <Typography
              variant="overline"
              className="text-accent font-bold tracking-[0.2em] mb-4 block"
            >
              WELCOME TO PURI
            </Typography>
            <Typography
              variant="h1"
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-primary"
            >
              Experience the Spiritual <br /> & Scenic Beauty of Puri
            </Typography>
            <Typography
              variant="h6"
              className="text-secondary mb-12 font-normal mx-auto leading-relaxed"
            >
              Curated stays and travel packages designed for your comfort and
              spiritual journey. Affordable luxury in the heart of Odisha.
            </Typography>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
              <Link href="/rooms">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className="rounded-full px-10 py-4 text-lg shadow-soft hover:shadow-soft-lg"
                >
                  Browse Rooms
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  className="rounded-full px-10 py-4 text-lg border-2 hover:bg-gray-100"
                >
                  View Packages
                </Button>
              </Link>
            </div>
          </div>
        </Container>

        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Featured Rooms */}
      <section className="section-padding bg-white">
        <Container maxWidth="lg">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Typography variant="h3" className="mb-2">
                Featured Rooms
              </Typography>
              <Typography className="text-secondary max-w-sm">
                Handpicked accommodations near the temple and beach.
              </Typography>
            </div>
            <Link
              href="/rooms"
              className="text-accent font-bold flex items-center gap-1 hover:underline mb-2 transition-all"
            >
              See All <ArrowRight size={18} />
            </Link>
          </div>

          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              flexWrap: 'nowrap',
              gap: 3,
              pb: 4,
              px: 0.5,
              '&::-webkit-scrollbar': { height: '6px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '10px',
              },
            }}
          >
            {roomsLoading ? (
              [1, 2, 3].map((i) => (
                <Box key={i} sx={{ minWidth: 320, width: 320 }}>
                  <Skeleton
                    variant="rectangular"
                    height={256}
                    className="rounded-xl mb-4"
                  />
                  <Skeleton variant="text" height={32} width="80%" />
                  <Skeleton variant="text" height={24} width="60%" />
                </Box>
              ))
            ) : roomsError ? (
              <div className="w-full p-12 text-center text-red-500 bg-red-50 rounded-xl font-medium">
                Failed to load rooms.
              </div>
            ) : (
              roomsData?.data
                ?.slice(0, 6)
                .map((room: Room) => ({
                  ...room,
                  image_url: api.transformImageUrl(room.image_url),
                }))
                .map((room: Room) => (
                  <Box
                    key={room.id}
                    sx={{
                      minWidth: { xs: 280, sm: 320 },
                      width: { xs: 280, sm: 320 },
                    }}
                  >
                    <RoomCard room={room} />
                  </Box>
                ))
            )}
          </Box>
        </Container>
      </section>

      {/* Featured Packages */}
      <section className="section-padding bg-gray-50">
        <Container maxWidth="lg">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Typography variant="h3" className="mb-2">
                Popular Packages
              </Typography>
              <Typography className="text-secondary max-w-sm">
                Explore the best of Puri and nearby attractions.
              </Typography>
            </div>
            <Link
              href="/packages"
              className="text-accent font-bold flex items-center gap-1 hover:underline mb-2 transition-all"
            >
              Explore All <ArrowRight size={18} />
            </Link>
          </div>

          <Grid container spacing={4}>
            {packagesLoading ? (
              [1, 2, 3].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton
                    variant="rectangular"
                    height={300}
                    className="rounded-xl mb-4"
                  />
                  <Skeleton variant="text" height={32} />
                </Grid>
              ))
            ) : packagesError ? (
              <div className="w-full p-12 text-center text-red-500 bg-red-50 rounded-xl font-medium">
                Failed to load packages.
              </div>
            ) : (
              packagesData?.data
                ?.slice(0, 3)
                .map((pkg: Package) => ({
                  ...pkg,
                  image_url: api.transformImageUrl(pkg.image_url),
                }))
                .map((pkg: Package) => (
                  <Grid key={pkg.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <PackageCard packageItem={pkg} />
                  </Grid>
                ))
            )}
          </Grid>
        </Container>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-125 rounded-2xl overflow-hidden shadow-soft-lg">
              <Image
                src="https://drive.google.com/uc?export=view&id=1Jzvk2-B_J7Rd4zLIPDsOLRfiHuqptNMl" // Placeholder for a nice Puri image
                alt="Puri Experience"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <Typography variant="h2" className="mb-6 leading-tight">
                Beyond Just a Stay, <br /> An Experience.
              </Typography>
              <Typography className="text-secondary text-lg mb-10 leading-relaxed">
                We pride ourselves on providing more than just a roof over your
                head. Our team ensures every aspect of your travel is handled
                with care—from temple visits to coastal explorations.
              </Typography>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <Typography className="font-bold text-accent text-3xl mb-1">
                    100%
                  </Typography>
                  <Typography className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                    Satisfaction
                  </Typography>
                </div>
                <div>
                  <Typography className="font-bold text-accent text-3xl mb-1">
                    50+
                  </Typography>
                  <Typography className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                    Happy Groups
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary text-white text-center">
        <Container maxWidth="md">
          <Typography variant="h2" className="text-white mb-6">
            Plan Your Trip with Experts
          </Typography>
          <Typography className="text-gray-400 text-xl mb-10 mx-auto">
            Have specific requirements? Our team can create a custom itinerary
            for your group or family.
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#1fad53' },
              marginTop: 'calc(var(--spacing) * 2)',
            }}
            size="large"
            className="rounded-full px-12 py-5 text-xl font-bold shadow-soft-lg group"
            onClick={() =>
              window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')
            }
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={24} className="group-hover:animate-bounce" />
              <span>Chat on WhatsApp</span>
            </div>
          </Button>
        </Container>
      </section>
    </div>
  )
}
