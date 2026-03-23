'use client';

import { Card, CardContent, Typography, Button } from '@mui/material';
import { Package } from '@/types';
import { MessageCircle, Clock } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import Image from 'next/image';

interface PackageCardProps {
  packageItem: Package;
}

export default function PackageCard({ packageItem }: PackageCardProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I am interested in the ${packageItem.name}. Please share details.`
  )}`;

  return (
    <Card className="h-full flex flex-col brutal-card p-0 overflow-hidden">
      <div className="relative h-64 w-full border-b-4 border-black bg-gray-100">
        {packageItem.image_url ? (
          <Image
            src={packageItem.image_url}
            alt={packageItem.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center font-bold uppercase">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 font-black brutal-border z-10">
          ₹{packageItem.price}
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col p-6">
        <div className="flex items-center gap-1 text-secondary font-bold uppercase mb-2">
          <Clock size={16} strokeWidth={3} />
          <span>{packageItem.duration}</span>
        </div>
        <Typography variant="h5" className="mb-2 font-black leading-tight">
          {packageItem.name}
        </Typography>
        <Typography className="text-gray-600 mb-6 flex-grow">
          {packageItem.description}
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
          fullWidth
          className="font-black py-3 text-lg gap-2"
          onClick={() => window.open(whatsappUrl, '_blank')}
        >
          <MessageCircle size={20} />
          Enquire on WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
