'use client';

import { useState } from 'react';

interface InteractiveTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function InteractiveTitle({ children, className = '' }: InteractiveTitleProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Glow effect on hover */}
      {isHovering && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-300/30 to-cyan-400/30 blur-3xl animate-pulse"></div>
      )}

      {/* Sparkle effects */}
      {isHovering && (
        <>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60 animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60 animation-delay-2000"></div>
        </>
      )}

      {/* Title with transition */}
      <div
        className={`relative transition-all duration-500 ease-out ${
          isHovering ? 'scale-105' : ''
        }`}
        style={{
          fontFamily: "'Dancing Script', cursive",
          transform: isHovering ? 'translateY(-5px)' : 'translateY(0)',
          textShadow: isHovering ? '0 10px 30px rgba(124, 58, 237, 0.4)' : 'none',
        }}
      >
        {children}
      </div>

      {/* Decorative elements */}
      <div className={`absolute -top-6 -left-6 w-12 h-12 border-2 border-purple-200/40 rounded-full transition-all duration-500 ${
        isHovering ? 'scale-150 opacity-100 rotate-180' : 'scale-100 opacity-0'
      }`}></div>
      <div className={`absolute -bottom-6 -right-6 w-12 h-12 border-2 border-cyan-200/40 rounded-full transition-all duration-500 ${
        isHovering ? 'scale-150 opacity-100 -rotate-180' : 'scale-100 opacity-0'
      }`}></div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
