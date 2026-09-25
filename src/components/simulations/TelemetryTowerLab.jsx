// src/components/simulations/TelemetryTowerLab.jsx
// Station 1: Concept Discovery Lab — Pure Free-Play with Optional Bonus Challenges
// Defined per PRD §8.3 & TRD §6

import React, { useState, useMemo, useEffect } from 'react';
import './Stations.css';
import TelemetryGraph from '../shared/TelemetryGraph.jsx';
import { generateArithmeticSequence, findTermAtPosition } from '../../utils/progressionMath.js';

export default function TelemetryTowerLab({ onComplete, audioEnabled }) {
  // Live control state
  const [a, setA] = useState(20); // starting altitude (m)
  const [d, setD] = useState(10); // burn rate / difference (m/checkpoint), supports negative!

  // Track explored combinations for completion gate (5+ unique pairs)
  const [exploredPairs, setExploredPairs] = useState(new Set(["20,10"]));
  const [completed, setCompleted] = useState(false);

  // Bonus Challenges Panel State
  const [showBonus, setShowBonus] = useState(false);
  const [bonusStatus, setBonusStatus] = useState([false, false, false]);

  // Compute live sequence for 6 checkpoints
  const sequence = useMemo(() => {
    return generateArithmeticSequence(a, d, 6);
  }, [a, d]);

  // Check unique combinations explored
  useEffect(() => {
    const key = `${a},${d}`;
    setExploredPairs((prev) => {
      const updated = new Set(prev);
      updated.add(key);
      if (updated.size >= 5 && !completed) {
        setCompleted(true);
        if (onComplete) onComplete();
      }
      return updated;
    });

    // Check bonus challenges
    // Challenge 1: Reach exactly 80m at Checkpoint 5: T5 = a + 4d === 80
    if (a + 4 * d === 80) {
      setBonusStatus((prev) => [true, prev[1], prev[2]]);
    }
    // Challenge 2: Execute a clean descent with d <= -5 and a >= 50
    if (d <= -5 && a >= 50) {
      setBonusStatus((prev) => [prev[0], true, prev[2]]);
    }
    // Challenge 3: Reach exactly 150m at Checkpoint 6: T6 = a + 5d === 150
    if (a + 5 * d === 150) {
      setBonusStatus((prev) => [prev[0], prev[1], true]);
    }
  }, [a, d, completed, onComplete]);

  // Rocket vertical position relative to altitude
  const rocketShiftY = Math.max(-50, Math.min(50, -((a + 5 * d) - 50) * 0.4));
  const flameScale = Math.max(0.4, Math.min(2.0, Math.abs(d) / 8));
  const isAscending = d > 0;
  const isDescending = d < 0;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h2 className="station-title">
          <span>📡</span> Station 1: Telemetry Tower Lab
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="station-round-badge"
            style={{
              borderColor: completed ? '#10b981' : '#38bdf8',
              color: completed ? '#10b981' : '#38bdf8',
            }}
          >
            {completed ? '✅ Exploration Complete' : `Combinations: ${Math.min(exploredPairs.size, 5)}/5`}
          </span>
          <button
            className={`btn btn-sm ${showBonus ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowBonus(!showBonus)}
          >
            🎯 {showBonus ? 'Hide Bonus' : 'Bonus Challenges'}
          </button>
        </div>
      </div>

      {/* Grid: Left Controls & Rocket, Right Telemetry Graph */}
      <div className="station-grid-2col">
        {/* Left Column: Controls & Visual Rocket */}
        <div className="station-col-left">
          {/* Rocket Visual Viewport */}
          <div className="rocket-sim-viewport">
            <div className="rocket-stars-layer" />
            <div
              className="rocket-vessel"
              style={{
                transform: `translateY(${rocketShiftY}px) ${isDescending ? 'rotate(180deg)' : ''}`,
              }}
            >
              <span className="rocket-icon">🚀</span>
              <span
                className="rocket-flame"
                style={{
                  transform: `scale(${flameScale})`,
                  display: d === 0 ? 'none' : 'block',
                }}
              >
                🔥
              </span>
            </div>

            {/* Altitude readout overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                background: 'rgba(0, 0, 0, 0.65)',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              Final Altitude: <strong style={{ color: '#fbbf24' }}>{a + 5 * d}m</strong>
            </div>
          </div>

          {/* Control: Starting Altitude (a) */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">Initial Altitude (First Term: a)</span>
              <span className="control-value-badge">{a}m</span>
            </div>
            <div className="control-btn-group">
              <button
                className="control-step-btn"
                onClick={() => setA((v) => Math.max(-20, v - 5))}
                aria-label="Decrease initial altitude"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min="-20"
                max="100"
                step="5"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setA((v) => Math.min(100, v + 5))}
                aria-label="Increase initial altitude"
              >
                +
              </button>
            </div>
          </div>

          {/* Control: Burn Rate / Difference (d) */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">
                Burn Rate (Common Difference: d)
                {isDescending && <span style={{ color: '#f43f5e', marginLeft: '6px' }}>(Descent)</span>}
              </span>
              <span
                className="control-value-badge"
                style={{ color: d >= 0 ? '#34d399' : '#f87171', borderColor: d >= 0 ? '#34d399' : '#f87171' }}
              >
                {d >= 0 ? `+${d}` : d}m / step
              </span>
            </div>
            <div className="control-btn-group">
              <button
                className="control-step-btn"
                onClick={() => setD((v) => Math.max(-15, v - 2))}
                aria-label="Decrease common difference"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min="-15"
                max="25"
                step="1"
                value={d}
                onChange={(e) => setD(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setD((v) => Math.min(25, v + 2))}
                aria-label="Increase common difference"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Graph & Bonus Prompts */}
        <div className="station-col-right">
          <TelemetryGraph
            points={sequence}
            highlightIndex={1}
            width={480}
            height={220}
            title="REAL-TIME TELEMETRY PLOT"
          />

          {/* Bonus Challenges Sub-Panel */}
          {showBonus && (
            <div
              className="control-card anim-slide-up"
              style={{
                border: '1.5px solid rgba(251, 191, 36, 0.4)',
                background: 'rgba(30, 27, 75, 0.75)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fbbf24', fontSize: '0.85rem' }}>
                  🎯 OPTIONAL MISSION LOG CHALLENGES
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(Skippable)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: bonusStatus[0] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                    1. Tune controls so Checkpoint 5 reaches exactly 80m
                  </span>
                  <span>{bonusStatus[0] ? '✅ Completed' : '⏳ Pending'}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: bonusStatus[1] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                    2. Execute a descent burn with negative d (d ≤ −5, a ≥ 50)
                  </span>
                  <span>{bonusStatus[1] ? '✅ Completed' : '⏳ Pending'}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: bonusStatus[2] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                    3. Reach high altitude: Checkpoint 6 at 150m (T₆ = 150)
                  </span>
                  <span>{bonusStatus[2] ? '✅ Completed' : '⏳ Pending'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Guidance Footer */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              fontFamily: 'var(--font-mono)',
            }}
          >
            💡 Notice how changing (a) shifts the entire graph up or down, while (d) controls the slope! Negative (d) slopes downwards.
          </div>
        </div>
      </div>
    </div>
  );
}
