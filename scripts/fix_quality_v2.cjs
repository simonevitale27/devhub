/**
 * Exercise Text Fixer v2 — Comprehensive
 * 
 * Uses pattern recognition on the SQL query to automatically generate:
 * 1. Richer explanations based on SQL concepts detected
 * 2. Educationally sound hints (never revealing the full solution)
 * 3. Expanded debug hints
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'services', 'exerciseGenerator.ts');
let content = fs.readFileSync(FILE_PATH, 'utf-8');
const lines = content.split('\n');

// ================================
// PARSE ALL EXERCISES WITH LINE POSITIONS
// ================================
const exercises = [];
let currentTopic = null;
let currentDifficulty = null;

const topicMap = { 'TopicId.Basics': 'Basics', 'TopicId.Filtering': 'Filtering', 'TopicId.Sorting': 'Sorting', 'TopicId.Aggregation': 'Aggregation', 'TopicId.Functions': 'Functions', 'TopicId.Dates': 'Dates', 'TopicId.Case': 'Case', 'TopicId.Joins': 'Joins', 'TopicId.Advanced': 'Advanced' };
const diffMap = { 'Difficulty.Easy': 'Easy', 'Difficulty.Medium': 'Medium', 'Difficulty.Hard': 'Hard' };

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  for (const [k, v] of Object.entries(topicMap)) { if (line.includes(`[${k}]:`)) currentTopic = v; }
  for (const [k, v] of Object.entries(diffMap)) { if (line.includes(`[${k}]:`)) currentDifficulty = v; }
  
  const explMatch = line.match(/^explanation:\s*"((?:[^"\\]|\\.)*)"/);
  if (explMatch && currentTopic && currentDifficulty) {
    // Find surrounding exercise data
    let query = '', title = '', desc = '';
    let hintsLine = -1, hintsContent = '';
    let debugHintLine = -1, debugHintContent = '';
    
    for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
      const l = lines[j].trim();
      const qm = l.match(/queryTemplate:\s*"((?:[^"\\]|\\.)*)"/);
      if (qm) query = qm[1];
      const tm = l.match(/titleTemplate:\s*"([^"]*)"/);
      if (tm) title = tm[1];
      const dm = l.match(/descTemplate:\s*"((?:[^"\\]|\\.)*)"/);
      if (dm) desc = dm[1];
      const hm = l.match(/hints:\s*\[(.+)\]/);
      if (hm) { hintsLine = j; hintsContent = hm[1]; }
    }
    
    for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
      const l = lines[j].trim();
      const dhm = l.match(/debugHint:\s*"((?:[^"\\]|\\.)*)"/);
      if (dhm) { debugHintLine = j; debugHintContent = dhm[1]; }
    }
    
    exercises.push({
      topic: currentTopic, difficulty: currentDifficulty,
      title, desc, query, 
      explanation: explMatch[1], explanationLine: i,
      hintsLine, hintsContent, 
      debugHintLine, debugHintContent
    });
  }
}

console.log(`📊 Parsed ${exercises.length} exercises`);

// ================================
// FIX ENGINE
// ================================
let fixCount = 0;
const fixedLines = [...lines];

exercises.forEach(ex => {
  const q = ex.query.toLowerCase();
  const explWords = ex.explanation.split(/\s+/).length;
  
  // --- FIX SHORT EXPLANATIONS (≤ 5 words) ---
  if (explWords <= 5) {
    const newExpl = generateExplanation(ex.query, ex.topic, ex.difficulty);
    if (newExpl && newExpl !== ex.explanation) {
      const oldLine = fixedLines[ex.explanationLine];
      fixedLines[ex.explanationLine] = oldLine.replace(
        /explanation:\s*"[^"]*"/,
        `explanation: "${newExpl.replace(/"/g, '\\"')}"`
      );
      fixCount++;
    }
  }
  
  // --- FIX HINTS THAT REVEAL SOLUTION ---
  if (ex.hintsLine >= 0 && ex.hintsContent) {
    const hints = ex.hintsContent.match(/"((?:[^"\\]|\\.)*)"/g)?.map(h => h.slice(1, -1)) || [];
    let needsFix = false;
    
    // Check if any hint is basically the solution
    hints.forEach(h => {
      const normH = h.toLowerCase().replace(/\s+/g, ' ').trim();
      const normQ = ex.query.toLowerCase().replace(/\s+/g, ' ').trim();
      if (normH.length > 10 && (normQ.includes(normH) || normH.includes(normQ))) {
        needsFix = true;
      }
    });
    
    // Check if only 1 hint that's very short
    if (hints.length === 1 && hints[0].split(/\s+/).length <= 2) {
      needsFix = true;
    }
    
    if (needsFix) {
      const newHints = generateHints(ex.query, ex.topic, ex.difficulty);
      if (newHints) {
        const hintsStr = newHints.map(h => `"${h.replace(/"/g, '\\"')}"`).join(', ');
        const oldLine = fixedLines[ex.hintsLine];
        fixedLines[ex.hintsLine] = oldLine.replace(
          /hints:\s*\[[^\]]*\]/,
          `hints: [${hintsStr}]`
        );
        fixCount++;
      }
    }
  }
  
  // --- FIX SHORT DEBUG HINTS (≤ 2 words) ---
  if (ex.debugHintLine >= 0 && ex.debugHintContent) {
    const words = ex.debugHintContent.split(/\s+/).length;
    if (words <= 2) {
      const newDH = generateDebugHint(ex.query, ex.debugHintContent);
      if (newDH) {
        const oldLine = fixedLines[ex.debugHintLine];
        fixedLines[ex.debugHintLine] = oldLine.replace(
          /debugHint:\s*"[^"]*"/,
          `debugHint: "${newDH.replace(/"/g, '\\"')}"`
        );
        fixCount++;
      }
    }
  }
});

content = fixedLines.join('\n');
fs.writeFileSync(FILE_PATH, content);
console.log(`✅ Applied ${fixCount} fixes`);

// ================================
// GENERATORS
// ================================
function generateExplanation(query, topic, difficulty) {
  const q = query.toLowerCase();
  
  // SELECT DISTINCT
  if (/select\s+distinct/i.test(q)) {
    if (/count/i.test(q)) return "COUNT(DISTINCT ...) conta i valori unici, eliminando i duplicati prima del conteggio.";
    return "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.";
  }
  
  // Subqueries
  if (/\(select/i.test(q)) {
    if (/in\s*\(/i.test(q)) return "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.";
    if (/exists/i.test(q)) return "EXISTS verifica se la subquery correlata restituisce almeno una riga. È spesso più efficiente di IN per dataset grandi.";
    if (/from\s*\(/i.test(q)) return "Una subquery nella clausola FROM crea una tabella temporanea (derived table) che può essere usata come sorgente dati per la query esterna.";
    return "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.";
  }
  
  // Window functions
  if (/over\s*\(/i.test(q)) {
    if (/row_number/i.test(q)) return "ROW_NUMBER() assegna un numero sequenziale a ogni riga nella partizione specificata, utile per ranking e paginazione.";
    if (/rank\b/i.test(q)) return "RANK() assegna una posizione alle righe basata sull'ordinamento, con posizioni uguali per valori identici e salti nelle posizioni successive.";
    if (/dense_rank/i.test(q)) return "DENSE_RANK() funziona come RANK() ma senza salti nelle posizioni: valori uguali condividono la stessa posizione e il successivo è incrementale.";
    if (/sum|avg|count|min|max/i.test(q)) return "Le funzioni finestra aggregate (SUM, AVG, etc. con OVER) calcolano aggregazioni senza raggruppare le righe, mantenendo il dettaglio per ogni riga.";
    return "Le funzioni finestra (window functions) operano su un set di righe correlate alla riga corrente, senza collassare il risultato come GROUP BY.";
  }
  
  // CTE
  if (/with\s+\w+\s+as/i.test(q)) {
    return "Le CTE (Common Table Expressions) con WITH creano tabelle temporanee di nome che migliorano la leggibilità delle query complesse e permettono la composizione modulare.";
  }
  
  // UNION / INTERSECT / EXCEPT
  if (/\bunion\b/i.test(q)) return "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.";
  if (/\bintersect\b/i.test(q)) return "INTERSECT restituisce solo le righe presenti in entrambe le query, trovando l'intersezione dei due set di risultati.";
  if (/\bexcept\b/i.test(q)) return "EXCEPT restituisce le righe della prima query che non compaiono nella seconda, utile per trovare differenze tra set di dati.";
  
  // CASE WHEN
  if (/case\s+when/i.test(q)) {
    if (/sum.*case|case.*sum/i.test(q)) return "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.";
    if (/count.*case|case.*count/i.test(q)) return "COUNT con CASE WHEN permette di contare selettivamente le righe che soddisfano determinate condizioni, utile per pivot e report.";
    return "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.";
  }
  
  // JOINs
  if (/\bjoin\b/i.test(q)) {
    if (/left\s+join/i.test(q)) return "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).";
    if (/right\s+join/i.test(q)) return "RIGHT JOIN restituisce tutte le righe dalla tabella di destra, includendo quelle senza corrispondenza nella tabella sinistra.";
    if (/cross\s+join/i.test(q)) return "CROSS JOIN produce il prodotto cartesiano: ogni riga della prima tabella viene combinata con ogni riga della seconda.";
    if (/self.*join|join.*employees\s+\w+\s+on.*manager/i.test(q)) return "Un self-join collega una tabella con sé stessa, utile per gerarchie come dipendente-manager dove la relazione è nella stessa tabella.";
    if (/group\s+by/i.test(q)) return "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.";
    return "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.";
  }
  
  // HAVING
  if (/having/i.test(q)) {
    return "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.";
  }
  
  // GROUP BY
  if (/group\s+by/i.test(q)) {
    if (/count/i.test(q)) return "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.";
    if (/sum/i.test(q)) return "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.";
    if (/avg/i.test(q)) return "GROUP BY con AVG calcola la media per ogni raggruppamento, utile per confrontare le performance tra categorie o periodi.";
    if (/min|max/i.test(q)) return "GROUP BY con MIN/MAX trova il valore estremo in ogni gruppo, utile per analisi di range e identificazione di outlier.";
    return "GROUP BY aggrega le righe con valori identici nella colonna specificata, permettendo di applicare funzioni come COUNT, SUM, AVG a ogni gruppo.";
  }
  
  // ORDER BY
  if (/order\s+by/i.test(q)) {
    if (/desc/i.test(q) && /limit/i.test(q)) return "ORDER BY con DESC e LIMIT è il pattern classico per ottenere i top-N risultati: ordina dal più grande al più piccolo e prende solo i primi.";
    if (/desc/i.test(q)) return "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).";
    if (/asc/i.test(q)) return "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.";
    if (/,/i.test(q.split(/order by/i)[1] || '')) return "ORDER BY multi-colonna ordina prima per la prima colonna, poi per la seconda in caso di parità. È utile per ordinamenti gerarchici.";
    return "ORDER BY riordina le righe nel risultato finale secondo i valori della colonna specificata.";
  }
  
  // WHERE with specific operators
  if (/where/i.test(q)) {
    if (/\blike\b/i.test(q)) return "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.";
    if (/\bbetween\b/i.test(q)) return "BETWEEN filtra per un intervallo inclusivo di valori, equivalente a >= AND <=. È più leggibile per filtri su range.";
    if (/\bin\s*\(/i.test(q)) return "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.";
    if (/is\s+null/i.test(q)) return "IS NULL verifica se un valore è NULL (assente). Non si può usare = NULL perché NULL non è un valore, è l'assenza di valore.";
    if (/is\s+not\s+null/i.test(q)) return "IS NOT NULL seleziona solo le righe dove il campo ha un valore definito, escludendo i NULL.";
    if (/\band\b.*\bor\b|\bor\b.*\band\b/i.test(q)) return "Combinare AND e OR richiede attenzione alle precedenze: AND ha priorità su OR. Usa le parentesi per controllo esplicito.";
    if (/\band\b/i.test(q)) return "AND combina più condizioni: tutte devono essere vere perché la riga sia inclusa nel risultato.";
    if (/\bor\b/i.test(q)) return "OR include righe che soddisfano almeno una delle condizioni specificate.";
    if (/not/i.test(q)) return "NOT inverte una condizione: seleziona le righe che NON soddisfano il criterio specificato.";
    return "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.";
  }
  
  // LIMIT
  if (/limit/i.test(q)) {
    return "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.";
  }
  
  // Date functions
  if (/year\(|month\(|day\(|date_format|datediff|timestampdiff|now\(\)|dayofyear|week\(|quarter\(|dayname|monthname/i.test(q)) {
    if (/datediff/i.test(q)) return "DATEDIFF calcola la differenza in giorni tra due date, utile per misurare intervalli temporali come l'età di un ordine.";
    if (/timestampdiff/i.test(q)) return "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).";
    if (/date_format/i.test(q)) return "DATE_FORMAT formatta una data secondo il pattern specificato, permettendo di visualizzare date in formati personalizzati.";
    if (/now\(\)/i.test(q)) return "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.";
    if (/year\(/i.test(q)) return "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.";
    if (/month\(/i.test(q)) return "MONTH() restituisce il numero del mese (1-12) da una data, utile per analisi mensili e stagionali.";
    return "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.";
  }
  
  // String functions
  if (/upper\(|lower\(|length\(|substring\(|concat\(|replace\(|trim\(|reverse\(|left\(|right\(|lpad\(|rpad\(/i.test(q)) {
    if (/upper\(/i.test(q)) return "UPPER() converte tutti i caratteri in maiuscolo. Utile per standardizzare dati e per confronti case-insensitive.";
    if (/lower\(/i.test(q)) return "LOWER() converte in minuscolo tutti i caratteri della stringa, utile per normalizzare i dati testuali.";
    if (/length\(/i.test(q)) return "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.";
    if (/concat\(/i.test(q)) return "CONCAT() unisce due o più stringhe in una sola, utile per creare campi composti come nome completo o indirizzi.";
    if (/replace\(/i.test(q)) return "REPLACE() sostituisce tutte le occorrenze di una sottostringa con un'altra, utile per pulizia e normalizzazione dati.";
    if (/substring\(/i.test(q)) return "SUBSTRING() estrae una porzione di testo dalla posizione e lunghezza specificate, utile per parsing di dati strutturati.";
    return "Le funzioni stringa SQL permettono di manipolare e trasformare dati testuali direttamente nelle query.";
  }
  
  // Math functions
  if (/round\(|ceil\(|floor\(|abs\(|mod\(|power\(|sqrt\(/i.test(q)) {
    if (/round\(/i.test(q)) return "ROUND() arrotonda un numero al numero di decimali specificato. Fondamentale per presentare valori monetari e percentuali.";
    if (/ceil\(/i.test(q)) return "CEIL() arrotonda un numero per eccesso all'intero successivo, utile per calcoli di spedizione e allocazione risorse.";
    if (/floor\(/i.test(q)) return "FLOOR() arrotonda per difetto all'intero inferiore, utile per troncamenti e calcoli dove i decimali non servono.";
    return "Le funzioni matematiche SQL permettono di eseguire calcoli numerici direttamente nella query senza elaborazione esterna.";
  }
  
  // COUNT/SUM/AVG/MIN/MAX without GROUP BY
  if (/^select\s+(count|sum|avg|min|max)\(/i.test(q) && !/group\s+by/i.test(q)) {
    if (/count\(\*\)/i.test(q)) return "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.";
    if (/count\(/i.test(q)) return "COUNT(colonna) conta le righe in cui la colonna specificata non è NULL.";
    if (/sum\(/i.test(q)) return "SUM() calcola la somma totale dei valori nella colonna specificata, ignorando i valori NULL.";
    if (/avg\(/i.test(q)) return "AVG() calcola la media aritmetica dei valori, ignorando i NULL. Utile per metriche come prezzo medio o stipendio medio.";
    if (/min\(/i.test(q)) return "MIN() restituisce il valore più piccolo nella colonna, utile per trovare il prezzo minimo, la data più antica, ecc.";
    if (/max\(/i.test(q)) return "MAX() restituisce il valore più grande nella colonna, utile per record massimi e analisi di picco.";
  }
  
  // Arithmetic operations
  if (/\*\s*\d|\/\s*\d|\+\s*\d|\-\s*\d/i.test(q) && !/\*/i.test(q.split('from')[0]?.replace(/\*\s*\d/g, ''))) {
    return "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.";
  }
  
  // AS alias
  if (/\bas\b/i.test(q) && !/case/i.test(q)) {
    return "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.";
  }
  
  // Simple SELECT
  if (/^select\s+\*\s+from/i.test(q)) {
    return "SELECT * seleziona tutte le colonne della tabella. In produzione è meglio specificare le colonne necessarie per performance e chiarezza.";
  }
  
  if (/^select\s+\w+\s+from/i.test(q)) {
    return "Selezionare colonne specifiche (proiezione) è una best practice: riduce il trasferimento di dati e rende la query più esplicita.";
  }
  
  return null;
}

