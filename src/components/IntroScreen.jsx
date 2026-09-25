// src/components/IntroScreen.jsx
// IntroScreen for ProgressionQuest: Mission Control Cadets (Grade 7 Arithmetic Sequences)
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '📡', label: 'Wonder',   desc: 'Telemetry signal alert' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Ishaan, Xin Yi & Orbit' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 mission stations + sandbox' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & boss battles' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Flight review & scorecard' },
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
        🚀 Grade 7 / Secondary 1 · Arithmetic Sequences &amp; Telemetry Simulation
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange" style={{ color: '#38bdf8' }}>Progression</span>{' '}
        <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">
        Mission Control Cadets · Master First Terms (a), Common Differences (d), and Trajectory Formulas
      </h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle" style={{ borderColor: '#38bdf8' }}>🤖</div>
        <div className="intro-speech-bubble" style={{ borderLeftColor: '#38bdf8' }}>
          Greetings Cadet! I'm Orbit the Mission Bot. Rocket Nova-7 is ascending, but Checkpoint 6 is corrupted.
          Ready to diagnose flight telemetry and calibrate trajectories? 🚀📡
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn how to verify arithmetic sequences by checking every gap, formulate general terms with{' '}
        <strong style={{ color: '#fbbf24' }}>Tₙ = a + (n − 1)d</strong>, interpolate interior checkpoints, and calculate total mission fuel burns!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR MISSION TIMELINE · CLICK ANY PHASE TO LAUNCH</div>

        <div className="journey-steps-container">
          <div className="journey-row top-row">
            {JOURNEY.slice(0, 3).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Launch ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                <span className={`journey-arrow ${i === 2 ? 'fade-arrow' : ''}`}>→</span>
              </React.Fragment>
            ))}
          </div>

          <div className="journey-row bottom-row">
            {JOURNEY.slice(3, 5).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Launch ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i === 0 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="intro-actions-row">
        {hasSaved ? (
          <>
            <button className="btn btn-primary btn-lg" onClick={resumeSession}>
              ▶ Resume Mission
            </button>
            <button className="btn btn-outline btn-lg" onClick={startFresh}>
              🔄 New Mission
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={startFresh} style={{ boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)' }}>
            Launch Mission Control 🚀
          </button>
        )}
      </div>
    </div>
  );
}
