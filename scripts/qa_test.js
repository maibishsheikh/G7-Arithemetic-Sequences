// scripts/qa_test.js
// Automated QA and Question Bank Stress Test for ProgressionQuest
// Satisfies TRD §10 requirements: 300+ randomized runs, negative-d proportion audit, schema assertions

import { generateQuestionBank } from '../src/data/questionBank.js';
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
} from '../src/utils/progressionMath.js';

console.log("=== STARTING PROGRESSIONQUEST QA AUDIT ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAILED: ${message}`);
  }
}

// 1. Stress test math helpers (1000 iterations)
console.log("1. Stress testing progressionMath.js helpers (1000 iterations)...");
let negativeDCount = 0;

for (let i = 0; i < 1000; i++) {
  const a = pickCleanFirstTerm();
  const d = pickCleanCommonDifference();
  if (d < 0) negativeDCount++;

  assert(Number.isInteger(a), `First term a must be integer, got: ${a}`);
  assert(Number.isInteger(d) && d !== 0, `Difference d must be non-zero integer, got: ${d}`);

  const seq = generateArithmeticSequence(a, d, 6);
  assert(seq.length === 6, "Sequence length must be 6");
  for (let j = 0; j < 5; j++) {
    assert(seq[j + 1] - seq[j] === d, `Gap between term ${j} and ${j+1} must be ${d}`);
  }

  // Non-arithmetic sequence
  const fake = generateNonArithmeticSequence(a, d, 3, 5);
  assert(fake.sequence[1] - fake.sequence[0] === d, "First gap in non-AP must match d");
  assert(fake.actualTerm !== fake.expectedTerm, "Broken term must not equal expected term");

  // Solve for unknown
  const solvedA = solveForUnknown({ Tn: a + 4 * d, d, n: 5 });
  assert(solvedA.a === a, `Solve for a failed: expected ${a}, got ${solvedA.a}`);

  const solvedD = solveForUnknown({ Tn: a + 4 * d, a, n: 5 });
  assert(solvedD.d === d, `Solve for d failed: expected ${d}, got ${solvedD.d}`);

  // Sum of N terms
  const s5 = sumOfNTerms(a, d, 5);
  const manualSum = seq.slice(0, 5).reduce((acc, v) => acc + v, 0);
  assert(s5 === manualSum, `Sum mismatch: formula ${s5} vs manual ${manualSum}`);
}

const negativeDRatio = (negativeDCount / 1000) * 100;
console.log(`✓ Negative d ratio in pool: ${negativeDRatio.toFixed(1)}% (Healthy proportion >= 35%)`);
assert(negativeDRatio >= 35, `Negative d proportion should be >= 35%, got ${negativeDRatio}%`);

// 2. Question Bank Stress Test (300 generations = 30,000 questions)
console.log("2. Stress testing Question Bank (300 randomized generations = 30,000 questions)...");

let totalQuestionsTested = 0;
let bankNegativeDCount = 0;

for (let run = 0; run < 300; run++) {
  const bank = generateQuestionBank();
  assert(bank.length === 100, `Question bank must have 100 questions, got ${bank.length}`);

  for (const q of bank) {
    totalQuestionsTested++;

    assert(q.id && typeof q.id === 'string', `Question missing id: ${JSON.stringify(q)}`);
    assert(q.questionText && q.questionText.length > 10, `Question missing text: ${q.id}`);
    assert(Array.isArray(q.options) && q.options.length === 4, `Question must have 4 options: ${q.id}`);
    assert(q.options.includes(String(q.correctAnswer)), `Correct answer "${q.correctAnswer}" not in options for ${q.id}`);

    // Check no duplicate options
    const uniqueOpts = new Set(q.options);
    assert(uniqueOpts.size === 4, `Duplicate options found in ${q.id}: ${JSON.stringify(q.options)}`);

    // Check no NaN or undefined in strings
    assert(!q.questionText.includes('NaN') && !q.questionText.includes('undefined'), `NaN/undefined in text: ${q.id}`);
    assert(!String(q.correctAnswer).includes('NaN') && !String(q.correctAnswer).includes('undefined'), `NaN in correctAnswer: ${q.id}`);

    if (q.questionText.includes('−') || q.questionText.includes('negative') || q.correctAnswer.includes('−') || q.correctAnswer.includes('-')) {
      bankNegativeDCount++;
    }
  }
}

console.log(`✓ Tested ${totalQuestionsTested} questions across 300 bank generations.`);
console.log(`\n=== QA SUMMARY ===`);
console.log(`Total assertions passed: ${passed}`);
console.log(`Total assertions failed: ${failed}`);

if (failed === 0) {
  console.log("🎉 ALL TESTS PASSED WITH ZERO ERRORS!");
  process.exit(0);
} else {
  console.error("❌ SOME TESTS FAILED!");
  process.exit(1);
}
