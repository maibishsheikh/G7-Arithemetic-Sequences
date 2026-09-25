// src/data/storyContent.js
// Story content for ProgressionQuest: Grade 7 Arithmetic Sequences
// Defined per PRD §8.2 & TRD §4.3

export const STORY_PANELS = [
  {
    panel: 0,
    title: "Signal Lost",
    character: "Xin Yi",
    characterEmoji: "👧🏻",
    text: "Mission Control Cadets Ishaan and Xin Yi just took over monitoring Rocket Nova-7 when an amber telemetry alarm flashed! The altitude readings for checkpoints 1 through 5 arrived cleanly: 14m, 22m, 30m, 38m, 46m... but Checkpoint 6 is garbled static. If the trajectory follows a steady mathematical pattern, can the cadets recover the missing reading?",
    highlight: "Checkpoint 1 to 5: 14, 22, 30, 38, 46... Reading 6 is CORRUPTED!",
    imageBg: "radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%)",
    imageEmoji: "📡",
    telemetry: [14, 22, 30, 38, 46, null],
  },
  {
    panel: 1,
    title: "Naming the Pattern",
    character: "Orbit the Mission Bot",
    characterEmoji: "🤖",
    text: "'Hold your thrusters!' beeps Orbit the Mission Bot. 'Xin Yi, you only checked the gap between the first two readings (22 − 14 = 8). At Mission Control, we check EVERY consecutive pair: 30 − 22 = 8, 38 − 30 = 8, 46 − 38 = 8! The starting altitude is the first term, a = 14. The constant step is the common difference, d = +8. That confirms a genuine Arithmetic Progression!'",
    highlight: "Golden Rule: Always check EVERY consecutive gap, not just the first!",
    imageBg: "radial-gradient(circle at center, #172554 0%, #090d16 100%)",
    imageEmoji: "🔍",
    telemetry: [14, 22, 30, 38, 46],
  },
  {
    panel: 2,
    title: "The Trajectory Formula",
    character: "Ishaan",
    characterEmoji: "🧑🏽",
    text: "'Instead of adding eight by hand over and over,' Ishaan calculates, 'we use the General Term Formula: Tn = a + (n − 1)d! To reach checkpoint n, we start at a and add (n − 1) steps of size d. Orbit notes that d can also be negative: during descent, a rocket with a = 50 and d = −6 goes 50, 44, 38... Negative differences are completely normal in flight!'",
    highlight: "General Term Formula: Tₙ = a + (n − 1)d. Notice d can be negative!",
    imageBg: "radial-gradient(circle at center, #311042 0%, #090d16 100%)",
    imageEmoji: "🧮",
    formula: "T_n = a + (n - 1)d",
  },
  {
    panel: 3,
    title: "Reading Six, Recovered",
    character: "Orbit the Mission Bot",
    characterEmoji: "🤖",
    text: "'Let us calculate Checkpoint 6!' beams Xin Yi. With a = 14, d = 8, and n = 6: T₆ = 14 + (6 − 1) × 8 = 14 + 40 = 54 meters! Telemetry sends the ping to radar. Confirmation received: 54m on target! Mission Control confirms Rocket Nova-7 is safe in orbit. Cadets Ishaan and Xin Yi are cleared for full simulation flight!",
    highlight: "T₆ = 14 + (5 × 8) = 54m. Radar locked. Telemetry restored!",
    imageBg: "radial-gradient(circle at center, #064e3b 0%, #090d16 100%)",
    imageEmoji: "🚀",
    telemetry: [14, 22, 30, 38, 46, 54],
  },
];
