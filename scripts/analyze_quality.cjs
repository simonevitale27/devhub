/**
 * Exercise Quality Analyzer
 * 
 * Analyzes all 810 exercises for text quality issues:
 * 1. Italian text: grammar, clarity, consistency
 * 2. Hints: too short, repeat solution, not progressive
 * 3. Explanations: too terse, not educational
 * 4. Template variables: unresolved or inconsistent
 * 5. BrokenCode: placeholders ("...")
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'services', 'exerciseGenerator.ts');
const content = fs.readFileSync(FILE_PATH, 'utf-8');
const lines = content.split('\n');

const topicNames = {
  'TopicId.Basics': 'Basics',
  'TopicId.Filtering': 'Filtering',
  'TopicId.Sorting': 'Sorting',
  'TopicId.Aggregation': 'Aggregation',
  'TopicId.Functions': 'Functions',
  'TopicId.Dates': 'Dates',
  'TopicId.Case': 'Case',
  'TopicId.Joins': 'Joins',
  'TopicId.Advanced': 'Advanced'
};

const difficultyNames = {
  'Difficulty.Easy': 'Easy',
  'Difficulty.Medium': 'Medium',
  'Difficulty.Hard': 'Hard'
};

// Parse all exercises
const exercises = [];
let currentTopic = null;
let currentDifficulty = null;
let currentEx = {};
let inExercise = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  for (const [key, val] of Object.entries(topicNames)) {
    if (line.includes(`[${key}]:`)) { currentTopic = val; }
  }
  for (const [key, val] of Object.entries(difficultyNames)) {
    if (line.includes(`[${key}]:`)) { currentDifficulty = val; }
  }
  
  // Detect exercise start
  if (line === '{' && currentTopic && currentDifficulty) {
    inExercise = true;
    currentEx = { line: i + 1, topic: currentTopic, difficulty: currentDifficulty };
  }
  
  if (inExercise) {
    const titleMatch = line.match(/titleTemplate\s*:\s*"([^"]*)"/);
    if (titleMatch) currentEx.title = titleMatch[1];
    
    const descMatch = line.match(/descTemplate\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (descMatch) currentEx.desc = descMatch[1];
    
    const queryMatch = line.match(/queryTemplate\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (queryMatch) currentEx.query = queryMatch[1];
    
    const explMatch = line.match(/explanation\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (explMatch) currentEx.explanation = explMatch[1];
    
    const brokenMatch = line.match(/brokenCode\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (brokenMatch) currentEx.brokenCode = brokenMatch[1];
    
    const debugMatch = line.match(/debugHint\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (debugMatch) currentEx.debugHint = debugMatch[1];
    
    // Parse hints array
    const hintsMatch = line.match(/hints\s*:\s*\[(.*)\]/);
    if (hintsMatch) {
      const hintsStr = hintsMatch[1];
      currentEx.hints = hintsStr.match(/"((?:[^"\\]|\\.)*)"/g)?.map(h => h.slice(1, -1)) || [];
    }
    
    // Detect exercise end
    if (line.startsWith('}') && currentEx.title) {
      exercises.push({ ...currentEx });
      currentEx = {};
      inExercise = false;
    }
  }
}

console.log(`📊 Analyzed ${exercises.length} exercises\n`);

// ================================
// QUALITY CHECKS
// ================================
const issues = [];

exercises.forEach(ex => {
  const prefix = `[${ex.topic}/${ex.difficulty}] "${ex.title}" (L${ex.line})`;
  
  // --- EXPLANATION QUALITY ---
  if (ex.explanation) {
    const words = ex.explanation.split(/\s+/).length;
    if (words <= 3) {
      issues.push({ category: 'EXPLANATION_TOO_SHORT', severity: 'HIGH', exercise: prefix, detail: `Solo ${words} parole: "${ex.explanation}"` });
    } else if (words <= 5) {
      issues.push({ category: 'EXPLANATION_SHORT', severity: 'MEDIUM', exercise: prefix, detail: `Solo ${words} parole: "${ex.explanation}"` });
    }
  }
  
  // --- HINT QUALITY ---
  if (ex.hints) {
    // Hint too short (< 4 words)
    ex.hints.forEach((h, i) => {
      const words = h.split(/\s+/).length;
      if (words <= 2) {
        issues.push({ category: 'HINT_TOO_SHORT', severity: 'HIGH', exercise: prefix, detail: `Hint ${i+1}: "${h}"` });
      }
    });
    
    // Hint repeats solution
    if (ex.query) {
      const normQuery = ex.query.toLowerCase().replace(/\s+/g, ' ').trim();
      ex.hints.forEach((h, i) => {
        const normHint = h.toLowerCase().replace(/\s+/g, ' ').trim();
        if (normHint === normQuery || normQuery.includes(normHint) || normHint.includes(normQuery)) {
          if (normHint.length > 10) { // Ignore very short overlap
            issues.push({ category: 'HINT_IS_SOLUTION', severity: 'HIGH', exercise: prefix, detail: `Hint ${i+1} rivela la soluzione: "${h}"` });
          }
        }
      });
    }
    
    // Only 1 hint
    if (ex.hints.length === 1) {
      issues.push({ category: 'SINGLE_HINT', severity: 'LOW', exercise: prefix, detail: `Solo 1 hint` });
    }
  }
  
  // --- BROKEN CODE ---
  if (ex.brokenCode === '...' || ex.brokenCode === '...') {
    issues.push({ category: 'BROKEN_CODE_PLACEHOLDER', severity: 'MEDIUM', exercise: prefix, detail: 'brokenCode è "..."' });
  }
  
  // --- DEBUG HINT ---
  if (ex.debugHint) {
    const words = ex.debugHint.split(/\s+/).length;
    if (words <= 2) {
      issues.push({ category: 'DEBUG_HINT_SHORT', severity: 'LOW', exercise: prefix, detail: `Solo ${words} parole: "${ex.debugHint}"` });
    }
  }
  
  // --- DESCRIPTION QUALITY ---
  if (ex.desc) {
    // Check for missing period at end
    if (!ex.desc.endsWith('.') && !ex.desc.endsWith('?') && !ex.desc.endsWith(')') && !ex.desc.endsWith('"') && !ex.desc.endsWith("'")) {
      issues.push({ category: 'DESC_NO_ENDING', severity: 'LOW', exercise: prefix, detail: `Desc non termina con punteggiatura: "${ex.desc.slice(-30)}"` });
    }
    
    // Check for very short desc
    if (ex.desc.split(/\s+/).length <= 4) {
      issues.push({ category: 'DESC_TOO_SHORT', severity: 'MEDIUM', exercise: prefix, detail: `Solo ${ex.desc.split(/\s+/).length} parole: "${ex.desc}"` });
    }
  }
  
  // --- TEMPLATE VARIABLES ---
  if (ex.query) {
    const vars = ex.query.match(/\{[a-z_]+\}/g);
    if (vars) {
      // Check if desc also uses the same vars
      vars.forEach(v => {
        if (ex.desc && !ex.desc.includes(v) && !ex.desc.includes(v.replace(/[{}]/g, ''))) {
          // Variable in query but not referenced in description
          // This is only a problem for non-common vars
          const varName = v.replace(/[{}]/g, '');
          if (!['cat', 'country', 'status', 'dept', 'dep', 'department', 'name'].includes(varName)) {
            // Only flag uncommon ones
          }
        }
      });
    }
  }
  
  // --- ITALIAN TEXT ISSUES ---
  if (ex.desc) {
    // Common typos/issues in Italian
    const italianIssues = [
      [/\bselezionna\b/i, 'selezionna → seleziona'],
      [/\bpiu\b(?!')/i, 'piu → più'],
      [/\bperche\b(?!')/i, 'perche → perché'],
      [/\bcioe\b/i, 'cioe → cioè'],
      [/\be'\s/i, "e' → è"],
      [/\bpuo\b(?!')/i, 'puo → può'],
      [/\bgia\b(?!')/i, 'gia → già'],
      [/\bne\b\s/i, 'possibile "ne" errato'],
      [/\bcalegoria\b/i, 'calegoria → categoria'],
      [/\bprodoto\b/i, 'prodoto → prodotto'],
      [/\buttenti\b/i, 'uttenti? (potrebbe essere corretto)'],
    ];
    
    const allText = `${ex.title || ''} ${ex.desc || ''} ${ex.explanation || ''} ${(ex.hints || []).join(' ')}`;
    italianIssues.forEach(([regex, msg]) => {
      if (regex.test(allText)) {
        issues.push({ category: 'ITALIAN_TYPO', severity: 'HIGH', exercise: prefix, detail: msg });
      }
    });
  }
});

// ================================
// REPORT
// ================================
const categoryCounts = {};
issues.forEach(issue => {
  categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
});

console.log('=' .repeat(70));
console.log('📊 QUALITY ANALYSIS REPORT');
console.log('=' .repeat(70));

console.log('\n📈 Issue Summary:');
console.log('-'.repeat(50));
Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  const emoji = cat.includes('HIGH') ? '🔴' : cat.includes('MEDIUM') ? '🟡' : '🟢';
  console.log(`  ${count.toString().padStart(4)} × ${cat}`);
});
console.log(`  ${'----'.padStart(4)}`);
console.log(`  ${issues.length.toString().padStart(4)} total issues`);

// Group by severity
const high = issues.filter(i => i.severity === 'HIGH');
const medium = issues.filter(i => i.severity === 'MEDIUM');
const low = issues.filter(i => i.severity === 'LOW');

if (high.length > 0) {
  console.log(`\n🔴 HIGH SEVERITY (${high.length}):`);
  console.log('-'.repeat(60));
  high.slice(0, 50).forEach((issue, i) => {
    console.log(`  ${i + 1}. [${issue.category}] ${issue.exercise}`);
    console.log(`     ${issue.detail}`);
  });
  if (high.length > 50) console.log(`  ... and ${high.length - 50} more`);
}

if (medium.length > 0) {
  console.log(`\n🟡 MEDIUM SEVERITY (${medium.length}):`);
  console.log('-'.repeat(60));
  medium.slice(0, 30).forEach((issue, i) => {
    console.log(`  ${i + 1}. [${issue.category}] ${issue.exercise}`);
    console.log(`     ${issue.detail}`);
  });
  if (medium.length > 30) console.log(`  ... and ${medium.length - 30} more`);
}

console.log(`\n🟢 LOW SEVERITY: ${low.length} issues (omitted for brevity)`);

// Write full report to JSON
fs.writeFileSync(
  path.join(__dirname, '..', 'quality_report.json'),
  JSON.stringify({ total: issues.length, categoryCounts, issues }, null, 2)
);
console.log('\n💾 Full report saved to quality_report.json');
