'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n';
import ChromoBioPreTestForm from './ChromoBioPreTestForm';
import ChromobioTest from './ChromobioTest';
import AnimatedBackground from './AnimatedBackground';
import InteractiveTitle from './InteractiveTitle';

interface ChromobioTestWrapperProps {
  lang: Locale;
  preTestDict: {
    title: string;
    description: string;
    description2: string;
    formTitle: string;
    name: string;
    email: string;
    phone: string;
    gdprConsent: string;
    gdprRequired: string;
    submit: string;
    loading: string;
    error: string;
    restricted: string;
    restrictedDays: string;
    restrictedInfo: string;
  };
  testDict: {
    title: string;
    instructions: string;
    selectCircles: string;
    row: string;
    results: string;
    restart: string;
    remaining: string;
    summary: string;
    bookSession: string;
    shortInterpretation: string;
    detailedInterpretation: string;
    detailedNote: string;
    interpretation: {
      excess: string;
      shortage: string;
      balanced: string;
    };
  };
}

export default function ChromobioTestWrapper({
  lang,
  preTestDict,
  testDict,
}: ChromobioTestWrapperProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handlePreTestSuccess = (email: string) => {
    setUserEmail(email);
    setHasAccess(true);
    // Scroll to top when test starts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show the actual test if user has access
  if (hasAccess) {
    return <ChromobioTest dictionary={testDict} lang={lang} userEmail={userEmail} />;
  }

  // Show the pre-test form
  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <InteractiveTitle className="text-4xl md:text-5xl font-normal text-purple-900">
              {preTestDict.title}
            </InteractiveTitle>
          </div>
          <div className="h-1 w-24 bg-gradient-rainbow mx-auto mb-8"></div>
        </div>

        {/* Pre-test form */}
        <ChromoBioPreTestForm
          lang={lang}
          dictionary={preTestDict}
          onSuccess={handlePreTestSuccess}
        />
      </div>
    </main>
  );
}
