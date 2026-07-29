import { Difficulty } from './types';

// DAX practice for the Power BI PL-300 track.
// All exercises share ONE fictional star schema so scenarios stay coherent:
//   Vendite (fact):   Data, ProdottoID, ClienteID, Quantita, Importo
//   Prodotti (dim):   ProdottoID, Nome, Categoria, Costo
//   Clienti  (dim):   ClienteID, Nome, Citta, Segmento
//   Calendario (dim): Data, Anno, Mese, Trimestre   (marked as the date table)
// Relationships: Vendite[ProdottoID]->Prodotti, Vendite[ClienteID]->Clienti,
//                Vendite[Data]->Calendario[Data].

// Topics follow the PL-300 "Skills measured as of April 20, 2026" outline,
// specifically "Model the data (25-30%) > Create model calculations by using
// DAX" plus the DAX-adjacent bullets from the modelling, security and
// visualisation domains (RLS filter expressions, visual calculations).
export enum DaxTopicId {
  Aggregations = 'aggregations',       // SUM, AVERAGE, COUNTROWS, DISTINCTCOUNT
  Logical = 'logical',                 // IF, SWITCH
  Calculate = 'calculate',             // CALCULATE, filter context, ALL, FILTER
  Iterators = 'iterators',             // SUMX, AVERAGEX, RANKX
  Relationships = 'relationships',     // RELATED, USERELATIONSHIP, CROSSFILTER
  TimeIntelligence = 'time',           // TOTALYTD, SAMEPERIODLASTYEAR, DATEADD
  Variables = 'variables',             // VAR / RETURN
  Statistical = 'statistical',         // MEDIAN, PERCENTILE, STDEV, RANKX, TOPN
  SemiAdditive = 'semiadditive',       // LASTDATE, CLOSINGBALANCE*, OPENINGBALANCE*
  TableFunctions = 'tablefunctions',   // SUMMARIZE, ADDCOLUMNS, CALENDAR, UNION
  Modeling = 'modeling',               // measure vs calc column vs calc table, cardinality
  VisualCalc = 'visualcalc',           // RUNNINGSUM, MOVINGAVERAGE, calculation groups
  Security = 'security',               // RLS filter expressions, USERPRINCIPALNAME
  Optimization = 'optimization',       // performance, DIVIDE, KEEPFILTERS, granularity
}

export type DaxExerciseKind = 'mcq' | 'formula';

interface DaxExerciseBase {
  id: string;
  topicId: DaxTopicId;
  difficulty: Difficulty;
  title: string;
  scenario: string;      // the business question, grounded in the schema above
  hints: string[];
  explanation: string;   // why the answer is right, in plain language
  reference: string;     // the correct DAX, shown as the revealed solution
}

export interface DaxMcqExercise extends DaxExerciseBase {
  kind: 'mcq';
  options: string[];
  correctIndex: number;
}

export interface DaxFormulaExercise extends DaxExerciseBase {
  kind: 'formula';
  starter?: string;
  accepted: string[];    // accepted answers, compared after normalizeDax()
}

export type DaxExercise = DaxMcqExercise | DaxFormulaExercise;

/**
 * Toglie il nome della misura, se presente.
 *
 * In DAX il nome e' una scelta libera di chi scrive: "Massimo = MAX(...)" e
 * "Vendita piu alta = MAX(...)" sono la stessa identica misura. Confrontare la
 * stringa intera bocciava una risposta giusta solo perche' l'utente aveva
 * scelto un altro nome -- il motivo per cui questi esercizi risultavano
 * impossibili da superare.
 *
 * Il taglio avviene solo se cio' che precede il primo "=" e' un identificatore
 * semplice. Serve a non rovinare le espressioni che contengono un "=" come
 * operatore, per esempio CALCULATE([Fatturato], Prodotti[Categoria] = "Bevande"):
 * li' il testo prima dell'uguale contiene parentesi e virgole, quindi non e' un
 * nome e la formula resta intatta.
 */
function stripMeasureName(s: string): string {
  // ":=" (stile Tabular Editor) equivale a "="; "<=", ">=", "<>" NON sono assegnazioni.
  const m = s.match(/^([^=<>!]*?)\s*:?=(?!=)([\s\S]+)$/);
  if (!m) return s;
  const [, nome, espressione] = m;
  // Un nome di misura e' fatto solo di lettere, cifre, spazi, _ . % e accenti.
  return /^[\p{L}\p{N}_.%\s]*$/u.test(nome) ? espressione : s;
}

// Normalizzatore tollerante: due formule equivalenti devono risultare uguali.
// Assorbe maiuscole/minuscole, spaziatura (anche attorno agli operatori), apici
// sulle tabelle, parentesi quadre, ";" o "," come separatore, il punto e virgola
// finale e il nome della misura.
// ponytail: toglie di proposito [] e apici, quindi le stringhe letterali dentro
// una misura non sono confrontate alla lettera. Va bene per uno strumento di
// studio; da stringere se un giorno la risposta dipendesse da un letterale.
export function normalizeDax(s: string): string {
  return stripMeasureName(s.trim())
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[;]+\s*$/, '')          // punto e virgola finale: rumore
    .replace(/;/g, ',')               // separatore indipendente dal locale
    // Gli spazi attorno alle quadre vanno tolti PRIMA di eliminarle, altrimenti
    // "Vendite [ Importo ]" resta con gli spazi e non combacia con "Vendite[Importo]".
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]/g, ']')
    .replace(/[\[\]'"]/g, '')         // via parentesi quadre e apici
    .replace(/\s*(<=|>=|<>|[-+*/=<>(),])\s*/g, '$1') // niente spazi attorno agli operatori
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkDaxFormula(input: string, accepted: string[]): boolean {
  if (!input.trim()) return false;
  const n = normalizeDax(input);
  return accepted.some((a) => normalizeDax(a) === n);
}

export interface DaxTopic {
  id: DaxTopicId;
  label: string;
  subtitle: string;   // key functions, shown as chips like the SQL/Python labs
}
