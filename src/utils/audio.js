// Web Speech API — Natural female voice
let cachedVoice = null;

function getFemaleVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  // Priority order: natural-sounding female voices
  const preferred = [
    'Microsoft Jenny Online', 'Microsoft Zira', 'Google UK English Female',
    'Google US English', 'Samantha', 'Karen', 'Moira', 'Fiona',
    'Microsoft Hazel Online', 'Microsoft Susan',
  ];
  for (const name of preferred) {
    const found = voices.find(v => v.name.includes(name));
    if (found) { cachedVoice = found; return found; }
  }
  // Fallback: any female-sounding English voice
  const female = voices.find(v =>
    v.lang.startsWith('en') &&
    (/female|woman|girl|zira|hazel|jenny|samantha|karen|fiona|moira|susan/i.test(v.name))
  );
  if (female) { cachedVoice = female; return female; }
  // Final fallback: first English voice
  const english = voices.find(v => v.lang.startsWith('en'));
  if (english) { cachedVoice = english; return english; }
  return null;
}

// Preload voices (Chrome loads them async)
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; getFemaleVoice(); };
}

export function speak(text, enabled = true) {
  if (!enabled || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;      // Slightly slower for clarity
  utterance.pitch = 1.15;    // Warm, friendly pitch
  utterance.volume = 0.9;
  const voice = getFemaleVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'en-GB'; // British English sounds natural
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Simple tone generation using AudioContext
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export function playTone(frequency, duration = 200) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) { /* silent fallback */ }
}

export const sounds = {
  correct: () => { playTone(523, 150); setTimeout(() => playTone(659, 150), 150); setTimeout(() => playTone(784, 200), 300); },
  wrong: () => { playTone(220, 300); },
  badge: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 200), i * 150)); },
  click: () => playTone(440, 80),
  streak: () => { playTone(880, 100); setTimeout(() => playTone(1100, 150), 100); },
  frogHop: () => playTone(660, 100),
};
