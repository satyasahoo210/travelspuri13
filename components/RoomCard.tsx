'use client';

import { Card, CardContent, Typography, Button } from '@mui/material';
import { Room } from '@/types';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import Image from 'next/image';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I want to book ${room.name}. Please assist.`
  )}`;

  return (
    <Card className="h-full flex flex-col brutal-card p-0 overflow-hidden">
      <div className="relative h-64 w-full border-b-4 border-black bg-gray-100">
        {room.image_url ? (
          <Image
            src={room.image_url}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center font-bold uppercase">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 bg-primary px-3 py-1 font-black brutal-border z-10">
          ₹{room.price} / night
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col p-6">
        <Typography variant="h5" className="mb-2 font-black leading-tight">
          {room.name}
        </Typography>
        <Typography className="text-gray-600 mb-6 flex-grow">
          {room.description}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          className="font-black py-3 text-lg gap-2"
          onClick={() => window.open(whatsappUrl, '_blank')}
        >
          <MessageCircle size={20} />
          Book via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
