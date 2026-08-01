// src/features/simulate/simulations/wordProblemRound.js
// Shared round-generation helpers for the 3 Simulate missions (Sticker
// Combine, Bar Model Builder, Number Line Hop) — all three need a small
// themed pair of numbers plus an object/emoji, so it lives here once
// instead of being duplicated three times.
export { useNumberKeySelect } from '../../../core/hooks/useKeyboard.js';

export function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A handful of mini object themes distinct from (but consistent in spirit
// with) the main 10 worlds — each Simulate mission runs short, so these
// use simple within-10 or within-20 pairs. Stickers appear most often
// since it's Priya's own story project, tying Simulate directly back to
// Story.
const MINI_OBJECTS = [
  { icon: '🍭', word: 'stickers', emoji: '⭐' },
  { icon: '🍭', word: 'stickers', emoji: '⭐' },
  { icon: '🍎', word: 'apples', emoji: '🍎' },
  { icon: '🎈', word: 'balloons', emoji: '🎈' },
];

// Generates a small pair of grid-aligned, within-20 addition values from a
// random mini theme, regenerated until both parts and the whole are
// distinct (clearer tap targets with no ambiguous ties).
export function genMiniProblem() {
  const theme = pick(MINI_OBJECTS);
  let part1, part2, whole;
  let guard = 0;
  do {
    part1 = randInt(2, 9);
    part2 = randInt(2, 9);
    whole = part1 + part2;
    guard++;
  } while (part1 === part2 && guard < 20);
  return { theme, part1, part2, whole };
}
