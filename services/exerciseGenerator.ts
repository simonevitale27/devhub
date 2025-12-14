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
  [TopicId.Case]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Simple Case",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti",
        brokenCode:
          "SELECT nome, CSE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave CASE.",
        hints: [
          "Usa CASE WHEN condizione THEN valore ELSE valore END.",
          "Sintassi: CASE WHEN stock > 0 ...",
        ],
        explanation:
          "CASE permette di creare logica condizionale direttamente nella query.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Disponibile",
        descTemplate:
          "Seleziona 'nome' e un CASE come 'stato' che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' AS stato FROM prodotti",
        debugHint: "Manca la parola chiave END alla fine del blocco CASE.",
        hints: [
          "Usa AS per dare un nome alla colonna calcolata.",
          "CASE ... END AS stato",
        ],
        explanation: "L'alias 'stato' rende il risultato più leggibile.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Alto",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Alto' se 'prezzo' > 100, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN prezzo > 100 THAN 'Alto' ELSE 'Basso' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave THEN.",
        hints: [
          "Confronta la colonna prezzo con 100.",
          "CASE WHEN prezzo > 100 ...",
        ],
        explanation: "Segmenta i prodotti in base a una soglia di prezzo.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Medio",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Medio' se 'prezzo' > 50, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 50 THEN 'Medio' ELSE 'Basso' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN prezzo > 50 THEN 'Medio' 'Basso' END FROM prodotti",
        debugHint: "Manca la parola chiave ELSE.",
        hints: ["Soglia di prezzo a 50.", "CASE WHEN prezzo > 50 ..."],
        explanation:
          "Utile per filtrare visivamente prodotti sopra una certa fascia.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Alto",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Alto' se 'voto' >= 4, altrimenti 'Basso' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto >= 4 THEN 'Alto' ELSE 'Basso' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WEN voto >= 4 THEN 'Alto' ELSE 'Basso' END FROM recensioni",
        debugHint: "Errore di battitura nella parola chiave WHEN.",
        hints: [
          "Usa l'operatore >= (maggiore o uguale).",
          "CASE WHEN voto >= 4 ...",
        ],
        explanation: "Identifica le recensioni positive.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Basso",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Basso' se 'voto' < 3, altrimenti 'Alto' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto < 3 THEN 'Basso' ELSE 'Alto' END FROM recensioni",
        brokenCode:
          "SELECT voto, WHEN voto < 3 THEN 'Basso' ELSE 'Alto' END FROM recensioni",
        debugHint: "Manca la parola chiave CASE all'inizio dell'espressione.",
        hints: ["Usa l'operatore < (minore).", "CASE WHEN voto < 3 ..."],
        explanation: "Identifica le recensioni negative o critiche.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Grande' se 'quantita' > 5, altrimenti 'Piccola' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita > 5 THEN 'Grande' ELSE 'Piccola' END FROM ordini",
        brokenCode:
          "SELECT quantita, CASE WHEN quantita > 5 THEN Grande ELSE Piccola END FROM ordini",
        debugHint: "Le stringhe devono essere racchiuse tra apici singoli.",
        hints: [
          "Confronta la quantità ordinata.",
          "CASE WHEN quantita > 5 ...",
        ],
        explanation: "Distingue tra ordini voluminosi e ordini standard.",
        replacements: {},
      },
      {
        titleTemplate: "Case Premium",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Premium' se 'premium' è TRUE, altrimenti 'Standard' dalla tabella 'utenti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN premium = TRUE THEN 'Premium' ELSE 'Standard' END FROM utenti",
        brokenCode:
          "SELECT nome, CASE WHEN premium = TREU THEN 'Premium' ELSE 'Standard' END FROM utenti",
        debugHint: "Errore di battitura nel valore booleano TRUE.",
        hints: [
          "La colonna premium è booleana.",
          "CASE WHEN premium = TRUE ...",
        ],
        explanation: "Traduce un valore booleano in un testo leggibile.",
        replacements: {},
      },
      {
        titleTemplate: "Case NULL Tracking",
        descTemplate:
          "Seleziona un CASE che mostra 'In Attesa' se 'codice_tracking' è NULL, altrimenti 'Tracciata' dalla tabella 'spedizioni'.",
        queryTemplate:
          "SELECT CASE WHEN codice_tracking IS NULL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni",
        brokenCode:
          "SELECT CASE WHEN codice_tracking IS NUL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni",
        debugHint: "Errore di battitura nella parola chiave NULL.",
        hints: [
          "Usa IS NULL per verificare i valori mancanti.",
          "CASE WHEN codice_tracking IS NULL ...",
        ],
        explanation: "Gestisce i valori NULL per fornire un output più chiaro.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Zero",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Esaurito' se 'stock' = 0, altrimenti 'Disponibile' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' ELSE 'Disponibile' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN stock = 0 'Esaurito' ELSE 'Disponibile' END FROM prodotti",
        debugHint: "Manca la parola chiave THEN.",
        hints: ["Controlla l'uguaglianza con 0.", "CASE WHEN stock = 0 ..."],
        explanation: "Identifica immediatamente i prodotti non disponibili.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Zero",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Gratis' se 'prezzo' = 0, altrimenti 'A Pagamento' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo = 0 THEN 'Gratis' ELSE 'A Pagamento' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN prezzo = 0 THEN 'Gratis' ELS 'A Pagamento' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave ELSE.",
        hints: ["CASE WHEN prezzo = 0 ..."],
        explanation: "Evidenzia i prodotti gratuiti.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Cinque",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Perfetto' se 'voto' = 5, altrimenti 'Normale' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto = 5 THEN 'Perfetto' ELSE 'Normale' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WHEN voto = 5 THEN 'Perfetto' ELSE 'Normale' FROM recensioni",
        debugHint: "Manca la parola chiave END alla fine del blocco CASE.",
        hints: ["CASE WHEN voto = 5 ..."],
        explanation: "Mette in risalto il punteggio massimo.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità Uno",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Singolo' se 'quantita' = 1, altrimenti 'Multiplo' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' ELSE 'Multiplo' END FROM ordini",
        brokenCode:
          "SELECT quantita, CSE WHEN quantita = 1 THEN 'Singolo' ELSE 'Multiplo' END FROM ordini",
        debugHint: "Errore di battitura nella parola chiave CASE.",
        hints: ["CASE WHEN quantita = 1 ..."],
        explanation: "Distingue acquisti singoli da acquisti multipli.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Maggiore",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Abbondante' se 'stock' > 20, altrimenti 'Limitato' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 20 THEN 'Abbondante' ELSE 'Limitato' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE stock > 20 THEN 'Abbondante' ELSE 'Limitato' END FROM prodotti",
        debugHint: "Manca la parola chiave WHEN dopo CASE.",
        hints: ["CASE WHEN stock > 20 ..."],
        explanation: "Indica prodotti con ampia disponibilità.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Minore",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' < 30, altrimenti 'Normale' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo < 30 THEN 'Economico' ELSE 'Normale' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN prezzo < 30 'Economico' ELSE 'Normale' END FROM prodotti",
        debugHint: "Manca la parola chiave THEN.",
        hints: ["CASE WHEN prezzo < 30 ..."],
        explanation: "Identifica prodotti di fascia bassa.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Maggiore",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Positivo' se 'voto' > 3, altrimenti 'Negativo' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto > 3 THEN 'Positivo' ELSE 'Negativo' END FROM recensioni",
        brokenCode:
          "SELETC voto, CASE WHEN voto > 3 THEN 'Positivo' ELSE 'Negativo' END FROM recensioni",
        debugHint: "Errore di battitura nella parola chiave SELECT.",
        hints: ["CASE WHEN voto > 3 ..."],
        explanation: "Separa le recensioni positive da quelle negative/neutre.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità Maggiore",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Grande Ordine' se 'quantita' > 10, altrimenti 'Piccolo Ordine' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita > 10 THEN 'Grande Ordine' ELSE 'Piccolo Ordine' END FROM ordini",
        brokenCode:
          "SELECT quantita, CASE WHEN quantita > 10 THEN 'Grande Ordine' ELSE 'Piccolo Ordine' FROM ordini",
        debugHint: "Manca la parola chiave END alla fine del blocco CASE.",
        hints: ["CASE WHEN quantita > 10 ..."],
        explanation: "Evidenzia ordini particolarmente grandi.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Minore",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Basso' se 'stock' < 10, altrimenti 'Sufficiente' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock < 10 THEN 'Basso' ELSE 'Sufficiente' END FROM prodotti",
        brokenCode:
          "SELECT nome, CAES WHEN stock < 10 THEN 'Basso' ELSE 'Sufficiente' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave CASE.",
        hints: ["CASE WHEN stock < 10 ..."],
        explanation: "Allerta per riordino merce.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Maggiore Uguale",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Costoso' se 'prezzo' >= 100, altrimenti 'Accessibile' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo >= 100 THEN 'Costoso' ELSE 'Accessibile' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN prezzo >= 100 'Costoso' ELSE 'Accessibile' END FROM prodotti",
        debugHint: "Manca la parola chiave THEN.",
        hints: ["CASE WHEN prezzo >= 100 ..."],
        explanation: "Segmentazione di prezzo inclusiva.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Minore Uguale",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Basso' se 'voto' <= 2, altrimenti 'Alto' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' ELSE 'Alto' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' ELSI 'Alto' END FROM recensioni",
        debugHint: "Errore di battitura nella parola chiave ELSE.",
        hints: ["CASE WHEN voto <= 2 ..."],
        explanation: "Identifica recensioni gravemente insufficienti.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità Minore Uguale",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Piccolo' se 'quantita' <= 3, altrimenti 'Grande' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' ELSE 'Grande' END FROM ordini",
        brokenCode:
          "SELECT quantita, WHEN quantita <= 3 THEN 'Piccolo' ELSE 'Grande' END FROM ordini",
        debugHint: "Manca la parola chiave CASE.",
        hints: ["CASE WHEN quantita <= 3 ..."],
        explanation: "Identifica ordini di piccola entità.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Maggiore Uguale",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Alto' se 'stock' >= 50, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock >= 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHE stock >= 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave WHEN.",
        hints: ["CASE WHEN stock >= 50 ..."],
        explanation: "Conferma livelli di stock ottimali.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Minore Uguale",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' <= 50, altrimenti 'Costoso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo <= 50 THEN 'Economico' ELSE 'Costoso' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN prezzo <= 50 THEN 'Economico' ELSE 'Costoso' FROM prodotti",
        debugHint: "Manca la parola chiave END.",
        hints: ["CASE WHEN prezzo <= 50 ..."],
        explanation: "Identifica prodotti accessibili.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Maggiore Uguale",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Eccellente' se 'voto' >= 4, altrimenti 'Normale' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto >= 4 THEN 'Eccellente' ELSE 'Normale' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WHEN voto >= 4 THE 'Eccellente' ELSE 'Normale' END FROM recensioni",
        debugHint: "Errore di battitura nella parola chiave THEN.",
        hints: ["CASE WHEN voto >= 4 ..."],
        explanation: "Evidenzia feedback molto positivi.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità Maggiore Uguale",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Media' se 'quantita' >= 5, altrimenti 'Piccola' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita >= 5 THEN 'Media' ELSE 'Piccola' END FROM ordini",
        brokenCode:
          "SELECT quantita, CASE WHEN quantita >= 5 THEN 'Media' 'Piccola' END FROM ordini",
        debugHint: "Manca la parola chiave ELSE.",
        hints: ["CASE WHEN quantita >= 5 ..."],
        explanation: "Soglia per ordini di media grandezza.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Minore Uguale",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Critico' se 'stock' <= 5, altrimenti 'Normale' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock <= 5 THEN 'Critico' ELSE 'Normale' END FROM prodotti",
        brokenCode:
          "SELECT nome, CSE WHEN stock <= 5 THEN 'Critico' ELSE 'Normale' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave CASE.",
        hints: ["CASE WHEN stock <= 5 ..."],
        explanation: "Segnala prodotti quasi esauriti.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Non Zero",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'A Pagamento' se 'prezzo' <> 0, altrimenti 'Gratis' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo <> 0 THEN 'A Pagamento' ELSE 'Gratis' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE prezzo <> 0 THEN 'A Pagamento' ELSE 'Gratis' END FROM prodotti",
        debugHint: "Manca la parola chiave WHEN.",
        hints: ["Usa l'operatore <> (diverso).", "CASE WHEN prezzo <> 0 ..."],
        explanation: "Verifica che il prezzo non sia nullo o zero.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Non Cinque",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Migliorabile' se 'voto' <> 5, altrimenti 'Perfetto' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto <> 5 THEN 'Migliorabile' ELSE 'Perfetto' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WHEN voto <> 5 THEN 'Migliorabile' ELSE 'Perfetto' EN FROM recensioni",
        debugHint: "Errore di battitura nella parola chiave END.",
        hints: ["CASE WHEN voto <> 5 ..."],
        explanation: "Identifica tutto ciò che non è perfetto.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità Non Uno",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Multiplo' se 'quantita' <> 1, altrimenti 'Singolo' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita <> 1 THEN 'Multiplo' ELSE 'Singolo' END FROM ordini",
        brokenCode:
          "SELECT quantita, CASE WHEN quantita <> 1 THEN Multiplo ELSE Singolo END FROM ordini",
        debugHint: "Le stringhe devono essere racchiuse tra apici singoli.",
        hints: ["CASE WHEN quantita <> 1 ..."],
        explanation: "Filtra ordini con più di un pezzo.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Non Zero",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Disponibile' se 'stock' <> 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock <> 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti",
        brokenCode:
          "SELEC nome, CASE WHEN stock <> 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave SELECT.",
        hints: ["CASE WHEN stock <> 0 ..."],
        explanation: "Conferma la presenza di merce a magazzino.",
        replacements: {},
      },
      // NEW EXERCISES FOR CASE EASY
      {
        titleTemplate: "Case Categoria Elettronica",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Elettronica' se 'categoria_id' = 1, altrimenti 'Altro' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN categoria_id = 1 THEN 'Elettronica' ELSE 'Altro' END FROM prodotti",
        brokenCode:
          "SELECT nome, CSE WHEN categoria_id = 1 THEN 'Elettronica' ELSE 'Altro' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave CASE.",
        hints: ["CASE WHEN categoria_id = 1 ..."],
        explanation: "Etichetta specifica per una categoria.",
        replacements: {},
      },
      {
        titleTemplate: "Case Fornitore Principale",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Principale' se 'fornitore_id' = 1, altrimenti 'Secondario' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN fornitore_id = 1 THEN 'Principale' ELSE 'Secondario' END FROM prodotti",
        brokenCode:
          "SELECT nome, CASE WHEN fornitore_id = 1 THEN 'Principale' ELSE 'Secondario' FROM prodotti",
        debugHint: "Manca la parola chiave END alla fine del blocco CASE.",
        hints: ["CASE WHEN fornitore_id = 1 ..."],
        explanation: "Distingue il fornitore primario dagli altri.",
        replacements: {},
      },
      {
        titleTemplate: "Case Data Futura",
        descTemplate:
          "Seleziona 'id' e un CASE che mostra 'Futuro' se 'data_ordine' > '2024-01-01', altrimenti 'Passato' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT id, CASE WHEN data_ordine > '2024-01-01' THEN 'Futuro' ELSE 'Passato' END FROM ordini",
        brokenCode:
          "SELECT id, CASE WHEN data_ordine > '2024-01-01' THAN 'Futuro' ELSE 'Passato' END FROM ordini",
        debugHint: "Errore di battitura nella parola chiave THEN.",
        hints: [
          "Confronta con una stringa data.",
          "CASE WHEN data_ordine > '2024-01-01' ...",
        ],
        explanation: "Classificazione temporale basata su una data fissa.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Sufficienza",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Sufficiente' se 'voto' >= 3, altrimenti 'Insufficiente' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto >= 3 THEN 'Sufficiente' ELSE 'Insufficiente' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WHEN voto >= 3 THEN 'Sufficiente' 'Insufficiente' END FROM recensioni",
        debugHint: "Manca la parola chiave ELSE.",
        hints: ["CASE WHEN voto >= 3 ..."],
        explanation: "Soglia di accettabilità.",
        replacements: {},
      },
      {
        titleTemplate: "Case Quantità Minima",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Minimo' se 'quantita' < 2, altrimenti 'Standard' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita < 2 THEN 'Minimo' ELSE 'Standard' END FROM ordini",
        brokenCode:
          "SELECT quantita, CASE WEN quantita < 2 THEN 'Minimo' ELSE 'Standard' END FROM ordini",
        debugHint: "Errore di battitura nella parola chiave WHEN.",
        hints: ["CASE WHEN quantita < 2 ..."],
        explanation: "Identifica ordini sotto la soglia standard.",
        replacements: {},
      },
      {
        titleTemplate: "Case Nome Inizia con A",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Gruppo A' se 'nome' inizia con 'A' (LIKE 'A%'), altrimenti 'Altri' dalla tabella 'utenti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN nome LIKE 'A%' THEN 'Gruppo A' ELSE 'Altri' END FROM utenti",
        brokenCode:
          "SELECT nome, WHEN nome LIKE 'A%' THEN 'Gruppo A' ELSE 'Altri' END FROM utenti",
        debugHint: "Manca la parola chiave CASE all'inizio dell'espressione.",
        hints: ["Usa LIKE 'A%'.", "CASE WHEN nome LIKE 'A%' ..."],
        explanation: "Raggruppamento basato sull'iniziale.",
        replacements: {},
      },
      {
        titleTemplate: "Case Email Gmail",
        descTemplate:
          "Seleziona 'email' e un CASE che mostra 'Google' se 'email' contiene 'gmail' (LIKE '%gmail%'), altrimenti 'Altro' dalla tabella 'utenti'.",
        queryTemplate:
          "SELECT email, CASE WHEN email LIKE '%gmail%' THEN 'Google' ELSE 'Altro' END FROM utenti",
        brokenCode:
          "SELECT email, CASE WHEN email LIKE '%gmail%' THEN Google ELSE Altro END FROM utenti",
        debugHint: "Le stringhe devono essere racchiuse tra apici singoli.",
        hints: ["Usa LIKE '%gmail%'.", "CASE WHEN email LIKE '%gmail%' ..."],
        explanation: "Identifica il provider di posta elettronica.",
        replacements: {},
      },
      {
        titleTemplate: "Case Prezzo Pari",
        descTemplate:
          "Seleziona 'prezzo' e un CASE che mostra 'Pari' se 'prezzo' è pari (prezzo % 2 = 0), altrimenti 'Dispari' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT prezzo, CASE WHEN prezzo % 2 = 0 THEN 'Pari' ELSE 'Dispari' END FROM prodotti",
        brokenCode:
          "SELECT prezzo, CASE WHEN prezzo % 2 = 0 THEN 'Pari' ELSI 'Dispari' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave ELSE.",
        hints: ["Usa l'operatore modulo (%).", "CASE WHEN prezzo % 2 = 0 ..."],
        explanation: "Verifica la parità di un numero.",
        replacements: {},
      },
      {
        titleTemplate: "Case Stock Multiplo 10",
        descTemplate:
          "Seleziona 'stock' e un CASE che mostra 'Multiplo 10' se 'stock' è multiplo di 10 (stock % 10 = 0), altrimenti 'No' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT stock, CASE WHEN stock % 10 = 0 THEN 'Multiplo 10' ELSE 'No' END FROM prodotti",
        brokenCode:
          "SELECT stock, CASE WHEN stock % 10 = 0 THEN 'Multiplo 10' ELSE 'No' EN FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave END.",
        hints: ["Usa stock % 10 = 0.", "CASE WHEN stock % 10 = 0 ..."],
        explanation: "Verifica divisibilità per 10.",
        replacements: {},
      },
      {
        titleTemplate: "Case Lunghezza Nome",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Lungo' se la lunghezza di 'nome' > 5 (LENGTH(nome) > 5), altrimenti 'Corto' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN LENGTH(nome) > 5 THEN 'Lungo' ELSE 'Corto' END FROM prodotti",
        brokenCode:
          "SELEC nome, CASE WHEN LENGTH(nome) > 5 THEN 'Lungo' ELSE 'Corto' END FROM prodotti",
        debugHint: "Errore di battitura nella parola chiave SELECT.",
        hints: ["Usa la funzione LENGTH().", "CASE WHEN LENGTH(nome) > 5 ..."],
        explanation: "Logica basata sulla lunghezza del testo.",
        replacements: {},
      },
      {
        titleTemplate: "Case Mese Estivo",
        descTemplate:
          "Seleziona 'data_ordine' e un CASE che mostra 'Estate' se il mese di 'data_ordine' è 6, 7 o 8 (MONTH(data_ordine) IN (6,7,8)), altrimenti 'Altro' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (6,7,8) THEN 'Estate' ELSE 'Altro' END FROM ordini",
        brokenCode:
          "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (6,7,8) 'Estate' ELSE 'Altro' END FROM ordini",
        debugHint: "Manca la parola chiave THEN.",
        hints: [
          "Usa MONTH() e IN.",
          "CASE WHEN MONTH(data_ordine) IN (6,7,8) ...",
        ],
        explanation: "Raggruppa mesi specifici in una stagione.",
        replacements: {},
      },
      {
        titleTemplate: "Case Anno Corrente",
        descTemplate:
          "Seleziona la colonna 'data_ordine' e un CASE che mostra '2023' se l'anno di 'data_ordine' è 2023, altrimenti 'Altro' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro' END FROM ordini",
        brokenCode:
          "SELECT data_ordine, CAES WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro' END FROM ordini",
        debugHint: "Errore di battitura nella parola chiave CASE.",
        hints: ["Confronta YEAR(data_ordine) con 2023."],
        explanation: "Confronto con un anno specifico.",
        replacements: {},
      },
      {
        titleTemplate: "Case Paese Italia",
        descTemplate:
          "Seleziona la colonna 'paese' e un CASE che mostra 'Nazionale' se 'paese' è 'Italia', altrimenti 'Estero' dalla tabella 'utenti'.",
        queryTemplate:
          "SELECT paese, CASE WHEN paese = 'Italia' THEN 'Nazionale' ELSE 'Estero' END FROM utenti",
        brokenCode:
          "SELECT paese, CASE paese = 'Italia' THEN 'Nazionale' ELSE 'Estero' END FROM utenti",
        debugHint: "Manca la parola chiave WHEN.",
        hints: ["CASE WHEN paese = 'Italia' ..."],
        explanation: "Distingue il mercato domestico da quello estero.",
        replacements: {},
      },
      {
        titleTemplate: "Case Corriere DHL",
        descTemplate:
          "Seleziona la colonna 'corriere' e un CASE che mostra 'Express' se 'corriere' è 'DHL', altrimenti 'Standard' dalla tabella 'spedizioni'.",
        queryTemplate:
          "SELECT corriere, CASE WHEN corriere = 'DHL' THEN 'Express' ELSE 'Standard' END FROM spedizioni",
        brokenCode:
          "SELECT corriere, CASE WHEN corriere = 'DHL' THE 'Express' ELSE 'Standard' END FROM spedizioni",
        debugHint: "Errore di battitura nella parola chiave THEN.",
        hints: ["CASE WHEN corriere = 'DHL' ..."],
        explanation: "Etichetta il servizio in base al corriere.",
        replacements: {},
      },
      {
        titleTemplate: "Case Voto Massimo",
        descTemplate:
          "Seleziona la colonna 'voto' e un CASE che mostra 'Top' se 'voto' è 5, altrimenti 'Non Top' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto = 5 THEN 'Top' ELSE 'Non Top' END FROM recensioni",
        brokenCode:
          "SELECT voto, CASE WHEN voto = 5 THEN 'Top' ELSE 'Non Top' FROM recensioni",
        debugHint: "Manca la parola chiave END alla fine del blocco CASE.",
        hints: ["CASE WHEN voto = 5 ..."],
        explanation: "Identifica il massimo punteggio possibile.",
        replacements: {},
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Fasce di Prezzo",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' < 50, 'Medio' se 'prezzo' <= 150, altrimenti 'Lusso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END FROM prodotti",
        hints: [
          "Usa più clausole WHEN in sequenza.",
          "CASE WHEN ... WHEN ... ELSE ... END",
        ],
        explanation: "Gestisce scenari con più di due possibili esiti.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' FROM prodotti",
        debugHint: "Manca la parola chiave END.",
      },
      {
        titleTemplate: "Fasce di Stock",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Esaurito' se 'stock' = 0, 'Basso' se 'stock' <= 10, 'Medio' se 'stock' <= 30, altrimenti 'Alto' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 10 THEN 'Basso' WHEN stock <= 30 THEN 'Medio' ELSE 'Alto' END FROM prodotti",
        hints: [
          "Definisci le fasce in ordine crescente.",
          "CASE WHEN stock = 0 ... WHEN ...",
        ],
        explanation:
          "Permette una classificazione granulare dello stato del magazzino.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WEN stock <= 10 THEN 'Basso' WHEN stock <= 30 THEN 'Medio' ELSE 'Alto' END FROM prodotti",
        debugHint: "Errore di battitura in WHEN.",
      },
      {
        titleTemplate: "Fasce di Voto",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Basso' se 'voto' <= 2, 'Medio' se 'voto' = 3, altrimenti 'Alto' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni",
        hints: [
          "Raggruppa i punteggi in categorie.",
          "CASE WHEN voto <= 2 ...",
        ],
        explanation: "Semplifica l'analisi dei feedback raggruppandoli.",
        replacements: {},
        brokenCode:
          "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 'Medio' ELSE 'Alto' END FROM recensioni",
        debugHint: "Manca la parola chiave THEN.",
      },
      {
        titleTemplate: "Fasce di Quantità",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Piccolo' se 'quantita' <= 3, 'Medio' se 'quantita' <= 7, altrimenti 'Grande' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END FROM ordini",
        hints: ["CASE WHEN quantita <= 3 ..."],
        explanation: "Segmenta gli ordini per dimensione.",
        replacements: {},
        brokenCode:
          "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' 'Grande' END FROM ordini",
        debugHint: "Manca la parola chiave ELSE.",
      },
      {
        titleTemplate: "Fasce Prezzo Quattro",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' < 30, 'Medio' se 'prezzo' <= 80, 'Costoso' se 'prezzo' <= 150, altrimenti 'Lusso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo < 30 THEN 'Economico' WHEN prezzo <= 80 THEN 'Medio' WHEN prezzo <= 150 THEN 'Costoso' ELSE 'Lusso' END FROM prodotti",
        hints: [
          "Aggiungi un quarto livello di classificazione.",
          "CASE WHEN ... WHEN ... WHEN ... ELSE ...",
        ],
        explanation:
          "Gestisce una logica di classificazione complessa a più livelli.",
        replacements: {},
        brokenCode:
          "SELECT nome, CSE WHEN prezzo < 30 THEN 'Economico' WHEN prezzo <= 80 THEN 'Medio' WHEN prezzo <= 150 THEN 'Costoso' ELSE 'Lusso' END FROM prodotti",
        debugHint: "Errore di battitura in CASE.",
      },
      {
        titleTemplate: "Fasce Stock Quattro",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Esaurito' se 'stock' = 0, 'Basso' se 'stock' <= 5, 'Medio' se 'stock' <= 20, altrimenti 'Alto' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 5 THEN 'Basso' WHEN stock <= 20 THEN 'Medio' ELSE 'Alto' END FROM prodotti",
        hints: ["CASE WHEN stock = 0 ..."],
        explanation: "Fornisce una visione dettagliata della disponibilità.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 5 THEN 'Basso' WHEN stock <= 20 THEN 'Medio' ELSE 'Alto' FROM prodotti",
        debugHint: "Manca la parola chiave END.",
      },
      {
        titleTemplate: "Fasce Voto Quattro",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Molto Basso' se 'voto' = 1, 'Basso' se 'voto' = 2, 'Medio' se 'voto' = 3, altrimenti 'Alto' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto = 1 THEN 'Molto Basso' WHEN voto = 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni",
        hints: [
          "Gestisci ogni voto basso singolarmente.",
          "CASE WHEN voto = 1 ...",
        ],
        explanation: "Analisi fine della soddisfazione cliente.",
        replacements: {},
        brokenCode:
          "SELECT voto, CASE WHEN voto = 1 THEN 'Molto Basso' WHEN voto = 2 THE 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni",
        debugHint: "Errore di battitura in THEN.",
      },
      {
        titleTemplate: "Fasce Quantità Quattro",
        descTemplate:
          "Seleziona 'quantita' e un CASE che mostra 'Singolo' se 'quantita' = 1, 'Piccolo' se 'quantita' <= 4, 'Medio' se 'quantita' <= 9, altrimenti 'Grande' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' WHEN quantita <= 4 THEN 'Piccolo' WHEN quantita <= 9 THEN 'Medio' ELSE 'Grande' END FROM ordini",
        hints: ["CASE WHEN quantita = 1 ..."],
        explanation: "Segmentazione dettagliata del volume ordini.",
        replacements: {},
        brokenCode:
          "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' quantita <= 4 THEN 'Piccolo' WHEN quantita <= 9 THEN 'Medio' ELSE 'Grande' END FROM ordini",
        debugHint: "Manca la parola chiave WHEN.",
      },
      {
        titleTemplate: "Case con AND",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Premium' se 'prezzo' > 100 AND 'stock' > 10, altrimenti 'Standard' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 AND stock > 10 THEN 'Premium' ELSE 'Standard' END FROM prodotti",
        hints: [
          "Usa AND per combinare due condizioni.",
          "CASE WHEN prezzo > 100 AND stock > 10 ...",
        ],
        explanation: "CASE supporta operatori logici complessi.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo > 100 stock > 10 THEN 'Premium' ELSE 'Standard' END FROM prodotti",
        debugHint: "Manca l'operatore AND.",
      },
      {
        titleTemplate: "Case con OR",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Sconto' se 'prezzo' < 30 OR 'stock' = 0, altrimenti 'Normale' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo < 30 OR stock = 0 THEN 'Sconto' ELSE 'Normale' END FROM prodotti",
        hints: [
          "Usa OR per condizioni alternative.",
          "CASE WHEN prezzo < 30 OR stock = 0 ...",
        ],
        explanation: "Basta che una condizione sia vera per attivare il caso.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo < 30 stock = 0 THEN 'Sconto' ELSE 'Normale' END FROM prodotti",
        debugHint: "Manca l'operatore OR.",
      },
      {
        titleTemplate: "Case con AND e OR",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Speciale' se ('prezzo' > 100 AND 'stock' > 20) OR 'prezzo' < 20, altrimenti 'Normale' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN (prezzo > 100 AND stock > 20) OR prezzo < 20 THEN 'Speciale' ELSE 'Normale' END FROM prodotti",
        hints: [
          "Usa le parentesi per raggruppare le condizioni.",
          "CASE WHEN (...) OR ...",
        ],
        explanation: "Gestisce logiche di business articolate.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN (prezzo > 100 AND stock > 20 OR prezzo < 20 THEN 'Speciale' ELSE 'Normale' END FROM prodotti",
        debugHint: "Manca una parentesi chiusa.",
      },
      {
        titleTemplate: "Case con BETWEEN",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Medio' se 'prezzo' BETWEEN 50 AND 100, altrimenti 'Altro' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo BETWEEN 50 AND 100 THEN 'Medio' ELSE 'Altro' END FROM prodotti",
        hints: [
          "Usa BETWEEN per intervalli inclusivi.",
          "CASE WHEN prezzo BETWEEN 50 AND 100 ...",
        ],
        explanation:
          "Semplifica la scrittura di condizioni su intervalli numerici.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo BETWEEN 50 100 THEN 'Medio' ELSE 'Altro' END FROM prodotti",
        debugHint: "Manca la parola chiave AND.",
      },
      {
        titleTemplate: "Case con IN",
        descTemplate:
          "Seleziona 'voto' e un CASE che mostra 'Alto' se 'voto' IN (4, 5), altrimenti 'Basso' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto IN (4, 5) THEN 'Alto' ELSE 'Basso' END FROM recensioni",
        hints: [
          "Usa IN per verificare l'appartenenza a una lista.",
          "CASE WHEN voto IN (4, 5) ...",
        ],
        explanation: "Utile per confrontare con un insieme discreto di valori.",
        replacements: {},
        brokenCode:
          "SELECT voto, CASE WHEN voto IN (4, 5 THEN 'Alto' ELSE 'Basso' END FROM recensioni",
        debugHint: "Manca la parentesi chiusa.",
      },
      {
        titleTemplate: "Case con LIKE",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Standard' se 'nome' LIKE 'Prod%', altrimenti 'Altro' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN nome LIKE 'Prod%' THEN 'Standard' ELSE 'Altro' END FROM prodotti",
        hints: [
          "Usa LIKE per il confronto di stringhe.",
          "CASE WHEN nome LIKE 'Prod%' ...",
        ],
        explanation:
          "Permette logiche condizionali basate su pattern di testo.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN nome LIKE 'Prod% THEN 'Standard' ELSE 'Altro' END FROM prodotti",
        debugHint: "Manca l'apice di chiusura.",
      },
      {
        titleTemplate: "Case con IS NULL",
        descTemplate:
          "Seleziona un CASE che mostra 'In Attesa' se 'codice_tracking' IS NULL, altrimenti 'Tracciata' dalla tabella 'spedizioni'.",
        queryTemplate:
          "SELECT CASE WHEN codice_tracking IS NULL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni",
        hints: [
          "Verifica se il campo è vuoto.",
          "CASE WHEN codice_tracking IS NULL ...",
        ],
        explanation: "Gestisce esplicitamente i dati mancanti.",
        replacements: {},
        brokenCode:
          "SELECT CASE WHEN codice_tracking IS NUL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni",
        debugHint: "Errore di battitura in NULL.",
      },
      {
        titleTemplate: "Case con IS NOT NULL",
        descTemplate:
          "Seleziona un CASE che mostra 'Tracciata' se 'codice_tracking' IS NOT NULL, altrimenti 'In Attesa' dalla tabella 'spedizioni'.",
        queryTemplate:
          "SELECT CASE WHEN codice_tracking IS NOT NULL THEN 'Tracciata' ELSE 'In Attesa' END FROM spedizioni",
        hints: [
          "Usa IS NOT NULL.",
          "CASE WHEN codice_tracking IS NOT NULL ...",
        ],
        explanation: "Logica inversa rispetto a IS NULL.",
        replacements: {},
        brokenCode:
          "SELECT CASE WHEN codice_tracking NOT NULL THEN 'Tracciata' ELSE 'In Attesa' END FROM spedizioni",
        debugHint: "Manca la parola chiave IS.",
      },
      {
        titleTemplate: "Case con Alias",
        descTemplate:
          "Seleziona 'nome' e un CASE come 'Stato' che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS Stato FROM prodotti",
        hints: ["Usa AS alla fine del blocco END.", "END AS Stato"],
        explanation: "Assegna un nome chiaro alla colonna calcolata.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END Stato FROM prodotti",
        debugHint: "Manca la parola chiave AS.",
      },
      {
        titleTemplate: "Case con Alias Prezzo",
        descTemplate:
          "Seleziona 'nome' e un CASE come 'Fascia' che mostra 'Economico' se 'prezzo' < 50, 'Medio' se 'prezzo' <= 150, altrimenti 'Lusso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END AS Fascia FROM prodotti",
        hints: ["END AS Fascia"],
        explanation: "Rende il report finale professionale e leggibile.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END Fascia FROM prodotti",
        debugHint: "Manca la parola chiave AS.",
      },
      {
        titleTemplate: "Case con Alias Voto",
        descTemplate:
          "Seleziona 'voto' e un CASE come 'Valutazione' che mostra 'Basso' se 'voto' <= 2, 'Medio' se 'voto' = 3, altrimenti 'Alto' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END AS Valutazione FROM recensioni",
        hints: ["END AS Valutazione"],
        explanation: "Chiarezza nell'output della query.",
        replacements: {},
        brokenCode:
          "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END Valutazione FROM recensioni",
        debugHint: "Manca la parola chiave AS.",
      },
      {
        titleTemplate: "Case con Alias Quantità",
        descTemplate:
          "Seleziona 'quantita' e un CASE come 'Dimensione' che mostra 'Piccolo' se 'quantita' <= 3, 'Medio' se 'quantita' <= 7, altrimenti 'Grande' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END AS Dimensione FROM ordini",
        hints: ["END AS Dimensione"],
        explanation: "Migliora la presentazione dei dati.",
        replacements: {},
        brokenCode:
          "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END Dimensione FROM ordini",
        debugHint: "Manca la parola chiave AS.",
      },
      {
        titleTemplate: "Case con Calcolo",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Alto' se (prezzo * stock) > 1000, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        hints: [
          "Puoi fare calcoli dentro la condizione WHEN.",
          "CASE WHEN (prezzo * stock) > 1000 ...",
        ],
        explanation: "Valuta espressioni matematiche dinamicamente.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN (prezzo stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        debugHint: "Manca l'operatore di moltiplicazione.",
      },
      {
        titleTemplate: "Case con Calcolo Complesso",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Molto Alto' se (prezzo * stock) > 2000, 'Alto' se (prezzo * stock) > 1000, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN (prezzo * stock) > 2000 THEN 'Molto Alto' WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        hints: [
          "Ripeti il calcolo nelle varie clausole WHEN.",
          "CASE WHEN (prezzo * stock) > 2000 ...",
        ],
        explanation: "Segmentazione basata su valore calcolato.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN (prezzo * stock > 2000 THEN 'Molto Alto' WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        debugHint: "Manca la parentesi chiusa.",
      },
      {
        titleTemplate: "Case con Funzione",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Nome Lungo' se LENGTH(nome) > 10, altrimenti 'Nome Corto' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN LENGTH(nome) > 10 THEN 'Nome Lungo' ELSE 'Nome Corto' END FROM prodotti",
        hints: ["Usa LENGTH(nome).", "CASE WHEN LENGTH(nome) > 10 ..."],
        explanation: "Combina funzioni SQL con logica condizionale.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN LENGHT(nome) > 10 THEN 'Nome Lungo' ELSE 'Nome Corto' END FROM prodotti",
        debugHint: "Errore di battitura in LENGTH.",
      },
      {
        titleTemplate: "Case con Funzione Data",
        descTemplate:
          "Seleziona 'data_ordine' e un CASE che mostra '2023' se YEAR(data_ordine) = 2023, altrimenti 'Altro Anno' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini",
        hints: [
          "Usa YEAR(data_ordine).",
          "CASE WHEN YEAR(data_ordine) = 2023 ...",
        ],
        explanation: "Logica condizionale applicata alle date.",
        replacements: {},
        brokenCode:
          "SELECT data_ordine, CASE WHEN YEAR(data_ordine = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini",
        debugHint: "Manca la parentesi chiusa di YEAR.",
      },
      {
        titleTemplate: "Case con JOIN",
        descTemplate:
          "Seleziona 'prodotti.nome' e un CASE che mostra 'Elettronica' se 'categorie.nome' = 'Elettronica', altrimenti 'Altro' dalla tabella 'prodotti' in JOIN con 'categorie'.",
        queryTemplate:
          "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Elettronica' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id",
        hints: [
          "Fai una JOIN con la tabella categorie.",
          "CASE WHEN categorie.nome = ...",
        ],
        explanation:
          "Applica condizioni su dati provenienti da tabelle collegate.",
        replacements: {},
        brokenCode:
          "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Elettronica' ELSE 'Altro' END FROM prodotti JOIN categorie prodotti.categoria_id = categorie.id",
        debugHint: "Manca la parola chiave ON.",
      },
      {
        titleTemplate: "Case con WHERE",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Disponibile' se 'stock' > 10, altrimenti 'Limitato' dalla tabella 'prodotti', filtrando per 'prezzo' > 50.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 10 THEN 'Disponibile' ELSE 'Limitato' END FROM prodotti WHERE prezzo > 50",
        hints: [
          "Usa WHERE per filtrare le righe prima del CASE.",
          "WHERE prezzo > 50",
        ],
        explanation: "Combina filtro righe (WHERE) con logica colonne (CASE).",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock > 10 THEN 'Disponibile' ELSE 'Limitato' END FROM prodotti WHERE prezzo 50",
        debugHint: "Manca l'operatore >.",
      },
      {
        titleTemplate: "Case con ORDER BY",
        descTemplate:
          "Seleziona 'nome' e un CASE come 'stato' che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti', ordinando per il CASE (Disponibile prima).",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END",
        hints: [
          "Usa un CASE dentro ORDER BY per definire l'ordine.",
          "ORDER BY CASE ... END",
        ],
        explanation:
          "Permette ordinamenti non alfabetici basati su logica custom.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1",
        debugHint: "Manca la parola chiave END nel secondo CASE.",
      },
      {
        titleTemplate: "Case Complesso Finale",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Premium Disponibile' se 'prezzo' > 100 AND 'stock' > 20, 'Premium Limitato' se 'prezzo' > 100, 'Economico Disponibile' se 'stock' > 20, altrimenti 'Standard' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END FROM prodotti",
        hints: [
          "L'ordine delle condizioni WHEN è importante: la prima vera vince.",
          "CASE WHEN prezzo > 100 AND stock > 20 ...",
        ],
        explanation: "Esempio di logica decisionale complessa con priorità.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END AS tipo FROM prodotti ORDER BY CASE WHEN prezzo > 100 AND stock > 20 THEN 0 WHEN prezzo > 100 THEN 1 WHEN stock > 20 THEN 2 ELSE 3 END prezzo DESC",
        debugHint: "Manca la virgola prima di prezzo DESC.",
      },
      {
        titleTemplate: "Case con Alias Stock",
        descTemplate:
          "Seleziona 'nome' e un CASE come 'Livello' che mostra 'Alto' se 'stock' > 20, 'Medio' se 'stock' > 10, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 20 THEN 'Alto' WHEN stock > 10 THEN 'Medio' ELSE 'Basso' END AS Livello FROM prodotti",
        hints: ["Usa AS Livello alla fine.", "CASE ... END AS Livello"],
        explanation: "Crea una colonna calcolata con un nome specifico.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock > 20 THEN 'Alto' WHEN stock > 10 THEN 'Medio' ELSE 'Basso' END Livello FROM prodotti",
        debugHint: "Manca la parola chiave AS.",
      },
      {
        titleTemplate: "Case con Alias Quantità",
        descTemplate:
          "Seleziona 'quantita' e un CASE come 'Taglia' che mostra 'Grande' se 'quantita' > 7, 'Media' se 'quantita' > 3, altrimenti 'Piccola' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita > 7 THEN 'Grande' WHEN quantita > 3 THEN 'Media' ELSE 'Piccola' END AS Taglia FROM ordini",
        hints: ["Usa AS Taglia.", "CASE ... END AS Taglia"],
        explanation: "Rende il risultato immediatamente comprensibile.",
        replacements: {},
        brokenCode:
          "SELECT quantita, CASE WHEN quantita > 7 THEN 'Grande' WHEN quantita > 3 THEN 'Media' ELSE 'Piccola' END Taglia FROM ordini",
        debugHint: "Manca la parola chiave AS.",
      },
      // NEW EXERCISES FOR CASE MEDIUM
      {
        titleTemplate: "Case Stagioni",
        descTemplate:
          "Seleziona la colonna 'data_ordine' e un CASE che mostra 'Inverno' per mesi 12,1,2, 'Primavera' per 3-5, 'Estate' per 6-8, altrimenti 'Autunno' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (12,1,2) THEN 'Inverno' WHEN MONTH(data_ordine) BETWEEN 3 AND 5 THEN 'Primavera' WHEN MONTH(data_ordine) BETWEEN 6 AND 8 THEN 'Estate' ELSE 'Autunno' END FROM ordini",
        hints: ["CASE con range mesi"],
        explanation: "Logica stagionale complessa.",
        replacements: {},
        brokenCode:
          "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (12,1,2) THEN 'Inverno' WHEN MONTH(data_ordine) BETWEEN 3 AND 5 'Primavera' WHEN MONTH(data_ordine) BETWEEN 6 AND 8 THEN 'Estate' ELSE 'Autunno' END FROM ordini",
        debugHint: "Manca la parola chiave THEN.",
      },
      {
        titleTemplate: "Case Fasce Spesa",
        descTemplate:
          "Seleziona la colonna 'quantita' e un CASE che mostra 'Pochi' se 'quantita' <= 2, 'Medi' se 'quantita' <= 5, altrimenti 'Tanti' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, CASE WHEN quantita <= 2 THEN 'Pochi' WHEN quantita <= 5 THEN 'Medi' ELSE 'Tanti' END FROM ordini",
        hints: ["CASE multiplo su quantità"],
        explanation: "Segmentazione ordini.",
        replacements: {},
        brokenCode:
          "SELECT quantita, CASE WHEN quantita <= 2 THEN 'Pochi' WHEN quantita <= 5 THEN 'Medi' 'Tanti' END FROM ordini",
        debugHint: "Manca la parola chiave ELSE.",
      },
      {
        titleTemplate: "Case Qualità Prodotto",
        descTemplate:
          "Seleziona la colonna 'nome' e un CASE che mostra 'Top Seller' se 'prezzo' > 100 AND 'stock' > 50, 'Economico' se 'prezzo' < 20, altrimenti 'Standard' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 AND stock > 50 THEN 'Top Seller' WHEN prezzo < 20 THEN 'Economico' ELSE 'Standard' END FROM prodotti",
        hints: ["CASE con AND e condizioni miste"],
        explanation: "Logica business complessa.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN prezzo > 100 stock > 50 THEN 'Top Seller' WHEN prezzo < 20 THEN 'Economico' ELSE 'Standard' END FROM prodotti",
        debugHint: "Manca l'operatore AND.",
      },
      {
        titleTemplate: "Case Urgenza Spedizione",
        descTemplate:
          "Seleziona la colonna 'corriere' e un CASE che mostra 'Urgente' se 'corriere' è 'DHL' o 'FedEx' (IN ('DHL', 'FedEx')), altrimenti 'Normale' dalla tabella 'spedizioni'.",
        queryTemplate:
          "SELECT corriere, CASE WHEN corriere IN ('DHL', 'FedEx') THEN 'Urgente' ELSE 'Normale' END FROM spedizioni",
        hints: ["CASE con IN"],
        explanation: "Raggruppamento valori.",
        replacements: {},
        brokenCode:
          "SELECT corriere, CASE WHEN corriere IN ('DHL', 'FedEx') THEN 'Urgente' ELSE 'Normale' END FROM spedizioni",
        debugHint: "",
      },
      {
        titleTemplate: "Case Tipo Utente",
        descTemplate:
          "Seleziona la colonna 'nome' e un CASE che mostra 'VIP' se 'premium' è TRUE, altrimenti 'Standard' dalla tabella 'utenti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN premium = TRUE THEN 'VIP' ELSE 'Standard' END FROM utenti",
        hints: ["Semplificazione logica utente"],
        explanation: "Segmentazione clientela.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN premium = TREU THEN 'VIP' ELSE 'Standard' END FROM utenti",
        debugHint: "Errore di battitura in TRUE.",
      },
      {
        titleTemplate: "Case Lunghezza Recensione",
        descTemplate:
          "Seleziona la colonna 'commento' e un CASE che mostra 'Dettagliata' se la lunghezza di 'commento' > 50 (LENGTH(commento) > 50), altrimenti 'Breve' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT commento, CASE WHEN LENGTH(commento) > 50 THEN 'Dettagliata' ELSE 'Breve' END FROM recensioni",
        hints: ["LENGTH > 50"],
        explanation: "Analisi testo.",
        replacements: {},
        brokenCode:
          "SELECT commento, CASE WHEN LENGHT(commento) > 50 THEN 'Dettagliata' ELSE 'Breve' END FROM recensioni",
        debugHint: "Errore di battitura in LENGTH.",
      },
      {
        titleTemplate: "Case Sconto Applicabile",
        descTemplate:
          "Seleziona la colonna 'prezzo' e un CASE come 'Sconto' che mostra '20%' se 'prezzo' > 100, '10%' se 'prezzo' > 50, altrimenti '0%' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT prezzo, CASE WHEN prezzo > 100 THEN '20%' WHEN prezzo > 50 THEN '10%' ELSE '0%' END as Sconto FROM prodotti",
        hints: ["CASE per calcolo logico"],
        explanation: "Logica commerciale.",
        replacements: {},
        brokenCode:
          "SELECT prezzo, CASE WHEN prezzo > 100 THEN '20%' WHEN prezzo > 50 THEN '10%' ELSE '0%' END Sconto FROM prodotti",
        debugHint: "Manca la parola chiave AS.",
      },
      {
        titleTemplate: "Case Tempo Spedizione",
        descTemplate:
          "Seleziona la colonna 'id' e un CASE che mostra 'Lento' se la differenza in giorni tra 'data_spedizione' e 'data_ordine' (DATEDIFF) > 5, 'Veloce' se < 2, altrimenti 'Normale' unendo 'ordini' e 'spedizioni'.",
        queryTemplate:
          "SELECT ordini.id, CASE WHEN DATEDIFF(day, data_ordine, data_spedizione) > 5 THEN 'Lento' WHEN DATEDIFF(day, data_ordine, data_spedizione) < 2 THEN 'Veloce' ELSE 'Normale' END FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id",
        hints: ["CASE su DATEDIFF"],
        explanation: "KPI logistico.",
        replacements: {},
        brokenCode:
          "SELECT ordini.id, CASE WHEN DATEDIFF(day data_ordine, data_spedizione) > 5 THEN 'Lento' WHEN DATEDIFF(day, data_ordine, data_spedizione) < 2 THEN 'Veloce' ELSE 'Normale' END FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id",
        debugHint: "Manca la virgola tra gli argomenti di DATEDIFF.",
      },
      {
        titleTemplate: "Case Priorità Ordine",
        descTemplate:
          "Seleziona 'ordini.id' e un CASE che mostra 'Alta' se 'ordini.quantita' > 10 OR 'utenti.premium' è TRUE, altrimenti 'Bassa' dalla tabella 'ordini' JOIN 'utenti'.",
        queryTemplate:
          "SELECT ordini.id, CASE WHEN ordini.quantita > 10 OR utenti.premium = TRUE THEN 'Alta' ELSE 'Bassa' END FROM ordini JOIN utenti ON ordini.utente_id = utenti.id",
        hints: ["CASE con OR e JOIN"],
        explanation: "Prioritizzazione.",
        replacements: {},
        brokenCode:
          "SELECT ordini.id, CASE WHEN ordini.quantita > 10 utenti.premium = TRUE THEN 'Alta' ELSE 'Bassa' END FROM ordini JOIN utenti ON ordini.utente_id = utenti.id",
        debugHint: "Manca l'operatore OR.",
      },
      {
        titleTemplate: "Case Stato Magazzino",
        descTemplate:
          "Seleziona la colonna 'nome' e una colonna calcolata 'StatoMagazzino' che mostra 'Critico' se 'stock' = 0, 'Riordinare' se 'stock' < 10, 'Eccesso' se 'stock' > 100, altrimenti 'Ok' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Critico' WHEN stock < 10 THEN 'Riordinare' WHEN stock > 100 THEN 'Eccesso' ELSE 'Ok' END FROM prodotti",
        hints: ["CASE multiplo stock"],
        explanation: "Gestione inventario.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN stock = 0 THEN 'Critico' stock < 10 THEN 'Riordinare' WHEN stock > 100 THEN 'Eccesso' ELSE 'Ok' END FROM prodotti",
        debugHint: "Manca la parola chiave WHEN.",
      },
      {
        titleTemplate: "Case Valutazione Fornitore",
        descTemplate:
          "Seleziona la colonna 'azienda' e una colonna calcolata 'Provenienza' che mostra 'Locale' se 'nazione' = 'Italia', 'UE' se 'nazione' è tra 'Francia', 'Germania', 'Spagna', altrimenti 'Extra-UE' dalla tabella 'fornitori'.",
        queryTemplate:
          "SELECT azienda, CASE WHEN nazione = 'Italia' THEN 'Locale' WHEN nazione IN ('Francia', 'Germania', 'Spagna') THEN 'UE' ELSE 'Extra-UE' END FROM fornitori",
        hints: ["CASE geografico"],
        explanation: "Logica supply chain.",
        replacements: {},
        brokenCode:
          "SELECT azienda, CASE WHEN nazione = 'Italia' THEN 'Locale' WHEN nazione IN ('Francia', 'Germania', 'Spagna' THEN 'UE' ELSE 'Extra-UE' END FROM fornitori",
        debugHint: "Manca la parentesi chiusa.",
      },
      {
        titleTemplate: "Case Fascia Oraria (Simulato)",
        descTemplate:
          "Seleziona la colonna 'data_ordine' e una colonna calcolata 'FasciaOraria' che mostra 'Mattina' se l'ora di 'data_ordine' è minore di 12, 'Pomeriggio' se è minore di 18, altrimenti 'Sera' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN HOUR(data_ordine) < 12 THEN 'Mattina' WHEN HOUR(data_ordine) < 18 THEN 'Pomeriggio' ELSE 'Sera' END FROM ordini",
        hints: ["HOUR()"],
        explanation: "Analisi temporale.",
        replacements: {},
        brokenCode:
          "SELECT data_ordine, CASE WHEN HOR(data_ordine) < 12 THEN 'Mattina' WHEN HOUR(data_ordine) < 18 THEN 'Pomeriggio' ELSE 'Sera' END FROM ordini",
        debugHint: "Errore di battitura in HOUR.",
      },
      {
        titleTemplate: "Case Tipo Prodotto",
        descTemplate:
          "Seleziona la colonna 'nome' e una colonna calcolata 'TipoProdotto' che mostra 'Professional' se 'nome' contiene 'Pro' (LIKE '%Pro%'), 'Base' se contiene 'Lite' (LIKE '%Lite%'), altrimenti 'Standard' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN nome LIKE '%Pro%' THEN 'Professional' WHEN nome LIKE '%Lite%' THEN 'Base' ELSE 'Standard' END FROM prodotti",
        hints: ["LIKE multiplo"],
        explanation: "Categorizzazione stringa.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN nome LIKE '%Pro% THEN 'Professional' WHEN nome LIKE '%Lite%' THEN 'Base' ELSE 'Standard' END FROM prodotti",
        debugHint: "Manca l'apice di chiusura.",
      },
      {
        titleTemplate: "Case Margine (Simulato)",
        descTemplate:
          "Seleziona la colonna 'nome' e una colonna calcolata 'Margine' che mostra 'Alto' se il margine calcolato (prezzo - (prezzo * 0.5)) è maggiore di 50, altrimenti 'Basso' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN (prezzo - (prezzo * 0.5)) > 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        hints: ["Calcolo aritmetico"],
        explanation: "Analisi finanziaria.",
        replacements: {},
        brokenCode:
          "SELECT nome, CASE WHEN (prezzo - (prezzo * 0.5) > 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti",
        debugHint: "Manca la parentesi chiusa.",
      },
      {
        titleTemplate: "Case Disponibilità Immediata",
        descTemplate:
          "Seleziona 'prodotti.nome' e una colonna calcolata 'Disponibilita' che mostra 'Immediata' se 'prodotti.stock' > 0 E 'fornitori.nazione' = 'Italia', altrimenti 'Attesa' dalla tabella 'prodotti' in JOIN con 'fornitori'.",
        queryTemplate:
          "SELECT prodotti.nome, CASE WHEN prodotti.stock > 0 AND fornitori.nazione = 'Italia' THEN 'Immediata' ELSE 'Attesa' END FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id",
        hints: ["AND con JOIN"],
        explanation: "Logistica avanzata.",
        replacements: {},
        brokenCode:
          "SELECT prodotti.nome, CASE WHEN prodotti.stock > 0 fornitori.nazione = 'Italia' THEN 'Immediata' ELSE 'Attesa' END FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id",
        debugHint: "Manca l'operatore AND.",
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Case con ORDER BY",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con 'stock' = 0 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC",
        hints: [
          "Usa un CASE nel blocco ORDER BY.",
          "ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC",
        ],
        explanation:
          "Permette di portare in cima righe specifiche basandosi su una condizione.",
        replacements: {},
      },
      {
        titleTemplate: "Case con ORDER BY Prezzo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con 'prezzo' > 100 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' crescente.",
        queryTemplate:
          "SELECT * FROM prodotti ORDER BY CASE WHEN prezzo > 100 THEN 0 ELSE 1 END, prezzo ASC",
        hints: [
          "Assegna 0 ai costosi per metterli prima.",
          "ORDER BY CASE WHEN prezzo > 100 ...",
        ],
        explanation: "Ordinamento a due livelli: logico e poi numerico.",
        replacements: {},
      },
      {
        titleTemplate: "Case con ORDER BY Voto",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' e ordina i risultati mettendo prima quelle con 'voto' >= 4 (usando un CASE che restituisce 0 o 1), poi per 'voto' decrescente.",
        queryTemplate:
          "SELECT * FROM recensioni ORDER BY CASE WHEN voto >= 4 THEN 0 ELSE 1 END, voto DESC",
        hints: [
          "Metti in evidenza i voti alti.",
          "ORDER BY CASE WHEN voto >= 4 ...",
        ],
        explanation: "Utile per dashboard che evidenziano i top performer.",
        replacements: {},
      },
      {
        titleTemplate: "Case con ORDER BY Quantità",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' e ordina i risultati mettendo prima quelli con 'quantita' > 5 (usando un CASE che restituisce 0 o 1), poi per 'quantita' crescente.",
        queryTemplate:
          "SELECT * FROM ordini ORDER BY CASE WHEN quantita > 5 THEN 0 ELSE 1 END, quantita ASC",
        hints: [
          "Separa gli ordini grandi dagli altri.",
          "ORDER BY CASE WHEN quantita > 5 ...",
        ],
        explanation: "Segmentazione visiva degli ordini.",
        replacements: {},
      },
      {
        titleTemplate: "Case con ORDER BY Multiplo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con 'stock' = 0 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC",
        hints: [
          "Combina logica booleana e ordinamento standard.",
          "ORDER BY CASE ... END, prezzo DESC",
        ],
        explanation: "Controllo fine sulla presentazione dei dati.",
        replacements: {},
      },
      {
        titleTemplate: "Case con WHERE",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove un CASE (che restituisce 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito') è uguale a 'Disponibile'.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END = 'Disponibile'",
        hints: [
          "Puoi usare CASE dentro WHERE.",
          "WHERE CASE ... END = 'Disponibile'",
        ],
        explanation:
          "Filtra basandosi sul risultato di una logica condizionale.",
        replacements: {},
      },
      {
        titleTemplate: "Case con WHERE Prezzo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove un CASE (che restituisce 'Costoso' se 'prezzo' > 100, altrimenti 'Economico') è uguale a 'Costoso'.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE CASE WHEN prezzo > 100 THEN 'Costoso' ELSE 'Economico' END = 'Costoso'",
        hints: [
          "Confronta il risultato del CASE.",
          "WHERE CASE ... END = 'Costoso'",
        ],
        explanation: "Selezione basata su classificazione dinamica.",
        replacements: {},
      },
      {
        titleTemplate: "Case con JOIN",
        descTemplate:
          "Classifica i prodotti in base alla categoria ('Elettronica' -> 'Tech', altro -> 'Altro').",
        queryTemplate:
          "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Tech' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id",
        hints: [
          "Usa CASE sui campi della tabella in join.",
          "CASE WHEN categorie.nome = ...",
        ],
        explanation: "Arricchimento dati tramite relazioni.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Aggregazione",
        descTemplate:
          "Classifica le categorie come 'Popolari' se hanno più di 5 prodotti, altrimenti 'Normali'.",
        queryTemplate:
          "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END FROM prodotti GROUP BY categoria_id",
        hints: [
          "Usa funzioni di aggregazione nel CASE.",
          "CASE WHEN COUNT(*) > 5 ...",
        ],
        explanation: "Etichettatura basata su metriche aggregate.",
        replacements: {},
      },
      {
        titleTemplate: "Case con HAVING",
        descTemplate:
          "Filtro su Gruppi Calcolati: mostra solo le categorie classificate come 'Popolari' (più di 5 prodotti).",
        queryTemplate:
          "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END = 'Popolare'",
        hints: ["Usa CASE dentro HAVING.", "HAVING CASE ... END = 'Popolare'"],
        explanation: "Filtro post-aggregazione basato su logica condizionale.",
        replacements: {},
      },
      {
        titleTemplate: "Case Nidificato",
        descTemplate:
          "Logica a Cascata: classifica 'Premium Disponibile' (prezzo > 100 e stock > 20), 'Premium Limitato' (prezzo > 100), o 'Standard'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 THEN CASE WHEN stock > 20 THEN 'Premium Disponibile' ELSE 'Premium Limitato' END ELSE 'Standard' END FROM prodotti",
        hints: [
          "Puoi mettere un CASE dentro un altro CASE.",
          "CASE WHEN ... THEN CASE ... END ELSE ... END",
        ],
        explanation: "Gestisce alberi decisionali complessi.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Subquery",
        descTemplate:
          "Confronto Dinamico: classifica i prodotti come 'Sopra Media' o 'Sotto Media' rispetto al prezzo medio globale.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > (SELECT AVG(prezzo) FROM prodotti) THEN 'Sopra Media' ELSE 'Sotto Media' END FROM prodotti",
        hints: [
          "Usa una subquery nel confronto.",
          "CASE WHEN prezzo > (SELECT AVG(prezzo)...)",
        ],
        explanation: "Classificazione relativa al contesto globale.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Calcolo Complesso",
        descTemplate:
          "Valutazione Asset: classifica il valore totale dello stock (prezzo * stock) in 'Alto', 'Medio', o 'Basso'.",
        queryTemplate:
          "SELECT nome, CASE WHEN (prezzo * stock) > 2000 THEN 'Alto' WHEN (prezzo * stock) > 1000 THEN 'Medio' ELSE 'Basso' END FROM prodotti",
        hints: [
          "Valuta espressioni matematiche.",
          "CASE WHEN (prezzo * stock) > 2000 ...",
        ],
        explanation: "KPI calcolati al volo.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Funzioni Multiple",
        descTemplate:
          "Analisi Avanzata: classifica come 'Lungo Costoso' se nome > 10 caratteri E prezzo > 50, altrimenti 'Altro'.",
        queryTemplate:
          "SELECT nome, CASE WHEN LENGTH(nome) > 10 AND prezzo > 50 THEN 'Lungo Costoso' ELSE 'Altro' END FROM prodotti",
        hints: [
          "Combina funzioni e operatori logici.",
          "CASE WHEN LENGTH(nome) > 10 AND ...",
        ],
        explanation: "Regole di business multi-fattoriali.",
        replacements: {},
      },
      {
        titleTemplate: "Case con ORDER BY Complesso",
        descTemplate:
          "Ordinamento Misto: prima gli 'Esauriti', poi gli altri ordinati per valore totale dello stock decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, (prezzo * stock) DESC",
        hints: [
          "Combina stato booleano e calcolo numerico.",
          "ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, (prezzo * stock) DESC",
        ],
        explanation: "Ordinamento gerarchico avanzato.",
        replacements: {},
      },
      {
        titleTemplate: "Case con WHERE e ORDER BY",
        descTemplate:
          "Report Filtrato e Ordinato: prodotti > 50€, classificati per disponibilità e ordinati per stato.",
        queryTemplate:
          "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti WHERE prezzo > 50 ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END, prezzo DESC",
        hints: [
          "Filtra, calcola, e poi ordina.",
          "WHERE ... ORDER BY CASE ...",
        ],
        explanation: "Pipeline completa di manipolazione dati.",
        replacements: {},
      },
      {
        titleTemplate: "Case con JOIN e ORDER BY",
        descTemplate:
          "Seleziona 'prodotti.nome' e un CASE come 'tipo' che mostra 'Tech' se 'categorie.nome' = 'Elettronica', altrimenti 'Altro', ordinando per il CASE e poi per 'prodotti.prezzo' decrescente.",
        queryTemplate:
          "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Tech' ELSE 'Altro' END AS tipo FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY CASE WHEN categorie.nome = 'Elettronica' THEN 0 ELSE 1 END, prodotti.prezzo DESC",
        hints: [
          "Usa campi di tabelle collegate per l'ordinamento.",
          "ORDER BY CASE WHEN categorie.nome ...",
        ],
        explanation: "Ordinamento basato su logica relazionale.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Aggregazione e HAVING",
        descTemplate:
          "Seleziona 'categoria_id' e un CASE come 'tipo' che mostra 'Popolare' se COUNT(*) > 5, altrimenti 'Normale', raggruppando per 'categoria_id' e filtrando (HAVING) dove il CASE è 'Popolare'.",
        queryTemplate:
          "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END AS tipo FROM prodotti GROUP BY categoria_id HAVING CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END = 'Popolare'",
        hints: [
          "Filtra i risultati dell'aggregazione.",
          "HAVING CASE ... END = 'Popolare'",
        ],
        explanation: "Selezione gruppi basata su etichetta calcolata.",
        replacements: {},
      },
      {
        titleTemplate: "Case Complesso Finale",
        descTemplate:
          "Seleziona 'nome' e un CASE che classifica i prodotti in base a 'prezzo' e 'stock', ordinando i risultati in base alla stessa logica di classificazione.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END AS tipo FROM prodotti ORDER BY CASE WHEN prezzo > 100 AND stock > 20 THEN 0 WHEN prezzo > 100 THEN 1 WHEN stock > 20 THEN 2 ELSE 3 END, prezzo DESC",
        hints: [
          "Replica la logica di classificazione nell'ordinamento.",
          "ORDER BY CASE ... END",
        ],
        explanation: "Massimo controllo su classificazione e presentazione.",
        replacements: {},
      },
      {
        titleTemplate: "Case in ORDER BY con Calcolo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con (prezzo * stock) > 1000 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti ORDER BY CASE WHEN (prezzo * stock) > 1000 THEN 0 ELSE 1 END, prezzo DESC",
        hints: [
          "Ordina su un valore calcolato.",
          "ORDER BY CASE WHEN (prezzo * stock) > 1000 ...",
        ],
        explanation: "Priorità basata su metriche derivate.",
        replacements: {},
      },
      {
        titleTemplate: "Case con WHERE Voto",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove un CASE (che restituisce 'Alta' se 'voto' >= 4, altrimenti 'Bassa') è uguale a 'Alta'.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE CASE WHEN voto >= 4 THEN 'Alta' ELSE 'Bassa' END = 'Alta'",
        hints: ["Filtra per qualità calcolata.", "WHERE CASE ... END = 'Alta'"],
        explanation: "Filtro avanzato su dati derivati.",
        replacements: {},
      },
      {
        titleTemplate: "Case Nidificato Complesso",
        descTemplate:
          "Seleziona 'nome' e un CASE nidificato che classifica i prodotti in base a 'prezzo' (> 100) e poi 'stock' (> 20) in 4 categorie.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > 100 THEN CASE WHEN stock > 20 THEN 'Premium Disponibile' ELSE 'Premium Limitato' END ELSE CASE WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END END FROM prodotti",
        hints: [
          "Struttura decisionale ramificata.",
          "CASE ... THEN CASE ... END ELSE CASE ... END END",
        ],
        explanation: "Logica condizionale profondamente nidificata.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Subquery Media",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Sopra Media' se 'prezzo' > (media globale dei prezzi), altrimenti 'Sotto Media' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > (SELECT AVG(prezzo) FROM prodotti) THEN 'Sopra Media' ELSE 'Sotto Media' END FROM prodotti",
        hints: [
          "Confronta con la media calcolata.",
          "CASE WHEN prezzo > (SELECT AVG(prezzo)...)",
        ],
        explanation: "Analisi relativa delle performance.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Subquery Massimo",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Più Costoso' se 'prezzo' è uguale al prezzo massimo, altrimenti 'Altro' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo = (SELECT MAX(prezzo) FROM prodotti) THEN 'Più Costoso' ELSE 'Altro' END FROM prodotti",
        hints: [
          "Trova il massimo e confronta.",
          "CASE WHEN prezzo = (SELECT MAX(prezzo)...)",
        ],
        explanation: "Evidenziazione di outlier specifici.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Funzione LENGTH",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Nome Lungo' se LENGTH(nome) > 15, 'Nome Medio' se LENGTH(nome) > 10, altrimenti 'Nome Corto' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN LENGTH(nome) > 15 THEN 'Nome Lungo' WHEN LENGTH(nome) > 10 THEN 'Nome Medio' ELSE 'Nome Corto' END FROM prodotti",
        hints: [
          "Segmenta in base alla lunghezza.",
          "CASE WHEN LENGTH(nome) > 15 ...",
        ],
        explanation: "Categorizzazione basata su proprietà delle stringhe.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Funzione YEAR",
        descTemplate:
          "Seleziona 'data_ordine' e un CASE che mostra '2024' se YEAR(data_ordine) = 2024, '2023' se YEAR(data_ordine) = 2023, altrimenti 'Altro Anno' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2024 THEN '2024' WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini",
        hints: [
          "Estrai l'anno e classifica.",
          "CASE WHEN YEAR(data_ordine) = ...",
        ],
        explanation: "Raggruppamento temporale esplicito.",
        replacements: {},
      },
      {
        titleTemplate: "Case con JOIN e WHERE",
        descTemplate:
          "Seleziona 'prodotti.nome' e un CASE che mostra 'Tech Costoso' se 'categorie.nome' = 'Elettronica' AND 'prodotti.prezzo' > 100, altrimenti 'Altro' dalla tabella 'prodotti' JOIN 'categorie'.",
        queryTemplate:
          "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' AND prodotti.prezzo > 100 THEN 'Tech Costoso' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id",
        hints: [
          "Combina condizioni su tabelle diverse.",
          "CASE WHEN categorie.nome = ... AND prodotti.prezzo ...",
        ],
        explanation: "Logica condizionale multi-tabella.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Aggregazione e WHERE",
        descTemplate:
          "Seleziona 'categoria_id' e un CASE come 'tipo' che mostra 'Popolare' se COUNT(*) > 5, altrimenti 'Normale', raggruppando per 'categoria_id' e filtrando (HAVING) dove AVG(prezzo) > 50.",
        queryTemplate:
          "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END AS tipo FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > 50",
        hints: [
          "Classifica e poi filtra il gruppo.",
          "HAVING AVG(prezzo) > 50",
        ],
        explanation: "Combinazione di classificazione e filtro aggregato.",
        replacements: {},
      },
      // NEW EXERCISES FOR CASE HARD
      {
        titleTemplate: "Case in Aggregazione",
        descTemplate:
          "Seleziona un CASE che classifica lo 'stock' (> 0 'Disponibile', altrimenti 'Esaurito') e conta il numero di prodotti per ogni gruppo, raggruppando per il CASE.",
        queryTemplate:
          "SELECT CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato, COUNT(*) FROM prodotti GROUP BY CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END",
        hints: [
          "Usa CASE sia nella SELECT che nel GROUP BY.",
          "GROUP BY CASE ... END",
        ],
        explanation: "Raggruppa i dati basandosi su una categoria calcolata.",
        replacements: {},
      },
      {
        titleTemplate: "Case in Aggregazione Voto",
        descTemplate:
          "Seleziona un CASE che classifica il 'voto' (>= 4 'Positivo', altrimenti 'Negativo') e conta il numero di recensioni per ogni gruppo, raggruppando per il CASE.",
        queryTemplate:
          "SELECT CASE WHEN voto >= 4 THEN 'Positivo' ELSE 'Negativo' END AS sentiment, COUNT(*) FROM recensioni GROUP BY CASE WHEN voto >= 4 THEN 'Positivo' ELSE 'Negativo' END",
        hints: ["Raggruppa per sentiment calcolato.", "GROUP BY CASE ... END"],
        explanation: "Analisi del sentiment dei feedback.",
        replacements: {},
      },
      {
        titleTemplate: "Case in ORDER BY Custom",
        descTemplate:
          "Seleziona 'prodotti.nome' e 'categorie.nome', ordinando per un CASE che assegna 1 a 'Elettronica', 2 a 'Abbigliamento', e 3 agli altri.",
        queryTemplate:
          "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY CASE WHEN categorie.nome = 'Elettronica' THEN 1 WHEN categorie.nome = 'Abbigliamento' THEN 2 ELSE 3 END",
        hints: [
          "Assegna numeri per definire l'ordine.",
          "ORDER BY CASE ... THEN 1 ... THEN 2 ...",
        ],
        explanation: "Forza un ordine non alfabetico specifico.",
        replacements: {},
      },
      {
        titleTemplate: "Case Pivot (Simulato)",
        descTemplate:
          "Seleziona la somma di un CASE (1 se 'prezzo' < 50, altrimenti 0) come 'Economici' e la somma di un CASE (1 se 'prezzo' >= 50, altrimenti 0) come 'Costosi' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END) AS Economici, SUM(CASE WHEN prezzo >= 50 THEN 1 ELSE 0 END) AS Costosi FROM prodotti",
        hints: [
          "Usa SUM(CASE ...) per contare condizionalmente.",
          "SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END)",
        ],
        explanation:
          "Tecnica per creare colonne pivot (trasformare righe in colonne).",
        replacements: {},
      },
      {
        titleTemplate: "Case dentro AVG",
        descTemplate:
          "Seleziona la media (AVG) di un CASE che restituisce 'prezzo' se 'stock' > 0, altrimenti NULL (per ignorare il valore) dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT AVG(CASE WHEN stock > 0 THEN prezzo ELSE NULL END) as MediaDisponibili FROM prodotti",
        hints: [
          "Usa NULL per ignorare valori nella media.",
          "AVG(CASE ... ELSE NULL END)",
        ],
        explanation: "Statistiche filtrate senza WHERE.",
        replacements: {},
      },
      {
        titleTemplate: "Case dentro COUNT",
        descTemplate:
          "Seleziona il conteggio (COUNT) di recensioni 'Positive' (voto >= 4) e 'Negative' (voto <= 2) usando CASE che restituiscono 1 o NULL.",
        queryTemplate:
          "SELECT COUNT(CASE WHEN voto >= 4 THEN 1 END) as Positive, COUNT(CASE WHEN voto <= 2 THEN 1 END) as Negative FROM recensioni",
        hints: ["COUNT ignora i NULL.", "COUNT(CASE ... THEN 1 END)"],
        explanation: "Conteggi multipli in una sola passata.",
        replacements: {},
      },
      {
        titleTemplate: "Case Nidificato 3 Livelli",
        descTemplate:
          "Seleziona 'nome' e un CASE nidificato complesso che classifica gli utenti in 4 categorie basandosi su 'premium' e numero di ordini.",
        queryTemplate:
          "SELECT nome, CASE WHEN premium THEN CASE WHEN (SELECT COUNT(*) FROM ordini WHERE utente_id = utenti.id) > 5 THEN 'VIP' ELSE 'Promettente' END ELSE CASE WHEN (SELECT COUNT(*) FROM ordini WHERE utente_id = utenti.id) > 5 THEN 'Fedele' ELSE 'Standard' END END FROM utenti",
        hints: [
          "Logica ramificata complessa.",
          "CASE WHEN ... THEN CASE ... END ELSE CASE ... END END",
        ],
        explanation: "Segmentazione avanzata della clientela.",
        replacements: {},
      },
      {
        titleTemplate: "Case Update (Simulato con Select)",
        descTemplate:
          "Seleziona 'nome', 'prezzo' originale e un CASE che mostra il nuovo prezzo (prezzo * 1.10 se 'prezzo' < 50, altrimenti prezzo invariato) dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, CASE WHEN prezzo < 50 THEN prezzo * 1.10 ELSE prezzo END AS nuovo_prezzo FROM prodotti",
        hints: [
          "Simula un aumento prezzi condizionale.",
          "CASE WHEN prezzo < 50 THEN prezzo * 1.10 ...",
        ],
        explanation: "Anteprima di modifiche ai dati.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Window Function",
        descTemplate:
          "Seleziona 'nome', la differenza di prezzo col precedente (LAG), e un CASE che mostra 'Salto' se la differenza > 50, altrimenti 'Normale'.",
        queryTemplate:
          "SELECT nome, prezzo - LAG(prezzo) OVER (ORDER BY prezzo) as Diff, CASE WHEN (prezzo - LAG(prezzo) OVER (ORDER BY prezzo)) > 50 THEN 'Salto' ELSE 'Normale' END FROM prodotti",
        hints: [
          "Usa LAG per guardare la riga precedente.",
          "CASE WHEN ... > 50",
        ],
        explanation: "Analisi di serie e sequenze.",
        replacements: {},
      },
      {
        titleTemplate: "Case per Etichetta Temporale",
        descTemplate:
          "Seleziona 'data_ordine' e un CASE che mostra 'Weekend' se DAYOFWEEK(data_ordine) è 1 (Dom) o 7 (Sab), altrimenti 'Feriale' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT data_ordine, CASE WHEN DAYOFWEEK(data_ordine) IN (1, 7) THEN 'Weekend' ELSE 'Feriale' END FROM ordini",
        hints: [
          "Usa DAYOFWEEK (1=Dom, 7=Sab).",
          "CASE WHEN DAYOFWEEK(...) IN (1, 7)",
        ],
        explanation: "Categorizzazione temporale.",
        replacements: {},
      },
      {
        titleTemplate: "Case in HAVING Complesso",
        descTemplate:
          "Seleziona 'categoria_id' raggruppando per categoria e filtrando (HAVING) dove il numero di prodotti costosi (>100) è maggiore di quelli economici (<50) usando SUM e CASE.",
        queryTemplate:
          "SELECT categoria_id FROM prodotti GROUP BY categoria_id HAVING SUM(CASE WHEN prezzo > 100 THEN 1 ELSE 0 END) > SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END)",
        hints: [
          "Confronta due SUM condizionali.",
          "HAVING SUM(...) > SUM(...)",
        ],
        explanation: "Filtri complessi su aggregati.",
        replacements: {},
      },
      {
        titleTemplate: "Case con Subquery Correlata",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Sopra' se 'prezzo' > (media prezzi della stessa categoria), altrimenti 'Sotto' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, CASE WHEN prezzo > (SELECT AVG(p2.prezzo) FROM prodotti p2 WHERE p2.categoria_id = prodotti.categoria_id) THEN 'Sopra' ELSE 'Sotto' END FROM prodotti",
        hints: [
          "La subquery dipende dalla riga esterna.",
          "SELECT AVG(...) WHERE categoria_id = prodotti.categoria_id",
        ],
        explanation: "Benchmarking contestuale.",
        replacements: {},
      },
      {
        titleTemplate: "Case Multi-Colonna",
        descTemplate:
          "Seleziona 'nome' e un CASE che mostra 'Raro' se 'stock' < 10, 'Caro' se 'prezzo' > 100, altrimenti 'Normale' (la prima condizione vera vince).",
        queryTemplate:
          "SELECT nome, CASE WHEN stock < 10 THEN 'Raro' WHEN prezzo > 100 THEN 'Caro' ELSE 'Normale' END FROM prodotti",
        hints: [
          "L'ordine delle clausole WHEN determina la priorità.",
          "Prima controlla stock, poi prezzo.",
        ],
        explanation: "Gestione conflitti tra regole.",
        replacements: {},
      },
      {
        titleTemplate: "Case Null Coalesce Logic",
        descTemplate:
          "Seleziona 'id' e un CASE che mostra 'Non Spedito' se 'codice_tracking' E 'data_spedizione' sono NULL, 'Non Tracciato' se solo 'codice_tracking' è NULL, altrimenti 'Ok' dalla tabella 'spedizioni'.",
        queryTemplate:
          "SELECT id, CASE WHEN codice_tracking IS NULL AND data_spedizione IS NULL THEN 'Non Spedito' WHEN codice_tracking IS NULL THEN 'Non Tracciato' ELSE 'Ok' END FROM spedizioni",
        hints: [
          "Gestisci le combinazioni di NULL.",
          "CASE WHEN ... IS NULL AND ... IS NULL",
        ],
        explanation: "Pulizia e normalizzazione dati.",
        replacements: {},
      },
      {
        titleTemplate: "Case in JOIN Condition",
        descTemplate:
          "Seleziona 'p.nome' e 's.sconto' facendo una LEFT JOIN tra 'prodotti' (p) e 'sconti' (s) sulla condizione che 's.tipo' sia uguale a un CASE ('Alto' se 'p.prezzo' > 100, altrimenti 'Basso').",
        queryTemplate:
          "SELECT p.nome, s.sconto FROM prodotti p LEFT JOIN sconti s ON s.tipo = CASE WHEN p.prezzo > 100 THEN 'Alto' ELSE 'Basso' END",
        hints: ["Usa CASE nella condizione ON.", "ON s.tipo = CASE ... END"],
        explanation: "Relazioni condizionali tra tabelle.",
        replacements: {},
      },
    ],
  },
  [TopicId.Advanced]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Subquery Prezzo > Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore della media (AVG) di 'prezzo' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)",
        brokenCode:
          "SELETC * FROM prodotti WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)",
        debugHint: "Errore di battitura nella parola chiave SELECT.",
        hints: [
          "Subquery in WHERE",
          "WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)",
        ],
        explanation: "Subquery per confronto con media.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo < Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è minore della media (AVG) di 'prezzo' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)",
        brokenCode:
          "SELECT * prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)",
        debugHint: "Manca la parola chiave FROM.",
        hints: [
          "Subquery in WHERE",
          "WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)",
        ],
        explanation: "Subquery per confronto con media minore.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock > Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è maggiore della media (AVG) di 'stock' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock > (SELECT AVG(stock) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock > (SELECT AV(stock) FROM prodotti)",
        debugHint: "La funzione per la media è AVG, non AV.",
        hints: [
          "Subquery in WHERE",
          "WHERE stock > (SELECT AVG(stock) FROM prodotti)",
        ],
        explanation: "Subquery per confronto stock.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock < Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore della media (AVG) di 'stock' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock < (SELECT AVG(stock) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock < (AVG(stock) FROM prodotti)",
        debugHint: "Manca la parola chiave SELECT nella subquery.",
        hints: [
          "Subquery in WHERE",
          "WHERE stock < (SELECT AVG(stock) FROM prodotti)",
        ],
        explanation: "Subquery per confronto stock minore.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto > Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore della media (AVG) di 'voto' di tutte le recensioni.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni)",
        brokenCode:
          "SELECT * FROM recensioni WHER voto > (SELECT AVG(voto) FROM recensioni)",
        debugHint: "Errore di battitura nella parola chiave WHERE.",
        hints: [
          "Subquery in WHERE",
          "WHERE voto > (SELECT AVG(voto) FROM recensioni)",
        ],
        explanation: "Subquery per confronto voto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto < Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è minore della media (AVG) di 'voto' di tutte le recensioni.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto < (SELECT AVG(voto) FROM recensioni)",
        brokenCode:
          "SELECT * FROM recensioni WHERE voto < (SELECT AVG(voto) FROM recensioni",
        debugHint: "Manca la parentesi di chiusura della subquery.",
        hints: [
          "Subquery in WHERE",
          "WHERE voto < (SELECT AVG(voto) FROM recensioni)",
        ],
        explanation: "Subquery per confronto voto minore.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità > Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è maggiore della media (AVG) di 'quantita' di tutti gli ordini.",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita > (SELECT AVG(quantita) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita > (SELECT AGV(quantita) FROM ordini)",
        debugHint: "Errore di battitura nella funzione AVG.",
        hints: [
          "Subquery in WHERE",
          "WHERE quantita > (SELECT AVG(quantita) FROM ordini)",
        ],
        explanation: "Subquery per confronto quantità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità < Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è minore della media (AVG) di 'quantita' di tutti gli ordini.",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita < (SELECT AVG(quantita) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita < (SELECT AVG(quantita) ordini)",
        debugHint: "Manca la parola chiave FROM nella subquery.",
        hints: [
          "Subquery in WHERE",
          "WHERE quantita < (SELECT AVG(quantita) FROM ordini)",
        ],
        explanation: "Subquery per confronto quantità minore.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo = Massimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è uguale al massimo (MAX) di 'prezzo' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo = (SELECT MA(prezzo) FROM prodotti)",
        debugHint: "Errore di battitura nella funzione MAX.",
        hints: [
          "Subquery con MAX",
          "WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti)",
        ],
        explanation: "Subquery con MAX.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo = Minimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è uguale al minimo (MIN) di 'prezzo' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo = (MIN(prezzo) FROM prodotti)",
        debugHint: "Manca la parola chiave SELECT nella subquery.",
        hints: [
          "Subquery con MIN",
          "WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti)",
        ],
        explanation: "Subquery con MIN.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock = Massimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è uguale al massimo (MAX) di 'stock' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock = (SELECT MAX(stock) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock = (SELECT MAX(stok) FROM prodotti)",
        debugHint: "Errore di battitura nel nome della colonna 'stock'.",
        hints: [
          "Subquery con MAX",
          "WHERE stock = (SELECT MAX(stock) FROM prodotti)",
        ],
        explanation: "Subquery con MAX su stock.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock = Minimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è uguale al minimo (MIN) di 'stock' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock = (SELECT MIN(stock) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock = SELECT MIN(stock) FROM prodotti",
        debugHint: "Le subquery devono essere racchiuse tra parentesi.",
        hints: [
          "Subquery con MIN",
          "WHERE stock = (SELECT MIN(stock) FROM prodotti)",
        ],
        explanation: "Subquery con MIN su stock.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto = Massimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è uguale al massimo (MAX) di 'voto' di tutte le recensioni.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto = (SELECT MAX(voto) FROM recensioni)",
        brokenCode:
          "SELECT * FROM recensioni WHERE voto = (SELECT MAX(vot) FROM recensioni)",
        debugHint: "Errore di battitura nel nome della colonna 'voto'.",
        hints: [
          "Subquery con MAX",
          "WHERE voto = (SELECT MAX(voto) FROM recensioni)",
        ],
        explanation: "Subquery con MAX su voto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto = Minimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è uguale al minimo (MIN) di 'voto' di tutte le recensioni.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto = (SELECT MIN(voto) FROM recensioni)",
        brokenCode:
          "SELECT * recensioni WHERE voto = (SELECT MIN(voto) FROM recensioni)",
        debugHint: "Manca la parola chiave FROM nella query principale.",
        hints: [
          "Subquery con MIN",
          "WHERE voto = (SELECT MIN(voto) FROM recensioni)",
        ],
        explanation: "Subquery con MIN su voto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità = Massimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è uguale al massimo (MAX) di 'quantita' di tutti gli ordini.",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita = (SELECT MAX(quantita) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita = (SELECT MAX(quantit) FROM ordini)",
        debugHint: "Errore di battitura nel nome della colonna 'quantita'.",
        hints: [
          "Subquery con MAX",
          "WHERE quantita = (SELECT MAX(quantita) FROM ordini)",
        ],
        explanation: "Subquery con MAX su quantità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità = Minimo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è uguale al minimo (MIN) di 'quantita' di tutti gli ordini.",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita = (SELECT MIN(quantita) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita = (SELECT MI(quantita) FROM ordini)",
        debugHint: "Errore di battitura nella funzione MIN.",
        hints: [
          "Subquery con MIN",
          "WHERE quantita = (SELECT MIN(quantita) FROM ordini)",
        ],
        explanation: "Subquery con MIN su quantità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo >= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore o uguale alla media (AVG) di 'prezzo' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo >= (SELECT AVG(prezzo) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo >= (SELECT AV(prezzo) FROM prodotti)",
        debugHint: "La funzione per la media è AVG, non AV.",
        hints: [
          "Subquery con >=",
          "WHERE prezzo >= (SELECT AVG(prezzo) FROM prodotti)",
        ],
        explanation: "Subquery con >=",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo <= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è minore o uguale alla media (AVG) di 'prezzo' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo <= (SELECT AVG(prezzo) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo <= (AVG(prezzo) FROM prodotti)",
        debugHint: "Manca la parola chiave SELECT nella subquery.",
        hints: [
          "Subquery con <=",
          "WHERE prezzo <= (SELECT AVG(prezzo) FROM prodotti)",
        ],
        explanation: "Subquery con <=",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock >= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è maggiore o uguale alla media (AVG) di 'stock' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock >= (SELECT AVG(stock) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock >= (SELECT AVG(stoc) FROM prodotti)",
        debugHint: "Errore di battitura nel nome della colonna 'stock'.",
        hints: [
          "Subquery con >=",
          "WHERE stock >= (SELECT AVG(stock) FROM prodotti)",
        ],
        explanation: "Subquery con >= su stock.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock <= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore o uguale alla media (AVG) di 'stock' di tutti i prodotti.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock <= (SELECT AVG(stock) FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock <= SELECT AVG(stock) FROM prodotti",
        debugHint: "Le subquery devono essere racchiuse tra parentesi.",
        hints: [
          "Subquery con <=",
          "WHERE stock <= (SELECT AVG(stock) FROM prodotti)",
        ],
        explanation: "Subquery con <= su stock.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto >= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore o uguale alla media (AVG) di 'voto' di tutte le recensioni.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto >= (SELECT AVG(voto) FROM recensioni)",
        brokenCode:
          "SELECT * FROM recensioni WHERE voto >= (SELECT AVG(vot) FROM recensioni)",
        debugHint: "Errore di battitura nel nome della colonna 'voto'.",
        hints: [
          "Subquery con >=",
          "WHERE voto >= (SELECT AVG(voto) FROM recensioni)",
        ],
        explanation: "Subquery con >= su voto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto <= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è minore o uguale alla media (AVG) di 'voto' di tutte le recensioni.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto <= (SELECT AVG(voto) FROM recensioni)",
        brokenCode:
          "SELECT * recensioni WHERE voto <= (SELECT AVG(voto) FROM recensioni)",
        debugHint: "Manca la parola chiave FROM nella query principale.",
        hints: [
          "Subquery con <=",
          "WHERE voto <= (SELECT AVG(voto) FROM recensioni)",
        ],
        explanation: "Subquery con <= su voto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità >= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è maggiore o uguale alla media (AVG) di 'quantita' di tutti gli ordini.",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita >= (SELECT AVG(quantita) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita >= (SELECT AVG(quantit) FROM ordini)",
        debugHint: "Errore di battitura nel nome della colonna 'quantita'.",
        hints: [
          "Subquery con >=",
          "WHERE quantita >= (SELECT AVG(quantita) FROM ordini)",
        ],
        explanation: "Subquery con >= su quantità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità <= Media",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è minore o uguale alla media (AVG) di 'quantita' di tutti gli ordini.",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita <= (SELECT AVG(quantita) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita <= (SELECT AVG(quantita) ordini)",
        debugHint: "Manca la parola chiave FROM nella subquery.",
        hints: [
          "Subquery con <=",
          "WHERE quantita <= (SELECT AVG(quantita) FROM ordini)",
        ],
        explanation: "Subquery con <= su quantità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo > Massimo / 2",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore della metà del prezzo massimo (MAX(prezzo) / 2).",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT MAX(prezzo) / 2 FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT MA(prezzo) / 2 FROM prodotti)",
        debugHint: "Errore di battitura nella funzione MAX.",
        hints: [
          "Subquery con calcolo",
          "WHERE prezzo > (SELECT MAX(prezzo) / 2 FROM prodotti)",
        ],
        explanation: "Subquery con calcolo.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock > Massimo / 2",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è maggiore della metà dello stock massimo (MAX(stock) / 2).",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock > (SELECT MAX(stock) / 2 FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock > (MAX(stock) / 2 FROM prodotti)",
        debugHint: "Manca la parola chiave SELECT nella subquery.",
        hints: [
          "Subquery con calcolo",
          "WHERE stock > (SELECT MAX(stock) / 2 FROM prodotti)",
        ],
        explanation: "Subquery con calcolo su stock.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Voto > Massimo / 2",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore della metà del voto massimo (MAX(voto) / 2).",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto > (SELECT MAX(voto) / 2 FROM recensioni)",
        brokenCode:
          "SELECT * FROM recensioni WHERE voto > (SELECT MAX(vot) / 2 FROM recensioni)",
        debugHint: "Errore di battitura nel nome della colonna 'voto'.",
        hints: [
          "Subquery con calcolo",
          "WHERE voto > (SELECT MAX(voto) / 2 FROM recensioni)",
        ],
        explanation: "Subquery con calcolo su voto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Quantità > Massimo / 2",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è maggiore della metà della quantità massima (MAX(quantita) / 2).",
        queryTemplate:
          "SELECT * FROM ordini WHERE quantita > (SELECT MAX(quantita) / 2 FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE quantita > SELECT MAX(quantita) / 2 FROM ordini",
        debugHint: "Le subquery devono essere racchiuse tra parentesi.",
        hints: [
          "Subquery con calcolo",
          "WHERE quantita > (SELECT MAX(quantita) / 2 FROM ordini)",
        ],
        explanation: "Subquery con calcolo su quantità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Prezzo > Minimo * 2",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore del doppio del prezzo minimo (MIN(prezzo) * 2).",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) * 2 FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT MI(prezzo) * 2 FROM prodotti)",
        debugHint: "Errore di battitura nella funzione MIN.",
        hints: [
          "Subquery con calcolo",
          "WHERE prezzo > (SELECT MIN(prezzo) * 2 FROM prodotti)",
        ],
        explanation: "Subquery con calcolo minimo.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery Stock < Massimo / 2",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore della metà dello stock massimo (MAX(stock) / 2).",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock < (SELECT MAX(stock) / 2 FROM prodotti)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock < (SELECT MAX(stock) / 2 prodotti)",
        debugHint: "Manca la parola chiave FROM nella subquery.",
        hints: [
          "Subquery con calcolo",
          "WHERE stock < (SELECT MAX(stock) / 2 FROM prodotti)",
        ],
        explanation: "Subquery con calcolo stock minore.",
        replacements: {},
      },
      // NEW EXERCISES FOR ADVANCED EASY
      {
        titleTemplate: "Subquery IN Categorie",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'categoria_id' è IN una subquery che seleziona 'id' dalla tabella 'categorie' dove 'nome' è 'Elettronica' o 'Abbigliamento'.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE categoria_id IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))",
        brokenCode:
          "SELECT * FROM prodotti WHERE categoria_id I (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))",
        debugHint: "Errore di battitura nell'operatore IN.",
        hints: ["Subquery con IN"],
        explanation: "Filtro su relazione.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery NOT IN Categorie",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'categoria_id' NON è IN una subquery che seleziona 'id' dalla tabella 'categorie' dove 'nome' è 'Elettronica' o 'Abbigliamento'.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE categoria_id NOT IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))",
        brokenCode:
          "SELECT * FROM prodotti WHERE categoria_id IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))",
        debugHint: "Manca l'operatore NOT prima di IN.",
        hints: ["Subquery con NOT IN"],
        explanation: "Esclusione su relazione.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery IN Fornitori",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'fornitore_id' è IN una subquery che seleziona 'id' dalla tabella 'fornitori' dove 'nazione' è 'Italia'.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE fornitore_id IN (SELECT id FROM fornitori WHERE nazione = 'Italia')",
        brokenCode:
          "SELECT * FROM prodotti WHERE fornitoreid IN (SELECT id FROM fornitori WHERE nazione = 'Italia')",
        debugHint: "Errore di battitura nel nome della colonna 'fornitore_id'.",
        hints: ["Subquery con IN"],
        explanation: "Filtro geografico indiretto.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery ANY Prezzo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore di ALMENO UNO (ANY) dei prezzi dei prodotti della categoria 1.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > ANY (SELECT prezzo FROM prodotti WHERE categoria_id = 1)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo > AN (SELECT prezzo FROM prodotti WHERE categoria_id = 1)",
        debugHint: "Errore di battitura nell'operatore ANY.",
        hints: ["Subquery con ANY"],
        explanation: "Confronto con insieme.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery ALL Prezzo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore di TUTTI (ALL) i prezzi dei prodotti della categoria 1.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > ALL (SELECT prezzo FROM prodotti WHERE categoria_id = 1)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo > AL (SELECT prezzo FROM prodotti WHERE categoria_id = 1)",
        debugHint: "Errore di battitura nell'operatore ALL.",
        hints: ["Subquery con ALL"],
        explanation: "Confronto totale.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery FROM (Derived Table)",
        descTemplate:
          "Seleziona la media (AVG) di 'p.prezzo' da una subquery nella clausola FROM (alias 'p') che seleziona tutti i prodotti con 'prezzo' > 100.",
        queryTemplate:
          "SELECT AVG(p.prezzo) FROM (SELECT * FROM prodotti WHERE prezzo > 100) as p",
        brokenCode:
          "SELECT AVG(p.prezzo) FROM (SELECT * FROM prodotti WHERE prezzo > 100)",
        debugHint: "Manca l'alias per la tabella derivata (es. 'as p').",
        hints: ["Subquery in FROM"],
        explanation: "Tabella derivata.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery SELECT (Scalare)",
        descTemplate:
          "Seleziona 'nome' e la differenza tra 'prezzo' e la media globale (calcolata con una subquery SELECT AVG(prezzo) FROM prodotti) come 'DiffMedia' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo - (SELECT AVG(prezzo) FROM prodotti) as DiffMedia FROM prodotti",
        brokenCode:
          "SELECT nome, prezzo - (SELECT AVG(prezzo)) as DiffMedia FROM prodotti",
        debugHint: "Manca la clausola FROM nella subquery.",
        hints: ["Subquery in SELECT"],
        explanation: "Calcolo relativo.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery WHERE Data Recente",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'data_ordine' è maggiore di una data calcolata (MAX(data_ordine) meno 1 mese) usando una subquery.",
        queryTemplate:
          "SELECT * FROM ordini WHERE data_ordine > (SELECT DATE_SUB(MAX(data_ordine), INTERVAL 1 MONTH) FROM ordini)",
        brokenCode:
          "SELECT * FROM ordini WHERE data_ordine > (SELECT DATESUB(MAX(data_ordine), INTERVAL 1 MONTH) FROM ordini)",
        debugHint: "Errore di battitura nella funzione DATE_SUB.",
        hints: ["Subquery data dinamica"],
        explanation: "Filtro temporale relativo.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery WHERE Utente Attivo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'utente_id' corrisponde all'utente che ha ordinato più quantità in totale (trovato con subquery LIMIT 1).",
        queryTemplate:
          "SELECT * FROM ordini WHERE utente_id = (SELECT utente_id FROM ordini GROUP BY utente_id ORDER BY SUM(quantita * 10) DESC LIMIT 1)",
        brokenCode:
          "SELECT * FROM ordini WHERE utente_id = (SELECT utente_id FROM ordini GROUP BY utente_id ORDER BY SUM(quantita * 10) DESC)",
        debugHint: "Manca la clausola LIMIT 1 nella subquery.",
        hints: ["Subquery con LIMIT"],
        explanation: "Targeting utente top.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery WHERE Prodotto Popolare",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'prodotto_id' corrisponde al prodotto con più recensioni (trovato con subquery LIMIT 1).",
        queryTemplate:
          "SELECT * FROM recensioni WHERE prodotto_id = (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id ORDER BY COUNT(*) DESC LIMIT 1)",
        brokenCode:
          "SELECT * FROM recensioni WHERE prodotto_id = (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id ORDER BY CONT(*) DESC LIMIT 1)",
        debugHint: "Errore di battitura nella funzione COUNT.",
        hints: ["Subquery aggregata"],
        explanation: "Focus su popolarità.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery IN Utenti Premium",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'utente_id' è IN una subquery che seleziona 'id' dalla tabella 'utenti' dove 'premium' è TRUE.",
        queryTemplate:
          "SELECT * FROM recensioni WHERE utente_id IN (SELECT id FROM utenti WHERE premium = TRUE)",
        brokenCode:
          "SELECT * FROM recensioni WHERE utente_id IN (SELECT id FROM utenti premium = TRUE)",
        debugHint: "Manca la parola chiave WHERE nella subquery.",
        hints: ["Subquery su booleano"],
        explanation: "Filtro segmento utente.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery NOT IN Utenti Premium",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'ordini' dove 'utente_id' NON è IN una subquery che seleziona 'id' dalla tabella 'utenti' dove 'premium' è TRUE.",
        queryTemplate:
          "SELECT * FROM ordini WHERE utente_id NOT IN (SELECT id FROM utenti WHERE premium = TRUE)",
        brokenCode:
          "SELECT * FROM ordini WHERE utente_id NO IN (SELECT id FROM utenti WHERE premium = TRUE)",
        debugHint: "Errore di battitura nella parola chiave NOT.",
        hints: ["Subquery esclusione"],
        explanation: "Analisi segmento standard.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery WHERE Prezzo > Minimo Categoria",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore del prezzo minimo (MIN) dei prodotti della categoria 1 (trovato con subquery).",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1)",
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) WHERE categoria_id = 1)",
        debugHint: "Manca la clausola FROM nella subquery.",
        hints: ["Subquery specifica"],
        explanation: "Confronto puntuale.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery WHERE Stock < Media Categoria",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore della media (AVG) dello stock dei prodotti della categoria 1 (trovato con subquery).",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock < (SELECT AVG(stock) FROM prodotti WHERE categoria_id = 1)",
        brokenCode:
          "SELECT * FROM prodotti WHERE stock < (SELECT AV(stock) FROM prodotti WHERE categoria_id = 1)",
        debugHint: "Errore di battitura nella funzione AVG.",
        hints: ["Subquery media parziale"],
        explanation: "Analisi stock relativa.",
        replacements: {},
      },
      {
        titleTemplate: "Subquery WHERE Voto > Media Prodotto",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore della media (AVG) dei voti del prodotto 1 (trovato con subquery).",
        queryTemplate:
          "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni WHERE prodotto_id = 1)",
        brokenCode:
          "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni prodotto_id = 1)",
        debugHint: "Manca la parola chiave WHERE nella subquery.",
        hints: ["Subquery media specifica"],
        explanation: "Analisi qualità relativa.",
        replacements: {},
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Utenti con Ordini (Exists)",
        descTemplate:
          "Seleziona gli utenti che hanno fatto almeno un ordine usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        hints: [
          "EXISTS con subquery",
          "WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        ],
        explanation: "EXISTS per verificare esistenza.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXIST (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        debugHint: "Errore di battitura nella parola chiave EXISTS.",
      },
      {
        titleTemplate: "Utenti senza Ordini (NOT EXISTS)",
        descTemplate:
          "Seleziona gli utenti che NON hanno fatto ordini usando NOT EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        hints: [
          "NOT EXISTS",
          "WHERE NOT EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        ],
        explanation: "NOT EXISTS per verificare assenza.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE NO EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        debugHint: "Errore di battitura nella parola chiave NOT.",
      },
      {
        titleTemplate: "Prodotti con Recensioni (EXISTS)",
        descTemplate:
          "Seleziona i prodotti che hanno almeno una recensione usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        hints: [
          "EXISTS con recensioni",
          "WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        ],
        explanation: "EXISTS per prodotti con recensioni.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "Prodotti senza Recensioni (NOT EXISTS)",
        descTemplate:
          "Seleziona i prodotti che NON hanno recensioni usando NOT EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        hints: [
          "NOT EXISTS",
          "WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        ],
        explanation: "NOT EXISTS per prodotti senza recensioni.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE NOT EXISTS SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        debugHint: "Manca la parentesi di apertura della subquery.",
      },
      {
        titleTemplate: "Ordini con Spedizioni (EXISTS)",
        descTemplate:
          "Seleziona gli ordini che hanno una spedizione usando EXISTS.",
        queryTemplate:
          "SELECT * FROM ordini WHERE EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)",
        hints: [
          "EXISTS con spedizioni",
          "WHERE EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)",
        ],
        explanation: "EXISTS per ordini con spedizioni.",
        replacements: {},
        brokenCode:
          "SELECT * FROM ordini WHERE EXISTS (SELECT 1 FROM spedizioni spedizioni.ordine_id = ordini.id)",
        debugHint: "Manca la parola chiave WHERE nella subquery.",
      },
      {
        titleTemplate: "Ordini senza Spedizioni (NOT EXISTS)",
        descTemplate:
          "Seleziona gli ordini che NON hanno spedizioni usando NOT EXISTS.",
        queryTemplate:
          "SELECT * FROM ordini WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)",
        hints: [
          "NOT EXISTS",
          "WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)",
        ],
        explanation: "NOT EXISTS per ordini senza spedizioni.",
        replacements: {},
        brokenCode:
          "SELECT * FROM ordini WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "Utenti con Recensioni (EXISTS)",
        descTemplate:
          "Seleziona gli utenti che hanno scritto almeno una recensione usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)",
        hints: [
          "EXISTS con recensioni",
          "WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)",
        ],
        explanation: "EXISTS per utenti con recensioni.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.uid)",
        debugHint: "Colonna 'uid' inesistente nella tabella utenti (usa 'id').",
      },
      {
        titleTemplate: "Utenti senza Recensioni (NOT EXISTS)",
        descTemplate:
          "Seleziona gli utenti che NON hanno scritto recensioni usando NOT EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)",
        hints: [
          "NOT EXISTS",
          "WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)",
        ],
        explanation: "NOT EXISTS per utenti senza recensioni.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "EXISTS con WHERE",
        descTemplate:
          "Seleziona gli utenti che hanno ordini dopo il 1 Gennaio 2023 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01')",
        hints: [
          "EXISTS con WHERE",
          "WHERE EXISTS (SELECT 1 FROM ordini WHERE ... AND ordini.data_ordine > '2023-01-01')",
        ],
        explanation: "EXISTS con condizione aggiuntiva.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id ordini.data_ordine > '2023-01-01')",
        debugHint: "Manca l'operatore AND nella subquery.",
      },
      {
        titleTemplate: "EXISTS con WHERE Prezzo",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni con voto >= 4 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4)",
        hints: [
          "EXISTS con WHERE",
          "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.voto >= 4)",
        ],
        explanation: "EXISTS con filtro voto.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto 4)",
        debugHint: "Manca l'operatore di confronto (>=).",
      },
      {
        titleTemplate: "EXISTS con WHERE Quantità",
        descTemplate:
          "Seleziona gli utenti che hanno ordini con quantità > 5 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5)",
        hints: [
          "EXISTS con WHERE",
          "WHERE EXISTS (SELECT 1 FROM ordini WHERE ... AND ordini.quantita > 5)",
        ],
        explanation: "EXISTS con filtro quantità.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "EXISTS con WHERE Prezzo Prodotto",
        descTemplate:
          "Seleziona gli utenti che hanno ordinato prodotti > 100 euro usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.prezzo > 100)",
        hints: [
          "EXISTS con JOIN",
          "WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ... WHERE ... AND prodotti.prezzo > 100)",
        ],
        explanation: "EXISTS con JOIN nella subquery.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.prezzo > 100)",
        debugHint: "Manca la parola chiave ON nella JOIN.",
      },
      {
        titleTemplate: "EXISTS con WHERE Categoria",
        descTemplate:
          "Seleziona gli utenti che hanno ordinato prodotti della categoria 1 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.categoria_id = 1)",
        hints: [
          "EXISTS con JOIN",
          "WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ... WHERE ... AND prodotti.categoria_id = 1)",
        ],
        explanation: "EXISTS con JOIN e filtro categoria.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.categoria_id 1)",
        debugHint: "Manca l'operatore di uguaglianza (=).",
      },
      {
        titleTemplate: "EXISTS con WHERE Fornitore",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni e sono forniti da fornitore 1 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) AND prodotti.fornitore_id = 1",
        hints: [
          "EXISTS con AND",
          "WHERE EXISTS (...) AND prodotti.fornitore_id = 1",
        ],
        explanation: "EXISTS con condizione aggiuntiva esterna.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) prodotti.fornitore_id = 1",
        debugHint: "Manca l'operatore AND.",
      },
      {
        titleTemplate: "EXISTS con WHERE Data",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni dopo il 1 Gennaio 2023 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01')",
        hints: [
          "EXISTS con WHERE data",
          "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.data_recensione > '2023-01-01')",
        ],
        explanation: "EXISTS con filtro data.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01'",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "EXISTS con WHERE Voto",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni con voto = 5 usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5)",
        hints: [
          "EXISTS con WHERE voto",
          "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.voto = 5)",
        ],
        explanation: "EXISTS con filtro voto specifico.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "EXISTS con WHERE Stock",
        descTemplate:
          "Seleziona i prodotti con stock > 10 che hanno recensioni usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE stock > 10 AND EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        hints: ["EXISTS con AND", "WHERE stock > 10 AND EXISTS (...)"],
        explanation: "EXISTS con condizione esterna.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE stock > 10 EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        debugHint: "Manca l'operatore AND.",
      },
      {
        titleTemplate: "EXISTS con WHERE Prezzo",
        descTemplate:
          "Seleziona i prodotti con prezzo > 50 che hanno recensioni usando EXISTS.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo > 50 AND EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        hints: ["EXISTS con AND", "WHERE prezzo > 50 AND EXISTS (...)"],
        explanation: "EXISTS con filtro prezzo esterno.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo > 50 AND EXIST (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)",
        debugHint: "Errore di battitura nella parola chiave EXISTS.",
      },
      {
        titleTemplate: "EXISTS con WHERE Premium",
        descTemplate:
          "Seleziona gli utenti Premium che hanno ordini usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE premium = TRUE AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        hints: ["EXISTS con AND", "WHERE premium = TRUE AND EXISTS (...)"],
        explanation: "EXISTS con filtro premium.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE premium = TRUE AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "EXISTS con WHERE Paese",
        descTemplate:
          "Seleziona gli utenti italiani che hanno ordini usando EXISTS.",
        queryTemplate:
          "SELECT * FROM utenti WHERE paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        hints: ["EXISTS con AND", "WHERE paese = 'Italia' AND EXISTS (...)"],
        explanation: "EXISTS con filtro paese.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE paese = 'Italia' EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)",
        debugHint: "Manca l'operatore AND.",
      },
      {
        titleTemplate: "EXISTS con ORDER BY",
        descTemplate:
          "Seleziona gli utenti che hanno ordini, ordinati per nome A-Z.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) ORDER BY nome ASC",
        hints: ["EXISTS con ORDER BY", "WHERE EXISTS (...) ORDER BY nome ASC"],
        explanation: "EXISTS con ordinamento.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) ORDER BY nome",
        debugHint: "Manca la direzione dell'ordinamento (ASC).",
      },
      {
        titleTemplate: "EXISTS con ORDER BY Prezzo",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni, ordinati per prezzo decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC",
        hints: [
          "EXISTS con ORDER BY",
          "WHERE EXISTS (...) ORDER BY prezzo DESC",
        ],
        explanation: "EXISTS con ordinamento prezzo.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo",
        debugHint: "Manca la direzione dell'ordinamento (DESC).",
      },
      {
        titleTemplate: "EXISTS con LIMIT",
        descTemplate: "Seleziona i primi 5 utenti che hanno ordini.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) LIMIT 5",
        hints: ["EXISTS con LIMIT", "WHERE EXISTS (...) LIMIT 5"],
        explanation: "EXISTS con LIMIT.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) LIMIT",
        debugHint: "Manca il numero di righe per il LIMIT.",
      },
      {
        titleTemplate: "EXISTS con ORDER BY e LIMIT",
        descTemplate:
          "Seleziona i primi 5 prodotti che hanno recensioni, ordinati per prezzo decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC LIMIT 5",
        hints: [
          "EXISTS con ORDER BY e LIMIT",
          "WHERE EXISTS (...) ORDER BY prezzo DESC LIMIT 5",
        ],
        explanation: "EXISTS con ordinamento e LIMIT.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC LIMIT",
        debugHint: "Manca il numero di righe per il LIMIT.",
      },
      {
        titleTemplate: "EXISTS Complesso Finale",
        descTemplate:
          "Seleziona gli utenti Premium italiani che hanno ordini dopo il 1 Gennaio 2023, ordinati per nome A-Z.",
        queryTemplate:
          "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') ORDER BY nome ASC",
        hints: [
          "EXISTS complesso",
          "WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (...) ORDER BY nome ASC",
        ],
        explanation: "EXISTS complesso con filtri multipli e ordinamento.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') ORDER BY nome",
        debugHint: "Manca la direzione dell'ordinamento (ASC).",
      },
      {
        titleTemplate: "EXISTS con WHERE e LIMIT",
        descTemplate:
          "Seleziona i primi 3 utenti che hanno ordini dopo il 1 Gennaio 2023.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') LIMIT 3",
        hints: ["EXISTS con WHERE e LIMIT", "WHERE EXISTS (...) LIMIT 3"],
        explanation: "EXISTS con WHERE e LIMIT.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') LIMIT",
        debugHint: "Manca il numero di righe per il LIMIT.",
      },
      {
        titleTemplate: "EXISTS con WHERE Prezzo e ORDER BY",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni con voto >= 4, ordinati per prezzo decrescente.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4) ORDER BY prezzo DESC",
        hints: [
          "EXISTS con WHERE e ORDER BY",
          "WHERE EXISTS (...) ORDER BY prezzo DESC",
        ],
        explanation: "EXISTS con WHERE e ordinamento.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4) ORDER BY prezzo",
        debugHint: "Manca la direzione dell'ordinamento (DESC).",
      },
      {
        titleTemplate: "EXISTS con WHERE Quantità e LIMIT",
        descTemplate:
          "Seleziona i primi 5 utenti che hanno ordini con quantità > 5.",
        queryTemplate:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5) LIMIT 5",
        hints: ["EXISTS con WHERE e LIMIT", "WHERE EXISTS (...) LIMIT 5"],
        explanation: "EXISTS con WHERE quantità e LIMIT.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5) LIMIT",
        debugHint: "Manca il numero di righe per il LIMIT.",
      },
      {
        titleTemplate: "EXISTS con WHERE Data e ORDER BY",
        descTemplate:
          "Seleziona i prodotti che hanno recensioni dopo il 1 Gennaio 2023, ordinati per prezzo crescente.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01') ORDER BY prezzo ASC",
        hints: [
          "EXISTS con WHERE data e ORDER BY",
          "WHERE EXISTS (...) ORDER BY prezzo ASC",
        ],
        explanation: "EXISTS con WHERE data e ordinamento.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01') ORDER BY prezzo",
        debugHint: "Manca la direzione dell'ordinamento (ASC).",
      },
      {
        titleTemplate: "EXISTS con WHERE Voto e LIMIT",
        descTemplate:
          "Seleziona i primi 3 prodotti che hanno recensioni con voto = 5.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5) LIMIT 3",
        hints: ["EXISTS con WHERE voto e LIMIT", "WHERE EXISTS (...) LIMIT 3"],
        explanation: "EXISTS con WHERE voto e LIMIT.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5) LIMIT",
        debugHint: "Manca il numero di righe per il LIMIT.",
      },
      // NEW EXERCISES FOR ADVANCED MEDIUM
      {
        titleTemplate: "Correlated Subquery Prezzo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'prezzo' è maggiore della media dei prezzi dei prodotti della STESSA categoria (calcolata con subquery correlata su p2.categoria_id = p1.categoria_id).",
        queryTemplate:
          "SELECT * FROM prodotti p1 WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)",
        hints: ["Subquery correlata"],
        explanation: "Confronto relativo al gruppo.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti p1 WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.id)",
        debugHint:
          "La condizione di correlazione è errata: dovrebbe confrontare le categorie (categoria_id).",
      },
      {
        titleTemplate: "Correlated Subquery Stock",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'stock' è minore della media dello stock dei prodotti della STESSA categoria (calcolata con subquery correlata su p2.categoria_id = p1.categoria_id).",
        queryTemplate:
          "SELECT * FROM prodotti p1 WHERE stock < (SELECT AVG(stock) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)",
        hints: ["Subquery correlata stock"],
        explanation: "Analisi inventario relativa.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti p1 WHERE stock < (SELECT AVG(stock) FROM prodotti p2 WHERE p2.categoria_id = p1.id)",
        debugHint:
          "La condizione di correlazione è errata: dovrebbe confrontare le categorie (categoria_id).",
      },
      {
        titleTemplate: "Correlated Subquery Voto",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'recensioni' (alias r1) dove 'voto' è maggiore della media dei voti delle recensioni dello STESSO prodotto (calcolata con subquery correlata su r2.prodotto_id = r1.prodotto_id).",
        queryTemplate:
          "SELECT * FROM recensioni r1 WHERE voto > (SELECT AVG(voto) FROM recensioni r2 WHERE r2.prodotto_id = r1.prodotto_id)",
        hints: ["Subquery correlata voto"],
        explanation: "Analisi sentiment relativa.",
        replacements: {},
        brokenCode:
          "SELECT * FROM recensioni r1 WHERE voto > (SELECT AVG(voto) FROM recensioni r2 WHERE r2.prodotto_id = r1.id)",
        debugHint:
          "La condizione di correlazione è errata: dovrebbe confrontare i prodotti (prodotto_id).",
      },
      {
        titleTemplate: "Subquery SELECT Conteggio",
        descTemplate:
          "Seleziona 'nome' e il numero di prodotti (calcolato con subquery SELECT COUNT(*) correlata) come 'NumProdotti' dalla tabella 'categorie'.",
        queryTemplate:
          "SELECT nome, (SELECT COUNT(*) FROM prodotti WHERE categoria_id = categorie.id) as NumProdotti FROM categorie",
        hints: ["Subquery in SELECT"],
        explanation: "Conteggio correlato.",
        replacements: {},
        brokenCode:
          "SELECT nome, (SELECT COUNT(*) FROM prodotti WHERE categoria_id = categorie.id) NumProdotti FROM categorie",
        debugHint: "Manca la parola chiave AS per l'alias di colonna.",
      },
      {
        titleTemplate: "Subquery SELECT Media Prezzo",
        descTemplate:
          "Seleziona 'azienda' e il prezzo medio dei prodotti (calcolato con subquery SELECT AVG(prezzo) correlata) come 'PrezzoMedio' dalla tabella 'fornitori'.",
        queryTemplate:
          "SELECT azienda, (SELECT AVG(prezzo) FROM prodotti WHERE fornitore_id = fornitori.id) as PrezzoMedio FROM fornitori",
        hints: ["Subquery in SELECT media"],
        explanation: "Aggregazione correlata.",
        replacements: {},
        brokenCode:
          "SELECT azienda, (SELECT AVG(prezzo) FROM prodotti WHERE fornitore_id = fornitori.id) PrezzoMedio FROM fornitori",
        debugHint: "Manca la parola chiave AS per l'alias di colonna.",
      },
      {
        titleTemplate: "Subquery SELECT Ultimo Ordine",
        descTemplate:
          "Seleziona 'nome' e la data dell'ultimo ordine (calcolata con subquery SELECT MAX(data_ordine) correlata) come 'UltimoOrdine' dalla tabella 'utenti'.",
        queryTemplate:
          "SELECT nome, (SELECT MAX(data_ordine) FROM ordini WHERE utente_id = utenti.id) as UltimoOrdine FROM utenti",
        hints: ["Subquery in SELECT max"],
        explanation: "Data correlata.",
        replacements: {},
        brokenCode:
          "SELECT nome, (SELECT MAX(data_ordine) FROM ordini WHERE utente_id = utenti.id) UltimoOrdine FROM utenti",
        debugHint: "Manca la parola chiave AS per l'alias di colonna.",
      },
      {
        titleTemplate: "EXISTS Utenti Attivi Recenti",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'utenti' (alias u) dove ESISTE (EXISTS) un ordine recente (data_ordine > '2023-12-01') nella tabella 'ordini' (alias o) per lo stesso utente.",
        queryTemplate:
          "SELECT * FROM utenti u WHERE EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id AND o.data_ordine > '2023-12-01')",
        hints: ["EXISTS con data"],
        explanation: "Filtro attività recente.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti u WHERE EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id AND o.data_ordine > '2023-12-01'",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "NOT EXISTS Prodotti Invenduti",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' (alias p) dove NON ESISTE (NOT EXISTS) un ordine nella tabella 'ordini' (alias o) per lo stesso prodotto.",
        queryTemplate:
          "SELECT * FROM prodotti p WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.prodotto_id = p.id)",
        hints: ["NOT EXISTS ordini"],
        explanation: "Analisi invenduto.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti p WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.prodotto_id = p.id",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "NOT EXISTS Utenti Inattivi",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'utenti' (alias u) dove NON ESISTE (NOT EXISTS) un ordine nella tabella 'ordini' (alias o) per lo stesso utente.",
        queryTemplate:
          "SELECT * FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id)",
        hints: ["NOT EXISTS utenti"],
        explanation: "Analisi churn.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "Subquery WHERE IN Multiplo",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'id' è IN una subquery che seleziona 'prodotto_id' da 'ordini' JOIN 'utenti' dove 'utenti.premium' è TRUE.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE)",
        hints: ["IN con JOIN"],
        explanation: "Filtro trasversale.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "Subquery WHERE IN Aggregato",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'utenti' dove 'id' è IN una subquery che seleziona 'utente_id' da 'ordini' raggruppati per 'utente_id' con conteggio > 5.",
        queryTemplate:
          "SELECT * FROM utenti WHERE id IN (SELECT utente_id FROM ordini GROUP BY utente_id HAVING COUNT(*) > 5)",
        hints: ["IN con HAVING"],
        explanation: "Filtro su aggregati.",
        replacements: {},
        brokenCode:
          "SELECT * FROM utenti WHERE id IN (SELECT utente_id FROM ordini GROUP BY utente_id HAVING COUNT(*) > 5",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "Subquery WHERE IN Media Alta",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' dove 'id' è IN una subquery che seleziona 'prodotto_id' da 'recensioni' raggruppati per 'prodotto_id' con media voti > 4.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) > 4)",
        hints: ["IN con HAVING AVG"],
        explanation: "Qualità alta.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) > 4",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
      {
        titleTemplate: "Correlated Subquery Max",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'prezzo' è uguale al prezzo massimo dei prodotti della STESSA categoria (calcolato con subquery correlata).",
        queryTemplate:
          "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)",
        hints: ["Subquery max correlata"],
        explanation: "Top per gruppo.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.id)",
        debugHint:
          "La condizione di correlazione è errata: dovrebbe confrontare le categorie (categoria_id).",
      },
      {
        titleTemplate: "Correlated Subquery Min",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'prezzo' è uguale al prezzo minimo dei prodotti dello STESSO fornitore (calcolato con subquery correlata).",
        queryTemplate:
          "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti p2 WHERE p2.fornitore_id = p1.fornitore_id)",
        hints: ["Subquery min correlata"],
        explanation: "Best price per fornitore.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti p2 WHERE p2.fornitore_id = p1.id)",
        debugHint:
          "La condizione di correlazione è errata: dovrebbe confrontare i fornitori (fornitore_id).",
      },
      {
        titleTemplate: "Subquery in UPDATE (Simulato)",
        descTemplate:
          "Seleziona tutti i campi dalla tabella 'prodotti' che verrebbero aggiornati se modificassimo i prodotti con prezzo inferiore alla media globale.",
        queryTemplate:
          "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)",
        hints: ["Simulazione update"],
        explanation: "Targeting massivo.",
        replacements: {},
        brokenCode:
          "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti",
        debugHint: "Manca la parentesi di chiusura della subquery.",
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Ranking Prodotti",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il rango (RANK) dei prodotti in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti",
        hints: ["RANK() OVER", "RANK() OVER (ORDER BY prezzo DESC) as rango"],
        explanation: "Window Function RANK.",
        replacements: {},
      },
      {
        titleTemplate: "Ranking Stock",
        descTemplate:
          "Seleziona 'nome', 'stock' e il rango (RANK) dei prodotti in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, stock, RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti",
        hints: ["RANK() OVER", "RANK() OVER (ORDER BY stock DESC) as rango"],
        explanation: "RANK su stock.",
        replacements: {},
      },
      {
        titleTemplate: "Ranking Voti",
        descTemplate:
          "Seleziona 'voto' e il rango (RANK) delle recensioni in base al 'voto' decrescente come 'rango' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT voto, RANK() OVER (ORDER BY voto DESC) as rango FROM recensioni",
        hints: ["RANK() OVER", "RANK() OVER (ORDER BY voto DESC) as rango"],
        explanation: "RANK su voti.",
        replacements: {},
      },
      {
        titleTemplate: "Ranking Quantità",
        descTemplate:
          "Seleziona 'quantita' e il rango (RANK) degli ordini in base alla 'quantita' decrescente come 'rango' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT quantita, RANK() OVER (ORDER BY quantita DESC) as rango FROM ordini",
        hints: ["RANK() OVER", "RANK() OVER (ORDER BY quantita DESC) as rango"],
        explanation: "RANK su quantità.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK Prodotti",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il rango denso (DENSE_RANK) dei prodotti in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, DENSE_RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti",
        hints: [
          "DENSE_RANK() OVER",
          "DENSE_RANK() OVER (ORDER BY prezzo DESC) as rango",
        ],
        explanation: "Window Function DENSE_RANK.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK Stock",
        descTemplate:
          "Seleziona 'nome', 'stock' e il rango denso (DENSE_RANK) dei prodotti in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti",
        hints: [
          "DENSE_RANK() OVER",
          "DENSE_RANK() OVER (ORDER BY stock DESC) as rango",
        ],
        explanation: "DENSE_RANK su stock.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER Prodotti",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il numero di riga (ROW_NUMBER) dei prodotti in base al 'prezzo' decrescente come 'numero' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, ROW_NUMBER() OVER (ORDER BY prezzo DESC) as numero FROM prodotti",
        hints: [
          "ROW_NUMBER() OVER",
          "ROW_NUMBER() OVER (ORDER BY prezzo DESC) as numero",
        ],
        explanation: "Window Function ROW_NUMBER.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER Stock",
        descTemplate:
          "Seleziona 'nome', 'stock' e il numero di riga (ROW_NUMBER) dei prodotti in base allo 'stock' decrescente come 'numero' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, stock, ROW_NUMBER() OVER (ORDER BY stock DESC) as numero FROM prodotti",
        hints: [
          "ROW_NUMBER() OVER",
          "ROW_NUMBER() OVER (ORDER BY stock DESC) as numero",
        ],
        explanation: "ROW_NUMBER su stock.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con PARTITION BY Categoria",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti",
        hints: [
          "RANK() OVER PARTITION BY",
          "RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango",
        ],
        explanation: "RANK con PARTITION BY.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK con PARTITION BY Categoria",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti",
        hints: [
          "DENSE_RANK() OVER PARTITION BY",
          "DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango",
        ],
        explanation: "DENSE_RANK con PARTITION BY.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER con PARTITION BY Categoria",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il numero di riga (ROW_NUMBER) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'numero' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as numero FROM prodotti",
        hints: [
          "ROW_NUMBER() OVER PARTITION BY",
          "ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as numero",
        ],
        explanation: "ROW_NUMBER con PARTITION BY.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con PARTITION BY Utente",
        descTemplate:
          "Seleziona 'utente_id', 'quantita' e il rango (RANK) partizionato per 'utente_id' e ordinato per 'quantita' decrescente come 'rango' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT utente_id, quantita, RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as rango FROM ordini",
        hints: [
          "RANK() OVER PARTITION BY",
          "RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as rango",
        ],
        explanation: "RANK con PARTITION BY utente.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK con PARTITION BY Prodotto",
        descTemplate:
          "Seleziona 'prodotto_id', 'voto' e il rango denso (DENSE_RANK) partizionato per 'prodotto_id' e ordinato per 'voto' decrescente come 'rango' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT prodotto_id, voto, DENSE_RANK() OVER (PARTITION BY prodotto_id ORDER BY voto DESC) as rango FROM recensioni",
        hints: [
          "DENSE_RANK() OVER PARTITION BY",
          "DENSE_RANK() OVER (PARTITION BY prodotto_id ORDER BY voto DESC) as rango",
        ],
        explanation: "DENSE_RANK con PARTITION BY prodotto.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER con PARTITION BY Utente",
        descTemplate:
          "Seleziona 'utente_id', 'data_ordine' e il numero di riga (ROW_NUMBER) partizionato per 'utente_id' e ordinato per 'data_ordine' decrescente come 'numero' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT utente_id, data_ordine, ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY data_ordine DESC) as numero FROM ordini",
        hints: [
          "ROW_NUMBER() OVER PARTITION BY",
          "ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY data_ordine DESC) as numero",
        ],
        explanation: "ROW_NUMBER con PARTITION BY utente.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con WHERE",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il rango (RANK) in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50.",
        queryTemplate:
          "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50",
        hints: ["RANK() con WHERE", "WHERE prezzo > 50"],
        explanation: "RANK con filtro.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK con WHERE",
        descTemplate:
          "Seleziona 'nome', 'stock' e il rango denso (DENSE_RANK) in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti' dove 'stock' > 10.",
        queryTemplate:
          "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti WHERE stock > 10",
        hints: ["DENSE_RANK() con WHERE", "WHERE stock > 10"],
        explanation: "DENSE_RANK con filtro.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER con WHERE",
        descTemplate:
          "Seleziona 'voto' e il numero di riga (ROW_NUMBER) in base al 'voto' decrescente come 'numero' dalla tabella 'recensioni' dove 'voto' >= 4.",
        queryTemplate:
          "SELECT voto, ROW_NUMBER() OVER (ORDER BY voto DESC) as numero FROM recensioni WHERE voto >= 4",
        hints: ["ROW_NUMBER() con WHERE", "WHERE voto >= 4"],
        explanation: "ROW_NUMBER con filtro.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con LIMIT",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il rango (RANK) in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti', ordinati per 'prezzo' decrescente e limitati a 5.",
        queryTemplate:
          "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti ORDER BY prezzo DESC LIMIT 5",
        hints: ["RANK() con LIMIT", "ORDER BY prezzo DESC LIMIT 5"],
        explanation: "RANK con LIMIT.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK con LIMIT",
        descTemplate:
          "Seleziona 'nome', 'stock' e il rango denso (DENSE_RANK) in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti', ordinati per 'stock' decrescente e limitati a 5.",
        queryTemplate:
          "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti ORDER BY stock DESC LIMIT 5",
        hints: ["DENSE_RANK() con LIMIT", "ORDER BY stock DESC LIMIT 5"],
        explanation: "DENSE_RANK con LIMIT.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER con LIMIT",
        descTemplate:
          "Seleziona 'voto' e il numero di riga (ROW_NUMBER) in base al 'voto' decrescente come 'numero' dalla tabella 'recensioni', ordinati per 'voto' decrescente e limitati a 5.",
        queryTemplate:
          "SELECT voto, ROW_NUMBER() OVER (ORDER BY voto DESC) as numero FROM recensioni ORDER BY voto DESC LIMIT 5",
        hints: ["ROW_NUMBER() con LIMIT", "ORDER BY voto DESC LIMIT 5"],
        explanation: "ROW_NUMBER con LIMIT.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con PARTITION BY e WHERE",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50",
        hints: ["RANK() OVER PARTITION BY con WHERE", "WHERE prezzo > 50"],
        explanation: "RANK con PARTITION BY e filtro.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK con PARTITION BY e WHERE",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'stock' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'stock' decrescente come 'rango' dalla tabella 'prodotti' dove 'stock' > 10.",
        queryTemplate:
          "SELECT nome, categoria_id, stock, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY stock DESC) as rango FROM prodotti WHERE stock > 10",
        hints: ["DENSE_RANK() OVER PARTITION BY con WHERE", "WHERE stock > 10"],
        explanation: "DENSE_RANK con PARTITION BY e filtro.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER con PARTITION BY e WHERE",
        descTemplate:
          "Seleziona 'utente_id', 'quantita' e il numero di riga (ROW_NUMBER) partizionato per 'utente_id' e ordinato per 'quantita' decrescente come 'numero' dalla tabella 'ordini' dove 'quantita' > 3.",
        queryTemplate:
          "SELECT utente_id, quantita, ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as numero FROM ordini WHERE quantita > 3",
        hints: [
          "ROW_NUMBER() OVER PARTITION BY con WHERE",
          "WHERE quantita > 3",
        ],
        explanation: "ROW_NUMBER con PARTITION BY e filtro.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con PARTITION BY e LIMIT",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti', filtrando dove il rango è <= 3.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) <= 3",
        hints: [
          "RANK() OVER PARTITION BY con filtro",
          "WHERE RANK() OVER (...) <= 3",
        ],
        explanation: "RANK con PARTITION BY e LIMIT simulato.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Complessa Finale",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti', dove 'prezzo' > 50 e il rango è <= 3.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50 AND DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) <= 3",
        hints: [
          "DENSE_RANK() OVER PARTITION BY complesso",
          "WHERE prezzo > 50 AND DENSE_RANK() OVER (...) <= 3",
        ],
        explanation:
          "Window Function complessa con PARTITION BY, WHERE e LIMIT simulato.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con PARTITION BY e ORDER BY Multiplo",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo', 'stock' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente e 'stock' decrescente come 'rango' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, stock, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango FROM prodotti",
        hints: [
          "RANK() OVER PARTITION BY con ORDER BY multiplo",
          "RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango",
        ],
        explanation: "RANK con PARTITION BY e ORDER BY multiplo.",
        replacements: {},
      },
      {
        titleTemplate: "DENSE_RANK con PARTITION BY e ORDER BY Multiplo",
        descTemplate:
          "Seleziona 'utente_id', 'quantita', 'data_ordine' e il rango denso (DENSE_RANK) partizionato per 'utente_id' e ordinato per 'quantita' decrescente e 'data_ordine' decrescente come 'rango' dalla tabella 'ordini'.",
        queryTemplate:
          "SELECT utente_id, quantita, data_ordine, DENSE_RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC, data_ordine DESC) as rango FROM ordini",
        hints: [
          "DENSE_RANK() OVER PARTITION BY con ORDER BY multiplo",
          "DENSE_RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC, data_ordine DESC) as rango",
        ],
        explanation: "DENSE_RANK con PARTITION BY e ORDER BY multiplo.",
        replacements: {},
      },
      {
        titleTemplate: "ROW_NUMBER con PARTITION BY e ORDER BY Multiplo",
        descTemplate:
          "Seleziona 'prodotto_id', 'voto', 'data_recensione' e il numero di riga (ROW_NUMBER) partizionato per 'prodotto_id' e ordinato per 'voto' decrescente e 'data_recensione' decrescente come 'numero' dalla tabella 'recensioni'.",
        queryTemplate:
          "SELECT prodotto_id, voto, data_recensione, ROW_NUMBER() OVER (PARTITION BY prodotto_id ORDER BY voto DESC, data_recensione DESC) as numero FROM recensioni",
        hints: [
          "ROW_NUMBER() OVER PARTITION BY con ORDER BY multiplo",
          "ROW_NUMBER() OVER (PARTITION BY prodotto_id ORDER BY voto DESC, data_recensione DESC) as numero",
        ],
        explanation: "ROW_NUMBER con PARTITION BY e ORDER BY multiplo.",
        replacements: {},
      },
      {
        titleTemplate: "RANK con PARTITION BY e WHERE Complesso",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo', 'stock' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50 e 'stock' > 10.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, stock, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50 AND stock > 10",
        hints: [
          "RANK() OVER PARTITION BY con WHERE multiplo",
          "WHERE prezzo > 50 AND stock > 10",
        ],
        explanation: "RANK con PARTITION BY e WHERE multiplo.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Finale Complessa",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente e 'stock' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50 e il rango è <= 3.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango FROM prodotti WHERE prezzo > 50 AND DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) <= 3",
        hints: [
          "DENSE_RANK() OVER PARTITION BY finale",
          "WHERE prezzo > 50 AND DENSE_RANK() OVER (...) <= 3",
        ],
        explanation:
          "Window Function finale complessa con PARTITION BY, WHERE multiplo e ORDER BY multiplo.",
        replacements: {},
      },
      // NEW EXERCISES FOR ADVANCED HARD
      {
        titleTemplate: "CTE Semplice",
        descTemplate:
          "Usa una CTE chiamata 'MediaPrezzi' per calcolare la media dei prezzi (come 'avg_p') e poi seleziona tutti i campi dalla tabella 'prodotti' e 'MediaPrezzi' dove 'prezzo' è maggiore di 'avg_p'.",
        queryTemplate:
          "WITH MediaPrezzi AS (SELECT AVG(prezzo) as avg_p FROM prodotti) SELECT * FROM prodotti, MediaPrezzi WHERE prezzo > avg_p",
        hints: ["WITH CTE"],
        explanation: "CTE base.",
        replacements: {},
      },
      {
        titleTemplate: "CTE Multipla",
        descTemplate:
          "Usa due CTE: 'Costosi' (prezzo > 100) e 'Economici' (prezzo < 20), poi seleziona tutto da 'Costosi' UNION tutto da 'Economici'.",
        queryTemplate:
          "WITH Costosi AS (SELECT * FROM prodotti WHERE prezzo > 100), Economici AS (SELECT * FROM prodotti WHERE prezzo < 20) SELECT * FROM Costosi UNION SELECT * FROM Economici",
        hints: ["WITH CTE1, CTE2"],
        explanation: "CTE multiple.",
        replacements: {},
      },
      {
        titleTemplate: "CTE con Aggregazione",
        descTemplate:
          "Usa una CTE chiamata 'SpeseUtenti' per calcolare il totale vendite per utente (SUM(quantita * 10) come 'totale'), poi seleziona tutti i campi da 'SpeseUtenti' dove 'totale' > 1000.",
        queryTemplate:
          "WITH SpeseUtenti AS (SELECT utente_id, SUM(quantita * 10) as totale FROM ordini GROUP BY utente_id) SELECT * FROM SpeseUtenti WHERE totale > 1000",
        hints: ["CTE Group By"],
        explanation: "CTE per pre-aggregazione.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function LAG",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il prezzo precedente (LAG(prezzo)) ordinato per 'prezzo' come 'PrezzoPrecedente' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, LAG(prezzo) OVER (ORDER BY prezzo) as PrezzoPrecedente FROM prodotti",
        hints: ["LAG() OVER"],
        explanation: "Accesso riga precedente.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function LEAD",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il prezzo successivo (LEAD(prezzo)) ordinato per 'prezzo' come 'PrezzoSuccessivo' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, LEAD(prezzo) OVER (ORDER BY prezzo) as PrezzoSuccessivo FROM prodotti",
        hints: ["LEAD() OVER"],
        explanation: "Accesso riga successiva.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function NTILE",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il quartile (NTILE(4)) ordinato per 'prezzo' come 'Quartile' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, NTILE(4) OVER (ORDER BY prezzo) as Quartile FROM prodotti",
        hints: ["NTILE(4)"],
        explanation: "Statistica descrittiva.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Running Total",
        descTemplate:
          "Seleziona 'id', 'stock' e la somma cumulativa dello 'stock' (SUM(stock) OVER) ordinata per 'id' come 'StockCumulativo' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT id, stock, SUM(stock) OVER (ORDER BY id) as StockCumulativo FROM prodotti",
        hints: ["SUM() OVER ORDER BY"],
        explanation: "Totale progressivo.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Moving Avg",
        descTemplate:
          "Seleziona 'id', 'prezzo' e la media mobile del 'prezzo' (AVG(prezzo) OVER) sugli ultimi 3 prodotti (ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) ordinati per 'id' come 'MediaMobile' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT id, prezzo, AVG(prezzo) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as MediaMobile FROM prodotti",
        hints: ["ROWS BETWEEN"],
        explanation: "Media mobile.",
        replacements: {},
      },
      {
        titleTemplate: "CTE Ricorsiva (Simulata)",
        descTemplate:
          "Usa una CTE Ricorsiva chiamata 'Numeri' per generare una sequenza da 1 a 5, poi seleziona tutto da 'Numeri'.",
        queryTemplate:
          "WITH RECURSIVE Numeri AS (SELECT 1 as n UNION ALL SELECT n + 1 FROM Numeri WHERE n < 5) SELECT * FROM Numeri",
        hints: ["WITH RECURSIVE"],
        explanation: "Generazione sequenza.",
        replacements: {},
      },
      {
        titleTemplate: "CTE per Classifica",
        descTemplate:
          "Usa una CTE chiamata 'Classifica' per calcolare il rango vendite per utente (RANK() su COUNT(*) DESC come 'rnk'), poi seleziona tutto da 'Classifica' dove 'rnk' <= 3.",
        queryTemplate:
          "WITH Classifica AS (SELECT utente_id, RANK() OVER (ORDER BY COUNT(*) DESC) as rnk FROM ordini GROUP BY utente_id) SELECT * FROM Classifica WHERE rnk <= 3",
        hints: ["CTE con Window Func"],
        explanation: "Ranking pulito.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Percent Rank",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e il rango percentuale (PERCENT_RANK()) ordinato per 'prezzo' come 'PctRank' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, PERCENT_RANK() OVER (ORDER BY prezzo) as PctRank FROM prodotti",
        hints: ["PERCENT_RANK()"],
        explanation: "Statistica avanzata.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function First Value",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e il primo valore di 'prezzo' (FIRST_VALUE) partizionato per 'categoria_id' e ordinato per 'prezzo' ASC come 'PrezzoMinCategoria' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, FIRST_VALUE(prezzo) OVER (PARTITION BY categoria_id ORDER BY prezzo ASC) as PrezzoMinCategoria FROM prodotti",
        hints: ["FIRST_VALUE()"],
        explanation: "Confronto con primo.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Last Value",
        descTemplate:
          "Seleziona 'nome', 'categoria_id', 'prezzo' e l'ultimo valore di 'prezzo' (LAST_VALUE) partizionato per 'categoria_id' e ordinato per 'prezzo' ASC (con frame UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) come 'PrezzoMaxCategoria' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, categoria_id, prezzo, LAST_VALUE(prezzo) OVER (PARTITION BY categoria_id ORDER BY prezzo ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as PrezzoMaxCategoria FROM prodotti",
        hints: ["LAST_VALUE() con Frame"],
        explanation: "Confronto con ultimo.",
        replacements: {},
      },
      {
        titleTemplate: "CTE con Join Complessa",
        descTemplate:
          "Usa due CTE: 'Venduti' (DISTINCT prodotto_id da ordini) e 'Recensiti' (DISTINCT prodotto_id da recensioni), poi seleziona tutto dalla JOIN tra 'Venduti' e 'Recensiti'.",
        queryTemplate:
          "WITH Venduti AS (SELECT DISTINCT prodotto_id FROM ordini), Recensiti AS (SELECT DISTINCT prodotto_id FROM recensioni) SELECT * FROM Venduti JOIN Recensiti ON Venduti.prodotto_id = Recensiti.prodotto_id",
        hints: ["CTE Join"],
        explanation: "Logica a step.",
        replacements: {},
      },
      {
        titleTemplate: "Window Function Partition Avg Diff",
        descTemplate:
          "Seleziona 'nome', 'prezzo' e la differenza tra 'prezzo' e la media di categoria (AVG(prezzo) OVER PARTITION BY categoria_id) come 'DiffDaMedia' dalla tabella 'prodotti'.",
        queryTemplate:
          "SELECT nome, prezzo, prezzo - AVG(prezzo) OVER (PARTITION BY categoria_id) as DiffDaMedia FROM prodotti",
        hints: ["AVG() OVER PARTITION"],
        explanation: "Scostamento dalla media.",
        replacements: {},
      },
    ],
  },
};

