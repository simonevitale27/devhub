
import { TableSchema, Topic, TopicId, Exercise, Difficulty } from './types';
import { Book, Filter, ArrowDownUp, Calculator, Calendar, GitMerge, Sigma, ToggleLeft, Layers } from 'lucide-react';

export const DB_SCHEMAS: TableSchema[] = [
  {
    tableName: 'Users',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'country', type: 'VARCHAR' },
      { name: 'is_premium', type: 'BOOLEAN' },
      { name: 'created_at', type: 'DATE' }
    ]
  },
  {
    tableName: 'Products',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'price', type: 'DECIMAL' },
      { name: 'stock', type: 'INT' }
    ]
  },
  {
    tableName: 'Orders',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'user_id', type: 'INT', isForeignKey: true },
      { name: 'order_date', type: 'DATE' },
      { name: 'status', type: 'VARCHAR' },
      { name: 'order_total', type: 'DECIMAL' }
    ]
  },
  {
    tableName: 'OrderItems',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'order_id', type: 'INT', isForeignKey: true },
      { name: 'product_id', type: 'INT', isForeignKey: true },
      { name: 'quantity', type: 'INT' },
      { name: 'unit_price', type: 'DECIMAL' }
    ]
  },
  {
    tableName: 'Employees',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'department', type: 'VARCHAR' },
      { name: 'hire_date', type: 'DATE' },
      { name: 'manager_id', type: 'INT', isForeignKey: true }
    ]
  }
];

export const TOPICS: Topic[] = [
  { id: TopicId.Basics, label: 'Select Base', subtitle: 'SELECT, FROM, DISTINCT, ALIAS', description: 'Colonne e righe', icon: Book },
  { id: TopicId.Filtering, label: 'Filtri (WHERE)', subtitle: 'WHERE, AND/OR, IN, LIKE, NULL', description: 'Operatori logici e condizionali', icon: Filter },
  { id: TopicId.Sorting, label: 'Ordinamento', subtitle: 'ORDER BY, ASC, DESC, LIMIT', description: 'ORDER BY e LIMIT', icon: ArrowDownUp },
  { id: TopicId.Functions, label: 'Funzioni Scalari', subtitle: 'UPPER, ROUND, LEN, CONCAT', description: 'Stringhe e Numeri', icon: Calculator },
  { id: TopicId.Dates, label: 'Date & Time', subtitle: 'YEAR, MONTH, DATEDIFF', description: 'Gestione temporale', icon: Calendar },
  { id: TopicId.Joins, label: 'Join Tabelle', subtitle: 'INNER, LEFT, RIGHT JOIN', description: 'INNER, LEFT, RIGHT', icon: GitMerge },
  { id: TopicId.Aggregation, label: 'Aggregazione', subtitle: 'GROUP BY, SUM, AVG, COUNT', description: 'GROUP BY e HAVING', icon: Sigma },
  { id: TopicId.Case, label: 'Logica Condizionale', subtitle: 'CASE WHEN... THEN... END', description: 'CASE WHEN', icon: ToggleLeft },
  { id: TopicId.Advanced, label: 'Avanzate', subtitle: 'SUBQUERIES, EXISTS, WINDOW FN', description: 'Subqueries e Window Fn', icon: Layers },
];

