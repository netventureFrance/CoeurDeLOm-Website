'use client';

import { useEffect, useRef, useState } from 'react';

type Language = 'FR' | 'DE' | 'EN';

const SIGNS_FR = [
  'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
  'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons',
];

// circular-natal-horoscope-js keys → French label + @astrodraw/astrochart name
const BODY_FR: Record<string, string> = {
  sun: 'Soleil', moon: 'Lune', mercury: 'Mercure', venus: 'Vénus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturne', uranus: 'Uranus', neptune: 'Neptune',
  pluto: 'Pluton', chiron: 'Chiron', sirius: 'Sirius',
  northnode: 'Nœud Nord', southnode: 'Nœud Sud', lilith: 'Lilith',
};
const ASTROCHART_NAME: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune',
  pluto: 'Pluto', chiron: 'Chiron', lilith: 'Lilith',
  northnode: 'NNode', southnode: 'SNode',
};

const ZODIAC_LABEL: Record<string, string> = {
  tropical: 'Tropical (occidental)', sidereal: 'Sidéral (védique)',
};
const HOUSE_LABEL: Record<string, string> = {
  placidus: 'Placidus', 'whole-sign': 'Signe entier', koch: 'Koch',
  'equal-house': 'Maisons égales', campanus: 'Campanus',
  regiomontanus: 'Regiomontanus', topocentric: 'Topocentrique',
};
const SPEECH_LANG: Record<Language, string> = { FR: 'fr-FR', DE: 'de-DE', EN: 'en-US' };
const FEMALE_VOICES: Record<Language, string[]> = {
  FR: ['Aurélie', 'Audrey', 'Amélie', 'Sandy', 'Shelley', 'Flo'],
  DE: ['Anna', 'Petra', 'Helena', 'Sandy'],
  EN: ['Samantha', 'Ava', 'Allison', 'Karen', 'Serena'],
};

const norm360 = (d: number) => ((d % 360) + 360) % 360;

// Element / modality of each sign (index 0 = Bélier … 11 = Poissons).
const SIGN_ELEMENT_FR = ['Feu', 'Terre', 'Air', 'Eau', 'Feu', 'Terre', 'Air', 'Eau', 'Feu', 'Terre', 'Air', 'Eau'];
const SIGN_MODE_FR = ['Cardinal', 'Fixe', 'Mutable', 'Cardinal', 'Fixe', 'Mutable', 'Cardinal', 'Fixe', 'Mutable', 'Cardinal', 'Fixe', 'Mutable'];
const signIndex = (lon: number) => Math.floor(norm360(lon) / 30) % 12;

// Glyphs + order for the aspect grid (classic bodies + Chiron, nodes, Lilith).
const GLYPH: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇', chiron: '⚷', northnode: '☊', lilith: '⚸',
};
const GRID_ORDER = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'northnode', 'lilith'];

// Extra bodies to plot on the wheel: our body-key -> astrochart symbol name.
// 'fortune' uses astrochart's built-in Fortune glyph; the rest get a short
// custom label via CUSTOM_SYMBOL_FN (astrochart has no glyph for them).
const WHEEL_EXTRA_NAME: Record<string, string> = {
  cupido: 'Cupido', hades: 'Hades', zeus: 'Zeus', kronos: 'Kronos', apollon: 'Apollon',
  admetos: 'Admetos', vulkanus: 'Vulkanus', poseidon: 'Poseidon',
  ceres: 'Ceres', pallas: 'Pallas', juno: 'Juno', vesta: 'Vesta',
  eris: 'Eris', sedna: 'Sedna', vertex: 'Vertex', fortune: 'Fortune',
};
const WHEEL_LABEL: Record<string, string> = {
  Cupido: 'Cup', Hades: 'Had', Zeus: 'Zeu', Kronos: 'Kro', Apollon: 'Apo',
  Admetos: 'Adm', Vulkanus: 'Vul', Poseidon: 'Pos',
  Ceres: 'Cér', Pallas: 'Pal', Juno: 'Jun', Vesta: 'Ves',
  Eris: 'Éri', Sedna: 'Sed', Vertex: 'Vx',
};

