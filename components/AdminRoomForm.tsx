'use client'

import { api } from '@/lib/api'
import { Room } from '@/types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: room
      ? {
          ...room,
          image_url: api.deTransformImageUrl(room.image_url),
          price: room.price,
        }
      : {
          name: '',
          description: '',
          price: 0,
          image_url: '',
          is_active: true,
        },
  })

  const onSubmit = async (
    data: Pick<Room, 'name' | 'description' | 'price' | 'is_active'> & {
      image_url: string
    },
  ) => {
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
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: 'rounded-2xl shadow-soft-lg' }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="pt-8 px-8 flex justify-between items-center">
          <Typography variant="h5" className="font-bold tracking-tight">
            {room ? 'Edit Room Entry' : 'Create New Room'}
          </Typography>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-6 py-6 px-8">
          <Typography variant="body2" className="text-secondary -mb-2">
            Enter the details of the room for the public listing.
          </Typography>

          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Room Name"
            placeholder="e.g. Deluxe Sea View Suite"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message as string}
            className="mt-2"
          />
          <TextField
            {...register('description')}
            label="Description"
            placeholder="Detailed description of the room and amenities..."
            fullWidth
            multiline
            rows={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextField
              {...register('price', { required: 'Price is required' })}
              label="Price per Night (₹)"
              type="number"
              fullWidth
              error={!!errors.price}
            />
            <Box className="flex items-center px-3 border border-border rounded-lg bg-gray-50/50">
              <FormControlLabel
                control={
                  <Switch
                    {...register('is_active')}
                    defaultChecked={room ? room.is_active : true}
                  />
                }
                label={
                  <Typography className="font-medium text-sm">
                    Visible to Public
                  </Typography>
                }
                className="ml-0 w-full justify-between flex-row-reverse"
              />
            </Box>
          </div>
          <TextField
            {...register('image_url')}
            label="Image URL (Google Drive ID or Link)"
            placeholder="PASTE_DRIVE_ID_HERE"
            fullWidth
          />
        </DialogContent>
        <DialogActions className="p-8 bg-gray-50/50 border-t border-border flex gap-3">
          <Button
            onClick={() => onClose()}
            className="rounded-full px-6 font-bold text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="rounded-full px-8 py-2.5 font-bold shadow-soft"
          >
            {loading ? 'Processing...' : room ? 'Update Room' : 'Add Room'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
