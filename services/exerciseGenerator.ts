
import { Difficulty, Exercise, TopicId } from '../types';

// --- UTILS ---
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Shuffle array function
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// --- DATA LISTS ---
const DATA = {
    tables: ['utenti', 'prodotti', 'ordini', 'spedizioni', 'categorie', 'fornitori', 'recensioni'],
    columns_users: ['nome', 'email', 'paese', 'premium'],
    columns_products: ['nome', 'prezzo', 'stock'],
    countries: ['Italia', 'Francia', 'Germania', 'Spagna', 'USA', 'Olanda', 'Regno Unito', 'Giappone', 'Canada'],
    names: ['Mario Rossi', 'Luigi Verdi', 'John Doe', 'Sophie Martin', 'Marco', 'Giulia', 'Luca', 'Alice'],
    categories: ['Elettronica', 'Casa', 'Abbigliamento', 'Libri', 'Giardinaggio', 'Sport', 'Beauty'],
    suppliers: ['TechSolutions', 'GlobalTrade', 'LogisticaVelocissima', 'SoftWareHouse', 'FreshFoods', 'Nordic Supplies'],
    couriers: ['DHL', 'UPS', 'Bartolini', 'FedEx', 'GLS', 'Poste Italiane'],
    product_names: ['Laptop Pro', 'Smartphone X', 'Monitor 4K', 'T-Shirt Basic', 'Divano Moderno'],
    prices_min: [10, 20, 50, 100, 150],
    prices_max: [200, 300, 500, 1000, 2000],
    years: [2022, 2023, 2024],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    percentages: [1.1, 1.22, 0.9, 0.8, 1.5],
    categories_ids: [1, 2, 3],
    stock_thresholds: [5, 10, 20, 50]
};

// --- BLUEPRINT INTERFACE ---
interface ExerciseBlueprint {
    titleTemplate: string;
    descTemplate: string;
    queryTemplate: string;
    hints: string[];
    explanation: string;
    replacements?: Record<string, (string | number)[]>;
    brokenCode?: string;        // For Debug Mode: query with intentional error
    debugHint?: string;         // For Debug Mode: hint about the error
}

// --- QUESTION DATABASE ---
const QUESTION_DATABASE: Record<string, Record<string, ExerciseBlueprint[]>> = {
    [TopicId.Basics]: {
        [Difficulty.Easy]: [
            {
                titleTemplate: "Audit Totale: {table}",
                descTemplate: "Il Responsabile IT richiede un'estrazione completa della tabella '{table}' per controlli di integrità. Seleziona tutte le colonne e tutte le righe.",
                queryTemplate: "SELECT * FROM {table}",
                hints: ["Per selezionare tutte le colonne, esiste un carattere jolly apposito (*).", "La struttura base è: SELECT [colonne] FROM [tabella]."],
                explanation: "SELECT * è il comando standard per ispezionare l'intero contenuto di una tabella.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'categorie', 'recensioni'] },
                brokenCode: "SELETC * FROM {table}",
                debugHint: "Controlla attentamente come hai scritto il comando 'SELECT'. C'è un errore di battitura."
            },
            {
                titleTemplate: "Estrazione {col} Utenti",
                descTemplate: "Il team Marketing necessita di una lista contenente solo la colonna '{col}' dalla tabella 'utenti' per una campagna mirata.",
                queryTemplate: "SELECT {col} FROM utenti",
                hints: ["Specifica il nome della colonna desiderata dopo il comando SELECT.", "Non usare * se ti serve solo un campo specifico."],
                explanation: "Selezionare solo le colonne necessarie ottimizza le performance e la privacy.",
                replacements: { col: ['email', 'nome', 'paese', 'premium'] },
                brokenCode: "SELECT {col} FORM utenti",
                debugHint: "La parola chiave 'FROM' sembra scritta male. Verifica lo spelling."
            },
            {
                titleTemplate: "Listino Prezzi: {col}",
                descTemplate: "Genera un report rapido che mostri esclusivamente la colonna '{col}' dalla tabella 'prodotti'.",
                queryTemplate: "SELECT {col} FROM prodotti",
                hints: ["Indica la colonna '{col}' dopo SELECT.", "Specifica la tabella di origine corretta."],
                explanation: "La proiezione (selezione di colonne specifiche) permette di creare report focalizzati.",
                replacements: { col: ['nome', 'prezzo', 'stock', 'categoria_id'] },
                brokenCode: "SELECT {col} FROM prodoti",
                debugHint: "Il nome della tabella 'prodotti' contiene un errore. Controlla le doppie lettere."
            },
            {
                titleTemplate: "Visualizza Tutti gli Ordini",
                descTemplate: "Il reparto Logistica deve pianificare le spedizioni della settimana. Visualizza l'elenco completo di tutti gli ordini presenti nel database, includendo ogni dettaglio disponibile.",
                queryTemplate: "SELECT * FROM ordini",
                hints: ["Usa SELECT * per recuperare tutte le informazioni.", "La tabella da interrogare è 'ordini'.", "Non applicare nessun filtro WHERE."],
                explanation: "Visualizzare tutti i record è il primo passo per l'analisi dei dati operativi.",
                replacements: {},
                brokenCode: "SELECT * FROM ordini,",
                debugHint: "Hai lasciato una virgola di troppo alla fine della query? In SQL la virgola separa le colonne, non chiude l'istruzione."
            },
            {
                titleTemplate: "Elenco Fornitori Completo",
                descTemplate: "L'ufficio Acquisti sta aggiornando l'anagrafica. Estrai tutti i dati relativi ai fornitori registrati nel sistema per verificare che le informazioni siano aggiornate.",
                queryTemplate: "SELECT * FROM fornitori",
                hints: ["Usa SELECT * FROM fornitori per ottenere l'anagrafica completa.", "Controlla che il nome della tabella sia corretto."],
                explanation: "Mantenere l'anagrafica fornitori accessibile è cruciale per la gestione della supply chain.",
                replacements: {},
                brokenCode: "SELECT * form fornitori",
                debugHint: "Attenzione alla parola chiave 'FROM'. È scritta correttamente?"
            },
            {
                titleTemplate: "Tutte le Categorie",
                descTemplate: "Il team E-commerce sta riorganizzando il sito web. Mostra tutte le categorie di prodotti esistenti nel database, comprese le loro descrizioni, per aiutare nella ristrutturazione del menu.",
                queryTemplate: "SELECT * FROM categorie",
                hints: ["Seleziona tutto (*) dalla tabella 'categorie'.", "Questa query ti mostrerà id, nome e descrizione."],
                explanation: "Avere una visione chiara delle categorie aiuta nell'organizzazione del catalogo prodotti.",
                replacements: {},
                brokenCode: "SELECT * FROM category",
                debugHint: "Il nome della tabella deve essere in italiano, come nel database. Prova 'categorie'."
            },
            {
                titleTemplate: "Elenco Spedizioni",
                descTemplate: "Il Customer Service deve rispondere alle richieste dei clienti. Visualizza lo storico completo di tutte le spedizioni per tracciare lo stato delle consegne.",
                queryTemplate: "SELECT * FROM spedizioni",
                hints: ["Esegui una SELECT * sulla tabella 'spedizioni'.", "Utile per vedere corrieri, date e tracking code."],
                explanation: "L'accesso rapido ai dati di spedizione è vitale per il supporto clienti.",
                replacements: {},
                brokenCode: "SELECT * FROM spedizioni WHERE",
                debugHint: "Hai aggiunto una clausola 'WHERE' ma non hai specificato nessuna condizione. Se vuoi tutto, rimuovila."
            },
            {
                titleTemplate: "Recensioni Complete",
                descTemplate: "Il team Controllo Qualità vuole analizzare il sentiment dei clienti. Estrai tutte le recensioni dal database per una lettura approfondita di voti e commenti.",
                queryTemplate: "SELECT * FROM recensioni",
                hints: ["Usa SELECT * FROM recensioni.", "Vedrai chi ha scritto la recensione, il voto e il commento."],
                explanation: "Le recensioni sono una fonte diretta di feedback per migliorare i prodotti.",
                replacements: {},
                brokenCode: "SELECT ALL FROM recensioni",
                debugHint: "Per selezionare tutte le colonne si usa il simbolo asterisco (*), non la parola 'ALL'."
            },
            {
                titleTemplate: "Nomi Utenti",
                descTemplate: "Per un saluto personalizzato nella dashboard, estrai solamente i nomi di tutti gli utenti registrati.",
                queryTemplate: "SELECT nome FROM utenti",
                hints: ["Seleziona solo la colonna 'nome'.", "La tabella di riferimento è 'utenti'.", "Sintassi: SELECT nome FROM utenti;"],
                explanation: "Estrarre solo i nomi è utile per personalizzare l'interfaccia utente.",
                replacements: {},
                brokenCode: "SELECT nome utenti",
                debugHint: "Manca la parola chiave che collega la colonna alla tabella. Quale comando va tra 'nome' e 'utenti'?"
            },
            {
                titleTemplate: "Email Utenti",
                descTemplate: "Il sistema di newsletter automatiche necessita di una lista pulita delle email. Estrai solo la colonna 'email' dalla tabella utenti.",
                queryTemplate: "SELECT email FROM utenti",
                hints: ["Specifica 'email' dopo la clausola SELECT.", "FROM utenti indica la sorgente dei dati."],
                explanation: "Le liste di email sono fondamentali per le comunicazioni di marketing.",
                replacements: {},
                brokenCode: "SELECT email FROM users",
                debugHint: "La tabella si chiama 'utenti', non 'users'. I nomi nel database sono in italiano."
            },
            {
                titleTemplate: "Paesi Utenti",
                descTemplate: "L'analista di mercato vuole capire la distribuzione geografica. Estrai la colonna 'paese' da tutti gli utenti per vedere da dove provengono.",
                queryTemplate: "SELECT paese FROM utenti",
                hints: ["Seleziona la colonna 'paese'.", "Non usare DISTINCT per ora, mostra tutti i valori grezzi."],
                explanation: "Analizzare la provenienza degli utenti aiuta a mirare le strategie di espansione.",
                replacements: {},
                brokenCode: "SELECT paese FROM utenti .",
                debugHint: "C'è un carattere non valido alla fine della query. Rimuovi il punto."
            },
            {
                titleTemplate: "Stato Premium",
                descTemplate: "Il team finanziario vuole stimare le entrate dagli abbonamenti. Estrai la colonna 'premium' per vedere lo stato di abbonamento di ogni utente.",
                queryTemplate: "SELECT premium FROM utenti",
                hints: ["La colonna 'premium' è un booleano (true/false).", "Selezionala dalla tabella 'utenti'."],
                explanation: "I dati sugli abbonamenti sono critici per le previsioni di fatturato.",
                replacements: {},
                brokenCode: "SELECT premium FORM utenti",
                debugHint: "Hai scritto 'FORM' invece di 'FROM'."
            },
            {
                titleTemplate: "Nomi Prodotti",
                descTemplate: "Il Content Manager deve verificare i nomi dei prodotti per il catalogo cartaceo. Crea una lista contenente solo i nomi di tutti i prodotti.",
                queryTemplate: "SELECT nome FROM prodotti",
                hints: ["Seleziona solo la colonna 'nome' dalla tabella 'prodotti'.", "Utile per generare elenchi semplici."],
                explanation: "Una lista di nomi prodotti è la base per qualsiasi catalogo.",
                replacements: {},
                brokenCode: "SELECT name FROM prodotti",
                debugHint: "La colonna si chiama 'nome', non 'name'."
            },
            {
                titleTemplate: "Prezzi Prodotti",
                descTemplate: "Per un'analisi della competitività, estrai solo la colonna 'prezzo' di tutti i prodotti a listino.",
                queryTemplate: "SELECT prezzo FROM prodotti",
                hints: ["Concentrati sulla colonna 'prezzo'.", "La tabella è 'prodotti'."],
                explanation: "L'analisi dei prezzi è fondamentale per il posizionamento sul mercato.",
                replacements: {},
                brokenCode: "SELECT prezzo FROM prodotti,",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Stock Disponibile",
                descTemplate: "Il Magazziniere deve fare l'inventario rapido. Genera una lista che mostri solo la quantità di 'stock' per ogni prodotto.",
                queryTemplate: "SELECT stock FROM prodotti",
                hints: ["Seleziona la colonna 'stock'.", "Questo ti darà solo i numeri delle quantità."],
                explanation: "Monitorare lo stock aiuta a prevenire l'esaurimento scorte.",
                replacements: {},
                brokenCode: "SELECT stoc FROM prodotti",
                debugHint: "La colonna 'stock' è scritta male ('stoc'). Manca una lettera."
            },
            {
                titleTemplate: "ID Categorie Prodotti",
                descTemplate: "Per un'analisi di classificazione interna, estrai gli ID delle categorie associate a ciascun prodotto.",
                queryTemplate: "SELECT categoria_id FROM prodotti",
                hints: ["Seleziona la colonna 'categoria_id'.", "La tabella è 'prodotti'."],
                explanation: "Le chiavi esterne come categoria_id collegano i dati tra tabelle diverse.",
                replacements: {},
                brokenCode: "SELECT categoria id FROM prodotti",
                debugHint: "Il nome della colonna 'categoria_id' contiene un trattino basso (underscore). Non usare spazi."
            },
            {
                titleTemplate: "ID Fornitori",
                descTemplate: "Il sistema di gestione scorte necessita degli ID dei fornitori per ogni prodotto a catalogo.",
                queryTemplate: "SELECT fornitore_id FROM prodotti",
                hints: ["Seleziona 'fornitore_id' dalla tabella 'prodotti'.", "Utile per capire chi fornisce cosa."],
                explanation: "Identificare i fornitori è il primo passo per gestire gli approvvigionamenti.",
                replacements: {},
                brokenCode: "SELECT fornitore-id FROM prodotti",
                debugHint: "I nomi delle colonne usano l'underscore (_), non il trattino (-)."
            },
            {
                titleTemplate: "ID Ordini",
                descTemplate: "Per un controllo sequenziale, estrai la lista completa degli ID di tutti gli ordini registrati.",
                queryTemplate: "SELECT id FROM ordini",
                hints: ["Seleziona la colonna 'id' dalla tabella 'ordini'.", "Gli ID sono univoci per ogni ordine."],
                explanation: "Gli ID sequenziali aiutano a tracciare il volume degli ordini nel tempo.",
                replacements: {},
                brokenCode: "SELECT id FROM ordini WHERE id",
                debugHint: "La clausola WHERE è incompleta. Rimuovila se vuoi tutti gli ID."
            },
            {
                titleTemplate: "Date Ordini",
                descTemplate: "L'analista vuole studiare la stagionalità delle vendite. Estrai tutte le date in cui sono stati effettuati ordini.",
                queryTemplate: "SELECT data_ordine FROM ordini",
                hints: ["La colonna da selezionare è 'data_ordine'.", "La tabella è 'ordini'."],
                explanation: "Analizzare le date degli ordini rivela i picchi di vendita.",
                replacements: {},
                brokenCode: "SELECT data ordine FROM ordini",
                debugHint: "Manca l'underscore nel nome della colonna 'data_ordine'."
            },
            {
                titleTemplate: "Quantità Ordinate",
                descTemplate: "Per calcolare il volume medio di vendita, estrai le quantità di prodotti specificate in ogni ordine.",
                queryTemplate: "SELECT quantita FROM ordini",
                hints: ["Seleziona 'quantita' dalla tabella 'ordini'.", "Vedrai quanti pezzi sono stati ordinati per riga."],
                explanation: "I dati sulle quantità aiutano a dimensionare la logistica.",
                replacements: {},
                brokenCode: "SELECT quantity FROM ordini",
                debugHint: "Usa il nome italiano della colonna: 'quantita'."
            },
            {
                titleTemplate: "Nomi Categorie",
                descTemplate: "Il team UX vuole ridisegnare il menu di navigazione. Estrai i nomi di tutte le categorie disponibili.",
                queryTemplate: "SELECT nome FROM categorie",
                hints: ["Seleziona 'nome' dalla tabella 'categorie'.", "Questi nomi appariranno nel menu del sito."],
                explanation: "I nomi delle categorie sono essenziali per la navigazione dell'utente.",
                replacements: {},
                brokenCode: "SELECT nome FROM categorie ORDER BY",
                debugHint: "Hai lasciato un 'ORDER BY' incompleto alla fine. Rimuovilo."
            },
            {
                titleTemplate: "Descrizioni Categorie",
                descTemplate: "Per migliorare la SEO, estrai le descrizioni di tutte le categorie presenti nel database.",
                queryTemplate: "SELECT descrizione FROM categorie",
                hints: ["Seleziona la colonna 'descrizione'.", "La tabella è 'categorie'."],
                explanation: "Le descrizioni aiutano i motori di ricerca a indicizzare i contenuti.",
                replacements: {},
                brokenCode: "SELECT desc FROM categorie",
                debugHint: "Il nome della colonna è 'descrizione', non l'abbreviazione 'desc'."
            },
            {
                titleTemplate: "Aziende Fornitori",
                descTemplate: "Il responsabile partnership vuole una lista dei nomi di tutte le aziende fornitrici.",
                queryTemplate: "SELECT azienda FROM fornitori",
                hints: ["Seleziona la colonna 'azienda' dalla tabella 'fornitori'.", "Otterrai la ragione sociale dei partner."],
                explanation: "Conoscere i propri partner commerciali è fondamentale per il business.",
                replacements: {},
                brokenCode: "SELECT azienda FROM fornitore",
                debugHint: "Il nome della tabella è al plurale: 'fornitori'."
            },
            {
                titleTemplate: "Nazioni Fornitori",
                descTemplate: "Per valutare i rischi geopolitici, visualizza tutti i paesi di provenienza dei nostri fornitori.",
                queryTemplate: "SELECT nazione FROM fornitori",
                hints: ["Seleziona 'nazione' dalla tabella 'fornitori'.", "Utile per mappare la supply chain."],
                explanation: "La diversificazione geografica dei fornitori riduce i rischi.",
                replacements: {},
                brokenCode: "SELECT nazione, FROM fornitori",
                debugHint: "C'è una virgola di troppo dopo 'nazione'."
            },
            {
                titleTemplate: "Corrieri Spedizioni",
                descTemplate: "Il responsabile logistica vuole negoziare le tariffe. Mostra l'elenco dei corrieri utilizzati per le spedizioni.",
                queryTemplate: "SELECT corriere FROM spedizioni",
                hints: ["Seleziona la colonna 'corriere'.", "La tabella è 'spedizioni'."],
                explanation: "Analizzare i corrieri utilizzati aiuta a ottimizzare i costi di spedizione.",
                replacements: {},
                brokenCode: "SELECT corriere FROM spedizione",
                debugHint: "La tabella si chiama 'spedizioni' (plurale)."
            },
            {
                titleTemplate: "Voti Recensioni",
                descTemplate: "Per calcolare l'NPS (Net Promoter Score), estrai tutti i voti numerici assegnati nelle recensioni.",
                queryTemplate: "SELECT voto FROM recensioni",
                hints: ["Seleziona 'voto' dalla tabella 'recensioni'.", "I voti sono numeri interi (solitamente 1-5)."],
                explanation: "I voti sono la metrica principale per la soddisfazione del cliente.",
                replacements: {},
                brokenCode: "SELECT voto FROM recensioni,",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Commenti Recensioni",
                descTemplate: "Il team prodotto vuole leggere i feedback testuali. Visualizza tutti i commenti lasciati dagli utenti.",
                queryTemplate: "SELECT commento FROM recensioni",
                hints: ["Seleziona la colonna 'commento'.", "La tabella è 'recensioni'."],
                explanation: "I commenti offrono insight qualitativi preziosi.",
                replacements: {},
                brokenCode: "SELECT comment FROM recensioni",
                debugHint: "La colonna è 'commento', non 'comment'."
            },
            {
                titleTemplate: "Due Colonne Utenti",
                descTemplate: "Il CRM necessita di importare i contatti. Estrai nome e email di tutti gli utenti in un'unica query.",
                queryTemplate: "SELECT nome, email FROM utenti",
                hints: ["Scrivi i nomi delle colonne separati da una virgola.", "Esempio: SELECT col1, col2 FROM tabella."],
                explanation: "Selezionare più colonne permette di costruire dataset completi.",
                replacements: {},
                brokenCode: "SELECT nome email FROM utenti",
                debugHint: "Quando selezioni più colonne, devi separarle con una virgola."
            },
            {
                titleTemplate: "Nome e Paese",
                descTemplate: "Per segmentare il pubblico, estrai nome e paese di provenienza di tutti gli utenti.",
                queryTemplate: "SELECT nome, paese FROM utenti",
                hints: ["Seleziona 'nome' e 'paese' separati da virgola.", "Dalla tabella 'utenti'."],
                explanation: "La segmentazione geografica è chiave per il marketing mirato.",
                replacements: {},
                brokenCode: "SELECT nome; paese FROM utenti",
                debugHint: "Usa la virgola (,) per separare le colonne, non il punto e virgola (;)."
            },
            {
                titleTemplate: "Nome e Prezzo Prodotti",
                descTemplate: "Genera un listino base per i rivenditori che mostri solo il nome del prodotto e il suo prezzo.",
                queryTemplate: "SELECT nome, prezzo FROM prodotti",
                hints: ["Seleziona 'nome' e 'prezzo'.", "Dalla tabella 'prodotti'."],
                explanation: "Un listino semplice è spesso il documento più richiesto dai commerciali.",
                replacements: {},
                brokenCode: "SELECT nome e prezzo FROM prodotti",
                debugHint: "In SQL non si usa 'e' per unire le colonne. Usa una virgola."
            },
            {
                titleTemplate: "Prodotto e Stock",
                descTemplate: "Il report di disponibilità deve mostrare il nome del prodotto affiancato alla quantità in magazzino.",
                queryTemplate: "SELECT nome, stock FROM prodotti",
                hints: ["Seleziona 'nome' e 'stock'.", "Separa le colonne con una virgola."],
                explanation: "Associare nome e quantità dà una visione immediata della disponibilità.",
                replacements: {},
                brokenCode: "SELECT nome stock FROM prodotti",
                debugHint: "Manca la virgola tra 'nome' e 'stock'."
            },
            {
                titleTemplate: "Tre Colonne Utenti",
                descTemplate: "Per un audit completo dell'anagrafica, estrai nome, email e paese di tutti gli utenti.",
                queryTemplate: "SELECT nome, email, paese FROM utenti",
                hints: ["Elenca le tre colonne separate da virgole dopo SELECT.", "L'ordine delle colonne nella query determina l'ordine nel risultato."],
                explanation: "Più colonne selezioni, più dettagliato sarà il tuo report.",
                replacements: {},
                brokenCode: "SELECT nome, email paese FROM utenti",
                debugHint: "Hai dimenticato una virgola tra 'email' e 'paese'."
            },
            {
                titleTemplate: "ID e Data Ordini",
                descTemplate: "Per riconciliare le transazioni, mostra l'ID dell'ordine insieme alla sua data di creazione.",
                queryTemplate: "SELECT id, data_ordine FROM ordini",
                hints: ["Seleziona 'id' e 'data_ordine'.", "Dalla tabella 'ordini'."],
                explanation: "Associare ID e data è fondamentale per la tracciabilità temporale.",
                replacements: {},
                brokenCode: "SELECT id, data-ordine FROM ordini",
                debugHint: "Attenzione al nome della colonna data: usa l'underscore (_)."
            },
            {
                titleTemplate: "Categoria e Descrizione",
                descTemplate: "Il team contenuti vuole revisionare i testi. Visualizza nome e descrizione di tutte le categorie.",
                queryTemplate: "SELECT nome, descrizione FROM categorie",
                hints: ["Seleziona 'nome' e 'descrizione'.", "Dalla tabella 'categorie'."],
                explanation: "Revisionare i testi delle categorie migliora la comunicazione del brand.",
                replacements: {},
                brokenCode: "SELECT nome, descrizione FROM category",
                debugHint: "Tabella errata. Usa il nome italiano 'categorie'."
            },
                {
                titleTemplate: "Azienda e Nazione Fornitore",
                descTemplate: "Per il report sulla sostenibilità, mostra il nome dell'azienda fornitrice e la sua nazione.",
                queryTemplate: "SELECT azienda, nazione FROM fornitori",
                hints: ["Seleziona 'azienda' e 'nazione'.", "Dalla tabella 'fornitori'."],
                explanation: "La trasparenza sulla provenienza dei fornitori è un valore aggiunto.",
                replacements: {},
                brokenCode: "SELECT azienda nazione FROM fornitori",
                debugHint: "Manca la virgola di separazione tra le colonne."
            },
            {
                titleTemplate: "Corriere e Tracking",
                descTemplate: "Il sistema di tracking automatico richiede l'accoppiata corriere e codice di tracciamento per ogni spedizione.",
                queryTemplate: "SELECT corriere, codice_tracking FROM spedizioni",
                hints: ["Seleziona 'corriere' e 'codice_tracking'.", "Dalla tabella 'spedizioni'."],
                explanation: "Questi dati sono essenziali per permettere ai clienti di seguire il pacco.",
                replacements: {},
                brokenCode: "SELECT corriere, codice tracking FROM spedizioni",
                debugHint: "Il nome della colonna 'codice_tracking' non può avere spazi. Usa l'underscore."
            },
            {
                titleTemplate: "Voto e Commento",
                descTemplate: "Per analizzare la correlazione tra voto e testo, mostra entrambi i campi per tutte le recensioni.",
                queryTemplate: "SELECT voto, commento FROM recensioni",
                hints: ["Seleziona 'voto' e 'commento'.", "Dalla tabella 'recensioni'."],
                explanation: "Leggere il commento associato al voto dà contesto alla valutazione.",
                replacements: {},
                brokenCode: "SELECT voto, commento FROM recensioni,",
                debugHint: "C'è una virgola di troppo alla fine."
            },
            {
                titleTemplate: "Solo ID {table}",
                descTemplate: "Per operazioni di manutenzione database, estrai solo la chiave primaria (ID) dalla tabella {table}.",
                queryTemplate: "SELECT id FROM {table}",
                hints: ["Seleziona solo la colonna 'id'.", "Utile per verificare la sequenza delle chiavi."],
                explanation: "Lavorare solo con gli ID è efficiente per operazioni di verifica strutturale.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'categorie', 'fornitori', 'spedizioni', 'recensioni'] },
                brokenCode: "SELECT id FROM {table} .",
                debugHint: "Rimuovi il punto finale."
            },
            {
                titleTemplate: "Check {col} in {table}",
                descTemplate: "Il Data Steward deve verificare la qualità dei dati. Ispeziona i valori della colonna {col} nella tabella {table}.",
                queryTemplate: "SELECT {col} FROM {table}",
                hints: ["Seleziona la colonna specificata.", "Verifica se ci sono valori anomali a vista."],
                explanation: "Il controllo qualità dei dati inizia spesso con una semplice ispezione visiva.",
                replacements: { table: ['utenti', 'prodotti'], col: ['nome', 'email', 'prezzo'] },
                brokenCode: "SELECT {col} FROM {table},",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Dump {table} per Backup",
                descTemplate: "Prima di un aggiornamento sistema, esegui una selezione completa di {table} per verificare i dati attuali.",
                queryTemplate: "SELECT * FROM {table}",
                hints: ["Usa SELECT * per vedere tutto.", "È una buona pratica controllare i dati prima di modifiche."],
                explanation: "Verificare lo stato dei dati prima di interventi è una best practice IT.",
                replacements: { table: ['recensioni', 'spedizioni'] },
                brokenCode: "SELETC * FROM {table}",
                debugHint: "Typo su SELECT."
            },
            {
                titleTemplate: "Anteprima {table}",
                descTemplate: "Sei nuovo nel progetto. Visualizza tutte le colonne di {table} per familiarizzare con la struttura dei dati.",
                queryTemplate: "SELECT * FROM {table}",
                hints: ["Usa SELECT *.", "Osserva i nomi delle colonne e i tipi di dati."],
                explanation: "L'esplorazione iniziale delle tabelle è fondamentale per capire il database.",
                replacements: { table: ['fornitori', 'categorie'] },
                brokenCode: "SELECT * form {table}",
                debugHint: "Typo su FROM."
            },
            {
                titleTemplate: "Lista {col} da {table}",
                descTemplate: "Genera una lista rapida dei valori presenti in {col} dalla tabella {table} per un controllo veloce.",
                queryTemplate: "SELECT {col} FROM {table}",
                hints: ["Seleziona la colonna richiesta.", "È un'operazione di lettura base."],
                explanation: "Le liste semplici sono utili per controlli a campione.",
                replacements: { table: ['utenti'], col: ['paese', 'premium'] },
                brokenCode: "SELECT {col} FROM {table} WHERE",
                debugHint: "Rimuovi WHERE incompleto."
            },
            {
                titleTemplate: "Report {col1}, {col2}",
                descTemplate: "Il manager chiede un report flash con solo {col1} e {col2} dalla tabella prodotti.",
                queryTemplate: "SELECT {col1}, {col2} FROM prodotti",
                hints: ["Seleziona le due colonne separate da virgola.", "L'ordine richiesto è importante."],
                explanation: "I report ad-hoc richiedono spesso solo un sottoinsieme dei dati.",
                replacements: { col1: ['nome'], col2: ['stock', 'prezzo'] },
                brokenCode: "SELECT {col1} {col2} FROM prodotti",
                debugHint: "Manca la virgola."
            },
            {
                titleTemplate: "Info Spedizione: {col}",
                descTemplate: "Il cliente chiede dettagli sulla spedizione. Estrai solo {col} dalle spedizioni.",
                queryTemplate: "SELECT {col} FROM spedizioni",
                hints: ["Seleziona la colonna specifica.", "Fornisci solo l'informazione richiesta."],
                explanation: "Fornire dati precisi aumenta la fiducia del cliente.",
                replacements: { col: ['codice_tracking', 'data_spedizione'] },
                brokenCode: "SELECT {col} FROM spedizioni,",
                debugHint: "Via la virgola finale."
            },
            {
                titleTemplate: "Dettaglio Ordine: {col}",
                descTemplate: "Per un controllo incrociato, mostra solo {col} per ogni ordine registrato.",
                queryTemplate: "SELECT {col} FROM ordini",
                hints: ["Seleziona la colonna indicata.", "Dalla tabella ordini."],
                explanation: "I controlli incrociati spesso si basano su singole colonne chiave.",
                replacements: { col: ['quantita', 'data_ordine'] },
                brokenCode: "SELECT {col} FROM ordini .",
                debugHint: "Via il punto finale."
            },
            {
                titleTemplate: "Catalogo: {col}",
                descTemplate: "Aggiorna il catalogo online visualizzando la colonna {col} per tutti i prodotti.",
                queryTemplate: "SELECT {col} FROM prodotti",
                hints: ["Seleziona la colonna del prodotto.", "Dati aggiornati sono cruciali per l'e-commerce."],
                explanation: "Mantenere il catalogo sincronizzato è vitale per le vendite.",
                replacements: { col: ['nome', 'prezzo'] },
                brokenCode: "SELECT {col} FROM prodotti .",
                debugHint: "Via il punto finale."
            },
            {
                titleTemplate: "Rubrica: {col}",
                descTemplate: "L'HR sta aggiornando la rubrica aziendale. Estrai {col} da tutti gli utenti.",
                queryTemplate: "SELECT {col} FROM utenti",
                hints: ["Seleziona il dato contatto richiesto.", "Dalla tabella utenti."],
                explanation: "Dati di contatto accurati facilitano la comunicazione interna.",
                replacements: { col: ['email', 'nome'] },
                brokenCode: "SELECT {col} FROM utenti,",
                debugHint: "Via la virgola finale."
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Rinomina Colonna Prodotti",
                descTemplate: "Il report richiede intestazioni personalizzate. Seleziona la colonna '{col}' dalla tabella 'prodotti' e assegnale l'alias 'Info_Principale'.",
                queryTemplate: "SELECT {col} AS Info_Principale FROM prodotti",
                hints: ["Usa la keyword AS per definire un nome alternativo.", "L'alias va specificato subito dopo il nome della colonna."],
                explanation: "Gli alias (AS) rendono i nomi delle colonne più leggibili nei report finali.",
                replacements: {
                    col: ['nome', 'prezzo', 'stock']
                }
            },
            {
                titleTemplate: "Proiezione Calcolata ({perc})",
                descTemplate: "Il team finanziario sta simulando un aumento dei prezzi del {perc}%. Genera un report che mostri il nome del prodotto e il prezzo ipotetico moltiplicato per {perc}.",
                queryTemplate: "SELECT nome, prezzo * {perc} FROM prodotti",
                hints: ["Puoi eseguire operazioni matematiche direttamente nella clausola SELECT.", "Usa l'asterisco (*) come operatore di moltiplicazione."],
                explanation: "SQL permette di eseguire calcoli aritmetici direttamente sui dati estratti.",
                replacements: { perc: DATA.percentages }
            },
            {
                titleTemplate: "Alias Nome Utente",
                descTemplate: "Il CRM richiede che il campo 'nome' dalla tabella 'utenti' venga visualizzato come 'Nome_Cliente'.",
                queryTemplate: "SELECT nome AS Nome_Cliente FROM utenti",
                hints: ["Usa AS per rinominare la colonna nel risultato.", "L'alias richiesto contiene un underscore."],
                explanation: "Gli alias adattano i nomi delle colonne del database alle esigenze del frontend o dei report.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Email Utente",
                descTemplate: "Per l'integrazione con il tool di marketing, estrai la colonna 'email' dalla tabella 'utenti' assegnandole l'alias 'Indirizzo_Email'.",
                queryTemplate: "SELECT email AS Indirizzo_Email FROM utenti",
                hints: ["Usa AS per definire il nuovo nome della colonna.", "Fai attenzione all'uso dell'underscore."],
                explanation: "L'uso di alias rende i report più leggibili e compatibili con sistemi esterni.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Prezzo Prodotto",
                descTemplate: "Il listino ufficiale richiede che la colonna 'prezzo' dalla tabella 'prodotti' venga visualizzata come 'Prezzo_Vendita'.",
                queryTemplate: "SELECT prezzo AS Prezzo_Vendita FROM prodotti",
                hints: ["Assegna l'alias 'Prezzo_Vendita' alla colonna prezzo.", "Rispetta il case sensitivity dell'alias."],
                explanation: "Rinominare le colonne è utile per chiarire il significato dei dati in report specifici.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Stock Disponibile",
                descTemplate: "Il report di inventario deve mostrare la colonna 'stock' dalla tabella 'prodotti' con l'alias 'Quantita_Magazzino'.",
                queryTemplate: "SELECT stock AS Quantita_Magazzino FROM prodotti",
                hints: ["Usa AS per cambiare l'intestazione della colonna nel risultato.", "L'alias non modifica il nome della colonna nel database, solo nell'output."],
                explanation: "Gli alias sono temporanei e non modificano la struttura fisica della tabella.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Sconto 10%",
                descTemplate: "Per la promozione estiva, calcola il prezzo scontato del 10% per tutti i prodotti. Mostra le colonne 'nome' e il prezzo calcolato (prezzo * 0.9) rinominato come 'prezzo_scontato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * 0.9 AS prezzo_scontato FROM prodotti",
                hints: ["Moltiplicare per 0.9 equivale a togliere il 10%.", "Sintassi: SELECT nome, prezzo * 0.9 AS prezzo_scontato FROM prodotti"],
                explanation: "È comune eseguire calcoli di sconto direttamente in SQL per report rapidi.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con IVA ({perc})",
                descTemplate: "Il reparto contabilità necessita del prezzo lordo. Mostra la colonna 'nome' e calcola il prezzo con IVA moltiplicando 'prezzo' per {perc}. Rinomina il risultato del calcolo come 'prezzo_iva' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * {perc} AS prezzo_iva FROM prodotti",
                hints: ["Moltiplica la colonna prezzo per {perc}.", "Usa AS prezzo_iva per l'alias."],
                explanation: "Calcolare l'IVA in fase di estrazione dati semplifica il lavoro del frontend.",
                replacements: { perc: [1.1, 1.22, 1.2] }
            },
            {
                titleTemplate: "Valore Totale Stock",
                descTemplate: "Per la valutazione degli asset, mostra la colonna 'nome' e calcola il valore totale dello stock moltiplicando 'prezzo' per 'stock'. Rinomina il risultato calcolato come 'valore_totale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * stock AS valore_totale FROM prodotti",
                hints: ["Moltiplica le due colonne numeriche tra loro.", "Assegna un alias descrittivo al risultato."],
                explanation: "Puoi moltiplicare i valori di due colonne diverse della stessa riga.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Margine ({perc})",
                descTemplate: "Simula un nuovo listino mostrando la colonna 'nome' e calcolando il prezzo con margine moltiplicando 'prezzo' per {perc}. Rinomina il risultato come 'prezzo_margine' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * {perc} AS prezzo_margine FROM prodotti",
                hints: ["Moltiplica il prezzo per il fattore di margine indicato.", "Non dimenticare l'alias."],
                explanation: "Le simulazioni di prezzo sono frequenti nelle analisi di business.",
                replacements: { perc: DATA.percentages }
            },
            {
                titleTemplate: "Doppio Alias",
                descTemplate: "Genera un report dalla tabella 'prodotti' dove 'nome' ha l'alias 'Prodotto' e 'prezzo' ha l'alias 'Costo'.",
                queryTemplate: "SELECT nome AS Prodotto, prezzo AS Costo FROM prodotti",
                hints: ["Puoi assegnare un alias a ogni colonna selezionata.", "Separa le definizioni di colonna con una virgola."],
                explanation: "Rinominare più colonne aiuta a creare report completamente personalizzati.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Multipli Utenti",
                descTemplate: "Il team internazionale vuole un report dalla tabella 'utenti' con intestazioni standard: assegna a 'nome' l'alias 'Cliente', a 'email' l'alias 'Contatto', e a 'paese' l'alias 'Nazione'.",
                queryTemplate: "SELECT nome AS Cliente, email AS Contatto, paese AS Nazione FROM utenti",
                hints: ["Applica un alias per ciascuna delle tre colonne.", "Mantieni l'ordine delle colonne richiesto."],
                explanation: "Standardizzare le intestazioni è cruciale quando si condividono dati tra dipartimenti.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Sconto Quantità",
                descTemplate: "Per i clienti business, mostra la colonna 'nome' e calcola lo sconto del 15% moltiplicando 'prezzo' per 0.85. Rinomina il risultato come 'prezzo_scontato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * 0.85 AS prezzo_scontato FROM prodotti",
                hints: ["Esegui la moltiplicazione per 0.85.", "Assegna l'alias richiesto al risultato."],
                explanation: "I calcoli condizionali possono essere simulati o implementati con CASE (argomento avanzato).",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Spedizione",
                descTemplate: "Mostra la colonna 'nome' e calcola il prezzo con spedizione sommando 5 alla colonna 'prezzo'. Rinomina il risultato come 'prezzo_totale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo + 5 AS prezzo_totale FROM prodotti",
                hints: ["Usa l'operatore + per aggiungere il costo fisso.", "L'alias rende chiaro che è un totale."],
                explanation: "Sommare costanti ai valori del database è un'operazione semplice ma potente.",
                replacements: {}
            },
            {
                titleTemplate: "Divisione Prezzo",
                descTemplate: "Per una promozione, mostra la colonna 'nome' e calcola il prezzo diviso 2 (prezzo / 2). Rinomina il risultato come 'prezzo_unitario' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo / 2 AS prezzo_unitario FROM prodotti",
                hints: ["Usa lo slash (/) per la divisione.", "Assegna l'alias corretto."],
                explanation: "La divisione è utile per calcolare prezzi unitari o sconti percentuali.",
                replacements: {}
            },
            {
                titleTemplate: "Somma Prezzo e Stock",
                descTemplate: "A scopo di debug, mostra la colonna 'nome' e calcola la somma di 'prezzo' + 'stock'. Rinomina il risultato come 'somma' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo + stock AS somma FROM prodotti",
                hints: ["Somma le due colonne numeriche.", "Anche se semanticamente strano, SQL lo permette."],
                explanation: "SQL permette operazioni matematiche su qualsiasi colonna numerica.",
                replacements: {}
            },
            {
                titleTemplate: "Sottrazione Prezzo",
                descTemplate: "Mostra la colonna 'nome' e calcola il margine netto sottraendo 10 dalla colonna 'prezzo' (prezzo - 10). Rinomina il risultato come 'prezzo_netto' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo - 10 AS prezzo_netto FROM prodotti",
                hints: ["Usa il meno (-) per la sottrazione.", "L'alias spiega il significato del nuovo valore."],
                explanation: "Sottrarre costi fissi è utile per calcoli di marginalità rapida.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Percentuale",
                descTemplate: "Calcola l'importo della provvigione (20% del prezzo). Mostra la colonna 'nome' e il calcolo prezzo * 0.2, rinominato come 'percentuale' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo * 0.2 AS percentuale FROM prodotti",
                hints: ["Moltiplica per 0.2 per ottenere il 20%.", "Rinomina il risultato."],
                explanation: "Calcolare provvigioni o tasse è un uso tipico dell'aritmetica SQL.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato",
                descTemplate: "Per migliorare la leggibilità del listino, mostra la colonna 'nome' e il prezzo arrotondato all'intero più vicino usando ROUND(prezzo, 0). Rinomina il risultato come 'prezzo_arrotondato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0) AS prezzo_arrotondato FROM prodotti",
                hints: ["Usa la funzione ROUND(colonna, decimali).", "Per interi, usa 0 decimali."],
                explanation: "ROUND è essenziale per presentare dati finanziari puliti.",
                replacements: {}
            },
            {
                titleTemplate: "Alias con Calcolo Complesso",
                descTemplate: "Mostra la colonna 'nome' e simula un aumento del 10% seguito da uno sconto di 5€. Calcola (prezzo * 1.1) - 5 e rinomina il risultato come 'prezzo_finale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, (prezzo * 1.1) - 5 AS prezzo_finale FROM prodotti",
                hints: ["Usa le parentesi per controllare l'ordine delle operazioni.", "SQL rispetta la precedenza degli operatori matematici."],
                explanation: "Le espressioni complesse permettono di modellare logiche di business sofisticate.",
                replacements: {}
            },
            {
                titleTemplate: "Triplo Alias",
                descTemplate: "Genera un report completo dalla tabella prodotti rinominando: 'nome' come 'Prodotto', 'prezzo' come 'Prezzo_Base', 'stock' come 'Disponibilita' (rispetta le maiuscole esatte e gli underscore).",
                queryTemplate: "SELECT nome AS Prodotto, prezzo AS Prezzo_Base, stock AS Disponibilita FROM prodotti",
                hints: ["Definisci un alias per ogni colonna selezionata.", "Separa le coppie colonna-alias con virgole."],
                explanation: "Rinominare tutte le colonne crea una vista virtuale su misura per l'utente finale.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Margine Percentuale",
                descTemplate: "Il margine di profitto è stimato al 30%. Mostra la colonna 'nome' e calcola prezzo * 0.3 per ogni prodotto. Rinomina il risultato come 'margine' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo * 0.3 AS margine FROM prodotti",
                hints: ["Moltiplica il prezzo per 0.3.", "Assegna l'alias 'margine'."],
                explanation: "Stimare i margini aiuta nelle decisioni di pricing.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Doppio Sconto",
                descTemplate: "Applica uno sconto fedeltà. Mostra la colonna 'nome' e calcola (prezzo * 0.9) - 5 (prima 10% di sconto, poi ulteriori 5€). Rinomina il risultato come 'prezzo_finale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, (prezzo * 0.9) - 5 AS prezzo_finale FROM prodotti",
                hints: ["L'ordine è importante: prima la percentuale, poi la sottrazione fissa.", "Usa le parentesi."],
                explanation: "Combinare sconti percentuali e fissi è una strategia promozionale comune.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Data Ordine",
                descTemplate: "Nel report vendite, la colonna 'data_ordine' dalla tabella ordini deve apparire rinominata come 'Data_Acquisto' (rispetta maiuscole e underscore).",
                queryTemplate: "SELECT data_ordine AS Data_Acquisto FROM ordini",
                hints: ["Rinomina la colonna data_ordine.", "L'alias deve essere 'Data_Acquisto'."],
                explanation: "Anche le date possono e devono essere rinominate per chiarezza nel contesto.",
                replacements: {}
            },
            {
                titleTemplate: "Quantità e Prezzo",
                descTemplate: "Dalla tabella ordini, mostra la colonna 'quantita' rinominata come 'Qty' e calcola il valore stimato moltiplicando quantita * 10, rinominato come 'valore_stimato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT quantita AS Qty, quantita * 10 AS valore_stimato FROM ordini",
                hints: ["Rinomina la prima colonna.", "Esegui il calcolo per la seconda e rinominala."],
                explanation: "Puoi selezionare la stessa colonna più volte, una pura e una calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Categoria",
                descTemplate: "Per il report settoriale, seleziona la colonna 'nome' dalla tabella categorie e rinominala come 'Settore' (rispetta la maiuscola).",
                queryTemplate: "SELECT nome AS Settore FROM categorie",
                hints: ["Seleziona 'nome' e usa AS 'Settore'.", "Dalla tabella categorie."],
                explanation: "Adattare la terminologia (es. Categoria -> Settore) migliora l'usabilità dei dati.",
                replacements: {}
            },
            {
                titleTemplate: "Azienda e Contatto",
                descTemplate: "Crea una lista contatti fornitori rinominando azienda in 'Fornitore' e contatto in 'Referente' (rispetta le maiuscole).",
                queryTemplate: "SELECT azienda AS Fornitore, contatto AS Referente FROM fornitori",
                hints: ["Applica un alias a entrambe le colonne di testo.", "Rende la lista più professionale."],
                explanation: "Un buon naming delle colonne è parte integrante della data presentation.",
                replacements: {}
            },
            {
                titleTemplate: "Corriere e Data",
                descTemplate: "Per il tracking, mostra corriere come 'Spedizioniere' e data_spedizione come 'Data_Consegna' (rispetta le maiuscole).",
                queryTemplate: "SELECT corriere AS Spedizioniere, data_spedizione AS Data_Consegna FROM spedizioni",
                hints: ["Rinomina entrambe le colonne per chiarire il loro ruolo nel report.", "Usa AS."],
                explanation: "In contesti specifici, i nomi generici del DB possono essere fuorvianti, gli alias risolvono.",
                replacements: {}
            },
            {
                titleTemplate: "Voto e Commento Alias",
                descTemplate: "Mostra voto come 'Valutazione' e commento come 'Feedback' (rispetta le maiuscole) dalle recensioni.",
                queryTemplate: "SELECT voto AS Valutazione, commento AS Feedback FROM recensioni",
                hints: ["Usa AS per entrambe", "SELECT voto AS Valutazione, commento AS Feedback"],
                explanation: "Alias per recensioni più leggibili.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Complesso Multiplo",
                descTemplate: "Calcola prezzo * 1.15 rinominato come 'prezzo_iva' e prezzo * 0.85 rinominato come 'prezzo_sconto' (tutto minuscolo con underscore). Mostra nome e entrambi i calcoli.",
                queryTemplate: "SELECT nome, prezzo * 1.15 AS prezzo_iva, prezzo * 0.85 AS prezzo_sconto FROM prodotti",
                hints: ["Calcola entrambe le espressioni", "Usa AS per ciascuna"],
                explanation: "Calcoli multipli con alias distinti.",
                replacements: {}
            },
            {
                titleTemplate: "Alias con Espressione",
                descTemplate: "Calcola (stock + 10) * prezzo e rinomina il risultato come 'valore_potenziale' (tutto minuscolo con underscore). Mostra nome e valore.",
                queryTemplate: "SELECT nome, (stock + 10) * prezzo AS valore_potenziale FROM prodotti",
                hints: ["Prima somma, poi moltiplica", "Usa parentesi"],
                explanation: "Espressioni complesse con alias.",
                replacements: {}
            },
            {
                titleTemplate: "Quattro Alias",
                descTemplate: "Mostra nome come 'Prodotto', prezzo come 'Prezzo', stock come 'Magazzino' e categoria_id come 'Categoria' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome AS Prodotto, prezzo AS Prezzo, stock AS Magazzino, categoria_id AS Categoria FROM prodotti",
                hints: ["Usa AS per tutte e quattro le colonne", "Separa con virgole"],
                explanation: "Alias multipli per report completi.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Doppia Percentuale",
                descTemplate: "Calcola il prezzo aumentato del 25% e poi ridotto del 10%: (prezzo * 1.25) * 0.9. Rinomina il risultato come 'prezzo_finale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, (prezzo * 1.25) * 0.9 AS prezzo_finale FROM prodotti",
                hints: ["Prima moltiplica per 1.25, poi per 0.9", "Usa parentesi"],
                explanation: "Calcoli sequenziali con percentuali.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Utente Completo",
                descTemplate: "Mostra nome come 'Cliente', email come 'Email', paese come 'Nazione' e premium come 'Abbonamento' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome AS Cliente, email AS Email, paese AS Nazione, premium AS Abbonamento FROM utenti",
                hints: ["Usa AS per tutte le colonne", "Quattro alias separati da virgole"],
                explanation: "Alias completi per report utenti.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Valore Inventario",
                descTemplate: "Calcola il valore totale dell'inventario: prezzo * stock. Mostra nome e valore rinominato come 'valore_inventario' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * stock AS valore_inventario FROM prodotti",
                hints: ["Moltiplica prezzo per stock", "Usa AS per l'alias"],
                explanation: "Calcoli di valore inventario.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Sconto Progressivo",
                descTemplate: "Calcola uno sconto progressivo: prezzo - (prezzo * 0.15). Mostra nome e prezzo scontato rinominato come 'prezzo_scontato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo - (prezzo * 0.15) AS prezzo_scontato FROM prodotti",
                hints: ["Calcola prima lo sconto, poi sottrai", "Usa parentesi"],
                explanation: "Calcoli di sconto con espressioni.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Ordine Completo",
                descTemplate: "Mostra id come 'Ordine', data_ordine come 'Data', quantita come 'Quantita' (rispetta le maiuscole) dalla tabella ordini.",
                queryTemplate: "SELECT id AS Ordine, data_ordine AS Data, quantita AS Quantita FROM ordini",
                hints: ["Usa AS per tutte e tre le colonne", "SELECT id AS Ordine, data_ordine AS Data, quantita AS Quantita"],
                explanation: "Alias multipli per ordini.",
                replacements: {}
            },
            // NEW EXERCISES FOR BASICS MEDIUM
            {
                titleTemplate: "Calcolo Ipotetico {op}",
                descTemplate: "Calcola prezzo {op} 2 per ogni prodotto. Mostra nome e risultato rinominato come 'calcolo' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo {op} 2 AS calcolo FROM prodotti",
                hints: ["Usa l'operatore matematico"],
                explanation: "Calcoli aritmetici base.",
                replacements: { op: ['+', '-', '*', '/'] }
            },
            {
                titleTemplate: "Alias Creativo: {col}",
                descTemplate: "Estrai {col} dai prodotti e rinominalo come 'Dato_Segreto' (rispetta le maiuscole).",
                queryTemplate: "SELECT {col} AS Dato_Segreto FROM prodotti",
                hints: ["Usa AS Dato_Segreto"],
                explanation: "Alias arbitrari.",
                replacements: { col: ['id', 'stock'] }
            },
            {
                titleTemplate: "Prezzo in Centesimi",
                descTemplate: "Mostra il prezzo dei prodotti convertito in centesimi (moltiplica per 100) con alias 'Cents' (rispetta la maiuscola).",
                queryTemplate: "SELECT nome, prezzo * 100 AS Cents FROM prodotti",
                hints: ["Moltiplica per 100"],
                explanation: "Conversione unità con calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Raddoppiato",
                descTemplate: "Simula un raddoppio dello stock per ogni prodotto. Mostra nome e 'Stock_Futuro' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome, stock * 2 AS Stock_Futuro FROM prodotti",
                hints: ["Moltiplica stock per 2"],
                explanation: "Proiezione calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Sconto Fisso {val}",
                descTemplate: "Applica uno sconto di {val} euro a tutti i prodotti. Mostra 'Prezzo_Scontato' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome, prezzo - {val} AS Prezzo_Scontato FROM prodotti",
                hints: ["Sottrai {val}"],
                explanation: "Sottrazione costante.",
                replacements: { val: [2, 5, 10] }
            },
            {
                titleTemplate: "Alias Utente {col}",
                descTemplate: "Seleziona {col} dagli utenti e rinominalo in inglese (es. Name, Country) come '{alias}' (rispetta l'alias richiesto).",
                queryTemplate: "SELECT {col} AS {alias} FROM utenti",
                hints: ["Usa AS"],
                explanation: "Ridenominazione colonne.",
                replacements: { col: ['nome', 'paese'], alias: ['Name', 'Country'] }
            },
            {
                titleTemplate: "Calcolo IVA 22%",
                descTemplate: "Calcola l'IVA (prezzo * 0.22) e mostrala come 'Imposta' (rispetta la maiuscola).",
                queryTemplate: "SELECT nome, prezzo * 0.22 AS Imposta FROM prodotti",
                hints: ["Moltiplica per 0.22"],
                explanation: "Calcolo percentuale semplice.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo + IVA 22%",
                descTemplate: "Calcola il prezzo finale (prezzo * 1.22) e mostralo come 'Prezzo_Ivato' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome, prezzo * 1.22 AS Prezzo_Ivato FROM prodotti",
                hints: ["Moltiplica per 1.22"],
                explanation: "Calcolo maggiorazione.",
                replacements: {}
            },
            {
                titleTemplate: "Giorni in Ore",
                descTemplate: "Converti i giorni passati (datediff) in ore (moltiplica per 24). Usa datediff('2024-01-01', data_ordine) * 24 e rinomina come 'ore_passate' (tutto minuscolo).",
                queryTemplate: "SELECT id, datediff('2024-01-01', data_ordine) * 24 AS ore_passate FROM ordini",
                hints: ["Moltiplica il risultato di datediff per 24"],
                explanation: "Calcoli su date.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Multiplo Prodotto",
                descTemplate: "Rinomina id in 'Codice', nome in 'Articolo', prezzo in 'Listino'.",
                queryTemplate: "SELECT id AS Codice, nome AS Articolo, prezzo AS Listino FROM prodotti",
                hints: ["Tre alias separati da virgole"],
                explanation: "Ridenominazione massiva.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Analisi Paesi Unici",
                descTemplate: "Vogliamo sapere in quali paesi operiamo effettivamente. Estrai la lista dei paesi unici dalla tabella 'utenti', rimuovendo qualsiasi duplicato.",
                queryTemplate: "SELECT DISTINCT paese FROM utenti",
                hints: ["Per rimuovere i duplicati, esiste una keyword specifica da inserire dopo SELECT."],
                explanation: "DISTINCT elimina le righe duplicate dal risultato finale.",
                replacements: {}
            },
            {
                titleTemplate: "Categorie in Uso",
                descTemplate: "Estrai gli ID delle categorie presenti nella tabella prodotti, assicurandoti che ogni ID compaia una sola volta per capire quali settori sono coperti.",
                queryTemplate: "SELECT DISTINCT categoria_id FROM prodotti",
                hints: ["DISTINCT filtra i valori ripetuti"],
                explanation: "Utile per capire quali categorie sono effettivamente popolate.",
                replacements: {}
            },
            {
                titleTemplate: "Email Uniche",
                descTemplate: "Estrai tutte le email uniche degli utenti, rimuovendo eventuali duplicati.",
                queryTemplate: "SELECT DISTINCT email FROM utenti",
                hints: ["Usa DISTINCT per eliminare duplicati", "SELECT DISTINCT email FROM utenti"],
                explanation: "DISTINCT su email per trovare indirizzi unici.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitori Unici",
                descTemplate: "Trova tutti gli ID dei fornitori unici presenti nella tabella prodotti.",
                queryTemplate: "SELECT DISTINCT fornitore_id FROM prodotti",
                hints: ["SELECT DISTINCT fornitore_id FROM prodotti"],
                explanation: "DISTINCT per identificare fornitori unici.",
                replacements: {}
            },
            {
                titleTemplate: "Nazioni Fornitori Uniche",
                descTemplate: "Estrai tutte le nazioni uniche dei fornitori per capire la distribuzione geografica.",
                queryTemplate: "SELECT DISTINCT nazione FROM fornitori",
                hints: ["SELECT DISTINCT nazione FROM fornitori"],
                explanation: "DISTINCT per nazioni uniche.",
                replacements: {}
            },
            {
                titleTemplate: "Corrieri Utilizzati",
                descTemplate: "Trova tutti i corrieri unici utilizzati per le spedizioni.",
                queryTemplate: "SELECT DISTINCT corriere FROM spedizioni",
                hints: ["SELECT DISTINCT corriere FROM spedizioni"],
                explanation: "DISTINCT per identificare corrieri unici.",
                replacements: {}
            },
            {
                titleTemplate: "Voti Unici",
                descTemplate: "Estrai tutti i voti unici assegnati nelle recensioni per vedere la gamma di valutazioni.",
                queryTemplate: "SELECT DISTINCT voto FROM recensioni",
                hints: ["SELECT DISTINCT voto FROM recensioni"],
                explanation: "DISTINCT per vedere la gamma di voti.",
                replacements: {}
            },
            {
                titleTemplate: "Date Ordini Uniche",
                descTemplate: "Trova tutte le date uniche in cui sono stati effettuati ordini.",
                queryTemplate: "SELECT DISTINCT data_ordine FROM ordini",
                hints: ["SELECT DISTINCT data_ordine FROM ordini"],
                explanation: "DISTINCT per date uniche.",
                replacements: {}
            },
            {
                titleTemplate: "Date Spedizioni Uniche",
                descTemplate: "Estrai tutte le date uniche di spedizione per analizzare i periodi di consegna.",
                queryTemplate: "SELECT DISTINCT data_spedizione FROM spedizioni",
                hints: ["SELECT DISTINCT data_spedizione FROM spedizioni"],
                explanation: "DISTINCT per date spedizione uniche.",
                replacements: {}
            },
            {
                titleTemplate: "Due Colonne Distinte",
                descTemplate: "Estrai tutte le combinazioni uniche di paese e premium dagli utenti.",
                queryTemplate: "SELECT DISTINCT paese, premium FROM utenti",
                hints: ["Usa DISTINCT con più colonne", "SELECT DISTINCT paese, premium FROM utenti"],
                explanation: "DISTINCT su più colonne trova combinazioni uniche.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria e Fornitore Unici",
                descTemplate: "Trova tutte le combinazioni uniche di categoria_id e fornitore_id dai prodotti.",
                queryTemplate: "SELECT DISTINCT categoria_id, fornitore_id FROM prodotti",
                hints: ["SELECT DISTINCT categoria_id, fornitore_id FROM prodotti"],
                explanation: "DISTINCT su più colonne per combinazioni uniche.",
                replacements: {}
            },
            {
                titleTemplate: "Nome e Paese Unici",
                descTemplate: "Estrai tutte le combinazioni uniche di nome e paese dagli utenti.",
                queryTemplate: "SELECT DISTINCT nome, paese FROM utenti",
                hints: ["SELECT DISTINCT nome, paese FROM utenti"],
                explanation: "DISTINCT su colonne multiple.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotto e Categoria Unici",
                descTemplate: "Trova tutte le combinazioni uniche di nome prodotto e categoria_id.",
                queryTemplate: "SELECT DISTINCT nome, categoria_id FROM prodotti",
                hints: ["SELECT DISTINCT nome, categoria_id FROM prodotti"],
                explanation: "DISTINCT per combinazioni prodotto-categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Tre Colonne Distinte",
                descTemplate: "Estrai tutte le combinazioni uniche di nome, email e paese dagli utenti.",
                queryTemplate: "SELECT DISTINCT nome, email, paese FROM utenti",
                hints: ["Usa DISTINCT con tre colonne", "SELECT DISTINCT nome, email, paese FROM utenti"],
                explanation: "DISTINCT su tre colonne per triplette uniche.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Alias",
                descTemplate: "Estrai i paesi unici degli utenti e assegna l'alias 'Nazioni_Operative'.",
                queryTemplate: "SELECT DISTINCT paese AS Nazioni_Operative FROM utenti",
                hints: ["Combina DISTINCT con AS per rinominare la colonna risultante."],
                explanation: "DISTINCT può essere combinato con alias.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Categorie con Alias",
                descTemplate: "Trova gli ID unici delle categorie e rinominali come 'Settori_Attivi'.",
                queryTemplate: "SELECT DISTINCT categoria_id AS Settori_Attivi FROM prodotti",
                hints: ["SELECT DISTINCT categoria_id AS Settori_Attivi FROM prodotti"],
                explanation: "DISTINCT con alias descrittivo.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Multiplo con Alias",
                descTemplate: "Estrai combinazioni uniche di paese e premium, rinomina paese come 'Nazione' e premium come 'Abbonamento' (rispetta le maiuscole).",
                queryTemplate: "SELECT DISTINCT paese AS Nazione, premium AS Abbonamento FROM utenti",
                hints: ["Usa DISTINCT con più alias", "SELECT DISTINCT paese AS Nazione, premium AS Abbonamento"],
                explanation: "DISTINCT con alias multipli.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT su Calcolo",
                descTemplate: "Trova tutti i valori unici di (prezzo * 10) arrotondati dai prodotti e rinomina il risultato come 'valore_unico' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT ROUND(prezzo * 10, 0) AS valore_unico FROM prodotti",
                hints: ["Combina DISTINCT con calcolo", "SELECT DISTINCT ROUND(prezzo * 10, 0) AS valore_unico"],
                explanation: "DISTINCT può essere applicato a espressioni calcolate.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Date Anno",
                descTemplate: "Estrai tutti gli anni unici dalle date ordine usando YEAR() e rinomina la colonna come 'anno' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT YEAR(data_ordine) AS anno FROM ordini",
                hints: ["Usa YEAR() con DISTINCT", "SELECT DISTINCT YEAR(data_ordine) AS anno FROM ordini"],
                explanation: "DISTINCT su funzioni di data.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Mese Spedizioni",
                descTemplate: "Trova tutti i mesi unici delle spedizioni usando MONTH() e rinomina la colonna come 'mese' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT MONTH(data_spedizione) AS mese FROM spedizioni",
                hints: ["Usa MONTH() con DISTINCT", "SELECT DISTINCT MONTH(data_spedizione) AS mese FROM spedizioni"],
                explanation: "DISTINCT su mesi.",
                replacements: {}
            },
            // NEW EXERCISES FOR BASICS HARD
            {
                titleTemplate: "DISTINCT Lunghezza Nomi",
                descTemplate: "Trova tutte le lunghezze uniche dei nomi dei prodotti usando LEN() e rinomina la colonna come 'lunghezza' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT LEN(nome) AS lunghezza FROM prodotti",
                hints: ["Usa LEN() e DISTINCT"],
                explanation: "DISTINCT su funzione scalare.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Iniziale Nome",
                descTemplate: "Trova tutte le iniziali uniche dei nomi utenti (usa LEFT(nome, 1)) e rinomina la colonna come 'iniziale' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT LEFT(nome, 1) AS iniziale FROM utenti",
                hints: ["Usa LEFT(nome, 1)"],
                explanation: "DISTINCT su sottostringa.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Prezzo Arrotondato",
                descTemplate: "Trova i prezzi unici arrotondati per difetto (FLOOR) e rinomina il risultato come 'prezzo_base' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT FLOOR(prezzo) AS prezzo_base FROM prodotti",
                hints: ["Usa FLOOR()"],
                explanation: "DISTINCT su arrotondamento.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Anno Spedizione",
                descTemplate: "Quali sono gli anni in cui abbiamo effettuato spedizioni? Usa DISTINCT YEAR() e rinomina la colonna come 'anno' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT YEAR(data_spedizione) AS anno FROM spedizioni",
                hints: ["Usa YEAR()"],
                explanation: "Anni unici di attività.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Categoria e Prezzo > {val}",
                descTemplate: "Trova le categorie uniche che hanno almeno un prodotto con prezzo > {val}.",
                queryTemplate: "SELECT DISTINCT categoria_id FROM prodotti WHERE prezzo > {val}",
                hints: ["Usa WHERE prima o dopo? WHERE filtra le righe, poi DISTINCT agisce."],
                explanation: "DISTINCT con filtro WHERE.",
                replacements: { val: [50, 100, 200] }
            },
            {
                titleTemplate: "DISTINCT Fornitore e Stock < {val}",
                descTemplate: "Trova i fornitori unici che hanno prodotti con stock inferiore a {val}.",
                queryTemplate: "SELECT DISTINCT fornitore_id FROM prodotti WHERE stock < {val}",
                hints: ["Filtra con WHERE poi usa DISTINCT"],
                explanation: "DISTINCT su sottoinsieme filtrato.",
                replacements: { val: [5, 10, 20] }
            },
            {
                titleTemplate: "DISTINCT Utenti Premium",
                descTemplate: "Trova i paesi unici degli utenti che sono Premium.",
                queryTemplate: "SELECT DISTINCT paese FROM utenti WHERE premium = true",
                hints: ["WHERE premium = true"],
                explanation: "Paesi con utenti premium.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Corrieri Recenti",
                descTemplate: "Trova i corrieri unici usati per spedizioni dopo il '2023-01-01'.",
                queryTemplate: "SELECT DISTINCT corriere FROM spedizioni WHERE data_spedizione > '2023-01-01'",
                hints: ["Filtra per data"],
                explanation: "Corrieri attivi recentemente.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Voti Positivi",
                descTemplate: "Trova i voti unici nelle recensioni che sono maggiori o uguali a 4.",
                queryTemplate: "SELECT DISTINCT voto FROM recensioni WHERE voto >= 4",
                hints: ["WHERE voto >= 4"],
                explanation: "Voti alti unici.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Coppia Ordine-Prodotto",
                descTemplate: "Trova le combinazioni uniche di ordine_id e prodotto_id (dovrebbero essere uniche per definizione, ma è un buon check).",
                queryTemplate: "SELECT DISTINCT id, prodotto_id FROM ordini",
                hints: ["SELECT DISTINCT id, prodotto_id"],
                explanation: "Verifica unicità chiavi composte.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Combinazione Complessa",
                descTemplate: "Estrai combinazioni uniche di categoria_id, fornitore_id e (prezzo > 50) come booleano.",
                queryTemplate: "SELECT DISTINCT categoria_id, fornitore_id, (prezzo > 50) AS prezzo_alto FROM prodotti",
                hints: ["Combina DISTINCT con espressione booleana", "Usa parentesi per l'espressione"],
                explanation: "DISTINCT con espressioni complesse.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Utenti per Paese",
                descTemplate: "Trova tutte le combinazioni uniche di paese e stato premium (TRUE/FALSE) dagli utenti.",
                queryTemplate: "SELECT DISTINCT paese, premium FROM utenti",
                hints: ["SELECT DISTINCT paese, premium FROM utenti"],
                explanation: "DISTINCT per analisi incrociate.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Ordini per Data",
                descTemplate: "Estrai tutte le combinazioni uniche di data_ordine e quantita dagli ordini.",
                queryTemplate: "SELECT DISTINCT data_ordine, quantita FROM ordini",
                hints: ["SELECT DISTINCT data_ordine, quantita FROM ordini"],
                explanation: "DISTINCT per pattern di ordini.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Recensioni",
                descTemplate: "Trova tutte le combinazioni uniche di prodotto_id e voto dalle recensioni.",
                queryTemplate: "SELECT DISTINCT prodotto_id, voto FROM recensioni",
                hints: ["SELECT DISTINCT prodotto_id, voto FROM recensioni"],
                explanation: "DISTINCT per analisi recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Spedizioni",
                descTemplate: "Estrai tutte le combinazioni uniche di corriere e data_spedizione.",
                queryTemplate: "SELECT DISTINCT corriere, data_spedizione FROM spedizioni",
                hints: ["SELECT DISTINCT corriere, data_spedizione FROM spedizioni"],
                explanation: "DISTINCT per analisi spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con UPPER",
                descTemplate: "Trova tutti i nomi unici in maiuscolo degli utenti usando DISTINCT e UPPER e rinomina la colonna come 'nome_maiuscolo' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT UPPER(nome) AS nome_maiuscolo FROM utenti",
                hints: ["Combina DISTINCT con UPPER", "SELECT DISTINCT UPPER(nome) AS nome_maiuscolo"],
                explanation: "DISTINCT con funzioni di stringa.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Prezzi Arrotondati",
                descTemplate: "Trova tutti i prezzi unici arrotondati all'intero più vicino e rinomina il risultato come 'prezzo_arrotondato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT ROUND(prezzo, 0) AS prezzo_arrotondato FROM prodotti",
                hints: ["Combina DISTINCT con ROUND", "SELECT DISTINCT ROUND(prezzo, 0) AS prezzo_arrotondato"],
                explanation: "DISTINCT su valori arrotondati.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Quattro Colonne",
                descTemplate: "Estrai tutte le combinazioni uniche di nome, email, paese e premium dagli utenti.",
                queryTemplate: "SELECT DISTINCT nome, email, paese, premium FROM utenti",
                hints: ["Usa DISTINCT con quattro colonne", "SELECT DISTINCT nome, email, paese, premium"],
                explanation: "DISTINCT su molte colonne per combinazioni uniche.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Calcolo Stock",
                descTemplate: "Trova tutti i valori unici di (stock * 10) dai prodotti e rinomina il risultato come 'stock_calcolato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT stock * 10 AS stock_calcolato FROM prodotti",
                hints: ["SELECT DISTINCT stock * 10 AS stock_calcolato FROM prodotti"],
                explanation: "DISTINCT su calcoli matematici.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Categorie e Prezzi",
                descTemplate: "Estrai combinazioni uniche di categoria_id e prezzo (arrotondato) dai prodotti, rinominando il prezzo come 'prezzo_arrotondato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT categoria_id, ROUND(prezzo, 0) AS prezzo_arrotondato FROM prodotti",
                hints: ["Combina DISTINCT con ROUND", "SELECT DISTINCT categoria_id, ROUND(prezzo, 0) AS prezzo_arrotondato"],
                explanation: "DISTINCT con calcoli su colonne multiple.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Anno e Mese",
                descTemplate: "Trova tutte le combinazioni uniche di anno e mese dalle date ordine, rinominando le colonne rispettivamente come 'anno' e 'mese' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT YEAR(data_ordine) AS anno, MONTH(data_ordine) AS mese FROM ordini",
                hints: ["Usa YEAR() e MONTH() con DISTINCT", "SELECT DISTINCT YEAR(data_ordine) AS anno, MONTH(data_ordine) AS mese"],
                explanation: "DISTINCT su funzioni di data multiple.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Espressione Complessa",
                descTemplate: "Trova tutti i valori unici di (prezzo * stock) / 10 dai prodotti e rinomina il risultato come 'valore_normalizzato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT (prezzo * stock) / 10 AS valore_normalizzato FROM prodotti",
                hints: ["Usa parentesi per l'ordine", "SELECT DISTINCT (prezzo * stock) / 10 AS valore_normalizzato"],
                explanation: "DISTINCT su espressioni matematiche complesse.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Fornitori e Categorie",
                descTemplate: "Estrai tutte le combinazioni uniche di fornitore_id e categoria_id rinominandoli rispettivamente come 'Fornitore' e 'Categoria' (rispetta le maiuscole).",
                queryTemplate: "SELECT DISTINCT fornitore_id AS Fornitore, categoria_id AS Categoria FROM prodotti",
                hints: ["Usa DISTINCT con alias", "SELECT DISTINCT fornitore_id AS Fornitore, categoria_id AS Categoria"],
                explanation: "DISTINCT con alias per report chiari.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Utenti Premium per Paese",
                descTemplate: "Trova tutte le combinazioni uniche di paese e stato premium, rinominando paese come 'Nazione' e premium come 'Premium' (rispetta le maiuscole).",
                queryTemplate: "SELECT DISTINCT paese AS Nazione, premium AS Premium FROM utenti",
                hints: ["SELECT DISTINCT paese AS Nazione, premium AS Premium FROM utenti"],
                explanation: "DISTINCT con alias per analisi incrociate.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Valori Calcolati Multipli",
                descTemplate: "Trova combinazioni uniche di (prezzo * 1.1) rinominato come 'prezzo_iva' e (stock + 5) rinominato come 'stock_aggiuntivo' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT prezzo * 1.1 AS prezzo_iva, stock + 5 AS stock_aggiuntivo FROM prodotti",
                hints: ["Calcola entrambe le espressioni", "SELECT DISTINCT prezzo * 1.1 AS prezzo_iva, stock + 5 AS stock_aggiuntivo"],
                explanation: "DISTINCT su calcoli multipli.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Completo Prodotti",
                descTemplate: "Estrai tutte le combinazioni uniche di nome, categoria_id e fornitore_id dai prodotti.",
                queryTemplate: "SELECT DISTINCT nome, categoria_id, fornitore_id FROM prodotti",
                hints: ["SELECT DISTINCT nome, categoria_id, fornitore_id FROM prodotti"],
                explanation: "DISTINCT su tre colonne per analisi complete.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Funzione Stringa",
                descTemplate: "Trova tutti i nomi unici in maiuscolo (rinominato come 'nome_maiuscolo') e i paesi unici dagli utenti.",
                queryTemplate: "SELECT DISTINCT UPPER(nome) AS nome_maiuscolo, paese FROM utenti",
                hints: ["Combina DISTINCT con UPPER", "SELECT DISTINCT UPPER(nome) AS nome_maiuscolo, paese"],
                explanation: "DISTINCT con funzioni di stringa e colonne normali.",
                replacements: {}
            }
        ]
    },
    [TopicId.Filtering]: {
        [Difficulty.Easy]: [
            {
                titleTemplate: "Check Stock Esatto ({val})",
                descTemplate: "Il responsabile di magazzino vuole verificare l'inventario. Trova tutti i prodotti dalla tabella 'prodotti' che hanno esattamente {val} unità in giacenza.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock = {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock {val}",
                debugHint: "Manca l'operatore di confronto (=).",
                hints: ["Per filtrare i risultati, usa la clausola condizionale appropriata.", "L'operatore di uguaglianza è =."],
                explanation: "La clausola WHERE permette di selezionare solo le righe che soddisfano una condizione specifica.",
                replacements: { val: [0, 5, 10, 15, 20, 25, 30, 40, 50] }
            },
            {
                titleTemplate: "Filtro per Paese: {country}",
                descTemplate: "Il team marketing vuole lanciare una campagna locale. Seleziona tutti gli utenti registrati che risiedono in '{country}'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = '{country}'",
                brokenCode: "SELECT * FROM utenti WHERE paese = {country}",
                debugHint: "Le stringhe devono essere racchiuse tra apici singoli.",
                hints: ["Le stringhe vanno delimitate da apici singoli.", "Esempio: WHERE colonna = 'valore'."],
                explanation: "In SQL, le stringhe di testo devono essere sempre delimitate da apici singoli.",
                replacements: { country: DATA.countries }
            },
            {
                titleTemplate: "Prezzi Maggiori di {val}",
                descTemplate: "Per un'analisi sui prodotti di fascia alta, mostra solo i prodotti che costano più di {val} euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > {val}",
                brokenCode: "SELECT * FROM prodotti WHER prezzo > {val}",
                debugHint: "Errore di battitura nella parola chiave WHERE.",
                hints: ["Usa l'operatore di confronto maggiore (>).", "Non servono apici per i numeri."],
                explanation: "Gli operatori di confronto come > permettono di filtrare dati numerici.",
                replacements: { val: [10, 20, 30, 50, 75, 100, 150, 200] }
            },
            {
                titleTemplate: "Ordini Quantità Minima",
                descTemplate: "Identifica i piccoli ordini per ottimizzare la logistica. Trova gli ordini con meno di {val} articoli.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita < {val}",
                brokenCode: "SELECT * FROM ordini WHERE quantita << {val}",
                debugHint: "Operatore di confronto errato (doppio simbolo).",
                hints: ["Usa l'operatore minore (<).", "Confronta la colonna quantita con il valore {val}."],
                explanation: "Filtrare per valori inferiori a una soglia è utile per segmentare i dati.",
                replacements: { val: [2, 3, 4, 5, 6, 7, 8, 10] }
            },
            {
                titleTemplate: "Prezzi Minori di {val}",
                descTemplate: "Per la sezione 'Offerte Economiche', trova tutti i prodotti che costano meno di {val} euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo < {val}",
                brokenCode: "SELECT * FROM prodotti WHERE price < {val}",
                debugHint: "Nome colonna errato (forse è in inglese?).",
                hints: ["Usa l'operatore minore (<).", "Il prezzo è un valore numerico."],
                explanation: "L'operatore < seleziona valori strettamente inferiori a quello specificato.",
                replacements: { val: [20, 30, 50, 75, 100] }
            },
            {
                titleTemplate: "Stock Maggiore di {val}",
                descTemplate: "Verifica la disponibilità per grandi ordini. Mostra i prodotti con uno stock superiore a {val} unità.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock > {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock >> {val}",
                debugHint: "Operatore di confronto errato.",
                hints: ["Usa WHERE stock > {val}.", "Assicurati di usare il nome corretto della colonna."],
                explanation: "Filtrare per disponibilità minima è essenziale per la gestione degli ordini.",
                replacements: { val: [5, 10, 15, 20, 30] }
            },
            {
                titleTemplate: "Stock Minore di {val}",
                descTemplate: "Allarme scorte: trova i prodotti con stock inferiore a {val} unità per pianificare il riordino.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock < {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock =< {val}",
                debugHint: "L'operatore 'minore o uguale' si scrive <=.",
                hints: ["Usa WHERE stock < {val}.", "Questo filtro aiuta a prevenire l'esaurimento scorte."],
                explanation: "Monitorare i livelli di stock bassi è cruciale per la continuità del business.",
                replacements: { val: [5, 10, 15, 20] }
            },
            {
                titleTemplate: "Utenti Premium",
                descTemplate: "Il servizio clienti vuole contattare i VIP. Seleziona tutti gli utenti che hanno l'abbonamento premium attivo.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE",
                brokenCode: "SELECT * FROM utenti WHERE premium = VERO",
                debugHint: "In SQL i booleani sono TRUE o FALSE (in inglese).",
                hints: ["Usa WHERE premium = TRUE.", "TRUE è una parola chiave per il valore booleano vero."],
                explanation: "I campi booleani possono essere filtrati direttamente con TRUE o FALSE.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Non Premium",
                descTemplate: "Per una campagna di upsell, trova tutti gli utenti che NON hanno ancora l'abbonamento premium.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = FALSE",
                brokenCode: "SELECT * FROM utenti WHERE premium = 'FALSE'",
                debugHint: "FALSE è una parola chiave, non una stringa.",
                hints: ["Usa WHERE premium = FALSE.", "FALSE indica che l'utente non è premium."],
                explanation: "Identificare gli utenti non premium è il primo passo per strategie di conversione.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria Specifica ({cat})",
                descTemplate: "Mostra il catalogo prodotti filtrato per la categoria con ID {cat}.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = {cat}",
                brokenCode: "SELECT * FROM prodotti WHERE category_id = {cat}",
                debugHint: "Controlla il nome della colonna per l'ID categoria.",
                hints: ["Usa WHERE categoria_id = {cat}.", "L'ID è un numero intero."],
                explanation: "Filtrare per chiave esterna (ID categoria) è il modo standard per navigare le relazioni.",
                replacements: { cat: [1, 2, 3] }
            },
            {
                titleTemplate: "Fornitore Specifico ({forn})",
                descTemplate: "Dobbiamo contattare un fornitore. Trova tutti i prodotti forniti dal fornitore con ID {forn}.",
                queryTemplate: "SELECT * FROM prodotti WHERE fornitore_id = {forn}",
                brokenCode: "SELECT * FROM prodotti WHERE fornitore id = {forn}",
                debugHint: "I nomi delle colonne non possono contenere spazi.",
                hints: ["Usa WHERE fornitore_id = {forn}.", "Filtra sulla colonna della chiave esterna."],
                explanation: "Questo tipo di query è frequente nei pannelli di amministrazione.",
                replacements: { forn: [1, 2, 3] }
            },
            {
                titleTemplate: "Quantità Ordine Esatta ({qty})",
                descTemplate: "Analisi pattern di acquisto: trova tutti gli ordini con una quantità esattamente uguale a {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita = {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantita == {qty}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa l'operatore di uguaglianza (=).", "Cerca nella tabella ordini."],
                explanation: "L'uguaglianza esatta è utile per trovare corrispondenze precise.",
                replacements: { qty: [1, 2, 3, 4, 5] }
            },
            {
                titleTemplate: "Quantità Maggiore di {qty}",
                descTemplate: "Identifica gli ordini voluminosi. Mostra gli ordini con quantità superiore a {qty} unità.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita > {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantity > {qty}",
                debugHint: "Controlla il nome della colonna quantità.",
                hints: ["Usa l'operatore maggiore (>).", "Filtra sulla colonna quantita."],
                explanation: "Filtrare per quantità aiuta a segmentare gli ordini per dimensione.",
                replacements: { qty: [2, 3, 4, 5] }
            },
            {
                titleTemplate: "Voto Recensione ({voto})",
                descTemplate: "Analisi sentiment: trova tutte le recensioni con un voto esattamente uguale a {voto}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto = {voto}",
                brokenCode: "SELECT * FROM recensioni WHERE vote = {voto}",
                debugHint: "Controlla il nome della colonna voto.",
                hints: ["Usa WHERE voto = {voto}.", "Il voto è un numero intero."],
                explanation: "Filtrare le recensioni per voto aiuta a capire la soddisfazione dei clienti.",
                replacements: { voto: [1, 2, 3, 4, 5] }
            },
            {
                titleTemplate: "Recensioni Positive ({voto}+)",
                descTemplate: "Mostra tutte le recensioni con voto maggiore o uguale a {voto}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto >= {voto}",
                brokenCode: "SELECT * FROM recensioni WHERE voto > = {voto}",
                debugHint: "L'operatore 'maggiore o uguale' si scrive >= senza spazi.",
                hints: ["Usa WHERE voto >= valore", ">= significa maggiore o uguale"],
                explanation: "Filtro per recensioni positive.",
                replacements: { voto: [3, 4, 5] }
            },
            {
                titleTemplate: "Recensioni Negative ({voto}-)",
                descTemplate: "Trova tutte le recensioni con voto minore o uguale a {voto}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto <= {voto}",
                brokenCode: "SELECT * FROM recensioni WHERE voto < = {voto}",
                debugHint: "L'operatore 'minore o uguale' si scrive <= senza spazi.",
                hints: ["Usa WHERE voto <= valore", "<= significa minore o uguale"],
                explanation: "Filtro per recensioni negative.",
                replacements: { voto: [2, 3] }
            },
            {
                titleTemplate: "Prezzo Maggiore o Uguale ({val})",
                descTemplate: "Mostra i prodotti con prezzo maggiore o uguale a {val} euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo >= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo => {val}",
                debugHint: "L'operatore 'maggiore o uguale' si scrive >=.",
                hints: ["Usa WHERE prezzo >= valore"],
                explanation: "Filtro con operatore >=.",
                replacements: { val: [50, 100, 150, 200] }
            },
            {
                titleTemplate: "Prezzo Minore o Uguale ({val})",
                descTemplate: "Trova i prodotti con prezzo minore o uguale a {val} euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo <= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo =< {val}",
                debugHint: "L'operatore 'minore o uguale' si scrive <=.",
                hints: ["Usa WHERE prezzo <= valore"],
                explanation: "Filtro con operatore <=.",
                replacements: { val: [20, 50, 75, 100] }
            },
            {
                titleTemplate: "Stock Maggiore o Uguale ({val})",
                descTemplate: "Mostra i prodotti con stock maggiore o uguale a {val} unità.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock >= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock >= {val} ;",
                debugHint: "Rimuovi il punto e virgola finale se presente (o altro errore).",
                hints: ["Usa WHERE stock >= valore"],
                explanation: "Filtro per prodotti ben forniti.",
                replacements: { val: [10, 20, 30, 40] }
            },
            {
                titleTemplate: "Stock Minore o Uguale ({val})",
                descTemplate: "Trova i prodotti con stock minore o uguale a {val} unità.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock <= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock <= {val} ;",
                debugHint: "Rimuovi il punto e virgola finale se presente (o altro errore).",
                hints: ["Usa WHERE stock <= valore"],
                explanation: "Filtro per scorte basse.",
                replacements: { val: [5, 10, 15, 20] }
            },
            {
                titleTemplate: "Quantità Minore o Uguale ({qty})",
                descTemplate: "Mostra gli ordini con quantità minore o uguale a {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita <= {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantita <= '{qty}'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["Usa WHERE quantita <= valore"],
                explanation: "Filtro per ordini piccoli.",
                replacements: { qty: [2, 3, 4, 5] }
            },
            {
                titleTemplate: "Quantità Maggiore o Uguale ({qty})",
                descTemplate: "Trova gli ordini con quantità maggiore o uguale a {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita >= {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantita >= '{qty}'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["Usa WHERE quantita >= valore"],
                explanation: "Filtro per ordini grandi.",
                replacements: { qty: [3, 4, 5] }
            },
            {
                titleTemplate: "Nome Prodotto Esatto",
                descTemplate: "Trova il prodotto con nome esattamente uguale a 'Prod 1'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome = 'Prod 1'",
                brokenCode: "SELECT * FROM prodotti WHERE nome = Prod 1",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE nome = 'valore'", "Ricorda gli apici per le stringhe"],
                explanation: "Filtro per nome esatto.",
                replacements: {}
            },
            {
                titleTemplate: "Email Utente Esatta",
                descTemplate: "Trova l'utente con email esattamente uguale a 'user1@mail.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE email = 'user1@mail.com'",
                brokenCode: "SELECT * FROM utenti WHERE email = user1@mail.com",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE email = 'valore'"],
                explanation: "Filtro per email specifica.",
                replacements: {}
            },
            {
                titleTemplate: "Corriere Specifico ({corr})",
                descTemplate: "Mostra tutte le spedizioni gestite dal corriere '{corr}'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = '{corr}'",
                brokenCode: "SELECT * FROM spedizioni WHERE corriere = {corr}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE corriere = 'valore'"],
                explanation: "Filtro per corriere specifico.",
                replacements: { corr: DATA.couriers }
            },
            {
                titleTemplate: "Azienda Fornitore ({azienda})",
                descTemplate: "Trova il fornitore con azienda esattamente uguale a '{azienda}'.",
                queryTemplate: "SELECT * FROM fornitori WHERE azienda = '{azienda}'",
                brokenCode: "SELECT * FROM fornitori WHERE azienda = {azienda}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE azienda = 'valore'"],
                explanation: "Filtro per azienda specifica.",
                replacements: { azienda: DATA.suppliers }
            },
            {
                titleTemplate: "Nazione Fornitore ({nazione})",
                descTemplate: "Mostra tutti i fornitori con sede in '{nazione}'.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione = '{nazione}'",
                brokenCode: "SELECT * FROM fornitori WHERE nazione = {nazione}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE nazione = 'valore'"],
                explanation: "Filtro per nazione fornitore.",
                replacements: { nazione: DATA.countries }
            },
            {
                titleTemplate: "Nome Categoria ({cat})",
                descTemplate: "Trova la categoria con nome esattamente uguale a '{cat}'.",
                queryTemplate: "SELECT * FROM categorie WHERE nome = '{cat}'",
                brokenCode: "SELECT * FROM categorie WHERE nome = {cat}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE nome = 'valore'"],
                explanation: "Filtro per nome categoria.",
                replacements: { cat: DATA.categories }
            },
            {
                titleTemplate: "ID Utente Esatto ({id})",
                descTemplate: "Trova l'utente con ID esattamente uguale a {id}.",
                queryTemplate: "SELECT * FROM utenti WHERE id = {id}",
                brokenCode: "SELECT * FROM utenti WHERE id == {id}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa WHERE id = valore"],
                explanation: "Filtro per ID specifico.",
                replacements: { id: [1, 2, 3, 4, 5, 10, 15, 20] }
            },
            {
                titleTemplate: "ID Prodotto Esatto ({id})",
                descTemplate: "Mostra il prodotto con ID esattamente uguale a {id}.",
                queryTemplate: "SELECT * FROM prodotti WHERE id = {id}",
                brokenCode: "SELECT * FROM prodotti WHERE id == {id}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa WHERE id = valore"],
                explanation: "Filtro per ID prodotto.",
                replacements: { id: [1, 2, 3, 4, 5, 10, 15, 20] }
            },
            {
                titleTemplate: "ID Ordine Esatto ({id})",
                descTemplate: "Trova l'ordine con ID esattamente uguale a {id}.",
                queryTemplate: "SELECT * FROM ordini WHERE id = {id}",
                brokenCode: "SELECT * FROM ordini WHERE id == {id}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa WHERE id = valore"],
                explanation: "Filtro per ID ordine.",
                replacements: { id: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30] }
            },
            // NEW EXERCISES FOR FILTERING EASY
            {
                titleTemplate: "Filtro Data Esatta",
                descTemplate: "Trova gli ordini effettuati esattamente il '2023-01-15'.",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-15'",
                brokenCode: "SELECT * FROM ordini WHERE data_ordine = 2023-01-15",
                debugHint: "Le date sono stringhe e devono essere racchiuse tra apici.",
                hints: ["Usa WHERE data_ordine = 'YYYY-MM-DD'"],
                explanation: "Filtro su data specifica.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Anno 2023",
                descTemplate: "Trova gli ordini effettuati nell'anno 2023 (usa YEAR(data_ordine) = 2023).",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2023",
                brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine) == 2023",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa YEAR()"],
                explanation: "Filtro su anno.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Mese Gennaio",
                descTemplate: "Trova gli ordini effettuati a Gennaio (MONTH(data_ordine) = 1).",
                queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 1",
                brokenCode: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 'Gennaio'",
                debugHint: "La funzione MONTH restituisce un numero (1-12).",
                hints: ["Usa MONTH()"],
                explanation: "Filtro su mese.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Stock Zero",
                descTemplate: "Trova i prodotti esauriti (stock = 0).",
                queryTemplate: "SELECT * FROM prodotti WHERE stock = 0",
                brokenCode: "SELECT * FROM prodotti WHERE stock == 0",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["WHERE stock = 0"],
                explanation: "Filtro per prodotti esauriti.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Stock Positivo",
                descTemplate: "Trova i prodotti disponibili (stock > 0).",
                queryTemplate: "SELECT * FROM prodotti WHERE stock > 0",
                brokenCode: "SELECT * FROM prodotti WHERE stock > '0'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["WHERE stock > 0"],
                explanation: "Filtro per prodotti disponibili.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Minimo 10",
                descTemplate: "Trova i prodotti che costano almeno 10 euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo >= 10",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo >= '10'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["WHERE prezzo >= 10"],
                explanation: "Filtro prezzo minimo.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Massimo 100",
                descTemplate: "Trova i prodotti che costano al massimo 100 euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo <= 100",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo <= '100'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["WHERE prezzo <= 100"],
                explanation: "Filtro prezzo massimo.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Italiani",
                descTemplate: "Trova tutti gli utenti che vivono in 'Italia'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia'",
                brokenCode: "SELECT * FROM utenti WHERE paese = Italia",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE paese = 'Italia'"],
                explanation: "Filtro paese specifico.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Francesi",
                descTemplate: "Trova tutti gli utenti che vivono in 'Francia'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Francia'",
                brokenCode: "SELECT * FROM utenti WHERE paese = Francia",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE paese = 'Francia'"],
                explanation: "Filtro paese specifico.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Tedeschi",
                descTemplate: "Trova tutti gli utenti che vivono in 'Germania'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Germania'",
                brokenCode: "SELECT * FROM utenti WHERE paese = Germania",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE paese = 'Germania'"],
                explanation: "Filtro paese specifico.",
                replacements: {}
            },
            {
                titleTemplate: "Spedizioni DHL",
                descTemplate: "Trova tutte le spedizioni affidate a 'DHL'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = 'DHL'",
                brokenCode: "SELECT * FROM spedizioni WHERE corriere = DHL",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE corriere = 'DHL'"],
                explanation: "Filtro corriere.",
                replacements: {}
            },
            {
                titleTemplate: "Spedizioni UPS",
                descTemplate: "Trova tutte le spedizioni affidate a 'UPS'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = 'UPS'",
                brokenCode: "SELECT * FROM spedizioni WHERE corriere = UPS",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE corriere = 'UPS'"],
                explanation: "Filtro corriere.",
                replacements: {}
            },
            {
                titleTemplate: "Recensioni 5 Stelle",
                descTemplate: "Trova tutte le recensioni con voto 5.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto = 5",
                brokenCode: "SELECT * FROM recensioni WHERE voto == 5",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["WHERE voto = 5"],
                explanation: "Filtro voto massimo.",
                replacements: {}
            },
            {
                titleTemplate: "Recensioni 1 Stella",
                descTemplate: "Trova tutte le recensioni con voto 1.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto = 1",
                hints: ["WHERE voto = 1"],
                explanation: "Filtro voto minimo.",
                replacements: {}
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Filtro Range Prezzo ({min}-{max})",
                descTemplate: "Seleziona dalla tabella 'prodotti' i record con un prezzo compreso tra {min} e {max} euro inclusi.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN {min} AND {max}",
                hints: ["Per intervalli inclusivi, esiste un operatore dedicato (BETWEEN)."],
                explanation: "BETWEEN semplifica la scrittura di range >= e <=.",
                replacements: { min: DATA.prices_min, max: DATA.prices_max }
            },
            {
                titleTemplate: "Multi-Condizione (AND)",
                descTemplate: "Trova gli utenti che sono Premium E vivono in {country}.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = '{country}'",
                hints: ["Usa AND per obbligare entrambe le condizioni"],
                explanation: "AND restringe il risultato: tutte le condizioni devono essere vere.",
                replacements: { country: DATA.countries }
            },
            {
                titleTemplate: "Lista Categorie (IN)",
                descTemplate: "Trova i prodotti che appartengono alle categorie con ID {id1} o {id2}.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN ({id1}, {id2})",
                hints: ["Usa IN (valore1, valore2)"],
                explanation: "IN è una scorciatoia per una serie di OR.",
                replacements: { id1: [1, 2], id2: [2, 3], id3: [1, 3] }
            },
            {
                titleTemplate: "Esclusione Paese (NOT)",
                descTemplate: "Trova tutti gli utenti che NON vivono in {country}.",
                queryTemplate: "SELECT * FROM utenti WHERE paese <> '{country}'",
                hints: ["Usa <> oppure != per 'diverso da'"],
                explanation: "Escludere record specifici.",
                replacements: { country: DATA.countries }
            },
            {
                titleTemplate: "Range Stock ({min}-{max})",
                descTemplate: "Trova i prodotti con stock compreso tra {min} e {max} unità inclusi.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock BETWEEN {min} AND {max}",
                hints: ["Usa BETWEEN per range", "SELECT * FROM prodotti WHERE stock BETWEEN {min} AND {max}"],
                explanation: "BETWEEN per filtrare range di valori.",
                replacements: { min: [5, 10, 15, 20], max: [25, 30, 40, 50] }
            },
            {
                titleTemplate: "Range Quantità ({min}-{max})",
                descTemplate: "Trova gli ordini con quantità compresa tra {min} e {max} inclusi.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita BETWEEN {min} AND {max}",
                hints: ["Usa BETWEEN per range", "SELECT * FROM ordini WHERE quantita BETWEEN {min} AND {max}"],
                explanation: "BETWEEN per filtrare quantità ordini.",
                replacements: { min: [1, 2, 3], max: [4, 5, 6, 7] }
            },
            {
                titleTemplate: "Range Voti ({min}-{max})",
                descTemplate: "Trova le recensioni con voto compreso tra {min} e {max} inclusi.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto BETWEEN {min} AND {max}",
                hints: ["Usa BETWEEN per range voti", "SELECT * FROM recensioni WHERE voto BETWEEN {min} AND {max}"],
                explanation: "BETWEEN per filtrare range di voti.",
                replacements: { min: [1, 2, 3], max: [3, 4, 5] }
            },
            {
                titleTemplate: "Premium E Paese ({country})",
                descTemplate: "Trova gli utenti Premium che vivono in '{country}'.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = '{country}'",
                hints: ["Usa AND per combinare condizioni", "premium = TRUE AND paese = '...'"],
                explanation: "AND per combinare più condizioni.",
                replacements: { country: DATA.countries }
            },
            {
                titleTemplate: "Prezzo E Stock ({prezzo} e {stock})",
                descTemplate: "Trova i prodotti con prezzo maggiore di {prezzo} E stock maggiore di {stock}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > {prezzo} AND stock > {stock}",
                hints: ["Usa AND per combinare", "prezzo > {prezzo} AND stock > {stock}"],
                explanation: "AND per filtri multipli.",
                replacements: { prezzo: [50, 100], stock: [10, 20] }
            },
            {
                titleTemplate: "Categoria E Fornitore ({cat} e {forn})",
                descTemplate: "Trova i prodotti della categoria {cat} E del fornitore {forn}.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = {cat} AND fornitore_id = {forn}",
                hints: ["Usa AND per combinare", "categoria_id = {cat} AND fornitore_id = {forn}"],
                explanation: "AND per filtri multipli su colonne diverse.",
                replacements: { cat: [1, 2, 3], forn: [1, 2, 3] }
            },
            {
                titleTemplate: "Lista Paesi (IN)",
                descTemplate: "Trova gli utenti che vivono in Italia, Francia o Germania usando IN.",
                queryTemplate: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Germania')",
                hints: ["Usa IN con lista di valori", "WHERE paese IN ('val1', 'val2', 'val3')"],
                explanation: "IN per filtrare su lista di valori.",
                replacements: {}
            },
            {
                titleTemplate: "Lista Corrieri (IN)",
                descTemplate: "Trova le spedizioni gestite da DHL, UPS o FedEx usando IN.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere IN ('DHL', 'UPS', 'FedEx')",
                hints: ["Usa IN con lista corrieri", "WHERE corriere IN ('DHL', 'UPS', 'FedEx')"],
                explanation: "IN per filtrare su lista di stringhe.",
                replacements: {}
            },
            {
                titleTemplate: "Lista Categorie Multiple (IN)",
                descTemplate: "Trova i prodotti che appartengono alle categorie 1, 2 o 3 usando IN.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2, 3)",
                hints: ["Usa IN con lista numeri", "WHERE categoria_id IN (1, 2, 3)"],
                explanation: "IN per filtrare su lista di numeri.",
                replacements: {}
            },
            {
                titleTemplate: "Lista Voti (IN)",
                descTemplate: "Trova le recensioni con voto 4 o 5 usando IN.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto IN (4, 5)",
                hints: ["Usa IN con lista voti", "WHERE voto IN (4, 5)"],
                explanation: "IN per filtrare voti alti.",
                replacements: {}
            },
            {
                titleTemplate: "Esclusione Prezzo (NOT)",
                descTemplate: "Trova i prodotti che NON costano {val} euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo <> {val}",
                hints: ["Usa <> per diverso", "WHERE prezzo <> {val}"],
                explanation: "Operatore <> per escludere valori.",
                replacements: { val: [50, 100, 150] }
            },
            {
                titleTemplate: "Esclusione Stock (NOT)",
                descTemplate: "Trova i prodotti che NON hanno stock uguale a {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock <> {val}",
                hints: ["Usa <> per diverso", "WHERE stock <> {val}"],
                explanation: "Esclusione di valori specifici.",
                replacements: { val: [0, 10, 20] }
            },
            {
                titleTemplate: "Esclusione Categoria (NOT IN)",
                descTemplate: "Trova i prodotti che NON appartengono alle categorie 1 o 2.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2)",
                hints: ["Usa NOT IN per escludere lista", "WHERE categoria_id NOT IN (1, 2)"],
                explanation: "NOT IN per escludere più valori.",
                replacements: {}
            },
            {
                titleTemplate: "Esclusione Paesi (NOT IN)",
                descTemplate: "Trova gli utenti che NON vivono in Italia, Francia o Germania.",
                queryTemplate: "SELECT * FROM utenti WHERE paese NOT IN ('Italia', 'Francia', 'Germania')",
                hints: ["Usa NOT IN con lista", "WHERE paese NOT IN ('...', '...')"],
                explanation: "NOT IN per escludere lista di paesi.",
                replacements: {}
            },
            {
                titleTemplate: "AND con Tre Condizioni",
                descTemplate: "Trova i prodotti con prezzo > 50, stock > 10 E categoria_id = 1.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > 50 AND stock > 10 AND categoria_id = 1",
                hints: ["Usa AND per tutte le condizioni", "condizione1 AND condizione2 AND condizione3"],
                explanation: "AND per combinare tre condizioni.",
                replacements: {}
            },
            {
                titleTemplate: "AND Utente Completo",
                descTemplate: "Trova gli utenti Premium che vivono in Italia E hanno email che contiene '@mail.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND email LIKE '%@mail.com'",
                hints: ["Combina AND con LIKE", "premium = TRUE AND paese = '...' AND email LIKE '...'"],
                explanation: "AND per combinare condizioni multiple.",
                replacements: {}
            },
            {
                titleTemplate: "Range Prezzo con AND",
                descTemplate: "Trova i prodotti con prezzo tra 50 e 200 E stock maggiore di 15.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN 50 AND 200 AND stock > 15",
                hints: ["Combina BETWEEN con AND", "prezzo BETWEEN ... AND ... AND stock > ..."],
                explanation: "BETWEEN combinato con AND.",
                replacements: {}
            },
            {
                titleTemplate: "IN con AND",
                descTemplate: "Trova i prodotti delle categorie 1 o 2 E con prezzo maggiore di 75.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2) AND prezzo > 75",
                hints: ["Combina IN con AND", "categoria_id IN (...) AND prezzo > ..."],
                explanation: "IN combinato con AND.",
                replacements: {}
            },
            {
                titleTemplate: "NOT con AND",
                descTemplate: "Trova i prodotti che NON sono della categoria 3 E hanno stock maggiore di 5.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id <> 3 AND stock > 5",
                hints: ["Combina NOT con AND", "categoria_id <> 3 AND stock > 5"],
                explanation: "NOT combinato con AND.",
                replacements: {}
            },
            {
                titleTemplate: "BETWEEN Stock e Prezzo",
                descTemplate: "Trova i prodotti con stock tra 10 e 30 E prezzo tra 50 e 150.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock BETWEEN 10 AND 30 AND prezzo BETWEEN 50 AND 150",
                hints: ["Usa BETWEEN due volte con AND", "stock BETWEEN ... AND ... AND prezzo BETWEEN ..."],
                explanation: "Doppio BETWEEN con AND.",
                replacements: {}
            },
            {
                titleTemplate: "IN Paesi e Premium",
                descTemplate: "Trova gli utenti che vivono in Italia, Francia o Spagna E sono Premium.",
                queryTemplate: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Spagna') AND premium = TRUE",
                hints: ["Combina IN con AND", "paese IN (...) AND premium = TRUE"],
                explanation: "IN combinato con AND per filtri complessi.",
                replacements: {}
            },
            {
                titleTemplate: "NOT IN Categorie e Stock",
                descTemplate: "Trova i prodotti che NON sono delle categorie 1 o 2 E hanno stock maggiore di 20.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2) AND stock > 20",
                hints: ["Combina NOT IN con AND", "categoria_id NOT IN (...) AND stock > ..."],
                explanation: "NOT IN combinato con AND.",
                replacements: {}
            },
            {
                titleTemplate: "BETWEEN Quantità e Data",
                descTemplate: "Trova gli ordini con quantità tra 2 e 5 E data dopo '2023-06-01'.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita BETWEEN 2 AND 5 AND data_ordine > '2023-06-01'",
                hints: ["Combina BETWEEN con confronto data", "quantita BETWEEN ... AND ... AND data_ordine > ..."],
                explanation: "BETWEEN combinato con confronto date.",
                replacements: {}
            },
            {
                titleTemplate: "IN Voti e Prodotto",
                descTemplate: "Trova le recensioni con voto 4 o 5 E per il prodotto con ID 1.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto IN (4, 5) AND prodotto_id = 1",
                hints: ["Combina IN con AND", "voto IN (...) AND prodotto_id = ..."],
                explanation: "IN combinato con AND per recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "BETWEEN Prezzo e Categoria",
                descTemplate: "Trova i prodotti con prezzo tra 100 e 500 E della categoria 2.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN 100 AND 500 AND categoria_id = 2",
                hints: ["Combina BETWEEN con AND", "prezzo BETWEEN ... AND ... AND categoria_id = ..."],
                explanation: "BETWEEN con filtro categoria.",
                replacements: {}
            },
            {
                titleTemplate: "NOT IN Fornitori e Prezzo",
                descTemplate: "Trova i prodotti che NON sono dei fornitori 1 o 2 E costano più di 50 euro.",
                queryTemplate: "SELECT * FROM prodotti WHERE fornitore_id NOT IN (1, 2) AND prezzo > 50",
                hints: ["Combina NOT IN con AND", "fornitore_id NOT IN (...) AND prezzo > ..."],
                explanation: "NOT IN combinato con AND per filtri complessi.",
                replacements: {}
            },
            // NEW EXERCISES FOR FILTERING MEDIUM
            {
                titleTemplate: "BETWEEN Date",
                descTemplate: "Trova gli ordini effettuati tra '2023-01-01' e '2023-12-31'.",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31'",
                hints: ["Usa BETWEEN con date"],
                explanation: "BETWEEN funziona anche con le date.",
                replacements: {}
            },
            {
                titleTemplate: "OR con Date",
                descTemplate: "Trova gli ordini del '2023-01-01' O del '2024-01-01'.",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-01' OR data_ordine = '2024-01-01'",
                hints: ["Usa OR con date"],
                explanation: "OR per date specifiche.",
                replacements: {}
            },
            {
                titleTemplate: "AND con Date e Quantità",
                descTemplate: "Trova gli ordini del 2023 con quantità > 5.",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2023 AND quantita > 5",
                hints: ["Combina YEAR() e AND"],
                explanation: "Filtro temporale e numerico.",
                replacements: {}
            },
            {
                titleTemplate: "IN con Stringhe",
                descTemplate: "Trova i prodotti che si chiamano 'Laptop' o 'Mouse'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome IN ('Laptop', 'Mouse')",
                hints: ["Usa IN con stringhe"],
                explanation: "IN per lista nomi.",
                replacements: {}
            },
            {
                titleTemplate: "NOT BETWEEN Prezzo",
                descTemplate: "Trova i prodotti con prezzo NON compreso tra 50 e 100.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo NOT BETWEEN 50 AND 100",
                hints: ["Usa NOT BETWEEN"],
                explanation: "Esclusione range.",
                replacements: {}
            },
            {
                titleTemplate: "NOT BETWEEN Stock",
                descTemplate: "Trova i prodotti con stock NON compreso tra 10 e 20.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock NOT BETWEEN 10 AND 20",
                hints: ["Usa NOT BETWEEN"],
                explanation: "Esclusione range stock.",
                replacements: {}
            },
            {
                titleTemplate: "AND con Tre Filtri",
                descTemplate: "Trova utenti Premium, Italiani e con ID > 10.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND id > 10",
                hints: ["Tre condizioni AND"],
                explanation: "Filtri multipli.",
                replacements: {}
            },
            {
                titleTemplate: "OR con Tre Filtri",
                descTemplate: "Trova utenti Italiani, Francesi o Tedeschi (senza usare IN).",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia' OR paese = 'Francia' OR paese = 'Germania'",
                hints: ["Tre condizioni OR"],
                explanation: "Alternative multiple.",
                replacements: {}
            },
            {
                titleTemplate: "Misto AND/OR Semplice",
                descTemplate: "Trova prodotti (Categoria 1 E Prezzo < 50) OPPURE (Categoria 2 E Prezzo > 100).",
                queryTemplate: "SELECT * FROM prodotti WHERE (categoria_id = 1 AND prezzo < 50) OR (categoria_id = 2 AND prezzo > 100)",
                hints: ["Usa parentesi per i gruppi AND"],
                explanation: "Logica mista.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Lunghezza Nome",
                descTemplate: "Trova utenti con nome più lungo di 5 caratteri (LEN).",
                queryTemplate: "SELECT * FROM utenti WHERE LEN(nome) > 5",
                hints: ["Usa LEN(colonna)"],
                explanation: "Filtro su lunghezza stringa.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Iniziale Nome",
                descTemplate: "Trova utenti il cui nome inizia per 'A' (LEFT).",
                queryTemplate: "SELECT * FROM utenti WHERE LEFT(nome, 1) = 'A'",
                hints: ["Usa LEFT(colonna, 1)"],
                explanation: "Filtro su iniziale.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Finale Email",
                descTemplate: "Trova utenti con email che finisce per '.com' (RIGHT).",
                queryTemplate: "SELECT * FROM utenti WHERE RIGHT(email, 4) = '.com'",
                hints: ["Usa RIGHT(colonna, 4)"],
                explanation: "Filtro su suffisso.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Anno Corrente",
                descTemplate: "Trova ordini di quest'anno (YEAR(data_ordine) = 2024).",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2024",
                hints: ["Usa YEAR()"],
                explanation: "Filtro anno.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Mese Corrente",
                descTemplate: "Trova ordini di questo mese (MONTH(data_ordine) = 11).",
                queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 11",
                hints: ["Usa MONTH()"],
                explanation: "Filtro mese.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Giorno",
                descTemplate: "Trova ordini fatti il giorno 15 di qualsiasi mese.",
                queryTemplate: "SELECT * FROM ordini WHERE DAY(data_ordine) = 15",
                hints: ["Usa DAY()"],
                explanation: "Filtro giorno del mese.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Ricerca Pattern ({name})",
                descTemplate: "Trova gli utenti il cui nome inizia con la sequenza '{name}'.",
                queryTemplate: "SELECT * FROM utenti WHERE nome LIKE '{name}%'",
                hints: ["Usa LIKE con il jolly %", "Esempio: LIKE 'Abc%'"],
                explanation: "LIKE permette il pattern matching parziale.",
                replacements: { name: ['Mar', 'Giu', 'Al', 'Fra', 'Luc', 'Rob', 'Elen', 'Ales'] }
            },
            {
                titleTemplate: "Logica Complessa (OR + AND)",
                descTemplate: "Trova i prodotti che costano più di 100 euro OPPURE che hanno stock 0, ma in entrambi i casi devono essere della categoria {cat}.",
                queryTemplate: "SELECT * FROM prodotti WHERE (prezzo > 100 OR stock = 0) AND categoria_id = {cat}",
                hints: ["Usa le parentesi per raggruppare l'OR", "(A OR B) AND C"],
                explanation: "Le parentesi sono fondamentali quando mischi AND e OR.",
                replacements: { cat: [1, 2, 3] }
            },
            {
                titleTemplate: "Gestione NULL",
                descTemplate: "Trova le spedizioni che NON hanno ancora un codice di tracking assegnato (valore nullo).",
                queryTemplate: "SELECT * FROM spedizioni WHERE codice_tracking IS NULL",
                hints: ["Non usare = NULL, usa IS NULL"],
                explanation: "In SQL, NULL non è uguale a niente, nemmeno a se stesso.",
                replacements: {}
            },
            {
                titleTemplate: "Esclusione Lista",
                descTemplate: "Trova i fornitori che NON si trovano né in Italia né in Germania.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione NOT IN ('Italia', 'Germania')",
                hints: ["Usa NOT IN (...)"],
                explanation: "Filtro di esclusione su insieme di valori.",
                replacements: {}
            },
            {
                titleTemplate: "LIKE Pattern Finale ({pattern})",
                descTemplate: "Trova i prodotti il cui nome termina con '{pattern}'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome LIKE '%{pattern}'",
                hints: ["Usa % all'inizio per pattern finale", "LIKE '%pattern'"],
                explanation: "LIKE con % all'inizio per pattern finali.",
                replacements: { pattern: ['1', '2', '3', '4', '5'] }
            },
            {
                titleTemplate: "LIKE Pattern Contiene ({pattern})",
                descTemplate: "Trova gli utenti il cui nome contiene la sequenza '{pattern}'.",
                queryTemplate: "SELECT * FROM utenti WHERE nome LIKE '%{pattern}%'",
                hints: ["Usa % prima e dopo", "LIKE '%pattern%'"],
                explanation: "LIKE con % su entrambi i lati per ricerca contenuto.",
                replacements: { pattern: ['ar', 'ia', 'co', 'ca'] }
            },
            {
                titleTemplate: "LIKE Email Pattern",
                descTemplate: "Trova gli utenti con email che contiene '@mail.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE email LIKE '%@mail.com'",
                hints: ["Usa LIKE con %", "WHERE email LIKE '%@mail.com'"],
                explanation: "LIKE per pattern matching su email.",
                replacements: {}
            },
            {
                titleTemplate: "IS NOT NULL",
                descTemplate: "Trova le spedizioni che HANNO un codice di tracking assegnato (non nullo).",
                queryTemplate: "SELECT * FROM spedizioni WHERE codice_tracking IS NOT NULL",
                hints: ["Usa IS NOT NULL", "WHERE colonna IS NOT NULL"],
                explanation: "IS NOT NULL per trovare valori non nulli.",
                replacements: {}
            },
            {
                titleTemplate: "OR Semplice",
                descTemplate: "Trova i prodotti che costano più di 200 euro OPPURE hanno stock maggiore di 40.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > 200 OR stock > 40",
                hints: ["Usa OR per alternative", "condizione1 OR condizione2"],
                explanation: "OR restituisce righe che soddisfano almeno una condizione.",
                replacements: {}
            },
            {
                titleTemplate: "OR con Tre Opzioni",
                descTemplate: "Trova i prodotti della categoria 1, 2 O 3.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = 1 OR categoria_id = 2 OR categoria_id = 3",
                hints: ["Usa OR multipli", "categoria_id = 1 OR categoria_id = 2 OR categoria_id = 3"],
                explanation: "OR multipli per alternative.",
                replacements: {}
            },
            {
                titleTemplate: "OR Paesi",
                descTemplate: "Trova gli utenti che vivono in Italia O in Francia O in Germania.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia' OR paese = 'Francia' OR paese = 'Germania'",
                hints: ["Usa OR per paesi multipli", "paese = '...' OR paese = '...' OR paese = '...'"],
                explanation: "OR per filtrare su più paesi.",
                replacements: {}
            },
            {
                titleTemplate: "Parentesi OR e AND",
                descTemplate: "Trova i prodotti che (costano più di 100 O stock > 30) E sono della categoria 1.",
                queryTemplate: "SELECT * FROM prodotti WHERE (prezzo > 100 OR stock > 30) AND categoria_id = 1",
                hints: ["Usa parentesi per raggruppare OR", "(A OR B) AND C"],
                explanation: "Parentesi per controllare l'ordine di valutazione.",
                replacements: {}
            },
            {
                titleTemplate: "AND e OR Complesso",
                descTemplate: "Trova gli utenti Premium che vivono in Italia O in Francia.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND (paese = 'Italia' OR paese = 'Francia')",
                hints: ["Raggruppa OR con parentesi", "premium = TRUE AND (paese = '...' OR paese = '...')"],
                explanation: "AND combinato con OR raggruppato.",
                replacements: {}
            },
            {
                titleTemplate: "Tripla Condizione OR",
                descTemplate: "Trova i prodotti con prezzo < 20 O stock = 0 O categoria_id = 3.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo < 20 OR stock = 0 OR categoria_id = 3",
                hints: ["Usa OR multipli", "condizione1 OR condizione2 OR condizione3"],
                explanation: "OR multipli per condizioni alternative.",
                replacements: {}
            },
            {
                titleTemplate: "NOT LIKE Pattern",
                descTemplate: "Trova i prodotti il cui nome NON inizia con 'Prod'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome NOT LIKE 'Prod%'",
                hints: ["Usa NOT LIKE", "WHERE nome NOT LIKE 'pattern%'"],
                explanation: "NOT LIKE per escludere pattern.",
                replacements: {}
            },
            {
                titleTemplate: "LIKE Carattere Singolo",
                descTemplate: "Trova i prodotti il cui nome ha esattamente 6 caratteri e inizia con 'Prod'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome LIKE 'Prod _'",
                hints: ["Usa _ per carattere singolo", "LIKE 'Prod _' (con spazio e underscore)"],
                explanation: "_ rappresenta un singolo carattere in LIKE.",
                replacements: {}
            },
            {
                titleTemplate: "OR con BETWEEN",
                descTemplate: "Trova i prodotti con prezzo tra 50 e 100 O stock tra 20 e 30.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN 50 AND 100 OR stock BETWEEN 20 AND 30",
                hints: ["Combina BETWEEN con OR", "prezzo BETWEEN ... OR stock BETWEEN ..."],
                explanation: "OR combinato con BETWEEN.",
                replacements: {}
            },
            {
                titleTemplate: "NOT IN Multiplo",
                descTemplate: "Trova i prodotti che NON sono delle categorie 1, 2 o 3.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2, 3)",
                hints: ["Usa NOT IN con lista", "WHERE categoria_id NOT IN (1, 2, 3)"],
                explanation: "NOT IN per escludere lista di valori.",
                replacements: {}
            },
            {
                titleTemplate: "OR con IN",
                descTemplate: "Trova i prodotti delle categorie 1 o 2 O con prezzo maggiore di 150.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2) OR prezzo > 150",
                hints: ["Combina IN con OR", "categoria_id IN (...) OR prezzo > ..."],
                explanation: "IN combinato con OR.",
                replacements: {}
            },
            {
                titleTemplate: "Parentesi Complesse",
                descTemplate: "Trova i prodotti che (costano più di 100 E stock > 10) O (categoria_id = 3 E prezzo < 50).",
                queryTemplate: "SELECT * FROM prodotti WHERE (prezzo > 100 AND stock > 10) OR (categoria_id = 3 AND prezzo < 50)",
                hints: ["Raggruppa entrambe le parti con parentesi", "(A AND B) OR (C AND D)"],
                explanation: "Parentesi multiple per logica complessa.",
                replacements: {}
            },
            {
                titleTemplate: "LIKE e AND",
                descTemplate: "Trova gli utenti il cui nome inizia con 'Mar' E sono Premium.",
                queryTemplate: "SELECT * FROM utenti WHERE nome LIKE 'Mar%' AND premium = TRUE",
                hints: ["Combina LIKE con AND", "nome LIKE '...' AND premium = TRUE"],
                explanation: "LIKE combinato con AND.",
                replacements: {}
            },
            {
                titleTemplate: "IS NULL e AND",
                descTemplate: "Trova le spedizioni senza codice tracking E con corriere 'DHL'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE codice_tracking IS NULL AND corriere = 'DHL'",
                hints: ["Combina IS NULL con AND", "codice_tracking IS NULL AND corriere = '...'"],
                explanation: "IS NULL combinato con AND.",
                replacements: {}
            },
            {
                titleTemplate: "NOT IN e OR",
                descTemplate: "Trova i prodotti che NON sono delle categorie 1 o 2 O hanno stock = 0.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2) OR stock = 0",
                hints: ["Combina NOT IN con OR", "categoria_id NOT IN (...) OR stock = 0"],
                explanation: "NOT IN combinato con OR.",
                replacements: {}
            },
            {
                titleTemplate: "LIKE Pattern Complesso",
                descTemplate: "Trova i prodotti il cui nome contiene 'Prod' e termina con un numero.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome LIKE '%Prod%' AND nome LIKE '%[0-9]'",
                hints: ["Usa LIKE multipli con AND", "nome LIKE '%Prod%' AND nome LIKE '%[0-9]'"],
                explanation: "LIKE multipli per pattern complessi.",
                replacements: {}
            },
            {
                titleTemplate: "OR Triplo con AND",
                descTemplate: "Trova gli utenti che (vivono in Italia O Francia O Spagna) E sono Premium.",
                queryTemplate: "SELECT * FROM utenti WHERE (paese = 'Italia' OR paese = 'Francia' OR paese = 'Spagna') AND premium = TRUE",
                hints: ["Raggruppa OR con parentesi", "(paese = '...' OR paese = '...' OR paese = '...') AND premium = TRUE"],
                explanation: "OR multipli raggruppati con AND.",
                replacements: {}
            },
            {
                titleTemplate: "BETWEEN e OR",
                descTemplate: "Trova i prodotti con prezzo tra 50 e 100 O stock tra 15 e 25.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN 50 AND 100 OR stock BETWEEN 15 AND 25",
                hints: ["Combina BETWEEN con OR", "prezzo BETWEEN ... OR stock BETWEEN ..."],
                explanation: "BETWEEN combinato con OR.",
                replacements: {}
            },
            {
                titleTemplate: "NOT e AND Multiplo",
                descTemplate: "Trova i prodotti che NON sono della categoria 1 E hanno prezzo > 75 E stock > 10.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id <> 1 AND prezzo > 75 AND stock > 10",
                hints: ["Combina NOT con AND multipli", "categoria_id <> 1 AND prezzo > ... AND stock > ..."],
                explanation: "NOT combinato con AND multipli.",
                replacements: {}
            },
            {
                titleTemplate: "IS NULL o IS NOT NULL",
                descTemplate: "Trova le spedizioni senza codice tracking O con codice tracking non nullo e corriere 'UPS'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE codice_tracking IS NULL OR (codice_tracking IS NOT NULL AND corriere = 'UPS')",
                hints: ["Combina IS NULL con OR e AND", "codice_tracking IS NULL OR (...)"],
                explanation: "Logica complessa con NULL.",
                replacements: {}
            },
            // NEW EXERCISES FOR FILTERING HARD
            {
                titleTemplate: "LIKE con Underscore Multipli",
                descTemplate: "Trova prodotti con nome di 4 caratteri esatti.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome LIKE '____'",
                hints: ["Usa 4 underscore"],
                explanation: "Pattern lunghezza fissa.",
                replacements: {}
            },
            {
                titleTemplate: "LIKE con % nel mezzo",
                descTemplate: "Trova utenti con 'a' come seconda lettera.",
                queryTemplate: "SELECT * FROM utenti WHERE nome LIKE '_a%'",
                hints: ["Underscore poi a poi %"],
                explanation: "Pattern posizionale.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Calcolato",
                descTemplate: "Trova prodotti dove il valore stock (prezzo * stock) supera 1000.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo * stock > 1000",
                hints: ["Puoi usare espressioni nel WHERE"],
                explanation: "Filtro su colonna calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Calcolato Sconto",
                descTemplate: "Trova prodotti dove il prezzo scontato (prezzo * 0.9) è inferiore a 50.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo * 0.9 < 50",
                hints: ["Espressione nel WHERE"],
                explanation: "Filtro su calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Fine Anno",
                descTemplate: "Trova ordini fatti nell'ultimo mese del 2023 (Dicembre).",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine >= '2023-12-01'",
                hints: ["Usa confronto con data fissa"],
                explanation: "Filtro temporale assoluto.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Anno Bisestile",
                descTemplate: "Trova ordini fatti in un anno bisestile (es. 2024).",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) % 4 = 0",
                hints: ["Usa modulo % 4"],
                explanation: "Filtro aritmetico su data.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Pari/Dispari",
                descTemplate: "Trova ordini con ID pari.",
                queryTemplate: "SELECT * FROM ordini WHERE id % 2 = 0",
                brokenCode: "SELECT * FROM ordini WHERE id % 2 == 0",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa modulo % 2"],
                explanation: "Filtro parità.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Dispari",
                descTemplate: "Trova ordini con ID dispari.",
                queryTemplate: "SELECT * FROM ordini WHERE id % 2 <> 0",
                brokenCode: "SELECT * FROM ordini WHERE id % 2 =! 0",
                debugHint: "L'operatore 'diverso' si scrive <> (o !=).",
                hints: ["Usa modulo % 2 diverso da 0"],
                explanation: "Filtro disparità.",
                replacements: {}
            },
            {
                titleTemplate: "NOT LIKE Complesso",
                descTemplate: "Trova utenti il cui nome NON contiene 'a'.",
                queryTemplate: "SELECT * FROM utenti WHERE nome NOT LIKE '%a%'",
                brokenCode: "SELECT * FROM utenti WHERE nome NO LIKE '%a%'",
                debugHint: "La clausola corretta è NOT LIKE.",
                hints: ["NOT LIKE '%a%'"],
                explanation: "Esclusione pattern.",
                replacements: {}
            },
            {
                titleTemplate: "NOT LIKE Iniziale",
                descTemplate: "Trova prodotti che NON iniziano per 'P'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome NOT LIKE 'P%'",
                brokenCode: "SELECT * FROM prodotti WHERE nome NOT LIKE P%",
                debugHint: "Il pattern deve essere racchiuso tra apici.",
                hints: ["NOT LIKE 'P%'"],
                explanation: "Esclusione iniziale.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Lunghezza Email",
                descTemplate: "Trova utenti con email più corta di 15 caratteri.",
                queryTemplate: "SELECT * FROM utenti WHERE LEN(email) < 15",
                brokenCode: "SELECT * FROM utenti WHERE LEN(email) < '15'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["LEN(email) < 15"],
                explanation: "Filtro lunghezza.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Dominio Email",
                descTemplate: "Trova utenti con dominio email diverso da 'gmail.com' (usando LIKE).",
                queryTemplate: "SELECT * FROM utenti WHERE email NOT LIKE '%@gmail.com'",
                brokenCode: "SELECT * FROM utenti WHERE email NOT LIKE %@gmail.com",
                debugHint: "Il pattern deve essere racchiuso tra apici.",
                hints: ["NOT LIKE '%@gmail.com'"],
                explanation: "Esclusione dominio.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Prezzo o Stock Zero",
                descTemplate: "Trova prodotti gratis (prezzo=0) o esauriti (stock=0).",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo = 0 OR stock = 0",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo = 0 OR stock == 0",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["OR tra due uguaglianze"],
                explanation: "Casi limite.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Multiplo Categorie",
                descTemplate: "Trova prodotti di cat 1 con prezzo > 10, o cat 2 con prezzo > 20.",
                queryTemplate: "SELECT * FROM prodotti WHERE (categoria_id = 1 AND prezzo > 10) OR (categoria_id = 2 AND prezzo > 20)",
                brokenCode: "SELECT * FROM prodotti WHERE (categoria_id = 1 AND prezzo > 10) OR (categoria_id = 2 AND prezzo > 20",
                debugHint: "Manca una parentesi di chiusura.",
                hints: ["Parentesi essenziali"],
                explanation: "Logica condizionale complessa.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Esclusivo",
                descTemplate: "Trova prodotti che sono o cat 1 o cat 2, ma non entrambi (XOR simulato).",
                queryTemplate: "SELECT * FROM prodotti WHERE (categoria_id = 1 OR categoria_id = 2) AND NOT (categoria_id = 1 AND categoria_id = 2)",
                brokenCode: "SELECT * FROM prodotti WHERE (categoria_id = 1 OR categoria_id = 2) AND NOT (categoria_id = 1 AND categoria_id = 2",
                debugHint: "Manca una parentesi di chiusura.",
                hints: ["(A OR B) AND NOT (A AND B)"],
                explanation: "XOR logico.",
                replacements: {}
            },
            {
                titleTemplate: "Logica Complessa Finale",
                descTemplate: "Trova i prodotti che ((costano più di 150 E stock > 20) O (categoria_id = 2 E prezzo < 100)) E fornitore_id <> 3.",
                queryTemplate: "SELECT * FROM prodotti WHERE ((prezzo > 150 AND stock > 20) OR (categoria_id = 2 AND prezzo < 100)) AND fornitore_id <> 3",
                brokenCode: "SELECT * FROM prodotti WHERE ((prezzo > 150 AND stock > 20) OR (categoria_id = 2 AND prezzo < 100) AND fornitore_id <> 3",
                debugHint: "Controlla il bilanciamento delle parentesi.",
                hints: ["Usa parentesi multiple", "((A AND B) OR (C AND D)) AND E"],
                explanation: "Logica condizionale complessa.",
                replacements: {}
            }
        ]
    },
    [TopicId.Sorting]: {
        [Difficulty.Easy]: [
            {
                titleTemplate: "Prezzo Crescente",
                descTemplate: "Mostra l'elenco dei prodotti ordinati dal più economico al più costoso.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC",
                brokenCode: "SELECT * FROM prodotti ORDER prezzo ASC",
                debugHint: "Manca la parola chiave BY dopo ORDER.",
                hints: ["Usa ORDER BY colonna ASC", "ASC è opzionale (default)"],
                explanation: "L'ordinamento base.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Decrescente",
                descTemplate: "Ordina i prodotti in base alla quantità in magazzino, dal più alto al più basso.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY stock DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY colonna DESC"],
                explanation: "DESC inverte l'ordine.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Cronologici",
                descTemplate: "Visualizza gli ordini partendo dal più vecchio (data minore).",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine",
                brokenCode: "SELECT * FROM ordini ORDER data_ordine",
                debugHint: "Manca la parola chiave BY dopo ORDER.",
                hints: ["Le date ordinate ASC partono dal passato verso il futuro"],
                explanation: "Ordinare date è essenziale per analisi temporali.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Utenti A-Z",
                descTemplate: "Ordina gli utenti alfabeticamente per nome dalla A alla Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY nome A SC",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY nome ASC"],
                explanation: "Ordinamento alfabetico crescente.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Utenti Z-A",
                descTemplate: "Ordina gli utenti alfabeticamente per nome dalla Z alla A.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome DESC",
                brokenCode: "SELECT * FROM utenti ORDER BY nome DSC",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY nome DESC"],
                explanation: "Ordinamento alfabetico decrescente.",
                replacements: {}
            },
            {
                titleTemplate: "Email Utenti A-Z",
                descTemplate: "Ordina gli utenti per email in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY email ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY email AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY email ASC"],
                explanation: "Ordinamento su colonna email.",
                replacements: {}
            },
            {
                titleTemplate: "Paesi Utenti A-Z",
                descTemplate: "Ordina gli utenti per paese in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY country ASC",
                debugHint: "Controlla il nome della colonna paese.",
                hints: ["Usa ORDER BY paese ASC"],
                explanation: "Ordinamento per paese.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Prodotti A-Z",
                descTemplate: "Ordina i prodotti per nome in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY nome ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY name ASC",
                debugHint: "Controlla il nome della colonna nome.",
                hints: ["Usa ORDER BY nome ASC"],
                explanation: "Ordinamento prodotti per nome.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Prodotti Z-A",
                descTemplate: "Ordina i prodotti per nome in ordine alfabetico decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY nome DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY name DESC",
                debugHint: "Controlla il nome della colonna nome.",
                hints: ["Usa ORDER BY nome DESC"],
                explanation: "Ordinamento decrescente per nome.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Decrescente",
                descTemplate: "Ordina i prodotti dal più costoso al più economico.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY price DESC",
                debugHint: "Controlla il nome della colonna prezzo.",
                hints: ["Usa ORDER BY prezzo DESC"],
                explanation: "Ordinamento decrescente per prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Crescente",
                descTemplate: "Ordina i prodotti per stock dal più basso al più alto.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY stock ASCC",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY stock ASC"],
                explanation: "Ordinamento crescente per stock.",
                replacements: {}
            },
            {
                titleTemplate: "ID Utenti Crescente",
                descTemplate: "Ordina gli utenti per ID in ordine crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY id ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY id A_SC",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY id ASC"],
                explanation: "Ordinamento per ID crescente.",
                replacements: {}
            },
            {
                titleTemplate: "ID Utenti Decrescente",
                descTemplate: "Ordina gli utenti per ID in ordine decrescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY id DESC",
                brokenCode: "SELECT * FROM utenti ORDER BY id DE SC",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY id DESC"],
                explanation: "Ordinamento per ID decrescente.",
                replacements: {}
            },
            {
                titleTemplate: "ID Prodotti Crescente",
                descTemplate: "Ordina i prodotti per ID in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY id ASC"],
                explanation: "Ordinamento prodotti per ID.",
                replacements: {}
            },
            {
                titleTemplate: "ID Prodotti Decrescente",
                descTemplate: "Ordina i prodotti per ID in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY id DESC"],
                explanation: "Ordinamento decrescente per ID.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria ID Crescente",
                descTemplate: "Ordina i prodotti per categoria_id in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY categoria_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY categoria_id ASC"],
                explanation: "Ordinamento per categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria ID Decrescente",
                descTemplate: "Ordina i prodotti per categoria_id in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY categoria_id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY categoria_id DESC"],
                explanation: "Ordinamento decrescente per categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitore ID Crescente",
                descTemplate: "Ordina i prodotti per fornitore_id in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY fornitore_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY fornitore_id ASC"],
                explanation: "Ordinamento per fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitore ID Decrescente",
                descTemplate: "Ordina i prodotti per fornitore_id in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY fornitore_id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY fornitore_id DESC"],
                explanation: "Ordinamento decrescente per fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Data Decrescente",
                descTemplate: "Ordina gli ordini dalla data più recente alla più vecchia.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC",
                brokenCode: "SELECT * FROM ordini ORDER BY data_ordine DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY data_ordine DESC"],
                explanation: "Ordinamento decrescente per data.",
                replacements: {}
            },
            {
                titleTemplate: "Quantità Ordine Crescente",
                descTemplate: "Ordina gli ordini per quantità dal più basso al più alto.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita ASC",
                brokenCode: "SELECT * FROM ordini ORDER BY quantita AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY quantita ASC"],
                explanation: "Ordinamento per quantità crescente.",
                replacements: {}
            },
            {
                titleTemplate: "Quantità Ordine Decrescente",
                descTemplate: "Ordina gli ordini per quantità dal più alto al più basso.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita DESC",
                brokenCode: "SELECT * FROM ordini ORDER BY quantita DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY quantita DESC"],
                explanation: "Ordinamento per quantità decrescente.",
                replacements: {}
            },
            {
                titleTemplate: "ID Ordine Crescente",
                descTemplate: "Ordina gli ordini per ID in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY id ASC",
                brokenCode: "SELECT * FROM ordini ORDER BY id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY id ASC"],
                explanation: "Ordinamento ordini per ID.",
                replacements: {}
            },
            {
                titleTemplate: "ID Ordine Decrescente",
                descTemplate: "Ordina gli ordini per ID in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY id DESC",
                brokenCode: "SELECT * FROM ordini ORDER BY id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY id DESC"],
                explanation: "Ordinamento decrescente per ID ordine.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Categorie A-Z",
                descTemplate: "Ordina le categorie per nome in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM categorie ORDER BY nome ASC",
                hints: ["Usa ORDER BY nome ASC"],
                explanation: "Ordinamento categorie per nome.",
                replacements: {}
            },
            {
                titleTemplate: "Aziende Fornitori A-Z",
                descTemplate: "Ordina i fornitori per nome azienda in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY azienda ASC",
                hints: ["Usa ORDER BY azienda ASC"],
                explanation: "Ordinamento fornitori per azienda.",
                replacements: {}
            },
            {
                titleTemplate: "Nazioni Fornitori A-Z",
                descTemplate: "Ordina i fornitori per nazione in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY nazione ASC",
                hints: ["Usa ORDER BY nazione ASC"],
                explanation: "Ordinamento fornitori per nazione.",
                replacements: {}
            },
            {
                titleTemplate: "Corrieri A-Z",
                descTemplate: "Ordina le spedizioni per corriere in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY corriere ASC",
                hints: ["Usa ORDER BY corriere ASC"],
                explanation: "Ordinamento spedizioni per corriere.",
                replacements: {}
            },
            {
                titleTemplate: "Date Spedizione Crescente",
                descTemplate: "Ordina le spedizioni per data dalla più vecchia alla più recente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY data_spedizione ASC",
                hints: ["Usa ORDER BY data_spedizione ASC"],
                explanation: "Ordinamento spedizioni per data.",
                replacements: {}
            },
            {
                titleTemplate: "Voti Recensioni Crescente",
                descTemplate: "Ordina le recensioni per voto dal più basso al più alto.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto ASC",
                hints: ["Usa ORDER BY voto ASC"],
                explanation: "Ordinamento recensioni per voto crescente.",
                replacements: {}
            },
            // NEW EXERCISES FOR SORTING EASY
            {
                titleTemplate: "Ordina per ID",
                descTemplate: "Esegui una query sulla tabella {table} ordinando i risultati per ID in ordine crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id ASC",
                hints: ["Usa la clausola per l'ordinamento specificando la colonna e la direzione."],
                explanation: "Ordinamento standard.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Ordina per Nome",
                descTemplate: "Ordina la tabella {table} per nome crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY nome ASC",
                hints: ["ORDER BY nome"],
                explanation: "Ordinamento alfabetico.",
                replacements: { table: ['utenti', 'prodotti', 'categorie'] }
            },
            {
                titleTemplate: "Ordina per Data",
                descTemplate: "Ordina la tabella {table} per data crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY {col} ASC",
                hints: ["ORDER BY data..."],
                explanation: "Ordinamento temporale.",
                replacements: { table: ['ordini', 'spedizioni'], col: ['data_ordine', 'data_spedizione'] }
            },
            {
                titleTemplate: "Ordina per Prezzo",
                descTemplate: "Ordina i prodotti per prezzo crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC",
                hints: ["ORDER BY prezzo"],
                explanation: "Ordinamento economico.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Stock",
                descTemplate: "Ordina i prodotti per stock crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock ASC",
                hints: ["ORDER BY stock"],
                explanation: "Ordinamento quantità.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Voto",
                descTemplate: "Ordina le recensioni per voto crescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto ASC",
                hints: ["ORDER BY voto"],
                explanation: "Ordinamento valutazione.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Quantità",
                descTemplate: "Ordina gli ordini per quantità crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita ASC",
                hints: ["ORDER BY quantita"],
                explanation: "Ordinamento volume.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Paese",
                descTemplate: "Ordina gli utenti per paese crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC",
                hints: ["ORDER BY paese"],
                explanation: "Ordinamento geografico.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Email",
                descTemplate: "Ordina gli utenti per email crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY email ASC",
                hints: ["ORDER BY email"],
                explanation: "Ordinamento contatti.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Corriere",
                descTemplate: "Ordina le spedizioni per corriere crescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY corriere ASC",
                hints: ["ORDER BY corriere"],
                explanation: "Ordinamento logistico.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Azienda",
                descTemplate: "Ordina i fornitori per azienda crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY azienda ASC",
                hints: ["ORDER BY azienda"],
                explanation: "Ordinamento fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Nazione",
                descTemplate: "Ordina i fornitori per nazione crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY nazione ASC",
                hints: ["ORDER BY nazione"],
                explanation: "Ordinamento geografico fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Categoria",
                descTemplate: "Ordina i prodotti per categoria_id crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC",
                hints: ["ORDER BY categoria_id"],
                explanation: "Ordinamento categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Fornitore",
                descTemplate: "Ordina i prodotti per fornitore_id crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC",
                hints: ["ORDER BY fornitore_id"],
                explanation: "Ordinamento fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Utente",
                descTemplate: "Ordina gli ordini per utente_id crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY utente_id ASC",
                hints: ["ORDER BY utente_id"],
                explanation: "Ordinamento utente.",
                replacements: {}
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Top {limit} Prodotti",
                descTemplate: "Trova i {limit} prodotti più costosi del catalogo.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT {limit}",
                hints: ["Combina ORDER BY DESC con LIMIT"],
                explanation: "LIMIT taglia il risultato dopo N righe.",
                replacements: { limit: [3, 5, 7, 10, 15, 20] }
            },
            {
                titleTemplate: "Paginazione (Offset)",
                descTemplate: "Visualizza 5 prodotti dalla tabella 'prodotti', saltando i primi {skip}, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET {skip}",
                hints: ["Usa LIMIT x OFFSET y combinato con ORDER BY."],
                explanation: "Fondamentale per la paginazione nei siti web.",
                replacements: { skip: [5, 10, 15, 20] }
            },
            {
                titleTemplate: "Utenti Recenti",
                descTemplate: "Mostra gli ultimi {limit} utenti iscritti (assumendo ID incrementale come proxy temporale).",
                queryTemplate: "SELECT * FROM utenti ORDER BY id DESC LIMIT {limit}",
                hints: ["ID più alto = iscrizione più recente"],
                explanation: "Spesso le chiavi primarie sono sequenziali.",
                replacements: { limit: [5, 7, 10, 15, 20] }
            },
            {
                titleTemplate: "Top {limit} Prezzi",
                descTemplate: "Mostra i {limit} prodotti più costosi ordinati per prezzo decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT {limit}",
                hints: ["ORDER BY prezzo DESC LIMIT {limit}"],
                explanation: "LIMIT per top N risultati.",
                replacements: { limit: [3, 5, 10] }
            },
            {
                titleTemplate: "Prodotti Economici Top {limit}",
                descTemplate: "Mostra i {limit} prodotti più economici ordinati per prezzo crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC LIMIT {limit}",
                hints: ["ORDER BY prezzo ASC LIMIT {limit}"],
                explanation: "LIMIT per bottom N risultati.",
                replacements: { limit: [3, 5, 10] }
            },
            {
                titleTemplate: "Top Stock {limit}",
                descTemplate: "Mostra i {limit} prodotti con stock più alto.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock DESC LIMIT {limit}",
                hints: ["ORDER BY stock DESC LIMIT {limit}"],
                explanation: "LIMIT per prodotti ben forniti.",
                replacements: { limit: [3, 5, 10] }
            },
            {
                titleTemplate: "Primi {limit} Utenti",
                descTemplate: "Mostra i primi {limit} utenti ordinati per nome A-Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC LIMIT {limit}",
                hints: ["ORDER BY nome ASC LIMIT {limit}"],
                explanation: "LIMIT per primi N risultati.",
                replacements: { limit: [5, 10, 15] }
            },
            {
                titleTemplate: "Ultimi {limit} Ordini",
                descTemplate: "Mostra gli ultimi {limit} ordini ordinati per data decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC LIMIT {limit}",
                hints: ["ORDER BY data_ordine DESC LIMIT {limit}"],
                explanation: "LIMIT per ordini recenti.",
                replacements: { limit: [5, 10, 15] }
            },
            {
                titleTemplate: "Paginazione Pagina 2",
                descTemplate: "Visualizza 10 prodotti saltando i primi 10, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 10",
                hints: ["LIMIT 10 OFFSET 10"],
                explanation: "OFFSET per saltare righe.",
                replacements: {}
            },
            {
                titleTemplate: "Paginazione Pagina 3",
                descTemplate: "Visualizza 10 prodotti saltando i primi 20, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 20",
                hints: ["LIMIT 10 OFFSET 20"],
                explanation: "OFFSET multiplo per pagine successive.",
                replacements: {}
            },
            {
                titleTemplate: "Paginazione Utenti",
                descTemplate: "Visualizza 5 utenti saltando i primi {skip}, ordinati per ID.",
                queryTemplate: "SELECT * FROM utenti ORDER BY id ASC LIMIT 5 OFFSET {skip}",
                hints: ["LIMIT 5 OFFSET {skip}"],
                explanation: "Paginazione per utenti.",
                replacements: { skip: [5, 10, 15] }
            },
            {
                titleTemplate: "Paginazione Ordini",
                descTemplate: "Visualizza 10 ordini saltando i primi {skip}, ordinati per ID.",
                queryTemplate: "SELECT * FROM ordini ORDER BY id ASC LIMIT 10 OFFSET {skip}",
                hints: ["LIMIT 10 OFFSET {skip}"],
                explanation: "Paginazione per ordini.",
                replacements: { skip: [10, 20, 30] }
            },
            {
                titleTemplate: "Top Voti {limit}",
                descTemplate: "Mostra le {limit} recensioni con voto più alto.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto DESC LIMIT {limit}",
                hints: ["ORDER BY voto DESC LIMIT {limit}"],
                explanation: "LIMIT per recensioni migliori.",
                replacements: { limit: [5, 10, 15] }
            },
            {
                titleTemplate: "Ordini Recenti {limit}",
                descTemplate: "Mostra gli ultimi {limit} ordini ordinati per data decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC LIMIT {limit}",
                hints: ["ORDER BY data_ordine DESC LIMIT {limit}"],
                explanation: "LIMIT per ordini recenti.",
                replacements: { limit: [5, 10, 15] }
            },
            {
                titleTemplate: "Spedizioni Recenti {limit}",
                descTemplate: "Mostra le ultime {limit} spedizioni ordinate per data decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY data_spedizione DESC LIMIT {limit}",
                hints: ["ORDER BY data_spedizione DESC LIMIT {limit}"],
                explanation: "LIMIT per spedizioni recenti.",
                replacements: { limit: [5, 10, 15] }
            },
            {
                titleTemplate: "LIMIT con ORDER BY Prezzo",
                descTemplate: "Mostra i primi 5 prodotti ordinati per prezzo crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC LIMIT 5",
                hints: ["ORDER BY prezzo ASC LIMIT 5"],
                explanation: "LIMIT combinato con ORDER BY.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT con ORDER BY Stock",
                descTemplate: "Mostra i primi 7 prodotti ordinati per stock decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock DESC LIMIT 7",
                hints: ["ORDER BY stock DESC LIMIT 7"],
                explanation: "LIMIT con ordinamento stock.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT con ORDER BY Nome",
                descTemplate: "Mostra i primi 10 utenti ordinati per nome A-Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC LIMIT 10",
                hints: ["ORDER BY nome ASC LIMIT 10"],
                explanation: "LIMIT con ordinamento nome.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT con ORDER BY Data",
                descTemplate: "Mostra i primi 8 ordini ordinati per data crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine ASC LIMIT 8",
                hints: ["ORDER BY data_ordine ASC LIMIT 8"],
                explanation: "LIMIT con ordinamento data.",
                replacements: {}
            },
            {
                titleTemplate: "OFFSET Piccolo",
                descTemplate: "Visualizza 5 prodotti saltando i primi 3, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET 3",
                hints: ["LIMIT 5 OFFSET 3"],
                explanation: "OFFSET piccolo per iniziare paginazione.",
                replacements: {}
            },
            {
                titleTemplate: "OFFSET Medio",
                descTemplate: "Visualizza 10 prodotti saltando i primi 15, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 15",
                hints: ["LIMIT 10 OFFSET 15"],
                explanation: "OFFSET medio per pagine centrali.",
                replacements: {}
            },
            {
                titleTemplate: "OFFSET Grande",
                descTemplate: "Visualizza 5 prodotti saltando i primi 25, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET 25",
                hints: ["LIMIT 5 OFFSET 25"],
                explanation: "OFFSET grande per pagine avanzate.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT Utenti con Nome",
                descTemplate: "Mostra i primi 12 utenti ordinati per nome A-Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC LIMIT 12",
                hints: ["ORDER BY nome ASC LIMIT 12"],
                explanation: "LIMIT con ordinamento alfabetico.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT Prodotti con Prezzo",
                descTemplate: "Mostra i primi 6 prodotti ordinati per prezzo decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT 6",
                hints: ["ORDER BY prezzo DESC LIMIT 6"],
                explanation: "LIMIT con ordinamento prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT Ordini con Quantità",
                descTemplate: "Mostra i primi 9 ordini ordinati per quantità decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita DESC LIMIT 9",
                hints: ["ORDER BY quantita DESC LIMIT 9"],
                explanation: "LIMIT con ordinamento quantità.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT Recensioni con Voto",
                descTemplate: "Mostra le prime 11 recensioni ordinate per voto decrescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto DESC LIMIT 11",
                hints: ["ORDER BY voto DESC LIMIT 11"],
                explanation: "LIMIT con ordinamento voto.",
                replacements: {}
            },
            {
                titleTemplate: "Paginazione Completa",
                descTemplate: "Visualizza 8 prodotti saltando i primi 16, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 8 OFFSET 16",
                hints: ["LIMIT 8 OFFSET 16"],
                explanation: "Paginazione completa con LIMIT e OFFSET.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT con Data Ordine",
                descTemplate: "Mostra i primi 4 ordini ordinati per data crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine ASC LIMIT 4",
                hints: ["ORDER BY data_ordine ASC LIMIT 4"],
                explanation: "LIMIT con ordinamento data ordine.",
                replacements: {}
            },
            {
                titleTemplate: "LIMIT con Data Spedizione",
                descTemplate: "Mostra le prime 13 spedizioni ordinate per data decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY data_spedizione DESC LIMIT 13",
                hints: ["ORDER BY data_spedizione DESC LIMIT 13"],
                explanation: "LIMIT con ordinamento data spedizione.",
                replacements: {}
            },
            {
                titleTemplate: "OFFSET Variabile",
                descTemplate: "Visualizza 7 prodotti saltando i primi {skip}, ordinati per ID.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 7 OFFSET {skip}",
                hints: ["LIMIT 7 OFFSET {skip}"],
                explanation: "OFFSET variabile per paginazione dinamica.",
                replacements: { skip: [7, 14, 21, 28] }
            },
            // NEW EXERCISES FOR SORTING MEDIUM
            {
                titleTemplate: "Top 3 {table}",
                descTemplate: "Mostra i primi 3 record di {table} ordinati per ID.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id ASC LIMIT 3",
                hints: ["ORDER BY id LIMIT 3"],
                explanation: "Top N generico.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Ultimi 3 {table}",
                descTemplate: "Mostra gli ultimi 3 record di {table} ordinati per ID decrescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id DESC LIMIT 3",
                hints: ["ORDER BY id DESC LIMIT 3"],
                explanation: "Bottom N generico.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Paginazione {table}",
                descTemplate: "Visualizza 5 record di {table} saltando i primi 5, ordinati per ID.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id ASC LIMIT 5 OFFSET 5",
                hints: ["LIMIT 5 OFFSET 5"],
                explanation: "Paginazione generica.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Top Prezzi Categoria {cat}",
                descTemplate: "Mostra i 3 prodotti più costosi della categoria {cat}.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = {cat} ORDER BY prezzo DESC LIMIT 3",
                hints: ["WHERE ... ORDER BY ... LIMIT ..."],
                explanation: "Top N filtrato.",
                replacements: { cat: [1, 2, 3] }
            },
            {
                titleTemplate: "Ordini Recenti Utente {uid}",
                descTemplate: "Mostra gli ultimi 3 ordini dell'utente {uid}.",
                queryTemplate: "SELECT * FROM ordini WHERE utente_id = {uid} ORDER BY data_ordine DESC LIMIT 3",
                hints: ["WHERE utente_id ... ORDER BY ... LIMIT"],
                explanation: "Cronologia utente.",
                replacements: { uid: [1, 2, 3] }
            },
            {
                titleTemplate: "Spedizioni Recenti Corriere {corr}",
                descTemplate: "Mostra le ultime 5 spedizioni del corriere {corr}.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = '{corr}' ORDER BY data_spedizione DESC LIMIT 5",
                hints: ["WHERE corriere ... ORDER BY ... LIMIT"],
                explanation: "Cronologia corriere.",
                replacements: { corr: ['DHL', 'UPS'] }
            },
            {
                titleTemplate: "Recensioni Migliori Prodotto {pid}",
                descTemplate: "Mostra le 3 recensioni migliori per il prodotto {pid}.",
                queryTemplate: "SELECT * FROM recensioni WHERE prodotto_id = {pid} ORDER BY voto DESC LIMIT 3",
                hints: ["WHERE prodotto_id ... ORDER BY voto DESC LIMIT"],
                explanation: "Top recensioni prodotto.",
                replacements: { pid: [1, 2] }
            },
            {
                titleTemplate: "Recensioni Peggiori Prodotto {pid}",
                descTemplate: "Mostra le 3 recensioni peggiori per il prodotto {pid}.",
                queryTemplate: "SELECT * FROM recensioni WHERE prodotto_id = {pid} ORDER BY voto ASC LIMIT 3",
                hints: ["WHERE prodotto_id ... ORDER BY voto ASC LIMIT"],
                explanation: "Bottom recensioni prodotto.",
                replacements: { pid: [1, 2] }
            },
            {
                titleTemplate: "Prodotti Stock Basso",
                descTemplate: "Mostra i 5 prodotti con meno stock (ma > 0).",
                queryTemplate: "SELECT * FROM prodotti WHERE stock > 0 ORDER BY stock ASC LIMIT 5",
                hints: ["WHERE stock > 0 ORDER BY stock ASC LIMIT 5"],
                explanation: "Priorità riordino.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Premium Recenti",
                descTemplate: "Mostra gli ultimi 5 utenti Premium iscritti (per ID).",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE ORDER BY id DESC LIMIT 5",
                hints: ["WHERE premium = TRUE ORDER BY id DESC LIMIT 5"],
                explanation: "Nuovi VIP.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Grandi Recenti",
                descTemplate: "Mostra gli ultimi 3 ordini con quantità > 5.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita > 5 ORDER BY data_ordine DESC LIMIT 3",
                hints: ["WHERE quantita > 5 ORDER BY ... LIMIT"],
                explanation: "Grandi ordini recenti.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Costosi Categoria 1",
                descTemplate: "Top 3 prodotti costosi categoria 1.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = 1 ORDER BY prezzo DESC LIMIT 3",
                hints: ["WHERE categoria_id = 1 ..."],
                explanation: "Top categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Economici Categoria 2",
                descTemplate: "Top 3 prodotti economici categoria 2.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = 2 ORDER BY prezzo ASC LIMIT 3",
                hints: ["WHERE categoria_id = 2 ..."],
                explanation: "Budget categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitori Italiani A-Z",
                descTemplate: "Primi 5 fornitori italiani in ordine alfabetico.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione = 'Italia' ORDER BY azienda ASC LIMIT 5",
                hints: ["WHERE nazione = 'Italia' ..."],
                explanation: "Elenco filtrato ordinato.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitori Esteri A-Z",
                descTemplate: "Primi 5 fornitori non italiani in ordine alfabetico.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione <> 'Italia' ORDER BY azienda ASC LIMIT 5",
                hints: ["WHERE nazione <> 'Italia' ..."],
                explanation: "Elenco estero ordinato.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Ordinamento Multiplo (Paese/Nome)",
                descTemplate: "Ordina gli utenti per Paese (A-Z) e, a parità di paese, per Nome (A-Z).",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC, nome ASC",
                hints: ["Elenca le colonne separate da virgola dopo ORDER BY"],
                explanation: "L'ordinamento secondario si applica solo a parità del primario.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Misto (Cat/Prezzo)",
                descTemplate: "Ordina i prodotti per ID Categoria (Crescente), ma all'interno della categoria metti i più costosi in cima (Prezzo Decrescente).",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC, prezzo DESC",
                hints: ["ORDER BY col1 ASC, col2 DESC"],
                explanation: "Puoi mixare ASC e DESC su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato",
                descTemplate: "Ordina i prodotti in base al valore totale dello stock (prezzo * stock) in ordine decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY (prezzo * stock) DESC",
                hints: ["Puoi ordinare in base a un'espressione matematica"],
                explanation: "Non serve creare la colonna nella SELECT per ordinarci sopra, ma aiuta a visualizzare.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Triplo (Paese/Premium/Nome)",
                descTemplate: "Ordina gli utenti per paese A-Z, poi per premium (FALSE prima, TRUE dopo), poi per nome A-Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC, premium ASC, nome ASC",
                hints: ["Tre colonne separate da virgole", "ORDER BY paese ASC, premium ASC, nome ASC"],
                explanation: "Ordinamento su tre colonne.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Categoria/Stock/Prezzo",
                descTemplate: "Ordina i prodotti per categoria crescente, poi stock decrescente, poi prezzo crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC, stock DESC, prezzo ASC",
                hints: ["Tre colonne con ordinamenti diversi", "ORDER BY categoria_id ASC, stock DESC, prezzo ASC"],
                explanation: "Ordinamento multiplo con direzioni diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Data/Quantità",
                descTemplate: "Ordina gli ordini per data crescente, poi per quantità decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine ASC, quantita DESC",
                hints: ["Due colonne con ordinamenti diversi", "ORDER BY data_ordine ASC, quantita DESC"],
                explanation: "Ordinamento doppio con direzioni diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Fornitore/Categoria/Prezzo",
                descTemplate: "Ordina i prodotti per fornitore_id crescente, categoria_id crescente, prezzo decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC",
                hints: ["Tre colonne", "ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC"],
                explanation: "Ordinamento triplo con mix ASC/DESC.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Valore",
                descTemplate: "Ordina i prodotti per valore inventario (prezzo * stock) decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY (prezzo * stock) DESC",
                hints: ["Calcola prezzo * stock", "ORDER BY (prezzo * stock) DESC"],
                explanation: "Ordinamento su espressione calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Sconto",
                descTemplate: "Ordina i prodotti per prezzo scontato (prezzo * 0.9) crescente.",
                queryTemplate: "SELECT *, (prezzo * 0.9) as prezzo_scontato FROM prodotti ORDER BY (prezzo * 0.9) ASC",
                hints: ["Calcola prezzo * 0.9", "ORDER BY (prezzo * 0.9) ASC"],
                explanation: "Ordinamento su calcolo sconto.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Margine",
                descTemplate: "Ordina i prodotti per margine (prezzo - 10) decrescente.",
                queryTemplate: "SELECT *, (prezzo - 10) as margine FROM prodotti ORDER BY (prezzo - 10) DESC",
                hints: ["Calcola prezzo - 10", "ORDER BY (prezzo - 10) DESC"],
                explanation: "Ordinamento su calcolo margine.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Multiplo con Calcolo",
                descTemplate: "Ordina i prodotti per categoria crescente, poi per valore (prezzo * stock) decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, (prezzo * stock) DESC",
                hints: ["Combina colonna normale con calcolo", "ORDER BY categoria_id ASC, (prezzo * stock) DESC"],
                explanation: "Ordinamento multiplo con calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Nome/Email",
                descTemplate: "Ordina gli utenti per nome A-Z, poi per email A-Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC, email ASC",
                hints: ["Due colonne stringa", "ORDER BY nome ASC, email ASC"],
                explanation: "Ordinamento doppio su stringhe.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Prodotto/Categoria/Stock",
                descTemplate: "Ordina i prodotti per nome A-Z, categoria_id crescente, stock decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY nome ASC, categoria_id ASC, stock DESC",
                hints: ["Tre colonne", "ORDER BY nome ASC, categoria_id ASC, stock DESC"],
                explanation: "Ordinamento triplo con stringa e numeri.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Data/ID",
                descTemplate: "Ordina gli ordini per data decrescente, poi per ID crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC, id ASC",
                hints: ["Data e ID", "ORDER BY data_ordine DESC, id ASC"],
                explanation: "Ordinamento doppio data/ID.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Voto/Prodotto",
                descTemplate: "Ordina le recensioni per voto decrescente, poi per prodotto_id crescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto DESC, prodotto_id ASC",
                hints: ["Voto e prodotto", "ORDER BY voto DESC, prodotto_id ASC"],
                explanation: "Ordinamento doppio recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Corriere/Data",
                descTemplate: "Ordina le spedizioni per corriere A-Z, poi per data decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY corriere ASC, data_spedizione DESC",
                hints: ["Corriere e data", "ORDER BY corriere ASC, data_spedizione DESC"],
                explanation: "Ordinamento doppio spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Azienda/Nazione",
                descTemplate: "Ordina i fornitori per azienda A-Z, poi per nazione A-Z.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY azienda ASC, nazione ASC",
                hints: ["Due colonne stringa", "ORDER BY azienda ASC, nazione ASC"],
                explanation: "Ordinamento doppio fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Categoria/Nome",
                descTemplate: "Ordina le categorie per nome A-Z, poi per descrizione A-Z.",
                queryTemplate: "SELECT * FROM categorie ORDER BY nome ASC, descrizione ASC",
                hints: ["Nome e descrizione", "ORDER BY nome ASC, descrizione ASC"],
                explanation: "Ordinamento doppio categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Premium/Paese/Nome",
                descTemplate: "Ordina gli utenti per premium (FALSE prima), paese A-Z, nome A-Z.",
                queryTemplate: "SELECT * FROM utenti ORDER BY premium ASC, paese ASC, nome ASC",
                hints: ["Tre colonne", "ORDER BY premium ASC, paese ASC, nome ASC"],
                explanation: "Ordinamento triplo utenti.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Complesso",
                descTemplate: "Ordina i prodotti per (prezzo + stock) decrescente.",
                queryTemplate: "SELECT *, (prezzo + stock) as somma FROM prodotti ORDER BY (prezzo + stock) DESC",
                hints: ["Calcola prezzo + stock", "ORDER BY (prezzo + stock) DESC"],
                explanation: "Ordinamento su somma calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Categoria/Valore",
                descTemplate: "Ordina i prodotti per categoria crescente, poi per valore (prezzo * stock) decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, (prezzo * stock) DESC",
                hints: ["Categoria e calcolo", "ORDER BY categoria_id ASC, (prezzo * stock) DESC"],
                explanation: "Ordinamento categoria con calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Fornitore/Prezzo",
                descTemplate: "Ordina i prodotti per fornitore_id crescente, prezzo decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC, prezzo DESC",
                hints: ["Fornitore e prezzo", "ORDER BY fornitore_id ASC, prezzo DESC"],
                explanation: "Ordinamento fornitore/prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Data/Utente",
                descTemplate: "Ordina gli ordini per data decrescente, utente_id crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC, utente_id ASC",
                hints: ["Data e utente", "ORDER BY data_ordine DESC, utente_id ASC"],
                explanation: "Ordinamento data/utente.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Prodotto/Utente/Voto",
                descTemplate: "Ordina le recensioni per prodotto_id crescente, utente_id crescente, voto decrescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY prodotto_id ASC, utente_id ASC, voto DESC",
                hints: ["Tre colonne", "ORDER BY prodotto_id ASC, utente_id ASC, voto DESC"],
                explanation: "Ordinamento triplo recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Ordine/Data",
                descTemplate: "Ordina le spedizioni per ordine_id crescente, data decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY ordine_id ASC, data_spedizione DESC",
                hints: ["Ordine e data", "ORDER BY ordine_id ASC, data_spedizione DESC"],
                explanation: "Ordinamento ordine/data.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato con Alias",
                descTemplate: "Ordina i prodotti per valore calcolato (prezzo * 1.1) decrescente usando alias.",
                queryTemplate: "SELECT *, (prezzo * 1.1) as prezzo_iva FROM prodotti ORDER BY prezzo_iva DESC",
                hints: ["Usa alias nell'ORDER BY", "ORDER BY prezzo_iva DESC"],
                explanation: "Ordinamento usando alias di colonna calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Multiplo con Alias",
                descTemplate: "Ordina i prodotti per categoria crescente, poi per valore (prezzo * stock) usando alias.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, valore DESC",
                hints: ["Usa alias nell'ORDER BY", "ORDER BY categoria_id ASC, valore DESC"],
                explanation: "Ordinamento multiplo con alias.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Quattro Colonne",
                descTemplate: "Ordina i prodotti per fornitore crescente, categoria crescente, prezzo decrescente, stock crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC, stock ASC",
                hints: ["Quattro colonne", "ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC, stock ASC"],
                explanation: "Ordinamento su quattro colonne.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Complesso Finale",
                descTemplate: "Ordina i prodotti per categoria crescente, valore (prezzo * stock) decrescente, nome A-Z.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, valore DESC, nome ASC",
                hints: ["Tre colonne con calcolo", "ORDER BY categoria_id ASC, valore DESC, nome ASC"],
                explanation: "Ordinamento complesso con calcolo e stringa.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Finale Avanzato",
                descTemplate: "Ordina i prodotti per fornitore crescente, categoria crescente, valore (prezzo * stock) decrescente, nome A-Z.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY fornitore_id ASC, categoria_id ASC, valore DESC, nome ASC",
                hints: ["Quattro colonne con calcolo", "ORDER BY fornitore_id ASC, categoria_id ASC, valore DESC, nome ASC"],
                explanation: "Ordinamento finale avanzato con quattro colonne e calcolo.",
                replacements: {}
            }
        ]
    },
    [TopicId.Functions]: {
        [Difficulty.Easy]: [
            {
                titleTemplate: "Nomi Maiuscoli",
                descTemplate: "Il sistema richiede i nomi utente tutti in maiuscolo per la stampa badge.",
                queryTemplate: "SELECT UPPER(nome) FROM utenti",
                brokenCode: "SELECT UPPER(nome FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa UPPER()"],
                explanation: "Converte stringhe in UPPERCASE.",
                replacements: {}
            },
            {
                titleTemplate: "Arrotondamento Prezzi",
                descTemplate: "Visualizza i prezzi arrotondati all'intero più vicino.",
                queryTemplate: "SELECT ROUND(prezzo, 0) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo 0) FROM prodotti",
                debugHint: "Gli argomenti della funzione devono essere separati da una virgola.",
                hints: ["Usa ROUND(col, 0)"],
                explanation: "Arrotondamento matematico standard.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Nomi",
                descTemplate: "Calcola quanti caratteri è lungo il nome di ogni prodotto.",
                queryTemplate: "SELECT nome, LENGTH(nome) FROM prodotti",
                brokenCode: "SELECT nome, LENGTH(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() o LEN()"],
                explanation: "Utile per validazione dati.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Minuscoli",
                descTemplate: "Converte tutti i nomi utente in minuscolo per uniformità.",
                queryTemplate: "SELECT LOWER(nome) FROM utenti",
                brokenCode: "SELECT LOW(nome) FROM utenti",
                debugHint: "Il nome della funzione per convertire in minuscolo è LOWER.",
                hints: ["Usa LOWER()"],
                explanation: "Converte stringhe in lowercase.",
                replacements: {}
            },
            {
                titleTemplate: "Email Maiuscole",
                descTemplate: "Converte tutte le email in maiuscolo.",
                queryTemplate: "SELECT UPPER(email) FROM utenti",
                brokenCode: "SELECT UP(email) FROM utenti",
                debugHint: "Il nome della funzione per convertire in maiuscolo è UPPER.",
                hints: ["Usa UPPER() su email"],
                explanation: "UPPER() su colonna email.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Prodotti Maiuscoli",
                descTemplate: "Converte tutti i nomi prodotti in maiuscolo.",
                queryTemplate: "SELECT UPPER(nome) FROM prodotti",
                brokenCode: "SELECT UPPER nome FROM prodotti",
                debugHint: "Le funzioni richiedono le parentesi attorno agli argomenti.",
                hints: ["Usa UPPER() su nome prodotto"],
                explanation: "UPPER() su nomi prodotti.",
                replacements: {}
            },
            {
                titleTemplate: "Paesi Maiuscoli",
                descTemplate: "Converte tutti i paesi in maiuscolo.",
                queryTemplate: "SELECT UPPER(paese) FROM utenti",
                brokenCode: "SELECT UPPER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura.",
                hints: ["Usa UPPER() su paese"],
                explanation: "UPPER() su colonna paese.",
                replacements: {}
            },
            {
                titleTemplate: "Aziende Maiuscole",
                descTemplate: "Converte tutti i nomi azienda in maiuscolo.",
                queryTemplate: "SELECT UPPER(azienda) FROM fornitori",
                brokenCode: "SELECT UPPER(azienda)) FROM fornitori",
                debugHint: "C'è una parentesi di troppo.",
                hints: ["Usa UPPER() su azienda"],
                explanation: "UPPER() su aziende.",
                replacements: {}
            },
            {
                titleTemplate: "Corrieri Maiuscoli",
                descTemplate: "Converte tutti i nomi corriere in maiuscolo.",
                queryTemplate: "SELECT UPPER(corriere) FROM spedizioni",
                brokenCode: "SELECT UPPER corriere) FROM spedizioni",
                debugHint: "Manca la parentesi di apertura.",
                hints: ["Usa UPPER() su corriere"],
                explanation: "UPPER() su corrieri.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato 1 Decimale",
                descTemplate: "Visualizza i prezzi arrotondati a 1 decimale.",
                queryTemplate: "SELECT ROUND(prezzo, 1) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo; 1) FROM prodotti",
                debugHint: "Usa la virgola per separare gli argomenti.",
                hints: ["Usa ROUND(prezzo, 1)"],
                explanation: "Arrotondamento a 1 decimale.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato 2 Decimali",
                descTemplate: "Visualizza i prezzi arrotondati a 2 decimali.",
                queryTemplate: "SELECT ROUND(prezzo, 2) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo 2) FROM prodotti",
                debugHint: "Manca la virgola tra gli argomenti.",
                hints: ["Usa ROUND(prezzo, 2)"],
                explanation: "Arrotondamento a 2 decimali.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Arrotondato",
                descTemplate: "Arrotonda lo stock all'intero più vicino (anche se già intero).",
                queryTemplate: "SELECT ROUND(stock, 0) FROM prodotti",
                brokenCode: "SELECT ROUND(stock, 0 FROM prodotti",
                debugHint: "Manca la parentesi di chiusura.",
                hints: ["Usa ROUND(stock, 0)"],
                explanation: "Arrotondamento stock.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Email",
                descTemplate: "Calcola la lunghezza di ogni email utente.",
                queryTemplate: "SELECT email, LENGTH(email) FROM utenti",
                brokenCode: "SELECT email, LENGHT(email) FROM utenti",
                debugHint: "Errore di battitura nel nome della funzione.",
                hints: ["Usa LENGTH() su email"],
                explanation: "Lunghezza colonna email.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Nomi Utenti",
                descTemplate: "Calcola quanti caratteri è lungo il nome di ogni utente.",
                queryTemplate: "SELECT nome, LENGTH(nome) FROM utenti",
                brokenCode: "SELECT nome, LENGTH(nome FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su nome utente"],
                explanation: "Lunghezza nomi utenti.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Paesi",
                descTemplate: "Calcola la lunghezza del nome di ogni paese.",
                queryTemplate: "SELECT paese, LENGTH(paese) FROM utenti",
                brokenCode: "SELECT paese, LENGTH(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su paese"],
                explanation: "Lunghezza nomi paesi.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Commenti",
                descTemplate: "Calcola la lunghezza di ogni commento nelle recensioni.",
                queryTemplate: "SELECT commento, LENGTH(commento) FROM recensioni",
                brokenCode: "SELECT commento, LENGTH(commento FROM recensioni",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su commento"],
                explanation: "Lunghezza commenti recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Codice Tracking",
                descTemplate: "Calcola la lunghezza di ogni codice tracking.",
                queryTemplate: "SELECT codice_tracking, LENGTH(codice_tracking) FROM spedizioni",
                brokenCode: "SELECT codice_tracking, LENGTH(codice_tracking FROM spedizioni",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su codice_tracking"],
                explanation: "Lunghezza codici tracking.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Aziende",
                descTemplate: "Calcola la lunghezza del nome di ogni azienda fornitore.",
                queryTemplate: "SELECT azienda, LENGTH(azienda) FROM fornitori",
                brokenCode: "SELECT azienda, LENGTH(azienda FROM fornitori",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su azienda"],
                explanation: "Lunghezza nomi aziende.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Categorie",
                descTemplate: "Calcola la lunghezza del nome di ogni categoria.",
                queryTemplate: "SELECT nome, LENGTH(nome) FROM categorie",
                brokenCode: "SELECT nome, LENGTH(nome FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su nome categoria"],
                explanation: "Lunghezza nomi categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Descrizioni",
                descTemplate: "Calcola la lunghezza della descrizione di ogni categoria.",
                queryTemplate: "SELECT descrizione, LENGTH(descrizione) FROM categorie",
                brokenCode: "SELECT descrizione, LENGTH(descrizione FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su descrizione"],
                explanation: "Lunghezza descrizioni categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo e Lunghezza Nome",
                descTemplate: "Mostra nome prodotto, prezzo arrotondato e lunghezza del nome.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0), LENGTH(nome) FROM prodotti",
                brokenCode: "SELECT nome, ROUND(prezzo, 0), LENGTH(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina ROUND e LENGTH", "SELECT nome, ROUND(prezzo, 0), LENGTH(nome)"],
                explanation: "Funzioni multiple in una query.",
                replacements: {}
            },
            {
                titleTemplate: "Nome e Lunghezza Email",
                descTemplate: "Mostra nome utente, email in maiuscolo e lunghezza email.",
                queryTemplate: "SELECT nome, UPPER(email), LENGTH(email) FROM utenti",
                brokenCode: "SELECT nome, UPPER(email), LENGTH(email FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina UPPER e LENGTH", "SELECT nome, UPPER(email), LENGTH(email)"],
                explanation: "Funzioni multiple su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo e Stock Arrotondati",
                descTemplate: "Mostra nome prodotto, prezzo arrotondato e stock arrotondato.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0), ROUND(stock, 0) FROM prodotti",
                hints: ["Usa ROUND due volte", "SELECT nome, ROUND(prezzo, 0), ROUND(stock, 0)"],
                explanation: "ROUND multiplo su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Tutto Maiuscolo",
                descTemplate: "Converte nome, email e paese in maiuscolo.",
                queryTemplate: "SELECT UPPER(nome), UPPER(email), UPPER(paese) FROM utenti",
                brokenCode: "SELECT UPPER(nome), UPPER(email), UPPER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione UPPER.",
                hints: ["Usa UPPER tre volte", "SELECT UPPER(nome), UPPER(email), UPPER(paese)"],
                explanation: "UPPER multiplo.",
                replacements: {}
            },
            {
                titleTemplate: "Tutto Minuscolo",
                descTemplate: "Converte nome, email e paese in minuscolo.",
                queryTemplate: "SELECT LOWER(nome), LOWER(email), LOWER(paese) FROM utenti",
                brokenCode: "SELECT LOWER(nome), LOWER(email), LOWER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione LOWER.",
                hints: ["Usa LOWER tre volte", "SELECT LOWER(nome), LOWER(email), LOWER(paese)"],
                explanation: "LOWER multiplo.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezze Multiple",
                descTemplate: "Calcola la lunghezza di nome, email e paese per ogni utente.",
                queryTemplate: "SELECT nome, LENGTH(nome), LENGTH(email), LENGTH(paese) FROM utenti",
                brokenCode: "SELECT nome, LENGTH(nome), LENGTH(email), LENGTH(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione LENGTH.",
                hints: ["Usa LENGTH tre volte", "SELECT nome, LENGTH(nome), LENGTH(email), LENGTH(paese)"],
                explanation: "LENGTH multiplo.",
                replacements: {}
            },
            {
                titleTemplate: "Arrotondamenti Multipli",
                descTemplate: "Arrotonda prezzo a 2 decimali e stock all'intero per ogni prodotto.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 2), ROUND(stock, 0) FROM prodotti",
                brokenCode: "SELECT nome, ROUND(prezzo, 2), ROUND(stock, 0 FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione ROUND.",
                hints: ["ROUND con precisioni diverse", "SELECT nome, ROUND(prezzo, 2), ROUND(stock, 0)"],
                explanation: "ROUND con precisioni diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Funzioni Miste",
                descTemplate: "Mostra nome prodotto in maiuscolo, prezzo arrotondato e lunghezza nome.",
                queryTemplate: "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome) FROM prodotti",
                brokenCode: "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina UPPER, ROUND e LENGTH", "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome)"],
                explanation: "Funzioni miste su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Email e Lunghezza",
                descTemplate: "Mostra email in minuscolo e la sua lunghezza.",
                queryTemplate: "SELECT LOWER(email), LENGTH(email) FROM utenti",
                brokenCode: "SELECT LOWER(email), LENGTH(email FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina LOWER e LENGTH", "SELECT LOWER(email), LENGTH(email)"],
                explanation: "LOWER combinato con LENGTH.",
                replacements: {}
            },
            {
                titleTemplate: "Nome e Prezzo Formattati",
                descTemplate: "Mostra nome prodotto in maiuscolo e prezzo arrotondato a 1 decimale.",
                queryTemplate: "SELECT UPPER(nome), ROUND(prezzo, 1) FROM prodotti",
                brokenCode: "SELECT UPPER(nome), ROUND(prezzo, 1 FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione ROUND.",
                hints: ["Combina UPPER e ROUND", "SELECT UPPER(nome), ROUND(prezzo, 1)"],
                explanation: "UPPER combinato con ROUND.",
                replacements: {}
            },
            // NEW EXERCISES FOR FUNCTIONS EASY
            {
                titleTemplate: "Lunghezza Nome Azienda",
                descTemplate: "Calcola la lunghezza del nome di ogni azienda fornitore.",
                queryTemplate: "SELECT azienda, LENGTH(azienda) FROM fornitori",
                brokenCode: "SELECT azienda, LENGTH(azienda FROM fornitori",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Usa LENGTH()"],
                explanation: "Funzione stringa base.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Nome Corriere",
                descTemplate: "Calcola la lunghezza del nome di ogni corriere.",
                queryTemplate: "SELECT corriere, LENGTH(corriere) FROM spedizioni",
                brokenCode: "SELECT corriere, LENGTH(corriere FROM spedizioni",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Usa LENGTH()"],
                explanation: "Funzione stringa base.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato (No Decimali)",
                descTemplate: "Mostra i prezzi arrotondati a 0 decimali.",
                queryTemplate: "SELECT ROUND(prezzo, 0) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo 0) FROM prodotti",
                debugHint: "Manca la virgola tra gli argomenti.",
                hints: ["ROUND(prezzo, 0)"],
                explanation: "Arrotondamento intero.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Arrotondato (1 Decimale)",
                descTemplate: "Mostra lo stock arrotondato a 1 decimale (anche se intero).",
                queryTemplate: "SELECT ROUND(stock, 1) FROM prodotti",
                hints: ["ROUND(stock, 1)"],
                explanation: "Arrotondamento decimale.",
                replacements: {}
            },
            {
                titleTemplate: "Nome Categoria Maiuscolo",
                descTemplate: "Mostra i nomi delle categorie in maiuscolo.",
                queryTemplate: "SELECT UPPER(nome) FROM categorie",
                hints: ["UPPER(nome)"],
                explanation: "Maiuscolo.",
                replacements: {}
            },
            {
                titleTemplate: "Descrizione Categoria Minuscolo",
                descTemplate: "Mostra le descrizioni delle categorie in minuscolo.",
                queryTemplate: "SELECT LOWER(descrizione) FROM categorie",
                hints: ["LOWER(descrizione)"],
                explanation: "Minuscolo.",
                replacements: {}
            },
            {
                titleTemplate: "Nome Prodotto Minuscolo",
                descTemplate: "Mostra i nomi dei prodotti in minuscolo.",
                queryTemplate: "SELECT LOWER(nome) FROM prodotti",
                hints: ["LOWER(nome)"],
                explanation: "Minuscolo prodotti.",
                replacements: {}
            },
            {
                titleTemplate: "Email Utente Maiuscolo",
                descTemplate: "Mostra le email degli utenti in maiuscolo.",
                queryTemplate: "SELECT UPPER(email) FROM utenti",
                hints: ["UPPER(email)"],
                explanation: "Maiuscolo email.",
                replacements: {}
            },
            {
                titleTemplate: "Paese Utente Minuscolo",
                descTemplate: "Mostra i paesi degli utenti in minuscolo.",
                queryTemplate: "SELECT LOWER(paese) FROM utenti",
                hints: ["LOWER(paese)"],
                explanation: "Minuscolo paese.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Descrizione Categoria",
                descTemplate: "Calcola la lunghezza della descrizione di ogni categoria.",
                queryTemplate: "SELECT descrizione, LENGTH(descrizione) FROM categorie",
                hints: ["LENGTH(descrizione)"],
                explanation: "Lunghezza testo.",
                replacements: {}
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Concatenazione Indirizzo",
                descTemplate: "Crea una stringa formattata: 'Nome vive in Paese'.",
                queryTemplate: "SELECT nome || ' vive in ' || paese FROM utenti",
                hints: ["Usa || oppure CONCAT()"],
                explanation: "Unire stringhe statiche e dinamiche.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Scontato (Floor)",
                descTemplate: "Applica uno sconto del 10% e arrotonda il prezzo per difetto (Floor).",
                queryTemplate: "SELECT nome, FLOOR(prezzo * 0.9) FROM prodotti",
                hints: ["FLOOR() arrotonda sempre verso il basso"],
                explanation: "Funzioni matematiche di arrotondamento forzato.",
                replacements: {}
            },
            {
                titleTemplate: "Estrazione Anno",
                descTemplate: "Dalla data ordine, estrai solo l'anno numerico.",
                queryTemplate: "SELECT YEAR(data_ordine) FROM ordini",
                hints: ["Usa YEAR()"],
                explanation: "Estrazione parte temporale.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Nome Email",
                descTemplate: "Crea una stringa: 'Nome (email)' per ogni utente.",
                queryTemplate: "SELECT nome || ' (' || email || ')' FROM utenti",
                hints: ["Usa || per concatenare", "nome || ' (' || email || ')'"],
                explanation: "Concatenazione con parentesi.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Prodotto Prezzo",
                descTemplate: "Crea una stringa: 'Nome: Prezzo€' per ogni prodotto.",
                queryTemplate: "SELECT nome || ': ' || prezzo || '€' FROM prodotti",
                hints: ["Concatenazione con separatore", "nome || ': ' || prezzo || '€'"],
                explanation: "Concatenazione con formattazione prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Completa Utente",
                descTemplate: "Crea una stringa: 'Nome - Email - Paese' per ogni utente.",
                queryTemplate: "SELECT nome || ' - ' || email || ' - ' || paese FROM utenti",
                hints: ["Concatenazione multipla", "nome || ' - ' || email || ' - ' || paese"],
                explanation: "Concatenazione con separatori multipli.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con CEIL",
                descTemplate: "Arrotonda il prezzo per eccesso (sempre verso l'alto) usando CEIL.",
                queryTemplate: "SELECT nome, CEIL(prezzo) FROM prodotti",
                hints: ["Usa CEIL()", "CEIL() arrotonda sempre verso l'alto"],
                explanation: "CEIL arrotonda sempre per eccesso.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con FLOOR",
                descTemplate: "Arrotonda il prezzo per difetto (sempre verso il basso) usando FLOOR.",
                queryTemplate: "SELECT nome, FLOOR(prezzo) FROM prodotti",
                hints: ["Usa FLOOR()", "FLOOR() arrotonda sempre verso il basso"],
                explanation: "FLOOR arrotonda sempre per difetto.",
                replacements: {}
            },
            {
                titleTemplate: "Sconto 15% Floor",
                descTemplate: "Applica uno sconto del 15% e arrotonda per difetto.",
                queryTemplate: "SELECT nome, FLOOR(prezzo * 0.85) FROM prodotti",
                hints: ["Calcola prezzo * 0.85", "Usa FLOOR()"],
                explanation: "Sconto con FLOOR.",
                replacements: {}
            },
            {
                titleTemplate: "Sconto 20% Ceil",
                descTemplate: "Applica uno sconto del 20% e arrotonda per eccesso.",
                queryTemplate: "SELECT nome, CEIL(prezzo * 0.8) FROM prodotti",
                hints: ["Calcola prezzo * 0.8", "Usa CEIL()"],
                explanation: "Sconto con CEIL.",
                replacements: {}
            },
            {
                titleTemplate: "Stock con Floor",
                descTemplate: "Arrotonda lo stock per difetto usando FLOOR.",
                queryTemplate: "SELECT nome, FLOOR(stock) FROM prodotti",
                hints: ["Usa FLOOR() su stock"],
                explanation: "FLOOR su stock.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Ceil",
                descTemplate: "Arrotonda il prezzo per eccesso usando CEIL.",
                queryTemplate: "SELECT nome, CEIL(prezzo) FROM prodotti",
                hints: ["Usa CEIL() su prezzo"],
                explanation: "CEIL su prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "Anno Ordini",
                descTemplate: "Estrai l'anno da ogni data ordine.",
                queryTemplate: "SELECT YEAR(data_ordine) FROM ordini",
                hints: ["Usa YEAR() su data_ordine"],
                explanation: "YEAR() per estrarre anno.",
                replacements: {}
            },
            {
                titleTemplate: "Anno Spedizioni",
                descTemplate: "Estrai l'anno da ogni data spedizione.",
                queryTemplate: "SELECT YEAR(data_spedizione) FROM spedizioni",
                hints: ["Usa YEAR() su data_spedizione"],
                explanation: "YEAR() su date spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "Mese Ordini",
                descTemplate: "Estrai il mese (1-12) da ogni data ordine.",
                queryTemplate: "SELECT MONTH(data_ordine) FROM ordini",
                hints: ["Usa MONTH()", "MONTH() restituisce 1-12"],
                explanation: "MONTH() per estrarre mese.",
                replacements: {}
            },
            {
                titleTemplate: "Mese Spedizioni",
                descTemplate: "Estrai il mese da ogni data spedizione.",
                queryTemplate: "SELECT MONTH(data_spedizione) FROM spedizioni",
                hints: ["Usa MONTH() su data_spedizione"],
                explanation: "MONTH() su date spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Categoria",
                descTemplate: "Crea una stringa: 'Categoria: Descrizione' per ogni categoria.",
                queryTemplate: "SELECT nome || ': ' || descrizione FROM categorie",
                hints: ["Concatenazione categoria", "nome || ': ' || descrizione"],
                explanation: "Concatenazione categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Fornitore",
                descTemplate: "Crea una stringa: 'Azienda - Nazione' per ogni fornitore.",
                queryTemplate: "SELECT azienda || ' - ' || nazione FROM fornitori",
                hints: ["Concatenazione fornitore", "azienda || ' - ' || nazione"],
                explanation: "Concatenazione fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Spedizione",
                descTemplate: "Crea una stringa: 'Corriere: Codice' per ogni spedizione.",
                queryTemplate: "SELECT corriere || ': ' || codice_tracking FROM spedizioni",
                hints: ["Concatenazione spedizione", "corriere || ': ' || codice_tracking"],
                explanation: "Concatenazione spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo e Sconto Floor",
                descTemplate: "Mostra nome, prezzo originale e prezzo scontato (10%) arrotondato per difetto.",
                queryTemplate: "SELECT nome, prezzo, FLOOR(prezzo * 0.9) FROM prodotti",
                hints: ["Mostra prezzo e sconto", "SELECT nome, prezzo, FLOOR(prezzo * 0.9)"],
                explanation: "Prezzo originale e scontato.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo e Sconto Ceil",
                descTemplate: "Mostra nome, prezzo originale e prezzo scontato (15%) arrotondato per eccesso.",
                queryTemplate: "SELECT nome, prezzo, CEIL(prezzo * 0.85) FROM prodotti",
                hints: ["Mostra prezzo e sconto", "SELECT nome, prezzo, CEIL(prezzo * 0.85)"],
                explanation: "Prezzo originale e scontato con CEIL.",
                replacements: {}
            },
            {
                titleTemplate: "Anno e Mese Ordini",
                descTemplate: "Estrai anno e mese da ogni data ordine.",
                queryTemplate: "SELECT YEAR(data_ordine), MONTH(data_ordine) FROM ordini",
                hints: ["Usa YEAR() e MONTH()", "SELECT YEAR(data_ordine), MONTH(data_ordine)"],
                explanation: "YEAR e MONTH insieme.",
                replacements: {}
            },
            {
                titleTemplate: "Anno e Mese Spedizioni",
                descTemplate: "Estrai anno e mese da ogni data spedizione.",
                queryTemplate: "SELECT YEAR(data_spedizione), MONTH(data_spedizione) FROM spedizioni",
                hints: ["Usa YEAR() e MONTH()", "SELECT YEAR(data_spedizione), MONTH(data_spedizione)"],
                explanation: "YEAR e MONTH su spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione con Anno",
                descTemplate: "Crea una stringa: 'Ordine del Anno' usando l'anno della data ordine.",
                queryTemplate: "SELECT 'Ordine del ' || YEAR(data_ordine) FROM ordini",
                hints: ["Concatenazione con YEAR()", "'Ordine del ' || YEAR(data_ordine)"],
                explanation: "Concatenazione con funzione data.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato e Floor",
                descTemplate: "Mostra nome, prezzo arrotondato a 1 decimale e prezzo con FLOOR.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo) FROM prodotti",
                hints: ["Combina ROUND e FLOOR", "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo)"],
                explanation: "ROUND e FLOOR insieme.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato e Ceil",
                descTemplate: "Mostra nome, prezzo arrotondato a 2 decimali e prezzo con CEIL.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo) FROM prodotti",
                hints: ["Combina ROUND e CEIL", "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo)"],
                explanation: "ROUND e CEIL insieme.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Completa Prodotto",
                descTemplate: "Crea una stringa: 'Nome (Prezzo€, Stock unità)' per ogni prodotto.",
                queryTemplate: "SELECT nome || ' (' || prezzo || '€, ' || stock || ' unità)' FROM prodotti",
                hints: ["Concatenazione complessa", "nome || ' (' || prezzo || '€, ' || stock || ' unità)'"],
                explanation: "Concatenazione complessa con numeri.",
                replacements: {}
            },
            {
                titleTemplate: "Funzioni Multiple",
                descTemplate: "Mostra nome in maiuscolo, prezzo arrotondato e lunghezza nome.",
                queryTemplate: "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome) FROM prodotti",
                hints: ["Combina UPPER, ROUND e LENGTH", "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome)"],
                explanation: "Funzioni multiple insieme.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione con Formattazione",
                descTemplate: "Crea una stringa: 'Utente: Nome (Email)' per ogni utente.",
                queryTemplate: "SELECT 'Utente: ' || nome || ' (' || email || ')' FROM utenti",
                hints: ["Concatenazione con prefisso", "'Utente: ' || nome || ' (' || email || ')'"],
                explanation: "Concatenazione con prefisso e formattazione.",
                replacements: {}
            },
            // NEW EXERCISES FOR FUNCTIONS MEDIUM
            {
                titleTemplate: "Concatenazione Prodotto Categoria",
                descTemplate: "Crea stringa 'Prodotto (Cat ID: X)'.",
                queryTemplate: "SELECT nome || ' (Cat ID: ' || categoria_id || ')' FROM prodotti",
                hints: ["Concatenazione mista stringa/numero"],
                explanation: "Formatta output.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Fornitore Nazione",
                descTemplate: "Crea stringa 'Azienda [Nazione]'.",
                queryTemplate: "SELECT azienda || ' [' || nazione || ']' FROM fornitori",
                hints: ["Concatenazione con parentesi quadre"],
                explanation: "Formatta output fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Anno da Data Spedizione",
                descTemplate: "Estrai l'anno dalla data di spedizione.",
                queryTemplate: "SELECT YEAR(data_spedizione) FROM spedizioni",
                hints: ["YEAR()"],
                explanation: "Estrai anno.",
                replacements: {}
            },
            {
                titleTemplate: "Mese da Data Spedizione",
                descTemplate: "Estrai il mese dalla data di spedizione.",
                queryTemplate: "SELECT MONTH(data_spedizione) FROM spedizioni",
                hints: ["MONTH()"],
                explanation: "Estrai mese.",
                replacements: {}
            },
            {
                titleTemplate: "Giorno da Data Ordine",
                descTemplate: "Estrai il giorno del mese dalla data ordine.",
                queryTemplate: "SELECT DAY(data_ordine) FROM ordini",
                hints: ["DAY()"],
                explanation: "Estrai giorno.",
                replacements: {}
            },
            {
                titleTemplate: "Giorno da Data Spedizione",
                descTemplate: "Estrai il giorno del mese dalla data spedizione.",
                queryTemplate: "SELECT DAY(data_spedizione) FROM spedizioni",
                hints: ["DAY()"],
                explanation: "Estrai giorno spedizione.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Scontato 50% Floor",
                descTemplate: "Calcola prezzo dimezzato e arrotondato per difetto.",
                queryTemplate: "SELECT FLOOR(prezzo * 0.5) FROM prodotti",
                hints: ["FLOOR(prezzo * 0.5)"],
                explanation: "Sconto aggressivo.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Aumentato 10% Ceil",
                descTemplate: "Simula aumento stock del 10%, arrotondato per eccesso.",
                queryTemplate: "SELECT CEIL(stock * 1.1) FROM prodotti",
                hints: ["CEIL(stock * 1.1)"],
                explanation: "Proiezione stock.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Indirizzo Completo",
                descTemplate: "Crea 'Paese: Nazione' per utenti.",
                queryTemplate: "SELECT 'Paese: ' || paese FROM utenti",
                hints: ["Concatenazione semplice"],
                explanation: "Labeling dati.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Voto Recensione",
                descTemplate: "Crea 'Voto: X/5' per recensioni.",
                queryTemplate: "SELECT 'Voto: ' || voto || '/5' FROM recensioni",
                hints: ["Concatenazione con suffisso"],
                explanation: "Formatta voto.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Iniziali Utente (Substring)",
                descTemplate: "Estrai solo la prima lettera del nome utente (Iniziale).",
                queryTemplate: "SELECT SUBSTRING(nome, 1, 1) FROM utenti",
                hints: ["SUBSTRING(str, start, len)"],
                explanation: "Manipolazione fine delle stringhe.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Margine Complesso",
                descTemplate: "Calcola il margine presunto: (Prezzo - 10) arrotondato a 2 decimali.",
                queryTemplate: "SELECT nome, ROUND(prezzo - 10, 2) FROM prodotti",
                hints: ["Combina operazione e ROUND"],
                explanation: "Le funzioni possono prendere espressioni come argomenti.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce (Gestione Null)",
                descTemplate: "Mostra il codice tracking delle spedizioni. Se è NULL, mostra la scritta 'In Attesa'.",
                queryTemplate: "SELECT COALESCE(codice_tracking, 'In Attesa') FROM spedizioni",
                hints: ["Usa COALESCE(valore, fallback)"],
                explanation: "COALESCE restituisce il primo valore non nullo della lista.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Nome Prodotto",
                descTemplate: "Estrai i primi 4 caratteri del nome di ogni prodotto.",
                queryTemplate: "SELECT SUBSTRING(nome, 1, 4) FROM prodotti",
                hints: ["SUBSTRING(nome, 1, 4)", "Inizia da 1, prendi 4 caratteri"],
                explanation: "SUBSTRING per estrarre parte di stringa.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Email",
                descTemplate: "Estrai i primi 5 caratteri di ogni email utente.",
                queryTemplate: "SELECT SUBSTRING(email, 1, 5) FROM utenti",
                hints: ["SUBSTRING(email, 1, 5)"],
                explanation: "SUBSTRING su email.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Paese",
                descTemplate: "Estrai i primi 3 caratteri di ogni paese.",
                queryTemplate: "SELECT SUBSTRING(paese, 1, 3) FROM utenti",
                hints: ["SUBSTRING(paese, 1, 3)"],
                explanation: "SUBSTRING su paese.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Azienda",
                descTemplate: "Estrai i primi 6 caratteri del nome di ogni azienda fornitore.",
                queryTemplate: "SELECT SUBSTRING(azienda, 1, 6) FROM fornitori",
                hints: ["SUBSTRING(azienda, 1, 6)"],
                explanation: "SUBSTRING su azienda.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Commento",
                descTemplate: "Estrai i primi 20 caratteri di ogni commento recensione.",
                queryTemplate: "SELECT SUBSTRING(commento, 1, 20) FROM recensioni",
                hints: ["SUBSTRING(commento, 1, 20)"],
                explanation: "SUBSTRING per anteprima commenti.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Complesso Prezzo",
                descTemplate: "Calcola (prezzo * 1.1) - 5 arrotondato a 2 decimali.",
                queryTemplate: "SELECT nome, ROUND((prezzo * 1.1) - 5, 2) FROM prodotti",
                hints: ["Usa parentesi per ordine", "ROUND((prezzo * 1.1) - 5, 2)"],
                explanation: "Calcolo complesso con ROUND.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Complesso Stock",
                descTemplate: "Calcola (stock + 10) * 2 arrotondato all'intero.",
                queryTemplate: "SELECT nome, ROUND((stock + 10) * 2, 0) FROM prodotti",
                hints: ["Usa parentesi", "ROUND((stock + 10) * 2, 0)"],
                explanation: "Calcolo complesso su stock.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Valore con Round",
                descTemplate: "Calcola il valore inventario (prezzo * stock) arrotondato a 0 decimali.",
                queryTemplate: "SELECT nome, ROUND(prezzo * stock, 0) FROM prodotti",
                hints: ["Calcola prezzo * stock", "ROUND(prezzo * stock, 0)"],
                explanation: "ROUND su calcolo valore.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Sconto Complesso",
                descTemplate: "Calcola prezzo scontato del 20% e arrotondato a 1 decimale.",
                queryTemplate: "SELECT nome, ROUND(prezzo * 0.8, 1) FROM prodotti",
                hints: ["Calcola prezzo * 0.8", "ROUND(prezzo * 0.8, 1)"],
                explanation: "Sconto con ROUND a 1 decimale.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Email",
                descTemplate: "Mostra l'email utente. Se è NULL, mostra 'Email non disponibile'.",
                queryTemplate: "SELECT COALESCE(email, 'Email non disponibile') FROM utenti",
                hints: ["COALESCE(email, 'Email non disponibile')"],
                explanation: "COALESCE per gestire NULL su email.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Commento",
                descTemplate: "Mostra il commento recensione. Se è NULL, mostra 'Nessun commento'.",
                queryTemplate: "SELECT COALESCE(commento, 'Nessun commento') FROM recensioni",
                hints: ["COALESCE(commento, 'Nessun commento')"],
                explanation: "COALESCE per gestire NULL su commenti.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Codice Tracking",
                descTemplate: "Mostra il codice tracking. Se è NULL, mostra 'Non disponibile'.",
                queryTemplate: "SELECT COALESCE(codice_tracking, 'Non disponibile') FROM spedizioni",
                hints: ["COALESCE(codice_tracking, 'Non disponibile')"],
                explanation: "COALESCE per gestire NULL su tracking.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Multiplo",
                descTemplate: "Mostra codice tracking, se NULL mostra corriere, se anche quello è NULL mostra 'Sconosciuto'.",
                queryTemplate: "SELECT COALESCE(codice_tracking, corriere, 'Sconosciuto') FROM spedizioni",
                hints: ["COALESCE con tre valori", "COALESCE(codice_tracking, corriere, 'Sconosciuto')"],
                explanation: "COALESCE multiplo per fallback a catena.",
                replacements: {}
            },
            {
                titleTemplate: "Substring e Concatenazione",
                descTemplate: "Estrai i primi 3 caratteri del nome e concatenali con '...'.",
                queryTemplate: "SELECT SUBSTRING(nome, 1, 3) || '...' FROM utenti",
                hints: ["Combina SUBSTRING con ||", "SUBSTRING(nome, 1, 3) || '...'"],
                explanation: "SUBSTRING combinato con concatenazione.",
                replacements: {}
            },
            {
                titleTemplate: "Substring e UPPER",
                descTemplate: "Estrai i primi 2 caratteri del nome e convertili in maiuscolo.",
                queryTemplate: "SELECT UPPER(SUBSTRING(nome, 1, 2)) FROM utenti",
                hints: ["Nidifica UPPER e SUBSTRING", "UPPER(SUBSTRING(nome, 1, 2))"],
                explanation: "Funzioni nidificate.",
                replacements: {}
            },
            {
                titleTemplate: "LENGTH e SUBSTRING",
                descTemplate: "Mostra la lunghezza del nome e i primi 5 caratteri.",
                queryTemplate: "SELECT LENGTH(nome), SUBSTRING(nome, 1, 5) FROM utenti",
                hints: ["Combina LENGTH e SUBSTRING", "SELECT LENGTH(nome), SUBSTRING(nome, 1, 5)"],
                explanation: "LENGTH e SUBSTRING insieme.",
                replacements: {}
            },
            {
                titleTemplate: "ROUND e FLOOR Insieme",
                descTemplate: "Mostra nome, prezzo arrotondato a 1 decimale e prezzo con FLOOR.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo) FROM prodotti",
                hints: ["ROUND e FLOOR insieme", "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo)"],
                explanation: "ROUND e FLOOR su stesso valore.",
                replacements: {}
            },
            {
                titleTemplate: "ROUND e CEIL Insieme",
                descTemplate: "Mostra nome, prezzo arrotondato a 2 decimali e prezzo con CEIL.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo) FROM prodotti",
                hints: ["ROUND e CEIL insieme", "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo)"],
                explanation: "ROUND e CEIL su stesso valore.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Triplo",
                descTemplate: "Calcola prezzo originale, prezzo con IVA (1.1) e prezzo scontato (0.9) arrotondati.",
                queryTemplate: "SELECT nome, prezzo, ROUND(prezzo * 1.1, 2), ROUND(prezzo * 0.9, 2) FROM prodotti",
                hints: ["Tre calcoli", "SELECT nome, prezzo, ROUND(prezzo * 1.1, 2), ROUND(prezzo * 0.9, 2)"],
                explanation: "Calcoli multipli con ROUND.",
                replacements: {}
            },
            {
                titleTemplate: "Substring e LENGTH",
                descTemplate: "Estrai i primi caratteri del nome (lunghezza/2) e mostra anche la lunghezza totale.",
                queryTemplate: "SELECT nome, LENGTH(nome), SUBSTRING(nome, 1, LENGTH(nome) / 2) FROM utenti",
                hints: ["Usa LENGTH nell'argomento SUBSTRING", "SUBSTRING(nome, 1, LENGTH(nome) / 2)"],
                explanation: "Funzioni nidificate con LENGTH.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Complessa",
                descTemplate: "Crea: 'Nome (Email) - Paese' usando concatenazione.",
                queryTemplate: "SELECT nome || ' (' || email || ') - ' || paese FROM utenti",
                hints: ["Concatenazione multipla", "nome || ' (' || email || ') - ' || paese"],
                explanation: "Concatenazione complessa con parentesi.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce e UPPER",
                descTemplate: "Mostra il codice tracking in maiuscolo, se NULL mostra 'IN ATTESA'.",
                queryTemplate: "SELECT UPPER(COALESCE(codice_tracking, 'In Attesa')) FROM spedizioni",
                hints: ["Nidifica UPPER e COALESCE", "UPPER(COALESCE(codice_tracking, 'In Attesa'))"],
                explanation: "COALESCE nidificato in UPPER.",
                replacements: {}
            },
            {
                titleTemplate: "ROUND e Calcolo Complesso",
                descTemplate: "Calcola ((prezzo + stock) * 0.5) arrotondato a 1 decimale.",
                queryTemplate: "SELECT nome, ROUND((prezzo + stock) * 0.5, 1) FROM prodotti",
                hints: ["Calcolo complesso con parentesi", "ROUND((prezzo + stock) * 0.5, 1)"],
                explanation: "ROUND su calcolo complesso.",
                replacements: {}
            },
            {
                titleTemplate: "Substring e ROUND",
                descTemplate: "Estrai i primi 3 caratteri del nome e mostra anche il prezzo arrotondato.",
                queryTemplate: "SELECT SUBSTRING(nome, 1, 3), ROUND(prezzo, 0) FROM prodotti",
                hints: ["SUBSTRING e ROUND insieme", "SELECT SUBSTRING(nome, 1, 3), ROUND(prezzo, 0)"],
                explanation: "SUBSTRING e ROUND su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Funzioni Multiple Complesse",
                descTemplate: "Mostra nome in maiuscolo, primi 4 caratteri, lunghezza nome e prezzo arrotondato.",
                queryTemplate: "SELECT UPPER(nome), SUBSTRING(nome, 1, 4), LENGTH(nome), ROUND(prezzo, 0) FROM prodotti",
                hints: ["Quattro funzioni", "SELECT UPPER(nome), SUBSTRING(nome, 1, 4), LENGTH(nome), ROUND(prezzo, 0)"],
                explanation: "Funzioni multiple complesse.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce e Concatenazione",
                descTemplate: "Crea: 'Tracking: [codice]' usando COALESCE per gestire NULL.",
                queryTemplate: "SELECT 'Tracking: ' || COALESCE(codice_tracking, 'Non disponibile') FROM spedizioni",
                hints: ["Concatenazione con COALESCE", "'Tracking: ' || COALESCE(codice_tracking, 'Non disponibile')"],
                explanation: "COALESCE in concatenazione.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Finale Complesso",
                descTemplate: "Calcola margine: (prezzo - (prezzo * 0.3)) arrotondato a 2 decimali.",
                queryTemplate: "SELECT nome, ROUND(prezzo - (prezzo * 0.3), 2) FROM prodotti",
                hints: ["Calcolo margine complesso", "ROUND(prezzo - (prezzo * 0.3), 2)"],
                explanation: "Calcolo margine con ROUND.",
                replacements: {}
            },
            {
                titleTemplate: "Funzioni Multiple Finali",
                descTemplate: "Mostra nome prodotto, prezzo arrotondato a 0, nome in maiuscolo e lunghezza nome.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0), UPPER(nome), LENGTH(nome) FROM prodotti",
                hints: ["Combina ROUND, UPPER e LENGTH", "SELECT nome, ROUND(prezzo, 0), UPPER(nome), LENGTH(nome)"],
                explanation: "Funzioni multiple su colonne diverse.",
                replacements: {}
            },
            // NEW EXERCISES FOR FUNCTIONS HARD
            {
                titleTemplate: "Substring Centrale",
                descTemplate: "Estrai 3 caratteri dal nome prodotto partendo dal 2° carattere.",
                queryTemplate: "SELECT SUBSTRING(nome, 2, 3) FROM prodotti",
                hints: ["SUBSTRING(nome, 2, 3)"],
                explanation: "Estrazione interna.",
                replacements: {}
            },
            {
                titleTemplate: "Iniziali Nome Cognome (Simulato)",
                descTemplate: "Estrai i primi 2 caratteri del nome utente in maiuscolo.",
                queryTemplate: "SELECT UPPER(SUBSTRING(nome, 1, 2)) FROM utenti",
                hints: ["UPPER(SUBSTRING(...))"],
                explanation: "Iniziali.",
                replacements: {}
            },
            {
                titleTemplate: "Mascheramento Email",
                descTemplate: "Mostra i primi 3 caratteri dell'email seguiti da '...'.",
                queryTemplate: "SELECT SUBSTRING(email, 1, 3) || '...' FROM utenti",
                hints: ["SUBSTRING + Concatenazione"],
                explanation: "Privacy dati.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo IVA Complesso",
                descTemplate: "Calcola prezzo con IVA 22% arrotondato a 2 decimali.",
                queryTemplate: "SELECT ROUND(prezzo * 1.22, 2) FROM prodotti",
                hints: ["ROUND(prezzo * 1.22, 2)"],
                explanation: "Calcolo finanziario.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Sconto e Arrotondamento",
                descTemplate: "Applica sconto 30% e arrotonda per eccesso (CEIL).",
                queryTemplate: "SELECT CEIL(prezzo * 0.7) FROM prodotti",
                hints: ["CEIL(prezzo * 0.7)"],
                explanation: "Strategia prezzi.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce con Stringa Vuota",
                descTemplate: "Mostra il codice tracking, o una stringa vuota '' se NULL.",
                queryTemplate: "SELECT COALESCE(codice_tracking, '') FROM spedizioni",
                hints: ["COALESCE(..., '')"],
                explanation: "Gestione NULL per UI.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Senza Spazi (TRIM simulato)",
                descTemplate: "Calcola la lunghezza del nome (assumendo TRIM non necessario qui, ma concettualmente utile).",
                queryTemplate: "SELECT LENGTH(nome) FROM utenti",
                hints: ["LENGTH()"],
                explanation: "Pulizia dati.",
                replacements: {}
            },
            {
                titleTemplate: "Estrazione Anno Mese Giorno",
                descTemplate: "Estrai Anno, Mese e Giorno dalla data ordine in 3 colonne.",
                queryTemplate: "SELECT YEAR(data_ordine), MONTH(data_ordine), DAY(data_ordine) FROM ordini",
                hints: ["Tre funzioni data"],
                explanation: "Esplosione data.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Giorni da Oggi (Simulato)",
                descTemplate: "Calcola giorni passati dalla data ordine ad oggi (usa NOW()).",
                queryTemplate: "SELECT DATEDIFF(day, data_ordine, NOW()) FROM ordini",
                hints: ["DATEDIFF(day, start, end)"],
                explanation: "Age calculation.",
                replacements: {}
            },
            {
                titleTemplate: "Formattazione Data Custom",
                descTemplate: "Crea stringa 'Giorno/Mese/Anno' (concatenazione manuale).",
                queryTemplate: "SELECT DAY(data_ordine) || '/' || MONTH(data_ordine) || '/' || YEAR(data_ordine) FROM ordini",
                hints: ["Concatenazione di parti data"],
                explanation: "Formattazione manuale.",
                replacements: {}
            }
        ]
    },
    [TopicId.Dates]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Estrazione Anno Ordine", descTemplate: "Analizziamo le tendenze annuali. Estrai l'anno dalla data di ogni ordine.", queryTemplate: "SELECT YEAR(data_ordine) FROM ordini", brokenCode: "SELECT YEAR(data_ordine FROM ordini", debugHint: "Manca una parentesi di chiusura nella funzione YEAR.", hints: ["Usa la funzione YEAR()"], explanation: "YEAR() estrae la parte anno da una data.", replacements: {} },
            { titleTemplate: "Filtro Anno {year}", descTemplate: "Seleziona tutti gli ordini effettuati esclusivamente nel {year}.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = {year}", brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine = {year}", debugHint: "Manca una parentesi di chiusura nella funzione YEAR.", hints: ["Usa WHERE YEAR(data) = ..."], explanation: "Filtro su componente data.", replacements: { year: DATA.years } },
            { titleTemplate: "Estrazione Mese Spedizione", descTemplate: "Per reportistica mensile, estrai il mese numerico dalle date di spedizione.", queryTemplate: "SELECT MONTH(data_spedizione) FROM spedizioni", brokenCode: "SELECT MONTH(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Usa MONTH()"], explanation: "MONTH() restituisce da 1 a 12.", replacements: {} },
            { titleTemplate: "Anno Ordini", descTemplate: "Estrai l'anno da ogni data ordine.", queryTemplate: "SELECT YEAR(data_ordine) FROM ordini", brokenCode: "SELECT YEA(data_ordine) FROM ordini", debugHint: "Errore di battitura nel nome della funzione YEAR.", hints: ["Usa YEAR(data_ordine)"], explanation: "YEAR() per estrarre anno.", replacements: {} },
            { titleTemplate: "Anno Spedizioni", descTemplate: "Estrai l'anno da ogni data spedizione.", queryTemplate: "SELECT YEAR(data_spedizione) FROM spedizioni", brokenCode: "SELECT YEAR(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione YEAR.", hints: ["Usa YEAR(data_spedizione)"], explanation: "YEAR() su date spedizioni.", replacements: {} },
            { titleTemplate: "Mese Ordini", descTemplate: "Estrai il mese (1-12) da ogni data ordine.", queryTemplate: "SELECT MONTH(data_ordine) FROM ordini", brokenCode: "SELECT MON(data_ordine) FROM ordini", debugHint: "Errore di battitura nel nome della funzione MONTH.", hints: ["Usa MONTH(data_ordine)"], explanation: "MONTH() per estrarre mese.", replacements: {} },
            { titleTemplate: "Mese Spedizioni", descTemplate: "Estrai il mese da ogni data spedizione.", queryTemplate: "SELECT MONTH(data_spedizione) FROM spedizioni", brokenCode: "SELECT MONTH(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Usa MONTH(data_spedizione)"], explanation: "MONTH() su date spedizioni.", replacements: {} },
            { titleTemplate: "Anno e Data Ordine", descTemplate: "Mostra la data ordine completa e l'anno estratto.", queryTemplate: "SELECT data_ordine, YEAR(data_ordine) FROM ordini", brokenCode: "SELECT data_ordine, YEAR(data_ordine FROM ordini", debugHint: "Manca una parentesi di chiusura nella funzione YEAR.", hints: ["Mostra data e YEAR()", "SELECT data_ordine, YEAR(data_ordine)"], explanation: "Data completa e anno estratto.", replacements: {} },
            { titleTemplate: "Mese e Data Spedizione", descTemplate: "Mostra la data spedizione completa e il mese estratto.", queryTemplate: "SELECT data_spedizione, MONTH(data_spedizione) FROM spedizioni", brokenCode: "SELECT data_spedizione, MONTH(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Mostra data e MONTH()", "SELECT data_spedizione, MONTH(data_spedizione)"], explanation: "Data completa e mese estratto.", replacements: {} },
            { titleTemplate: "Anno e Mese Ordini", descTemplate: "Estrai anno e mese da ogni data ordine.", queryTemplate: "SELECT YEAR(data_ordine), MONTH(data_ordine) FROM ordini", brokenCode: "SELECT YEAR(data_ordine), MONTH(data_ordine FROM ordini", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Usa YEAR() e MONTH()", "SELECT YEAR(data_ordine), MONTH(data_ordine)"], explanation: "YEAR e MONTH insieme.", replacements: {} },
            { titleTemplate: "Anno e Mese Spedizioni", descTemplate: "Estrai anno e mese da ogni data spedizione.", queryTemplate: "SELECT YEAR(data_spedizione), MONTH(data_spedizione) FROM spedizioni", brokenCode: "SELECT YEAR(data_spedizione), MONTH(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Usa YEAR() e MONTH()", "SELECT YEAR(data_spedizione), MONTH(data_spedizione)"], explanation: "YEAR e MONTH su spedizioni.", replacements: {} },
            { titleTemplate: "Filtro Anno 2022", descTemplate: "Trova tutti gli ordini effettuati nel 2022.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2022", brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine) == 2022", debugHint: "In SQL si usa un solo uguale per il confronto.", hints: ["WHERE YEAR(data_ordine) = 2022"], explanation: "Filtro per anno specifico.", replacements: {} },
            { titleTemplate: "Filtro Anno 2023", descTemplate: "Trova tutti gli ordini effettuati nel 2023.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2023", brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine) 2023", debugHint: "Manca l'operatore di confronto (=).", hints: ["WHERE YEAR(data_ordine) = 2023"], explanation: "Filtro per anno 2023.", replacements: {} },
            { titleTemplate: "Filtro Anno 2024", descTemplate: "Trova tutti gli ordini effettuati nel 2024.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2024", brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine) = '2024", debugHint: "Manca l'apice di chiusura per l'anno.", hints: ["WHERE YEAR(data_ordine) = 2024"], explanation: "Filtro per anno 2024.", replacements: {} },
            { titleTemplate: "Filtro Mese Gennaio", descTemplate: "Trova tutti gli ordini effettuati a Gennaio (mese 1).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 1", brokenCode: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 1)", debugHint: "C'è una parentesi di troppo.", hints: ["WHERE MONTH(data_ordine) = 1"], explanation: "Filtro per mese specifico.", replacements: {} },
            { titleTemplate: "Filtro Mese {month}", descTemplate: "Trova tutti gli ordini effettuati nel mese {month}.", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = {month}", brokenCode: "SELECT * FROM ordini WHERE MONTH(data_ordine = {month}", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["WHERE MONTH(data_ordine) = {month}"], explanation: "Filtro per mese variabile.", replacements: { month: DATA.months } },
            { titleTemplate: "Filtro Mese Spedizione {month}", descTemplate: "Trova tutte le spedizioni avvenute nel mese {month}.", queryTemplate: "SELECT * FROM spedizioni WHERE MONTH(data_spedizione) = {month}", brokenCode: "SELECT * FROM spedizioni WHERE MONTH(data_spedizione = {month}", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["WHERE MONTH(data_spedizione) = {month}"], explanation: "Filtro mese su spedizioni.", replacements: { month: DATA.months } },
            { titleTemplate: "Data Ordine Completa", descTemplate: "Mostra tutte le date ordine senza estrazioni.", queryTemplate: "SELECT data_ordine FROM ordini", brokenCode: "SELECT data_ordine FORM ordini", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["SELECT data_ordine FROM ordini"], explanation: "Visualizzazione date complete.", replacements: {} },
            { titleTemplate: "Data Spedizione Completa", descTemplate: "Mostra tutte le date spedizione senza estrazioni.", queryTemplate: "SELECT data_spedizione FROM spedizioni", brokenCode: "SELECT data_spedizione FORM spedizioni", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["SELECT data_spedizione FROM spedizioni"], explanation: "Visualizzazione date spedizioni.", replacements: {} },
            { titleTemplate: "Ordini con Anno", descTemplate: "Mostra ID ordine, data ordine e anno estratto.", queryTemplate: "SELECT id, data_ordine, YEAR(data_ordine) FROM ordini", brokenCode: "SELECT id, data_ordine, YEAR(data_ordine FROM ordini", debugHint: "Manca una parentesi di chiusura nella funzione YEAR.", hints: ["Mostra id, data e YEAR()", "SELECT id, data_ordine, YEAR(data_ordine)"], explanation: "ID, data e anno insieme.", replacements: {} },
            { titleTemplate: "Spedizioni con Mese", descTemplate: "Mostra ID spedizione, data spedizione e mese estratto.", queryTemplate: "SELECT id, data_spedizione, MONTH(data_spedizione) FROM spedizioni", brokenCode: "SELECT id, data_spedizione, MONTH(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Mostra id, data e MONTH()", "SELECT id, data_spedizione, MONTH(data_spedizione)"], explanation: "ID, data e mese insieme.", replacements: {} },
            { titleTemplate: "Ordini con Anno e Mese", descTemplate: "Mostra data ordine, anno e mese estratti.", queryTemplate: "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine) FROM ordini", brokenCode: "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine FROM ordini", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Mostra data, YEAR e MONTH", "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine)"], explanation: "Data completa con anno e mese.", replacements: {} },
            { titleTemplate: "Spedizioni con Anno e Mese", descTemplate: "Mostra data spedizione, anno e mese estratti.", queryTemplate: "SELECT data_spedizione, YEAR(data_spedizione), MONTH(data_spedizione) FROM spedizioni", brokenCode: "SELECT data_spedizione, YEAR(data_spedizione), MONTH(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione MONTH.", hints: ["Mostra data, YEAR e MONTH", "SELECT data_spedizione, YEAR(data_spedizione), MONTH(data_spedizione)"], explanation: "Data completa con anno e mese spedizioni.", replacements: {} },
            { titleTemplate: "Filtro Data Specifica", descTemplate: "Trova tutti gli ordini effettuati il 1 Gennaio 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-01'", brokenCode: "SELECT * FROM ordini WHERE data_ordine = 2023-01-01", debugHint: "Le date devono essere racchiuse tra apici singoli.", hints: ["WHERE data_ordine = '2023-01-01'", "Le date sono stringhe 'YYYY-MM-DD'"], explanation: "Filtro per data specifica.", replacements: {} },
            { titleTemplate: "Filtro Data Dopo", descTemplate: "Trova tutti gli ordini effettuati dopo il 1 Gennaio 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > '2023-01-01'", brokenCode: "SELECT * FROM ordini WHERE data_ordine > 2023-01-01", debugHint: "Le date devono essere racchiuse tra apici singoli.", hints: ["WHERE data_ordine > '2023-01-01'"], explanation: "Filtro per data maggiore.", replacements: {} },
            { titleTemplate: "Filtro Data Prima", descTemplate: "Trova tutti gli ordini effettuati prima del 1 Gennaio 2024.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine < '2024-01-01'", brokenCode: "SELECT * FROM ordini WHERE data_ordine < 2024-01-01", debugHint: "Le date devono essere racchiuse tra apici singoli.", hints: ["WHERE data_ordine < '2024-01-01'"], explanation: "Filtro per data minore.", replacements: {} },
            { titleTemplate: "Filtro Data Dopo o Uguale", descTemplate: "Trova tutti gli ordini dal 1 Gennaio 2023 in poi.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine >= '2023-01-01'", brokenCode: "SELECT * FROM ordini WHERE data_ordine >= 2023-01-01", debugHint: "Le date devono essere racchiuse tra apici singoli.", hints: ["WHERE data_ordine >= '2023-01-01'"], explanation: "Filtro per data maggiore o uguale.", replacements: {} },
            { titleTemplate: "Filtro Data Prima o Uguale", descTemplate: "Trova tutti gli ordini fino al 31 Dicembre 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine <= '2023-12-31'", brokenCode: "SELECT * FROM ordini WHERE data_ordine <= 2023-12-31", debugHint: "Le date devono essere racchiuse tra apici singoli.", hints: ["WHERE data_ordine <= '2023-12-31'"], explanation: "Filtro per data minore o uguale.", replacements: {} },
            { titleTemplate: "Filtro Range Date", descTemplate: "Trova tutti gli ordini tra il 1 Gennaio 2023 e il 31 Dicembre 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31'", brokenCode: "SELECT * FROM ordini WHERE data_ordine BETWEEN 2023-01-01 AND 2023-12-31", debugHint: "Le date devono essere racchiuse tra apici singoli.", hints: ["WHERE data_ordine BETWEEN '...' AND '...'"], explanation: "BETWEEN per range di date.", replacements: {} },
            {
                titleTemplate: "Anno con Alias", descTemplate: "Estrai l'anno dalla data ordine e rinominalo come 'Anno_Ordine'.",
                queryTemplate: "SELECT YEAR(data_ordine) AS Anno_Ordine FROM ordini", brokenCode: "SELECT YEAR(data_ordine) ASS Anno_Ordine FROM ordini", debugHint: "Errore di battitura nella parola chiave AS.", hints: ["YEAR(data_ordine) AS Anno_Ordine"], explanation: "YEAR con alias.", replacements: {}
            },
            {
                titleTemplate: "Mese con Alias", descTemplate: "Estrai il mese dalla data spedizione e rinominalo come 'Mese_Spedizione'.",
                queryTemplate: "SELECT MONTH(data_spedizione) AS Mese_Spedizione FROM spedizioni", brokenCode: "SELECT MONTH(data_spedizione) AS Mese_Spedizione FORM spedizioni", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["MONTH(data_spedizione) AS Mese_Spedizione"], explanation: "MONTH con alias.", replacements: {}
            },
            // NEW EXERCISES FOR DATES EASY
            { titleTemplate: "Giorno Ordine", descTemplate: "Estrai il giorno (1-31) dalla data ordine.", queryTemplate: "SELECT DAY(data_ordine) FROM ordini", brokenCode: "SELECT DAY(data_ordine FROM ordini", debugHint: "Manca una parentesi di chiusura nella funzione DAY.", hints: ["DAY()"], explanation: "Estrai giorno.", replacements: {} },
            { titleTemplate: "Giorno Spedizione", descTemplate: "Estrai il giorno (1-31) dalla data spedizione.", queryTemplate: "SELECT DAY(data_spedizione) FROM spedizioni", brokenCode: "SELECT DAY(data_spedizione FROM spedizioni", debugHint: "Manca una parentesi di chiusura nella funzione DAY.", hints: ["DAY()"], explanation: "Estrai giorno spedizione.", replacements: {} },
            { titleTemplate: "Data Corrente", descTemplate: "Mostra la data e ora corrente.", queryTemplate: "SELECT NOW()", brokenCode: "SELECT NOW", debugHint: "Le funzioni richiedono le parentesi, anche se vuote.", hints: ["NOW()"], explanation: "Timestamp attuale.", replacements: {} },
            { titleTemplate: "Filtro Giorno 1", descTemplate: "Trova ordini fatti il primo del mese.", queryTemplate: "SELECT * FROM ordini WHERE DAY(data_ordine) = 1", brokenCode: "SELECT * FROM ordini WHERE DAY(data_ordine) = 1)", debugHint: "C'è una parentesi di troppo.", hints: ["DAY(...) = 1"], explanation: "Inizio mese.", replacements: {} },
            { titleTemplate: "Filtro Giorno 15", descTemplate: "Trova ordini fatti a metà mese (15).", queryTemplate: "SELECT * FROM ordini WHERE DAY(data_ordine) = 15", brokenCode: "SELECT * FROM ordini WHERE DAY(data_ordine) = 15)", debugHint: "C'è una parentesi di troppo.", hints: ["DAY(...) = 15"], explanation: "Metà mese.", replacements: {} },
            { titleTemplate: "Filtro Anno Passato", descTemplate: "Trova ordini del 2022.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2022", brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2022)", debugHint: "C'è una parentesi di troppo.", hints: ["YEAR(...) = 2022"], explanation: "Storico.", replacements: {} },
            { titleTemplate: "Filtro Mese Dicembre", descTemplate: "Trova ordini di Dicembre (12).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 12", brokenCode: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 12)", debugHint: "C'è una parentesi di troppo.", hints: ["MONTH(...) = 12"], explanation: "Fine anno.", replacements: {} },
            { titleTemplate: "Data Ordine Alias", descTemplate: "Seleziona data ordine rinominandola 'Data'.", queryTemplate: "SELECT data_ordine AS Data FROM ordini", brokenCode: "SELECT data_ordine AS Data FORM ordini", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["AS Data"], explanation: "Alias semplice.", replacements: {} },
            { titleTemplate: "Data Spedizione Alias", descTemplate: "Seleziona data spedizione rinominandola 'Spedito_Il'.", queryTemplate: "SELECT data_spedizione AS Spedito_Il FROM spedizioni", brokenCode: "SELECT data_spedizione AS Spedito_Il FORM spedizioni", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["AS Spedito_Il"], explanation: "Alias descrittivo.", replacements: {} },
            { titleTemplate: "Anno Corrente Alias", descTemplate: "Estrai anno ordine come 'Anno_Rif'.", queryTemplate: "SELECT YEAR(data_ordine) AS Anno_Rif FROM ordini", brokenCode: "SELECT YEAR(data_ordine) AS Anno_Rif FORM ordini", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["YEAR(...) AS ..."], explanation: "Alias su funzione.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Spedizioni nel Mese {month}", descTemplate: "Trova tutte le spedizioni avvenute nel mese numero {month} (indipendentemente dall'anno).", queryTemplate: "SELECT * FROM spedizioni WHERE MONTH(data_spedizione) = {month}", hints: ["Usa MONTH(colonna) = numero"], explanation: "Utile per analisi stagionali.", replacements: { month: DATA.months } },
            { titleTemplate: "Data Corrente (Simulata)", descTemplate: "Seleziona la data odierna (in questo ambiente simulato usa NOW() o DATE()).", queryTemplate: "SELECT NOW()", hints: ["Usa NOW()"], explanation: "Restituisce timestamp corrente.", replacements: {} },
            { titleTemplate: "Ordini Post-2023", descTemplate: "Trova tutti gli ordini fatti dopo il 1 Gennaio 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > '2023-01-01'", hints: ["Le date sono stringhe 'YYYY-MM-DD'"], explanation: "Confronto diretto tra stringhe data ISO.", replacements: {} },
            { titleTemplate: "Ordini Pre-2024", descTemplate: "Trova tutti gli ordini fatti prima del 1 Gennaio 2024.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine < '2024-01-01'", hints: ["WHERE data_ordine < '2024-01-01'"], explanation: "Filtro per date precedenti.", replacements: {} },
            { titleTemplate: "Ordini Dopo Data", descTemplate: "Trova tutti gli ordini fatti dopo il 1 Giugno 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > '2023-06-01'", hints: ["WHERE data_ordine > '2023-06-01'"], explanation: "Filtro per data successiva.", replacements: {} },
            { titleTemplate: "Ordini Prima Data", descTemplate: "Trova tutti gli ordini fatti prima del 1 Luglio 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine < '2023-07-01'", hints: ["WHERE data_ordine < '2023-07-01'"], explanation: "Filtro per data precedente.", replacements: {} },
            { titleTemplate: "Spedizioni Dopo Data", descTemplate: "Trova tutte le spedizioni avvenute dopo il 1 Marzo 2023.", queryTemplate: "SELECT * FROM spedizioni WHERE data_spedizione > '2023-03-01'", hints: ["WHERE data_spedizione > '2023-03-01'"], explanation: "Filtro data su spedizioni.", replacements: {} },
            { titleTemplate: "Spedizioni Prima Data", descTemplate: "Trova tutte le spedizioni avvenute prima del 1 Dicembre 2023.", queryTemplate: "SELECT * FROM spedizioni WHERE data_spedizione < '2023-12-01'", hints: ["WHERE data_spedizione < '2023-12-01'"], explanation: "Filtro data precedente su spedizioni.", replacements: {} },
            { titleTemplate: "Range Date Ordini", descTemplate: "Trova tutti gli ordini tra il 1 Gennaio 2023 e il 30 Giugno 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-06-30'", hints: ["WHERE data_ordine BETWEEN '...' AND '...'"], explanation: "BETWEEN per range date.", replacements: {} },
            { titleTemplate: "Range Date Spedizioni", descTemplate: "Trova tutte le spedizioni tra il 1 Aprile 2023 e il 30 Settembre 2023.", queryTemplate: "SELECT * FROM spedizioni WHERE data_spedizione BETWEEN '2023-04-01' AND '2023-09-30'", hints: ["WHERE data_spedizione BETWEEN '...' AND '...'"], explanation: "BETWEEN per range date spedizioni.", replacements: {} },
            { titleTemplate: "Anno e Mese con Filtro", descTemplate: "Mostra anno e mese degli ordini del 2023.", queryTemplate: "SELECT YEAR(data_ordine), MONTH(data_ordine) FROM ordini WHERE YEAR(data_ordine) = 2023", hints: ["Combina YEAR, MONTH e WHERE", "SELECT YEAR(data_ordine), MONTH(data_ordine) FROM ordini WHERE YEAR(data_ordine) = 2023"], explanation: "Funzioni data con filtro.", replacements: {} },
            { titleTemplate: "Anno e Mese Spedizioni 2023", descTemplate: "Mostra anno e mese delle spedizioni del 2023.", queryTemplate: "SELECT YEAR(data_spedizione), MONTH(data_spedizione) FROM spedizioni WHERE YEAR(data_spedizione) = 2023", hints: ["YEAR e MONTH con WHERE", "SELECT YEAR(data_spedizione), MONTH(data_spedizione) FROM spedizioni WHERE YEAR(data_spedizione) = 2023"], explanation: "Funzioni data con filtro su spedizioni.", replacements: {} },
            { titleTemplate: "Filtro Mese e Anno", descTemplate: "Trova tutti gli ordini di Gennaio 2023 (mese 1, anno 2023).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 1 AND YEAR(data_ordine) = 2023", hints: ["Combina MONTH e YEAR con AND", "WHERE MONTH(data_ordine) = 1 AND YEAR(data_ordine) = 2023"], explanation: "Filtro combinato mese e anno.", replacements: {} },
            { titleTemplate: "Filtro Mese e Anno Spedizioni", descTemplate: "Trova tutte le spedizioni di Dicembre 2023 (mese 12, anno 2023).", queryTemplate: "SELECT * FROM spedizioni WHERE MONTH(data_spedizione) = 12 AND YEAR(data_spedizione) = 2023", hints: ["MONTH e YEAR con AND", "WHERE MONTH(data_spedizione) = 12 AND YEAR(data_spedizione) = 2023"], explanation: "Filtro combinato su spedizioni.", replacements: {} },
            { titleTemplate: "Data e Anno Estratto", descTemplate: "Mostra data ordine e anno estratto per ordini del 2023.", queryTemplate: "SELECT data_ordine, YEAR(data_ordine) FROM ordini WHERE YEAR(data_ordine) = 2023", hints: ["Mostra data e YEAR con filtro", "SELECT data_ordine, YEAR(data_ordine) FROM ordini WHERE YEAR(data_ordine) = 2023"], explanation: "Data completa e anno con filtro.", replacements: {} },
            { titleTemplate: "Data e Mese Estratto", descTemplate: "Mostra data spedizione e mese estratto per spedizioni di Gennaio.", queryTemplate: "SELECT data_spedizione, MONTH(data_spedizione) FROM spedizioni WHERE MONTH(data_spedizione) = 1", hints: ["Mostra data e MONTH con filtro", "SELECT data_spedizione, MONTH(data_spedizione) FROM spedizioni WHERE MONTH(data_spedizione) = 1"], explanation: "Data completa e mese con filtro.", replacements: {} },
            { titleTemplate: "Anno con Alias e Filtro", descTemplate: "Estrai l'anno dalla data ordine come 'Anno', solo per ordini del 2023.", queryTemplate: "SELECT YEAR(data_ordine) AS Anno FROM ordini WHERE YEAR(data_ordine) = 2023", hints: ["YEAR con alias e WHERE", "SELECT YEAR(data_ordine) AS Anno FROM ordini WHERE YEAR(data_ordine) = 2023"], explanation: "YEAR con alias e filtro.", replacements: {} },
            { titleTemplate: "Mese con Alias e Filtro", descTemplate: "Estrai il mese dalla data spedizione come 'Mese', solo per spedizioni di Gennaio.", queryTemplate: "SELECT MONTH(data_spedizione) AS Mese FROM spedizioni WHERE MONTH(data_spedizione) = 1", hints: ["MONTH con alias e WHERE", "SELECT MONTH(data_spedizione) AS Mese FROM spedizioni WHERE MONTH(data_spedizione) = 1"], explanation: "MONTH con alias e filtro.", replacements: {} },
            { titleTemplate: "Range Anno", descTemplate: "Trova tutti gli ordini degli anni 2022 o 2023.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) IN (2022, 2023)", hints: ["WHERE YEAR(data_ordine) IN (2022, 2023)"], explanation: "IN con YEAR per anni multipli.", replacements: {} },
            { titleTemplate: "Range Mese", descTemplate: "Trova tutti gli ordini dei mesi estivi (6, 7, 8).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) IN (6, 7, 8)", hints: ["WHERE MONTH(data_ordine) IN (6, 7, 8)"], explanation: "IN con MONTH per mesi multipli.", replacements: {} },
            { titleTemplate: "Range Mese Spedizioni", descTemplate: "Trova tutte le spedizioni dei mesi invernali (12, 1, 2).", queryTemplate: "SELECT * FROM spedizioni WHERE MONTH(data_spedizione) IN (12, 1, 2)", hints: ["WHERE MONTH(data_spedizione) IN (12, 1, 2)"], explanation: "IN con MONTH per mesi invernali.", replacements: {} },
            { titleTemplate: "Anno Maggiore", descTemplate: "Trova tutti gli ordini dell'anno 2023 o successivi.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) >= 2023", hints: ["WHERE YEAR(data_ordine) >= 2023"], explanation: "Confronto su YEAR con >=", replacements: {} },
            { titleTemplate: "Anno Minore", descTemplate: "Trova tutti gli ordini dell'anno 2022 o precedenti.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) <= 2022", hints: ["WHERE YEAR(data_ordine) <= 2022"], explanation: "Confronto su YEAR con <=", replacements: {} },
            { titleTemplate: "Mese Maggiore", descTemplate: "Trova tutti gli ordini dal mese 6 in poi (estate e autunno).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) >= 6", hints: ["WHERE MONTH(data_ordine) >= 6"], explanation: "Confronto su MONTH con >=", replacements: {} },
            { titleTemplate: "Mese Minore", descTemplate: "Trova tutti gli ordini fino al mese 3 (primo trimestre).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) <= 3", hints: ["WHERE MONTH(data_ordine) <= 3"], explanation: "Confronto su MONTH con <=", replacements: {} },
            { titleTemplate: "Data e Funzioni Multiple", descTemplate: "Mostra data ordine, anno e mese estratti per ordini del 2023.", queryTemplate: "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine) FROM ordini WHERE YEAR(data_ordine) = 2023", hints: ["Tre colonne con filtro", "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine) FROM ordini WHERE YEAR(data_ordine) = 2023"], explanation: "Data completa con funzioni e filtro.", replacements: {} },
            { titleTemplate: "Anno e Mese con Alias", descTemplate: "Estrai anno e mese dalla data ordine con alias 'Anno' e 'Mese'.", queryTemplate: "SELECT YEAR(data_ordine) AS Anno, MONTH(data_ordine) AS Mese FROM ordini", hints: ["YEAR e MONTH con alias", "SELECT YEAR(data_ordine) AS Anno, MONTH(data_ordine) AS Mese FROM ordini"], explanation: "Funzioni data con alias multipli.", replacements: {} },
            { titleTemplate: "Filtro Data e Anno", descTemplate: "Trova tutti gli ordini dopo il 1 Gennaio 2023 E dell'anno 2023.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > '2023-01-01' AND YEAR(data_ordine) = 2023", hints: ["Combina confronto data e YEAR", "WHERE data_ordine > '2023-01-01' AND YEAR(data_ordine) = 2023"], explanation: "Filtro combinato data e funzione.", replacements: {} },
            { titleTemplate: "Filtro Data e Mese", descTemplate: "Trova tutti gli ordini dopo il 1 Gennaio 2023 E del mese 6 o successivi.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > '2023-01-01' AND MONTH(data_ordine) >= 6", hints: ["Combina confronto data e MONTH", "WHERE data_ordine > '2023-01-01' AND MONTH(data_ordine) >= 6"], explanation: "Filtro combinato data e mese.", replacements: {} },
            { titleTemplate: "Range Completo", descTemplate: "Trova tutti gli ordini tra il 1 Gennaio 2023 e il 31 Dicembre 2023, mostrando anche anno e mese.", queryTemplate: "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine) FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31'", hints: ["BETWEEN con funzioni data", "SELECT data_ordine, YEAR(data_ordine), MONTH(data_ordine) FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31'"], explanation: "BETWEEN con funzioni data multiple.", replacements: {} },
            // NEW EXERCISES FOR DATES MEDIUM
            { titleTemplate: "Ordini di Capodanno", descTemplate: "Trova gli ordini effettuati il primo dell'anno (2023-01-01).", queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-01'", hints: ["WHERE data_ordine = '2023-01-01'"], explanation: "Filtro su data specifica.", replacements: {} },
            { titleTemplate: "Trimestre 1", descTemplate: "Trova ordini del primo trimestre (Mesi 1, 2, 3).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) BETWEEN 1 AND 3", hints: ["MONTH BETWEEN 1 AND 3"], explanation: "Analisi trimestrale.", replacements: {} },
            { titleTemplate: "Trimestre 4", descTemplate: "Trova ordini dell'ultimo trimestre (Mesi 10, 11, 12).", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) >= 10", hints: ["MONTH >= 10"], explanation: "Chiusura anno.", replacements: {} },
            { titleTemplate: "Giorni Trascorsi", descTemplate: "Calcola giorni passati dal 2023-01-01 ad oggi (NOW).", queryTemplate: "SELECT DATEDIFF(day, '2023-01-01', NOW())", hints: ["DATEDIFF con NOW"], explanation: "Calcolo delta temporale.", replacements: {} },
            { titleTemplate: "Età Ordine", descTemplate: "Calcola giorni passati dalla data ordine ad oggi.", queryTemplate: "SELECT id, DATEDIFF(day, data_ordine, NOW()) FROM ordini", hints: ["DATEDIFF(day, data_ordine, NOW())"], explanation: "Invecchiamento ordini.", replacements: {} },
            { titleTemplate: "Ordini Futuri (Check)", descTemplate: "Trova ordini con data > NOW() (controllo errori).", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > NOW()", hints: ["data > NOW()"], explanation: "Data integrity check.", replacements: {} },
            { titleTemplate: "Spedizioni Veloci (< 2gg)", descTemplate: "Trova spedizioni avvenute entro 2 giorni dall'ordine (Join implicita simulata o filtro diretto se tabella unica, qui usiamo filtro su date note).", queryTemplate: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-01-03'", hints: ["Range stretto"], explanation: "Analisi performance.", replacements: {} },
            { titleTemplate: "Ordini Stesso Giorno", descTemplate: "Trova ordini fatti e spediti lo stesso giorno (Join necessaria, ma qui usiamo filtro placeholder).", queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-01'", hints: ["Placeholder"], explanation: "Same day delivery.", replacements: {} },
            { titleTemplate: "Filtro Anno Mese Giorno", descTemplate: "Trova ordini del 2023-12-25.", queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine)=2023 AND MONTH(data_ordine)=12 AND DAY(data_ordine)=25", hints: ["Tre condizioni AND"], explanation: "Data esatta scomposta.", replacements: {} },
            { titleTemplate: "Ordini Metà Anno", descTemplate: "Trova ordini fatti dopo il 30 Giugno.", queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) > 6", hints: ["MONTH > 6"], explanation: "Secondo semestre.", replacements: {} }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Calcolo Giorni Consegna", descTemplate: "Calcola quanti giorni sono passati tra l'ordine e la spedizione per ogni ordine spedito.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Usa DATEDIFF(day, start, end)", "Serve una JOIN"], explanation: "DATEDIFF calcola intervalli.", replacements: {} },
            { titleTemplate: "Ritardi > {days} Giorni", descTemplate: "Trova le spedizioni che hanno impiegato più di {days} giorni a partire dalla data ordine.", queryTemplate: "SELECT * FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, data_ordine, data_spedizione) > {days}", hints: ["Metti la condizione DATEDIFF nel WHERE"], explanation: "Filtro su intervallo calcolato.", replacements: { days: [2, 3, 5, 7, 10] } },
            { titleTemplate: "Ordini Ultimi 30 Giorni", descTemplate: "Simulando che oggi sia '2023-12-31', trova gli ordini dell'ultimo mese.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > '2023-12-01'", hints: ["Data maggiore di data riferimento"], explanation: "Finestra temporale mobile.", replacements: {} },
            { titleTemplate: "DATEDIFF Ordini Spedizioni", descTemplate: "Calcola i giorni tra ordine e spedizione per ogni ordine spedito.", queryTemplate: "SELECT ordini.id, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["DATEDIFF con JOIN", "SELECT ordini.id, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id"], explanation: "DATEDIFF con JOIN per calcolare intervalli.", replacements: {} },
            { titleTemplate: "DATEDIFF con Alias", descTemplate: "Calcola i giorni tra ordine e spedizione e rinominalo come 'Giorni_Consegna'.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni_Consegna FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["DATEDIFF con alias", "DATEDIFF(day, ...) AS Giorni_Consegna"], explanation: "DATEDIFF con alias.", replacements: {} },
            { titleTemplate: "Filtro DATEDIFF", descTemplate: "Trova le spedizioni che hanno impiegato più di 3 giorni.", queryTemplate: "SELECT * FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, data_ordine, data_spedizione) > 3", hints: ["WHERE DATEDIFF(...) > 3"], explanation: "Filtro su DATEDIFF.", replacements: {} },
            { titleTemplate: "Filtro DATEDIFF Minore", descTemplate: "Trova le spedizioni che hanno impiegato meno di 2 giorni.", queryTemplate: "SELECT * FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, data_ordine, data_spedizione) < 2", hints: ["WHERE DATEDIFF(...) < 2"], explanation: "Filtro DATEDIFF per consegne veloci.", replacements: {} },
            { titleTemplate: "DATEDIFF con Range", descTemplate: "Trova le spedizioni che hanno impiegato tra 2 e 5 giorni.", queryTemplate: "SELECT * FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, data_ordine, data_spedizione) BETWEEN 2 AND 5", hints: ["WHERE DATEDIFF(...) BETWEEN 2 AND 5"], explanation: "BETWEEN con DATEDIFF.", replacements: {} },
            { titleTemplate: "Anno e DATEDIFF", descTemplate: "Mostra anno ordine e giorni di consegna per ogni spedizione.", queryTemplate: "SELECT YEAR(ordini.data_ordine), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["YEAR e DATEDIFF insieme", "SELECT YEAR(ordini.data_ordine), DATEDIFF(day, ...)"], explanation: "YEAR combinato con DATEDIFF.", replacements: {} },
            { titleTemplate: "Mese e DATEDIFF", descTemplate: "Mostra mese ordine e giorni di consegna per ogni spedizione.", queryTemplate: "SELECT MONTH(ordini.data_ordine), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["MONTH e DATEDIFF insieme", "SELECT MONTH(ordini.data_ordine), DATEDIFF(day, ...)"], explanation: "MONTH combinato con DATEDIFF.", replacements: {} },
            { titleTemplate: "Data Ordine e DATEDIFF", descTemplate: "Mostra data ordine e giorni di consegna per ogni spedizione.", queryTemplate: "SELECT ordini.data_ordine, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Data e DATEDIFF", "SELECT ordini.data_ordine, DATEDIFF(day, ...)"], explanation: "Data completa con DATEDIFF.", replacements: {} },
            { titleTemplate: "Data Spedizione e DATEDIFF", descTemplate: "Mostra data spedizione e giorni di consegna per ogni spedizione.", queryTemplate: "SELECT spedizioni.data_spedizione, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Data spedizione e DATEDIFF", "SELECT spedizioni.data_spedizione, DATEDIFF(day, ...)"], explanation: "Data spedizione con DATEDIFF.", replacements: {} },
            { titleTemplate: "DATEDIFF e Filtro Anno", descTemplate: "Calcola giorni consegna solo per ordini del 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023", hints: ["DATEDIFF con WHERE YEAR", "WHERE YEAR(ordini.data_ordine) = 2023"], explanation: "DATEDIFF con filtro anno.", replacements: {} },
            { titleTemplate: "DATEDIFF e Filtro Mese", descTemplate: "Calcola giorni consegna solo per ordini di Gennaio.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE MONTH(ordini.data_ordine) = 1", hints: ["DATEDIFF con WHERE MONTH", "WHERE MONTH(ordini.data_ordine) = 1"], explanation: "DATEDIFF con filtro mese.", replacements: {} },
            { titleTemplate: "DATEDIFF e Filtro Data", descTemplate: "Calcola giorni consegna solo per ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE ordini.data_ordine > '2023-01-01'", hints: ["DATEDIFF con WHERE data", "WHERE ordini.data_ordine > '2023-01-01'"], explanation: "DATEDIFF con filtro data.", replacements: {} },
            { titleTemplate: "DATEDIFF con Alias e Filtro", descTemplate: "Calcola giorni consegna come 'Ritardo' solo per consegne > 3 giorni.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Ritardo FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) > 3", hints: ["DATEDIFF con alias e WHERE DATEDIFF", "WHERE DATEDIFF(...) > 3"], explanation: "DATEDIFF con alias e filtro su stesso calcolo.", replacements: {} },
            { titleTemplate: "Anno Ordine e Anno Spedizione", descTemplate: "Mostra anno ordine e anno spedizione per ogni spedizione.", queryTemplate: "SELECT YEAR(ordini.data_ordine), YEAR(spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["YEAR su entrambe le date", "SELECT YEAR(ordini.data_ordine), YEAR(spedizioni.data_spedizione)"], explanation: "YEAR su date multiple con JOIN.", replacements: {} },
            { titleTemplate: "Mese Ordine e Mese Spedizione", descTemplate: "Mostra mese ordine e mese spedizione per ogni spedizione.", queryTemplate: "SELECT MONTH(ordini.data_ordine), MONTH(spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["MONTH su entrambe le date", "SELECT MONTH(ordini.data_ordine), MONTH(spedizioni.data_spedizione)"], explanation: "MONTH su date multiple con JOIN.", replacements: {} },
            { titleTemplate: "Date Complete e DATEDIFF", descTemplate: "Mostra data ordine, data spedizione e giorni di consegna.", queryTemplate: "SELECT ordini.data_ordine, spedizioni.data_spedizione, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Tre colonne con DATEDIFF", "SELECT ordini.data_ordine, spedizioni.data_spedizione, DATEDIFF(day, ...)"], explanation: "Date complete con DATEDIFF.", replacements: {} },
            { titleTemplate: "Anno, Mese e DATEDIFF", descTemplate: "Mostra anno ordine, mese ordine e giorni di consegna.", queryTemplate: "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["YEAR, MONTH e DATEDIFF", "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), DATEDIFF(day, ...)"], explanation: "Funzioni data multiple con DATEDIFF.", replacements: {} },
            { titleTemplate: "DATEDIFF con ORDER BY", descTemplate: "Calcola giorni consegna e ordina dal più lungo al più corto.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) DESC", hints: ["ORDER BY DATEDIFF(...) DESC"], explanation: "DATEDIFF con ORDER BY.", replacements: {} },
            { titleTemplate: "DATEDIFF con LIMIT", descTemplate: "Trova le 5 spedizioni con il tempo di consegna più lungo.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) DESC LIMIT 5", hints: ["ORDER BY DATEDIFF DESC LIMIT 5"], explanation: "DATEDIFF con ORDER BY e LIMIT.", replacements: {} },
            { titleTemplate: "DATEDIFF e Filtro Combinato", descTemplate: "Calcola giorni consegna per ordini del 2023 con consegna > 2 giorni.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023 AND DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) > 2", hints: ["WHERE YEAR(...) = 2023 AND DATEDIFF(...) > 2"], explanation: "DATEDIFF con filtri combinati.", replacements: {} },
            { titleTemplate: "DATEDIFF e Range Date", descTemplate: "Calcola giorni consegna per ordini tra il 1 Gennaio e 30 Giugno 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE ordini.data_ordine BETWEEN '2023-01-01' AND '2023-06-30'", hints: ["DATEDIFF con WHERE BETWEEN", "WHERE ordini.data_ordine BETWEEN '2023-01-01' AND '2023-06-30'"], explanation: "DATEDIFF con range date.", replacements: {} },
            { titleTemplate: "DATEDIFF con Alias Completo", descTemplate: "Calcola giorni consegna come 'Giorni' e ordina per questo valore.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY Giorni DESC", hints: ["Usa alias nell'ORDER BY", "ORDER BY Giorni DESC"], explanation: "DATEDIFF con alias usato in ORDER BY.", replacements: {} },
            { titleTemplate: "Funzioni Data Multiple", descTemplate: "Mostra anno ordine, mese ordine, anno spedizione, mese spedizione e giorni consegna.", queryTemplate: "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), YEAR(spedizioni.data_spedizione), MONTH(spedizioni.data_spedizione), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Cinque funzioni data", "SELECT YEAR(...), MONTH(...), YEAR(...), MONTH(...), DATEDIFF(...)"], explanation: "Funzioni data multiple con DATEDIFF.", replacements: {} },
            { titleTemplate: "DATEDIFF e Filtro Mese Ordine", descTemplate: "Calcola giorni consegna solo per ordini di Gennaio o Febbraio.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE MONTH(ordini.data_ordine) IN (1, 2)", hints: ["WHERE MONTH(...) IN (1, 2)"], explanation: "DATEDIFF con filtro mese multiplo.", replacements: {} },
            { titleTemplate: "DATEDIFF e Filtro Anno Spedizione", descTemplate: "Calcola giorni consegna solo per spedizioni del 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(spedizioni.data_spedizione) = 2023", hints: ["WHERE YEAR(spedizioni.data_spedizione) = 2023"], explanation: "DATEDIFF con filtro anno spedizione.", replacements: {} },
            { titleTemplate: "DATEDIFF Complesso Finale", descTemplate: "Calcola giorni consegna (alias 'Giorni') per ordini del 2023 con consegna tra 2 e 5 giorni, ordinati per giorni decrescente.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023 AND DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) BETWEEN 2 AND 5 ORDER BY Giorni DESC", hints: ["WHERE YEAR(...) = 2023 AND DATEDIFF(...) BETWEEN 2 AND 5 ORDER BY Giorni DESC"], explanation: "DATEDIFF complesso con filtri multipli e ordinamento.", replacements: {} },
            // NEW EXERCISES FOR DATES HARD
            { titleTemplate: "Giorni alla Spedizione Media", descTemplate: "Calcola la media dei giorni di consegna (AVG DATEDIFF).", queryTemplate: "SELECT AVG(DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione)) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["AVG(DATEDIFF(...))"], explanation: "KPI logistico.", replacements: {} },
            { titleTemplate: "Max Giorni Consegna", descTemplate: "Trova il massimo numero di giorni impiegati per una consegna.", queryTemplate: "SELECT MAX(DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione)) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["MAX(DATEDIFF(...))"], explanation: "Worst case delivery.", replacements: {} },
            { titleTemplate: "Min Giorni Consegna", descTemplate: "Trova il minimo numero di giorni impiegati per una consegna.", queryTemplate: "SELECT MIN(DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione)) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["MIN(DATEDIFF(...))"], explanation: "Best case delivery.", replacements: {} },
            { titleTemplate: "Ordini Spediti in 1 Giorno", descTemplate: "Trova ordini spediti entro 1 giorno (DATEDIFF <= 1).", queryTemplate: "SELECT * FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) <= 1", hints: ["DATEDIFF <= 1"], explanation: "Consegna lampo.", replacements: {} },
            { titleTemplate: "Ordini Spediti Dopo 1 Settimana", descTemplate: "Trova ordini spediti dopo più di 7 giorni.", queryTemplate: "SELECT * FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) > 7", hints: ["DATEDIFF > 7"], explanation: "Ritardi gravi.", replacements: {} },
            { titleTemplate: "Consegne Mese Corrente (Simulato)", descTemplate: "Trova spedizioni avvenute questo mese (MONTH = MONTH(NOW)).", queryTemplate: "SELECT * FROM spedizioni WHERE MONTH(data_spedizione) = MONTH(NOW()) AND YEAR(data_spedizione) = YEAR(NOW())", hints: ["Confronta con NOW()"], explanation: "Report corrente.", replacements: {} },
            { titleTemplate: "Consegne Anno Corrente", descTemplate: "Trova spedizioni di quest'anno.", queryTemplate: "SELECT * FROM spedizioni WHERE YEAR(data_spedizione) = YEAR(NOW())", hints: ["YEAR = YEAR(NOW)"], explanation: "YTD report.", replacements: {} },
            { titleTemplate: "Giorni da Ultimo Ordine", descTemplate: "Calcola giorni passati dall'ordine più recente.", queryTemplate: "SELECT DATEDIFF(day, MAX(data_ordine), NOW()) FROM ordini", hints: ["DATEDIFF(day, MAX(...), NOW())"], explanation: "Recency.", replacements: {} },
            { titleTemplate: "Giorni da Primo Ordine", descTemplate: "Calcola giorni passati dal primo ordine mai effettuato.", queryTemplate: "SELECT DATEDIFF(day, MIN(data_ordine), NOW()) FROM ordini", hints: ["DATEDIFF(day, MIN(...), NOW())"], explanation: "Customer lifetime start.", replacements: {} },
            { titleTemplate: "Intervallo Ordini", descTemplate: "Calcola giorni tra primo e ultimo ordine.", queryTemplate: "SELECT DATEDIFF(day, MIN(data_ordine), MAX(data_ordine)) FROM ordini", hints: ["DATEDIFF(day, MIN, MAX)"], explanation: "Durata attività.", replacements: {} }
        ]
    },
    [TopicId.Joins]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Prodotti e Categorie", descTemplate: "Visualizza il nome del prodotto e il nome della sua categoria associata.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie prodotti.categoria_id = categorie.id", debugHint: "Manca la parola chiave ON per specificare la condizione di join.", hints: ["Usa JOIN ... ON ...", "Specifica tabella.colonna"], explanation: "Inner Join base per decodificare ID.", replacements: {} },
            { titleTemplate: "Ordini e Utenti", descTemplate: "Mostra l'ID ordine e il nome dell'utente che lo ha effettuato.", queryTemplate: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, utenti.nome FROM ordini JION utenti ON ordini.utente_id = utenti.id", debugHint: "Errore di battitura nella parola chiave JOIN.", hints: ["Collega ordini.utente_id con utenti.id"], explanation: "Relazione uno-a-molti.", replacements: {} },
            { titleTemplate: "Spedizioni e Corrieri", descTemplate: "Collega la tabella spedizioni agli ordini per vedere la data ordine accanto al corriere.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id == ordini.id", debugHint: "In SQL si usa un solo uguale (=) per i confronti.", hints: ["JOIN spedizioni ON ordini"], explanation: "Navigare relazioni.", replacements: {} },
            { titleTemplate: "Prodotti e Fornitori", descTemplate: "Visualizza il nome del prodotto e il nome dell'azienda fornitore.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["JOIN prodotti con fornitori", "prodotti.fornitore_id = fornitori.id"], explanation: "JOIN per collegare prodotti e fornitori.", replacements: {} },
            { titleTemplate: "Ordini e Prodotti", descTemplate: "Mostra l'ID ordine e il nome del prodotto ordinato.", queryTemplate: "SELECT ordini.id, prodotti.nome FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT ordini.id, prodotti.nome FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN ordini con prodotti", "ordini.prodotto_id = prodotti.id"], explanation: "JOIN per collegare ordini e prodotti.", replacements: {} },
            { titleTemplate: "Recensioni e Prodotti", descTemplate: "Mostra il voto della recensione e il nome del prodotto recensito.", queryTemplate: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN recensioni con prodotti", "recensioni.prodotto_id = prodotti.id"], explanation: "JOIN per collegare recensioni e prodotti.", replacements: {} },
            { titleTemplate: "Recensioni e Utenti", descTemplate: "Mostra il voto della recensione e il nome dell'utente che l'ha scritta.", queryTemplate: "SELECT recensioni.voto, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.voto, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id utenti.id", debugHint: "Manca l'operatore di uguaglianza (=) nella condizione ON.", hints: ["JOIN recensioni con utenti", "recensioni.utente_id = utenti.id"], explanation: "JOIN per collegare recensioni e utenti.", replacements: {} },
            { titleTemplate: "Spedizioni e Ordini", descTemplate: "Mostra il corriere della spedizione e la data dell'ordine associato.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini spedizioni.ordine_id = ordini.id", debugHint: "Manca la parola chiave ON.", hints: ["JOIN spedizioni con ordini", "spedizioni.ordine_id = ordini.id"], explanation: "JOIN per collegare spedizioni e ordini.", replacements: {} },
            { titleTemplate: "Prodotti Categoria Completa", descTemplate: "Mostra nome prodotto, nome categoria e descrizione categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT prodotti.nome, categorie.nome, categorie.descrizione"], explanation: "JOIN con più colonne dalla tabella joinata.", replacements: {} },
            { titleTemplate: "Ordini Utente Completo", descTemplate: "Mostra ID ordine, nome utente e email utente.", queryTemplate: "SELECT ordini.id, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT ordini.id, utenti.nome, utenti.email"], explanation: "JOIN con più colonne utente.", replacements: {} },
            { titleTemplate: "Prodotti Fornitore Completo", descTemplate: "Mostra nome prodotto, azienda fornitore e nazione fornitore.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT prodotti.nome, fornitori.azienda, fornitori.nazione"], explanation: "JOIN con più colonne fornitore.", replacements: {} },
            { titleTemplate: "Ordini Prodotto Completo", descTemplate: "Mostra ID ordine, nome prodotto e prezzo prodotto.", queryTemplate: "SELECT ordini.id, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT ordini.id, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT ordini.id, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con più colonne prodotto.", replacements: {} },
            { titleTemplate: "Spedizioni Ordine Completo", descTemplate: "Mostra corriere spedizione, data ordine e quantità ordine.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT spedizioni.corriere, ordini.data_ordine, ordini.quantita"], explanation: "JOIN con più colonne ordine.", replacements: {} },
            { titleTemplate: "Recensioni Prodotto Completo", descTemplate: "Mostra voto recensione, nome prodotto e prezzo prodotto.", queryTemplate: "SELECT recensioni.voto, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT recensioni.voto, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con più colonne prodotto.", replacements: {} },
            { titleTemplate: "Recensioni Utente Completo", descTemplate: "Mostra voto recensione, nome utente e paese utente.", queryTemplate: "SELECT recensioni.voto, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.voto, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT recensioni.voto, utenti.nome, utenti.paese"], explanation: "JOIN con più colonne utente.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Prodotti Categorie", descTemplate: "Mostra tutte le colonne di prodotti e categorie usando SELECT *.", queryTemplate: "SELECT * FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT * FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM prodotti JOIN categorie ON ..."], explanation: "SELECT * con JOIN mostra tutte le colonne.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Ordini Utenti", descTemplate: "Mostra tutte le colonne di ordini e utenti usando SELECT *.", queryTemplate: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM ordini JOIN utenti ON ..."], explanation: "SELECT * con JOIN per vedere tutto.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Prodotti Fornitori", descTemplate: "Mostra tutte le colonne di prodotti e fornitori usando SELECT *.", queryTemplate: "SELECT * FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT * FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM prodotti JOIN fornitori ON ..."], explanation: "SELECT * con JOIN fornitori.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Ordini Prodotti", descTemplate: "Mostra tutte le colonne di ordini e prodotti usando SELECT *.", queryTemplate: "SELECT * FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT * FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM ordini JOIN prodotti ON ..."], explanation: "SELECT * con JOIN prodotti.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Spedizioni Ordini", descTemplate: "Mostra tutte le colonne di spedizioni e ordini usando SELECT *.", queryTemplate: "SELECT * FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT * FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM spedizioni JOIN ordini ON ..."], explanation: "SELECT * con JOIN ordini.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Recensioni Prodotti", descTemplate: "Mostra tutte le colonne di recensioni e prodotti usando SELECT *.", queryTemplate: "SELECT * FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT * FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM recensioni JOIN prodotti ON ..."], explanation: "SELECT * con JOIN prodotti.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Recensioni Utenti", descTemplate: "Mostra tutte le colonne di recensioni e utenti usando SELECT *.", queryTemplate: "SELECT * FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT * FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM recensioni JOIN utenti ON ..."], explanation: "SELECT * con JOIN utenti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Prodotti Categorie", descTemplate: "Mostra nome prodotto, prezzo, nome categoria e descrizione categoria.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT prodotti.nome, prodotti.prezzo, categorie.nome, categorie.descrizione"], explanation: "JOIN con quattro colonne.", replacements: {} },
            { titleTemplate: "Quattro Colonne Ordini Utenti", descTemplate: "Mostra ID ordine, data ordine, nome utente e email utente.", queryTemplate: "SELECT ordini.id, ordini.data_ordine, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, ordini.data_ordine, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT ordini.id, ordini.data_ordine, utenti.nome, utenti.email"], explanation: "JOIN con quattro colonne ordini-utenti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Prodotti Fornitori", descTemplate: "Mostra nome prodotto, prezzo, azienda fornitore e nazione fornitore.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT prodotti.nome, prodotti.prezzo, fornitori.azienda, fornitori.nazione"], explanation: "JOIN con quattro colonne prodotti-fornitori.", replacements: {} },
            { titleTemplate: "Quattro Colonne Ordini Prodotti", descTemplate: "Mostra ID ordine, quantità, nome prodotto e prezzo prodotto.", queryTemplate: "SELECT ordini.id, ordini.quantita, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT ordini.id, ordini.quantita, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT ordini.id, ordini.quantita, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con quattro colonne ordini-prodotti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Spedizioni Ordini", descTemplate: "Mostra corriere, codice tracking, data ordine e quantità ordine.", queryTemplate: "SELECT spedizioni.corriere, spedizioni.codice_tracking, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, spedizioni.codice_tracking, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT spedizioni.corriere, spedizioni.codice_tracking, ordini.data_ordine, ordini.quantita"], explanation: "JOIN con quattro colonne spedizioni-ordini.", replacements: {} },
            { titleTemplate: "Quattro Colonne Recensioni Prodotti", descTemplate: "Mostra voto, commento, nome prodotto e prezzo prodotto.", queryTemplate: "SELECT recensioni.voto, recensioni.commento, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, recensioni.commento, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT recensioni.voto, recensioni.commento, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con quattro colonne recensioni-prodotti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Recensioni Utenti", descTemplate: "Mostra voto, commento, nome utente e paese utente.", queryTemplate: "SELECT recensioni.voto, recensioni.commento, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.voto, recensioni.commento, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT recensioni.voto, recensioni.commento, utenti.nome, utenti.paese"], explanation: "JOIN con quattro colonne recensioni-utenti.", replacements: {} },
            { titleTemplate: "Cinque Colonne Complete", descTemplate: "Mostra nome prodotto, prezzo, stock, nome categoria e descrizione categoria.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, prodotti.stock, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, prodotti.stock, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Cinque colonne", "SELECT prodotti.nome, prodotti.prezzo, prodotti.stock, categorie.nome, categorie.descrizione"], explanation: "JOIN con cinque colonne.", replacements: {} },
            // NEW EXERCISES FOR JOINS EASY
            { titleTemplate: "Utenti e Ordini Semplice", descTemplate: "Mostra nome utente e ID ordine.", queryTemplate: "SELECT utenti.nome, ordini.id FROM utenti JOIN ordini ON utenti.id = ordini.utente_id", brokenCode: "SELECT utenti.nome, ordini.id FROM utenti JOIN ordini ON utenti.id = ordini.utente_id)", debugHint: "C'è una parentesi di troppo alla fine.", hints: ["JOIN utenti ordini"], explanation: "Relazione base.", replacements: {} },
            { titleTemplate: "Prodotti e Categorie Semplice", descTemplate: "Mostra nome prodotto e nome categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN prodotti categorie"], explanation: "Relazione catalogo.", replacements: {} },
            { titleTemplate: "Prodotti e Fornitori Semplice", descTemplate: "Mostra nome prodotto e azienda fornitrice.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN prodotti fornitori"], explanation: "Relazione supply chain.", replacements: {} },
            { titleTemplate: "Recensioni e Prodotti Semplice", descTemplate: "Mostra voto recensione e nome prodotto.", queryTemplate: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN recensioni prodotti"], explanation: "Relazione feedback.", replacements: {} },
            { titleTemplate: "Spedizioni e Ordini Semplice", descTemplate: "Mostra codice tracking e data ordine.", queryTemplate: "SELECT spedizioni.codice_tracking, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.codice_tracking, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN spedizioni ordini"], explanation: "Relazione logistica.", replacements: {} },
            { titleTemplate: "Utenti e Paesi (Join)", descTemplate: "Mostra nome utente e paese (dalla tabella utenti, ma concettualmente una join se paese fosse tabella a parte - qui è self-contained).", queryTemplate: "SELECT nome, paese FROM utenti", brokenCode: "SELECT nome, paese FROM utenti;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT semplice"], explanation: "Selezione colonne.", replacements: {} },
            { titleTemplate: "Ordini con Dettagli Utente", descTemplate: "Mostra ID ordine, data e email utente.", queryTemplate: "SELECT ordini.id, ordini.data_ordine, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, ordini.data_ordine, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN ordini utenti"], explanation: "Dettagli contatto.", replacements: {} },
            { titleTemplate: "Prodotti con Dettagli Categoria", descTemplate: "Mostra nome prodotto, prezzo e descrizione categoria.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN prodotti categorie"], explanation: "Dettagli contesto.", replacements: {} },
            { titleTemplate: "Fornitori e Prodotti List", descTemplate: "Mostra azienda fornitore e nome prodotto.", queryTemplate: "SELECT fornitori.azienda, prodotti.nome FROM fornitori JOIN prodotti ON fornitori.id = prodotti.fornitore_id", brokenCode: "SELECT fornitori.azienda, prodotti.nome FROM fornitori JOIN prodotti ON fornitori.id = prodotti.fornitore_id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN fornitori prodotti"], explanation: "Lista offerta.", replacements: {} },
            { titleTemplate: "Recensioni con Utente", descTemplate: "Mostra commento recensione e nome utente.", queryTemplate: "SELECT recensioni.commento, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.commento, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN recensioni utenti"], explanation: "Autore feedback.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Prodotti Fornitore {country}", descTemplate: "Trova i prodotti forniti da aziende con sede in {country}.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = '{country}'", hints: ["Fai la JOIN e poi il WHERE"], explanation: "Filtrare in base a tabella collegata.", replacements: { country: ['Italia', 'Germania', 'USA', 'Francia', 'Spagna', 'Regno Unito'] } },
            { titleTemplate: "Left Join (Prodotti senza Ordini)", descTemplate: "Mostra tutti i prodotti e, se esistono, i relativi ID ordine. Vogliamo vedere anche i prodotti mai ordinati.", queryTemplate: "SELECT prodotti.nome, ordini.id FROM prodotti LEFT JOIN ordini ON prodotti.id = ordini.prodotto_id", hints: ["Usa LEFT JOIN", "Prodotti a sinistra"], explanation: "LEFT JOIN preserva la tabella di sinistra anche se non c'è match.", replacements: {} },
            { titleTemplate: "Ordini Utenti Premium", descTemplate: "Seleziona gli ordini fatti solo da utenti Premium.", queryTemplate: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE", hints: ["Filtra su colonna della tabella joinata"], explanation: "Restrizione dataset via relazione.", replacements: {} },
            { titleTemplate: "Prodotti Categoria {cat}", descTemplate: "Trova i prodotti della categoria con nome '{cat}'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = '{cat}'", hints: ["JOIN e WHERE su categoria", "WHERE categorie.nome = '{cat}'"], explanation: "Filtro su colonna tabella joinata.", replacements: { cat: ['Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Libri'] } },
            { titleTemplate: "Ordini Utenti {country}", descTemplate: "Trova gli ordini fatti da utenti del paese '{country}'.", queryTemplate: "SELECT ordini.id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.paese = '{country}'", hints: ["JOIN e WHERE su paese", "WHERE utenti.paese = '{country}'"], explanation: "Filtro su paese utente.", replacements: { country: ['Italia', 'Francia', 'Germania', 'Spagna', 'USA'] } },
            { titleTemplate: "Recensioni Prodotti Costosi", descTemplate: "Trova le recensioni di prodotti che costano più di 100 euro.", queryTemplate: "SELECT recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE prodotti.prezzo > 100", hints: ["JOIN e WHERE su prezzo", "WHERE prodotti.prezzo > 100"], explanation: "Filtro su prezzo prodotto.", replacements: {} },
            { titleTemplate: "Spedizioni Ordini Recenti", descTemplate: "Trova le spedizioni di ordini fatti dopo il 1 Gennaio 2023.", queryTemplate: "SELECT spedizioni.corriere FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id WHERE ordini.data_ordine > '2023-01-01'", hints: ["JOIN e WHERE su data", "WHERE ordini.data_ordine > '2023-01-01'"], explanation: "Filtro su data ordine.", replacements: {} },
            { titleTemplate: "Prodotti Fornitori {country}", descTemplate: "Trova i prodotti forniti da aziende di {country}.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = '{country}'", hints: ["JOIN e WHERE su nazione", "WHERE fornitori.nazione = '{country}'"], explanation: "Filtro su nazione fornitore.", replacements: { country: ['Italia', 'Germania', 'USA', 'Francia', 'Spagna'] } },
            { titleTemplate: "Ordini Utenti Non Premium", descTemplate: "Trova gli ordini fatti da utenti non Premium.", queryTemplate: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = FALSE", hints: ["JOIN e WHERE su premium", "WHERE utenti.premium = FALSE"], explanation: "Filtro su utenti non premium.", replacements: {} },
            { titleTemplate: "Recensioni Voto Alto", descTemplate: "Trova le recensioni con voto >= 4 di prodotti che costano più di 50 euro.", queryTemplate: "SELECT recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto >= 4 AND prodotti.prezzo > 50", hints: ["JOIN e WHERE multipli", "WHERE recensioni.voto >= 4 AND prodotti.prezzo > 50"], explanation: "Filtri multipli con JOIN.", replacements: {} },
            { titleTemplate: "LEFT JOIN Prodotti Ordini", descTemplate: "Mostra tutti i prodotti e gli ID ordine associati (se esistono).", queryTemplate: "SELECT prodotti.nome, ordini.id FROM prodotti LEFT JOIN ordini ON prodotti.id = ordini.prodotto_id", hints: ["LEFT JOIN", "prodotti LEFT JOIN ordini"], explanation: "LEFT JOIN per vedere tutti i prodotti.", replacements: {} },
            { titleTemplate: "LEFT JOIN Utenti Ordini", descTemplate: "Mostra tutti gli utenti e gli ID ordine associati (se esistono).", queryTemplate: "SELECT utenti.nome, ordini.id FROM utenti LEFT JOIN ordini ON utenti.id = ordini.utente_id", hints: ["LEFT JOIN", "utenti LEFT JOIN ordini"], explanation: "LEFT JOIN per vedere tutti gli utenti.", replacements: {} },
            { titleTemplate: "LEFT JOIN Categorie Prodotti", descTemplate: "Mostra tutte le categorie e i nomi prodotti associati (se esistono).", queryTemplate: "SELECT categorie.nome, prodotti.nome FROM categorie LEFT JOIN prodotti ON categorie.id = prodotti.categoria_id", hints: ["LEFT JOIN", "categorie LEFT JOIN prodotti"], explanation: "LEFT JOIN per vedere tutte le categorie.", replacements: {} },
            { titleTemplate: "LEFT JOIN Fornitori Prodotti", descTemplate: "Mostra tutti i fornitori e i nomi prodotti associati (se esistono).", queryTemplate: "SELECT fornitori.azienda, prodotti.nome FROM fornitori LEFT JOIN prodotti ON fornitori.id = prodotti.fornitore_id", hints: ["LEFT JOIN", "fornitori LEFT JOIN prodotti"], explanation: "LEFT JOIN per vedere tutti i fornitori.", replacements: {} },
            { titleTemplate: "LEFT JOIN Prodotti Recensioni", descTemplate: "Mostra tutti i prodotti e i voti recensioni associati (se esistono).", queryTemplate: "SELECT prodotti.nome, recensioni.voto FROM prodotti LEFT JOIN recensioni ON prodotti.id = recensioni.prodotto_id", hints: ["LEFT JOIN", "prodotti LEFT JOIN recensioni"], explanation: "LEFT JOIN per vedere tutti i prodotti con recensioni.", replacements: {} },
            { titleTemplate: "LEFT JOIN Utenti Recensioni", descTemplate: "Mostra tutti gli utenti e i voti recensioni associati (se esistono).", queryTemplate: "SELECT utenti.nome, recensioni.voto FROM utenti LEFT JOIN recensioni ON utenti.id = recensioni.utente_id", hints: ["LEFT JOIN", "utenti LEFT JOIN recensioni"], explanation: "LEFT JOIN per vedere tutti gli utenti con recensioni.", replacements: {} },
            { titleTemplate: "JOIN con WHERE Prezzo", descTemplate: "Trova i prodotti che costano più di {price} euro con il nome della categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > {price}", hints: ["JOIN e WHERE su prezzo", "WHERE prodotti.prezzo > {price}"], explanation: "JOIN con filtro prezzo.", replacements: { price: [50, 100, 150, 200] } },
            { titleTemplate: "JOIN con WHERE Stock", descTemplate: "Trova i prodotti con stock > {stock} con il nome della categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.stock > {stock}", hints: ["JOIN e WHERE su stock", "WHERE prodotti.stock > {stock}"], explanation: "JOIN con filtro stock.", replacements: { stock: [10, 20, 30, 40] } },
            { titleTemplate: "JOIN con WHERE Data", descTemplate: "Trova gli ordini dopo il {date} con il nome dell'utente.", queryTemplate: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > '{date}'", hints: ["JOIN e WHERE su data", "WHERE ordini.data_ordine > '{date}'"], explanation: "JOIN con filtro data.", replacements: { date: ['2023-01-01', '2023-06-01', '2023-12-01'] } },
            { titleTemplate: "JOIN con WHERE Voto", descTemplate: "Trova le recensioni con voto >= {vote} con il nome del prodotto.", queryTemplate: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto >= {vote}", hints: ["JOIN e WHERE su voto", "WHERE recensioni.voto >= {vote}"], explanation: "JOIN con filtro voto.", replacements: { vote: [3, 4, 5] } },
            { titleTemplate: "JOIN con WHERE AND", descTemplate: "Trova i prodotti che costano tra {min} e {max} euro con il nome della categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo BETWEEN {min} AND {max}", hints: ["JOIN e WHERE BETWEEN", "WHERE prodotti.prezzo BETWEEN {min} AND {max}"], explanation: "JOIN con filtro range prezzo.", replacements: { min: [50, 100], max: [150, 200] } },
            { titleTemplate: "JOIN con WHERE OR", descTemplate: "Trova i prodotti della categoria 'Elettronica' O 'Sport' con il nome della categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = 'Elettronica' OR categorie.nome = 'Sport'", hints: ["JOIN e WHERE OR", "WHERE categorie.nome = 'Elettronica' OR categorie.nome = 'Sport'"], explanation: "JOIN con filtro OR.", replacements: {} },
            { titleTemplate: "JOIN con WHERE IN", descTemplate: "Trova i prodotti forniti da aziende di Italia, Germania o USA con il nome del fornitore.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione IN ('Italia', 'Germania', 'USA')", hints: ["JOIN e WHERE IN", "WHERE fornitori.nazione IN ('Italia', 'Germania', 'USA')"], explanation: "JOIN con filtro IN.", replacements: {} },
            { titleTemplate: "JOIN con ORDER BY", descTemplate: "Mostra nome prodotto e nome categoria, ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY prodotti.prezzo DESC", hints: ["JOIN con ORDER BY", "ORDER BY prodotti.prezzo DESC"], explanation: "JOIN con ordinamento.", replacements: {} },
            { titleTemplate: "JOIN con ORDER BY Nome", descTemplate: "Mostra nome prodotto e nome categoria, ordinati per nome prodotto A-Z.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY prodotti.nome ASC", hints: ["JOIN con ORDER BY nome", "ORDER BY prodotti.nome ASC"], explanation: "JOIN con ordinamento nome.", replacements: {} },
            { titleTemplate: "JOIN con LIMIT", descTemplate: "Mostra i primi 5 prodotti con il nome della categoria, ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY prodotti.prezzo DESC LIMIT 5", hints: ["JOIN con ORDER BY e LIMIT", "ORDER BY prodotti.prezzo DESC LIMIT 5"], explanation: "JOIN con LIMIT.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e ORDER BY", descTemplate: "Trova i prodotti che costano più di 100 euro con il nome della categoria, ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > 100 ORDER BY prodotti.prezzo DESC", hints: ["JOIN, WHERE e ORDER BY", "WHERE prodotti.prezzo > 100 ORDER BY prodotti.prezzo DESC"], explanation: "JOIN con WHERE e ORDER BY.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e LIMIT", descTemplate: "Trova i primi 3 ordini dopo il 1 Gennaio 2023 con il nome dell'utente.", queryTemplate: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > '2023-01-01' LIMIT 3", hints: ["JOIN, WHERE e LIMIT", "WHERE ordini.data_ordine > '2023-01-01' LIMIT 3"], explanation: "JOIN con WHERE e LIMIT.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e ORDER BY Nome", descTemplate: "Trova i prodotti che costano più di 50 euro con il nome della categoria, ordinati per nome prodotto A-Z.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > 50 ORDER BY prodotti.nome ASC", hints: ["JOIN, WHERE e ORDER BY nome", "WHERE prodotti.prezzo > 50 ORDER BY prodotti.nome ASC"], explanation: "JOIN con WHERE e ordinamento nome.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e ORDER BY Stock", descTemplate: "Trova i prodotti con stock > 10 con il nome della categoria, ordinati per stock decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.stock > 10 ORDER BY prodotti.stock DESC", hints: ["JOIN, WHERE e ORDER BY stock", "WHERE prodotti.stock > 10 ORDER BY prodotti.stock DESC"], explanation: "JOIN con WHERE e ordinamento stock.", replacements: {} },
            // NEW EXERCISES FOR JOINS MEDIUM
            { titleTemplate: "Prodotti Categoria Elettronica", descTemplate: "Trova prodotti della categoria 'Elettronica'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = 'Elettronica'", hints: ["WHERE categorie.nome = 'Elettronica'"], explanation: "Filtro su tabella joinata.", replacements: {} },
            { titleTemplate: "Prodotti Fornitore Italia", descTemplate: "Trova prodotti di fornitori italiani.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = 'Italia'", hints: ["WHERE fornitori.nazione = 'Italia'"], explanation: "Filtro geografico.", replacements: {} },
            { titleTemplate: "Ordini Utenti USA", descTemplate: "Trova ordini di utenti USA.", queryTemplate: "SELECT ordini.id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.paese = 'USA'", hints: ["WHERE utenti.paese = 'USA'"], explanation: "Filtro geografico ordini.", replacements: {} },
            { titleTemplate: "Recensioni Voto 5", descTemplate: "Trova recensioni con voto 5 e mostra nome prodotto e commento.", queryTemplate: "SELECT prodotti.nome, recensioni.commento FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto = 5", hints: ["WHERE voto = 5"], explanation: "Filtro eccellenza.", replacements: {} },
            { titleTemplate: "Spedizioni DHL Ordini", descTemplate: "Trova ID e data degli ordini spediti con DHL.", queryTemplate: "SELECT ordini.id, ordini.data_ordine FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE spedizioni.corriere = 'DHL'", hints: ["WHERE corriere = 'DHL'"], explanation: "Filtro corriere.", replacements: {} },
            { titleTemplate: "Prodotti Categoria Prezzo > 50", descTemplate: "Prodotti > 50€ con nome categoria.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > 50", hints: ["WHERE prezzo > 50"], explanation: "Filtro prezzo su join.", replacements: {} },
            { titleTemplate: "Utenti con Ordini > 2023", descTemplate: "Utenti che hanno ordinato dopo il 2023-01-01.", queryTemplate: "SELECT DISTINCT utenti.nome FROM utenti JOIN ordini ON utenti.id = ordini.utente_id WHERE ordini.data_ordine > '2023-01-01'", hints: ["DISTINCT per evitare duplicati"], explanation: "Utenti attivi recenti.", replacements: {} },
            { titleTemplate: "Categorie con Prodotti Stock 0", descTemplate: "Categorie che hanno prodotti esauriti.", queryTemplate: "SELECT DISTINCT categorie.nome FROM categorie JOIN prodotti ON categorie.id = prodotti.categoria_id WHERE prodotti.stock = 0", hints: ["DISTINCT, WHERE stock = 0"], explanation: "Analisi stock categorie.", replacements: {} },
            { titleTemplate: "Fornitori Prodotti Costosi", descTemplate: "Fornitori che vendono prodotti > 200€.", queryTemplate: "SELECT DISTINCT fornitori.azienda FROM fornitori JOIN prodotti ON fornitori.id = prodotti.fornitore_id WHERE prodotti.prezzo > 200", hints: ["DISTINCT, WHERE prezzo > 200"], explanation: "Fornitori premium.", replacements: {} },
            { titleTemplate: "Utenti Recensioni Negative", descTemplate: "Utenti che hanno dato voto <= 2.", queryTemplate: "SELECT DISTINCT utenti.nome FROM utenti JOIN recensioni ON utenti.id = recensioni.utente_id WHERE recensioni.voto <= 2", hints: ["DISTINCT, WHERE voto <= 2"], explanation: "Utenti insoddisfatti.", replacements: {} }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Recensioni Prodotto e Utente", descTemplate: "Mostra il nome prodotto, il nome utente e il voto per ogni recensione. (Join a 3 vie)", queryTemplate: "SELECT prodotti.nome, utenti.nome, recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN utenti ON recensioni.utente_id = utenti.id", hints: ["Fai due JOIN consecutive"], explanation: "SQL permette di concatenare infinite JOIN.", replacements: {} },
            { titleTemplate: "Ordini Dettagliati Completi", descTemplate: "Crea un report con: Data Ordine, Nome Utente, Nome Prodotto e Quantità.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome, ordini.quantita FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id", hints: ["Collega Ordini a Utenti E a Prodotti"], explanation: "Ricostruzione oggetto di business completo.", replacements: {} },
            { titleTemplate: "Self Join (Simulazione)", descTemplate: "Trova coppie di prodotti che hanno lo stesso prezzo (mostra nomi e prezzo).", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id", hints: ["Usa alias A e B per la stessa tabella", "Escludi A.id = B.id"], explanation: "Self Join serve per confrontare righe della stessa tabella.", replacements: {} },
            { titleTemplate: "Tripla JOIN Recensioni", descTemplate: "Mostra nome prodotto, nome categoria, nome utente e voto recensione.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome, recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id", hints: ["Tre JOIN consecutive", "recensioni -> prodotti -> categorie -> utenti"], explanation: "Tripla JOIN per collegare più tabelle.", replacements: {} },
            { titleTemplate: "Tripla JOIN Ordini", descTemplate: "Mostra data ordine, nome utente, nome prodotto e nome categoria.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome, categorie.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Tre JOIN consecutive", "ordini -> utenti -> prodotti -> categorie"], explanation: "Tripla JOIN per ordini completi.", replacements: {} },
            { titleTemplate: "Tripla JOIN Spedizioni", descTemplate: "Mostra corriere, data ordine, nome utente e nome prodotto.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine, utenti.nome, prodotti.nome FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id", hints: ["Tre JOIN consecutive", "spedizioni -> ordini -> utenti -> prodotti"], explanation: "Tripla JOIN per spedizioni complete.", replacements: {} },
            { titleTemplate: "Quattro JOIN Complete", descTemplate: "Mostra nome prodotto, nome categoria, azienda fornitore e nazione fornitore.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["Due JOIN su prodotti", "prodotti -> categorie e prodotti -> fornitori"], explanation: "JOIN multipli dalla stessa tabella base.", replacements: {} },
            { titleTemplate: "Self Join Prezzi Uguali", descTemplate: "Trova coppie di prodotti con lo stesso prezzo (escludendo lo stesso prodotto, mostra nomi e prezzo).", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id", hints: ["Self JOIN con alias", "A.prezzo = B.prezzo WHERE A.id <> B.id"], explanation: "Self JOIN per trovare prodotti con stesso prezzo.", replacements: {} },
            { titleTemplate: "Self Join Stock Uguali", descTemplate: "Trova coppie di prodotti con lo stesso stock (escludendo lo stesso prodotto, mostra nomi e stock).", queryTemplate: "SELECT A.nome, B.nome, A.stock FROM prodotti AS A JOIN prodotti AS B ON A.stock = B.stock WHERE A.id <> B.id", hints: ["Self JOIN con alias", "A.stock = B.stock WHERE A.id <> B.id"], explanation: "Self JOIN per trovare prodotti con stesso stock.", replacements: {} },
            { titleTemplate: "Self Join Categoria Uguale", descTemplate: "Trova coppie di prodotti della stessa categoria (escludendo lo stesso prodotto, mostra nomi e ID categoria).", queryTemplate: "SELECT A.nome, B.nome, A.categoria_id FROM prodotti AS A JOIN prodotti AS B ON A.categoria_id = B.categoria_id WHERE A.id <> B.id", hints: ["Self JOIN con alias", "A.categoria_id = B.categoria_id WHERE A.id <> B.id"], explanation: "Self JOIN per trovare prodotti stessa categoria.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE", descTemplate: "Mostra nome prodotto, nome categoria e nome utente per recensioni con voto >= 4.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4", hints: ["Tre JOIN con WHERE", "WHERE recensioni.voto >= 4"], explanation: "Tripla JOIN con filtro.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE Prezzo", descTemplate: "Mostra data ordine, nome utente e nome prodotto per ordini di prodotti > 100 euro.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE prodotti.prezzo > 100", hints: ["Due JOIN con WHERE", "WHERE prodotti.prezzo > 100"], explanation: "JOIN multipli con filtro prezzo.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE Data", descTemplate: "Mostra corriere, data ordine e nome utente per ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine, utenti.nome FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > '2023-01-01'", hints: ["Due JOIN con WHERE", "WHERE ordini.data_ordine > '2023-01-01'"], explanation: "JOIN multipli con filtro data.", replacements: {} },
            { titleTemplate: "Tripla JOIN con ORDER BY", descTemplate: "Mostra nome prodotto, nome categoria e nome utente per recensioni, ordinate per voto decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id ORDER BY recensioni.voto DESC", hints: ["Tre JOIN con ORDER BY", "ORDER BY recensioni.voto DESC"], explanation: "Tripla JOIN con ordinamento.", replacements: {} },
            { titleTemplate: "Tripla JOIN con ORDER BY Prezzo", descTemplate: "Mostra data ordine, nome utente e nome prodotto, ordinati per prezzo prodotto decrescente.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id ORDER BY prodotti.prezzo DESC", hints: ["Due JOIN con ORDER BY", "ORDER BY prodotti.prezzo DESC"], explanation: "JOIN multipli con ordinamento prezzo.", replacements: {} },
            { titleTemplate: "Tripla JOIN con LIMIT", descTemplate: "Mostra i primi 5 prodotti con categoria e utente recensore, ordinati per voto decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id ORDER BY recensioni.voto DESC LIMIT 5", hints: ["Tre JOIN con ORDER BY e LIMIT", "ORDER BY recensioni.voto DESC LIMIT 5"], explanation: "Tripla JOIN con LIMIT.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE e ORDER BY", descTemplate: "Mostra nome prodotto, nome categoria e nome utente per recensioni con voto >= 4, ordinate per voto decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4 ORDER BY recensioni.voto DESC", hints: ["Tre JOIN con WHERE e ORDER BY", "WHERE recensioni.voto >= 4 ORDER BY recensioni.voto DESC"], explanation: "Tripla JOIN con WHERE e ORDER BY.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE e LIMIT", descTemplate: "Mostra i primi 3 ordini dopo il 1 Gennaio 2023 con nome utente e nome prodotto.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.data_ordine > '2023-01-01' LIMIT 3", hints: ["Due JOIN con WHERE e LIMIT", "WHERE ordini.data_ordine > '2023-01-01' LIMIT 3"], explanation: "JOIN multipli con WHERE e LIMIT.", replacements: {} },
            { titleTemplate: "Quattro JOIN Complete", descTemplate: "Mostra nome prodotto, nome categoria, azienda fornitore e nazione fornitore per tutti i prodotti.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["Due JOIN su prodotti", "prodotti -> categorie e prodotti -> fornitori"], explanation: "JOIN multipli dalla stessa tabella.", replacements: {} },
            { titleTemplate: "Quattro JOIN con WHERE", descTemplate: "Mostra nome prodotto, nome categoria, azienda fornitore e nazione per prodotti > 100 euro.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE prodotti.prezzo > 100", hints: ["Due JOIN con WHERE", "WHERE prodotti.prezzo > 100"], explanation: "JOIN multipli con filtro.", replacements: {} },
            { titleTemplate: "Quattro JOIN con ORDER BY", descTemplate: "Mostra nome prodotto, nome categoria, azienda fornitore e nazione, ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id ORDER BY prodotti.prezzo DESC", hints: ["Due JOIN con ORDER BY", "ORDER BY prodotti.prezzo DESC"], explanation: "JOIN multipli con ordinamento.", replacements: {} },
            { titleTemplate: "Self Join Prezzo Maggiore", descTemplate: "Trova coppie di prodotti dove A costa più di B (escludendo stesso prodotto, mostra nomi e prezzi).", queryTemplate: "SELECT A.nome, B.nome, A.prezzo, B.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo > B.prezzo WHERE A.id <> B.id", hints: ["Self JOIN con >", "A.prezzo > B.prezzo WHERE A.id <> B.id"], explanation: "Self JOIN per confrontare prezzi.", replacements: {} },
            { titleTemplate: "Self Join Stock Maggiore", descTemplate: "Trova coppie di prodotti dove A ha stock maggiore di B (escludendo stesso prodotto, mostra nomi e stock).", queryTemplate: "SELECT A.nome, B.nome, A.stock, B.stock FROM prodotti AS A JOIN prodotti AS B ON A.stock > B.stock WHERE A.id <> B.id", hints: ["Self JOIN con >", "A.stock > B.stock WHERE A.id <> B.id"], explanation: "Self JOIN per confrontare stock.", replacements: {} },
            { titleTemplate: "Self Join con WHERE", descTemplate: "Trova coppie di prodotti con stesso prezzo (mostra nomi e prezzo), ma solo se entrambi costano più di 100 euro.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id AND A.prezzo > 100", hints: ["Self JOIN con WHERE", "A.prezzo = B.prezzo WHERE A.id <> B.id AND A.prezzo > 100"], explanation: "Self JOIN con filtro aggiuntivo.", replacements: {} },
            { titleTemplate: "Self Join con ORDER BY", descTemplate: "Trova coppie di prodotti con stesso prezzo (mostra nomi e prezzo), ordinate per prezzo decrescente.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id ORDER BY A.prezzo DESC", hints: ["Self JOIN con ORDER BY", "ORDER BY A.prezzo DESC"], explanation: "Self JOIN con ordinamento.", replacements: {} },
            { titleTemplate: "Self Join con LIMIT", descTemplate: "Trova le prime 5 coppie di prodotti con stesso prezzo (mostra nomi e prezzo).", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id LIMIT 5", hints: ["Self JOIN con LIMIT", "LIMIT 5"], explanation: "Self JOIN con LIMIT.", replacements: {} },
            { titleTemplate: "Tripla JOIN Completa Finale", descTemplate: "Mostra data ordine, nome utente, paese utente, nome prodotto, prezzo prodotto e quantità ordine.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, utenti.paese, prodotti.nome, prodotti.prezzo, ordini.quantita FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id", hints: ["Due JOIN con sei colonne", "ordini -> utenti -> prodotti"], explanation: "JOIN multipli con molte colonne.", replacements: {} },
            { titleTemplate: "Tripla JOIN con Filtri Multipli", descTemplate: "Mostra nome prodotto, nome categoria e nome utente per recensioni con voto >= 4 di prodotti > 100 euro.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4 AND prodotti.prezzo > 100", hints: ["Tre JOIN con WHERE multipli", "WHERE recensioni.voto >= 4 AND prodotti.prezzo > 100"], explanation: "Tripla JOIN con filtri multipli.", replacements: {} },
            { titleTemplate: "Tripla JOIN con ORDER BY e LIMIT", descTemplate: "Mostra i primi 5 prodotti con categoria e utente recensore, ordinati per voto decrescente e prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id ORDER BY recensioni.voto DESC, prodotti.prezzo DESC LIMIT 5", hints: ["Tre JOIN con ORDER BY multiplo e LIMIT", "ORDER BY recensioni.voto DESC, prodotti.prezzo DESC LIMIT 5"], explanation: "Tripla JOIN con ordinamento multiplo e LIMIT.", replacements: {} },
            { titleTemplate: "Quattro JOIN Complesso", descTemplate: "Mostra nome prodotto, nome categoria, azienda fornitore, nazione fornitore, nome utente e voto recensione per recensioni con voto >= 4.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione, utenti.nome, recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4", hints: ["Quattro JOIN con WHERE", "recensioni -> prodotti -> categorie -> fornitori -> utenti"], explanation: "Quattro JOIN con filtro.", replacements: {} },
            { titleTemplate: "Self Join Complesso Finale", descTemplate: "Trova coppie di prodotti con stesso prezzo e stessa categoria (escludendo stesso prodotto, mostra nomi, prezzo e ID categoria), ordinati per prezzo decrescente.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo, A.categoria_id FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo AND A.categoria_id = B.categoria_id WHERE A.id <> B.id ORDER BY A.prezzo DESC", hints: ["Self JOIN con condizioni multiple", "A.prezzo = B.prezzo AND A.categoria_id = B.categoria_id WHERE A.id <> B.id ORDER BY A.prezzo DESC"], explanation: "Self JOIN complesso con condizioni multiple e ordinamento.", replacements: {} },
            // NEW EXERCISES FOR JOINS HARD
            { titleTemplate: "Cross Join (Simulazione)", descTemplate: "Combina tutti i prodotti con tutte le categorie (Cartesian Product).", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti CROSS JOIN categorie", hints: ["CROSS JOIN"], explanation: "Tutte le combinazioni possibili.", replacements: {} },
            { titleTemplate: "Join Multipla 4 Tabelle", descTemplate: "Mostra nome utente, nome prodotto e nome categoria collegando le 4 tabelle (Utente -> Ordine -> Prodotto -> Categoria).", queryTemplate: "SELECT utenti.nome, prodotti.nome, categorie.nome FROM utenti JOIN ordini ON utenti.id = ordini.utente_id JOIN prodotti ON ordini.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Catena di 3 JOIN"], explanation: "Percorso completo.", replacements: {} },
            { titleTemplate: "Join Multipla 5 Tabelle", descTemplate: "Mostra nome utente, corriere spedizione e azienda fornitore collegando le 5 tabelle (Utente -> Ordine -> Spedizione & Ordine -> Prodotto -> Fornitore).", queryTemplate: "SELECT utenti.nome, spedizioni.corriere, fornitori.azienda FROM utenti JOIN ordini ON utenti.id = ordini.utente_id JOIN spedizioni ON ordini.id = spedizioni.ordine_id JOIN prodotti ON ordini.prodotto_id = prodotti.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["Catena complessa"], explanation: "Vista a 360 gradi.", replacements: {} },
            { titleTemplate: "Prodotti Mai Ordinati (LEFT JOIN NULL)", descTemplate: "Trova prodotti che non sono mai stati ordinati.", queryTemplate: "SELECT prodotti.nome FROM prodotti LEFT JOIN ordini ON prodotti.id = ordini.prodotto_id WHERE ordini.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Tecnica per trovare record orfani.", replacements: {} },
            { titleTemplate: "Utenti Senza Ordini", descTemplate: "Trova utenti che non hanno mai fatto ordini.", queryTemplate: "SELECT utenti.nome FROM utenti LEFT JOIN ordini ON utenti.id = ordini.utente_id WHERE ordini.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Utenti inattivi.", replacements: {} },
            { titleTemplate: "Categorie Senza Prodotti", descTemplate: "Trova categorie vuote.", queryTemplate: "SELECT categorie.nome FROM categorie LEFT JOIN prodotti ON categorie.id = prodotti.categoria_id WHERE prodotti.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Categorie inutilizzate.", replacements: {} },
            { titleTemplate: "Fornitori Senza Prodotti", descTemplate: "Trova fornitori che non hanno prodotti a catalogo.", queryTemplate: "SELECT fornitori.azienda FROM fornitori LEFT JOIN prodotti ON fornitori.id = prodotti.fornitore_id WHERE prodotti.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Fornitori inattivi.", replacements: {} },
            { titleTemplate: "Prodotti Senza Recensioni", descTemplate: "Trova prodotti che non hanno recensioni.", queryTemplate: "SELECT prodotti.nome FROM prodotti LEFT JOIN recensioni ON prodotti.id = recensioni.prodotto_id WHERE recensioni.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Prodotti non valutati.", replacements: {} },
            { titleTemplate: "Utenti Senza Recensioni", descTemplate: "Trova utenti che non hanno mai scritto recensioni.", queryTemplate: "SELECT utenti.nome FROM utenti LEFT JOIN recensioni ON utenti.id = recensioni.utente_id WHERE recensioni.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Lurkers.", replacements: {} },
            { titleTemplate: "Ordini Senza Spedizioni", descTemplate: "Trova ordini non ancora spediti.", queryTemplate: "SELECT ordini.id FROM ordini LEFT JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE spedizioni.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Backlog logistico.", replacements: {} }
        ]
    },
    [TopicId.Aggregation]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Conteggio Utenti", descTemplate: "Il team di marketing vuole sapere quanti utenti sono registrati nella piattaforma. Calcola il numero totale di righe nella tabella 'utenti'.", queryTemplate: "SELECT COUNT(*) FROM utenti", brokenCode: "SELECT COUNT(*) FORM utenti", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa una funzione di aggregazione per contare le righe.", "La funzione COUNT(*) conta tutte le righe, inclusi i valori NULL.", "Sintassi: SELECT COUNT(*) FROM tabella;"], explanation: "COUNT(*) è la funzione standard per ottenere il numero totale di record in una tabella.", replacements: {} },
            { titleTemplate: "Totale Stock", descTemplate: "Il responsabile di magazzino necessita del conteggio totale delle unità fisiche presenti. Calcola la somma di tutti i valori nella colonna 'stock' della tabella 'prodotti'.", queryTemplate: "SELECT SUM(stock) FROM prodotti", brokenCode: "SELECT SUM(stock) FROM prodotti)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa la funzione di aggregazione per sommare valori numerici.", "La funzione SUM(colonna) somma tutti i valori della colonna specificata.", "Sintassi: SELECT SUM(nome_colonna) FROM tabella;"], explanation: "SUM() calcola il totale aritmetico dei valori in una colonna numerica.", replacements: {} },
            { titleTemplate: "Prezzo Medio", descTemplate: "Per un'analisi di mercato, calcola il prezzo medio di vendita di tutti i prodotti a catalogo.", queryTemplate: "SELECT AVG(prezzo) FROM prodotti", brokenCode: "SELECT AVG(prezzo FROM prodotti", debugHint: "Manca la parentesi di chiusura della funzione AVG.", hints: ["Usa la funzione di aggregazione per calcolare la media aritmetica.", "La funzione AVG(colonna) restituisce la media dei valori numerici.", "Sintassi: SELECT AVG(nome_colonna) FROM tabella;"], explanation: "AVG() calcola la media aritmetica dei valori in una colonna, ignorando i NULL.", replacements: {} },
            { titleTemplate: "Conteggio Prodotti", descTemplate: "Quanti prodotti ci sono nel catalogo?", queryTemplate: "SELECT COUNT(*) FROM prodotti", brokenCode: "SELECT COUNT* FROM prodotti", debugHint: "La funzione COUNT richiede le parentesi: COUNT(*).", hints: ["Usa COUNT(*)"], explanation: "Conta tutti i prodotti.", replacements: {} },
            { titleTemplate: "Conteggio Ordini", descTemplate: "Quanti ordini sono stati effettuati?", queryTemplate: "SELECT COUNT(*) FROM ordini", brokenCode: "SELETC COUNT(*) FROM ordini", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Usa COUNT(*)"], explanation: "Conta tutti gli ordini.", replacements: {} },
            { titleTemplate: "Conteggio Recensioni", descTemplate: "Quante recensioni ci sono nel sistema?", queryTemplate: "SELECT COUNT(*) FROM recensioni", brokenCode: "SELECT COUNT(*) FROM recensioni;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa COUNT(*)"], explanation: "Conta tutte le recensioni.", replacements: {} },
            { titleTemplate: "Conteggio Spedizioni", descTemplate: "Quante spedizioni ci sono nel sistema?", queryTemplate: "SELECT COUNT(*) FROM spedizioni", brokenCode: "SELECT COUNT(*) FROM spedizioni", debugHint: "Nessun errore evidente, ma controlla se hai scritto tutto correttamente.", hints: ["Usa COUNT(*)"], explanation: "Conta tutte le spedizioni.", replacements: {} },
            { titleTemplate: "Conteggio Categorie", descTemplate: "Quante categorie ci sono nel sistema?", queryTemplate: "SELECT COUNT(*) FROM categorie", brokenCode: "SELECT COUNT(*) FROM categorie", debugHint: "Controlla la sintassi.", hints: ["Usa COUNT(*)"], explanation: "Conta tutte le categorie.", replacements: {} },
            { titleTemplate: "Conteggio Fornitori", descTemplate: "Quanti fornitori ci sono nel sistema?", queryTemplate: "SELECT COUNT(*) FROM fornitori", brokenCode: "SELECT COUNT(*) FROM fornitori", debugHint: "Verifica la query.", hints: ["Usa COUNT(*)"], explanation: "Conta tutti i fornitori.", replacements: {} },
            { titleTemplate: "Totale Prezzo", descTemplate: "Qual è la somma totale dei prezzi dei prodotti?", queryTemplate: "SELECT SUM(prezzo) FROM prodotti", brokenCode: "SELECT SUM(prezzo) FROM prodotti", debugHint: "Controlla la funzione SUM.", hints: ["Usa SUM(prezzo)"], explanation: "Somma dei prezzi.", replacements: {} },
            { titleTemplate: "Totale Quantità Ordini", descTemplate: "Qual è la somma totale delle quantità ordinate?", queryTemplate: "SELECT SUM(quantita) FROM ordini", brokenCode: "SELECT SUM(quantita) FROM ordini", debugHint: "Verifica la sintassi.", hints: ["Usa SUM(quantita)"], explanation: "Somma delle quantità.", replacements: {} },
            { titleTemplate: "Totale Voti", descTemplate: "Qual è la somma totale dei voti delle recensioni?", queryTemplate: "SELECT SUM(voto) FROM recensioni", brokenCode: "SELECT SUM(voto) FROM recensioni", debugHint: "Controlla la query.", hints: ["Usa SUM(voto)"], explanation: "Somma dei voti.", replacements: {} },
            { titleTemplate: "Stock Medio", descTemplate: "Calcola lo stock medio dei prodotti.", queryTemplate: "SELECT AVG(stock) FROM prodotti", brokenCode: "SELECT AVG(stock) FROM prodotti", debugHint: "Verifica la funzione AVG.", hints: ["Usa AVG(stock)"], explanation: "Media dello stock.", replacements: {} },
            { titleTemplate: "Prezzo Massimo", descTemplate: "Identifica il prodotto più costoso a catalogo. Trova il valore massimo nella colonna 'prezzo' della tabella 'prodotti'.", queryTemplate: "SELECT MAX(prezzo) FROM prodotti", brokenCode: "SELECT MAX(prezzo) FROM prodotti", debugHint: "Controlla la sintassi.", hints: ["Usa la funzione per trovare il valore più alto.", "La funzione MAX(colonna) restituisce il valore massimo.", "Sintassi: SELECT MAX(nome_colonna) FROM tabella;"], explanation: "MAX() restituisce il valore più alto presente nella colonna specificata.", replacements: {} },
            { titleTemplate: "Prezzo Minimo", descTemplate: "Identifica il prodotto più economico. Trova il valore minimo nella colonna 'prezzo' della tabella 'prodotti'.", queryTemplate: "SELECT MIN(prezzo) FROM prodotti", brokenCode: "SELECT MIN(prezzo) FROM prodotti", debugHint: "Verifica la query.", hints: ["Usa la funzione per trovare il valore più basso.", "La funzione MIN(colonna) restituisce il valore minimo.", "Sintassi: SELECT MIN(nome_colonna) FROM tabella;"], explanation: "MIN() restituisce il valore più basso presente nella colonna specificata.", replacements: {} },
            { titleTemplate: "Stock Massimo", descTemplate: "Qual è lo stock massimo tra tutti i prodotti?", queryTemplate: "SELECT MAX(stock) FROM prodotti", brokenCode: "SELECT MAX(stock) FORM prodotti", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa MAX(stock)"], explanation: "Stock massimo.", replacements: {} },
            { titleTemplate: "Stock Minimo", descTemplate: "Qual è lo stock minimo tra tutti i prodotti?", queryTemplate: "SELECT MIN(stock) FROM prodotti", brokenCode: "SELECT MIN(stock) prodotti", debugHint: "Manca la parola chiave FROM.", hints: ["Usa MIN(stock)"], explanation: "Stock minimo.", replacements: {} },
            { titleTemplate: "Voto Massimo", descTemplate: "Qual è il voto massimo tra tutte le recensioni?", queryTemplate: "SELECT MAX(voto) FROM recensioni", brokenCode: "SELETC MAX(voto) FROM recensioni", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Usa MAX(voto)"], explanation: "Voto massimo.", replacements: {} },
            { titleTemplate: "Voto Minimo", descTemplate: "Qual è il voto minimo tra tutte le recensioni?", queryTemplate: "SELECT MIN(voto) FROM recensioni", brokenCode: "SELECT MIN(voto)) FROM recensioni", debugHint: "C'è una parentesi di troppo.", hints: ["Usa MIN(voto)"], explanation: "Voto minimo.", replacements: {} },
            { titleTemplate: "Voto Medio", descTemplate: "Calcola il voto medio di tutte le recensioni.", queryTemplate: "SELECT AVG(voto) FROM recensioni", brokenCode: "SELECT AVG voto FROM recensioni", debugHint: "Le funzioni di aggregazione richiedono le parentesi: AVG(voto).", hints: ["Usa AVG(voto)"], explanation: "Media dei voti.", replacements: {} },
            { titleTemplate: "Quantità Media Ordini", descTemplate: "Calcola la quantità media degli ordini.", queryTemplate: "SELECT AVG(quantita) FROM ordini", brokenCode: "SELECT AVG(quantita) FROM ordini", debugHint: "Nessun errore evidente, ma controlla se hai scritto tutto correttamente.", hints: ["Usa AVG(quantita)"], explanation: "Media delle quantità.", replacements: {} },
            { titleTemplate: "Quantità Massima Ordini", descTemplate: "Qual è la quantità massima tra tutti gli ordini?", queryTemplate: "SELECT MAX(quantita) FROM ordini", brokenCode: "SELECT MAX(quantita) FROM ordini", debugHint: "Controlla la sintassi.", hints: ["Usa MAX(quantita)"], explanation: "Quantità massima.", replacements: {} },
            { titleTemplate: "Quantità Minima Ordini", descTemplate: "Qual è la quantità minima tra tutti gli ordini?", queryTemplate: "SELECT MIN(quantita) FROM ordini", brokenCode: "SELECT MIN(quantita) FROM ordini", debugHint: "Verifica la query.", hints: ["Usa MIN(quantita)"], explanation: "Quantità minima.", replacements: {} },
            { titleTemplate: "Funzioni Multiple", descTemplate: "Esegui un'analisi completa sui prezzi dei prodotti: mostra il conteggio totale, la somma, la media, il massimo e il minimo in un'unica query.", queryTemplate: "SELECT COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti", brokenCode: "SELECT COUNT(*) SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti", debugHint: "Manca una virgola tra le funzioni di aggregazione.", hints: ["Puoi usare più funzioni di aggregazione nella stessa SELECT, separate da virgola.", "Combina COUNT, SUM, AVG, MAX e MIN."], explanation: "È possibile calcolare diverse statistiche aggregate contemporaneamente nella stessa query.", replacements: {} },
            { titleTemplate: "Funzioni Multiple Stock", descTemplate: "Mostra conteggio, somma, media, massimo e minimo dello stock prodotti.", queryTemplate: "SELECT COUNT(*), SUM(stock), AVG(stock), MAX(stock), MIN(stock) FROM prodotti", brokenCode: "SELECT COUNT(*), SUM(stock), AVG(stock), MAX(stock), MIN(stock) FROM prodotti", debugHint: "Controlla le virgole.", hints: ["Combina COUNT, SUM, AVG, MAX, MIN", "SELECT COUNT(*), SUM(stock), AVG(stock), MAX(stock), MIN(stock)"], explanation: "Funzioni aggregate multiple su stock.", replacements: {} },
            { titleTemplate: "Funzioni Multiple Voti", descTemplate: "Mostra conteggio, somma, media, massimo e minimo dei voti recensioni.", queryTemplate: "SELECT COUNT(*), SUM(voto), AVG(voto), MAX(voto), MIN(voto) FROM recensioni", brokenCode: "SELECT COUNT(*), SUM(voto), AVG(voto), MAX(voto), MIN(voto) FROM recensioni", debugHint: "Verifica la lista di funzioni.", hints: ["Combina COUNT, SUM, AVG, MAX, MIN", "SELECT COUNT(*), SUM(voto), AVG(voto), MAX(voto), MIN(voto)"], explanation: "Funzioni aggregate multiple su voti.", replacements: {} },
            { titleTemplate: "Conteggio con Alias", descTemplate: "Conta il numero totale di utenti registrati e rinomina la colonna del risultato come 'Totale_Utenti' per maggiore chiarezza.", queryTemplate: "SELECT COUNT(*) AS Totale_Utenti FROM utenti", brokenCode: "SELECT COUNT(*) AS Totale_Utenti FROM utenti", debugHint: "Nessun errore evidente.", hints: ["Usa la keyword AS dopo la funzione di aggregazione.", "Sintassi: funzione() AS Alias"], explanation: "Assegnare un alias alle funzioni di aggregazione rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Somma con Alias", descTemplate: "Calcola la somma dello stock e rinomina il risultato come 'Stock_Totale'.", queryTemplate: "SELECT SUM(stock) AS Stock_Totale FROM prodotti", brokenCode: "SELECT SUM(stock) AS Stock_Totale FROM prodotti", debugHint: "Controlla l'alias.", hints: ["SUM(stock) AS Stock_Totale"], explanation: "SUM con alias.", replacements: {} },
            { titleTemplate: "Media con Alias", descTemplate: "Calcola la media dei prezzi e rinomina il risultato come 'Prezzo_Medio'.", queryTemplate: "SELECT AVG(prezzo) AS Prezzo_Medio FROM prodotti", brokenCode: "SELECT AVG(prezzo) AS Prezzo_Medio FROM prodotti", debugHint: "Verifica l'alias.", hints: ["AVG(prezzo) AS Prezzo_Medio"], explanation: "AVG con alias.", replacements: {} },
            { titleTemplate: "Massimo con Alias", descTemplate: "Trova il prezzo massimo e rinomina il risultato come 'Prezzo_Massimo'.", queryTemplate: "SELECT MAX(prezzo) AS Prezzo_Massimo FROM prodotti", brokenCode: "SELECT MAX(prezzo) AS Prezzo_Massimo FROM prodotti", debugHint: "Controlla la sintassi.", hints: ["MAX(prezzo) AS Prezzo_Massimo"], explanation: "MAX con alias.", replacements: {} },
            { titleTemplate: "Minimo con Alias", descTemplate: "Trova il prezzo minimo e rinomina il risultato come 'Prezzo_Minimo'.", queryTemplate: "SELECT MIN(prezzo) AS Prezzo_Minimo FROM prodotti", brokenCode: "SELETC MIN(prezzo) AS Prezzo_Minimo FROM prodotti", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["MIN(prezzo) AS Prezzo_Minimo"], explanation: "MIN con alias.", replacements: {} },
            // NEW EXERCISES FOR AGGREGATION EASY
            { titleTemplate: "Conteggio Utenti Premium", descTemplate: "Il reparto vendite vuole sapere quanti abbonati paganti ci sono. Conta solo gli utenti che hanno il flag 'premium' impostato a TRUE.", queryTemplate: "SELECT COUNT(*) FROM utenti WHERE premium = TRUE", brokenCode: "SELECT COUNT(*) FROM utenti WHER premium = TRUE", debugHint: "Errore di battitura nella parola chiave WHERE.", hints: ["Usa COUNT(*) combinato con la clausola WHERE.", "Filtra prima le righe, poi conta il risultato."], explanation: "Le funzioni di aggregazione operano sulle righe filtrate dalla clausola WHERE.", replacements: {} },
            { titleTemplate: "Somma Stock Elettronica", descTemplate: "Calcola lo stock totale dei prodotti di categoria 1 (Elettronica).", queryTemplate: "SELECT SUM(stock) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT SUM(stock) prodotti WHERE categoria_id = 1", debugHint: "Manca la parola chiave FROM.", hints: ["SUM con WHERE"], explanation: "Somma filtrata.", replacements: {} },
            { titleTemplate: "Media Prezzo Elettronica", descTemplate: "Calcola il prezzo medio dei prodotti di categoria 1.", queryTemplate: "SELECT AVG(prezzo) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT AV(prezzo) FROM prodotti WHERE categoria_id = 1", debugHint: "La funzione per la media è AVG, non AV.", hints: ["AVG con WHERE"], explanation: "Media filtrata.", replacements: {} },
            { titleTemplate: "Massimo Prezzo Elettronica", descTemplate: "Analisi Prezzi: identifica il prezzo più alto tra i prodotti della categoria 'Elettronica' (id=1).", queryTemplate: "SELECT MAX(prezzo) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT MAX(prezzo) FROM prodotti WHERE categoria_id = 1", debugHint: "Nessun errore evidente, ma controlla se hai scritto tutto correttamente.", hints: ["Usa MAX con una clausola WHERE.", "WHERE categoria_id = 1"], explanation: "Trova il valore massimo in un sottoinsieme filtrato di dati.", replacements: {} },
            { titleTemplate: "Minimo Prezzo Elettronica", descTemplate: "Analisi Prezzi: identifica il prezzo più basso tra i prodotti della categoria 'Elettronica' (id=1).", queryTemplate: "SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1", debugHint: "Controlla la sintassi.", hints: ["Usa MIN con una clausola WHERE.", "WHERE categoria_id = 1"], explanation: "Trova il valore minimo in un sottoinsieme filtrato di dati.", replacements: {} },
            { titleTemplate: "Conteggio Prodotti Costosi", descTemplate: "Inventario Premium: conta quanti prodotti hanno un prezzo superiore a 100€.", queryTemplate: "SELECT COUNT(*) FROM prodotti WHERE prezzo > 100", brokenCode: "SELECT COUNT(*) FROM prodotti WHERE prezzo > 100", debugHint: "Verifica la query.", hints: ["Usa COUNT(*) con un filtro sul prezzo.", "WHERE prezzo > 100"], explanation: "Conta le righe che soddisfano una condizione numerica.", replacements: {} },
            { titleTemplate: "Somma Valore Magazzino", descTemplate: "Valutazione Asset: calcola il valore totale teorico del magazzino (somma di prezzo * stock).", queryTemplate: "SELECT SUM(prezzo * stock) FROM prodotti", brokenCode: "SELECT SUM(prezzo * stock) FROM prodotti", debugHint: "Controlla la funzione SUM.", hints: ["Puoi usare espressioni matematiche dentro SUM.", "SUM(prezzo * stock)"], explanation: "Aggrega il risultato di un calcolo riga per riga.", replacements: {} },
            { titleTemplate: "Conteggio Ordini 2023", descTemplate: "Volume Vendite: conta il numero totale di ordini ricevuti nell'anno 2023.", queryTemplate: "SELECT COUNT(*) FROM ordini WHERE YEAR(data_ordine) = 2023", brokenCode: "SELECT COUNT(*) FROM ordini WHERE YEAR(data_ordine) = 2023", debugHint: "Verifica la sintassi.", hints: ["Filtra per anno e poi conta.", "WHERE YEAR(data_ordine) = 2023"], explanation: "Conteggio filtrato su base temporale.", replacements: {} },
            { titleTemplate: "Conteggio Spedizioni DHL", descTemplate: "Logistica: conta quante spedizioni sono state affidate al corriere 'DHL'.", queryTemplate: "SELECT COUNT(*) FROM spedizioni WHERE corriere = 'DHL'", brokenCode: "SELECT COUNT(*) FROM spedizioni WHERE corriere = 'DHL'", debugHint: "Controlla la query.", hints: ["Filtra per nome del corriere.", "WHERE corriere = 'DHL'"], explanation: "Conteggio basato su uguaglianza di stringhe.", replacements: {} },
            { titleTemplate: "Media Voto Recensioni Alte", descTemplate: "Qualità Percepita: calcola il voto medio considerando solo le recensioni positive (voto >= 4).", queryTemplate: "SELECT AVG(voto) FROM recensioni WHERE voto >= 4", brokenCode: "SELECT AVG(voto) FROM recensioni WHERE voto >= 4", debugHint: "Verifica la funzione AVG.", hints: ["Calcola la media su un sottoinsieme.", "WHERE voto >= 4"], explanation: "Media condizionata a un filtro.", replacements: {} },
            { titleTemplate: "Totale Quantità Ordini Grandi", descTemplate: "Analisi Volumi: calcola la quantità totale di articoli venduti in ordini 'grandi' (> 5 pezzi).", queryTemplate: "SELECT SUM(quantita) FROM ordini WHERE quantita > 5", brokenCode: "SELECT SUM(quantita) FROM ordini WHERE quantita > 5", debugHint: "Controlla la sintassi.", hints: ["Somma solo le quantità che superano la soglia.", "WHERE quantita > 5"], explanation: "Somma filtrata.", replacements: {} },
            { titleTemplate: "Conteggio Fornitori Italiani", descTemplate: "Supply Chain: conta quanti fornitori hanno sede in Italia.", queryTemplate: "SELECT COUNT(*) FROM fornitori WHERE nazione = 'Italia'", brokenCode: "SELECT COUNT(*) FROM fornitori WHERE nazione = 'Italia'", debugHint: "Verifica la query.", hints: ["Filtra per nazione.", "WHERE nazione = 'Italia'"], explanation: "Conteggio geografico.", replacements: {} },
            { titleTemplate: "Conteggio Utenti Gmail", descTemplate: "Analisi Clienti: conta quanti utenti utilizzano un indirizzo email 'gmail.com'.", queryTemplate: "SELECT COUNT(*) FROM utenti WHERE email LIKE '%gmail.com'", brokenCode: "SELECT COUNT(*) FROM utenti WHERE email LIKE '%gmail.com'", debugHint: "Controlla la sintassi.", hints: ["Usa LIKE per cercare il pattern.", "WHERE email LIKE '%gmail.com'"], explanation: "Conteggio basato su pattern matching.", replacements: {} },
            { titleTemplate: "Prezzo Medio Stock Basso", descTemplate: "Monitoraggio Scorte: calcola il prezzo medio dei prodotti che sono quasi esauriti (stock < 10).", queryTemplate: "SELECT AVG(prezzo) FROM prodotti WHERE stock < 10", brokenCode: "SELECT AVG(prezzo) FROM prodotti WHERE stock < 10", debugHint: "Verifica la funzione AVG.", hints: ["Media dei prezzi per prodotti con poco stock.", "WHERE stock < 10"], explanation: "Analisi statistica su prodotti critici.", replacements: {} },
            { titleTemplate: "Max Prezzo Fornitore 1", descTemplate: "Analisi Fornitore: trova il prezzo del prodotto più costoso fornito dal fornitore 1.", queryTemplate: "SELECT MAX(prezzo) FROM prodotti WHERE fornitore_id = 1", brokenCode: "SELECT MAX(prezzo) FROM prodotti WHERE fornitore_id = 1", debugHint: "Controlla la query.", hints: ["Massimo prezzo per un fornitore specifico.", "WHERE fornitore_id = 1"], explanation: "Estrazione di un estremo in un gruppo logico.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Conteggio per Paese", descTemplate: "Il team di marketing vuole analizzare la distribuzione geografica degli utenti. Conta quanti utenti sono registrati per ogni paese.", queryTemplate: "SELECT paese, COUNT(*) FROM utenti GROUP BY paese", hints: ["Usa GROUP BY per raggruppare i risultati.", "Sintassi: SELECT colonna, COUNT(*) FROM tabella GROUP BY colonna;"], explanation: "Raggruppa le righe per 'paese' e conta quante righe ci sono in ogni gruppo.", replacements: {} },
            { titleTemplate: "Stock per Categoria", descTemplate: "Il responsabile di magazzino necessita di un report sulle scorte. Calcola la somma totale dello stock per ogni categoria di prodotto.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id", hints: ["Usa SUM() con GROUP BY.", "Sintassi: SELECT colonna_raggruppamento, SUM(colonna_somma) ... GROUP BY colonna_raggruppamento"], explanation: "Calcola il totale della colonna 'stock' per ogni distinto 'categoria_id'.", replacements: {} },
            { titleTemplate: "Media Voto Prodotti", descTemplate: "Per valutare la qualità del catalogo, calcola il voto medio ricevuto da ogni prodotto nelle recensioni.", queryTemplate: "SELECT prodotto_id, AVG(voto) FROM recensioni GROUP BY prodotto_id", hints: ["Usa AVG() per la media.", "Ricorda di raggruppare per prodotto_id."], explanation: "Calcola la media aritmetica dei voti per ogni gruppo di recensioni dello stesso prodotto.", replacements: {} },
            { titleTemplate: "Conteggio per Categoria", descTemplate: "Vogliamo sapere quanto è vario il nostro catalogo. Conta il numero di prodotti presenti in ogni categoria.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) con GROUP BY categoria_id."], explanation: "Conta le righe della tabella prodotti per ogni categoria distinta.", replacements: {} },
            { titleTemplate: "Conteggio per Fornitore", descTemplate: "Per gestire i rapporti commerciali, conta quanti prodotti sono forniti da ciascun fornitore.", queryTemplate: "SELECT fornitore_id, COUNT(*) FROM prodotti GROUP BY fornitore_id", hints: ["Raggruppa per fornitore_id e conta."], explanation: "Mostra il numero di prodotti associati a ciascun fornitore.", replacements: {} },
            { titleTemplate: "Conteggio per Utente", descTemplate: "Analizza l'attività dei clienti contando il numero totale di ordini effettuati da ciascun utente.", queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id", hints: ["Usa la tabella ordini.", "Raggruppa per utente_id."], explanation: "Conta quanti ordini sono stati piazzati da ogni singolo utente.", replacements: {} },
            { titleTemplate: "Conteggio per Prodotto", descTemplate: "Identifica i prodotti più venduti contando quante volte ciascun prodotto appare negli ordini.", queryTemplate: "SELECT prodotto_id, COUNT(*) FROM ordini GROUP BY prodotto_id", hints: ["Conta le occorrenze di ogni prodotto_id nella tabella ordini."], explanation: "Restituisce il numero di volte che ogni prodotto è stato ordinato.", replacements: {} },
            { titleTemplate: "Conteggio per Utente Recensioni", descTemplate: "Vogliamo premiare i recensori più attivi. Conta quante recensioni ha scritto ogni utente.", queryTemplate: "SELECT utente_id, COUNT(*) FROM recensioni GROUP BY utente_id", hints: ["Lavora sulla tabella recensioni.", "Raggruppa per utente_id."], explanation: "Conta il numero di recensioni lasciate da ciascun utente.", replacements: {} },
            { titleTemplate: "Somma Stock per Categoria", descTemplate: "Calcola la quantità totale di merce in magazzino per ogni categoria.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id", hints: ["Usa SUM(stock) con GROUP BY."], explanation: "Somma i valori della colonna stock per ogni gruppo di categoria.", replacements: {} },
            { titleTemplate: "Somma Prezzo per Categoria", descTemplate: "Per stimare il valore del catalogo, calcola la somma dei prezzi di tutti i prodotti per ogni categoria.", queryTemplate: "SELECT categoria_id, SUM(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Somma la colonna prezzo raggruppando per categoria."], explanation: "Calcola il totale dei prezzi dei prodotti in ogni categoria.", replacements: {} },
            { titleTemplate: "Somma Quantità per Utente", descTemplate: "Calcola il volume totale di articoli acquistati da ogni utente (somma delle quantità negli ordini).", queryTemplate: "SELECT utente_id, SUM(quantita) FROM ordini GROUP BY utente_id", hints: ["Usa SUM(quantita) sulla tabella ordini."], explanation: "Somma tutte le quantità ordinate da ciascun utente.", replacements: {} },
            { titleTemplate: "Somma Quantità per Prodotto", descTemplate: "Calcola il volume totale di vendita per ogni prodotto (somma delle quantità ordinate).", queryTemplate: "SELECT prodotto_id, SUM(quantita) FROM ordini GROUP BY prodotto_id", hints: ["Raggruppa per prodotto_id e somma le quantità."], explanation: "Indica quante unità totali di ogni prodotto sono state vendute.", replacements: {} },
            { titleTemplate: "Media Prezzo per Categoria", descTemplate: "Analizza il posizionamento di prezzo calcolando il prezzo medio dei prodotti per ogni categoria.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa AVG(prezzo) con GROUP BY."], explanation: "Calcola il prezzo medio all'interno di ogni categoria.", replacements: {} },
            { titleTemplate: "Media Stock per Categoria", descTemplate: "Calcola la giacenza media dei prodotti per ogni categoria.", queryTemplate: "SELECT categoria_id, AVG(stock) FROM prodotti GROUP BY categoria_id", hints: ["Media dello stock raggruppata per categoria."], explanation: "Indica lo stock medio disponibile per i prodotti di ogni categoria.", replacements: {} },
            { titleTemplate: "Media Prezzo per Fornitore", descTemplate: "Confronta i fornitori calcolando il prezzo medio dei prodotti che ci forniscono.", queryTemplate: "SELECT fornitore_id, AVG(prezzo) FROM prodotti GROUP BY fornitore_id", hints: ["Raggruppa per fornitore_id."], explanation: "Mostra il livello di prezzo medio di ciascun fornitore.", replacements: {} },
            { titleTemplate: "Media Quantità per Utente", descTemplate: "Analizza le abitudini di acquisto calcolando la quantità media di articoli per ordine di ogni utente.", queryTemplate: "SELECT utente_id, AVG(quantita) FROM ordini GROUP BY utente_id", hints: ["AVG(quantita) raggruppato per utente."], explanation: "Indica se un utente tende a fare ordini grandi o piccoli in media.", replacements: {} },
            { titleTemplate: "Massimo Prezzo per Categoria", descTemplate: "Trova il prodotto più costoso (prezzo massimo) per ogni categoria.", queryTemplate: "SELECT categoria_id, MAX(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa MAX(prezzo) con GROUP BY."], explanation: "Restituisce il prezzo più alto trovato in ogni categoria.", replacements: {} },
            { titleTemplate: "Minimo Prezzo per Categoria", descTemplate: "Trova il prodotto più economico (prezzo minimo) per ogni categoria.", queryTemplate: "SELECT categoria_id, MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa MIN(prezzo) con GROUP BY."], explanation: "Restituisce il prezzo più basso trovato in ogni categoria.", replacements: {} },
            { titleTemplate: "Massimo Stock per Categoria", descTemplate: "Identifica il prodotto con la maggiore disponibilità (stock massimo) in ogni categoria.", queryTemplate: "SELECT categoria_id, MAX(stock) FROM prodotti GROUP BY categoria_id", hints: ["MAX(stock) raggruppato per categoria."], explanation: "Trova il valore massimo di stock per ogni gruppo.", replacements: {} },
            { titleTemplate: "Minimo Stock per Categoria", descTemplate: "Identifica il prodotto con la minore disponibilità (stock minimo) in ogni categoria.", queryTemplate: "SELECT categoria_id, MIN(stock) FROM prodotti GROUP BY categoria_id", hints: ["MIN(stock) raggruppato per categoria."], explanation: "Trova il valore minimo di stock per ogni gruppo.", replacements: {} },
            { titleTemplate: "Massimo Voto per Prodotto", descTemplate: "Trova il voto più alto ricevuto da ogni prodotto nelle recensioni.", queryTemplate: "SELECT prodotto_id, MAX(voto) FROM recensioni GROUP BY prodotto_id", hints: ["MAX(voto) sulla tabella recensioni."], explanation: "Mostra il voto migliore ottenuto da ciascun prodotto.", replacements: {} },
            { titleTemplate: "Minimo Voto per Prodotto", descTemplate: "Trova il voto più basso ricevuto da ogni prodotto nelle recensioni.", queryTemplate: "SELECT prodotto_id, MIN(voto) FROM recensioni GROUP BY prodotto_id", hints: ["MIN(voto) sulla tabella recensioni."], explanation: "Mostra il voto peggiore ottenuto da ciascun prodotto.", replacements: {} },
            { titleTemplate: "Conteggio e Somma", descTemplate: "Ottieni una panoramica delle categorie: conta i prodotti e calcola lo stock totale per ognuna.", queryTemplate: "SELECT categoria_id, COUNT(*), SUM(stock) FROM prodotti GROUP BY categoria_id", hints: ["Puoi usare più funzioni di aggregazione nella stessa SELECT.", "SELECT categoria_id, COUNT(*), SUM(stock) ..."], explanation: "Restituisce sia il numero di prodotti che la somma dello stock per ogni categoria.", replacements: {} },
            { titleTemplate: "Conteggio e Media", descTemplate: "Analizza le categorie contando i prodotti e calcolando il loro prezzo medio.", queryTemplate: "SELECT categoria_id, COUNT(*), AVG(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) e AVG(prezzo)."], explanation: "Combina conteggio e media per ogni gruppo.", replacements: {} },
            { titleTemplate: "Somma e Media", descTemplate: "Per ogni categoria, calcola sia lo stock totale che lo stock medio.", queryTemplate: "SELECT categoria_id, SUM(stock), AVG(stock) FROM prodotti GROUP BY categoria_id", hints: ["Usa SUM(stock) e AVG(stock)."], explanation: "Confronta il totale e la media dello stock per categoria.", replacements: {} },
            { titleTemplate: "Massimo e Minimo", descTemplate: "Mostra il range di prezzi per ogni categoria trovando il prezzo massimo e minimo.", queryTemplate: "SELECT categoria_id, MAX(prezzo), MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa MAX(prezzo) e MIN(prezzo)."], explanation: "Identifica gli estremi di prezzo per ogni categoria.", replacements: {} },
            { titleTemplate: "Conteggio e Massimo", descTemplate: "Per ogni categoria, conta i prodotti e trova il prezzo del più costoso.", queryTemplate: "SELECT categoria_id, COUNT(*), MAX(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) e MAX(prezzo)."], explanation: "Mostra quanti prodotti ci sono e qual è il prezzo più alto.", replacements: {} },
            { titleTemplate: "Conteggio e Minimo", descTemplate: "Per ogni categoria, conta i prodotti e trova il prezzo del più economico.", queryTemplate: "SELECT categoria_id, COUNT(*), MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) e MIN(prezzo)."], explanation: "Mostra quanti prodotti ci sono e qual è il prezzo più basso.", replacements: {} },
            { titleTemplate: "Funzioni Multiple GROUP BY", descTemplate: "Esegui un'analisi completa per categoria: conteggio prodotti, somma prezzi, media prezzi, prezzo massimo e minimo.", queryTemplate: "SELECT categoria_id, COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Elenca tutte le funzioni di aggregazione richieste separate da virgola."], explanation: "Esempio di utilizzo di tutte le principali funzioni di aggregazione in una sola query.", replacements: {} },
            { titleTemplate: "GROUP BY con Alias", descTemplate: "Conta i prodotti per categoria e assegna alla colonna del conteggio l'alias 'Numero_Prodotti' per maggiore chiarezza.", queryTemplate: "SELECT categoria_id, COUNT(*) AS Numero_Prodotti FROM prodotti GROUP BY categoria_id", hints: ["Usa AS dopo la funzione di aggregazione.", "COUNT(*) AS Numero_Prodotti"], explanation: "Gli alias rendono i risultati delle aggregazioni più leggibili.", replacements: {} },
            // NEW EXERCISES FOR AGGREGATION MEDIUM
            { titleTemplate: "Totale Valore per Categoria", descTemplate: "Calcola il valore economico totale del magazzino (prezzo * stock) per ogni categoria.", queryTemplate: "SELECT categoria_id, SUM(prezzo * stock) FROM prodotti GROUP BY categoria_id", hints: ["Puoi aggregare il risultato di un'espressione: SUM(prezzo * stock)."], explanation: "Calcola prima il valore per ogni riga, poi somma i risultati per gruppo.", replacements: {} },
            { titleTemplate: "Ordini per Anno", descTemplate: "Analizza l'andamento delle vendite contando il numero di ordini per ogni anno.", queryTemplate: "SELECT YEAR(data_ordine), COUNT(*) FROM ordini GROUP BY YEAR(data_ordine)", hints: ["Raggruppa per YEAR(data_ordine)."], explanation: "Estrae l'anno dalla data e raggruppa per quel valore.", replacements: {} },
            { titleTemplate: "Ordini per Mese", descTemplate: "Analizza la stagionalità delle vendite contando gli ordini per mese (indipendentemente dall'anno).", queryTemplate: "SELECT MONTH(data_ordine), COUNT(*) FROM ordini GROUP BY MONTH(data_ordine)", hints: ["Raggruppa per MONTH(data_ordine)."], explanation: "Utile per vedere in quali mesi si vende di più, a prescindere dall'anno.", replacements: {} },
            { titleTemplate: "Spedizioni per Corriere", descTemplate: "Valuta il carico di lavoro dei partner logistici contando le spedizioni gestite da ogni corriere.", queryTemplate: "SELECT corriere, COUNT(*) FROM spedizioni GROUP BY corriere", hints: ["Raggruppa per la colonna 'corriere'."], explanation: "Mostra il volume di spedizioni per ciascun corriere.", replacements: {} },
            { titleTemplate: "Media Voto per Utente", descTemplate: "Analizza il comportamento dei recensori calcolando il voto medio assegnato da ciascun utente.", queryTemplate: "SELECT utente_id, AVG(voto) FROM recensioni GROUP BY utente_id", hints: ["AVG(voto) raggruppato per utente_id."], explanation: "Identifica gli utenti che tendono a dare voti alti o bassi.", replacements: {} },
            { titleTemplate: "Max Quantità per Utente", descTemplate: "Trova il picco di acquisto (quantità massima in un singolo ordine) per ogni utente.", queryTemplate: "SELECT utente_id, MAX(quantita) FROM ordini GROUP BY utente_id", hints: ["MAX(quantita) raggruppato per utente_id."], explanation: "Mostra l'ordine più grande fatto da ciascun utente.", replacements: {} },
            { titleTemplate: "Min Stock per Fornitore", descTemplate: "Identifica il livello critico di scorte per ogni fornitore trovando lo stock minimo tra i suoi prodotti.", queryTemplate: "SELECT fornitore_id, MIN(stock) FROM prodotti GROUP BY fornitore_id", hints: ["MIN(stock) raggruppato per fornitore_id."], explanation: "Aiuta a capire se ci sono prodotti vicini all'esaurimento per un dato fornitore.", replacements: {} },
            { titleTemplate: "Conteggio Prodotti per Prezzo", descTemplate: "Analizza la distribuzione dei prezzi contando quanti prodotti hanno lo stesso prezzo.", queryTemplate: "SELECT prezzo, COUNT(*) FROM prodotti GROUP BY prezzo", hints: ["Raggruppa per 'prezzo' e conta."], explanation: "Mostra quanti prodotti esistono per ogni fascia di prezzo (esatta).", replacements: {} },
            { titleTemplate: "Conteggio Utenti per Premium", descTemplate: "Segmenta la base utenti contando quanti sono abbonati Premium e quanti no.", queryTemplate: "SELECT premium, COUNT(*) FROM utenti GROUP BY premium", hints: ["Raggruppa per la colonna booleana 'premium'."], explanation: "Divide gli utenti in due gruppi (Premium e non) e li conta.", replacements: {} },
            { titleTemplate: "Somma Quantità per Anno", descTemplate: "Calcola il volume totale di articoli venduti per ogni anno.", queryTemplate: "SELECT YEAR(data_ordine), SUM(quantita) FROM ordini GROUP BY YEAR(data_ordine)", hints: ["SUM(quantita) raggruppato per anno."], explanation: "Mostra la quantità totale di merce movimentata anno per anno.", replacements: {} },
            { titleTemplate: "Media Giorni Consegna per Corriere", descTemplate: "Valuta l'efficienza dei corrieri calcolando la media dei giorni impiegati per la consegna.", queryTemplate: "SELECT corriere, AVG(DATEDIFF(day, data_ordine, data_spedizione)) FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id GROUP BY corriere", hints: ["Richiede JOIN tra spedizioni e ordini.", "Usa AVG(DATEDIFF(...))."], explanation: "Calcola il tempo medio trascorso tra l'ordine e la spedizione per ogni corriere.", replacements: {} },
            { titleTemplate: "Totale Recensioni per Voto", descTemplate: "Analizza la soddisfazione clienti contando quante recensioni ci sono per ogni livello di voto (1-5).", queryTemplate: "SELECT voto, COUNT(*) FROM recensioni GROUP BY voto", hints: ["Raggruppa per 'voto'."], explanation: "Mostra la distribuzione dei voti (es. quante 5 stelle, quante 4 stelle, ecc.).", replacements: {} },
            { titleTemplate: "Prezzo Medio per Nazione Fornitore", descTemplate: "Confronta i costi medi dei prodotti in base alla nazione del fornitore.", queryTemplate: "SELECT fornitori.nazione, AVG(prodotti.prezzo) FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id GROUP BY fornitori.nazione", hints: ["Richiede JOIN tra prodotti e fornitori.", "Raggruppa per fornitori.nazione."], explanation: "Calcola il prezzo medio dei prodotti raggruppati per la nazione di provenienza.", replacements: {} },
            { titleTemplate: "Stock Totale per Nazione Fornitore", descTemplate: "Analizza la distribuzione geografica delle scorte in base alla nazione del fornitore.", queryTemplate: "SELECT fornitori.nazione, SUM(prodotti.stock) FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id GROUP BY fornitori.nazione", hints: ["Richiede JOIN tra prodotti e fornitori.", "Usa SUM(stock)."], explanation: "Mostra quanto stock proviene da ciascuna nazione.", replacements: {} },
            { titleTemplate: "Conteggio Prodotti per Nazione", descTemplate: "Conta quanti prodotti provengono da fornitori di ciascuna nazione.", queryTemplate: "SELECT fornitori.nazione, COUNT(*) FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id GROUP BY fornitori.nazione", hints: ["Richiede JOIN tra prodotti e fornitori.", "Usa COUNT(*)."], explanation: "Mostra la varietà dell'assortimento per nazione di provenienza.", replacements: {} }
        ],
        [Difficulty.Hard]: [
            { 
                titleTemplate: "Filtro Having (Stock > {val})", 
                descTemplate: "Il responsabile logistica vuole identificare le categorie con un'alta disponibilità. Mostra le categorie che hanno un totale di stock superiore a {val}.", 
                queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) > {val}", 
                brokenCode: "SELECT categoria_id, SUM(stock) FROM prodotti WHERE SUM(stock) > {val} GROUP BY categoria_id",
                debugHint: "Ricorda: WHERE filtra le righe PRIMA del raggruppamento. Per filtrare i risultati aggregati (come SUM), serve una clausola diversa. Quale?",
                hints: ["Usa HAVING dopo GROUP BY per filtrare i gruppi.", "Sintassi: GROUP BY colonna HAVING condizione_aggregata"], 
                explanation: "HAVING filtra i risultati dopo l'aggregazione, mentre WHERE filtra le righe prima.", 
                replacements: { val: DATA.stock_thresholds } 
            },
            { 
                titleTemplate: "Clienti Top ({val} Ordini)", 
                descTemplate: "Il team marketing vuole premiare i clienti fedeli. Trova gli utenti che hanno effettuato più di {val} ordini.", 
                queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id HAVING COUNT(*) > {val}", 
                brokenCode: "SELECT utente_id, COUNT(*) FROM ordini WHERE COUNT(*) > {val} GROUP BY utente_id",
                debugHint: "Non puoi usare COUNT(*) nella clausola WHERE. Le funzioni di aggregazione vanno filtrate con un'altra keyword. Quale?",
                hints: ["Raggruppa per utente e usa HAVING COUNT(*) > {val}.", "WHERE non accetta funzioni aggregate", "HAVING è la keyword corretta per filtrare i gruppi"], 
                explanation: "Seleziona solo gli utenti il cui conteggio ordini supera la soglia.", 
                replacements: { val: [1, 2, 3, 4, 5] } 
            },
            { 
                titleTemplate: "Media Prezzo per Fornitore", 
                descTemplate: "Analizza i costi dei fornitori. Calcola il prezzo medio dei prodotti per ogni fornitore, ma mostra solo quelli con una media superiore a 50.", 
                queryTemplate: "SELECT fornitore_id, AVG(prezzo) FROM prodotti GROUP BY fornitore_id HAVING AVG(prezzo) > 50", 
                brokenCode: "SELECT fornitore_id, AVG(prezzo) FROM prodotti WHERE AVG(prezzo) > 50 GROUP BY fornitore_id",
                debugHint: "WHERE non può contenere AVG() o altre funzioni aggregate. Quale clausola devi usare per filtrare i calcoli aggregati?",
                hints: ["Usa HAVING AVG(prezzo) > 50.", "HAVING va dopo GROUP BY", "WHERE filtra le righe, HAVING filtra i gruppi"], 
                explanation: "Filtra i fornitori basandosi sul valore aggregato (media prezzo).", 
                replacements: {} 
            },
            { titleTemplate: "HAVING COUNT > {val}", descTemplate: "Identifica le categorie più popolate. Trova le categorie che contengono più di {val} prodotti.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val}", hints: ["HAVING COUNT(*) > {val}"], explanation: "Mostra solo le categorie con un numero di prodotti superiore alla soglia.", replacements: { val: [2, 3, 5, 10] } },
            { titleTemplate: "HAVING SUM > {val}", descTemplate: "Trova le categorie con una giacenza totale significativa. Mostra quelle con una somma di stock superiore a {val}.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) > {val}", hints: ["HAVING SUM(stock) > {val}"], explanation: "Filtra le categorie in base alla somma totale dello stock.", replacements: { val: [50, 100, 150, 200] } },
            { titleTemplate: "HAVING AVG > {val}", descTemplate: "Individua le categorie di fascia alta. Trova quelle con un prezzo medio dei prodotti superiore a {val}.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > {val}", hints: ["HAVING AVG(prezzo) > {val}"], explanation: "Filtra le categorie in base al prezzo medio.", replacements: { val: [50, 100, 150, 200] } },
            { titleTemplate: "HAVING MAX > {val}", descTemplate: "Trova le categorie che contengono almeno un prodotto molto costoso (prezzo massimo superiore a {val}).", queryTemplate: "SELECT categoria_id, MAX(prezzo) FROM prodotti GROUP BY categoria_id HAVING MAX(prezzo) > {val}", hints: ["HAVING MAX(prezzo) > {val}"], explanation: "Seleziona le categorie dove il prodotto più caro supera la soglia.", replacements: { val: [100, 150, 200, 250] } },
            { titleTemplate: "HAVING MIN < {val}", descTemplate: "Trova le categorie che offrono opzioni economiche. Mostra quelle con un prezzo minimo inferiore a {val}.", queryTemplate: "SELECT categoria_id, MIN(prezzo) FROM prodotti GROUP BY categoria_id HAVING MIN(prezzo) < {val}", hints: ["HAVING MIN(prezzo) < {val}"], explanation: "Seleziona le categorie dove il prodotto più economico è sotto la soglia.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING COUNT >= {val}", descTemplate: "Filtra gli utenti attivi. Trova chi ha effettuato almeno {val} ordini.", queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id HAVING COUNT(*) >= {val}", hints: ["HAVING COUNT(*) >= {val}"], explanation: "Filtra gli utenti con un numero di ordini maggiore o uguale a {val}.", replacements: { val: [2, 3, 5] } },
            { titleTemplate: "HAVING SUM >= {val}", descTemplate: "Identifica gli utenti che acquistano grandi volumi. Trova chi ha ordinato una quantità totale di articoli >= {val}.", queryTemplate: "SELECT utente_id, SUM(quantita) FROM ordini GROUP BY utente_id HAVING SUM(quantita) >= {val}", hints: ["HAVING SUM(quantita) >= {val}"], explanation: "Filtra gli utenti in base alla somma delle quantità ordinate.", replacements: { val: [10, 20, 30, 50] } },
            { titleTemplate: "HAVING AVG >= {val}", descTemplate: "Trova i prodotti molto apprezzati. Mostra quelli con un voto medio nelle recensioni >= {val}.", queryTemplate: "SELECT prodotto_id, AVG(voto) FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) >= {val}", hints: ["HAVING AVG(voto) >= {val}"], explanation: "Filtra i prodotti con recensioni mediamente positive.", replacements: { val: [3, 4, 5] } },
            { titleTemplate: "HAVING COUNT < {val}", descTemplate: "Trova le categorie poco popolate (meno di {val} prodotti).", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) < {val}", hints: ["HAVING COUNT(*) < {val}"], explanation: "Filtra le categorie con pochi prodotti.", replacements: { val: [5, 10, 15] } },
            { titleTemplate: "HAVING SUM < {val}", descTemplate: "Trova le categorie con scorte limitate (somma stock < {val}).", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) < {val}", hints: ["HAVING SUM(stock) < {val}"], explanation: "Filtra le categorie con poco stock totale.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING AVG < {val}", descTemplate: "Trova le categorie economiche (prezzo medio < {val}).", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) < {val}", hints: ["HAVING AVG(prezzo) < {val}"], explanation: "Filtra le categorie con prezzi medi bassi.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING COUNT BETWEEN", descTemplate: "Trova le categorie con un numero di prodotti compreso tra {min} e {max}.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) BETWEEN {min} AND {max}", hints: ["HAVING COUNT(*) BETWEEN {min} AND {max}"], explanation: "Filtra i gruppi basandosi su un range di conteggio.", replacements: { min: [2, 5], max: [10, 20] } },
            { titleTemplate: "HAVING SUM BETWEEN", descTemplate: "Trova le categorie con uno stock totale compreso tra {min} e {max}.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) BETWEEN {min} AND {max}", hints: ["HAVING SUM(stock) BETWEEN {min} AND {max}"], explanation: "Filtra i gruppi basandosi su un range di somma.", replacements: { min: [50, 100], max: [200, 300] } },
            { titleTemplate: "HAVING AVG BETWEEN", descTemplate: "Trova le categorie con un prezzo medio compreso tra {min} e {max}.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) BETWEEN {min} AND {max}", hints: ["HAVING AVG(prezzo) BETWEEN {min} AND {max}"], explanation: "Filtra i gruppi basandosi su un range di media.", replacements: { min: [50, 100], max: [150, 200] } },
            { titleTemplate: "HAVING con OR", descTemplate: "Filtra le categorie che soddisfano almeno una condizione: più di {val1} prodotti OPPURE stock totale > {val2}.", queryTemplate: "SELECT categoria_id, COUNT(*), SUM(stock) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val1} OR SUM(stock) > {val2}", hints: ["Usa OR tra le condizioni HAVING.", "HAVING COUNT(*) > {val1} OR SUM(stock) > {val2}"], explanation: "HAVING supporta operatori logici come OR e AND.", replacements: { val1: [2, 3], val2: [50, 100] } },
            // NEW EXERCISES FOR AGGREGATION HARD
            { titleTemplate: "Fornitori con Media Prezzo > 100", descTemplate: "Identifica i fornitori di lusso. Trova quelli con un prezzo medio dei prodotti superiore a 100.", queryTemplate: "SELECT fornitore_id, AVG(prezzo) FROM prodotti GROUP BY fornitore_id HAVING AVG(prezzo) > 100", hints: ["HAVING AVG(prezzo) > 100"], explanation: "Filtra i fornitori con prodotti mediamente costosi.", replacements: {} },
            { titleTemplate: "Categorie con Stock Basso (< 50)", descTemplate: "Segnala le categorie a rischio esaurimento. Trova quelle con uno stock totale inferiore a 50.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) < 50", hints: ["HAVING SUM(stock) < 50"], explanation: "Identifica categorie con bassa disponibilità di merce.", replacements: {} },
            { titleTemplate: "Utenti con Spesa Totale > 1000 (Simulato)", descTemplate: "Trova i 'Top Spenders' che hanno ordinato una quantità totale di articoli superiore a 1000.", queryTemplate: "SELECT utente_id, SUM(quantita) FROM ordini GROUP BY utente_id HAVING SUM(quantita) > 1000", hints: ["HAVING SUM(quantita) > 1000"], explanation: "Identifica i clienti con il maggior volume di acquisti.", replacements: {} },
            { titleTemplate: "Prodotti con Molte Recensioni (> 5)", descTemplate: "Identifica i prodotti più discussi. Trova quelli con più di 5 recensioni.", queryTemplate: "SELECT prodotto_id, COUNT(*) FROM recensioni GROUP BY prodotto_id HAVING COUNT(*) > 5", hints: ["HAVING COUNT(*) > 5"], explanation: "Filtra i prodotti con un alto numero di feedback.", replacements: {} },
            { titleTemplate: "Prodotti con Voto Medio Basso (< 3)", descTemplate: "Individua i prodotti con problemi di qualità. Trova quelli con una media voto inferiore a 3.", queryTemplate: "SELECT prodotto_id, AVG(voto) FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) < 3", hints: ["HAVING AVG(voto) < 3"], explanation: "Filtra i prodotti con recensioni negative.", replacements: {} },
            { titleTemplate: "Anni con Molti Ordini (> 100)", descTemplate: "Trova gli anni di maggiore attività, dove sono stati registrati più di 100 ordini.", queryTemplate: "SELECT YEAR(data_ordine), COUNT(*) FROM ordini GROUP BY YEAR(data_ordine) HAVING COUNT(*) > 100", hints: ["GROUP BY YEAR... HAVING COUNT > 100"], explanation: "Identifica gli anni con volume di ordini elevato.", replacements: {} },
            { titleTemplate: "Corrieri Molto Attivi (> 50 Spedizioni)", descTemplate: "Identifica i corrieri principali che hanno gestito più di 50 spedizioni.", queryTemplate: "SELECT corriere, COUNT(*) FROM spedizioni GROUP BY corriere HAVING COUNT(*) > 50", hints: ["HAVING COUNT(*) > 50"], explanation: "Filtra i corrieri con un alto volume di spedizioni.", replacements: {} },
            { titleTemplate: "Categorie con Prezzo Max > 500", descTemplate: "Trova le categorie che includono prodotti di punta (prezzo > 500).", queryTemplate: "SELECT categoria_id, MAX(prezzo) FROM prodotti GROUP BY categoria_id HAVING MAX(prezzo) > 500", hints: ["HAVING MAX(prezzo) > 500"], explanation: "Identifica categorie che contengono articoli costosi.", replacements: {} },
            { titleTemplate: "Fornitori con Stock Minimo > 10", descTemplate: "Trova i fornitori affidabili che garantiscono sempre una disponibilità minima superiore a 10 pezzi per ogni prodotto.", queryTemplate: "SELECT fornitore_id, MIN(stock) FROM prodotti GROUP BY fornitore_id HAVING MIN(stock) > 10", hints: ["HAVING MIN(stock) > 10"], explanation: "Seleziona fornitori dove nessun prodotto ha stock <= 10.", replacements: {} },
            { titleTemplate: "Utenti con Media Voti Severa (< 2)", descTemplate: "Identifica i critici più severi: utenti che danno voti mediamente inferiori a 2.", queryTemplate: "SELECT utente_id, AVG(voto) FROM recensioni GROUP BY utente_id HAVING AVG(voto) < 2", hints: ["HAVING AVG(voto) < 2"], explanation: "Filtra gli utenti con una media voti molto bassa.", replacements: {} },
            { titleTemplate: "Utenti con Media Voti Generosa (> 4)", descTemplate: "Identifica i clienti entusiasti: utenti che danno voti mediamente superiori a 4.", queryTemplate: "SELECT utente_id, AVG(voto) FROM recensioni GROUP BY utente_id HAVING AVG(voto) > 4", hints: ["HAVING AVG(voto) > 4"], explanation: "Filtra gli utenti con una media voti molto alta.", replacements: {} },
            { titleTemplate: "Categorie con Range Prezzi Ampio (> 100)", descTemplate: "Trova le categorie con grande varietà di prezzo (differenza tra Max e Min > 100).", queryTemplate: "SELECT categoria_id, MAX(prezzo) - MIN(prezzo) as Delta FROM prodotti GROUP BY categoria_id HAVING (MAX(prezzo) - MIN(prezzo)) > 100", hints: ["HAVING (MAX(prezzo) - MIN(prezzo)) > 100"], explanation: "Filtra categorie con un ampio divario tra il prodotto più economico e quello più costoso.", replacements: {} },
            { titleTemplate: "Nazioni con Molti Fornitori (> 2)", descTemplate: "Identifica i paesi chiave per l'approvvigionamento (più di 2 fornitori).", queryTemplate: "SELECT nazione, COUNT(*) FROM fornitori GROUP BY nazione HAVING COUNT(*) > 2", hints: ["HAVING COUNT(*) > 2"], explanation: "Mostra le nazioni che ospitano un numero significativo di fornitori.", replacements: {} },
            { titleTemplate: "Mesi con Pochi Ordini (< 10)", descTemplate: "Individua i mesi di bassa stagione (meno di 10 ordini).", queryTemplate: "SELECT MONTH(data_ordine), COUNT(*) FROM ordini GROUP BY MONTH(data_ordine) HAVING COUNT(*) < 10", hints: ["HAVING COUNT(*) < 10"], explanation: "Identifica i mesi con scarsa attività di vendita.", replacements: {} },
            { titleTemplate: "Utenti con Unico Ordine", descTemplate: "Trova i clienti occasionali che hanno effettuato esattamente un solo ordine.", queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id HAVING COUNT(*) = 1", hints: ["HAVING COUNT(*) = 1"], explanation: "Filtra gli utenti che hanno acquistato una sola volta.", replacements: {} },
            { titleTemplate: "Prodotti con Voto Unanime (Min=Max)", descTemplate: "Trova i prodotti con consenso totale (tutti i voti uguali) e almeno 2 recensioni.", queryTemplate: "SELECT prodotto_id, MIN(voto), MAX(voto) FROM recensioni GROUP BY prodotto_id HAVING MIN(voto) = MAX(voto) AND COUNT(*) >= 2", hints: ["HAVING MIN(voto) = MAX(voto) AND COUNT(*) >= 2"], explanation: "Se min e max sono uguali, tutti i voti sono identici.", replacements: {} },
            { titleTemplate: "HAVING COUNT e AVG", descTemplate: "Filtra i prodotti popolari e apprezzati: più di {val1} recensioni E voto medio >= {val2}.", queryTemplate: "SELECT prodotto_id, COUNT(*), AVG(voto) FROM recensioni GROUP BY prodotto_id HAVING COUNT(*) > {val1} AND AVG(voto) >= {val2}", hints: ["Usa AND per combinare le condizioni.", "HAVING COUNT(*) > {val1} AND AVG(voto) >= {val2}"], explanation: "Combina criteri di quantità (COUNT) e qualità (AVG).", replacements: { val1: [1, 2], val2: [3, 4] } },
            { titleTemplate: "HAVING con ORDER BY", descTemplate: "Trova le categorie con più di {val} prodotti e ordinale per numero di prodotti decrescente.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val} ORDER BY COUNT(*) DESC", hints: ["Usa ORDER BY dopo HAVING.", "ORDER BY COUNT(*) DESC"], explanation: "Filtra i gruppi e poi ordina i risultati rimasti.", replacements: { val: [2, 3, 5] } },
            { titleTemplate: "HAVING con ORDER BY AVG", descTemplate: "Trova le categorie con prezzo medio > {val} e ordinale per prezzo medio decrescente.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > {val} ORDER BY AVG(prezzo) DESC", hints: ["ORDER BY AVG(prezzo) DESC"], explanation: "Filtra per media prezzo e ordina dal più caro al più economico.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING con LIMIT", descTemplate: "Trova le top 5 categorie per numero di prodotti (con più di {val} prodotti).", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val} ORDER BY COUNT(*) DESC LIMIT 5", hints: ["Usa LIMIT 5 alla fine della query."], explanation: "Filtra, ordina e limita il numero di risultati.", replacements: { val: [2, 3, 5] } },
            { titleTemplate: "HAVING Complesso Finale", descTemplate: "Esegui un'analisi avanzata: categorie con più di {val1} prodotti E prezzo medio > {val2}, ordinate per prezzo medio decrescente, prime 5.", queryTemplate: "SELECT categoria_id, COUNT(*), AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val1} AND AVG(prezzo) > {val2} ORDER BY AVG(prezzo) DESC LIMIT 5", hints: ["Combina AND, ORDER BY e LIMIT."], explanation: "Query complessa che combina filtri multipli su aggregati, ordinamento e limitazione.", replacements: { val1: [2, 3], val2: [50, 100] } }
        ]
    },
    [TopicId.Case]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Simple Case", descTemplate: "Gestione inventario: crea un report che mostri 'Disponibile' se lo stock è > 0, altrimenti 'Esaurito'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", brokenCode: "SELECT nome, CSE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["Usa CASE WHEN condizione THEN valore ELSE valore END.", "Sintassi: CASE WHEN stock > 0 ..."], explanation: "CASE permette di creare logica condizionale direttamente nella query.", replacements: {} },
            { titleTemplate: "Case Stock Disponibile", descTemplate: "Report stato prodotti: visualizza il nome del prodotto e una colonna 'stato' che indica 'Disponibile' o 'Esaurito'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti", brokenCode: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' AS stato FROM prodotti", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["Usa AS per dare un nome alla colonna calcolata.", "CASE ... END AS stato"], explanation: "L'alias 'stato' rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Case Prezzo Alto", descTemplate: "Analisi prezzi: classifica i prodotti come 'Alto' se costano più di 100€, altrimenti 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 THEN 'Alto' ELSE 'Basso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo > 100 THAN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["Confronta la colonna prezzo con 100.", "CASE WHEN prezzo > 100 ..."], explanation: "Segmenta i prodotti in base a una soglia di prezzo.", replacements: {} },
            { titleTemplate: "Case Prezzo Medio", descTemplate: "Segmentazione prezzi: classifica i prodotti come 'Medio' se costano più di 50€, altrimenti 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 50 THEN 'Medio' ELSE 'Basso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo > 50 THEN 'Medio' 'Basso' END FROM prodotti", debugHint: "Manca la parola chiave ELSE.", hints: ["Soglia di prezzo a 50.", "CASE WHEN prezzo > 50 ..."], explanation: "Utile per filtrare visivamente prodotti sopra una certa fascia.", replacements: {} },
            { titleTemplate: "Case Voto Alto", descTemplate: "Analisi qualità: classifica le recensioni come 'Alto' se il voto è >= 4, altrimenti 'Basso'.", queryTemplate: "SELECT voto, CASE WHEN voto >= 4 THEN 'Alto' ELSE 'Basso' END FROM recensioni", brokenCode: "SELECT voto, CASE WEN voto >= 4 THEN 'Alto' ELSE 'Basso' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave WHEN.", hints: ["Usa l'operatore >= (maggiore o uguale).", "CASE WHEN voto >= 4 ..."], explanation: "Identifica le recensioni positive.", replacements: {} },
            { titleTemplate: "Case Voto Basso", descTemplate: "Monitoraggio qualità: segnala come 'Basso' i voti inferiori a 3, altrimenti 'Alto'.", queryTemplate: "SELECT voto, CASE WHEN voto < 3 THEN 'Basso' ELSE 'Alto' END FROM recensioni", brokenCode: "SELECT voto, WHEN voto < 3 THEN 'Basso' ELSE 'Alto' END FROM recensioni", debugHint: "Manca la parola chiave CASE all'inizio dell'espressione.", hints: ["Usa l'operatore < (minore).", "CASE WHEN voto < 3 ..."], explanation: "Identifica le recensioni negative o critiche.", replacements: {} },
            { titleTemplate: "Case Quantità", descTemplate: "Analisi ordini: etichetta come 'Grande' gli ordini con quantità > 5, altrimenti 'Piccola'.", queryTemplate: "SELECT quantita, CASE WHEN quantita > 5 THEN 'Grande' ELSE 'Piccola' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita > 5 THEN Grande ELSE Piccola END FROM ordini", debugHint: "Le stringhe devono essere racchiuse tra apici singoli.", hints: ["Confronta la quantità ordinata.", "CASE WHEN quantita > 5 ..."], explanation: "Distingue tra ordini voluminosi e ordini standard.", replacements: {} },
            { titleTemplate: "Case Premium", descTemplate: "Stato abbonamento: visualizza 'Premium' se l'utente ha l'abbonamento attivo (TRUE), altrimenti 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN premium = TRUE THEN 'Premium' ELSE 'Standard' END FROM utenti", brokenCode: "SELECT nome, CASE WHEN premium = TREU THEN 'Premium' ELSE 'Standard' END FROM utenti", debugHint: "Errore di battitura nel valore booleano TRUE.", hints: ["La colonna premium è booleana.", "CASE WHEN premium = TRUE ..."], explanation: "Traduce un valore booleano in un testo leggibile.", replacements: {} },
            { titleTemplate: "Case NULL Tracking", descTemplate: "Stato spedizioni: se il codice tracking è NULL mostra 'In Attesa', altrimenti 'Tracciata'.", queryTemplate: "SELECT CASE WHEN codice_tracking IS NULL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", brokenCode: "SELECT CASE WHEN codice_tracking IS NUL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", debugHint: "Errore di battitura nella parola chiave NULL.", hints: ["Usa IS NULL per verificare i valori mancanti.", "CASE WHEN codice_tracking IS NULL ..."], explanation: "Gestisce i valori NULL per fornire un output più chiaro.", replacements: {} },
            { titleTemplate: "Case Stock Zero", descTemplate: "Allerta scorte: segnala 'Esaurito' se lo stock è 0, altrimenti 'Disponibile'.", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' ELSE 'Disponibile' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN stock = 0 'Esaurito' ELSE 'Disponibile' END FROM prodotti", debugHint: "Manca la parola chiave THEN.", hints: ["Controlla l'uguaglianza con 0.", "CASE WHEN stock = 0 ..."], explanation: "Identifica immediatamente i prodotti non disponibili.", replacements: {} },
            { titleTemplate: "Case Prezzo Zero", descTemplate: "Prodotti omaggio: classifica come 'Gratis' se il prezzo è 0, altrimenti 'A Pagamento'.", queryTemplate: "SELECT nome, CASE WHEN prezzo = 0 THEN 'Gratis' ELSE 'A Pagamento' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo = 0 THEN 'Gratis' ELS 'A Pagamento' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave ELSE.", hints: ["CASE WHEN prezzo = 0 ..."], explanation: "Evidenzia i prodotti gratuiti.", replacements: {} },
            { titleTemplate: "Case Voto Cinque", descTemplate: "Eccellenza: evidenzia con 'Perfetto' i voti uguali a 5, altrimenti 'Normale'.", queryTemplate: "SELECT voto, CASE WHEN voto = 5 THEN 'Perfetto' ELSE 'Normale' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto = 5 THEN 'Perfetto' ELSE 'Normale' FROM recensioni", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN voto = 5 ..."], explanation: "Mette in risalto il punteggio massimo.", replacements: {} },
            { titleTemplate: "Case Quantità Uno", descTemplate: "Tipologia ordine: classifica come 'Singolo' se la quantità è 1, altrimenti 'Multiplo'.", queryTemplate: "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' ELSE 'Multiplo' END FROM ordini", brokenCode: "SELECT quantita, CSE WHEN quantita = 1 THEN 'Singolo' ELSE 'Multiplo' END FROM ordini", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN quantita = 1 ..."], explanation: "Distingue acquisti singoli da acquisti multipli.", replacements: {} },
            { titleTemplate: "Case Stock Maggiore", descTemplate: "Disponibilità elevata: se lo stock supera i 20 pezzi scrivi 'Abbondante', altrimenti 'Limitato'.", queryTemplate: "SELECT nome, CASE WHEN stock > 20 THEN 'Abbondante' ELSE 'Limitato' END FROM prodotti", brokenCode: "SELECT nome, CASE stock > 20 THEN 'Abbondante' ELSE 'Limitato' END FROM prodotti", debugHint: "Manca la parola chiave WHEN dopo CASE.", hints: ["CASE WHEN stock > 20 ..."], explanation: "Indica prodotti con ampia disponibilità.", replacements: {} },
            { titleTemplate: "Case Prezzo Minore", descTemplate: "Prodotti budget: se il prezzo è inferiore a 30€ scrivi 'Economico', altrimenti 'Normale'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 30 THEN 'Economico' ELSE 'Normale' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo < 30 'Economico' ELSE 'Normale' END FROM prodotti", debugHint: "Manca la parola chiave THEN.", hints: ["CASE WHEN prezzo < 30 ..."], explanation: "Identifica prodotti di fascia bassa.", replacements: {} },
            { titleTemplate: "Case Voto Maggiore", descTemplate: "Feedback positivo: se il voto è superiore a 3 scrivi 'Positivo', altrimenti 'Negativo'.", queryTemplate: "SELECT voto, CASE WHEN voto > 3 THEN 'Positivo' ELSE 'Negativo' END FROM recensioni", brokenCode: "SELETC voto, CASE WHEN voto > 3 THEN 'Positivo' ELSE 'Negativo' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["CASE WHEN voto > 3 ..."], explanation: "Separa le recensioni positive da quelle negative/neutre.", replacements: {} },
            { titleTemplate: "Case Quantità Maggiore", descTemplate: "Ordini voluminosi: se la quantità supera 10 scrivi 'Grande Ordine', altrimenti 'Piccolo Ordine'.", queryTemplate: "SELECT quantita, CASE WHEN quantita > 10 THEN 'Grande Ordine' ELSE 'Piccolo Ordine' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita > 10 THEN 'Grande Ordine' ELSE 'Piccolo Ordine' FROM ordini", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN quantita > 10 ..."], explanation: "Evidenzia ordini particolarmente grandi.", replacements: {} },
            { titleTemplate: "Case Stock Minore", descTemplate: "Scorte in esaurimento: se lo stock è inferiore a 10 scrivi 'Basso', altrimenti 'Sufficiente'.", queryTemplate: "SELECT nome, CASE WHEN stock < 10 THEN 'Basso' ELSE 'Sufficiente' END FROM prodotti", brokenCode: "SELECT nome, CAES WHEN stock < 10 THEN 'Basso' ELSE 'Sufficiente' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN stock < 10 ..."], explanation: "Allerta per riordino merce.", replacements: {} },
            { titleTemplate: "Case Prezzo Maggiore Uguale", descTemplate: "Fascia alta: se il prezzo è >= 100 scrivi 'Costoso', altrimenti 'Accessibile'.", queryTemplate: "SELECT nome, CASE WHEN prezzo >= 100 THEN 'Costoso' ELSE 'Accessibile' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo >= 100 'Costoso' ELSE 'Accessibile' END FROM prodotti", debugHint: "Manca la parola chiave THEN.", hints: ["CASE WHEN prezzo >= 100 ..."], explanation: "Segmentazione di prezzo inclusiva.", replacements: {} },
            { titleTemplate: "Case Voto Minore Uguale", descTemplate: "Feedback negativo: se il voto è <= 2 scrivi 'Basso', altrimenti 'Alto'.", queryTemplate: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' ELSE 'Alto' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' ELSI 'Alto' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave ELSE.", hints: ["CASE WHEN voto <= 2 ..."], explanation: "Identifica recensioni gravemente insufficienti.", replacements: {} },
            { titleTemplate: "Case Quantità Minore Uguale", descTemplate: "Piccoli acquisti: se la quantità è <= 3 scrivi 'Piccolo', altrimenti 'Grande'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' ELSE 'Grande' END FROM ordini", brokenCode: "SELECT quantita, WHEN quantita <= 3 THEN 'Piccolo' ELSE 'Grande' END FROM ordini", debugHint: "Manca la parola chiave CASE.", hints: ["CASE WHEN quantita <= 3 ..."], explanation: "Identifica ordini di piccola entità.", replacements: {} },
            { titleTemplate: "Case Stock Maggiore Uguale", descTemplate: "Stock sicuro: se lo stock è >= 50 scrivi 'Alto', altrimenti 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN stock >= 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHE stock >= 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave WHEN.", hints: ["CASE WHEN stock >= 50 ..."], explanation: "Conferma livelli di stock ottimali.", replacements: {} },
            { titleTemplate: "Case Prezzo Minore Uguale", descTemplate: "Fascia economica: se il prezzo è <= 50 scrivi 'Economico', altrimenti 'Costoso'.", queryTemplate: "SELECT nome, CASE WHEN prezzo <= 50 THEN 'Economico' ELSE 'Costoso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo <= 50 THEN 'Economico' ELSE 'Costoso' FROM prodotti", debugHint: "Manca la parola chiave END.", hints: ["CASE WHEN prezzo <= 50 ..."], explanation: "Identifica prodotti accessibili.", replacements: {} },
            { titleTemplate: "Case Voto Maggiore Uguale", descTemplate: "Alta soddisfazione: se il voto è >= 4 scrivi 'Eccellente', altrimenti 'Normale'.", queryTemplate: "SELECT voto, CASE WHEN voto >= 4 THEN 'Eccellente' ELSE 'Normale' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto >= 4 THE 'Eccellente' ELSE 'Normale' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["CASE WHEN voto >= 4 ..."], explanation: "Evidenzia feedback molto positivi.", replacements: {} },
            { titleTemplate: "Case Quantità Maggiore Uguale", descTemplate: "Ordini medi: se la quantità è >= 5 scrivi 'Media', altrimenti 'Piccola'.", queryTemplate: "SELECT quantita, CASE WHEN quantita >= 5 THEN 'Media' ELSE 'Piccola' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita >= 5 THEN 'Media' 'Piccola' END FROM ordini", debugHint: "Manca la parola chiave ELSE.", hints: ["CASE WHEN quantita >= 5 ..."], explanation: "Soglia per ordini di media grandezza.", replacements: {} },
            { titleTemplate: "Case Stock Minore Uguale", descTemplate: "Allerta critica: se lo stock è <= 5 scrivi 'Critico', altrimenti 'Normale'.", queryTemplate: "SELECT nome, CASE WHEN stock <= 5 THEN 'Critico' ELSE 'Normale' END FROM prodotti", brokenCode: "SELECT nome, CSE WHEN stock <= 5 THEN 'Critico' ELSE 'Normale' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN stock <= 5 ..."], explanation: "Segnala prodotti quasi esauriti.", replacements: {} },
            { titleTemplate: "Case Prezzo Non Zero", descTemplate: "Verifica prezzi: se il prezzo è diverso da 0 scrivi 'A Pagamento', altrimenti 'Gratis'.", queryTemplate: "SELECT nome, CASE WHEN prezzo <> 0 THEN 'A Pagamento' ELSE 'Gratis' END FROM prodotti", brokenCode: "SELECT nome, CASE prezzo <> 0 THEN 'A Pagamento' ELSE 'Gratis' END FROM prodotti", debugHint: "Manca la parola chiave WHEN.", hints: ["Usa l'operatore <> (diverso).", "CASE WHEN prezzo <> 0 ..."], explanation: "Verifica che il prezzo non sia nullo o zero.", replacements: {} },
            { titleTemplate: "Case Voto Non Cinque", descTemplate: "Margine miglioramento: se il voto non è 5 scrivi 'Migliorabile', altrimenti 'Perfetto'.", queryTemplate: "SELECT voto, CASE WHEN voto <> 5 THEN 'Migliorabile' ELSE 'Perfetto' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto <> 5 THEN 'Migliorabile' ELSE 'Perfetto' EN FROM recensioni", debugHint: "Errore di battitura nella parola chiave END.", hints: ["CASE WHEN voto <> 5 ..."], explanation: "Identifica tutto ciò che non è perfetto.", replacements: {} },
            { titleTemplate: "Case Quantità Non Uno", descTemplate: "Acquisti multipli: se la quantità non è 1 scrivi 'Multiplo', altrimenti 'Singolo'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <> 1 THEN 'Multiplo' ELSE 'Singolo' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita <> 1 THEN Multiplo ELSE Singolo END FROM ordini", debugHint: "Le stringhe devono essere racchiuse tra apici singoli.", hints: ["CASE WHEN quantita <> 1 ..."], explanation: "Filtra ordini con più di un pezzo.", replacements: {} },
            { titleTemplate: "Case Stock Non Zero", descTemplate: "Verifica disponibilità: se lo stock non è 0 scrivi 'Disponibile', altrimenti 'Esaurito'.", queryTemplate: "SELECT nome, CASE WHEN stock <> 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", brokenCode: "SELEC nome, CASE WHEN stock <> 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["CASE WHEN stock <> 0 ..."], explanation: "Conferma la presenza di merce a magazzino.", replacements: {} },
            // NEW EXERCISES FOR CASE EASY
            { titleTemplate: "Case Categoria Elettronica", descTemplate: "Categorizzazione: se l'ID categoria è 1 scrivi 'Elettronica', altrimenti 'Altro'.", queryTemplate: "SELECT nome, CASE WHEN categoria_id = 1 THEN 'Elettronica' ELSE 'Altro' END FROM prodotti", brokenCode: "SELECT nome, CSE WHEN categoria_id = 1 THEN 'Elettronica' ELSE 'Altro' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN categoria_id = 1 ..."], explanation: "Etichetta specifica per una categoria.", replacements: {} },
            { titleTemplate: "Case Fornitore Principale", descTemplate: "Analisi fornitori: se l'ID fornitore è 1 scrivi 'Principale', altrimenti 'Secondario'.", queryTemplate: "SELECT nome, CASE WHEN fornitore_id = 1 THEN 'Principale' ELSE 'Secondario' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN fornitore_id = 1 THEN 'Principale' ELSE 'Secondario' FROM prodotti", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN fornitore_id = 1 ..."], explanation: "Distingue il fornitore primario dagli altri.", replacements: {} },
            { titleTemplate: "Case Data Futura", descTemplate: "Controllo date: se la data ordine è successiva al '2024-01-01' scrivi 'Futuro', altrimenti 'Passato'.", queryTemplate: "SELECT id, CASE WHEN data_ordine > '2024-01-01' THEN 'Futuro' ELSE 'Passato' END FROM ordini", brokenCode: "SELECT id, CASE WHEN data_ordine > '2024-01-01' THAN 'Futuro' ELSE 'Passato' END FROM ordini", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["Confronta con una stringa data.", "CASE WHEN data_ordine > '2024-01-01' ..."], explanation: "Classificazione temporale basata su una data fissa.", replacements: {} },
            { titleTemplate: "Case Voto Sufficienza", descTemplate: "Valutazione minima: se il voto è >= 3 scrivi 'Sufficiente', altrimenti 'Insufficiente'.", queryTemplate: "SELECT voto, CASE WHEN voto >= 3 THEN 'Sufficiente' ELSE 'Insufficiente' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto >= 3 THEN 'Sufficiente' 'Insufficiente' END FROM recensioni", debugHint: "Manca la parola chiave ELSE.", hints: ["CASE WHEN voto >= 3 ..."], explanation: "Soglia di accettabilità.", replacements: {} },
            { titleTemplate: "Case Quantità Minima", descTemplate: "Controllo minimi: se la quantità è < 2 scrivi 'Minimo', altrimenti 'Standard'.", queryTemplate: "SELECT quantita, CASE WHEN quantita < 2 THEN 'Minimo' ELSE 'Standard' END FROM ordini", brokenCode: "SELECT quantita, CASE WEN quantita < 2 THEN 'Minimo' ELSE 'Standard' END FROM ordini", debugHint: "Errore di battitura nella parola chiave WHEN.", hints: ["CASE WHEN quantita < 2 ..."], explanation: "Identifica ordini sotto la soglia standard.", replacements: {} },
            { titleTemplate: "Case Nome Inizia con A", descTemplate: "Gruppi alfabetici: se il nome inizia con 'A' scrivi 'Gruppo A', altrimenti 'Altri'.", queryTemplate: "SELECT nome, CASE WHEN nome LIKE 'A%' THEN 'Gruppo A' ELSE 'Altri' END FROM utenti", brokenCode: "SELECT nome, WHEN nome LIKE 'A%' THEN 'Gruppo A' ELSE 'Altri' END FROM utenti", debugHint: "Manca la parola chiave CASE all'inizio dell'espressione.", hints: ["Usa LIKE 'A%'.", "CASE WHEN nome LIKE 'A%' ..."], explanation: "Raggruppamento basato sull'iniziale.", replacements: {} },
            { titleTemplate: "Case Email Gmail", descTemplate: "Provider email: se l'email contiene 'gmail' scrivi 'Google', altrimenti 'Altro'.", queryTemplate: "SELECT email, CASE WHEN email LIKE '%gmail%' THEN 'Google' ELSE 'Altro' END FROM utenti", brokenCode: "SELECT email, CASE WHEN email LIKE '%gmail%' THEN Google ELSE Altro END FROM utenti", debugHint: "Le stringhe devono essere racchiuse tra apici singoli.", hints: ["Usa LIKE '%gmail%'.", "CASE WHEN email LIKE '%gmail%' ..."], explanation: "Identifica il provider di posta elettronica.", replacements: {} },
            { titleTemplate: "Case Prezzo Pari", descTemplate: "Analisi numerica: se il prezzo è pari scrivi 'Pari', altrimenti 'Dispari'.", queryTemplate: "SELECT prezzo, CASE WHEN prezzo % 2 = 0 THEN 'Pari' ELSE 'Dispari' END FROM prodotti", brokenCode: "SELECT prezzo, CASE WHEN prezzo % 2 = 0 THEN 'Pari' ELSI 'Dispari' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave ELSE.", hints: ["Usa l'operatore modulo (%).", "CASE WHEN prezzo % 2 = 0 ..."], explanation: "Verifica la parità di un numero.", replacements: {} },
            { titleTemplate: "Case Stock Multiplo 10", descTemplate: "Confezionamento: se lo stock è multiplo di 10 scrivi 'Multiplo 10', altrimenti 'No'.", queryTemplate: "SELECT stock, CASE WHEN stock % 10 = 0 THEN 'Multiplo 10' ELSE 'No' END FROM prodotti", brokenCode: "SELECT stock, CASE WHEN stock % 10 = 0 THEN 'Multiplo 10' ELSE 'No' EN FROM prodotti", debugHint: "Errore di battitura nella parola chiave END.", hints: ["Usa stock % 10 = 0.", "CASE WHEN stock % 10 = 0 ..."], explanation: "Verifica divisibilità per 10.", replacements: {} },
            { titleTemplate: "Case Lunghezza Nome", descTemplate: "Lunghezza stringhe: se il nome ha più di 5 caratteri scrivi 'Lungo', altrimenti 'Corto'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 5 THEN 'Lungo' ELSE 'Corto' END FROM prodotti", brokenCode: "SELEC nome, CASE WHEN LENGTH(nome) > 5 THEN 'Lungo' ELSE 'Corto' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Usa la funzione LENGTH().", "CASE WHEN LENGTH(nome) > 5 ..."], explanation: "Logica basata sulla lunghezza del testo.", replacements: {} },
            { titleTemplate: "Case Mese Estivo", descTemplate: "Stagionalità: se il mese dell'ordine è Giugno, Luglio o Agosto (6,7,8) scrivi 'Estate', altrimenti 'Altro'.", queryTemplate: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (6,7,8) THEN 'Estate' ELSE 'Altro' END FROM ordini", brokenCode: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (6,7,8) 'Estate' ELSE 'Altro' END FROM ordini", debugHint: "Manca la parola chiave THEN.", hints: ["Usa MONTH() e IN.", "CASE WHEN MONTH(data_ordine) IN (6,7,8) ..."], explanation: "Raggruppa mesi specifici in una stagione.", replacements: {} },
            { titleTemplate: "Case Anno Corrente", descTemplate: "Filtro temporale: se l'anno dell'ordine è quello corrente scrivi 'Corrente', altrimenti 'Storico'.", queryTemplate: "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = YEAR(NOW()) THEN 'Corrente' ELSE 'Storico' END FROM ordini", brokenCode: "SELECT data_ordine, CAES WHEN YEAR(data_ordine) = YEAR(NOW()) THEN 'Corrente' ELSE 'Storico' END FROM ordini", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["Confronta YEAR(data_ordine) con YEAR(NOW())."], explanation: "Confronto dinamico con la data odierna.", replacements: {} },
            { titleTemplate: "Case Paese Italia", descTemplate: "Segmentazione geografica: se il paese è 'Italia' scrivi 'Nazionale', altrimenti 'Estero'.", queryTemplate: "SELECT paese, CASE WHEN paese = 'Italia' THEN 'Nazionale' ELSE 'Estero' END FROM utenti", brokenCode: "SELECT paese, CASE paese = 'Italia' THEN 'Nazionale' ELSE 'Estero' END FROM utenti", debugHint: "Manca la parola chiave WHEN.", hints: ["CASE WHEN paese = 'Italia' ..."], explanation: "Distingue il mercato domestico da quello estero.", replacements: {} },
            { titleTemplate: "Case Corriere DHL", descTemplate: "Logistica: se il corriere è 'DHL' scrivi 'Express', altrimenti 'Standard'.", queryTemplate: "SELECT corriere, CASE WHEN corriere = 'DHL' THEN 'Express' ELSE 'Standard' END FROM spedizioni", brokenCode: "SELECT corriere, CASE WHEN corriere = 'DHL' THE 'Express' ELSE 'Standard' END FROM spedizioni", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["CASE WHEN corriere = 'DHL' ..."], explanation: "Etichetta il servizio in base al corriere.", replacements: {} },
            { titleTemplate: "Case Voto Massimo", descTemplate: "Top rating: se il voto è 5 scrivi 'Top', altrimenti 'Non Top'.", queryTemplate: "SELECT voto, CASE WHEN voto = 5 THEN 'Top' ELSE 'Non Top' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto = 5 THEN 'Top' ELSE 'Non Top' FROM recensioni", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN voto = 5 ..."], explanation: "Identifica il massimo punteggio possibile.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Fasce di Prezzo", descTemplate: "Segmentazione prodotti: etichetta i prodotti come 'Economico' (< 50), 'Medio' (50-150), o 'Lusso' (> 150).", queryTemplate: "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END FROM prodotti", hints: ["Usa più clausole WHEN in sequenza.", "CASE WHEN ... WHEN ... ELSE ... END"], explanation: "Gestisce scenari con più di due possibili esiti.", replacements: {} },
            { titleTemplate: "Fasce di Stock", descTemplate: "Gestione magazzino: classifica lo stock in 'Esaurito' (= 0), 'Basso' (1-10), 'Medio' (11-30), o 'Alto' (> 30).", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 10 THEN 'Basso' WHEN stock <= 30 THEN 'Medio' ELSE 'Alto' END FROM prodotti", hints: ["Definisci le fasce in ordine crescente.", "CASE WHEN stock = 0 ... WHEN ..."], explanation: "Permette una classificazione granulare dello stato del magazzino.", replacements: {} },
            { titleTemplate: "Fasce di Voto", descTemplate: "Analisi sentiment: classifica i voti in 'Basso' (1-2), 'Medio' (3), o 'Alto' (4-5).", queryTemplate: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni", hints: ["Raggruppa i punteggi in categorie.", "CASE WHEN voto <= 2 ..."], explanation: "Semplifica l'analisi dei feedback raggruppandoli.", replacements: {} },
            { titleTemplate: "Fasce di Quantità", descTemplate: "Analisi ordini: classifica le quantità in 'Piccolo' (1-3), 'Medio' (4-7), o 'Grande' (> 7).", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END FROM ordini", hints: ["CASE WHEN quantita <= 3 ..."], explanation: "Segmenta gli ordini per dimensione.", replacements: {} },
            { titleTemplate: "Fasce Prezzo Quattro", descTemplate: "Segmentazione dettagliata: classifica i prezzi in 'Economico' (< 30), 'Medio' (30-80), 'Costoso' (80-150), o 'Lusso' (> 150).", queryTemplate: "SELECT nome, CASE WHEN prezzo < 30 THEN 'Economico' WHEN prezzo <= 80 THEN 'Medio' WHEN prezzo <= 150 THEN 'Costoso' ELSE 'Lusso' END FROM prodotti", hints: ["Aggiungi un quarto livello di classificazione.", "CASE WHEN ... WHEN ... WHEN ... ELSE ..."], explanation: "Gestisce una logica di classificazione complessa a più livelli.", replacements: {} },
            { titleTemplate: "Fasce Stock Quattro", descTemplate: "Dettaglio magazzino: classifica lo stock in 'Esaurito' (= 0), 'Basso' (1-5), 'Medio' (6-20), o 'Alto' (> 20).", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 5 THEN 'Basso' WHEN stock <= 20 THEN 'Medio' ELSE 'Alto' END FROM prodotti", hints: ["CASE WHEN stock = 0 ..."], explanation: "Fornisce una visione dettagliata della disponibilità.", replacements: {} },
            { titleTemplate: "Fasce Voto Quattro", descTemplate: "Dettaglio feedback: classifica i voti in 'Molto Basso' (1), 'Basso' (2), 'Medio' (3), o 'Alto' (4-5).", queryTemplate: "SELECT voto, CASE WHEN voto = 1 THEN 'Molto Basso' WHEN voto = 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni", hints: ["Gestisci ogni voto basso singolarmente.", "CASE WHEN voto = 1 ..."], explanation: "Analisi fine della soddisfazione cliente.", replacements: {} },
            { titleTemplate: "Fasce Quantità Quattro", descTemplate: "Dettaglio ordini: classifica le quantità in 'Singolo' (1), 'Piccolo' (2-4), 'Medio' (5-9), o 'Grande' (> 9).", queryTemplate: "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' WHEN quantita <= 4 THEN 'Piccolo' WHEN quantita <= 9 THEN 'Medio' ELSE 'Grande' END FROM ordini", hints: ["CASE WHEN quantita = 1 ..."], explanation: "Segmentazione dettagliata del volume ordini.", replacements: {} },
            { titleTemplate: "Case con AND", descTemplate: "Prodotti Premium: identifica come 'Premium' i prodotti con prezzo > 100 E stock > 10, altrimenti 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 10 THEN 'Premium' ELSE 'Standard' END FROM prodotti", hints: ["Usa AND per combinare due condizioni.", "CASE WHEN prezzo > 100 AND stock > 10 ..."], explanation: "CASE supporta operatori logici complessi.", replacements: {} },
            { titleTemplate: "Case con OR", descTemplate: "Prodotti in Offerta: identifica come 'Sconto' i prodotti con prezzo < 30 O stock = 0, altrimenti 'Normale'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 30 OR stock = 0 THEN 'Sconto' ELSE 'Normale' END FROM prodotti", hints: ["Usa OR per condizioni alternative.", "CASE WHEN prezzo < 30 OR stock = 0 ..."], explanation: "Basta che una condizione sia vera per attivare il caso.", replacements: {} },
            { titleTemplate: "Case con AND e OR", descTemplate: "Logica complessa: segna come 'Speciale' se (prezzo > 100 E stock > 20) O prezzo < 20, altrimenti 'Normale'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo > 100 AND stock > 20) OR prezzo < 20 THEN 'Speciale' ELSE 'Normale' END FROM prodotti", hints: ["Usa le parentesi per raggruppare le condizioni.", "CASE WHEN (...) OR ..."], explanation: "Gestisce logiche di business articolate.", replacements: {} },
            { titleTemplate: "Case con BETWEEN", descTemplate: "Filtro range: classifica come 'Medio' i prezzi compresi tra 50 e 100 (inclusi), altrimenti 'Altro'.", queryTemplate: "SELECT nome, CASE WHEN prezzo BETWEEN 50 AND 100 THEN 'Medio' ELSE 'Altro' END FROM prodotti", hints: ["Usa BETWEEN per intervalli inclusivi.", "CASE WHEN prezzo BETWEEN 50 AND 100 ..."], explanation: "Semplifica la scrittura di condizioni su intervalli numerici.", replacements: {} },
            { titleTemplate: "Case con IN", descTemplate: "Filtro lista: classifica come 'Alto' i voti 4 o 5, altrimenti 'Basso'.", queryTemplate: "SELECT voto, CASE WHEN voto IN (4, 5) THEN 'Alto' ELSE 'Basso' END FROM recensioni", hints: ["Usa IN per verificare l'appartenenza a una lista.", "CASE WHEN voto IN (4, 5) ..."], explanation: "Utile per confrontare con un insieme discreto di valori.", replacements: {} },
            { titleTemplate: "Case con LIKE", descTemplate: "Pattern matching: classifica come 'Standard' i prodotti il cui nome inizia con 'Prod', altrimenti 'Altro'.", queryTemplate: "SELECT nome, CASE WHEN nome LIKE 'Prod%' THEN 'Standard' ELSE 'Altro' END FROM prodotti", hints: ["Usa LIKE per il confronto di stringhe.", "CASE WHEN nome LIKE 'Prod%' ..."], explanation: "Permette logiche condizionali basate su pattern di testo.", replacements: {} },
            { titleTemplate: "Case con IS NULL", descTemplate: "Stato spedizione: se il tracking è NULL scrivi 'In Attesa', altrimenti 'Tracciata'.", queryTemplate: "SELECT CASE WHEN codice_tracking IS NULL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", hints: ["Verifica se il campo è vuoto.", "CASE WHEN codice_tracking IS NULL ..."], explanation: "Gestisce esplicitamente i dati mancanti.", replacements: {} },
            { titleTemplate: "Case con IS NOT NULL", descTemplate: "Verifica tracking: se il tracking NON è NULL scrivi 'Tracciata', altrimenti 'In Attesa'.", queryTemplate: "SELECT CASE WHEN codice_tracking IS NOT NULL THEN 'Tracciata' ELSE 'In Attesa' END FROM spedizioni", hints: ["Usa IS NOT NULL.", "CASE WHEN codice_tracking IS NOT NULL ..."], explanation: "Logica inversa rispetto a IS NULL.", replacements: {} },
            { titleTemplate: "Case con Alias", descTemplate: "Report leggibile: classifica lo stock (> 0 'Disponibile', altrimenti 'Esaurito') e nomina la colonna 'Stato'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS Stato FROM prodotti", hints: ["Usa AS alla fine del blocco END.", "END AS Stato"], explanation: "Assegna un nome chiaro alla colonna calcolata.", replacements: {} },
            { titleTemplate: "Case con Alias Prezzo", descTemplate: "Report prezzi: crea fasce di prezzo (< 50 'Economico', <= 150 'Medio', altro 'Lusso') con alias 'Fascia'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END AS Fascia FROM prodotti", hints: ["END AS Fascia"], explanation: "Rende il report finale professionale e leggibile.", replacements: {} },
            { titleTemplate: "Case con Alias Voto", descTemplate: "Report voti: classifica i voti (<= 2 'Basso', = 3 'Medio', altro 'Alto') con alias 'Valutazione'.", queryTemplate: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END AS Valutazione FROM recensioni", hints: ["END AS Valutazione"], explanation: "Chiarezza nell'output della query.", replacements: {} },
            { titleTemplate: "Case con Alias Quantità", descTemplate: "Report quantità: classifica le quantità (<= 3 'Piccolo', <= 7 'Medio', altro 'Grande') con alias 'Dimensione'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END AS Dimensione FROM ordini", hints: ["END AS Dimensione"], explanation: "Migliora la presentazione dei dati.", replacements: {} },
            { titleTemplate: "Case con Calcolo", descTemplate: "Valore magazzino: calcola (prezzo * stock) e classifica come 'Alto' se > 1000, altrimenti 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti", hints: ["Puoi fare calcoli dentro la condizione WHEN.", "CASE WHEN (prezzo * stock) > 1000 ..."], explanation: "Valuta espressioni matematiche dinamicamente.", replacements: {} },
            { titleTemplate: "Case con Calcolo Complesso", descTemplate: "Valore stock avanzato: classifica (prezzo * stock) come 'Molto Alto' (> 2000), 'Alto' (> 1000), o 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo * stock) > 2000 THEN 'Molto Alto' WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti", hints: ["Ripeti il calcolo nelle varie clausole WHEN.", "CASE WHEN (prezzo * stock) > 2000 ..."], explanation: "Segmentazione basata su valore calcolato.", replacements: {} },
            { titleTemplate: "Case con Funzione", descTemplate: "Lunghezza nomi: se la lunghezza del nome è > 10 scrivi 'Nome Lungo', altrimenti 'Nome Corto'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 10 THEN 'Nome Lungo' ELSE 'Nome Corto' END FROM prodotti", hints: ["Usa LENGTH(nome).", "CASE WHEN LENGTH(nome) > 10 ..."], explanation: "Combina funzioni SQL con logica condizionale.", replacements: {} },
            { titleTemplate: "Case con Funzione Data", descTemplate: "Analisi annuale: se l'anno dell'ordine è 2023 scrivi '2023', altrimenti 'Altro Anno'.", queryTemplate: "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini", hints: ["Usa YEAR(data_ordine).", "CASE WHEN YEAR(data_ordine) = 2023 ..."], explanation: "Logica condizionale applicata alle date.", replacements: {} },
            { titleTemplate: "Case con JOIN", descTemplate: "Report categorie: se il nome della categoria (da tabella categorie) è 'Elettronica' scrivi 'Elettronica', altrimenti 'Altro'.", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Elettronica' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Fai una JOIN con la tabella categorie.", "CASE WHEN categorie.nome = ..."], explanation: "Applica condizioni su dati provenienti da tabelle collegate.", replacements: {} },
            { titleTemplate: "Case con WHERE", descTemplate: "Filtro condizionale: per i soli prodotti con prezzo > 50, classifica lo stock (> 10 'Disponibile', altrimenti 'Limitato').", queryTemplate: "SELECT nome, CASE WHEN stock > 10 THEN 'Disponibile' ELSE 'Limitato' END FROM prodotti WHERE prezzo > 50", hints: ["Usa WHERE per filtrare le righe prima del CASE.", "WHERE prezzo > 50"], explanation: "Combina filtro righe (WHERE) con logica colonne (CASE).", replacements: {} },
            { titleTemplate: "Case con ORDER BY", descTemplate: "Ordinamento personalizzato: ordina i prodotti mostrando prima quelli 'Disponibile' (stock > 0) e poi 'Esaurito'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END", hints: ["Usa un CASE dentro ORDER BY per definire l'ordine.", "ORDER BY CASE ... END"], explanation: "Permette ordinamenti non alfabetici basati su logica custom.", replacements: {} },
            { titleTemplate: "Case Complesso Finale", descTemplate: "Segmentazione Avanzata: classifica i prodotti in 'Premium Disponibile' (prezzo > 100 e stock > 20), 'Premium Limitato' (prezzo > 100), 'Economico Disponibile' (stock > 20), o 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END FROM prodotti", hints: ["L'ordine delle condizioni WHEN è importante: la prima vera vince.", "CASE WHEN prezzo > 100 AND stock > 20 ..."], explanation: "Esempio di logica decisionale complessa con priorità.", replacements: {} },
            { titleTemplate: "Case con Alias Stock", descTemplate: "Report Livelli: classifica lo stock (> 20 'Alto', > 10 'Medio', altro 'Basso') con alias 'Livello'.", queryTemplate: "SELECT nome, CASE WHEN stock > 20 THEN 'Alto' WHEN stock > 10 THEN 'Medio' ELSE 'Basso' END AS Livello FROM prodotti", hints: ["Usa AS Livello alla fine.", "CASE ... END AS Livello"], explanation: "Crea una colonna calcolata con un nome specifico.", replacements: {} },
            { titleTemplate: "Case con Alias Quantità", descTemplate: "Report Taglie: classifica la quantità (> 7 'Grande', > 3 'Media', altro 'Piccola') con alias 'Taglia'.", queryTemplate: "SELECT quantita, CASE WHEN quantita > 7 THEN 'Grande' WHEN quantita > 3 THEN 'Media' ELSE 'Piccola' END AS Taglia FROM ordini", hints: ["Usa AS Taglia.", "CASE ... END AS Taglia"], explanation: "Rende il risultato immediatamente comprensibile.", replacements: {} },
            // NEW EXERCISES FOR CASE MEDIUM
            { titleTemplate: "Case Stagioni", descTemplate: "Classifica ordini in base al mese: Inverno (12,1,2), Primavera (3-5), Estate (6-8), Autunno (9-11).", queryTemplate: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (12,1,2) THEN 'Inverno' WHEN MONTH(data_ordine) BETWEEN 3 AND 5 THEN 'Primavera' WHEN MONTH(data_ordine) BETWEEN 6 AND 8 THEN 'Estate' ELSE 'Autunno' END FROM ordini", hints: ["CASE con range mesi"], explanation: "Logica stagionale complessa.", replacements: {} },
            { titleTemplate: "Case Fasce Spesa", descTemplate: "Classifica ordini per quantità: 1-2 'Pochi', 3-5 'Medi', >5 'Tanti'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 2 THEN 'Pochi' WHEN quantita <= 5 THEN 'Medi' ELSE 'Tanti' END FROM ordini", hints: ["CASE multiplo su quantità"], explanation: "Segmentazione ordini.", replacements: {} },
            { titleTemplate: "Case Qualità Prodotto", descTemplate: "Classifica prodotti combinando prezzo e stock: Prezzo > 100 e Stock > 50 'Top Seller', Prezzo < 20 'Economico', Altro 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 50 THEN 'Top Seller' WHEN prezzo < 20 THEN 'Economico' ELSE 'Standard' END FROM prodotti", hints: ["CASE con AND e condizioni miste"], explanation: "Logica business complessa.", replacements: {} },
            { titleTemplate: "Case Urgenza Spedizione", descTemplate: "Classifica spedizioni: se corriere 'DHL' o 'FedEx' 'Urgente', altrimenti 'Normale'.", queryTemplate: "SELECT corriere, CASE WHEN corriere IN ('DHL', 'FedEx') THEN 'Urgente' ELSE 'Normale' END FROM spedizioni", hints: ["CASE con IN"], explanation: "Raggruppamento valori.", replacements: {} },
            { titleTemplate: "Case Tipo Utente", descTemplate: "Classifica utenti: Premium 'VIP', se ha ordini (simulato con EXISTS o flag) 'Attivo', altrimenti 'Nuovo'.", queryTemplate: "SELECT nome, CASE WHEN premium = TRUE THEN 'VIP' ELSE 'Standard' END FROM utenti", hints: ["Semplificazione logica utente"], explanation: "Segmentazione clientela.", replacements: {} },
            { titleTemplate: "Case Lunghezza Recensione", descTemplate: "Classifica recensioni: commento lungo (>50 chars) 'Dettagliata', altrimenti 'Breve'.", queryTemplate: "SELECT commento, CASE WHEN LENGTH(commento) > 50 THEN 'Dettagliata' ELSE 'Breve' END FROM recensioni", hints: ["LENGTH > 50"], explanation: "Analisi testo.", replacements: {} },
            { titleTemplate: "Case Sconto Applicabile", descTemplate: "Calcola sconto teorico: se prezzo > 100 '20%', se prezzo > 50 '10%', altrimenti '0%'.", queryTemplate: "SELECT prezzo, CASE WHEN prezzo > 100 THEN '20%' WHEN prezzo > 50 THEN '10%' ELSE '0%' END as Sconto FROM prodotti", hints: ["CASE per calcolo logico"], explanation: "Logica commerciale.", replacements: {} },
            { titleTemplate: "Case Giorni Consegna", descTemplate: "Classifica spedizioni: se DATEDIFF > 5 'Lento', < 2 'Veloce', altrimenti 'Normale'.", queryTemplate: "SELECT id, CASE WHEN DATEDIFF(day, data_ordine, data_spedizione) > 5 THEN 'Lento' WHEN DATEDIFF(day, data_ordine, data_spedizione) < 2 THEN 'Veloce' ELSE 'Normale' END FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["CASE su DATEDIFF"], explanation: "KPI logistico.", replacements: {} },
            { titleTemplate: "Case Priorità Ordine", descTemplate: "Se quantità > 10 O utente premium 'Alta', altrimenti 'Bassa'.", queryTemplate: "SELECT ordini.id, CASE WHEN ordini.quantita > 10 OR utenti.premium = TRUE THEN 'Alta' ELSE 'Bassa' END FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", hints: ["CASE con OR e JOIN"], explanation: "Prioritizzazione.", replacements: {} },
            { titleTemplate: "Case Stato Magazzino", descTemplate: "Se stock = 0 'Critico', se stock < 10 'Riordinare', se stock > 100 'Eccesso', altrimenti 'Ok'.", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Critico' WHEN stock < 10 THEN 'Riordinare' WHEN stock > 100 THEN 'Eccesso' ELSE 'Ok' END FROM prodotti", hints: ["CASE multiplo stock"], explanation: "Gestione inventario.", replacements: {} },
            { titleTemplate: "Case Valutazione Fornitore", descTemplate: "Se nazione 'Italia' 'Locale', se 'Europa' (simulato) 'UE', altrimenti 'Extra-UE'.", queryTemplate: "SELECT azienda, CASE WHEN nazione = 'Italia' THEN 'Locale' WHEN nazione IN ('Francia', 'Germania', 'Spagna') THEN 'UE' ELSE 'Extra-UE' END FROM fornitori", hints: ["CASE geografico"], explanation: "Logica supply chain.", replacements: {} },
            { titleTemplate: "Case Fascia Oraria (Simulato)", descTemplate: "Se ora ordine < 12 'Mattina', < 18 'Pomeriggio', altrimenti 'Sera' (usando HOUR()).", queryTemplate: "SELECT data_ordine, CASE WHEN HOUR(data_ordine) < 12 THEN 'Mattina' WHEN HOUR(data_ordine) < 18 THEN 'Pomeriggio' ELSE 'Sera' END FROM ordini", hints: ["HOUR()"], explanation: "Analisi temporale.", replacements: {} },
            { titleTemplate: "Case Tipo Prodotto", descTemplate: "Se nome contiene 'Pro' 'Professional', se 'Lite' 'Base', altrimenti 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN nome LIKE '%Pro%' THEN 'Professional' WHEN nome LIKE '%Lite%' THEN 'Base' ELSE 'Standard' END FROM prodotti", hints: ["LIKE multiplo"], explanation: "Categorizzazione stringa.", replacements: {} },
            { titleTemplate: "Case Margine (Simulato)", descTemplate: "Se (prezzo - costo) > 50 'Alto', altrimenti 'Basso' (assumendo costo = prezzo * 0.5).", queryTemplate: "SELECT nome, CASE WHEN (prezzo - (prezzo * 0.5)) > 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", hints: ["Calcolo aritmetico"], explanation: "Analisi finanziaria.", replacements: {} },
            { titleTemplate: "Case Disponibilità Immediata", descTemplate: "Se stock > 0 E fornitore 'Locale' (Italia) 'Immediata', altrimenti 'Attesa'.", queryTemplate: "SELECT prodotti.nome, CASE WHEN prodotti.stock > 0 AND fornitori.nazione = 'Italia' THEN 'Immediata' ELSE 'Attesa' END FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["AND con JOIN"], explanation: "Logica complessa.", replacements: {} }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Case con ORDER BY", descTemplate: "Ordinamento Personalizzato: ordina i prodotti mostrando prima quelli 'Esauriti' (stock=0), poi gli altri per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Usa un CASE nel blocco ORDER BY.", "ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC"], explanation: "Permette di portare in cima righe specifiche basandosi su una condizione.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Prezzo", descTemplate: "Priorità Prezzo: ordina i prodotti mostrando prima quelli 'Costosi' (> 100), poi gli altri per prezzo crescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN prezzo > 100 THEN 0 ELSE 1 END, prezzo ASC", hints: ["Assegna 0 ai costosi per metterli prima.", "ORDER BY CASE WHEN prezzo > 100 ..."], explanation: "Ordinamento a due livelli: logico e poi numerico.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Voto", descTemplate: "Priorità Feedback: ordina le recensioni mostrando prima quelle 'Eccellenti' (>= 4), poi le altre per voto decrescente.", queryTemplate: "SELECT * FROM recensioni ORDER BY CASE WHEN voto >= 4 THEN 0 ELSE 1 END, voto DESC", hints: ["Metti in evidenza i voti alti.", "ORDER BY CASE WHEN voto >= 4 ..."], explanation: "Utile per dashboard che evidenziano i top performer.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Quantità", descTemplate: "Priorità Ordini: ordina gli ordini mostrando prima quelli 'Grandi' (> 5), poi gli altri per quantità crescente.", queryTemplate: "SELECT * FROM ordini ORDER BY CASE WHEN quantita > 5 THEN 0 ELSE 1 END, quantita ASC", hints: ["Separa gli ordini grandi dagli altri.", "ORDER BY CASE WHEN quantita > 5 ..."], explanation: "Segmentazione visiva degli ordini.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Multiplo", descTemplate: "Ordinamento Complesso: ordina prima per disponibilità (Esauriti vs Disponibili), poi per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Combina logica booleana e ordinamento standard.", "ORDER BY CASE ... END, prezzo DESC"], explanation: "Controllo fine sulla presentazione dei dati.", replacements: {} },
            { titleTemplate: "Case con WHERE", descTemplate: "Filtro Calcolato: trova i prodotti dove lo stato calcolato è 'Disponibile' (stock > 0).", queryTemplate: "SELECT * FROM prodotti WHERE CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END = 'Disponibile'", hints: ["Puoi usare CASE dentro WHERE.", "WHERE CASE ... END = 'Disponibile'"], explanation: "Filtra basandosi sul risultato di una logica condizionale.", replacements: {} },
            { titleTemplate: "Case con WHERE Prezzo", descTemplate: "Filtro Fascia: trova i prodotti dove la fascia calcolata è 'Costoso' (prezzo > 100).", queryTemplate: "SELECT * FROM prodotti WHERE CASE WHEN prezzo > 100 THEN 'Costoso' ELSE 'Economico' END = 'Costoso'", hints: ["Confronta il risultato del CASE.", "WHERE CASE ... END = 'Costoso'"], explanation: "Selezione basata su classificazione dinamica.", replacements: {} },
            { titleTemplate: "Case con JOIN", descTemplate: "Classifica i prodotti in base alla categoria ('Elettronica' -> 'Tech', altro -> 'Altro').", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Tech' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Usa CASE sui campi della tabella in join.", "CASE WHEN categorie.nome = ..."], explanation: "Arricchimento dati tramite relazioni.", replacements: {} },
            { titleTemplate: "Case con Aggregazione", descTemplate: "Classifica le categorie come 'Popolari' se hanno più di 5 prodotti, altrimenti 'Normali'.", queryTemplate: "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END FROM prodotti GROUP BY categoria_id", hints: ["Usa funzioni di aggregazione nel CASE.", "CASE WHEN COUNT(*) > 5 ..."], explanation: "Etichettatura basata su metriche aggregate.", replacements: {} },
            { titleTemplate: "Case con HAVING", descTemplate: "Filtro su Gruppi Calcolati: mostra solo le categorie classificate come 'Popolari' (più di 5 prodotti).", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END = 'Popolare'", hints: ["Usa CASE dentro HAVING.", "HAVING CASE ... END = 'Popolare'"], explanation: "Filtro post-aggregazione basato su logica condizionale.", replacements: {} },
            { titleTemplate: "Case Nidificato", descTemplate: "Logica a Cascata: classifica 'Premium Disponibile' (prezzo > 100 e stock > 20), 'Premium Limitato' (prezzo > 100), o 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 THEN CASE WHEN stock > 20 THEN 'Premium Disponibile' ELSE 'Premium Limitato' END ELSE 'Standard' END FROM prodotti", hints: ["Puoi mettere un CASE dentro un altro CASE.", "CASE WHEN ... THEN CASE ... END ELSE ... END"], explanation: "Gestisce alberi decisionali complessi.", replacements: {} },
            { titleTemplate: "Case con Subquery", descTemplate: "Confronto Dinamico: classifica i prodotti come 'Sopra Media' o 'Sotto Media' rispetto al prezzo medio globale.", queryTemplate: "SELECT nome, CASE WHEN prezzo > (SELECT AVG(prezzo) FROM prodotti) THEN 'Sopra Media' ELSE 'Sotto Media' END FROM prodotti", hints: ["Usa una subquery nel confronto.", "CASE WHEN prezzo > (SELECT AVG(prezzo)...)"], explanation: "Classificazione relativa al contesto globale.", replacements: {} },
            { titleTemplate: "Case con Calcolo Complesso", descTemplate: "Valutazione Asset: classifica il valore totale dello stock (prezzo * stock) in 'Alto', 'Medio', o 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo * stock) > 2000 THEN 'Alto' WHEN (prezzo * stock) > 1000 THEN 'Medio' ELSE 'Basso' END FROM prodotti", hints: ["Valuta espressioni matematiche.", "CASE WHEN (prezzo * stock) > 2000 ..."], explanation: "KPI calcolati al volo.", replacements: {} },
            { titleTemplate: "Case con Funzioni Multiple", descTemplate: "Analisi Avanzata: classifica come 'Lungo Costoso' se nome > 10 caratteri E prezzo > 50, altrimenti 'Altro'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 10 AND prezzo > 50 THEN 'Lungo Costoso' ELSE 'Altro' END FROM prodotti", hints: ["Combina funzioni e operatori logici.", "CASE WHEN LENGTH(nome) > 10 AND ..."], explanation: "Regole di business multi-fattoriali.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Complesso", descTemplate: "Ordinamento Misto: prima gli 'Esauriti', poi gli altri ordinati per valore totale dello stock decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, (prezzo * stock) DESC", hints: ["Combina stato booleano e calcolo numerico.", "ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, (prezzo * stock) DESC"], explanation: "Ordinamento gerarchico avanzato.", replacements: {} },
            { titleTemplate: "Case con WHERE e ORDER BY", descTemplate: "Report Filtrato e Ordinato: prodotti > 50€, classificati per disponibilità e ordinati per stato.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti WHERE prezzo > 50 ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Filtra, calcola, e poi ordina.", "WHERE ... ORDER BY CASE ..."], explanation: "Pipeline completa di manipolazione dati.", replacements: {} },
            { titleTemplate: "Case con JOIN e ORDER BY", descTemplate: "Report Relazionale Ordinato: classifica prodotti per tipo categoria e ordina per tipo e prezzo.", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Tech' ELSE 'Altro' END AS tipo FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY CASE WHEN categorie.nome = 'Elettronica' THEN 0 ELSE 1 END, prodotti.prezzo DESC", hints: ["Usa campi di tabelle collegate per l'ordinamento.", "ORDER BY CASE WHEN categorie.nome ..."], explanation: "Ordinamento basato su logica relazionale.", replacements: {} },
            { titleTemplate: "Case con Aggregazione e HAVING", descTemplate: "Analisi Categorie: classifica per popolarità e filtra solo quelle classificate come 'Popolare'.", queryTemplate: "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END AS tipo FROM prodotti GROUP BY categoria_id HAVING CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END = 'Popolare'", hints: ["Filtra i risultati dell'aggregazione.", "HAVING CASE ... END = 'Popolare'"], explanation: "Selezione gruppi basata su etichetta calcolata.", replacements: {} },
            { titleTemplate: "Case Complesso Finale", descTemplate: "Segmentazione Totale: logica complessa su prezzo e stock con ordinamento personalizzato per priorità business.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END AS tipo FROM prodotti ORDER BY CASE WHEN prezzo > 100 AND stock > 20 THEN 0 WHEN prezzo > 100 THEN 1 WHEN stock > 20 THEN 2 ELSE 3 END, prezzo DESC", hints: ["Replica la logica di classificazione nell'ordinamento.", "ORDER BY CASE ... END"], explanation: "Massimo controllo su classificazione e presentazione.", replacements: {} },
            { titleTemplate: "Case in ORDER BY con Calcolo", descTemplate: "Ordinamento per Valore: ordina prima i prodotti con valore stock > 1000, poi per prezzo.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN (prezzo * stock) > 1000 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Ordina su un valore calcolato.", "ORDER BY CASE WHEN (prezzo * stock) > 1000 ..."], explanation: "Priorità basata su metriche derivate.", replacements: {} },
            { titleTemplate: "Case in WHERE con Calcolo", descTemplate: "Filtro su Valore: trova i prodotti dove il valore calcolato è 'Alto Valore' (> 1000).", queryTemplate: "SELECT * FROM prodotti WHERE CASE WHEN (prezzo * stock) > 1000 THEN 'Alto Valore' ELSE 'Basso Valore' END = 'Alto Valore'", hints: ["Usa il calcolo nel filtro.", "WHERE CASE ... END = 'Alto Valore'"], explanation: "Filtro su logica di business calcolata.", replacements: {} },
            { titleTemplate: "Case Nidificato Complesso", descTemplate: "Albero Decisionale: classifica prodotti con logica a più livelli su prezzo e stock.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 THEN CASE WHEN stock > 20 THEN 'Premium Disponibile' ELSE 'Premium Limitato' END ELSE CASE WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END END FROM prodotti", hints: ["Struttura decisionale ramificata.", "CASE ... THEN CASE ... END ELSE CASE ... END END"], explanation: "Logica condizionale profondamente nidificata.", replacements: {} },
            { titleTemplate: "Case con Subquery Media", descTemplate: "Benchmark Prezzo: classifica 'Sopra Media' o 'Sotto Media' rispetto alla media globale.", queryTemplate: "SELECT nome, CASE WHEN prezzo > (SELECT AVG(prezzo) FROM prodotti) THEN 'Sopra Media' ELSE 'Sotto Media' END FROM prodotti", hints: ["Confronta con la media calcolata.", "CASE WHEN prezzo > (SELECT AVG(prezzo)...)"], explanation: "Analisi relativa delle performance.", replacements: {} },
            { titleTemplate: "Case con Subquery Massimo", descTemplate: "Identifica Top: etichetta il prodotto 'Più Costoso', gli altri 'Altro'.", queryTemplate: "SELECT nome, CASE WHEN prezzo = (SELECT MAX(prezzo) FROM prodotti) THEN 'Più Costoso' ELSE 'Altro' END FROM prodotti", hints: ["Trova il massimo e confronta.", "CASE WHEN prezzo = (SELECT MAX(prezzo)...)"], explanation: "Evidenziazione di outlier specifici.", replacements: {} },
            { titleTemplate: "Case con Funzione LENGTH", descTemplate: "Analisi Testo: classifica la lunghezza dei nomi in 'Lungo' (>15), 'Medio' (>10), o 'Corto'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 15 THEN 'Nome Lungo' WHEN LENGTH(nome) > 10 THEN 'Nome Medio' ELSE 'Nome Corto' END FROM prodotti", hints: ["Segmenta in base alla lunghezza.", "CASE WHEN LENGTH(nome) > 15 ..."], explanation: "Categorizzazione basata su proprietà delle stringhe.", replacements: {} },
            { titleTemplate: "Case con Funzione YEAR", descTemplate: "Analisi Annuale: classifica gli ordini per anno specifico (2024, 2023, Altro).", queryTemplate: "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2024 THEN '2024' WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini", hints: ["Estrai l'anno e classifica.", "CASE WHEN YEAR(data_ordine) = ..."], explanation: "Raggruppamento temporale esplicito.", replacements: {} },
            { titleTemplate: "Case con JOIN e WHERE", descTemplate: "Classificazione Mista: 'Tech Costoso' per Elettronica > 100€, altrimenti 'Altro'.", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' AND prodotti.prezzo > 100 THEN 'Tech Costoso' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Combina condizioni su tabelle diverse.", "CASE WHEN categorie.nome = ... AND prodotti.prezzo ..."], explanation: "Logica condizionale multi-tabella.", replacements: {} },
            { titleTemplate: "Case con Aggregazione e WHERE", descTemplate: "Analisi Gruppi: classifica popolarità categorie, ma mostra solo quelle con prezzo medio > 50.", queryTemplate: "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END AS tipo FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > 50", hints: ["Classifica e poi filtra il gruppo.", "HAVING AVG(prezzo) > 50"], explanation: "Combinazione di classificazione e filtro aggregato.", replacements: {} },
            // NEW EXERCISES FOR CASE HARD
            { titleTemplate: "Case in GROUP BY", descTemplate: "Raggruppamento Logico: raggruppa i prodotti per fascia di prezzo calcolata ('Economico' vs 'Costoso').", queryTemplate: "SELECT CASE WHEN prezzo < 50 THEN 'Economico' ELSE 'Costoso' END as Fascia, COUNT(*) FROM prodotti GROUP BY CASE WHEN prezzo < 50 THEN 'Economico' ELSE 'Costoso' END", hints: ["Copia l'espressione CASE nel GROUP BY.", "GROUP BY CASE ... END"], explanation: "Aggregazione su dimensioni calcolate.", replacements: {} },
            { titleTemplate: "Case in GROUP BY Stock", descTemplate: "Analisi Disponibilità: raggruppa per stato stock ('Sì' vs 'No') e calcola il prezzo medio.", queryTemplate: "SELECT CASE WHEN stock > 0 THEN 'Sì' ELSE 'No' END as Disponibile, AVG(prezzo) FROM prodotti GROUP BY CASE WHEN stock > 0 THEN 'Sì' ELSE 'No' END", hints: ["Raggruppa per disponibilità.", "GROUP BY CASE ... END"], explanation: "Statistiche per stati logici.", replacements: {} },
            { titleTemplate: "Case in ORDER BY Custom", descTemplate: "Ordinamento Arbitrario: ordina per categorie specifiche ('Elettronica', 'Abbigliamento') in ordine personalizzato.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY CASE WHEN categorie.nome = 'Elettronica' THEN 1 WHEN categorie.nome = 'Abbigliamento' THEN 2 ELSE 3 END", hints: ["Assegna numeri per definire l'ordine.", "ORDER BY CASE ... THEN 1 ... THEN 2 ..."], explanation: "Forza un ordine non alfabetico specifico.", replacements: {} },
            { titleTemplate: "Case dentro SUM", descTemplate: "Pivot Condizionale: conta in un colpo solo quanti prodotti sono 'Costosi' e quanti 'Economici'.", queryTemplate: "SELECT SUM(CASE WHEN prezzo > 100 THEN 1 ELSE 0 END) as Costosi, SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END) as Economici FROM prodotti", hints: ["Usa SUM con CASE che restituisce 1 o 0.", "SUM(CASE ... THEN 1 ELSE 0 END)"], explanation: "Creazione di colonne pivot.", replacements: {} },
            { titleTemplate: "Case dentro AVG", descTemplate: "Media Condizionale: calcola il prezzo medio solo dei prodotti disponibili, ignorando gli esauriti.", queryTemplate: "SELECT AVG(CASE WHEN stock > 0 THEN prezzo ELSE NULL END) as MediaDisponibili FROM prodotti", hints: ["Usa NULL per ignorare valori nella media.", "AVG(CASE ... ELSE NULL END)"], explanation: "Statistiche filtrate senza WHERE.", replacements: {} },
            { titleTemplate: "Case dentro COUNT", descTemplate: "Conteggio Selettivo: conta separatamente recensioni positive e negative nella stessa query.", queryTemplate: "SELECT COUNT(CASE WHEN voto >= 4 THEN 1 END) as Positive, COUNT(CASE WHEN voto <= 2 THEN 1 END) as Negative FROM recensioni", hints: ["COUNT ignora i NULL.", "COUNT(CASE ... THEN 1 END)"], explanation: "Conteggi multipli in una sola passata.", replacements: {} },
            { titleTemplate: "Case Nidificato 3 Livelli", descTemplate: "Segmentazione Cliente: classifica utenti in 'VIP', 'Fedele', 'Promettente' o 'Standard' basandosi su ordini e status.", queryTemplate: "SELECT nome, CASE WHEN premium THEN CASE WHEN (SELECT COUNT(*) FROM ordini WHERE utente_id = utenti.id) > 5 THEN 'VIP' ELSE 'Promettente' END ELSE CASE WHEN (SELECT COUNT(*) FROM ordini WHERE utente_id = utenti.id) > 5 THEN 'Fedele' ELSE 'Standard' END END FROM utenti", hints: ["Logica ramificata complessa.", "CASE WHEN ... THEN CASE ... END ELSE CASE ... END END"], explanation: "Segmentazione avanzata della clientela.", replacements: {} },
            { titleTemplate: "Case in UPDATE (Simulato)", descTemplate: "Simulazione Listino: calcola nuovi prezzi ipotetici basati su regole di stock (+10% o -5%).", queryTemplate: "SELECT prezzo, CASE WHEN stock < 10 THEN prezzo * 1.10 WHEN stock > 100 THEN prezzo * 0.95 ELSE prezzo END as NuovoPrezzo FROM prodotti", hints: ["Applica moltiplicatori diversi.", "CASE WHEN ... THEN prezzo * 1.10 ..."], explanation: "Proiezione di scenari di pricing.", replacements: {} },
            { titleTemplate: "Case con Window Function", descTemplate: "Analisi Sequenziale: identifica salti di prezzo significativi rispetto al prodotto precedente.", queryTemplate: "SELECT nome, prezzo - LAG(prezzo) OVER (ORDER BY prezzo) as Diff, CASE WHEN (prezzo - LAG(prezzo) OVER (ORDER BY prezzo)) > 50 THEN 'Salto' ELSE 'Normale' END FROM prodotti", hints: ["Usa LAG per guardare la riga precedente.", "CASE WHEN ... > 50"], explanation: "Analisi di serie e sequenze.", replacements: {} },
            { titleTemplate: "Case per Etichetta Temporale", descTemplate: "Analisi Settimanale: etichetta gli ordini come 'Weekend' o 'Feriale'.", queryTemplate: "SELECT data_ordine, CASE WHEN DAYOFWEEK(data_ordine) IN (1, 7) THEN 'Weekend' ELSE 'Feriale' END FROM ordini", hints: ["Usa DAYOFWEEK (1=Dom, 7=Sab).", "CASE WHEN DAYOFWEEK(...) IN (1, 7)"], explanation: "Categorizzazione temporale.", replacements: {} },
            { titleTemplate: "Case in HAVING Complesso", descTemplate: "Filtro Avanzato: categorie con più prodotti costosi che economici.", queryTemplate: "SELECT categoria_id FROM prodotti GROUP BY categoria_id HAVING SUM(CASE WHEN prezzo > 100 THEN 1 ELSE 0 END) > SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END)", hints: ["Confronta due SUM condizionali.", "HAVING SUM(...) > SUM(...)"], explanation: "Filtri complessi su aggregati.", replacements: {} },
            { titleTemplate: "Case con Subquery Correlata", descTemplate: "Confronto Relativo: classifica prodotti rispetto alla media della *loro* categoria.", queryTemplate: "SELECT nome, CASE WHEN prezzo > (SELECT AVG(p2.prezzo) FROM prodotti p2 WHERE p2.categoria_id = prodotti.categoria_id) THEN 'Sopra' ELSE 'Sotto' END FROM prodotti", hints: ["La subquery dipende dalla riga esterna.", "SELECT AVG(...) WHERE categoria_id = prodotti.categoria_id"], explanation: "Benchmarking contestuale.", replacements: {} },
            { titleTemplate: "Case Multi-Colonna", descTemplate: "Priorità Mista: regole su stock e prezzo con priorità definita.", queryTemplate: "SELECT nome, CASE WHEN stock < 10 THEN 'Raro' WHEN prezzo > 100 THEN 'Caro' ELSE 'Normale' END FROM prodotti", hints: ["L'ordine delle clausole WHEN determina la priorità.", "Prima controlla stock, poi prezzo."], explanation: "Gestione conflitti tra regole.", replacements: {} },
            { titleTemplate: "Case Null Coalesce Logic", descTemplate: "Gestione Stati Nulli: logica complessa per stati di spedizione mancanti o parziali.", queryTemplate: "SELECT id, CASE WHEN codice_tracking IS NULL AND data_spedizione IS NULL THEN 'Non Spedito' WHEN codice_tracking IS NULL THEN 'Non Tracciato' ELSE 'Ok' END FROM spedizioni", hints: ["Gestisci le combinazioni di NULL.", "CASE WHEN ... IS NULL AND ... IS NULL"], explanation: "Pulizia e normalizzazione dati.", replacements: {} },
            { titleTemplate: "Case in JOIN Condition", descTemplate: "Join Dinamico: unisce tabelle diverse in base a condizioni logiche sul prezzo.", queryTemplate: "SELECT p.nome, s.sconto FROM prodotti p LEFT JOIN sconti s ON s.tipo = CASE WHEN p.prezzo > 100 THEN 'Alto' ELSE 'Basso' END", hints: ["Usa CASE nella condizione ON.", "ON s.tipo = CASE ... END"], explanation: "Relazioni condizionali tra tabelle.", replacements: {} }
        ]
    },
    [TopicId.Advanced]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Subquery Prezzo > Media", descTemplate: "Trova i prodotti che costano più della media generale.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELETC * FROM prodotti WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Subquery in WHERE", "WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery per confronto con media.", replacements: {} },
            { titleTemplate: "Subquery Prezzo < Media", descTemplate: "Trova i prodotti che costano meno della media generale.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELECT * prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)", debugHint: "Manca la parola chiave FROM.", hints: ["Subquery in WHERE", "WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery per confronto con media minore.", replacements: {} },
            { titleTemplate: "Subquery Stock > Media", descTemplate: "Trova i prodotti con stock superiore alla media.", queryTemplate: "SELECT * FROM prodotti WHERE stock > (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock > (SELECT AV(stock) FROM prodotti)", debugHint: "La funzione per la media è AVG, non AV.", hints: ["Subquery in WHERE", "WHERE stock > (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery per confronto stock.", replacements: {} },
            { titleTemplate: "Subquery Stock < Media", descTemplate: "Trova i prodotti con stock inferiore alla media.", queryTemplate: "SELECT * FROM prodotti WHERE stock < (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock < (AVG(stock) FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery in WHERE", "WHERE stock < (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery per confronto stock minore.", replacements: {} },
            { titleTemplate: "Subquery Voto > Media", descTemplate: "Trova le recensioni con voto superiore alla media.", queryTemplate: "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHER voto > (SELECT AVG(voto) FROM recensioni)", debugHint: "Errore di battitura nella parola chiave WHERE.", hints: ["Subquery in WHERE", "WHERE voto > (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery per confronto voto.", replacements: {} },
            { titleTemplate: "Subquery Voto < Media", descTemplate: "Trova le recensioni con voto inferiore alla media.", queryTemplate: "SELECT * FROM recensioni WHERE voto < (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto < (SELECT AVG(voto) FROM recensioni", debugHint: "Manca la parentesi di chiusura della subquery.", hints: ["Subquery in WHERE", "WHERE voto < (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery per confronto voto minore.", replacements: {} },
            { titleTemplate: "Subquery Quantità > Media", descTemplate: "Trova gli ordini con quantità superiore alla media.", queryTemplate: "SELECT * FROM ordini WHERE quantita > (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita > (SELECT AGV(quantita) FROM ordini)", debugHint: "Errore di battitura nella funzione AVG.", hints: ["Subquery in WHERE", "WHERE quantita > (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery per confronto quantità.", replacements: {} },
            { titleTemplate: "Subquery Quantità < Media", descTemplate: "Trova gli ordini con quantità inferiore alla media.", queryTemplate: "SELECT * FROM ordini WHERE quantita < (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita < (SELECT AVG(quantita) ordini)", debugHint: "Manca la parola chiave FROM nella subquery.", hints: ["Subquery in WHERE", "WHERE quantita < (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery per confronto quantità minore.", replacements: {} },
            { titleTemplate: "Subquery Prezzo = Massimo", descTemplate: "Trova i prodotti con prezzo uguale al massimo.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo = (SELECT MA(prezzo) FROM prodotti)", debugHint: "Errore di battitura nella funzione MAX.", hints: ["Subquery con MAX", "WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti)"], explanation: "Subquery con MAX.", replacements: {} },
            { titleTemplate: "Subquery Prezzo = Minimo", descTemplate: "Trova i prodotti con prezzo uguale al minimo.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo = (MIN(prezzo) FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery con MIN", "WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti)"], explanation: "Subquery con MIN.", replacements: {} },
            { titleTemplate: "Subquery Stock = Massimo", descTemplate: "Trova i prodotti con stock uguale al massimo.", queryTemplate: "SELECT * FROM prodotti WHERE stock = (SELECT MAX(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock = (SELECT MAX(stok) FROM prodotti)", debugHint: "Errore di battitura nel nome della colonna 'stock'.", hints: ["Subquery con MAX", "WHERE stock = (SELECT MAX(stock) FROM prodotti)"], explanation: "Subquery con MAX su stock.", replacements: {} },
            { titleTemplate: "Subquery Stock = Minimo", descTemplate: "Trova i prodotti con stock uguale al minimo.", queryTemplate: "SELECT * FROM prodotti WHERE stock = (SELECT MIN(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock = SELECT MIN(stock) FROM prodotti", debugHint: "Le subquery devono essere racchiuse tra parentesi.", hints: ["Subquery con MIN", "WHERE stock = (SELECT MIN(stock) FROM prodotti)"], explanation: "Subquery con MIN su stock.", replacements: {} },
            { titleTemplate: "Subquery Voto = Massimo", descTemplate: "Trova le recensioni con voto uguale al massimo.", queryTemplate: "SELECT * FROM recensioni WHERE voto = (SELECT MAX(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto = (SELECT MAX(vot) FROM recensioni)", debugHint: "Errore di battitura nel nome della colonna 'voto'.", hints: ["Subquery con MAX", "WHERE voto = (SELECT MAX(voto) FROM recensioni)"], explanation: "Subquery con MAX su voto.", replacements: {} },
            { titleTemplate: "Subquery Voto = Minimo", descTemplate: "Trova le recensioni con voto uguale al minimo.", queryTemplate: "SELECT * FROM recensioni WHERE voto = (SELECT MIN(voto) FROM recensioni)", brokenCode: "SELECT * recensioni WHERE voto = (SELECT MIN(voto) FROM recensioni)", debugHint: "Manca la parola chiave FROM nella query principale.", hints: ["Subquery con MIN", "WHERE voto = (SELECT MIN(voto) FROM recensioni)"], explanation: "Subquery con MIN su voto.", replacements: {} },
            { titleTemplate: "Subquery Quantità = Massimo", descTemplate: "Trova gli ordini con quantità uguale al massimo.", queryTemplate: "SELECT * FROM ordini WHERE quantita = (SELECT MAX(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita = (SELECT MAX(quantit) FROM ordini)", debugHint: "Errore di battitura nel nome della colonna 'quantita'.", hints: ["Subquery con MAX", "WHERE quantita = (SELECT MAX(quantita) FROM ordini)"], explanation: "Subquery con MAX su quantità.", replacements: {} },
            { titleTemplate: "Subquery Quantità = Minimo", descTemplate: "Trova gli ordini con quantità uguale al minimo.", queryTemplate: "SELECT * FROM ordini WHERE quantita = (SELECT MIN(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita = (SELECT MI(quantita) FROM ordini)", debugHint: "Errore di battitura nella funzione MIN.", hints: ["Subquery con MIN", "WHERE quantita = (SELECT MIN(quantita) FROM ordini)"], explanation: "Subquery con MIN su quantità.", replacements: {} },
            { titleTemplate: "Subquery Prezzo >= Media", descTemplate: "Trova i prodotti che costano almeno quanto la media.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo >= (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo >= (SELECT AV(prezzo) FROM prodotti)", debugHint: "La funzione per la media è AVG, non AV.", hints: ["Subquery con >=", "WHERE prezzo >= (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery con >=", replacements: {} },
            { titleTemplate: "Subquery Prezzo <= Media", descTemplate: "Trova i prodotti che costano al massimo quanto la media.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo <= (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo <= (AVG(prezzo) FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery con <=", "WHERE prezzo <= (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery con <=", replacements: {} },
            { titleTemplate: "Subquery Stock >= Media", descTemplate: "Trova i prodotti con stock almeno quanto la media.", queryTemplate: "SELECT * FROM prodotti WHERE stock >= (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock >= (SELECT AVG(stoc) FROM prodotti)", debugHint: "Errore di battitura nel nome della colonna 'stock'.", hints: ["Subquery con >=", "WHERE stock >= (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery con >= su stock.", replacements: {} },
            { titleTemplate: "Subquery Stock <= Media", descTemplate: "Trova i prodotti con stock al massimo quanto la media.", queryTemplate: "SELECT * FROM prodotti WHERE stock <= (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock <= SELECT AVG(stock) FROM prodotti", debugHint: "Le subquery devono essere racchiuse tra parentesi.", hints: ["Subquery con <=", "WHERE stock <= (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery con <= su stock.", replacements: {} },
            { titleTemplate: "Subquery Voto >= Media", descTemplate: "Trova le recensioni con voto almeno quanto la media.", queryTemplate: "SELECT * FROM recensioni WHERE voto >= (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto >= (SELECT AVG(vot) FROM recensioni)", debugHint: "Errore di battitura nel nome della colonna 'voto'.", hints: ["Subquery con >=", "WHERE voto >= (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery con >= su voto.", replacements: {} },
            { titleTemplate: "Subquery Voto <= Media", descTemplate: "Trova le recensioni con voto al massimo quanto la media.", queryTemplate: "SELECT * FROM recensioni WHERE voto <= (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * recensioni WHERE voto <= (SELECT AVG(voto) FROM recensioni)", debugHint: "Manca la parola chiave FROM nella query principale.", hints: ["Subquery con <=", "WHERE voto <= (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery con <= su voto.", replacements: {} },
            { titleTemplate: "Subquery Quantità >= Media", descTemplate: "Trova gli ordini con quantità almeno quanto la media.", queryTemplate: "SELECT * FROM ordini WHERE quantita >= (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita >= (SELECT AVG(quantit) FROM ordini)", debugHint: "Errore di battitura nel nome della colonna 'quantita'.", hints: ["Subquery con >=", "WHERE quantita >= (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery con >= su quantità.", replacements: {} },
            { titleTemplate: "Subquery Quantità <= Media", descTemplate: "Trova gli ordini con quantità al massimo quanto la media.", queryTemplate: "SELECT * FROM ordini WHERE quantita <= (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita <= (SELECT AVG(quantita) ordini)", debugHint: "Manca la parola chiave FROM nella subquery.", hints: ["Subquery con <=", "WHERE quantita <= (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery con <= su quantità.", replacements: {} },
            { titleTemplate: "Subquery Prezzo > Massimo / 2", descTemplate: "Trova i prodotti che costano più della metà del prezzo massimo.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT MAX(prezzo) / 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > (SELECT MA(prezzo) / 2 FROM prodotti)", debugHint: "Errore di battitura nella funzione MAX.", hints: ["Subquery con calcolo", "WHERE prezzo > (SELECT MAX(prezzo) / 2 FROM prodotti)"], explanation: "Subquery con calcolo.", replacements: {} },
            { titleTemplate: "Subquery Stock > Massimo / 2", descTemplate: "Trova i prodotti con stock superiore alla metà dello stock massimo.", queryTemplate: "SELECT * FROM prodotti WHERE stock > (SELECT MAX(stock) / 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock > (MAX(stock) / 2 FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery con calcolo", "WHERE stock > (SELECT MAX(stock) / 2 FROM prodotti)"], explanation: "Subquery con calcolo su stock.", replacements: {} },
            { titleTemplate: "Subquery Voto > Massimo / 2", descTemplate: "Trova le recensioni con voto superiore alla metà del voto massimo.", queryTemplate: "SELECT * FROM recensioni WHERE voto > (SELECT MAX(voto) / 2 FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto > (SELECT MAX(vot) / 2 FROM recensioni)", debugHint: "Errore di battitura nel nome della colonna 'voto'.", hints: ["Subquery con calcolo", "WHERE voto > (SELECT MAX(voto) / 2 FROM recensioni)"], explanation: "Subquery con calcolo su voto.", replacements: {} },
            { titleTemplate: "Subquery Quantità > Massimo / 2", descTemplate: "Trova gli ordini con quantità superiore alla metà della quantità massima.", queryTemplate: "SELECT * FROM ordini WHERE quantita > (SELECT MAX(quantita) / 2 FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita > SELECT MAX(quantita) / 2 FROM ordini", debugHint: "Le subquery devono essere racchiuse tra parentesi.", hints: ["Subquery con calcolo", "WHERE quantita > (SELECT MAX(quantita) / 2 FROM ordini)"], explanation: "Subquery con calcolo su quantità.", replacements: {} },
            { titleTemplate: "Subquery Prezzo > Minimo * 2", descTemplate: "Trova i prodotti che costano più del doppio del prezzo minimo.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) * 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > (SELECT MI(prezzo) * 2 FROM prodotti)", debugHint: "Errore di battitura nella funzione MIN.", hints: ["Subquery con calcolo", "WHERE prezzo > (SELECT MIN(prezzo) * 2 FROM prodotti)"], explanation: "Subquery con calcolo minimo.", replacements: {} },
            { titleTemplate: "Subquery Stock < Massimo / 2", descTemplate: "Trova i prodotti con stock inferiore alla metà dello stock massimo.", queryTemplate: "SELECT * FROM prodotti WHERE stock < (SELECT MAX(stock) / 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock < (SELECT MAX(stock) / 2 prodotti)", debugHint: "Manca la parola chiave FROM nella subquery.", hints: ["Subquery con calcolo", "WHERE stock < (SELECT MAX(stock) / 2 FROM prodotti)"], explanation: "Subquery con calcolo stock minore.", replacements: {} },
            // NEW EXERCISES FOR ADVANCED EASY
            { titleTemplate: "Subquery IN Categorie", descTemplate: "Trova prodotti che appartengono alle categorie 'Elettronica' o 'Abbigliamento' usando subquery.", queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", brokenCode: "SELECT * FROM prodotti WHERE categoria_id I (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", debugHint: "Errore di battitura nell'operatore IN.", hints: ["Subquery con IN"], explanation: "Filtro su relazione.", replacements: {} },
            { titleTemplate: "Subquery NOT IN Categorie", descTemplate: "Trova prodotti che NON appartengono alle categorie 'Elettronica' o 'Abbigliamento' usando subquery.", queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", brokenCode: "SELECT * FROM prodotti WHERE categoria_id IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", debugHint: "Manca l'operatore NOT prima di IN.", hints: ["Subquery con NOT IN"], explanation: "Esclusione su relazione.", replacements: {} },
            { titleTemplate: "Subquery IN Fornitori", descTemplate: "Trova prodotti forniti da fornitori italiani usando subquery.", queryTemplate: "SELECT * FROM prodotti WHERE fornitore_id IN (SELECT id FROM fornitori WHERE nazione = 'Italia')", brokenCode: "SELECT * FROM prodotti WHERE fornitoreid IN (SELECT id FROM fornitori WHERE nazione = 'Italia')", debugHint: "Errore di battitura nel nome della colonna 'fornitore_id'.", hints: ["Subquery con IN"], explanation: "Filtro geografico indiretto.", replacements: {} },
            { titleTemplate: "Subquery ANY Prezzo", descTemplate: "Trova prodotti che costano più di ALMENO UNO dei prodotti della categoria 1 (ANY).", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > ANY (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > AN (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", debugHint: "Errore di battitura nell'operatore ANY.", hints: ["Subquery con ANY"], explanation: "Confronto con insieme.", replacements: {} },
            { titleTemplate: "Subquery ALL Prezzo", descTemplate: "Trova prodotti che costano più di TUTTI i prodotti della categoria 1 (ALL).", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > ALL (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > AL (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", debugHint: "Errore di battitura nell'operatore ALL.", hints: ["Subquery con ALL"], explanation: "Confronto totale.", replacements: {} },
            { titleTemplate: "Subquery FROM (Derived Table)", descTemplate: "Seleziona il prezzo medio dalla tabella derivata dei prodotti costosi (>100).", queryTemplate: "SELECT AVG(p.prezzo) FROM (SELECT * FROM prodotti WHERE prezzo > 100) as p", brokenCode: "SELECT AVG(p.prezzo) FROM (SELECT * FROM prodotti WHERE prezzo > 100)", debugHint: "Manca l'alias per la tabella derivata (es. 'as p').", hints: ["Subquery in FROM"], explanation: "Tabella derivata.", replacements: {} },
            { titleTemplate: "Subquery SELECT (Scalare)", descTemplate: "Seleziona nome prodotto e la differenza dal prezzo medio globale.", queryTemplate: "SELECT nome, prezzo - (SELECT AVG(prezzo) FROM prodotti) as DiffMedia FROM prodotti", brokenCode: "SELECT nome, prezzo - (SELECT AVG(prezzo)) as DiffMedia FROM prodotti", debugHint: "Manca la clausola FROM nella subquery.", hints: ["Subquery in SELECT"], explanation: "Calcolo relativo.", replacements: {} },
            { titleTemplate: "Subquery WHERE Data Recente", descTemplate: "Trova ordini fatti nell'ultimo mese disponibile (rispetto alla data massima).", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > (SELECT DATE_SUB(MAX(data_ordine), INTERVAL 1 MONTH) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE data_ordine > (SELECT DATESUB(MAX(data_ordine), INTERVAL 1 MONTH) FROM ordini)", debugHint: "Errore di battitura nella funzione DATE_SUB.", hints: ["Subquery data dinamica"], explanation: "Filtro temporale relativo.", replacements: {} },
            { titleTemplate: "Subquery WHERE Utente Attivo", descTemplate: "Trova ordini dell'utente che ha speso di più in totale (limit 1).", queryTemplate: "SELECT * FROM ordini WHERE utente_id = (SELECT utente_id FROM ordini GROUP BY utente_id ORDER BY SUM(quantita * 10) DESC LIMIT 1)", brokenCode: "SELECT * FROM ordini WHERE utente_id = (SELECT utente_id FROM ordini GROUP BY utente_id ORDER BY SUM(quantita * 10) DESC)", debugHint: "Manca la clausola LIMIT 1 nella subquery.", hints: ["Subquery con LIMIT"], explanation: "Targeting utente top.", replacements: {} },
            { titleTemplate: "Subquery WHERE Prodotto Popolare", descTemplate: "Trova recensioni del prodotto più recensito.", queryTemplate: "SELECT * FROM recensioni WHERE prodotto_id = (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id ORDER BY COUNT(*) DESC LIMIT 1)", brokenCode: "SELECT * FROM recensioni WHERE prodotto_id = (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id ORDER BY CONT(*) DESC LIMIT 1)", debugHint: "Errore di battitura nella funzione COUNT.", hints: ["Subquery aggregata"], explanation: "Focus su popolarità.", replacements: {} },
            { titleTemplate: "Subquery IN Utenti Premium", descTemplate: "Trova recensioni scritte da utenti Premium.", queryTemplate: "SELECT * FROM recensioni WHERE utente_id IN (SELECT id FROM utenti WHERE premium = TRUE)", brokenCode: "SELECT * FROM recensioni WHERE utente_id IN (SELECT id FROM utenti premium = TRUE)", debugHint: "Manca la parola chiave WHERE nella subquery.", hints: ["Subquery su booleano"], explanation: "Filtro segmento utente.", replacements: {} },
            { titleTemplate: "Subquery NOT IN Utenti Premium", descTemplate: "Trova ordini fatti da utenti NON Premium.", queryTemplate: "SELECT * FROM ordini WHERE utente_id NOT IN (SELECT id FROM utenti WHERE premium = TRUE)", brokenCode: "SELECT * FROM ordini WHERE utente_id NO IN (SELECT id FROM utenti WHERE premium = TRUE)", debugHint: "Errore di battitura nella parola chiave NOT.", hints: ["Subquery esclusione"], explanation: "Analisi segmento standard.", replacements: {} },
            { titleTemplate: "Subquery WHERE Prezzo > Minimo Categoria", descTemplate: "Trova prodotti che costano più del prezzo minimo della categoria 1.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) WHERE categoria_id = 1)", debugHint: "Manca la clausola FROM nella subquery.", hints: ["Subquery specifica"], explanation: "Confronto puntuale.", replacements: {} },
            { titleTemplate: "Subquery WHERE Stock < Media Categoria", descTemplate: "Trova prodotti con stock inferiore alla media della categoria 1.", queryTemplate: "SELECT * FROM prodotti WHERE stock < (SELECT AVG(stock) FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE stock < (SELECT AV(stock) FROM prodotti WHERE categoria_id = 1)", debugHint: "Errore di battitura nella funzione AVG.", hints: ["Subquery media parziale"], explanation: "Analisi stock relativa.", replacements: {} },
            { titleTemplate: "Subquery WHERE Voto > Media Prodotto", descTemplate: "Trova recensioni con voto superiore alla media del prodotto 1.", queryTemplate: "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni WHERE prodotto_id = 1)", brokenCode: "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni prodotto_id = 1)", debugHint: "Manca la parola chiave WHERE nella subquery.", hints: ["Subquery media specifica"], explanation: "Analisi qualità relativa.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Utenti con Ordini (Exists)", descTemplate: "Seleziona gli utenti che hanno fatto almeno un ordine usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["EXISTS con subquery", "WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)"], explanation: "EXISTS per verificare esistenza.", replacements: {} },
            { titleTemplate: "Utenti senza Ordini (NOT EXISTS)", descTemplate: "Seleziona gli utenti che NON hanno fatto ordini usando NOT EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)"], explanation: "NOT EXISTS per verificare assenza.", replacements: {} },
            { titleTemplate: "Prodotti con Recensioni (EXISTS)", descTemplate: "Seleziona i prodotti che hanno almeno una recensione usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["EXISTS con recensioni", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)"], explanation: "EXISTS per prodotti con recensioni.", replacements: {} },
            { titleTemplate: "Prodotti senza Recensioni (NOT EXISTS)", descTemplate: "Seleziona i prodotti che NON hanno recensioni usando NOT EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)"], explanation: "NOT EXISTS per prodotti senza recensioni.", replacements: {} },
            { titleTemplate: "Ordini con Spedizioni (EXISTS)", descTemplate: "Seleziona gli ordini che hanno una spedizione usando EXISTS.", queryTemplate: "SELECT * FROM ordini WHERE EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)", hints: ["EXISTS con spedizioni", "WHERE EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)"], explanation: "EXISTS per ordini con spedizioni.", replacements: {} },
            { titleTemplate: "Ordini senza Spedizioni (NOT EXISTS)", descTemplate: "Seleziona gli ordini che NON hanno spedizioni usando NOT EXISTS.", queryTemplate: "SELECT * FROM ordini WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)"], explanation: "NOT EXISTS per ordini senza spedizioni.", replacements: {} },
            { titleTemplate: "Utenti con Recensioni (EXISTS)", descTemplate: "Seleziona gli utenti che hanno scritto almeno una recensione usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)", hints: ["EXISTS con recensioni", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)"], explanation: "EXISTS per utenti con recensioni.", replacements: {} },
            { titleTemplate: "Utenti senza Recensioni (NOT EXISTS)", descTemplate: "Seleziona gli utenti che NON hanno scritto recensioni usando NOT EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)"], explanation: "NOT EXISTS per utenti senza recensioni.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE", descTemplate: "Seleziona gli utenti che hanno ordini dopo il 1 Gennaio 2023 usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01')", hints: ["EXISTS con WHERE", "WHERE EXISTS (SELECT 1 FROM ordini WHERE ... AND ordini.data_ordine > '2023-01-01')"], explanation: "EXISTS con condizione aggiuntiva.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Prezzo", descTemplate: "Seleziona i prodotti che hanno recensioni con voto >= 4 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4)", hints: ["EXISTS con WHERE", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.voto >= 4)"], explanation: "EXISTS con filtro voto.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Quantità", descTemplate: "Seleziona gli utenti che hanno ordini con quantità > 5 usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5)", hints: ["EXISTS con WHERE", "WHERE EXISTS (SELECT 1 FROM ordini WHERE ... AND ordini.quantita > 5)"], explanation: "EXISTS con filtro quantità.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Prezzo Prodotto", descTemplate: "Seleziona gli utenti che hanno ordinato prodotti > 100 euro usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.prezzo > 100)", hints: ["EXISTS con JOIN", "WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ... WHERE ... AND prodotti.prezzo > 100)"], explanation: "EXISTS con JOIN nella subquery.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Categoria", descTemplate: "Seleziona gli utenti che hanno ordinato prodotti della categoria 1 usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.categoria_id = 1)", hints: ["EXISTS con JOIN", "WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ... WHERE ... AND prodotti.categoria_id = 1)"], explanation: "EXISTS con JOIN e filtro categoria.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Fornitore", descTemplate: "Seleziona i prodotti che hanno recensioni e sono forniti da fornitore 1 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) AND prodotti.fornitore_id = 1", hints: ["EXISTS con AND", "WHERE EXISTS (...) AND prodotti.fornitore_id = 1"], explanation: "EXISTS con condizione aggiuntiva esterna.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Data", descTemplate: "Seleziona i prodotti che hanno recensioni dopo il 1 Gennaio 2023 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01')", hints: ["EXISTS con WHERE data", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.data_recensione > '2023-01-01')"], explanation: "EXISTS con filtro data.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Voto", descTemplate: "Seleziona i prodotti che hanno recensioni con voto = 5 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5)", hints: ["EXISTS con WHERE voto", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.voto = 5)"], explanation: "EXISTS con filtro voto specifico.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Stock", descTemplate: "Seleziona i prodotti con stock > 10 che hanno recensioni usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE stock > 10 AND EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["EXISTS con AND", "WHERE stock > 10 AND EXISTS (...)"], explanation: "EXISTS con condizione esterna.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Prezzo", descTemplate: "Seleziona i prodotti con prezzo > 50 che hanno recensioni usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > 50 AND EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["EXISTS con AND", "WHERE prezzo > 50 AND EXISTS (...)"], explanation: "EXISTS con filtro prezzo esterno.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Premium", descTemplate: "Seleziona gli utenti Premium che hanno ordini usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["EXISTS con AND", "WHERE premium = TRUE AND EXISTS (...)"], explanation: "EXISTS con filtro premium.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Paese", descTemplate: "Seleziona gli utenti italiani che hanno ordini usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["EXISTS con AND", "WHERE paese = 'Italia' AND EXISTS (...)"], explanation: "EXISTS con filtro paese.", replacements: {} },
            { titleTemplate: "EXISTS con ORDER BY", descTemplate: "Seleziona gli utenti che hanno ordini, ordinati per nome A-Z.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) ORDER BY nome ASC", hints: ["EXISTS con ORDER BY", "WHERE EXISTS (...) ORDER BY nome ASC"], explanation: "EXISTS con ordinamento.", replacements: {} },
            { titleTemplate: "EXISTS con ORDER BY Prezzo", descTemplate: "Seleziona i prodotti che hanno recensioni, ordinati per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC", hints: ["EXISTS con ORDER BY", "WHERE EXISTS (...) ORDER BY prezzo DESC"], explanation: "EXISTS con ordinamento prezzo.", replacements: {} },
            { titleTemplate: "EXISTS con LIMIT", descTemplate: "Seleziona i primi 5 utenti che hanno ordini.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) LIMIT 5", hints: ["EXISTS con LIMIT", "WHERE EXISTS (...) LIMIT 5"], explanation: "EXISTS con LIMIT.", replacements: {} },
            { titleTemplate: "EXISTS con ORDER BY e LIMIT", descTemplate: "Seleziona i primi 5 prodotti che hanno recensioni, ordinati per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC LIMIT 5", hints: ["EXISTS con ORDER BY e LIMIT", "WHERE EXISTS (...) ORDER BY prezzo DESC LIMIT 5"], explanation: "EXISTS con ordinamento e LIMIT.", replacements: {} },
            { titleTemplate: "EXISTS Complesso Finale", descTemplate: "Seleziona gli utenti Premium italiani che hanno ordini dopo il 1 Gennaio 2023, ordinati per nome A-Z.", queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') ORDER BY nome ASC", hints: ["EXISTS complesso", "WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (...) ORDER BY nome ASC"], explanation: "EXISTS complesso con filtri multipli e ordinamento.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE e LIMIT", descTemplate: "Seleziona i primi 3 utenti che hanno ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') LIMIT 3", hints: ["EXISTS con WHERE e LIMIT", "WHERE EXISTS (...) LIMIT 3"], explanation: "EXISTS con WHERE e LIMIT.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Prezzo e ORDER BY", descTemplate: "Seleziona i prodotti che hanno recensioni con voto >= 4, ordinati per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4) ORDER BY prezzo DESC", hints: ["EXISTS con WHERE e ORDER BY", "WHERE EXISTS (...) ORDER BY prezzo DESC"], explanation: "EXISTS con WHERE e ordinamento.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Quantità e LIMIT", descTemplate: "Seleziona i primi 5 utenti che hanno ordini con quantità > 5.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5) LIMIT 5", hints: ["EXISTS con WHERE e LIMIT", "WHERE EXISTS (...) LIMIT 5"], explanation: "EXISTS con WHERE quantità e LIMIT.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Data e ORDER BY", descTemplate: "Seleziona i prodotti che hanno recensioni dopo il 1 Gennaio 2023, ordinati per prezzo crescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01') ORDER BY prezzo ASC", hints: ["EXISTS con WHERE data e ORDER BY", "WHERE EXISTS (...) ORDER BY prezzo ASC"], explanation: "EXISTS con WHERE data e ordinamento.", replacements: {} },
            { titleTemplate: "EXISTS con WHERE Voto e LIMIT", descTemplate: "Seleziona i primi 3 prodotti che hanno recensioni con voto = 5.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5) LIMIT 3", hints: ["EXISTS con WHERE voto e LIMIT", "WHERE EXISTS (...) LIMIT 3"], explanation: "EXISTS con WHERE voto e LIMIT.", replacements: {} },
            // NEW EXERCISES FOR ADVANCED MEDIUM
            { titleTemplate: "Correlated Subquery Prezzo", descTemplate: "Trova prodotti che costano più della media della LORO categoria.", queryTemplate: "SELECT * FROM prodotti p1 WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)", hints: ["Subquery correlata"], explanation: "Confronto relativo al gruppo.", replacements: {} },
            { titleTemplate: "Correlated Subquery Stock", descTemplate: "Trova prodotti con stock inferiore alla media della LORO categoria.", queryTemplate: "SELECT * FROM prodotti p1 WHERE stock < (SELECT AVG(stock) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)", hints: ["Subquery correlata stock"], explanation: "Analisi inventario relativa.", replacements: {} },
            { titleTemplate: "Correlated Subquery Voto", descTemplate: "Trova recensioni con voto superiore alla media del LORO prodotto.", queryTemplate: "SELECT * FROM recensioni r1 WHERE voto > (SELECT AVG(voto) FROM recensioni r2 WHERE r2.prodotto_id = r1.prodotto_id)", hints: ["Subquery correlata voto"], explanation: "Analisi sentiment relativa.", replacements: {} },
            { titleTemplate: "Subquery SELECT Conteggio", descTemplate: "Per ogni categoria, seleziona nome e numero di prodotti (usando subquery in SELECT).", queryTemplate: "SELECT nome, (SELECT COUNT(*) FROM prodotti WHERE categoria_id = categorie.id) as NumProdotti FROM categorie", hints: ["Subquery in SELECT"], explanation: "Conteggio correlato.", replacements: {} },
            { titleTemplate: "Subquery SELECT Media Prezzo", descTemplate: "Per ogni fornitore, seleziona nome e prezzo medio prodotti (usando subquery in SELECT).", queryTemplate: "SELECT azienda, (SELECT AVG(prezzo) FROM prodotti WHERE fornitore_id = fornitori.id) as PrezzoMedio FROM fornitori", hints: ["Subquery in SELECT media"], explanation: "Aggregazione correlata.", replacements: {} },
            { titleTemplate: "Subquery SELECT Ultimo Ordine", descTemplate: "Per ogni utente, seleziona nome e data ultimo ordine (usando subquery in SELECT).", queryTemplate: "SELECT nome, (SELECT MAX(data_ordine) FROM ordini WHERE utente_id = utenti.id) as UltimoOrdine FROM utenti", hints: ["Subquery in SELECT max"], explanation: "Data correlata.", replacements: {} },
            { titleTemplate: "EXISTS Utenti Attivi Recenti", descTemplate: "Utenti che hanno fatto ordini nell'ultimo mese (usando EXISTS e data dinamica).", queryTemplate: "SELECT * FROM utenti u WHERE EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id AND o.data_ordine > '2023-12-01')", hints: ["EXISTS con data"], explanation: "Filtro attività recente.", replacements: {} },
            { titleTemplate: "NOT EXISTS Prodotti Invenduti", descTemplate: "Prodotti che non sono mai stati ordinati (NOT EXISTS).", queryTemplate: "SELECT * FROM prodotti p WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.prodotto_id = p.id)", hints: ["NOT EXISTS ordini"], explanation: "Analisi invenduto.", replacements: {} },
            { titleTemplate: "NOT EXISTS Utenti Inattivi", descTemplate: "Utenti che non hanno mai fatto ordini (NOT EXISTS).", queryTemplate: "SELECT * FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id)", hints: ["NOT EXISTS utenti"], explanation: "Analisi churn.", replacements: {} },
            { titleTemplate: "Subquery WHERE IN Multiplo", descTemplate: "Trova prodotti che sono stati ordinati da utenti Premium (IN con JOIN interna).", queryTemplate: "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE)", hints: ["IN con JOIN"], explanation: "Filtro trasversale.", replacements: {} },
            { titleTemplate: "Subquery WHERE IN Aggregato", descTemplate: "Trova utenti che hanno fatto più di 5 ordini (IN con GROUP BY).", queryTemplate: "SELECT * FROM utenti WHERE id IN (SELECT utente_id FROM ordini GROUP BY utente_id HAVING COUNT(*) > 5)", hints: ["IN con HAVING"], explanation: "Filtro su aggregati.", replacements: {} },
            { titleTemplate: "Subquery WHERE IN Media Alta", descTemplate: "Trova prodotti con media voti > 4 (IN con GROUP BY).", queryTemplate: "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) > 4)", hints: ["IN con HAVING AVG"], explanation: "Qualità alta.", replacements: {} },
            { titleTemplate: "Correlated Subquery Max", descTemplate: "Trova il prodotto più costoso per ogni categoria (WHERE prezzo = Max Categoria).", queryTemplate: "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)", hints: ["Subquery max correlata"], explanation: "Top per gruppo.", replacements: {} },
            { titleTemplate: "Correlated Subquery Min", descTemplate: "Trova il prodotto meno costoso per ogni fornitore.", queryTemplate: "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti p2 WHERE p2.fornitore_id = p1.fornitore_id)", hints: ["Subquery min correlata"], explanation: "Best price per fornitore.", replacements: {} },
            { titleTemplate: "Subquery in UPDATE (Simulato)", descTemplate: "Seleziona prodotti che verrebbero aggiornati (prezzo < media).", queryTemplate: "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)", hints: ["Simulazione update"], explanation: "Targeting massivo.", replacements: {} }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Ranking Prodotti", descTemplate: "Assegna un rango ai prodotti in base al prezzo (dal più caro) usando una Window Function simulata o nativa se supportata come 'rango'.", queryTemplate: "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["RANK() OVER", "RANK() OVER (ORDER BY prezzo DESC) as rango"], explanation: "Window Function RANK.", replacements: {} },
            { titleTemplate: "Ranking Stock", descTemplate: "Assegna un rango ai prodotti in base allo stock (dal più alto) usando RANK() come 'rango'.", queryTemplate: "SELECT nome, stock, RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti", hints: ["RANK() OVER", "RANK() OVER (ORDER BY stock DESC) as rango"], explanation: "RANK su stock.", replacements: {} },
            { titleTemplate: "Ranking Voti", descTemplate: "Assegna un rango alle recensioni in base al voto (dal più alto) usando RANK() come 'rango'.", queryTemplate: "SELECT voto, RANK() OVER (ORDER BY voto DESC) as rango FROM recensioni", hints: ["RANK() OVER", "RANK() OVER (ORDER BY voto DESC) as rango"], explanation: "RANK su voti.", replacements: {} },
            { titleTemplate: "Ranking Quantità", descTemplate: "Assegna un rango agli ordini in base alla quantità (dal più alto) usando RANK() come 'rango'.", queryTemplate: "SELECT quantita, RANK() OVER (ORDER BY quantita DESC) as rango FROM ordini", hints: ["RANK() OVER", "RANK() OVER (ORDER BY quantita DESC) as rango"], explanation: "RANK su quantità.", replacements: {} },
            { titleTemplate: "DENSE_RANK Prodotti", descTemplate: "Assegna un rango denso ai prodotti in base al prezzo (dal più caro) usando DENSE_RANK() come 'rango'.", queryTemplate: "SELECT nome, prezzo, DENSE_RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["DENSE_RANK() OVER", "DENSE_RANK() OVER (ORDER BY prezzo DESC) as rango"], explanation: "Window Function DENSE_RANK.", replacements: {} },
            { titleTemplate: "DENSE_RANK Stock", descTemplate: "Assegna un rango denso ai prodotti in base allo stock (dal più alto) usando DENSE_RANK() come 'rango'.", queryTemplate: "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti", hints: ["DENSE_RANK() OVER", "DENSE_RANK() OVER (ORDER BY stock DESC) as rango"], explanation: "DENSE_RANK su stock.", replacements: {} },
            { titleTemplate: "ROW_NUMBER Prodotti", descTemplate: "Assegna un numero di riga ai prodotti in base al prezzo (dal più caro) usando ROW_NUMBER() come 'numero'.", queryTemplate: "SELECT nome, prezzo, ROW_NUMBER() OVER (ORDER BY prezzo DESC) as numero FROM prodotti", hints: ["ROW_NUMBER() OVER", "ROW_NUMBER() OVER (ORDER BY prezzo DESC) as numero"], explanation: "Window Function ROW_NUMBER.", replacements: {} },
            { titleTemplate: "ROW_NUMBER Stock", descTemplate: "Assegna un numero di riga ai prodotti in base allo stock (dal più alto) usando ROW_NUMBER() come 'numero'.", queryTemplate: "SELECT nome, stock, ROW_NUMBER() OVER (ORDER BY stock DESC) as numero FROM prodotti", hints: ["ROW_NUMBER() OVER", "ROW_NUMBER() OVER (ORDER BY stock DESC) as numero"], explanation: "ROW_NUMBER su stock.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY Categoria", descTemplate: "Assegna un rango ai prodotti per categoria in base al prezzo (dal più caro) usando RANK() con PARTITION BY come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["RANK() OVER PARTITION BY", "RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango"], explanation: "RANK con PARTITION BY.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY Categoria", descTemplate: "Assegna un rango denso ai prodotti per categoria in base al prezzo (dal più caro) usando DENSE_RANK() con PARTITION BY come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["DENSE_RANK() OVER PARTITION BY", "DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango"], explanation: "DENSE_RANK con PARTITION BY.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY Categoria", descTemplate: "Assegna un numero di riga ai prodotti per categoria in base al prezzo (dal più caro) usando ROW_NUMBER() con PARTITION BY come 'numero'.", queryTemplate: "SELECT nome, categoria_id, prezzo, ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as numero FROM prodotti", hints: ["ROW_NUMBER() OVER PARTITION BY", "ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as numero"], explanation: "ROW_NUMBER con PARTITION BY.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY Utente", descTemplate: "Assegna un rango agli ordini per utente in base alla quantità (dal più alto) usando RANK() con PARTITION BY come 'rango'.", queryTemplate: "SELECT utente_id, quantita, RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as rango FROM ordini", hints: ["RANK() OVER PARTITION BY", "RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as rango"], explanation: "RANK con PARTITION BY utente.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY Prodotto", descTemplate: "Assegna un rango denso alle recensioni per prodotto in base al voto (dal più alto) usando DENSE_RANK() con PARTITION BY come 'rango'.", queryTemplate: "SELECT prodotto_id, voto, DENSE_RANK() OVER (PARTITION BY prodotto_id ORDER BY voto DESC) as rango FROM recensioni", hints: ["DENSE_RANK() OVER PARTITION BY", "DENSE_RANK() OVER (PARTITION BY prodotto_id ORDER BY voto DESC) as rango"], explanation: "DENSE_RANK con PARTITION BY prodotto.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY Utente", descTemplate: "Assegna un numero di riga agli ordini per utente in base alla data (dal più recente) usando ROW_NUMBER() con PARTITION BY come 'numero'.", queryTemplate: "SELECT utente_id, data_ordine, ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY data_ordine DESC) as numero FROM ordini", hints: ["ROW_NUMBER() OVER PARTITION BY", "ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY data_ordine DESC) as numero"], explanation: "ROW_NUMBER con PARTITION BY utente.", replacements: {} },
            { titleTemplate: "RANK con WHERE", descTemplate: "Assegna un rango ai prodotti con prezzo > 50 in base al prezzo (dal più caro) usando RANK() come 'rango'.", queryTemplate: "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50", hints: ["RANK() con WHERE", "WHERE prezzo > 50"], explanation: "RANK con filtro.", replacements: {} },
            { titleTemplate: "DENSE_RANK con WHERE", descTemplate: "Assegna un rango denso ai prodotti con stock > 10 in base allo stock (dal più alto) usando DENSE_RANK() come 'rango'.", queryTemplate: "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti WHERE stock > 10", hints: ["DENSE_RANK() con WHERE", "WHERE stock > 10"], explanation: "DENSE_RANK con filtro.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con WHERE", descTemplate: "Assegna un numero di riga alle recensioni con voto >= 4 in base al voto (dal più alto) usando ROW_NUMBER() come 'numero'.", queryTemplate: "SELECT voto, ROW_NUMBER() OVER (ORDER BY voto DESC) as numero FROM recensioni WHERE voto >= 4", hints: ["ROW_NUMBER() con WHERE", "WHERE voto >= 4"], explanation: "ROW_NUMBER con filtro.", replacements: {} },
            { titleTemplate: "RANK con LIMIT", descTemplate: "Assegna un rango ai prodotti in base al prezzo (dal più caro) e mostra solo i primi 5 usando RANK() come 'rango'.", queryTemplate: "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti ORDER BY prezzo DESC LIMIT 5", hints: ["RANK() con LIMIT", "ORDER BY prezzo DESC LIMIT 5"], explanation: "RANK con LIMIT.", replacements: {} },
            { titleTemplate: "DENSE_RANK con LIMIT", descTemplate: "Assegna un rango denso ai prodotti in base allo stock (dal più alto) e mostra solo i primi 5 usando DENSE_RANK() come 'rango'.", queryTemplate: "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti ORDER BY stock DESC LIMIT 5", hints: ["DENSE_RANK() con LIMIT", "ORDER BY stock DESC LIMIT 5"], explanation: "DENSE_RANK con LIMIT.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con LIMIT", descTemplate: "Assegna un numero di riga alle recensioni in base al voto (dal più alto) e mostra solo le prime 5 usando ROW_NUMBER() come 'numero'.", queryTemplate: "SELECT voto, ROW_NUMBER() OVER (ORDER BY voto DESC) as numero FROM recensioni ORDER BY voto DESC LIMIT 5", hints: ["ROW_NUMBER() con LIMIT", "ORDER BY voto DESC LIMIT 5"], explanation: "ROW_NUMBER con LIMIT.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e WHERE", descTemplate: "Assegna un rango ai prodotti per categoria con prezzo > 50 in base al prezzo (dal più caro) usando RANK() con PARTITION BY e WHERE come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50", hints: ["RANK() OVER PARTITION BY con WHERE", "WHERE prezzo > 50"], explanation: "RANK con PARTITION BY e filtro.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY e WHERE", descTemplate: "Assegna un rango denso ai prodotti per categoria con stock > 10 in base allo stock (dal più alto) usando DENSE_RANK() con PARTITION BY e WHERE come 'rango'.", queryTemplate: "SELECT nome, categoria_id, stock, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY stock DESC) as rango FROM prodotti WHERE stock > 10", hints: ["DENSE_RANK() OVER PARTITION BY con WHERE", "WHERE stock > 10"], explanation: "DENSE_RANK con PARTITION BY e filtro.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY e WHERE", descTemplate: "Assegna un numero di riga agli ordini per utente con quantità > 3 in base alla quantità (dal più alto) usando ROW_NUMBER() con PARTITION BY e WHERE come 'numero'.", queryTemplate: "SELECT utente_id, quantita, ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as numero FROM ordini WHERE quantita > 3", hints: ["ROW_NUMBER() OVER PARTITION BY con WHERE", "WHERE quantita > 3"], explanation: "ROW_NUMBER con PARTITION BY e filtro.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e LIMIT", descTemplate: "Assegna un rango ai prodotti per categoria in base al prezzo (dal più caro) e mostra solo i primi 3 per categoria usando RANK() con PARTITION BY come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) <= 3", hints: ["RANK() OVER PARTITION BY con filtro", "WHERE RANK() OVER (...) <= 3"], explanation: "RANK con PARTITION BY e LIMIT simulato.", replacements: {} },
            { titleTemplate: "Window Function Complessa Finale", descTemplate: "Assegna un rango denso ai prodotti per categoria con prezzo > 50 in base al prezzo (dal più caro), mostra solo i primi 3 per categoria usando DENSE_RANK() con PARTITION BY e WHERE come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50 AND DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) <= 3", hints: ["DENSE_RANK() OVER PARTITION BY complesso", "WHERE prezzo > 50 AND DENSE_RANK() OVER (...) <= 3"], explanation: "Window Function complessa con PARTITION BY, WHERE e LIMIT simulato.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e ORDER BY Multiplo", descTemplate: "Assegna un rango ai prodotti per categoria in base al prezzo (dal più caro) e stock (dal più alto) usando RANK() con PARTITION BY e ORDER BY multiplo come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, stock, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango FROM prodotti", hints: ["RANK() OVER PARTITION BY con ORDER BY multiplo", "RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango"], explanation: "RANK con PARTITION BY e ORDER BY multiplo.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY e ORDER BY Multiplo", descTemplate: "Assegna un rango denso agli ordini per utente in base alla quantità (dal più alto) e data (dal più recente) usando DENSE_RANK() con PARTITION BY e ORDER BY multiplo come 'rango'.", queryTemplate: "SELECT utente_id, quantita, data_ordine, DENSE_RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC, data_ordine DESC) as rango FROM ordini", hints: ["DENSE_RANK() OVER PARTITION BY con ORDER BY multiplo", "DENSE_RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC, data_ordine DESC) as rango"], explanation: "DENSE_RANK con PARTITION BY e ORDER BY multiplo.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY e ORDER BY Multiplo", descTemplate: "Assegna un numero di riga alle recensioni per prodotto in base al voto (dal più alto) e data (dal più recente) usando ROW_NUMBER() con PARTITION BY e ORDER BY multiplo come 'numero'.", queryTemplate: "SELECT prodotto_id, voto, data_recensione, ROW_NUMBER() OVER (PARTITION BY prodotto_id ORDER BY voto DESC, data_recensione DESC) as numero FROM recensioni", hints: ["ROW_NUMBER() OVER PARTITION BY con ORDER BY multiplo", "ROW_NUMBER() OVER (PARTITION BY prodotto_id ORDER BY voto DESC, data_recensione DESC) as numero"], explanation: "ROW_NUMBER con PARTITION BY e ORDER BY multiplo.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e WHERE Complesso", descTemplate: "Assegna un rango ai prodotti per categoria con prezzo > 50 E stock > 10 in base al prezzo (dal più caro) usando RANK() con PARTITION BY e WHERE multiplo come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, stock, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50 AND stock > 10", hints: ["RANK() OVER PARTITION BY con WHERE multiplo", "WHERE prezzo > 50 AND stock > 10"], explanation: "RANK con PARTITION BY e WHERE multiplo.", replacements: {} },
            { titleTemplate: "Window Function Finale Complessa", descTemplate: "Assegna un rango denso ai prodotti per categoria con prezzo > 50 in base al prezzo (dal più caro), mostra solo i primi 3 per categoria usando DENSE_RANK() con PARTITION BY, WHERE e ORDER BY multiplo come 'rango'.", queryTemplate: "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango FROM prodotti WHERE prezzo > 50 AND DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) <= 3", hints: ["DENSE_RANK() OVER PARTITION BY finale", "WHERE prezzo > 50 AND DENSE_RANK() OVER (...) <= 3"], explanation: "Window Function finale complessa con PARTITION BY, WHERE multiplo e ORDER BY multiplo.", replacements: {} },
            // NEW EXERCISES FOR ADVANCED HARD
            { titleTemplate: "CTE Semplice", descTemplate: "Usa una CTE per calcolare la media prezzi e poi seleziona prodotti sopra media.", queryTemplate: "WITH MediaPrezzi AS (SELECT AVG(prezzo) as avg_p FROM prodotti) SELECT * FROM prodotti, MediaPrezzi WHERE prezzo > avg_p", hints: ["WITH CTE"], explanation: "CTE base.", replacements: {} },
            { titleTemplate: "CTE Multipla", descTemplate: "Usa due CTE: una per prodotti costosi, una per economici, poi uniscili.", queryTemplate: "WITH Costosi AS (SELECT * FROM prodotti WHERE prezzo > 100), Economici AS (SELECT * FROM prodotti WHERE prezzo < 20) SELECT * FROM Costosi UNION SELECT * FROM Economici", hints: ["WITH CTE1, CTE2"], explanation: "CTE multiple.", replacements: {} },
            { titleTemplate: "CTE con Aggregazione", descTemplate: "Usa CTE per calcolare totale vendite per utente, poi trova chi ha speso > 1000.", queryTemplate: "WITH SpeseUtenti AS (SELECT utente_id, SUM(quantita * 10) as totale FROM ordini GROUP BY utente_id) SELECT * FROM SpeseUtenti WHERE totale > 1000", hints: ["CTE Group By"], explanation: "CTE per pre-aggregazione.", replacements: {} },
            { titleTemplate: "Window Function LAG", descTemplate: "Confronta il prezzo di ogni prodotto con il precedente (ordinato per prezzo).", queryTemplate: "SELECT nome, prezzo, LAG(prezzo) OVER (ORDER BY prezzo) as PrezzoPrecedente FROM prodotti", hints: ["LAG() OVER"], explanation: "Accesso riga precedente.", replacements: {} },
            { titleTemplate: "Window Function LEAD", descTemplate: "Confronta il prezzo di ogni prodotto con il successivo (ordinato per prezzo).", queryTemplate: "SELECT nome, prezzo, LEAD(prezzo) OVER (ORDER BY prezzo) as PrezzoSuccessivo FROM prodotti", hints: ["LEAD() OVER"], explanation: "Accesso riga successiva.", replacements: {} },
            { titleTemplate: "Window Function NTILE", descTemplate: "Dividi i prodotti in 4 gruppi di prezzo (Quartili).", queryTemplate: "SELECT nome, prezzo, NTILE(4) OVER (ORDER BY prezzo) as Quartile FROM prodotti", hints: ["NTILE(4)"], explanation: "Statistica descrittiva.", replacements: {} },
            { titleTemplate: "Window Function Running Total", descTemplate: "Calcola somma cumulativa dello stock ordinato per ID.", queryTemplate: "SELECT id, stock, SUM(stock) OVER (ORDER BY id) as StockCumulativo FROM prodotti", hints: ["SUM() OVER ORDER BY"], explanation: "Totale progressivo.", replacements: {} },
            { titleTemplate: "Window Function Moving Avg", descTemplate: "Calcola media mobile del prezzo sugli ultimi 3 prodotti (ordinati per ID).", queryTemplate: "SELECT id, prezzo, AVG(prezzo) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as MediaMobile FROM prodotti", hints: ["ROWS BETWEEN"], explanation: "Media mobile.", replacements: {} },
            { titleTemplate: "CTE Ricorsiva (Simulata)", descTemplate: "Genera una sequenza di numeri da 1 a 5 (se supportata, altrimenti CTE statica).", queryTemplate: "WITH RECURSIVE Numeri AS (SELECT 1 as n UNION ALL SELECT n + 1 FROM Numeri WHERE n < 5) SELECT * FROM Numeri", hints: ["WITH RECURSIVE"], explanation: "Generazione sequenza.", replacements: {} },
            { titleTemplate: "CTE per Classifica", descTemplate: "Usa CTE per calcolare rank vendite, poi filtra top 3.", queryTemplate: "WITH Classifica AS (SELECT utente_id, RANK() OVER (ORDER BY COUNT(*) DESC) as rnk FROM ordini GROUP BY utente_id) SELECT * FROM Classifica WHERE rnk <= 3", hints: ["CTE con Window Func"], explanation: "Ranking pulito.", replacements: {} },
            { titleTemplate: "Window Function Percent Rank", descTemplate: "Calcola il rango percentuale del prezzo dei prodotti.", queryTemplate: "SELECT nome, prezzo, PERCENT_RANK() OVER (ORDER BY prezzo) as PctRank FROM prodotti", hints: ["PERCENT_RANK()"], explanation: "Statistica avanzata.", replacements: {} },
            { titleTemplate: "Window Function First Value", descTemplate: "Per ogni categoria, mostra il prodotto e il prezzo del più economico della categoria.", queryTemplate: "SELECT nome, categoria_id, prezzo, FIRST_VALUE(prezzo) OVER (PARTITION BY categoria_id ORDER BY prezzo ASC) as PrezzoMinCategoria FROM prodotti", hints: ["FIRST_VALUE()"], explanation: "Confronto con primo.", replacements: {} },
            { titleTemplate: "Window Function Last Value", descTemplate: "Per ogni categoria, mostra il prodotto e il prezzo del più costoso (attenzione al frame).", queryTemplate: "SELECT nome, categoria_id, prezzo, LAST_VALUE(prezzo) OVER (PARTITION BY categoria_id ORDER BY prezzo ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as PrezzoMaxCategoria FROM prodotti", hints: ["LAST_VALUE() con Frame"], explanation: "Confronto con ultimo.", replacements: {} },
            { titleTemplate: "CTE con Join Complessa", descTemplate: "CTE per prodotti venduti, CTE per prodotti recensiti, Join per trovare prodotti popolari e venduti.", queryTemplate: "WITH Venduti AS (SELECT DISTINCT prodotto_id FROM ordini), Recensiti AS (SELECT DISTINCT prodotto_id FROM recensioni) SELECT * FROM Venduti JOIN Recensiti ON Venduti.prodotto_id = Recensiti.prodotto_id", hints: ["CTE Join"], explanation: "Logica a step.", replacements: {} },
            { titleTemplate: "Window Function Partition Avg Diff", descTemplate: "Calcola differenza tra prezzo prodotto e media della sua categoria.", queryTemplate: "SELECT nome, prezzo, prezzo - AVG(prezzo) OVER (PARTITION BY categoria_id) as DiffDaMedia FROM prodotti", hints: ["AVG() OVER PARTITION"], explanation: "Scostamento dalla media.", replacements: {} }
        ]
    }
};

export const generateExercises = (topicId: TopicId, difficulty: Difficulty): Exercise[] => {
    const exercises: Exercise[] = [];
    const TOTAL = 30; // 30 per difficoltà = 90 totali per topic

    try {
        const topicData = QUESTION_DATABASE[topicId];
        // Fallback logic
        let blueprints = topicData?.[difficulty];
        if (!blueprints || blueprints.length === 0) blueprints = topicData?.[Difficulty.Easy];
        if (!blueprints || blueprints.length === 0) {
            return [{
                id: 'empty',
                topicId,
                difficulty,
                title: "Nessun Esercizio",
                description: "Cambia argomento o difficoltà.",
                initialQuery: "",
                solutionQuery: "SELECT 1",
                hints: [],
                explanation: ""
            }];
        }

        // Ensure we have enough unique blueprints
        if (blueprints.length < TOTAL) {
            console.warn(`Warning: Only ${blueprints.length} blueprints available for ${topicId}/${difficulty}, need ${TOTAL}`);
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
            const bpIndex = exercises.length < shuffledBlueprints.length
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
                Object.keys(bp.replacements).forEach(key => {
                    const vals = bp.replacements![key];
                    const val = getRandomItem(vals);
                    replacementValues[key] = val;
                    const regex = new RegExp(`\\{${key}\\}`, 'g');

                    title = title.replace(regex, String(val));
                    desc = desc.replace(regex, String(val));
                    query = query.replace(regex, String(val));
                    hints = hints.map(h => h.replace(regex, String(val)));
                });
            }

            // Create unique key for this combination
            const combinationKey = `${bp.titleTemplate}_${JSON.stringify(replacementValues)}`;

            // Skip if this exact combination was already used
            if (usedCombinations.has(combinationKey)) {
                continue;
            }

            usedCombinations.add(combinationKey);

            // Add timestamp and random ID for uniqueness
            exercises.push({
                id: `${topicId}_${difficulty}_${exercises.length}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                topicId,
                difficulty,
                title,
                description: desc,
                initialQuery: "",
                solutionQuery: query,
                brokenCode: bp.brokenCode,  // Add broken code for Debug Mode
                debugHint: bp.debugHint,    // Add debug hint for Debug Mode
                hints: hints,
                explanation: bp.explanation
            });
        }

        // Final shuffle to mix exercises
        return shuffleArray(exercises);
    } catch (e) {
        console.error("Generator Error:", e);
        return [{
            id: 'error',
            topicId,
            difficulty,
            title: "Errore",
            description: "Si è verificato un errore nella generazione.",
            initialQuery: "",
            solutionQuery: "SELECT 1",
            hints: [],
            explanation: ""
        }];
    }
};