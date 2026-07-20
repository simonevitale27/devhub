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

// Forgiving normalizer so equivalent DAX matches: case, spacing, quotes around
// table names, brackets around columns, and ; vs , as the argument separator.
// ponytail: intentionally strips [] and quotes, so string literals inside a
// measure aren't compared strictly. Fine for a learning tool; tighten if we
// ever add exercises whose answer hinges on a literal string.
export function normalizeDax(s: string): string {
  return s
    .toUpperCase()
    .replace(/[\[\]'"]/g, '')       // drop brackets and quotes
    .replace(/;/g, ',')             // locale-agnostic separator
    .replace(/\s*([(),])\s*/g, '$1')// no space around ( ) ,
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
