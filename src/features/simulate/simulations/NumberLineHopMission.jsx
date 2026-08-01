// src/features/simulate/simulations/NumberLineHopMission.jsx
// 🐸 Number Line Hop Mission — the frog's start and hop size are always
// shown; the student watches it count on and types the landing number,
// tied to the Primary 1 "count on" number-line method.
import React, { useState } from 'react';
import Button from '../../../components/Button.jsx';
import NumberLineVisual from '../../../components/NumberLineVisual.jsx';
import NumberPad from '../../../components/NumberPad.jsx';
import { genMiniProblem } from './wordProblemRound.js';

const ROUNDS = 3;

export default function NumberLineHopMission({ onComplete }) {
  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => genMiniProblem());
  const [value, setValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const { theme, part1, part2, whole } = data;
  const entered = value === '' ? null : parseInt(value, 10);

  const submit = () => {
    if (!value) return;
    const correct = entered === whole;
    setConfirmed(true);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const tryAgain = () => {
    setValue('');
    setConfirmed(false);
    setIsCorrect(false);
  };

  const nextRound = () => {
    if (round + 1 >= ROUNDS) { onComplete(score); return; }
    setRound((r) => r + 1);
    setData(genMiniProblem());
    setValue('');
    setConfirmed(false);
    setIsCorrect(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <p className="sim-instruction">
        Round {round + 1} of {ROUNDS} — {theme.icon} start at {part1}, hop {part2} more — where does the frog land?
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
        <NumberLineVisual part1={part1} part2={part2} whole={confirmed ? whole : part1} />
      </div>

      <p className="question-text" style={{ marginTop: 6 }}>
        Start at {part1}. Jump {part2} more. Where does the frog land?
      </p>

      <NumberPad value={value} onChange={confirmed ? () => {} : setValue} onSubmit={submit} />

      {confirmed && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          {isCorrect ? (
            <>
              <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>
                Great jumping! 🐸
              </p>
              <Button variant="primary" onClick={nextRound}>
                {round + 1 >= ROUNDS ? 'Finish Mission 🏆' : 'Next Hop →'}
              </Button>
            </>
          ) : (
            <>
              <p style={{ color: '#ff8a80', fontSize: '0.85rem', marginBottom: 8 }}>
                Not quite — the frog lands on {whole}. Try again!
              </p>
              <Button variant="outline" onClick={tryAgain}>Try Again</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
