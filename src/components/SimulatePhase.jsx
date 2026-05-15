import { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  simulateStation1Intro, simulateStation1Combine, simulateStation1Answer,
  simulateStation2Intro, simulateStation2Complete,
  simulateStation3Intro, simulateStation3PartA, simulateStation3Complete,
  simulateStation4Intro, simulateStation4Complete, simulateAllComplete,
} from '../utils/narration';

const STATIONS = [
  { id: 0, title: 'Story Scene', subtitle: 'Combine Groups', icon: '🎨' },
  { id: 1, title: 'Drag & Combine', subtitle: 'Number Bond', icon: '🔢' },
  { id: 2, title: 'Bar Model', subtitle: 'Part-Whole', icon: '📊' },
  { id: 3, title: 'Number Line', subtitle: 'Frog Jump', icon: '🐸' },
];

// Station 1: Animated Story Scene — combine two groups
function Station1({ audioEnabled, onNext }) {
  const scenarios = [
    { name: 'Mia', obj: '🍎', objName: 'apples', p1: 4, p2: 3, setting: 'classroom' },
    { name: 'Raju', obj: '⭐', objName: 'stickers', p1: 5, p2: 4, setting: 'playground' },
    { name: 'Siti', obj: '🐟', objName: 'fish', p1: 6, p2: 3, setting: 'hawker centre' },
  ];
  const [scIdx, setScIdx] = useState(0);
  const [combined, setCombined] = useState(false);
  const [answered, setAnswered] = useState(false);
  const narrationRef = useRef(null);
  const sc = scenarios[scIdx];
  const whole = sc.p1 + sc.p2;

  useEffect(() => {
    if (audioEnabled) {
      narrationRef.current = narrate(
        simulateStation1Intro(sc.name, sc.objName, sc.p1, sc.p2), true
      );
    }
    return () => { narrationRef.current?.cancel(); };
  }, [scIdx, audioEnabled, sc.name, sc.objName, sc.p1, sc.p2]);

  const handleCombine = () => {
    setCombined(true);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(simulateStation1Combine(sc.p1, sc.p2), true);
    }
  };

  const handleAnswer = () => {
    setAnswered(true);
    sounds.correct();
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(simulateStation1Answer(sc.p1, sc.p2, whole), true);
    }
  };

  const nextScenario = () => {
    narrationRef.current?.cancel();
    stopNarration();
    if (scIdx < scenarios.length - 1) {
      setScIdx(i => i + 1);
      setCombined(false);
      setAnswered(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🎨 Story Scene: Combine Groups</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        {sc.name} has <strong style={{ color: 'var(--gold)' }}>{sc.p1} {sc.objName}</strong>.
        A friend gives {sc.name === 'Siti' || sc.name === 'Mia' ? 'her' : 'him'} <strong style={{ color: 'var(--gold)' }}>{sc.p2} more</strong>. How many altogether?
      </p>
      <div className="simulate-tip">💡 Watch the objects combine, then click the answer!</div>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: sc.p1 }, (_, i) => (
            <span key={`a${i}`} style={{ fontSize: '2rem', animation: `bounceIn ${0.2 + i * 0.1}s ease` }}>{sc.obj}</span>
          ))}
        </div>
        <span style={{ fontSize: '2rem', color: 'var(--gold)' }}>+</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: sc.p2 }, (_, i) => (
            <span key={`b${i}`} style={{
              fontSize: '2rem',
              animation: combined ? `bounceIn ${0.3 + i * 0.1}s ease` : `bounceIn ${0.2 + i * 0.1}s ease`,
              opacity: combined ? 1 : 0.8,
              transition: 'all 0.5s ease',
            }}>{sc.obj}</span>
          ))}
        </div>
      </div>

      {/* Number Bond */}
      <div style={{ position: 'relative', width: 200, margin: '0 auto 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            border: '3px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)',
            background: answered ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.05)',
            animation: answered ? 'bounceIn 0.4s ease' : 'none',
          }}>
            {answered ? whole : '?'}
          </div>
        </div>
        <svg viewBox="0 0 200 40" style={{ width: '100%' }}>
          <line x1="100" y1="0" x2="50" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <line x1="100" y1="0" x2="150" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
          {[sc.p1, sc.p2].map((val, i) => (
            <div key={i} style={{
              width: 50, height: 50, borderRadius: '50%',
              border: '2px solid var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 700, background: 'rgba(124,92,191,0.15)',
            }}>{val}</div>
          ))}
        </div>
      </div>

      {!combined && <button className="btn btn-primary" onClick={handleCombine}>🔗 Combine!</button>}
      {combined && !answered && (
        <button className="btn btn-primary" onClick={handleAnswer} style={{ animation: 'bounceIn 0.4s ease' }}>
          ✨ {whole} altogether!
        </button>
      )}
      {answered && (
        <div style={{ marginTop: 16 }}>
          <div className="mascot-container">
            <div className="mascot happy" style={{ width: 60, height: 60, fontSize: '1.6rem' }}>🐵</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>
              {sc.p1} + {sc.p2} = {whole}! 🎉
            </div>
          </div>
          {scIdx < scenarios.length - 1
            ? <button className="btn btn-outline btn-sm" onClick={nextScenario} style={{ marginTop: 12 }}>Next Story →</button>
            : <button className="btn btn-primary" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onNext(); }} style={{ marginTop: 12 }}>Next Station →</button>
          }
        </div>
      )}
    </div>
  );
}

