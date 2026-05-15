import { useState, useEffect, useCallback } from 'react';
import { speak } from '../utils/audio';

const WONDER_QUESTIONS = [
  {
    question: "If Mia has 6 apples and gets 4 more, how can we find how many she has altogether?",
    subtext: "What if there's a magic way to combine two groups of things?",
    emoji: "🍎",
    bgEmojis: ["🍎", "➕", "🔢", "✨"],
  },
  {
    question: "What does the word 'altogether' mean in a maths problem?",
    subtext: "Some words are secret signals that tell you to add!",
    emoji: "🔍",
    bgEmojis: ["🔍", "💡", "📖", "🧩"],
  },
  {
    question: "Can you draw a picture to show 5 fish joining 3 more fish?",
    subtext: "Pictures can help us solve word problems — let's find out how!",
    emoji: "🐟",
    bgEmojis: ["🐟", "🎨", "🖍️", "🌊"],
  },
  {
    question: "If a pencil costs 15 cents and an eraser costs 10 cents, how do we find the total?",
    subtext: "Addition helps us add up costs — just like at the provision shop!",
    emoji: "💰",
    bgEmojis: ["💰", "🪙", "🛒", "🎯"],
  },
  {
    question: "What if a frog starts at number 6 and jumps 5 times on a number line?",
    subtext: "Counting on is one of the coolest tricks for solving addition!",
    emoji: "🐸",
    bgEmojis: ["🐸", "🔢", "➡️", "🎉"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      speak(wonder.question, true);
    }
  }, [stage, wonder.question, audioEnabled]);

  const handleDiscover = useCallback(() => {
    if (audioEnabled) speak("Let's find out together!", true);
    setTimeout(() => onComplete(), 600);
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🐵</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
