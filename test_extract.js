import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const narrationContent = fs.readFileSync(path.join(__dirname, 'src/utils/narration.js'), 'utf8');

const phrases = [];

const addPhrase = (fn, text) => {
    if (text.includes('${')) return; // skip dynamic
    let style = 'statement';
    if (fn === 'ask') style = 'question';
    else if (fn === 'cheer') style = 'encouragement';
    else if (fn === 'emphasize') style = 'emphasis';
    else if (fn === 'think') style = 'thinking';
    else if (fn === 'celebrate') style = 'celebration';
    else if (fn === 'instruct') style = 'instruction';
    
    if (!phrases.find(p => p.text === text)) {
        phrases.push({ text, style });
    }
};

const regexDouble = /(say|ask|cheer|emphasize|think|celebrate|instruct)\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;
while ((match = regexDouble.exec(narrationContent)) !== null) addPhrase(match[1], match[2]);

const regexSingle = /(say|ask|cheer|emphasize|think|celebrate|instruct)\(\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g;
while ((match = regexSingle.exec(narrationContent)) !== null) addPhrase(match[1], match[2]);

const regexTick = /(say|ask|cheer|emphasize|think|celebrate|instruct)\(\s*`([^`\\]*(?:\\.[^`\\]*)*)`/g;
while ((match = regexTick.exec(narrationContent)) !== null) addPhrase(match[1], match[2]);

// also we have CORRECT_PHRASES and WRONG_PHRASES in narration.js. They are not wrapped in say/cheer inside the array, but they are wrapped later.
// We should manually add those because they are static but accessed via variables!
const manualPhrases = [
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
  "Not quite, but that's okay! Let's learn from this one.",
  "Oops! That wasn't the right answer, but don't worry. You'll get the next one!",
  "Almost! Let's try the next one. You can do it!",
  "That's alright! Mistakes help us learn.",
  "Keep trying! Every mistake makes you smarter!",
  "You're on a streak! Keep going!",
  "Wow, look at you go! What a streak!",
  "Unstoppable! What an amazing streak!",
  "You're on fire! Nothing can stop you!",
];

for (const text of manualPhrases) {
    if (!phrases.find(p => p.text === text)) {
        phrases.push({ text, style: 'encouragement' }); 
    }
}

console.log(`Found ${phrases.length} phrases.`);
console.log(phrases);
