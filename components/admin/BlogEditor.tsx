'use client';

import { useState, useEffect, useRef } from 'react';
import RichTextEditor from './RichTextEditor';

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
  existingOptions?: {
    categories: string[];
    authors: string[];
    tags: string[];
  };
}

type Language = 'FR' | 'DE' | 'EN';

export default function BlogEditor({ post, onClose, onSave, existingOptions }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<Language>('FR');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewTag, setShowNewTag] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    author: post?.author || '',
    publishedDate: post?.publishedDate || new Date().toISOString().split('T')[0],
    status: post?.status || 'Draft',
    imageUrl: post?.image || '',
    spotifyUrl: post?.spotifyUrl || '',
  });

  // Initialize options from props or fetch from API
  useEffect(() => {
    if (existingOptions) {
      setCategories(existingOptions.categories || []);
      setAuthors(existingOptions.authors || []);
      setTags(existingOptions.tags || []);
    } else {
      // Fallback to API if no options passed
      async function fetchOptions() {
        try {
          const response = await fetch('/api/admin/categories');
          if (response.ok) {
            const data = await response.json();
            setCategories(data.categories || []);
            setAuthors(data.authors || []);
            setTags(data.tags || []);
          }
        } catch (err) {
          console.error('Error fetching options:', err);
        }
      }
      fetchOptions();
    }
  }, [existingOptions]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewCategory(true);
    } else {
      setFormData((prev) => ({ ...prev, category: value }));
      setShowNewCategory(false);
    }
  }

  async function saveOptionToAirtable(type: 'Category' | 'Author' | 'Tag', value: string) {
    try {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value }),
      });
    } catch (err) {
      console.error('Error saving option to Airtable:', err);
    }
  }

  function handleAddNewCategory() {
    if (newCategory.trim()) {
      const trimmed = newCategory.trim();
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'fr')));
        saveOptionToAirtable('Category', trimmed);
      }
      setFormData((prev) => ({ ...prev, category: trimmed }));
      setNewCategory('');
      setShowNewCategory(false);
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
        saveOptionToAirtable('Author', trimmed);
      }
      setFormData((prev) => ({ ...prev, author: trimmed }));
      setNewAuthor('');
      setShowNewAuthor(false);
    }
  }

  function handleTagChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewTag(true);
    } else {
      setFormData((prev) => ({ ...prev, tags: value }));
      setShowNewTag(false);
    }
  }

  function handleAddNewTag() {
    if (newTag.trim()) {
      const trimmed = newTag.trim();
      if (!tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'fr')));
        saveOptionToAirtable('Tag', trimmed);
      }
      setFormData((prev) => ({ ...prev, tags: trimmed }));
      setNewTag('');
      setShowNewTag(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'blog');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
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
              <option value="Draft">Brouillon</option>
              <option value="Unpublished">Non publié</option>
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
                <label style={styles.label}>Catégorie</label>
                {!showNewCategory ? (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    style={{ ...styles.input, cursor: 'pointer' }}
                  >
                    <option value="">-- Sélectionner --</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__">+ Ajouter une catégorie...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Nouvelle catégorie..."
                      style={{ ...styles.input, flex: 1 }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      style={{ ...styles.saveBtn, padding: '8px 16px' }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(false)}
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
              <div>
                <label style={styles.label}>Tag</label>
                {!showNewTag ? (
                  <select
                    name="tags"
                    value={formData.tags}
                    onChange={handleTagChange}
                    style={{ ...styles.input, cursor: 'pointer' }}
                  >
                    <option value="">-- Sélectionner --</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                    <option value="__new__">+ Ajouter un tag...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nouveau tag..."
                      style={{ ...styles.input, flex: 1 }}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewTag}
                      style={{ ...styles.saveBtn, padding: '8px 16px' }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTag(false)}
                      style={{ ...styles.backBtn, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                      Annuler
                    </button>
                  </div>
                )}
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
                  />
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
                {/* File Upload */}
                <label style={styles.label}>Uploader depuis votre ordinateur</label>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      backgroundColor: isUploading ? '#9ca3af' : '#f3f4f6',
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      cursor: isUploading ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>📁 Choisir un fichier</>
                    )}
                  </label>
                  <p style={styles.helpText}>JPG, PNG, GIF ou WebP (max 5MB)</p>
                </div>

                {/* URL Input */}
                <label style={styles.label}>Ou coller une URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://exemple.com/mon-image.jpg"
                  style={styles.input}
                />
                <p style={styles.helpText}>
                  URL d'une image externe (Google Drive, Dropbox, Imgur, etc.)
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
