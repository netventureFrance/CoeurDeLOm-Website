'use client';

import { useState, useRef } from 'react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
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
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }

  const tabs: { key: Language; label: string }[] = [
    { key: 'FR', label: 'Français' },
    { key: 'DE', label: 'Deutsch' },
    { key: 'EN', label: 'English' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {post ? 'Modifier l\'article' : 'Nouvel article'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Draft">Brouillon</option>
              <option value="Published">Publié</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Informations générales
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="mon-article (généré automatiquement si vide)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Bien-être, Naturopathie, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication
                </label>
                <input
                  type="date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Image de couverture
            </h2>
            <div className="flex items-start gap-6">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-40 h-28 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors w-full text-gray-600 hover:text-purple-600"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Téléchargement...
                    </span>
                  ) : (
                    'Cliquez pour ajouter une image'
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Formats acceptés: JPEG, PNG, GIF, WebP. Max 10 MB.
                </p>
              </div>
            </div>
          </div>

          {/* Podcast */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Podcast (optionnel)
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Spotify
              </label>
              <input
                type="url"
                name="spotifyUrl"
                value={formData.spotifyUrl}
                onChange={handleChange}
                placeholder="https://open.spotify.com/episode/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="border-b">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  name={`title${activeTab}`}
                  value={formData[`title${activeTab}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  placeholder={`Titre en ${tabs.find((t) => t.key === activeTab)?.label}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extrait (résumé court)
                </label>
                <textarea
                  name={`excerpt${activeTab}`}
                  value={formData[`excerpt${activeTab}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  rows={3}
                  placeholder={`Extrait en ${tabs.find((t) => t.key === activeTab)?.label}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu
                </label>
                <textarea
                  name={`content${activeTab}`}
                  value={formData[`content${activeTab}` as keyof typeof formData] as string}
                  onChange={handleChange}
                  rows={15}
                  placeholder={`Contenu complet en ${tabs.find((t) => t.key === activeTab)?.label}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button (Mobile) */}
          <div className="md:hidden">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
