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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <img
              src="/Coeurdelom.png"
              alt="Coeur de l'OM"
              className="h-14 w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors font-normal text-base"
              >
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
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
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover:text-primary transition-colors py-3 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
