
interface ReviewResult {
    verdict: 'Funziona' | 'Funziona con problemi' | 'Non funziona';
    correctness: string;
    style: string;
    efficiency: string;
    alternative: string;
    score: number;
    priority: string[];
}

/**
 * Intelligent SQL error explainer
 * Analyzes the error message and optionally the query to provide context-specific help
 */
export const explainSqlError = (errorMessage: string, query?: string): string => {
    const errLower = errorMessage.toLowerCase();
    const queryLower = query?.toLowerCase() || '';
    
    // SYNTAX ERRORS
    if (errLower.includes('parse error') || errLower.includes('syntax')) {
        // Try to identify specific syntax issues
        if (queryLower.includes('selct') || queryLower.includes('selet')) {
            return "Errore di sintassi: sembra esserci un errore di battitura nella parola chiave SELECT. Verifica l'ortografia dei comandi SQL (SELECT, FROM, WHERE, ecc.).";
        }
        if (queryLower.includes('form ') || queryLower.endsWith('form')) {
            return "Errore di sintassi: controlla la parola chiave FROM. Potresti aver scritto FORM invece di FROM per errore.";
        }
        if (queryLower.match(/\bwher\b/) || queryLower.match(/\bwhere[^a-z]/)) {
            return "Errore di sintassi: verifica la parola chiave WHERE. Potrebbe esserci un errore di battitura o una virgola/parentesi mancante.";
        }
        
        // Generic syntax help
        return "Errore di sintassi SQL: la struttura della query non è corretta.\n\nControlla i seguenti punti:\n- Tutte le parole chiave sono scritte correttamente (SELECT, FROM, WHERE, JOIN, GROUP BY)?\n- Hai dimenticato una virgola tra le colonne?\n- Tutte le parentesi aperte sono state chiuse?\n- Le stringhe di testo sono racchiuse tra apici singoli?\n\nSuggerimento: usa il pulsante Formatta per visualizzare meglio la struttura della query e individuare l'errore.";
    }
    
    // TABLE NOT FOUND
    if ((errLower.includes('table') && errLower.includes('exist')) || 
        errLower.includes('table') && errLower.includes('not found')) {
        return "Tabella non trovata: stai tentando di accedere a una tabella che non esiste nel database.\n\nCosa fare:\n- Controlla lo Schema Database nel pannello a sinistra\n- Verifica l'ortografia del nome della tabella (attenzione alle maiuscole e minuscole)\n- Le tabelle disponibili sono: utenti, prodotti, ordini, categorie, fornitori, spedizioni, recensioni\n\nSuggerimento: usa il pulsante Mostra Schema DB per visualizzare il diagramma completo delle relazioni.";
    }
    
    // COLUMN NOT FOUND
    if ((errLower.includes('column') && errLower.includes('exist')) || 
        errLower.includes('column') && errLower.includes('not found') ||
        errLower.includes('no such column')) {
        
        // Try to extract the problematic column name
        const colMatch = errorMessage.match(/column[:\s]+['"`]?(\w+)['"`]?/i);
        const problemCol = colMatch ? colMatch[1] : null;
        
        return `Colonna non trovata${problemCol ? ' (' + problemCol + ')' : ''}: la colonna che stai cercando di selezionare non esiste nella tabella specificata.\n\nCause comuni:\n- Errore di battitura nel nome della colonna (esempio: nome invece di nome_utente)\n- La colonna si trova in un'altra tabella\n- Alcune colonne usano il formato snake_case con underscore (esempio: categoria_id, data_ordine)\n\nSuggerimento: apri lo Schema Database e verifica i nomi esatti delle colonne per ogni tabella.`;
    }
    
    // AMBIGUOUS COLUMN
    if (errLower.includes('ambiguous') || errLower.includes('ambiguity')) {
        return "Colonna ambigua: hai eseguito una JOIN tra più tabelle e una colonna esiste in entrambe. SQL non è in grado di determinare da quale tabella prenderla.\n\nSoluzione: usa il prefisso della tabella per specificare l'origine.\n\nEsempio errato:\nSELECT id FROM utenti JOIN ordini...\n\nEsempio corretto:\nSELECT utenti.id, ordini.id\nFROM utenti\nJOIN ordini ON utenti.id = ordini.utente_id\n\nBuona pratica: quando usi JOIN, specifica sempre tabella.colonna per evitare ambiguità.";
    }
    
    // GROUP BY ERRORS
    if (errLower.includes('group by') || errLower.includes('aggregat')) {
        return "Errore di aggregazione con GROUP BY: quando usi funzioni aggregate (COUNT, SUM, AVG, MAX, MIN), devi seguire una regola precisa.\n\nRegola fondamentale: tutte le colonne nel SELECT che non sono racchiuse in una funzione aggregata devono essere presenti nella clausola GROUP BY.\n\nEsempio corretto:\nSELECT paese, COUNT(*)\nFROM utenti\nGROUP BY paese;\n\nEsempio errato (la colonna nome non è nel GROUP BY):\nSELECT paese, nome, COUNT(*)\nFROM utenti\nGROUP BY paese;\n\nSe vuoi mostrare la colonna nome, devi aggregarla (esempio: MAX(nome)) oppure aggiungerla al GROUP BY.";
    }
    
    // JOIN ERRORS (missing ON clause)
    if ((errLower.includes('join') && errLower.includes('on')) || 
        (queryLower.includes('join') && !queryLower.includes(' on '))) {
        return "Errore JOIN: le operazioni di JOIN richiedono una clausola ON per specificare come collegare le tabelle.\n\nSintassi corretta:\nSELECT *\nFROM tabella1\nJOIN tabella2 ON tabella1.id = tabella2.id_riferimento\n\nEsempio pratico:\nSELECT utenti.nome, ordini.data_ordine\nFROM utenti\nJOIN ordini ON utenti.id = ordini.utente_id\n\nRicorda: la clausola ON specifica la chiave esterna che collega le due tabelle.";
    }
    
    // WHERE CLAUSE ERRORS
    if (errLower.includes('where') || (queryLower.includes('where') && errLower.includes('expect'))) {
        return "Errore nella clausola WHERE: c'è un problema nella condizione di filtro.\n\nControlla i seguenti punti:\n- Le stringhe di testo devono essere racchiuse tra apici singoli: WHERE paese = 'Italia'\n- I numeri non richiedono apici: WHERE prezzo > 100\n- Gli operatori disponibili sono: =, >, <, >=, <=, !=, LIKE, IN\n- Per filtrare valori NULL usa: WHERE campo IS NULL (non WHERE campo = NULL)\n\nSuggerimento: se confronti stringhe, assicurati di usare gli apici singoli.";
    }
    
    // COMPARISON / OPERATOR ERRORS
    if (errLower.includes('operator') || errLower.includes('comparison')) {
        return "Errore operatore: stai usando un operatore di confronto in modo errato.\n\nOperatori corretti in SQL:\n- Uguaglianza: = (non == come in altri linguaggi)\n- Diverso: != oppure <>\n- Maggiore/Minore: >, <, >=, <=\n- Ricerca pattern: LIKE (esempio: WHERE nome LIKE '%Mario%')\n- Lista valori: IN (esempio: WHERE id IN (1, 2, 3))\n- Controllo NULL: IS NULL / IS NOT NULL\n\nRicorda: in SQL si usa il simbolo = singolo per l'uguaglianza, non il doppio ==.";
    }
    
    // LIMIT/OFFSET ERRORS
    if (errLower.includes('limit') || errLower.includes('offset')) {
        return "Errore LIMIT/OFFSET: problema nella paginazione dei risultati.\n\nSintassi corretta:\nSELECT * FROM utenti LIMIT 10;           (restituisce i primi 10 risultati)\nSELECT * FROM utenti LIMIT 10 OFFSET 20; (restituisce i risultati dal 21° al 30°)\n\nNota: LIMIT e OFFSET richiedono numeri interi positivi.";
    }
    
    // SUBQUERY ERRORS
    if (errLower.includes('subquery') || errLower.includes('scalar')) {
        return "Errore subquery: problema con una query annidata.\n\nCause comuni:\n- Una subquery che dovrebbe restituire un singolo valore ne restituisce molti\n- Hai dimenticato le parentesi attorno alla subquery\n- La subquery usata in FROM non ha un alias\n\nEsempio corretto:\nSELECT nome\nFROM utenti\nWHERE id = (SELECT utente_id FROM ordini WHERE id = 1);\n\nNota: le subquery usate nella clausola FROM devono avere un alias. Esempio: FROM (SELECT ...) AS nome_subquery";
    }
    
    // GENERIC / FALLBACK
    return "Errore SQL: la query non è valida.\n\nPassi per individuare il problema:\n1. Leggi attentamente il messaggio di errore qui sopra\n2. Controlla la sintassi SQL: parole chiave, virgole, parentesi\n3. Verifica che le tabelle e le colonne esistano nello schema\n4. Prova a eseguire porzioni semplificate della query\n5. Usa il pulsante Formatta per rendere più leggibile il codice\n\nSe l'errore persiste, prova a usare il pulsante Suggerimento per vedere un indizio sull'esercizio.";
};

export const analyzeCode = (code: string, language: string, context: string): Promise<ReviewResult> => {
    return new Promise((resolve) => {
        // Simulate AI thinking delay
        setTimeout(() => {
            const result = generateHeuristicReview(code, language, context);
            resolve(result);
        }, 1500);
    });
};

const generateHeuristicReview = (code: string, language: string, context: string): ReviewResult => {
    const codeLower = code.toLowerCase();
    let score = 7;
    let priorities: string[] = [];
    let verdict: ReviewResult['verdict'] = 'Funziona';

    // --- COMMON CHECKS ---
    const isShort = code.length < 20;
    const hasContext = context.length > 5;

    // --- LANGUAGE SPECIFIC LOGIC ---
    
    // SQL ANALYSIS
    if (language === 'SQL') {
        let effIssues = [];
        let styleIssues = [];

        if (codeLower.includes('select *')) {
            effIssues.push('Uso di SELECT *. Estrae colonne inutili, aumenta I/O e rompe la query se lo schema cambia.');
            score -= 2;
            priorities.push('Sostituisci SELECT * con elenco esplicito colonne');
        }

        if (codeLower.includes(' in (') && !codeLower.includes('exists')) {
            effIssues.push('IN (...) su liste lunghe è meno efficiente di EXISTS o JOIN.');
            score -= 1;
        }

        if (codeLower.includes('join') && !codeLower.includes('on')) {
            verdict = 'Non funziona';
            return {
                verdict, score: 2, correctness: "Manca la clausola ON nella JOIN. Sintassi invalida.",
                style: "N/A", efficiency: "N/A", alternative: "Aggiungi ON t1.id = t2.id", priority: ["Fix Sintassi"]
            };
        }

        if (!codeLower.includes('join') && codeLower.includes(',')) {
            styleIssues.push('Stile Join implicita (FROM a, b) è deprecato dal 1992. Usa ANSI JOIN esplicite.');
            score -= 1;
            priorities.push('Converti comma-join in INNER JOIN');
        }

        const naming = code.match(/[a-z]_[a-z]/) ? "Snake_case rilevato (buono)." : "Naming standard.";
        
        return {
            verdict: score > 5 ? 'Funziona' : 'Funziona con problemi',
            correctness: "La struttura sembra sintatticamente valida per SQL standard.",
            style: styleIssues.length > 0 ? styleIssues.join(" ") : `Codice pulito. ${naming} Parole chiave dovrebbero essere MAIUSCOLE.`,
            efficiency: effIssues.length > 0 ? effIssues.join(" ") : "Query plan apparentemente ottimale per query semplici.",
            alternative: codeLower.includes('select *') ? code.replace(/\*/g, 'colonna1, colonna2') : "L'approccio attuale è valido.",
            score: Math.max(1, score),
            priority: priorities.length > 0 ? priorities : ["Approfondisci Window Functions", "Studia Indexing Strategies"]
        };
    }

    // PYTHON ANALYSIS
    if (language === 'Python') {
        let effIssues = [];
        let styleIssues = [];

        if (codeLower.includes('for ') && (codeLower.includes('.iterrows') || codeLower.includes('range(len('))) {
            effIssues.push('Loop esplicito su DataFrame pandas è lentissimo. Usa vettorizzazione.');
            score -= 3;
            priorities.push('Impara Vectorization in Pandas (evita cicli for)');
        }

        if (code.includes('var ') || code.includes('function ')) {
             verdict = 'Non funziona';
             return {
                verdict, score: 1, correctness: "Sembra codice JavaScript, non Python.",
                style: "N/A", efficiency: "N/A", alternative: "Scrivi in Python.", priority: ["Studia sintassi Python"]
            };
        }

        if (!codeLower.includes('def ') && code.length > 100) {
            styleIssues.push('Codice procedurale lungo. Incapsula la logica in funzioni.');
            priorities.push('Refactoring in funzioni');
        }

        const snakeCase = /^[a-z_]+$/.test("test_var"); // simple check
        if (/[A-Z]/.test(code.split('=')[0] || "") && !code.includes('class ')) {
            styleIssues.push('Variabili in CamelCase? Python usa snake_case (PEP8).');
        }

        return {
            verdict: score > 6 ? 'Funziona' : 'Funziona con problemi',
            correctness: hasContext ? "Sembra rispondere alla richiesta." : "Logica funzionale standard.",
            style: styleIssues.length > 0 ? styleIssues.join(" ") : "Aderenza a PEP8 accettabile.",
            efficiency: effIssues.length > 0 ? effIssues.join(" ") : "Complessità algoritmica adeguata.",
            alternative: codeLower.includes('for') ? "df['col'] = df['a'] + df['b'] (Vectorized)" : "Nessuna alternativa critica.",
            score: Math.max(1, score),
            priority: priorities.length > 0 ? priorities : ["Type Hinting", "Docstrings", "Unit Tests"]
        };
    }

    // DAX ANALYSIS
    if (language === 'DAX') {
        if (!codeLower.includes('calculate')) {
             score -= 1;
        }
        if (codeLower.includes('filter(') && !codeLower.includes('all(')) {
            // simplistic check
        }
        
        return {
            verdict: 'Funziona',
            correctness: "Espressione DAX valida.",
            style: "Formatta il codice su più righe per leggibilità.",
            efficiency: "Verifica Context Transition. Evita di filtrare intere tabelle se puoi filtrare colonne.",
            alternative: "Usa variabili (VAR/RETURN) per leggibilità e performance.",
            score: 7,
            priority: ["Approfondisci Context Transition", "Usa DAX Variables"]
        };
    }

    return {
        verdict: 'Non funziona',
        correctness: "Linguaggio non supportato o codice vuoto.",
        style: "-", efficiency: "-", alternative: "-", score: 0, priority: []
    };
};
