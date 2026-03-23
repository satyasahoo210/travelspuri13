'use client';

import { cn } from '@/lib/utils'; // Assuming there's a cn utility, if not I'll check
import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  fill?: boolean;
  className?: string;
  aspectRatio?: string;
}

export default function ImageCarousel({
  images,
  alt,
  fill = true,
  className,
  aspectRatio = 'aspect-video',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("h-full w-full flex items-center justify-center font-medium uppercase bg-gray-50 text-gray-400", aspectRatio)}>
        No Image
      </div>
    );
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className={cn("relative group overflow-hidden w-full h-full", className)}>
      {/* Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={img}
            alt={`${alt} - Image ${index + 1}`}
            fill={fill}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <IconButton
              onClick={prevSlide}
              className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-1 rounded-full transition-all"
              size="small"
            >
              <ChevronLeft size={20} />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-1 rounded-full transition-all"
              size="small"
            >
              <ChevronRight size={20} />
            </IconButton>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(e, index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-white w-4" 
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
