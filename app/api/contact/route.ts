import { NextRequest, NextResponse } from 'next/server';
import { submitContactFormWithMessage } from '@/lib/airtable';
import { sendContactConfirmation, sendAdminNotification } from '@/lib/resend';

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
    const { name, email, phone, message, language, gdprConsent, newsletterConsent, mathAnswer, expectedAnswer, formLoadTime } = body;

    // Anti-bot: Check time (minimum 1 second to fill form)
    if (formLoadTime) {
      const timeSpent = Date.now() - formLoadTime;
      if (timeSpent < 1000) {
        console.log('Bot detected: Form submitted too fast', { timeSpent, ip: getClientIp(request) });
        return NextResponse.json(
          { error: 'Form submitted too quickly' },
          { status: 400 }
        );
      }
    }

    // Anti-bot: Validate math answer
    if (mathAnswer !== expectedAnswer) {
      console.log('Bot detected: Wrong math answer', { mathAnswer, expectedAnswer, ip: getClientIp(request) });
      return NextResponse.json(
        { error: 'Invalid security answer' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
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

    // Get client IP
    const ipAddress = getClientIp(request);

    // Submit to Airtable (creates contact + linked message with IP)
    const success = await submitContactFormWithMessage({
      name,
      email,
      phone,
      message,
      language: language || 'fr',
      gdprConsent,
      newsletterConsent: newsletterConsent || false,
    }, ipAddress);

    if (success) {
      // Send confirmation email to user
      await sendContactConfirmation(email, name, language);

      // Send notification email to admin
      await sendAdminNotification(name, email, message, newsletterConsent);

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
