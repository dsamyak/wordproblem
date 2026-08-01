// src/core/questions/questionBank.js
// Procedural question generator — 100 questions, 10 types, 10 worlds.
// Topic: Word Problems Using Addition, Grade 1 (Primary 1, Lesson 2.5).
//
// Every world's 10 questions are generated around that world's own theme
// (see WORLD_THEMES) — e.g. "Fruit Stall Market" questions are always
// about fruit, "Pet Corner" questions are always about pets — rather
// than drawing from one generic, world-agnostic pool.
//
// Core skill taught: solving 1-step addition word problems within 20 and
// within 100, using the Singapore CPA (concrete-pictorial-abstract)
// progression — number bonds, part-whole bar models, and a count-on
// number line — the addition word-problem skills taught at Primary 1
// level (Targeting Mathematics Primary 1A, Sections 3 & 8).
import { BADGES } from '../../config/worlds.config.js';

function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Shared, non-English, Singapore-context name pool ──────────────────
const FEMALE_NAMES = ['Priya', 'Siti', 'Kavya', 'Mei Ling', 'Aisha', 'Nadia'];
const MALE_NAMES = ['Wei Ming', 'Farhan', 'Ahmad', 'Ravi', 'Arun', 'Zul'];
const NAMES = [...FEMALE_NAMES, ...MALE_NAMES];
function pickName() { return randChoice(NAMES); }
function pickOtherName(exclude) { return randChoice(NAMES.filter((n) => n !== exclude)); }
function pronoun(name) { return FEMALE_NAMES.includes(name) ? 'her' : 'him'; }

const COLORS = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'pink', 'brown'];
const COST_ITEMS = ['mango', 'banana', 'pencil', 'eraser', 'ruler', 'notebook', 'bookmark', 'glue stick', 'sharpener', 'kuih', 'popsicle', 'pen'];
const LENGTH_ITEMS_A = ['red ribbon', 'blue pencil', 'yellow stick', 'green string'];
const LENGTH_ITEMS_B = ['white rope', 'orange tape', 'purple crayon', 'brown straw'];

// ── World themes ────────────────────────────────────────────────────────
// Mirrors the 10 worlds in config/worlds.config.js (by index). Each theme
// supplies the setting/objects every question in that world is built
// around — keeps each world's 10 questions feeling distinct and on-theme,
// e.g. Fruit Stall Market questions are always about fruit.
const WORLD_THEMES = [
  { icon: '🎈', place: 'playground', collectiveLabel: 'playground toys', shopName: 'playground snack cart',
    objects: [{ word: 'balloons', emoji: '🎈' }, { word: 'kites', emoji: '🪁' }, { word: 'pails', emoji: '🪣' }, { word: 'hula hoops', emoji: '⭕' }] },
  { icon: '🍎', place: 'fruit stall', collectiveLabel: 'fruits', shopName: 'fruit stall',
    objects: [{ word: 'apples', emoji: '🍎' }, { word: 'mangoes', emoji: '🥭' }, { word: 'bananas', emoji: '🍌' }, { word: 'oranges', emoji: '🍊' }] },
  { icon: '⭐', place: 'classroom', collectiveLabel: 'stationery items', shopName: 'classroom stationery corner',
    objects: [{ word: 'stickers', emoji: '⭐' }, { word: 'crayons', emoji: '🖍️' }, { word: 'pencils', emoji: '✏️' }, { word: 'notebooks', emoji: '📓' }] },
  { icon: '🍢', place: 'hawker centre', collectiveLabel: 'snacks', shopName: 'hawker centre stall',
    objects: [{ word: 'fish balls', emoji: '🍢' }, { word: 'dumplings', emoji: '🥟' }, { word: 'sweets', emoji: '🍬' }, { word: 'lollipops', emoji: '🍭' }] },
  { icon: '🐟', place: 'pet corner', collectiveLabel: 'pets', shopName: 'pet corner shop',
    objects: [{ word: 'goldfish', emoji: '🐠' }, { word: 'rabbits', emoji: '🐰' }, { word: 'hamsters', emoji: '🐹' }, { word: 'birds', emoji: '🐦' }] },
  { icon: '📚', place: 'library', collectiveLabel: 'books', shopName: 'library book fair',
    objects: [{ word: 'storybooks', emoji: '📚' }, { word: 'bookmarks', emoji: '🔖' }, { word: 'comics', emoji: '📖' }, { word: 'puzzles', emoji: '🧩' }] },
  { icon: '🎉', place: 'party', collectiveLabel: 'party items', shopName: 'party supply stall',
    objects: [{ word: 'balloons', emoji: '🎈' }, { word: 'party hats', emoji: '🎉' }, { word: 'cupcakes', emoji: '🧁' }, { word: 'gift bags', emoji: '🎁' }] },
  { icon: '🚌', place: 'bus stop', collectiveLabel: 'bags', shopName: 'bus stop kiosk',
    objects: [{ word: 'school bags', emoji: '🎒' }, { word: 'umbrellas', emoji: '☂️' }, { word: 'water bottles', emoji: '🧴' }, { word: 'lunch boxes', emoji: '🍱' }] },
  { icon: '🎲', place: 'void deck', collectiveLabel: 'game pieces', shopName: 'void deck store',
    objects: [{ word: 'marbles', emoji: '🔵' }, { word: 'dice', emoji: '🎲' }, { word: 'playing cards', emoji: '🃏' }, { word: 'coins', emoji: '🪙' }] },
  { icon: '🏅', place: 'sports day', collectiveLabel: 'medals', shopName: 'sports day canteen',
    objects: [{ word: 'medals', emoji: '🏅' }, { word: 'trophies', emoji: '🏆' }, { word: 'ribbons', emoji: '🎗️' }, { word: 'flags', emoji: '🚩' }] },
];