// Station 2: Drag & Combine with Number Bond
function Station2({ audioEnabled, onNext }) {
  const scenarios = [
    { obj: '🍎', name: 'apples', items1: 5, items2: 3 },
    { obj: '⭐', name: 'stars', items1: 4, items2: 6 },
    { obj: '🐟', name: 'fish', items1: 7, items2: 2 },
  ];
  const [scIdx, setScIdx] = useState(0);
  const [merged, setMerged] = useState(0);
  const narrationRef = useRef(null);
  const sc = scenarios[scIdx];
  const total = sc.items1 + sc.items2;

  useEffect(() => {
    if (audioEnabled) {
      narrationRef.current = narrate(simulateStation2Intro(sc.name), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [scIdx, audioEnabled, sc.name]);

  const addToMerge = () => {
    if (merged < total) {
      const next = merged + 1;
      setMerged(next);
      sounds.click();
      if (next === total) {
        sounds.correct();
        narrationRef.current?.cancel();
        if (audioEnabled) {
          narrationRef.current = narrate(simulateStation2Complete(sc.items1, sc.items2, total), true);
        }
      }
    }
  };

  const nextSc = () => {
    narrationRef.current?.cancel();
    stopNarration();
    if (scIdx < scenarios.length - 1) {
      setScIdx(i => i + 1);
      setMerged(0);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🔢 Drag & Combine</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Click the {sc.name} to move them into the combined group!
      </p>
      <div className="simulate-tip">💡 Count as you add each one!</div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 16, padding: 16, minWidth: 100, minHeight: 80 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8 }}>Group A: {sc.items1}</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: Math.max(0, sc.items1 - Math.max(0, merged - sc.items2)) }, (_, i) => (
              <span key={i} style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={addToMerge}>{sc.obj}</span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>+</span>
        <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 16, padding: 16, minWidth: 100, minHeight: 80 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8 }}>Group B: {sc.items2}</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: Math.max(0, sc.items2 - Math.max(0, merged - sc.items1)) }, (_, i) => (
              <span key={i} style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={addToMerge}>{sc.obj}</span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>=</span>
        <div style={{ border: '2px solid var(--gold)', borderRadius: 16, padding: 16, minWidth: 120, minHeight: 80, background: 'rgba(255,193,7,0.05)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8 }}>Combined: {merged}</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: merged }, (_, i) => (
              <span key={i} style={{ fontSize: '1.5rem', animation: 'bounceIn 0.3s ease' }}>{sc.obj}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: merged === total ? 'var(--green-light)' : 'var(--text-secondary)', margin: '12px 0' }}>
        {sc.items1} + {sc.items2} = {merged === total ? total : '?'}
      </div>

      {merged === total ? (
        scIdx < scenarios.length - 1
          ? <button className="btn btn-outline btn-sm" onClick={nextSc}>Try Another →</button>
          : <button className="btn btn-primary" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onNext(); }}>Next Station →</button>
      ) : null}
    </div>
  );
}

