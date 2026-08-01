// src/components/BarModel.jsx
// Topic-adapted equivalent of the reference module's LineGraph.jsx —
// a Singapore-method part-whole bar model: two part-bars stacked above
// one whole-bar, each sized proportionally to its value. Whichever value
// is `missing` ('whole' | 'part2') is drawn as a dashed placeholder
// showing "?" instead of a number.

export default function BarModel({
  part1 = 0,
  part2 = 0,
  whole = 0,
  missing = 'whole',
  unit = '',
  compact = false,
}) {
  const width = 300;
  const barH = compact ? 26 : 32;
  const gap = 6;
  const padX = 14;
  const trackW = width - padX * 2;
  const height = barH * 2 + gap * 3 + (compact ? 14 : 20);

  const wholeMissing = missing === 'whole';
  const totalForScale = wholeMissing ? part1 + part2 : whole;
  const scale = trackW / Math.max(totalForScale, 1);

  const part1W = Math.max(part1 * scale, 26);
  const part2W = missing === 'part2' ? Math.max((whole - part1) * scale, 26) : Math.max(part2 * scale, 26);
  const wholeW = wholeMissing ? part1W + part2W : Math.max(whole * scale, part1W + part2W);

  const partsY = gap;
  const wholeY = partsY + barH + gap;

  const part1Label = part1;
  const part2Label = missing === 'part2' ? '?' : part2;
  const wholeLabel = wholeMissing ? '?' : whole;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`bar-model${compact ? ' compact' : ''}`}
      role="img"
      aria-label={`Bar model: part ${part1Label}, part ${part2Label}, whole ${wholeLabel}`}
    >
      {/* Part bars */}
      <rect x={padX} y={partsY} width={part1W} height={barH} className="bar-model-part part-a" />
      <text x={padX + part1W / 2} y={partsY + barH / 2 + 5} className="bar-model-label">{part1Label}{unit}</text>

      <rect x={padX + part1W} y={partsY} width={part2W} height={barH} className={`bar-model-part${missing === 'part2' ? ' missing' : ' part-b'}`} />
      <text x={padX + part1W + part2W / 2} y={partsY + barH / 2 + 5} className={`bar-model-label${missing === 'part2' ? ' missing-label' : ''}`}>{part2Label}{unit}</text>

      {/* Whole bar */}
      <rect x={padX} y={wholeY} width={wholeW} height={barH} className={`bar-model-part${wholeMissing ? ' missing' : ' whole-fill'}`} />
      <text x={padX + wholeW / 2} y={wholeY + barH / 2 + 5} className={`bar-model-label${wholeMissing ? ' missing-label' : ''}`}>{wholeLabel}{unit}</text>

      <text x={padX + trackW / 2} y={height - 3} className="bar-model-caption">Part + Part = Whole</text>
    </svg>
  );
}
