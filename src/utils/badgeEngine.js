// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for ProgressionQuest: Mission Control Cadets
// Defined per PRD §10 & TRD §7

export const BADGES = [
  {
    id: 'first_signal',
    icon: '📡',
    label: 'First Signal Locked',
    description: 'Answered your first telemetry question correctly!',
  },
  {
    id: 'steady_telemetry',
    icon: '📈',
    label: 'Steady Telemetry',
    description: 'Maintained a 5-question consecutive telemetry streak!',
  },
  {
    id: 'flight_streak',
    icon: '🔥',
    label: 'Flight-Ready Streak',
    description: 'Achieved an incredible 10-answer telemetry streak!',
  },
  {
    id: 'full_mission_kit',
    icon: '🧰',
    label: 'Full Mission Kit',
    description: 'Completed all 4 required Mission Control simulation stations!',
  },
  {
    id: 'checkpoint_cleared',
    icon: '⭐',
    label: 'Checkpoint Cleared',
    description: 'Scored 3 stars in a Practice World!',
  },
  {
    id: 'anomaly_resolved',
    icon: '🛠️',
    label: 'Anomaly Resolved',
    description: 'Defeated a World Boss in battle and cleared the anomaly!',
  },
  {
    id: 'veteran_cadet',
    icon: '🎖️',
    label: 'Veteran Cadet',
    description: 'Answered 20 or more telemetry questions in Practice!',
  },
  {
    id: 'mission_commander',
    icon: '🚀',
    label: 'Mission Commander Badge',
    description: 'Completed the full 5-phase journey of ProgressionQuest!',
  },
];

export function checkBadges(state) {
  const unlocked = [];

  // 1. First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_signal');

  // 2. Streaks
  if (state.maxStreak >= 5) unlocked.push('steady_telemetry');
  if (state.maxStreak >= 10) unlocked.push('flight_streak');

  // 3. All 4 Simulate stations complete (scoped strictly to first 4 per TRD §1.4, §7)
  if (
    state.simStationsComplete &&
    state.simStationsComplete.slice(0, 4).every(Boolean)
  ) {
    unlocked.push('full_mission_kit');
  }

  // 4. 3-star checkpoint cleared
  if (
    state.districtScores &&
    state.districtScores.some((score) => score !== null && score >= 9)
  ) {
    unlocked.push('checkpoint_cleared');
  }

  // 5. Boss battle won
  if (state.bossDefeated) {
    unlocked.push('anomaly_resolved');
  }

  // 6. Veteran Cadet (20+ questions answered)
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('veteran_cadet');
  }

  // 7. Full 5-phase journey complete
  if (
    state.phaseComplete &&
    state.phaseComplete.wonder &&
    state.phaseComplete.story &&
    state.phaseComplete.simulate &&
    state.phaseComplete.play &&
    state.phaseComplete.reflect
  ) {
    unlocked.push('mission_commander');
  }

  return unlocked;
}
