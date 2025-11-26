'use client';

import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #ecfeff 100%)',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      padding: '48px',
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      display: 'block',
      margin: '0 auto 32px',
      width: '100px',
      height: '100px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      color: '#1f2937',
      marginBottom: '8px',
    },
    subtitle: {
      textAlign: 'center' as const,
      color: '#6b7280',
      marginBottom: '32px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '16px',
      marginBottom: '20px',
      boxSizing: 'border-box' as const,
      outline: 'none',
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '20px',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="/Coeur-de-lOm-Alpha-Kopie.png"
          alt="Cœur de l'OM"
          style={styles.logo}
        />

        <h1 style={styles.title}>Administration</h1>
        <p style={styles.subtitle}>Connectez-vous pour gérer le blog</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contact@coeurdelom.fr"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? '⏳ Connexion...' : '🔐 Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
