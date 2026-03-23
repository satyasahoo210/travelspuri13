'use client';

import AdminPackageForm from '@/components/AdminPackageForm';
import AdminRoomForm from '@/components/AdminRoomForm';
import { api, fetcher } from '@/lib/api';
import { API_URL } from '@/lib/constants';
import { Package, Room } from '@/types';
import { Box, Button, Chip, Container, Grid, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Edit2, Lock, LogOut, Plus, RefreshCcw, Trash2, Unlock } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [packageFormOpen, setPackageFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const { data: roomsData, mutate: mutateRooms } = useSWR(isAuthenticated ? `${API_URL}?action=getRooms` : null, fetcher);
  const { data: packagesData, mutate: mutatePackages } = useSWR(isAuthenticated ? `${API_URL}?action=getPackages` : null, fetcher);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password as requested
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid password');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const handleDelete = async (type: 'rooms' | 'packages', id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteItem(type, id);
        type === 'rooms' ? mutateRooms() : mutatePackages();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xs" className="py-32">
        <div className="brutal-card p-10 bg-primary">
          <div className="flex justify-center mb-6">
            <Lock size={48} strokeWidth={3} />
          </div>
          <Typography variant="h4" className="text-center font-black uppercase mb-8">Admin Login</Typography>
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
              color="secondary"
              fullWidth
              className="py-4 font-black text-lg"
            >
              Unlock Dashboard
            </Button>
          </form>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <Container maxWidth="lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Unlock size={24} className="text-green-600" />
              <Typography variant="h6" className="font-bold uppercase tracking-widest text-gray-500">Admin Dashboard</Typography>
            </div>
            <Typography variant="h2" className="font-black uppercase">Travels Puri 13</Typography>
          </div>
          <div className="flex gap-4">
             <Button 
                variant="outlined" 
                onClick={() => { mutateRooms(); mutatePackages(); }}
                className="font-bold bg-white"
                startIcon={<RefreshCcw size={18} />}
             >
                Refresh
             </Button>
             <Button 
                variant="contained" 
                color="inherit" 
                onClick={handleLogout}
                className="font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                startIcon={<LogOut size={18} />}
             >
                Logout
             </Button>
          </div>
        </div>

        <div className="bg-white brutal-border mb-8 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            className="border-b-4 border-black bg-primary"
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <Tab 
                label="Rooms" 
                sx={{ 
                  '&.Mui-selected': { bgcolor: 'white', color: 'black' },
                  color: 'black',
                  opacity: activeTab === 0 ? 1 : 0.7,
                  fontFamily: 'inherit',
                  fontWeight: 900,
                  fontSize: '1.125rem',
                  py: 3
                }}
            />
            <Tab 
                label="Packages" 
                sx={{ 
                  '&.Mui-selected': { bgcolor: 'white', color: 'black' },
                  color: 'black',
                  opacity: activeTab === 1 ? 1 : 0.7,
                  fontFamily: 'inherit',
                  fontWeight: 900,
                  fontSize: '1.125rem',
                  py: 3
                }}
            />
          </Tabs>

          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <Typography variant="h4" className="font-black uppercase">
                Manage {activeTab === 0 ? 'Rooms' : 'Packages'}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Plus size={20} strokeWidth={3} />}
                className="font-black px-6 py-3"
                onClick={() => activeTab === 0 ? setRoomFormOpen(true) : setPackageFormOpen(true)}
              >
                Add New
              </Button>
            </div>

            <Grid container spacing={4}>
              {activeTab === 0 ? (
                roomsData?.data?.map((room: Room) => ({
                  ...room,
                  image_url: api.transformImageUrl(room.image_url),
                }))?.map((room: Room) => (
                  <Grid key={room.id} size={{ xs: 12, md: 6 }}>
                    <div className="brutal-card flex gap-4 items-center">
                      <div className="w-24 h-24 brutal-border bg-gray-200 flex-shrink-0">
                        {room.image_url && <Image width={100} height={100} src={room.image_url} alt={room.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-grow">
                        <Typography variant="h6" className="font-black mb-1">{room.name}</Typography>
                        <div className="flex gap-2 mb-2">
                           <Typography className="font-bold">₹{room.price}</Typography>
                           <Chip 
                              label={room.is_active ? "Active" : "Inactive"} 
                              size="small" 
                              color={room.is_active ? "success" : "default"}
                              className="font-bold uppercase text-[10px] brutal-border bg-white"
                           />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <IconButton 
                            className="brutal-border bg-yellow-400 p-2" 
                            onClick={() => { setEditingRoom(room); setRoomFormOpen(true); }}
                        >
                          <Edit2 size={18} />
                        </IconButton>
                        <IconButton 
                            className="brutal-border bg-red-400 p-2 text-white" 
                            onClick={() => handleDelete('rooms', room.id)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </div>
                  </Grid>
                ))
              ) : (
                packagesData?.data?.map((pkg: Package) => ({
                  ...pkg,
                  image_url: api.transformImageUrl(pkg.image_url),
                }))?.map((pkg: Package) => (
                  <Grid key={pkg.id} size={{ xs: 12, md: 6 }}>
                    <div className="brutal-card flex gap-4 items-center">
                      <div className="w-24 h-24 brutal-border bg-gray-200 flex-shrink-0">
                        {pkg.image_url && <Image width={100} height={100} src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-grow">
                        <Typography variant="h6" className="font-black mb-1">{pkg.name}</Typography>
                        <div className="flex gap-2 mb-2">
                           <Typography className="font-bold">₹{pkg.price}</Typography>
                           <Chip 
                              label={pkg.is_active ? "Active" : "Inactive"} 
                              size="small" 
                              color={pkg.is_active ? "success" : "default"}
                              className="font-bold uppercase text-[10px] brutal-border bg-white"
                           />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <IconButton 
                            className="brutal-border bg-yellow-400 p-2" 
                            onClick={() => { setEditingPackage(pkg); setPackageFormOpen(true); }}
                        >
                          <Edit2 size={18} />
                        </IconButton>
                        <IconButton 
                            className="brutal-border bg-red-400 p-2 text-white" 
                            onClick={() => handleDelete('packages', pkg.id)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </div>
                  </Grid>
                ))
              )}
            </Grid>
          </div>
        </div>

        {/* Form Modals */}
        <AdminRoomForm
          open={roomFormOpen}
          room={editingRoom}
          onClose={(refresh) => {
            setRoomFormOpen(false);
            setEditingRoom(null);
            if (refresh) mutateRooms();
          }}
        />
        <AdminPackageForm
          open={packageFormOpen}
          packageItem={editingPackage}
          onClose={(refresh) => {
            setPackageFormOpen(false);
            setEditingPackage(null);
            if (refresh) mutatePackages();
          }}
        />
      </Container>
    </div>
  );
}
