// src/components/NumberBond.jsx
// Topic-adapted equivalent of the reference module's LineGraph.jsx —
// a Singapore-method number bond showing two parts feeding into one
// whole, with whichever value is `missing` ('whole' | 'part2') replaced
// by a pulsing "?" circle.

export default function NumberBond({
  part1 = 0,
  part2 = 0,
  whole = 0,
  missing = 'whole',
  compact = false,
}) {
  const width = 260;
  const height = compact ? 110 : 140;
  const r = compact ? 26 : 32;
  const wholeCx = width / 2;
  const wholeCy = compact ? 22 : 26;
  const partCy = height - r - 6;
  const part1Cx = width / 2 - 66;
  const part2Cx = width / 2 + 66;

  const wholeMissing = missing === 'whole';
  const part2Missing = missing === 'part2';

  const wholeLabel = wholeMissing ? '?' : whole;
  const part1Label = part1;
  const part2Label = part2Missing ? '?' : part2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`number-bond${compact ? ' compact' : ''}`}
      role="img"
      aria-label={`Number bond: ${part1Label} and ${part2Label} make ${wholeLabel}`}
    >
      <line x1={wholeCx} y1={wholeCy + r} x2={part1Cx} y2={partCy - r} className="number-bond-line" />
      <line x1={wholeCx} y1={wholeCy + r} x2={part2Cx} y2={partCy - r} className="number-bond-line" />

      <circle cx={wholeCx} cy={wholeCy} r={r} className={`number-bond-circle whole${wholeMissing ? ' missing' : ''}`} />
      <text x={wholeCx} y={wholeCy + 7} className={`number-bond-value${wholeMissing ? ' missing-value' : ''}`}>{wholeLabel}</text>

      <circle cx={part1Cx} cy={partCy} r={r} className="number-bond-circle part" />
      <text x={part1Cx} y={partCy + 7} className="number-bond-value">{part1Label}</text>

      <circle cx={part2Cx} cy={partCy} r={r} className={`number-bond-circle part${part2Missing ? ' missing' : ''}`} />
      <text x={part2Cx} y={partCy + 7} className={`number-bond-value${part2Missing ? ' missing-value' : ''}`}>{part2Label}</text>
    </svg>
  );
}
