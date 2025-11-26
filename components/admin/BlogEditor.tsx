'use client';

import { useState } from 'react';

interface BlogPost {
  id: string;
  slug: string;
  titleFR: string;
  titleDE: string;
  titleEN: string;
  excerptFR: string;
  excerptDE: string;
  excerptEN: string;
  contentFR: string;
  contentDE: string;
  contentEN: string;
  category: string;
  tags: string;
  author: string;
  publishedDate: string;
  status: string;
  image: string | null;
  audioFile: string | null;
  spotifyUrl: string | null;
}

interface BlogEditorProps {
  post: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}

type Language = 'FR' | 'DE' | 'EN';

export default function BlogEditor({ post, onClose, onSave }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<Language>('FR');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slug: post?.slug || '',
    titleFR: post?.titleFR || '',
    titleDE: post?.titleDE || '',
    titleEN: post?.titleEN || '',
    excerptFR: post?.excerptFR || '',
    excerptDE: post?.excerptDE || '',
    excerptEN: post?.excerptEN || '',
    contentFR: post?.contentFR || '',
    contentDE: post?.contentDE || '',
    contentEN: post?.contentEN || '',
    category: post?.category || '',
    tags: post?.tags || '',
    author: post?.author || 'Valerie Heymann',
    publishedDate: post?.publishedDate || new Date().toISOString().split('T')[0],
    status: post?.status || 'Draft',
    imageUrl: post?.image || '',
    spotifyUrl: post?.spotifyUrl || '',
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
      const url = '/api/admin/blog';
      const method = post ? 'PUT' : 'POST';

      const body = post
        ? { id: post.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }

  const tabs: { key: Language; label: string; flag: string }[] = [
    { key: 'FR', label: 'Français', flag: '🇫🇷' },
    { key: 'DE', label: 'Deutsch', flag: '🇩🇪' },
    { key: 'EN', label: 'English', flag: '🇬🇧' },
  ];

  // Inline styles for reliability
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
    textarea: { width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' as const, resize: 'vertical' as const, fontFamily: 'inherit' },
    select: { padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', backgroundColor: 'white' },
    tabs: { display: 'flex', borderBottom: '1px solid #e5e7eb' },
    tab: { padding: '16px 24px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { borderBottom: '2px solid #7c3aed', color: '#7c3aed' },
    tabInactive: { color: '#6b7280' },
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
              {post ? 'Modifier l\'article' : 'Nouvel article'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Draft">Brouillon</option>
              <option value="Published">Publié</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              style={{ ...styles.saveBtn, opacity: isSaving ? 0.6 : 1 }}
            >
              {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main style={styles.main}>
        {error && (
          <div style={styles.error}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📝 Informations générales</h2>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="mon-article"
                  style={styles.input}
                />
                <p style={styles.helpText}>Laissez vide pour générer automatiquement</p>
              </div>
              <div>
                <label style={styles.label}>Auteur</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Catégorie</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Bien-être, Naturopathie..."
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Date de publication</label>
                <input
                  type="date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🖼️ Image de couverture</h2>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{ width: '200px', height: '130px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <label style={styles.label}>URL de l'image</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://exemple.com/mon-image.jpg"
                  style={styles.input}
                />
                <p style={styles.helpText}>
                  Collez l'URL d'une image hébergée (Google Drive, Dropbox, Imgur, etc.)
                </p>
              </div>
            </div>
          </div>

          {/* Podcast */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🎙️ Podcast (optionnel)</h2>
            <label style={styles.label}>URL Spotify</label>
            <input
              type="url"
              name="spotifyUrl"
              value={formData.spotifyUrl}
              onChange={handleChange}
              placeholder="https://open.spotify.com/episode/..."
              style={styles.input}
            />
          </div>

          {/* Content Tabs */}
          <div style={{ ...styles.section, padding: 0, overflow: 'hidden' }}>
            <div style={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.key ? styles.tabActive : styles.tabInactive),
                  }}
                >
                  {tab.flag} {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '24px' }}>
              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>
                  Titre {activeTab === 'FR' ? '(obligatoire)' : '(optionnel - sera traduit automatiquement)'}
                </label>
                <input
                  type="text"
                  name={`title${activeTab}`}
                  value={formData[`title${activeTab}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  placeholder={`Titre en ${tabs.find((t) => t.key === activeTab)?.label}`}
                  style={{ ...styles.input, fontSize: '18px', fontWeight: '600' }}
                />
              </div>

              {/* Excerpt */}
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Extrait (résumé affiché dans la liste)</label>
                <textarea
                  name={`excerpt${activeTab}`}
                  value={formData[`excerpt${activeTab}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  rows={4}
                  placeholder={`Court résumé de l'article...`}
                  style={styles.textarea}
                />
              </div>

              {/* Content */}
              <div>
                <label style={styles.label}>Contenu complet</label>
                <textarea
                  name={`content${activeTab}`}
                  value={formData[`content${activeTab}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  rows={20}
                  placeholder={`Écrivez votre article ici...

Vous pouvez utiliser des sauts de ligne pour créer des paragraphes.

Conseils de mise en forme :
- Utilisez des lignes vides pour séparer les paragraphes
- Commencez une ligne par - pour créer une liste
- Utilisez MAJUSCULES pour les titres de section`}
                  style={{ ...styles.textarea, minHeight: '400px', lineHeight: '1.6' }}
                />
                <p style={styles.helpText}>
                  Le texte sera affiché tel quel. Utilisez des lignes vides pour séparer les paragraphes.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button (bottom) */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{ ...styles.saveBtn, padding: '16px 48px', fontSize: '18px' }}
            >
              {isSaving ? 'Sauvegarde en cours...' : '💾 Sauvegarder l\'article'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
