import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import elementsDb from '@/lib/elements-test/elements.json';
import { evaluate, ELEMENTS } from '@/lib/elements-test/score';
import type { Element, ElementEntry, Selection } from '@/lib/elements-test/score';
import { INTERPRETATIONS } from '@/lib/elements-test/interpretations';
import { streamClaudeText } from '@/lib/claude';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // streamed, like the astro reading

const DB = elementsDb as ElementEntry[];
const NOM: Record<Element, string> = { feu: 'Feu', eau: 'Eau', air: 'Air', terre: 'Terre' };
const INTENSITE: Record<number, string> = { 3: 'très fort (1er groupe de Bardon)', 2: 'souvent (2e groupe)', 1: 'parfois (3e groupe)' };

function verifyAdmin(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;
  try {
    const [header, payload, signature] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
    if (signature !== expected) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp >= Date.now();
  } catch {
    return false;
  }
}

const SYSTEM_PROMPT = `Tu rédiges, pour Valérie (Cœur de l'Om, Heilpraktikerin et naturopathe à Montpellier), la lecture approfondie d'un Test des 4 Éléments fait en séance avec un client. La lecture lui sera remise par écrit.

FONDEMENT — Franz Bardon, « Le Chemin de la Véritable Initiation Magique », Degré I :
- Deux miroirs : le miroir blanc (qualités) et le miroir noir (défauts). Chaque trait se rattache à un élément : Feu (colérique), Air (sanguin), Eau (mélancolique), Terre (flegmatique), chacun avec une polarité active et une polarité négative.
- Trois groupes d'intensité : le premier groupe rassemble les traits les plus forts, ceux à travailler en priorité.
- La seule règle d'interprétation de Bardon : reconnaître quel élément prédomine dans le miroir blanc (la ressource, la base du tempérament) et dans le miroir noir (le déséquilibre principal), en vue de l'équilibre des quatre éléments. Le travail sur les défauts se fait ensuite par observation, autosuggestion et transmutation du défaut en la qualité du même élément.
- Ce qui va au-delà (profil bi-élémentaire, oppositions, etc.) est une lecture complémentaire de Cœur de l'Om : ne le présente jamais comme « selon Bardon ». N'invente aucune citation de Bardon.

EXIGENCES :
- Appuie-toi sur les MOTS RÉELLEMENT COCHÉS et leur intensité. Cite-les (en <strong>). Aucune phrase ne doit pouvoir s'appliquer à n'importe qui.
- Relie les mots entre eux : motifs récurrents, tensions (une qualité et un défaut qui sont les deux faces d'une même énergie), élément faible ou absent.
- Transmutation : pour chaque défaut prioritaire, choisis UNE qualité précise du même élément, dans la liste fournie, qui en est vraiment la polarité positive (sens proche, énergie transformée). Explique en une phrase le passage de l'un à l'autre.
- Le texte de profil fourni est déjà donné au client : approfondis-le, ne le contredis pas et ne le répète pas.
- Si des notes de séance sont fournies, utilise-les comme contexte pour nuancer, sans les citer ni les paraphraser directement.
- Ton : vouvoiement, chaleureux, précis, sans jugement. Ni flatterie, ni mysticisme vague, ni réassurance creuse. Les ombres sont une matière de travail, jamais un verdict.
- Aucun diagnostic médical ou psychologique, aucune promesse thérapeutique.

STRUCTURE (titres en <h3>, dans cet ordre) :
1. Votre tempérament élémentaire — vue d'ensemble, ce qui tient le portrait
2. Le Miroir Blanc — vos ressources
3. Le Miroir Noir — votre chantier
4. Transmutation — de l'ombre à la qualité (un <p> par défaut prioritaire : <strong>défaut → qualité</strong>, puis l'explication)
5. L'élément à éveiller — l'élément le plus faible et ce qu'il apporterait
6. Pistes pour les semaines à venir — 3 à 5 pratiques concrètes et quotidiennes, dans l'esprit de l'introspection de Bardon

FORMAT : réponds directement par la lecture finale en HTML, sans <html>, <head> ni <body> : <h3> pour les titres, <p> pour les paragraphes, <strong> pour les mots du test. 600 à 900 mots, en français.`;

