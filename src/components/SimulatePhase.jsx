import { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import { say, ask, cheer, celebrate, instruct, think } from '../utils/audio';

// ─── Large Randomization Pools ───────────────────
const NAMES = ['Mia','Raju','Wei Ming','Priya','Ahmad','Siti','Ming','Kavya','Jason','Lin','Aisha','Zara','Kai','Nisha','Arjun','Lina','Omar','Farah','Ethan','Mei'];
const FEMALE = ['Mia','Priya','Siti','Kavya','Lin','Aisha','Zara','Nisha','Lina','Farah','Mei'];
const OBJECTS = [
  {name:'apples',emoji:'🍎'},{name:'oranges',emoji:'🍊'},{name:'bananas',emoji:'🍌'},
  {name:'strawberries',emoji:'🍓'},{name:'candies',emoji:'🍬'},{name:'cookies',emoji:'🍪'},
  {name:'cupcakes',emoji:'🧁'},{name:'stars',emoji:'⭐'},{name:'hearts',emoji:'❤️'},
  {name:'flowers',emoji:'🌸'},{name:'butterflies',emoji:'🦋'},{name:'fish',emoji:'🐟'},
  {name:'birds',emoji:'🐦'},{name:'teddies',emoji:'🧸'},{name:'balloons',emoji:'🎈'},
  {name:'gems',emoji:'💎'},{name:'shells',emoji:'🐚'},{name:'leaves',emoji:'🍃'},
  {name:'pencils',emoji:'✏️'},{name:'books',emoji:'📚'},{name:'stickers',emoji:'⭐'},
  {name:'marbles',emoji:'🔮'},{name:'ribbons',emoji:'🎀'},{name:'coins',emoji:'🪙'},
];
const SETTINGS = ['playground','classroom','garden','park','library','kitchen','beach','market','birthday party','school fair'];

function pick(a){return a[Math.floor(Math.random()*a.length)];}
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pronoun(n){return FEMALE.includes(n)?'her':'him';}

function genScenario(minP=2,maxP=7){
  const n=pick(NAMES), o=pick(OBJECTS), p1=randInt(minP,maxP), p2=randInt(minP,maxP);
  return {name:n,obj:o,p1,p2,whole:p1+p2,setting:pick(SETTINGS),pronoun:pronoun(n)};
}

const STATIONS = [
  { id:0, title:'Story Scene', subtitle:'Combine & Discover', icon:'🎨' },
  { id:1, title:'Bar Model', subtitle:'Part-Whole Builder', icon:'📊' },
  { id:2, title:'Number Line', subtitle:'Frog Jump Adventure', icon:'🐸' },
];

// ═══════════════════════════════════════════════════
// STATION 1: Story Scene — Combine Groups (fully random)
// ═══════════════════════════════════════════════════
function Station1({ audioEnabled, onNext }) {
  const [scenario, setScenario] = useState(() => genScenario());
  const [phase, setPhase] = useState('intro'); // intro → combined → answered
  const [round, setRound] = useState(0);
  const narRef = useRef(null);
  const sc = scenario;

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate([
        cheer("Let's try this together!"),
        say(`${sc.name} has ${sc.p1} ${sc.obj.name} at the ${sc.setting}.`),
        say(`A friend gives ${sc.pronoun} ${sc.p2} more.`),
        ask(`How many ${sc.obj.name} does ${sc.name} have altogether?`, 2000),
        instruct("Press the Combine button to find out!"),
      ], true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round]); // eslint-disable-line

  const handleCombine = () => {
    setPhase('combined');
    narRef.current?.cancel();
    if (audioEnabled) narRef.current = narrate([
      say(`${sc.p1} plus ${sc.p2} equals... let's see!`),
      instruct("Now click the answer!"),
    ], true);
  };

  const handleAnswer = () => {
    setPhase('answered');
    sounds.correct();
    narRef.current?.cancel();
    if (audioEnabled) narRef.current = narrate([
      celebrate(`That's right! ${sc.p1} plus ${sc.p2} equals ${sc.whole}!`),
      cheer("Excellent work!"),
    ], true);
  };

  const nextRound = () => {
    narRef.current?.cancel(); stopNarration();
    if (round < 2) {
      setScenario(genScenario());
      setPhase('intro');
      setRound(r => r + 1);
    } else {
      onNext();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🎨 Story Scene: Combine Groups</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        {sc.name} has <strong style={{ color: 'var(--gold)' }}>{sc.p1} {sc.obj.name}</strong> at the {sc.setting}.
        A friend gives {sc.pronoun} <strong style={{ color: 'var(--gold)' }}>{sc.p2} more</strong>. How many altogether?
      </p>
      <div className="simulate-tip">💡 Watch the {sc.obj.name} combine!</div>

      {/* Emoji groups */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: sc.p1 }, (_, i) => (
            <span key={`a${i}`} style={{ fontSize: '2rem', animation: `bounceIn ${0.2 + i * 0.1}s ease` }}>{sc.obj.emoji}</span>
          ))}
        </div>
        <span style={{ fontSize: '2rem', color: 'var(--gold)' }}>+</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: sc.p2 }, (_, i) => (
            <span key={`b${i}`} style={{
              fontSize: '2rem', opacity: phase !== 'intro' ? 1 : 0.7,
              animation: phase !== 'intro' ? `bounceIn ${0.3 + i * 0.1}s ease` : 'none',
              transition: 'all 0.5s',
            }}>{sc.obj.emoji}</span>
          ))}
        </div>
      </div>

      {/* Number Bond */}
      <div style={{ position: 'relative', width: 200, margin: '0 auto 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', border: '3px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)',
            background: phase === 'answered' ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.05)',
            animation: phase === 'answered' ? 'bounceIn 0.4s ease' : 'none',
          }}>{phase === 'answered' ? sc.whole : '?'}</div>
        </div>
        <svg viewBox="0 0 200 40" style={{ width: '100%' }}>
          <line x1="100" y1="0" x2="50" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <line x1="100" y1="0" x2="150" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
          {[sc.p1, sc.p2].map((val, i) => (
            <div key={i} style={{
              width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--purple-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 700, background: 'rgba(124,92,191,0.15)',
            }}>{val}</div>
          ))}
        </div>
      </div>

      {phase === 'intro' && <button className="btn btn-primary" onClick={handleCombine}>🔗 Combine!</button>}
      {phase === 'combined' && (
        <button className="btn btn-primary" onClick={handleAnswer} style={{ animation: 'bounceIn 0.4s ease' }}>
          ✨ {sc.whole} altogether!
        </button>
      )}
      {phase === 'answered' && (
        <div style={{ marginTop: 16 }}>
          <div className="mascot-container">
            <div className="mascot happy" style={{ width: 60, height: 60, fontSize: '1.6rem' }}>🐵</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>{sc.p1} + {sc.p2} = {sc.whole}! 🎉</div>
          </div>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'} btn-sm`} onClick={nextRound} style={{ marginTop: 12 }}>
            {round < 2 ? 'Next Story →' : 'Next Station →'}
          </button>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Round {round + 1} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Bar Model Builder (random, alternates find-whole vs find-part)
// ═══════════════════════════════════════════════════
function Station2({ audioEnabled, onNext }) {
  const [mode] = useState(() => Math.random() > 0.5 ? 'whole' : 'part'); // varies each session
  const [scenario, setScenario] = useState(() => genScenario(3, 9));
  const [partA, setPartA] = useState(null);
  const [partB, setPartB] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(0);
  const narRef = useRef(null);
  const sc = scenario;

  // Generate shuffled number cards
  const cards = (() => {
    const correct = mode === 'whole' ? [sc.p1, sc.p2] : [sc.p1]; // which values student picks
    const distractors = new Set();
    [sc.whole + 1, sc.whole - 1, sc.p1 + sc.p2 + 2, Math.abs(sc.p1 - sc.p2), sc.p1 + 1, sc.p2 - 1]
      .filter(d => d > 0 && d !== sc.p1 && d !== sc.p2 && d !== sc.whole)
      .forEach(d => distractors.add(d));
    const pool = mode === 'whole'
      ? [sc.p1, sc.p2, ...[...distractors].slice(0, 2)]
      : [sc.p2, ...[...distractors].slice(0, 3)]; // for 'part' mode, student finds missing part (p2)
    return pool.sort(() => Math.random() - 0.5);
  })();

  useEffect(() => {
    if (audioEnabled) {
      const text = mode === 'whole'
        ? `${sc.name} has ${sc.p1} ${sc.obj.name}. A friend gives ${sc.pronoun} ${sc.p2} more. Can you build the bar model?`
        : `${sc.name} wants ${sc.whole} ${sc.obj.name} in total. ${sc.name} already has ${sc.p1}. How many more does ${sc.name} need?`;
      narRef.current = narrate([
        say("Now let's build a bar model!"),
        say(text, 600),
        ask("Can you find the right numbers?", 1800),
        instruct(mode === 'whole' ? "Click Part A first, then Part B!" : "Click the missing part!"),
      ], true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round]); // eslint-disable-line

  const handleCardClick = (val) => {
    if (revealed) return;
    if (mode === 'whole') {
      if (partA === null && val === sc.p1) {
        setPartA(val); sounds.click();
        narRef.current?.cancel();
        if (audioEnabled) narRef.current = narrate([cheer(`Part A is ${val}!`), instruct("Now find Part B!")], true);
      } else if (partA !== null && partB === null && val === sc.p2) {
        setPartB(val); sounds.correct(); setRevealed(true);
        narRef.current?.cancel();
        if (audioEnabled) narRef.current = narrate([celebrate(`${sc.p1} plus ${sc.p2} equals ${sc.whole}!`), cheer("You built it perfectly!")], true);
      } else { sounds.wrong(); }
    } else {
      if (val === sc.p2) {
        setPartB(val); sounds.correct(); setRevealed(true);
        narRef.current?.cancel();
        if (audioEnabled) narRef.current = narrate([celebrate(`The missing part is ${sc.p2}!`), cheer(`${sc.p1} plus ${sc.p2} equals ${sc.whole}!`)], true);
      } else { sounds.wrong(); }
    }
  };

  const nextRound = () => {
    narRef.current?.cancel(); stopNarration();
    if (round < 2) {
      setScenario(genScenario(3, 9));
      setPartA(null); setPartB(null); setRevealed(false);
      setRound(r => r + 1);
    } else { onNext(); }
  };

  const questionText = mode === 'whole'
    ? `${sc.name} has ${sc.p1} ${sc.obj.name} at the ${sc.setting}. A friend gives ${sc.pronoun} ${sc.p2} more.`
    : `${sc.name} wants ${sc.whole} ${sc.obj.name} in total. ${sc.name} already has ${sc.p1}. How many more?`;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📊 Build the Bar Model</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>{questionText}</p>
      <div className="simulate-tip">💡 {mode === 'whole' ? 'Find both parts to reveal the whole!' : 'Find the missing part!'}</div>

      <div style={{ margin: '20px auto', maxWidth: 400 }}>
        <div style={{ marginBottom: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>WHOLE</div>
        <div style={{
          height: 50, borderRadius: 12, border: `2px ${mode === 'whole' ? 'dashed' : 'solid'} var(--gold)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)',
          background: revealed ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.05)',
          animation: revealed ? 'bounceIn 0.4s ease' : 'none',
        }}>{mode === 'part' ? sc.whole : (revealed ? sc.whole : '?')}</div>

        <div style={{ marginTop: 8, marginBottom: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>PARTS</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: sc.p1, height: 50, borderRadius: 12,
            border: `2px solid ${(mode === 'whole' ? partA : sc.p1) ? 'var(--green)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)',
            background: (mode === 'whole' ? partA : sc.p1) ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)',
          }}>{mode === 'whole' ? (partA || 'Part A') : sc.p1}</div>
          <div style={{
            flex: sc.p2, height: 50, borderRadius: 12,
            border: `2px ${partB ? 'solid var(--green)' : 'dashed var(--coral)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)',
            color: partB ? 'inherit' : 'var(--coral)',
            background: partB ? 'rgba(76,175,80,0.15)' : 'rgba(255,107,107,0.05)',
          }}>{partB || '?'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
        {cards.map((val, i) => (
          <button key={i} className="option-btn" onClick={() => handleCardClick(val)}
            style={{
              minWidth: 60, padding: '12px 20px',
              opacity: (partA === val || partB === val) ? 0.3 : 1,
              pointerEvents: (partA === val || partB === val || revealed) ? 'none' : 'auto',
            }}>{val}</button>
        ))}
      </div>

      {revealed && (
        <>
          <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', margin: '12px 0' }}>
            {sc.p1} + {sc.p2} = {sc.whole} ✨
          </div>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'} btn-sm`} onClick={nextRound}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </>
      )}
      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Round {round + 1} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Frog Jump Number Line (fully random)
// ═══════════════════════════════════════════════════
function Station3({ audioEnabled, onComplete }) {
  const genFrog = () => ({ start: randInt(2, 10), jumps: randInt(3, 7) });
  const [frog, setFrog] = useState(genFrog);
  const [jumpCount, setJumpCount] = useState(0);
  const [round, setRound] = useState(0);
  const narRef = useRef(null);
  const sc = frog;
  const answer = sc.start + sc.jumps;
  const frogPos = sc.start + jumpCount;
  const done = jumpCount === sc.jumps;

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate([
        celebrate("Here comes our frog friend!"),
        say(`The frog starts at number ${sc.start}.`),
        ask(`What happens when it jumps ${sc.jumps} more times?`, 1800),
        instruct("Press Jump to hop the frog forward!"),
        say("Count each jump out loud!"),
      ], true);
    }
    return () => { narRef.current?.cancel(); };
  }, [round]); // eslint-disable-line

  const handleJump = () => {
    if (done) return;
    setJumpCount(j => j + 1);
    sounds.frogHop();
    if (jumpCount + 1 === sc.jumps) {
      setTimeout(() => {
        sounds.correct();
        narRef.current?.cancel();
        if (audioEnabled) narRef.current = narrate([
          celebrate(`${sc.start} plus ${sc.jumps} equals ${answer}! Great jumping!`),
          cheer("The frog landed perfectly!"),
        ], true);
      }, 300);
    }
  };

  const nextRound = () => {
    narRef.current?.cancel(); stopNarration();
    if (round < 2) {
      setFrog(genFrog());
      setJumpCount(0);
      setRound(r => r + 1);
    } else { onComplete(); }
  };

  const handleComplete = () => { narRef.current?.cancel(); stopNarration(); onComplete(); };

  const lineMax = 20;
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🐸 Frog Jump Number Line</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Start at <strong style={{ color: 'var(--gold)' }}>{sc.start}</strong>. Jump <strong style={{ color: 'var(--gold)' }}>{sc.jumps}</strong> more times. Where do you land?
      </p>
      <div className="simulate-tip">💡 Press Jump to hop the frog forward!</div>

      <div style={{ margin: '24px auto', maxWidth: 700, overflow: 'auto', padding: '40px 16px 16px', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: `${(frogPos / lineMax) * 100}%`, top: 8,
          transform: 'translateX(-50%)', fontSize: '2rem',
          transition: 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: done ? 'celebrate 0.6s ease' : 'none',
        }}>🐸</div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '3px solid rgba(255,255,255,0.3)', paddingBottom: 4 }}>
          {Array.from({ length: lineMax + 1 }, (_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 28 }}>
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
        <button className="btn btn-outline btn-sm" onClick={() => setJumpCount(0)}>↺ Reset</button>
      </div>

      {done && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
            {sc.start} + {sc.jumps} = {answer}! 🎉
          </div>
          <div className="mascot-container" style={{ marginTop: 8 }}>
            <div className="mascot happy" style={{ width: 50, height: 50, fontSize: '1.3rem' }}>🐵</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem' }}>Great jumping! 🐸</div>
          </div>
          {round < 2
            ? <button className="btn btn-outline btn-sm" onClick={nextRound} style={{ marginTop: 12 }}>Try Another →</button>
            : (
              <>
                <button className="btn btn-green btn-lg" onClick={handleComplete} style={{ marginTop: 12, animation: 'bounceIn 0.5s ease' }}>
                  🎉 Complete Simulation!
                </button>
                <button className="skip-link" onClick={handleComplete} style={{ display: 'block', margin: '8px auto 0' }}>Skip →</button>
              </>
            )
          }
        </div>
      )}
      {!done && <button className="skip-link" onClick={handleComplete} style={{ display: 'block', margin: '12px auto 0' }}>Skip →</button>}
      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Round {round + 1} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Main SimulatePhase
// ═══════════════════════════════════════════════════
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

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
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
