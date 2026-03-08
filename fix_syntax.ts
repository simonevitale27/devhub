import fs from 'fs';

let content = fs.readFileSync('services/exerciseGenerator.ts', 'utf-8');

const replacements = [
    // LEFT/RIGHT unsupported in alasql parser -> use SUBSTR / CONCAT / SUBSTRING
    { from: /LEFT\(([^,]+),\s*([0-9]+)\)/g, to: "SUBSTR($1, 1, $2)" },
    { from: /RIGHT\(([^,]+),\s*([0-9]+)\)/g, to: "SUBSTR($1, LENGTH($1) - $2 + 1, $2)" },
    
    // TRUNCATE unsupported in alasql parser -> use ROUND with 0 or FLOOR
    { from: /TRUNCATE\(([^,]+),\s*0\)/g, to: "ROUND($1, 0)" },
    { from: /TRUNCATE/g, to: "ROUND" }, // fallback
    
    // EXCLUDING unsupported -> use EXCEPT
    { from: /EXCLUDING \(/g, to: "EXCEPT (" },
    { from: /EXCLUDING/g, to: "EXCEPT" },

    // STRFTIME unsupported in our polyfill / alasql -> Use DATE_FORMAT or YEAR/MONTH
    { from: /STRFTIME\('%Y',\s*([^)]+)\)/g, to: "YEAR($1)" },
    { from: /STRFTIME\('%m',\s*([^)]+)\)/g, to: "MONTH($1)" },
    
    // TO_DAYS / FROM_DAYS unsupported, replace with DATEDIFF / ADDDATE
    { from: /FROM_DAYS\(738500\)/g, to: "DATE_ADD('0000-01-01', INTERVAL 738500 DAY)" }, // approximate pseudo
    
    // SEC_TO_TIME unsupported
    { from: /SEC_TO_TIME\(100000\)/g, to: "TIME(FROM_UNIXTIME(100000))" },
    
    // DAYOFYEAR unsupported, replace with generic
    { from: /DAYOFYEAR\(([^)]+)\)/g, to: "DATEDIFF($1, MAKEDATE(YEAR($1), 1)) + 1" },

    // Fix query 'LEFT(name, 1) ASC' -> 'SUBSTR(name, 1, 1) ASC'
    // Already covered by LEFT replacement

    // Fix 'is_premium = 1' and 'is_premium = 0' to TRUE and FALSE
    { from: /is_premium = 1/g, to: "is_premium = TRUE" },
    { from: /is_premium = 0/g, to: "is_premium = FALSE" }
];

replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
});

// Write back
fs.writeFileSync('services/exerciseGenerator.ts', content);
console.log("exerciseGenerator.ts syntax fixes applied.");
