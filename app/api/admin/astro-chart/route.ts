import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import SwissEph from 'swisseph-wasm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mirror the admin auth guard used by /api/admin/auth (stateless HMAC token).
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

// Uranian / trans-Neptunian planets (Hamburg School) — Swiss Ephemeris body ids.
const URANIAN: { id: number; key: string; label: string }[] = [
  { id: 40, key: 'cupido', label: 'Cupido' },
  { id: 41, key: 'hades', label: 'Hadès' },
  { id: 42, key: 'zeus', label: 'Zeus' },
  { id: 43, key: 'kronos', label: 'Kronos' },
  { id: 44, key: 'apollon', label: 'Apollon' },
  { id: 45, key: 'admetos', label: 'Admète' },
  { id: 46, key: 'vulkanus', label: 'Vulcanus' },
  { id: 47, key: 'poseidon', label: 'Poséidon' },
];

const HOUSE_CODE: Record<string, string> = {
  placidus: 'P', koch: 'K', 'whole-sign': 'W', 'equal-house': 'A',
  campanus: 'C', regiomontanus: 'R', topocentric: 'T',
};

const norm360 = (d: number) => ((d % 360) + 360) % 360;

// Initialise the WASM engine once and reuse across invocations.
let swePromise: Promise<any> | null = null;
function getSwe() {
  if (!swePromise) {
    swePromise = (async () => {
      const swe = new SwissEph();
      await swe.initSwissEph();
      return swe;
    })();
  }
  return swePromise;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!verifyAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { utc, latitude, longitude, zodiac, houseSystem } = await request.json();
    if (!utc || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'Missing chart input' }, { status: 400 });
    }

    const swe = await getSwe();
    const SPEED = swe.SEFLG_SPEED ?? 256;
    const MOSEPH = swe.SEFLG_MOSEPH ?? 4;
    const SIDEREAL = swe.SEFLG_SIDEREAL ?? 64;

    let flags = MOSEPH | SPEED;
    let houseFlags = 0;
    if (zodiac === 'sidereal' && typeof swe.set_sid_mode === 'function') {
      swe.set_sid_mode(swe.SE_SIDM_LAHIRI ?? 1, 0, 0);
      flags |= SIDEREAL;
      houseFlags |= SIDEREAL;
    }

    // Same UT moment as the rest of the chart (passed from the client's engine).
    const jd = swe.julday(utc.year, utc.month, utc.day, utc.hour);

    const uranian = URANIAN.map(({ id, key, label }) => {
      const r = swe.calc_ut(jd, id, flags);
      const lon = norm360(r[0]);
      return { key, label, longitude: lon, retrograde: r[3] < 0 };
    });

    const hsys = HOUSE_CODE[houseSystem] || 'P';
    const h = swe.houses_ex(jd, houseFlags, latitude, longitude, hsys);
    const vertexLon = norm360(h.ascmc[3]);

    return NextResponse.json({ uranian, vertex: { longitude: vertexLon } });
  } catch (err) {
    console.error('astro-chart error:', err);
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
