// src/utils/narration.js
// Narration script builder for ProgressionQuest: Mission Control Cadets
// Compliant with PRD §11 & TRD §8 rules

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    cheer("Mission Control Telemetry Alert! Cadet, we need your diagnostics."),
    say("Rocket Nova-7 just sent five clean altitude readings: fourteen, twenty-two, thirty, thirty-eight, and forty-six meters."),
    ask("Reading six is corrupted static! Can you calculate the exact missing altitude?"),
    cheer("Let us investigate the flight data and unlock arithmetic sequences!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    // Panel 0: Signal Lost
    [
      say("Cadets Ishaan and Xin Yi just started their shift when Rocket Nova-7's telemetry stream flashed yellow."),
      say("Checkpoints one through five arrived cleanly: fourteen, twenty-two, thirty, thirty-eight, and forty-six meters."),
      think("Reading six is garbled in cosmic static. Can we calculate what it should be?"),
    ],
    // Panel 1: Naming the Pattern
    [
      instruct("Hold your thrusters, warns Orbit the Mission Bot. Never check only the first gap!"),
      say("In Mission Control, we verify every single consecutive gap to confirm a constant difference."),
      emphasize("The starting altitude is the first term, a. The constant step is the common difference, d."),
      cheer("Since every gap is plus eight, this is a genuine Arithmetic Progression!"),
    ],
    // Panel 2: The Trajectory Formula
    [
      say("Ishaan reveals the shortcut: the n-th term equals the first term, plus, n minus one, groups of the common difference!"),
      instruct("Notice that when a rocket descends, the common difference is a negative number."),
      say("A descent with first term fifty and a common difference of negative six decreases cleanly: fifty, forty-four, thirty-eight."),
    ],
    // Panel 3: Reading Six, Recovered
    [
      cheer("Let us compute Checkpoint six! The first term is fourteen, common difference is eight, and position is six."),
      say("Fourteen plus five groups of eight equals fourteen plus forty, giving fifty-four meters!"),
      cheer("Radar confirms fifty-four meters exact! Welcome to the Flight Deck, Cadets!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    // Station 0: Telemetry Tower Lab
    [
      instruct("Welcome to Station One — Telemetry Tower Lab!"),
      instruct("Tune the first term, a, and common difference, d. Explore five distinct combinations to unlock clearance!"),
    ],
    // Station 1: Checkpoint Calibration
    [
      instruct("Welcome to Station Two — Checkpoint Calibration!"),
      instruct("Calibrate initial altitude and burn rate to hit the target checkpoint reading across three escalating rounds."),
    ],
    // Station 2: Mission Control Console
    [
      instruct("Welcome to Station Three — Mission Control Console!"),
      instruct("Work through four chained stages: verify the gap rate, solve for the first term, predict Checkpoint twelve, and confirm total fuel burn."),
    ],
    // Station 3: Anomaly Detective
    [
      instruct("Welcome to Station Four — Anomaly in the Data Feed!"),
      instruct("Inspect the telemetry stream, click the corrupted checkpoint, and enter the correct reading to restore radar lock."),
    ],
    // Station 4: Sandbox
    [
      cheer("Welcome to the Mission Simulator Sandbox!"),
      instruct("Freely tune your flight parameters, launch rocket burns, and observe total trajectory statistics."),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function simRoundIntro(stationIdx, roundIdx) {
  return [instruct(`Starting diagnostic round ${roundIdx + 1}! Check the telemetry readings carefully.`)];
}

export function simStepComplete(stationIdx, stepIdx) {
  return [cheer(`Stage ${stepIdx + 1} locked and verified! Trajectory data feeding into next stage.`)];
}

export function playQuestionNarration(questionText) {
  return [say(questionText)];
}

export function playCorrectNarration(streak) {
  if (streak >= 10) return [cheer("Outstanding! Ten in a row, cadet! Your telemetry instincts are unmatched!")];
  if (streak >= 5)  return [cheer("Five streak locked! Steady telemetry stream maintainer!")];
  if (streak >= 3)  return [cheer("Three in a row! Excellent precision!")];
  return [cheer("Spot on! Checkpoint verified!")];
}

export function playWrongNarration() {
  return [encourage("Signal glitch! Review the common difference formula and check every gap carefully.")];
}

export function playHint1Narration() {
  return [think("Mission advisory: Check the first term a and the gap between consecutive readings.")];
}

export function playHint2Narration() {
  return [think("Flight computer hint: Use the formula: the n-th term equals the first term plus n minus one times d.")];
}

export function districtCompleteNarration() {
  return [cheer("World mission sector cleared! You have unlocked a new telemetry star!")];
}

export function reflectNarration() {
  return [
    instruct("Welcome to the Flight Integrity Review debriefing."),
    say("Review the core mathematical habits: check every gap, and remember that common differences can be negative."),
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Mission accomplished, Cadet! You have achieved complete Mastery of Arithmetic Sequences!"),
  ];
}

export function bossStartNarration() {
  return [
    instruct("Warning: Anomaly Boss detected! Defeat the boss to restore signal integrity!"),
  ];
}

export function bossWinNarration() {
  return [
    cheer("Anomaly resolved and Boss defeated! Outstanding mission flying, Cadet!"),
  ];
}

