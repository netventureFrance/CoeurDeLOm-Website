import type { Element, LectureBardon, Scores } from '@/lib/elements-test/score';
import { ELEMENTS } from '@/lib/elements-test/score';
import { ELEMENT_INFO } from '@/lib/elements-test/elements-info';
import { INTERPRETATIONS } from '@/lib/elements-test/interpretations';
import ElementsRadar from './ElementsRadar';

interface ElementsResultsProps {
  scores: Scores;
  profil: string;
  bardon: LectureBardon;
}

const fmt = (n: number) => n.toFixed(1).replace('.', ',');

function Chips({ labels, element, solid }: { labels: string[]; element: Element; solid: boolean }) {
  const { couleur, clair } = ELEMENT_INFO[element];
  return (
    <div>
      {labels.map((l) => (
        <span key={l} className="el-chip"
          style={solid ? { background: couleur, color: '#fff' } : { background: clair, color: couleur }}>
          {l}
        </span>
      ))}
    </div>
  );
}

// Plain-language sentences of the Bardon reading — shared with the PDF export
export function bardonSentences(bardon: LectureBardon) {
  const blanc = bardon.dominantBlanc
    ? `Votre Miroir Blanc est dominé par ${ELEMENT_INFO[bardon.dominantBlanc].article} : votre ressource, la base de votre tempérament.`
    : 'Votre Miroir Blanc : aucun élément ne prédomine dans ce miroir.';
  const noir = bardon.dominantNoir
    ? `Votre Miroir Noir est dominé par ${ELEMENT_INFO[bardon.dominantNoir].article} : votre chantier prioritaire.`
    : 'Votre Miroir Noir : aucun élément ne prédomine dans ce miroir.';
  let synthese = '';
  if (bardon.memeElement && bardon.dominantBlanc) {
    synthese = `Votre tempérament de base est ${ELEMENT_INFO[bardon.dominantBlanc].article}, dans ses forces comme dans ses excès.`;
  } else if (bardon.dominantBlanc && bardon.dominantNoir) {
    synthese = `Votre ressource est ${ELEMENT_INFO[bardon.dominantBlanc].article}, votre chantier est ${ELEMENT_INFO[bardon.dominantNoir].article}.`;
  }
  return { blanc, noir, synthese };
}

export default function ElementsResults({ scores, profil, bardon }: ElementsResultsProps) {
  const texte = INTERPRETATIONS[profil];
  const { blanc, noir, synthese } = bardonSentences(bardon);

  return (
    <div className="space-y-6">
      {/* 1. Lecture selon Bardon */}
      <section className="el-card" style={{ textAlign: 'left', padding: 28 }}>
        <h3 style={{ fontSize: 20, marginBottom: 12 }}>Lecture selon Bardon</h3>
        <p>{blanc}</p>
        <p>{noir}</p>
        {synthese && <p className="mt-2 font-semibold" style={{ color: 'var(--titre)' }}>{synthese}</p>}

        {bardon.dominantNoir && bardon.defautsPrioritaires.length > 0 && (
          <div className="mt-5">
            <p className="font-semibold mb-2" style={{ color: 'var(--titre)' }}>Défauts à travailler en premier</p>
            <Chips labels={bardon.defautsPrioritaires} element={bardon.dominantNoir} solid />
          </div>
        )}
        {bardon.dominantNoir && bardon.qualitesACultiver.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2" style={{ color: 'var(--titre)' }}>
              Qualités à cultiver en regard <span className="font-normal text-sm text-gray-500">(transmutation : même élément, polarité positive)</span>
            </p>
            <Chips labels={bardon.qualitesACultiver} element={bardon.dominantNoir} solid={false} />
          </div>
        )}
      </section>

      {/* 2. Radar + 3. Tableau des scores */}
      <section className="el-card grid md:grid-cols-2 gap-6 items-center" style={{ textAlign: 'left', padding: 28 }}>
        <div id="el-radar" className="flex justify-center"><ElementsRadar scores={scores} /></div>
        <table className="el-table">
          <thead>
            <tr><th>Élément</th><th className="num">Force</th><th className="num">Ombre</th><th className="num">Équilibre</th></tr>
          </thead>
          <tbody>
            {ELEMENTS.map((e) => (
              <tr key={e}>
                <td><span className="el-dot" style={{ background: ELEMENT_INFO[e].couleur }} />{ELEMENT_INFO[e].nom}</td>
                <td className="num">{fmt(scores[e].force)} %</td>
                <td className="num">{fmt(scores[e].ombre)} %</td>
                <td className="num" style={{ color: scores[e].equilibre >= 0 ? '#2f7d32' : '#b23b3b' }}>
                  {scores[e].equilibre >= 0 ? '+' : ''}{fmt(scores[e].equilibre)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. Profil — extension coeurdelom.fr, not « selon Bardon » (spec-v2, Fondement) */}
      {texte && (
        <section className="el-card" style={{ textAlign: 'left', padding: 28, borderLeft: `6px solid ${texte.couleur}` }}>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Profil élémentaire · lecture complémentaire Cœur de l&apos;Om</p>
          <h3 style={{ fontSize: 20, color: texte.couleur }}>{texte.titre}</h3>
          <p className="text-sm text-gray-500 mb-3">{texte.sousTitre}</p>
          <p style={{ fontStyle: 'italic' }}>« {texte.texte} »</p>
        </section>
      )}
    </div>
  );
}
