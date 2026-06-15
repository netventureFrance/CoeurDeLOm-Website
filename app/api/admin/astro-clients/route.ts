import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getAstroClients, saveAstroClient, deleteAstroClient } from '@/lib/airtable';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

async function authed() {
  const cookieStore = await cookies();
  return verifyAdmin(cookieStore.get('admin_token')?.value);
}

export async function GET() {
  if (!(await authed())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const clients = await getAstroClients();
  return NextResponse.json({ clients });
}

export async function POST(request: Request) {
  if (!(await authed())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const data = await request.json();
    if (!data?.name) return NextResponse.json({ error: 'Nom requis' }, { status: 400 });
    const id = await saveAstroClient(data);
    return NextResponse.json({ id });
  } catch (err) {
    console.error('astro-clients save error:', err);
    return NextResponse.json(
      { error: 'Échec de l\'enregistrement (la table Astro_Clients existe-t-elle dans Airtable ?)' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await authed())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  try {
    await deleteAstroClient(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('astro-clients delete error:', err);
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 });
  }
}