// Difficulty rises with world index: worlds 0–2 easy, 3–5 medium, 6–9 hard.
function difficultyForWorld(worldId) {
  if (worldId <= 2) return 1;
  if (worldId <= 5) return 2;
  return 3;
}

// Numeric-answer distractors: common word-problem mistakes — off-by-one,
// subtracting instead of adding, and picking the bigger number alone.
function genOptions(correct, part1, part2) {
  const c = Number(correct);
  const distractors = new Set();
  const candidates = [
    c + 1, c - 1, c + 2, c - 2,
    Math.abs(part1 - part2),  // common mistake: subtract instead of add
    Math.max(part1, part2),   // common mistake: pick the bigger number
  ];
  candidates.filter((d) => d > 0 && d !== c).forEach((d) => { if (distractors.size < 3) distractors.add(d); });
  let attempts = 0;
  while (distractors.size < 3 && attempts < 30) {
    const off = Math.ceil(Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1);
    const d = c + off;
    if (d > 0 && d !== c && !distractors.has(d)) distractors.add(d);
    attempts++;
  }
  return shuffleArray([c, ...[...distractors].slice(0, 3)]).map(String);
}

// ── Q1: "Altogether" story — two groups combined, find the total ──
function genQ1(id, diff, theme) {
  const pairs = diff === 1 ? [[2, 3], [4, 2], [1, 5], [3, 3]] : diff === 2 ? [[5, 6], [7, 4], [6, 8], [8, 3]] : [[9, 8], [7, 9]];
  const [p1, p2] = randChoice(pairs);
  const total = p1 + p2;
  const name = pickName();
  const giver = pickOtherName(name);
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_altogether', world: 0, difficulty: diff,
    questionText: `${theme.icon} ${name} has ${p1} ${obj.word}. ${giver} gives ${pronoun(name)} ${p2} more ${obj.word}. How many ${obj.word} does ${name} have altogether?`,
    visual: 'number_bond', part1: p1, part2: p2, whole: total, missing: 'whole', objectEmoji: obj.emoji,
    hint1: 'The word "altogether" is an addition keyword — it means ADD!',
    hint2: `Number bond: ${p1} + ${p2} = ?`,
    explanation: `${name} starts with ${p1} ${obj.word} and gets ${p2} more. ${p1} + ${p2} = ${total}.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q2: "In all" story — two different groups, find the sum ──
function genQ2(id, diff, theme) {
  const pairs = diff === 1 ? [[3, 4], [2, 5], [4, 3], [1, 6]] : diff === 2 ? [[5, 7], [6, 6], [8, 4]] : [[7, 8], [9, 6], [8, 7]];
  const [p1, p2] = randChoice(pairs);
  const total = p1 + p2;
  const [objA, objB] = shuffleArray(theme.objects).slice(0, 2);
  return {
    id, type: 'word_problem_in_all', world: 0, difficulty: diff,
    questionText: `${theme.icon} There are ${p1} ${objA.word} and ${p2} ${objB.word} at the ${theme.place}. How many ${theme.collectiveLabel} are there in all?`,
    visual: 'story_scene', part1: p1, part2: p2, whole: total, objectEmojiA: objA.emoji, objectEmojiB: objB.emoji,
    hint1: '"In all" is an addition keyword — it means you ADD the two groups together!',
    hint2: `First group: ${p1}. Second group: ${p2}. Add them: ${p1} + ${p2} = ?`,
    explanation: `"In all" means addition. ${p1} ${objA.word} + ${p2} ${objB.word} = ${total} ${theme.collectiveLabel} in all.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q3: "How many now?" joining story (within 10) ──
function genQ3(id, diff, theme) {
  const pairs = diff === 1 ? [[1, 2], [2, 3], [1, 4], [3, 2], [2, 2]] : diff === 2 ? [[3, 4], [4, 3], [2, 5]] : [[4, 5], [5, 4]];
  const [p1, p2] = randChoice(pairs);
  const total = p1 + p2;
  const name = pickName();
  const giver = pickOtherName(name);
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_how_many_now', world: 0, difficulty: diff,
    questionText: `${theme.icon} ${name} has ${p1} ${obj.word}. ${giver} gives ${pronoun(name)} ${p2} more ${obj.word}. How many ${obj.word} does ${name} have now?`,
    visual: 'number_bond', part1: p1, part2: p2, whole: total, missing: 'whole', objectEmoji: obj.emoji,
    hint1: '"Gives more" is a clue that this is an addition word problem!',
    hint2: `Start with ${p1}, then add ${p2} more. Count on: ${p1} + ${p2} = ?`,
    explanation: `${name} starts with ${p1} ${obj.word} and gets ${p2} more. ${p1} + ${p2} = ${total}.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q4: Bigger-numbers story (1-digit + 2-digit, within 100) ──
function genQ4(id, diff, theme) {
  const p1 = diff === 1 ? randChoice([11, 12, 13]) : diff === 2 ? randChoice([14, 21, 23]) : randChoice([35, 42, 56]);
  const p2 = diff === 1 ? randChoice([2, 3, 4]) : diff === 2 ? randChoice([5, 6, 7]) : randChoice([8, 9]);
  const total = p1 + p2;
  const name = pickName();
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_bigger_numbers', world: 0, difficulty: diff,
    questionText: `${theme.icon} ${name} collects ${obj.word}. ${name} already has ${p1} ${obj.word}. A friend gives ${pronoun(name)} ${p2} more ${obj.word}. How many ${obj.word} does ${name} have now?`,
    visual: 'bar_model', part1: p1, part2: p2, whole: total, missing: 'whole', objectEmoji: obj.emoji,
    hint1: 'This word problem says "gives more" — that means ADD!',
    hint2: `Bar model: Part 1 = ${p1}, Part 2 = ${p2}. Whole = ${p1} + ${p2} = ?`,
    explanation: `"Gives more" means addition. ${p1} + ${p2} = ${total}. ${name} now has ${total} ${obj.word}.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q5: "Added to" story (2-digit + 1-digit, within 100) ──
function genQ5(id, diff, theme) {
  const p1 = diff === 1 ? randChoice([20, 21, 22]) : diff === 2 ? randChoice([23, 31, 34]) : randChoice([45, 67, 78]);
  const p2 = diff === 1 ? randChoice([3, 4, 5]) : diff === 2 ? randChoice([5, 6, 7]) : randChoice([7, 8, 9]);
  const total = p1 + p2;
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_added_to', world: 0, difficulty: diff,
    questionText: `${theme.icon} There are ${p1} ${obj.word} at the ${theme.place}. Someone brings ${p2} more ${obj.word}. How many ${obj.word} are there now?`,
    visual: 'bar_model', part1: p1, part2: p2, whole: total, missing: 'whole', objectEmoji: obj.emoji,
    hint1: '"Brings more" is a word problem clue — it means ADD!',
    hint2: `Bar model: [${p1}] + [${p2}] = [?]`,
    explanation: `"Brings more" means addition. ${p1} + ${p2} = ${total} ${obj.word} at the ${theme.place}.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q6: "Received / got more" story (within 20) ──
function genQ6(id, diff, theme) {
  const pairs = diff === 1 ? [[3, 4], [4, 5], [2, 6], [5, 3]] : diff === 2 ? [[6, 5], [7, 6], [5, 8], [8, 4]] : [[8, 7], [9, 8]];
  const [p1, p2] = randChoice(pairs);
  const total = p1 + p2;
  const name = pickName();
  const giver = pickOtherName(name);
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_received', world: 0, difficulty: diff,
    questionText: `${theme.icon} ${name} had ${p1} ${obj.word} in the morning. In the afternoon, ${giver} gave ${pronoun(name)} ${p2} more ${obj.word}. How many ${obj.word} does ${name} have at the end of the day?`,
    visual: 'story_scene', part1: p1, part2: p2, whole: total, objectEmojiA: obj.emoji, objectEmojiB: obj.emoji,
    hint1: '"Gave more" is an addition keyword in word problems!',
    hint2: `Morning: ${p1}. Afternoon: got ${p2} more. Total = ${p1} + ${p2} = ?`,
    explanation: `Started with ${p1}, received ${p2} more. ${p1} + ${p2} = ${total}.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q7: "Total cost" story (money, within 100) ──
function genQ7(id, diff, theme) {
  const p1 = diff === 1 ? randChoice([10, 15, 20]) : diff === 2 ? randChoice([25, 30, 35]) : randChoice([40, 45, 50]);
  const p2 = diff === 1 ? randChoice([5, 10, 15]) : diff === 2 ? randChoice([20, 25, 30]) : randChoice([25, 35, 45]);
  const total = p1 + p2;
  const [item1, item2] = shuffleArray(COST_ITEMS).slice(0, 2);
  return {
    id, type: 'word_problem_total_cost', world: 0, difficulty: diff,
    questionText: `${theme.icon} At the ${theme.shopName}, a ${item1} costs ${p1} cents and a ${item2} costs ${p2} cents. What is the total cost of both items?`,
    visual: 'bar_model', part1: p1, part2: p2, whole: total, missing: 'whole', unit: '¢',
    hint1: '"Total cost" is a word problem clue that means ADD the two prices!',
    hint2: `Price of ${item1}: ${p1}¢. Price of ${item2}: ${p2}¢. Total = ${p1} + ${p2} = ?`,
    explanation: `"Total cost" means addition. ${p1}¢ + ${p2}¢ = ${total}¢.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q8: "Combined length" story (within 20) ──
function genQ8(id, diff, theme) {
  const pairs = diff === 1 ? [[3, 4], [2, 5], [4, 3], [5, 2]] : diff === 2 ? [[5, 6], [6, 5], [7, 4], [4, 8]] : [[8, 7], [9, 6]];
  const [p1, p2] = randChoice(pairs);
  const total = p1 + p2;
  const obj1 = randChoice(LENGTH_ITEMS_A);
  const obj2 = randChoice(LENGTH_ITEMS_B);
  return {
    id, type: 'word_problem_total_length', world: 0, difficulty: diff,
    questionText: `${theme.icon} A ${obj1} is ${p1} cm long. A ${obj2} is ${p2} cm long. If you place them end to end, what is the total length?`,
    visual: 'number_line', part1: p1, part2: p2, whole: total, unit: 'cm',
    hint1: '"Total length" is a word problem clue — ADD the two lengths!',
    hint2: `Length 1: ${p1} cm. Length 2: ${p2} cm. Total = ${p1} + ${p2} = ?`,
    explanation: `"Total length" means addition. ${p1} cm + ${p2} cm = ${total} cm.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// ── Q9: Number bond missing-part story (within 20) ──
function genQ9(id, diff, theme) {
  const wholeVal = diff === 1 ? randChoice([7, 8, 9, 10]) : diff === 2 ? randChoice([11, 13, 15, 16]) : randChoice([17, 18, 19]);
  const p1 = diff === 1 ? randChoice([3, 4, 5]) : diff === 2 ? randChoice([5, 6, 7]) : randChoice([8, 9]);
  const p2 = wholeVal - p1;
  if (p2 <= 0) return genQ9(id, diff, theme);
  const name = pickName();
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_missing_part', world: 0, difficulty: diff,
    questionText: `${theme.icon} ${name} wants to collect ${wholeVal} ${obj.word} in total. ${name} already has ${p1} ${obj.word}. How many more ${obj.word} does ${name} need?`,
    visual: 'number_bond', part1: p1, part2: p2, whole: wholeVal, missing: 'part2', objectEmoji: obj.emoji,
    hint1: 'This word problem asks "how many more?" — find the missing part!',
    hint2: `Number bond: [${p1}] + [?] = [${wholeVal}]. What plus ${p1} makes ${wholeVal}?`,
    explanation: `${p1} + ? = ${wholeVal}. The answer is ${p2}, because ${p1} + ${p2} = ${wholeVal}.`,
    options: genOptions(p2, p1, p2), correctAnswer: String(p2),
  };
}

// ── Q10: Two-part coloured-groups story (within 100) ──
function genQ10(id, diff, theme) {
  const p1 = diff === 1 ? randChoice([5, 8, 10]) : diff === 2 ? randChoice([12, 15, 18]) : randChoice([23, 34, 45]);
  const p2 = diff === 1 ? randChoice([3, 4, 5]) : diff === 2 ? randChoice([7, 8, 12]) : randChoice([15, 21, 27]);
  const total = p1 + p2;
  const [colorA, colorB] = shuffleArray(COLORS).slice(0, 2);
  const obj = randChoice(theme.objects);
  return {
    id, type: 'word_problem_two_part_story', world: 0, difficulty: diff,
    questionText: `${theme.icon} At the ${theme.place}, there are ${p1} ${colorA} ${obj.word} and ${p2} ${colorB} ${obj.word}. How many ${obj.word} are there in all?`,
    visual: 'bar_model', part1: p1, part2: p2, whole: total, missing: 'whole', objectEmoji: obj.emoji,
    hint1: `"In all" is the addition keyword — ADD both groups of ${obj.word}!`,
    hint2: `Group 1: ${p1} ${colorA} ${obj.word}. Group 2: ${p2} ${colorB} ${obj.word}. Total = ${p1} + ${p2} = ?`,
    explanation: `"In all" means addition. ${p1} ${colorA} + ${p2} ${colorB} = ${total} ${obj.word} in all.`,
    options: genOptions(total, p1, p2), correctAnswer: String(total),
  };
}

// One (type, genFn) pair per world → each world gets exactly one question
// of every type, so every world still has full type variety, just themed.
const TYPE_GENERATORS = [
  ['word_problem_altogether',    genQ1],
  ['word_problem_in_all',        genQ2],
  ['word_problem_how_many_now',  genQ3],
  ['word_problem_bigger_numbers', genQ4],
  ['word_problem_added_to',      genQ5],
  ['word_problem_received',      genQ6],
  ['word_problem_total_cost',    genQ7],
  ['word_problem_total_length',  genQ8],
  ['word_problem_missing_part',  genQ9],
  ['word_problem_two_part_story', genQ10],
];

export function generateSessionQuestions() {
  const all = [];
  for (let worldId = 0; worldId < WORLD_THEMES.length; worldId++) {
    const theme = WORLD_THEMES[worldId];
    const diff = difficultyForWorld(worldId);
    const worldQuestions = TYPE_GENERATORS.map(([type, genFn], i) =>
      genFn(`${type}_w${worldId}_${i}`, diff, theme)
    );
    shuffleArray(worldQuestions).forEach((q) => { q.world = worldId; all.push(q); });
  }
  return all;
}

export const BADGE_TESTS = {
  first_conversion:  (s) => s.totalScore > 0,
  hot_streak:        (s) => s.maxStreak >= 5,
  pace_star:         (s) => s.simulateDone,
  conversion_master: (s) => s.totalQuestions > 0 && s.totalScore / s.totalQuestions >= 0.8,
  personal_best:     (s) => s.worldResults.some(w => w && w.correct === w.total),
  boss_slayer:       (s) => s.bossWon,
  full_journey:      (s) => s.reflectDone,
};

export function checkBadges(sessionState) {
  return BADGES.filter(b => (BADGE_TESTS[b.id] ? BADGE_TESTS[b.id](sessionState) : false));
}

export function scoreAnswer({ isCorrect, isFirstTry, streak }) {
  if (!isCorrect) return { xp: 0, newStreak: 0 };
  let xp = isFirstTry ? 10 : 5;
  const newStreak = streak + 1;
  if (newStreak >= 5 && newStreak % 5 === 0) xp += 5;
  return { xp, newStreak };
}

export function calcStars(correctCount, totalCount = 10) {
  const pct = totalCount > 0 ? correctCount / totalCount : 0;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function isWorldUnlocked() {
  return true; // direct phase/world switching is allowed throughout
}