// Helper function to introduce common SQL errors for Debug Mode
const generateBrokenSQL = (correctQuery: string, index: number, difficulty: Difficulty): { code: string, hint: string } => {
  
  // Define error types per difficulty
  const easyErrors = [
    // Type 0: Missing comma in SELECT
    {
      transform: (q: string) => q.replace(/SELECT\s+(\w+),/, 'SELECT $1'),
      hint: "Controlla la clausola SELECT: sembra mancare un separatore tra le colonne."
    },
    // Type 1: Typo in column name
    {
      transform: (q: string) => q.replace(/nome/i, 'naem'),
      hint: "Verifica i nomi delle colonne. C'è un errore di battitura in uno dei campi selezionati."
    },
    // Type 2: Missing quotes around string
    {
      transform: (q: string) => q.replace(/'([^']+)'/, '$1'),
      hint: "Le stringhe in SQL devono essere racchiuse tra apici singoli."
    },
    // Type 3: Typo in keyword (SELECT -> SLECT)
    {
      transform: (q: string) => q.replace(/SELECT/i, 'SLECT'),
      hint: "Controlla le parole chiave SQL. 'SLECT' non è un comando valido."
    },
    // Type 4: Wrong comparison operator
    {
      transform: (q: string) => q.replace(/LIKE/, '='),
      hint: "Per cercare un pattern parziale (es. con %), usa l'operatore LIKE invece di =."
    },
    // Type 5: Missing semicolon (ONLY FOR EASY)
    {
      transform: (q: string) => q.replace(/;$/, ''),
      hint: "Ogni istruzione SQL dovrebbe terminare con un punto e virgola (;)."
    },
    // Type 6: Typo in table name
    {
      transform: (q: string) => q.replace(/utenti/i, 'utentii'),
      hint: "Il nome della tabella sembra errato. Verifica che esista nel database."
    },
    // Type 7: Extra comma
    {
      transform: (q: string) => q.replace(/FROM/, ', FROM'),
      hint: "C'è una virgola di troppo prima della clausola FROM."
    },
    // Type 8: Missing WHERE keyword
    {
      transform: (q: string) => q.replace(/WHERE\s+/, ''),
      hint: "Sembra mancare la parola chiave per filtrare i risultati (WHERE)."
    }
  ];

  const mediumErrors = [
    // Type 0: Wrong JOIN keyword
    {
      transform: (q: string) => q.replace(/JOIN/, 'JON'),
      hint: "La parola chiave per unire le tabelle è errata. Si scrive JOIN."
    },
    // Type 1: Missing ON in JOIN
    {
        transform: (q: string) => q.replace(/ON\s+/, ''),
        hint: "Nelle JOIN è necessario specificare la condizione di unione con la parola chiave ON."
    },
    // Type 2: Typo in GROUP BY
    {
        transform: (q: string) => q.replace(/GROUP BY/, 'GROP BY'),
        hint: "C'è un errore di battitura nella clausola di raggruppamento (GROUP BY)."
    },
    // Type 3: Using WHERE instead of HAVING
    {
        transform: (q: string) => q.replace(/HAVING/, 'WHERE'),
        hint: "Per filtrare sui risultati di una funzione di aggregazione (come COUNT o SUM), usa HAVING invece di WHERE."
    },
    // Type 4: Typo in ORDER BY
    {
        transform: (q: string) => q.replace(/ORDER BY/, 'ORDER BI'),
        hint: "Controlla la sintassi per l'ordinamento. Si scrive ORDER BY."
    },
    // Type 5: Typo in DESC/ASC
    {
        transform: (q: string) => q.replace(/DESC/, 'DSC').replace(/ASC/, 'AC'),
        hint: "Verifica la direzione dell'ordinamento (ASC o DESC)."
    },
    // Type 6: Typo in COUNT function
    {
        transform: (q: string) => q.replace(/count\(/i, 'cont('),
        hint: "La funzione per contare le righe si scrive COUNT."
    },
    // Type 7: Typo in AVG function
    {
        transform: (q: string) => q.replace(/avg\(/i, 'avrage('),
        hint: "La funzione per la media si scrive AVG."
    },
    // Type 8: Typo in SUM function
    {
        transform: (q: string) => q.replace(/sum\(/i, 'summ('),
        hint: "La funzione per la somma si scrive SUM."
    },
    // Type 9: Swap FROM and SELECT (Major syntax error)
    {
        transform: (q: string) => {
            const parts = q.match(/SELECT (.*) FROM (.*)( WHERE| ORDER| GROUP| LIMIT|;|$)/i);
            if (parts) {
                return `FROM ${parts[2]} SELECT ${parts[1]}${parts[3]}`;
            }
            return q;
        },
        hint: "L'ordine delle clausole è errato. La struttura base è SELECT ... FROM ..."
    }
  ];

  const hardErrors = [
     // Type 0: Missing parenthesis in function
    {
        transform: (q: string) => q.replace(/\)$/, ';'), // Remove last closing parenthesis if at end
        hint: "Controlla le parentesi delle funzioni. Sembra che ne manchi una di chiusura."
    },
    // Type 1: Window Function OVER missing
    {
        transform: (q: string) => q.replace(/OVER\s*\(/i, '('),
        hint: "Le Window Functions richiedono la clausola OVER per definire la finestra di calcolo."
    },
    // Type 2: CTE WITH missing
    {
        transform: (q: string) => q.replace(/^WITH\s+/i, ''),
        hint: "Per definire una Common Table Expression (CTE) è necessaria la parola chiave WITH all'inizio."
    },
    // Type 3: Subquery missing closing parenthesis
    {
        transform: (q: string) => q.replace(/\)\s*as/i, ' as'),
        hint: "Verifica che tutte le subquery siano correttamente racchiuse tra parentesi."
    },
    // Type 4: PARTITION BY typo
    {
        transform: (q: string) => q.replace(/PARTITION BY/i, 'PARTITION'),
        hint: "La sintassi corretta per le Window Functions è PARTITION BY."
    },
    // Type 5: UNION ALL typo
    {
        transform: (q: string) => q.replace(/UNION/i, 'UNIO'),
        hint: "C'è un errore nella parola chiave per combinare i risultati (UNION)."
    },
    // Type 6: CAST syntax error
    {
        transform: (q: string) => q.replace(/AS\s+INT/i, 'INT'),
        hint: "La funzione CAST richiede la parola chiave AS prima del tipo di dato."
    },
    // Type 7: CASE WHEN missing END
    {
        transform: (q: string) => q.replace(/END\s+as/i, 'as'),
        hint: "Ogni istruzione CASE deve essere chiusa con la parola chiave END."
    },
    // Type 8: EXTRACT syntax error
    {
        transform: (q: string) => q.replace(/FROM/i, ','),
        hint: "La funzione EXTRACT usa la sintassi: EXTRACT(part FROM date)."
    },
    // Type 9: NULLIF argument error
    {
        transform: (q: string) => q.replace(/NULLIF\(/i, 'NULLIF '),
        hint: "Le funzioni come NULLIF richiedono le parentesi per gli argomenti."
    }
  ];

  let selectedErrors;
  if (difficulty === Difficulty.Easy) {
    selectedErrors = easyErrors;
  } else if (difficulty === Difficulty.Medium) {
    selectedErrors = mediumErrors;
  } else {
    selectedErrors = hardErrors;
  }

  // Pick error type based on index to ensure variety
  const errorType = selectedErrors[index % selectedErrors.length];
  const brokenSQL = errorType.transform(correctQuery);
  
  // If no change was made (e.g., pattern didn't match), try a simpler fallback
  // BUT avoid removing semicolon for Medium/Hard
  if (brokenSQL === correctQuery) {
    if (difficulty === Difficulty.Easy) {
        // Fallback for Easy: remove last character (likely semicolon)
        return {
            code: correctQuery.slice(0, -1),
            hint: "Sembra mancare l'ultimo carattere della query."
        };
    } else {
        // Fallback for Medium/Hard: Introduce a typo in a common keyword
        // This guarantees an error without being trivial
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ORDER', 'GROUP'];
        for (const kw of keywords) {
            if (correctQuery.includes(kw)) {
                return {
                    code: correctQuery.replace(kw, kw.substring(0, kw.length - 1)), // Remove last char of keyword
                    hint: `Controlla la sintassi delle parole chiave SQL (es. ${kw}).`
                };
            }
        }
        // Ultimate fallback if no keywords found (unlikely)
        return {
             code: correctQuery.replace(/ /g, ''), // Remove all spaces (catastrophic syntax error)
             hint: "La query sembra aver perso tutta la formattazione degli spazi."
        };
    }
  }
  
  return {
    code: brokenSQL,
    hint: errorType.hint
  };
};

export const generateCopyCodeSnippets = (difficulty: Difficulty): Exercise[] => {
  const exercises: Exercise[] = [];

  if (difficulty === Difficulty.Easy) {
    const easySnippets = [
      { query: "SELECT * FROM utenti;", description: "Estrai l'anagrafica completa di tutti gli utenti registrati nel sistema." },
      { query: "SELECT nome, email FROM utenti;", description: "Genera una lista di contatti contenente solo nome ed email di tutti gli utenti." },
      { query: "SELECT DISTINCT paese FROM utenti;", description: "Individua tutti i paesi unici da cui provengono i nostri utenti." },
      { query: "SELECT * FROM prodotti WHERE prezzo > 50;", description: "Filtra il catalogo per mostrare solo i prodotti di fascia alta (> 50€)." },
      { query: "SELECT * FROM prodotti WHERE stock < 10;", description: "Individua i prodotti in esaurimento (stock inferiore a 10 unità)." },
      { query: "SELECT nome, prezzo FROM prodotti ORDER BY prezzo DESC;", description: "Crea un listino prezzi ordinato dal prodotto più costoso al più economico." },
      { query: "SELECT * FROM ordini LIMIT 5;", description: "Visualizza un'anteprima delle ultime 5 transazioni registrate." },
      { query: "SELECT * FROM utenti WHERE paese = 'Italia';", description: "Segmenta l'utenza per mostrare solo i clienti residenti in Italia." },
      { query: "SELECT * FROM utenti WHERE premium = true;", description: "Estrai la lista dei clienti VIP con abbonamento Premium attivo." },
      { query: "SELECT count(*) FROM prodotti;", description: "Calcola il numero totale di referenze presenti nel catalogo prodotti." },
      { query: "SELECT * FROM fornitori WHERE nazione = 'Germania';", description: "Trova tutti i partner commerciali con sede in Germania." },
      { query: "SELECT azienda, contatto FROM fornitori ORDER BY azienda ASC;", description: "Genera una rubrica fornitori ordinata alfabeticamente per nome azienda." },
      { query: "SELECT * FROM recensioni WHERE voto >= 4;", description: "Analizza la soddisfazione clienti filtrando solo le recensioni positive (4 o 5 stelle)." },
      { query: "SELECT * FROM recensioni WHERE voto < 3;", description: "Monitora le criticità estraendo tutte le recensioni negative (meno di 3 stelle)." },
      { query: "SELECT * FROM spedizioni WHERE corriere = 'DHL';", description: "Verifica tutte le spedizioni affidate al corriere DHL." },
      { query: "SELECT id, data_ordine FROM ordini WHERE quantita > 2;", description: "Individua gli ordini 'bulk' che contengono più di 2 articoli." },
      { query: "SELECT nome FROM categorie;", description: "Visualizza l'elenco delle categorie merceologiche disponibili." },
      { query: "SELECT * FROM prodotti WHERE categoria_id = 1;", description: "Mostra tutti i prodotti appartenenti alla prima categoria del database." },
      { query: "SELECT * FROM prodotti WHERE fornitore_id = 2;", description: "Filtra il catalogo per vedere solo gli articoli del fornitore #2." },
      { query: "SELECT max(prezzo) FROM prodotti;", description: "Identifica il prezzo più alto presente nel listino." },
      { query: "SELECT min(prezzo) FROM prodotti;", description: "Identifica il prezzo entry-level (più basso) del catalogo." },
      { query: "SELECT avg(prezzo) FROM prodotti;", description: "Calcola il prezzo medio di vendita dei prodotti." },
      { query: "SELECT sum(stock) FROM prodotti;", description: "Calcola la giacenza totale di magazzino sommando lo stock di tutti i prodotti." },
      { query: "SELECT * FROM utenti WHERE email LIKE '%@gmail.com';", description: "Filtra gli utenti che utilizzano un indirizzo Gmail." },
      { query: "SELECT * FROM prodotti WHERE nome LIKE 'S%';", description: "Cerca tutti i prodotti il cui nome inizia con la lettera 'S'." },
      { query: "SELECT * FROM spedizioni WHERE data_spedizione > '2023-01-01';", description: "Visualizza lo storico spedizioni a partire dal 1° Gennaio 2023." },
      { query: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31';", description: "Estrai tutti gli ordini effettuati nel corso dell'anno 2023." },
      { query: "SELECT id, nome AS prodotto_nome FROM prodotti;", description: "Estrai ID e nome prodotto, rinominando la colonna 'nome' in 'prodotto_nome' per chiarezza." },
      { query: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Spagna');", description: "Seleziona gli utenti provenienti dai principali mercati europei (Italia, Francia, Spagna)." },
      { query: "SELECT * FROM prodotti WHERE prezzo IS NOT NULL;", description: "Effettua un controllo di qualità dati mostrando solo i prodotti con prezzo definito." }
    ];

    easySnippets.forEach((item, i) => {
      const brokenData = generateBrokenSQL(item.query, i, Difficulty.Easy);
      exercises.push({
        id: `copy_easy_${i}`,
        topicId: TopicId.Basics,
        difficulty: Difficulty.Easy,
        title: `Snippet Easy #${i + 1}`,
        description: item.description,
        initialQuery: '',
        solutionQuery: item.query,
        brokenCode: brokenData.code,
        debugHint: brokenData.hint,
        hints: [],
        explanation: ''
      });
    });
  } else if (difficulty === Difficulty.Medium) {
    const mediumSnippets = [
      { query: "SELECT p.nome, c.nome as categoria FROM prodotti p JOIN categorie c ON p.categoria_id = c.id;", description: "Arricchisci il listino prodotti mostrando il nome della categoria invece del solo ID." },
      { query: "SELECT u.nome, o.data_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Crea un report delle attività mostrando chi ha ordinato cosa e quando." },
      { query: "SELECT p.nome, f.azienda FROM prodotti p LEFT JOIN fornitori f ON p.fornitore_id = f.id;", description: "Elenca tutti i prodotti a catalogo, associando il fornitore se disponibile (LEFT JOIN)." },
      { query: "SELECT c.nome, count(p.id) as num_prodotti FROM categorie c LEFT JOIN prodotti p ON c.id = p.categoria_id GROUP BY c.nome;", description: "Analizza la distribuzione del catalogo contando quanti prodotti contiene ogni categoria." },
      { query: "SELECT u.paese, count(*) as num_utenti FROM utenti u GROUP BY u.paese;", description: "Genera una statistica demografica contando gli utenti per paese di provenienza." },
      { query: "SELECT p.nome, avg(r.voto) as media_voti FROM prodotti p JOIN recensioni r ON p.id = r.prodotto_id GROUP BY p.nome;", description: "Valuta la qualità percepita calcolando la media voti per ogni prodotto recensito." },
      { query: "SELECT f.nazione, count(*) as num_fornitori FROM fornitori f GROUP BY f.nazione HAVING count(*) > 1;", description: "Individua le nazioni strategiche dove abbiamo più di un fornitore attivo." },
      { query: "SELECT o.id, sum(p.prezzo * o.quantita) as totale_ordine FROM ordini o JOIN prodotti p ON o.prodotto_id = p.id GROUP BY o.id;", description: "Calcola il fatturato generato da ogni singolo ordine (prezzo * quantità)." },
      { query: "SELECT u.nome FROM utenti u JOIN ordini o ON u.id = o.utente_id WHERE o.data_ordine > '2023-06-01';", description: "Identifica gli utenti attivi che hanno effettuato ordini nel secondo semestre 2023." },
      { query: "SELECT p.nome FROM prodotti p WHERE p.id NOT IN (SELECT prodotto_id FROM ordini);", description: "Individua i prodotti 'invenduti' che non compaiono in nessun ordine." },
      { query: "SELECT upper(nome) FROM utenti;", description: "Normalizza i dati visualizzando i nomi utente in maiuscolo per uniformità." },
      { query: "SELECT concat(nome, ' (', paese, ')') as utente_info FROM utenti;", description: "Formatta una stringa descrittiva 'Nome (Paese)' per l'interfaccia utente." },
      { query: "SELECT *, round(prezzo * 0.9, 2) as prezzo_scontato FROM prodotti;", description: "Simula una promozione calcolando il prezzo scontato del 10% (arrotondato)." },
      { query: "SELECT datediff('2024-01-01', data_ordine) as giorni_passati FROM ordini;", description: "Calcola l'anzianità degli ordini in giorni rispetto all'inizio del 2024." },
      { query: "SELECT year(data_ordine) as anno, count(*) FROM ordini GROUP BY year(data_ordine);", description: "Analizza il trend di vendita contando il volume di ordini per anno." },
      { query: "SELECT p.nome, r.commento FROM prodotti p JOIN recensioni r ON p.id = r.prodotto_id WHERE r.voto = 5;", description: "Estrai i testimonial positivi: commenti delle recensioni a 5 stelle con prodotto associato." },
      { query: "SELECT u.email, count(o.id) FROM utenti u LEFT JOIN ordini o ON u.id = o.utente_id GROUP BY u.email ORDER BY count(o.id) DESC;", description: "Identifica i 'Top Spender' classificando gli utenti per numero di ordini." },
      { query: "SELECT c.nome, sum(p.stock) as totale_stock FROM categorie c JOIN prodotti p ON c.id = p.categoria_id GROUP BY c.nome;", description: "Ottimizza la logistica calcolando la quantità totale di merce per categoria." },
      { query: "SELECT f.azienda, p.nome FROM fornitori f JOIN prodotti p ON f.id = p.fornitore_id WHERE p.prezzo > 100;", description: "Trova i fornitori di prodotti 'Premium' (prezzo superiore a 100€)." },
      { query: "SELECT o.id, s.codice_tracking FROM ordini o JOIN spedizioni s ON o.id = s.ordine_id WHERE s.corriere = 'UPS';", description: "Recupera i codici di tracciamento specifici per le spedizioni gestite da UPS." },
      { query: "SELECT u.nome, max(o.data_ordine) as ultimo_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id GROUP BY u.nome;", description: "Calcola la data dell'ultimo acquisto per ogni cliente (analisi recency)." },
      { query: "SELECT p.nome, p.prezzo FROM prodotti p WHERE p.prezzo > (SELECT avg(prezzo) FROM prodotti);", description: "Identifica i prodotti con posizionamento di prezzo sopra la media del catalogo." },
      { query: "SELECT c.nome FROM categorie c WHERE EXISTS (SELECT 1 FROM prodotti p WHERE p.categoria_id = c.id AND p.prezzo > 200);", description: "Trova le categorie che contengono prodotti di lusso (> 200€)." },
      { query: "SELECT u.nome, sum(o.quantita) as totale_articoli FROM utenti u JOIN ordini o ON u.id = o.utente_id GROUP BY u.nome HAVING sum(o.quantita) > 5;", description: "Premia la fedeltà: trova gli utenti che hanno acquistato più di 5 articoli in totale." },
      { query: "SELECT p.nome, CASE WHEN p.stock < 10 THEN 'Basso' ELSE 'Alto' END as stato_stock FROM prodotti p;", description: "Crea un report di inventario con etichette di stato 'Basso' o 'Alto' per lo stock." },
      { query: "SELECT o.id, date_format(o.data_ordine, '%d/%m/%Y') as data_formattata FROM ordini o;", description: "Localizza le date degli ordini nel formato italiano gg/mm/aaaa." },
      { query: "SELECT p.nome, len(p.nome) as lunghezza_nome FROM prodotti p;", description: "Analisi tecnica: calcola la lunghezza dei nomi prodotto per verifica layout." },
      { query: "SELECT distinct u.paese FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Mappa i mercati attivi: trova i paesi da cui provengono ordini effettivi." },
      { query: "SELECT f.azienda FROM fornitori f WHERE f.id IN (SELECT fornitore_id FROM prodotti WHERE stock = 0);", description: "Contatta i fornitori che hanno prodotti attualmente esauriti (stock 0)." },
      { query: "SELECT p.nome, coalesce(r.voto, 0) as voto_o_zero FROM prodotti p LEFT JOIN recensioni r ON p.id = r.prodotto_id;", description: "Normalizza i dati recensioni sostituendo i valori mancanti (NULL) con 0." }
    ];

    mediumSnippets.forEach((item, i) => {
      const brokenData = generateBrokenSQL(item.query, i, Difficulty.Medium);
      exercises.push({
        id: `copy_medium_${i}`,
        topicId: TopicId.Joins,
        difficulty: Difficulty.Medium,
        title: `Snippet Medium #${i + 1}`,
        description: item.description,
        initialQuery: '',
        solutionQuery: item.query,
        brokenCode: brokenData.code,
        debugHint: brokenData.hint,
        hints: [],
        explanation: ''
      });
    });
  } else if (difficulty === Difficulty.Hard) {
    const hardSnippets = [
      { query: "SELECT p.nome, p.prezzo, rank() OVER (ORDER BY p.prezzo DESC) as classifica_prezzo FROM prodotti p;", description: "Crea una classifica dinamica dei prodotti per prezzo (dal più alto) utilizzando la funzione RANK()." },
      { query: "SELECT u.nome, o.data_ordine, row_number() OVER (PARTITION BY u.id ORDER BY o.data_ordine DESC) as n_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Numera sequenzialmente gli ordini di ogni utente, partendo dal più recente (ROW_NUMBER)." },
      { query: "SELECT p.nome, p.prezzo, p.prezzo - lag(p.prezzo) OVER (ORDER BY p.prezzo) as diff_precedente FROM prodotti p;", description: "Analisi differenziale: calcola lo scarto di prezzo rispetto al prodotto immediatamente precedente in classifica." },
      { query: "SELECT c.nome, p.nome, p.prezzo, avg(p.prezzo) OVER (PARTITION BY c.id) as media_categoria FROM categorie c JOIN prodotti p ON c.id = p.categoria_id;", description: "Confronta il prezzo di ogni prodotto con il prezzo medio della sua categoria di appartenenza." },
      { query: "WITH VenditeUtenti AS (SELECT u.id, u.nome, sum(p.prezzo * o.quantita) as totale FROM utenti u JOIN ordini o ON u.id = o.utente_id JOIN prodotti p ON o.prodotto_id = p.id GROUP BY u.id, u.nome) SELECT * FROM VenditeUtenti WHERE totale > 1000;", description: "Identifica i clienti 'High Value' (spesa > 1000€) utilizzando una Common Table Expression (CTE)." },
      { query: "SELECT * FROM prodotti p1 WHERE p1.prezzo > (SELECT avg(p2.prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id);", description: "Trova i prodotti 'fuori mercato' che costano più della media della loro specifica categoria (Subquery Correlata)." },
      { query: "SELECT u.nome FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id);", description: "Individua gli utenti inattivi che non hanno mai effettuato ordini (tecnica NOT EXISTS)." },
      { query: "SELECT f.azienda, (SELECT count(*) FROM prodotti p WHERE p.fornitore_id = f.id) as num_prodotti FROM fornitori f;", description: "Genera un report fornitori con il conteggio prodotti calcolato tramite subquery nella SELECT." },
      { query: "SELECT date_trunc('month', data_ordine) as mese, sum(quantita) as totale_vendite FROM ordini GROUP BY 1 ORDER BY 1;", description: "Analisi temporale: aggrega il volume totale delle vendite per mese." },
      { query: "SELECT p.nome, ntile(4) OVER (ORDER BY p.prezzo) as quartile_prezzo FROM prodotti p;", description: "Segmentazione statistica: dividi i prodotti in 4 quartili basati sul prezzo." },
      { query: "SELECT u.nome, first_value(o.data_ordine) OVER (PARTITION BY u.id ORDER BY o.data_ordine) as primo_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Analisi coorte: trova la data di acquisizione (primo ordine) per ogni cliente." },
      { query: "SELECT p.categoria_id, p.nome, p.prezzo, dense_rank() OVER (PARTITION BY p.categoria_id ORDER BY p.prezzo DESC) as rank_cat FROM prodotti p;", description: "Classifica i prodotti per prezzo all'interno di ogni categoria senza 'buchi' nel ranking (DENSE_RANK)." },
      { query: "SELECT u.paese, p.nome, count(*) as acquisti FROM utenti u JOIN ordini o ON u.id = o.utente_id JOIN prodotti p ON o.prodotto_id = p.id GROUP BY u.paese, p.nome ORDER BY u.paese, acquisti DESC;", description: "Analisi di mercato: individua i prodotti best-seller per ogni paese." },
      { query: "SELECT o.id, sum(p.prezzo * o.quantita) as totale, sum(sum(p.prezzo * o.quantita)) OVER () as grand_total FROM ordini o JOIN prodotti p ON o.prodotto_id = p.id GROUP BY o.id;", description: "Report finanziario: mostra il totale di ogni ordine confrontato con il fatturato globale." },
      { query: "SELECT p.nome, CASE WHEN p.prezzo < 50 THEN 'Economico' WHEN p.prezzo BETWEEN 50 AND 150 THEN 'Standard' ELSE 'Premium' END as fascia_prezzo FROM prodotti p;", description: "Segmentazione prodotti: assegna una fascia di prezzo (Economico, Standard, Premium) con logica condizionale." },
      { query: "SELECT u.nome, lead(o.data_ordine) OVER (PARTITION BY u.id ORDER BY o.data_ordine) as prossimo_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Analisi retention: per ogni ordine, mostra la data dell'acquisto successivo dello stesso cliente." },
      { query: "SELECT p.nome, p.stock, sum(p.stock) OVER (ORDER BY p.id) as running_total_stock FROM prodotti p;", description: "Calcola il cumulativo progressivo (Running Total) dello stock di magazzino." },
      { query: "SELECT c.nome, string_agg(p.nome, ', ') as lista_prodotti FROM categorie c JOIN prodotti p ON c.id = p.categoria_id GROUP BY c.nome;", description: "Genera un catalogo compatto con la lista testuale di tutti i prodotti per categoria." },
      { query: "SELECT u.id, u.nome FROM utenti u UNION SELECT f.id, f.azienda FROM fornitori f;", description: "Crea una lista unica di tutti i contatti (utenti e fornitori) unificando le tabelle." },
      { query: "SELECT u.id FROM utenti u EXCEPT SELECT o.utente_id FROM ordini o;", description: "Trova gli ID degli utenti che NON hanno effettuato ordini usando l'operatore insiemistico EXCEPT." },
      { query: "SELECT o.utente_id FROM ordini o INTERSECT SELECT r.utente_id FROM recensioni r;", description: "Individua gli utenti 'Engaged' che hanno sia acquistato che recensito (INTERSECT)." },
      { query: "SELECT p.nome, p.prezzo, percent_rank() OVER (ORDER BY p.prezzo) as percentile FROM prodotti p;", description: "Analisi statistica: calcola il rango percentuale del prezzo per ogni prodotto." },
      { query: "WITH RicaviPerMese AS (SELECT month(data_ordine) as m, sum(quantita) as q FROM ordini GROUP BY m) SELECT m, q, q - lag(q) OVER (ORDER BY m) as crescita FROM RicaviPerMese;", description: "Calcola la crescita netta delle vendite (delta) rispetto al mese precedente." },
      { query: "SELECT p.nome, cast(p.prezzo as INT) as prezzo_intero FROM prodotti p;", description: "Normalizza i prezzi convertendo i valori decimali in interi (CAST)." },
      { query: "SELECT u.nome, nullif(u.paese, 'Unknown') as paese_verificato FROM utenti u;", description: "Pulisci i dati: restituisci NULL se il campo paese contiene il valore placeholder 'Unknown'." },
      { query: "SELECT p.nome, round(p.prezzo, -1) as prezzo_arrotondato_decine FROM prodotti p;", description: "Arrotonda i prezzi alla decina più vicina per semplificare il listino." },
      { query: "SELECT u.nome, extract(dow from o.data_ordine) as giorno_settimana FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Analisi temporale: estrai il giorno della settimana (0-6) in cui è avvenuto l'ordine." },
      { query: "SELECT p.nome, p.prezzo FROM prodotti p WHERE p.prezzo > ALL (SELECT prezzo FROM prodotti WHERE categoria_id = 3);", description: "Trova i prodotti che costano più di TUTTI i prodotti della categoria 3 (ALL)." },
      { query: "SELECT p.nome, p.prezzo FROM prodotti p WHERE p.prezzo > ANY (SELECT prezzo FROM prodotti WHERE categoria_id = 2);", description: "Trova i prodotti che costano più di ALMENO UNO dei prodotti della categoria 2 (ANY)." },
      { query: "SELECT u.nome, count(distinct o.prodotto_id) as prodotti_diversi_acquistati FROM utenti u JOIN ordini o ON u.id = o.utente_id GROUP BY u.nome;", description: "Analisi varietà: conta quanti prodotti DIVERSI ha acquistato ogni singolo utente." }
    ];

    hardSnippets.forEach((item, i) => {
      const brokenData = generateBrokenSQL(item.query, i, Difficulty.Hard);
      exercises.push({
        id: `copy_hard_${i}`,
        topicId: TopicId.Advanced,
        difficulty: Difficulty.Hard,
        title: `Snippet Hard #${i + 1}`,
        description: item.description,
        initialQuery: '',
        solutionQuery: item.query,
        brokenCode: brokenData.code,
        debugHint: brokenData.hint,
        hints: [],
        explanation: ''
      });
    });
  }

  return exercises;
};

export const COMPLEX_SNIPPETS: Exercise[] = [];