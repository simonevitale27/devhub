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

  // ==================== BATCH 2: più esercizi, molti "scrivi la misura" ====================

  // --- Aggregazioni ---
  {
    id: 'dax-agg-e3', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Quantità totale venduta',
    scenario: "Scrivi una misura che sommi tutte le quantità vendute.",
    starter: 'Quantita totale = ',
    accepted: ['SUM(Vendite[Quantita])', 'Quantita totale = SUM(Vendite[Quantita])'],
    hints: ["La colonna da sommare è Quantita, nella tabella Vendite.", "Una sola funzione di aggregazione su una colonna."],
    explanation: "SUM somma i valori numerici di una colonna. Qui accumula le quantità di tutte le righe di vendita nel contesto di filtro corrente.",
    reference: 'Quantita totale = SUM(Vendite[Quantita])',
  },
  {
    id: 'dax-agg-e4', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Prodotti diversi venduti',
    scenario: "Scrivi una misura che conti quanti prodotti DIVERSI sono stati venduti almeno una volta.",
    starter: 'Prodotti venduti = ',
    accepted: ['DISTINCTCOUNT(Vendite[ProdottoID])', 'Prodotti venduti = DISTINCTCOUNT(Vendite[ProdottoID])'],
    hints: ["Ti servono i valori unici, non tutte le righe.", "La funzione conta i valori distinti di una colonna."],
    explanation: "DISTINCTCOUNT conta i valori unici di ProdottoID nelle vendite: un prodotto comprato dieci volte conta una volta sola.",
    reference: 'Prodotti venduti = DISTINCTCOUNT(Vendite[ProdottoID])',
  },
  {
    id: 'dax-agg-m3', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Scontrino medio',
    scenario: "Vuoi l'importo medio per ordine distinto: fatturato totale diviso numero di ordini. Nel nostro modello un ordine è una riga di Vendite, quindi usa il conteggio delle righe. Scrivi la misura con DIVIDE.",
    starter: 'Scontrino medio = ',
    accepted: [
      'DIVIDE(SUM(Vendite[Importo]), COUNTROWS(Vendite))',
      'Scontrino medio = DIVIDE(SUM(Vendite[Importo]), COUNTROWS(Vendite))',
    ],
    hints: ["Numeratore: la somma degli importi. Denominatore: quante righe di vendita.", "DIVIDE protegge dal denominatore zero meglio dell'operatore /."],
    explanation: "DIVIDE fa la divisione restituendo vuoto (non un errore) quando il denominatore è zero. Qui rapporta il fatturato al numero di righe di vendita.",
    reference: 'Scontrino medio = DIVIDE(SUM(Vendite[Importo]), COUNTROWS(Vendite))',
  },
  {
    id: 'dax-agg-h2', topicId: DaxTopicId.Aggregations, difficulty: Difficulty.Hard, kind: 'formula',
    title: 'Prezzo medio effettivo',
    scenario: "Scrivi la misura del prezzo medio effettivo: fatturato totale diviso quantità totale (il prezzo medio per pezzo, non per riga).",
    starter: 'Prezzo medio = ',
    accepted: [
      'DIVIDE(SUM(Vendite[Importo]), SUM(Vendite[Quantita]))',
      'Prezzo medio = DIVIDE(SUM(Vendite[Importo]), SUM(Vendite[Quantita]))',
    ],
    hints: ["Non è AVERAGE di una colonna: è un rapporto tra due somme.", "Importo totale sopra, quantità totale sotto."],
    explanation: "Il rapporto tra la somma degli importi e la somma delle quantità dà il prezzo medio per unità venduta, che pesa ogni riga per la sua quantità. AVERAGE(Importo) darebbe invece la media per riga, un numero diverso.",
    reference: 'Prezzo medio = DIVIDE(SUM(Vendite[Importo]), SUM(Vendite[Quantita]))',
  },

  // --- Logica ---
  {
    id: 'dax-log-e2', topicId: DaxTopicId.Logical, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Margine in perdita',
    scenario: "In una colonna calcolata su Prodotti vuoi l'etichetta 'In perdita' se il costo supera 100, altrimenti 'OK'. Scrivi la colonna con IF.",
    starter: 'Allerta costo = ',
    accepted: [
      'IF(Prodotti[Costo] > 100, "In perdita", "OK")',
      'Allerta costo = IF(Prodotti[Costo] > 100, "In perdita", "OK")',
    ],
    hints: ["IF vuole test, valore-se-vero, valore-se-falso.", "Il confronto è sulla colonna Costo di Prodotti."],
    explanation: "IF valuta la condizione riga per riga e restituisce la seconda espressione se vera, la terza se falsa. Senza il terzo argomento, le righe sotto soglia resterebbero vuote.",
    reference: 'Allerta costo = IF(Prodotti[Costo] > 100, "In perdita", "OK")',
  },
  {
    id: 'dax-log-m2', topicId: DaxTopicId.Logical, difficulty: Difficulty.Medium, kind: 'mcq',
    title: 'IF annidati o SWITCH',
    scenario: "Devi assegnare una fascia in base al Segmento del cliente: 'Gold' e 'Platinum' danno priorità 'Alta', tutto il resto 'Normale'. Qual è la forma più leggibile?",
    options: [
      'Priorita = IF(Clienti[Segmento] = "Gold" || Clienti[Segmento] = "Platinum", "Alta", "Normale")',
      'Priorita = SWITCH(Clienti[Segmento], "Gold" || "Platinum", "Alta", "Normale")',
      'Priorita = IF(Clienti[Segmento] = "Gold", "Alta")',
      'Priorita = SWITCH("Alta", "Gold", "Platinum")',
    ],
    correctIndex: 0,
    hints: ["Due valori portano allo stesso esito: puoi unirli con l'OR (||).", "SWITCH confronta con un valore per caso, non con un'espressione OR."],
    explanation: "Con due valori diversi che danno lo stesso risultato, un IF con la condizione OR (||) è chiaro e corretto. La forma SWITCH con \"Gold\" || \"Platinum\" non funziona: SWITCH confronta il segmento con un singolo valore per caso.",
    reference: 'Priorita = IF(Clienti[Segmento] = "Gold" || Clienti[Segmento] = "Platinum", "Alta", "Normale")',
  },
  {
    id: 'dax-log-h2', topicId: DaxTopicId.Logical, difficulty: Difficulty.Hard, kind: 'formula',
    title: 'Semaforo fatturato',
    scenario: "Scrivi una misura che, in base al fatturato totale, restituisca 'Rosso' sotto 1000, 'Giallo' fino a 5000, 'Verde' oltre. Usa SWITCH(TRUE(), ...).",
    starter: 'Semaforo = ',
    accepted: [
      'SWITCH(TRUE(), SUM(Vendite[Importo]) < 1000, "Rosso", SUM(Vendite[Importo]) < 5000, "Giallo", "Verde")',
      'Semaforo = SWITCH(TRUE(), SUM(Vendite[Importo]) < 1000, "Rosso", SUM(Vendite[Importo]) < 5000, "Giallo", "Verde")',
      'SWITCH(TRUE(), [Fatturato] < 1000, "Rosso", [Fatturato] < 5000, "Giallo", "Verde")',
      'Semaforo = SWITCH(TRUE(), [Fatturato] < 1000, "Rosso", [Fatturato] < 5000, "Giallo", "Verde")',
    ],
    hints: ["SWITCH confronta per uguaglianza: mettendo TRUE() ogni caso diventa una condizione.", "I casi si valutano in ordine: prima la soglia più bassa."],
    explanation: "SWITCH(TRUE(), condizione1, risultato1, ...) sceglie il primo caso la cui condizione è vera. È il modo idiomatico per gestire intervalli, dove IF annidati sarebbero più difficili da leggere.",
    reference: 'Semaforo = SWITCH(TRUE(), [Fatturato] < 1000, "Rosso", [Fatturato] < 5000, "Giallo", "Verde")',
  },

  // --- CALCULATE & Filtri ---
  {
    id: 'dax-calc-e2', topicId: DaxTopicId.Calculate, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Fatturato di una città',
    scenario: "Scrivi una misura col fatturato dei soli clienti di Milano, indipendentemente dai filtri di pagina. Usa CALCULATE.",
    starter: 'Fatturato Milano = ',
    accepted: [
      'CALCULATE(SUM(Vendite[Importo]), Clienti[Citta] = "Milano")',
      'Fatturato Milano = CALCULATE(SUM(Vendite[Importo]), Clienti[Citta] = "Milano")',
    ],
    hints: ["CALCULATE prende l'espressione e poi i filtri da applicare.", "Il filtro è sulla colonna Citta della tabella Clienti."],
    explanation: "CALCULATE valuta l'aggregazione applicando il filtro passato come argomento. La relazione Clienti-Vendite propaga il filtro di città alle righe di vendita.",
    reference: 'Fatturato Milano = CALCULATE(SUM(Vendite[Importo]), Clienti[Citta] = "Milano")',
  },
  {
    id: 'dax-calc-m2', topicId: DaxTopicId.Calculate, difficulty: Difficulty.Medium, kind: 'mcq',
    title: 'A cosa serve ALL dentro CALCULATE',
    scenario: "In una misura % sul totale scrivi CALCULATE(SUM(Vendite[Importo]), ALL(Prodotti)) al denominatore. Cosa fa ALL(Prodotti) qui?",
    options: [
      'Ordina i prodotti alfabeticamente',
      'Rimuove i filtri sulla tabella Prodotti, così il denominatore resta il totale generale',
      'Seleziona solo il primo prodotto',
      'Conta i prodotti distinti',
    ],
    correctIndex: 1,
    hints: ["ALL è un modificatore del contesto di filtro.", "Serve per avere un totale che NON segue la selezione di riga."],
    explanation: "ALL(Prodotti) rimuove qualunque filtro sulla tabella Prodotti dentro quel CALCULATE, così il denominatore rimane il fatturato di tutti i prodotti mentre il numeratore segue la riga corrente. È il cuore del calcolo delle percentuali sul totale.",
    reference: 'Quota % = DIVIDE([Fatturato], CALCULATE([Fatturato], ALL(Prodotti)))',
  },
  {
    id: 'dax-calc-h2', topicId: DaxTopicId.Calculate, difficulty: Difficulty.Hard, kind: 'formula',
    title: 'Fatturato premium sopra soglia',
    scenario: "Scrivi il fatturato delle sole righe con importo superiore a 500. La condizione è su una colonna dei fatti, quindi usa FILTER dentro CALCULATE.",
    starter: 'Fatturato big = ',
    accepted: [
      'CALCULATE(SUM(Vendite[Importo]), FILTER(Vendite, Vendite[Importo] > 500))',
      'Fatturato big = CALCULATE(SUM(Vendite[Importo]), FILTER(Vendite, Vendite[Importo] > 500))',
    ],
    hints: ["FILTER restituisce la tabella filtrata che CALCULATE userà come contesto.", "Itera Vendite tenendo le righe con importo maggiore di 500."],
    explanation: "FILTER(Vendite, Vendite[Importo] > 500) costruisce la tabella delle sole righe volute, e CALCULATE somma gli importi in quel contesto. È la forma esplicita da preferire quando filtri una colonna della tabella di fatti.",
    reference: 'Fatturato big = CALCULATE(SUM(Vendite[Importo]), FILTER(Vendite, Vendite[Importo] > 500))',
  },

  // --- Iteratori ---
  {
    id: 'dax-iter-e2', topicId: DaxTopicId.Iterators, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Valore riga per riga',
    scenario: "Nel modello non esiste una colonna 'valore' pronta. Scrivi una misura che sommi, riga per riga, Quantita per Importo usando un iteratore.",
    starter: 'Valore = ',
    accepted: [
      'SUMX(Vendite, Vendite[Quantita] * Vendite[Importo])',
      'Valore = SUMX(Vendite, Vendite[Quantita] * Vendite[Importo])',
    ],
    hints: ["Il valore va calcolato per ogni riga prima di sommare: serve un iteratore.", "SUMX(tabella, espressione) valuta l'espressione riga per riga."],
    explanation: "SUMX scorre Vendite, calcola Quantita per Importo su ogni riga e somma i risultati. SUM non basta perché il prodotto tra le due colonne non esiste come colonna pronta.",
    reference: 'Valore = SUMX(Vendite, Vendite[Quantita] * Vendite[Importo])',
  },
  {
    id: 'dax-iter-h2', topicId: DaxTopicId.Iterators, difficulty: Difficulty.Hard, kind: 'mcq',
    title: 'AVERAGEX vs AVERAGE',
    scenario: "Vuoi la media del valore (Quantita per Importo) per riga di vendita. Quale misura è corretta?",
    options: [
      'Media valore = AVERAGE(Vendite[Importo] * Vendite[Quantita])',
      'Media valore = AVERAGEX(Vendite, Vendite[Quantita] * Vendite[Importo])',
      'Media valore = AVERAGE(Vendite[Quantita])',
      'Media valore = SUMX(Vendite, Vendite[Quantita]) / 2',
    ],
    correctIndex: 1,
    hints: ["AVERAGE lavora su una colonna esistente, non su un'espressione.", "La X segnala l'iteratore che valuta l'espressione riga per riga."],
    explanation: "AVERAGEX itera la tabella, valuta l'espressione per ogni riga e ne fa la media. AVERAGE accetta solo una colonna già esistente, quindi non può calcolare la media di Quantita per Importo.",
    reference: 'Media valore = AVERAGEX(Vendite, Vendite[Quantita] * Vendite[Importo])',
  },

  // --- Relazioni ---
  {
    id: 'dax-rel-e2', topicId: DaxTopicId.Relationships, difficulty: Difficulty.Easy, kind: 'formula',
    title: 'Città del cliente nei fatti',
    scenario: "In una colonna calcolata su Vendite vuoi la città del cliente, che vive in Clienti. La relazione esiste. Scrivi la colonna.",
    starter: 'Citta cliente = ',
    accepted: [
      'RELATED(Clienti[Citta])',
      'Citta cliente = RELATED(Clienti[Citta])',
    ],
    hints: ["Vai dal lato molti (Vendite) al lato uno (Clienti).", "In quella direzione si usa RELATED, che riporta un valore singolo."],
    explanation: "RELATED segue la relazione dal lato molti al lato uno e porta un valore singolo: qui la città del cliente collegato a ogni riga di vendita.",
    reference: 'Citta cliente = RELATED(Clienti[Citta])',
  },
  {
    id: 'dax-rel-m2', topicId: DaxTopicId.Relationships, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Ordini per cliente',
    scenario: "In una colonna calcolata su Clienti vuoi contare quante righe di Vendite ha ciascun cliente. Vai dal lato uno al lato molti. Scrivi la colonna.",
    starter: 'Numero ordini = ',
    accepted: [
      'COUNTROWS(RELATEDTABLE(Vendite))',
      'Numero ordini = COUNTROWS(RELATEDTABLE(Vendite))',
    ],
    hints: ["Dal lato uno al lato molti serve RELATEDTABLE, che restituisce una tabella.", "Poi conta quelle righe con COUNTROWS."],
    explanation: "RELATEDTABLE restituisce le righe di Vendite collegate al cliente corrente; COUNTROWS le conta. COUNTROWS(Vendite) da solo conterebbe l'intera tabella ignorando la relazione.",
    reference: 'Numero ordini = COUNTROWS(RELATEDTABLE(Vendite))',
  },

  // --- Time Intelligence ---
  {
    id: 'dax-time-e2', topicId: DaxTopicId.TimeIntelligence, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Cosa serve alla time intelligence',
    scenario: "Le funzioni come TOTALYTD o SAMEPERIODLASTYEAR non funzionano nel tuo report. Qual è il prerequisito più comune che manca?",
    options: [
      'Una misura chiamata esattamente Data',
      'Una tabella calendario continua, marcata come tabella data e collegata ai fatti',
      'Ordinare le vendite per data',
      'Trasformare gli importi in testo',
    ],
    correctIndex: 1,
    hints: ["Pensa da dove prendono le date queste funzioni.", "Serve una dimensione data dedicata, senza buchi."],
    explanation: "La time intelligence ha bisogno di una tabella calendario continua (senza date mancanti), marcata come tabella data e in relazione con i fatti. Senza, le funzioni di periodo non hanno un asse temporale affidabile su cui lavorare.",
    reference: "Marca Calendario come tabella data e collegala a Vendite[Data].",
  },
  {
    id: 'dax-time-m2', topicId: DaxTopicId.TimeIntelligence, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Crescita anno su anno (valore)',
    scenario: "Scrivi la differenza in valore tra il fatturato corrente e quello dello stesso periodo dell'anno scorso. Puoi usare la misura [Fatturato] per l'anno corrente.",
    starter: 'Delta AA = ',
    accepted: [
      '[Fatturato] - CALCULATE([Fatturato], SAMEPERIODLASTYEAR(Calendario[Data]))',
      'Delta AA = [Fatturato] - CALCULATE([Fatturato], SAMEPERIODLASTYEAR(Calendario[Data]))',
      'SUM(Vendite[Importo]) - CALCULATE(SUM(Vendite[Importo]), SAMEPERIODLASTYEAR(Calendario[Data]))',
    ],
    hints: ["Fatturato di ora meno fatturato dell'anno scorso.", "SAMEPERIODLASTYEAR dentro CALCULATE sposta il contesto di un anno indietro."],
    explanation: "SAMEPERIODLASTYEAR sposta le date di un anno indietro; dentro CALCULATE ricalcola il fatturato su quel periodo. La differenza con il fatturato attuale è la crescita in valore.",
    reference: 'Delta AA = [Fatturato] - CALCULATE([Fatturato], SAMEPERIODLASTYEAR(Calendario[Data]))',
  },
  {
    id: 'dax-time-h2', topicId: DaxTopicId.TimeIntelligence, difficulty: Difficulty.Hard, kind: 'formula',
    title: 'Crescita % anno su anno',
    scenario: "Scrivi la variazione percentuale del fatturato rispetto all'anno scorso, protetta dalla divisione per zero. Usa VAR per leggibilità.",
    starter: 'Crescita % AA = ',
    accepted: [
      'VAR Ora = [Fatturato] VAR Prima = CALCULATE([Fatturato], SAMEPERIODLASTYEAR(Calendario[Data])) RETURN DIVIDE(Ora - Prima, Prima)',
      'Crescita % AA = VAR Ora = [Fatturato] VAR Prima = CALCULATE([Fatturato], SAMEPERIODLASTYEAR(Calendario[Data])) RETURN DIVIDE(Ora - Prima, Prima)',
    ],
    hints: ["Dichiara due variabili: fatturato attuale e dell'anno prima.", "RETURN chiude con DIVIDE(Ora - Prima, Prima)."],
    explanation: "Le VAR calcolano una volta il fatturato attuale e quello dell'anno scorso; RETURN restituisce la variazione relativa con DIVIDE, che evita l'errore quando l'anno prima vale zero.",
    reference: 'Crescita % AA = VAR Ora = [Fatturato] VAR Prima = CALCULATE([Fatturato], SAMEPERIODLASTYEAR(Calendario[Data])) RETURN DIVIDE(Ora - Prima, Prima)',
  },

  // --- Variabili ---
  {
    id: 'dax-var-e2', topicId: DaxTopicId.Variables, difficulty: Difficulty.Easy, kind: 'mcq',
    title: 'Dove va RETURN',
    scenario: "In una misura con VAR, dove deve stare la parola RETURN?",
    options: [
      'Prima di tutte le VAR',
      'Dopo aver dichiarato le VAR, per restituire il risultato finale',
      'Dentro ogni VAR',
      'RETURN non serve con le VAR',
    ],
    correctIndex: 1,
    hints: ["Le variabili si dichiarano, poi si usa il risultato.", "C'è un solo RETURN per misura."],
    explanation: "La struttura è: una o più VAR, poi un singolo RETURN che usa quelle variabili per produrre il valore della misura. RETURN chiude sempre la definizione, dopo le dichiarazioni.",
    reference: 'Esempio = VAR X = SUM(Vendite[Importo]) RETURN X * 1.1',
  },
  {
    id: 'dax-var-m2', topicId: DaxTopicId.Variables, difficulty: Difficulty.Medium, kind: 'formula',
    title: 'Etichetta con variabile',
    scenario: "Scrivi una misura che calcoli il fatturato in una VAR e restituisca 'Sopra soglia' se supera 10000, altrimenti 'Sotto soglia'.",
    starter: 'Stato fatturato = ',
    accepted: [
      'VAR F = SUM(Vendite[Importo]) RETURN IF(F > 10000, "Sopra soglia", "Sotto soglia")',
      'Stato fatturato = VAR F = SUM(Vendite[Importo]) RETURN IF(F > 10000, "Sopra soglia", "Sotto soglia")',
      'VAR F = [Fatturato] RETURN IF(F > 10000, "Sopra soglia", "Sotto soglia")',
    ],
    hints: ["Metti il fatturato in una VAR, poi usalo nell'IF dentro RETURN.", "Così calcoli il fatturato una volta sola."],
    explanation: "La variabile cattura il fatturato una volta e lo riusa nell'IF: più leggibile e senza ricalcolare la stessa aggregazione due volte. RETURN restituisce l'etichetta scelta.",
    reference: 'Stato fatturato = VAR F = SUM(Vendite[Importo]) RETURN IF(F > 10000, "Sopra soglia", "Sotto soglia")',
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
