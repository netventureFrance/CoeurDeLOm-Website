'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, getLocaleLabel, type Locale } from '@/lib/i18n';

const getFlagEmoji = (locale: Locale) => {
  const flags = {
    fr: '🇫🇷',
    de: '🇩🇪',
    en: '🇬🇧',
  };
  return flags[locale];
};

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();

  const getLocalizedPath = (locale: Locale) => {
    if (!pathname) return `/${locale}`;
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
        <span className="text-lg leading-none">{getFlagEmoji(currentLang)}</span>
        <span className="text-sm font-medium uppercase">{currentLang}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute top-full right-0 mt-2 py-2 w-40 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {locales.map((locale) => (
          <Link
            key={locale}
            href={getLocalizedPath(locale)}
            className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
              locale === currentLang ? 'bg-gray-50 font-semibold text-primary' : 'text-gray-700'
            }`}
          >
            <span className="text-lg leading-none">{getFlagEmoji(locale)}</span>
            <span>{getLocaleLabel(locale)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
