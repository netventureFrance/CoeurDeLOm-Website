'use client';

import { useState } from 'react';

interface FAQAccordionProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
  lang: string;
}

export default function FAQAccordion({ questions, lang }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {questions.map((item, index) => (
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
            className={`transition-all duration-300 ease-in-out ${
              openIndex === index
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-8 pb-6 text-gray-700 leading-relaxed text-lg">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
