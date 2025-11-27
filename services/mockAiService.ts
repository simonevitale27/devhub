
interface ReviewResult {
    verdict: 'Funziona' | 'Funziona con problemi' | 'Non funziona';
    correctness: string;
    style: string;
    efficiency: string;
    alternative: string;
    score: number;
    priority: string[];
}

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
