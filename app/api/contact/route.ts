import { NextRequest, NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, language } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Submit to Airtable
    const success = await submitContactForm({
      name,
      email,
      message,
      language: language || 'fr',
    });

    if (success) {
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
