# ProgressionQuest — Module PRD
**Grade 7 · Arithmetic Sequences**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 7, {{TOPIC}} = Arithmetic Sequences, {{SPECIAL_INSTRUCTIONS}} = "design a rich Simulate phase, with a children-engaging and learning experience via interactive activity, simulations and challenges")*

---

## 1. Overview

ProgressionQuest gives students the *formal* toolkit for arithmetic sequences — naming the first term (*a*) and common difference (*d*), verifying a sequence really is arithmetic, using the general term formula `Tn = a + (n − 1)d`, interpolating missing terms, inserting arithmetic means, and (as a flagged capstone extension) summing the first *n* terms. It's framed as a Mission Control simulation: students are junior cadets reading a rocket's telemetry, where every checkpoint reading is a term in a sequence and a broken pattern means something's gone wrong with the flight.

Per the special instruction for this module, the Simulate phase is deliberately built richer and more elaborate than the platform's standard treatment — multi-round escalating challenges, a composite "mission console" station, live animated telemetry throughout, and an additional optional free-play sandbox layered on top of the four required stations. See §8.3 for the full design.

## 2. Background

This is the fourth Grade 7 (Secondary 1) module built against the platform blueprint's reference architecture, following **EquationQuest**, **PatternQuest**, and **MosaicQuest**. It reuses `G2-Money-Money-main`'s five-phase pedagogical architecture per platform convention.

> **⚠️ Scope flag — larger than the usual Secondary-1 note:** this module goes meaningfully further than the prior three. See §3 for the full explanation, but in short: the *formal* arithmetic-progression treatment this PRD builds (named `a`/`d` notation, the `Tn = a + (n−1)d` formula as a named result, and especially the sum-of-*n*-terms extension) is not Secondary 1 content in Singapore's own sequencing — it's JC1 ("Sequences and Series") content, roughly four years further along than Grade 7. This PRD proceeds anyway, at the user's explicit request, framed as a deliberate **enrichment/acceleration module** — consistent with the platform's existing non-grade-locked products (the SAT Practice Module, Vedic Maths Tricks) — but this is a bigger scope decision than the routine flags raised in the three prior PRDs and should be confirmed explicitly, not assumed nodded-through.

## 3. Standards Alignment

**Source and honest positioning:** the foundational skill here (recognising a linear/constant-difference sequence and finding a general term) is Singapore MOE Secondary 1 "Number Patterns" content — the same chapter PatternQuest already covers. The *formal* treatment this module adds — explicit `a`/`d` vocabulary, `Tn = a + (n − 1)d` as a named, examinable formula, interpolation, arithmetic means, and the sum formula `Sn = n/2(2a + (n − 1)d)` — is, in Singapore's own curriculum, **JC1 "Sequences and Series" content**, not Secondary 1 material. Comparable systems place the same formal content around Grade 9–11 (O-level Additional Mathematics / CBSE Class 10 / equivalent) — still meaningfully later than Grade 7 everywhere it was checked.

**Explicit scoping split from PatternQuest (both modules touch arithmetic sequences and must not overlap or contradict each other):**
- PatternQuest owns the Secondary-1-appropriate, *informal* introduction: continue a pattern, describe the rule in words, derive `nth term = an + b` without naming it a "general term formula," no named `a`/`d` vocabulary, no negative-difference emphasis, no interpolation, no arithmetic means, no sum.
- ProgressionQuest owns the *formal*, JC1-flavoured treatment built on top of that foundation: naming `a` and `d` explicitly, verifying a sequence is genuinely arithmetic (including decreasing/negative-`d` sequences), the named `Tn = a + (n − 1)d` formula, solving for an unknown among `a`/`d`/`n`, interpolation, arithmetic means, membership testing with formal notation, and the sum-of-*n*-terms capstone.
- A student who has completed PatternQuest arrives at ProgressionQuest already comfortable with the underlying idea of a general term; this module's job is to formalise, deepen, and extend that idea, not reintroduce it.

**In-scope skills:**
- Defining an arithmetic sequence (constant common difference between consecutive terms) and identifying its first term `a` and common difference `d`.
- Verifying whether a given sequence is genuinely arithmetic by checking the difference between **every** consecutive pair, not just the first — and explaining why a sequence that fails is not arithmetic.
- Recognising that `d` can be negative (a decreasing sequence) — directly countering a well-documented misconception that arithmetic sequences must increase.
- Writing and applying the general term formula `Tn = a + (n − 1)d`.
- Solving for an unknown among `a`, `d`, or `n` given partial information about a sequence (e.g. two terms and their positions).
- Interpolating missing/interior terms given two known non-adjacent terms.
- Inserting one or more arithmetic means between two given numbers, and computing the arithmetic mean of two numbers directly.
- Determining whether a given number is a term of a sequence and, if so, its position.
- Applying arithmetic-sequence reasoning to multi-step real-world scenarios, and, as an explicitly-flagged extension, finding the sum of the first *n* terms using `Sn = n/2(2a + (n − 1)d)`.

