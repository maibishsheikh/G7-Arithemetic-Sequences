// src/data/questionBank.js
// Procedural Question Bank for ProgressionQuest: Grade 7 Arithmetic Sequences
// 10 worlds × 10 questions = 100 questions
// Compliant with PRD §9, §14, §15 and TRD §4.4

import { WORLDS } from '../config/worlds.config.js';
import {
  pickCleanFirstTerm,
  pickCleanCommonDifference,
  generateArithmeticSequence,
  generateNonArithmeticSequence,
  findTermAtPosition,
  solveForUnknown,
  interpolateTerms,
  insertArithmeticMeans,
  isMemberOfSequence,
  sumOfNTerms,
  formatGeneralTermString,
} from '../utils/progressionMath.js';
import { shuffle } from '../utils/shuffle.js';

// Derive DISTRICTS for compatibility with PlayPhase, KingdomMap, etc.
export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  emoji: w.emoji,
  accent: w.accent,
  color: w.accent,
  description: w.description,
  conceptFocus: w.conceptFocus,
  boss: w.boss,
  isExtension: w.isExtension || false,
}));

function makeOptions(correct, distractors) {
  const correctStr = String(correct);
  const seen = new Set([correctStr]);
  const selected = [];

  for (const d of distractors) {
    const str = String(d);
    if (!seen.has(str)) {
      seen.add(str);
      selected.push(str);
      if (selected.length === 3) break;
    }
  }

  let step = 1;
  const num = parseInt(correctStr, 10);
  while (selected.length < 3) {
    let candidate;
    if (isNaN(num)) {
      candidate = `Choice ${String.fromCharCode(65 + selected.length + 1)}`;
      if (seen.has(candidate)) {
        candidate = `Option ${selected.length + step + 1}`;
      }
    } else {
      const offset = (step % 2 === 1 ? Math.ceil(step / 2) : -Math.ceil(step / 2)) * 3;
      candidate = String(num + offset);
    }
    step++;
    if (!seen.has(candidate)) {
      seen.add(candidate);
      selected.push(candidate);
    }
  }

  return shuffle([correctStr, ...selected]);
}

// ── WORLD 0: Define & Identify AP (first term a, common difference d) ───────
function genWorld0Question(qNum, districtId) {
  const isNegative = qNum % 2 === 1; // 50% negative d
  const a = pickCleanFirstTerm({ min: isNegative ? 15 : -10, max: 40 });
  const d = pickCleanCommonDifference({ min: 2, max: 8, forceNegative: isNegative, allowNegative: true });
  const terms = generateArithmeticSequence(a, d, 5);

  const askFor = qNum % 3; // 0: both a & d, 1: just a, 2: just d
  let questionText = "";
  let correctAnswer = "";
  let distractors = [];
  let explanation = "";
  let hint1 = "Look at the starting number for first term (a).";
  let hint2 = "Subtract any term from the next term: Term 2 minus Term 1 gives (d).";

  if (askFor === 0) {
    questionText = `Rocket telemetry shows: ${terms.join(', ')}... Identify the first term (a) and common difference (d).`;
    correctAnswer = `a = ${a}, d = ${d}`;
    distractors = [
      `a = ${a}, d = ${-d}`,
      `a = ${terms[1]}, d = ${d}`,
      `a = ${d}, d = ${a}`,
    ];
    explanation = `The first term is the initial reading a = ${a}. The common difference is ${terms[1]} − ${a} = ${d}.`;
  } else if (askFor === 1) {
    questionText = `A telemetry sensor registers: ${terms.join(', ')}... What is the first term (a)?`;
    correctAnswer = `${a}`;
    distractors = [`${terms[1]}`, `${d}`, `${terms[4]}`];
    explanation = `The first term (a) is simply the very first number in the sequence: ${a}.`;
  } else {
    questionText = `In the flight sequence: ${terms.join(', ')}... What is the common difference (d)?`;
    correctAnswer = `${d}`;
    distractors = [`${-d}`, `${d + (d > 0 ? 1 : -1)}`, `${terms[1]}`];
    explanation = `To find common difference d, take any term and subtract the previous: ${terms[1]} − (${terms[0]}) = ${d}.`;
  }

  return {
    id: `w0_q${qNum}`,
    districtId,
    category: "AP IDENTIFICATION",
    visual: "sequence-strip",
    visualData: { terms, d, showDifference: true },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1,
    hint2,
  };
}

