// ──────────────────────────────────────────────────
// Enhanced Audio Narration Engine
// Natural, teacher-like speech for young learners
// ──────────────────────────────────────────────────

let cachedVoice = null;
let currentQueue = null;   // active narration queue id
let isSpeaking = false;

// ─── Voice Selection ─────────────────────────────
function getFemaleVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];

  // Priority: natural-sounding female voices
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


// ─── Speech Types (vary pitch/rate for natural delivery) ──
const SPEECH_STYLES = {
  // Normal teaching voice
  statement: { rate: 0.88, pitch: 1.12, volume: 0.9 },

  // Questions — slightly higher pitch, slower for emphasis
  question: { rate: 0.82, pitch: 1.22, volume: 0.92 },

  // Encouragement — warm, upbeat
  encouragement: { rate: 0.92, pitch: 1.28, volume: 0.95 },

  // Emphasis on key numbers/words — slower, clearer
  emphasis: { rate: 0.78, pitch: 1.18, volume: 0.95 },

  // Thinking prompt — gentle, inviting
  thinking: { rate: 0.80, pitch: 1.08, volume: 0.85 },

  // Celebration — excited, faster
  celebration: { rate: 0.95, pitch: 1.35, volume: 1.0 },

  // Gentle instruction
  instruction: { rate: 0.85, pitch: 1.10, volume: 0.88 },
};


// ─── Core: speak a single text ──────────────────
export function speak(text, enabled = true, style = 'statement') {
  return new Promise((resolve) => {
    if (!enabled || !window.speechSynthesis || !text) {
      resolve();
      return;
    }
    const styleParams = SPEECH_STYLES[style] || SPEECH_STYLES.statement;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = styleParams.rate;
    utterance.pitch = styleParams.pitch;
    utterance.volume = styleParams.volume;

    const voice = getFemaleVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-GB';
    }

    utterance.onend = () => { isSpeaking = false; resolve(); };
    utterance.onerror = () => { isSpeaking = false; resolve(); };

    window.speechSynthesis.cancel();
    isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  });
}


// ─── Narration Segment Types ────────────────────
// Each segment is an object: { text, style, pause }
//   text:  string to speak
//   style: one of SPEECH_STYLES keys
//   pause: ms to wait AFTER this segment (thinking pause, etc.)

/**
 * Build a narration segment.
 * @param {string} text - What to say
 * @param {string} style - Speech style key
 * @param {number} pause - Pause in ms after speaking (default 400)
 */
export function seg(text, style = 'statement', pause = 400) {
  return { text, style, pause };
}

// Shorthand helpers for common segment types
export const say = (text, pause = 400) => seg(text, 'statement', pause);
export const ask = (text, pause = 1800) => seg(text, 'question', pause);  // longer pause for thinking
export const cheer = (text, pause = 600) => seg(text, 'encouragement', pause);
export const emphasize = (text, pause = 500) => seg(text, 'emphasis', pause);
export const think = (text, pause = 2200) => seg(text, 'thinking', pause); // extra long thinking pause
export const celebrate = (text, pause = 800) => seg(text, 'celebration', pause);
export const instruct = (text, pause = 500) => seg(text, 'instruction', pause);
export const pause = (ms = 1000) => seg('', 'statement', ms); // silent pause


// ─── Narrate: play a sequence of segments ───────
/**
 * Speak a sequence of narration segments with natural pauses.
 * Returns a cancel function. Calling it stops the narration mid-way.
 *
 * @param {Array} segments - Array of segment objects from seg()/say()/ask()/etc.
 * @param {boolean} enabled - Whether audio is enabled
 * @returns {{ cancel: Function, promise: Promise }}
 */
export function narrate(segments, enabled = true) {
  const queueId = Symbol('narration');
  currentQueue = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (currentQueue === queueId) {
      window.speechSynthesis?.cancel();
      isSpeaking = false;
      currentQueue = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments || segments.length === 0) return;

    for (const segment of segments) {
      // If this queue was cancelled or replaced by a new narration, stop
      if (cancelled || currentQueue !== queueId) return;

      // Speak the text (skip if empty — used for silent pauses)
      if (segment.text && segment.text.trim()) {
        await speak(segment.text, true, segment.style);
      }

      // Wait the pause duration
      if (segment.pause > 0 && !cancelled && currentQueue === queueId) {
        await new Promise(r => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}


// ─── Stop all narration ─────────────────────────
export function stopNarration() {
  currentQueue = null;
  window.speechSynthesis?.cancel();
  isSpeaking = false;
}


// ─── Simple tone generation using AudioContext ──
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
