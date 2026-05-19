import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Map styles to elevenlabs settings
const getElevenLabsSettings = (style) => {
    switch (style) {
        case 'celebration': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
        case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
        case 'question': return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
        case 'emphasis': return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
        case 'thinking': return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
        default: return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
    }
};

const narrationPath = path.join(__dirname, '../src/utils/narration.js');
const narrationContent = fs.readFileSync(narrationPath, 'utf8');

const phrases = [];

const addPhrase = (fn, text) => {
    if (text.includes('${')) return; // skip dynamic strings
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

async function generate() {
    const mapData = {};

    for (let i = 0; i < phrases.length; i++) {
        const { text, style } = phrases[i];
        const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
        const filename = `audio_${safeName}_${i}.mp3`;
        const filepath = path.join(audioDir, filename);

        mapData[text] = `/assets/audio/${filename}`;

        if (fs.existsSync(filepath)) {
            console.log(`Skipping (already exists): ${filename}`);
            continue;
        }

        console.log(`Generating: ${filename}`);

        const settings = getElevenLabsSettings(style);

        try {
            const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: settings
                })
            });

            if (!res.ok) {
                console.error(`Failed to generate ${filename}: ${res.statusText}`);
                const textErr = await res.text();
                console.error(textErr);
                continue;
            }

            const buffer = await res.arrayBuffer();
            fs.writeFileSync(filepath, Buffer.from(buffer));
            console.log(`Saved: ${filename}`);
        } catch (err) {
            console.error(`Error with ${filename}:`, err.message);
        }

        // small delay to prevent rate limit
        await new Promise(r => setTimeout(r, 500));
    }

    const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
    fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(mapData, null, 2)};\n`);
    console.log('Done generating! Map saved to src/utils/audioMap.js');
}

generate();
