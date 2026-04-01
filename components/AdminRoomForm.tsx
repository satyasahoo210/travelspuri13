'use client'

import { api } from '@/lib/api'
import { deTransformImageUrl } from '@/lib/utils'
import { Room } from '@/types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'

interface AdminRoomFormProps {
  room?: Room | null
  open: boolean
  onClose: (refresh?: boolean) => void
}

export default function AdminRoomForm({
  room,
  open,
  onClose,
}: AdminRoomFormProps) {
  const [loading, setLoading] = useState(false)
  const { data: hotels } = useSWR('getHotels', () => api.getHotels())

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: room
      ? {
          ...room,
          hotel_id: room.hotel_id ?? '',
          image_urls: deTransformImageUrl(room.image_urls),
        }
      : {
          hotel_id: '',
          name: '',
          description: '',
          price: 0,
          capacity: '2 Adults',
          amenities: 'AC, TV, Attached Bath',
          image_urls: '',
          check_in: '08:00 AM',
          check_out: '07:00 AM',
          rules: '',
          cancellation_policy: '48h refund',
          is_active: true,
        },
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      if (room) {
        await api.updateItem('rooms', { ...data, id: room.id })
      } else {
        await api.addItem('rooms', data)
      }
      onClose(true)
    } catch (error) {
      console.error(error)
      alert('Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          className: 'rounded-[32px] shadow-2xl border border-white/20',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="pt-8 px-10">
          <Typography variant="body1" fontWeight={900} fontSize={'h4.fontSize'}>
            {room ? 'Edit Room Entry' : 'Create New Room'}
          </Typography>
        </DialogTitle>
        <DialogContent className="px-10 py-6 pt-2!">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('hotel_id', { required: 'Hotel is required' })}
                select
                defaultValue={room?.hotel_id ?? ''}
                label="Select Hotel"
                fullWidth
                error={!!errors.hotel_id}
                sx={{ mb: 3 }}
              >
                {hotels?.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {h.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                {...register('name', { required: 'Name is required' })}
                label="Room Name"
                fullWidth
                error={!!errors.name}
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  {...register('price', { required: 'Required' })}
                  label="Price"
                  type="number"
                  fullWidth
                />
                <TextField
                  {...register('capacity')}
                  label="Capacity"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('description')}
                label="Description"
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 3 }}
              />
              <TextField
                {...register('amenities')}
                label="Amenities (Comma separated)"
                fullWidth
                sx={{ mb: 3 }}
              />
              <TextField
                {...register('image_urls')}
                label="Gallery Images (IDs/Links separated by | )"
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  {...register('check_in')}
                  label="Check-in Time"
                  fullWidth
                />
                <TextField
                  {...register('check_out')}
                  label="Check-out Time"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('cancellation_policy')}
                label="Cancellation Policy"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('is_active')}
                    defaultChecked={room ? room.is_active : true}
                  />
                }
                label={<Typography fontWeight={700}>Active Listing</Typography>}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="px-10 pb-8 pt-4 gap-3">
          <Button onClick={() => onClose()} sx={{ fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: '16px', px: 6, py: 1.5, fontWeight: 900 }}
          >
            {loading ? 'Saving...' : room ? 'Update Room' : 'Add Room'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