// ── WORLD 1: Mission Integrity Check (verify every gap!) ───────────────────
function genWorld1Question(qNum, districtId) {
  const isArithmetic = qNum % 2 === 0;
  const a = pickCleanFirstTerm({ min: 5, max: 30 });
  const d = pickCleanCommonDifference({ min: 2, max: 7, allowNegative: qNum % 3 === 0 });

  let sequence = [];
  let questionText = "";
  let correctAnswer = "";
  let distractors = [];
  let explanation = "";
  let hint1 = "Calculate the difference between Term 1 & 2, then Term 2 & 3, then Term 3 & 4.";
  let hint2 = "Never stop after the first gap! An arithmetic sequence requires EVERY consecutive gap to be identical.";

  if (isArithmetic) {
    sequence = generateArithmeticSequence(a, d, 5);
    questionText = `Is the telemetry sequence ${sequence.join(', ')} an arithmetic sequence?`;
    correctAnswer = `Yes — every gap is consistently ${d}`;
    distractors = [
      `No — only the first two gaps match`,
      `No — arithmetic sequences must always increase`,
      `Yes — but only because the first gap is ${d}`,
    ];
    explanation = `Checking every consecutive gap: ${sequence[1]}-${sequence[0]} = ${d}, ${sequence[2]}-${sequence[1]} = ${d}, ${sequence[3]}-${sequence[2]} = ${d}, ${sequence[4]}-${sequence[3]} = ${d}. All gaps are identical!`;
  } else {
    // Deliberately breaks at gap 2 or 3 or 4
    const breakAt = (qNum % 3) + 2; // index 2, 3, or 4
    const fake = generateNonArithmeticSequence(a, d, breakAt, 5);
    sequence = fake.sequence;
    const corruptedIndex = fake.breakIndex;
    const actualDiff = sequence[corruptedIndex] - sequence[corruptedIndex - 1];

    questionText = `Mission Control receives: ${sequence.join(', ')}. Is this an authentic arithmetic sequence?`;
    correctAnswer = `No — the gap between T${corruptedIndex} and T${corruptedIndex + 1} is ${actualDiff}, not ${d}`;
    distractors = [
      `Yes — because the first gap between ${sequence[0]} and ${sequence[1]} is ${d}`,
      `Yes — any sequence with 5 numbers is arithmetic`,
      `No — because ${sequence[0]} is not a multiple of ${Math.abs(d)}`,
    ];
    explanation = `While the first gap is ${d}, checking further reveals that between T${corruptedIndex} (${sequence[corruptedIndex - 1]}) and T${corruptedIndex + 1} (${sequence[corruptedIndex]}), the gap is ${actualDiff}! A true AP requires EVERY gap to be identical.`;
  }

  return {
    id: `w1_q${qNum}`,
    districtId,
    category: "INTEGRITY VERIFICATION",
    visual: "sequence-strip",
    visualData: { terms: sequence, showDifference: false },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1,
    hint2,
  };
}

// ── WORLD 2: The Trajectory Formula (Tn = a + (n - 1)d) ─────────────────────
function genWorld2Question(qNum, districtId) {
  const isNegative = qNum % 3 === 1;
  const a = pickCleanFirstTerm({ min: isNegative ? 30 : 2, max: 50 });
  const d = pickCleanCommonDifference({ min: 3, max: 9, forceNegative: isNegative, allowNegative: true });
  const n = (qNum % 5) + 6; // n between 6 and 10
  const tn = findTermAtPosition(a, d, n);

  const questionText = `A rocket's trajectory has first checkpoint reading a = ${a} and common difference d = ${d}. Using Tₙ = a + (n − 1)d, find Checkpoint reading T${n}.`;
  const correctAnswer = `${tn}`;
  const distractors = [
    `${a + n * d}`, // common mistake: using n instead of (n - 1)
    `${a + (n - 2) * d}`, // off by 2
    `${tn + (d > 0 ? -d : d)}`,
  ];
  const explanation = `Formula: Tₙ = a + (n − 1)d. Here: T${n} = ${a} + (${n} − 1) × (${d}) = ${a} + ${n - 1} × (${d}) = ${a} + ${(n - 1) * d} = ${tn}.`;

  return {
    id: `w2_q${qNum}`,
    districtId,
    category: "GENERAL TERM FORMULA",
    visual: "formula-breakdown",
    visualData: { a, d, n, Tn: `T${n}` },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1: `Substitute into Tₙ = a + (n − 1)d with a = ${a}, d = ${d}, n = ${n}.`,
    hint2: `First compute (${n} − 1) = ${n - 1}, multiply by ${d}, then add ${a}.`,
  };
}

