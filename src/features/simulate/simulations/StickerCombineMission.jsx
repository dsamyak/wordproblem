// src/features/simulate/simulations/StickerCombineMission.jsx
// ➕ Sticker Combine Mission — both groups are always visible (nothing
// hidden); the student reads how many are in each group, then taps the
// number that shows how many there are once the groups are pushed
// together — tying directly back to Priya and Wei Ming's own sticker
// story.
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import ObjectGroups from '../../../components/ObjectGroups.jsx';
import { genMiniProblem, shuffle, useNumberKeySelect } from './wordProblemRound.js';

const ROUNDS = 3;

function buildOptions(correct) {
  const pool = new Set();
  [correct + 1, correct - 1, correct + 2, correct - 2].forEach((v) => { if (v > 0 && v !== correct) pool.add(v); });
  const wrongs = shuffle([...pool]).slice(0, 3);
  return shuffle([correct, ...wrongs]);
}

export default function StickerCombineMission({ onComplete }) {
  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => genMiniProblem());
  const [combined, setCombined] = useState(false);
  const [selected, setSelected] = useState(null);
  const [wrongPick, setWrongPick] = useState(false);
  const [score, setScore] = useState(0);

  const { theme, part1, part2, whole } = data;
  const options = useMemo(() => buildOptions(whole), [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePick = (opt) => {
    if (combined) return;
    setSelected(opt);
    if (opt === whole) {
      setScore((s) => s + 1);
      setCombined(true);
      setWrongPick(false);
    } else {
      setWrongPick(true);
      setTimeout(() => setWrongPick(false), 500);
    }
  };

  useNumberKeySelect(options.length, (idx) => handlePick(options[idx]), !combined);

  const nextRound = () => {
    if (round + 1 >= ROUNDS) { onComplete(score); return; }
    setRound((r) => r + 1);
    setData(genMiniProblem());
    setCombined(false);
    setSelected(null);
    setWrongPick(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <p className="sim-instruction">
        Round {round + 1} of {ROUNDS} — {theme.icon} push the two groups of {theme.word} together, then tap how many there are altogether!
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${round}-${combined}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        >
          {combined ? (
            <div className="object-groups">
              <div className="object-group">
                <div className="object-group-icons">
                  {Array.from({ length: Math.min(whole, 14) }, (_, i) => (
                    <span key={i} role="img" aria-hidden="true">{theme.emoji}</span>
                  ))}
                </div>
                <div className="object-group-count">{whole}</div>
              </div>
            </div>
          ) : (
            <ObjectGroups emojiA={theme.emoji} emojiB={theme.emoji} part1={part1} part2={part2} />
          )}
        </motion.div>
      </AnimatePresence>

      {!combined ? (
        <>
          <p className="question-text" style={{ marginTop: 6 }}>
            {part1} {theme.word} + {part2} {theme.word} = how many altogether?
          </p>
          <div className="options-grid">
            {options.map((opt, idx) => {
              let cls = 'option-btn';
              if (selected === opt && wrongPick) cls += ' wrong';
              return (
                <button key={opt} className={cls} onClick={() => handlePick(opt)}>
                  <span className="option-key-hint">{idx + 1}</span> {opt}
                </button>
              );
            })}
          </div>
          {wrongPick && (
            <p style={{ color: '#ff8a80', fontSize: '0.85rem', marginTop: 8, textAlign: 'center' }}>
              Not quite — count both groups together and try again!
            </p>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>
            Combined! 🎉
          </p>
          <Button variant="primary" onClick={nextRound}>
            {round + 1 >= ROUNDS ? 'Finish Mission 🏆' : 'Next Groups →'}
          </Button>
        </div>
      )}
    </div>
  );
}
