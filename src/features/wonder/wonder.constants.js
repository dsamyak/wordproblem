// src/features/wonder/wonder.constants.js
//
// Units are always spelled out in full ("cents", "centimetres") never as
// raw symbols ("¢", "cm") — this text is narrated directly by
// wonderHookNarration(), and text-to-speech misreads symbols and
// abbreviations. Digits themselves are fine to leave as digits;
// text-to-speech reads "6" or "10" correctly.
export const WONDER_QUESTIONS = [
  {
    id: 1,
    emoji: '🍭',
    question: "Priya has 6 red stickers and gets 4 more blue stickers — how can pushing both groups together help us find how many she has altogether?",
    subtext: "What happens to two separate groups of things when you combine them into one group?",
    narrationId: 'wonder_1',
  },
  {
    id: 2,
    emoji: '🔵',
    question: "A number bond shows two parts joining to make one whole — if one part is 8 and the other part is 5, what does the whole circle show?",
    subtext: "Could the whole just be both parts added together?",
    narrationId: 'wonder_2',
  },
  {
    id: 3,
    emoji: '📊',
    question: "A bar model has two smaller bars sitting side by side, and one big bar underneath — what job does the big bar do?",
    subtext: "Could the big bar be showing the two smaller bars combined into one?",
    narrationId: 'wonder_3',
  },
  {
    id: 4,
    emoji: '🐸',
    question: "A frog starts at 6 on a number line and hops forward 4 more spaces — where will it land, and why?",
    subtext: "Counting on from a number is another way of doing the very same thing as adding.",
    narrationId: 'wonder_4',
  },
  {
    id: 5,
    emoji: '🔍',
    question: "Word problems often use clue words like altogether, in all, and how many more — what job do these words do?",
    subtext: "Could spotting the right clue word tell us which numbers to add?",
    narrationId: 'wonder_5',
  },
];