// ── WORLD 3: Solve for the Unknown Stage (a, d, or n) ──────────────────────
function genWorld3Question(qNum, districtId) {
  const mode = qNum % 3; // 0: solve for a, 1: solve for d, 2: solve for n
  const isNegative = qNum % 2 === 1;
  const a = pickCleanFirstTerm({ min: isNegative ? 25 : 4, max: 40 });
  const d = pickCleanCommonDifference({ min: 2, max: 7, forceNegative: isNegative, allowNegative: true });
  const n = (qNum % 4) + 5; // 5, 6, 7, 8
  const tn = findTermAtPosition(a, d, n);

  let questionText = "";
  let correctAnswer = "";
  let distractors = [];
  let explanation = "";

  if (mode === 0) {
    questionText = `In an arithmetic telemetry feed, Checkpoint T${n} = ${tn} and the common difference is d = ${d}. What was the initial reading (a)?`;
    correctAnswer = `${a}`;
    distractors = [`${a + d}`, `${a - d}`, `${tn - n * d}`];
    explanation = `Using Tₙ = a + (n − 1)d: ${tn} = a + (${n} − 1) × (${d}) = a + ${(n - 1) * d}. Subtracting gives a = ${tn} − (${(n - 1) * d}) = ${a}.`;
  } else if (mode === 1) {
    questionText = `A sequence begins at a = ${a}, and term T${n} reaches ${tn}. What is the common difference (d)?`;
    correctAnswer = `${d}`;
    distractors = [`${-d}`, `${d + 1}`, `${Math.round((tn - a) / n)}`];
    explanation = `Using Tₙ = a + (n − 1)d: ${tn} = ${a} + (${n - 1})d. So ${tn - a} = ${n - 1}d. Dividing by ${n - 1} gives d = ${d}.`;
  } else {
    questionText = `In an AP with initial reading a = ${a} and common difference d = ${d}, which checkpoint has value ${tn}?`;
    correctAnswer = `T${n} (n = ${n})`;
    distractors = [
      `T${n + 1} (n = ${n + 1})`,
      `T${n - 1} (n = ${n - 1})`,
      `T${n + 2} (n = ${n + 2})`,
    ];
    explanation = `Set ${tn} = ${a} + (n − 1) × (${d}). Then ${tn - a} = (n − 1) × (${d}). Dividing gives ${(tn - a) / d} = n − 1, so n = ${n}.`;
  }

  return {
    id: `w3_q${qNum}`,
    districtId,
    category: "SOLVE FOR UNKNOWN",
    visual: "formula-breakdown",
    visualData: {
      a: mode === 0 ? '?' : a,
      d: mode === 1 ? '?' : d,
      n: mode === 2 ? '?' : n,
      Tn: tn,
    },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1: "Rearrange the equation Tₙ = a + (n − 1)d to isolate the unknown variable.",
    hint2: `Known values: ${mode === 0 ? `Tn=${tn}, d=${d}, n=${n}` : mode === 1 ? `a=${a}, Tn=${tn}, n=${n}` : `a=${a}, d=${d}, Tn=${tn}`}.`,
  };
}

