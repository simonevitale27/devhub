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
        titleTemplate: "Tutto su Users",
        descTemplate: "Seleziona tutte le colonne dalla tabella Users.",
        queryTemplate: "SELECT * FROM Users",
        hints: ["Usa l'asterisco * per selezionare tutto", "SELECT * FROM ..."],
        explanation: "L'asterisco è una scorciatoia per selezionare tutte le colonne disponibili.",
        replacements: {},
        brokenCode: "SELECT Users FROM *",
        debugHint: "La sintassi è SELECT * FROM Tabella."
      },
      {
        titleTemplate: "Tutto su Products",
        descTemplate: "Seleziona tutte le colonne dalla tabella Products.",
        queryTemplate: "SELECT * FROM Products",
        hints: ["Usa SELECT *"],
        explanation: "Recupera l'intero catalogo prodotti.",
        replacements: {},
        brokenCode: "SELECT ALL FROM Products",
        debugHint: "In SQL si usa * non ALL per le colonne."
      },
      {
        titleTemplate: "Tutto su Orders",
        descTemplate: "Seleziona tutte le colonne dalla tabella Orders.",
        queryTemplate: "SELECT * FROM Orders",
        hints: ["SELECT * FROM Orders"],
        explanation: "Visualizza lo storico ordini completo.",
        replacements: {},
        brokenCode: "SELECT * Orders",
        debugHint: "Manca la clausola FROM."
      },
      {
        titleTemplate: "Tutto su OrderItems",
        descTemplate: "Seleziona tutte le colonne dalla tabella OrderItems.",
        queryTemplate: "SELECT * FROM OrderItems",
        hints: ["Seleziona tutto da OrderItems"],
        explanation: "Dettagli riga per riga degli ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla il nome della tabella."
      },
      {
        titleTemplate: "Tutto su Employees",
        descTemplate: "Seleziona tutte le colonne dalla tabella Employees.",
        queryTemplate: "SELECT * FROM Employees",
        hints: ["SELECT * FROM Employees"],
        explanation: "Anagrafica dipendenti completa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Ricorda SELECT * FROM."
      },
      {
        titleTemplate: "Nomi Utenti",
        descTemplate: "Seleziona solo la colonna 'name' dalla tabella Users.",
        queryTemplate: "SELECT name FROM Users",
        hints: ["Specifica il nome della colonna dopo SELECT"],
        explanation: "Proiezione su una singola colonna.",
        replacements: {},
        brokenCode: "SELECT Users FROM name",
        debugHint: "Prima le colonne, poi la tabella."
      },
      {
        titleTemplate: "Email Utenti",
        descTemplate: "Seleziona solo la colonna 'email' dalla tabella Users.",
        queryTemplate: "SELECT email FROM Users",
        hints: ["SELECT email ..."],
        explanation: "Lista contatti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SELECT email."
      },
      {
        titleTemplate: "Paesi Utenti",
        descTemplate: "Seleziona la colonna 'country' dalla tabella Users.",
        queryTemplate: "SELECT country FROM Users",
        hints: ["Proietta solo la colonna country"],
        explanation: "Analisi provenienza geografica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT country FROM Users."
      },
      {
        titleTemplate: "Prodotti e Prezzi",
        descTemplate: "Seleziona le colonne 'name' e 'price' dalla tabella Products.",
        queryTemplate: "SELECT name, price FROM Products",
        hints: ["Separa i nomi colonna con una virgola"],
        explanation: "Proiezione multipla.",
        replacements: {},
        brokenCode: "SELECT name price FROM Products",
        debugHint: "Manca la virgola tra le colonne."
      },
      {
        titleTemplate: "Categorie Prodotti",
        descTemplate: "Seleziona la colonna 'category' da Products.",
        queryTemplate: "SELECT category FROM Products",
        hints: ["Solo category"],
        explanation: "Lista categorie (con duplicati).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla il nome colonna."
      },
      {
        titleTemplate: "Date Ordini",
        descTemplate: "Seleziona 'order_date' da Orders.",
        queryTemplate: "SELECT order_date FROM Orders",
        hints: ["Colonna order_date"],
        explanation: "Timeline ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attento all'underscore in order_date."
      },
      {
        titleTemplate: "Stati Ordini",
        descTemplate: "Seleziona la colonna 'status' da Orders.",
        queryTemplate: "SELECT status FROM Orders",
        hints: ["Colonna status"],
        explanation: "Monitoraggio stati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT status..."
      },
      {
        titleTemplate: "Totali Ordini",
        descTemplate: "Seleziona 'order_total' da Orders.",
        queryTemplate: "SELECT order_total FROM Orders",
        hints: ["Colonna order_total"],
        explanation: "Analisi volumi vendite.",
        replacements: {},
        brokenCode: "...",
        debugHint: "order_total."
      },
      {
        titleTemplate: "Quantità Vendute",
        descTemplate: "Seleziona 'quantity' da OrderItems.",
        queryTemplate: "SELECT quantity FROM OrderItems",
        hints: ["Tabella OrderItems, colonna quantity"],
        explanation: "Volume fisico vendite.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT quantity."
      },
      {
        titleTemplate: "Prezzi Unitari",
        descTemplate: "Seleziona 'unit_price' da OrderItems.",
        queryTemplate: "SELECT unit_price FROM OrderItems",
        hints: ["Colonna unit_price"],
        explanation: "Prezzi storici di vendita.",
        replacements: {},
        brokenCode: "...",
        debugHint: "unit_price."
      },
      {
        titleTemplate: "Dipartimenti Staff",
        descTemplate: "Seleziona 'department' da Employees.",
        queryTemplate: "SELECT department FROM Employees",
        hints: ["Colonna department"],
        explanation: "Struttura aziendale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "department."
      },
      {
        titleTemplate: "Nomi Staff",
        descTemplate: "Seleziona 'name' da Employees.",
        queryTemplate: "SELECT name FROM Employees",
        hints: ["Colonna name"],
        explanation: "Rubrica dipendenti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT name."
      },
      {
        titleTemplate: "Utenti Premium?",
        descTemplate: "Seleziona 'name' e 'is_premium' da Users.",
        queryTemplate: "SELECT name, is_premium FROM Users",
        hints: ["Due colonne separate da virgola"],
        explanation: "Status abbonamento utenti.",
        replacements: {},
        brokenCode: "SELECT name is_premium FROM Users",
        debugHint: "Virgola mancante."
      },
      {
        titleTemplate: "Paesi Unici",
        descTemplate: "Seleziona i paesi distinti (senza duplicati) da Users.",
        queryTemplate: "SELECT DISTINCT country FROM Users",
        hints: ["Usa la parola chiave DISTINCT subito dopo SELECT"],
        explanation: "Eliminazione duplicati nel result set.",
        replacements: {},
        brokenCode: "SELECT UNIQ country FROM Users",
        debugHint: "La keyword è DISTINCT, non UNIQ."
      },
      {
        titleTemplate: "Categorie Uniche",
        descTemplate: "Seleziona le categorie distinte presenti in Products.",
        queryTemplate: "SELECT DISTINCT category FROM Products",
        hints: ["SELECT DISTINCT category ..."],
        explanation: "Lista pura delle categorie merceologiche.",
        replacements: {},
        brokenCode: "SELECT DISTINCT FROM category",
        debugHint: "DISTINCT va prima del nome colonna."
      },
      {
        titleTemplate: "Prezzo Scontato",
        descTemplate: "Seleziona il nome del prodotto e il prezzo dimezzato (price / 2).",
        queryTemplate: "SELECT name, price / 2 FROM Products",
        hints: ["Puoi fare operazioni matematiche dopo la virgola"],
        explanation: "Colonne calcolate al volo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa / 2."
      },
      {
        titleTemplate: "Prezzo con IVA",
        descTemplate: "Seleziona il nome e il prezzo aumentato del 22% (price * 1.22).",
        queryTemplate: "SELECT name, price * 1.22 FROM Products",
        hints: ["Moltiplica per 1.22"],
        explanation: "Calcolo imposte in proiezione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa * 1.22."
      },
      {
        titleTemplate: "Valore Stock",
        descTemplate: "Seleziona nome e valore totale stock (price * stock) da Products.",
        queryTemplate: "SELECT name, price * stock FROM Products",
        hints: ["Moltiplica due colonne tra loro"],
        explanation: "Operazioni tra colonne della stessa riga.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * stock."
      },
      {
        titleTemplate: "Valore Riga Ordine",
        descTemplate: "Seleziona quantity * unit_price da OrderItems.",
        queryTemplate: "SELECT quantity * unit_price FROM OrderItems",
        hints: ["Calcola il totale di riga"],
        explanation: "Calcolo importi parziali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "quantity * unit_price."
      },
      {
        titleTemplate: "Alias Semplice",
        descTemplate: "Seleziona name e rinominalo (AS) come 'Cliente'.",
        queryTemplate: "SELECT name AS Cliente FROM Users",
        hints: ["Usa la keyword AS dopo il nome colonna"],
        explanation: "Rinominare le colonne per leggibilità.",
        replacements: {},
        brokenCode: "SELECT name IS Cliente FROM Users",
        debugHint: "Usa AS, non IS."
      },
      {
        titleTemplate: "Alias Prodotto",
        descTemplate: "Seleziona name as 'Prodotto' e price as 'Euro' da Products.",
        queryTemplate: "SELECT name AS Prodotto, price AS Euro FROM Products",
        hints: ["Due alias distinti"],
        explanation: "Alias multipli.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AS Prodotto, ... AS Euro."
      },
      {
        titleTemplate: "Giorni Registrazione",
        descTemplate: "Seleziona created_at da Users.",
        queryTemplate: "SELECT created_at FROM Users",
        hints: ["Solo la data"],
        explanation: "Dati temporali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "created_at."
      },
      {
        titleTemplate: "Ruoli Staff",
        descTemplate: "Seleziona i dipartimenti distinti da Employees.",
        queryTemplate: "SELECT DISTINCT department FROM Employees",
        hints: ["Evita ripetizioni di dipartimenti"],
        explanation: "Lista univoca reparti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DISTINCT."
      },
      {
        titleTemplate: "Stati Ordine Unici",
        descTemplate: "Quali sono i possibili stati di un ordine? (Usa DISTINCT).",
        queryTemplate: "SELECT DISTINCT status FROM Orders",
        hints: ["SELECT DISTINCT status"],
        explanation: "Enumerazione stati workflow.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT status."
      },
      {
        titleTemplate: "Mix Colonne",
        descTemplate: "Seleziona id, user_id e status da Orders.",
        queryTemplate: "SELECT id, user_id, status FROM Orders",
        hints: ["Tre colonne separate da virgole"],
        explanation: "Proiezione specifica multi-colonna.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa le virgole."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Alias Nome",
        descTemplate: "Seleziona 'name' e rinominalo 'Utente' usando AS.",
        queryTemplate: "SELECT name AS Utente FROM Users",
        hints: ["Usa name AS Utente"],
        explanation: "L'alias rinomina la colonna nel risultato finale.",
        replacements: {},
        brokenCode: "SELECT name IS Utente FROM Users",
        debugHint: "Usa AS."
      },
      {
        titleTemplate: "Alias Prezzo",
        descTemplate: "Seleziona 'price' e rinominalo 'Costo_Unitario'.",
        queryTemplate: "SELECT price AS Costo_Unitario FROM Products",
        hints: ["price AS Costo_Unitario"],
        explanation: "Alias utile per report chiari.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AS Costo_Unitario."
      },
      {
        titleTemplate: "Due Alias",
        descTemplate: "Seleziona name come 'Piatto' e price come 'Prezzo'.",
        queryTemplate: "SELECT name AS Piatto, price AS Prezzo FROM Products",
        hints: ["Due alias separati da virgola"],
        explanation: "Rinomina più colonne contemporaneamente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa AS per entrambi."
      },
      {
        titleTemplate: "Alias con Spazi",
        descTemplate: "Seleziona 'name' rinominandola in 'Nome Completo' (usa le virgolette).",
        queryTemplate: "SELECT name AS 'Nome Completo' FROM Users",
        hints: ["Usa gli apici per alias con spazi"],
        explanation: "Gli alias con spazi richiedono quoting.",
        replacements: {},
        brokenCode: "SELECT name AS Nome Completo FROM Users",
        debugHint: "Mancano gli apici 'Nome Completo'."
      },
      {
        titleTemplate: "Calcolo Totale Riga",
        descTemplate: "Mostra il totale di riga (quantity * unit_price) chiamandolo 'Totale'.",
        queryTemplate: "SELECT quantity * unit_price AS Totale FROM OrderItems",
        hints: ["Fai il calcolo poi usa AS"],
        explanation: "Colonne calcolate con alias descrittivo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "quantity * unit_price AS Totale."
      },
      {
        titleTemplate: "Incremento Prezzo",
        descTemplate: "Simula un aumento di 5€ su ogni prodotto. Mostra il nuovo prezzo come 'NewPrice'.",
        queryTemplate: "SELECT price + 5 AS NewPrice FROM Products",
        hints: ["Addizione semplice"],
        explanation: "Operatori aritmetici in proiezione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price + 5."
      },
      {
        titleTemplate: "Sconto 50%",
        descTemplate: "Mostra il prezzo scontato del 50% come 'Promo'.",
        queryTemplate: "SELECT price * 0.5 AS Promo FROM Products",
        hints: ["Moltiplica per 0.5"],
        explanation: "Calcolo percentuale semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * 0.5."
      },
      {
        titleTemplate: "Distinct Stati",
        descTemplate: "Trova tutti gli stati unici degli ordini.",
        queryTemplate: "SELECT DISTINCT status FROM Orders",
        hints: ["Usa DISTINCT"],
        explanation: "Lista stati possibili.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT status."
      },
      {
        titleTemplate: "Distinct Country",
        descTemplate: "Trova i paesi unici di provenienza degli utenti.",
        queryTemplate: "SELECT DISTINCT country FROM Users",
        hints: ["DISTINCT country"],
        explanation: "Analisi geografica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT country."
      },
      {
        titleTemplate: "Distinct Category",
        descTemplate: "Elenca le categorie di prodotto senza duplicati.",
        queryTemplate: "SELECT DISTINCT category FROM Products",
        hints: ["Solo categorie uniche"],
        explanation: "Catalogo categorie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT category."
      },
      {
        titleTemplate: "Distinct Department",
        descTemplate: "Elenca i dipartimenti aziendali unici.",
        queryTemplate: "SELECT DISTINCT department FROM Employees",
        hints: ["DISTINCT department"],
        explanation: "Struttura org.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT department."
      },
      {
        titleTemplate: "Manager Unici",
        descTemplate: "Trova gli ID unici dei manager nella tabella Employees.",
        queryTemplate: "SELECT DISTINCT manager_id FROM Employees",
        hints: ["Attenzione ai null, ma DISTINCT li gestisce"],
        explanation: "Lista capi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT manager_id."
      },
      {
        titleTemplate: "Utenti Attivi (Ordini)",
        descTemplate: "Trova gli user_id unici che hanno fatto ordini.",
        queryTemplate: "SELECT DISTINCT user_id FROM Orders",
        hints: ["DISTINCT su user_id in Orders"],
        explanation: "Identificazione clienti paganti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT user_id."
      },
      {
        titleTemplate: "Prodotti Venduti",
        descTemplate: "Trova i product_id unici che sono stati venduti (in OrderItems).",
        queryTemplate: "SELECT DISTINCT product_id FROM OrderItems",
        hints: ["DISTINCT product_id"],
        explanation: "Analisi copertura catalogo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT product_id."
      },
      {
        titleTemplate: "Ordini Multi-Prodotto",
        descTemplate: "Trova gli order_id unici in OrderItems (dovrebbero essere tutti quelli con righe).",
        queryTemplate: "SELECT DISTINCT order_id FROM OrderItems",
        hints: ["DISTINCT order_id"],
        explanation: "Lista ordini con item.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT order_id."
      },
      {
        titleTemplate: "Valore Magazzino",
        descTemplate: "Calcola il valore totale per prodotto (price * stock) chiamandolo 'InventoryVal'.",
        queryTemplate: "SELECT price * stock AS InventoryVal FROM Products",
        hints: ["Moltiplicazione con alias"],
        explanation: "KPI di magazzino.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * stock AS ..."
      },
      {
        titleTemplate: "Stima Fatturato Anno",
        descTemplate: "Se ogni utente spendesse 100€, quanto incasseremmo? Calcola 100 per ogni riga (non aggregato).",
        queryTemplate: "SELECT 100 AS Potenziale FROM Users",
        hints: ["Seleziona una costante"],
        explanation: "Colonne costanti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT 100 ..."
      },
      {
        titleTemplate: "IVA Separata",
        descTemplate: "Mostra price, e l'importo dell'IVA (price * 0.22) come 'Solo_IVA'.",
        queryTemplate: "SELECT price, price * 0.22 AS Solo_IVA FROM Products",
        hints: ["Calcola solo il 22%"],
        explanation: "Scorporo IVA.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * 0.22."
      },
      {
        titleTemplate: "Sconto Quantità",
        descTemplate: "Se compri 10 pezzi, quanto costa? Mostra (price * 10) come 'Costo_10_Pezzi'.",
        queryTemplate: "SELECT price * 10 AS Costo_10_Pezzi FROM Products",
        hints: ["Moltiplica prezzo per 10"],
        explanation: "Preventivo rapido.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * 10."
      },
      {
        titleTemplate: "Margine",
        descTemplate: "Supponendo un costo del 60%, calcola il margine (price * 0.4) come 'Guadagno'.",
        queryTemplate: "SELECT price * 0.4 AS Guadagno FROM Products",
        hints: ["Il 40% del prezzo"],
        explanation: "Analisi marginalità.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * 0.4."
      },
      {
        titleTemplate: "Nome e Categoria",
        descTemplate: "Seleziona 'name' e 'category', rinominando category in 'Reparto'.",
        queryTemplate: "SELECT name, category AS Reparto FROM Products",
        hints: ["Solo il secondo ha l'alias"],
        explanation: "Mix colonne pure e alias.",
        replacements: {},
        brokenCode: "...",
        debugHint: "category AS Reparto."
      },
      {
        titleTemplate: "Alias Numerico",
        descTemplate: "Seleziona id rinominandolo 'Codice'.",
        queryTemplate: "SELECT id AS Codice FROM Users",
        hints: ["AS Codice"],
        explanation: "Standardizzazione nomi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AS Codice."
      },
      {
        titleTemplate: "Distinct Multiplo 1",
        descTemplate: "Seleziona combinazioni uniche di country e is_premium da Users.",
        queryTemplate: "SELECT DISTINCT country, is_premium FROM Users",
        hints: ["DISTINCT si applica a tutte le colonne elencate"],
        explanation: "Combinazioni uniche di valori.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT country, is_premium."
      },
      {
        titleTemplate: "Distinct Multiplo 2",
        descTemplate: "Seleziona combinazioni uniche di category e price da Products (per vedere se ci sono prodotti con stesso prezzo in stessa cat).",
        queryTemplate: "SELECT DISTINCT category, price FROM Products",
        hints: ["DISTINCT category, price"],
        explanation: "Analisi pricing per categoria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT category, price."
      },
      {
        titleTemplate: "Distinct Multiplo 3",
        descTemplate: "Seleziona combinazioni uniche di user_id e status da Orders.",
        queryTemplate: "SELECT DISTINCT user_id, status FROM Orders",
        hints: ["Chi ha avuto quali stati"],
        explanation: "Storia stati per utente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT user_id, status."
      },
      {
        titleTemplate: "Calcolo Complesso",
        descTemplate: "Calcola (quantity * unit_price) + 10 (spese spedizione fisse) AS 'Totale_Pieno'.",
        queryTemplate: "SELECT (quantity * unit_price) + 10 AS Totale_Pieno FROM OrderItems",
        hints: ["Usa le parentesi per chiarezza, poi + 10"],
        explanation: "Espressioni aritmetiche complesse.",
        replacements: {},
        brokenCode: "...",
        debugHint: "(...) + 10."
      },
      {
        titleTemplate: "Metà Prezzo",
        descTemplate: "Seleziona price / 2 AS 'HalfPrice' da Products.",
        queryTemplate: "SELECT price / 2 AS HalfPrice FROM Products",
        hints: ["Divisione"],
        explanation: "Operatore divisione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "/ 2."
      },
      {
        titleTemplate: "Prezzo Netto Immaginario",
        descTemplate: "Se price include IVA 22%, calcola il netto (price / 1.22) AS 'Netto'.",
        queryTemplate: "SELECT price / 1.22 AS Netto FROM Products",
        hints: ["Dividi per 1.22"],
        explanation: "Scorporo matematico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "/ 1.22."
      },
      {
        titleTemplate: "Proiezione Costante Stringa",
        descTemplate: "Seleziona name e una colonna fissa con valore 'Active' chiamata 'Status'.",
        queryTemplate: "SELECT name, 'Active' AS Status FROM Users",
        hints: ["Stringa fissa tra apici come colonna"],
        explanation: "Aggiungere colonne statiche al result set.",
        replacements: {},
        brokenCode: "...",
        debugHint: "'Active' AS Status."
      },
      {
        titleTemplate: "Proiezione Costante Numero",
        descTemplate: "Seleziona id e il numero 1 come 'Flag' da Orders.",
        queryTemplate: "SELECT id, 1 AS Flag FROM Orders",
        hints: ["Numero 1 come colonna"],
        explanation: "Flag statici.",
        replacements: {},
        brokenCode: "...",
        debugHint: "1 AS Flag."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Top 3 Utenti",
        descTemplate: "Seleziona i primi 3 utenti dalla tabella Users.",
        queryTemplate: "SELECT * FROM Users LIMIT 3",
        hints: ["Usa la clausola LIMIT"],
        explanation: "Limita il numero di righe restituite.",
        replacements: {},
        brokenCode: "SELECT TOP 3 * FROM Users",
        debugHint: "In questo dialetto SQL si usa LIMIT in fondo."
      },
      {
        titleTemplate: "Top 5 Prodotti",
        descTemplate: "Seleziona i primi 5 prodotti.",
        queryTemplate: "SELECT * FROM Products LIMIT 5",
        hints: ["LIMIT 5"],
        explanation: "Restituisce un sottoinsieme iniziale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 5."
      },
      {
        titleTemplate: "Singolo Ordine",
        descTemplate: "Seleziona solo 1 riga dalla tabella Orders.",
        queryTemplate: "SELECT * FROM Orders LIMIT 1",
        hints: ["LIMIT 1"],
        explanation: "Utile per vedere un campione di dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 1."
      },
      {
        titleTemplate: "Top 10 OrderItems",
        descTemplate: "Seleziona le prime 10 righe di OrderItems.",
        queryTemplate: "SELECT * FROM OrderItems LIMIT 10",
        hints: ["LIMIT 10"],
        explanation: "Paginazione semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 10."
      },
      {
        titleTemplate: "Due Dipendenti",
        descTemplate: "Seleziona solo 2 dipendenti.",
        queryTemplate: "SELECT * FROM Employees LIMIT 2",
        hints: ["LIMIT 2"],
        explanation: "Limitare il result set.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 2."
      },
      {
        titleTemplate: "Paginazione: Pagina 2",
        descTemplate: "Seleziona 5 utenti saltando i primi 5 (Offset).",
        queryTemplate: "SELECT * FROM Users LIMIT 5 OFFSET 5",
        hints: ["Usa LIMIT e OFFSET"],
        explanation: "Salto e limite combinati per paginazione.",
        replacements: {},
        brokenCode: "SELECT * FROM Users SKIP 5 LIMIT 5",
        debugHint: "Usa OFFSET, non SKIP."
      },
      {
        titleTemplate: "Salto Iniziale",
        descTemplate: "Seleziona 3 prodotti saltando il primo.",
        queryTemplate: "SELECT * FROM Products LIMIT 3 OFFSET 1",
        hints: ["LIMIT 3 OFFSET 1"],
        explanation: "Ignora la prima riga e prendi le successive.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 1."
      },
      {
        titleTemplate: "Offset Semplice",
        descTemplate: "Seleziona 1 ordine saltando i primi 10.",
        queryTemplate: "SELECT * FROM Orders LIMIT 1 OFFSET 10",
        hints: ["LIMIT 1 OFFSET 10"],
        explanation: "Accesso casuale posizionale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 10."
      },
      {
        titleTemplate: "Skip e Take",
        descTemplate: "Prendi 4 righe di OrderItems saltandone 2.",
        queryTemplate: "SELECT * FROM OrderItems LIMIT 4 OFFSET 2",
        hints: ["LIMIT 4 OFFSET 2"],
        explanation: "Paginazione custom.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 4 OFFSET 2."
      },
      {
        titleTemplate: "Consultazione",
        descTemplate: "Prendi 2 dipendenti saltando il primo.",
        queryTemplate: "SELECT * FROM Employees LIMIT 2 OFFSET 1",
        hints: ["LIMIT 2 OFFSET 1"],
        explanation: "Scorrimento dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 1."
      },
      {
        titleTemplate: "Proiezione Nulla",
        descTemplate: "Seleziona una colonna con valore NULL chiamata 'Nullo' da Users (limit 1).",
        queryTemplate: "SELECT NULL AS Nullo FROM Users LIMIT 1",
        hints: ["SELECT NULL ... LIMIT 1"],
        explanation: "Generazione di valori NULL espliciti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NULL AS Nullo."
      },
      {
        titleTemplate: "Verifica Esistenza",
        descTemplate: "Seleziona il valore 1 da Products LIMIT 1 (pattern 'select 1').",
        queryTemplate: "SELECT 1 FROM Products LIMIT 1",
        hints: ["SELECT 1 ..."],
        explanation: "Spesso usato per verificare se la tabella non è vuota.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT 1."
      },
      {
        titleTemplate: "Alias su Costante",
        descTemplate: "Seleziona 'Test' as T da Orders LIMIT 1.",
        queryTemplate: "SELECT 'Test' AS T FROM Orders LIMIT 1",
        hints: ["Stringa fissa con alias"],
        explanation: "Test di connettività/query.",
        replacements: {},
        brokenCode: "...",
        debugHint: "'Test' AS T."
      },
      {
        titleTemplate: "Math su Costanti",
        descTemplate: "Calcola 10 * 10 come 'Cento' selezionando da Users LIMIT 1.",
        queryTemplate: "SELECT 10 * 10 AS Cento FROM Users LIMIT 1",
        hints: ["Operazione matematica pura"],
        explanation: "SQL come calcolatrice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "10 * 10."
      },
      {
        titleTemplate: "Colonna + Alias + Limit",
        descTemplate: "Seleziona name AS N dalla tabella Users, solo i primi 2.",
        queryTemplate: "SELECT name AS N FROM Users LIMIT 2",
        hints: ["Combina Alias e Limit"],
        explanation: "Feature combinate.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AS N ... LIMIT 2."
      },
      {
        titleTemplate: "Distinct con Limit",
        descTemplate: "Seleziona i primi 3 paesi unici (DISTINCT country) da Users.",
        queryTemplate: "SELECT DISTINCT country FROM Users LIMIT 3",
        hints: ["Prima DISTINCT poi LIMIT applica il limite ai risultati unici"],
        explanation: "Interazione tra DISTINCT e LIMIT.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT ... LIMIT 3."
      },
      {
        titleTemplate: "Limit Grande",
        descTemplate: "Seleziona name da Products LIMIT 100 (anche se ce ne sono meno).",
        queryTemplate: "SELECT name FROM Products LIMIT 100",
        hints: ["LIMIT 100"],
        explanation: "Il LIMIT non fallisce se le righe sono meno.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 100."
      },
      {
        titleTemplate: "Offset Grande",
        descTemplate: "Seleziona * da Users OFFSET 100 (probabilmente vuoto).",
        queryTemplate: "SELECT * FROM Users LIMIT 10 OFFSET 100",
        hints: ["OFFSET molto alto"],
        explanation: "Restituisce zero righe se l'offset supera il count.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 100."
      },
      {
        titleTemplate: "Ultimo (Simulato)",
        descTemplate: "Seleziona tutto da Orders LIMIT 1 OFFSET 4 (Simula prendere il 5° elemento).",
        queryTemplate: "SELECT * FROM Orders LIMIT 1 OFFSET 4",
        hints: ["Prende esattamente la 5a riga"],
        explanation: "Accesso diretto all'n-esima riga.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 1 OFFSET 4."
      },
      {
        titleTemplate: "Calcolo Iva e Limit",
        descTemplate: "Mostra name e prezzo+iva per i primi 3 prodotti.",
        queryTemplate: "SELECT name, price * 1.22 AS Ivato FROM Products LIMIT 3",
        hints: ["Calcolo in select, limit alla fine"],
        explanation: "Report parziale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 3."
      },
      {
        titleTemplate: "Stringa Vuota",
        descTemplate: "Seleziona una stringa vuota '' come 'Empty' da Users LIMIT 1.",
        queryTemplate: "SELECT '' AS Empty FROM Users LIMIT 1",
        hints: ["Due apici singoli ''"],
        explanation: "Stringhe vuote vs NULL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "'' AS Empty."
      },
      {
        titleTemplate: "Booleano",
        descTemplate: "Seleziona true come 'Vero' da Users LIMIT 1.",
        queryTemplate: "SELECT true AS Vero FROM Users LIMIT 1",
        hints: ["Valore booleano true"],
        explanation: "Tipi di dato letterali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "true AS Vero."
      },
      {
        titleTemplate: "Falso",
        descTemplate: "Seleziona false come 'Falso' da Users LIMIT 1.",
        queryTemplate: "SELECT false AS Falso FROM Users LIMIT 1",
        hints: ["Valore false"],
        explanation: "Letterali booleani.",
        replacements: {},
        brokenCode: "...",
        debugHint: "false."
      },
      {
        titleTemplate: "Zero",
        descTemplate: "Seleziona 0 come 'Zero' da Users LIMIT 1.",
        queryTemplate: "SELECT 0 AS Zero FROM Users LIMIT 1",
        hints: ["Numero 0"],
        explanation: "Costanti numeriche.",
        replacements: {},
        brokenCode: "...",
        debugHint: "0 AS Zero."
      },
      {
        titleTemplate: "Limit senza Offset",
        descTemplate: "È equivalente a OFFSET 0. Seleziona * da Orders LIMIT 2 OFFSET 0.",
        queryTemplate: "SELECT * FROM Orders LIMIT 2 OFFSET 0",
        hints: ["Esplicita OFFSET 0"],
        explanation: "Offset implicito esplicitato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 0."
      },
      {
        titleTemplate: "Moltiplicazione Colonne Limitata",
        descTemplate: "Seleziona quantity * unit_price da OrderItems LIMIT 5.",
        queryTemplate: "SELECT quantity * unit_price FROM OrderItems LIMIT 5",
        hints: ["Calcolo e Limit"],
        explanation: "Analisi campione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 5."
      },
      {
        titleTemplate: "Paginazione Avanzata",
        descTemplate: "Seleziona 3 utenti partita dalla riga 3 (OFFSET 2).",
        queryTemplate: "SELECT * FROM Users LIMIT 3 OFFSET 2",
        hints: ["Ricorda che OFFSET è 0-based o 1-based? (In SQL standard offset N salta N righe)"],
        explanation: "Salta 2, prendi 3.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 2."
      },
      {
        titleTemplate: "Solo Nomi Distinct",
        descTemplate: "Primi 3 nomi unici da Users.",
        queryTemplate: "SELECT DISTINCT name FROM Users LIMIT 3",
        hints: ["DISTINCT e LIMIT"],
        explanation: "Campione di nomi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT DISTINCT ... LIMIT 3."
      },
      {
        titleTemplate: "Solo Categorie Distinct",
        descTemplate: "Prime 2 categorie uniche da Products.",
        queryTemplate: "SELECT DISTINCT category FROM Products LIMIT 2",
        hints: ["DISTINCT category ... LIMIT 2"],
        explanation: "Campione categorie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 2."
      },
      {
        titleTemplate: "Select All Limitata",
        descTemplate: "Seleziona tutto da Employees LIMIT 1.",
        queryTemplate: "SELECT * FROM Employees LIMIT 1",
        hints: ["Ultima verifica semplice"],
        explanation: "Single row fetch.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 1."
      }
    ],
  },
  [TopicId.Filtering]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Utenti Italiani",
        descTemplate: "Seleziona gli utenti che vivono in 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Usa WHERE country = 'Italy'"],
        explanation: "Filtro esatto su stringa.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Usa = invece di IS."
      },
      {
        titleTemplate: "Ordini Spediti",
        descTemplate: "Seleziona gli ordini con status 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["status = 'Shipped'"],
        explanation: "Filtro su stato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "status = 'Shipped'."
      },
      {
        titleTemplate: "Prodotti Costosi",
        descTemplate: "Seleziona i prodotti con prezzo superiore a 100.",
        queryTemplate: "SELECT * FROM Products WHERE price > 100",
        hints: ["Usa il simbolo maggiore >"],
        explanation: "Filtro numerico maggiore.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price BIGGER 100",
        debugHint: "Usa >."
      },
      {
        titleTemplate: "Prodotti Economici",
        descTemplate: "Seleziona i prodotti con prezzo inferiore a 20.",
        queryTemplate: "SELECT * FROM Products WHERE price < 20",
        hints: ["Usa il simbolo minore <"],
        explanation: "Filtro numerico minore.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price < 20."
      },
      {
        titleTemplate: "Quantità Esatta",
        descTemplate: "Seleziona le righe di OrderItems con quantity uguale a 1.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity = 1",
        hints: ["quantity = 1"],
        explanation: "Uguaglianza numerica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "quantity = 1."
      },
      {
        titleTemplate: "Utenti Premium",
        descTemplate: "Seleziona gli utenti con is_premium = true (o 1).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = 1",
        hints: ["is_premium = 1 oppure true"],
        explanation: "Filtro booleano.",
        replacements: {},
        brokenCode: "...",
        debugHint: "is_premium = 1."
      },
      {
        titleTemplate: "Dipendenti IT",
        descTemplate: "Seleziona i dipendenti del dipartimento 'IT'.",
        queryTemplate: "SELECT * FROM Employees WHERE department = 'IT'",
        hints: ["department = 'IT'"],
        explanation: "Filtro dipartimento.",
        replacements: {},
        brokenCode: "...",
        debugHint: "department = 'IT'."
      },
      {
        titleTemplate: "Categoria Elettronica",
        descTemplate: "Seleziona i prodotti della categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["category = 'Electronics'"],
        explanation: "Filtro categoria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "category = 'Electronics'."
      },
      {
        titleTemplate: "Ordini di un Utente",
        descTemplate: "Seleziona gli ordini dell'utente con id 5.",
        queryTemplate: "SELECT * FROM Orders WHERE user_id = 5",
        hints: ["user_id = 5"],
        explanation: "Filtro per chiave esterna.",
        replacements: {},
        brokenCode: "...",
        debugHint: "user_id = 5."
      },
      {
        titleTemplate: "Prezzo Esatto",
        descTemplate: "Seleziona i prodotti che costano esattamente 50.",
        queryTemplate: "SELECT * FROM Products WHERE price = 50",
        hints: ["price = 50"],
        explanation: "Equality check.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price = 50."
      },
      {
        titleTemplate: "Stock Basso",
        descTemplate: "Seleziona prodotti con stock inferiore o uguale a 10.",
        queryTemplate: "SELECT * FROM Products WHERE stock <= 10",
        hints: ["Usa <="],
        explanation: "Minore o uguale.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock =< 10",
        debugHint: "L'operatore è <=."
      },
      {
        titleTemplate: "Ordini Recenti (ID)",
        descTemplate: "Seleziona ordini con id maggiore di 50.",
        queryTemplate: "SELECT * FROM Orders WHERE id > 50",
        hints: ["id > 50"],
        explanation: "Filtro su chiave primaria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "id > 50."
      },
      {
        titleTemplate: "Utenti Non Premium",
        descTemplate: "Seleziona utenti con is_premium = 0 (false).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = 0",
        hints: ["is_premium = 0"],
        explanation: "Filtro booleano negativo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "is_premium = 0."
      },
      {
        titleTemplate: "Utenti USA",
        descTemplate: "Seleziona utenti che vivono in 'USA'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'USA'",
        hints: ["country = 'USA'"],
        explanation: "Altro filtro stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "country = 'USA'."
      },
      {
        titleTemplate: "Ordini Pending",
        descTemplate: "Seleziona ordini con status 'Pending'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Pending'",
        hints: ["status = 'Pending'"],
        explanation: "Filtro stato inattivo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "status = 'Pending'."
      },
      {
        titleTemplate: "Dipartimento HR",
        descTemplate: "Seleziona dipendenti di 'HR'.",
        queryTemplate: "SELECT * FROM Employees WHERE department = 'HR'",
        hints: ["department = 'HR'"],
        explanation: "Filtro reparto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "department = 'HR'."
      },
      {
        titleTemplate: "Alta Quantità",
        descTemplate: "Righe ordine con quantity >= 5.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity >= 5",
        hints: ["Maggiore o uguale >="],
        explanation: "Quantità significative.",
        replacements: {},
        brokenCode: "...",
        debugHint: "quantity >= 5."
      },
      {
        titleTemplate: "Prezzo Minimo",
        descTemplate: "Prodotti con prezzo >= 10.",
        queryTemplate: "SELECT * FROM Products WHERE price >= 10",
        hints: ["price >= 10"],
        explanation: "Soglia minima.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price >= 10."
      },
      {
        titleTemplate: "Prodotti Diversi da X",
        descTemplate: "Seleziona prodotti che NON hanno categoria 'Toys'.",
        queryTemplate: "SELECT * FROM Products WHERE category <> 'Toys'",
        hints: ["Usa <> oppure != per diverso"],
        explanation: "Disuguaglianza.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category NOT 'Toys'",
        debugHint: "Usa <> o !=."
      },
      {
        titleTemplate: "Ordini non Spediti",
        descTemplate: "Seleziona ordini con status diverso da 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status != 'Shipped'",
        hints: ["status != 'Shipped'"],
        explanation: "Esclusione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "!= 'Shipped'."
      },
      {
        titleTemplate: "Prodotto Specifico",
        descTemplate: "Trova il prodotto con nome 'Laptop'.",
        queryTemplate: "SELECT * FROM Products WHERE name = 'Laptop'",
        hints: ["name = 'Laptop'"],
        explanation: "Ricerca esatta nome.",
        replacements: {},
        brokenCode: "...",
        debugHint: "name = 'Laptop'."
      },
      {
        titleTemplate: "Utente Specifico",
        descTemplate: "Trova l'utente con email 'mario@example.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email = 'mario@example.com'",
        hints: ["Filtro su email"],
        explanation: "Lookup utente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "email = '...'."
      },
      {
        titleTemplate: "Data Specifica",
        descTemplate: "Seleziona ordini del '2023-01-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date = '2023-01-01'",
        hints: ["Le date vanno tra apici come le stringhe"],
        explanation: "Filtro data esatta.",
        replacements: {},
        brokenCode: "...",
        debugHint: "order_date = '2023-01-01'."
      },
      {
        titleTemplate: "Dopo una Data",
        descTemplate: "Ordini successivi al '2023-01-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date > '2023-01-01'",
        hints: ["Usa > con la data stringa"],
        explanation: "Filtro temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "order_date > '...'."
      },
      {
        titleTemplate: "Prima di una Data",
        descTemplate: "Ordini precedenti al '2023-06-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date < '2023-06-01'",
        hints: ["Usa <"],
        explanation: "Storico ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "order_date < '...'."
      },
      {
        titleTemplate: "Assunzioni Recenti",
        descTemplate: "Dipendenti assunti dopo il '2022-01-01'.",
        queryTemplate: "SELECT * FROM Employees WHERE hire_date > '2022-01-01'",
        hints: ["hire_date > ..."],
        explanation: "Nuovi assunti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "hire_date > '...'."
      },
      {
        titleTemplate: "Ordini Grandi",
        descTemplate: "OrderItems con quantity > 10.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity > 10",
        hints: ["quantity > 10"],
        explanation: "Ordini all'ingrosso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "quantity > 10."
      },
      {
        titleTemplate: "Prodotti Stock Zero",
        descTemplate: "Prodotti con stock = 0.",
        queryTemplate: "SELECT * FROM Products WHERE stock = 0",
        hints: ["stock = 0"],
        explanation: "Prodotti esauriti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "stock = 0."
      },
      {
        titleTemplate: "Categoria Casa",
        descTemplate: "Prodotti category = 'Home'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Home'",
        hints: ["category = 'Home'"],
        explanation: "Reparto casa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "category = 'Home'."
      },
      {
        titleTemplate: "Utenti Francia",
        descTemplate: "Utenti country = 'France'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'France'",
        hints: ["country = 'France'"],
        explanation: "Clienti francesi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "country = 'France'."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "AND Logico",
        descTemplate: "Utenti in 'Italy' e con id > 5.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy' AND id > 5",
        hints: ["Usa l'operatore AND"],
        explanation: "Entrambe le condizioni devono essere vere.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country = 'Italy' OR id > 5",
        debugHint: "Usa AND per richiedere entrambe le condizioni."
      },
      {
        titleTemplate: "OR Logico",
        descTemplate: "Prodotti con prezzo < 10 oppure category = 'Toys'.",
        queryTemplate: "SELECT * FROM Products WHERE price < 10 OR category = 'Toys'",
        hints: ["Usa l'operatore OR"],
        explanation: "Basta che una delle condizioni sia vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price < 10 AND category = 'Toys'",
        debugHint: "Usa OR."
      },
      {
        titleTemplate: "IN List (Numeri)",
        descTemplate: "Ordini con id 1, 3 o 5.",
        queryTemplate: "SELECT * FROM Orders WHERE id IN (1, 3, 5)",
        hints: ["Usa IN (...)"],
        explanation: "Lista di valori possibili.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE id = (1, 3, 5)",
        debugHint: "Usa IN."
      },
      {
        titleTemplate: "IN List (Stringhe)",
        descTemplate: "Utenti in 'Italy' o 'France'.",
        queryTemplate: "SELECT * FROM Users WHERE country IN ('Italy', 'France')",
        hints: ["Usa IN ('...', '...')"],
        explanation: "Lista di stringhe.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IN 'Italy', 'France'",
        debugHint: "Parentesi tonde obbligatorie."
      },
      {
        titleTemplate: "Between Numerico",
        descTemplate: "Prodotti con prezzo tra 10 e 50 (inclusi).",
        queryTemplate: "SELECT * FROM Products WHERE price BETWEEN 10 AND 50",
        hints: ["Usa BETWEEN ... AND ..."],
        explanation: "Intervallo inclusivo.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price IN 10 TO 50",
        debugHint: "Usa BETWEEN X AND Y."
      },
      {
        titleTemplate: "Between Date",
        descTemplate: "Ordini fatti nel 2023 (tra 2023-01-01 e 2023-12-31).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31'",
        hints: ["BETWEEN con date formato stringa"],
        explanation: "Intervallo temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "BETWEEN '...' AND '...'"
      },
      {
        titleTemplate: "IS NULL",
        descTemplate: "Utenti senza email (email è NULL).",
        queryTemplate: "SELECT * FROM Users WHERE email IS NULL",
        hints: ["Usa IS NULL"],
        explanation: "Controllo assenza di valore.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE email = NULL",
        debugHint: "Non usare = NULL, usa IS NULL."
      },
      {
        titleTemplate: "IS NOT NULL",
        descTemplate: "Utenti con email valorizzata.",
        queryTemplate: "SELECT * FROM Users WHERE email IS NOT NULL",
        hints: ["Usa IS NOT NULL"],
        explanation: "Esclude i valori nulli.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE email != NULL",
        debugHint: "Non usare != NULL, usa IS NOT NULL."
      },
      {
        titleTemplate: "NOT Like",
        descTemplate: "Utenti la cui email NON finisce con '.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email NOT LIKE '%.com'",
        hints: ["NOT LIKE"],
        explanation: "Pattern matching negativo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT LIKE."
      },
      {
        titleTemplate: "Filtro Combinato 1",
        descTemplate: "Prodotti 'Electronics' con stock > 0.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics' AND stock > 0",
        hints: ["AND tra due condizioni"],
        explanation: "Filtro su categoria e disponibilità.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND."
      },
      {
        titleTemplate: "Filtro Combinato 2",
        descTemplate: "Prodotti 'Toys' oppure con prezzo < 5.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Toys' OR price < 5",
        hints: ["OR logico"],
        explanation: "Condizione disgiunta.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OR."
      },
      {
        titleTemplate: "Like Iniziale",
        descTemplate: "Utenti il cui nome inizia per 'A'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE 'A%'",
        hints: ["LIKE 'A%'"],
        explanation: "Prefix match.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE name = 'A%'",
        debugHint: "Usa LIKE per i pattern."
      },
      {
        titleTemplate: "Like Finale",
        descTemplate: "Utenti il cui nome finisce per 'o'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE '%o'",
        hints: ["LIKE '%o'"],
        explanation: "Suffix match.",
        replacements: {},
        brokenCode: "...",
        debugHint: "%o."
      },
      {
        titleTemplate: "Like Contiene",
        descTemplate: "Utenti il cui nome contiene 'ar'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE '%ar%'",
        hints: ["'%ar%'"],
        explanation: "Substring match.",
        replacements: {},
        brokenCode: "...",
        debugHint: "%ar%."
      },
      {
        titleTemplate: "Underscore Wildcard",
        descTemplate: "Utenti con nome di 4 lettere che inizia per 'M' (M___).",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE 'M___'",
        hints: ["3 underscore per 3 caratteri qualsiasi"],
        explanation: "Wildcard a singolo carattere.",
        replacements: {},
        brokenCode: "...",
        debugHint: "M___"
      },
      {
        titleTemplate: "NOT IN (Numeri)",
        descTemplate: "Prodotti con id NON in (1, 2).",
        queryTemplate: "SELECT * FROM Products WHERE id NOT IN (1, 2)",
        hints: ["NOT IN (...)"],
        explanation: "Esclusione da lista.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "NOT BETWEEN",
        descTemplate: "Prodotti con prezzo NON tra 20 e 100.",
        queryTemplate: "SELECT * FROM Products WHERE price NOT BETWEEN 20 AND 100",
        hints: ["NOT BETWEEN x AND y"],
        explanation: "Esclusione intervallo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT BETWEEN."
      },
      {
        titleTemplate: "Priorità AND/OR 1",
        descTemplate: "Prodotti (Electronics OR Computers) AND price > 500.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Electronics' OR category = 'Computers') AND price > 500",
        hints: ["Usa le parentesi per l'OR"],
        explanation: "Controllo precedenza operatori.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Electronics' OR category = 'Computers' AND price > 500",
        debugHint: "Senza parentesi l'AND vince sull'OR."
      },
      {
        titleTemplate: "Filtro Data Complesso",
        descTemplate: "Ordini spediti dopo il 2023-01-01.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped' AND order_date > '2023-01-01'",
        hints: ["AND tra stato e data"],
        explanation: "Filtro storico spedizioni.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND."
      },
      {
        titleTemplate: "Dipendenti Sales/HR",
        descTemplate: "Dipendenti in reparto 'Sales' o 'HR'.",
        queryTemplate: "SELECT * FROM Employees WHERE department IN ('Sales', 'HR')",
        hints: ["Usa IN per brevità"],
        explanation: "IN è più conciso di OR multipli.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IN ('Sales', 'HR')."
      },
      {
        titleTemplate: "Utenti Gmail",
        descTemplate: "Utenti con email che finisce in '@gmail.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail.com'",
        hints: ["LIKE '%@...'"],
        explanation: "Filtro dominio email.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE."
      },
      {
        titleTemplate: "Prodotti Stock Critico",
        descTemplate: "Prodotti con stock < 5 AND stock > 0.",
        queryTemplate: "SELECT * FROM Products WHERE stock < 5 AND stock > 0",
        hints: ["AND per intervallo aperto"],
        explanation: "Pochi pezzi rimasti ma non zero.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND."
      },
      {
        titleTemplate: "Utente Senza Paese",
        descTemplate: "Utenti dove country è NULL.",
        queryTemplate: "SELECT * FROM Users WHERE country IS NULL",
        hints: ["IS NULL"],
        explanation: "Dati mancanti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IS NULL."
      },
      {
        titleTemplate: "Ordini Recenti Non Spediti",
        descTemplate: "Ordini > '2023-01-01' ma non 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date > '2023-01-01' AND status != 'Shipped'",
        hints: ["AND ... !="],
        explanation: "Backlog recente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND status != ..."
      },
      {
        titleTemplate: "Esclusione Categorie",
        descTemplate: "Prodotti non Toys e non Books.",
        queryTemplate: "SELECT * FROM Products WHERE category NOT IN ('Toys', 'Books')",
        hints: ["NOT IN"],
        explanation: "Blacklist categorie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN (...)."
      },
      {
        titleTemplate: "Like Case",
        descTemplate: "Utenti con nome che inizia per 'm' (con Like è solitamente case-insensitive in SQLite ma standard SQL chiede 'M%'). Qui usiamo 'M%'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE 'M%'",
        hints: ["LIKE 'M%'"],
        explanation: "In molti DB LIKE è Case-Insensitive, ma sii specifico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE 'M%'."
      },
      {
        titleTemplate: "Range Date Escluso",
        descTemplate: "Ordini prima del 2022 o dopo il 2023.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date < '2022-01-01' OR order_date > '2023-12-31'",
        hints: ["OR per intervalli esterni"],
        explanation: "Intervallo esterno.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OR."
      },
      {
        titleTemplate: "Filtro Boolean False",
        descTemplate: "Utenti non premium e attivi (supponiamo active=1).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = 0 AND active = 1",
        hints: ["AND tra booleani"],
        explanation: "Segmentazione utenza.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND."
      },
      {
        titleTemplate: "Prezzo o Stock",
        descTemplate: "Prodotti che costano > 100 oppure hanno stock < 10.",
        queryTemplate: "SELECT * FROM Products WHERE price > 100 OR stock < 10",
        hints: ["OR su metriche diverse"],
        explanation: "Criteri misti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OR."
      },
      {
        titleTemplate: "Filtro Completo",
        descTemplate: "Utenti italiani, premium, con email.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy' AND is_premium = 1 AND email IS NOT NULL",
        hints: ["Tre condizioni in AND"],
        explanation: "Filtro stretto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Tutti AND."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Logica Complessa (A o B) e C",
        descTemplate: "Prodotti che sono (Electronics o Computers) e costano > 500.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Electronics' OR category = 'Computers') AND price > 500",
        hints: ["Usa le parentesi: (cat1 OR cat2) AND price"],
        explanation: "Controllo preciso delle precedenze.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Electronics' OR category = 'Computers' AND price > 500",
        debugHint: "Mancano le parentesi per l'OR."
      },
      {
        titleTemplate: "Esclusione Complessa",
        descTemplate: "Utenti che NON sono (di 'Italy' o 'France').",
        queryTemplate: "SELECT * FROM Users WHERE NOT (country = 'Italy' OR country = 'France')",
        hints: ["NOT (A OR B)"],
        explanation: "De Morgan: equivale a NOT A AND NOT B.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country != 'Italy' OR 'France'",
        debugHint: "Usa NOT (condizione OR condizione)."
      },
      {
        titleTemplate: "Ordini senza Tracking",
        descTemplate: "Ordini spediti ma senza tracking number (supponiamo colonne ipotetiche o logicamente deducibili: status='Shipped' e tracking IS NULL).",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped' AND id NOT IN (SELECT id FROM Orders WHERE status = 'Pending')",
        hints: ["Simuliamo: id NOT IN (...)"],
        explanation: "Subquery filter.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la subquery."
      },
      {
        titleTemplate: "Utenti con Ordini",
        descTemplate: "Seleziona utenti che hanno fatto almeno un ordine.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["id IN (SELECT user_id ...)"],
        explanation: "Filtro basato su esistenza record correlati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IN (SELECT ...)."
      },
      {
        titleTemplate: "Utenti Inattivi",
        descTemplate: "Utenti che NON hanno fatto ordini.",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders)",
        hints: ["NOT IN (SELECT ...)"],
        explanation: "Esclusione basata su relazioni.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "Prodotti Venduti",
        descTemplate: "Prodotti presenti in almeno un OrderItem.",
        queryTemplate: "SELECT * FROM Products WHERE id IN (SELECT product_id FROM OrderItems)",
        hints: ["id IN (SELECT product_id ...)"],
        explanation: "Prodotti movimentati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IN (SELECT ...)."
      },
      {
        titleTemplate: "Prodotti Invenduti",
        descTemplate: "Prodotti mai venduti.",
        queryTemplate: "SELECT * FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems)",
        hints: ["NOT IN (SELECT ...)"],
        explanation: "Prodotti fermi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "Like Case Insensitive Esplicito",
        descTemplate: "Trova 'mario' ignorando maiuscole/minuscole (usando LOWER).",
        queryTemplate: "SELECT * FROM Users WHERE LOWER(name) = 'mario'",
        hints: ["LOWER(name) = '...'"],
        explanation: "Normalizzazione stringhe.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LOWER(name)."
      },
      {
        titleTemplate: "Anno Corrente",
        descTemplate: "Ordini dell'anno 2023 (usando LIKE sulla data stringa).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date LIKE '2023%'",
        hints: ["LIKE '2023%'"],
        explanation: "Filtro data come stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE '2023%'."
      },
      {
        titleTemplate: "Mese Specifico",
        descTemplate: "Ordini di Maggio di qualsiasi anno (LIKE '%-05-%').",
        queryTemplate: "SELECT * FROM Orders WHERE order_date LIKE '%-05-%'",
        hints: ["LIKE '%-05-%'"],
        explanation: "Pattern matching interno data.",
        replacements: {},
        brokenCode: "...",
        debugHint: "'%-05-%'."
      },
      {
        titleTemplate: "Prezzo Scontato",
        descTemplate: "Prodotti dove il prezzo scontato del 10% è ancora > 100.",
        queryTemplate: "SELECT * FROM Products WHERE price * 0.9 > 100",
        hints: ["Calcolo a sinistra dell'operatore"],
        explanation: "Filtro su espressione calcolata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "price * 0.9 > 100."
      },
      {
        titleTemplate: "Lunghezza Nome",
        descTemplate: "Utenti con nome più lungo di 5 caratteri.",
        queryTemplate: "SELECT * FROM Users WHERE LENGTH(name) > 5",
        hints: ["LENGTH(name)"],
        explanation: "Filtro su lunghezza stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LENGTH."
      },
      {
        titleTemplate: "Stock Dispari",
        descTemplate: "Prodotti con quantità di stock dispari (modulo 2).",
        queryTemplate: "SELECT * FROM Products WHERE stock % 2 <> 0",
        hints: ["stock % 2 <> 0 oppure != 0"],
        explanation: "Operatore modulo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "% 2."
      },
      {
        titleTemplate: "Coalesce Search",
        descTemplate: "Trova utenti dove country è NULL ma supponiamo 'Unknown' e cerca 'Unknown'. (Demo tecnica).",
        queryTemplate: "SELECT * FROM Users WHERE COALESCE(country, 'Unknown') = 'Unknown'",
        hints: ["COALESCE(country, 'Unknown')"],
        explanation: "Gestione NULL value al volo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COALESCE."
      },
      {
        titleTemplate: " Doppia Negazione",
        descTemplate: "Prodotti NON (category 'Toys' AND price < 10).",
        queryTemplate: "SELECT * FROM Products WHERE NOT (category = 'Toys' AND price < 10)",
        hints: ["NOT (A AND B)"],
        explanation: "Equivale a category != 'Toys' OR price >= 10.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT ( ... )."
      },
      {
        titleTemplate: "Range con OR multipli",
        descTemplate: "Prodotti con ID 1-5 oppure 10-15.",
        queryTemplate: "SELECT * FROM Products WHERE (id BETWEEN 1 AND 5) OR (id BETWEEN 10 AND 15)",
        hints: ["(A) OR (B)"],
        explanation: "Intervalli disgiunti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "BETWEEN ... OR ..."
      },
      {
        titleTemplate: "Email Dominio Complesso",
        descTemplate: "Utenti con email che contiene 'corp' ma non finisce con '.net'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%corp%' AND email NOT LIKE '%.net'",
        hints: ["LIKE AND NOT LIKE"],
        explanation: "Pattern inclusion/exclusion.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE ... AND ... NOT LIKE."
      },
      {
        titleTemplate: "Filtro Totale Ordine",
        descTemplate: "OrderItems dove (quantity * unit_price) > 50.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity * unit_price > 50",
        hints: ["Moltiplicazione nella WHERE"],
        explanation: "Filtro su valore derivato riga per riga.",
        replacements: {},
        brokenCode: "...",
        debugHint: "* > 50."
      },
      {
        titleTemplate: "Subquery Max Price",
        descTemplate: "Prodotti che costano più della media (simulata con subquery statica o semplice).",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["price > (SELECT AVG(price)...)"],
        explanation: "Confronto con aggregato globale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT AVG(price)."
      },
      {
        titleTemplate: "Utenti Stesso Paese Primo Utente",
        descTemplate: "Utenti che vivono nello stesso paese dell'utente con id 1.",
        queryTemplate: "SELECT * FROM Users WHERE country = (SELECT country FROM Users WHERE id = 1)",
        hints: ["= (SELECT country ...)"],
        explanation: "Confronto dinamico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery che ritorna un scalare."
      },
      {
        titleTemplate: "Prodotti Categoria Popolare",
        descTemplate: "Prodotti nella categoria del prodotto id 10.",
        queryTemplate: "SELECT * FROM Products WHERE category = (SELECT category FROM Products WHERE id = 10)",
        hints: ["= (SELECT category ...)"],
        explanation: "Self-lookup category.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery."
      },
      {
        titleTemplate: "Ordini Stesso Giorno",
        descTemplate: "Ordini fatti lo stesso giorno dell'ordine 1.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date = (SELECT order_date FROM Orders WHERE id = 1)",
        hints: ["= (SELECT order_date ...)"],
        explanation: "Date matching dinamico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery."
      },
      {
        titleTemplate: "Esclusione Multipla ID",
        descTemplate: "Tutti gli utenti tranne id 1, 2 e 3 (usando NOT IN).",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (1, 2, 3)",
        hints: ["NOT IN (1, 2, 3)"],
        explanation: "Lista nera.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "Prezzo non nullo",
        descTemplate: "Prodotti con prezzo specificato (NOT NULL) e maggiore di 0.",
        queryTemplate: "SELECT * FROM Products WHERE price IS NOT NULL AND price > 0",
        hints: ["AND"],
        explanation: "Data integrity check.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IS NOT NULL."
      },
      {
        titleTemplate: "Like Wildcard Interna",
        descTemplate: "Utenti con 'a' come seconda lettera del nome.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE '_a%'",
        hints: ["_a%"],
        explanation: "Underscore match posizionale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "_a%."
      },
      {
        titleTemplate: "Ordinamento Logico Inverso",
        descTemplate: "Utenti che NON (sono Premium AND (country = 'Italy' OR country = 'France')).",
        queryTemplate: "SELECT * FROM Users WHERE NOT (is_premium = 1 AND (country = 'Italy' OR country = 'France'))",
        hints: ["NOT (A AND (B OR C))"],
        explanation: "Logica annidata complessa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attenzione alle parentesi."
      },
      {
        titleTemplate: "Subquery EXISTS",
        descTemplate: "Utenti per cui ESISTE almeno un ordine (EXISTS).",
        queryTemplate: "SELECT * FROM Users u WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        hints: ["EXISTS (SELECT 1 ...)"],
        explanation: "Correlazione semantica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "EXISTS."
      },
      {
        titleTemplate: "Subquery NOT EXISTS",
        descTemplate: "Utenti per cui NON ESISTE alcun ordine.",
        queryTemplate: "SELECT * FROM Users u WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        hints: ["NOT EXISTS (...)"],
        explanation: "Anti-join pattern.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT EXISTS."
      },
      {
        titleTemplate: "Ultimo giorno mese (approx)",
        descTemplate: "Ordini fatti il giorno 31 (LIKE '%-31').",
        queryTemplate: "SELECT * FROM Orders WHERE order_date LIKE '%-31'",
        hints: ["LIKE finale"],
        explanation: "Estrazione giorno stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE."
      },
      {
        titleTemplate: "Filtro Avanzato Finale",
        descTemplate: "Prodotti 'Tech' con stock > 100 oppure 'Old' con stock < 5.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Tech' AND stock > 100) OR (category = 'Old' AND stock < 5)",
        hints: ["(A AND B) OR (C AND D)"],
        explanation: "Regole di business complesse.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Parentesi separate dall'OR."
      }
    ],
  },
  [TopicId.Sorting]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Ordina Users name",
        descTemplate: "Ordina utenti per nome (A-Z).",
        queryTemplate: "SELECT * FROM Users ORDER BY name ASC",
        hints: ["Usa ORDER BY name ASC"],
        explanation: "Ordinamento alfabetico standard.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY name",
        debugHint: "Specifica ASC per chiarezza (anche se default)."
      },
      {
        titleTemplate: "Ordina Users name DESC",
        descTemplate: "Ordina utenti per nome decrescente (Z-A).",
        queryTemplate: "SELECT * FROM Users ORDER BY name DESC",
        hints: ["Usa ORDER BY name DESC"],
        explanation: "Ordinamento inverso.",
        replacements: {},
        brokenCode: "SELECT * FROM Users SORT BY name DESC",
        debugHint: "SORT BY non esiste, usa ORDER BY."
      },
      {
        titleTemplate: "Ordina Users email",
        descTemplate: "Ordina utenti per email crescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY email ASC",
        hints: ["Usa ORDER BY email"],
        explanation: "Ordina stringhe.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY email."
      },
      {
        titleTemplate: "Ordina Users email DESC",
        descTemplate: "Ordina utenti per email decrescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY email DESC",
        hints: ["Usa ORDER BY email DESC"],
        explanation: "Ordina stringhe inverso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Aggiungi DESC."
      },
      {
        titleTemplate: "Ordina Products name",
        descTemplate: "Ordina prodotti per nome.",
        queryTemplate: "SELECT * FROM Products ORDER BY name ASC",
        hints: ["Usa ORDER BY name"],
        explanation: "A-Z prodotti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Sintassi base ORDER BY."
      },
      {
        titleTemplate: "Ordina Products name DESC",
        descTemplate: "Ordina prodotti per nome inverso.",
        queryTemplate: "SELECT * FROM Products ORDER BY name DESC",
        hints: ["Usa ORDER BY name DESC"],
        explanation: "Z-A prodotti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DESC."
      },
      {
        titleTemplate: "Ordina Products category",
        descTemplate: "Raggruppa visivamente prodotti per categoria (A-Z).",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC",
        hints: ["Ordina per category"],
        explanation: "Utile per vedere categorie vicine.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY category."
      },
      {
        titleTemplate: "Ordina Products category DESC",
        descTemplate: "Ordina categorie Z-A.",
        queryTemplate: "SELECT * FROM Products ORDER BY category DESC",
        hints: ["ORDER BY category DESC"],
        explanation: "Utile per vedere categorie vicine.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Non scordare DESC."
      },
      {
        titleTemplate: "Ordina Orders id",
        descTemplate: "Ordina ordini per ID (cronologico inserimento).",
        queryTemplate: "SELECT * FROM Orders ORDER BY id ASC",
        hints: ["ORDER BY id"],
        explanation: "Ordine di default spesso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa colonna id."
      },
      {
        titleTemplate: "Ordina Orders id DESC",
        descTemplate: "Ordina ordini dal più recente (ID alto).",
        queryTemplate: "SELECT * FROM Orders ORDER BY id DESC",
        hints: ["ORDER BY id DESC"],
        explanation: "Comune per vedere ultimi inseriti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DESC."
      },
      {
        titleTemplate: "Ordina Orders user_id",
        descTemplate: "Ordina ordini per ID utente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY user_id ASC",
        hints: ["ORDER BY user_id"],
        explanation: "Raggruppa ordini dello stesso user.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la colonna."
      },
      {
        titleTemplate: "Ordina Orders user_id DESC",
        descTemplate: "Ordina ordini per ID utente decrescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY user_id DESC",
        hints: ["ORDER BY user_id DESC"],
        explanation: "Inverso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DESC."
      },
      {
        titleTemplate: "Ordina OrderItems id",
        descTemplate: "Ordina righe ordine per ID.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY id ASC",
        hints: ["ORDER BY id"],
        explanation: "Base.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Sintassi."
      },
      {
        titleTemplate: "Ordina OrderItems id DESC",
        descTemplate: "Ordina righe ordine ID decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY id DESC",
        hints: ["ORDER BY id DESC"],
        explanation: "Base invertita.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Sintassi."
      },
      {
        titleTemplate: "Ordina OrderItems order_id",
        descTemplate: "Ordina righe per ID ordine di appartenenza.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY order_id ASC",
        hints: ["ORDER BY order_id"],
        explanation: "Vedi righe dello stesso ordine vicine.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Check column name."
      },
      {
        titleTemplate: "Ordina OrderItems order_id DESC",
        descTemplate: "Ordina righe per ID ordine decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY order_id DESC",
        hints: ["ORDER BY order_id DESC"],
        explanation: "Inverso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Employees name",
        descTemplate: "Elenco dipendenti alfabetico.",
        queryTemplate: "SELECT * FROM Employees ORDER BY name ASC",
        hints: ["ORDER BY name"],
        explanation: "Directory style.",
        replacements: {},
        brokenCode: "...",
        debugHint: "name column."
      },
      {
        titleTemplate: "Ordina Employees name DESC",
        descTemplate: "Elenco dipendenti Z-A.",
        queryTemplate: "SELECT * FROM Employees ORDER BY name DESC",
        hints: ["ORDER BY name DESC"],
        explanation: "Reverse directory.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Employees department",
        descTemplate: "Raggruppa dipendenti per dipartimento (A-Z).",
        queryTemplate: "SELECT * FROM Employees ORDER BY department ASC",
        hints: ["ORDER BY department"],
        explanation: "Org chart view.",
        replacements: {},
        brokenCode: "...",
        debugHint: "department column."
      },
      {
        titleTemplate: "Ordina Employees department DESC",
        descTemplate: "Ordina dipendenti per dipartimento Z-A.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department DESC",
        hints: ["ORDER BY department DESC"],
        explanation: "Org chart reverse.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Products price",
        descTemplate: "Ordina prodotti dal più economico.",
        queryTemplate: "SELECT * FROM Products ORDER BY price ASC",
        hints: ["ORDER BY price ASC"],
        explanation: "Prezzo crescente.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY cost",
        debugHint: "Colonna è price."
      },
      {
        titleTemplate: "Ordina Products price DESC",
        descTemplate: "Ordina prodotti dal più costoso.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC",
        hints: ["ORDER BY price DESC"],
        explanation: "Prezzo decrescente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DESC su price."
      },
      {
        titleTemplate: "Ordina Products stock",
        descTemplate: "Ordina prodotti per quantità in magazzino (pochi prima).",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC",
        hints: ["ORDER BY stock"],
        explanation: "Inventory check.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Colonna stock."
      },
      {
        titleTemplate: "Ordina Products stock DESC",
        descTemplate: "Ordina prodotti per quantità in magazzino (tanti prima).",
        queryTemplate: "SELECT * FROM Products ORDER BY stock DESC",
        hints: ["ORDER BY stock DESC"],
        explanation: "Most available items.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Users joined",
        descTemplate: "Ordina utenti per data iscrizione (vecchi prima).",
        queryTemplate: "SELECT * FROM Users ORDER BY created_at ASC",
        hints: ["Colonna created_at"],
        explanation: "Cronologico Users.",
        replacements: {},
        brokenCode: "ORDER BY date",
        debugHint: "Colonna created_at."
      },
      {
        titleTemplate: "Ordina Users joined DESC",
        descTemplate: "Ordina utenti per nuovi iscritti.",
        queryTemplate: "SELECT * FROM Users ORDER BY created_at DESC",
        hints: ["ORDER BY created_at DESC"],
        explanation: "Newest Users.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC su created_at."
      },
      {
        titleTemplate: "Ordina Orders total",
        descTemplate: "Ordina ordini per importo (piccoli prima).",
        queryTemplate: "SELECT * FROM Orders ORDER BY total_amount ASC",
        hints: ["ORDER BY total_amount"],
        explanation: "Smallest orders.",
        replacements: {},
        brokenCode: "ORDER BY amount",
        debugHint: "Colonna total_amount."
      },
      {
        titleTemplate: "Ordina Orders total DESC",
        descTemplate: "Ordina ordini per importo (grandi prima).",
        queryTemplate: "SELECT * FROM Orders ORDER BY total_amount DESC",
        hints: ["ORDER BY total_amount DESC"],
        explanation: "Big ticket orders.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Items qty",
        descTemplate: "Ordina righe ordine per quantità.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY quantity ASC",
        hints: ["ORDER BY quantity"],
        explanation: "Small quantities.",
        replacements: {},
        brokenCode: "...",
        debugHint: "quantity."
      },
      {
        titleTemplate: "Ordina Items qty DESC",
        descTemplate: "Ordina righe ordine per quantità decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY quantity DESC",
        hints: ["ORDER BY quantity DESC"],
        explanation: "Bulk items.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Ordina per Paese e Nome",
        descTemplate: "Ordina utenti per paese (A-Z) e poi per nome (A-Z).",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name ASC",
        hints: ["ORDER BY country, name"],
        explanation: "Ordinamento a più livelli.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY country AND name",
        debugHint: "Usa la virgola per separare le colonne."
      },
      {
        titleTemplate: "Ordina Categoria e Prezzo",
        descTemplate: "Ordina prodotti per categoria e poi per prezzo decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC, price DESC",
        hints: ["ORDER BY category, price DESC"],
        explanation: "Raggruppa e ordina internamente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "La virgola separa i criteri."
      },
      {
        titleTemplate: "Ordina Data e Stato",
        descTemplate: "Ordina ordini per data decrescente e poi per stato.",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date DESC, status ASC",
        hints: ["ORDER BY order_date DESC, status"],
        explanation: "Cronologico inverso con raggruppamento stato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC sulla data."
      },
      {
        titleTemplate: "Ordina Ruolo e Nome",
        descTemplate: "Ordina dipendenti per ruolo e poi per nome.",
        queryTemplate: "SELECT * FROM Employees ORDER BY role ASC, name ASC",
        hints: ["ORDER BY role, name"],
        explanation: "Multi-column sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Virgola."
      },
      {
        titleTemplate: "Ordina Stock e ID",
        descTemplate: "Ordina prodotti per stock e a parità di stock per ID.",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC, id ASC",
        hints: ["ORDER BY stock, id"],
        explanation: "Ordinamento stabile deterministico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Stock, id."
      },
      {
        titleTemplate: "Ordina Prezzo Totale",
        descTemplate: "Ordina per valore calcolato: quantity * unit_price.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY quantity * unit_price DESC",
        hints: ["ORDER BY quantity * unit_price DESC"],
        explanation: "Ordinamento su espressione.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER BY total",
        debugHint: "Devi ripetere l'espressione o usare alias se supportato."
      },
      {
        titleTemplate: "Ordina Lunghezza Nome",
        descTemplate: "Ordina utenti per lunghezza del nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY LENGTH(name) ASC",
        hints: ["ORDER BY LENGTH(name)"],
        explanation: "Funzione scalare in ORDER BY.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LENGTH."
      },
      {
        titleTemplate: "Ordina Anno Nascita",
        descTemplate: "Ordina dipendenti per anno di assunzione (estratto dalla data).",
        queryTemplate: "SELECT * FROM Employees ORDER BY STRFTIME('%Y', hire_date) ASC",
        hints: ["STRFTIME('%Y', hire_date)"],
        explanation: "Ordinamento su parte di data.",
        replacements: {},
        brokenCode: "...",
        debugHint: "STRFTIME."
      },
      {
        titleTemplate: "Ordina Casuale (Random)",
        descTemplate: "Ordina casualmente (RANDOM()).",
        queryTemplate: "SELECT * FROM Products ORDER BY RANDOM()",
        hints: ["ORDER BY RANDOM()"],
        explanation: "Shuffle.",
        replacements: {},
        brokenCode: "...",
        debugHint: "RANDOM()."
      },
      {
        titleTemplate: "Ordina Alias",
        descTemplate: "Seleziona prezzo * stock come 'valore' e ordina per 'valore'.",
        queryTemplate: "SELECT *, price * stock as valore FROM Products ORDER BY valore DESC",
        hints: ["Usa l'alias 'valore' in ORDER BY"],
        explanation: "Riferimento ad alias.",
        replacements: {},
        brokenCode: "...",
        debugHint: "valore DESC."
      },
      {
        titleTemplate: "Ordina Misto ASC/DESC",
        descTemplate: "Ordina per Department DESC e poi Name ASC.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department DESC, name ASC",
        hints: ["department DESC, name ASC"],
        explanation: "Direzioni miste.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC primo, ASC secondo."
      },
      {
        titleTemplate: "Ordina 3 Colonne",
        descTemplate: "Ordina per Paese, Città (se ci fosse, usiamo regione o altro) e Nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, id ASC, name ASC",
        hints: ["3 campi separati da virgola"],
        explanation: "Ordinamento profondo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Virgole."
      },
      {
        titleTemplate: "Nulls First (Simulato)",
        descTemplate: "Ordina Email in modo che i NULL vengano prima (usando CASE o sintassi standard se supportata: solitamente NULLS FIRST/LAST è standard, ma in SQLite NULLs vengono prima di default in ASC). Forza ordinamento: CASE WHEN email IS NULL THEN 0 ELSE 1 END.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN email IS NULL THEN 0 ELSE 1 END, email ASC",
        hints: ["CASE WHEN email IS NULL ..."],
        explanation: "Controllo posizionamento NULL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE WHEN."
      },
      {
        titleTemplate: "Nulls Last (Simulato)",
        descTemplate: "Ordina Email in modo che i NULL vengano dopo.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN email IS NULL THEN 1 ELSE 0 END, email ASC",
        hints: ["CASE WHEN ... IS NULL THEN 1"],
        explanation: "Sposta NULL in fondo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE WHEN."
      },
      {
        titleTemplate: "Ordina per Giorno della Settimana",
        descTemplate: "Ordina ordini per giorno della settimana (strftime %w).",
        queryTemplate: "SELECT * FROM Orders ORDER BY STRFTIME('%w', order_date) ASC",
        hints: ["STRFTIME('%w', ...)"],
        explanation: "0 = Domenica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "STRFTIME."
      },
      {
        titleTemplate: "Ordina per Mese",
        descTemplate: "Ordina per mese dell'ordine.",
        queryTemplate: "SELECT * FROM Orders ORDER BY STRFTIME('%m', order_date) ASC",
        hints: ["STRFTIME('%m', ...)"],
        explanation: "Gennaio = 01.",
        replacements: {},
        brokenCode: "...",
        debugHint: "STRFTIME."
      },
      {
        titleTemplate: "Ordina ID inverso",
        descTemplate: "Ordina Users per ID decrescente (ultimi iscritti in cima, se ID autoincrement).",
        queryTemplate: "SELECT * FROM Users ORDER BY id DESC",
        hints: ["ORDER BY id DESC"],
        explanation: "Proxy per data creazione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Case Insensitive",
        descTemplate: "Ordina per nome ignorando maiuscole (LOWER(name)).",
        queryTemplate: "SELECT * FROM Users ORDER BY LOWER(name) ASC",
        hints: ["ORDER BY LOWER(name)"],
        explanation: "Case-insensitive sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LOWER."
      },
      {
        titleTemplate: "Ordina Boolean",
        descTemplate: "Ordina: prima i Premium (1), poi i normali (0).",
        queryTemplate: "SELECT * FROM Users ORDER BY is_premium DESC, name ASC",
        hints: ["is_premium DESC mette 1 prima di 0"],
        explanation: "Ordinamento booleano.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC su booleano."
      },
      {
        titleTemplate: "Ordina Stock Critico",
        descTemplate: "Ordina prodotti: prima quelli con stock < 5, poi gli altri.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock < 5 THEN 0 ELSE 1 END, stock ASC",
        hints: ["CASE WHEN stock < 5 ..."],
        explanation: "Ordinamento prioritario condizionale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE logic."
      },
      {
        titleTemplate: "Ordina Prezzo Arrotondato",
        descTemplate: "Ordina per prezzo arrotondato all'intero (ROUND(price)).",
        queryTemplate: "SELECT * FROM Products ORDER BY ROUND(price) ASC",
        hints: ["ROUND(price)"],
        explanation: "Raggruppa prezzi simili.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ROUND."
      },
      {
        titleTemplate: "Ordina per Dominio Email",
        descTemplate: "Ordina utenti basandosi sul dominio dell'email (substr dopo @).",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(email, INSTR(email, '@') + 1) ASC",
        hints: ["SUBSTR e INSTR"],
        explanation: "Ordinamento su sottostringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "String manipulation."
      },
      {
        titleTemplate: "Ordina Recenti Top Price",
        descTemplate: "Ordini recenti per primi, e a parità di data quelli con importo più alto.",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date DESC, total_amount DESC",
        hints: ["Due DESC"],
        explanation: "Nuovi e costosi in cima.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC, DESC."
      },
      {
        titleTemplate: "Ordina Alfabetico Inverso",
        descTemplate: "Categorie prodotti Z-A, poi prezzo crescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY category DESC, price ASC",
        hints: ["category DESC, price ASC"],
        explanation: "Mixed logic.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC, ASC."
      },
      {
        titleTemplate: "Ordina per ID Prodotto",
        descTemplate: "Ordina OrderItems per id prodotto crescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY product_id ASC",
        hints: ["product_id"],
        explanation: "Raggruppa item dello stesso prodotto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "product_id."
      },
      {
        titleTemplate: "Sort by Modulo",
        descTemplate: "Ordina per ID pari prima, poi dispari (id % 2).",
        queryTemplate: "SELECT * FROM Users ORDER BY id % 2 ASC, id ASC",
        hints: ["id % 2"],
        explanation: "Even numbers (0) then Odd (1).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Mod 2."
      },
      {
        titleTemplate: "Ordina per Lunghezza Email inv",
        descTemplate: "Email più lunghe per prime.",
        queryTemplate: "SELECT * FROM Users ORDER BY LENGTH(email) DESC",
        hints: ["LENGTH(email) DESC"],
        explanation: "Size sorting.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LENGTH."
      },
      {
        titleTemplate: "Ordina Multiplo Dipendenti",
        descTemplate: "Department ASC, Role ASC, Name ASC.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department ASC, role ASC, name ASC",
        hints: ["Tre colonne"],
        explanation: "Gerarchia completa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Virgola separatrice."
      },
      {
        titleTemplate: "Ordina Prodotti Ipotetico",
        descTemplate: "Ordina per (stock + 10) DESC.",
        queryTemplate: "SELECT * FROM Products ORDER BY (stock + 10) DESC",
        hints: ["Espressione matematica"],
        explanation: "Shifted value.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Parentesi opzionali ma chiare."
      },
      {
        titleTemplate: "Ordina Solo Prezzo",
        descTemplate: "Ordina solamente per prezzo (senza secondaria), verifica stabilità (potrebbe variare).",
        queryTemplate: "SELECT * FROM Products ORDER BY price ASC",
        hints: ["price ASC"],
        explanation: "Basic sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Price."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Ordina per Disponibilità Pseudo-Bool",
        descTemplate: "Ordina prodotti: quelli disponibili (stock > 0) per primi, poi gli esuariti. A parità di disponibilità, per nome.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END, name ASC",
        hints: ["CASE WHEN stock > 0 THEN 0 ELSE 1 END"],
        explanation: "Logica custom di priorità.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY stock",
        debugHint: "Usa CASE."
      },
      {
        titleTemplate: "Ordina per Lunghezza Nome Decrescente",
        descTemplate: "Utenti con nomi più lunghi in cima.",
        queryTemplate: "SELECT * FROM Users ORDER BY LENGTH(name) DESC",
        hints: ["LENGTH(name) DESC"],
        explanation: "Ordinamento su metrica stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LENGTH."
      },
      {
        titleTemplate: "Ordina per Anno e Mese",
        descTemplate: "Ordina ordini per anno decrescente, poi mese crescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY STRFTIME('%Y', order_date) DESC, STRFTIME('%m', order_date) ASC",
        hints: ["Due STRFTIME"],
        explanation: "Date part sorting.",
        replacements: {},
        brokenCode: "...",
        debugHint: "STRFTIME."
      },
      {
        titleTemplate: "Ordina per Somma Subquery (Simulata)",
        descTemplate: "Seleziona utenti e ordinali per ID (in realtà in SQL avanzato ordineremmo per totale speso, qui usiamo ID come proxy di complessità o facciamo una join implicita se possibile, ma restiamo su singola tabella con logica complessa). Ordina users per ID ma ID 1 per ultimo.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN id = 1 THEN 1 ELSE 0 END, id ASC",
        hints: ["Sposta ID 1 in fondo con CASE"],
        explanation: "Eccezioni nell'ordinamento.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE WHEN id = 1."
      },
      {
        titleTemplate: "Ordina Prodotti Scontati",
        descTemplate: "Ordina prodotti: prima quelli con prezzo < 50, poi tra 50 e 100, poi > 100.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN price < 50 THEN 1 WHEN price <= 100 THEN 2 ELSE 3 END, price ASC",
        hints: ["CASE multilinge"],
        explanation: "Fasce di prezzo custom.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE WHEN ... THEN ... WHEN ..."
      },
      {
        titleTemplate: "Ordina per Dominio (Senza www)",
        descTemplate: "Ordina utenti per email, ignorando 'www.' se presente (su email è raro ma utile come esercizio stringa). Usiamo REPLACE.",
        queryTemplate: "SELECT * FROM Users ORDER BY REPLACE(email, 'www.', '') ASC",
        hints: ["REPLACE(email, ...)"],
        explanation: "Sorting su dato pulito.",
        replacements: {},
        brokenCode: "...",
        debugHint: "REPLACE."
      },
      {
        titleTemplate: "Ordina Case Sensitive (Binary)",
        descTemplate: "Ordina nomi in modo case-sensitive (se il DB lo supporta, altrimenti standard). In SQLite 'ORDER BY name' è solitamente case-insensitive se collation è NOCASE, altrimenti Binary.",
        queryTemplate: "SELECT * FROM Users ORDER BY name COLLATE BINARY ASC",
        hints: ["COLLATE BINARY"],
        explanation: "Forza confronto binario.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COLLATE."
      },
      {
        titleTemplate: "Ordina Random Seeded (Simulato)",
        descTemplate: "Ordina random (RANDOM()).",
        queryTemplate: "SELECT * FROM Products ORDER BY RANDOM()",
        hints: ["Usa RANDOM()"],
        explanation: "Non deterministico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "RANDOM."
      },
      {
        titleTemplate: "Ordina Coalesce",
        descTemplate: "Ordina per telefono, se null usa email.",
        queryTemplate: "SELECT * FROM Users ORDER BY COALESCE(phone_number, email) ASC",
        hints: ["COALESCE(phone, email)"],
        explanation: "Fallback sorting.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COALESCE."
      },
      {
        titleTemplate: "Ordina Ultima Lettera",
        descTemplate: "Ordina nomi basandoti sull'ultima lettera.",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(name, -1) ASC",
        hints: ["SUBSTR(name, -1)"],
        explanation: "Reverse string logic.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUBSTR negativo."
      },
      {
        titleTemplate: "Ordina Escludendo Prefisso",
        descTemplate: "Ordina prodotti ignorando le prime 3 lettere del nome.",
        queryTemplate: "SELECT * FROM Products ORDER BY SUBSTR(name, 4) ASC",
        hints: ["SUBSTR(name, 4)"],
        explanation: "Skip prefix.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUBSTR."
      },
      {
        titleTemplate: "Ordina Priorità Reparto",
        descTemplate: "HR prima, poi Sales, poi IT, poi altri.",
        queryTemplate: "SELECT * FROM Employees ORDER BY CASE department WHEN 'HR' THEN 1 WHEN 'Sales' THEN 2 WHEN 'IT' THEN 3 ELSE 4 END",
        hints: ["CASE department WHEN ..."],
        explanation: "Mapping esplicito valori.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE WHEN."
      },
      {
        titleTemplate: "Ordina Valore Assoluto (Simulato)",
        descTemplate: "Ordina per variazione di stock da 10 (ABS(stock - 10)).",
        queryTemplate: "SELECT * FROM Products ORDER BY ABS(stock - 10) ASC",
        hints: ["ABS(...)"],
        explanation: "Distanza da un valore.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ABS."
      },
      {
        titleTemplate: "Ordina Concatenazione",
        descTemplate: "Ordina per 'Cognome Nome' (assumendo name sia 'Nome Cognome', facciamo sort su name intero per semplicità ma unito a ID).",
        queryTemplate: "SELECT * FROM Users ORDER BY name || id ASC",
        hints: ["|| per concatenare"],
        explanation: "Concatenazione chiavi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "||."
      },
      {
        titleTemplate: "Ordina NULL in mezzo (Simulato)",
        descTemplate: "Metti i NULL di email dopo la 'M'.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN email IS NULL THEN 'M_NULL' ELSE email END ASC",
        hints: ["CASE che trasforma NULL in stringa"],
        explanation: "Injection logica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE ELSE."
      },
      {
        titleTemplate: "Ordina Multiplo Inverso",
        descTemplate: "Ordina Stock ASC, ma se stock uguale, Price DESC.",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC, price DESC",
        hints: ["stock ASC, price DESC"],
        explanation: "Standard multi-column.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Virgola."
      },
      {
        titleTemplate: "Ordina Solo Pari",
        descTemplate: "Ordina mettendo ID pari prima degli dispari, poi per ID.",
        queryTemplate: "SELECT * FROM Users ORDER BY id % 2 ASC, id ASC",
        hints: ["Modulo 2"],
        explanation: "Parity sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "%."
      },
      {
        titleTemplate: "Ordina Prezzo Scontato vs Pieno",
        descTemplate: "Ordina per il minore tra prezzo e un prezzo fisso 50 (MIN simulato con CASE).",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN price < 50 THEN price ELSE 50 END ASC",
        hints: ["CASE per 'min' o 'clamping'"],
        explanation: "Logic sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE."
      },
      {
        titleTemplate: "Ordina Data + 7gg",
        descTemplate: "Ordina per data ordine posticipata di 7 giorni (DATE(order_date, '+7 days')).",
        queryTemplate: "SELECT * FROM Orders ORDER BY DATE(order_date, '+7 days') DESC",
        hints: ["DATE(..., '+7 days')"],
        explanation: "Date math sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DATE function."
      },
      {
        titleTemplate: "Ordina Booleano Complesso",
        descTemplate: "Ordina prima i Premium italiani, poi gli altri.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN is_premium = 1 AND country = 'Italy' THEN 0 ELSE 1 END ASC",
        hints: ["CASE WHEN condition THEN 0"],
        explanation: "Complex priority group.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE."
      },
      {
        titleTemplate: "Ordina Lunghezza Desc",
        descTemplate: "Prodotti con descrizione (se esistesse) o nome più corto prima.",
        queryTemplate: "SELECT * FROM Products ORDER BY LENGTH(name) ASC",
        hints: ["LENGTH(name) ASC"],
        explanation: "Shortest name first.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LENGTH."
      },
      {
        titleTemplate: "Ordina Round Price",
        descTemplate: "Ordina per prezzo arrotondato, poi stock.",
        queryTemplate: "SELECT * FROM Products ORDER BY ROUND(price), stock DESC",
        hints: ["ROUND(price)"],
        explanation: "Grouping by price range implicitly.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ROUND."
      },
      {
        titleTemplate: "Ordina Alternato",
        descTemplate: "Ordina alfabeticamente ma 'Z' prima di 'A' (DESC).",
        queryTemplate: "SELECT * FROM Users ORDER BY name DESC",
        hints: ["DESC"],
        explanation: "Ripasso Hard: Z-A.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Due Date",
        descTemplate: "Ordina per created_at (users) - non ha senso in join qui. Ordina Employees per hire_date.",
        queryTemplate: "SELECT * FROM Employees ORDER BY hire_date DESC",
        hints: ["hire_date DESC"],
        explanation: "Junior first.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DESC."
      },
      {
        titleTemplate: "Ordina Substr e Length",
        descTemplate: "Ordina per prima lettera e poi lunghezza.",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(name, 1, 1) ASC, LENGTH(name) DESC",
        hints: ["Prima lettera, poi lunghezza"],
        explanation: "Advanced grouping.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUBSTR."
      },
      {
        titleTemplate: "Ordina Cast",
        descTemplate: "Ordina zipcode come intero (supponendo sia stringa). CAST(zip_code AS INTEGER).",
        queryTemplate: "SELECT * FROM Users ORDER BY CAST(zip_code AS INTEGER) ASC",
        hints: ["CAST(... AS INTEGER)"],
        explanation: "Numeric sort of strings.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CAST."
      },
      {
        titleTemplate: "Ordina Nulls Last Trick",
        descTemplate: "Ordina ID, ma i NULL (impossibile su PK) facciamo su manager_id NULLS LAST.",
        queryTemplate: "SELECT * FROM Employees ORDER BY CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END, manager_id ASC",
        hints: ["CASE per NULLS LAST"],
        explanation: "Standard pattern.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE."
      },
      {
        titleTemplate: "Ordina Bitwise (Simulato)",
        descTemplate: "Ordina id & 1 (dispari vs pari) DESC.",
        queryTemplate: "SELECT * FROM Users ORDER BY (id & 1) DESC, id ASC",
        hints: ["Operatore bitwise &"],
        explanation: "Bit manipulation.",
        replacements: {},
        brokenCode: "...",
        debugHint: "& 1."
      },
      {
        titleTemplate: "Ordina Parametrico",
        descTemplate: "Demo tecnica: ordinamento fisso ma complesso.",
        queryTemplate: "SELECT * FROM Products ORDER BY price * stock / 100 DESC",
        hints: ["Espressione complessa"],
        explanation: "KPI sort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Formula."
      },
      {
        titleTemplate: "Ordina Finale",
        descTemplate: "Ordina per (stock - id) ASC.",
        queryTemplate: "SELECT * FROM Products ORDER BY (stock - id) ASC",
        hints: ["Differenza"],
        explanation: "Nonsense metric but valid SQL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Math."
      }
    ],
  },
  [TopicId.Aggregation]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Conta Utenti Totali",
        descTemplate: "Calcola il numero totale di utenti registrati.",
        queryTemplate: "SELECT COUNT(*) FROM Users",
        hints: ["Usa COUNT(*)"],
        explanation: "Conta tutte le righe della tabella.",
        replacements: {},
        brokenCode: "SELECT COUNT FROM Users",
        debugHint: "Mancano le parentesi."
      },
      {
        titleTemplate: "Conta Prodotti",
        descTemplate: "Quanti prodotti ci sono nel catalogo?",
        queryTemplate: "SELECT COUNT(*) FROM Products",
        hints: ["COUNT(*) su Products"],
        explanation: "Numero totale record.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(*)."
      },
      {
        titleTemplate: "Conta Ordini",
        descTemplate: "Calcola il numero totale di ordini effettuati.",
        queryTemplate: "SELECT COUNT(*) FROM Orders",
        hints: ["COUNT(*) su Orders"],
        explanation: "Totale ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(*)."
      },
      {
        titleTemplate: "Conta Dipendenti",
        descTemplate: "Quanti dipendenti lavorano in azienda?",
        queryTemplate: "SELECT COUNT(*) FROM Employees",
        hints: ["COUNT(*) su Employees"],
        explanation: "Totale staff.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(*)."
      },
      {
        titleTemplate: "Somma Prezzi Prodotti",
        descTemplate: "Calcola la somma dei prezzi di tutti i prodotti (valore inventario teorico unitario).",
        queryTemplate: "SELECT SUM(price) FROM Products",
        hints: ["SUM(price)"],
        explanation: "Somma algebrica colonna.",
        replacements: {},
        brokenCode: "SELECT TOTAL(price) FROM Products",
        debugHint: "Usa SUM."
      },
      {
        titleTemplate: "Totale Valore Ordini",
        descTemplate: "Qual è il fatturato totale (somma total_amount)?",
        queryTemplate: "SELECT SUM(total_amount) FROM Orders",
        hints: ["SUM(total_amount)"],
        explanation: "Somma incassi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM."
      },
      {
        titleTemplate: "Stock In Magazzino",
        descTemplate: "Calcola la quantità totale di articoli in magazzino (somma stock).",
        queryTemplate: "SELECT SUM(stock) FROM Products",
        hints: ["SUM(stock)"],
        explanation: "Totale pezzi fisici.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM stock."
      },
      {
        titleTemplate: "Media Prezzo Prodotti",
        descTemplate: "Qual è il prezzo medio dei prodotti?",
        queryTemplate: "SELECT AVG(price) FROM Products",
        hints: ["AVG(price)"],
        explanation: "Valore medio.",
        replacements: {},
        brokenCode: "SELECT AVERAGE(price) FROM Products",
        debugHint: "Usa AVG, non AVERAGE."
      },
      {
        titleTemplate: "Media Ordine",
        descTemplate: "Qual è l'importo medio di un ordine?",
        queryTemplate: "SELECT AVG(total_amount) FROM Orders",
        hints: ["AVG(total_amount)"],
        explanation: "Scontrino medio.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AVG."
      },
      {
        titleTemplate: "Prezzo Minimo",
        descTemplate: "Trova il prezzo più basso nel catalogo.",
        queryTemplate: "SELECT MIN(price) FROM Products",
        hints: ["MIN(price)"],
        explanation: "Valore minimo.",
        replacements: {},
        brokenCode: "SELECT LOWEST(price)...",
        debugHint: "Usa MIN."
      },
      {
        titleTemplate: "Prezzo Massimo",
        descTemplate: "Trova il prezzo più alto nel catalogo.",
        queryTemplate: "SELECT MAX(price) FROM Products",
        hints: ["MAX(price)"],
        explanation: "Valore massimo.",
        replacements: {},
        brokenCode: "SELECT HIGHEST(price)...",
        debugHint: "Usa MAX."
      },
      {
        titleTemplate: "Primo Utente",
        descTemplate: "Trova la data di iscrizione più vecchia (primo utente).",
        queryTemplate: "SELECT MIN(created_at) FROM Users",
        hints: ["MIN(created_at)"],
        explanation: "Data minore = più vecchia.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MIN su date."
      },
      {
        titleTemplate: "Ultimo Ordine",
        descTemplate: "Trova la data dell'ordine più recente.",
        queryTemplate: "SELECT MAX(order_date) FROM Orders",
        hints: ["MAX(order_date)"],
        explanation: "Data maggiore = più recente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MAX su date."
      },
      {
        titleTemplate: "Conta Paesi Unici",
        descTemplate: "Conta quanti paesi diversi ci sono tra gli utenti.",
        queryTemplate: "SELECT COUNT(DISTINCT country) FROM Users",
        hints: ["COUNT(DISTINCT country)"],
        explanation: "Conta senza duplicati.",
        replacements: {},
        brokenCode: "SELECT COUNT(country) FROM Users",
        debugHint: "Serve DISTINCT dentro COUNT."
      },
      {
        titleTemplate: "Conta Categorie Uniche",
        descTemplate: "Quante categorie di prodotti diverse esistono?",
        queryTemplate: "SELECT COUNT(DISTINCT category) FROM Products",
        hints: ["COUNT(DISTINCT category)"],
        explanation: "Varietà catalogo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT."
      },
      {
        titleTemplate: "Conta Ruoli Unici",
        descTemplate: "Quanti ruoli aziendali diversi ci sono?",
        queryTemplate: "SELECT COUNT(DISTINCT role) FROM Employees",
        hints: ["COUNT(DISTINCT role)"],
        explanation: "Tipi di posizioni.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT."
      },
      {
        titleTemplate: "Conta Email (Non Null)",
        descTemplate: "Conta quante email sono presenti (esclude NULL automaticamente).",
        queryTemplate: "SELECT COUNT(email) FROM Users",
        hints: ["COUNT(email)"],
        explanation: "COUNT(colonna) ignora i NULL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa il nome colonna."
      },
      {
        titleTemplate: "Max Stock",
        descTemplate: "Qual è la quantità massima disponibile per un singolo prodotto?",
        queryTemplate: "SELECT MAX(stock) FROM Products",
        hints: ["MAX(stock)"],
        explanation: "Picco inventario.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MAX."
      },
      {
        titleTemplate: "Min Stock",
        descTemplate: "Qual è la quantità minima disponibile (potrebbe essere 0)?",
        queryTemplate: "SELECT MIN(stock) FROM Products",
        hints: ["MIN(stock)"],
        explanation: "Livello critico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MIN."
      },
      {
        titleTemplate: "Range Prezzi",
        descTemplate: "Calcola la differenza tra prezzo massimo e minimo.",
        queryTemplate: "SELECT MAX(price) - MIN(price) FROM Products",
        hints: ["MAX(...) - MIN(...)"],
        explanation: "Operazione tra aggregati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Sottrazione tra funzioni."
      },
      {
        titleTemplate: "Valore Medio Magazzino",
        descTemplate: "Calcola la media dello stock.",
        queryTemplate: "SELECT AVG(stock) FROM Products",
        hints: ["AVG(stock)"],
        explanation: "Giacenza media.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AVG."
      },
      {
        titleTemplate: "Totale Utenti Premium",
        descTemplate: "Conta quanti utenti sono Premium (is_premium = 1). Puoi usare WHERE.",
        queryTemplate: "SELECT COUNT(*) FROM Users WHERE is_premium = 1",
        hints: ["WHERE is_premium = 1"],
        explanation: "Aggregazione filtrata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "WHERE."
      },
      {
        titleTemplate: "Somma Vendite 2023",
        descTemplate: "Somma total_amount per ordini del 2023.",
        queryTemplate: "SELECT SUM(total_amount) FROM Orders WHERE strftime('%Y', order_date) = '2023'",
        hints: ["WHERE con anno 2023"],
        explanation: "Fatturato annuale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Filtra per anno."
      },
      {
        titleTemplate: "Media Prezzo Elettronica",
        descTemplate: "Prezzo medio prodotti categoria 'Electronics'.",
        queryTemplate: "SELECT AVG(price) FROM Products WHERE category = 'Electronics'",
        hints: ["WHERE category = 'Electronics'"],
        explanation: "Media condizionata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AVG con WHERE."
      },
      {
        titleTemplate: "Conta Ordini Pendenti",
        descTemplate: "Quanti ordini sono in stato 'Pending'?",
        queryTemplate: "SELECT COUNT(*) FROM Orders WHERE status = 'Pending'",
        hints: ["WHERE status = 'Pending'"],
        explanation: "Conta filtrato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT con WHERE."
      },
      {
        titleTemplate: "Max Prezzo Accessori",
        descTemplate: "Prezzo più alto tra gli 'Accessories'.",
        queryTemplate: "SELECT MAX(price) FROM Products WHERE category = 'Accessories'",
        hints: ["Filtra per category"],
        explanation: "Max di sottoinsieme.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MAX."
      },
      {
        titleTemplate: "Totale Pezzi Venduti",
        descTemplate: "Somma quantità (quantity) in OrderItems.",
        queryTemplate: "SELECT SUM(quantity) FROM OrderItems",
        hints: ["SUM(quantity)"],
        explanation: "Volume vendite.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM."
      },
      {
        titleTemplate: "Conta Righe Ordine",
        descTemplate: "Quante righe ci sono in totale in OrderItems?",
        queryTemplate: "SELECT COUNT(*) FROM OrderItems",
        hints: ["COUNT(*)"],
        explanation: "Totale righe dettaglio.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT."
      },
      {
        titleTemplate: "Conta Manager",
        descTemplate: "Conta quanti dipendenti hanno un manager (manager_id non NULL).",
        queryTemplate: "SELECT COUNT(manager_id) FROM Employees",
        hints: ["COUNT(manager_id)"],
        explanation: "Conta solo i non-NULL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa nome colonna."
      },
      {
        titleTemplate: "Totale Stipendi (Simulato)",
        descTemplate: "Supponendo una colonna salary (non c'è, usiamo una somma di e.id * 1000 come placeholder didattico). Somma (id * 1000).",
        queryTemplate: "SELECT SUM(id * 1000) FROM Employees",
        hints: ["SUM(id * 1000)"],
        explanation: "Somma di espressione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM con calcolo."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Utenti per Paese",
        descTemplate: "Conta quanti utenti ci sono per ogni paese.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country",
        hints: ["GROUP BY country"],
        explanation: "Distribuzione geografica.",
        replacements: {},
        brokenCode: "SELECT country, COUNT(*) FROM Users",
        debugHint: "Manca GROUP BY."
      },
      {
        titleTemplate: "Prodotti per Categoria",
        descTemplate: "Conta il numero di prodotti in ogni categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category",
        hints: ["GROUP BY category"],
        explanation: "Inventario per tipo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Prezzo Medio Categoria",
        descTemplate: "Calcola il prezzo medio dei prodotti per ogni categoria.",
        queryTemplate: "SELECT category, AVG(price) FROM Products GROUP BY category",
        hints: ["AVG(price) ... GROUP BY category"],
        explanation: "Analisi prezzi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AVG e GROUP BY."
      },
      {
        titleTemplate: "Stock Totale Categoria",
        descTemplate: "Calcola la quantità totale di stock per ogni categoria.",
        queryTemplate: "SELECT category, SUM(stock) FROM Products GROUP BY category",
        hints: ["SUM(stock) ... GROUP BY category"],
        explanation: "Volume magazzino.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM e GROUP BY."
      },
      {
        titleTemplate: "Ordini per Stato",
        descTemplate: "Conta quanti ordini ci sono per ogni stato (status).",
        queryTemplate: "SELECT status, COUNT(*) FROM Orders GROUP BY status",
        hints: ["GROUP BY status"],
        explanation: "Fase ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Vendite per Stato Ordine",
        descTemplate: "Somma il totale (total_amount) per ogni stato ordine.",
        queryTemplate: "SELECT status, SUM(total_amount) FROM Orders GROUP BY status",
        hints: ["SUM(total_amount) ... GROUP BY status"],
        explanation: "Valore nel workflow.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Dipendenti per Dipartimento",
        descTemplate: "Conta quanti dipendenti ci sono in ogni dipartimento.",
        queryTemplate: "SELECT department, COUNT(*) FROM Employees GROUP BY department",
        hints: ["GROUP BY department"],
        explanation: "Headcount.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Ordini per Utente",
        descTemplate: "Conta quanti ordini ha effettuato ciascun utente (user_id).",
        queryTemplate: "SELECT user_id, COUNT(*) FROM Orders GROUP BY user_id",
        hints: ["GROUP BY user_id"],
        explanation: "Frequenza acquisto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Spesa Totale Utente",
        descTemplate: "Calcola quanto ha speso in totale ogni utente.",
        queryTemplate: "SELECT user_id, SUM(total_amount) FROM Orders GROUP BY user_id",
        hints: ["SUM(total_amount) ... GROUP BY user_id"],
        explanation: "Lifetime value.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM."
      },
      {
        titleTemplate: "Ordini per Mese (Strftime)",
        descTemplate: "Conta gli ordini raggruppati per mese (strftime '%m').",
        queryTemplate: "SELECT STRFTIME('%m', order_date) as Mese, COUNT(*) FROM Orders GROUP BY Mese",
        hints: ["GROUP BY STRFTIME(...)"],
        explanation: "Trend mensile.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa l'espressione in GROUP BY."
      },
      {
        titleTemplate: "Ordini per Anno",
        descTemplate: "Conta gli ordini raggruppati per anno.",
        queryTemplate: "SELECT STRFTIME('%Y', order_date) as Anno, COUNT(*) FROM Orders GROUP BY Anno",
        hints: ["GROUP BY Anno"],
        explanation: "Trend annuale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Utenti per Dominio Email",
        descTemplate: "Conta utenti per dominio email (usa SUBSTR e INSTR, o string logic).",
        queryTemplate: "SELECT SUBSTR(email, INSTR(email, '@') + 1) as Domain, COUNT(*) FROM Users GROUP BY Domain",
        hints: ["Estrai dominio e raggruppa"],
        explanation: "Provider stats.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Complex GROUP BY."
      },
      {
        titleTemplate: "Categorie Popolose (HAVING)",
        descTemplate: "Mostra le categorie che hanno più di 10 prodotti.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category HAVING COUNT(*) > 10",
        hints: ["HAVING COUNT(*) > 10"],
        explanation: "Filtro su aggregato.",
        replacements: {},
        brokenCode: "SELECT category, COUNT(*) FROM Products GROUP BY category WHERE COUNT(*) > 10",
        debugHint: "Usa HAVING, non WHERE per aggregati."
      },
      {
        titleTemplate: "Paesi con Pochi Iscritti",
        descTemplate: "Trova paesi con meno di 5 utenti.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) < 5",
        hints: ["HAVING COUNT(*) < 5"],
        explanation: "Small markets.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Ordini Grandi (HAVING Sum)",
        descTemplate: "Trova utenti che hanno speso complessivamente più di 1000.",
        queryTemplate: "SELECT user_id, SUM(total_amount) FROM Orders GROUP BY user_id HAVING SUM(total_amount) > 1000",
        hints: ["HAVING SUM(...) > 1000"],
        explanation: "High spenders.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING SUM."
      },
      {
        titleTemplate: "Articoli per Ordine",
        descTemplate: "Conta numero righe per ogni ordine.",
        queryTemplate: "SELECT order_id, COUNT(*) FROM OrderItems GROUP BY order_id",
        hints: ["GROUP BY order_id"],
        explanation: "Grandezza carrello.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Quantità Totale per Ordine",
        descTemplate: "Somma 'quantity' per ogni order_id in OrderItems.",
        queryTemplate: "SELECT order_id, SUM(quantity) FROM OrderItems GROUP BY order_id",
        hints: ["SUM(quantity)"],
        explanation: "Totale oggetti fisici.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM."
      },
      {
        titleTemplate: "Max Prezzo per Categoria",
        descTemplate: "Trova il prodotto più costoso per ogni categoria.",
        queryTemplate: "SELECT category, MAX(price) FROM Products GROUP BY category",
        hints: ["MAX(price) ... GROUP BY category"],
        explanation: "Top di gamma.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MAX."
      },
      {
        titleTemplate: "Min Prezzo per Categoria",
        descTemplate: "Trova il prodotto più economico per ogni categoria.",
        queryTemplate: "SELECT category, MIN(price) FROM Products GROUP BY category",
        hints: ["MIN(price)"],
        explanation: "Entry level.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MIN."
      },
      {
        titleTemplate: "Ordini Multi-Item (HAVING)",
        descTemplate: "Trova ID ordini che hanno più di 3 righe (items).",
        queryTemplate: "SELECT order_id, COUNT(*) FROM OrderItems GROUP BY order_id HAVING COUNT(*) > 3",
        hints: ["HAVING COUNT(*) > 3"],
        explanation: "Carrelli grandi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Dipartimenti Piccoli",
        descTemplate: "Dipartimenti con massimo 2 dipendenti.",
        queryTemplate: "SELECT department, COUNT(*) FROM Employees GROUP BY department HAVING COUNT(*) <= 2",
        hints: ["HAVING COUNT(*) <= 2"],
        explanation: "Small teams.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Utenti Premium per Paese",
        descTemplate: "Conta solo utenti premium raggruppati per paese.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users WHERE is_premium = 1 GROUP BY country",
        hints: ["WHERE is_premium = 1 prima di GROUP BY"],
        explanation: "Filtro prima, raggruppo dopo.",
        replacements: {},
        brokenCode: "SELECT country, COUNT(*) FROM Users GROUP BY country WHERE is_premium = 1",
        debugHint: "WHERE va prima di GROUP BY."
      },
      {
        titleTemplate: "Max Spesa Singola per Utente",
        descTemplate: "Trova l'importo dell'ordine singolo più alto per ogni utente.",
        queryTemplate: "SELECT user_id, MAX(total_amount) FROM Orders GROUP BY user_id",
        hints: ["MAX(total_amount)"],
        explanation: "Record personale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Ordini Recenti per Utente",
        descTemplate: "Trova la data dell'ultimo ordine per ogni utente.",
        queryTemplate: "SELECT user_id, MAX(order_date) FROM Orders GROUP BY user_id",
        hints: ["MAX(order_date)"],
        explanation: "Ultima attività.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP BY."
      },
      {
        titleTemplate: "Prodotti Scontati per Categoria",
        descTemplate: "Conta prodotti con prezzo < 50 per categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products WHERE price < 50 GROUP BY category",
        hints: ["WHERE price < 50"],
        explanation: "Budget items distribution.",
        replacements: {},
        brokenCode: "...",
        debugHint: "WHERE prima."
      },
      {
        titleTemplate: "Stati con Molti Ordini",
        descTemplate: "Stati ordine (status) con più di 100 ordini totali.",
        queryTemplate: "SELECT status, COUNT(*) FROM Orders GROUP BY status HAVING COUNT(*) > 100",
        hints: ["HAVING COUNT(*) > 100"],
        explanation: "Stati frequenti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Media Stock per Categoria (Filtrata)",
        descTemplate: "Media stock per categoria, ma considera solo prodotti con stock > 0.",
        queryTemplate: "SELECT category, AVG(stock) FROM Products WHERE stock > 0 GROUP BY category",
        hints: ["WHERE stock > 0"],
        explanation: "Media attivo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "WHERE."
      },
      {
        titleTemplate: "Group By 2 Colonne",
        descTemplate: "Conta utenti per paese e stato (di iscrizione, se ci fosse, usiamo is_premium). Raggruppa per country e is_premium.",
        queryTemplate: "SELECT country, is_premium, COUNT(*) FROM Users GROUP BY country, is_premium",
        hints: ["GROUP BY country, is_premium"],
        explanation: "Sottogruppi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Multiple columns."
      },
      {
        titleTemplate: "Ordini Medi per Utente (HAVING)",
        descTemplate: "Utenti con media ordine superiore a 500.",
        queryTemplate: "SELECT user_id, AVG(total_amount) FROM Orders GROUP BY user_id HAVING AVG(total_amount) > 500",
        hints: ["HAVING AVG(...) > 500"],
        explanation: "High value customers.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING AVG."
      },
      {
        titleTemplate: "Categoria Dominante",
        descTemplate: "Categorie con stock totale > 1000.",
        queryTemplate: "SELECT category, SUM(stock) FROM Products GROUP BY category HAVING SUM(stock) > 1000",
        hints: ["HAVING SUM(stock)"],
        explanation: "High volume categories.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Conteggio Condizionale (Pivot)",
        descTemplate: "Conta quanti ordini sono 'Shipped' e quanti 'Pending' in un'unica query per ogni utente.",
        queryTemplate: "SELECT user_id, SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) as Shipped, SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as Pending FROM Orders GROUP BY user_id",
        hints: ["SUM(CASE WHEN status = '...' THEN 1 ELSE 0 END)"],
        explanation: "Pivot manuale con aggregazione condizionale.",
        replacements: {},
        brokenCode: "SELECT user_id, COUNT(WHERE status='Shipped'), COUNT(WHERE status='Pending') FROM Orders GROUP BY user_id",
        debugHint: "Usa CASE WHEN dentro SUM."
      },
      {
        titleTemplate: "Somma Condizionale",
        descTemplate: "Calcola il valore totale degli ordini 'Shipped' per ogni utente.",
        queryTemplate: "SELECT user_id, SUM(CASE WHEN status = 'Shipped' THEN total_amount ELSE 0 END) as ShippedValue FROM Orders GROUP BY user_id",
        hints: ["SUM(CASE WHEN ... THEN total_amount ELSE 0 END)"],
        explanation: "Somma solo righe specifiche.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE dentro SUM."
      },
      {
        titleTemplate: "Media Ponderata (Teorica)",
        descTemplate: "Calcola il prezzo medio ponderato per lo stock (SUM(price * stock) / SUM(stock)) per categoria.",
        queryTemplate: "SELECT category, SUM(price * stock) / SUM(stock) as WeightedAvg FROM Products GROUP BY category",
        hints: ["SUM(price * stock) / SUM(stock)"],
        explanation: "Media pesata sulla quantità.",
        replacements: {},
        brokenCode: "SELECT AVG(price * stock) FROM Products GROUP BY category",
        debugHint: "La formula è SommaProdotti / SommaPesi."
      },
      {
        titleTemplate: "Lista Nomi (Group Concat)",
        descTemplate: "Crea una lista separata da virgole dei nomi dei prodotti per ogni categoria.",
        queryTemplate: "SELECT category, GROUP_CONCAT(name, ', ') FROM Products GROUP BY category",
        hints: ["GROUP_CONCAT(name, ', ')"],
        explanation: "Aggregazione di stringhe.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP_CONCAT."
      },
      {
        titleTemplate: "Having Complesso (AND)",
        descTemplate: "Categorie con media prezzo > 50 E totale stock > 100.",
        queryTemplate: "SELECT category, AVG(price), SUM(stock) FROM Products GROUP BY category HAVING AVG(price) > 50 AND SUM(stock) > 100",
        hints: ["HAVING condition1 AND condition2"],
        explanation: "Filtri multipli su aggregati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING con AND."
      },
      {
        titleTemplate: "Having Complesso (OR)",
        descTemplate: "Categorie con media prezzo > 100 OPPURE totale prodotti > 10.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category HAVING AVG(price) > 100 OR COUNT(*) > 10",
        hints: ["HAVING ... OR ..."],
        explanation: "Logica booleana in HAVING.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OR in HAVING."
      },
      {
        titleTemplate: "Rapporto Prezzo/Stock",
        descTemplate: "Per ogni categoria, calcola il rapporto tra somma prezzi e somma stock.",
        queryTemplate: "SELECT category, SUM(price) / SUM(stock) as Ratio FROM Products GROUP BY category",
        hints: ["SUM(price) / SUM(stock)"],
        explanation: "Operazioni tra aggregati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Divisione tra SUM."
      },
      {
        titleTemplate: "Filtro su Conteggio Distinto",
        descTemplate: "Mostra dipartimenti con più di 3 ruoli diversi.",
        queryTemplate: "SELECT department, COUNT(DISTINCT role) FROM Employees GROUP BY department HAVING COUNT(DISTINCT role) > 3",
        hints: ["HAVING COUNT(DISTINCT role) > 3"],
        explanation: "Varietà di ruoli.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING con DISTINCT."
      },
      {
        titleTemplate: "Anno con Più Ordini",
        descTemplate: "Trova l'anno con il maggior numero di ordini (limit 1).",
        queryTemplate: "SELECT STRFTIME('%Y', order_date) as Anno, COUNT(*) FROM Orders GROUP BY Anno ORDER BY COUNT(*) DESC LIMIT 1",
        hints: ["GROUP BY Anno ORDER BY COUNT(*) DESC LIMIT 1"],
        explanation: "Top 1 per aggregazione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY aggregate."
      },
      {
        titleTemplate: "Mese di Picco Vendite",
        descTemplate: "Trova il mese (01-12) con la somma totale vendite più alta.",
        queryTemplate: "SELECT STRFTIME('%m', order_date) as Mese, SUM(total_amount) FROM Orders GROUP BY Mese ORDER BY SUM(total_amount) DESC LIMIT 1",
        hints: ["GROUP BY Mese ... ORDER BY SUM(...) DESC"],
        explanation: "Stagionalità.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY SUM."
      },
      {
        titleTemplate: "Ordini Senza Spedizione",
        descTemplate: "Conta ordini non ancora spediti (status != 'Shipped') per utente, solo se > 0.",
        queryTemplate: "SELECT user_id, COUNT(*) FROM Orders WHERE status != 'Shipped' GROUP BY user_id",
        hints: ["WHERE status != 'Shipped'"],
        explanation: "Filtro pre-aggregazione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "WHERE."
      },
      {
        titleTemplate: "Clienti e Spesa Media (Arrotondata)",
        descTemplate: "Per ogni paese, calcola la spesa media arrotondata a 2 decimali.",
        queryTemplate: "SELECT country, ROUND(AVG(total_amount), 2) FROM Orders o JOIN Users u ON o.user_id = u.id GROUP BY country",
        hints: ["ROUND(AVG(...), 2)", "Serve JOIN Users"],
        explanation: "Funzione scalare su aggregato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ROUND(AVG)."
      },
      {
        titleTemplate: "Categorie Binarie",
        descTemplate: "Se una categoria ha somma stock > 500 scrivi 'High', altrimenti 'Low'.",
        queryTemplate: "SELECT category, CASE WHEN SUM(stock) > 500 THEN 'High' ELSE 'Low' END as Status FROM Products GROUP BY category",
        hints: ["CASE WHEN SUM(stock) > 500 ..."],
        explanation: "Logica su risultato aggregato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE su SUM."
      },
      {
        titleTemplate: "Conta domini unici per Paese",
        descTemplate: "Conta quanti domini email unici ci sono per ogni paese.",
        queryTemplate: "SELECT country, COUNT(DISTINCT SUBSTR(email, INSTR(email, '@') + 1)) FROM Users GROUP BY country",
        hints: ["COUNT(DISTINCT espressione)"],
        explanation: "Distinct su espressione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Complex COUNT DISTINCT."
      },
      {
        titleTemplate: "Varianza (Simulata)",
        descTemplate: "Calcola (MAX - MIN) / AVG per i prezzi di ogni categoria (coefficiente variazione approx).",
        queryTemplate: "SELECT category, (MAX(price) - MIN(price)) / AVG(price) as VarCoeff FROM Products GROUP BY category",
        hints: ["(MAX - MIN) / AVG"],
        explanation: "Statistica descrittiva custom.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Formula con aggregati."
      },
      {
        titleTemplate: "Utenti con 1 solo Ordine",
        descTemplate: "Trova user_id degli utenti che hanno fatto esattamente 1 ordine.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(*) = 1",
        hints: ["HAVING COUNT(*) = 1"],
        explanation: "Single buyers.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Prodotti Non Disponibili per Cat",
        descTemplate: "Conta quanti prodotti hanno stock = 0 per ogni categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products WHERE stock = 0 GROUP BY category",
        hints: ["WHERE stock = 0 ... GROUP BY"],
        explanation: "Out of stock stats.",
        replacements: {},
        brokenCode: "...",
        debugHint: "WHERE stock = 0."
      },
      {
        titleTemplate: "Somma Totale Globale",
        descTemplate: "Un'unica riga con somma totale vendite e conteggio ordini globale (senza GROUP BY esplicito).",
        queryTemplate: "SELECT SUM(total_amount), COUNT(*) FROM Orders",
        hints: ["SELECT SUM..., COUNT..."],
        explanation: "Aggregazione scalare totale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Nessun GROUP BY."
      },
      {
        titleTemplate: "Percentuale Stock (Subquery)",
        descTemplate: "Per la categoria 'Electronics', calcola la % rispetto allo stock totale (richiede subquery scalare).",
        queryTemplate: "SELECT SUM(stock) * 100.0 / (SELECT SUM(stock) FROM Products) FROM Products WHERE category = 'Electronics'",
        hints: ["SUM(stock) / (SELECT SUM(stock)...)"],
        explanation: "Confronto parte-tutto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Serve select annidata nel divisore."
      },
      {
        titleTemplate: "Media dei Massimi",
        descTemplate: "Nota: In SQL standard non si può annidare AVG(MAX(...)) direttamente. Calcola invece MAX(price) per categoria e ordinali.",
        queryTemplate: "SELECT category, MAX(price) FROM Products GROUP BY category ORDER BY MAX(price) DESC",
        hints: ["GROUP BY ... ORDER BY MAX"],
        explanation: "Limit SQL aggregation.",
        replacements: {},
        brokenCode: "SELECT AVG(MAX(price)) FROM Products",
        debugHint: "Non annidare aggregati."
      },
      {
        titleTemplate: "Utenti Iscritti per Trimestre",
        descTemplate: "Raggruppa utenti per trimestre (Quarter) di created_at. (Usa espressione Case o strftime modificata).",
        queryTemplate: "SELECT CASE WHEN STRFTIME('%m', created_at) BETWEEN '01' AND '03' THEN 'Q1' WHEN STRFTIME('%m', created_at) BETWEEN '04' AND '06' THEN 'Q2' WHEN STRFTIME('%m', created_at) BETWEEN '07' AND '09' THEN 'Q3' ELSE 'Q4' END as Quarter, COUNT(*) FROM Users GROUP BY Quarter",
        hints: ["CASE WHEN mese BETWEEN ...", "GROUP BY Quarter"],
        explanation: "Custom time buckets.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE per definire gruppi."
      },
      {
        titleTemplate: "Lunghezza Media Nome per Cat",
        descTemplate: "Calcola la lunghezza media del nome prodotto per categoria.",
        queryTemplate: "SELECT category, AVG(LENGTH(name)) FROM Products GROUP BY category",
        hints: ["AVG(LENGTH(name))"],
        explanation: "Aggregazione su funzione scalare.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AVG(LENGTH)."
      },
      {
        titleTemplate: "Ultimi 3 Giorni di Ordini",
        descTemplate: "Conta ordini aggregati per data, solo per date negli ultimi 3 giorni (rispetto a un fisso o max).",
        queryTemplate: "SELECT order_date, COUNT(*) FROM Orders WHERE order_date >= date((SELECT MAX(order_date) FROM Orders), '-3 days') GROUP BY order_date",
        hints: ["WHERE ... >= date(MAX(...), '-3 days')"],
        explanation: "Rolling window statica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery per data max."
      },
      {
        titleTemplate: "Gruppi con Tutti i Prodotti Costosi",
        descTemplate: "Trova categorie dove il prodotto più economico costa comunque più di 20.",
        queryTemplate: "SELECT category FROM Products GROUP BY category HAVING MIN(price) > 20",
        hints: ["HAVING MIN(price) > 20"],
        explanation: "Tutti i membri soddisfano condizione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING MIN."
      },
      {
        titleTemplate: "Gruppi con Almeno un Prod Costoso",
        descTemplate: "Trova categorie con almeno un prodotto sopra i 500 (usando MAX).",
        queryTemplate: "SELECT category FROM Products GROUP BY category HAVING MAX(price) > 500",
        hints: ["HAVING MAX(price) > 500"],
        explanation: "Esistenza tramite max.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING MAX."
      },
      {
        titleTemplate: "Concatena ID Ordini",
        descTemplate: "Per ogni utente, lista gli ID dei suoi ordini separati da pipe '|'.",
        queryTemplate: "SELECT user_id, GROUP_CONCAT(id, '|') FROM Orders GROUP BY user_id",
        hints: ["GROUP_CONCAT(id, '|')"],
        explanation: "Lista compatta.",
        replacements: {},
        brokenCode: "...",
        debugHint: "GROUP_CONCAT."
      },
      {
        titleTemplate: "Differenza dalla Media Globale",
        descTemplate: "Per ogni prodotto, calcola differenza prezzo dalla media globale (richiede CROSS JOIN implicito o subquery).",
        queryTemplate: "SELECT name, price - (SELECT AVG(price) FROM Products) as Diff FROM Products",
        hints: ["price - (SELECT AVG(...) ...)"],
        explanation: "Non è un GROUP BY normale, è window-like.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery scalare."
      },
      {
        titleTemplate: "Conta Nulli vs Non Nulli",
        descTemplate: "In Employees, conta quanti hanno manager (NonNull) e quanti no (Null) in una riga.",
        queryTemplate: "SELECT COUNT(manager_id) as HasManager, SUM(CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END) as NoManager FROM Employees",
        hints: ["COUNT(col) conta non-null", "SUM(CASE WHEN col IS NULL...)"],
        explanation: "Data quality check.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT vs SUM CASE."
      },
      {
        titleTemplate: "Media Escludendo Estremi",
        descTemplate: "Calcola media prezzi escludendo il più alto e il più basso (concettuale).",
        queryTemplate: "SELECT (SUM(price) - MAX(price) - MIN(price)) / (COUNT(*) - 2) as TrimmedAvg FROM Products",
        hints: ["(SUM - MAX - MIN) / (COUNT - 2)"],
        explanation: "Media olimpica semplificata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Aritmetica su aggregati."
      },
      {
        titleTemplate: "Categoria con Stock Medio Più Alto",
        descTemplate: "Trova la singola categoria con lo stock_quantity medio più alto.",
        queryTemplate: "SELECT category FROM Products GROUP BY category ORDER BY AVG(stock) DESC LIMIT 1",
        hints: ["ORDER BY AVG(stock) DESC LIMIT 1"],
        explanation: "Best category.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY aggregate."
      }
    ],
  },
  [TopicId.Functions]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Maiuscolo",
        descTemplate: "Converti i nomi degli utenti in maiuscolo.",
        queryTemplate: "SELECT UPPER(name) as upper_name FROM Users",
        hints: ["Usa la funzione UPPER()", "Applica la funzione alla colonna 'name'"],
        explanation: "La funzione UPPER converte tutti i caratteri di una stringa in maiuscolo.",
        replacements: {},
        brokenCode: "SELECT name FROM Users WHERE UPPER = true",
        debugHint: "UPPER è una funzione, va usata come UPPER(colonna)."
      },
      {
        titleTemplate: "Minuscolo",
        descTemplate: "Converti le email degli utenti in minuscolo.",
        queryTemplate: "SELECT LOWER(email) as lower_email FROM Users",
        hints: ["Usa la funzione LOWER()", "Seleziona la colonna email"],
        explanation: "LOWER trasforma tutti i caratteri in minuscolo, utile per normalizzare i dati.",
        replacements: {},
        brokenCode: "SELECT LOWER FROM Users",
        debugHint: "Devi specificare la colonna tra parentesi: LOWER(nome_colonna)."
      },
      {
        titleTemplate: "Lunghezza Nome",
        descTemplate: "Calcola la lunghezza del nome di ogni prodotto.",
        queryTemplate: "SELECT name, LENGTH(name) as name_len FROM Products",
        hints: ["Usa LENGTH()", "Passa 'name' come argomento"],
        explanation: "LENGTH restituisce il numero di caratteri di una stringa.",
        replacements: {},
        brokenCode: "SELECT LEN(name) FROM Products",
        debugHint: "In molti SQL standard/AlaSQL si usa LENGTH, non LEN."
      },
      {
        titleTemplate: "Prezzo Arrotondato",
        descTemplate: "Arrotonda il prezzo dei prodotti all'intero più vicino.",
        queryTemplate: "SELECT price, ROUND(price) as rounded_price FROM Products",
        hints: ["Usa ROUND()", "Passa 'price' come argomento"],
        explanation: "ROUND arrotonda un numero all'intero più vicino (o ai decimali specificati).",
        replacements: {},
        brokenCode: "SELECT ROWND(price) FROM Products",
        debugHint: "La funzione corretta è ROUND."
      },
      {
        titleTemplate: "Concatenazione Base",
        descTemplate: "Unisci nome e ruolo degli impiegati in una sola stringa.",
        queryTemplate: "SELECT CONCAT(name, ' - ', role) as badge_info FROM Employees",
        hints: ["Usa CONCAT()", "Separa i campi con una virgola e aggiungi un separatore come ' - '"],
        explanation: "CONCAT unisce due o più stringhe in una sola.",
        replacements: {},
        brokenCode: "SELECT name + role FROM Employees",
        debugHint: "Anche se '+' funziona in alcuni DB, lo standard sicuro qui è CONCAT(a, b)."
      },
      {
        titleTemplate: "Valore Assoluto",
        descTemplate: "Calcola la differenza assoluta dei punti utente rispetto a 100.",
        queryTemplate: "SELECT points, ABS(points - 100) as diff FROM Users",
        hints: ["Usa ABS()", "Scrivi la sottrazione dentro la funzione"],
        explanation: "ABS restituisce il valore assoluto di un numero, ignorando il segno negativo.",
        replacements: {},
        brokenCode: "SELECT ABS points - 100 FROM Users",
        debugHint: "Usa le parentesi: ABS(espressione)."
      },
      {
        titleTemplate: "Prezzo Soffitto",
        descTemplate: "Arrotonda il prezzo per eccesso (CEIL).",
        queryTemplate: "SELECT price, CEIL(price) as ceil_price FROM Products",
        hints: ["Usa CEIL()", "È l'opposto di FLOOR"],
        explanation: "CEIL (Ceiling) arrotonda sempre al numero intero superiore.",
        replacements: {},
        brokenCode: "SELECT CEILING_UP(price) FROM Products",
        debugHint: "Usa CEIL()."
      },
      {
        titleTemplate: "Prezzo Pavimento",
        descTemplate: "Arrotonda il prezzo per difetto (FLOOR).",
        queryTemplate: "SELECT price, FLOOR(price) as floor_price FROM Products",
        hints: ["Usa FLOOR()", "Arrotonda sempre in basso"],
        explanation: "FLOOR arrotonda sempre all'intero inferiore.",
        replacements: {},
        brokenCode: "SELECT DOWN(price) FROM Products",
        debugHint: "La funzione si chiama FLOOR."
      },
      {
        titleTemplate: "Radice Quadrata",
        descTemplate: "Calcola la radice quadrata dello stock.",
        queryTemplate: "SELECT stock, SQRT(stock) as root_stock FROM Products",
        hints: ["Usa SQRT()", "Applicalo alla colonna stock"],
        explanation: "SQRT calcola la radice quadrata di un numero.",
        replacements: {},
        brokenCode: "SELECT SQR(stock) FROM Products",
        debugHint: "La funzione è SQRT."
      },
      {
        titleTemplate: "Primi Caratteri",
        descTemplate: "Mostra solo i primi 3 caratteri del nome delle categorie.",
        queryTemplate: "SELECT LEFT(category, 3) as short_cat FROM Products",
        hints: ["Usa LEFT()", "Specifica 3 come secondo argomento"],
        explanation: "LEFT estrae un numero specificato di caratteri dall'inizio di una stringa.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(category, 3) FROM Products",
        debugHint: "LEFT(col, 3) prende i primi 3. SUBSTR(col, 3) partirebbe dal 3° carattere."
      },
      {
        titleTemplate: "Ultimi Caratteri",
        descTemplate: "Mostra gli ultimi 2 caratteri delle email degli utenti.",
        queryTemplate: "SELECT email, RIGHT(email, 2) as domain_hint FROM Users",
        hints: ["Usa RIGHT()", "Specifica 2 come lunghezza"],
        explanation: "RIGHT estrae caratteri dalla fine della stringa.",
        replacements: {},
        brokenCode: "SELECT LAST(email, 2) FROM Users",
        debugHint: "Usa RIGHT()."
      },
      {
        titleTemplate: "Rimozione Spazi",
        descTemplate: "Rimuovi spazi all'inizio e fine dei nomi (TRIM).",
        queryTemplate: "SELECT TRIM(name) as clean_name FROM Users",
        hints: ["Usa TRIM()", "Utile per pulire l'input utente"],
        explanation: "TRIM rimuove spazi bianchi superflui agli estremi della stringa.",
        replacements: {},
        brokenCode: "SELECT CLEAN(name) FROM Users",
        debugHint: "Usa TRIM."
      },
      {
        titleTemplate: "Potenza",
        descTemplate: "Calcola il quadrato dei punti fedeltà.",
        queryTemplate: "SELECT points, POWER(points, 2) as points_squared FROM Users",
        hints: ["Usa POWER()", "Il secondo argomento è l'esponente (2)"],
        explanation: "POWER(base, esponente) eleva un numero a potenza.",
        replacements: {},
        brokenCode: "SELECT points ^ 2 FROM Users",
        debugHint: "In SQL standard usa POWER(a, b) invece di ^."
      },
      {
        titleTemplate: "Modulo (Pari/Dispari)",
        descTemplate: "Calcola il resto della divisione dell'ID per 2.",
        queryTemplate: "SELECT id, MOD(id, 2) as is_odd FROM Users",
        hints: ["Usa MOD()", "argomenti: id, 2"],
        explanation: "MOD restituisce il resto della divisione. Se 0, il numero è pari.",
        replacements: {},
        brokenCode: "SELECT id % 2 FROM Users",
        debugHint: "L'operatore % funziona spesso, ma qui esercitiamo la funzione MOD()."
      },
      {
        titleTemplate: "Segno Numero",
        descTemplate: "Determina se i punti sono positivi, negativi o zero (SIGN).",
        queryTemplate: "SELECT points, SIGN(points) FROM Users",
        hints: ["Usa SIGN()", "Restituisce 1, -1 o 0"],
        explanation: "SIGN restituisce il segno del numero.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SIGN."
      },
      {
        titleTemplate: "Stringa Inversa",
        descTemplate: "Scrivi il nome al contrario.",
        queryTemplate: "SELECT REVERSE(name) FROM Users",
        hints: ["Usa REVERSE()", "Inverte l'ordine dei caratteri"],
        explanation: "Semplice manipolazione di stringhe.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa REVERSE."
      },
      {
        titleTemplate: "Ripeti Stringa",
        descTemplate: "Ripeti il ruolo 'CEO' 3 volte.",
        queryTemplate: "SELECT REPEAT('CEO', 3)",
        hints: ["Usa REPEAT()", "Argomenti: stringa, numero ripetizioni"],
        explanation: "REPEAT duplica una stringa N volte.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa REPEAT."
      },
      {
        titleTemplate: "Posizione Carattere",
        descTemplate: "Trova la posizione della chiocciola '@' nelle email.",
        queryTemplate: "SELECT email, INSTR(email, '@') as at_pos FROM Users",
        hints: ["Usa INSTR()", "Cerca '@'"],
        explanation: "INSTR (o LOCATE/POSITION) trova l'indice di una sottostringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa INSTR."
      },
      {
        titleTemplate: "Nome Casuale",
        descTemplate: "Genera un numero casuale per ogni riga.",
        queryTemplate: "SELECT id, RAND() as lucky_number FROM Users",
        hints: ["Usa RAND()", "Non richiede argomenti"],
        explanation: "RAND genera un valore float tra 0 e 1.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa RAND()."
      },
      {
        titleTemplate: "Pi Greco",
        descTemplate: "Mostra il valore di PI greco.",
        queryTemplate: "SELECT PI()",
        hints: ["Funzione PI()", "Nessun argomento"],
        explanation: "Restituisce la costante matematica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa PI()."
      },
      {
        titleTemplate: "Logaritmo",
        descTemplate: "Calcola il logaritmo naturale del prezzo.",
        queryTemplate: "SELECT price, LOG(price) FROM Products",
        hints: ["Usa LOG()", "Applicalo a numeri positivi"],
        explanation: "Calcolo matematico avanzato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LOG."
      },
      {
        titleTemplate: "Esponenziale",
        descTemplate: "Calcola e (numero di Eulero) elevato al prezzo (EXP).",
        queryTemplate: "SELECT price, EXP(price) FROM Products WHERE price < 10",
        hints: ["Usa EXP()", "Filtra prezzi bassi per evitare overflow"],
        explanation: "Funzione inversa del logaritmo naturale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa EXP."
      },
      {
        titleTemplate: "Gradi a Radianti",
        descTemplate: "Converti 180 gradi in radianti.",
        queryTemplate: "SELECT RADIANS(180)",
        hints: ["Usa RADIANS()", "180 gradi = PI radianti"],
        explanation: "Conversione angolare.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa RADIANS."
      },
      {
        titleTemplate: "Radianti a Gradi",
        descTemplate: "Converti PI in gradi.",
        queryTemplate: "SELECT DEGREES(PI())",
        hints: ["Usa DEGREES()", "Passa PI()"],
        explanation: "Dovrebbe restituire 180.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DEGREES."
      },
      {
        titleTemplate: "Sostituzione Semplice",
        descTemplate: "Sostituisci 'Office' con 'Work' nei dipartimenti.",
        queryTemplate: "SELECT REPLACE(department, 'Office', 'Work') FROM Employees",
        hints: ["Usa REPLACE()", "Argomenti: colonna, cerca, sostituisci_con"],
        explanation: "Sostituzione di testo all'interno di una stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa REPLACE."
      },
      {
        titleTemplate: "Spazi Sinistra",
        descTemplate: "Rimuovi spazi a sinistra (LTRIM).",
        queryTemplate: "SELECT LTRIM('   text')",
        hints: ["Usa LTRIM()", "Rimuove spazi leading"],
        explanation: "Pulizia stringhe specifica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LTRIM."
      },
      {
        titleTemplate: "Spazi Destra",
        descTemplate: "Rimuovi spazi a destra (RTRIM).",
        queryTemplate: "SELECT RTRIM('text   ')",
        hints: ["Usa RTRIM()", "Rimuove spazi trailing"],
        explanation: "Pulizia stringhe specifica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa RTRIM."
      },
      {
        titleTemplate: "Codice ASCII",
        descTemplate: "Ottieni il codice ASCII della prima lettera del nome.",
        queryTemplate: "SELECT name, ASCII(name) FROM Users",
        hints: ["Usa ASCII()", "Restituisce il codice del primo carattere"],
        explanation: "Restituisce il valore numerico del carattere.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ASCII."
      },
      {
        titleTemplate: "Da ASCII a Char",
        descTemplate: "Trova il carattere corrispondente al codice 65.",
        queryTemplate: "SELECT CHAR(65)",
        hints: ["Usa CHAR()", "65 è 'A'"],
        explanation: "Conversione inversa di ASCII.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CHAR."
      },
      {
        titleTemplate: "Lunghezza Bit",
        descTemplate: "Calcola la lunghezza in bit del nome.",
        queryTemplate: "SELECT BIT_LENGTH(name) FROM Users",
        hints: ["Usa BIT_LENGTH()", "Solitamente 8x la lunghezza in caratteri (per ASCII)"],
        explanation: "Misura la dimensione in memoria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa BIT_LENGTH."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Sottostringa Email",
        descTemplate: "Estrai i primi 5 caratteri delle email.",
        queryTemplate: "SELECT SUBSTR(email, 1, 5) FROM Users",
        hints: ["Usa SUBSTR() o SUBSTRING()", "Argomenti: colonna, start, length"],
        explanation: "Estrae una porzione specifica di una stringa.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(email, 5) FROM Users",
        debugHint: "Se ometti la lunghezza, prende tutto fino alla fine. Qui vogliamo solo 5 caratteri."
      },
      {
        titleTemplate: "Formatta Prezzo",
        descTemplate: "Crea una stringa 'Prezzo: XX.XX'.",
        queryTemplate: "SELECT CONCAT('Prezzo: ', price) FROM Products",
        hints: ["Usa CONCAT", "Mischia stringa fissa e colonna numerica"],
        explanation: "Formattazione base per display.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Anonimizza Email",
        descTemplate: "Sostituisci la '@' con '[at]'.",
        queryTemplate: "SELECT REPLACE(email, '@', '[at]') as safe_email FROM Users",
        hints: ["Usa REPLACE()", "Sostituisci il simbolo speciale"],
        explanation: "Tecnica semplice per offuscare o modificare formati.",
        replacements: {},
        brokenCode: "SELECT REPLACE(email, '[at]') FROM Users",
        debugHint: "REPLACE richiede 3 argomenti: stringa, cosa cercare, con cosa sostituire."
      },
      {
        titleTemplate: "Padding ID",
        descTemplate: "Formatta l'ID con zeri iniziali (es. 001, 002) lunghezza 5.",
        queryTemplate: "SELECT LPAD(id, 5, '0') as code FROM Products",
        hints: ["Usa LPAD()", "Specifica lunghezza 5 e carattere '0'"],
        explanation: "LPAD (Left Pad) riempie la stringa a sinistra fino alla lunghezza desiderata.",
        replacements: {},
        brokenCode: "SELECT PAD(id, 5) FROM Products",
        debugHint: "Usa LPAD."
      },
      {
        titleTemplate: "Right Padding",
        descTemplate: "Aggiungi trattini alla fine del nome fino a lunghezza 20.",
        queryTemplate: "SELECT RPAD(name, 20, '-') FROM Users",
        hints: ["Usa RPAD()", "Carattere riempitivo '-'"],
        explanation: "RPAD riempie a destra.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa RPAD."
      },
      {
        titleTemplate: "Iniziali",
        descTemplate: "Estrai la prima lettera del nome e il ruolo.",
        queryTemplate: "SELECT LEFT(name, 1) as initial, role FROM Employees",
        hints: ["Usa LEFT(name, 1)"],
        explanation: "Estrazione rapida di dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LEFT."
      },
      {
        titleTemplate: "Dominio Email",
        descTemplate: "Estrai la parte del dominio dall'email (dopo la @).",
        queryTemplate: "SELECT SUBSTR(email, INSTR(email, '@') + 1) as domain FROM Users",
        hints: ["Usa INSTR per trovare la @", "Usa SUBSTR partendo da quella posizione + 1"],
        explanation: "Combinazione di funzioni per parsing dinamico.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(email, '@') FROM Users",
        debugHint: "SUBSTR vuole una posizione numerica, non un carattere."
      },
      {
        titleTemplate: "Nome Utente",
        descTemplate: "Estrai la parte prima della @ nell'email.",
        queryTemplate: "SELECT SUBSTR(email, 1, INSTR(email, '@') - 1) as username FROM Users",
        hints: ["Calcola lunghezza come posizione @ - 1", "Usa SUBSTR da 1"],
        explanation: "Parsing della prima parte dell'email.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla il calcolo della lunghezza."
      },
      {
        titleTemplate: "Arrotonda Decimali",
        descTemplate: "Arrotonda un numero (es. 123.4567) a 2 decimali.",
        queryTemplate: "SELECT ROUND(123.4567, 2)",
        hints: ["Secondo argomento di ROUND è la precisione"],
        explanation: "Controllo precisione numerica.",
        replacements: {},
        brokenCode: "SELECT ROUND(123.4567)",
        debugHint: "Manca il secondo parametro per i decimali."
      },
      {
        titleTemplate: "Tronca Numero",
        descTemplate: "Tronca il prezzo (rimuovi decimali senza arrotondare).",
        queryTemplate: "SELECT TRUNCATE(price, 0) FROM Products",
        hints: ["Usa TRUNCATE()", "Precisione 0"],
        explanation: "TRUNCATE taglia i decimali, diversamente da FLOOR per i negativi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TRUNCATE."
      },
      {
        titleTemplate: "Potenza Variabile",
        descTemplate: "Eleva lo stock alla potenza dell'ID (esercizio teorico).",
        queryTemplate: "SELECT POWER(stock, id) FROM Products",
        hints: ["Power accetta colonne per entrambi gli argomenti"],
        explanation: "Le funzioni matematiche possono usare colonne dinamiche.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi POWER."
      },
      {
        titleTemplate: "Pari o Dispari Stringa",
        descTemplate: "Restituisci 'Pari' o 'Dispari' basato sulla lunghezza del nome.",
        queryTemplate: "SELECT name, CASE WHEN MOD(LENGTH(name), 2) = 0 THEN 'Pari' ELSE 'Dispari' END FROM Users",
        hints: ["Usa LENGTH()", "Usa MOD() sul risultato", "Usa CASE WHEN"],
        explanation: "Combinazione di funzioni scalari e logica condizionale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la struttura CASE WHEN."
      },
      {
        titleTemplate: "Formatta Valuta",
        descTemplate: "Prefixa il prezzo con '$' convertendolo in stringa.",
        queryTemplate: "SELECT CONCAT('$', price) FROM Products",
        hints: ["Concatena il simbolo"],
        explanation: "Formattazione visuale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Null Coalesce",
        descTemplate: "Mostra il Manager ID, o 0 se è NULL.",
        queryTemplate: "SELECT name, COALESCE(manager_id, 0) FROM Employees",
        hints: ["Usa COALESCE()", "Il secondo valore è il fallback"],
        explanation: "COALESCE restituisce il primo valore non nullo.",
        replacements: {},
        brokenCode: "SELECT ISNULL(manager_id, 0)",
        debugHint: "Sebbene ISNULL esista in alcuni DB, COALESCE è lo standard SQL."
      },
      {
        titleTemplate: "Cerca e Sostituisci",
        descTemplate: "Nei nomi 'Monitor', sostituisci con 'Screen'.",
        queryTemplate: "SELECT REPLACE(name, 'Monitor', 'Screen') FROM Products WHERE name LIKE '%Monitor%'",
        hints: ["Filtra con LIKE", "Applica REPLACE"],
        explanation: "Modifica selettiva di stringhe.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa REPLACE."
      },
      {
        titleTemplate: "Stringa Vuota",
        descTemplate: "Controlla se la descrizione è vuota (Length 0) o NULL (Coalesce).",
        queryTemplate: "SELECT name, LENGTH(COALESCE(description, '')) FROM Products",
        hints: ["Gestisci NULL con COALESCE", "Poi calcola LENGTH"],
        explanation: "Gestione robusta di stringhe opzionali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa COALESCE dentro LENGTH."
      },
      {
        titleTemplate: "Posizione Spazio",
        descTemplate: "Trova la posizione del primo spazio nel nome del prodotto.",
        queryTemplate: "SELECT name, INSTR(name, ' ') FROM Products",
        hints: ["Cerca lo spazio ' '"],
        explanation: "Utile per separare parole.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa INSTR."
      },
      {
        titleTemplate: "Ripeti Asterisco",
        descTemplate: "Crea una barra di stelle lunga quanto lo stock.",
        queryTemplate: "SELECT name, REPEAT('*', stock) as stock_bar FROM Products",
        hints: ["Usa REPEAT()", "Usa stock come conteggio"],
        explanation: "Visualizzazione dati testuale (histogram).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa REPEAT."
      },
      {
        titleTemplate: "Trim Personalizzato",
        descTemplate: "Rimuovi 'X' dall'inizio di una stringa 'XXXName'.",
        queryTemplate: "SELECT TRIM(LEADING 'X' FROM 'XXXName')",
        hints: ["Sintassi avanzata di TRIM: LEADING 'char' FROM ..."],
        explanation: "TRIM standard permette di specificare cosa rimuovere.",
        replacements: {},
        brokenCode: "SELECT TRIM('X', 'XXXName')",
        debugHint: "Usa la sintassi standard SQL: TRIM(LEADING 'X' FROM ...)."
      },
      {
        titleTemplate: "Insert String",
        descTemplate: "Inserisci 'New' all'inizio del nome prodotto.",
        queryTemplate: "SELECT CONCAT('New ', name) FROM Products",
        hints: ["Semplice concatenazione"],
        explanation: "Aggiunta di prefissi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Mid String",
        descTemplate: "Prendi caratteri dal 2 al 4 (Lungh 3).",
        queryTemplate: "SELECT SUBSTR(name, 2, 3) FROM Users",
        hints: ["Start 2, Length 3"],
        explanation: "Estrazione centrale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SUBSTR."
      },
      {
        titleTemplate: "Confronto Case-Insensitive",
        descTemplate: "Confronta nome e 'alice' convertendo entrambi in UPPER.",
        queryTemplate: "SELECT * FROM Users WHERE UPPER(name) = 'ALICE'",
        hints: ["Converti colonna in UPPER", "Confronta con costante MAIUSCOLA"],
        explanation: "Tecnica standard per ricerche case-insensitive.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE name = 'ALICE'",
        debugHint: "Se il DB è case-sensitive, 'Alice' != 'ALICE'. Usa UPPER()."
      },
      {
        titleTemplate: "Lunghezza Totale",
        descTemplate: "Somma delle lunghezze di nome e email combinati.",
        queryTemplate: "SELECT LENGTH(name) + LENGTH(email) FROM Users",
        hints: ["Calcola lunghezze separate", "Sommale con +"],
        explanation: "Operazioni aritmetiche su risultati di funzioni.",
        replacements: {},
        brokenCode: "SELECT LENGTH(name + email) FROM Users",
        debugHint: "Meglio sommare i risultati di LENGTH() per chiarezza."
      },
      {
        titleTemplate: "Initcap Simulata",
        descTemplate: "Rendi maiuscola solo la prima lettera (Simulazione Initcap).",
        queryTemplate: "SELECT CONCAT(UPPER(LEFT(name,1)), LOWER(SUBSTR(name,2))) FROM Users",
        hints: ["Upper del primo char", "Lower del resto", "Concatena"],
        explanation: "Costruzione manuale di funzioni complesse.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Combina UPPER, LEFT, LOWER, SUBSTR."
      },
      {
        titleTemplate: "Soundex Sim",
        descTemplate: "Confronta stringhe simili (es. uso SOUNDEX se supportato, o LEFT match).",
        queryTemplate: "SELECT * FROM Users WHERE LEFT(name, 1) = LEFT('Alex', 1)",
        hints: ["Confronto basato su iniziali"],
        explanation: "Matching approssimativo semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LEFT."
      },
      {
        titleTemplate: "Random Integer",
        descTemplate: "Genera un intero random tra 1 e 10.",
        queryTemplate: "SELECT FLOOR(RAND() * 10) + 1",
        hints: ["RAND() * 10 da 0 a 9.99", "FLOOR scende a 0..9", "+1 porta a 1..10"],
        explanation: "Formula standard per range casuali interi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Ricorda di usare FLOOR."
      },
      {
        titleTemplate: "Valuta Formattata 2",
        descTemplate: "Prezzo / 100 visualizzato con 2 decimali.",
        queryTemplate: "SELECT ROUND(price / 100, 2) FROM Products",
        hints: ["Dividi", "Poi Arrotonda"],
        explanation: "Ordine delle operazioni.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ROUND va all'esterno."
      },
      {
        titleTemplate: "Nullif Zero",
        descTemplate: "Evita divisione per zero usando NULLIF.",
        queryTemplate: "SELECT 100 / NULLIF(points, 0) FROM Users",
        hints: ["NULLIF(points, 0) ritorna NULL se points è 0", "N / NULL dà NULL (sicuro)"],
        explanation: "Gestione errori aritmetici.",
        replacements: {},
        brokenCode: "SELECT 100 / points FROM Users",
        debugHint: "Se points è 0, darà errore o Infinity. Usa NULLIF."
      },
      {
        titleTemplate: "Coalesce Multiplo",
        descTemplate: "Primo valore non nullo tra A, B, C (simulati).",
        queryTemplate: "SELECT COALESCE(NULL, NULL, 'Found', 'Ignored')",
        hints: ["COALESCE accetta N argomenti"],
        explanation: "Catena di fallback.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa COALESCE."
      },
      {
        titleTemplate: "Ascii Sum",
        descTemplate: "Somma codice ASCII prima e ultima lettera.",
        queryTemplate: "SELECT ASCII(LEFT(name,1)) + ASCII(RIGHT(name,1)) FROM Users",
        hints: ["ASCII(LEFT...)", "ASCII(RIGHT...)", "Somma"],
        explanation: "Calculi su codici carattere.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ASCII, LEFT, RIGHT."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Mascheramento Complesso",
        descTemplate: "Maschera l'email mantenendo i primi 2 char e il dominio (es. al***@test.com).",
        queryTemplate: "SELECT CONCAT(SUBSTR(email, 1, 2), '***', SUBSTR(email, INSTR(email, '@'))) FROM Users",
        hints: ["Estrai primi 2 char", "Concatena '***'", "Estrai da '@' in poi"],
        explanation: "Tecnica comune per privacy e GDPR.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Spezza il problema in 3 parti e uniscile con CONCAT."
      },
      {
        titleTemplate: "Formattazione Nome",
        descTemplate: "Formatta come: COGNOME, N. (Tutto maiuscolo, iniziale nome). Simuliamo Cognome come seconda parola.",
        queryTemplate: "SELECT CONCAT(UPPER(SUBSTR(name, INSTR(name, ' ') + 1)), ', ', UPPER(LEFT(name, 1)), '.') FROM Users WHERE INSTR(name, ' ') > 0",
        hints: ["Estrai parte dopo spazio (Cognome)", "Primo carattere (Nome)", "Concatena con virgola"],
        explanation: "Manipolazione avanzata di stringhe basata su delimitatori.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa INSTR per trovare lo spazio."
      },
      {
        titleTemplate: "Calcolo IVA",
        descTemplate: "Calcola prezzo con IVA 22% arrotondato a 2 decimali e formattato.",
        queryTemplate: "SELECT CONCAT('€', ROUND(price * 1.22, 2)) as iva_price FROM Products",
        hints: ["Moltiplica per 1.22", "Arrotonda a 2", "Concatena simbolo"],
        explanation: "Calcolo finanziario completo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attento all'ordine: prima calcola, poi arrotonda, poi stringa."
      },
      {
        titleTemplate: "Password Strength",
        descTemplate: "Score: Lunghezza * 10, ma max 100 (Usa LEAST/MIN non supportato? Usa CASE).",
        queryTemplate: "SELECT CASE WHEN LENGTH(name)*10 > 100 THEN 100 ELSE LENGTH(name)*10 END as score FROM Users",
        hints: ["Calcola score base", "Usa CASE per limitare (clamp) a 100"],
        explanation: "Logica di clamping numerico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CASE WHEN val > 100 THEN 100."
      },
      {
        titleTemplate: "Estrazione Tag",
        descTemplate: "Estrai testo tra parentesi quadre '[tag] Content'.",
        queryTemplate: "SELECT SUBSTR(description, INSTR(description, '[')+1, INSTR(description, ']') - INSTR(description, '[') - 1) FROM Products WHERE description LIKE '%[%'",
        hints: ["Trova pos '['", "Trova pos ']'", "Calcola lunghezza come diff"],
        explanation: "Parsing complesso di testo strutturato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Lunghezza = PosChiusura - PosApertura - 1."
      },
      {
        titleTemplate: "Generatore Codice",
        descTemplate: "Genera codice: Primi 2 char categoria (Upper) + ID (pad 3) + ult char nome.",
        queryTemplate: "SELECT CONCAT(UPPER(LEFT(category, 2)), LPAD(id, 3, '0'), RIGHT(name, 1)) FROM Products",
        hints: ["Unisci 3 parti", "Usa Upper, Left, Lpad, Right"],
        explanation: "Generazione chiavi univoche custom.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT per unire tutto."
      },
      {
        titleTemplate: "Swap Case",
        descTemplate: "Simulazione: Se inizia con minuscola, trasforma in maiuscola, altrimenti minuscola.",
        queryTemplate: "SELECT CASE WHEN LEFT(name,1) = LOWER(LEFT(name,1)) THEN UPPER(name) ELSE LOWER(name) END FROM Users",
        hints: ["Confronta primo char con sua versione Lower", "Decidi azione"],
        explanation: "Logica condizionale su proprietà stringa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CASE WHEN."
      },
      {
        titleTemplate: "Distanza Numerica",
        descTemplate: "Trova il prodotto col prezzo più vicino a 50.",
        queryTemplate: "SELECT * FROM Products ORDER BY ABS(price - 50) ASC LIMIT 1",
        hints: ["Ordina per ABS(price - 50)", "Prendi il primo"],
        explanation: "Ordinamento per prossimità valore.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY ABS(...) è la chiave."
      },
      {
        titleTemplate: "Statistiche Nome",
        descTemplate: "Stringa riassuntiva: 'Nome: X chars, Start: Y, End: Z'.",
        queryTemplate: "SELECT CONCAT('Nome: ', LENGTH(name), ' chars, Start: ', LEFT(name,1), ', End: ', RIGHT(name,1)) FROM Products",
        hints: ["Tante concatenazioni"],
        explanation: "Reporting testuale inline.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Pulizia Totale",
        descTemplate: "Trim, Lower e Remove '@' dall'input.",
        queryTemplate: "SELECT REPLACE(LOWER(TRIM(name)), '@', '') FROM Users",
        hints: ["Nidifica le funzioni: Replace(Lower(Trim(...)))"],
        explanation: "Pipeline di pulizia dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "L'ordine conta: l'input di REPLACE è l'output di LOWER."
      },
      {
        titleTemplate: "Filtro Lunghezza Dinamico",
        descTemplate: "Trova nomi più lunghi della media delle lunghezze.",
        queryTemplate: "SELECT name FROM Users WHERE LENGTH(name) > (SELECT AVG(LENGTH(name)) FROM Users)",
        hints: ["Subquery calcola AVG(LENGTH)", "Confronta LENGTH(name)"],
        explanation: "Funzioni scalari in combinazione con aggregazioni.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa subquery."
      },
      {
        titleTemplate: "Codifica Rot13 (Sim)",
        descTemplate: "Sostituisci 'A' con 'N' e 'B' con 'O' (Solo 2 char per esercizio).",
        queryTemplate: "SELECT REPLACE(REPLACE(UPPER(name), 'A', 'N'), 'B', 'O') FROM Users",
        hints: ["Replace concatenati"],
        explanation: "Cifratura semplice (dimostrativo).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Nidifica REPLACE."
      },
      {
        titleTemplate: "Conteggio Vocali (Sim)",
        descTemplate: "Conta 'a' nel nome (Lunghezza originale - Lunghezza senza 'a').",
        queryTemplate: "SELECT LENGTH(name) - LENGTH(REPLACE(LOWER(name), 'a', '')) as a_count FROM Users",
        hints: ["Rimuovi le 'a'", "Confronta le lunghezze"],
        explanation: "Trucco standard SQL per contare occorrenze di un char.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Length(orig) - Length(removed)."
      },
      {
        titleTemplate: "Slugify (Sim)",
        descTemplate: "Converti 'Nome Prodotto' in 'nome-prodotto' (Lower, Replace space).",
        queryTemplate: "SELECT REPLACE(LOWER(name), ' ', '-') FROM Products",
        hints: ["Lower", "Replace spazio con dash"],
        explanation: "Creazione URL slug.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa REPLACE."
      },
      {
        titleTemplate: "Valore Futuro",
        descTemplate: "Points aumentati del 10% ogni anno di anzianità (Diff anni * 10%).",
        queryTemplate: "SELECT points * POWER(1.10, 2023 - YEAR(created_at)) FROM Users",
        hints: ["Base 1.10", "Esponente: Anni trascorsi"],
        explanation: "Calcolo interesse composto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa POWER."
      },
      {
        titleTemplate: "Coordinate (Sim)",
        descTemplate: "Formatta (x, y) da due colonne (id come x, stock come y).",
        queryTemplate: "SELECT CONCAT('(', id, ', ', stock, ')') as point FROM Products",
        hints: ["Concatena parentesi e virgole"],
        explanation: "Formattazione geometrica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Hash Semplice",
        descTemplate: "Somma (ASCII primo char) * (ASCII ultimo char).",
        queryTemplate: "SELECT ASCII(LEFT(name,1)) * ASCII(RIGHT(name,1)) as hash FROM Users",
        hints: ["Moltiplicazione di ASCII"],
        explanation: "Checksum banale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ASCII."
      },
      {
        titleTemplate: "Progressione",
        descTemplate: "Genera '1-2-3' (concatenazione fissa per esercizio).",
        queryTemplate: "SELECT '1-2-3'",
        hints: ["Literal"],
        explanation: "Testing costanti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Select stringa semplice."
      },
      {
        titleTemplate: "Email Oscurata Parziale",
        descTemplate: "Se premium: mostra, se no: maschera.",
        queryTemplate: "SELECT CASE WHEN is_premium THEN email ELSE '***' END FROM Users",
        hints: ["CASE WHEN su premium"],
        explanation: "Logica di business su display.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CASE."
      },
      {
        titleTemplate: "Categoria Normalizzata",
        descTemplate: "Se categoria è NULL o vuota, 'Generico', poi UPPER.",
        queryTemplate: "SELECT UPPER(COALESCE(NULLIF(category, ''), 'Generico')) FROM Products",
        hints: ["NULLIF(cat, '') gestisce stringa vuota", "COALESCE gestisce NULL", "UPPER alla fine"],
        explanation: "Robustezza dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Nidifica: UPPER(COALESCE(NULLIF...))."
      },
      {
        titleTemplate: "Report Stock",
        descTemplate: "'Low' se < 10, 'Med' se < 50, 'High' altrimenti.",
        queryTemplate: "SELECT name, CASE WHEN stock < 10 THEN 'Low' WHEN stock < 50 THEN 'Med' ELSE 'High' END FROM Products",
        hints: ["CASE WHEN multiplo"],
        explanation: "Bucketing dei dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CASE."
      },
      {
        titleTemplate: "Estrai Numeri (Sim)",
        descTemplate: "Dalla stringa 'Order #123', estrai '123' (Substring da pos # + 1).",
        queryTemplate: "SELECT SUBSTR('Order #123', INSTR('Order #123', '#') + 1)",
        hints: ["Trova hash", "Substr dopo hash"],
        explanation: "Parsing ID.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SUBSTR."
      },
      {
        titleTemplate: "Nome File",
        descTemplate: "Genera 'report_2023.txt'.",
        queryTemplate: "SELECT CONCAT('report_', 2023, '.txt')",
        hints: ["Concatena"],
        explanation: "Generazione nomi file.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Byte Size",
        descTemplate: "Lunghezza in byte (Length per charset standard).",
        queryTemplate: "SELECT LENGTH(name) FROM Users",
        hints: ["Assumiamo 1 byte char"],
        explanation: "Stime storage.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LENGTH."
      },
      {
        titleTemplate: "Ultimo Spazio",
        descTemplate: "Trova posizione ultimo carattere (Length).",
        queryTemplate: "SELECT LENGTH(name) FROM Users",
        hints: ["L'ultimo indice è la lunghezza"],
        explanation: "Info posizionali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LENGTH."
      },
      {
        titleTemplate: "Centra Testo",
        descTemplate: "Simula centering (non esiste CENTER() std).",
        queryTemplate: "SELECT CONCAT('  ', name, '  ') FROM Users",
        hints: ["Aggiungi spazi"],
        explanation: "Padding manuale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Bool to Str",
        descTemplate: "Converti true/false in 'Sì'/'No'.",
        queryTemplate: "SELECT CASE WHEN is_premium THEN 'Sì' ELSE 'No' END FROM Users",
        hints: ["CASE su booleano"],
        explanation: "Localizzazione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CASE."
      },
      {
        titleTemplate: "Safe Div",
        descTemplate: "Price / Stock (Gestisci stock 0 con NULLIF e COALESCE result a 0).",
        queryTemplate: "SELECT COALESCE(price / NULLIF(stock, 0), 0) FROM Products",
        hints: ["NULLIF(stock,0)", "Div", "COALESCE(res, 0)"],
        explanation: "Matematica sicura completa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa COALESCE + NULLIF."
      },
      {
        titleTemplate: "Logica Binaria",
        descTemplate: "Simula AND bitwise (non supportato ovunque, usa MOD/DIV).",
        queryTemplate: "SELECT id FROM Users WHERE MOD(id, 2) = 1",
        hints: ["Dispari (bit 1 settato)"],
        explanation: "Logica bitwise simulata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa MOD."
      },
      {
        titleTemplate: "Completa",
        descTemplate: "Esercizio finale riassuntivo.",
        queryTemplate: "SELECT UPPER(TRIM(name)) FROM Users",
        hints: ["Upper + Trim"],
        explanation: "Ripasso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa UPPER e TRIM."
      }
    ],
  },
  [TopicId.Dates]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Anno Corrente",
        descTemplate: "Estrai l'anno dalla data di creazione degli utenti.",
        queryTemplate: "SELECT YEAR(created_at) FROM Users",
        hints: ["Usa YEAR()", "Applica alla colonna created_at"],
        explanation: "Estrae l'anno come numero a 4 cifre.",
        replacements: {},
        brokenCode: "SELECT DATE(created_at) FROM Users",
        debugHint: "YEAR() estrae l'anno, DATE() estrae la data completa."
      },
      {
        titleTemplate: "Mese Ordine",
        descTemplate: "Estrai il mese numerico (1-12) della data ordine.",
        queryTemplate: "SELECT MONTH(order_date) FROM Orders",
        hints: ["Usa MONTH()", "Restituisce un numero da 1 a 12"],
        explanation: "Estrae il mese dalla data.",
        replacements: {},
        brokenCode: "SELECT MON(order_date) FROM Orders",
        debugHint: "La funzione è MONTH(), non MON."
      },
      {
        titleTemplate: "Giorno Mese",
        descTemplate: "Estrai il giorno del mese (1-31).",
        queryTemplate: "SELECT DAY(created_at) FROM Users",
        hints: ["Usa DAY() o DAYOFMONTH()"],
        explanation: "Estrae il giorno del mese.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DAY()."
      },
      {
        titleTemplate: "Ora Corrente",
        descTemplate: "Mostra l'ora corrente (0-23) usando NOW().",
        queryTemplate: "SELECT HOUR(NOW())",
        hints: ["Usa NOW() per ottenere il momento corrente", "Usa HOUR() per estrarre l'ora"],
        explanation: "Combina funzioni per ottenere l'ora attuale.",
        replacements: {},
        brokenCode: "SELECT NOW()",
        debugHint: "Devi estrarre l'ora con HOUR()."
      },
      {
        titleTemplate: "Minuto Creazione",
        descTemplate: "Estrai il minuto dalla data di creazione.",
        queryTemplate: "SELECT MINUTE(created_at) FROM Users",
        hints: ["Usa MINUTE()"],
        explanation: "Estrae i minuti (0-59).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa MINUTE()."
      },
      {
        titleTemplate: "Data Odierna",
        descTemplate: "Mostra la data di oggi senza orario.",
        queryTemplate: "SELECT CURDATE()",
        hints: ["Usa CURDATE() o CURRENT_DATE()"],
        explanation: "Restituisce la data corrente YYYY-MM-DD.",
        replacements: {},
        brokenCode: "SELECT NOW()",
        debugHint: "NOW() include l'orario, CURDATE() no."
      },
      {
        titleTemplate: "Nome Giorno",
        descTemplate: "Ottieni il nome del giorno (es. 'Monday') per gli ordini.",
        queryTemplate: "SELECT DAYNAME(order_date) FROM Orders",
        hints: ["Usa DAYNAME()"],
        explanation: "Restituisce il nome completo del giorno in inglese.",
        replacements: {},
        brokenCode: "SELECT DAY(order_date) FROM Orders",
        debugHint: "DAY() dà il numero, DAYNAME() il nome."
      },
      {
        titleTemplate: "Nome Mese",
        descTemplate: "Ottieni il nome del mese (es. 'January').",
        queryTemplate: "SELECT MONTHNAME(created_at) FROM Users",
        hints: ["Usa MONTHNAME()"],
        explanation: "Restituisce il nome completo del mese.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa MONTHNAME()."
      },
      {
        titleTemplate: "Giorno Settimana",
        descTemplate: "Indice giorno settimana (1=Domenica, ecc. a seconda config standard).",
        queryTemplate: "SELECT DAYOFWEEK(order_date) FROM Orders",
        hints: ["Usa DAYOFWEEK()"],
        explanation: "Restituisce un indice da 1 (Domenica) a 7 (Sabato) nello standard ODBC.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DAYOFWEEK()."
      },
      {
        titleTemplate: "Solo Data",
        descTemplate: "Estrai solo la parte data da un datetime.",
        queryTemplate: "SELECT DATE(created_at) FROM Users",
        hints: ["Usa la funzione DATE() per troncare l'orario"],
        explanation: "Estrae la parte YYYY-MM-DD.",
        replacements: {},
        brokenCode: "SELECT created_at FROM Users",
        debugHint: "Usa DATE() per rimuovere l'orario."
      },
      {
        titleTemplate: "Anno Ordine",
        descTemplate: "Estrai l'anno in cui è stato fatto l'ordine.",
        queryTemplate: "SELECT YEAR(order_date) FROM Orders",
        hints: ["Usa YEAR()"],
        explanation: "Filtro per anno.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa YEAR()."
      },
      {
        titleTemplate: "Secondo",
        descTemplate: "Estrai i secondi da un timestamp.",
        queryTemplate: "SELECT SECOND(created_at) FROM Users",
        hints: ["Usa SECOND()"],
        explanation: "Precisione al secondo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SECOND()."
      },
      {
        titleTemplate: "Ultimo Giorno Mese",
        descTemplate: "Trova l'ultimo giorno del mese per la data ordine.",
        queryTemplate: "SELECT LAST_DAY(order_date) FROM Orders",
        hints: ["Usa LAST_DAY()"],
        explanation: "Restituisce la data dell'ultimo giorno del mese (es. 28, 30, 31).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa LAST_DAY()."
      },
      {
        titleTemplate: "Data e Ora",
        descTemplate: "Mostra data e ora correnti.",
        queryTemplate: "SELECT NOW()",
        hints: ["Funzione principale per timestamp corrente"],
        explanation: "Restituisce YYYY-MM-DD HH:MM:SS.",
        replacements: {},
        brokenCode: "SELECT DATE()",
        debugHint: "DATE() richiede un argomento o non è la funzione per 'adesso'."
      },
      {
        titleTemplate: "Giorno Anno",
        descTemplate: "Che giorno dell'anno è (1-366)?",
        queryTemplate: "SELECT DAYOFYEAR(order_date) FROM Orders",
        hints: ["Usa DAYOFYEAR()"],
        explanation: "Progressivo annuo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DAYOFYEAR()."
      },
      {
        titleTemplate: "Settimana Anno",
        descTemplate: "Numero della settimana (0-53).",
        queryTemplate: "SELECT WEEK(order_date) FROM Orders",
        hints: ["Usa WEEK()"],
        explanation: "Conteggio settimane.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa WEEK()."
      },
      {
        titleTemplate: "Quarter",
        descTemplate: "Trimestre dell'ordine (1-4).",
        queryTemplate: "SELECT QUARTER(order_date) FROM Orders",
        hints: ["Usa QUARTER()"],
        explanation: "Divisione anno in 4 parti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa QUARTER()."
      },
      {
        titleTemplate: "Formatta Anno-Mese",
        descTemplate: "Stampa 'YYYY-MM' (Esercizio di estrazione, non DATE_FORMAT).",
        queryTemplate: "SELECT CONCAT(YEAR(order_date), '-', MONTH(order_date)) FROM Orders",
        hints: ["Concatena YEAR e MONTH con un trattino"],
        explanation: "Formattazione manuale semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT, YEAR, MONTH."
      },
      {
        titleTemplate: "Età in Anni (Approx)",
        descTemplate: "Calcola anni passati dalla creazione (Difference Year).",
        queryTemplate: "SELECT YEAR(NOW()) - YEAR(created_at) FROM Users",
        hints: ["Sottrai l'anno di creazione dall'anno corrente"],
        explanation: "Calcolo età approssimativo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa YEAR(NOW()) - YEAR(...)."
      },
      {
        titleTemplate: "Is Weekend?",
        descTemplate: "Verifica se è Domenica (DayOfWeek = 1).",
        queryTemplate: "SELECT order_date, DAYOFWEEK(order_date) = 1 as is_sunday FROM Orders",
        hints: ["DAYOFWEEK restituisce 1 per Domenica (standard ODBC)", "Confronta con 1"],
        explanation: "Check giorno festivo semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DAYOFWEEK(date) = 1."
      },
      {
        titleTemplate: "Sysdate",
        descTemplate: "Alias per NOW() (spesso usato).",
        queryTemplate: "SELECT SYSDATE()",
        hints: ["Simile a NOW()"],
        explanation: "Restituisce data/ora sistema.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SYSDATE()."
      },
      {
        titleTemplate: "Time Only",
        descTemplate: "Estrai solo la parte orario (HH:MM:SS).",
        queryTemplate: "SELECT TIME(created_at) FROM Users",
        hints: ["Usa TIME()"],
        explanation: "Estrae orario da datetime.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TIME()."
      },
      {
        titleTemplate: "Aggiungi 0 Giorni",
        descTemplate: "Simula identità date (per testare input).",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 0 DAY) FROM Orders",
        hints: ["DATE_ADD con 0"],
        explanation: "Operazione neutra.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_ADD."
      },
      {
        titleTemplate: "Ieri",
        descTemplate: "Calcola la data di ieri.",
        queryTemplate: "SELECT SUBDATE(CURDATE(), 1)",
        hints: ["SUBDATE o DATE_SUB", "Parti da CURDATE()"],
        explanation: "Operazione data relativa.",
        replacements: {},
        brokenCode: "SELECT CURDATE() - 1",
        debugHint: "In SQL standard meglio usare funzioni dedicate come SUBDATE, anche se menzionato meno."
      },
      {
        titleTemplate: "Domani",
        descTemplate: "Calcola la data di domani.",
        queryTemplate: "SELECT ADDDATE(CURDATE(), 1)",
        hints: ["ADDDATE o DATE_ADD", "Parti da CURDATE()"],
        explanation: "Data futura.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ADDDATE."
      },
      {
        titleTemplate: "Timestamp Stringa",
        descTemplate: "Interpreta stringa come data.",
        queryTemplate: "SELECT DATE('2023-12-25')",
        hints: ["Casting implicito o funzionale"],
        explanation: "Verifica parsing.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE('stringa')."
      },
      {
        titleTemplate: "Primo del Mese (Logic)",
        descTemplate: "Costruisci la data del primo giorno del mese corrente.",
        queryTemplate: "SELECT CONCAT(YEAR(NOW()), '-', MONTH(NOW()), '-01')",
        hints: ["Concatena Anno, Mese e '-01'"],
        explanation: "Costruzione data.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Giorno Precedente",
        descTemplate: "Giorno prima dell'ordine.",
        queryTemplate: "SELECT DATE_SUB(order_date, INTERVAL 1 DAY) FROM Orders",
        hints: ["Usa DATE_SUB", "INTERVAL 1 DAY"],
        explanation: "Date math base.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_SUB."
      },
      {
        titleTemplate: "Differenza Giorni Semplice",
        descTemplate: "Giorni tra Oggi e Ieri (sempre 1).",
        queryTemplate: "SELECT DATEDIFF(CURDATE(), SUBDATE(CURDATE(), 1))",
        hints: ["DATEDIFF(A, B) = A - B in giorni"],
        explanation: "Verifica DATEDIFF.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATEDIFF."
      },
      {
        titleTemplate: "Anno Corrente Variabile",
        descTemplate: "Seleziona solo l'anno 2023 (hardcoded per esempio).",
        queryTemplate: "SELECT 2023",
        hints: ["Numero"],
        explanation: "Costante.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Scrivi 2023."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Differenza Giorni Ordine",
        descTemplate: "Giorni passati dalla data dell'ordine a oggi.",
        queryTemplate: "SELECT DATEDIFF(NOW(), order_date) FROM Orders",
        hints: ["Usa DATEDIFF(End, Start)", "Start è order_date"],
        explanation: "Calcolo giorni trascorsi.",
        replacements: {},
        brokenCode: "SELECT NOW() - order_date FROM Orders",
        debugHint: "La sottrazione diretta tra date non restituisce giorni in tutti i dialetti, usa DATEDIFF."
      },
      {
        titleTemplate: "Scadenza Ordine",
        descTemplate: "Calcola la data di scadenza (30 giorni dopo l'ordine).",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 30 DAY) FROM Orders",
        hints: ["Usa DATE_ADD", "INTERVAL 30 DAY"],
        explanation: "Proiezione data futura.",
        replacements: {},
        brokenCode: "SELECT order_date + 30 FROM Orders",
        debugHint: "Usa DATE_ADD(date, INTERVAL ...)."
      },
      {
        titleTemplate: "Inizio Mese Ordine",
        descTemplate: "Calcola il primo giorno del mese dell'ordine.",
        queryTemplate: "SELECT DATE_SUB(order_date, INTERVAL DAY(order_date) - 1 DAY) FROM Orders",
        hints: ["Sottrai (Giorno - 1) giorni alla data"],
        explanation: "Tecnica aritmetica per trovare l'inizio mese.",
        replacements: {},
        brokenCode: "SELECT CONCAT(YEAR(order_date), '-', MONTH(order_date), '-01') FROM Orders",
        debugHint: "La concatenazione restituisce una stringa, meglio usare aritmetica date per un risultato DATE."
      },
      {
        titleTemplate: "Età Esatta (Giorni)",
        descTemplate: "Giorni vissuti dall'utente (created_at come nascita fittizia).",
        queryTemplate: "SELECT DATEDIFF(CURDATE(), created_at) FROM Users",
        hints: ["Usa DATEDIFF con CURDATE()"],
        explanation: "Calcolo età in giorni.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATEDIFF."
      },
      {
        titleTemplate: "Ore Trascorse",
        descTemplate: "Calcola ore trascorse dalla creazione account.",
        queryTemplate: "SELECT TIMESTAMPDIFF(HOUR, created_at, NOW()) FROM Users",
        hints: ["Usa TIMESTAMPDIFF", "Unit: HOUR"],
        explanation: "Differenza temporale precisa.",
        replacements: {},
        brokenCode: "SELECT DATEDIFF(NOW(), created_at) * 24 FROM Users",
        debugHint: "DATEDIFF conta solo i cambi di giorno, TIMESTAMPDIFF è più preciso per le ore."
      },
      {
        titleTemplate: "Formatta Data IT",
        descTemplate: "Data in formato 'DD/MM/YYYY'.",
        queryTemplate: "SELECT DATE_FORMAT(created_at, '%d/%m/%Y') FROM Users",
        hints: ["Usa DATE_FORMAT", "Specifier: %d/%m/%Y"],
        explanation: "Formattazione locale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_FORMAT."
      },
      {
        titleTemplate: "Ultimo Giorno Mese Scorso",
        descTemplate: "Ultimo giorno del mese precedente alla creazione.",
        queryTemplate: "SELECT LAST_DAY(DATE_SUB(created_at, INTERVAL 1 MONTH)) FROM Users",
        hints: ["Sottrai 1 mese", "Applica LAST_DAY"],
        explanation: "Navigazione tra mesi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_SUB poi LAST_DAY."
      },
      {
        titleTemplate: "Prossimo Lunedì",
        descTemplate: "Aggiungi giorni fino a raggiungere Lunedì (Simulazione logica).",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL (7 - WEEKDAY(created_at)) % 7 DAY) FROM Users",
        hints: ["WEEKDAY restituisce indice (0=Mon...)", "Logica modulo 7"],
        explanation: "Calcolo ricorrenze settimanali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa WEEKDAY."
      },
      {
        titleTemplate: "Nome Mese Abbreviato",
        descTemplate: "Estrai 'Jan', 'Feb', etc.",
        queryTemplate: "SELECT LEFT(MONTHNAME(created_at), 3) FROM Users",
        hints: ["MONTHNAME", "LEFT 3 char"],
        explanation: "Manipolazione stringa su data.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa MONTHNAME e LEFT."
      },
      {
        titleTemplate: "Week of Year",
        descTemplate: "Restituisci 'Week XX'.",
        queryTemplate: "SELECT CONCAT('Week ', WEEK(created_at)) FROM Users",
        hints: ["Usa PREPEND", "WEEK()"],
        explanation: "Reporting settimanale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Aggiungi 2 Settimane",
        descTemplate: "Aggiungi 14 giorni.",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL 2 WEEK) FROM Users",
        hints: ["INTERVAL 2 WEEK è valido in SQL std"],
        explanation: "Aritmetica con unità diverse.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa INTERVAL 2 WEEK."
      },
      {
        titleTemplate: "Confronto Date Stringa",
        descTemplate: "Utenti creati dopo '2023-01-01'.",
        queryTemplate: "SELECT * FROM Users WHERE created_at > '2023-01-01'",
        hints: ["Confronto diretto con stringa ISO"],
        explanation: "SQL converte implicitamente stringhe ISO in date per i confronti.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE created_at > 2023-01-01",
        debugHint: "Metti la data tra apici."
      },
      {
        titleTemplate: "Da Giorni a Anni",
        descTemplate: "Converti giorni (DATEDIFF) in anni (diviso 365.25).",
        queryTemplate: "SELECT ROUND(DATEDIFF(NOW(), created_at) / 365.25, 1) FROM Users",
        hints: ["Dividi per 365.25", "Arrotonda"],
        explanation: "Stima anni precisa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Dividi il risultato di DATEDIFF."
      },
      {
        titleTemplate: "Estrai AnnoMese Int",
        descTemplate: "Anno e mese come intero YYYYMM.",
        queryTemplate: "SELECT EXTRACT(YEAR_MONTH FROM created_at) FROM Users",
        hints: ["Usa EXTRACT(YEAR_MONTH ...)"],
        explanation: "EXTRACT offre formati compositi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa EXTRACT."
      },
      {
        titleTemplate: "Str to Date",
        descTemplate: "Converti '01-12-2023' in data.",
        queryTemplate: "SELECT STR_TO_DATE('01-12-2023', '%d-%m-%Y')",
        hints: ["STR_TO_DATE", "Pattern inverso"],
        explanation: "Parsing date custom.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa STR_TO_DATE."
      },
      {
        titleTemplate: "Trimestre Inizio",
        descTemplate: "Primo giorno del trimestre corrente.",
        queryTemplate: "SELECT MAKEDATE(YEAR(NOW()), 1) + INTERVAL QUARTER(NOW()) * 3 - 3 MONTH",
        hints: ["Complesso: MAKEDATE anno", "Aggiungi trimestri"],
        explanation: "Calcolo avanzato periodi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Costruisci logicamente."
      },
      {
        titleTemplate: "Solo Orario PM",
        descTemplate: "Seleziona se orario > 12:00.",
        queryTemplate: "SELECT * FROM Orders WHERE HOUR(order_date) >= 12",
        hints: ["Filtra con HOUR()"],
        explanation: "Filtri basati su parte oraria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa HOUR."
      },
      {
        titleTemplate: "Tempo Rimasto Anno",
        descTemplate: "Giorni alla fine dell'anno.",
        queryTemplate: "SELECT DATEDIFF(CONCAT(YEAR(NOW()), '-12-31'), NOW())",
        hints: ["Costruisci data 31 dic", "DATEDIFF con NOW()"],
        explanation: "Countdown.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Costruisci la data target."
      },
      {
        titleTemplate: "Date Format Esteso",
        descTemplate: "Es: 'Friday, 01 January 2023'.",
        queryTemplate: "SELECT DATE_FORMAT(NOW(), '%W, %d %M %Y')",
        hints: ["%W nome giorno", "%M nome mese"],
        explanation: "Formattazione verbosa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla gli specifier di DATE_FORMAT."
      },
      {
        titleTemplate: "Unix Timestamp",
        descTemplate: "Ottieni timestamp numerico (epoch).",
        queryTemplate: "SELECT UNIX_TIMESTAMP(created_at) FROM Users",
        hints: ["Usa UNIX_TIMESTAMP"],
        explanation: "Interoperabilità con sistemi backend.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa UNIX_TIMESTAMP."
      },
      {
        titleTemplate: "Da Epoch a Data",
        descTemplate: "Converti 1672531200 in data.",
        queryTemplate: "SELECT FROM_UNIXTIME(1672531200)",
        hints: ["FROM_UNIXTIME"],
        explanation: "Decodifica timestamp.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa FROM_UNIXTIME."
      },
      {
        titleTemplate: "Somma Ore",
        descTemplate: "Aggiungi 36 ore alla data ordine.",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 36 HOUR) FROM Orders",
        hints: ["INTERVAL 36 HOUR"],
        explanation: "Aritmetica oltre le 24h.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa HOUR."
      },
      {
        titleTemplate: "Check Data Futura",
        descTemplate: "Flag 'Future' se data > NOW().",
        queryTemplate: "SELECT CASE WHEN order_date > NOW() THEN 'Future' ELSE 'Past' END FROM Orders",
        hints: ["Confronto con NOW()", "CASE WHEN"],
        explanation: "Validazione temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CASE WHEN."
      },
      {
        titleTemplate: "Intervallo Mesi",
        descTemplate: "Differenza in mesi (PERIOD_DIFF di formato YYYYMM).",
        queryTemplate: "SELECT PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM NOW()), EXTRACT(YEAR_MONTH FROM created_at)) FROM Users",
        hints: ["PERIOD_DIFF(YYYYMM, YYYYMM)"],
        explanation: "Calcolo differenza mesi accurato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa PERIOD_DIFF e EXTRACT."
      },
      {
        titleTemplate: "Compleanno Prossimo",
        descTemplate: "Data compleanno nell'anno corrente (Simulazione: Sostituisci anno nascita con Anno corr).",
        queryTemplate: "SELECT CONCAT(YEAR(NOW()), '-', DATE_FORMAT(created_at, '%m-%d')) FROM Users",
        hints: ["Concatena Anno Corr con Mese-Giorno nascita"],
        explanation: "Calcolo ricorrenze.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT e DATE_FORMAT."
      },
      {
        titleTemplate: "Ultimo Venerdì (Sim)",
        descTemplate: "Trova data, sottrai giorni fino a Ven (Esercizio logico).",
        queryTemplate: "SELECT DATE_SUB(NOW(), INTERVAL (WEEKDAY(NOW()) + 3) % 7 DAY)",
        hints: ["Logica complessa sui giorni settimana: Weekday(Ven)=4"],
        explanation: "Algoritmi su date.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_SUB."
      },
      {
        titleTemplate: "Data ISO",
        descTemplate: "Formatta come ISO 8601 (YYYY-MM-DDTHH:MM:SS).",
        queryTemplate: "SELECT DATE_FORMAT(NOW(), '%Y-%m-%dT%T')",
        hints: ["%T è HH:mm:ss"],
        explanation: "Standard interscambio.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_FORMAT."
      },
      {
        titleTemplate: "Secondi a Mezzanotte",
        descTemplate: "Secondi passati dall'inizio della giornata.",
        queryTemplate: "SELECT TIME_TO_SEC(TIME(NOW()))",
        hints: ["TIME_TO_SEC", "TIME(NOW)"],
        explanation: "Conversione in scalare.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TIME_TO_SEC."
      },
      {
        titleTemplate: "Mese Scorso Stesso Giorno",
        descTemplate: "Data oggi meno 1 mese.",
        queryTemplate: "SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH)",
        hints: ["DATE_SUB"],
        explanation: "Periodicità mensile.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_SUB."
      },
      {
        titleTemplate: "Time Delta",
        descTemplate: "Differenza tra due orari stabiliti.",
        queryTemplate: "SELECT TIMEDIFF('18:00:00', '12:00:00')",
        hints: ["TIMEDIFF"],
        explanation: "Aritmetica time puri.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TIMEDIFF."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Parsing Data Custom",
        descTemplate: "Converti '31/12/2023 23:59' in datetime.",
        queryTemplate: "SELECT STR_TO_DATE('31/12/2023 23:59', '%d/%m/%Y %H:%i')",
        hints: ["Usa STR_TO_DATE", "Specifier: %d/%m/%Y %H:%i"],
        explanation: "Parsing complesso con orario.",
        replacements: {},
        brokenCode: "SELECT DATE('31/12/2023 23:59')",
        debugHint: "DATE() non parsa formati custom, usa STR_TO_DATE."
      },
      {
        titleTemplate: "Primo Giorno Prossimo Mese",
        descTemplate: "Calcola il primo giorno del mese successivo.",
        queryTemplate: "SELECT DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY)",
        hints: ["LAST_DAY(NOW()) trova fine mese", "Aggiungi 1 giorno"],
        explanation: "Navigazione date logica.",
        replacements: {},
        brokenCode: "SELECT LAST_DAY(NOW()) + 1",
        debugHint: "Usa DATE_ADD o INTERVAL."
      },
      {
        titleTemplate: "Giorni Lavorativi (Sim)",
        descTemplate: "Filtra ordini fatti Lun-Ven (WeekDay 0-4).",
        queryTemplate: "SELECT * FROM Orders WHERE WEEKDAY(order_date) < 5",
        hints: ["WEEKDAY: 0=Mon, 4=Fri, 5=Sat, 6=Sun"],
        explanation: "Filtro business days.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE DAYNAME(order_date) NOT IN ('Saturday', 'Sunday')",
        debugHint: "WEEKDAY è più robusto della lingua."
      },
      {
        titleTemplate: "Età Precisa (Mesi)",
        descTemplate: "Mesi totali vissuti.",
        queryTemplate: "SELECT TIMESTAMPDIFF(MONTH, created_at, NOW()) FROM Users",
        hints: ["TIMESTAMPDIFF", "Unit: MONTH"],
        explanation: "Differenza in mesi interi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TIMESTAMPDIFF."
      },
      {
        titleTemplate: "Inizio Anno Fiscale",
        descTemplate: "Se l'anno fiscale inizia a Ottobre, calcola l'anno fiscale della data ordine.",
        queryTemplate: "SELECT YEAR(DATE_ADD(order_date, INTERVAL 3 MONTH)) FROM Orders",
        hints: ["Aggiungi 3 mesi per shiftare Ottobre a Gennaio", "Estrai l'anno"],
        explanation: "Tecnica per anni fiscali sfalsati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Shifta la data."
      },
      {
        titleTemplate: "Ultimo Giorno Anno",
        descTemplate: "Calcola il 31 Dicembre dell'anno dell'ordine.",
        queryTemplate: "SELECT MAKEDATE(YEAR(order_date), 1) + INTERVAL 1 YEAR - INTERVAL 1 DAY FROM Orders",
        hints: ["MAKEDATE(Year, 1) = 1 Gen", "Aggiungi 1 anno, togli 1 giorno"],
        explanation: "Costruzione date limiti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa logica intervalli."
      },
      {
        titleTemplate: "Secondi a Fine Mese",
        descTemplate: "Quanti secondi rimangono alla fine del mese corrente (da NOW)?",
        queryTemplate: "SELECT TIMESTAMPDIFF(SECOND, NOW(), DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY))",
        hints: ["Diff tra NOW e Inizio prox mese", "Inizio prox mese = LAST_DAY + 1 day"],
        explanation: "Precisione al secondo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Costruisci il target temporale."
      },
      {
        titleTemplate: "Is Leap Year?",
        descTemplate: "Verifica se l'anno corrente è bisestile (Feb ha 29 giorni).",
        queryTemplate: "SELECT DAY(LAST_DAY(CONCAT(YEAR(NOW()), '-02-01'))) = 29",
        hints: ["Costruisci data Febbraio", "Controlla LAST_DAY"],
        explanation: "Algoritmo bisestile SQL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla l'ultimo giorno di Febbraio."
      },
      {
        titleTemplate: "Formatta RFC 2822",
        descTemplate: "Simile a 'Sat, 01 Jan 2023 12:00:00'.",
        queryTemplate: "SELECT DATE_FORMAT(created_at, '%a, %d %b %Y %T') FROM Users",
        hints: ["%a DayShort, %b MonthShort", "%T Time"],
        explanation: "Formati standard web.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla gli specifier."
      },
      {
        titleTemplate: "Data Ordine Spostata",
        descTemplate: "Sposta la data ordine al lunedì della stessa settimana.",
        queryTemplate: "SELECT DATE_SUB(order_date, INTERVAL WEEKDAY(order_date) DAY) FROM Orders",
        hints: ["Sottrai WEEKDAY giorni"],
        explanation: "Normalizzazione a inizio settimana.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa WEEKDAY."
      },
      {
        titleTemplate: "Aggrega per Mese-Anno",
        descTemplate: "Conta ordini per ogni Mese-Anno (es. '2023-01').",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') as periodo, COUNT(*) FROM Orders GROUP BY periodo",
        hints: ["GROUP BY su stringa formattata"],
        explanation: "Reporting temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_FORMAT nel Select e Group By."
      },
      {
        titleTemplate: "Trimestre Corrente (Date)",
        descTemplate: "Data inizio trimestre corrente.",
        queryTemplate: "SELECT MAKEDATE(YEAR(NOW()), 1) + INTERVAL QUARTER(NOW()) * 3 - 3 MONTH",
        hints: ["Già visto in Medium? Ripasso logica complessa"],
        explanation: "Calcolo date finanziarie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa QUARTER."
      },
      {
        titleTemplate: "Diff Ore Lavorative (Sim)",
        descTemplate: "Diff ore ma assumendo 8h al giorno (moltiplica giorni * 8).",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) * 8 FROM Users",
        hints: ["DATEDIFF * 8"],
        explanation: "Stima effort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Moltiplica i giorni."
      },
      {
        titleTemplate: "Convert Timezone",
        descTemplate: "Simula conversione UTC a CET (+1).",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL 1 HOUR) FROM Users",
        hints: ["Aggiungi 1 ora"],
        explanation: "Timezone math semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DATE_ADD."
      },
      {
        titleTemplate: "Prossimo Compleanno (Giorni)",
        descTemplate: "Giorni mancanti al prossimo compleanno (Logica complessa).",
        queryTemplate: "SELECT DATEDIFF(CONCAT(YEAR(NOW()) + (CASE WHEN MONTH(created_at) < MONTH(NOW()) THEN 1 ELSE 0 END), '-', DATE_FORMAT(created_at, '%m-%d')), NOW()) FROM Users",
        hints: ["Se compleanno passato, target year = year+1", "Costruisci target date"],
        explanation: "Logica condizionale su date.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Gestisci anno corrente vs prossimo."
      },
      {
        titleTemplate: "Giorno Giuliano",
        descTemplate: "Converti in Julian Day number.",
        queryTemplate: "SELECT TO_DAYS(created_at) FROM Users",
        hints: ["TO_DAYS"],
        explanation: "Formato numerico continuo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TO_DAYS."
      },
      {
        titleTemplate: "From Julian",
        descTemplate: "Riconverti numero giorni in data.",
        queryTemplate: "SELECT FROM_DAYS(738500)",
        hints: ["FROM_DAYS"],
        explanation: "Inverso di TO_DAYS.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa FROM_DAYS."
      },
      {
        titleTemplate: "Aggrega per Giorno Week",
        descTemplate: "Conta utenti creati per giorno della settimana.",
        queryTemplate: "SELECT DAYNAME(created_at), COUNT(*) FROM Users GROUP BY DAYNAME(created_at)",
        hints: ["GROUP BY DAYNAME"],
        explanation: "Analisi trend settimanali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DAYNAME."
      },
      {
        titleTemplate: "Sec to Time Esteso",
        descTemplate: "Converti 100000 secondi in orario (può superare 24h).",
        queryTemplate: "SELECT SEC_TO_TIME(100000)",
        hints: ["SEC_TO_TIME"],
        explanation: "Formato HHH:MM:SS.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SEC_TO_TIME."
      },
      {
        titleTemplate: "Percentuale anno",
        descTemplate: "Quanto % dell'anno è passato?",
        queryTemplate: "SELECT ROUND(DAYOFYEAR(NOW()) / 365.25 * 100, 2)",
        hints: ["DayOfYear / 365 * 100"],
        explanation: "Statistica temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Dividi e moltiplica."
      },
      {
        titleTemplate: "Nullific Date",
        descTemplate: "Usa NULLIF se la data è '0000-00-00' (simulazione).",
        queryTemplate: "SELECT NULLIF(order_date, '0000-00-00') FROM Orders",
        hints: ["NULLIF(val, '0000-00-00')"],
        explanation: "Data cleaning.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa NULLIF."
      },
      {
        titleTemplate: "Coalesce Dates",
        descTemplate: "Se updated_at è NULL, usa created_at.",
        queryTemplate: "SELECT COALESCE(updated_at, created_at) FROM Users",
        hints: ["COALESCE(primary, fallback)"],
        explanation: "Fallback valori.",
        replacements: {},
        brokenCode: "SELECT IFNULL...",
        debugHint: "COALESCE è standard."
      },
      {
        titleTemplate: "Time tra Date",
        descTemplate: "Calcola tempo totale (Time) tra due timestamp.",
        queryTemplate: "SELECT TIMEDIFF(updated_at, created_at) FROM Users",
        hints: ["TIMEDIFF restituisce un TIME", "Non giorni"],
        explanation: "Differenza come durata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa TIMEDIFF."
      },
      {
        titleTemplate: "Aggiungi Minuti Variabili",
        descTemplate: "Aggiungi N minuti dove N = id utente.",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL id MINUTE) FROM Users",
        hints: ["INTERVAL col_name MINUTE"],
        explanation: "Intervallo dinamico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Puoi usare colonne nell'INTERVAL."
      },
      {
        titleTemplate: "Week Mode 1",
        descTemplate: "Week number dove Lunedì è primo giorno.",
        queryTemplate: "SELECT WEEK(order_date, 1) FROM Orders",
        hints: ["WEEK(date, mode)", "Mode 1 = Monday first"],
        explanation: "Standard ISO-like.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa secondo argomento di WEEK."
      },
      {
        titleTemplate: "Strano Formato",
        descTemplate: "Converti '2023.12.31' in data.",
        queryTemplate: "SELECT STR_TO_DATE('2023.12.31', '%Y.%m.%d')",
        hints: ["Specifier con punti"],
        explanation: "Parsing non standard.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa STR_TO_DATE."
      },
      {
        titleTemplate: "Ultimo Secondo Giorno",
        descTemplate: "Imposta orario a 23:59:59.",
        queryTemplate: "SELECT CONCAT(DATE(NOW()), ' 23:59:59')",
        hints: ["Concatena Data e orario fisso"],
        explanation: "Fine giornata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CONCAT."
      },
      {
        titleTemplate: "Cast Datetime",
        descTemplate: "Cast stringa esplicito (CAST .. AS DATETIME).",
        queryTemplate: "SELECT CAST('2023-01-01 12:00:00' AS DATETIME)",
        hints: ["CAST(str AS TYPE)"],
        explanation: "Explicit type conversion.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa CAST."
      },
      {
        titleTemplate: "Mixed Add",
        descTemplate: "Aggiungi 1 anno e 2 mesi.",
        queryTemplate: "SELECT DATE_ADD(DATE_ADD(created_at, INTERVAL 1 YEAR), INTERVAL 2 MONTH) FROM Users",
        hints: ["Chaining di DATE_ADD"],
        explanation: "Cumulo operazioni.",
        replacements: {},
        brokenCode: "DATE_ADD(..., INTERVAL 1 YEAR 2 MONTH)",
        debugHint: "DATE_ADD accetta un solo interval expression standard alla volta (o sintassi composta specifica non portabile)."
      },
      {
        titleTemplate: "Median Date (Sim)",
        descTemplate: "Seleziona data intermedia tra start e now.",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL DATEDIFF(NOW(), created_at)/2 DAY) FROM Users",
        hints: ["Meta differenza giorni aggiunta a start"],
        explanation: "Calcolo punto medio temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Calcola diff, dividi, aggiungi."
      }
    ],
  },
  [TopicId.Case]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Etichetta Prezzo",
        descTemplate: "Classifica i prodotti: se il prezzo è > 500 'Costoso', altrimenti 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 500 THEN 'Costoso' ELSE 'Economico' END as price_label FROM Products",
        hints: ["Usa CASE WHEN price > 500 THEN ... ELSE ... END"],
        explanation: "Il costrutto CASE permette di creare logica condizionale direttamente nella SELECT.",
        replacements: {},
        brokenCode: "SELECT name, IF(price > 500, 'Costoso', 'Economico') FROM Products",
        debugHint: "In SQL standard si usa CASE WHEN ... THEN ... END, non IF()."
      },
      {
        titleTemplate: "Stato Magazzino",
        descTemplate: "Se lo stock è 0 scrivi 'Esaurito', altrimenti 'Disponibile'.",
        queryTemplate: "SELECT name, CASE WHEN stock = 0 THEN 'Esaurito' ELSE 'Disponibile' END as availability FROM Products",
        hints: ["Controlla se stock = 0", "Usa ELSE per tutti gli altri casi"],
        explanation: "Possiamo trasformare un valore numerico in uno stato leggibile.",
        replacements: {},
        brokenCode: "SELECT name, CASE stock WHEN 0 THEN 'Esaurito' END FROM Products",
        debugHint: "Manca la clausola ELSE, quindi i prodotti disponibili avrebbero NULL."
      },
      {
        titleTemplate: "Tipo Utente",
        descTemplate: "Se is_premium è true mostra 'Gold', altrimenti 'Standard'.",
        queryTemplate: "SELECT email, CASE WHEN is_premium = true THEN 'Gold' ELSE 'Standard' END as membership FROM Users",
        hints: ["CASE WHEN is_premium ...", "Ricorda di chiudere con END"],
        explanation: "Personalizza l'output basandoti su flag booleani.",
        replacements: {},
        brokenCode: "SELECT email, CASE is_premium = true 'Gold' ELSE 'Standard' END FROM Users",
        debugHint: "Hai dimenticato la parola chiave THEN."
      },
      {
        titleTemplate: "Ordini Grandi",
        descTemplate: "Se il totale ordine > 200 etichetta come 'Big', altrimenti 'Small'.",
        queryTemplate: "SELECT id, CASE WHEN order_total > 200 THEN 'Big' ELSE 'Small' END as size FROM Orders",
        hints: ["Confronta order_total con 200"],
        explanation: "Categorizzazione semplice di valori numerici.",
        replacements: {},
        brokenCode: "SELECT id, CASE WHEN order_total > 200 'Big' ELSE 'Small' END FROM Orders",
        debugHint: "Manca THEN dopo la condizione."
      },
      {
        titleTemplate: "Traduzione Status",
        descTemplate: "Traduci status: 'Shipped' -> 'Spedito', altrimenti mantieni lo status originale.",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'Spedito' ELSE status END as status_it FROM Orders",
        hints: ["Nell'ELSE puoi usare direttamente il nome della colonna"],
        explanation: "CASE può restituire valori statici o valori di altre colonne.",
        replacements: {},
        brokenCode: "SELECT id, CASE WHEN status = 'Shipped' THEN 'Spedito' END FROM Orders",
        debugHint: "Senza ELSE, gli altri stati diventano NULL. Usa ELSE status."
      },
      {
        titleTemplate: "Controllo Stock",
        descTemplate: "Se stock < 10 scrivi 'Ordina Subito', altrimenti 'OK'.",
        queryTemplate: "SELECT name, CASE WHEN stock < 10 THEN 'Ordina Subito' ELSE 'OK' END as action FROM Products",
        hints: ["Soglia critica: 10 unità"],
        explanation: "Logica decisionale semplice per reportistica.",
        replacements: {},
        brokenCode: "SELECT name, CHECK(stock < 10, 'Ordina Subito', 'OK') FROM Products",
        debugHint: "La funzione CHECK non esiste in questo contesto. Usa CASE."
      },
      {
        titleTemplate: "Bonus Dipendenti",
        descTemplate: "Se dipartimento è 'Sales' scrivi 'Bonus', altrimenti 'Nessuno'.",
        queryTemplate: "SELECT name, CASE WHEN department = 'Sales' THEN 'Bonus' ELSE 'Nessuno' END as bonus_eligibility FROM Employees",
        hints: ["Confronta department con la stringa 'Sales'"],
        explanation: "Assegnazione condizionale basata su stringhe.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN department IS 'Sales' ...",
        debugHint: "Usa '=' per confrontare stringhe, non IS (che si usa per NULL)."
      },
      {
        titleTemplate: "Origine Utente",
        descTemplate: "Se country è 'Italy' scrivi 'Nazionale', altrimenti 'Estero'.",
        queryTemplate: "SELECT email, CASE WHEN country = 'Italy' THEN 'Nazionale' ELSE 'Estero' END as origin FROM Users",
        hints: ["CASE WHEN country = 'Italy' ..."],
        explanation: "Segmentazione geografica basilare.",
        replacements: {},
        brokenCode: "SELECT email, IF country = 'Italy' THEN ...",
        debugHint: "Sintassi errata. Inizia con CASE WHEN."
      },
      {
        titleTemplate: "Sconto Quantità",
        descTemplate: "Se quantity > 5 mostra 'Sconto Applicato', altrimenti 'Prezzo Pieno'.",
        queryTemplate: "SELECT product_id, CASE WHEN quantity > 5 THEN 'Sconto Applicato' ELSE 'Prezzo Pieno' END as discount_status FROM OrderItems",
        hints: ["Lavora sulla tabella OrderItems"],
        explanation: "Logica applicata ai dettagli dell'ordine.",
        replacements: {},
        brokenCode: "CASE quantity > 5 ...",
        debugHint: "Manca SELECT e FROM. CASE è parte della lista colonne."
      },
      {
        titleTemplate: "Analisi Prezzi",
        descTemplate: "Se prezzo è NULL (non dovrebbe succedere, ma ipotizziamo) scrivi 'Errore', altrimenti 'Valido'.",
        queryTemplate: "SELECT name, CASE WHEN price IS NULL THEN 'Errore' ELSE 'Valido' END as check_price FROM Products",
        hints: ["Usa IS NULL per il controllo"],
        explanation: "CASE è utile anche per data cleaning e validation.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN price = NULL ...",
        debugHint: "In SQL nulla è '=' a NULL. Devi usare IS NULL."
      },
      {
        titleTemplate: "Categoria Semplificata",
        descTemplate: "Se category è 'Electronics' scrivi 'Tech', altrimenti 'Altro'.",
        queryTemplate: "SELECT name, CASE WHEN category = 'Electronics' THEN 'Tech' ELSE 'Altro' END as simple_cat FROM Products",
        hints: ["Raggruppa tutto ciò che non è Electronics in 'Altro'"],
        explanation: "Esempio di raggruppamento logico di categorie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla le stringhe e la sintassi CASE."
      },
      {
        titleTemplate: "Valore Prodotto",
        descTemplate: "Se price * stock > 1000 scrivi 'Alto Valore', else 'Basso Valore'.",
        queryTemplate: "SELECT name, CASE WHEN price * stock > 1000 THEN 'Alto Valore' ELSE 'Basso Valore' END as inventory_value FROM Products",
        hints: ["Puoi fare calcoli dentro la condizione WHEN"],
        explanation: "Le condizioni del CASE possono contenere espressioni matematiche.",
        replacements: {},
        brokenCode: "SELECT name, CASE price * stock > 1000 ...",
        debugHint: "Manca WHEN prima della condizione."
      },
      {
        titleTemplate: "Manager o Staff",
        descTemplate: "Se manager_id è NULL scrivi 'Capo', altrimenti 'Staff'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'Capo' ELSE 'Staff' END as role FROM Employees",
        hints: ["manager_id IS NULL identifica chi non ha superiori"],
        explanation: "Identificazione ruoli basata su gerarchia.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa IS NULL."
      },
      {
        titleTemplate: "Ordine Recente",
        descTemplate: "Se order_date > '2023-01-01' scrivi 'Nuovo', altrimenti 'Vecchio'.",
        queryTemplate: "SELECT id, CASE WHEN order_date > '2023-01-01' THEN 'Nuovo' ELSE 'Vecchio' END as age FROM Orders",
        hints: ["Confronta date come stringhe 'YYYY-MM-DD'"],
        explanation: "Etichettatura temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Formatta la data correttamente YYYY-MM-DD."
      },
      {
        titleTemplate: "Spedizione Gratuita",
        descTemplate: "Se totale > 100 'Free Shipping', else 'Paid'.",
        queryTemplate: "SELECT id, CASE WHEN order_total > 100 THEN 'Free Shipping' ELSE 'Paid' END as shipping FROM Orders",
        hints: ["Soglia 100 euro"],
        explanation: "Logica promozionale di base.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla sintassi CASE."
      },
      {
        titleTemplate: "Reparto IT",
        descTemplate: "Se department = 'IT' scrivi 'Tech Team', else 'Business Team'.",
        queryTemplate: "SELECT name, CASE WHEN department = 'IT' THEN 'Tech Team' ELSE 'Business Team' END as team_type FROM Employees",
        hints: ["Divisione binaria dei dipartimenti"],
        explanation: "Raggruppamento organizzativo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla il nome del dipartimento."
      },
      {
        titleTemplate: "Utente Attivo",
        descTemplate: "Definiamo tutti gli utenti come 'Attivi' (Esempio banale di costante).",
        queryTemplate: "SELECT email, 'Attivo' as status FROM Users",
        hints: ["Non serve sempre CASE se il valore è fisso, ma prova con CASE WHEN 1=1..."],
        explanation: "A volte basta una stringa costante, ma col CASE puoi aggiungere logica futura.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Basta selezionare la stringa direttamente."
      },
      {
        titleTemplate: "Stock Critico",
        descTemplate: "Se stock < 5 'Critico', else 'Normale'.",
        queryTemplate: "SELECT name, CASE WHEN stock < 5 THEN 'Critico' ELSE 'Normale' END as stock_level FROM Products",
        hints: ["Soglia molto bassa"],
        explanation: "Alerting su livelli di magazzino.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la condizione < 5."
      },
      {
        titleTemplate: "Prodotti Costosi",
        descTemplate: "Se prezzo >= 1000 'Luxury', else 'Standard'.",
        queryTemplate: "SELECT name, CASE WHEN price >= 1000 THEN 'Luxury' ELSE 'Standard' END as segment FROM Products",
        hints: ["Usa >="],
        explanation: "Segmentazione di mercato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attento all'operatore >=."
      },
      {
        titleTemplate: "Email Aziendale",
        descTemplate: "Se email finisce con '.com' scrivi 'Commercial', else 'Other'.",
        queryTemplate: "SELECT email, CASE WHEN email LIKE '%.com' THEN 'Commercial' ELSE 'Other' END as domain_type FROM Users",
        hints: ["Usa LIKE '%.com'"],
        explanation: "Pattern matching dentro un CASE.",
        replacements: {},
        brokenCode: "CASE WHEN email = '*.com' ...",
        debugHint: "Per i pattern serve LIKE, non =."
      },
      {
        titleTemplate: "Ordine in Arrivo",
        descTemplate: "Se status è 'Delivered' scrivi 'Consegnato', altrimenti 'In viaggio'.",
        queryTemplate: "SELECT id, CASE WHEN status = 'Delivered' THEN 'Consegnato' ELSE 'In viaggio' END as track_status FROM Orders",
        hints: ["Focus su Delivered"],
        explanation: "Semplificazione dello stato ordine per il cliente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla lo spelling di Delivered."
      },
      {
        titleTemplate: "Prezzo Arrotondato",
        descTemplate: "Mostra 'Intero' se il prezzo non ha decimali (simulato), altrimenti 'Decimale'.",
        queryTemplate: "SELECT price, CASE WHEN price % 1 = 0 THEN 'Intero' ELSE 'Decimale' END as number_type FROM Products",
        hints: ["Usa modulo % 1"],
        explanation: "Controllo matematico sui tipi di numero.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Modulo restituisce il resto della divisione."
      },
      {
        titleTemplate: "Quantità Stock",
        descTemplate: "Se stock > 100 'Abbondante', else 'Limitato'.",
        queryTemplate: "SELECT name, CASE WHEN stock > 100 THEN 'Abbondante' ELSE 'Limitato' END as quantity_desc FROM Products",
        hints: ["Soglia 100"],
        explanation: "Descrizione qualitativa della quantità.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla sintassi."
      },
      {
        titleTemplate: "Clienti VIP",
        descTemplate: "Se id < 10 scrivi 'Early Adopter', else 'User'.",
        queryTemplate: "SELECT email, CASE WHEN id < 10 THEN 'Early Adopter' ELSE 'User' END as user_segment FROM Users",
        hints: ["ID bassi indicano i primi iscritti"],
        explanation: "Segmentazione basata su ID sequenziali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla condizione ID."
      },
      {
        titleTemplate: "Ordine Minimo",
        descTemplate: "Se total < 50 'Sotto Minimo', else 'Valido'.",
        queryTemplate: "SELECT id, CASE WHEN order_total < 50 THEN 'Sotto Minimo' ELSE 'Valido' END as validation FROM Orders",
        hints: ["Check sul minimo d'ordine"],
        explanation: "Validazione regole di business.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa < 50."
      },
      {
        titleTemplate: "Prodotti 'Lampada'",
        descTemplate: "Se il nome contiene 'Lampada' scrivi 'Illuminazione', else 'Altro'.",
        queryTemplate: "SELECT name, CASE WHEN name LIKE '%Lampada%' THEN 'Illuminazione' ELSE 'Altro' END as type FROM Products",
        hints: ["Usa LIKE con wildcards %"],
        explanation: "Categorizzazione basata sul nome.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE '%...%'."
      },
      {
        titleTemplate: "Reparto HR",
        descTemplate: "Se department è 'HR' scrivi 'Human Resources', else department.",
        queryTemplate: "SELECT name, CASE WHEN department = 'HR' THEN 'Human Resources' ELSE department END as dept_full FROM Employees",
        hints: ["Espandi sigla HR"],
        explanation: "Normalizzazione dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ELSE department per mantenere gli altri."
      },
      {
        titleTemplate: "Utenti Recenti",
        descTemplate: "Se created_at > '2023-06-01' scrivi 'Nuovo Iscritto', else 'Veterano'.",
        queryTemplate: "SELECT email, CASE WHEN created_at > '2023-06-01' THEN 'Nuovo Iscritto' ELSE 'Veterano' END as seniority FROM Users",
        hints: ["Data a metà anno"],
        explanation: "Analisi coorte temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Formato data stringa."
      },
      {
        titleTemplate: "Prezzo Simbolico",
        descTemplate: "Se prezzo = 99999.99 scrivi 'Prototipo', else 'Prodotto'.",
        queryTemplate: "SELECT name, CASE WHEN price = 99999.99 THEN 'Prototipo' ELSE 'Prodotto' END as type FROM Products",
        hints: ["Cerca il prezzo specifico del computer quantistico"],
        explanation: "Identificazione casi speciali tramite valori sentinella.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa uguaglianza esatta."
      },
      {
        titleTemplate: "Verifica Null",
        descTemplate: "Se email è NULL 'Mancante', else 'Presente'.",
        queryTemplate: "SELECT id, CASE WHEN email IS NULL THEN 'Mancante' ELSE 'Presente' END as email_check FROM Users",
        hints: ["Controllo completezza dati"],
        explanation: "Audit qualità dati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IS NULL."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Fasce di Prezzo",
        descTemplate: "Classifica i prodotti in: 'Low' (< 50), 'Mid' (50-200), 'High' (> 200).",
        queryTemplate: "SELECT name, price, CASE WHEN price < 50 THEN 'Low' WHEN price <= 200 THEN 'Mid' ELSE 'High' END as price_tier FROM Products",
        hints: ["Usa più clausole WHEN in sequenza", "L'ordine conta: SQL valuta dall'alto in basso"],
        explanation: "Gestione di range numerici multipli.",
        replacements: {},
        brokenCode: "SELECT CASE price < 50 'Low', price < 200 'Mid' ...",
        debugHint: "Sintassi errata. Usa CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END."
      },
      {
        titleTemplate: "Ordinamento Personalizzato",
        descTemplate: "Ordina gli ordini per priorità: 'Processing' (1), 'Shipped' (2), 'Delivered' (3).",
        queryTemplate: "SELECT id, status FROM Orders ORDER BY CASE WHEN status = 'Processing' THEN 1 WHEN status = 'Shipped' THEN 2 ELSE 3 END",
        hints: ["Metti il CASE dentro la clausola ORDER BY"],
        explanation: "Possiamo ordinare i risultati secondo una logica custom non alfabetica.",
        replacements: {},
        brokenCode: "SELECT id, status FROM Orders ORDER BY (status = 'Processing')",
        debugHint: "L'ordinamento booleano non basta. Usa un CASE che restituisce numeri 1, 2, 3."
      },
      {
        titleTemplate: "Coalesce Manager",
        descTemplate: "Mostra il nome del dipendente e l'ID del manager. Se manager_id è NULL, mostra 0.",
        queryTemplate: "SELECT name, COALESCE(manager_id, 0) as manager_ref FROM Employees",
        hints: ["Usa la funzione COALESCE(colonna, valore_fallback)"],
        explanation: "COALESCE restituisce il primo valore non-NULL della lista.",
        replacements: {},
        brokenCode: "SELECT name, manager_id OR 0 FROM Employees",
        debugHint: "In SQL non si usa OR per i default. Usa COALESCE()."
      },
      {
        titleTemplate: "Calcolo Sicuro",
        descTemplate: "Calcola il valore 'Price / Stock'. Usa NULLIF per evitare divisione per zero se stock è 0.",
        queryTemplate: "SELECT name, price / NULLIF(stock, 0) as ratio FROM Products",
        hints: ["NULLIF(a, b) restituisce NULL se a = b", "Dividere per NULL dà NULL (non errore)"],
        explanation: "NULLIF è essenziale per evitare errori di 'Division by zero'.",
        replacements: {},
        brokenCode: "SELECT price / stock FROM Products",
        debugHint: "Se stock è 0, questa query darà errore o Infinity. Proteggila con NULLIF."
      },
      {
        titleTemplate: "Sconto Membership",
        descTemplate: "Calcola il prezzo scontato: 20% per Premium, 0% per gli altri.",
        queryTemplate: "SELECT id, CASE WHEN is_premium = true THEN '20%' ELSE '0%' END as discount, CASE WHEN is_premium = true THEN 0.8 ELSE 1.0 END * 100 as effective_price_pct FROM Users",
        hints: ["Puoi usare il CASE per determinare un moltiplicatore"],
        explanation: "Applicazione di logica di business per calcoli dinamici.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Imposta il moltiplicatore nel CASE."
      },
      {
        titleTemplate: "Raggruppamento Stati",
        descTemplate: "Raggruppa gli stati ordini in 'Active' (Processing, Shipped) e 'Completed' (Delivered).",
        queryTemplate: "SELECT id, CASE WHEN status IN ('Processing', 'Shipped') THEN 'Active' ELSE 'Completed' END as state_group FROM Orders",
        hints: ["Puoi usare IN dentro la condizione WHEN"],
        explanation: "Semplificazione di stati operativi complessi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa IN ('Processing', 'Shipped')."
      },
      {
        titleTemplate: "Priorità Department",
        descTemplate: "Ordina dipendenti: prima 'Sales', poi 'IT', poi gli altri.",
        queryTemplate: "SELECT name, department FROM Employees ORDER BY CASE WHEN department = 'Sales' THEN 1 WHEN department = 'IT' THEN 2 ELSE 3 END",
        hints: ["CASE nell'ORDER BY"],
        explanation: "Ordinamento gerarchico arbitrario.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Assegna numeri bassi a chi vuoi vedere prima."
      },
      {
        titleTemplate: "NullIf Confronto",
        descTemplate: "Confronta stock e price. Se sono uguali restituisci NULL, altrimenti stock.",
        queryTemplate: "SELECT NULLIF(stock, price) FROM Products",
        hints: ["Esercizio teorico su NULLIF"],
        explanation: "Se i due valori sono uguali, ottieni NULL.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NULLIF(val1, val2)."
      },
      {
        titleTemplate: "Rating Prodotto",
        descTemplate: "Assegna stelle in base al prezzo: <50 '*', <100 '**', else '***'.",
        queryTemplate: "SELECT name, CASE WHEN price < 50 THEN '*' WHEN price < 100 THEN '**' ELSE '***' END as stars FROM Products",
        hints: ["Usa stringhe come output del CASE"],
        explanation: "Visualizzazione grafica testuale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla le soglie."
      },
      {
        titleTemplate: "Spese di Spedizione",
        descTemplate: "Se totale > 100 spedizione 0, tra 50 e 100 spedizione 5, altrimenti 10.",
        queryTemplate: "SELECT id, CASE WHEN order_total > 100 THEN 0 WHEN order_total >= 50 THEN 5 ELSE 10 END as shipping_cost FROM Orders",
        hints: ["Attento all'ordine delle condizioni (dal più restrittivo o viceversa)"],
        explanation: "Logica a scaglioni tipica dell'e-commerce.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Se metti condition > 50 prima di > 100, la logica potrebbe rompersi."
      },
      {
        titleTemplate: "Età Account",
        descTemplate: "Se creato prima del 2022 'Vintage', 2022-2023 'Established', dopo 'New'.",
        queryTemplate: "SELECT email, CASE WHEN created_at < '2022-01-01' THEN 'Vintage' WHEN created_at < '2024-01-01' THEN 'Established' ELSE 'New' END as age_group FROM Users",
        hints: ["Confronta date stringa"],
        explanation: "Segmentazione storica della user base.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa formato YYYY-MM-DD."
      },
      {
        titleTemplate: "Category Group",
        descTemplate: "Se category inizia con 'E' o 'C' -> 'Tech', altrimenti 'General'.",
        queryTemplate: "SELECT name, CASE WHEN category LIKE 'E%' OR category LIKE 'C%' THEN 'Tech' ELSE 'General' END as macro_cat FROM Products",
        hints: ["Usa OR tra condizioni LIKE"],
        explanation: "Raggruppamento per pattern di testo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE 'E%' OR LIKE 'C%'."
      },
      {
        titleTemplate: "Valore Magazzino",
        descTemplate: "Calcola valore asset: se stock > 0 usa price * stock, se stock è 0 usa 0.",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN price * stock ELSE 0 END as full_value FROM Products",
        hints: ["Moltiplica solo se presente"],
        explanation: "Evitare calcoli inutili o concettualmente errati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Case When Stock > 0."
      },
      {
        titleTemplate: "Identificativo",
        descTemplate: "Mostra 'Nome: [name]' se name non è null, altrimenti 'ID: [id]'.",
        queryTemplate: "SELECT CASE WHEN name IS NOT NULL THEN 'Nome: ' || name ELSE 'ID: ' || id END as display_label FROM Users",
        hints: ["Usa operatore di concatenazione || (o + in alcuni SQL, qui standard || o concat)"],
        explanation: "Logica di fallback per display UI.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa IS NOT NULL."
      },
      {
        titleTemplate: "Stagionalità",
        descTemplate: "Se mese ordine (MONTH(order_date)) è 12 o 1 -> 'Inverno', 6-8 -> 'Estate', else 'Altro'.",
        queryTemplate: "SELECT id, CASE WHEN MONTH(order_date) IN (12, 1) THEN 'Inverno' WHEN MONTH(order_date) BETWEEN 6 AND 8 THEN 'Estate' ELSE 'Altro' END as season FROM Orders",
        hints: ["Usa MONTH() e BETWEEN"],
        explanation: "Arricchimento dati temporali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MONTH() restituisce un intero 1-12."
      },
      {
        titleTemplate: "Status Prodotto",
        descTemplate: "Se stock > 50 'High', stock > 20 'Med', stock > 0 'Low', 0 'None'.",
        queryTemplate: "SELECT name, CASE WHEN stock > 50 THEN 'High' WHEN stock > 20 THEN 'Med' WHEN stock > 0 THEN 'Low' ELSE 'None' END as inventory FROM Products",
        hints: ["4 stati possibili"],
        explanation: "Granularità fine nello stato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla l'ordine decrescente delle soglie."
      },
      {
        titleTemplate: "Utente Completo",
        descTemplate: "Se user ha sia email che country -> 'Complete', else 'Partial'.",
        queryTemplate: "SELECT id, CASE WHEN email IS NOT NULL AND country IS NOT NULL THEN 'Complete' ELSE 'Partial' END as profile_status FROM Users",
        hints: ["Usa AND tra controlli NOT NULL"],
        explanation: "Data quality check su più colonne.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IS NOT NULL AND ..."
      },
      {
        titleTemplate: "Formato Nome",
        descTemplate: "Se il nome è lungo (>15 chars) troncalo e aggiungi '...', altrimenti mostralo intero.",
        queryTemplate: "SELECT CASE WHEN LENGTH(name) > 15 THEN SUBSTRING(name, 1, 15) || '...' ELSE name END as short_name FROM Products",
        hints: ["Usa LENGTH() e SUBSTRING()"],
        explanation: "Manipolazione stringhe condizionale per UI.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LENGTH(col) > 15."
      },
      {
        titleTemplate: "Incremento Simulato",
        descTemplate: "Simula un aumento di prezzo del 10% solo per i prodotti 'Electronics'.",
        queryTemplate: "SELECT name, price as old_price, CASE WHEN category = 'Electronics' THEN price * 1.10 ELSE price END as new_price FROM Products",
        hints: ["Calcolo condizionale"],
        explanation: "Preview di update massivi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Moltiplica per 1.10."
      },
      {
        titleTemplate: "Dettaglio Ordine",
        descTemplate: "In OrderItems, se quantity > 10 'Bulk', > 5 'Pack', else 'Single'.",
        queryTemplate: "SELECT id, CASE WHEN quantity > 10 THEN 'Bulk' WHEN quantity > 5 THEN 'Pack' ELSE 'Single' END as type FROM OrderItems",
        hints: ["Categorizzazione quantità"],
        explanation: "Analisi tipo acquisto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Case quantity..."
      },
      {
        titleTemplate: "Livello Spesa",
        descTemplate: "Basato su totale ordine: >1000 'Whlae', >500 'Heavy', >100 'Regular', else 'Light'.",
        queryTemplate: "SELECT id, CASE WHEN order_total > 1000 THEN 'Whale' WHEN order_total > 500 THEN 'Heavy' WHEN order_total > 100 THEN 'Regular' ELSE 'Light' END as spender_type FROM Orders",
        hints: ["Segmentazione clienti transaction-based"],
        explanation: "RFM Analysis component (Monetary).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Ordine decrescente."
      },
      {
        titleTemplate: "Regione Fiscale",
        descTemplate: "Se country='Italy' -> 'IT-Tax', country='USA' -> 'US-Tax', else 'World-Tax'.",
        queryTemplate: "SELECT email, CASE country WHEN 'Italy' THEN 'IT-Tax' WHEN 'USA' THEN 'US-Tax' ELSE 'World-Tax' END as tax_regime FROM Users",
        hints: ["Puoi usare la forma 'CASE colonna WHEN valore ...' (Simple Case)"],
        explanation: "Il 'Simple Case' è una sintassi alternativa più compatta per uguaglianze.",
        replacements: {},
        brokenCode: "CASE country = 'Italy' ...",
        debugHint: "Nella forma semplice, non ripetere il nome colonna o l'operatore =."
      },
      {
        titleTemplate: "Priority Flag",
        descTemplate: "Se is_premium AND total > 500 -> 'High Priority'.",
        queryTemplate: "SELECT id, CASE WHEN (SELECT is_premium FROM Users WHERE id = Orders.user_id) AND order_total > 500 THEN 'High Priority' ELSE 'Standard' END FROM Orders",
        hints: ["Subquery nel CASE o Join implicita", "Ma qui stiamo su Orders... prova a usare dati disponibili o una JOIN"],
        explanation: "Logica multi-tabella nel CASE (avanzato per Medium ma fattibile con subquery scalare).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Prova con una subquery semplice per is_premium."
      },
      {
        titleTemplate: "Email Provider",
        descTemplate: "Estrai il provider: se contiene 'gmail' -> 'Google', 'yahoo' -> 'Yahoo', else 'Other'.",
        queryTemplate: "SELECT email, CASE WHEN email LIKE '%gmail%' THEN 'Google' WHEN email LIKE '%yahoo%' THEN 'Yahoo' ELSE 'Other' END as provider FROM Users",
        hints: ["LIKE '%text%'"],
        explanation: "Parsing grezzo di stringhe.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIKE con %."
      },
      {
        titleTemplate: "Check Iscrizione",
        descTemplate: "Se created_at IS NULL restituisci 'Data Ignota' usando COALESCE (simulato con cast).",
        queryTemplate: "SELECT email, COALESCE(CAST(created_at AS VARCHAR), 'Data Ignota') FROM Users",
        hints: ["COALESCE richiede tipi compatibili, quindi casta la data a stringa"],
        explanation: "Gestione tipi in COALESCE.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COALESCE(created_at, 'Ignoto') potrebbe fallire se i tipi sono diversi."
      },
      {
        titleTemplate: "Reparto Sconosciuto",
        descTemplate: "Se department è NULL o vuoto -> 'Unassigned'.",
        queryTemplate: "SELECT name, CASE WHEN department IS NULL OR department = '' THEN 'Unassigned' ELSE department END FROM Employees",
        hints: ["Gestione doppio caso di assenza dati"],
        explanation: "Data cleaning robusto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OR department = ''."
      },
      {
        titleTemplate: "Fascia Oraria",
        descTemplate: "Ipotizzando una colonna time (qui usiamo order_date come dummy), se giorno pari 'Pari', dispari 'Dispari'.",
        queryTemplate: "SELECT id, CASE WHEN DAY(order_date) % 2 = 0 THEN 'Pari' ELSE 'Dispari' END as day_type FROM Orders",
        hints: ["DAY() e modulo % 2"],
        explanation: "Logica su date.",
        replacements: {},
        brokenCode: "...",
        debugHint: "% 2."
      },
      {
        titleTemplate: "Top Manager",
        descTemplate: "Se id è 1 -> 'CEO', se id < 5 -> 'Executive', else 'Manager'.",
        queryTemplate: "SELECT name, CASE WHEN id = 1 THEN 'CEO' WHEN id < 5 THEN 'Executive' ELSE 'Manager' END as title FROM Employees WHERE manager_id IS NULL",
        hints: ["Filtra solo i manager (manager_id null o in lista)"],
        explanation: "Gerarchia custom.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Where manager_id IS NULL."
      },
      {
        titleTemplate: "Ordine Anomalo",
        descTemplate: "Se total=0 -> 'Gratis', total < 10 -> 'Micro', total > 2000 -> 'Anomalo'.",
        queryTemplate: "SELECT id, CASE WHEN order_total = 0 THEN 'Gratis' WHEN order_total < 10 THEN 'Micro' WHEN order_total > 2000 THEN 'Anomalo' ELSE 'Ok' END as audit FROM Orders",
        hints: ["Audit finanziario"],
        explanation: "Rilevamento outlier.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla tutte le condizioni."
      },
      {
        titleTemplate: "Valuta",
        descTemplate: "Aggiungi simbolo valuta: se country='USA' -> '$', 'UK' -> '£', else '€'.",
        queryTemplate: "SELECT CASE country WHEN 'USA' THEN '$' WHEN 'UK' THEN '£' ELSE '€' END || price as localized_price FROM Products CROSS JOIN (SELECT 'Italy' as country) as dummy LIMIT 5",
        hints: ["Esercizio simulato di localizzazione"],
        explanation: "Formattazione output per locale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "La logica è corretta, attenzione alla JOIN simulata."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Pivot Vendite",
        descTemplate: "Crea una tabella pivot che conta gli ordini 'Shipped' e 'Delivered' in una sola riga.",
        queryTemplate: "SELECT SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) as shipped_count, SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered_count FROM Orders",
        hints: ["Usa SUM(CASE...) per ogni colonna pivot", "Non serve GROUP BY se vuoi il totale globale"],
        explanation: "La tecnica del Pivot permette di ruotare i dati da righe a colonne.",
        replacements: {},
        brokenCode: "SELECT COUNT(IF status='Shipped')...",
        debugHint: "Usa SUM(CASE WHEN condition THEN 1 ELSE 0 END)."
      },
      {
        titleTemplate: "Segmentazione RFM",
        descTemplate: "Classifica clienti: 'VIP' se spesa > 1000 e ordini > 5 (simulato), else 'Regular'.",
        queryTemplate: "SELECT u.id, CASE WHEN SUM(o.order_total) > 1000 THEN 'VIP' ELSE 'Regular' END as segment FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.id",
        hints: ["Serve JOIN e GROUP BY", "Il CASE va sull'aggregato SUM(order_total)"],
        explanation: "Analisi del valore del cliente basata su metriche aggregate.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CASE WHEN SUM(...) > 1000."
      },
      {
        titleTemplate: "Analisi Cohort",
        descTemplate: "Raggruppa utenti per anno di iscrizione: 'Cohort 2022', 'Cohort 2023', etc.",
        queryTemplate: "SELECT CASE WHEN created_at >= '2022-01-01' AND created_at < '2023-01-01' THEN '2022' WHEN created_at >= '2023-01-01' THEN '2023' ELSE 'Pre-2022' END as cohort, COUNT(*) FROM Users GROUP BY 1",
        hints: ["GROUP BY 1 raggruppa per la prima colonna (il CASE)", "Definisci i range temporali"],
        explanation: "Creazione di gruppi logici basati su date.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa i riferimenti posizionali nel GROUP BY o ripeti il CASE."
      },
      {
        titleTemplate: "Priorità Restock",
        descTemplate: "Complex Priority: Critical (stock<5 AND price>100), Urgent (stock<10), Normal.",
        queryTemplate: "SELECT name, CASE WHEN stock < 5 AND price > 100 THEN 'Critical' WHEN stock < 10 THEN 'Urgent' ELSE 'Normal' END as priority FROM Products",
        hints: ["Logica annidata o sequenziale", "Critical ha due condizioni AND"],
        explanation: "Matrice di decisione basata su più variabili.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Verifica prima la condizione più specifica (Critical)."
      },
      {
        titleTemplate: "Sconto Dinamico",
        descTemplate: "Calcola nuovo prezzo: -10% se stock > 100, -5% se category='Home', else full price.",
        queryTemplate: "SELECT name, price * (CASE WHEN stock > 100 THEN 0.9 WHEN category = 'Home' THEN 0.95 ELSE 1 END) as promo_price FROM Products",
        hints: ["Il CASE restituisce il moltiplicatore", "Moltiplica price per il risultato del CASE"],
        explanation: "Applicazione di regole di pricing complesse.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Price * CASE ..."
      },
      {
        titleTemplate: "Performance Spedizioni",
        descTemplate: "Calcola tempo spedizione stimato: se status 'Shipped' -> 'In Transito', Delivered -> 'Chiuso', Processing + data vecchia -> 'In Ritardo'.",
        queryTemplate: "SELECT id, CASE WHEN status = 'Delivered' THEN 'Chiuso' WHEN status = 'Processing' AND order_date < '2023-01-01' THEN 'In Ritardo' ELSE 'In Corso' END as kpi FROM Orders",
        hints: ["Combina status e date"],
        explanation: "Monitoraggio SLA.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Status = 'Processing' AND date < ..."
      },
      {
        titleTemplate: "Bundle Mix",
        descTemplate: "Classifica ordini: 'Solo Tech' se ha solo Electronics, 'Misto' se ha altro.",
        queryTemplate: "SELECT o.id, CASE WHEN MIN(p.category) = 'Electronics' AND MAX(p.category) = 'Electronics' THEN 'Solo Tech' ELSE 'Misto' END as mix FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id",
        hints: ["Se MIN(cat) == MAX(cat) == 'Electronics', allora ci sono solo prodotti Electronics", "Serve tripla JOIN"],
        explanation: "Logica avanzata sugli insiemi tramite aggregazione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MIN/MAX su stringhe aiutano a capire l'omogeneità."
      },
      {
        titleTemplate: "Math Safety",
        descTemplate: "Calcola ROI: (Price - 50) / Price. Gestisci divisione per zero e casi negativi (ROI 0).",
        queryTemplate: "SELECT name, CASE WHEN price = 0 THEN 0 WHEN (price - 50) < 0 THEN 0 ELSE (price - 50) / price END as roi FROM Products",
        hints: ["Gestisci denominatore zero", "Gestisci numeratore negativo"],
        explanation: "Formule finanziarie robuste.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Prima controlla price = 0."
      },
      {
        titleTemplate: "User Score",
        descTemplate: "Score utente: +10 punti se Premium, +1 punto per ogni ordine.",
        queryTemplate: "SELECT u.email, (CASE WHEN is_premium THEN 10 ELSE 0 END) + (SELECT COUNT(*) FROM Orders WHERE user_id = u.id) as score FROM Users u",
        hints: ["Subquery scalare sommata a un CASE", "Oppure JOIN e GROUP BY"],
        explanation: "Scoring system composito.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Somma i due contributi."
      },
      {
        titleTemplate: "Pivot Categorie",
        descTemplate: "Conta quanti prodotti 'Electronics' e quanti 'Home' per ogni ordine.",
        queryTemplate: "SELECT order_id, SUM(CASE WHEN category = 'Electronics' THEN 1 ELSE 0 END) as tech_items, SUM(CASE WHEN category = 'Home' THEN 1 ELSE 0 END) as home_items FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY order_id",
        hints: ["Tipico pivoting", "Join necessaria per category"],
        explanation: "Analisi composizione carrello.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM(CASE...) con GROUP BY order_id."
      },
      {
        titleTemplate: "Fascia Anzianità",
        descTemplate: "Calcola anni di servizio e classifica: <1 'Junior', 1-3 'Mid', >3 'Senior'.",
        queryTemplate: "SELECT name, CASE WHEN DATEDIFF(NOW(), hire_date) < 365 THEN 'Junior' WHEN DATEDIFF(NOW(), hire_date) < 1095 THEN 'Mid' ELSE 'Senior' END as level FROM Employees",
        hints: ["DATEDIFF restuituisce giorni", "365 giorni = 1 anno"],
        explanation: "Calcolo derivato da date.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DATEDIFF(end, start)."
      },
      {
        titleTemplate: "Spesa Media Tier",
        descTemplate: "Calcola AVG spesa e etichetta: > Media Globale 'Sopra Media', else 'Sotto'.",
        queryTemplate: "SELECT id, order_total, CASE WHEN order_total > (SELECT AVG(order_total) FROM Orders) THEN 'Sopra Media' ELSE 'Sotto Media' END as comparison FROM Orders",
        hints: ["Subquery per la media globale", "Confronto riga per riga"],
        explanation: "Benchmarking relativo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Total > (SELECT AVG...)."
      },
      {
        titleTemplate: "Stato Fornitura",
        descTemplate: "Se nessun prodotto ha stock < 10 'Ottimo', se qualcuno < 10 'Attenzione'. (Pivot booleano globale).",
        queryTemplate: "SELECT CASE WHEN SUM(CASE WHEN stock < 10 THEN 1 ELSE 0 END) > 0 THEN 'Attenzione' ELSE 'Ottimo' END as global_status FROM Products",
        hints: ["Conta i prodotti a rischio", "Se count > 0 allora status risk"],
        explanation: "KPI aggregato a livello di sistema.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM(...) > 0."
      },
      {
        titleTemplate: "Clean Email",
        descTemplate: "Formatta email: se contiene 'test' o 'fake' -> NULLIF(email, email) [cioè NULL], else email.",
        queryTemplate: "SELECT id, CASE WHEN email LIKE '%test%' OR email LIKE '%fake%' THEN NULL ELSE email END as valid_email FROM Users",
        hints: ["Data cleaning logico", "Imposta a NULL i dati sporchi"],
        explanation: "Sanitizzazione dati in lettura.",
        replacements: {},
        brokenCode: "...",
        debugHint: "THEN NULL."
      },
      {
        titleTemplate: "Vendite Trimestrali",
        descTemplate: "Assegna trimestre: Q1 (Jan-Mar), Q2 (Apr-Jun)...",
        queryTemplate: "SELECT id, CASE WHEN MONTH(order_date) <= 3 THEN 'Q1' WHEN MONTH(order_date) <= 6 THEN 'Q2' WHEN MONTH(order_date) <= 9 THEN 'Q3' ELSE 'Q4' END as quarter FROM Orders",
        hints: ["Usa MONTH()", "Logica a scaglioni"],
        explanation: "Reporting finanziario.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MONTH()."
      },
      {
        titleTemplate: "Pari o Dispari",
        descTemplate: "Controlla ID: Se ID pari 'Even', dispari 'Odd'.",
        queryTemplate: "SELECT id, CASE WHEN id % 2 = 0 THEN 'Even' ELSE 'Odd' END as parity FROM Users",
        hints: ["Operatore modulo %"],
        explanation: "Logica aritmetica per A/B testing splitting.",
        replacements: {},
        brokenCode: "...",
        debugHint: "% 2 = 0."
      },
      {
        titleTemplate: "Gerarchia Completa",
        descTemplate: "Se manager IS NULL -> 'Root', manager IN (Select manager_id...) -> 'Middle', else 'Leaf'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'Root' WHEN id IN (SELECT manager_id FROM Employees) THEN 'Middle' ELSE 'Leaf' END as node_type FROM Employees",
        hints: ["Subquery per vedere se è manager di qualcuno", "Gerarchia ad albero"],
        explanation: "Analisi struttura ad albero/grafo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IN (SELECT manager_id...)."
      },
      {
        titleTemplate: "Validazione CAP",
        descTemplate: "Se country='Italy' e region è NULL -> 'Error', else 'OK'.",
        queryTemplate: "SELECT email, CASE WHEN country='Italy' AND (country IS NULL OR country = 'Italy') THEN 'Check' ELSE 'OK' END as validation FROM Users",
        hints: ["Esercizio simulato (non abbiamo region)", "Simuliamo logica complessa"],
        explanation: "Validazione condizionale cross-field.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Logica AND."
      },
      {
        titleTemplate: "Trend Ordini",
        descTemplate: "Confronta totale con ordine precedente (Simuliamo con LAG o self join... qui usiamo media utente). Se > avg 'Up', < avg 'Down'.",
        queryTemplate: "SELECT o.id, CASE WHEN o.order_total > u_avg.avg_spent THEN 'Up' ELSE 'Down' END as trend FROM Orders o JOIN (SELECT user_id, AVG(order_total) as avg_spent FROM Orders GROUP BY user_id) u_avg ON o.user_id = u_avg.user_id",
        hints: ["Calcola media per utente", "Joina e confronta"],
        explanation: "Analisi trend personalizzato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join con subquery aggregata."
      },
      {
        titleTemplate: "Prodotto Civetta",
        descTemplate: "Se price < 20 e category='Electronics' -> 'Loss Leader', else 'Standard'.",
        queryTemplate: "SELECT name, CASE WHEN price < 20 AND category = 'Electronics' THEN 'Loss Leader' ELSE 'Standard' END as strategy FROM Products",
        hints: ["Business logic specifica"],
        explanation: "Identificazione strategie di pricing.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND condition."
      },
      {
        titleTemplate: "Complex Sorting",
        descTemplate: "Ordina per: Premium Users first, then High Value Orders, then Date.",
        queryTemplate: "SELECT o.id FROM Orders o JOIN Users u ON o.user_id = u.id ORDER BY CASE WHEN u.is_premium THEN 0 ELSE 1 END, CASE WHEN o.order_total > 500 THEN 0 ELSE 1 END, o.order_date DESC",
        hints: ["Case multipli in Order By"],
        explanation: "Ranking multicriterio.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Order By Case1, Case2."
      },
      {
        titleTemplate: "Weekend Sales",
        descTemplate: "Se giorno settimana Sab-Dom -> 'Weekend', else 'Weekday'.",
        queryTemplate: "SELECT id, CASE WHEN WEEKDAY(order_date) IN (5, 6) THEN 'Weekend' ELSE 'Weekday' END as day_type FROM Orders",
        hints: ["WEEKDAY() o DAYOFWEEK() - in AlaSQL WEEKDAY 0=Mon, 5=Sat, 6=Sun"],
        explanation: "Analisi temporale settimanale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "WEEKDAY() returns 0-6."
      },
      {
        titleTemplate: "Tax Calculation",
        descTemplate: "Applica IVA: 22% Italia, 20% UK, 0% USA.",
        queryTemplate: "SELECT id, order_total * (CASE WHEN (SELECT country FROM Users WHERE id=o.user_id) = 'Italy' THEN 0.22 WHEN (SELECT country FROM Users WHERE id=o.user_id) = 'UK' THEN 0.20 ELSE 0 END) as tax FROM Orders o",
        hints: ["Subquery scalare per paese utente"],
        explanation: "Calcolo imposte dinamico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Select country where id=..."
      },
      {
        titleTemplate: "Fidelity Bonus",
        descTemplate: "Se ordini effettuati > 2 e totale speso > 500 -> 'Gold', >2 ordini -> 'Silver', else 'Bronze'.",
        queryTemplate: "SELECT user_id, CASE WHEN COUNT(*) > 2 AND SUM(order_total) > 500 THEN 'Gold' WHEN COUNT(*) > 2 THEN 'Silver' ELSE 'Bronze' END as tier FROM Orders GROUP BY user_id",
        hints: ["Case su aggregati (COUNT, SUM)", "Group By user_id"],
        explanation: "Tier system basato su aggregati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(*)."
      },
      {
        titleTemplate: "Inventory Health",
        descTemplate: "Se stock=0 'OOS', stock < avg_stock/2 'Low', stock > avg*2 'Overstock', else 'Healthy'.",
        queryTemplate: "SELECT name, CASE WHEN stock = 0 THEN 'OOS' WHEN stock < (SELECT AVG(stock) FROM Products)/2 THEN 'Low' WHEN stock > (SELECT AVG(stock) FROM Products)*2 THEN 'Overstock' ELSE 'Healthy' END as health FROM Products",
        hints: ["Confronto con subquery media"],
        explanation: "Gestione inventario avanzata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SELECT AVG(stock)."
      },
      {
        titleTemplate: "Customer Type",
        descTemplate: "B2B se email ha dominio aziendale (non gmail/yahoo), B2C altrimenti.",
        queryTemplate: "SELECT email, CASE WHEN email NOT LIKE '%gmail%' AND email NOT LIKE '%yahoo%' THEN 'B2B' ELSE 'B2C' END as type FROM Users",
        hints: ["NOT LIKE"],
        explanation: "Inferenza tipo cliente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT LIKE."
      },
      {
        titleTemplate: "Discount Recovery",
        descTemplate: "Calcola quanto sconto recuperare: se total < 100 e usato sconto (simulato) -> 'Recupera'.",
        queryTemplate: "SELECT id, CASE WHEN order_total < 100 THEN 'Surcharge' ELSE 'No Action' END FROM Orders",
        hints: ["Logica semplice"],
        explanation: "Business rule enforcement.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Total < 100."
      },
      {
        titleTemplate: "Shipping Zone",
        descTemplate: "Italy -> Zone 1, Europe (simulated) -> Zone 2, World -> Zone 3.",
        queryTemplate: "SELECT email, CASE country WHEN 'Italy' THEN 'Zone 1' WHEN 'France' THEN 'Zone 2' WHEN 'Germany' THEN 'Zone 2' ELSE 'Zone 3' END as zone FROM Users",
        hints: ["Case semplice o searched"],
        explanation: "Zonizzazione logistica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Case country."
      },
      {
        titleTemplate: "Product Age",
        descTemplate: "Se ID < 10 'Launch Product', ID > 40 'New Arrival'.",
        queryTemplate: "SELECT name, CASE WHEN id <= 10 THEN 'Launch' WHEN id >= 40 THEN 'New' ELSE 'Standard' END as lifecycle FROM Products",
        hints: ["ID come proxy temporale"],
        explanation: "Analisi catalogo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ID <= 10."
      },
      {
        titleTemplate: "Data Quality Score",
        descTemplate: "100 - (10 se email null) - (20 se country null).",
        queryTemplate: "SELECT id, 100 - (CASE WHEN email IS NULL THEN 10 ELSE 0 END) - (CASE WHEN country IS NULL THEN 20 ELSE 0 END) as quality_score FROM Users",
        hints: ["Sottrazione condizionale"],
        explanation: "Scoring algorithm.",
        replacements: {},
        brokenCode: "...",
        debugHint: "100 - CASE..."
      }
    ],
  },
  [TopicId.Joins]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Chi ha ordinato cosa?",
        descTemplate: "Seleziona il nome dell'utente e l'ID dei suoi ordini.",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Usa JOIN tra Users e Orders", "Collega le tabelle tramite Users.id = Orders.user_id"],
        explanation: "La JOIN collega le righe di due tabelle basandosi su una colonna comune.",
        replacements: {},
        brokenCode: "SELECT Users.name, Orders.id FROM Users, Orders",
        debugHint: "Manca la condizione di join (ON ...). Senza di essa ottieni un prodotto cartesiano."
      },
      {
        titleTemplate: "Prodotti Ordinati",
        descTemplate: "Mostra l'ID dell'ordine e il nome del prodotto per ogni riga ordine.",
        queryTemplate: "SELECT OrderItems.order_id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["OrderItems contiene product_id", "Products contiene name"],
        explanation: "Colleghiamo i dettagli dell'ordine al catalogo prodotti.",
        replacements: {},
        brokenCode: "SELECT order_id, name FROM OrderItems JOIN Products",
        debugHint: "Manca la clausola ON per specificare come unire le tabelle."
      },
      {
        titleTemplate: "Email e Ordini",
        descTemplate: "Ottieni l'email dell'utente per ogni ordine effettuato.",
        queryTemplate: "SELECT Users.email, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["JOIN Orders ON Users.id = Orders.user_id"],
        explanation: "Recuperiamo dati utente (email) partendo dalla tabella ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ON Users.id = Orders.user_id."
      },
      {
        titleTemplate: "Prezzo degli Articoli",
        descTemplate: "Per ogni voce d'ordine (OrderItems), mostra l'ID e il prezzo unitario dal catalogo.",
        queryTemplate: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Usa OrderItems come punto di partenza", "Prendi il prezzo da Products"],
        explanation: "Accediamo alle proprietà del prodotto tramite la foreign key.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Collega product_id con id."
      },
      {
        titleTemplate: "Totale Ordine e Utente",
        descTemplate: "Mostra lo User Name e il totale (order_total) per ogni ordine.",
        queryTemplate: "SELECT Users.name, Orders.order_total FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Seleziona name da Users e order_total da Orders"],
        explanation: "Combiniamo informazioni anagrafiche e transazionali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "La JOIN va fatta su user_id."
      },
      {
        titleTemplate: "Categoria Prodotti Venduti",
        descTemplate: "Elenca le categorie dei prodotti presenti in OrderItems.",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Join tra OrderItems e Products"],
        explanation: "Vediamo a quali categorie appartengono gli oggetti venduti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa JOIN Products ON ..."
      },
      {
        titleTemplate: "Ordini Italiani",
        descTemplate: "Seleziona gli ID degli ordini effettuati da utenti italiani ('Italy').",
        queryTemplate: "SELECT Orders.id FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.country = 'Italy'",
        hints: ["Fai la JOIN", "Aggiungi WHERE country = 'Italy'"],
        explanation: "Possiamo filtrare i risultati della join come una normale tabella.",
        replacements: {},
        brokenCode: "SELECT Orders.id FROM Orders WHERE Users.country = 'Italy'",
        debugHint: "Non puoi usare Users.country se non hai fatto la JOIN con Users."
      },
      {
        titleTemplate: "Dettagli Ordine Completi",
        descTemplate: "Mostra ID ordine, Nome Prodotto e Quantità per ogni riga.",
        queryTemplate: "SELECT OrderItems.order_id, Products.name, OrderItems.quantity FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Seleziona colonne da entrambe le tabelle"],
        explanation: "Vista dettagliata delle righe d'ordine.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join su product_id = id."
      },
      {
        titleTemplate: "Ordini recenti con Nome",
        descTemplate: "Mostra nome utente e data ordine per ordini dopo il 2023-01-01.",
        queryTemplate: "SELECT Users.name, Orders.order_date FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.order_date > '2023-01-01'",
        hints: ["JOIN standard", "Filtro sulla data"],
        explanation: "Join filtrata temporalmente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Prima JOIN poi WHERE."
      },
      {
        titleTemplate: "Manager Dipendente",
        descTemplate: "Per ogni dipendente, mostra il suo nome e l'ID del suo manager (Self Join concettuale ma qui basta select semplice se non chiesto nome manager). Richiesta: Mostra nome e manager_id, escludendo chi non ha manager.",
        queryTemplate: "SELECT name, manager_id FROM Employees WHERE manager_id IS NOT NULL",
        hints: ["Basta filtrare NULL se non dobbiamo unire la tabella con se stessa"],
        explanation: "Filtraggio base su chiavi esterne.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IS NOT NULL."
      },
      {
        titleTemplate: "Ordini di 'Alice'",
        descTemplate: "Trova tutti gli ordini fatti da utenti di nome 'Alice'.",
        queryTemplate: "SELECT Orders.* FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.name = 'Alice'",
        hints: ["Join con Users", "Filtra per name = 'Alice'"],
        explanation: "Filtraggio tramite relazione.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE name = 'Alice'",
        debugHint: "La colonna 'name' non è in Orders, devi fare JOIN con Users."
      },
      {
        titleTemplate: "Prodotti in Ordini Grandi",
        descTemplate: "Mostra i nomi dei prodotti inclusi in ordini con quantità > 5.",
        queryTemplate: "SELECT Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE OrderItems.quantity > 5",
        hints: ["Filtra OrderItems.quantity > 5"],
        explanation: "Analisi vendite all'ingrosso.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join e Where."
      },
      {
        titleTemplate: "Spedizioni in USA",
        descTemplate: "Mostra ID ordine e status per utenti in 'USA'.",
        queryTemplate: "SELECT Orders.id, Orders.status FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.country = 'USA'",
        hints: ["Join su country"],
        explanation: "Filtro geografico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join Users ON ..."
      },
      {
        titleTemplate: "Email Ordini 'Shipped'",
        descTemplate: "Elenca email degli utenti che hanno ordini con status 'Shipped'.",
        queryTemplate: "SELECT Users.email FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.status = 'Shipped'",
        hints: ["Filtro su status ordine"],
        explanation: "Join per recuperare contatti target.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Where status = 'Shipped'."
      },
      {
        titleTemplate: "Stock Prodotti Ordinati",
        descTemplate: "Per ogni riga ordine, mostra quanta scorta (stock) rimane del prodotto.",
        queryTemplate: "SELECT OrderItems.id, Products.stock FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Visualizza Products.stock"],
        explanation: "Verifica disponibilità per ordini passati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join Products."
      },
      {
        titleTemplate: "Ordini e Ruoli Staff",
        descTemplate: "Immagina che anche gli impiegati facciano ordini (non c'è link diretto nello schema standard, ma supponiamo Join su email o simile se esistesse). Qui: Join Users e Orders (Classico).",
        queryTemplate: "SELECT u.name, o.id FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["Usa gli alias per brevità (Users u, Orders o)"],
        explanation: "Introduzione agli alias di tabella.",
        replacements: {},
        brokenCode: "...",
        debugHint: "u.id = o.user_id."
      },
      {
        titleTemplate: "Valore Riga Ordine",
        descTemplate: "Calcola il valore totale della riga (quantity * Products.price).",
        queryTemplate: "SELECT OrderItems.id, OrderItems.quantity * Products.price as line_total FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Moltiplica qt della riga per prezzo del prodotto"],
        explanation: "Calcolo derivato da due tabelle.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Quantity * Price."
      },
      {
        titleTemplate: "Utenti con Ordini Recenti",
        descTemplate: "Seleziona distinct users che hanno ordinato dopo il 2023-06-01.",
        queryTemplate: "SELECT DISTINCT Users.name FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.order_date > '2023-06-01'",
        hints: ["Usa DISTINCT per evitare duplicati"],
        explanation: "Lista utenti univoca da join.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DISTINCT name."
      },
      {
        titleTemplate: "Prodotti 'Electronics' Venduti",
        descTemplate: "Lista ID ordini che contengono prodotti 'Electronics'.",
        queryTemplate: "SELECT OrderItems.order_id FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE Products.category = 'Electronics'",
        hints: ["Filtra per category"],
        explanation: "Filtro basato su proprietà della tabella destra.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Category = 'Electronics'."
      },
      {
        titleTemplate: "Ordini di Utenti Premium",
        descTemplate: "Mostra tutti gli ordini degli utenti con is_premium = true.",
        queryTemplate: "SELECT Orders.* FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.is_premium = true",
        hints: ["Filtra is_premium"],
        explanation: "Segmentazione clienti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join Users e Where Premium."
      },
      {
        titleTemplate: "Nome e Data Ordine Alias",
        descTemplate: "Usa alias 'u' e 'o' per selezionare nome e data.",
        queryTemplate: "SELECT u.name, o.order_date FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["FROM Users u JOIN Orders o"],
        explanation: "Best practice: alias brevi.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users JOIN Orders",
        debugHint: "Devi definire l'alias: FROM Users u."
      },
      {
        titleTemplate: "Spesa per Riga",
        descTemplate: "Mostra nome prodotto e quanto è stato speso per quella riga (qty * price).",
        queryTemplate: "SELECT p.name, oi.quantity * p.price FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        hints: ["Join OrderItems e Products"],
        explanation: "Report dettagliato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join con alias."
      },
      {
        titleTemplate: "Ordini senza Sconto",
        descTemplate: "Seleziona ordini di utenti non premium.",
        queryTemplate: "SELECT o.id FROM Orders o JOIN Users u ON o.user_id = u.id WHERE u.is_premium = false",
        hints: ["is_premium = false"],
        explanation: "Filtro negativo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Check boolean."
      },
      {
        titleTemplate: "Join Multipla Base",
        descTemplate: "Collega OrderItems -> Products (ma seleziona solo nome prodotto e id riga).",
        queryTemplate: "SELECT oi.id, p.name FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        hints: ["Semplice join FK"],
        explanation: "Navigazione schema.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ON product_id = id."
      },
      {
        titleTemplate: "Dipartimento Dipendente",
        descTemplate: "Mostra nome impiegato e dipartimento (Query su singola tabella, ma concettualmente prepara a join reali).",
        queryTemplate: "SELECT name, department FROM Employees",
        hints: ["Selezione colonne"],
        explanation: "A volte i dati sono denormalizzati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Select normale."
      },
      {
        titleTemplate: "Ordini Internazionali",
        descTemplate: "Ordini da utenti non 'Italy'.",
        queryTemplate: "SELECT o.id, u.country FROM Orders o JOIN Users u ON o.user_id = u.id WHERE u.country != 'Italy'",
        hints: ["WHERE country != 'Italy'"],
        explanation: "Export sales.",
        replacements: {},
        brokenCode: "...",
        debugHint: "<> o !=."
      },
      {
        titleTemplate: "Prodotti Costosi Ordinati",
        descTemplate: "Trova righe d'ordine riferite a prodotti con prezzo > 100.",
        queryTemplate: "SELECT oi.id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id WHERE p.price > 100",
        hints: ["Filter joining table"],
        explanation: "High value items.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Price > 100."
      },
      {
        titleTemplate: "Utenti con Ordini Pendenti",
        descTemplate: "Nomi utenti con ordini 'Pending'.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.status = 'Pending'",
        hints: ["Status 'Pending'"],
        explanation: "Operational dashboard.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join Orders."
      },
      {
        titleTemplate: "ID Utente e ID Prodotto",
        descTemplate: "Chi ha comprato cosa (solo ID). Richiede Join a 3 tabelle (Users->Orders->Items) o 2 (Orders->Items). Facciamo Orders->Items.",
        queryTemplate: "SELECT o.user_id, oi.product_id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id",
        hints: ["Orders join OrderItems"],
        explanation: "Associazione Utente-Prodotto indiretta.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join su order_id."
      },
      {
        titleTemplate: "Cross Join Implicita (Errore)",
        descTemplate: "Cosa succede se dimentichi la ON? (Mostra sintassi corretta JOIN ma spiega cross).",
        queryTemplate: "SELECT u.name, o.id FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["Sempre specificare ON"],
        explanation: "Senza ON, SQL farebbe incrociare tutte le righe.",
        replacements: {},
        brokenCode: "SELECT u.name, o.id FROM Users u, Orders o",
        debugHint: "Usa la sintassi esplicita JOIN ... ON ..."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Utenti senza Ordini",
        descTemplate: "Trova i nomi degli utenti che non hanno mai effettuato un ordine (LEFT JOIN).",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Usa LEFT JOIN", "Filtra dove Orders.id IS NULL"],
        explanation: "La LEFT JOIN include tutte le righe di Users; chi non ha match in Orders avrà NULL.",
        replacements: {},
        brokenCode: "SELECT Users.name FROM Users JOIN Orders WHERE Orders.id IS NULL",
        debugHint: "La JOIN normale esclude chi non ha ordini. Usa LEFT JOIN."
      },
      {
        titleTemplate: "Tutti gli Utenti e Ordini",
        descTemplate: "Mostra tutti gli utenti e, se esiste, l'ID del loro ordine (anche se null).",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id",
        hints: ["LEFT JOIN mantiene tutti gli utenti"],
        explanation: "Vogliamo la lista anagrafica completa, arricchita ove possibile.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LEFT JOIN."
      },
      {
        titleTemplate: "Prodotti Mai Ordinati",
        descTemplate: "Trova i nomi dei prodotti che non sono mai stati inseriti in un ordine.",
        queryTemplate: "SELECT Products.name FROM Products LEFT JOIN OrderItems ON Products.id = OrderItems.product_id WHERE OrderItems.id IS NULL",
        hints: ["LEFT JOIN tra Products e OrderItems", "Check NULL su OrderItems.id"],
        explanation: "Analisi dell'invenduto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LEFT JOIN ... IS NULL."
      },
      {
        titleTemplate: "Spesa Totale per Utente",
        descTemplate: "Calcola quanto ha speso in totale ogni utente (Users Join Orders Group By Name).",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) as total_spent FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Join e poi Group By Users.name", "SUM(order_total)"],
        explanation: "Aggregazione dopo il join.",
        replacements: {},
        brokenCode: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders",
        debugHint: "Manca GROUP BY Users.name."
      },
      {
        titleTemplate: "Numero Ordini per Paese",
        descTemplate: "Conta quanti ordini provengono da ogni paese (Users Join Orders).",
        queryTemplate: "SELECT Users.country, COUNT(Orders.id) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.country",
        hints: ["Raggruppa per country"],
        explanation: "Statistiche geografiche.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Count su colonna orders."
      },
      {
        titleTemplate: "Prodotti in Categorie Popolari",
        descTemplate: "Mostra nome prodotto e categoria per prodotti venduti più di 10 volte (sommando quantity).",
        queryTemplate: "SELECT p.name, p.category, SUM(oi.quantity) FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name, p.category HAVING SUM(oi.quantity) > 10",
        hints: ["Join, Group By, Having"],
        explanation: "Filtro su aggregati di due tabelle.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING SUM > 10."
      },
      {
        titleTemplate: "Utenti con Acquisti 'Electronics'",
        descTemplate: "Nomi utenti che hanno comprato prodotti della categoria 'Electronics'.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.category = 'Electronics'",
        hints: ["Join a 4 tabelle: Users -> Orders -> Items -> Products"],
        explanation: "Navigazione profonda dello schema.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Collega tutte le tabelle."
      },
      {
        titleTemplate: "Dettaglio Ordini con Prezzi",
        descTemplate: "Mostra Order ID, Nome Prodotto, Quantità e Prezzo Totale Riga (qty * price).",
        queryTemplate: "SELECT oi.order_id, p.name, oi.quantity, (oi.quantity * p.price) as subtotal FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        hints: ["Calcolo aritmetico su colonne di tabelle diverse"],
        explanation: "Fatturazione dettagliata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join e moltiplicazione."
      },
      {
        titleTemplate: "Ordini Multi-Prodotto",
        descTemplate: "Trova gli ID degli ordini che contengono più di 1 riga (più prodotti diversi).",
        queryTemplate: "SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) > 1",
        hints: ["Non serve JOIN qui, solo Group By su OrderItems, ma concettualmente lega prodotti"],
        explanation: "Analisi composizione carrello.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Having Count > 1."
      },
      {
        titleTemplate: "Clienti e Loro Ultimo Ordine",
        descTemplate: "Mostra nome utente e la data del loro ordine più recente.",
        queryTemplate: "SELECT u.name, MAX(o.order_date) FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name",
        hints: ["MAX(order_date)", "Group By user"],
        explanation: "Aggregazione temporale per entità.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MAX(date)."
      },
      {
        titleTemplate: "Manager e Sottoposti",
        descTemplate: "Per ogni impiegato mostrare il nome e il nome del suo manager (Self Join).",
        queryTemplate: "SELECT e1.name as Employee, e2.name as Manager FROM Employees e1 JOIN Employees e2 ON e1.manager_id = e2.id",
        hints: ["Usa due alias per la stessa tabella Employees (e1, e2)", "e1.manager_id = e2.id"],
        explanation: "Self Join per gerarchie.",
        replacements: {},
        brokenCode: "SELECT name, manager_name FROM Employees",
        debugHint: "Devi unire Employees con se stessa."
      },
      {
        titleTemplate: "Prodotti e Vendite Totali",
        descTemplate: "Lista tutti i prodotti e la somma totale delle quantità vendute (usa LEFT JOIN per includere 0 vendite).",
        queryTemplate: "SELECT p.name, COALESCE(SUM(oi.quantity), 0) FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name",
        hints: ["LEFT JOIN per non perdere prodotti invenduti", "COALESCE per trasformare NULL in 0"],
        explanation: "Report completo inventario/vendite.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LEFT JOIN + COALESCE."
      },
      {
        titleTemplate: "Utenti Italiani con Ordini > 100",
        descTemplate: "Trova utenti italiani che hanno fatto almeno un ordine sopra i 100 euro.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.country = 'Italy' AND o.order_total > 100",
        hints: ["Join + 2 condizioni Where"],
        explanation: "Segmentazione avanzata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND condition."
      },
      {
        titleTemplate: "Ordini con Prodotti 'Out of Stock'",
        descTemplate: "Trova ID ordini che contengono prodotti con stock = 0.",
        queryTemplate: "SELECT DISTINCT oi.order_id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id WHERE p.stock = 0",
        hints: ["Join su prodotti, where stock=0"],
        explanation: "Verifica integrità o backorder.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Distinct order_id."
      },
      {
        titleTemplate: "Ticket Medio per Nazione",
        descTemplate: "Calcola il valore medio degli ordini per ogni nazione.",
        queryTemplate: "SELECT u.country, AVG(o.order_total) FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.country",
        hints: ["Join Users-Orders", "AVG(total)", "Group By country"],
        explanation: "KPI geografico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AVG con Group By."
      },
      {
        titleTemplate: "Impiegati nello stesso Dept",
        descTemplate: "Trova coppie di impiegati che lavorano nello stesso dipartimento.",
        queryTemplate: "SELECT e1.name, e2.name FROM Employees e1 JOIN Employees e2 ON e1.department = e2.department WHERE e1.id < e2.id",
        hints: ["Self Join su department", "e1.id < e2.id per evitare duplicati/riflessi"],
        explanation: "Combinazioni a coppie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Condizione < sull'ID."
      },
      {
        titleTemplate: "Utenti e Conti Ordini",
        descTemplate: "Mostra nome utente e numero di ordini effettuati (incluso 0).",
        queryTemplate: "SELECT u.name, COUNT(o.id) FROM Users u LEFT JOIN Orders o ON u.id = o.user_id GROUP BY u.name",
        hints: ["LEFT JOIN", "COUNT(o.id) conta solo i non-nulli"],
        explanation: "Statistica inclusiva.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LEFT JOIN e Group By."
      },
      {
        titleTemplate: "Prodotto Più Venduto (Qta)",
        descTemplate: "Trova il nome del prodotto con la somma quantità più alta.",
        queryTemplate: "SELECT p.name, SUM(oi.quantity) as total_qty FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name ORDER BY total_qty DESC LIMIT 1",
        hints: ["Sum quantity", "Order Desc Limit 1"],
        explanation: "Top performer.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Order By SUM DESC."
      },
      {
        titleTemplate: "Ordini Completi (3 Join)",
        descTemplate: "Mostra ID Ordine, Email Utente, Nome Prodotto per ogni riga ordine.",
        queryTemplate: "SELECT o.id, u.email, p.name FROM Orders o JOIN Users u ON o.user_id = u.id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id",
        hints: ["Catena di 4 join"],
        explanation: "Vista denormalizzata completa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Segui le chiavi esterne."
      },
      {
        titleTemplate: "Utenti 'Gold'",
        descTemplate: "Utenti che hanno speso > 500 in totale.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name HAVING SUM(o.order_total) > 500",
        hints: ["Group By name", "HAVING SUM > 500"],
        explanation: "Filtro su aggregato derivato da join.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING dopo Group By."
      },
      {
        titleTemplate: "Variazione Prezzo Ordine",
        descTemplate: "Confronta prezzo pagato (OrderItems... non abbiamo prezzo storico, usiamo prezzo attuale) e totale ordine.",
        queryTemplate: "SELECT o.id, o.order_total, SUM(oi.quantity * p.price) as calc_total FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id, o.order_total",
        hints: ["Verifica consistenza dati", "Confronta campo calcolato e campo salvato"],
        explanation: "Audit di consistenza.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Sum(qty*price)."
      },
      {
        titleTemplate: "Utenti del Dipartimento 'Sales'",
        descTemplate: "Supponendo link Users-Employees (non c'è, esercizio teorico), facciamo: Utenti che hanno stesso nome di un impiegato.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Employees e ON u.name = e.name",
        hints: ["Join su campo name (non ideale ma possibile)"],
        explanation: "Join su chiavi non primarie/esterne.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ON u.name = e.name."
      },
      {
        titleTemplate: "Cross Join Esplicita",
        descTemplate: "Combina tutti i Users con tutti i Products (Cartesian).",
        queryTemplate: "SELECT u.name, p.name FROM Users u CROSS JOIN Products p",
        hints: ["CROSS JOIN"],
        explanation: "Generazione di tutte le combinazioni possibili.",
        replacements: {},
        brokenCode: "...",
        debugHint: "CROSS JOIN non ha ON."
      },
      {
        titleTemplate: "Full Outer Join Simulata",
        descTemplate: "Poiché molti DB (e AlaSQL) non hanno FULL JOIN, simulala con LEFT JOIN Union RIGHT JOIN (o LEFT Union LEFT inversa). Qui: Lista tutti users e orders (User senza ordini E Ordini orfani).",
        queryTemplate: "SELECT u.name, o.id FROM Users u LEFT JOIN Orders o ON u.id = o.user_id UNION SELECT u.name, o.id FROM Orders o LEFT JOIN Users u ON o.user_id = u.id",
        hints: ["Union di due Left Join invertite"],
        explanation: "Full Outer Join workaround.",
        replacements: {},
        brokenCode: "...",
        debugHint: "UNION."
      },
      {
        titleTemplate: "Ordini con Almeno 3 Articoli",
        descTemplate: "Trova ordini con count(items) >= 3.",
        queryTemplate: "SELECT o.id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id GROUP BY o.id HAVING COUNT(oi.id) >= 3",
        hints: ["Group By Order ID", "Having Count >= 3"],
        explanation: "Filtro sulla cardinalità della relazione.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING COUNT."
      },
      {
        titleTemplate: "Categorie Acquistate da Utente",
        descTemplate: "Mostra categorie distinte acquistate da 'Alice'.",
        queryTemplate: "SELECT DISTINCT p.category FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE u.name = 'Alice'",
        hints: ["Distinct category", "Filter user name"],
        explanation: "Profilazione interessi utente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Chain joins."
      },
      {
        titleTemplate: "Prodotti Non 'Electronics'",
        descTemplate: "Ordini che contengono prodotti NON Electronics.",
        queryTemplate: "SELECT DISTINCT o.id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.category != 'Electronics'",
        hints: ["Category != 'Electronics'"],
        explanation: "Filtro esclusivo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "!= o <>."
      },
      {
        titleTemplate: "Chi ha comprato 'Laptop'?",
        descTemplate: "Trova email di chi ha comprato prodotto con nome 'Laptop'.",
        queryTemplate: "SELECT DISTINCT u.email FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name = 'Laptop'",
        hints: ["Filtra per nome prodotto"],
        explanation: "Targeting specifico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join chain."
      },
      {
        titleTemplate: "Ordini Mese Corrente",
        descTemplate: "Join Users-Orders filtrando per mese corrente (NOW).",
        queryTemplate: "SELECT u.name, o.id FROM Users u JOIN Orders o ON u.id = o.user_id WHERE MONTH(o.order_date) = MONTH(NOW()) AND YEAR(o.order_date) = YEAR(NOW())",
        hints: ["Confronta Month e Year con NOW()"],
        explanation: "Reporting real-time.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MONTH(NOW())."
      },
      {
        titleTemplate: "Status Spedizione Utente",
        descTemplate: "Mostra 'Spedito' se tutti gli ordini dell'utente sono Shipped ?? No, mostra semplicemente status ordini per utente.",
        queryTemplate: "SELECT u.name, o.status FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["Select semplice join"],
        explanation: "Tracking stato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Analisi Completa Carrello",
        descTemplate: "Mostra nome utente, email, data ordine, nome prodotto e quantità per ordini spediti.",
        queryTemplate: "SELECT u.name, u.email, o.order_date, p.name, oi.quantity FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE o.status = 'Shipped'",
        hints: ["Join 4 tabelle", "Filter status='Shipped'"],
        explanation: "Vista completa denormalizzata per ordini evasi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Segui la catena di chiavi esterne."
      },
      {
        titleTemplate: "Impiegati con Salary > Manager",
        descTemplate: "Trova gli impiegati che guadagnano più del proprio manager (Self Join).",
        queryTemplate: "SELECT E.name FROM Employees E JOIN Employees M ON E.manager_id = M.id WHERE E.salary > M.salary",
        hints: ["Self Join: Employees E, Employees M", "Confronta E.salary > M.salary"],
        explanation: "Analisi anomalie retributive.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join su manager_id = id."
      },
      {
        titleTemplate: "Prodotti mai venduti nel 2023",
        descTemplate: "Trova prodotti che NON sono stati venduti in ordini del 2023.",
        queryTemplate: "SELECT p.name FROM Products p LEFT JOIN (SELECT oi.product_id FROM OrderItems oi JOIN Orders o ON oi.order_id = o.id WHERE YEAR(o.order_date) = 2023) sold_23 ON p.id = sold_23.product_id WHERE sold_23.product_id IS NULL",
        hints: ["Left Join con subquery o Left Join + condition in ON/Where", "Filtra IS NULL"],
        explanation: "Esclusione basata su periodo temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LEFT JOIN ... IS NULL."
      },
      {
        titleTemplate: "Clienti 'Big Spender' Ricorrenti",
        descTemplate: "Trovami utenti che hanno fatto più di un ordine sopra i 500 euro.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.order_total > 500 GROUP BY u.name HAVING COUNT(o.id) > 1",
        hints: ["Filter order_total in Where", "Filter count in Having"],
        explanation: "Identificazione clienti VIP.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Where price > 500 first."
      },
      {
        titleTemplate: "Performance Categorie per Nazione",
        descTemplate: "Per ogni nazione, trova la categoria di prodotti più venduta (sommando quantity).",
        queryTemplate: "SELECT u.country, p.category, SUM(oi.quantity) as sold FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.country, p.category ORDER BY u.country, sold DESC",
        hints: ["Group By country, category", "Order by country, sum desc"],
        explanation: "Analisi di mercato geografica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join 4 tables."
      },
      {
        titleTemplate: "Coppie di Prodotti Spesso Insieme",
        descTemplate: "Trova coppie di prodotti (A, B) che appaiono nello stesso ordine (Self Join su OrderItems).",
        queryTemplate: "SELECT oi1.product_id as P1, oi2.product_id as P2, COUNT(*) as frequency FROM OrderItems oi1 JOIN OrderItems oi2 ON oi1.order_id = oi2.order_id WHERE oi1.product_id < oi2.product_id GROUP BY P1, P2 ORDER BY frequency DESC LIMIT 1",
        hints: ["Self Join OrderItems on order_id", "P1 < P2 per evitare duplicati speculari"],
        explanation: "Market Basket Analysis semplificata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "oi1.order_id = oi2.order_id."
      },
      {
        titleTemplate: "Utenti che hanno comprato TUTTE le categorie",
        descTemplate: "Sfida logica: Utenti che hanno acquistato almeno un prodotto per ogni categoria disponibile. (Concetto di Divisione Relazionale, simulata).",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name HAVING COUNT(DISTINCT p.category) = (SELECT COUNT(DISTINCT category) FROM Products)",
        hints: ["Count Distinct Category dell'utente = Count Distinct Category Totale"],
        explanation: "Relational Division.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING COUNT = (subquery)."
      },
      {
        titleTemplate: "Valore Magazzino vs Venduto",
        descTemplate: "Per ogni prodotto, confronta il valore dello stock attuale (stock * price) con il totale guadagnato dalle vendite passate.",
        queryTemplate: "SELECT p.name, (p.stock * p.price) as inventory_value, COALESCE(SUM(oi.quantity * p.price), 0) as sales_value FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.id, p.name, p.stock, p.price",
        hints: ["Left Join Products-OrderItems", "Calcoli aggregati vs scalari"],
        explanation: "ROI potential analysis.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Group By p.id."
      },
      {
        titleTemplate: "Gerarchia Completa (Recursive sim)",
        descTemplate: "Mostra Nome, Manager Name per tutti (anche chi non ha manager - LEFT JOIN self).",
        queryTemplate: "SELECT E.name as Emp, M.name as Boss FROM Employees E LEFT JOIN Employees M ON E.manager_id = M.id",
        hints: ["LEFT Join su self"],
        explanation: "Include il CEO (che ha manager NULL).",
        replacements: {},
        brokenCode: "...",
        debugHint: "LEFT JOIN."
      },
      {
        titleTemplate: "Ordini con prodotti di categorie miste",
        descTemplate: "Trova ordini che contengono prodotti di almeno 2 categorie diverse.",
        queryTemplate: "SELECT oi.order_id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY oi.order_id HAVING COUNT(DISTINCT p.category) > 1",
        hints: ["Join Products", "Having Count Distinct category > 1"],
        explanation: "Analisi varietà carrello.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Count Distinct."
      },
      {
        titleTemplate: "Utenti Inattivi da 6 Mesi",
        descTemplate: "Utenti che non hanno ordini con data > oggi - 6 mesi.",
        queryTemplate: "SELECT u.name FROM Users u LEFT JOIN Orders o ON u.id = o.user_id AND o.order_date > DATE('now', '-6 months') WHERE o.id IS NULL",
        hints: ["Left Join con condizione temporale complessa o Where Not Exists"],
        explanation: "Churn analysis.",
        replacements: {},
        brokenCode: "...",
        debugHint: "o.id IS NULL."
      },
      {
        titleTemplate: "Categoria Preferita Utente",
        descTemplate: "Per ogni utente, trova la categoria su cui ha speso di più (Query complessa, semplifichiamo: Categoria più acquistata da 'Alice').",
        queryTemplate: "SELECT p.category, SUM(oi.quantity) as qty FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE u.name = 'Alice' GROUP BY p.category ORDER BY qty DESC LIMIT 1",
        hints: ["Filtra Alice", "Group by category", "Order desc limit 1"],
        explanation: "Profilazione personalizzata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Limit 1."
      },
      {
        titleTemplate: "Join su Date (Range Join)",
        descTemplate: "Trova ordini effettuati lo stesso giorno di un 'Evento'. (Simuliamo tabella Eventi con subquery/CTE). Diciamo: Ordini fatti lo stesso giorno dell'ordine #1.",
        queryTemplate: "SELECT o2.id FROM Orders o1 JOIN Orders o2 ON o1.order_date = o2.order_date WHERE o1.id = 1 AND o2.id != 1",
        hints: ["Self Join on order_date"],
        explanation: "Correlazione temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "o1.id = 1."
      },
      {
        titleTemplate: "Gap Analysis Vendite",
        descTemplate: "Trova gli utenti che hanno comprato 'Smartphone' ma NON 'Cover'.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name = 'Smartphone' EXCLUDING (SELECT u2.name FROM Users u2 ... Join ... WHERE p.name = 'Cover')",
        hints: ["In standard SQL: WHERE u.id IN (Smartphone buyers) AND u.id NOT IN (Cover buyers)"],
        explanation: "Cross-selling opportunities.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery NOT IN."
      },
      {
        titleTemplate: "Ordini con Valore Errato",
        descTemplate: "Trova ordini dove order_total != somma(items).",
        queryTemplate: "SELECT o.id FROM Orders o JOIN (SELECT order_id, SUM(quantity*price) as calc_sum FROM OrderItems JOIN Products ON product_id=id GROUP BY order_id) detail ON o.id = detail.order_id WHERE o.order_total != detail.calc_sum",
        hints: ["Join con derived table aggregata"],
        explanation: "Data Integrity Check avanzato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery nel FROM."
      },
      {
        titleTemplate: "Best Selling Product per Year",
        descTemplate: "Anno | Prodotto | Qta. Richiede Window Functions o Group complessi. Qui facciamo Group By Year, Product.",
        queryTemplate: "SELECT STRFTIME('%Y', o.order_date) as yr, p.name, SUM(oi.quantity) FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY yr, p.name ORDER BY yr, SUM(oi.quantity) DESC",
        hints: ["Group By Year(date), product"],
        explanation: "Trend annuali.",
        replacements: {},
        brokenCode: "...",
        debugHint: "STRFTIME Year."
      },
      {
        titleTemplate: "Utenti e Avg Stock Acquistato",
        descTemplate: "Media dello stock attuale dei prodotti comprati da ogni utente.",
        queryTemplate: "SELECT u.name, AVG(p.stock) FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name",
        hints: ["Avg(p.stock)"],
        explanation: "Metrica inusuale cross-domain.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Avg."
      },
      {
        titleTemplate: "Salari Manager vs Avg Dipartimento",
        descTemplate: "Manager che guadagnano meno della media del proprio dipartimento.",
        queryTemplate: "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) as avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE e.manager_id IS NULL AND e.salary < d_avg.avg_sal",
        hints: ["Join con subquery aggregata per dept", "manager_id IS NULL identifica manager/capi (o logica specifica)"],
        explanation: "Salary equity.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join subquery."
      },
      {
        titleTemplate: "Clienti e Prodotti Esclusivi",
        descTemplate: "Clienti che hanno comprato SOLO prodotti 'Electronics'.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name HAVING MIN(p.category) = 'Electronics' AND MAX(p.category) = 'Electronics'",
        hints: ["Group By User", "HAVING MIN(cat) = MAX(cat) = 'Electronics' è un trick per dire 'solo questa categoria'"],
        explanation: "Set condition checking.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Min=Max trick."
      },
      {
        titleTemplate: "Confronto Ordini Successivi",
        descTemplate: "Trova ordini che hanno valore inferiore all'ordine immediatamente precedente dello stesso utente. (Self Join o Window, usiamo Self Join su ID-1 o logica temporale).",
        queryTemplate: "SELECT o1.id FROM Orders o1 JOIN Orders o2 ON o1.user_id = o2.user_id WHERE o1.id = o2.id + 1 AND o1.order_total < o2.order_total",
        hints: ["Assumiamo ID sequenziali: o1.id = o2.id + 1"],
        explanation: "Sequential analysis.",
        replacements: {},
        brokenCode: "...",
        debugHint: "o1.id = o2.id + 1."
      },
      {
        titleTemplate: "Full Order Details JSON",
        descTemplate: "Simulazione: Crea stringa dettagli ordine concatenando nomi prodotti (Group_Concat).",
        queryTemplate: "SELECT o.id, GROUP_CONCAT(p.name) as items FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id",
        hints: ["GROUP_CONCAT(p.name)"],
        explanation: "Denormalizzazione per export.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Group_Concat."
      },
      {
        titleTemplate: "Utenti Senza Acquisti Recentemente",
        descTemplate: "Utenti con acquisiti in passato ma NULLA negli ultimi 3 mesi.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.id NOT IN (SELECT user_id FROM Orders WHERE order_date > DATE('now', '-3 months'))",
        hints: ["IN (all history) AND NOT IN (recent history)"],
        explanation: "Dormant users.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN Subquery."
      },
      {
        titleTemplate: "Ranking Prodotti per Revenue",
        descTemplate: "Classifica prodotti per Entrate Totali (qty*price).",
        queryTemplate: "SELECT p.name, SUM(oi.quantity * p.price) as rev FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name ORDER BY rev DESC",
        hints: ["Sum(q * p)", "Group By name"],
        explanation: "Revenue report.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Order By Rev."
      },
      {
        titleTemplate: "Ordini Spediti in Ritardo",
        descTemplate: "Supponendo tabella 'Shipments' con data spedizione (non c'è, simuliamo Join su Orders con data fittizia). Diciamo: Ordini Shipped ma senza data spedizione (Impossible ne schema, usiamo: Ordini Shipped con data ordine < 2022).",
        queryTemplate: "SELECT id FROM Orders WHERE status = 'Shipped' AND order_date < '2022-01-01'",
        hints: ["Simple filtering representing complex logic"],
        explanation: "Legacy data cleanup.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Date check."
      },
      {
        titleTemplate: "Clienti Nuovi 2023",
        descTemplate: "Clienti il cui primo ordine è stato nel 2023.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name HAVING MIN(o.order_date) >= '2023-01-01'",
        hints: ["Having Min(date) >= 2023"],
        explanation: "Acquisition cohort.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Having Min(date)."
      },
      {
        titleTemplate: "Distribuzione Ordini per Giorno",
        descTemplate: "Quanti ordini Lunedì, Martedì... (Join non serve ma spesso si fa con tabella Calendario. Qui: solo Group By WEEKDAY).",
        queryTemplate: "SELECT WEEKDAY(order_date) as wd, COUNT(*) FROM Orders GROUP BY wd",
        hints: ["WEEKDAY() returns index"],
        explanation: "Weekly seasonality.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Group By WD."
      },
      {
        titleTemplate: "Prodotti 'Solo' o 'Accoppiati'",
        descTemplate: "Prodotti che sono stati venduti come unico item nell'ordine.",
        queryTemplate: "SELECT DISTINCT p.name FROM Products p JOIN OrderItems oi ON p.id = oi.product_id JOIN (SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) = 1) singles ON oi.order_id = singles.order_id",
        hints: ["Join con subquery di ordini con count=1"],
        explanation: "Single item basket analysis.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join subquery."
      },
      {
        titleTemplate: "Utenti Stesso Nome Diversa Email",
        descTemplate: "Controllo duplicati anagrafica.",
        queryTemplate: "SELECT u1.name FROM Users u1 JOIN Users u2 ON u1.name = u2.name AND u1.email != u2.email",
        hints: ["Self Join name=name, email!=email"],
        explanation: "Data deduplication candidate.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Self join."
      },
      {
        titleTemplate: "Media Prodotti per Ordine (Global)",
        descTemplate: "Calcolo scalare: Totale Items / Totale Ordini.",
        queryTemplate: "SELECT CAST(COUNT(*) AS FLOAT) / COUNT(DISTINCT order_id) FROM OrderItems",
        hints: ["Aritmetica su aggregati"],
        explanation: "KPI basket size.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Divisione aggregati."
      },
      {
        titleTemplate: "Referral Chain (Simulata)",
        descTemplate: "Se Users avesse referrer_id (Self join). Simuliamo con Manager-Employee (già fatto). Facciamo join a 3 livelli: Employee -> Manager -> GrandManager.",
        queryTemplate: "SELECT e.name, m.name as Boss, gm.name as BigBoss FROM Employees e LEFT JOIN Employees m ON e.manager_id = m.id LEFT JOIN Employees gm ON m.manager_id = gm.id",
        hints: ["Doppio Self Join"],
        explanation: "Hierarchy traversal.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Left Join x 2."
      }
    ],
  },
  [TopicId.Advanced]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Prodotti Costosi",
        descTemplate: "Trova i prodotti che costano più della media di tutti i prodotti.",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Usa una subquery per calcolare la media dei prezzi", "WHERE price > (SELECT AVG(price)...)"],
        explanation: "La subquery calcola il prezzo medio globale, e la query esterna filtra i prodotti con prezzo superiore a quel valore.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price > AVG(price)",
        debugHint: "Non puoi usare funzioni di aggregazione direttamente nel WHERE. Usa una subquery."
      },
      {
        titleTemplate: "Utenti Attivi",
        descTemplate: "Seleziona tutti gli utenti che hanno effettuato almeno un ordine.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Usa IN per filtrare gli utenti", "La subquery deve selezionare user_id da Orders"],
        explanation: "Utilizziamo l'operatore IN per trovare gli utenti il cui ID appare nella lista degli user_id della tabella Orders.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE id = (SELECT user_id FROM Orders)",
        debugHint: "La subquery restituisce più righe, quindi '=' non va bene. Usa 'IN'."
      },
      {
        titleTemplate: "Stessa Categoria",
        descTemplate: "Trova tutti i prodotti della stessa categoria del 'Monitor 4K'.",
        queryTemplate: "SELECT * FROM Products WHERE category = (SELECT category FROM Products WHERE name = 'Monitor 4K')",
        hints: ["Trova prima la categoria del Monitor 4K con una subquery"],
        explanation: "La subquery recupera la categoria del 'Monitor 4K'.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Monitor 4K'",
        debugHint: "'Monitor 4K' è un nome, non una categoria."
      },
      {
        titleTemplate: "Ordini Recenti",
        descTemplate: "Trova gli ordini effettuati dopo l'ultimo ordine dell'utente con ID 1.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date > (SELECT MAX(order_date) FROM Orders WHERE user_id = 1)",
        hints: ["Trova la data massima degli ordini dell'utente 1"],
        explanation: "Confrontiamo date con il risultato di una subquery scalare.",
        replacements: {},
        brokenCode: "...",
        debugHint: "La subquery deve restituire una sola data (MAX)."
      },
      {
        titleTemplate: "Staff e Clienti",
        descTemplate: "Ottieni una lista unica di nomi di tutti i dipendenti e di tutti i clienti.",
        queryTemplate: "SELECT name FROM Employees UNION SELECT name FROM Users",
        hints: ["Usa l'operatore UNION", "Seleziona la colonna 'name' da entrambe le tabelle"],
        explanation: "UNION combina i risultati rimuovendo i duplicati.",
        replacements: {},
        brokenCode: "SELECT name FROM Employees AND Users",
        debugHint: "Usa UNION tra due SELECT complete."
      },
      {
        titleTemplate: "Utenti Premium o Italiani",
        descTemplate: "Seleziona le email degli utenti Premium unite a quelle degli utenti italiani.",
        queryTemplate: "SELECT email FROM Users WHERE is_premium = true UNION SELECT email FROM Users WHERE country = 'Italy'",
        hints: ["Fai due query SELECT separate e uniscile"],
        explanation: "UNION combina dataset filtrati diversamente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa UNION."
      },
      {
        titleTemplate: "Prodotti Invenduti",
        descTemplate: "Trova i prodotti che non sono mai stati ordinati (non presenti in OrderItems).",
        queryTemplate: "SELECT name FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems)",
        hints: ["Usa NOT IN", "La subquery seleziona product_id da OrderItems"],
        explanation: "Esclusione tramite NOT IN.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa NOT IN."
      },
      {
        titleTemplate: "Ordini Sopra Media",
        descTemplate: "Trova gli ordini con totale superiore alla media globale.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > (SELECT AVG(order_total) FROM Orders)",
        hints: ["Confronta order_total > (SELECT AVG...)"],
        explanation: "Filtro su base aggregata globale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa subquery per AVG."
      },
      {
        titleTemplate: "Dipendenti Manager",
        descTemplate: "Trova i dipendenti che sono manager (il loro ID è nel campo manager_id di qualcuno).",
        queryTemplate: "SELECT * FROM Employees WHERE id IN (SELECT manager_id FROM Employees)",
        hints: ["Cerca ID dentro la lista manager_id"],
        explanation: "Self-reference check.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa ID IN (SELECT manager_id...)."
      },
      {
        titleTemplate: "Categorie Costose",
        descTemplate: "Trova le categorie che hanno almeno un prodotto che costa più di 1000.",
        queryTemplate: "SELECT DISTINCT category FROM Products WHERE category IN (SELECT category FROM Products WHERE price > 1000)",
        hints: ["Subquery filtra prodotti > 1000", "SELECT DISTINCT category"],
        explanation: "Identificazione categorie high-end.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa DISTINCT."
      },
      {
        titleTemplate: "Utenti Interessanti",
        descTemplate: "Ottieni gli ID degli utenti che hanno ordinato UNION gli ID degli utenti Premium.",
        queryTemplate: "SELECT user_id FROM Orders UNION SELECT id FROM Users WHERE is_premium = true",
        hints: ["UNION di due colonne ID"],
        explanation: "Merge di liste ID.",
        replacements: {},
        brokenCode: "...",
        debugHint: "I nomi delle colonne possono differire, i tipi no."
      },
      {
        titleTemplate: "Stesso Paese",
        descTemplate: "Trova gli utenti che vivono nello stesso paese dell'ordine con ID 5 (assumendo ordine abbia un link indiretto user -> country).",
        queryTemplate: "SELECT * FROM Users WHERE country = (SELECT country FROM Users WHERE id = (SELECT user_id FROM Orders WHERE id = 5))",
        hints: ["Catena: Ordine -> Utente -> Paese"],
        explanation: "Subquery annidata profonda.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Trova prima user_id, poi suo country."
      },
      {
        titleTemplate: "Prodotti Popolari",
        descTemplate: "Prodotti ordinati in più di 2 ordini diversi (usando IN e subquery con HAVING).",
        queryTemplate: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems GROUP BY product_id HAVING COUNT(*) > 2)",
        hints: ["Subquery con GROUP BY e HAVING"],
        explanation: "Filtro su aggregazione in subquery.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING va dopo GROUP BY."
      },
      {
        titleTemplate: "Stato Avanzato",
        descTemplate: "Lista ID ordini con stato 'Shipped' o 'Delivered' (usando UNION).",
        queryTemplate: "SELECT id FROM Orders WHERE status = 'Shipped' UNION SELECT id FROM Orders WHERE status = 'Delivered'",
        hints: ["UNION di due status"],
        explanation: "Simile a IN/OR ma con UNION.",
        replacements: {},
        brokenCode: "...",
        debugHint: "UNION richiede due query complete."
      },
      {
        titleTemplate: "Stock Basso",
        descTemplate: "Prodotti con stock inferiore alla metà della media dello stock.",
        queryTemplate: "SELECT * FROM Products WHERE stock < (SELECT AVG(stock)/2 FROM Products)",
        hints: ["Subquery calcola AVG/2"],
        explanation: "Confronto con calcolo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Calcola valore in subquery."
      },
      {
        titleTemplate: "Clienti USA",
        descTemplate: "Trova gli ordini effettuati da utenti USA.",
        queryTemplate: "SELECT * FROM Orders WHERE user_id IN (SELECT id FROM Users WHERE country = 'USA')",
        hints: ["Usa IN (SELECT id FROM Users WHERE country='USA')"],
        explanation: "Filtro ordini per proprietà utente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Filtra Users per country."
      },
      {
        titleTemplate: "Utenti Monitor",
        descTemplate: "Utenti che hanno comprato il prodotto 'Monitor 4K'.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name = 'Monitor 4K')))",
        hints: ["Catena: Product -> OrderItem -> Order -> User"],
        explanation: "Relazione molti-a-molti risolta con subqueries.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Segui le chiavi esterne."
      },
      {
        titleTemplate: "Max Spesa Mario",
        descTemplate: "Il singolo importo più alto speso da 'Mario Rossi'.",
        queryTemplate: "SELECT MAX(order_total) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name = 'Mario Rossi')",
        hints: ["MAX(order_total)", "Subquery per trovare ID di Mario"],
        explanation: "Aggregazione su subset filtrato da subquery.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Trova id di Mario prima."
      },
      {
        titleTemplate: "Utenti Senza Ordini Easy",
        descTemplate: "Trova utenti senza ordini (usando NOT IN).",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders)",
        hints: ["NOT IN l'elenco user_id di Orders"],
        explanation: "Inversione di appartenenza.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "Prodotti Non Elettronica",
        descTemplate: "Prodotti che NON sono nella categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category != (SELECT category FROM Products WHERE name = 'Smartphone' LIMIT 1)",
        hints: ["Esempio contorto per usare subquery: category != ..."],
        explanation: "Confronto disuguaglianza con subquery.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Se la subquery torna 1 valore, puoi usare !=."
      },
      {
        titleTemplate: "Totale Ordini Mario",
        descTemplate: "Somma totale spesa da 'Mario Rossi'.",
        queryTemplate: "SELECT SUM(order_total) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name = 'Mario Rossi')",
        hints: ["SUM(total)", "user_id = subquery"],
        explanation: "Somma condizionata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa SUM."
      },
      {
        titleTemplate: "Conteggio Ordini Mario",
        descTemplate: "Quanti ordini ha fatto 'Mario Rossi'?",
        queryTemplate: "SELECT COUNT(*) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name = 'Mario Rossi')",
        hints: ["COUNT(*)", "user_id from subquery"],
        explanation: "Conteggio filtrato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(*)."
      },
      {
        titleTemplate: "Prezzo Minimo Elettronica",
        descTemplate: "Trova il prodotto più economico della categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE price = (SELECT MIN(price) FROM Products WHERE category = 'Electronics') AND category = 'Electronics'",
        hints: ["Trova il MIN(price) per Electronics", "Seleziona prodotto con quel prezzo"],
        explanation: "Selezione record corrispondente a un aggregato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Min price query."
      },
      {
        titleTemplate: "Dipendenti Non Manager",
        descTemplate: "Dipendenti il cui ID non appare come manager_id di nessuno.",
        queryTemplate: "SELECT * FROM Employees WHERE id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)",
        hints: ["NOT IN (manager_ids)", "Escludi i NULL dalla subquery"],
        explanation: "Esclusione staff di comando.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attenzione ai NULL con NOT IN."
      },
      {
        titleTemplate: "Ordini Weekend (Sim)",
        descTemplate: "Ordini fatti di Sabato o Domenica (usando IN e subquery date - trick).",
        queryTemplate: "SELECT * FROM Orders WHERE DAYOFWEEK(order_date) IN (1, 7)",
        hints: ["DAYOFWEEK: 1=Sun, 7=Sat"],
        explanation: "Filtro con lista valori fissa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DAYOFWEEK returns numbers."
      },
      {
        titleTemplate: "Prodotti Categoria Max",
        descTemplate: "Tutti i prodotti della categoria che ha il prodotto più costoso.",
        queryTemplate: "SELECT * FROM Products WHERE category = (SELECT category FROM Products ORDER BY price DESC LIMIT 1)",
        hints: ["Trova category del prodotto più caro", "Filtra per quella category"],
        explanation: "Subquery restituisce la categoria top.",
        replacements: {},
        brokenCode: "...",
        debugHint: "ORDER BY price DESC LIMIT 1."
      },
      {
        titleTemplate: "Email Staff e Users",
        descTemplate: "Lista unica di email di Staff e Users (UNION).",
        queryTemplate: "SELECT email FROM Employees UNION SELECT email FROM Users",
        hints: ["UNION su campo email"],
        explanation: "Lista contatti unificata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "UNION."
      },
      {
        titleTemplate: "Primi 3 Users e Staff",
        descTemplate: "Primi 3 Users uniti ai primi 3 Employees (per ID).",
        queryTemplate: "(SELECT name FROM Users ORDER BY id LIMIT 3) UNION (SELECT name FROM Employees ORDER BY id LIMIT 3)",
        hints: ["Usa parentesi per i LIMIT con UNION"],
        explanation: "UNION di query limitate.",
        replacements: {},
        brokenCode: "SELECT ... LIMIT 3 UNION SELECT ... LIMIT 3",
        debugHint: "Usa le parentesi per i LIMIT individuali."
      },
      {
        titleTemplate: "Ordini 2023",
        descTemplate: "Ordini nell'anno 2023 (YEAR in subquery logic, actually simple).",
        queryTemplate: "SELECT * FROM Orders WHERE YEAR(order_date) = 2023",
        hints: ["YEAR() function"],
        explanation: "Filtro anno semplice (Advanced Easy per contesto).",
        replacements: {},
        brokenCode: "...",
        debugHint: "YEAR()."
      },
      {
        titleTemplate: "Prodotti Sotto Media Elettronica",
        descTemplate: "Prodotti che costano meno della media della categoria Electronics.",
        queryTemplate: "SELECT * FROM Products WHERE price < (SELECT AVG(price) FROM Products WHERE category = 'Electronics')",
        hints: ["Calcola AVG per Electronics"],
        explanation: "Confronto con costante calcolata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery AVG."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Prodotti Top Categoria",
        descTemplate: "Prodotti con prezzo superiore alla media della *loro* categoria.",
        queryTemplate: "SELECT * FROM Products p1 WHERE price > (SELECT AVG(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Usa una subquery correlata", "Nella subquery filtra per p2.category = p1.category"],
        explanation: "Questa è una subquery correlata: per ogni prodotto, calcoliamo la media della sua specifica categoria per il confronto.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products GROUP BY category)",
        debugHint: "La subquery restituisce più valori (uno per categoria). Devi correlarla con WHERE p2.category = p1.category."
      },
      {
        titleTemplate: "Utenti VIP",
        descTemplate: "Utenti che hanno effettuato un singolo ordine di valore superiore a 1000.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE order_total > 1000)",
        hints: ["Filtra gli ordini con total > 1000", "Prendi gli user_id"],
        explanation: "Identifichiamo gli utenti 'High Spender' basandoci sui totali dei loro ordini.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE order_total > 1000",
        debugHint: "Order_total è nella tabella Orders, non Users."
      },
      {
        titleTemplate: "Dipendenti Senior",
        descTemplate: "Dipendenti assunti prima del proprio manager.",
        queryTemplate: "SELECT e.name FROM Employees e WHERE e.hire_date < (SELECT m.hire_date FROM Employees m WHERE m.id = e.manager_id)",
        hints: ["Subquery correlata per trovare la hire_date del manager", "Confronta e.hire_date < m.hire_date"],
        explanation: "Confrontiamo la data di assunzione del dipendente con quella del suo diretto superiore.",
        replacements: {},
        brokenCode: "SELECT name FROM Employees JOIN Employees m ON manager_id = id WHERE hire_date < m.hire_date",
        debugHint: "Usa subquery WHERE hire_date < (SELECT ...)."
      },
      {
        titleTemplate: "Categoria Dominante",
        descTemplate: "Trova la categoria che contiene il prodotto più costoso di tutto il negozio.",
        queryTemplate: "SELECT category FROM Products WHERE price = (SELECT MAX(price) FROM Products)",
        hints: ["Trova il prezzo massimo globale con MAX(price)", "Seleziona la categoria del prodotto con quel prezzo"],
        explanation: "Individuiamo in quale categoria si 'nasconde' il prodotto di punta.",
        replacements: {},
        brokenCode: "SELECT MAX(price) FROM Products",
        debugHint: "Questo restituisce il prezzo, non la categoria."
      },
      {
        titleTemplate: "Utenti Senza Ordini",
        descTemplate: "Trova gli utenti che non hanno mai effettuato ordini (usando NOT EXISTS).",
        queryTemplate: "SELECT * FROM Users u WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        hints: ["Usa WHERE NOT EXISTS", "Correda la subquery con u.id = o.user_id"],
        explanation: "NOT EXISTS è efficiente per verificare l'assenza di record correlati.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE id NOT IN Orders",
        debugHint: "Sintassi NOT IN errata. Dovresti specificare (SELECT user_id FROM Orders)."
      },
      {
        titleTemplate: "Prodotti Esclusivi",
        descTemplate: "Prodotti che sono stati ordinati SOLAMENTE da utenti Premium.",
        queryTemplate: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems) AND id NOT IN (SELECT product_id FROM OrderItems WHERE order_id IN (SELECT id FROM Orders WHERE user_id IN (SELECT id FROM Users WHERE is_premium = false)))",
        hints: ["Escludi i prodotti ordinati da utenti NON premium", "Assicurati che siano stati ordinati almeno una volta"],
        explanation: "Un esercizio di esclusione logica a più livelli.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Pensaci al negativo: escludi chi è stato comprato da non-premium."
      },
      {
        titleTemplate: "Acquisto Utente",
        descTemplate: "Mostra ID ordine e il nome dell'utente (usando una subquery nella colonna SELECT).",
        queryTemplate: "SELECT id, (SELECT name FROM Users WHERE id = Orders.user_id) as user_name FROM Orders",
        hints: ["Scrivi la subquery al posto di una colonna", "Correlala con Orders.user_id"],
        explanation: "Le subquery possono essere usate anche nella lista delle colonne per recuperare dati correlati senza JOIN esplicite.",
        replacements: {},
        brokenCode: "SELECT id, name FROM Orders",
        debugHint: "La colonna 'name' non è in Orders."
      },
      {
        titleTemplate: "Ultimo Arrivato",
        descTemplate: "Trova l'utente che si è registrato per ultimo.",
        queryTemplate: "SELECT * FROM Users WHERE created_at = (SELECT MAX(created_at) FROM Users)",
        hints: ["Usa MAX(created_at)", "Filtra Users per quella data"],
        explanation: "Recuperiamo il record corrispondente alla data più recente.",
        replacements: {},
        brokenCode: "SELECT MAX(created_at) FROM Users",
        debugHint: "Questo ritorna solo la data, usa SELECT * WHERE date = ..."
      },
      {
        titleTemplate: "Categorie Vuote",
        descTemplate: "Categorie presenti nel sistema ma che non hanno prodotti in vendita (simulato tramite NOT IN).",
        queryTemplate: "SELECT DISTINCT category FROM Products p1 WHERE category NOT IN (SELECT category FROM Products p2 WHERE stock > 0)",
        hints: ["Trova categorie con stock > 0", "Filtra quelle che NON sono in quella lista"],
        explanation: "Identifichiamo categorie 'fantasma' o esaurite.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Usa NOT IN su una lista di categorie attive."
      },
      {
        titleTemplate: "Varianza Prezzi",
        descTemplate: "Prodotti con prezzo molto lontano dalla media (> 2 volte).",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price)*2 FROM Products)",
        hints: ["AVG(price)*2", "Confronta col prezzo prodotto"],
        explanation: "Outliers di prezzo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery AVG."
      },
      {
        titleTemplate: "Ordini Multipli",
        descTemplate: "Utenti che hanno fatto più di 1 ordine.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(*) > 1)",
        hints: ["Subquery raggruppa user_id e conta > 1"],
        explanation: "Filtro su frequenza ordini.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING COUNT."
      },
      {
        titleTemplate: "Nessun Ordine Recente",
        descTemplate: "Utenti che non hanno ordini nel 2023.",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders WHERE YEAR(order_date) = 2023)",
        hints: ["Trova chi ha ordinato nel 2023", "Escludili con NOT IN"],
        explanation: "Esclusione temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "Spesa % su Totale",
        descTemplate: "Per ogni ordine, mostra ID e la % sul fatturato totale (Subquery SELECT).",
        queryTemplate: "SELECT id, (order_total / (SELECT SUM(order_total) FROM Orders) * 100) as perc FROM Orders",
        hints: ["Calcola SUM(total) in subquery", "Dividi order_total / SUM * 100"],
        explanation: "Calcolo relativo su totale globale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery nel SELECT."
      },
      {
        titleTemplate: "Clienti Multi-Prodotto",
        descTemplate: "Utenti che hanno ordinato almeno 2 prodotti DIVERSI.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(DISTINCT product_id) >= 2))",
        hints: ["OrderItems count distinct product_id >= 2", "Risali agli Users"],
        explanation: "Varietà di acquisto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(DISTINCT product_id)."
      },
      {
        titleTemplate: "Best Sellers",
        descTemplate: "Prodotti venduti più della media delle quantità vendute per prodotto.",
        queryTemplate: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems GROUP BY product_id HAVING COUNT(*) > (SELECT COUNT(*)/COUNT(DISTINCT product_id) FROM OrderItems))",
        hints: ["Confronto complesso: Count > Avg Count"],
        explanation: "Performance relativa.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery in HAVING."
      },
      {
        titleTemplate: "Utenti Sopra-Media",
        descTemplate: "Utenti il cui totale ordini medio è sopra la media globale degli ordini.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id HAVING AVG(order_total) > (SELECT AVG(order_total) FROM Orders)",
        hints: ["AVG(total) per user > AVG(total) globale"],
        explanation: "High value customers.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING AVG > (SELECT AVG...)."
      },
      {
        titleTemplate: "Categorie Ricche",
        descTemplate: "Categorie con più di 3 prodotti.",
        queryTemplate: "SELECT category FROM Products GROUP BY category HAVING COUNT(*) > 3",
        hints: ["GROUP BY category", "HAVING COUNT > 3"],
        explanation: "Aggregazione categorie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Manager Importanti",
        descTemplate: "Dipendenti che gestiscono più di 2 persone.",
        queryTemplate: "SELECT * FROM Employees WHERE id IN (SELECT manager_id FROM Employees GROUP BY manager_id HAVING COUNT(*) > 2)",
        hints: ["Conta occorrenze di manager_id"],
        explanation: "Responsabilità manageriale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery GROUP BY manager_id."
      },
      {
        titleTemplate: "Ordini Misti",
        descTemplate: "Ordini che contengono prodotti di categorie diverse (Join implicita check).",
        queryTemplate: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) > 1",
        hints: ["Join OrderItems-Products", "Count distinct category > 1"],
        explanation: "Ordini eterogenei.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(DISTINCT category)."
      },
      {
        titleTemplate: "Monitor e Tastiera",
        descTemplate: "Utenti che hanno comprato sia 'Monitor' che 'Keyboard' (Logic Intersection).",
        queryTemplate: "SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name='Monitor')) AND user_id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name='Keyboard')))",
        hints: ["Insieme A AND Insieme B"],
        explanation: "Intersezione di due insiemi di acquirenti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AND tra due condizioni IN."
      },
      {
        titleTemplate: "Prodotti Dormienti",
        descTemplate: "Prodotti non ordinati nell'ultimo mese (usando DATE_SUB in subquery).",
        queryTemplate: "SELECT * FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id WHERE order_date > DATE_SUB(CURDATE(), INTERVAL 1 MONTH))",
        hints: ["Trova prodotti ordinati recentemente", "Usa NOT IN"],
        explanation: "Analisi inventario morto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN."
      },
      {
        titleTemplate: "Max Ordini Utente",
        descTemplate: "Utente con il maggior numero di ordini.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 1",
        hints: ["GROUP BY user_id", "ORDER BY COUNT DESC LIMIT 1"],
        explanation: "Top user per frequenza.",
        replacements: {},
        brokenCode: "...",
        debugHint: "LIMIT 1."
      },
      {
        titleTemplate: "Prezzo Medio Mario",
        descTemplate: "Prezzo medio dei prodotti comprati da 'Mario Rossi'.",
        queryTemplate: "SELECT AVG(p.price) FROM OrderItems oi JOIN Products p ON oi.product_id = p.id JOIN Orders o ON oi.order_id = o.id JOIN Users u ON o.user_id = u.id WHERE u.name = 'Mario Rossi'",
        hints: ["Join a 4 tabelle", "AVG(price)"],
        explanation: "Spesa media per articolo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attento alle JOIN."
      },
      {
        titleTemplate: "Secondo Più Caro",
        descTemplate: "Il secondo prodotto più costoso.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC LIMIT 1 OFFSET 1",
        hints: ["ORDER BY price DESC", "LIMIT 1 OFFSET 1"],
        explanation: "Paginazione semplice.",
        replacements: {},
        brokenCode: "...",
        debugHint: "OFFSET 1."
      },
      {
        titleTemplate: "Ordini Sopra Max 2",
        descTemplate: "Ordini con totale superiore al massimo ordine dell'utente 2.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > (SELECT MAX(order_total) FROM Orders WHERE user_id = 2)",
        hints: ["Trova MAX(total) user 2", "Confronta"],
        explanation: "Benchmark su utente specifico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery MAX."
      },
      {
        titleTemplate: "Utenti Multi-Cat",
        descTemplate: "Utenti che hanno comprato da più di 2 categorie diverse.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.id HAVING COUNT(DISTINCT p.category) > 2",
        hints: ["Join completa", "Count distinct category > 2"],
        explanation: "Ecletticità clienti.",
        replacements: {},
        brokenCode: "...",
        debugHint: "COUNT(DISTINCT)."
      },
      {
        titleTemplate: "Prodotti Costosi Elettronica",
        descTemplate: "Prodotti che costano più della media della categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products WHERE category = 'Electronics')",
        hints: ["AVG(price) WHERE category='Electronics'"],
        explanation: "Confronto con benchmark di settore.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery AVG."
      },
      {
        titleTemplate: "Clienti Locali",
        descTemplate: "Clienti che vivono nello stesso paese del dipendente ID 1.",
        queryTemplate: "SELECT * FROM Users WHERE country = (SELECT 'Italy' FROM Employees WHERE id = 1)",
        hints: ["Subquery country Employee 1 (Assumi Italy o campo)"],
        explanation: "Matching geografico.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery."
      },
      {
        titleTemplate: "Ordini Anomali",
        descTemplate: "Ordini con un numero di item superiore alla media degli item per ordine.",
        queryTemplate: "SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) > (SELECT COUNT(*)/COUNT(DISTINCT order_id) FROM OrderItems)",
        hints: ["Confronta COUNT(*) ordine corrente con media globale items/ordine"],
        explanation: "Ordini grossi.",
        replacements: {},
        brokenCode: "...",
        debugHint: "HAVING."
      },
      {
        titleTemplate: "Solo Elettronica",
        descTemplate: "Utenti che hanno comprato SOLO Electronics (Exclusion logic).",
        queryTemplate: "SELECT user_id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY user_id HAVING COUNT(DISTINCT CASE WHEN p.category != 'Electronics' THEN p.id END) = 0",
        hints: ["HAVING count non-electronics = 0"],
        explanation: "Fedeltà alla categoria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Condizione negativa in HAVING."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Best Seller Assoluto",
        descTemplate: "Il prodotto con la maggior quantità totale venduta.",
        queryTemplate: "SELECT name FROM Products WHERE id = (SELECT product_id FROM OrderItems GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 1)",
        hints: ["Somma le quantità per prodotto", "Ordina decrescente e prendi il primo"],
        explanation: "Combiniamo aggregazione, ordinamento e limite dentro una subquery per trovare il 'campione'.",
        replacements: {},
        brokenCode: "SELECT MAX(SUM(quantity)) FROM OrderItems",
        debugHint: "Non puoi annidare aggregazioni direttamente. Usa Order By e Limit."
      },
      {
        titleTemplate: "Clienti Persi",
        descTemplate: "Utenti che non hanno ordinato dopo il 2023-01-01.",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders WHERE order_date >= '2023-01-01')",
        hints: ["Trova chi HA ordinato dopo la data", "Escludili con NOT IN"],
        explanation: "Analisi di retention: identifichiamo chi non è attivo di recente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Filtra prima gli attivi, poi escludili dalla lista totale."
      },
      {
        titleTemplate: "Ordini Misti",
        descTemplate: "Ordini che contengono prodotti di almeno 2 categorie diverse.",
        queryTemplate: "SELECT order_id FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id GROUP BY order_id HAVING COUNT(DISTINCT category) >= 2",
        hints: ["Fai join con Products", "Conta le categorie distinte per ordine", "HAVING COUNT >= 2"],
        explanation: "Analisi della varietà del carrello acquisti.",
        replacements: {},
        brokenCode: "SELECT order_id FROM OrderItems GROUP BY order_id HAVING DISTINCT category > 1",
        debugHint: "Category è in Products, serve una JOIN. E usa COUNT(DISTINCT ...)."
      },
      {
        titleTemplate: "Dipendenti Isolati",
        descTemplate: "Dipendenti che non hanno manager (CEO) E non sono manager di nessuno.",
        queryTemplate: "SELECT name FROM Employees WHERE manager_id IS NULL AND id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)",
        hints: ["manager_id IS NULL", "id NOT IN lista manager"],
        explanation: "Casi limite nella gerarchia aziendale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Attento ai NULL nella subquery del NOT IN."
      },
      {
        titleTemplate: "Gap Analysis",
        descTemplate: "Prodotti che esistono ma non sono mai stati venduti (stesso di Easy ma con Join/Exclusion complessa).",
        queryTemplate: "SELECT p.name FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id WHERE oi.id IS NULL",
        hints: ["Usa LEFT JOIN", "Filtra dove la parte destra è NULL"],
        explanation: "La tecnica del LEFT JOIN ... IS NULL è un'alternativa performante al NOT IN.",
        replacements: {},
        brokenCode: "SELECT name FROM Products JOIN OrderItems ...",
        debugHint: "Una JOIN normale (INNER) esclude i non venduti. Usa LEFT JOIN."
      },
      {
        titleTemplate: "Budget Sforato",
        descTemplate: "Ordini dove il singolo articolo più costoso vale più del 50% del totale ordine.",
        queryTemplate: "SELECT id FROM Orders o WHERE (SELECT MAX(unit_price * quantity) FROM OrderItems i WHERE i.order_id = o.id) > o.order_total * 0.5",
        hints: ["Trova il max valore riga di un ordine", "Confronta col totale"],
        explanation: "Analisi della distribuzione del valore dentro un ordine.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Devi calcolare il valore della riga (prezzo*qta) non solo il prezzo unitario."
      },
      {
        titleTemplate: "Super Utenti",
        descTemplate: "Utenti che hanno speso più della media di spesa degli utenti Premium.",
        queryTemplate: "SELECT * FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.id, u.name HAVING SUM(o.order_total) > (SELECT AVG(total_spent) FROM (SELECT SUM(order_total) as total_spent FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE is_premium=true GROUP BY Users.id) as sub)",
        hints: ["Calcola la spesa media dei premium (subquery complessa)", "Confronta la somma spese utente con quel valore"],
        explanation: "Confronto avanzato tra segmenti di clientela.",
        replacements: {},
        brokenCode: "...",
        debugHint: "È un calcolo a più livelli: somma per utente, poi media di quelle somme."
      },
      {
        titleTemplate: "Categoria Ricca",
        descTemplate: "Categoria con la somma totale dei prezzi di listino più alta.",
        queryTemplate: "SELECT category FROM Products GROUP BY category ORDER BY SUM(price) DESC LIMIT 1",
        hints: ["Raggruppa per categoria", "Somma i prezzi", "Ordina e limita"],
        explanation: "Valutazione del valore di inventario per categoria.",
        replacements: {},
        brokenCode: "...",
        debugHint: "SUM(price) e ORDER BY DESC."
      },
      {
        titleTemplate: "Ordini Fantasma",
        descTemplate: "Ordini associati a utenti che non esistono più (violazione integrità, simulata).",
        queryTemplate: "SELECT * FROM Orders WHERE user_id NOT IN (SELECT id FROM Users)",
        hints: ["Controlla user_id vs Users.id"],
        explanation: "Check di integrità referenziale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "NOT IN Users."
      },
      {
        titleTemplate: "Concorrenza Interna",
        descTemplate: "Prodotti che costano più del prodotto più costoso della categoria 'Home'.",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT MAX(price) FROM Products WHERE category = 'Home')",
        hints: ["Trova max price category Home", "Filtra products > quel valore"],
        explanation: "Benchmarking tra categorie.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MAX(price) con WHERE category = 'Home'."
      },
      {
        titleTemplate: "Fedeltà Mensile",
        descTemplate: "Utenti che hanno fatto ordini in mesi diversi (almeno 2 mesi diversi).",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(DISTINCT MONTH(order_date)) >= 2",
        hints: ["Usa MONTH(order_date)", "COUNT DISTINCT"],
        explanation: "Analisi della frequenza di acquisto nel tempo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "AlaSQL supporta MONTH()."
      },
      {
        titleTemplate: "Senza Sconto",
        descTemplate: "Prodotti mai venduti a un prezzo inferiore al prezzo di listino.",
        queryTemplate: "SELECT name FROM Products p WHERE NOT EXISTS (SELECT 1 FROM OrderItems i WHERE i.product_id = p.id AND i.unit_price < p.price)",
        hints: ["Cerca items con unit_price < p.price", "Usa NOT EXISTS"],
        explanation: "Verifica della tenuta del prezzo di mercato.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Confronta unit_price con p.price corrente."
      },
      {
        titleTemplate: "Reparto Produttivo",
        descTemplate: "Dipartimenti dove tutti sono stati assunti dopo il 2020.",
        queryTemplate: "SELECT department FROM Employees GROUP BY department HAVING MIN(hire_date) > '2020-01-01'",
        hints: ["Raggruppa per dipartimento", "Controlla che la data MINIMA sia > 2020"],
        explanation: "Analisi demografica aziendale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Se il minimo è > 2020, allora tutti sono > 2020."
      },
      {
        titleTemplate: "Elite Club",
        descTemplate: "Utenti che hanno comprato solo prodotti sopra i 100€.",
        queryTemplate: "SELECT DISTINCT user_id FROM Orders o WHERE NOT EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id = p.id WHERE i.order_id = o.id AND p.price <= 100)",
        hints: ["Escludi utenti che hanno comprato roba economica", "Doppia negazione"],
        explanation: "Identificazione di clienti alto-spendenti puri.",
        replacements: {},
        brokenCode: "...",
        debugHint: "È più facile trovare chi ha comprato cose economiche ed escluderli."
      },
      {
        titleTemplate: "Merce Ferma",
        descTemplate: "Prodotti con stock > 0 ma nessun ordine negli ultimi 3 mesi (simulato con data fissa).",
        queryTemplate: "SELECT * FROM Products p WHERE stock > 0 AND p.id NOT IN (SELECT product_id FROM OrderItems i JOIN Orders o ON i.order_id = o.id WHERE o.order_date > '2023-09-01')",
        hints: ["Filtra prodotti venduti recentemente", "Escludili dalla lista prodotti con stock"],
        explanation: "Analisi inventory turnover per identificare 'dead stock'.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Combina check magazzino con check storico ordini."
      },
      {
        titleTemplate: "Top 3 Per Categoria",
        descTemplate: "I 3 prodotti più costosi di OGNI categoria (Correlated Subquery trick).",
        queryTemplate: "SELECT * FROM Products p1 WHERE (SELECT COUNT(*) FROM Products p2 WHERE p2.category = p1.category AND p2.price > p1.price) < 3",
        hints: ["Conta quanti prodotti nella stessa categoria costano PIÙ di me", "Se sono meno di 3, io sono nei top 3"],
        explanation: "Tecnica classica per simulare RANK/PARTITION BY in SQL standard.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Correlazione p2.price > p1.price."
      },
      {
        titleTemplate: "Acquisto Crociato",
        descTemplate: "Utenti che hanno comprato Monitor ma NON Keyboard.",
        queryTemplate: "SELECT id FROM Users WHERE id IN (SELECT user_id FROM Orders o JOIN OrderItems i ON o.id=i.order_id JOIN Products p ON i.product_id=p.id WHERE p.name='Monitor') AND id NOT IN (SELECT user_id FROM Orders o JOIN OrderItems i ON o.id=i.order_id JOIN Products p ON i.product_id=p.id WHERE p.name='Keyboard')",
        hints: ["IN lista Monitor", "NOT IN lista Keyboard"],
        explanation: "Analisi di basket incompleto.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Due subquery separate."
      },
      {
        titleTemplate: "Media Mobile (Sim)",
        descTemplate: "Ordini che valgono più della media degli ordini del giorno precedente (Self Join Date).",
        queryTemplate: "SELECT o1.id FROM Orders o1 JOIN Orders o2 ON DATE(o2.order_date) = DATE_SUB(DATE(o1.order_date), INTERVAL 1 DAY) GROUP BY o1.id HAVING o1.order_total > AVG(o2.order_total)",
        hints: ["Self join su data = data - 1", "Confronta total con AVG"],
        explanation: "Confronto temporale (Time Series analysis).",
        replacements: {},
        brokenCode: "...",
        debugHint: "Join complessa sulle date."
      },
      {
        titleTemplate: "Prodotti 'Ponte'",
        descTemplate: "Prodotti comprati sia da utenti Italiani che da utenti USA.",
        queryTemplate: "SELECT name FROM Products p WHERE EXISTS (SELECT 1 FROM OrderItems i JOIN Orders o ON i.order_id=o.id JOIN Users u ON o.user_id=u.id WHERE i.product_id=p.id AND u.country='Italy') AND EXISTS (SELECT 1 FROM OrderItems i JOIN Orders o ON i.order_id=o.id JOIN Users u ON o.user_id=u.id WHERE i.product_id=p.id AND u.country='USA')",
        hints: ["EXISTS Italieni", "EXISTS Americani"],
        explanation: "Intersezione di mercati.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Doppio EXISTS."
      },
      {
        titleTemplate: "Clienti Ricorrenti",
        descTemplate: "Utenti con almeno due ordini nello stesso giorno.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id, order_date HAVING COUNT(*) >= 2",
        hints: ["Group by user AND date", "Having count >= 2"],
        explanation: "Identificazione comportamento d'acquisto compulsivo.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Raggruppa su due colonne."
      },
      {
        titleTemplate: "Coppia Prodotti",
        descTemplate: "Utenti che hanno comprato 'Smartphone' e 'Cover' nello stesso ordine.",
        queryTemplate: "SELECT o.user_id FROM Orders o WHERE EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id=p.id WHERE i.order_id=o.id AND p.name='Smartphone') AND EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id=p.id WHERE i.order_id=o.id AND p.name='Cover')",
        hints: ["Check due prodotti nello stesso order_id"],
        explanation: "Market Basket Analysis specifica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Stesso order_id per entrambi i prodotti."
      },
      {
        titleTemplate: "Salto di Qualità",
        descTemplate: "Utenti il cui ultimo ordine è molto più alto (> 2x) del loro primo ordine (Subqueries Min/Max date).",
        queryTemplate: "SELECT u.id FROM Users u JOIN Orders o_first ON u.id=o_first.user_id JOIN Orders o_last ON u.id=o_last.user_id WHERE o_first.order_date = (SELECT MIN(order_date) FROM Orders WHERE user_id=u.id) AND o_last.order_date = (SELECT MAX(order_date) FROM Orders WHERE user_id=u.id) AND o_last.order_total > o_first.order_total * 2",
        hints: ["Join con primo ordine", "Join con ultimo ordine", "Confronta totali"],
        explanation: "Analisi evoluzione cliente.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Trova min e max date per user."
      },
      {
        titleTemplate: "Stagionalità",
        descTemplate: "Mese con il maggior fatturato totale.",
        queryTemplate: "SELECT MONTH(order_date) as m FROM Orders GROUP BY m ORDER BY SUM(order_total) DESC LIMIT 1",
        hints: ["Group by Month", "Order by Sum total"],
        explanation: "Analisi trend temporale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "MONTH()."
      },
      {
        titleTemplate: "Utenti Inattivi Lungo",
        descTemplate: "Utenti registrati da più di un anno che hanno fatto 0 ordini.",
        queryTemplate: "SELECT * FROM Users WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND id NOT IN (SELECT user_id FROM Orders)",
        hints: ["Filtra per created_at", "NOT IN Orders"],
        explanation: "Dead accounts retention.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DATE_SUB."
      },
      {
        titleTemplate: "Prezzo Mediano (Sim)",
        descTemplate: "Trova il prodotto che sta a metà classifica di prezzo (Ranking trick).",
        queryTemplate: "SELECT * FROM Products p1 WHERE (SELECT COUNT(*) FROM Products p2 WHERE p2.price <= p1.price) = (SELECT COUNT(*) FROM Products p3) / 2",
        hints: ["Conta quanti costano meno", "Confronta con metà del count totale"],
        explanation: "Simulazione calcolo mediana.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Difficile: conta i 'minori o uguali'."
      },
      {
        titleTemplate: "Tutti i Prodotti",
        descTemplate: "Utenti che hanno comprato TUTTI i prodotti della categoria 'Accessories' (Division Relazionale).",
        queryTemplate: "SELECT id FROM Users u WHERE NOT EXISTS (SELECT id FROM Products p WHERE category='Accessories' AND NOT EXISTS (SELECT 1 FROM Orders o JOIN OrderItems i ON o.id=i.order_id WHERE o.user_id=u.id AND i.product_id=p.id))",
        hints: ["Non esiste un prodotto Accessories che l'utente NON ha comprato", "Doppio NOT EXISTS"],
        explanation: "Relational Division: l'utente ha coperto l'intero set.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Logica molto avanzata: Users senza (Prodotti Accessories senza Ordini)."
      },
      {
        titleTemplate: "Regioni Vuote",
        descTemplate: "Paesi (presi dagli Utenti) dove non ci sono ordini sopra i 500€.",
        queryTemplate: "SELECT DISTINCT country FROM Users u1 WHERE NOT EXISTS (SELECT 1 FROM Orders o JOIN Users u2 ON o.user_id=u2.id WHERE u2.country=u1.country AND o.order_total > 500)",
        hints: ["Per ogni paese, check se esiste order > 500", "Se non esiste, selezionalo"],
        explanation: "Analisi performance geografica.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Correlazione su country."
      },
      {
        titleTemplate: "Dipendenti Sottopagati",
        descTemplate: "Dipendenti assunti dopo il 2021 che però sono manager.",
        queryTemplate: "SELECT * FROM Employees WHERE hire_date > '2021-01-01' AND id IN (SELECT manager_id FROM Employees)",
        hints: ["Filtra data", "Check se sono manager"],
        explanation: "Analisi carriera rapida.",
        replacements: {},
        brokenCode: "...",
        debugHint: "IN manager_id."
      },
      {
        titleTemplate: "Ordini per Giorno",
        descTemplate: "Giorno della settimana con più ordini in assoluto.",
        queryTemplate: "SELECT DAYNAME(order_date) as d FROM Orders GROUP BY d ORDER BY COUNT(*) DESC LIMIT 1",
        hints: ["DAYNAME o DAYOFWEEK", "Group by, count, order desc"],
        explanation: "Ottimizzazione logistica settimanale.",
        replacements: {},
        brokenCode: "...",
        debugHint: "DAYNAME."
      },
      {
        titleTemplate: "Full House",
        descTemplate: "Ordini che contengono almeno un prodotto per OGNI categoria esistente (molto difficile).",
        queryTemplate: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id=p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) = (SELECT COUNT(DISTINCT category) FROM Products)",
        hints: ["Conta categorie nell'ordine", "Confronta con count totale categorie"],
        explanation: "Completezza dell'ordine.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Subquery per il numero totale di categorie."
      }
    ],
  },
};

// --- GENERATOR FUNCTION ---
export const generateExercises = (
  topicId: TopicId,
  difficulty: Difficulty,
  count: number = 30
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
