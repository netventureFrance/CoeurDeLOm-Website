'use client';

import { useEffect, useMemo, useState } from 'react';
import './elements.css';
import elementsDb from '@/lib/elements-test/elements.json';
import { evaluate, ELEMENTS } from '@/lib/elements-test/score';
import type { ElementEntry, Intensite, Selection } from '@/lib/elements-test/score';
import { ELEMENT_INFO } from '@/lib/elements-test/elements-info';
import { INTERPRETATIONS } from '@/lib/elements-test/interpretations';
import TagGrid from './TagGrid';
import ElementsResults from './ElementsResults';
import { exportElementsPdf } from './exportPdf';

const DB = elementsDb as ElementEntry[];
const QUALITES = DB.filter((x) => x.type === 'qualite');
const DEFAUTS = DB.filter((x) => x.type === 'defaut');

type Step = 'accueil' | 'blanc' | 'noir' | 'resultats';
type SelectionMap = Record<number, Intensite>;

interface SavedTest {
  id: string;
  client: string;
  testDate: string;
  profil: string;
  profilTitre: string;
  notes: string;
  selections: { qualites: Selection[]; defauts: Selection[] } | null;
}

const STORAGE_KEY = 'elements-test-session';
const toList = (m: SelectionMap): Selection[] => Object.entries(m).map(([id, intensite]) => ({ id: Number(id), intensite }));
const toMap = (l: Selection[] = []): SelectionMap => Object.fromEntries(l.map((s) => [s.id, s.intensite]));