// ── WORLD 4: Filling the Gaps (Interpolation) ──────────────────────────────
function genWorld4Question(qNum, districtId) {
  const a = pickCleanFirstTerm({ min: 5, max: 25 });
  const d = pickCleanCommonDifference({ min: 3, max: 8, allowNegative: qNum % 2 === 1 });
  const pos1 = 2;
  const pos2 = 6;
  const t1 = findTermAtPosition(a, d, pos1);
  const t2 = findTermAtPosition(a, d, pos2);
  const targetPos = (qNum % 3) + 3; // 3, 4, or 5
  const targetVal = findTermAtPosition(a, d, targetPos);

  const seqDisplay = [
    findTermAtPosition(a, d, 1),
    t1,
    targetPos === 3 ? '?' : findTermAtPosition(a, d, 3),
    targetPos === 4 ? '?' : findTermAtPosition(a, d, 4),
    targetPos === 5 ? '?' : findTermAtPosition(a, d, 5),
    t2,
  ];

  const questionText = `In an AP, Checkpoint T${pos1} = ${t1} and Checkpoint T${pos2} = ${t2}. What is the value of missing Checkpoint T${targetPos}?`;
  const correctAnswer = `${targetVal}`;
  const distractors = [
    `${targetVal + d}`,
    `${targetVal - d}`,
    `${Math.round((t1 + t2) / 2)}`,
  ];
  const explanation = `Between T${pos1} and T${pos2} there are ${pos2 - pos1} steps: ${pos2 - pos1}d = ${t2} − ${t1} = ${t2 - t1}. Thus d = ${d}. To find T${targetPos}, add ${targetPos - pos1} step(s) of ${d} to T${pos1}: ${t1} + ${targetPos - pos1} × (${d}) = ${targetVal}.`;

  return {
    id: `w4_q${qNum}`,
    districtId,
    category: "INTERPOLATION",
    visual: "interpolation-gap",
    visualData: {
      sequence: seqDisplay,
      known1: { pos: pos1, val: t1 },
      known2: { pos: pos2, val: t2 },
    },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1: `First find the common difference d by dividing the difference in values (${t2} − ${t1}) by the difference in positions (${pos2} − ${pos1}).`,
    hint2: `Once you have d = ${d}, calculate T${targetPos} by stepping forward from T${pos1}.`,
  };
}

// ── WORLD 5: Extra Checkpoints (Arithmetic Means) ──────────────────────────
function genWorld5Question(qNum, districtId) {
  const isMultiple = qNum % 3 === 2; // insert 2 means vs 1 mean
  const a = pickCleanFirstTerm({ min: -6, max: 20 });
  const step = pickCleanCommonDifference({ min: 3, max: 8, allowNegative: qNum % 2 === 1 });

  if (!isMultiple) {
    // Single arithmetic mean
    const b = a + 2 * step;
    const mean = a + step;
    const questionText = `Mission Control needs to insert one arithmetic mean (the exact halfway checkpoint) between ${a} and ${b}. What is the mean?`;
    const correctAnswer = `${mean}`;
    const distractors = [
      `${mean + 2}`,
      `${mean - 2}`,
      `${Math.abs(b - a)}`,
    ];
    const explanation = `The arithmetic mean between two numbers a and b is simply their average: (${a} + ${b}) / 2 = ${a + b} / 2 = ${mean}. Notice the step is ${step} on both sides (${a} ➔ ${mean} ➔ ${b})!`;

    return {
      id: `w5_q${qNum}`,
      districtId,
      category: "ARITHMETIC MEANS",
      visual: "sequence-strip",
      visualData: { terms: [a, '?', b], showDifference: true },
      questionText,
      options: makeOptions(correctAnswer, distractors),
      correctAnswer,
      explanation,
      hint1: "The single arithmetic mean between two numbers is their exact midpoint: (a + b) / 2.",
      hint2: `Add ${a} and ${b}, then divide by 2.`,
    };
  } else {
    // Two arithmetic means
    const b = a + 3 * step;
    const mean1 = a + step;
    const mean2 = a + 2 * step;
    const questionText = `Insert two arithmetic means between ${a} and ${b} so that all four numbers form a valid AP.`;
    const correctAnswer = `${mean1} and ${mean2}`;
    const distractors = [
      `${mean1 - 1} and ${mean2 + 1}`,
      `${mean1 + step} and ${mean2 + step}`,
      `${a + 2} and ${b - 2}`,
    ];
    const explanation = `Inserting 2 means creates 3 intervals: 3d = ${b} − ${a} = ${b - a}, so d = ${step}. The two inserted means are ${a} + ${step} = ${mean1} and ${mean1} + ${step} = ${mean2}.`;

    return {
      id: `w5_q${qNum}`,
      districtId,
      category: "ARITHMETIC MEANS",
      visual: "sequence-strip",
      visualData: { terms: [a, '?', '?', b], showDifference: true },
      questionText,
      options: makeOptions(correctAnswer, distractors),
      correctAnswer,
      explanation,
      hint1: "Inserting 2 means creates 3 equal steps between the endpoints.",
      hint2: `Find d by calculating (${b} − ${a}) / 3 = ${step}.`,
    };
  }
}

