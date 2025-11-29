import { NextRequest, NextResponse } from 'next/server';
import {
  findRecentChromoBioTest,
  saveChromoBioTestResults,
  getChromoBioTestWithContact,
  ChromoBioTestResults,
  CHROMOBIO_COLORS,
} from '@/lib/airtable';
import { sendChromoBioResults } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, colorValues, briefInterpretation, detailedInterpretation } = body;

    // Validate required fields
    if (!email || !colorValues || !briefInterpretation || !detailedInterpretation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate color values
    for (const color of CHROMOBIO_COLORS) {
      if (typeof colorValues[color] !== 'number' || colorValues[color] < 0 || colorValues[color] > 8) {
        return NextResponse.json(
          { error: `Invalid value for color: ${color}` },
          { status: 400 }
        );
      }
    }

    // Find the most recent test record for this email
    const testRecordId = await findRecentChromoBioTest(email);

    if (!testRecordId) {
      return NextResponse.json(
        { error: 'No pending test found for this email. Please register first.' },
        { status: 404 }
      );
    }

    // Prepare results object
    const results: ChromoBioTestResults = {
      colorValues,
      briefInterpretation: {
        excess: briefInterpretation.excess || '',
        balanced: briefInterpretation.balanced || '',
        deficient: briefInterpretation.deficient || '',
      },
      detailedInterpretation,
    };

    // Save results to Airtable
    const saveSuccess = await saveChromoBioTestResults(testRecordId, results);

    if (!saveSuccess) {
      return NextResponse.json(
        { error: 'Failed to save test results' },
        { status: 500 }
      );
    }

    // Get contact info for sending email
    const contactInfo = await getChromoBioTestWithContact(testRecordId);

    if (contactInfo) {
      // Send results email to user (CC to Valérie)
      await sendChromoBioResults(
        contactInfo.contactEmail,
        contactInfo.contactName,
        contactInfo.language,
        results
      );
    }

    return NextResponse.json({
      success: true,
      testRecordId,
    });
  } catch (error) {
    console.error('ChromoBio results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
