import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // allow long Opus generations (streamed)

// Mirror the admin auth guard used by /api/admin/auth (stateless HMAC token).
function verifyAdmin(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;
  try {
    const [header, payload, signature] = token.split('.');
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');
    if (signature !== expected) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp >= Date.now();
  } catch {
    return false;
  }
}

const LANGUAGE_NAME: Record<string, string> = { FR: 'français', DE: 'Deutsch', EN: 'English' };

const SYSTEM_PROMPT = `Tu es une astrologue experte qui rédige pour Valérie (Cœur de l'OM). Ton style est ANALYTIQUE, PRÉCIS et DENSE — pas de prose réconfortante, pas de clichés, pas de remplissage. Chaque affirmation doit s'appuyer sur une donnée concrète du thème.

EXIGENCES DE FOND (essentiel) :
- Appuie CHAQUE interprétation sur un élément technique précis : signe + maison + aspect(s), maîtrises (planète maîtresse de l'Ascendant et des maisons), dignités/débilités, rétrogradations, amas (stellium), angularité.
- Cite explicitement les aspects par leur nom et leur écart (orbe) ; PRIORISE les aspects les plus serrés et les configurations majeures (conjonctions à l'angle, oppositions, carrés en T, grands trigones, stelliums). Dis lesquels structurent le thème et lesquels sont secondaires.
- Identifie les DOMINANTES (élément et mode dominants, hémisphères, planète la plus aspectée, maître d'Ascendant) à partir des positions fournies, et explique ce qu'elles impliquent concrètement.
- Sois SPÉCIFIQUE : aucune phrase ne doit pouvoir s'appliquer à n'importe qui. Si une formulation est un truisme d'horoscope, supprime-la.
- Nomme les TENSIONS réelles (carrés, oppositions, planètes en chute/exil, Saturne) sans fatalisme mais sans édulcorer : mécanisme, manifestation concrète, levier de travail.
- Va en PROFONDEUR : explique le mécanisme psychologique/énergétique derrière chaque configuration, pas seulement l'étiquette.
- Si une donnée manque ou est ambiguë (ex. heure de naissance incertaine), dis-le plutôt que d'inventer.
- Intègre TOUS les corps fournis, pas seulement les planètes classiques : planètes uraniennes (Cupido, Hadès, Zeus, Kronos, Apollon, Admète, Vulcanus, Poséidon), astéroïdes (Cérès, Pallas/Athéna, Junon, Vesta), Éris, Sedna, le Vertex et la Part de Fortune. Commente en priorité ceux qui forment un aspect serré, sont angulaires ou occupent une position marquante — ne les ignore pas.

INTERDITS : flatterie, mysticisme vague ("les astres vous sourient"), généralités signe-solaire, réassurance creuse, métaphores décoratives sans contenu.

STRUCTURE :
1. Structure d'ensemble (dominantes, maître d'Ascendant, configurations majeures, ce qui « tient » le thème)
2. Noyau identitaire — Soleil / Lune / Ascendant (signe, maison, aspects serrés)
3. Mental & communication — Mercure
4. Affectivité & valeurs — Vénus, Lune, axe des relations
5. Énergie, action & tensions — Mars et les aspects durs majeurs
6. Axe d'évolution — Nœuds, Saturne, et points spécifiques présents (Part de Fortune, etc.)

FORMATAGE : réponds directement avec la lecture finale en HTML (sans <html>, <head>, <body>, sans réflexion préalable visible) :
- <h3> pour les titres de section
- <p> pour les paragraphes
- <strong> pour les facteurs techniques (placements, aspects)
600 à 900 mots, denses. Écris entièrement dans la langue demandée.`;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!verifyAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
  }

  const { summary, meta, language } = await request.json();
  if (!summary) return NextResponse.json({ error: 'Missing chart data' }, { status: 400 });

  const lang = ['FR', 'DE', 'EN'].includes(language) ? language : 'FR';
  const userPrompt = `Rédige la lecture du thème natal ENTIÈREMENT en ${LANGUAGE_NAME[lang]}.

CLIENT : ${meta?.name || '(sans nom)'} — né(e) le ${meta?.date || '?'} à ${meta?.time || '?'}, ${meta?.place || '?'}
ZODIAQUE : ${meta?.zodiac || '?'} · MAISONS : ${meta?.houseSystem || '?'}

${summary}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Stream the text back so we don't hit the serverless sync-timeout on long
  // Opus generations. The client reads the body chunk by chunk.
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error('Astro interpretation stream error:', err);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
