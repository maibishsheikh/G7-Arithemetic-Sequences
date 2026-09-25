// src/components/simulations/MissionControlConsole.jsx
// Station 3: Multi-Step / Composite Construction (4 Chained Console Stages)
// Defined per PRD §8.3 & TRD §6

import React, { useState, useMemo } from 'react';
import './Stations.css';
import TelemetryGraph from '../shared/TelemetryGraph.jsx';
import ProgressionVisual from '../shared/ProgressionVisual.jsx';
import { sumOfNTerms } from '../../utils/progressionMath.js';

const MISSION_BRIEF = {
  pos1: 3,
  val1: 145,
  pos2: 7,
  val2: 285,
  targetPos: 12,
  // Derived answers:
  // d = (285 - 145) / (7 - 3) = 140 / 4 = 35
  // a = 145 - 2*35 = 75
  // T12 = 75 + 11*35 = 460
  // S12 = 12/2 * (75 + 460) = 6 * 535 = 3210
  expectedD: 35,
  expectedA: 75,
  expectedT12: 460,
  expectedS12: 3210,
};

export default function MissionControlConsole({ onComplete, audioEnabled }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: verify, 1: solve, 2: predict, 3: sum
  const [stepDone, setStepDone] = useState([false, false, false, false]);

  // Input states for each step
  const [step1Input, setStep1Input] = useState(''); // d rate
  const [step2Input, setStep2Input] = useState(''); // a initial
  const [step3Input, setStep3Input] = useState(''); // T12
  const [step4Input, setStep4Input] = useState(''); // S12 fuel

  const [feedback, setFeedback] = useState({ text: '', isError: false });

  // Progressive telemetry sequence based on completed steps
  const telemetryPoints = useMemo(() => {
    const pts = [];
    const a = stepDone[1] ? MISSION_BRIEF.expectedA : 75;
    const d = stepDone[0] ? MISSION_BRIEF.expectedD : 35;

    // Up to step 0/1: show points 3 and 7
    if (!stepDone[1]) {
      return [
        { x: 3, y: MISSION_BRIEF.val1 },
        { x: 7, y: MISSION_BRIEF.val2 },
      ];
    }

    // Step 2 & above: full trajectory up to checkpoint 7 or 12
    const maxN = stepDone[2] ? 12 : 7;
    for (let n = 1; n <= maxN; n++) {
      pts.push({ x: n, y: a + (n - 1) * d });
    }
    return pts;
  }, [stepDone]);

  // Step 1 Check: Verify rate of change per checkpoint
  function verifyStep1() {
    const val = parseInt(step1Input, 10);
    if (val === MISSION_BRIEF.expectedD) {
      const updated = [...stepDone];
      updated[0] = true;
      setStepDone(updated);
      setFeedback({
        text: `✓ Verified! Altitude delta is 140m across 4 intervals: d = 140 / 4 = 35m/checkpoint.`,
        isError: false,
      });
      setCurrentStep(1);
    } else {
      setFeedback({
        text: `Incorrect. Difference is 285m − 145m = 140m across 4 intervals (7 − 3). Divide 140 by 4.`,
        isError: true,
      });
    }
  }

  // Step 2 Check: Solve for initial reading a
  function verifyStep2() {
    const val = parseInt(step2Input, 10);
    if (val === MISSION_BRIEF.expectedA) {
      const updated = [...stepDone];
      updated[1] = true;
      setStepDone(updated);
      setFeedback({
        text: `✓ Solved! Starting from Checkpoint 3 (145m), step backwards 2 jumps of 35: a = 145 − 70 = 75m!`,
        isError: false,
      });
      setCurrentStep(2);
    } else {
      setFeedback({
        text: `Incorrect. T₃ = a + 2d = 145. Since d = 35, 2d = 70. Subtract 70 from 145.`,
        isError: true,
      });
    }
  }

  // Step 3 Check: Predict Checkpoint 12
  function verifyStep3() {
    const val = parseInt(step3Input, 10);
    if (val === MISSION_BRIEF.expectedT12) {
      const updated = [...stepDone];
      updated[2] = true;
      setStepDone(updated);
      setFeedback({
        text: `✓ Trajectory Locked! T₁₂ = 75 + 11 × 35 = 460m. Docking bay coordinates registered!`,
        isError: false,
      });
      setCurrentStep(3);
    } else {
      setFeedback({
        text: `Incorrect. Formula: T₁₂ = a + (12 − 1)d = 75 + 11 × 35. Multiply 11 × 35 then add 75.`,
        isError: true,
      });
    }
  }

  // Step 4 Check: Sum of 12 checkpoints for total fuel
  function verifyStep4() {
    const val = parseInt(step4Input, 10);
    if (val === MISSION_BRIEF.expectedS12) {
      const updated = [...stepDone];
      updated[3] = true;
      setStepDone(updated);
      setFeedback({
        text: `✓ Mission Success! S₁₂ = 12/2 × (75 + 460) = 6 × 535 = 3210 fuel units confirmed!`,
        isError: false,
      });
      if (onComplete) onComplete();
    } else {
      setFeedback({
        text: `Incorrect. Sum formula: S₁₂ = 12/2 × (T₁ + T₁₂) = 6 × (75 + 460). 6 × 535 = ?`,
        isError: true,
      });
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h2 className="station-title">
          <span>🎛️</span> Station 3: Mission Control Console
        </h2>
        <span
          className="station-round-badge"
          style={{
            borderColor: stepDone.every(Boolean) ? '#10b981' : '#38bdf8',
            color: stepDone.every(Boolean) ? '#10b981' : '#38bdf8',
          }}
        >
          {stepDone.every(Boolean) ? '🚀 All 4 Stages Synchronized!' : `Stage ${currentStep + 1} of 4`}
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="console-stepper">
        {['1. Verify Gap Rate', '2. Solve First Term (a)', '3. Predict Docking T12', '4. Confirm Fuel Sum (S12)'].map(
          (label, idx) => (
            <div
              key={idx}
              className={`console-step-indicator ${currentStep === idx ? 'active' : ''} ${
                stepDone[idx] ? 'completed' : ''
              }`}
              onClick={() => idx <= currentStep || stepDone[idx] ? setCurrentStep(idx) : null}
            >
              <span className="step-num">{stepDone[idx] ? '✓' : idx + 1}</span>
              <span>{label}</span>
            </div>
          )
        )}
      </div>

      {/* Grid: Console Workspace & Telemetry Visualizer */}
      <div className="station-grid-2col">
        {/* Left Column: Active Step Interactive Panel */}
        <div className="station-col-left">
          {/* Mission Brief Card */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(30, 41, 59, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
              MISSION LOG BRIEF #MC-774
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#f8fafc' }}>
              Radar confirms <strong style={{ color: '#fbbf24' }}>Checkpoint T3 = 145m</strong> and{' '}
              <strong style={{ color: '#fbbf24' }}>Checkpoint T7 = 285m</strong>. Rocket Nova-7 must dock at Checkpoint 12!
            </p>
          </div>

          {/* STAGE 1: VERIFY RATE OF CHANGE */}
          {currentStep === 0 && (
            <div className="control-card anim-slide-up">
              <span className="control-title">Stage 1: Verify Common Difference (d)</span>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                Calculate the rate of altitude gain per checkpoint:
                <br />
                Altitude change = 285m − 145m = <strong>140m</strong>.
                <br />
                Number of intervals = Checkpoint 7 − Checkpoint 3 = <strong>4 intervals</strong>.
              </p>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="number"
                  placeholder="Enter difference d"
                  value={step1Input}
                  onChange={(e) => setStep1Input(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    width: '180px',
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={verifyStep1}>
                  Verify Rate ➔
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: SOLVE FOR FIRST TERM a */}
          {currentStep === 1 && (
            <div className="control-card anim-slide-up">
              <span className="control-title">Stage 2: Solve Initial Altitude (a)</span>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                We know <strong>d = 35m</strong> and Checkpoint 3 is <strong>T₃ = 145m</strong>.
                <br />
                Formula: T₃ = a + 2d ➔ 145 = a + 2(35) = a + 70.
              </p>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="number"
                  placeholder="Enter initial altitude a"
                  value={step2Input}
                  onChange={(e) => setStep2Input(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    width: '180px',
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={verifyStep2}>
                  Solve a ➔
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: PREDICT DOCKING T12 */}
          {currentStep === 2 && (
            <div className="control-card anim-slide-up">
              <span className="control-title">Stage 3: Predict Docking Checkpoint T12</span>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                With <strong>a = 75m</strong> and <strong>d = 35m</strong>, predict altitude at Checkpoint 12:
                <br />
                Formula: T₁₂ = a + (12 − 1)d = 75 + 11(35).
              </p>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="number"
                  placeholder="Enter predicted T12"
                  value={step3Input}
                  onChange={(e) => setStep3Input(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    width: '180px',
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={verifyStep3}>
                  Predict T12 ➔
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: CONFIRM TOTAL FUEL SUM */}
          {currentStep === 3 && (
            <div className="control-card anim-slide-up">
              <span className="control-title">Stage 4: Confirm Total Fuel Burn (S12)</span>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                Compute total fuel burned across the first 12 checkpoints:
                <br />
                S₁₂ = 12/2 × (First + Last) = 6 × (75 + 460).
              </p>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                <input
                  type="number"
                  placeholder="Enter total fuel S12"
                  value={step4Input}
                  onChange={(e) => setStep4Input(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    width: '180px',
                  }}
                />
                <button className="btn btn-primary btn-sm" onClick={verifyStep4}>
                  Confirm Fuel 🚀
                </button>
              </div>
            </div>
          )}

          {/* Feedback message banner */}
          {feedback.text && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
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

        {/* Right Column: Live Telemetry Graph & Synthesis Display */}
        <div className="station-col-right">
          <TelemetryGraph
            points={telemetryPoints}
            targetValue={460}
            targetIndex={12}
            highlightIndex={currentStep === 2 ? 12 : 7}
            width={480}
            height={220}
            title="CHAINED MISSION CONSOLE TELEMETRY"
          />

          {/* Dynamic Telemetry Status Readout */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#94a3b8' }}>COMMON DIFFERENCE (d):</span>
              <strong style={{ color: stepDone[0] ? '#10b981' : '#64748b' }}>
                {stepDone[0] ? '+35m / step' : 'Uncalculated'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#94a3b8' }}>STARTING ALTITUDE (a):</span>
              <strong style={{ color: stepDone[1] ? '#10b981' : '#64748b' }}>
                {stepDone[1] ? '75m' : 'Uncalculated'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#94a3b8' }}>DOCKING ALTITUDE (T12):</span>
              <strong style={{ color: stepDone[2] ? '#10b981' : '#64748b' }}>
                {stepDone[2] ? '460m' : 'Uncalculated'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#94a3b8' }}>TOTAL FUEL CONSUMPTION (S12):</span>
              <strong style={{ color: stepDone[3] ? '#fbbf24' : '#64748b' }}>
                {stepDone[3] ? '3210 Units' : 'Uncalculated'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
