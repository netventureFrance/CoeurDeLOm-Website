'use client';

import { useState } from 'react';

type Language = 'FR' | 'DE' | 'EN';

const languageLabels: Record<Language, { name: string; flag: string; placeholder: string; button: string; analyzing: string }> = {
  FR: {
    name: 'Français',
    flag: '🇫🇷',
    placeholder: 'Décrivez votre rêve en détail... Que s\'est-il passé ? Quels éléments, personnes ou symboles avez-vous vus ?',
    button: 'Interpréter le rêve',
    analyzing: 'Analyse en cours...',
  },
  DE: {
    name: 'Deutsch',
    flag: '🇩🇪',
    placeholder: 'Beschreiben Sie Ihren Traum im Detail... Was ist passiert? Welche Elemente, Personen oder Symbole haben Sie gesehen?',
    button: 'Traum deuten',
    analyzing: 'Analyse läuft...',
  },
  EN: {
    name: 'English',
    flag: '🇬🇧',
    placeholder: 'Describe your dream in detail... What happened? What elements, people, or symbols did you see?',
    button: 'Interpret Dream',
    analyzing: 'Analyzing...',
  },
};

export default function DreamInterpreter() {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>('FR');

  async function handleInterpret() {
    if (!dreamText.trim()) {
      setError(language === 'FR' ? 'Veuillez décrire votre rêve' : language === 'DE' ? 'Bitte beschreiben Sie Ihren Traum' : 'Please describe your dream');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setInterpretation('');

    try {
      const response = await fetch('/api/admin/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: dreamText, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze dream');
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err) {
      setError(language === 'FR' ? 'Erreur lors de l\'analyse' : language === 'DE' ? 'Fehler bei der Analyse' : 'Error during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleClear() {
    setDreamText('');
    setInterpretation('');
    setError('');
  }

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' },
    subtitle: { color: '#6b7280', fontSize: '14px', marginBottom: '24px' },
    languageTabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
    languageTab: { padding: '10px 20px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
    languageTabActive: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff', color: '#7c3aed' },
    textarea: { width: '100%', minHeight: '200px', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px', fontFamily: 'inherit', resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const },
    buttonRow: { display: 'flex', gap: '12px', marginTop: '16px' },
    interpretBtn: { backgroundColor: '#7c3aed', color: 'white', padding: '14px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    interpretBtnDisabled: { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
    clearBtn: { backgroundColor: '#f3f4f6', color: '#6b7280', padding: '14px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '16px' },
    error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
    resultCard: { backgroundColor: '#f5f3ff', borderRadius: '12px', padding: '24px', marginTop: '24px', border: '2px solid #7c3aed' },
    resultTitle: { fontSize: '18px', fontWeight: '600', color: '#7c3aed', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    spinner: { width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' },
  };

  // CSS for HTML interpretation content
  const interpretationStyles = `
    .dream-interpretation h3 { color: #7c3aed; margin: 20px 0 10px 0; font-size: 17px; font-weight: 600; }
    .dream-interpretation h3:first-child { margin-top: 0; }
    .dream-interpretation p { color: #1f2937; font-size: 15px; line-height: 1.7; margin: 0 0 12px 0; }
    .dream-interpretation ul { color: #1f2937; font-size: 15px; line-height: 1.7; margin: 10px 0; padding-left: 24px; }
    .dream-interpretation li { margin-bottom: 8px; }
    .dream-interpretation strong { color: #5b21b6; }
  `;

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } ${interpretationStyles}`}</style>

      <div style={styles.card}>
        <h2 style={styles.title}>
          <span style={{ fontSize: '32px' }}>🌙</span>
          {language === 'FR' ? 'Interprétation des Rêves' : language === 'DE' ? 'Traumdeutung' : 'Dream Interpretation'}
        </h2>
        <p style={styles.subtitle}>
          {language === 'FR'
            ? 'Décrivez votre rêve et recevez une interprétation symbolique et spirituelle.'
            : language === 'DE'
            ? 'Beschreiben Sie Ihren Traum und erhalten Sie eine symbolische und spirituelle Interpretation.'
            : 'Describe your dream and receive a symbolic and spiritual interpretation.'}
        </p>

        {/* Language Selection */}
        <div style={styles.languageTabs}>
          {(['FR', 'DE', 'EN'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                ...styles.languageTab,
                ...(language === lang ? styles.languageTabActive : {}),
              }}
            >
              <span>{languageLabels[lang].flag}</span>
              {languageLabels[lang].name}
            </button>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <textarea
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          placeholder={languageLabels[language].placeholder}
          style={styles.textarea}
          disabled={isAnalyzing}
        />

        <div style={styles.buttonRow}>
          <button
            onClick={handleInterpret}
            disabled={isAnalyzing || !dreamText.trim()}
            style={{
              ...styles.interpretBtn,
              ...(isAnalyzing || !dreamText.trim() ? styles.interpretBtnDisabled : {}),
            }}
          >
            {isAnalyzing ? (
              <>
                <span style={styles.spinner}></span>
                {languageLabels[language].analyzing}
              </>
            ) : (
              <>
                <span>✨</span>
                {languageLabels[language].button}
              </>
            )}
          </button>
          {(dreamText || interpretation) && (
            <button onClick={handleClear} style={styles.clearBtn}>
              {language === 'FR' ? 'Effacer' : language === 'DE' ? 'Löschen' : 'Clear'}
            </button>
          )}
        </div>

        {interpretation && (
          <div style={styles.resultCard}>
            <h3 style={styles.resultTitle}>
              <span>🔮</span>
              {language === 'FR' ? 'Interprétation' : language === 'DE' ? 'Deutung' : 'Interpretation'}
            </h3>
            <div
              className="dream-interpretation"
              dangerouslySetInnerHTML={{ __html: interpretation }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
