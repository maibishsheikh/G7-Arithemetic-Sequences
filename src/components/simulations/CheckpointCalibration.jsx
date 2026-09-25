// src/components/simulations/CheckpointCalibration.jsx
// Station 2: Build-to-Target Challenge across 3 Escalating Rounds
// Defined per PRD §8.3 & TRD §6

import React, { useState, useMemo, useEffect } from 'react';
import './Stations.css';
import TelemetryGraph from '../shared/TelemetryGraph.jsx';
import { generateArithmeticSequence, findTermAtPosition } from '../../utils/progressionMath.js';

const ROUNDS = [
  {
    round: 1,
    title: "Round 1: Ascent Calibration",
    targetN: 4,
    targetVal: 44,
    desc: "Tune controls so Checkpoint T4 reaches exactly 44m.",
    defaultA: 14,
    defaultD: 5,
    minD: 1,
    maxD: 20,
    hint: "Think: T₄ = a + (4 − 1)d = a + 3d = 44. If a = 14, then 3d = 30 ➔ d = 10!",
  },
  {
    round: 2,
    title: "Round 2: Retro-Burn Descent",
    targetN: 5,
    targetVal: 20,
    desc: "A descent sequence! Tune controls so Checkpoint T5 lands at exactly 20m.",
    defaultA: 60,
    defaultD: -5,
    minD: -15,
    maxD: -2,
    hint: "Think: T₅ = a + 4d = 20. With a = 60: 4d = 20 − 60 = −40 ➔ d = −10!",
  },
  {
    round: 3,
    title: "Round 3: Deep Trajectory Formula",
    targetN: 12,
    targetVal: 185,
    desc: "High checkpoint: Calibrate Checkpoint T12 to reach 185m using the formula!",
    defaultA: 20,
    defaultD: 10,
    minD: 5,
    maxD: 25,
    hint: "Use T₁₂ = a + 11d = 185. If a = 20, 11d = 165 ➔ d = 15!",
  },
];

export default function CheckpointCalibration({ onComplete, audioEnabled }) {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState([false, false, false]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const activeRound = ROUNDS[currentRoundIdx];

  // Controls
  const [a, setA] = useState(activeRound.defaultA);
  const [d, setD] = useState(activeRound.defaultD);

  // Reset controls when changing rounds
  useEffect(() => {
    setA(activeRound.defaultA);
    setD(activeRound.defaultD);
    setShowHint(false);
    setAttempts(0);
  }, [currentRoundIdx]);

  // Current calculated value at target checkpoint
  const currentTn = findTermAtPosition(a, d, activeRound.targetN);
  const isMatch = currentTn === activeRound.targetVal;

  // Sequence for graph display
  const seqLength = Math.max(activeRound.targetN, 6);
  const sequence = useMemo(() => {
    return generateArithmeticSequence(a, d, seqLength);
  }, [a, d, seqLength]);

  function handleCheck() {
    setAttempts((prev) => prev + 1);
    if (isMatch) {
      const updated = [...roundCompleted];
      updated[currentRoundIdx] = true;
      setRoundCompleted(updated);

      if (updated.every(Boolean)) {
        if (onComplete) onComplete();
      }
    }
  }

  function nextRound() {
    if (currentRoundIdx < ROUNDS.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
    }
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h2 className="station-title">
          <span>🎯</span> Station 2: Checkpoint Calibration
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="station-target-box">
            <span className="station-target-label">Target T{activeRound.targetN}:</span>
            <span className="station-target-num">{activeRound.targetVal}m</span>
          </div>
          <span className="station-round-badge">
            Round {currentRoundIdx + 1}/3 {roundCompleted[currentRoundIdx] ? '⭐' : ''}
          </span>
        </div>
      </div>

      {/* Grid: Left Controls, Right Graph & Status */}
      <div className="station-grid-2col">
        {/* Left: Controls & Round Selection */}
        <div className="station-col-left">
          {/* Round Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            {ROUNDS.map((r, idx) => (
              <button
                key={r.round}
                className={`btn btn-sm ${currentRoundIdx === idx ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '4px' }}
                onClick={() => setCurrentRoundIdx(idx)}
              >
                {roundCompleted[idx] ? '✅' : `R${idx + 1}`} {r.round === 2 ? 'Descent' : r.round === 3 ? 'T12' : 'Ascent'}
              </button>
            ))}
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
              {activeRound.desc}
            </p>
          </div>

          {/* Dial: a */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">Initial Reading (a)</span>
              <span className="control-value-badge">{a}m</span>
            </div>
            <div className="control-btn-group">
              <button
                className="control-step-btn"
                onClick={() => setA((v) => v - 2)}
                aria-label="Decrease a"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min="0"
                max="100"
                step="1"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setA((v) => v + 2)}
                aria-label="Increase a"
              >
                +
              </button>
            </div>
          </div>

          {/* Dial: d */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">
                Common Difference (d)
                {d < 0 && <span style={{ color: '#f43f5e', marginLeft: '4px' }}>[Negative]</span>}
              </span>
              <span
                className="control-value-badge"
                style={{ color: d >= 0 ? '#34d399' : '#f87171' }}
              >
                {d >= 0 ? `+${d}` : d}m
              </span>
            </div>
            <div className="control-btn-group">
              <button
                className="control-step-btn"
                onClick={() => setD((v) => v - 1)}
                aria-label="Decrease d"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min={activeRound.minD}
                max={activeRound.maxD}
                step="1"
                value={d}
                onChange={(e) => setD(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setD((v) => v + 1)}
                aria-label="Increase d"
              >
                +
              </button>
            </div>
          </div>

          {/* Readout & Confirmation Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '12px',
              background: isMatch ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.8)',
              border: `1.5px solid ${isMatch ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>
                CURRENT T{activeRound.targetN}:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: isMatch ? '#10b981' : '#f8fafc',
                }}
              >
                {currentTn}m {isMatch ? '🎯 TARGET HIT!' : ''}
              </span>
            </div>

            {roundCompleted[currentRoundIdx] ? (
              currentRoundIdx < ROUNDS.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={nextRound}>
                  Next Round →
                </button>
              ) : (
                <span style={{ color: '#10b981', fontWeight: 800 }}>All Rounds Cleared! ⭐</span>
              )
            ) : (
              <button
                className={`btn btn-sm ${isMatch ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleCheck}
              >
                {isMatch ? 'Lock Calibration 🔒' : 'Verify Calibration'}
              </button>
            )}
          </div>
        </div>

        {/* Right: Telemetry Graph & Formula Helper */}
        <div className="station-col-right">
          <TelemetryGraph
            points={sequence}
            targetValue={activeRound.targetVal}
            targetIndex={activeRound.targetN}
            highlightIndex={activeRound.targetN}
            width={480}
            height={220}
            title={`CALIBRATION TRAJECTORY (ROUND ${currentRoundIdx + 1})`}
          />

          {/* Hint / Formula Card */}
          <div
            className="control-card"
            style={{
              background: 'rgba(30, 27, 75, 0.65)',
              border: '1px solid rgba(129, 140, 248, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 700 }}>
                💡 TRAJECTORY FORMULA ADVISORY
              </span>
              <button
                className="btn btn-outline btn-sm"
                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>

            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
              T_{activeRound.targetN} = a + ({activeRound.targetN} − 1)d = a + {activeRound.targetN - 1}d
            </p>

            {(showHint || attempts >= 3) && (
              <div
                className="anim-slide-up"
                style={{
                  marginTop: '6px',
                  padding: '6px 10px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#fde68a',
                }}
              >
                {activeRound.hint}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
