// src/utils/progressionMath.js
// Pure helper functions for arithmetic sequences
// Compliant with PRD §14 and TRD §4.4 requirements (clean integer constraints, negative-d representation)

/**
 * Random integer between min and max inclusive.
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a clean first term 'a' from a range.
 * Default: integers between -10 and 40 (excluding 0 unless specified).
 */
export function pickCleanFirstTerm(options = {}) {
  const { min = -10, max = 40, excludeZero = false } = options;
  let a = randomInt(min, max);
  if (excludeZero && a === 0) a = Math.random() > 0.5 ? 2 : -2;
  return a;
}

/**
 * Pick a clean non-zero common difference 'd'.
 * Per PRD §14: healthy proportion of negative values (40-50% chance).
 */
export function pickCleanCommonDifference(options = {}) {
  const {
    min = 2,
    max = 12,
    allowNegative = true,
    forceNegative = false,
  } = options;

  const magnitude = randomInt(min, max);
  if (forceNegative) return -magnitude;
  if (!allowNegative) return magnitude;

  // 45% chance of negative d to actively counter the "AP must increase" misconception
  const isNegative = Math.random() < 0.45;
  return isNegative ? -magnitude : magnitude;
}

/**
 * Generates an arithmetic sequence of given length.
 * @param {number} a - First term
 * @param {number} d - Common difference
 * @param {number} length - Number of terms (default 5)
 * @returns {number[]} Array of terms
 */
export function generateArithmeticSequence(a, d, length = 5) {
  const seq = [];
  for (let i = 0; i < length; i++) {
    seq.push(a + i * d);
  }
  return seq;
}

/**
 * Generates a sequence that matches an AP for its first gaps, then deliberately breaks at breakAtIndex.
 * Ensures the "check every pair" skill is genuinely tested.
 * @param {number} a - First term
 * @param {number} d - Intended common difference
 * @param {number} breakAtIndex - The term index (1-based, e.g. 3 or 4) where the expected step breaks
 * @param {number} length - Total terms (default 5)
 * @returns {{ sequence: number[], breakIndex: number, expectedTerm: number, actualTerm: number }}
 */
export function generateNonArithmeticSequence(a, d, breakAtIndex = null, length = 5) {
  // If breakAtIndex is not provided, pick an index from 2 to length - 1 (so at least 1 or 2 initial gaps match!)
  const actualBreak = breakAtIndex ?? randomInt(2, Math.max(2, length - 1));
  const seq = [a];

  for (let i = 1; i < length; i++) {
    if (i === actualBreak) {
      // Deliberately introduce an error: difference is off by +1, -1, +2, or -2
      const delta = (Math.random() > 0.5 ? 1 : -1) * (randomInt(1, 3));
      const corruptedTerm = seq[i - 1] + d + delta;
      seq.push(corruptedTerm);
    } else {
      seq.push(seq[i - 1] + d);
    }
  }

  const expectedTerm = a + actualBreak * d;
  return {
    sequence: seq,
    breakIndex: actualBreak,
    expectedTerm,
    actualTerm: seq[actualBreak],
    correctDifference: d,
  };
}

/**
 * Evaluates Tn = a + (n - 1)d.
 * @param {number} a - First term
 * @param {number} d - Common difference
 * @param {number} n - Position (1-indexed)
 * @returns {number} The n-th term
 */
export function findTermAtPosition(a, d, n) {
  if (n < 1) throw new Error("n must be a positive integer >= 1");
  return a + (n - 1) * d;
}

/**
 * Solves for unknown among {a, d, n, Tn}, or from two points (n1, Tn1) and (n2, Tn2).
 * Guarantees clean integer arithmetic when used with curated inputs.
 */
