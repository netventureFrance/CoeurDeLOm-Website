import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Coeur-de-lOm-Alpha-Kopie.png"
            alt="Cœur de l'OM"
            width={150}
            height={150}
            className="opacity-90"
          />
        </div>

        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* Messages in 3 languages */}
        <div className="space-y-4 mb-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <p className="text-xl text-gray-700">
              <span className="font-semibold text-purple-700">FR</span> — Cette page n'existe pas ou a été déplacée.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <p className="text-xl text-gray-700">
              <span className="font-semibold text-pink-600">DE</span> — Diese Seite existiert nicht oder wurde verschoben.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <p className="text-xl text-gray-700">
              <span className="font-semibold text-cyan-600">EN</span> — This page doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/fr"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Accueil
          </Link>
          <Link
            href="/de"
            className="px-6 py-3 bg-white text-purple-700 border-2 border-purple-200 rounded-full font-semibold hover:border-purple-400 transition-colors"
          >
            Startseite
          </Link>
          <Link
            href="/en"
            className="px-6 py-3 bg-white text-purple-700 border-2 border-purple-200 rounded-full font-semibold hover:border-purple-400 transition-colors"
          >
            Home
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-2">
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
}
