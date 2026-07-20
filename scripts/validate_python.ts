// Execution gate for the Python bank: every solution is actually run with the
// system python3 and its stdout compared to the declared expectedOutput.
// Inspection cannot catch an off-by-one in an expected value; running it can.
// Run: tsx scripts/validate_python.ts
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PYTHON_TOPICS, PythonTopicId } from '../pythonTypes';
import { generatePythonExercises } from '../services/pythonExerciseGenerator';
import { Difficulty } from '../types';

const dir = mkdtempSync(join(tmpdir(), 'pygate-'));
const norm = (s: string) => s.replace(/\r\n/g, '\n').trimEnd();

// Nothing is exempt: every solution in every topic is executed. An expectedOutput
// that nobody ran is just a guess, and three Libraries exercises were unsolvable
// precisely because their expected value had never been compared to reality.
const NO_RUN = new Set<PythonTopicId>([]);
process.env.MPLBACKEND = 'Agg'; // keep any seaborn figure headless

const fails: string[] = [];
const warns: string[] = [];
let ran = 0, checked = 0, compiled = 0, skipped = 0;
const seen = new Set<string>();

for (const topic of PYTHON_TOPICS) {
  for (const diff of Object.values(Difficulty)) {
    // Ask for the whole pool, not the shown subset.
    const list = generatePythonExercises(topic.id, diff, 999);
    for (const ex of list) {
      const at = `${topic.label}/${diff}/${ex.title}`;
      checked++;

      if (seen.has(ex.id)) fails.push(`${at}: duplicate id ${ex.id}`);
      seen.add(ex.id);
      if (!ex.solutionCode?.trim()) { fails.push(`${at}: empty solutionCode`); skipped++; continue; }
      if (!ex.explanation?.trim()) warns.push(`${at}: empty explanation`);
      if (!ex.hints?.length) warns.push(`${at}: no hints`);
      if (ex.brokenCode && ex.brokenCode.trim() === ex.solutionCode.trim()) {
        fails.push(`${at}: brokenCode identical to solution (debug mode is unsolvable)`);
      }
      if (ex.brokenCode && /^\s*(\.\.\.|…)\s*$/m.test(ex.brokenCode)) {
        fails.push(`${at}: brokenCode contains a '...' placeholder`);
      }

      const f = join(dir, 'x.py');
      writeFileSync(f, ex.solutionCode);

      if (NO_RUN.has(topic.id)) {
        try {
          execFileSync('python3', ['-m', 'py_compile', f], { stdio: 'pipe' });
        } catch (e: any) {
          fails.push(`${at}: solution does not compile\n     ${String(e.stderr).trim().split('\n').pop()}`);
        }
        compiled++;
        continue;
      }

      let out = '';
      try {
        out = execFileSync('python3', [f], { stdio: 'pipe', timeout: 10000, input: '' }).toString();
        ran++;
      } catch (e: any) {
        fails.push(`${at}: solution raised\n     ${String(e.stderr || e.message).trim().split('\n').pop()}`);
        continue;
      }
      if (norm(out) !== norm(ex.expectedOutput)) {
        fails.push(`${at}: output mismatch\n     atteso:  ${JSON.stringify(norm(ex.expectedOutput))}\n     ottenuto:${JSON.stringify(norm(out))}`);
      }
    }
  }
}

console.log(`\nesercizi controllati: ${checked} · eseguiti con python3: ${ran} · solo compilati: ${compiled} · saltati: ${skipped}`);
if (ran + compiled + skipped !== checked) console.log(`  !! non contabilizzati: ${checked - ran - compiled - skipped}`);
console.log('\nargomento          Easy  Med  Hard  tot');
const SHOWN = 6;
const thin: string[] = [];
for (const t of PYTHON_TOPICS) {
  const n = (d: Difficulty) => generatePythonExercises(t.id, d, 999).length;
  const [e, m, h] = [n(Difficulty.Easy), n(Difficulty.Medium), n(Difficulty.Hard)];
  console.log(`${t.label.padEnd(18)} ${String(e).padStart(4)} ${String(m).padStart(4)} ${String(h).padStart(5)} ${String(e + m + h).padStart(4)}`);
  for (const [d, v] of [['Easy', e], ['Medium', m], ['Hard', h]] as const) {
    if (v <= SHOWN) thin.push(`${t.label}/${d} = ${v} (mostra ${Math.min(v, SHOWN)}, nessun extra da pescare)`);
  }
}
if (thin.length) console.log('\nPOOL SOTTILI (shuffle non ha extra):\n' + thin.map((t) => '  ' + t).join('\n'));
if (warns.length) console.log(`\nWARN (${warns.length}):\n` + warns.slice(0, 15).map((w) => '  ' + w).join('\n'));
if (fails.length) { console.error(`\nFAIL (${fails.length}):\n` + fails.map((f) => '  ' + f).join('\n')); process.exit(1); }
console.log('\nPYTHON GATE: PASS');
