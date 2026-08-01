// src/components/NumberLineVisual.jsx
// Topic-adapted equivalent of the reference module's LineGraph.jsx —
// a count-on number line: a frog hops from 0 to `part1`, then hops again
// by `part2` to land on the total, matching the Primary 1 "count on"
// number-line method.

export default function NumberLineVisual({
  part1 = 0,
  part2 = 0,
  whole = 0,
  compact = false,
}) {
  const width = 300;
  const height = compact ? 90 : 110;
  const padX = 20;
  const trackY = compact ? 60 : 74;
  const trackW = width - padX * 2;
  const max = Math.max(whole + 2, 10);

  const xFor = (v) => padX + (v / max) * trackW;

  const ticks = [];
  const tickStep = max <= 20 ? 1 : 5;
  for (let t = 0; t <= max; t += tickStep) ticks.push(t);

  const midJump1Y = trackY - (compact ? 22 : 28);
  const midJump2Y = trackY - (compact ? 34 : 42);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`number-line-visual${compact ? ' compact' : ''}`}
      role="img"
      aria-label={`Number line showing ${part1} plus ${part2} equals ${whole}`}
    >
      <line x1={padX} x2={width - padX} y1={trackY} y2={trackY} className="number-line-track" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={xFor(t)} x2={xFor(t)} y1={trackY - 4} y2={trackY + 4} className="number-line-tick" />
          {!compact && <text x={xFor(t)} y={trackY + 16} className="number-line-tick-label">{t}</text>}
        </g>
      ))}

      {/* Hop 1: 0 -> part1 */}
      <path
        d={`M ${xFor(0)} ${trackY} Q ${xFor(part1 / 2)} ${midJump1Y} ${xFor(part1)} ${trackY}`}
        className="number-line-jump"
      />
      {/* Hop 2: part1 -> whole */}
      <path
        d={`M ${xFor(part1)} ${trackY} Q ${xFor(part1 + part2 / 2)} ${midJump2Y} ${xFor(whole)} ${trackY}`}
        className="number-line-jump"
      />

      <circle cx={xFor(0)} cy={trackY} r={4} className="number-line-point start" />
      <circle cx={xFor(part1)} cy={trackY} r={4} className="number-line-point start" />
      <circle cx={xFor(whole)} cy={trackY} r={5} className="number-line-point end" />
      <text x={xFor(whole)} y={trackY - (compact ? 40 : 50)} className="number-line-frog">🐸</text>
    </svg>
  );
}