// Single source of truth for aspect styling (wheel lines, grid, and legend).
const ASPECT_TYPES = [
  { key: 'conjunction', name: 'Conjonction', glyph: '☌', angle: 0, orb: 8, color: '#7c3aed' },
  { key: 'sextile', name: 'Sextile', glyph: '⚹', angle: 60, orb: 6, color: '#2563eb' },
  { key: 'square', name: 'Carré', glyph: '□', angle: 90, orb: 7, color: '#dc2626' },
  { key: 'trine', name: 'Trigone', glyph: '△', angle: 120, orb: 8, color: '#16a34a' },
  { key: 'opposition', name: 'Opposition', glyph: '☍', angle: 180, orb: 8, color: '#ea580c' },
];
function aspectBetween(l1: number, l2: number) {
  let d = Math.abs(norm360(l1) - norm360(l2)) % 360;
  if (d > 180) d = 360 - d;
  for (const a of ASPECT_TYPES) {
    const delta = Math.abs(d - a.angle);
    if (delta <= a.orb) return { glyph: a.glyph, name: a.name, color: a.color, orb: delta };
  }
  return null;
}

interface Body { key: string; label: string; longitude: number; sign: string; position: string; retrograde: boolean; house: number | null; }
interface Angle { longitude: number; sign: string; position: string; }
interface ChartResult {
  bodies: Body[]; ascendant: Angle | null; midheaven: Angle | null;
  aspects: { from: string; to: string; type: string; orb: number }[];
  renderPlanets: Record<string, number[]>; cusps: number[];
  zodiac: string; houseSystem: string; summary: string;
}

function lon(obj: any): number | null {
  const cp = obj?.ChartPosition;
  if (!cp) return null;
  const v = [cp.Ecliptic?.DecimalDegrees, cp.StartPosition?.Ecliptic?.DecimalDegrees, cp.Horizon?.DecimalDegrees]
    .find((x) => typeof x === 'number');
  return typeof v === 'number' ? norm360(v) : null;
}
function fmt(longitude: number) {
  const idx = Math.floor(longitude / 30) % 12;
  const deg = longitude - idx * 30;
  const min = Math.floor((deg % 1) * 60).toString().padStart(2, '0');
  return { sign: SIGNS_FR[idx], position: `${Math.floor(deg)}° ${SIGNS_FR[idx]} ${min}'` };
}

