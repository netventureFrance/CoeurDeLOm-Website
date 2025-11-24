'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface TherapyFAQProps {
  title: string;
  tabs: {
    [key: string]: string;
  };
  content: {
    [key: string]: FAQItem[];
  };
  lang: string;
}

export default function TherapyFAQ({ title, tabs, content, lang }: TherapyFAQProps) {
  const tabKeys = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 mb-12">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-normal text-purple-900 text-center mb-12">
        {title}
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {tabKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setOpenIndex(null); // Reset open item when switching tabs
            }}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === key
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg scale-105'
                : 'bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100/60 hover:to-cyan-100/60 hover:scale-102 shadow-sm'
            }`}
          >
            {tabs[key]}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto space-y-4">
        {content[activeTab]?.map((item, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50 overflow-hidden"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-purple-50/30 hover:via-pink-50/30 hover:to-cyan-50/30 transition-colors"
            >
              <span className="text-lg font-semibold text-gray-800 pr-4">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-100/60 to-cyan-100/60 flex items-center justify-center transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index
                  ? 'max-h-[800px] opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-8 pb-6 text-gray-700 leading-relaxed whitespace-pre-line">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
