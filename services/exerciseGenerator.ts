import { Difficulty, Exercise, TopicId } from "../types";

// --- UTILS ---
const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Shuffle array function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- DATA LISTS (TechStore Schema) ---
const DATA = {
  tables: [
    "Users",
    "Products",
    "Orders",
    "OrderItems",
    "Employees",
  ],
  columns_users: ["name", "email", "country", "is_premium", "created_at"],
  columns_products: ["name", "category", "price", "stock"],
  columns_orders: ["user_id", "order_date", "status", "order_total"],
  columns_orderitems: ["order_id", "product_id", "quantity", "unit_price"],
  columns_employees: ["name", "department", "hire_date", "manager_id"],
  countries: [
    "Italy",
    "France",
    "Germany",
    "Spain",
    "USA",
    "Netherlands",
    "UK",
    "Japan",
    "Canada",
  ],
  names: [
    "Mario Rossi",
    "Luigi Verdi",
    "John Doe",
    "Sophie Martin",
    "Marco Bianchi",
    "Giulia Neri",
    "Luca Ferrari",
    "Alice Chen",
  ],
  categories: [
    "Electronics",
    "Home",
    "Clothing",
    "Books",
    "Garden",
    "Sports",
    "Beauty",
  ],
  departments: [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
  ],
  order_statuses: ["Pending", "Shipped", "Delivered", "Cancelled"],
  product_names: [
    "Laptop Pro",
    "Smartphone X",
    "Monitor 4K",
    "T-Shirt Basic",
    "Modern Sofa",
    "Wireless Mouse",
    "Headphones Pro",
  ],
  prices_min: [10, 20, 50, 100, 150],
  prices_max: [200, 300, 500, 1000, 2000],
  years: [2022, 2023, 2024],
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  percentages: [1.1, 1.22, 0.9, 0.8, 1.5],
  stock_thresholds: [5, 10, 20, 50],
};


// --- BLUEPRINT INTERFACE ---
interface ExerciseBlueprint {
  titleTemplate: string;
  descTemplate: string;
  queryTemplate: string;
  hints: string[];
  explanation: string;
  replacements?: Record<string, (string | number)[]>;
  brokenCode?: string; // For Debug Mode: query with intentional error
  debugHint?: string; // For Debug Mode: hint about the error
}

