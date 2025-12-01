'use client';

import { useState, useRef } from 'react';

interface CarouselImage {
  id: string;
  imageUrl: string;
  order: number;
  altText: string;
  status: string;
}

interface CarouselEditorProps {
  image: CarouselImage | null;
  onClose: () => void;
  onSave: () => void;
  nextOrder?: number;
}

export default function CarouselEditor({ image, onClose, onSave, nextOrder = 0 }: CarouselEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    imageUrl: image?.imageUrl || '',
    order: image?.order ?? nextOrder,
    altText: image?.altText || '',
    status: image?.status || 'Inactive',
  });

  // Convert Google Drive share URLs to direct image URLs
  function convertDriveUrl(url: string): string {
    if (!url) return url;

    if (url.includes('lh3.googleusercontent.com') || url.includes('drive.google.com/thumbnail')) {
      return url;
    }

    let fileId = null;

    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) fileId = fileMatch[1];

    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) fileId = openMatch[1];

    const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (ucMatch) fileId = ucMatch[1];

    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
    }

    return url;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === 'imageUrl' && value.includes('drive.google.com')) {
      setFormData((prev) => ({ ...prev, [name]: convertDriveUrl(value) }));
    } else if (name === 'order') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setUploadMessage('Image téléchargée avec succès!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    if (!formData.imageUrl.trim()) {
      setError('Une URL d\'image est requise');
      setIsSaving(false);
      return;
    }

    try {
      const url = '/api/admin/carousel';
      const method = image ? 'PUT' : 'POST';

      const body = image
        ? { id: image.id, ...formData }
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
    success: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
    helpText: { fontSize: '13px', color: '#6b7280', marginTop: '6px' },
    imagePreview: { width: '100%', maxHeight: '400px', objectFit: 'cover' as const, borderRadius: '8px', marginTop: '12px' },
    uploadBtn: { backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '500', marginRight: '12px' },
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
              {image ? 'Modifier l\'image' : 'Nouvelle image'}
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
              <option value="Inactive">Inactive</option>
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
          {/* Image Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Image</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Télécharger une image</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={{ ...styles.uploadBtn, display: 'inline-block' }}>
                  {isUploading ? 'Téléchargement...' : 'Choisir un fichier'}
                </label>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  ou entrez une URL ci-dessous
                </span>
              </div>
              {uploadMessage && (
                <div style={styles.success}>{uploadMessage}</div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>URL de l'image</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://i.ibb.co/... ou URL Google Drive"
                style={styles.input}
              />
              <p style={styles.helpText}>
                Collez une URL ImgBB ou Google Drive. Les URLs Drive sont converties automatiquement.
              </p>
            </div>

            {formData.imageUrl && (
              <div>
                <label style={styles.label}>Aperçu</label>
                <img
                  src={formData.imageUrl}
                  alt="Aperçu"
                  style={styles.imagePreview}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Paramètres</h2>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Ordre d'affichage</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />
                <p style={styles.helpText}>
                  Les images sont affichées par ordre croissant (0, 1, 2...)
                </p>
              </div>
              <div>
                <label style={styles.label}>Texte alternatif</label>
                <input
                  type="text"
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  placeholder="Description de l'image pour l'accessibilité"
                  style={styles.input}
                />
                <p style={styles.helpText}>
                  Important pour le SEO et l'accessibilité
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              style={{ ...styles.saveBtn, padding: '16px 48px', fontSize: '18px', opacity: (isSaving || isUploading) ? 0.6 : 1 }}
            >
              {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder l\'image'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