// ── WORLD 6: Is It on the Flight Path? (Membership Testing) ────────────────
function genWorld6Question(qNum, districtId) {
  const isMember = qNum % 2 === 0;
  const a = pickCleanFirstTerm({ min: 2, max: 20 });
  const d = pickCleanCommonDifference({ min: 3, max: 7, allowNegative: false });

  let target = 0;
  let correctAnswer = "";
  let distractors = [];
  let explanation = "";

  if (isMember) {
    const n = (qNum % 5) + 8; // 8 to 12
    target = findTermAtPosition(a, d, n);
    correctAnswer = `Yes — it is term T${n}`;
    distractors = [
      `No — it is not on the flight path`,
      `Yes — it is term T${n + 1}`,
      `Yes — it is term T${n - 1}`,
    ];
    explanation = `Solve ${target} = ${a} + (n − 1) × ${d}. Then ${target - a} = (n − 1) × ${d}. (${target - a}) / ${d} = ${n - 1}, which yields n = ${n}. Since n is a positive whole integer, ${target} is indeed term T${n}!`;
  } else {
    // Non-member: target does not leave clean integer
    const nApprox = (qNum % 4) + 7;
    target = findTermAtPosition(a, d, nApprox) + 1; // off by 1
    correctAnswer = `No — solving for n gives a non-integer`;
    distractors = [
      `Yes — it is term T${nApprox}`,
      `Yes — it is term T${nApprox + 1}`,
      `Yes — every number is on the flight path`,
    ];
    const nVal = ((target - a) / d + 1).toFixed(1);
    explanation = `Setting ${target} = ${a} + (n − 1) × ${d} gives n = ${nVal}. Because a term position must be a whole counting number (1, 2, 3...), ${target} is NOT a term of this sequence.`;
  }

  const terms = generateArithmeticSequence(a, d, 4);
  const questionText = `A flight path has altitude telemetry: ${terms.join(', ')}... Is the altitude ${target}m on this flight path?`;

  return {
    id: `w6_q${qNum}`,
    districtId,
    category: "MEMBERSHIP TESTING",
    visual: "sequence-strip",
    visualData: { terms: [...terms, '...'], d },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1: `Set up the formula: ${target} = ${a} + (n − 1) × ${d} and solve for n.`,
    hint2: "If n is a whole positive number (1, 2, 3...), it is a valid term. Otherwise it is not!",
  };
}

// ── WORLD 7: Countdown to Launch (Applied Multi-Step AP) ───────────────────
function genWorld7Question(qNum, districtId) {
  const scenarios = [
    {
      title: "Rocket Stage Ascent",
      a: 120,
      d: 45,
      n: 8,
      unit: "meters",
      context: "Rocket Nova-7 launches from 120m and gains 45m of altitude every second.",
      q: "What is its altitude at the 8th second?",
    },
    {
      title: "Deceleration Burn",
      a: 500,
      d: -35,
      n: 10,
      unit: "meters",
      context: "During retro-burn, a lander starts at 500m and its altitude drops by 35m each second.",
      q: "What is its altitude at the 10th checkpoint second?",
    },
    {
      title: "Telemetry Data Packets",
      a: 15,
      d: 12,
      n: 12,
      unit: "packets",
      context: "A deep-space probe transmits 15 packets in minute 1, and increases transmission by 12 packets each subsequent minute.",
      q: "How many packets are transmitted in minute 12?",
    },
    {
      title: "Solar Battery Savings",
      a: 60,
      d: 25,
      n: 14,
      unit: "kWh",
      context: "Space Station Beta has 60 kWh stored and charges an additional 25 kWh each hour.",
      q: "How much energy is stored after 14 hours?",
    },
  ];

  const sc = scenarios[qNum % scenarios.length];
  const a = sc.a;
  const d = sc.d;
  const n = sc.n;
  const ans = findTermAtPosition(a, d, n);

  const questionText = `${sc.context} ${sc.q}`;
  const correctAnswer = `${ans} ${sc.unit}`;
  const distractors = [
    `${a + n * d} ${sc.unit}`, // common mistake using n
    `${ans + (d > 0 ? -d : d)} ${sc.unit}`,
    `${ans + 20} ${sc.unit}`,
  ];
  const explanation = `Identify: initial value a = ${a}, rate of change d = ${d}, step n = ${n}. Using Tₙ = a + (n − 1)d: T_${n} = ${a} + (${n} − 1) × (${d}) = ${a} + ${n - 1} × (${d}) = ${ans} ${sc.unit}.`;

  return {
    id: `w7_q${qNum}`,
    districtId,
    category: "APPLIED MULTI-STEP",
    visual: "telemetry-readout",
    visualData: {
      points: [a, a + d, a + 2 * d, a + 3 * d],
      projected: [ans],
      targetValue: ans,
      targetIndex: n,
      title: sc.title.toUpperCase(),
    },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1: `Model this scenario as an AP: starting amount is a = ${a}, rate per step is d = ${d}.`,
    hint2: `Use the general term formula with n = ${n}.`,
  };
}

