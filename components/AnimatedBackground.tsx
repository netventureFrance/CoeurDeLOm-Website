'use client';

import { useState, useEffect } from 'react';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Interactive animated background blobs */}
      <div
        className="absolute w-96 h-96 bg-cyan/10 rounded-full mix-blend-normal filter blur-3xl animate-blob transition-all duration-1000 ease-out pointer-events-none"
        style={{
          top: '5rem',
          left: '5rem',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      ></div>
      <div
        className="absolute w-96 h-96 bg-purple-300/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-2000 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          top: '10rem',
          right: '5rem',
          transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * 0.03}px)`
        }}
      ></div>
      <div
        className="absolute w-96 h-96 bg-pink-200/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-4000 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          bottom: '5rem',
          left: '50%',
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.02}px)`
        }}
      ></div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
