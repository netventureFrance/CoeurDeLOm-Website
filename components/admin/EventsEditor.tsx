'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface Event {
  id: string;
  title: string;
  content: string;
  link: string;
  startDate: string;
  endDate: string;
  status: string;
  language: string;
}

interface EventsEditorProps {
  event: Event | null;
  onClose: () => void;
  onSave: () => void;
}

export default function EventsEditor({ event, onClose, onSave }: EventsEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: event?.title || '',
    content: event?.content || '',
    link: event?.link || '',
    startDate: event?.startDate || new Date().toISOString().split('T')[0],
    endDate: event?.endDate || '',
    status: event?.status || 'Offline',
    language: event?.language || 'FR',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = '/api/admin/events';
      const method = event ? 'PUT' : 'POST';

      const body = event
        ? { id: event.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg || 'Erreur lors de la sauvegarde');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    header: { backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', position: 'sticky' as const, top: 0, zIndex: 10 },
    headerContent: { maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    backBtn: { padding: '8px', cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' },
    title: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    saveBtn: { backgroundColor: '#7c3aed', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' },
    main: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
    section: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', marginTop: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' },
    input: { width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' as const },
    select: { padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', backgroundColor: 'white' },
    error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' },
    helpText: { fontSize: '13px', color: '#6b7280', marginTop: '6px' },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={onClose} style={styles.backBtn}>
              ← Retour
            </button>
            <h1 style={styles.title}>
              {event ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Active">Active</option>
              <option value="Offline">Offline</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              style={{ ...styles.saveBtn, opacity: isSaving ? 0.6 : 1 }}
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main style={styles.main}>
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Informations générales</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Titre</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre de l'événement"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Langue</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  style={{ ...styles.input, cursor: 'pointer' }}
                >
                  <option value="FR">Français</option>
                  <option value="DE">Deutsch</option>
                  <option value="EN">English</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Lien (optionnel)</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="/fr/contact ou https://..."
                  style={styles.input}
                />
                <p style={styles.helpText}>URL vers laquelle l'événement redirige</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Dates</h2>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Date de début</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Date de fin (optionnel)</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={styles.input}
                />
                <p style={styles.helpText}>Laissez vide pour un événement d'un jour</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Contenu</h2>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              placeholder="Description de l'événement..."
              minHeight="200px"
            />
            <p style={styles.helpText}>
              Utilisez la barre d'outils pour formater le texte
            </p>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{ ...styles.saveBtn, padding: '16px 48px', fontSize: '18px' }}
            >
              {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder l\'événement'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