// ── WORLD 8: Total Burn (Sum of First n Terms) ──────────────────────────────
function genWorld8Question(qNum, districtId) {
  const isNegative = qNum % 3 === 2;
  const a = (qNum % 4) + 2; // 2 to 5
  const d = pickCleanCommonDifference({ min: 2, max: 5, forceNegative: isNegative, allowNegative: true });
  const n = (qNum % 3) + 4; // 4 to 6 (keeps calculations clean & friendly)
  const sum = sumOfNTerms(a, d, n);
  const tn = findTermAtPosition(a, d, n);

  const questionText = `Find the sum of the first ${n} terms (S${n}) of an arithmetic sequence with initial reading a = ${a} and common difference d = ${d}. (Extension Concept)`;
  const correctAnswer = `${sum}`;
  const distractors = [
    `${n * a}`, // Headline misconception: Sn is just n * a
    `${n * tn}`, // another distractor
    `${sum + d * 2}`,
  ];
  const explanation = `Using the Sum formula Sₙ = n/2 × [2a + (n − 1)d]: S${n} = ${n}/2 × [2(${a}) + (${n} − 1)(${d})] = ${n}/2 × [${2 * a} + ${(n - 1) * d}] = ${n}/2 × [${2 * a + (n - 1) * d}] = ${sum}. Alternatively: Sₙ = n/2 × (First + Last) = ${n}/2 × (${a} + ${tn}) = ${sum}.`;

  const terms = generateArithmeticSequence(a, d, n);

  return {
    id: `w8_q${qNum}`,
    districtId,
    category: "SUM OF N TERMS [EXTENSION]",
    visual: "sequence-strip",
    visualData: { terms, d, showDifference: true },
    questionText,
    options: makeOptions(correctAnswer, distractors),
    correctAnswer,
    explanation,
    hint1: "Sum formula: Sₙ = n/2 × (First Term + n-th Term).",
    hint2: `Here n = ${n}, first term a = ${a}, and T${n} = ${tn}. Add them: ${a} + ${tn} = ${a + tn}, then multiply by ${n / 2}.`,
  };
}

