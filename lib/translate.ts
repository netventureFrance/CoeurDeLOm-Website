import Anthropic from '@anthropic-ai/sdk';

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
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const targetLanguage = languageNames[targetLang];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0,
      system: `You are a translation engine. Your ONLY job is to translate French text to ${targetLanguage}.

CRITICAL RULES:
- Output ONLY the translated text
- NEVER add phrases like "Here is the translation", "Voici la traduction", "Hier ist die Übersetzung"
- NEVER add explanations, notes, or commentary
- Preserve ALL HTML tags exactly as they appear (e.g., <h2>, <p>, <strong>, etc.)
- Start your response immediately with the translated content
- If the input contains HTML, output HTML with the same structure`,
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const translatedText = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : text;

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
