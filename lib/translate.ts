import { streamClaudeText } from '@/lib/claude';

const languageNames: { [key: string]: string } = {
  fr: 'French',
  de: 'German',
  en: 'English',
};

/**
 * Translate text from French to another language using Claude API
 */
export async function translateWithClaude(
  text: string,
  targetLang: 'de' | 'en'
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return text; // Return original text if no API key
  }

  if (!text || text.trim() === '') {
    return '';
  }

  try {
    const targetLanguage = languageNames[targetLang];

    // Streamed so long articles don't hit the HTTP timeout. Translation needs
    // little reasoning (low effort); max_tokens covers thinking plus the text.
    // A refused or truncated translation throws, so the French original is kept.
    let translatedText = '';
    for await (const chunk of streamClaudeText({
      system: `You are a translation engine. Your ONLY job is to translate French text to ${targetLanguage}.

CRITICAL RULES:
- Output ONLY the translated text
- NEVER add phrases like "Here is the translation", "Voici la traduction", "Hier ist die Übersetzung"
- NEVER add explanations, notes, or commentary
- Preserve ALL HTML tags exactly as they appear (e.g., <h2>, <p>, <strong>, etc.)
- Start your response immediately with the translated content
- If the input contains HTML, output HTML with the same structure`,
      user: text,
      maxTokens: 32000,
      effort: 'low',
      onIncomplete: 'throw',
    })) {
      translatedText += chunk;
    }
    translatedText = translatedText.trim() || text;

    console.log(`✅ Translated to ${targetLanguage}: ${translatedText.substring(0, 100)}...`);
    return translatedText;
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return text; // Return original text on error
  }
}

/**
 * Translate blog post fields from French to target language
 */
export async function translateBlogFields(
  titleFR: string,
  contentFR: string,
  targetLang: 'de' | 'en'
): Promise<{ title: string; content: string }> {
  console.log(`🔄 Translating blog post to ${targetLang}...`);

  const [title, content] = await Promise.all([
    translateWithClaude(titleFR, targetLang),
    translateWithClaude(contentFR, targetLang),
  ]);

  return { title, content };
}
