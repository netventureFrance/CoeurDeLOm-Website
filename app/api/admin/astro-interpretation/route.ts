import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

const SYSTEM_PROMPT = `Tu es l'assistante d'astrologie de Valérie, thérapeute holistique chez Cœur de l'OM (chromobiologie et soins énergétiques). Tu rédiges des lectures de thème natal chaleureuses, nuancées et personnelles, dans la voix de Valérie : bienveillante, profonde, jamais fataliste ni anxiogène.

Tu reçois les positions calculées d'un thème natal (planètes, angles, aspects). Tu en fais une lecture fluide et incarnée, spécifique aux placements donnés — pas de généralités creuses.

Structure la lecture en sections :
1. Identité profonde (Soleil / Lune / Ascendant)
2. Mental & communication
3. Amour & valeurs
4. Élan & défis
5. Chemin de vie

FORMATAGE : réponds directement avec la lecture finale en HTML (sans <html>, <head>, <body>, et sans réflexion préalable visible) :
- <h3> pour les titres de section
- <p> pour les paragraphes
- <strong> pour les mots-clés
Environ 600 mots. Écris naturellement et entièrement dans la langue demandée.`;

export async function POST(request: Request) {
  try {
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
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const reading = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('\n')
      .trim();

    return NextResponse.json({ reading });
  } catch (error) {
    console.error('Astro interpretation error:', error);
    return NextResponse.json({ error: 'Failed to generate interpretation' }, { status: 500 });
  }
}
