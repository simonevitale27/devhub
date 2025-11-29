
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
                descTemplate: "Per un'analisi di classificazione interna, estrai la colonna 'categoria_id' dalla tabella 'prodotti'.",
                queryTemplate: "SELECT categoria_id FROM prodotti",
                hints: ["Seleziona la colonna 'categoria_id'.", "La tabella è 'prodotti'."],
                explanation: "Le chiavi esterne come categoria_id collegano i dati tra tabelle diverse.",
                replacements: {},
                brokenCode: "SELECT categoria id FROM prodotti",
                debugHint: "Il nome della colonna 'categoria_id' contiene un trattino basso (underscore). Non usare spazi."
            },
            {
                titleTemplate: "ID Fornitori",
                descTemplate: "Il sistema di gestione scorte necessita della colonna 'fornitore_id' dalla tabella 'prodotti'.",
                queryTemplate: "SELECT fornitore_id FROM prodotti",
                hints: ["Seleziona 'fornitore_id' dalla tabella 'prodotti'.", "Utile per capire chi fornisce cosa."],
                explanation: "Identificare i fornitori è il primo passo per gestire gli approvvigionamenti.",
                replacements: {},
                brokenCode: "SELECT fornitore-id FROM prodotti",
                debugHint: "I nomi delle colonne usano l'underscore (_), non il trattino (-)."
            },
            {
                titleTemplate: "ID Ordini",
                descTemplate: "Per un controllo sequenziale, estrai la colonna 'id' dalla tabella 'ordini'.",
                queryTemplate: "SELECT id FROM ordini",
                hints: ["Seleziona la colonna 'id' dalla tabella 'ordini'.", "Gli ID sono univoci per ogni ordine."],
                explanation: "Gli ID sequenziali aiutano a tracciare il volume degli ordini nel tempo.",
                replacements: {},
                brokenCode: "SELECT id FROM ordini WHERE id",
                debugHint: "La clausola WHERE è incompleta. Rimuovila se vuoi tutti gli ID."
            },
            {
                titleTemplate: "Date Ordini",
                descTemplate: "L'analista vuole studiare la stagionalità delle vendite. Estrai la colonna 'data_ordine' dalla tabella 'ordini'.",
                queryTemplate: "SELECT data_ordine FROM ordini",
                hints: ["La colonna da selezionare è 'data_ordine'.", "La tabella è 'ordini'."],
                explanation: "Analizzare le date degli ordini rivela i picchi di vendita.",
                replacements: {},
                brokenCode: "SELECT data ordine FROM ordini",
                debugHint: "Manca l'underscore nel nome della colonna 'data_ordine'."
            },
            {
                titleTemplate: "Quantità Ordinate",
                descTemplate: "Per calcolare il volume medio di vendita, estrai la colonna 'quantita' dalla tabella 'ordini'.",
                queryTemplate: "SELECT quantita FROM ordini",
                hints: ["Seleziona 'quantita' dalla tabella 'ordini'.", "Vedrai quanti pezzi sono stati ordinati per riga."],
                explanation: "I dati sulle quantità aiutano a dimensionare la logistica.",
                replacements: {},
                brokenCode: "SELECT quantity FROM ordini",
                debugHint: "Usa il nome italiano della colonna: 'quantita'."
            },
            {
                titleTemplate: "Nomi Categorie",
                descTemplate: "Il team UX vuole ridisegnare il menu di navigazione. Estrai la colonna 'nome' dalla tabella 'categorie'.",
                queryTemplate: "SELECT nome FROM categorie",
                hints: ["Seleziona 'nome' dalla tabella 'categorie'.", "Questi nomi appariranno nel menu del sito."],
                explanation: "I nomi delle categorie sono essenziali per la navigazione dell'utente.",
                replacements: {},
                brokenCode: "SELECT nome FROM categorie ORDER BY",
                debugHint: "Hai lasciato un 'ORDER BY' incompleto alla fine. Rimuovilo."
            },
            {
                titleTemplate: "Descrizioni Categorie",
                descTemplate: "Per migliorare la SEO, estrai la colonna 'descrizione' dalla tabella 'categorie'.",
                queryTemplate: "SELECT descrizione FROM categorie",
                hints: ["Seleziona la colonna 'descrizione'.", "La tabella è 'categorie'."],
                explanation: "Le descrizioni aiutano i motori di ricerca a indicizzare i contenuti.",
                replacements: {},
                brokenCode: "SELECT desc FROM categorie",
                debugHint: "Il nome della colonna è 'descrizione', non l'abbreviazione 'desc'."
            },
            {
                titleTemplate: "Aziende Fornitori",
                descTemplate: "Il responsabile partnership vuole una lista. Estrai la colonna 'azienda' dalla tabella 'fornitori'.",
                queryTemplate: "SELECT azienda FROM fornitori",
                hints: ["Seleziona la colonna 'azienda' dalla tabella 'fornitori'.", "Otterrai la ragione sociale dei partner."],
                explanation: "Conoscere i propri partner commerciali è fondamentale per il business.",
                replacements: {},
                brokenCode: "SELECT azienda FROM fornitore",
                debugHint: "Il nome della tabella è al plurale: 'fornitori'."
            },
            {
                titleTemplate: "Nazioni Fornitori",
                descTemplate: "Per valutare i rischi geopolitici, estrai la colonna 'nazione' dalla tabella 'fornitori'.",
                queryTemplate: "SELECT nazione FROM fornitori",
                hints: ["Seleziona 'nazione' dalla tabella 'fornitori'.", "Utile per mappare la supply chain."],
                explanation: "La diversificazione geografica dei fornitori riduce i rischi.",
                replacements: {},
                brokenCode: "SELECT nazione, FROM fornitori",
                debugHint: "C'è una virgola di troppo dopo 'nazione'."
            },
            {
                titleTemplate: "Corrieri Spedizioni",
                descTemplate: "Il responsabile logistica vuole negoziare le tariffe. Estrai la colonna 'corriere' dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT corriere FROM spedizioni",
                hints: ["Seleziona la colonna 'corriere'.", "La tabella è 'spedizioni'."],
                explanation: "Analizzare i corrieri utilizzati aiuta a ottimizzare i costi di spedizione.",
                replacements: {},
                brokenCode: "SELECT corriere FROM spedizione",
                debugHint: "La tabella si chiama 'spedizioni' (plurale)."
            },
            {
                titleTemplate: "Voti Recensioni",
                descTemplate: "Per calcolare l'NPS (Net Promoter Score), estrai la colonna 'voto' dalla tabella 'recensioni'.",
                queryTemplate: "SELECT voto FROM recensioni",
                hints: ["Seleziona 'voto' dalla tabella 'recensioni'.", "I voti sono numeri interi (solitamente 1-5)."],
                explanation: "I voti sono la metrica principale per la soddisfazione del cliente.",
                replacements: {},
                brokenCode: "SELECT voto FROM recensioni,",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Commenti Recensioni",
                descTemplate: "Il team prodotto vuole leggere i feedback testuali. Estrai la colonna 'commento' dalla tabella 'recensioni'.",
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
                descTemplate: "Il report di disponibilità deve mostrare le colonne 'nome' e 'stock' dalla tabella 'prodotti'.",
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
                descTemplate: "Per riconciliare le transazioni, mostra le colonne 'id' e 'data_ordine' dalla tabella 'ordini'.",
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
                descTemplate: "Per il report sulla sostenibilità, mostra le colonne 'azienda' e 'nazione' dalla tabella 'fornitori'.",
                queryTemplate: "SELECT azienda, nazione FROM fornitori",
                hints: ["Seleziona 'azienda' e 'nazione'.", "Dalla tabella 'fornitori'."],
                explanation: "La trasparenza sulla provenienza dei fornitori è un valore aggiunto.",
                replacements: {},
                brokenCode: "SELECT azienda nazione FROM fornitori",
                debugHint: "Manca la virgola di separazione tra le colonne."
            },
            {
                titleTemplate: "Corriere e Tracking",
                descTemplate: "Il sistema di tracking automatico richiede le colonne 'corriere' e 'codice_tracking' dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT corriere, codice_tracking FROM spedizioni",
                hints: ["Seleziona 'corriere' e 'codice_tracking'.", "Dalla tabella 'spedizioni'."],
                explanation: "Questi dati sono essenziali per permettere ai clienti di seguire il pacco.",
                replacements: {},
                brokenCode: "SELECT corriere, codice tracking FROM spedizioni",
                debugHint: "Il nome della colonna 'codice_tracking' non può avere spazi. Usa l'underscore."
            },
            {
                titleTemplate: "Voto e Commento",
                descTemplate: "Per analizzare la correlazione tra voto e testo, mostra le colonne 'voto' e 'commento' dalla tabella 'recensioni'.",
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
                },
                brokenCode: "SELECT {col} Info_Principale FROM prodotti",
                debugHint: "Per rinominare una colonna, devi usare la parola chiave 'AS' tra il nome originale e il nuovo nome."
            },
            {
                titleTemplate: "Proiezione Calcolata ({perc})",
                descTemplate: "Il team finanziario sta simulando un aumento dei prezzi del {perc}%. Estrai la colonna 'nome' e il calcolo 'prezzo * {perc}' dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, prezzo * {perc} FROM prodotti",
                hints: ["Puoi eseguire operazioni matematiche direttamente nella clausola SELECT.", "Usa l'asterisco (*) come operatore di moltiplicazione."],
                explanation: "SQL permette di eseguire calcoli aritmetici direttamente sui dati estratti.",
                replacements: { perc: DATA.percentages },
                brokenCode: "SELECT nome, prezzo {perc} FROM prodotti",
                debugHint: "Manca l'operatore matematico per la moltiplicazione (*) tra 'prezzo' e il numero."
            },
            {
                titleTemplate: "Alias Nome Utente",
                descTemplate: "Il CRM richiede che il campo 'nome' dalla tabella 'utenti' venga visualizzato come 'Nome_Cliente'.",
                queryTemplate: "SELECT nome AS Nome_Cliente FROM utenti",
                hints: ["Usa AS per rinominare la colonna nel risultato.", "L'alias richiesto contiene un underscore."],
                explanation: "Gli alias adattano i nomi delle colonne del database alle esigenze del frontend o dei report.",
                replacements: {},
                brokenCode: "SELECT nome Nome_Cliente FROM utenti",
                debugHint: "Manca la parola chiave 'AS' per definire l'alias."
            },
            {
                titleTemplate: "Alias Email Utente",
                descTemplate: "Per l'integrazione con il tool di marketing, estrai la colonna 'email' dalla tabella 'utenti' assegnandole l'alias 'Indirizzo_Email'.",
                queryTemplate: "SELECT email AS Indirizzo_Email FROM utenti",
                hints: ["Usa AS per definire il nuovo nome della colonna.", "Fai attenzione all'uso dell'underscore."],
                explanation: "L'uso di alias rende i report più leggibili e compatibili con sistemi esterni.",
                replacements: {},
                brokenCode: "SELECT email AS Indirizzo Email FROM utenti",
                debugHint: "Gli alias non possono contenere spazi a meno che non siano tra virgolette doppie. Usa l'underscore (_)."
            },
            {
                titleTemplate: "Alias Prezzo Prodotto",
                descTemplate: "Il listino ufficiale richiede che la colonna 'prezzo' dalla tabella 'prodotti' venga visualizzata come 'Prezzo_Vendita'.",
                queryTemplate: "SELECT prezzo AS Prezzo_Vendita FROM prodotti",
                hints: ["Assegna l'alias 'Prezzo_Vendita' alla colonna prezzo.", "Rispetta il case sensitivity dell'alias."],
                explanation: "Rinominare le colonne è utile per chiarire il significato dei dati in report specifici.",
                replacements: {},
                brokenCode: "SELECT prezzo AS Prezzo_Vendita, FROM prodotti",
                debugHint: "C'è una virgola di troppo prima di 'FROM'."
            },
            {
                titleTemplate: "Alias Stock Disponibile",
                descTemplate: "Il report di inventario deve mostrare la colonna 'stock' dalla tabella 'prodotti' con l'alias 'Quantita_Magazzino'.",
                queryTemplate: "SELECT stock AS Quantita_Magazzino FROM prodotti",
                hints: ["Usa AS per cambiare l'intestazione della colonna nel risultato.", "L'alias non modifica il nome della colonna nel database, solo nell'output."],
                explanation: "Gli alias sono temporanei e non modificano la struttura fisica della tabella.",
                replacements: {},
                brokenCode: "SELECT stock AS Quantita-Magazzino FROM prodotti",
                debugHint: "Gli alias non dovrebbero contenere trattini (-), usa l'underscore (_) o le virgolette."
            },
            {
                titleTemplate: "Prezzo con Sconto 10%",
                descTemplate: "Per la promozione estiva, calcola il prezzo scontato del 10% per tutti i prodotti. Estrai le colonne 'nome' e il prezzo calcolato (prezzo * 0.9) rinominato come 'prezzo_scontato' (tutto minuscolo con underscore) dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, prezzo * 0.9 AS prezzo_scontato FROM prodotti",
                hints: ["Moltiplicare per 0.9 equivale a togliere il 10%.", "Sintassi: SELECT nome, prezzo * 0.9 AS prezzo_scontato FROM prodotti"],
                explanation: "È comune eseguire calcoli di sconto direttamente in SQL per report rapidi.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo * 0.9 prezzo_scontato FROM prodotti",
                debugHint: "Manca 'AS' prima dell'alias 'prezzo_scontato'."
            },
            {
                titleTemplate: "Prezzo con IVA ({perc})",
                descTemplate: "Il reparto contabilità necessita del prezzo lordo. Estrai la colonna 'nome' e calcola il prezzo con IVA moltiplicando 'prezzo' per {perc}. Rinomina il risultato del calcolo come 'prezzo_iva' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * {perc} AS prezzo_iva FROM prodotti",
                hints: ["Moltiplica la colonna prezzo per {perc}.", "Usa AS prezzo_iva per l'alias."],
                explanation: "Calcolare l'IVA in fase di estrazione dati semplifica il lavoro del frontend.",
                replacements: { perc: [1.1, 1.22, 1.2] },
                brokenCode: "SELECT nome, prezzo * {perc} AS prezzo iva FROM prodotti",
                debugHint: "L'alias 'prezzo iva' contiene uno spazio. Usa 'prezzo_iva'."
            },
            {
                titleTemplate: "Valore Totale Stock",
                descTemplate: "Per la valutazione degli asset, estrai la colonna 'nome' e calcola il valore totale dello stock moltiplicando 'prezzo' per 'stock'. Rinomina il risultato calcolato come 'valore_totale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * stock AS valore_totale FROM prodotti",
                hints: ["Moltiplica le due colonne numeriche tra loro.", "Assegna un alias descrittivo al risultato."],
                explanation: "Puoi moltiplicare i valori di due colonne diverse della stessa riga.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo * stock valore_totale FROM prodotti",
                debugHint: "Manca la parola chiave 'AS' per assegnare l'alias."
            },
            {
                titleTemplate: "Prezzo con Margine ({perc})",
                descTemplate: "Simula un nuovo listino estraendo la colonna 'nome' e calcolando il prezzo con margine moltiplicando 'prezzo' per {perc}. Rinomina il risultato come 'prezzo_margine' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * {perc} AS prezzo_margine FROM prodotti",
                hints: ["Moltiplica il prezzo per il fattore di margine indicato.", "Non dimenticare l'alias."],
                explanation: "Le simulazioni di prezzo sono frequenti nelle analisi di business.",
                replacements: { perc: DATA.percentages },
                brokenCode: "SELECT nome, prezzo * {perc} AS prezzo-margine FROM prodotti",
                debugHint: "Evita i trattini (-) negli alias, usa l'underscore (_)."
            },
            {
                titleTemplate: "Doppio Alias",
                descTemplate: "Genera un report dalla tabella 'prodotti' dove 'nome' ha l'alias 'Prodotto' e 'prezzo' ha l'alias 'Costo'.",
                queryTemplate: "SELECT nome AS Prodotto, prezzo AS Costo FROM prodotti",
                hints: ["Puoi assegnare un alias a ogni colonna selezionata.", "Separa le definizioni di colonna con una virgola."],
                explanation: "Rinominare più colonne aiuta a creare report completamente personalizzati.",
                replacements: {},
                brokenCode: "SELECT nome AS Prodotto prezzo AS Costo FROM prodotti",
                debugHint: "Manca la virgola per separare le due colonne selezionate."
            },
            {
                titleTemplate: "Alias Multipli Utenti",
                descTemplate: "Il team internazionale vuole un report dalla tabella 'utenti' con intestazioni standard: assegna a 'nome' l'alias 'Cliente', a 'email' l'alias 'Contatto', e a 'paese' l'alias 'Nazione'.",
                queryTemplate: "SELECT nome AS Cliente, email AS Contatto, paese AS Nazione FROM utenti",
                hints: ["Applica un alias per ciascuna delle tre colonne.", "Mantieni l'ordine delle colonne richiesto."],
                explanation: "Standardizzare le intestazioni è cruciale quando si condividono dati tra dipartimenti.",
                replacements: {},
                brokenCode: "SELECT nome AS Cliente, email AS Contatto paese AS Nazione FROM utenti",
                debugHint: "Manca una virgola tra 'Contatto' e 'paese'."
            },
            {
                titleTemplate: "Calcolo Sconto Quantità",
                descTemplate: "Per i clienti business, estrai la colonna 'nome' e calcola lo sconto del 15% moltiplicando 'prezzo' per 0.85. Rinomina il risultato come 'prezzo_scontato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * 0.85 AS prezzo_scontato FROM prodotti",
                hints: ["Esegui la moltiplicazione per 0.85.", "Assegna l'alias richiesto al risultato."],
                explanation: "I calcoli condizionali possono essere simulati o implementati con CASE (argomento avanzato).",
                replacements: {},
                brokenCode: "SELECT nome, prezzo * 0.85 AS prezzo scontato FROM prodotti",
                debugHint: "L'alias non può avere spazi. Usa 'prezzo_scontato'."
            },
            {
                titleTemplate: "Prezzo con Spedizione",
                descTemplate: "Estrai la colonna 'nome' e calcola il prezzo con spedizione sommando 5 alla colonna 'prezzo'. Rinomina il risultato come 'prezzo_totale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo + 5 AS prezzo_totale FROM prodotti",
                hints: ["Usa l'operatore + per aggiungere il costo fisso.", "L'alias rende chiaro che è un totale."],
                explanation: "Sommare costanti ai valori del database è un'operazione semplice ma potente.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo + 5 prezzo_totale FROM prodotti",
                debugHint: "Manca 'AS' prima dell'alias."
            },
            {
                titleTemplate: "Divisione Prezzo",
                descTemplate: "Per una promozione, estrai la colonna 'nome' e calcola il prezzo diviso 2 (prezzo / 2). Rinomina il risultato come 'prezzo_unitario' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo / 2 AS prezzo_unitario FROM prodotti",
                hints: ["Usa lo slash (/) per la divisione.", "Assegna l'alias corretto."],
                explanation: "La divisione è utile per calcolare prezzi unitari o sconti percentuali.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo / 2 AS prezzo-unitario FROM prodotti",
                debugHint: "Usa l'underscore (_) invece del trattino nell'alias."
            },
            {
                titleTemplate: "Somma Prezzo e Stock",
                descTemplate: "A scopo di debug, estrai la colonna 'nome' e calcola la somma di 'prezzo' + 'stock'. Rinomina il risultato come 'somma' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo + stock AS somma FROM prodotti",
                hints: ["Somma le due colonne numeriche.", "Anche se semanticamente strano, SQL lo permette."],
                explanation: "SQL permette operazioni matematiche su qualsiasi colonna numerica.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo + stock somma FROM prodotti",
                debugHint: "Manca 'AS' per definire l'alias."
            },
            {
                titleTemplate: "Sottrazione Prezzo",
                descTemplate: "Estrai la colonna 'nome' e calcola il margine netto sottraendo 10 dalla colonna 'prezzo' (prezzo - 10). Rinomina il risultato come 'prezzo_netto' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo - 10 AS prezzo_netto FROM prodotti",
                hints: ["Usa il meno (-) per la sottrazione.", "L'alias spiega il significato del nuovo valore."],
                explanation: "Sottrarre costi fissi è utile per calcoli di marginalità rapida.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo - 10 AS prezzo netto FROM prodotti",
                debugHint: "L'alias non può contenere spazi."
            },
            {
                titleTemplate: "Calcolo Percentuale",
                descTemplate: "Calcola l'importo della provvigione (20% del prezzo). Estrai la colonna 'nome' e il calcolo prezzo * 0.2, rinominato come 'percentuale' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo * 0.2 AS percentuale FROM prodotti",
                hints: ["Moltiplica per 0.2 per ottenere il 20%.", "Rinomina il risultato."],
                explanation: "Calcolare provvigioni o tasse è un uso tipico dell'aritmetica SQL.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo * 0.2 percentuale FROM prodotti",
                debugHint: "Manca 'AS' prima dell'alias."
            },
            {
                titleTemplate: "Prezzo Arrotondato",
                descTemplate: "Per migliorare la leggibilità del listino, estrai la colonna 'nome' e il prezzo arrotondato all'intero più vicino usando ROUND(prezzo, 0). Rinomina il risultato come 'prezzo_arrotondato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0) AS prezzo_arrotondato FROM prodotti",
                hints: ["Usa la funzione ROUND(colonna, decimali).", "Per interi, usa 0 decimali."],
                explanation: "ROUND è essenziale per presentare dati finanziari puliti.",
                replacements: {},
                brokenCode: "SELECT nome, ROUND(prezzo, 0) AS prezzo-arrotondato FROM prodotti",
                debugHint: "Usa l'underscore (_) nell'alias."
            },
            {
                titleTemplate: "Alias con Calcolo Complesso",
                descTemplate: "Estrai la colonna 'nome' e simula un aumento del 10% seguito da uno sconto di 5€. Calcola (prezzo * 1.1) - 5 e rinomina il risultato come 'prezzo_finale' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, (prezzo * 1.1) - 5 AS prezzo_finale FROM prodotti",
                hints: ["Usa le parentesi per controllare l'ordine delle operazioni.", "SQL rispetta la precedenza degli operatori matematici."],
                explanation: "Le espressioni complesse permettono di modellare logiche di business sofisticate.",
                replacements: {},
                brokenCode: "SELECT nome, (prezzo * 1.1) - 5 AS prezzo finale FROM prodotti",
                debugHint: "L'alias contiene uno spazio non valido."
            },
            {
                titleTemplate: "Triplo Alias",
                descTemplate: "Genera un report completo dalla tabella prodotti rinominando: 'nome' come 'Prodotto', 'prezzo' come 'Prezzo_Base', 'stock' come 'Disponibilita' (rispetta le maiuscole esatte e gli underscore).",
                queryTemplate: "SELECT nome AS Prodotto, prezzo AS Prezzo_Base, stock AS Disponibilita FROM prodotti",
                hints: ["Definisci un alias per ogni colonna selezionata.", "Separa le coppie colonna-alias con virgole."],
                explanation: "Rinominare tutte le colonne crea una vista virtuale su misura per l'utente finale.",
                replacements: {},
                brokenCode: "SELECT nome AS Prodotto, prezzo AS Prezzo_Base, stock Disponibilita FROM prodotti",
                debugHint: "Manca 'AS' per l'ultimo alias."
            },
            {
                titleTemplate: "Calcolo Margine Percentuale",
                descTemplate: "Il margine di profitto è stimato al 30%. Estrai la colonna 'nome' e calcola prezzo * 0.3 per ogni prodotto. Rinomina il risultato come 'margine' (tutto minuscolo).",
                queryTemplate: "SELECT nome, prezzo * 0.3 AS margine FROM prodotti",
                hints: ["Moltiplica il prezzo per 0.3.", "Assegna l'alias 'margine'."],
                explanation: "Stimare i margini aiuta nelle decisioni di pricing.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo * 0.3 margine FROM prodotti",
                debugHint: "Manca 'AS' prima dell'alias."
            },
            {
                titleTemplate: "Prezzo con Doppio Sconto",
                descTemplate: "Applica uno sconto fedeltà. Estrai la colonna 'nome' e calcola (prezzo * 0.9) - 5 (prima 10% di sconto, poi ulteriori 5€). Rinomina il risultato come 'prezzo_finale' (tutto minuscolo con underscore).",
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
                descTemplate: "Dalla tabella ordini, estrai la colonna 'quantita' rinominata come 'Qty' e calcola il valore stimato moltiplicando quantita * 10, rinominato come 'valore_stimato' (tutto minuscolo con underscore).",
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
                descTemplate: "Per il tracking, estrai corriere come 'Spedizioniere' e data_spedizione come 'Data_Consegna' (rispetta le maiuscole).",
                queryTemplate: "SELECT corriere AS Spedizioniere, data_spedizione AS Data_Consegna FROM spedizioni",
                hints: ["Rinomina entrambe le colonne per chiarire il loro ruolo nel report.", "Usa AS."],
                explanation: "In contesti specifici, i nomi generici del DB possono essere fuorvianti, gli alias risolvono.",
                replacements: {}
            },
            {
                titleTemplate: "Voto e Commento Alias",
                descTemplate: "Estrai voto come 'Valutazione' e commento come 'Feedback' (rispetta le maiuscole) dalle recensioni.",
                queryTemplate: "SELECT voto AS Valutazione, commento AS Feedback FROM recensioni",
                hints: ["Usa AS per entrambe", "SELECT voto AS Valutazione, commento AS Feedback"],
                explanation: "Alias per recensioni più leggibili.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Complesso Multiplo",
                descTemplate: "Calcola prezzo * 1.15 rinominato come 'prezzo_iva' e prezzo * 0.85 rinominato come 'prezzo_sconto' (tutto minuscolo con underscore). Estrai nome e entrambi i calcoli.",
                queryTemplate: "SELECT nome, prezzo * 1.15 AS prezzo_iva, prezzo * 0.85 AS prezzo_sconto FROM prodotti",
                hints: ["Calcola entrambe le espressioni", "Usa AS per ciascuna"],
                explanation: "Calcoli multipli con alias distinti.",
                replacements: {}
            },
            {
                titleTemplate: "Alias con Espressione",
                descTemplate: "Calcola (stock + 10) * prezzo e rinomina il risultato come 'valore_potenziale' (tutto minuscolo con underscore). Estrai nome e valore.",
                queryTemplate: "SELECT nome, (stock + 10) * prezzo AS valore_potenziale FROM prodotti",
                hints: ["Prima somma, poi moltiplica", "Usa parentesi"],
                explanation: "Espressioni complesse con alias.",
                replacements: {}
            },
            {
                titleTemplate: "Quattro Alias",
                descTemplate: "Estrai nome come 'Prodotto', prezzo come 'Prezzo', stock come 'Magazzino' e categoria_id come 'Categoria' (rispetta le maiuscole).",
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
                descTemplate: "Estrai nome come 'Cliente', email come 'Email', paese come 'Nazione' e premium come 'Abbonamento' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome AS Cliente, email AS Email, paese AS Nazione, premium AS Abbonamento FROM utenti",
                hints: ["Usa AS per tutte le colonne", "Quattro alias separati da virgole"],
                explanation: "Alias completi per report utenti.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Valore Inventario",
                descTemplate: "Calcola il valore totale dell'inventario: prezzo * stock. Estrai nome e valore rinominato come 'valore_inventario' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo * stock AS valore_inventario FROM prodotti",
                hints: ["Moltiplica prezzo per stock", "Usa AS per l'alias"],
                explanation: "Calcoli di valore inventario.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo con Sconto Progressivo",
                descTemplate: "Calcola uno sconto progressivo: prezzo - (prezzo * 0.15). Estrai nome e prezzo scontato rinominato come 'prezzo_scontato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT nome, prezzo - (prezzo * 0.15) AS prezzo_scontato FROM prodotti",
                hints: ["Calcola prima lo sconto, poi sottrai", "Usa parentesi"],
                explanation: "Calcoli di sconto con espressioni.",
                replacements: {}
            },
            {
                titleTemplate: "Alias Ordine Completo",
                descTemplate: "Estrai id come 'Ordine', data_ordine come 'Data', quantita come 'Quantita' (rispetta le maiuscole) dalla tabella ordini.",
                queryTemplate: "SELECT id AS Ordine, data_ordine AS Data, quantita AS Quantita FROM ordini",
                hints: ["Usa AS per tutte e tre le colonne", "SELECT id AS Ordine, data_ordine AS Data, quantita AS Quantita"],
                explanation: "Alias multipli per ordini.",
                replacements: {}
            },
            // NEW EXERCISES FOR BASICS MEDIUM
            {
                titleTemplate: "Calcolo Ipotetico {op}",
                descTemplate: "Calcola prezzo {op} 2 per ogni prodotto. Estrai nome e risultato rinominato come 'calcolo' (tutto minuscolo).",
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
                descTemplate: "Estrai il prezzo dei prodotti convertito in centesimi (moltiplica per 100) con alias 'Cents' (rispetta la maiuscola).",
                queryTemplate: "SELECT nome, prezzo * 100 AS Cents FROM prodotti",
                hints: ["Moltiplica per 100"],
                explanation: "Conversione unità con calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Raddoppiato",
                descTemplate: "Simula un raddoppio dello stock per ogni prodotto. Estrai nome e 'Stock_Futuro' (rispetta le maiuscole).",
                queryTemplate: "SELECT nome, stock * 2 AS Stock_Futuro FROM prodotti",
                hints: ["Moltiplica stock per 2"],
                explanation: "Proiezione calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Sconto Fisso {val}",
                descTemplate: "Applica uno sconto di {val} euro a tutti i prodotti. Estrai 'Prezzo_Scontato' (rispetta le maiuscole).",
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
                descTemplate: "Estrai la colonna 'categoria_id' dalla tabella 'prodotti' per i prodotti con prezzo > {val}. Usa DISTINCT per avere valori unici.",
                queryTemplate: "SELECT DISTINCT categoria_id FROM prodotti WHERE prezzo > {val}",
                hints: ["Usa WHERE prima o dopo? WHERE filtra le righe, poi DISTINCT agisce."],
                explanation: "DISTINCT con filtro WHERE.",
                replacements: { val: [50, 100, 200] }
            },
            {
                titleTemplate: "DISTINCT Fornitore e Stock < {val}",
                descTemplate: "Estrai la colonna 'fornitore_id' dalla tabella 'prodotti' per i prodotti con stock inferiore a {val}. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT fornitore_id FROM prodotti WHERE stock < {val}",
                hints: ["Filtra con WHERE poi usa DISTINCT"],
                explanation: "DISTINCT su sottoinsieme filtrato.",
                replacements: { val: [5, 10, 20] }
            },
            {
                titleTemplate: "DISTINCT Utenti Premium",
                descTemplate: "Estrai la colonna 'paese' dalla tabella 'utenti' per gli utenti con premium = true. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT paese FROM utenti WHERE premium = true",
                hints: ["WHERE premium = true"],
                explanation: "Paesi con utenti premium.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Corrieri Recenti",
                descTemplate: "Estrai la colonna 'corriere' dalla tabella 'spedizioni' per le spedizioni con data_spedizione > '2023-01-01'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT corriere FROM spedizioni WHERE data_spedizione > '2023-01-01'",
                hints: ["Filtra per data"],
                explanation: "Corrieri attivi recentemente.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Voti Positivi",
                descTemplate: "Estrai la colonna 'voto' dalla tabella 'recensioni' dove voto >= 4. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT voto FROM recensioni WHERE voto >= 4",
                hints: ["WHERE voto >= 4"],
                explanation: "Voti alti unici.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Coppia Ordine-Prodotto",
                descTemplate: "Estrai le colonne 'id' e 'prodotto_id' dalla tabella 'ordini'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT id, prodotto_id FROM ordini",
                hints: ["SELECT DISTINCT id, prodotto_id"],
                explanation: "Verifica unicità chiavi composte.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Combinazione Complessa",
                descTemplate: "Estrai 'categoria_id', 'fornitore_id' e l'espressione '(prezzo > 50)' rinominata come 'prezzo_alto' dalla tabella 'prodotti'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT categoria_id, fornitore_id, (prezzo > 50) AS prezzo_alto FROM prodotti",
                hints: ["Combina DISTINCT con espressione booleana", "Usa parentesi per l'espressione"],
                explanation: "DISTINCT con espressioni complesse.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Utenti per Paese",
                descTemplate: "Estrai 'paese' e 'premium' dalla tabella 'utenti'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT paese, premium FROM utenti",
                hints: ["SELECT DISTINCT paese, premium FROM utenti"],
                explanation: "DISTINCT per analisi incrociate.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Ordini per Data",
                descTemplate: "Estrai 'data_ordine' e 'quantita' dalla tabella 'ordini'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT data_ordine, quantita FROM ordini",
                hints: ["SELECT DISTINCT data_ordine, quantita FROM ordini"],
                explanation: "DISTINCT per pattern di ordini.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Recensioni",
                descTemplate: "Estrai 'prodotto_id' e 'voto' dalla tabella 'recensioni'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT prodotto_id, voto FROM recensioni",
                hints: ["SELECT DISTINCT prodotto_id, voto FROM recensioni"],
                explanation: "DISTINCT per analisi recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Spedizioni",
                descTemplate: "Estrai 'corriere' e 'data_spedizione' dalla tabella 'spedizioni'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT corriere, data_spedizione FROM spedizioni",
                hints: ["SELECT DISTINCT corriere, data_spedizione FROM spedizioni"],
                explanation: "DISTINCT per analisi spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con UPPER",
                descTemplate: "Estrai la colonna 'nome' dalla tabella 'utenti', convertila in maiuscolo con UPPER() e usa DISTINCT. Rinomina il risultato come 'nome_maiuscolo' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT UPPER(nome) AS nome_maiuscolo FROM utenti",
                hints: ["Combina DISTINCT con UPPER", "SELECT DISTINCT UPPER(nome) AS nome_maiuscolo"],
                explanation: "DISTINCT con funzioni di stringa.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Prezzi Arrotondati",
                descTemplate: "Estrai la colonna 'prezzo' dalla tabella 'prodotti', arrotondala con ROUND(prezzo, 0) e usa DISTINCT. Rinomina il risultato come 'prezzo_arrotondato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT ROUND(prezzo, 0) AS prezzo_arrotondato FROM prodotti",
                hints: ["Combina DISTINCT con ROUND", "SELECT DISTINCT ROUND(prezzo, 0) AS prezzo_arrotondato"],
                explanation: "DISTINCT su valori arrotondati.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Quattro Colonne",
                descTemplate: "Estrai 'nome', 'email', 'paese' e 'premium' dalla tabella 'utenti'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT nome, email, paese, premium FROM utenti",
                hints: ["Usa DISTINCT con quattro colonne", "SELECT DISTINCT nome, email, paese, premium"],
                explanation: "DISTINCT su molte colonne per combinazioni uniche.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Calcolo Stock",
                descTemplate: "Estrai la colonna 'stock' dalla tabella 'prodotti', moltiplicala per 10 e usa DISTINCT. Rinomina il risultato come 'stock_calcolato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT stock * 10 AS stock_calcolato FROM prodotti",
                hints: ["SELECT DISTINCT stock * 10 AS stock_calcolato FROM prodotti"],
                explanation: "DISTINCT su calcoli matematici.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Categorie e Prezzi",
                descTemplate: "Estrai 'categoria_id' e 'prezzo' (arrotondato con ROUND(prezzo, 0)) dalla tabella 'prodotti'. Usa DISTINCT e rinomina il prezzo come 'prezzo_arrotondato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT categoria_id, ROUND(prezzo, 0) AS prezzo_arrotondato FROM prodotti",
                hints: ["Combina DISTINCT con ROUND", "SELECT DISTINCT categoria_id, ROUND(prezzo, 0) AS prezzo_arrotondato"],
                explanation: "DISTINCT con calcoli su colonne multiple.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Anno e Mese",
                descTemplate: "Estrai l'anno (YEAR) e il mese (MONTH) dalla colonna 'data_ordine' della tabella 'ordini'. Usa DISTINCT e rinomina le colonne come 'anno' e 'mese' (tutto minuscolo).",
                queryTemplate: "SELECT DISTINCT YEAR(data_ordine) AS anno, MONTH(data_ordine) AS mese FROM ordini",
                hints: ["Usa YEAR() e MONTH() con DISTINCT", "SELECT DISTINCT YEAR(data_ordine) AS anno, MONTH(data_ordine) AS mese"],
                explanation: "DISTINCT su funzioni di data multiple.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Espressione Complessa",
                descTemplate: "Estrai il calcolo '(prezzo * stock) / 10' dalla tabella 'prodotti'. Usa DISTINCT e rinomina il risultato come 'valore_normalizzato' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT (prezzo * stock) / 10 AS valore_normalizzato FROM prodotti",
                hints: ["Usa parentesi per l'ordine", "SELECT DISTINCT (prezzo * stock) / 10 AS valore_normalizzato"],
                explanation: "DISTINCT su espressioni matematiche complesse.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Fornitori e Categorie",
                descTemplate: "Estrai 'fornitore_id' e 'categoria_id' dalla tabella 'prodotti'. Usa DISTINCT e rinominali rispettivamente come 'Fornitore' e 'Categoria' (rispetta le maiuscole).",
                queryTemplate: "SELECT DISTINCT fornitore_id AS Fornitore, categoria_id AS Categoria FROM prodotti",
                hints: ["Usa DISTINCT con alias", "SELECT DISTINCT fornitore_id AS Fornitore, categoria_id AS Categoria"],
                explanation: "DISTINCT con alias per report chiari.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Utenti Premium per Paese",
                descTemplate: "Estrai 'paese' e 'premium' dalla tabella 'utenti'. Usa DISTINCT e rinomina paese come 'Nazione' e premium come 'Premium' (rispetta le maiuscole).",
                queryTemplate: "SELECT DISTINCT paese AS Nazione, premium AS Premium FROM utenti",
                hints: ["SELECT DISTINCT paese AS Nazione, premium AS Premium FROM utenti"],
                explanation: "DISTINCT con alias per analisi incrociate.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Valori Calcolati Multipli",
                descTemplate: "Estrai due calcoli dalla tabella 'prodotti' usando DISTINCT: (prezzo * 1.1) rinominato come 'prezzo_iva' e (stock + 5) rinominato come 'stock_aggiuntivo' (tutto minuscolo con underscore).",
                queryTemplate: "SELECT DISTINCT prezzo * 1.1 AS prezzo_iva, stock + 5 AS stock_aggiuntivo FROM prodotti",
                hints: ["Calcola entrambe le espressioni", "SELECT DISTINCT prezzo * 1.1 AS prezzo_iva, stock + 5 AS stock_aggiuntivo"],
                explanation: "DISTINCT su calcoli multipli.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT Completo Prodotti",
                descTemplate: "Estrai 'nome', 'categoria_id' e 'fornitore_id' dalla tabella 'prodotti'. Usa DISTINCT.",
                queryTemplate: "SELECT DISTINCT nome, categoria_id, fornitore_id FROM prodotti",
                hints: ["SELECT DISTINCT nome, categoria_id, fornitore_id FROM prodotti"],
                explanation: "DISTINCT su tre colonne per analisi complete.",
                replacements: {}
            },
            {
                titleTemplate: "DISTINCT con Funzione Stringa",
                descTemplate: "Estrai UPPER(nome) rinominato come 'nome_maiuscolo' e 'paese' dalla tabella 'utenti'. Usa DISTINCT.",
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
                descTemplate: "Il responsabile di magazzino vuole verificare l'inventario. Trova tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è esattamente uguale a {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock = {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock {val}",
                debugHint: "Manca l'operatore di confronto (=).",
                hints: ["Per filtrare i risultati, usa la clausola condizionale appropriata.", "L'operatore di uguaglianza è =."],
                explanation: "La clausola WHERE permette di selezionare solo le righe che soddisfano una condizione specifica.",
                replacements: { val: [0, 5, 10, 15, 20, 25, 30, 40, 50] }
            },
            {
                titleTemplate: "Filtro per Paese: {country}",
                descTemplate: "Il team marketing vuole lanciare una campagna locale. Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'paese' è uguale a '{country}'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = '{country}'",
                brokenCode: "SELECT * FROM utenti WHERE paese = {country}",
                debugHint: "Le stringhe devono essere racchiuse tra apici singoli.",
                hints: ["Le stringhe vanno delimitate da apici singoli.", "Esempio: WHERE colonna = 'valore'."],
                explanation: "In SQL, le stringhe di testo devono essere sempre delimitate da apici singoli.",
                replacements: { country: DATA.countries }
            },
            {
                titleTemplate: "Prezzi Maggiori di {val}",
                descTemplate: "Per un'analisi sui prodotti di fascia alta, seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è maggiore di {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > {val}",
                brokenCode: "SELECT * FROM prodotti WHER prezzo > {val}",
                debugHint: "Errore di battitura nella parola chiave WHERE.",
                hints: ["Usa l'operatore di confronto maggiore (>).", "Non servono apici per i numeri."],
                explanation: "Gli operatori di confronto come > permettono di filtrare dati numerici.",
                replacements: { val: [10, 20, 30, 50, 75, 100, 150, 200] }
            },
            {
                titleTemplate: "Ordini Quantità Minima",
                descTemplate: "Identifica i piccoli ordini per ottimizzare la logistica. Seleziona tutti i record dalla tabella 'ordini' dove la colonna 'quantita' è minore di {val}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita < {val}",
                brokenCode: "SELECT * FROM ordini WHERE quantita << {val}",
                debugHint: "Operatore di confronto errato (doppio simbolo).",
                hints: ["Usa l'operatore minore (<).", "Confronta la colonna quantita con il valore {val}."],
                explanation: "Filtrare per valori inferiori a una soglia è utile per segmentare i dati.",
                replacements: { val: [2, 3, 4, 5, 6, 7, 8, 10] }
            },
            {
                titleTemplate: "Prezzi Minori di {val}",
                descTemplate: "Per la sezione 'Offerte Economiche', seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è minore di {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo < {val}",
                brokenCode: "SELECT * FROM prodotti WHERE price < {val}",
                debugHint: "Nome colonna errato (forse è in inglese?).",
                hints: ["Usa l'operatore minore (<).", "Il prezzo è un valore numerico."],
                explanation: "L'operatore < seleziona valori strettamente inferiori a quello specificato.",
                replacements: { val: [20, 30, 50, 75, 100] }
            },
            {
                titleTemplate: "Stock Maggiore di {val}",
                descTemplate: "Verifica la disponibilità per grandi ordini. Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è maggiore di {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock > {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock >> {val}",
                debugHint: "Operatore di confronto errato.",
                hints: ["Usa WHERE stock > {val}.", "Assicurati di usare il nome corretto della colonna."],
                explanation: "Filtrare per disponibilità minima è essenziale per la gestione degli ordini.",
                replacements: { val: [5, 10, 15, 20, 30] }
            },
            {
                titleTemplate: "Stock Minore di {val}",
                descTemplate: "Allarme scorte: seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è minore di {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock < {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock =< {val}",
                debugHint: "L'operatore 'minore o uguale' si scrive <=.",
                hints: ["Usa WHERE stock < {val}.", "Questo filtro aiuta a prevenire l'esaurimento scorte."],
                explanation: "Monitorare i livelli di stock bassi è cruciale per la continuità del business.",
                replacements: { val: [5, 10, 15, 20] }
            },
            {
                titleTemplate: "Utenti Premium",
                descTemplate: "Il servizio clienti vuole contattare i VIP. Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'premium' è TRUE.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE",
                brokenCode: "SELECT * FROM utenti WHERE premium = VERO",
                debugHint: "In SQL i booleani sono TRUE o FALSE (in inglese).",
                hints: ["Usa WHERE premium = TRUE.", "TRUE è una parola chiave per il valore booleano vero."],
                explanation: "I campi booleani possono essere filtrati direttamente con TRUE o FALSE.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Non Premium",
                descTemplate: "Per una campagna di upsell, seleziona tutti i record dalla tabella 'utenti' dove la colonna 'premium' è FALSE.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = FALSE",
                brokenCode: "SELECT * FROM utenti WHERE premium = 'FALSE'",
                debugHint: "FALSE è una parola chiave, non una stringa.",
                hints: ["Usa WHERE premium = FALSE.", "FALSE indica che l'utente non è premium."],
                explanation: "Identificare gli utenti non premium è il primo passo per strategie di conversione.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria Specifica ({cat})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'categoria_id' è uguale a {cat}.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = {cat}",
                brokenCode: "SELECT * FROM prodotti WHERE category_id = {cat}",
                debugHint: "Controlla il nome della colonna per l'ID categoria.",
                hints: ["Usa WHERE categoria_id = {cat}.", "L'ID è un numero intero."],
                explanation: "Filtrare per chiave esterna (ID categoria) è il modo standard per navigare le relazioni.",
                replacements: { cat: [1, 2, 3] }
            },
            {
                titleTemplate: "Fornitore Specifico ({forn})",
                descTemplate: "Dobbiamo contattare un fornitore. Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'fornitore_id' è uguale a {forn}.",
                queryTemplate: "SELECT * FROM prodotti WHERE fornitore_id = {forn}",
                brokenCode: "SELECT * FROM prodotti WHERE fornitore id = {forn}",
                debugHint: "I nomi delle colonne non possono contenere spazi.",
                hints: ["Usa WHERE fornitore_id = {forn}.", "Filtra sulla colonna della chiave esterna."],
                explanation: "Questo tipo di query è frequente nei pannelli di amministrazione.",
                replacements: { forn: [1, 2, 3] }
            },
            {
                titleTemplate: "Quantità Ordine Esatta ({qty})",
                descTemplate: "Analisi pattern di acquisto: seleziona tutti i record dalla tabella 'ordini' dove la colonna 'quantita' è uguale a {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita = {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantita == {qty}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa l'operatore di uguaglianza (=).", "Cerca nella tabella ordini."],
                explanation: "L'uguaglianza esatta è utile per trovare corrispondenze precise.",
                replacements: { qty: [1, 2, 3, 4, 5] }
            },
            {
                titleTemplate: "Quantità Maggiore di {qty}",
                descTemplate: "Identifica gli ordini voluminosi. Seleziona tutti i record dalla tabella 'ordini' dove la colonna 'quantita' è maggiore di {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita > {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantity > {qty}",
                debugHint: "Controlla il nome della colonna quantità.",
                hints: ["Usa l'operatore maggiore (>).", "Filtra sulla colonna quantita."],
                explanation: "Filtrare per quantità aiuta a segmentare gli ordini per dimensione.",
                replacements: { qty: [2, 3, 4, 5] }
            },
            {
                titleTemplate: "Voto Recensione ({voto})",
                descTemplate: "Analisi sentiment: seleziona tutti i record dalla tabella 'recensioni' dove la colonna 'voto' è uguale a {voto}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto = {voto}",
                brokenCode: "SELECT * FROM recensioni WHERE vote = {voto}",
                debugHint: "Controlla il nome della colonna voto.",
                hints: ["Usa WHERE voto = {voto}.", "Il voto è un numero intero."],
                explanation: "Filtrare le recensioni per voto aiuta a capire la soddisfazione dei clienti.",
                replacements: { voto: [1, 2, 3, 4, 5] }
            },
            {
                titleTemplate: "Recensioni Positive ({voto}+)",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove la colonna 'voto' è maggiore o uguale a {voto}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto >= {voto}",
                brokenCode: "SELECT * FROM recensioni WHERE voto > = {voto}",
                debugHint: "L'operatore 'maggiore o uguale' si scrive >= senza spazi.",
                hints: ["Usa WHERE voto >= valore", ">= significa maggiore o uguale"],
                explanation: "Filtro per recensioni positive.",
                replacements: { voto: [3, 4, 5] }
            },
            {
                titleTemplate: "Recensioni Negative ({voto}-)",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove la colonna 'voto' è minore o uguale a {voto}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto <= {voto}",
                brokenCode: "SELECT * FROM recensioni WHERE voto < = {voto}",
                debugHint: "L'operatore 'minore o uguale' si scrive <= senza spazi.",
                hints: ["Usa WHERE voto <= valore", "<= significa minore o uguale"],
                explanation: "Filtro per recensioni negative.",
                replacements: { voto: [2, 3] }
            },
            {
                titleTemplate: "Prezzo Maggiore o Uguale ({val})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è maggiore o uguale a {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo >= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo => {val}",
                debugHint: "L'operatore 'maggiore o uguale' si scrive >=.",
                hints: ["Usa WHERE prezzo >= valore"],
                explanation: "Filtro con operatore >=.",
                replacements: { val: [50, 100, 150, 200] }
            },
            {
                titleTemplate: "Prezzo Minore o Uguale ({val})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è minore o uguale a {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo <= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo =< {val}",
                debugHint: "L'operatore 'minore o uguale' si scrive <=.",
                hints: ["Usa WHERE prezzo <= valore"],
                explanation: "Filtro con operatore <=.",
                replacements: { val: [20, 50, 75, 100] }
            },
            {
                titleTemplate: "Stock Maggiore o Uguale ({val})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è maggiore o uguale a {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock >= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock >= {val} ;",
                debugHint: "Rimuovi il punto e virgola finale se presente (o altro errore).",
                hints: ["Usa WHERE stock >= valore"],
                explanation: "Filtro per prodotti ben forniti.",
                replacements: { val: [10, 20, 30, 40] }
            },
            {
                titleTemplate: "Stock Minore o Uguale ({val})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è minore o uguale a {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock <= {val}",
                brokenCode: "SELECT * FROM prodotti WHERE stock <= {val} ;",
                debugHint: "Rimuovi il punto e virgola finale se presente (o altro errore).",
                hints: ["Usa WHERE stock <= valore"],
                explanation: "Filtro per scorte basse.",
                replacements: { val: [5, 10, 15, 20] }
            },
            {
                titleTemplate: "Quantità Minore o Uguale ({qty})",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove la colonna 'quantita' è minore o uguale a {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita <= {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantita <= '{qty}'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["Usa WHERE quantita <= valore"],
                explanation: "Filtro per ordini piccoli.",
                replacements: { qty: [2, 3, 4, 5] }
            },
            {
                titleTemplate: "Quantità Maggiore o Uguale ({qty})",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove la colonna 'quantita' è maggiore o uguale a {qty}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita >= {qty}",
                brokenCode: "SELECT * FROM ordini WHERE quantita >= '{qty}'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["Usa WHERE quantita >= valore"],
                explanation: "Filtro per ordini grandi.",
                replacements: { qty: [3, 4, 5] }
            },
            {
                titleTemplate: "Nome Prodotto Esatto",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'nome' è uguale a 'Prod 1'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome = 'Prod 1'",
                brokenCode: "SELECT * FROM prodotti WHERE nome = Prod 1",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE nome = 'valore'", "Ricorda gli apici per le stringhe"],
                explanation: "Filtro per nome esatto.",
                replacements: {}
            },
            {
                titleTemplate: "Email Utente Esatta",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'email' è uguale a 'user1@mail.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE email = 'user1@mail.com'",
                brokenCode: "SELECT * FROM utenti WHERE email = user1@mail.com",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE email = 'valore'"],
                explanation: "Filtro per email specifica.",
                replacements: {}
            },
            {
                titleTemplate: "Corriere Specifico ({corr})",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' dove la colonna 'corriere' è uguale a '{corr}'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = '{corr}'",
                brokenCode: "SELECT * FROM spedizioni WHERE corriere = {corr}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE corriere = 'valore'"],
                explanation: "Filtro per corriere specifico.",
                replacements: { corr: DATA.couriers }
            },
            {
                titleTemplate: "Azienda Fornitore ({azienda})",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' dove la colonna 'azienda' è uguale a '{azienda}'.",
                queryTemplate: "SELECT * FROM fornitori WHERE azienda = '{azienda}'",
                brokenCode: "SELECT * FROM fornitori WHERE azienda = {azienda}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE azienda = 'valore'"],
                explanation: "Filtro per azienda specifica.",
                replacements: { azienda: DATA.suppliers }
            },
            {
                titleTemplate: "Nazione Fornitore ({nazione})",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' dove la colonna 'nazione' è uguale a '{nazione}'.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione = '{nazione}'",
                brokenCode: "SELECT * FROM fornitori WHERE nazione = {nazione}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE nazione = 'valore'"],
                explanation: "Filtro per nazione fornitore.",
                replacements: { nazione: DATA.countries }
            },
            {
                titleTemplate: "Nome Categoria ({cat})",
                descTemplate: "Seleziona tutti i record dalla tabella 'categorie' dove la colonna 'nome' è uguale a '{cat}'.",
                queryTemplate: "SELECT * FROM categorie WHERE nome = '{cat}'",
                brokenCode: "SELECT * FROM categorie WHERE nome = {cat}",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["Usa WHERE nome = 'valore'"],
                explanation: "Filtro per nome categoria.",
                replacements: { cat: DATA.categories }
            },
            {
                titleTemplate: "ID Utente Esatto ({id})",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'id' è uguale a {id}.",
                queryTemplate: "SELECT * FROM utenti WHERE id = {id}",
                brokenCode: "SELECT * FROM utenti WHERE id == {id}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa WHERE id = valore"],
                explanation: "Filtro per ID specifico.",
                replacements: { id: [1, 2, 3, 4, 5, 10, 15, 20] }
            },
            {
                titleTemplate: "ID Prodotto Esatto ({id})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'id' è uguale a {id}.",
                queryTemplate: "SELECT * FROM prodotti WHERE id = {id}",
                brokenCode: "SELECT * FROM prodotti WHERE id == {id}",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa WHERE id = valore"],
                explanation: "Filtro per ID prodotto.",
                replacements: { id: [1, 2, 3, 4, 5, 10, 15, 20] }
            },
            {
                titleTemplate: "ID Ordine Esatto ({id})",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove la colonna 'id' è uguale a {id}.",
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
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove la colonna 'data_ordine' è uguale a '2023-01-15'.",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-15'",
                brokenCode: "SELECT * FROM ordini WHERE data_ordine = 2023-01-15",
                debugHint: "Le date sono stringhe e devono essere racchiuse tra apici.",
                hints: ["Usa WHERE data_ordine = 'YYYY-MM-DD'"],
                explanation: "Filtro su data specifica.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Anno 2023",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove l'anno della colonna 'data_ordine' è 2023 (usa YEAR(data_ordine)).",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2023",
                brokenCode: "SELECT * FROM ordini WHERE YEAR(data_ordine) == 2023",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["Usa YEAR()"],
                explanation: "Filtro su anno.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Mese Gennaio",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove il mese della colonna 'data_ordine' è 1 (usa MONTH(data_ordine)).",
                queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 1",
                brokenCode: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 'Gennaio'",
                debugHint: "La funzione MONTH restituisce un numero (1-12).",
                hints: ["Usa MONTH()"],
                explanation: "Filtro su mese.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Stock Zero",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è uguale a 0.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock = 0",
                brokenCode: "SELECT * FROM prodotti WHERE stock == 0",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["WHERE stock = 0"],
                explanation: "Filtro per prodotti esauriti.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Stock Positivo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'stock' è maggiore di 0.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock > 0",
                brokenCode: "SELECT * FROM prodotti WHERE stock > '0'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["WHERE stock > 0"],
                explanation: "Filtro per prodotti disponibili.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Minimo 10",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è maggiore o uguale a 10.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo >= 10",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo >= '10'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["WHERE prezzo >= 10"],
                explanation: "Filtro prezzo minimo.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Massimo 100",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è minore o uguale a 100.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo <= 100",
                brokenCode: "SELECT * FROM prodotti WHERE prezzo <= '100'",
                debugHint: "Non servono apici per i valori numerici.",
                hints: ["WHERE prezzo <= 100"],
                explanation: "Filtro prezzo massimo.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Italiani",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'paese' è uguale a 'Italia'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia'",
                brokenCode: "SELECT * FROM utenti WHERE paese = Italia",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE paese = 'Italia'"],
                explanation: "Filtro paese specifico.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Francesi",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'paese' è uguale a 'Francia'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Francia'",
                brokenCode: "SELECT * FROM utenti WHERE paese = Francia",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE paese = 'Francia'"],
                explanation: "Filtro paese specifico.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Tedeschi",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la colonna 'paese' è uguale a 'Germania'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Germania'",
                brokenCode: "SELECT * FROM utenti WHERE paese = Germania",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE paese = 'Germania'"],
                explanation: "Filtro paese specifico.",
                replacements: {}
            },
            {
                titleTemplate: "Spedizioni DHL",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' dove la colonna 'corriere' è uguale a 'DHL'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = 'DHL'",
                brokenCode: "SELECT * FROM spedizioni WHERE corriere = DHL",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE corriere = 'DHL'"],
                explanation: "Filtro corriere.",
                replacements: {}
            },
            {
                titleTemplate: "Spedizioni UPS",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' dove la colonna 'corriere' è uguale a 'UPS'.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = 'UPS'",
                brokenCode: "SELECT * FROM spedizioni WHERE corriere = UPS",
                debugHint: "Le stringhe devono essere racchiuse tra apici.",
                hints: ["WHERE corriere = 'UPS'"],
                explanation: "Filtro corriere.",
                replacements: {}
            },
            {
                titleTemplate: "Recensioni 5 Stelle",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove la colonna 'voto' è uguale a 5.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto = 5",
                brokenCode: "SELECT * FROM recensioni WHERE voto == 5",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["WHERE voto = 5"],
                explanation: "Filtro voto massimo.",
                replacements: {}
            },
            {
                titleTemplate: "Recensioni 1 Stella",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove la colonna 'voto' è uguale a 1.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto = 1",
                brokenCode: "SELECT * FROM recensioni WHERE voto == 1",
                debugHint: "In SQL l'uguaglianza si esprime con un singolo uguale.",
                hints: ["WHERE voto = 1"],
                explanation: "Filtro voto minimo.",
                replacements: {}
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Filtro Range Prezzo ({min}-{max})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove la colonna 'prezzo' è compresa tra {min} e {max} (inclusi).",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN {min} AND {max}",
                hints: ["Per intervalli inclusivi, esiste un operatore dedicato (BETWEEN)."],
                explanation: "BETWEEN semplifica la scrittura di range >= e <=.",
                replacements: { min: DATA.prices_min, max: DATA.prices_max },
                brokenCode: "SELECT * FROM prodotti WHERE prezzo BETWEEN {min} OR {max}",
                debugHint: "L'operatore BETWEEN richiede 'AND' per definire l'intervallo, non 'OR'."
            },
            {
                titleTemplate: "Multi-Condizione (AND)",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'premium' è TRUE E 'paese' è '{country}'.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = '{country}'",
                hints: ["Usa AND per obbligare entrambe le condizioni"],
                explanation: "AND restringe il risultato: tutte le condizioni devono essere vere.",
                replacements: { country: DATA.countries },
                brokenCode: "SELECT * FROM utenti WHERE premium = TRUE OR paese = '{country}'",
                debugHint: "La richiesta specifica che ENTRAMBE le condizioni devono essere vere. Usa 'AND'."
            },
            {
                titleTemplate: "Lista Categorie (IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' è IN ({id1}, {id2}).",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN ({id1}, {id2})",
                hints: ["Usa IN (valore1, valore2)"],
                explanation: "IN è una scorciatoia per una serie di OR.",
                replacements: { id1: [1, 2], id2: [2, 3], id3: [1, 3] },
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id = ({id1}, {id2})",
                debugHint: "Per confrontare con una lista di valori, usa l'operatore 'IN' invece dell'uguale."
            },
            {
                titleTemplate: "Esclusione Paese (NOT)",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'paese' è diverso da '{country}'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese <> '{country}'",
                hints: ["Usa <> oppure != per 'diverso da'"],
                explanation: "Escludere record specifici.",
                replacements: { country: DATA.countries },
                brokenCode: "SELECT * FROM utenti WHERE paese =! '{country}'",
                debugHint: "L'operatore per 'diverso da' si scrive '<>' oppure '!=' (non '=!')."
            },
            {
                titleTemplate: "Range Stock ({min}-{max})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'stock' è compreso tra {min} e {max}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock BETWEEN {min} AND {max}",
                hints: ["Usa BETWEEN per range", "SELECT * FROM prodotti WHERE stock BETWEEN {min} AND {max}"],
                explanation: "BETWEEN per filtrare range di valori.",
                replacements: { min: [5, 10, 15, 20], max: [25, 30, 40, 50] },
                brokenCode: "SELECT * FROM prodotti WHERE stock BETWEEN {min} {max}",
                debugHint: "Manca la parola chiave 'AND' tra i due valori del BETWEEN."
            },
            {
                titleTemplate: "Range Quantità ({min}-{max})",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove 'quantita' è compresa tra {min} e {max}.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita BETWEEN {min} AND {max}",
                hints: ["Usa BETWEEN per range", "SELECT * FROM ordini WHERE quantita BETWEEN {min} AND {max}"],
                explanation: "BETWEEN per filtrare quantità ordini.",
                replacements: { min: [1, 2, 3], max: [4, 5, 6, 7] },
                brokenCode: "SELECT * FROM ordini WHERE quantita FROM {min} TO {max}",
                debugHint: "La sintassi corretta è 'BETWEEN valore1 AND valore2'."
            },
            {
                titleTemplate: "Range Voti ({min}-{max})",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove 'voto' è compreso tra {min} e {max}.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto BETWEEN {min} AND {max}",
                hints: ["Usa BETWEEN per range voti", "SELECT * FROM recensioni WHERE voto BETWEEN {min} AND {max}"],
                explanation: "BETWEEN per filtrare range di voti.",
                replacements: { min: [1, 2, 3], max: [3, 4, 5] },
                brokenCode: "SELECT * FROM recensioni WHERE voto BETWEEN {min} & {max}",
                debugHint: "In SQL l'operatore logico è 'AND', non il simbolo '&'."
            },
            {
                titleTemplate: "Premium E Paese ({country})",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'premium' è TRUE E 'paese' è '{country}'.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = '{country}'",
                hints: ["Usa AND per combinare condizioni", "premium = TRUE AND paese = '...'"],
                explanation: "AND per combinare più condizioni.",
                replacements: { country: DATA.countries },
                brokenCode: "SELECT * FROM utenti WHERE premium = TRUE, paese = '{country}'",
                debugHint: "Le condizioni nella clausola WHERE si separano con 'AND', non con la virgola."
            },
            {
                titleTemplate: "Prezzo E Stock ({prezzo} e {stock})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' > {prezzo} E 'stock' > {stock}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > {prezzo} AND stock > {stock}",
                hints: ["Usa AND per combinare", "prezzo > {prezzo} AND stock > {stock}"],
                explanation: "AND per filtri multipli.",
                replacements: { prezzo: [50, 100], stock: [10, 20] },
                brokenCode: "SELECT * FROM prodotti WHERE prezzo > {prezzo} AND stock < {stock}",
                debugHint: "Controlla la direzione del confronto per lo stock. Deve essere maggiore (>)."
            },
            {
                titleTemplate: "Categoria E Fornitore ({cat} e {forn})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' = {cat} E 'fornitore_id' = {forn}.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = {cat} AND fornitore_id = {forn}",
                hints: ["Usa AND per combinare", "categoria_id = {cat} AND fornitore_id = {forn}"],
                explanation: "AND per filtri multipli su colonne diverse.",
                replacements: { cat: [1, 2, 3], forn: [1, 2, 3] },
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id = {cat} AND fornitore_id {forn}",
                debugHint: "Manca l'operatore di confronto (=) per il fornitore."
            },
            {
                titleTemplate: "Lista Paesi (IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'paese' è IN ('Italia', 'Francia', 'Germania').",
                queryTemplate: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Germania')",
                hints: ["Usa IN con lista di valori", "WHERE paese IN ('val1', 'val2', 'val3')"],
                explanation: "IN per filtrare su lista di valori.",
                replacements: {},
                brokenCode: "SELECT * FROM utenti WHERE paese IN ('Italia' 'Francia' 'Germania')",
                debugHint: "I valori all'interno della lista IN devono essere separati da virgole."
            },
            {
                titleTemplate: "Lista Corrieri (IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' dove 'corriere' è IN ('DHL', 'UPS', 'FedEx').",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere IN ('DHL', 'UPS', 'FedEx')",
                hints: ["Usa IN con lista corrieri", "WHERE corriere IN ('DHL', 'UPS', 'FedEx')"],
                explanation: "IN per filtrare su lista di stringhe.",
                replacements: {},
                brokenCode: "SELECT * FROM spedizioni WHERE corriere IN ('DHL', 'UPS', 'FedEx'",
                debugHint: "Manca la parentesi chiusa dopo la lista dei valori."
            },
            {
                titleTemplate: "Lista Categorie Multiple (IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' è IN (1, 2, 3).",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2, 3)",
                hints: ["Usa IN con lista numeri", "WHERE categoria_id IN (1, 2, 3)"],
                explanation: "IN per filtrare su lista di numeri.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2, 3",
                debugHint: "Manca la parentesi chiusa."
            },
            {
                titleTemplate: "Lista Voti (IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove 'voto' è IN (4, 5).",
                queryTemplate: "SELECT * FROM recensioni WHERE voto IN (4, 5)",
                hints: ["Usa IN con lista voti", "WHERE voto IN (4, 5)"],
                explanation: "IN per filtrare voti alti.",
                replacements: {},
                brokenCode: "SELECT * FROM recensioni WHERE voto IN 4, 5",
                debugHint: "La lista di valori per l'operatore IN deve essere racchiusa tra parentesi tonde."
            },
            {
                titleTemplate: "Esclusione Prezzo (NOT)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' è diverso da {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo <> {val}",
                hints: ["Usa <> per diverso", "WHERE prezzo <> {val}"],
                explanation: "Operatore <> per escludere valori.",
                replacements: { val: [50, 100, 150] },
                brokenCode: "SELECT * FROM prodotti WHERE prezzo >< {val}",
                debugHint: "L'operatore per 'diverso da' è '<>' oppure '!='."
            },
            {
                titleTemplate: "Esclusione Stock (NOT)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'stock' è diverso da {val}.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock <> {val}",
                hints: ["Usa <> per diverso", "WHERE stock <> {val}"],
                explanation: "Esclusione di valori specifici.",
                replacements: { val: [0, 10, 20] },
                brokenCode: "SELECT * FROM prodotti WHERE stock NOT = {val}",
                debugHint: "Sintassi non valida. Usa '<>' o '!=' per 'diverso da'."
            },
            {
                titleTemplate: "Esclusione Categoria (NOT IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' NON è IN (1, 2).",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2)",
                hints: ["Usa NOT IN per escludere lista", "WHERE categoria_id NOT IN (1, 2)"],
                explanation: "NOT IN per escludere più valori.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2",
                debugHint: "Manca la parentesi chiusa."
            },
            {
                titleTemplate: "Esclusione Paesi (NOT IN)",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'paese' NON è IN ('Italia', 'Francia', 'Germania').",
                queryTemplate: "SELECT * FROM utenti WHERE paese NOT IN ('Italia', 'Francia', 'Germania')",
                hints: ["Usa NOT IN con lista", "WHERE paese NOT IN ('...', '...')"],
                explanation: "NOT IN per escludere lista di paesi.",
                replacements: {},
                brokenCode: "SELECT * FROM utenti WHERE paese NOT IN 'Italia', 'Francia', 'Germania'",
                debugHint: "La lista di valori per NOT IN deve essere tra parentesi."
            },
            {
                titleTemplate: "AND con Tre Condizioni",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' > 50 E 'stock' > 10 E 'categoria_id' = 1.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > 50 AND stock > 10 AND categoria_id = 1",
                hints: ["Usa AND per tutte le condizioni", "condizione1 AND condizione2 AND condizione3"],
                explanation: "AND per combinare tre condizioni.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE prezzo > 50 AND stock > 10 OR categoria_id = 1",
                debugHint: "Attenzione alla logica: tutte le condizioni devono essere vere, quindi usa sempre 'AND'."
            },
            {
                titleTemplate: "AND Utente Completo",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'premium' è TRUE E 'paese' è 'Italia' E 'email' contiene '@mail.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND email LIKE '%@mail.com'",
                hints: ["Combina AND con LIKE", "premium = TRUE AND paese = '...' AND email LIKE '...'"],
                explanation: "AND per combinare condizioni multiple.",
                replacements: {},
                brokenCode: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND email = '%@mail.com'",
                debugHint: "Per cercare un pattern con il carattere jolly %, devi usare l'operatore 'LIKE', non l'uguale."
            },
            {
                titleTemplate: "Range Prezzo con AND",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' è tra 50 e 200 E 'stock' > 15.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN 50 AND 200 AND stock > 15",
                hints: ["Combina BETWEEN con AND", "prezzo BETWEEN ... AND ... AND stock > ..."],
                explanation: "BETWEEN combinato con AND.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE prezzo BETWEEN 50 AND 200 OR stock > 15",
                debugHint: "La richiesta specifica che ENTRAMBE le condizioni devono essere vere. Usa 'AND'."
            },
            {
                titleTemplate: "IN con AND",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' è IN (1, 2) E 'prezzo' > 75.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2) AND prezzo > 75",
                hints: ["Combina IN con AND", "categoria_id IN (...) AND prezzo > ..."],
                explanation: "IN combinato con AND.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id IN (1, 2) OR prezzo > 75",
                debugHint: "Usa 'AND' per combinare le condizioni come richiesto."
            },
            {
                titleTemplate: "NOT con AND",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' diverso da 3 E 'stock' > 5.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id <> 3 AND stock > 5",
                hints: ["Combina NOT con AND", "categoria_id <> 3 AND stock > 5"],
                explanation: "NOT combinato con AND.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id <> 3 OR stock > 5",
                debugHint: "Usa 'AND' per combinare le condizioni."
            },
            {
                titleTemplate: "BETWEEN Stock e Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'stock' è tra 10 e 30 E 'prezzo' è tra 50 e 150.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock BETWEEN 10 AND 30 AND prezzo BETWEEN 50 AND 150",
                hints: ["Usa BETWEEN due volte con AND", "stock BETWEEN ... AND ... AND prezzo BETWEEN ..."],
                explanation: "Doppio BETWEEN con AND.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE stock BETWEEN 10 AND 30, prezzo BETWEEN 50 AND 150",
                debugHint: "Le condizioni multiple si uniscono con 'AND', non con la virgola."
            },
            {
                titleTemplate: "IN Paesi e Premium",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'paese' è IN ('Italia', 'Francia', 'Spagna') E 'premium' è TRUE.",
                queryTemplate: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Spagna') AND premium = TRUE",
                hints: ["Combina IN con AND", "paese IN (...) AND premium = TRUE"],
                explanation: "IN combinato con AND per filtri complessi.",
                replacements: {},
                brokenCode: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Spagna') AND premium = 'TRUE'",
                debugHint: "Il valore booleano TRUE non va tra apici."
            },
            {
                titleTemplate: "NOT IN Categorie e Stock",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' NON è IN (1, 2) E 'stock' > 20.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2) AND stock > 20",
                hints: ["Combina NOT IN con AND", "categoria_id NOT IN (...) AND stock > ..."],
                explanation: "NOT IN combinato con AND.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti WHERE categoria_id NOT IN (1, 2) AND stock 20",
                debugHint: "Manca l'operatore di confronto per lo stock (>)."
            },
            {
                titleTemplate: "BETWEEN Quantità e Data",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove 'quantita' è tra 2 e 5 E 'data_ordine' > '2023-06-01'.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita BETWEEN 2 AND 5 AND data_ordine > '2023-06-01'",
                hints: ["Combina BETWEEN con confronto data", "quantita BETWEEN ... AND ... AND data_ordine > ..."],
                explanation: "BETWEEN combinato con confronto date.",
                replacements: {},
                brokenCode: "SELECT * FROM ordini WHERE quantita BETWEEN 2 AND 5 AND data_ordine = '2023-06-01'",
                debugHint: "La richiesta è per date SUCCESSIVE (>), non uguali."
            },
            {
                titleTemplate: "IN Voti e Prodotto",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' dove 'voto' è IN (4, 5) E 'prodotto_id' = 1.",
                queryTemplate: "SELECT * FROM recensioni WHERE voto IN (4, 5) AND prodotto_id = 1",
                hints: ["Combina IN con AND", "voto IN (...) AND prodotto_id = ..."],
                explanation: "IN combinato con AND per recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "BETWEEN Prezzo e Categoria",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' è tra 100 e 500 E 'categoria_id' = 2.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo BETWEEN 100 AND 500 AND categoria_id = 2",
                hints: ["Combina BETWEEN con AND", "prezzo BETWEEN ... AND ... AND categoria_id = ..."],
                explanation: "BETWEEN con filtro categoria.",
                replacements: {}
            },
            {
                titleTemplate: "NOT IN Fornitori e Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'fornitore_id' NON è IN (1, 2) E 'prezzo' > 50.",
                queryTemplate: "SELECT * FROM prodotti WHERE fornitore_id NOT IN (1, 2) AND prezzo > 50",
                hints: ["Combina NOT IN con AND", "fornitore_id NOT IN (...) AND prezzo > ..."],
                explanation: "NOT IN combinato con AND per filtri complessi.",
                replacements: {}
            },
            // NEW EXERCISES FOR FILTERING MEDIUM
            {
                titleTemplate: "BETWEEN Date",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove 'data_ordine' è compresa tra '2023-01-01' e '2023-12-31'.",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31'",
                hints: ["Usa BETWEEN con date"],
                explanation: "BETWEEN funziona anche con le date.",
                replacements: {}
            },
            {
                titleTemplate: "OR con Date",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove 'data_ordine' = '2023-01-01' O 'data_ordine' = '2024-01-01'.",
                queryTemplate: "SELECT * FROM ordini WHERE data_ordine = '2023-01-01' OR data_ordine = '2024-01-01'",
                hints: ["Usa OR con date"],
                explanation: "OR per date specifiche.",
                replacements: {}
            },
            {
                titleTemplate: "AND con Date e Quantità",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove YEAR('data_ordine') = 2023 E 'quantita' > 5.",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2023 AND quantita > 5",
                hints: ["Combina YEAR() e AND"],
                explanation: "Filtro temporale e numerico.",
                replacements: {}
            },
            {
                titleTemplate: "IN con Stringhe",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'nome' è IN ('Laptop', 'Mouse').",
                queryTemplate: "SELECT * FROM prodotti WHERE nome IN ('Laptop', 'Mouse')",
                hints: ["Usa IN con stringhe"],
                explanation: "IN per lista nomi.",
                replacements: {}
            },
            {
                titleTemplate: "NOT BETWEEN Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' NON è tra 50 e 100.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo NOT BETWEEN 50 AND 100",
                hints: ["Usa NOT BETWEEN"],
                explanation: "Esclusione range.",
                replacements: {}
            },
            {
                titleTemplate: "NOT BETWEEN Stock",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'stock' NON è tra 10 e 20.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock NOT BETWEEN 10 AND 20",
                hints: ["Usa NOT BETWEEN"],
                explanation: "Esclusione range stock.",
                replacements: {}
            },
            {
                titleTemplate: "AND con Tre Filtri",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'premium' è TRUE, 'paese' è 'Italia' E 'id' > 10.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND id > 10",
                hints: ["Tre condizioni AND"],
                explanation: "Filtri multipli.",
                replacements: {}
            },
            {
                titleTemplate: "OR con Tre Filtri",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'paese' = 'Italia' O 'paese' = 'Francia' O 'paese' = 'Germania'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia' OR paese = 'Francia' OR paese = 'Germania'",
                hints: ["Tre condizioni OR"],
                explanation: "Alternative multiple.",
                replacements: {}
            },
            {
                titleTemplate: "Misto AND/OR Semplice",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove ('categoria_id' = 1 E 'prezzo' < 50) OPPURE ('categoria_id' = 2 E 'prezzo' > 100).",
                queryTemplate: "SELECT * FROM prodotti WHERE (categoria_id = 1 AND prezzo < 50) OR (categoria_id = 2 AND prezzo > 100)",
                hints: ["Usa parentesi per i gruppi AND"],
                explanation: "Logica mista.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Lunghezza Nome",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la lunghezza di 'nome' (LEN) è maggiore di 5.",
                queryTemplate: "SELECT * FROM utenti WHERE LEN(nome) > 5",
                hints: ["Usa LEN(colonna)"],
                explanation: "Filtro su lunghezza stringa.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Iniziale Nome",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove la prima lettera di 'nome' (LEFT) è 'A'.",
                queryTemplate: "SELECT * FROM utenti WHERE LEFT(nome, 1) = 'A'",
                hints: ["Usa LEFT(colonna, 1)"],
                explanation: "Filtro su iniziale.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Finale Email",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove gli ultimi 4 caratteri di 'email' (RIGHT) sono '.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE RIGHT(email, 4) = '.com'",
                hints: ["Usa RIGHT(colonna, 4)"],
                explanation: "Filtro su suffisso.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Anno Corrente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove l'anno di 'data_ordine' è 2024.",
                queryTemplate: "SELECT * FROM ordini WHERE YEAR(data_ordine) = 2024",
                hints: ["Usa YEAR()"],
                explanation: "Filtro anno.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Mese Corrente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove il mese di 'data_ordine' è 11.",
                queryTemplate: "SELECT * FROM ordini WHERE MONTH(data_ordine) = 11",
                hints: ["Usa MONTH()"],
                explanation: "Filtro mese.",
                replacements: {}
            },
            {
                titleTemplate: "Filtro Giorno",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' dove il giorno di 'data_ordine' è 15.",
                queryTemplate: "SELECT * FROM ordini WHERE DAY(data_ordine) = 15",
                hints: ["Usa DAY()"],
                explanation: "Filtro giorno del mese.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Ricerca Pattern ({name})",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'nome' inizia con '{name}'.",
                queryTemplate: "SELECT * FROM utenti WHERE nome LIKE '{name}%'",
                hints: ["Usa LIKE con il jolly %", "Esempio: LIKE 'Abc%'"],
                explanation: "LIKE permette il pattern matching parziale.",
                replacements: { name: ['Mar', 'Giu', 'Al', 'Fra', 'Luc', 'Rob', 'Elen', 'Ales'] }
            },
            {
                titleTemplate: "Logica Complessa (OR + AND)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove ('prezzo' > 100 OPPURE 'stock' = 0) E 'categoria_id' = {cat}.",
                queryTemplate: "SELECT * FROM prodotti WHERE (prezzo > 100 OR stock = 0) AND categoria_id = {cat}",
                hints: ["Usa le parentesi per raggruppare l'OR", "(A OR B) AND C"],
                explanation: "Le parentesi sono fondamentali quando mischi AND e OR.",
                replacements: { cat: [1, 2, 3] }
            },
            {
                titleTemplate: "Gestione NULL",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' dove 'codice_tracking' è NULL.",
                queryTemplate: "SELECT * FROM spedizioni WHERE codice_tracking IS NULL",
                hints: ["Non usare = NULL, usa IS NULL"],
                explanation: "In SQL, NULL non è uguale a niente, nemmeno a se stesso.",
                replacements: {}
            },
            {
                titleTemplate: "Esclusione Lista",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' dove 'nazione' NON è IN ('Italia', 'Germania').",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione NOT IN ('Italia', 'Germania')",
                hints: ["Usa NOT IN (...)"],
                explanation: "Filtro di esclusione su insieme di valori.",
                replacements: {}
            },
            {
                titleTemplate: "LIKE Pattern Finale ({pattern})",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'nome' finisce con '{pattern}'.",
                queryTemplate: "SELECT * FROM prodotti WHERE nome LIKE '%{pattern}'",
                hints: ["Usa % all'inizio per pattern finale", "LIKE '%pattern'"],
                explanation: "LIKE con % all'inizio per pattern finali.",
                replacements: { pattern: ['1', '2', '3', '4', '5'] }
            },
            {
                titleTemplate: "LIKE Pattern Contiene ({pattern})",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'nome' contiene '{pattern}'.",
                queryTemplate: "SELECT * FROM utenti WHERE nome LIKE '%{pattern}%'",
                hints: ["Usa % prima e dopo", "LIKE '%pattern%'"],
                explanation: "LIKE con % su entrambi i lati per ricerca contenuto.",
                replacements: { pattern: ['ar', 'ia', 'co', 'ca'] }
            },
            {
                titleTemplate: "LIKE Email Pattern",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'email' contiene '@mail.com'.",
                queryTemplate: "SELECT * FROM utenti WHERE email LIKE '%@mail.com'",
                hints: ["Usa LIKE con %", "WHERE email LIKE '%@mail.com'"],
                explanation: "LIKE per pattern matching su email.",
                replacements: {}
            },
            {
                titleTemplate: "IS NOT NULL",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' dove 'codice_tracking' NON è NULL.",
                queryTemplate: "SELECT * FROM spedizioni WHERE codice_tracking IS NOT NULL",
                hints: ["Usa IS NOT NULL", "WHERE colonna IS NOT NULL"],
                explanation: "IS NOT NULL per trovare valori non nulli.",
                replacements: {}
            },
            {
                titleTemplate: "OR Semplice",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'prezzo' > 200 OPPURE 'stock' > 40.",
                queryTemplate: "SELECT * FROM prodotti WHERE prezzo > 200 OR stock > 40",
                hints: ["Usa OR per alternative", "condizione1 OR condizione2"],
                explanation: "OR restituisce righe che soddisfano almeno una condizione.",
                replacements: {}
            },
            {
                titleTemplate: "OR con Tre Opzioni",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove 'categoria_id' = 1 OPPURE 'categoria_id' = 2 OPPURE 'categoria_id' = 3.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = 1 OR categoria_id = 2 OR categoria_id = 3",
                hints: ["Usa OR multipli", "categoria_id = 1 OR categoria_id = 2 OR categoria_id = 3"],
                explanation: "OR multipli per alternative.",
                replacements: {}
            },
            {
                titleTemplate: "OR Paesi",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'paese' = 'Italia' OPPURE 'paese' = 'Francia' OPPURE 'paese' = 'Germania'.",
                queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia' OR paese = 'Francia' OR paese = 'Germania'",
                hints: ["Usa OR per paesi multipli", "paese = '...' OR paese = '...' OR paese = '...'"],
                explanation: "OR per filtrare su più paesi.",
                replacements: {}
            },
            {
                titleTemplate: "Parentesi OR e AND",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' dove ('prezzo' > 100 OPPURE 'stock' > 30) E 'categoria_id' = 1.",
                queryTemplate: "SELECT * FROM prodotti WHERE (prezzo > 100 OR stock > 30) AND categoria_id = 1",
                hints: ["Usa parentesi per raggruppare OR", "(A OR B) AND C"],
                explanation: "Parentesi per controllare l'ordine di valutazione.",
                replacements: {}
            },
            {
                titleTemplate: "AND e OR Complesso",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' dove 'premium' è TRUE E ('paese' = 'Italia' OPPURE 'paese' = 'Francia').",
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
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC",
                brokenCode: "SELECT * FROM prodotti ORDER prezzo ASC",
                debugHint: "Manca la parola chiave BY dopo ORDER.",
                hints: ["Usa ORDER BY colonna ASC", "ASC è opzionale (default)"],
                explanation: "L'ordinamento base.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'stock' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY stock DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY colonna DESC"],
                explanation: "DESC inverte l'ordine.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Cronologici",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'data_ordine' in ordine crescente (dal più vecchio).",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine",
                brokenCode: "SELECT * FROM ordini ORDER data_ordine",
                debugHint: "Manca la parola chiave BY dopo ORDER.",
                hints: ["Le date ordinate ASC partono dal passato verso il futuro"],
                explanation: "Ordinare date è essenziale per analisi temporali.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Utenti A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'nome' in ordine alfabetico crescente (A-Z).",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY nome A SC",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY nome ASC"],
                explanation: "Ordinamento alfabetico crescente.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Utenti Z-A",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'nome' in ordine alfabetico decrescente (Z-A).",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome DESC",
                brokenCode: "SELECT * FROM utenti ORDER BY nome DSC",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY nome DESC"],
                explanation: "Ordinamento alfabetico decrescente.",
                replacements: {}
            },
            {
                titleTemplate: "Email Utenti A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'email' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY email ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY email AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY email ASC"],
                explanation: "Ordinamento su colonna email.",
                replacements: {}
            },
            {
                titleTemplate: "Paesi Utenti A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'paese' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY country ASC",
                debugHint: "Controlla il nome della colonna paese.",
                hints: ["Usa ORDER BY paese ASC"],
                explanation: "Ordinamento per paese.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Prodotti A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'nome' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY nome ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY name ASC",
                debugHint: "Controlla il nome della colonna nome.",
                hints: ["Usa ORDER BY nome ASC"],
                explanation: "Ordinamento prodotti per nome.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Prodotti Z-A",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'nome' in ordine alfabetico decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY nome DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY name DESC",
                debugHint: "Controlla il nome della colonna nome.",
                hints: ["Usa ORDER BY nome DESC"],
                explanation: "Ordinamento decrescente per nome.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY price DESC",
                debugHint: "Controlla il nome della colonna prezzo.",
                hints: ["Usa ORDER BY prezzo DESC"],
                explanation: "Ordinamento decrescente per prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'stock' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY stock ASCC",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY stock ASC"],
                explanation: "Ordinamento crescente per stock.",
                replacements: {}
            },
            {
                titleTemplate: "ID Utenti Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'id' in ordine crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY id ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY id A_SC",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY id ASC"],
                explanation: "Ordinamento per ID crescente.",
                replacements: {}
            },
            {
                titleTemplate: "ID Utenti Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'id' in ordine decrescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY id DESC",
                brokenCode: "SELECT * FROM utenti ORDER BY id DE SC",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY id DESC"],
                explanation: "Ordinamento per ID decrescente.",
                replacements: {}
            },
            {
                titleTemplate: "ID Prodotti Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY id ASC"],
                explanation: "Ordinamento prodotti per ID.",
                replacements: {}
            },
            {
                titleTemplate: "ID Prodotti Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY id DESC"],
                explanation: "Ordinamento decrescente per ID.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria ID Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'categoria_id' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY categoria_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY categoria_id ASC"],
                explanation: "Ordinamento per categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Categoria ID Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'categoria_id' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY categoria_id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY categoria_id DESC"],
                explanation: "Ordinamento decrescente per categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitore ID Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'fornitore_id' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY fornitore_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY fornitore_id ASC"],
                explanation: "Ordinamento per fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitore ID Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'fornitore_id' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id DESC",
                brokenCode: "SELECT * FROM prodotti ORDER BY fornitore_id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY fornitore_id DESC"],
                explanation: "Ordinamento decrescente per fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Data Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'data_ordine' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC",
                brokenCode: "SELECT * FROM ordini ORDER BY data_ordine DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY data_ordine DESC"],
                explanation: "Ordinamento decrescente per data.",
                replacements: {}
            },
            {
                titleTemplate: "Quantità Ordine Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'quantita' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita ASC",
                brokenCode: "SELECT * FROM ordini ORDER BY quantita AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY quantita ASC"],
                explanation: "Ordinamento per quantità crescente.",
                replacements: {}
            },
            {
                titleTemplate: "Quantità Ordine Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'quantita' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita DESC",
                brokenCode: "SELECT * FROM ordini ORDER BY quantita DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY quantita DESC"],
                explanation: "Ordinamento per quantità decrescente.",
                replacements: {}
            },
            {
                titleTemplate: "ID Ordine Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'id' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY id ASC",
                brokenCode: "SELECT * FROM ordini ORDER BY id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY id ASC"],
                explanation: "Ordinamento ordini per ID.",
                replacements: {}
            },
            {
                titleTemplate: "ID Ordine Decrescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'id' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY id DESC",
                brokenCode: "SELECT * FROM ordini ORDER BY id DES",
                debugHint: "Errore di battitura nella parola chiave DESC.",
                hints: ["Usa ORDER BY id DESC"],
                explanation: "Ordinamento decrescente per ID ordine.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Categorie A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'categorie' ordinati per la colonna 'nome' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM categorie ORDER BY nome ASC",
                brokenCode: "SELECT * FROM categorie ORDER BY nome AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY nome ASC"],
                explanation: "Ordinamento categorie per nome.",
                replacements: {}
            },
            {
                titleTemplate: "Aziende Fornitori A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' ordinati per la colonna 'azienda' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY azienda ASC",
                brokenCode: "SELECT * FROM fornitori ORDER BY azienda AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY azienda ASC"],
                explanation: "Ordinamento fornitori per azienda.",
                replacements: {}
            },
            {
                titleTemplate: "Nazioni Fornitori A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' ordinati per la colonna 'nazione' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY nazione ASC",
                brokenCode: "SELECT * FROM fornitori ORDER BY nazione AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY nazione ASC"],
                explanation: "Ordinamento fornitori per nazione.",
                replacements: {}
            },
            {
                titleTemplate: "Corrieri A-Z",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' ordinati per la colonna 'corriere' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY corriere ASC",
                brokenCode: "SELECT * FROM spedizioni ORDER BY corriere AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY corriere ASC"],
                explanation: "Ordinamento spedizioni per corriere.",
                replacements: {}
            },
            {
                titleTemplate: "Date Spedizione Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' ordinati per la colonna 'data_spedizione' in ordine crescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY data_spedizione ASC",
                brokenCode: "SELECT * FROM spedizioni ORDER BY data_spedizione AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY data_spedizione ASC"],
                explanation: "Ordinamento spedizioni per data.",
                replacements: {}
            },
            {
                titleTemplate: "Voti Recensioni Crescente",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' ordinati per la colonna 'voto' in ordine crescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto ASC",
                brokenCode: "SELECT * FROM recensioni ORDER BY voto AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa ORDER BY voto ASC"],
                explanation: "Ordinamento recensioni per voto crescente.",
                replacements: {}
            },
            // NEW EXERCISES FOR SORTING EASY
            {
                titleTemplate: "Ordina per ID",
                descTemplate: "Seleziona tutti i record dalla tabella '{table}' ordinati per la colonna 'id' in ordine crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id ASC",
                brokenCode: "SELECT * FROM {table} ORDER BY id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["Usa la clausola per l'ordinamento specificando la colonna e la direzione."],
                explanation: "Ordinamento standard.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Ordina per Nome",
                descTemplate: "Seleziona tutti i record dalla tabella '{table}' ordinati per la colonna 'nome' in ordine crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY nome ASC",
                brokenCode: "SELECT * FROM {table} ORDER BY nome AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY nome"],
                explanation: "Ordinamento alfabetico.",
                replacements: { table: ['utenti', 'prodotti', 'categorie'] }
            },
            {
                titleTemplate: "Ordina per Data",
                descTemplate: "Seleziona tutti i record dalla tabella '{table}' ordinati per la colonna '{col}' in ordine crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY {col} ASC",
                brokenCode: "SELECT * FROM {table} ORDER BY {col} AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY data..."],
                explanation: "Ordinamento temporale.",
                replacements: { table: ['ordini', 'spedizioni'], col: ['data_ordine', 'data_spedizione'] }
            },
            {
                titleTemplate: "Ordina per Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY prezzo AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY prezzo"],
                explanation: "Ordinamento economico.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Stock",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'stock' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY stock AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY stock"],
                explanation: "Ordinamento quantità.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Voto",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' ordinati per la colonna 'voto' in ordine crescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto ASC",
                brokenCode: "SELECT * FROM recensioni ORDER BY voto AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY voto"],
                explanation: "Ordinamento valutazione.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Quantità",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'quantita' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita ASC",
                brokenCode: "SELECT * FROM ordini ORDER BY quantita AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY quantita"],
                explanation: "Ordinamento volume.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Paese",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'paese' in ordine crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY paese AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY paese"],
                explanation: "Ordinamento geografico.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Email",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per la colonna 'email' in ordine crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY email ASC",
                brokenCode: "SELECT * FROM utenti ORDER BY email AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY email"],
                explanation: "Ordinamento contatti.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Corriere",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' ordinati per la colonna 'corriere' in ordine crescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY corriere ASC",
                brokenCode: "SELECT * FROM spedizioni ORDER BY corriere AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY corriere"],
                explanation: "Ordinamento logistico.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Azienda",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' ordinati per la colonna 'azienda' in ordine crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY azienda ASC",
                brokenCode: "SELECT * FROM fornitori ORDER BY azienda AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY azienda"],
                explanation: "Ordinamento fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Nazione",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' ordinati per la colonna 'nazione' in ordine crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY nazione ASC",
                brokenCode: "SELECT * FROM fornitori ORDER BY nazione AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY nazione"],
                explanation: "Ordinamento geografico fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Categoria",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'categoria_id' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY categoria_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY categoria_id"],
                explanation: "Ordinamento categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Fornitore",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per la colonna 'fornitore_id' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC",
                brokenCode: "SELECT * FROM prodotti ORDER BY fornitore_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY fornitore_id"],
                explanation: "Ordinamento fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Ordina per Utente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati per la colonna 'utente_id' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY utente_id ASC",
                brokenCode: "SELECT * FROM ordini ORDER BY utente_id AS",
                debugHint: "Errore di battitura nella parola chiave ASC.",
                hints: ["ORDER BY utente_id"],
                explanation: "Ordinamento utente.",
                replacements: {}
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Top {limit} Prodotti",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT {limit}",
                hints: ["Combina ORDER BY DESC con LIMIT"],
                explanation: "LIMIT taglia il risultato dopo N righe.",
                replacements: { limit: [3, 5, 7, 10, 15, 20] },
                brokenCode: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT {limit} OFFSET",
                debugHint: "OFFSET non serve qui, rimuovilo."
            },
            {
                titleTemplate: "Paginazione (Offset)",
                descTemplate: "Seleziona 5 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi {skip} risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET {skip}",
                hints: ["Usa LIMIT x OFFSET y combinato con ORDER BY."],
                explanation: "Fondamentale per la paginazione nei siti web.",
                replacements: { skip: [5, 10, 15, 20] },
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 SKIP {skip}",
                debugHint: "La parola chiave per saltare righe è 'OFFSET', non 'SKIP'."
            },
            {
                titleTemplate: "Utenti Recenti",
                descTemplate: "Seleziona gli ultimi {limit} record dalla tabella 'utenti' ordinati per la colonna 'id' in ordine decrescente (i più recenti).",
                queryTemplate: "SELECT * FROM utenti ORDER BY id DESC LIMIT {limit}",
                hints: ["ID più alto = iscrizione più recente"],
                explanation: "Spesso le chiavi primarie sono sequenziali.",
                replacements: { limit: [5, 7, 10, 15, 20] },
                brokenCode: "SELECT * FROM utenti ORDER BY id DESC TOP {limit}",
                debugHint: "In SQL standard (o SQLite) si usa 'LIMIT' alla fine, non 'TOP' all'inizio."
            },
            {
                titleTemplate: "Top {limit} Prezzi",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT {limit}",
                hints: ["ORDER BY prezzo DESC LIMIT {limit}"],
                explanation: "LIMIT per top N risultati.",
                replacements: { limit: [3, 5, 10] },
                brokenCode: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT {limit},",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Prodotti Economici Top {limit}",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC LIMIT {limit}",
                hints: ["ORDER BY prezzo ASC LIMIT {limit}"],
                explanation: "LIMIT per bottom N risultati.",
                replacements: { limit: [3, 5, 10] },
                brokenCode: "SELECT * FROM prodotti ORDER BY prezzo ASC LIMIT {limit} ROWS",
                debugHint: "La sintassi è semplicemente 'LIMIT numero', senza 'ROWS'."
            },
            {
                titleTemplate: "Top Stock {limit}",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'prodotti' ordinati per la colonna 'stock' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock DESC LIMIT {limit}",
                hints: ["ORDER BY stock DESC LIMIT {limit}"],
                explanation: "LIMIT per prodotti ben forniti.",
                replacements: { limit: [3, 5, 10] },
                brokenCode: "SELECT * FROM prodotti ORDER BY stock DESC LIMIT {limit} ONLY",
                debugHint: "Rimuovi 'ONLY' dopo il limite."
            },
            {
                titleTemplate: "Primi {limit} Utenti",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'utenti' ordinati per la colonna 'nome' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC LIMIT {limit}",
                hints: ["ORDER BY nome ASC LIMIT {limit}"],
                explanation: "LIMIT per primi N risultati.",
                replacements: { limit: [5, 10, 15] },
                brokenCode: "SELECT * FROM utenti ORDER BY nome ASC LIMIT {limit} .",
                debugHint: "Rimuovi il punto finale."
            },
            {
                titleTemplate: "Ultimi {limit} Ordini",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'ordini' ordinati per la colonna 'data_ordine' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC LIMIT {limit}",
                hints: ["ORDER BY data_ordine DESC LIMIT {limit}"],
                explanation: "LIMIT per ordini recenti.",
                replacements: { limit: [5, 10, 15] },
                brokenCode: "SELECT * FROM ordini ORDER BY data_ordine DESC LIMIT {limit} *",
                debugHint: "Rimuovi l'asterisco finale."
            },
            {
                titleTemplate: "Paginazione Pagina 2",
                descTemplate: "Seleziona 10 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi 10 risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 10",
                hints: ["LIMIT 10 OFFSET 10"],
                explanation: "OFFSET per saltare righe.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10, 10",
                debugHint: "Usa la sintassi esplicita 'LIMIT 10 OFFSET 10' per chiarezza."
            },
            {
                titleTemplate: "Paginazione Pagina 3",
                descTemplate: "Seleziona 10 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi 20 risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 20",
                hints: ["LIMIT 10 OFFSET 20"],
                explanation: "OFFSET multiplo per pagine successive.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 20,",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Paginazione Utenti",
                descTemplate: "Seleziona 5 record dalla tabella 'utenti' ordinati per la colonna 'id' in ordine crescente, saltando i primi {skip} risultati.",
                queryTemplate: "SELECT * FROM utenti ORDER BY id ASC LIMIT 5 OFFSET {skip}",
                hints: ["LIMIT 5 OFFSET {skip}"],
                explanation: "Paginazione per utenti.",
                replacements: { skip: [5, 10, 15] },
                brokenCode: "SELECT * FROM utenti ORDER BY id ASC LIMIT 5 OFFSET {skip} ,",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "Paginazione Ordini",
                descTemplate: "Seleziona 10 record dalla tabella 'ordini' ordinati per la colonna 'id' in ordine crescente, saltando i primi {skip} risultati.",
                queryTemplate: "SELECT * FROM ordini ORDER BY id ASC LIMIT 10 OFFSET {skip}",
                hints: ["LIMIT 10 OFFSET {skip}"],
                explanation: "Paginazione per ordini.",
                replacements: { skip: [10, 20, 30] },
                brokenCode: "SELECT * FROM ordini ORDER BY id ASC LIMIT 10 OFFSET {skip} .",
                debugHint: "Rimuovi il punto finale."
            },
            {
                titleTemplate: "Top Voti {limit}",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'recensioni' ordinati per la colonna 'voto' in ordine decrescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto DESC LIMIT {limit}",
                hints: ["ORDER BY voto DESC LIMIT {limit}"],
                explanation: "LIMIT per recensioni migliori.",
                replacements: { limit: [5, 10, 15] },
                brokenCode: "SELECT * FROM recensioni ORDER BY voto DESC LIMIT {limit} ROWS",
                debugHint: "Rimuovi 'ROWS' dopo il limite."
            },
            {
                titleTemplate: "Ordini Recenti {limit}",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'ordini' ordinati per la colonna 'data_ordine' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC LIMIT {limit}",
                hints: ["ORDER BY data_ordine DESC LIMIT {limit}"],
                explanation: "LIMIT per ordini recenti.",
                replacements: { limit: [5, 10, 15] }
            },
            {
                titleTemplate: "Spedizioni Recenti {limit}",
                descTemplate: "Seleziona i primi {limit} record dalla tabella 'spedizioni' ordinati per la colonna 'data_spedizione' in ordine decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY data_spedizione DESC LIMIT {limit}",
                hints: ["ORDER BY data_spedizione DESC LIMIT {limit}"],
                explanation: "LIMIT per spedizioni recenti.",
                replacements: { limit: [5, 10, 15] },
                brokenCode: "SELECT * FROM spedizioni ORDER BY data_spedizione DESC LIMIT {limit} *",
                debugHint: "Rimuovi l'asterisco."
            },
            {
                titleTemplate: "LIMIT con ORDER BY Prezzo",
                descTemplate: "Seleziona i primi 5 record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo ASC LIMIT 5",
                hints: ["ORDER BY prezzo ASC LIMIT 5"],
                explanation: "LIMIT combinato con ORDER BY.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY prezzo ASC LIMIT 5 OFFSET",
                debugHint: "Rimuovi OFFSET se non specificato."
            },
            {
                titleTemplate: "LIMIT con ORDER BY Stock",
                descTemplate: "Seleziona i primi 7 record dalla tabella 'prodotti' ordinati per la colonna 'stock' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY stock DESC LIMIT 7",
                hints: ["ORDER BY stock DESC LIMIT 7"],
                explanation: "LIMIT con ordinamento stock.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY stock DESC LIMIT 7 SKIP",
                debugHint: "Rimuovi SKIP."
            },
            {
                titleTemplate: "LIMIT con ORDER BY Nome",
                descTemplate: "Seleziona i primi 10 record dalla tabella 'utenti' ordinati per la colonna 'nome' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC LIMIT 10",
                hints: ["ORDER BY nome ASC LIMIT 10"],
                explanation: "LIMIT con ordinamento nome.",
                replacements: {},
                brokenCode: "SELECT * FROM utenti ORDER BY nome ASC LIMIT 10,",
                debugHint: "Rimuovi la virgola."
            },
            {
                titleTemplate: "LIMIT con ORDER BY Data",
                descTemplate: "Seleziona i primi 8 record dalla tabella 'ordini' ordinati per la colonna 'data_ordine' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine ASC LIMIT 8",
                hints: ["ORDER BY data_ordine ASC LIMIT 8"],
                explanation: "LIMIT con ordinamento data.",
                replacements: {},
                brokenCode: "SELECT * FROM ordini ORDER BY data_ordine ASC LIMIT 8 .",
                debugHint: "Rimuovi il punto."
            },
            {
                titleTemplate: "OFFSET Piccolo",
                descTemplate: "Seleziona 5 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi 3 risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET 3",
                hints: ["LIMIT 5 OFFSET 3"],
                explanation: "OFFSET piccolo per iniziare paginazione.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5, 3",
                debugHint: "Usa 'LIMIT 5 OFFSET 3' per chiarezza."
            },
            {
                titleTemplate: "OFFSET Medio",
                descTemplate: "Seleziona 10 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi 15 risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10 OFFSET 15",
                hints: ["LIMIT 10 OFFSET 15"],
                explanation: "OFFSET medio per pagine centrali.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 10, 15",
                debugHint: "Usa 'LIMIT 10 OFFSET 15'."
            },
            {
                titleTemplate: "OFFSET Grande",
                descTemplate: "Seleziona 5 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi 25 risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET 25",
                hints: ["LIMIT 5 OFFSET 25"],
                explanation: "OFFSET grande per pagine avanzate.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 5 OFFSET 25,",
                debugHint: "Rimuovi la virgola finale."
            },
            {
                titleTemplate: "LIMIT Utenti con Nome",
                descTemplate: "Seleziona i primi 12 record dalla tabella 'utenti' ordinati per la colonna 'nome' in ordine alfabetico crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC LIMIT 12",
                hints: ["ORDER BY nome ASC LIMIT 12"],
                explanation: "LIMIT con ordinamento alfabetico.",
                replacements: {},
                brokenCode: "SELECT * FROM utenti ORDER BY nome ASC LIMIT 12 ROWS",
                debugHint: "Rimuovi 'ROWS'."
            },
            {
                titleTemplate: "LIMIT Prodotti con Prezzo",
                descTemplate: "Seleziona i primi 6 record dalla tabella 'prodotti' ordinati per la colonna 'prezzo' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT 6",
                hints: ["ORDER BY prezzo DESC LIMIT 6"],
                explanation: "LIMIT con ordinamento prezzo.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY prezzo DESC LIMIT 6 ONLY",
                debugHint: "Rimuovi 'ONLY'."
            },
            {
                titleTemplate: "LIMIT Ordini con Quantità",
                descTemplate: "Seleziona i primi 9 record dalla tabella 'ordini' ordinati per la colonna 'quantita' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY quantita DESC LIMIT 9",
                hints: ["ORDER BY quantita DESC LIMIT 9"],
                explanation: "LIMIT con ordinamento quantità.",
                replacements: {},
                brokenCode: "SELECT * FROM ordini ORDER BY quantita DESC LIMIT 9 *",
                debugHint: "Rimuovi l'asterisco."
            },
            {
                titleTemplate: "LIMIT Recensioni con Voto",
                descTemplate: "Seleziona i primi 11 record dalla tabella 'recensioni' ordinati per la colonna 'voto' in ordine decrescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto DESC LIMIT 11",
                hints: ["ORDER BY voto DESC LIMIT 11"],
                explanation: "LIMIT con ordinamento voto.",
                replacements: {},
                brokenCode: "SELECT * FROM recensioni ORDER BY voto DESC LIMIT 11 .",
                debugHint: "Rimuovi il punto."
            },
            {
                titleTemplate: "Paginazione Completa",
                descTemplate: "Seleziona 8 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi 16 risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 8 OFFSET 16",
                hints: ["LIMIT 8 OFFSET 16"],
                explanation: "Paginazione completa con LIMIT e OFFSET.",
                replacements: {},
                brokenCode: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 8, 16",
                debugHint: "Usa 'LIMIT 8 OFFSET 16'."
            },
            {
                titleTemplate: "LIMIT con Data Ordine",
                descTemplate: "Seleziona i primi 4 record dalla tabella 'ordini' ordinati per la colonna 'data_ordine' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine ASC LIMIT 4",
                hints: ["ORDER BY data_ordine ASC LIMIT 4"],
                explanation: "LIMIT con ordinamento data ordine.",
                replacements: {},
                brokenCode: "SELECT * FROM ordini ORDER BY data_ordine ASC LIMIT 4 OFFSET",
                debugHint: "Rimuovi OFFSET vuoto."
            },
            {
                titleTemplate: "LIMIT con Data Spedizione",
                descTemplate: "Seleziona i primi 13 record dalla tabella 'spedizioni' ordinati per la colonna 'data_spedizione' in ordine decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY data_spedizione DESC LIMIT 13",
                hints: ["ORDER BY data_spedizione DESC LIMIT 13"],
                explanation: "LIMIT con ordinamento data spedizione.",
                replacements: {},
                brokenCode: "SELECT * FROM spedizioni ORDER BY data_spedizione DESC LIMIT 13 SKIP",
                debugHint: "Rimuovi SKIP."
            },
            {
                titleTemplate: "OFFSET Variabile",
                descTemplate: "Seleziona 7 record dalla tabella 'prodotti' ordinati per la colonna 'id' in ordine crescente, saltando i primi {skip} risultati.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY id ASC LIMIT 7 OFFSET {skip}",
                hints: ["LIMIT 7 OFFSET {skip}"],
                explanation: "OFFSET variabile per paginazione dinamica.",
                replacements: { skip: [7, 14, 21, 28] }
            },
            // NEW EXERCISES FOR SORTING MEDIUM
            {
                titleTemplate: "Top 3 {table}",
                descTemplate: "Seleziona i primi 3 record dalla tabella '{table}' ordinati per la colonna 'id' in ordine crescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id ASC LIMIT 3",
                hints: ["ORDER BY id LIMIT 3"],
                explanation: "Top N generico.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Ultimi 3 {table}",
                descTemplate: "Seleziona i primi 3 record dalla tabella '{table}' ordinati per la colonna 'id' in ordine decrescente.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id DESC LIMIT 3",
                hints: ["ORDER BY id DESC LIMIT 3"],
                explanation: "Bottom N generico.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Paginazione {table}",
                descTemplate: "Seleziona 5 record dalla tabella '{table}' ordinati per la colonna 'id' in ordine crescente, saltando i primi 5 risultati.",
                queryTemplate: "SELECT * FROM {table} ORDER BY id ASC LIMIT 5 OFFSET 5",
                hints: ["LIMIT 5 OFFSET 5"],
                explanation: "Paginazione generica.",
                replacements: { table: ['utenti', 'prodotti', 'ordini', 'fornitori', 'spedizioni', 'recensioni', 'categorie'] }
            },
            {
                titleTemplate: "Top Prezzi Categoria {cat}",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'prodotti' dove 'categoria_id' è {cat}, ordinati per 'prezzo' decrescente.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = {cat} ORDER BY prezzo DESC LIMIT 3",
                hints: ["WHERE ... ORDER BY ... LIMIT ..."],
                explanation: "Top N filtrato.",
                replacements: { cat: [1, 2, 3] }
            },
            {
                titleTemplate: "Ordini Recenti Utente {uid}",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'ordini' dove 'utente_id' è {uid}, ordinati per 'data_ordine' decrescente.",
                queryTemplate: "SELECT * FROM ordini WHERE utente_id = {uid} ORDER BY data_ordine DESC LIMIT 3",
                hints: ["WHERE utente_id ... ORDER BY ... LIMIT"],
                explanation: "Cronologia utente.",
                replacements: { uid: [1, 2, 3] }
            },
            {
                titleTemplate: "Spedizioni Recenti Corriere {corr}",
                descTemplate: "Seleziona i primi 5 record dalla tabella 'spedizioni' dove 'corriere' è '{corr}', ordinati per 'data_spedizione' decrescente.",
                queryTemplate: "SELECT * FROM spedizioni WHERE corriere = '{corr}' ORDER BY data_spedizione DESC LIMIT 5",
                hints: ["WHERE corriere ... ORDER BY ... LIMIT"],
                explanation: "Cronologia corriere.",
                replacements: { corr: ['DHL', 'UPS'] }
            },
            {
                titleTemplate: "Recensioni Migliori Prodotto {pid}",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'recensioni' dove 'prodotto_id' è {pid}, ordinati per 'voto' decrescente.",
                queryTemplate: "SELECT * FROM recensioni WHERE prodotto_id = {pid} ORDER BY voto DESC LIMIT 3",
                hints: ["WHERE prodotto_id ... ORDER BY voto DESC LIMIT"],
                explanation: "Top recensioni prodotto.",
                replacements: { pid: [1, 2] }
            },
            {
                titleTemplate: "Recensioni Peggiori Prodotto {pid}",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'recensioni' dove 'prodotto_id' è {pid}, ordinati per 'voto' crescente.",
                queryTemplate: "SELECT * FROM recensioni WHERE prodotto_id = {pid} ORDER BY voto ASC LIMIT 3",
                hints: ["WHERE prodotto_id ... ORDER BY voto ASC LIMIT"],
                explanation: "Bottom recensioni prodotto.",
                replacements: { pid: [1, 2] }
            },
            {
                titleTemplate: "Prodotti Stock Basso",
                descTemplate: "Seleziona i primi 5 record dalla tabella 'prodotti' dove 'stock' > 0, ordinati per 'stock' crescente.",
                queryTemplate: "SELECT * FROM prodotti WHERE stock > 0 ORDER BY stock ASC LIMIT 5",
                hints: ["WHERE stock > 0 ORDER BY stock ASC LIMIT 5"],
                explanation: "Priorità riordino.",
                replacements: {}
            },
            {
                titleTemplate: "Utenti Premium Recenti",
                descTemplate: "Seleziona i primi 5 record dalla tabella 'utenti' dove 'premium' è TRUE, ordinati per 'id' decrescente.",
                queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE ORDER BY id DESC LIMIT 5",
                hints: ["WHERE premium = TRUE ORDER BY id DESC LIMIT 5"],
                explanation: "Nuovi VIP.",
                replacements: {}
            },
            {
                titleTemplate: "Ordini Grandi Recenti",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'ordini' dove 'quantita' > 5, ordinati per 'data_ordine' decrescente.",
                queryTemplate: "SELECT * FROM ordini WHERE quantita > 5 ORDER BY data_ordine DESC LIMIT 3",
                hints: ["WHERE quantita > 5 ORDER BY ... LIMIT"],
                explanation: "Grandi ordini recenti.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Costosi Categoria 1",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'prodotti' dove 'categoria_id' è 1, ordinati per 'prezzo' decrescente.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = 1 ORDER BY prezzo DESC LIMIT 3",
                hints: ["WHERE categoria_id = 1 ..."],
                explanation: "Top categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Prodotti Economici Categoria 2",
                descTemplate: "Seleziona i primi 3 record dalla tabella 'prodotti' dove 'categoria_id' è 2, ordinati per 'prezzo' crescente.",
                queryTemplate: "SELECT * FROM prodotti WHERE categoria_id = 2 ORDER BY prezzo ASC LIMIT 3",
                hints: ["WHERE categoria_id = 2 ..."],
                explanation: "Budget categoria.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitori Italiani A-Z",
                descTemplate: "Seleziona i primi 5 record dalla tabella 'fornitori' dove 'nazione' è 'Italia', ordinati per 'azienda' crescente.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione = 'Italia' ORDER BY azienda ASC LIMIT 5",
                hints: ["WHERE nazione = 'Italia' ..."],
                explanation: "Elenco filtrato ordinato.",
                replacements: {}
            },
            {
                titleTemplate: "Fornitori Esteri A-Z",
                descTemplate: "Seleziona i primi 5 record dalla tabella 'fornitori' dove 'nazione' NON è 'Italia', ordinati per 'azienda' crescente.",
                queryTemplate: "SELECT * FROM fornitori WHERE nazione <> 'Italia' ORDER BY azienda ASC LIMIT 5",
                hints: ["WHERE nazione <> 'Italia' ..."],
                explanation: "Elenco estero ordinato.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Ordinamento Multiplo (Paese/Nome)",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati prima per la colonna 'paese' in ordine crescente, e poi per la colonna 'nome' in ordine crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC, nome ASC",
                hints: ["Elenca le colonne separate da virgola dopo ORDER BY"],
                explanation: "L'ordinamento secondario si applica solo a parità del primario.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Misto (Cat/Prezzo)",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati prima per la colonna 'categoria_id' in ordine crescente, e poi per la colonna 'prezzo' in ordine decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC, prezzo DESC",
                hints: ["ORDER BY col1 ASC, col2 DESC"],
                explanation: "Puoi mixare ASC e DESC su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati in base al valore totale dello stock (calcolato come prezzo * stock) in ordine decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY (prezzo * stock) DESC",
                hints: ["Puoi ordinare in base a un'espressione matematica"],
                explanation: "Non serve creare la colonna nella SELECT per ordinarci sopra, ma aiuta a visualizzare.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Triplo (Paese/Premium/Nome)",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per 'paese' crescente, poi per 'premium' crescente, e infine per 'nome' crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY paese ASC, premium ASC, nome ASC",
                hints: ["Tre colonne separate da virgole", "ORDER BY paese ASC, premium ASC, nome ASC"],
                explanation: "Ordinamento su tre colonne.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Categoria/Stock/Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per 'categoria_id' crescente, poi per 'stock' decrescente, e infine per 'prezzo' crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY categoria_id ASC, stock DESC, prezzo ASC",
                hints: ["Tre colonne con ordinamenti diversi", "ORDER BY categoria_id ASC, stock DESC, prezzo ASC"],
                explanation: "Ordinamento multiplo con direzioni diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Data/Quantità",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati prima per la colonna 'data_ordine' in ordine crescente, e poi per la colonna 'quantita' in ordine decrescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine ASC, quantita DESC",
                hints: ["Due colonne con ordinamenti diversi", "ORDER BY data_ordine ASC, quantita DESC"],
                explanation: "Ordinamento doppio con direzioni diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Fornitore/Categoria/Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per 'fornitore_id' crescente, poi per 'categoria_id' crescente, e infine per 'prezzo' decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC",
                hints: ["Tre colonne", "ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC"],
                explanation: "Ordinamento triplo con mix ASC/DESC.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Valore",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati in base al valore dell'inventario (calcolato come prezzo * stock) in ordine decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY (prezzo * stock) DESC",
                hints: ["Calcola prezzo * stock", "ORDER BY (prezzo * stock) DESC"],
                explanation: "Ordinamento su espressione calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Sconto",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati in base al prezzo scontato (calcolato come prezzo * 0.9) in ordine crescente.",
                queryTemplate: "SELECT *, (prezzo * 0.9) as prezzo_scontato FROM prodotti ORDER BY (prezzo * 0.9) ASC",
                hints: ["Calcola prezzo * 0.9", "ORDER BY (prezzo * 0.9) ASC"],
                explanation: "Ordinamento su calcolo sconto.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Margine",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati in base al margine (calcolato come prezzo - 10) in ordine decrescente.",
                queryTemplate: "SELECT *, (prezzo - 10) as margine FROM prodotti ORDER BY (prezzo - 10) DESC",
                hints: ["Calcola prezzo - 10", "ORDER BY (prezzo - 10) DESC"],
                explanation: "Ordinamento su calcolo margine.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Multiplo con Calcolo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati prima per 'categoria_id' crescente, e poi per il valore (prezzo * stock) decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, (prezzo * stock) DESC",
                hints: ["Combina colonna normale con calcolo", "ORDER BY categoria_id ASC, (prezzo * stock) DESC"],
                explanation: "Ordinamento multiplo con calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Nome/Email",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati prima per la colonna 'nome' in ordine crescente, e poi per la colonna 'email' in ordine crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY nome ASC, email ASC",
                hints: ["Due colonne stringa", "ORDER BY nome ASC, email ASC"],
                explanation: "Ordinamento doppio su stringhe.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Prodotto/Categoria/Stock",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per 'nome' crescente, poi per 'categoria_id' crescente, e infine per 'stock' decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY nome ASC, categoria_id ASC, stock DESC",
                hints: ["Tre colonne", "ORDER BY nome ASC, categoria_id ASC, stock DESC"],
                explanation: "Ordinamento triplo con stringa e numeri.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Data/ID",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati prima per la colonna 'data_ordine' in ordine decrescente, e poi per la colonna 'id' in ordine crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC, id ASC",
                hints: ["Data e ID", "ORDER BY data_ordine DESC, id ASC"],
                explanation: "Ordinamento doppio data/ID.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Voto/Prodotto",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' ordinati prima per 'voto' decrescente, e poi per 'prodotto_id' crescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY voto DESC, prodotto_id ASC",
                hints: ["Voto e prodotto", "ORDER BY voto DESC, prodotto_id ASC"],
                explanation: "Ordinamento doppio recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Corriere/Data",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' ordinati prima per la colonna 'corriere' in ordine crescente, e poi per la colonna 'data_spedizione' in ordine decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY corriere ASC, data_spedizione DESC",
                hints: ["Corriere e data", "ORDER BY corriere ASC, data_spedizione DESC"],
                explanation: "Ordinamento doppio spedizioni.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Azienda/Nazione",
                descTemplate: "Seleziona tutti i record dalla tabella 'fornitori' ordinati prima per la colonna 'azienda' in ordine crescente, e poi per la colonna 'nazione' in ordine crescente.",
                queryTemplate: "SELECT * FROM fornitori ORDER BY azienda ASC, nazione ASC",
                hints: ["Due colonne stringa", "ORDER BY azienda ASC, nazione ASC"],
                explanation: "Ordinamento doppio fornitori.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Categoria/Nome",
                descTemplate: "Seleziona tutti i record dalla tabella 'categorie' ordinati prima per la colonna 'nome' in ordine crescente, e poi per la colonna 'descrizione' in ordine crescente.",
                queryTemplate: "SELECT * FROM categorie ORDER BY nome ASC, descrizione ASC",
                hints: ["Nome e descrizione", "ORDER BY nome ASC, descrizione ASC"],
                explanation: "Ordinamento doppio categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Premium/Paese/Nome",
                descTemplate: "Seleziona tutti i record dalla tabella 'utenti' ordinati per 'premium' crescente, poi per 'paese' crescente, e infine per 'nome' crescente.",
                queryTemplate: "SELECT * FROM utenti ORDER BY premium ASC, paese ASC, nome ASC",
                hints: ["Tre colonne", "ORDER BY premium ASC, paese ASC, nome ASC"],
                explanation: "Ordinamento triplo utenti.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato Complesso",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati in base alla somma (prezzo + stock) in ordine decrescente.",
                queryTemplate: "SELECT *, (prezzo + stock) as somma FROM prodotti ORDER BY (prezzo + stock) DESC",
                hints: ["Calcola prezzo + stock", "ORDER BY (prezzo + stock) DESC"],
                explanation: "Ordinamento su somma calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Categoria/Valore",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati prima per 'categoria_id' crescente, e poi per il valore (prezzo * stock) decrescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, (prezzo * stock) DESC",
                hints: ["Categoria e calcolo", "ORDER BY categoria_id ASC, (prezzo * stock) DESC"],
                explanation: "Ordinamento categoria con calcolo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Fornitore/Prezzo",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati prima per 'fornitore_id' crescente, e poi per 'prezzo' decrescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC, prezzo DESC",
                hints: ["Fornitore e prezzo", "ORDER BY fornitore_id ASC, prezzo DESC"],
                explanation: "Ordinamento fornitore/prezzo.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Data/Utente",
                descTemplate: "Seleziona tutti i record dalla tabella 'ordini' ordinati prima per 'data_ordine' decrescente, e poi per 'utente_id' crescente.",
                queryTemplate: "SELECT * FROM ordini ORDER BY data_ordine DESC, utente_id ASC",
                hints: ["Data e utente", "ORDER BY data_ordine DESC, utente_id ASC"],
                explanation: "Ordinamento data/utente.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Prodotto/Utente/Voto",
                descTemplate: "Seleziona tutti i record dalla tabella 'recensioni' ordinati per 'prodotto_id' crescente, poi per 'utente_id' crescente, e infine per 'voto' decrescente.",
                queryTemplate: "SELECT * FROM recensioni ORDER BY prodotto_id ASC, utente_id ASC, voto DESC",
                hints: ["Tre colonne", "ORDER BY prodotto_id ASC, utente_id ASC, voto DESC"],
                explanation: "Ordinamento triplo recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Ordine/Data",
                descTemplate: "Seleziona tutti i record dalla tabella 'spedizioni' ordinati prima per 'ordine_id' crescente, e poi per 'data_spedizione' decrescente.",
                queryTemplate: "SELECT * FROM spedizioni ORDER BY ordine_id ASC, data_spedizione DESC",
                hints: ["Ordine e data", "ORDER BY ordine_id ASC, data_spedizione DESC"],
                explanation: "Ordinamento ordine/data.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Calcolato con Alias",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati in base al valore calcolato (prezzo * 1.1) decrescente, usando l'alias 'prezzo_iva'.",
                queryTemplate: "SELECT *, (prezzo * 1.1) as prezzo_iva FROM prodotti ORDER BY prezzo_iva DESC",
                hints: ["Usa alias nell'ORDER BY", "ORDER BY prezzo_iva DESC"],
                explanation: "Ordinamento usando alias di colonna calcolata.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Multiplo con Alias",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati prima per 'categoria_id' crescente, e poi per il valore (prezzo * stock) decrescente usando l'alias 'valore'.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, valore DESC",
                hints: ["Usa alias nell'ORDER BY", "ORDER BY categoria_id ASC, valore DESC"],
                explanation: "Ordinamento multiplo con alias.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Quattro Colonne",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per 'fornitore_id' crescente, poi 'categoria_id' crescente, poi 'prezzo' decrescente, e infine 'stock' crescente.",
                queryTemplate: "SELECT * FROM prodotti ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC, stock ASC",
                hints: ["Quattro colonne", "ORDER BY fornitore_id ASC, categoria_id ASC, prezzo DESC, stock ASC"],
                explanation: "Ordinamento su quattro colonne.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Complesso Finale",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per 'categoria_id' crescente, poi per il valore (prezzo * stock) decrescente, e infine per 'nome' crescente.",
                queryTemplate: "SELECT *, (prezzo * stock) as valore FROM prodotti ORDER BY categoria_id ASC, valore DESC, nome ASC",
                hints: ["Tre colonne con calcolo", "ORDER BY categoria_id ASC, valore DESC, nome ASC"],
                explanation: "Ordinamento complesso con calcolo e stringa.",
                replacements: {}
            },
            {
                titleTemplate: "Ordinamento Finale Avanzato",
                descTemplate: "Seleziona tutti i record dalla tabella 'prodotti' ordinati per 'fornitore_id' crescente, poi 'categoria_id' crescente, poi valore (prezzo * stock) decrescente, e infine 'nome' crescente.",
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
                descTemplate: "Seleziona tutti i nomi dalla tabella 'utenti' convertiti in maiuscolo usando la funzione UPPER().",
                queryTemplate: "SELECT UPPER(nome) FROM utenti",
                brokenCode: "SELECT UPPER(nome FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa UPPER()"],
                explanation: "Converte stringhe in UPPERCASE.",
                replacements: {}
            },
            {
                titleTemplate: "Arrotondamento Prezzi",
                descTemplate: "Seleziona tutti i prezzi dalla tabella 'prodotti' arrotondati all'intero più vicino usando la funzione ROUND().",
                queryTemplate: "SELECT ROUND(prezzo, 0) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo 0) FROM prodotti",
                debugHint: "Gli argomenti della funzione devono essere separati da una virgola.",
                hints: ["Usa ROUND(col, 0)"],
                explanation: "Arrotondamento matematico standard.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Nomi",
                descTemplate: "Seleziona il nome e la sua lunghezza per ogni record della tabella 'prodotti' usando la funzione LENGTH().",
                queryTemplate: "SELECT nome, LENGTH(nome) FROM prodotti",
                brokenCode: "SELECT nome, LENGTH(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() o LEN()"],
                explanation: "Utile per validazione dati.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Minuscoli",
                descTemplate: "Seleziona tutti i nomi dalla tabella 'utenti' convertiti in minuscolo usando la funzione LOWER().",
                queryTemplate: "SELECT LOWER(nome) FROM utenti",
                brokenCode: "SELECT LOW(nome) FROM utenti",
                debugHint: "Il nome della funzione per convertire in minuscolo è LOWER.",
                hints: ["Usa LOWER()"],
                explanation: "Converte stringhe in lowercase.",
                replacements: {}
            },
            {
                titleTemplate: "Email Maiuscole",
                descTemplate: "Seleziona tutte le email dalla tabella 'utenti' convertite in maiuscolo usando la funzione UPPER().",
                queryTemplate: "SELECT UPPER(email) FROM utenti",
                brokenCode: "SELECT UP(email) FROM utenti",
                debugHint: "Il nome della funzione per convertire in maiuscolo è UPPER.",
                hints: ["Usa UPPER() su email"],
                explanation: "UPPER() su colonna email.",
                replacements: {}
            },
            {
                titleTemplate: "Nomi Prodotti Maiuscoli",
                descTemplate: "Seleziona tutti i nomi dalla tabella 'prodotti' convertiti in maiuscolo usando la funzione UPPER().",
                queryTemplate: "SELECT UPPER(nome) FROM prodotti",
                brokenCode: "SELECT UPPER nome FROM prodotti",
                debugHint: "Le funzioni richiedono le parentesi attorno agli argomenti.",
                hints: ["Usa UPPER() su nome prodotto"],
                explanation: "UPPER() su nomi prodotti.",
                replacements: {}
            },
            {
                titleTemplate: "Paesi Maiuscoli",
                descTemplate: "Seleziona tutti i paesi dalla tabella 'utenti' convertiti in maiuscolo usando la funzione UPPER().",
                queryTemplate: "SELECT UPPER(paese) FROM utenti",
                brokenCode: "SELECT UPPER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura.",
                hints: ["Usa UPPER() su paese"],
                explanation: "UPPER() su colonna paese.",
                replacements: {}
            },
            {
                titleTemplate: "Aziende Maiuscole",
                descTemplate: "Seleziona tutti i nomi azienda dalla tabella 'fornitori' convertiti in maiuscolo usando la funzione UPPER().",
                queryTemplate: "SELECT UPPER(azienda) FROM fornitori",
                brokenCode: "SELECT UPPER(azienda)) FROM fornitori",
                debugHint: "C'è una parentesi di troppo.",
                hints: ["Usa UPPER() su azienda"],
                explanation: "UPPER() su aziende.",
                replacements: {}
            },
            {
                titleTemplate: "Corrieri Maiuscoli",
                descTemplate: "Seleziona tutti i nomi corriere dalla tabella 'spedizioni' convertiti in maiuscolo usando la funzione UPPER().",
                queryTemplate: "SELECT UPPER(corriere) FROM spedizioni",
                brokenCode: "SELECT UPPER corriere) FROM spedizioni",
                debugHint: "Manca la parentesi di apertura.",
                hints: ["Usa UPPER() su corriere"],
                explanation: "UPPER() su corrieri.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato 1 Decimale",
                descTemplate: "Seleziona tutti i prezzi dalla tabella 'prodotti' arrotondati a 1 cifra decimale usando la funzione ROUND().",
                queryTemplate: "SELECT ROUND(prezzo, 1) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo; 1) FROM prodotti",
                debugHint: "Usa la virgola per separare gli argomenti.",
                hints: ["Usa ROUND(prezzo, 1)"],
                explanation: "Arrotondamento a 1 decimale.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato 2 Decimali",
                descTemplate: "Seleziona tutti i prezzi dalla tabella 'prodotti' arrotondati a 2 cifre decimali usando la funzione ROUND().",
                queryTemplate: "SELECT ROUND(prezzo, 2) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo 2) FROM prodotti",
                debugHint: "Manca la virgola tra gli argomenti.",
                hints: ["Usa ROUND(prezzo, 2)"],
                explanation: "Arrotondamento a 2 decimali.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Arrotondato",
                descTemplate: "Seleziona lo stock dalla tabella 'prodotti' arrotondato all'intero più vicino usando la funzione ROUND().",
                queryTemplate: "SELECT ROUND(stock, 0) FROM prodotti",
                brokenCode: "SELECT ROUND(stock, 0 FROM prodotti",
                debugHint: "Manca la parentesi di chiusura.",
                hints: ["Usa ROUND(stock, 0)"],
                explanation: "Arrotondamento stock.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Email",
                descTemplate: "Seleziona l'email e la sua lunghezza per ogni record della tabella 'utenti' usando la funzione LENGTH().",
                queryTemplate: "SELECT email, LENGTH(email) FROM utenti",
                brokenCode: "SELECT email, LENGHT(email) FROM utenti",
                debugHint: "Errore di battitura nel nome della funzione.",
                hints: ["Usa LENGTH() su email"],
                explanation: "Lunghezza colonna email.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Nomi Utenti",
                descTemplate: "Seleziona il nome e la sua lunghezza per ogni record della tabella 'utenti' usando la funzione LENGTH().",
                queryTemplate: "SELECT nome, LENGTH(nome) FROM utenti",
                brokenCode: "SELECT nome, LENGTH(nome FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su nome utente"],
                explanation: "Lunghezza nomi utenti.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Paesi",
                descTemplate: "Seleziona il paese e la sua lunghezza per ogni record della tabella 'utenti' usando la funzione LENGTH().",
                queryTemplate: "SELECT paese, LENGTH(paese) FROM utenti",
                brokenCode: "SELECT paese, LENGTH(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su paese"],
                explanation: "Lunghezza nomi paesi.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Commenti",
                descTemplate: "Seleziona il commento e la sua lunghezza per ogni record della tabella 'recensioni' usando la funzione LENGTH().",
                queryTemplate: "SELECT commento, LENGTH(commento) FROM recensioni",
                brokenCode: "SELECT commento, LENGTH(commento FROM recensioni",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su commento"],
                explanation: "Lunghezza commenti recensioni.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Codice Tracking",
                descTemplate: "Seleziona il codice_tracking e la sua lunghezza per ogni record della tabella 'spedizioni' usando la funzione LENGTH().",
                queryTemplate: "SELECT codice_tracking, LENGTH(codice_tracking) FROM spedizioni",
                brokenCode: "SELECT codice_tracking, LENGTH(codice_tracking FROM spedizioni",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su codice_tracking"],
                explanation: "Lunghezza codici tracking.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Aziende",
                descTemplate: "Seleziona l'azienda e la sua lunghezza per ogni record della tabella 'fornitori' usando la funzione LENGTH().",
                queryTemplate: "SELECT azienda, LENGTH(azienda) FROM fornitori",
                brokenCode: "SELECT azienda, LENGTH(azienda FROM fornitori",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su azienda"],
                explanation: "Lunghezza nomi aziende.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Categorie",
                descTemplate: "Seleziona il nome e la sua lunghezza per ogni record della tabella 'categorie' usando la funzione LENGTH().",
                queryTemplate: "SELECT nome, LENGTH(nome) FROM categorie",
                brokenCode: "SELECT nome, LENGTH(nome FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su nome categoria"],
                explanation: "Lunghezza nomi categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Descrizioni",
                descTemplate: "Seleziona la descrizione e la sua lunghezza per ogni record della tabella 'categorie' usando la funzione LENGTH().",
                queryTemplate: "SELECT descrizione, LENGTH(descrizione) FROM categorie",
                brokenCode: "SELECT descrizione, LENGTH(descrizione FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione.",
                hints: ["Usa LENGTH() su descrizione"],
                explanation: "Lunghezza descrizioni categorie.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo e Lunghezza Nome",
                descTemplate: "Seleziona nome, prezzo arrotondato all'intero e lunghezza del nome dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0), LENGTH(nome) FROM prodotti",
                brokenCode: "SELECT nome, ROUND(prezzo, 0), LENGTH(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina ROUND e LENGTH", "SELECT nome, ROUND(prezzo, 0), LENGTH(nome)"],
                explanation: "Funzioni multiple in una query.",
                replacements: {}
            },
            {
                titleTemplate: "Nome e Lunghezza Email",
                descTemplate: "Seleziona nome, email in maiuscolo e lunghezza dell'email dalla tabella 'utenti'.",
                queryTemplate: "SELECT nome, UPPER(email), LENGTH(email) FROM utenti",
                brokenCode: "SELECT nome, UPPER(email), LENGTH(email FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina UPPER e LENGTH", "SELECT nome, UPPER(email), LENGTH(email)"],
                explanation: "Funzioni multiple su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo e Stock Arrotondati",
                descTemplate: "Seleziona nome, prezzo arrotondato all'intero e stock arrotondato all'intero dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 0), ROUND(stock, 0) FROM prodotti",
                brokenCode: "SELECT nome, ROUND(prezzo, 0), ROUND(stock, 0 FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione ROUND.",
                hints: ["Usa ROUND due volte", "SELECT nome, ROUND(prezzo, 0), ROUND(stock, 0)"],
                explanation: "ROUND multiplo su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Tutto Maiuscolo",
                descTemplate: "Seleziona nome, email e paese dalla tabella 'utenti', tutti convertiti in maiuscolo.",
                queryTemplate: "SELECT UPPER(nome), UPPER(email), UPPER(paese) FROM utenti",
                brokenCode: "SELECT UPPER(nome), UPPER(email), UPPER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione UPPER.",
                hints: ["Usa UPPER tre volte", "SELECT UPPER(nome), UPPER(email), UPPER(paese)"],
                explanation: "UPPER multiplo.",
                replacements: {}
            },
            {
                titleTemplate: "Tutto Minuscolo",
                descTemplate: "Seleziona nome, email e paese dalla tabella 'utenti', tutti convertiti in minuscolo.",
                queryTemplate: "SELECT LOWER(nome), LOWER(email), LOWER(paese) FROM utenti",
                brokenCode: "SELECT LOWER(nome), LOWER(email), LOWER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione LOWER.",
                hints: ["Usa LOWER tre volte", "SELECT LOWER(nome), LOWER(email), LOWER(paese)"],
                explanation: "LOWER multiplo.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezze Multiple",
                descTemplate: "Seleziona nome, lunghezza del nome, lunghezza dell'email e lunghezza del paese dalla tabella 'utenti'.",
                queryTemplate: "SELECT nome, LENGTH(nome), LENGTH(email), LENGTH(paese) FROM utenti",
                brokenCode: "SELECT nome, LENGTH(nome), LENGTH(email), LENGTH(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione LENGTH.",
                hints: ["Usa LENGTH tre volte", "SELECT nome, LENGTH(nome), LENGTH(email), LENGTH(paese)"],
                explanation: "LENGTH multiplo.",
                replacements: {}
            },
            {
                titleTemplate: "Arrotondamenti Multipli",
                descTemplate: "Seleziona nome, prezzo arrotondato a 2 decimali e stock arrotondato all'intero dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 2), ROUND(stock, 0) FROM prodotti",
                brokenCode: "SELECT nome, ROUND(prezzo, 2), ROUND(stock, 0 FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nell'ultima funzione ROUND.",
                hints: ["ROUND con precisioni diverse", "SELECT nome, ROUND(prezzo, 2), ROUND(stock, 0)"],
                explanation: "ROUND con precisioni diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Funzioni Miste",
                descTemplate: "Seleziona nome in maiuscolo, prezzo arrotondato all'intero e lunghezza del nome dalla tabella 'prodotti'.",
                queryTemplate: "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome) FROM prodotti",
                brokenCode: "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina UPPER, ROUND e LENGTH", "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome)"],
                explanation: "Funzioni miste su colonne diverse.",
                replacements: {}
            },
            {
                titleTemplate: "Email e Lunghezza",
                descTemplate: "Seleziona email in minuscolo e la sua lunghezza dalla tabella 'utenti'.",
                queryTemplate: "SELECT LOWER(email), LENGTH(email) FROM utenti",
                brokenCode: "SELECT LOWER(email), LENGTH(email FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Combina LOWER e LENGTH", "SELECT LOWER(email), LENGTH(email)"],
                explanation: "LOWER combinato con LENGTH.",
                replacements: {}
            },
            {
                titleTemplate: "Nome e Prezzo Formattati",
                descTemplate: "Seleziona nome in maiuscolo e prezzo arrotondato a 1 decimale dalla tabella 'prodotti'.",
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
                descTemplate: "Seleziona l'azienda e la sua lunghezza dalla tabella 'fornitori'.",
                queryTemplate: "SELECT azienda, LENGTH(azienda) FROM fornitori",
                brokenCode: "SELECT azienda, LENGTH(azienda FROM fornitori",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Usa LENGTH()"],
                explanation: "Funzione stringa base.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Nome Corriere",
                descTemplate: "Seleziona il corriere e la sua lunghezza dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT corriere, LENGTH(corriere) FROM spedizioni",
                brokenCode: "SELECT corriere, LENGTH(corriere FROM spedizioni",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["Usa LENGTH()"],
                explanation: "Funzione stringa base.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Arrotondato (No Decimali)",
                descTemplate: "Seleziona il prezzo arrotondato a 0 decimali dalla tabella 'prodotti'.",
                queryTemplate: "SELECT ROUND(prezzo, 0) FROM prodotti",
                brokenCode: "SELECT ROUND(prezzo 0) FROM prodotti",
                debugHint: "Manca la virgola tra gli argomenti.",
                hints: ["ROUND(prezzo, 0)"],
                explanation: "Arrotondamento intero.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Arrotondato (1 Decimale)",
                descTemplate: "Seleziona lo stock arrotondato a 1 decimale dalla tabella 'prodotti'.",
                queryTemplate: "SELECT ROUND(stock, 1) FROM prodotti",
                brokenCode: "SELECT ROUND(stock, 1 FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione ROUND.",
                hints: ["ROUND(stock, 1)"],
                explanation: "Arrotondamento decimale.",
                replacements: {}
            },
            {
                titleTemplate: "Nome Categoria Maiuscolo",
                descTemplate: "Seleziona i nomi dalla tabella 'categorie' convertiti in maiuscolo.",
                queryTemplate: "SELECT UPPER(nome) FROM categorie",
                brokenCode: "SELECT UPPER(nome FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione UPPER.",
                hints: ["UPPER(nome)"],
                explanation: "Maiuscolo.",
                replacements: {}
            },
            {
                titleTemplate: "Descrizione Categoria Minuscolo",
                descTemplate: "Seleziona le descrizioni dalla tabella 'categorie' convertite in minuscolo.",
                queryTemplate: "SELECT LOWER(descrizione) FROM categorie",
                brokenCode: "SELECT LOWER(descrizione FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione LOWER.",
                hints: ["LOWER(descrizione)"],
                explanation: "Minuscolo.",
                replacements: {}
            },
            {
                titleTemplate: "Nome Prodotto Minuscolo",
                descTemplate: "Seleziona i nomi dalla tabella 'prodotti' convertiti in minuscolo.",
                queryTemplate: "SELECT LOWER(nome) FROM prodotti",
                brokenCode: "SELECT LOWER(nome FROM prodotti",
                debugHint: "Manca una parentesi di chiusura nella funzione LOWER.",
                hints: ["LOWER(nome)"],
                explanation: "Minuscolo prodotti.",
                replacements: {}
            },
            {
                titleTemplate: "Email Utente Maiuscolo",
                descTemplate: "Seleziona le email dalla tabella 'utenti' convertite in maiuscolo.",
                queryTemplate: "SELECT UPPER(email) FROM utenti",
                brokenCode: "SELECT UPPER(email FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione UPPER.",
                hints: ["UPPER(email)"],
                explanation: "Maiuscolo email.",
                replacements: {}
            },
            {
                titleTemplate: "Paese Utente Minuscolo",
                descTemplate: "Seleziona i paesi dalla tabella 'utenti' convertiti in minuscolo.",
                queryTemplate: "SELECT LOWER(paese) FROM utenti",
                brokenCode: "SELECT LOWER(paese FROM utenti",
                debugHint: "Manca una parentesi di chiusura nella funzione LOWER.",
                hints: ["LOWER(paese)"],
                explanation: "Minuscolo paese.",
                replacements: {}
            },
            {
                titleTemplate: "Lunghezza Descrizione Categoria",
                descTemplate: "Seleziona la descrizione e la sua lunghezza dalla tabella 'categorie'.",
                queryTemplate: "SELECT descrizione, LENGTH(descrizione) FROM categorie",
                brokenCode: "SELECT descrizione, LENGTH(descrizione FROM categorie",
                debugHint: "Manca una parentesi di chiusura nella funzione LENGTH.",
                hints: ["LENGTH(descrizione)"],
                explanation: "Lunghezza testo.",
                replacements: {}
            }
        ],
        [Difficulty.Medium]: [
            {
                titleTemplate: "Concatenazione Indirizzo",
                descTemplate: "Seleziona una stringa formattata come 'Nome vive in Paese' concatenando le colonne 'nome' e 'paese' della tabella 'utenti'.",
                queryTemplate: "SELECT nome || ' vive in ' || paese FROM utenti",
                hints: ["Usa || oppure CONCAT()"],
                explanation: "Unire stringhe statiche e dinamiche.",
                replacements: {},
                brokenCode: "SELECT nome + ' vive in ' + paese FROM utenti",
                debugHint: "In SQL standard (e SQLite), l'operatore di concatenazione è '||', non '+'."
            },
            {
                titleTemplate: "Prezzo Scontato (Floor)",
                descTemplate: "Seleziona il nome e il prezzo scontato del 10% (moltiplicato per 0.9) arrotondato per difetto usando FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, FLOOR(prezzo * 0.9) FROM prodotti",
                hints: ["FLOOR() arrotonda sempre verso il basso"],
                explanation: "Funzioni matematiche di arrotondamento forzato.",
                replacements: {},
                brokenCode: "SELECT nome, FLOOR(prezzo * 0.9 FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione FLOOR."
            },
            {
                titleTemplate: "Estrazione Anno",
                descTemplate: "Seleziona l'anno estratto dalla colonna 'data_ordine' usando la funzione YEAR() dalla tabella 'ordini'.",
                queryTemplate: "SELECT YEAR(data_ordine) FROM ordini",
                hints: ["Usa YEAR()"],
                explanation: "Estrazione parte temporale.",
                replacements: {},
                brokenCode: "SELECT YEAR(data_ordine FROM ordini",
                debugHint: "Manca la parentesi di chiusura della funzione YEAR."
            },
            {
                titleTemplate: "Concatenazione Nome Email",
                descTemplate: "Seleziona una stringa formattata come 'Nome (email)' concatenando le colonne 'nome' e 'email' della tabella 'utenti'.",
                queryTemplate: "SELECT nome || ' (' || email || ')' FROM utenti",
                hints: ["Usa || per concatenare", "nome || ' (' || email || ')'"],
                explanation: "Concatenazione con parentesi.",
                replacements: {},
                brokenCode: "SELECT nome || ' (' || email || ')'",
                debugHint: "Manca la clausola FROM."
            },
            {
                titleTemplate: "Concatenazione Prodotto Prezzo",
                descTemplate: "Seleziona una stringa formattata come 'Nome: Prezzo€' concatenando le colonne 'nome' e 'prezzo' della tabella 'prodotti'.",
                queryTemplate: "SELECT nome || ': ' || prezzo || '€' FROM prodotti",
                hints: ["Concatenazione con separatore", "nome || ': ' || prezzo || '€'"],
                explanation: "Concatenazione con formattazione prezzo.",
                replacements: {},
                brokenCode: "SELECT nome || ': ' || prezzo '€' FROM prodotti",
                debugHint: "Manca l'operatore di concatenazione '||' prima dell'ultimo elemento."
            },
            {
                titleTemplate: "Concatenazione Completa Utente",
                descTemplate: "Seleziona una stringa formattata come 'Nome - Email - Paese' concatenando le colonne 'nome', 'email' e 'paese' della tabella 'utenti'.",
                queryTemplate: "SELECT nome || ' - ' || email || ' - ' || paese FROM utenti",
                hints: ["Concatenazione multipla", "nome || ' - ' || email || ' - ' || paese"],
                explanation: "Concatenazione con separatori multipli.",
                replacements: {},
                brokenCode: "SELECT nome || ' - ' || email ' - ' || paese FROM utenti",
                debugHint: "Manca l'operatore di concatenazione '||'."
            },
            {
                titleTemplate: "Prezzo con CEIL",
                descTemplate: "Seleziona il nome e il prezzo arrotondato per eccesso usando la funzione CEIL() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, CEIL(prezzo) FROM prodotti",
                hints: ["Usa CEIL()", "CEIL() arrotonda sempre verso l'alto"],
                explanation: "CEIL arrotonda sempre per eccesso.",
                replacements: {},
                brokenCode: "SELECT nome, CEIL(prezzo FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione CEIL."
            },
            {
                titleTemplate: "Prezzo con FLOOR",
                descTemplate: "Seleziona il nome e il prezzo arrotondato per difetto usando la funzione FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, FLOOR(prezzo) FROM prodotti",
                hints: ["Usa FLOOR()", "FLOOR() arrotonda sempre verso il basso"],
                explanation: "FLOOR arrotonda sempre per difetto.",
                replacements: {},
                brokenCode: "SELECT nome, FLOOR(prezzo FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione FLOOR."
            },
            {
                titleTemplate: "Sconto 15% Floor",
                descTemplate: "Seleziona il nome e il prezzo scontato del 15% (moltiplicato per 0.85) arrotondato per difetto usando FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, FLOOR(prezzo * 0.85) FROM prodotti",
                hints: ["Calcola prezzo * 0.85", "Usa FLOOR()"],
                explanation: "Sconto con FLOOR.",
                replacements: {},
                brokenCode: "SELECT nome, FLOOR(prezzo * 0.85) FROM",
                debugHint: "Manca il nome della tabella dopo FROM."
            },
            {
                titleTemplate: "Sconto 20% Ceil",
                descTemplate: "Seleziona il nome e il prezzo scontato del 20% (moltiplicato per 0.8) arrotondato per eccesso usando CEIL() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, CEIL(prezzo * 0.8) FROM prodotti",
                hints: ["Calcola prezzo * 0.8", "Usa CEIL()"],
                explanation: "Sconto con CEIL.",
                replacements: {},
                brokenCode: "SELECT nome, CEIL(prezzo * 0.8)",
                debugHint: "Manca la clausola FROM."
            },
            {
                titleTemplate: "Stock con Floor",
                descTemplate: "Seleziona il nome e lo stock arrotondato per difetto usando FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, FLOOR(stock) FROM prodotti",
                hints: ["Usa FLOOR() su stock"],
                explanation: "FLOOR su stock.",
                replacements: {},
                brokenCode: "SELECT nome, FLOOR(stock FROM prodotti",
                debugHint: "Manca la parentesi di chiusura."
            },
            {
                titleTemplate: "Prezzo con Ceil",
                descTemplate: "Seleziona il nome e il prezzo arrotondato per eccesso usando CEIL() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, CEIL(prezzo) FROM prodotti",
                hints: ["Usa CEIL() su prezzo"],
                explanation: "CEIL su prezzo.",
                replacements: {},
                brokenCode: "SELECT nome, CEIL(prezzo FROM prodotti",
                debugHint: "Manca la parentesi di chiusura."
            },
            {
                titleTemplate: "Anno Ordini",
                descTemplate: "Seleziona l'anno estratto dalla colonna 'data_ordine' usando la funzione YEAR() dalla tabella 'ordini'.",
                queryTemplate: "SELECT YEAR(data_ordine) FROM ordini",
                hints: ["Usa YEAR() su data_ordine"],
                explanation: "YEAR() per estrarre anno.",
                replacements: {},
                brokenCode: "SELECT YEAR(data_ordine FROM ordini",
                debugHint: "Manca la parentesi di chiusura della funzione YEAR."
            },
            {
                titleTemplate: "Anno Spedizioni",
                descTemplate: "Seleziona l'anno estratto dalla colonna 'data_spedizione' usando la funzione YEAR() dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT YEAR(data_spedizione) FROM spedizioni",
                hints: ["Usa YEAR() su data_spedizione"],
                explanation: "YEAR() su date spedizioni.",
                replacements: {},
                brokenCode: "SELECT YEAR(data_spedizione FROM spedizioni",
                debugHint: "Manca la parentesi di chiusura della funzione YEAR."
            },
            {
                titleTemplate: "Mese Ordini",
                descTemplate: "Seleziona il mese estratto dalla colonna 'data_ordine' usando la funzione MONTH() dalla tabella 'ordini'.",
                queryTemplate: "SELECT MONTH(data_ordine) FROM ordini",
                hints: ["Usa MONTH()", "MONTH() restituisce 1-12"],
                explanation: "MONTH() per estrarre mese.",
                replacements: {},
                brokenCode: "SELECT MONTH(data_ordine FROM ordini",
                debugHint: "Manca la parentesi di chiusura della funzione MONTH."
            },
            {
                titleTemplate: "Mese Spedizioni",
                descTemplate: "Seleziona il mese estratto dalla colonna 'data_spedizione' usando la funzione MONTH() dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT MONTH(data_spedizione) FROM spedizioni",
                hints: ["Usa MONTH() su data_spedizione"],
                explanation: "MONTH() su date spedizioni.",
                replacements: {},
                brokenCode: "SELECT MONTH(data_spedizione FROM spedizioni",
                debugHint: "Manca la parentesi di chiusura della funzione MONTH."
            },
            {
                titleTemplate: "Concatenazione Categoria",
                descTemplate: "Seleziona una stringa formattata come 'Nome: Descrizione' concatenando le colonne 'nome' e 'descrizione' della tabella 'categorie'.",
                queryTemplate: "SELECT nome || ': ' || descrizione FROM categorie",
                hints: ["Concatenazione categoria", "nome || ': ' || descrizione"],
                explanation: "Concatenazione categorie.",
                replacements: {},
                brokenCode: "SELECT nome || ': ' || descrizione",
                debugHint: "Manca la clausola FROM."
            },
            {
                titleTemplate: "Concatenazione Fornitore",
                descTemplate: "Seleziona una stringa formattata come 'Azienda - Nazione' concatenando le colonne 'azienda' e 'nazione' della tabella 'fornitori'.",
                queryTemplate: "SELECT azienda || ' - ' || nazione FROM fornitori",
                hints: ["Concatenazione fornitore", "azienda || ' - ' || nazione"],
                explanation: "Concatenazione fornitori.",
                replacements: {},
                brokenCode: "SELECT azienda || ' - ' || nazione",
                debugHint: "Manca la clausola FROM."
            },
            {
                titleTemplate: "Concatenazione Spedizione",
                descTemplate: "Seleziona una stringa formattata come 'Corriere: Codice' concatenando le colonne 'corriere' e 'codice_tracking' della tabella 'spedizioni'.",
                queryTemplate: "SELECT corriere || ': ' || codice_tracking FROM spedizioni",
                hints: ["Concatenazione spedizione", "corriere || ': ' || codice_tracking"],
                explanation: "Concatenazione spedizioni.",
                replacements: {},
                brokenCode: "SELECT corriere || ': ' || codice_tracking",
                debugHint: "Manca la clausola FROM."
            },
            {
                titleTemplate: "Prezzo e Sconto Floor",
                descTemplate: "Seleziona nome, prezzo e prezzo scontato del 10% (moltiplicato per 0.9) arrotondato per difetto usando FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, prezzo, FLOOR(prezzo * 0.9) FROM prodotti",
                hints: ["Mostra prezzo e sconto", "SELECT nome, prezzo, FLOOR(prezzo * 0.9)"],
                explanation: "Prezzo originale e scontato.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo, FLOOR(prezzo * 0.9 FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione FLOOR."
            },
            {
                titleTemplate: "Prezzo e Sconto Ceil",
                descTemplate: "Seleziona nome, prezzo e prezzo scontato del 15% (moltiplicato per 0.85) arrotondato per eccesso usando CEIL() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, prezzo, CEIL(prezzo * 0.85) FROM prodotti",
                hints: ["Mostra prezzo e sconto", "SELECT nome, prezzo, CEIL(prezzo * 0.85)"],
                explanation: "Prezzo originale e scontato con CEIL.",
                replacements: {},
                brokenCode: "SELECT nome, prezzo, CEIL(prezzo * 0.85 FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione CEIL."
            },
            {
                titleTemplate: "Anno e Mese Ordini",
                descTemplate: "Seleziona l'anno e il mese estratti dalla colonna 'data_ordine' usando YEAR() e MONTH() dalla tabella 'ordini'.",
                queryTemplate: "SELECT YEAR(data_ordine), MONTH(data_ordine) FROM ordini",
                hints: ["Usa YEAR() e MONTH()", "SELECT YEAR(data_ordine), MONTH(data_ordine)"],
                explanation: "YEAR e MONTH insieme.",
                replacements: {},
                brokenCode: "SELECT YEAR(data_ordine), MONTH(data_ordine FROM ordini",
                debugHint: "Manca la parentesi di chiusura della funzione MONTH."
            },
            {
                titleTemplate: "Anno e Mese Spedizioni",
                descTemplate: "Seleziona l'anno e il mese estratti dalla colonna 'data_spedizione' usando YEAR() e MONTH() dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT YEAR(data_spedizione), MONTH(data_spedizione) FROM spedizioni",
                hints: ["Usa YEAR() e MONTH()", "SELECT YEAR(data_spedizione), MONTH(data_spedizione)"],
                explanation: "YEAR e MONTH su spedizioni.",
                replacements: {},
                brokenCode: "SELECT YEAR(data_spedizione), MONTH(data_spedizione FROM spedizioni",
                debugHint: "Manca la parentesi di chiusura della funzione MONTH."
            },
            {
                titleTemplate: "Concatenazione con Anno",
                descTemplate: "Seleziona una stringa formattata come 'Ordine del Anno' concatenando il testo 'Ordine del ' con l'anno estratto da 'data_ordine' dalla tabella 'ordini'.",
                queryTemplate: "SELECT 'Ordine del ' || YEAR(data_ordine) FROM ordini",
                hints: ["Concatenazione con YEAR()", "'Ordine del ' || YEAR(data_ordine)"],
                explanation: "Concatenazione con funzione data.",
                replacements: {},
                brokenCode: "SELECT 'Ordine del ' || YEAR(data_ordine FROM ordini",
                debugHint: "Manca la parentesi di chiusura della funzione YEAR."
            },
            {
                titleTemplate: "Prezzo Arrotondato e Floor",
                descTemplate: "Seleziona nome, prezzo arrotondato a 1 decimale e prezzo con FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo) FROM prodotti",
                hints: ["Combina ROUND e FLOOR", "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo)"],
                explanation: "ROUND e FLOOR insieme.",
                replacements: {},
                brokenCode: "SELECT nome, ROUND(prezzo, 1), FLOOR(prezzo FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione FLOOR."
            },
            {
                titleTemplate: "Prezzo Arrotondato e Ceil",
                descTemplate: "Seleziona nome, prezzo arrotondato a 2 decimali e prezzo con CEIL() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo) FROM prodotti",
                hints: ["Combina ROUND e CEIL", "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo)"],
                explanation: "ROUND e CEIL insieme.",
                replacements: {},
                brokenCode: "SELECT nome, ROUND(prezzo, 2), CEIL(prezzo FROM prodotti",
                debugHint: "Manca la parentesi di chiusura della funzione CEIL."
            },
            {
                titleTemplate: "Concatenazione Completa Prodotto",
                descTemplate: "Seleziona una stringa formattata come 'Nome (Prezzo€, Stock unità)' concatenando le colonne 'nome', 'prezzo' e 'stock' della tabella 'prodotti'.",
                queryTemplate: "SELECT nome || ' (' || prezzo || '€, ' || stock || ' unità)' FROM prodotti",
                hints: ["Concatenazione complessa", "nome || ' (' || prezzo || '€, ' || stock || ' unità)'"],
                explanation: "Concatenazione complessa con numeri.",
                replacements: {}
            },
            {
                titleTemplate: "Funzioni Multiple",
                descTemplate: "Seleziona nome in maiuscolo, prezzo arrotondato all'intero e lunghezza del nome dalla tabella 'prodotti'.",
                queryTemplate: "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome) FROM prodotti",
                hints: ["Combina UPPER, ROUND e LENGTH", "SELECT UPPER(nome), ROUND(prezzo, 0), LENGTH(nome)"],
                explanation: "Funzioni multiple insieme.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione con Formattazione",
                descTemplate: "Seleziona una stringa formattata come 'Utente: Nome (Email)' concatenando le colonne 'nome' e 'email' della tabella 'utenti'.",
                queryTemplate: "SELECT 'Utente: ' || nome || ' (' || email || ')' FROM utenti",
                hints: ["Concatenazione con prefisso", "'Utente: ' || nome || ' (' || email || ')'"],
                explanation: "Concatenazione con prefisso e formattazione.",
                replacements: {}
            },
            // NEW EXERCISES FOR FUNCTIONS MEDIUM
            {
                titleTemplate: "Concatenazione Prodotto Categoria",
                descTemplate: "Seleziona una stringa formattata come 'Nome (Cat ID: X)' concatenando le colonne 'nome' e 'categoria_id' dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome || ' (Cat ID: ' || categoria_id || ')' FROM prodotti",
                hints: ["Concatenazione mista stringa/numero"],
                explanation: "Formatta output.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Fornitore Nazione",
                descTemplate: "Seleziona una stringa formattata come 'Azienda [Nazione]' concatenando le colonne 'azienda' e 'nazione' dalla tabella 'fornitori'.",
                queryTemplate: "SELECT azienda || ' [' || nazione || ']' FROM fornitori",
                hints: ["Concatenazione con parentesi quadre"],
                explanation: "Formatta output fornitore.",
                replacements: {}
            },
            {
                titleTemplate: "Anno da Data Spedizione",
                descTemplate: "Seleziona l'anno estratto dalla colonna 'data_spedizione' usando la funzione YEAR() dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT YEAR(data_spedizione) FROM spedizioni",
                hints: ["YEAR()"],
                explanation: "Estrai anno.",
                replacements: {}
            },
            {
                titleTemplate: "Mese da Data Spedizione",
                descTemplate: "Seleziona il mese estratto dalla colonna 'data_spedizione' usando la funzione MONTH() dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT MONTH(data_spedizione) FROM spedizioni",
                hints: ["MONTH()"],
                explanation: "Estrai mese.",
                replacements: {}
            },
            {
                titleTemplate: "Giorno da Data Ordine",
                descTemplate: "Seleziona il giorno estratto dalla colonna 'data_ordine' usando la funzione DAY() dalla tabella 'ordini'.",
                queryTemplate: "SELECT DAY(data_ordine) FROM ordini",
                hints: ["DAY()"],
                explanation: "Estrai giorno.",
                replacements: {}
            },
            {
                titleTemplate: "Giorno da Data Spedizione",
                descTemplate: "Seleziona il giorno estratto dalla colonna 'data_spedizione' usando la funzione DAY() dalla tabella 'spedizioni'.",
                queryTemplate: "SELECT DAY(data_spedizione) FROM spedizioni",
                hints: ["DAY()"],
                explanation: "Estrai giorno spedizione.",
                replacements: {}
            },
            {
                titleTemplate: "Prezzo Scontato 50% Floor",
                descTemplate: "Seleziona il prezzo dimezzato (moltiplicato per 0.5) e arrotondato per difetto usando FLOOR() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT FLOOR(prezzo * 0.5) FROM prodotti",
                hints: ["FLOOR(prezzo * 0.5)"],
                explanation: "Sconto aggressivo.",
                replacements: {}
            },
            {
                titleTemplate: "Stock Aumentato 10% Ceil",
                descTemplate: "Seleziona lo stock aumentato del 10% (moltiplicato per 1.1) e arrotondato per eccesso usando CEIL() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT CEIL(stock * 1.1) FROM prodotti",
                hints: ["CEIL(stock * 1.1)"],
                explanation: "Proiezione stock.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Indirizzo Completo",
                descTemplate: "Seleziona una stringa formattata come 'Paese: Nazione' concatenando il testo 'Paese: ' con la colonna 'paese' dalla tabella 'utenti'.",
                queryTemplate: "SELECT 'Paese: ' || paese FROM utenti",
                hints: ["Concatenazione semplice"],
                explanation: "Labeling dati.",
                replacements: {}
            },
            {
                titleTemplate: "Concatenazione Voto Recensione",
                descTemplate: "Seleziona una stringa formattata come 'Voto: X/5' concatenando la colonna 'voto' con il testo '/5' dalla tabella 'recensioni'.",
                queryTemplate: "SELECT 'Voto: ' || voto || '/5' FROM recensioni",
                hints: ["Concatenazione con suffisso"],
                explanation: "Formatta voto.",
                replacements: {}
            }
        ],
        [Difficulty.Hard]: [
            {
                titleTemplate: "Iniziali Utente (Substring)",
                descTemplate: "Seleziona la prima lettera del nome (iniziale) usando la funzione SUBSTRING() dalla tabella 'utenti'.",
                queryTemplate: "SELECT SUBSTRING(nome, 1, 1) FROM utenti",
                hints: ["SUBSTRING(str, start, len)"],
                explanation: "Manipolazione fine delle stringhe.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Margine Complesso",
                descTemplate: "Seleziona il nome e il margine calcolato come (prezzo - 10) arrotondato a 2 decimali usando ROUND() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo - 10, 2) FROM prodotti",
                hints: ["Combina operazione e ROUND"],
                explanation: "Le funzioni possono prendere espressioni come argomenti.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce (Gestione Null)",
                descTemplate: "Seleziona il codice_tracking dalla tabella 'spedizioni'. Se il valore è NULL, mostra la stringa 'In Attesa' usando la funzione COALESCE().",
                queryTemplate: "SELECT COALESCE(codice_tracking, 'In Attesa') FROM spedizioni",
                hints: ["Usa COALESCE(valore, fallback)"],
                explanation: "COALESCE restituisce il primo valore non nullo della lista.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Nome Prodotto",
                descTemplate: "Seleziona i primi 4 caratteri del nome usando la funzione SUBSTRING() dalla tabella 'prodotti'.",
                queryTemplate: "SELECT SUBSTRING(nome, 1, 4) FROM prodotti",
                hints: ["SUBSTRING(nome, 1, 4)", "Inizia da 1, prendi 4 caratteri"],
                explanation: "SUBSTRING per estrarre parte di stringa.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Email",
                descTemplate: "Seleziona i primi 5 caratteri dell'email usando la funzione SUBSTRING() dalla tabella 'utenti'.",
                queryTemplate: "SELECT SUBSTRING(email, 1, 5) FROM utenti",
                hints: ["SUBSTRING(email, 1, 5)"],
                explanation: "SUBSTRING su email.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Paese",
                descTemplate: "Seleziona i primi 3 caratteri del paese usando la funzione SUBSTRING() dalla tabella 'utenti'.",
                queryTemplate: "SELECT SUBSTRING(paese, 1, 3) FROM utenti",
                hints: ["SUBSTRING(paese, 1, 3)"],
                explanation: "SUBSTRING su paese.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Azienda",
                descTemplate: "Seleziona i primi 6 caratteri del nome azienda usando la funzione SUBSTRING() dalla tabella 'fornitori'.",
                queryTemplate: "SELECT SUBSTRING(azienda, 1, 6) FROM fornitori",
                hints: ["SUBSTRING(azienda, 1, 6)"],
                explanation: "SUBSTRING su azienda.",
                replacements: {}
            },
            {
                titleTemplate: "Substring Commento",
                descTemplate: "Seleziona i primi 20 caratteri del commento usando la funzione SUBSTRING() dalla tabella 'recensioni'.",
                queryTemplate: "SELECT SUBSTRING(commento, 1, 20) FROM recensioni",
                hints: ["SUBSTRING(commento, 1, 20)"],
                explanation: "SUBSTRING per anteprima commenti.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Complesso Prezzo",
                descTemplate: "Seleziona il nome e il risultato del calcolo ((prezzo * 1.1) - 5) arrotondato a 2 decimali dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND((prezzo * 1.1) - 5, 2) FROM prodotti",
                hints: ["Usa parentesi per ordine", "ROUND((prezzo * 1.1) - 5, 2)"],
                explanation: "Calcolo complesso con ROUND.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Complesso Stock",
                descTemplate: "Seleziona il nome e il risultato del calcolo ((stock + 10) * 2) arrotondato all'intero (0 decimali) dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND((stock + 10) * 2, 0) FROM prodotti",
                hints: ["Usa parentesi", "ROUND((stock + 10) * 2, 0)"],
                explanation: "Calcolo complesso su stock.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Valore con Round",
                descTemplate: "Seleziona il nome e il valore dell'inventario (prezzo * stock) arrotondato a 0 decimali dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo * stock, 0) FROM prodotti",
                hints: ["Calcola prezzo * stock", "ROUND(prezzo * stock, 0)"],
                explanation: "ROUND su calcolo valore.",
                replacements: {}
            },
            {
                titleTemplate: "Calcolo Sconto Complesso",
                descTemplate: "Seleziona il nome e il prezzo scontato del 20% (moltiplicato per 0.8) arrotondato a 1 decimale dalla tabella 'prodotti'.",
                queryTemplate: "SELECT nome, ROUND(prezzo * 0.8, 1) FROM prodotti",
                hints: ["Calcola prezzo * 0.8", "ROUND(prezzo * 0.8, 1)"],
                explanation: "Sconto con ROUND a 1 decimale.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Email",
                descTemplate: "Seleziona l'email dalla tabella 'utenti'. Se è NULL, mostra 'Email non disponibile' usando COALESCE().",
                queryTemplate: "SELECT COALESCE(email, 'Email non disponibile') FROM utenti",
                hints: ["COALESCE(email, 'Email non disponibile')"],
                explanation: "COALESCE per gestire NULL su email.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Commento",
                descTemplate: "Seleziona il commento dalla tabella 'recensioni'. Se è NULL, mostra 'Nessun commento' usando COALESCE().",
                queryTemplate: "SELECT COALESCE(commento, 'Nessun commento') FROM recensioni",
                hints: ["COALESCE(commento, 'Nessun commento')"],
                explanation: "COALESCE per gestire NULL su commenti.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Codice Tracking",
                descTemplate: "Seleziona il codice_tracking dalla tabella 'spedizioni'. Se è NULL, mostra 'Non disponibile' usando COALESCE().",
                queryTemplate: "SELECT COALESCE(codice_tracking, 'Non disponibile') FROM spedizioni",
                hints: ["COALESCE(codice_tracking, 'Non disponibile')"],
                explanation: "COALESCE per gestire NULL su tracking.",
                replacements: {}
            },
            {
                titleTemplate: "Coalesce Multiplo",
                descTemplate: "Seleziona il codice_tracking. Se è NULL usa corriere. Se anche corriere è NULL usa 'Sconosciuto'. Usa COALESCE() sulla tabella 'spedizioni'.",
                queryTemplate: "SELECT COALESCE(codice_tracking, corriere, 'Sconosciuto') FROM spedizioni",
                hints: ["COALESCE con tre valori", "COALESCE(codice_tracking, corriere, 'Sconosciuto')"],
                explanation: "COALESCE multiplo per fallback a catena.",
                replacements: {}
            },
            {
                titleTemplate: "Substring e Concatenazione",
                descTemplate: "Seleziona i primi 3 caratteri del nome concatenati con '...' dalla tabella 'utenti'.",
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
            { titleTemplate: "Data Ordine e DATEDIFF", descTemplate: "Mostra data ordine e giorni di consegna per ogni spedizione.", queryTemplate: "SELECT ordini.data_ordine, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Data e DATEDIFF", "SELECT ordini.data_ordine, DATEDIFF(day, ...)"], explanation: "Data completa con DATEDIFF.", replacements: {}, brokenCode: "SELECT ordini.data_ordine, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della funzione DATEDIFF." },
            { titleTemplate: "Data Spedizione e DATEDIFF", descTemplate: "Mostra data spedizione e giorni di consegna per ogni spedizione.", queryTemplate: "SELECT spedizioni.data_spedizione, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Data spedizione e DATEDIFF", "SELECT spedizioni.data_spedizione, DATEDIFF(day, ...)"], explanation: "Data spedizione con DATEDIFF.", replacements: {}, brokenCode: "SELECT spedizioni.data_spedizione, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della funzione DATEDIFF." },
            { titleTemplate: "DATEDIFF e Filtro Anno", descTemplate: "Calcola giorni consegna solo per ordini del 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023", hints: ["DATEDIFF con WHERE YEAR", "WHERE YEAR(ordini.data_ordine) = 2023"], explanation: "DATEDIFF con filtro anno.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine = 2023", debugHint: "Manca la parentesi di chiusura della funzione YEAR." },
            { titleTemplate: "DATEDIFF e Filtro Mese", descTemplate: "Calcola giorni consegna solo per ordini di Gennaio.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE MONTH(ordini.data_ordine) = 1", hints: ["DATEDIFF con WHERE MONTH", "WHERE MONTH(ordini.data_ordine) = 1"], explanation: "DATEDIFF con filtro mese.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE MONTH(ordini.data_ordine = 1", debugHint: "Manca la parentesi di chiusura della funzione MONTH." },
            { titleTemplate: "DATEDIFF e Filtro Data", descTemplate: "Calcola giorni consegna solo per ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE ordini.data_ordine > '2023-01-01'", hints: ["DATEDIFF con WHERE data", "WHERE ordini.data_ordine > '2023-01-01'"], explanation: "DATEDIFF con filtro data.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE ordini.data_ordine > 2023-01-01", debugHint: "Le date letterali devono essere racchiuse tra apici singoli." },
            { titleTemplate: "DATEDIFF con Alias e Filtro", descTemplate: "Calcola giorni consegna come 'Ritardo' solo per consegne > 3 giorni.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Ritardo FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) > 3", hints: ["DATEDIFF con alias e WHERE DATEDIFF", "WHERE DATEDIFF(...) > 3"], explanation: "DATEDIFF con alias e filtro su stesso calcolo.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Ritardo FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE Ritardo > 3", debugHint: "Non puoi usare un alias di colonna nella clausola WHERE. Devi ripetere l'espressione o usare una subquery." },
            { titleTemplate: "Anno Ordine e Anno Spedizione", descTemplate: "Mostra anno ordine e anno spedizione per ogni spedizione.", queryTemplate: "SELECT YEAR(ordini.data_ordine), YEAR(spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["YEAR su entrambe le date", "SELECT YEAR(ordini.data_ordine), YEAR(spedizioni.data_spedizione)"], explanation: "YEAR su date multiple con JOIN.", replacements: {}, brokenCode: "SELECT YEAR(ordini.data_ordine), YEAR(spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della seconda funzione YEAR." },
            { titleTemplate: "Mese Ordine e Mese Spedizione", descTemplate: "Mostra mese ordine e mese spedizione per ogni spedizione.", queryTemplate: "SELECT MONTH(ordini.data_ordine), MONTH(spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["MONTH su entrambe le date", "SELECT MONTH(ordini.data_ordine), MONTH(spedizioni.data_spedizione)"], explanation: "MONTH su date multiple con JOIN.", replacements: {}, brokenCode: "SELECT MONTH(ordini.data_ordine), MONTH(spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della seconda funzione MONTH." },
            { titleTemplate: "Date Complete e DATEDIFF", descTemplate: "Mostra data ordine, data spedizione e giorni di consegna.", queryTemplate: "SELECT ordini.data_ordine, spedizioni.data_spedizione, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Tre colonne con DATEDIFF", "SELECT ordini.data_ordine, spedizioni.data_spedizione, DATEDIFF(day, ...)"], explanation: "Date complete con DATEDIFF.", replacements: {}, brokenCode: "SELECT ordini.data_ordine, spedizioni.data_spedizione, DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della funzione DATEDIFF." },
            { titleTemplate: "Anno, Mese e DATEDIFF", descTemplate: "Mostra anno ordine, mese ordine e giorni di consegna.", queryTemplate: "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["YEAR, MONTH e DATEDIFF", "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), DATEDIFF(day, ...)"], explanation: "Funzioni data multiple con DATEDIFF.", replacements: {}, brokenCode: "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della funzione DATEDIFF." },
            { titleTemplate: "DATEDIFF con ORDER BY", descTemplate: "Calcola giorni consegna e ordina dal più lungo al più corto.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) DESC", hints: ["ORDER BY DATEDIFF(...) DESC"], explanation: "DATEDIFF con ORDER BY.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione DES", debugHint: "Errore di sintassi nella parola chiave DESC." },
            { titleTemplate: "DATEDIFF con LIMIT", descTemplate: "Trova le 5 spedizioni con il tempo di consegna più lungo.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) DESC LIMIT 5", hints: ["ORDER BY DATEDIFF DESC LIMIT 5"], explanation: "DATEDIFF con ORDER BY e LIMIT.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) DESC LIMIT", debugHint: "Manca il valore numerico per la clausola LIMIT." },
            { titleTemplate: "DATEDIFF e Filtro Combinato", descTemplate: "Calcola giorni consegna per ordini del 2023 con consegna > 2 giorni.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023 AND DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) > 2", hints: ["WHERE YEAR(...) = 2023 AND DATEDIFF(...) > 2"], explanation: "DATEDIFF con filtri combinati.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023 AND DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione > 2", debugHint: "Manca la parentesi di chiusura della funzione DATEDIFF nella clausola WHERE." },
            { titleTemplate: "DATEDIFF e Range Date", descTemplate: "Calcola giorni consegna per ordini tra il 1 Gennaio e 30 Giugno 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE ordini.data_ordine BETWEEN '2023-01-01' AND '2023-06-30'", hints: ["DATEDIFF con WHERE BETWEEN", "WHERE ordini.data_ordine BETWEEN '2023-01-01' AND '2023-06-30'"], explanation: "DATEDIFF con range date.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE ordini.data_ordine BETWEEN '2023-01-01' '2023-06-30'", debugHint: "Manca la parola chiave AND tra i due valori del BETWEEN." },
            { titleTemplate: "DATEDIFF con Alias Completo", descTemplate: "Calcola giorni consegna come 'Giorni' e ordina per questo valore.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY Giorni DESC", hints: ["Usa alias nell'ORDER BY", "ORDER BY Giorni DESC"], explanation: "DATEDIFF con alias usato in ORDER BY.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id ORDER BY Giorni", debugHint: "Manca la direzione dell'ordinamento (DESC) richiesta dalla traccia." },
            { titleTemplate: "Funzioni Data Multiple", descTemplate: "Mostra anno ordine, mese ordine, anno spedizione, mese spedizione e giorni consegna.", queryTemplate: "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), YEAR(spedizioni.data_spedizione), MONTH(spedizioni.data_spedizione), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["Cinque funzioni data", "SELECT YEAR(...), MONTH(...), YEAR(...), MONTH(...), DATEDIFF(...)"], explanation: "Funzioni data multiple con DATEDIFF.", replacements: {}, brokenCode: "SELECT YEAR(ordini.data_ordine), MONTH(ordini.data_ordine), YEAR(spedizioni.data_spedizione), MONTH(spedizioni.data_spedizione), DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la parentesi di chiusura della funzione DATEDIFF." },
            { titleTemplate: "DATEDIFF e Filtro Mese Ordine", descTemplate: "Calcola giorni consegna solo per ordini di Gennaio o Febbraio.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE MONTH(ordini.data_ordine) IN (1, 2)", hints: ["WHERE MONTH(...) IN (1, 2)"], explanation: "DATEDIFF con filtro mese multiplo.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE MONTH(ordini.data_ordine) IN (1, 2", debugHint: "Manca la parentesi di chiusura della lista IN." },
            { titleTemplate: "DATEDIFF e Filtro Anno Spedizione", descTemplate: "Calcola giorni consegna solo per spedizioni del 2023.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(spedizioni.data_spedizione) = 2023", hints: ["WHERE YEAR(spedizioni.data_spedizione) = 2023"], explanation: "DATEDIFF con filtro anno spedizione.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(spedizioni.data_spedizione = 2023", debugHint: "Manca la parentesi di chiusura della funzione YEAR." },
            { titleTemplate: "DATEDIFF Complesso Finale", descTemplate: "Calcola giorni consegna (alias 'Giorni') per ordini del 2023 con consegna tra 2 e 5 giorni, ordinati per giorni decrescente.", queryTemplate: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023 AND DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) BETWEEN 2 AND 5 ORDER BY Giorni DESC", hints: ["WHERE YEAR(...) = 2023 AND DATEDIFF(...) BETWEEN 2 AND 5 ORDER BY Giorni DESC"], explanation: "DATEDIFF complesso con filtri multipli e ordinamento.", replacements: {}, brokenCode: "SELECT DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) AS Giorni FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE YEAR(ordini.data_ordine) = 2023 AND DATEDIFF(day, ordini.data_ordine, spedizioni.data_spedizione) BETWEEN 2 AND 5 ORDER BY Giorni", debugHint: "Manca la direzione dell'ordinamento (DESC) richiesta dalla traccia." },
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
            { titleTemplate: "Prodotti e Categorie", descTemplate: "Seleziona la colonna 'nome' dalla tabella 'prodotti' e la colonna 'nome' dalla tabella 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie prodotti.categoria_id = categorie.id", debugHint: "Manca la parola chiave ON per specificare la condizione di join.", hints: ["Usa JOIN ... ON ...", "Specifica tabella.colonna"], explanation: "Inner Join base per decodificare ID.", replacements: {} },
            { titleTemplate: "Ordini e Utenti", descTemplate: "Seleziona la colonna 'id' dalla tabella 'ordini' e la colonna 'nome' dalla tabella 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, utenti.nome FROM ordini JION utenti ON ordini.utente_id = utenti.id", debugHint: "Errore di battitura nella parola chiave JOIN.", hints: ["Collega ordini.utente_id con utenti.id"], explanation: "Relazione uno-a-molti.", replacements: {} },
            { titleTemplate: "Spedizioni e Corrieri", descTemplate: "Seleziona la colonna 'corriere' dalla tabella 'spedizioni' e la colonna 'data_ordine' dalla tabella 'ordini', unendo le tabelle tramite 'ordine_id'.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id == ordini.id", debugHint: "In SQL si usa un solo uguale (=) per i confronti.", hints: ["JOIN spedizioni ON ordini"], explanation: "Navigare relazioni.", replacements: {} },
            { titleTemplate: "Prodotti e Fornitori", descTemplate: "Seleziona la colonna 'nome' dalla tabella 'prodotti' e la colonna 'azienda' dalla tabella 'fornitori', unendo le tabelle tramite 'fornitore_id'.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["JOIN prodotti con fornitori", "prodotti.fornitore_id = fornitori.id"], explanation: "JOIN per collegare prodotti e fornitori.", replacements: {} },
            { titleTemplate: "Ordini e Prodotti", descTemplate: "Seleziona la colonna 'id' dalla tabella 'ordini' e la colonna 'nome' dalla tabella 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT ordini.id, prodotti.nome FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT ordini.id, prodotti.nome FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN ordini con prodotti", "ordini.prodotto_id = prodotti.id"], explanation: "JOIN per collegare ordini e prodotti.", replacements: {} },
            { titleTemplate: "Recensioni e Prodotti", descTemplate: "Seleziona la colonna 'voto' dalla tabella 'recensioni' e la colonna 'nome' dalla tabella 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN recensioni con prodotti", "recensioni.prodotto_id = prodotti.id"], explanation: "JOIN per collegare recensioni e prodotti.", replacements: {} },
            { titleTemplate: "Recensioni e Utenti", descTemplate: "Seleziona la colonna 'voto' dalla tabella 'recensioni' e la colonna 'nome' dalla tabella 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT recensioni.voto, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.voto, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id utenti.id", debugHint: "Manca l'operatore di uguaglianza (=) nella condizione ON.", hints: ["JOIN recensioni con utenti", "recensioni.utente_id = utenti.id"], explanation: "JOIN per collegare recensioni e utenti.", replacements: {} },
            { titleTemplate: "Spedizioni e Ordini", descTemplate: "Seleziona la colonna 'corriere' dalla tabella 'spedizioni' e la colonna 'data_ordine' dalla tabella 'ordini', unendo le tabelle tramite 'ordine_id'.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, ordini.data_ordine FROM spedizioni JOIN ordini spedizioni.ordine_id = ordini.id", debugHint: "Manca la parola chiave ON.", hints: ["JOIN spedizioni con ordini", "spedizioni.ordine_id = ordini.id"], explanation: "JOIN per collegare spedizioni e ordini.", replacements: {} },
            { titleTemplate: "Prodotti Categoria Completa", descTemplate: "Seleziona le colonne 'nome' da 'prodotti', 'nome' e 'descrizione' da 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT prodotti.nome, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT prodotti.nome, categorie.nome, categorie.descrizione"], explanation: "JOIN con più colonne dalla tabella joinata.", replacements: {} },
            { titleTemplate: "Ordini Utente Completo", descTemplate: "Seleziona le colonne 'id' da 'ordini', 'nome' e 'email' da 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT ordini.id, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT ordini.id, utenti.nome, utenti.email"], explanation: "JOIN con più colonne utente.", replacements: {} },
            { titleTemplate: "Prodotti Fornitore Completo", descTemplate: "Seleziona le colonne 'nome' da 'prodotti', 'azienda' e 'nazione' da 'fornitori', unendo le tabelle tramite 'fornitore_id'.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT prodotti.nome, fornitori.azienda, fornitori.nazione"], explanation: "JOIN con più colonne fornitore.", replacements: {} },
            { titleTemplate: "Ordini Prodotto Completo", descTemplate: "Seleziona le colonne 'id' da 'ordini', 'nome' e 'prezzo' da 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT ordini.id, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT ordini.id, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT ordini.id, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con più colonne prodotto.", replacements: {} },
            { titleTemplate: "Spedizioni Ordine Completo", descTemplate: "Seleziona le colonne 'corriere' da 'spedizioni', 'data_ordine' e 'quantita' da 'ordini', unendo le tabelle tramite 'ordine_id'.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT spedizioni.corriere, ordini.data_ordine, ordini.quantita"], explanation: "JOIN con più colonne ordine.", replacements: {} },
            { titleTemplate: "Recensioni Prodotto Completo", descTemplate: "Seleziona le colonne 'voto' da 'recensioni', 'nome' e 'prezzo' da 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT recensioni.voto, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT recensioni.voto, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con più colonne prodotto.", replacements: {} },
            { titleTemplate: "Recensioni Utente Completo", descTemplate: "Seleziona le colonne 'voto' da 'recensioni', 'nome' e 'paese' da 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT recensioni.voto, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.voto, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN con tre colonne", "SELECT recensioni.voto, utenti.nome, utenti.paese"], explanation: "JOIN con più colonne utente.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Prodotti Categorie", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'prodotti' e 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT * FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT * FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM prodotti JOIN categorie ON ..."], explanation: "SELECT * con JOIN mostra tutte le colonne.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Ordini Utenti", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'ordini' e 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM ordini JOIN utenti ON ..."], explanation: "SELECT * con JOIN per vedere tutto.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Prodotti Fornitori", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'prodotti' e 'fornitori', unendo le tabelle tramite 'fornitore_id'.", queryTemplate: "SELECT * FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT * FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM prodotti JOIN fornitori ON ..."], explanation: "SELECT * con JOIN fornitori.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Ordini Prodotti", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'ordini' e 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT * FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT * FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM ordini JOIN prodotti ON ..."], explanation: "SELECT * con JOIN prodotti.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Spedizioni Ordini", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'spedizioni' e 'ordini', unendo le tabelle tramite 'ordine_id'.", queryTemplate: "SELECT * FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT * FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM spedizioni JOIN ordini ON ..."], explanation: "SELECT * con JOIN ordini.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Recensioni Prodotti", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'recensioni' e 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT * FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT * FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM recensioni JOIN prodotti ON ..."], explanation: "SELECT * con JOIN prodotti.", replacements: {} },
            { titleTemplate: "Tutte le Colonne Recensioni Utenti", descTemplate: "Seleziona tutte le colonne (*) dalle tabelle 'recensioni' e 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT * FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT * FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT * con JOIN", "SELECT * FROM recensioni JOIN utenti ON ..."], explanation: "SELECT * con JOIN utenti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Prodotti Categorie", descTemplate: "Seleziona 'nome' e 'prezzo' da 'prodotti', e 'nome' e 'descrizione' da 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT prodotti.nome, prodotti.prezzo, categorie.nome, categorie.descrizione"], explanation: "JOIN con quattro colonne.", replacements: {} },
            { titleTemplate: "Quattro Colonne Ordini Utenti", descTemplate: "Seleziona 'id' e 'data_ordine' da 'ordini', e 'nome' e 'email' da 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT ordini.id, ordini.data_ordine, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, ordini.data_ordine, utenti.nome, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT ordini.id, ordini.data_ordine, utenti.nome, utenti.email"], explanation: "JOIN con quattro colonne ordini-utenti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Prodotti Fornitori", descTemplate: "Seleziona 'nome' e 'prezzo' da 'prodotti', e 'azienda' e 'nazione' da 'fornitori', unendo le tabelle tramite 'fornitore_id'.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, fornitori.azienda, fornitori.nazione FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT prodotti.nome, prodotti.prezzo, fornitori.azienda, fornitori.nazione"], explanation: "JOIN con quattro colonne prodotti-fornitori.", replacements: {} },
            { titleTemplate: "Quattro Colonne Ordini Prodotti", descTemplate: "Seleziona 'id' e 'quantita' da 'ordini', e 'nome' e 'prezzo' da 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT ordini.id, ordini.quantita, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id", brokenCode: "SELECT ordini.id, ordini.quantita, prodotti.nome, prodotti.prezzo FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT ordini.id, ordini.quantita, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con quattro colonne ordini-prodotti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Spedizioni Ordini", descTemplate: "Seleziona 'corriere' e 'codice_tracking' da 'spedizioni', e 'data_ordine' e 'quantita' da 'ordini', unendo le tabelle tramite 'ordine_id'.", queryTemplate: "SELECT spedizioni.corriere, spedizioni.codice_tracking, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.corriere, spedizioni.codice_tracking, ordini.data_ordine, ordini.quantita FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT spedizioni.corriere, spedizioni.codice_tracking, ordini.data_ordine, ordini.quantita"], explanation: "JOIN con quattro colonne spedizioni-ordini.", replacements: {} },
            { titleTemplate: "Quattro Colonne Recensioni Prodotti", descTemplate: "Seleziona 'voto' e 'commento' da 'recensioni', e 'nome' e 'prezzo' da 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT recensioni.voto, recensioni.commento, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, recensioni.commento, prodotti.nome, prodotti.prezzo FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT recensioni.voto, recensioni.commento, prodotti.nome, prodotti.prezzo"], explanation: "JOIN con quattro colonne recensioni-prodotti.", replacements: {} },
            { titleTemplate: "Quattro Colonne Recensioni Utenti", descTemplate: "Seleziona 'voto' e 'commento' da 'recensioni', e 'nome' e 'paese' da 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT recensioni.voto, recensioni.commento, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.voto, recensioni.commento, utenti.nome, utenti.paese FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Quattro colonne", "SELECT recensioni.voto, recensioni.commento, utenti.nome, utenti.paese"], explanation: "JOIN con quattro colonne recensioni-utenti.", replacements: {} },
            { titleTemplate: "Cinque Colonne Complete", descTemplate: "Seleziona 'nome', 'prezzo' e 'stock' da 'prodotti', e 'nome' e 'descrizione' da 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, prodotti.stock, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, prodotti.stock, categorie.nome, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Cinque colonne", "SELECT prodotti.nome, prodotti.prezzo, prodotti.stock, categorie.nome, categorie.descrizione"], explanation: "JOIN con cinque colonne.", replacements: {} },
            // NEW EXERCISES FOR JOINS EASY
            { titleTemplate: "Utenti e Ordini Semplice", descTemplate: "Seleziona 'nome' dalla tabella 'utenti' e 'id' dalla tabella 'ordini', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT utenti.nome, ordini.id FROM utenti JOIN ordini ON utenti.id = ordini.utente_id", brokenCode: "SELECT utenti.nome, ordini.id FROM utenti JOIN ordini ON utenti.id = ordini.utente_id)", debugHint: "C'è una parentesi di troppo alla fine.", hints: ["JOIN utenti ordini"], explanation: "Relazione base.", replacements: {} },
            { titleTemplate: "Prodotti e Categorie Semplice", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN prodotti categorie"], explanation: "Relazione catalogo.", replacements: {} },
            { titleTemplate: "Prodotti e Fornitori Semplice", descTemplate: "Seleziona 'nome' da 'prodotti' e 'azienda' da 'fornitori', unendo le tabelle tramite 'fornitore_id'.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", brokenCode: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN prodotti fornitori"], explanation: "Relazione supply chain.", replacements: {} },
            { titleTemplate: "Recensioni e Prodotti Semplice", descTemplate: "Seleziona 'voto' da 'recensioni' e 'nome' da 'prodotti', unendo le tabelle tramite 'prodotto_id'.", queryTemplate: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id", brokenCode: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN recensioni prodotti"], explanation: "Relazione feedback.", replacements: {} },
            { titleTemplate: "Spedizioni e Ordini Semplice", descTemplate: "Seleziona 'codice_tracking' da 'spedizioni' e 'data_ordine' da 'ordini', unendo le tabelle tramite 'ordine_id'.", queryTemplate: "SELECT spedizioni.codice_tracking, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", brokenCode: "SELECT spedizioni.codice_tracking, ordini.data_ordine FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN spedizioni ordini"], explanation: "Relazione logistica.", replacements: {} },
            { titleTemplate: "Utenti e Paesi (Join)", descTemplate: "Seleziona 'nome' e 'paese' dalla tabella 'utenti'. (Questa è una selezione semplice, ma concettualmente prepara alle join se paese fosse una tabella esterna).", queryTemplate: "SELECT nome, paese FROM utenti", brokenCode: "SELECT nome, paese FROM utenti;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["SELECT semplice"], explanation: "Selezione colonne.", replacements: {} },
            { titleTemplate: "Ordini con Dettagli Utente", descTemplate: "Seleziona 'id' e 'data_ordine' da 'ordini', e 'email' da 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT ordini.id, ordini.data_ordine, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", brokenCode: "SELECT ordini.id, ordini.data_ordine, utenti.email FROM ordini JOIN utenti ON ordini.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN ordini utenti"], explanation: "Dettagli contatto.", replacements: {} },
            { titleTemplate: "Prodotti con Dettagli Categoria", descTemplate: "Seleziona 'nome' e 'prezzo' da 'prodotti', e 'descrizione' da 'categorie', unendo le tabelle tramite 'categoria_id'.", queryTemplate: "SELECT prodotti.nome, prodotti.prezzo, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", brokenCode: "SELECT prodotti.nome, prodotti.prezzo, categorie.descrizione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN prodotti categorie"], explanation: "Dettagli contesto.", replacements: {} },
            { titleTemplate: "Fornitori e Prodotti List", descTemplate: "Seleziona 'azienda' da 'fornitori' e 'nome' da 'prodotti', unendo le tabelle tramite 'fornitore_id'.", queryTemplate: "SELECT fornitori.azienda, prodotti.nome FROM fornitori JOIN prodotti ON fornitori.id = prodotti.fornitore_id", brokenCode: "SELECT fornitori.azienda, prodotti.nome FROM fornitori JOIN prodotti ON fornitori.id = prodotti.fornitore_id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN fornitori prodotti"], explanation: "Lista offerta.", replacements: {} },
            { titleTemplate: "Recensioni con Utente", descTemplate: "Seleziona 'commento' da 'recensioni' e 'nome' da 'utenti', unendo le tabelle tramite 'utente_id'.", queryTemplate: "SELECT recensioni.commento, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id", brokenCode: "SELECT recensioni.commento, utenti.nome FROM recensioni JOIN utenti ON recensioni.utente_id = utenti.id;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["JOIN recensioni utenti"], explanation: "Autore feedback.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Prodotti Fornitore {country}", descTemplate: "Seleziona la colonna 'nome' dalla tabella 'prodotti' unendo la tabella 'fornitori' dove la colonna 'nazione' è '{country}'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = '{country}'", hints: ["Fai la JOIN e poi il WHERE"], explanation: "Filtrare in base a tabella collegata.", replacements: { country: ['Italia', 'Germania', 'USA', 'Francia', 'Spagna', 'Regno Unito'] }, brokenCode: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = '{country}", debugHint: "Manca l'apice di chiusura per il valore '{country}'." },
            { titleTemplate: "Left Join (Prodotti senza Ordini)", descTemplate: "Seleziona 'nome' da 'prodotti' e 'id' da 'ordini' usando LEFT JOIN per includere anche i prodotti che non sono mai stati ordinati.", queryTemplate: "SELECT prodotti.nome, ordini.id FROM prodotti LEFT JOIN ordini ON prodotti.id = ordini.prodotto_id", hints: ["Usa LEFT JOIN", "Prodotti a sinistra"], explanation: "LEFT JOIN preserva la tabella di sinistra anche se non c'è match.", replacements: {}, brokenCode: "SELECT prodotti.nome, ordini.id FROM prodotti LEFT JOIN ordini prodotti.id = ordini.prodotto_id", debugHint: "Manca la parola chiave ON." },
            { titleTemplate: "Ordini Utenti Premium", descTemplate: "Seleziona tutte le colonne (*) da 'ordini' unendo 'utenti' dove la colonna 'premium' è TRUE.", queryTemplate: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE", hints: ["Filtra su colonna della tabella joinata"], explanation: "Restrizione dataset via relazione.", replacements: {}, brokenCode: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium =", debugHint: "Manca il valore di confronto per la colonna premium." },
            { titleTemplate: "Prodotti Categoria {cat}", descTemplate: "Seleziona 'nome' da 'prodotti' unendo 'categorie' dove il nome della categoria è '{cat}'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = '{cat}'", hints: ["JOIN e WHERE su categoria", "WHERE categorie.nome = '{cat}'"], explanation: "Filtro su colonna tabella joinata.", replacements: { cat: ['Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Libri'] }, brokenCode: "SELECT prodotti.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = {cat}", debugHint: "Il valore stringa '{cat}' deve essere racchiuso tra apici." },
            { titleTemplate: "Ordini Utenti {country}", descTemplate: "Seleziona 'id' da 'ordini' unendo 'utenti' dove il paese dell'utente è '{country}'.", queryTemplate: "SELECT ordini.id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.paese = '{country}'", hints: ["JOIN e WHERE su paese", "WHERE utenti.paese = '{country}'"], explanation: "Filtro su paese utente.", replacements: { country: ['Italia', 'Francia', 'Germania', 'Spagna', 'USA'] }, brokenCode: "SELECT ordini.id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.paese = {country}", debugHint: "Il valore stringa '{country}' deve essere racchiuso tra apici." },
            { titleTemplate: "Recensioni Prodotti Costosi", descTemplate: "Seleziona 'voto' da 'recensioni' unendo 'prodotti' dove il prezzo del prodotto è maggiore di 100.", queryTemplate: "SELECT recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE prodotti.prezzo > 100", hints: ["JOIN e WHERE su prezzo", "WHERE prodotti.prezzo > 100"], explanation: "Filtro su prezzo prodotto.", replacements: {}, brokenCode: "SELECT recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE prodotti.prezzo 100", debugHint: "Manca l'operatore di confronto (>)." },
            { titleTemplate: "Spedizioni Ordini Recenti", descTemplate: "Seleziona 'corriere' da 'spedizioni' unendo 'ordini' dove la data ordine è successiva al '2023-01-01'.", queryTemplate: "SELECT spedizioni.corriere FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id WHERE ordini.data_ordine > '2023-01-01'", hints: ["JOIN e WHERE su data", "WHERE ordini.data_ordine > '2023-01-01'"], explanation: "Filtro su data ordine.", replacements: {}, brokenCode: "SELECT spedizioni.corriere FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id WHERE ordini.data_ordine > 2023-01-01", debugHint: "La data deve essere racchiusa tra apici." },
            { titleTemplate: "Prodotti Fornitori {country}", descTemplate: "Seleziona 'nome' da 'prodotti' unendo 'fornitori' dove la nazione del fornitore è '{country}'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = '{country}'", hints: ["JOIN e WHERE su nazione", "WHERE fornitori.nazione = '{country}'"], explanation: "Filtro su nazione fornitore.", replacements: { country: ['Italia', 'Germania', 'USA', 'Francia', 'Spagna'] }, brokenCode: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = {country}", debugHint: "Il valore stringa '{country}' deve essere racchiuso tra apici." },
            { titleTemplate: "Ordini Utenti Non Premium", descTemplate: "Seleziona tutte le colonne (*) da 'ordini' unendo 'utenti' dove 'premium' è FALSE.", queryTemplate: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = FALSE", hints: ["JOIN e WHERE su premium", "WHERE utenti.premium = FALSE"], explanation: "Filtro su utenti non premium.", replacements: {}, brokenCode: "SELECT * FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium FALSE", debugHint: "Manca il segno di uguale (=)." },
            { titleTemplate: "Recensioni Voto Alto", descTemplate: "Seleziona 'voto' da 'recensioni' unendo 'prodotti' dove il voto è >= 4 E il prezzo del prodotto è > 50.", queryTemplate: "SELECT recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto >= 4 AND prodotti.prezzo > 50", hints: ["JOIN e WHERE multipli", "WHERE recensioni.voto >= 4 AND prodotti.prezzo > 50"], explanation: "Filtri multipli con JOIN.", replacements: {}, brokenCode: "SELECT recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto >= 4 prodotti.prezzo > 50", debugHint: "Manca l'operatore AND tra le due condizioni." },
            { titleTemplate: "LEFT JOIN Prodotti Ordini", descTemplate: "Seleziona 'nome' da 'prodotti' e 'id' da 'ordini' usando LEFT JOIN per includere tutti i prodotti, anche quelli senza ordini.", queryTemplate: "SELECT prodotti.nome, ordini.id FROM prodotti LEFT JOIN ordini ON prodotti.id = ordini.prodotto_id", hints: ["LEFT JOIN", "prodotti LEFT JOIN ordini"], explanation: "LEFT JOIN per vedere tutti i prodotti.", replacements: {}, brokenCode: "SELECT prodotti.nome, ordini.id FROM prodotti LEFT ordini ON prodotti.id = ordini.prodotto_id", debugHint: "Manca la parola chiave JOIN." },
            { titleTemplate: "LEFT JOIN Utenti Ordini", descTemplate: "Seleziona 'nome' da 'utenti' e 'id' da 'ordini' usando LEFT JOIN per includere tutti gli utenti, anche quelli senza ordini.", queryTemplate: "SELECT utenti.nome, ordini.id FROM utenti LEFT JOIN ordini ON utenti.id = ordini.utente_id", hints: ["LEFT JOIN", "utenti LEFT JOIN ordini"], explanation: "LEFT JOIN per vedere tutti gli utenti.", replacements: {}, brokenCode: "SELECT utenti.nome, ordini.id FROM utenti LEFT JOIN ordini utenti.id = ordini.utente_id", debugHint: "Manca la parola chiave ON." },
            { titleTemplate: "LEFT JOIN Categorie Prodotti", descTemplate: "Seleziona 'nome' da 'categorie' e 'nome' da 'prodotti' usando LEFT JOIN per includere tutte le categorie, anche quelle vuote.", queryTemplate: "SELECT categorie.nome, prodotti.nome FROM categorie LEFT JOIN prodotti ON categorie.id = prodotti.categoria_id", hints: ["LEFT JOIN", "categorie LEFT JOIN prodotti"], explanation: "LEFT JOIN per vedere tutte le categorie.", replacements: {}, brokenCode: "SELECT categorie.nome, prodotti.nome FROM categorie LETF JOIN prodotti ON categorie.id = prodotti.categoria_id", debugHint: "Errore di battitura in LEFT JOIN." },
            { titleTemplate: "LEFT JOIN Fornitori Prodotti", descTemplate: "Seleziona 'azienda' da 'fornitori' e 'nome' da 'prodotti' usando LEFT JOIN per includere tutti i fornitori.", queryTemplate: "SELECT fornitori.azienda, prodotti.nome FROM fornitori LEFT JOIN prodotti ON fornitori.id = prodotti.fornitore_id", hints: ["LEFT JOIN", "fornitori LEFT JOIN prodotti"], explanation: "LEFT JOIN per vedere tutti i fornitori.", replacements: {}, brokenCode: "SELECT fornitori.azienda, prodotti.nome FROM fornitori LEFT JOIN prodotti ON fornitori.id prodotti.fornitore_id", debugHint: "Manca l'operatore di uguaglianza (=)." },
            { titleTemplate: "LEFT JOIN Prodotti Recensioni", descTemplate: "Seleziona 'nome' da 'prodotti' e 'voto' da 'recensioni' usando LEFT JOIN per includere tutti i prodotti.", queryTemplate: "SELECT prodotti.nome, recensioni.voto FROM prodotti LEFT JOIN recensioni ON prodotti.id = recensioni.prodotto_id", hints: ["LEFT JOIN", "prodotti LEFT JOIN recensioni"], explanation: "LEFT JOIN per vedere tutti i prodotti con recensioni.", replacements: {}, brokenCode: "SELECT prodotti.nome, recensioni.voto FROM prodotti LEFT JOIN recensioni prodotti.id = recensioni.prodotto_id", debugHint: "Manca la parola chiave ON." },
            { titleTemplate: "LEFT JOIN Utenti Recensioni", descTemplate: "Seleziona 'nome' da 'utenti' e 'voto' da 'recensioni' usando LEFT JOIN per includere tutti gli utenti.", queryTemplate: "SELECT utenti.nome, recensioni.voto FROM utenti LEFT JOIN recensioni ON utenti.id = recensioni.utente_id", hints: ["LEFT JOIN", "utenti LEFT JOIN recensioni"], explanation: "LEFT JOIN per vedere tutti gli utenti con recensioni.", replacements: {}, brokenCode: "SELECT utenti.nome, recensioni.voto FROM utenti LEFT recensioni ON utenti.id = recensioni.utente_id", debugHint: "Manca la parola chiave JOIN." },
            { titleTemplate: "JOIN con WHERE Prezzo", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per i prodotti che costano più di {price} euro.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > {price}", hints: ["JOIN e WHERE su prezzo", "WHERE prodotti.prezzo > {price}"], explanation: "JOIN con filtro prezzo.", replacements: { price: [50, 100, 150, 200] }, brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id prodotti.prezzo > {price}", debugHint: "Manca la parola chiave WHERE." },
            { titleTemplate: "JOIN con WHERE Stock", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per i prodotti con stock > {stock}.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.stock > {stock}", hints: ["JOIN e WHERE su stock", "WHERE prodotti.stock > {stock}"], explanation: "JOIN con filtro stock.", replacements: { stock: [10, 20, 30, 40] }, brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.stock {stock}", debugHint: "Manca l'operatore di confronto (>)." },
            { titleTemplate: "JOIN con WHERE Data", descTemplate: "Seleziona 'id' da 'ordini' e 'nome' da 'utenti' per gli ordini effettuati dopo il {date}.", queryTemplate: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > '{date}'", hints: ["JOIN e WHERE su data", "WHERE ordini.data_ordine > '{date}'"], explanation: "JOIN con filtro data.", replacements: { date: ['2023-01-01', '2023-06-01', '2023-12-01'] }, brokenCode: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > {date}", debugHint: "La data deve essere racchiusa tra apici." },
            { titleTemplate: "JOIN con WHERE Voto", descTemplate: "Seleziona 'voto' da 'recensioni' e 'nome' da 'prodotti' per le recensioni con voto >= {vote}.", queryTemplate: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto >= {vote}", hints: ["JOIN e WHERE su voto", "WHERE recensioni.voto >= {vote}"], explanation: "JOIN con filtro voto.", replacements: { vote: [3, 4, 5] }, brokenCode: "SELECT recensioni.voto, prodotti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto {vote}", debugHint: "Manca l'operatore >=." },
            { titleTemplate: "JOIN con WHERE AND", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per i prodotti con prezzo tra {min} e {max}.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo BETWEEN {min} AND {max}", hints: ["JOIN e WHERE BETWEEN", "WHERE prodotti.prezzo BETWEEN {min} AND {max}"], explanation: "JOIN con filtro range prezzo.", replacements: { min: [50, 100], max: [150, 200] }, brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo BETWEEN {min} {max}", debugHint: "Manca la parola chiave AND." },
            { titleTemplate: "JOIN con WHERE OR", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per le categorie 'Elettronica' O 'Sport'.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = 'Elettronica' OR categorie.nome = 'Sport'", hints: ["JOIN e WHERE OR", "WHERE categorie.nome = 'Elettronica' OR categorie.nome = 'Sport'"], explanation: "JOIN con filtro OR.", replacements: {}, brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = 'Elettronica' categorie.nome = 'Sport'", debugHint: "Manca l'operatore OR." },
            { titleTemplate: "JOIN con WHERE IN", descTemplate: "Seleziona 'nome' da 'prodotti' e 'azienda' da 'fornitori' per i fornitori di Italia, Germania o USA.", queryTemplate: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione IN ('Italia', 'Germania', 'USA')", hints: ["JOIN e WHERE IN", "WHERE fornitori.nazione IN ('Italia', 'Germania', 'USA')"], explanation: "JOIN con filtro IN.", replacements: {}, brokenCode: "SELECT prodotti.nome, fornitori.azienda FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione IN ('Italia', 'Germania', 'USA'", debugHint: "Manca la parentesi di chiusura della lista IN." },
            { titleTemplate: "JOIN con ORDER BY", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie', ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY prodotti.prezzo DESC", hints: ["JOIN con ORDER BY", "ORDER BY prodotti.prezzo DESC"], explanation: "JOIN con ordinamento.", replacements: {}, brokenCode: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER prodotti.prezzo DESC", debugHint: "Manca la parola chiave BY." },
            { titleTemplate: "JOIN con ORDER BY Nome", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie', ordinati per nome prodotto A-Z.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY prodotti.nome ASC", hints: ["JOIN con ORDER BY nome", "ORDER BY prodotti.nome ASC"], explanation: "JOIN con ordinamento nome.", replacements: {} },
            { titleTemplate: "JOIN con LIMIT", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie', ordinati per prezzo decrescente, limitando a 5 risultati.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY prodotti.prezzo DESC LIMIT 5", hints: ["JOIN con ORDER BY e LIMIT", "ORDER BY prodotti.prezzo DESC LIMIT 5"], explanation: "JOIN con LIMIT.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e ORDER BY", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per prodotti > 100 euro, ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > 100 ORDER BY prodotti.prezzo DESC", hints: ["JOIN, WHERE e ORDER BY", "WHERE prodotti.prezzo > 100 ORDER BY prodotti.prezzo DESC"], explanation: "JOIN con WHERE e ORDER BY.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e LIMIT", descTemplate: "Seleziona 'id' da 'ordini' e 'nome' da 'utenti' per ordini dopo il '2023-01-01', limitando a 3 risultati.", queryTemplate: "SELECT ordini.id, utenti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > '2023-01-01' LIMIT 3", hints: ["JOIN, WHERE e LIMIT", "WHERE ordini.data_ordine > '2023-01-01' LIMIT 3"], explanation: "JOIN con WHERE e LIMIT.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e ORDER BY Nome", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per prodotti > 50 euro, ordinati per nome prodotto A-Z.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > 50 ORDER BY prodotti.nome ASC", hints: ["JOIN, WHERE e ORDER BY nome", "WHERE prodotti.prezzo > 50 ORDER BY prodotti.nome ASC"], explanation: "JOIN con WHERE e ordinamento nome.", replacements: {} },
            { titleTemplate: "JOIN con WHERE e ORDER BY Stock", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per prodotti con stock > 10, ordinati per stock decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.stock > 10 ORDER BY prodotti.stock DESC", hints: ["JOIN, WHERE e ORDER BY stock", "WHERE prodotti.stock > 10 ORDER BY prodotti.stock DESC"], explanation: "JOIN con WHERE e ordinamento stock.", replacements: {} },
            // NEW EXERCISES FOR JOINS MEDIUM
            { titleTemplate: "Prodotti Categoria Elettronica", descTemplate: "Seleziona 'nome' da 'prodotti' unendo 'categorie' dove il nome categoria è 'Elettronica'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE categorie.nome = 'Elettronica'", hints: ["WHERE categorie.nome = 'Elettronica'"], explanation: "Filtro su tabella joinata.", replacements: {} },
            { titleTemplate: "Prodotti Fornitore Italia", descTemplate: "Seleziona 'nome' da 'prodotti' unendo 'fornitori' dove la nazione è 'Italia'.", queryTemplate: "SELECT prodotti.nome FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE fornitori.nazione = 'Italia'", hints: ["WHERE fornitori.nazione = 'Italia'"], explanation: "Filtro geografico.", replacements: {} },
            { titleTemplate: "Ordini Utenti USA", descTemplate: "Seleziona 'id' da 'ordini' unendo 'utenti' dove il paese è 'USA'.", queryTemplate: "SELECT ordini.id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.paese = 'USA'", hints: ["WHERE utenti.paese = 'USA'"], explanation: "Filtro geografico ordini.", replacements: {} },
            { titleTemplate: "Recensioni Voto 5", descTemplate: "Seleziona 'nome' da 'prodotti' e 'commento' da 'recensioni' dove il voto è 5.", queryTemplate: "SELECT prodotti.nome, recensioni.commento FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id WHERE recensioni.voto = 5", hints: ["WHERE voto = 5"], explanation: "Filtro eccellenza.", replacements: {} },
            { titleTemplate: "Spedizioni DHL Ordini", descTemplate: "Seleziona 'id' e 'data_ordine' da 'ordini' unendo 'spedizioni' dove il corriere è 'DHL'.", queryTemplate: "SELECT ordini.id, ordini.data_ordine FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE spedizioni.corriere = 'DHL'", hints: ["WHERE corriere = 'DHL'"], explanation: "Filtro corriere.", replacements: {} },
            { titleTemplate: "Prodotti Categoria Prezzo > 50", descTemplate: "Seleziona 'nome' da 'prodotti' e 'nome' da 'categorie' per prodotti con prezzo > 50.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id WHERE prodotti.prezzo > 50", hints: ["WHERE prezzo > 50"], explanation: "Filtro prezzo su join.", replacements: {} },
            { titleTemplate: "Utenti con Ordini > 2023", descTemplate: "Seleziona 'nome' (DISTINCT) da 'utenti' che hanno ordinato dopo il '2023-01-01'.", queryTemplate: "SELECT DISTINCT utenti.nome FROM utenti JOIN ordini ON utenti.id = ordini.utente_id WHERE ordini.data_ordine > '2023-01-01'", hints: ["DISTINCT per evitare duplicati"], explanation: "Utenti attivi recenti.", replacements: {} },
            { titleTemplate: "Categorie con Prodotti Stock 0", descTemplate: "Seleziona 'nome' (DISTINCT) da 'categorie' che hanno prodotti con stock = 0.", queryTemplate: "SELECT DISTINCT categorie.nome FROM categorie JOIN prodotti ON categorie.id = prodotti.categoria_id WHERE prodotti.stock = 0", hints: ["DISTINCT, WHERE stock = 0"], explanation: "Analisi stock categorie.", replacements: {} },
            { titleTemplate: "Fornitori Prodotti Costosi", descTemplate: "Seleziona 'azienda' (DISTINCT) da 'fornitori' che vendono prodotti con prezzo > 200.", queryTemplate: "SELECT DISTINCT fornitori.azienda FROM fornitori JOIN prodotti ON fornitori.id = prodotti.fornitore_id WHERE prodotti.prezzo > 200", hints: ["DISTINCT, WHERE prezzo > 200"], explanation: "Fornitori premium.", replacements: {} },
            { titleTemplate: "Utenti Recensioni Negative", descTemplate: "Seleziona 'nome' (DISTINCT) da 'utenti' che hanno dato voto <= 2.", queryTemplate: "SELECT DISTINCT utenti.nome FROM utenti JOIN recensioni ON utenti.id = recensioni.utente_id WHERE recensioni.voto <= 2", hints: ["DISTINCT, WHERE voto <= 2"], explanation: "Utenti insoddisfatti.", replacements: {} }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Recensioni Prodotto e Utente", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'utenti' e 'voto' da 'recensioni', unendo le tre tabelle.", queryTemplate: "SELECT prodotti.nome, utenti.nome, recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN utenti ON recensioni.utente_id = utenti.id", hints: ["Fai due JOIN consecutive"], explanation: "SQL permette di concatenare infinite JOIN.", replacements: {} },
            { titleTemplate: "Ordini con Dettagli Completi", descTemplate: "Seleziona 'data_ordine' da 'ordini', 'nome' da 'utenti', 'nome' da 'prodotti' e 'quantita' da 'ordini', unendo le tre tabelle.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome, ordini.quantita FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id", hints: ["Collega Ordini a Utenti E a Prodotti"], explanation: "Ricostruzione oggetto di business completo.", replacements: {} },
            { titleTemplate: "Self Join (Stesso Prezzo)", descTemplate: "Trova coppie di prodotti diversi (A, B) che hanno lo stesso prezzo. Seleziona A.nome, B.nome e A.prezzo.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id", hints: ["Usa alias A e B per la stessa tabella", "Escludi A.id = B.id"], explanation: "Self Join serve per confrontare righe della stessa tabella.", replacements: {} },
            { titleTemplate: "Tripla JOIN Recensioni", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie', 'nome' da 'utenti' e 'voto' da 'recensioni', unendo le quattro tabelle.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome, recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id", hints: ["Tre JOIN consecutive", "recensioni -> prodotti -> categorie -> utenti"], explanation: "Tripla JOIN per collegare più tabelle.", replacements: {} },
            { titleTemplate: "Tripla JOIN Ordini", descTemplate: "Seleziona 'data_ordine' da 'ordini', 'nome' da 'utenti', 'nome' da 'prodotti' e 'nome' da 'categorie', unendo le quattro tabelle.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome, categorie.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Tre JOIN consecutive", "ordini -> utenti -> prodotti -> categorie"], explanation: "Tripla JOIN per ordini completi.", replacements: {} },
            { titleTemplate: "Tripla JOIN Spedizioni", descTemplate: "Seleziona 'corriere' da 'spedizioni', 'data_ordine' da 'ordini', 'nome' da 'utenti' e 'nome' da 'prodotti', unendo le quattro tabelle.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine, utenti.nome, prodotti.nome FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id", hints: ["Tre JOIN consecutive", "spedizioni -> ordini -> utenti -> prodotti"], explanation: "Tripla JOIN per spedizioni complete.", replacements: {} },
            { titleTemplate: "Quattro JOIN Complete", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie', 'azienda' da 'fornitori' e 'nazione' da 'fornitori', unendo le tre tabelle.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["Due JOIN su prodotti", "prodotti -> categorie e prodotti -> fornitori"], explanation: "JOIN multipli dalla stessa tabella base.", replacements: {} },
            { titleTemplate: "Self Join Prezzi Uguali", descTemplate: "Trova coppie di prodotti diversi (A, B) con lo stesso prezzo. Seleziona A.nome, B.nome e A.prezzo.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id", hints: ["Self JOIN con alias", "A.prezzo = B.prezzo WHERE A.id <> B.id"], explanation: "Self JOIN per trovare prodotti con stesso prezzo.", replacements: {} },
            { titleTemplate: "Self Join Stock Uguali", descTemplate: "Trova coppie di prodotti diversi (A, B) con lo stesso stock. Seleziona A.nome, B.nome e A.stock.", queryTemplate: "SELECT A.nome, B.nome, A.stock FROM prodotti AS A JOIN prodotti AS B ON A.stock = B.stock WHERE A.id <> B.id", hints: ["Self JOIN con alias", "A.stock = B.stock WHERE A.id <> B.id"], explanation: "Self JOIN per trovare prodotti con stesso stock.", replacements: {} },
            { titleTemplate: "Self Join Categoria Uguale", descTemplate: "Trova coppie di prodotti diversi (A, B) della stessa categoria. Seleziona A.nome, B.nome e A.categoria_id.", queryTemplate: "SELECT A.nome, B.nome, A.categoria_id FROM prodotti AS A JOIN prodotti AS B ON A.categoria_id = B.categoria_id WHERE A.id <> B.id", hints: ["Self JOIN con alias", "A.categoria_id = B.categoria_id WHERE A.id <> B.id"], explanation: "Self JOIN per trovare prodotti stessa categoria.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie' e 'nome' da 'utenti' per recensioni con voto >= 4.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4", hints: ["Tre JOIN con WHERE", "WHERE recensioni.voto >= 4"], explanation: "Tripla JOIN con filtro.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE Prezzo", descTemplate: "Seleziona 'data_ordine' da 'ordini', 'nome' da 'utenti' e 'nome' da 'prodotti' per ordini di prodotti con prezzo > 100.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE prodotti.prezzo > 100", hints: ["Due JOIN con WHERE", "WHERE prodotti.prezzo > 100"], explanation: "JOIN multipli con filtro prezzo.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE Data", descTemplate: "Seleziona 'corriere' da 'spedizioni', 'data_ordine' da 'ordini' e 'nome' da 'utenti' per ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT spedizioni.corriere, ordini.data_ordine, utenti.nome FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id JOIN utenti ON ordini.utente_id = utenti.id WHERE ordini.data_ordine > '2023-01-01'", hints: ["Due JOIN con WHERE", "WHERE ordini.data_ordine > '2023-01-01'"], explanation: "JOIN multipli con filtro data.", replacements: {} },
            { titleTemplate: "Tripla JOIN con ORDER BY", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie' e 'nome' da 'utenti' per recensioni, ordinate per voto decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id ORDER BY recensioni.voto DESC", hints: ["Tre JOIN con ORDER BY", "ORDER BY recensioni.voto DESC"], explanation: "Tripla JOIN con ordinamento.", replacements: {} },
            { titleTemplate: "Tripla JOIN con ORDER BY Prezzo", descTemplate: "Seleziona 'data_ordine' da 'ordini', 'nome' da 'utenti' e 'nome' da 'prodotti', ordinati per prezzo prodotto decrescente.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id ORDER BY prodotti.prezzo DESC", hints: ["Due JOIN con ORDER BY", "ORDER BY prodotti.prezzo DESC"], explanation: "JOIN multipli con ordinamento prezzo.", replacements: {} },
            { titleTemplate: "Tripla JOIN con LIMIT", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie' e 'nome' da 'utenti' per le prime 5 recensioni con voto più alto.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id ORDER BY recensioni.voto DESC LIMIT 5", hints: ["Tre JOIN con ORDER BY e LIMIT", "ORDER BY recensioni.voto DESC LIMIT 5"], explanation: "Tripla JOIN con LIMIT.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE e ORDER BY", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie' e 'nome' da 'utenti' per recensioni con voto >= 4, ordinate per voto decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4 ORDER BY recensioni.voto DESC", hints: ["Tre JOIN con WHERE e ORDER BY", "WHERE recensioni.voto >= 4 ORDER BY recensioni.voto DESC"], explanation: "Tripla JOIN con WHERE e ORDER BY.", replacements: {} },
            { titleTemplate: "Tripla JOIN con WHERE e LIMIT", descTemplate: "Seleziona 'data_ordine' da 'ordini', 'nome' da 'utenti' e 'nome' da 'prodotti' per i primi 3 ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, prodotti.nome FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.data_ordine > '2023-01-01' LIMIT 3", hints: ["Due JOIN con WHERE e LIMIT", "WHERE ordini.data_ordine > '2023-01-01' LIMIT 3"], explanation: "JOIN multipli con WHERE e LIMIT.", replacements: {} },
            { titleTemplate: "Quattro JOIN Complete", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie', 'azienda' da 'fornitori' e 'nazione' da 'fornitori' per tutti i prodotti.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["Due JOIN su prodotti", "prodotti -> categorie e prodotti -> fornitori"], explanation: "JOIN multipli dalla stessa tabella.", replacements: {} },
            { titleTemplate: "Quattro JOIN con WHERE", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie', 'azienda' da 'fornitori' e 'nazione' da 'fornitori' per prodotti con prezzo > 100.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id WHERE prodotti.prezzo > 100", hints: ["Due JOIN con WHERE", "WHERE prodotti.prezzo > 100"], explanation: "JOIN multipli con filtro.", replacements: {} },
            { titleTemplate: "Quattro JOIN con ORDER BY", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie', 'azienda' da 'fornitori' e 'nazione' da 'fornitori', ordinati per prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id ORDER BY prodotti.prezzo DESC", hints: ["Due JOIN con ORDER BY", "ORDER BY prodotti.prezzo DESC"], explanation: "JOIN multipli con ordinamento.", replacements: {} },
            { titleTemplate: "Self Join Prezzo Maggiore", descTemplate: "Trova coppie di prodotti diversi (A, B) dove A costa più di B. Seleziona A.nome, B.nome, A.prezzo e B.prezzo.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo, B.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo > B.prezzo WHERE A.id <> B.id", hints: ["Self JOIN con >", "A.prezzo > B.prezzo WHERE A.id <> B.id"], explanation: "Self JOIN per confrontare prezzi.", replacements: {} },
            { titleTemplate: "Self Join Stock Maggiore", descTemplate: "Trova coppie di prodotti diversi (A, B) dove A ha stock maggiore di B. Seleziona A.nome, B.nome, A.stock e B.stock.", queryTemplate: "SELECT A.nome, B.nome, A.stock, B.stock FROM prodotti AS A JOIN prodotti AS B ON A.stock > B.stock WHERE A.id <> B.id", hints: ["Self JOIN con >", "A.stock > B.stock WHERE A.id <> B.id"], explanation: "Self JOIN per confrontare stock.", replacements: {} },
            { titleTemplate: "Self Join con WHERE", descTemplate: "Trova coppie di prodotti diversi (A, B) con stesso prezzo, ma solo se entrambi costano più di 100 euro. Seleziona A.nome, B.nome e A.prezzo.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id AND A.prezzo > 100", hints: ["Self JOIN con WHERE", "A.prezzo = B.prezzo WHERE A.id <> B.id AND A.prezzo > 100"], explanation: "Self JOIN con filtro aggiuntivo.", replacements: {} },
            { titleTemplate: "Self Join con ORDER BY", descTemplate: "Trova coppie di prodotti diversi (A, B) con stesso prezzo, ordinate per prezzo decrescente. Seleziona A.nome, B.nome e A.prezzo.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id ORDER BY A.prezzo DESC", hints: ["Self JOIN con ORDER BY", "ORDER BY A.prezzo DESC"], explanation: "Self JOIN con ordinamento.", replacements: {} },
            { titleTemplate: "Self Join con LIMIT", descTemplate: "Trova le prime 5 coppie di prodotti diversi (A, B) con stesso prezzo. Seleziona A.nome, B.nome e A.prezzo.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo WHERE A.id <> B.id LIMIT 5", hints: ["Self JOIN con LIMIT", "LIMIT 5"], explanation: "Self JOIN con LIMIT.", replacements: {} },
            { titleTemplate: "Tripla JOIN Completa Finale", descTemplate: "Seleziona 'data_ordine' da 'ordini', 'nome' da 'utenti', 'paese' da 'utenti', 'nome' da 'prodotti', 'prezzo' da 'prodotti' e 'quantita' da 'ordini', unendo le tre tabelle.", queryTemplate: "SELECT ordini.data_ordine, utenti.nome, utenti.paese, prodotti.nome, prodotti.prezzo, ordini.quantita FROM ordini JOIN utenti ON ordini.utente_id = utenti.id JOIN prodotti ON ordini.prodotto_id = prodotti.id", hints: ["Due JOIN con sei colonne", "ordini -> utenti -> prodotti"], explanation: "JOIN multipli con molte colonne.", replacements: {} },
            { titleTemplate: "Tripla JOIN con Filtri Multipli", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie' e 'nome' da 'utenti' per recensioni con voto >= 4 di prodotti con prezzo > 100.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4 AND prodotti.prezzo > 100", hints: ["Tre JOIN con WHERE multipli", "WHERE recensioni.voto >= 4 AND prodotti.prezzo > 100"], explanation: "Tripla JOIN con filtri multipli.", replacements: {} },
            { titleTemplate: "Tripla JOIN con ORDER BY e LIMIT", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie' e 'nome' da 'utenti' per i primi 5 prodotti, ordinati per voto decrescente e prezzo decrescente.", queryTemplate: "SELECT prodotti.nome, categorie.nome, utenti.nome FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN utenti ON recensioni.utente_id = utenti.id ORDER BY recensioni.voto DESC, prodotti.prezzo DESC LIMIT 5", hints: ["Tre JOIN con ORDER BY multiplo e LIMIT", "ORDER BY recensioni.voto DESC, prodotti.prezzo DESC LIMIT 5"], explanation: "Tripla JOIN con ordinamento multiplo e LIMIT.", replacements: {} },
            { titleTemplate: "Quattro JOIN Complesso", descTemplate: "Seleziona 'nome' da 'prodotti', 'nome' da 'categorie', 'azienda' da 'fornitori', 'nazione' da 'fornitori', 'nome' da 'utenti' e 'voto' da 'recensioni' per recensioni con voto >= 4.", queryTemplate: "SELECT prodotti.nome, categorie.nome, fornitori.azienda, fornitori.nazione, utenti.nome, recensioni.voto FROM recensioni JOIN prodotti ON recensioni.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id JOIN utenti ON recensioni.utente_id = utenti.id WHERE recensioni.voto >= 4", hints: ["Quattro JOIN con WHERE", "recensioni -> prodotti -> categorie -> fornitori -> utenti"], explanation: "Quattro JOIN con filtro.", replacements: {} },
            { titleTemplate: "Self Join Complesso Finale", descTemplate: "Trova coppie di prodotti diversi (A, B) con stesso prezzo e stessa categoria. Seleziona A.nome, B.nome, A.prezzo e A.categoria_id, ordinati per prezzo decrescente.", queryTemplate: "SELECT A.nome, B.nome, A.prezzo, A.categoria_id FROM prodotti AS A JOIN prodotti AS B ON A.prezzo = B.prezzo AND A.categoria_id = B.categoria_id WHERE A.id <> B.id ORDER BY A.prezzo DESC", hints: ["Self JOIN con condizioni multiple", "A.prezzo = B.prezzo AND A.categoria_id = B.categoria_id WHERE A.id <> B.id ORDER BY A.prezzo DESC"], explanation: "Self JOIN complesso con condizioni multiple e ordinamento.", replacements: {} },
            { titleTemplate: "Cross Join (Simulazione)", descTemplate: "Genera tutte le possibili combinazioni (prodotto cartesiano) tra 'prodotti' e 'categorie'. Seleziona prodotti.nome e categorie.nome.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti CROSS JOIN categorie", hints: ["CROSS JOIN"], explanation: "Tutte le combinazioni possibili.", replacements: {} },
            { titleTemplate: "Join Multipla 4 Tabelle", descTemplate: "Seleziona 'nome' da 'utenti', 'nome' da 'prodotti' e 'nome' da 'categorie' unendo le quattro tabelle (utenti, ordini, prodotti, categorie).", queryTemplate: "SELECT utenti.nome, prodotti.nome, categorie.nome FROM utenti JOIN ordini ON utenti.id = ordini.utente_id JOIN prodotti ON ordini.prodotto_id = prodotti.id JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Catena di 3 JOIN"], explanation: "Percorso completo.", replacements: {} },
            { titleTemplate: "Join Multipla 5 Tabelle", descTemplate: "Seleziona 'nome' da 'utenti', 'corriere' da 'spedizioni' e 'azienda' da 'fornitori' unendo le cinque tabelle (utenti, ordini, spedizioni, prodotti, fornitori).", queryTemplate: "SELECT utenti.nome, spedizioni.corriere, fornitori.azienda FROM utenti JOIN ordini ON utenti.id = ordini.utente_id JOIN spedizioni ON ordini.id = spedizioni.ordine_id JOIN prodotti ON ordini.prodotto_id = prodotti.id JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["Catena complessa"], explanation: "Vista a 360 gradi.", replacements: {} },
            { titleTemplate: "Prodotti Mai Ordinati (LEFT JOIN NULL)", descTemplate: "Trova prodotti che non sono mai stati ordinati. Seleziona 'nome' da 'prodotti'.", queryTemplate: "SELECT prodotti.nome FROM prodotti LEFT JOIN ordini ON prodotti.id = ordini.prodotto_id WHERE ordini.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Tecnica per trovare record orfani.", replacements: {} },
            { titleTemplate: "Utenti Senza Ordini", descTemplate: "Trova utenti che non hanno mai fatto ordini. Seleziona 'nome' da 'utenti'.", queryTemplate: "SELECT utenti.nome FROM utenti LEFT JOIN ordini ON utenti.id = ordini.utente_id WHERE ordini.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Utenti inattivi.", replacements: {} },
            { titleTemplate: "Categorie Senza Prodotti", descTemplate: "Trova categorie che non hanno prodotti associati. Seleziona 'nome' da 'categorie'.", queryTemplate: "SELECT categorie.nome FROM categorie LEFT JOIN prodotti ON categorie.id = prodotti.categoria_id WHERE prodotti.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Categorie inutilizzate.", replacements: {} },
            { titleTemplate: "Fornitori Senza Prodotti", descTemplate: "Trova fornitori che non hanno prodotti a catalogo. Seleziona 'azienda' da 'fornitori'.", queryTemplate: "SELECT fornitori.azienda FROM fornitori LEFT JOIN prodotti ON fornitori.id = prodotti.fornitore_id WHERE prodotti.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Fornitori inattivi.", replacements: {} },
            { titleTemplate: "Prodotti Senza Recensioni", descTemplate: "Trova prodotti che non hanno recensioni. Seleziona 'nome' da 'prodotti'.", queryTemplate: "SELECT prodotti.nome FROM prodotti LEFT JOIN recensioni ON prodotti.id = recensioni.prodotto_id WHERE recensioni.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Prodotti non valutati.", replacements: {} },
            { titleTemplate: "Utenti Senza Recensioni", descTemplate: "Trova utenti che non hanno mai scritto recensioni. Seleziona 'nome' da 'utenti'.", queryTemplate: "SELECT utenti.nome FROM utenti LEFT JOIN recensioni ON utenti.id = recensioni.utente_id WHERE recensioni.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Lurkers.", replacements: {} },
            { titleTemplate: "Ordini Senza Spedizioni", descTemplate: "Trova ordini che non sono ancora stati spediti. Seleziona 'id' da 'ordini'.", queryTemplate: "SELECT ordini.id FROM ordini LEFT JOIN spedizioni ON ordini.id = spedizioni.ordine_id WHERE spedizioni.id IS NULL", hints: ["LEFT JOIN ... WHERE ... IS NULL"], explanation: "Backlog logistico.", replacements: {} }
        ]
    },
    [TopicId.Aggregation]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Conteggio Utenti", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'utenti'.", queryTemplate: "SELECT COUNT(*) FROM utenti", brokenCode: "SELECT COUNT(*) FORM utenti", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa una funzione di aggregazione per contare le righe.", "La funzione COUNT(*) conta tutte le righe, inclusi i valori NULL.", "Sintassi: SELECT COUNT(*) FROM tabella;"], explanation: "COUNT(*) è la funzione standard per ottenere il numero totale di record in una tabella.", replacements: {} },
            { titleTemplate: "Totale Stock", descTemplate: "Seleziona la somma (SUM) della colonna 'stock' dalla tabella 'prodotti'.", queryTemplate: "SELECT SUM(stock) FROM prodotti", brokenCode: "SELECT SUM(stock) FROM prodotti)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa la funzione di aggregazione per sommare valori numerici.", "La funzione SUM(colonna) somma tutti i valori della colonna specificata.", "Sintassi: SELECT SUM(nome_colonna) FROM tabella;"], explanation: "SUM() calcola il totale aritmetico dei valori in una colonna numerica.", replacements: {} },
            { titleTemplate: "Prezzo Medio", descTemplate: "Seleziona la media (AVG) della colonna 'prezzo' dalla tabella 'prodotti'.", queryTemplate: "SELECT AVG(prezzo) FROM prodotti", brokenCode: "SELECT AVG(prezzo FROM prodotti", debugHint: "Manca la parentesi di chiusura della funzione AVG.", hints: ["Usa la funzione di aggregazione per calcolare la media aritmetica.", "La funzione AVG(colonna) restituisce la media dei valori numerici.", "Sintassi: SELECT AVG(nome_colonna) FROM tabella;"], explanation: "AVG() calcola la media aritmetica dei valori in una colonna, ignorando i NULL.", replacements: {} },
            { titleTemplate: "Conteggio Prodotti", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'prodotti'.", queryTemplate: "SELECT COUNT(*) FROM prodotti", brokenCode: "SELECT COUNT* FROM prodotti", debugHint: "La funzione COUNT richiede le parentesi: COUNT(*).", hints: ["Usa COUNT(*)"], explanation: "Conta tutti i prodotti.", replacements: {} },
            { titleTemplate: "Conteggio Ordini", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'ordini'.", queryTemplate: "SELECT COUNT(*) FROM ordini", brokenCode: "SELETC COUNT(*) FROM ordini", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Usa COUNT(*)"], explanation: "Conta tutti gli ordini.", replacements: {} },
            { titleTemplate: "Conteggio Recensioni", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'recensioni'.", queryTemplate: "SELECT COUNT(*) FROM recensioni", brokenCode: "SELECT COUNT(*) FROM recensioni;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa COUNT(*)"], explanation: "Conta tutte le recensioni.", replacements: {} },
            { titleTemplate: "Conteggio Spedizioni", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'spedizioni'.", queryTemplate: "SELECT COUNT(*) FROM spedizioni", brokenCode: "SELECT COUNT(*) FROM spedizioni;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa COUNT(*)."], explanation: "Restituisce il numero totale di righe nella tabella spedizioni.", replacements: {} },
            { titleTemplate: "Conteggio Categorie", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'categorie'.", queryTemplate: "SELECT COUNT(*) FROM categorie", brokenCode: "SELECT COUNT(*) FROM categorie)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa COUNT(*)."], explanation: "Restituisce il numero totale di righe nella tabella categorie.", replacements: {} },
            { titleTemplate: "Conteggio Fornitori", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'fornitori'.", queryTemplate: "SELECT COUNT(*) FROM fornitori", brokenCode: "SELECT COUNT(*) FORM fornitori", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa COUNT(*)."], explanation: "Restituisce il numero totale di righe nella tabella fornitori.", replacements: {} },
            { titleTemplate: "Totale Prezzo", descTemplate: "Seleziona la somma (SUM) della colonna 'prezzo' dalla tabella 'prodotti'.", queryTemplate: "SELECT SUM(prezzo) FROM prodotti", brokenCode: "SELECT SUM(prezzo) FROM prodotti;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa SUM(prezzo)."], explanation: "Calcola il totale dei prezzi.", replacements: {} },
            { titleTemplate: "Totale Quantità Ordini", descTemplate: "Seleziona la somma (SUM) della colonna 'quantita' dalla tabella 'ordini'.", queryTemplate: "SELECT SUM(quantita) FROM ordini", brokenCode: "SELECT SUM(quantita) FROM ordini)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa SUM(quantita)."], explanation: "Calcola il totale delle quantità ordinate.", replacements: {} },
            { titleTemplate: "Totale Voti", descTemplate: "Seleziona la somma (SUM) della colonna 'voto' dalla tabella 'recensioni'.", queryTemplate: "SELECT SUM(voto) FROM recensioni", brokenCode: "SELECT SUM(voto) FORM recensioni", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa SUM(voto)."], explanation: "Calcola il totale dei voti.", replacements: {} },
            { titleTemplate: "Stock Medio", descTemplate: "Seleziona la media (AVG) della colonna 'stock' dalla tabella 'prodotti'.", queryTemplate: "SELECT AVG(stock) FROM prodotti", brokenCode: "SELECT AVG(stock) FROM prodotti;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa AVG(stock)."], explanation: "Calcola la media dello stock.", replacements: {} },
            { titleTemplate: "Prezzo Massimo", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'prezzo' dalla tabella 'prodotti'.", queryTemplate: "SELECT MAX(prezzo) FROM prodotti", brokenCode: "SELECT MAX(prezzo) FROM prodotti", debugHint: "Controlla la sintassi.", hints: ["Usa la funzione per trovare il valore più alto.", "La funzione MAX(colonna) restituisce il valore massimo.", "Sintassi: SELECT MAX(nome_colonna) FROM tabella;"], explanation: "MAX() restituisce il valore più alto presente nella colonna specificata.", replacements: {} },
            { titleTemplate: "Prezzo Minimo", descTemplate: "Seleziona il valore minimo (MIN) della colonna 'prezzo' dalla tabella 'prodotti'.", queryTemplate: "SELECT MIN(prezzo) FROM prodotti", brokenCode: "SELECT MIN(prezzo) FROM prodotti", debugHint: "Verifica la query.", hints: ["Usa la funzione per trovare il valore più basso.", "La funzione MIN(colonna) restituisce il valore minimo.", "Sintassi: SELECT MIN(nome_colonna) FROM tabella;"], explanation: "MIN() restituisce il valore più basso presente nella colonna specificata.", replacements: {} },
            { titleTemplate: "Stock Massimo", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'stock' dalla tabella 'prodotti'.", queryTemplate: "SELECT MAX(stock) FROM prodotti", brokenCode: "SELECT MAX(stock) FORM prodotti", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa MAX(stock)"], explanation: "Stock massimo.", replacements: {} },
            { titleTemplate: "Stock Minimo", descTemplate: "Seleziona il valore minimo (MIN) della colonna 'stock' dalla tabella 'prodotti'.", queryTemplate: "SELECT MIN(stock) FROM prodotti", brokenCode: "SELECT MIN(stock) prodotti", debugHint: "Manca la parola chiave FROM.", hints: ["Usa MIN(stock)"], explanation: "Stock minimo.", replacements: {} },
            { titleTemplate: "Voto Massimo", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'voto' dalla tabella 'recensioni'.", queryTemplate: "SELECT MAX(voto) FROM recensioni", brokenCode: "SELETC MAX(voto) FROM recensioni", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Usa MAX(voto)"], explanation: "Voto massimo.", replacements: {} },
            { titleTemplate: "Voto Minimo", descTemplate: "Seleziona il valore minimo (MIN) della colonna 'voto' dalla tabella 'recensioni'.", queryTemplate: "SELECT MIN(voto) FROM recensioni", brokenCode: "SELECT MIN(voto)) FROM recensioni", debugHint: "C'è una parentesi di troppo.", hints: ["Usa MIN(voto)"], explanation: "Voto minimo.", replacements: {} },
            { titleTemplate: "Voto Medio", descTemplate: "Seleziona la media (AVG) della colonna 'voto' dalla tabella 'recensioni'.", queryTemplate: "SELECT AVG(voto) FROM recensioni", brokenCode: "SELECT AVG voto FROM recensioni", debugHint: "Le funzioni di aggregazione richiedono le parentesi: AVG(voto).", hints: ["Usa AVG(voto)"], explanation: "Media dei voti.", replacements: {} },
            { titleTemplate: "Quantità Media Ordini", descTemplate: "Seleziona la media (AVG) della colonna 'quantita' dalla tabella 'ordini'.", queryTemplate: "SELECT AVG(quantita) FROM ordini", brokenCode: "SELECT AVG(quantita) FROM ordini;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa AVG(quantita)."], explanation: "Calcola la media delle quantità.", replacements: {} },
            { titleTemplate: "Quantità Massima Ordini", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'quantita' dalla tabella 'ordini'.", queryTemplate: "SELECT MAX(quantita) FROM ordini", brokenCode: "SELECT MAX(quantita) FROM ordini)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa MAX(quantita)."], explanation: "Trova il valore massimo delle quantità.", replacements: {} },
            { titleTemplate: "Quantità Minima Ordini", descTemplate: "Seleziona il valore minimo (MIN) della colonna 'quantita' dalla tabella 'ordini'.", queryTemplate: "SELECT MIN(quantita) FROM ordini", brokenCode: "SELECT MIN(quantita) FORM ordini", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa MIN(quantita)."], explanation: "Trova il valore minimo delle quantità.", replacements: {} },
            { titleTemplate: "Funzioni Multiple", descTemplate: "Seleziona COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo) e MIN(prezzo) dalla tabella 'prodotti'.", queryTemplate: "SELECT COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti", brokenCode: "SELECT COUNT(*) SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti", debugHint: "Manca una virgola tra le funzioni di aggregazione.", hints: ["Puoi usare più funzioni di aggregazione nella stessa SELECT, separate da virgola.", "Combina COUNT, SUM, AVG, MAX e MIN."], explanation: "È possibile calcolare diverse statistiche aggregate contemporaneamente nella stessa query.", replacements: {} },
            { titleTemplate: "Funzioni Multiple Stock", descTemplate: "Seleziona COUNT(*), SUM(stock), AVG(stock), MAX(stock) e MIN(stock) dalla tabella 'prodotti'.", queryTemplate: "SELECT COUNT(*), SUM(stock), AVG(stock), MAX(stock), MIN(stock) FROM prodotti", brokenCode: "SELECT COUNT(*) SUM(stock), AVG(stock), MAX(stock), MIN(stock) FROM prodotti", debugHint: "Manca una virgola tra le funzioni di aggregazione.", hints: ["Separa le funzioni con virgole."], explanation: "Esegue tutte le aggregazioni in una sola query.", replacements: {} },
            { titleTemplate: "Funzioni Multiple Voti", descTemplate: "Seleziona COUNT(*), SUM(voto), AVG(voto), MAX(voto) e MIN(voto) dalla tabella 'recensioni'.", queryTemplate: "SELECT COUNT(*), SUM(voto), AVG(voto), MAX(voto), MIN(voto) FROM recensioni", brokenCode: "SELECT COUNT(*), SUM(voto) AVG(voto), MAX(voto), MIN(voto) FROM recensioni", debugHint: "Manca una virgola tra le funzioni di aggregazione.", hints: ["Separa le funzioni con virgole."], explanation: "Esegue tutte le aggregazioni in una sola query.", replacements: {} },
            { titleTemplate: "Conteggio con Alias", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'utenti' e rinomina la colonna come 'Totale_Utenti'.", queryTemplate: "SELECT COUNT(*) AS Totale_Utenti FROM utenti", brokenCode: "SELECT COUNT(*) AS Totale_Utenti FROM utenti;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa AS per l'alias."], explanation: "L'alias rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Somma con Alias", descTemplate: "Seleziona la somma (SUM) della colonna 'stock' dalla tabella 'prodotti' e rinomina la colonna come 'Stock_Totale'.", queryTemplate: "SELECT SUM(stock) AS Stock_Totale FROM prodotti", brokenCode: "SELECT SUM(stock) AS Stock_Totale FROM prodotti)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa AS per l'alias."], explanation: "L'alias rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Media con Alias", descTemplate: "Seleziona la media (AVG) della colonna 'prezzo' dalla tabella 'prodotti' e rinomina la colonna come 'Prezzo_Medio'.", queryTemplate: "SELECT AVG(prezzo) AS Prezzo_Medio FROM prodotti", brokenCode: "SELECT AVG(prezzo) AS Prezzo_Medio FORM prodotti", debugHint: "Errore di battitura nella parola chiave FROM.", hints: ["Usa AS per l'alias."], explanation: "L'alias rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Massimo con Alias", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'prezzo' dalla tabella 'prodotti' e rinomina la colonna come 'Prezzo_Massimo'.", queryTemplate: "SELECT MAX(prezzo) AS Prezzo_Massimo FROM prodotti", brokenCode: "SELECT MAX(prezzo) AS Prezzo_Massimo FROM prodotti;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa AS per l'alias."], explanation: "L'alias rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Minimo con Alias", descTemplate: "Seleziona il valore minimo (MIN) della colonna 'prezzo' dalla tabella 'prodotti' e rinomina la colonna come 'Prezzo_Minimo'.", queryTemplate: "SELECT MIN(prezzo) AS Prezzo_Minimo FROM prodotti", brokenCode: "SELETC MIN(prezzo) AS Prezzo_Minimo FROM prodotti", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["MIN(prezzo) AS Prezzo_Minimo"], explanation: "MIN con alias.", replacements: {} },
            // NEW EXERCISES FOR AGGREGATION EASY
            { titleTemplate: "Conteggio Utenti Premium", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'utenti' dove la colonna 'premium' è TRUE.", queryTemplate: "SELECT COUNT(*) FROM utenti WHERE premium = TRUE", brokenCode: "SELECT COUNT(*) FROM utenti WHER premium = TRUE", debugHint: "Errore di battitura nella parola chiave WHERE.", hints: ["Usa COUNT(*) combinato con la clausola WHERE.", "Filtra prima le righe, poi conta il risultato."], explanation: "Le funzioni di aggregazione operano sulle righe filtrate dalla clausola WHERE.", replacements: {} },
            { titleTemplate: "Somma Stock Elettronica", descTemplate: "Seleziona la somma (SUM) della colonna 'stock' dalla tabella 'prodotti' dove 'categoria_id' è 1.", queryTemplate: "SELECT SUM(stock) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT SUM(stock) prodotti WHERE categoria_id = 1", debugHint: "Manca la parola chiave FROM.", hints: ["SUM con WHERE"], explanation: "Somma filtrata.", replacements: {} },
            { titleTemplate: "Media Prezzo Elettronica", descTemplate: "Seleziona la media (AVG) della colonna 'prezzo' dalla tabella 'prodotti' dove 'categoria_id' è 1.", queryTemplate: "SELECT AVG(prezzo) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT AV(prezzo) FROM prodotti WHERE categoria_id = 1", debugHint: "La funzione per la media è AVG, non AV.", hints: ["AVG con WHERE"], explanation: "Media filtrata.", replacements: {} },
            { titleTemplate: "Massimo Prezzo Elettronica", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'prezzo' dalla tabella 'prodotti' dove 'categoria_id' è 1.", queryTemplate: "SELECT MAX(prezzo) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT MAX(prezzo) FROM prodotti WHERE categoria_id = 1;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa MAX con una clausola WHERE.", "WHERE categoria_id = 1"], explanation: "Trova il valore massimo in un sottoinsieme filtrato di dati.", replacements: {} },
            { titleTemplate: "Minimo Prezzo Elettronica", descTemplate: "Seleziona il valore minimo (MIN) della colonna 'prezzo' dalla tabella 'prodotti' dove 'categoria_id' è 1.", queryTemplate: "SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1", brokenCode: "SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa MIN con una clausola WHERE.", "WHERE categoria_id = 1"], explanation: "Trova il valore minimo in un sottoinsieme filtrato di dati.", replacements: {} },
            { titleTemplate: "Conteggio Prodotti Costosi", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'prodotti' dove 'prezzo' è maggiore di 100.", queryTemplate: "SELECT COUNT(*) FROM prodotti WHERE prezzo > 100", brokenCode: "SELECT COUNT(*) FROM prodotti WHERE prezzo > 100;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Usa COUNT(*) con un filtro sul prezzo.", "WHERE prezzo > 100"], explanation: "Conta le righe che soddisfano una condizione numerica.", replacements: {} },
            { titleTemplate: "Somma Valore Magazzino", descTemplate: "Seleziona la somma (SUM) del prodotto tra 'prezzo' e 'stock' (prezzo * stock) dalla tabella 'prodotti'.", queryTemplate: "SELECT SUM(prezzo * stock) FROM prodotti", brokenCode: "SELECT SUM(prezzo * stock) FROM prodotti)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Puoi usare espressioni matematiche dentro SUM.", "SUM(prezzo * stock)"], explanation: "Aggrega il risultato di un calcolo riga per riga.", replacements: {} },
            { titleTemplate: "Conteggio Ordini 2023", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'ordini' dove l'anno di 'data_ordine' è 2023.", queryTemplate: "SELECT COUNT(*) FROM ordini WHERE YEAR(data_ordine) = 2023", brokenCode: "SELECT COUNT(*) FROM ordini WHERE YEAR(data_ordine) = 2023;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Filtra per anno e poi conta.", "WHERE YEAR(data_ordine) = 2023"], explanation: "Conteggio filtrato su base temporale.", replacements: {} },
            { titleTemplate: "Conteggio Spedizioni DHL", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'spedizioni' dove 'corriere' è 'DHL'.", queryTemplate: "SELECT COUNT(*) FROM spedizioni WHERE corriere = 'DHL'", brokenCode: "SELECT COUNT(*) FROM spedizioni WHERE corriere = 'DHL')", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Filtra per nome del corriere.", "WHERE corriere = 'DHL'"], explanation: "Conteggio basato su uguaglianza di stringhe.", replacements: {} },
            { titleTemplate: "Media Voto Recensioni Alte", descTemplate: "Seleziona la media (AVG) della colonna 'voto' dalla tabella 'recensioni' dove 'voto' è maggiore o uguale a 4.", queryTemplate: "SELECT AVG(voto) FROM recensioni WHERE voto >= 4", brokenCode: "SELECT AVG(voto) FROM recensioni WHERE voto >= 4;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Calcola la media su un sottoinsieme.", "WHERE voto >= 4"], explanation: "Media condizionata a un filtro.", replacements: {} },
            { titleTemplate: "Totale Quantità Ordini Grandi", descTemplate: "Seleziona la somma (SUM) della colonna 'quantita' dalla tabella 'ordini' dove 'quantita' è maggiore di 5.", queryTemplate: "SELECT SUM(quantita) FROM ordini WHERE quantita > 5", brokenCode: "SELECT SUM(quantita) FROM ordini WHERE quantita > 5", debugHint: "Controlla la sintassi.", hints: ["Somma solo le quantità che superano la soglia.", "WHERE quantita > 5"], explanation: "Somma filtrata.", replacements: {} },
            { titleTemplate: "Conteggio Fornitori Italiani", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'fornitori' dove 'nazione' è 'Italia'.", queryTemplate: "SELECT COUNT(*) FROM fornitori WHERE nazione = 'Italia'", brokenCode: "SELECT COUNT(*) FROM fornitori WHERE nazione = 'Italia';", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Filtra per nazione.", "WHERE nazione = 'Italia'"], explanation: "Conteggio geografico.", replacements: {} },
            { titleTemplate: "Conteggio Utenti Gmail", descTemplate: "Seleziona il conteggio totale delle righe (COUNT(*)) dalla tabella 'utenti' dove 'email' contiene 'gmail.com'.", queryTemplate: "SELECT COUNT(*) FROM utenti WHERE email LIKE '%gmail.com'", brokenCode: "SELECT COUNT(*) FROM utenti WHERE email LIKE '%gmail.com')", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Usa LIKE per cercare il pattern.", "WHERE email LIKE '%gmail.com'"], explanation: "Conteggio basato su pattern matching.", replacements: {} },
            { titleTemplate: "Prezzo Medio Stock Basso", descTemplate: "Seleziona la media (AVG) della colonna 'prezzo' dalla tabella 'prodotti' dove 'stock' è minore di 10.", queryTemplate: "SELECT AVG(prezzo) FROM prodotti WHERE stock < 10", brokenCode: "SELECT AVG(prezzo) FROM prodotti WHERE stock < 10;", debugHint: "Rimuovi il punto e virgola finale se presente, o controlla la sintassi.", hints: ["Media dei prezzi per prodotti con poco stock.", "WHERE stock < 10"], explanation: "Analisi statistica su prodotti critici.", replacements: {} },
            { titleTemplate: "Max Prezzo Fornitore 1", descTemplate: "Seleziona il valore massimo (MAX) della colonna 'prezzo' dalla tabella 'prodotti' dove 'fornitore_id' è 1.", queryTemplate: "SELECT MAX(prezzo) FROM prodotti WHERE fornitore_id = 1", brokenCode: "SELECT MAX(prezzo) FROM prodotti WHERE fornitore_id = 1)", debugHint: "C'è una parentesi di troppo alla fine della query.", hints: ["Massimo prezzo per un fornitore specifico.", "WHERE fornitore_id = 1"], explanation: "Estrazione di un estremo in un gruppo logico.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Conteggio per Paese", descTemplate: "Seleziona la colonna 'paese' e il conteggio delle righe (COUNT(*)) dalla tabella 'utenti', raggruppando per 'paese'.", queryTemplate: "SELECT paese, COUNT(*) FROM utenti GROUP BY paese", hints: ["Usa GROUP BY per raggruppare i risultati.", "Sintassi: SELECT colonna, COUNT(*) FROM tabella GROUP BY colonna;"], explanation: "Raggruppa le righe per 'paese' e conta quante righe ci sono in ogni gruppo.", replacements: {}, brokenCode: "SELECT paese, COUNT(*) FROM utenti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Stock per Categoria", descTemplate: "Calcola la somma totale dello stock per ogni categoria di prodotto.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id", hints: ["Usa SUM() con GROUP BY.", "Sintassi: SELECT colonna_raggruppamento, SUM(colonna_somma) ... GROUP BY colonna_raggruppamento"], explanation: "Calcola il totale della colonna 'stock' per ogni distinto 'categoria_id'.", replacements: {}, brokenCode: "SELECT categoria_id, SUM(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Voto Prodotti", descTemplate: "Seleziona la colonna 'prodotto_id' e la media (AVG) della colonna 'voto' dalla tabella 'recensioni', raggruppando per 'prodotto_id'.", queryTemplate: "SELECT prodotto_id, AVG(voto) FROM recensioni GROUP BY prodotto_id", hints: ["Usa AVG() per la media.", "Ricorda di raggruppare per prodotto_id."], explanation: "Calcola la media aritmetica dei voti per ogni gruppo di recensioni dello stesso prodotto.", replacements: {}, brokenCode: "SELECT prodotto_id, AVG(voto) FROM recensioni", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e il conteggio delle righe (COUNT(*)) dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) con GROUP BY categoria_id."], explanation: "Conta le righe della tabella prodotti per ogni categoria distinta.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio per Fornitore", descTemplate: "Seleziona la colonna 'fornitore_id' e il conteggio delle righe (COUNT(*)) dalla tabella 'prodotti', raggruppando per 'fornitore_id'.", queryTemplate: "SELECT fornitore_id, COUNT(*) FROM prodotti GROUP BY fornitore_id", hints: ["Raggruppa per fornitore_id e conta."], explanation: "Mostra il numero di prodotti associati a ciascun fornitore.", replacements: {}, brokenCode: "SELECT fornitore_id, COUNT(*) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio per Utente", descTemplate: "Seleziona la colonna 'utente_id' e il conteggio delle righe (COUNT(*)) dalla tabella 'ordini', raggruppando per 'utente_id'.", queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id", hints: ["Usa la tabella ordini.", "Raggruppa per utente_id."], explanation: "Conta quanti ordini sono stati piazzati da ogni singolo utente.", replacements: {}, brokenCode: "SELECT utente_id, COUNT(*) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio per Prodotto", descTemplate: "Seleziona la colonna 'prodotto_id' e il conteggio delle righe (COUNT(*)) dalla tabella 'ordini', raggruppando per 'prodotto_id'.", queryTemplate: "SELECT prodotto_id, COUNT(*) FROM ordini GROUP BY prodotto_id", hints: ["Conta le occorrenze di ogni prodotto_id nella tabella ordini."], explanation: "Restituisce il numero di volte che ogni prodotto è stato ordinato.", replacements: {}, brokenCode: "SELECT prodotto_id, COUNT(*) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio per Utente Recensioni", descTemplate: "Seleziona la colonna 'utente_id' e il conteggio delle righe (COUNT(*)) dalla tabella 'recensioni', raggruppando per 'utente_id'.", queryTemplate: "SELECT utente_id, COUNT(*) FROM recensioni GROUP BY utente_id", hints: ["Lavora sulla tabella recensioni.", "Raggruppa per utente_id."], explanation: "Conta il numero di recensioni lasciate da ciascun utente.", replacements: {}, brokenCode: "SELECT utente_id, COUNT(*) FROM recensioni", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Somma Stock per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e la somma (SUM) della colonna 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id", hints: ["Usa SUM(stock) con GROUP BY."], explanation: "Somma i valori della colonna stock per ogni gruppo di categoria.", replacements: {}, brokenCode: "SELECT categoria_id, SUM(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Somma Prezzo per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e la somma (SUM) della colonna 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, SUM(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Somma la colonna prezzo raggruppando per categoria."], explanation: "Calcola il totale dei prezzi dei prodotti in ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, SUM(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Somma Quantità per Utente", descTemplate: "Seleziona la colonna 'utente_id' e la somma (SUM) della colonna 'quantita' dalla tabella 'ordini', raggruppando per 'utente_id'.", queryTemplate: "SELECT utente_id, SUM(quantita) FROM ordini GROUP BY utente_id", hints: ["Usa SUM(quantita) sulla tabella ordini."], explanation: "Somma tutte le quantità ordinate da ciascun utente.", replacements: {}, brokenCode: "SELECT utente_id, SUM(quantita) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Somma Quantità per Prodotto", descTemplate: "Seleziona la colonna 'prodotto_id' e la somma (SUM) della colonna 'quantita' dalla tabella 'ordini', raggruppando per 'prodotto_id'.", queryTemplate: "SELECT prodotto_id, SUM(quantita) FROM ordini GROUP BY prodotto_id", hints: ["Raggruppa per prodotto_id e somma le quantità."], explanation: "Indica quante unità totali di ogni prodotto sono state vendute.", replacements: {}, brokenCode: "SELECT prodotto_id, SUM(quantita) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Prezzo per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e la media (AVG) della colonna 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa AVG(prezzo) con GROUP BY."], explanation: "Calcola il prezzo medio all'interno di ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, AVG(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Stock per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e la media (AVG) della colonna 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, AVG(stock) FROM prodotti GROUP BY categoria_id", hints: ["Media dello stock raggruppata per categoria."], explanation: "Indica lo stock medio disponibile per i prodotti di ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, AVG(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Prezzo per Fornitore", descTemplate: "Seleziona la colonna 'fornitore_id' e la media (AVG) della colonna 'prezzo' dalla tabella 'prodotti', raggruppando per 'fornitore_id'.", queryTemplate: "SELECT fornitore_id, AVG(prezzo) FROM prodotti GROUP BY fornitore_id", hints: ["Raggruppa per fornitore_id."], explanation: "Mostra il livello di prezzo medio di ciascun fornitore.", replacements: {}, brokenCode: "SELECT fornitore_id, AVG(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Quantità per Utente", descTemplate: "Seleziona la colonna 'utente_id' e la media (AVG) della colonna 'quantita' dalla tabella 'ordini', raggruppando per 'utente_id'.", queryTemplate: "SELECT utente_id, AVG(quantita) FROM ordini GROUP BY utente_id", hints: ["AVG(quantita) raggruppato per utente."], explanation: "Indica se un utente tende a fare ordini grandi o piccoli in media.", replacements: {}, brokenCode: "SELECT utente_id, AVG(quantita) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Massimo Prezzo per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e il valore massimo (MAX) della colonna 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, MAX(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa MAX(prezzo) con GROUP BY."], explanation: "Restituisce il prezzo più alto trovato in ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, MAX(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Minimo Prezzo per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e il valore minimo (MIN) della colonna 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa MIN(prezzo) con GROUP BY."], explanation: "Restituisce il prezzo più basso trovato in ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, MIN(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Massimo Stock per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e il valore massimo (MAX) della colonna 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, MAX(stock) FROM prodotti GROUP BY categoria_id", hints: ["MAX(stock) raggruppato per categoria."], explanation: "Trova il valore massimo di stock per ogni gruppo.", replacements: {}, brokenCode: "SELECT categoria_id, MAX(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Minimo Stock per Categoria", descTemplate: "Seleziona la colonna 'categoria_id' e il valore minimo (MIN) della colonna 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, MIN(stock) FROM prodotti GROUP BY categoria_id", hints: ["MIN(stock) raggruppato per categoria."], explanation: "Trova il valore minimo di stock per ogni gruppo.", replacements: {}, brokenCode: "SELECT categoria_id, MIN(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Massimo Voto per Prodotto", descTemplate: "Seleziona la colonna 'prodotto_id' e il valore massimo (MAX) della colonna 'voto' dalla tabella 'recensioni', raggruppando per 'prodotto_id'.", queryTemplate: "SELECT prodotto_id, MAX(voto) FROM recensioni GROUP BY prodotto_id", hints: ["MAX(voto) sulla tabella recensioni."], explanation: "Mostra il voto migliore ottenuto da ciascun prodotto.", replacements: {}, brokenCode: "SELECT prodotto_id, MAX(voto) FROM recensioni", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Minimo Voto per Prodotto", descTemplate: "Seleziona la colonna 'prodotto_id' e il valore minimo (MIN) della colonna 'voto' dalla tabella 'recensioni', raggruppando per 'prodotto_id'.", queryTemplate: "SELECT prodotto_id, MIN(voto) FROM recensioni GROUP BY prodotto_id", hints: ["MIN(voto) sulla tabella recensioni."], explanation: "Mostra il voto peggiore ottenuto da ciascun prodotto.", replacements: {}, brokenCode: "SELECT prodotto_id, MIN(voto) FROM recensioni", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio e Somma", descTemplate: "Seleziona la colonna 'categoria_id', il conteggio delle righe (COUNT(*)) e la somma (SUM) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*), SUM(stock) FROM prodotti GROUP BY categoria_id", hints: ["Puoi usare più funzioni di aggregazione nella stessa SELECT.", "SELECT categoria_id, COUNT(*), SUM(stock) ..."], explanation: "Restituisce sia il numero di prodotti che la somma dello stock per ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*), SUM(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio e Media", descTemplate: "Seleziona la colonna 'categoria_id' e il conteggio delle righe (COUNT(*)) e la media (AVG) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*), AVG(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) e AVG(prezzo)."], explanation: "Combina conteggio e media per ogni gruppo.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*), AVG(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Somma e Media", descTemplate: "Seleziona la colonna 'categoria_id', la somma (SUM) di 'stock' e la media (AVG) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, SUM(stock), AVG(stock) FROM prodotti GROUP BY categoria_id", hints: ["Usa SUM(stock) e AVG(stock)."], explanation: "Confronta il totale e la media dello stock per categoria.", replacements: {}, brokenCode: "SELECT categoria_id, SUM(stock), AVG(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Massimo e Minimo", descTemplate: "Seleziona la colonna 'categoria_id', il valore massimo (MAX) e minimo (MIN) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, MAX(prezzo), MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa MAX(prezzo) e MIN(prezzo)."], explanation: "Identifica gli estremi di prezzo per ogni categoria.", replacements: {}, brokenCode: "SELECT categoria_id, MAX(prezzo), MIN(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio e Massimo", descTemplate: "Seleziona la colonna 'categoria_id', il conteggio delle righe (COUNT(*)) e il valore massimo (MAX) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*), MAX(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) e MAX(prezzo)."], explanation: "Mostra quanti prodotti ci sono e qual è il prezzo più alto.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*), MAX(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio e Minimo", descTemplate: "Seleziona la colonna 'categoria_id', il conteggio delle righe (COUNT(*)) e il valore minimo (MIN) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*), MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Usa COUNT(*) e MIN(prezzo)."], explanation: "Mostra quanti prodotti ci sono e qual è il prezzo più basso.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*), MIN(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Funzioni Multiple GROUP BY", descTemplate: "Seleziona 'categoria_id', COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo) e MIN(prezzo) dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti GROUP BY categoria_id", hints: ["Elenca tutte le funzioni di aggregazione richieste separate da virgola."], explanation: "Esempio di utilizzo di tutte le principali funzioni di aggregazione in una sola query.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*), SUM(prezzo), AVG(prezzo), MAX(prezzo), MIN(prezzo) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "GROUP BY con Alias", descTemplate: "Seleziona 'categoria_id' e il conteggio delle righe (COUNT(*)) rinominato 'Numero_Prodotti' dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, COUNT(*) AS Numero_Prodotti FROM prodotti GROUP BY categoria_id", hints: ["Usa AS dopo la funzione di aggregazione.", "COUNT(*) AS Numero_Prodotti"], explanation: "Gli alias rendono i risultati delle aggregazioni più leggibili.", replacements: {}, brokenCode: "SELECT categoria_id, COUNT(*) AS Numero_Prodotti FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Totale Valore per Categoria", descTemplate: "Seleziona 'categoria_id' e la somma (SUM) di (prezzo * stock) dalla tabella 'prodotti', raggruppando per 'categoria_id'.", queryTemplate: "SELECT categoria_id, SUM(prezzo * stock) FROM prodotti GROUP BY categoria_id", hints: ["Puoi aggregare il risultato di un'espressione: SUM(prezzo * stock)."], explanation: "Calcola prima il valore per ogni riga, poi somma i risultati per gruppo.", replacements: {}, brokenCode: "SELECT categoria_id, SUM(prezzo * stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Ordini per Anno", descTemplate: "Seleziona l'anno di 'data_ordine' (YEAR(data_ordine)) e il conteggio delle righe (COUNT(*)) dalla tabella 'ordini', raggruppando per anno.", queryTemplate: "SELECT YEAR(data_ordine), COUNT(*) FROM ordini GROUP BY YEAR(data_ordine)", hints: ["Raggruppa per YEAR(data_ordine)."], explanation: "Estrae l'anno dalla data e raggruppa per quel valore.", replacements: {}, brokenCode: "SELECT YEAR(data_ordine), COUNT(*) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Ordini per Mese", descTemplate: "Seleziona il mese di 'data_ordine' (MONTH(data_ordine)) e il conteggio delle righe (COUNT(*)) dalla tabella 'ordini', raggruppando per mese.", queryTemplate: "SELECT MONTH(data_ordine), COUNT(*) FROM ordini GROUP BY MONTH(data_ordine)", hints: ["Raggruppa per MONTH(data_ordine)."], explanation: "Utile per vedere in quali mesi si vende di più, a prescindere dall'anno.", replacements: {}, brokenCode: "SELECT MONTH(data_ordine), COUNT(*) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Spedizioni per Corriere", descTemplate: "Seleziona la colonna 'corriere' e il conteggio delle righe (COUNT(*)) dalla tabella 'spedizioni', raggruppando per 'corriere'.", queryTemplate: "SELECT corriere, COUNT(*) FROM spedizioni GROUP BY corriere", hints: ["Raggruppa per la colonna 'corriere'."], explanation: "Mostra il volume di spedizioni per ciascun corriere.", replacements: {}, brokenCode: "SELECT corriere, COUNT(*) FROM spedizioni", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Voto per Utente", descTemplate: "Seleziona la colonna 'utente_id' e la media (AVG) della colonna 'voto' dalla tabella 'recensioni', raggruppando per 'utente_id'.", queryTemplate: "SELECT utente_id, AVG(voto) FROM recensioni GROUP BY utente_id", hints: ["AVG(voto) raggruppato per utente_id."], explanation: "Identifica gli utenti che tendono a dare voti alti o bassi.", replacements: {}, brokenCode: "SELECT utente_id, AVG(voto) FROM recensioni", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Max Quantità per Utente", descTemplate: "Seleziona la colonna 'utente_id' e il valore massimo (MAX) della colonna 'quantita' dalla tabella 'ordini', raggruppando per 'utente_id'.", queryTemplate: "SELECT utente_id, MAX(quantita) FROM ordini GROUP BY utente_id", hints: ["MAX(quantita) raggruppato per utente_id."], explanation: "Mostra l'ordine più grande fatto da ciascun utente.", replacements: {}, brokenCode: "SELECT utente_id, MAX(quantita) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Min Stock per Fornitore", descTemplate: "Seleziona la colonna 'fornitore_id' e il valore minimo (MIN) della colonna 'stock' dalla tabella 'prodotti', raggruppando per 'fornitore_id'.", queryTemplate: "SELECT fornitore_id, MIN(stock) FROM prodotti GROUP BY fornitore_id", hints: ["MIN(stock) raggruppato per fornitore_id."], explanation: "Aiuta a capire se ci sono prodotti vicini all'esaurimento per un dato fornitore.", replacements: {}, brokenCode: "SELECT fornitore_id, MIN(stock) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio Prodotti per Prezzo", descTemplate: "Seleziona la colonna 'prezzo' e il conteggio delle righe (COUNT(*)) dalla tabella 'prodotti', raggruppando per 'prezzo'.", queryTemplate: "SELECT prezzo, COUNT(*) FROM prodotti GROUP BY prezzo", hints: ["Raggruppa per 'prezzo' e conta."], explanation: "Mostra quanti prodotti esistono per ogni fascia di prezzo (esatta).", replacements: {}, brokenCode: "SELECT prezzo, COUNT(*) FROM prodotti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Conteggio Utenti per Premium", descTemplate: "Seleziona la colonna 'premium' e il conteggio delle righe (COUNT(*)) dalla tabella 'utenti', raggruppando per 'premium'.", queryTemplate: "SELECT premium, COUNT(*) FROM utenti GROUP BY premium", hints: ["Raggruppa per la colonna booleana 'premium'."], explanation: "Divide gli utenti in due gruppi (Premium e non) e li conta.", replacements: {}, brokenCode: "SELECT premium, COUNT(*) FROM utenti", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Somma Quantità per Anno", descTemplate: "Seleziona l'anno di 'data_ordine' (YEAR(data_ordine)) e la somma (SUM) di 'quantita' dalla tabella 'ordini', raggruppando per anno.", queryTemplate: "SELECT YEAR(data_ordine), SUM(quantita) FROM ordini GROUP BY YEAR(data_ordine)", hints: ["SUM(quantita) raggruppato per anno."], explanation: "Mostra la quantità totale di merce movimentata anno per anno.", replacements: {}, brokenCode: "SELECT YEAR(data_ordine), SUM(quantita) FROM ordini", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Media Giorni Consegna per Corriere", descTemplate: "Seleziona 'corriere' e la media (AVG) della differenza in giorni (DATEDIFF) tra 'data_spedizione' e 'data_ordine', unendo 'spedizioni' e 'ordini' e raggruppando per 'corriere'.", queryTemplate: "SELECT corriere, AVG(DATEDIFF(day, data_ordine, data_spedizione)) FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id GROUP BY corriere", hints: ["Richiede JOIN tra spedizioni e ordini.", "Usa AVG(DATEDIFF(...))."], explanation: "Calcola il tempo medio trascorso tra l'ordine e la spedizione per ogni corriere.", replacements: {}, brokenCode: "SELECT corriere, AVG(DATEDIFF(day, data_ordine, data_spedizione)) FROM spedizioni JOIN ordini ON spedizioni.ordine_id = ordini.id", debugHint: "Manca la clausola GROUP BY." },
            { titleTemplate: "Totale Recensioni per Voto", descTemplate: "Seleziona la colonna 'voto' e il conteggio delle righe (COUNT(*)) dalla tabella 'recensioni', raggruppando per 'voto'.", queryTemplate: "SELECT voto, COUNT(*) FROM recensioni GROUP BY voto", hints: ["Raggruppa per 'voto'."], explanation: "Mostra la distribuzione dei voti (es. quante 5 stelle, quante 4 stelle, ecc.).", replacements: {}, brokenCode: "SELECT voto, COUNT(*) FROM recensioni", debugHint: "Manca la clausola GROUP BY." }
        ],
        [Difficulty.Hard]: [
            { 
                titleTemplate: "Filtro Having (Stock > {val})", 
                descTemplate: "Seleziona 'categoria_id' e la somma (SUM) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING SUM(stock) > {val}.", 
                queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) > {val}", 
                brokenCode: "SELECT categoria_id, SUM(stock) FROM prodotti WHERE SUM(stock) > {val} GROUP BY categoria_id",
                debugHint: "Ricorda: WHERE filtra le righe PRIMA del raggruppamento. Per filtrare i risultati aggregati (come SUM), serve una clausola diversa. Quale?",
                hints: ["Usa HAVING dopo GROUP BY per filtrare i gruppi.", "Sintassi: GROUP BY colonna HAVING condizione_aggregata"], 
                explanation: "HAVING filtra i risultati dopo l'aggregazione, mentre WHERE filtra le righe prima.", 
                replacements: { val: DATA.stock_thresholds } 
            },
            { 
                titleTemplate: "Clienti Top ({val} Ordini)", 
                descTemplate: "Seleziona 'utente_id' e il conteggio (COUNT(*)) dalla tabella 'ordini', raggruppando per 'utente_id' e filtrando con HAVING COUNT(*) > {val}.", 
                queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id HAVING COUNT(*) > {val}", 
                brokenCode: "SELECT utente_id, COUNT(*) FROM ordini WHERE COUNT(*) > {val} GROUP BY utente_id",
                debugHint: "Non puoi usare COUNT(*) nella clausola WHERE. Le funzioni di aggregazione vanno filtrate con un'altra keyword. Quale?",
                hints: ["Raggruppa per utente e usa HAVING COUNT(*) > {val}.", "WHERE non accetta funzioni aggregate", "HAVING è la keyword corretta per filtrare i gruppi"], 
                explanation: "Seleziona solo gli utenti il cui conteggio ordini supera la soglia.", 
                replacements: { val: [1, 2, 3, 4, 5] } 
            },
            { 
                titleTemplate: "Media Prezzo per Fornitore", 
                descTemplate: "Seleziona 'fornitore_id' e la media (AVG) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'fornitore_id' e filtrando con HAVING AVG(prezzo) > 50.", 
                queryTemplate: "SELECT fornitore_id, AVG(prezzo) FROM prodotti GROUP BY fornitore_id HAVING AVG(prezzo) > 50", 
                brokenCode: "SELECT fornitore_id, AVG(prezzo) FROM prodotti WHERE AVG(prezzo) > 50 GROUP BY fornitore_id",
                debugHint: "WHERE non può contenere AVG() o altre funzioni aggregate. Quale clausola devi usare per filtrare i calcoli aggregati?",
                hints: ["Usa HAVING AVG(prezzo) > 50.", "HAVING va dopo GROUP BY", "WHERE filtra le righe, HAVING filtra i gruppi"], 
                explanation: "Filtra i fornitori basandosi sul valore aggregato (media prezzo).", 
                replacements: {} 
            },
            { titleTemplate: "HAVING COUNT > {val}", descTemplate: "Seleziona 'categoria_id' e il conteggio (COUNT(*)) dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING COUNT(*) > {val}.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val}", hints: ["HAVING COUNT(*) > {val}"], explanation: "Mostra solo le categorie con un numero di prodotti superiore alla soglia.", replacements: { val: [2, 3, 5, 10] } },
            { titleTemplate: "HAVING SUM > {val}", descTemplate: "Seleziona 'categoria_id' e la somma (SUM) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING SUM(stock) > {val}.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) > {val}", hints: ["HAVING SUM(stock) > {val}"], explanation: "Filtra le categorie in base alla somma totale dello stock.", replacements: { val: [50, 100, 150, 200] } },
            { titleTemplate: "HAVING AVG > {val}", descTemplate: "Seleziona 'categoria_id' e la media (AVG) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING AVG(prezzo) > {val}.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > {val}", hints: ["HAVING AVG(prezzo) > {val}"], explanation: "Filtra le categorie in base al prezzo medio.", replacements: { val: [50, 100, 150, 200] } },
            { titleTemplate: "HAVING MAX > {val}", descTemplate: "Seleziona 'categoria_id' e il massimo (MAX) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING MAX(prezzo) > {val}.", queryTemplate: "SELECT categoria_id, MAX(prezzo) FROM prodotti GROUP BY categoria_id HAVING MAX(prezzo) > {val}", hints: ["HAVING MAX(prezzo) > {val}"], explanation: "Seleziona le categorie dove il prodotto più caro supera la soglia.", replacements: { val: [100, 150, 200, 250] } },
            { titleTemplate: "HAVING MIN < {val}", descTemplate: "Seleziona 'categoria_id' e il minimo (MIN) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING MIN(prezzo) < {val}.", queryTemplate: "SELECT categoria_id, MIN(prezzo) FROM prodotti GROUP BY categoria_id HAVING MIN(prezzo) < {val}", hints: ["HAVING MIN(prezzo) < {val}"], explanation: "Seleziona le categorie dove il prodotto più economico è sotto la soglia.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING COUNT >= {val}", descTemplate: "Seleziona 'utente_id' e il conteggio (COUNT(*)) dalla tabella 'ordini', raggruppando per 'utente_id' e filtrando con HAVING COUNT(*) >= {val}.", queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id HAVING COUNT(*) >= {val}", hints: ["HAVING COUNT(*) >= {val}"], explanation: "Filtra gli utenti con un numero di ordini maggiore o uguale a {val}.", replacements: { val: [2, 3, 5] } },
            { titleTemplate: "HAVING SUM >= {val}", descTemplate: "Seleziona 'utente_id' e la somma (SUM) di 'quantita' dalla tabella 'ordini', raggruppando per 'utente_id' e filtrando con HAVING SUM(quantita) >= {val}.", queryTemplate: "SELECT utente_id, SUM(quantita) FROM ordini GROUP BY utente_id HAVING SUM(quantita) >= {val}", hints: ["HAVING SUM(quantita) >= {val}"], explanation: "Filtra gli utenti in base alla somma delle quantità ordinate.", replacements: { val: [10, 20, 30, 50] } },
            { titleTemplate: "HAVING AVG >= {val}", descTemplate: "Seleziona 'prodotto_id' e la media (AVG) di 'voto' dalla tabella 'recensioni', raggruppando per 'prodotto_id' e filtrando con HAVING AVG(voto) >= {val}.", queryTemplate: "SELECT prodotto_id, AVG(voto) FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) >= {val}", hints: ["HAVING AVG(voto) >= {val}"], explanation: "Filtra i prodotti con recensioni mediamente positive.", replacements: { val: [3, 4, 5] } },
            { titleTemplate: "HAVING COUNT < {val}", descTemplate: "Seleziona 'categoria_id' e il conteggio (COUNT(*)) dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING COUNT(*) < {val}.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) < {val}", hints: ["HAVING COUNT(*) < {val}"], explanation: "Filtra le categorie con pochi prodotti.", replacements: { val: [5, 10, 15] } },
            { titleTemplate: "HAVING SUM < {val}", descTemplate: "Seleziona 'categoria_id' e la somma (SUM) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING SUM(stock) < {val}.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) < {val}", hints: ["HAVING SUM(stock) < {val}"], explanation: "Filtra le categorie con poco stock totale.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING AVG < {val}", descTemplate: "Seleziona 'categoria_id' e la media (AVG) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING AVG(prezzo) < {val}.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) < {val}", hints: ["HAVING AVG(prezzo) < {val}"], explanation: "Filtra le categorie con prezzi medi bassi.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING COUNT BETWEEN", descTemplate: "Seleziona 'categoria_id' e il conteggio (COUNT(*)) dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING COUNT(*) BETWEEN {min} AND {max}.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) BETWEEN {min} AND {max}", hints: ["HAVING COUNT(*) BETWEEN {min} AND {max}"], explanation: "Filtra i gruppi basandosi su un range di conteggio.", replacements: { min: [2, 5], max: [10, 20] } },
            { titleTemplate: "HAVING SUM BETWEEN", descTemplate: "Seleziona 'categoria_id' e la somma (SUM) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING SUM(stock) BETWEEN {min} AND {max}.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) BETWEEN {min} AND {max}", hints: ["HAVING SUM(stock) BETWEEN {min} AND {max}"], explanation: "Filtra i gruppi basandosi su un range di somma.", replacements: { min: [50, 100], max: [200, 300] } },
            { titleTemplate: "HAVING AVG BETWEEN", descTemplate: "Seleziona 'categoria_id' e la media (AVG) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING AVG(prezzo) BETWEEN {min} AND {max}.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) BETWEEN {min} AND {max}", hints: ["HAVING AVG(prezzo) BETWEEN {min} AND {max}"], explanation: "Filtra i gruppi basandosi su un range di media.", replacements: { min: [50, 100], max: [150, 200] } },
            { titleTemplate: "HAVING con OR", descTemplate: "Seleziona 'categoria_id', COUNT(*) e SUM(stock) dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING COUNT(*) > {val1} OR SUM(stock) > {val2}.", queryTemplate: "SELECT categoria_id, COUNT(*), SUM(stock) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val1} OR SUM(stock) > {val2}", hints: ["Usa OR tra le condizioni HAVING.", "HAVING COUNT(*) > {val1} OR SUM(stock) > {val2}"], explanation: "HAVING supporta operatori logici come OR e AND.", replacements: { val1: [2, 3], val2: [50, 100] } },
            { titleTemplate: "Fornitori con Media Prezzo > 100", descTemplate: "Seleziona 'fornitore_id' e la media (AVG) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'fornitore_id' e filtrando con HAVING AVG(prezzo) > 100.", queryTemplate: "SELECT fornitore_id, AVG(prezzo) FROM prodotti GROUP BY fornitore_id HAVING AVG(prezzo) > 100", hints: ["HAVING AVG(prezzo) > 100"], explanation: "Filtra i fornitori con prodotti mediamente costosi.", replacements: {} },
            { titleTemplate: "Categorie con Stock Basso (< 50)", descTemplate: "Seleziona 'categoria_id' e la somma (SUM) di 'stock' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING SUM(stock) < 50.", queryTemplate: "SELECT categoria_id, SUM(stock) FROM prodotti GROUP BY categoria_id HAVING SUM(stock) < 50", hints: ["HAVING SUM(stock) < 50"], explanation: "Identifica categorie con bassa disponibilità di merce.", replacements: {} },
            { titleTemplate: "Utenti con Spesa Totale > 1000 (Simulato)", descTemplate: "Seleziona 'utente_id' e la somma (SUM) di 'quantita' dalla tabella 'ordini', raggruppando per 'utente_id' e filtrando con HAVING SUM(quantita) > 1000.", queryTemplate: "SELECT utente_id, SUM(quantita) FROM ordini GROUP BY utente_id HAVING SUM(quantita) > 1000", hints: ["HAVING SUM(quantita) > 1000"], explanation: "Identifica i clienti con il maggior volume di acquisti.", replacements: {} },
            { titleTemplate: "Prodotti con Molte Recensioni (> 5)", descTemplate: "Seleziona 'prodotto_id' e il conteggio (COUNT(*)) dalla tabella 'recensioni', raggruppando per 'prodotto_id' e filtrando con HAVING COUNT(*) > 5.", queryTemplate: "SELECT prodotto_id, COUNT(*) FROM recensioni GROUP BY prodotto_id HAVING COUNT(*) > 5", hints: ["HAVING COUNT(*) > 5"], explanation: "Filtra i prodotti con un alto numero di feedback.", replacements: {} },
            { titleTemplate: "Prodotti con Voto Medio Basso (< 3)", descTemplate: "Seleziona 'prodotto_id' e la media (AVG) di 'voto' dalla tabella 'recensioni', raggruppando per 'prodotto_id' e filtrando con HAVING AVG(voto) < 3.", queryTemplate: "SELECT prodotto_id, AVG(voto) FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) < 3", hints: ["HAVING AVG(voto) < 3"], explanation: "Filtra i prodotti con recensioni negative.", replacements: {} },
            { titleTemplate: "Anni con Molti Ordini (> 100)", descTemplate: "Seleziona l'anno di 'data_ordine' (YEAR(data_ordine)) e il conteggio (COUNT(*)) dalla tabella 'ordini', raggruppando per anno e filtrando con HAVING COUNT(*) > 100.", queryTemplate: "SELECT YEAR(data_ordine), COUNT(*) FROM ordini GROUP BY YEAR(data_ordine) HAVING COUNT(*) > 100", hints: ["GROUP BY YEAR... HAVING COUNT > 100"], explanation: "Identifica gli anni con volume di ordini elevato.", replacements: {} },
            { titleTemplate: "Corrieri Molto Attivi (> 50 Spedizioni)", descTemplate: "Seleziona 'corriere' e il conteggio (COUNT(*)) dalla tabella 'spedizioni', raggruppando per 'corriere' e filtrando con HAVING COUNT(*) > 50.", queryTemplate: "SELECT corriere, COUNT(*) FROM spedizioni GROUP BY corriere HAVING COUNT(*) > 50", hints: ["HAVING COUNT(*) > 50"], explanation: "Filtra i corrieri con un alto volume di spedizioni.", replacements: {} },
            { titleTemplate: "Categorie con Prezzo Max > 500", descTemplate: "Seleziona 'categoria_id' e il massimo (MAX) di 'prezzo' dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING MAX(prezzo) > 500.", queryTemplate: "SELECT categoria_id, MAX(prezzo) FROM prodotti GROUP BY categoria_id HAVING MAX(prezzo) > 500", hints: ["HAVING MAX(prezzo) > 500"], explanation: "Identifica categorie che contengono articoli costosi.", replacements: {} },
            { titleTemplate: "Fornitori con Stock Minimo > 10", descTemplate: "Seleziona 'fornitore_id' e il minimo (MIN) di 'stock' dalla tabella 'prodotti', raggruppando per 'fornitore_id' e filtrando con HAVING MIN(stock) > 10.", queryTemplate: "SELECT fornitore_id, MIN(stock) FROM prodotti GROUP BY fornitore_id HAVING MIN(stock) > 10", hints: ["HAVING MIN(stock) > 10"], explanation: "Seleziona fornitori dove nessun prodotto ha stock <= 10.", replacements: {} },
            { titleTemplate: "Utenti con Media Voti Severa (< 2)", descTemplate: "Seleziona 'utente_id' e la media (AVG) di 'voto' dalla tabella 'recensioni', raggruppando per 'utente_id' e filtrando con HAVING AVG(voto) < 2.", queryTemplate: "SELECT utente_id, AVG(voto) FROM recensioni GROUP BY utente_id HAVING AVG(voto) < 2", hints: ["HAVING AVG(voto) < 2"], explanation: "Filtra gli utenti con una media voti molto bassa.", replacements: {} },
            { titleTemplate: "Utenti con Media Voti Generosa (> 4)", descTemplate: "Seleziona 'utente_id' e la media (AVG) di 'voto' dalla tabella 'recensioni', raggruppando per 'utente_id' e filtrando con HAVING AVG(voto) > 4.", queryTemplate: "SELECT utente_id, AVG(voto) FROM recensioni GROUP BY utente_id HAVING AVG(voto) > 4", hints: ["HAVING AVG(voto) > 4"], explanation: "Filtra gli utenti con una media voti molto alta.", replacements: {} },
            { titleTemplate: "Categorie con Range Prezzi Ampio (> 100)", descTemplate: "Seleziona 'categoria_id' e la differenza tra MAX(prezzo) e MIN(prezzo) dalla tabella 'prodotti', raggruppando per 'categoria_id' e filtrando con HAVING (MAX(prezzo) - MIN(prezzo)) > 100.", queryTemplate: "SELECT categoria_id, MAX(prezzo) - MIN(prezzo) as Delta FROM prodotti GROUP BY categoria_id HAVING (MAX(prezzo) - MIN(prezzo)) > 100", hints: ["HAVING (MAX(prezzo) - MIN(prezzo)) > 100"], explanation: "Filtra categorie con un ampio divario tra il prodotto più economico e quello più costoso.", replacements: {} },
            { titleTemplate: "Nazioni con Molti Fornitori (> 2)", descTemplate: "Seleziona 'nazione' e il conteggio (COUNT(*)) dalla tabella 'fornitori', raggruppando per 'nazione' e filtrando con HAVING COUNT(*) > 2.", queryTemplate: "SELECT nazione, COUNT(*) FROM fornitori GROUP BY nazione HAVING COUNT(*) > 2", hints: ["HAVING COUNT(*) > 2"], explanation: "Mostra le nazioni che ospitano un numero significativo di fornitori.", replacements: {} },
            { titleTemplate: "Mesi con Pochi Ordini (< 10)", descTemplate: "Seleziona il mese di 'data_ordine' (MONTH(data_ordine)) e il conteggio (COUNT(*)) dalla tabella 'ordini', raggruppando per mese e filtrando con HAVING COUNT(*) < 10.", queryTemplate: "SELECT MONTH(data_ordine), COUNT(*) FROM ordini GROUP BY MONTH(data_ordine) HAVING COUNT(*) < 10", hints: ["HAVING COUNT(*) < 10"], explanation: "Identifica i mesi con scarsa attività di vendita.", replacements: {} },
            { titleTemplate: "Utenti con Unico Ordine", descTemplate: "Seleziona 'utente_id' e il conteggio (COUNT(*)) dalla tabella 'ordini', raggruppando per 'utente_id' e filtrando con HAVING COUNT(*) = 1.", queryTemplate: "SELECT utente_id, COUNT(*) FROM ordini GROUP BY utente_id HAVING COUNT(*) = 1", hints: ["HAVING COUNT(*) = 1"], explanation: "Filtra gli utenti che hanno acquistato una sola volta.", replacements: {} },
            { titleTemplate: "Prodotti con Voto Unanime (Min=Max)", descTemplate: "Seleziona 'prodotto_id', MIN(voto) e MAX(voto) dalla tabella 'recensioni', raggruppando per 'prodotto_id' e filtrando con HAVING MIN(voto) = MAX(voto) AND COUNT(*) >= 2.", queryTemplate: "SELECT prodotto_id, MIN(voto), MAX(voto) FROM recensioni GROUP BY prodotto_id HAVING MIN(voto) = MAX(voto) AND COUNT(*) >= 2", hints: ["HAVING MIN(voto) = MAX(voto) AND COUNT(*) >= 2"], explanation: "Se min e max sono uguali, tutti i voti sono identici.", replacements: {} },
            { titleTemplate: "HAVING COUNT e AVG", descTemplate: "Seleziona 'prodotto_id', COUNT(*) e AVG(voto) dalla tabella 'recensioni', raggruppando per 'prodotto_id' e filtrando con HAVING COUNT(*) > {val1} AND AVG(voto) >= {val2}.", queryTemplate: "SELECT prodotto_id, COUNT(*), AVG(voto) FROM recensioni GROUP BY prodotto_id HAVING COUNT(*) > {val1} AND AVG(voto) >= {val2}", hints: ["Usa AND per combinare le condizioni.", "HAVING COUNT(*) > {val1} AND AVG(voto) >= {val2}"], explanation: "Combina criteri di quantità (COUNT) e qualità (AVG).", replacements: { val1: [1, 2], val2: [3, 4] } },
            { titleTemplate: "HAVING con ORDER BY", descTemplate: "Seleziona 'categoria_id' e COUNT(*) dalla tabella 'prodotti', raggruppando per 'categoria_id', filtrando con HAVING COUNT(*) > {val} e ordinando per COUNT(*) decrescente.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val} ORDER BY COUNT(*) DESC", hints: ["Usa ORDER BY dopo HAVING.", "ORDER BY COUNT(*) DESC"], explanation: "Filtra i gruppi e poi ordina i risultati rimasti.", replacements: { val: [2, 3, 5] } },
            { titleTemplate: "HAVING con ORDER BY AVG", descTemplate: "Seleziona 'categoria_id' e AVG(prezzo) dalla tabella 'prodotti', raggruppando per 'categoria_id', filtrando con HAVING AVG(prezzo) > {val} e ordinando per AVG(prezzo) decrescente.", queryTemplate: "SELECT categoria_id, AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > {val} ORDER BY AVG(prezzo) DESC", hints: ["ORDER BY AVG(prezzo) DESC"], explanation: "Filtra per media prezzo e ordina dal più caro al più economico.", replacements: { val: [50, 100, 150] } },
            { titleTemplate: "HAVING con LIMIT", descTemplate: "Seleziona 'categoria_id' e COUNT(*) dalla tabella 'prodotti', raggruppando per 'categoria_id', filtrando con HAVING COUNT(*) > {val}, ordinando per COUNT(*) decrescente e limitando a 5 risultati.", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val} ORDER BY COUNT(*) DESC LIMIT 5", hints: ["Usa LIMIT 5 alla fine della query."], explanation: "Filtra, ordina e limita il numero di risultati.", replacements: { val: [2, 3, 5] } },
            { titleTemplate: "HAVING Complesso Finale", descTemplate: "Seleziona 'categoria_id', COUNT(*) e AVG(prezzo) dalla tabella 'prodotti', raggruppando per 'categoria_id', filtrando con HAVING COUNT(*) > {val1} AND AVG(prezzo) > {val2}, ordinando per AVG(prezzo) decrescente e limitando a 5.", queryTemplate: "SELECT categoria_id, COUNT(*), AVG(prezzo) FROM prodotti GROUP BY categoria_id HAVING COUNT(*) > {val1} AND AVG(prezzo) > {val2} ORDER BY AVG(prezzo) DESC LIMIT 5", hints: ["Combina AND, ORDER BY e LIMIT."], explanation: "Query complessa che combina filtri multipli su aggregati, ordinamento e limitazione.", replacements: { val1: [2, 3], val2: [50, 100] } }
        ]
    },
    [TopicId.Case]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Simple Case", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", brokenCode: "SELECT nome, CSE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["Usa CASE WHEN condizione THEN valore ELSE valore END.", "Sintassi: CASE WHEN stock > 0 ..."], explanation: "CASE permette di creare logica condizionale direttamente nella query.", replacements: {} },
            { titleTemplate: "Case Stock Disponibile", descTemplate: "Seleziona 'nome' e un CASE come 'stato' che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti", brokenCode: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' AS stato FROM prodotti", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["Usa AS per dare un nome alla colonna calcolata.", "CASE ... END AS stato"], explanation: "L'alias 'stato' rende il risultato più leggibile.", replacements: {} },
            { titleTemplate: "Case Prezzo Alto", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Alto' se 'prezzo' > 100, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 THEN 'Alto' ELSE 'Basso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo > 100 THAN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["Confronta la colonna prezzo con 100.", "CASE WHEN prezzo > 100 ..."], explanation: "Segmenta i prodotti in base a una soglia di prezzo.", replacements: {} },
            { titleTemplate: "Case Prezzo Medio", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Medio' se 'prezzo' > 50, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 50 THEN 'Medio' ELSE 'Basso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo > 50 THEN 'Medio' 'Basso' END FROM prodotti", debugHint: "Manca la parola chiave ELSE.", hints: ["Soglia di prezzo a 50.", "CASE WHEN prezzo > 50 ..."], explanation: "Utile per filtrare visivamente prodotti sopra una certa fascia.", replacements: {} },
            { titleTemplate: "Case Voto Alto", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Alto' se 'voto' >= 4, altrimenti 'Basso' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto >= 4 THEN 'Alto' ELSE 'Basso' END FROM recensioni", brokenCode: "SELECT voto, CASE WEN voto >= 4 THEN 'Alto' ELSE 'Basso' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave WHEN.", hints: ["Usa l'operatore >= (maggiore o uguale).", "CASE WHEN voto >= 4 ..."], explanation: "Identifica le recensioni positive.", replacements: {} },
            { titleTemplate: "Case Voto Basso", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Basso' se 'voto' < 3, altrimenti 'Alto' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto < 3 THEN 'Basso' ELSE 'Alto' END FROM recensioni", brokenCode: "SELECT voto, WHEN voto < 3 THEN 'Basso' ELSE 'Alto' END FROM recensioni", debugHint: "Manca la parola chiave CASE all'inizio dell'espressione.", hints: ["Usa l'operatore < (minore).", "CASE WHEN voto < 3 ..."], explanation: "Identifica le recensioni negative o critiche.", replacements: {} },
            { titleTemplate: "Case Quantità", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Grande' se 'quantita' > 5, altrimenti 'Piccola' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita > 5 THEN 'Grande' ELSE 'Piccola' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita > 5 THEN Grande ELSE Piccola END FROM ordini", debugHint: "Le stringhe devono essere racchiuse tra apici singoli.", hints: ["Confronta la quantità ordinata.", "CASE WHEN quantita > 5 ..."], explanation: "Distingue tra ordini voluminosi e ordini standard.", replacements: {} },
            { titleTemplate: "Case Premium", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Premium' se 'premium' è TRUE, altrimenti 'Standard' dalla tabella 'utenti'.", queryTemplate: "SELECT nome, CASE WHEN premium = TRUE THEN 'Premium' ELSE 'Standard' END FROM utenti", brokenCode: "SELECT nome, CASE WHEN premium = TREU THEN 'Premium' ELSE 'Standard' END FROM utenti", debugHint: "Errore di battitura nel valore booleano TRUE.", hints: ["La colonna premium è booleana.", "CASE WHEN premium = TRUE ..."], explanation: "Traduce un valore booleano in un testo leggibile.", replacements: {} },
            { titleTemplate: "Case NULL Tracking", descTemplate: "Seleziona un CASE che mostra 'In Attesa' se 'codice_tracking' è NULL, altrimenti 'Tracciata' dalla tabella 'spedizioni'.", queryTemplate: "SELECT CASE WHEN codice_tracking IS NULL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", brokenCode: "SELECT CASE WHEN codice_tracking IS NUL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", debugHint: "Errore di battitura nella parola chiave NULL.", hints: ["Usa IS NULL per verificare i valori mancanti.", "CASE WHEN codice_tracking IS NULL ..."], explanation: "Gestisce i valori NULL per fornire un output più chiaro.", replacements: {} },
            { titleTemplate: "Case Stock Zero", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Esaurito' se 'stock' = 0, altrimenti 'Disponibile' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' ELSE 'Disponibile' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN stock = 0 'Esaurito' ELSE 'Disponibile' END FROM prodotti", debugHint: "Manca la parola chiave THEN.", hints: ["Controlla l'uguaglianza con 0.", "CASE WHEN stock = 0 ..."], explanation: "Identifica immediatamente i prodotti non disponibili.", replacements: {} },
            { titleTemplate: "Case Prezzo Zero", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Gratis' se 'prezzo' = 0, altrimenti 'A Pagamento' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo = 0 THEN 'Gratis' ELSE 'A Pagamento' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo = 0 THEN 'Gratis' ELS 'A Pagamento' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave ELSE.", hints: ["CASE WHEN prezzo = 0 ..."], explanation: "Evidenzia i prodotti gratuiti.", replacements: {} },
            { titleTemplate: "Case Voto Cinque", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Perfetto' se 'voto' = 5, altrimenti 'Normale' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto = 5 THEN 'Perfetto' ELSE 'Normale' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto = 5 THEN 'Perfetto' ELSE 'Normale' FROM recensioni", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN voto = 5 ..."], explanation: "Mette in risalto il punteggio massimo.", replacements: {} },
            { titleTemplate: "Case Quantità Uno", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Singolo' se 'quantita' = 1, altrimenti 'Multiplo' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' ELSE 'Multiplo' END FROM ordini", brokenCode: "SELECT quantita, CSE WHEN quantita = 1 THEN 'Singolo' ELSE 'Multiplo' END FROM ordini", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN quantita = 1 ..."], explanation: "Distingue acquisti singoli da acquisti multipli.", replacements: {} },
            { titleTemplate: "Case Stock Maggiore", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Abbondante' se 'stock' > 20, altrimenti 'Limitato' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock > 20 THEN 'Abbondante' ELSE 'Limitato' END FROM prodotti", brokenCode: "SELECT nome, CASE stock > 20 THEN 'Abbondante' ELSE 'Limitato' END FROM prodotti", debugHint: "Manca la parola chiave WHEN dopo CASE.", hints: ["CASE WHEN stock > 20 ..."], explanation: "Indica prodotti con ampia disponibilità.", replacements: {} },
            { titleTemplate: "Case Prezzo Minore", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' < 30, altrimenti 'Normale' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 30 THEN 'Economico' ELSE 'Normale' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo < 30 'Economico' ELSE 'Normale' END FROM prodotti", debugHint: "Manca la parola chiave THEN.", hints: ["CASE WHEN prezzo < 30 ..."], explanation: "Identifica prodotti di fascia bassa.", replacements: {} },
            { titleTemplate: "Case Voto Maggiore", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Positivo' se 'voto' > 3, altrimenti 'Negativo' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto > 3 THEN 'Positivo' ELSE 'Negativo' END FROM recensioni", brokenCode: "SELETC voto, CASE WHEN voto > 3 THEN 'Positivo' ELSE 'Negativo' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["CASE WHEN voto > 3 ..."], explanation: "Separa le recensioni positive da quelle negative/neutre.", replacements: {} },
            { titleTemplate: "Case Quantità Maggiore", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Grande Ordine' se 'quantita' > 10, altrimenti 'Piccolo Ordine' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita > 10 THEN 'Grande Ordine' ELSE 'Piccolo Ordine' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita > 10 THEN 'Grande Ordine' ELSE 'Piccolo Ordine' FROM ordini", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN quantita > 10 ..."], explanation: "Evidenzia ordini particolarmente grandi.", replacements: {} },
            { titleTemplate: "Case Stock Minore", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Basso' se 'stock' < 10, altrimenti 'Sufficiente' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock < 10 THEN 'Basso' ELSE 'Sufficiente' END FROM prodotti", brokenCode: "SELECT nome, CAES WHEN stock < 10 THEN 'Basso' ELSE 'Sufficiente' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN stock < 10 ..."], explanation: "Allerta per riordino merce.", replacements: {} },
            { titleTemplate: "Case Prezzo Maggiore Uguale", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Costoso' se 'prezzo' >= 100, altrimenti 'Accessibile' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo >= 100 THEN 'Costoso' ELSE 'Accessibile' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo >= 100 'Costoso' ELSE 'Accessibile' END FROM prodotti", debugHint: "Manca la parola chiave THEN.", hints: ["CASE WHEN prezzo >= 100 ..."], explanation: "Segmentazione di prezzo inclusiva.", replacements: {} },
            { titleTemplate: "Case Voto Minore Uguale", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Basso' se 'voto' <= 2, altrimenti 'Alto' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' ELSE 'Alto' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' ELSI 'Alto' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave ELSE.", hints: ["CASE WHEN voto <= 2 ..."], explanation: "Identifica recensioni gravemente insufficienti.", replacements: {} },
            { titleTemplate: "Case Quantità Minore Uguale", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Piccolo' se 'quantita' <= 3, altrimenti 'Grande' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' ELSE 'Grande' END FROM ordini", brokenCode: "SELECT quantita, WHEN quantita <= 3 THEN 'Piccolo' ELSE 'Grande' END FROM ordini", debugHint: "Manca la parola chiave CASE.", hints: ["CASE WHEN quantita <= 3 ..."], explanation: "Identifica ordini di piccola entità.", replacements: {} },
            { titleTemplate: "Case Stock Maggiore Uguale", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Alto' se 'stock' >= 50, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock >= 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHE stock >= 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave WHEN.", hints: ["CASE WHEN stock >= 50 ..."], explanation: "Conferma livelli di stock ottimali.", replacements: {} },
            { titleTemplate: "Case Prezzo Minore Uguale", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' <= 50, altrimenti 'Costoso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo <= 50 THEN 'Economico' ELSE 'Costoso' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN prezzo <= 50 THEN 'Economico' ELSE 'Costoso' FROM prodotti", debugHint: "Manca la parola chiave END.", hints: ["CASE WHEN prezzo <= 50 ..."], explanation: "Identifica prodotti accessibili.", replacements: {} },
            { titleTemplate: "Case Voto Maggiore Uguale", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Eccellente' se 'voto' >= 4, altrimenti 'Normale' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto >= 4 THEN 'Eccellente' ELSE 'Normale' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto >= 4 THE 'Eccellente' ELSE 'Normale' END FROM recensioni", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["CASE WHEN voto >= 4 ..."], explanation: "Evidenzia feedback molto positivi.", replacements: {} },
            { titleTemplate: "Case Quantità Maggiore Uguale", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Media' se 'quantita' >= 5, altrimenti 'Piccola' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita >= 5 THEN 'Media' ELSE 'Piccola' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita >= 5 THEN 'Media' 'Piccola' END FROM ordini", debugHint: "Manca la parola chiave ELSE.", hints: ["CASE WHEN quantita >= 5 ..."], explanation: "Soglia per ordini di media grandezza.", replacements: {} },
            { titleTemplate: "Case Stock Minore Uguale", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Critico' se 'stock' <= 5, altrimenti 'Normale' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock <= 5 THEN 'Critico' ELSE 'Normale' END FROM prodotti", brokenCode: "SELECT nome, CSE WHEN stock <= 5 THEN 'Critico' ELSE 'Normale' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN stock <= 5 ..."], explanation: "Segnala prodotti quasi esauriti.", replacements: {} },
            { titleTemplate: "Case Prezzo Non Zero", descTemplate: "Seleziona 'nome' e un CASE che mostra 'A Pagamento' se 'prezzo' <> 0, altrimenti 'Gratis' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo <> 0 THEN 'A Pagamento' ELSE 'Gratis' END FROM prodotti", brokenCode: "SELECT nome, CASE prezzo <> 0 THEN 'A Pagamento' ELSE 'Gratis' END FROM prodotti", debugHint: "Manca la parola chiave WHEN.", hints: ["Usa l'operatore <> (diverso).", "CASE WHEN prezzo <> 0 ..."], explanation: "Verifica che il prezzo non sia nullo o zero.", replacements: {} },
            { titleTemplate: "Case Voto Non Cinque", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Migliorabile' se 'voto' <> 5, altrimenti 'Perfetto' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto <> 5 THEN 'Migliorabile' ELSE 'Perfetto' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto <> 5 THEN 'Migliorabile' ELSE 'Perfetto' EN FROM recensioni", debugHint: "Errore di battitura nella parola chiave END.", hints: ["CASE WHEN voto <> 5 ..."], explanation: "Identifica tutto ciò che non è perfetto.", replacements: {} },
            { titleTemplate: "Case Quantità Non Uno", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Multiplo' se 'quantita' <> 1, altrimenti 'Singolo' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <> 1 THEN 'Multiplo' ELSE 'Singolo' END FROM ordini", brokenCode: "SELECT quantita, CASE WHEN quantita <> 1 THEN Multiplo ELSE Singolo END FROM ordini", debugHint: "Le stringhe devono essere racchiuse tra apici singoli.", hints: ["CASE WHEN quantita <> 1 ..."], explanation: "Filtra ordini con più di un pezzo.", replacements: {} },
            { titleTemplate: "Case Stock Non Zero", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Disponibile' se 'stock' <> 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock <> 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", brokenCode: "SELEC nome, CASE WHEN stock <> 0 THEN 'Disponibile' ELSE 'Esaurito' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["CASE WHEN stock <> 0 ..."], explanation: "Conferma la presenza di merce a magazzino.", replacements: {} },
            // NEW EXERCISES FOR CASE EASY
            { titleTemplate: "Case Categoria Elettronica", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Elettronica' se 'categoria_id' = 1, altrimenti 'Altro' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN categoria_id = 1 THEN 'Elettronica' ELSE 'Altro' END FROM prodotti", brokenCode: "SELECT nome, CSE WHEN categoria_id = 1 THEN 'Elettronica' ELSE 'Altro' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["CASE WHEN categoria_id = 1 ..."], explanation: "Etichetta specifica per una categoria.", replacements: {} },
            { titleTemplate: "Case Fornitore Principale", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Principale' se 'fornitore_id' = 1, altrimenti 'Secondario' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN fornitore_id = 1 THEN 'Principale' ELSE 'Secondario' END FROM prodotti", brokenCode: "SELECT nome, CASE WHEN fornitore_id = 1 THEN 'Principale' ELSE 'Secondario' FROM prodotti", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN fornitore_id = 1 ..."], explanation: "Distingue il fornitore primario dagli altri.", replacements: {} },
            { titleTemplate: "Case Data Futura", descTemplate: "Seleziona 'id' e un CASE che mostra 'Futuro' se 'data_ordine' > '2024-01-01', altrimenti 'Passato' dalla tabella 'ordini'.", queryTemplate: "SELECT id, CASE WHEN data_ordine > '2024-01-01' THEN 'Futuro' ELSE 'Passato' END FROM ordini", brokenCode: "SELECT id, CASE WHEN data_ordine > '2024-01-01' THAN 'Futuro' ELSE 'Passato' END FROM ordini", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["Confronta con una stringa data.", "CASE WHEN data_ordine > '2024-01-01' ..."], explanation: "Classificazione temporale basata su una data fissa.", replacements: {} },
            { titleTemplate: "Case Voto Sufficienza", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Sufficiente' se 'voto' >= 3, altrimenti 'Insufficiente' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto >= 3 THEN 'Sufficiente' ELSE 'Insufficiente' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto >= 3 THEN 'Sufficiente' 'Insufficiente' END FROM recensioni", debugHint: "Manca la parola chiave ELSE.", hints: ["CASE WHEN voto >= 3 ..."], explanation: "Soglia di accettabilità.", replacements: {} },
            { titleTemplate: "Case Quantità Minima", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Minimo' se 'quantita' < 2, altrimenti 'Standard' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita < 2 THEN 'Minimo' ELSE 'Standard' END FROM ordini", brokenCode: "SELECT quantita, CASE WEN quantita < 2 THEN 'Minimo' ELSE 'Standard' END FROM ordini", debugHint: "Errore di battitura nella parola chiave WHEN.", hints: ["CASE WHEN quantita < 2 ..."], explanation: "Identifica ordini sotto la soglia standard.", replacements: {} },
            { titleTemplate: "Case Nome Inizia con A", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Gruppo A' se 'nome' inizia con 'A' (LIKE 'A%'), altrimenti 'Altri' dalla tabella 'utenti'.", queryTemplate: "SELECT nome, CASE WHEN nome LIKE 'A%' THEN 'Gruppo A' ELSE 'Altri' END FROM utenti", brokenCode: "SELECT nome, WHEN nome LIKE 'A%' THEN 'Gruppo A' ELSE 'Altri' END FROM utenti", debugHint: "Manca la parola chiave CASE all'inizio dell'espressione.", hints: ["Usa LIKE 'A%'.", "CASE WHEN nome LIKE 'A%' ..."], explanation: "Raggruppamento basato sull'iniziale.", replacements: {} },
            { titleTemplate: "Case Email Gmail", descTemplate: "Seleziona 'email' e un CASE che mostra 'Google' se 'email' contiene 'gmail' (LIKE '%gmail%'), altrimenti 'Altro' dalla tabella 'utenti'.", queryTemplate: "SELECT email, CASE WHEN email LIKE '%gmail%' THEN 'Google' ELSE 'Altro' END FROM utenti", brokenCode: "SELECT email, CASE WHEN email LIKE '%gmail%' THEN Google ELSE Altro END FROM utenti", debugHint: "Le stringhe devono essere racchiuse tra apici singoli.", hints: ["Usa LIKE '%gmail%'.", "CASE WHEN email LIKE '%gmail%' ..."], explanation: "Identifica il provider di posta elettronica.", replacements: {} },
            { titleTemplate: "Case Prezzo Pari", descTemplate: "Seleziona 'prezzo' e un CASE che mostra 'Pari' se 'prezzo' è pari (prezzo % 2 = 0), altrimenti 'Dispari' dalla tabella 'prodotti'.", queryTemplate: "SELECT prezzo, CASE WHEN prezzo % 2 = 0 THEN 'Pari' ELSE 'Dispari' END FROM prodotti", brokenCode: "SELECT prezzo, CASE WHEN prezzo % 2 = 0 THEN 'Pari' ELSI 'Dispari' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave ELSE.", hints: ["Usa l'operatore modulo (%).", "CASE WHEN prezzo % 2 = 0 ..."], explanation: "Verifica la parità di un numero.", replacements: {} },
            { titleTemplate: "Case Stock Multiplo 10", descTemplate: "Seleziona 'stock' e un CASE che mostra 'Multiplo 10' se 'stock' è multiplo di 10 (stock % 10 = 0), altrimenti 'No' dalla tabella 'prodotti'.", queryTemplate: "SELECT stock, CASE WHEN stock % 10 = 0 THEN 'Multiplo 10' ELSE 'No' END FROM prodotti", brokenCode: "SELECT stock, CASE WHEN stock % 10 = 0 THEN 'Multiplo 10' ELSE 'No' EN FROM prodotti", debugHint: "Errore di battitura nella parola chiave END.", hints: ["Usa stock % 10 = 0.", "CASE WHEN stock % 10 = 0 ..."], explanation: "Verifica divisibilità per 10.", replacements: {} },
            { titleTemplate: "Case Lunghezza Nome", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Lungo' se la lunghezza di 'nome' > 5 (LENGTH(nome) > 5), altrimenti 'Corto' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 5 THEN 'Lungo' ELSE 'Corto' END FROM prodotti", brokenCode: "SELEC nome, CASE WHEN LENGTH(nome) > 5 THEN 'Lungo' ELSE 'Corto' END FROM prodotti", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Usa la funzione LENGTH().", "CASE WHEN LENGTH(nome) > 5 ..."], explanation: "Logica basata sulla lunghezza del testo.", replacements: {} },
            { titleTemplate: "Case Mese Estivo", descTemplate: "Seleziona 'data_ordine' e un CASE che mostra 'Estate' se il mese di 'data_ordine' è 6, 7 o 8 (MONTH(data_ordine) IN (6,7,8)), altrimenti 'Altro' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (6,7,8) THEN 'Estate' ELSE 'Altro' END FROM ordini", brokenCode: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (6,7,8) 'Estate' ELSE 'Altro' END FROM ordini", debugHint: "Manca la parola chiave THEN.", hints: ["Usa MONTH() e IN.", "CASE WHEN MONTH(data_ordine) IN (6,7,8) ..."], explanation: "Raggruppa mesi specifici in una stagione.", replacements: {} },
            { titleTemplate: "Case Anno Corrente", descTemplate: "Seleziona la colonna 'data_ordine' e un CASE che mostra '2023' se l'anno di 'data_ordine' è 2023, altrimenti 'Altro' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro' END FROM ordini", brokenCode: "SELECT data_ordine, CAES WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro' END FROM ordini", debugHint: "Errore di battitura nella parola chiave CASE.", hints: ["Confronta YEAR(data_ordine) con 2023."], explanation: "Confronto con un anno specifico.", replacements: {} },
            { titleTemplate: "Case Paese Italia", descTemplate: "Seleziona la colonna 'paese' e un CASE che mostra 'Nazionale' se 'paese' è 'Italia', altrimenti 'Estero' dalla tabella 'utenti'.", queryTemplate: "SELECT paese, CASE WHEN paese = 'Italia' THEN 'Nazionale' ELSE 'Estero' END FROM utenti", brokenCode: "SELECT paese, CASE paese = 'Italia' THEN 'Nazionale' ELSE 'Estero' END FROM utenti", debugHint: "Manca la parola chiave WHEN.", hints: ["CASE WHEN paese = 'Italia' ..."], explanation: "Distingue il mercato domestico da quello estero.", replacements: {} },
            { titleTemplate: "Case Corriere DHL", descTemplate: "Seleziona la colonna 'corriere' e un CASE che mostra 'Express' se 'corriere' è 'DHL', altrimenti 'Standard' dalla tabella 'spedizioni'.", queryTemplate: "SELECT corriere, CASE WHEN corriere = 'DHL' THEN 'Express' ELSE 'Standard' END FROM spedizioni", brokenCode: "SELECT corriere, CASE WHEN corriere = 'DHL' THE 'Express' ELSE 'Standard' END FROM spedizioni", debugHint: "Errore di battitura nella parola chiave THEN.", hints: ["CASE WHEN corriere = 'DHL' ..."], explanation: "Etichetta il servizio in base al corriere.", replacements: {} },
            { titleTemplate: "Case Voto Massimo", descTemplate: "Seleziona la colonna 'voto' e un CASE che mostra 'Top' se 'voto' è 5, altrimenti 'Non Top' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto = 5 THEN 'Top' ELSE 'Non Top' END FROM recensioni", brokenCode: "SELECT voto, CASE WHEN voto = 5 THEN 'Top' ELSE 'Non Top' FROM recensioni", debugHint: "Manca la parola chiave END alla fine del blocco CASE.", hints: ["CASE WHEN voto = 5 ..."], explanation: "Identifica il massimo punteggio possibile.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Fasce di Prezzo", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' < 50, 'Medio' se 'prezzo' <= 150, altrimenti 'Lusso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END FROM prodotti", hints: ["Usa più clausole WHEN in sequenza.", "CASE WHEN ... WHEN ... ELSE ... END"], explanation: "Gestisce scenari con più di due possibili esiti.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' FROM prodotti", debugHint: "Manca la parola chiave END." },
            { titleTemplate: "Fasce di Stock", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Esaurito' se 'stock' = 0, 'Basso' se 'stock' <= 10, 'Medio' se 'stock' <= 30, altrimenti 'Alto' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 10 THEN 'Basso' WHEN stock <= 30 THEN 'Medio' ELSE 'Alto' END FROM prodotti", hints: ["Definisci le fasce in ordine crescente.", "CASE WHEN stock = 0 ... WHEN ..."], explanation: "Permette una classificazione granulare dello stato del magazzino.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WEN stock <= 10 THEN 'Basso' WHEN stock <= 30 THEN 'Medio' ELSE 'Alto' END FROM prodotti", debugHint: "Errore di battitura in WHEN." },
            { titleTemplate: "Fasce di Voto", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Basso' se 'voto' <= 2, 'Medio' se 'voto' = 3, altrimenti 'Alto' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni", hints: ["Raggruppa i punteggi in categorie.", "CASE WHEN voto <= 2 ..."], explanation: "Semplifica l'analisi dei feedback raggruppandoli.", replacements: {}, brokenCode: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 'Medio' ELSE 'Alto' END FROM recensioni", debugHint: "Manca la parola chiave THEN." },
            { titleTemplate: "Fasce di Quantità", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Piccolo' se 'quantita' <= 3, 'Medio' se 'quantita' <= 7, altrimenti 'Grande' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END FROM ordini", hints: ["CASE WHEN quantita <= 3 ..."], explanation: "Segmenta gli ordini per dimensione.", replacements: {}, brokenCode: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' 'Grande' END FROM ordini", debugHint: "Manca la parola chiave ELSE." },
            { titleTemplate: "Fasce Prezzo Quattro", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Economico' se 'prezzo' < 30, 'Medio' se 'prezzo' <= 80, 'Costoso' se 'prezzo' <= 150, altrimenti 'Lusso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 30 THEN 'Economico' WHEN prezzo <= 80 THEN 'Medio' WHEN prezzo <= 150 THEN 'Costoso' ELSE 'Lusso' END FROM prodotti", hints: ["Aggiungi un quarto livello di classificazione.", "CASE WHEN ... WHEN ... WHEN ... ELSE ..."], explanation: "Gestisce una logica di classificazione complessa a più livelli.", replacements: {}, brokenCode: "SELECT nome, CSE WHEN prezzo < 30 THEN 'Economico' WHEN prezzo <= 80 THEN 'Medio' WHEN prezzo <= 150 THEN 'Costoso' ELSE 'Lusso' END FROM prodotti", debugHint: "Errore di battitura in CASE." },
            { titleTemplate: "Fasce Stock Quattro", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Esaurito' se 'stock' = 0, 'Basso' se 'stock' <= 5, 'Medio' se 'stock' <= 20, altrimenti 'Alto' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 5 THEN 'Basso' WHEN stock <= 20 THEN 'Medio' ELSE 'Alto' END FROM prodotti", hints: ["CASE WHEN stock = 0 ..."], explanation: "Fornisce una visione dettagliata della disponibilità.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock = 0 THEN 'Esaurito' WHEN stock <= 5 THEN 'Basso' WHEN stock <= 20 THEN 'Medio' ELSE 'Alto' FROM prodotti", debugHint: "Manca la parola chiave END." },
            { titleTemplate: "Fasce Voto Quattro", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Molto Basso' se 'voto' = 1, 'Basso' se 'voto' = 2, 'Medio' se 'voto' = 3, altrimenti 'Alto' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto = 1 THEN 'Molto Basso' WHEN voto = 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni", hints: ["Gestisci ogni voto basso singolarmente.", "CASE WHEN voto = 1 ..."], explanation: "Analisi fine della soddisfazione cliente.", replacements: {}, brokenCode: "SELECT voto, CASE WHEN voto = 1 THEN 'Molto Basso' WHEN voto = 2 THE 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END FROM recensioni", debugHint: "Errore di battitura in THEN." },
            { titleTemplate: "Fasce Quantità Quattro", descTemplate: "Seleziona 'quantita' e un CASE che mostra 'Singolo' se 'quantita' = 1, 'Piccolo' se 'quantita' <= 4, 'Medio' se 'quantita' <= 9, altrimenti 'Grande' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' WHEN quantita <= 4 THEN 'Piccolo' WHEN quantita <= 9 THEN 'Medio' ELSE 'Grande' END FROM ordini", hints: ["CASE WHEN quantita = 1 ..."], explanation: "Segmentazione dettagliata del volume ordini.", replacements: {}, brokenCode: "SELECT quantita, CASE WHEN quantita = 1 THEN 'Singolo' quantita <= 4 THEN 'Piccolo' WHEN quantita <= 9 THEN 'Medio' ELSE 'Grande' END FROM ordini", debugHint: "Manca la parola chiave WHEN." },
            { titleTemplate: "Case con AND", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Premium' se 'prezzo' > 100 AND 'stock' > 10, altrimenti 'Standard' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 10 THEN 'Premium' ELSE 'Standard' END FROM prodotti", hints: ["Usa AND per combinare due condizioni.", "CASE WHEN prezzo > 100 AND stock > 10 ..."], explanation: "CASE supporta operatori logici complessi.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo > 100 stock > 10 THEN 'Premium' ELSE 'Standard' END FROM prodotti", debugHint: "Manca l'operatore AND." },
            { titleTemplate: "Case con OR", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Sconto' se 'prezzo' < 30 OR 'stock' = 0, altrimenti 'Normale' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 30 OR stock = 0 THEN 'Sconto' ELSE 'Normale' END FROM prodotti", hints: ["Usa OR per condizioni alternative.", "CASE WHEN prezzo < 30 OR stock = 0 ..."], explanation: "Basta che una condizione sia vera per attivare il caso.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo < 30 stock = 0 THEN 'Sconto' ELSE 'Normale' END FROM prodotti", debugHint: "Manca l'operatore OR." },
            { titleTemplate: "Case con AND e OR", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Speciale' se ('prezzo' > 100 AND 'stock' > 20) OR 'prezzo' < 20, altrimenti 'Normale' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo > 100 AND stock > 20) OR prezzo < 20 THEN 'Speciale' ELSE 'Normale' END FROM prodotti", hints: ["Usa le parentesi per raggruppare le condizioni.", "CASE WHEN (...) OR ..."], explanation: "Gestisce logiche di business articolate.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN (prezzo > 100 AND stock > 20 OR prezzo < 20 THEN 'Speciale' ELSE 'Normale' END FROM prodotti", debugHint: "Manca una parentesi chiusa." },
            { titleTemplate: "Case con BETWEEN", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Medio' se 'prezzo' BETWEEN 50 AND 100, altrimenti 'Altro' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo BETWEEN 50 AND 100 THEN 'Medio' ELSE 'Altro' END FROM prodotti", hints: ["Usa BETWEEN per intervalli inclusivi.", "CASE WHEN prezzo BETWEEN 50 AND 100 ..."], explanation: "Semplifica la scrittura di condizioni su intervalli numerici.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo BETWEEN 50 100 THEN 'Medio' ELSE 'Altro' END FROM prodotti", debugHint: "Manca la parola chiave AND." },
            { titleTemplate: "Case con IN", descTemplate: "Seleziona 'voto' e un CASE che mostra 'Alto' se 'voto' IN (4, 5), altrimenti 'Basso' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto IN (4, 5) THEN 'Alto' ELSE 'Basso' END FROM recensioni", hints: ["Usa IN per verificare l'appartenenza a una lista.", "CASE WHEN voto IN (4, 5) ..."], explanation: "Utile per confrontare con un insieme discreto di valori.", replacements: {}, brokenCode: "SELECT voto, CASE WHEN voto IN (4, 5 THEN 'Alto' ELSE 'Basso' END FROM recensioni", debugHint: "Manca la parentesi chiusa." },
            { titleTemplate: "Case con LIKE", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Standard' se 'nome' LIKE 'Prod%', altrimenti 'Altro' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN nome LIKE 'Prod%' THEN 'Standard' ELSE 'Altro' END FROM prodotti", hints: ["Usa LIKE per il confronto di stringhe.", "CASE WHEN nome LIKE 'Prod%' ..."], explanation: "Permette logiche condizionali basate su pattern di testo.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN nome LIKE 'Prod% THEN 'Standard' ELSE 'Altro' END FROM prodotti", debugHint: "Manca l'apice di chiusura." },
            { titleTemplate: "Case con IS NULL", descTemplate: "Seleziona un CASE che mostra 'In Attesa' se 'codice_tracking' IS NULL, altrimenti 'Tracciata' dalla tabella 'spedizioni'.", queryTemplate: "SELECT CASE WHEN codice_tracking IS NULL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", hints: ["Verifica se il campo è vuoto.", "CASE WHEN codice_tracking IS NULL ..."], explanation: "Gestisce esplicitamente i dati mancanti.", replacements: {}, brokenCode: "SELECT CASE WHEN codice_tracking IS NUL THEN 'In Attesa' ELSE 'Tracciata' END FROM spedizioni", debugHint: "Errore di battitura in NULL." },
            { titleTemplate: "Case con IS NOT NULL", descTemplate: "Seleziona un CASE che mostra 'Tracciata' se 'codice_tracking' IS NOT NULL, altrimenti 'In Attesa' dalla tabella 'spedizioni'.", queryTemplate: "SELECT CASE WHEN codice_tracking IS NOT NULL THEN 'Tracciata' ELSE 'In Attesa' END FROM spedizioni", hints: ["Usa IS NOT NULL.", "CASE WHEN codice_tracking IS NOT NULL ..."], explanation: "Logica inversa rispetto a IS NULL.", replacements: {}, brokenCode: "SELECT CASE WHEN codice_tracking NOT NULL THEN 'Tracciata' ELSE 'In Attesa' END FROM spedizioni", debugHint: "Manca la parola chiave IS." },
            { titleTemplate: "Case con Alias", descTemplate: "Seleziona 'nome' e un CASE come 'Stato' che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS Stato FROM prodotti", hints: ["Usa AS alla fine del blocco END.", "END AS Stato"], explanation: "Assegna un nome chiaro alla colonna calcolata.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END Stato FROM prodotti", debugHint: "Manca la parola chiave AS." },
            { titleTemplate: "Case con Alias Prezzo", descTemplate: "Seleziona 'nome' e un CASE come 'Fascia' che mostra 'Economico' se 'prezzo' < 50, 'Medio' se 'prezzo' <= 150, altrimenti 'Lusso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END AS Fascia FROM prodotti", hints: ["END AS Fascia"], explanation: "Rende il report finale professionale e leggibile.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo < 50 THEN 'Economico' WHEN prezzo <= 150 THEN 'Medio' ELSE 'Lusso' END Fascia FROM prodotti", debugHint: "Manca la parola chiave AS." },
            { titleTemplate: "Case con Alias Voto", descTemplate: "Seleziona 'voto' e un CASE come 'Valutazione' che mostra 'Basso' se 'voto' <= 2, 'Medio' se 'voto' = 3, altrimenti 'Alto' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END AS Valutazione FROM recensioni", hints: ["END AS Valutazione"], explanation: "Chiarezza nell'output della query.", replacements: {}, brokenCode: "SELECT voto, CASE WHEN voto <= 2 THEN 'Basso' WHEN voto = 3 THEN 'Medio' ELSE 'Alto' END Valutazione FROM recensioni", debugHint: "Manca la parola chiave AS." },
            { titleTemplate: "Case con Alias Quantità", descTemplate: "Seleziona 'quantita' e un CASE come 'Dimensione' che mostra 'Piccolo' se 'quantita' <= 3, 'Medio' se 'quantita' <= 7, altrimenti 'Grande' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END AS Dimensione FROM ordini", hints: ["END AS Dimensione"], explanation: "Migliora la presentazione dei dati.", replacements: {}, brokenCode: "SELECT quantita, CASE WHEN quantita <= 3 THEN 'Piccolo' WHEN quantita <= 7 THEN 'Medio' ELSE 'Grande' END Dimensione FROM ordini", debugHint: "Manca la parola chiave AS." },
            { titleTemplate: "Case con Calcolo", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Alto' se (prezzo * stock) > 1000, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti", hints: ["Puoi fare calcoli dentro la condizione WHEN.", "CASE WHEN (prezzo * stock) > 1000 ..."], explanation: "Valuta espressioni matematiche dinamicamente.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN (prezzo stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Manca l'operatore di moltiplicazione." },
            { titleTemplate: "Case con Calcolo Complesso", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Molto Alto' se (prezzo * stock) > 2000, 'Alto' se (prezzo * stock) > 1000, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo * stock) > 2000 THEN 'Molto Alto' WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti", hints: ["Ripeti il calcolo nelle varie clausole WHEN.", "CASE WHEN (prezzo * stock) > 2000 ..."], explanation: "Segmentazione basata su valore calcolato.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN (prezzo * stock > 2000 THEN 'Molto Alto' WHEN (prezzo * stock) > 1000 THEN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Manca la parentesi chiusa." },
            { titleTemplate: "Case con Funzione", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Nome Lungo' se LENGTH(nome) > 10, altrimenti 'Nome Corto' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 10 THEN 'Nome Lungo' ELSE 'Nome Corto' END FROM prodotti", hints: ["Usa LENGTH(nome).", "CASE WHEN LENGTH(nome) > 10 ..."], explanation: "Combina funzioni SQL con logica condizionale.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN LENGHT(nome) > 10 THEN 'Nome Lungo' ELSE 'Nome Corto' END FROM prodotti", debugHint: "Errore di battitura in LENGTH." },
            { titleTemplate: "Case con Funzione Data", descTemplate: "Seleziona 'data_ordine' e un CASE che mostra '2023' se YEAR(data_ordine) = 2023, altrimenti 'Altro Anno' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini", hints: ["Usa YEAR(data_ordine).", "CASE WHEN YEAR(data_ordine) = 2023 ..."], explanation: "Logica condizionale applicata alle date.", replacements: {}, brokenCode: "SELECT data_ordine, CASE WHEN YEAR(data_ordine = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini", debugHint: "Manca la parentesi chiusa di YEAR." },
            { titleTemplate: "Case con JOIN", descTemplate: "Seleziona 'prodotti.nome' e un CASE che mostra 'Elettronica' se 'categorie.nome' = 'Elettronica', altrimenti 'Altro' dalla tabella 'prodotti' in JOIN con 'categorie'.", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Elettronica' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Fai una JOIN con la tabella categorie.", "CASE WHEN categorie.nome = ..."], explanation: "Applica condizioni su dati provenienti da tabelle collegate.", replacements: {}, brokenCode: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Elettronica' ELSE 'Altro' END FROM prodotti JOIN categorie prodotti.categoria_id = categorie.id", debugHint: "Manca la parola chiave ON." },
            { titleTemplate: "Case con WHERE", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Disponibile' se 'stock' > 10, altrimenti 'Limitato' dalla tabella 'prodotti', filtrando per 'prezzo' > 50.", queryTemplate: "SELECT nome, CASE WHEN stock > 10 THEN 'Disponibile' ELSE 'Limitato' END FROM prodotti WHERE prezzo > 50", hints: ["Usa WHERE per filtrare le righe prima del CASE.", "WHERE prezzo > 50"], explanation: "Combina filtro righe (WHERE) con logica colonne (CASE).", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock > 10 THEN 'Disponibile' ELSE 'Limitato' END FROM prodotti WHERE prezzo 50", debugHint: "Manca l'operatore >." },
            { titleTemplate: "Case con ORDER BY", descTemplate: "Seleziona 'nome' e un CASE come 'stato' che mostra 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito' dalla tabella 'prodotti', ordinando per il CASE (Disponibile prima).", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END", hints: ["Usa un CASE dentro ORDER BY per definire l'ordine.", "ORDER BY CASE ... END"], explanation: "Permette ordinamenti non alfabetici basati su logica custom.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1", debugHint: "Manca la parola chiave END nel secondo CASE." },
            { titleTemplate: "Case Complesso Finale", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Premium Disponibile' se 'prezzo' > 100 AND 'stock' > 20, 'Premium Limitato' se 'prezzo' > 100, 'Economico Disponibile' se 'stock' > 20, altrimenti 'Standard' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END FROM prodotti", hints: ["L'ordine delle condizioni WHEN è importante: la prima vera vince.", "CASE WHEN prezzo > 100 AND stock > 20 ..."], explanation: "Esempio di logica decisionale complessa con priorità.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END AS tipo FROM prodotti ORDER BY CASE WHEN prezzo > 100 AND stock > 20 THEN 0 WHEN prezzo > 100 THEN 1 WHEN stock > 20 THEN 2 ELSE 3 END prezzo DESC", debugHint: "Manca la virgola prima di prezzo DESC." },
            { titleTemplate: "Case con Alias Stock", descTemplate: "Seleziona 'nome' e un CASE come 'Livello' che mostra 'Alto' se 'stock' > 20, 'Medio' se 'stock' > 10, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock > 20 THEN 'Alto' WHEN stock > 10 THEN 'Medio' ELSE 'Basso' END AS Livello FROM prodotti", hints: ["Usa AS Livello alla fine.", "CASE ... END AS Livello"], explanation: "Crea una colonna calcolata con un nome specifico.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock > 20 THEN 'Alto' WHEN stock > 10 THEN 'Medio' ELSE 'Basso' END Livello FROM prodotti", debugHint: "Manca la parola chiave AS." },
            { titleTemplate: "Case con Alias Quantità", descTemplate: "Seleziona 'quantita' e un CASE come 'Taglia' che mostra 'Grande' se 'quantita' > 7, 'Media' se 'quantita' > 3, altrimenti 'Piccola' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita > 7 THEN 'Grande' WHEN quantita > 3 THEN 'Media' ELSE 'Piccola' END AS Taglia FROM ordini", hints: ["Usa AS Taglia.", "CASE ... END AS Taglia"], explanation: "Rende il risultato immediatamente comprensibile.", replacements: {}, brokenCode: "SELECT quantita, CASE WHEN quantita > 7 THEN 'Grande' WHEN quantita > 3 THEN 'Media' ELSE 'Piccola' END Taglia FROM ordini", debugHint: "Manca la parola chiave AS." },
            // NEW EXERCISES FOR CASE MEDIUM
            { titleTemplate: "Case Stagioni", descTemplate: "Seleziona la colonna 'data_ordine' e un CASE che mostra 'Inverno' per mesi 12,1,2, 'Primavera' per 3-5, 'Estate' per 6-8, altrimenti 'Autunno' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (12,1,2) THEN 'Inverno' WHEN MONTH(data_ordine) BETWEEN 3 AND 5 THEN 'Primavera' WHEN MONTH(data_ordine) BETWEEN 6 AND 8 THEN 'Estate' ELSE 'Autunno' END FROM ordini", hints: ["CASE con range mesi"], explanation: "Logica stagionale complessa.", replacements: {}, brokenCode: "SELECT data_ordine, CASE WHEN MONTH(data_ordine) IN (12,1,2) THEN 'Inverno' WHEN MONTH(data_ordine) BETWEEN 3 AND 5 'Primavera' WHEN MONTH(data_ordine) BETWEEN 6 AND 8 THEN 'Estate' ELSE 'Autunno' END FROM ordini", debugHint: "Manca la parola chiave THEN." },
            { titleTemplate: "Case Fasce Spesa", descTemplate: "Seleziona la colonna 'quantita' e un CASE che mostra 'Pochi' se 'quantita' <= 2, 'Medi' se 'quantita' <= 5, altrimenti 'Tanti' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, CASE WHEN quantita <= 2 THEN 'Pochi' WHEN quantita <= 5 THEN 'Medi' ELSE 'Tanti' END FROM ordini", hints: ["CASE multiplo su quantità"], explanation: "Segmentazione ordini.", replacements: {}, brokenCode: "SELECT quantita, CASE WHEN quantita <= 2 THEN 'Pochi' WHEN quantita <= 5 THEN 'Medi' 'Tanti' END FROM ordini", debugHint: "Manca la parola chiave ELSE." },
            { titleTemplate: "Case Qualità Prodotto", descTemplate: "Seleziona la colonna 'nome' e un CASE che mostra 'Top Seller' se 'prezzo' > 100 AND 'stock' > 50, 'Economico' se 'prezzo' < 20, altrimenti 'Standard' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 50 THEN 'Top Seller' WHEN prezzo < 20 THEN 'Economico' ELSE 'Standard' END FROM prodotti", hints: ["CASE con AND e condizioni miste"], explanation: "Logica business complessa.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN prezzo > 100 stock > 50 THEN 'Top Seller' WHEN prezzo < 20 THEN 'Economico' ELSE 'Standard' END FROM prodotti", debugHint: "Manca l'operatore AND." },
            { titleTemplate: "Case Urgenza Spedizione", descTemplate: "Seleziona la colonna 'corriere' e un CASE che mostra 'Urgente' se 'corriere' è 'DHL' o 'FedEx' (IN ('DHL', 'FedEx')), altrimenti 'Normale' dalla tabella 'spedizioni'.", queryTemplate: "SELECT corriere, CASE WHEN corriere IN ('DHL', 'FedEx') THEN 'Urgente' ELSE 'Normale' END FROM spedizioni", hints: ["CASE con IN"], explanation: "Raggruppamento valori.", replacements: {}, brokenCode: "SELECT corriere, CASE WHEN corriere IN ('DHL', 'FedEx') THEN 'Urgente' ELSE 'Normale' END FROM spedizioni", debugHint: "" },
            { titleTemplate: "Case Tipo Utente", descTemplate: "Seleziona la colonna 'nome' e un CASE che mostra 'VIP' se 'premium' è TRUE, altrimenti 'Standard' dalla tabella 'utenti'.", queryTemplate: "SELECT nome, CASE WHEN premium = TRUE THEN 'VIP' ELSE 'Standard' END FROM utenti", hints: ["Semplificazione logica utente"], explanation: "Segmentazione clientela.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN premium = TREU THEN 'VIP' ELSE 'Standard' END FROM utenti", debugHint: "Errore di battitura in TRUE." },
            { titleTemplate: "Case Lunghezza Recensione", descTemplate: "Seleziona la colonna 'commento' e un CASE che mostra 'Dettagliata' se la lunghezza di 'commento' > 50 (LENGTH(commento) > 50), altrimenti 'Breve' dalla tabella 'recensioni'.", queryTemplate: "SELECT commento, CASE WHEN LENGTH(commento) > 50 THEN 'Dettagliata' ELSE 'Breve' END FROM recensioni", hints: ["LENGTH > 50"], explanation: "Analisi testo.", replacements: {}, brokenCode: "SELECT commento, CASE WHEN LENGHT(commento) > 50 THEN 'Dettagliata' ELSE 'Breve' END FROM recensioni", debugHint: "Errore di battitura in LENGTH." },
            { titleTemplate: "Case Sconto Applicabile", descTemplate: "Seleziona la colonna 'prezzo' e un CASE come 'Sconto' che mostra '20%' se 'prezzo' > 100, '10%' se 'prezzo' > 50, altrimenti '0%' dalla tabella 'prodotti'.", queryTemplate: "SELECT prezzo, CASE WHEN prezzo > 100 THEN '20%' WHEN prezzo > 50 THEN '10%' ELSE '0%' END as Sconto FROM prodotti", hints: ["CASE per calcolo logico"], explanation: "Logica commerciale.", replacements: {}, brokenCode: "SELECT prezzo, CASE WHEN prezzo > 100 THEN '20%' WHEN prezzo > 50 THEN '10%' ELSE '0%' END Sconto FROM prodotti", debugHint: "Manca la parola chiave AS." },
            { titleTemplate: "Case Tempo Spedizione", descTemplate: "Seleziona la colonna 'id' e un CASE che mostra 'Lento' se la differenza in giorni tra 'data_spedizione' e 'data_ordine' (DATEDIFF) > 5, 'Veloce' se < 2, altrimenti 'Normale' unendo 'ordini' e 'spedizioni'.", queryTemplate: "SELECT ordini.id, CASE WHEN DATEDIFF(day, data_ordine, data_spedizione) > 5 THEN 'Lento' WHEN DATEDIFF(day, data_ordine, data_spedizione) < 2 THEN 'Veloce' ELSE 'Normale' END FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", hints: ["CASE su DATEDIFF"], explanation: "KPI logistico.", replacements: {}, brokenCode: "SELECT ordini.id, CASE WHEN DATEDIFF(day data_ordine, data_spedizione) > 5 THEN 'Lento' WHEN DATEDIFF(day, data_ordine, data_spedizione) < 2 THEN 'Veloce' ELSE 'Normale' END FROM ordini JOIN spedizioni ON ordini.id = spedizioni.ordine_id", debugHint: "Manca la virgola tra gli argomenti di DATEDIFF." },
            { titleTemplate: "Case Priorità Ordine", descTemplate: "Seleziona 'ordini.id' e un CASE che mostra 'Alta' se 'ordini.quantita' > 10 OR 'utenti.premium' è TRUE, altrimenti 'Bassa' dalla tabella 'ordini' JOIN 'utenti'.", queryTemplate: "SELECT ordini.id, CASE WHEN ordini.quantita > 10 OR utenti.premium = TRUE THEN 'Alta' ELSE 'Bassa' END FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", hints: ["CASE con OR e JOIN"], explanation: "Prioritizzazione.", replacements: {}, brokenCode: "SELECT ordini.id, CASE WHEN ordini.quantita > 10 utenti.premium = TRUE THEN 'Alta' ELSE 'Bassa' END FROM ordini JOIN utenti ON ordini.utente_id = utenti.id", debugHint: "Manca l'operatore OR." },
            { titleTemplate: "Case Stato Magazzino", descTemplate: "Seleziona la colonna 'nome' e una colonna calcolata 'StatoMagazzino' che mostra 'Critico' se 'stock' = 0, 'Riordinare' se 'stock' < 10, 'Eccesso' se 'stock' > 100, altrimenti 'Ok' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN stock = 0 THEN 'Critico' WHEN stock < 10 THEN 'Riordinare' WHEN stock > 100 THEN 'Eccesso' ELSE 'Ok' END FROM prodotti", hints: ["CASE multiplo stock"], explanation: "Gestione inventario.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN stock = 0 THEN 'Critico' stock < 10 THEN 'Riordinare' WHEN stock > 100 THEN 'Eccesso' ELSE 'Ok' END FROM prodotti", debugHint: "Manca la parola chiave WHEN." },
            { titleTemplate: "Case Valutazione Fornitore", descTemplate: "Seleziona la colonna 'azienda' e una colonna calcolata 'Provenienza' che mostra 'Locale' se 'nazione' = 'Italia', 'UE' se 'nazione' è tra 'Francia', 'Germania', 'Spagna', altrimenti 'Extra-UE' dalla tabella 'fornitori'.", queryTemplate: "SELECT azienda, CASE WHEN nazione = 'Italia' THEN 'Locale' WHEN nazione IN ('Francia', 'Germania', 'Spagna') THEN 'UE' ELSE 'Extra-UE' END FROM fornitori", hints: ["CASE geografico"], explanation: "Logica supply chain.", replacements: {}, brokenCode: "SELECT azienda, CASE WHEN nazione = 'Italia' THEN 'Locale' WHEN nazione IN ('Francia', 'Germania', 'Spagna' THEN 'UE' ELSE 'Extra-UE' END FROM fornitori", debugHint: "Manca la parentesi chiusa." },
            { titleTemplate: "Case Fascia Oraria (Simulato)", descTemplate: "Seleziona la colonna 'data_ordine' e una colonna calcolata 'FasciaOraria' che mostra 'Mattina' se l'ora di 'data_ordine' è minore di 12, 'Pomeriggio' se è minore di 18, altrimenti 'Sera' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN HOUR(data_ordine) < 12 THEN 'Mattina' WHEN HOUR(data_ordine) < 18 THEN 'Pomeriggio' ELSE 'Sera' END FROM ordini", hints: ["HOUR()"], explanation: "Analisi temporale.", replacements: {}, brokenCode: "SELECT data_ordine, CASE WHEN HOR(data_ordine) < 12 THEN 'Mattina' WHEN HOUR(data_ordine) < 18 THEN 'Pomeriggio' ELSE 'Sera' END FROM ordini", debugHint: "Errore di battitura in HOUR." },
            { titleTemplate: "Case Tipo Prodotto", descTemplate: "Seleziona la colonna 'nome' e una colonna calcolata 'TipoProdotto' che mostra 'Professional' se 'nome' contiene 'Pro' (LIKE '%Pro%'), 'Base' se contiene 'Lite' (LIKE '%Lite%'), altrimenti 'Standard' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN nome LIKE '%Pro%' THEN 'Professional' WHEN nome LIKE '%Lite%' THEN 'Base' ELSE 'Standard' END FROM prodotti", hints: ["LIKE multiplo"], explanation: "Categorizzazione stringa.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN nome LIKE '%Pro% THEN 'Professional' WHEN nome LIKE '%Lite%' THEN 'Base' ELSE 'Standard' END FROM prodotti", debugHint: "Manca l'apice di chiusura." },
            { titleTemplate: "Case Margine (Simulato)", descTemplate: "Seleziona la colonna 'nome' e una colonna calcolata 'Margine' che mostra 'Alto' se il margine calcolato (prezzo - (prezzo * 0.5)) è maggiore di 50, altrimenti 'Basso' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo - (prezzo * 0.5)) > 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", hints: ["Calcolo aritmetico"], explanation: "Analisi finanziaria.", replacements: {}, brokenCode: "SELECT nome, CASE WHEN (prezzo - (prezzo * 0.5) > 50 THEN 'Alto' ELSE 'Basso' END FROM prodotti", debugHint: "Manca la parentesi chiusa." },
            { titleTemplate: "Case Disponibilità Immediata", descTemplate: "Seleziona 'prodotti.nome' e una colonna calcolata 'Disponibilita' che mostra 'Immediata' se 'prodotti.stock' > 0 E 'fornitori.nazione' = 'Italia', altrimenti 'Attesa' dalla tabella 'prodotti' in JOIN con 'fornitori'.", queryTemplate: "SELECT prodotti.nome, CASE WHEN prodotti.stock > 0 AND fornitori.nazione = 'Italia' THEN 'Immediata' ELSE 'Attesa' END FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", hints: ["AND con JOIN"], explanation: "Logistica avanzata.", replacements: {}, brokenCode: "SELECT prodotti.nome, CASE WHEN prodotti.stock > 0 fornitori.nazione = 'Italia' THEN 'Immediata' ELSE 'Attesa' END FROM prodotti JOIN fornitori ON prodotti.fornitore_id = fornitori.id", debugHint: "Manca l'operatore AND." }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Case con ORDER BY", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con 'stock' = 0 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Usa un CASE nel blocco ORDER BY.", "ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC"], explanation: "Permette di portare in cima righe specifiche basandosi su una condizione.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Prezzo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con 'prezzo' > 100 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' crescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN prezzo > 100 THEN 0 ELSE 1 END, prezzo ASC", hints: ["Assegna 0 ai costosi per metterli prima.", "ORDER BY CASE WHEN prezzo > 100 ..."], explanation: "Ordinamento a due livelli: logico e poi numerico.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Voto", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' e ordina i risultati mettendo prima quelle con 'voto' >= 4 (usando un CASE che restituisce 0 o 1), poi per 'voto' decrescente.", queryTemplate: "SELECT * FROM recensioni ORDER BY CASE WHEN voto >= 4 THEN 0 ELSE 1 END, voto DESC", hints: ["Metti in evidenza i voti alti.", "ORDER BY CASE WHEN voto >= 4 ..."], explanation: "Utile per dashboard che evidenziano i top performer.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Quantità", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' e ordina i risultati mettendo prima quelli con 'quantita' > 5 (usando un CASE che restituisce 0 o 1), poi per 'quantita' crescente.", queryTemplate: "SELECT * FROM ordini ORDER BY CASE WHEN quantita > 5 THEN 0 ELSE 1 END, quantita ASC", hints: ["Separa gli ordini grandi dagli altri.", "ORDER BY CASE WHEN quantita > 5 ..."], explanation: "Segmentazione visiva degli ordini.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Multiplo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con 'stock' = 0 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Combina logica booleana e ordinamento standard.", "ORDER BY CASE ... END, prezzo DESC"], explanation: "Controllo fine sulla presentazione dei dati.", replacements: {} },
            { titleTemplate: "Case con WHERE", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove un CASE (che restituisce 'Disponibile' se 'stock' > 0, altrimenti 'Esaurito') è uguale a 'Disponibile'.", queryTemplate: "SELECT * FROM prodotti WHERE CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END = 'Disponibile'", hints: ["Puoi usare CASE dentro WHERE.", "WHERE CASE ... END = 'Disponibile'"], explanation: "Filtra basandosi sul risultato di una logica condizionale.", replacements: {} },
            { titleTemplate: "Case con WHERE Prezzo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove un CASE (che restituisce 'Costoso' se 'prezzo' > 100, altrimenti 'Economico') è uguale a 'Costoso'.", queryTemplate: "SELECT * FROM prodotti WHERE CASE WHEN prezzo > 100 THEN 'Costoso' ELSE 'Economico' END = 'Costoso'", hints: ["Confronta il risultato del CASE.", "WHERE CASE ... END = 'Costoso'"], explanation: "Selezione basata su classificazione dinamica.", replacements: {} },
            { titleTemplate: "Case con JOIN", descTemplate: "Classifica i prodotti in base alla categoria ('Elettronica' -> 'Tech', altro -> 'Altro').", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Tech' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Usa CASE sui campi della tabella in join.", "CASE WHEN categorie.nome = ..."], explanation: "Arricchimento dati tramite relazioni.", replacements: {} },
            { titleTemplate: "Case con Aggregazione", descTemplate: "Classifica le categorie come 'Popolari' se hanno più di 5 prodotti, altrimenti 'Normali'.", queryTemplate: "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END FROM prodotti GROUP BY categoria_id", hints: ["Usa funzioni di aggregazione nel CASE.", "CASE WHEN COUNT(*) > 5 ..."], explanation: "Etichettatura basata su metriche aggregate.", replacements: {} },
            { titleTemplate: "Case con HAVING", descTemplate: "Filtro su Gruppi Calcolati: mostra solo le categorie classificate come 'Popolari' (più di 5 prodotti).", queryTemplate: "SELECT categoria_id, COUNT(*) FROM prodotti GROUP BY categoria_id HAVING CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END = 'Popolare'", hints: ["Usa CASE dentro HAVING.", "HAVING CASE ... END = 'Popolare'"], explanation: "Filtro post-aggregazione basato su logica condizionale.", replacements: {} },
            { titleTemplate: "Case Nidificato", descTemplate: "Logica a Cascata: classifica 'Premium Disponibile' (prezzo > 100 e stock > 20), 'Premium Limitato' (prezzo > 100), o 'Standard'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 THEN CASE WHEN stock > 20 THEN 'Premium Disponibile' ELSE 'Premium Limitato' END ELSE 'Standard' END FROM prodotti", hints: ["Puoi mettere un CASE dentro un altro CASE.", "CASE WHEN ... THEN CASE ... END ELSE ... END"], explanation: "Gestisce alberi decisionali complessi.", replacements: {} },
            { titleTemplate: "Case con Subquery", descTemplate: "Confronto Dinamico: classifica i prodotti come 'Sopra Media' o 'Sotto Media' rispetto al prezzo medio globale.", queryTemplate: "SELECT nome, CASE WHEN prezzo > (SELECT AVG(prezzo) FROM prodotti) THEN 'Sopra Media' ELSE 'Sotto Media' END FROM prodotti", hints: ["Usa una subquery nel confronto.", "CASE WHEN prezzo > (SELECT AVG(prezzo)...)"], explanation: "Classificazione relativa al contesto globale.", replacements: {} },
            { titleTemplate: "Case con Calcolo Complesso", descTemplate: "Valutazione Asset: classifica il valore totale dello stock (prezzo * stock) in 'Alto', 'Medio', o 'Basso'.", queryTemplate: "SELECT nome, CASE WHEN (prezzo * stock) > 2000 THEN 'Alto' WHEN (prezzo * stock) > 1000 THEN 'Medio' ELSE 'Basso' END FROM prodotti", hints: ["Valuta espressioni matematiche.", "CASE WHEN (prezzo * stock) > 2000 ..."], explanation: "KPI calcolati al volo.", replacements: {} },
            { titleTemplate: "Case con Funzioni Multiple", descTemplate: "Analisi Avanzata: classifica come 'Lungo Costoso' se nome > 10 caratteri E prezzo > 50, altrimenti 'Altro'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 10 AND prezzo > 50 THEN 'Lungo Costoso' ELSE 'Altro' END FROM prodotti", hints: ["Combina funzioni e operatori logici.", "CASE WHEN LENGTH(nome) > 10 AND ..."], explanation: "Regole di business multi-fattoriali.", replacements: {} },
            { titleTemplate: "Case con ORDER BY Complesso", descTemplate: "Ordinamento Misto: prima gli 'Esauriti', poi gli altri ordinati per valore totale dello stock decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, (prezzo * stock) DESC", hints: ["Combina stato booleano e calcolo numerico.", "ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, (prezzo * stock) DESC"], explanation: "Ordinamento gerarchico avanzato.", replacements: {} },
            { titleTemplate: "Case con WHERE e ORDER BY", descTemplate: "Report Filtrato e Ordinato: prodotti > 50€, classificati per disponibilità e ordinati per stato.", queryTemplate: "SELECT nome, CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato FROM prodotti WHERE prezzo > 50 ORDER BY CASE WHEN stock > 0 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Filtra, calcola, e poi ordina.", "WHERE ... ORDER BY CASE ..."], explanation: "Pipeline completa di manipolazione dati.", replacements: {} },
            { titleTemplate: "Case con JOIN e ORDER BY", descTemplate: "Seleziona 'prodotti.nome' e un CASE come 'tipo' che mostra 'Tech' se 'categorie.nome' = 'Elettronica', altrimenti 'Altro', ordinando per il CASE e poi per 'prodotti.prezzo' decrescente.", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' THEN 'Tech' ELSE 'Altro' END AS tipo FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY CASE WHEN categorie.nome = 'Elettronica' THEN 0 ELSE 1 END, prodotti.prezzo DESC", hints: ["Usa campi di tabelle collegate per l'ordinamento.", "ORDER BY CASE WHEN categorie.nome ..."], explanation: "Ordinamento basato su logica relazionale.", replacements: {} },
            { titleTemplate: "Case con Aggregazione e HAVING", descTemplate: "Seleziona 'categoria_id' e un CASE come 'tipo' che mostra 'Popolare' se COUNT(*) > 5, altrimenti 'Normale', raggruppando per 'categoria_id' e filtrando (HAVING) dove il CASE è 'Popolare'.", queryTemplate: "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END AS tipo FROM prodotti GROUP BY categoria_id HAVING CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END = 'Popolare'", hints: ["Filtra i risultati dell'aggregazione.", "HAVING CASE ... END = 'Popolare'"], explanation: "Selezione gruppi basata su etichetta calcolata.", replacements: {} },
            { titleTemplate: "Case Complesso Finale", descTemplate: "Seleziona 'nome' e un CASE che classifica i prodotti in base a 'prezzo' e 'stock', ordinando i risultati in base alla stessa logica di classificazione.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 AND stock > 20 THEN 'Premium Disponibile' WHEN prezzo > 100 THEN 'Premium Limitato' WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END AS tipo FROM prodotti ORDER BY CASE WHEN prezzo > 100 AND stock > 20 THEN 0 WHEN prezzo > 100 THEN 1 WHEN stock > 20 THEN 2 ELSE 3 END, prezzo DESC", hints: ["Replica la logica di classificazione nell'ordinamento.", "ORDER BY CASE ... END"], explanation: "Massimo controllo su classificazione e presentazione.", replacements: {} },
            { titleTemplate: "Case in ORDER BY con Calcolo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' e ordina i risultati mettendo prima quelli con (prezzo * stock) > 1000 (usando un CASE che restituisce 0 o 1), poi per 'prezzo' decrescente.", queryTemplate: "SELECT * FROM prodotti ORDER BY CASE WHEN (prezzo * stock) > 1000 THEN 0 ELSE 1 END, prezzo DESC", hints: ["Ordina su un valore calcolato.", "ORDER BY CASE WHEN (prezzo * stock) > 1000 ..."], explanation: "Priorità basata su metriche derivate.", replacements: {} },
            { titleTemplate: "Case con WHERE Voto", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove un CASE (che restituisce 'Alta' se 'voto' >= 4, altrimenti 'Bassa') è uguale a 'Alta'.", queryTemplate: "SELECT * FROM recensioni WHERE CASE WHEN voto >= 4 THEN 'Alta' ELSE 'Bassa' END = 'Alta'", hints: ["Filtra per qualità calcolata.", "WHERE CASE ... END = 'Alta'"], explanation: "Filtro avanzato su dati derivati.", replacements: {} },
            { titleTemplate: "Case Nidificato Complesso", descTemplate: "Seleziona 'nome' e un CASE nidificato che classifica i prodotti in base a 'prezzo' (> 100) e poi 'stock' (> 20) in 4 categorie.", queryTemplate: "SELECT nome, CASE WHEN prezzo > 100 THEN CASE WHEN stock > 20 THEN 'Premium Disponibile' ELSE 'Premium Limitato' END ELSE CASE WHEN stock > 20 THEN 'Economico Disponibile' ELSE 'Standard' END END FROM prodotti", hints: ["Struttura decisionale ramificata.", "CASE ... THEN CASE ... END ELSE CASE ... END END"], explanation: "Logica condizionale profondamente nidificata.", replacements: {} },
            { titleTemplate: "Case con Subquery Media", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Sopra Media' se 'prezzo' > (media globale dei prezzi), altrimenti 'Sotto Media' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > (SELECT AVG(prezzo) FROM prodotti) THEN 'Sopra Media' ELSE 'Sotto Media' END FROM prodotti", hints: ["Confronta con la media calcolata.", "CASE WHEN prezzo > (SELECT AVG(prezzo)...)"], explanation: "Analisi relativa delle performance.", replacements: {} },
            { titleTemplate: "Case con Subquery Massimo", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Più Costoso' se 'prezzo' è uguale al prezzo massimo, altrimenti 'Altro' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo = (SELECT MAX(prezzo) FROM prodotti) THEN 'Più Costoso' ELSE 'Altro' END FROM prodotti", hints: ["Trova il massimo e confronta.", "CASE WHEN prezzo = (SELECT MAX(prezzo)...)"], explanation: "Evidenziazione di outlier specifici.", replacements: {} },
            { titleTemplate: "Case con Funzione LENGTH", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Nome Lungo' se LENGTH(nome) > 15, 'Nome Medio' se LENGTH(nome) > 10, altrimenti 'Nome Corto' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN LENGTH(nome) > 15 THEN 'Nome Lungo' WHEN LENGTH(nome) > 10 THEN 'Nome Medio' ELSE 'Nome Corto' END FROM prodotti", hints: ["Segmenta in base alla lunghezza.", "CASE WHEN LENGTH(nome) > 15 ..."], explanation: "Categorizzazione basata su proprietà delle stringhe.", replacements: {} },
            { titleTemplate: "Case con Funzione YEAR", descTemplate: "Seleziona 'data_ordine' e un CASE che mostra '2024' se YEAR(data_ordine) = 2024, '2023' se YEAR(data_ordine) = 2023, altrimenti 'Altro Anno' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN YEAR(data_ordine) = 2024 THEN '2024' WHEN YEAR(data_ordine) = 2023 THEN '2023' ELSE 'Altro Anno' END FROM ordini", hints: ["Estrai l'anno e classifica.", "CASE WHEN YEAR(data_ordine) = ..."], explanation: "Raggruppamento temporale esplicito.", replacements: {} },
            { titleTemplate: "Case con JOIN e WHERE", descTemplate: "Seleziona 'prodotti.nome' e un CASE che mostra 'Tech Costoso' se 'categorie.nome' = 'Elettronica' AND 'prodotti.prezzo' > 100, altrimenti 'Altro' dalla tabella 'prodotti' JOIN 'categorie'.", queryTemplate: "SELECT prodotti.nome, CASE WHEN categorie.nome = 'Elettronica' AND prodotti.prezzo > 100 THEN 'Tech Costoso' ELSE 'Altro' END FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id", hints: ["Combina condizioni su tabelle diverse.", "CASE WHEN categorie.nome = ... AND prodotti.prezzo ..."], explanation: "Logica condizionale multi-tabella.", replacements: {} },
            { titleTemplate: "Case con Aggregazione e WHERE", descTemplate: "Seleziona 'categoria_id' e un CASE come 'tipo' che mostra 'Popolare' se COUNT(*) > 5, altrimenti 'Normale', raggruppando per 'categoria_id' e filtrando (HAVING) dove AVG(prezzo) > 50.", queryTemplate: "SELECT categoria_id, CASE WHEN COUNT(*) > 5 THEN 'Popolare' ELSE 'Normale' END AS tipo FROM prodotti GROUP BY categoria_id HAVING AVG(prezzo) > 50", hints: ["Classifica e poi filtra il gruppo.", "HAVING AVG(prezzo) > 50"], explanation: "Combinazione di classificazione e filtro aggregato.", replacements: {} },
            // NEW EXERCISES FOR CASE HARD
            { titleTemplate: "Case in Aggregazione", descTemplate: "Seleziona un CASE che classifica lo 'stock' (> 0 'Disponibile', altrimenti 'Esaurito') e conta il numero di prodotti per ogni gruppo, raggruppando per il CASE.", queryTemplate: "SELECT CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END AS stato, COUNT(*) FROM prodotti GROUP BY CASE WHEN stock > 0 THEN 'Disponibile' ELSE 'Esaurito' END", hints: ["Usa CASE sia nella SELECT che nel GROUP BY.", "GROUP BY CASE ... END"], explanation: "Raggruppa i dati basandosi su una categoria calcolata.", replacements: {} },
            { titleTemplate: "Case in Aggregazione Voto", descTemplate: "Seleziona un CASE che classifica il 'voto' (>= 4 'Positivo', altrimenti 'Negativo') e conta il numero di recensioni per ogni gruppo, raggruppando per il CASE.", queryTemplate: "SELECT CASE WHEN voto >= 4 THEN 'Positivo' ELSE 'Negativo' END AS sentiment, COUNT(*) FROM recensioni GROUP BY CASE WHEN voto >= 4 THEN 'Positivo' ELSE 'Negativo' END", hints: ["Raggruppa per sentiment calcolato.", "GROUP BY CASE ... END"], explanation: "Analisi del sentiment dei feedback.", replacements: {} },
            { titleTemplate: "Case in ORDER BY Custom", descTemplate: "Seleziona 'prodotti.nome' e 'categorie.nome', ordinando per un CASE che assegna 1 a 'Elettronica', 2 a 'Abbigliamento', e 3 agli altri.", queryTemplate: "SELECT prodotti.nome, categorie.nome FROM prodotti JOIN categorie ON prodotti.categoria_id = categorie.id ORDER BY CASE WHEN categorie.nome = 'Elettronica' THEN 1 WHEN categorie.nome = 'Abbigliamento' THEN 2 ELSE 3 END", hints: ["Assegna numeri per definire l'ordine.", "ORDER BY CASE ... THEN 1 ... THEN 2 ..."], explanation: "Forza un ordine non alfabetico specifico.", replacements: {} },
            { titleTemplate: "Case Pivot (Simulato)", descTemplate: "Seleziona la somma di un CASE (1 se 'prezzo' < 50, altrimenti 0) come 'Economici' e la somma di un CASE (1 se 'prezzo' >= 50, altrimenti 0) come 'Costosi' dalla tabella 'prodotti'.", queryTemplate: "SELECT SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END) AS Economici, SUM(CASE WHEN prezzo >= 50 THEN 1 ELSE 0 END) AS Costosi FROM prodotti", hints: ["Usa SUM(CASE ...) per contare condizionalmente.", "SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END)"], explanation: "Tecnica per creare colonne pivot (trasformare righe in colonne).", replacements: {} },
            { titleTemplate: "Case dentro AVG", descTemplate: "Seleziona la media (AVG) di un CASE che restituisce 'prezzo' se 'stock' > 0, altrimenti NULL (per ignorare il valore) dalla tabella 'prodotti'.", queryTemplate: "SELECT AVG(CASE WHEN stock > 0 THEN prezzo ELSE NULL END) as MediaDisponibili FROM prodotti", hints: ["Usa NULL per ignorare valori nella media.", "AVG(CASE ... ELSE NULL END)"], explanation: "Statistiche filtrate senza WHERE.", replacements: {} },
            { titleTemplate: "Case dentro COUNT", descTemplate: "Seleziona il conteggio (COUNT) di recensioni 'Positive' (voto >= 4) e 'Negative' (voto <= 2) usando CASE che restituiscono 1 o NULL.", queryTemplate: "SELECT COUNT(CASE WHEN voto >= 4 THEN 1 END) as Positive, COUNT(CASE WHEN voto <= 2 THEN 1 END) as Negative FROM recensioni", hints: ["COUNT ignora i NULL.", "COUNT(CASE ... THEN 1 END)"], explanation: "Conteggi multipli in una sola passata.", replacements: {} },
            { titleTemplate: "Case Nidificato 3 Livelli", descTemplate: "Seleziona 'nome' e un CASE nidificato complesso che classifica gli utenti in 4 categorie basandosi su 'premium' e numero di ordini.", queryTemplate: "SELECT nome, CASE WHEN premium THEN CASE WHEN (SELECT COUNT(*) FROM ordini WHERE utente_id = utenti.id) > 5 THEN 'VIP' ELSE 'Promettente' END ELSE CASE WHEN (SELECT COUNT(*) FROM ordini WHERE utente_id = utenti.id) > 5 THEN 'Fedele' ELSE 'Standard' END END FROM utenti", hints: ["Logica ramificata complessa.", "CASE WHEN ... THEN CASE ... END ELSE CASE ... END END"], explanation: "Segmentazione avanzata della clientela.", replacements: {} },
            { titleTemplate: "Case Update (Simulato con Select)", descTemplate: "Seleziona 'nome', 'prezzo' originale e un CASE che mostra il nuovo prezzo (prezzo * 1.10 se 'prezzo' < 50, altrimenti prezzo invariato) dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, CASE WHEN prezzo < 50 THEN prezzo * 1.10 ELSE prezzo END AS nuovo_prezzo FROM prodotti", hints: ["Simula un aumento prezzi condizionale.", "CASE WHEN prezzo < 50 THEN prezzo * 1.10 ..."], explanation: "Anteprima di modifiche ai dati.", replacements: {} },
            { titleTemplate: "Case con Window Function", descTemplate: "Seleziona 'nome', la differenza di prezzo col precedente (LAG), e un CASE che mostra 'Salto' se la differenza > 50, altrimenti 'Normale'.", queryTemplate: "SELECT nome, prezzo - LAG(prezzo) OVER (ORDER BY prezzo) as Diff, CASE WHEN (prezzo - LAG(prezzo) OVER (ORDER BY prezzo)) > 50 THEN 'Salto' ELSE 'Normale' END FROM prodotti", hints: ["Usa LAG per guardare la riga precedente.", "CASE WHEN ... > 50"], explanation: "Analisi di serie e sequenze.", replacements: {} },
            { titleTemplate: "Case per Etichetta Temporale", descTemplate: "Seleziona 'data_ordine' e un CASE che mostra 'Weekend' se DAYOFWEEK(data_ordine) è 1 (Dom) o 7 (Sab), altrimenti 'Feriale' dalla tabella 'ordini'.", queryTemplate: "SELECT data_ordine, CASE WHEN DAYOFWEEK(data_ordine) IN (1, 7) THEN 'Weekend' ELSE 'Feriale' END FROM ordini", hints: ["Usa DAYOFWEEK (1=Dom, 7=Sab).", "CASE WHEN DAYOFWEEK(...) IN (1, 7)"], explanation: "Categorizzazione temporale.", replacements: {} },
            { titleTemplate: "Case in HAVING Complesso", descTemplate: "Seleziona 'categoria_id' raggruppando per categoria e filtrando (HAVING) dove il numero di prodotti costosi (>100) è maggiore di quelli economici (<50) usando SUM e CASE.", queryTemplate: "SELECT categoria_id FROM prodotti GROUP BY categoria_id HAVING SUM(CASE WHEN prezzo > 100 THEN 1 ELSE 0 END) > SUM(CASE WHEN prezzo < 50 THEN 1 ELSE 0 END)", hints: ["Confronta due SUM condizionali.", "HAVING SUM(...) > SUM(...)"], explanation: "Filtri complessi su aggregati.", replacements: {} },
            { titleTemplate: "Case con Subquery Correlata", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Sopra' se 'prezzo' > (media prezzi della stessa categoria), altrimenti 'Sotto' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, CASE WHEN prezzo > (SELECT AVG(p2.prezzo) FROM prodotti p2 WHERE p2.categoria_id = prodotti.categoria_id) THEN 'Sopra' ELSE 'Sotto' END FROM prodotti", hints: ["La subquery dipende dalla riga esterna.", "SELECT AVG(...) WHERE categoria_id = prodotti.categoria_id"], explanation: "Benchmarking contestuale.", replacements: {} },
            { titleTemplate: "Case Multi-Colonna", descTemplate: "Seleziona 'nome' e un CASE che mostra 'Raro' se 'stock' < 10, 'Caro' se 'prezzo' > 100, altrimenti 'Normale' (la prima condizione vera vince).", queryTemplate: "SELECT nome, CASE WHEN stock < 10 THEN 'Raro' WHEN prezzo > 100 THEN 'Caro' ELSE 'Normale' END FROM prodotti", hints: ["L'ordine delle clausole WHEN determina la priorità.", "Prima controlla stock, poi prezzo."], explanation: "Gestione conflitti tra regole.", replacements: {} },
            { titleTemplate: "Case Null Coalesce Logic", descTemplate: "Seleziona 'id' e un CASE che mostra 'Non Spedito' se 'codice_tracking' E 'data_spedizione' sono NULL, 'Non Tracciato' se solo 'codice_tracking' è NULL, altrimenti 'Ok' dalla tabella 'spedizioni'.", queryTemplate: "SELECT id, CASE WHEN codice_tracking IS NULL AND data_spedizione IS NULL THEN 'Non Spedito' WHEN codice_tracking IS NULL THEN 'Non Tracciato' ELSE 'Ok' END FROM spedizioni", hints: ["Gestisci le combinazioni di NULL.", "CASE WHEN ... IS NULL AND ... IS NULL"], explanation: "Pulizia e normalizzazione dati.", replacements: {} },
            { titleTemplate: "Case in JOIN Condition", descTemplate: "Seleziona 'p.nome' e 's.sconto' facendo una LEFT JOIN tra 'prodotti' (p) e 'sconti' (s) sulla condizione che 's.tipo' sia uguale a un CASE ('Alto' se 'p.prezzo' > 100, altrimenti 'Basso').", queryTemplate: "SELECT p.nome, s.sconto FROM prodotti p LEFT JOIN sconti s ON s.tipo = CASE WHEN p.prezzo > 100 THEN 'Alto' ELSE 'Basso' END", hints: ["Usa CASE nella condizione ON.", "ON s.tipo = CASE ... END"], explanation: "Relazioni condizionali tra tabelle.", replacements: {} }
        ]
    },
    [TopicId.Advanced]: {
        [Difficulty.Easy]: [
            { titleTemplate: "Subquery Prezzo > Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore della media (AVG) di 'prezzo' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELETC * FROM prodotti WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)", debugHint: "Errore di battitura nella parola chiave SELECT.", hints: ["Subquery in WHERE", "WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery per confronto con media.", replacements: {} },
            { titleTemplate: "Subquery Prezzo < Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è minore della media (AVG) di 'prezzo' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELECT * prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)", debugHint: "Manca la parola chiave FROM.", hints: ["Subquery in WHERE", "WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery per confronto con media minore.", replacements: {} },
            { titleTemplate: "Subquery Stock > Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è maggiore della media (AVG) di 'stock' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE stock > (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock > (SELECT AV(stock) FROM prodotti)", debugHint: "La funzione per la media è AVG, non AV.", hints: ["Subquery in WHERE", "WHERE stock > (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery per confronto stock.", replacements: {} },
            { titleTemplate: "Subquery Stock < Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore della media (AVG) di 'stock' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE stock < (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock < (AVG(stock) FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery in WHERE", "WHERE stock < (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery per confronto stock minore.", replacements: {} },
            { titleTemplate: "Subquery Voto > Media", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore della media (AVG) di 'voto' di tutte le recensioni.", queryTemplate: "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHER voto > (SELECT AVG(voto) FROM recensioni)", debugHint: "Errore di battitura nella parola chiave WHERE.", hints: ["Subquery in WHERE", "WHERE voto > (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery per confronto voto.", replacements: {} },
            { titleTemplate: "Subquery Voto < Media", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è minore della media (AVG) di 'voto' di tutte le recensioni.", queryTemplate: "SELECT * FROM recensioni WHERE voto < (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto < (SELECT AVG(voto) FROM recensioni", debugHint: "Manca la parentesi di chiusura della subquery.", hints: ["Subquery in WHERE", "WHERE voto < (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery per confronto voto minore.", replacements: {} },
            { titleTemplate: "Subquery Quantità > Media", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è maggiore della media (AVG) di 'quantita' di tutti gli ordini.", queryTemplate: "SELECT * FROM ordini WHERE quantita > (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita > (SELECT AGV(quantita) FROM ordini)", debugHint: "Errore di battitura nella funzione AVG.", hints: ["Subquery in WHERE", "WHERE quantita > (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery per confronto quantità.", replacements: {} },
            { titleTemplate: "Subquery Quantità < Media", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è minore della media (AVG) di 'quantita' di tutti gli ordini.", queryTemplate: "SELECT * FROM ordini WHERE quantita < (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita < (SELECT AVG(quantita) ordini)", debugHint: "Manca la parola chiave FROM nella subquery.", hints: ["Subquery in WHERE", "WHERE quantita < (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery per confronto quantità minore.", replacements: {} },
            { titleTemplate: "Subquery Prezzo = Massimo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è uguale al massimo (MAX) di 'prezzo' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo = (SELECT MA(prezzo) FROM prodotti)", debugHint: "Errore di battitura nella funzione MAX.", hints: ["Subquery con MAX", "WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti)"], explanation: "Subquery con MAX.", replacements: {} },
            { titleTemplate: "Subquery Prezzo = Minimo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è uguale al minimo (MIN) di 'prezzo' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo = (MIN(prezzo) FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery con MIN", "WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti)"], explanation: "Subquery con MIN.", replacements: {} },
            { titleTemplate: "Subquery Stock = Massimo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è uguale al massimo (MAX) di 'stock' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE stock = (SELECT MAX(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock = (SELECT MAX(stok) FROM prodotti)", debugHint: "Errore di battitura nel nome della colonna 'stock'.", hints: ["Subquery con MAX", "WHERE stock = (SELECT MAX(stock) FROM prodotti)"], explanation: "Subquery con MAX su stock.", replacements: {} },
            { titleTemplate: "Subquery Stock = Minimo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è uguale al minimo (MIN) di 'stock' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE stock = (SELECT MIN(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock = SELECT MIN(stock) FROM prodotti", debugHint: "Le subquery devono essere racchiuse tra parentesi.", hints: ["Subquery con MIN", "WHERE stock = (SELECT MIN(stock) FROM prodotti)"], explanation: "Subquery con MIN su stock.", replacements: {} },
            { titleTemplate: "Subquery Voto = Massimo", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è uguale al massimo (MAX) di 'voto' di tutte le recensioni.", queryTemplate: "SELECT * FROM recensioni WHERE voto = (SELECT MAX(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto = (SELECT MAX(vot) FROM recensioni)", debugHint: "Errore di battitura nel nome della colonna 'voto'.", hints: ["Subquery con MAX", "WHERE voto = (SELECT MAX(voto) FROM recensioni)"], explanation: "Subquery con MAX su voto.", replacements: {} },
            { titleTemplate: "Subquery Voto = Minimo", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è uguale al minimo (MIN) di 'voto' di tutte le recensioni.", queryTemplate: "SELECT * FROM recensioni WHERE voto = (SELECT MIN(voto) FROM recensioni)", brokenCode: "SELECT * recensioni WHERE voto = (SELECT MIN(voto) FROM recensioni)", debugHint: "Manca la parola chiave FROM nella query principale.", hints: ["Subquery con MIN", "WHERE voto = (SELECT MIN(voto) FROM recensioni)"], explanation: "Subquery con MIN su voto.", replacements: {} },
            { titleTemplate: "Subquery Quantità = Massimo", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è uguale al massimo (MAX) di 'quantita' di tutti gli ordini.", queryTemplate: "SELECT * FROM ordini WHERE quantita = (SELECT MAX(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita = (SELECT MAX(quantit) FROM ordini)", debugHint: "Errore di battitura nel nome della colonna 'quantita'.", hints: ["Subquery con MAX", "WHERE quantita = (SELECT MAX(quantita) FROM ordini)"], explanation: "Subquery con MAX su quantità.", replacements: {} },
            { titleTemplate: "Subquery Quantità = Minimo", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è uguale al minimo (MIN) di 'quantita' di tutti gli ordini.", queryTemplate: "SELECT * FROM ordini WHERE quantita = (SELECT MIN(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita = (SELECT MI(quantita) FROM ordini)", debugHint: "Errore di battitura nella funzione MIN.", hints: ["Subquery con MIN", "WHERE quantita = (SELECT MIN(quantita) FROM ordini)"], explanation: "Subquery con MIN su quantità.", replacements: {} },
            { titleTemplate: "Subquery Prezzo >= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore o uguale alla media (AVG) di 'prezzo' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo >= (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo >= (SELECT AV(prezzo) FROM prodotti)", debugHint: "La funzione per la media è AVG, non AV.", hints: ["Subquery con >=", "WHERE prezzo >= (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery con >=", replacements: {} },
            { titleTemplate: "Subquery Prezzo <= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è minore o uguale alla media (AVG) di 'prezzo' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo <= (SELECT AVG(prezzo) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo <= (AVG(prezzo) FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery con <=", "WHERE prezzo <= (SELECT AVG(prezzo) FROM prodotti)"], explanation: "Subquery con <=", replacements: {} },
            { titleTemplate: "Subquery Stock >= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è maggiore o uguale alla media (AVG) di 'stock' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE stock >= (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock >= (SELECT AVG(stoc) FROM prodotti)", debugHint: "Errore di battitura nel nome della colonna 'stock'.", hints: ["Subquery con >=", "WHERE stock >= (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery con >= su stock.", replacements: {} },
            { titleTemplate: "Subquery Stock <= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore o uguale alla media (AVG) di 'stock' di tutti i prodotti.", queryTemplate: "SELECT * FROM prodotti WHERE stock <= (SELECT AVG(stock) FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock <= SELECT AVG(stock) FROM prodotti", debugHint: "Le subquery devono essere racchiuse tra parentesi.", hints: ["Subquery con <=", "WHERE stock <= (SELECT AVG(stock) FROM prodotti)"], explanation: "Subquery con <= su stock.", replacements: {} },
            { titleTemplate: "Subquery Voto >= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore o uguale alla media (AVG) di 'voto' di tutte le recensioni.", queryTemplate: "SELECT * FROM recensioni WHERE voto >= (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto >= (SELECT AVG(vot) FROM recensioni)", debugHint: "Errore di battitura nel nome della colonna 'voto'.", hints: ["Subquery con >=", "WHERE voto >= (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery con >= su voto.", replacements: {} },
            { titleTemplate: "Subquery Voto <= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è minore o uguale alla media (AVG) di 'voto' di tutte le recensioni.", queryTemplate: "SELECT * FROM recensioni WHERE voto <= (SELECT AVG(voto) FROM recensioni)", brokenCode: "SELECT * recensioni WHERE voto <= (SELECT AVG(voto) FROM recensioni)", debugHint: "Manca la parola chiave FROM nella query principale.", hints: ["Subquery con <=", "WHERE voto <= (SELECT AVG(voto) FROM recensioni)"], explanation: "Subquery con <= su voto.", replacements: {} },
            { titleTemplate: "Subquery Quantità >= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è maggiore o uguale alla media (AVG) di 'quantita' di tutti gli ordini.", queryTemplate: "SELECT * FROM ordini WHERE quantita >= (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita >= (SELECT AVG(quantit) FROM ordini)", debugHint: "Errore di battitura nel nome della colonna 'quantita'.", hints: ["Subquery con >=", "WHERE quantita >= (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery con >= su quantità.", replacements: {} },
            { titleTemplate: "Subquery Quantità <= Media", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è minore o uguale alla media (AVG) di 'quantita' di tutti gli ordini.", queryTemplate: "SELECT * FROM ordini WHERE quantita <= (SELECT AVG(quantita) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita <= (SELECT AVG(quantita) ordini)", debugHint: "Manca la parola chiave FROM nella subquery.", hints: ["Subquery con <=", "WHERE quantita <= (SELECT AVG(quantita) FROM ordini)"], explanation: "Subquery con <= su quantità.", replacements: {} },
            { titleTemplate: "Subquery Prezzo > Massimo / 2", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore della metà del prezzo massimo (MAX(prezzo) / 2).", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT MAX(prezzo) / 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > (SELECT MA(prezzo) / 2 FROM prodotti)", debugHint: "Errore di battitura nella funzione MAX.", hints: ["Subquery con calcolo", "WHERE prezzo > (SELECT MAX(prezzo) / 2 FROM prodotti)"], explanation: "Subquery con calcolo.", replacements: {} },
            { titleTemplate: "Subquery Stock > Massimo / 2", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è maggiore della metà dello stock massimo (MAX(stock) / 2).", queryTemplate: "SELECT * FROM prodotti WHERE stock > (SELECT MAX(stock) / 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock > (MAX(stock) / 2 FROM prodotti)", debugHint: "Manca la parola chiave SELECT nella subquery.", hints: ["Subquery con calcolo", "WHERE stock > (SELECT MAX(stock) / 2 FROM prodotti)"], explanation: "Subquery con calcolo su stock.", replacements: {} },
            { titleTemplate: "Subquery Voto > Massimo / 2", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore della metà del voto massimo (MAX(voto) / 2).", queryTemplate: "SELECT * FROM recensioni WHERE voto > (SELECT MAX(voto) / 2 FROM recensioni)", brokenCode: "SELECT * FROM recensioni WHERE voto > (SELECT MAX(vot) / 2 FROM recensioni)", debugHint: "Errore di battitura nel nome della colonna 'voto'.", hints: ["Subquery con calcolo", "WHERE voto > (SELECT MAX(voto) / 2 FROM recensioni)"], explanation: "Subquery con calcolo su voto.", replacements: {} },
            { titleTemplate: "Subquery Quantità > Massimo / 2", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'quantita' è maggiore della metà della quantità massima (MAX(quantita) / 2).", queryTemplate: "SELECT * FROM ordini WHERE quantita > (SELECT MAX(quantita) / 2 FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE quantita > SELECT MAX(quantita) / 2 FROM ordini", debugHint: "Le subquery devono essere racchiuse tra parentesi.", hints: ["Subquery con calcolo", "WHERE quantita > (SELECT MAX(quantita) / 2 FROM ordini)"], explanation: "Subquery con calcolo su quantità.", replacements: {} },
            { titleTemplate: "Subquery Prezzo > Minimo * 2", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore del doppio del prezzo minimo (MIN(prezzo) * 2).", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) * 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > (SELECT MI(prezzo) * 2 FROM prodotti)", debugHint: "Errore di battitura nella funzione MIN.", hints: ["Subquery con calcolo", "WHERE prezzo > (SELECT MIN(prezzo) * 2 FROM prodotti)"], explanation: "Subquery con calcolo minimo.", replacements: {} },
            { titleTemplate: "Subquery Stock < Massimo / 2", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore della metà dello stock massimo (MAX(stock) / 2).", queryTemplate: "SELECT * FROM prodotti WHERE stock < (SELECT MAX(stock) / 2 FROM prodotti)", brokenCode: "SELECT * FROM prodotti WHERE stock < (SELECT MAX(stock) / 2 prodotti)", debugHint: "Manca la parola chiave FROM nella subquery.", hints: ["Subquery con calcolo", "WHERE stock < (SELECT MAX(stock) / 2 FROM prodotti)"], explanation: "Subquery con calcolo stock minore.", replacements: {} },
            // NEW EXERCISES FOR ADVANCED EASY
            { titleTemplate: "Subquery IN Categorie", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'categoria_id' è IN una subquery che seleziona 'id' dalla tabella 'categorie' dove 'nome' è 'Elettronica' o 'Abbigliamento'.", queryTemplate: "SELECT * FROM prodotti WHERE categoria_id IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", brokenCode: "SELECT * FROM prodotti WHERE categoria_id I (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", debugHint: "Errore di battitura nell'operatore IN.", hints: ["Subquery con IN"], explanation: "Filtro su relazione.", replacements: {} },
            { titleTemplate: "Subquery NOT IN Categorie", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'categoria_id' NON è IN una subquery che seleziona 'id' dalla tabella 'categorie' dove 'nome' è 'Elettronica' o 'Abbigliamento'.", queryTemplate: "SELECT * FROM prodotti WHERE categoria_id NOT IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", brokenCode: "SELECT * FROM prodotti WHERE categoria_id IN (SELECT id FROM categorie WHERE nome IN ('Elettronica', 'Abbigliamento'))", debugHint: "Manca l'operatore NOT prima di IN.", hints: ["Subquery con NOT IN"], explanation: "Esclusione su relazione.", replacements: {} },
            { titleTemplate: "Subquery IN Fornitori", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'fornitore_id' è IN una subquery che seleziona 'id' dalla tabella 'fornitori' dove 'nazione' è 'Italia'.", queryTemplate: "SELECT * FROM prodotti WHERE fornitore_id IN (SELECT id FROM fornitori WHERE nazione = 'Italia')", brokenCode: "SELECT * FROM prodotti WHERE fornitoreid IN (SELECT id FROM fornitori WHERE nazione = 'Italia')", debugHint: "Errore di battitura nel nome della colonna 'fornitore_id'.", hints: ["Subquery con IN"], explanation: "Filtro geografico indiretto.", replacements: {} },
            { titleTemplate: "Subquery ANY Prezzo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore di ALMENO UNO (ANY) dei prezzi dei prodotti della categoria 1.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > ANY (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > AN (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", debugHint: "Errore di battitura nell'operatore ANY.", hints: ["Subquery con ANY"], explanation: "Confronto con insieme.", replacements: {} },
            { titleTemplate: "Subquery ALL Prezzo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore di TUTTI (ALL) i prezzi dei prodotti della categoria 1.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > ALL (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > AL (SELECT prezzo FROM prodotti WHERE categoria_id = 1)", debugHint: "Errore di battitura nell'operatore ALL.", hints: ["Subquery con ALL"], explanation: "Confronto totale.", replacements: {} },
            { titleTemplate: "Subquery FROM (Derived Table)", descTemplate: "Seleziona la media (AVG) di 'p.prezzo' da una subquery nella clausola FROM (alias 'p') che seleziona tutti i prodotti con 'prezzo' > 100.", queryTemplate: "SELECT AVG(p.prezzo) FROM (SELECT * FROM prodotti WHERE prezzo > 100) as p", brokenCode: "SELECT AVG(p.prezzo) FROM (SELECT * FROM prodotti WHERE prezzo > 100)", debugHint: "Manca l'alias per la tabella derivata (es. 'as p').", hints: ["Subquery in FROM"], explanation: "Tabella derivata.", replacements: {} },
            { titleTemplate: "Subquery SELECT (Scalare)", descTemplate: "Seleziona 'nome' e la differenza tra 'prezzo' e la media globale (calcolata con una subquery SELECT AVG(prezzo) FROM prodotti) come 'DiffMedia' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo - (SELECT AVG(prezzo) FROM prodotti) as DiffMedia FROM prodotti", brokenCode: "SELECT nome, prezzo - (SELECT AVG(prezzo)) as DiffMedia FROM prodotti", debugHint: "Manca la clausola FROM nella subquery.", hints: ["Subquery in SELECT"], explanation: "Calcolo relativo.", replacements: {} },
            { titleTemplate: "Subquery WHERE Data Recente", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'data_ordine' è maggiore di una data calcolata (MAX(data_ordine) meno 1 mese) usando una subquery.", queryTemplate: "SELECT * FROM ordini WHERE data_ordine > (SELECT DATE_SUB(MAX(data_ordine), INTERVAL 1 MONTH) FROM ordini)", brokenCode: "SELECT * FROM ordini WHERE data_ordine > (SELECT DATESUB(MAX(data_ordine), INTERVAL 1 MONTH) FROM ordini)", debugHint: "Errore di battitura nella funzione DATE_SUB.", hints: ["Subquery data dinamica"], explanation: "Filtro temporale relativo.", replacements: {} },
            { titleTemplate: "Subquery WHERE Utente Attivo", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'utente_id' corrisponde all'utente che ha ordinato più quantità in totale (trovato con subquery LIMIT 1).", queryTemplate: "SELECT * FROM ordini WHERE utente_id = (SELECT utente_id FROM ordini GROUP BY utente_id ORDER BY SUM(quantita * 10) DESC LIMIT 1)", brokenCode: "SELECT * FROM ordini WHERE utente_id = (SELECT utente_id FROM ordini GROUP BY utente_id ORDER BY SUM(quantita * 10) DESC)", debugHint: "Manca la clausola LIMIT 1 nella subquery.", hints: ["Subquery con LIMIT"], explanation: "Targeting utente top.", replacements: {} },
            { titleTemplate: "Subquery WHERE Prodotto Popolare", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'prodotto_id' corrisponde al prodotto con più recensioni (trovato con subquery LIMIT 1).", queryTemplate: "SELECT * FROM recensioni WHERE prodotto_id = (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id ORDER BY COUNT(*) DESC LIMIT 1)", brokenCode: "SELECT * FROM recensioni WHERE prodotto_id = (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id ORDER BY CONT(*) DESC LIMIT 1)", debugHint: "Errore di battitura nella funzione COUNT.", hints: ["Subquery aggregata"], explanation: "Focus su popolarità.", replacements: {} },
            { titleTemplate: "Subquery IN Utenti Premium", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'utente_id' è IN una subquery che seleziona 'id' dalla tabella 'utenti' dove 'premium' è TRUE.", queryTemplate: "SELECT * FROM recensioni WHERE utente_id IN (SELECT id FROM utenti WHERE premium = TRUE)", brokenCode: "SELECT * FROM recensioni WHERE utente_id IN (SELECT id FROM utenti premium = TRUE)", debugHint: "Manca la parola chiave WHERE nella subquery.", hints: ["Subquery su booleano"], explanation: "Filtro segmento utente.", replacements: {} },
            { titleTemplate: "Subquery NOT IN Utenti Premium", descTemplate: "Seleziona tutti i campi dalla tabella 'ordini' dove 'utente_id' NON è IN una subquery che seleziona 'id' dalla tabella 'utenti' dove 'premium' è TRUE.", queryTemplate: "SELECT * FROM ordini WHERE utente_id NOT IN (SELECT id FROM utenti WHERE premium = TRUE)", brokenCode: "SELECT * FROM ordini WHERE utente_id NO IN (SELECT id FROM utenti WHERE premium = TRUE)", debugHint: "Errore di battitura nella parola chiave NOT.", hints: ["Subquery esclusione"], explanation: "Analisi segmento standard.", replacements: {} },
            { titleTemplate: "Subquery WHERE Prezzo > Minimo Categoria", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'prezzo' è maggiore del prezzo minimo (MIN) dei prodotti della categoria 1 (trovato con subquery).", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE prezzo > (SELECT MIN(prezzo) WHERE categoria_id = 1)", debugHint: "Manca la clausola FROM nella subquery.", hints: ["Subquery specifica"], explanation: "Confronto puntuale.", replacements: {} },
            { titleTemplate: "Subquery WHERE Stock < Media Categoria", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'stock' è minore della media (AVG) dello stock dei prodotti della categoria 1 (trovato con subquery).", queryTemplate: "SELECT * FROM prodotti WHERE stock < (SELECT AVG(stock) FROM prodotti WHERE categoria_id = 1)", brokenCode: "SELECT * FROM prodotti WHERE stock < (SELECT AV(stock) FROM prodotti WHERE categoria_id = 1)", debugHint: "Errore di battitura nella funzione AVG.", hints: ["Subquery media parziale"], explanation: "Analisi stock relativa.", replacements: {} },
            { titleTemplate: "Subquery WHERE Voto > Media Prodotto", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' dove 'voto' è maggiore della media (AVG) dei voti del prodotto 1 (trovato con subquery).", queryTemplate: "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni WHERE prodotto_id = 1)", brokenCode: "SELECT * FROM recensioni WHERE voto > (SELECT AVG(voto) FROM recensioni prodotto_id = 1)", debugHint: "Manca la parola chiave WHERE nella subquery.", hints: ["Subquery media specifica"], explanation: "Analisi qualità relativa.", replacements: {} }
        ],
        [Difficulty.Medium]: [
            { titleTemplate: "Utenti con Ordini (Exists)", descTemplate: "Seleziona gli utenti che hanno fatto almeno un ordine usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["EXISTS con subquery", "WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)"], explanation: "EXISTS per verificare esistenza.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXIST (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", debugHint: "Errore di battitura nella parola chiave EXISTS." },
            { titleTemplate: "Utenti senza Ordini (NOT EXISTS)", descTemplate: "Seleziona gli utenti che NON hanno fatto ordini usando NOT EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)"], explanation: "NOT EXISTS per verificare assenza.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE NO EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", debugHint: "Errore di battitura nella parola chiave NOT." },
            { titleTemplate: "Prodotti con Recensioni (EXISTS)", descTemplate: "Seleziona i prodotti che hanno almeno una recensione usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["EXISTS con recensioni", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)"], explanation: "EXISTS per prodotti con recensioni.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "Prodotti senza Recensioni (NOT EXISTS)", descTemplate: "Seleziona i prodotti che NON hanno recensioni usando NOT EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)"], explanation: "NOT EXISTS per prodotti senza recensioni.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE NOT EXISTS SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", debugHint: "Manca la parentesi di apertura della subquery." },
            { titleTemplate: "Ordini con Spedizioni (EXISTS)", descTemplate: "Seleziona gli ordini che hanno una spedizione usando EXISTS.", queryTemplate: "SELECT * FROM ordini WHERE EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)", hints: ["EXISTS con spedizioni", "WHERE EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)"], explanation: "EXISTS per ordini con spedizioni.", replacements: {}, brokenCode: "SELECT * FROM ordini WHERE EXISTS (SELECT 1 FROM spedizioni spedizioni.ordine_id = ordini.id)", debugHint: "Manca la parola chiave WHERE nella subquery." },
            { titleTemplate: "Ordini senza Spedizioni (NOT EXISTS)", descTemplate: "Seleziona gli ordini che NON hanno spedizioni usando NOT EXISTS.", queryTemplate: "SELECT * FROM ordini WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id)"], explanation: "NOT EXISTS per ordini senza spedizioni.", replacements: {}, brokenCode: "SELECT * FROM ordini WHERE NOT EXISTS (SELECT 1 FROM spedizioni WHERE spedizioni.ordine_id = ordini.id", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "Utenti con Recensioni (EXISTS)", descTemplate: "Seleziona gli utenti che hanno scritto almeno una recensione usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)", hints: ["EXISTS con recensioni", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)"], explanation: "EXISTS per utenti con recensioni.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.uid)", debugHint: "Colonna 'uid' inesistente nella tabella utenti (usa 'id')." },
            { titleTemplate: "Utenti senza Recensioni (NOT EXISTS)", descTemplate: "Seleziona gli utenti che NON hanno scritto recensioni usando NOT EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)", hints: ["NOT EXISTS", "WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id)"], explanation: "NOT EXISTS per utenti senza recensioni.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE NOT EXISTS (SELECT 1 FROM recensioni WHERE recensioni.utente_id = utenti.id", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "EXISTS con WHERE", descTemplate: "Seleziona gli utenti che hanno ordini dopo il 1 Gennaio 2023 usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01')", hints: ["EXISTS con WHERE", "WHERE EXISTS (SELECT 1 FROM ordini WHERE ... AND ordini.data_ordine > '2023-01-01')"], explanation: "EXISTS con condizione aggiuntiva.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id ordini.data_ordine > '2023-01-01')", debugHint: "Manca l'operatore AND nella subquery." },
            { titleTemplate: "EXISTS con WHERE Prezzo", descTemplate: "Seleziona i prodotti che hanno recensioni con voto >= 4 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4)", hints: ["EXISTS con WHERE", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.voto >= 4)"], explanation: "EXISTS con filtro voto.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto 4)", debugHint: "Manca l'operatore di confronto (>=)." },
            { titleTemplate: "EXISTS con WHERE Quantità", descTemplate: "Seleziona gli utenti che hanno ordini con quantità > 5 usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5)", hints: ["EXISTS con WHERE", "WHERE EXISTS (SELECT 1 FROM ordini WHERE ... AND ordini.quantita > 5)"], explanation: "EXISTS con filtro quantità.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "EXISTS con WHERE Prezzo Prodotto", descTemplate: "Seleziona gli utenti che hanno ordinato prodotti > 100 euro usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.prezzo > 100)", hints: ["EXISTS con JOIN", "WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ... WHERE ... AND prodotti.prezzo > 100)"], explanation: "EXISTS con JOIN nella subquery.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.prezzo > 100)", debugHint: "Manca la parola chiave ON nella JOIN." },
            { titleTemplate: "EXISTS con WHERE Categoria", descTemplate: "Seleziona gli utenti che hanno ordinato prodotti della categoria 1 usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.categoria_id = 1)", hints: ["EXISTS con JOIN", "WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ... WHERE ... AND prodotti.categoria_id = 1)"], explanation: "EXISTS con JOIN e filtro categoria.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini JOIN prodotti ON ordini.prodotto_id = prodotti.id WHERE ordini.utente_id = utenti.id AND prodotti.categoria_id 1)", debugHint: "Manca l'operatore di uguaglianza (=)." },
            { titleTemplate: "EXISTS con WHERE Fornitore", descTemplate: "Seleziona i prodotti che hanno recensioni e sono forniti da fornitore 1 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) AND prodotti.fornitore_id = 1", hints: ["EXISTS con AND", "WHERE EXISTS (...) AND prodotti.fornitore_id = 1"], explanation: "EXISTS con condizione aggiuntiva esterna.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) prodotti.fornitore_id = 1", debugHint: "Manca l'operatore AND." },
            { titleTemplate: "EXISTS con WHERE Data", descTemplate: "Seleziona i prodotti che hanno recensioni dopo il 1 Gennaio 2023 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01')", hints: ["EXISTS con WHERE data", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.data_recensione > '2023-01-01')"], explanation: "EXISTS con filtro data.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01'", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "EXISTS con WHERE Voto", descTemplate: "Seleziona i prodotti che hanno recensioni con voto = 5 usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5)", hints: ["EXISTS con WHERE voto", "WHERE EXISTS (SELECT 1 FROM recensioni WHERE ... AND recensioni.voto = 5)"], explanation: "EXISTS con filtro voto specifico.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "EXISTS con WHERE Stock", descTemplate: "Seleziona i prodotti con stock > 10 che hanno recensioni usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE stock > 10 AND EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["EXISTS con AND", "WHERE stock > 10 AND EXISTS (...)"], explanation: "EXISTS con condizione esterna.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE stock > 10 EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", debugHint: "Manca l'operatore AND." },
            { titleTemplate: "EXISTS con WHERE Prezzo", descTemplate: "Seleziona i prodotti con prezzo > 50 che hanno recensioni usando EXISTS.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo > 50 AND EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", hints: ["EXISTS con AND", "WHERE prezzo > 50 AND EXISTS (...)"], explanation: "EXISTS con filtro prezzo esterno.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE prezzo > 50 AND EXIST (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id)", debugHint: "Errore di battitura nella parola chiave EXISTS." },
            { titleTemplate: "EXISTS con WHERE Premium", descTemplate: "Seleziona gli utenti Premium che hanno ordini usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["EXISTS con AND", "WHERE premium = TRUE AND EXISTS (...)"], explanation: "EXISTS con filtro premium.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE premium = TRUE AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "EXISTS con WHERE Paese", descTemplate: "Seleziona gli utenti italiani che hanno ordini usando EXISTS.", queryTemplate: "SELECT * FROM utenti WHERE paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", hints: ["EXISTS con AND", "WHERE paese = 'Italia' AND EXISTS (...)"], explanation: "EXISTS con filtro paese.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE paese = 'Italia' EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id)", debugHint: "Manca l'operatore AND." },
            { titleTemplate: "EXISTS con ORDER BY", descTemplate: "Seleziona gli utenti che hanno ordini, ordinati per nome A-Z.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) ORDER BY nome ASC", hints: ["EXISTS con ORDER BY", "WHERE EXISTS (...) ORDER BY nome ASC"], explanation: "EXISTS con ordinamento.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) ORDER BY nome", debugHint: "Manca la direzione dell'ordinamento (ASC)." },
            { titleTemplate: "EXISTS con ORDER BY Prezzo", descTemplate: "Seleziona i prodotti che hanno recensioni, ordinati per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC", hints: ["EXISTS con ORDER BY", "WHERE EXISTS (...) ORDER BY prezzo DESC"], explanation: "EXISTS con ordinamento prezzo.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo", debugHint: "Manca la direzione dell'ordinamento (DESC)." },
            { titleTemplate: "EXISTS con LIMIT", descTemplate: "Seleziona i primi 5 utenti che hanno ordini.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) LIMIT 5", hints: ["EXISTS con LIMIT", "WHERE EXISTS (...) LIMIT 5"], explanation: "EXISTS con LIMIT.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id) LIMIT", debugHint: "Manca il numero di righe per il LIMIT." },
            { titleTemplate: "EXISTS con ORDER BY e LIMIT", descTemplate: "Seleziona i primi 5 prodotti che hanno recensioni, ordinati per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC LIMIT 5", hints: ["EXISTS con ORDER BY e LIMIT", "WHERE EXISTS (...) ORDER BY prezzo DESC LIMIT 5"], explanation: "EXISTS con ordinamento e LIMIT.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id) ORDER BY prezzo DESC LIMIT", debugHint: "Manca il numero di righe per il LIMIT." },
            { titleTemplate: "EXISTS Complesso Finale", descTemplate: "Seleziona gli utenti Premium italiani che hanno ordini dopo il 1 Gennaio 2023, ordinati per nome A-Z.", queryTemplate: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') ORDER BY nome ASC", hints: ["EXISTS complesso", "WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (...) ORDER BY nome ASC"], explanation: "EXISTS complesso con filtri multipli e ordinamento.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE premium = TRUE AND paese = 'Italia' AND EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') ORDER BY nome", debugHint: "Manca la direzione dell'ordinamento (ASC)." },
            { titleTemplate: "EXISTS con WHERE e LIMIT", descTemplate: "Seleziona i primi 3 utenti che hanno ordini dopo il 1 Gennaio 2023.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') LIMIT 3", hints: ["EXISTS con WHERE e LIMIT", "WHERE EXISTS (...) LIMIT 3"], explanation: "EXISTS con WHERE e LIMIT.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.data_ordine > '2023-01-01') LIMIT", debugHint: "Manca il numero di righe per il LIMIT." },
            { titleTemplate: "EXISTS con WHERE Prezzo e ORDER BY", descTemplate: "Seleziona i prodotti che hanno recensioni con voto >= 4, ordinati per prezzo decrescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4) ORDER BY prezzo DESC", hints: ["EXISTS con WHERE e ORDER BY", "WHERE EXISTS (...) ORDER BY prezzo DESC"], explanation: "EXISTS con WHERE e ordinamento.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto >= 4) ORDER BY prezzo", debugHint: "Manca la direzione dell'ordinamento (DESC)." },
            { titleTemplate: "EXISTS con WHERE Quantità e LIMIT", descTemplate: "Seleziona i primi 5 utenti che hanno ordini con quantità > 5.", queryTemplate: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5) LIMIT 5", hints: ["EXISTS con WHERE e LIMIT", "WHERE EXISTS (...) LIMIT 5"], explanation: "EXISTS con WHERE quantità e LIMIT.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE EXISTS (SELECT 1 FROM ordini WHERE ordini.utente_id = utenti.id AND ordini.quantita > 5) LIMIT", debugHint: "Manca il numero di righe per il LIMIT." },
            { titleTemplate: "EXISTS con WHERE Data e ORDER BY", descTemplate: "Seleziona i prodotti che hanno recensioni dopo il 1 Gennaio 2023, ordinati per prezzo crescente.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01') ORDER BY prezzo ASC", hints: ["EXISTS con WHERE data e ORDER BY", "WHERE EXISTS (...) ORDER BY prezzo ASC"], explanation: "EXISTS con WHERE data e ordinamento.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.data_recensione > '2023-01-01') ORDER BY prezzo", debugHint: "Manca la direzione dell'ordinamento (ASC)." },
            { titleTemplate: "EXISTS con WHERE Voto e LIMIT", descTemplate: "Seleziona i primi 3 prodotti che hanno recensioni con voto = 5.", queryTemplate: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5) LIMIT 3", hints: ["EXISTS con WHERE voto e LIMIT", "WHERE EXISTS (...) LIMIT 3"], explanation: "EXISTS con WHERE voto e LIMIT.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE EXISTS (SELECT 1 FROM recensioni WHERE recensioni.prodotto_id = prodotti.id AND recensioni.voto = 5) LIMIT", debugHint: "Manca il numero di righe per il LIMIT." },
            // NEW EXERCISES FOR ADVANCED MEDIUM
            { titleTemplate: "Correlated Subquery Prezzo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'prezzo' è maggiore della media dei prezzi dei prodotti della STESSA categoria (calcolata con subquery correlata su p2.categoria_id = p1.categoria_id).", queryTemplate: "SELECT * FROM prodotti p1 WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)", hints: ["Subquery correlata"], explanation: "Confronto relativo al gruppo.", replacements: {}, brokenCode: "SELECT * FROM prodotti p1 WHERE prezzo > (SELECT AVG(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.id)", debugHint: "La condizione di correlazione è errata: dovrebbe confrontare le categorie (categoria_id)." },
            { titleTemplate: "Correlated Subquery Stock", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'stock' è minore della media dello stock dei prodotti della STESSA categoria (calcolata con subquery correlata su p2.categoria_id = p1.categoria_id).", queryTemplate: "SELECT * FROM prodotti p1 WHERE stock < (SELECT AVG(stock) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)", hints: ["Subquery correlata stock"], explanation: "Analisi inventario relativa.", replacements: {}, brokenCode: "SELECT * FROM prodotti p1 WHERE stock < (SELECT AVG(stock) FROM prodotti p2 WHERE p2.categoria_id = p1.id)", debugHint: "La condizione di correlazione è errata: dovrebbe confrontare le categorie (categoria_id)." },
            { titleTemplate: "Correlated Subquery Voto", descTemplate: "Seleziona tutti i campi dalla tabella 'recensioni' (alias r1) dove 'voto' è maggiore della media dei voti delle recensioni dello STESSO prodotto (calcolata con subquery correlata su r2.prodotto_id = r1.prodotto_id).", queryTemplate: "SELECT * FROM recensioni r1 WHERE voto > (SELECT AVG(voto) FROM recensioni r2 WHERE r2.prodotto_id = r1.prodotto_id)", hints: ["Subquery correlata voto"], explanation: "Analisi sentiment relativa.", replacements: {}, brokenCode: "SELECT * FROM recensioni r1 WHERE voto > (SELECT AVG(voto) FROM recensioni r2 WHERE r2.prodotto_id = r1.id)", debugHint: "La condizione di correlazione è errata: dovrebbe confrontare i prodotti (prodotto_id)." },
            { titleTemplate: "Subquery SELECT Conteggio", descTemplate: "Seleziona 'nome' e il numero di prodotti (calcolato con subquery SELECT COUNT(*) correlata) come 'NumProdotti' dalla tabella 'categorie'.", queryTemplate: "SELECT nome, (SELECT COUNT(*) FROM prodotti WHERE categoria_id = categorie.id) as NumProdotti FROM categorie", hints: ["Subquery in SELECT"], explanation: "Conteggio correlato.", replacements: {}, brokenCode: "SELECT nome, (SELECT COUNT(*) FROM prodotti WHERE categoria_id = categorie.id) NumProdotti FROM categorie", debugHint: "Manca la parola chiave AS per l'alias di colonna." },
            { titleTemplate: "Subquery SELECT Media Prezzo", descTemplate: "Seleziona 'azienda' e il prezzo medio dei prodotti (calcolato con subquery SELECT AVG(prezzo) correlata) come 'PrezzoMedio' dalla tabella 'fornitori'.", queryTemplate: "SELECT azienda, (SELECT AVG(prezzo) FROM prodotti WHERE fornitore_id = fornitori.id) as PrezzoMedio FROM fornitori", hints: ["Subquery in SELECT media"], explanation: "Aggregazione correlata.", replacements: {}, brokenCode: "SELECT azienda, (SELECT AVG(prezzo) FROM prodotti WHERE fornitore_id = fornitori.id) PrezzoMedio FROM fornitori", debugHint: "Manca la parola chiave AS per l'alias di colonna." },
            { titleTemplate: "Subquery SELECT Ultimo Ordine", descTemplate: "Seleziona 'nome' e la data dell'ultimo ordine (calcolata con subquery SELECT MAX(data_ordine) correlata) come 'UltimoOrdine' dalla tabella 'utenti'.", queryTemplate: "SELECT nome, (SELECT MAX(data_ordine) FROM ordini WHERE utente_id = utenti.id) as UltimoOrdine FROM utenti", hints: ["Subquery in SELECT max"], explanation: "Data correlata.", replacements: {}, brokenCode: "SELECT nome, (SELECT MAX(data_ordine) FROM ordini WHERE utente_id = utenti.id) UltimoOrdine FROM utenti", debugHint: "Manca la parola chiave AS per l'alias di colonna." },
            { titleTemplate: "EXISTS Utenti Attivi Recenti", descTemplate: "Seleziona tutti i campi dalla tabella 'utenti' (alias u) dove ESISTE (EXISTS) un ordine recente (data_ordine > '2023-12-01') nella tabella 'ordini' (alias o) per lo stesso utente.", queryTemplate: "SELECT * FROM utenti u WHERE EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id AND o.data_ordine > '2023-12-01')", hints: ["EXISTS con data"], explanation: "Filtro attività recente.", replacements: {}, brokenCode: "SELECT * FROM utenti u WHERE EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id AND o.data_ordine > '2023-12-01'", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "NOT EXISTS Prodotti Invenduti", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' (alias p) dove NON ESISTE (NOT EXISTS) un ordine nella tabella 'ordini' (alias o) per lo stesso prodotto.", queryTemplate: "SELECT * FROM prodotti p WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.prodotto_id = p.id)", hints: ["NOT EXISTS ordini"], explanation: "Analisi invenduto.", replacements: {}, brokenCode: "SELECT * FROM prodotti p WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.prodotto_id = p.id", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "NOT EXISTS Utenti Inattivi", descTemplate: "Seleziona tutti i campi dalla tabella 'utenti' (alias u) dove NON ESISTE (NOT EXISTS) un ordine nella tabella 'ordini' (alias o) per lo stesso utente.", queryTemplate: "SELECT * FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id)", hints: ["NOT EXISTS utenti"], explanation: "Analisi churn.", replacements: {}, brokenCode: "SELECT * FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "Subquery WHERE IN Multiplo", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'id' è IN una subquery che seleziona 'prodotto_id' da 'ordini' JOIN 'utenti' dove 'utenti.premium' è TRUE.", queryTemplate: "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE)", hints: ["IN con JOIN"], explanation: "Filtro trasversale.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM ordini JOIN utenti ON ordini.utente_id = utenti.id WHERE utenti.premium = TRUE", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "Subquery WHERE IN Aggregato", descTemplate: "Seleziona tutti i campi dalla tabella 'utenti' dove 'id' è IN una subquery che seleziona 'utente_id' da 'ordini' raggruppati per 'utente_id' con conteggio > 5.", queryTemplate: "SELECT * FROM utenti WHERE id IN (SELECT utente_id FROM ordini GROUP BY utente_id HAVING COUNT(*) > 5)", hints: ["IN con HAVING"], explanation: "Filtro su aggregati.", replacements: {}, brokenCode: "SELECT * FROM utenti WHERE id IN (SELECT utente_id FROM ordini GROUP BY utente_id HAVING COUNT(*) > 5", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "Subquery WHERE IN Media Alta", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' dove 'id' è IN una subquery che seleziona 'prodotto_id' da 'recensioni' raggruppati per 'prodotto_id' con media voti > 4.", queryTemplate: "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) > 4)", hints: ["IN con HAVING AVG"], explanation: "Qualità alta.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE id IN (SELECT prodotto_id FROM recensioni GROUP BY prodotto_id HAVING AVG(voto) > 4", debugHint: "Manca la parentesi di chiusura della subquery." },
            { titleTemplate: "Correlated Subquery Max", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'prezzo' è uguale al prezzo massimo dei prodotti della STESSA categoria (calcolato con subquery correlata).", queryTemplate: "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id)", hints: ["Subquery max correlata"], explanation: "Top per gruppo.", replacements: {}, brokenCode: "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MAX(prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.id)", debugHint: "La condizione di correlazione è errata: dovrebbe confrontare le categorie (categoria_id)." },
            { titleTemplate: "Correlated Subquery Min", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' (alias p1) dove 'prezzo' è uguale al prezzo minimo dei prodotti dello STESSO fornitore (calcolato con subquery correlata).", queryTemplate: "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti p2 WHERE p2.fornitore_id = p1.fornitore_id)", hints: ["Subquery min correlata"], explanation: "Best price per fornitore.", replacements: {}, brokenCode: "SELECT * FROM prodotti p1 WHERE prezzo = (SELECT MIN(prezzo) FROM prodotti p2 WHERE p2.fornitore_id = p1.id)", debugHint: "La condizione di correlazione è errata: dovrebbe confrontare i fornitori (fornitore_id)." },
            { titleTemplate: "Subquery in UPDATE (Simulato)", descTemplate: "Seleziona tutti i campi dalla tabella 'prodotti' che verrebbero aggiornati se modificassimo i prodotti con prezzo inferiore alla media globale.", queryTemplate: "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti)", hints: ["Simulazione update"], explanation: "Targeting massivo.", replacements: {}, brokenCode: "SELECT * FROM prodotti WHERE prezzo < (SELECT AVG(prezzo) FROM prodotti", debugHint: "Manca la parentesi di chiusura della subquery." }
        ],
        [Difficulty.Hard]: [
            { titleTemplate: "Ranking Prodotti", descTemplate: "Seleziona 'nome', 'prezzo' e il rango (RANK) dei prodotti in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["RANK() OVER", "RANK() OVER (ORDER BY prezzo DESC) as rango"], explanation: "Window Function RANK.", replacements: {} },
            { titleTemplate: "Ranking Stock", descTemplate: "Seleziona 'nome', 'stock' e il rango (RANK) dei prodotti in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, stock, RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti", hints: ["RANK() OVER", "RANK() OVER (ORDER BY stock DESC) as rango"], explanation: "RANK su stock.", replacements: {} },
            { titleTemplate: "Ranking Voti", descTemplate: "Seleziona 'voto' e il rango (RANK) delle recensioni in base al 'voto' decrescente come 'rango' dalla tabella 'recensioni'.", queryTemplate: "SELECT voto, RANK() OVER (ORDER BY voto DESC) as rango FROM recensioni", hints: ["RANK() OVER", "RANK() OVER (ORDER BY voto DESC) as rango"], explanation: "RANK su voti.", replacements: {} },
            { titleTemplate: "Ranking Quantità", descTemplate: "Seleziona 'quantita' e il rango (RANK) degli ordini in base alla 'quantita' decrescente come 'rango' dalla tabella 'ordini'.", queryTemplate: "SELECT quantita, RANK() OVER (ORDER BY quantita DESC) as rango FROM ordini", hints: ["RANK() OVER", "RANK() OVER (ORDER BY quantita DESC) as rango"], explanation: "RANK su quantità.", replacements: {} },
            { titleTemplate: "DENSE_RANK Prodotti", descTemplate: "Seleziona 'nome', 'prezzo' e il rango denso (DENSE_RANK) dei prodotti in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, DENSE_RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["DENSE_RANK() OVER", "DENSE_RANK() OVER (ORDER BY prezzo DESC) as rango"], explanation: "Window Function DENSE_RANK.", replacements: {} },
            { titleTemplate: "DENSE_RANK Stock", descTemplate: "Seleziona 'nome', 'stock' e il rango denso (DENSE_RANK) dei prodotti in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti", hints: ["DENSE_RANK() OVER", "DENSE_RANK() OVER (ORDER BY stock DESC) as rango"], explanation: "DENSE_RANK su stock.", replacements: {} },
            { titleTemplate: "ROW_NUMBER Prodotti", descTemplate: "Seleziona 'nome', 'prezzo' e il numero di riga (ROW_NUMBER) dei prodotti in base al 'prezzo' decrescente come 'numero' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, ROW_NUMBER() OVER (ORDER BY prezzo DESC) as numero FROM prodotti", hints: ["ROW_NUMBER() OVER", "ROW_NUMBER() OVER (ORDER BY prezzo DESC) as numero"], explanation: "Window Function ROW_NUMBER.", replacements: {} },
            { titleTemplate: "ROW_NUMBER Stock", descTemplate: "Seleziona 'nome', 'stock' e il numero di riga (ROW_NUMBER) dei prodotti in base allo 'stock' decrescente come 'numero' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, stock, ROW_NUMBER() OVER (ORDER BY stock DESC) as numero FROM prodotti", hints: ["ROW_NUMBER() OVER", "ROW_NUMBER() OVER (ORDER BY stock DESC) as numero"], explanation: "ROW_NUMBER su stock.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY Categoria", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["RANK() OVER PARTITION BY", "RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango"], explanation: "RANK con PARTITION BY.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY Categoria", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti", hints: ["DENSE_RANK() OVER PARTITION BY", "DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango"], explanation: "DENSE_RANK con PARTITION BY.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY Categoria", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il numero di riga (ROW_NUMBER) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'numero' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, categoria_id, prezzo, ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as numero FROM prodotti", hints: ["ROW_NUMBER() OVER PARTITION BY", "ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as numero"], explanation: "ROW_NUMBER con PARTITION BY.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY Utente", descTemplate: "Seleziona 'utente_id', 'quantita' e il rango (RANK) partizionato per 'utente_id' e ordinato per 'quantita' decrescente come 'rango' dalla tabella 'ordini'.", queryTemplate: "SELECT utente_id, quantita, RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as rango FROM ordini", hints: ["RANK() OVER PARTITION BY", "RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as rango"], explanation: "RANK con PARTITION BY utente.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY Prodotto", descTemplate: "Seleziona 'prodotto_id', 'voto' e il rango denso (DENSE_RANK) partizionato per 'prodotto_id' e ordinato per 'voto' decrescente come 'rango' dalla tabella 'recensioni'.", queryTemplate: "SELECT prodotto_id, voto, DENSE_RANK() OVER (PARTITION BY prodotto_id ORDER BY voto DESC) as rango FROM recensioni", hints: ["DENSE_RANK() OVER PARTITION BY", "DENSE_RANK() OVER (PARTITION BY prodotto_id ORDER BY voto DESC) as rango"], explanation: "DENSE_RANK con PARTITION BY prodotto.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY Utente", descTemplate: "Seleziona 'utente_id', 'data_ordine' e il numero di riga (ROW_NUMBER) partizionato per 'utente_id' e ordinato per 'data_ordine' decrescente come 'numero' dalla tabella 'ordini'.", queryTemplate: "SELECT utente_id, data_ordine, ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY data_ordine DESC) as numero FROM ordini", hints: ["ROW_NUMBER() OVER PARTITION BY", "ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY data_ordine DESC) as numero"], explanation: "ROW_NUMBER con PARTITION BY utente.", replacements: {} },
            { titleTemplate: "RANK con WHERE", descTemplate: "Seleziona 'nome', 'prezzo' e il rango (RANK) in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50.", queryTemplate: "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50", hints: ["RANK() con WHERE", "WHERE prezzo > 50"], explanation: "RANK con filtro.", replacements: {} },
            { titleTemplate: "DENSE_RANK con WHERE", descTemplate: "Seleziona 'nome', 'stock' e il rango denso (DENSE_RANK) in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti' dove 'stock' > 10.", queryTemplate: "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti WHERE stock > 10", hints: ["DENSE_RANK() con WHERE", "WHERE stock > 10"], explanation: "DENSE_RANK con filtro.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con WHERE", descTemplate: "Seleziona 'voto' e il numero di riga (ROW_NUMBER) in base al 'voto' decrescente come 'numero' dalla tabella 'recensioni' dove 'voto' >= 4.", queryTemplate: "SELECT voto, ROW_NUMBER() OVER (ORDER BY voto DESC) as numero FROM recensioni WHERE voto >= 4", hints: ["ROW_NUMBER() con WHERE", "WHERE voto >= 4"], explanation: "ROW_NUMBER con filtro.", replacements: {} },
            { titleTemplate: "RANK con LIMIT", descTemplate: "Seleziona 'nome', 'prezzo' e il rango (RANK) in base al 'prezzo' decrescente come 'rango' dalla tabella 'prodotti', ordinati per 'prezzo' decrescente e limitati a 5.", queryTemplate: "SELECT nome, prezzo, RANK() OVER (ORDER BY prezzo DESC) as rango FROM prodotti ORDER BY prezzo DESC LIMIT 5", hints: ["RANK() con LIMIT", "ORDER BY prezzo DESC LIMIT 5"], explanation: "RANK con LIMIT.", replacements: {} },
            { titleTemplate: "DENSE_RANK con LIMIT", descTemplate: "Seleziona 'nome', 'stock' e il rango denso (DENSE_RANK) in base allo 'stock' decrescente come 'rango' dalla tabella 'prodotti', ordinati per 'stock' decrescente e limitati a 5.", queryTemplate: "SELECT nome, stock, DENSE_RANK() OVER (ORDER BY stock DESC) as rango FROM prodotti ORDER BY stock DESC LIMIT 5", hints: ["DENSE_RANK() con LIMIT", "ORDER BY stock DESC LIMIT 5"], explanation: "DENSE_RANK con LIMIT.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con LIMIT", descTemplate: "Seleziona 'voto' e il numero di riga (ROW_NUMBER) in base al 'voto' decrescente come 'numero' dalla tabella 'recensioni', ordinati per 'voto' decrescente e limitati a 5.", queryTemplate: "SELECT voto, ROW_NUMBER() OVER (ORDER BY voto DESC) as numero FROM recensioni ORDER BY voto DESC LIMIT 5", hints: ["ROW_NUMBER() con LIMIT", "ORDER BY voto DESC LIMIT 5"], explanation: "ROW_NUMBER con LIMIT.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e WHERE", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50.", queryTemplate: "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50", hints: ["RANK() OVER PARTITION BY con WHERE", "WHERE prezzo > 50"], explanation: "RANK con PARTITION BY e filtro.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY e WHERE", descTemplate: "Seleziona 'nome', 'categoria_id', 'stock' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'stock' decrescente come 'rango' dalla tabella 'prodotti' dove 'stock' > 10.", queryTemplate: "SELECT nome, categoria_id, stock, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY stock DESC) as rango FROM prodotti WHERE stock > 10", hints: ["DENSE_RANK() OVER PARTITION BY con WHERE", "WHERE stock > 10"], explanation: "DENSE_RANK con PARTITION BY e filtro.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY e WHERE", descTemplate: "Seleziona 'utente_id', 'quantita' e il numero di riga (ROW_NUMBER) partizionato per 'utente_id' e ordinato per 'quantita' decrescente come 'numero' dalla tabella 'ordini' dove 'quantita' > 3.", queryTemplate: "SELECT utente_id, quantita, ROW_NUMBER() OVER (PARTITION BY utente_id ORDER BY quantita DESC) as numero FROM ordini WHERE quantita > 3", hints: ["ROW_NUMBER() OVER PARTITION BY con WHERE", "WHERE quantita > 3"], explanation: "ROW_NUMBER con PARTITION BY e filtro.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e LIMIT", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti', filtrando dove il rango è <= 3.", queryTemplate: "SELECT nome, categoria_id, prezzo, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) <= 3", hints: ["RANK() OVER PARTITION BY con filtro", "WHERE RANK() OVER (...) <= 3"], explanation: "RANK con PARTITION BY e LIMIT simulato.", replacements: {} },
            { titleTemplate: "Window Function Complessa Finale", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti', dove 'prezzo' > 50 e il rango è <= 3.", queryTemplate: "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50 AND DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) <= 3", hints: ["DENSE_RANK() OVER PARTITION BY complesso", "WHERE prezzo > 50 AND DENSE_RANK() OVER (...) <= 3"], explanation: "Window Function complessa con PARTITION BY, WHERE e LIMIT simulato.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e ORDER BY Multiplo", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo', 'stock' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente e 'stock' decrescente come 'rango' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, categoria_id, prezzo, stock, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango FROM prodotti", hints: ["RANK() OVER PARTITION BY con ORDER BY multiplo", "RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango"], explanation: "RANK con PARTITION BY e ORDER BY multiplo.", replacements: {} },
            { titleTemplate: "DENSE_RANK con PARTITION BY e ORDER BY Multiplo", descTemplate: "Seleziona 'utente_id', 'quantita', 'data_ordine' e il rango denso (DENSE_RANK) partizionato per 'utente_id' e ordinato per 'quantita' decrescente e 'data_ordine' decrescente come 'rango' dalla tabella 'ordini'.", queryTemplate: "SELECT utente_id, quantita, data_ordine, DENSE_RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC, data_ordine DESC) as rango FROM ordini", hints: ["DENSE_RANK() OVER PARTITION BY con ORDER BY multiplo", "DENSE_RANK() OVER (PARTITION BY utente_id ORDER BY quantita DESC, data_ordine DESC) as rango"], explanation: "DENSE_RANK con PARTITION BY e ORDER BY multiplo.", replacements: {} },
            { titleTemplate: "ROW_NUMBER con PARTITION BY e ORDER BY Multiplo", descTemplate: "Seleziona 'prodotto_id', 'voto', 'data_recensione' e il numero di riga (ROW_NUMBER) partizionato per 'prodotto_id' e ordinato per 'voto' decrescente e 'data_recensione' decrescente come 'numero' dalla tabella 'recensioni'.", queryTemplate: "SELECT prodotto_id, voto, data_recensione, ROW_NUMBER() OVER (PARTITION BY prodotto_id ORDER BY voto DESC, data_recensione DESC) as numero FROM recensioni", hints: ["ROW_NUMBER() OVER PARTITION BY con ORDER BY multiplo", "ROW_NUMBER() OVER (PARTITION BY prodotto_id ORDER BY voto DESC, data_recensione DESC) as numero"], explanation: "ROW_NUMBER con PARTITION BY e ORDER BY multiplo.", replacements: {} },
            { titleTemplate: "RANK con PARTITION BY e WHERE Complesso", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo', 'stock' e il rango (RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50 e 'stock' > 10.", queryTemplate: "SELECT nome, categoria_id, prezzo, stock, RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC) as rango FROM prodotti WHERE prezzo > 50 AND stock > 10", hints: ["RANK() OVER PARTITION BY con WHERE multiplo", "WHERE prezzo > 50 AND stock > 10"], explanation: "RANK con PARTITION BY e WHERE multiplo.", replacements: {} },
            { titleTemplate: "Window Function Finale Complessa", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il rango denso (DENSE_RANK) partizionato per 'categoria_id' e ordinato per 'prezzo' decrescente e 'stock' decrescente come 'rango' dalla tabella 'prodotti' dove 'prezzo' > 50 e il rango è <= 3.", queryTemplate: "SELECT nome, categoria_id, prezzo, DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) as rango FROM prodotti WHERE prezzo > 50 AND DENSE_RANK() OVER (PARTITION BY categoria_id ORDER BY prezzo DESC, stock DESC) <= 3", hints: ["DENSE_RANK() OVER PARTITION BY finale", "WHERE prezzo > 50 AND DENSE_RANK() OVER (...) <= 3"], explanation: "Window Function finale complessa con PARTITION BY, WHERE multiplo e ORDER BY multiplo.", replacements: {} },
            // NEW EXERCISES FOR ADVANCED HARD
            { titleTemplate: "CTE Semplice", descTemplate: "Usa una CTE chiamata 'MediaPrezzi' per calcolare la media dei prezzi (come 'avg_p') e poi seleziona tutti i campi dalla tabella 'prodotti' e 'MediaPrezzi' dove 'prezzo' è maggiore di 'avg_p'.", queryTemplate: "WITH MediaPrezzi AS (SELECT AVG(prezzo) as avg_p FROM prodotti) SELECT * FROM prodotti, MediaPrezzi WHERE prezzo > avg_p", hints: ["WITH CTE"], explanation: "CTE base.", replacements: {} },
            { titleTemplate: "CTE Multipla", descTemplate: "Usa due CTE: 'Costosi' (prezzo > 100) e 'Economici' (prezzo < 20), poi seleziona tutto da 'Costosi' UNION tutto da 'Economici'.", queryTemplate: "WITH Costosi AS (SELECT * FROM prodotti WHERE prezzo > 100), Economici AS (SELECT * FROM prodotti WHERE prezzo < 20) SELECT * FROM Costosi UNION SELECT * FROM Economici", hints: ["WITH CTE1, CTE2"], explanation: "CTE multiple.", replacements: {} },
            { titleTemplate: "CTE con Aggregazione", descTemplate: "Usa una CTE chiamata 'SpeseUtenti' per calcolare il totale vendite per utente (SUM(quantita * 10) come 'totale'), poi seleziona tutti i campi da 'SpeseUtenti' dove 'totale' > 1000.", queryTemplate: "WITH SpeseUtenti AS (SELECT utente_id, SUM(quantita * 10) as totale FROM ordini GROUP BY utente_id) SELECT * FROM SpeseUtenti WHERE totale > 1000", hints: ["CTE Group By"], explanation: "CTE per pre-aggregazione.", replacements: {} },
            { titleTemplate: "Window Function LAG", descTemplate: "Seleziona 'nome', 'prezzo' e il prezzo precedente (LAG(prezzo)) ordinato per 'prezzo' come 'PrezzoPrecedente' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, LAG(prezzo) OVER (ORDER BY prezzo) as PrezzoPrecedente FROM prodotti", hints: ["LAG() OVER"], explanation: "Accesso riga precedente.", replacements: {} },
            { titleTemplate: "Window Function LEAD", descTemplate: "Seleziona 'nome', 'prezzo' e il prezzo successivo (LEAD(prezzo)) ordinato per 'prezzo' come 'PrezzoSuccessivo' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, LEAD(prezzo) OVER (ORDER BY prezzo) as PrezzoSuccessivo FROM prodotti", hints: ["LEAD() OVER"], explanation: "Accesso riga successiva.", replacements: {} },
            { titleTemplate: "Window Function NTILE", descTemplate: "Seleziona 'nome', 'prezzo' e il quartile (NTILE(4)) ordinato per 'prezzo' come 'Quartile' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, NTILE(4) OVER (ORDER BY prezzo) as Quartile FROM prodotti", hints: ["NTILE(4)"], explanation: "Statistica descrittiva.", replacements: {} },
            { titleTemplate: "Window Function Running Total", descTemplate: "Seleziona 'id', 'stock' e la somma cumulativa dello 'stock' (SUM(stock) OVER) ordinata per 'id' come 'StockCumulativo' dalla tabella 'prodotti'.", queryTemplate: "SELECT id, stock, SUM(stock) OVER (ORDER BY id) as StockCumulativo FROM prodotti", hints: ["SUM() OVER ORDER BY"], explanation: "Totale progressivo.", replacements: {} },
            { titleTemplate: "Window Function Moving Avg", descTemplate: "Seleziona 'id', 'prezzo' e la media mobile del 'prezzo' (AVG(prezzo) OVER) sugli ultimi 3 prodotti (ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) ordinati per 'id' come 'MediaMobile' dalla tabella 'prodotti'.", queryTemplate: "SELECT id, prezzo, AVG(prezzo) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as MediaMobile FROM prodotti", hints: ["ROWS BETWEEN"], explanation: "Media mobile.", replacements: {} },
            { titleTemplate: "CTE Ricorsiva (Simulata)", descTemplate: "Usa una CTE Ricorsiva chiamata 'Numeri' per generare una sequenza da 1 a 5, poi seleziona tutto da 'Numeri'.", queryTemplate: "WITH RECURSIVE Numeri AS (SELECT 1 as n UNION ALL SELECT n + 1 FROM Numeri WHERE n < 5) SELECT * FROM Numeri", hints: ["WITH RECURSIVE"], explanation: "Generazione sequenza.", replacements: {} },
            { titleTemplate: "CTE per Classifica", descTemplate: "Usa una CTE chiamata 'Classifica' per calcolare il rango vendite per utente (RANK() su COUNT(*) DESC come 'rnk'), poi seleziona tutto da 'Classifica' dove 'rnk' <= 3.", queryTemplate: "WITH Classifica AS (SELECT utente_id, RANK() OVER (ORDER BY COUNT(*) DESC) as rnk FROM ordini GROUP BY utente_id) SELECT * FROM Classifica WHERE rnk <= 3", hints: ["CTE con Window Func"], explanation: "Ranking pulito.", replacements: {} },
            { titleTemplate: "Window Function Percent Rank", descTemplate: "Seleziona 'nome', 'prezzo' e il rango percentuale (PERCENT_RANK()) ordinato per 'prezzo' come 'PctRank' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, PERCENT_RANK() OVER (ORDER BY prezzo) as PctRank FROM prodotti", hints: ["PERCENT_RANK()"], explanation: "Statistica avanzata.", replacements: {} },
            { titleTemplate: "Window Function First Value", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e il primo valore di 'prezzo' (FIRST_VALUE) partizionato per 'categoria_id' e ordinato per 'prezzo' ASC come 'PrezzoMinCategoria' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, categoria_id, prezzo, FIRST_VALUE(prezzo) OVER (PARTITION BY categoria_id ORDER BY prezzo ASC) as PrezzoMinCategoria FROM prodotti", hints: ["FIRST_VALUE()"], explanation: "Confronto con primo.", replacements: {} },
            { titleTemplate: "Window Function Last Value", descTemplate: "Seleziona 'nome', 'categoria_id', 'prezzo' e l'ultimo valore di 'prezzo' (LAST_VALUE) partizionato per 'categoria_id' e ordinato per 'prezzo' ASC (con frame UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) come 'PrezzoMaxCategoria' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, categoria_id, prezzo, LAST_VALUE(prezzo) OVER (PARTITION BY categoria_id ORDER BY prezzo ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as PrezzoMaxCategoria FROM prodotti", hints: ["LAST_VALUE() con Frame"], explanation: "Confronto con ultimo.", replacements: {} },
            { titleTemplate: "CTE con Join Complessa", descTemplate: "Usa due CTE: 'Venduti' (DISTINCT prodotto_id da ordini) e 'Recensiti' (DISTINCT prodotto_id da recensioni), poi seleziona tutto dalla JOIN tra 'Venduti' e 'Recensiti'.", queryTemplate: "WITH Venduti AS (SELECT DISTINCT prodotto_id FROM ordini), Recensiti AS (SELECT DISTINCT prodotto_id FROM recensioni) SELECT * FROM Venduti JOIN Recensiti ON Venduti.prodotto_id = Recensiti.prodotto_id", hints: ["CTE Join"], explanation: "Logica a step.", replacements: {} },
            { titleTemplate: "Window Function Partition Avg Diff", descTemplate: "Seleziona 'nome', 'prezzo' e la differenza tra 'prezzo' e la media di categoria (AVG(prezzo) OVER PARTITION BY categoria_id) come 'DiffDaMedia' dalla tabella 'prodotti'.", queryTemplate: "SELECT nome, prezzo, prezzo - AVG(prezzo) OVER (PARTITION BY categoria_id) as DiffDaMedia FROM prodotti", hints: ["AVG() OVER PARTITION"], explanation: "Scostamento dalla media.", replacements: {} }
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