'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = '918249548564', 
  message = 'Hi, I would like to enquire about your services.' 
}: WhatsAppButtonProps) {
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-soft-lg hover:shadow-soft-xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:animate-pulse" />
    </button>
  );
}
