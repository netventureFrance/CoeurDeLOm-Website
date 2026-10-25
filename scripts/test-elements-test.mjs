// Coherence check for the 4 Elements test: elements.json, score.js and the 32 interpretations.
// Usage: node scripts/test-elements-test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { evaluate, ELEMENTS } from '../lib/elements-test/score.js';
import { INTERPRETATIONS } from '../lib/elements-test/interpretations.ts';

const db = JSON.parse(readFileSync(new URL('../lib/elements-test/elements.json', import.meta.url)));

// elements.json: 454 entries, qualities 1–252, defects 253–454, no duplicate ids
assert.equal(db.length, 454);
assert.equal(new Set(db.map((x) => x.id)).size, 454);
assert.equal(db.filter((x) => x.type === 'qualite').length, 252);
assert.ok(db.every((x) => ELEMENTS.includes(x.element)));

// interpretations: exactly 32 keys
assert.equal(Object.keys(INTERPRETATIONS).length, 32);

// Every profile detectProfile() returns has a text, and all 32 are reachable
const qual = db.filter((x) => x.type === 'qualite');
const def = db.filter((x) => x.type === 'defaut');
const pick = (list, focus) =>
  list
    .filter((x) => (!focus.length || focus.includes(x.element) || Math.random() < 0.1) && Math.random() < Math.random() * 0.3)
    .map((x) => ({ id: x.id, intensite: 1 + Math.floor(Math.random() * 3) }));
const focus = () => ELEMENTS.filter(() => Math.random() < 0.6);

const seen = new Set();
for (let i = 0; i < 100000; i++) {
  const { profil } = evaluate(pick(qual, focus()), pick(def, focus()), db);
  if (profil === 'incomplet') continue;
  assert.ok(INTERPRETATIONS[profil], `No interpretation for profile "${profil}"`);
  seen.add(profil);
}
const unreached = Object.keys(INTERPRETATIONS).filter((k) => !seen.has(k));
assert.deepEqual(unreached, [], `Unreached profiles: ${unreached.join(', ')}`);

// Empty mirror → incomplete, no Bardon reading
assert.equal(evaluate([], [{ id: 253, intensite: 1 }], db).profil, 'incomplet');

console.log('✓ 4 Elements test: data, 32 interpretations and score.js are consistent');
