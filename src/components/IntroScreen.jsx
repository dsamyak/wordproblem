const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'What is a word problem?' },
  { icon: '📖', label: 'Story', desc: 'See word problems in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Solve with tools' },
  { icon: '🎮', label: 'Play', desc: 'Word problem challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {
  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨ Singapore MOE Curriculum · Grade 1
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--coral)' }}>Word Problems</span>{' '}Using{' '}
        <span style={{ color: 'var(--gold)' }}>Addition</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 2.5 · Learn to solve addition word problems
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🐵</div>
        <div className="speech-bubble">
          I'll teach you to solve word problems! 🔍
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to read <strong style={{ color: 'var(--gold)' }}>word problems</strong>, find addition keywords like <em>"altogether"</em>, <em>"in all"</em>, and <em>"how many more"</em>, then solve them using number bonds, bar models, and number lines!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={onStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">📝</div>
          <div className="feature-card-label">100 Word Problems</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🔑</div>
          <div className="feature-card-label">Addition Keywords</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">📊</div>
          <div className="feature-card-label">Bar Models & Number Bonds</div>
        </div>
      </div>
    </div>
  );
}
