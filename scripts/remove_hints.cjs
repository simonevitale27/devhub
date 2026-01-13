/**
 * Script to remove hint comments from Python starter code
 * Run with: node scripts/remove_hints.cjs
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'services', 'pythonExerciseGenerator.ts');

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match starterCode lines and remove comment-only lines from them
// This regex finds starterCode: "..." and processes the content

// Strategy: Find all starterCode values and clean them
const starterCodeRegex = /starterCode:\s*"([^"]*)"/g;

let match;
let replacements = [];

while ((match = starterCodeRegex.exec(content)) !== null) {
  const original = match[0];
  const codeContent = match[1];
  
  // Split by \n (escaped newline in the string)
  const lines = codeContent.split('\\n');
  
  // Filter out lines that are only comments (start with #)
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    // Keep the line if:
    // - It's not just a comment
    // - It contains actual code (even if it has a comment at the end)
    // - It's an empty line between code
    return !(trimmed.startsWith('#') && !trimmed.includes('='));
  });
  
  // Rebuild the starterCode
  const newCodeContent = filteredLines.join('\\n');
  const newStarterCode = `starterCode: "${newCodeContent}"`;
  
  if (original !== newStarterCode) {
    replacements.push({ original, replacement: newStarterCode });
  }
}

console.log(`Found ${replacements.length} starterCode entries to clean`);

// Apply replacements
replacements.forEach(({ original, replacement }) => {
  content = content.replace(original, replacement);
});

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Done! Removed hint comments from starterCode entries.');