export function solveForUnknown(known) {
  // Case 1: Given two (position, term) pairs: (n1, t1) and (n2, t2)
  if (known.n1 != null && known.t1 != null && known.n2 != null && known.t2 != null) {
    const { n1, t1, n2, t2 } = known;
    const d = (t2 - t1) / (n2 - n1);
    const a = t1 - (n1 - 1) * d;
    return { a, d };
  }

  // Case 2: Given Tn, d, n -> solve for a: a = Tn - (n - 1)d
  if (known.Tn != null && known.d != null && known.n != null && known.a == null) {
    const a = known.Tn - (known.n - 1) * known.d;
    return { a, d: known.d, n: known.n, Tn: known.Tn };
  }

  // Case 3: Given Tn, a, n -> solve for d: d = (Tn - a) / (n - 1)
  if (known.Tn != null && known.a != null && known.n != null && known.d == null) {
    if (known.n === 1) return { a: known.a, d: 0, n: 1, Tn: known.Tn };
    const d = (known.Tn - known.a) / (known.n - 1);
    return { a: known.a, d, n: known.n, Tn: known.Tn };
  }

  // Case 4: Given Tn, a, d -> solve for n: n = (Tn - a)/d + 1
  if (known.Tn != null && known.a != null && known.d != null && known.n == null) {
    if (known.d === 0) return { a: known.a, d: 0, n: 1, Tn: known.Tn };
    const n = Math.round((known.Tn - known.a) / known.d) + 1;
    return { a: known.a, d: known.d, n, Tn: known.Tn };
  }

  return known;
}

/**
 * Interpolates missing terms between two non-adjacent terms.
 * @param {number} term1 - Value of first known term
 * @param {number} pos1 - Position of first known term (1-indexed)
 * @param {number} term2 - Value of second known term
 * @param {number} pos2 - Position of second known term (1-indexed)
 * @returns {{ d: number, a: number, intermediateTerms: Array<{ pos: number, val: number }> }}
 */
export function interpolateTerms(term1, pos1, term2, pos2) {
  const d = (term2 - term1) / (pos2 - pos1);
  const a = term1 - (pos1 - 1) * d;
  const intermediateTerms = [];

  const start = Math.min(pos1, pos2) + 1;
  const end = Math.max(pos1, pos2);

  for (let p = start; p < end; p++) {
    intermediateTerms.push({ pos: p, val: a + (p - 1) * d });
  }

  return { d, a, intermediateTerms };
}

/**
 * Inserts `count` arithmetic means between numbers a and b.
 * @param {number} a - Starting boundary
 * @param {number} b - Ending boundary
 * @param {number} count - Number of means to insert
 * @returns {number[]} Array of inserted means
 */
export function insertArithmeticMeans(a, b, count = 1) {
  const d = (b - a) / (count + 1);
  const means = [];
  for (let i = 1; i <= count; i++) {
    means.push(a + i * d);
  }
  return means;
}

/**
 * Checks whether target is a member of the AP defined by a and d.
 * Solves a + (n - 1)d = target for n.
 * Returns { isMember, position } where position is positive integer.
 */
export function isMemberOfSequence(a, d, target) {
  if (d === 0) {
    return { isMember: target === a, position: target === a ? 1 : null };
  }
  const diff = target - a;
  if (diff % d !== 0) {
    return { isMember: false, position: null };
  }
  const n = diff / d + 1;
  if (n >= 1 && Number.isInteger(n)) {
    return { isMember: true, position: n };
  }
  return { isMember: false, position: null };
}

/**
 * Computes the sum of the first n terms of an AP:
 * Sn = (n / 2) * (2a + (n - 1)d)
 */
export function sumOfNTerms(a, d, n) {
  if (n < 1) return 0;
  return (n / 2) * (2 * a + (n - 1) * d);
}

/**
 * Formats general term formula to display string.
 * e.g. "Tn = 3 + (n - 1)(4)" or "Tn = 4n - 1"
 */
export function formatGeneralTermString(a, d) {
  const dStr = d < 0 ? `(${d})` : `${d}`;
  return `Tₙ = ${a} + (n − 1) × ${dStr}`;
}

/**
 * Formats sum formula to display string.
 */
export function formatSumString(a, d, n) {
  const tn = findTermAtPosition(a, d, n);
  return `S_${n} = ${n}/2 × (${a} + ${tn})`;
}
