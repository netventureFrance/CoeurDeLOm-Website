'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n';

interface ChromoBioPreTestFormProps {
  lang: Locale;
  dictionary: {
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
  onSuccess: () => void;
}

export default function ChromoBioPreTestForm({
  lang,
  dictionary,
  onSuccess,
}: ChromoBioPreTestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gdprConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'restricted'>('idle');
  const [showGdprError, setShowGdprError] = useState(false);
  const [restrictedDays, setRestrictedDays] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check GDPR consent
    if (!formData.gdprConsent) {
      setShowGdprError(true);
      return;
    }

    setShowGdprError(false);
    setStatus('loading');

    try {
      const response = await fetch('/api/chromobio-pretest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: lang,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else if (response.status === 403 && data.error === 'test_restricted') {
        setStatus('restricted');
        setRestrictedDays(data.daysRemaining);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Description */}
      <div className="mb-10 space-y-4">
        <p className="text-gray-700 leading-relaxed">{dictionary.description}</p>
        <p className="text-gray-700 leading-relaxed">{dictionary.description2}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">{dictionary.formTitle}</h2>

        {status === 'restricted' ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium mb-2">{dictionary.restricted}</p>
              {restrictedDays !== null && restrictedDays > 0 && (
                <p className="text-amber-700">
                  {dictionary.restrictedDays.replace('{days}', String(restrictedDays))}
                </p>
              )}
            </div>
            <p className="text-gray-600 text-sm">{dictionary.restrictedInfo}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary.phone}
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* GDPR Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="gdprConsent"
                checked={formData.gdprConsent}
                onChange={(e) => {
                  setFormData({ ...formData, gdprConsent: e.target.checked });
                  setShowGdprError(false);
                }}
                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="gdprConsent" className="text-sm text-gray-700">
                {dictionary.gdprConsent} <span className="text-red-500">*</span>
              </label>
            </div>

            {showGdprError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {dictionary.gdprRequired}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? dictionary.loading : dictionary.submit}
            </button>

            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {dictionary.error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
