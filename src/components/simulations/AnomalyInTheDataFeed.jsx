// src/components/simulations/AnomalyInTheDataFeed.jsx
// Station 4: Error-Detective with Escalating Rounds of Subtlety
// Defined per PRD §8.3 & TRD §6

import React, { useState } from 'react';
import './Stations.css';
import TelemetryGraph from '../shared/TelemetryGraph.jsx';

const ANOMALY_ROUNDS = [
  {
    round: 1,
    title: "Round 1: Rogue Radar Spike",
    description: "An obvious outlier corrupted the telemetry log! Find which checkpoint deviates from the straight line.",
    sequence: [10, 25, 40, 95, 70],
    anomalyIndex: 3, // T4 (0-indexed: 3)
    correctVal: 55,
    commonDiff: 15,
    hint: "Every gap should be +15: 10 ➔ 25 (+15), 25 ➔ 40 (+15). What should Checkpoint 4 be?",
  },
  {
    round: 2,
    title: "Round 2: The Delayed Glitch (Check Every Gap!)",
    description: "Xin Yi only checked the first gap and thought this was authentic! Find the subtle error hiding in later gaps.",
    sequence: [12, 19, 26, 35, 40],
    anomalyIndex: 3, // T4 (should be 33, but is 35; gap 19-12=7, 26-19=7, 35-26=9!)
    correctVal: 33,
    commonDiff: 7,
    hint: "19 − 12 = 7 and 26 − 19 = 7. But 35 − 26 = 9! Checkpoint 4 is corrupted!",
  },
  {
    round: 3,
    title: "Round 3: Sign-Inversion Descent Hazard",
    description: "A lander in retro-descent had its sensor invert signs! Identify where negative d turned positive.",
    sequence: [50, 42, 34, 42, 18],
    anomalyIndex: 3, // T4 (should be 26: 50, 42, 34, 26, 18; d = -8)
    correctVal: 26,
    commonDiff: -8,
    hint: "The descent rate is d = −8 (50, 42, 34). Term 4 jumped up instead of down! 34 + (−8) = ?",
  },
];

