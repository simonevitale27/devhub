
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
      { name: 'email', type: 'VARCHAR' },
      { name: 'department', type: 'VARCHAR' },
      { name: 'hire_date', type: 'DATE' },
      { name: 'manager_id', type: 'INT', isForeignKey: true },
      { name: 'salary', type: 'DECIMAL' }
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
      { query: "SELECT * FROM Users;", description: "Estrai l'anagrafica completa di tutti gli utenti registrati nel sistema." },
      { query: "SELECT name, email FROM Users;", description: "Genera una lista di contatti contenente solo nome ed email di tutti gli utenti." },
      { query: "SELECT DISTINCT country FROM Users;", description: "Individua tutti i paesi unici da cui provengono i nostri utenti." },
      { query: "SELECT * FROM Products WHERE price > 50;", description: "Filtra il catalogo per mostrare solo i prodotti di fascia alta (> 50€)." },
      { query: "SELECT * FROM Products WHERE stock < 10;", description: "Individua i prodotti in esaurimento (stock inferiore a 10 unità)." },
      { query: "SELECT name, price FROM Products ORDER BY price DESC;", description: "Crea un listino prezzi ordinato dal prodotto più costoso al più economico." },
      { query: "SELECT * FROM Orders LIMIT 5;", description: "Visualizza un'anteprima delle ultime 5 transazioni registrate." },
      { query: "SELECT * FROM Users WHERE country = 'Italy';", description: "Segmenta l'utenza per mostrare solo i clienti residenti in Italia." },
      { query: "SELECT * FROM Users WHERE is_premium = true;", description: "Estrai la lista dei clienti VIP con abbonamento Premium attivo." },
      { query: "SELECT count(*) FROM Products;", description: "Calcola il numero totale di referenze presenti nel catalogo prodotti." },
      { query: "SELECT * FROM Employees WHERE department = 'Sales';", description: "Trova tutti i dipendenti del reparto vendite." },
      { query: "SELECT name, department FROM Employees ORDER BY name ASC;", description: "Genera una rubrica dipendenti ordinata alfabeticamente per nome." },
      { query: "SELECT * FROM Orders WHERE order_total >= 500;", description: "Analizza gli ordini di alto valore filtrando solo quelli con totale >= 500." },
      { query: "SELECT * FROM Orders WHERE order_total < 100;", description: "Monitora gli ordini di basso valore (meno di 100€)." },
      { query: "SELECT * FROM Orders WHERE status = 'Shipped';", description: "Verifica tutti gli ordini attualmente in stato di spedizione." },
      { query: "SELECT id, order_date FROM Orders WHERE order_total > 200;", description: "Individua gli ordini di valore superiore a 200€." },
      { query: "SELECT DISTINCT category FROM Products;", description: "Visualizza l'elenco delle categorie merceologiche disponibili." },
      { query: "SELECT * FROM Products WHERE category = 'Electronics';", description: "Mostra tutti i prodotti appartenenti alla categoria Electronics." },
      { query: "SELECT * FROM OrderItems WHERE quantity > 2;", description: "Filtra le righe d'ordine per vedere solo gli articoli ordinati in più di 2 unità." },
      { query: "SELECT max(price) FROM Products;", description: "Identifica il prezzo più alto presente nel listino." },
      { query: "SELECT min(price) FROM Products;", description: "Identifica il prezzo entry-level (più basso) del catalogo." },
      { query: "SELECT avg(price) FROM Products;", description: "Calcola il prezzo medio di vendita dei prodotti." },
      { query: "SELECT sum(stock) FROM Products;", description: "Calcola la giacenza totale di magazzino sommando lo stock di tutti i prodotti." },
      { query: "SELECT * FROM Users WHERE email LIKE '%@gmail.com';", description: "Filtra gli utenti che utilizzano un indirizzo Gmail." },
      { query: "SELECT * FROM Products WHERE name LIKE 'S%';", description: "Cerca tutti i prodotti il cui nome inizia con la lettera 'S'." },
      { query: "SELECT * FROM Orders WHERE order_date > '2023-01-01';", description: "Visualizza lo storico ordini a partire dal 1° Gennaio 2023." },
      { query: "SELECT * FROM Orders WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31';", description: "Estrai tutti gli ordini effettuati nel corso dell'anno 2023." },
      { query: "SELECT id, name AS product_name FROM Products;", description: "Estrai ID e nome prodotto, rinominando la colonna 'name' in 'product_name' per chiarezza." },
      { query: "SELECT * FROM Users WHERE country IN ('Italy', 'France', 'Spain');", description: "Seleziona gli utenti provenienti dai principali mercati europei (Italia, Francia, Spagna)." },
      { query: "SELECT * FROM Products WHERE price IS NOT NULL;", description: "Effettua un controllo di qualità dati mostrando solo i prodotti con prezzo definito." }
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
        explanation: '',
        poolIndex: i
      });
    });
  } else if (difficulty === Difficulty.Medium) {
    const mediumSnippets = [
      { query: "SELECT p.name, p.category FROM Products p JOIN OrderItems oi ON p.id = oi.product_id;", description: "Arricchisci il listino mostrando i prodotti che sono stati ordinati almeno una volta." },
      { query: "SELECT u.name, o.order_date FROM Users u JOIN Orders o ON u.id = o.user_id;", description: "Crea un report delle attività mostrando chi ha ordinato cosa e quando." },
      { query: "SELECT u.name, o.order_total FROM Users u LEFT JOIN Orders o ON u.id = o.user_id;", description: "Elenca tutti gli utenti, mostrando i totali ordine se disponibili (LEFT JOIN)." },
      { query: "SELECT p.category, count(p.id) as num_products FROM Products p GROUP BY p.category;", description: "Analizza la distribuzione del catalogo contando quanti prodotti contiene ogni categoria." },
      { query: "SELECT u.country, count(*) as num_users FROM Users u GROUP BY u.country;", description: "Genera una statistica demografica contando gli utenti per paese di provenienza." },
      { query: "SELECT p.name, avg(oi.unit_price) as avg_price FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name;", description: "Calcola il prezzo medio di vendita effettivo per ogni prodotto ordinato." },
      { query: "SELECT e.department, count(*) as num_employees FROM Employees e GROUP BY e.department HAVING count(*) > 1;", description: "Individua i reparti con più di un dipendente attivo." },
      { query: "SELECT o.id, sum(oi.unit_price * oi.quantity) as order_value FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id GROUP BY o.id;", description: "Calcola il fatturato generato da ogni singolo ordine (prezzo * quantità)." },
      { query: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.order_date > '2023-06-01';", description: "Identifica gli utenti attivi che hanno effettuato ordini nel secondo semestre 2023." },
      { query: "SELECT p.name FROM Products p WHERE p.id NOT IN (SELECT product_id FROM OrderItems);", description: "Individua i prodotti 'invenduti' che non compaiono in nessun ordine." },
      { query: "SELECT upper(name) FROM Users;", description: "Normalizza i dati visualizzando i nomi utente in maiuscolo per uniformità." },
      { query: "SELECT concat(name, ' (', country, ')') as user_info FROM Users;", description: "Formatta una stringa descrittiva 'Nome (Paese)' per l'interfaccia utente." },
      { query: "SELECT *, round(price * 0.9, 2) as discounted_price FROM Products;", description: "Simula una promozione calcolando il prezzo scontato del 10% (arrotondato)." },
      { query: "SELECT datediff('2024-01-01', order_date) as days_ago FROM Orders;", description: "Calcola l'anzianità degli ordini in giorni rispetto all'inizio del 2024." },
      { query: "SELECT year(order_date) as anno, count(*) FROM Orders GROUP BY year(order_date);", description: "Analizza il trend di vendita contando il volume di ordini per anno." },
      { query: "SELECT p.name, oi.quantity FROM Products p JOIN OrderItems oi ON p.id = oi.product_id WHERE oi.quantity >= 3;", description: "Estrai i prodotti ordinati in quantità elevata (almeno 3 unità per riga d'ordine)." },
      { query: "SELECT u.email, count(o.id) FROM Users u LEFT JOIN Orders o ON u.id = o.user_id GROUP BY u.email ORDER BY count(o.id) DESC;", description: "Identifica i 'Top Spender' classificando gli utenti per numero di ordini." },
      { query: "SELECT p.category, sum(p.stock) as total_stock FROM Products p GROUP BY p.category;", description: "Ottimizza la logistica calcolando la quantità totale di merce per categoria." },
      { query: "SELECT e.name, e.department FROM Employees e WHERE e.salary > 80000;", description: "Trova i dipendenti con stipendio superiore a 80k€." },
      { query: "SELECT o.id, o.status FROM Orders o WHERE o.status IN ('Pending', 'Processing');", description: "Recupera gli ordini ancora in fase di lavorazione (Pending o Processing)." },
      { query: "SELECT u.name, max(o.order_date) as last_order FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name;", description: "Calcola la data dell'ultimo acquisto per ogni cliente (analisi recency)." },
      { query: "SELECT p.name, p.price FROM Products p WHERE p.price > (SELECT avg(price) FROM Products);", description: "Identifica i prodotti con posizionamento di prezzo sopra la media del catalogo." },
      { query: "SELECT DISTINCT p.category FROM Products p WHERE EXISTS (SELECT 1 FROM Products p2 WHERE p2.category = p.category AND p2.price > 200);", description: "Trova le categorie che contengono prodotti di lusso (> 200€)." },
      { query: "SELECT u.name, count(o.id) as total_orders FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name HAVING count(o.id) > 2;", description: "Premia la fedeltà: trova gli utenti che hanno effettuato più di 2 ordini." },
      { query: "SELECT p.name, CASE WHEN p.stock < 10 THEN 'Basso' ELSE 'Alto' END as stock_status FROM Products p;", description: "Crea un report di inventario con etichette di stato 'Basso' o 'Alto' per lo stock." },
      { query: "SELECT o.id, date_format(o.order_date, '%d/%m/%Y') as formatted_date FROM Orders o;", description: "Localizza le date degli ordini nel formato italiano gg/mm/aaaa." },
      { query: "SELECT p.name, length(p.name) as name_length FROM Products p;", description: "Analisi tecnica: calcola la lunghezza dei nomi prodotto per verifica layout." },
      { query: "SELECT distinct u.country FROM Users u JOIN Orders o ON u.id = o.user_id;", description: "Mappa i mercati attivi: trova i paesi da cui provengono ordini effettivi." },
      { query: "SELECT name FROM Products WHERE stock = 0;", description: "Trova i prodotti attualmente esauriti (stock pari a 0)." },
      { query: "SELECT p.name, coalesce(oi.quantity, 0) as qty FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id;", description: "Normalizza i dati ordini sostituendo i valori mancanti (NULL) con 0." }
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
        explanation: '',
        poolIndex: i
      });
    });
  } else if (difficulty === Difficulty.Hard) {
    const hardSnippets = [
      { query: "SELECT p.name, p.price, rank() OVER (ORDER BY p.price DESC) as price_rank FROM Products p;", description: "Crea una classifica dinamica dei prodotti per prezzo (dal più alto) utilizzando la funzione RANK()." },
      { query: "SELECT u.name, o.order_date, row_number() OVER (PARTITION BY u.id ORDER BY o.order_date DESC) as order_num FROM Users u JOIN Orders o ON u.id = o.user_id;", description: "Numera sequenzialmente gli ordini di ogni utente, partendo dal più recente (ROW_NUMBER)." },
      { query: "SELECT p.name, p.price, p.price - lag(p.price) OVER (ORDER BY p.price) as price_diff FROM Products p;", description: "Analisi differenziale: calcola lo scarto di prezzo rispetto al prodotto immediatamente precedente in classifica." },
      { query: "SELECT p.category, p.name, p.price, avg(p.price) OVER (PARTITION BY p.category) as avg_category_price FROM Products p;", description: "Confronta il prezzo di ogni prodotto con il prezzo medio della sua categoria di appartenenza." },
      { query: "WITH UserSpending AS (SELECT u.id, u.name, sum(oi.unit_price * oi.quantity) as total FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id GROUP BY u.id, u.name) SELECT * FROM UserSpending WHERE total > 1000;", description: "Identifica i clienti 'High Value' (spesa > 1000€) utilizzando una Common Table Expression (CTE)." },
      { query: "SELECT * FROM Products p1 WHERE p1.price > (SELECT avg(p2.price) FROM Products p2 WHERE p2.category = p1.category);", description: "Trova i prodotti 'fuori mercato' che costano più della media della loro specifica categoria (Subquery Correlata)." },
      { query: "SELECT u.name FROM Users u WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id);", description: "Individua gli utenti inattivi che non hanno mai effettuato ordini (tecnica NOT EXISTS)." },
      { query: "SELECT e.name, (SELECT count(*) FROM Employees e2 WHERE e2.manager_id = e.id) as direct_reports FROM Employees e;", description: "Genera un report manager con il conteggio dei diretti subordinati calcolato tramite subquery nella SELECT." },
      { query: "SELECT YEAR(order_date) as yr, MONTH(order_date) as mo, sum(order_total) as monthly_revenue FROM Orders GROUP BY yr, mo ORDER BY yr, mo;", description: "Analisi temporale: aggrega il fatturato totale per mese e anno." },
      { query: "SELECT p.name, ntile(4) OVER (ORDER BY p.price) as price_quartile FROM Products p;", description: "Segmentazione statistica: dividi i prodotti in 4 quartili basati sul prezzo." },
      { query: "SELECT u.name, first_value(o.order_date) OVER (PARTITION BY u.id ORDER BY o.order_date) as first_order FROM Users u JOIN Orders o ON u.id = o.user_id;", description: "Analisi coorte: trova la data di acquisizione (primo ordine) per ogni cliente." },
      { query: "SELECT p.category, p.name, p.price, dense_rank() OVER (PARTITION BY p.category ORDER BY p.price DESC) as cat_rank FROM Products p;", description: "Classifica i prodotti per prezzo all'interno di ogni categoria senza 'buchi' nel ranking (DENSE_RANK)." },
      { query: "SELECT u.country, p.name, count(*) as purchases FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.country, p.name ORDER BY u.country, purchases DESC;", description: "Analisi di mercato: individua i prodotti best-seller per ogni paese." },
      { query: "SELECT o.id, sum(oi.unit_price * oi.quantity) as order_total_calc, sum(sum(oi.unit_price * oi.quantity)) OVER () as grand_total FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id GROUP BY o.id;", description: "Report finanziario: mostra il totale di ogni ordine confrontato con il fatturato globale." },
      { query: "SELECT p.name, CASE WHEN p.price < 50 THEN 'Economico' WHEN p.price BETWEEN 50 AND 150 THEN 'Standard' ELSE 'Premium' END as price_tier FROM Products p;", description: "Segmentazione prodotti: assegna una fascia di prezzo (Economico, Standard, Premium) con logica condizionale." },
      { query: "SELECT u.name, lead(o.order_date) OVER (PARTITION BY u.id ORDER BY o.order_date) as next_order FROM Users u JOIN Orders o ON u.id = o.user_id;", description: "Analisi retention: per ogni ordine, mostra la data dell'acquisto successivo dello stesso cliente." },
      { query: "SELECT p.name, p.stock, sum(p.stock) OVER (ORDER BY p.id) as running_total_stock FROM Products p;", description: "Calcola il cumulativo progressivo (Running Total) dello stock di magazzino." },
      { query: "SELECT p.category, count(*) as num_products, sum(p.stock) as total_stock FROM Products p GROUP BY p.category ORDER BY total_stock DESC;", description: "Genera un report compatto delle categorie con conteggio prodotti e stock totale." },
      { query: "SELECT u.id, u.name FROM Users u UNION SELECT e.id, e.name FROM Employees e;", description: "Crea una lista unica di tutti i contatti (utenti e dipendenti) unificando le tabelle." },
      { query: "SELECT u.id FROM Users u EXCEPT SELECT o.user_id FROM Orders o;", description: "Trova gli ID degli utenti che NON hanno effettuato ordini usando l'operatore insiemistico EXCEPT." },
      { query: "SELECT DISTINCT o.user_id FROM Orders o INTERSECT SELECT DISTINCT u.id FROM Users u WHERE u.is_premium = true;", description: "Individua gli utenti Premium che hanno anche effettuato ordini (INTERSECT)." },
      { query: "SELECT p.name, p.price, percent_rank() OVER (ORDER BY p.price) as percentile FROM Products p;", description: "Analisi statistica: calcola il rango percentuale del prezzo per ogni prodotto." },
      { query: "WITH MonthlyRevenue AS (SELECT MONTH(order_date) as m, sum(order_total) as revenue FROM Orders GROUP BY m) SELECT m, revenue, revenue - lag(revenue) OVER (ORDER BY m) as growth FROM MonthlyRevenue;", description: "Calcola la crescita netta del fatturato (delta) rispetto al mese precedente." },
      { query: "SELECT p.name, cast(p.price as INT) as price_int FROM Products p;", description: "Normalizza i prezzi convertendo i valori decimali in interi (CAST)." },
      { query: "SELECT u.name, nullif(u.country, 'Unknown') as verified_country FROM Users u;", description: "Pulisci i dati: restituisci NULL se il campo paese contiene il valore placeholder 'Unknown'." },
      { query: "SELECT p.name, round(p.price, -1) as price_rounded_tens FROM Products p;", description: "Arrotonda i prezzi alla decina più vicina per semplificare il listino." },
      { query: "SELECT u.name, DAYNAME(o.order_date) as day_of_week FROM Users u JOIN Orders o ON u.id = o.user_id;", description: "Analisi temporale: estrai il giorno della settimana in cui è avvenuto l'ordine." },
      { query: "SELECT p.name, p.price FROM Products p WHERE p.price > ALL (SELECT price FROM Products WHERE category = 'Accessories');", description: "Trova i prodotti che costano più di TUTTI i prodotti della categoria Accessories (ALL)." },
      { query: "SELECT p.name, p.price FROM Products p WHERE p.price > ANY (SELECT price FROM Products WHERE category = 'Gaming');", description: "Trova i prodotti che costano più di ALMENO UNO dei prodotti della categoria Gaming (ANY)." },
      { query: "SELECT u.name, count(distinct oi.product_id) as different_products FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id GROUP BY u.name;", description: "Analisi varietà: conta quanti prodotti DIVERSI ha acquistato ogni singolo utente." }
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
        explanation: '',
        poolIndex: i
      });
    });
  }

  return exercises;
};

export const COMPLEX_SNIPPETS: Exercise[] = [];