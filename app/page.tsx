import { Button, Container, Grid, Typography } from '@mui/material';
import { ArrowRight, Hotel, Map } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="bg-primary border-b-4 border-black py-24 relative overflow-hidden">
        <Container maxWidth="lg" className="relative z-10">
          <div className="max-w-2xl">
            <Typography variant="h1" className="text-6xl md:text-8xl font-black mb-6 leading-none">
              Travels <br />
              <span className="bg-white px-2 inline-block brutal-border mt-2">Puri 13</span>
            </Typography>
            <Typography variant="h5" className="font-bold mb-8 uppercase tracking-wide">
              Affordable Stays & Travel Packages in Puri
            </Typography>
            <div className="flex flex-wrap gap-4">
              <Link href="/rooms">
                <Button variant="contained" color="secondary" size="large" className="text-xl px-8 py-4">
                  Browse Rooms
                </Button>
              </Link>
              <Link href="/packages">
                <Button variant="contained" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' } }} size="large" className="text-xl px-8 py-4">
                  Travel Packages
                </Button>
              </Link>
            </div>
          </div>
        </Container>
        
        {/* Background elements */}
        <div className="absolute top-10 right-10 w-64 h-64 border-4 border-black rounded-full opacity-20 -rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-accent brutal-border rotate-12 hidden lg:block"></div>
      </section>

      {/* Featured Sections placeholder */}
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="brutal-card bg-accent text-white h-full flex flex-col justify-between">
              <div>
                <Hotel size={48} className="mb-4" strokeWidth={3} />
                <Typography variant="h3" className="mb-4">Found your stay?</Typography>
                <Typography className="text-lg opacity-90 mb-6">
                  From budget-friendly rooms to premium suites near the Jagannath Temple and Sea Beach.
                </Typography>
              </div>
              <Link href="/rooms" className="inline-flex items-center gap-2 font-black uppercase text-xl hover:underline">
                View All Rooms <ArrowRight />
              </Link>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="brutal-card bg-secondary text-white h-full flex flex-col justify-between">
              <div>
                <Map size={48} className="mb-4" strokeWidth={3} />
                <Typography variant="h3" className="mb-4">Explore Puri</Typography>
                <Typography className="text-lg opacity-90 mb-6">
                  Expertly crafted travel packages covering Konark, Chilika, and local sightseeing.
                </Typography>
              </div>
              <Link href="/packages" className="inline-flex items-center gap-2 font-black uppercase text-xl hover:underline">
                Explore Packages <ArrowRight />
              </Link>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* WhatsApp CTA Section */}
      <section className="bg-black text-white py-20 border-y-4 border-black">
        <Container maxWidth="md" className="text-center">
          <Typography variant="h2" className="text-primary mb-6">Need a custom plan?</Typography>
          <Typography variant="h6" className="mb-10 opacity-80 uppercase">
             Chat with our travel experts directly on WhatsApp for personalized bookings.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            className="text-2xl px-12 py-6"
            // onClick={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')}
          >
            Message Us on WhatsApp
          </Button>
        </Container>
      </section>
    </div>
  );
}
