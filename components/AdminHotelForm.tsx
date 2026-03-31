'use client'

import { api } from '@/lib/api'
import { deTransformImageUrl } from '@/lib/utils'
import { Hotel } from '@/types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface AdminHotelFormProps {
  hotel?: Hotel | null
  open: boolean
  onClose: (refresh?: boolean) => void
}

export default function AdminHotelForm({
  hotel,
  open,
  onClose,
}: AdminHotelFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: hotel
      ? {
          ...hotel,
          image_urls: deTransformImageUrl(hotel.image_urls),
        }
      : {
          name: '',
          location: 'Puri',
          area: '',
          rating: 4.5,
          starting_price: 1500,
          amenities: 'Free WiFi, AC, Geyser, TV',
          cover_image: '',
          image_urls: '',
          is_sponsored: false,
          is_active: true,
        },
  })

  console.log(hotel)

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      if (hotel) {
        await api.updateItem('hotels', { ...data, id: hotel.id })
      } else {
        await api.addItem('hotels', data)
      }
      onClose(true)
    } catch (error) {
      console.error(error)
      alert('Failed to save hotel')
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
          <Typography variant="h4" fontWeight={900}>
            {hotel ? 'Edit Hotel' : 'Add New Hotel'}
          </Typography>
        </DialogTitle>
        <DialogContent className="px-10 py-6">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('name', { required: 'Name is required' })}
                label="Hotel Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message as string}
                sx={{ mb: 3 }}
              />
              <TextField
                {...register('area', { required: 'Area is required' })}
                label="Area (e.g. Sea Beach, Swargadwar)"
                fullWidth
                error={!!errors.area}
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  {...register('rating')}
                  label="Rating (0-5)"
                  type="number"
                  inputProps={{ step: 0.1, min: 0, max: 5 }}
                  fullWidth
                />
                <TextField
                  {...register('starting_price', { required: 'Required' })}
                  label="Starting Price"
                  type="number"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('amenities')}
                label="Amenities (Comma separated)"
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 3 }}
              />
              <TextField
                {...register('cover_image')}
                label="Cover Image (Drive ID/Link)"
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
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  p: 2,
                  bgcolor: 'gray.50',
                  borderRadius: '16px',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      {...register('is_sponsored')}
                      defaultChecked={hotel?.is_sponsored}
                    />
                  }
                  label={
                    <Typography fontWeight={700}>Sponsored Hotel</Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...register('is_active')}
                      defaultChecked={hotel ? hotel.is_active : true}
                    />
                  }
                  label={
                    <Typography fontWeight={700}>Active Listing</Typography>
                  }
                />
              </Box>
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
            {loading ? 'Saving...' : hotel ? 'Update Hotel' : 'Create Hotel'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
