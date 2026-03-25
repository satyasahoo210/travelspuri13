'use client'

import { WHATSAPP_NUMBER } from '@/lib/constants'
import { Button, Container } from '@mui/material'
import { Menu as MenuIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Admin', path: '/admin' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border py-4">
      <Container maxWidth="lg" className="flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          TRAVELS{' '}
          <span className="text-accent underline decoration-2 underline-offset-4">
            PURI 13
          </span>
          {/* <Image src={Logo} alt={'TRAVELS PURI 13'} className="h-15" /> */}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname === item.path ? 'text-accent' : 'text-secondary'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="contained"
            color="primary"
            className="rounded-full px-6"
            onClick={() =>
              window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')
            }
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border p-6 flex flex-col gap-6 shadow-soft-lg animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-medium ${
                pathname === item.path ? 'text-accent' : 'text-secondary'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="rounded-full py-3"
            onClick={() => {
              setIsMenuOpen(false)
              window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')
            }}
          >
            Book Now
          </Button>
        </div>
      )}
    </nav>
  )
}
