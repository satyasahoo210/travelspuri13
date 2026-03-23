'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from '@mui/material';
import { Room } from '@/types';
import { api } from '@/lib/api';
import { useState } from 'react';

interface AdminRoomFormProps {
  room?: Room | null;
  open: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function AdminRoomForm({ room, open, onClose }: AdminRoomFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: room ? {
      ...room,
      price: room.price
    } : {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      is_active: true
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (room) {
        await api.updateItem('rooms', { ...data, id: room.id });
      } else {
        await api.addItem('rooms', data);
      }
      onClose(true);
    } catch (error) {
      console.error(error);
      alert('Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="font-black uppercase">
          {room ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 py-4">
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Room Name"
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
          <TextField
            {...register('price', { required: 'Price is required' })}
            label="Price (₹ / night)"
            type="number"
            fullWidth
            error={!!errors.price}
          />
          <TextField
            {...register('image_url')}
            label="Image URL (Google Drive)"
            fullWidth
          />
          <FormControlLabel
            control={<Switch {...register('is_active')} defaultChecked={room ? room.is_active : true} />}
            label="Active"
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => onClose()} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Room'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