// --- QUESTION DATABASE ---
const QUESTION_DATABASE: Record<string, Record<string, ExerciseBlueprint[]>> = {
  [TopicId.Basics]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Audit Totale: {table}",
        descTemplate: "Il Responsabile IT richiede un'estrazione completa della tabella '{table}' per controlli di integrità. Seleziona tutte le colonne e tutte le righe.",
        queryTemplate: "SELECT * FROM {table}",
        hints: ["Usa SELECT * per selezionare tutto.", "La sintassi è: SELECT * FROM {table}"],
        explanation: "SELECT * è il comando standard per ispezionare l'intero contenuto di una tabella.",
        replacements: { table: ["Users", "Products", "Orders", "Employees"] },
        brokenCode: "SELETC * FROM {table}",
        debugHint: "Controlla attentamente come hai scritto il comando 'SELECT'. C'è un errore di battitura."
      },
      {
        titleTemplate: "Lista {col} Utenti",
        descTemplate: "Il team Marketing necessita di una lista contenente solo la colonna '{col}' dalla tabella 'Users' per una campagna mirata.",
        queryTemplate: "SELECT {col} FROM Users",
        hints: ["Usa SELECT {col} FROM Users"],
        explanation: "Selezionare solo le colonne necessarie ottimizza le performance e la privacy.",
        replacements: { col: ["email", "name", "country", "is_premium"] },
        brokenCode: "SELECT {col} FORM Users",
        debugHint: "La parola chiave 'FROM' sembra scritta male. Verifica lo spelling."
      },
      {
        titleTemplate: "Catalogo: {col}",
        descTemplate: "Genera un report rapido che mostri esclusivamente la colonna '{col}' dalla tabella 'Products'.",
        queryTemplate: "SELECT {col} FROM Products",
        hints: ["Usa SELECT {col} FROM Products"],
        explanation: "La proiezione (selezione di colonne specifiche) permette di creare report focalizzati.",
        replacements: { col: ["name", "price", "stock", "category"] },
        brokenCode: "SELECT {col} FROM Poducts",
        debugHint: "Il nome della tabella 'Products' contiene un errore. Controlla le lettere."
      },
      {
        titleTemplate: "Tutte le Righe Ordini",
        descTemplate: "Il reparto Logistica deve analizzare gli ordini. Visualizza l'elenco completo di tutti i record nella tabella 'Orders'.",
        queryTemplate: "SELECT * FROM Orders",
        hints: ["Usa SELECT * FROM Orders"],
        explanation: "Visualizzare tutti i record permette l'analisi operativa.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders,",
        debugHint: "Hai lasciato una virgola di troppo alla fine della query? In SQL la virgola separa le colonne, non chiude l'istruzione."
      },
      {
        titleTemplate: "Elenco Dipendenti",
        descTemplate: "L'ufficio HR sta aggiornando l'anagrafica. Estrai tutti i dati relativi ai dipendenti ('Employees').",
        queryTemplate: "SELECT * FROM Employees",
        hints: ["Usa SELECT * FROM Employees"],
        explanation: "Mantenere l'anagrafica dipendenti accessibile è cruciale.",
        replacements: {},
        brokenCode: "SELECT * form Employees",
        debugHint: "Attenzione alla parola chiave 'FROM'. È scritta correttamente?"
      },
      {
        titleTemplate: "Info Prodotto: {col1}, {col2}",
        descTemplate: "Il manager chiede un report flash con solo {col1} e {col2} dalla tabella 'Products'.",
        queryTemplate: "SELECT {col1}, {col2} FROM Products",
        hints: ["Seleziona le due colonne separate da virgola.", "L'ordine richiesto è importante."],
        explanation: "I report ad-hoc richiedono spesso solo un sottoinsieme dei dati.",
        replacements: { col1: ["name"], col2: ["price", "stock"] },
        brokenCode: "SELECT {col1} {col2} FROM Products",
        debugHint: "Manca la virgola per separare le due colonne."
      },
      {
        titleTemplate: "Email e Paese",
        descTemplate: "Per analizzare la provenienza degli utenti, estrai le colonne 'email' e 'country' da tutti i record in 'Users'.",
        queryTemplate: "SELECT email, country FROM Users",
        hints: ["Usa SELECT email, country FROM Users"],
        explanation: "La segmentazione geografica aiuta il marketing.",
        replacements: {},
        brokenCode: "SELECT email; country FROM Users",
        debugHint: "Usa la virgola (,) per separare le colonne, non il punto e virgola (;)."
      },
      {
        titleTemplate: "Dettaglio Ordini: Data e Status",
        descTemplate: "Il customer care vuole controllare lo stato degli ordini. Seleziona 'order_date' e 'status' dalla tabella 'Orders'.",
        queryTemplate: "SELECT order_date, status FROM Orders",
        hints: ["Seleziona le colonne separate da virgola."],
        explanation: "Monitorare data e stato è essenziale per il tracking.",
        replacements: {},
        brokenCode: "SELECT order_date, status FROM Orders WHERE",
        debugHint: "Rimuovi la clausola WHERE se non stai filtrando nulla."
      },
      {
        titleTemplate: "Items Ordine",
        descTemplate: "Per verifica contabile, estrai tutte le righe dalla tabella di dettaglio 'OrderItems'.",
        queryTemplate: "SELECT * FROM OrderItems",
        hints: ["Usa SELECT *"],
        explanation: "La tabella di dettaglio contiene i singoli prodotti per ordine.",
        replacements: {},
        brokenCode: "SELECT ALL FROM OrderItems",
        debugHint: "Per selezionare tutto si usa l'asterisco (*), non 'ALL'."
      },
      {
        titleTemplate: "Nomi Dipendenti",
        descTemplate: "Per la rubrica interna, estrai solo la colonna 'name' dalla tabella 'Employees'.",
        queryTemplate: "SELECT name FROM Employees",
        hints: ["Seleziona la colonna 'name'."],
        explanation: "L'estrazione di nomi è la base per qualsiasi directory.",
        replacements: {},
        brokenCode: "SELECT name form Employees",
        debugHint: "Typo su FROM."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Alias Prodotto",
        descTemplate: "Il report richiede intestazioni in italiano. Seleziona 'name' dalla tabella 'Products' e rinominala come 'Nome_Prodotto'.",
        queryTemplate: "SELECT name AS Nome_Prodotto FROM Products",
        hints: ["Usa AS per l'alias.", "SELECT name AS Nome_Prodotto ..."],
        explanation: "Gli alias (AS) rendono i report più leggibili.",
        replacements: {},
        brokenCode: "SELECT name Nome_Prodotto FROM Products",
        debugHint: "Manca la parola chiave 'AS' per definire l'alias."
      },
      {
        titleTemplate: "Calcolo Valore Stock",
        descTemplate: "Calcola il valore totale per ogni prodotto moltiplicando 'price' per 'stock'. Rinomina il risultato come 'Valore_Totale'. Estrai anche il nome.",
        queryTemplate: "SELECT name, price * stock AS Valore_Totale FROM Products",
        hints: ["Moltiplica le colonne.", "Usa AS per rinominare il calcolo."],
        explanation: "SQL permette calcoli matematici diretti sulle colonne.",
        replacements: {},
        brokenCode: "SELECT name, price * stock Valore_Totale FROM Products",
        debugHint: "Manca AS prima dell'alias."
      },
      {
        titleTemplate: "Prezzo Scontato ({perc}%)",
        descTemplate: "Simula uno sconto del {perc}%. Seleziona 'name' e il prezzo moltiplicato per 0.{perc_decimal}, rinominandolo 'Prezzo_Scontato'.",
        queryTemplate: "SELECT name, price * 0.{perc_decimal} AS Prezzo_Scontato FROM Products",
        hints: ["Moltiplica per il fattore decimale.", "Rinomina con AS."],
        explanation: "I calcoli di sconto sono comuni nei report di vendita.",
        replacements: { perc: ["10", "20"], perc_decimal: ["90", "80"] },
        brokenCode: "SELECT name, price * 0.{perc_decimal} AS Prezzo-Scontato FROM Products",
        debugHint: "Usa underscore (_) invece del trattino (-) nell'alias."
      },
      {
        titleTemplate: "Stima IVA (22%)",
        descTemplate: "Calcola il prezzo con IVA (x 1.22) per ogni prodotto. Mostra 'name' e 'price * 1.22' con alias 'Prezzo_Ivato'.",
        queryTemplate: "SELECT name, price * 1.22 AS Prezzo_Ivato FROM Products",
        hints: ["Moltiplica per 1.22", "Usa AS."],
        explanation: "L'aggiunta dell'IVA è un calcolo standard.",
        replacements: {},
        brokenCode: "SELECT name, price * 1,22 AS Prezzo_Ivato FROM Products",
        debugHint: "Usa il punto (.) per i decimali, non la virgola."
      },
      {
        titleTemplate: "Alias Multipli",
        descTemplate: "Estrai da 'Users': 'name' come 'Cliente', 'email' come 'Contatto' e 'country' come 'Nazione'.",
        queryTemplate: "SELECT name AS Cliente, email AS Contatto, country AS Nazione FROM Users",
        hints: ["Usa AS per ogni colonna.", "Separa con virgole."],
        explanation: "Rinominare più colonne crea report pronti all'uso.",
        replacements: {},
        brokenCode: "SELECT name AS Cliente email AS Contatto FROM Users",
        debugHint: "Manca la virgola tra le definizioni delle colonne."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Database Offset ({start}-{end})",
        descTemplate: "L'auditor sta controllando un campione centrale. Estrai tutti i dati da 'Users' limitando a 20 righe e saltando le prime {skip}.",
        queryTemplate: "SELECT * FROM Users LIMIT 20 OFFSET {skip}",
        hints: ["Usa LIMIT insieme a OFFSET."],
        explanation: "LIMIT e OFFSET sono la base della paginazione.",
        replacements: { skip: ["50", "100", "200"] },
        brokenCode: "SELECT * FROM Users LIMIT 20 SKIP {skip}",
        debugHint: "Usa 'OFFSET', non 'SKIP'."
      },
      {
        titleTemplate: "Paginazione Prodotti",
        descTemplate: "Estrai i 10 prodotti per la pagina {page} (salta i primi {skip}). Tabella: 'Products'.",
        queryTemplate: "SELECT * FROM Products LIMIT 10 OFFSET {skip}",
        hints: ["LIMIT 10 OFFSET {skip}"],
        explanation: "Paginazione standard.",
        replacements: { page: ["2", "3"], skip: ["10", "20"] },
        brokenCode: "SELECT * FROM Products LIMIT 10, {skip}",
        debugHint: "Usa la sintassi standard 'LIMIT ... OFFSET ...'."
      },
      {
        titleTemplate: "Distinct Multiplo",
        descTemplate: "L'analista vuole le combinazioni uniche di 'country' e 'is_premium' da 'Users'.",
        queryTemplate: "SELECT DISTINCT country, is_premium FROM Users",
        hints: ["SELECT DISTINCT col1, col2 ..."],
        explanation: "DISTINCT su più colonne mostra combinazioni uniche.",
        replacements: {},
        brokenCode: "SELECT DISTINCT country AND is_premium FROM Users",
        debugHint: "Usa la virgola per separare le colonne."
      },
      {
        titleTemplate: "Distinct Ordinato",
        descTemplate: "Estrai la lista dei paesi unici ('country') da 'Users' e ordinali alfabeticamente.",
        queryTemplate: "SELECT DISTINCT country FROM Users ORDER BY country",
        hints: ["DISTINCT ... ORDER BY ..."],
        explanation: "Puoi ordinare i risultati unici.",
        replacements: {},
        brokenCode: "SELECT DISTINCT country ORDER BY country FROM Users",
        debugHint: "ORDER BY va dopo FROM."
      },
      {
        titleTemplate: "Ordini Paginati",
        descTemplate: "Mostra gli ordini (Orders) dal numero 11 al 20 (LIMIT 10, OFFSET 10).",
        queryTemplate: "SELECT * FROM Orders LIMIT 10 OFFSET 10",
        hints: ["OFFSET 10 salta i primi 10."],
        explanation: "Scorrere grandi dataset in parti gestibili.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders OFFSET 10 LIMIT 10",
        debugHint: "Scrivi prima LIMIT e poi OFFSET."
      },
      {
        titleTemplate: "Top {x} Prodotti",
        descTemplate: "Estrai solo i primi {x} prodotti dalla tabella 'Products'.",
        queryTemplate: "SELECT * FROM Products LIMIT {x}",
        hints: ["Usa LIMIT."],
        explanation: "Utile per dashboard e anteprime.",
        replacements: { x: ["3", "5", "8"] },
        brokenCode: "SELECT * FROM Products TOP {x}",
        debugHint: "Usa LIMIT {x} al posto di TOP."
      },
      {
        titleTemplate: "Combinazioni Categoria/Prezzo",
        descTemplate: "Estrai le combinazioni uniche di 'category' e 'price' dalla tabella 'Products'.",
        queryTemplate: "SELECT DISTINCT category, price FROM Products",
        hints: ["DISTINCT su due campi."],
        explanation: "Analisi della struttura dell'offerta.",
        replacements: {},
        brokenCode: "SELECT DISTINCT (category, price) FROM Products",
        debugHint: "Rimuovi le parentesi."
      },
      {
        titleTemplate: "Offset Iniziale",
        descTemplate: "Visualizza id e data degli ordini da 'Orders', saltando i primi 5 e mostrandone 5.",
        queryTemplate: "SELECT id, order_date FROM Orders LIMIT 5 OFFSET 5",
        hints: ["LIMIT 5 OFFSET 5"],
        explanation: "Ignorare i dati di testa.",
        replacements: {},
        brokenCode: "SELECT id, order_date FROM Orders OFFSET 5",
        debugHint: "OFFSET richiede solitamente un LIMIT."
      },
      {
        titleTemplate: "Mercati (Alias Distinct)",
        descTemplate: "Estrai i paesi unici da 'Users' e rinomina la colonna come 'Market'.",
        queryTemplate: "SELECT DISTINCT country AS Market FROM Users",
        hints: ["AS funziona anche con DISTINCT."],
        explanation: "Alias sul risultato finale.",
        replacements: {},
        brokenCode: "SELECT DISTINCT country Market FROM Users",
        debugHint: "Manca 'AS'."
      },
      {
        titleTemplate: "Profili Utente (Concat)",
        descTemplate: "Crea una lista unica: 'name <email>' da 'Users', chiamando la colonna 'Contact'.",
        queryTemplate: "SELECT DISTINCT name || ' <' || email || '>' AS Contact FROM Users",
        hints: ["Usa || per concatenare.", "DISTINCT rimuove duplicati."],
        explanation: "Concatena stringhe e rimuovi duplicati in un colpo solo.",
        replacements: {},
        brokenCode: "SELECT DISTINCT name + ' ' + email AS Contact FROM Users",
        debugHint: "Usa || per le stringhe."
      }
    ]
  },
  [TopicId.Filtering]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Filtra per Paese",
        descTemplate: "Seleziona tutti gli utenti che provengono dall'Italia.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Usa WHERE country = 'Italy'"],
        explanation: "La clausola WHERE filtra le righe in base a una condizione.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country Is 'Italy'",
        debugHint: "Usa l'operatore '=' per i confronti esatti."
      },
      {
        titleTemplate: "Filtra per Prezzo",
        descTemplate: "Seleziona tutti i prodotti con un prezzo inferiore a 50.",
        queryTemplate: "SELECT * FROM Products WHERE price < 50",
        hints: ["Usa l'operatore minore (<)."],
        explanation: "Gli operatori di confronto (<, >, =) sono fondamentali.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price less 50",
        debugHint: "Usa il simbolo '<' invece della parola 'less'."
      },
      {
        titleTemplate: "Ordini Spediti",
        descTemplate: "Trova tutti gli ordini con lo status 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Filtra per status = 'Shipped'."],
        explanation: "Filtrare per stato è comune nei workflow.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status 'Shipped'",
        debugHint: "Manca l'operatore '='."
      },
      {
        titleTemplate: "Utenti Premium",
        descTemplate: "Seleziona solo gli utenti che hanno l'abbonamento premium attivo.",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = true",
        hints: ["is_premium è un campo booleano (true/false)."],
        explanation: "I campi booleani si filtrano con true o false.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE is_premium = 'yes'",
        debugHint: "Usa true (senza virgolette) per i booleani."
      },
      {
        titleTemplate: "Stock Basso",
        descTemplate: "Trova i prodotti con meno di 10 unità in magazzino.",
        queryTemplate: "SELECT * FROM Products WHERE stock < 10",
        hints: ["Usa stock < 10"],
        explanation: "Utile per gestire i riordini.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock < '10'",
        debugHint: "I numeri non vanno tra virgolette, anche se spesso funziona lo stesso."
      },
      {
        titleTemplate: "Dipendenti IT",
        descTemplate: "Seleziona tutti i dipendenti del dipartimento 'IT'.",
        queryTemplate: "SELECT * FROM Employees WHERE department = 'IT'",
        hints: ["Filtra per department."],
        explanation: "Filtrare per dipartimento organizza le risorse umane.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE department = IT",
        debugHint: "Le stringhe devono essere racchiuse tra apici singoli ('IT')."
      },
      {
        titleTemplate: "Ordini Recenti",
        descTemplate: "Trova gli ordini effettuati il '2024-01-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date = '2024-01-01'",
        hints: ["Le date vanno tra apici singoli."],
        explanation: "Le date in SQL sono stringhe formattate YYYY-MM-DD.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_date IS '2024-01-01'",
        debugHint: "Per le date precise usa '=', non 'IS'."
      },
      {
        titleTemplate: "Filtra per ID",
        descTemplate: "Trova l'utente specifico con ID 5.",
        queryTemplate: "SELECT * FROM Users WHERE id = 5",
        hints: ["L'ID è univoco."],
        explanation: "La ricerca per ID è la più veloce.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE id == 5",
        debugHint: "In SQL l'uguaglianza si esprime con un singolo '='."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Range di Prezzo",
        descTemplate: "Trova i prodotti con prezzo compreso tra 20 e 100 (inclusi).",
        queryTemplate: "SELECT * FROM Products WHERE price BETWEEN 20 AND 100",
        hints: ["Usa l'operatore BETWEEN ... AND ..."],
        explanation: "BETWEEN semplifica i filtri su intervalli.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price > 20 AND < 100",
        debugHint: "Devi ripetere il nome della colonna: 'price > 20 AND price < 100', oppure usare BETWEEN."
      },
      {
        titleTemplate: "Paesi Multipli (IN)",
        descTemplate: "Seleziona gli utenti che vivono in 'Italy' o 'France'.",
        queryTemplate: "SELECT * FROM Users WHERE country IN ('Italy', 'France')",
        hints: ["Usa l'operatore IN con una lista."],
        explanation: "IN è più compatto di tanti OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IN 'Italy', 'France'",
        debugHint: "La lista dopo IN deve essere tra parentesi tonde."
      },
      {
        titleTemplate: "Ricerca Testuale (LIKE)",
        descTemplate: "Trova tutti i prodotti il cui nome inizia con la lettera 'S'.",
        queryTemplate: "SELECT * FROM Products WHERE name LIKE 'S%'",
        hints: ["Usa LIKE 'S%'."],
        explanation: "Il simbolo % è un jolly che indica 'qualsiasi testo'.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE name = 'S%'",
        debugHint: "Per i pattern matching si usa LIKE, non =."
      },
      {
        titleTemplate: "Filtro Composto (AND)",
        descTemplate: "Trova gli utenti 'France' che sono anche Premium.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'France' AND is_premium = true",
        hints: ["Usa AND per combinare le condizioni."],
        explanation: "AND richiede che entrambe le condizioni siano vere.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country = 'France' & is_premium = true",
        debugHint: "Usa 'AND', non il simbolo '&'."
      },
      {
        titleTemplate: "Esclusione (NOT)",
        descTemplate: "Seleziona tutti gli ordini che NON sono 'Pending'.",
        queryTemplate: "SELECT * FROM Orders WHERE status != 'Pending'",
        hints: ["Usa l'operatore diverso (!= o <>)."],
        explanation: "Escludere status è utile per vedere ordini chiusi o spediti.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status NOT 'Pending'",
        debugHint: "La sintassi è 'colonna != valore' o 'NOT colonna = valore'."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Logica Complessa (OR/AND)",
        descTemplate: "Trova i prodotti che sono nella categoria 'Electronics' OPPURE che costano meno di 10 euro.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics' OR price < 10",
        hints: ["Usa OR per unire le condizioni."],
        explanation: "OR richiede che almeno una delle condizioni sia vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Electronics' AND price < 10",
        debugHint: "AND restringe troppo; per 'o l'uno o l'altro' serve OR."
      },
      {
        titleTemplate: "Filtro Nulla (IS NULL)",
        descTemplate: "Trova i dipendenti che non hanno un manager assegnato (manager_id è nullo).",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Usa IS NULL."],
        explanation: "I valori NULL si controllano solo con IS NULL, non con =.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE manager_id = NULL",
        debugHint: "In SQL, nulla è uguale a NULL. Usa 'IS NULL'."
      },
      {
        titleTemplate: "Priorità Operatori",
        descTemplate: "Trova i prodotti 'Electronics' che costano più di 500, OPPURE qualsiasi prodotto 'Accessories'. Fai attenzione alle parentesi.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Electronics' AND price > 500) OR category = 'Accessories'",
        hints: ["Usa parentesi per raggruppare la logica."],
        explanation: "AND ha priorità su OR, le parentesi chiarezano l'intento.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Electronics' AND price > 500 OR category = 'Accessories'",
        debugHint: "Senza parentesi, l'interpretazione potrebbe essere diversa da quella voluta."
      },
      {
        titleTemplate: "Pattern Matching Avanzato",
        descTemplate: "Trova gli utenti con email che termina con '.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%.com'",
        hints: ["Usa LIKE con % all'inizio."],
        explanation: "Il jolly % può stare ovunque.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE email CONTAINS '.com'",
        debugHint: "SQL standard non ha CONTAINS, usa LIKE."
      },
      {
        titleTemplate: "Range Date",
        descTemplate: "Trova gli ordini effettuati nel mese di Gennaio 2024 (dal 01 al 31).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'",
        hints: ["Date tra apici, usa BETWEEN."],
        explanation: "Filtrare per range temporali.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_date > '2024-01-01'",
        debugHint: "Serve anche un limite superiore."
      }
    ]
  },
  [TopicId.Sorting]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Nomi Utenti A-Z",
        descTemplate: "Ordina la lista degli utenti alfabeticamente per nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY name ASC",
        hints: ["Usa ORDER BY name ASC"],
        explanation: "L'ordine alfabetico è il default per le stringhe.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY name",
        debugHint: "Anche se ASC è il default, è buona pratica specificarlo per chiarezza negli esercizi."
      },
      {
        titleTemplate: "Prezzi Decrescenti",
        descTemplate: "Visualizza i prodotti dal più costoso al più economico.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC",
        hints: ["Usa ORDER BY price DESC"],
        explanation: "DESC inverte l'ordine standard.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY price DES",
        debugHint: "Typo in DESC."
      },
      {
        titleTemplate: "Ordini per Data",
        descTemplate: "Mostra gli ordini ordinati per data (dal più vecchio).",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date ASC",
        hints: ["Usa ORDER BY order_date ASC"],
        explanation: "Le date vengono ordinate cronologicamente con ASC.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER BY date ASC",
        debugHint: "La colonna si chiama 'order_date'."
      },
      {
        titleTemplate: "Stock Prodotti",
        descTemplate: "Ordina i prodotti per quantità in magazzino (crescente).",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC",
        hints: ["Usa ORDER BY stock ASC"],
        explanation: "Utile per vedere cosa sta finendo.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY stock",
        debugHint: "Specifica ASC."
      },
      {
        titleTemplate: "Dipendenti per Reparto",
        descTemplate: "Ordina i dipendenti in base al loro dipartimento.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department ASC",
        hints: ["Usa ORDER BY department"],
        explanation: "Raggruppa visivamente i dipendenti.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees SORT BY department",
        debugHint: "In SQL si usa 'ORDER BY', non 'SORT BY'."
      },
      {
        titleTemplate: "Ordini per Status",
        descTemplate: "Ordina gli ordini alfabeticamente per il loro stato.",
        queryTemplate: "SELECT * FROM Orders ORDER BY status ASC",
        hints: ["Usa ORDER BY status ASC"],
        explanation: "Crea gruppi di stati simili.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER status ASC",
        debugHint: "Manca 'BY'."
      },
      {
        titleTemplate: "Utenti per Paese",
        descTemplate: "Ordina gli utenti per paese di provenienza (Z-A).",
        queryTemplate: "SELECT * FROM Users ORDER BY country DESC",
        hints: ["Usa ORDER BY country DESC"],
        explanation: "Ordine alfabetico inverso.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY country DOWN",
        debugHint: "Si usa DESC, non DOWN."
      },
      {
        titleTemplate: "Prodotti per Categoria",
        descTemplate: "Ordina i prodotti in base alla loro categoria.",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC",
        hints: ["Usa ORDER BY category"],
        explanation: "Raggruppa i prodotti simili.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY cat ASC",
        debugHint: "Nome colonna errato."
      },
      {
        titleTemplate: "Ordina per ID",
        descTemplate: "Ripristina l'ordinamento naturale per ID decrescente (ultimi inseriti).",
        queryTemplate: "SELECT * FROM Users ORDER BY id DESC",
        hints: ["Usa ORDER BY id DESC"],
        explanation: "Gli ID sequenziali mostrano l'ordine di inserimento.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY id -1",
        debugHint: "Usa DESC per l'invio inverso."
      },
      {
        titleTemplate: "Email Ordinate",
        descTemplate: "Ordina gli utenti per indirizzo email.",
        queryTemplate: "SELECT * FROM Users ORDER BY email ASC",
        hints: ["Usa ORDER BY email"],
        explanation: "Utile per liste di distribuzione.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY mail ASC",
        debugHint: "La colonna è 'email'."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Top 3 Prodotti Costosi",
        descTemplate: "Trova i 3 prodotti con il prezzo più alto.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC LIMIT 3",
        hints: ["ORDER BY ... DESC LIMIT 3"],
        explanation: "Combina ordinamento e limite per le classifiche.",
        replacements: {},
        brokenCode: "SELECT * FROM Products LIMIT 3 ORDER BY price DESC",
        debugHint: "ORDER BY deve venire prima di LIMIT."
      },
      {
        titleTemplate: "Ultimi 5 Ordini",
        descTemplate: "Trova i 5 ordini più recenti.",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date DESC LIMIT 5",
        hints: ["Ordina per data decrescente."],
        explanation: "Il modo standard per vedere le ultime attività.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders TOP 5 ORDER BY order_date DESC",
        debugHint: "Usa LIMIT alla fine della query."
      },
      {
        titleTemplate: "Ordinamento Multiplo",
        descTemplate: "Ordina i prodotti per categoria e, a parità di categoria, per prezzo decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC, price DESC",
        hints: ["Usa virgola per separare i criteri."],
        explanation: "L'ordinamento secondario risolve i 'pareggi'.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY category AND price",
        debugHint: "Usa la virgola, non AND."
      },
      {
        titleTemplate: "Utenti per Paese e Nome",
        descTemplate: "Ordina utenti per paese e poi per nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name ASC",
        hints: ["country ASC, name ASC"],
        explanation: "Organizzazione gerarchica dei dati.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY country, name DESC",
        debugHint: "Il nome deve essere ASC come richiesto."
      },
      {
        titleTemplate: "Prodotti Economici (Offset)",
        descTemplate: "Salta i 3 prodotti più economici e mostra i successivi 3.",
        queryTemplate: "SELECT * FROM Products ORDER BY price ASC LIMIT 3 OFFSET 3",
        hints: ["LIMIT 3 OFFSET 3"],
        explanation: "Paginazione su dati ordinati.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY price ASC OFFSET 3",
        debugHint: "OFFSET richiede LIMIT (o fetch)."
      },
      {
        titleTemplate: "Alias nell'Ordinamento",
        descTemplate: "Estrai 'name' come 'Prodotto' e ordina usando l'alias.",
        queryTemplate: "SELECT name AS Prodotto FROM Products ORDER BY Prodotto ASC",
        hints: ["Puoi usare l'alias in ORDER BY."],
        explanation: "SQL permette di riferirsi agli alias definiti nella SELECT.",
        replacements: {},
        brokenCode: "SELECT name AS Prodotto FROM Products ORDER BY name ASC",
        debugHint: "Funziona, ma prova a usare l'alias 'Prodotto' nell'ORDER BY."
      },
      {
        titleTemplate: "Ordina per Calcolo",
        descTemplate: "Ordina i prodotti per valore totale (prezzo * stock) decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY price * stock DESC",
        hints: ["Puoi scrivere formule in ORDER BY."],
        explanation: "L'ordinamento dinamico su valori calcolati è potente.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY total_value DESC",
        debugHint: "Non avendo definito 'total_value' in SELECT, devi ripetere la formula."
      },
      {
        titleTemplate: "Dipendenti per Assunzione",
        descTemplate: "Chi sono i primi 3 dipendenti assunti? Ordina per data assunzione.",
        queryTemplate: "SELECT * FROM Employees ORDER BY hire_date ASC LIMIT 3",
        hints: ["hire_date ASC"],
        explanation: "L'anzianità si calcola sulla data di assunzione.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER BY hired ASC",
        debugHint: "Colonna 'hire_date'."
      },
      {
        titleTemplate: "Ordini Urgenti",
        descTemplate: "Mostra gli ordini 'Processing' ordinati per data (i più vecchi prima).",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Processing' ORDER BY order_date ASC",
        hints: ["WHERE prima di ORDER BY."],
        explanation: "Ordine corretto delle clausole: SELECT, FROM, WHERE, ORDER BY.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER BY order_date WHERE status = 'Processing'",
        debugHint: "Clause WHERE deve venire prima di ORDER BY."
      },
      {
        titleTemplate: "Seconda Pagina Utenti",
        descTemplate: "Mostra gli utenti dal 6° al 10° in ordine alfabetico.",
        queryTemplate: "SELECT * FROM Users ORDER BY name ASC LIMIT 5 OFFSET 5",
        hints: ["LIMIT 5 OFFSET 5"],
        explanation: "Paginazione alfabetica.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY name LIMIT 5, 5",
        debugHint: "Meglio usare la sintassi esplicita OFFSET."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Ordinamento Posizionale",
        descTemplate: "Ordina i prodotti usando il numero della colonna (es. 3 per prezzo) invece del nome.",
        queryTemplate: "SELECT id, name, price FROM Products ORDER BY 3 DESC",
        hints: ["ORDER BY 3 fa riferimento alla terza colonna selezionata."],
        explanation: "Scorciatoia storica, ma meno leggibile del nome.",
        replacements: {},
        brokenCode: "SELECT id, name, price FROM Products ORDER BY column 3",
        debugHint: "Scrivi solo il numero: ORDER BY 3."
      },
      {
        titleTemplate: "Nulls First/Last",
        descTemplate: "Ordina i dipendenti per manager_id. Quelli senza manager (NULL) devono apparire alla fine.",
        queryTemplate: "SELECT * FROM Employees ORDER BY manager_id ASC NULLS LAST",
        hints: ["Usa NULLS LAST."],
        explanation: "Gestione fine dei valori nulli nell'ordinamento.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER BY manager_id ASC LAST NULLS",
        debugHint: "Sintassi: NULLS LAST."
      },
      {
        titleTemplate: "Random Order",
        descTemplate: "Seleziona 3 prodotti a caso.",
        queryTemplate: "SELECT * FROM Products ORDER BY RAND() LIMIT 3",
        hints: ["Usa RAND() o RANDOM() in ORDER BY."],
        explanation: "Utile per campionamenti casuali.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY RANDOM LIMIT 3",
        debugHint: "RAND() è una funzione, servono le parentesi."
      },
      {
        titleTemplate: "Best Customers (Subquery simulation)",
        descTemplate: "Ordina gli utenti per 'is_premium' (prima i true) e poi per data creazione decrescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY is_premium DESC, created_at DESC",
        hints: ["I booleani si ordinano come 1 (true) e 0 (false)."],
        explanation: "Ordinare per booleano mette i TRUE prima dei FALSE (se DESC).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY is_premium, created_at",
        debugHint: "Specifica DESC per il booleano se vuoi i Premium prima."
      },
      {
        titleTemplate: "Lunghezza Nome",
        descTemplate: "Ordina i prodotti in base alla lunghezza del loro nome (dal più corto).",
        queryTemplate: "SELECT * FROM Products ORDER BY LEN(name) ASC",
        hints: ["Usa la funzione LEN() o LENGTH()."],
        explanation: "Puoi ordinare sul risultato di funzioni.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY SIZE(name)",
        debugHint: "In SQL standard è LENGTH o LEN."
      },
      {
        titleTemplate: "Paginazione Avanzata",
        descTemplate: "Visualizza la pagina 4 (items 31-40) degli ordini ordinati per ID.",
        queryTemplate: "SELECT * FROM Orders ORDER BY id ASC LIMIT 10 OFFSET 30",
        hints: ["Offset = (pagina-1) * limit."],
        explanation: "Calcolo offset: (4-1)*10 = 30.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER BY id LIMIT 10 OFFSET 40",
        debugHint: "Pagina 4 inizia dopo 30 items, non 40."
      },
      {
        titleTemplate: "Sorting su CASE",
        descTemplate: "Ordina i prodotti: prima quelli con stock < 10 ('Urgent'), poi gli altri.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock < 10 THEN 0 ELSE 1 END, stock ASC",
        hints: ["Usa CASE WHEN in ORDER BY."],
        explanation: "Ordinamento logico personalizzato.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY stock < 10",
        debugHint: "I booleani in ORDER BY variano tra database, CASE è più sicuro."
      },
      {
        titleTemplate: "Filtra e Ordina Multi",
        descTemplate: "Prendi prodotti 'Electronics', ordina per stock desc e poi prezzo asc.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics' ORDER BY stock DESC, price ASC",
        hints: ["WHERE ... ORDER BY col1, col2"],
        explanation: "Combina tutte le clausole.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Electronics' ORDER BY stock, price",
        debugHint: "Definisci la direzione (DESC/ASC) per ogni colonna chiave."
      },
      {
        titleTemplate: "Top 1 per Categoria (Simulato)",
        descTemplate: "Estrai il prodotto più costoso in assoluto.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC LIMIT 1",
        hints: ["Solo il primo record."],
        explanation: "Il modo più semplice per trovare il max/min dell'intera tabella.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY price LIMIT 1",
        debugHint: "Senza DESC ottieni il più economico."
      },
      {
        titleTemplate: "Ultimi Arrivi Premium",
        descTemplate: "Utenti premium recenti (ultimi 5).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = true ORDER BY created_at DESC LIMIT 5",
        hints: ["WHERE is_premium ... ORDER BY ..."],
        explanation: "Dashboard tipica.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY created_at WHERE is_premium = true",
        debugHint: "L'ordine delle clausole è errato."
      }
    ]
  },
  [TopicId.Aggregation]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Conta Utenti",
        descTemplate: "Calcola il numero totale di utenti registrati.",
        queryTemplate: "SELECT COUNT(*) FROM Users",
        hints: ["Usa COUNT(*)"],
        explanation: "COUNT(*) conta tutte le righe della tabella.",
        replacements: {},
        brokenCode: "SELECT COUNT FROM Users",
        debugHint: "COUNT è una funzione, servono le parentesi."
      },
      {
        titleTemplate: "Conta Prodotti",
        descTemplate: "Quanti prodotti ci sono nel catalogo?",
        queryTemplate: "SELECT COUNT(*) FROM Products",
        hints: ["Usa COUNT(*)"],
        explanation: "La funzione di aggregazione base.",
        replacements: {},
        brokenCode: "SELECT COUNT(*) Products",
        debugHint: "Manca 'FROM'."
      },
      {
        titleTemplate: "Prezzo Medio",
        descTemplate: "Calcola il prezzo medio dei prodotti.",
        queryTemplate: "SELECT AVG(price) FROM Products",
        hints: ["Usa AVG(price)"],
        explanation: "AVG calcola la media aritmetica.",
        replacements: {},
        brokenCode: "SELECT AVERAGE(price) FROM Products",
        debugHint: "In SQL la funzione è AVG, non AVERAGE."
      },
      {
        titleTemplate: "Totale Valore Ordini",
        descTemplate: "Calcola la somma totale di tutti gli 'order_total' negli ordini.",
        queryTemplate: "SELECT SUM(order_total) FROM Orders",
        hints: ["Usa SUM(order_total)"],
        explanation: "SUM somma tutti i valori di una colonna numerica.",
        replacements: {},
        brokenCode: "SELECT SUM(order_total) FROM Orders WHERE",
        debugHint: "Rimuovi WHERE se vuoi il totale globale."
      },
      {
        titleTemplate: "Stock Minimo",
        descTemplate: "Trova la quantità minima di stock presente per un prodotto.",
        queryTemplate: "SELECT MIN(stock) FROM Products",
        hints: ["Usa MIN(stock)"],
        explanation: "MIN trova il valore più basso.",
        replacements: {},
        brokenCode: "SELECT MINIMUM(stock) FROM Products",
        debugHint: "Usa MIN, non MINIMUM."
      },
      {
        titleTemplate: "Prezzo Massimo",
        descTemplate: "Qual è il prezzo più alto nel catalogo?",
        queryTemplate: "SELECT MAX(price) FROM Products",
        hints: ["Usa MAX(price)"],
        explanation: "MAX trova il valore più alto.",
        replacements: {},
        brokenCode: "SELECT MAX(price) FROM Products ORDER BY price",
        debugHint: "Con MAX ottieni una sola riga, ORDER BY non serve."
      },
      {
        titleTemplate: "Conta Ordini",
        descTemplate: "Conta quanti ordini sono stati effettuati.",
        queryTemplate: "SELECT COUNT(*) FROM Orders",
        hints: ["Usa COUNT(*)"],
        explanation: "Conta le righe in Orders.",
        replacements: {},
        brokenCode: "SELECT COUNT * FROM Orders",
        debugHint: "Le parentesi sono obbligatorie: COUNT(*)."
      },
      {
        titleTemplate: "Stipendio Medio (Simulato)",
        descTemplate: "Non c'è stipendio, ma calcoliamo la media dei prezzi come esercizio.",
        queryTemplate: "SELECT AVG(price) FROM Products",
        hints: ["Usa AVG."],
        explanation: "Esercizio di media.",
        replacements: {},
        brokenCode: "SELECT AVG(price, stock) FROM Products",
        debugHint: "AVG accetta un solo argomento."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Utenti per Paese",
        descTemplate: "Conta quanti utenti ci sono per ogni paese.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country",
        hints: ["Usa GROUP BY country."],
        explanation: "Raggruppa le righe per paese e conta le occorrenze.",
        replacements: {},
        brokenCode: "SELECT country, COUNT(*) FROM Users",
        debugHint: "Se selezioni una colonna non aggregata (country), devi usarla in GROUP BY."
      },
      {
        titleTemplate: "Prodotti per Categoria",
        descTemplate: "Conta quanti prodotti ci sono in ogni categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category",
        hints: ["GROUP BY category"],
        explanation: "Analisi della distribuzione dei prodotti.",
        replacements: {},
        brokenCode: "SELECT category, count FROM Products GROUP BY category",
        debugHint: "COUNT(*) è la funzione corretta."
      },
      {
        titleTemplate: "Media Prezzi per Categoria",
        descTemplate: "Calcola il prezzo medio dei prodotti per ogni categoria.",
        queryTemplate: "SELECT category, AVG(price) FROM Products GROUP BY category",
        hints: ["AVG(price) ... GROUP BY category"],
        explanation: "Aggregazione numerica per gruppo.",
        replacements: {},
        brokenCode: "SELECT category, AVG(price) FROM Products GROUP BY price",
        debugHint: "Devi raggruppare per la colonna dimensionale (category), non quella metrica (price)."
      },
      {
        titleTemplate: "Totale Ordini per Status",
        descTemplate: "Per ogni status ordine, calcola la somma degli importi (order_total).",
        queryTemplate: "SELECT status, SUM(order_total) FROM Orders GROUP BY status",
        hints: ["SUM(order_total) ... GROUP BY status"],
        explanation: "Analisi del fatturato per stato ordine.",
        replacements: {},
        brokenCode: "SELECT status, SUM(order_total) FROM Orders",
        debugHint: "Manca GROUP BY status."
      },
      {
        titleTemplate: "Max Stock per Fornitore",
        descTemplate: "Trova lo stock massimo posseduto per ogni fornitore (fornitore_id).",
        queryTemplate: "SELECT fornitore_id, MAX(stock) FROM Products GROUP BY fornitore_id",
        hints: ["GROUP BY fornitore_id"],
        explanation: "Massimi locali per gruppo.",
        replacements: {},
        brokenCode: "SELECT fornitore_id, MAX(stock) FROM Products GROUP BY stock",
        debugHint: "Raggruppa per fornitore_id."
      },
      {
        titleTemplate: "Conta Utenti Premium per Paese",
        descTemplate: "Conta gli utenti raggruppati per paese e status premium.",
        queryTemplate: "SELECT country, is_premium, COUNT(*) FROM Users GROUP BY country, is_premium",
        hints: ["GROUP BY country, is_premium"],
        explanation: "Raggruppamento su più colonne.",
        replacements: {},
        brokenCode: "SELECT country, is_premium, COUNT(*) FROM Users GROUP BY country",
        debugHint: "Devi includere entrambe le colonne non aggregate nel GROUP BY."
      },
      {
        titleTemplate: "Min/Max Prezzo Categoria",
        descTemplate: "Per ogni categoria, mostra il prezzo minimo e massimo.",
        queryTemplate: "SELECT category, MIN(price), MAX(price) FROM Products GROUP BY category",
        hints: ["Puoi usare più funzioni di aggregazione."],
        explanation: "Statistiche multiple per gruppo.",
        replacements: {},
        brokenCode: "SELECT category, MIN(price), MAX(price) FROM Products",
        debugHint: "Manca GROUP BY category."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Filtro su Aggregazione (HAVING)",
        descTemplate: "Trova i paesi che hanno più di 5 utenti.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 5",
        hints: ["Usa HAVING per filtrare dopo l'aggregazione."],
        explanation: "WHERE filtra le righe prima del raggruppamento, HAVING filtra i gruppi.",
        replacements: {},
        brokenCode: "SELECT country, COUNT(*) FROM Users GROUP BY country WHERE COUNT(*) > 5",
        debugHint: "Non puoi usare WHERE su risultati aggregati, usa HAVING."
      },
      {
        titleTemplate: "Categorie Costose",
        descTemplate: "Trova le categorie dove il prezzo medio dei prodotti è superiore a 50.",
        queryTemplate: "SELECT category, AVG(price) FROM Products GROUP BY category HAVING AVG(price) > 50",
        hints: ["HAVING AVG(price) > 50"],
        explanation: "Filtrare gruppi basandosi su una media.",
        replacements: {},
        brokenCode: "SELECT category, AVG(price) FROM Products GROUP BY category HAVING price > 50",
        debugHint: "In HAVING devi ripetere la funzione di aggregazione: AVG(price)."
      },
      {
        titleTemplate: "Conta Distinti",
        descTemplate: "Conta quanti paesi diversi ci sono nella tabella Users.",
        queryTemplate: "SELECT COUNT(DISTINCT country) FROM Users",
        hints: ["COUNT(DISTINCT ...)"],
        explanation: "Conta i valori unici, ignorando i duplicati.",
        replacements: {},
        brokenCode: "SELECT DISTINCT COUNT(country) FROM Users",
        debugHint: "La sintassi è COUNT(DISTINCT colonna)."
      },
      {
        titleTemplate: "Having con Somma",
        descTemplate: "Trova gli status ordine che hanno generato un totale ordini superiore a 1000.",
        queryTemplate: "SELECT status, SUM(order_total) FROM Orders GROUP BY status HAVING SUM(order_total) > 1000",
        hints: ["HAVING SUM(...) > 1000"],
        explanation: "Analisi di fatturato per gruppo con soglia.",
        replacements: {},
        brokenCode: "SELECT status, SUM(order_total) FROM Orders WHERE SUM(order_total) > 1000 GROUP BY status",
        debugHint: "WHERE non vede la SUM. Usa HAVING dopo GROUP BY."
      },
      {
        titleTemplate: "Alias in Group By (Dialetto)",
        descTemplate: "Raggruppa per un calcolo. Estrai la lunghezza del nome e conta quanti prodotti hanno quella lunghezza.",
        queryTemplate: "SELECT LENGTH(name) as len, COUNT(*) FROM Products GROUP BY LENGTH(name)",
        hints: ["Raggruppa per l'espressione LENGTH(name)."],
        explanation: "Puoi raggruppare per il risultato di una funzione.",
        replacements: {},
        brokenCode: "SELECT LENGTH(name), COUNT(*) FROM Products GROUP BY name",
        debugHint: "Devi raggruppare per la lunghezza, non per il nome."
      },
      {
        titleTemplate: "Media Filtrata (CASE)",
        descTemplate: "Calcola il prezzo medio, ma considerando solo i prodotti con stock > 0.",
        queryTemplate: "SELECT AVG(CASE WHEN stock > 0 THEN price ELSE NULL END) FROM Products",
        hints: ["AVG ignora i NULL."],
        explanation: "Tecnica avanzata per fare aggregazioni condizionali.",
        replacements: {},
        brokenCode: "SELECT AVG(price) FROM Products WHERE stock > 0",
        debugHint: "Questa è corretta ma filtra le righe. L'esercizio chiedeva la tecnica con CASE? No, WHERE è meglio qui."
      }
    ]
  },
  [TopicId.Functions]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Nomi Maiuscoli",
        descTemplate: "Seleziona i nomi degli utenti convertiti in maiuscolo.",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Usa la funzione UPPER()."],
        explanation: "UPPER converte la stringa in maiuscolo.",
        replacements: {},
        brokenCode: "SELECT UP(name) FROM Users",
        debugHint: "La funzione standard è UPPER."
      },
      {
        titleTemplate: "Email Minuscole",
        descTemplate: "Seleziona le email degli utenti convertite in minuscolo.",
        queryTemplate: "SELECT LOWER(email) FROM Users",
        hints: ["Usa la funzione LOWER()."],
        explanation: "LOWER converte la stringa in minuscolo.",
        replacements: {},
        brokenCode: "SELECT LOW(email) FROM Users",
        debugHint: "La funzione standard è LOWER."
      },
      {
        titleTemplate: "Arrotonda Prezzo",
        descTemplate: "Seleziona i prezzi dei prodotti arrotondati all'intero più vicino.",
        queryTemplate: "SELECT ROUND(price) FROM Products",
        hints: ["Usa ROUND()."],
        explanation: "ROUND arrotonda i numeri decimali.",
        replacements: {},
        brokenCode: "SELECT AROUND(price) FROM Products",
        debugHint: "La funzione è ROUND."
      },
      {
        titleTemplate: "Lunghezza Nome",
        descTemplate: "Calcola la lunghezza (numero di caratteri) dei nomi dei prodotti.",
        queryTemplate: "SELECT LENGTH(name) FROM Products",
        hints: ["Usa LENGTH()."],
        explanation: "LENGTH restituisce la lunghezza della stringa.",
        replacements: {},
        brokenCode: "SELECT LEN(name) FROM Products",
        debugHint: "In SQL standard è spesso LENGTH, anche se LEN funziona in alcuni DB."
      },
      {
        titleTemplate: "Primi Caratteri",
        descTemplate: "Estrai i primi 3 caratteri del nome di ogni prodotto.",
        queryTemplate: "SELECT LEFT(name, 3) FROM Products",
        hints: ["Usa LEFT(colonna, 3)."],
        explanation: "LEFT estrae caratteri dall'inizio della stringa.",
        replacements: {},
        brokenCode: "SELECT START(name, 3) FROM Products",
        debugHint: "Usa LEFT."
      },
      {
        titleTemplate: "Concatenazione Base",
        descTemplate: "Unisci nome e dipartimento dei dipendenti.",
        queryTemplate: "SELECT CONCAT(name, department) FROM Employees",
        hints: ["Usa CONCAT()."],
        explanation: "CONCAT unisce due o più stringhe.",
        replacements: {},
        brokenCode: "SELECT name + department FROM Employees",
        debugHint: "In SQL standard si usa CONCAT o ||, non sempre +."
      },
      {
        titleTemplate: "Valore Assoluto",
        descTemplate: "Calcola il valore assoluto dello stock (anche se è sempre positivo, è un esercizio).",
        queryTemplate: "SELECT ABS(stock) FROM Products",
        hints: ["Usa ABS()."],
        explanation: "ABS restituisce il valore senza segno.",
        replacements: {},
        brokenCode: "SELECT ABSOLUTE(stock) FROM Products",
        debugHint: "La funzione è ABS."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Arrotonda Decimali",
        descTemplate: "Seleziona i prezzi arrotondati a 1 cifra decimale.",
        queryTemplate: "SELECT ROUND(price, 1) FROM Products",
        hints: ["Usa ROUND(colonna, decimali)."],
        explanation: "Il secondo argomento di ROUND specifica la precisione.",
        replacements: {},
        brokenCode: "SELECT ROUND(price, 0.1) FROM Products",
        debugHint: "Il secondo argomento deve essere un numero intero (es. 1)."
      },
      {
        titleTemplate: "Sottostringa Centrale",
        descTemplate: "Estrai 3 caratteri dal nome, partendo dal 2° carattere.",
        queryTemplate: "SELECT SUBSTR(name, 2, 3) FROM Users",
        hints: ["Usa SUBSTR(col, start, length)."],
        explanation: "SUBSTR (o SUBSTRING) taglia una parte interna della stringa.",
        replacements: {},
        brokenCode: "SELECT MID(name, 2, 3) FROM Users",
        debugHint: "Usa SUBSTR per compatibilità standard."
      },
      {
        titleTemplate: "Gestione Nulli (COALESCE)",
        descTemplate: "Seleziona manager_id dai dipendenti. Se è NULL, mostra 0.",
        queryTemplate: "SELECT COALESCE(manager_id, 0) FROM Employees",
        hints: ["Usa COALESCE(colonna, valore_default)."],
        explanation: "COALESCE restituisce il primo valore non nullo.",
        replacements: {},
        brokenCode: "SELECT IFNULL(manager_id, 0) FROM Employees",
        debugHint: "IFNULL è specifico (MySQL/SQLite), COALESCE è lo standard ANSI."
      },
      {
        titleTemplate: "Concatenazione Formattata",
        descTemplate: "Crea una stringa 'Nome (Paese)' per ogni utente.",
        queryTemplate: "SELECT CONCAT(name, ' (', country, ')') FROM Users",
        hints: ["CONCAT accetta più argomenti."],
        explanation: "Puoi unire colonne e testo fisso.",
        replacements: {},
        brokenCode: "SELECT name || ' (' || country || ')' FROM Users",
        debugHint: "Corretto in molti DB, ma qui esercitiamo la funzione CONCAT()."
      },
      {
        titleTemplate: "Trim Spazi",
        descTemplate: "Rimuovi eventuali spazi iniziali e finali dai nomi dei prodotti.",
        queryTemplate: "SELECT TRIM(name) FROM Products",
        hints: ["Usa TRIM()."],
        explanation: "TRIM pulisce le stringhe.",
        replacements: {},
        brokenCode: "SELECT CLEAN(name) FROM Products",
        debugHint: "La funzione è TRIM."
      },
      {
        titleTemplate: "Anno dell'Ordine",
        descTemplate: "Estrai solo l'anno dalla data dell'ordine.",
        queryTemplate: "SELECT YEAR(order_date) FROM Orders",
        hints: ["Usa YEAR() su una data."],
        explanation: "Funzioni di data per estrarre componenti.",
        replacements: {},
        brokenCode: "SELECT DATE_PART('year', order_date) FROM Orders",
        debugHint: "Usa la funzione semplificata YEAR()."
      },
      {
        titleTemplate: "Sostituzione Testo",
        descTemplate: "Nel nome dei prodotti, sostituisci 'Pro' con 'Professional'.",
        queryTemplate: "SELECT REPLACE(name, 'Pro', 'Professional') FROM Products",
        hints: ["Usa REPLACE(testo, cerca, sostituisci)."],
        explanation: "REPLACE modifica il contenuto delle stringhe al volo.",
        replacements: {},
        brokenCode: "SELECT SUBSTITUTE(name, 'Pro', 'Professional') FROM Products",
        debugHint: "La funzione è REPLACE."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Funzioni Annidate",
        descTemplate: "Mostra i primi 3 caratteri del nome utente, convertiti in maiuscolo.",
        queryTemplate: "SELECT UPPER(LEFT(name, 3)) FROM Users",
        hints: ["Applica UPPER al risultato di LEFT."],
        explanation: "Le funzioni possono essere annidate.",
        replacements: {},
        brokenCode: "SELECT LEFT(UPPER(name), 3 FROM Users",
        debugHint: "Attento alle parentesi di chiusura."
      },
      {
        titleTemplate: "Filtro su Anno",
        descTemplate: "Trova gli ordini effettuati nel 2023 usando la funzione YEAR.",
        queryTemplate: "SELECT * FROM Orders WHERE YEAR(order_date) = 2023",
        hints: ["WHERE YEAR(order_date) = 2023"],
        explanation: "Puoi usare funzioni nella clausola WHERE.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders HAVING YEAR(order_date) = 2023",
        debugHint: "Usa WHERE, non HAVING (che è per i gruppi)."
      },
      {
        titleTemplate: "Lunghezza Condizionale",
        descTemplate: "Trova i prodotti il cui nome è più lungo di 10 caratteri.",
        queryTemplate: "SELECT * FROM Products WHERE LENGTH(name) > 10",
        hints: ["WHERE LENGTH(...) > 10"],
        explanation: "Filtro basato su proprietà della stringa.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE LEN > 10",
        debugHint: "Devi applicare LENGTH alla colonna 'name'."
      },
      {
        titleTemplate: "Formattazione Prezzo",
        descTemplate: "Concatena il simbolo '$' davanti al prezzo.",
        queryTemplate: "SELECT CONCAT('$', price) FROM Products",
        hints: ["CONCAT('$', price)"],
        explanation: "Formattazione valuta base.",
        replacements: {},
        brokenCode: "SELECT '$' + price FROM Products",
        debugHint: "Usa CONCAT per sicurezza sui tipi."
      },
      {
        titleTemplate: "Coalesce Multiplo",
        descTemplate: "Se manager_id è NULL, prova a mostrare department_id (simulato come 999), altrimenti 0.",
        queryTemplate: "SELECT COALESCE(manager_id, 999) FROM Employees",
        hints: ["COALESCE accetta vari fallback."],
        explanation: "COALESCE scorre gli argomenti finché non trova un non-NULL.",
        replacements: {},
        brokenCode: "SELECT COALESCE(manager_id) FROM Employees",
        debugHint: "Servono almeno due argomenti per avere un fallback."
      },
      {
        titleTemplate: "Calcolo Giorni (Simulato)",
        descTemplate: "Calcola quanti giorni sono passati dall'ordine a oggi (usa NOW()).",
        queryTemplate: "SELECT DATEDIFF(order_date, NOW()) FROM Orders",
        hints: ["Usa DATEDIFF."],
        explanation: "Calcoli temporali.",
        replacements: {},
        brokenCode: "SELECT order_date - NOW() FROM Orders",
        debugHint: "Usa DATEDIFF(date1, date2)."
      }
    ]
  },
  [TopicId.Dates]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Filtra per Anno",
        descTemplate: "Seleziona tutti gli ordini effettuati nell'anno 2023.",
        queryTemplate: "SELECT * FROM Orders WHERE YEAR(order_date) = 2023",
        hints: ["Usa la funzione YEAR()."],
        explanation: "YEAR estrae l'anno da una data.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_date = 2023",
        debugHint: "order_date è una data completa, usa YEAR(order_date) per confrontare con l'anno."
      },
      {
        titleTemplate: "Ordini Futuri (Errore Dati)",
        descTemplate: "Trova eventuali ordini con data successiva a oggi (NOW).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date > NOW()",
        hints: ["Usa NOW() per la data corrente."],
        explanation: "Confrontare date è standard per validazioni temporali.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_date > TODAY()",
        debugHint: "La funzione standard è NOW() (o CURRENT_DATE in alcuni DB)."
      },
      {
        titleTemplate: "Mese dell'Ordine",
        descTemplate: "Estrai solo il mese dagli ordini.",
        queryTemplate: "SELECT MONTH(order_date) FROM Orders",
        hints: ["Usa MONTH()."],
        explanation: "Estrae il numero del mese (1-12).",
        replacements: {},
        brokenCode: "SELECT MON(order_date) FROM Orders",
        debugHint: "La funzione è MONTH."
      },
      {
        titleTemplate: "Giorno della Settimana",
        descTemplate: "Estrai il giorno della settimana (1-7) dalla data dell'ordine.",
        queryTemplate: "SELECT DAYOFWEEK(order_date) FROM Orders",
        hints: ["Usa DAYOFWEEK()."],
        explanation: "Utile per analisi settimanali.",
        replacements: {},
        brokenCode: "SELECT WEEKDAY(order_date) FROM Orders",
        debugHint: "WEEKDAY parte spesso da 0, DAYOFWEEK è più sicuro (1=Domenica)."
      },
      {
        titleTemplate: "Ordini Recenti (Filtro Data)",
        descTemplate: "Trova gli ordini dopo il '2024-01-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date >= '2024-01-01'",
        hints: ["Usa >= con la data tra apici."],
        explanation: "Le date letterali in SQL sono formato 'YYYY-MM-DD'.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_date >= 2024-01-01",
        debugHint: "Le date devono essere stringhe: '2024-01-01'."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Differenza Giorni (DATEDIFF)",
        descTemplate: "Calcola quanti giorni sono passati tra la data dell'ordine e oggi.",
        queryTemplate: "SELECT DATEDIFF(NOW(), order_date) FROM Orders",
        hints: ["Usa DATEDIFF(date1, date2)."],
        explanation: "DATEDIFF restituisce la differenza in giorni.",
        replacements: {},
        brokenCode: "SELECT NOW() - order_date FROM Orders",
        debugHint: "Usa la funzione DATEDIFF."
      },
      {
        titleTemplate: "Aggiungi Giorni (DATE_ADD)",
        descTemplate: "Calcola la data di scadenza (30 giorni dopo l'ordine).",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 30 DAY) FROM Orders",
        hints: ["DATE_ADD(date, INTERVAL 30 DAY)"],
        explanation: "Calcolo di scadenze.",
        replacements: {},
        brokenCode: "SELECT order_date + 30 FROM Orders",
        debugHint: "SQL richiede sintassi specifica per sommare giorni: DATE_ADD."
      },
      {
        titleTemplate: "Ordini nel Range (BETWEEN)",
        descTemplate: "Trova gli ordini del primo trimestre 2024 (Gen-Mar).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31'",
        hints: ["Usa BETWEEN date1 AND date2."],
        explanation: "Standard per intervalli temporali.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_date > '2024-01-01' AND < '2024-03-31'",
        debugHint: "Sintassi BETWEEN: col BETWEEN val1 AND val2."
      },
      {
        titleTemplate: "Ultimo Giorno Mese",
        descTemplate: "Trova l'ultimo giorno del mese per ogni ordine (LAST_DAY).",
        queryTemplate: "SELECT LAST_DAY(order_date) FROM Orders",
        hints: ["Usa LAST_DAY()."],
        explanation: "Utile per reportistica mensile.",
        replacements: {},
        brokenCode: "SELECT END_OF_MONTH(order_date) FROM Orders",
        debugHint: "La funzione è LAST_DAY."
      },
      {
        titleTemplate: "Formatta Data",
        descTemplate: "Mostra la data come 'Giorno-Mese-Anno' (es '01-12-2024').",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%d-%m-%Y') FROM Orders",
        hints: ["Usa DATE_FORMAT()."],
        explanation: "Formattazione custom per display.",
        replacements: {},
        brokenCode: "SELECT FORMAT(order_date, 'd-m-Y') FROM Orders",
        debugHint: "In MySQL/AlaSQL si usa DATE_FORMAT con %."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Ordini per Anno (Group By)",
        descTemplate: "Conta quanti ordini ci sono per ogni anno.",
        queryTemplate: "SELECT YEAR(order_date) as anno, COUNT(*) FROM Orders GROUP BY YEAR(order_date)",
        hints: ["Raggruppa per YEAR(order_date)."],
        explanation: "Aggregazione temporale.",
        replacements: {},
        brokenCode: "SELECT YEAR(order_date), COUNT(*) FROM Orders GROUP BY order_date",
        debugHint: "Se raggruppi per order_date (che include giorno), avrai troppi gruppi. Raggruppa per YEAR."
      },
      {
        titleTemplate: "Media Giorni Spedizione",
        descTemplate: "Calcola il tempo medio di spedizione (non abbiamo data spedizione in Orders, simula con NOW).",
        queryTemplate: "SELECT AVG(DATEDIFF(NOW(), order_date)) FROM Orders",
        hints: ["Media di una differenza date."],
        explanation: "KPI logistico.",
        replacements: {},
        brokenCode: "SELECT AVG(NOW() - order_date) FROM Orders",
        debugHint: "Usa DATEDIFF dentro AVG."
      },
      {
        titleTemplate: "Giorni Lavorativi (Simulazione)",
        descTemplate: "Trova ordini fatti di Domenica (DayOfWeek = 1).",
        queryTemplate: "SELECT * FROM Orders WHERE DAYOFWEEK(order_date) = 1",
        hints: ["DAYOFWEEK(date) = 1 è Domenica."],
        explanation: "Analisi per giorno della settimana.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE DAY(order_date) = 'Sunday'",
        debugHint: "DAYOFWEEK restituisce un numero (1-7), non il nome."
      },
      {
        titleTemplate: "Timestamp Diff (Ore)",
        descTemplate: "Quante ore sono passate dall'ordine? (Usa TIMESTAMPDIFF se supportato, o DATEDIFF * 24).",
        queryTemplate: "SELECT DATEDIFF(NOW(), order_date) * 24 FROM Orders",
        hints: ["Differenza in giorni per 24."],
        explanation: "Conversione unità temporale.",
        replacements: {},
        brokenCode: "SELECT HOURS_BETWEEN(NOW(), order_date) FROM Orders",
        debugHint: "Non esiste HOURS_BETWEEN standard."
      },
      {
        titleTemplate: "Età Account",
        descTemplate: "Calcola quanti anni sono passati dalla creazione dell'account utente (created_at).",
        queryTemplate: "SELECT FLOOR(DATEDIFF(NOW(), created_at) / 365) FROM Users",
        hints: ["Giorni diviso 365, arrotondato per difetto."],
        explanation: "Approssimazione dell'età in anni.",
        replacements: {},
        brokenCode: "SELECT YEAR(NOW()) - YEAR(created_at) FROM Users",
        debugHint: "La differenza di anni solari è imprecisa (es. Dicembre vs Gennaio). Meglio DATEDIFF/365."
      }
    ]
  },
  [TopicId.Case]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Stock Status",
        descTemplate: "Seleziona il nome del prodotto e una colonna 'status' che dice 'In Stock' se stock > 0, altrimenti 'Out of Stock'.",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'In Stock' ELSE 'Out of Stock' END AS status FROM Products",
        hints: ["Usa CASE WHEN stock > 0 THEN ... ELSE ... END"],
        explanation: "Logica condizionale semplice.",
        replacements: {},
        brokenCode: "SELECT name, IF(stock > 0, 'In Stock', 'Out of Stock') FROM Products",
        debugHint: "La funzione IF non è standard SQL, usa CASE WHEN."
      },
      {
        titleTemplate: "Fascia Prezzo",
        descTemplate: "Etichetta i prodotti: 'Basso' se price < 50, altrimenti 'Alto'.",
        queryTemplate: "SELECT name, price, CASE WHEN price < 50 THEN 'Basso' ELSE 'Alto' END AS fascia_prezzo FROM Products",
        hints: ["CASE WHEN price < 50 ..."],
        explanation: "Categorizzazione dinamica.",
        replacements: {},
        brokenCode: "SELECT name, CASE price < 50 'Basso' ELSE 'Alto' END FROM Products",
        debugHint: "Mancano le parole chiave WHEN e THEN."
      },
      {
        titleTemplate: "Premium Label",
        descTemplate: "Per gli utenti, mostra 'VIP' se is_premium è true, altrimenti 'Standard'.",
        queryTemplate: "SELECT name, CASE WHEN is_premium = true THEN 'VIP' ELSE 'Standard' END AS tipo_utente FROM Users",
        hints: ["Controlla il booleano is_premium."],
        explanation: "Traduzione di flag booleani in testo.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN is_premium THEN 'VIP' ELSE 'Standard' FROM Users",
        debugHint: "Manca END alla fine del CASE."
      },
      {
        titleTemplate: "Valutazione Ordine",
        descTemplate: "Se order_total > 500 scrivi 'Grande', altrimenti 'Piccolo'.",
        queryTemplate: "SELECT id, order_total, CASE WHEN order_total > 500 THEN 'Grande' ELSE 'Piccolo' END AS taglia FROM Orders",
        hints: ["CASE WHEN order_total > 500"],
        explanation: "Etichettatura basata su valori numerici.",
        replacements: {},
        brokenCode: "SELECT id, CASE order_total > 500 -> 'Grande' ELSE 'Piccolo' END FROM Orders",
        debugHint: "La sintassi è WHEN ... THEN, non ->."
      },
      {
        titleTemplate: "Controllo Nulli (CASE)",
        descTemplate: "Se manager_id è NULL mostra 'Capo', altrimenti 'Subordinato'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'Capo' ELSE 'Subordinato' END AS ruolo FROM Employees",
        hints: ["WHEN manager_id IS NULL"],
        explanation: "Gestione logica dei NULL.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN manager_id = NULL THEN 'Capo' ELSE 'Subordinato' END FROM Employees",
        debugHint: "Per i NULL usa IS NULL."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Aumento Prezzo Condizionale",
        descTemplate: "Simula un nuovo prezzo: se stock < 10 aumenta del 10% (price * 1.1), altrimenti lascia invariato.",
        queryTemplate: "SELECT name, price, CASE WHEN stock < 10 THEN price * 1.1 ELSE price END AS nuovo_prezzo FROM Products",
        hints: ["CASE può restituire risultati di calcoli."],
        explanation: "Logica di business applicata ai dati.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN stock < 10 THEN price * 1.1 END FROM Products",
        debugHint: "Manca ELSE price. Senza ELSE, i casi non soddisfatti diventano NULL."
      },
      {
        titleTemplate: "Multi-Condizione (Categorizzazione)",
        descTemplate: "Classifica prodotti: < 20 'Economico', 20-100 'Medio', > 100 'Costoso'.",
        queryTemplate: "SELECT name, price, CASE WHEN price < 20 THEN 'Economico' WHEN price <= 100 THEN 'Medio' ELSE 'Costoso' END AS categoria FROM Products",
        hints: ["Puoi usare più clausole WHEN."],
        explanation: "CASE valuta le condizioni in ordine sequenziale.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN price < 20 THEN 'Eco' AND WHEN price <= 100 THEN 'Med' END FROM Products",
        debugHint: "Non usare AND tra i WHEN. Basta 'WHEN ... THEN ... WHEN ... THEN ...'."
      },
      {
        titleTemplate: "Custom Sort (CASE in ORDER BY)",
        descTemplate: "Ordina i prodotti mettendo prima quelli 'In Stock' (>0) e poi gli altri.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END, stock ASC",
        hints: ["Usa CASE dentro ORDER BY."],
        explanation: "Ordinamento personalizzato non alfabetico/numerico.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ODER BY CASE stock > 0 THEN 0 ELSE 1 END",
        debugHint: "Manca WHEN."
      },
      {
        titleTemplate: "Pivot Count (SUM CASE)",
        descTemplate: "Conta quanti utenti sono Premium usando SUM e CASE (senza GROUP BY, un solo totale).",
        queryTemplate: "SELECT SUM(CASE WHEN is_premium = true THEN 1 ELSE 0 END) as total_premium FROM Users",
        hints: ["SUM(CASE WHEN ... THEN 1 ELSE 0 END)"],
        explanation: "Tecnica pivot per contare su condizioni specifiche.",
        replacements: {},
        brokenCode: "SELECT COUNT(CASE WHEN is_premium THEN 1 ELSE 0 END) FROM Users",
        debugHint: "COUNT conta le righe non-null. Se ELSE è 0, lo conta comunque! Usa SUM o ELSE NULL."
      },
      {
        titleTemplate: "Sconto Regionale",
        descTemplate: "Se l'utente è 'Italy', sconto 20% 'Discount', altrimenti 'Full Price'.",
        queryTemplate: "SELECT name, country, CASE WHEN country = 'Italy' THEN 'Discount' ELSE 'Full Price' END AS offer FROM Users",
        hints: ["Controlla country = 'Italy'."],
        explanation: "Logica legata a stringhe.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN country IS 'Italy' THEN 'Discount' END FROM Users",
        debugHint: "Usa = per le stringhe, non IS."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Pivot per Paese",
        descTemplate: "Calcola in una sola query: totale utenti Italy e totale utenti France.",
        queryTemplate: "SELECT SUM(CASE WHEN country = 'Italy' THEN 1 ELSE 0 END) as users_italy, SUM(CASE WHEN country = 'France' THEN 1 ELSE 0 END) as users_france FROM Users",
        hints: ["Due colonne con SUM(CASE...)."],
        explanation: "Cross-tabulation (Pivot) manuale.",
        replacements: {},
        brokenCode: "SELECT COUNT(region = 'Italy') FROM Users",
        debugHint: "SQL non supporta quella sintassi diretta."
      },
      {
        titleTemplate: "Logica Complessa (AND/OR)",
        descTemplate: "Etichetta 'Priority': Stock < 10 E Prezzo > 100 -> 'Urgent', Stock < 5 -> 'Warning', Altro 'OK'.",
        queryTemplate: "SELECT name, CASE WHEN stock < 10 AND price > 100 THEN 'Urgent' WHEN stock < 5 THEN 'Warning' ELSE 'OK' END AS priority FROM Products",
        hints: ["L'ordine dei WHEN è importante."],
        explanation: "La prima condizione soddisfatta vince.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN stock < 5 THEN 'Warning' WHEN stock < 10 AND price > 100 THEN 'Urgent' END FROM Products",
        debugHint: "Se metti stock < 5 prima, 'Urgent' (che implica stock < 10) potrebbe essere mascherato se stock è 4."
      },
      {
        titleTemplate: "Update Simulato",
        descTemplate: "Se dovessimo aggiornare i prezzi: +10% per Electronics, -5% per Clothing. Mostra il nuovo prezzo.",
        queryTemplate: "SELECT name, price, CASE WHEN category = 'Electronics' THEN price * 1.1 WHEN category = 'Clothing' THEN price * 0.95 ELSE price END as new_price FROM Products",
        hints: ["CASE ... WHEN ... WHEN ... ELSE ..."],
        explanation: "Simulazione di logiche di update.",
        replacements: {},
        brokenCode: "SELECT name, IF(category='Electronics', price*1.1, IF(category='Clothing', price*0.95, price))",
        debugHint: "Evita IF annidati, usa CASE multi-ramo."
      },
      {
        titleTemplate: "Validazione Dati",
        descTemplate: "Mostra 'Invalid' se email non contiene '@', altrimenti 'Valid'.",
        queryTemplate: "SELECT email, CASE WHEN email LIKE '%@%' THEN 'Valid' ELSE 'Invalid' END AS email_status FROM Users",
        hints: ["Usa LIKE '%@%'."],
        explanation: "Data quality check con SQL.",
        replacements: {},
        brokenCode: "SELECT email, CASE WHEN email CONTAINS '@' THEN 'Valid' END FROM Users",
        debugHint: "Usa LIKE."
      },
      {
        titleTemplate: "Etichetta Nulli Coalesce Logic",
        descTemplate: "Se manager_id è null scrivi 'No Manager', se è uguale all'id scrivi 'Self', altrimenti 'Managed'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'No Manager' WHEN manager_id = id THEN 'Self' ELSE 'Managed' END AS status FROM Employees",
        hints: ["Gestisci prima IS NULL."],
        explanation: "Logica gerarchica.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN manager_id = 0 THEN 'No Manager' ELSE 'Managed' END FROM Employees",
        debugHint: "I null non sono 0."
      }
    ]
  },
  [TopicId.Joins]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Report Ordini e Utenti",
        descTemplate: "Seleziona ID Ordine e Nome Utente per ogni ordine.",
        queryTemplate: "SELECT Orders.id, Users.name FROM Orders JOIN Users ON Orders.user_id = Users.id",
        hints: ["Orders JOIN Users ON Orders.user_id = Users.id"],
        explanation: "Inner Join base tra ordini e clienti.",
        replacements: {},
        brokenCode: "SELECT Orders.id, Users.name FROM Orders, Users",
        debugHint: "Usa la sintassi esplicita JOIN ... ON."
      },
      {
        titleTemplate: "Email Cliente per Ordine",
        descTemplate: "Mostra l'email del cliente per ogni ordine (Orders).",
        queryTemplate: "SELECT Orders.id, Users.email FROM Orders JOIN Users ON Orders.user_id = Users.id",
        hints: ["Collega Orders e Users."],
        explanation: "Recupero dati anagrafici.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders JOIN Users",
        debugHint: "Manca ON."
      },
      {
        titleTemplate: "Dettagli Ordine: Prodotto",
        descTemplate: "Per ogni riga di OrderItems, mostra il nome del prodotto.",
        queryTemplate: "SELECT OrderItems.id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["OrderItems JOIN Products"],
        explanation: "Lookup del nome prodotto.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems JOIN Products ON product_id=id",
        debugHint: "Ambiguo, usa Tabella.campo."
      },
      {
        titleTemplate: "Prezzo Prodotto Ordinato",
        descTemplate: "Mostra la quantità ordinata (OrderItems) e il prezzo di listino del prodotto (Products).",
        queryTemplate: "SELECT OrderItems.quantity, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Collega OrderItems a Products."],
        explanation: "Confronto dati.",
        replacements: {},
        brokenCode: "SELECT quantity, price FROM OrderItems",
        debugHint: "Price è in Products, serve JOIN."
      },
      {
        titleTemplate: "Data Ordine per Item",
        descTemplate: "Per ogni item venduto, mostra la data dell'ordine (Orders).",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["OrderItems -> Orders"],
        explanation: "Propagazione data dalla testata alle righe.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems JOIN Orders ON OrderItems.id = Orders.id",
        debugHint: "Devi collegare order_id con id."
      },
      {
        titleTemplate: "Status Ordine Cliente",
        descTemplate: "Mostra nome utente e status di ogni suo ordine.",
        queryTemplate: "SELECT Users.name, Orders.status FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Users JOIN Orders"],
        explanation: "Lista storico ordini.",
        replacements: {},
        brokenCode: "SELECT Users.name, status FROM Orders",
        debugHint: "Serve JOIN con Users."
      },
      {
        titleTemplate: "Dipendente e Manager",
        descTemplate: "Mostra 'nome dipendente' e 'nome manager' (Self Join).",
        queryTemplate: "SELECT E.name as Employees, M.name as Manager FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Employees E JOIN Employees M"],
        explanation: "Gerarchia interna.",
        replacements: {},
        brokenCode: "SELECT name, manager_id FROM Employees",
        debugHint: "Serve fare JOIN con la stessa tabella."
      },
      {
        titleTemplate: "Totale Ordine e Utente",
        descTemplate: "Mostra il totale dell'ordine (order_total) e il paese dell'utente.",
        queryTemplate: "SELECT Orders.order_total, Users.country FROM Orders JOIN Users ON Orders.user_id = Users.id",
        hints: ["Orders JOIN Users"],
        explanation: "Analisi geografica vendite.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders, Users",
        debugHint: "Evita prodotto cartesiano."
      },
      {
        titleTemplate: "Categoria Prodotto Venduto",
        descTemplate: "Per ogni item venduto, mostra la categoria del prodotto.",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["OrderItems -> Products"],
        explanation: "Analisi categorie vendute.",
        replacements: {},
        brokenCode: "SELECT category FROM OrderItems",
        debugHint: "Category è in Products."
      },
      {
        titleTemplate: "Utenti Premium Ordini",
        descTemplate: "Mostra gli ordini solo degli utenti Premium (is_premium=true).",
        queryTemplate: "SELECT Orders.id, Users.name FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.is_premium = true",
        hints: ["JOIN ... WHERE is_premium=true"],
        explanation: "Filtro su tabella relazionata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE is_premium=true",
        debugHint: "is_premium è in Users."
      },
      {
        titleTemplate: "Prodotti Low Stock Venduti",
        descTemplate: "Mostra ID ordine per prodotti venduti che hanno stock < 10.",
        queryTemplate: "SELECT OrderItems.order_id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE Products.stock < 10",
        hints: ["JOIN ... WHERE stock < 10"],
        explanation: "Allerta stock su venditem.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems WHERE stock < 10",
        debugHint: "Stock è in Products."
      },
      {
        titleTemplate: "Ordini Francia",
        descTemplate: "Mostra gli ordini di utenti francesi ('France').",
        queryTemplate: "SELECT Orders.id FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.country = 'France'",
        hints: ["Where country = 'France'"],
        explanation: "Geo-filtro.",
        replacements: {},
        brokenCode: "SELECT id FROM Orders WHERE country='France'",
        debugHint: "Country è in Users."
      },
      {
        titleTemplate: "Listino vs Reale",
        descTemplate: "Confronta unit_price (pagato) con Products.price (listino) per ogni item.",
        queryTemplate: "SELECT OrderItems.unit_price, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Select entrambe le colonne prezzo."],
        explanation: "Audit sconti.",
        replacements: {},
        brokenCode: "SELECT price FROM OrderItems",
        debugHint: "Serve JOIN."
      },
      {
        titleTemplate: "Hire Date Manager",
        descTemplate: "Mostra la data di assunzione del manager di ogni dipendente.",
        queryTemplate: "SELECT E.name, M.hire_date FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Self Join: M.hire_date"],
        explanation: "Confronto anzianità.",
        replacements: {},
        brokenCode: "SELECT hire_date FROM Employees WHERE manager_id IS NOT NULL",
        debugHint: "Vuoi la data del manager, non del dipendente."
      },
      {
        titleTemplate: "Utenti e ID Ordini",
        descTemplate: "Lista semplice: Nome Utente e ID dei loro ordini.",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Users JOIN Orders"],
        explanation: "Mapping base.",
        replacements: {},
        brokenCode: "SELECT name, id FROM Users JOIN Orders",
        debugHint: "Ambiguo id."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Utenti Senza Ordini (Left Join)",
        descTemplate: "Trova utenti che non hanno mai ordinato.",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["LEFT JOIN ... WHERE Orders.id IS NULL"],
        explanation: "Trovare elementi orfani.",
        replacements: {},
        brokenCode: "SELECT Users.name FROM Users JOIN Orders ...",
        debugHint: "INNER Join nasconde i null."
      },
      {
        titleTemplate: "Prodotti Invenduti",
        descTemplate: "Prodotti mai comparsi in OrderItems.",
        queryTemplate: "SELECT Products.name FROM Products LEFT JOIN OrderItems ON Products.id = OrderItems.product_id WHERE OrderItems.id IS NULL",
        hints: ["LEFT JOIN ... IS NULL"],
        explanation: "Dead stock analysis.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE id NOT IN OrderItems",
        debugHint: "Sintassi NOT IN richiede subquery o Left Join."
      },
      {
        titleTemplate: "Totale Speso per Utente",
        descTemplate: "Calcola la somma (order_total) per ogni utente.",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["GROUP BY Users.name"],
        explanation: "Aggregation dopo Join.",
        replacements: {},
        brokenCode: "SELECT Users.name, SUM(order_total) FROM Orders",
        debugHint: "Manca JOIN con Users."
      },
      {
        titleTemplate: "Media Ordine per Paese",
        descTemplate: "Calcola il valore medio degli ordini per paese.",
        queryTemplate: "SELECT Users.country, AVG(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.country",
        hints: ["GROUP BY Country"],
        explanation: "Report geografico.",
        replacements: {},
        brokenCode: "SELECT country, AVG(order_total) FROM Orders",
        debugHint: "Country è su Users."
      },
      {
        titleTemplate: "Vendite per Prodotto",
        descTemplate: "Calcola la quantità totale venduta per ogni prodotto.",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["JOIN -> SUM(quantity) -> GROUP BY Name"],
        explanation: "Volume vendite.",
        replacements: {},
        brokenCode: "SELECT name, SUM(quantity) FROM Products",
        debugHint: "Quantity è in OrderItems."
      },
      {
        titleTemplate: "Dipendenti senza Manager",
        descTemplate: "Trova i dipendenti che non hanno un manager (Top Level).",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["IS NULL"],
        explanation: "Filtro semplice (tecnicamente no join necessario, ma contesto gerarchia).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees JOIN Employees ON ...",
        debugHint: "Basta verificare IS NULL."
      },
      {
        titleTemplate: "Numero Ordini per Utente",
        descTemplate: "Conta quanti ordini ha fatto ogni utente (mostra anche chi ne ha fatti 0).",
        queryTemplate: "SELECT Users.name, COUNT(Orders.id) FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["LEFT JOIN per includere gli zeri."],
        explanation: "COUNT su colonna nullable conta solo i non-null.",
        replacements: {},
        brokenCode: "SELECT Users.name, COUNT(*) FROM Users JOIN Orders ...",
        debugHint: "JOIN esclude chi ha 0 ordini."
      },
      {
        titleTemplate: "Revenue per Categoria",
        descTemplate: "Calcola l'incasso totale (item qty * unit_price) per ogni categoria di prodotto.",
        queryTemplate: "SELECT Products.category, SUM(OrderItems.quantity * OrderItems.unit_price) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.category",
        hints: ["GROUP BY category"],
        explanation: "Financial report per categoria.",
        replacements: {},
        brokenCode: "SELECT category, SUM(total) FROM Products",
        debugHint: "Join con OrderItems e calcola qty*price."
      },
      {
        titleTemplate: "Manager e Sottoposti",
        descTemplate: "Mostra nome manager e nome dipendente. Escludi chi non è manager.",
        queryTemplate: "SELECT M.name as Manager, E.name as Dipendente FROM Employees M JOIN Employees E ON M.id = E.manager_id",
        hints: ["Inner Self Join"],
        explanation: "Lista inversa (Manager -> Dipendenti).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE manager_id IS NOT NULL",
        debugHint: "Serve Self Join per avere il nome del manager."
      },
      {
        titleTemplate: "Clienti e Prodotti Acquistati",
        descTemplate: "Lista unica di Clienti e Prodotti che hanno comprato (DISTINCT).",
        queryTemplate: "SELECT DISTINCT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Join a 4 tabelle + DISTINCT"],
        explanation: "Chi ha comprato cosa.",
        replacements: {},
        brokenCode: "SELECT Users.name, Products.name FROM Users, Products",
        debugHint: "Prodotto cartesiano è sbagliato."
      },
      {
        titleTemplate: "Ordini con Dettaglio Multiplo",
        descTemplate: "Trova gli ordini che hanno più di 1 item (righe in OrderItems).",
        queryTemplate: "SELECT order_id, COUNT(*) FROM OrderItems GROUP BY order_id HAVING COUNT(*) > 1",
        hints: ["HAVING COUNT > 1"],
        explanation: "Filtro su gruppi.",
        replacements: {},
        brokenCode: "SELECT order_id FROM OrderItems WHERE COUNT(*) > 1",
        debugHint: "Usa HAVING."
      },
      {
        titleTemplate: "Utenti > 1000 Spesa",
        descTemplate: "Trova utenti che hanno speso in totale più di 1000.",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name HAVING SUM(Orders.order_total) > 1000",
        hints: ["HAVING SUM(...) > 1000"],
        explanation: "High value customers.",
        replacements: {},
        brokenCode: "SELECT Users.name FROM Users WHERE sum(total) > 1000",
        debugHint: "WHERE non vede somme."
      },
      {
        titleTemplate: "Cross Join (Analisi)",
        descTemplate: "Mostra tutte le combinazioni possibili di Users e Products (Cross Join).",
        queryTemplate: "SELECT Users.name, Products.name FROM Users CROSS JOIN Products",
        hints: ["CROSS JOIN"],
        explanation: "Genera tutte le coppie.",
        replacements: {},
        brokenCode: "SELECT * FROM Users JOIN Products",
        debugHint: "Senza ON è cross join, ma usa sintassi esplicita."
      },
      {
        titleTemplate: "Dipendenti stesso Dipartimento",
        descTemplate: "Trova coppie di dipendenti che lavorano nello stesso dipartimento.",
        queryTemplate: "SELECT E1.name, E2.name, E1.department FROM Employees E1 JOIN Employees E2 ON E1.department = E2.department AND E1.id < E2.id",
        hints: ["Self Join su department. E1.id < E2.id per evitare duplicati speculari."],
        explanation: "Relazioni orizzontali.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees GROUP BY department",
        debugHint: "Group by raggruppa, Join accoppia."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Top 3 Prodotti",
        descTemplate: "I 3 prodotti più venduti (per quantità totale).",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) as tot FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name ORDER BY tot DESC LIMIT 3",
        hints: ["ORDER BY ... LIMIT 3"],
        explanation: "Ranking vendite.",
        replacements: {},
        brokenCode: "SELECT name, MAX(quantity) FROM Products",
        debugHint: "Serve SUM e Order By."
      },
      {
        titleTemplate: "Categorie Senza Vendite",
        descTemplate: "Quali categorie non hanno mai venduto un prodotto?",
        queryTemplate: "SELECT DISTINCT p1.category FROM Products p1 LEFT JOIN OrderItems oi ON p1.id = oi.product_id WHERE oi.id IS NULL",
        hints: ["Left Join -> IS NULL on category."],
        explanation: "Analisi categorie morte.",
        replacements: {},
        brokenCode: "SELECT category FROM Products WHERE id NOT IN Orders",
        debugHint: "Join complessa."
      },
      {
        titleTemplate: "Utenti Italia che hanno comprato Elettronica",
        descTemplate: "Trova utenti 'Italy' che hanno comprato prodotti category='Electronics'.",
        queryTemplate: "SELECT DISTINCT U.name FROM Users U JOIN Orders O ON U.id = O.user_id JOIN OrderItems OI ON O.id = OI.order_id JOIN Products P ON OI.product_id = P.id WHERE U.country = 'Italy' AND P.category = 'Electronics'",
        hints: ["4 Tabelle + 2 filtri."],
        explanation: "Segmentazione avanzata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country='Italy' AND bought='Electronics'",
        debugHint: "Non esiste 'bought'."
      },
      {
        titleTemplate: "Valore Magazzino Invenduto",
        descTemplate: "Calcola il valore (price * stock) dei prodotti che non sono mai stati venduti.",
        queryTemplate: "SELECT SUM(P.price * P.stock) FROM Products P LEFT JOIN OrderItems OI ON P.id = OI.product_id WHERE OI.id IS NULL",
        hints: ["LEFT JOIN ... WHERE OI.id IS NULL -> SUM"],
        explanation: "Financial KPI.",
        replacements: {},
        brokenCode: "SELECT SUM(price*stock) FROM Products",
        debugHint: "Così conti tutto, anche i venduti."
      },
      {
        titleTemplate: "Manager di Manager",
        descTemplate: "Trova i dipendenti che sono manager di qualcuno che è a sua volta manager (2 livelli gerarchia).",
        queryTemplate: "SELECT DISTINCT BigBoss.name FROM Employees BigBoss JOIN Employees MidBoss ON BigBoss.id = MidBoss.manager_id JOIN Employees Worker ON MidBoss.id = Worker.manager_id",
        hints: ["3 Self Joins."],
        explanation: "Gerarchie profonde.",
        replacements: {},
        brokenCode: "SELECT name FROM Employees WHERE manager_id IN (SELECT manager_id ...)",
        debugHint: "Usa join esplicite."
      },
      {
        titleTemplate: "Ordini sopra Media Utente",
        descTemplate: "Ordini il cui totale è superiore alla media degli ordini di quell'utente (Correlated).",
        queryTemplate: "SELECT O1.id, O1.order_total FROM Orders O1 WHERE O1.order_total > (SELECT AVG(O2.order_total) FROM Orders O2 WHERE O2.user_id = O1.user_id)",
        hints: ["Subquery correlata user_id = user_id."],
        explanation: "Confronto relativo.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE total > AVG(total)",
        debugHint: "AVG richiede aggregazione o subquery."
      },
      {
        titleTemplate: "Giorni tra Ordini",
        descTemplate: "Per ogni utente, trova la differenza massima di giorni tra due suoi ordini.",
        queryTemplate: "SELECT user_id, DATEDIFF(MAX(order_date), MIN(order_date)) FROM Orders GROUP BY user_id",
        hints: ["MAX(date) - MIN(date)"],
        explanation: "Frequency analysis.",
        replacements: {},
        brokenCode: "SELECT user_id, order_date - order_date FROM Orders",
        debugHint: "Devi aggregare date."
      },
      {
        titleTemplate: "Utenti Intersezioni",
        descTemplate: "Trova utenti che hanno comprato SIA 'Product A' (id=1) CHE 'Product B' (id=2). (Simulazione)",
        queryTemplate: "SELECT U.name FROM Users U JOIN Orders O1 ON U.id = O1.user_id JOIN OrderItems OI1 ON O1.id = OI1.order_id AND OI1.product_id = 1 JOIN Orders O2 ON U.id = O2.user_id JOIN OrderItems OI2 ON O2.id = OI2.order_id AND OI2.product_id = 2",
        hints: ["Due branch di join separati."],
        explanation: "Basket analysis (A and B).",
        replacements: {},
        brokenCode: "SELECT name FROM Users WHERE product_id = 1 AND product_id = 2",
        debugHint: "Impossibile sulla stessa riga."
      }
    ]
  },
  [TopicId.Advanced]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Prezzo Sopra la Media",
        descTemplate: "Seleziona i prodotti che hanno un prezzo superiore alla media di tutti i prodotti.",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Usa una subquery per calcolare la media."],
        explanation: "La subquery (tra parentesi) viene eseguita prima.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price > AVG(price)",
        debugHint: "Non puoi usare AVG direttamente nel WHERE, usa una subquery."
      },
      {
        titleTemplate: "Utenti con Ordini",
        descTemplate: "Seleziona gli utenti che hanno effettuato almeno un ordine (usando IN).",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["WHERE id IN (SELECT ...)"],
        explanation: "IN verifica se un valore esiste in una lista restituita dalla subquery.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE id = (SELECT user_id FROM Orders)",
        debugHint: "Se la subquery restituisce più righe, usa IN invece di =."
      },
      {
        titleTemplate: "Prodotti in Ordini Recenti",
        descTemplate: "Trova i prodotti (id) che sono stati ordinati nel 2024.",
        queryTemplate: "SELECT * FROM Products WHERE id IN (SELECT product_id FROM OrderItems WHERE order_id IN (SELECT id FROM Orders WHERE YEAR(order_date) = 2024))",
        hints: ["Subquery annidata o join."],
        explanation: "Navigazione tra tabelle tramite subquery.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE id IN (SELECT product_id FROM Orders WHERE date=2024)",
        debugHint: "OrderItems collega prodotti e ordini, non direttamente."
      },
      {
        titleTemplate: "Max di Categoria",
        descTemplate: "Trova il prodotto più costoso per ogni categoria (Correlated Subquery).",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Usa alias per distinguere query esterna e interna."],
        explanation: "Subquery correlata: dipende dalla riga esterna.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price = MAX(price)",
        debugHint: "MAX richiede GROUP BY o subquery."
      },
      {
        titleTemplate: "Dipendenti Manager",
        descTemplate: "Seleziona i dipendenti che sono anche manager (il loro ID appare nella colonna manager_id).",
        queryTemplate: "SELECT * FROM Employees WHERE id IN (SELECT manager_id FROM Employees)",
        hints: ["id IN (SELECT manager_id ...)"],
        explanation: "Trova chi ha subordinati.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE is_manager = true",
        debugHint: "Non abbiamo la colonna is_manager, devi dedurlo."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "CTE Base (WITH)",
        descTemplate: "Usa una CTE chiamata 'ExpensiveProducts' per selezionare i prodotti con prezzo > 100, poi seleziona tutto dalla CTE.",
        queryTemplate: "WITH ExpensiveProducts AS (SELECT * FROM Products WHERE price > 100) SELECT * FROM ExpensiveProducts",
        hints: ["WITH Alias AS (Query)..."],
        explanation: "CTE (Common Table Expression) rende il codice più leggibile.",
        replacements: {},
        brokenCode: "WITH ExpensiveProducts (SELECT * FROM Products) SELECT *",
        debugHint: "Sintassi: WITH nome AS (query)."
      },
      {
        titleTemplate: "Exists (Esistenza)",
        descTemplate: "Seleziona gli utenti che hanno effettuato almeno un ordine (usa EXISTS).",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["WHERE EXISTS (SELECT ...)"],
        explanation: "EXISTS è spesso più veloce di IN per grandi dataset.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE EXISTS (id)",
        debugHint: "EXISTS richiede una subquery completa."
      },
      {
        titleTemplate: "Subquery nel FROM",
        descTemplate: "Calcola il prezzo medio delle categorie, poi seleziona le categorie con media > 50 (usa subquery nel FROM).",
        queryTemplate: "SELECT * FROM (SELECT category, AVG(price) as avg_price FROM Products GROUP BY category) as sub WHERE avg_price > 50",
        hints: ["SELECT ... FROM (SELECT ...) as alias"],
        explanation: "La tabella derivata deve avere un alias.",
        replacements: {},
        brokenCode: "SELECT * FROM (SELECT AVG(price) FROM Products) WHERE avg_price > 50",
        debugHint: "Manca l'alias alla tabella derivata."
      },
      {
        titleTemplate: "Order Total > Average",
        descTemplate: "Trova gli ordini il cui totale è superiore alla media di tutti gli ordini.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > (SELECT AVG(order_total) FROM Orders)",
        hints: ["> (SELECT AVG...)"],
        explanation: "Confronto con aggregato globale.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_total > AVG(order_total)",
        debugHint: "Usa subquery per la media."
      },
      {
        titleTemplate: "Secondo Prezzo Più Alto",
        descTemplate: "Trova il secondo prezzo più alto nei prodotti (usando OFFSET o subquery).",
        queryTemplate: "SELECT DISTINCT price FROM Products ORDER BY price DESC LIMIT 1 OFFSET 1",
        hints: ["LIMIT 1 OFFSET 1"],
        explanation: "Tecnica classica per 'N-th highest'.",
        replacements: {},
        brokenCode: "SELECT MAX(price) FROM Products WHERE price < MAX(price)",
        debugHint: "Logica valida ma sintassi errata per MAX nel WHERE."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Window Function (RANK)",
        descTemplate: "Assegna una classifica (RANK) ai prodotti in base al prezzo decrescente.",
        queryTemplate: "SELECT name, price, RANK() OVER (ORDER BY price DESC) as rnk FROM Products",
        hints: ["RANK() OVER (ORDER BY ...)"],
        explanation: "Window function per ranking.",
        replacements: {},
        brokenCode: "SELECT name, RANK(price) FROM Products",
        debugHint: "RANK() richiede la clausola OVER."
      },
      {
        titleTemplate: "Running Total (Somma Cumulativa)",
        descTemplate: "Calcola il totale progressivo degli ordini ordinati per data.",
        queryTemplate: "SELECT id, order_date, order_total, SUM(order_total) OVER (ORDER BY order_date) as running_total FROM Orders",
        hints: ["SUM(...) OVER (ORDER BY ...)"],
        explanation: "Somma cumulativa riga per riga.",
        replacements: {},
        brokenCode: "SELECT SUM(order_total) GROUP BY order_date",
        debugHint: "GROUP BY aggrega, OVER mantiene le righe singole."
      },
      {
        titleTemplate: "Row Number per Categoria",
        descTemplate: "Assegna un numero sequenziale ai prodotti, ricominciando da 1 per ogni categoria (PARTITION BY).",
        queryTemplate: "SELECT name, category, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) as rn FROM Products",
        hints: ["PARTITION BY category"],
        explanation: "Numerazione isolata per gruppo.",
        replacements: {},
        brokenCode: "SELECT ROW_NUMBER(category) FROM Products",
        debugHint: "ROW_NUMBER() non accetta argomenti, usa OVER."
      },
      {
        titleTemplate: "Differenza dal Precedente (LAG)",
        descTemplate: "Per ogni ordine, mostra la differenza di importo rispetto all'ordine precedente (in ordine di tempo).",
        queryTemplate: "SELECT id, order_total - LAG(order_total) OVER (ORDER BY order_date) as diff FROM Orders",
        hints: ["LAG(colonna) accede alla riga precedente."],
        explanation: "Calcolo delta temporale.",
        replacements: {},
        brokenCode: "SELECT order_total - PREV(order_total) FROM Orders",
        debugHint: "La funzione standard è LAG."
      },
      {
        titleTemplate: "CTE Ricorsiva (Simulazione)",
        descTemplate: "Esercizio concettuale: Genera numeri da 1 a 5 (in molti DB richiede RECURSIVE).",
        queryTemplate: "WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<5) SELECT x FROM cnt",
        hints: ["WITH RECURSIVE"],
        explanation: "Generazione dati.",
        replacements: {},
        brokenCode: "WITH cnt AS (SELECT 1 UNION SELECT x+1)",
        debugHint: "Serve RECURSIVE e condizione di stop."
      }
    ]
  }
};

