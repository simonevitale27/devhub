import { SQL_KEYWORDS, SQL_FUNCTIONS } from './sqlConstants';
import { TableInfo } from './ghostTextSuggestions';

/**
 * Detect misspelled words in SQL query
 * Returns array of {word, startIndex, endIndex} for misspelled words
 */
export interface MisspelledWord {
  word: string;
  startIndex: number;
  endIndex: number;
}

// Common Italian words that might appear in database data/column names
const COMMON_ITALIAN_WORDS = [
  'NOME', 'COGNOME', 'EMAIL', 'TELEFONO', 'INDIRIZZO', 'CITTA', 'PROVINCIA',
  'CAP', 'REGIONE', 'PAESE', 'STATO', 'DATA', 'ORA', 'ANNO', 'MESE', 'GIORNO',
  'DESCRIZIONE', 'TITOLO', 'TESTO', 'MESSAGGIO', 'NOTA', 'COMMENTO',
  'PREZZO', 'COSTO', 'TOTALE', 'IMPORTO', 'QUANTITA', 'NUMERO', 'CODICE',
  'TIPO', 'CATEGORIA', 'GRUPPO', 'CLASSE', 'LIVELLO', 'STATO', 'STATUS',
  'UTENTE', 'CLIENTE', 'FORNITORE', 'PRODOTTO', 'SERVIZIO', 'ORDINE',
  'FATTURA', 'PAGAMENTO', 'SPEDIZIONE', 'CONSEGNA', 'SCADENZA',
  'INIZIO', 'FINE', 'ATTIVO', 'DISATTIVO', 'PUBBLICO', 'PRIVATO',
  'AZIENDA', 'SOCIETA', 'DIPARTIMENTO', 'UFFICIO', 'SEDE', 'FILIALE',
  'VIA', 'PIAZZA', 'CORSO', 'VIALE', 'VICOLO', 'STRADA',
  'ITALIA', 'MILANO', 'ROMA', 'NAPOLI', 'TORINO', 'PALERMO', 'GENOVA',
  // Common data values
  'SI', 'NO', 'VERO', 'FALSO', 'MASCHIO', 'FEMMINA', 'UOMO', 'DONNA'
];

// Common English words that might appear in database
const COMMON_ENGLISH_WORDS = [
  'NAME', 'SURNAME', 'FIRSTNAME', 'LASTNAME', 'EMAIL', 'PHONE', 'ADDRESS',
  'CITY', 'COUNTRY', 'STATE', 'REGION', 'ZIPCODE', 'POSTCODE',
  'DATE', 'TIME', 'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND',
  'DESCRIPTION', 'TITLE', 'TEXT', 'MESSAGE', 'NOTE', 'COMMENT',
  'PRICE', 'COST', 'TOTAL', 'AMOUNT', 'QUANTITY', 'NUMBER', 'CODE',
  'TYPE', 'CATEGORY', 'GROUP', 'CLASS', 'LEVEL', 'STATUS',
  'USER', 'CUSTOMER', 'SUPPLIER', 'PRODUCT', 'SERVICE', 'ORDER',
  'INVOICE', 'PAYMENT', 'SHIPPING', 'DELIVERY', 'DEADLINE',
  'START', 'END', 'ACTIVE', 'INACTIVE', 'PUBLIC', 'PRIVATE',
  'COMPANY', 'DEPARTMENT', 'OFFICE', 'BRANCH', 'LOCATION',
  'STREET', 'AVENUE', 'ROAD', 'BOULEVARD', 'LANE',
  // Common data values
  'YES', 'NO', 'TRUE', 'FALSE', 'MALE', 'FEMALE', 'MAN', 'WOMAN'
];

// Common SQL operations and values that should not be flagged
const COMMON_SQL_TOKENS = [
  'TRUE', 'FALSE', 'NULL', 'AND', 'OR', 'NOT',
  ...SQL_KEYWORDS,
  ...SQL_FUNCTIONS,
  ...COMMON_ITALIAN_WORDS,
  ...COMMON_ENGLISH_WORDS
];

