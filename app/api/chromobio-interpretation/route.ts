import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ColorResult {
  id: number;
  name: string;
  count: number;
  status: 'excess' | 'balanced' | 'shortage';
}

export async function POST(request: Request) {
  try {
    const { colorResults, lang } = await request.json();

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Prepare color data for Claude
    const excessColors = colorResults.filter((c: ColorResult) => c.status === 'excess');
    const balancedColors = colorResults.filter((c: ColorResult) => c.status === 'balanced');
    const shortageColors = colorResults.filter((c: ColorResult) => c.status === 'shortage');
    const extremeExcess = colorResults.filter((c: ColorResult) => c.count === 8);
    const extremeShortage = colorResults.filter((c: ColorResult) => c.count === 0);

    // Build the prompt based on language
    const languageMap: { [key: string]: string } = {
      fr: 'français',
      en: 'English',
      de: 'Deutsch'
    };
    const languageInstructions = languageMap[lang as string] || 'français';

    const prompt = `You are an expert in chromobiology and color therapy, specifically trained in Evelyne Monsallier's ChromoBioEnergie method. A person has just completed a chromobiology test where they eliminated 4 colors per row across 18 rows, leaving specific counts of each color.

Here are the results:

**Colors in EXCESS (>5 remaining):**
${excessColors.map((c: ColorResult) => `- ${c.name}: ${c.count} remaining${c.count === 8 ? ' (MAXIMUM INTENSITY - completely preserved)' : ''}`).join('\n') || 'None'}

**BALANCED colors (4-5 remaining):**
${balancedColors.map((c: ColorResult) => `- ${c.name}: ${c.count} remaining`).join('\n') || 'None'}

**Colors in SHORTAGE (<4 remaining):**
${shortageColors.map((c: ColorResult) => `- ${c.name}: ${c.count} remaining${c.count === 0 ? ' (COMPLETELY ELIMINATED - total rejection)' : ''}`).join('\n') || 'None'}

Please generate TWO interpretations in **${languageInstructions}**:

1. **SHORT INTERPRETATION** (for email marketing):
   - Create 3 separate sentences (one for each category: excess, balanced, shortage)
   - Each sentence should be warm, engaging, and psychologically insightful
   - Mention specific colors and what they reveal about the person
   - Pay special attention to extreme cases (count=0 or count=8)
   - Make it compelling enough to motivate booking a session
   - Format as JSON: {"excess": "...", "balanced": "...", "shortage": "..."}

2. **DETAILED INTERPRETATION** (for paid session discussion):
   - Write 3-5 paragraphs of deep psychological and energetic analysis
   - Explain what the color pattern reveals about their current life situation
   - Discuss the energetic implications of the excess/shortage patterns
   - Reference ChromoBioEnergie principles
   - Mention specific therapeutic approaches that could help
   - Be professional yet warm and empathetic
   - Include insights about chakras, energy flow, and emotional patterns where relevant

Return ONLY a valid JSON object with this exact structure:
{
  "short": {
    "excess": "sentence here",
    "balanced": "sentence here",
    "shortage": "sentence here"
  },
  "detailed": "multi-paragraph text here"
}

CRITICAL JSON FORMATTING RULES:
- Use \\n for line breaks within the "detailed" field (NOT actual newlines)
- All strings must be properly escaped for JSON
- No line breaks, tabs, or control characters except when escaped
- The entire response must be valid, parseable JSON

Important notes:
- Write naturally and fluently in ${languageInstructions}
- Be specific about the colors mentioned in each category
- If a category has no colors, write something like "No colors in this category" or adjust the interpretation accordingly
- Emphasize extreme cases (0 or 8) as they are clinically significant
- Make the short interpretation emotionally engaging to encourage booking
- Make the detailed interpretation worth paying for - deep, insightful, actionable
- For paragraph breaks in the detailed interpretation, use \\n\\n (double backslash-n)`;

    console.log('📤 Sending request to Claude API...');

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('📥 Received response from Claude API');

    // Extract the text from Claude's response
    let responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('📄 Claude raw response (first 500 chars):', responseText.substring(0, 500));

    // Extract JSON from response (Claude might add preamble text)
    // Find the first { and last } to get just the JSON object
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in Claude response');
    }

    let jsonText = responseText.substring(firstBrace, lastBrace + 1);

    // Clean the JSON: escape literal control characters
    // Simple approach: replace all literal newlines/tabs/returns with escaped versions
    jsonText = jsonText.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');

    // Parse the JSON response
    const interpretation = JSON.parse(jsonText);

    console.log('✅ SHORT interpretation:', JSON.stringify(interpretation.short));
    console.log('✅ DETAILED interpretation length:', interpretation.detailed?.length || 0, 'characters');

    return NextResponse.json(interpretation);
  } catch (error) {
    console.error('Error generating interpretation:', error);
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
