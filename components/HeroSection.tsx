'use client';

import { useState, useEffect } from 'react';

interface HeroSectionProps {
  subtitle: string;
}

export default function HeroSection({ subtitle }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 pt-24 relative overflow-hidden">
      {/* Interactive animated background blobs */}
      <div
        className="absolute w-96 h-96 bg-cyan/10 rounded-full mix-blend-normal filter blur-3xl animate-blob transition-all duration-1000 ease-out"
        style={{
          top: '5rem',
          left: '5rem',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      ></div>
      <div
        className="absolute w-96 h-96 bg-purple-300/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-2000 transition-all duration-1000 ease-out"
        style={{
          top: '10rem',
          right: '5rem',
          transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * 0.03}px)`
        }}
      ></div>
      <div
        className="absolute w-96 h-96 bg-pink-200/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-4000 transition-all duration-1000 ease-out"
        style={{
          bottom: '5rem',
          left: '50%',
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.02}px)`
        }}
      ></div>

      {/* Sparkle effects */}
      {isHovering && (
        <>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60 animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60 animation-delay-2000"></div>
        </>
      )}

      <div className="container mx-auto px-8 py-20 text-center max-w-5xl relative z-10">
        {/* Main Title with Interactive Effects */}
        <div
          className="relative inline-block mb-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Glow effect on hover */}
          {isHovering && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-300/30 to-cyan-400/30 blur-3xl animate-pulse"></div>
          )}

          {/* Main Title */}
          <h1
            className={`text-7xl md:text-8xl text-purple-900 font-normal tracking-wide transition-all duration-500 ease-out relative ${
              isHovering ? 'scale-105' : ''
            }`}
            style={{
              fontFamily: "'Dancing Script', cursive",
              transform: isHovering ? 'translateY(-5px) rotateX(5deg)' : 'translateY(0) rotateX(0)',
              textShadow: isHovering ? '0 10px 30px rgba(124, 58, 237, 0.4)' : 'none',
            }}
          >
            Cœur de l'Om
          </h1>

          {/* Decorative elements */}
          <div className={`absolute -top-6 -left-6 w-12 h-12 border-2 border-purple-200/40 rounded-full transition-all duration-500 ${
            isHovering ? 'scale-150 opacity-100 rotate-180' : 'scale-100 opacity-0'
          }`}></div>
          <div className={`absolute -bottom-6 -right-6 w-12 h-12 border-2 border-cyan-200/40 rounded-full transition-all duration-500 ${
            isHovering ? 'scale-150 opacity-100 -rotate-180' : 'scale-100 opacity-0'
          }`}></div>
        </div>

        {/* Subtitle with fade-in effect */}
        <p className="text-2xl md:text-3xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto animate-fade-in">
          {subtitle}
        </p>

        {/* Floating scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-gradient-to-b from-purple-400/60 to-cyan-400/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
