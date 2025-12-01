import Link from 'next/link';
import { type Locale, type Dictionary } from '@/lib/i18n';

export default function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const footer = dict.footer as any;
  const nav = dict.nav as any;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-cyan-50/80 backdrop-blur-sm border-t border-gray-100/50 py-12">
      <div className="container mx-auto px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Contact Section - Left Side */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-600/80">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@coeurdelom.fr
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.facebook.com/profile.php?id=100093266420283"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-purple-100/50 hover:bg-purple-200/60 flex items-center justify-center transition-all hover:scale-110 text-purple-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram - Add back when account is ready */}
            </div>
          </div>

          {/* Copyright - Right Side */}
          <div className="text-center md:text-right">
            <p className="text-gray-600 text-sm mb-4">
              {footer.copyright.replace('2025', currentYear.toString())}
            </p>
            <div className="flex gap-6 text-sm justify-center md:justify-end">
              <Link href={`/${lang}/legal`} className="text-gray-600 hover:text-purple-600 transition-colors">
                {footer.legal}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
