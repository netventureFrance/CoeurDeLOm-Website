import type { Element, Scores } from '@/lib/elements-test/score';
import { ELEMENT_INFO } from '@/lib/elements-test/elements-info';

// Opposite elements face each other (Feu ↔ Eau, Air ↔ Terre), as in Bardon's pairs
const AXES: Element[] = ['feu', 'air', 'eau', 'terre'];
const SIZE = 360;
const C = SIZE / 2;
const R = 120;

export default function ElementsRadar({ scores }: { scores: Scores }) {
  const peak = Math.max(...AXES.flatMap((e) => [scores[e].force, scores[e].ombre]));
  // Scale to the data (rounded up to 25) so a balanced profile isn't squashed in the centre
  const max = Math.max(50, Math.ceil(peak / 25) * 25);
  const rings = Array.from({ length: max / 25 }, (_, i) => (i + 1) * 25);

  const point = (i: number, value: number) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 2;
    const r = (value / max) * R;
    return [C + r * Math.cos(angle), C + r * Math.sin(angle)];
  };
  const polygon = (key: 'force' | 'ombre') =>
    AXES.map((e, i) => point(i, scores[e][key]).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{ maxWidth: SIZE }} role="img"
      fontFamily="'Plus Jakarta Sans', Helvetica, Arial, sans-serif"
      aria-label="Radar Force et Ombre des quatre éléments">
      {rings.map((v) => (
        <polygon key={v} points={AXES.map((_, i) => point(i, v).join(',')).join(' ')}
          fill="none" stroke="rgba(0,0,0,0.08)" />
      ))}
      {AXES.map((e, i) => {
        const [x, y] = point(i, max);
        const [lx, ly] = point(i, max * 1.2);
        return (
          <g key={e}>
            <line x1={C} y1={C} x2={x} y2={y} stroke="rgba(0,0,0,0.08)" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
              fontSize="15" fontWeight="600" fill={ELEMENT_INFO[e].couleur}>
              {ELEMENT_INFO[e].nom}
            </text>
          </g>
        );
      })}
      <polygon points={polygon('ombre')} fill="rgba(120,120,120,0.08)" stroke="#888"
        strokeWidth="1.5" strokeDasharray="5 5" />
      <polygon points={polygon('force')} fill="rgba(44,27,94,0.12)" stroke="#2C1B5E" strokeWidth="2" />
      {AXES.map((e, i) => {
        const [x, y] = point(i, scores[e].force);
        return <circle key={e} cx={x} cy={y} r="4" fill="#2C1B5E" />;
      })}
      {/* Legend */}
      <g fontSize="12" fill="#555">
        <line x1={C - 130} y1={SIZE - 12} x2={C - 110} y2={SIZE - 12} stroke="#2C1B5E" strokeWidth="2" />
        <text x={C - 104} y={SIZE - 8}>Force (qualités)</text>
        <line x1={C + 10} y1={SIZE - 12} x2={C + 30} y2={SIZE - 12} stroke="#888" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x={C + 36} y={SIZE - 8}>Ombre (défauts)</text>
      </g>
    </svg>
  );
}
