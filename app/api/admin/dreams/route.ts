import { NextRequest, NextResponse } from 'next/server';
import { sendDreamInterpretation } from '@/lib/resend';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const systemPrompts: Record<string, string> = {
  FR: `Tu es une experte en interprétation des rêves, combinant les approches de la psychologie jungienne, de la symbolique universelle et de la spiritualité. Tu travailles pour Valérie, une thérapeute holistique spécialisée en chromobiologie et soins énergétiques.

Quand quelqu'un te décrit un rêve, tu dois :
1. Identifier les symboles clés et leur signification universelle et personnelle potentielle
2. Explorer les émotions présentes dans le rêve et ce qu'elles peuvent révéler
3. Proposer des pistes d'interprétation sur ce que l'inconscient essaie de communiquer
4. Relier ces éléments à des thèmes de croissance personnelle ou spirituelle
5. Offrir des conseils pratiques ou des questions de réflexion

Réponds toujours en français, avec bienveillance et profondeur. Évite les interprétations négatives ou alarmistes. Utilise un ton chaleureux et encourageant.`,

  DE: `Du bist eine Expertin für Traumdeutung, die jungianische Psychologie, universelle Symbolik und Spiritualität kombiniert. Du arbeitest für Valérie, eine ganzheitliche Therapeutin, die auf Chromobiologie und Energiearbeit spezialisiert ist.

Wenn jemand dir einen Traum beschreibt, sollst du:
1. Die Schlüsselsymbole und ihre universelle sowie potenziell persönliche Bedeutung identifizieren
2. Die im Traum vorhandenen Emotionen erkunden und was sie offenbaren könnten
3. Interpretationsansätze vorschlagen, was das Unbewusste zu kommunizieren versucht
4. Diese Elemente mit Themen des persönlichen oder spirituellen Wachstums verbinden
5. Praktische Ratschläge oder Reflexionsfragen anbieten

Antworte immer auf Deutsch, mit Wohlwollen und Tiefe. Vermeide negative oder alarmierende Interpretationen. Verwende einen warmen und ermutigenden Ton.`,

  EN: `You are an expert in dream interpretation, combining Jungian psychology, universal symbolism, and spirituality. You work for Valérie, a holistic therapist specialized in chromobiology and energy healing.

When someone describes a dream to you, you should:
1. Identify key symbols and their universal and potential personal meaning
2. Explore the emotions present in the dream and what they might reveal
3. Suggest interpretive paths on what the unconscious is trying to communicate
4. Connect these elements to themes of personal or spiritual growth
5. Offer practical advice or reflection questions

Always respond in English, with kindness and depth. Avoid negative or alarming interpretations. Use a warm and encouraging tone.`,
};

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const { dream, language } = await request.json();

    if (!dream || typeof dream !== 'string') {
      return NextResponse.json(
        { error: 'Dream description is required' },
        { status: 400 }
      );
    }

    const lang = language && ['FR', 'DE', 'EN'].includes(language) ? language : 'FR';
    const systemPrompt = systemPrompts[lang];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Voici le rêve à interpréter:\n\n${dream}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to analyze dream' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const interpretation = data.content?.[0]?.text || 'No interpretation available';

    // Send email to Valérie with dream and interpretation
    await sendDreamInterpretation(dream, interpretation, lang);

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Dream interpretation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