export const generateExercises = (
  topicId: TopicId,
  difficulty: Difficulty
): Exercise[] => {
  const exercises: Exercise[] = [];
  const TOTAL = 30; // 30 per difficoltà = 90 totali per topic

  try {
    const topicData = QUESTION_DATABASE[topicId];
    // Fallback logic
    let blueprints = topicData?.[difficulty];
    if (!blueprints || blueprints.length === 0)
      blueprints = topicData?.[Difficulty.Easy];
    if (!blueprints || blueprints.length === 0) {
      return [
        {
          id: "empty",
          topicId,
          difficulty,
          title: "Nessun Esercizio",
          description: "Cambia argomento o difficoltà.",
          initialQuery: "",
          solutionQuery: "SELECT 1",
          hints: [],
          explanation: "",
        },
      ];
    }

    // Ensure we have enough unique blueprints
    if (blueprints.length < TOTAL) {
      console.warn(
        `Warning: Only ${blueprints.length} blueprints available for ${topicId}/${difficulty}, need ${TOTAL}`
      );
    }

    // Shuffle blueprints for variety on regeneration
    const shuffledBlueprints = shuffleArray(blueprints);

    // Track used blueprint combinations to avoid duplicates
    const usedCombinations = new Set<string>();

    // Generate exercises ensuring uniqueness
    let attempts = 0;
    const maxAttempts = TOTAL * 10; // Prevent infinite loops

    while (exercises.length < TOTAL && attempts < maxAttempts) {
      attempts++;

      // Cycle through blueprints, then use random if needed
      const bpIndex =
        exercises.length < shuffledBlueprints.length
          ? exercises.length
          : Math.floor(Math.random() * shuffledBlueprints.length);
      const bp = shuffledBlueprints[bpIndex];

      // Generate replacements
      let title = bp.titleTemplate;
      let desc = bp.descTemplate;
      let query = bp.queryTemplate;
      let hints = [...bp.hints];
      const replacementValues: Record<string, string | number> = {};

      if (bp.replacements) {
        Object.keys(bp.replacements).forEach((key) => {
          const vals = bp.replacements![key];
          const val = getRandomItem(vals);
          replacementValues[key] = val;
          const regex = new RegExp(`\\{${key}\\}`, "g");

          title = title.replace(regex, String(val));
          desc = desc.replace(regex, String(val));
          query = query.replace(regex, String(val));
          hints = hints.map((h) => h.replace(regex, String(val)));
        });
      }

      // Create unique key for this combination
      const combinationKey = `${bp.titleTemplate}_${JSON.stringify(
        replacementValues
      )}`;

      // Skip if this exact combination was already used
      if (usedCombinations.has(combinationKey)) {
        continue;
      }

      usedCombinations.add(combinationKey);

      // Add timestamp and random ID for uniqueness
      exercises.push({
        id: `${topicId}_${difficulty}_${
          exercises.length
        }_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        topicId,
        difficulty,
        title,
        description: desc,
        initialQuery: "",
        solutionQuery: query,
        brokenCode: bp.brokenCode, // Add broken code for Debug Mode
        debugHint: bp.debugHint, // Add debug hint for Debug Mode
        hints: hints,
        explanation: bp.explanation,
      });
    }

    // Final shuffle to mix exercises
    return shuffleArray(exercises);
  } catch (e) {
    console.error("Generator Error:", e);
    return [
      {
        id: "error",
        topicId,
        difficulty,
        title: "Errore",
        description: "Si è verificato un errore nella generazione.",
        initialQuery: "",
        solutionQuery: "SELECT 1",
        hints: [],
        explanation: "",
      },
    ];
  }
};
