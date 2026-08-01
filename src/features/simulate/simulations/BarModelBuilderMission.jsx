// src/features/simulate/simulations/BarModelBuilderMission.jsx
// 📊 Bar Model Builder Mission — the two part-bars are always visible and
// labelled; the student studies the word problem and the bar model, then
// taps the number that completes the whole bar, just like Farhan's bar
// model trick from the story.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import BarModel from '../../../components/BarModel.jsx';
import { genMiniProblem, shuffle, useNumberKeySelect } from './wordProblemRound.js';

const ROUNDS = 3;

function buildOptions(correct) {
  const pool = new Set();
  [correct + 1, correct - 1, correct + 2, correct - 2].forEach((v) => { if (v > 0 && v !== correct) pool.add(v); });
  const wrongs = shuffle([...pool]).slice(0, 3);
  return shuffle([correct, ...wrongs]);
}

export default function BarModelBuilderMission({ onComplete }) {
  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => genMiniProblem());
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const { theme, part1, part2, whole } = data;
  const options = React.useMemo(() => buildOptions(whole), [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePick = (opt) => {
    if (confirmed) return;
    setSelected(opt);
    setConfirmed(true);
    if (opt === whole) setScore((s) => s + 1);
  };

  useNumberKeySelect(options.length, (idx) => handlePick(options[idx]), !confirmed);

  const nextRound = () => {
    if (round + 1 >= ROUNDS) { onComplete(score); return; }
    setRound((r) => r + 1);
    setData(genMiniProblem());
    setSelected(null);
    setConfirmed(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <p className="sim-instruction">
        Round {round + 1} of {ROUNDS} — {theme.icon} build the bar model: what is the whole?
      </p>

      <p className="question-text" style={{ fontSize: '1.05rem' }}>
        There are {part1} {theme.word} in one group and {part2} {theme.word} in another group. What is the whole?
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}
        >
          <BarModel part1={part1} part2={part2} whole={confirmed ? whole : 0} missing={confirmed ? undefined : 'whole'} />
        </motion.div>
      </AnimatePresence>

      {!confirmed ? (
        <div className="options-grid">
          {options.map((opt, idx) => (
            <button key={opt} className="option-btn" onClick={() => handlePick(opt)}>
              <span className="option-key-hint">{idx + 1}</span> {opt}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <p style={{
            color: selected === whole ? 'var(--green)' : '#ff8a80',
            fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8,
          }}>
            {selected === whole ? 'Bar model complete! 🎉' : `Not quite — the whole is ${whole}. Part + Part = Whole!`}
          </p>
          <Button variant="primary" onClick={nextRound}>
            {round + 1 >= ROUNDS ? 'Finish Mission 🏆' : 'Next Model →'}
          </Button>
        </div>
      )}
    </div>
  );
}