export default function ElementsTest() {
  const [step, setStep] = useState<Step>('accueil');
  const [client, setClient] = useState('');
  const [qualites, setQualites] = useState<SelectionMap>({});
  const [defauts, setDefauts] = useState<SelectionMap>({});
  const [notes, setNotes] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [testDate, setTestDate] = useState<Date>(new Date());
  const [guardMsg, setGuardMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);
  const [history, setHistory] = useState<SavedTest[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [restored, setRestored] = useState(false);

  // Keep the session in progress across an accidental reload (cleared on « Nouveau test »)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setStep(s.step ?? 'accueil'); setClient(s.client ?? '');
        setQualites(s.qualites ?? {}); setDefauts(s.defauts ?? {});
        setNotes(s.notes ?? ''); setSavedId(s.savedId ?? null);
        if (s.testDate) setTestDate(new Date(s.testDate));
      }
    } catch { /* storage unavailable */ }
    setRestored(true);
    loadHistory();
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, client, qualites, defauts, notes, savedId, testDate }));
    } catch { /* storage unavailable */ }
  }, [restored, step, client, qualites, defauts, notes, savedId, testDate]);

  async function loadHistory() {
    try {
      const r = await fetch('/api/admin/elements-tests');
      if (r.ok) setHistory((await r.json()).tests || []);
    } catch { /* ignore */ }
  }

  const result = useMemo(
    () => (step === 'resultats' ? evaluate(toList(qualites), toList(defauts), DB) : null),
    [step, qualites, defauts]
  );

  function goToResults() {
    // Calculation needs at least one word per mirror (a single word is enough)
    const emptyStep: Step | null = !Object.keys(qualites).length ? 'blanc' : !Object.keys(defauts).length ? 'noir' : null;
    if (emptyStep) {
      setGuardMsg('Cochez au moins un mot dans chaque miroir pour que le calcul soit possible.');
      setStep(emptyStep);
      return;
    }
    setGuardMsg('');
    setStep('resultats');
  }

  function newTest() {
    setStep('accueil'); setClient(''); setQualites({}); setDefauts({});
    setNotes(''); setSavedId(null); setSaveMsg(''); setGuardMsg(''); setTestDate(new Date());
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }

  function openSaved(t: SavedTest) {
    if (!t.selections) { setSaveMsg('⚠ Ce test ne contient pas les mots cochés.'); return; }
    setClient(t.client); setQualites(toMap(t.selections.qualites)); setDefauts(toMap(t.selections.defauts));
    setNotes(t.notes); setSavedId(t.id); setTestDate(new Date(t.testDate)); setSaveMsg('');
    setStep('resultats'); setShowHistory(false);
  }

  async function deleteSaved(t: SavedTest) {
    if (!confirm(`Supprimer le test de « ${t.client} » du ${new Date(t.testDate).toLocaleDateString('fr-FR')} ?`)) return;
    const r = await fetch(`/api/admin/elements-tests?id=${encodeURIComponent(t.id)}`, { method: 'DELETE' });
    if (r.ok) {
      if (savedId === t.id) setSavedId(null);
      loadHistory();
    }
  }

  async function save() {
    if (!result?.bardon) return;
    if (!client.trim()) { setSaveMsg('⚠ Indiquez le nom du client avant d\'enregistrer'); return; }
    setSaveMsg('Enregistrement…');
    try {
      const r = await fetch('/api/admin/elements-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: savedId ?? undefined,
          client: client.trim(),
          profil: result.profil,
          profilTitre: INTERPRETATIONS[result.profil]?.titre ?? result.profil,
          dominantBlanc: result.bardon.dominantBlanc ?? '',
          dominantNoir: result.bardon.dominantNoir ?? '',
          defautsPrioritaires: result.bardon.defautsPrioritaires,
          scores: result.scores,
          selections: { qualites: toList(qualites), defauts: toList(defauts) },
          notes,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      setSavedId(d.id);
      setSaveMsg(savedId ? '✓ Test mis à jour dans Airtable' : '✓ Test enregistré dans Airtable');
      loadHistory();
    } catch (e: any) {
      setSaveMsg(`⚠ ${e.message}`);
    }
  }

  async function downloadPdf() {
    if (!result?.bardon) return;
    setPdfBusy(true);
    try {
      await exportElementsPdf({
        client: client.trim() || 'Client',
        testDate,
        scores: result.scores,
        profil: result.profil,
        bardon: result.bardon,
        radarSvg: document.querySelector('#el-radar svg'),
      });
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Échec de l\'export PDF.');
    } finally {
      setPdfBusy(false);
    }
  }

  const clientNames = Array.from(new Set(history.map((t) => t.client))).sort((a, b) => a.localeCompare(b, 'fr'));
  const stepNumber = step === 'blanc' ? 1 : 2;

  return (
    <div className="el-test max-w-5xl mx-auto">
      {/* Saved tests */}
      <div className="flex justify-end mb-4">
        <button className="el-btn el-btn-ghost" onClick={() => setShowHistory((v) => !v)}>
          Tests enregistrés ({history.length})
        </button>
      </div>
      {showHistory && (
        <div className="el-card mb-6" style={{ textAlign: 'left', padding: 20 }}>
          {history.length === 0 ? (
            <p className="text-sm">Aucun test enregistré pour le moment.</p>
          ) : (
            <table className="el-table">
              <thead><tr><th>Client</th><th>Date</th><th>Profil</th><th></th></tr></thead>
              <tbody>
                {history.map((t) => (
                  <tr key={t.id}>
                    <td>{t.client}</td>
                    <td>{t.testDate ? new Date(t.testDate).toLocaleDateString('fr-FR') : ''}</td>
                    <td>{t.profilTitre}</td>
                    <td className="num whitespace-nowrap">
                      <button className="text-purple-700 underline mr-3" onClick={() => openSaved(t)}>Ouvrir</button>
                      <button className="text-gray-400 hover:text-red-600" onClick={() => deleteSaved(t)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="el-panel">
        {step === 'accueil' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="el-title text-3xl mb-3">Quel Élément êtes-vous ?</h2>
              <p>
                Selon Franz Bardon, la connaissance de soi commence par deux miroirs : le miroir blanc de nos qualités
                et le miroir noir de nos défauts. Chaque trait se rattache à l&apos;un des quatre éléments. Les reconnaître
                avec sincérité montre quel élément prédomine en nous, et lequel demande à être équilibré.
              </p>
            </div>
            <div className="el-cards">
              {ELEMENTS.map((e) => {
                const info = ELEMENT_INFO[e];
                return (
                  <div key={e} className="el-card">
                    <img src={info.image} alt={`Illustration de l'élément ${info.nom}`} />
                    <h3>{info.emoji} {info.nom}</h3>
                    <p className="el-card-sub" style={{ color: info.couleur }}>{info.temperament}</p>
                    <p>{info.principe}</p>
                  </div>
                );
              })}
            </div>
            <div className="max-w-md mx-auto space-y-3 text-center">
              <input
                className="el-input"
                placeholder="Nom du client"
                list="el-client-names"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
              <datalist id="el-client-names">
                {clientNames.map((n) => <option key={n} value={n} />)}
              </datalist>
              <button className="el-btn el-btn-primary" onClick={() => { setTestDate(new Date()); setStep('blanc'); }}>
                Commencer l&apos;évaluation
              </button>
            </div>
          </div>
        )}

        {(step === 'blanc' || step === 'noir') && (
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-semibold" style={{ color: 'var(--titre)' }}>
                Étape {stepNumber} / 2 · {step === 'blanc' ? 'Miroir Blanc (qualités)' : 'Miroir Noir (défauts)'}
              </span>
              {client && <span className="text-gray-500">{client}</span>}
            </div>
            <div className="el-progress mb-6"><div style={{ width: `${stepNumber * 50}%` }} /></div>
            <p className="mb-4 text-lg" style={{ color: 'var(--titre)' }}>
              {step === 'blanc'
                ? 'Cochez les qualités qui vous correspondent sincèrement, sans vous juger. Appuyez une, deux ou trois fois selon la force du trait en vous.'
                : 'Cochez les défauts que vous reconnaissez en vous, avec honnêteté et bienveillance. Même échelle : parfois / souvent / très fort.'}
            </p>
            {guardMsg && (
              <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-900">{guardMsg}</div>
            )}
            {step === 'blanc' ? (
              <TagGrid key="blanc" words={QUALITES} selection={qualites} onChange={(update) => { setQualites(update); setGuardMsg(''); }} />
            ) : (
              <TagGrid key="noir" words={DEFAUTS} selection={defauts} onChange={(update) => { setDefauts(update); setGuardMsg(''); }} />
            )}
            <div className="flex justify-between mt-8">
              <button className="el-btn el-btn-ghost" onClick={() => setStep(step === 'blanc' ? 'accueil' : 'blanc')}>Retour</button>
              {step === 'blanc'
                ? <button className="el-btn el-btn-primary" onClick={() => setStep('noir')}>Suivant</button>
                : <button className="el-btn el-btn-primary" onClick={goToResults}>Voir les résultats</button>}
            </div>
          </div>
        )}

        {step === 'resultats' && result?.bardon && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="el-title text-2xl">Bilan des 4 Éléments{client ? ` · ${client}` : ''}</h2>
              <span className="text-sm text-gray-500">{testDate.toLocaleDateString('fr-FR')}</span>
            </div>

            <ElementsResults scores={result.scores} profil={result.profil} bardon={result.bardon} />

            <div className="el-card space-y-3" style={{ textAlign: 'left', padding: 24 }}>
              <label className="block font-semibold" style={{ color: 'var(--titre)' }}>
                Notes de séance <span className="font-normal text-sm text-gray-500">(enregistrées dans Airtable, pas dans le PDF)</span>
              </label>
              <textarea className="el-input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              {!client.trim() && (
                <input className="el-input" placeholder="Nom du client" list="el-client-names"
                  value={client} onChange={(e) => setClient(e.target.value)} />
              )}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button className="el-btn el-btn-primary" onClick={save}>
                  {savedId ? 'Mettre à jour dans Airtable' : 'Enregistrer dans Airtable'}
                </button>
                <button className="el-btn el-btn-ghost" onClick={downloadPdf} disabled={pdfBusy}>
                  {pdfBusy ? 'PDF en cours…' : 'Télécharger le PDF'}
                </button>
                <button className="el-btn el-btn-ghost" onClick={() => setStep('noir')}>Modifier les réponses</button>
                <button className="el-btn el-btn-ghost" onClick={newTest}>Nouveau test</button>
                {saveMsg && <span className="text-sm">{saveMsg}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