export function detectMisspelledWords(
  query: string,
  tables: TableInfo[],
  cursorPosition?: number
): MisspelledWord[] {
  if (!query) return [];

  const misspelled: MisspelledWord[] = [];
  
  // Collect all valid identifiers (table names and column names)
  const validIdentifiers = new Set<string>();
  tables.forEach(table => {
    validIdentifiers.add(table.tableName.toUpperCase());
    table.columns.forEach(col => validIdentifiers.add(col.toUpperCase()));
  });

  // Add all SQL tokens to valid set
  COMMON_SQL_TOKENS.forEach(token => validIdentifiers.add(token.toUpperCase()));

  // Regular expression to match words (excluding strings in quotes)
  // This regex finds words that are not inside single or double quotes
  const wordRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
  
  // Remove string literals first to avoid checking words inside quotes
  let cleanedQuery = query;
  
  // Track positions of string literals to skip them
  const stringRanges: Array<{start: number, end: number}> = [];
  
  // Find single-quoted strings
  const singleQuoteRegex = /'(?:[^'\\]|\\.)*'/g;
  let match;
  while ((match = singleQuoteRegex.exec(query)) !== null) {
    stringRanges.push({ start: match.index, end: match.index + match[0].length });
  }
  
  // Find double-quoted strings
  const doubleQuoteRegex = /"(?:[^"\\]|\\.)*"/g;
  while ((match = doubleQuoteRegex.exec(query)) !== null) {
    stringRanges.push({ start: match.index, end: match.index + match[0].length });
  }

  // Helper function to check if position is inside a string literal
  const isInsideString = (pos: number): boolean => {
    return stringRanges.some(range => pos >= range.start && pos < range.end);
  };

  // Find all words
  while ((match = wordRegex.exec(query)) !== null) {
    const word = match[0];
    const startIndex = match.index;
    const endIndex = startIndex + word.length;

    // Skip if inside a string literal
    if (isInsideString(startIndex)) {
      continue;
    }

    // Skip if cursor is currently in this word (user is still typing)
    if (cursorPosition !== undefined && cursorPosition >= startIndex && cursorPosition <= endIndex) {
      continue;
    }

    // Check if word is valid
    const upperWord = word.toUpperCase();
    
    // Skip if it's a valid identifier, keyword, or function
    if (validIdentifiers.has(upperWord)) {
      continue;
    }

    // Skip numeric-looking identifiers (e.g., "id1", "col2")
    if (/\d/.test(word)) {
      continue;
    }

    // Skip if word is too short (likely an alias or abbreviation)
    if (word.length <= 2) {
      continue;
    }

    // Only flag if word looks like it SHOULD be a SQL keyword but isn't
    // Check if it's similar to any keyword (Levenshtein distance <= 2)
    let isSimilarToKeyword = false;
    for (const token of COMMON_SQL_TOKENS) {
      if (Math.abs(token.length - upperWord.length) <= 2) {
        const distance = levenshteinDistance(upperWord, token);
        if (distance <= 2 && distance > 0) {
          isSimilarToKeyword = true;
          break;
        }
      }
    }

    // Only flag if it looks like a misspelled keyword
    if (!isSimilarToKeyword) {
      continue;
    }

    // Flag as misspelled
    misspelled.push({
      word,
      startIndex,
      endIndex
    });
  }

  return misspelled;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Generate HTML with spell check underlines
 */
export function highlightMisspelledWords(
  html: string,
  misspelledWords: MisspelledWord[]
): string {
  if (misspelledWords.length === 0) return html;

  // Sort by startIndex descending to insert from end to start
  const sorted = [...misspelledWords].sort((a, b) => b.startIndex - a.startIndex);

  // Strip HTML tags to get plain text positions
  // This is a simplified approach - for production, we'd need more robust parsing
  let result = html;
  
  // For each misspelled word, wrap it with underline span
  // Note: This is simplified and assumes the HTML structure matches positions
  // In reality, we need to account for HTML tags in the highlighted version
  
  return result;
}
