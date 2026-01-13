const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filePath = path.join(__dirname, '../services/pythonExerciseGenerator.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Regex to find solutionCode, starterCode, brokenCode
// Matches: key: "value"
const regex = /(solutionCode|starterCode|brokenCode):\s*"((?:[^"\\]|\\.)*)"/g;

let match;
let count = 0;
let errors = 0;

console.log("Checking Python syntax in exercises...");

while ((match = regex.exec(content)) !== null) {
    const type = match[1];
    let code = match[2];

    // Unescape the string
    code = code.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

    // Skip empty code (sometimes brokenCode is empty)
    if (!code.trim()) continue;

    // Skip "brokenCode" syntax check? 
    // The user wants to check syntax. Broken code MIGHT have syntax errors INTENTIONALLY.
    // However, usually mistakes in brokenCode are logical, or specific syntax errors.
    // If brokenCode is MEANT to be syntax error (e.g. missing parenthesis), then checking it will fail.
    // The user asked "verificare che non ci siano problemi di sintassi".
    // I should probably check ONLY solutionCode and starterCode for VALIDITY.
    // brokenCode is expected to be broken. Checking it would produce false positives.
    if (type === 'brokenCode') continue;

    count++;
    
    // Create a temp file
    const tempFile = path.join(__dirname, 'temp_check.py');
    fs.writeFileSync(tempFile, code);

    try {
        // Run python3 compilation check
        execSync(`python3 -m py_compile "${tempFile}"`, { stdio: 'pipe' });
    } catch (e) {
        console.error(`\n[ERROR] Syntax error in ${type}:`);
        console.error("-".repeat(20));
        console.error(code);
        console.error("-".repeat(20));
        console.error(e.message); // py_compile usually prints to stderr, captured loop
        errors++;
    } finally {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
}

console.log(`\nChecked ${count} snippets.`);
if (errors === 0) {
    console.log("✅ All starterCode and solutionCode are valid Python.");
} else {
    console.log(`❌ Found ${errors} syntax errors.`);
    process.exit(1);
}
