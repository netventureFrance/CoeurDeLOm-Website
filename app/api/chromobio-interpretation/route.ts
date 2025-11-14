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

1. **SHORT INTERPRETATION** (to spark curiosity and encourage booking):
   - Create 3 separate sentences (one for each category: excess, balanced, shortage)
   - Make each sentence intriguing and curiosity-provoking
   - Hint at deeper insights without revealing everything
   - Mention specific colors and what they might reveal
   - End with an invitation to discover more with Valérie
   - Encourage them to trust their intuition
   - Make it appealing enough to want to learn more
   - NO markdown, NO asterisks, NO special formatting - plain text only

2. **DETAILED INTERPRETATION** (for the full reading):
   - Write 3-5 paragraphs of deep psychological and energetic analysis
   - Explain what the color pattern reveals about their current life situation
   - Discuss the energetic implications using ChromoBioEnergie and Aura-Soma principles
   - Mention how Equilibrium bottles and color therapy could help restore balance
   - Reference chakras, energy flow, and emotional patterns
   - Be warm, empathetic, and professionally insightful
   - NO markdown, NO asterisks, NO special formatting - plain text only
   - Use simple paragraph breaks (blank lines) between paragraphs

FORMAT YOUR RESPONSE EXACTLY LIKE THIS (using these exact delimiters):

===SHORT_EXCESS===
Your sentence about excess colors here
===SHORT_BALANCED===
Your sentence about balanced colors here
===SHORT_SHORTAGE===
Your sentence about shortage colors here
===DETAILED===
Your detailed interpretation here with multiple paragraphs.

Each paragraph separated by blank lines.

Make this insightful and worth discovering.
===END===

Important content guidelines:
- Write naturally and fluently in ${languageInstructions}
- Be specific about the colors mentioned in each category
- Make the short interpretation curiosity-provoking and inviting
- Hint that Valérie can help them understand the deeper meaning
- Encourage trusting their intuition about the colors they chose
- In detailed interpretation, reference Aura-Soma Equilibrium bottles and ChromoBioEnergie
- Emphasize extreme cases (0 or 8) as they are energetically significant
- Make the detailed interpretation insightful and worth discovering`;

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

    // Parse using delimiters instead of JSON parsing
    const extractSection = (text: string, startDelimiter: string, endDelimiter: string): string => {
      const startIndex = text.indexOf(startDelimiter);
      if (startIndex === -1) {
        console.error(`❌ Delimiter not found: ${startDelimiter}`);
        return '';
      }
      const contentStart = startIndex + startDelimiter.length;
      const endIndex = text.indexOf(endDelimiter, contentStart);
      if (endIndex === -1) {
        console.error(`❌ End delimiter not found: ${endDelimiter}`);
        return '';
      }
      return text.substring(contentStart, endIndex).trim();
    };

    // Extract each section
    const shortExcess = extractSection(responseText, '===SHORT_EXCESS===', '===SHORT_BALANCED===');
    const shortBalanced = extractSection(responseText, '===SHORT_BALANCED===', '===SHORT_SHORTAGE===');
    const shortShortage = extractSection(responseText, '===SHORT_SHORTAGE===', '===DETAILED===');
    const detailed = extractSection(responseText, '===DETAILED===', '===END===');

    console.log('✅ SHORT EXCESS:', shortExcess.substring(0, 100) + '...');
    console.log('✅ SHORT BALANCED:', shortBalanced.substring(0, 100) + '...');
    console.log('✅ SHORT SHORTAGE:', shortShortage.substring(0, 100) + '...');
    console.log('✅ DETAILED length:', detailed.length, 'characters');
    console.log('✅ DETAILED preview:', detailed.substring(0, 200) + '...');

    // Construct the response object
    const interpretation = {
      short: {
        excess: shortExcess,
        balanced: shortBalanced,
        shortage: shortShortage,
      },
      detailed: detailed,
    };

    return NextResponse.json(interpretation);
  } catch (error) {
    console.error('Error generating interpretation:', error);
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
