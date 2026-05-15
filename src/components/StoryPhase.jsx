import { useState, useEffect, useCallback } from 'react';
import { speak } from '../utils/audio';

const STORY_SLIDES = [
  {
    image: '/images/story_problem.png',
    title: "Mia's Apple Problem", text: 'One morning, Mia brought 6 red apples to school. Her friend Raju gave her 4 more green apples. Mia looked at all her apples and wondered...',
    highlight: '"How many apples do I have altogether?"',
    mascotText: "Let's help Mia! 🍎",
  },
  {
    image: '/images/story_combining.png',
    title: 'Combining Two Groups!',
    text: 'Priya showed Mia a trick! She put the 6 red apples on one side and the 4 green apples on the other. Then she pushed them all together! "When we combine two groups, we ADD!" said Priya.',
    highlight: '"6 + 4 = 10 apples altogether!"',
    mascotText: 'Adding means combining! ➕',
  },
  {
    image: '/images/story_barmodel.png',
    title: 'The Bar Model Secret',
    text: 'Then Wei Ming drew a special picture called a bar model. He drew two smaller bars — one for 6 and one for 4 — and showed how together they make the big bar of 10! "The parts make the whole!" he said.',
    highlight: '"Part + Part = Whole!"',
    mascotText: "Parts make the whole! 🧩",
  },
  {
    image: '/images/story_numberline.png',
    title: "Let's Solve Together!",
    text: 'Mia was so excited! She learned she could use number bonds, bar models, and even a number line to solve word problems. "Can we practice more?" she asked. And so, the word problem adventure began!',
    highlight: '"Word problems — here we come!"',
    mascotText: 'Your turn now! 🚀',
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 400);
    const t2 = setTimeout(() => setHlVis(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) speak(s.text, true);
  }, [textVis, s.text, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          <img src={s.image} alt={s.title} className="story-image" />
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🐵</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
