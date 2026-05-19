// ──────────────────────────────────────────────────
// Narration Scripts — Natural Teacher Voice
// Warm, child-friendly narration for each lesson phase
// ──────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ─── INTRO SCREEN ────────────────────────────────
export function introNarration() {
  return [
    cheer("Hello there, superstar! Welcome to today's maths adventure!"),
    say("Today, we're going to learn something really exciting."),
    say("Have you ever wondered how many toys you have altogether when you get more? That's exactly what we'll learn today!"),
    ask("Are you ready to become a word problem champion?"),
    cheer("I know you can do it! Let's go!"),
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
  return [
    celebrate("Let's find out together!"),
    say("I just know you're going to love what comes next!"),
  ];
}


// ─── STORY PHASE ─────────────────────────────────

export function storySlide1Narration() {
  return [
    cheer("Let me tell you a story about Mia!"),
    say("One morning, Mia brought 6 red apples to school."),
    say("Her friend Raju gave her 4 more green apples."),
    say("Mia looked at all her apples and wondered..."),
    ask("How many apples do I have altogether?"),
    think("What do you think? How can Mia find out?"),
    instruct("Let's help Mia solve this!"),
  ];
}

export function storySlide2Narration() {
  return [
    say("Priya showed Mia a clever trick!"),
    instruct("She put the 6 red apples on one side."),
    instruct("And the 4 green apples on the other side."),
    say("Then she pushed them all together!"),
    emphasize("When we combine two groups, we ADD!"),
    celebrate("6 plus 4 equals 10 apples altogether!"),
    cheer("Great thinking! Adding means combining two groups into one big group!"),
  ];
}

export function storySlide3Narration() {
  return [
    say("Then Wei Ming drew a special picture."),
    emphasize("It's called a bar model!"),
    instruct("He drew two smaller bars. One for 6, and one for 4."),
    say("And he showed how together they make the big bar of 10!"),
    ask("Can you see how the two parts make the whole?"),
    emphasize("Part plus part equals whole!"),
    cheer("That's the secret! The parts always add up to the whole!"),
  ];
}

export function storySlide4Narration() {
  return [
    celebrate("Mia was so excited!"),
    say("She learned she could use number bonds, bar models, and even a number line to solve word problems."),
    ask("Can we practice more?"),
    cheer("And so, the word problem adventure began!"),
    say("Now it's your turn to explore!"),
    celebrate("Let's try some hands-on activities! Are you ready?"),
  ];
}

export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0: return storySlide1Narration();
    case 1: return storySlide2Narration();
    case 2: return storySlide3Narration();
    case 3: return storySlide4Narration();
    default: return [];
  }
}


// ─── SIMULATE PHASE ──────────────────────────────

// Station 1: Story Scene — Combine Groups
export function simulateStation1Intro(name, objName, p1, p2) {
  const pronoun = (name === 'Siti' || name === 'Mia') ? 'her' : 'him';
  return [
    cheer("Let's try this together!"),
    say(`${name} has ${p1} ${objName}.`),
    say(`A friend gives ${pronoun} ${p2} more.`),
    ask(`How many ${objName} does ${name} have altogether?`),
    think("Take a moment to think."),
    instruct("Press the Combine button to see what happens!"),
  ];
}

export function simulateStation1Combine(p1, p2) {
  return [
    say(`${p1} plus ${p2} equals... let's see!`),
    instruct("Now click the answer to check!"),
  ];
}

export function simulateStation1Answer(p1, p2, whole) {
  return [
    celebrate(`That's right! ${p1} plus ${p2} equals ${whole}!`),
    cheer("Excellent work! You combined two groups perfectly!"),
  ];
}

// Station 2: Drag & Combine
export function simulateStation2Intro(objName) {
  return [
    say("Now let's try something fun!"),
    instruct(`Click each ${objName} to move it into the combined group.`),
    say("Count along as you add each one!"),
    ask(`Can you count them all?`),
  ];
}

export function simulateStation2Complete(p1, p2, total) {
  return [
    celebrate(`${p1} plus ${p2} equals ${total}!`),
    cheer("You counted them all! Fantastic!"),
  ];
}

// Station 3: Bar Model Builder
export function simulateStation3Intro(text) {
  return [
    say("Now let's build a bar model!"),
    say(text),
    ask("Can you find the right numbers for Part A and Part B?"),
    instruct("Click the correct number for Part A first!"),
  ];
}

export function simulateStation3PartA(val) {
  return [
    cheer(`Great! Part A is ${val}!`),
    instruct("Now find Part B!"),
  ];
}

export function simulateStation3Complete(p1, p2, whole) {
  return [
    celebrate(`${p1} plus ${p2} equals ${whole}!`),
    cheer("You built the bar model perfectly! The parts make the whole!"),
  ];
}

