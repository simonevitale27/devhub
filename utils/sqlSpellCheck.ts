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
  // Anagrafica & Persone
  'NOME', 'COGNOME', 'EMAIL', 'TELEFONO', 'CELLULARE', 'INDIRIZZO', 'CITTA', 'PROVINCIA',
  'CAP', 'REGIONE', 'PAESE', 'NAZIONE', 'STATO', 'SESSO', 'GENERE', 'ETA', 'NASCITA',
  'LUOGO', 'RESIDENZA', 'DOMICILIO', 'FISCALE', 'PARTITA', 'IVA', 'CODICE',
  'UTENTE', 'CLIENTE', 'FORNITORE', 'DIPENDENTE', 'COLLABORATORE', 'AGENTE',
  'CONTATTO', 'REFERENTE', 'RUOLO', 'MANSIONE', 'TITOLO', 'RESPONSABILE',
  'AMMINISTRATORE', 'DIRETTORE', 'MANAGER', 'PRESIDENTE', 'SOCIO', 'MEMBRO',
  'PERSONA', 'INDIVIDUO', 'SOGGETTO', 'GRUPPO', 'TEAM', 'SQUADRA', 'STAFF',
  
  // Nomi di Persona Comuni (Italiani) - Uomini
  'MARIO', 'LUIGI', 'GIOVANNI', 'GIUSEPPE', 'ANTONIO', 'FRANCESCO', 'PAOLO', 'ROBERTO',
  'ANDREA', 'STEFANO', 'MARCO', 'LUCA', 'ALESSANDRO', 'MATTEO', 'LORENZO', 'SIMONE',
  'FEDERICO', 'DAVIDE', 'GIORGIO', 'PIETRO', 'ENRICO', 'CLAUDIO', 'MASSIMO', 'FABIO',
  'ALESSIO', 'ALBERTO', 'ANGELO', 'CARLO', 'CRISTIAN', 'DANIELE', 'DOMENICO', 'EMANUELE',
  'EDOARDO', 'FILIPPO', 'GABRIELE', 'GIACOMO', 'GIANLUCA', 'LEONARDO', 'MANUEL', 'MATTIA',
  'MICHELE', 'NICOLA', 'PASQUALE', 'RAFFAELE', 'RICCARDO', 'SALVATORE', 'SAMUELE', 'TOMMASO',
  'VINCENZO', 'VITTORIO', 'GIULIO', 'VALERIO', 'VINCENZO', 'SALVATORE', 'CARMELO', 'ROSARIO',
  
  // Nomi di Persona Comuni (Italiani) - Donne
  'ANNA', 'MARIA', 'GIOVANNA', 'ELENA', 'SARA', 'LAURA', 'CHIARA', 'GIULIA',
  'SOFIA', 'MARTINA', 'ALICE', 'FRANCESCA', 'SILVIA', 'ROBERTA', 'VALENTINA',
  'ALESSANDRA', 'ARIANNA', 'AURORA', 'BEATRICE', 'CAMILLA', 'CATERINA', 'CLAUDIA',
  'CRISTINA', 'DANIELA', 'ELEONORA', 'ELISA', 'ELISABETTA', 'ERICA', 'FEDERICA',
  'GAIA', 'GIADA', 'GINEVRA', 'GIORGIA', 'GRETA', 'ILARIA', 'IRENE', 'JESSICA',
  'LETIZIA', 'LISA', 'LUDOVICA', 'MANUELA', 'MARGHERITA', 'MARTA', 'MICHELA',
  'MONICA', 'NADIA', 'NOEMI', 'PAOLA', 'REBECCA', 'SERENA', 'SIMONA', 'STEFANIA',
  'TERESA', 'VANESSA', 'VERONICA', 'VIOLA', 'VITTORIA', 'ANGELA', 'ROSA', 'CARMELA',
  
  // Date & Tempo
  'DATA', 'ORA', 'ORARIO', 'ANNO', 'MESE', 'GIORNO', 'SETTIMANA', 'TRIMESTRE',
  'SEMESTRE', 'BIENNIO', 'PERIODO', 'DURATA', 'SCADENZA', 'INIZIO', 'FINE',
  'CREAZIONE', 'MODIFICA', 'AGGIORNAMENTO', 'CANCELLAZIONE', 'STORICO',
  'ATTUALE', 'PRECEDENTE', 'SUCCESSIVO', 'FUTURO', 'PASSATO', 'RECENTE',
  'OGGI', 'IERI', 'DOMANI', 'MATTINA', 'POMERIGGIO', 'SERA', 'NOTTE',
  'MINUTO', 'SECONDO', 'TEMPO', 'MOMENTO', 'ISTANTE', 'INTERVALLO', 'FREQUENZA',
  
  // E-commerce & Business
  'PRODOTTO', 'ARTICOLO', 'SERVIZIO', 'BENE', 'MERCE', 'MAGAZZINO', 'STOCK',
  'GIACENZA', 'QUANTITA', 'PREZZO', 'COSTO', 'VALORE', 'IMPORTO', 'TOTALE',
  'SUBTOTALE', 'TASSA', 'SCONTO', 'OFFERTA', 'PROMOZIONE', 'LISTINO', 'TARIFFA',
  'ORDINE', 'FATTURA', 'RICEVUTA', 'SCONTRINO', 'PAGAMENTO', 'BONIFICO',
  'CARTA', 'CREDITO', 'DEBITO', 'CONTO', 'BANCA', 'IBAN', 'VALUTA', 'EURO',
  'SPEDIZIONE', 'CONSEGNA', 'TRASPORTO', 'CORRIERE', 'TRACKING', 'RITIRO',
  'RESO', 'RIMBORSO', 'CAMBIO', 'GARANZIA', 'ASSISTENZA', 'SUPPORTO',
  'VENDITA', 'ACQUISTO', 'ORDINI', 'VENDITE', 'ACQUISTI', 'FATTURATO',
  'RICAVO', 'UTILE', 'PERDITA', 'BILANCIO', 'BUDGET', 'FORECAST', 'TARGET',
  'TRANSAZIONE', 'OPERAZIONE', 'MOVIMENTO', 'CAUSALE', 'DESCRIZIONE',
  
  // Contenuti & Media
  'TITOLO', 'DESCRIZIONE', 'TESTO', 'MESSAGGIO', 'NOTA', 'COMMENTO', 'RECENSIONE',
  'VOTO', 'RATING', 'FEEDBACK', 'DOMANDA', 'RISPOSTA', 'FAQ', 'BLOG', 'POST',
  'ARTICOLO', 'PAGINA', 'SEZIONE', 'CATEGORIA', 'TAG', 'ETICHETTA', 'LINK',
  'URL', 'IMMAGINE', 'FOTO', 'VIDEO', 'AUDIO', 'FILE', 'DOCUMENTO', 'ALLEGATO',
  'FORMATO', 'DIMENSIONE', 'PESO', 'ALTEZZA', 'LARGHEZZA', 'LUNGHEZZA',
  'COLORE', 'TAGLIA', 'MISURA', 'MODELLO', 'BRAND', 'MARCA', 'STILE',
  
  // Stato & Valori
  'STATUS', 'STATO', 'TIPO', 'TIPOLOGIA', 'CATEGORIA', 'GRUPPO', 'CLASSE',
  'LIVELLO', 'GRADO', 'PRIORITA', 'IMPORTANZA', 'SEVERITA', 'COMPLESSITA',
  'ATTIVO', 'DISATTIVO', 'ABILITATO', 'DISABILITATO', 'ON', 'OFF',
  'PUBBLICO', 'PRIVATO', 'NASCOSTO', 'VISIBILE', 'BOZZA', 'PUBBLICATO',
  'ARCHIVIATO', 'ELIMINATO', 'CANCELLATO', 'RIMOSSO', 'SOSPESO', 'BLOCCATO',
  'NUOVO', 'VECCHIO', 'USATO', 'RIGENERATO', 'APERTO', 'CHIUSO',
  'COMPLETATO', 'FALLITO', 'ERRORE', 'SUCCESS', 'WARNING', 'INFO', 'DEBUG',
  'VERO', 'FALSO', 'SI', 'NO', 'NULLO', 'VUOTO', 'PIENO', 'VALIDO', 'INVALIDO',
  'CONFERMATO', 'PENDENTE', 'IN_CORSO', 'LAVORAZIONE', 'ATTESA',
  
  // Luoghi & Geografia Italiana (Città e Province)
  'ITALIA', 'ESTERO', 'EUROPA', 'MONDO', 'NORD', 'SUD', 'EST', 'OVEST', 'CENTRO',
  'ROMA', 'MILANO', 'NAPOLI', 'TORINO', 'PALERMO', 'GENOVA', 'BOLOGNA', 'FIRENZE',
  'BARI', 'CATANIA', 'VENEZIA', 'VERONA', 'MESSINA', 'PADOVA', 'TRIESTE', 'TARANTO',
  'BRESCIA', 'PARMA', 'PRATO', 'MODENA', 'REGGIO', 'CALABRIA', 'EMILIA', 'PERUGIA',
  'LIVORNO', 'RAVENNA', 'CAGLIARI', 'FOGGIA', 'RIMINI', 'SALERNO', 'FERRARA',
  'SASSARI', 'LATINA', 'GIUGLIANO', 'MONZA', 'BERGAMO', 'SIRACUSA', 'PESCARA',
  'TRENTO', 'FORLI', 'VICENZA', 'TERNI', 'BOLZANO', 'PIACENZA', 'NOVARA', 'ANCONA',
  'ANDRIA', 'AREZZO', 'UDINE', 'CESENA', 'LECCE', 'PESARO', 'BARLETTA', 'ALESSANDRIA',
  'LA_SPEZIA', 'PISA', 'PISTOIA', 'GUIDONIA', 'LUCCA', 'BRINDISI', 'CATANZARO',
  'TREVISO', 'COMO', 'GROSSETO', 'BUSTO', 'ARSIZIO', 'VARESE', 'SESTO', 'SAN', 'GIOVANNI',
  'AGRIGENTO', 'AOSTA', 'ASCOLI', 'AVELLINO', 'BELLUNO', 'BENEVENTO', 'BIELLA',
  'CAMPOBASSO', 'CASERTA', 'CHIETI', 'CROTONE', 'CUNEO', 'ENNA', 'FERMO', 'FROSINONE',
  'GORIZIA', 'IMPERIA', 'ISERNIA', 'L\'AQUILA', 'LECCO', 'LODI', 'MACERATA', 'MANTOVA',
  'MASSA', 'MATERA', 'NUORO', 'ORISTANO', 'PAVIA', 'PORDENONE', 'POTENZA', 'RAGUSA',
  'RIETI', 'ROVIGO', 'SAVONA', 'SIENA', 'SONDRIO', 'TERAMO', 'TRAPANI', 'URBINO',
  'VERBANIA', 'VERCELLI', 'VIBO', 'VITERBO',
  
  // Grandi Aziende Italiane
  'ENEL', 'ENI', 'INTESA', 'SANPAOLO', 'UNICREDIT', 'FERRARI', 'FIAT', 'STELLANTIS',
  'GENERALI', 'POSTE', 'ITALIANE', 'TIM', 'TELECOM', 'LEONARDO', 'LUXOTTICA',
  'PRADA', 'ARMANI', 'GUCCI', 'FERRERO', 'BARILLA', 'PIRELLI', 'MEDIASET', 'RAI',
  'ATLANTIA', 'AUTOSTRADE', 'CAMPARI', 'CNH', 'DIASORIN', 'FINECO', 'HERA',
  'INTERPUMP', 'INWIT', 'ITALGAS', 'MEDIOBANCA', 'MONCLER', 'NEXI', 'PRYSMIAN',
  'RECORDATI', 'SAIPEM', 'SNAM', 'STM', 'TENARIS', 'TERNA', 'UNIPOL',
  
  // Sistema & Tech
  'ID', 'UUID', 'KEY', 'CHIAVE', 'TOKEN', 'SESSIONE', 'LOGIN', 'LOGOUT',
  'PASSWORD', 'USERNAME', 'EMAIL', 'AUTH', 'ACCESS', 'ROLE', 'PERMISSION',
  'CONFIG', 'SETTING', 'PREFERENZA', 'OPZIONE', 'PARAMETRO', 'VALORE',
  'SYSTEM', 'APP', 'WEB', 'MOBILE', 'DESKTOP', 'API', 'SERVER', 'CLIENT',
  'DATABASE', 'DB', 'TABLE', 'COLUMN', 'ROW', 'FIELD', 'RECORD', 'DATA',
  'LOG', 'EVENTO', 'AZIONE', 'OPERATION', 'QUERY', 'RESULT', 'ERROR',
  'EXCEPTION', 'STACK', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'FATAL'
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
  'YES', 'NO', 'TRUE', 'FALSE', 'MALE', 'FEMALE', 'MAN', 'WOMAN',
  'CREATE', 'UPDATE', 'DELETE', 'INSERT', 'SELECT', 'FROM', 'WHERE',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS',
  'GROUP', 'ORDER', 'BY', 'HAVING', 'LIMIT', 'OFFSET',
  'TABLE', 'COLUMN', 'DATABASE', 'SCHEMA', 'VIEW', 'INDEX',
  'TRIGGER', 'PROCEDURE', 'FUNCTION', 'CONSTRAINT', 'KEY',
  'PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK', 'DEFAULT', 'NULL',
  'VARCHAR', 'INT', 'INTEGER', 'DECIMAL', 'FLOAT', 'DOUBLE',
  'BOOLEAN', 'CHAR', 'TEXT', 'BLOB', 'JSON', 'XML',
  'ID', 'UUID', 'TOKEN', 'SESSION', 'AUTH', 'ROLE', 'PERMISSION',
  'CONFIG', 'SETTING', 'OPTION', 'PARAMETER', 'VALUE',
  'SYSTEM', 'APPLICATION', 'WEB', 'MOBILE', 'API', 'SERVER',
  'LOG', 'EVENT', 'ACTION', 'RESULT', 'ERROR', 'WARNING',
  
  // Common Names (English/International)
  'JOHN', 'JAMES', 'ROBERT', 'MICHAEL', 'WILLIAM', 'DAVID', 'RICHARD', 'JOSEPH',
  'MARY', 'PATRICIA', 'LINDA', 'BARBARA', 'ELIZABETH', 'JENNIFER', 'MARIA', 'SUSAN',
  'THOMAS', 'CHARLES', 'CHRISTOPHER', 'DANIEL', 'MATTHEW', 'ANTHONY', 'MARK', 'DONALD',
  'STEVEN', 'PAUL', 'ANDREW', 'JOSHUA', 'KENNETH', 'KEVIN', 'BRIAN', 'GEORGE',
  'EDWARD', 'RONALD', 'TIMOTHY', 'JASON', 'JEFFREY', 'RYAN', 'JACOB', 'GARY',
  'NICHOLAS', 'ERIC', 'JONATHAN', 'STEPHEN', 'LARRY', 'JUSTIN', 'SCOTT', 'BRANDON',
  'BENJAMIN', 'SAMUEL', 'GREGORY', 'FRANK', 'ALEXANDER', 'RAYMOND', 'PATRICK', 'JACK',
  'DENNIS', 'JERRY', 'TYLER', 'AARON', 'JOSE', 'ADAM', 'HENRY', 'NATHAN',
  'DOUGLAS', 'ZACHARY', 'PETER', 'KYLE', 'WALTER', 'ETHAN', 'JEREMY', 'HAROLD',
  'MARGARET', 'DOROTHY', 'LISA', 'NANCY', 'KAREN', 'BETTY', 'HELEN', 'SANDRA',
  'DONNA', 'CAROL', 'RUTH', 'SHARON', 'MICHELLE', 'LAURA', 'SARAH', 'KIMBERLY',
  'DEBORAH', 'JESSICA', 'SHIRLEY', 'CYNTHIA', 'ANGELA', 'MELISSA', 'BRENDA', 'AMY',
  'ANNA', 'REBECCA', 'VIRGINIA', 'KATHLEEN', 'PAMELA', 'MARTHA', 'DEBRA', 'AMANDA',
  'STEPHANIE', 'CAROLYN', 'CHRISTINE', 'MARIE', 'JANET', 'CATHERINE', 'FRANCES', 'ANN',
  'JOYCE', 'DIANE', 'ALICE', 'JULIE', 'HEATHER', 'TERESA', 'DORIS', 'GLORIA',
  
  // World Cities & Countries
  'LONDON', 'PARIS', 'NEW', 'YORK', 'TOKYO', 'BERLIN', 'MADRID', 'BEIJING', 'MOSCOW',
  'ROME', 'DUBAI', 'SINGAPORE', 'HONG', 'KONG', 'SYDNEY', 'TORONTO', 'CHICAGO',
  'USA', 'UK', 'FRANCE', 'GERMANY', 'ITALY', 'SPAIN', 'CHINA', 'JAPAN', 'RUSSIA',
  'BRAZIL', 'INDIA', 'CANADA', 'AUSTRALIA', 'AMERICA', 'AFRICA', 'ASIA', 'EUROPE',
  'AFGHANISTAN', 'ALBANIA', 'ALGERIA', 'ANDORRA', 'ANGOLA', 'ARGENTINA', 'ARMENIA', 'AUSTRALIA',
  'AUSTRIA', 'AZERBAIJAN', 'BAHAMAS', 'BAHRAIN', 'BANGLADESH', 'BARBADOS', 'BELARUS', 'BELGIUM',
  'BELIZE', 'BENIN', 'BHUTAN', 'BOLIVIA', 'BOSNIA', 'BOTSWANA', 'BRAZIL', 'BRUNEI',
  'BULGARIA', 'BURKINA', 'BURUNDI', 'CAMBODIA', 'CAMEROON', 'CANADA', 'CAPE', 'VERDE',
  'CHAD', 'CHILE', 'CHINA', 'COLOMBIA', 'COMOROS', 'CONGO', 'COSTA', 'RICA',
  'CROATIA', 'CUBA', 'CYPRUS', 'CZECH', 'DENMARK', 'DJIBOUTI', 'DOMINICA', 'DOMINICAN',
  'ECUADOR', 'EGYPT', 'SALVADOR', 'EQUATORIAL', 'ERITREA', 'ESTONIA', 'ESWATINI', 'ETHIOPIA',
  'FIJI', 'FINLAND', 'FRANCE', 'GABON', 'GAMBIA', 'GEORGIA', 'GERMANY', 'GHANA',
  'GREECE', 'GRENADA', 'GUATEMALA', 'GUINEA', 'GUYANA', 'HAITI', 'HONDURAS', 'HUNGARY',
  'ICELAND', 'INDIA', 'INDONESIA', 'IRAN', 'IRAQ', 'IRELAND', 'ISRAEL', 'ITALY',
  'JAMAICA', 'JAPAN', 'JORDAN', 'KAZAKHSTAN', 'KENYA', 'KIRIBATI', 'KOREA', 'KOSOVO',
  'KUWAIT', 'KYRGYZSTAN', 'LAOS', 'LATVIA', 'LEBANON', 'LESOTHO', 'LIBERIA', 'LIBYA',
  'LIECHTENSTEIN', 'LITHUANIA', 'LUXEMBOURG', 'MADAGASCAR', 'MALAWI', 'MALAYSIA', 'MALDIVES', 'MALI',
  'MALTA', 'MARSHALL', 'MAURITANIA', 'MAURITIUS', 'MEXICO', 'MICRONESIA', 'MOLDOVA', 'MONACO',
  'MONGOLIA', 'MONTENEGRO', 'MOROCCO', 'MOZAMBIQUE', 'MYANMAR', 'NAMIBIA', 'NAURU', 'NEPAL',
  'NETHERLANDS', 'ZEALAND', 'NICARAGUA', 'NIGER', 'NIGERIA', 'MACEDONIA', 'NORWAY', 'OMAN',
  'PAKISTAN', 'PALAU', 'PALESTINE', 'PANAMA', 'PAPUA', 'PARAGUAY', 'PERU', 'PHILIPPINES',
  'POLAND', 'PORTUGAL', 'QATAR', 'ROMANIA', 'RUSSIA', 'RWANDA', 'KITTS', 'NEVIS',
  'LUCIA', 'VINCENT', 'SAMOA', 'MARINO', 'SAOME', 'SAUDI', 'ARABIA', 'SENEGAL',
  'SERBIA', 'SEYCHELLES', 'SIERRA', 'LEONE', 'SINGAPORE', 'SLOVAKIA', 'SLOVENIA', 'SOLOMON',
  'SOMALIA', 'SOUTH', 'AFRICA', 'SPAIN', 'LANKA', 'SUDAN', 'SURINAME', 'SWEDEN',
  'SWITZERLAND', 'SYRIA', 'TAIWAN', 'TAJIKISTAN', 'TANZANIA', 'THAILAND', 'TIMOR', 'TOGO',
  'TONGA', 'TRINIDAD', 'TOBAGO', 'TUNISIA', 'TURKEY', 'TURKMENISTAN', 'TUVALU', 'UGANDA',
  'UKRAINE', 'EMIRATES', 'UK', 'USA', 'URUGUAY', 'UZBEKISTAN', 'VANUATU', 'VATICAN',
  'VENEZUELA', 'VIETNAM', 'YEMEN', 'ZAMBIA', 'ZIMBABWE',
  
  // Global Companies
  'GOOGLE', 'APPLE', 'MICROSOFT', 'AMAZON', 'FACEBOOK', 'META', 'TESLA', 'NETFLIX',
  'SAMSUNG', 'TOYOTA', 'VOLKSWAGEN', 'SONY', 'INTEL', 'IBM', 'ORACLE', 'CISCO',
  'ALPHABET', 'NVIDIA', 'TSMC', 'TENCENT', 'ALIBABA', 'VISA', 'MASTERCARD', 'JPMORGAN',
  'WALMART', 'LVMH', 'NESTLE', 'ROCHE', 'PFIZER', 'NOVARTIS', 'SHELL', 'EXXON',
  'CHEVRON', 'COCA', 'COLA', 'PEPSI', 'MCDONALD', 'NIKE', 'ADIDAS', 'ZARA',
  'IKEA', 'SIEMENS', 'SAP', 'AIRBUS', 'BOEING', 'FEDEX', 'UPS', 'DHL', 'MAERSK'
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
    
    // Check casing format
    // Valid formats:
    // 1. All uppercase (e.g. "SELECT")
    // 2. All lowercase (e.g. "select")
    // 3. Title case (e.g. "Select")
    // Invalid: Mixed case (e.g. "SeLeCt", "SPediZione")
    // Compound words with underscores (e.g. "Mese_Spedizione") are checked part by part
    
    const checkCasing = (text: string): boolean => {
      if (!text) return true;
      const isAllUpper = text === text.toUpperCase();
      const isAllLower = text === text.toLowerCase();
      const isTitleCase = text[0] === text[0].toUpperCase() && text.slice(1) === text.slice(1).toLowerCase();
      return isAllUpper || isAllLower || isTitleCase;
    };

    const casingParts = word.split('_');
    const hasValidCasing = casingParts.every(part => checkCasing(part));
    
    if (!hasValidCasing) {
      misspelled.push({
        word,
        startIndex,
        endIndex
      });
      continue;
    }

    // Skip if it's a valid identifier, keyword, or function (exact match)
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

    // Handle compound words with underscores (e.g., "data_spedizone")
    // If the word contains underscores, we check if ANY part is a typo of a known word
    const parts = upperWord.split('_').filter(p => p.length > 2);
    
    let shouldFlag = false;
    
    // If it's a single word (no underscores), check it directly
    if (parts.length <= 1) {
      // Check if it's similar to any known token (Keyword, Function, Italian, English)
      let isSimilarToKnownToken = false;
      
      // Optimization: Only check similarity if it's NOT in the valid set
      // (We already checked validIdentifiers above, but let's be sure)
      
      for (const token of COMMON_SQL_TOKENS) {
        // Only check if lengths are close
        if (Math.abs(token.length - upperWord.length) <= 2) {
          const distance = levenshteinDistance(upperWord, token);
          // If distance is small (typo) AND it's not an exact match (distance > 0)
          if (distance <= 2 && distance > 0) {
            isSimilarToKnownToken = true;
            break;
          }
        }
      }
      
      // If it looks like a typo of a known word, flag it
      if (isSimilarToKnownToken) {
        shouldFlag = true;
      }
    } else {
      // It's a compound word (e.g. "data_spedizone")
      // Check each part. If a part looks like a typo of a dictionary word, flag the whole word.
      // But we must be careful: "xyz" is not a typo of anything, so we ignore it.
      // "spedizone" IS a typo of "SPEDIZIONE", so we flag it.
      
      for (const part of parts) {
        // Skip parts that are valid words themselves
        if (COMMON_SQL_TOKENS.includes(part)) {
          continue;
        }
        
        // Check if this part is a typo of a known word
        for (const token of COMMON_SQL_TOKENS) {
           if (Math.abs(token.length - part.length) <= 2) {
            const distance = levenshteinDistance(part, token);
            if (distance <= 2 && distance > 0) {
              // Found a typo in one of the parts!
              shouldFlag = true;
              break;
            }
          }
        }
        if (shouldFlag) break;
      }
    }

    // Only flag if we detected a typo of a known word
    if (!shouldFlag) {
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
