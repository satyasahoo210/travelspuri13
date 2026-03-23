'use client';

import RoomCard from '@/components/RoomCard';
import { api, fetcher } from '@/lib/api';
import { API_URL } from '@/lib/constants';
import { Room } from '@/types';
import { Container, Grid, Skeleton, Typography, Box } from '@mui/material';
import useSWR from 'swr';

export default function RoomsPage() {
  const { data, error, isLoading } = useSWR(`${API_URL}?action=getRooms`, fetcher);

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <Container maxWidth="lg">
        <Box className="max-w-2xl mb-16 animate-fade-in">
            <Typography variant="overline" className="text-accent font-bold tracking-widest mb-2 block">
                ACCOMMODATIONS
            </Typography>
            <Typography variant="h2" className="mb-4 font-bold tracking-tight">Our Rooms</Typography>
            <Typography variant="h6" className="text-secondary font-normal">
                Carefully curated stays designed for comfort and peace. Choose from a variety of options near the heart of Puri.
            </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={256} className="rounded-xl mb-4" />
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={24} width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Box className="p-12 text-center bg-white rounded-2xl border border-red-100 shadow-soft">
            <Typography variant="h6" className="text-red-500 font-bold mb-2">Notice</Typography>
            <Typography className="text-secondary">Failed to load rooms. Please refresh the page or contact support.</Typography>
          </Box>
        ) : data?.data?.length === 0 ? (
          <Box className="p-20 text-center bg-white rounded-2xl border border-border shadow-soft">
            <Typography variant="h5" className="font-bold mb-4">No rooms available right now.</Typography>
            <Typography className="text-secondary mb-8">All our rooms are currently booked. Please check back later.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} className="animate-fade-in">
            {data?.data?.map((room: Room) => ({
              ...room,
              image_url: api.transformImageUrl(room.image_url),
            }))?.map((room: Room) => (
              <Grid key={room.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <RoomCard room={room} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}
