// src/components/ObjectGroups.jsx
// Concrete/pictorial CPA visual — two groups of emoji icons (capped for
// legibility) with a "+" between them, used by the "story_scene"
// question types (In All, Received).

const MAX_ICONS = 10;

function Group({ emoji, count }) {
  const shown = Math.min(count, MAX_ICONS);
  return (
    <div className="object-group">
      <div className="object-group-icons">
        {Array.from({ length: shown }, (_, i) => (
          <span key={i} role="img" aria-hidden="true">{emoji}</span>
        ))}
      </div>
      <div className="object-group-count">{count}</div>
    </div>
  );
}

export default function ObjectGroups({ emojiA, emojiB, part1, part2 }) {
  return (
    <div className="object-groups" role="img" aria-label={`${part1} and ${part2}`}>
      <Group emoji={emojiA} count={part1} />
      <span className="object-group-plus" aria-hidden="true">+</span>
      <Group emoji={emojiB} count={part2} />
    </div>
  );
}