// ── WORLD 9: Mission Control: Final Countdown (Mixed Review Grand Finale) ───
function genWorld9Question(qNum, districtId) {
  // Composed from across all topics
  switch (qNum % 5) {
    case 0: {
      // Grand Integrity Check
      const a = 16;
      const d = -4;
      const seq = [16, 12, 8, 4, 0];
      return {
        id: `w9_q${qNum}`,
        districtId,
        category: "GRAND FINALE: INTEGRITY",
        visual: "sequence-strip",
        visualData: { terms: seq, d: -4 },
        questionText: "Telemetry shows a descent sequence: 16, 12, 8, 4, 0... What are the first term (a) and common difference (d)?",
        options: makeOptions("a = 16, d = −4", ["a = 16, d = 4", "a = 0, d = −4", "a = 4, d = 16"]),
        correctAnswer: "a = 16, d = −4",
        explanation: "Starting reading is a = 16. The sequence decreases by 4 each step, so common difference d = −4.",
        hint1: "The first term is the initial reading. The common difference is negative when decreasing.",
        hint2: "12 − 16 = −4.",
      };
    }
    case 1: {
      // Long distance term calculation
      const a = 7;
      const d = 6;
      const n = 15;
      const tn = findTermAtPosition(a, d, n);
      return {
        id: `w9_q${qNum}`,
        districtId,
        category: "GRAND FINALE: TRAJECTORY",
        visual: "formula-breakdown",
        visualData: { a, d, n, Tn: `T${n}` },
        questionText: `Rocket Nova-7's long-range telemetry has a = ${a} and d = ${d}. Calculate Checkpoint T${n}.`,
        options: makeOptions(`${tn}`, [`${a + n * d}`, `${tn - d}`, `${tn + d}`]),
        correctAnswer: `${tn}`,
        explanation: `T${n} = ${a} + (${n} − 1) × ${d} = ${a} + 14 × 6 = ${a} + 84 = ${tn}.`,
        hint1: `Use Tₙ = a + (n − 1)d with n = ${n}.`,
        hint2: `14 × 6 = 84, then add ${a}.`,
      };
    }
    case 2: {
      // Interpolation & Means
      return {
        id: `w9_q${qNum}`,
        districtId,
        category: "GRAND FINALE: INTERPOLATION",
        visual: "interpolation-gap",
        visualData: {
          sequence: [20, '?', '?', 50],
          known1: { pos: 1, val: 20 },
          known2: { pos: 4, val: 50 },
        },
        questionText: "Insert two arithmetic means between 20 and 50 to complete the telemetry corridor.",
        options: makeOptions("30 and 40", ["25 and 35", "35 and 45", "32 and 42"]),
        correctAnswer: "30 and 40",
        explanation: "Three steps between 20 and 50: 3d = 50 − 20 = 30, so d = 10. The intermediate terms are 30 and 40.",
        hint1: "Divide the total gap (50 − 20 = 30) by 3.",
        hint2: "Each step is 10: 20 ➔ 30 ➔ 40 ➔ 50.",
      };
    }
    case 3: {
      // Membership challenge
      return {
        id: `w9_q${qNum}`,
        districtId,
        category: "GRAND FINALE: RADAR LOCK",
        visual: "sequence-strip",
        visualData: { terms: [5, 11, 17, 23], d: 6 },
        questionText: "A flight path starts at 5 and jumps by 6 every checkpoint. Which checkpoint reaches altitude 65m?",
        options: makeOptions("Checkpoint T11", ["Checkpoint T10", "Checkpoint T12", "Not on flight path"]),
        correctAnswer: "Checkpoint T11",
        explanation: "Set 65 = 5 + (n − 1) × 6. Then 60 = 6(n − 1) ➔ n − 1 = 10 ➔ n = 11.",
        hint1: "Subtract 5 from 65, then divide by 6.",
        hint2: "60 / 6 = 10, then add 1 to get n.",
      };
    }
    default: {
      // Total Burn Sum Grand Finale
      const a = 10;
      const d = 5;
      const n = 6;
      const sum = sumOfNTerms(a, d, n);
      return {
        id: `w9_q${qNum}`,
        districtId,
        category: "GRAND FINALE: TOTAL BURN",
        visual: "sequence-strip",
        visualData: { terms: [10, 15, 20, 25, 30, 35], d: 5 },
        questionText: "Calculate the total fuel burned over the first 6 checkpoints: 10 + 15 + 20 + 25 + 30 + 35 = ?",
        options: makeOptions(`${sum}`, [`${6 * 10}`, `${sum - 15}`, `${sum + 15}`]),
        correctAnswer: `${sum}`,
        explanation: `S₆ = 6/2 × (First + Last) = 3 × (10 + 35) = 3 × 45 = ${sum} fuel units.`,
        hint1: "Pair the first (10) and last (35) terms, then multiply by n/2 (3).",
        hint2: "10 + 35 = 45. Multiply by 3 = 135.",
      };
    }
  }
}

// ── GENERATE FULL 100 QUESTION BANK ────────────────────────────────────────
export function generateQuestionBank() {
  const questions = [];

  for (let dId = 0; dId < 10; dId++) {
    for (let qNum = 0; qNum < 10; qNum++) {
      let q;
      switch (dId) {
        case 0: q = genWorld0Question(qNum, dId); break;
        case 1: q = genWorld1Question(qNum, dId); break;
        case 2: q = genWorld2Question(qNum, dId); break;
        case 3: q = genWorld3Question(qNum, dId); break;
        case 4: q = genWorld4Question(qNum, dId); break;
        case 5: q = genWorld5Question(qNum, dId); break;
        case 6: q = genWorld6Question(qNum, dId); break;
        case 7: q = genWorld7Question(qNum, dId); break;
        case 8: q = genWorld8Question(qNum, dId); break;
        case 9: q = genWorld9Question(qNum, dId); break;
        default: q = genWorld0Question(qNum, dId); break;
      }
      questions.push(q);
    }
  }

  return questions;
}

const defaultQuestionBank = generateQuestionBank();
export default defaultQuestionBank;