// Station 3: Bar Model Builder
function Station3({ audioEnabled, onNext }) {
  const scenarios = [
    { text: 'Lin has 8 pencils. She gets 5 more.', p1: 8, p2: 5, whole: 13, cards: [8, 5, 13, 3] },
    { text: 'Ahmad has 7 marbles. Raju gives him 6 more.', p1: 7, p2: 6, whole: 13, cards: [7, 6, 13, 1] },
    { text: 'Priya has 9 ribbons. She gets 4 more.', p1: 9, p2: 4, whole: 13, cards: [9, 4, 13, 5] },
  ];
  const [scIdx, setScIdx] = useState(0);
  const [partA, setPartA] = useState(null);
  const [partB, setPartB] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const narrationRef = useRef(null);
  const sc = scenarios[scIdx];

  useEffect(() => {
    if (audioEnabled) {
      narrationRef.current = narrate(simulateStation3Intro(sc.text), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [scIdx, audioEnabled, sc.text]);

  const handleCardClick = (val) => {
    if (revealed) return;
    if (partA === null && val === sc.p1) {
      setPartA(val);
      sounds.click();
      narrationRef.current?.cancel();
      if (audioEnabled) {
        narrationRef.current = narrate(simulateStation3PartA(val), true);
      }
    } else if (partA !== null && partB === null && val === sc.p2) {
      setPartB(val);
      sounds.correct();
      setRevealed(true);
      narrationRef.current?.cancel();
      if (audioEnabled) {
        narrationRef.current = narrate(simulateStation3Complete(sc.p1, sc.p2, sc.whole), true);
      }
    } else {
      sounds.wrong();
    }
  };

  const nextSc = () => {
    narrationRef.current?.cancel();
    stopNarration();
    if (scIdx < scenarios.length - 1) {
      setScIdx(i => i + 1);
      setPartA(null); setPartB(null); setRevealed(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📊 Build the Bar Model</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>{sc.text}</p>
      <div className="simulate-tip">💡 Drag the right numbers into Part A and Part B!</div>

      <div style={{ margin: '20px auto', maxWidth: 400 }}>
        <div style={{ marginBottom: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>WHOLE</div>
        <div style={{
          height: 50, borderRadius: 12, border: '2px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)',
          background: revealed ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.05)',
          animation: revealed ? 'bounceIn 0.4s ease' : 'none',
        }}>
          {revealed ? sc.whole : '?'}
        </div>
        <div style={{ marginTop: 8, marginBottom: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>PARTS</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: sc.p1, height: 50, borderRadius: 12,
            border: `2px solid ${partA ? 'var(--green)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)',
            background: partA ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)',
          }}>
            {partA || 'Part A'}
          </div>
          <div style={{
            flex: sc.p2, height: 50, borderRadius: 12,
            border: `2px solid ${partB ? 'var(--green)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)',
            background: partB ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)',
          }}>
            {partB || 'Part B'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
        {sc.cards.map((val, i) => (
          <button key={i} className="option-btn" onClick={() => handleCardClick(val)}
            style={{
              minWidth: 60, padding: '12px 20px',
              opacity: (partA === val || partB === val) ? 0.3 : 1,
              pointerEvents: (partA === val || partB === val || revealed) ? 'none' : 'auto',
            }}>
            {val}
          </button>
        ))}
      </div>

      {revealed && (
        <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', margin: '12px 0' }}>
          {sc.p1} + {sc.p2} = {sc.whole} ✨
        </div>
      )}

      {revealed && (
        scIdx < scenarios.length - 1
          ? <button className="btn btn-outline btn-sm" onClick={nextSc}>Try Another →</button>
          : <button className="btn btn-primary" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onNext(); }}>Next Station →</button>
      )}
    </div>
  );
}

// Station 4: Frog Jump Number Line
function Station4({ audioEnabled, onComplete }) {
  const scenarios = [
    { start: 6, jumps: 5, answer: 11 },
    { start: 8, jumps: 7, answer: 15 },
    { start: 13, jumps: 6, answer: 19 },
  ];
  const [scIdx, setScIdx] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const narrationRef = useRef(null);
  const sc = scenarios[scIdx];
  const frogPos = sc.start + jumpCount;
  const done = jumpCount === sc.jumps;

  useEffect(() => {
    if (audioEnabled) {
      narrationRef.current = narrate(simulateStation4Intro(sc.start, sc.jumps), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [scIdx, audioEnabled, sc.start, sc.jumps]);

  const handleJump = () => {
    if (done) return;
    setJumpCount(j => j + 1);
    sounds.frogHop();
    if (jumpCount + 1 === sc.jumps) {
      setTimeout(() => {
        sounds.correct();
        narrationRef.current?.cancel();
        if (audioEnabled) {
          narrationRef.current = narrate(simulateStation4Complete(sc.start, sc.jumps, sc.answer), true);
        }
      }, 300);
    }
  };

  const handleReset = () => { setJumpCount(0); };

  const nextSc = () => {
    narrationRef.current?.cancel();
    stopNarration();
    if (scIdx < scenarios.length - 1) {
      setScIdx(i => i + 1);
      setJumpCount(0);
    }
  };

  const handleComplete = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onComplete();
  };

  const lineMax = 20;
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🐸 Frog Jump Number Line</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Start at <strong style={{ color: 'var(--gold)' }}>{sc.start}</strong>. Jump <strong style={{ color: 'var(--gold)' }}>{sc.jumps}</strong> more times. Where do you land?
      </p>
      <div className="simulate-tip">💡 Press the Jump button to hop the frog forward!</div>

      <div style={{ margin: '24px auto', maxWidth: 700, overflow: 'auto', padding: '40px 16px 16px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: `${(frogPos / lineMax) * 100}%`,
          top: 8,
          transform: 'translateX(-50%)',
          fontSize: '2rem',
          transition: 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: done ? 'celebrate 0.6s ease' : 'none',
        }}>🐸</div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '3px solid rgba(255,255,255,0.3)', paddingBottom: 4 }}>
          {Array.from({ length: lineMax + 1 }, (_, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 28,
            }}>
              <div style={{
                width: 2, height: i % 5 === 0 ? 16 : 8,
                background: i >= sc.start && i <= frogPos ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              }} />
              <span style={{
                fontSize: '0.65rem', marginTop: 4,
                color: i === frogPos ? 'var(--gold)' : i === sc.start ? 'var(--green-light)' : 'var(--text-muted)',
                fontWeight: (i === frogPos || i === sc.start) ? 700 : 400,
              }}>{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={handleJump} disabled={done}>
          🐸 Jump! ({jumpCount}/{sc.jumps})
        </button>
        <button className="btn btn-outline btn-sm" onClick={handleReset}>↺ Reset</button>
      </div>

      {done && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
            {sc.start} + {sc.jumps} = {sc.answer}! 🎉
          </div>
          <div className="mascot-container" style={{ marginTop: 8 }}>
            <div className="mascot happy" style={{ width: 50, height: 50, fontSize: '1.3rem' }}>🐵</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem' }}>Great jumping! 🐸</div>
          </div>
          {scIdx < scenarios.length - 1
            ? <button className="btn btn-outline btn-sm" onClick={nextSc} style={{ marginTop: 12 }}>Try Another →</button>
            : (
              <>
                <button className="btn btn-green btn-lg" onClick={handleComplete} style={{ marginTop: 12, animation: 'bounceIn 0.5s ease' }}>
                  🎉 Complete Simulation!
                </button>
                <button className="skip-link" onClick={handleComplete} style={{ marginTop: 8, display: 'block', margin: '8px auto 0' }}>
                  Skip →
                </button>
              </>
            )
          }
        </div>
      )}
      {!done && (
        <button className="skip-link" onClick={handleComplete} style={{ marginTop: 12, display: 'block', margin: '12px auto 0' }}>
          Skip →
        </button>
      )}
    </div>
  );
}

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 3) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore and discover — no wrong answers!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 3 && <Station4 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
