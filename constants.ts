
import { TableSchema, Topic, TopicId, Exercise, Difficulty } from './types';
import { Book, Filter, ArrowDownUp, Calculator, Calendar, GitMerge, Sigma, ToggleLeft, Layers } from 'lucide-react';

export const DB_SCHEMAS: TableSchema[] = [
  {
    tableName: 'utenti',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'nome', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'paese', type: 'VARCHAR' },
      { name: 'premium', type: 'BOOLEAN' }
    ]
  },
  {
    tableName: 'categorie',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'nome', type: 'VARCHAR' },
      { name: 'descrizione', type: 'VARCHAR' }
    ]
  },
  {
    tableName: 'fornitori',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'azienda', type: 'VARCHAR' },
      { name: 'contatto', type: 'VARCHAR' },
      { name: 'nazione', type: 'VARCHAR' }
    ]
  },
  {
    tableName: 'prodotti',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'nome', type: 'VARCHAR' },
      { name: 'categoria_id', type: 'INT' },
      { name: 'fornitore_id', type: 'INT' },
      { name: 'prezzo', type: 'DECIMAL' },
      { name: 'stock', type: 'INT' }
    ]
  },
  {
    tableName: 'ordini',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'utente_id', type: 'INT' },
      { name: 'prodotto_id', type: 'INT' },
      { name: 'data_ordine', type: 'DATE' },
      { name: 'quantita', type: 'INT' }
    ]
  },
  {
    tableName: 'spedizioni',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'ordine_id', type: 'INT' },
      { name: 'data_spedizione', type: 'DATE' },
      { name: 'corriere', type: 'VARCHAR' },
      { name: 'codice_tracking', type: 'VARCHAR' }
    ]
  },
  {
    tableName: 'recensioni',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'prodotto_id', type: 'INT' },
      { name: 'utente_id', type: 'INT' },
      { name: 'voto', type: 'INT' },
      { name: 'commento', type: 'VARCHAR' }
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