// --- GENERATOR FUNCTION ---
export const generateExercises = (
  topicId: TopicId,
  difficulty: Difficulty,
  count: number = 5
): Exercise[] => {
  const topicData = QUESTION_DATABASE[topicId];
  if (!topicData) return [];

  const blueprints = topicData[difficulty] || [];
  if (blueprints.length === 0) return [];

  // Shuffle and pick
  const selectedBlueprints = shuffleArray(blueprints).slice(0, count);

  return selectedBlueprints.map((bp, index) => {
    let title = bp.titleTemplate;
    let description = bp.descTemplate;
    let query = bp.queryTemplate;
    let brokenCode = bp.brokenCode;
    let explanation = bp.explanation;
    let debugHint = bp.debugHint;

    // Perform replacements if any
    if (bp.replacements) {
      Object.entries(bp.replacements).forEach(([key, values]) => {
        const replacement = getRandomItem(values);
        const regex = new RegExp(`{${key}}`, "g");
        const replacementStr = String(replacement);
        title = title.replace(regex, replacementStr);
        description = description.replace(regex, replacementStr);
        query = query.replace(regex, replacementStr);
        brokenCode = brokenCode.replace(regex, replacementStr);
      });
    }

    return {
      id: `${topicId}-${difficulty}-${index}-${Date.now()}`,
      topicId,
      difficulty,
      title,
      description,
      initialQuery: brokenCode,
      solutionQuery: query,
      hints: bp.hints,
      explanation,
      debugHint
    };
  });
};
