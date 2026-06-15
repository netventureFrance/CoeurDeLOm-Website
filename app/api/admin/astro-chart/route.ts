import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
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

// Main asteroids (from seas_18.se1) — Swiss Ephemeris body ids.
const ASTEROIDS: { id: number; key: string; label: string }[] = [
  { id: 17, key: 'ceres', label: 'Cérès' },
  { id: 18, key: 'pallas', label: 'Pallas (Athéna)' },
  { id: 19, key: 'juno', label: 'Junon' },
  { id: 20, key: 'vesta', label: 'Vesta' },
];

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

// Éris & Sedna have no public ephemeris files, so we compute them from JPL
// orbital elements (epoch JD 2461200.5). Validated vs known positions
// (Éris ≈ 24° Bélier 2024, Sedna ≈ 29° Taureau 2024). They move so slowly that
// element-based geocentric longitude is accurate to well under a degree.
const DEG = Math.PI / 180;
const TNO_EPOCH = 2461200.5;
const TNO_ELEMENTS = {
  eris: { label: 'Éris', a: 67.93394687853566, e: 0.4382385347971672, inc: 43.9258279471791, node: 36.00477044417249, peri: 150.7949235840312, M0: 211.774434275007 },
  sedna: { label: 'Sedna', a: 543.7195289104732, e: 0.8598824585187618, inc: 11.92527582847476, node: 144.5061662673739, peri: 311.0987725939751, M0: 358.5956944005428 },
};
type Elements = (typeof TNO_ELEMENTS)[keyof typeof TNO_ELEMENTS];

// Geocentric ecliptic longitude (tropical) from heliocentric Keplerian elements,
// using the Sun's geocentric longitude/distance to place the Earth.
function tnoGeoLongitude(jd: number, el: Elements, sunLon: number, sunDist: number): number {
  const n = 0.9856076686 / Math.pow(el.a, 1.5); // mean motion °/day
  const M = norm360(el.M0 + n * (jd - TNO_EPOCH)) * DEG;
  let E = M;
  for (let k = 0; k < 100; k++) {
    const d = (E - el.e * Math.sin(E) - M) / (1 - el.e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-12) break;
  }
  const xv = el.a * (Math.cos(E) - el.e);
  const yv = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
  const r = Math.hypot(xv, yv);
  const u = Math.atan2(yv, xv) + el.peri * DEG; // argument of latitude
  const O = el.node * DEG, i = el.inc * DEG;
  const hx = r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(i));
  const hy = r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(i));
  const ls = sunLon * DEG;
  return norm360(Math.atan2(hy + sunDist * Math.sin(ls), hx + sunDist * Math.cos(ls)) / DEG);
}

// Initialise the WASM engine once and reuse across invocations.
let swePromise: Promise<any> | null = null;
function getSwe() {
  if (!swePromise) {
    swePromise = (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const swe: any = new SwissEph();
      await swe.initSwissEph();
      // Load the main-asteroid ephemeris (Cérès, Pallas, Junon, Vesta, Chiron).
      try {
        const FS = swe.SweModule.FS;
        try { FS.mkdir('sweph'); } catch { /* already exists */ }
        const file = path.join(process.cwd(), 'ephe', 'seas_18.se1');
        FS.writeFile('sweph/seas_18.se1', new Uint8Array(fs.readFileSync(file)));
        swe.set_ephe_path('sweph');
      } catch (e) {
        console.error('asteroid ephemeris load failed:', e);
      }
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

    // Asteroids need the Swiss Ephemeris file (loaded above), not Moshier.
    const SWIEPH = swe.SEFLG_SWIEPH ?? 2;
    let astFlags = SWIEPH | SPEED;
    if (zodiac === 'sidereal') astFlags |= SIDEREAL;
    const asteroids: { key: string; label: string; longitude: number; retrograde: boolean }[] = [];
    for (const { id, key, label } of ASTEROIDS) {
      try {
        const r = swe.calc_ut(jd, id, astFlags);
        if (r && typeof r[0] === 'number' && !isNaN(r[0])) {
          asteroids.push({ key, label, longitude: norm360(r[0]), retrograde: r[3] < 0 });
        }
      } catch { /* skip if unavailable */ }
    }

    // Éris & Sedna from orbital elements (no ephemeris file needed).
    const sunA = swe.calc_ut(jd, 0, MOSEPH);     // Sun at jd
    const sunB = swe.calc_ut(jd + 1, 0, MOSEPH); // Sun +1d (for retrograde test)
    let ayan = 0;
    if (zodiac === 'sidereal') { try { ayan = swe.get_ayanamsa_ut(jd); } catch { ayan = 0; } }
    const tno = (Object.keys(TNO_ELEMENTS) as (keyof typeof TNO_ELEMENTS)[]).map((key) => {
      const el = TNO_ELEMENTS[key];
      const lonA = tnoGeoLongitude(jd, el, sunA[0], sunA[2]);
      const lonB = tnoGeoLongitude(jd + 1, el, sunB[0], sunB[2]);
      const step = ((lonB - lonA + 540) % 360) - 180; // signed daily motion
      const longitude = zodiac === 'sidereal' ? norm360(lonA - ayan) : lonA;
      return { key, label: el.label, longitude, retrograde: step < 0 };
    });

    const hsys = HOUSE_CODE[houseSystem] || 'P';
    const h = swe.houses_ex(jd, houseFlags, latitude, longitude, hsys);
    const vertexLon = norm360(h.ascmc[3]);

    return NextResponse.json({ uranian, asteroids, tno, vertex: { longitude: vertexLon } });
  } catch (err) {
    console.error('astro-chart error:', err);
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