**Adjacent/prerequisite skills treated as bridge only, not tested:**
- **Geometric progressions** — a sibling JC1 topic (constant *ratio* rather than constant difference); referenced only as a contrast case ("not every sequence with a pattern is arithmetic — some multiply instead of add," directly targeting a documented AP/GP confusion misconception) but never tested.
- **Formal algebraic derivation of the sum formula** (the "reverse and add" proof) — referenced narratively in Story as "how Mission Control figured out the shortcut," not examined.
- **Quadratic/non-linear sequences** — same exclusion already established in PatternQuest, carried forward here.

**Domain conventions to encode as house style:**
- Always name `a` ("the first term") and `d` ("the common difference") explicitly before using them symbolically — never introduce the letters without first grounding them in plain language.
- Every "verify this is arithmetic" worked example checks **every** given consecutive pair, never stops after the first match — this is the module's single most important habit to instil (§15, §10 TRD).
- Negative common differences are treated as a normal, expected case throughout — never flagged as an edge case or exception.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Define an arithmetic sequence and identify its first term (`a`) and common difference (`d`).
2. Verify whether a sequence is arithmetic by checking every consecutive pair, including recognising valid decreasing (negative-`d`) sequences.
3. Write and apply the general term formula `Tn = a + (n − 1)d` to find a specified term.
4. Solve for an unknown among `a`, `d`, or `n` given partial information about an arithmetic sequence.
5. Find missing/interior terms of an arithmetic sequence by interpolation, given two known non-adjacent terms.
6. Insert one or more arithmetic means between two given numbers.
7. Determine whether a given number is a term of a sequence and, if so, find its position.
8. Apply arithmetic-sequence reasoning to a multi-step real-world scenario, and — as a flagged extension — find the sum of the first *n* terms of an arithmetic sequence.

