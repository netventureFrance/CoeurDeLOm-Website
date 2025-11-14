'use client';

import { useState } from 'react';
import { type Locale, type Dictionary } from '@/lib/i18n';

export default function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const contact = dict.contact as any;
  const common = dict.common as any;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    gdprConsent: false,
    newsletterConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showGdprError, setShowGdprError] = useState(false);

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: lang,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', gdprConsent: false, newsletterConsent: false });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }

    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          {contact.name}
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
          {contact.email}
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
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {contact.message}
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
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
          {contact.gdprConsent} <span className="text-red-500">*</span>
        </label>
      </div>

      {showGdprError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {contact.gdprRequired}
        </div>
      )}

      {/* Newsletter Consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="newsletterConsent"
          checked={formData.newsletterConsent}
          onChange={(e) => setFormData({ ...formData, newsletterConsent: e.target.checked })}
          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="newsletterConsent" className="text-sm text-gray-700">
          {contact.newsletterConsent}
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? common.loading : contact.send}
      </button>

      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {contact.success}
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {contact.error}
        </div>
      )}
    </form>
  );
}
