import { Difficulty } from '../types';
import { DaxExercise, DaxTopic, DaxTopicId } from '../daxTypes';

// Topics for the sidebar. Subtitle chips echo the SQL/Python labs.
export const DAX_TOPICS: DaxTopic[] = [
  { id: DaxTopicId.Aggregations, label: 'Aggregazioni', subtitle: 'SUM · AVERAGE · COUNTROWS · DISTINCTCOUNT' },
  { id: DaxTopicId.Logical, label: 'Logica', subtitle: 'IF · SWITCH' },
  { id: DaxTopicId.Calculate, label: 'CALCULATE & Filtri', subtitle: 'CALCULATE · ALL · FILTER' },
  { id: DaxTopicId.Iterators, label: 'Iteratori', subtitle: 'SUMX · AVERAGEX · RANKX' },
  { id: DaxTopicId.Relationships, label: 'Relazioni', subtitle: 'RELATED · RELATEDTABLE' },
  { id: DaxTopicId.TimeIntelligence, label: 'Time Intelligence', subtitle: 'TOTALYTD · SAMEPERIODLASTYEAR · DATEADD' },
  { id: DaxTopicId.Variables, label: 'Variabili', subtitle: 'VAR · RETURN' },
];

// The shared model, described once so scenarios can reference it.
export const DAX_MODEL_NOTE =
  "Modello (schema a stella): Vendite(Data, ProdottoID, ClienteID, Quantita, Importo) · " +
  "Prodotti(ProdottoID, Nome, Categoria, Costo) · Clienti(ClienteID, Nome, Citta, Segmento) · " +
  "Calendario(Data, Anno, Mese, Trimestre). Vendite si collega a Prodotti, Clienti e Calendario.";

