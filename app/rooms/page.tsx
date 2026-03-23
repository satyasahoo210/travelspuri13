'use client';

import RoomCard from '@/components/RoomCard';
import { api, fetcher } from '@/lib/api';
import { API_URL } from '@/lib/constants';
import { Room } from '@/types';
import { Container, Grid, Skeleton, Typography } from '@mui/material';
import useSWR from 'swr';

export default function RoomsPage() {
  const { data, error, isLoading } = useSWR(`${API_URL}?action=getRooms`, fetcher);

  return (
    <div className="py-16">
      <Container maxWidth="lg">
        <Typography variant="h2" className="mb-4 font-black">Our Rooms</Typography>
        <Typography variant="h6" className="mb-12 text-gray-600 uppercase">
          Comfortable and affordable stays for every budget.
        </Typography>

        {isLoading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={300} className="brutal-border mb-4" />
                <Skeleton variant="text" height={40} width="80%" />
                <Skeleton variant="text" height={20} width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <div className="p-8 brutal-card bg-red-100 text-red-800 font-bold text-center">
            Failed to load rooms. Please try again later.
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 brutal-card bg-yellow-50 text-center">
            <Typography variant="h5" className="font-bold mb-2">No rooms available right now.</Typography>
            <Typography>Check back later or contact us on WhatsApp.</Typography>
          </div>
        ) : (
          <Grid container spacing={4}>
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
