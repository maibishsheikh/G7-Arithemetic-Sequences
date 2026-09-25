// src/components/phases/WonderPhase.jsx
// Wonder Phase for ProgressionQuest: Mission Control Cadets
// Defined per PRD §8.1

import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import ProgressionVisual from '../shared/ProgressionVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['📡', '🚀', '🛰️', '✨', '⭐', '⚡', '📊', '🛸', '🤖', '🎯'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card" style={{ borderColor: 'rgba(56, 189, 248, 0.35)' }}>
          <div className="wonder-stadium-icon" aria-hidden="true">📡</div>
          <h1 className="wonder-title headline" style={{ color: '#38bdf8' }}>
            Mission Control Telemetry Alert!
          </h1>

          <div className="wonder-number-display" style={{ background: 'rgba(15, 23, 42, 0.75)' }}>
            <ProgressionVisual
              type="sequence-strip"
              data={{
                terms: [14, 22, 30, 38, 46, '?'],
                showDifference: true,
              }}
              compact={false}
            />
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              Mission Control just lost radar lock with <strong className="wonder-em" style={{ color: '#38bdf8' }}>Rocket Nova-7</strong> mid-ascent.
            </p>
            <p className="body-text wonder-q">
              The first five checkpoint altitudes arrived cleanly: <strong className="wonder-em" style={{ color: '#fbbf24' }}>14m, 22m, 30m, 38m, 46m</strong>... but <span className="wonder-highlight" style={{ color: '#f43f5e' }}>Checkpoint 6 is corrupted static!</span>
            </p>
            <p className="body-text wonder-q" style={{ marginTop: '8px', color: '#cbd5e1' }}>
              If the rocket's burn follows an authentic constant pattern, can you calculate the exact missing altitude and save the mission?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot
              mood="thinking"
              message="Orbit reporting: Telemetry feed corrupted! Can you decipher the pattern to recover Reading Six?"
              size="sm"
            />
          </div>

          <button
            className="btn btn-primary btn-lg wonder-cta"
            onClick={handleInvestigate}
            style={{ boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)' }}
          >
            Investigate Telemetry 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
