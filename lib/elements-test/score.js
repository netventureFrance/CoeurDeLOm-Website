/**
 * score.js — Test d'Équilibre des 4 Éléments (coeurdelom.fr)
 * Calcul pondéré, lecture bardonienne et détection du profil (v2 — 25/10/2026)
 *
 * Entrées :
 *   selQual, selDef : tableaux [{ id: number, intensite: 1|2|3 }]
 *   db              : contenu de elements.json  [{ id, label, element, type }]
 *
 * Sorties : voir evaluate() en bas de fichier.
 */

export const ELEMENTS = ['feu', 'eau', 'air', 'terre'];
export const POIDS = { 1: 1, 2: 2, 3: 3 };

// ---------------------------------------------------------------- scores
export function computeScores(selQual, selDef, db) {
  const byId = Object.fromEntries(db.map((x) => [x.id, x]));
  const sumQ = { feu: 0, eau: 0, air: 0, terre: 0 };
  const sumD = { feu: 0, eau: 0, air: 0, terre: 0 };
  const nbQ = { feu: 0, eau: 0, air: 0, terre: 0 };
  const nbD = { feu: 0, eau: 0, air: 0, terre: 0 };
  let totQ = 0;
  let totD = 0;

  for (const { id, intensite } of selQual) {
    const e = byId[id]?.element;
    if (!e) continue;
    const w = POIDS[intensite] ?? 1;
    sumQ[e] += w; totQ += w; nbQ[e] += 1;
  }
  for (const { id, intensite } of selDef) {
    const e = byId[id]?.element;
    if (!e) continue;
    const w = POIDS[intensite] ?? 1;
    sumD[e] += w; totD += w; nbD[e] += 1;
  }

  const scores = {};
  for (const e of ELEMENTS) {
    const force = totQ ? (sumQ[e] / totQ) * 100 : 0;
    const ombre = totD ? (sumD[e] / totD) * 100 : 0;
    scores[e] = { force, ombre, equilibre: force - ombre, nbQual: nbQ[e], nbDef: nbD[e] };
  }
  const ratioOmbre = totQ + totD ? totD / (totQ + totD) : 0;
  return { scores, totQ, totD, ratioOmbre };
}

// ------------------------------------------------- lecture bardonienne
export function lectureBardon(scores, selDef, db) {
  const byId = Object.fromEntries(db.map((x) => [x.id, x]));
  // élément dominant ; null si les deux premiers sont à égalité (< 2 points d'écart)
  const argmax = (key) => {
    const sorted = [...ELEMENTS].sort((a, b) => scores[b][key] - scores[a][key]);
    return scores[sorted[0]][key] - scores[sorted[1]][key] < 2 ? null : sorted[0];
  };
  const dominantBlanc = argmax('force');
  const dominantNoir = argmax('ombre');

  const defNoir = selDef
    .map((s) => ({ ...s, ...byId[s.id] }))
    .filter((d) => dominantNoir && d.element === dominantNoir);
  let prioritaires = defNoir.filter((d) => d.intensite === 3);
  if (!prioritaires.length) prioritaires = defNoir.filter((d) => d.intensite === 2);
  if (!prioritaires.length) prioritaires = defNoir;

  // qualités du même élément à cultiver (transmutation bardonienne : polarité positive du même élément)
  const qualitesOpposees = dominantNoir
    ? db.filter((x) => x.type === 'qualite' && x.element === dominantNoir)
    : [];

  return {
    dominantBlanc,            // null = aucun élément ne prédomine dans le miroir blanc
    dominantNoir,             // null = aucun élément ne prédomine dans le miroir noir
    memeElement: !!dominantBlanc && dominantBlanc === dominantNoir,
    defautsPrioritaires: prioritaires.map((d) => d.label),
    qualitesACultiver: qualitesOpposees.slice(0, 6).map((q) => q.label),
  };
}

// -------------------------------------------------------- profil (32)
export function detectProfile(scores, ratioOmbre, totQ, totD) {
  if (!totQ || !totD) return 'incomplet';

  const F = Object.fromEntries(ELEMENTS.map((e) => [e, scores[e].force]));
  const O = Object.fromEntries(ELEMENTS.map((e) => [e, scores[e].ombre]));
  const fv = Object.values(F);
  const ov = Object.values(O);
  const spreadF = Math.max(...fv) - Math.min(...fv);
  const spreadO = Math.max(...ov) - Math.min(...ov);

  // P1 — profils globaux
  if (ratioOmbre >= 0.75 && spreadO < 25 && Math.max(...fv) < 50) return 'desequilibre-total';
  if (ratioOmbre <= 0.25 && spreadF < 25 && Math.max(...ov) < 50) return 'qualites-abondantes';
  if (ELEMENTS.every((e) => F[e] >= 15 && F[e] <= 35 && O[e] >= 15 && O[e] <= 35)) return 'equilibre-parfait';

  // P2 — éléments absents (poids = force + ombre, somme 200)
  const absents = ELEMENTS.filter((e) => F[e] + O[e] < 6);
  const presents = ELEMENTS.filter((e) => !absents.includes(e));
  if (absents.length === 3) {
    const e = presents[0];
    return O[e] <= F[e] ? `maitrise-${e}` : `desequilibre-${e}`;
  }
  if (absents.length === 2) return `bi-${presents[0]}-${presents[1]}`;
  if (absents.length === 1) {
    if (presents.every((e) => F[e] >= 18)) return `tri-sans-${absents[0]}`;
    return `absent-${absents[0]}`;
  }

  // P3 — oppositions
  const tense = (a, b) => F[a] >= 28 && F[b] >= 28 && O[a] >= 28 && O[b] >= 28;
  if (tense('feu', 'eau')) return 'opposition-feu-eau';
  if (tense('air', 'terre')) return 'opposition-air-terre';

  // P4 — bi-élémentaire
  const high = ELEMENTS.filter((e) => F[e] >= 30);
  const rest = ELEMENTS.filter((e) => !high.includes(e));
  if (high.length === 2 && rest.every((e) => F[e] < 22)) return `bi-${high[0]}-${high[1]}`;

  // P5 — élément simple dominant
  const topF = ELEMENTS.reduce((a, b) => (F[b] > F[a] ? b : a));
  const topO = ELEMENTS.reduce((a, b) => (O[b] > O[a] ? b : a));
  if (F[topF] >= 35) {
    if (O[topF] <= 22) return `maitrise-${topF}`;
    if (O[topF] >= 35) return `puissant-${topF}`;
  }
  if (O[topO] >= 35 && F[topO] < 28) return `desequilibre-${topO}`;

  // P6 — défaut
  if (ratioOmbre >= 0.38 && ratioOmbre <= 0.62 && ELEMENTS.every((e) => F[e] >= 8 && O[e] >= 8)) {
    return 'initiant-sincere';
  }
  return F[topF] >= O[topO] ? `maitrise-${topF}` : `desequilibre-${topO}`;
}

// ------------------------------------------------------------ façade
export function evaluate(selQual, selDef, db) {
  const { scores, totQ, totD, ratioOmbre } = computeScores(selQual, selDef, db);
  const profil = detectProfile(scores, ratioOmbre, totQ, totD);
  const bardon = profil === 'incomplet' ? null : lectureBardon(scores, selDef, db);
  return { scores, ratioOmbre, profil, bardon };
}