export const DAX_EXERCISES: DaxExercise[] = [
  // ==================== AGGREGAZIONI ====================
  {
    id: 'dax-agg-e1', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Fatturato totale',
    scenario: "Ti serve una misura che restituisca il fatturato totale, cioè la somma di tutti gli importi in Vendite.",
    options: [
      'Fatturato = SUM(Vendite[Importo])',
      'Fatturato = COUNT(Vendite[Importo])',
      'Fatturato = Vendite[Importo]',
      'Fatturato = SUMX(Vendite)',
    ],
    correctIndex: 0,
    hints: ["SUM lavora su una singola colonna numerica.", "Una misura non può puntare a una colonna 'nuda' senza aggregarla."],
    explanation: "SUM somma i valori di una colonna. COUNT conta le righe non vuote, non le somma. Riferirsi a Vendite[Importo] senza aggregazione dà errore in una misura.",
    reference: 'Fatturato = SUM(Vendite[Importo])',
  },
  {
    id: 'dax-agg-e2', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Numero di righe di vendita',
    scenario: "Scrivi una misura che conti quante righe ci sono nella tabella Vendite (una riga = una vendita registrata).",
    starter: 'Righe Vendite = ',
    accepted: ['COUNTROWS(Vendite)', 'Righe Vendite = COUNTROWS(Vendite)'],
    hints: ["Vuoi contare righe di una tabella, non valori di una colonna.", "La funzione giusta finisce per ROWS."],
    explanation: "COUNTROWS conta le righe di una tabella. È più diretto e più affidabile di COUNT su una colonna, perché non dipende dai valori vuoti.",
    reference: 'Righe Vendite = COUNTROWS(Vendite)',
  },
  {
    id: 'dax-agg-m1', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Medium, kind: 'mcq',
    title: 'Clienti che hanno acquistato',
    scenario: "Vuoi sapere quanti clienti diversi compaiono nelle vendite. Un cliente che ha comprato dieci volte conta una volta sola.",
    options: [
      'Clienti attivi = COUNT(Vendite[ClienteID])',
      'Clienti attivi = DISTINCTCOUNT(Vendite[ClienteID])',
      'Clienti attivi = COUNTROWS(Clienti)',
      'Clienti attivi = SUM(Vendite[ClienteID])',
    ],
    correctIndex: 1,
    hints: ["Ti interessano i valori distinti, non tutte le occorrenze.", "COUNTROWS(Clienti) conta l'anagrafica, non chi ha davvero comprato."],
    explanation: "DISTINCTCOUNT conta i valori unici. COUNT conterebbe ogni riga di vendita, COUNTROWS(Clienti) conterebbe anche i clienti che non hanno mai acquistato.",
    reference: 'Clienti attivi = DISTINCTCOUNT(Vendite[ClienteID])',
  },
  {
    id: 'dax-agg-m2', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Importo medio per riga',
    scenario: "Scrivi una misura per l'importo medio di una riga di vendita.",
    starter: 'Importo medio = ',
    accepted: ['AVERAGE(Vendite[Importo])', 'Importo medio = AVERAGE(Vendite[Importo])'],
    hints: ["Esiste un'aggregazione dedicata alla media.", "Non serve dividere a mano SUM per COUNTROWS."],
    explanation: "AVERAGE calcola la media aritmetica di una colonna, gestendo da sola numeratore e denominatore. Fare SUM diviso COUNTROWS darebbe lo stesso numero ma con più codice e più margine di errore.",
    reference: 'Importo medio = AVERAGE(Vendite[Importo])',
  },
  {
    id: 'dax-agg-h1', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Quantità media per ordine, non per riga',
    scenario: "Ogni riga di Vendite è una riga d'ordine. Vuoi la quantità media venduta per prodotto distinto, cioè la quantità totale divisa per il numero di prodotti diversi venduti. Quale misura regge anche quando cambia il contesto di filtro?",
    options: [
      'Media = AVERAGE(Vendite[Quantita])',
      'Media = SUM(Vendite[Quantita]) / DISTINCTCOUNT(Vendite[ProdottoID])',
      'Media = DIVIDE(SUM(Vendite[Quantita]), DISTINCTCOUNT(Vendite[ProdottoID]))',
      'Media = SUMX(Prodotti, Vendite[Quantita])',
    ],
    correctIndex: 2,
    hints: ["AVERAGE fa la media per riga, non per prodotto distinto.", "Con una divisione, proteggiti dal denominatore zero."],
    explanation: "Serve la quantità totale divisa per i prodotti distinti. DIVIDE fa la stessa cosa dell'operatore /, ma restituisce vuoto invece di un errore quando il denominatore è zero, quindi è la scelta solida in una misura.",
    reference: 'Media = DIVIDE(SUM(Vendite[Quantita]), DISTINCTCOUNT(Vendite[ProdottoID]))',
  },

  // ==================== LOGICA ====================
  {
    id: 'dax-log-e1', topicId: DaxTopicId.Logical, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Etichetta alto/basso valore',
    scenario: "In una colonna calcolata su Vendite vuoi scrivere \"Alto\" se l'importo supera 1000, altrimenti \"Basso\".",
    options: [
      'Fascia = IF(Vendite[Importo] > 1000, "Alto", "Basso")',
      'Fascia = IF(Vendite[Importo] > 1000, "Alto")',
      'Fascia = SWITCH(Vendite[Importo] > 1000)',
      'Fascia = IF("Alto", Vendite[Importo] > 1000, "Basso")',
    ],
    correctIndex: 0,
    hints: ["IF vuole tre argomenti: test, valore se vero, valore se falso.", "Il test va per primo."],
    explanation: "IF valuta la condizione e restituisce il secondo argomento se vera, il terzo se falsa. Senza il terzo argomento le righe sotto soglia resterebbero vuote invece di dire \"Basso\".",
    reference: 'Fascia = IF(Vendite[Importo] > 1000, "Alto", "Basso")',
  },
  {
    id: 'dax-log-m1', topicId: DaxTopicId.Logical, difficulty: Difficulty.Medium, kind: 'mcq',
    title: 'Più categorie con SWITCH',
    scenario: "Vuoi assegnare una priorità di magazzino in base alla categoria del prodotto: Bevande e Alimentari sono \"Deperibile\", il resto \"Standard\". Qual è la forma più pulita?",
    options: [
      'Priorita = IF(Prodotti[Categoria]="Bevande", "Deperibile", IF(Prodotti[Categoria]="Alimentari", "Deperibile", "Standard"))',
      'Priorita = SWITCH(Prodotti[Categoria], "Bevande", "Deperibile", "Alimentari", "Deperibile", "Standard")',
      'Priorita = SWITCH(Prodotti[Categoria], "Deperibile", "Standard")',
      'Priorita = SWITCH("Bevande", "Alimentari", "Deperibile")',
    ],
    correctIndex: 1,
    hints: ["SWITCH confronta una colonna con una lista di valori.", "L'ultimo argomento senza coppia è il default."],
    explanation: "SWITCH legge il valore della categoria e lo confronta con le coppie valore/risultato. L'ultimo argomento è il default. Fa lo stesso lavoro degli IF annidati, ma si legge molto meglio.",
    reference: 'Priorita = SWITCH(Prodotti[Categoria], "Bevande", "Deperibile", "Alimentari", "Deperibile", "Standard")',
  },
  {
    id: 'dax-log-h1', topicId: DaxTopicId.Logical, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Fasce numeriche con SWITCH(TRUE())',
    scenario: "Vuoi una fascia di sconto in base all'importo: sotto 100 \"Nessuno\", da 100 a 499 \"5%\", da 500 in su \"10%\". Con SWITCH su intervalli, qual è la forma corretta?",
    options: [
      'Sconto = SWITCH(Vendite[Importo], <100, "Nessuno", <500, "5%", "10%")',
      'Sconto = SWITCH(TRUE(), Vendite[Importo] < 100, "Nessuno", Vendite[Importo] < 500, "5%", "10%")',
      'Sconto = SWITCH(Vendite[Importo] < 100, "Nessuno", "5%", "10%")',
      'Sconto = IF(TRUE(), Vendite[Importo], "10%")',
    ],
    correctIndex: 1,
    hints: ["SWITCH confronta per uguaglianza, non con < o >.", "Il trucco è mettere TRUE() come primo argomento e condizioni come casi."],
    explanation: "SWITCH confronta il primo argomento con ogni caso per uguaglianza. Mettendo TRUE(), ogni caso diventa una condizione booleana e viene scelto il primo che risulta vero. È il modo idiomatico di gestire gli intervalli.",
    reference: 'Sconto = SWITCH(TRUE(), Vendite[Importo] < 100, "Nessuno", Vendite[Importo] < 500, "5%", "10%")',
  },

  // ==================== CALCULATE & FILTRI ====================
  {
    id: 'dax-calc-e1', topicId: DaxTopicId.Calculate, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Fatturato di una sola categoria',
    scenario: "Vuoi una misura col fatturato delle sole Bevande, a prescindere da cosa filtra la pagina.",
    options: [
      'Bevande = SUM(Vendite[Importo]) WHERE Prodotti[Categoria] = "Bevande"',
      'Bevande = CALCULATE(SUM(Vendite[Importo]), Prodotti[Categoria] = "Bevande")',
      'Bevande = FILTER(SUM(Vendite[Importo]), "Bevande")',
      'Bevande = SUM(Vendite[Importo], Prodotti[Categoria] = "Bevande")',
    ],
    correctIndex: 1,
    hints: ["DAX non ha WHERE.", "CALCULATE modifica il contesto di filtro attorno a un'aggregazione."],
    explanation: "CALCULATE valuta l'espressione applicando i filtri che passi come argomenti. È il modo standard di forzare un filtro. In DAX non esiste una clausola WHERE come in SQL.",
    reference: 'Bevande = CALCULATE(SUM(Vendite[Importo]), Prodotti[Categoria] = "Bevande")',
  },
  {
    id: 'dax-calc-m1', topicId: DaxTopicId.Calculate, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Percentuale sul totale',
    scenario: "Scrivi la quota percentuale del fatturato della selezione corrente sul totale di tutti i prodotti. Usa ALL(Prodotti) per rimuovere il filtro sui prodotti al denominatore.",
    starter: 'Quota % = ',
    accepted: [
      'DIVIDE(SUM(Vendite[Importo]), CALCULATE(SUM(Vendite[Importo]), ALL(Prodotti)))',
      'Quota % = DIVIDE(SUM(Vendite[Importo]), CALCULATE(SUM(Vendite[Importo]), ALL(Prodotti)))',
    ],
    hints: ["Al denominatore ti serve il totale senza il filtro dei prodotti.", "ALL(Prodotti) toglie qualsiasi filtro sulla tabella Prodotti."],
    explanation: "ALL rimuove i filtri da una tabella, così il denominatore resta il totale generale mentre il numeratore segue la selezione. DIVIDE protegge dal denominatore zero.",
    reference: 'Quota % = DIVIDE(SUM(Vendite[Importo]), CALCULATE(SUM(Vendite[Importo]), ALL(Prodotti)))',
  },
  {
    id: 'dax-calc-h1', topicId: DaxTopicId.Calculate, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Filtro complesso con FILTER',
    scenario: "Vuoi il fatturato delle sole righe con quantità maggiore di 10. Il filtro è su una colonna della stessa tabella di fatti e va valutato riga per riga. Qual è la forma corretta?",
    options: [
      'Big = CALCULATE(SUM(Vendite[Importo]), Vendite[Quantita] > 10)',
      'Big = CALCULATE(SUM(Vendite[Importo]), FILTER(Vendite, Vendite[Quantita] > 10))',
      'Big = FILTER(Vendite, Vendite[Quantita] > 10)',
      'Big = SUMX(FILTER(Vendite, Vendite[Quantita] > 10))',
    ],
    correctIndex: 1,
    hints: ["Entrambe le prime due 'funzionano', ma una è più esplicita e sicura su tabelle grandi.", "FILTER restituisce una tabella che CALCULATE usa come contesto."],
    explanation: "Un filtro booleano semplice dentro CALCULATE viene comunque tradotto in FILTER sotto il cofano, ma scrivere FILTER(Vendite, ...) in modo esplicito rende chiaro che stai iterando la tabella di fatti ed è la forma consigliata quando la condizione è su una colonna dei fatti.",
    reference: 'Big = CALCULATE(SUM(Vendite[Importo]), FILTER(Vendite, Vendite[Quantita] > 10))',
  },

  // ==================== ITERATORI ====================
  {
    id: 'dax-iter-e1', topicId: DaxTopicId.Iterators, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'A cosa serve la X',
    scenario: "Qual è la differenza tra SUM e SUMX?",
    options: [
      'Sono identiche, X è solo un alias più veloce.',
      'SUM somma una colonna già pronta; SUMX calcola un\'espressione riga per riga e poi somma i risultati.',
      'SUMX somma solo numeri interi.',
      'SUM funziona sulle misure, SUMX sulle colonne.',
    ],
    correctIndex: 1,
    hints: ["La X segnala una funzione iteratore.", "Pensa a quando il valore da sommare non esiste ancora come colonna."],
    explanation: "SUMX scorre una tabella, valuta l'espressione per ogni riga e somma i risultati. Serve quando il valore da sommare va calcolato al volo, per esempio prezzo per quantità. SUM funziona solo su una colonna che esiste già.",
    reference: 'Esempio = SUMX(Vendite, Vendite[Quantita] * Vendite[Importo])',
  },
  {
    id: 'dax-iter-m1', topicId: DaxTopicId.Iterators, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Margine totale',
    scenario: "Ogni riga vale Importo di ricavo; il costo unitario sta in Prodotti[Costo] e la quantità in Vendite[Quantita]. Scrivi il margine totale: somma riga per riga di Importo meno costo per quantità.",
    starter: 'Margine = ',
    accepted: [
      'SUMX(Vendite, Vendite[Importo] - RELATED(Prodotti[Costo]) * Vendite[Quantita])',
      'Margine = SUMX(Vendite, Vendite[Importo] - RELATED(Prodotti[Costo]) * Vendite[Quantita])',
    ],
    hints: ["Il calcolo cambia riga per riga, quindi ti serve un iteratore.", "Il costo è su Prodotti: raggiungilo con RELATED dentro l'iterazione su Vendite."],
    explanation: "SUMX itera Vendite. Dentro l'iterazione hai il contesto di riga, quindi RELATED porta il costo dal prodotto collegato. Sommi ricavo meno costo per quantità su ogni riga.",
    reference: 'Margine = SUMX(Vendite, Vendite[Importo] - RELATED(Prodotti[Costo]) * Vendite[Quantita])',
  },
  {
    id: 'dax-iter-h1', topicId: DaxTopicId.Iterators, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Classifica dei prodotti',
    scenario: "Vuoi una misura che dia la posizione in classifica di ogni prodotto per fatturato, dal più alto (1) al più basso. Quale funzione usi?",
    options: [
      'Rank = RANKX(ALL(Prodotti[Nome]), [Fatturato])',
      'Rank = RANK(Prodotti[Nome], [Fatturato])',
      'Rank = TOPN(1, Prodotti, [Fatturato])',
      'Rank = ORDERBY(Prodotti, [Fatturato])',
    ],
    correctIndex: 0,
    hints: ["RANKX è l'iteratore che assegna un rango.", "Gli serve la tabella su cui classificare, di solito con ALL per ignorare il filtro di riga della visualizzazione."],
    explanation: "RANKX scorre la tabella passata come primo argomento, valuta la misura per ogni elemento e assegna la posizione. ALL(Prodotti[Nome]) fa sì che la classifica consideri tutti i prodotti e non solo la riga corrente.",
    reference: 'Rank = RANKX(ALL(Prodotti[Nome]), [Fatturato])',
  },

  // ==================== RELAZIONI ====================
  {
    id: 'dax-rel-e1', topicId: DaxTopicId.Relationships, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Portare la categoria nei fatti',
    scenario: "In una colonna calcolata su Vendite vuoi vedere la categoria del prodotto, che vive in Prodotti. La relazione Vendite verso Prodotti esiste già.",
    options: [
      'Categoria = Prodotti[Categoria]',
      'Categoria = RELATED(Prodotti[Categoria])',
      'Categoria = LOOKUP(Prodotti[Categoria])',
      'Categoria = RELATEDTABLE(Prodotti)',
    ],
    correctIndex: 1,
    hints: ["Stai andando dal lato 'molti' (Vendite) al lato 'uno' (Prodotti).", "In quella direzione si usa RELATED."],
    explanation: "RELATED segue una relazione dal lato molti al lato uno e riporta un valore singolo. RELATEDTABLE va nella direzione opposta e restituisce una tabella, non un valore.",
    reference: 'Categoria = RELATED(Prodotti[Categoria])',
  },
  {
    id: 'dax-rel-m1', topicId: DaxTopicId.Relationships, difficulty: Difficulty.Medium, kind: 'mcq',
    title: 'Quante vendite per prodotto',
    scenario: "In una colonna calcolata su Prodotti vuoi contare quante righe di Vendite riguardano quel prodotto. Stai andando dal lato uno al lato molti.",
    options: [
      'Numero vendite = COUNTROWS(RELATEDTABLE(Vendite))',
      'Numero vendite = RELATED(Vendite)',
      'Numero vendite = COUNTROWS(Vendite)',
      'Numero vendite = COUNTROWS(RELATED(Vendite))',
    ],
    correctIndex: 0,
    hints: ["Dal lato uno al lato molti serve RELATEDTABLE.", "RELATEDTABLE restituisce una tabella, che poi conti."],
    explanation: "RELATEDTABLE restituisce le righe collegate dal lato molti, filtrate per la riga corrente di Prodotti. COUNTROWS le conta. COUNTROWS(Vendite) da solo conterebbe l'intera tabella senza rispettare la relazione.",
    reference: 'Numero vendite = COUNTROWS(RELATEDTABLE(Vendite))',
  },
  {
    id: 'dax-rel-h1', topicId: DaxTopicId.Relationships, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Costo medio pesato per categoria',
    scenario: "Vuoi una misura del prezzo medio effettivo per categoria: fatturato totale diviso quantità totale. Entrambe le grandezze vivono in Vendite, ma vuoi filtrare per Prodotti[Categoria] nella visualizzazione. Cosa garantisce che il filtro di categoria arrivi ai fatti?",
    options: [
      'La relazione attiva Vendite-Prodotti propaga il filtro di categoria alle righe di Vendite',
      'Serve RELATED dentro la misura per far arrivare il filtro',
      'Serve USERELATIONSHIP perché le misure ignorano le relazioni',
      'Il filtro non arriva: bisogna duplicare la categoria in Vendite',
    ],
    correctIndex: 0,
    hints: ["Le misure rispettano già le relazioni attive del modello.", "Il filtro si propaga dal lato uno (Prodotti) al lato molti (Vendite)."],
    explanation: "Il contesto di filtro si propaga lungo le relazioni attive, dal lato uno al lato molti. Filtrando Prodotti[Categoria], solo le righe di Vendite di quella categoria restano nel contesto, quindi DIVIDE(SUM Importo, SUM Quantita) è già corretto senza RELATED né USERELATIONSHIP.",
    reference: 'Prezzo medio = DIVIDE(SUM(Vendite[Importo]), SUM(Vendite[Quantita]))',
  },

  // ==================== TIME INTELLIGENCE ====================
  {
    id: 'dax-time-e1', topicId: DaxTopicId.TimeIntelligence, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Fatturato da inizio anno',
    scenario: "Vuoi il fatturato progressivo da inizio anno (year to date). Calendario è la tabella data del modello.",
    options: [
      'YTD = TOTALYTD(SUM(Vendite[Importo]), Calendario[Data])',
      'YTD = SUM(Vendite[Importo]) * 12',
      'YTD = CALCULATE(SUM(Vendite[Importo]), YEAR)',
      'YTD = DATESYTD(Vendite[Importo])',
    ],
    correctIndex: 0,
    hints: ["Esiste una funzione dedicata al year to date.", "Vuole l'espressione e la colonna data."],
    explanation: "TOTALYTD accumula l'espressione dall'inizio dell'anno fino alla data nel contesto, usando la colonna data del calendario. Le funzioni di time intelligence hanno bisogno di una tabella data marcata come tale.",
    reference: 'YTD = TOTALYTD(SUM(Vendite[Importo]), Calendario[Data])',
  },
  {
    id: 'dax-time-m1', topicId: DaxTopicId.TimeIntelligence, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Fatturato anno precedente',
    scenario: "Scrivi una misura col fatturato dello stesso periodo dell'anno scorso, usando SAMEPERIODLASTYEAR sulla colonna Calendario[Data].",
    starter: 'Fatturato AP = ',
    accepted: [
      'CALCULATE(SUM(Vendite[Importo]), SAMEPERIODLASTYEAR(Calendario[Data]))',
      'Fatturato AP = CALCULATE(SUM(Vendite[Importo]), SAMEPERIODLASTYEAR(Calendario[Data]))',
    ],
    hints: ["SAMEPERIODLASTYEAR sposta il contesto data indietro di un anno.", "Va passata come filtro dentro CALCULATE."],
    explanation: "SAMEPERIODLASTYEAR restituisce le stesse date spostate di un anno indietro. Passata a CALCULATE, sposta il contesto e l'espressione viene valutata sul periodo dell'anno prima.",
    reference: 'Fatturato AP = CALCULATE(SUM(Vendite[Importo]), SAMEPERIODLASTYEAR(Calendario[Data]))',
  },
  {
    id: 'dax-time-h1', topicId: DaxTopicId.TimeIntelligence, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Spostare di un mese con DATEADD',
    scenario: "Vuoi il fatturato del mese precedente. Quale espressione lo calcola correttamente rispettando il contesto di data?",
    options: [
      'Mese prec = CALCULATE(SUM(Vendite[Importo]), DATEADD(Calendario[Data], -1, MONTH))',
      'Mese prec = SUM(Vendite[Importo]) - 1',
      'Mese prec = PREVIOUSMONTH(Vendite[Importo])',
      'Mese prec = DATEADD(SUM(Vendite[Importo]), -1, MONTH)',
    ],
    correctIndex: 0,
    hints: ["DATEADD sposta un intervallo di date di un numero di periodi.", "Il primo argomento è una colonna data, non una misura."],
    explanation: "DATEADD sposta l'insieme di date del contesto di un numero di unità, qui meno un mese. Passata dentro CALCULATE, l'espressione viene ricalcolata sul mese precedente. Il primo argomento deve essere la colonna data.",
    reference: 'Mese prec = CALCULATE(SUM(Vendite[Importo]), DATEADD(Calendario[Data], -1, MONTH))',
  },

  // ==================== VARIABILI ====================
  {
    id: 'dax-var-e1', topicId: DaxTopicId.Variables, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Perché usare VAR',
    scenario: "Qual è il vantaggio principale di dichiarare una variabile con VAR dentro una misura?",
    options: [
      'Rende la misura visibile in altre tabelle',
      'Calcola l\'espressione una volta sola e la riusa, rendendo la misura più leggibile e spesso più veloce',
      'Converte automaticamente il testo in numeri',
      'Obbliga Power BI a ricalcolare a ogni riga',
    ],
    correctIndex: 1,
    hints: ["Pensa a un valore che ti serve due o tre volte nella stessa formula.", "Una variabile si valuta una volta, nel punto in cui è definita."],
    explanation: "Una variabile viene valutata una volta e poi riusata. Questo evita di ripetere lo stesso calcolo, rende la formula più chiara e spesso migliora le prestazioni. Il valore resta fisso al contesto in cui è stata definita.",
    reference: 'VAR Vendite2024 = CALCULATE(SUM(Vendite[Importo]), Calendario[Anno] = 2024) RETURN Vendite2024',
  },
  {
    id: 'dax-var-m1', topicId: DaxTopicId.Variables, difficulty: Difficulty.Medium, kind: 'mcq',
    title: 'Crescita anno su anno con variabili',
    scenario: "Vuoi la variazione percentuale del fatturato rispetto all'anno scorso, scritta in modo leggibile. Quale struttura è corretta?",
    options: [
      'VAR Ora = SUM(Vendite[Importo]) VAR Prima = CALCULATE(SUM(Vendite[Importo]), SAMEPERIODLASTYEAR(Calendario[Data])) RETURN DIVIDE(Ora - Prima, Prima)',
      'RETURN DIVIDE(Ora - Prima, Prima) VAR Ora = ... VAR Prima = ...',
      'VAR Ora = SUM(Vendite[Importo]) RETURN Ora VAR Prima = ...',
      'DIVIDE(SUM(Vendite[Importo]) - SAMEPERIODLASTYEAR(Calendario[Data]))',
    ],
    correctIndex: 0,
    hints: ["Tutte le VAR vanno prima di RETURN.", "RETURN chiude la misura e usa le variabili definite sopra."],
    explanation: "Prima si dichiarano le variabili con VAR, poi un solo RETURN chiude la misura usando quei valori. Qui calcoli fatturato attuale e dell'anno prima, poi la variazione con DIVIDE, che evita la divisione per zero.",
    reference: 'Crescita = VAR Ora = SUM(Vendite[Importo]) VAR Prima = CALCULATE(SUM(Vendite[Importo]), SAMEPERIODLASTYEAR(Calendario[Data])) RETURN DIVIDE(Ora - Prima, Prima)',
  },
  {
    id: 'dax-var-h1', topicId: DaxTopicId.Variables, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'Il contesto congelato di una variabile',
    scenario: "Dentro una misura definisci VAR Totale = SUM(Vendite[Importo]) e poi la usi dentro un CALCULATE che cambia il filtro. Cosa restituisce la variabile dentro quel CALCULATE?",
    options: [
      'Il valore ricalcolato con il nuovo filtro del CALCULATE',
      'Il valore calcolato quando la variabile è stata definita, ignorando il nuovo filtro',
      'Un errore, perché le variabili non si usano dentro CALCULATE',
      'Sempre il totale generale di tutte le vendite',
    ],
    correctIndex: 1,
    hints: ["Una variabile si valuta una volta, nel punto della definizione.", "CALCULATE non 'torna indietro' a ricalcolarla."],
    explanation: "Una variabile cattura il suo valore nel contesto in cui viene definita e non cambia più. Anche se la usi dentro un CALCULATE che modifica i filtri, resta il valore congelato. È un punto d'esame classico e una fonte frequente di bug.",
    reference: 'VAR Totale = SUM(Vendite[Importo]) RETURN CALCULATE(Totale, ALL(Prodotti))  // Totale resta quello iniziale',
  },
];

// Totals per topic (across difficulties), computed from the data so they never drift.
export const DAX_TOPIC_TOTALS: Record<string, number> = DAX_EXERCISES.reduce((acc, ex) => {
  acc[ex.topicId] = (acc[ex.topicId] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export function getDaxExercises(difficulty: Difficulty): DaxExercise[] {
  return DAX_EXERCISES.filter((e) => e.difficulty === difficulty);
}
