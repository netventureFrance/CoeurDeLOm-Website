'use client';

import { useState, useEffect } from 'react';
import BlogEditor from './BlogEditor';

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

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer l'article "${title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  }

  function handleEdit(post: BlogPost) {
    setSelectedPost(post);
    setIsCreating(false);
  }

  function handleCreate() {
    setSelectedPost(null);
    setIsCreating(true);
  }

  function handleEditorClose() {
    setSelectedPost(null);
    setIsCreating(false);
  }

  async function handleEditorSave() {
    await fetchPosts();
    setSelectedPost(null);
    setIsCreating(false);
  }

  async function handleDeploy() {
    if (deployStatus === 'deploying') return;

    setDeployStatus('deploying');
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
      });

      if (response.ok) {
        setDeployStatus('success');
        // Reset to idle after 5 seconds
        setTimeout(() => setDeployStatus('idle'), 5000);
      } else {
        setDeployStatus('error');
        setTimeout(() => setDeployStatus('idle'), 5000);
      }
    } catch (err) {
      setDeployStatus('error');
      setTimeout(() => setDeployStatus('idle'), 5000);
    }
  }

  // Extract unique author options from posts
  const extractedOptions = {
    authors: [...new Set(posts.map(p => p.author).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'fr')),
  };

  if (selectedPost || isCreating) {
    return (
      <BlogEditor
        post={selectedPost}
        onClose={handleEditorClose}
        onSave={handleEditorSave}
        existingOptions={extractedOptions}
      />
    );
  }

  // Inline styles for reliability
  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    header: { backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' },
    headerContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { width: '40px', height: '40px', marginRight: '12px' },
    title: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    logoutBtn: { padding: '8px 16px', color: '#6b7280', background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' },
    deployBtn: { padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
    deployBtnDisabled: { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
    deployBtnSuccess: { backgroundColor: '#059669' },
    deployBtnError: { backgroundColor: '#dc2626' },
    main: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    subtitle: { fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 },
    newBtn: { backgroundColor: '#7c3aed', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px' },
    error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' },
    thumbnail: { width: '80px', height: '56px', objectFit: 'cover' as const, borderRadius: '8px', backgroundColor: '#f3f4f6', flexShrink: 0 },
    noImage: { width: '80px', height: '56px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '24px', flexShrink: 0 },
    postInfo: { flex: 1, minWidth: 0 },
    postTitle: { fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0', fontSize: '16px' },
    postSlug: { color: '#6b7280', fontSize: '14px', margin: 0 },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' },
    badgePublished: { backgroundColor: '#dcfce7', color: '#166534' },
    badgeDraft: { backgroundColor: '#fef3c7', color: '#92400e' },
    date: { color: '#6b7280', fontSize: '14px', width: '100px', textAlign: 'right' as const },
    actions: { display: 'flex', gap: '8px' },
    actionBtn: { padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' },
    editBtn: { backgroundColor: '#ede9fe', color: '#7c3aed' },
    deleteBtn: { backgroundColor: '#fee2e2', color: '#dc2626' },
    viewBtn: { backgroundColor: '#dbeafe', color: '#2563eb' },
    spinner: { width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    empty: { textAlign: 'center' as const, padding: '48px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/Coeur-de-lOm-Alpha-Kopie.png" alt="Logo" style={styles.logo} />
            <h1 style={styles.title}>Gestion du Blog</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleDeploy}
              disabled={deployStatus === 'deploying'}
              style={{
                ...styles.deployBtn,
                ...(deployStatus === 'deploying' ? styles.deployBtnDisabled : {}),
                ...(deployStatus === 'success' ? styles.deployBtnSuccess : {}),
                ...(deployStatus === 'error' ? styles.deployBtnError : {}),
              }}
            >
              {deployStatus === 'idle' && (
                <>
                  <span>🚀</span>
                  Publier le site
                </>
              )}
              {deployStatus === 'deploying' && (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                  Publication...
                </>
              )}
              {deployStatus === 'success' && (
                <>
                  <span>✅</span>
                  Publication lancée !
                </>
              )}
              {deployStatus === 'error' && (
                <>
                  <span>❌</span>
                  Erreur
                </>
              )}
            </button>
            <button onClick={onLogout} style={styles.logoutBtn}>
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.topBar}>
          <h2 style={styles.subtitle}>Articles ({posts.length})</h2>
          <button onClick={handleCreate} style={styles.newBtn}>
            + Nouvel article
          </button>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <div style={styles.spinner}></div>
          </div>
        ) : posts.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>Aucun article</p>
            <p style={{ color: '#9ca3af' }}>Cliquez sur "Nouvel article" pour commencer</p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.id} style={styles.card}>
                {/* Thumbnail */}
                {post.image && post.image.startsWith('http') ? (
                  <img
                    src={post.image}
                    alt=""
                    style={styles.thumbnail}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
                    }}
                  />
                ) : null}
                <div style={{
                  ...styles.noImage,
                  display: post.image && post.image.startsWith('http') ? 'none' : 'flex'
                }}>🖼️</div>

                {/* Info */}
                <div style={styles.postInfo}>
                  <h3 style={styles.postTitle}>{post.titleFR || 'Sans titre'}</h3>
                  <p style={styles.postSlug}>{post.slug}</p>
                </div>

                {/* Status */}
                <span style={{
                  ...styles.badge,
                  ...(post.status === 'Published' ? styles.badgePublished : styles.badgeDraft)
                }}>
                  {post.status === 'Published' ? '✓ Publié' : '○ Non publié'}
                </span>

                {/* Date */}
                <span style={styles.date}>
                  {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('fr-FR') : '-'}
                </span>

                {/* Actions */}
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(post)}
                    style={{ ...styles.actionBtn, ...styles.editBtn }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.titleFR || 'cet article')}
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  >
                    🗑️ Supprimer
                  </button>
                  {post.status === 'Published' && (
                    <a
                      href={`/fr/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...styles.actionBtn, ...styles.viewBtn, textDecoration: 'none' }}
                    >
                      👁️ Voir
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
