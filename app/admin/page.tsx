'use client'

import AdminHotelForm from '@/components/AdminHotelForm'
import AdminRoomForm from '@/components/AdminRoomForm'
import { api } from '@/lib/api'
import { Hotel, Room } from '@/types'
import {
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Box,
  Skeleton
} from '@mui/material'
import {
  Edit2,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  RefreshCcw,
  Trash2,
  Building2,
  BedDouble
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [roomFormOpen, setRoomFormOpen] = useState(false)
  const [hotelFormOpen, setHotelFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)

  const { data: hotels, isLoading: hotelsLoading, mutate: mutateHotels } = useSWR(
    isAuthenticated ? 'getHotels' : null,
    () => api.getHotels()
  )
  const { data: rooms, isLoading: roomsLoading, mutate: mutateRooms } = useSWR(
    isAuthenticated ? 'getRooms' : null,
    () => api.getRooms()
  )

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
    } else {
      alert('Invalid password')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_auth')
  }

  const handleDelete = async (type: 'hotels' | 'rooms', id: string) => {
    if (confirm(`Are you sure you want to delete this ${type === 'hotels' ? 'hotel' : 'room'}?`)) {
      try {
        await api.deleteItem(type, id)
        if (type === 'hotels') mutateHotels()
        else mutateRooms()
      } catch {
        alert('Failed to delete')
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xs" className="py-32">
        <Paper className="p-10 claymorphic rounded-[32px] bg-white">
          <Box className="flex justify-center mb-6">
            <Box className="bg-primary/10 p-5 rounded-full">
              <Lock size={40} className="text-primary" />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight={900} textAlign="center" gutterBottom>
            Admin Panel
          </Typography>
          <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-6">
            <TextField
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 2, fontWeight: 900, borderRadius: '16px' }}
            >
              Access Portal
            </Button>
          </form>
        </Paper>
      </Container>
    )
  }

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <Container maxWidth="lg">
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <Box className="flex items-center gap-4">
            <Box className="claymorphic bg-white p-4 rounded-[24px]">
              <LayoutDashboard size={32} className="text-primary" />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={950} className="tracking-tight">
                Manager Portal
              </Typography>
              <Typography variant="body1" className="text-secondary/60 font-bold">
                Control your inventory and listings
              </Typography>
            </Box>
          </Box>
          <Box className="flex gap-3">
            <Button
              variant="outlined"
              onClick={() => { mutateHotels(); mutateRooms(); }}
              className="rounded-2xl border-gray-200 font-bold px-5"
              startIcon={<RefreshCcw size={18} />}
            >
              Sync
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              className="rounded-2xl font-bold px-5"
              startIcon={<LogOut size={18} />}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Paper className="claymorphic rounded-[40px] bg-white overflow-hidden">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ px: 4, pt: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Building2 size={20} />} iconPosition="start" label="Hotels" sx={{ fontWeight: 800, minHeight: 70, px: 4 }} />
            <Tab icon={<BedDouble size={20} />} iconPosition="start" label="Rooms" sx={{ fontWeight: 800, minHeight: 70, px: 4 }} />
          </Tabs>

          <Box className="p-8">
            <Box className="flex justify-between items-center mb-8">
              <Typography variant="h5" fontWeight={900}>
                {activeTab === 0 ? 'Managed Hotels' : 'Room Inventory'}
                <Chip 
                  label={activeTab === 0 ? hotels?.length || 0 : rooms?.length || 0} 
                  size="small" 
                  sx={{ ml: 2, fontWeight: 900, bgcolor: 'gray.100' }} 
                />
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                sx={{ borderRadius: '16px', px: 4, fontWeight: 900, py: 1.2 }}
                onClick={() => activeTab === 0 ? setHotelFormOpen(true) : setRoomFormOpen(true)}
              >
                Create New
              </Button>
            </Box>

            <Grid container spacing={3}>
              {activeTab === 0 ? (
                hotelsLoading ? [1,2,3].map(i => <Grid key={i} size={{ xs: 12, md: 6 }}><Skeleton height={120} sx={{ borderRadius: '24px' }} /></Grid>) :
                hotels?.map((h) => (
                  <Grid key={h.id} size={{ xs: 12, md: 6 }}>
                    <Box className="p-4 border border-gray-100 rounded-[24px] flex gap-5 items-center hover:bg-gray-50/50 transition-all">
                        <Box className="relative w-24 h-24 rounded-[20px] overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                            <Image fill src={h.cover_image} alt={h.name} className="object-cover" />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={900}>{h.name}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="caption" fontWeight={700} color="primary">₹{h.starting_price}</Typography>
                                {h.is_sponsored && <Chip label="Sponsored" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 900, bgcolor: 'amber.50', color: 'amber.700' }} />}
                            </Box>
                        </Box>
                        <Box className="flex flex-col gap-2">
                            <IconButton onClick={() => { setEditingHotel(h); setHotelFormOpen(true); }} className="bg-white shadow-sm border border-gray-100"><Edit2 size={16} /></IconButton>
                            <IconButton onClick={() => handleDelete('hotels', h.id)} className="bg-red-50/50 text-red-500 border border-red-50"><Trash2 size={16} /></IconButton>
                        </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                roomsLoading ? [1,2,3].map(i => <Grid key={i} size={{ xs: 12, md: 6 }}><Skeleton height={120} sx={{ borderRadius: '24px' }} /></Grid>) :
                rooms?.map((r) => (
                    <Grid key={r.id} size={{ xs: 12, md: 6 }}>
                      <Box className="p-4 border border-gray-100 rounded-[24px] flex gap-5 items-center hover:bg-gray-50/50 transition-all">
                          <Box className="relative w-24 h-24 rounded-[20px] overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                              <Image fill src={r.image_urls[0]} alt={r.name} className="object-cover" />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" fontWeight={800}>{r.name}</Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary">₹{r.price} • Hotel ID: {r.hotel_id}</Typography>
                          </Box>
                          <Box className="flex flex-col gap-2">
                              <IconButton onClick={() => { setEditingRoom(r); setRoomFormOpen(true); }} className="bg-white shadow-sm border border-gray-100"><Edit2 size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete('rooms', r.id)} className="bg-red-50/50 text-red-500 border border-red-50"><Trash2 size={16} /></IconButton>
                          </Box>
                      </Box>
                    </Grid>
                  ))
              )}
            </Grid>
          </Box>
        </Paper>

        <AdminHotelForm
          open={hotelFormOpen}
          hotel={editingHotel}
          onClose={(refresh) => {
            setHotelFormOpen(false)
            setEditingHotel(null)
            if (refresh) mutateHotels()
          }}
        />
        <AdminRoomForm
          open={roomFormOpen}
          room={editingRoom}
          onClose={(refresh) => {
            setRoomFormOpen(false)
            setEditingRoom(null)
            if (refresh) mutateRooms()
          }}
        />
      </Container>
    </div>
  )
}
