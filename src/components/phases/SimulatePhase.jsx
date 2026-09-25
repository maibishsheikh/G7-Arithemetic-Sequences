// src/components/phases/SimulatePhase.jsx
// Simulate Phase for ProgressionQuest: 4 Required Stations + 5th Optional Sandbox
// Defined per PRD §8.3 & TRD §1.4, §6

import React, { useEffect, useRef } from 'react';
import './SimulatePhase.css';
import TelemetryTowerLab from '../simulations/TelemetryTowerLab.jsx';
import CheckpointCalibration from '../simulations/CheckpointCalibration.jsx';
import MissionControlConsole from '../simulations/MissionControlConsole.jsx';
import AnomalyInTheDataFeed from '../simulations/AnomalyInTheDataFeed.jsx';
import MissionSimulatorSandbox from '../simulations/MissionSimulatorSandbox.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { simStationIntro } from '../../utils/narration.js';

const STATIONS = [
  { id: 0, label: 'A', name: 'Telemetry Tower',        icon: '📡', desc: 'Explore first term a & common difference d' },
  { id: 1, label: 'B', name: 'Checkpoint Calibration',  icon: '🎯', desc: 'Calibrate trajectories across 3 escalating rounds' },
  { id: 2, label: 'C', name: 'Mission Control Console', icon: '🎛️', desc: 'Chained 4-stage flight calculation console' },
  { id: 3, label: 'D', name: 'Anomaly Detective',       icon: '🔍', desc: 'Identify & repair corrupted telemetry readings' },
  { id: 4, label: '★', name: 'Mission Simulator',       icon: '🌌', desc: 'Open free-flight simulation sandbox', isOptional: true },
];

export default function SimulatePhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const prevStation = useRef(-1);

  const s = state?.currentSimStation || 0;
  const reqDone = state?.simStationsComplete?.slice(0, 4).every(Boolean) || false;
  const isSandboxUnlocked = reqDone;

  useEffect(() => {
    if (prevStation.current !== s) {
      prevStation.current = s;
      stopAll();
      setTimeout(() => narrate(simStationIntro(s)), 400);
    }
  }, [s, narrate, stopAll]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  function handleStationComplete(stationIdx) {
    stopAll();
    dispatch({ type: 'COMPLETE_SIM_STATION', payload: stationIdx });

    // Auto-advance to next station if completing 0, 1, or 2
    if (stationIdx < 3) {
      setTimeout(() => dispatch({ type: 'ADVANCE_SIM_STATION' }), 600);
    }
    // If completing station 3 (the 4th required station), unlock sandbox and offer Practice
  }

  function goToPrev() {
    stopAll();
    dispatch({ type: 'PREV_SIM_STATION' });
  }

  function goToNext() {
    stopAll();
    dispatch({ type: 'ADVANCE_SIM_STATION' });
  }

  function selectStation(targetId) {
    // Prevent jumping to locked stations
    if (targetId === 4 && !isSandboxUnlocked) return;
    if (targetId > s && !state?.simStationsComplete?.[s]) return;

    stopAll();
    if (targetId > s) {
      for (let i = 0; i < targetId - s; i++) dispatch({ type: 'ADVANCE_SIM_STATION' });
    } else if (targetId < s) {
      for (let i = 0; i < s - targetId; i++) dispatch({ type: 'PREV_SIM_STATION' });
    }
  }

  return (
    <div className="sim-wrap">
      <div className="sim-card glass-card">
        {/* Stations Tab Bar */}
        <div className="sim-tabs" role="tablist">
          {STATIONS.map((st) => {
            const isSelected = s === st.id;
            const isDone = state?.simStationsComplete?.[st.id];
            const isDisabled = st.id === 4 ? !isSandboxUnlocked : (st.id > s && !state?.simStationsComplete?.[s]);

            return (
              <button
                key={st.id}
                role="tab"
                aria-selected={isSelected}
                className={`sim-tab ${isSelected ? 'active' : ''} ${isDone ? 'done' : ''} ${st.isOptional ? 'optional-tab' : ''}`}
                style={st.isOptional ? { borderColor: isSandboxUnlocked ? '#a78bfa' : 'rgba(255, 255, 255, 0.1)' } : {}}
                onClick={() => selectStation(st.id)}
                aria-label={`Station ${st.label}: ${st.name}`}
                disabled={isDisabled}
              >
                <span className="tab-icon">
                  {st.id === 4 ? (isSandboxUnlocked ? '🌌' : '🔒') : isDone ? '✅' : st.icon}
                </span>
                <span className="tab-name">
                  {st.name} {st.isOptional ? '(Sandbox)' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Station Content Area */}
        <div className="sim-station-area" role="tabpanel" key={s}>
          {s === 0 && (
            <TelemetryTowerLab
              onComplete={() => handleStationComplete(0)}
              audioEnabled={state?.audioEnabled}
            />
          )}
          {s === 1 && (
            <CheckpointCalibration
              onComplete={() => handleStationComplete(1)}
              audioEnabled={state?.audioEnabled}
            />
          )}
          {s === 2 && (
            <MissionControlConsole
              onComplete={() => handleStationComplete(2)}
              audioEnabled={state?.audioEnabled}
            />
          )}
          {s === 3 && (
            <AnomalyInTheDataFeed
              onComplete={() => handleStationComplete(3)}
              audioEnabled={state?.audioEnabled}
            />
          )}
          {s === 4 && (
            <MissionSimulatorSandbox />
          )}
        </div>

        {/* Footer Navigation */}
        <div className="sim-footer">
          <button className="btn btn-outline btn-sm" onClick={goToPrev} disabled={s === 0}>
            ← Previous Station
          </button>

          <div className="sim-progress-dots">
            {STATIONS.map((st) => (
              <span
                key={st.id}
                className={`sim-dot ${s === st.id ? 'active' : ''} ${
                  state?.simStationsComplete?.[st.id] ? 'done' : ''
                } ${st.isOptional ? 'optional-dot' : ''}`}
                title={st.name}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Show Next Station or Sandbox Jump */}
            {s < 3 ? (
              <button
                className={state?.simStationsComplete?.[s] ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                onClick={goToNext}
                disabled={!state?.simStationsComplete?.[s]}
              >
                Next Station →
              </button>
            ) : s === 3 && isSandboxUnlocked ? (
              <button
                className="btn btn-outline btn-sm"
                style={{ borderColor: '#a78bfa', color: '#c4b5fd' }}
                onClick={() => selectStation(4)}
              >
                Free Flight Sandbox 🌌
              </button>
            ) : null}

            {/* Practice Button unlocked once 4 required stations are done */}
            {reqDone && (
              <button
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}
                onClick={() => {
                  stopAll();
                  dispatch({ type: 'COMPLETE_PHASE', payload: 'simulate' });
                  dispatch({ type: 'SET_PHASE', payload: 'play' });
                }}
              >
                Practice! 🎮
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
