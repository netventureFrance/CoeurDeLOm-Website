'use client';

import { useRef, useCallback } from 'react';

// Bowl sounds mapped to each therapy - ordered from deep to high
// C (do) → D (ré) → E (mi) → F (fa) → G (sol) → A (la) → B (si)
const BOWL_SOUNDS = [
  '/sounds/bowl-c.mp3', // Reiki - DO (deepest)
  '/sounds/bowl-d.mp3', // Soins Vibratoires - RÉ
  '/sounds/bowl-e.mp3', // Méditation - MI
  '/sounds/bowl-f.mp3', // Chromobio-Énergie - FA
  '/sounds/bowl-g.mp3', // Tambour Chamanique - SOL
  '/sounds/bowl-a.mp3', // Massage Amma - LA
  '/sounds/bowl-b.mp3', // Feng Shui - SI (highest)
];

interface TherapyCardProps {
  title: string;
  image: string;
  rotation: string;
  index: number;
}

export default function TherapyCard({ title, image, rotation, index }: TherapyCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    // Create new audio each time for reliability
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(BOWL_SOUNDS[index] || BOWL_SOUNDS[0]);
    audio.volume = 0.4;
    audioRef.current = audio;

    audio.play().catch(() => {});
  }, [index]);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      // Quick fade out
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeOut);
          audio.pause();
          audio.volume = 0;
        }
      }, 50);
    }
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
