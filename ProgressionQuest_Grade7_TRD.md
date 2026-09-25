# ProgressionQuest — Module TRD
**Grade 7 · Arithmetic Sequences**
*(Technical companion to `ProgressionQuest_Grade7_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `progression-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling — `equation-quest-main`, `pattern-quest-main`, or `mosaic-quest-main` — is designated as the actual clone source at build time.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, but confirm against the actual clone source.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally, across **9 distinct concept generators** (World 9 is composed from the other 9, not its own generator) — the widest concept spread of any module built so far.
4. **Hardcoded "exactly 4 Simulate stations" assumption.** This is the module-specific gotcha to add this time: the reference's `SimulatePhase.jsx` almost certainly assumes exactly 4 stations for its tab bar, progress dots, and `COMPLETE_SIM_STATION`/phase-advance gating logic. This module needs those 4 slots kept intact (so the gate logic is untouched) **plus a 5th, separately-gated, non-blocking tab** for the Mission Simulator sandbox (§6) — check carefully whether the reference's tab-bar component can take a 5th item without hardcoding breaking, and whether the "all stations complete → advance" check can be scoped to just the first 4 indices rather than "all tabs."
5. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
6. **Leftover branding strings.** Check `index.html`'s `<title>` and `README.md` for stale references from whichever module was actually cloned, including leftover mascot/character references from any of the three prior Grade 7 modules.

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim (same dependency versions as the three prior Grade 7 TRDs). `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is.

## 3. Folder Structure

```
progression-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Orbit the Mission Bot)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   ├── TelemetryGraph.jsx           # NEW — shared live altitude/time graph, reused across Story panel 4's worked example, all 4 required stations, and the sandbox — §5.2
│   │   │   └── ProgressionVisual.jsx        # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import ProgressionVisual
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY substantially: 4 required station imports/labels + 5th optional sandbox tab, gating logic scoped to first 4 — §6
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── TelemetryTowerLab.jsx        # NEW — Concept Discovery Lab (pure free-play + optional bonus rounds) — §6
│   │       ├── CheckpointCalibration.jsx    # NEW — Build-to-Target Challenge (3 escalating rounds) — §6
│   │       ├── MissionControlConsole.jsx    # NEW — Multi-Step/Composite Construction (4-stage chained console) — §6
│   │       ├── AnomalyInTheDataFeed.jsx     # NEW — Error-Detective (multi-round escalating subtlety) — §6
│   │       ├── MissionSimulatorSandbox.jsx  # NEW — optional 5th layer, free-play only, no scoring — §6
│   │       └── Stations.css                 # MODIFY: extend with rocket-animation, dial, and console-step visual classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Ishaan / Xin Yi / Orbit — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   └── progressionMath.js     # NEW — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.5 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "Reading the Telemetry", emoji: "📡", accent: "var(--world-0)",
    description: "Define an AP; identify first term a and common difference d",
    conceptFocus: "define-identify-ap",
    boss: { name: "The Static Signal", emoji: "📡", reward: "Telemetry Badge" } },
  { id: 1, name: "Mission Integrity Check", emoji: "⚠️", accent: "var(--world-1)",
    description: "Verify a sequence is arithmetic by checking every gap",
    conceptFocus: "verify-arithmetic-sequence",
    boss: { name: "The Rogue Reading", emoji: "⚠️", reward: "Integrity Badge" } },
  { id: 2, name: "The Trajectory Formula", emoji: "🧮", accent: "var(--world-2)",
    description: "Apply Tn = a + (n-1)d to find a specified term",
    conceptFocus: "general-term-formula",
    boss: { name: "The Formula Firewall", emoji: "🧮", reward: "Trajectory Badge" } },
  { id: 3, name: "Solve for the Unknown Stage", emoji: "❓", accent: "var(--world-3)",
    description: "Solve for a, d, or n given partial AP information",
    conceptFocus: "solve-for-a-d-n",
    boss: { name: "The Missing Variable", emoji: "❓", reward: "Solver's Badge" } },
  { id: 4, name: "Filling the Gaps", emoji: "🕳️", accent: "var(--world-4)",
    description: "Interpolate missing terms given two known non-adjacent terms",
    conceptFocus: "interpolate-missing-terms",
    boss: { name: "The Data Gap", emoji: "🕳️", reward: "Gap-Filler Badge" } },
  { id: 5, name: "Extra Checkpoints", emoji: "📍", accent: "var(--world-5)",
    description: "Insert arithmetic mean(s) between two given numbers",
    conceptFocus: "arithmetic-means",
    boss: { name: "The Checkpoint Guardian", emoji: "📍", reward: "Navigator Badge" } },
  { id: 6, name: "Is It on the Flight Path?", emoji: "🛰️", accent: "var(--world-6)",
    description: "Determine whether a number is a term of the sequence",
    conceptFocus: "test-membership",
    boss: { name: "The Flight Path Phantom", emoji: "🛰️", reward: "Tracker Badge" } },
  { id: 7, name: "Countdown to Launch", emoji: "⏱️", accent: "var(--world-7)",
    description: "Full multi-step real-world AP scenario",
    conceptFocus: "applied-multi-step-ap",
    boss: { name: "The Countdown Glitch", emoji: "⏱️", reward: "Launch Badge" } },
  { id: 8, name: "Total Burn", emoji: "⛽", accent: "var(--world-8)",
    description: "Find the sum of the first n terms (flagged extension)",
    conceptFocus: "sum-of-n-terms",
    boss: { name: "The Fuel Gauge Dragon", emoji: "⛽", reward: "Engineer's Badge" } },
  { id: 9, name: "Mission Control: Final Countdown", emoji: "🚀", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "Mission Commander Vega", emoji: "🚀", reward: "Chief Cadet Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  ishaan: { name: "Ishaan", role: "The meticulous checker", emoji: "🧑🏽", colour: "var(--char-1)", mascotEmoji: "🤖" },
  xinYi:  { name: "Xin Yi",  role: "The confident quick-solver", emoji: "👧🏻", colour: "var(--char-2)", mascotEmoji: "🤖" },
  orbit:  { name: "Orbit the Mission Bot", role: "Mascot & mentor", emoji: "🤖", colour: "var(--mascot)", mascotEmoji: "🤖" },
};
export const MASCOT = { name: "Orbit the Mission Bot", emoji: "🤖" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "Signal Lost," "Naming the Pattern," "The Trajectory Formula," "Reading Six, Recovered."

### 4.4 Question Bank — Procedural Generation

**`utils/progressionMath.js`** — pure helper functions shared by the question generator and all 5 Simulate layers:

| Function | Purpose |
|---|---|
| `pickCleanFirstTerm(range)` | Draws `a` from a curated display-friendly range. |
| `pickCleanCommonDifference(range, { allowNegative = true })` | Draws `d` from a curated nonzero pool; **negative values included by default** (not an edge case) per PRD §14's "healthy proportion of negative-d" requirement. |
| `generateArithmeticSequence(a, d, length)` | Produces `length` terms of an AP. |
| `generateNonArithmeticSequence(a, d, breakAtIndex)` | Produces a sequence that matches an AP for its first `breakAtIndex` gaps, then deliberately breaks — the **direct generation-level implementation of PRD §14's "must include sequences that break only at a later gap"** requirement, ensuring World 1's verify-every-gap skill is genuinely testable rather than trivially solvable by checking only the first pair. |
| `findTermAtPosition(a, d, n)` | Evaluates `Tn = a + (n-1)d`. |
| `solveForUnknown(known)` | Given any 2 of `{a, d, n, Tn}` (or two `(n, Tn)` pairs), solves for the rest — the shared engine behind Worlds 2, 3, and 4, and behind Mission Control Console's steps 2–3. |
| `interpolateTerms(term1, pos1, term2, pos2)` | Derives `a`/`d` from two known non-adjacent terms, then returns every term between them. |
| `insertArithmeticMeans(a, b, count)` | Returns `count` evenly-spaced values between `a` and `b` forming a valid AP with `a` and `b` as endpoints. |
| `isMemberOfSequence(a, d, target)` | Solves `a + (n-1)d = target` for `n`; returns `{ isMember, position }`, rejecting non-integer/non-positive `n`. |
| `sumOfNTerms(a, d, n)` | Computes `Sn = n/2(2a + (n-1)d)` — used by World 8 and Mission Control Console's step 4. |
| `formatGeneralTermString(a, d)` / `formatSumString(a, d, n)` | Render to display string and to the narration-ready spoken form per PRD §11. |

**"Clean number" constraints (hard requirements, not inline magic numbers):**
- Every generated sequence resolves to clean integer terms; `solveForUnknown` and `interpolateTerms` outputs are constrained to clean integers across all generation paths (including the simultaneous-equation-style two-term solve used in Worlds 3–4).
- `pickCleanCommonDifference` draws negative values roughly as often as positive ones across the bank as a whole — a generation-level requirement, not left to chance.
- `generateNonArithmeticSequence`'s `breakAtIndex` is varied across the full range of possible positions (not clustered at the first gap) so World 1's "false" examples don't accidentally make the "check only the first pair" shortcut look like it works.
- World 8 (`sumOfNTerms`) results are kept within a friendly, hand-checkable range appropriate for an enrichment audience — avoid needlessly huge sums that obscure the underlying pattern.

**`data/questionBank.js` generation:**
One or more template functions per `conceptFocus` (10 concept slugs from §4.1), producing the fixed schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`. Distractors are dominated by the two headline misconceptions from PRD §15 (checking only the first gap; assuming `d` must be positive), plus a secondary share of off-by-one errors in the formula (`n` vs. `n-1`) and the "Sn is just n × a" sum misconception for World 8. Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `ProgressionVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values: `"sequence-strip"` (terms + position labels), `"telemetry-readout"` (a compact static version of the shared telemetry graph, for inline question use), `"formula-breakdown"` (`Tn = a + (n-1)d` with each part colour-coded and text-labelled), `"interpolation-gap"` (a sequence strip with missing terms visually blanked).

### 5.2 `TelemetryGraph.jsx` *(new shared component, not in prior modules)*
A reusable live-updating altitude/checkpoint graph — plots `(position, term value)` pairs as the sequence is generated or manipulated. Props: `{ points, projected, highlightIndex, showTrendLine }`. This is the connective visual thread specified in PRD §8.3 across Story panel 4's worked example, all 4 required Simulate stations, and the sandbox — built once here and reused everywhere, rather than each station rolling its own graph. Always paired with numeric axis labels and a text trend description (PRD §12) — never a colour-only indicator of ascent/descent.

## 6. Simulate Station Specs — Rich, Multi-Layered (per PRD §8.3)

All components follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, live SVG/Canvas visuals themed with `design-tokens.css` variables, keyboard-operable +/− controls alongside any slider/drag interaction. This module's stations additionally carry **internal round/step state** (not present in the simpler single-pass stations of the three prior modules), so each station's local reducer needs a `currentRound`/`currentStep` field in addition to the platform-standard `completed` boolean.

| Component | Archetype | Internal structure | Completion gate |
|---|---|---|---|
| `TelemetryTowerLab.jsx` | Concept Discovery Lab | Two live controls (`a`, `d` — `d` explicitly spans negative values) drive `generateArithmeticSequence` + `TelemetryGraph` + a rocket-animation layer whose speed/direction responds to `d`'s sign and magnitude. An *optional*, clearly-separated "Mission Log Challenge" sub-panel offers 3 bonus prompts (checked via `findTermAtPosition`), fully skippable. | **Free exploration only** — no confirmation question, no bonus-round requirement. This is the module's deliberate resolution of the Concept Discovery Lab tension flagged in the three prior TRDs (see PRD §6, §15.5) — implemented here as "5+ distinct `(a,d)` combinations explored" rather than any answer-checking logic. |
| `CheckpointCalibration.jsx` | Build-to-Target Challenge | **3 sequential rounds**, each with its own target `(n, Tn)` pair and its own pass/fail state: Round 1 (positive `d`), Round 2 (negative `d`), Round 3 (larger `n`, rewarding formula use over trial-and-error — track attempt count and surface a "try the formula" hint if attempts exceed a threshold). Round state resets independently; overall station `completed` requires all 3 rounds cleared. | All 3 rounds passed; each round individually retry-able via its own "try another round" loop. |
| `MissionControlConsole.jsx` | Multi-Step/Composite Construction | **4 chained steps** sharing one piece of state (the current mission brief): (1) verify — call `generateArithmeticSequence`/gap-check logic against the two given readings; (2) solve — call `solveForUnknown` for `a`/`d`; (3) predict — call `findTermAtPosition` for the target checkpoint; (4) sum — call `sumOfNTerms` for total fuel. Each step's output is displayed as it's produced and feeds the next step's inputs; `TelemetryGraph` and the rocket animation update live after every step. | All 4 steps completed correctly in sequence; a step can be retried without resetting prior completed steps. |
| `AnomalyInTheDataFeed.jsx` | Error-Detective | **Multiple rounds of increasing subtlety**: Round 1's seeded error is visually obvious on the `TelemetryGraph` (an outlier point breaking the trend line clearly); later rounds seed errors that only break the pattern at a later gap, or a sign-flipped `d`, requiring the student to actually check rather than eyeball. Mistake pool generated via `generateNonArithmeticSequence`, never hand-authored, so every "error" is a real, verifiable break in the sequence. | All rounds' errors correctly identified and corrected. |
| `MissionSimulatorSandbox.jsx` *(optional 5th layer)* | Open free play, no archetype/scoring | Fully open `a`/`d` controls (wider range than the required stations, including simple fractional values), full `TelemetryGraph` + rocket animation, and an auto-computed mission summary panel (`sumOfNTerms` as "total distance," final-term trend as "final velocity"). No correctness checking, no XP, no completion gate — purely exploratory. | N/A — never gates phase completion; reachable only after the 4 required stations are done, per §1.4's tab-bar/gating note. |

**Wiring note (the module-specific deviation from platform standard, per §1.4):** `SimulatePhase.jsx`'s `STATIONS` array holds the 4 required components as usual, and the phase-advance check (`COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION`) is scoped explicitly to those 4 indices. `MissionSimulatorSandbox.jsx` is wired as a 5th tab that unlocks (becomes clickable, not hidden) only once all 4 required stations report `completed`, and never participates in the phase-advance check. Tab bar and progress-dot components need to support a visually-distinct "bonus" 5th tab styling (e.g. a star icon instead of a numbered dot) so students understand it's optional.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting the "checked only the first gap" and "`d` must be positive" misconceptions (PRD §8.5), matching the Anomaly Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is; `MissionSimulatorSandbox.jsx` intentionally does not call into scoring at all. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Signal Locked, Steady Telemetry, Flight-Ready Streak, Full Mission Kit, Checkpoint Cleared, Anomaly Resolved, Veteran Cadet, Mission Commander Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as prior modules' TRDs, plus new helpers for the multi-round stations: `simRoundIntro(stationIdx, roundIdx)`, `simStepComplete(stationIdx, stepIdx)`) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules: `a`/`d` always grounded in plain language before being spoken as letters, the formula read in natural language (not symbol-by-symbol), negative `d` always read as "negative *d*," "sum of the first *n* terms" spelled out on first use, "arithmetic mean" paired with "the halfway value" on first use. After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using a mission-control/space palette distinct from the three prior modules' palettes:

| World | Accent (indicative) |
|---|---|
| 0 — Reading the Telemetry | `#3A86FF` (signal blue) |
| 1 — Mission Integrity Check | `#FB5607` (alert orange) |
| 2 — The Trajectory Formula | `#8338EC` (deep violet) |
| 3 — Solve for the Unknown Stage | `#FFBE0B` (console amber) |
| 4 — Filling the Gaps | `#06A77D` (data-feed green) |
| 5 — Extra Checkpoints | `#219EBC` (navigation teal) |
| 6 — Is It on the Flight Path? | `#5390D9` (flight-path blue) |
| 7 — Countdown to Launch | `#FF006E` (launch magenta) |
| 8 — Total Burn | `#F94144` (fuel-gauge red) |
| 9 — Mission Control: Final Countdown | `#0B132B` (deep-space navy — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 9 concept generators; assert no duplicate options, no non-integer intermediate/final values across `solveForUnknown`/`interpolateTerms`/`insertArithmeticMeans`, no `generateNonArithmeticSequence` output that's clustered at a single `breakAtIndex`, no malformed/`NaN`/`undefined` fields.
2. **Negative-`d` coverage audit (module-specific)** — programmatically check the generated bank's actual proportion of negative-`d` sequences across every relevant world meets the "healthy proportion" bar from PRD §14, not just spot-checked by eye.
3. **Misconception audit** — spot-check distractors are dominated by the two headline misconceptions (check-only-first-gap; `d`-must-be-positive), plus the formula off-by-one and the `Sn = n×a` sum misconception, rather than arbitrary numbers.
4. **Multi-round/multi-step station QA (module-specific, new class of test)** — unlike the single-pass stations in the three prior modules, `CheckpointCalibration.jsx`'s 3 rounds and `MissionControlConsole.jsx`'s 4 chained steps each need their own pass/fail path tested independently, plus the ability to retry one round/step without losing progress on the others — this is a materially larger QA surface than any prior module's Simulate phase and should be budgeted accordingly.
5. **5th-tab gating check (module-specific)** — confirm the sandbox tab is genuinely inaccessible until all 4 required stations report complete, and confirm it never appears in or affects the `COMPLETE_SIM_STATION`/phase-advance logic.
6. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
7. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 required stations completable including every round/step, 5th tab correctly gated and skippable) → Practice (World Map, all 4 modes, all 10 Boss Battles, badges) → Reflect — zero console/page errors.
8. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
9. **Accessibility spot-check** — fonts/touch targets at Secondary-appropriate sizing; `TelemetryGraph` trend readable via text, not colour-only; all dial/slider interactions (including multi-round ones) have keyboard equivalents.
10. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders with art-brief README; `README.md` updated and checked for leftover branding; `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **Grade-level scope risk carried over from the PRD (§1 of that document)** — this is a technical build risk too: building genuinely JC1-level content means the question-bank and Simulate-phase QA bars (clean-number correctness, misconception grounding) matter even more than usual, since there's no existing sibling-module precedent at this difficulty to sanity-check against.
- **Architectural deviation risk.** This is the first module to add a 5th Simulate tab and multi-round/multi-step internal station state — both are genuine departures from the platform's fixed Simulate-phase assumptions (§5 of the PRD, §1.4 here). If the actual clone source's `SimulatePhase.jsx`/tab-bar components resist a 5th tab more than expected, the fallback is to fold the Mission Simulator sandbox into `TelemetryTowerLab.jsx` as an "advanced mode" toggle within the existing station 1, rather than a separate tab — flag this fallback explicitly if the 5-tab approach proves costly during build.
- **QA surface size.** Per §10.4, the multi-round/multi-step stations have meaningfully more internal states to test than any prior module's Simulate phase — don't estimate this build's QA time using the three prior modules as the baseline.
- **Negative-`d` under-representation risk.** It's easy for a generator to default toward "nicer-feeling" increasing sequences unless the negative-`d` proportion is actively enforced and audited (§10.2) — this is the single most load-bearing "clean number"-style constraint in this module, analogous to PatternQuest's coefficient-vs-constant guardrail.
- **Concept Discovery Lab resolution is local to this module** — per PRD §15.5, Station 1's pure-free-play design here doesn't change the three prior modules' already-shipped-or-in-progress Concept Discovery Lab stations; don't assume consistency across the catalogue without an explicit backport decision.
