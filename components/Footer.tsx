import { WHATSAPP_NUMBER } from '@/lib/constants';
import { Container, Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black mt-auto">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" className="font-black uppercase mb-4 text-primary">
              Travels Puri 13
            </Typography>
            <Typography className="mb-4 text-gray-400">
              Affordable Stays & Travel Packages in Puri. Experience the spiritual and scenic beauty of Puri with our curated services.
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6" className="font-bold uppercase mb-4">
              Quick Links
            </Typography>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="hover:text-primary transition-colors">Rooms</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin</Link></li>
            </ul>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6" className="font-bold uppercase mb-4">
              Contact
            </Typography>
            <Typography className="text-gray-400">
              Puri, Odisha, India<br />
              Email: info@travelspuri13.com<br />
              Phone: +91 {WHATSAPP_NUMBER.slice(2)}
            </Typography>
          </Grid>
        </Grid>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <Typography variant="body2">
            © {new Date().getFullYear()} Travels Puri 13. All rights reserved.
          </Typography>
        </div>
      </Container>
    </footer>
  );
}
