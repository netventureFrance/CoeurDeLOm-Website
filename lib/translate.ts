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
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.3,
      system: `You are a professional translator. You translate French text to ${targetLanguage}.
CRITICAL RULES:
- Output ONLY the translated text, nothing else
- NO preamble, NO commentary, NO explanations like "Here is the translation:"
- Preserve ALL HTML tags exactly (<p>, <br>, <em>, <strong>, <ul>, <li>, <h2>, <h3>, etc.)
- Keep paragraph structure and line breaks
- Start your response directly with the translated content`,
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
  excerptFR: string,
  contentFR: string,
  targetLang: 'de' | 'en'
): Promise<{ title: string; excerpt: string; content: string }> {
  console.log(`🔄 Translating blog post to ${targetLang}...`);

  const [title, excerpt, content] = await Promise.all([
    translateWithClaude(titleFR, targetLang),
    translateWithClaude(excerptFR, targetLang),
    translateWithClaude(contentFR, targetLang),
  ]);

  return { title, excerpt, content };
}
