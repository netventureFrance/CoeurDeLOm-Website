'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Default fallback images (used if no carousel data from Airtable)
const defaultImages = [
  { src: '/images/office/IMG_2681.jpeg', alt: 'Espace méditation avec coussins et vue jardin' },
  { src: '/images/office/IMG_2682.jpeg', alt: 'Salle de méditation avec symbole Om' },
  { src: '/images/office/IMG_2665.jpeg', alt: 'Cercle de méditation avec bols chantants' },
  { src: '/images/office/IMG_2678.jpeg', alt: 'Espace de soin avec table de massage' },
  { src: '/images/office/IMG_2658.jpeg', alt: 'Bureau avec outils de chromothérapie' },
  { src: '/images/office/IMG_2659.jpeg', alt: 'Flacons colorés de chromothérapie' },
  { src: '/images/office/IMG_2669.jpeg', alt: 'Bol tibétain sur table de massage' },
  { src: '/images/office/IMG_2671.jpeg', alt: 'Coussin de méditation avec mandala' },
];

interface CarouselImage {
  id: string;
  order: number;
  altText: string;
  localPath: string | null;
  remoteUrl: string;
}

export default function OfficeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [zoomDirection, setZoomDirection] = useState<'in' | 'out'>('in');
  const [images, setImages] = useState<{ src: string; alt: string }[]>(defaultImages);

  // Load carousel images from manifest on mount
  useEffect(() => {
    async function loadCarouselImages() {
      try {
        const response = await fetch('/data/carousel-images.json');
        if (response.ok) {
          const data: CarouselImage[] = await response.json();
          if (data && data.length > 0) {
            // Convert to the format we need, preferring local path
            const loadedImages = data.map((img) => ({
              src: img.localPath || img.remoteUrl,
              alt: img.altText || `Image du cabinet ${img.order}`,
            }));
            setImages(loadedImages);
          }
        }
      } catch (error) {
        // Keep default images on error
        console.log('Using default carousel images');
      }
    }
    loadCarouselImages();
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    // Alternate zoom direction for variety
    setZoomDirection((prev) => prev === 'in' ? 'out' : 'in');
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomDirection((prev) => prev === 'in' ? 'out' : 'in');
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Autoplay with longer duration for Ken Burns effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStart(null);
  };

  return (
    <section className="w-full bg-gradient-to-b from-purple-50/30 to-white py-12">
      <div className="container mx-auto px-4">
        <div
          className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image Container */}
          <div className="relative aspect-[16/9] w-full bg-gray-100">
            {images.map((image, index) => {
              const isActive = index === currentIndex;
              // Determine zoom animation based on alternating pattern
              const shouldZoomIn = index % 2 === 0;

              return (
                <div
                  key={image.src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div
                    className={`absolute inset-0 ${isActive ? 'animate-ken-burns' : ''}`}
                    style={{
                      '--zoom-start': shouldZoomIn ? '1' : '1.15',
                      '--zoom-end': shouldZoomIn ? '1.15' : '1',
                      '--pan-x-start': shouldZoomIn ? '0%' : '2%',
                      '--pan-x-end': shouldZoomIn ? '2%' : '0%',
                      '--pan-y-start': shouldZoomIn ? '0%' : '1%',
                      '--pan-y-end': shouldZoomIn ? '1%' : '0%',
                    } as React.CSSProperties}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                      priority={index < 2}
                    />
                  </div>
                </div>
              );
            })}

            {/* Subtle vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-20" />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => { goToPrev(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 8000); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md shadow-lg flex items-center justify-center text-purple-900 hover:bg-white hover:scale-110 transition-all duration-300 group z-30"
            aria-label="Image précédente"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { goToNext(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 8000); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md shadow-lg flex items-center justify-center text-purple-900 hover:bg-white hover:scale-110 transition-all duration-300 group z-30"
            aria-label="Image suivante"
          >
            <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress bar indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            />
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'bg-white w-8 shadow-lg'
                    : 'bg-white/40 w-2.5 hover:bg-white/70'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(var(--zoom-start)) translate(var(--pan-x-start), var(--pan-y-start));
          }
          100% {
            transform: scale(var(--zoom-end)) translate(var(--pan-x-end), var(--pan-y-end));
          }
        }

        .animate-ken-burns {
          animation: ken-burns 6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
