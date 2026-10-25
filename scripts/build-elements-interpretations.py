#!/usr/bin/env python3
"""Regenerate lib/elements-test/interpretations.ts from docs/test-4-elements/spec-v2.md.

Run after editing the 32 interpretation texts in the spec:
    python3 scripts/build-elements-interpretations.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPEC = ROOT / 'docs/test-4-elements/spec-v2.md'
OUT = ROOT / 'lib/elements-test/interpretations.ts'

# Colours given in the integration brief; simple / absent / tri profiles use their element's colour
BRIEF_COLOURS = {
    'bi-feu-eau': '#8B3A5C', 'bi-feu-air': '#B86B3A', 'bi-feu-terre': '#9A7A2E', 'bi-eau-air': '#5E63B6',
    'bi-eau-terre': '#3A8A7A', 'bi-air-terre': '#6E7A4A', 'equilibre-parfait': '#5D4E8C',
    'desequilibre-total': '#2C2C2C', 'qualites-abondantes': '#8C6D1F', 'opposition-feu-eau': '#6B3A5C',
    'opposition-air-terre': '#4A6B3A', 'initiant-sincere': '#8C6D1F',
}
ELEMENT_COLOURS = {'feu': '#E67E22', 'eau': '#2E86C1', 'air': '#8E44AD', 'terre': '#58A845'}

# "#### 🔥 Feu maîtrisé | Force élevée · Ombre faible — `maitrise-feu`" followed by "> *« text »*"
PATTERN = re.compile(r'^#### (.+?) \| (.+?) — `([a-z-]+)`\n> \*« (.+?) »\*$', re.M)


def colour(key: str) -> str:
    return BRIEF_COLOURS.get(key) or ELEMENT_COLOURS[key.split('-')[-1]]


def main() -> None:
    items = PATTERN.findall(SPEC.read_text())
    if len(items) != 32:
        raise SystemExit(f'Expected 32 texts in the spec, found {len(items)}')

    q = lambda x: json.dumps(x, ensure_ascii=False)
    lines = [
        "// Les 32 textes d'interprétation, générés depuis docs/test-4-elements/spec-v2.md.",
        '// Ne pas éditer à la main : modifier la spec puis lancer scripts/build-elements-interpretations.py',
        '',
        'export interface Interpretation {',
        '  titre: string;',
        '  sousTitre: string;',
        '  couleur: string;',
        '  texte: string;',
        '}',
        '',
        'export const INTERPRETATIONS: Record<string, Interpretation> = {',
    ]
    for titre, sous_titre, key, texte in items:
        lines += [
            f'  {q(key)}: {{',
            f'    titre: {q(titre)},',
            f'    sousTitre: {q(sous_titre)},',
            f'    couleur: {q(colour(key))},',
            f'    texte: {q(texte)},',
            '  },',
        ]
    lines.append('};')
    OUT.write_text('\n'.join(lines) + '\n')
    print(f'Wrote {len(items)} interpretations to {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