function generateHints(query, topic, difficulty) {
  const q = query.toLowerCase();
  
  // Map SQL patterns to educationally sound hints
  if (/select\s+distinct/i.test(q)) {
    const col = query.match(/distinct\s+(\w+)/i)?.[1] || 'colonna';
    return [`Usa DISTINCT per eliminare i valori ripetuti`, `La colonna da rendere unica è ${col}`];
  }
  
  if (/case\s+when/i.test(q)) {
    return [`Usa CASE WHEN per classificare i valori`, `Ricorda di chiudere con END`];
  }
  
  if (/\bjoin\b/i.test(q)) {
    const tables = query.match(/from\s+(\w+).*join\s+(\w+)/i);
    if (tables) return [`Collega le tabelle ${tables[1]} e ${tables[2]}`, `Usa la clausola ON per specificare la condizione di collegamento`];
    return [`Serve un JOIN tra le tabelle`, `Specifica la condizione ON per il collegamento`];
  }
  
  if (/group\s+by/i.test(q)) {
    const col = query.match(/group\s+by\s+(\w+)/i)?.[1] || 'colonna';
    return [`Raggruppa per la colonna ${col}`, `Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT`];
  }
  
  if (/order\s+by/i.test(q)) {
    const col = query.match(/order\s+by\s+(\w+)/i)?.[1] || 'colonna';
    const dir = /desc/i.test(q) ? 'decrescente (DESC)' : 'crescente';
    return [`Ordina per ${col} in ordine ${dir}`, `ORDER BY si mette dopo la clausola WHERE (se presente)`];
  }
  
  if (/where/i.test(q)) {
    if (/like/i.test(q)) return [`Usa LIKE per il confronto con pattern`, `Il simbolo % sostituisce qualsiasi sequenza di caratteri`];
    if (/between/i.test(q)) return [`Usa BETWEEN per filtrare un intervallo`, `BETWEEN include entrambi gli estremi`];
    if (/in\s*\(/i.test(q)) return [`Usa IN per confrontare con una lista di valori`, `I valori nella lista vanno separati da virgola`];
    if (/is\s+null/i.test(q)) return [`Per verificare i valori nulli usa IS NULL`, `Non usare = NULL, non funziona in SQL`];
    return [`Usa WHERE per filtrare le righe`, `Specifica la condizione dopo WHERE`];
  }
  
  if (/\bover\s*\(/i.test(q)) {
    return [`Usa una window function con la clausola OVER`, `PARTITION BY suddivide i dati in gruppi per il calcolo`];
  }
  
  if (/\bwith\b.*\bas\b\s*\(/i.test(q)) {
    return [`Usa una CTE con la sintassi WITH nome AS (...)`, `La query principale si scrive dopo la definizione della CTE`];
  }
  
  // Aggregation without GROUP BY
  if (/^select\s+(count|sum|avg|min|max)\(/i.test(q)) {
    const fn = query.match(/(COUNT|SUM|AVG|MIN|MAX)\(/i)?.[1] || 'aggregazione';
    return [`Usa la funzione ${fn.toUpperCase()}()`, `Le funzioni aggregate operano sull'intero set se non c'è GROUP BY`];
  }
  
  // Simple SELECT
  if (/^select\s+\w+/i.test(q)) {
    const table = query.match(/from\s+(\w+)/i)?.[1] || 'tabella';
    return [`Seleziona dalla tabella ${table}`, `Specifica il nome delle colonne dopo SELECT`];
  }
  
  return null;
}

function generateDebugHint(query, currentHint) {
  const q = query.toLowerCase();
  
  if (/\bjoin\b/i.test(q)) return "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON.";
  if (/group\s+by/i.test(q)) return "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento.";
  if (/order\s+by/i.test(q)) return "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista.";
  if (/where/i.test(q)) return "Controlla la sintassi della clausola WHERE e i valori nel confronto.";
  if (/case/i.test(q)) return "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END.";
  if (/distinct/i.test(q)) return "DISTINCT va subito dopo SELECT, prima del nome della colonna.";
  if (/having/i.test(q)) return "HAVING si usa dopo GROUP BY per filtrare i gruppi aggregati.";
  if (/\bover\b/i.test(q)) return "La clausola OVER() definisce la finestra su cui opera la funzione.";
  if (/\bas\b/i.test(q)) return "Usa AS dopo l'espressione o la colonna per assegnarle un alias.";
  
  // Generic
  return "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle.";
}
