import { EMAIL_ADDRESS, WHATSAPP_NUMBER } from '@/lib/constants'
import { Box, Container, Grid, Typography } from '@mui/material'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-border py-16 mt-auto">
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="h6"
              className="font-bold mb-6 text-primary tracking-tight"
            >
              TRAVELS PURI 13
            </Typography>
            <Typography className="text-secondary leading-relaxed mb-6 max-w-md">
              Your trusted partner for memorable stays and curated travel
              experiences in the holy city of Puri. We combine tradition with
              modern comfort.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              className="font-bold mb-6 text-primary uppercase tracking-widest"
            >
              Quick Links
            </Typography>
            <Box className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-secondary hover:text-accent transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/rooms"
                className="text-secondary hover:text-accent transition-colors text-sm"
              >
                Browse Rooms
              </Link>
              <Link
                href="/packages"
                className="text-secondary hover:text-accent transition-colors text-sm"
              >
                Travel Packages
              </Link>
              <Link
                href="/admin"
                className="text-secondary hover:text-accent transition-colors text-sm"
              >
                Admin Portal
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Typography
              variant="subtitle2"
              className="font-bold mb-6 text-primary uppercase tracking-widest"
            >
              Contact Detail
            </Typography>
            <Typography className="text-secondary leading-relaxed text-sm">
              Bimanabadu Sahi, Sarbamangala Pathagara
              <br />
              Puri, Odisha, India - 752001
              <br />
              <span className="block mt-2 font-medium text-primary">
                Email: {EMAIL_ADDRESS}
              </span>
              <span className="block mt-1 font-medium text-primary">
                Phone: +91 {WHATSAPP_NUMBER.slice(2)}
              </span>
            </Typography>
          </Grid>
        </Grid>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Travels Puri 13. All rights reserved.
          </Typography>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors text-xs"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors text-xs"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
