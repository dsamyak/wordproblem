// scripts/generate_audio.js
//
// Pre-generates all known narration phrases as .mp3 files into
// public/assets/audio/ and writes src/utils/audioMap.js.
//
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
};

// ── Phrases to pre-generate ────────────────────────────────────────────────
// Every string here must exactly match the text passed to playNarration()
// in src/utils/narration.js, so audioMap.js lookups succeed at runtime.
// Generated from the segments actually fired by the app — keep this in
// sync whenever narration.js changes.
const phrases = [
  // WONDER — narrated text is wonder.question then wonder.subtext for each
  // WONDER_QUESTIONS entry, exactly as wonderHookNarration() emits them.
  { text: "Priya has 6 red stickers and gets 4 more blue stickers — how can pushing both groups together help us find how many she has altogether?", style: 'question' },
  { text: "What happens to two separate groups of things when you combine them into one group?", style: 'thinking' },
  { text: "A number bond shows two parts joining to make one whole — if one part is 8 and the other part is 5, what does the whole circle show?", style: 'question' },
  { text: "Could the whole just be both parts added together?", style: 'thinking' },
  { text: "A bar model has two smaller bars sitting side by side, and one big bar underneath — what job does the big bar do?", style: 'question' },
  { text: "Could the big bar be showing the two smaller bars combined into one?", style: 'thinking' },
  { text: "A frog starts at 6 on a number line and hops forward 4 more spaces — where will it land, and why?", style: 'question' },
  { text: "Counting on from a number is another way of doing the very same thing as adding.", style: 'thinking' },
  { text: "Word problems often use clue words like altogether, in all, and how many more — what job do these words do?", style: 'question' },
  { text: "Could spotting the right clue word tell us which numbers to add?", style: 'thinking' },
  // STORY — Priya's Sticker Adventure (storyNarrations.wordProblems, one segment per slide)
  { text: "Priya brought 6 red stickers to school. Her classmate Wei Ming gave her 4 more blue stickers. Priya looked at all her stickers and wondered, how many stickers do I have altogether?", style: 'thinking' },
  { text: "Wei Ming has a trick! He put the 6 red stickers on one side and the 4 blue stickers on the other. Then he pushed them all together. When we combine two groups, we add, said Wei Ming. 6 plus 4 makes 10 stickers altogether!", style: 'instruction' },
  { text: "Then Farhan drew a special picture called a bar model. He drew two smaller bars, one for 6 and one for 4, and showed how together they make one big bar of 10. The parts make the whole, he said.", style: 'emphasis' },
  { text: "Priya grinned. Now she could use number bonds, bar models, and even a number line to solve any addition word problem. Can we practice more, she asked. And so the word problem adventure began!", style: 'celebration' },
  // SIMULATE — simulationStationNarration(stationId)
  { text: "Sticker Combine Mission!", style: 'emphasis' },
  { text: "Push the two groups together, then tap the number that shows how many there are altogether.", style: 'instruction' },
  { text: "Bar Model Builder Mission!", style: 'emphasis' },
  { text: "Read the word problem, then tap the two parts to build the bar model and find the whole.", style: 'instruction' },
  { text: "Number Line Hop Mission!", style: 'emphasis' },
  { text: "Watch the frog hop along the number line, then type in the number where it lands.", style: 'instruction' },
  // PRACTICE — Boss Battle (bossBattleNarration / bossWinNarration)
  { text: "Boss battle time! Answer every word problem correctly to win.", style: 'emphasis' },
  { text: "Remember: find the two parts first, then add them together.", style: 'instruction' },
  { text: "Boss defeated! Fantastic addition word problem solving!", style: 'celebration' },
];


// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 55);
}

// ── CLI args ──────────────────────────────────────────────────────────────
// node scripts/generate_audio.js --index 4
// node scripts/generate_audio.js --text "Hello there!" --style celebration
// node scripts/generate_audio.js --list                (show all phrases + indices)
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function generateAudio(text, style) {
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    console.log(`ℹ️   This single run does NOT rewrite audioMap.js — run without flags to regenerate the full map.`);
    return;
  }

  // No flags: full batch generation
  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    try {
      process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
      const buf = await generateAudio(text, style);
      fs.writeFileSync(filePath, buf);
      console.log(`✓ ${filename}`);
      generated++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`\n❌  Failed: ${err.message}`);
    }
  }

  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate.

export const audioMap = {
${audioMapEntries.map(([text, p]) => `  ${JSON.stringify(text)}: ${JSON.stringify(p)},`).join('\n')}
};
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. Generated ${generated} new files. audioMap.js updated (${audioMapEntries.length} entries).`);
})();
