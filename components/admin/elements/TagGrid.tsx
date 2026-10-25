'use client';

import { useMemo, useState } from 'react';
import type { ElementEntry, Intensite } from '@/lib/elements-test/score';
import { ELEMENT_INFO } from '@/lib/elements-test/elements-info';

interface TagGridProps {
  words: ElementEntry[];
  selection: Record<number, Intensite>;
  // Functional updates, so fast repeated taps never read a stale selection
  onChange: (update: (prev: Record<number, Intensite>) => Record<number, Intensite>) => void;
}

// Tap cycle 0 → 1 (parfois) → 2 (souvent) → 3 (très fort) → 0
export default function TagGrid({ words, selection, onChange }: TagGridProps) {
  const [filter, setFilter] = useState('');
  const [bumped, setBumped] = useState<number | null>(null);

  // Alphabetical, not grouped by element, so the order doesn't hint at the element
  const sorted = useMemo(
    () => [...words].sort((a, b) => a.label.localeCompare(b.label, 'fr')),
    [words]
  );
  const needle = filter.trim().toLocaleLowerCase('fr');
  const visible = needle ? sorted.filter((w) => w.label.toLocaleLowerCase('fr').includes(needle)) : sorted;
  const count = Object.keys(selection).length;

  function cycle(id: number) {
    onChange((prev) => {
      const next = { ...prev };
      const current = next[id] ?? 0;
      if (current === 3) delete next[id];
      else next[id] = (current + 1) as Intensite;
      return next;
    });
    setBumped(id);
    setTimeout(() => setBumped((b) => (b === id ? null : b)), 150);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="el-legend">
          <strong>○ parfois · ◐ souvent · ● très fort</strong> — un tap de plus désélectionne
        </p>
        <span className="text-sm text-gray-500">{count} mot{count > 1 ? 's' : ''} coché{count > 1 ? 's' : ''}</span>
      </div>
      <input
        type="search"
        className="el-input mb-4"
        placeholder="Rechercher un mot…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="el-tags">
        {visible.map((w) => {
          const info = ELEMENT_INFO[w.element];
          return (
            <button
              key={w.id}
              type="button"
              className={`el-tag${bumped === w.id ? ' el-bump' : ''}`}
              data-i={selection[w.id] ?? 0}
              style={{ '--c': info.couleur, '--c-light': info.clair } as React.CSSProperties}
              onClick={() => cycle(w.id)}
            >
              {w.label}
            </button>
          );
        })}
        {visible.length === 0 && <p className="text-sm text-gray-500">Aucun mot ne correspond.</p>}
      </div>
    </div>
  );
}