Ordering runs foundational → applied (define/verify → formal general term → solve-for-unknown → interpolation → arithmetic means → membership → applied multi-step + sum extension), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity (relaxed only for formula read-outs per §11, consistent with PatternQuest's precedent).
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.
- **Simulate phase baseline:** 4 required, archetype-mapped stations gate phase completion, per platform standard — this module keeps that gate intact (§8.3) and adds richness *within and alongside* it, rather than replacing it.

## 6. Enhancement Requests / Special Instructions

**Given instruction:** *"design a rich simulation phase, with a children engaging and learning experience via interactive activity, simulations and challenges."*

This maps to four concrete decisions carried through §8.3:
1. Each of the 4 required stations is designed with **multiple escalating rounds** rather than a single pass, so the Simulate phase reads as a genuine mini-campaign rather than four one-off screens.
2. One station (**Mission Control Console**) is deliberately composite, chaining together verify → solve → predict → sum in one live, visually-animated console — the richest single station built for any module so far.
3. Live animated telemetry (a rocket ascending, a real-time altitude/time graph) is the connective visual thread across all four stations, not just station 1, so the Simulate phase feels like one continuous simulation rather than four disconnected activities.
4. An **optional fifth layer** — a free-play "Mission Simulator" sandbox — is added *alongside* (not instead of) the four required stations, unlocked once all four are complete. This is a deliberate, explicitly-flagged deviation from the platform's fixed "exactly 4 stations" baseline (§5), justified directly by this module's special instruction — see §8.3 and the companion TRD §6 for the implementation note this requires.

This special instruction is also used to resolve, for this module only, the Concept Discovery Lab design tension raised in all three prior Grade 7 PRDs (light confirmation question vs. a previously stated preference for pure free-play): **Station 1 here is built pure free-play, with challenges offered as optional bonus rounds rather than a gating question** (§8.3). This doesn't retroactively change the three prior modules' PRDs, but demonstrates the resolution in practice — if it lands well, the prior three could be revisited to match.

## 7. Module Identity

- **Module name:** **ProgressionQuest** *(in-story mission codename: "Mission Control Cadets")*
- **Story theme:** a Mission Control simulation — every world is a stage of monitoring or planning a rocket's flight, where each telemetry reading is a term in a sequence and the throughline question is "is this pattern holding, and can you trust it enough to plan the next stage of the mission?"
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from the three prior modules' pairs):
  - **Ishaan** — meticulous, always checks every gap in the data before trusting a pattern.
  - **Xin Yi** — quick and confident, sometimes trusts a pattern after checking only the first gap — a recurring, narratively-reinforced version of the module's headline misconception (§15).
- **Mascot: Orbit the Mission Bot 🤖** *(override, with stated rationale)* — a mission-control AI assistant fits the space/telemetry framing directly, distinct from the default owl and from the fox/chameleon overrides already used in the sibling modules.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"Mission Control just lost contact with a rocket mid-ascent. The last five altitude readings came through fine — but reading six is corrupted. If the pattern is holding, you can calculate exactly what it should be. Can you save the mission?"*

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | Signal Lost | Hook: a corrupted reading in an otherwise-patterned telemetry feed | Ishaan and Xin Yi are handed their first shift at Mission Control, right as the corrupted signal comes in. |
| 2 | Naming the Pattern | Vocabulary: first term `a`, common difference `d`; checking *every* gap, not just the first | Orbit the Mission Bot introduces formal AP vocabulary and immediately flags that Xin Yi only checked one gap. |
| 3 | The Trajectory Formula | Formal rule: `Tn = a + (n − 1)d`, including a worked negative-`d` (descending) example | Orbit shows the formula as "the shortcut that beats checking every reading by hand," with a decelerating-stage example to normalise negative `d`. |
| 4 | Reading Six, Recovered | Worked application: verifying the sequence, deriving the formula, predicting the missing reading, and checking it | The pair recovers the missing reading, Mission Control confirms the rocket is on course, and the cadets are cleared for full duty. |

### 8.3 Simulate — Rich, Multi-Layered Design *(per this module's special instruction)*

This module's Simulate phase keeps the platform's fixed 4-required-station architecture (§5) but designs each station with materially more depth than the standard treatment, plus one additional optional layer. Full technical spec in the companion TRD §6.

**The four required stations (must all be completed to advance, per platform standard):**

| Station | Archetype | Rich design |
|---|---|---|
| **Telemetry Tower** | Concept Discovery Lab | Student tunes starting altitude (`a`) and burn rate (`d`, including negative values for descent) on two live controls; a rocket visibly ascends/descends on screen while a real-time altitude-vs-checkpoint graph plots each term as it's generated — sound pitch and flame animation scale with `d`'s magnitude for multi-sensory feedback. **Free exploration is the completion path** (no gating question — see §6's resolution of the Concept Discovery Lab tension); an *optional* "Mission Log Challenge" then offers 3 quick bonus prompts ("make the rocket reach exactly 500m by checkpoint 5") for extra XP, entirely skippable. |
| **Checkpoint Calibration** | Build-to-Target Challenge | Student tunes `a` and `d` to hit a target `Tn` value at a target position, with a live-computed readout — but across **3 escalating rounds**: Round 1 (positive `d`, small target), Round 2 (negative `d`, a descending target — directly reinforcing the negative-`d` habit), Round 3 (a larger `n`, rewarding efficient use of the formula over guess-and-check). Each round clears independently and awards its own star. |
| **Mission Control Console** | Multi-Step/Composite Construction | The richest single station in the module: given a partial mission brief ("Checkpoint 3 reads 145m, Checkpoint 7 reads 285m — the rocket must reach the docking platform at checkpoint 12"), the student works through one continuous live console: **(1) verify** the two given readings are consistent with *some* arithmetic sequence, **(2) solve** for `a` and `d` from the two known checkpoints, **(3) predict** the checkpoint-12 value using the derived formula, and **(4) confirm total fuel** by computing the sum of the first 12 terms. Each step's result feeds live into the next and updates the on-screen telemetry graph and rocket animation — this single station deliberately chains together LOs 2–5 and 8 into one narrative arc, exactly the "interactive activity, simulations, and challenges" experience the special instruction calls for. |
| **Anomaly in the Data Feed** | Error-Detective | A fellow cadet's mission log contains one seeded mistake, across **multiple escalating rounds of increasing subtlety** — Round 1's error is obvious (a visibly broken telemetry graph line), later rounds require closer checking (an error that only breaks the pattern at the *third* gap, catching the "only checked the first pair" habit; a sign error treating a negative `d` as positive). The live telemetry graph visually highlights exactly where the anomaly causes a deviation from a straight-line trend, tying back to Station 1's graph motif. |

**Optional fifth layer (unlocked after all 4 stations, does not gate phase completion):**

| Layer | Type | Design |
|---|---|---|
| **Mission Simulator: Free Flight Sandbox** | Open-ended free play | A fully open sandbox: the student sets any `a` and `d` (including fractional/negative values within a friendly range) and watches a full simulated launch play out — live rocket animation, altitude/time graph, and an automatically-computed mission summary (total distance = the sum of the sequence, final velocity trend, etc.). No question, no scoring, no "correct" outcome — purely a place to freely explore how changing `a`/`d` changes an entire mission, reinforcing every station's concept at once through play. This is the module's most direct expression of the "engaging, children-friendly, interactive activity and simulation" brief, deliberately built as bonus content so it never blocks progress for a student who wants to move faster. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's two headline misconceptions: **checking only the first pair of differences before concluding a sequence is arithmetic**, and **assuming the common difference must be positive**. Followed by the standard scorecard and a reflection prompt ("Which mission checkpoint took the most careful checking, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | Reading the Telemetry | `define-identify-ap` | Define an AP; identify first term `a` and common difference `d` | The Static Signal 📡 | Telemetry Badge |
| 1 | Mission Integrity Check | `verify-arithmetic-sequence` | Verify a sequence is arithmetic by checking every gap | The Rogue Reading ⚠️ | Integrity Badge |
| 2 | The Trajectory Formula | `general-term-formula` | Apply `Tn = a + (n − 1)d` to find a specified term | The Formula Firewall 🧮 | Trajectory Badge |
| 3 | Solve for the Unknown Stage | `solve-for-a-d-n` | Solve for `a`, `d`, or `n` given partial AP information | The Missing Variable ❓ | Solver's Badge |
| 4 | Filling the Gaps | `interpolate-missing-terms` | Interpolate missing terms given two known non-adjacent terms | The Data Gap 🕳️ | Gap-Filler Badge |
| 5 | Extra Checkpoints | `arithmetic-means` | Insert arithmetic mean(s) between two given numbers | The Checkpoint Guardian 📍 | Navigator Badge |
| 6 | Is It on the Flight Path? | `test-membership` | Determine whether a number is a term of the sequence | The Flight Path Phantom 🛰️ | Tracker Badge |
| 7 | Countdown to Launch | `applied-multi-step-ap` | Full multi-step real-world AP scenario | The Countdown Glitch ⏱️ | Launch Badge |
| 8 | Total Burn | `sum-of-n-terms` | Find the sum of the first *n* terms (flagged extension, §3) | The Fuel Gauge Dragon ⛽ | Engineer's Badge |
| 9 | Mission Control: Final Countdown | `mixed-review` | Mixed review of every concept above; hardest boss | Mission Commander Vega 🚀 | Chief Cadet Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"A sequence starts 12, 9, 6, 3, … Identify `a` and `d`."* → `a = 12, d = −3` ✓ (distractor: `d = 3`, ignoring the sign)
- **World 1:** *"Is 2, 5, 8, 12, 15 arithmetic?"* → "No — the gap between 8 and 12 is 4, not 3" ✓ (headline distractor: "Yes," reflecting a check of only the first pair)
- **World 2:** *"An AP has `a = 5, d = 4`. Find T10."* → `41` ✓ (distractor `45`, reflecting using `n` instead of `n − 1` in the formula)
- **World 3:** *"T5 = 17 and T5's common difference is 3. Find `a`."* → `5` ✓
- **World 4:** *"T3 = 11 and T8 = 31 in an AP. Find T5."* → `19` ✓ (`d = 4`, `a = 3`)
- **World 5:** *"Insert one arithmetic mean between 8 and 20."* → `14` ✓
- **World 6:** *"An AP has `a = 4, d = 6`. Is 58 a term? If so, which one?"* → "Yes — T10" ✓
- **World 7:** *"A savings account starts with $50 and grows by $15 every month with no other deposits or withdrawals. How much is in it after 12 months?"* → `$215` ✓
- **World 8:** *"Find the sum of the first 10 terms of the AP with `a = 3, d = 5`."* → `255` ✓ (headline distractor `30`, reflecting the "Sn is just n × a" misconception)
- **World 9:** mixed-type item combining a verify-every-gap check (World 1) with a sum (World 8).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Signal Locked 📡 |
| 5-answer streak | Steady Telemetry 📈 |
| 10-answer streak | Flight-Ready Streak 🔥 |
| All 4 Simulate stations complete | Full Mission Kit 🧰 |
| Any world scores 3 stars | Checkpoint Cleared ⭐⭐⭐ |
| Any Boss Battle won | Anomaly Resolved 🛠️ |
| 20+ questions answered in Practice | Veteran Cadet 🎖️ |
| Full 5-phase journey complete | Mission Commander Badge 🚀 |

## 11. Audio & Narration Content Rules

Topic-specific terms and formula-reading rules:
- `a` is always spoken as "the first term," `d` as "the common difference" — the letters alone are never spoken without first grounding them in the plain-language term, at least once per world.
- `Tn = a + (n − 1)d` is read in natural language, not symbol-by-symbol: "the *n*-th term equals the first term, plus, *n* minus one, groups of the common difference" — matching the precedent PatternQuest set for formula read-outs (a deliberate, noted relaxation of strict 1:1 narration/on-screen-text parity for formulas specifically).
- A negative common difference is always read as "a common difference of negative *d*," never simplified to "minus *d*," to keep it clearly a signed value.
- "Sum of the first *n* terms" is always spoken in full on first use per world before any abbreviation.
- "arithmetic mean" is spoken in full, paired with "the halfway value" on first use per world for accessibility, then used alone thereafter.

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's Secondary-1 sizing precedent. All live telemetry graphs carry numeric axis labels and a text description of the trend (not just a visual line), so trend direction isn't colour- or shape-dependent alone. Slider/dial controls (Telemetry Tower, Checkpoint Calibration, Mission Control Console) require explicit +/− keyboard-operable equivalents throughout, including within the multi-round and multi-step sequences.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel:
1. Mission Control room, Ishaan and Xin Yi receiving the corrupted-signal alert.
2. Orbit the Mission Bot introducing `a`/`d` vocabulary at a console, flagging Xin Yi's shortcut.
3. Orbit demonstrating the trajectory formula with a descending-stage (negative-`d`) example.
4. The pair recovering the missing reading, Mission Control confirming the rocket's on course.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- Generated sequences include a healthy proportion (roughly a third or more) of negative-`d` cases across every relevant world, not just as occasional distractors, so the "AP must increase" misconception is countered by the generation design itself, not only by explanation text.
- World 1's verification items include a genuine mix of sequences that break only at a later gap (never all breaking at the first gap), so the "check every pair" skill is actually testable.
- All 4 required Simulate stations are genuinely interactive and multi-round as specified in §8.3, and the optional Mission Simulator sandbox is confirmed non-blocking (a student can reach Practice having skipped it entirely).
- The sum-of-*n*-terms World 8 content is clearly, visibly flagged in-product as an extension (e.g. a distinct "Bonus" visual treatment) — not presented as equivalent-difficulty core content to Worlds 0–7, given its flagged out-of-grade-band status (§3).

## 15. Assumptions & Open Questions

1. **Grade-level positioning (the module's central open question, bigger than the routine flag):** this PRD builds genuinely JC1-level formal content for a Grade 7 audience, at explicit user request, framed as enrichment. Recommend an explicit stakeholder decision on: (a) whether to proceed with the full scope as specified here, (b) whether to cut the sum-of-*n*-terms World 8 extension and end the module at World 7's applied capstone instead, or (c) whether to keep the scope but re-badge the module as an explicit "advanced/enrichment" track distinct from the core Grade 7 catalogue in the platform's own navigation, so students and parents aren't misled about grade alignment.
2. **Scope boundary vs. PatternQuest:** the explicit split in §3 is this PRD's proposed resolution — confirm it holds up once both modules are actually played back-to-back, since a student doing ProgressionQuest without PatternQuest first will need slightly more scaffolding in Story panel 2 than currently drafted.
3. **Character names and mascot** (Ishaan, Xin Yi, Orbit the Mission Bot) are proposed defaults, not yet stakeholder-approved.
4. **Fifth Simulate layer as a platform precedent:** the optional Mission Simulator sandbox (§8.3) is this PRD's proposed way of satisfying "rich…interactive…simulations" without breaking the fixed 4-station architecture — confirm this pattern (bonus 5th layer, non-gating) is an acceptable way to fulfil "richer Simulate phase" requests generally, since it may come up again for future modules.
5. **Concept Discovery Lab tension — resolved here, not elsewhere:** per §6, this module's Station 1 uses pure free-play (matching the previously stated general preference) rather than the blueprint's default confirmation-question gate. This is a one-module resolution, not a retroactive change to EquationQuest/PatternQuest/MosaicQuest — worth deciding whether to backport if this design is well-received.
