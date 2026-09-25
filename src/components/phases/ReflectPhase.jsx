// src/components/phases/ReflectPhase.jsx
// Reflect Phase for ProgressionQuest: Mission Control Cadets
// Defined per PRD §8.5 & TRD §6.3

import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';

const REFLECT_QUESTIONS = [
  {
    q: "1. Cadet Xin Yi inspects: 2, 5, 8, 12, 15 and notices 5 − 2 = 3. Is this sequence guaranteed to be an Arithmetic Progression?",
    options: [
      "No — you must check EVERY consecutive pair (between 8 and 12 the gap is 4, not 3!)",
      "Yes — once the first gap is identified, the sequence is automatically arithmetic",
      "Yes — as long as the numbers keep increasing",
    ],
    correct: 0,
    explanation: "Golden Rule: Never stop after the first gap! Between 8 and 12 the difference is 4, so the pattern fails.",
  },
  {
    q: "2. Can a genuine Arithmetic Progression have a negative common difference (d < 0)?",
    options: [
      "Yes — negative d represents a normal, valid decreasing sequence (e.g. 50, 42, 34...)",
      "No — arithmetic sequences are mathematically required to increase",
      "Only during retro-rocket simulations on Tuesdays",
    ],
    correct: 0,
    explanation: "A common difference can be positive, negative, or zero. Decreasing APs are standard flight telemetry!",
  },
  {
    q: "3. In the General Term Formula Tₙ = a + (n − 1)d, why do we multiply d by (n − 1) instead of n?",
    options: [
      "Because the first term 'a' is already at position 1, so reaching position n takes (n − 1) jumps",
      "Because n must always be reduced by 1 to prevent division by zero",
      "It is an arbitrary symbol convention without physical meaning",
    ],
    correct: 0,
    explanation: "Starting at T₁, you take 1 step to reach T₂, 2 steps to reach T₃, and (n − 1) steps to reach Tₙ!",
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers]     = useState({});
  const [journal, setJournal]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars   = state?.districtScores?.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter(b => state?.badges?.includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
          <div className="trophy-icon">🚀</div>
          <h1 className="trophy-title headline" style={{ color: '#38bdf8' }}>
            Cadet Flight Wings Granted!
          </h1>
          <p className="trophy-sub subheadline" style={{ color: '#fbbf24' }}>
            Mission Control: Arithmetic Progression Telemetry Mastery Complete ✅
          </p>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display" style={{ color: '#38bdf8' }}>{totalCorrect}</span>
              <span className="stat-label label-text">/ 100 Questions</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display" style={{ color: '#fbbf24' }}>{state?.xp || 0}</span>
              <span className="stat-label label-text">Mission XP ⭐</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display" style={{ color: '#10b981' }}>{state?.maxStreak || 0}</span>
              <span className="stat-label label-text">Best Telemetry Streak 🔥</span>
            </div>
          </div>

          {/* Stars */}
          <div className="trophy-stars">
            {[...Array(Math.min(Math.max(totalStars, 3), 30))].map((_, i) => (
              <span key={i} style={{ fontSize: '1.3rem', animationDelay: `${i * 0.05}s` }} className="anim-bounce-in">
                ⭐
              </span>
            ))}
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="trophy-badges">
              <p className="label-text" style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '6px' }}>
                Mission Badges Unlocked
              </p>
              <div className="badge-list">
                {earnedBadges.map(b => (
                  <div key={b.id} className="badge-pill" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                    <span style={{ fontSize: '1.3rem' }}>{b.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 800, color: '#f8fafc' }}>{b.label}</span>
                      <span className="badge-desc label-text">{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="trophy-actions">
            <button className="btn btn-primary trophy-cta" onClick={playAgain} style={{ boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
              🔄 Replay Mission
            </button>
            <button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}>
              🏠 Mission Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-wrap">
      <div className="reflect-container anim-slide-up">
        {/* Header */}
        <div className="reflect-header glass-card">
          <div className="reflect-header-badge">
            📓 Phase 5 · Mission Telemetry Debrief
          </div>
          <h1 className="reflect-title">Flight Integrity Review</h1>
          <p className="reflect-subtitle">
            Solidify your mathematical instincts before receiving your Mission Commander certification!
          </p>
        </div>

        {/* Recap Questions targeting headline misconceptions */}
        <div className="reflect-questions-card glass-card">
          <h2 className="reflect-card-title">
            <span>🎯</span> Core Concept Checks
          </h2>

          <div className="reflect-q-list">
            {REFLECT_QUESTIONS.map((item, qIdx) => (
              <div key={qIdx} className="reflect-q-block">
                <p className="reflect-q-text">{item.q}</p>
                <div className="reflect-opt-list">
                  {item.options.map((opt, optIdx) => {
                    const isSelected = answers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        className={`reflect-opt-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                      >
                        <span className="opt-radio">{isSelected ? '◉' : '○'}</span>
                        <span className="opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Journal Prompt */}
        <div className="reflect-journal-card glass-card">
          <h2 className="reflect-card-title">
            <span>🧑‍🚀</span> Cadet Flight Log
          </h2>
          <label className="journal-label" htmlFor="cadet-reflection-input">
            Which mission checkpoint or simulation station required the most careful checking, and why?
          </label>
          <textarea
            id="cadet-reflection-input"
            className="journal-textarea"
            rows="3"
            placeholder="Log your thoughts here (e.g., Checking every gap caught the subtle anomaly in station 4...)"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < REFLECT_QUESTIONS.length}
              style={{ boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}
            >
              Submit Debrief &amp; View Certification 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
