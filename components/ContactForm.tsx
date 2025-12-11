'use client';

import { useState, useEffect, useMemo } from 'react';
import { type Locale, type Dictionary } from '@/lib/i18n';

// Generate random math question
function generateMathQuestion(): { num1: number; num2: number; answer: number } {
  const num1 = Math.floor(Math.random() * 8) + 2; // 2-9
  const num2 = Math.floor(Math.random() * 8) + 1; // 1-8
  return { num1, num2, answer: num1 + num2 };
}

export default function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const contact = dict.contact as any;
  const common = dict.common as any;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    gdprConsent: false,
    newsletterConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showGdprError, setShowGdprError] = useState(false);

  // Anti-bot: math question
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [showMathError, setShowMathError] = useState(false);

  // Anti-bot: time check (form load timestamp)
  const [formLoadTime] = useState(() => Date.now());
  const [showTooFastError, setShowTooFastError] = useState(false);

  // Generate math question on mount
  useEffect(() => {
    setMathQuestion(generateMathQuestion());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error states
    setShowGdprError(false);
    setShowMathError(false);
    setShowTooFastError(false);

    // Check time (minimum 1 second to fill the form)
    const timeSpent = Date.now() - formLoadTime;
    if (timeSpent < 1000) {
      setShowTooFastError(true);
      return;
    }

    // Check math answer
    if (parseInt(userAnswer, 10) !== mathQuestion.answer) {
      setShowMathError(true);
      // Generate a new question on error
      setMathQuestion(generateMathQuestion());
      setUserAnswer('');
      return;
    }

    // Check GDPR consent
    if (!formData.gdprConsent) {
      setShowGdprError(true);
      return;
    }

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
          // Anti-bot fields
          mathAnswer: parseInt(userAnswer, 10),
          expectedAnswer: mathQuestion.answer,
          formLoadTime: formLoadTime,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '', gdprConsent: false, newsletterConsent: false });
        setUserAnswer('');
        setMathQuestion(generateMathQuestion());
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
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {contact.phone}
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

      {/* Security Question (Anti-bot) */}
      <div>
        <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700 mb-2">
          {contact.securityQuestion}: {mathQuestion.num1} + {mathQuestion.num2} = ? <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="securityAnswer"
          required
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setShowMathError(false);
          }}
          className="w-24 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {showMathError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {contact.securityQuestionError}
        </div>
      )}

      {showTooFastError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {contact.tooFast}
        </div>
      )}

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
