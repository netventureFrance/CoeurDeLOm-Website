'use client';

import { useEffect, useState } from 'react';
import type { NewsPromo as NewsPromoType } from '@/lib/airtable';

interface NewsPromoProps {
  initialNews: NewsPromoType[];
}

export default function NewsPromo({ initialNews }: NewsPromoProps) {
  const [news, setNews] = useState<NewsPromoType[]>(initialNews);

  if (news.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100/50 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {item.content}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
