// src/config/characters.config.js
// Characters and Mascot for ProgressionQuest
// Defined per PRD §7 & TRD §4.2

export const CHARACTERS = {
  ishaan: {
    name: "Ishaan",
    role: "The meticulous checker",
    emoji: "🧑🏽",
    colour: "var(--char-1)",
    mascotEmoji: "🤖",
    bio: "Always checks every consecutive gap in the telemetry data before trusting a pattern."
  },
  xinYi: {
    name: "Xin Yi",
    role: "The confident quick-solver",
    emoji: "👧🏻",
    colour: "var(--char-2)",
    mascotEmoji: "🤖",
    bio: "Fast, energetic, but learns the hard way not to jump to conclusions after only checking the first gap!"
  },
  orbit: {
    name: "Orbit the Mission Bot",
    role: "Mascot & Mission AI",
    emoji: "🤖",
    colour: "var(--mascot)",
    mascotEmoji: "🤖",
    bio: "Mission Control's intelligent flight computer guiding cadets through telemetry diagnostics."
  },
};

export const MASCOT = {
  name: "Orbit the Mission Bot",
  emoji: "🤖",
  subtitle: "Mission Control Flight Computer",
};