export default function AstrologyTool() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('1990-06-21');
  const [time, setTime] = useState('14:30');
  const [place, setPlace] = useState('Paris, France');
  const [lat, setLat] = useState('48.8566');
  const [lng, setLng] = useState('2.3522');
  const [zodiac, setZodiac] = useState('tropical');
  const [house, setHouse] = useState('placidus');
  const [language, setLanguage] = useState<Language>('FR');

  const [geoMsg, setGeoMsg] = useState('');
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [advancedError, setAdvancedError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);

  // Render the SVG wheel whenever a new chart is computed.
  useEffect(() => {
    if (!chart || !wheelRef.current) return;
    let cancelled = false;
    (async () => {
      const { Chart } = await import('@astrodraw/astrochart');
      if (cancelled || !wheelRef.current) return;
      wheelRef.current.innerHTML = '';
      const size = Math.min(560, wheelRef.current.clientWidth || 520);
      // Draw a short label for the extra bodies (astrochart has no glyph for
      // them); return null for everything else so built-in glyphs are used.
      const customSymbol = (name: string, x: number, y: number) => {
        const label = WHEEL_LABEL[name];
        if (!label) return null;
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        el.setAttribute('x', String(x));
        el.setAttribute('y', String(y));
        el.setAttribute('text-anchor', 'middle');
        el.setAttribute('dominant-baseline', 'central');
        el.setAttribute('font-size', '10');
        el.setAttribute('font-weight', '700');
        el.setAttribute('fill', '#5b21b6');
        el.textContent = label;
        return el;
      };
      const ASPECT_SETTINGS = {
        ASPECTS: Object.fromEntries(
          ASPECT_TYPES.map((a) => [a.key, { degree: a.angle, orbit: a.orb, color: a.color }])
        ),
        CUSTOM_SYMBOL_FN: customSymbol,
      };
      const c = new Chart('astro-wheel', size, size, ASPECT_SETTINGS as any);
      // Plot the classic bodies plus the extra ones (Uranian, asteroids, Éris,
      // Sedna, Vertex, Part de Fortune).
      const planets: Record<string, number[]> = { ...chart.renderPlanets };
      for (const b of chart.bodies) {
        const nm = WHEEL_EXTRA_NAME[b.key];
        if (nm && !planets[nm]) planets[nm] = [b.longitude];
      }
      const data: any = { planets };
      if (chart.cusps.length === 12) data.cusps = chart.cusps;
      const radix = c.radix(data);
      // radix.aspects() ignores custom colours/orbs (rebuilds with library
      // defaults — no sextile, opposition green). So compute the aspects between
      // the plotted bodies ourselves and pass them in, colour-coded by type.
      try {
        const pts = Object.entries(chart.renderPlanets).map(([name, arr]) => ({ name, pos: (arr as number[])[0] }));
        const wheelAspects: any[] = [];
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            let dd = Math.abs(pts[i].pos - pts[j].pos) % 360;
            if (dd > 180) dd = 360 - dd;
            for (const t of ASPECT_TYPES) {
              if (Math.abs(dd - t.angle) <= t.orb) {
                wheelAspects.push({
                  aspect: { name: t.key, degree: t.angle, orbit: t.orb, color: t.color },
                  point: { name: pts[i].name, position: pts[i].pos },
                  toPoint: { name: pts[j].name, position: pts[j].pos },
                  precision: '0',
                });
                break;
              }
            }
          }
        }
        radix.aspects(wheelAspects);
      } catch { /* aspect drawing unavailable */ }
    })();
    return () => { cancelled = true; };
  }, [chart]);

  async function handleGeocode() {
    setGeoMsg('Recherche…');
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place.trim())}&count=1&language=fr&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      const hit = data.results?.[0];
      if (!hit) throw new Error('Aucun lieu trouvé');
      setLat(hit.latitude.toFixed(4));
      setLng(hit.longitude.toFixed(4));
      const full = [hit.name, hit.admin1, hit.country].filter(Boolean).join(', ');
      setPlace(full);
      setGeoMsg(`✓ ${full} — ${hit.timezone}`);
    } catch (e: any) {
      setGeoMsg(`⚠ ${e.message}. Saisissez lat/long manuellement.`);
    }
  }

  async function handleCalculate() {
    setError('');
    setAdvancedError('');
    try {
      const { Origin, Horoscope } = await import('circular-natal-horoscope-js/dist/index.js');
      const [y, m, d] = date.split('-').map(Number);
      const [hh, mm] = time.split(':').map(Number);
      const origin = new Origin({
        year: y, month: m - 1, date: d, hour: hh, minute: mm,
        latitude: parseFloat(lat), longitude: parseFloat(lng),
      });
      const horoscope = new Horoscope({
        origin, houseSystem: house, zodiac,
        aspectPoints: ['bodies', 'points', 'angles'],
        aspectWithPoints: ['bodies', 'points', 'angles'],
        aspectTypes: ['major'], language: 'en',
      });

      const renderPlanets: Record<string, number[]> = {};
      const bodies: Body[] = [];
      const raw = [...(horoscope.CelestialBodies?.all ?? []), ...(horoscope.CelestialPoints?.all ?? [])];
      for (const b of raw) {
        const L = lon(b);
        if (L == null) continue;
        const name = ASTROCHART_NAME[b.key];
        if (name) renderPlanets[name] = [L];
        const f = fmt(L);
        bodies.push({
          key: b.key, label: BODY_FR[b.key] ?? b.label ?? b.key, longitude: L,
          sign: f.sign, position: f.position, retrograde: !!b.isRetrograde, house: b.House?.id ?? null,
        });
      }

      const ascL = lon(horoscope.Ascendant);
      const mcL = lon(horoscope.Midheaven);
      const ascendant = ascL != null ? { longitude: ascL, ...fmt(ascL) } : null;
      const midheaven = mcL != null ? { longitude: mcL, ...fmt(mcL) } : null;
      const cusps = (horoscope.Houses ?? []).map((h: any) => lon(h)).filter((x: number | null) => x != null) as number[];
      // (Aspects are computed below, over ALL bodies including the added points.)

      // House assignment helper for the added points.
      const houseOf = (lng: number): number | null => {
        if (cusps.length !== 12) return null;
        for (let i = 0; i < 12; i++) {
          const span = norm360(cusps[(i + 1) % 12] - cusps[i]);
          if (norm360(lng - cusps[i]) < span) return i + 1;
        }
        return null;
      };

      // Part de Fortune (sect-based: jour = Asc + Lune − Soleil ; nuit = Asc + Soleil − Lune).
      const sunB = bodies.find((b) => b.key === 'sun');
      const moonB = bodies.find((b) => b.key === 'moon');
      if (sunB && moonB && ascL != null) {
        const dayChart = sunB.house != null && sunB.house >= 7 && sunB.house <= 12;
        const fortuneLon = norm360(
          ascL + (dayChart ? moonB.longitude - sunB.longitude : sunB.longitude - moonB.longitude)
        );
        const f = fmt(fortuneLon);
        bodies.push({
          key: 'fortune', label: 'Part de Fortune', longitude: fortuneLon,
          sign: f.sign, position: f.position, retrograde: false, house: houseOf(fortuneLon),
        });
      }

      // Uranian / trans-Neptunian planets + Vertex (server-side Swiss Ephemeris),
      // computed at the exact same UT moment. If unavailable, the base chart still renders.
      try {
        // origin.utcTime may be a moment-like object in the browser build — coerce to a real Date.
        const utc = new Date(origin.utcTime);
        if (isNaN(utc.getTime())) throw new Error('UTC indisponible');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const res = await fetch('/api/admin/astro-chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            utc: {
              year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate(),
              hour: utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600,
            },
            latitude: parseFloat(lat), longitude: parseFloat(lng), zodiac, houseSystem: house,
          }),
        });
        clearTimeout(timer);
        if (res.ok) {
          const extra = await res.json();
          for (const u of extra.uranian ?? []) {
            const f = fmt(u.longitude);
            bodies.push({ key: u.key, label: u.label, longitude: u.longitude, sign: f.sign, position: f.position, retrograde: !!u.retrograde, house: houseOf(u.longitude) });
          }
          for (const a of extra.asteroids ?? []) {
            const f = fmt(a.longitude);
            bodies.push({ key: a.key, label: a.label, longitude: a.longitude, sign: f.sign, position: f.position, retrograde: !!a.retrograde, house: houseOf(a.longitude) });
          }
          for (const t of extra.tno ?? []) {
            const f = fmt(t.longitude);
            bodies.push({ key: t.key, label: t.label, longitude: t.longitude, sign: f.sign, position: f.position, retrograde: !!t.retrograde, house: houseOf(t.longitude) });
          }
          if (extra.vertex) {
            const fv = fmt(extra.vertex.longitude);
            bodies.push({ key: 'vertex', label: 'Vertex', longitude: extra.vertex.longitude, sign: fv.sign, position: fv.position, retrograde: false, house: houseOf(extra.vertex.longitude) });
          }
        } else {
          const d = await res.json().catch(() => ({}));
          setAdvancedError(d.error || `HTTP ${res.status}`);
        }
      } catch (e: any) {
        setAdvancedError(e?.name === 'AbortError' ? 'délai dépassé (timeout 8s)' : (e?.message || 'indisponible'));
      }

      // Aspects across EVERY body + angle (incl. uraniennes, astéroïdes, Éris,
      // Sedna, Vertex, Part de Fortune) so the reading covers them all.
      const aspectPoints = [
        ...bodies.map((b) => ({ label: b.label, lon: b.longitude })),
        ...(ascendant ? [{ label: 'Ascendant', lon: ascendant.longitude }] : []),
        ...(midheaven ? [{ label: 'Milieu du Ciel', lon: midheaven.longitude }] : []),
      ];
      const aspects: { from: string; to: string; type: string; orb: number }[] = [];
      for (let i = 0; i < aspectPoints.length; i++) {
        for (let j = i + 1; j < aspectPoints.length; j++) {
          const a = aspectBetween(aspectPoints[i].lon, aspectPoints[j].lon);
          if (a) aspects.push({ from: aspectPoints[i].label, to: aspectPoints[j].label, type: a.name, orb: a.orb });
        }
      }
      aspects.sort((x, y) => x.orb - y.orb);

      // Build the text summary sent to Claude.
      const lines: string[] = [];
      if (ascendant) lines.push(`- Ascendant : ${ascendant.position}`);
      if (midheaven) lines.push(`- Milieu du Ciel : ${midheaven.position}`);
      for (const b of bodies) {
        lines.push(`- ${b.label} : ${b.position}${b.retrograde ? ' (rétrograde)' : ''}${b.house ? `, maison ${b.house}` : ''}`);
      }
      const aspLines = aspects.slice(0, 50).map((a) => `- ${a.from} ${a.type} ${a.to} (orbe ${a.orb.toFixed(1)}°)`);
      const summary = `PLACEMENTS :\n${lines.join('\n')}\n\nASPECTS MAJEURS (du plus serré au plus large) :\n${aspLines.join('\n') || '(aucun)'}`;

      setReading('');
      setChart({ bodies, ascendant, midheaven, aspects, renderPlanets, cusps, zodiac, houseSystem: house, summary });
    } catch (e: any) {
      setError(`Erreur de calcul : ${e.message}`);
    }
  }

  async function handleGenerate() {
    if (!chart) return;
    setIsGenerating(true);
    setError('');
    setReading('');
    try {
      const res = await fetch('/api/admin/astro-interpretation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: chart.summary,
          meta: {
            name, date, time, place,
            zodiac: ZODIAC_LABEL[chart.zodiac], houseSystem: HOUSE_LABEL[chart.houseSystem],
          },
          language,
        }),
      });
      if (!res.ok || !res.body) {
        // Error responses are JSON; read the message if we can.
        const msg = await res.text().catch(() => '');
        try { throw new Error(JSON.parse(msg).error || `HTTP ${res.status}`); }
        catch { throw new Error(msg || `HTTP ${res.status}`); }
      }
      // Stream the reading in as it's written.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setReading(acc);
      }
    } catch (e: any) {
      setError(`Erreur lors de la génération : ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSpeak() {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (synth.speaking) { synth.cancel(); setSpeaking(false); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = reading;
    const text = (tmp.textContent || '').trim();
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = SPEECH_LANG[language];
    const voices = synth.getVoices();
    const pool = voices.filter((v) => v.lang?.toLowerCase().startsWith(language.toLowerCase().slice(0, 2)));
    const search = pool.length ? pool : voices;
    let voice: SpeechSynthesisVoice | undefined;
    for (const n of FEMALE_VOICES[language]) { voice = search.find((v) => v.name.includes(n)); if (voice) break; }
    if (!voice) voice = search.find((v) => /female|femme|weiblich/i.test(v.name)) || search[0];
    if (voice) u.voice = voice;
    u.rate = 0.96; u.pitch = 1.05;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  }

  const s = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' as const },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' },
    title: { fontSize: '24px', fontWeight: 600, color: '#1f2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' },
    subtitle: { color: '#6b7280', fontSize: '14px', marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '12px' },
    input: { width: '100%', marginTop: '4px', padding: '9px 11px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' as const, outline: 'none' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    ghostBtn: { marginTop: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', color: '#7c3aed', cursor: 'pointer', fontSize: '13px', fontWeight: 500 },
    primaryBtn: { width: '100%', marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '15px' },
    langTabs: { display: 'flex', gap: '8px', margin: '16px 0' },
    langTab: { padding: '8px 14px', borderRadius: '8px', border: '2px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500 },
    langTabActive: { borderColor: '#7c3aed', background: '#f5f3ff', color: '#7c3aed' },
    hint: { fontSize: '12px', color: '#6b7280', margin: '6px 0', lineHeight: 1.4 },
    error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '16px', fontSize: '14px' },
    th: { textAlign: 'left' as const, padding: '6px 8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 500 },
    td: { padding: '6px 8px', borderBottom: '1px solid #f3f4f6', color: '#1f2937' },
    angleTd: { padding: '6px 8px', borderBottom: '1px solid #f3f4f6', color: '#7c3aed', fontWeight: 600 },
    resultCard: { backgroundColor: '#f5f3ff', borderRadius: '12px', padding: '24px', marginTop: '24px', border: '2px solid #7c3aed' },
    spinner: { width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' },
  };
  const readingCss = `
    .astro-reading h3 { color: #7c3aed; margin: 18px 0 8px; font-size: 17px; font-weight: 600; }
    .astro-reading h3:first-child { margin-top: 0; }
    .astro-reading p { color: #1f2937; font-size: 15px; line-height: 1.7; margin: 0 0 12px; }
    .astro-reading strong { color: #5b21b6; }
  `;

  return (
    <div style={s.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } ${readingCss} #astro-wheel svg { max-width: 100%; height: auto; }
        @media print {
          body * { visibility: hidden !important; }
          #astro-print-area, #astro-print-area * { visibility: visible !important; }
          #astro-print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }`}</style>

      <div style={s.grid}>
        {/* ── Form ── */}
        <div style={s.card}>
          <h2 style={s.title}><span style={{ fontSize: '30px' }}>✦</span> Astrologie</h2>
          <p style={s.subtitle}>Thème natal précis + lecture rédigée par l&apos;IA dans la voix de Valérie.</p>

          {error && <div style={s.error}>{error}</div>}

          <label style={s.label}>Nom (client)
            <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Marie Dupont" />
          </label>
          <div style={s.row}>
            <label style={s.label}>Date de naissance
              <input style={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label style={s.label}>Heure
              <input style={s.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>
          <label style={s.label}>Lieu de naissance
            <input style={s.input} value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ville, Pays" />
          </label>
          <button type="button" style={s.ghostBtn} onClick={handleGeocode}>Rechercher le lieu ↻</button>
          {geoMsg && <p style={s.hint}>{geoMsg}</p>}
          <div style={s.row}>
            <label style={s.label}>Latitude
              <input style={s.input} type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} />
            </label>
            <label style={s.label}>Longitude
              <input style={s.input} type="number" step="0.0001" value={lng} onChange={(e) => setLng(e.target.value)} />
            </label>
          </div>
          <div style={s.row}>
            <label style={s.label}>Zodiaque
              <select style={s.input} value={zodiac} onChange={(e) => setZodiac(e.target.value)}>
                <option value="tropical">Tropical (occidental)</option>
                <option value="sidereal">Sidéral (védique)</option>
              </select>
            </label>
            <label style={s.label}>Système de maisons
              <select style={s.input} value={house} onChange={(e) => setHouse(e.target.value)}>
                {Object.entries(HOUSE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>
          <button type="button" style={s.primaryBtn} onClick={handleCalculate}>Calculer le thème</button>
        </div>

        {/* ── Chart + table ── */}
        <div style={s.card} id="astro-print-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ ...s.title, fontSize: '18px', margin: 0 }}>Thème</h3>
            {chart && (
              <button type="button" className="no-print" style={s.ghostBtn} onClick={() => window.print()}>📄 Exporter en PDF</button>
            )}
          </div>
          {chart && (
            <p style={{ ...s.hint, marginTop: '4px' }}>
              {name && <strong>{name} — </strong>}{date} {time} · {place} · {ZODIAC_LABEL[chart.zodiac] || chart.zodiac} · {HOUSE_LABEL[chart.houseSystem] || chart.houseSystem}
            </p>
          )}
          {!chart ? (
            <p style={s.hint}>Renseignez les données puis cliquez sur « Calculer le thème ».</p>
          ) : (
            <>
              <div id="astro-wheel" ref={wheelRef} style={{ display: 'flex', justifyContent: 'center' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', margin: '10px 0 4px', fontSize: '12px', color: '#6b7280' }}>
                {ASPECT_TYPES.map((a) => (
                  <span key={a.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '16px', borderTop: `2px solid ${a.color}` }} />
                    <span style={{ color: a.color }}>{a.glyph}</span> {a.name}
                  </span>
                ))}
              </div>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Astre</th><th style={s.th}>Position</th><th style={s.th}>Signe</th><th style={s.th}>Maison</th></tr></thead>
                <tbody>
                  {chart.ascendant && <tr><td style={s.angleTd}>Ascendant</td><td style={s.angleTd}>{chart.ascendant.position}</td><td style={s.angleTd}>{chart.ascendant.sign}</td><td style={s.angleTd}>—</td></tr>}
                  {chart.midheaven && <tr><td style={s.angleTd}>Milieu du Ciel</td><td style={s.angleTd}>{chart.midheaven.position}</td><td style={s.angleTd}>{chart.midheaven.sign}</td><td style={s.angleTd}>—</td></tr>}
                  {chart.bodies.map((b) => (
                    <tr key={b.key}>
                      <td style={s.td}>{b.label}{b.retrograde ? ' ℞' : ''}</td>
                      <td style={s.td}>{b.position}</td>
                      <td style={s.td}>{b.sign}</td>
                      <td style={s.td}>{b.house ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {advancedError && (
                <p style={{ ...s.hint, color: '#b45309' }}>
                  ⚠ Points avancés (uraniennes / Vertex) indisponibles — {advancedError}
                </p>
              )}

              {/* Distribution + maisons + grille d'aspects (parité avec la mise en page Sarastro de Val) */}
              {(() => {
                const cell = { width: '24px', height: '24px', textAlign: 'center' as const, border: '1px solid #eef0f4', fontSize: '13px' };
                const head = { ...cell, color: '#6b7280', fontWeight: 600 };
                const secTitle = { fontSize: '15px', fontWeight: 600, color: '#1f2937', margin: '20px 0 10px' };

                const pts: { glyph: string; lon: number }[] = [];
                for (const k of GRID_ORDER) {
                  const b = chart.bodies.find((x) => x.key === k);
                  if (b) pts.push({ glyph: GLYPH[k] || b.label, lon: b.longitude });
                }
                if (chart.ascendant) pts.push({ glyph: 'AC', lon: chart.ascendant.longitude });
                if (chart.midheaven) pts.push({ glyph: 'MC', lon: chart.midheaven.longitude });

                const elem: Record<string, number> = { Feu: 0, Terre: 0, Air: 0, Eau: 0 };
                const mode: Record<string, number> = { Cardinal: 0, Fixe: 0, Mutable: 0 };
                const add = (lon: number) => { const i = signIndex(lon); elem[SIGN_ELEMENT_FR[i]]++; mode[SIGN_MODE_FR[i]]++; };
                for (const k of ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']) {
                  const b = chart.bodies.find((x) => x.key === k); if (b) add(b.longitude);
                }
                if (chart.ascendant) add(chart.ascendant.longitude);
                if (chart.midheaven) add(chart.midheaven.longitude);
                const maxE = Math.max(1, ...Object.values(elem));
                const maxM = Math.max(1, ...Object.values(mode));
                const bar = (n: number, max: number) => ({ background: '#7c3aed', height: '12px', width: `${(n / max) * 90 + 6}px`, borderRadius: '3px', display: 'inline-block' });

                return (
                  <div>
                    <h3 style={secTitle}>Éléments &amp; modes</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        {(['Feu', 'Terre', 'Air', 'Eau'] as const).map((e) => (
                          <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontSize: '13px' }}>
                            <span style={{ width: '46px', color: '#6b7280' }}>{e}</span>
                            <span style={bar(elem[e], maxE)} /><span>{elem[e]}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        {(['Cardinal', 'Fixe', 'Mutable'] as const).map((m) => (
                          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontSize: '13px' }}>
                            <span style={{ width: '62px', color: '#6b7280' }}>{m}</span>
                            <span style={bar(mode[m], maxM)} /><span>{mode[m]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 style={secTitle}>Maisons (cuspides)</h3>
                    <p style={{ ...s.hint, marginTop: 0 }}>
                      Calculées avec le système <strong>{HOUSE_LABEL[chart.houseSystem] || chart.houseSystem}</strong>.
                      {(chart.houseSystem === 'whole-sign' || chart.houseSystem === 'equal-house') &&
                        ' Avec ce système chaque maison débute à 0° du signe — choisissez « Placidus » pour des cuspides en degrés (comme dans Sarastro).'}
                    </p>
                    {chart.cusps.length === 12 ? (
                      <table style={{ ...s.table, marginTop: 0 }}>
                        <tbody>
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <tr key={i}>
                              <td style={s.td}><strong>{i + 1}</strong>&nbsp;&nbsp;{fmt(chart.cusps[i]).position}</td>
                              <td style={s.td}><strong>{i + 7}</strong>&nbsp;&nbsp;{fmt(chart.cusps[i + 6]).position}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <p style={s.hint}>Cuspides indisponibles pour ce système de maisons.</p>}

                    <h3 style={secTitle}>Aspects</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                          {pts.map((rp, i) => i === 0 ? null : (
                            <tr key={i}>
                              <td style={head}>{rp.glyph}</td>
                              {pts.slice(0, i).map((cp, j) => {
                                const a = aspectBetween(rp.lon, cp.lon);
                                return <td key={j} style={cell} title={a ? `${a.orb.toFixed(1)}°` : ''}>{a ? <span style={{ color: a.color }}>{a.glyph}</span> : ''}</td>;
                              })}
                            </tr>
                          ))}
                          <tr>
                            <td style={head} />
                            {pts.slice(0, pts.length - 1).map((cp, j) => <td key={j} style={head}>{cp.glyph}</td>)}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* AI reading */}
              <div style={s.langTabs}>
                {(['FR', 'DE', 'EN'] as Language[]).map((l) => (
                  <button key={l} type="button" onClick={() => setLanguage(l)}
                    style={{ ...s.langTab, ...(language === l ? s.langTabActive : {}) }}>{l}</button>
                ))}
              </div>
              <button type="button" style={{ ...s.primaryBtn, opacity: isGenerating ? 0.6 : 1 }} disabled={isGenerating} onClick={handleGenerate}>
                {isGenerating ? <><span style={s.spinner} />Rédaction de la lecture…</> : '✨ Générer la lecture'}
              </button>

              {reading && (
                <div style={s.resultCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#7c3aed', margin: 0 }}>🔮 Lecture</h3>
                    <button type="button" style={s.ghostBtn} onClick={handleSpeak}>{speaking ? '■ Arrêter' : '🔊 Lire à voix haute'}</button>
                  </div>
                  <div className="astro-reading" dangerouslySetInnerHTML={{ __html: reading }} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
