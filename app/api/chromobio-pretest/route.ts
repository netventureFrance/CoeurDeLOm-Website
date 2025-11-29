import { NextRequest, NextResponse } from 'next/server';
import { checkChromoBioTestEligibilityByEmail, submitChromoBioTestWithContact } from '@/lib/airtable';

// Get client IP address from request headers
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return '127.0.0.1';
}

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
    const eligibility = await checkChromoBioTestEligibilityByEmail(email);

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

    // Get client IP
    const ipAddress = getClientIp(request);

    // Submit registration to Airtable (creates contact + linked test record with IP)
    const success = await submitChromoBioTestWithContact({
      name,
      email,
      phone,
      language: language || 'fr',
      gdprConsent,
    }, ipAddress);

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
