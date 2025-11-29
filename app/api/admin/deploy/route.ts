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
      console.error('NETLIFY_BUILD_HOOK_URL not set');
      return NextResponse.json(
        { error: 'Build hook not configured. Add NETLIFY_BUILD_HOOK_URL to environment variables.' },
        { status: 500 }
      );
    }

    // Trigger Netlify build
    const response = await fetch(buildHookUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Netlify build hook failed:', response.status, text);
      return NextResponse.json(
        { error: `Failed to trigger deploy: ${response.status}` },
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
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    );
  }
}
