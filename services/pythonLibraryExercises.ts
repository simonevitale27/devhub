import { PythonExerciseBlueprint } from '../pythonTypes';
import { Difficulty } from '../types';
import { PythonTopicId } from '../pythonTypes';

export const LIBRARY_EXERCISES: Record<string, Record<string, PythonExerciseBlueprint[]>> = {
  [PythonTopicId.Pandas]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Crea un DataFrame",
        descTemplate: "Crea un DataFrame con colonne 'nome' e 'eta' e stampalo.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob'], 'eta': [25, 30]})\nprint(df)",
        expectedOutput: "    nome  eta\n0  Alice   25\n1    Bob   30",
        hints: ["Usa pd.DataFrame() con un dizionario", "Le chiavi diventano nomi colonna"],
        explanation: "pd.DataFrame() crea una tabella da un dizionario di liste.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame(['Alice', 25], ['Bob', 30])",
        debugHint: "DataFrame vuole un dizionario, non liste separate."
      },
      {
        titleTemplate: "Crea una Series",
        descTemplate: "Crea una Series con valori [10, 20, 30] e stampala.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ns = pd.Series([10, 20, 30])\nprint(s)",
        expectedOutput: "0    10\n1    20\n2    30\ndtype: int64",
        hints: ["pd.Series() accetta una lista", "L'indice parte da 0"],
        explanation: "Una Series è una colonna singola con indice automatico.",
        brokenCode: "import pandas as pd\ns = pd.series([10, 20, 30])",
        debugHint: "Series ha la S maiuscola: pd.Series()."
      },
      {
        titleTemplate: "Shape del DataFrame",
        descTemplate: "Stampa le dimensioni (shape) del DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6]})\nprint(df.shape)",
        expectedOutput: "(3, 2)",
        hints: ["Usa .shape (senza parentesi)", "Restituisce (righe, colonne)"],
        explanation: ".shape restituisce una tupla (n_righe, n_colonne).",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6]})\nprint(df.shape())",
        debugHint: "shape è un attributo, non un metodo: no parentesi."
      },
      {
        titleTemplate: "Accesso a colonna",
        descTemplate: "Stampa solo la colonna 'nome' del DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob', 'Carlo'], 'eta': [25, 30, 35]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob', 'Carlo'], 'eta': [25, 30, 35]})\nprint(df['nome'])",
        expectedOutput: "0    Alice\n1      Bob\n2    Carlo\nName: nome, dtype: object",
        hints: ["Usa df['nome_colonna']", "Le parentesi quadre con il nome stringa"],
        explanation: "df['col'] seleziona una singola colonna come Series.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob', 'Carlo'], 'eta': [25, 30, 35]})\nprint(df[nome])",
        debugHint: "Il nome della colonna deve essere una stringa tra virgolette."
      },
      {
        titleTemplate: "Head del DataFrame",
        descTemplate: "Mostra le prime 2 righe del DataFrame con .head().",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'x': [1,2,3,4,5]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'x': [1,2,3,4,5]})\nprint(df.head(2))",
        expectedOutput: "   x\n0  1\n1  2",
        hints: ["head(n) mostra le prime n righe", "Di default mostra 5 righe"],
        explanation: ".head(n) restituisce le prime n righe del DataFrame.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'x': [1,2,3,4,5]})\nprint(df.head[2])",
        debugHint: "head() è un metodo, usa le parentesi tonde, non quadre."
      },
      {
        titleTemplate: "Lunghezza DataFrame",
        descTemplate: "Stampa il numero di righe del DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'a': [10, 20, 30, 40]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'a': [10, 20, 30, 40]})\nprint(len(df))",
        expectedOutput: "4",
        hints: ["Usa len() sul DataFrame", "Conta il numero di righe"],
        explanation: "len(df) restituisce il numero di righe.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'a': [10, 20, 30, 40]})\nprint(df.length)",
        debugHint: "I DataFrame non hanno .length, usa len(df)."
      },
      {
        titleTemplate: "Nomi colonne",
        descTemplate: "Stampa i nomi delle colonne del DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'eta': [20], 'citta': ['Roma']})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'eta': [20], 'citta': ['Roma']})\nprint(list(df.columns))",
        expectedOutput: "['nome', 'eta', 'citta']",
        hints: ["Usa df.columns", "Convertilo in lista con list()"],
        explanation: "df.columns restituisce l'indice delle colonne.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'eta': [20], 'citta': ['Roma']})\nprint(df.column_names)",
        debugHint: "L'attributo si chiama .columns, non .column_names."
      },
      {
        titleTemplate: "Somma colonna",
        descTemplate: "Calcola la somma della colonna 'valore'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'valore': [10, 20, 30]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'valore': [10, 20, 30]})\nprint(df['valore'].sum())",
        expectedOutput: "60",
        hints: ["Seleziona la colonna e usa .sum()", "df['col'].sum()"],
        explanation: ".sum() calcola la somma di tutti i valori nella Series.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'valore': [10, 20, 30]})\nprint(sum(df['valore']))",
        debugHint: "sum() funziona ma .sum() è il modo pandas, entrambi corretti qui."
      },
      {
        titleTemplate: "Media colonna",
        descTemplate: "Calcola la media della colonna 'punteggio'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'punteggio': [80, 90, 100]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'punteggio': [80, 90, 100]})\nprint(df['punteggio'].mean())",
        expectedOutput: "90.0",
        hints: ["Usa .mean() sulla colonna", "Media = somma / conteggio"],
        explanation: ".mean() calcola la media aritmetica della colonna.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'punteggio': [80, 90, 100]})\nprint(df['punteggio'].average())",
        debugHint: "Il metodo si chiama .mean(), non .average()."
      },
      {
        titleTemplate: "Tail del DataFrame",
        descTemplate: "Mostra le ultime 2 righe del DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'n': [1,2,3,4,5]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'n': [1,2,3,4,5]})\nprint(df.tail(2))",
        expectedOutput: "   n\n3  4\n4  5",
        hints: ["tail() è l'opposto di head()", "Mostra le ultime righe"],
        explanation: ".tail(n) mostra le ultime n righe del DataFrame.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'n': [1,2,3,4,5]})\nprint(df.last(2))",
        debugHint: "Il metodo si chiama .tail(), non .last()."
      },
      {
        titleTemplate: "Tipo dati colonne",
        descTemplate: "Stampa i tipi di dato di ogni colonna.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'eta': [25]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'eta': [25]})\nprint(df.dtypes)",
        expectedOutput: "nome    object\neta      int64\ndtype: object",
        hints: ["Usa .dtypes (senza parentesi)", "Mostra il tipo di ogni colonna"],
        explanation: ".dtypes mostra il tipo di dato di ciascuna colonna.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'eta': [25]})\nprint(df.types())",
        debugHint: "L'attributo si chiama .dtypes, non .types()."
      },
      {
        titleTemplate: "Valore massimo",
        descTemplate: "Trova il valore massimo della colonna 'prezzo'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'prezzo': [15, 42, 8, 23]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'prezzo': [15, 42, 8, 23]})\nprint(df['prezzo'].max())",
        expectedOutput: "42",
        hints: ["Usa .max() sulla colonna", "Restituisce il valore più alto"],
        explanation: ".max() trova il valore massimo in una Series.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'prezzo': [15, 42, 8, 23]})\nprint(max(df.prezzo))",
        debugHint: "Funziona, ma il modo pandas è df['prezzo'].max()."
      },
      {
        titleTemplate: "Conta valori unici",
        descTemplate: "Conta quanti valori unici ci sono nella colonna 'colore'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'colore': ['rosso', 'blu', 'rosso', 'verde', 'blu']})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'colore': ['rosso', 'blu', 'rosso', 'verde', 'blu']})\nprint(df['colore'].nunique())",
        expectedOutput: "3",
        hints: ["nunique() conta i valori distinti", "rosso, blu, verde = 3"],
        explanation: ".nunique() restituisce il numero di valori unici.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'colore': ['rosso', 'blu', 'rosso', 'verde', 'blu']})\nprint(df['colore'].unique())",
        debugHint: ".unique() elenca i valori unici, .nunique() li conta."
      },
      {
        titleTemplate: "Seleziona riga per indice",
        descTemplate: "Stampa la riga con indice 1 del DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'a': [10, 20, 30], 'b': [40, 50, 60]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'a': [10, 20, 30], 'b': [40, 50, 60]})\nprint(df.iloc[1])",
        expectedOutput: "a    20\nb    50\nName: 1, dtype: int64",
        hints: ["Usa .iloc[n] per accesso posizionale", "L'indice parte da 0"],
        explanation: ".iloc[n] seleziona la riga alla posizione n.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'a': [10, 20, 30], 'b': [40, 50, 60]})\nprint(df[1])",
        debugHint: "df[1] cerca una colonna chiamata 1, usa .iloc[1] per la riga."
      },
      {
        titleTemplate: "Aggiungi colonna",
        descTemplate: "Aggiungi una colonna 'doppio' che è il doppio di 'valore'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'valore': [5, 10, 15]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'valore': [5, 10, 15]})\ndf['doppio'] = df['valore'] * 2\nprint(df)",
        expectedOutput: "   valore  doppio\n0       5      10\n1      10      20\n2      15      30",
        hints: ["Assegna a df['nuova_col']", "Le operazioni sono vettoriali"],
        explanation: "Assegnando a df['nuova_col'] si crea una nuova colonna.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'valore': [5, 10, 15]})\ndf.add_column('doppio', df['valore'] * 2)",
        debugHint: "Non esiste add_column(), assegna con df['col'] = valori."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Filtra righe",
        descTemplate: "Seleziona le righe dove 'eta' > 25.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob', 'Carlo'], 'eta': [20, 30, 25]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob', 'Carlo'], 'eta': [20, 30, 25]})\nprint(df[df['eta'] > 25])",
        expectedOutput: "  nome  eta\n1  Bob   30",
        hints: ["Usa df[condizione]", "La condizione crea una maschera booleana"],
        explanation: "df[df['col'] > val] filtra le righe che soddisfano la condizione.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['Alice', 'Bob', 'Carlo'], 'eta': [20, 30, 25]})\nprint(df.where(eta > 25))",
        debugHint: "Usa df[df['eta'] > 25], non .where() con variabile non definita."
      },
      {
        titleTemplate: "Ordina DataFrame",
        descTemplate: "Ordina il DataFrame per 'punteggio' in ordine decrescente.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B', 'C'], 'punteggio': [70, 90, 80]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B', 'C'], 'punteggio': [70, 90, 80]})\nprint(df.sort_values('punteggio', ascending=False).reset_index(drop=True))",
        expectedOutput: "  nome  punteggio\n0    B         90\n1    C         80\n2    A         70",
        hints: ["sort_values() ordina per colonna", "ascending=False per decrescente"],
        explanation: "sort_values ordina; reset_index riordina gli indici.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B', 'C'], 'punteggio': [70, 90, 80]})\nprint(df.sort('punteggio'))",
        debugHint: "Il metodo si chiama sort_values(), non sort()."
      },
      {
        titleTemplate: "GroupBy somma",
        descTemplate: "Raggruppa per 'categoria' e somma i 'valori'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'categoria': ['A', 'B', 'A', 'B'], 'valori': [10, 20, 30, 40]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'categoria': ['A', 'B', 'A', 'B'], 'valori': [10, 20, 30, 40]})\nprint(df.groupby('categoria')['valori'].sum())",
        expectedOutput: "categoria\nA    40\nB    60\nName: valori, dtype: int64",
        hints: ["groupby('col') raggruppa", "Poi seleziona colonna e applica .sum()"],
        explanation: "groupby aggrega i dati per gruppi. .sum() somma ogni gruppo.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'categoria': ['A', 'B', 'A', 'B'], 'valori': [10, 20, 30, 40]})\nprint(df.group_by('categoria').sum())",
        debugHint: "Il metodo è groupby (tutto attaccato), non group_by."
      },
      {
        titleTemplate: "Valori nulli",
        descTemplate: "Conta i valori nulli per ogni colonna.",
        starterCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a': [1, np.nan, 3], 'b': [np.nan, np.nan, 6]})\n",
        solutionCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a': [1, np.nan, 3], 'b': [np.nan, np.nan, 6]})\nprint(df.isnull().sum())",
        expectedOutput: "a    1\nb    2\ndtype: int64",
        hints: ["isnull() crea maschera booleana", "sum() conta i True"],
        explanation: "isnull().sum() conta i NaN in ogni colonna.",
        brokenCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a': [1, np.nan, 3], 'b': [np.nan, np.nan, 6]})\nprint(df.null_count())",
        debugHint: "Non esiste null_count(), usa .isnull().sum()."
      },
      {
        titleTemplate: "Fillna",
        descTemplate: "Sostituisci i valori nulli con 0.",
        starterCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a': [1, np.nan, 3]})\n",
        solutionCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a': [1, np.nan, 3]})\nprint(df.fillna(0))",
        expectedOutput: "     a\n0  1.0\n1  0.0\n2  3.0",
        hints: ["fillna(valore) sostituisce NaN", "Puoi usare un valore qualsiasi"],
        explanation: ".fillna(v) sostituisce tutti i NaN con il valore v.",
        brokenCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a': [1, np.nan, 3]})\nprint(df.replace_null(0))",
        debugHint: "Il metodo si chiama .fillna(), non .replace_null()."
      },
      {
        titleTemplate: "Value counts",
        descTemplate: "Conta le occorrenze di ogni valore nella colonna 'frutto'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'frutto': ['mela', 'pera', 'mela', 'mela', 'pera']})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'frutto': ['mela', 'pera', 'mela', 'mela', 'pera']})\nprint(df['frutto'].value_counts())",
        expectedOutput: "frutto\nmela    3\npera    2\nName: count, dtype: int64",
        hints: ["value_counts() conta le occorrenze", "Ordina dal più frequente"],
        explanation: ".value_counts() conta quante volte appare ciascun valore.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'frutto': ['mela', 'pera', 'mela', 'mela', 'pera']})\nprint(df['frutto'].count_values())",
        debugHint: "Il metodo è value_counts(), non count_values()."
      },
      {
        titleTemplate: "Rinomina colonne",
        descTemplate: "Rinomina la colonna 'a' in 'alpha'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2], 'b': [3, 4]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2], 'b': [3, 4]})\nprint(df.rename(columns={'a': 'alpha'}))",
        expectedOutput: "   alpha  b\n0      1  3\n1      2  4",
        hints: ["Usa .rename(columns={...})", "Passa un dizionario vecchio: nuovo"],
        explanation: ".rename(columns=dict) rinomina le colonne specificate.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2], 'b': [3, 4]})\ndf.columns['a'] = 'alpha'",
        debugHint: "Non puoi indicizzare .columns con nome, usa .rename()."
      },
      {
        titleTemplate: "Elimina colonna",
        descTemplate: "Rimuovi la colonna 'temp' dal DataFrame.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'temp': [99], 'eta': [25]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'temp': [99], 'eta': [25]})\nprint(df.drop(columns=['temp']))",
        expectedOutput: "  nome  eta\n0    A   25",
        hints: ["Usa .drop(columns=['nome_col'])", "Specifica axis o columns"],
        explanation: ".drop(columns=[...]) rimuove le colonne specificate.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A'], 'temp': [99], 'eta': [25]})\nprint(df.remove('temp'))",
        debugHint: "Non esiste .remove(), usa .drop(columns=['temp'])."
      },
      {
        titleTemplate: "Apply funzione",
        descTemplate: "Applica una funzione che raddoppia ogni valore della colonna 'n'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'n': [1, 2, 3]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'n': [1, 2, 3]})\nprint(df['n'].apply(lambda x: x * 2))",
        expectedOutput: "0    2\n1    4\n2    6\nName: n, dtype: int64",
        hints: ["apply() esegue una funzione su ogni elemento", "Usa lambda per funzioni inline"],
        explanation: ".apply(func) applica la funzione a ogni elemento della Series.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'n': [1, 2, 3]})\nprint(df['n'].map(x: x * 2))",
        debugHint: "Serve 'lambda x:' non solo 'x:', e map funziona diversamente."
      },
      {
        titleTemplate: "Seleziona più colonne",
        descTemplate: "Seleziona solo le colonne 'nome' e 'citta'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B'], 'eta': [20, 30], 'citta': ['Roma', 'Milano']})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B'], 'eta': [20, 30], 'citta': ['Roma', 'Milano']})\nprint(df[['nome', 'citta']])",
        expectedOutput: "  nome   citta\n0    A    Roma\n1    B  Milano",
        hints: ["Usa doppie parentesi quadre df[[col1, col2]]", "Passa una lista di nomi colonna"],
        explanation: "df[['c1','c2']] seleziona più colonne, restituendo un DataFrame.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B'], 'eta': [20, 30], 'citta': ['Roma', 'Milano']})\nprint(df['nome', 'citta'])",
        debugHint: "Servono doppie parentesi: df[['nome', 'citta']], non df['nome', 'citta']."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Pivot table",
        descTemplate: "Costruisci una pivot con la somma dei valori per categoria e stampa il valore di 'A'.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'A'], 'val': [10, 5, 20]})\np = df.pivot_table(index='cat', values='val', aggfunc='sum')\nprint(p.loc['A', 'val'])",
        expectedOutput: "30",
        hints: ["pivot_table vuole index, values e aggfunc", "loc accede per etichetta di riga e colonna"],
        explanation: "pivot_table raggruppa per l'indice indicato e aggrega i valori con la funzione scelta. Il risultato è un DataFrame indicizzato sulla categoria, quindi si legge con loc.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'A'], 'val': [10, 5, 20]})\np = df.pivot_table(index='cat', values='val')\nprint(p.loc['A', 'val'])",
        debugHint: "Senza aggfunc pandas usa la media: per 'A' otterresti 15 invece di 30."
      },
      {
        titleTemplate: "Merge di due DataFrame",
        descTemplate: "Unisci due DataFrame sulla colonna id e stampa quante righe restano.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\na = pd.DataFrame({'id': [1, 2, 3], 'x': [10, 20, 30]})\nb = pd.DataFrame({'id': [2, 3, 4], 'y': [5, 6, 7]})\nm = a.merge(b, on='id')\nprint(len(m))",
        expectedOutput: "2",
        hints: ["merge di default fa un inner join", "Restano solo gli id presenti in entrambi"],
        explanation: "Il merge predefinito è un inner join: tiene solo le chiavi presenti in entrambi i DataFrame, cioè gli id 2 e 3. Con how='outer' ne resterebbero quattro.",
        brokenCode: "import pandas as pd\na = pd.DataFrame({'id': [1, 2, 3], 'x': [10, 20, 30]})\nb = pd.DataFrame({'id': [2, 3, 4], 'y': [5, 6, 7]})\nm = a.merge(b, on='id', how='outer')\nprint(len(m))",
        debugHint: "Con how='outer' tieni anche le chiavi non condivise: escono 4 righe, non 2."
      },
      {
        titleTemplate: "Colonna calcolata con apply",
        descTemplate: "Aggiungi una colonna con il doppio dei valori e stampa la lista risultante.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'val': [1, 2, 3]})\ndf['doppio'] = df['val'].apply(lambda x: x * 2)\nprint(list(df['doppio']))",
        expectedOutput: "[2, 4, 6]",
        hints: ["apply esegue la funzione su ogni elemento della Series", "Il risultato va assegnato a una nuova colonna"],
        explanation: "apply su una Series applica la funzione elemento per elemento. Per un'operazione semplice come questa df['val'] * 2 sarebbe più veloce, perché vettorizzata.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'val': [1, 2, 3]})\ndf['doppio'] = df.apply(lambda x: x * 2)\nprint(list(df['doppio']))",
        debugHint: "apply sul DataFrame lavora per colonne intere, non per singoli valori: applicalo alla Series."
      },
      {
        titleTemplate: "Valori mancanti",
        descTemplate: "Sostituisci i valori mancanti con 0 e stampa la somma della colonna.",
        starterCode: "import pandas as pd\nimport numpy as np\n",
        solutionCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'val': [1, np.nan, 3]})\ndf['val'] = df['val'].fillna(0)\nprint(df['val'].sum())",
        expectedOutput: "4.0",
        hints: ["fillna sostituisce i NaN", "La somma di una colonna float resta float"],
        explanation: "fillna rimpiazza i valori mancanti con quello indicato. La colonna resta di tipo float perché NaN esiste solo nei float, quindi la somma stampa 4.0 e non 4.",
        brokenCode: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'val': [1, np.nan, 3]})\ndf['val'].fillna(0)\nprint(df['val'].sum())",
        debugHint: "fillna restituisce una nuova Series: senza riassegnarla il DataFrame resta invariato."
      },
      {
        titleTemplate: "Groupby con più aggregazioni",
        descTemplate: "Raggruppa per categoria e stampa somma e conteggio di 'A'.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'A', 'B'], 'val': [10, 20, 5]})\ng = df.groupby('cat')['val'].agg(['sum', 'count'])\nprint(g.loc['A', 'sum'], g.loc['A', 'count'])",
        expectedOutput: "30 2",
        hints: ["agg accetta una lista di funzioni", "Ogni funzione diventa una colonna"],
        explanation: "agg con una lista produce una colonna per ciascuna aggregazione richiesta, quindi in un solo passaggio si ottengono somma e conteggio per ogni gruppo.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'A', 'B'], 'val': [10, 20, 5]})\ng = df.groupby('cat')['val'].sum().count()\nprint(g)",
        debugHint: "Concatenare sum() e count() conta i gruppi invece di aggregare due volte: usa agg."
      },
      {
        titleTemplate: "Ordinare e prendere i primi",
        descTemplate: "Ordina per valore decrescente e stampa i primi due valori.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'val': [5, 1, 9, 3]})\ntop = df.sort_values('val', ascending=False).head(2)\nprint(list(top['val']))",
        expectedOutput: "[9, 5]",
        hints: ["sort_values ordina per la colonna indicata", "head(n) prende le prime n righe"],
        explanation: "sort_values con ascending=False mette i valori più grandi in cima, poi head(2) ne prende due. In alternativa nlargest(2, 'val') fa entrambe le cose in una chiamata.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'val': [5, 1, 9, 3]})\ntop = df.sort_values('val').head(2)\nprint(list(top['val']))",
        debugHint: "Senza ascending=False ordini crescente e prendi i due valori più piccoli."
      },
      {
        titleTemplate: "Merge DataFrames",
        descTemplate: "Unisci due DataFrame sulla colonna 'id'.",
        starterCode: "import pandas as pd\ndf1 = pd.DataFrame({'id': [1, 2], 'nome': ['A', 'B']})\ndf2 = pd.DataFrame({'id': [1, 2], 'voto': [8, 9]})\n",
        solutionCode: "import pandas as pd\ndf1 = pd.DataFrame({'id': [1, 2], 'nome': ['A', 'B']})\ndf2 = pd.DataFrame({'id': [1, 2], 'voto': [8, 9]})\nprint(pd.merge(df1, df2, on='id'))",
        expectedOutput: "   id nome  voto\n0   1    A     8\n1   2    B     9",
        hints: ["pd.merge() unisce su colonna comune", "on='col' specifica la chiave"],
        explanation: "pd.merge() fa un join tra DataFrames su una colonna condivisa.",
        brokenCode: "import pandas as pd\ndf1 = pd.DataFrame({'id': [1, 2], 'nome': ['A', 'B']})\ndf2 = pd.DataFrame({'id': [1, 2], 'voto': [8, 9]})\nprint(df1.join(df2))",
        debugHint: ".join() usa l'indice, pd.merge(on='id') usa una colonna."
      },
      {
        titleTemplate: "Pivot Table",
        descTemplate: "Crea una tabella pivot: indice='citta', valori='vendite', aggfunc='sum'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'citta': ['Roma', 'Milano', 'Roma', 'Milano'], 'vendite': [100, 200, 150, 250]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'citta': ['Roma', 'Milano', 'Roma', 'Milano'], 'vendite': [100, 200, 150, 250]})\nprint(df.pivot_table(values='vendite', index='citta', aggfunc='sum'))",
        expectedOutput: "        vendite\ncitta          \nMilano      450\nRoma        250",
        hints: ["pivot_table ha parametri values, index, aggfunc", "aggfunc='sum' per sommare"],
        explanation: "pivot_table() crea riepiloghi aggregati simili a Excel.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'citta': ['Roma', 'Milano', 'Roma', 'Milano'], 'vendite': [100, 200, 150, 250]})\nprint(df.pivot('citta', 'vendite'))",
        debugHint: "pivot() non aggrega, usa pivot_table() con aggfunc."
      },
      {
        titleTemplate: "GroupBy multi-aggregazione",
        descTemplate: "Raggruppa per 'tipo' e calcola sia media che somma di 'valore'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'tipo': ['A', 'B', 'A', 'B'], 'valore': [10, 20, 30, 40]})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'tipo': ['A', 'B', 'A', 'B'], 'valore': [10, 20, 30, 40]})\nprint(df.groupby('tipo')['valore'].agg(['mean', 'sum']))",
        expectedOutput: "      mean  sum\ntipo           \nA     20.0   40\nB     30.0   60",
        hints: ["agg() accetta una lista di funzioni", "Passa ['mean', 'sum'] come stringhe"],
        explanation: ".agg([...]) applica più funzioni di aggregazione contemporaneamente.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'tipo': ['A', 'B', 'A', 'B'], 'valore': [10, 20, 30, 40]})\nprint(df.groupby('tipo').mean().sum())",
        debugHint: "Così calcoli la media e poi la somma delle medie. Usa .agg()."
      },
      {
        titleTemplate: "String methods",
        descTemplate: "Converti tutti i nomi in maiuscolo con .str.upper().",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['alice', 'bob', 'carlo']})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['alice', 'bob', 'carlo']})\nprint(df['nome'].str.upper())",
        expectedOutput: "0    ALICE\n1      BOB\n2    CARLO\nName: nome, dtype: object",
        hints: [".str accede ai metodi stringa", ".upper() converte in maiuscolo"],
        explanation: ".str.upper() applica upper() a ogni elemento della Series.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['alice', 'bob', 'carlo']})\nprint(df['nome'].upper())",
        debugHint: "Serve .str.upper(), non .upper() direttamente sulla Series."
      },
      {
        titleTemplate: "Condizione multipla",
        descTemplate: "Filtra dove eta > 20 AND citta == 'Roma'.",
        starterCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B', 'C'], 'eta': [25, 18, 30], 'citta': ['Roma', 'Roma', 'Milano']})\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B', 'C'], 'eta': [25, 18, 30], 'citta': ['Roma', 'Roma', 'Milano']})\nprint(df[(df['eta'] > 20) & (df['citta'] == 'Roma')])",
        expectedOutput: "  nome  eta citta\n0    A   25  Roma",
        hints: ["Usa & per AND tra condizioni", "Ogni condizione va tra parentesi"],
        explanation: "Con & (AND) si combinano più condizioni. Le parentesi sono obbligatorie.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'nome': ['A', 'B', 'C'], 'eta': [25, 18, 30], 'citta': ['Roma', 'Roma', 'Milano']})\nprint(df[df['eta'] > 20 and df['citta'] == 'Roma'])",
        debugHint: "In pandas usa & con parentesi, non 'and'."
      }
    ]
  },

  [PythonTopicId.Seaborn]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Palette come esadecimali",
        descTemplate: "Crea una palette di 3 colori e stampa quanti codici esadecimali contiene.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ncolori = sns.color_palette('deep', 3).as_hex()\nprint(len(colori))",
        expectedOutput: "3",
        hints: ["as_hex() converte la palette in codici colore", "Il numero di colori lo decidi tu"],
        explanation: "as_hex trasforma le tuple RGB in stringhe esadecimali, il formato che serve quando i colori vanno passati a un tema o a un file di configurazione.",
        brokenCode: "import seaborn as sns\ncolori = sns.color_palette('deep', 3).hex()\nprint(len(colori))",
        debugHint: "Il metodo si chiama as_hex(), non hex()."
      },
      {
        titleTemplate: "Impostare un tema",
        descTemplate: "Imposta il tema 'whitegrid' e stampa 'Tema impostato'.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\nsns.set_theme(style='whitegrid')\nprint('Tema impostato')",
        expectedOutput: "Tema impostato",
        hints: ["set_theme configura lo stile globale", "Lo stile si passa come parametro style"],
        explanation: "set_theme applica stile, palette e dimensioni dei caratteri a tutti i grafici successivi. È la prima riga tipica di un notebook, così non si ripete la configurazione a ogni grafico.",
        brokenCode: "import seaborn as sns\nsns.set_style(style='whitegrid', palette='deep')\nprint('Tema impostato')",
        debugHint: "set_style accetta solo lo stile: per impostare anche la palette serve set_theme."
      },
      {
        titleTemplate: "Palette invertita",
        descTemplate: "Crea la palette 'Blues' invertita con 4 colori e stampa quanti ne contiene.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\np = sns.color_palette('Blues_r', 4)\nprint(len(p))",
        expectedOutput: "4",
        hints: ["Il suffisso _r inverte la scala", "Vale per tutte le palette sequenziali"],
        explanation: "Aggiungendo _r al nome si inverte l'ordine dei colori: utile quando il valore alto deve corrispondere al tono più chiaro invece che al più scuro.",
        brokenCode: "import seaborn as sns\np = sns.color_palette('Blues', 4, reverse=True)\nprint(len(p))",
        debugHint: "color_palette non ha un parametro reverse: si usa il suffisso _r nel nome."
      },
      {
        titleTemplate: "DataFrame per il grafico",
        descTemplate: "Prepara un DataFrame con categorie e valori e stampa il numero di righe.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'categoria': ['A', 'B', 'C'], 'valore': [3, 7, 5]})\nprint(len(df))",
        expectedOutput: "3",
        hints: ["Seaborn lavora su DataFrame in formato lungo", "Una colonna per la categoria, una per il valore"],
        explanation: "Seaborn si aspetta dati in formato lungo: una riga per osservazione, con le variabili in colonne separate. È il formato che permette di passare i nomi delle colonne ai parametri x e y.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame(['A', 'B', 'C'], [3, 7, 5])\nprint(len(df))",
        debugHint: "Il secondo argomento posizionale è l'indice, non i valori: usa un dizionario."
      },
      {
        titleTemplate: "Palette per dati divergenti",
        descTemplate: "Crea una palette divergente con 5 colori e stampa quanti sono.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\np = sns.color_palette('coolwarm', 5)\nprint(len(p))",
        expectedOutput: "5",
        hints: ["Le palette divergenti hanno due estremi e un centro neutro", "coolwarm è la più comune"],
        explanation: "Una palette divergente serve quando i dati hanno un punto centrale significativo, per esempio uno scostamento positivo o negativo rispetto a zero: i due estremi si distinguono e il centro resta neutro.",
        brokenCode: "import seaborn as sns\np = sns.color_palette('coolwarm')\nprint(len(p))",
        debugHint: "Senza il numero di colori la palette torna alla dimensione predefinita di 6."
      },
      {
        titleTemplate: "Import Seaborn",
        descTemplate: "Importa seaborn con l'alias convenzionale e verifica che la versione sia disponibile.",
        starterCode: "",
        solutionCode: "import seaborn as sns\nprint('seaborn' if sns.__version__ else 'errore')",
        expectedOutput: "seaborn",
        hints: ["import seaborn as sns", "__version__ contiene la versione, che cambia da ambiente ad ambiente"],
        explanation: "La convenzione è importare seaborn come 'sns'.",
        brokenCode: "import Seaborn as sns\nprint(sns.version)",
        debugHint: "Il modulo è 'seaborn' minuscolo. L'attributo è __version__ con doppio underscore."
      },
      {
        titleTemplate: "Stili disponibili",
        descTemplate: "Verifica che lo stile 'ggplot' sia fra quelli disponibili in matplotlib.",
        starterCode: "import matplotlib.pyplot as plt\n",
        solutionCode: "import matplotlib.pyplot as plt\nprint('ggplot' in plt.style.available)",
        expectedOutput: "True",
        hints: ["plt.style.available è una lista di nomi", "L'operatore in verifica l'appartenenza"],
        explanation: "plt.style.available elenca i temi grafici installati. L'elenco completo cambia da una versione all'altra di matplotlib, quindi conviene verificare la presenza di un nome invece di confrontare tutta la lista.",
        brokenCode: "import matplotlib.pyplot as plt\nprint(plt.styles)",
        debugHint: "L'attributo è plt.style.available, non plt.styles."
      },
      {
        titleTemplate: "Palette colori",
        descTemplate: "Crea una palette di 5 colori con sns.color_palette() e stampa il numero.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\npalette = sns.color_palette('husl', 5)\nprint(len(palette))",
        expectedOutput: "5",
        hints: ["color_palette(name, n) crea n colori", "Restituisce una lista di tuple RGB"],
        explanation: "sns.color_palette() genera palette di colori personalizzate.",
        brokenCode: "import seaborn as sns\npalette = sns.colors('husl', 5)",
        debugHint: "La funzione è color_palette(), non colors()."
      },
      {
        titleTemplate: "Dataset integrato",
        descTemplate: "Carica il dataset 'tips' di seaborn e stampa il numero di righe.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(len(df))",
        expectedOutput: "244",
        hints: ["sns.load_dataset('nome') carica dataset di esempio", "È un DataFrame pandas"],
        explanation: "Seaborn include dataset di esempio per esercitarsi.",
        brokenCode: "import seaborn as sns\ndf = sns.dataset('tips')",
        debugHint: "La funzione è load_dataset(), non dataset()."
      },
      {
        titleTemplate: "Colonne dataset tips",
        descTemplate: "Carica 'tips' e stampa i nomi delle colonne.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(list(df.columns))",
        expectedOutput: "['total_bill', 'tip', 'sex', 'smoker', 'day', 'time', 'size']",
        hints: ["Usa df.columns dopo load_dataset", "Convertilo in list()"],
        explanation: "Il dataset tips contiene dati su mance al ristorante.",
        brokenCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df.column_names())",
        debugHint: "L'attributo è .columns (no parentesi), non .column_names()."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Formato lungo per seaborn",
        descTemplate: "Trasforma un DataFrame largo in formato lungo con melt e stampa il numero di righe.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'anno': [2024, 2025], 'nord': [10, 12], 'sud': [7, 9]})\nlungo = df.melt(id_vars='anno', var_name='zona', value_name='valore')\nprint(len(lungo))",
        expectedOutput: "4",
        hints: ["melt trasforma le colonne in righe", "id_vars indica le colonne da tenere fisse"],
        explanation: "melt porta i dati in formato lungo: due anni per due zone diventano quattro righe. È il formato che seaborn si aspetta, perché permette di passare i nomi delle colonne a x, y e hue.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'anno': [2024, 2025], 'nord': [10, 12], 'sud': [7, 9]})\nlungo = df.melt(var_name='zona', value_name='valore')\nprint(len(lungo))",
        debugHint: "Senza id_vars anche la colonna anno viene sciolta: escono 6 righe invece di 4."
      },
      {
        titleTemplate: "Ordinare le categorie",
        descTemplate: "Ordina le categorie per valore decrescente e stampa la prima.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'C'], 'val': [3, 9, 5]})\nordine = df.sort_values('val', ascending=False)['cat'].tolist()\nprint(ordine[0])",
        expectedOutput: "B",
        hints: ["sort_values ordina il DataFrame", "tolist() converte la colonna in lista"],
        explanation: "Seaborn disegna le categorie nell'ordine in cui le riceve tramite il parametro order: costruire quell'elenco ordinando per valore è il modo di ottenere un grafico a barre decrescente.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'C'], 'val': [3, 9, 5]})\nordine = df.sort_values('cat', ascending=False)['cat'].tolist()\nprint(ordine[0])",
        debugHint: "Stai ordinando per nome della categoria invece che per valore."
      },
      {
        titleTemplate: "Palette per numero di gruppi",
        descTemplate: "Genera una palette con tanti colori quanti sono i gruppi e stampa quanti sono.",
        starterCode: "import seaborn as sns\nimport pandas as pd\n",
        solutionCode: "import seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'A', 'C']})\nn = df['cat'].nunique()\nprint(len(sns.color_palette('deep', n)))",
        expectedOutput: "3",
        hints: ["nunique() conta i valori distinti", "Passa quel numero a color_palette"],
        explanation: "Legare la dimensione della palette al numero di gruppi evita che due categorie ricevano lo stesso colore o che avanzino colori inutilizzati quando i dati cambiano.",
        brokenCode: "import seaborn as sns\nimport pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'A', 'C']})\nn = df['cat'].count()\nprint(len(sns.color_palette('deep', n)))",
        debugHint: "count() conta le righe, non i valori distinti: usa nunique()."
      },
      {
        titleTemplate: "Contesto di visualizzazione",
        descTemplate: "Imposta il contesto 'talk' e stampa 'talk'.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ncontesto = 'talk'\nsns.set_context(contesto)\nprint(contesto)",
        expectedOutput: "talk",
        hints: ["set_context scala i caratteri e gli spessori", "I valori sono paper, notebook, talk, poster"],
        explanation: "set_context scala tutti gli elementi tipografici in blocco: notebook per lo schermo, talk per le slide, poster per la stampa grande. Cambia solo la scala, non lo stile dei colori.",
        brokenCode: "import seaborn as sns\nsns.set_context('presentation')\nprint('talk')",
        debugHint: "'presentation' non è un contesto valido: i nomi sono paper, notebook, talk e poster."
      },
      {
        titleTemplate: "Correlazione per la heatmap",
        descTemplate: "Calcola la matrice di correlazione e stampa la sua forma.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2, 3], 'b': [2, 4, 6], 'c': [5, 3, 1]})\nprint(df.corr().shape)",
        expectedOutput: "(3, 3)",
        hints: ["corr() confronta ogni colonna con ogni altra", "La matrice è quadrata"],
        explanation: "corr produce una matrice quadrata con una riga e una colonna per variabile numerica: è esattamente ciò che una heatmap si aspetta in ingresso.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'a': [1, 2, 3], 'b': [2, 4, 6], 'c': [5, 3, 1]})\nprint(df.corr().shape[0])",
        debugHint: "shape[0] dà solo il numero di righe: per la forma completa stampa shape."
      },
      {
        titleTemplate: "Aggregare prima di disegnare",
        descTemplate: "Somma i valori per categoria e stampa il totale di 'A'.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'A'], 'val': [2, 5, 3]})\ntot = df.groupby('cat')['val'].sum()\nprint(tot['A'])",
        expectedOutput: "5",
        hints: ["groupby più sum aggrega per categoria", "Il risultato è indicizzato sulla categoria"],
        explanation: "Seaborn sa aggregare da solo, ma calcolare i totali prima rende esplicito cosa viene disegnato ed evita sorprese: barplot per esempio mostra la media, non la somma.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'cat': ['A', 'B', 'A'], 'val': [2, 5, 3]})\ntot = df.groupby('cat')['val'].mean()\nprint(tot['A'])",
        debugHint: "mean() dà la media (2.5), non la somma richiesta."
      },
      {
        titleTemplate: "Statistiche tips",
        descTemplate: "Calcola la media della colonna 'tip' nel dataset tips.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(round(df['tip'].mean(), 2))",
        expectedOutput: "3.0",
        hints: ["Seleziona la colonna e usa .mean()", "round() per arrotondare"],
        explanation: "La media delle mance nel dataset è circa 3.0 dollari.",
        brokenCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df.tip.average())",
        debugHint: "Il metodo è .mean(), non .average()."
      },
      {
        titleTemplate: "GroupBy day tips",
        descTemplate: "Calcola la mancia media per giorno e stampa quella di sabato.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'day': ['Sat', 'Sun', 'Sat'], 'tip': [3.0, 4.0, 2.0]})\nmedie = df.groupby('day')['tip'].mean()\nprint(medie['Sat'])",
        expectedOutput: "2.5",
        hints: ["groupby('day') raggruppa per giorno", "Il risultato è una Series indicizzata sul giorno"],
        explanation: "groupby produce una Series con il giorno come indice, quindi il valore si legge per etichetta. Sabato ha due mance, 3.0 e 2.0, la cui media è 2.5.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'day': ['Sat', 'Sun', 'Sat'], 'tip': [3.0, 4.0, 2.0]})\nprint(df.group_by('day').tip.avg()['Sat'])",
        debugHint: "Il metodo è groupby tutto attaccato, e la media si chiama mean(), non avg()."
      },
      {
        titleTemplate: "Correlazione",
        descTemplate: "Calcola la correlazione tra total_bill e tip.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(round(df['total_bill'].corr(df['tip']), 2))",
        expectedOutput: "0.68",
        hints: [".corr() calcola la correlazione di Pearson", "Valore tra -1 e 1"],
        explanation: "Correlazione 0.68 indica relazione positiva moderata-forte.",
        brokenCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df.correlation('total_bill', 'tip'))",
        debugHint: "Usa series1.corr(series2), non df.correlation()."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Normalizzare per la heatmap",
        descTemplate: "Porta i valori in scala 0-1 con min-max e stampa il valore massimo.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ns = pd.Series([10, 20, 30])\nnorm = (s - s.min()) / (s.max() - s.min())\nprint(norm.max())",
        expectedOutput: "1.0",
        hints: ["La formula è (x - min) / (max - min)", "Il massimo normalizzato vale sempre 1"],
        explanation: "La normalizzazione min-max riporta ogni serie nello stesso intervallo, così una heatmap che confronta grandezze diverse non viene dominata dalla variabile con i numeri più grandi.",
        brokenCode: "import pandas as pd\ns = pd.Series([10, 20, 30])\nnorm = s / s.max()\nprint(norm.min())",
        debugHint: "Dividere solo per il massimo non porta il minimo a zero: manca la sottrazione del minimo."
      },
      {
        titleTemplate: "Tabella incrociata per heatmap",
        descTemplate: "Costruisci una crosstab fra due variabili e stampa la forma.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'x': ['A', 'A', 'B'], 'y': ['P', 'Q', 'P']})\nprint(pd.crosstab(df['x'], df['y']).shape)",
        expectedOutput: "(2, 2)",
        hints: ["crosstab conta le combinazioni di due variabili", "Righe e colonne sono i valori distinti"],
        explanation: "crosstab produce una matrice con i valori distinti della prima variabile sulle righe e della seconda sulle colonne, contando le occorrenze: la forma naturale per una heatmap di frequenze.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'x': ['A', 'A', 'B'], 'y': ['P', 'Q', 'P']})\nprint(pd.crosstab(df['x'], df['y']).size)",
        debugHint: "size dà il numero totale di celle (4), non la forma della matrice."
      },
      {
        titleTemplate: "Individuare gli outlier",
        descTemplate: "Conta quanti valori cadono fuori dai baffi del boxplot secondo la regola IQR.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ns = pd.Series([10, 11, 12, 13, 100])\nq1, q3 = s.quantile(0.25), s.quantile(0.75)\niqr = q3 - q1\nprint(((s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)).sum())",
        expectedOutput: "1",
        hints: ["IQR è la differenza fra terzo e primo quartile", "I baffi si estendono per 1.5 volte l'IQR"],
        explanation: "È la regola che il boxplot usa per disegnare i punti isolati: fuori da 1.5 volte l'intervallo interquartile. Il valore 100 è l'unico a caderne fuori.",
        brokenCode: "import pandas as pd\ns = pd.Series([10, 11, 12, 13, 100])\nq1, q3 = s.quantile(0.25), s.quantile(0.75)\niqr = q3 - q1\nprint(((s < q1 - iqr) | (s > q3 + iqr)).sum())",
        debugHint: "Manca il fattore 1.5: la soglia risulta più stretta di quella usata dal boxplot."
      },
      {
        titleTemplate: "Binning per l'istogramma",
        descTemplate: "Dividi i valori in 2 fasce con cut e stampa quanti cadono nella prima.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ns = pd.Series([1, 2, 8, 9])\nfasce = pd.cut(s, bins=2)\nprint(fasce.value_counts().iloc[0])",
        expectedOutput: "2",
        hints: ["cut divide in intervalli di ampiezza uguale", "value_counts conta gli elementi per fascia"],
        explanation: "cut divide l'intervallo dei valori in bin di ampiezza costante: qui 1 e 2 finiscono nella fascia bassa, 8 e 9 in quella alta. È la logica con cui un istogramma costruisce le colonne.",
        brokenCode: "import pandas as pd\ns = pd.Series([1, 2, 8, 9])\nfasce = pd.qcut(s, q=2)\nprint(fasce.value_counts().iloc[0])",
        debugHint: "qcut divide per quantili (stesso numero di elementi), cut per ampiezza: sono criteri diversi."
      },
      {
        titleTemplate: "Media mobile per la linea",
        descTemplate: "Calcola la media mobile a 2 periodi e stampa l'ultimo valore.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ns = pd.Series([2, 4, 6, 8])\nprint(s.rolling(2).mean().iloc[-1])",
        expectedOutput: "7.0",
        hints: ["rolling(n) crea una finestra scorrevole", "I primi valori restano NaN finché la finestra non è piena"],
        explanation: "rolling(2).mean() media ogni valore col precedente: l'ultimo è la media di 6 e 8, cioè 7.0. I primi n-1 risultati sono NaN perché la finestra non ha ancora abbastanza dati.",
        brokenCode: "import pandas as pd\ns = pd.Series([2, 4, 6, 8])\nprint(s.rolling(2).mean().iloc[0])",
        debugHint: "Il primo valore è NaN: la finestra da 2 non è ancora completa."
      },
      {
        titleTemplate: "Pivot per la matrice",
        descTemplate: "Trasforma i dati lunghi in matrice con pivot e stampa la forma.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'r': ['x', 'x', 'y', 'y'], 'c': ['a', 'b', 'a', 'b'], 'v': [1, 2, 3, 4]})\nm = df.pivot(index='r', columns='c', values='v')\nprint(m.shape)",
        expectedOutput: "(2, 2)",
        hints: ["pivot vuole index, columns e values", "È l'operazione inversa di melt"],
        explanation: "pivot riporta i dati dal formato lungo alla matrice: i valori di 'r' diventano righe, quelli di 'c' colonne. È il passaggio che precede una heatmap, che vuole i dati già in forma di matrice.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'r': ['x', 'x', 'y', 'y'], 'c': ['a', 'b', 'a', 'b'], 'v': [1, 2, 3, 4]})\nm = df.pivot(index='r', values='v')\nprint(m.shape)",
        debugHint: "Senza columns pandas non sa quale variabile deve diventare le colonne."
      },
      {
        titleTemplate: "Analisi completa tips",
        descTemplate: "Raggruppa per giorno e fascia oraria, ordina per media decrescente e stampa la coppia in testa.",
        starterCode: "import pandas as pd\n",
        solutionCode: "import pandas as pd\ndf = pd.DataFrame({'day': ['Sat', 'Sat', 'Sun'], 'time': ['Dinner', 'Lunch', 'Dinner'], 'tip': [4.0, 2.0, 5.0]})\nres = df.groupby(['day', 'time'])['tip'].mean().sort_values(ascending=False)\nprint(res.index[0])",
        expectedOutput: "('Sun', 'Dinner')",
        hints: ["groupby accetta una lista di colonne", "Con più colonne l'indice diventa gerarchico: ogni etichetta è una tupla"],
        explanation: "Raggruppando su due colonne l'indice risultante è gerarchico, quindi ogni etichetta è una tupla (giorno, fascia). Dopo l'ordinamento decrescente il primo indice è la combinazione con la media più alta.",
        brokenCode: "import pandas as pd\ndf = pd.DataFrame({'day': ['Sat', 'Sat', 'Sun'], 'time': ['Dinner', 'Lunch', 'Dinner'], 'tip': [4.0, 2.0, 5.0]})\nprint(df.groupby('day', 'time')['tip'].mean().index[0])",
        debugHint: "groupby vuole una lista di colonne: groupby(['day', 'time']), non due argomenti separati."
      },
      {
        titleTemplate: "Percentuale fumatori",
        descTemplate: "Calcola la percentuale di fumatori nel dataset tips.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\npct = (df['smoker'] == 'Yes').mean() * 100\nprint(round(pct, 1))",
        expectedOutput: "38.1",
        hints: ["Confronta con == 'Yes' per maschera booleana", ".mean() su booleani dà la proporzione"],
        explanation: "La media di una Series booleana dà la proporzione di True.",
        brokenCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df['smoker'].count('Yes') / len(df))",
        debugHint: ".count() non accetta argomenti. Usa (df['smoker']=='Yes').mean()."
      }
    ]
  },

  [PythonTopicId.Libraries]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Percorso senza estensione",
        descTemplate: "Estrai il nome del file senza estensione da un percorso.",
        starterCode: "import os\n",
        solutionCode: "import os\nnome = os.path.splitext(os.path.basename('/dati/report.csv'))[0]\nprint(nome)",
        expectedOutput: "report",
        hints: ["basename tiene solo l'ultima parte del percorso", "splitext separa nome ed estensione"],
        explanation: "basename scarta le cartelle e splitext divide in (nome, estensione) restituendo una tupla: l'indice 0 è il nome pulito. Lavorare con queste funzioni è più sicuro che tagliare la stringa a mano.",
        brokenCode: "import os\nprint('/dati/report.csv'.split('.')[0])",
        debugHint: "Tagliare sul punto rompe i percorsi che contengono punti nelle cartelle: usa os.path."
      },
      {
        titleTemplate: "JSON con caratteri accentati",
        descTemplate: "Serializza un dizionario con un accento mantenendo il carattere leggibile.",
        starterCode: "import json\n",
        solutionCode: "import json\nprint(json.dumps({'citta': 'Perugia', 'nota': 'però'}, ensure_ascii=False))",
        expectedOutput: '{"citta": "Perugia", "nota": "però"}',
        hints: ["Di default dumps converte i non-ASCII in sequenze di escape", "ensure_ascii=False li lascia com'erano"],
        explanation: "Senza ensure_ascii=False la ò diventerebbe \\\\u00f2: valido ma illeggibile. Con i file UTF-8 di oggi conviene quasi sempre disattivarlo.",
        brokenCode: "import json\nprint(json.dumps({'citta': 'Perugia', 'nota': 'però'}))",
        debugHint: "L'accento esce come sequenza di escape \\\\u00f2 invece che come carattere."
      },
      {
        titleTemplate: "Lettura sicura da dizionario annidato",
        descTemplate: "Leggi una chiave annidata che potrebbe mancare, con un valore di ripiego.",
        starterCode: "config = {'db': {'host': 'localhost'}}\n",
        solutionCode: "config = {'db': {'host': 'localhost'}}\nprint(config.get('db', {}).get('porta', 5432))",
        expectedOutput: "5432",
        hints: ["get con default {} permette di concatenare un altro get", "Così non serve controllare ogni livello"],
        explanation: "Il primo get restituisce un dizionario vuoto se la sezione manca, così il secondo get può sempre essere chiamato e restituisce il valore di ripiego. È il pattern tipico per leggere configurazioni parziali.",
        brokenCode: "config = {'db': {'host': 'localhost'}}\nprint(config['db']['porta'])",
        debugHint: "KeyError: la chiave 'porta' non esiste. Serve get con un default."
      },
      {
        titleTemplate: "Argomenti da riga di comando",
        descTemplate: "Stampa quanti argomenti extra sono stati passati allo script.",
        starterCode: "import sys\n",
        solutionCode: "import sys\nprint(len(sys.argv) - 1)",
        expectedOutput: "0",
        hints: ["sys.argv[0] è il nome dello script", "Gli argomenti veri partono dall'indice 1"],
        explanation: "sys.argv include sempre il nome dello script come primo elemento, quindi gli argomenti effettivi sono uno in meno. Eseguito senza parametri il conteggio è zero.",
        brokenCode: "import sys\nprint(len(sys.argv))",
        debugHint: "Così conti anche il nome dello script: sottrai uno."
      },
      {
        titleTemplate: "Espressione regolare con gruppo",
        descTemplate: "Estrai l'anno da una data in formato ISO usando un gruppo di cattura.",
        starterCode: "import re\n",
        solutionCode: "import re\nm = re.search(r'(\\d{4})-\\d{2}-\\d{2}', 'scadenza 2026-07-20')\nprint(m.group(1))",
        expectedOutput: "2026",
        hints: ["Le parentesi tonde creano un gruppo di cattura", "group(1) restituisce il primo gruppo, group(0) tutta la corrispondenza"],
        explanation: "Le parentesi isolano la parte da estrarre: group(0) darebbe la data intera, group(1) solo l'anno catturato. search restituisce None se non trova nulla, quindi in produzione va sempre controllato.",
        brokenCode: "import re\nm = re.search(r'\\d{4}-\\d{2}-\\d{2}', 'scadenza 2026-07-20')\nprint(m.group(1))",
        debugHint: "Senza parentesi non esiste il gruppo 1 e group(1) solleva un errore."
      },
      {
        titleTemplate: "Import os",
        descTemplate: "Importa os e stampa il nome del sistema operativo.",
        starterCode: "",
        solutionCode: "import os\nprint(os.name)",
        expectedOutput: "posix",
        hints: ["os.name restituisce il tipo di OS", "Valori: 'posix', 'nt', 'java'"],
        explanation: "Il modulo os permette di interagire col sistema operativo.",
        brokenCode: "import os\nprint(os.system_name)",
        debugHint: "L'attributo è os.name, non os.system_name."
      },
      {
        titleTemplate: "Variabili d'ambiente",
        descTemplate: "Leggi una variabile d'ambiente che non esiste, restituendo un valore di ripiego.",
        starterCode: "import os\n",
        solutionCode: "import os\nprint(os.environ.get('VARIABILE_INESISTENTE', 'non trovata'))",
        expectedOutput: "non trovata",
        hints: ["os.environ si comporta come un dizionario", "get(chiave, default) non solleva eccezioni se la chiave manca"],
        explanation: "os.environ.get restituisce il default quando la variabile non è impostata, invece di sollevare KeyError. È il modo sicuro di leggere la configurazione, perché l'ambiente cambia da macchina a macchina.",
        brokenCode: "import os\nprint(os.env['HOME'])",
        debugHint: "L'attributo è os.environ, non os.env."
      },
      {
        titleTemplate: "Path join",
        descTemplate: "Unisci '/home' e 'user' in un percorso con os.path.join.",
        starterCode: "import os\n",
        solutionCode: "import os\nprint(os.path.join('/home', 'user'))",
        expectedOutput: "/home/user",
        hints: ["os.path.join() unisce parti di percorso", "Aggiunge automaticamente il separatore"],
        explanation: "os.path.join() è cross-platform per creare percorsi file.",
        brokenCode: "import os\nprint(os.join('/home', 'user'))",
        debugHint: "La funzione è os.path.join(), non os.join()."
      },
      {
        titleTemplate: "JSON parse",
        descTemplate: "Converti la stringa JSON '{\"nome\": \"Alice\"}' in dizionario Python.",
        starterCode: "import json\n",
        solutionCode: "import json\ndata = json.loads('{\"nome\": \"Alice\"}')\nprint(data['nome'])",
        expectedOutput: "Alice",
        hints: ["json.loads() converte stringa in oggetto Python", "loads = load string"],
        explanation: "json.loads() deserializza una stringa JSON in dict/list Python.",
        brokenCode: "import json\ndata = json.parse('{\"nome\": \"Alice\"}')",
        debugHint: "In Python è json.loads(), non json.parse() (quello è JavaScript)."
      },
      {
        titleTemplate: "JSON stringify",
        descTemplate: "Converti il dizionario {'a': 1, 'b': 2} in stringa JSON.",
        starterCode: "import json\n",
        solutionCode: "import json\nprint(json.dumps({'a': 1, 'b': 2}))",
        expectedOutput: "{\"a\": 1, \"b\": 2}",
        hints: ["json.dumps() converte in stringa", "dumps = dump string"],
        explanation: "json.dumps() serializza un oggetto Python in stringa JSON.",
        brokenCode: "import json\nprint(json.stringify({'a': 1, 'b': 2}))",
        debugHint: "stringify è JavaScript. In Python è json.dumps()."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Raggruppare con itertools",
        descTemplate: "Raggruppa gli elementi consecutivi uguali e stampa quanti gruppi risultano.",
        starterCode: "from itertools import groupby\n",
        solutionCode: "from itertools import groupby\ndati = ['a', 'a', 'b', 'a']\ngruppi = [k for k, _ in groupby(dati)]\nprint(len(gruppi))",
        expectedOutput: "3",
        hints: ["groupby raggruppa solo elementi ADIACENTI", "Per raggruppare tutto va ordinato prima"],
        explanation: "groupby chiude un gruppo appena il valore cambia, quindi la lista produce tre gruppi: a, b, a. Per raggruppare tutte le occorrenze di uno stesso valore bisogna ordinare prima.",
        brokenCode: "from itertools import groupby\ndati = ['a', 'a', 'b', 'a']\nprint(len(list(groupby(dati))) == 2)",
        debugHint: "I gruppi sono 3, non 2: groupby non unisce elementi non adiacenti."
      },
      {
        titleTemplate: "Combinazioni",
        descTemplate: "Conta le coppie possibili scegliendo 2 elementi da 4, senza ripetizioni.",
        starterCode: "from itertools import combinations\n",
        solutionCode: "from itertools import combinations\nprint(len(list(combinations([1, 2, 3, 4], 2))))",
        expectedOutput: "6",
        hints: ["combinations ignora l'ordine", "permutations invece lo considera"],
        explanation: "combinations restituisce i sottoinsiemi senza tenere conto dell'ordine, quindi (1,2) e (2,1) contano come una sola coppia: da quattro elementi escono sei coppie. Con permutations sarebbero dodici.",
        brokenCode: "from itertools import permutations\nprint(len(list(permutations([1, 2, 3, 4], 2))))",
        debugHint: "permutations considera l'ordine e ne conta 12: per le coppie serve combinations."
      },
      {
        titleTemplate: "Differenza fra date",
        descTemplate: "Calcola quanti giorni passano fra due date.",
        starterCode: "from datetime import date\n",
        solutionCode: "from datetime import date\nd = date(2026, 7, 20) - date(2026, 7, 1)\nprint(d.days)",
        expectedOutput: "19",
        hints: ["Sottrarre due date restituisce un timedelta", "L'attributo days contiene i giorni interi"],
        explanation: "La differenza fra due date produce un timedelta, non un numero: il conteggio dei giorni si legge dall'attributo days. Stampare direttamente il timedelta darebbe '19 days, 0:00:00'.",
        brokenCode: "from datetime import date\nprint(date(2026, 7, 20) - date(2026, 7, 1))",
        debugHint: "Così stampi l'intero timedelta: serve l'attributo .days."
      },
      {
        titleTemplate: "Formattare una data",
        descTemplate: "Formatta una data nel formato giorno/mese/anno.",
        starterCode: "from datetime import date\n",
        solutionCode: "from datetime import date\nprint(date(2026, 7, 20).strftime('%d/%m/%Y'))",
        expectedOutput: "20/07/2026",
        hints: ["strftime converte una data in stringa", "%d giorno, %m mese, %Y anno a 4 cifre"],
        explanation: "strftime applica un modello di formattazione: %Y è l'anno a quattro cifre, %y sarebbe a due. L'operazione inversa, da stringa a data, è strptime.",
        brokenCode: "from datetime import date\nprint(date(2026, 7, 20).strftime('%d/%m/%y'))",
        debugHint: "%y minuscolo dà l'anno a due cifre (26), non a quattro."
      },
      {
        titleTemplate: "Sostituzione con regex",
        descTemplate: "Maschera tutte le cifre di una stringa sostituendole con un asterisco.",
        starterCode: "import re\n",
        solutionCode: "import re\nprint(re.sub(r'\\d', '*', 'carta 1234'))",
        expectedOutput: "carta ****",
        hints: ["sub sostituisce tutte le corrispondenze", "\\d rappresenta una singola cifra"],
        explanation: "re.sub sostituisce ogni corrispondenza del modello, quindi le quattro cifre diventano quattro asterischi. Con \\d+ il gruppo di cifre verrebbe trattato come una corrispondenza sola e produrrebbe un asterisco unico.",
        brokenCode: "import re\nprint(re.sub(r'\\d+', '*', 'carta 1234'))",
        debugHint: "Con \\d+ tutte le cifre contano come una corrispondenza: esce un asterisco solo."
      },
      {
        titleTemplate: "Datetime corrente",
        descTemplate: "Costruisci una data fissa e stampane l'anno.",
        starterCode: "from datetime import datetime\n",
        solutionCode: "from datetime import datetime\nd = datetime(2026, 7, 20)\nprint(d.year)",
        expectedOutput: "2026",
        hints: ["datetime(anno, mese, giorno) costruisce una data precisa", ".year estrae l'anno"],
        explanation: "datetime(...) costruisce una data fissa, mentre datetime.now() darebbe l'istante corrente e quindi un risultato diverso a ogni esecuzione. Nei test si usa sempre una data fissa, proprio per questo.",
        brokenCode: "from datetime import datetime\nd = datetime(2026, 7, 20)\nprint(d.current_year())",
        debugHint: "L'anno è un attributo, non un metodo: si scrive d.year senza parentesi."
      },
      {
        titleTemplate: "Regex cerca pattern",
        descTemplate: "Trova tutti i numeri nella stringa 'ho 3 gatti e 2 cani'.",
        starterCode: "import re\n",
        solutionCode: "import re\nprint(re.findall(r'\\d+', 'ho 3 gatti e 2 cani'))",
        expectedOutput: "['3', '2']",
        hints: ["re.findall() trova tutte le corrispondenze", "\\d+ matcha uno o più digit"],
        explanation: "re.findall(pattern, string) restituisce una lista di match.",
        brokenCode: "import re\nprint(re.find(r'\\d+', 'ho 3 gatti e 2 cani'))",
        debugHint: "Il metodo è findall(), non find()."
      },
      {
        titleTemplate: "Counter collections",
        descTemplate: "Conta le occorrenze di ogni lettera nella parola 'banana'.",
        starterCode: "from collections import Counter\n",
        solutionCode: "from collections import Counter\nc = Counter('banana')\nprint(dict(c))",
        expectedOutput: "{'b': 1, 'a': 3, 'n': 2}",
        hints: ["Counter() conta automaticamente gli elementi", "Funziona su stringhe e liste"],
        explanation: "Counter crea un dizionario di conteggi da qualsiasi iterabile.",
        brokenCode: "from collections import Counter\nprint(Counter.count('banana'))",
        debugHint: "Counter si istanzia con Counter('banana'), non Counter.count()."
      },
      {
        titleTemplate: "DefaultDict",
        descTemplate: "Crea un defaultdict di liste e aggiungi valori.",
        starterCode: "from collections import defaultdict\n",
        solutionCode: "from collections import defaultdict\nd = defaultdict(list)\nd['frutta'].append('mela')\nd['frutta'].append('pera')\nprint(dict(d))",
        expectedOutput: "{'frutta': ['mela', 'pera']}",
        hints: ["defaultdict(list) crea liste vuote per chiavi nuove", "Non serve verificare se la chiave esiste"],
        explanation: "defaultdict inizializza automaticamente valori per chiavi mancanti.",
        brokenCode: "from collections import defaultdict\nd = defaultdict()\nd['frutta'].append('mela')",
        debugHint: "defaultdict() senza factory function dà errore. Passa list."
      },
      {
        titleTemplate: "Itertools product",
        descTemplate: "Genera tutte le combinazioni di [1,2] e ['a','b'].",
        starterCode: "from itertools import product\n",
        solutionCode: "from itertools import product\nprint(list(product([1,2], ['a','b'])))",
        expectedOutput: "[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]",
        hints: ["product() fa il prodotto cartesiano", "Restituisce un iteratore, usa list()"],
        explanation: "product() genera tutte le combinazioni possibili tra gli input.",
        brokenCode: "from itertools import product\nprint(product([1,2], ['a','b']))",
        debugHint: "product() restituisce un iteratore, wrappalo in list()."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Generatore con yield",
        descTemplate: "Scrivi un generatore che produce i quadrati fino a n e stampa la lista risultante.",
        starterCode: "",
        solutionCode: "def quadrati(n):\n    for i in range(n):\n        yield i * i\n\nprint(list(quadrati(4)))",
        expectedOutput: "[0, 1, 4, 9]",
        hints: ["yield restituisce un valore alla volta senza terminare la funzione", "Il generatore va consumato, per esempio con list()"],
        explanation: "Un generatore produce i valori su richiesta invece di costruire tutta la lista in memoria, utile su sequenze lunghe. Va consumato per vederne il contenuto: stampandolo direttamente si otterrebbe l'oggetto generatore.",
        brokenCode: "def quadrati(n):\n    for i in range(n):\n        yield i * i\n\nprint(quadrati(4))",
        debugHint: "Stampi l'oggetto generatore: consumalo con list() per vedere i valori."
      },
      {
        titleTemplate: "functools.reduce",
        descTemplate: "Calcola il prodotto di una lista con reduce.",
        starterCode: "from functools import reduce\n",
        solutionCode: "from functools import reduce\nprint(reduce(lambda a, b: a * b, [1, 2, 3, 4]))",
        expectedOutput: "24",
        hints: ["reduce accumula due elementi alla volta", "La lambda riceve l'accumulatore e l'elemento corrente"],
        explanation: "reduce applica la funzione a coppie procedendo da sinistra: ((1*2)*3)*4 uguale 24. Per la somma esiste già sum, quindi reduce si usa per le aggregazioni che la libreria standard non copre.",
        brokenCode: "from functools import reduce\nprint(reduce(lambda a, b: a * b, []))",
        debugHint: "TypeError su lista vuota: senza valore iniziale reduce non ha da dove partire."
      },
      {
        titleTemplate: "Cache di una funzione",
        descTemplate: "Applica una cache a una funzione ricorsiva e stampa il decimo numero di Fibonacci.",
        starterCode: "from functools import lru_cache\n",
        solutionCode: "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fib(10))",
        expectedOutput: "55",
        hints: ["lru_cache memorizza i risultati già calcolati", "Va messo come decoratore sopra la funzione"],
        explanation: "Senza cache la ricorsione ricalcola gli stessi valori esponenzialmente. lru_cache memorizza ogni risultato per argomento, portando il costo a lineare: è una riga che cambia l'ordine di grandezza.",
        brokenCode: "from functools import lru_cache\n\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nlru_cache(fib)\nprint(fib(10))",
        debugHint: "lru_cache va applicato come decoratore sopra la funzione, non chiamato dopo."
      },
      {
        titleTemplate: "Eccezione personalizzata",
        descTemplate: "Definisci un'eccezione personalizzata, sollevala e cattura il messaggio.",
        starterCode: "",
        solutionCode: "class SaldoInsufficiente(Exception):\n    pass\n\ntry:\n    raise SaldoInsufficiente('saldo troppo basso')\nexcept SaldoInsufficiente as e:\n    print(e)",
        expectedOutput: "saldo troppo basso",
        hints: ["Un'eccezione personalizzata eredita da Exception", "as e lega l'oggetto eccezione a una variabile"],
        explanation: "Ereditare da Exception basta per creare un tipo di errore specifico, che chi chiama può catturare separatamente dagli altri. Stampare l'oggetto mostra il messaggio passato al costruttore.",
        brokenCode: "class SaldoInsufficiente:\n    pass\n\ntry:\n    raise SaldoInsufficiente('saldo troppo basso')\nexcept SaldoInsufficiente as e:\n    print(e)",
        debugHint: "TypeError: si possono sollevare solo classi che derivano da BaseException."
      },
      {
        titleTemplate: "Context manager con contextlib",
        descTemplate: "Crea un context manager con il decoratore contextmanager.",
        starterCode: "from contextlib import contextmanager\n",
        solutionCode: "from contextlib import contextmanager\n\n@contextmanager\ndef sezione():\n    print('inizio')\n    yield\n    print('fine')\n\nwith sezione():\n    print('dentro')",
        expectedOutput: "inizio\ndentro\nfine",
        hints: ["Il codice prima di yield corrisponde a __enter__", "Quello dopo yield a __exit__"],
        explanation: "contextmanager trasforma un generatore in un context manager: tutto ciò che precede yield viene eseguito entrando nel blocco with, ciò che segue all'uscita. Evita di scrivere una classe con __enter__ e __exit__.",
        brokenCode: "from contextlib import contextmanager\n\n@contextmanager\ndef sezione():\n    print('inizio')\n    print('fine')\n\nwith sezione():\n    print('dentro')",
        debugHint: "Senza yield il generatore non cede il controllo al blocco with e si ottiene un errore."
      },
      {
        titleTemplate: "Unpacking di dizionari",
        descTemplate: "Unisci due dizionari passandoli come argomenti nominali a una funzione.",
        starterCode: "",
        solutionCode: "def descrivi(**kwargs):\n    return ', '.join(f'{k}={v}' for k, v in sorted(kwargs.items()))\n\nbase = {'host': 'localhost'}\nextra = {'porta': 5432}\nprint(descrivi(**base, **extra))",
        expectedOutput: "host=localhost, porta=5432",
        hints: ["Il doppio asterisco espande un dizionario in argomenti nominali", "**kwargs li raccoglie in un dizionario"],
        explanation: "Il doppio asterisco lavora in due direzioni: nella chiamata espande il dizionario in argomenti nominali, nella firma li raccoglie di nuovo. sorted rende l'ordine di stampa prevedibile.",
        brokenCode: "def descrivi(**kwargs):\n    return ', '.join(f'{k}={v}' for k, v in sorted(kwargs.items()))\n\nbase = {'host': 'localhost'}\nextra = {'porta': 5432}\nprint(descrivi(base, extra))",
        debugHint: "Senza ** i dizionari arrivano come argomenti posizionali, che la funzione non accetta."
      },
      {
        titleTemplate: "Decoratore timer",
        descTemplate: "Crea un decoratore che misura il tempo di esecuzione.",
        starterCode: "import time\n",
        solutionCode: "import time\ndef timer(func):\n    def wrapper(*args):\n        start = time.time()\n        result = func(*args)\n        durata = time.time() - start\n        print(f'{func.__name__} ha impiegato meno di un secondo: {durata < 1}')\n        return result\n    return wrapper\n\n@timer\ndef test():\n    return sum(range(1000))\n\ntest()",
        expectedOutput: "test ha impiegato meno di un secondo: True",
        hints: ["Un decoratore è una funzione che ne avvolge un'altra e restituisce il wrapper", "*args rende il wrapper utilizzabile con qualunque firma"],
        explanation: "Il decoratore sostituisce la funzione con il wrapper, che misura il tempo attorno alla chiamata originale. Il messaggio confronta la durata con una soglia invece di stamparla, perché i secondi esatti cambiano a ogni esecuzione.",
        brokenCode: "def timer(func):\n    start = time.time()\n    func()\n    print(time.time()-start)",
        debugHint: "Il decoratore deve restituire una funzione wrapper, non eseguire direttamente."
      },
      {
        titleTemplate: "Context Manager",
        descTemplate: "Crea una classe context manager che stampa enter/exit.",
        starterCode: "",
        solutionCode: "class MyCtx:\n    def __enter__(self):\n        print('enter')\n        return self\n    def __exit__(self, *args):\n        print('exit')\n\nwith MyCtx():\n    print('inside')",
        expectedOutput: "enter\ninside\nexit",
        hints: ["Implementa __enter__ e __exit__", "with invoca automaticamente i due metodi"],
        explanation: "I context manager gestiscono setup/cleanup automaticamente.",
        brokenCode: "class MyCtx:\n    def enter(self):\n        print('enter')\n    def exit(self):\n        print('exit')\n\nwith MyCtx():\n    print('inside')",
        debugHint: "Servono i doppi underscore: __enter__ e __exit__."
      },
      {
        titleTemplate: "Dataclass",
        descTemplate: "Crea una dataclass Punto con x e y, stampala.",
        starterCode: "from dataclasses import dataclass\n",
        solutionCode: "from dataclasses import dataclass\n\n@dataclass\nclass Punto:\n    x: float\n    y: float\n\np = Punto(3.0, 4.0)\nprint(p)",
        expectedOutput: "Punto(x=3.0, y=4.0)",
        hints: ["@dataclass genera __init__ e __repr__", "I campi si dichiarano con type hints"],
        explanation: "I dataclass generano automaticamente metodi standard per le classi dati.",
        brokenCode: "from dataclasses import dataclass\n\nclass Punto:\n    x: float\n    y: float\n\np = Punto(3.0, 4.0)",
        debugHint: "Senza @dataclass il __init__ non viene generato automaticamente."
      }
    ]
  }
};
