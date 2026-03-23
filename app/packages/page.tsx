'use client';

import PackageCard from '@/components/PackageCard';
import { api, fetcher } from '@/lib/api';
import { API_URL } from '@/lib/constants';
import { Package } from '@/types';
import { Container, Grid, Skeleton, Typography, Box } from '@mui/material';
import useSWR from 'swr';

export default function PackagesPage() {
  const { data, error, isLoading } = useSWR(`${API_URL}?action=getPackages`, fetcher);

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <Container maxWidth="lg">
        <Box className="max-w-2xl mb-16 animate-fade-in">
            <Typography variant="overline" className="text-accent font-bold tracking-widest mb-2 block">
                EXPLORE ODISHA
            </Typography>
            <Typography variant="h2" className="mb-4 font-bold tracking-tight">Travel Packages</Typography>
            <Typography variant="h6" className="text-secondary font-normal">
                Discover the mystical charms of Puri, Konark, and Chilika with our expertly crafted itineraries.
            </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={300} className="rounded-xl mb-4" />
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={24} width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Box className="p-12 text-center bg-white rounded-2xl border border-red-100 shadow-soft">
            <Typography variant="h6" className="text-red-500 font-bold mb-2">Notice</Typography>
            <Typography className="text-secondary">Failed to load packages. Please contact us directly for enquiries.</Typography>
          </Box>
        ) : data?.data?.length === 0 ? (
          <Box className="p-20 text-center bg-white rounded-2xl border border-border shadow-soft">
            <Typography variant="h5" className="font-bold mb-4">New packages coming soon!</Typography>
            <Typography className="text-secondary mb-8">We are currently updating our seasonal travel offers. Stay tuned.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} className="animate-fade-in">
            {data?.data?.map((pkg: Package) => ({
              ...pkg,
              image_url: api.transformImageUrl(pkg.image_url),
            }))?.map((pkg: Package) => (
              <Grid key={pkg.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PackageCard packageItem={pkg} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}
