'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

// Bowl sounds mapped to each therapy (C, D, E, F, G, A, B for 7 therapies)
const BOWL_SOUNDS = [
  '/sounds/bowl-c.mp3', // Reiki
  '/sounds/bowl-d.mp3', // Soins Vibratoires
  '/sounds/bowl-e.mp3', // Méditation
  '/sounds/bowl-f.mp3', // Chromobio-Énergie
  '/sounds/bowl-g.mp3', // Tambour Chamanique
  '/sounds/bowl-a.mp3', // Massage Amma
  '/sounds/bowl-b.mp3', // Feng Shui
];

interface TherapyCardProps {
  title: string;
  image: string;
  rotation: string;
  index: number;
}

export default function TherapyCard({ title, image, rotation, index }: TherapyCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // Preload audio on mount
  useEffect(() => {
    const audio = new Audio(BOWL_SOUNDS[index] || BOWL_SOUNDS[0]);
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;

    // Enable audio after any user interaction on the page
    const enableAudio = () => {
      setIsAudioEnabled(true);
      // Play and immediately pause to unlock audio
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('scroll', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('scroll', enableAudio);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [index]);

  const playSound = useCallback(() => {
    if (!audioRef.current) return;

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const audio = audioRef.current;

    // Reset and play
    audio.currentTime = 0;
    audio.volume = 0;
    audio.play().catch(() => {
      // Autoplay might be blocked
    });

    // Fade in
    let volume = 0;
    fadeIntervalRef.current = setInterval(() => {
      if (audio && volume < 0.4) {
        volume += 0.05;
        audio.volume = Math.min(volume, 0.4);
      } else if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }, 50);
  }, []);

  const stopSound = useCallback(() => {
    if (!audioRef.current) return;

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    // Fade out
    const audio = audioRef.current;
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.pause();
        audio.volume = 0;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }
    }, 50);
  }, []);

  return (
    <div
      className={`${rotation} hover:rotate-0 hover:scale-110 transition-all duration-500 group`}
      onMouseEnter={playSound}
      onMouseLeave={stopSound}
    >
      <a
        href={`#therapy-${index}`}
        className="cursor-pointer block"
      >
        <div
          className="relative w-full aspect-square shadow-lg group-hover:shadow-2xl bg-white"
          style={{
            maskImage: 'radial-gradient(circle at center, black 50%, transparent 50%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 50%)',
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat'
          } as React.CSSProperties}
        >
          {/* Image - Circular masked */}
          {image && (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
            />
          )}

          {/* Title overlay - Only visible on hover */}
          <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-12">
            <h3 className="text-[9px] md:text-[10px] font-bold text-purple-900 text-center leading-[1.2] max-w-[65%]">
              {title}
            </h3>
          </div>
        </div>
      </a>
    </div>
  );
}
