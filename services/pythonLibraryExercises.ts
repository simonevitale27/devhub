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
        titleTemplate: "Import Seaborn",
        descTemplate: "Importa seaborn e matplotlib, stampa la versione di seaborn.",
        starterCode: "",
        solutionCode: "import seaborn as sns\nprint(sns.__version__)",
        expectedOutput: "",
        hints: ["import seaborn as sns", "__version__ contiene la versione"],
        explanation: "La convenzione è importare seaborn come 'sns'.",
        brokenCode: "import Seaborn as sns\nprint(sns.version)",
        debugHint: "Il modulo è 'seaborn' minuscolo. L'attributo è __version__ con doppio underscore."
      },
      {
        titleTemplate: "Stili disponibili",
        descTemplate: "Stampa la lista degli stili disponibili in matplotlib.",
        starterCode: "import matplotlib.pyplot as plt\n",
        solutionCode: "import matplotlib.pyplot as plt\nprint(sorted(plt.style.available)[:5])",
        expectedOutput: "",
        hints: ["plt.style.available è una lista", "Contiene nomi come 'ggplot', 'dark_background'"],
        explanation: "plt.style.available elenca tutti i temi grafici disponibili.",
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
        descTemplate: "Calcola la mancia media per giorno della settimana.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df.groupby('day')['tip'].mean().round(2))",
        expectedOutput: "",
        hints: ["groupby('day') raggruppa per giorno", "Applica .mean() alla colonna 'tip'"],
        explanation: "GroupBy permette di calcolare statistiche per ogni categoria.",
        brokenCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df.group_by('day').tip.avg())",
        debugHint: "groupby (attaccato), mean() (non avg())."
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
        titleTemplate: "Analisi completa tips",
        descTemplate: "Calcola: media tip per (day, time), ordina decrescente.",
        starterCode: "import seaborn as sns\n",
        solutionCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nresult = df.groupby(['day', 'time'])['tip'].mean().round(2)\nprint(result.sort_values(ascending=False))",
        expectedOutput: "",
        hints: ["groupby accetta lista di colonne", "sort_values() ordina la Series"],
        explanation: "Multi-groupby crea un indice gerarchico per analisi dettagliata.",
        brokenCode: "import seaborn as sns\ndf = sns.load_dataset('tips')\nprint(df.groupby('day', 'time')['tip'].mean())",
        debugHint: "groupby vuole una lista: groupby(['day', 'time']), non due argomenti."
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
        descTemplate: "Stampa il valore della variabile HOME (o mostra 'non trovata').",
        starterCode: "import os\n",
        solutionCode: "import os\nprint(os.environ.get('HOME', 'non trovata'))",
        expectedOutput: "",
        hints: ["os.environ è un dizionario", ".get(key, default) evita errori"],
        explanation: "os.environ.get() accede alle variabili d'ambiente in modo sicuro.",
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
        titleTemplate: "Datetime corrente",
        descTemplate: "Importa datetime e stampa l'anno corrente.",
        starterCode: "from datetime import datetime\n",
        solutionCode: "from datetime import datetime\nprint(datetime.now().year)",
        expectedOutput: "",
        hints: ["datetime.now() dà data/ora corrente", ".year estrae l'anno"],
        explanation: "datetime.now() restituisce un oggetto con data e ora attuali.",
        brokenCode: "from datetime import datetime\nprint(datetime.current_year())",
        debugHint: "Usa datetime.now().year, non current_year()."
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
        titleTemplate: "Decoratore timer",
        descTemplate: "Crea un decoratore che misura il tempo di esecuzione.",
        starterCode: "import time\n",
        solutionCode: "import time\ndef timer(func):\n    def wrapper(*args):\n        start = time.time()\n        result = func(*args)\n        print(f'{func.__name__}: {time.time()-start:.4f}s')\n        return result\n    return wrapper\n\n@timer\ndef test():\n    return sum(range(1000))\n\ntest()",
        expectedOutput: "",
        hints: ["Un decoratore è una funzione che wrappa un'altra funzione", "Usa *args per argomenti generici"],
        explanation: "I decoratori estendono il comportamento di funzioni senza modificarle.",
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
