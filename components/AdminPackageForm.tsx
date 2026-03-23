'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from '@mui/material';
import { Package } from '@/types';
import { api } from '@/lib/api';
import { useState } from 'react';

interface AdminPackageFormProps {
  packageItem?: Package | null;
  open: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function AdminPackageForm({ packageItem, open, onClose }: AdminPackageFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: packageItem ? {
      ...packageItem,
      price: packageItem.price
    } : {
      name: '',
      description: '',
      price: 0,
      duration: '',
      image_url: '',
      is_active: true
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (packageItem) {
        await api.updateItem('packages', { ...data, id: packageItem.id });
      } else {
        await api.addItem('packages', data);
      }
      onClose(true);
    } catch (error) {
      console.error(error);
      alert('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="font-black uppercase">
          {packageItem ? 'Edit Package' : 'Add New Package'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 py-4">
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Package Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message as string}
            className="mt-2"
          />
          <TextField
            {...register('description')}
            label="Description"
            fullWidth
            multiline
            rows={3}
          />
          <div className="flex gap-4">
            <TextField
              {...register('price', { required: 'Price is required' })}
              label="Price (₹)"
              type="number"
              fullWidth
              error={!!errors.price}
            />
            <TextField
              {...register('duration', { required: 'Duration is required' })}
              label="Duration (e.g. 3D/2N)"
              fullWidth
              error={!!errors.duration}
            />
          </div>
          <TextField
            {...register('image_url')}
            label="Image URL (Google Drive)"
            fullWidth
          />
          <FormControlLabel
            control={<Switch {...register('is_active')} defaultChecked={packageItem ? packageItem.is_active : true} />}
            label="Active"
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => onClose()} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Package'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
