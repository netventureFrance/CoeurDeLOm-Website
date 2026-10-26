'use client';

import { useEffect, useState } from 'react';

interface Status {
  claude: {
    model: string;
    displayName?: string;
    keyConfigured: boolean;
    modelOk: boolean;
    error?: string;
    features: string[];
    generation?: { ok: boolean; answeredBy?: string; stopReason?: string; ms?: number; text?: string; error?: string };
  };
  airtable: { tables: Record<string, string>; schemaScope: boolean };
  env: Record<string, boolean>;
  checkedAt: string;
}

function Badge({ ok, label }: { ok: boolean | null; label: string }) {
  const colour = ok === null ? 'bg-gray-100 text-gray-600' : ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  return <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${colour}`}>{label}</span>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-700">{label}</span>
      <span>{children}</span>
    </div>
  );
}

export default function SystemStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState<'' | 'check' | 'generate'>('');
  const [error, setError] = useState('');

  async function run(generate: boolean) {
    setLoading(generate ? 'generate' : 'check');
    setError('');
    try {
      const r = await fetch(`/api/admin/status${generate ? '?generate=1' : ''}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      setStatus(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading('');
    }
  }

  useEffect(() => { run(false); }, []);

  async function createTable() {
    setLoading('check');
    setError('');
    try {
      const r = await fetch('/api/admin/status', { method: 'POST' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      if (d.airtable.tables.Elements_Tests !== 'ok') throw new Error('La table n\'a pas pu être créée.');
      await run(false);
    } catch (e: any) {
      setError(e.message);
      setLoading('');
    }
  }

  const c = status?.claude;
  const g = c?.generation;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">État du système</h2>
          {status && (
            <p className="text-sm text-gray-500">Vérifié le {new Date(status.checkedAt).toLocaleString('fr-FR')}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => run(false)} disabled={!!loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            {loading === 'check' ? 'Vérification…' : 'Revérifier'}
          </button>
          <button onClick={() => run(true)} disabled={!!loading}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
            {loading === 'generate' ? 'Test en cours…' : 'Tester une vraie réponse de Claude'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800">{error}</div>}

      {c && (
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Claude (IA)</h3>
          <Row label="Modèle utilisé">
            <code className="text-sm bg-gray-100 rounded px-2 py-1">{c.model}</code>
            {c.displayName && <span className="ml-2 text-gray-600">{c.displayName}</span>}
          </Row>
          <Row label="Clé API Anthropic">
            <Badge ok={c.keyConfigured} label={c.keyConfigured ? 'présente' : 'absente'} />
          </Row>
          <Row label="Accès au modèle">
            <Badge ok={c.modelOk} label={c.modelOk ? 'OK' : 'en échec'} />
          </Row>
          {c.error && <p className="text-sm text-red-700 mt-2">{c.error}</p>}
          <Row label="Test de génération">
            {g ? (
              <Badge ok={g.ok} label={g.ok ? `OK en ${((g.ms ?? 0) / 1000).toFixed(1)} s` : 'en échec'} />
            ) : (
              <Badge ok={null} label="pas encore lancé" />
            )}
          </Row>
          {g && (
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              {g.answeredBy && (
                <p>
                  Réponse donnée par <code className="bg-gray-100 rounded px-1">{g.answeredBy}</code>
                  {g.answeredBy !== c.model && ' (modèle de repli)'}
                </p>
              )}
              {g.text && <p>Texte reçu : « {g.text} »</p>}
              {g.error && <p className="text-red-700">{g.error}</p>}
              {g.stopReason && g.stopReason !== 'end_turn' && <p className="text-red-700">Arrêt : {g.stopReason}</p>}
            </div>
          )}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Fonctions qui utilisent ce modèle :</p>
            <ul className="text-sm text-gray-600 list-disc pl-5">
              {c.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            « Revérifier » est gratuit. « Tester une vraie réponse » envoie une toute petite demande à Claude (moins d&apos;un centime).
          </p>
        </section>
      )}

      {status && (
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Airtable</h3>
          {Object.entries(status.airtable.tables).map(([name, state]) => (
            <Row key={name} label={`Table ${name}`}>
              <Badge ok={state === 'ok' ? true : state === 'absente' && name === 'Elements_Tests' && status.airtable.schemaScope ? null : false}
                label={state === 'ok' ? 'OK' : state === 'absente' && name === 'Elements_Tests' && status.airtable.schemaScope
                  ? 'sera créée au premier test enregistré' : state} />
            </Row>
          ))}
          {status.airtable.tables.Elements_Tests === 'absente' && status.airtable.schemaScope && (
            <div className="py-2">
              <button onClick={createTable} disabled={!!loading}
                className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-800 hover:bg-purple-100 disabled:opacity-50">
                Créer la table Elements_Tests maintenant
              </button>
            </div>
          )}
          <Row label="Création automatique des tables">
            <Badge ok={status.airtable.schemaScope} label={status.airtable.schemaScope ? 'autorisée' : 'non autorisée (créer à la main)'} />
          </Row>
        </section>
      )}

      {status && (
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration</h3>
          {Object.entries(status.env).map(([name, present]) => (
            <Row key={name} label={name}>
              <Badge ok={present} label={present ? 'présente' : 'absente'} />
            </Row>
          ))}
        </section>
      )}
    </div>
  );
}
