// src/utils/narration.js
//
// Every narration segment is a { text, style } object, where `style`
// selects a voice-setting preset from config/audio.config.js.
//
// IMPORTANT: unit abbreviations are always spoken as full words —
// "5 centimetres", "20 cents" — never as raw symbols or abbreviations
// ("5cm", "20¢"), since text-to-speech misreads those. Hand-authored
// text (story slides, wonder questions) is already written this way
// below. For the procedurally generated Practice-phase questions,
// spokenSafe() rewrites the abbreviated units baked into
// questionText/hint/explanation strings into full words before they're
// narrated — the on-screen text keeps the compact form ("5 cm", "40¢")
// since that's how word problems are actually printed.
export function spokenSafe(text) {
  if (!text) return text;
  let t = text;
  t = t.replace(/(\d+)\s?¢/g, '$1 cents');
  t = t.replace(/\$(\d+)/g, '$1 dollars');
  const unitWords = {
    cm: 'centimetres',
    kg: 'kilograms',
  };
  for (const [abbr, word] of Object.entries(unitWords)) {
    const re = new RegExp(`(\\d)\\s?${abbr}\\b`, 'g');
    t = t.replace(re, `$1 ${word}`);
  }
  return t;
}

// ── Story narration ──
// One segment per slide, in slide order. StoryPhase.jsx plays
// storyNarrations.wordProblems[currentSlide] whenever the slide changes.
export const storyNarrations = {
  wordProblems: [
    {
      text: "Priya brought 6 red stickers to school. Her classmate Wei Ming gave her 4 more blue stickers. Priya looked at all her stickers and wondered, how many stickers do I have altogether?",
      style: 'thinking',
    },
    {
      text: "Wei Ming has a trick! He put the 6 red stickers on one side and the 4 blue stickers on the other. Then he pushed them all together. When we combine two groups, we add, said Wei Ming. 6 plus 4 makes 10 stickers altogether!",
      style: 'instruction',
    },
    {
      text: "Then Farhan drew a special picture called a bar model. He drew two smaller bars, one for 6 and one for 4, and showed how together they make one big bar of 10. The parts make the whole, he said.",
      style: 'emphasis',
    },
    {
      text: "Priya grinned. Now she could use number bonds, bar models, and even a number line to solve any addition word problem. Can we practice more, she asked. And so the word problem adventure began!",
      style: 'celebration',
    },
  ],
};

// ── Wonder-hook narration ──
// Speaks the hook question, then its follow-up subtext. Note: the same
// wonder.question / wonder.subtext strings are also shown on screen, so
// wonder.constants.js already spells every unit out in full for this
// reason (digits themselves are fine — text-to-speech reads "6" or "10"
// correctly; it's abbreviations like "¢" or "cm" that are misread).
export function wonderHookNarration(wonder) {
  if (!wonder) return [];
  const segments = [];
  if (wonder.question) segments.push({ text: wonder.question, style: 'question' });
  if (wonder.subtext) segments.push({ text: wonder.subtext, style: 'thinking' });
  return segments;
}

// ── Simulate station intro narration ──
export function simulationStationNarration(stationId) {
  const scripts = [
    [
      { text: 'Sticker Combine Mission!', style: 'emphasis' },
      { text: 'Push the two groups together, then tap the number that shows how many there are altogether.', style: 'instruction' },
    ],
    [
      { text: 'Bar Model Builder Mission!', style: 'emphasis' },
      { text: 'Read the word problem, then tap the two parts to build the bar model and find the whole.', style: 'instruction' },
    ],
    [
      { text: 'Number Line Hop Mission!', style: 'emphasis' },
      { text: 'Watch the frog hop along the number line, then type in the number where it lands.', style: 'instruction' },
    ],
  ];
  return scripts[stationId] || [];
}

// ── Boss Battle narration ──
export function bossBattleNarration() {
  return [
    { text: 'Boss battle time! Answer every word problem correctly to win.', style: 'emphasis' },
    { text: 'Remember: find the two parts first, then add them together.', style: 'instruction' },
  ];
}

export function bossWinNarration() {
  return [
    { text: 'Boss defeated! Fantastic addition word problem solving!', style: 'celebration' },
  ];
}
