'use client'

import { api } from '@/lib/api'
import { Package } from '@/types'
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

interface AdminPackageFormProps {
  packageItem?: Package | null
  open: boolean
  onClose: (refresh?: boolean) => void
}

export default function AdminPackageForm({
  packageItem,
  open,
  onClose,
}: AdminPackageFormProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: packageItem
      ? {
          ...packageItem,
          image_url: api.deTransformImageUrl(packageItem.image_url),
          price: packageItem.price,
        }
      : {
          name: '',
          description: '',
          price: 0,
          duration: '',
          image_url: '',
          is_active: true,
        },
  })

  const onSubmit = async (
    data: Pick<Package, 'name' | 'description' | 'price' | 'is_active'> & {
      image_url: string
    },
  ) => {
    setLoading(true)
    try {
      if (packageItem) {
        await api.updateItem('packages', { ...data, id: packageItem.id })
      } else {
        await api.addItem('packages', data)
      }
      onClose(true)
    } catch (error) {
      console.error(error)
      alert('Failed to save package')
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
            {packageItem ? 'Edit Package' : 'Create New Package'}
          </Typography>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-6 py-6 px-8">
          <Typography variant="body2" className="text-secondary -mb-2">
            Define the itinerary and pricing for this travel package.
          </Typography>

          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Package Title"
            placeholder="e.g. Golden Triangle Tour (Puri-Konark-Chilika)"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message as string}
            className="mt-2"
          />
          <TextField
            {...register('description')}
            label="Itinerary Highlights"
            placeholder="Describe the key attractions and journey..."
            fullWidth
            multiline
            rows={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextField
              {...register('price', { required: 'Price is required' })}
              label="Standard Price (₹)"
              type="number"
              fullWidth
              error={!!errors.price}
            />
            <TextField
              {...register('duration', { required: 'Duration is required' })}
              label="Duration"
              placeholder="e.g. 3 Days / 2 Nights"
              fullWidth
              error={!!errors.duration}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <TextField
              {...register('image_url')}
              label="Image URL"
              placeholder="Google Drive Link or ID"
              fullWidth
            />
            <Box className="flex items-center px-3 border border-border rounded-lg bg-gray-50/50 h-[56px]">
              <FormControlLabel
                control={
                  <Switch
                    {...register('is_active')}
                    defaultChecked={packageItem ? packageItem.is_active : true}
                  />
                }
                label={
                  <Typography className="font-medium text-sm">
                    Active Listing
                  </Typography>
                }
                className="ml-0 w-full justify-between flex-row-reverse"
              />
            </Box>
          </div>
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
            {loading
              ? 'Processing...'
              : packageItem
                ? 'Update Package'
                : 'Add Package'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
