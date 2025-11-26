'use client';

import { useState, useEffect } from 'react';
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
  const [showImgurModal, setShowImgurModal] = useState(false);

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

  // Convert Imgur page URLs to direct image URLs
  function convertImgurUrl(url: string): string {
    if (!url) return url;

    // Already a direct image URL
    if (url.match(/^https?:\/\/i\.imgur\.com\/\w+\.\w+$/)) {
      return url;
    }

    // Album URL: https://imgur.com/a/xiYhJbB -> https://i.imgur.com/xiYhJbB.jpg
    const albumMatch = url.match(/imgur\.com\/a\/(\w+)/);
    if (albumMatch) {
      return `https://i.imgur.com/${albumMatch[1]}.jpg`;
    }

    // Gallery URL: https://imgur.com/gallery/xiYhJbB -> https://i.imgur.com/xiYhJbB.jpg
    const galleryMatch = url.match(/imgur\.com\/gallery\/(\w+)/);
    if (galleryMatch) {
      return `https://i.imgur.com/${galleryMatch[1]}.jpg`;
    }

    // Simple page URL: https://imgur.com/xiYhJbB -> https://i.imgur.com/xiYhJbB.jpg
    const simpleMatch = url.match(/imgur\.com\/(\w+)$/);
    if (simpleMatch && simpleMatch[1] !== 'upload') {
      return `https://i.imgur.com/${simpleMatch[1]}.jpg`;
    }

    return url;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    // Auto-convert Imgur URLs to direct image URLs
    if (name === 'imageUrl' && value.includes('imgur.com')) {
      setFormData((prev) => ({ ...prev, [name]: convertImgurUrl(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      window.open('https://imgur.com/upload', 'imgur_upload', 'width=800,height=700');
                      setShowImgurModal(true);
                    }}
                    style={{
                      backgroundColor: '#1bb76e',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📤 Upload sur Imgur
                  </button>
                </div>
                <label style={styles.label}>URL de l'image</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://i.imgur.com/xxxxx.jpg"
                  style={styles.input}
                />
                <p style={styles.helpText}>
                  Collez l'URL directe de l'image (clic droit sur l'image → "Copier l'adresse de l'image")
                </p>
              </div>
            </div>
          </div>

          {/* Imgur Modal */}
          {showImgurModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1f2937' }}>
                  📤 Upload Imgur
                </h3>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #22c55e',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                }}>
                  <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#166534' }}>
                    Instructions :
                  </p>
                  <ol style={{ margin: '0', paddingLeft: '20px', color: '#15803d', fontSize: '14px', lineHeight: '1.8' }}>
                    <li>Dans la fenêtre Imgur, glissez ou sélectionnez votre image</li>
                    <li>Attendez la fin de l'upload</li>
                    <li>Cliquez sur l'image uploadée pour l'ouvrir</li>
                    <li>Faites <strong>clic droit directement sur l'image</strong></li>
                    <li>Sélectionnez <strong>"Copier l'adresse de l'image"</strong> (pas "Copier le lien")</li>
                    <li>L'URL doit commencer par <code style={{ backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>https://i.imgur.com/</code></li>
                  </ol>
                </div>
                <input
                  type="url"
                  placeholder="https://i.imgur.com/xxxxxxx.jpg"
                  style={{
                    ...styles.input,
                    marginBottom: '8px',
                  }}
                  onChange={(e) => {
                    const url = e.target.value;
                    if (url && url.includes('imgur.com')) {
                      setFormData((prev) => ({ ...prev, imageUrl: convertImgurUrl(url) }));
                    }
                  }}
                  autoFocus
                />
                {formData.imageUrl && formData.imageUrl.includes('imgur.com') && (
                  <div style={{ marginBottom: '16px' }}>
                    {formData.imageUrl.startsWith('https://i.imgur.com/') ? (
                      <p style={{ margin: 0, color: '#16a34a', fontSize: '13px' }}>
                        ✓ URL valide : {formData.imageUrl}
                      </p>
                    ) : (
                      <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>
                        ⚠️ L'URL doit commencer par https://i.imgur.com/
                      </p>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowImgurModal(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImgurModal(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          )}

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
