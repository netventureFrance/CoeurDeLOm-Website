import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Check authentication via JWT token
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;

  try {
    const [header, payload, signature] = token.split('.');
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) return false;

    // Verify signature
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return false;

    // Check expiry
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

// POST - Trigger Netlify deploy
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;

    if (!buildHookUrl) {
      return NextResponse.json(
        { error: 'Build hook not configured' },
        { status: 500 }
      );
    }

    // Trigger Netlify build
    const response = await fetch(buildHookUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to trigger deploy' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Deploy triggered successfully'
    });
  } catch (error) {
    console.error('Deploy trigger error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
