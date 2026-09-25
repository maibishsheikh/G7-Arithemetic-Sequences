# ProgressionQuest · Mission Control Cadets
**Grade 7 / Secondary 1 · Arithmetic Sequences**

ProgressionQuest is an immersive, space-themed gamified educational simulation designed to give Grade 7 students the formal toolkit for arithmetic sequences — naming the first term ($a$) and common difference ($d$), verifying sequences across every gap, applying the general term formula $T_n = a + (n - 1)d$, solving for unknowns, interpolating missing readings, calculating arithmetic means, testing flight-path membership, and computing total mission fuel burns ($S_n$).

---

## 🚀 The 5-Phase Pedagogical Journey

1. **Wonder Phase** — *Mission Control Telemetry Alert!*
   - Rocket Nova-7 loses radar lock after Checkpoint 5; reading 6 is corrupted static.
   - Interactive sequence strip showing readings: $14, 22, 30, 38, 46, ?$

2. **Story Phase** — *4 Panels with Ishaan, Xin Yi & Orbit the Mission Bot*
   - Panel 1: *Signal Lost* — Emergency alert at Mission Control.
   - Panel 2: *Naming the Pattern* — Orbit introduces $a$, $d$, and the golden rule: **Check EVERY consecutive gap!**
   - Panel 3: *The Trajectory Formula* — General term formula $T_n = a + (n - 1)d$ with negative-$d$ descent examples.
   - Panel 4: *Reading Six, Recovered* — Calculating $T_6 = 14 + 5(8) = 54\text{m}$, restoring radar lock!

3. **Simulate Phase** — *4 Required Mission Stations + 5th Bonus Sandbox*
   - **Station 1: Telemetry Tower Lab** *(Concept Discovery Lab)* — Pure free-play exploration of $a$ and $d$ (including negative values) with live animated rocket and real-time SVG telemetry graph.
   - **Station 2: Checkpoint Calibration** *(Build-to-Target Challenge)* — 3 escalating calibration rounds: Round 1 (ascent), Round 2 (retro-burn descent with negative $d$), Round 3 ($T_{12}$ formula challenge).
   - **Station 3: Mission Control Console** *(Composite Construction)* — 4 chained stages: Verify gap rate $\rightarrow$ Solve $a$ $\rightarrow$ Predict docking $T_{12}$ $\rightarrow$ Confirm fuel sum $S_{12}$.
   - **Station 4: Anomaly in the Data Feed** *(Error-Detective)* — Multi-round diagnostic challenge spotting corrupted checkpoints (outliers, later-gap failures, sign inversions).
   - **Station 5: Mission Simulator Sandbox** *(Optional 5th Layer)* — Open free-flight sandbox unlocked after stations 1–4, simulating burns with auto-computed mission statistics ($S_n$, average altitude, trajectory slope).

4. **Practice Phase (Play)** — *10 Worlds × 10 Questions = 100 Procedural Challenges*
   - Guided Practice, Independent Mode, Timed Challenge (60s), and Anomaly Boss Battles (5Q / 3 lives).
   - ProgressionVisual component rendering sequence strips, formula breakdowns, interpolation gaps, and telemetry readouts.

5. **Reflect Phase** — *Debrief & Cadet Wings*
   - 3 misconception-focused recap questions (verifying every gap, negative $d$, why $(n-1)$).
   - Reflection journal and Flight Wings certification scorecard.

---

## 🛠️ Tech Stack & Architecture

- **Core:** React 19, Vite 8, Vanilla CSS & Tailwind CSS tokens.
- **Visuals:** Custom responsive SVG coordinate plots (`TelemetryGraph.jsx`), animated rocket burn engine, interactive sequence strips.
- **Audio Pipeline:** ElevenLabs Alice voice profile (`scripts/generate_audio.js`), zero-latency Web Audio API sound synthesizer fallback.
- **Gamification:** Reactive badge engine, 10 World Bosses, XP & streak multipliers.

---

## 💻 Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run Oxlint
npm run lint

# Build production bundle
npm run build
```
