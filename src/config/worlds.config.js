// src/config/worlds.config.js
export const WORLDS = [
  { id: 0, name: 'Playground Friends',   emoji: '🎈', accent: '#42a5f5',
    description: 'Add up balloons, kites and pails with new playground friends',
    boss: { name: 'Recess Boss',      emoji: '🤸', reward: 'Playground Friends Badge 🎈' } },
  { id: 1, name: 'Fruit Stall Market',   emoji: '🍎', accent: '#66bb6a',
    description: 'Count apples, mangoes and bananas at the fruit stall',
    boss: { name: 'Market Boss',      emoji: '🧺', reward: 'Fruit Stall Badge 🍎' } },
  { id: 2, name: 'Classroom Stickers',   emoji: '⭐', accent: '#ff7043',
    description: 'Add up stickers, crayons and pencils in class',
    boss: { name: 'Homework Boss',    emoji: '📝', reward: 'Classroom Stickers Badge ⭐' } },
  { id: 3, name: 'Hawker Centre Snacks', emoji: '🍢', accent: '#ec407a',
    description: 'Add snacks — and their cost in cents — at the hawker centre',
    boss: { name: 'Supper Boss',      emoji: '🥡', reward: 'Hawker Centre Badge 🍢' } },
  { id: 4, name: 'Pet Corner',           emoji: '🐟', accent: '#8d6e63',
    description: 'Count goldfish, rabbits and hamsters at the pet corner',
    boss: { name: 'Playtime Boss',    emoji: '🐾', reward: 'Pet Corner Badge 🐟' } },
  { id: 5, name: 'Library Corner',       emoji: '📚', accent: '#ba68c8',
    description: 'Add up storybooks, bookmarks and comics at the library',
    boss: { name: 'Storytime Boss',   emoji: '📖', reward: 'Library Corner Badge 📚' } },
  { id: 6, name: 'Party Balloons',       emoji: '🎉', accent: '#26c6da',
    description: 'Add up balloons, party hats and cupcakes at the party',
    boss: { name: 'Celebration Boss', emoji: '🎂', reward: 'Party Balloons Badge 🎉' } },
  { id: 7, name: 'Bus Stop Queue',       emoji: '🚌', accent: '#fdd835',
    description: 'Add up bags, umbrellas and bottles in the bus stop queue',
    boss: { name: 'Rush Hour Boss',   emoji: '🕐', reward: 'Bus Stop Queue Badge 🚌' } },
  { id: 8, name: 'Void Deck Games',      emoji: '🎲', accent: '#5c6bc0',
    description: 'Add up marbles, dice and cards at the void deck',
    boss: { name: 'Game Night Boss',  emoji: '🃏', reward: 'Void Deck Games Badge 🎲' } },
  { id: 9, name: 'Sports Day Finale',    emoji: '🏅', accent: '#ff8f00',
    description: "Master every word-problem skill with Priya's Sports Day tally",
    boss: { name: 'Champion Coach',   emoji: '👑', reward: 'Finale Badge 🏅' } },
];

// ── Practice modes (within each world) ──
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// ── Badges ──
export const BADGES = [
  { id: 'first_conversion',  name: 'Story Starter',      icon: '🏅', desc: 'First correct answer' },
  { id: 'hot_streak',        name: 'Hot Streak',         icon: '🔥', desc: '5 consecutive correct' },
  { id: 'pace_star',         name: 'Problem Solver',     icon: '🥈', desc: 'Completed Simulate' },
  { id: 'conversion_master', name: 'Addition Ace',       icon: '🥇', desc: '80%+ correct overall' },
  { id: 'personal_best',     name: 'Personal Best',      icon: '💎', desc: 'A perfect world score' },
  { id: 'boss_slayer',       name: 'Boss Slayer',        icon: '👑', desc: 'Defeated a boss battle' },
  { id: 'full_journey',      name: 'Full Journey',       icon: '🌟', desc: 'Completed every phase' },
];

// ── XP economy ──
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};
