import { useState, useCallback } from 'react';

// Visual aids for word problems
function Visual({ question }) {
  if (!question.visualType) return null;

  // Number Bond
  if (question.visualType === 'number_bond') {
    return (
      <div style={{ position: 'relative', width: 200, margin: '12px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 700, background: 'rgba(255,193,7,0.1)',
          }}>?</div>
        </div>
        <svg viewBox="0 0 200 35" style={{ width: '100%' }}>
          <line x1="100" y1="0" x2="50" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1="100" y1="0" x2="150" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 25px' }}>
          {[question.part1, question.part2].map((val, i) => (
            <div key={i} style={{
              width: 42, height: 42, borderRadius: '50%',
              border: '2px solid var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, background: 'rgba(124,92,191,0.15)',
            }}>{val}</div>
          ))}
        </div>
      </div>
    );
  }

  // Bar Model
  if (question.visualType === 'bar_model') {
    return (
      <div style={{ margin: '12px auto', maxWidth: 300 }}>
        <div style={{ height: 36, borderRadius: 8, border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, background: 'rgba(255,193,7,0.08)', marginBottom: 6 }}>?</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ flex: question.part1, height: 36, borderRadius: 8, border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, background: 'rgba(76,175,80,0.1)' }}>{question.part1}</div>
          <div style={{ flex: question.part2, height: 36, borderRadius: 8, border: '2px solid var(--blue-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, background: 'rgba(63,81,181,0.1)' }}>{question.part2}</div>
        </div>
      </div>
    );
  }

  // Story Scene (emoji groups)
  if (question.visualType === 'story_scene') {
    return (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', margin: '12px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Array.from({ length: question.part1 }, (_, i) => (
            <span key={i} style={{ fontSize: '1.5rem', animation: `bounceIn ${0.2 + i * 0.05}s ease` }}>{question.emoji}</span>
          ))}
        </div>
        <span style={{ fontSize: '1.3rem', color: 'var(--gold)' }}>+</span>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Array.from({ length: question.part2 }, (_, i) => (
            <span key={i} style={{ fontSize: '1.5rem', animation: `bounceIn ${0.2 + i * 0.05}s ease` }}>{question.emoji}</span>
          ))}
        </div>
      </div>
    );
  }

  // Number Line
  if (question.visualType === 'number_line') {
    const max = Math.max(question.whole + 3, 20);
    return (
      <div style={{ margin: '12px auto', maxWidth: 400, overflowX: 'auto', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: 4, minWidth: max * 22 }}>
          {Array.from({ length: max + 1 }, (_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20 }}>
              <div style={{ width: 1, height: i % 5 === 0 ? 10 : 5, background: i >= question.part1 && i <= question.whole ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '0.55rem', color: i === question.part1 || i === question.whole ? 'var(--gold)' : 'var(--text-muted)' }}>{i}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// Main Question Renderer
export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = option === question.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  // Highlight keywords in question text
  const highlightedText = (question.keyWords || []).reduce((text, word) => {
    return text.replace(
      new RegExp(`(${word})`, 'gi'),
      `<mark style="background: rgba(255,193,7,0.3); color: var(--gold); border-radius: 4px; padding: 0 4px;">$1</mark>`
    );
  }, question.questionText);

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--purple-light)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px' }}>
        📝 WORD PROBLEM
      </div>
      <p className="question-text" dangerouslySetInnerHTML={{ __html: highlightedText }} />
      <Visual question={question} />
      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += opt === question.correctAnswer ? ' correct' : ' wrong';
            } else if (disabled && opt === question.correctAnswer) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
