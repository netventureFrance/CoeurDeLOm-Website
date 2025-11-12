'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Locale, type Dictionary } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = dict.nav as any;

  const navItems = [
    { href: `/${lang}/about`, label: nav.about },
    { href: `/${lang}/therapies`, label: nav.therapies },
    { href: `/${lang}/about#pourquoi`, label: 'Pourquoi Cœur de l\'Om' },
    { href: `/${lang}/contact`, label: nav.appointment },
    { href: `/${lang}/faq`, label: nav.faq },
    { href: `/${lang}/blog`, label: nav.blog },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50">
      <nav className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <img
              src="/Coeur-de-lOm-Alpha-Kopie.png"
              alt="Coeur de l'OM"
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-3 text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400/80 hover:via-pink-300/80 hover:to-cyan-400/80 transition-all font-medium text-lg group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-50/40 via-pink-50/40 to-cyan-50/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200/50">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-purple-600 transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 space-y-2 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-cyan-50/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-100/50">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400/80 hover:via-pink-300/80 hover:to-cyan-400/80 transition-all py-4 px-4 text-lg font-medium rounded-xl hover:bg-white/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6 mt-6 border-t border-gray-200/50">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
