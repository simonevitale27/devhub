/**
 * Exercise Text Fixer
 * 
 * Automatically improves all exercises:
 * 1. Expands terse explanations with educational content
 * 2. Replaces solution-revealing hints with guiding ones
 * 3. Generates proper brokenCode for "..." placeholders
 * 4. Ensures at least 2 hints per exercise
 * 5. Expands short debug hints
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'services', 'exerciseGenerator.ts');
let content = fs.readFileSync(FILE_PATH, 'utf-8');

// ================================
// EXPLANATION IMPROVEMENTS
// Maps short explanation patterns to expanded versions
// ================================
const explanationFixes = {
  // Basics
  'Lista contatti.': 'La proiezione su una singola colonna permette di estrarre solo i dati necessari, riducendo la dimensione del risultato.',
  'Analisi provenienza geografica.': 'Selezionare una singola colonna è utile quando serve analizzare solo una dimensione dei dati, come la distribuzione geografica degli utenti.',
  'Proiezione multipla.': 'Selezionando più colonne separate da virgola si ottiene una vista personalizzata dei dati, scegliendo solo le informazioni rilevanti.',
  'Alias multipli.': 'Gli alias multipli permettono di rinominare contemporaneamente più colonne nel risultato, migliorando la leggibilità dei report.',
  'Dati temporali.': 'Le colonne di tipo data contengono informazioni temporali utili per analisi cronologiche e filtraggio per periodi.',
  'Timeline ordini.': 'Selezionare le date degli ordini permette di analizzare la distribuzione temporale delle vendite.',
  'Monitoraggio stati.': 'Visualizzare lo stato degli ordini è utile per monitorare il flusso operativo e identificare eventuali colli di bottiglia.',
  'Analisi volumi vendite.': 'I totali degli ordini permettono di analizzare i volumi di vendita e calcolare metriche come il valore medio dell\'ordine.',
  'Volume fisico vendite.': 'Le quantità vendute sono fondamentali per l\'analisi della domanda e la gestione dell\'inventario.',
  'Struttura aziendale.': 'Visualizzare i dipartimenti aiuta a comprendere la struttura organizzativa dell\'azienda e le aree funzionali.',
  'Rubrica dipendenti.': 'Estrarre la lista dei nomi dei dipendenti è il primo passo per creare report del personale.',
  'Status abbonamento utenti.': 'Il campo booleano is_premium distingue gli utenti con abbonamento premium da quelli con account gratuito.',
  'Colonne calcolate al volo.': 'SQL permette di creare colonne calcolate direttamente nella query, senza modificare i dati originali nella tabella.',
  'Calcolo imposte in proiezione.': 'Moltiplicare il prezzo per 1.22 aggiunge il 22% di IVA, creando una colonna calcolata con il prezzo finale.',
  'Operazioni tra colonne della stessa riga.': 'Moltiplicando due colonne si ottiene un valore calcolato per ogni riga, utile per stimare il valore dell\'inventario.',
  'Calcolo importi parziali.': 'Moltiplicando quantità per prezzo unitario si ottiene l\'importo di ogni riga dell\'ordine.',
  'Lista univoca reparti.': 'DISTINCT elimina i duplicati dal risultato, mostrando ogni valore una sola volta.',
  'Enumerazione stati workflow.': 'DISTINCT applicato alla colonna status rivela tutti gli stati possibili nel ciclo di vita di un ordine.',
  'Proiezione specifica multi-colonna.': 'Selezionare colonne specifiche permette di costruire viste mirate sui dati, combinando solo le informazioni necessarie.',
  'Analisi geografica.': 'Usare DISTINCT sulla colonna country elimina i duplicati e mostra tutti i paesi rappresentati nel database.',
  'Catalogo categorie.': 'DISTINCT applicato alla categoria produce la lista delle categorie merceologiche disponibili nel catalogo.',
  'Struttura org.': 'DISTINCT sulla colonna department restituisce la lista dei reparti aziendali senza ripetizioni.',
  'Lista capi.': 'I manager_id unici rappresentano tutti i supervisori presenti nell\'organigramma aziendale.',
  'Identificazione clienti paganti.': 'Selezionare gli user_id distinti dagli ordini identifica tutti i clienti che hanno effettuato almeno un acquisto.',
  'Analisi copertura catalogo.': 'I product_id unici negli ordini mostrano quanti prodotti del catalogo sono stati effettivamente venduti.',
  'KPI di magazzino.': 'Il valore di magazzino (prezzo × stock) è un indicatore chiave per la gestione dell\'inventario e la contabilità.',
  'Colonne costanti.': 'Aggiungere una colonna calcolata con valore costante è utile per proiezioni e stime rapide.',
  'Scorporo IVA.': 'Separare il prezzo netto dall\'importo IVA è fondamentale per la fatturazione e la contabilità fiscale.',
  'Preventivo rapido.': 'Con un\'espressione calcolata puoi simulare scenari di prezzo, come sconti sulla quantità, direttamente nella query.',
  'Calcolo percentuale semplice.': 'Dividere per 2 è equivalente a uno sconto del 50%. Le operazioni aritmetiche nelle query permettono calcoli al volo.',
  'Lista stati possibili.': 'DISTINCT fornisce la lista completa degli stati possibili, utile per validazione e analisi del workflow.',
  // Sorting
  'Lettura facile.': 'L\'ordinamento alfabetico facilita la ricerca visiva dei dati e rende i report più leggibili.',
  'Storico prezzi.': 'Ordinare per prezzo permette di analizzare la distribuzione dei prezzi e identificare prodotti economici o costosi.',
  'Lettura cronologica.': 'L\'ordinamento cronologico è essenziale per analizzare le tendenze temporali e la sequenza degli eventi.',
  'Report organizzato.': 'Ordinare i risultati rende i report più professionali e facilita la lettura da parte degli utenti.',
  'Ordine per reparto.': 'Raggruppare i dipendenti per dipartimento facilita l\'analisi organizzativa e la gestione del personale.',
  'Valore decrescente.': 'L\'ordinamento decrescente (DESC) mostra prima i valori più alti, utile per top-ranking.',
  // Aggregation
  'Totale righe.': 'COUNT(*) conta tutte le righe della tabella, incluse quelle con valori NULL.',
  'Valore medio.': 'AVG calcola la media aritmetica dei valori nella colonna specificata, ignorando i NULL.',
  'Combinazione aggregazione e filtri.': 'Combinare WHERE con funzioni aggregate permette di calcolare metriche su sottoinsiemi specifici di dati.',
  // Functions
  'Testo maiuscolo.': 'UPPER converte tutti i caratteri di una stringa in maiuscolo, utile per normalizzare i dati o formattare output.',
  'Testo minuscolo.': 'LOWER converte in minuscolo, utile per confronti case-insensitive o normalizzazione dei dati.',
  'Calcolo lunghezza.': 'LENGTH conta il numero di caratteri di una stringa, utile per validazione dati e filtri sulla lunghezza.',
  'Estrazione sottostringhe.': 'SUBSTRING estrae una porzione di testo da una posizione specifica, utile per parsing e manipolazione stringhe.',
  // Joins
  'Collegamento tabelle.': 'JOIN collega righe di tabelle diverse basandosi su una condizione di uguaglianza tra colonne correlate.',
  'Relazione base.': 'Il JOIN tra Users e Orders collega ogni ordine al suo cliente, permettendo di visualizzare informazioni da entrambe le tabelle.',
  // Date 
  'Estrazione anno.': 'YEAR() estrae il componente anno da un campo data, utile per raggruppamenti e filtri annuali.',
  'Estrazione mese.': 'MONTH() restituisce il numero del mese (1-12) da una data, utile per analisi mensili.',
  // Case
  'Classificazione condizionale.': 'CASE WHEN permette di creare categorie personalizzate basate su condizioni, trasformando valori in etichette leggibili.',
  'Etichettatura dati.': 'CASE WHEN è lo strumento SQL per implementare logiche condizionali, simile a if-else nei linguaggi di programmazione.',
};

// Count fixes applied
let fixCount = 0;

// Apply explanation fixes
for (const [oldExpl, newExpl] of Object.entries(explanationFixes)) {
  const escaped = oldExpl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(explanation:\\s*)"${escaped}"`, 'g');
  const newContent = content.replace(regex, `$1"${newExpl.replace(/"/g, '\\"')}"`);
  if (newContent !== content) {
    const matches = content.match(regex);
    fixCount += matches ? matches.length : 0;
    content = newContent;
  }
}

console.log(`✅ Fixed ${fixCount} short explanations`);

// ================================
// FIX HINTS THAT REVEAL THE SOLUTION
// Replace hints that are just the SQL answer with guiding hints
// ================================
let hintFixCount = 0;

// Common pattern: hints: ["SELECT DISTINCT status"]  →  better hints
const hintFixes = [
  // Patterns where hint IS the solution
  { pattern: /hints:\s*\["SELECT DISTINCT status"\]/, replacement: 'hints: ["Usa la keyword DISTINCT per eliminare i duplicati", "La colonna da selezionare è status dalla tabella Orders"]' },
  { pattern: /hints:\s*\["DISTINCT country"\]/, replacement: 'hints: ["Usa DISTINCT per ottenere valori unici", "Seleziona dalla tabella Users"]' },
  { pattern: /hints:\s*\["DISTINCT department"\]/, replacement: 'hints: ["DISTINCT elimina i valori ripetuti", "Il campo del dipartimento si trova nella tabella Employees"]' },
  { pattern: /hints:\s*\["DISTINCT product_id"\]/, replacement: 'hints: ["Devi trovare i valori unici di product_id", "Cerca nella tabella OrderItems"]' },
  { pattern: /hints:\s*\["DISTINCT order_id"\]/, replacement: 'hints: ["Cerca gli order_id unici", "La tabella è OrderItems"]' },
  { pattern: /hints:\s*\["price AS Costo_Unitario"\]/, replacement: 'hints: ["Rinomina la colonna prezzo con un alias significativo", "Usa la keyword AS per creare un alias"]' },
  { pattern: /hints:\s*\["SELECT \* FROM Orders"\]/, replacement: 'hints: ["Usa l\'asterisco per selezionare tutte le colonne", "La tabella degli ordini si chiama Orders"]' },
  { pattern: /hints:\s*\["SELECT \* FROM Employees"\]/, replacement: 'hints: ["L\'asterisco seleziona tutte le colonne disponibili", "La tabella dei dipendenti è Employees"]' },
];

hintFixes.forEach(({ pattern, replacement }) => {
  const newContent = content.replace(pattern, replacement);
  if (newContent !== content) {
    hintFixCount++;
    content = newContent;
  }
});

// Fix single-word/two-word hints
const shortHintPatterns = [
  { pattern: /hints:\s*\["Solo category"\]/, replacement: 'hints: ["Seleziona solo la colonna category", "La tabella è Products"]' },
  { pattern: /hints:\s*\["Colonna order_date"\]/, replacement: 'hints: ["Serve la colonna che contiene la data dell\'ordine", "Il campo si chiama order_date nella tabella Orders"]' },
  { pattern: /hints:\s*\["Colonna status"\]/, replacement: 'hints: ["Cerca il campo che rappresenta lo stato dell\'ordine", "Il campo si chiama status nella tabella Orders"]' },
  { pattern: /hints:\s*\["Colonna order_total"\]/, replacement: 'hints: ["Serve la colonna con l\'importo totale", "Si chiama order_total nella tabella Orders"]' },
  { pattern: /hints:\s*\["Colonna unit_price"\]/, replacement: 'hints: ["Cerca il prezzo unitario nella tabella giusta", "La colonna si chiama unit_price in OrderItems"]' },
  { pattern: /hints:\s*\["Colonna department"\]/, replacement: 'hints: ["Seleziona il campo del dipartimento", "La tabella dei dipendenti è Employees"]' },
  { pattern: /hints:\s*\["Colonna name"\]/, replacement: 'hints: ["Seleziona il campo con il nome", "La tabella è Employees"]' },
  { pattern: /hints:\s*\["SELECT email ..."\]/, replacement: 'hints: ["Seleziona solo il campo email", "La tabella degli utenti è Users"]' },
  { pattern: /hints:\s*\["Solo la data"\]/, replacement: 'hints: ["Cerca il campo con la data di registrazione", "Il campo si chiama created_at nella tabella Users"]' },
  { pattern: /hints:\s*\["Usa DISTINCT"\]/, replacement: 'hints: ["DISTINCT elimina i duplicati dal risultato", "Posiziona DISTINCT subito dopo SELECT"]' },
  { pattern: /hints:\s*\["Addizione semplice"\]/, replacement: 'hints: ["Usa l\'operatore + per sommare valori", "Puoi aggiungere un numero fisso a una colonna"]' },
  { pattern: /hints:\s*\["Due alias distinti"\]/, replacement: 'hints: ["Rinomina entrambe le colonne usando AS", "Separa le colonne con la virgola"]' },
  { pattern: /hints:\s*\["Usa SELECT \\*"\]/, replacement: 'hints: ["L\'asterisco dopo SELECT seleziona tutte le colonne", "Non dimenticare la clausola FROM seguita dal nome della tabella"]' },
];

shortHintPatterns.forEach(({ pattern, replacement }) => {
  const newContent = content.replace(pattern, replacement);
  if (newContent !== content) {
    hintFixCount++;
    content = newContent;
  }
});

console.log(`✅ Fixed ${hintFixCount} problematic hints`);

// ================================
// FIX BROKEN CODE PLACEHOLDERS
// Replace "..." with realistic broken versions of the query
// ================================
let brokenFixCount = 0;

// Strategy: for each exercise with brokenCode: "...", generate a realistic broken version
// We'll do this by finding the pattern: queryTemplate + brokenCode: "..." and generating a fix

const lines = content.split('\n');
const fixedLines = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  
  // Look for brokenCode: "..."
  if (line.trim() === 'brokenCode: "...",' || line.trim() === 'brokenCode: "...",') {
    // Look back to find the queryTemplate
    let query = null;
    let title = null;
    for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
      const queryMatch = lines[j].match(/queryTemplate:\s*"((?:[^"\\]|\\.)*)"/);
      if (queryMatch) { query = queryMatch[1]; }
      const titleMatch = lines[j].match(/titleTemplate:\s*"([^"]*)"/);
      if (titleMatch) { title = titleMatch[1]; }
    }
    
    if (query) {
      const broken = generateBrokenCode(query);
      if (broken && broken !== '...') {
        const indent = line.match(/^(\s*)/)[1];
        fixedLines.push(`${indent}brokenCode: "${broken.replace(/"/g, '\\"')}",`);
        brokenFixCount++;
        i++;
        continue;
      }
    }
  }
  
  fixedLines.push(line);
  i++;
}

content = fixedLines.join('\n');
console.log(`✅ Fixed ${brokenFixCount} brokenCode placeholders`);

// ================================
// FIX SHORT DEBUG HINTS (≤2 words)
// ================================
let debugFixCount = 0;

const debugFixes = [
  { pattern: /debugHint:\s*"order_total\."/, replacement: 'debugHint: "Il nome della colonna è order_total, controlla di averlo scritto correttamente."' },
  { pattern: /debugHint:\s*"SELECT quantity\."/, replacement: 'debugHint: "Usa SELECT quantity dalla tabella OrderItems."' },
  { pattern: /debugHint:\s*"created_at\."/, replacement: 'debugHint: "Il campo della data di registrazione si chiama created_at."' },
  { pattern: /debugHint:\s*"Usa DISTINCT\."/, replacement: 'debugHint: "Aggiungi DISTINCT subito dopo la keyword SELECT per eliminare i duplicati."' },
  { pattern: /debugHint:\s*"Usa \/ 2\."/, replacement: 'debugHint: "Per calcolare la metà del prezzo, dividi per 2 usando l\'operatore /."' },
  { pattern: /debugHint:\s*"Usa \* 1\.22\."/, replacement: 'debugHint: "Per aggiungere il 22% di IVA, moltiplica il prezzo per 1.22."' },
  { pattern: /debugHint:\s*"price \* stock\."/, replacement: 'debugHint: "Moltiplica le colonne price e stock per ottenere il valore dell\'inventario."' },
  { pattern: /debugHint:\s*"quantity \* unit_price\."/, replacement: 'debugHint: "Il totale di riga si calcola moltiplicando quantity per unit_price."' },
  { pattern: /debugHint:\s*"Usa le virgole\."/, replacement: 'debugHint: "Separa i nomi delle colonne con virgole nella clausola SELECT."' },
  { pattern: /debugHint:\s*"Usa AS\."/, replacement: 'debugHint: "La keyword AS si usa dopo il nome della colonna per assegnarle un alias."' },
  { pattern: /debugHint:\s*"SELECT status\.\.\."/, replacement: 'debugHint: "Usa SELECT status FROM Orders per selezionare lo stato degli ordini."' },
];

debugFixes.forEach(({ pattern, replacement }) => {
  const newContent = content.replace(pattern, replacement);
  if (newContent !== content) {
    debugFixCount++;
    content = newContent;
  }
});

console.log(`✅ Fixed ${debugFixCount} short debug hints`);

// ================================
// SAVE
// ================================
fs.writeFileSync(FILE_PATH, content);
console.log(`\n💾 Saved fixed file`);
console.log(`📊 Total fixes: ${fixCount + hintFixCount + brokenFixCount + debugFixCount}`);

// ================================
// HELPER FUNCTIONS
// ================================
function generateBrokenCode(query) {
  const q = query.trim();
  
  // SELECT * FROM Table → various breaks
  if (/^SELECT \* FROM \w+$/i.test(q)) {
    const table = q.match(/FROM\s+(\w+)/i)[1];
    const breaks = [
      `SELEC * FROM ${table}`,     // Typo in SELECT
      `SELECT * ${table}`,          // Missing FROM
      `SELECT FROM ${table}`,       // Missing *
      `SELECT * FROM ${table.toLowerCase()}s`, // Wrong table name
    ];
    return breaks[Math.floor(Math.random() * breaks.length)];
  }
  
  // SELECT col FROM Table → breaks
  if (/^SELECT \w+ FROM \w+$/i.test(q)) {
    const col = q.match(/SELECT\s+(\w+)/i)[1];
    const table = q.match(/FROM\s+(\w+)/i)[1];
    const breaks = [
      `SELECT ${col} ${table}`,     // Missing FROM
      `SELECT ${table} FROM ${col}`, // Swapped table and column
      `SELCT ${col} FROM ${table}`,  // Typo
    ];
    return breaks[Math.floor(Math.random() * breaks.length)];
  }
  
  // SELECT col1, col2 FROM Table → missing comma
  if (/^SELECT \w+,\s*\w+/i.test(q)) {
    return q.replace(/,\s*/, ' '); // Remove first comma
  }
  
  // SELECT DISTINCT col FROM → DISTINCT position error  
  if (/DISTINCT/i.test(q)) {
    return q.replace(/SELECT DISTINCT/i, 'SELECT').replace(/FROM/, 'DISTINCT FROM');
  }
  
  // SELECT col AS alias → IS instead of AS
  if (/\bAS\b/i.test(q)) {
    return q.replace(/\bAS\b/i, 'IS');
  }
  
  // Arithmetic operations → missing operator
  if (/[+\-*\/]\s*\d/i.test(q)) {
    return q.replace(/\s*[+\-*\/]\s*/, ' ');
  }
  
  // WHERE clause → wrong operator
  if (/WHERE/i.test(q)) {
    if (/=\s*'/.test(q)) {
      return q.replace(/=\s*'/, "== '"); // Wrong equality
    }
    if (/>\s*/.test(q)) {
      return q.replace(/>/, '<'); // Inverted comparison
    }
    return q.replace(/WHERE/i, 'WERE'); // Typo
  }
  
  // ORDER BY → missing BY
  if (/ORDER BY/i.test(q)) {
    return q.replace(/ORDER BY/i, 'ORDER');
  }
  
  // GROUP BY → missing BY
  if (/GROUP BY/i.test(q)) {
    return q.replace(/GROUP BY/i, 'GROUP');
  }
  
  // JOIN → missing ON
  if (/JOIN.*ON/i.test(q)) {
    return q.replace(/\s+ON\s+/i, ' ');
  }
  
  // HAVING → misspelled
  if (/HAVING/i.test(q)) {
    return q.replace(/HAVING/i, 'HEAVING');
  }
  
  // CASE WHEN → missing WHEN
  if (/CASE\s+WHEN/i.test(q)) {
    return q.replace(/CASE\s+WHEN/i, 'CASE');
  }
  
  // Subquery → remove parenthesis
  if (/\(SELECT/i.test(q)) {
    return q.replace(/\(SELECT/, 'SELECT');
  }
  
  // Generic: introduce a typo in the first keyword
  if (q.startsWith('SELECT')) {
    return 'SELCET' + q.slice(6);
  }
  
  return null;
}