function describeMirror(sel: Selection[]): string {
  const byId = Object.fromEntries(DB.map((x) => [x.id, x]));
  return ELEMENTS.map((e) => {
    const words = sel
      .map((s) => ({ ...s, entry: byId[s.id] }))
      .filter((s) => s.entry?.element === e)
      .sort((a, b) => b.intensite - a.intensite);
    if (!words.length) return `- ${NOM[e]} : aucun mot`;
    const groups = [3, 2, 1]
      .map((i) => {
        const labels = words.filter((w) => w.intensite === i).map((w) => w.entry.label);
        return labels.length ? `${INTENSITE[i]} : ${labels.join(', ')}` : '';
      })
      .filter(Boolean);
    return `- ${NOM[e]} : ${groups.join(' ; ')}`;
  }).join('\n');
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!verifyAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Service IA non configuré' }, { status: 500 });
  }

  const { qualites, defauts, notes } = await request.json();
  if (!Array.isArray(qualites) || !Array.isArray(defauts) || !qualites.length || !defauts.length) {
    return NextResponse.json({ error: 'Il faut au moins un mot dans chaque miroir' }, { status: 400 });
  }

  // Recompute on the server from the ids, so the prompt can't drift from score.js
  const { scores, ratioOmbre, profil, bardon } = evaluate(qualites, defauts, DB);
  if (!bardon) return NextResponse.json({ error: 'Résultat incomplet' }, { status: 400 });
  const texte = INTERPRETATIONS[profil];
  const f = (n: number) => n.toFixed(1);
  const qualitesNoir = bardon.dominantNoir
    ? DB.filter((x) => x.type === 'qualite' && x.element === bardon.dominantNoir).map((x) => x.label).join(', ')
    : '';

  const userPrompt = `MIROIR BLANC (qualités cochées, par élément et intensité) :
${describeMirror(qualites)}

MIROIR NOIR (défauts cochés, par élément et intensité) :
${describeMirror(defauts)}

SCORES (force = part des qualités, ombre = part des défauts, pondérées 1/2/3) :
${ELEMENTS.map((e) => `- ${NOM[e]} : force ${f(scores[e].force)} %, ombre ${f(scores[e].ombre)} %, équilibre ${f(scores[e].equilibre)}`).join('\n')}
Part globale des défauts : ${Math.round(ratioOmbre * 100)} % (50 % = autant de qualités que de défauts).

LECTURE SELON BARDON (calculée) :
- Élément dominant du miroir blanc : ${bardon.dominantBlanc ? NOM[bardon.dominantBlanc] : 'aucun élément ne prédomine'}
- Élément dominant du miroir noir : ${bardon.dominantNoir ? NOM[bardon.dominantNoir] : 'aucun élément ne prédomine'}
- Défauts prioritaires : ${bardon.defautsPrioritaires.join(', ') || 'aucun'}
${qualitesNoir ? `- Qualités disponibles pour la transmutation (élément ${NOM[bardon.dominantNoir!]}) : ${qualitesNoir}` : ''}

PROFIL COMPLÉMENTAIRE déjà remis au client : ${texte ? `${texte.titre} (${texte.sousTitre}) — « ${texte.texte} »` : profil}
${typeof notes === 'string' && notes.trim() ? `\nNOTES DE SÉANCE DE VALÉRIE (contexte, ne pas citer) :\n${notes.trim()}` : ''}`;

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const text of streamClaudeText({ system: SYSTEM_PROMPT, user: userPrompt })) {
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        console.error('Elements interpretation stream error:', err);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