export const generateCopyCodeSnippets = (difficulty: Difficulty): Exercise[] => {
  const exercises: Exercise[] = [];

  if (difficulty === Difficulty.Easy) {
    const easySnippets = [
      { query: "SELECT * FROM utenti;", description: "Seleziona tutti i dati dalla tabella utenti." },
      { query: "SELECT nome, email FROM utenti;", description: "Recupera solo nome ed email di tutti gli utenti." },
      { query: "SELECT DISTINCT paese FROM utenti;", description: "Trova l'elenco dei paesi unici in cui risiedono gli utenti." },
      { query: "SELECT * FROM prodotti WHERE prezzo > 50;", description: "Filtra i prodotti che costano più di 50 euro." },
      { query: "SELECT * FROM prodotti WHERE stock < 10;", description: "Trova i prodotti con scorte in esaurimento (meno di 10)." },
      { query: "SELECT nome, prezzo FROM prodotti ORDER BY prezzo DESC;", description: "Elenca i prodotti ordinati dal più costoso al più economico." },
      { query: "SELECT * FROM ordini LIMIT 5;", description: "Mostra solo i primi 5 ordini registrati." },
      { query: "SELECT * FROM utenti WHERE paese = 'Italia';", description: "Seleziona tutti gli utenti che vivono in Italia." },
      { query: "SELECT * FROM utenti WHERE premium = true;", description: "Trova tutti gli utenti con abbonamento Premium attivo." },
      { query: "SELECT count(*) FROM prodotti;", description: "Conta il numero totale di prodotti nel catalogo." },
      { query: "SELECT * FROM fornitori WHERE nazione = 'Germania';", description: "Trova tutti i fornitori con sede in Germania." },
      { query: "SELECT azienda, contatto FROM fornitori ORDER BY azienda ASC;", description: "Elenca le aziende fornitrici in ordine alfabetico." },
      { query: "SELECT * FROM recensioni WHERE voto >= 4;", description: "Trova tutte le recensioni positive (voto 4 o 5)." },
      { query: "SELECT * FROM recensioni WHERE voto < 3;", description: "Trova tutte le recensioni negative (voto 1 o 2)." },
      { query: "SELECT * FROM spedizioni WHERE corriere = 'DHL';", description: "Seleziona tutte le spedizioni affidate a DHL." },
      { query: "SELECT id, data_ordine FROM ordini WHERE quantita > 2;", description: "Trova gli ordini che contengono più di 2 articoli." },
      { query: "SELECT nome FROM categorie;", description: "Elenca i nomi di tutte le categorie merceologiche." },
      { query: "SELECT * FROM prodotti WHERE categoria_id = 1;", description: "Mostra tutti i prodotti della prima categoria." },
      { query: "SELECT * FROM prodotti WHERE fornitore_id = 2;", description: "Trova tutti i prodotti forniti dal fornitore #2." },
      { query: "SELECT max(prezzo) FROM prodotti;", description: "Trova il prezzo del prodotto più costoso." },
      { query: "SELECT min(prezzo) FROM prodotti;", description: "Trova il prezzo del prodotto più economico." },
      { query: "SELECT avg(prezzo) FROM prodotti;", description: "Calcola il prezzo medio di tutti i prodotti." },
      { query: "SELECT sum(stock) FROM prodotti;", description: "Calcola il numero totale di articoli in magazzino." },
      { query: "SELECT * FROM utenti WHERE email LIKE '%@gmail.com';", description: "Trova gli utenti che usano Gmail." },
      { query: "SELECT * FROM prodotti WHERE nome LIKE 'S%';", description: "Trova i prodotti il cui nome inizia con la lettera 'S'." },
      { query: "SELECT * FROM spedizioni WHERE data_spedizione > '2023-01-01';", description: "Trova le spedizioni effettuate dopo il 1° Gennaio 2023." },
      { query: "SELECT * FROM ordini WHERE data_ordine BETWEEN '2023-01-01' AND '2023-12-31';", description: "Trova gli ordini effettuati nell'anno 2023." },
      { query: "SELECT id, nome AS prodotto_nome FROM prodotti;", description: "Seleziona ID e nome prodotto, rinominando la colonna nome." },
      { query: "SELECT * FROM utenti WHERE paese IN ('Italia', 'Francia', 'Spagna');", description: "Trova utenti in Italia, Francia o Spagna." },
      { query: "SELECT * FROM prodotti WHERE prezzo IS NOT NULL;", description: "Seleziona i prodotti che hanno un prezzo definito." }
    ];

    easySnippets.forEach((item, i) => {
      exercises.push({
        id: `copy_easy_${i}`,
        topicId: TopicId.Basics,
        difficulty: Difficulty.Easy,
        title: `Snippet Easy #${i + 1}`,
        description: item.description,
        initialQuery: '',
        solutionQuery: item.query,
        hints: [],
        explanation: ''
      });
    });
  } else if (difficulty === Difficulty.Medium) {
    const mediumSnippets = [
      { query: "SELECT p.nome, c.nome as categoria FROM prodotti p JOIN categorie c ON p.categoria_id = c.id;", description: "Mostra il nome del prodotto e il nome della sua categoria." },
      { query: "SELECT u.nome, o.data_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Elenca gli utenti che hanno effettuato ordini, mostrando la data." },
      { query: "SELECT p.nome, f.azienda FROM prodotti p LEFT JOIN fornitori f ON p.fornitore_id = f.id;", description: "Mostra tutti i prodotti e il relativo fornitore (se presente)." },
      { query: "SELECT c.nome, count(p.id) as num_prodotti FROM categorie c LEFT JOIN prodotti p ON c.id = p.categoria_id GROUP BY c.nome;", description: "Conta quanti prodotti ci sono per ogni categoria." },
      { query: "SELECT u.paese, count(*) as num_utenti FROM utenti u GROUP BY u.paese;", description: "Conta il numero di utenti registrati per ogni paese." },
      { query: "SELECT p.nome, avg(r.voto) as media_voti FROM prodotti p JOIN recensioni r ON p.id = r.prodotto_id GROUP BY p.nome;", description: "Calcola la media dei voti delle recensioni per ogni prodotto." },
      { query: "SELECT f.nazione, count(*) as num_fornitori FROM fornitori f GROUP BY f.nazione HAVING count(*) > 1;", description: "Trova le nazioni che hanno più di un fornitore." },
      { query: "SELECT o.id, sum(p.prezzo * o.quantita) as totale_ordine FROM ordini o JOIN prodotti p ON o.prodotto_id = p.id GROUP BY o.id;", description: "Calcola il valore totale in euro per ogni ordine." },
      { query: "SELECT u.nome FROM utenti u JOIN ordini o ON u.id = o.utente_id WHERE o.data_ordine > '2023-06-01';", description: "Trova gli utenti che hanno ordinato dopo il 1° Giugno 2023." },
      { query: "SELECT p.nome FROM prodotti p WHERE p.id NOT IN (SELECT prodotto_id FROM ordini);", description: "Trova i prodotti che non sono mai stati ordinati." },
      { query: "SELECT upper(nome) FROM utenti;", description: "Mostra i nomi degli utenti tutti in maiuscolo." },
      { query: "SELECT concat(nome, ' (', paese, ')') as utente_info FROM utenti;", description: "Formatta l'output come 'Nome (Paese)'." },
      { query: "SELECT *, round(prezzo * 0.9, 2) as prezzo_scontato FROM prodotti;", description: "Calcola il prezzo scontato del 10% arrotondato a 2 decimali." },
      { query: "SELECT datediff('2024-01-01', data_ordine) as giorni_passati FROM ordini;", description: "Calcola quanti giorni sono passati dalla data dell'ordine al 2024." },
      { query: "SELECT year(data_ordine) as anno, count(*) FROM ordini GROUP BY year(data_ordine);", description: "Conta il numero di ordini per ogni anno." },
      { query: "SELECT p.nome, r.commento FROM prodotti p JOIN recensioni r ON p.id = r.prodotto_id WHERE r.voto = 5;", description: "Mostra i commenti delle recensioni a 5 stelle con il nome del prodotto." },
      { query: "SELECT u.email, count(o.id) FROM utenti u LEFT JOIN ordini o ON u.id = o.utente_id GROUP BY u.email ORDER BY count(o.id) DESC;", description: "Classifica gli utenti in base al numero di ordini effettuati." },
      { query: "SELECT c.nome, sum(p.stock) as totale_stock FROM categorie c JOIN prodotti p ON c.id = p.categoria_id GROUP BY c.nome;", description: "Calcola la quantità totale di merce in magazzino per categoria." },
      { query: "SELECT f.azienda, p.nome FROM fornitori f JOIN prodotti p ON f.id = p.fornitore_id WHERE p.prezzo > 100;", description: "Trova i fornitori che vendono prodotti costosi (>100€)." },
      { query: "SELECT o.id, s.codice_tracking FROM ordini o JOIN spedizioni s ON o.id = s.ordine_id WHERE s.corriere = 'UPS';", description: "Trova i codici di tracking per le spedizioni gestite da UPS." },
      { query: "SELECT u.nome, max(o.data_ordine) as ultimo_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id GROUP BY u.nome;", description: "Trova la data dell'ultimo ordine effettuato da ciascun utente." },
      { query: "SELECT p.nome, p.prezzo FROM prodotti p WHERE p.prezzo > (SELECT avg(prezzo) FROM prodotti);", description: "Trova i prodotti che costano più della media." },
      { query: "SELECT c.nome FROM categorie c WHERE EXISTS (SELECT 1 FROM prodotti p WHERE p.categoria_id = c.id AND p.prezzo > 200);", description: "Trova le categorie che contengono almeno un prodotto sopra i 200€." },
      { query: "SELECT u.nome, sum(o.quantita) as totale_articoli FROM utenti u JOIN ordini o ON u.id = o.utente_id GROUP BY u.nome HAVING sum(o.quantita) > 5;", description: "Trova gli utenti che hanno acquistato più di 5 articoli in totale." },
      { query: "SELECT p.nome, CASE WHEN p.stock < 10 THEN 'Basso' ELSE 'Alto' END as stato_stock FROM prodotti p;", description: "Etichetta lo stock come 'Basso' (<10) o 'Alto'." },
      { query: "SELECT o.id, date_format(o.data_ordine, '%d/%m/%Y') as data_formattata FROM ordini o;", description: "Formatta la data dell'ordine nel formato italiano gg/mm/aaaa." },
      { query: "SELECT p.nome, len(p.nome) as lunghezza_nome FROM prodotti p;", description: "Calcola la lunghezza in caratteri del nome di ogni prodotto." },
      { query: "SELECT distinct u.paese FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Trova i paesi da cui provengono gli ordini (senza duplicati)." },
      { query: "SELECT f.azienda FROM fornitori f WHERE f.id IN (SELECT fornitore_id FROM prodotti WHERE stock = 0);", description: "Trova i fornitori che hanno prodotti esauriti (stock 0)." },
      { query: "SELECT p.nome, coalesce(r.voto, 0) as voto_o_zero FROM prodotti p LEFT JOIN recensioni r ON p.id = r.prodotto_id;", description: "Mostra i voti dei prodotti, sostituendo NULL con 0 se non ci sono recensioni." }
    ];

    mediumSnippets.forEach((item, i) => {
      exercises.push({
        id: `copy_medium_${i}`,
        topicId: TopicId.Joins,
        difficulty: Difficulty.Medium,
        title: `Snippet Medium #${i + 1}`,
        description: item.description,
        initialQuery: '',
        solutionQuery: item.query,
        hints: [],
        explanation: ''
      });
    });
  } else if (difficulty === Difficulty.Hard) {
    const hardSnippets = [
      { query: "SELECT p.nome, p.prezzo, rank() OVER (ORDER BY p.prezzo DESC) as classifica_prezzo FROM prodotti p;", description: "Classifica i prodotti per prezzo dal più alto al più basso usando RANK()." },
      { query: "SELECT u.nome, o.data_ordine, row_number() OVER (PARTITION BY u.id ORDER BY o.data_ordine DESC) as n_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Numera gli ordini di ogni utente dal più recente al più vecchio." },
      { query: "SELECT p.nome, p.prezzo, p.prezzo - lag(p.prezzo) OVER (ORDER BY p.prezzo) as diff_precedente FROM prodotti p;", description: "Calcola la differenza di prezzo rispetto al prodotto precedente (ordinati per prezzo)." },
      { query: "SELECT c.nome, p.nome, p.prezzo, avg(p.prezzo) OVER (PARTITION BY c.id) as media_categoria FROM categorie c JOIN prodotti p ON c.id = p.categoria_id;", description: "Confronta il prezzo di ogni prodotto con la media della sua categoria." },
      { query: "WITH VenditeUtenti AS (SELECT u.id, u.nome, sum(p.prezzo * o.quantita) as totale FROM utenti u JOIN ordini o ON u.id = o.utente_id JOIN prodotti p ON o.prodotto_id = p.id GROUP BY u.id, u.nome) SELECT * FROM VenditeUtenti WHERE totale > 1000;", description: "Trova gli utenti che hanno speso più di 1000€ in totale (usando una CTE)." },
      { query: "SELECT * FROM prodotti p1 WHERE p1.prezzo > (SELECT avg(p2.prezzo) FROM prodotti p2 WHERE p2.categoria_id = p1.categoria_id);", description: "Trova i prodotti che costano più della media della loro categoria (Subquery Correlata)." },
      { query: "SELECT u.nome FROM utenti u WHERE NOT EXISTS (SELECT 1 FROM ordini o WHERE o.utente_id = u.id);", description: "Trova gli utenti che non hanno mai effettuato ordini (usando NOT EXISTS)." },
      { query: "SELECT f.azienda, (SELECT count(*) FROM prodotti p WHERE p.fornitore_id = f.id) as num_prodotti FROM fornitori f;", description: "Conta i prodotti per ogni fornitore usando una subquery nella SELECT." },
      { query: "SELECT date_trunc('month', data_ordine) as mese, sum(quantita) as totale_vendite FROM ordini GROUP BY 1 ORDER BY 1;", description: "Calcola il totale delle vendite raggruppato per mese." },
      { query: "SELECT p.nome, ntile(4) OVER (ORDER BY p.prezzo) as quartile_prezzo FROM prodotti p;", description: "Dividi i prodotti in 4 gruppi (quartili) basati sul prezzo." },
      { query: "SELECT u.nome, first_value(o.data_ordine) OVER (PARTITION BY u.id ORDER BY o.data_ordine) as primo_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Trova la data del primissimo ordine per ogni utente." },
      { query: "SELECT p.categoria_id, p.nome, p.prezzo, dense_rank() OVER (PARTITION BY p.categoria_id ORDER BY p.prezzo DESC) as rank_cat FROM prodotti p;", description: "Classifica i prodotti per prezzo all'interno di ogni categoria (senza buchi nel ranking)." },
      { query: "SELECT u.paese, p.nome, count(*) as acquisti FROM utenti u JOIN ordini o ON u.id = o.utente_id JOIN prodotti p ON o.prodotto_id = p.id GROUP BY u.paese, p.nome ORDER BY u.paese, acquisti DESC;", description: "Analizza i prodotti più acquistati per ogni paese." },
      { query: "SELECT o.id, sum(p.prezzo * o.quantita) as totale, sum(sum(p.prezzo * o.quantita)) OVER () as grand_total FROM ordini o JOIN prodotti p ON o.prodotto_id = p.id GROUP BY o.id;", description: "Mostra il totale di ogni ordine insieme al fatturato globale totale." },
      { query: "SELECT p.nome, CASE WHEN p.prezzo < 50 THEN 'Economico' WHEN p.prezzo BETWEEN 50 AND 150 THEN 'Standard' ELSE 'Premium' END as fascia_prezzo FROM prodotti p;", description: "Segmenta i prodotti in fasce di prezzo (Economico, Standard, Premium)." },
      { query: "SELECT u.nome, lead(o.data_ordine) OVER (PARTITION BY u.id ORDER BY o.data_ordine) as prossimo_ordine FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Per ogni ordine, mostra la data dell'ordine successivo dello stesso utente." },
      { query: "SELECT p.nome, p.stock, sum(p.stock) OVER (ORDER BY p.id) as running_total_stock FROM prodotti p;", description: "Calcola il totale progressivo (running total) dello stock." },
      { query: "SELECT c.nome, string_agg(p.nome, ', ') as lista_prodotti FROM categorie c JOIN prodotti p ON c.id = p.categoria_id GROUP BY c.nome;", description: "Crea una lista separata da virgole di tutti i prodotti per ogni categoria." },
      { query: "SELECT u.id, u.nome FROM utenti u UNION SELECT f.id, f.azienda FROM fornitori f;", description: "Combina utenti e fornitori in un'unica lista (UNION)." },
      { query: "SELECT u.id FROM utenti u EXCEPT SELECT o.utente_id FROM ordini o;", description: "Trova gli ID degli utenti che NON sono presenti nella tabella ordini (EXCEPT)." },
      { query: "SELECT o.utente_id FROM ordini o INTERSECT SELECT r.utente_id FROM recensioni r;", description: "Trova gli utenti che hanno sia ordinato che scritto una recensione (INTERSECT)." },
      { query: "SELECT p.nome, p.prezzo, percent_rank() OVER (ORDER BY p.prezzo) as percentile FROM prodotti p;", description: "Calcola il rango percentuale del prezzo di ogni prodotto." },
      { query: "WITH RicaviPerMese AS (SELECT month(data_ordine) as m, sum(quantita) as q FROM ordini GROUP BY m) SELECT m, q, q - lag(q) OVER (ORDER BY m) as crescita FROM RicaviPerMese;", description: "Calcola la crescita delle vendite rispetto al mese precedente." },
      { query: "SELECT p.nome, cast(p.prezzo as INT) as prezzo_intero FROM prodotti p;", description: "Converti il prezzo decimale in un numero intero (CAST)." },
      { query: "SELECT u.nome, nullif(u.paese, 'Unknown') as paese_verificato FROM utenti u;", description: "Restituisce NULL se il paese è 'Unknown' (NULLIF)." },
      { query: "SELECT p.nome, round(p.prezzo, -1) as prezzo_arrotondato_decine FROM prodotti p;", description: "Arrotonda il prezzo alla decina più vicina." },
      { query: "SELECT u.nome, extract(dow from o.data_ordine) as giorno_settimana FROM utenti u JOIN ordini o ON u.id = o.utente_id;", description: "Estrai il giorno della settimana (0-6) dalla data dell'ordine." },
      { query: "SELECT p.nome, p.prezzo FROM prodotti p WHERE p.prezzo > ALL (SELECT prezzo FROM prodotti WHERE categoria_id = 3);", description: "Trova i prodotti che costano più di TUTTI i prodotti della categoria 3." },
      { query: "SELECT p.nome, p.prezzo FROM prodotti p WHERE p.prezzo > ANY (SELECT prezzo FROM prodotti WHERE categoria_id = 2);", description: "Trova i prodotti che costano più di ALMENO UNO dei prodotti della categoria 2." },
      { query: "SELECT u.nome, count(distinct o.prodotto_id) as prodotti_diversi_acquistati FROM utenti u JOIN ordini o ON u.id = o.utente_id GROUP BY u.nome;", description: "Conta quanti prodotti DIVERSI ha acquistato ogni utente." }
    ];

    hardSnippets.forEach((item, i) => {
      exercises.push({
        id: `copy_hard_${i}`,
        topicId: TopicId.Advanced,
        difficulty: Difficulty.Hard,
        title: `Snippet Hard #${i + 1}`,
        description: item.description,
        initialQuery: '',
        solutionQuery: item.query,
        hints: [],
        explanation: ''
      });
    });
  }

  return exercises;
};

export const COMPLEX_SNIPPETS: Exercise[] = [];