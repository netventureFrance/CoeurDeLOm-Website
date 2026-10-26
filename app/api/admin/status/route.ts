import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { checkClaude, CLAUDE_FEATURES } from '@/lib/claude';
import { checkAirtable } from '@/lib/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function verifyAdmin(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;
  try {
    const [header, payload, signature] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
    if (signature !== expected) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp >= Date.now();
  } catch {
    return false;
  }
}

// GET /api/admin/status            → free checks (key, model, Airtable)
// GET /api/admin/status?generate=1 → also a tiny real Claude request (a fraction of a cent)
export async function GET(request: Request) {
  const cookieStore = await cookies();
  if (!verifyAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const generate = new URL(request.url).searchParams.get('generate') === '1';
  const [claude, airtable] = await Promise.all([checkClaude(generate), checkAirtable()]);
  return NextResponse.json({
    claude: { ...claude, features: CLAUDE_FEATURES },
    airtable,
    env: {
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      AIRTABLE_API_KEY: !!process.env.AIRTABLE_API_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      IMGBB_API_KEY: !!process.env.IMGBB_API_KEY,
      NETLIFY_BUILD_HOOK_URL: !!process.env.NETLIFY_BUILD_HOOK_URL,
    },
    checkedAt: new Date().toISOString(),
  });
}
