'use client'

import AdminPackageForm from '@/components/AdminPackageForm'
import AdminRoomForm from '@/components/AdminRoomForm'
import { api, fetcher } from '@/lib/api'
import { API_URL } from '@/lib/constants'
import { Package, Room } from '@/types'
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
} from '@mui/material'
import {
  Edit2,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  RefreshCcw,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [roomFormOpen, setRoomFormOpen] = useState(false)
  const [packageFormOpen, setPackageFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)

  const { data: roomsData, mutate: mutateRooms } = useSWR(
    isAuthenticated ? `${API_URL}?action=getRooms` : null,
    fetcher,
  )
  const { data: packagesData, mutate: mutatePackages } = useSWR(
    isAuthenticated ? `${API_URL}?action=getPackages` : null,
    fetcher,
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_auth')
  }

  const handleDelete = async (type: 'rooms' | 'packages', id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteItem(type, id)
        if (type === 'rooms') {
          mutateRooms()
        } else {
          mutatePackages()
        }
      } catch {
        alert('Failed to delete')
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xs" className="py-32">
        <Paper
          elevation={0}
          className="p-10 border border-border rounded-2xl shadow-soft bg-white"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gray-50 p-4 rounded-full">
              <Lock size={40} className="text-primary" />
            </div>
          </div>
          <Typography variant="h4" className="text-center font-bold mb-8">
            Admin Access
          </Typography>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="py-4 font-bold rounded-xl"
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>
    )
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <Container maxWidth="lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 border border-border rounded-xl shadow-soft">
              <LayoutDashboard size={24} className="text-accent" />
            </div>
            <div>
              <Typography variant="h4" className="font-bold tracking-tight">
                Management Portal
              </Typography>
              <Typography
                variant="body2"
                className="text-secondary font-medium"
              >
                Manage your rooms and travel packages
              </Typography>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                mutateRooms()
                mutatePackages()
              }}
              className="font-bold rounded-full border-border text-secondary hover:bg-white"
              startIcon={<RefreshCcw size={16} />}
            >
              Sync Data
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              className="font-bold rounded-full border-red-100 bg-red-50/50 hover:bg-red-50"
              startIcon={<LogOut size={16} />}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            className="border-b border-border bg-gray-50/50 px-4"
            TabIndicatorProps={{
              style: { height: 3, borderRadius: '3px 3px 0 0' },
            }}
          >
            <Tab
              label="Rooms Inventory"
              className="font-bold py-6 px-8 lowercase first-letter:uppercase"
            />
            <Tab
              label="Travel Packages"
              className="font-bold py-6 px-8 lowercase first-letter:uppercase"
            />
          </Tabs>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <Typography variant="h5" className="font-bold">
                {activeTab === 0 ? 'Total Rooms' : 'Available Packages'}
                <span className="ml-3 text-sm font-normal text-secondary py-1 px-3 bg-gray-100 rounded-full">
                  {activeTab === 0
                    ? roomsData?.data?.length || 0
                    : packagesData?.data?.length || 0}{' '}
                  items
                </span>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Plus size={18} />}
                className="font-bold px-6 py-2.5 rounded-full shadow-soft hover:shadow-soft-md"
                onClick={() =>
                  activeTab === 0
                    ? setRoomFormOpen(true)
                    : setPackageFormOpen(true)
                }
              >
                Create New
              </Button>
            </div>

            <Grid container spacing={3}>
              {activeTab === 0
                ? roomsData?.data
                    ?.map((room: Room) => ({
                      ...room,
                      image_url: api.transformImageUrl(room.image_url),
                    }))
                    .map((room: Room) => (
                      <Grid key={room.id} size={{ xs: 12, md: 6 }}>
                        <div className="p-4 border border-border rounded-xl flex gap-5 items-center hover:bg-gray-50 transition-colors">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-gray-100 shrink-0 relative">
                            {room.image_url ? (
                              <Image
                                fill
                                src={room.image_url[0]}
                                alt={room.name}
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                NA
                              </div>
                            )}
                          </div>
                          <div className="grow">
                            <Typography className="font-bold text-lg mb-0.5">
                              {room.name}
                            </Typography>
                            <div className="flex items-center gap-3">
                              <Typography className="text-accent font-bold">
                                ₹{room.price}
                              </Typography>
                              <Chip
                                label={room.is_active ? 'Active' : 'Hidden'}
                                variant="outlined"
                                size="small"
                                className={`text-[10px] font-bold uppercase border-none h-5 px-1 ${room.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}
                              />
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <IconButton
                              className="bg-gray-50 hover:bg-white border border-border p-2 rounded-lg"
                              onClick={() => {
                                setEditingRoom(room)
                                setRoomFormOpen(true)
                              }}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                              className="bg-red-50/50 hover:bg-red-50 border border-red-100 p-2 rounded-lg text-red-500"
                              onClick={() => handleDelete('rooms', room.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        </div>
                      </Grid>
                    ))
                : packagesData?.data
                    ?.map((pkg: Package) => ({
                      ...pkg,
                      image_url: api.transformImageUrl(pkg.image_url),
                    }))
                    .map((pkg: Package) => (
                      <Grid key={pkg.id} size={{ xs: 12, md: 6 }}>
                        <div className="p-4 border border-border rounded-xl flex gap-5 items-center hover:bg-gray-50 transition-colors">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-gray-100 shrink-0 relative">
                            {pkg.image_url ? (
                              <Image
                                fill
                                src={pkg.image_url[0]}
                                alt={pkg.name}
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                NA
                              </div>
                            )}
                          </div>
                          <div className="grow">
                            <Typography className="font-bold text-lg mb-0.5">
                              {pkg.name}
                            </Typography>
                            <div className="flex items-center gap-3">
                              <Typography className="text-accent font-bold">
                                ₹{pkg.price}
                              </Typography>
                              <Chip
                                label={pkg.is_active ? 'Active' : 'Hidden'}
                                variant="outlined"
                                size="small"
                                className={`text-[10px] font-bold uppercase border-none h-5 px-1 ${pkg.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}
                              />
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <IconButton
                              className="bg-gray-50 hover:bg-white border border-border p-2 rounded-lg"
                              onClick={() => {
                                setEditingPackage(pkg)
                                setPackageFormOpen(true)
                              }}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                              className="bg-red-50/50 hover:bg-red-50 border border-red-100 p-2 rounded-lg text-red-500"
                              onClick={() => handleDelete('packages', pkg.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        </div>
                      </Grid>
                    ))}
            </Grid>
          </div>
        </div>

        {/* Form Modals */}
        <AdminRoomForm
          open={roomFormOpen}
          room={editingRoom}
          onClose={(refresh) => {
            setRoomFormOpen(false)
            setEditingRoom(null)
            if (refresh) mutateRooms()
          }}
        />
        <AdminPackageForm
          open={packageFormOpen}
          packageItem={editingPackage}
          onClose={(refresh) => {
            setPackageFormOpen(false)
            setEditingPackage(null)
            if (refresh) mutatePackages()
          }}
        />
      </Container>
    </div>
  )
}
