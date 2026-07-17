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

// --- DATA LISTS (TechStore Schema — allineato con initDatabase di sqlService.ts) ---
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
  columns_employees: ["name", "department", "email", "hire_date", "manager_id", "salary"],
  countries: [
    "Italy",
    "France",
    "Germany",
    "Spain",
    "USA",
    "UK",
    "Netherlands",
    "Japan",
    "Canada",
    "Australia",
  ],
  names: [
    "Mario Rossi",
    "Alice",
    "Ghost User",
    "Dormant User",
  ],
  categories: [
    "Electronics",
    "Computers",
    "Smartphones",
    "Tablets",
    "Audio",
    "Wearables",
    "Gaming",
    "Cameras",
    "Accessories",
    "Networking",
    "Home",
  ],
  departments: [
    "Executive",
    "Sales",
    "Marketing",
    "Engineering",
    "HR",
    "Finance",
    "Support",
  ],
  order_statuses: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
  product_names: [
    "Monitor 4K",
    "Lampada Smart",
    "Keyboard",
    "Smartphone",
    "Divano Luxury",
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
export const QUESTION_DATABASE: Record<string, Record<string, ExerciseBlueprint[]>> = {
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
        explanation: "SELECT * seleziona tutte le colonne della tabella. In produzione è meglio specificare le colonne necessarie per performance e chiarezza.",
        replacements: {},
        brokenCode: "SELECT ALL FROM Products",
        debugHint: "In SQL si usa * non ALL per le colonne."
      },
      {
        titleTemplate: "Tutto su Orders",
        descTemplate: "Seleziona tutte le colonne dalla tabella Orders.",
        queryTemplate: "SELECT * FROM Orders",
        hints: ["Usa l'asterisco per selezionare tutte le colonne", "La tabella degli ordini si chiama Orders"],
        explanation: "SELECT * seleziona tutte le colonne della tabella. In produzione è meglio specificare le colonne necessarie per performance e chiarezza.",
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
        brokenCode: "SELECT FROM OrderItems",
        debugHint: "Controlla il nome della tabella."
      },
      {
        titleTemplate: "Tutto su Employees",
        descTemplate: "Seleziona tutte le colonne dalla tabella Employees.",
        queryTemplate: "SELECT * FROM Employees",
        hints: ["L'asterisco seleziona tutte le colonne disponibili", "La tabella dei dipendenti è Employees"],
        explanation: "SELECT * seleziona tutte le colonne della tabella. In produzione è meglio specificare le colonne necessarie per performance e chiarezza.",
        replacements: {},
        brokenCode: "SELEC * FROM Employees",
        debugHint: "Ricorda SELECT * FROM."
      },
      {
        titleTemplate: "Nomi Utenti",
        descTemplate: "Seleziona solo la colonna 'name' dalla tabella Users.",
        queryTemplate: "SELECT name FROM Users",
        hints: ["Dopo SELECT non sei obbligato a mettere l'asterisco: puoi elencare le colonne che ti servono.", "Ti serve una sola colonna, quindi il risultato avrà una sola intestazione."],
        explanation: "Elencando i nomi delle colonne dopo SELECT chiedi al database solo quei dati. Il risultato ha una colonna sola invece di tutte quelle della tabella. È anche l'abitudine giusta fuori dagli esercizi: leggere solo le colonne che servi riduce il lavoro del database e rende esplicito cosa ti aspetti.",
        replacements: {},
        brokenCode: "SELECT Users FROM name",
        debugHint: "Prima le colonne, poi la tabella."
      },
      {
        titleTemplate: "Email Utenti",
        descTemplate: "Seleziona solo la colonna 'email' dalla tabella Users.",
        queryTemplate: "SELECT email FROM Users",
        hints: ["Seleziona solo il campo email", "La tabella degli utenti è Users"],
        explanation: "La proiezione su una singola colonna permette di estrarre solo i dati necessari, riducendo la dimensione del risultato.",
        replacements: {},
        brokenCode: "SELECT email Users",
        debugHint: "Usa SELECT email."
      },
      {
        titleTemplate: "Paesi Utenti",
        descTemplate: "Seleziona la colonna 'country' dalla tabella Users.",
        queryTemplate: "SELECT country FROM Users",
        hints: ["Proietta solo la colonna country"],
        explanation: "Selezionare una singola colonna è utile quando serve analizzare solo una dimensione dei dati, come la distribuzione geografica degli utenti.",
        replacements: {},
        brokenCode: "SELECT country Users",
        debugHint: "SELECT country FROM Users."
      },
      {
        titleTemplate: "Prodotti e Prezzi",
        descTemplate: "Seleziona le colonne 'name' e 'price' dalla tabella Products.",
        queryTemplate: "SELECT name, price FROM Products",
        hints: ["Separa i nomi colonna con una virgola"],
        explanation: "Selezionando più colonne separate da virgola si ottiene una vista personalizzata dei dati, scegliendo solo le informazioni rilevanti.",
        replacements: {},
        brokenCode: "SELECT name price FROM Products",
        debugHint: "Manca la virgola tra le colonne."
      },
      {
        titleTemplate: "Categorie Prodotti",
        descTemplate: "Seleziona la colonna 'category' da Products.",
        queryTemplate: "SELECT category FROM Products",
        hints: ["Seleziona solo la colonna category", "La tabella è Products"],
        explanation: "Lista categorie (con duplicati).",
        replacements: {},
        brokenCode: "SELECT Products FROM category",
        debugHint: "Controlla il nome colonna."
      },
      {
        titleTemplate: "Date Ordini",
        descTemplate: "Seleziona 'order_date' da Orders.",
        queryTemplate: "SELECT order_date FROM Orders",
        hints: ["Serve la colonna che contiene la data dell'ordine", "Il campo si chiama order_date nella tabella Orders"],
        explanation: "Selezionare le date degli ordini permette di analizzare la distribuzione temporale delle vendite.",
        replacements: {},
        brokenCode: "SELCT order_date FROM Orders",
        debugHint: "Attento all'underscore in order_date."
      },
      {
        titleTemplate: "Stati Ordini",
        descTemplate: "Seleziona la colonna 'status' da Orders.",
        queryTemplate: "SELECT status FROM Orders",
        hints: ["Cerca il campo che rappresenta lo stato dell'ordine", "Il campo si chiama status nella tabella Orders"],
        explanation: "Visualizzare lo stato degli ordini è utile per monitorare il flusso operativo e identificare eventuali colli di bottiglia.",
        replacements: {},
        brokenCode: "SELECT Orders FROM status",
        debugHint: "Usa SELECT status FROM Orders per selezionare lo stato degli ordini."
      },
      {
        titleTemplate: "Totali Ordini",
        descTemplate: "Seleziona 'order_total' da Orders.",
        queryTemplate: "SELECT order_total FROM Orders",
        hints: ["Serve la colonna con l'importo totale", "Si chiama order_total nella tabella Orders"],
        explanation: "I totali degli ordini permettono di analizzare i volumi di vendita e calcolare metriche come il valore medio dell'ordine.",
        replacements: {},
        brokenCode: "SELCT order_total FROM Orders",
        debugHint: "Il nome della colonna è order_total, controlla di averlo scritto correttamente."
      },
      {
        titleTemplate: "Quantità Vendute",
        descTemplate: "Seleziona 'quantity' da OrderItems.",
        queryTemplate: "SELECT quantity FROM OrderItems",
        hints: ["Tabella OrderItems, colonna quantity"],
        explanation: "Le quantità vendute sono fondamentali per l'analisi della domanda e la gestione dell'inventario.",
        replacements: {},
        brokenCode: "SELECT quantity OrderItems",
        debugHint: "Usa SELECT quantity dalla tabella OrderItems."
      },
      {
        titleTemplate: "Prezzi Unitari",
        descTemplate: "Seleziona 'unit_price' da OrderItems.",
        queryTemplate: "SELECT unit_price FROM OrderItems",
        hints: ["Cerca il prezzo unitario nella tabella giusta", "La colonna si chiama unit_price in OrderItems"],
        explanation: "Selezionare colonne specifiche (proiezione) è una best practice: riduce il trasferimento di dati e rende la query più esplicita.",
        replacements: {},
        brokenCode: "SELECT unit_price OrderItems",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Dipartimenti Staff",
        descTemplate: "Seleziona 'department' da Employees.",
        queryTemplate: "SELECT department FROM Employees",
        hints: ["Seleziona il campo del dipartimento", "La tabella dei dipendenti è Employees"],
        explanation: "Visualizzare i dipartimenti aiuta a comprendere la struttura organizzativa dell'azienda e le aree funzionali.",
        replacements: {},
        brokenCode: "SELECT department Employees",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Nomi Staff",
        descTemplate: "Seleziona 'name' da Employees.",
        queryTemplate: "SELECT name FROM Employees",
        hints: ["Seleziona il campo con il nome", "La tabella è Employees"],
        explanation: "Estrarre la lista dei nomi dei dipendenti è il primo passo per creare report del personale.",
        replacements: {},
        brokenCode: "SELCT name FROM Employees",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Utenti Premium?",
        descTemplate: "Seleziona 'name' e 'is_premium' da Users.",
        queryTemplate: "SELECT name, is_premium FROM Users",
        hints: ["Due colonne separate da virgola"],
        explanation: "Il campo booleano is_premium distingue gli utenti con abbonamento premium da quelli con account gratuito.",
        replacements: {},
        brokenCode: "SELECT name is_premium FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        explanation: "COUNT(DISTINCT ...) conta i valori unici, eliminando i duplicati prima del conteggio.",
        replacements: {},
        brokenCode: "SELECT DISTINCT FROM category",
        debugHint: "DISTINCT va prima del nome colonna."
      },
      {
        titleTemplate: "Prezzo Scontato",
        descTemplate: "Seleziona il nome del prodotto e il prezzo dimezzato (price / 2).",
        queryTemplate: "SELECT name, price / 2 FROM Products",
        hints: ["Puoi fare operazioni matematiche dopo la virgola"],
        explanation: "SQL permette di creare colonne calcolate direttamente nella query, senza modificare i dati originali nella tabella.",
        replacements: {},
        brokenCode: "SELECT name price / 2 FROM Products",
        debugHint: "Per calcolare la metà del prezzo, dividi per 2 usando l'operatore /."
      },
      {
        titleTemplate: "Prezzo con IVA",
        descTemplate: "Seleziona il nome e il prezzo aumentato del 22% (price * 1.22).",
        queryTemplate: "SELECT name, price * 1.22 FROM Products",
        hints: ["Moltiplica per 1.22"],
        explanation: "Moltiplicare il prezzo per 1.22 aggiunge il 22% di IVA, creando una colonna calcolata con il prezzo finale.",
        replacements: {},
        brokenCode: "SELECT name price * 1.22 FROM Products",
        debugHint: "Per aggiungere il 22% di IVA, moltiplica il prezzo per 1.22."
      },
      {
        titleTemplate: "Valore Stock",
        descTemplate: "Seleziona nome e valore totale stock (price * stock) da Products.",
        queryTemplate: "SELECT name, price * stock FROM Products",
        hints: ["Moltiplica due colonne tra loro"],
        explanation: "Moltiplicando due colonne si ottiene un valore calcolato per ogni riga, utile per stimare il valore dell'inventario.",
        replacements: {},
        brokenCode: "SELECT name price * stock FROM Products",
        debugHint: "Moltiplica le colonne price e stock per ottenere il valore dell'inventario."
      },
      {
        titleTemplate: "Valore Riga Ordine",
        descTemplate: "Seleziona quantity * unit_price da OrderItems.",
        queryTemplate: "SELECT quantity * unit_price FROM OrderItems",
        hints: ["Calcola il totale di riga"],
        explanation: "Moltiplicando quantità per prezzo unitario si ottiene l'importo di ogni riga dell'ordine.",
        replacements: {},
        brokenCode: "SELCET quantity * unit_price FROM OrderItems",
        debugHint: "Il totale di riga si calcola moltiplicando quantity per unit_price."
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
        hints: ["Rinomina entrambe le colonne usando AS", "Separa le colonne con la virgola"],
        explanation: "Gli alias multipli permettono di rinominare contemporaneamente più colonne nel risultato, migliorando la leggibilità dei report.",
        replacements: {},
        brokenCode: "SELECT name IS Prodotto, price AS Euro FROM Products",
        debugHint: "AS Prodotto, ... AS Euro."
      },
      {
        titleTemplate: "Giorni Registrazione",
        descTemplate: "Seleziona created_at da Users.",
        queryTemplate: "SELECT created_at FROM Users",
        hints: ["Cerca il campo con la data di registrazione", "Il campo si chiama created_at nella tabella Users"],
        explanation: "Le colonne di tipo data contengono informazioni temporali utili per analisi cronologiche e filtraggio per periodi.",
        replacements: {},
        brokenCode: "SELECT Users FROM created_at",
        debugHint: "Il campo della data di registrazione si chiama created_at."
      },
      {
        titleTemplate: "Ruoli Staff",
        descTemplate: "Seleziona i dipartimenti distinti da Employees.",
        queryTemplate: "SELECT DISTINCT department FROM Employees",
        hints: ["Evita ripetizioni di dipartimenti"],
        explanation: "DISTINCT elimina i duplicati dal risultato, mostrando ogni valore una sola volta.",
        replacements: {},
        brokenCode: "SELECT department DISTINCT FROM Employees",
        debugHint: "Aggiungi DISTINCT subito dopo la keyword SELECT per eliminare i duplicati."
      },
      {
        titleTemplate: "Stati Ordine Unici",
        descTemplate: "Quali sono i possibili stati di un ordine? (Usa DISTINCT).",
        queryTemplate: "SELECT DISTINCT status FROM Orders",
        hints: ["Usa la keyword DISTINCT per eliminare i duplicati", "La colonna da selezionare è status dalla tabella Orders"],
        explanation: "DISTINCT applicato alla colonna status rivela tutti gli stati possibili nel ciclo di vita di un ordine.",
        replacements: {},
        brokenCode: "SELECT status DISTINCT FROM Orders",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Mix Colonne",
        descTemplate: "Seleziona id, user_id e status da Orders.",
        queryTemplate: "SELECT id, user_id, status FROM Orders",
        hints: ["Tre colonne separate da virgole"],
        explanation: "Selezionare colonne specifiche permette di costruire viste mirate sui dati, combinando solo le informazioni necessarie.",
        replacements: {},
        brokenCode: "SELECT id user_id, status FROM Orders",
        debugHint: "Separa i nomi delle colonne con virgole nella clausola SELECT."
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
        debugHint: "La keyword AS si usa dopo il nome della colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Alias Prezzo",
        descTemplate: "Seleziona 'price' e rinominalo 'Costo_Unitario'.",
        queryTemplate: "SELECT price AS Costo_Unitario FROM Products",
        hints: ["Rinomina la colonna prezzo con un alias significativo", "Usa la keyword AS per creare un alias"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT price IS Costo_Unitario FROM Products",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Due Alias",
        descTemplate: "Seleziona name come 'Piatto' e price come 'Prezzo'.",
        queryTemplate: "SELECT name AS Piatto, price AS Prezzo FROM Products",
        hints: ["Due alias separati da virgola"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT name IS Piatto, price AS Prezzo FROM Products",
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
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT quantity * unit_price IS Totale FROM OrderItems",
        debugHint: "quantity * unit_price AS Totale."
      },
      {
        titleTemplate: "Incremento Prezzo",
        descTemplate: "Simula un aumento di 5€ su ogni prodotto. Mostra il nuovo prezzo come 'NewPrice'.",
        queryTemplate: "SELECT price + 5 AS NewPrice FROM Products",
        hints: ["Usa l'operatore + per sommare valori", "Puoi aggiungere un numero fisso a una colonna"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT price + 5 IS NewPrice FROM Products",
        debugHint: "price + 5."
      },
      {
        titleTemplate: "Sconto 50%",
        descTemplate: "Mostra il prezzo scontato del 50% come 'Promo'.",
        queryTemplate: "SELECT price * 0.5 AS Promo FROM Products",
        hints: ["Moltiplica per 0.5"],
        explanation: "Dividere per 2 è equivalente a uno sconto del 50%. Le operazioni aritmetiche nelle query permettono calcoli al volo.",
        replacements: {},
        brokenCode: "SELECT price * 0.5 IS Promo FROM Products",
        debugHint: "price * 0.5."
      },
      {
        titleTemplate: "Distinct Stati",
        descTemplate: "Trova tutti gli stati unici degli ordini.",
        queryTemplate: "SELECT DISTINCT status FROM Orders",
        hints: ["DISTINCT elimina i duplicati dal risultato", "Posiziona DISTINCT subito dopo SELECT"],
        explanation: "DISTINCT fornisce la lista completa degli stati possibili, utile per validazione e analisi del workflow.",
        replacements: {},
        brokenCode: "SELECT status DISTINCT FROM Orders",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Distinct Country",
        descTemplate: "Trova i paesi unici di provenienza degli utenti.",
        queryTemplate: "SELECT DISTINCT country FROM Users",
        hints: ["Usa DISTINCT per ottenere valori unici", "Seleziona dalla tabella Users"],
        explanation: "Usare DISTINCT sulla colonna country elimina i duplicati e mostra tutti i paesi rappresentati nel database.",
        replacements: {},
        brokenCode: "SELECT country DISTINCT FROM Users",
        debugHint: "SELECT DISTINCT country."
      },
      {
        titleTemplate: "Distinct Category",
        descTemplate: "Elenca le categorie di prodotto senza duplicati.",
        queryTemplate: "SELECT DISTINCT category FROM Products",
        hints: ["Solo categorie uniche"],
        explanation: "DISTINCT applicato alla categoria produce la lista delle categorie merceologiche disponibili nel catalogo.",
        replacements: {},
        brokenCode: "SELECT category DISTINCT FROM Products",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Distinct Department",
        descTemplate: "Elenca i dipartimenti aziendali unici.",
        queryTemplate: "SELECT DISTINCT department FROM Employees",
        hints: ["DISTINCT elimina i valori ripetuti", "Il campo del dipartimento si trova nella tabella Employees"],
        explanation: "DISTINCT sulla colonna department restituisce la lista dei reparti aziendali senza ripetizioni.",
        replacements: {},
        brokenCode: "SELECT department DISTINCT FROM Employees",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Manager Unici",
        descTemplate: "Trova gli ID unici dei manager nella tabella Employees.",
        queryTemplate: "SELECT DISTINCT manager_id FROM Employees",
        hints: ["Attenzione ai null, ma DISTINCT li gestisce"],
        explanation: "I manager_id unici rappresentano tutti i supervisori presenti nell'organigramma aziendale.",
        replacements: {},
        brokenCode: "SELECT manager_id DISTINCT FROM Employees",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Utenti Attivi (Ordini)",
        descTemplate: "Trova gli user_id unici che hanno fatto ordini.",
        queryTemplate: "SELECT DISTINCT user_id FROM Orders",
        hints: ["DISTINCT su user_id in Orders"],
        explanation: "Selezionare gli user_id distinti dagli ordini identifica tutti i clienti che hanno effettuato almeno un acquisto.",
        replacements: {},
        brokenCode: "SELECT user_id DISTINCT FROM Orders",
        debugHint: "SELECT DISTINCT user_id."
      },
      {
        titleTemplate: "Prodotti Venduti",
        descTemplate: "Trova i product_id unici che sono stati venduti (in OrderItems).",
        queryTemplate: "SELECT DISTINCT product_id FROM OrderItems",
        hints: ["Devi trovare i valori unici di product_id", "Cerca nella tabella OrderItems"],
        explanation: "I product_id unici negli ordini mostrano quanti prodotti del catalogo sono stati effettivamente venduti.",
        replacements: {},
        brokenCode: "SELECT product_id DISTINCT FROM OrderItems",
        debugHint: "SELECT DISTINCT product_id."
      },
      {
        titleTemplate: "Ordini Multi-Prodotto",
        descTemplate: "Trova gli order_id unici in OrderItems (dovrebbero essere tutti quelli con righe).",
        queryTemplate: "SELECT DISTINCT order_id FROM OrderItems",
        hints: ["Cerca gli order_id unici", "La tabella è OrderItems"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT order_id DISTINCT FROM OrderItems",
        debugHint: "SELECT DISTINCT order_id."
      },
      {
        titleTemplate: "Valore Magazzino",
        descTemplate: "Calcola il valore totale per prodotto (price * stock) chiamandolo 'InventoryVal'.",
        queryTemplate: "SELECT price * stock AS InventoryVal FROM Products",
        hints: ["Moltiplicazione con alias"],
        explanation: "Il valore di magazzino (prezzo × stock) è un indicatore chiave per la gestione dell'inventario e la contabilità.",
        replacements: {},
        brokenCode: "SELECT price * stock IS InventoryVal FROM Products",
        debugHint: "price * stock AS ..."
      },
      {
        titleTemplate: "Stima Fatturato Anno",
        descTemplate: "Se ogni utente spendesse 100€, quanto incasseremmo? Calcola 100 per ogni riga (non aggregato).",
        queryTemplate: "SELECT 100 AS Potenziale FROM Users",
        hints: ["Seleziona una costante"],
        explanation: "Aggiungere una colonna calcolata con valore costante è utile per proiezioni e stime rapide.",
        replacements: {},
        brokenCode: "SELECT 100 IS Potenziale FROM Users",
        debugHint: "SELECT 100 ..."
      },
      {
        titleTemplate: "IVA Separata",
        descTemplate: "Mostra price, e l'importo dell'IVA (price * 0.22) come 'Solo_IVA'.",
        queryTemplate: "SELECT price, price * 0.22 AS Solo_IVA FROM Products",
        hints: ["Calcola solo il 22%"],
        explanation: "Separare il prezzo netto dall'importo IVA è fondamentale per la fatturazione e la contabilità fiscale.",
        replacements: {},
        brokenCode: "SELECT price price * 0.22 AS Solo_IVA FROM Products",
        debugHint: "price * 0.22."
      },
      {
        titleTemplate: "Sconto Quantità",
        descTemplate: "Se compri 10 pezzi, quanto costa? Mostra (price * 10) come 'Costo_10_Pezzi'.",
        queryTemplate: "SELECT price * 10 AS Costo_10_Pezzi FROM Products",
        hints: ["Moltiplica prezzo per 10"],
        explanation: "Con un'espressione calcolata puoi simulare scenari di prezzo, come sconti sulla quantità, direttamente nella query.",
        replacements: {},
        brokenCode: "SELECT price * 10 IS Costo_10_Pezzi FROM Products",
        debugHint: "price * 10."
      },
      {
        titleTemplate: "Margine",
        descTemplate: "Supponendo un costo del 60%, calcola il margine (price * 0.4) come 'Guadagno'.",
        queryTemplate: "SELECT price * 0.4 AS Guadagno FROM Products",
        hints: ["Il 40% del prezzo"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT price * 0.4 IS Guadagno FROM Products",
        debugHint: "price * 0.4."
      },
      {
        titleTemplate: "Nome e Categoria",
        descTemplate: "Seleziona 'name' e 'category', rinominando category in 'Reparto'.",
        queryTemplate: "SELECT name, category AS Reparto FROM Products",
        hints: ["Solo il secondo ha l'alias"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT name category AS Reparto FROM Products",
        debugHint: "category AS Reparto."
      },
      {
        titleTemplate: "Alias Numerico",
        descTemplate: "Seleziona id rinominandolo 'Codice'.",
        queryTemplate: "SELECT id AS Codice FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT id IS Codice FROM Users",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Distinct Multiplo 1",
        descTemplate: "Seleziona combinazioni uniche di country e is_premium da Users.",
        queryTemplate: "SELECT DISTINCT country, is_premium FROM Users",
        hints: ["DISTINCT si applica a tutte le colonne elencate"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT country, is_premium DISTINCT FROM Users",
        debugHint: "SELECT DISTINCT country, is_premium."
      },
      {
        titleTemplate: "Distinct Multiplo 2",
        descTemplate: "Seleziona combinazioni uniche di category e price da Products (per vedere se ci sono prodotti con stesso prezzo in stessa cat).",
        queryTemplate: "SELECT DISTINCT category, price FROM Products",
        hints: ["Usa DISTINCT per eliminare i valori ripetuti", "La colonna da rendere unica è category"],
        explanation: "COUNT(DISTINCT ...) conta i valori unici, eliminando i duplicati prima del conteggio.",
        replacements: {},
        brokenCode: "SELECT category, price DISTINCT FROM Products",
        debugHint: "SELECT DISTINCT category, price."
      },
      {
        titleTemplate: "Distinct Multiplo 3",
        descTemplate: "Seleziona combinazioni uniche di user_id e status da Orders.",
        queryTemplate: "SELECT DISTINCT user_id, status FROM Orders",
        hints: ["Chi ha avuto quali stati"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT user_id, status DISTINCT FROM Orders",
        debugHint: "DISTINCT user_id, status."
      },
      {
        titleTemplate: "Calcolo Complesso",
        descTemplate: "Calcola (quantity * unit_price) + 10 (spese spedizione fisse) AS 'Totale_Pieno'.",
        queryTemplate: "SELECT (quantity * unit_price) + 10 AS Totale_Pieno FROM OrderItems",
        hints: ["Usa le parentesi per chiarezza, poi + 10"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT (quantity * unit_price) + 10 IS Totale_Pieno FROM OrderItems",
        debugHint: "(...) + 10."
      },
      {
        titleTemplate: "Metà Prezzo",
        descTemplate: "Seleziona price / 2 AS 'HalfPrice' da Products.",
        queryTemplate: "SELECT price / 2 AS HalfPrice FROM Products",
        hints: ["Seleziona dalla tabella Products", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT price / 2 IS HalfPrice FROM Products",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Prezzo Netto Immaginario",
        descTemplate: "Se price include IVA 22%, calcola il netto (price / 1.22) AS 'Netto'.",
        queryTemplate: "SELECT price / 1.22 AS Netto FROM Products",
        hints: ["Dividi per 1.22"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT price / 1.22 IS Netto FROM Products",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Proiezione Costante Stringa",
        descTemplate: "Seleziona name e una colonna fissa con valore 'Active' chiamata 'Status'.",
        queryTemplate: "SELECT name, 'Active' AS Status FROM Users",
        hints: ["Stringa fissa tra apici come colonna"],
        explanation: "Aggiungere colonne statiche al result set.",
        replacements: {},
        brokenCode: "SELECT name, 'Active' IS Status FROM Users",
        debugHint: "'Active' AS Status."
      },
      {
        titleTemplate: "Proiezione Costante Numero",
        descTemplate: "Seleziona id e il numero 1 come 'Flag' da Orders.",
        queryTemplate: "SELECT id, 1 AS Flag FROM Orders",
        hints: ["Numero 1 come colonna"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT id 1 AS Flag FROM Orders",
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
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Products LIMIT 5",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Singolo Ordine",
        descTemplate: "Seleziona solo 1 riga dalla tabella Orders.",
        queryTemplate: "SELECT * FROM Orders LIMIT 1",
        hints: ["LIMIT 1"],
        explanation: "Utile per vedere un campione di dati.",
        replacements: {},
        brokenCode: "SELCET * FROM Orders LIMIT 1",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Top 10 OrderItems",
        descTemplate: "Seleziona le prime 10 righe di OrderItems.",
        queryTemplate: "SELECT * FROM OrderItems LIMIT 10",
        hints: ["LIMIT 10"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM OrderItems LIMIT 10",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Due Dipendenti",
        descTemplate: "Seleziona solo 2 dipendenti.",
        queryTemplate: "SELECT * FROM Employees LIMIT 2",
        hints: ["LIMIT 2"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Employees LIMIT 2",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        hints: ["Usa LIMIT per il numero di righe e OFFSET per saltare le prime", "OFFSET 1 salta la prima riga"],
        explanation: "Ignora la prima riga e prendi le successive.",
        replacements: {},
        brokenCode: "SELCET * FROM Products LIMIT 3 OFFSET 1",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Offset Semplice",
        descTemplate: "Seleziona 1 ordine saltando i primi 10.",
        queryTemplate: "SELECT * FROM Orders LIMIT 1 OFFSET 10",
        hints: ["LIMIT imposta quante righe prendere, OFFSET quante saltarne", "Vuoi solo 1 riga, dopo aver saltato le prime 10"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Orders LIMIT 1 OFFSET 10",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Skip e Take",
        descTemplate: "Prendi 4 righe di OrderItems saltandone 2.",
        queryTemplate: "SELECT * FROM OrderItems LIMIT 4 OFFSET 2",
        hints: ["OFFSET indica da dove iniziare, LIMIT quante righe prendere", "Salta le prime 2 righe, poi prendi le successive 4"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM OrderItems LIMIT 4 OFFSET 2",
        debugHint: "LIMIT 4 OFFSET 2."
      },
      {
        titleTemplate: "Consultazione",
        descTemplate: "Prendi 2 dipendenti saltando il primo.",
        queryTemplate: "SELECT * FROM Employees LIMIT 2 OFFSET 1",
        hints: ["Combina LIMIT e OFFSET per la paginazione", "Salta il primo dipendente e prendi i successivi 2"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Employees LIMIT 2 OFFSET 1",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Proiezione Nulla",
        descTemplate: "Seleziona una colonna con valore NULL chiamata 'Nullo' da Users (limit 1).",
        queryTemplate: "SELECT NULL AS Nullo FROM Users LIMIT 1",
        hints: ["SELECT NULL ... LIMIT 1"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT NULL IS Nullo FROM Users LIMIT 1",
        debugHint: "NULL AS Nullo."
      },
      {
        titleTemplate: "Verifica Esistenza",
        descTemplate: "Seleziona il valore 1 da Products LIMIT 1 (pattern 'select 1').",
        queryTemplate: "SELECT 1 FROM Products LIMIT 1",
        hints: ["SELECT 1 ..."],
        explanation: "Spesso usato per verificare se la tabella non è vuota.",
        replacements: {},
        brokenCode: "SELCET 1 FROM Products LIMIT 1",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Alias su Costante",
        descTemplate: "Seleziona 'Test' as T da Orders LIMIT 1.",
        queryTemplate: "SELECT 'Test' AS T FROM Orders LIMIT 1",
        hints: ["Stringa fissa con alias"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT 'Test' IS T FROM Orders LIMIT 1",
        debugHint: "'Test' AS T."
      },
      {
        titleTemplate: "Math su Costanti",
        descTemplate: "Calcola 10 * 10 come 'Cento' selezionando da Users LIMIT 1.",
        queryTemplate: "SELECT 10 * 10 AS Cento FROM Users LIMIT 1",
        hints: ["Operazione matematica pura"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT 10 * 10 IS Cento FROM Users LIMIT 1",
        debugHint: "10 * 10."
      },
      {
        titleTemplate: "Colonna + Alias + Limit",
        descTemplate: "Seleziona name AS N dalla tabella Users, solo i primi 2.",
        queryTemplate: "SELECT name AS N FROM Users LIMIT 2",
        hints: ["Combina Alias e Limit"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT name IS N FROM Users LIMIT 2",
        debugHint: "AS N ... LIMIT 2."
      },
      {
        titleTemplate: "Distinct con Limit",
        descTemplate: "Seleziona i primi 3 paesi unici (DISTINCT country) da Users.",
        queryTemplate: "SELECT DISTINCT country FROM Users LIMIT 3",
        hints: ["Prima DISTINCT poi LIMIT applica il limite ai risultati unici"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT country DISTINCT FROM Users LIMIT 3",
        debugHint: "SELECT DISTINCT ... LIMIT 3."
      },
      {
        titleTemplate: "Limit Grande",
        descTemplate: "Seleziona name da Products LIMIT 100 (anche se ce ne sono meno).",
        queryTemplate: "SELECT name FROM Products LIMIT 100",
        hints: ["Seleziona dalla tabella Products", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Il LIMIT non fallisce se le righe sono meno.",
        replacements: {},
        brokenCode: "SELCET name FROM Products LIMIT 100",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Offset Grande",
        descTemplate: "Seleziona * da Users OFFSET 100 (probabilmente vuoto).",
        queryTemplate: "SELECT * FROM Users LIMIT 10 OFFSET 100",
        hints: ["OFFSET molto alto"],
        explanation: "Restituisce zero righe se l'offset supera il count.",
        replacements: {},
        brokenCode: "SELCET * FROM Users LIMIT 10 OFFSET 100",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ultimo (Simulato)",
        descTemplate: "Seleziona tutto da Orders LIMIT 1 OFFSET 4 (Simula prendere il 5° elemento).",
        queryTemplate: "SELECT * FROM Orders LIMIT 1 OFFSET 4",
        hints: ["Prende esattamente la 5a riga"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Orders LIMIT 1 OFFSET 4",
        debugHint: "LIMIT 1 OFFSET 4."
      },
      {
        titleTemplate: "Calcolo Iva e Limit",
        descTemplate: "Mostra name e prezzo+iva per i primi 3 prodotti.",
        queryTemplate: "SELECT name, price * 1.22 AS Ivato FROM Products LIMIT 3",
        hints: ["Calcolo in select, limit alla fine"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT name price * 1.22 AS Ivato FROM Products LIMIT 3",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Stringa Vuota",
        descTemplate: "Seleziona una stringa vuota '' come 'Empty' da Users LIMIT 1.",
        queryTemplate: "SELECT '' AS Empty FROM Users LIMIT 1",
        hints: ["Due apici singoli ''"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT '' IS Empty FROM Users LIMIT 1",
        debugHint: "'' AS Empty."
      },
      {
        titleTemplate: "Booleano",
        descTemplate: "Seleziona true come 'Vero' da Users LIMIT 1.",
        queryTemplate: "SELECT true AS Vero FROM Users LIMIT 1",
        hints: ["Valore booleano true"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT true IS Vero FROM Users LIMIT 1",
        debugHint: "true AS Vero."
      },
      {
        titleTemplate: "Falso",
        descTemplate: "Seleziona false come 'Falso' da Users LIMIT 1.",
        queryTemplate: "SELECT false AS Falso FROM Users LIMIT 1",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT false IS Falso FROM Users LIMIT 1",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Zero",
        descTemplate: "Seleziona 0 come 'Zero' da Users LIMIT 1.",
        queryTemplate: "SELECT 0 AS Zero FROM Users LIMIT 1",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT 0 IS Zero FROM Users LIMIT 1",
        debugHint: "0 AS Zero."
      },
      {
        titleTemplate: "Limit senza Offset",
        descTemplate: "È equivalente a OFFSET 0. Seleziona * da Orders LIMIT 2 OFFSET 0.",
        queryTemplate: "SELECT * FROM Orders LIMIT 2 OFFSET 0",
        hints: ["Esplicita OFFSET 0"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Orders LIMIT 2 OFFSET 0",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Moltiplicazione Colonne Limitata",
        descTemplate: "Seleziona quantity * unit_price da OrderItems LIMIT 5.",
        queryTemplate: "SELECT quantity * unit_price FROM OrderItems LIMIT 5",
        hints: ["Calcolo e Limit"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET quantity * unit_price FROM OrderItems LIMIT 5",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Paginazione Avanzata",
        descTemplate: "Seleziona 3 utenti partita dalla riga 3 (OFFSET 2).",
        queryTemplate: "SELECT * FROM Users LIMIT 3 OFFSET 2",
        hints: ["Ricorda che OFFSET è 0-based o 1-based? (In SQL standard offset N salta N righe)"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELCET * FROM Users LIMIT 3 OFFSET 2",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Solo Nomi Distinct",
        descTemplate: "Primi 3 nomi unici da Users.",
        queryTemplate: "SELECT DISTINCT name FROM Users LIMIT 3",
        hints: ["DISTINCT e LIMIT"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT name DISTINCT FROM Users LIMIT 3",
        debugHint: "SELECT DISTINCT ... LIMIT 3."
      },
      {
        titleTemplate: "Solo Categorie Distinct",
        descTemplate: "Prime 2 categorie uniche da Products.",
        queryTemplate: "SELECT DISTINCT category FROM Products LIMIT 2",
        hints: ["DISTINCT category ... LIMIT 2"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT category DISTINCT FROM Products LIMIT 2",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Select All Limitata",
        descTemplate: "Seleziona tutto da Employees LIMIT 1.",
        queryTemplate: "SELECT * FROM Employees LIMIT 1",
        hints: ["Ultima verifica semplice"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELCET * FROM Employees LIMIT 1",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
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
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Usa = invece di IS."
      },
      {
        titleTemplate: "Ordini Spediti",
        descTemplate: "Seleziona gli ordini con status 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status == 'Shipped'",
        debugHint: "status = 'Shipped'."
      },
      {
        titleTemplate: "Prodotti Costosi",
        descTemplate: "Seleziona i prodotti con prezzo superiore a 100.",
        queryTemplate: "SELECT * FROM Products WHERE price > 100",
        hints: ["Usa il simbolo maggiore >"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price BIGGER 100",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotti Economici",
        descTemplate: "Seleziona i prodotti con prezzo inferiore a 20.",
        queryTemplate: "SELECT * FROM Products WHERE price < 20",
        hints: ["Usa il simbolo minore <"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE price < 20",
        debugHint: "price < 20."
      },
      {
        titleTemplate: "Quantità Esatta",
        descTemplate: "Seleziona le righe di OrderItems con quantity uguale a 1.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity = 1",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems WERE quantity = 1",
        debugHint: "quantity = 1."
      },
      {
        titleTemplate: "Utenti Premium",
        descTemplate: "Seleziona gli utenti con is_premium = true (o 1).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = TRUE",
        hints: ["is_premium = TRUE oppure true"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE is_premium = TRUE",
        debugHint: "is_premium = TRUE."
      },
      {
        titleTemplate: "Dipendenti IT",
        descTemplate: "Seleziona i dipendenti del dipartimento 'IT'.",
        queryTemplate: "SELECT * FROM Employees WHERE department = 'Sales'",
        hints: ["department = 'IT'"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE department == 'Sales'",
        debugHint: "department = 'IT'."
      },
      {
        titleTemplate: "Categoria Elettronica",
        descTemplate: "Seleziona i prodotti della categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category == 'Electronics'",
        debugHint: "category = 'Electronics'."
      },
      {
        titleTemplate: "Ordini di un Utente",
        descTemplate: "Seleziona gli ordini dell'utente con id 5.",
        queryTemplate: "SELECT * FROM Orders WHERE user_id = 5",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WERE user_id = 5",
        debugHint: "user_id = 5."
      },
      {
        titleTemplate: "Prezzo Esatto",
        descTemplate: "Seleziona i prodotti che costano esattamente 50.",
        queryTemplate: "SELECT * FROM Products WHERE price = 50",
        hints: ["price = 50"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE price = 50",
        debugHint: "price = 50."
      },
      {
        titleTemplate: "Stock Basso",
        descTemplate: "Seleziona prodotti con stock inferiore o uguale a 10.",
        queryTemplate: "SELECT * FROM Products WHERE stock <= 10",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock =< 10",
        debugHint: "L'operatore è <=."
      },
      {
        titleTemplate: "Ordini Recenti (ID)",
        descTemplate: "Seleziona ordini con id maggiore di 50.",
        queryTemplate: "SELECT * FROM Orders WHERE id > 50",
        hints: ["id > 50"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE id < 50",
        debugHint: "id > 50."
      },
      {
        titleTemplate: "Utenti Non Premium",
        descTemplate: "Seleziona utenti con is_premium = FALSE (false).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = FALSE",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE is_premium = FALSE",
        debugHint: "is_premium = FALSE."
      },
      {
        titleTemplate: "Utenti USA",
        descTemplate: "Seleziona utenti che vivono in 'USA'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'USA'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country == 'USA'",
        debugHint: "country = 'USA'."
      },
      {
        titleTemplate: "Ordini Pending",
        descTemplate: "Seleziona ordini con status 'Pending'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Pending'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status == 'Pending'",
        debugHint: "status = 'Pending'."
      },
      {
        titleTemplate: "Dipartimento HR",
        descTemplate: "Seleziona dipendenti di 'HR'.",
        queryTemplate: "SELECT * FROM Employees WHERE department = 'HR'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE department == 'HR'",
        debugHint: "department = 'HR'."
      },
      {
        titleTemplate: "Alta Quantità",
        descTemplate: "Righe ordine con quantity >= 5.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity >= 2",
        hints: ["Maggiore o uguale >="],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems WHERE quantity <= 2",
        debugHint: "quantity >= 5."
      },
      {
        titleTemplate: "Prezzo Minimo",
        descTemplate: "Prodotti con prezzo >= 10.",
        queryTemplate: "SELECT * FROM Products WHERE price >= 10",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price <= 10",
        debugHint: "price >= 10."
      },
      {
        titleTemplate: "Prodotti Diversi da X",
        descTemplate: "Seleziona prodotti che NON hanno categoria 'Toys'.",
        queryTemplate: "SELECT * FROM Products WHERE category <> 'Toys'",
        hints: ["Usa <> oppure != per diverso"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category NOT 'Toys'",
        debugHint: "Usa <> o !=."
      },
      {
        titleTemplate: "Ordini non Spediti",
        descTemplate: "Seleziona ordini con status diverso da 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status != 'Shipped'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status !== 'Shipped'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotto Specifico",
        descTemplate: "Trova il prodotto con nome 'Laptop'.",
        queryTemplate: "SELECT * FROM Products WHERE name = 'Laptop'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE name == 'Laptop'",
        debugHint: "name = 'Laptop'."
      },
      {
        titleTemplate: "Utente Specifico",
        descTemplate: "Trova l'utente con email 'mario@example.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email = 'mario@example.com'",
        hints: ["Filtro su email"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE email == 'mario@example.com'",
        debugHint: "email = '...'."
      },
      {
        titleTemplate: "Data Specifica",
        descTemplate: "Seleziona ordini del '2023-01-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date = '2023-01-01'",
        hints: ["Le date vanno tra apici come le stringhe"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date = '2023-01-01'",
        debugHint: "order_date = '2023-01-01'."
      },
      {
        titleTemplate: "Dopo una Data",
        descTemplate: "Ordini successivi al '2023-01-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date > '2023-01-01'",
        hints: ["Usa > con la data stringa"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date > '2023-01-01'",
        debugHint: "order_date > '...'."
      },
      {
        titleTemplate: "Prima di una Data",
        descTemplate: "Ordini precedenti al '2023-06-01'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date < '2023-06-01'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date < '2023-06-01'",
        debugHint: "order_date < '...'."
      },
      {
        titleTemplate: "Assunzioni Recenti",
        descTemplate: "Dipendenti assunti dopo il '2022-01-01'.",
        queryTemplate: "SELECT * FROM Employees WHERE hire_date > '2022-01-01'",
        hints: ["hire_date > ..."],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT FROM Employees WHERE hire_date > '2022-01-01'",
        debugHint: "hire_date > '...'."
      },
      {
        titleTemplate: "Ordini Grandi",
        descTemplate: "OrderItems con quantity > 10.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity > 1",
        hints: ["quantity > 10"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems WHERE quantity < 1",
        debugHint: "quantity > 10."
      },
      {
        titleTemplate: "Prodotti Stock Zero",
        descTemplate: "Prodotti con stock = 0.",
        queryTemplate: "SELECT * FROM Products WHERE stock = 0",
        hints: ["stock = 0"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE stock = 0",
        debugHint: "stock = 0."
      },
      {
        titleTemplate: "Categoria Casa",
        descTemplate: "Prodotti category = 'Home'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Home'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category == 'Home'",
        debugHint: "category = 'Home'."
      },
      {
        titleTemplate: "Utenti Francia",
        descTemplate: "Utenti country = 'France'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'France'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country == 'France'",
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
        queryTemplate: "SELECT * FROM Products WHERE price < 100 OR category = 'Tech'",
        hints: ["Usa l'operatore OR"],
        explanation: "Basta che una delle condizioni sia vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price < 10 AND category = 'Toys'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "IN List (Numeri)",
        descTemplate: "Ordini con id 1, 3 o 5.",
        queryTemplate: "SELECT * FROM Orders WHERE id IN (1, 3, 5)",
        hints: ["Usa IN (...)"],
        explanation: "OR include righe che soddisfano almeno una delle condizioni specificate.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE id = (1, 3, 5)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "IN List (Stringhe)",
        descTemplate: "Utenti in 'Italy' o 'France'.",
        queryTemplate: "SELECT * FROM Users WHERE country IN ('Italy', 'France')",
        hints: ["Usa IN ('...', '...')"],
        explanation: "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IN 'Italy', 'France'",
        debugHint: "Parentesi tonde obbligatorie."
      },
      {
        titleTemplate: "Between Numerico",
        descTemplate: "Prodotti con prezzo tra 10 e 50 (inclusi).",
        queryTemplate: "SELECT * FROM Products WHERE price BETWEEN 10 AND 50",
        hints: ["Usa BETWEEN ... AND ..."],
        explanation: "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price IN 10 TO 50",
        debugHint: "Usa BETWEEN X AND Y."
      },
      {
        titleTemplate: "Between Date",
        descTemplate: "Ordini fatti nel 2023 (tra 2023-01-01 e 2023-12-31).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31'",
        hints: ["BETWEEN con date formato stringa"],
        explanation: "BETWEEN filtra per un intervallo inclusivo di valori, equivalente a >= AND <=. È più leggibile per filtri su range.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31'",
        debugHint: "BETWEEN '...' AND '...'"
      },
      {
        titleTemplate: "IS NULL",
        descTemplate: "Utenti senza email (email è NULL).",
        queryTemplate: "SELECT * FROM Users WHERE email IS NULL",
        hints: ["Usa IS NULL"],
        explanation: "BETWEEN filtra per un intervallo inclusivo di valori, equivalente a >= AND <=. È più leggibile per filtri su range.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE email = NULL",
        debugHint: "Non usare = NULL, usa IS NULL."
      },
      {
        titleTemplate: "IS NOT NULL",
        descTemplate: "Utenti con email valorizzata.",
        queryTemplate: "SELECT * FROM Users WHERE email IS NOT NULL",
        hints: ["Usa IS NOT NULL"],
        explanation: "IS NULL verifica se un valore è NULL (assente). Non si può usare = NULL perché NULL non è un valore, è l'assenza di valore.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE email != NULL",
        debugHint: "Non usare != NULL, usa IS NOT NULL."
      },
      {
        titleTemplate: "NOT Like",
        descTemplate: "Utenti la cui email NON finisce con '.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email NOT LIKE '%.com'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "IS NOT NULL seleziona solo le righe dove il campo ha un valore definito, escludendo i NULL.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE email NOT LIKE '%.com'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Filtro Combinato 1",
        descTemplate: "Prodotti 'Electronics' con stock > 0.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics' AND stock > 0",
        hints: ["AND tra due condizioni"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category == 'Electronics' AND stock > 0",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Filtro Combinato 2",
        descTemplate: "Prodotti 'Toys' oppure con prezzo < 5.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Tech' OR price < 50",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "AND combina più condizioni: tutte devono essere vere perché la riga sia inclusa nel risultato.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category == 'Tech' OR price < 50",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Like Iniziale",
        descTemplate: "Utenti il cui nome inizia per 'A'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE 'A%'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "OR include righe che soddisfano almeno una delle condizioni specificate.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE name = 'A%'",
        debugHint: "Usa LIKE per i pattern."
      },
      {
        titleTemplate: "Like Finale",
        descTemplate: "Utenti il cui nome finisce per 'o'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE '%o'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE name LIKE '%o'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Like Contiene",
        descTemplate: "Utenti il cui nome contiene 'ar'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE '%ar%'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE name LIKE '%ar%'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Underscore Wildcard",
        descTemplate: "Utenti con nome di 4 lettere che inizia per 'M' (M___).",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE 'A____'",
        hints: ["3 underscore per 3 caratteri qualsiasi"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE name LIKE 'A____'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "NOT IN (Numeri)",
        descTemplate: "Prodotti con id NON in (1, 2).",
        queryTemplate: "SELECT * FROM Products WHERE id NOT IN (1, 2)",
        hints: ["NOT IN (...)"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE id NOT IN (1, 2)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "NOT BETWEEN",
        descTemplate: "Prodotti con prezzo NON tra 20 e 100.",
        queryTemplate: "SELECT * FROM Products WHERE price NOT BETWEEN 20 AND 100",
        hints: ["NOT BETWEEN x AND y"],
        explanation: "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE price NOT BETWEEN 20 AND 100",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Priorità AND/OR 1",
        descTemplate: "Prodotti (Electronics OR Computers) AND price > 500.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Electronics' OR category = 'Computers') AND price > 500",
        hints: ["Usa le parentesi per l'OR"],
        explanation: "BETWEEN filtra per un intervallo inclusivo di valori, equivalente a >= AND <=. È più leggibile per filtri su range.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Electronics' OR category = 'Computers' AND price > 500",
        debugHint: "Senza parentesi l'AND vince sull'OR."
      },
      {
        titleTemplate: "Filtro Data Complesso",
        descTemplate: "Ordini spediti dopo il 2023-01-01.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped' AND order_date > '2023-01-01'",
        hints: ["AND tra stato e data"],
        explanation: "Combinare AND e OR richiede attenzione alle precedenze: AND ha priorità su OR. Usa le parentesi per controllo esplicito.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE status = 'Shipped' AND order_date > '2023-01-01'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Dipendenti Sales/HR",
        descTemplate: "Dipendenti in reparto 'Sales' o 'HR'.",
        queryTemplate: "SELECT * FROM Employees WHERE department IN ('Sales', 'HR')",
        hints: ["Usa IN per brevità"],
        explanation: "IN è più conciso di OR multipli.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WERE department IN ('Sales', 'HR')",
        debugHint: "IN ('Sales', 'HR')."
      },
      {
        titleTemplate: "Utenti Gmail",
        descTemplate: "Utenti con email che finisce in '@gmail.com'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail.com'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE email LIKE '%@gmail.com'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotti Stock Critico",
        descTemplate: "Prodotti con stock < 5 AND stock > 0.",
        queryTemplate: "SELECT * FROM Products WHERE stock < 5 AND stock > 0",
        hints: ["AND per intervallo aperto"],
        explanation: "Pochi pezzi rimasti ma non zero.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock < 5 AND stock < 0",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Utente Senza Paese",
        descTemplate: "Utenti dove country è NULL.",
        queryTemplate: "SELECT * FROM Users WHERE country IS NULL",
        hints: ["Per verificare i valori nulli usa IS NULL", "Non usare = NULL, non funziona in SQL"],
        explanation: "AND combina più condizioni: tutte devono essere vere perché la riga sia inclusa nel risultato.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE country IS NULL",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Ordini Recenti Non Spediti",
        descTemplate: "Ordini > '2023-01-01' ma non 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date > '2023-01-01' AND status != 'Shipped'",
        hints: ["AND ... !="],
        explanation: "IS NULL verifica se un valore è NULL (assente). Non si può usare = NULL perché NULL non è un valore, è l'assenza di valore.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date > '2023-01-01' AND status != 'Shipped'",
        debugHint: "AND status != ..."
      },
      {
        titleTemplate: "Esclusione Categorie",
        descTemplate: "Prodotti non Toys e non Books.",
        queryTemplate: "SELECT * FROM Products WHERE category NOT IN ('Toys', 'Books')",
        hints: ["Usa IN per confrontare con una lista di valori", "I valori nella lista vanno separati da virgola"],
        explanation: "AND combina più condizioni: tutte devono essere vere perché la riga sia inclusa nel risultato.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE category NOT IN ('Toys', 'Books')",
        debugHint: "NOT IN (...)."
      },
      {
        titleTemplate: "Like Case",
        descTemplate: "Utenti con nome che inizia per 'm' (con Like è solitamente case-insensitive in SQLite ma standard SQL chiede 'M%'). Qui usiamo 'M%'.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE 'M%'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "In molti DB LIKE è Case-Insensitive, ma sii specifico.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE name LIKE 'M%'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Range Date Escluso",
        descTemplate: "Ordini prima del 2022 o dopo il 2023.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date < '2022-01-01' OR order_date > '2023-12-31'",
        hints: ["OR per intervalli esterni"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date < '2022-01-01' OR order_date > '2023-12-31'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Filtro Boolean False",
        descTemplate: "Utenti non premium e con email specificata (IS NOT NULL).",
        queryTemplate: "SELECT * FROM Users WHERE is_premium = FALSE AND email IS NOT NULL",
        hints: ["AND tra booleani"],
        explanation: "OR include righe che soddisfano almeno una delle condizioni specificate.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE is_premium = FALSE AND email IS NOT NULL",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prezzo o Stock",
        descTemplate: "Prodotti che costano > 100 oppure hanno stock < 10.",
        queryTemplate: "SELECT * FROM Products WHERE price > 100 OR stock < 10",
        hints: ["OR su metriche diverse"],
        explanation: "IS NOT NULL seleziona solo le righe dove il campo ha un valore definito, escludendo i NULL.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price < 100 OR stock < 10",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Filtro Completo",
        descTemplate: "Utenti italiani, premium, con email.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy' AND is_premium = TRUE AND email IS NOT NULL",
        hints: ["Tre condizioni in AND"],
        explanation: "OR include righe che soddisfano almeno una delle condizioni specificate.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country == 'Italy' AND is_premium = TRUE AND email IS NOT NULL",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Logica Complessa (A o B) e C",
        descTemplate: "Prodotti che sono (Electronics o Computers) e costano > 500.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Electronics' OR category = 'Computers') AND price > 500",
        hints: ["Usa le parentesi: (cat1 OR cat2) AND price"],
        explanation: "IS NOT NULL seleziona solo le righe dove il campo ha un valore definito, escludendo i NULL.",
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
        titleTemplate: "Ordini senza Tracking (Simulato)",
        descTemplate: "Seleziona gli ordini 'Shipped', verificando con una subquery che il loro ID NON sia nella lista degli ordini 'Pending' (Questo è un esercizio di logica NOT IN).",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped' AND id NOT IN (SELECT id FROM Orders WHERE status = 'Pending')",
        hints: ["Simuliamo: id NOT IN (...)"],
        explanation: "OR include righe che soddisfano almeno una delle condizioni specificate.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status == 'Shipped' AND id NOT IN (SELECT id FROM Orders WHERE status = 'Pending')",
        debugHint: "Controlla la subquery."
      },
      {
        titleTemplate: "Utenti con Ordini",
        descTemplate: "Seleziona utenti che hanno fatto almeno un ordine.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["id IN (SELECT user_id ...)"],
        explanation: "Filtro basato su esistenza record correlati.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE id IN (SELECT user_id FROM Orders)",
        debugHint: "IN (SELECT ...)."
      },
      {
        titleTemplate: "Utenti Inattivi",
        descTemplate: "Utenti che NON hanno fatto ordini.",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders)",
        hints: ["NOT IN (SELECT ...)"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE id NOT IN (SELECT user_id FROM Orders)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotti Venduti",
        descTemplate: "Prodotti presenti in almeno un OrderItem.",
        queryTemplate: "SELECT * FROM Products WHERE id IN (SELECT product_id FROM OrderItems)",
        hints: ["id IN (SELECT product_id ...)"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE id IN (SELECT product_id FROM OrderItems)",
        debugHint: "IN (SELECT ...)."
      },
      {
        titleTemplate: "Prodotti Invenduti",
        descTemplate: "Prodotti mai venduti.",
        queryTemplate: "SELECT * FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems)",
        hints: ["NOT IN (SELECT ...)"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE id NOT IN (SELECT product_id FROM OrderItems)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Like Case Insensitive Esplicito",
        descTemplate: "Trova 'mario' ignorando maiuscole/minuscole (usando LOWER).",
        queryTemplate: "SELECT * FROM Users WHERE LOWER(name) LIKE 'mario%'",
        hints: ["LOWER(name) = '...'"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE LOWER(name) LIKE 'mario%'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Anno Corrente",
        descTemplate: "Ordini dell'anno 2023 (usando LIKE sulla data stringa).",
        queryTemplate: "SELECT * FROM Orders WHERE order_date LIKE '2023%'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WERE order_date LIKE '2023%'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Mese Specifico",
        descTemplate: "Ordini di Maggio di qualsiasi anno (LIKE '%-05-%').",
        queryTemplate: "SELECT * FROM Orders WHERE order_date LIKE '%-05-%'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date LIKE '%-05-%'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prezzo Scontato",
        descTemplate: "Prodotti dove il prezzo scontato del 10% è ancora > 100.",
        queryTemplate: "SELECT * FROM Products WHERE price * 0.9 > 100",
        hints: ["Calcolo a sinistra dell'operatore"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT FROM Products WHERE price * 0.9 > 100",
        debugHint: "price * 0.9 > 100."
      },
      {
        titleTemplate: "Lunghezza Nome",
        descTemplate: "Utenti con nome più lungo di 5 caratteri.",
        queryTemplate: "SELECT * FROM Users WHERE LENGTH(name) > 5",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE LENGTH(name) < 5",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Stock Dispari",
        descTemplate: "Prodotti con quantità di stock dispari (modulo 2).",
        queryTemplate: "SELECT * FROM Products WHERE stock % 2 <> 0",
        hints: ["stock % 2 <> 0 oppure != 0"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock % 2 << 0",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Coalesce Search",
        descTemplate: "Trova utenti dove country è NULL ma supponiamo 'Unknown' e cerca 'Unknown'. (Demo tecnica).",
        queryTemplate: "SELECT * FROM Users WHERE COALESCE(country, 'Unknown') = 'Unknown'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE COALESCE(country, 'Unknown') == 'Unknown'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: " Doppia Negazione",
        descTemplate: "Prodotti NON (category 'Toys' AND price < 10).",
        queryTemplate: "SELECT * FROM Products WHERE NOT (category = 'Toys' AND price < 10)",
        hints: ["NOT (A AND B)"],
        explanation: "Equivale a category != 'Toys' OR price >= 10.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE NOT (category == 'Toys' AND price < 10)",
        debugHint: "NOT ( ... )."
      },
      {
        titleTemplate: "Range con OR multipli",
        descTemplate: "Prodotti con ID 1-5 oppure 10-15.",
        queryTemplate: "SELECT * FROM Products WHERE (id BETWEEN 1 AND 5) OR (id BETWEEN 10 AND 15)",
        hints: ["(A) OR (B)"],
        explanation: "AND combina più condizioni: tutte devono essere vere perché la riga sia inclusa nel risultato.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE (id BETWEEN 1 AND 5) OR (id BETWEEN 10 AND 15)",
        debugHint: "BETWEEN ... OR ..."
      },
      {
        titleTemplate: "Email Dominio Complesso",
        descTemplate: "Utenti con email che contiene 'corp' ma non finisce con '.net'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%corp%' AND email NOT LIKE '%.net'",
        hints: ["LIKE AND NOT LIKE"],
        explanation: "BETWEEN filtra per un intervallo inclusivo di valori, equivalente a >= AND <=. È più leggibile per filtri su range.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE email LIKE '%corp%' AND email NOT LIKE '%.net'",
        debugHint: "LIKE ... AND ... NOT LIKE."
      },
      {
        titleTemplate: "Filtro Totale Ordine",
        descTemplate: "OrderItems dove (quantity * unit_price) > 50.",
        queryTemplate: "SELECT * FROM OrderItems WHERE quantity * unit_price > 50",
        hints: ["Moltiplicazione nella WHERE"],
        explanation: "Filtro su valore derivato riga per riga.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems WHERE quantity * unit_price < 50",
        debugHint: "* > 50."
      },
      {
        titleTemplate: "Subquery Max Price",
        descTemplate: "Prodotti che costano più della media (simulata con subquery statica o semplice).",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["price > (SELECT AVG(price)...)"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price < (SELECT AVG(price) FROM Products)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Utenti Stesso Paese Primo Utente",
        descTemplate: "Utenti che vivono nello stesso paese dell'utente con id 1.",
        queryTemplate: "SELECT * FROM Users WHERE country = (SELECT country FROM Users WHERE id = 1)",
        hints: ["= (SELECT country ...)"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE country = (SELECT country FROM Users WHERE id = 1)",
        debugHint: "Subquery che ritorna un scalare."
      },
      {
        titleTemplate: "Prodotti Categoria Popolare",
        descTemplate: "Prodotti nella categoria del prodotto id 10.",
        queryTemplate: "SELECT * FROM Products WHERE category = (SELECT category FROM Products WHERE id = 10)",
        hints: ["= (SELECT category ...)"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE category = (SELECT category FROM Products WHERE id = 10)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Ordini Stesso Giorno",
        descTemplate: "Ordini fatti lo stesso giorno dell'ordine 1.",
        queryTemplate: "SELECT * FROM Orders WHERE order_date = (SELECT order_date FROM Orders WHERE id = 1)",
        hints: ["= (SELECT order_date ...)"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WERE order_date = (SELECT order_date FROM Orders WHERE id = 1)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Esclusione Multipla ID",
        descTemplate: "Tutti gli utenti tranne id 1, 2 e 3 (usando NOT IN).",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (1, 2, 3)",
        hints: ["Usa IN per confrontare con una lista di valori", "I valori nella lista vanno separati da virgola"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE id NOT IN (1, 2, 3)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prezzo non nullo",
        descTemplate: "Prodotti con prezzo specificato (NOT NULL) e maggiore di 0.",
        queryTemplate: "SELECT * FROM Products WHERE price IS NOT NULL AND price > 0",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price IS NOT NULL AND price < 0",
        debugHint: "IS NOT NULL."
      },
      {
        titleTemplate: "Like Wildcard Interna",
        descTemplate: "Utenti con 'a' come seconda lettera del nome.",
        queryTemplate: "SELECT * FROM Users WHERE name LIKE '_a%'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "IS NOT NULL seleziona solo le righe dove il campo ha un valore definito, escludendo i NULL.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE name LIKE '_a%'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Ordinamento Logico Inverso",
        descTemplate: "Utenti che NON (sono Premium AND (country = 'Italy' OR country = 'France')).",
        queryTemplate: "SELECT * FROM Users WHERE NOT (is_premium = TRUE AND (country = 'Italy' OR country = 'France'))",
        hints: ["NOT (A AND (B OR C))"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE NOT (is_premium = TRUE AND (country == 'Italy' OR country = 'France'))",
        debugHint: "Attenzione alle parentesi."
      },
      {
        titleTemplate: "Subquery EXISTS",
        descTemplate: "Utenti per cui ESISTE almeno un ordine (EXISTS).",
        queryTemplate: "SELECT * FROM Users u WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        hints: ["EXISTS (SELECT 1 ...)"],
        explanation: "Combinare AND e OR richiede attenzione alle precedenze: AND ha priorità su OR. Usa le parentesi per controllo esplicito.",
        replacements: {},
        brokenCode: "SELECT * FROM Users u WERE EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Subquery NOT EXISTS",
        descTemplate: "Utenti per cui NON ESISTE alcun ordine.",
        queryTemplate: "SELECT * FROM Users u WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        hints: ["NOT EXISTS (...)"],
        explanation: "EXISTS verifica se la subquery correlata restituisce almeno una riga. È spesso più efficiente di IN per dataset grandi.",
        replacements: {},
        brokenCode: "SELECT * FROM Users u WERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.user_id = u.id)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Ultimo giorno mese (approx)",
        descTemplate: "Ordini fatti il giorno 31 (LIKE '%-31').",
        queryTemplate: "SELECT * FROM Orders WHERE order_date LIKE '%-01'",
        hints: ["Usa LIKE per il confronto con pattern", "Il simbolo % sostituisce qualsiasi sequenza di caratteri"],
        explanation: "EXISTS verifica se la subquery correlata restituisce almeno una riga. È spesso più efficiente di IN per dataset grandi.",
        replacements: {},
        brokenCode: "SELECT FROM Orders WHERE order_date LIKE '%-01'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Filtro Avanzato Finale",
        descTemplate: "Prodotti 'Tech' con stock > 100 oppure 'Old' con stock < 5.",
        queryTemplate: "SELECT * FROM Products WHERE (category = 'Tech' AND stock < 10) OR (category = 'Electronics' AND stock < 10)",
        hints: ["(A AND B) OR (C AND D)"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE (category == 'Tech' AND stock < 10) OR (category = 'Electronics' AND stock < 10)",
        debugHint: "Parentesi separate dall'OR."
      }
    ],
  },
  [TopicId.Sorting]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Ordina Utenti per Nome",
        descTemplate: "Ordina la lista degli utenti in base al nome, in ordine alfabetico (A-Z).",
        queryTemplate: "SELECT * FROM Users ORDER BY name ASC",
        hints: ["Usa la clausola ORDER BY", "L'ordinamento predefinito è ascendente (ASC)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY name",
        debugHint: "Specifica ASC per chiarezza (anche se default)."
      },
      {
        titleTemplate: "Ordina Utenti per Nome (Decrescente)",
        descTemplate: "Ordina la lista degli utenti in ordine alfabetico inverso (Z-A).",
        queryTemplate: "SELECT * FROM Users ORDER BY name DESC",
        hints: ["Aggiungi la keyword per l'ordine decrescente dopo il nome della colonna"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users SORT BY name DESC",
        debugHint: "SORT BY non esiste, usa ORDER BY."
      },
      {
        titleTemplate: "Ordina Utenti per Email",
        descTemplate: "Ordina gli utenti in base all'indirizzo email (Crescente).",
        queryTemplate: "SELECT * FROM Users ORDER BY email ASC",
        hints: ["Ordina usando la colonna 'email'"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER email ASC",
        debugHint: "ORDER BY email."
      },
      {
        titleTemplate: "Ordina Utenti per Email (Decrescente)",
        descTemplate: "Ordina gli utenti in base all'email in ordine decrescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY email DESC",
        hints: ["Usa ORDER BY seguito da DESC"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER email DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Prodotti per Nome",
        descTemplate: "Elenca i prodotti ordinati alfabeticamente per nome.",
        queryTemplate: "SELECT * FROM Products ORDER BY name ASC",
        hints: ["Clausola ORDER BY su 'name'"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER name ASC",
        debugHint: "Sintassi base ORDER BY."
      },
      {
        titleTemplate: "Ordina Prodotti per Nome (Inverso)",
        descTemplate: "Elenca i prodotti ordinati per nome in ordine inverso (Z-A).",
        queryTemplate: "SELECT * FROM Products ORDER BY name DESC",
        hints: ["Usa DESC dopo il nome della colonna"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER name DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Products category",
        descTemplate: "Raggruppa visivamente prodotti per categoria (A-Z).",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC",
        hints: ["Ordina per category"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER category ASC",
        debugHint: "ORDER BY category."
      },
      {
        titleTemplate: "Ordina Products category DESC",
        descTemplate: "Ordina categorie Z-A.",
        queryTemplate: "SELECT * FROM Products ORDER BY category DESC",
        hints: ["Ordina per category in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER category DESC",
        debugHint: "Non scordare DESC."
      },
      {
        titleTemplate: "Ordina Ordini per ID",
        descTemplate: "Visualizza gli ordini in base al loro ID crescente (cronologico inserimento).",
        queryTemplate: "SELECT * FROM Orders ORDER BY id ASC",
        hints: ["L'ID è spesso sequenziale, quindi un ordinamento per ID è cronologico"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER id ASC",
        debugHint: "Usa colonna id."
      },
      {
        titleTemplate: "Ordina Ordini per ID (Recenti)",
        descTemplate: "Visualizza gli ordini partendo dall'ID più alto (i più recenti).",
        queryTemplate: "SELECT * FROM Orders ORDER BY id DESC",
        hints: ["Per vedere i più recenti in un sistema sequenziale, ordina con DESC"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER id DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Ordini per Utente",
        descTemplate: "Ordina gli ordini raggruppandoli per ID utente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY user_id ASC",
        hints: ["Ordina numericamente per user_id"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER user_id ASC",
        debugHint: "Controlla la colonna."
      },
      {
        titleTemplate: "Ordina Ordini per Utente (Decrescente)",
        descTemplate: "Ordina gli ordini per ID utente in ordine decrescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY user_id DESC",
        hints: ["ORDER BY con user_id e specifica la direzione"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER user_id DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina OrderItems id",
        descTemplate: "Ordina righe ordine per ID.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY id ASC",
        hints: ["Ordina per id in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina OrderItems id DESC",
        descTemplate: "Ordina righe ordine ID decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY id DESC",
        hints: ["Ordina per id in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER id DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina OrderItems order_id",
        descTemplate: "Ordina righe per ID ordine di appartenenza.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY order_id ASC",
        hints: ["Ordina per order_id in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "Vedi righe dello stesso ordine vicine.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER order_id ASC",
        debugHint: "Check column name."
      },
      {
        titleTemplate: "Ordina OrderItems order_id DESC",
        descTemplate: "Ordina righe per ID ordine decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY order_id DESC",
        hints: ["Ordina per order_id in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER order_id DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Employees name",
        descTemplate: "Elenco dipendenti alfabetico.",
        queryTemplate: "SELECT * FROM Employees ORDER BY name ASC",
        hints: ["Ordina per name in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER name ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Employees name DESC",
        descTemplate: "Elenco dipendenti Z-A.",
        queryTemplate: "SELECT * FROM Employees ORDER BY name DESC",
        hints: ["Ordina per name in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER name DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Employees department",
        descTemplate: "Raggruppa dipendenti per dipartimento (A-Z).",
        queryTemplate: "SELECT * FROM Employees ORDER BY department ASC",
        hints: ["Ordina per department in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER department ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Employees department DESC",
        descTemplate: "Ordina dipendenti per dipartimento Z-A.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department DESC",
        hints: ["Ordina per department in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER department DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Products price",
        descTemplate: "Ordina prodotti dal più economico.",
        queryTemplate: "SELECT * FROM Products ORDER BY price ASC",
        hints: ["Ordina per price in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY cost",
        debugHint: "Colonna è price."
      },
      {
        titleTemplate: "Ordina Products price DESC",
        descTemplate: "Ordina prodotti dal più costoso.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC",
        hints: ["Ordina per price in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER price DESC",
        debugHint: "Usa DESC su price."
      },
      {
        titleTemplate: "Ordina Stock Prodotti",
        descTemplate: "Ordina i prodotti in base alla quantità disponibile in magazzino (dal più scarso).",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC",
        hints: ["Ordina per la colonna 'stock'"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER stock ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Stock Prodotti (Decrescente)",
        descTemplate: "Ordina i prodotti partendo da quelli con maggiore disponibilità.",
        queryTemplate: "SELECT * FROM Products ORDER BY stock DESC",
        hints: ["Usa DESC su stock per vedere i più abbondanti"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER stock DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Utenti per Iscrizione",
        descTemplate: "Ordina gli utenti dal primo iscritto (data creazione più vecchia).",
        queryTemplate: "SELECT * FROM Users ORDER BY created_at ASC",
        hints: ["La colonna 'created_at' indica l'iscrizione", "Date più vecchie sono 'minori'"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "ORDER BY date",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Users joined DESC",
        descTemplate: "Ordina utenti per nuovi iscritti.",
        queryTemplate: "SELECT * FROM Users ORDER BY created_at DESC",
        hints: ["Ordina per created_at in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER created_at DESC",
        debugHint: "DESC su created_at."
      },
      {
        titleTemplate: "Ordina Orders total",
        descTemplate: "Ordina ordini per importo (piccoli prima).",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_total ASC",
        hints: ["Ordina per order_total in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "ORDER BY amount",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Orders total DESC",
        descTemplate: "Ordina ordini per importo (grandi prima).",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_total DESC",
        hints: ["Ordina per order_total in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER order_total DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Items qty",
        descTemplate: "Ordina righe ordine per quantità.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY quantity ASC",
        hints: ["Ordina per quantity in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER quantity ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Items qty DESC",
        descTemplate: "Ordina righe ordine per quantità decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY quantity DESC",
        hints: ["Ordina per quantity in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER quantity DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Ordina per Paese e Nome",
        descTemplate: "Ordina gli utenti alfabeticamente prima per Paese, poi per Nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name ASC",
        hints: ["Elenca le colonne separate da virgola nell'ORDER BY"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY country AND name",
        debugHint: "Usa la virgola per separare le colonne."
      },
      {
        titleTemplate: "Ordina Categoria e Prezzo",
        descTemplate: "Ordina prodotti per categoria e poi per prezzo decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC, price DESC",
        hints: ["ORDER BY category, price DESC"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER category ASC, price DESC",
        debugHint: "La virgola separa i criteri."
      },
      {
        titleTemplate: "Ordina Data e Stato",
        descTemplate: "Ordina ordini per data decrescente e poi per stato.",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date DESC, status ASC",
        hints: ["Ordina per order_date in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER order_date DESC, status ASC",
        debugHint: "DESC sulla data."
      },
      {
        titleTemplate: "Ordina Stipendio e Nome",
        descTemplate: "Ordina dipendenti per salario (salary) e poi per nome.",
        queryTemplate: "SELECT * FROM Employees ORDER BY salary ASC, name ASC",
        hints: ["ORDER BY salary, name"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER salary ASC, name ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Stock e ID",
        descTemplate: "Ordina prodotti per stock e a parità di stock per ID.",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC, id ASC",
        hints: ["ORDER BY stock, id"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER stock ASC, id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Prezzo Totale",
        descTemplate: "Ordina per valore calcolato: quantity * unit_price.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY quantity * unit_price DESC",
        hints: ["Ordina per quantity in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER BY total",
        debugHint: "Devi ripetere l'espressione o usare alias se supportato."
      },
      {
        titleTemplate: "Ordina Lunghezza Nome",
        descTemplate: "Ordina utenti per lunghezza del nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY LENGTH(name) ASC",
        hints: ["Ordina per LENGTH in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER LENGTH(name) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Anno Assunzione",
        descTemplate: "Ordina dipendenti per anno di assunzione (estratto dalla data) e poi per id.",
        queryTemplate: "SELECT * FROM Employees ORDER BY YEAR(hire_date) ASC, id ASC",
        hints: ["Usa YEAR() su hire_date", "Aggiungi un secondo criterio di ordinamento per i record con lo stesso anno"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente. Puoi aggiungere più colonne per risolvere i pareggi.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER YEAR(hire_date) ASC, id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Casuale (Random)",
        descTemplate: "Ordina casualmente (RANDOM()).",
        queryTemplate: "SELECT * FROM Products ORDER BY RANDOM()",
        hints: ["Ordina per RANDOM in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER RANDOM()",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Alias",
        descTemplate: "Seleziona prezzo * stock come 'valore' e ordina per 'valore'.",
        queryTemplate: "SELECT *, price * stock as valore FROM Products ORDER BY valore DESC",
        hints: ["Usa l'alias 'valore' in ORDER BY"],
        explanation: "ORDER BY riordina le righe nel risultato finale secondo i valori della colonna specificata.",
        replacements: {},
        brokenCode: "SELECT *, price * stock IS valore FROM Products ORDER BY valore DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Misto ASC/DESC",
        descTemplate: "Ordina per Department DESC e poi Name ASC.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department DESC, name ASC",
        hints: ["Ordina per department in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER department DESC, name ASC",
        debugHint: "DESC primo, ASC secondo."
      },
      {
        titleTemplate: "Ordina 3 Colonne",
        descTemplate: "Ordina per Paese, poi per ID, e infine per Nome.",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, id ASC, name ASC",
        hints: ["Puoi specificare tre colonne in ordine"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER country ASC, id ASC, name ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Nulls First (Simulato)",
        descTemplate: "Ordina Email in modo che i NULL vengano prima (usando CASE o sintassi standard se supportata: solitamente NULLS FIRST/LAST è standard, ma in SQLite NULLs vengono prima di default in ASC). Forza ordinamento: CASE WHEN email IS NULL THEN 0 ELSE 1 END.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN email IS NULL THEN 0 ELSE 1 END, email ASC",
        hints: ["CASE WHEN email IS NULL ..."],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER CASE WHEN email IS NULL THEN 0 ELSE 1 END, email ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Nulls Last (Simulato)",
        descTemplate: "Ordina Email in modo che i NULL vengano dopo.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN email IS NULL THEN 1 ELSE 0 END, email ASC",
        hints: ["CASE WHEN ... IS NULL THEN 1"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER CASE WHEN email IS NULL THEN 1 ELSE 0 END, email ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Giorno della Settimana",
        descTemplate: "Ordina gli ordini in base al giorno della settimana (Domenica=0, Lunedì=1...).",
        queryTemplate: "SELECT * FROM Orders ORDER BY DAYOFWEEK(order_date) ASC",
        hints: ["Usa DAYOFWEEK sulla data"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER DAYOFWEEK(order_date) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Mese",
        descTemplate: "Ordina gli ordini in base al mese (1-12).",
        queryTemplate: "SELECT * FROM Orders ORDER BY MONTH(order_date) ASC",
        hints: ["Ordina per MONTH in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER MONTH(order_date) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina ID Inverso",
        descTemplate: "Ordina gli utenti per ID decrescente (spesso equivale all'ordine di iscrizione inverso).",
        queryTemplate: "SELECT * FROM Users ORDER BY id DESC",
        hints: ["Ordina per id in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER id DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Case Insensitive",
        descTemplate: "Ordina per nome ignorando maiuscole (LOWER(name)).",
        queryTemplate: "SELECT * FROM Users ORDER BY LOWER(name) ASC",
        hints: ["Ordina per LOWER in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER LOWER(name) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Boolean",
        descTemplate: "Ordina: prima i Premium (1), poi i normali (0).",
        queryTemplate: "SELECT * FROM Users ORDER BY is_premium DESC, name ASC",
        hints: ["is_premium DESC mette 1 prima di 0"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER is_premium DESC, name ASC",
        debugHint: "DESC su booleano."
      },
      {
        titleTemplate: "Ordina Stock Critico",
        descTemplate: "Ordina i prodotti mettendo per primi quelli con scorte critiche (< 5), poi tutti gli altri.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock < 5 THEN 0 ELSE 1 END, stock ASC",
        hints: ["Usa CASE WHEN nell'ORDER BY per creare un gruppo prioritario (0 per critici, 1 per altri)", "Poi ordina normalmente per stock"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER CASE WHEN stock < 5 THEN 0 ELSE 1 END, stock ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Prezzo Arrotondato",
        descTemplate: "Ordina i prodotti in base al prezzo arrotondato all'intero più vicino.",
        queryTemplate: "SELECT * FROM Products ORDER BY ROUND(price) ASC",
        hints: ["Usa la funzione ROUND() nella clausola ORDER BY"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER ROUND(price) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Dominio Email",
        descTemplate: "Ordina gli utenti basandoti solo sul dominio dell'email (la parte dopo il simbolo '@').",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(email, INSTR(email, '@') + 1) ASC",
        hints: ["Usa SUBSTR per estrarre il dominio saltando i caratteri fino a INSTR('@')"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT FROM Users ORDER BY SUBSTR(email, INSTR(email, '@') + 1) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Recenti e Costosi",
        descTemplate: "Visualizza gli ordini partendo dai più recenti e, a parità di data, da quelli con importo più alto.",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date DESC, order_total DESC",
        hints: ["Specifica DESC per entrambe le colonne"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER order_date DESC, order_total DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Categoria Inversa e Prezzo",
        descTemplate: "Ordina i prodotti per Categoria (Z-A) e poi per Prezzo (Crescente).",
        queryTemplate: "SELECT * FROM Products ORDER BY category DESC, price ASC",
        hints: ["Category DESC, Price (default ASC)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER category DESC, price ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per ID Prodotto",
        descTemplate: "Ordina le righe degli ordini (OrderItems) in base all'ID del prodotto.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY product_id ASC",
        hints: ["Usa la colonna product_id"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems ORDER product_id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Parità ID",
        descTemplate: "Ordina mettendo prima tutti gli ID pari, poi quelli dispari.",
        queryTemplate: "SELECT * FROM Users ORDER BY id % 2 ASC, id ASC",
        hints: ["Usa il modulo (%) per determinare pari (0) e dispari (1)"],
        explanation: "Even numbers (0) then Odd (1).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER id % 2 ASC, id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Lunghezza Email (Decrescente)",
        descTemplate: "Visualizza gli utenti ordinati per lunghezza dell'email, dalle più lunghe alle più corte.",
        queryTemplate: "SELECT * FROM Users ORDER BY LENGTH(email) DESC",
        hints: ["Usa LENGTH() e ordina in modo decrescente"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER LENGTH(email) DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Multiplo Dipendenti",
        descTemplate: "Ordina per Dipartimento, poi per Salario, e infine per Nome.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department ASC, salary ASC, name ASC",
        hints: ["Elenca le tre colonne in ordine"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER department ASC, salary ASC, name ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Stock Aumentato",
        descTemplate: "Ordina i prodotti basandoti sul loro stock aumentato di 10 unità, in ordine decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY (stock + 10) DESC",
        hints: ["Puoi usare espressioni matematiche nella clausola ORDER BY"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT FROM Products ORDER BY (stock + 10) DESC",
        debugHint: "Parentesi opzionali ma chiare."
      },
      {
        titleTemplate: "Ordina Solo Prezzo",
        descTemplate: "Ordina solamente per prezzo (senza secondaria), verifica stabilità (potrebbe variare).",
        queryTemplate: "SELECT * FROM Products ORDER BY price ASC",
        hints: ["Ordina per price in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER price ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Ordina per Disponibilità",
        descTemplate: "Ordina mettendo prima i prodotti disponibili (stock > 0) e poi quelli esauriti. A parità di gruppo, ordina per nome.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END, name ASC",
        hints: ["Usa CASE WHEN stock > 0 THEN 0 ELSE 1 END per creare due gruppi logici"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER BY stock",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Lunghezza Nome Decrescente",
        descTemplate: "Utenti con nomi più lunghi in cima.",
        queryTemplate: "SELECT * FROM Users ORDER BY LENGTH(name) DESC",
        hints: ["Ordina per LENGTH in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER LENGTH(name) DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Anno e Mese",
        descTemplate: "Ordina gli ordini per anno decrescente, e successivamente per mese crescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY YEAR(order_date) DESC, MONTH(order_date) ASC",
        hints: ["Usa YEAR() e MONTH() sulle date"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER YEAR(order_date) DESC, MONTH(order_date) ASC",
        debugHint: "Usa YEAR e MONTH."
      },
      {
        titleTemplate: "Eccezione di Ordinamento",
        descTemplate: "Elenca tutti gli utenti ordinati per ID, ma sposta l'utente con ID 1 in fondo alla lista.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN id = 1 THEN 1 ELSE 0 END, id ASC",
        hints: ["Usa CASE nell'ORDER BY per assegnare un valore 'pesante' (es. 1) all'ID 1 e 'leggero' (es. 0) agli altri"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER CASE WHEN id = 1 THEN 1 ELSE 0 END, id ASC",
        debugHint: "CASE WHEN id = 1."
      },
      {
        titleTemplate: "Ordina per Fasce di Prezzo",
        descTemplate: "Ordina i prodotti in tre fasce: prima quelli economici (< 50), poi i medi (50-100), infine i costosi (> 100).",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN price < 50 THEN 1 WHEN price <= 100 THEN 2 ELSE 3 END, price ASC",
        hints: ["Crea 3 livelli di priorità usando CASE WHEN multipli"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER CASE WHEN price < 50 THEN 1 WHEN price <= 100 THEN 2 ELSE 3 END, price ASC",
        debugHint: "CASE WHEN ... THEN ... WHEN ..."
      },
      {
        titleTemplate: "Ordina per Dominio (Senza www)",
        descTemplate: "Ordina utenti per email, ignorando 'www.' se presente (su email è raro ma utile come esercizio stringa). Usiamo REPLACE.",
        queryTemplate: "SELECT * FROM Users ORDER BY REPLACE(email, 'www.', '') ASC",
        hints: ["Ordina per REPLACE in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER REPLACE(email, 'www.', '') ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina per Iniziale del Nome",
        descTemplate: "Ordina gli utenti basandoti sulla prima lettera (iniziale) del loro nome e poi per id.",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(name, 1, 1) ASC, id ASC",
        hints: ["Usa la funzione SUBSTR per estrarre il primo carattere", "Aggiungi id come secondo criterio per risultati stabili"],
        explanation: "ORDER BY con ASC ordina in ordine crescente. Aggiungere un secondo criterio risolve l'ambiguità tra righe con la stessa iniziale.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER SUBSTR(name, 1, 1) ASC, id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordinamento Casuale",
        descTemplate: "Ordina la lista dei prodotti in modo casuale ad ogni esecuzione.",
        queryTemplate: "SELECT * FROM Products ORDER BY RANDOM()",
        hints: ["Esiste una funzione per generare numeri casuali (RAND o RANDOM)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER RANDOM()",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Coalesce",
        descTemplate: "Ordina per telefono, se null usa email.",
        queryTemplate: "SELECT * FROM Users ORDER BY COALESCE(phone_number, email) ASC",
        hints: ["Ordina per COALESCE in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY riordina le righe nel risultato finale secondo i valori della colonna specificata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER COALESCE(phone_number, email) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Ultima Lettera",
        descTemplate: "Ordina nomi basandoti sull'ultima lettera.",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(name, -1) ASC",
        hints: ["Ordina per SUBSTR in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT FROM Users ORDER BY SUBSTR(name, -1) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Escludendo Prefisso",
        descTemplate: "Ordina prodotti ignorando le prime 3 lettere del nome.",
        queryTemplate: "SELECT * FROM Products ORDER BY SUBSTR(name, 4) ASC",
        hints: ["Ordina per SUBSTR in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER SUBSTR(name, 4) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Priorità Reparto",
        descTemplate: "HR prima, poi Sales, poi IT, poi altri.",
        queryTemplate: "SELECT * FROM Employees ORDER BY CASE department WHEN 'HR' THEN 1 WHEN 'Sales' THEN 2 WHEN 'IT' THEN 3 ELSE 4 END",
        hints: ["CASE department WHEN ..."],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER CASE department WHEN 'HR' THEN 1 WHEN 'Sales' THEN 2 WHEN 'IT' THEN 3 ELSE 4 END",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Valore Assoluto (Simulato)",
        descTemplate: "Ordina per variazione di stock da 10 (ABS(stock - 10)).",
        queryTemplate: "SELECT * FROM Products ORDER BY ABS(stock - 10) ASC",
        hints: ["Ordina per ABS in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY riordina le righe nel risultato finale secondo i valori della colonna specificata.",
        replacements: {},
        brokenCode: "SELECT FROM Products ORDER BY ABS(stock - 10) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Concatenazione",
        descTemplate: "Ordina per 'Cognome Nome' (assumendo name sia 'Nome Cognome', facciamo sort su name intero per semplicità ma unito a ID).",
        queryTemplate: "SELECT * FROM Users ORDER BY name || id ASC",
        hints: ["|| per concatenare"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER name || id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina NULL in mezzo (Simulato)",
        descTemplate: "Metti i NULL di email dopo la 'M'.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN email IS NULL THEN 'M_NULL' ELSE email END ASC",
        hints: ["CASE che trasforma NULL in stringa"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER CASE WHEN email IS NULL THEN 'M_NULL' ELSE email END ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Multiplo Inverso",
        descTemplate: "Ordina Stock ASC, ma se stock uguale, Price DESC.",
        queryTemplate: "SELECT * FROM Products ORDER BY stock ASC, price DESC",
        hints: ["Ordina per stock in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER stock ASC, price DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Solo Pari",
        descTemplate: "Ordina mettendo ID pari prima degli dispari, poi per ID.",
        queryTemplate: "SELECT * FROM Users ORDER BY id % 2 ASC, id ASC",
        hints: ["Ordina per id in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER id % 2 ASC, id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Prezzo Scontato vs Pieno",
        descTemplate: "Ordina per il minore tra prezzo e un prezzo fisso 50 (MIN simulato con CASE).",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN price < 50 THEN price ELSE 50 END ASC",
        hints: ["CASE per 'min' o 'clamping'"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER CASE WHEN price < 50 THEN price ELSE 50 END ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Data + 7gg",
        descTemplate: "Ordina per data ordine posticipata di 7 giorni (DATE(order_date, '+7 days')).",
        queryTemplate: "SELECT * FROM Orders ORDER BY DATE(order_date, '+7 days') DESC",
        hints: ["DATE(..., '+7 days')"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT FROM Orders ORDER BY DATE(order_date, '+7 days') DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Booleano Complesso",
        descTemplate: "Ordina prima i Premium italiani, poi gli altri.",
        queryTemplate: "SELECT * FROM Users ORDER BY CASE WHEN is_premium = TRUE AND country = 'Italy' THEN 0 ELSE 1 END ASC",
        hints: ["CASE WHEN condition THEN 0"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER CASE WHEN is_premium = TRUE AND country = 'Italy' THEN 0 ELSE 1 END ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Lunghezza Desc",
        descTemplate: "Prodotti con descrizione (se esistesse) o nome più corto prima.",
        queryTemplate: "SELECT * FROM Products ORDER BY LENGTH(name) ASC",
        hints: ["Ordina per LENGTH in ordine crescente", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "COUNT con CASE WHEN permette di contare selettivamente le righe che soddisfano determinate condizioni, utile per pivot e report.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER LENGTH(name) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Round Price",
        descTemplate: "Ordina per prezzo arrotondato, poi stock.",
        queryTemplate: "SELECT * FROM Products ORDER BY ROUND(price), stock DESC",
        hints: ["Ordina per ROUND in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER ROUND(price), stock DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Alternato",
        descTemplate: "Ordina alfabeticamente ma 'Z' prima di 'A' (DESC).",
        queryTemplate: "SELECT * FROM Users ORDER BY name DESC",
        hints: ["Ordina per name in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER name DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Due Date",
        descTemplate: "Ordina per created_at (users) - non ha senso in join qui. Ordina Employees per hire_date.",
        queryTemplate: "SELECT * FROM Employees ORDER BY hire_date DESC",
        hints: ["Ordina per hire_date in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER hire_date DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Substr e Length",
        descTemplate: "Ordina per prima lettera e poi lunghezza.",
        queryTemplate: "SELECT * FROM Users ORDER BY SUBSTR(name, 1, 1) ASC, LENGTH(name) DESC",
        hints: ["Prima lettera, poi lunghezza"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER SUBSTR(name, 1, 1) ASC, LENGTH(name) DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Cast",
        descTemplate: "Ordina zipcode come intero (supponendo sia stringa). CAST(zip_code AS INTEGER).",
        queryTemplate: "SELECT * FROM Users ORDER BY CAST(zip_code AS INTEGER) ASC",
        hints: ["CAST(... AS INTEGER)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER BY CAST(zip_code IS INTEGER) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Nulls Last Trick",
        descTemplate: "Ordina ID, ma i NULL (impossibile su PK) facciamo su manager_id NULLS LAST.",
        queryTemplate: "SELECT * FROM Employees ORDER BY CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END, manager_id ASC",
        hints: ["CASE per NULLS LAST"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees ORDER CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END, manager_id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Bitwise (Simulato)",
        descTemplate: "Ordina id & 1 (dispari vs pari) DESC.",
        queryTemplate: "SELECT * FROM Users ORDER BY (id & 1) DESC, id ASC",
        hints: ["Operatore bitwise &"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT * FROM Users ORDER (id & 1) DESC, id ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Parametrico",
        descTemplate: "Demo tecnica: ordinamento fisso ma complesso.",
        queryTemplate: "SELECT * FROM Products ORDER BY price * stock / 100 DESC",
        hints: ["Ordina per price in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT FROM Products ORDER BY price * stock / 100 DESC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Ordina Finale",
        descTemplate: "Ordina per (stock - id) ASC.",
        queryTemplate: "SELECT * FROM Products ORDER BY (stock - id) ASC",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "ORDER BY con DESC ordina i risultati in ordine decrescente (dal più grande al più piccolo, dalla Z alla A).",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER (stock - id) ASC",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      }
    ],
  },
  [TopicId.Aggregation]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Conta Utenti Totali",
        descTemplate: "Calcola il numero totale di utenti registrati.",
        queryTemplate: "SELECT COUNT(*) FROM Users",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
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
        explanation: "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.",
        replacements: {},
        brokenCode: "SELCET COUNT(*) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Conta Ordini",
        descTemplate: "Calcola il numero totale di ordini effettuati.",
        queryTemplate: "SELECT COUNT(*) FROM Orders",
        hints: ["COUNT(*) su Orders"],
        explanation: "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.",
        replacements: {},
        brokenCode: "SELCET COUNT(*) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Conta Dipendenti",
        descTemplate: "Quanti dipendenti lavorano in azienda?",
        queryTemplate: "SELECT COUNT(*) FROM Employees",
        hints: ["COUNT(*) su Employees"],
        explanation: "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.",
        replacements: {},
        brokenCode: "SELCET COUNT(*) FROM Employees",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Somma Prezzi Prodotti",
        descTemplate: "Calcola la somma dei prezzi di tutti i prodotti (valore inventario teorico unitario).",
        queryTemplate: "SELECT SUM(price) FROM Products",
        hints: ["Usa la funzione SUM()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.",
        replacements: {},
        brokenCode: "SELECT TOTAL(price) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Totale Valore Ordini",
        descTemplate: "Qual è il fatturato totale (somma order_total)?",
        queryTemplate: "SELECT SUM(order_total) FROM Orders",
        hints: ["Usa la funzione SUM()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "SUM() calcola la somma totale dei valori nella colonna specificata, ignorando i valori NULL.",
        replacements: {},
        brokenCode: "SELCET SUM(order_total) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Stock In Magazzino",
        descTemplate: "Calcola la quantità totale di articoli in magazzino (somma stock).",
        queryTemplate: "SELECT SUM(stock) FROM Products",
        hints: ["Usa la funzione SUM()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "SUM() calcola la somma totale dei valori nella colonna specificata, ignorando i valori NULL.",
        replacements: {},
        brokenCode: "SELCET SUM(stock) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Media Prezzo Prodotti",
        descTemplate: "Qual è il prezzo medio dei prodotti?",
        queryTemplate: "SELECT AVG(price) FROM Products",
        hints: ["Usa la funzione AVG()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "AVG calcola la media aritmetica dei valori nella colonna specificata, ignorando i NULL.",
        replacements: {},
        brokenCode: "SELECT AVERAGE(price) FROM Products",
        debugHint: "Usa AVG, non AVERAGE."
      },
      {
        titleTemplate: "Media Ordine",
        descTemplate: "Qual è l'importo medio di un ordine?",
        queryTemplate: "SELECT AVG(order_total) FROM Orders",
        hints: ["Usa la funzione AVG()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "AVG() calcola la media aritmetica dei valori, ignorando i NULL. Utile per metriche come prezzo medio o stipendio medio.",
        replacements: {},
        brokenCode: "SELCET AVG(order_total) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Prezzo Minimo",
        descTemplate: "Trova il prezzo più basso nel catalogo.",
        queryTemplate: "SELECT MIN(price) FROM Products",
        hints: ["Usa la funzione MIN()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "AVG() calcola la media aritmetica dei valori, ignorando i NULL. Utile per metriche come prezzo medio o stipendio medio.",
        replacements: {},
        brokenCode: "SELECT LOWEST(price)...",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Prezzo Massimo",
        descTemplate: "Trova il prezzo più alto nel catalogo.",
        queryTemplate: "SELECT MAX(price) FROM Products",
        hints: ["Usa la funzione MAX()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "MIN() restituisce il valore più piccolo nella colonna, utile per trovare il prezzo minimo, la data più antica, ecc.",
        replacements: {},
        brokenCode: "SELECT HIGHEST(price)...",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Primo Utente",
        descTemplate: "Trova la data di iscrizione più vecchia (primo utente).",
        queryTemplate: "SELECT MIN(created_at) FROM Users",
        hints: ["Usa la funzione MIN()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "MAX() restituisce il valore più grande nella colonna, utile per record massimi e analisi di picco.",
        replacements: {},
        brokenCode: "SELCET MIN(created_at) FROM Users",
        debugHint: "MIN su date."
      },
      {
        titleTemplate: "Ultimo Ordine",
        descTemplate: "Trova la data dell'ordine più recente.",
        queryTemplate: "SELECT MAX(order_date) FROM Orders",
        hints: ["Usa la funzione MAX()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "MIN() restituisce il valore più piccolo nella colonna, utile per trovare il prezzo minimo, la data più antica, ecc.",
        replacements: {},
        brokenCode: "SELCET MAX(order_date) FROM Orders",
        debugHint: "MAX su date."
      },
      {
        titleTemplate: "Conta Paesi Unici",
        descTemplate: "Conta quanti paesi diversi ci sono tra gli utenti.",
        queryTemplate: "SELECT COUNT(DISTINCT country) FROM Users",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "MAX() restituisce il valore più grande nella colonna, utile per record massimi e analisi di picco.",
        replacements: {},
        brokenCode: "SELECT COUNT(country) FROM Users",
        debugHint: "Serve DISTINCT dentro COUNT."
      },
      {
        titleTemplate: "Conta Categorie Uniche",
        descTemplate: "Quante categorie di prodotti diverse esistono?",
        queryTemplate: "SELECT COUNT(DISTINCT category) FROM Products",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(colonna) conta le righe in cui la colonna specificata non è NULL.",
        replacements: {},
        brokenCode: "SELECT COUNT(DISTINCT category) DISTINCT FROM Products",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Conta Ruoli Unici",
        descTemplate: "Quanti ruoli aziendali diversi ci sono?",
        queryTemplate: "SELECT COUNT(DISTINCT role) FROM Employees",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(colonna) conta le righe in cui la colonna specificata non è NULL.",
        replacements: {},
        brokenCode: "SELECT COUNT(DISTINCT role) DISTINCT FROM Employees",
        debugHint: "DISTINCT va subito dopo SELECT, prima del nome della colonna."
      },
      {
        titleTemplate: "Conta Email (Non Null)",
        descTemplate: "Conta quante email sono presenti (esclude NULL automaticamente).",
        queryTemplate: "SELECT COUNT(email) FROM Users",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(colonna) conta le righe in cui la colonna specificata non è NULL.",
        replacements: {},
        brokenCode: "SELCET COUNT(email) FROM Users",
        debugHint: "Usa il nome colonna."
      },
      {
        titleTemplate: "Max Stock",
        descTemplate: "Qual è la quantità massima disponibile per un singolo prodotto?",
        queryTemplate: "SELECT MAX(stock) FROM Products",
        hints: ["Usa la funzione MAX()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(colonna) conta le righe in cui la colonna specificata non è NULL.",
        replacements: {},
        brokenCode: "SELCET MAX(stock) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Min Stock",
        descTemplate: "Qual è la quantità minima disponibile (potrebbe essere 0)?",
        queryTemplate: "SELECT MIN(stock) FROM Products",
        hints: ["Usa la funzione MIN()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "MAX() restituisce il valore più grande nella colonna, utile per record massimi e analisi di picco.",
        replacements: {},
        brokenCode: "SELCET MIN(stock) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Range Prezzi",
        descTemplate: "Calcola la differenza tra prezzo massimo e minimo.",
        queryTemplate: "SELECT MAX(price) - MIN(price) FROM Products",
        hints: ["MAX(...) - MIN(...)"],
        explanation: "MIN() restituisce il valore più piccolo nella colonna, utile per trovare il prezzo minimo, la data più antica, ecc.",
        replacements: {},
        brokenCode: "SELCET MAX(price) - MIN(price) FROM Products",
        debugHint: "Sottrazione tra funzioni."
      },
      {
        titleTemplate: "Valore Medio Magazzino",
        descTemplate: "Calcola la media dello stock.",
        queryTemplate: "SELECT AVG(stock) FROM Products",
        hints: ["Usa la funzione AVG()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "MIN() restituisce il valore più piccolo nella colonna, utile per trovare il prezzo minimo, la data più antica, ecc.",
        replacements: {},
        brokenCode: "SELCET AVG(stock) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Totale Utenti Premium",
        descTemplate: "Conta quanti utenti sono Premium (is_premium = TRUE). Puoi usare WHERE.",
        queryTemplate: "SELECT COUNT(*) FROM Users WHERE is_premium = TRUE",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "AVG() calcola la media aritmetica dei valori, ignorando i NULL. Utile per metriche come prezzo medio o stipendio medio.",
        replacements: {},
        brokenCode: "SELECT COUNT(*) FROM Users WERE is_premium = TRUE",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Somma Vendite 2023",
        descTemplate: "Somma order_total per ordini del 2023.",
        queryTemplate: "SELECT SUM(order_total) FROM Orders WHERE YEAR(order_date) = '2023'",
        hints: ["WHERE con anno 2023"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT SUM(order_total) FROM Orders WHERE YEAR(order_date) == '2023'",
        debugHint: "Filtra per anno."
      },
      {
        titleTemplate: "Media Prezzo Elettronica",
        descTemplate: "Prezzo medio prodotti categoria 'Electronics'.",
        queryTemplate: "SELECT AVG(price) FROM Products WHERE category = 'Electronics'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT AVG(price) FROM Products WHERE category == 'Electronics'",
        debugHint: "AVG con WHERE."
      },
      {
        titleTemplate: "Conta Ordini Pendenti",
        descTemplate: "Quanti ordini sono in stato 'Pending'?",
        queryTemplate: "SELECT COUNT(*) FROM Orders WHERE status = 'Pending'",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT COUNT(*) FROM Orders WHERE status == 'Pending'",
        debugHint: "COUNT con WHERE."
      },
      {
        titleTemplate: "Max Prezzo Accessori",
        descTemplate: "Prezzo più alto tra gli 'Accessories'.",
        queryTemplate: "SELECT MAX(price) FROM Products WHERE category = 'Accessories'",
        hints: ["Filtra per category"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT MAX(price) FROM Products WHERE category == 'Accessories'",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Totale Pezzi Venduti",
        descTemplate: "Somma quantità (quantity) in OrderItems.",
        queryTemplate: "SELECT SUM(quantity) FROM OrderItems",
        hints: ["Usa la funzione SUM()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELCET SUM(quantity) FROM OrderItems",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Conta Righe Ordine",
        descTemplate: "Quante righe ci sono in totale in OrderItems?",
        queryTemplate: "SELECT COUNT(*) FROM OrderItems",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "SUM() calcola la somma totale dei valori nella colonna specificata, ignorando i valori NULL.",
        replacements: {},
        brokenCode: "SELCET COUNT(*) FROM OrderItems",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Conta Manager",
        descTemplate: "Conta quanti dipendenti hanno un manager (manager_id non NULL).",
        queryTemplate: "SELECT COUNT(manager_id) FROM Employees",
        hints: ["Usa la funzione COUNT()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.",
        replacements: {},
        brokenCode: "SELCET COUNT(manager_id) FROM Employees",
        debugHint: "Usa nome colonna."
      },
      {
        titleTemplate: "Totale Stipendi (Simulato)",
        descTemplate: "Supponendo una colonna salary (non c'è, usiamo una somma di e.id * 1000 come placeholder didattico). Somma (id * 1000).",
        queryTemplate: "SELECT SUM(id * 1000) FROM Employees",
        hints: ["Usa la funzione SUM()", "Le funzioni aggregate operano sull'intero set se non c'è GROUP BY"],
        explanation: "COUNT(colonna) conta le righe in cui la colonna specificata non è NULL.",
        replacements: {},
        brokenCode: "SELECT SUM(id 1000) FROM Employees",
        debugHint: "SUM con calcolo."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Utenti per Paese",
        descTemplate: "Conta quanti utenti ci sono per ogni paese.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country",
        hints: ["Raggruppa per la colonna country", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "SUM() calcola la somma totale dei valori nella colonna specificata, ignorando i valori NULL.",
        replacements: {},
        brokenCode: "SELECT country, COUNT(*) FROM Users",
        debugHint: "Manca GROUP BY."
      },
      {
        titleTemplate: "Prodotti per Categoria",
        descTemplate: "Conta il numero di prodotti in ogni categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT category COUNT(*) FROM Products GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Prezzo Medio Categoria",
        descTemplate: "Calcola il prezzo medio dei prodotti per ogni categoria.",
        queryTemplate: "SELECT category, AVG(price) FROM Products GROUP BY category",
        hints: ["AVG(price) ... GROUP BY category"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT category AVG(price) FROM Products GROUP BY category",
        debugHint: "AVG e GROUP BY."
      },
      {
        titleTemplate: "Stock Totale Categoria",
        descTemplate: "Calcola la quantità totale di stock per ogni categoria.",
        queryTemplate: "SELECT category, SUM(stock) FROM Products GROUP BY category",
        hints: ["SUM(stock) ... GROUP BY category"],
        explanation: "GROUP BY con AVG calcola la media per ogni raggruppamento, utile per confrontare le performance tra categorie o periodi.",
        replacements: {},
        brokenCode: "SELECT category SUM(stock) FROM Products GROUP BY category",
        debugHint: "SUM e GROUP BY."
      },
      {
        titleTemplate: "Ordini per Stato",
        descTemplate: "Conta quanti ordini ci sono per ogni stato (status).",
        queryTemplate: "SELECT status, COUNT(*) FROM Orders GROUP BY status",
        hints: ["Raggruppa per la colonna status", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT status COUNT(*) FROM Orders GROUP BY status",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Vendite per Stato Ordine",
        descTemplate: "Somma il totale (order_total) per ogni stato ordine.",
        queryTemplate: "SELECT status, SUM(order_total) FROM Orders GROUP BY status",
        hints: ["SUM(order_total) ... GROUP BY status"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT status SUM(order_total) FROM Orders GROUP BY status",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Dipendenti per Dipartimento",
        descTemplate: "Conta quanti dipendenti ci sono in ogni dipartimento.",
        queryTemplate: "SELECT department, COUNT(*) FROM Employees GROUP BY department",
        hints: ["Raggruppa per la colonna department", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT department COUNT(*) FROM Employees GROUP BY department",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ordini per Utente",
        descTemplate: "Conta quanti ordini ha effettuato ciascun utente (user_id).",
        queryTemplate: "SELECT user_id, COUNT(*) FROM Orders GROUP BY user_id",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT user_id COUNT(*) FROM Orders GROUP BY user_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Spesa Totale Utente",
        descTemplate: "Calcola quanto ha speso in totale ogni utente.",
        queryTemplate: "SELECT user_id, SUM(order_total) FROM Orders GROUP BY user_id",
        hints: ["SUM(order_total) ... GROUP BY user_id"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT user_id SUM(order_total) FROM Orders GROUP BY user_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ordini per Mese (Strftime)",
        descTemplate: "Conta gli ordini raggruppati per mese (strftime '%m').",
        queryTemplate: "SELECT MONTH(order_date) as Mese, COUNT(*) FROM Orders GROUP BY Mese",
        hints: ["GROUP BY STRFTIME(...)"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT MONTH(order_date) IS Mese, COUNT(*) FROM Orders GROUP BY Mese",
        debugHint: "Usa l'espressione in GROUP BY."
      },
      {
        titleTemplate: "Ordini per Anno",
        descTemplate: "Conta gli ordini raggruppati per anno.",
        queryTemplate: "SELECT YEAR(order_date) as Anno, COUNT(*) FROM Orders GROUP BY Anno",
        hints: ["Raggruppa per la colonna Anno", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT YEAR(order_date) IS Anno, COUNT(*) FROM Orders GROUP BY Anno",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Utenti per Dominio Email",
        descTemplate: "Conta utenti per dominio email (usa SUBSTR e INSTR, o string logic).",
        queryTemplate: "SELECT SUBSTR(email, INSTR(email, '@') + 1) as Domain, COUNT(*) FROM Users GROUP BY Domain",
        hints: ["Estrai dominio e raggruppa"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(email, INSTR(email, '@') + 1) IS Domain, COUNT(*) FROM Users GROUP BY Domain",
        debugHint: "Complex GROUP BY."
      },
      {
        titleTemplate: "Categorie Popolose (HAVING)",
        descTemplate: "Mostra le categorie che hanno più di 10 prodotti.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category HAVING COUNT(*) > 10",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT category, COUNT(*) FROM Products GROUP BY category WHERE COUNT(*) > 10",
        debugHint: "Usa HAVING, non WHERE per aggregati."
      },
      {
        titleTemplate: "Paesi con Pochi Iscritti",
        descTemplate: "Trova paesi con meno di 5 utenti.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) < 5",
        hints: ["Raggruppa per la colonna country", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT country COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) < 5",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ordini Grandi (HAVING Sum)",
        descTemplate: "Trova utenti che hanno speso complessivamente più di 1000.",
        queryTemplate: "SELECT user_id, SUM(order_total) FROM Orders GROUP BY user_id HAVING SUM(order_total) > 50",
        hints: ["HAVING SUM(...) > 1000"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT user_id SUM(order_total) FROM Orders GROUP BY user_id HAVING SUM(order_total) > 50",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Articoli per Ordine",
        descTemplate: "Conta numero righe per ogni ordine.",
        queryTemplate: "SELECT order_id, COUNT(*) FROM OrderItems GROUP BY order_id",
        hints: ["Raggruppa per la colonna order_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT order_id COUNT(*) FROM OrderItems GROUP BY order_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Quantità Totale per Ordine",
        descTemplate: "Somma 'quantity' per ogni order_id in OrderItems.",
        queryTemplate: "SELECT order_id, SUM(quantity) FROM OrderItems GROUP BY order_id",
        hints: ["Raggruppa per la colonna order_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT order_id SUM(quantity) FROM OrderItems GROUP BY order_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Max Prezzo per Categoria",
        descTemplate: "Trova il prodotto più costoso per ogni categoria.",
        queryTemplate: "SELECT category, MAX(price) FROM Products GROUP BY category",
        hints: ["MAX(price) ... GROUP BY category"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT category MAX(price) FROM Products GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Min Prezzo per Categoria",
        descTemplate: "Trova il prodotto più economico per ogni categoria.",
        queryTemplate: "SELECT category, MIN(price) FROM Products GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con MIN/MAX trova il valore estremo in ogni gruppo, utile per analisi di range e identificazione di outlier.",
        replacements: {},
        brokenCode: "SELECT category MIN(price) FROM Products GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ordini Multi-Item (HAVING)",
        descTemplate: "Trova ID ordini che hanno più di 3 righe (items).",
        queryTemplate: "SELECT order_id, COUNT(*) FROM OrderItems GROUP BY order_id HAVING COUNT(*) > 3",
        hints: ["Raggruppa per la colonna order_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con MIN/MAX trova il valore estremo in ogni gruppo, utile per analisi di range e identificazione di outlier.",
        replacements: {},
        brokenCode: "SELECT order_id COUNT(*) FROM OrderItems GROUP BY order_id HAVING COUNT(*) > 3",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Dipartimenti Piccoli",
        descTemplate: "Dipartimenti con massimo 2 dipendenti.",
        queryTemplate: "SELECT department, COUNT(*) FROM Employees GROUP BY department HAVING COUNT(*) <= 2",
        hints: ["Raggruppa per la colonna department", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT department COUNT(*) FROM Employees GROUP BY department HAVING COUNT(*) <= 2",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Utenti Premium per Paese",
        descTemplate: "Conta solo utenti premium raggruppati per paese.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users WHERE is_premium = TRUE GROUP BY country",
        hints: ["WHERE is_premium = TRUE prima di GROUP BY"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT country, COUNT(*) FROM Users GROUP BY country WHERE is_premium = TRUE",
        debugHint: "WHERE va prima di GROUP BY."
      },
      {
        titleTemplate: "Max Spesa Singola per Utente",
        descTemplate: "Trova l'importo dell'ordine singolo più alto per ogni utente.",
        queryTemplate: "SELECT user_id, MAX(order_total) FROM Orders GROUP BY user_id",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT user_id MAX(order_total) FROM Orders GROUP BY user_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ordini Recenti per Utente",
        descTemplate: "Trova la data dell'ultimo ordine per ogni utente.",
        queryTemplate: "SELECT user_id, MAX(order_date) FROM Orders GROUP BY user_id",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con MIN/MAX trova il valore estremo in ogni gruppo, utile per analisi di range e identificazione di outlier.",
        replacements: {},
        brokenCode: "SELECT user_id MAX(order_date) FROM Orders GROUP BY user_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Prodotti Scontati per Categoria",
        descTemplate: "Conta prodotti con prezzo < 50 per categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products WHERE price < 50 GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con MIN/MAX trova il valore estremo in ogni gruppo, utile per analisi di range e identificazione di outlier.",
        replacements: {},
        brokenCode: "SELECT category COUNT(*) FROM Products WHERE price < 50 GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Stati con Molti Ordini",
        descTemplate: "Stati ordine (status) con più di 100 ordini totali.",
        queryTemplate: "SELECT status, COUNT(*) FROM Orders GROUP BY status HAVING COUNT(*) > 5",
        hints: ["Raggruppa per la colonna status", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT status COUNT(*) FROM Orders GROUP BY status HAVING COUNT(*) > 5",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Media Stock per Categoria (Filtrata)",
        descTemplate: "Media stock per categoria, ma considera solo prodotti con stock > 0.",
        queryTemplate: "SELECT category, AVG(stock) FROM Products WHERE stock > 0 GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT category AVG(stock) FROM Products WHERE stock > 0 GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Group By 2 Colonne",
        descTemplate: "Conta utenti per paese e stato (di iscrizione, se ci fosse, usiamo is_premium). Raggruppa per country e is_premium.",
        queryTemplate: "SELECT country, is_premium, COUNT(*) FROM Users GROUP BY country, is_premium",
        hints: ["Raggruppa per la colonna country", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con AVG calcola la media per ogni raggruppamento, utile per confrontare le performance tra categorie o periodi.",
        replacements: {},
        brokenCode: "SELECT country is_premium, COUNT(*) FROM Users GROUP BY country, is_premium",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ordini Medi per Utente (HAVING)",
        descTemplate: "Utenti con media ordine superiore a 500.",
        queryTemplate: "SELECT user_id, AVG(order_total) FROM Orders GROUP BY user_id HAVING AVG(order_total) > 20",
        hints: ["HAVING AVG(...) > 500"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT user_id AVG(order_total) FROM Orders GROUP BY user_id HAVING AVG(order_total) > 20",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Categoria Dominante",
        descTemplate: "Categorie con stock totale > 1000.",
        queryTemplate: "SELECT category, SUM(stock) FROM Products GROUP BY category HAVING SUM(stock) > 1000",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT category SUM(stock) FROM Products GROUP BY category HAVING SUM(stock) > 1000",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Conteggio Condizionale (Pivot)",
        descTemplate: "Conta quanti ordini sono 'Shipped' e quanti 'Pending' in un'unica query per ogni utente.",
        queryTemplate: "SELECT user_id, SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) as Shipped, SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as Pending FROM Orders GROUP BY user_id",
        hints: ["SUM(CASE WHEN status = '...' THEN 1 ELSE 0 END)"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT user_id, COUNT(WHERE status='Shipped'), COUNT(WHERE status='Pending') FROM Orders GROUP BY user_id",
        debugHint: "Usa CASE WHEN dentro SUM."
      },
      {
        titleTemplate: "Somma Condizionale",
        descTemplate: "Calcola il valore totale degli ordini 'Shipped' per ogni utente.",
        queryTemplate: "SELECT user_id, SUM(CASE WHEN status = 'Shipped' THEN order_total ELSE 0 END) as ShippedValue FROM Orders GROUP BY user_id",
        hints: ["SUM(CASE WHEN ... THEN order_total ELSE 0 END)"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT user_id SUM(CASE WHEN status = 'Shipped' THEN order_total ELSE 0 END) as ShippedValue FROM Orders GROUP BY user_id",
        debugHint: "CASE dentro SUM."
      },
      {
        titleTemplate: "Media Ponderata (Teorica)",
        descTemplate: "Calcola il prezzo medio ponderato per lo stock (SUM(price * stock) / SUM(stock)) per categoria.",
        queryTemplate: "SELECT category, SUM(price * stock) / SUM(stock) as WeightedAvg FROM Products GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT AVG(price * stock) FROM Products GROUP BY category",
        debugHint: "La formula è SommaProdotti / SommaPesi."
      },
      {
        titleTemplate: "Lista Nomi (Group Concat)",
        descTemplate: "Crea una lista separata da virgole dei nomi dei prodotti per ogni categoria.",
        queryTemplate: "SELECT category, GROUP_CONCAT(name, ', ') FROM Products GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT category GROUP_CONCAT(name, ', ') FROM Products GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Having Complesso (AND)",
        descTemplate: "Categorie con media prezzo > 50 E totale stock > 100.",
        queryTemplate: "SELECT category, AVG(price), SUM(stock) FROM Products GROUP BY category HAVING AVG(price) > 50 AND SUM(stock) > 100",
        hints: ["HAVING condition1 AND condition2"],
        explanation: "GROUP BY aggrega le righe con valori identici nella colonna specificata, permettendo di applicare funzioni come COUNT, SUM, AVG a ogni gruppo.",
        replacements: {},
        brokenCode: "SELECT category AVG(price), SUM(stock) FROM Products GROUP BY category HAVING AVG(price) > 50 AND SUM(stock) > 100",
        debugHint: "HAVING con AND."
      },
      {
        titleTemplate: "Having Complesso (OR)",
        descTemplate: "Categorie con media prezzo > 100 OPPURE totale prodotti > 10.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category HAVING AVG(price) > 100 OR COUNT(*) > 10",
        hints: ["HAVING ... OR ..."],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT category COUNT(*) FROM Products GROUP BY category HAVING AVG(price) > 100 OR COUNT(*) > 10",
        debugHint: "OR in HAVING."
      },
      {
        titleTemplate: "Rapporto Prezzo/Stock",
        descTemplate: "Per ogni categoria, calcola il rapporto tra somma prezzi e somma stock.",
        queryTemplate: "SELECT category, SUM(price) / SUM(stock) as Ratio FROM Products GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT category SUM(price) / SUM(stock) as Ratio FROM Products GROUP BY category",
        debugHint: "Divisione tra SUM."
      },
      {
        titleTemplate: "Filtro su Conteggio Distinto",
        descTemplate: "Mostra dipartimenti con più di 3 ruoli diversi.",
        queryTemplate: "SELECT department, COUNT(DISTINCT role) FROM Employees GROUP BY department HAVING COUNT(DISTINCT department) >= 1",
        hints: ["HAVING COUNT(DISTINCT department) > 1"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT department COUNT(DISTINCT role) FROM Employees GROUP BY department HAVING COUNT(DISTINCT department) >= 1",
        debugHint: "HAVING con DISTINCT."
      },
      {
        titleTemplate: "Anno con Più Ordini",
        descTemplate: "Trova l'anno con il maggior numero di ordini (limit 1).",
        queryTemplate: "SELECT YEAR(order_date) as Anno, COUNT(*) FROM Orders GROUP BY Anno ORDER BY COUNT(*) DESC LIMIT 1",
        hints: ["Raggruppa per la colonna Anno", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT YEAR(order_date) IS Anno, COUNT(*) FROM Orders GROUP BY Anno ORDER BY COUNT(*) DESC LIMIT 1",
        debugHint: "ORDER BY aggregate."
      },
      {
        titleTemplate: "Mese di Picco Vendite",
        descTemplate: "Trova il mese (01-12) con la somma totale vendite più alta.",
        queryTemplate: "SELECT MONTH(order_date) as Mese, SUM(order_total) FROM Orders GROUP BY Mese ORDER BY SUM(order_total) DESC LIMIT 1",
        hints: ["GROUP BY Mese ... ORDER BY SUM(...) DESC"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT MONTH(order_date) IS Mese, SUM(order_total) FROM Orders GROUP BY Mese ORDER BY SUM(order_total) DESC LIMIT 1",
        debugHint: "ORDER BY SUM."
      },
      {
        titleTemplate: "Ordini Senza Spedizione",
        descTemplate: "Conta ordini non ancora spediti (status != 'Shipped') per utente, solo se > 0.",
        queryTemplate: "SELECT user_id, COUNT(*) FROM Orders WHERE status != 'Shipped' GROUP BY user_id",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT user_id COUNT(*) FROM Orders WHERE status != 'Shipped' GROUP BY user_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Clienti e Spesa Media (Arrotondata)",
        descTemplate: "Per ogni paese, calcola la spesa media arrotondata a 2 decimali.",
        queryTemplate: "SELECT country, ROUND(AVG(order_total), 2) FROM Orders o JOIN Users u ON o.user_id = u.id GROUP BY country",
        hints: ["ROUND(AVG(...), 2)", "Serve JOIN Users"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT country ROUND(AVG(order_total), 2) FROM Orders o JOIN Users u ON o.user_id = u.id GROUP BY country",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Categorie Binarie",
        descTemplate: "Se una categoria ha somma stock > 500 scrivi 'High', altrimenti 'Low'.",
        queryTemplate: "SELECT category, CASE WHEN SUM(stock) > 500 THEN 'High' ELSE 'Low' END as Status FROM Products GROUP BY category",
        hints: ["CASE WHEN SUM(stock) > 500 ..."],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT category CASE WHEN SUM(stock) > 500 THEN 'High' ELSE 'Low' END as Status FROM Products GROUP BY category",
        debugHint: "CASE su SUM."
      },
      {
        titleTemplate: "Conta domini unici per Paese",
        descTemplate: "Conta quanti domini email unici ci sono per ogni paese.",
        queryTemplate: "SELECT country, COUNT(DISTINCT SUBSTR(email, INSTR(email, '@') + 1)) FROM Users GROUP BY country",
        hints: ["Raggruppa per la colonna country", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT country COUNT(DISTINCT SUBSTR(email, INSTR(email, '@') + 1)) FROM Users GROUP BY country",
        debugHint: "Complex COUNT DISTINCT."
      },
      {
        titleTemplate: "Varianza (Simulata)",
        descTemplate: "Calcola (MAX - MIN) / AVG per i prezzi di ogni categoria (coefficiente variazione approx).",
        queryTemplate: "SELECT category, (MAX(price) - MIN(price)) / AVG(price) as VarCoeff FROM Products GROUP BY category",
        hints: ["(MAX - MIN) / AVG"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT category, (MAX(price) - MIN(price)) / AVG(price) IS VarCoeff FROM Products GROUP BY category",
        debugHint: "Formula con aggregati."
      },
      {
        titleTemplate: "Utenti con 1 solo Ordine",
        descTemplate: "Trova user_id degli utenti che hanno fatto esattamente 1 ordine.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(*) = 1",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY con AVG calcola la media per ogni raggruppamento, utile per confrontare le performance tra categorie o periodi.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders GROUP user_id HAVING COUNT(*) = 1",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Prodotti Non Disponibili per Cat",
        descTemplate: "Conta quanti prodotti hanno stock = 0 per ogni categoria.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products WHERE stock = 0 GROUP BY category",
        hints: ["WHERE stock = 0 ... GROUP BY"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT category COUNT(*) FROM Products WHERE stock = 0 GROUP BY category",
        debugHint: "WHERE stock = 0."
      },
      {
        titleTemplate: "Somma Totale Globale",
        descTemplate: "Un'unica riga con somma totale vendite e conteggio ordini globale (senza GROUP BY esplicito).",
        queryTemplate: "SELECT SUM(order_total), COUNT(*) FROM Orders",
        hints: ["SELECT SUM..., COUNT..."],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELCET SUM(order_total), COUNT(*) FROM Orders",
        debugHint: "Nessun GROUP BY."
      },
      {
        titleTemplate: "Percentuale Stock (Subquery)",
        descTemplate: "Per la categoria 'Electronics', calcola la % rispetto allo stock totale (richiede subquery scalare).",
        queryTemplate: "SELECT SUM(stock) * 100.0 / (SELECT SUM(stock) FROM Products) FROM Products WHERE category = 'Electronics'",
        hints: ["SUM(stock) / (SELECT SUM(stock)...)"],
        explanation: "COUNT(*) conta tutte le righe della tabella o del set filtrato, incluse quelle con valori NULL.",
        replacements: {},
        brokenCode: "SELECT SUM(stock) 100.0 / (SELECT SUM(stock) FROM Products) FROM Products WHERE category = 'Electronics'",
        debugHint: "Serve select annidata nel divisore."
      },
      {
        titleTemplate: "Media dei Massimi",
        descTemplate: "Nota: In SQL standard non si può annidare AVG(MAX(...)) direttamente. Calcola invece MAX(price) per categoria e ordinali.",
        queryTemplate: "SELECT category, MAX(price) FROM Products GROUP BY category ORDER BY MAX(price) DESC",
        hints: ["GROUP BY ... ORDER BY MAX"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT AVG(MAX(price)) FROM Products",
        debugHint: "Non annidare aggregati."
      },
      {
        titleTemplate: "Utenti Iscritti per Trimestre",
        descTemplate: "Raggruppa utenti per trimestre (Quarter) di created_at. (Usa espressione Case o strftime modificata).",
        queryTemplate: "SELECT CASE WHEN MONTH(created_at) BETWEEN '01' AND '03' THEN 'Q1' WHEN MONTH(created_at) BETWEEN '04' AND '06' THEN 'Q2' WHEN MONTH(created_at) BETWEEN '07' AND '09' THEN 'Q3' ELSE 'Q4' END as Quarter, COUNT(*) FROM Users GROUP BY Quarter",
        hints: ["Usa CASE WHEN per classificare i valori", "Ricorda di chiudere con END"],
        explanation: "GROUP BY con MIN/MAX trova il valore estremo in ogni gruppo, utile per analisi di range e identificazione di outlier.",
        replacements: {},
        brokenCode: "SELECT CASE WHEN MONTH(created_at) BETWEEN '01' AND '03' THEN 'Q1' WHEN MONTH(created_at) BETWEEN '04' AND '06' THEN 'Q2' WHEN MONTH(created_at) BETWEEN '07' AND '09' THEN 'Q3' ELSE 'Q4' END IS Quarter, COUNT(*) FROM Users GROUP BY Quarter",
        debugHint: "CASE per definire gruppi."
      },
      {
        titleTemplate: "Lunghezza Media Nome per Cat",
        descTemplate: "Calcola la lunghezza media del nome prodotto per categoria.",
        queryTemplate: "SELECT category, AVG(LENGTH(name)) FROM Products GROUP BY category",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "COUNT con CASE WHEN permette di contare selettivamente le righe che soddisfano determinate condizioni, utile per pivot e report.",
        replacements: {},
        brokenCode: "SELECT category AVG(LENGTH(name)) FROM Products GROUP BY category",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Ultimi 3 Giorni di Ordini",
        descTemplate: "Conta ordini aggregati per data, solo per date negli ultimi 3 giorni (rispetto a un fisso o max).",
        queryTemplate: "SELECT order_date, COUNT(*) FROM Orders GROUP BY order_date ORDER BY order_date DESC LIMIT 3",
        hints: ["WHERE ... >= date(MAX(...), '-3 days')"],
        explanation: "GROUP BY con AVG calcola la media per ogni raggruppamento, utile per confrontare le performance tra categorie o periodi.",
        replacements: {},
        brokenCode: "SELECT order_date COUNT(*) FROM Orders GROUP BY order_date ORDER BY order_date DESC LIMIT 3",
        debugHint: "Subquery per data max."
      },
      {
        titleTemplate: "Gruppi con Tutti i Prodotti Costosi",
        descTemplate: "Trova categorie dove il prodotto più economico costa comunque più di 20.",
        queryTemplate: "SELECT category FROM Products GROUP BY category HAVING MIN(price) > 20",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT category FROM Products GROUP category HAVING MIN(price) > 20",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Gruppi con Almeno un Prod Costoso",
        descTemplate: "Trova categorie con almeno un prodotto sopra i 500 (usando MAX).",
        queryTemplate: "SELECT category FROM Products GROUP BY category HAVING MAX(price) > 500",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT category FROM Products GROUP category HAVING MAX(price) > 500",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Concatena ID Ordini",
        descTemplate: "Per ogni utente, lista gli ID dei suoi ordini separati da pipe '|'.",
        queryTemplate: "SELECT user_id, GROUP_CONCAT(id, '|') FROM Orders GROUP BY user_id",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT user_id GROUP_CONCAT(id, '|') FROM Orders GROUP BY user_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Differenza dalla Media Globale",
        descTemplate: "Per ogni prodotto, calcola differenza prezzo dalla media globale (richiede CROSS JOIN implicito o subquery).",
        queryTemplate: "SELECT name, price - (SELECT AVG(price) FROM Products) as Diff FROM Products",
        hints: ["price - (SELECT AVG(...) ...)"],
        explanation: "Non è un GROUP BY normale, è window-like.",
        replacements: {},
        brokenCode: "SELECT name price - (SELECT AVG(price) FROM Products) as Diff FROM Products",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Conta Nulli vs Non Nulli",
        descTemplate: "In Employees, conta quanti hanno manager (NonNull) e quanti no (Null) in una riga.",
        queryTemplate: "SELECT COUNT(manager_id) as HasManager, SUM(CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END) as NoManager FROM Employees",
        hints: ["COUNT(col) conta non-null", "SUM(CASE WHEN col IS NULL...)"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT COUNT(manager_id) IS HasManager, SUM(CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END) as NoManager FROM Employees",
        debugHint: "COUNT vs SUM CASE."
      },
      {
        titleTemplate: "Media Escludendo Estremi",
        descTemplate: "Calcola media prezzi escludendo il più alto e il più basso (concettuale).",
        queryTemplate: "SELECT (SUM(price) - MAX(price) - MIN(price)) / (COUNT(*) - 2) as TrimmedAvg FROM Products",
        hints: ["(SUM - MAX - MIN) / (COUNT - 2)"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT (SUM(price) - MAX(price) - MIN(price)) / (COUNT(*) - 2) IS TrimmedAvg FROM Products",
        debugHint: "Aritmetica su aggregati."
      },
      {
        titleTemplate: "Categoria con Stock Medio Più Alto",
        descTemplate: "Trova la singola categoria con lo stock_quantity medio più alto.",
        queryTemplate: "SELECT category FROM Products GROUP BY category ORDER BY AVG(stock) DESC LIMIT 1",
        hints: ["Raggruppa per categoria e ordina per media stock", "Usa DESC e LIMIT 1 per ottenere solo il valore più alto"],
        explanation: "Combinando GROUP BY, una funzione aggregata in ORDER BY e LIMIT 1, puoi trovare il gruppo con il valore massimo di un aggregato.",
        replacements: {},
        brokenCode: "SELECT category FROM Products GROUP BY category ORDER AVG(stock) DESC LIMIT 1",
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
        descTemplate: "Unisci nome e dipartimento degli impiegati in una sola stringa.",
        queryTemplate: "SELECT CONCAT(name, ' - ', department) as badge_info FROM Employees",
        hints: ["Usa CONCAT()", "Separa i campi con una virgola e aggiungi un separatore come ' - '"],
        explanation: "CONCAT unisce due o più stringhe in una sola.",
        replacements: {},
        brokenCode: "SELECT name + role FROM Employees",
        debugHint: "Anche se '+' funziona in alcuni DB, lo standard sicuro qui è CONCAT(a, b)."
      },
      {
        titleTemplate: "Differenza Prezzo da 100",
        descTemplate: "Calcola la differenza assoluta del prezzo dei prodotti rispetto a 100.",
        queryTemplate: "SELECT price, ABS(price - 100) as diff FROM Products",
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
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Prezzo Pavimento",
        descTemplate: "Arrotonda il prezzo per difetto (FLOOR).",
        queryTemplate: "SELECT price, FLOOR(price) as floor_price FROM Products",
        hints: ["Usa FLOOR()", "Arrotonda sempre in basso"],
        explanation: "CEIL() arrotonda un numero per eccesso all'intero successivo, utile per calcoli di spedizione e allocazione risorse.",
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
        queryTemplate: "SELECT SUBSTR(category, 1, 3) as short_cat FROM Products",
        hints: ["Usa LEFT()", "Specifica 3 come secondo argomento"],
        explanation: "LEFT estrae un numero specificato di caratteri dall'inizio di una stringa.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(category, 3) FROM Products",
        debugHint: "SUBSTR(col, 1, 3) prende i primi 3. SUBSTR(col, 3) partirebbe dal 3° carattere."
      },
      {
        titleTemplate: "Ultimi Caratteri",
        descTemplate: "Mostra gli ultimi 2 caratteri delle email degli utenti.",
        queryTemplate: "SELECT email, SUBSTR(email, LENGTH(email) - 2 + 1, 2) as domain_hint FROM Users",
        hints: ["Usa RIGHT()", "Specifica 2 come lunghezza"],
        explanation: "RIGHT estrae caratteri dalla fine della stringa.",
        replacements: {},
        brokenCode: "SELECT LAST(email, 2) FROM Users",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Rimozione Spazi",
        descTemplate: "Rimuovi spazi all'inizio e fine dei nomi (TRIM).",
        queryTemplate: "SELECT TRIM(name) as clean_name FROM Users",
        hints: ["Usa TRIM()", "Utile per pulire l'input utente"],
        explanation: "TRIM rimuove spazi bianchi superflui agli estremi della stringa.",
        replacements: {},
        brokenCode: "SELECT CLEAN(name) FROM Users",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Potenza",
        descTemplate: "Calcola il quadrato del prezzo.",
        queryTemplate: "SELECT price, POWER(price, 2) as price_squared FROM Products",
        hints: ["Usa POWER()", "Il secondo argomento è l'esponente (2)"],
        explanation: "POWER(base, esponente) eleva un numero a potenza.",
        replacements: {},
        brokenCode: "SELECT price ^ 2 FROM Products",
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
        descTemplate: "Determina se il prezzo meno 50 è positivo, negativi o zero (SIGN).",
        queryTemplate: "SELECT price, SIGN(price - 50) FROM Products",
        hints: ["Usa SIGN()", "Restituisce 1, -1 o 0"],
        explanation: "SIGN restituisce il segno del numero.",
        replacements: {},
        brokenCode: "SELECT price SIGN(price - 50) FROM Products",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Stringa Inversa",
        descTemplate: "Scrivi il nome al contrario.",
        queryTemplate: "SELECT REVERSE(name) FROM Users",
        hints: ["Usa REVERSE()", "Inverte l'ordine dei caratteri"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELCET REVERSE(name) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Lunghezza Stringa",
        descTemplate: "Ripeti il ruolo 'CEO' 3 volte.",
        queryTemplate: "SELECT LENGTH('CEO')",
        hints: ["Usa REPEAT()", "Argomenti: stringa, numero ripetizioni"],
        explanation: "REPEAT duplica una stringa N volte.",
        replacements: {},
        brokenCode: "SELCET LENGTH('CEO')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Posizione Carattere",
        descTemplate: "Trova la posizione della chiocciola '@' nelle email.",
        queryTemplate: "SELECT email, INSTR(COALESCE(email, ''), '@') as at_pos FROM Users",
        hints: ["Usa INSTR()", "Cerca '@'"],
        explanation: "INSTR (o LOCATE/POSITION) trova l'indice di una sottostringa.",
        replacements: {},
        brokenCode: "SELECT email INSTR(COALESCE(email, ''), '@') as at_pos FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Nome Casuale",
        descTemplate: "Genera un numero casuale per ogni riga.",
        queryTemplate: "SELECT id, RAND() as lucky_number FROM Users",
        hints: ["Usa RAND()", "Non richiede argomenti"],
        explanation: "RAND genera un valore float tra 0 e 1.",
        replacements: {},
        brokenCode: "SELECT id RAND() as lucky_number FROM Users",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Pi Greco",
        descTemplate: "Mostra il valore di PI greco.",
        queryTemplate: "SELECT PI()",
        hints: ["Funzione PI()", "Nessun argomento"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELCET PI()",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Logaritmo",
        descTemplate: "Calcola il logaritmo naturale del prezzo.",
        queryTemplate: "SELECT price, LOG(price) FROM Products",
        hints: ["Usa LOG()", "Applicalo a numeri positivi"],
        explanation: "Calcolo matematico avanzato.",
        replacements: {},
        brokenCode: "SELECT price LOG(price) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Esponenziale",
        descTemplate: "Calcola e (numero di Eulero) elevato al prezzo (EXP).",
        queryTemplate: "SELECT price, EXP(price) FROM Products WHERE price < 55",
        hints: ["Usa EXP()", "Filtra prezzi bassi per evitare overflow"],
        explanation: "Funzione inversa del logaritmo naturale.",
        replacements: {},
        brokenCode: "SELECT price EXP(price) FROM Products WHERE price < 55",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Gradi a Radianti",
        descTemplate: "Converti 180 gradi in radianti.",
        queryTemplate: "SELECT RADIANS(180)",
        hints: ["Usa RADIANS()", "180 gradi = PI radianti"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELCET RADIANS(180)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Radianti a Gradi",
        descTemplate: "Converti PI in gradi.",
        queryTemplate: "SELECT DEGREES(PI())",
        hints: ["Usa DEGREES()", "Passa PI()"],
        explanation: "Dovrebbe restituire 180.",
        replacements: {},
        brokenCode: "SELCET DEGREES(PI())",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Sostituzione Semplice",
        descTemplate: "Sostituisci 'Office' con 'Work' nei dipartimenti.",
        queryTemplate: "SELECT REPLACE(department, 'Office', 'Work') FROM Employees",
        hints: ["Usa REPLACE()", "Argomenti: colonna, cerca, sostituisci_con"],
        explanation: "Sostituzione di testo all'interno di una stringa.",
        replacements: {},
        brokenCode: "SELCET REPLACE(department, 'Office', 'Work') FROM Employees",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Spazi Sinistra",
        descTemplate: "Rimuovi spazi a sinistra (LTRIM).",
        queryTemplate: "SELECT LTRIM('   text')",
        hints: ["Usa LTRIM()", "Rimuove spazi leading"],
        explanation: "REPLACE() sostituisce tutte le occorrenze di una sottostringa con un'altra, utile per pulizia e normalizzazione dati.",
        replacements: {},
        brokenCode: "SELCET LTRIM('   text')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Spazi Destra",
        descTemplate: "Rimuovi spazi a destra (RTRIM).",
        queryTemplate: "SELECT RTRIM('text   ')",
        hints: ["Usa RTRIM()", "Rimuove spazi trailing"],
        explanation: "Le funzioni stringa SQL permettono di manipolare e trasformare dati testuali direttamente nelle query.",
        replacements: {},
        brokenCode: "SELCET RTRIM('text   ')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Codice ASCII",
        descTemplate: "Ottieni il codice ASCII della prima lettera del nome.",
        queryTemplate: "SELECT name, ASCII(name) FROM Users",
        hints: ["Usa ASCII()", "Restituisce il codice del primo carattere"],
        explanation: "Restituisce il valore numerico del carattere.",
        replacements: {},
        brokenCode: "SELECT name ASCII(name) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Da ASCII a Char",
        descTemplate: "Trova il carattere corrispondente al codice 65.",
        queryTemplate: "SELECT CHAR(65)",
        hints: ["Usa CHAR()", "65 è 'A'"],
        explanation: "Conversione inversa di ASCII.",
        replacements: {},
        brokenCode: "SELCET CHAR(65)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Lunghezza Bit",
        descTemplate: "Calcola la lunghezza in bit del nome.",
        queryTemplate: "SELECT BIT_LENGTH(name) FROM Users",
        hints: ["Usa BIT_LENGTH()", "Solitamente 8x la lunghezza in caratteri (per ASCII)"],
        explanation: "Misura la dimensione in memoria.",
        replacements: {},
        brokenCode: "SELCET BIT_LENGTH(name) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        brokenCode: "SELCET CONCAT('Prezzo: ', price) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        queryTemplate: "SELECT LPAD(CAST(id AS STRING), 5, '0') as code FROM Products",
        hints: ["Usa LPAD()", "Specifica lunghezza 5 e carattere '0'"],
        explanation: "LPAD (Left Pad) riempie la stringa a sinistra fino alla lunghezza desiderata.",
        replacements: {},
        brokenCode: "SELECT PAD(id, 5) FROM Products",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Right Padding",
        descTemplate: "Aggiungi trattini alla fine del nome fino a lunghezza 20.",
        queryTemplate: "SELECT RPAD(name, 20, '-') FROM Users",
        hints: ["Usa RPAD()", "Carattere riempitivo '-'"],
        explanation: "Le funzioni stringa SQL permettono di manipolare e trasformare dati testuali direttamente nelle query.",
        replacements: {},
        brokenCode: "SELCET RPAD(name, 20, '-') FROM Users",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Iniziali",
        descTemplate: "Estrai la prima lettera del nome e il ruolo.",
        queryTemplate: "SELECT SUBSTR(name, 1, 1) as initial, department FROM Employees",
        hints: ["Usa SUBSTR(name, 1, 1)"],
        explanation: "Le funzioni stringa SQL permettono di manipolare e trasformare dati testuali direttamente nelle query.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(name, 1, 1) IS initial, department FROM Employees",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(email, 1, INSTR(email, '@') - 1) IS username FROM Users",
        debugHint: "Controlla il calcolo della lunghezza."
      },
      {
        titleTemplate: "Arrotonda Decimali",
        descTemplate: "Arrotonda un numero (es. 123.4567) a 2 decimali.",
        queryTemplate: "SELECT ROUND(123.4567, 2)",
        hints: ["Secondo argomento di ROUND è la precisione"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT ROUND(123.4567)",
        debugHint: "Manca il secondo parametro per i decimali."
      },
      {
        titleTemplate: "Tronca Numero",
        descTemplate: "Tronca il prezzo (rimuovi decimali senza arrotondare).",
        queryTemplate: "SELECT ROUND(price, 0) FROM Products",
        hints: ["Usa ROUND()", "Precisione 0"],
        explanation: "ROUND taglia i decimali, diversamente da FLOOR per i negativi.",
        replacements: {},
        brokenCode: "SELCET ROUND(price, 0) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Potenza Variabile",
        descTemplate: "Eleva lo stock alla potenza dell'ID (esercizio teorico).",
        queryTemplate: "SELECT POWER(stock, id) FROM Products",
        hints: ["Power accetta colonne per entrambi gli argomenti"],
        explanation: "Le funzioni matematiche possono usare colonne dinamiche.",
        replacements: {},
        brokenCode: "SELCET POWER(stock, id) FROM Products",
        debugHint: "Controlla la sintassi POWER."
      },
      {
        titleTemplate: "Pari o Dispari Stringa",
        descTemplate: "Restituisci 'Pari' o 'Dispari' basato sulla lunghezza del nome.",
        queryTemplate: "SELECT name, CASE WHEN MOD(LENGTH(name), 2) = 0 THEN 'Pari' ELSE 'Dispari' END FROM Users",
        hints: ["Usa LENGTH()", "Usa MOD() sul risultato", "Usa CASE WHEN"],
        explanation: "Combinazione di funzioni scalari e logica condizionale.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN MOD(LENGTH(name), 2) = 0 THEN 'Pari' ELSE 'Dispari' END FROM Users",
        debugHint: "Controlla la struttura CASE WHEN."
      },
      {
        titleTemplate: "Formatta Valuta",
        descTemplate: "Prefixa il prezzo con '$' convertendolo in stringa.",
        queryTemplate: "SELECT CONCAT('$', price) FROM Products",
        hints: ["Concatena il simbolo"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELCET CONCAT('$', price) FROM Products",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
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
        brokenCode: "SELECT REPLACE(name, 'Monitor', 'Screen') FROM Products WERE name LIKE '%Monitor%'",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Stringa Vuota",
        descTemplate: "Controlla se la descrizione è vuota (Length 0) o NULL (Coalesce).",
        queryTemplate: "SELECT name, LENGTH(COALESCE(description, '')) FROM Products",
        hints: ["Gestisci NULL con COALESCE", "Poi calcola LENGTH"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT name LENGTH(COALESCE(description, '')) FROM Products",
        debugHint: "Usa COALESCE dentro LENGTH."
      },
      {
        titleTemplate: "Posizione Spazio",
        descTemplate: "Trova la posizione del primo spazio nel nome del prodotto.",
        queryTemplate: "SELECT name, INSTR(name, ' ') FROM Products",
        hints: ["Cerca lo spazio ' '"],
        explanation: "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.",
        replacements: {},
        brokenCode: "SELECT name INSTR(name, ' ') FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Lunghezza Nome Prodotto",
        descTemplate: "Crea una barra di stelle lunga quanto lo stock.",
        queryTemplate: "SELECT name, LENGTH(name) as name_len FROM Products",
        hints: ["Usa REPEAT()", "Usa stock come conteggio"],
        explanation: "Visualizzazione dati testuale (histogram).",
        replacements: {},
        brokenCode: "SELECT name LENGTH(name) as name_len FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Trim a Sinistra",
        descTemplate: "Rimuovi 'X' dall'inizio di una stringa 'XXXName'.",
        queryTemplate: "SELECT LTRIM('   Name')",
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
        hints: ["Seleziona dalla tabella Products", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Le funzioni stringa SQL permettono di manipolare e trasformare dati testuali direttamente nelle query.",
        replacements: {},
        brokenCode: "SELCET CONCAT('New ', name) FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Mid String",
        descTemplate: "Prendi caratteri dal 2 al 4 (Lungh 3).",
        queryTemplate: "SELECT SUBSTR(name, 2, 3) FROM Users",
        hints: ["Start 2, Length 3"],
        explanation: "CONCAT() unisce due o più stringhe in una sola, utile per creare campi composti come nome completo o indirizzi.",
        replacements: {},
        brokenCode: "SELCET SUBSTR(name, 2, 3) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        queryTemplate: "SELECT CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name,2))) FROM Users",
        hints: ["Upper del primo char", "Lower del resto", "Concatena"],
        explanation: "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.",
        replacements: {},
        brokenCode: "SELCET CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name,2))) FROM Users",
        debugHint: "Combina UPPER, LEFT, LOWER, SUBSTR."
      },
      {
        titleTemplate: "Soundex Sim",
        descTemplate: "Confronta stringhe simili (es. uso SOUNDEX se supportato, o LEFT match).",
        queryTemplate: "SELECT * FROM Users WHERE SUBSTR(name, 1, 1) = SUBSTR('Alex', 1, 1)",
        hints: ["Confronto basato su iniziali"],
        explanation: "UPPER() converte tutti i caratteri in maiuscolo. Utile per standardizzare dati e per confronti case-insensitive.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE SUBSTR(name, 1, 1) = SUBSTR('Alex', 1, 1)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Random Integer",
        descTemplate: "Genera un intero random tra 1 e 10.",
        queryTemplate: "SELECT FLOOR(RAND() * 10) + 1",
        hints: ["RAND() * 10 da 0 a 9.99", "FLOOR scende a 0..9", "+1 porta a 1..10"],
        explanation: "Formula standard per range casuali interi.",
        replacements: {},
        brokenCode: "SELECT FLOOR(RAND() 10) + 1",
        debugHint: "Ricorda di usare FLOOR."
      },
      {
        titleTemplate: "Valuta Formattata 2",
        descTemplate: "Prezzo / 100 visualizzato con 2 decimali.",
        queryTemplate: "SELECT ROUND(price / 100, 2) FROM Products",
        hints: ["Dividi", "Poi Arrotonda"],
        explanation: "FLOOR() arrotonda per difetto all'intero inferiore, utile per troncamenti e calcoli dove i decimali non servono.",
        replacements: {},
        brokenCode: "SELECT ROUND(price 100, 2) FROM Products",
        debugHint: "ROUND va all'esterno."
      },
      {
        titleTemplate: "Nullif Zero",
        descTemplate: "Evita divisione per zero usando NULLIF.",
        queryTemplate: "SELECT 100 / NULLIF(points, 0) FROM Users",
        hints: ["NULLIF(points, 0) ritorna NULL se points è 0", "N / NULL dà NULL (sicuro)"],
        explanation: "ROUND() arrotonda un numero al numero di decimali specificato. Fondamentale per presentare valori monetari e percentuali.",
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
        brokenCode: "SELCET COALESCE(NULL, NULL, 'Found', 'Ignored')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ascii Sum",
        descTemplate: "Somma codice ASCII prima e ultima lettera.",
        queryTemplate: "SELECT ASCII(SUBSTR(name, 1, 1)) + ASCII(SUBSTR(name, LENGTH(name) - 1 + 1, 1)) FROM Users",
        hints: ["ASCII(LEFT...)", "ASCII(RIGHT...)", "Somma"],
        explanation: "Calculi su codici carattere.",
        replacements: {},
        brokenCode: "SELECT ASCII(SUBSTR(name, 1, 1)) ASCII(SUBSTR(name, LENGTH(name) - 1 + 1, 1)) FROM Users",
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
        brokenCode: "SELCET CONCAT(SUBSTR(email, 1, 2), '***', SUBSTR(email, INSTR(email, '@'))) FROM Users",
        debugHint: "Spezza il problema in 3 parti e uniscile con CONCAT."
      },
      {
        titleTemplate: "Formattazione Nome",
        descTemplate: "Formatta come: COGNOME, N. (Tutto maiuscolo, iniziale nome). Simuliamo Cognome come seconda parola.",
        queryTemplate: "SELECT CONCAT(UPPER(SUBSTR(name, INSTR(name, ' ') + 1)), ', ', UPPER(SUBSTR(name, 1, 1)), '.') FROM Users WHERE INSTR(name, ' ') > 0",
        hints: ["Estrai parte dopo spazio (Cognome)", "Primo carattere (Nome)", "Concatena con virgola"],
        explanation: "Manipolazione avanzata di stringhe basata su delimitatori.",
        replacements: {},
        brokenCode: "SELECT CONCAT(UPPER(SUBSTR(name, INSTR(name, ' ') 1)), ', ', UPPER(SUBSTR(name, 1, 1)), '.') FROM Users WHERE INSTR(name, ' ') > 0",
        debugHint: "Usa INSTR per trovare lo spazio."
      },
      {
        titleTemplate: "Calcolo IVA",
        descTemplate: "Calcola prezzo con IVA 22% arrotondato a 2 decimali e formattato.",
        queryTemplate: "SELECT CONCAT('€', ROUND(price * 1.22, 2)) as iva_price FROM Products",
        hints: ["Moltiplica per 1.22", "Arrotonda a 2", "Concatena simbolo"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT CONCAT('€', ROUND(price * 1.22, 2)) IS iva_price FROM Products",
        debugHint: "Attento all'ordine: prima calcola, poi arrotonda, poi stringa."
      },
      {
        titleTemplate: "Password Strength",
        descTemplate: "Score: Lunghezza * 10, ma max 100 (Usa LEAST/MIN non supportato? Usa CASE).",
        queryTemplate: "SELECT CASE WHEN LENGTH(name)*10 > 100 THEN 100 ELSE LENGTH(name)*10 END as score FROM Users",
        hints: ["Calcola score base", "Usa CASE per limitare (clamp) a 100"],
        explanation: "CONCAT() unisce due o più stringhe in una sola, utile per creare campi composti come nome completo o indirizzi.",
        replacements: {},
        brokenCode: "SELECT CASE WHEN LENGTH(name)*10 > 100 THEN 100 ELSE LENGTH(name)*10 END IS score FROM Users",
        debugHint: "Usa CASE WHEN val > 100 THEN 100."
      },
      {
        titleTemplate: "Estrazione Parziale",
        descTemplate: "Estrai testo tra parentesi quadre '[tag] Content'.",
        queryTemplate: "SELECT SUBSTR(name, INSTR(name, 'e')+1, 3) FROM Products WHERE name LIKE '%e%'",
        hints: ["Trova pos '['", "Trova pos ']'", "Calcola lunghezza come diff"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT SUBSTR(name, INSTR(name, 'e') 1, 3) FROM Products WHERE name LIKE '%e%'",
        debugHint: "Lunghezza = PosChiusura - PosApertura - 1."
      },
      {
        titleTemplate: "Generatore Codice",
        descTemplate: "Genera codice: Primi 2 char categoria (Upper) + ID (pad 3) + ult char nome.",
        queryTemplate: "SELECT CONCAT(UPPER(SUBSTR(category, 1, 2)), LPAD(CAST(id AS STRING), 3, '0'), SUBSTR(name, LENGTH(name) - 1 + 1, 1)) FROM Products",
        hints: ["Unisci 3 parti", "Usa Upper, Left, Lpad, Right"],
        explanation: "LIKE filtra le stringhe per pattern: % corrisponde a qualsiasi sequenza di caratteri, _ a un singolo carattere.",
        replacements: {},
        brokenCode: "SELECT CONCAT(UPPER(SUBSTR(category, 1, 2)), LPAD(CAST(id IS STRING), 3, '0'), SUBSTR(name, LENGTH(name) - 1 + 1, 1)) FROM Products",
        debugHint: "Usa CONCAT per unire tutto."
      },
      {
        titleTemplate: "Swap Case",
        descTemplate: "Simulazione: Se inizia con minuscola, trasforma in maiuscola, altrimenti minuscola.",
        queryTemplate: "SELECT CASE WHEN SUBSTR(name, 1, 1) = LOWER(SUBSTR(name, 1, 1)) THEN UPPER(name) ELSE LOWER(name) END FROM Users",
        hints: ["Confronta primo char con sua versione Lower", "Decidi azione"],
        explanation: "UPPER() converte tutti i caratteri in maiuscolo. Utile per standardizzare dati e per confronti case-insensitive.",
        replacements: {},
        brokenCode: "SELECT CASE SUBSTR(name, 1, 1) = LOWER(SUBSTR(name, 1, 1)) THEN UPPER(name) ELSE LOWER(name) END FROM Users",
        debugHint: "Usa CASE WHEN."
      },
      {
        titleTemplate: "Distanza Numerica",
        descTemplate: "Trova il prodotto col prezzo più vicino a 50.",
        queryTemplate: "SELECT * FROM Products ORDER BY ABS(price - 50) ASC LIMIT 1",
        hints: ["Ordina per ABS(price - 50)", "Prendi il primo"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT FROM Products ORDER BY ABS(price - 50) ASC LIMIT 1",
        debugHint: "ORDER BY ABS(...) è la chiave."
      },
      {
        titleTemplate: "Statistiche Nome",
        descTemplate: "Stringa riassuntiva: 'Nome: X chars, Start: Y, End: Z'.",
        queryTemplate: "SELECT CONCAT('Nome: ', LENGTH(name), ' chars, Start: ', SUBSTR(name, 1, 1), ', End: ', SUBSTR(name, LENGTH(name) - 1 + 1, 1)) FROM Products",
        hints: ["Seleziona dalla tabella Products", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "ORDER BY con ASC ordina i risultati in ordine crescente (dal più piccolo al più grande, dalla A alla Z). ASC è il default.",
        replacements: {},
        brokenCode: "SELECT CONCAT('Nome: ', LENGTH(name), ' chars, Start: ', SUBSTR(name, 1, 1), ', End: ', SUBSTR(name, LENGTH(name) 1 + 1, 1)) FROM Products",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Pulizia Totale",
        descTemplate: "Trim, Lower e Remove '@' dall'input.",
        queryTemplate: "SELECT REPLACE(LOWER(TRIM(name)), '@', '') FROM Users",
        hints: ["Nidifica le funzioni: Replace(Lower(Trim(...)))"],
        explanation: "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.",
        replacements: {},
        brokenCode: "SELCET REPLACE(LOWER(TRIM(name)), '@', '') FROM Users",
        debugHint: "L'ordine conta: l'input di REPLACE è l'output di LOWER."
      },
      {
        titleTemplate: "Filtro Lunghezza Dinamico",
        descTemplate: "Trova nomi più lunghi della media delle lunghezze.",
        queryTemplate: "SELECT name FROM Users WHERE LENGTH(name) > (SELECT AVG(LENGTH(name)) FROM Users)",
        hints: ["Subquery calcola AVG(LENGTH)", "Confronta LENGTH(name)"],
        explanation: "Funzioni scalari in combinazione con aggregazioni.",
        replacements: {},
        brokenCode: "SELECT name FROM Users WHERE LENGTH(name) < (SELECT AVG(LENGTH(name)) FROM Users)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Codifica Rot13 (Sim)",
        descTemplate: "Sostituisci 'A' con 'N' e 'B' con 'O' (Solo 2 char per esercizio).",
        queryTemplate: "SELECT REPLACE(REPLACE(UPPER(name), 'A', 'N'), 'B', 'O') FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELCET REPLACE(REPLACE(UPPER(name), 'A', 'N'), 'B', 'O') FROM Users",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Conteggio Vocali (Sim)",
        descTemplate: "Conta 'a' nel nome (Lunghezza originale - Lunghezza senza 'a').",
        queryTemplate: "SELECT LENGTH(name) - LENGTH(REPLACE(LOWER(name), 'a', '')) as a_count FROM Users",
        hints: ["Rimuovi le 'a'", "Confronta le lunghezze"],
        explanation: "Trucco standard SQL per contare occorrenze di un char.",
        replacements: {},
        brokenCode: "SELECT LENGTH(name) - LENGTH(REPLACE(LOWER(name), 'a', '')) IS a_count FROM Users",
        debugHint: "Length(orig) - Length(removed)."
      },
      {
        titleTemplate: "Slugify (Sim)",
        descTemplate: "Converti 'Nome Prodotto' in 'nome-prodotto' (Lower, Replace space).",
        queryTemplate: "SELECT REPLACE(LOWER(name), ' ', '-') FROM Products",
        hints: ["Lower", "Replace spazio con dash"],
        explanation: "LOWER() converte in minuscolo tutti i caratteri della stringa, utile per normalizzare i dati testuali.",
        replacements: {},
        brokenCode: "SELCET REPLACE(LOWER(name), ' ', '-') FROM Products",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Valore Futuro",
        descTemplate: "Points aumentati del 10% ogni anno di anzianità (Diff anni * 10%).",
        queryTemplate: "SELECT points * POWER(1.10, 2023 - YEAR(created_at)) FROM Users",
        hints: ["Base 1.10", "Esponente: Anni trascorsi"],
        explanation: "LOWER() converte in minuscolo tutti i caratteri della stringa, utile per normalizzare i dati testuali.",
        replacements: {},
        brokenCode: "SELCET points * POWER(1.10, 2023 - YEAR(created_at)) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Coordinate (Sim)",
        descTemplate: "Formatta (x, y) da due colonne (id come x, stock come y).",
        queryTemplate: "SELECT CONCAT('(', id, ', ', stock, ')') as point FROM Products",
        hints: ["Concatena parentesi e virgole"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELECT CONCAT('(', id, ', ', stock, ')') IS point FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Hash Semplice",
        descTemplate: "Somma (ASCII primo char) * (ASCII ultimo char).",
        queryTemplate: "SELECT ASCII(SUBSTR(name, 1, 1)) * ASCII(SUBSTR(name, LENGTH(name) - 1 + 1, 1)) as hash FROM Users",
        hints: ["Moltiplicazione di ASCII"],
        explanation: "CONCAT() unisce due o più stringhe in una sola, utile per creare campi composti come nome completo o indirizzi.",
        replacements: {},
        brokenCode: "SELECT ASCII(SUBSTR(name, 1, 1)) * ASCII(SUBSTR(name, LENGTH(name) - 1 + 1, 1)) IS hash FROM Users",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Progressione",
        descTemplate: "Genera '1-2-3' (concatenazione fissa per esercizio).",
        queryTemplate: "SELECT '1-2-3'",
        hints: ["Literal"],
        explanation: "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.",
        replacements: {},
        brokenCode: "SELECT '1 2-3'",
        debugHint: "Select stringa semplice."
      },
      {
        titleTemplate: "Email Oscurata Parziale",
        descTemplate: "Se premium: mostra, se no: maschera.",
        queryTemplate: "SELECT CASE WHEN is_premium THEN email ELSE '***' END FROM Users",
        hints: ["CASE WHEN su premium"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT CASE is_premium THEN email ELSE '***' END FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Categoria Normalizzata",
        descTemplate: "Se categoria è NULL o vuota, 'Generico', poi UPPER.",
        queryTemplate: "SELECT UPPER(COALESCE(NULLIF(category, ''), 'Generico')) FROM Products",
        hints: ["NULLIF(cat, '') gestisce stringa vuota", "COALESCE gestisce NULL", "UPPER alla fine"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELCET UPPER(COALESCE(NULLIF(category, ''), 'Generico')) FROM Products",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Report Stock",
        descTemplate: "'Low' se < 10, 'Med' se < 50, 'High' altrimenti.",
        queryTemplate: "SELECT name, CASE WHEN stock < 10 THEN 'Low' WHEN stock < 50 THEN 'Med' ELSE 'High' END FROM Products",
        hints: ["CASE WHEN multiplo"],
        explanation: "UPPER() converte tutti i caratteri in maiuscolo. Utile per standardizzare dati e per confronti case-insensitive.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN stock < 10 THEN 'Low' WHEN stock < 50 THEN 'Med' ELSE 'High' END FROM Products",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Estrai Numeri (Sim)",
        descTemplate: "Dalla stringa 'Order #123', estrai '123' (Substring da pos # + 1).",
        queryTemplate: "SELECT SUBSTR('Order #123', INSTR('Order #123', '#') + 1)",
        hints: ["Trova hash", "Substr dopo hash"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT SUBSTR('Order #123', INSTR('Order #123', '#') 1)",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Nome File",
        descTemplate: "Genera 'report_2023.txt'.",
        queryTemplate: "SELECT CONCAT('report_', 2023, '.txt')",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELCET CONCAT('report_', 2023, '.txt')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Byte Size",
        descTemplate: "Lunghezza in byte (Length per charset standard).",
        queryTemplate: "SELECT LENGTH(name) FROM Users",
        hints: ["Assumiamo 1 byte char"],
        explanation: "CONCAT() unisce due o più stringhe in una sola, utile per creare campi composti come nome completo o indirizzi.",
        replacements: {},
        brokenCode: "SELCET LENGTH(name) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ultimo Spazio",
        descTemplate: "Trova posizione ultimo carattere (Length).",
        queryTemplate: "SELECT LENGTH(name) FROM Users",
        hints: ["L'ultimo indice è la lunghezza"],
        explanation: "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.",
        replacements: {},
        brokenCode: "SELCET LENGTH(name) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Centra Testo",
        descTemplate: "Simula centering (non esiste CENTER() std).",
        queryTemplate: "SELECT CONCAT('  ', name, '  ') FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "LENGTH() restituisce il numero di caratteri della stringa, utile per validazione e filtri sulla dimensione del testo.",
        replacements: {},
        brokenCode: "SELCET CONCAT('  ', name, '  ') FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Bool to Str",
        descTemplate: "Converti true/false in 'Sì'/'No'.",
        queryTemplate: "SELECT CASE WHEN is_premium THEN 'Sì' ELSE 'No' END FROM Users",
        hints: ["CASE su booleano"],
        explanation: "CONCAT() unisce due o più stringhe in una sola, utile per creare campi composti come nome completo o indirizzi.",
        replacements: {},
        brokenCode: "SELECT CASE is_premium THEN 'Sì' ELSE 'No' END FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Safe Div",
        descTemplate: "Price / Stock (Gestisci stock 0 con NULLIF e COALESCE result a 0).",
        queryTemplate: "SELECT COALESCE(price / NULLIF(stock, 0), 0) FROM Products",
        hints: ["NULLIF(stock,0)", "Div", "COALESCE(res, 0)"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELCET COALESCE(price / NULLIF(stock, 0), 0) FROM Products",
        debugHint: "Usa COALESCE + NULLIF."
      },
      {
        titleTemplate: "Logica Binaria",
        descTemplate: "Simula AND bitwise (non supportato ovunque, usa MOD/DIV).",
        queryTemplate: "SELECT id FROM Users WHERE MOD(id, 2) = 1",
        hints: ["Dispari (bit 1 settato)"],
        explanation: "Logica bitwise simulata.",
        replacements: {},
        brokenCode: "SELECT id FROM Users WERE MOD(id, 2) = 1",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Completa",
        descTemplate: "Esercizio finale riassuntivo.",
        queryTemplate: "SELECT UPPER(TRIM(name)) FROM Users",
        hints: ["Upper + Trim"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELCET UPPER(TRIM(name)) FROM Users",
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
        hints: ["C'è una funzione che restituisce l'anno da una data", "Applica la funzione alla colonna created_at"],
        explanation: "Estrae l'anno come numero a 4 cifre.",
        replacements: {},
        brokenCode: "SELECT DATE(created_at) FROM Users",
        debugHint: "YEAR() estrae l'anno, DATE() estrae la data completa."
      },
      {
        titleTemplate: "Mese Ordine",
        descTemplate: "Estrai il mese numerico (1-12) della data ordine.",
        queryTemplate: "SELECT MONTH(order_date) FROM Orders",
        hints: ["Cerca una funzione per ottenere il mese", "Il risultato deve essere un numero"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELECT MON(order_date) FROM Orders",
        debugHint: "La funzione è MONTH(), non MON."
      },
      {
        titleTemplate: "Giorno Mese",
        descTemplate: "Estrai il giorno del mese (1-31).",
        queryTemplate: "SELECT DAY(created_at) FROM Users",
        hints: ["Estrai la parte del giorno dalla data", "Funzione DAY o DAYOFMONTH"],
        explanation: "MONTH() restituisce il numero del mese (1-12) da una data, utile per analisi mensili e stagionali.",
        replacements: {},
        brokenCode: "SELCET DAY(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET MINUTE(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        hints: ["Esiste una funzione per il nome del giorno", "DAYNAME restituisce la stringa in inglese"],
        explanation: "Restituisce il nome completo del giorno in inglese.",
        replacements: {},
        brokenCode: "SELECT DAY(order_date) FROM Orders",
        debugHint: "DAY() dà il numero, DAYNAME() il nome."
      },
      {
        titleTemplate: "Nome Mese",
        descTemplate: "Ottieni il nome del mese (es. 'January').",
        queryTemplate: "SELECT MONTHNAME(created_at) FROM Users",
        hints: ["C'è una funzione speculare a DAYNAME", "Restituisce la stringa del mese in inglese"],
        explanation: "Restituisce il nome completo del mese.",
        replacements: {},
        brokenCode: "SELCET MONTHNAME(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Giorno Settimana",
        descTemplate: "Indice giorno settimana (1=Domenica, ecc. a seconda config standard).",
        queryTemplate: "SELECT DAYOFWEEK(order_date) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Restituisce un indice da 1 (Domenica) a 7 (Sabato) nello standard ODBC.",
        replacements: {},
        brokenCode: "SELCET DAYOFWEEK(order_date) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Solo Data",
        descTemplate: "Estrai solo la parte data da un datetime.",
        queryTemplate: "SELECT DATE(created_at) FROM Users",
        hints: ["Usa la funzione DATE() per troncare l'orario"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELECT created_at FROM Users",
        debugHint: "Usa DATE() per rimuovere l'orario."
      },
      {
        titleTemplate: "Anno Ordine",
        descTemplate: "Estrai l'anno in cui è stato fatto l'ordine.",
        queryTemplate: "SELECT YEAR(order_date) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Filtro per anno.",
        replacements: {},
        brokenCode: "SELCET YEAR(order_date) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Secondo",
        descTemplate: "Estrai i secondi da un timestamp.",
        queryTemplate: "SELECT SECOND(created_at) FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELCET SECOND(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ultimo Giorno Mese",
        descTemplate: "Trova l'ultimo giorno del mese per la data ordine.",
        queryTemplate: "SELECT LAST_DAY(order_date) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Restituisce la data dell'ultimo giorno del mese (es. 28, 30, 31).",
        replacements: {},
        brokenCode: "SELCET LAST_DAY(order_date) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Data e Ora",
        descTemplate: "Mostra data e ora correnti.",
        queryTemplate: "SELECT NOW()",
        hints: ["Funzione principale per timestamp corrente"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELECT DATE()",
        debugHint: "DATE() richiede un argomento o non è la funzione per 'adesso'."
      },
      {
        titleTemplate: "Giorni Trascorsi",
        descTemplate: "Che giorno dell'anno è (1-366)?",
        queryTemplate: "SELECT YEAR(NOW()) - YEAR(order_date) AS years_ago FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELECT YEAR(NOW()) - YEAR(order_date) IS years_ago FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Settimana Anno",
        descTemplate: "Numero della settimana (0-53).",
        queryTemplate: "SELECT WEEK(order_date) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET WEEK(order_date) FROM Orders",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Quarter",
        descTemplate: "Trimestre dell'ordine (1-4).",
        queryTemplate: "SELECT QUARTER(order_date) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET QUARTER(order_date) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Formatta Anno-Mese",
        descTemplate: "Stampa 'YYYY-MM' (Esercizio di estrazione, non DATE_FORMAT).",
        queryTemplate: "SELECT CONCAT(YEAR(order_date), '-', MONTH(order_date)) FROM Orders",
        hints: ["Concatena YEAR e MONTH con un trattino"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET CONCAT(YEAR(order_date), '-', MONTH(order_date)) FROM Orders",
        debugHint: "Usa CONCAT, YEAR, MONTH."
      },
      {
        titleTemplate: "Età in Anni (Approx)",
        descTemplate: "Calcola anni passati dalla creazione (Difference Year).",
        queryTemplate: "SELECT YEAR(NOW()) - YEAR(created_at) FROM Users",
        hints: ["Sottrai l'anno di creazione dall'anno corrente"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELCET YEAR(NOW()) - YEAR(created_at) FROM Users",
        debugHint: "Usa YEAR(NOW()) - YEAR(...)."
      },
      {
        titleTemplate: "Is Weekend?",
        descTemplate: "Verifica se è Domenica (DayOfWeek = 1).",
        queryTemplate: "SELECT order_date, DAYOFWEEK(order_date) = 1 as is_sunday FROM Orders",
        hints: ["DAYOFWEEK restituisce 1 per Domenica (standard ODBC)", "Confronta con 1"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELECT order_date DAYOFWEEK(order_date) = 1 as is_sunday FROM Orders",
        debugHint: "Usa DAYOFWEEK(date) = 1."
      },
      {
        titleTemplate: "Sysdate",
        descTemplate: "Alias per NOW() (spesso usato).",
        queryTemplate: "SELECT SYSDATE()",
        hints: ["Simile a NOW()"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET SYSDATE()",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Time Only",
        descTemplate: "Estrai solo la parte orario (HH:MM:SS).",
        queryTemplate: "SELECT TIME(created_at) FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Estrae orario da datetime.",
        replacements: {},
        brokenCode: "SELCET TIME(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Aggiungi 0 Giorni",
        descTemplate: "Simula identità date (per testare input).",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 0 DAY) FROM Orders",
        hints: ["DATE_ADD con 0"],
        explanation: "Operazione neutra.",
        replacements: {},
        brokenCode: "SELCET DATE_ADD(order_date, INTERVAL 0 DAY) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        brokenCode: "SELCET ADDDATE(CURDATE(), 1)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Timestamp Stringa",
        descTemplate: "Interpreta stringa come data.",
        queryTemplate: "SELECT DATE('2023-12-25')",
        hints: ["Casting implicito o funzionale"],
        explanation: "Verifica parsing.",
        replacements: {},
        brokenCode: "SELECT DATE('2023 12-25')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Primo del Mese (Logic)",
        descTemplate: "Costruisci la data del primo giorno del mese corrente.",
        queryTemplate: "SELECT CONCAT(YEAR(NOW()), '-', MONTH(NOW()), '-01')",
        hints: ["Concatena Anno, Mese e '-01'"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT CONCAT(YEAR(NOW()), ' ', MONTH(NOW()), '-01')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Giorno Precedente",
        descTemplate: "Giorno prima dell'ordine.",
        queryTemplate: "SELECT DATE_SUB(order_date, INTERVAL 1 DAY) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET DATE_SUB(order_date, INTERVAL 1 DAY) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Differenza Giorni Semplice",
        descTemplate: "Giorni tra Oggi e Ieri (sempre 1).",
        queryTemplate: "SELECT TIMESTAMPDIFF('DAY', SUBDATE(CURDATE(), 1), CURDATE())",
        hints: ["Usa TIMESTAMPDIFF('DAY', start, end) per contare i giorni"],
        explanation: "Verifica intervallo di tempo.",
        replacements: {},
        brokenCode: "SELCET TIMESTAMPDIFF('DAY', SUBDATE(CURDATE(), 1), CURDATE())",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Anno Corrente Variabile",
        descTemplate: "Seleziona solo l'anno 2023 (hardcoded per esempio).",
        queryTemplate: "SELECT 2023",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELCET 2023",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Differenza Giorni Ordine",
        descTemplate: "Giorni passati dalla data dell'ordine a oggi.",
        queryTemplate: "SELECT TIMESTAMPDIFF('DAY', order_date, NOW()) FROM Orders",
        hints: ["Usa TIMESTAMPDIFF('DAY', start, end)"],
        explanation: "Calcolo giorni trascorsi.",
        replacements: {},
        brokenCode: "SELECT NOW() - order_date FROM Orders",
        debugHint: "La sottrazione diretta non è affidabile, usa TIMESTAMPDIFF."
      },
      {
        titleTemplate: "Scadenza Ordine",
        descTemplate: "Calcola la data di scadenza (30 giorni dopo l'ordine).",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 30 DAY) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
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
        queryTemplate: "SELECT TIMESTAMPDIFF('DAY', created_at, CURDATE()) FROM Users",
        hints: ["Usa TIMESTAMPDIFF con 'DAY'"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET TIMESTAMPDIFF('DAY', created_at, CURDATE()) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ore Trascorse",
        descTemplate: "Calcola ore trascorse dalla creazione account.",
        queryTemplate: "SELECT TIMESTAMPDIFF(HOUR, created_at, NOW()) FROM Users",
        hints: ["Usa TIMESTAMPDIFF", "Unit: HOUR"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELECT MONTH(created_at) * 30 FROM Users",
        debugHint: "DATEDIFF conta solo i cambi di giorno, TIMESTAMPDIFF è più preciso per le ore."
      },
      {
        titleTemplate: "Formatta Data IT",
        descTemplate: "Data in formato 'DD/MM/YYYY'.",
        queryTemplate: "SELECT DATE_FORMAT(created_at, '%d/%m/%Y') FROM Users",
        hints: ["Usa DATE_FORMAT", "Specifier: %d/%m/%Y"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELCET DATE_FORMAT(created_at, '%d/%m/%Y') FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ultimo Giorno Mese Scorso",
        descTemplate: "Ultimo giorno del mese precedente alla creazione.",
        queryTemplate: "SELECT LAST_DAY(DATE_SUB(created_at, INTERVAL 1 MONTH)) FROM Users",
        hints: ["Sottrai 1 mese", "Applica LAST_DAY"],
        explanation: "DATE_FORMAT formatta una data secondo il pattern specificato, permettendo di visualizzare date in formati personalizzati.",
        replacements: {},
        brokenCode: "SELCET LAST_DAY(DATE_SUB(created_at, INTERVAL 1 MONTH)) FROM Users",
        debugHint: "Usa DATE_SUB poi LAST_DAY."
      },
      {
        titleTemplate: "Prossimo Lunedì",
        descTemplate: "Aggiungi giorni fino a raggiungere Lunedì (Simulazione logica).",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL (7 - WEEKDAY(created_at)) % 7 DAY) FROM Users",
        hints: ["WEEKDAY restituisce indice (0=Mon...)", "Logica modulo 7"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET DATE_ADD(created_at, INTERVAL (7 - WEEKDAY(created_at)) % 7 DAY) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Nome Mese Abbreviato",
        descTemplate: "Estrai 'Jan', 'Feb', etc.",
        queryTemplate: "SELECT SUBSTR(MONTHNAME(created_at), 1, 3) FROM Users",
        hints: ["MONTHNAME", "LEFT 3 char"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET SUBSTR(MONTHNAME(created_at), 1, 3) FROM Users",
        debugHint: "Usa MONTHNAME e LEFT."
      },
      {
        titleTemplate: "Week of Year",
        descTemplate: "Restituisci 'Week XX'.",
        queryTemplate: "SELECT CONCAT('Week ', WEEK(created_at)) FROM Users",
        hints: ["Usa PREPEND", "WEEK()"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET CONCAT('Week ', WEEK(created_at)) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Aggiungi 2 Settimane",
        descTemplate: "Aggiungi 14 giorni.",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL 2 WEEK) FROM Users",
        hints: ["INTERVAL 2 WEEK è valido in SQL std"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET DATE_ADD(created_at, INTERVAL 2 WEEK) FROM Users",
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
        descTemplate: "Converti giorni trascorsi in anni (diviso 365.25).",
        queryTemplate: "SELECT ROUND(TIMESTAMPDIFF('DAY', created_at, NOW()) / 365.25, 1) FROM Users",
        hints: ["Dividi i giorni totali per 365.25", "Arrotonda il risultato"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT ROUND(TIMESTAMPDIFF('DAY', created_at, NOW()) 365.25, 1) FROM Users",
        debugHint: "Dividi il risultato di TIMESTAMPDIFF."
      },
      {
        titleTemplate: "Anno e Mese (Intero)",
        descTemplate: "Anno e mese combinati come intero YYYYMM (es. 202301).",
        queryTemplate: "SELECT YEAR(created_at) * 100 + MONTH(created_at) FROM Users",
        hints: ["Moltiplica l'anno per 100", "Somma il mese"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELECT YEAR(created_at) 100 + MONTH(created_at) FROM Users",
        debugHint: "Usa YEAR() * 100 + MONTH()."
      },
      {
        titleTemplate: "Str to Date",
        descTemplate: "Converti '01-12-2023' in data.",
        queryTemplate: "SELECT STR_TO_DATE('01-12-2023', '%d-%m-%Y')",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELECT STR_TO_DATE('01 12-2023', '%d-%m-%Y')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Trimestre Inizio",
        descTemplate: "Primo giorno del trimestre corrente.",
        queryTemplate: "SELECT MAKEDATE(YEAR(NOW()), 1) + INTERVAL QUARTER(NOW()) * 3 - 3 MONTH",
        hints: ["Complesso: MAKEDATE anno", "Aggiungi trimestri"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT MAKEDATE(YEAR(NOW()), 1) INTERVAL QUARTER(NOW()) * 3 - 3 MONTH",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Seconda Metà Anno",
        descTemplate: "Seleziona se orario > 12:00.",
        queryTemplate: "SELECT * FROM Orders WHERE MONTH(order_date) >= 6",
        hints: ["Filtra con HOUR()"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE MONTH(order_date) <= 6",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Tempo Rimasto Anno",
        descTemplate: "Giorni alla fine dell'anno.",
        queryTemplate: "SELECT TIMESTAMPDIFF('DAY', NOW(), CONCAT(YEAR(NOW()), '-12-31'))",
        hints: ["Costruisci la data del 31 dicembre", "Usa TIMESTAMPDIFF per la differenza"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT TIMESTAMPDIFF('DAY', NOW(), CONCAT(YEAR(NOW()), ' 12-31'))",
        debugHint: "Costruisci la data target fine anno."
      },
      {
        titleTemplate: "Date Format Esteso",
        descTemplate: "Es: 'Friday, 01 January 2023'.",
        queryTemplate: "SELECT DATE_FORMAT(NOW(), '%W, %d %M %Y')",
        hints: ["%W nome giorno", "%M nome mese"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELCET DATE_FORMAT(NOW(), '%W, %d %M %Y')",
        debugHint: "Controlla gli specifier di DATE_FORMAT."
      },
      {
        titleTemplate: "Unix Timestamp",
        descTemplate: "Ottieni timestamp numerico (epoch).",
        queryTemplate: "SELECT UNIX_TIMESTAMP(created_at) FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "DATE_FORMAT formatta una data secondo il pattern specificato, permettendo di visualizzare date in formati personalizzati.",
        replacements: {},
        brokenCode: "SELCET UNIX_TIMESTAMP(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Da Epoch a Data",
        descTemplate: "Converti 1672531200 in data.",
        queryTemplate: "SELECT FROM_UNIXTIME(1672531200)",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Decodifica timestamp.",
        replacements: {},
        brokenCode: "SELCET FROM_UNIXTIME(1672531200)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Somma Ore",
        descTemplate: "Aggiungi 36 ore alla data ordine.",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 36 HOUR) FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Aritmetica oltre le 24h.",
        replacements: {},
        brokenCode: "SELCET DATE_ADD(order_date, INTERVAL 36 HOUR) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Check Data Futura",
        descTemplate: "Flag 'Future' se data > NOW().",
        queryTemplate: "SELECT CASE WHEN order_date > NOW() THEN 'Future' ELSE 'Past' END FROM Orders",
        hints: ["Confronto con NOW()", "CASE WHEN"],
        explanation: "Validazione temporale.",
        replacements: {},
        brokenCode: "SELECT CASE order_date > NOW() THEN 'Future' ELSE 'Past' END FROM Orders",
        debugHint: "Usa CASE WHEN."
      },
      {
        titleTemplate: "Intervallo Mesi",
        descTemplate: "Differenza in mesi tra la data corrente e la creazione.",
        queryTemplate: "SELECT PERIOD_DIFF(YEAR(NOW()) * 100 + MONTH(NOW()), YEAR(created_at) * 100 + MONTH(created_at)) FROM Users",
        hints: ["PERIOD_DIFF(YYYYMM, YYYYMM)", "Costruisci YYYYMM con matematica"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT PERIOD_DIFF(YEAR(NOW()) 100 + MONTH(NOW()), YEAR(created_at) * 100 + MONTH(created_at)) FROM Users",
        debugHint: "Usa PERIOD_DIFF e calcola YYYYMM."
      },
      {
        titleTemplate: "Compleanno Prossimo",
        descTemplate: "Data compleanno nell'anno corrente (Simulazione: Sostituisci anno nascita con Anno corr).",
        queryTemplate: "SELECT CONCAT(YEAR(NOW()), '-', DATE_FORMAT(created_at, '%m-%d')) FROM Users",
        hints: ["Concatena Anno Corr con Mese-Giorno nascita"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET CONCAT(YEAR(NOW()), '-', DATE_FORMAT(created_at, '%m-%d')) FROM Users",
        debugHint: "Usa CONCAT e DATE_FORMAT."
      },
      {
        titleTemplate: "Ultimo Venerdì (Sim)",
        descTemplate: "Trova data, sottrai giorni fino a Ven (Esercizio logico).",
        queryTemplate: "SELECT DATE_SUB(NOW(), INTERVAL (WEEKDAY(NOW()) + 3) % 7 DAY)",
        hints: ["Logica complessa sui giorni settimana: Weekday(Ven)=4"],
        explanation: "DATE_FORMAT formatta una data secondo il pattern specificato, permettendo di visualizzare date in formati personalizzati.",
        replacements: {},
        brokenCode: "SELECT DATE_SUB(NOW(), INTERVAL (WEEKDAY(NOW()) 3) % 7 DAY)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Data ISO",
        descTemplate: "Formatta come ISO 8601 (YYYY-MM-DDTHH:MM:SS).",
        queryTemplate: "SELECT DATE_FORMAT(NOW(), '%Y-%m-%dT%T')",
        hints: ["%T è HH:mm:ss"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET DATE_FORMAT(NOW(), '%Y-%m-%dT%T')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Secondi a Mezzanotte",
        descTemplate: "Secondi passati dall'inizio della giornata.",
        queryTemplate: "SELECT TIME_TO_SEC(TIME(NOW()))",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "DATE_FORMAT formatta una data secondo il pattern specificato, permettendo di visualizzare date in formati personalizzati.",
        replacements: {},
        brokenCode: "SELCET TIME_TO_SEC(TIME(NOW()))",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Mese Scorso Stesso Giorno",
        descTemplate: "Data oggi meno 1 mese.",
        queryTemplate: "SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH)",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET DATE_SUB(NOW(), INTERVAL 1 MONTH)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Time Delta",
        descTemplate: "Differenza tra due orari stabiliti.",
        queryTemplate: "SELECT TIMEDIFF('18:00:00', '12:00:00')",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET TIMEDIFF('18:00:00', '12:00:00')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
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
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT LAST_DAY(NOW()) + 1",
        debugHint: "Usa DATE_ADD o INTERVAL."
      },
      {
        titleTemplate: "Giorni Lavorativi (Sim)",
        descTemplate: "Filtra ordini fatti Lun-Ven (WeekDay 0-4).",
        queryTemplate: "SELECT * FROM Orders WHERE WEEKDAY(order_date) < 5",
        hints: ["WEEKDAY: 0=Mon, 4=Fri, 5=Sat, 6=Sun"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE DAYNAME(order_date) NOT IN ('Saturday', 'Sunday')",
        debugHint: "WEEKDAY è più robusto della lingua."
      },
      {
        titleTemplate: "Età Precisa (Mesi)",
        descTemplate: "Mesi totali vissuti.",
        queryTemplate: "SELECT TIMESTAMPDIFF(MONTH, created_at, NOW()) FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELCET TIMESTAMPDIFF(MONTH, created_at, NOW()) FROM Users",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Inizio Anno Fiscale",
        descTemplate: "Se l'anno fiscale inizia a Ottobre, calcola l'anno fiscale della data ordine.",
        queryTemplate: "SELECT YEAR(DATE_ADD(order_date, INTERVAL 3 MONTH)) FROM Orders",
        hints: ["Aggiungi 3 mesi per shiftare Ottobre a Gennaio", "Estrai l'anno"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELCET YEAR(DATE_ADD(order_date, INTERVAL 3 MONTH)) FROM Orders",
        debugHint: "Shifta la data."
      },
      {
        titleTemplate: "Ultimo Giorno Anno",
        descTemplate: "Calcola il 31 Dicembre dell'anno dell'ordine.",
        queryTemplate: "SELECT MAKEDATE(YEAR(order_date), 1) + INTERVAL 1 YEAR - INTERVAL 1 DAY FROM Orders",
        hints: ["MAKEDATE(Year, 1) = 1 Gen", "Aggiungi 1 anno, togli 1 giorno"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELCET MAKEDATE(YEAR(order_date), 1) + INTERVAL 1 YEAR - INTERVAL 1 DAY FROM Orders",
        debugHint: "Usa logica intervalli."
      },
      {
        titleTemplate: "Secondi a Fine Mese",
        descTemplate: "Quanti secondi rimangono alla fine del mese corrente (da NOW)?",
        queryTemplate: "SELECT TIMESTAMPDIFF(SECOND, NOW(), DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY))",
        hints: ["Diff tra NOW e Inizio prox mese", "Inizio prox mese = LAST_DAY + 1 day"],
        explanation: "YEAR() estrae il componente anno da una data, fondamentale per raggruppamenti e filtri su base annuale.",
        replacements: {},
        brokenCode: "SELCET TIMESTAMPDIFF(SECOND, NOW(), DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY))",
        debugHint: "Costruisci il target temporale."
      },
      {
        titleTemplate: "Is Leap Year?",
        descTemplate: "Verifica se l'anno corrente è bisestile (Feb ha 29 giorni).",
        queryTemplate: "SELECT DAY(LAST_DAY(CONCAT(YEAR(NOW()), '-02-01'))) = 29",
        hints: ["Costruisci data Febbraio", "Controlla LAST_DAY"],
        explanation: "TIMESTAMPDIFF calcola la differenza tra due date/timestamp nell'unità specificata (SECOND, MINUTE, HOUR, DAY, MONTH, YEAR).",
        replacements: {},
        brokenCode: "SELECT DAY(LAST_DAY(CONCAT(YEAR(NOW()), ' 02-01'))) = 29",
        debugHint: "Controlla l'ultimo giorno di Febbraio."
      },
      {
        titleTemplate: "Formatta RFC 2822",
        descTemplate: "Simile a 'Sat, 01 Jan 2023 12:00:00'.",
        queryTemplate: "SELECT DATE_FORMAT(created_at, '%a, %d %b %Y %T') FROM Users",
        hints: ["%a DayShort, %b MonthShort", "%T Time"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET DATE_FORMAT(created_at, '%a, %d %b %Y %T') FROM Users",
        debugHint: "Controlla gli specifier."
      },
      {
        titleTemplate: "Data Ordine Spostata",
        descTemplate: "Sposta la data ordine al lunedì della stessa settimana.",
        queryTemplate: "SELECT DATE_SUB(order_date, INTERVAL WEEKDAY(order_date) DAY) FROM Orders",
        hints: ["Sottrai WEEKDAY giorni"],
        explanation: "DATE_FORMAT formatta una data secondo il pattern specificato, permettendo di visualizzare date in formati personalizzati.",
        replacements: {},
        brokenCode: "SELCET DATE_SUB(order_date, INTERVAL WEEKDAY(order_date) DAY) FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Aggrega per Mese-Anno",
        descTemplate: "Conta ordini per ogni Mese-Anno (es. '2023-01').",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') as periodo, COUNT(*) FROM Orders GROUP BY periodo",
        hints: ["GROUP BY su stringa formattata"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELECT DATE_FORMAT(order_date, '%Y-%m') IS periodo, COUNT(*) FROM Orders GROUP BY periodo",
        debugHint: "Usa DATE_FORMAT nel Select e Group By."
      },
      {
        titleTemplate: "Trimestre Corrente (Date)",
        descTemplate: "Data inizio trimestre corrente.",
        queryTemplate: "SELECT MAKEDATE(YEAR(NOW()), 1) + INTERVAL QUARTER(NOW()) * 3 - 3 MONTH",
        hints: ["Già visto in Medium? Ripasso logica complessa"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT MAKEDATE(YEAR(NOW()), 1) INTERVAL QUARTER(NOW()) * 3 - 3 MONTH",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Diff Ore Lavorative (Sim)",
        descTemplate: "Diff ore ma assumendo 8h al giorno (moltiplica giorni * 8).",
        queryTemplate: "SELECT YEAR(NOW()) - YEAR(created_at) FROM Users",
        hints: ["DATEDIFF * 8"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET YEAR(NOW()) - YEAR(created_at) FROM Users",
        debugHint: "Moltiplica i giorni."
      },
      {
        titleTemplate: "Convert Timezone",
        descTemplate: "Simula conversione UTC a CET (+1).",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL 1 HOUR) FROM Users",
        hints: ["Aggiungi 1 ora"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELCET DATE_ADD(created_at, INTERVAL 1 HOUR) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Prossimo Compleanno (Giorni)",
        descTemplate: "Giorni mancanti al prossimo compleanno (Logica complessa).",
        queryTemplate: "SELECT MONTH(created_at) * 30 FROM Users",
        hints: ["Se compleanno passato, target year = year+1", "Costruisci target date"],
        explanation: "Logica condizionale su date.",
        replacements: {},
        brokenCode: "SELECT MONTH(created_at) 30 FROM Users",
        debugHint: "Gestisci anno corrente vs prossimo."
      },
      {
        titleTemplate: "Giorni Trascorsi da Creazione",
        descTemplate: "Converti in Julian Day number.",
        queryTemplate: "SELECT YEAR(NOW()) - YEAR(created_at) FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "MONTH() restituisce il numero del mese (1-12) da una data, utile per analisi mensili e stagionali.",
        replacements: {},
        brokenCode: "SELCET YEAR(NOW()) - YEAR(created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "From Julian",
        descTemplate: "Riconverti numero giorni in data.",
        queryTemplate: "SELECT DATE_ADD('0000-01-01', INTERVAL 738500 DAY)",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELECT DATE_ADD('0000 01-01', INTERVAL 738500 DAY)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Aggrega per Giorno Week",
        descTemplate: "Conta utenti creati per giorno della settimana.",
        queryTemplate: "SELECT DAYNAME(created_at), COUNT(*) FROM Users GROUP BY DAYNAME(created_at)",
        hints: ["Raggruppa per la colonna DAYNAME", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "SELECT DAYNAME(created_at), COUNT(*) FROM Users GROUP DAYNAME(created_at)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Sec to Time Esteso",
        descTemplate: "Converti 100000 secondi in orario (può superare 24h).",
        queryTemplate: "SELECT TIME(FROM_UNIXTIME(100000))",
        hints: ["Seleziona dalla tabella tabella", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELCET TIME(FROM_UNIXTIME(100000))",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Percentuale anno",
        descTemplate: "Quanto % dell'anno è passato?",
        queryTemplate: "SELECT ROUND(MONTH(created_at) / 12 * 100, 2) FROM Users",
        hints: ["DayOfYear / 365 * 100"],
        explanation: "Statistica temporale.",
        replacements: {},
        brokenCode: "SELECT ROUND(MONTH(created_at) 12 * 100, 2) FROM Users",
        debugHint: "Dividi e moltiplica."
      },
      {
        titleTemplate: "Nullific Date",
        descTemplate: "Usa NULLIF se la data è '0000-00-00' (simulazione).",
        queryTemplate: "SELECT NULLIF(order_date, '0000-00-00') FROM Orders",
        hints: ["Seleziona dalla tabella Orders", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "MONTH() restituisce il numero del mese (1-12) da una data, utile per analisi mensili e stagionali.",
        replacements: {},
        brokenCode: "SELECT NULLIF(order_date, '0000 00-00') FROM Orders",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Coalesce Dates",
        descTemplate: "Se updated_at è NULL, usa created_at.",
        queryTemplate: "SELECT COALESCE(updated_at, created_at) FROM Users",
        hints: ["Seleziona dalla tabella Users", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
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
        brokenCode: "SELCET TIMEDIFF(updated_at, created_at) FROM Users",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Aggiungi Minuti Variabili",
        descTemplate: "Aggiungi N minuti dove N = id utente.",
        queryTemplate: "SELECT DATE_ADD(created_at, INTERVAL id MINUTE) FROM Users",
        hints: ["INTERVAL col_name MINUTE"],
        explanation: "Intervallo dinamico.",
        replacements: {},
        brokenCode: "SELCET DATE_ADD(created_at, INTERVAL id MINUTE) FROM Users",
        debugHint: "Puoi usare colonne nell'INTERVAL."
      },
      {
        titleTemplate: "Week Mode 1",
        descTemplate: "Week number dove Lunedì è primo giorno.",
        queryTemplate: "SELECT WEEK(order_date, 1) FROM Orders",
        hints: ["WEEK(date, mode)", "Mode 1 = Monday first"],
        explanation: "Standard ISO-like.",
        replacements: {},
        brokenCode: "SELCET WEEK(order_date, 1) FROM Orders",
        debugHint: "Usa secondo argomento di WEEK."
      },
      {
        titleTemplate: "Strano Formato",
        descTemplate: "Converti '2023.12.31' in data.",
        queryTemplate: "SELECT STR_TO_DATE('2023.12.31', '%Y.%m.%d')",
        hints: ["Specifier con punti"],
        explanation: "Le funzioni di data SQL permettono di estrarre, calcolare e formattare componenti temporali per analisi cronologiche.",
        replacements: {},
        brokenCode: "SELCET STR_TO_DATE('2023.12.31', '%Y.%m.%d')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Ultimo Secondo Giorno",
        descTemplate: "Imposta orario a 23:59:59.",
        queryTemplate: "SELECT CONCAT(DATE(NOW()), ' 23:59:59')",
        hints: ["Concatena Data e orario fisso"],
        explanation: "Fine giornata.",
        replacements: {},
        brokenCode: "SELCET CONCAT(DATE(NOW()), ' 23:59:59')",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Cast Datetime",
        descTemplate: "Cast stringa esplicito (CAST .. AS DATETIME).",
        queryTemplate: "SELECT CAST('2023-01-01 12:00:00' AS DATETIME)",
        hints: ["CAST(str AS TYPE)"],
        explanation: "NOW() restituisce la data e ora correnti del server, utile per calcoli relativi al presente.",
        replacements: {},
        brokenCode: "SELECT CAST('2023-01-01 12:00:00' IS DATETIME)",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Mixed Add",
        descTemplate: "Aggiungi 1 anno e 2 mesi.",
        queryTemplate: "SELECT DATE_ADD(DATE_ADD(created_at, INTERVAL 1 YEAR), INTERVAL 2 MONTH) FROM Users",
        hints: ["Chaining di DATE_ADD"],
        explanation: "Le espressioni aritmetiche in SQL permettono di creare colonne calcolate al volo, combinando valori delle colonne con operatori matematici.",
        replacements: {},
        brokenCode: "DATE_ADD(..., INTERVAL 1 YEAR 2 MONTH)",
        debugHint: "DATE_ADD accetta un solo interval expression standard alla volta (o sintassi composta specifica non portabile)."
      },
      {
        titleTemplate: "Median Date (Sim)",
        descTemplate: "Seleziona data intermedia tra start e now.",
        queryTemplate: "SELECT YEAR(created_at) / 2 AS median_years FROM Users",
        hints: ["Meta differenza giorni aggiunta a start"],
        explanation: "Calcolo punto medio temporale.",
        replacements: {},
        brokenCode: "SELECT YEAR(created_at) / 2 IS median_years FROM Users",
        debugHint: "Calcola diff, dividi, aggiungi."
      }
    ],
  },
  [TopicId.Case]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Priorità di Rifornimento",
        descTemplate: "Assegna una priorità al rifornimento dei prodotti: se le scorte sono a 0 indica 'Critico', se sono uguali o inferiori a 10 'Riordino', altrimenti 'Ottimale'.",
        queryTemplate: "SELECT name, stock, CASE WHEN stock = 0 THEN 'Critico' WHEN stock <= 10 THEN 'Riordino' ELSE 'Ottimale' END as livello_scorte FROM Products",
        hints: ["Usa CASE WHEN con condizioni a cascata", "L'ordine delle condizioni è importante"],
        explanation: "Il costrutto CASE valuta le condizioni nell'ordine in cui sono scritte. La prima condizione vera determina il risultato.",
        replacements: {},
        brokenCode: "SELECT name, stock, CASE WHEN stock <= 10 THEN 'Riordino' WHEN stock = 0 THEN 'Critico' ELSE 'Ottimale' END as livello_scorte FROM Products",
        debugHint: "Attenzione all'ordine logico: se metti prima <= 10, la condizione = 0 non verrà mai raggiunta perché 0 è minore o uguale a 10."
      },
      {
        titleTemplate: "Classificazione Clienti",
        descTemplate: "Suddividi i clienti in due categorie: se hanno un abbonamento premium visualizza 'Cliente VIP', altrimenti 'Cliente Standard'.",
        queryTemplate: "SELECT name, CASE WHEN is_premium = true THEN 'Cliente VIP' ELSE 'Cliente Standard' END as tipo_cliente FROM Users",
        hints: ["Il campo is_premium è booleano (true/false)", "Usa THEN e ELSE"],
        explanation: "CASE permette di trasformare flag binari (boolean) in etichette testuali più esplicative per i report.",
        replacements: {},
        brokenCode: "SELECT name, CASE IF is_premium = true THEN 'Cliente VIP' ELSE 'Cliente Standard' END as tipo_cliente FROM Users",
        debugHint: "La sintassi è CASE WHEN, non CASE IF."
      },
      {
        titleTemplate: "Segmentazione Spedizioni",
        descTemplate: "Classifica le spedizioni in base al totale dell'ordine: gli ordini pari o superiori a 1000 ottengono la 'Spedizione Omaggio', gli altri la 'Spedizione Standard'.",
        queryTemplate: "SELECT id as order_id, order_total, CASE WHEN order_total >= 1000 THEN 'Spedizione Omaggio' ELSE 'Spedizione Standard' END as tipo_spedizione FROM Orders",
        hints: ["Confronta order_total con 1000 usando l'operatore di disuguaglianza adeguato"],
        explanation: "Puoi generare nuove colonne virtuali che applicano logiche di business basate su soglie numeriche.",
        replacements: {},
        brokenCode: "SELECT id as order_id, order_total, CASE order_total >= 1000 THEN 'Spedizione Omaggio' ELSE 'Spedizione Standard' FROM Orders",
        debugHint: "Manca la clausola WHEN prima della condizione logica e la parola chiave END alla chiusura."
      },
      {
        titleTemplate: "Traduzione Stati Ordine",
        descTemplate: "Italianizza gli stati degli ordini per il front-end: traduci 'Delivered' in 'Consegnato', 'Shipped' in 'Spedito' e raggruppa tutti gli altri stati in 'In Lavorazione'.",
        queryTemplate: "SELECT id, status, CASE WHEN status = 'Delivered' THEN 'Consegnato' WHEN status = 'Shipped' THEN 'Spedito' ELSE 'In Lavorazione' END as stato_it FROM Orders",
        hints: ["Usa condizioni multiple all'interno del blocco CASE"],
        explanation: "Utile per creare livelli di visualizzazione e localizzare o semplificare nomenclature applicative direttamente a livello di query.",
        replacements: {},
        brokenCode: "SELECT id, status, CASE status = 'Delivered' AND 'Consegnato' status = 'Shipped' AND 'Spedito' ELSE 'In Lavorazione' END as stato_it FROM Orders",
        debugHint: "La sintassi richiede l'uso della dicitura WHEN [condizione] THEN [risultato]."
      },
      {
        titleTemplate: "Categorizzazione Analitica",
        descTemplate: "Mappa i prodotti per le analisi contabili: se un prodotto appartiene alla categoria 'Electronics' segnalo come 'Dipartimento Tech', altrimenti raggruppalo come 'Dipartimento Generico'.",
        queryTemplate: "SELECT name, category, CASE WHEN category = 'Electronics' THEN 'Dipartimento Tech' ELSE 'Dipartimento Generico' END as dipartimento FROM Products",
        hints: ["Usa un semplice confronto testuale sulla colonna category"],
        explanation: "Il CASE permette non solo di cambiare nome a categorie esistenti, ma di aggregarle in macro-sezioni.",
        replacements: {},
        brokenCode: "SELECT name, category, CASE WHEN category IS 'Electronics' THEN 'Dipartimento Tech' ELSE 'Dipartimento Generico' END as dipartimento FROM Products",
        debugHint: "Per l'uguaglianza tra stringhe si usa l'operatore '=', l'operatore IS si utilizza tipicamente per i controlli sui valori NULL."
      },
      {
        titleTemplate: "Report Gerarchico",
        descTemplate: "Genera un semplice report risorse umane: se la matricola (id) non ha un manager associato (manager_id), identificalo come 'Dirigente', altrimenti come 'Dipendente'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'Dirigente' ELSE 'Dipendente' END as ruolo_aziendale FROM Employees",
        hints: ["Come si verifica se un campo è vuoto in SQL?", "Usa IS NULL"],
        explanation: "I test sui valori mancanti sono importantissimi per le logiche condizionali aziendali, permettendo di identificare apicalità aziendali.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN manager_id = NULL THEN 'Dirigente' ELSE 'Dipendente' END as ruolo_aziendale FROM Employees",
        debugHint: "In SQL, l'operazione di uguaglianza standard (=) fallisce contro il valore NULL. L'unico modo corretto è usare l'operatore IS NULL."
      },
      {
        titleTemplate: "Screening Contatti",
        descTemplate: "Il marketing vuole segmentare il database: se l'email termina con '.com' considera l'origine come 'Internazionale', altrimenti 'Locale'.",
        queryTemplate: "SELECT name, email, CASE WHEN email LIKE '%.com' THEN 'Internazionale' ELSE 'Locale' END as origine_contatto FROM Users",
        hints: ["Verifica le stringhe con il Pattern Matching (LIKE)"],
        explanation: "All'interno del blocco CASE si possono inserire espressioni complesse, incluse operazioni stringa e match.",
        replacements: {},
        brokenCode: "SELECT name, email, CASE WHEN email = '%.com' THEN 'Internazionale' ELSE 'Locale' END as origine_contatto FROM Users",
        debugHint: "L'operatore = non valuta le wildcard (%). Usa l'operatore consono per effettuare le ricerche basate su pattern (text-matching)."
      },
      {
        titleTemplate: "Audit Anagrafiche",
        descTemplate: "Estrai uno stato per il Quality Assurance: se l'utente non ha impostato un'email (NULL), l'utente ha 'Dati Incompleti', altrimenti possiede un 'Profilo Valido'.",
        queryTemplate: "SELECT name, CASE WHEN email IS NULL THEN 'Dati Incompleti' ELSE 'Profilo Valido' END as stato_profilo FROM Users",
        hints: ["Individua lo stato dei valori nulli"],
        explanation: "I blocchi logici vengono ampiamente utilizzati dai reparti dati per pulire anomalie (data cleaning) o assegnare Quality scores.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN email = '' THEN 'Dati Incompleti' ELSE 'Profilo Valido' END as stato_profilo FROM Users",
        debugHint: "Essere vuoto (stringa vuota) è diverso dall'essere non inserito o inesistente (NULL)."
      },
      {
        titleTemplate: "Valutazione Asset Magazzino",
        descTemplate: "L'ufficio acquisti richiede di pesare il magazzino: calcola se il prodotto tra prezzo e giacenza sviluppa un controvalore maggiore di 5000 come 'Asset Primario', altrimenti come 'Asset Secondario'.",
        queryTemplate: "SELECT name, price, stock, CASE WHEN price * stock > 5000 THEN 'Asset Primario' ELSE 'Asset Secondario' END as importanza_asset FROM Products",
        hints: ["Puoi combinare espressioni matematiche all'interno della condizione logica"],
        explanation: "Oltre ai semplici confronti, SQL può elaborare operazioni aritmetiche interne per derivare un responso condizionale istantaneo.",
        replacements: {},
        brokenCode: "SELECT name, price, stock, CASE price * stock > 5000 THEN 'Asset Primario' ELSE 'Asset Secondario' END as importanza_asset FROM Products",
        debugHint: "Prendi nota che la forma richiede specificatamente la parola WHEN davanti alle singole condizioni che decidi di applicare."
      },
      {
        titleTemplate: "Verifica Eleggibilità Sconti",
        descTemplate: "Controlla le singole righe d'ordine: se la quantità (quantity) è uguale o superiore a 10, segnala che lo stato d'ordine è 'Sconto Quantità Applicabile', altrimenti è a 'Prezzo Pieno'.",
        queryTemplate: "SELECT order_id, product_id, CASE WHEN quantity >= 10 THEN 'Sconto Quantità Applicabile' ELSE 'Prezzo Pieno' END as promo_status FROM OrderItems",
        hints: ["Controlla contemporaneamente due opzioni in un unico operatore di disuguaglianza maggiore o uguale"],
        explanation: "Le flag sui raggruppamenti d'acquisto delineano trigger fondamentali per applicativi E-commerce.",
        replacements: {},
        brokenCode: "SELECT order_id, product_id, CASE WHEN quantity > 10 THEN 'Sconto Quantità Applicabile' ELSE 'Prezzo Pieno' END as promo_status FROM OrderItems",
        debugHint: "La richiesta parlava in modo esplicito di uguale o superiore a 10, quindi l'operatore utilizzato non copre il caso dell'uguaglianza."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Analisi Redditività Portafoglio",
        descTemplate: "Per supportare le riunioni trimestrali, crea tre segmenti di prezzo per i prodotti: meno di 50 come 'High Volume', tra 50 e 500 inclusi come 'Core Business', e sopra i 500 come 'Premium'.",
        queryTemplate: "SELECT name, price, CASE WHEN price < 50 THEN 'High Volume' WHEN price <= 500 THEN 'Core Business' ELSE 'Premium' END as segmento_vendita FROM Products",
        hints: ["L'ordine in cui si pongono le condizioni in SQL determina il loro flusso d'esecuzione."],
        explanation: "È possibile usare blocchi WHEN in cascata per simulare range multipli, senza ripetere gli step coperti dalle dichiarazioni temporali vicine.",
        replacements: {},
        brokenCode: "SELECT name, price, CASE WHEN price <= 500 THEN 'Core Business' WHEN price < 50 THEN 'High Volume' ELSE 'Premium' END as segmento_vendita FROM Products",
        debugHint: "Un prodotto a prezzo 20 rientra in 'Core Business' se poniamo prima la condizione <=500 chiudendo il blocco logico prima di arrivare alla soglia del suo segmento."
      },
      {
        titleTemplate: "Priorità Logistica Personalizzata",
        descTemplate: "Ordina gli ordini garantendo precedenza esecutiva per status: prima i 'Processing', poi gli 'Shipped', e infine tutti gli altri in fondo. (Includi l'ordinamento nativo su order_date ASC a parità di priorità).",
        queryTemplate: "SELECT id, status, order_date FROM Orders ORDER BY CASE WHEN status = 'Processing' THEN 1 WHEN status = 'Shipped' THEN 2 ELSE 3 END, order_date ASC",
        hints: ["Inserisci il CASE all'interno della clausola ORDER BY mappando gli stati testuali ordinandoli come interi o booleani"],
        explanation: "Usa il CASE WHEN senza alias se lo scopo è esclusivamente logistico ed in backend invisibile per riordinare valori categorici.",
        replacements: {},
        brokenCode: "SELECT id, status, order_date FROM Orders ORDER BY CASE WHEN status = 'Processing' THEN 1 WHEN status = 'Shipped' THEN 2 ELSE 3 END",
        debugHint: "Devi prevedere il criterio di spareggio secondario sulla data previsto."
      },
      {
        titleTemplate: "Deleghe Referenziali Operative",
        descTemplate: "Estrai il report dei referenti operativi (Coalesce): mostra il nome del dipendente e l'ID del proprio manager in una colonna logica 'referente_operativo'. Se un utente non ha un manager, estrai l'id del dipendente stesso.",
        queryTemplate: "SELECT name, COALESCE(manager_id, id) as referente_operativo FROM Employees",
        hints: ["COALESCE è una funzione di fallback essenziale nei raggruppamenti"],
        explanation: "COALESCE ritorna per natura il primo record o la prima colonna della sua firma (signature) che non sia a valore NULL (Fallback logic).",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN manager_id = NULL THEN id ELSE manager_id END as referente_operativo FROM Employees",
        debugHint: "Potresti teoricamente usare un CASE con operatore IS NULL, ma qui la best practice raccomandata e la soluzione implementativa impiega COALESCE."
      },
      {
        titleTemplate: "Difesa Frazionaria Errori",
        descTemplate: "L'ufficio auditing vuole il rendimento potenziale (price / stock). Poichè si generano errori matematici con stock a 0, rendivi a valore scalare la divisione impedendola tramite NULLIF se la metrica è 0.",
        queryTemplate: "SELECT name, price / NULLIF(stock, 0) as valore_unitario_reale FROM Products",
        hints: ["Evitare la sintesi division by zero"],
        explanation: "NULLIF in SQL agisce fornendo un NULL al denominatore quando la condizione è echeggiata (0).",
        replacements: {},
        brokenCode: "SELECT name, price / CASE WHEN stock = 0 THEN 1 ELSE stock END as valore_unitario_reale FROM Products",
        debugHint: "Dividerlo matematicamente con l'if falso mutando lo zero in 1 distorce irrimediabilmente i dati effettivi. È appropriato impiegare logiche SQL nativamente preposte alla manipolazione dello zero come denumeratore."
      },
      {
        titleTemplate: "Pipeline KPI Esecutivi",
        descTemplate: "Riassumi il tracking macro di settore: gli ordini in status 'Processing' e 'Shipped' devono concorrere congiuntamente nel subset formale 'In Corso'. Qualunque altra sigla sarà 'Completato'.",
        queryTemplate: "SELECT id, CASE WHEN status IN ('Processing', 'Shipped') THEN 'In Corso' ELSE 'Completato' END as macro_fase FROM Orders",
        hints: ["Evitare l'utilizzo sintattico ingrossato con multipli operatori logici OR se lo spread di dati ricade all'interno del proprio set operatore IN()"],
        explanation: "Le metriche macro che agglomerano svariate varibili puntiformi sono routine ordinaria in data engineering.",
        replacements: {},
        brokenCode: "SELECT id, CASE WHEN status = 'Processing' AND status = 'Shipped' THEN 'In Corso' ELSE 'Completato' END as macro_fase FROM Orders",
        debugHint: "Due stati diversi mutamente esclusivi nel corso logico della riga rendono la tua condizione AND logicamente preclusiva sempre (condizione irraggiungibile)."
      },
      {
        titleTemplate: "Calcolo Tariffario Multisoglia",
        descTemplate: "Calcola le spese di spedizione: gli ordini oltre o pari ai 1000 inclusi sono gratuiti (0), ordini sopra o pari ai 100 euro pagano 15.50, tutti gli altri pagheranno 25.00 d'assicurata.",
        queryTemplate: "SELECT id, order_total, CASE WHEN order_total >= 1000 THEN 0 WHEN order_total >= 100 THEN 15.50 ELSE 25.00 END as costo_spedizione FROM Orders",
        hints: ["Attenzione alle zone logiche per le esclusioni marginali di scalettatura."],
        explanation: "Simulazione formale di un motore contabile basico in estrazione database (pricing dinamico).",
        replacements: {},
        brokenCode: "SELECT id, order_total, CASE WHEN order_total >= 100 THEN 15.50 WHEN order_total >= 1000 THEN 0 ELSE 25.00 END as costo_spedizione FROM Orders",
        debugHint: "Invertendo l'ordine, i casi oltre i 1000 euro matureranno comunque il tariffario da 15.50 bloccando la discesa."
      },
      {
        titleTemplate: "Dashboard Cohort Seniority",
        descTemplate: "Crea bucket analitici per retention clienti: in base a created_at gli iscritti strettamente antecedenti al 2023 sono 'Legacy User', iscritti prima del 2024 'Established User', i restanti 'New User'.",
        queryTemplate: "SELECT name, CASE WHEN created_at < '2023-01-01' THEN 'Legacy User' WHEN created_at < '2024-01-01' THEN 'Established User' ELSE 'New User' END as cohort FROM Users",
        hints: ["Considera che i tag orari/data in questo formattato scenario sono processabili come string format."],
        explanation: "I cohort operazionali dipendono criticamente e massivamente dalle conversioni del timing log in string matching classici.",
        replacements: {},
        brokenCode: "SELECT name, CASE WHEN created_at <= '2023-01-01' THEN 'Legacy User' WHEN created_at < '2024-01-01' THEN 'Established User' ELSE 'New User' END as cohort FROM Users",
        debugHint: "Inserendo l'uguale comprendi implicitamente il primo giorno dell'anno corrente per la fase Legacy scombinando internazionalmente le regole delle dashboard mensili comparative."
      },
      {
        titleTemplate: "Simulazione Pricing Dinamico",
        descTemplate: "Prevedi e modella estensivamente rialzi di scaglione pre-season: se il prodotto appartiene a 'Electronics' rincara del 15% (price * 1.15), in caso 'Furniture' rincara del 5% (price * 1.05), per i restanti inviati stazionari (solo price).",
        queryTemplate: "SELECT name, price as current_price, CASE WHEN category = 'Electronics' THEN price * 1.15 WHEN category = 'Furniture' THEN price * 1.05 ELSE price END as projected_price FROM Products",
        hints: ["Effettua il rate math sui ratei singolarmente."],
        explanation: "Le alterazioni algoritmiche dei prezzi di un'API sono in vari modelli demandate all'elaboratore SQL per ridurre la banda trasmissiva applicativa.",
        replacements: {},
        brokenCode: "SELECT name, price as current_price, CASE WHEN category = 'Electronics' THEN price + 15 WHEN category = 'Furniture' THEN price + 5 ELSE price END as projected_price FROM Products",
        debugHint: "Operi matematicamente aggiungendo un valore fisso (+15) anziché una rintacciatura percentuale per la moltiplicazione."
      },
      {
        titleTemplate: "Gestore Nomenclatura Anonimizzata",
        descTemplate: "Anonimizza i risultati estrattivi. Quando il nominativo dell'utente è esistente, formatta e visualizzalo come formattato testualmente in 'Utente: {nome}', nei casi mancanti/nulli apponici stringa standard costrutta per includere il codice 'Utente Anonimo ({id})'.",
        queryTemplate: "SELECT CASE WHEN name IS NOT NULL THEN 'Utente: ' || name ELSE 'Utente Anonimo (' || id || ')' END as display_name FROM Users",
        hints: ["Usa l'operatore di concatenazione testuale ||"],
        explanation: "La composizione testuale combinata a filtri garantisce astrazioni efficaci per API o esportazioni semi chiuse e blind-anonymization logica.",
        replacements: {},
        brokenCode: "SELECT CASE WHEN name IS NULL THEN 'Utente: ' || name ELSE 'Utente Anonimo (' || id || ')' END as display_name FROM Users",
        debugHint: "Le tue condizionali procedurali per l'inclusione logica IS NULL avvengono logicamente in verso invertito causando un concatenamento su una stringa nulla."
      },
      {
        titleTemplate: "Motore Premio Produzione Aggregato",
        descTemplate: "Un Modulatore valuta tutti i dipendenti aziendali: il dipendente 'Sales' assunto antecedentemente il 2022 percepisce aumento base su salary fissa +10%, membri del distretto 'IT' (indebitati alle tempistiche) un flat +5%, i restanti stabili.",
        queryTemplate: "SELECT name, salary, CASE WHEN department = 'Sales' AND hire_date < '2022-01-01' THEN salary * 1.10 WHEN department = 'IT' THEN salary * 1.05 ELSE salary END as nuovo_stipendio FROM Employees",
        hints: ["I controlli logici incrociati necessitano l'operatore AND"],
        explanation: "La clausola multifunzione WHEN gestisce l'incrocio dimensionale tra i flag dipartimanentali di competenza ed i ratei orario-temporali assuntivi logici.",
        replacements: {},
        brokenCode: "SELECT name, salary, CASE WHEN (department = 'Sales' OR hire_date < '2022-01-01') THEN salary * 1.10 WHEN department = 'IT' THEN salary * 1.05 ELSE salary END as nuovo_stipendio FROM Employees",
        debugHint: "Usi l'operatore matematicamente sbagliato (OR) ed in questo modo assegnerai fondi a casaccio."
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
        brokenCode: "SELECT u.id, CASE WHEN SUM(o.order_total) > 1000 THEN 'VIP' ELSE 'Regular' END IS segment FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.id",
        debugHint: "CASE WHEN SUM(...) > 1000."
      },
      {
        titleTemplate: "Analisi Cohort",
        descTemplate: "Raggruppa utenti per anno di iscrizione: 'Cohort 2022', 'Cohort 2023', etc.",
        queryTemplate: "SELECT CASE WHEN created_at >= '2022-01-01' AND created_at < '2023-01-01' THEN '2022' WHEN created_at >= '2023-01-01' THEN '2023' ELSE 'Pre-2022' END as cohort, COUNT(*) FROM Users GROUP BY 1",
        hints: ["GROUP BY 1 raggruppa per la prima colonna (il CASE)", "Definisci i range temporali"],
        explanation: "Creazione di gruppi logici basati su date.",
        replacements: {},
        brokenCode: "SELECT CASE WHEN created_at >= '2022-01-01' AND created_at < '2023-01-01' THEN '2022' WHEN created_at >= '2023-01-01' THEN '2023' ELSE 'Pre-2022' END IS cohort, COUNT(*) FROM Users GROUP BY 1",
        debugHint: "Usa i riferimenti posizionali nel GROUP BY o ripeti il CASE."
      },
      {
        titleTemplate: "Priorità Restock",
        descTemplate: "Complex Priority: Critical (stock<5 AND price>100), Urgent (stock<10), Normal.",
        queryTemplate: "SELECT name, CASE WHEN stock < 5 AND price > 100 THEN 'Critical' WHEN stock < 10 THEN 'Urgent' ELSE 'Normal' END as priority FROM Products",
        hints: ["Logica annidata o sequenziale", "Critical ha due condizioni AND"],
        explanation: "Matrice di decisione basata su più variabili.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN stock < 5 AND price > 100 THEN 'Critical' WHEN stock < 10 THEN 'Urgent' ELSE 'Normal' END as priority FROM Products",
        debugHint: "Verifica prima la condizione più specifica (Critical)."
      },
      {
        titleTemplate: "Sconto Dinamico",
        descTemplate: "Calcola nuovo prezzo: -10% se stock > 100, -5% se category='Home', else full price.",
        queryTemplate: "SELECT name, price * (CASE WHEN stock > 100 THEN 0.9 WHEN category = 'Home' THEN 0.95 ELSE 1 END) as promo_price FROM Products",
        hints: ["Il CASE restituisce il moltiplicatore", "Moltiplica price per il risultato del CASE"],
        explanation: "Applicazione di regole di pricing complesse.",
        replacements: {},
        brokenCode: "SELECT name price * (CASE WHEN stock > 100 THEN 0.9 WHEN category = 'Home' THEN 0.95 ELSE 1 END) as promo_price FROM Products",
        debugHint: "Price * CASE ..."
      },
      {
        titleTemplate: "Performance Spedizioni",
        descTemplate: "Calcola tempo spedizione stimato: se status 'Shipped' -> 'In Transito', Delivered -> 'Chiuso', Processing + data vecchia -> 'In Ritardo'.",
        queryTemplate: "SELECT id, CASE WHEN status = 'Delivered' THEN 'Chiuso' WHEN status = 'Processing' AND order_date < '2023-01-01' THEN 'In Ritardo' ELSE 'In Corso' END as kpi FROM Orders",
        hints: ["Combina status e date"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id CASE WHEN status = 'Delivered' THEN 'Chiuso' WHEN status = 'Processing' AND order_date < '2023-01-01' THEN 'In Ritardo' ELSE 'In Corso' END as kpi FROM Orders",
        debugHint: "Status = 'Processing' AND date < ..."
      },
      {
        titleTemplate: "Bundle Mix",
        descTemplate: "Classifica ordini: 'Solo Tech' se ha solo Electronics, 'Misto' se ha altro.",
        queryTemplate: "SELECT o.id, CASE WHEN MIN(p.category) = 'Electronics' AND MAX(p.category) = 'Electronics' THEN 'Solo Tech' ELSE 'Misto' END as mix FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id",
        hints: ["Se MIN(cat) == MAX(cat) == 'Electronics', allora ci sono solo prodotti Electronics", "Serve tripla JOIN"],
        explanation: "Logica avanzata sugli insiemi tramite aggregazione.",
        replacements: {},
        brokenCode: "SELECT o.id, CASE WHEN MIN(p.category) = 'Electronics' AND MAX(p.category) = 'Electronics' THEN 'Solo Tech' ELSE 'Misto' END IS mix FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id",
        debugHint: "MIN/MAX su stringhe aiutano a capire l'omogeneità."
      },
      {
        titleTemplate: "Math Safety",
        descTemplate: "Calcola ROI: (Price - 50) / Price. Gestisci divisione per zero e casi negativi (ROI 0).",
        queryTemplate: "SELECT name, CASE WHEN price = 0 THEN 0 WHEN (price - 50) < 0 THEN 0 ELSE (price - 50) / price END as roi FROM Products",
        hints: ["Gestisci denominatore zero", "Gestisci numeratore negativo"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN price = 0 THEN 0 WHEN (price - 50) < 0 THEN 0 ELSE (price - 50) / price END as roi FROM Products",
        debugHint: "Prima controlla price = 0."
      },
      {
        titleTemplate: "User Score",
        descTemplate: "Score utente: +10 punti se Premium, +1 punto per ogni ordine.",
        queryTemplate: "SELECT u.email, (CASE WHEN is_premium THEN 10 ELSE 0 END) + (SELECT COUNT(*) FROM Orders WHERE user_id = u.id) as score FROM Users u",
        hints: ["Subquery scalare sommata a un CASE", "Oppure JOIN e GROUP BY"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT u.email, (CASE WHEN is_premium THEN 10 ELSE 0 END) + (SELECT COUNT(*) FROM Orders WHERE user_id = u.id) IS score FROM Users u",
        debugHint: "Somma i due contributi."
      },
      {
        titleTemplate: "Pivot Categorie",
        descTemplate: "Conta quanti prodotti 'Electronics' e quanti 'Home' per ogni ordine.",
        queryTemplate: "SELECT order_id, SUM(CASE WHEN category = 'Electronics' THEN 1 ELSE 0 END) as tech_items, SUM(CASE WHEN category = 'Home' THEN 1 ELSE 0 END) as home_items FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY order_id",
        hints: ["Tipico pivoting", "Join necessaria per category"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT order_id SUM(CASE WHEN category = 'Electronics' THEN 1 ELSE 0 END) as tech_items, SUM(CASE WHEN category = 'Home' THEN 1 ELSE 0 END) as home_items FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY order_id",
        debugHint: "SUM(CASE...) con GROUP BY order_id."
      },
      {
        titleTemplate: "Fascia Anzianità",
        descTemplate: "Calcola anni di servizio e classifica: <1 'Junior', 1-3 'Mid', >3 'Senior'.",
        queryTemplate: "SELECT name, CASE WHEN YEAR(NOW()) - YEAR(hire_date) < 2 THEN 'Junior' WHEN YEAR(NOW()) - YEAR(hire_date) < 5 THEN 'Mid' ELSE 'Senior' END as level FROM Employees",
        hints: ["DATEDIFF restuituisce giorni", "365 giorni = 1 anno"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN YEAR(NOW()) - YEAR(hire_date) < 2 THEN 'Junior' WHEN YEAR(NOW()) - YEAR(hire_date) < 5 THEN 'Mid' ELSE 'Senior' END as level FROM Employees",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Spesa Media Tier",
        descTemplate: "Calcola AVG spesa e etichetta: > Media Globale 'Sopra Media', else 'Sotto'.",
        queryTemplate: "SELECT id, order_total, CASE WHEN order_total > (SELECT AVG(order_total) FROM Orders) THEN 'Sopra Media' ELSE 'Sotto Media' END as comparison FROM Orders",
        hints: ["Subquery per la media globale", "Confronto riga per riga"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id order_total, CASE WHEN order_total > (SELECT AVG(order_total) FROM Orders) THEN 'Sopra Media' ELSE 'Sotto Media' END as comparison FROM Orders",
        debugHint: "Total > (SELECT AVG...)."
      },
      {
        titleTemplate: "Stato Fornitura",
        descTemplate: "Se nessun prodotto ha stock < 10 'Ottimo', se qualcuno < 10 'Attenzione'. (Pivot booleano globale).",
        queryTemplate: "SELECT CASE WHEN SUM(CASE WHEN stock < 10 THEN 1 ELSE 0 END) > 0 THEN 'Attenzione' ELSE 'Ottimo' END as global_status FROM Products",
        hints: ["Conta i prodotti a rischio", "Se count > 0 allora status risk"],
        explanation: "KPI aggregato a livello di sistema.",
        replacements: {},
        brokenCode: "SELECT CASE WHEN SUM(CASE WHEN stock < 10 THEN 1 ELSE 0 END) > 0 THEN 'Attenzione' ELSE 'Ottimo' END IS global_status FROM Products",
        debugHint: "SUM(...) > 0."
      },
      {
        titleTemplate: "Clean Email",
        descTemplate: "Formatta email: se contiene 'test' o 'fake' -> NULLIF(email, email) [cioè NULL], else email.",
        queryTemplate: "SELECT id, CASE WHEN email LIKE '%test%' OR email LIKE '%fake%' THEN NULL ELSE email END as valid_email FROM Users",
        hints: ["Data cleaning logico", "Imposta a NULL i dati sporchi"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT id CASE WHEN email LIKE '%test%' OR email LIKE '%fake%' THEN NULL ELSE email END as valid_email FROM Users",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Vendite Trimestrali",
        descTemplate: "Assegna trimestre: Q1 (Jan-Mar), Q2 (Apr-Jun)...",
        queryTemplate: "SELECT id, CASE WHEN MONTH(order_date) <= 3 THEN 'Q1' WHEN MONTH(order_date) <= 6 THEN 'Q2' WHEN MONTH(order_date) <= 9 THEN 'Q3' ELSE 'Q4' END as quarter FROM Orders",
        hints: ["Usa MONTH()", "Logica a scaglioni"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id CASE WHEN MONTH(order_date) <= 3 THEN 'Q1' WHEN MONTH(order_date) <= 6 THEN 'Q2' WHEN MONTH(order_date) <= 9 THEN 'Q3' ELSE 'Q4' END as quarter FROM Orders",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Pari o Dispari",
        descTemplate: "Controlla ID: Se ID pari 'Even', dispari 'Odd'.",
        queryTemplate: "SELECT id, CASE WHEN id % 2 = 0 THEN 'Even' ELSE 'Odd' END as parity FROM Users",
        hints: ["Operatore modulo %"],
        explanation: "Logica aritmetica per A/B testing splitting.",
        replacements: {},
        brokenCode: "SELECT id CASE WHEN id % 2 = 0 THEN 'Even' ELSE 'Odd' END as parity FROM Users",
        debugHint: "% 2 = 0."
      },
      {
        titleTemplate: "Gerarchia Completa",
        descTemplate: "Se manager IS NULL -> 'Root', manager IN (Select manager_id...) -> 'Middle', else 'Leaf'.",
        queryTemplate: "SELECT name, CASE WHEN manager_id IS NULL THEN 'Root' WHEN id IN (SELECT manager_id FROM Employees) THEN 'Middle' ELSE 'Leaf' END as node_type FROM Employees",
        hints: ["Subquery per vedere se è manager di qualcuno", "Gerarchia ad albero"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN manager_id IS NULL THEN 'Root' WHEN id IN (SELECT manager_id FROM Employees) THEN 'Middle' ELSE 'Leaf' END as node_type FROM Employees",
        debugHint: "IN (SELECT manager_id...)."
      },
      {
        titleTemplate: "Validazione CAP",
        descTemplate: "Se country='Italy' e region è NULL -> 'Error', else 'OK'.",
        queryTemplate: "SELECT email, CASE WHEN country='Italy' AND (country IS NULL OR country = 'Italy') THEN 'Check' ELSE 'OK' END as validation FROM Users",
        hints: ["Esercizio simulato (non abbiamo region)", "Simuliamo logica complessa"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT email CASE WHEN country='Italy' AND (country IS NULL OR country = 'Italy') THEN 'Check' ELSE 'OK' END as validation FROM Users",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Trend Ordini",
        descTemplate: "Confronta totale con ordine precedente (Simuliamo con LAG o self join... qui usiamo media utente). Se > avg 'Up', < avg 'Down'.",
        queryTemplate: "SELECT o.id, CASE WHEN o.order_total > u_avg.avg_spent THEN 'Up' ELSE 'Down' END as trend FROM Orders o JOIN (SELECT user_id, AVG(order_total) as avg_spent FROM Orders GROUP BY user_id) u_avg ON o.user_id = u_avg.user_id",
        hints: ["Calcola media per utente", "Joina e confronta"],
        explanation: "COUNT con CASE WHEN permette di contare selettivamente le righe che soddisfano determinate condizioni, utile per pivot e report.",
        replacements: {},
        brokenCode: "SELECT o.id, CASE WHEN o.order_total > u_avg.avg_spent THEN 'Up' ELSE 'Down' END IS trend FROM Orders o JOIN (SELECT user_id, AVG(order_total) as avg_spent FROM Orders GROUP BY user_id) u_avg ON o.user_id = u_avg.user_id",
        debugHint: "Join con subquery aggregata."
      },
      {
        titleTemplate: "Prodotto Civetta",
        descTemplate: "Se price < 20 e category='Electronics' -> 'Loss Leader', else 'Standard'.",
        queryTemplate: "SELECT name, CASE WHEN price < 50 AND category = 'Electronics' THEN 'Special' ELSE 'Standard' END AS promo_type FROM Products",
        hints: ["Business logic specifica"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN price < 50 AND category = 'Electronics' THEN 'Special' ELSE 'Standard' END AS promo_type FROM Products",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Complex Sorting",
        descTemplate: "Ordina per: Premium Users first, then High Value Orders, then Date.",
        queryTemplate: "SELECT o.id FROM Orders o JOIN Users u ON o.user_id = u.id ORDER BY CASE WHEN u.is_premium THEN 0 ELSE 1 END, CASE WHEN o.order_total > 500 THEN 0 ELSE 1 END, o.order_date DESC",
        hints: ["Case multipli in Order By"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT o.id FROM Orders o JOIN Users u ON o.user_id = u.id ORDER CASE WHEN u.is_premium THEN 0 ELSE 1 END, CASE WHEN o.order_total > 500 THEN 0 ELSE 1 END, o.order_date DESC",
        debugHint: "Order By Case1, Case2."
      },
      {
        titleTemplate: "Weekend Sales",
        descTemplate: "Se giorno settimana Sab-Dom -> 'Weekend', else 'Weekday'.",
        queryTemplate: "SELECT id, CASE WHEN WEEKDAY(order_date) IN (5, 6) THEN 'Weekend' ELSE 'Weekday' END as day_type FROM Orders",
        hints: ["WEEKDAY() o DAYOFWEEK() - in AlaSQL WEEKDAY 0=Mon, 5=Sat, 6=Sun"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id CASE WHEN WEEKDAY(order_date) IN (5, 6) THEN 'Weekend' ELSE 'Weekday' END as day_type FROM Orders",
        debugHint: "WEEKDAY() returns 0-6."
      },
      {
        titleTemplate: "Tax Calculation",
        descTemplate: "Applica IVA: 22% Italia, 20% UK, 0% USA.",
        queryTemplate: "SELECT id, order_total * (CASE WHEN (SELECT country FROM Users WHERE id=o.user_id) = 'Italy' THEN 0.22 WHEN (SELECT country FROM Users WHERE id=o.user_id) = 'UK' THEN 0.20 ELSE 0 END) as tax FROM Orders o",
        hints: ["Subquery scalare per paese utente"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id order_total * (CASE WHEN (SELECT country FROM Users WHERE id=o.user_id) = 'Italy' THEN 0.22 WHEN (SELECT country FROM Users WHERE id=o.user_id) = 'UK' THEN 0.20 ELSE 0 END) as tax FROM Orders o",
        debugHint: "Select country where id=..."
      },
      {
        titleTemplate: "Fidelity Bonus",
        descTemplate: "Se ordini effettuati > 2 e totale speso > 500 -> 'Gold', >2 ordini -> 'Silver', else 'Bronze'.",
        queryTemplate: "SELECT user_id, CASE WHEN COUNT(*) > 2 AND SUM(order_total) > 500 THEN 'Gold' WHEN COUNT(*) > 2 THEN 'Silver' ELSE 'Bronze' END as tier FROM Orders GROUP BY user_id",
        hints: ["Usa CASE WHEN per classificare i valori", "Ricorda di chiudere con END"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT user_id CASE WHEN COUNT(*) > 2 AND SUM(order_total) > 500 THEN 'Gold' WHEN COUNT(*) > 2 THEN 'Silver' ELSE 'Bronze' END as tier FROM Orders GROUP BY user_id",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Inventory Health",
        descTemplate: "Se stock=0 'OOS', stock < avg_stock/2 'Low', stock > avg*2 'Overstock', else 'Healthy'.",
        queryTemplate: "SELECT name, CASE WHEN stock = 0 THEN 'OOS' WHEN stock < (SELECT AVG(stock) FROM Products)/2 THEN 'Low' WHEN stock > (SELECT AVG(stock) FROM Products)*2 THEN 'Overstock' ELSE 'Healthy' END as health FROM Products",
        hints: ["Confronto con subquery media"],
        explanation: "Combinare CASE WHEN dentro una funzione aggregata come SUM permette di contare o sommare solo le righe che soddisfano una condizione specifica.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN stock = 0 THEN 'OOS' WHEN stock < (SELECT AVG(stock) FROM Products)/2 THEN 'Low' WHEN stock > (SELECT AVG(stock) FROM Products)*2 THEN 'Overstock' ELSE 'Healthy' END as health FROM Products",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Customer Type",
        descTemplate: "B2B se email ha dominio aziendale (non gmail/yahoo), B2C altrimenti.",
        queryTemplate: "SELECT email, CASE WHEN email NOT LIKE '%gmail%' AND email NOT LIKE '%yahoo%' THEN 'B2B' ELSE 'B2C' END as type FROM Users",
        hints: ["Usa CASE WHEN per classificare i valori", "Ricorda di chiudere con END"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT email CASE WHEN email NOT LIKE '%gmail%' AND email NOT LIKE '%yahoo%' THEN 'B2B' ELSE 'B2C' END as type FROM Users",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Discount Recovery",
        descTemplate: "Calcola quanto sconto recuperare: se total < 100 e usato sconto (simulato) -> 'Recupera'.",
        queryTemplate: "SELECT id, CASE WHEN order_total < 100 THEN 'Surcharge' ELSE 'No Action' END FROM Orders",
        hints: ["Usa CASE WHEN per classificare i valori", "Ricorda di chiudere con END"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id CASE WHEN order_total < 100 THEN 'Surcharge' ELSE 'No Action' END FROM Orders",
        debugHint: "Total < 100."
      },
      {
        titleTemplate: "Shipping Zone",
        descTemplate: "Italy -> Zone 1, Europe (simulated) -> Zone 2, World -> Zone 3.",
        queryTemplate: "SELECT email, CASE country WHEN 'Italy' THEN 'Zone 1' WHEN 'France' THEN 'Zone 2' WHEN 'Germany' THEN 'Zone 2' ELSE 'Zone 3' END as zone FROM Users",
        hints: ["Case semplice o searched"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT email CASE country WHEN 'Italy' THEN 'Zone 1' WHEN 'France' THEN 'Zone 2' WHEN 'Germany' THEN 'Zone 2' ELSE 'Zone 3' END as zone FROM Users",
        debugHint: "Verifica che CASE abbia la struttura: CASE WHEN condizione THEN valore END."
      },
      {
        titleTemplate: "Product Age",
        descTemplate: "Se ID < 10 'Launch Product', ID > 40 'New Arrival'.",
        queryTemplate: "SELECT name, CASE WHEN id <= 10 THEN 'Launch' WHEN id >= 40 THEN 'New' ELSE 'Standard' END as lifecycle FROM Products",
        hints: ["ID come proxy temporale"],
        explanation: "Analisi catalogo.",
        replacements: {},
        brokenCode: "SELECT name CASE WHEN id <= 10 THEN 'Launch' WHEN id >= 40 THEN 'New' ELSE 'Standard' END as lifecycle FROM Products",
        debugHint: "ID <= 10."
      },
      {
        titleTemplate: "Data Quality Score",
        descTemplate: "100 - (10 se email null) - (20 se country null).",
        queryTemplate: "SELECT id, 100 - (CASE WHEN email IS NULL THEN 10 ELSE 0 END) - (CASE WHEN country IS NULL THEN 20 ELSE 0 END) as quality_score FROM Users",
        hints: ["Collega le tabelle Users e Orders", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "CASE WHEN è l'equivalente SQL dell'if-else: valuta condizioni in sequenza e restituisce il valore corrispondente alla prima condizione vera.",
        replacements: {},
        brokenCode: "SELECT id 100 - (CASE WHEN email IS NULL THEN 10 ELSE 0 END) - (CASE WHEN country IS NULL THEN 20 ELSE 0 END) as quality_score FROM Users",
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
        hints: ["Collega le tabelle Users e Orders", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "Recuperiamo dati utente (email) partendo dalla tabella ordini.",
        replacements: {},
        brokenCode: "SELECT Users.email, Orders.id FROM Users JOIN Orders Users.id = Orders.user_id",
        debugHint: "Usa ON Users.id = Orders.user_id."
      },
      {
        titleTemplate: "Prezzo degli Articoli",
        descTemplate: "Per ogni voce d'ordine (OrderItems), mostra l'ID e il prezzo unitario dal catalogo.",
        queryTemplate: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Usa OrderItems come punto di partenza", "Prendi il prezzo da Products"],
        explanation: "Accediamo alle proprietà del prodotto tramite la foreign key.",
        replacements: {},
        brokenCode: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products OrderItems.product_id = Products.id",
        debugHint: "Collega product_id con id."
      },
      {
        titleTemplate: "Totale Ordine e Utente",
        descTemplate: "Mostra lo User Name e il totale (order_total) per ogni ordine.",
        queryTemplate: "SELECT Users.name, Orders.order_total FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Seleziona name da Users e order_total da Orders"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Users.name, Orders.order_total FROM Users JOIN Orders Users.id = Orders.user_id",
        debugHint: "La JOIN va fatta su user_id."
      },
      {
        titleTemplate: "Categoria Prodotti Venduti",
        descTemplate: "Elenca le categorie dei prodotti presenti in OrderItems.",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Join tra OrderItems e Products"],
        explanation: "Vediamo a quali categorie appartengono gli oggetti venduti.",
        replacements: {},
        brokenCode: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products OrderItems.product_id = Products.id",
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
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT OrderItems.order_id, Products.name, OrderItems.quantity FROM OrderItems JOIN Products OrderItems.product_id = Products.id",
        debugHint: "Join su product_id = id."
      },
      {
        titleTemplate: "Ordini recenti con Nome",
        descTemplate: "Mostra nome utente e data ordine per ordini dopo il 2023-01-01.",
        queryTemplate: "SELECT Users.name, Orders.order_date FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.order_date > '2023-01-01'",
        hints: ["JOIN standard", "Filtro sulla data"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Users.name, Orders.order_date FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.order_date > '2023 01-01'",
        debugHint: "Prima JOIN poi WHERE."
      },
      {
        titleTemplate: "Manager Dipendente",
        descTemplate: "Per ogni dipendente, mostra il suo nome e l'ID del suo manager (Self Join concettuale ma qui basta select semplice se non chiesto nome manager). Richiesta: Mostra nome e manager_id, escludendo chi non ha manager.",
        queryTemplate: "SELECT name, manager_id FROM Employees WHERE manager_id IS NOT NULL",
        hints: ["Basta filtrare NULL se non dobbiamo unire la tabella con se stessa"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT name manager_id FROM Employees WHERE manager_id IS NOT NULL",
        debugHint: "IS NOT NULL."
      },
      {
        titleTemplate: "Ordini di 'Alice'",
        descTemplate: "Trova tutti gli ordini fatti da utenti di nome 'Alice'.",
        queryTemplate: "SELECT Orders.* FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.name = 'Alice'",
        hints: ["Join con Users", "Filtra per name = 'Alice'"],
        explanation: "IS NOT NULL seleziona solo le righe dove il campo ha un valore definito, escludendo i NULL.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE name = 'Alice'",
        debugHint: "La colonna 'name' non è in Orders, devi fare JOIN con Users."
      },
      {
        titleTemplate: "Prodotti in Ordini Grandi",
        descTemplate: "Mostra i nomi dei prodotti inclusi in ordini con quantità > 5.",
        queryTemplate: "SELECT Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE OrderItems.quantity > 1",
        hints: ["Filtra OrderItems.quantity > 5"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE OrderItems.quantity < 1",
        debugHint: "Join e Where."
      },
      {
        titleTemplate: "Spedizioni in USA",
        descTemplate: "Mostra ID ordine e status per utenti in 'USA'.",
        queryTemplate: "SELECT Orders.id, Orders.status FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.country = 'USA'",
        hints: ["Join su country"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Orders.id, Orders.status FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.country == 'USA'",
        debugHint: "Join Users ON ..."
      },
      {
        titleTemplate: "Email Ordini 'Shipped'",
        descTemplate: "Elenca email degli utenti che hanno ordini con status 'Shipped'.",
        queryTemplate: "SELECT Users.email FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.status = 'Shipped'",
        hints: ["Filtro su status ordine"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Users.email FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.status == 'Shipped'",
        debugHint: "Where status = 'Shipped'."
      },
      {
        titleTemplate: "Stock Prodotti Ordinati",
        descTemplate: "Per ogni riga ordine, mostra quanta scorta (stock) rimane del prodotto.",
        queryTemplate: "SELECT OrderItems.id, Products.stock FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Collega le tabelle OrderItems e Products", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT OrderItems.id, Products.stock FROM OrderItems JOIN Products OrderItems.product_id = Products.id",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini e Ruoli Staff",
        descTemplate: "Immagina che anche gli impiegati facciano ordini (non c'è link diretto nello schema standard, ma supponiamo Join su email o simile se esistesse). Qui: Join Users e Orders (Classico).",
        queryTemplate: "SELECT u.name, o.id FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["Usa gli alias per brevità (Users u, Orders o)"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name, o.id FROM Users u JOIN Orders o u.id = o.user_id",
        debugHint: "u.id = o.user_id."
      },
      {
        titleTemplate: "Valore Riga Ordine",
        descTemplate: "Calcola il valore totale della riga (quantity * Products.price).",
        queryTemplate: "SELECT OrderItems.id, OrderItems.quantity * Products.price as line_total FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Moltiplica qt della riga per prezzo del prodotto"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT OrderItems.id, OrderItems.quantity * Products.price IS line_total FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        debugHint: "Quantity * Price."
      },
      {
        titleTemplate: "Utenti con Ordini Recenti",
        descTemplate: "Seleziona distinct users che hanno ordinato dopo il 2023-06-01.",
        queryTemplate: "SELECT DISTINCT Users.name FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.order_date > '2023-06-01'",
        hints: ["Usa DISTINCT per evitare duplicati"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Users.name DISTINCT FROM Users JOIN Orders ON Users.id = Orders.user_id WHERE Orders.order_date > '2023-06-01'",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Prodotti 'Electronics' Venduti",
        descTemplate: "Lista ID ordini che contengono prodotti 'Electronics'.",
        queryTemplate: "SELECT OrderItems.order_id FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE Products.category = 'Electronics'",
        hints: ["Filtra per category"],
        explanation: "Filtro basato su proprietà della tabella destra.",
        replacements: {},
        brokenCode: "SELECT OrderItems.order_id FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id WHERE Products.category == 'Electronics'",
        debugHint: "Category = 'Electronics'."
      },
      {
        titleTemplate: "Ordini di Utenti Premium",
        descTemplate: "Mostra tutti gli ordini degli utenti con is_premium = true.",
        queryTemplate: "SELECT Orders.* FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE Users.is_premium = true",
        hints: ["Collega le tabelle Orders e Users", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT Orders.* FROM Orders JOIN Users ON Orders.user_id = Users.id WERE Users.is_premium = true",
        debugHint: "Join Users e Where Premium."
      },
      {
        titleTemplate: "Nome e Data Ordine Alias",
        descTemplate: "Usa alias 'u' e 'o' per selezionare nome e data.",
        queryTemplate: "SELECT u.name, o.order_date FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["Collega le tabelle Users e Orders", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users JOIN Orders",
        debugHint: "Devi definire l'alias: FROM Users u."
      },
      {
        titleTemplate: "Spesa per Riga",
        descTemplate: "Mostra nome prodotto e quanto è stato speso per quella riga (qty * price).",
        queryTemplate: "SELECT p.name, oi.quantity * p.price FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        hints: ["Join OrderItems e Products"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT p.name, oi.quantity * p.price FROM OrderItems oi JOIN Products p oi.product_id = p.id",
        debugHint: "Join con alias."
      },
      {
        titleTemplate: "Ordini senza Sconto",
        descTemplate: "Seleziona ordini di utenti non premium.",
        queryTemplate: "SELECT o.id FROM Orders o JOIN Users u ON o.user_id = u.id WHERE u.is_premium = false",
        hints: ["Collega le tabelle Orders e Users", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT o.id FROM Orders o JOIN Users u ON o.user_id = u.id WERE u.is_premium = false",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Join Multipla Base",
        descTemplate: "Collega OrderItems -> Products (ma seleziona solo nome prodotto e id riga).",
        queryTemplate: "SELECT oi.id, p.name FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        hints: ["Semplice join FK"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT oi.id, p.name FROM OrderItems oi JOIN Products p oi.product_id = p.id",
        debugHint: "ON product_id = id."
      },
      {
        titleTemplate: "Dipartimento Dipendente",
        descTemplate: "Mostra nome impiegato e dipartimento (Query su singola tabella, ma concettualmente prepara a join reali).",
        queryTemplate: "SELECT name, department FROM Employees",
        hints: ["Seleziona dalla tabella Employees", "Specifica il nome delle colonne dopo SELECT"],
        explanation: "A volte i dati sono denormalizzati.",
        replacements: {},
        brokenCode: "SELECT name department FROM Employees",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini Internazionali",
        descTemplate: "Ordini da utenti non 'Italy'.",
        queryTemplate: "SELECT o.id, u.country FROM Orders o JOIN Users u ON o.user_id = u.id WHERE u.country != 'Italy'",
        hints: ["WHERE country != 'Italy'"],
        explanation: "Export sales.",
        replacements: {},
        brokenCode: "SELECT o.id, u.country FROM Orders o JOIN Users u ON o.user_id = u.id WHERE u.country !== 'Italy'",
        debugHint: "<> o !=."
      },
      {
        titleTemplate: "Prodotti Costosi Ordinati",
        descTemplate: "Trova righe d'ordine riferite a prodotti con prezzo > 100.",
        queryTemplate: "SELECT oi.id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id WHERE p.price > 100",
        hints: ["Filter joining table"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT oi.id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id WHERE p.price < 100",
        debugHint: "Price > 100."
      },
      {
        titleTemplate: "Utenti con Ordini Pendenti",
        descTemplate: "Nomi utenti con ordini 'Pending'.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.status = 'Pending'",
        hints: ["Usa DISTINCT per eliminare i valori ripetuti", "La colonna da rendere unica è u"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.status = 'Pending'",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "ID Utente e ID Prodotto",
        descTemplate: "Chi ha comprato cosa (solo ID). Richiede Join a 3 tabelle (Users->Orders->Items) o 2 (Orders->Items). Facciamo Orders->Items.",
        queryTemplate: "SELECT o.user_id, oi.product_id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id",
        hints: ["Orders join OrderItems"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT o.user_id, oi.product_id FROM Orders o JOIN OrderItems oi o.id = oi.order_id",
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
        brokenCode: "SELECT Users.name, Orders.id FROM Users LEFT JOIN Orders Users.id = Orders.user_id",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Prodotti Mai Ordinati",
        descTemplate: "Trova i nomi dei prodotti che non sono mai stati inseriti in un ordine.",
        queryTemplate: "SELECT Products.name FROM Products LEFT JOIN OrderItems ON Products.id = OrderItems.product_id WHERE OrderItems.id IS NULL",
        hints: ["LEFT JOIN tra Products e OrderItems", "Check NULL su OrderItems.id"],
        explanation: "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).",
        replacements: {},
        brokenCode: "SELECT Products.name FROM Products LEFT JOIN OrderItems ON Products.id = OrderItems.product_id WERE OrderItems.id IS NULL",
        debugHint: "LEFT JOIN ... IS NULL."
      },
      {
        titleTemplate: "Spesa Totale per Utente",
        descTemplate: "Calcola quanto ha speso in totale ogni utente (Users Join Orders Group By Name).",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) as total_spent FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Join e poi Group By Users.name", "SUM(order_total)"],
        explanation: "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).",
        replacements: {},
        brokenCode: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders",
        debugHint: "Manca GROUP BY Users.name."
      },
      {
        titleTemplate: "Numero Ordini per Paese",
        descTemplate: "Conta quanti ordini provengono da ogni paese (Users Join Orders).",
        queryTemplate: "SELECT Users.country, COUNT(Orders.id) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.country",
        hints: ["Raggruppa per country"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT Users.country, COUNT(Orders.id) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP Users.country",
        debugHint: "Count su colonna orders."
      },
      {
        titleTemplate: "Prodotti in Categorie Popolari",
        descTemplate: "Mostra nome prodotto e categoria per prodotti venduti più di 10 volte (sommando quantity).",
        queryTemplate: "SELECT p.name, p.category, SUM(oi.quantity) FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name, p.category HAVING SUM(oi.quantity) > 10",
        hints: ["Join, Group By, Having"],
        explanation: "Filtro su aggregati di due tabelle.",
        replacements: {},
        brokenCode: "SELECT p.name, p.category, SUM(oi.quantity) FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP p.name, p.category HAVING SUM(oi.quantity) > 10",
        debugHint: "HAVING SUM > 10."
      },
      {
        titleTemplate: "Utenti con Acquisti 'Electronics'",
        descTemplate: "Nomi utenti che hanno comprato prodotti della categoria 'Electronics'.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.category = 'Electronics'",
        hints: ["Join a 4 tabelle: Users -> Orders -> Items -> Products"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.category = 'Electronics'",
        debugHint: "Collega tutte le tabelle."
      },
      {
        titleTemplate: "Dettaglio Ordini con Prezzi",
        descTemplate: "Mostra Order ID, Nome Prodotto, Quantità e Prezzo Totale Riga (qty * price).",
        queryTemplate: "SELECT oi.order_id, p.name, oi.quantity, (oi.quantity * p.price) as subtotal FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        hints: ["Calcolo aritmetico su colonne di tabelle diverse"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT oi.order_id, p.name, oi.quantity, (oi.quantity * p.price) IS subtotal FROM OrderItems oi JOIN Products p ON oi.product_id = p.id",
        debugHint: "Join e moltiplicazione."
      },
      {
        titleTemplate: "Ordini Multi-Prodotto",
        descTemplate: "Trova gli ID degli ordini che contengono più di 1 riga (più prodotti diversi).",
        queryTemplate: "SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) > 1",
        hints: ["Non serve JOIN qui, solo Group By su OrderItems, ma concettualmente lega prodotti"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT order_id FROM OrderItems GROUP order_id HAVING COUNT(*) > 1",
        debugHint: "Having Count > 1."
      },
      {
        titleTemplate: "Clienti e Loro Ultimo Ordine",
        descTemplate: "Mostra nome utente e la data del loro ordine più recente.",
        queryTemplate: "SELECT u.name, MAX(o.order_date) FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name",
        hints: ["MAX(order_date)", "Group By user"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT u.name, MAX(o.order_date) FROM Users u JOIN Orders o ON u.id = o.user_id GROUP u.name",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Manager e Sottoposti",
        descTemplate: "Per ogni impiegato mostrare il nome e il nome del suo manager (Self Join).",
        queryTemplate: "SELECT e1.name as Employee, e2.name as Manager FROM Employees e1 JOIN Employees e2 ON e1.manager_id = e2.id",
        hints: ["Collega le tabelle Employees e Employees", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT name, manager_name FROM Employees",
        debugHint: "Devi unire Employees con se stessa."
      },
      {
        titleTemplate: "Prodotti e Vendite Totali",
        descTemplate: "Lista tutti i prodotti e la somma totale delle quantità vendute (usa LEFT JOIN per includere 0 vendite).",
        queryTemplate: "SELECT p.name, COALESCE(SUM(oi.quantity), 0) FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name",
        hints: ["LEFT JOIN per non perdere prodotti invenduti", "COALESCE per trasformare NULL in 0"],
        explanation: "Un self-join collega una tabella con sé stessa, utile per gerarchie come dipendente-manager dove la relazione è nella stessa tabella.",
        replacements: {},
        brokenCode: "SELECT p.name, COALESCE(SUM(oi.quantity), 0) FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id GROUP p.name",
        debugHint: "LEFT JOIN + COALESCE."
      },
      {
        titleTemplate: "Utenti Italiani con Ordini > 100",
        descTemplate: "Trova utenti italiani che hanno fatto almeno un ordine sopra i 100 euro.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.country = 'Italy' AND o.order_total > 100",
        hints: ["Join + 2 condizioni Where"],
        explanation: "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.country = 'Italy' AND o.order_total > 100",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini con Prodotti 'Out of Stock'",
        descTemplate: "Trova ID ordini che contengono prodotti con stock = 0.",
        queryTemplate: "SELECT DISTINCT oi.order_id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id WHERE p.stock = 0",
        hints: ["Join su prodotti, where stock=0"],
        explanation: "COUNT(DISTINCT ...) conta i valori unici, eliminando i duplicati prima del conteggio.",
        replacements: {},
        brokenCode: "SELECT oi.order_id DISTINCT FROM OrderItems oi JOIN Products p ON oi.product_id = p.id WHERE p.stock = 0",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ticket Medio per Nazione",
        descTemplate: "Calcola il valore medio degli ordini per ogni nazione.",
        queryTemplate: "SELECT u.country, AVG(o.order_total) FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.country",
        hints: ["Join Users-Orders", "AVG(total)", "Group By country"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT u.country, AVG(o.order_total) FROM Users u JOIN Orders o ON u.id = o.user_id GROUP u.country",
        debugHint: "AVG con Group By."
      },
      {
        titleTemplate: "Impiegati nello stesso Dept",
        descTemplate: "Trova coppie di impiegati che lavorano nello stesso dipartimento.",
        queryTemplate: "SELECT e1.name, e2.name FROM Employees e1 JOIN Employees e2 ON e1.department = e2.department WHERE e1.id < e2.id",
        hints: ["Self Join su department", "e1.id < e2.id per evitare duplicati/riflessi"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT e1.name, e2.name FROM Employees e1 JOIN Employees e2 ON e1.department = e2.department WERE e1.id < e2.id",
        debugHint: "Condizione < sull'ID."
      },
      {
        titleTemplate: "Utenti e Conti Ordini",
        descTemplate: "Mostra nome utente e numero di ordini effettuati (incluso 0).",
        queryTemplate: "SELECT u.name, COUNT(o.id) FROM Users u LEFT JOIN Orders o ON u.id = o.user_id GROUP BY u.name",
        hints: ["LEFT JOIN", "COUNT(o.id) conta solo i non-nulli"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name, COUNT(o.id) FROM Users u LEFT JOIN Orders o ON u.id = o.user_id GROUP u.name",
        debugHint: "LEFT JOIN e Group By."
      },
      {
        titleTemplate: "Prodotto Più Venduto (Qta)",
        descTemplate: "Trova il nome del prodotto con la somma quantità più alta.",
        queryTemplate: "SELECT p.name, SUM(oi.quantity) as total_qty FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name ORDER BY total_qty DESC LIMIT 1",
        hints: ["Sum quantity", "Order Desc Limit 1"],
        explanation: "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).",
        replacements: {},
        brokenCode: "SELECT p.name, SUM(oi.quantity) IS total_qty FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name ORDER BY total_qty DESC LIMIT 1",
        debugHint: "Order By SUM DESC."
      },
      {
        titleTemplate: "Ordini Completi (3 Join)",
        descTemplate: "Mostra ID Ordine, Email Utente, Nome Prodotto per ogni riga ordine.",
        queryTemplate: "SELECT o.id, u.email, p.name FROM Orders o JOIN Users u ON o.user_id = u.id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id",
        hints: ["Catena di 4 join"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT o.id, u.email, p.name FROM Orders o JOIN Users u o.user_id = u.id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id",
        debugHint: "Segui le chiavi esterne."
      },
      {
        titleTemplate: "Utenti 'Gold'",
        descTemplate: "Utenti che hanno speso > 500 in totale.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name HAVING SUM(o.order_total) > 500",
        hints: ["Group By name", "HAVING SUM > 500"],
        explanation: "Filtro su aggregato derivato da join.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id GROUP u.name HAVING SUM(o.order_total) > 500",
        debugHint: "HAVING dopo Group By."
      },
      {
        titleTemplate: "Variazione Prezzo Ordine",
        descTemplate: "Confronta prezzo pagato (OrderItems... non abbiamo prezzo storico, usiamo prezzo attuale) e totale ordine.",
        queryTemplate: "SELECT o.id, o.order_total, SUM(oi.quantity * p.price) as calc_total FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id, o.order_total",
        hints: ["Verifica consistenza dati", "Confronta campo calcolato e campo salvato"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT o.id, o.order_total, SUM(oi.quantity * p.price) IS calc_total FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id, o.order_total",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Utenti del Dipartimento 'Sales'",
        descTemplate: "Supponendo link Users-Employees (non c'è, esercizio teorico), facciamo: Utenti che hanno stesso nome di un impiegato.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Employees e ON u.name = e.name",
        hints: ["Join su campo name (non ideale ma possibile)"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users u JOIN Employees e u.name = e.name",
        debugHint: "ON u.name = e.name."
      },
      {
        titleTemplate: "Cross Join Esplicita",
        descTemplate: "Combina tutti i Users con tutti i Products (Cartesian).",
        queryTemplate: "SELECT u.name, p.name FROM Users u CROSS JOIN Products p",
        hints: ["Collega le tabelle Users e Products", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "Generazione di tutte le combinazioni possibili.",
        replacements: {},
        brokenCode: "SELCET u.name, p.name FROM Users u CROSS JOIN Products p",
        debugHint: "CROSS JOIN non ha ON."
      },
      {
        titleTemplate: "Full Outer Join Simulata",
        descTemplate: "Poiché molti DB (e AlaSQL) non hanno FULL JOIN, simulala con LEFT JOIN Union RIGHT JOIN (o LEFT Union LEFT inversa). Qui: Lista tutti users e orders (User senza ordini E Ordini orfani).",
        queryTemplate: "SELECT u.name, o.id FROM Users u LEFT JOIN Orders o ON u.id = o.user_id UNION SELECT u.name, o.id FROM Orders o LEFT JOIN Users u ON o.user_id = u.id",
        hints: ["Union di due Left Join invertite"],
        explanation: "CROSS JOIN produce il prodotto cartesiano: ogni riga della prima tabella viene combinata con ogni riga della seconda.",
        replacements: {},
        brokenCode: "SELECT u.name, o.id FROM Users u LEFT JOIN Orders o u.id = o.user_id UNION SELECT u.name, o.id FROM Orders o LEFT JOIN Users u ON o.user_id = u.id",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini con Almeno 3 Articoli",
        descTemplate: "Trova ordini con count(items) >= 3.",
        queryTemplate: "SELECT o.id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id GROUP BY o.id HAVING COUNT(oi.id) >= 3",
        hints: ["Group By Order ID", "Having Count >= 3"],
        explanation: "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.",
        replacements: {},
        brokenCode: "SELECT o.id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id GROUP o.id HAVING COUNT(oi.id) >= 3",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Categorie Acquistate da Utente",
        descTemplate: "Mostra categorie distinte acquistate da 'Alice'.",
        queryTemplate: "SELECT DISTINCT p.category FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE u.name = 'Alice'",
        hints: ["Distinct category", "Filter user name"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT p.category DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE u.name = 'Alice'",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Prodotti Non 'Electronics'",
        descTemplate: "Ordini che contengono prodotti NON Electronics.",
        queryTemplate: "SELECT DISTINCT o.id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.category != 'Electronics'",
        hints: ["Usa DISTINCT per eliminare i valori ripetuti", "La colonna da rendere unica è o"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT o.id DISTINCT FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.category != 'Electronics'",
        debugHint: "!= o <>."
      },
      {
        titleTemplate: "Chi ha comprato 'Laptop'?",
        descTemplate: "Trova email di chi ha comprato prodotto con nome 'Laptop'.",
        queryTemplate: "SELECT DISTINCT u.email FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name = 'Laptop'",
        hints: ["Filtra per nome prodotto"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT u.email DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name = 'Laptop'",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini Mese Corrente",
        descTemplate: "Join Users-Orders filtrando per mese corrente (NOW).",
        queryTemplate: "SELECT u.name, o.id FROM Users u JOIN Orders o ON u.id = o.user_id WHERE YEAR(o.order_date) = YEAR(NOW())",
        hints: ["Confronta Month e Year con NOW()"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT u.name, o.id FROM Users u JOIN Orders o ON u.id = o.user_id WERE YEAR(o.order_date) = YEAR(NOW())",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Status Spedizione Utente",
        descTemplate: "Mostra 'Spedito' se tutti gli ordini dell'utente sono Shipped ?? No, mostra semplicemente status ordini per utente.",
        queryTemplate: "SELECT u.name, o.status FROM Users u JOIN Orders o ON u.id = o.user_id",
        hints: ["Select semplice join"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name, o.status FROM Users u JOIN Orders o u.id = o.user_id",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
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
        brokenCode: "SELECT u.name, u.email, o.order_date, p.name, oi.quantity FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE o.status == 'Shipped'",
        debugHint: "Segui la catena di chiavi esterne."
      },
      {
        titleTemplate: "Impiegati con Salary > Manager",
        descTemplate: "Trova gli impiegati che guadagnano più del proprio manager (Self Join).",
        queryTemplate: "SELECT E.name FROM Employees E JOIN Employees M ON E.manager_id = M.id WHERE E.salary > M.salary",
        hints: ["Self Join: Employees E, Employees M", "Confronta E.salary > M.salary"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT E.name FROM Employees E JOIN Employees M ON E.manager_id = M.id WHERE E.salary < M.salary",
        debugHint: "Join su manager_id = id."
      },
      {
        titleTemplate: "Prodotti mai venduti nel 2023",
        descTemplate: "Trova prodotti che NON sono stati venduti in ordini del 2023.",
        queryTemplate: "SELECT p.name FROM Products p LEFT JOIN (SELECT oi.product_id FROM OrderItems oi JOIN Orders o ON oi.order_id = o.id WHERE YEAR(o.order_date) = 2023) sold_23 ON p.id = sold_23.product_id WHERE sold_23.product_id IS NULL",
        hints: ["Left Join con subquery o Left Join + condition in ON/Where", "Filtra IS NULL"],
        explanation: "Un self-join collega una tabella con sé stessa, utile per gerarchie come dipendente-manager dove la relazione è nella stessa tabella.",
        replacements: {},
        brokenCode: "SELECT p.name FROM Products p LEFT JOIN (SELECT oi.product_id FROM OrderItems oi JOIN Orders o ON oi.order_id = o.id WERE YEAR(o.order_date) = 2023) sold_23 ON p.id = sold_23.product_id WHERE sold_23.product_id IS NULL",
        debugHint: "LEFT JOIN ... IS NULL."
      },
      {
        titleTemplate: "Clienti 'Big Spender' Ricorrenti",
        descTemplate: "Trovami utenti che hanno fatto più di un ordine sopra i 500 euro.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.order_total > 500 GROUP BY u.name HAVING COUNT(o.id) > 1",
        hints: ["Filter order_total in Where", "Filter count in Having"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE o.order_total < 500 GROUP BY u.name HAVING COUNT(o.id) > 1",
        debugHint: "Where price > 500 first."
      },
      {
        titleTemplate: "Performance Categorie per Nazione",
        descTemplate: "Per ogni nazione, trova la categoria di prodotti più venduta (sommando quantity).",
        queryTemplate: "SELECT u.country, p.category, SUM(oi.quantity) as sold FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.country, p.category ORDER BY u.country, sold DESC",
        hints: ["Group By country, category", "Order by country, sum desc"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.country, p.category, SUM(oi.quantity) IS sold FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.country, p.category ORDER BY u.country, sold DESC",
        debugHint: "Join 4 tables."
      },
      {
        titleTemplate: "Coppie di Prodotti Spesso Insieme",
        descTemplate: "Trova coppie di prodotti (A, B) che appaiono nello stesso ordine (Self Join su OrderItems).",
        queryTemplate: "SELECT oi1.product_id as P1, oi2.product_id as P2, COUNT(*) as frequency FROM OrderItems oi1 JOIN OrderItems oi2 ON oi1.order_id = oi2.order_id WHERE oi1.product_id < oi2.product_id GROUP BY P1, P2 ORDER BY frequency DESC LIMIT 1",
        hints: ["Self Join OrderItems on order_id", "P1 < P2 per evitare duplicati speculari"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT oi1.product_id IS P1, oi2.product_id as P2, COUNT(*) as frequency FROM OrderItems oi1 JOIN OrderItems oi2 ON oi1.order_id = oi2.order_id WHERE oi1.product_id < oi2.product_id GROUP BY P1, P2 ORDER BY frequency DESC LIMIT 1",
        debugHint: "oi1.order_id = oi2.order_id."
      },
      {
        titleTemplate: "Utenti che hanno comprato TUTTE le categorie",
        descTemplate: "Sfida logica: Utenti che hanno acquistato almeno un prodotto per ogni categoria disponibile. (Concetto di Divisione Relazionale, simulata).",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name HAVING COUNT(DISTINCT p.category) >= 2",
        hints: ["Count Distinct Category dell'utente = Count Distinct Category Totale"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name HAVING COUNT(DISTINCT p.category) >= 2",
        debugHint: "HAVING COUNT = (subquery)."
      },
      {
        titleTemplate: "Valore Magazzino vs Venduto",
        descTemplate: "Per ogni prodotto, confronta il valore dello stock attuale (stock * price) con il totale guadagnato dalle vendite passate.",
        queryTemplate: "SELECT p.name, (p.stock * p.price) as inventory_value, COALESCE(SUM(oi.quantity * p.price), 0) as sales_value FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.id, p.name, p.stock, p.price",
        hints: ["Left Join Products-OrderItems", "Calcoli aggregati vs scalari"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT p.name, (p.stock * p.price) IS inventory_value, COALESCE(SUM(oi.quantity * p.price), 0) as sales_value FROM Products p LEFT JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.id, p.name, p.stock, p.price",
        debugHint: "Group By p.id."
      },
      {
        titleTemplate: "Gerarchia Completa (Recursive sim)",
        descTemplate: "Mostra Nome, Manager Name per tutti (anche chi non ha manager - LEFT JOIN self).",
        queryTemplate: "SELECT E.name as Emp, M.name as Boss FROM Employees E LEFT JOIN Employees M ON E.manager_id = M.id",
        hints: ["LEFT Join su self"],
        explanation: "Include il CEO (che ha manager NULL).",
        replacements: {},
        brokenCode: "SELECT E.name IS Emp, M.name as Boss FROM Employees E LEFT JOIN Employees M ON E.manager_id = M.id",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini con prodotti di categorie miste",
        descTemplate: "Trova ordini che contengono prodotti di almeno 2 categorie diverse.",
        queryTemplate: "SELECT oi.order_id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY oi.order_id HAVING COUNT(DISTINCT p.category) > 1",
        hints: ["Collega le tabelle OrderItems e Products", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).",
        replacements: {},
        brokenCode: "SELECT oi.order_id DISTINCT FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY oi.order_id HAVING COUNT(DISTINCT p.category) > 1",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Utenti Inattivi da 6 Mesi",
        descTemplate: "Utenti che non hanno ordini con data > oggi - 6 mesi.",
        queryTemplate: "SELECT u.name FROM Users u LEFT JOIN Orders o ON u.id = o.user_id AND o.order_date > DATE('now', '-6 months') WHERE o.id IS NULL",
        hints: ["Left Join con condizione temporale complessa o Where Not Exists"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users u LEFT JOIN Orders o ON u.id = o.user_id AND o.order_date > DATE('now', ' 6 months') WHERE o.id IS NULL",
        debugHint: "o.id IS NULL."
      },
      {
        titleTemplate: "Categoria Preferita Utente",
        descTemplate: "Per ogni utente, trova la categoria su cui ha speso di più (Query complessa, semplifichiamo: Categoria più acquistata da 'Alice').",
        queryTemplate: "SELECT p.category, SUM(oi.quantity) as qty FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE u.name = 'Alice' GROUP BY p.category ORDER BY qty DESC LIMIT 1",
        hints: ["Filtra Alice", "Group by category", "Order desc limit 1"],
        explanation: "LEFT JOIN restituisce tutte le righe dalla tabella di sinistra, anche quelle senza corrispondenza nella tabella destra (con NULL per le colonne mancanti).",
        replacements: {},
        brokenCode: "SELECT p.category, SUM(oi.quantity) IS qty FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE u.name = 'Alice' GROUP BY p.category ORDER BY qty DESC LIMIT 1",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Join su Date (Range Join)",
        descTemplate: "Trova ordini effettuati lo stesso giorno di un 'Evento'. (Simuliamo tabella Eventi con subquery/CTE). Diciamo: Ordini fatti lo stesso giorno dell'ordine #1.",
        queryTemplate: "SELECT o2.id FROM Orders o1 JOIN Orders o2 ON o1.order_date = o2.order_date WHERE o1.id = 9301 AND o2.id != 9301",
        hints: ["Self Join on order_date"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT o2.id FROM Orders o1 JOIN Orders o2 ON o1.order_date = o2.order_date WERE o1.id = 9301 AND o2.id != 9301",
        debugHint: "o1.id = 1."
      },
      {
        titleTemplate: "Gap Analysis Vendite",
        descTemplate: "Trova gli utenti che hanno comprato 'Smartphone' ma NON 'Cover'.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name LIKE '%Laptop%' AND u.name NOT IN (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name LIKE '%Cover%')",
        hints: ["In standard SQL: WHERE u.id IN (Smartphone buyers) AND u.id NOT IN (Cover buyers)"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WERE p.name LIKE '%Laptop%' AND u.name NOT IN (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name LIKE '%Cover%')",
        debugHint: "Subquery NOT IN."
      },
      {
        titleTemplate: "Ordini con Valore Errato",
        descTemplate: "Trova ordini dove order_total != somma(items).",
        queryTemplate: "SELECT o.id FROM Orders o JOIN (SELECT order_id, SUM(quantity*unit_price) as calc_sum FROM OrderItems GROUP BY order_id) detail ON o.id = detail.order_id WHERE o.order_total != detail.calc_sum",
        hints: ["Join con derived table aggregata"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT o.id FROM Orders o JOIN (SELECT order_id, SUM(quantity*unit_price) IS calc_sum FROM OrderItems GROUP BY order_id) detail ON o.id = detail.order_id WHERE o.order_total != detail.calc_sum",
        debugHint: "Subquery nel FROM."
      },
      {
        titleTemplate: "Best Selling Product per Year",
        descTemplate: "Anno | Prodotto | Qta. Richiede Window Functions o Group complessi. Qui facciamo Group By Year, Product.",
        queryTemplate: "SELECT YEAR(o.order_date) as yr, p.name, SUM(oi.quantity) FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY yr, p.name ORDER BY yr, SUM(oi.quantity) DESC",
        hints: ["Group By Year(date), product"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT YEAR(o.order_date) IS yr, p.name, SUM(oi.quantity) FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY yr, p.name ORDER BY yr, SUM(oi.quantity) DESC",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Utenti e Avg Stock Acquistato",
        descTemplate: "Media dello stock attuale dei prodotti comprati da ogni utente.",
        queryTemplate: "SELECT u.name, AVG(p.stock) FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name",
        hints: ["Collega le tabelle Users e Products", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.name, AVG(p.stock) FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP u.name",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Salari Manager vs Avg Dipartimento",
        descTemplate: "Manager che guadagnano meno della media del proprio dipartimento.",
        queryTemplate: "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) as avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE e.salary > d_avg.avg_sal",
        hints: ["Join con subquery aggregata per dept", "manager_id IS NULL identifica manager/capi (o logica specifica)"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) IS avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE e.salary > d_avg.avg_sal",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Clienti e Prodotti Esclusivi",
        descTemplate: "Clienti che hanno comprato SOLO prodotti 'Electronics'.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name HAVING COUNT(DISTINCT p.category) > 0",
        hints: ["Group By User", "HAVING MIN(cat) = MAX(cat) = 'Electronics' è un trick per dire 'solo questa categoria'"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.name HAVING COUNT(DISTINCT p.category) > 0",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Confronto Ordini Successivi",
        descTemplate: "Trova ordini che hanno valore inferiore all'ordine immediatamente precedente dello stesso utente. (Self Join o Window, usiamo Self Join su ID-1 o logica temporale).",
        queryTemplate: "SELECT o1.id FROM Orders o1 JOIN Orders o2 ON o1.user_id = o2.user_id WHERE o1.id = o2.id + 1 AND o1.order_total < o2.order_total",
        hints: ["Assumiamo ID sequenziali: o1.id = o2.id + 1"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT o1.id FROM Orders o1 JOIN Orders o2 ON o1.user_id = o2.user_id WHERE o1.id = o2.id 1 AND o1.order_total < o2.order_total",
        debugHint: "o1.id = o2.id + 1."
      },
      {
        titleTemplate: "Full Order Details JSON",
        descTemplate: "Simulazione: Crea stringa dettagli ordine concatenando nomi prodotti (Group_Concat).",
        queryTemplate: "SELECT o.id, GROUP_CONCAT(p.name) as items FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id",
        hints: ["Collega le tabelle Orders e Products", "Usa la clausola ON per specificare la condizione di collegamento"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT o.id, GROUP_CONCAT(p.name) IS items FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY o.id",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Utenti Senza Acquisti Recentemente",
        descTemplate: "Utenti con acquisiti in passato ma NULLA negli ultimi 3 mesi.",
        queryTemplate: "SELECT DISTINCT u.name FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.id NOT IN (SELECT user_id FROM Orders WHERE order_date > DATE('now', '-3 months'))",
        hints: ["IN (all history) AND NOT IN (recent history)"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.id NOT IN (SELECT user_id FROM Orders WHERE order_date > DATE('now', '-3 months'))",
        debugHint: "NOT IN Subquery."
      },
      {
        titleTemplate: "Ranking Prodotti per Revenue",
        descTemplate: "Classifica prodotti per Entrate Totali (qty*price).",
        queryTemplate: "SELECT p.name, SUM(oi.quantity * p.price) as rev FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name ORDER BY rev DESC",
        hints: ["Sum(q * p)", "Group By name"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT p.name, SUM(oi.quantity * p.price) IS rev FROM Products p JOIN OrderItems oi ON p.id = oi.product_id GROUP BY p.name ORDER BY rev DESC",
        debugHint: "Order By Rev."
      },
      {
        titleTemplate: "Ordini Spediti con Dettagli Utente",
        descTemplate: "Mostra l'ID ordine, il nome utente e la data di tutti gli ordini con status 'Shipped'.",
        queryTemplate: "SELECT o.id, u.name, o.order_date FROM Orders o JOIN Users u ON o.user_id = u.id WHERE o.status = 'Shipped'",
        hints: ["Serve un JOIN tra Orders e Users", "Filtra per status = 'Shipped'"],
        explanation: "Un JOIN con filtro WHERE permette di combinare dati da più tabelle mostrando solo le righe che soddisfano la condizione.",
        replacements: {},
        brokenCode: "SELECT o.id, u.name, o.order_date FROM Orders o JOIN Users u ON o.user_id = u.id WERE o.status = 'Shipped'",
        debugHint: "Controlla la clausola WHERE: è scritta correttamente?"
      },
      {
        titleTemplate: "Clienti Nuovi 2023",
        descTemplate: "Clienti il cui primo ordine è stato nel 2023.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.name HAVING COUNT(o.id) > 5",
        hints: ["Having Min(date) >= 2023"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id GROUP u.name HAVING COUNT(o.id) > 5",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Distribuzione Ordini per Giorno",
        descTemplate: "Quanti ordini Lunedì, Martedì... (Join non serve ma spesso si fa con tabella Calendario. Qui: solo Group By WEEKDAY).",
        queryTemplate: "SELECT WEEKDAY(order_date) as wd, COUNT(*) FROM Orders GROUP BY wd",
        hints: ["WEEKDAY() returns index"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT WEEKDAY(order_date) IS wd, COUNT(*) FROM Orders GROUP BY wd",
        debugHint: "Group By WD."
      },
      {
        titleTemplate: "Prodotti 'Solo' o 'Accoppiati'",
        descTemplate: "Prodotti che sono stati venduti come unico item nell'ordine.",
        queryTemplate: "SELECT DISTINCT p.name FROM Products p JOIN OrderItems oi ON p.id = oi.product_id JOIN (SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) = 1) singles ON oi.order_id = singles.order_id",
        hints: ["Join con subquery di ordini con count=1"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT p.name DISTINCT FROM Products p JOIN OrderItems oi ON p.id = oi.product_id JOIN (SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) = 1) singles ON oi.order_id = singles.order_id",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Utenti Stesso Nome Diversa Email",
        descTemplate: "Controllo duplicati anagrafica.",
        queryTemplate: "SELECT u1.name FROM Users u1 JOIN Users u2 ON u1.name = u2.name AND u1.email != u2.email",
        hints: ["Self Join name=name, email!=email"],
        explanation: "COUNT(DISTINCT ...) conta i valori unici, eliminando i duplicati prima del conteggio.",
        replacements: {},
        brokenCode: "SELECT u1.name FROM Users u1 JOIN Users u2 u1.name = u2.name AND u1.email != u2.email",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Media Prodotti per Ordine (Global)",
        descTemplate: "Calcolo scalare: Totale Items / Totale Ordini.",
        queryTemplate: "SELECT CAST(COUNT(*) AS FLOAT) / COUNT(DISTINCT order_id) FROM OrderItems",
        hints: ["Aritmetica su aggregati"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT CAST(COUNT(*) AS FLOAT) / COUNT(DISTINCT order_id) DISTINCT FROM OrderItems",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Referral Chain (Simulata)",
        descTemplate: "Se Users avesse referrer_id (Self join). Simuliamo con Manager-Employee (già fatto). Facciamo join a 3 livelli: Employee -> Manager -> GrandManager.",
        queryTemplate: "SELECT e.name, m.name as Boss, gm.name as BigBoss FROM Employees e LEFT JOIN Employees m ON e.manager_id = m.id LEFT JOIN Employees gm ON m.manager_id = gm.id",
        hints: ["Doppio Self Join"],
        explanation: "L'alias (AS) rinomina una colonna o il risultato di un'espressione nel set di risultati, migliorando la leggibilità.",
        replacements: {},
        brokenCode: "SELECT e.name, m.name IS Boss, gm.name as BigBoss FROM Employees e LEFT JOIN Employees m ON e.manager_id = m.id LEFT JOIN Employees gm ON m.manager_id = gm.id",
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
        hints: ["Calcola prima la media dei prezzi con una subquery (SELECT AVG(price) FROM Products)", "Nella query principale, filtra i prodotti che hanno un prezzo maggiore del risultato di quella subquery"],
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
        hints: ["Scrivi una subquery che seleziona l'attributo category filtrando per name='Monitor 4K'", "Usa questo risultato per filtrare la tabella Products principale"],
        explanation: "La subquery recupera la categoria del 'Monitor 4K'.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category = 'Monitor 4K'",
        debugHint: "'Monitor 4K' è un nome, non una categoria."
      },
      {
        titleTemplate: "Ordini Recenti",
        descTemplate: "Trova gli ordini effettuati dopo l'ultimo ordine dell'utente con ID 1.",
        queryTemplate: "SELECT * FROM Orders ORDER BY order_date DESC LIMIT 5",
        hints: ["Usa una subquery per trovare la data più recente (MAX order_date) degli ordini dell'utente 1", "Seleziona gli ordini con order_date maggiore di quella data"],
        explanation: "Confrontiamo date con il risultato di una subquery scalare.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders ORDER order_date DESC LIMIT 5",
        debugHint: "La subquery deve restituire una sola data (MAX)."
      },
      {
        titleTemplate: "Staff e Clienti",
        descTemplate: "Ottieni una lista unica di nomi di tutti i dipendenti e di tutti i clienti.",
        queryTemplate: "SELECT name FROM Employees UNION SELECT name FROM Users",
        hints: ["Scrivi due query separate: una per i nomi degli Employees e una per i nomi degli Users", "Uniscile con l'operatore UNION per ottenere una lista unica senza duplicati"],
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
        explanation: "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.",
        replacements: {},
        brokenCode: "SELECT email FROM Users WHERE is_premium = true UNION SELECT email FROM Users WHERE country == 'Italy'",
        debugHint: "Controlla attentamente la sintassi SQL e i nomi delle colonne e tabelle."
      },
      {
        titleTemplate: "Prodotti Invenduti",
        descTemplate: "Trova i prodotti che non sono mai stati ordinati (non presenti in OrderItems).",
        queryTemplate: "SELECT name FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems)",
        hints: ["Usa NOT IN", "La subquery seleziona product_id da OrderItems"],
        explanation: "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.",
        replacements: {},
        brokenCode: "SELECT name FROM Products WERE id NOT IN (SELECT product_id FROM OrderItems)",
        debugHint: "Usa NOT IN."
      },
      {
        titleTemplate: "Ordini Sopra Media",
        descTemplate: "Trova gli ordini con totale superiore alla media globale.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > (SELECT AVG(order_total) FROM Orders)",
        hints: ["Calcola la media globale di order_total con una subquery (SELECT AVG...)", "Seleziona gli ordini che superano questo valore"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_total < (SELECT AVG(order_total) FROM Orders)",
        debugHint: "Usa subquery per AVG."
      },
      {
        titleTemplate: "Dipendenti Manager",
        descTemplate: "Trova i dipendenti che sono manager (il loro ID è nel campo manager_id di qualcuno).",
        queryTemplate: "SELECT * FROM Employees WHERE id IN (SELECT manager_id FROM Employees)",
        hints: ["Cerca ID dentro la lista manager_id"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WERE id IN (SELECT manager_id FROM Employees)",
        debugHint: "Usa ID IN (SELECT manager_id...)."
      },
      {
        titleTemplate: "Categorie Costose",
        descTemplate: "Trova le categorie che hanno almeno un prodotto che costa più di 1000.",
        queryTemplate: "SELECT DISTINCT category FROM Products WHERE category IN (SELECT category FROM Products WHERE price > 1000)",
        hints: ["Usa IN insieme a una subquery", "La subquery deve trovare le categorie dei prodotti che costano più di 1000 (SELECT category FROM Products WHERE price > 1000)"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT category DISTINCT FROM Products WHERE category IN (SELECT category FROM Products WHERE price > 1000)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Utenti Interessanti",
        descTemplate: "Ottieni gli ID degli utenti che hanno ordinato UNION gli ID degli utenti Premium.",
        queryTemplate: "SELECT user_id FROM Orders UNION SELECT id FROM Users WHERE is_premium = true",
        hints: ["UNION di due colonne ID"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders UNION SELECT id FROM Users WERE is_premium = true",
        debugHint: "I nomi delle colonne possono differire, i tipi no."
      },
      {
        titleTemplate: "Stesso Paese",
        descTemplate: "Trova gli utenti che vivono nello stesso paese dell'ordine con ID 5 (assumendo ordine abbia un link indiretto user -> country).",
        queryTemplate: "SELECT * FROM Users WHERE country = (SELECT country FROM Users WHERE id = 100)",
        hints: ["Catena: Ordine -> Utente -> Paese"],
        explanation: "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE country = (SELECT country FROM Users WHERE id = 100)",
        debugHint: "Trova prima user_id, poi suo country."
      },
      {
        titleTemplate: "Prodotti Popolari",
        descTemplate: "Prodotti ordinati in più di 2 ordini diversi (usando IN e subquery con HAVING).",
        queryTemplate: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems GROUP BY product_id HAVING COUNT(*) > 2)",
        hints: ["Subquery con GROUP BY e HAVING"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems GROUP BY product_id HAVING COUNT(*) < 2)",
        debugHint: "HAVING va dopo GROUP BY."
      },
      {
        titleTemplate: "Stato Avanzato",
        descTemplate: "Lista ID ordini con stato 'Shipped' o 'Delivered' (usando UNION).",
        queryTemplate: "SELECT id FROM Orders WHERE status = 'Shipped' UNION SELECT id FROM Orders WHERE status = 'Delivered'",
        hints: ["UNION di due status"],
        explanation: "Simile a IN/OR ma con UNION.",
        replacements: {},
        brokenCode: "SELECT id FROM Orders WHERE status == 'Shipped' UNION SELECT id FROM Orders WHERE status = 'Delivered'",
        debugHint: "UNION richiede due query complete."
      },
      {
        titleTemplate: "Stock Basso",
        descTemplate: "Prodotti con stock inferiore alla metà della media dello stock.",
        queryTemplate: "SELECT * FROM Products WHERE stock < (SELECT AVG(stock)/2 FROM Products)",
        hints: ["Subquery calcola AVG/2"],
        explanation: "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.",
        replacements: {},
        brokenCode: "SELECT FROM Products WHERE stock < (SELECT AVG(stock)/2 FROM Products)",
        debugHint: "Calcola valore in subquery."
      },
      {
        titleTemplate: "Clienti USA",
        descTemplate: "Trova gli ordini effettuati da utenti USA.",
        queryTemplate: "SELECT * FROM Orders WHERE user_id IN (SELECT id FROM Users WHERE country = 'USA')",
        hints: ["Usa IN (SELECT id FROM Users WHERE country='USA')"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE user_id IN (SELECT id FROM Users WHERE country == 'USA')",
        debugHint: "Filtra Users per country."
      },
      {
        titleTemplate: "Utenti Monitor",
        descTemplate: "Utenti che hanno comprato il prodotto 'Monitor 4K'.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name = 'Monitor 4K')))",
        hints: ["Catena: Product -> OrderItem -> Order -> User"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name == 'Monitor 4K')))",
        debugHint: "Segui le chiavi esterne."
      },
      {
        titleTemplate: "Max Spesa Mario",
        descTemplate: "Il singolo importo più alto speso da 'Mario Rossi'.",
        queryTemplate: "SELECT MAX(order_total) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name = 'Mario Rossi')",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "Aggregazione su subset filtrato da subquery.",
        replacements: {},
        brokenCode: "SELECT MAX(order_total) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name == 'Mario Rossi')",
        debugHint: "Trova id di Mario prima."
      },
      {
        titleTemplate: "Utenti Senza Ordini Easy",
        descTemplate: "Trova utenti senza ordini (usando NOT IN).",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders)",
        hints: ["NOT IN l'elenco user_id di Orders"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE id NOT IN (SELECT user_id FROM Orders)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotti Non Elettronica",
        descTemplate: "Prodotti che NON sono nella categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category != (SELECT category FROM Products WHERE name = 'Smartphone' LIMIT 1)",
        hints: ["Esempio contorto per usare subquery: category != ..."],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category != (SELECT category FROM Products WHERE name == 'Smartphone' LIMIT 1)",
        debugHint: "Se la subquery torna 1 valore, puoi usare !=."
      },
      {
        titleTemplate: "Totale Ordini Mario",
        descTemplate: "Somma totale spesa da 'Mario Rossi'.",
        queryTemplate: "SELECT SUM(order_total) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name = 'Mario Rossi')",
        hints: ["SUM(total)", "user_id = subquery"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT SUM(order_total) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name == 'Mario Rossi')",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Conteggio Ordini Mario",
        descTemplate: "Quanti ordini ha fatto 'Mario Rossi'?",
        queryTemplate: "SELECT COUNT(*) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name = 'Mario Rossi')",
        hints: ["COUNT(*)", "user_id from subquery"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT COUNT(*) FROM Orders WHERE user_id = (SELECT id FROM Users WHERE name == 'Mario Rossi')",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prezzo Minimo Elettronica",
        descTemplate: "Trova il prodotto più economico della categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE price = (SELECT MIN(price) FROM Products WHERE category = 'Electronics') AND category = 'Electronics'",
        hints: ["Trova il MIN(price) per Electronics", "Seleziona prodotto con quel prezzo"],
        explanation: "Selezione record corrispondente a un aggregato.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price = (SELECT MIN(price) FROM Products WHERE category == 'Electronics') AND category = 'Electronics'",
        debugHint: "Min price query."
      },
      {
        titleTemplate: "Dipendenti Non Manager",
        descTemplate: "Dipendenti il cui ID non appare come manager_id di nessuno.",
        queryTemplate: "SELECT * FROM Employees WHERE id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)",
        hints: ["NOT IN (manager_ids)", "Escludi i NULL dalla subquery"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WERE id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)",
        debugHint: "Attenzione ai NULL con NOT IN."
      },
      {
        titleTemplate: "Ordini Weekend (Sim)",
        descTemplate: "Ordini fatti di Sabato o Domenica (usando IN e subquery date - trick).",
        queryTemplate: "SELECT * FROM Orders WHERE DAYOFWEEK(order_date) IN (1, 7)",
        hints: ["DAYOFWEEK: 1=Sun, 7=Sat"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WERE DAYOFWEEK(order_date) IN (1, 7)",
        debugHint: "DAYOFWEEK returns numbers."
      },
      {
        titleTemplate: "Prodotti Categoria Max",
        descTemplate: "Tutti i prodotti della categoria che ha il prodotto più costoso.",
        queryTemplate: "SELECT * FROM Products WHERE category = (SELECT category FROM Products ORDER BY price DESC LIMIT 1)",
        hints: ["Trova category del prodotto più caro", "Filtra per quella category"],
        explanation: "IN filtra le righe il cui valore è presente nella lista specificata. È più leggibile di una catena di OR.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WERE category = (SELECT category FROM Products ORDER BY price DESC LIMIT 1)",
        debugHint: "ORDER BY price DESC LIMIT 1."
      },
      {
        titleTemplate: "Email Staff e Users",
        descTemplate: "Lista unica di email di Staff e Users (UNION).",
        queryTemplate: "SELECT email FROM Employees UNION SELECT email FROM Users",
        hints: ["Seleziona la colonna email dalla tabella Employees", "Usa UNION per unirla alla selezione della colonna email dalla tabella Users"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELCET email FROM Employees UNION SELECT email FROM Users",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Primi 3 Users e Staff",
        descTemplate: "Primi 3 Users uniti ai primi 3 Employees (per ID).",
        queryTemplate: "SELECT name FROM Users WHERE id < 4 UNION SELECT name FROM Employees WHERE id < 4",
        hints: ["Usa parentesi per i LIMIT con UNION"],
        explanation: "UNION combina i risultati di due SELECT in un unico set, eliminando i duplicati. Usa UNION ALL per mantenere tutti i duplicati.",
        replacements: {},
        brokenCode: "SELECT ... LIMIT 3 UNION SELECT ... LIMIT 3",
        debugHint: "Usa le parentesi per i LIMIT individuali."
      },
      {
        titleTemplate: "Ordini 2023",
        descTemplate: "Ordini nell'anno 2023 (YEAR in subquery logic, actually simple).",
        queryTemplate: "SELECT * FROM Orders WHERE YEAR(order_date) = 2023",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "Filtro anno semplice (Advanced Easy per contesto).",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WERE YEAR(order_date) = 2023",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotti Sotto Media Elettronica",
        descTemplate: "Prodotti che costano meno della media della categoria Electronics.",
        queryTemplate: "SELECT * FROM Products WHERE price < (SELECT AVG(price) FROM Products WHERE category = 'Electronics')",
        hints: ["Calcola AVG per Electronics"],
        explanation: "WHERE filtra le righe della tabella in base a una condizione, restituendo solo quelle che la soddisfano.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price < (SELECT AVG(price) FROM Products WHERE category == 'Electronics')",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Prodotti Top Categoria",
        descTemplate: "Prodotti con prezzo superiore alla media della *loro* categoria.",
        queryTemplate: "SELECT * FROM Products p1 WHERE price > (SELECT AVG(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Questa query richiede una 'Subquery Correlata': la subquery deve sapere quale è la categoria della riga esterna", "Nella subquery calcola AVG(price) ma aggiungi una WHERE che colleghi le due tabelle (es. WHERE p2.category = p1.category)"],
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
        queryTemplate: "SELECT e.name FROM Employees e WHERE e.hire_date <= (SELECT m.hire_date FROM Employees m WHERE m.id = e.manager_id)",
        hints: ["Per ogni dipendente, devi trovare la data di assunzione del suo manager", "Usa una subquery che seleziona hire_date da Employees dove id corrisponde al manager_id del dipendente corrente"],
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
        queryTemplate: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems LIMIT 5)",
        hints: ["Escludi i prodotti ordinati da utenti NON premium", "Assicurati che siano stati ordinati almeno una volta"],
        explanation: "Un esercizio di esclusione logica a più livelli.",
        replacements: {},
        brokenCode: "SELECT name FROM Products WERE id IN (SELECT product_id FROM OrderItems LIMIT 5)",
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
        queryTemplate: "SELECT * FROM Users ORDER BY created_at DESC LIMIT 1",
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
        explanation: "ORDER BY con DESC e LIMIT è il pattern classico per ottenere i top-N risultati: ordina dal più grande al più piccolo e prende solo i primi.",
        replacements: {},
        brokenCode: "SELECT category DISTINCT FROM Products p1 WHERE category NOT IN (SELECT category FROM Products p2 WHERE stock > 0)",
        debugHint: "Usa NOT IN su una lista di categorie attive."
      },
      {
        titleTemplate: "Varianza Prezzi",
        descTemplate: "Prodotti con prezzo molto lontano dalla media (> 2 volte).",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price)*2 FROM Products)",
        hints: ["Usa WHERE per filtrare le righe", "Specifica la condizione dopo WHERE"],
        explanation: "DISTINCT elimina le righe duplicate dal risultato, restituendo ogni combinazione di valori una sola volta. È utile per ottenere liste di valori unici.",
        replacements: {},
        brokenCode: "SELECT FROM Products WHERE price > (SELECT AVG(price)*2 FROM Products)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Ordini Multipli",
        descTemplate: "Utenti che hanno fatto più di 1 ordine.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(*) > 1)",
        hints: ["Subquery raggruppa user_id e conta > 1"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(*) < 1)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Nessun Ordine Recente",
        descTemplate: "Utenti che non hanno ordini nel 2023.",
        queryTemplate: "SELECT * FROM Users WHERE id NOT IN (SELECT user_id FROM Orders WHERE YEAR(order_date) = 2023)",
        hints: ["Trova chi ha ordinato nel 2023", "Escludili con NOT IN"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE id NOT IN (SELECT user_id FROM Orders WHERE YEAR(order_date) = 2023)",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Spesa % su Totale",
        descTemplate: "Per ogni ordine, mostra ID e la % sul fatturato totale (Subquery SELECT).",
        queryTemplate: "SELECT id, (order_total / (SELECT SUM(order_total) FROM Orders) * 100) as perc FROM Orders",
        hints: ["Calcola SUM(total) in subquery", "Dividi order_total / SUM * 100"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT id, (order_total / (SELECT SUM(order_total) FROM Orders) * 100) IS perc FROM Orders",
        debugHint: "Subquery nel SELECT."
      },
      {
        titleTemplate: "Clienti Multi-Prodotto",
        descTemplate: "Utenti che hanno ordinato almeno 2 prodotti DIVERSI.",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(DISTINCT product_id) >= 2))",
        hints: ["OrderItems count distinct product_id >= 2", "Risali agli Users"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * DISTINCT FROM Users WHERE id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(DISTINCT product_id) >= 2))",
        debugHint: "Usa AS dopo l'espressione o la colonna per assegnarle un alias."
      },
      {
        titleTemplate: "Best Sellers",
        descTemplate: "Prodotti venduti più della media delle quantità vendute per prodotto.",
        queryTemplate: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems GROUP BY product_id HAVING COUNT(*) > (SELECT COUNT(*)/COUNT(DISTINCT product_id) FROM OrderItems))",
        hints: ["Confronto complesso: Count > Avg Count"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT name DISTINCT FROM Products WHERE id IN (SELECT product_id FROM OrderItems GROUP BY product_id HAVING COUNT(*) > (SELECT COUNT(*)/COUNT(DISTINCT product_id) FROM OrderItems))",
        debugHint: "Subquery in HAVING."
      },
      {
        titleTemplate: "Utenti Sopra-Media",
        descTemplate: "Utenti il cui totale ordini medio è sopra la media globale degli ordini.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id HAVING AVG(order_total) > (SELECT AVG(order_total) FROM Orders)",
        hints: ["AVG(total) per user > AVG(total) globale"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders GROUP user_id HAVING AVG(order_total) > (SELECT AVG(order_total) FROM Orders)",
        debugHint: "HAVING AVG > (SELECT AVG...)."
      },
      {
        titleTemplate: "Categorie Ricche",
        descTemplate: "Categorie con più di 3 prodotti.",
        queryTemplate: "SELECT category FROM Products GROUP BY category HAVING COUNT(*) > 3",
        hints: ["Raggruppa per la colonna category", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT category FROM Products GROUP category HAVING COUNT(*) > 3",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Manager Importanti",
        descTemplate: "Dipendenti che gestiscono più di 2 persone.",
        queryTemplate: "SELECT * FROM Employees WHERE id IN (SELECT manager_id FROM Employees GROUP BY manager_id HAVING COUNT(*) > 2)",
        hints: ["Conta occorrenze di manager_id"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees WHERE id IN (SELECT manager_id FROM Employees GROUP BY manager_id HAVING COUNT(*) < 2)",
        debugHint: "Subquery GROUP BY manager_id."
      },
      {
        titleTemplate: "Ordini Misti",
        descTemplate: "Ordini che contengono prodotti di categorie diverse (Join implicita check).",
        queryTemplate: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) > 1",
        hints: ["Join OrderItems-Products", "Count distinct category > 1"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT order_id DISTINCT FROM OrderItems oi JOIN Products p ON oi.product_id = p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) > 1",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Monitor e Tastiera",
        descTemplate: "Utenti che hanno comprato sia 'Monitor' che 'Keyboard' (Logic Intersection).",
        queryTemplate: "SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name='Monitor')) AND user_id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name='Keyboard')))",
        hints: ["Insieme A AND Insieme B"],
        explanation: "Intersezione di due insiemi di acquirenti.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name== 'Monitor')) AND user_id IN (SELECT user_id FROM Orders WHERE id IN (SELECT order_id FROM OrderItems WHERE product_id = (SELECT id FROM Products WHERE name='Keyboard')))",
        debugHint: "AND tra due condizioni IN."
      },
      {
        titleTemplate: "Prodotti Dormienti",
        descTemplate: "Prodotti non ordinati nell'ultimo mese (usando DATE_SUB in subquery).",
        queryTemplate: "SELECT * FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id WHERE order_date > DATE_SUB(CURDATE(), INTERVAL 1 MONTH))",
        hints: ["Trova prodotti ordinati recentemente", "Usa NOT IN"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE id NOT IN (SELECT product_id FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id WHERE order_date < DATE_SUB(CURDATE(), INTERVAL 1 MONTH))",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Max Ordini Utente",
        descTemplate: "Utente con il maggior numero di ordini.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 1",
        hints: ["Raggruppa per la colonna user_id", "Usa una funzione aggregata come COUNT, SUM o AVG nella SELECT"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders GROUP BY user_id ORDER COUNT(*) DESC LIMIT 1",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Prezzo Medio Mario",
        descTemplate: "Prezzo medio dei prodotti comprati da 'Mario Rossi'.",
        queryTemplate: "SELECT AVG(p.price) FROM OrderItems oi JOIN Products p ON oi.product_id = p.id JOIN Orders o ON oi.order_id = o.id JOIN Users u ON o.user_id = u.id WHERE u.name = 'Mario Rossi'",
        hints: ["Join a 4 tabelle", "AVG(price)"],
        explanation: "GROUP BY raggruppa le righe con lo stesso valore nella colonna specificata. COUNT conta quante righe appartengono a ciascun gruppo.",
        replacements: {},
        brokenCode: "SELECT AVG(p.price) FROM OrderItems oi JOIN Products p ON oi.product_id = p.id JOIN Orders o ON oi.order_id = o.id JOIN Users u ON o.user_id = u.id WHERE u.name == 'Mario Rossi'",
        debugHint: "Attento alle JOIN."
      },
      {
        titleTemplate: "Secondo Più Caro",
        descTemplate: "Il secondo prodotto più costoso.",
        queryTemplate: "SELECT * FROM Products ORDER BY price DESC LIMIT 1 OFFSET 1",
        hints: ["Ordina per price in ordine decrescente (DESC)", "ORDER BY si mette dopo la clausola WHERE (se presente)"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT * FROM Products ORDER price DESC LIMIT 1 OFFSET 1",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini Sopra Max 2",
        descTemplate: "Ordini con totale superiore al massimo ordine dell'utente 2.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > (SELECT MAX(order_total) FROM Orders WHERE user_id = 2)",
        hints: ["Trova MAX(total) user 2", "Confronta"],
        explanation: "ORDER BY con DESC e LIMIT è il pattern classico per ottenere i top-N risultati: ordina dal più grande al più piccolo e prende solo i primi.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_total < (SELECT MAX(order_total) FROM Orders WHERE user_id = 2)",
        debugHint: "Verifica che ORDER BY sia scritto correttamente e che la colonna di ordinamento esista."
      },
      {
        titleTemplate: "Utenti Multi-Cat",
        descTemplate: "Utenti che hanno comprato da più di 2 categorie diverse.",
        queryTemplate: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.id HAVING COUNT(DISTINCT p.category) > 2",
        hints: ["Join completa", "Count distinct category > 2"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT u.name DISTINCT FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY u.id HAVING COUNT(DISTINCT p.category) > 2",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Prodotti Costosi Elettronica",
        descTemplate: "Prodotti che costano più della media della categoria 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products WHERE category = 'Electronics')",
        hints: ["AVG(price) WHERE category='Electronics'"],
        explanation: "Combinare JOIN con GROUP BY permette di aggregare dati provenienti da più tabelle correlate, come calcolare totali per utente dagli ordini.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products WHERE category == 'Electronics')",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Clienti Locali",
        descTemplate: "Clienti che vivono nello stesso paese del dipendente ID 1.",
        queryTemplate: "SELECT * FROM Users WHERE country = (SELECT 'Italy' FROM Employees WHERE id = 1)",
        hints: ["Subquery country Employee 1 (Assumi Italy o campo)"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WERE country = (SELECT 'Italy' FROM Employees WHERE id = 1)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Ordini Anomali",
        descTemplate: "Ordini con un numero di item superiore alla media degli item per ordine.",
        queryTemplate: "SELECT order_id FROM OrderItems GROUP BY order_id HAVING COUNT(*) > (SELECT COUNT(*)/COUNT(DISTINCT order_id) FROM OrderItems)",
        hints: ["Confronta COUNT(*) ordine corrente con media globale items/ordine"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT order_id DISTINCT FROM OrderItems GROUP BY order_id HAVING COUNT(*) > (SELECT COUNT(*)/COUNT(DISTINCT order_id) FROM OrderItems)",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Solo Elettronica",
        descTemplate: "Utenti che hanno comprato SOLO Electronics (Exclusion logic).",
        queryTemplate: "SELECT user_id FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY user_id HAVING COUNT(DISTINCT CASE WHEN p.category != 'Electronics' THEN p.id END) = 0",
        hints: ["HAVING count non-electronics = 0"],
        explanation: "Le subquery permettono di annidare una query dentro un'altra, creando filtri o calcoli basati su risultati intermedi.",
        replacements: {},
        brokenCode: "SELECT user_id DISTINCT FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id GROUP BY user_id HAVING COUNT(DISTINCT CASE WHEN p.category != 'Electronics' THEN p.id END) = 0",
        debugHint: "Condizione negativa in HAVING."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Best Seller Assoluto",
        descTemplate: "Il prodotto con la maggior quantità totale venduta.",
        queryTemplate: "SELECT name FROM Products WHERE id = (SELECT product_id FROM OrderItems GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 1)",
        hints: ["Lavora su OrderItems: raggruppa per product_id e calcola la somma delle quantità", "Ordina il risultato in modo decrescente e usa LIMIT 1 per prendere solo l'ID del prodotto più venduto", "Usa questo ID per trovare il nome del prodotto nella tabella Products"],
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
        brokenCode: "SELECT FROM Users WHERE id NOT IN (SELECT user_id FROM Orders WHERE order_date >= '2023-01-01')",
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
        descTemplate: "Dipendenti che non hanno manager (CEO) e non sono manager di nessuno.",
        queryTemplate: "SELECT name FROM Employees WHERE manager_id IS NULL AND id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)",
        hints: ["Filtra manager_id IS NULL per trovare il CEO", "Assicurati che il suo ID non sia presente tra i manager_id di altri dipendenti (NOT IN)"],
        explanation: "Uniamo le due condizioni per trovare dipendenti senza superiori e senza subordinati diretti.",
        replacements: {},
        brokenCode: "SELECT name FROM Employees WHERE manager_id = NULL AND id NOT IN (SELECT manager_id FROM Employees)",
        debugHint: "Attento a confrontare i NULL (usa IS NULL) e a gestire eventuali record NULL nella subquery con NOT IN."
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
        hints: ["Per ogni ordine, usa una subquery per trovare il valore massimo di una singola riga (unit_price * quantity) nella tabella OrderItems", "Confronta questo valore con la metà del totale dell'ordine (order_total * 0.5)"],
        explanation: "Analisi della distribuzione del valore dentro un ordine.",
        replacements: {},
        brokenCode: "SELECT id FROM Orders o WHERE (SELECT MAX(unit_price quantity) FROM OrderItems i WHERE i.order_id = o.id) > o.order_total * 0.5",
        debugHint: "Devi calcolare il valore della riga (prezzo*qta) non solo il prezzo unitario."
      },
      {
        titleTemplate: "Super Utenti",
        descTemplate: "Utenti che hanno speso più della media di spesa degli utenti Premium.",
        queryTemplate: "SELECT * FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.id, u.name HAVING SUM(o.order_total) > (SELECT AVG(total_spent) FROM (SELECT SUM(order_total) as total_spent FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE is_premium=true GROUP BY Users.id) as sub)",
        hints: ["Questa è complessa: Step 1) Calcola la spesa totale per ogni utente Premium", "Step 2) Calcola la MEDIA di queste spese totali", "Step 3) Filtra gli utenti che hanno speso più di questa media"],
        explanation: "Confronto avanzato tra segmenti di clientela.",
        replacements: {},
        brokenCode: "SELECT * FROM Users u JOIN Orders o ON u.id = o.user_id GROUP BY u.id, u.name HAVING SUM(o.order_total) > (SELECT AVG(total_spent) FROM (SELECT SUM(order_total) IS total_spent FROM Orders JOIN Users ON Orders.user_id = Users.id WHERE is_premium=true GROUP BY Users.id) as sub)",
        debugHint: "È un calcolo a più livelli: somma per utente, poi media di quelle somme."
      },
      {
        titleTemplate: "Categoria Ricca",
        descTemplate: "Categoria con la somma totale dei prezzi di listino più alta.",
        queryTemplate: "SELECT category FROM Products GROUP BY category ORDER BY SUM(price) DESC LIMIT 1",
        hints: ["Raggruppa per categoria", "Somma i prezzi", "Ordina e limita"],
        explanation: "Valutazione del valore di inventario per categoria.",
        replacements: {},
        brokenCode: "SELECT category FROM Products GROUP BY category ORDER SUM(price) DESC LIMIT 1",
        debugHint: "SUM(price) e ORDER BY DESC."
      },
      {
        titleTemplate: "Ordini Fantasma",
        descTemplate: "Ordini associati a utenti che non esistono più (violazione integrità, simulata).",
        queryTemplate: "SELECT * FROM Orders WHERE user_id NOT IN (SELECT id FROM Users)",
        hints: ["Controlla user_id vs Users.id"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WERE user_id NOT IN (SELECT id FROM Users)",
        debugHint: "NOT IN Users."
      },
      {
        titleTemplate: "Concorrenza Interna",
        descTemplate: "Prodotti che costano più del prodotto più costoso della categoria 'Home'.",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT MAX(price) FROM Products WHERE category = 'Home')",
        hints: ["Trova max price category Home", "Filtra products > quel valore"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price > (SELECT MAX(price) FROM Products WHERE category == 'Home')",
        debugHint: "MAX(price) con WHERE category = 'Home'."
      },
      {
        titleTemplate: "Fedeltà Mensile",
        descTemplate: "Utenti che hanno fatto ordini in mesi diversi (almeno 2 mesi diversi).",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id HAVING COUNT(DISTINCT MONTH(order_date)) >= 2",
        hints: ["Usa MONTH(order_date)", "COUNT DISTINCT"],
        explanation: "Analisi della frequenza di acquisto nel tempo.",
        replacements: {},
        brokenCode: "SELECT user_id DISTINCT FROM Orders GROUP BY user_id HAVING COUNT(DISTINCT MONTH(order_date)) >= 2",
        debugHint: "AlaSQL supporta MONTH()."
      },
      {
        titleTemplate: "Senza Sconto",
        descTemplate: "Prodotti mai venduti a un prezzo inferiore al prezzo di listino.",
        queryTemplate: "SELECT name FROM Products p WHERE NOT EXISTS (SELECT 1 FROM OrderItems i WHERE i.product_id = p.id AND i.unit_price < p.price)",
        hints: ["Cerca items con unit_price < p.price", "Usa NOT EXISTS"],
        explanation: "Verifica della tenuta del prezzo di mercato.",
        replacements: {},
        brokenCode: "SELECT name FROM Products p WERE NOT EXISTS (SELECT 1 FROM OrderItems i WHERE i.product_id = p.id AND i.unit_price < p.price)",
        debugHint: "Confronta unit_price con p.price corrente."
      },
      {
        titleTemplate: "Reparto Produttivo",
        descTemplate: "Dipartimenti dove TUTTI i membri sono stati assunti dopo l'inizio del 2021 ('2021-01-01').",
        queryTemplate: "SELECT department FROM Employees GROUP BY department HAVING COUNT(*) = SUM(CASE WHEN hire_date >= '2021-01-01' THEN 1 ELSE 0 END)",
        hints: ["Raggruppa per dipartimento e ragiona per conteggi: quanti membri ha il reparto e quanti di questi sono assunzioni recenti?", "Se il numero di assunti dopo la data coincide con il totale dei membri, allora non c'è nessun veterano nel gruppo. Un SUM con CASE dentro l'HAVING ti dà quel conteggio condizionale."],
        explanation: "Il confronto tra COUNT(*) e la somma condizionale dice che ogni membro rispetta la condizione: se anche uno solo fosse stato assunto prima, la somma sarebbe più bassa del totale e il reparto verrebbe escluso. Nota che qui non si usa MIN(hire_date): il motore SQL del browser non aggrega le date come farebbe Postgres, quindi il conteggio condizionale è la via affidabile.",
        replacements: {},
        brokenCode: "SELECT department FROM Employees GROUP department HAVING MIN(hire_date) == '2021-01-01'",
        debugHint: "Manca la 'BY' nel GROUP BY, e l'operatore corretto è '>='."
      },
      {
        titleTemplate: "Elite Club",
        descTemplate: "Utenti che hanno comprato solo prodotti sopra i 100€.",
        queryTemplate: "SELECT DISTINCT user_id FROM Orders o WHERE NOT EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id = p.id WHERE i.order_id = o.id AND p.price <= 100)",
        hints: ["Escludi utenti che hanno comprato roba economica", "Doppia negazione"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT user_id DISTINCT FROM Orders o WHERE NOT EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id = p.id WHERE i.order_id = o.id AND p.price <= 100)",
        debugHint: "È più facile trovare chi ha comprato cose economiche ed escluderli."
      },
      {
        titleTemplate: "Merce Ferma",
        descTemplate: "Prodotti con stock > 0 ma nessun ordine negli ultimi 3 mesi (simulato con data fissa).",
        queryTemplate: "SELECT * FROM Products p WHERE stock > 0 AND p.id NOT IN (SELECT product_id FROM OrderItems i JOIN Orders o ON i.order_id = o.id WHERE o.order_date > '2023-09-01')",
        hints: ["Filtra prodotti venduti recentemente", "Escludili dalla lista prodotti con stock"],
        explanation: "Analisi inventory turnover per identificare 'dead stock'.",
        replacements: {},
        brokenCode: "SELECT FROM Products p WHERE stock > 0 AND p.id NOT IN (SELECT product_id FROM OrderItems i JOIN Orders o ON i.order_id = o.id WHERE o.order_date > '2023-09-01')",
        debugHint: "Combina check magazzino con check storico ordini."
      },
      {
        titleTemplate: "Top 3 Per Categoria",
        descTemplate: "I 3 prodotti più costosi di OGNI categoria (Correlated Subquery trick).",
        queryTemplate: "SELECT * FROM Products p1 WHERE (SELECT COUNT(*) FROM Products p2 WHERE p2.category = p1.category AND p2.price > p1.price) < 3",
        hints: ["Conta quanti prodotti nella stessa categoria costano PIÙ di me", "Se sono meno di 3, io sono nei top 3"],
        explanation: "Tecnica classica per simulare RANK/PARTITION BY in SQL standard.",
        replacements: {},
        brokenCode: "SELECT * FROM Products p1 WHERE (SELECT COUNT(*) FROM Products p2 WHERE p2.category = p1.category AND p2.price < p1.price) < 3",
        debugHint: "Correlazione p2.price > p1.price."
      },
      {
        titleTemplate: "Acquisto Esclusivo",
        descTemplate: "ID degli utenti che hanno comprato un 'Monitor 4K' ma NON hanno alcun ordine per una 'Keyboard'.",
        queryTemplate: "SELECT id FROM Users u WHERE EXISTS (SELECT 1 FROM Orders o JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE o.user_id = u.id AND p.name = 'Monitor 4K') AND NOT EXISTS (SELECT 1 FROM Orders o2 JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE o2.user_id = u.id AND p2.name = 'Keyboard')",
        hints: ["Ti servono due condizioni sullo stesso utente: una che deve esistere e una che non deve esistere.", "Correla le sottoquery all'utente esterno (o.user_id = u.id) e usa EXISTS per la presenza del Monitor, NOT EXISTS per l'assenza della Keyboard."],
        explanation: "EXISTS si ferma appena trova una riga che soddisfa la condizione per quell'utente, NOT EXISTS richiede che non ne esista nessuna. Le due sottoquery sono correlate: il legame o.user_id = u.id le àncora all'utente della riga esterna. Qui EXISTS è preferibile a IN e NOT IN anche perché il motore SQL del browser non combina bene una IN e una NOT IN su sottoquery nella stessa WHERE.",
        replacements: {},
        brokenCode: "SELECT id FROM Users WHERE id IN (SELECT user_id FROM Orders... WHERE name = 'Monitor 4K') AND id = (SELECT user_id FROM Orders... WHERE name = 'Keyboard')",
        debugHint: "Usa due subquery separate e combinare IN con NOT IN."
      },
      {
        titleTemplate: "Miglioramento Storico",
        descTemplate: "Trova gli ID degli ordini in cui l'utente ha speso più della sua stessa spesa media storica globale (di quell'utente).",
        queryTemplate: "SELECT id FROM Orders o1 WHERE order_total > (SELECT AVG(order_total) FROM Orders o2 WHERE o2.user_id = o1.user_id)",
        hints: ["Per ogni ordine, usa una subquery correlata per calcolare la media (AVG) degli order_total per quello user_id", "Filtra per order_total maggiore della media calcolata"],
        explanation: "Una subquery correlata calcola la media di spesa storicizzata e la confronta riga per riga con ogni singolo ordine della query esterna.",
        replacements: {},
        brokenCode: "SELECT id FROM Orders o1 WHERE order_total > (SELECT AVG(order_total) FROM Orders o2 WHERE o2.id = o1.id)",
        debugHint: "La media deve essere calcolata storicamente per lo stesso utente (user_id), non per lo stesso id dell'ordine."
      },
      {
        titleTemplate: "Prodotti 'Ponte'",
        descTemplate: "Prodotti comprati sia da utenti Italiani che da utenti USA.",
        queryTemplate: "SELECT name FROM Products p WHERE EXISTS (SELECT 1 FROM OrderItems i JOIN Orders o ON i.order_id=o.id JOIN Users u ON o.user_id=u.id WHERE i.product_id=p.id AND u.country='Italy') AND EXISTS (SELECT 1 FROM OrderItems i JOIN Orders o ON i.order_id=o.id JOIN Users u ON o.user_id=u.id WHERE i.product_id=p.id AND u.country='USA')",
        hints: ["EXISTS Italieni", "EXISTS Americani"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT name FROM Products p WHERE EXISTS (SELECT 1 FROM OrderItems i JOIN Orders o ON i.order_id=o.id JOIN Users u ON o.user_id=u.id WHERE i.product_id=p.id AND u.country== 'Italy') AND EXISTS (SELECT 1 FROM OrderItems i JOIN Orders o ON i.order_id=o.id JOIN Users u ON o.user_id=u.id WHERE i.product_id=p.id AND u.country='USA')",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Clienti Ricorrenti",
        descTemplate: "Utenti con almeno due ordini nello stesso giorno.",
        queryTemplate: "SELECT user_id FROM Orders GROUP BY user_id, order_date HAVING COUNT(*) >= 2",
        hints: ["Group by user AND date", "Having count >= 2"],
        explanation: "EXISTS verifica se la subquery correlata restituisce almeno una riga. È spesso più efficiente di IN per dataset grandi.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders GROUP user_id, order_date HAVING COUNT(*) >= 2",
        debugHint: "Raggruppa su due colonne."
      },
      {
        titleTemplate: "Coppia Prodotti",
        descTemplate: "Utenti che hanno comprato 'Smartphone' e 'Cover' nello stesso ordine.",
        queryTemplate: "SELECT o.user_id FROM Orders o WHERE EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id=p.id WHERE i.order_id=o.id AND p.name='Smartphone') AND EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id=p.id WHERE i.order_id=o.id AND p.name='Cover')",
        hints: ["Check due prodotti nello stesso order_id"],
        explanation: "HAVING filtra i gruppi dopo l'aggregazione, a differenza di WHERE che filtra le righe prima del raggruppamento. Si usa con GROUP BY.",
        replacements: {},
        brokenCode: "SELECT o.user_id FROM Orders o WHERE EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id=p.id WHERE i.order_id=o.id AND p.name== 'Smartphone') AND EXISTS (SELECT 1 FROM OrderItems i JOIN Products p ON i.product_id=p.id WHERE i.order_id=o.id AND p.name='Cover')",
        debugHint: "Stesso order_id per entrambi i prodotti."
      },
      {
        titleTemplate: "Acquirenti Versatili",
        descTemplate: "ID degli utenti che hanno registrato sia un ordine consistente (totale > 500) sia un ordine molto piccolo (totale < 50).",
        queryTemplate: "SELECT id FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE user_id = Users.id AND order_total > 500) AND EXISTS (SELECT 1 FROM Orders WHERE user_id = Users.id AND order_total < 50)",
        hints: ["Devono verificarsi due condizioni indipendenti", "Usa la logica combinando due condizioni EXISTS separate con AND"],
        explanation: "Controllare più clausole EXISTS in serie permette di testare più scenari complessi sulla stessa entità radice, mantenendo la query performante e chiarissima.",
        replacements: {},
        brokenCode: "SELECT id FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE user_id = Users.id AND order_total > 500 AND order_total < 50)",
        debugHint: "Un singolo ordine non può avere contemporaneamente avere totale > 500 e < 50! Ti servono due EXISTS."
      },
      {
        titleTemplate: "Stagionalità",
        descTemplate: "Mese con il maggior fatturato totale.",
        queryTemplate: "SELECT MONTH(order_date) as m FROM Orders GROUP BY m ORDER BY SUM(order_total) DESC LIMIT 1",
        hints: ["Group by Month", "Order by Sum total"],
        explanation: "JOIN collega righe di tabelle diverse attraverso una condizione di corrispondenza, permettendo di combinare informazioni correlate in un unico risultato.",
        replacements: {},
        brokenCode: "SELECT MONTH(order_date) IS m FROM Orders GROUP BY m ORDER BY SUM(order_total) DESC LIMIT 1",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Utenti Inattivi Lungo",
        descTemplate: "Utenti registrati da più di un anno che hanno fatto 0 ordini.",
        queryTemplate: "SELECT * FROM Users WHERE created_at < '2023-01-01' AND id NOT IN (SELECT user_id FROM Orders)",
        hints: ["Filtra per created_at", "NOT IN Orders"],
        explanation: "GROUP BY con SUM calcola il totale per ogni gruppo. È fondamentale per report di vendite, fatturato e volumi.",
        replacements: {},
        brokenCode: "SELECT FROM Users WHERE created_at < '2023-01-01' AND id NOT IN (SELECT user_id FROM Orders)",
        debugHint: "Assicurati di avere GROUP BY e che tutte le colonne non aggregate siano nel raggruppamento."
      },
      {
        titleTemplate: "Prezzo Mediano (Sim)",
        descTemplate: "Trova il prodotto che sta a metà classifica di prezzo (Ranking trick).",
        queryTemplate: "SELECT * FROM Products p1 WHERE (SELECT COUNT(*) FROM Products p2 WHERE p2.price <= p1.price) >= (SELECT COUNT(*) FROM Products p3) / 2",
        hints: ["Conta quanti costano meno", "Confronta con metà del count totale"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT FROM Products p1 WHERE (SELECT COUNT(*) FROM Products p2 WHERE p2.price <= p1.price) >= (SELECT COUNT(*) FROM Products p3) / 2",
        debugHint: "Difficile: conta i 'minori o uguali'."
      },
      {
        titleTemplate: "Innamorati Delle Categorie",
        descTemplate: "Trova gli ID utente (user_id) che hanno acquistato TUTTI i prodotti univoci che esistono nella categoria 'Accessories'.",
        queryTemplate: "SELECT user_id FROM Orders JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id WHERE Products.category = 'Accessories' GROUP BY user_id HAVING COUNT(DISTINCT Products.id) = (SELECT COUNT(*) FROM Products WHERE category = 'Accessories')",
        hints: ["Esegui una divisione relazionale contando!", "Combina le tre tabelle (Ordini, Dettagli, Prodotti), raggruppa per user_id, e filtra con HAVING per matchare il COUNT(DISTINCT id) di quei prodotti acquistati nella categoria con il COUNT totale dei prodotti nella stessa categoria"],
        explanation: "Conta il mismatching univoco: se il numero di prodotti unici diversi acquistati dall'utente per quella categoria corrisponde esattamente al totale, allora li ha acquistati tutti.",
        replacements: {},
        brokenCode: "SELECT user_id FROM Orders ... HAVING COUNT(Products.id) = (SELECT COUNT(*) FROM Products WHERE category = 'Accessories')",
        debugHint: "Senza DISTINCT, l'utente potrebbe aver comprato 5 volte lo stesso prodotto e ti scambierebbe quel risultato come target superato."
      },
      {
        titleTemplate: "Regioni Vuote",
        descTemplate: "Paesi (presi dagli Utenti) dove non ci sono ordini sopra i 500€.",
        queryTemplate: "SELECT DISTINCT country FROM Users u1 WHERE NOT EXISTS (SELECT 1 FROM Orders o JOIN Users u2 ON o.user_id=u2.id WHERE u2.country=u1.country AND o.order_total > 500)",
        hints: ["Per ogni paese, check se esiste order > 500", "Se non esiste, selezionalo"],
        explanation: "LIMIT restringe il numero di righe restituite al massimo specificato. Utile per campionamento, paginazione e top-N.",
        replacements: {},
        brokenCode: "SELECT country DISTINCT FROM Users u1 WHERE NOT EXISTS (SELECT 1 FROM Orders o JOIN Users u2 ON o.user_id=u2.id WHERE u2.country=u1.country AND o.order_total > 500)",
        debugHint: "Correlazione su country."
      },
      {
        titleTemplate: "Dipendenti Sottopagati",
        descTemplate: "Dipendenti assunti dopo il 2021 che però sono manager.",
        queryTemplate: "SELECT * FROM Employees WHERE hire_date > '2021-01-01' AND id IN (SELECT manager_id FROM Employees)",
        hints: ["Filtra data", "Check se sono manager"],
        explanation: "COUNT(DISTINCT ...) conta i valori unici, eliminando i duplicati prima del conteggio.",
        replacements: {},
        brokenCode: "SELECT FROM Employees WHERE hire_date > '2021-01-01' AND id IN (SELECT manager_id FROM Employees)",
        debugHint: "Controlla che la clausola JOIN abbia sia la tabella che la condizione ON."
      },
      {
        titleTemplate: "Ordini per Giorno",
        descTemplate: "Giorno della settimana con più ordini in assoluto.",
        queryTemplate: "SELECT DAYNAME(order_date) as d FROM Orders GROUP BY d ORDER BY COUNT(*) DESC LIMIT 1",
        hints: ["DAYNAME o DAYOFWEEK", "Group by, count, order desc"],
        explanation: "Una subquery con IN filtra le righe il cui valore è presente nel set restituito dalla query interna. Questo approccio è leggibile e modulare.",
        replacements: {},
        brokenCode: "SELECT DAYNAME(order_date) IS d FROM Orders GROUP BY d ORDER BY COUNT(*) DESC LIMIT 1",
        debugHint: "Controlla la sintassi della clausola WHERE e i valori nel confronto."
      },
      {
        titleTemplate: "Full House",
        descTemplate: "Gli order_id degli ordini che contengono al loro interno prodotti da TUTTE le categorie merceologiche esistenti nel catalogo.",
        queryTemplate: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id=p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) = (SELECT COUNT(DISTINCT category) FROM Products)",
        hints: ["Raggruppa per order_id e conta in modo unito (COUNT DISTINCT) le categorie di quel calcolo", "Confrontalo (con un HAVING uguaglianza) rispetto alla query (SELECT COUNT(DISTINCT category) FROM Products) in una subquery"],
        explanation: "Ancora un caso di divisione relazionale. Raggiungere l'insieme matematico esatto contando i rami raggruppabili (distinct count).",
        replacements: {},
        brokenCode: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id=p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) = COUNT(DISTINCT category)",
        debugHint: "Devi calcolare il conteggio generale usando una subquery completa indipendente (SELECT COUNT...)."
      },
      {
        titleTemplate: "CTE - Sopra la Media",
        descTemplate: "Utilizza una Common Table Expression (CTE) chiamata 'avg_price' per calcolare il prezzo medio, poi seleziona tutte le colonne dei prodotti che costano più di quella media.",
        queryTemplate: "WITH avg_price AS (SELECT AVG(price) AS media FROM Products) SELECT p.* FROM Products p, avg_price WHERE p.price > avg_price.media",
        hints: ["Definisci la CTE all'inizio: WITH avg_price AS (SELECT AVG(price) AS media FROM Products)", "Poi includi la CTE nella FROM insieme a Products (FROM Products p, avg_price) e filtra con WHERE p.price > avg_price.media"],
        explanation: "Le CTE (Common Table Expressions) con WITH isolano un calcolo — qui il prezzo medio — e lo rendono riutilizzabile nella query principale mettendolo nella FROM come se fosse una tabella, mantenendo la logica leggibile.",
        replacements: {},
        brokenCode: "WITH avg_price AS (SELECT AVG(price) AS media FROM Products) SELECT p.* FROM Products p WHERE p.price > avg_price.media",
        debugHint: "Per usare la CTE devi includerla nella clausola FROM (FROM Products p, avg_price), altrimenti avg_price non è visibile nella WHERE."
      },
      {
        titleTemplate: "CTE - Top Performers",
        descTemplate: "Utilizzando una CTE, calcola il fatturato totale (SUM(order_total)) generato da ogni 'user_id' e chiamala 'user_totals'. Ritorna gli 'user_id' e il loro 'totale' se maggiore di 1000.",
        queryTemplate: "WITH user_totals AS (SELECT user_id, SUM(order_total) AS totale FROM Orders GROUP BY user_id) SELECT user_id, totale FROM user_totals WHERE totale > 1000",
        hints: ["Crea una CTE 'user_totals' che raggruppa per user_id e calcola il fatturato as totale", "Nella query principale (che viene eseguita dopo), estrai i flag e limita con un normale WHERE (poiché totale a quel punto è considerata una colonna statica calcolata)"],
        explanation: "La CTE prepara uno strato aggregato virtuale temporaneo, semplificando notevolmente i filtri e mascherando limitazioni del costrutto HAVING.",
        replacements: {},
        brokenCode: "WITH user_totals AS (SELECT user_id, SUM(order_total) AS totale FROM Orders GROUP BY user_id) SELECT user_id, totale FROM user_totals HAVING totale > 1000",
        debugHint: "Quando interroghi la CTE nella query principale, usa semplicemente WHERE al posto di HAVING per i suoi risultati finali calcolati."
      },
      {
        titleTemplate: "Classifica per Prezzo (Ranking)",
        descTemplate: "Ritorna nome e prezzo di ogni prodotto con la sua posizione in classifica per prezzo decrescente (il più caro è 1). A parità di prezzo la posizione è la stessa. Usa l'alias 'posizione'.",
        queryTemplate: "SELECT p1.name, p1.price, (SELECT COUNT(*) FROM Products p2 WHERE p2.price > p1.price) + 1 AS posizione FROM Products p1",
        hints: ["La posizione di un prodotto è pari a quanti prodotti costano PIÙ di lui, più 1", "Usa una subquery correlata che conta le righe con p2.price > p1.price, dando due alias diversi (p1 e p2) alla stessa tabella"],
        explanation: "Questo è il pattern portabile per assegnare un rango: per ogni riga conti quante righe la superano e aggiungi 1. A prezzi uguali la posizione coincide, con un salto dopo il gruppo (semantica di RANK). Nei database moderni lo stesso risultato si ottiene con la window function RANK() OVER (ORDER BY price DESC).",
        replacements: {},
        brokenCode: "SELECT p1.name, p1.price, (SELECT COUNT(*) FROM Products p2 WHERE p2.price > p1.price) AS posizione FROM Products p1",
        debugHint: "Il conteggio dei prodotti più cari vale 0 per il prodotto più costoso: aggiungi + 1 al risultato della subquery perché la classifica parta da 1."
      },
      {
        titleTemplate: "Classifica per Categoria (Ranking Denso)",
        descTemplate: "Per ogni prodotto restituisci nome, categoria, prezzo e la sua posizione DENTRO la propria categoria (prezzo decrescente). La classifica non deve avere buchi: a prezzi uguali stessa posizione, la successiva prosegue senza salti. Usa l'alias 'cat_rank'.",
        queryTemplate: "SELECT p1.name, p1.category, p1.price, (SELECT COUNT(DISTINCT p2.price) FROM Products p2 WHERE p2.category = p1.category AND p2.price > p1.price) + 1 AS cat_rank FROM Products p1",
        hints: ["Lavora dentro la stessa categoria: la subquery deve filtrare p2.category = p1.category", "Per non lasciare buchi conta i PREZZI DISTINTI più alti con COUNT(DISTINCT p2.price), non le righe; poi aggiungi 1"],
        explanation: "Contando i prezzi DISTINTI superiori (invece delle righe) la numerazione non salta i valori in pareggio: 1, 2, 2, 3 anziché 1, 2, 2, 4. Il filtro sulla categoria 'partiziona' i dati. È l'equivalente portabile di DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC).",
        replacements: {},
        brokenCode: "SELECT p1.name, p1.category, p1.price, (SELECT COUNT(DISTINCT p2.price) FROM Products p2 WHERE p2.price > p1.price) + 1 AS cat_rank FROM Products p1",
        debugHint: "Senza il filtro p2.category = p1.category la classifica confronta l'intero catalogo invece della singola categoria: aggiungi la condizione sulla categoria dentro la subquery."
      },
      {
        titleTemplate: "Generazione Costrutti (ROW_NUMBER)",
        descTemplate: "Restituisci l'email dei dipendenti, numerando ciascuna riga progressivamente dalla data di assunzione meno recente (hire_date crescente). Usa ROW_NUMBER() as 'id_seq'.",
        queryTemplate: "SELECT email, ROW_NUMBER() OVER (ORDER BY hire_date ASC) AS id_seq FROM Employees",
        hints: ["La funzione pura ROW_NUMBER() assegna unicamente numeri seriali continui crescenti, ignorando del tutto i pareggi statistici", "Usa la finestra protetta OVER configurandola in modo che segua l'ordinamento cronologico crescente di hire_date"],
        explanation: "ROW_NUMBER() numera inesorabilmente e stabilmente le righe analitiche mostrate 1, 2, 3... utile per impaginazioni fisiche fisse e stabili o per generare ID artificiali temporanei e numerici 'on the fly'.",
        replacements: {},
        brokenCode: "SELECT email, ROW_NUMBER() OVER (ORDER BY hire_date ASC) FROM Employees",
        debugHint: "Ricorda di attribuire semantica al nome calcolato all'alias logico inserendo 'as id_seq'."
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

// SqlGym calls generateExercises without a count, so it shows up to this many
// exercises per difficulty. Keep in sync with the default of generateExercises.
const SQL_SHOWN_PER_DIFFICULTY = 30;

// Real number of distinct exercises available per topic (summed over the three
// difficulties, capped at what the gym actually shows). Used by Analytics for
// correct completion percentages instead of the old hardcoded 60.
export const SQL_TOPIC_TOTALS: Record<string, number> = Object.fromEntries(
  Object.entries(QUESTION_DATABASE).map(([topicId, byDifficulty]) => [
    topicId,
    Object.values(byDifficulty).reduce(
      (sum, blueprints) => sum + Math.min(blueprints.length, SQL_SHOWN_PER_DIFFICULTY),
      0
    ),
  ])
);
