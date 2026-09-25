// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications and PRD §11 narration rules.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log("\n⚠️ Note: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.");
  console.log("Audio generation script prepared for when an API key is supplied.\n");
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

export const phrases = [
  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "Mission Control Telemetry Alert! Cadet, we need your diagnostics.", style: 'celebration' },
  { text: "Rocket Nova-7 just sent five clean altitude readings: fourteen, twenty-two, thirty, thirty-eight, and forty-six meters.", style: 'statement' },
  { text: "Reading six is corrupted static! Can you calculate the exact missing altitude?", style: 'question' },
  { text: "Let us investigate the flight data and unlock arithmetic sequences!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 0 ────────────────────────────────────────────────
  { text: "Cadets Ishaan and Xin Yi just started their shift when Rocket Nova-7's telemetry stream flashed yellow.", style: 'statement' },
  { text: "Checkpoints one through five arrived cleanly: fourteen, twenty-two, thirty, thirty-eight, and forty-six meters.", style: 'statement' },
  { text: "Reading six is garbled in cosmic static. Can we calculate what it should be?", style: 'thinking' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Hold your thrusters, warns Orbit the Mission Bot. Never check only the first gap!", style: 'instruction' },
  { text: "In Mission Control, we verify every single consecutive gap to confirm a constant difference.", style: 'statement' },
  { text: "The starting altitude is the first term, a. The constant step is the common difference, d.", style: 'emphasis' },
  { text: "Since every gap is plus eight, this is a genuine Arithmetic Progression!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Ishaan reveals the shortcut: the n-th term equals the first term, plus, n minus one, groups of the common difference!", style: 'statement' },
  { text: "Notice that when a rocket descends, the common difference is a negative number.", style: 'instruction' },
  { text: "A descent with first term fifty and a common difference of negative six decreases cleanly: fifty, forty-four, thirty-eight.", style: 'statement' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Let us compute Checkpoint six! The first term is fourteen, common difference is eight, and position is six.", style: 'celebration' },
  { text: "Fourteen plus five groups of eight equals fourteen plus forty, giving fifty-four meters!", style: 'statement' },
  { text: "Radar confirms fifty-four meters exact! Welcome to the Flight Deck, Cadets!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station One — Telemetry Tower Lab!", style: 'instruction' },
  { text: "Tune the first term, a, and common difference, d. Explore five distinct combinations to unlock clearance!", style: 'instruction' },
  { text: "Welcome to Station Two — Checkpoint Calibration!", style: 'instruction' },
  { text: "Calibrate initial altitude and burn rate to hit the target checkpoint reading across three escalating rounds.", style: 'instruction' },
  { text: "Welcome to Station Three — Mission Control Console!", style: 'instruction' },
  { text: "Work through four chained stages: verify the gap rate, solve for the first term, predict Checkpoint twelve, and confirm total fuel burn.", style: 'instruction' },
  { text: "Welcome to Station Four — Anomaly in the Data Feed!", style: 'instruction' },
  { text: "Inspect the telemetry stream, click the corrupted checkpoint, and enter the correct reading to restore radar lock.", style: 'instruction' },
  { text: "Welcome to the Mission Simulator Sandbox!", style: 'celebration' },
  { text: "Freely tune your flight parameters, launch rocket burns, and observe total trajectory statistics.", style: 'instruction' },

  // ─── FEEDBACK & PRAISE ───────────────────────────────────────────────────
  { text: "Outstanding! Ten in a row, cadet! Your telemetry instincts are unmatched!", style: 'celebration' },
  { text: "Five streak locked! Steady telemetry stream maintainer!", style: 'celebration' },
  { text: "Three in a row! Excellent precision!", style: 'celebration' },
  { text: "Spot on! Checkpoint verified!", style: 'celebration' },
  { text: "Signal glitch! Review the common difference formula and check every gap carefully.", style: 'encouragement' },
  { text: "Mission advisory: Check the first term a and the gap between consecutive readings.", style: 'thinking' },
  { text: "Flight computer hint: Use the formula: the n-th term equals the first term plus n minus one times d.", style: 'thinking' },
  { text: "World mission sector cleared! You have unlocked a new telemetry star!", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Flight Integrity Review debriefing.", style: 'instruction' },
  { text: "Review the core mathematical habits: check every gap, and remember that common differences can be negative.", style: 'statement' },
  { text: "Mission accomplished, Cadet! You have achieved complete Mastery of Arithmetic Sequences!", style: 'celebration' },
];

async function generateAudioFiles() {
  if (!apiKey) {
    console.log("Skipping actual generation — API key missing.");
    return;
  }

  const outputDir = path.resolve('public/assets/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 45);
    const filename = `audio_${cleanName}_${i}.mp3`;
    const outputPath = path.join(outputDir, filename);

    console.log(`[${i + 1}/${phrases.length}] Generating: "${text.slice(0, 40)}..."`);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
        }),
      });

      if (!response.ok) {
        console.error(`Error generating audio for: "${text}":`, response.status, response.statusText);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);
      audioMap[text] = `/assets/audio/${filename}`;
    } catch (err) {
      console.error(`Failed to generate audio for: "${text}":`, err.message);
    }
  }

  // Update src/utils/audioMap.js
  const audioMapPath = path.resolve('src/utils/audioMap.js');
  const code = `// Auto-generated by scripts/generate_audio.js\nexport const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(audioMapPath, code, 'utf-8');
  console.log(`\nUpdated audioMap.js successfully.`);
}

if (process.argv[1]?.endsWith('generate_audio.js')) {
  generateAudioFiles();
}
