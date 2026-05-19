// ──────────────────────────────────────────────────
// Narration Scripts — Natural Teacher Voice
// Warm, child-friendly narration for each lesson phase
// ──────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ─── INTRO SCREEN ────────────────────────────────
export function introNarration() {
  return [
    say("Word Problems Using Addition"),
    say("Lesson 2.5. Learn to solve addition word problems"),
    cheer("I'll teach you to solve word problems!"),
  ];
}

// ─── WONDER PHASE ────────────────────────────────
export function wonderNarration(questionText, subtext) {
  return [
    ask(questionText),
    say(subtext),
  ];
}

export function wonderDiscoverNarration() {
  return [];
}

// ─── STORY PHASE ─────────────────────────────────

export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("One morning, Mia brought 6 red apples to school. Her friend Raju gave her 4 more green apples. Mia looked at all her apples and wondered..."),
        ask("How many apples do I have altogether?"),
        say("Let's help Mia!"),
      ];
    case 1:
      return [
        say("Priya showed Mia a trick! She put the 6 red apples on one side and the 4 green apples on the other. Then she pushed them all together! When we combine two groups, we ADD! said Priya."),
        emphasize("6 plus 4 equals 10 apples altogether!"),
        say("Adding means combining!"),
      ];
    case 2:
      return [
        say("Then Wei Ming drew a special picture called a bar model. He drew two smaller bars — one for 6 and one for 4 — and showed how together they make the big bar of 10! The parts make the whole! he said."),
        emphasize("Part plus Part equals Whole!"),
        say("Parts make the whole!"),
      ];
    case 3:
      return [
        say("Mia was so excited! She learned she could use number bonds, bar models, and even a number line to solve word problems. Can we practice more? she asked. And so, the word problem adventure began!"),
        cheer("Word problems — here we come!"),
        say("Your turn now!"),
      ];
    default:
      return [];
  }
}

// ─── SIMULATE PHASE ──────────────────────────────

export function simulateStation1Intro(name, objName, p1, p2) {
  const pronoun = (name === 'Siti' || name === 'Mia') ? 'her' : 'him';
  return [
    say(`${name} has ${p1} ${objName}. A friend gives ${pronoun} ${p2} more. How many altogether?`),
  ];
}

export function simulateStation1Combine(p1, p2) {
  return [];
}

export function simulateStation1Answer(p1, p2, whole) {
  return [
    celebrate(`${p1} plus ${p2} equals ${whole}!`),
  ];
}

export function simulateStation2Intro(objName) {
  return [
    say("Find both parts to reveal the whole!"),
  ];
}

export function simulateStation2Complete(p1, p2, total) {
  return [
    celebrate(`${p1} plus ${p2} equals ${total}!`),
  ];
}

export function simulateStation3Intro(text) {
  return [
    say(text),
  ];
}

export function simulateStation3PartA(val) {
  return [];
}

export function simulateStation3Complete(p1, p2, whole) {
  return [
    celebrate(`${p1} plus ${p2} equals ${whole}!`),
  ];
}

export function simulateStation4Intro(start, jumps) {
  return [
    say(`Start at ${start}. Jump ${jumps} more times. Where do you land?`),
  ];
}

export function simulateStation4Complete(start, jumps, answer) {
  return [
    celebrate(`${start} plus ${jumps} equals ${answer}!`),
    cheer("Great jumping!"),
  ];
}

export function simulateAllComplete() {
  return [];
}

// ─── PLAY PHASE ──────────────────────────────────

export function playWorldIntro(worldName) {
  return [
    celebrate(`Welcome to ${worldName}!`),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
  ];
}

export function playCorrectNarration(streak = 0) {
  return [];
}

export function playWrongNarration() {
  return [];
}

export function playWorldComplete(worldName, score, total) {
  return [
    say(`${worldName} Complete!`),
    say(`Score: ${score} out of ${total}`),
  ];
}

// ─── REFLECT PHASE ───────────────────────────────

export function reflectIntroNarration() {
  return [
    say("Teach the mascot what you learned!"),
  ];
}

export function reflectCorrectNarration() {
  return [];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [
    ask("How do you feel about word problems?"),
    say("Be honest — every answer is great!"),
  ];
}

export function reflectCertificateNarration(pct) {
  if (pct >= 80) {
    return [
      say("Incredible! You are an Addition Master!"),
    ];
  }
  if (pct >= 50) {
    return [
      say("Great effort! Keep practicing!"),
    ];
  }
  return [
    say("Good start! Try again to improve!"),
  ];
}
