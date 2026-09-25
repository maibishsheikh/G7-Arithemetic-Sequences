// src/components/simulations/MissionSimulatorSandbox.jsx
// Optional 5th Layer: Free Flight Mission Simulator Sandbox
// Defined per PRD §8.3 & TRD §6 (Unlocks after stations 1-4, non-blocking)

import React, { useState, useMemo } from 'react';
import './Stations.css';
import TelemetryGraph from '../shared/TelemetryGraph.jsx';
import { generateArithmeticSequence, findTermAtPosition, sumOfNTerms } from '../../utils/progressionMath.js';

export default function MissionSimulatorSandbox() {
  const [a, setA] = useState(25);
  const [d, setD] = useState(12);
  const [checkpoints, setCheckpoints] = useState(8);
  const [isSimulating, setIsSimulating] = useState(false);

  // Compute live flight sequence
  const sequence = useMemo(() => {
    return generateArithmeticSequence(a, d, checkpoints);
  }, [a, d, checkpoints]);

  // Derived mission statistics
  const finalTn = findTermAtPosition(a, d, checkpoints);
  const totalDistance = sumOfNTerms(a, d, checkpoints);
  const avgAltitude = Math.round(totalDistance / checkpoints);

  const flightProfile =
    d > 10 ? 'High-Thrust Ascent 🚀' : d > 0 ? 'Gentle Orbital Climb 🛰️' : d === 0 ? 'Stationary Orbit 🛸' : 'Atmospheric Re-entry Descent 🛬';

  function triggerLaunch() {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h2 className="station-title">
          <span>🌌</span> Mission Simulator: Free Flight Sandbox
        </h2>
        <span
          className="station-round-badge"
          style={{ borderColor: '#a78bfa', color: '#a78bfa' }}
        >
          ⭐ Unlocked Bonus Lab · Free Play
        </span>
      </div>

      {/* Grid: Controls + Rocket Viewport, Telemetry Graph + Mission Summary */}
      <div className="station-grid-2col">
        {/* Left Column: Controls & Launch Bay */}
        <div className="station-col-left">
          {/* Animated Rocket Bay */}
          <div className="rocket-sim-viewport">
            <div className="rocket-stars-layer" />
            <div
              className={`rocket-vessel ${isSimulating ? 'anim-bounce-in' : ''}`}
              style={{
                transform: `translateY(${Math.max(-45, Math.min(45, -(finalTn - 100) * 0.3))}px) ${
                  d < 0 ? 'rotate(180deg)' : ''
                }`,
              }}
            >
              <span className="rocket-icon">🚀</span>
              <span
                className="rocket-flame"
                style={{
                  transform: `scale(${Math.max(0.5, Math.min(2.2, Math.abs(d) / 8))})`,
                  display: d === 0 ? 'none' : 'block',
                }}
              >
                🔥
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#38bdf8',
                background: 'rgba(0, 0, 0, 0.65)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              PROFILE: {flightProfile}
            </div>

            <button
              className="btn btn-primary btn-sm"
              style={{ position: 'absolute', bottom: '10px', right: '12px' }}
              onClick={triggerLaunch}
            >
              Simulate Burn ⚡
            </button>
          </div>

          {/* Control 1: Starting Altitude a */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">Initial Altitude (a)</span>
              <span className="control-value-badge">{a}m</span>
            </div>
            <div className="control-btn-group">
              <button
                className="control-step-btn"
                onClick={() => setA((v) => Math.max(-50, v - 5))}
                aria-label="Decrease initial altitude"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min="-50"
                max="150"
                step="5"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setA((v) => Math.min(150, v + 5))}
                aria-label="Increase initial altitude"
              >
                +
              </button>
            </div>
          </div>

          {/* Control 2: Common Difference d */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">
                Trajectory Step (d)
                {d < 0 && <span style={{ color: '#f43f5e', marginLeft: '6px' }}>[Descent]</span>}
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
                onClick={() => setD((v) => Math.max(-25, v - 2))}
                aria-label="Decrease rate"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min="-25"
                max="35"
                step="1"
                value={d}
                onChange={(e) => setD(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setD((v) => Math.min(35, v + 2))}
                aria-label="Increase rate"
              >
                +
              </button>
            </div>
          </div>

          {/* Control 3: Number of Checkpoints n */}
          <div className="control-card">
            <div className="control-label-row">
              <span className="control-title">Checkpoints Monitored (n)</span>
              <span className="control-value-badge">{checkpoints}</span>
            </div>
            <div className="control-btn-group">
              <button
                className="control-step-btn"
                onClick={() => setCheckpoints((v) => Math.max(5, v - 1))}
                aria-label="Decrease checkpoints"
              >
                −
              </button>
              <input
                type="range"
                className="control-slider"
                min="5"
                max="12"
                step="1"
                value={checkpoints}
                onChange={(e) => setCheckpoints(Number(e.target.value))}
              />
              <button
                className="control-step-btn"
                onClick={() => setCheckpoints((v) => Math.min(12, v + 1))}
                aria-label="Increase checkpoints"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Graph & Computed Mission Statistics */}
        <div className="station-col-right">
          <TelemetryGraph
            points={sequence}
            highlightIndex={checkpoints}
            width={480}
            height={220}
            title="FREE FLIGHT TELEMETRY SIMULATION"
          />

          {/* Auto-Computed Mission Telemetry Summary */}
          <div className="sandbox-summary-grid">
            <div className="sandbox-stat-card">
              <span className="sandbox-stat-label">Final Term T{checkpoints}</span>
              <span className="sandbox-stat-val" style={{ color: '#38bdf8' }}>
                {finalTn}m
              </span>
            </div>

            <div className="sandbox-stat-card">
              <span className="sandbox-stat-label">Total Distance (S{checkpoints})</span>
              <span className="sandbox-stat-val" style={{ color: '#fbbf24' }}>
                {totalDistance}m
              </span>
            </div>

            <div className="sandbox-stat-card">
              <span className="sandbox-stat-label">Average Altitude</span>
              <span className="sandbox-stat-val" style={{ color: '#10b981' }}>
                {avgAltitude}m
              </span>
            </div>

            <div className="sandbox-stat-card">
              <span className="sandbox-stat-label">Delta per Checkpoint</span>
              <span
                className="sandbox-stat-val"
                style={{ color: d >= 0 ? '#34d399' : '#f87171' }}
              >
                {d >= 0 ? `+${d}` : d}m
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.8rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Formula confirmation: T_{checkpoints} = {a} + ({checkpoints - 1}) × ({d}) = {finalTn}m. Total sum S_{checkpoints} = {checkpoints}/2 × ({a} + {finalTn}) = {totalDistance}m.
          </div>
        </div>
      </div>
    </div>
  );
}
