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
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);

  const currentQuestions = content[activeTab] || [];

  return (
    <div className="max-w-6xl mx-auto mt-12 mb-8">
      {/* Title with Dancing Script font */}
      <h3
        className="text-3xl font-normal text-purple-900 mb-6"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {title}
      </h3>

      {/* Integrated Widget */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
        {/* Tabs inside the widget */}
        <div className="bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-purple-50/50 px-6 py-4 flex gap-3 border-b border-gray-100/50">
          {tabKeys.map((key) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSelectedQuestion(0);
              }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 text-white shadow-md'
                  : 'bg-white/60 text-gray-700 hover:bg-purple-50/60 shadow-sm'
              }`}
            >
              {tabs[key]}
            </button>
          ))}
        </div>

        {/* Side-by-Side Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Questions List - Left Side */}
          <div className="space-y-2">
            {currentQuestions.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedQuestion(index)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm ${
                  selectedQuestion === index
                    ? 'bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-900 font-semibold shadow-sm'
                    : 'bg-white/40 text-gray-700 hover:bg-purple-50/40 hover:text-purple-800'
                }`}
              >
                {item.question}
              </button>
            ))}
          </div>

          {/* Answer Display - Right Side */}
          <div className="bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-purple-50/50 rounded-xl p-6 min-h-[300px] flex items-start">
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {currentQuestions[selectedQuestion]?.answer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
