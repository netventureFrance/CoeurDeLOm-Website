import { NextRequest, NextResponse } from 'next/server';
import { checkChromoBioTestEligibility, submitChromoBioTestRegistration } from '@/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, language, gdprConsent } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate GDPR consent
    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'GDPR consent required' },
        { status: 400 }
      );
    }

    // Check if user can take the test (4-week restriction)
    const eligibility = await checkChromoBioTestEligibility(name, email);

    if (!eligibility.canTake) {
      return NextResponse.json(
        {
          error: 'test_restricted',
          lastTestDate: eligibility.lastTestDate,
          daysRemaining: eligibility.daysRemaining,
        },
        { status: 403 }
      );
    }

    // Submit registration to Airtable
    const success = await submitChromoBioTestRegistration({
      name,
      email,
      phone,
      language: language || 'fr',
      gdprConsent,
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to submit registration' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('ChromoBio pre-test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
