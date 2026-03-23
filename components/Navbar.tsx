'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Container } from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Rooms', path: '/rooms' },
  { name: 'Packages', path: '/packages' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black py-4">
      <Container maxWidth="lg" className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
          Travels <span className="bg-primary px-1">Puri 13</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-bold uppercase tracking-tight transition-colors hover:text-secondary ${
                pathname === item.path ? 'text-secondary underline decoration-4 underline-offset-4' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="contained"
            color="primary"
            className="font-black"
            onClick={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')}
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 brutal-border bg-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black p-4 flex flex-col gap-4 shadow-brutal-lg">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-xl font-bold uppercase ${
                pathname === item.path ? 'text-secondary' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="font-black"
            onClick={() => {
                setIsMenuOpen(false);
                window.open('https://wa.me/91XXXXXXXXXX', '_blank');
            }}
          >
            Book Now
          </Button>
        </div>
      )}
    </nav>
  );
}