export default function AnomalyInTheDataFeed({ onComplete, audioEnabled }) {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [roundFixed, setRoundFixed] = useState([false, false, false]);

  const activeRound = ANOMALY_ROUNDS[currentRoundIdx];

  // Current sequence state (can be edited/fixed)
  const [currentSeq, setCurrentSeq] = useState([...activeRound.sequence]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fixInput, setFixInput] = useState('');
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  // Update when changing rounds
  function switchRound(idx) {
    setCurrentRoundIdx(idx);
    setCurrentSeq([...ANOMALY_ROUNDS[idx].sequence]);
    setSelectedIndex(null);
    setFixInput('');
    setFeedback({ text: '', isError: false });
  }

  function handleSelectChip(idx) {
    setSelectedIndex(idx);
    setFixInput('');
    setFeedback({ text: '', isError: false });
  }

  function handleApplyFix() {
    if (selectedIndex === null) return;

    const parsed = parseInt(fixInput, 10);
    if (selectedIndex === activeRound.anomalyIndex && parsed === activeRound.correctVal) {
      // Correct anomaly identified and fixed!
      const updatedSeq = [...currentSeq];
      updatedSeq[selectedIndex] = activeRound.correctVal;
      setCurrentSeq(updatedSeq);

      const updatedFixed = [...roundFixed];
      updatedFixed[currentRoundIdx] = true;
      setRoundFixed(updatedFixed);

      setFeedback({
        text: `✓ Anomaly resolved! T${selectedIndex + 1} corrected to ${activeRound.correctVal}. Trajectory restored!`,
        isError: false,
      });

      if (updatedFixed.every(Boolean)) {
        if (onComplete) onComplete();
      }
    } else if (selectedIndex !== activeRound.anomalyIndex) {
      setFeedback({
        text: `Checkpoint T${selectedIndex + 1} is already correct! Check other gaps.`,
        isError: true,
      });
    } else {
      setFeedback({
        text: `You selected the right anomaly (T${selectedIndex + 1}), but ${parsed} is not the correct term. Common difference is ${activeRound.commonDiff}.`,
        isError: true,
      });
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h2 className="station-title">
          <span>🔍</span> Station 4: Anomaly in the Data Feed
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="station-round-badge">
            Diagnostic Round {currentRoundIdx + 1}/3 {roundFixed[currentRoundIdx] ? '⭐' : ''}
          </span>
        </div>
      </div>

      {/* Grid: Diagnostics Panel and Live Graph */}
      <div className="station-grid-2col">
        {/* Left Column: Diagnostics and Anomaly Selection */}
        <div className="station-col-left">
          {/* Round Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            {ANOMALY_ROUNDS.map((r, idx) => (
              <button
                key={r.round}
                className={`btn btn-sm ${currentRoundIdx === idx ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '4px' }}
                onClick={() => switchRound(idx)}
              >
                {roundFixed[idx] ? '✅' : `R${idx + 1}`} {idx === 0 ? 'Spike' : idx === 1 ? 'Later Gap' : 'Sign Error'}
              </button>
            ))}
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800 }}>
              {activeRound.title.toUpperCase()}
            </span>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#e2e8f0' }}>
              {activeRound.description}
            </p>
          </div>

          {/* Interactive Checkpoint Chips */}
          <div className="control-card">
            <span className="control-title">Click the Corrupted Checkpoint:</span>
            <div className="anomaly-checkpoint-grid">
              {currentSeq.map((val, idx) => {
                const isSelected = selectedIndex === idx;
                const isFixed = roundFixed[currentRoundIdx] && idx === activeRound.anomalyIndex;

                return (
                  <div
                    key={idx}
                    className={`anomaly-chip ${isSelected ? 'selected' : ''} ${isFixed ? 'fixed' : ''}`}
                    onClick={() => handleSelectChip(idx)}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      T{idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: isFixed ? '#10b981' : isSelected ? '#f43f5e' : '#f8fafc',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input to repair the anomaly */}
            {selectedIndex !== null && !roundFixed[currentRoundIdx] && (
              <div
                className="anim-slide-up"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  padding: '8px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>
                  Repair <strong>T{selectedIndex + 1}</strong> with correct reading:
                </span>
                <input
                  type="number"
                  placeholder="Correct value"
                  value={fixInput}
                  onChange={(e) => setFixInput(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(56, 189, 248, 0.5)',
                    background: '#020617',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    width: '120px',
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleApplyFix}>
                  Fix Anomaly 🛠️
                </button>
              </div>
            )}

            {/* Feedback alert */}
            {feedback.text && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  background: feedback.isError ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${feedback.isError ? '#f43f5e' : '#10b981'}`,
                  color: feedback.isError ? '#fecdd3' : '#a7f3d0',
                }}
              >
                {feedback.text}
              </div>
            )}
          </div>

          {/* Navigation to next round if cleared */}
          {roundFixed[currentRoundIdx] && currentRoundIdx < ANOMALY_ROUNDS.length - 1 && (
            <button
              className="btn btn-primary btn-sm anim-slide-up"
              onClick={() => switchRound(currentRoundIdx + 1)}
            >
              Advance to Next Diagnostic Round →
            </button>
          )}
        </div>

        {/* Right Column: Live Telemetry Graph with outlier highlight */}
        <div className="station-col-right">
          <TelemetryGraph
            points={currentSeq}
            highlightIndex={selectedIndex != null ? selectedIndex + 1 : null}
            width={480}
            height={220}
            title={
              roundFixed[currentRoundIdx]
                ? "TELEMETRY RESTORED (SMOOTH AP)"
                : "DATA STREAM WITH UNRESOLVED ANOMALY"
            }
          />

          {/* Diagnostic Detective Tip */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(30, 27, 75, 0.65)',
              border: '1px solid rgba(129, 140, 248, 0.3)',
              fontSize: '0.8rem',
              color: '#cbd5e1',
            }}
          >
            <div style={{ color: '#a5b4fc', fontWeight: 800, marginBottom: '4px' }}>
              💡 MISSION ADVISORY NOTE:
            </div>
            {activeRound.hint}
          </div>
        </div>
      </div>
    </div>
  );
}
