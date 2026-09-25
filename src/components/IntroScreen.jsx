// src/components/IntroScreen.jsx
// Exact parity with reference G2-Money-Money-main IntroScreen structure and styling
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'Telemetry signal alert' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Ishaan, Xin Yi & Orbit' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 interactive labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review & scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Curriculum · Arithmetic Progression &amp; Sequences Grade 7
      </div>

      {/* Main Title Group */}
      <div className="intro-header-group">
        <h1 className="intro-title">
          <span className="text-orange">Progression</span> <span className="text-white">Quest</span>
        </h1>
        <h2 className="intro-subtitle">
          Master First Terms (a), Common Differences (d), and Trajectory Formulas
        </h2>
      </div>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🤖</div>
        <div className="intro-speech-bubble">
          Hi! I'm Orbit. Nova-7's telemetry stream is corrupted! Check every gap, formulate general terms with <span className="text-yellow">Tₙ = a + (n − 1)d</span>, and calibrate trajectories to save the mission! 🚀📡
        </div>
      </div>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>
        <div className="journey-row">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() =>
                  dispatch({
                    type: 'SET_PHASE',
                    payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase(),
                  })
                }
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Actions & Badges */}
      <div className="intro-actions-area">
        <div className="intro-ctas">
          <button className="btn btn-primary btn-lg intro-cta-main" onClick={startFresh}>
            🚀 Begin Your Journey!
          </button>
          {hasSaved && (
            <button className="btn btn-outline" onClick={resumeSession}>
              ↩ Resume Session
            </button>
          )}
        </div>

        <div className="intro-bottom-pills">
          <div className="bottom-pill">
            <span className="bottom-pill-icon" style={{ color: '#ff6b6b' }}>🎯</span>
            <span>100 Questions</span>
          </div>
          <div className="bottom-pill">
            <span className="bottom-pill-icon" style={{ color: '#feca57' }}>📈</span>
            <span>Sequences &amp; AP</span>
          </div>
          <div className="bottom-pill">
            <span className="bottom-pill-icon" style={{ color: '#66bb6a' }}>✨</span>
            <span>Badges &amp; XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
