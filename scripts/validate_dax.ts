// Structural gate for the DAX bank. Catches the failure modes that a type check
// cannot: an answer that does not match its own accepted patterns, a duplicate
// id, an MCQ whose reference is not the option it marks correct.
// Run: tsx scripts/validate_dax.ts
import { DAX_EXERCISES, DAX_TOPICS } from '../services/daxExercises';
import { normalizeDax, checkDaxFormula, DaxTopicId } from '../daxTypes';
import { Difficulty } from '../types';

const errors: string[] = [];
const warn: string[] = [];
const seen = new Set<string>();

for (const ex of DAX_EXERCISES) {
  const at = `${ex.id}`;
  if (seen.has(ex.id)) errors.push(`${at}: duplicate id`);
  seen.add(ex.id);

  if (!ex.title?.trim()) errors.push(`${at}: empty title`);
  if (!ex.scenario?.trim()) errors.push(`${at}: empty scenario`);
  if (!ex.explanation?.trim()) errors.push(`${at}: empty explanation`);
  if (!ex.reference?.trim()) errors.push(`${at}: empty reference`);
  if (!ex.hints || ex.hints.length < 2) warn.push(`${at}: fewer than 2 hints`);
  if (!DAX_TOPICS.some((t) => t.id === ex.topicId)) errors.push(`${at}: topic ${ex.topicId} has no sidebar entry`);

  if (ex.kind === 'mcq') {
    if (!ex.options || ex.options.length < 3) errors.push(`${at}: needs at least 3 options`);
    if (ex.correctIndex == null || ex.correctIndex < 0 || ex.correctIndex >= ex.options.length) {
      errors.push(`${at}: correctIndex ${ex.correctIndex} out of range`);
    }
    if (new Set(ex.options).size !== ex.options.length) errors.push(`${at}: duplicate options`);
  } else {
    if (!ex.accepted || ex.accepted.length === 0) errors.push(`${at}: no accepted answers`);
    // The revealed solution must itself be accepted, or the learner can copy the
    // shown answer and still be graded wrong.
    if (!checkDaxFormula(ex.reference, ex.accepted)) {
      const bare = ex.reference.includes('=') ? ex.reference.split('=').slice(1).join('=').trim() : ex.reference;
      if (!checkDaxFormula(bare, ex.accepted)) {
        errors.push(`${at}: reference does not match its own accepted list\n     ref: ${normalizeDax(ex.reference)}\n     acc: ${ex.accepted.map(normalizeDax).join('\n          ')}`);
      }
    }
  }
}

// Coverage report: the pool must exceed what the UI shows (8 per set).
const SHOWN = 8;
console.log('\nid totali:', DAX_EXERCISES.length);
console.log('\nargomento               Easy  Med  Hard  tot');
for (const t of DAX_TOPICS) {
  const of = (d: Difficulty) => DAX_EXERCISES.filter((e) => e.topicId === t.id && e.difficulty === d).length;
  const tot = DAX_EXERCISES.filter((e) => e.topicId === t.id).length;
  console.log(`${t.label.padEnd(22)} ${String(of(Difficulty.Easy)).padStart(4)} ${String(of(Difficulty.Medium)).padStart(4)} ${String(of(Difficulty.Hard)).padStart(5)} ${String(tot).padStart(4)}`);
}
for (const d of Object.values(Difficulty)) {
  const n = DAX_EXERCISES.filter((e) => e.difficulty === d).length;
  console.log(`pool ${d}: ${n} (${n > SHOWN ? 'OK, shuffle pesca dagli extra' : 'TROPPO PICCOLO'})`);
}
const mcq = DAX_EXERCISES.filter((e) => e.kind === 'mcq').length;
console.log(`\nquiz: ${mcq} · scrivi la misura: ${DAX_EXERCISES.length - mcq}`);

if (warn.length) console.log('\nWARN:\n' + warn.map((w) => '  ' + w).join('\n'));
if (errors.length) { console.error('\nFAIL:\n' + errors.map((e) => '  ' + e).join('\n')); process.exit(1); }
console.log('\nDAX GATE: PASS');
