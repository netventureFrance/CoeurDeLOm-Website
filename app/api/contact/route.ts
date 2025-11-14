import { NextRequest, NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/airtable';
import { sendContactConfirmation, sendAdminNotification } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, language, gdprConsent, newsletterConsent } = body;

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

    // Submit to Airtable
    const success = await submitContactForm({
      name,
      email,
      message,
      language: language || 'fr',
      gdprConsent,
      newsletterConsent: newsletterConsent || false,
    });

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
