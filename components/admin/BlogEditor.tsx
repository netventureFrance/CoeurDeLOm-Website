'use client';

import { useState, useEffect, useRef } from 'react';
import RichTextEditor from './RichTextEditor';

interface BlogPost {
  id: string;
  slug: string;
  titleFR: string;
  titleDE: string;
  titleEN: string;
  contentFR: string;
  contentDE: string;
  contentEN: string;
  author: string;
  publishedDate: string;
  status: string;
  image: string | null;
  imageUrl: string | null; // Permanent ImgBB URL
  audioFile: string | null;
  spotifyUrl: string | null;
}

interface BlogEditorProps {
  post: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
  existingOptions?: {
    authors: string[];
  };
}

type Language = 'FR' | 'DE' | 'EN';

export default function BlogEditor({ post, onClose, onSave, existingOptions }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<Language>('FR');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    slug: post?.slug || '',
    titleFR: post?.titleFR || '',
    titleDE: post?.titleDE || '',
    titleEN: post?.titleEN || '',
    contentFR: post?.contentFR || '',
    contentDE: post?.contentDE || '',
    contentEN: post?.contentEN || '',
    author: post?.author || '',
    publishedDate: post?.publishedDate || new Date().toISOString().split('T')[0],
    status: post?.status || 'Draft',
    imageUrl: post?.imageUrl || post?.image || '', // Prefer permanent ImgBB URL
    spotifyUrl: post?.spotifyUrl || '',
  });

  // Fetch author options from API
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          const mergedAuthors = new Set([
            ...(data.authors || []),
            ...(existingOptions?.authors || []),
          ]);
          setAuthors(Array.from(mergedAuthors).sort((a, b) => a.localeCompare(b, 'fr')));
        } else if (existingOptions) {
          setAuthors(existingOptions.authors || []);
        }
      } catch (err) {
        console.error('Error fetching authors:', err);
        if (existingOptions) {
          setAuthors(existingOptions.authors || []);
        }
      }
    }
    fetchAuthors();
  }, [existingOptions]);

  // Convert Google Drive share URLs to direct image URLs
  function convertDriveUrl(url: string): string {
    if (!url) return url;

    // Already a direct thumbnail URL
    if (url.includes('lh3.googleusercontent.com') || url.includes('drive.google.com/thumbnail')) {
      return url;
    }

    // Extract file ID from various Google Drive URL formats
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    // Format 2: https://drive.google.com/open?id=FILE_ID
    // Format 3: https://drive.google.com/uc?id=FILE_ID

    let fileId = null;

    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }

    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }

    const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (ucMatch) {
      fileId = ucMatch[1];
    }

    if (fileId) {
      // Use thumbnail endpoint with large size - more reliable than uc?export
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
    }

    return url;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    // Auto-convert Google Drive URLs to direct image URLs
    if (name === 'imageUrl' && value.includes('drive.google.com')) {
      setFormData((prev) => ({ ...prev, [name]: convertDriveUrl(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function saveAuthorToAirtable(value: string) {
    try {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Author', value }),
      });
    } catch (err) {
      console.error('Error saving author to Airtable:', err);
    }
  }

  function handleAuthorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewAuthor(true);
    } else {
      setFormData((prev) => ({ ...prev, author: value }));
      setShowNewAuthor(false);
    }
  }

  function handleAddNewAuthor() {
    if (newAuthor.trim()) {
      const trimmed = newAuthor.trim();
      if (!authors.includes(trimmed)) {
        setAuthors((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'fr')));
        saveAuthorToAirtable(trimmed);
      }
      setFormData((prev) => ({ ...prev, author: trimmed }));
      setNewAuthor('');
      setShowNewAuthor(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('');
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Erreur lors du téléchargement');
      }

      // Set the image URL from ImgBB
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setUploadMessage('Image téléchargée avec succès!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
              <option value="Draft">Draft</option>
              <option value="Unpublished">Unpublished</option>
              <option value="Published">Published</option>
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
                {!showNewAuthor ? (
                  <select
                    name="author"
                    value={formData.author}
                    onChange={handleAuthorChange}
                    style={{ ...styles.input, cursor: 'pointer' }}
                  >
                    <option value="">-- Sélectionner --</option>
                    {authors.map((auth) => (
                      <option key={auth} value={auth}>{auth}</option>
                    ))}
                    <option value="__new__">+ Ajouter un auteur...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Nouvel auteur..."
                      style={{ ...styles.input, flex: 1 }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewAuthor())}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewAuthor}
                      style={{ ...styles.saveBtn, padding: '8px 16px' }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAuthor(false)}
                      style={{ ...styles.backBtn, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                      Annuler
                    </button>
                  </div>
                )}
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
                <div style={{ position: 'relative' }}>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{ width: '200px', height: '130px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const errorDiv = img.nextElementSibling as HTMLElement;
                      if (errorDiv) errorDiv.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'block';
                      const errorDiv = img.nextElementSibling as HTMLElement;
                      if (errorDiv) errorDiv.style.display = 'none';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '200px',
                    height: '130px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '8px',
                    textAlign: 'center',
                  }}>
                    <span style={{ fontSize: '24px', marginBottom: '4px' }}>⚠️</span>
                    <span style={{ fontSize: '11px', color: '#dc2626' }}>Image introuvable ou expirée</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Supprimer l'image"
                  >
                    x
                  </button>
                </div>
              )}
              <div style={{ flex: 1 }}>
                {/* File Upload Button */}
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{
                      backgroundColor: isUploading ? '#9ca3af' : '#10b981',
                      color: 'white',
                      padding: '14px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isUploading ? 'wait' : 'pointer',
                      fontWeight: '600',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    {isUploading ? (
                      <>⏳ Téléchargement en cours...</>
                    ) : (
                      <>📤 Télécharger une image depuis votre ordinateur</>
                    )}
                  </button>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', textAlign: 'center' }}>
                    JPEG, PNG, GIF, WebP (max 32MB)
                  </p>
                  {uploadMessage && (
                    <p style={{ fontSize: '13px', color: '#10b981', marginTop: '8px', textAlign: 'center' }}>
                      ✓ {uploadMessage}
                    </p>
                  )}
                </div>

                <label style={{ ...styles.label, marginTop: '16px' }}>Ou coller une URL directement</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/..."
                  style={styles.input}
                />
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

              {/* Content */}
              <div>
                <label style={styles.label}>Contenu complet</label>
                <RichTextEditor
                  value={formData[`content${activeTab}` as keyof typeof formData] as string}
                  onChange={(value) => setFormData((prev) => ({ ...prev, [`content${activeTab}`]: value }))}
                  placeholder="Écrivez votre article ici..."
                  minHeight="400px"
                />
                <p style={styles.helpText}>
                  Utilisez la barre d'outils pour formater le texte (gras, italique, listes, etc.)
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