// Station 4: Frog Jump Number Line
export function simulateStation4Intro(start, jumps) {
  return [
    celebrate("Here comes our frog friend!"),
    say(`The frog starts at number ${start}.`),
    ask(`What happens when it jumps ${jumps} more times?`),
    instruct("Press the Jump button to hop the frog forward!"),
    say("Count each jump out loud!"),
  ];
}

export function simulateStation4Complete(start, jumps, answer) {
  return [
    celebrate(`${start} plus ${jumps} equals ${answer}! Great jumping!`),
    cheer("The frog landed right where we expected!"),
    say("Counting on is such a cool trick for adding!"),
  ];
}

export function simulateAllComplete() {
  return [
    celebrate("You've explored all the stations!"),
    cheer("You now know how to use story scenes, number bonds, bar models, and number lines!"),
    say("Are you ready for the challenge?"),
    celebrate("Let's play!"),
  ];
}


// ─── PLAY PHASE ──────────────────────────────────

export function playWorldIntro(worldName) {
  return [
    instruct("Read each word problem carefully."),
    say("Look for clue words like altogether, in all, or how many."),
    cheer("I believe in you! Let's go!"),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
    think("Take a moment to think about the answer."),
  ];
}

// Dynamic encouragement — pick from a pool so it doesn't repeat
const CORRECT_PHRASES = [
  "That's right! Great thinking!",
  "Excellent! You're a word problem superstar!",
  "Wonderful! You found the answer!",
  "Brilliant! Keep up the amazing work!",
  "Perfect! You're getting so good at this!",
  "Yes! You nailed it!",
  "Absolutely correct! Well done!",
  "Amazing! You're on fire!",
  "Fantastic work! I'm so proud of you!",
  "Spot on! You really understand addition!",
];

const WRONG_PHRASES = [
  "Not quite, but that's okay! Let's learn from this one.",
  "Oops! That wasn't the right answer, but don't worry. You'll get the next one!",
  "Almost! Let's try the next one. You can do it!",
  "That's alright! Mistakes help us learn.",
  "Keep trying! Every mistake makes you smarter!",
];

const STREAK_PHRASES = [
  "You're on a streak! Keep going!",
  "Wow, look at you go! What a streak!",
  "Unstoppable! What an amazing streak!",
  "You're on fire! Nothing can stop you!",
];

let correctPhraseIdx = 0;
let wrongPhraseIdx = 0;
let streakPhraseIdx = 0;

export function playCorrectNarration(streak = 0) {
  const base = CORRECT_PHRASES[correctPhraseIdx % CORRECT_PHRASES.length];
  correctPhraseIdx++;

  if (streak >= 5 && streak % 5 === 0) {
    const streakMsg = STREAK_PHRASES[streakPhraseIdx % STREAK_PHRASES.length];
    streakPhraseIdx++;
    return [celebrate(base), celebrate(streakMsg)];
  }
  return [cheer(base)];
}

export function playWrongNarration() {
  const phrase = WRONG_PHRASES[wrongPhraseIdx % WRONG_PHRASES.length];
  wrongPhraseIdx++;
  return [say(phrase)];
}

export function playWorldComplete(worldName, score, total) {
  const pct = Math.round((score / total) * 100);
  if (pct >= 90) {
    return [
      celebrate(`You got ${score} out of ${total}! That's incredible!`),
      cheer("You're a true maths champion!"),
    ];
  }
  if (pct >= 70) {
    return [
      say(`You got ${score} out of ${total}! Great effort!`),
      cheer("Keep practicing and you'll be even better!"),
    ];
  }
  return [
    say(`You got ${score} out of ${total}.`),
    cheer("Good start! Try again to improve your score!"),
  ];
}


// ─── REFLECT PHASE ───────────────────────────────

export function reflectIntroNarration() {
  return [
    say("Now let's think about what we've learned today."),
    instruct("The monkey mascot has some questions for you!"),
    ask("Can you teach the mascot what you know?"),
    cheer("Let's try this together!"),
  ];
}

export function reflectCorrectNarration() {
  return [cheer("Great explanation! You really understand this!")];
}

export function reflectWrongNarration() {
  return [say("That's not quite right, but don't worry! Let's try the next one.")];
}

export function reflectConfidenceNarration() {
  return [
    ask("How do you feel about word problems now?"),
    say("Be honest! Every answer is a great answer."),
  ];
}

export function reflectCertificateNarration(pct) {
  if (pct >= 80) {
    return [
      celebrate("You are an Addition Master!"),
      cheer("I'm so proud of you! Keep up the wonderful work!"),
    ];
  }
  if (pct >= 50) {
    return [
      cheer("Great effort! You're getting better every day!"),
      say("Come back and practice again anytime!"),
    ];
  }
  return [
    cheer("Good start! Practice makes perfect!"),
    say("Try again and watch your score grow!"),
  ];
}
