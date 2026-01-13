// Python Exercise Generator - Part 1: Core structure and first topics

import { Difficulty } from '../types';
import { PythonExercise, PythonTopicId, PythonExerciseBlueprint } from '../pythonTypes';

// Utility functions
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Exercise database
const PYTHON_QUESTION_DATABASE: Record<string, Record<string, PythonExerciseBlueprint[]>> = {
  // ==================== OPERATORS ====================
  [PythonTopicId.Operators]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Somma di due numeri",
        descTemplate: "Dati due numeri a=5 e b=3, calcola e stampa la loro somma.",
        starterCode: "a = 5\nb = 3\n",
        solutionCode: "a = 5\nb = 3\nprint(a + b)",
        expectedOutput: "8",
        hints: ["Usa l'operatore +", "Ricorda di usare print() per stampare"],
        explanation: "L'operatore + somma due numeri. print() mostra il risultato.",
        brokenCode: "a = 5\nb = 3\nprint(a - b)",
        debugHint: "Controlla l'operatore: stai sottraendo invece di sommare."
      },
      {
        titleTemplate: "Differenza tra numeri",
        descTemplate: "Dati a=10 e b=4, calcola e stampa la differenza (a - b).",
        starterCode: "a = 10\nb = 4\n",
        solutionCode: "a = 10\nb = 4\nprint(a - b)",
        expectedOutput: "6",
        hints: ["Usa l'operatore -", "a - b significa 'a meno b'"],
        explanation: "L'operatore - sottrae il secondo numero dal primo.",
        brokenCode: "a = 10\nb = 4\nprint(b - a)",
        debugHint: "L'ordine degli operandi è invertito."
      },
      {
        titleTemplate: "Prodotto semplice",
        descTemplate: "Moltiplica 7 per 6 e stampa il risultato.",
        starterCode: "",
        solutionCode: "print(7 * 6)",
        expectedOutput: "42",
        hints: ["L'operatore di moltiplicazione è *", "Puoi fare print(7 * 6) direttamente"],
        explanation: "L'asterisco * è l'operatore di moltiplicazione in Python.",
        brokenCode: "print(7 x 6)",
        debugHint: "In Python la moltiplicazione usa * non x."
      },
      {
        titleTemplate: "Divisione decimale",
        descTemplate: "Dividi 15 per 2 e stampa il risultato.",
        starterCode: "",
        solutionCode: "print(15 / 2)",
        expectedOutput: "7.5",
        hints: ["Usa l'operatore /", "La divisione normale restituisce un float"],
        explanation: "L'operatore / esegue la divisione e restituisce sempre un float.",
        brokenCode: "print(15 // 2)",
        debugHint: "// è divisione intera, / è divisione normale."
      },
      {
        titleTemplate: "Divisione intera",
        descTemplate: "Calcola quante volte 3 sta in 10 (divisione intera).",
        starterCode: "",
        solutionCode: "print(10 // 3)",
        expectedOutput: "3",
        hints: ["Usa // per la divisione intera", "// scarta la parte decimale"],
        explanation: "L'operatore // (floor division) restituisce solo la parte intera.",
        brokenCode: "print(10 / 3)",
        debugHint: "Stai usando / invece di // per la divisione intera."
      },
      {
        titleTemplate: "Area del quadrato",
        descTemplate: "Calcola l'area di un quadrato con lato = 5.",
        starterCode: "lato = 5\n",
        solutionCode: "lato = 5\nprint(lato * lato)",
        expectedOutput: "25",
        hints: ["L'area è lato per lato", "Usa l'operatore *"],
        explanation: "In Python l'asterisco * serve per moltiplicare.",
        brokenCode: "lato = 5\nprint(lato ^ 2)",
        debugHint: "In Python ^ non è la potenza, usa * lato o ** 2."
      },
      {
        titleTemplate: "Media aritmetica",
        descTemplate: "Calcola la media di tre numeri: 6, 8, 10.",
        starterCode: "a = 6\nb = 8\nc = 10\n",
        solutionCode: "a = 6\nb = 8\nc = 10\nprint((a + b + c) / 3)",
        expectedOutput: "8.0",
        hints: ["Somma i tre numeri e dividi per 3", "Usa le parentesi per la somma"],
        explanation: "Le parentesi (a+b+c) forzano l'ordine delle operazioni prima della divisione.",
        brokenCode: "print(6 + 8 + 10 / 3)",
        debugHint: "Senza parentesi, dividi solo l'ultimo numero per 3."
      },
      {
        titleTemplate: "Resto pari o dispari",
        descTemplate: "Trova il resto della divisione di 7 per 2.",
        starterCode: "n = 7\n",
        solutionCode: "n = 7\nprint(n % 2)",
        expectedOutput: "1",
        hints: ["Usa l'operatore modulo %", "n % 2 restituisce 1 se dispari"],
        explanation: "L'operatore % restituisce il resto della divisione intera.",
        brokenCode: "n = 7\nprint(n / 2)",
        debugHint: "/ fa la divisione, % fa il modulo (resto)."
      },
      {
        titleTemplate: "Incremento variabile",
        descTemplate: "Incrementa la variabile x di 1 e stampala.",
        starterCode: "x = 99\n",
        solutionCode: "x = 99\nx = x + 1\nprint(x)",
        expectedOutput: "100",
        hints: ["Puoi fare x = x + 1", "Oppure x += 1"],
        explanation: "L'istruzione x = x + 1 prende il valore attuale, aggiunge 1 e riassegna.",
        brokenCode: "x = 99\nx + 1\nprint(x)",
        debugHint: "L'espressione x+1 calcola il valore ma non lo salva in x."
      },
      {
        titleTemplate: "Conversione Minuti",
        descTemplate: "Converti 120 minuti in ore (divisione esatta).",
        starterCode: "minuti = 120\n",
        solutionCode: "minuti = 120\nprint(minuti / 60)",
        expectedOutput: "2.0",
        hints: ["Ci sono 60 minuti in un'ora", "Usa la divisione /"],
        explanation: "Dividendo per 60 otteniamo le ore.",
        brokenCode: "minuti = 120\nprint(minuti * 60)",
        debugHint: "Per passare da minuti a ore devi dividere, non moltiplicare."
      },
      {
        titleTemplate: "Perimetro Rettangolo",
        descTemplate: "Calcola il perimetro di un rettangolo con base 4 e altezza 3.",
        starterCode: "b = 4\nh = 3\n",
        solutionCode: "b = 4\nh = 3\nprint(2 * (b + h))",
        expectedOutput: "14",
        hints: ["La formula è 2 * (base + altezza)", "Attento alle parentesi"],
        explanation: "Le parentesi impongono di sommare base e altezza prima di moltiplicare per 2.",
        brokenCode: "b = 4\nh = 3\nprint(2 * b + h)",
        debugHint: "Hai dimenticato le parentesi: stai raddoppiando solo la base."
      },
      {
        titleTemplate: "Cubo",
        descTemplate: "Calcola il cubo di 3 (3 alla terza).",
        starterCode: "n = 3\n",
        solutionCode: "n = 3\nprint(n ** 3)",
        expectedOutput: "27",
        hints: ["Usa l'operatore potenza **", "n ** 3 significa n^3"],
        explanation: "** è l'operatore di elevamento a potenza in Python.",
        brokenCode: "n = 3\nprint(n ^ 3)",
        debugHint: "^ è XOR bitwise, non potenza."
      },
      {
        titleTemplate: "Sconto 10%",
        descTemplate: "Se il prezzo è 100, calcola il prezzo scontato del 10%.",
        starterCode: "prezzo = 100\n",
        solutionCode: "prezzo = 100\nprint(prezzo * 0.9)",
        expectedOutput: "90.0",
        hints: ["Moltiplica per 0.9", "Oppure prezzo - (prezzo * 0.1)"],
        explanation: "Moltiplicare per 0.9 equivale al 90% del valore.",
        brokenCode: "prezzo = 100\nprint(prezzo - 10%)",
        debugHint: "Non puoi usare il simbolo % per percentuale, usa 0.1."
      },
      {
        titleTemplate: "Negazione",
        descTemplate: "Stampa l'opposto (negativo) di x.",
        starterCode: "x = 15\n",
        solutionCode: "x = 15\nprint(-x)",
        expectedOutput: "-15",
        hints: ["Usa il segno meno davanti alla variabile", "print(-x)"],
        explanation: "L'operatore unario - inverte il segno del numero.",
        brokenCode: "x = 15\nprint(negative(x))",
        debugHint: "Non esiste una funzione negative(), usa il segno meno."
      },
      {
        titleTemplate: "Giorni in Ore",
        descTemplate: "Quante ore ci sono in 2 giorni?",
        starterCode: "giorni = 2\n",
        solutionCode: "giorni = 2\nprint(giorni * 24)",
        expectedOutput: "48",
        hints: ["Un giorno ha 24 ore", "Moltiplica giorni per 24"],
        explanation: "Conversione semplice moltiplicando per il fattore 24.",
        brokenCode: "giorni = 2\nprint(giorni + 24)",
        debugHint: "Devi moltiplicare, non sommare."
      },
      {
        titleTemplate: "Concatena Numeri Str",
        descTemplate: "Unisci '1' e '0' come stringhe.",
        starterCode: "a = '1'\nb = '0'\n",
        solutionCode: "a = '1'\nb = '0'\nprint(a + b)",
        expectedOutput: "10",
        hints: ["L'operatore + concatena stringhe", "Il risultato sarà '10'"],
        explanation: "Con le stringhe, + unisce i testi invece di sommare.",
        brokenCode: "a = '1'\nb = '0'\nprint(a . b)",
        debugHint: "In Python si usa + per concatenare, non il punto."
      },
      {
        titleTemplate: "Divisione con resto (divmod)",
        descTemplate: "Dividi 10 per 3: ottieni quoziente intero e resto.",
        starterCode: "",
        solutionCode: "print(10 // 3)\nprint(10 % 3)",
        expectedOutput: "3\n1",
        hints: ["// per il quoziente", "% per il resto"],
        explanation: "10 diviso 3 fa 3 con resto 1.",
        brokenCode: "print(10 / 3)\nprint(10 % 3)",
        debugHint: "/ dà il decimale 3.33..., // dà l'intero 3."
      },
      {
        titleTemplate: "Priorità moltiplicazione",
        descTemplate: "Calcola 5 + 2 * 3.",
        starterCode: "",
        solutionCode: "print(5 + 2 * 3)",
        expectedOutput: "11",
        hints: ["La moltiplicazione viene prima", "2*3=6, poi 5+6=11"],
        explanation: "Python segue l'ordine PEMDAS: moltiplicazioni prima delle addizioni.",
        brokenCode: "print((5 + 2) * 3)",
        debugHint: "Le parentesi cambiano l'ordine: (7)*3 = 21, non 11."
      },
      {
        titleTemplate: "Decremento",
        descTemplate: "Togli 5 alla variabile score.",
        starterCode: "score = 100\n",
        solutionCode: "score = 100\nscore -= 5\nprint(score)",
        expectedOutput: "95",
        hints: ["Usa score = score - 5", "O score -= 5"],
        explanation: "-= sottrae un valore e aggiorna la variabile.",
        brokenCode: "score = 100\nscore - 5\nprint(score)",
        debugHint: "L'operazione score-5 non salva il risultato."
      },
      {
        titleTemplate: "Assegnazione multipla",
        descTemplate: "Assegna a=1 e b=2 in una riga, poi stampa la somma.",
        starterCode: "# Assegna a, b = ...\n",
        solutionCode: "a, b = 1, 2\nprint(a + b)",
        expectedOutput: "3",
        hints: ["a, b = 1, 2 usa la virgola", "Poi print(a+b)"],
        explanation: "Python permette di assegnare più variabili contemporaneamente con le virgole.",
        brokenCode: "a = 1, b = 2\nprint(a + b)",
        debugHint: "Sintassi errata. Usa: a, b = 1, 2"
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Resto della divisione",
        descTemplate: "Calcola il resto della divisione di 17 per 5 usando l'operatore modulo.",
        starterCode: "",
        solutionCode: "print(17 % 5)",
        expectedOutput: "2",
        hints: ["L'operatore modulo è %", "Restituisce il resto della divisione"],
        explanation: "Il modulo (%) restituisce il resto: 17 = 5*3 + 2, quindi resto = 2.",
        brokenCode: "print(17 / 5)",
        debugHint: "/ è divisione, % è modulo (resto)."
      },
      {
        titleTemplate: "Potenza",
        descTemplate: "Calcola 2 elevato alla 8 (2^8).",
        starterCode: "",
        solutionCode: "print(2 ** 8)",
        expectedOutput: "256",
        hints: ["L'operatore potenza è **", "2 ** 8 significa 2^8"],
        explanation: "L'operatore ** eleva la base all'esponente.",
        brokenCode: "print(2 ^ 8)",
        debugHint: "In Python ^ è XOR bitwise, usa ** per la potenza."
      },
      {
        titleTemplate: "Operatore +=",
        descTemplate: "Incrementa la variabile x di 5 usando l'operatore +=, poi stampala.",
        starterCode: "x = 10\n# Incrementa x di 5 usando +=\n",
        solutionCode: "x = 10\nx += 5\nprint(x)",
        expectedOutput: "15",
        hints: ["x += 5 equivale a x = x + 5", "È un'assegnazione composta"],
        explanation: "+= è un operatore di assegnazione composta che somma e riassegna.",
        brokenCode: "x = 10\nx + 5\nprint(x)",
        debugHint: "x + 5 non modifica x, devi usare += o x = x + 5."
      },
      {
        titleTemplate: "Precedenza operatori",
        descTemplate: "Calcola 2 + 3 * 4 e spiega perché il risultato non è 20.",
        starterCode: "",
        solutionCode: "print(2 + 3 * 4)",
        expectedOutput: "14",
        hints: ["La moltiplicazione ha precedenza sull'addizione", "Prima 3*4=12, poi 2+12=14"],
        explanation: "Come in matematica, * e / hanno precedenza su + e -.",
        brokenCode: "print((2 + 3) * 4)",
        debugHint: "Le parentesi cambiano la precedenza: qui fai (2+3)*4=20."
      },
      {
        titleTemplate: "Funzione abs()",
        descTemplate: "Calcola il valore assoluto di -42.",
        starterCode: "",
        solutionCode: "print(abs(-42))",
        expectedOutput: "42",
        hints: ["Usa la funzione abs()", "abs() restituisce il valore senza segno"],
        explanation: "abs(x) restituisce il valore assoluto, rimuovendo il segno negativo.",
        brokenCode: "print(-(-42))",
        debugHint: "Funziona ma usa abs() per chiarezza."
      },
      {
        titleTemplate: "Arrotondamento",
        descTemplate: "Arrotonda 3.7 al numero intero più vicino.",
        starterCode: "n = 3.7\n",
        solutionCode: "n = 3.7\nprint(round(n))",
        expectedOutput: "4",
        hints: ["Usa la funzione round()", "round(3.7) diventa 4"],
        explanation: "round() arrotonda all'intero più vicino.",
        brokenCode: "n = 3.7\nprint(int(n))",
        debugHint: "int() tronca a 3, round() arrotonda a 4."
      },
      {
        titleTemplate: "Area Cerchio",
        descTemplate: "Calcola l'area di un cerchio raggio=5 (usa pi=3.14).",
        starterCode: "r = 5\npi = 3.14\n# Area = pi * r^2\n",
        solutionCode: "r = 5\npi = 3.14\nprint(pi * r ** 2)",
        expectedOutput: "78.5",
        hints: ["raggio al quadrato è r**2", "Moltiplica per pi"],
        explanation: "La formula è pi * raggio^2.",
        brokenCode: "r = 5\npi = 3.14\nprint(pi * r * 2)",
        debugHint: "Hai calcolato la circonferenza (2*pi*r), non l'area."
      },
      {
        titleTemplate: "Ultima cifra",
        descTemplate: "Estrai l'ultima cifra del numero 1234.",
        starterCode: "n = 1234\n",
        solutionCode: "n = 1234\nprint(n % 10)",
        expectedOutput: "4",
        hints: ["Il resto della divisione per 10 dà l'ultima cifra", "Usa % 10"],
        explanation: "n % 10 restituisce sempre la cifra delle unità.",
        brokenCode: "n = 1234\nprint(n // 10)",
        debugHint: "// 10 rimuove l'ultima cifra, % 10 la estrae."
      },
      {
        titleTemplate: "Rimuovi ultima cifra",
        descTemplate: "Rimuovi l'ultima cifra da 9876 (ottieni 987).",
        starterCode: "n = 9876\n",
        solutionCode: "n = 9876\nprint(n // 10)",
        expectedOutput: "987",
        hints: ["La divisione intera per 10 elimina le unità", "Usa // 10"],
        explanation: "n // 10 sposta la virgola a sinistra troncando il decimale.",
        brokenCode: "n = 9876\nprint(n % 10)",
        debugHint: "% 10 ti dà solo il 6, tu vuoi il resto del numero."
      },
      {
        titleTemplate: "Scambio variabili",
        descTemplate: "Scambia i valori di a e b senza variabile temporanea.",
        starterCode: "a = 5\nb = 10\n",
        solutionCode: "a = 5\nb = 10\na, b = b, a\nprint(a)\nprint(b)",
        expectedOutput: "10\n5",
        hints: ["Usa assegnazione multipla: x, y = y, x", "Python lo permette nativamente"],
        explanation: "a, b = b, a scambia i valori in modo atomico.",
        brokenCode: "a = 5\nb = 10\na = b\nb = a\nprint(a)\nprint(b)",
        debugHint: "Così perdi il valore originale di a. Usa a, b = b, a."
      },
      {
        titleTemplate: "Ipotenusa",
        descTemplate: "Calcola ipotenusa triangolo rettangolo cateti 3 e 4 ((a^2 + b^2)^0.5).",
        starterCode: "a = 3\nb = 4\n",
        solutionCode: "a = 3\nb = 4\nprint((a**2 + b**2)**0.5)",
        expectedOutput: "5.0",
        hints: ["Radice quadrata è potenza 0.5", "Somma i quadrati prima"],
        explanation: "Teorema di Pitagora: c = radice(a^2 + b^2).",
        brokenCode: "a = 3\nb = 4\nprint(a**2 + b**2 ** 0.5)",
        debugHint: "Mancano le parentesi attorno alla somma dei quadrati."
      },
      {
        titleTemplate: "Temperatura F to C",
        descTemplate: "Converti 100 Fahrenheit in Celsius: (F - 32) * 5/9.",
        starterCode: "f = 100\n",
        solutionCode: "f = 100\nprint((f - 32) * 5 / 9)",
        expectedOutput: "37.77777777777778",
        hints: ["Rispettare le parentesi (f-32)", "Poi moltiplica per 5/9"],
        explanation: "Sottrarre 32 prima di moltiplicare è essenziale.",
        brokenCode: "f = 100\nprint(f - 32 * 5 / 9)",
        debugHint: "Precedenza corretta: (f-32) deve stare tra parentesi."
      },
      {
        titleTemplate: "Max di 3",
        descTemplate: "Trova il massimo tra a=5, b=12, c=9 usando max().",
        starterCode: "a, b, c = 5, 12, 9\n",
        solutionCode: "a, b, c = 5, 12, 9\nprint(max(a, b, c))",
        expectedOutput: "12",
        hints: ["max() accetta più argomenti", "max(a, b, c)"],
        explanation: "max() restituisce l'argomento con valore più alto.",
        brokenCode: "a, b, c = 5, 12, 9\nprint(max([a, b, c]))",
        debugHint: "Funziona anche con lista, ma max(a,b,c) è più diretto."
      },
      {
        titleTemplate: "Valore assoluto diff",
        descTemplate: "Calcola la differenza assoluta tra 5 e 10.",
        starterCode: "a = 5\nb = 10\n",
        solutionCode: "a = 5\nb = 10\nprint(abs(a - b))",
        expectedOutput: "5",
        hints: ["Sottrai e poi usa abs()", "Il risultato deve essere positivo"],
        explanation: "abs() garantisce che la distanza sia sempre positiva.",
        brokenCode: "a = 5\nb = 10\nprint(abs(a) - abs(b))",
        debugHint: "abs(a-b) non è uguale a abs(a)-abs(b)."
      },
      {
        titleTemplate: "Divisibilità per 3",
        descTemplate: "Stampa True se 9 è divisibile per 3, False altrimenti.",
        starterCode: "n = 9\n# Stampa n % 3 == 0\n",
        solutionCode: "n = 9\nprint(n % 3 == 0)",
        expectedOutput: "True",
        hints: ["Un numero è divisibile se il resto (%) è 0", "Confronta con == 0"],
        explanation: "Il test di divisibilità si fa controllando se il modulo è 0.",
        brokenCode: "n = 9\nprint(n % 3 = 0)",
        debugHint: "Usa == per confrontare, non =."
      },
      {
        titleTemplate: "Percentuale inversa",
        descTemplate: "Se 20 è il 50% di x, quanto vale x? (20 / 0.50).",
        starterCode: "parte = 20\npercentuale = 0.50\n",
        solutionCode: "parte = 20\npercentuale = 0.50\nprint(parte / percentuale)",
        expectedOutput: "40.0",
        hints: ["Dividi la parte per la percentuale decimale", "valore / 0.5"],
        explanation: "Formula inversa della percentuale: Totale = Parte / %.",
        brokenCode: "parte = 20\npercentuale = 0.50\nprint(parte * percentuale)",
        debugHint: "Moltiplicando ottieni il 50% di 20, non il totale."
      },
      {
        titleTemplate: "Secondi in Giorno",
        descTemplate: "Calcola quanti secondi ci sono in 1 giorno.",
        starterCode: "",
        solutionCode: "print(24 * 60 * 60)",
        expectedOutput: "86400",
        hints: ["Moltiplica ore*min*sec", "24 * 60 * 60"],
        explanation: "Conversione a catena di unità di tempo.",
        brokenCode: "print(24 * 60 + 60)",
        debugHint: "Devi moltiplicare i fattori, non sommare."
      },
      {
        titleTemplate: "Elevamento negativo",
        descTemplate: "Calcola 2 alla -1 (reciproco).",
        starterCode: "n = 2\n",
        solutionCode: "n = 2\nprint(n ** -1)",
        expectedOutput: "0.5",
        hints: ["Usa esponente negativo", "Equivale a 1/n"],
        explanation: "Un esponente negativo calcola il reciproco.",
        brokenCode: "n = 2\nprint(n ^ -1)",
        debugHint: "^ è XOR, usa **."
      },
      {
        titleTemplate: "Check dispari",
        descTemplate: "Stampa True se 7 è dispari (n % 2 != 0).",
        starterCode: "n = 7\n",
        solutionCode: "n = 7\nprint(n % 2 != 0)",
        expectedOutput: "True",
        hints: ["Dispari se resto diviso 2 non è 0", "Usa !="],
        explanation: "!= verifica la disuguaglianza.",
        brokenCode: "n = 7\nprint(n % 2 <> 0)",
        debugHint: "<> è sintassi obsoleta, usa !=."
      },
      {
        titleTemplate: "Minimo di lista",
        descTemplate: "Trova il minimo nella lista [5, 1, 8] con min().",
        starterCode: "lst = [5, 1, 8]\n",
        solutionCode: "lst = [5, 1, 8]\nprint(min(lst))",
        expectedOutput: "1",
        hints: ["Passa la lista a min()", "min(lst)"],
        explanation: "min() accetta anche un iterabile come una lista.",
        brokenCode: "lst = [5, 1, 8]\nprint(ls.min())",
        debugHint: "Le liste non hanno metodo .min(), usa la funzione min(lista)."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "min() e max()",
        descTemplate: "Data una lista di numeri, trova e stampa il minimo e il massimo.",
        starterCode: "numeri = [23, 7, 45, 12, 89, 3]\n",
        solutionCode: "numeri = [23, 7, 45, 12, 89, 3]\nprint(min(numeri))\nprint(max(numeri))",
        expectedOutput: "3\n89",
        hints: ["Usa min() e max()", "Funzionano su liste e sequenze"],
        explanation: "min() e max() trovano il valore minimo e massimo in una sequenza.",
        brokenCode: "numeri = [23, 7, 45, 12, 89, 3]\nprint(minimum(numeri))",
        debugHint: "La funzione si chiama min(), non minimum()."
      },
      {
        titleTemplate: "pow() con tre argomenti",
        descTemplate: "Calcola 3^4 modulo 5 usando pow() con tre argomenti.",
        starterCode: "",
        solutionCode: "print(pow(3, 4, 5))",
        expectedOutput: "1",
        hints: ["pow(base, exp, mod) calcola (base^exp) % mod", "3^4 = 81, 81 % 5 = 1"],
        explanation: "pow(a, b, c) è efficiente per calcolare (a^b) % c.",
        brokenCode: "print(pow(3, 4) % 5)",
        debugHint: "Funziona, ma pow(3,4,5) è più efficiente."
      },
      {
        titleTemplate: "Espressione complessa",
        descTemplate: "Calcola: ((10 + 5) * 2 - 8) // 3 ** 2",
        starterCode: "",
        solutionCode: "print(((10 + 5) * 2 - 8) // 3 ** 2)",
        expectedOutput: "2",
        hints: ["Segui la precedenza: ** prima di // prima di * e -", "(10+5)*2=30, 30-8=22, 3**2=9, 22//9=2"],
        explanation: "Precedenza: parentesi > ** > * // > + -",
        brokenCode: "print((10 + 5) * 2 - 8 // 3 ** 2)",
        debugHint: "Servono le parentesi per raggruppare correttamente."
      },
      {
        titleTemplate: "Verifica pari/dispari",
        descTemplate: "Verifica se 47 è pari o dispari usando il modulo.",
        starterCode: "n = 47\n",
        solutionCode: "n = 47\nprint(n % 2)",
        expectedOutput: "1",
        hints: ["Se n % 2 == 0 è pari, altrimenti dispari", "1 significa dispari"],
        explanation: "n % 2 restituisce 0 per numeri pari, 1 per dispari.",
        brokenCode: "n = 47\nprint(n / 2)",
        debugHint: "/ dà 23.5, usa % per il resto."
      },
      {
        titleTemplate: "Operatori multipli",
        descTemplate: "Usa *= e //= per: parti da 100, moltiplica per 3, poi dividi intero per 4.",
        starterCode: "x = 100\n# Moltiplica x per 3 con *=\n# Dividi x per 4 con //=\n",
        solutionCode: "x = 100\nx *= 3\nx //= 4\nprint(x)",
        expectedOutput: "75",
        hints: ["*= moltiplica e riassegna", "//= divide (intero) e riassegna"],
        explanation: "100*3=300, 300//4=75. Gli operatori composti modificano la variabile.",
        brokenCode: "x = 100\nx * 3\nx // 4\nprint(x)",
        debugHint: "Senza = non stai modificando x, devi usare *= e //=."
      },
      {
        titleTemplate: "Bitwise AND",
        descTemplate: "Calcola 12 AND 10 bit a bit (&).",
        starterCode: "a = 12 # 1100\nb = 10 # 1010\n",
        solutionCode: "a = 12\nb = 10\nprint(a & b)",
        expectedOutput: "8",
        hints: ["L'operatore AND bitwise è &", "1100 & 1010 = 1000 (8)"],
        explanation: "& confronta i bit: 1 se entrambi sono 1, altrimenti 0.",
        brokenCode: "a = 12\nb = 10\nprint(a && b)",
        debugHint: "&& è operatore logico di altri linguaggi, in Python usa & o and."
      },
      {
        titleTemplate: "Bitwise OR",
        descTemplate: "Calcola 12 OR 10 bit a bit (|).",
        starterCode: "a = 12\nb = 10\n",
        solutionCode: "a = 12\nb = 10\nprint(a | b)",
        expectedOutput: "14",
        hints: ["L'operatore OR bitwise è |", "1100 | 1010 = 1110 (14)"],
        explanation: "| imposta il bit a 1 se almeno uno dei operandi ha 1.",
        brokenCode: "a = 12\nb = 10\nprint(a or b)",
        debugHint: "'or' è logico e restituisce il primo valore truthy (12), non il bitwise OR."
      },
      {
        titleTemplate: "Bitwise XOR",
        descTemplate: "Calcola 12 XOR 10 (^).",
        starterCode: "a = 12\nb = 10\n",
        solutionCode: "a = 12\nb = 10\nprint(a ^ b)",
        expectedOutput: "6",
        hints: ["XOR restituisce 1 se i bit sono diversi", "1100 ^ 1010 = 0110 (6)"],
        explanation: "^ (XOR) è 1 solo quando i bit differiscono.",
        brokenCode: "a = 12\nb = 10\nprint(a ^^ b)",
        debugHint: "L'operatore XOR è un singolo ^."
      },
      {
        titleTemplate: "Left Shift",
        descTemplate: "Sposta i bit di 5 a sinistra di 2 posizioni (<< 2).",
        starterCode: "n = 5 # 0101\n",
        solutionCode: "n = 5\nprint(n << 2)",
        expectedOutput: "20",
        hints: ["<< sposta i bit a sinistra", "Equivale a moltiplicare per 2^k"],
        explanation: "5 (0101) << 2 diventa 20 (10100).",
        brokenCode: "n = 5\nprint(n < 2)",
        debugHint: "< è minore, << è shift."
      },
      {
        titleTemplate: "Right Shift",
        descTemplate: "Sposta 20 a destra di 2 posizioni (>> 2).",
        starterCode: "n = 20\n",
        solutionCode: "n = 20\nprint(n >> 2)",
        expectedOutput: "5",
        hints: [">> sposta i bit a destra", "Divide per 2^k (intera)"],
        explanation: "20 (10100) >> 2 diventa 5 (00101).",
        brokenCode: "n = 20\nprint(n > 2)",
        debugHint: "> è maggiore, >> è shift."
      },
      {
        titleTemplate: "Not Bitwise",
        descTemplate: "Calcola il complemento bit a bit di 5 (~).",
        starterCode: "n = 5\n",
        solutionCode: "n = 5\nprint(~n)",
        expectedOutput: "-6",
        hints: ["~n inverte tutti i bit", "Equivale a -(n+1)"],
        explanation: "~n in Python (complemento a due) vale -(n+1).",
        brokenCode: "n = 5\nprint(!n)",
        debugHint: "! non esiste come operatore, usa 'not' per logica o '~' per bitwise."
      },
      {
        titleTemplate: "Binario stringa",
        descTemplate: "Ottieni la rappresentazione binaria di 10.",
        starterCode: "n = 10\n",
        solutionCode: "n = 10\nprint(bin(n))",
        expectedOutput: "0b1010",
        hints: ["Usa la funzione bin()", "Restituisce stringa con prefisso 0b"],
        explanation: "bin() converte un intero in stringa binaria.",
        brokenCode: "n = 10\nprint(binary(n))",
        debugHint: "La funzione è bin(), non binary()."
      },
      {
        titleTemplate: "Esadecimale",
        descTemplate: "Converti 255 in esadecimale.",
        starterCode: "n = 255\n",
        solutionCode: "n = 255\nprint(hex(n))",
        expectedOutput: "0xff",
        hints: ["Usa la funzione hex()", "255 è FF in hex"],
        explanation: "hex() converte un intero in stringa esadecimale (prefisso 0x).",
        brokenCode: "n = 255\nprint(n.hex())",
        debugHint: "I numeri interi non hanno metodo .hex(), usa hex(n)."
      },
      {
        titleTemplate: "Round negativo",
        descTemplate: "Arrotonda 1234 alle centinaia (secondo argomento -2).",
        starterCode: "n = 1234\n",
        solutionCode: "n = 1234\nprint(round(n, -2))",
        expectedOutput: "1200",
        hints: ["round(n, -2) arrotonda a 10^2", "1234 -> 1200"],
        explanation: "Argomenti negativi in round() arrotondano alla sinistra della virgola.",
        brokenCode: "n = 1234\nprint(round(n, 2))",
        debugHint: "2 arrotonda i decimali, -2 arrotonda le centinaia."
      },
      {
        titleTemplate: "Radice quadrata pow",
        descTemplate: "Calcola la radice di 2 con pow(2, 0.5) e stampa.",
        starterCode: "",
        solutionCode: "print(pow(2, 0.5))",
        expectedOutput: "1.4142135623730951",
        hints: ["pow(base, exp)", "Esponente 0.5 è radice"],
        explanation: "pow(x, 0.5) calcola la radice quadrata.",
        brokenCode: "print(sqrt(2))",
        debugHint: "sqrt non è definita di default, usa pow() o importa math."
      },
      {
        titleTemplate: "Precedenza Bitwise",
        descTemplate: "Calcola 5 + 1 << 2. Attento alla precedenza!",
        starterCode: "",
        solutionCode: "print(5 + 1 << 2)",
        expectedOutput: "24",
        hints: ["Addizione (+) ha precedenza su Shift (<<)", "Prima 5+1=6, poi 6<<2=24"],
        explanation: "In Python + e - hanno precedenza sugli operatori di shift.",
        brokenCode: "print(5 + (1 << 2))",
        debugHint: "Qui stavi forzando una precedenza diversa, Python fa prima la somma."
      },
      {
        titleTemplate: "Potenza modulare",
        descTemplate: "Calcola (2^10) % 1000 efficientemente.",
        starterCode: "",
        solutionCode: "print(pow(2, 10, 1000))",
        expectedOutput: "24",
        hints: ["pow(2, 10, 1000)", "Molto veloce per grandi numeri"],
        explanation: "pow(base, exp, mod) esegue l'esponenziazione modulare.",
        brokenCode: "print(2 ** 10 % 1000)",
        debugHint: "Corretto ma meno efficiente per numeri enormi di pow(,,)."
      },
      {
        titleTemplate: "Numeri Complessi",
        descTemplate: "Crea un numero complesso 3+4j e stampa la sua parte reale.",
        starterCode: "z = 3 + 4j\n",
        solutionCode: "z = 3 + 4j\nprint(z.real)",
        expectedOutput: "3.0",
        hints: ["I complessi usano j", "Accedi con .real"],
        explanation: "I numeri complessi hanno attributi .real e .imag.",
        brokenCode: "z = 3 + 4j\nprint(real(z))",
        debugHint: "Non esiste funzione real(), usa attributo z.real."
      },
      {
        titleTemplate: "Modulo numeri negativi",
        descTemplate: "Calcola -5 % 2 (risultato Python).",
        starterCode: "",
        solutionCode: "print(-5 % 2)",
        expectedOutput: "1",
        hints: ["In Python il resto ha il segno del divisore", "2 è positivo -> risultato positivo"],
        explanation: "-5 = 2*(-3) + 1. Il modulo segue il segno del divisore in Python.",
        brokenCode: "print(-5 / 2)",
        debugHint: "Questo stampa -2.5, non il modulo."
      },
      {
        titleTemplate: "Int da stringa hex",
        descTemplate: "Converti 'FF' base 16 in intero base 10.",
        starterCode: "s = 'FF'\n",
        solutionCode: "s = 'FF'\nprint(int(s, 16))",
        expectedOutput: "255",
        hints: ["int() accetta un secondo argomento base", "int('FF', 16)"],
        explanation: "int(stringa, base) converte da una base arbitraria a decimale.",
        brokenCode: "s = 'FF'\nprint(int(s))",
        debugHint: "int() assume base 10 di default, 'FF' non è base 10."
      }
    ],
  },

  // ==================== INPUT/OUTPUT ====================
  [PythonTopicId.InputOutput]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Hello World",
        descTemplate: "Stampa 'Hello, World!' a schermo.",
        starterCode: "",
        solutionCode: "print('Hello, World!')",
        expectedOutput: "Hello, World!",
        hints: ["Usa print() con una stringa tra virgolette", "Le stringhe vanno tra '' o \"\""],
        explanation: "print() è la funzione base per stampare output in Python.",
        brokenCode: "Print('Hello, World!')",
        debugHint: "Python è case-sensitive: print, non Print."
      },
      {
        titleTemplate: "Stampa variabile",
        descTemplate: "Crea una variabile nome='Python' e stampala.",
        starterCode: "nome = 'Python'\n",
        solutionCode: "nome = 'Python'\nprint(nome)",
        expectedOutput: "Python",
        hints: ["Passa la variabile a print() senza virgolette", "print(nome) non print('nome')"],
        explanation: "Passando una variabile a print(), stampi il suo valore.",
        brokenCode: "nome = 'Python'\nprint('nome')",
        debugHint: "Stai stampando la stringa 'nome', non la variabile!"
      },
      {
        titleTemplate: "Stampa multipla",
        descTemplate: "Stampa il tuo nome e la tua età su righe separate.",
        starterCode: "nome = 'Mario'\neta = 25\n",
        solutionCode: "nome = 'Mario'\neta = 25\nprint(nome)\nprint(eta)",
        expectedOutput: "Mario\n25",
        hints: ["Usa due print() separati", "Ogni print() va a capo automaticamente"],
        explanation: "Ogni chiamata a print() termina con un newline.",
        brokenCode: "nome = 'Mario'\neta = 25\nprint(nome, eta)",
        debugHint: "Questo stampa tutto su una riga con spazio, non su righe separate."
      },
      {
        titleTemplate: "Conversione a int",
        descTemplate: "Converti la stringa '42' in un numero intero e stampalo.",
        starterCode: "testo = '42'\n",
        solutionCode: "testo = '42'\nprint(int(testo))",
        expectedOutput: "42",
        hints: ["Usa int() per convertire", "int('42') restituisce 42 come numero"],
        explanation: "int() converte una stringa numerica in intero.",
        brokenCode: "testo = '42'\nprint(integer(testo))",
        debugHint: "La funzione si chiama int(), non integer()."
      },
      {
        titleTemplate: "Conversione a float",
        descTemplate: "Converti '3.14' in un numero decimale e stampalo.",
        starterCode: "pi_string = '3.14'\n",
        solutionCode: "pi_string = '3.14'\nprint(float(pi_string))",
        expectedOutput: "3.14",
        hints: ["Usa float() per numeri decimali", "float('3.14') restituisce 3.14"],
        explanation: "float() converte stringhe in numeri decimali (floating point).",
        brokenCode: "pi_string = '3.14'\nprint(decimal(pi_string))",
        debugHint: "La funzione si chiama float(), non decimal()."
      },
      {
        titleTemplate: "Stampa somma",
        descTemplate: "Stampa la somma di 5 e 3 direttamente.",
        starterCode: "",
        solutionCode: "print(5 + 3)",
        expectedOutput: "8",
        hints: ["Puoi mettere il calcolo dentro print()", "print(5 + 3)"],
        explanation: "print() valuta l'espressione e stampa il risultato.",
        brokenCode: "print '5 + 3'",
        debugHint: "In Python 3 servono le parentesi per print()."
      },
      {
        titleTemplate: "Stringa vuota",
        descTemplate: "Stampa una stringa vuota.",
        starterCode: "",
        solutionCode: "print('')",
        expectedOutput: "",
        hints: ["Stringa vuota è ''", "print('') stampa una riga vuota"],
        explanation: "Stampare '' produce solo un newline.",
        brokenCode: "print()",
        debugHint: "print() va bene, ma print('') è più esplicito per stringa vuota."
      },
      {
        titleTemplate: "Print con virgola",
        descTemplate: "Stampa 'Ciao' e 'Mondo' separati da virgola in print().",
        starterCode: "",
        solutionCode: "print('Ciao', 'Mondo')",
        expectedOutput: "Ciao Mondo",
        hints: ["La virgola aggiunge uno spazio automatico", "print(arg1, arg2)"],
        explanation: "print() unisce gli argomenti con uno spazio di default.",
        brokenCode: "print('Ciao' + 'Mondo')",
        debugHint: "Con + non c'è spazio, con la virgola sì."
      },
      {
        titleTemplate: "Numero negativo",
        descTemplate: "Stampa il numero -5.",
        starterCode: "",
        solutionCode: "print(-5)",
        expectedOutput: "-5",
        hints: ["Metti il meno davanti al 5", "print(-5)"],
        explanation: "I numeri negativi si indicano col segno meno.",
        brokenCode: "print(5-)",
        debugHint: "Il segno meno va prima del numero."
      },
      {
        titleTemplate: "Type Integer",
        descTemplate: "Stampa il tipo del numero 10.",
        starterCode: "n = 10\n",
        solutionCode: "n = 10\nprint(type(n))",
        expectedOutput: "<class 'int'>",
        hints: ["Usa type()", "type(10) è int"],
        explanation: "type() restituisce la classe dell'oggetto.",
        brokenCode: "n = 10\nprint(n.type)",
        debugHint: "Non esiste attributo .type, usa la funzione type()."
      },
      {
        titleTemplate: "Type String",
        descTemplate: "Stampa il tipo di 'ciao'.",
        starterCode: "s = 'ciao'\n",
        solutionCode: "s = 'ciao'\nprint(type(s))",
        expectedOutput: "<class 'str'>",
        hints: ["type('ciao')", "Dovrebbe essere str"],
        explanation: "Le stringhe sono di classe 'str'.",
        brokenCode: "print(type(ciao))",
        debugHint: "ciao senza virgolette è una variabile non definita."
      },
      {
        titleTemplate: "Boolean True",
        descTemplate: "Stampa il booleano True.",
        starterCode: "",
        solutionCode: "print(True)",
        expectedOutput: "True",
        hints: ["True ha la maiuscola", "Non usare virgolette"],
        explanation: "True è una parola chiave riservata.",
        brokenCode: "print(true)",
        debugHint: "In Python true minuscolo non esiste, usa True."
      },
      {
        titleTemplate: "Str di float",
        descTemplate: "Converti 3.5 in stringa e stampalo.",
        starterCode: "n = 3.5\n",
        solutionCode: "n = 3.5\nprint(str(n))",
        expectedOutput: "3.5",
        hints: ["Usa str()", "Sembra uguale ma è testo"],
        explanation: "str() converte qualsiasi oggetto in stringa.",
        brokenCode: "n = 3.5\nprint(n.toString())",
        debugHint: "In Python si usa str(n), non .toString()."
      },
      {
        titleTemplate: "Int troncamento",
        descTemplate: "Converti 9.99 in intero (tronca).",
        starterCode: "n = 9.99\n",
        solutionCode: "n = 9.99\nprint(int(n))",
        expectedOutput: "9",
        hints: ["int(9.99) rimuove i decimali", "Diventa 9"],
        explanation: "int() non arrotonda, tronca semplicemente la parte decimale.",
        brokenCode: "n = 9.99\nprint(round(n))",
        debugHint: "round() arrotonda a 10, ma qui chiediamo di troncare con int()."
      },
      {
        titleTemplate: "Float da int",
        descTemplate: "Converti l'intero 5 in float 5.0.",
        starterCode: "n = 5\n",
        solutionCode: "n = 5\nprint(float(n))",
        expectedOutput: "5.0",
        hints: ["float(5) diventa 5.0", "Aggiunge il decimale"],
        explanation: "float() converte un intero in numero decimale.",
        brokenCode: "n = 5\nprint(n.0)",
        debugHint: "Sintassi non valida."
      },
      {
        titleTemplate: "Escape Tab",
        descTemplate: "Stampa 'A' e 'B' separati da un tab con \\t.",
        starterCode: "",
        solutionCode: "print('A\\tB')",
        expectedOutput: "A\tB",
        hints: ["\\t è il carattere di tabulazione", "Dentro la stringa"],
        explanation: "\\t inserisce uno spazio di tabulazione.",
        brokenCode: "print('A/tB')",
        debugHint: "Lo slash deve essere rovesciato (backslash) \\t."
      },
      {
        titleTemplate: "Apici doppi",
        descTemplate: "Stampa la frase: L'albero.",
        starterCode: "",
        solutionCode: "print(\"L'albero\")",
        expectedOutput: "L'albero",
        hints: ["Usa doppi apici all'esterno se dentro c'è un apostrofo", "\"L'albero\""],
        explanation: "Alternare apici singoli e doppi evita di dover fare l'escape.",
        brokenCode: "print('L'albero')",
        debugHint: "L'apostrofo chiude la stringa. Usa doppi apici \"...\"."
      },
      {
        titleTemplate: "Concatenazione Plus",
        descTemplate: "Stampa 'Super' + 'Man' usando +.",
        starterCode: "",
        solutionCode: "print('Super' + 'Man')",
        expectedOutput: "SuperMan",
        hints: ["'Super' + 'Man'", "Senza spazi extra"],
        explanation: "+ unisce le stringhe esattamente come sono.",
        brokenCode: "print('Super' 'Man')",
        debugHint: "Funziona (string literal concatenation), ma usa + per chiarezza."
      },
      {
        titleTemplate: "Bool False",
        descTemplate: "Verifica che 0 è considerato False convertendolo con bool().",
        starterCode: "n = 0\n",
        solutionCode: "n = 0\nprint(bool(n))",
        expectedOutput: "False",
        hints: ["bool(0) è False", "Qualsiasi altro numero è True"],
        explanation: "0 è un valore 'falsy' in Python.",
        brokenCode: "print(Boolean(0))",
        debugHint: "La funzione è bool(), non Boolean."
      },
      {
        titleTemplate: "Print calcolo",
        descTemplate: "Stampa il risultato di 100 * 3 dentro print.",
        starterCode: "",
        solutionCode: "print(100 * 3)",
        expectedOutput: "300",
        hints: ["Fai l'operazione dentro le parentesi", "print(300)"],
        explanation: "Puoi passare espressioni a print().",
        brokenCode: "print('100 * 3')",
        debugHint: "Le virgolette stampano il testo, non il risultato."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Concatenazione stringhe",
        descTemplate: "Concatena 'Ciao, ' con 'mondo!' e stampa.",
        starterCode: "s1 = 'Ciao, '\ns2 = 'mondo!'\n",
        solutionCode: "s1 = 'Ciao, '\ns2 = 'mondo!'\nprint(s1 + s2)",
        expectedOutput: "Ciao, mondo!",
        hints: ["Usa + per concatenare stringhe", "s1 + s2 unisce le stringhe"],
        explanation: "L'operatore + unisce (concatena) le stringhe.",
        brokenCode: "s1 = 'Ciao, '\ns2 = 'mondo!'\nprint(s1, s2)",
        debugHint: "Con la virgola aggiungi uno spazio, con + no."
      },
      {
        titleTemplate: "f-string",
        descTemplate: "Usa una f-string per stampare 'Ho 25 anni' con la variabile età.",
        starterCode: "eta = 25\n",
        solutionCode: "eta = 25\nprint(f'Ho {eta} anni')",
        expectedOutput: "Ho 25 anni",
        hints: ["Le f-string iniziano con f prima delle virgolette", "Usa {variabile} dentro la stringa"],
        explanation: "Le f-string permettono di inserire variabili direttamente nelle stringhe.",
        brokenCode: "eta = 25\nprint('Ho {eta} anni')",
        debugHint: "Manca la f prima delle virgolette!"
      },
      {
        titleTemplate: "Print con separatore",
        descTemplate: "Stampa 'a', 'b', 'c' separati da trattini usando sep.",
        starterCode: "",
        solutionCode: "print('a', 'b', 'c', sep='-')",
        expectedOutput: "a-b-c",
        hints: ["print() accetta il parametro sep", "sep definisce il separatore tra elementi"],
        explanation: "Il parametro sep cambia il separatore (default è spazio).",
        brokenCode: "print('a', 'b', 'c', '-')",
        debugHint: "Devi usare sep='-' come argomento nominato."
      },
      {
        titleTemplate: "Calcolo con input simulato",
        descTemplate: "Data una stringa numerica, convertila e calcola il doppio.",
        starterCode: "numero_str = '15'\n",
        solutionCode: "numero_str = '15'\nprint(int(numero_str) * 2)",
        expectedOutput: "30",
        hints: ["Prima converti con int()", "Poi moltiplica per 2"],
        explanation: "Devi convertire la stringa prima di fare operazioni matematiche.",
        brokenCode: "numero_str = '15'\nprint(numero_str * 2)",
        debugHint: "Stai ripetendo la stringa, non moltiplicando il numero!"
      },
      {
        titleTemplate: "type()",
        descTemplate: "Stampa il tipo della variabile x = 3.14.",
        starterCode: "x = 3.14\n",
        solutionCode: "x = 3.14\nprint(type(x))",
        expectedOutput: "<class 'float'>",
        hints: ["Usa la funzione type()", "type() restituisce il tipo della variabile"],
        explanation: "type() mostra il tipo di dato di una variabile.",
        brokenCode: "x = 3.14\nprint(typeof(x))",
        debugHint: "In Python è type(), non typeof()."
      },
      {
        titleTemplate: "f-string calcolo",
        descTemplate: "Stampa 'Il doppio è 10' calcolando 5*2 nella f-string.",
        starterCode: "n = 5\n",
        solutionCode: "n = 5\nprint(f'Il doppio è {n*2}')",
        expectedOutput: "Il doppio è 10",
        hints: ["Dentro {} puoi mettere espressioni", "{n*2}"],
        explanation: "Le f-string valutano le espressioni tra parentesi graffe.",
        brokenCode: "n = 5\nprint('Il doppio è {n*2}')",
        debugHint: "Manca la f prima della stringa."
      },
      {
        titleTemplate: "f-string multi variabili",
        descTemplate: "Stampa 'Nome: Mario, Età: 30'.",
        starterCode: "nome = 'Mario'\neta = 30\n",
        solutionCode: "nome = 'Mario'\neta = 30\nprint(f'Nome: {nome}, Età: {eta}')",
        expectedOutput: "Nome: Mario, Età: 30",
        hints: ["f'Testo {var} Testo {var}'", "Attento alle maiuscole"],
        explanation: "Puoi inserire quante variabili vuoi in una f-string.",
        brokenCode: "nome = 'Mario'\neta = 30\nprint(f'Nome: nome, Età: eta')",
        debugHint: "Devi mettere le variabili tra graffe: {nome}."
      },
      {
        titleTemplate: "Metodo format",
        descTemplate: "Usa .format() per stampare 'Ciao Luca'.",
        starterCode: "nome = 'Luca'\n",
        solutionCode: "nome = 'Luca'\nprint('Ciao {}'.format(nome))",
        expectedOutput: "Ciao Luca",
        hints: ["La stringa ha {} come placeholder", "Chiama .format() sulla stringa"],
        explanation: ".format() è il metodo classico per formattare stringhe.",
        brokenCode: "nome = 'Luca'\nprint('Ciao {nome}'.format())",
        debugHint: "Se usi .format(), metti {} vuote nella stringa o usa {0}."
      },
      {
        titleTemplate: "Len stringa",
        descTemplate: "Stampa la lunghezza di 'Supercalifragilistichespiralidoso'.",
        starterCode: "parola = 'Supercalifragilistichespiralidoso'\n",
        solutionCode: "parola = 'Supercalifragilistichespiralidoso'\nprint(len(parola))",
        expectedOutput: "34",
        hints: ["Usa len()", "len(parola)"],
        explanation: "len() conta i caratteri di una stringa.",
        brokenCode: "parola = '...'\nprint(parola.size())",
        debugHint: "Le stringhe non hanno .size(), usa len()."
      },
      {
        titleTemplate: "Simula Input",
        descTemplate: "Assegna 'Rossi' a cognome e stampa 'Sig. Rossi'.",
        starterCode: "",
        solutionCode: "cognome = 'Rossi'\nprint(f'Sig. {cognome}')",
        expectedOutput: "Sig. Rossi",
        hints: ["Crea variabile cognome", "Usa f-string o +"],
        explanation: "In mancanza di input interattivo, usiamo variabili hardcoded.",
        brokenCode: "cognome = Rossi\nprint(cognome)",
        debugHint: "Rossi deve essere tra virgolette, è una stringa."
      },
      {
        titleTemplate: "Upper case",
        descTemplate: "Stampa 'urrà' tutto in maiuscolo.",
        starterCode: "s = 'urrà'\n",
        solutionCode: "s = 'urrà'\nprint(s.upper())",
        expectedOutput: "URRÀ",
        hints: ["Usa il metodo .upper()", "s.upper()"],
        explanation: ".upper() restituisce una copia della stringa in maiuscolo.",
        brokenCode: "s = 'urrà'\nprint(upper(s))",
        debugHint: "Non esiste funz upper(s), è un metodo: s.upper()."
      },
      {
        titleTemplate: "Lower case",
        descTemplate: "Converti 'STOP' in minuscolo.",
        starterCode: "cmd = 'STOP'\n",
        solutionCode: "cmd = 'STOP'\nprint(cmd.lower())",
        expectedOutput: "stop",
        hints: ["Usa .lower()", "cmd.lower()"],
        explanation: ".lower() converte in minuscolo.",
        brokenCode: "cmd = 'STOP'\nprint(cmd.lowercase())",
        debugHint: "Il metodo è .lower(), non .lowercase()."
      },
      {
        titleTemplate: "Replace",
        descTemplate: "Sostituisci 'triste' con 'felice' nella frase.",
        starterCode: "frase = 'Sono triste today'\n",
        solutionCode: "frase = 'Sono triste today'\nprint(frase.replace('triste', 'felice'))",
        expectedOutput: "Sono felice today",
        hints: [".replace(old, new)", "Crea una nuova stringa"],
        explanation: ".replace() sostituisce tutte le occorrenze della sottostringa.",
        brokenCode: "frase = '...'\nfrase.replace('triste', 'felice')\nprint(frase)",
        debugHint: "Le stringhe sono immutabili! Devi stampare il risultato o riassegnarlo."
      },
      {
        titleTemplate: "Strip spazi",
        descTemplate: "Rimuovi gli spazi iniziali e finali da '  Hello  '.",
        starterCode: "s = '  Hello  '\n",
        solutionCode: "s = '  Hello  '\nprint(s.strip())",
        expectedOutput: "Hello",
        hints: ["Usa .strip()", "Rimuove whitespace ai bordi"],
        explanation: ".strip() pulisce la stringa da spazi extra.",
        brokenCode: "s = '  Hello  '\nprint(s.trim())",
        debugHint: "In Python si chiama .strip(), non .trim()."
      },
      {
        titleTemplate: "Count lettere",
        descTemplate: "Conta quante 'a' ci sono in 'banana'.",
        starterCode: "s = 'banana'\n",
        solutionCode: "s = 'banana'\nprint(s.count('a'))",
        expectedOutput: "3",
        hints: ["Usa .count('a')", "Restituisce un intero"],
        explanation: ".count() conta le occorrenze di una sottostringa.",
        brokenCode: "s = 'banana'\nprint(count(s, 'a'))",
        debugHint: "È un metodo: s.count('a')."
      },
      {
        titleTemplate: "Moltiplicazione stringa",
        descTemplate: "Stampa 'Na' ripetuto 3 volte ('NaNaNa').",
        starterCode: "s = 'Na'\n",
        solutionCode: "s = 'Na'\nprint(s * 3)",
        expectedOutput: "NaNaNa",
        hints: ["Puoi moltiplicare stringa per intero", "'Na' * 3"],
        explanation: "La moltiplicazione ripete la stringa.",
        brokenCode: "s = 'Na'\nprint(s + 3)",
        debugHint: "Non puoi sommare stringa e numero, ma puoi moltiplicare."
      },
      {
        titleTemplate: "Capitalize",
        descTemplate: "Rendi maiuscola solo la prima lettera di 'italia'.",
        starterCode: "s = 'italia'\n",
        solutionCode: "s = 'italia'\nprint(s.capitalize())",
        expectedOutput: "Italia",
        hints: ["Usa .capitalize()", "Solo la prima lettera"],
        explanation: ".capitalize() alza la prima lettera e abbassa le altre.",
        brokenCode: "s = 'italia'\nprint(s.to_upper_case())",
        debugHint: "Usa s.capitalize()."
      },
      {
        titleTemplate: "Slice stringa",
        descTemplate: "Estrai 'Python' da 'Python è bello' (primi 6 char).",
        starterCode: "s = 'Python è bello'\n",
        solutionCode: "s = 'Python è bello'\nprint(s[:6])",
        expectedOutput: "Python",
        hints: ["Usa slicing [:6]", "Da indice 0 a 6 escluso"],
        explanation: "Slicing s[start:end] estrae una parte della stringa.",
        brokenCode: "s = 'Python è bello'\nprint(s[6])",
        debugHint: "s[6] è lo spazio, usa s[:6] per la sottostringa."
      },
      {
        titleTemplate: "Trova indice",
        descTemplate: "Trova l'indice della prima 'o' in 'mondo'.",
        starterCode: "s = 'mondo'\n",
        solutionCode: "s = 'mondo'\nprint(s.find('o'))",
        expectedOutput: "1",
        hints: ["Usa .find('o') o .index('o')", "Indici partono da 0"],
        explanation: ".find() restituisce l'indice della prima occorrenza.",
        brokenCode: "s = 'mondo'\nprint(s.search('o'))",
        debugHint: "Il metodo è .find() o .index()."
      },
      {
        titleTemplate: "End parameter",
        descTemplate: "Stampa 'A' poi 'B' separati da spazio usando end.",
        starterCode: "",
        solutionCode: "print('A', end=' ')\nprint('B')",
        expectedOutput: "A B",
        hints: ["end=' ' nel primo print", "Il secondo print va normale"],
        explanation: "end= definisce cosa stampare alla fine (default newline).",
        brokenCode: "print('A', ' ')\nprint('B')",
        debugHint: "Questo stampa 'A  ' poi 'B' a capo. Usa end=' '."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Print senza newline",
        descTemplate: "Stampa 'A' e 'B' sulla stessa riga senza spazi.",
        starterCode: "",
        solutionCode: "print('A', end='')\nprint('B')",
        expectedOutput: "AB",
        hints: ["Usa end='' per non andare a capo", "Il secondo print inizia dove finisce il primo"],
        explanation: "end='' rimuove il newline automatico di print().",
        brokenCode: "print('A')\nprint('B')",
        debugHint: "Devi usare end='' nel primo print."
      },
      {
        titleTemplate: "Formattazione decimali",
        descTemplate: "Stampa 3.14159 con solo 2 decimali.",
        starterCode: "pi = 3.14159\n",
        solutionCode: "pi = 3.14159\nprint(f'{pi:.2f}')",
        expectedOutput: "3.14",
        hints: ["Usa f-string con :.2f", ".2f significa 2 cifre decimali"],
        explanation: "Il formato .2f arrotonda a 2 decimali.",
        brokenCode: "pi = 3.14159\nprint(f'{pi:2}')",
        debugHint: ":2 formatta la larghezza, :.2f i decimali."
      },
      {
        titleTemplate: "Conversione booleana",
        descTemplate: "Stampa il valore booleano della stringa vuota ''.",
        starterCode: "",
        solutionCode: "print(bool(''))",
        expectedOutput: "False",
        hints: ["Usa bool() per convertire", "Le stringhe vuote sono False"],
        explanation: "In Python, stringhe vuote, 0, None e liste vuote sono 'falsy'.",
        brokenCode: "print(bool(' '))",
        debugHint: "Una stringa con spazio non è vuota, è True!"
      },
      {
        titleTemplate: "str() per concatenazione",
        descTemplate: "Concatena 'Valore: ' con il numero 42.",
        starterCode: "valore = 42\n",
        solutionCode: "valore = 42\nprint('Valore: ' + str(valore))",
        expectedOutput: "Valore: 42",
        hints: ["Converti il numero in stringa con str()", "Oppure usa f-string"],
        explanation: "Non puoi concatenare stringhe e numeri direttamente.",
        brokenCode: "valore = 42\nprint('Valore: ' + valore)",
        debugHint: "TypeError! Devi convertire il numero con str()."
      },
      {
        titleTemplate: "Print multiple values",
        descTemplate: "Stampa: 'x=5, y=10, somma=15' usando variabili.",
        starterCode: "x = 5\ny = 10\n# Stampa x=5, y=10, somma=15\n",
        solutionCode: "x = 5\ny = 10\nprint(f'x={x}, y={y}, somma={x+y}')",
        expectedOutput: "x=5, y=10, somma=15",
        hints: ["Usa f-string", "Puoi fare calcoli dentro {}"],
        explanation: "Nelle f-string puoi inserire espressioni, non solo variabili.",
        brokenCode: "x = 5\ny = 10\nprint('x=' + x + ', y=' + y)",
        debugHint: "Non puoi concatenare int con str senza conversione."
      },
      {
        titleTemplate: "ASCII Art",
        descTemplate: "Stampa un quadrato 2x2 di asterischi con una sola print multiline.",
        starterCode: "",
        solutionCode: "print(\"\"\"**\n**\"\"\")",
        expectedOutput: "**\n**",
        hints: ["Stringhe con tre virgolette \"\"\"", "Conserva i ritorni a capo"],
        explanation: "Le triple quotes permettono stringhe su più righe.",
        brokenCode: "print('**\n**')",
        debugHint: "Funziona, ma l'esercizio chiede stringa multiline \"\"\"."
      },
      {
        titleTemplate: "Hex Formatting",
        descTemplate: "Formatta 255 come 'ff' usando f-string.",
        starterCode: "n = 255\n",
        solutionCode: "n = 255\nprint(f'{n:x}')",
        expectedOutput: "ff",
        hints: ["{n:x} per esadecimale", "x minuscola"],
        explanation: "Nelle f-string, :x converte in hex.",
        brokenCode: "n = 255\nprint(f'{hex(n)}')",
        debugHint: "hex(n) include '0x', {n:x} no."
      },
      {
        titleTemplate: "Binary Formatting",
        descTemplate: "Formatta 5 come '101' usando f-string.",
        starterCode: "n = 5\n",
        solutionCode: "n = 5\nprint(f'{n:b}')",
        expectedOutput: "101",
        hints: ["{n:b} per binario", "Senza 0b"],
        explanation: ":b converte in binario puro.",
        brokenCode: "n = 5\nprint(bin(n))",
        debugHint: "bin(n) include '0b', {n:b} no."
      },
      {
        titleTemplate: "Padding Numerico",
        descTemplate: "Stampa 7 come '007' (3 cifre con zeri).",
        starterCode: "n = 7\n",
        solutionCode: "n = 7\nprint(f'{n:03d}')",
        expectedOutput: "007",
        hints: ["{n:03d} o {n:03}", "3 cifre totali"],
        explanation: ":03d aggiunge zeri iniziali fino a 3 cifre.",
        brokenCode: "n = 7\nprint(f'{n:3}')",
        debugHint: ":3 aggiunge spazi, :03 aggiunge zeri."
      },
      {
        titleTemplate: "Allineamento Destra",
        descTemplate: "Allinea 'Hi' a destra in 5 spazi.",
        starterCode: "s = 'Hi'\n",
        solutionCode: "s = 'Hi'\nprint(f'{s:>5}')",
        expectedOutput: "   Hi",
        hints: ["{s:>5}", "> spinge a destra"],
        explanation: "In f-string, > allinea a destra, < a sinistra.",
        brokenCode: "s = 'Hi'\nprint(f'{s:5}')",
        debugHint: "Default per stringhe è sinistra. Usa >."
      },
      {
        titleTemplate: "Chr da codice",
        descTemplate: "Stampa il carattere corrispondente al codice ASCII 65.",
        starterCode: "code = 65\n",
        solutionCode: "code = 65\nprint(chr(code))",
        expectedOutput: "A",
        hints: ["Usa chr()", "65 è 'A'"],
        explanation: "chr() converte un codice intero nel carattere Unicode/ASCII.",
        brokenCode: "code = 65\nprint(str(code))",
        debugHint: "str(65) è '65', chr(65) è 'A'."
      },
      {
        titleTemplate: "Ord da char",
        descTemplate: "Trova il codice ASCII di 'a'.",
        starterCode: "c = 'a'\n",
        solutionCode: "c = 'a'\nprint(ord(c))",
        expectedOutput: "97",
        hints: ["Usa ord()", "Inverso di chr()"],
        explanation: "ord() restituisce il codice Unicode del carattere.",
        brokenCode: "c = 'a'\nprint(int(c))",
        debugHint: "int('a') dà errore, usa ord('a')."
      },
      {
        titleTemplate: "Zfill",
        descTemplate: "Usa zfill per trasformare '42' in '00042'.",
        starterCode: "s = '42'\n",
        solutionCode: "s = '42'\nprint(s.zfill(5))",
        expectedOutput: "00042",
        hints: ["s.zfill(5)", "Aggiunge zeri a sinistra"],
        explanation: "zfill() è un metodo stringa specifico per padding con zeri.",
        brokenCode: "s = '42'\nprint(f'{s:05}')",
        debugHint: "Funziona, ma zfill è il metodo dedicato."
      },
      {
        titleTemplate: "Title Case",
        descTemplate: "Converti 'il signore degli anelli' in Title Case.",
        starterCode: "s = 'il signore degli anelli'\n",
        solutionCode: "s = 'il signore degli anelli'\nprint(s.title())",
        expectedOutput: "Il Signore Degli Anelli",
        hints: ["Maiuscola ogni parola", "Usa .title()"],
        explanation: ".title() alza la prima lettera e abbassa le altre.",
        brokenCode: "s = '...'\nprint(s.capitalize())",
        debugHint: "capitalize() agisce solo sulla prima parola della frase."
      },
      {
        titleTemplate: "Raw String",
        descTemplate: "Stampa '\\n' letteralmente usando raw string.",
        starterCode: " senza andare a capo\n",
        solutionCode: "print(r'\\n')",
        expectedOutput: "\\n",
        hints: ["Usa prefisso r prima delle virgolette", "r'\\n'"],
        explanation: "Le raw string (r'...') ignorano i caratteri di escape.",
        brokenCode: "print('\\n')",
        debugHint: "Questo stampa un ritorno a capo. Usa r'\\n' per vedere i caratteri."
      },
      {
        titleTemplate: "Encode UTF-8",
        descTemplate: "Converti '€' in bytes utf-8 e stampali.",
        starterCode: "s = '€'\n",
        solutionCode: "s = '€'\nprint(s.encode('utf-8'))",
        expectedOutput: "b'\\xe2\\x82\\xac'",
        hints: [".encode()", "Default è utf-8"],
        explanation: "encode() trasforma la stringa in sequenza di byte.",
        brokenCode: "s = '€'\nprint(bytes(s))",
        debugHint: "bytes() richiede encoding: bytes(s, 'utf-8') o s.encode()."
      },
      {
        titleTemplate: "Decode Bytes",
        descTemplate: "Converti b'abc' in stringa.",
        starterCode: "b = b'abc'\n",
        solutionCode: "b = b'abc'\nprint(b.decode())",
        expectedOutput: "abc",
        hints: [".decode()", "Da bytes a stringa"],
        explanation: "decode() trasforma i byte in stringa.",
        brokenCode: "b = b'abc'\nprint(str(b))",
        debugHint: "str(b) stampa \"b'abc'\", decode() stampa \"abc\"."
      },
      {
        titleTemplate: "Repr vs Str",
        descTemplate: "Stampa la rappresentazione repr() di una stringa con 'a capo'.",
        starterCode: "s = 'A\\nB'\n",
        solutionCode: "s = 'A\\nB'\nprint(repr(s))",
        expectedOutput: "'A\\nB'",
        hints: ["repr() mostra i caratteri speciali", "Utile per debug"],
        explanation: "repr() restituisce una stringa che rappresenta l'oggetto (con escape).",
        brokenCode: "s = 'A\\nB'\nprint(s)",
        debugHint: "print(s) interpreta il \\n, repr(s) no."
      },
      {
        titleTemplate: "IsDigit",
        descTemplate: "Stampa True se '123' contiene solo cifre.",
        starterCode: "s = '123'\n",
        solutionCode: "s = '123'\nprint(s.isdigit())",
        expectedOutput: "True",
        hints: [".isdigit()", "False se c'è altro"],
        explanation: "isdigit() controlla se tutti i caratteri sono numerici.",
        brokenCode: "s = '123a'\nprint(s.isnumeric())",
        debugHint: "Simile, ma qui s contiene 'a' quindi False."
      },
      {
        titleTemplate: "Join lista",
        descTemplate: "Unisci ['A', 'B', 'C'] con trattini.",
        starterCode: "lst = ['A', 'B', 'C']\n",
        solutionCode: "lst = ['A', 'B', 'C']\nprint('-'.join(lst))",
        expectedOutput: "A-B-C",
        hints: ["separatore.join(lista)", "'-'.join(...)"],
        explanation: "join è un metodo della STRINGA separatore, non della lista.",
        brokenCode: "lst = ['A', 'B', 'C']\nprint(lst.join('-'))",
        debugHint: "join si chiama sulla stringa: '-'.join(lst)."
      }
    ]
  },
  [PythonTopicId.Conditions]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "If semplice",
        descTemplate: "Se x è maggiore di 5, stampa 'Grande'.",
        starterCode: "x = 10\n",
        solutionCode: "x = 10\nif x > 5:\n    print('Grande')",
        expectedOutput: "Grande",
        hints: ["Usa if x > 5:", "Non dimenticare i due punti :"],
        explanation: "if valuta una condizione e esegue il blocco se True.",
        brokenCode: "x = 10\nif x > 5\n    print('Grande')",
        debugHint: "Mancano i due punti : dopo la condizione."
      },
      {
        titleTemplate: "If-else",
        descTemplate: "Se n è pari stampa 'Pari', altrimenti 'Dispari'.",
        starterCode: "n = 7\n",
        solutionCode: "n = 7\nif n % 2 == 0:\n    print('Pari')\nelse:\n    print('Dispari')",
        expectedOutput: "Dispari",
        hints: ["n % 2 == 0 verifica se pari", "Usa else per il caso contrario"],
        explanation: "else gestisce tutti i casi in cui if è False.",
        brokenCode: "n = 7\nif n % 2 = 0:\n    print('Pari')",
        debugHint: "Per confronto usa ==, non = (che è assegnazione)."
      },
      {
        titleTemplate: "Confronto uguaglianza",
        descTemplate: "Verifica se password == 'secret' e stampa 'Accesso'.",
        starterCode: "password = 'secret'\n",
        solutionCode: "password = 'secret'\nif password == 'secret':\n    print('Accesso')",
        expectedOutput: "Accesso",
        hints: ["Usa == per confrontare", "Le stringhe vanno tra virgolette"],
        explanation: "== confronta due valori per uguaglianza.",
        brokenCode: "password = 'secret'\nif password = 'secret':\n    print('Accesso')",
        debugHint: "= è assegnazione, == è confronto."
      },
      {
        titleTemplate: "Operatore not",
        descTemplate: "Se logged_in è False, stampa 'Effettua login'.",
        starterCode: "logged_in = False\n",
        solutionCode: "logged_in = False\nif not logged_in:\n    print('Effettua login')",
        expectedOutput: "Effettua login",
        hints: ["not inverte il valore booleano", "not False == True"],
        explanation: "not inverte True in False e viceversa.",
        brokenCode: "logged_in = False\nif !logged_in:\n    print('Effettua login')",
        debugHint: "In Python si usa not, non ! come in altri linguaggi."
      },
      {
        titleTemplate: "Confronto maggiore",
        descTemplate: "Se età >= 18, stampa 'Maggiorenne'.",
        starterCode: "eta = 21\n",
        solutionCode: "eta = 21\nif eta >= 18:\n    print('Maggiorenne')",
        expectedOutput: "Maggiorenne",
        hints: [">= significa maggiore o uguale", "18 anni è il limite"],
        explanation: ">= include anche il valore limite.",
        brokenCode: "eta = 21\nif eta > 18:\n    print('Maggiorenne')",
        debugHint: "Con > escludi chi ha esattamente 18 anni."
      },
      {
        titleTemplate: "If Simple",
        descTemplate: "Se x è maggiore di 0, stampa 'Positivo'.",
        starterCode: "x = 5\n",
        solutionCode: "x = 5\nif x > 0:\n    print('Positivo')",
        expectedOutput: "Positivo",
        hints: ["if x > 0:", "Ricorda i due punti e l'indentazione"],
        explanation: "L'istruzione if valuta una condizione booleana.",
        brokenCode: "x = 5\nif x > 0\n    print('Positivo')",
        debugHint: "Mancano i due punti alla fine della riga if."
      },
      {
        titleTemplate: "Check diversi",
        descTemplate: "Se colore non è 'rosso', stampa 'Non rosso'.",
        starterCode: "colore = 'blu'\n# If colore != 'rosso'\n",
        solutionCode: "colore = 'blu'\nif colore != 'rosso':\n    print('Non rosso')",
        expectedOutput: "Non rosso",
        hints: ["Usa != per diverso", "if colore != 'rosso':"],
        explanation: "!= restituisce True se i valori sono diversi.",
        brokenCode: "colore = 'blu'\nif colore <> 'rosso':\n    print('Non rosso')",
        debugHint: "<> è deprecato, usa !=."
      },
      {
        titleTemplate: "Empty List False",
        descTemplate: "Se la lista è vuota, stampa 'Vuota'.",
        starterCode: "lst = []\n",
        solutionCode: "lst = []\nif not lst:\n    print('Vuota')",
        expectedOutput: "Vuota",
        hints: ["Una lista vuota è False in contesto booleano", "Usa 'if not lst:'"],
        explanation: "Python valuta le collezioni vuote come False.",
        brokenCode: "lst = []\nif lst == empty:\n    print('Vuota')",
        debugHint: "empty non esiste, usa 'if not lst:' o 'if len(lst) == 0:'."
      },
      {
        titleTemplate: "Nome Admin",
        descTemplate: "Se name è 'admin', stampa 'Benvenuto'.",
        starterCode: "name = 'admin'\n",
        solutionCode: "name = 'admin'\nif name == 'admin':\n    print('Benvenuto')",
        expectedOutput: "Benvenuto",
        hints: ["Confronta stringhe con ==", "Attento alle virgolette"],
        explanation: "Confronto esatto tra stringhe.",
        brokenCode: "name = 'admin'\nif name == admin:\n    print('Benvenuto')",
        debugHint: "admin senza virgolette sarebbe una variabile, qui serve la stringa 'admin'."
      },
      {
        titleTemplate: "Negativo",
        descTemplate: "Se n è minore di 0, stampa 'Negativo'.",
        starterCode: "n = -5\n",
        solutionCode: "n = -5\nif n < 0:\n    print('Negativo')",
        expectedOutput: "Negativo",
        hints: ["< 0", "if n < 0:"],
        explanation: "Check basilare per numeri negativi.",
        brokenCode: "n = -5\nif n < 0 then\n    print('Negativo')",
        debugHint: "In Python non si usa 'then', bastano i due punti."
      },
      {
        titleTemplate: "In range",
        descTemplate: "Se n è tra 1 e 10 (esclusi), stampa 'Ok'.",
        starterCode: "n = 5\n",
        solutionCode: "n = 5\nif n > 1 and n < 10:\n    print('Ok')",
        expectedOutput: "Ok",
        hints: ["Usa and", "n > 1 and n < 10"],
        explanation: "AND richiede che entrambe le condizioni siano vere.",
        brokenCode: "n = 5\nif n > 1 or n < 10:\n    print('Ok')",
        debugHint: "Con OR basta una condizione, qui servono entrambe (AND)."
      },
      {
        titleTemplate: "Or Logic",
        descTemplate: "Se n è 0 o 100, stampa 'Estremo'.",
        starterCode: "n = 100\n# If n == 0 or n == 100\n",
        solutionCode: "n = 100\nif n == 0 or n == 100:\n    print('Estremo')",
        expectedOutput: "Estremo",
        hints: ["Usa or", "Controlla uguaglianza due volte"],
        explanation: "OR è vero se almeno una delle condizioni è vera.",
        brokenCode: "n = 100\nif n == 0 or 100:\n    print('Estremo')",
        debugHint: "Errato: 'or 100' è sempre True perché 100 è truthy. Scrivi 'n == 100'."
      },
      {
        titleTemplate: "In List",
        descTemplate: "Se 3 è nella lista [1, 2, 3], stampa 'Presente'.",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nif 3 in lst:\n    print('Presente')",
        expectedOutput: "Presente",
        hints: ["Usa operatore 'in'", "if 3 in lst:"],
        explanation: "L'operatore 'in' verifica l'appartenenza a una collezione.",
        brokenCode: "lst = [1, 2, 3]\nif lst.has(3):\n    print('Presente')",
        debugHint: "Le liste non hanno .has(), usa 'in'."
      },
      {
        titleTemplate: "String Length",
        descTemplate: "Se la lunghezza di s è > 3, stampa 'Lunga'.",
        starterCode: "s = 'Ciao'\n",
        solutionCode: "s = 'Ciao'\nif len(s) > 3:\n    print('Lunga')",
        expectedOutput: "Lunga",
        hints: ["len(s)", "if len(s) > 3:"],
        explanation: "Controlliamo la lunghezza della stringa.",
        brokenCode: "s = 'Ciao'\nif s.length > 3:\n    print('Lunga')",
        debugHint: "Per la lunghezza usa len(s), non .length."
      },
      {
        titleTemplate: "Pass statement",
        descTemplate: "Scrivi un if vuoto che non fa nulla (usa pass).",
        starterCode: "x = 5\nif x > 0:\nprint('Fine')",
        solutionCode: "x = 5\nif x > 0:\n    pass\nprint('Fine')",
        expectedOutput: "Fine",
        hints: ["pass è l'istruzione nulla", "Serve per riempire blocchi vuoti"],
        explanation: "pass permette di mantenere la sintassi valida senza eseguire codice.",
        brokenCode: "x = 5\nif x > 0:\nprint('Fine')",
        debugHint: "Errore di indentazione: if si aspetta un blocco indentato (o pass)."
      },
      {
        titleTemplate: "If True",
        descTemplate: "Se True, stampa 'Sempre'.",
        starterCode: "",
        solutionCode: "if True:\n    print('Sempre')",
        expectedOutput: "Sempre",
        hints: ["True va con la maiuscola", "Condizione sempre vera"],
        explanation: "Un blocco 'if True' viene sempre eseguito.",
        brokenCode: "if true:\n    print('Sempre')",
        debugHint: "true minuscolo non esiste in Python, usa True."
      },
      {
        titleTemplate: "If False Else",
        descTemplate: "Se False stampa 'Mai', else 'Sempre'.",
        starterCode: "",
        solutionCode: "if False:\n    print('Mai')\nelse:\n    print('Sempre')",
        expectedOutput: "Sempre",
        hints: ["False è sempre falso", "Quindi esegue else"],
        explanation: "Utile per disattivare temporaneamente codice.",
        brokenCode: "if False print('Mai')",
        debugHint: "Mancano i due punti :"
      },
      {
        titleTemplate: "Modulo Check",
        descTemplate: "Se 10 è divisibile per 5 (resto 0), stampa 'Divisibile'.",
        starterCode: "n = 10\n# if n % 5 == 0\n",
        solutionCode: "n = 10\nif n % 5 == 0:\n    print('Divisibile')",
        expectedOutput: "Divisibile",
        hints: ["% dà il resto", "== 0"],
        explanation: "Il controllo di divisibilità è una condizione comune.",
        brokenCode: "if n / 5 == 2:",
        debugHint: "/ è divisione reale, usa % per controllare il resto in modo standard."
      },
      {
        titleTemplate: "If not variable",
        descTemplate: "Se x non è 0 (booleano), stampa 'Vero' (x=5).",
        starterCode: "x = 5\n",
        solutionCode: "x = 5\nif x:\n    print('Vero')",
        expectedOutput: "Vero",
        hints: ["Un numero diverso da 0 è True", "if x:"],
        explanation: "Python converte implicitamente i numeri in booleani (0=False, altri=True).",
        brokenCode: "x = 5\nif x == True:",
        debugHint: "Non confrontare con True, 5 non è uguale a True, ma è 'truthy'."
      },
      {
        titleTemplate: "Else senza If",
        descTemplate: "Correggi il codice: else orfano.",
        starterCode: "x = 5\nelse:\n    print('Errore')",
        solutionCode: "x = 5\nif x > 10:\n    pass\nelse:\n    print('Errore')",
        expectedOutput: "Errore",
        hints: ["else richiede un if prima", "Aggiungi if"],
        explanation: "else cannot exist without if.",
        brokenCode: "else:\n    print('No')",
        debugHint: "SyntaxError: invalid syntax."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "If-elif-else",
        descTemplate: "Classifica un voto: <6 'Insufficiente', 6-7 'Sufficiente', >7 'Buono'.",
        starterCode: "voto = 7\n",
        solutionCode: "voto = 7\nif voto < 6:\n    print('Insufficiente')\nelif voto <= 7:\n    print('Sufficiente')\nelse:\n    print('Buono')",
        expectedOutput: "Sufficiente",
        hints: ["elif = else if", "L'ordine delle condizioni conta"],
        explanation: "elif permette di testare multiple condizioni in sequenza.",
        brokenCode: "voto = 7\nif voto < 6:\n    print('Insufficiente')\nelse if voto <= 7:\n    print('Sufficiente')",
        debugHint: "In Python è elif, non 'else if' separato."
      },
      {
        titleTemplate: "Operatore and",
        descTemplate: "Se età >= 18 AND patente == True, stampa 'Può guidare'.",
        starterCode: "eta = 20\npatente = True\n",
        solutionCode: "eta = 20\npatente = True\nif eta >= 18 and patente:\n    print('Può guidare')",
        expectedOutput: "Può guidare",
        hints: ["and richiede entrambe le condizioni True", "patente è già booleano"],
        explanation: "and restituisce True solo se entrambe le condizioni sono True.",
        brokenCode: "eta = 20\npatente = True\nif eta >= 18 && patente:\n    print('Può guidare')",
        debugHint: "In Python si usa and, non && come in C/Java."
      },
      {
        titleTemplate: "Operatore or",
        descTemplate: "Se giorno è 'Sabato' OR 'Domenica', stampa 'Weekend'.",
        starterCode: "giorno = 'Sabato'\n",
        solutionCode: "giorno = 'Sabato'\nif giorno == 'Sabato' or giorno == 'Domenica':\n    print('Weekend')",
        expectedOutput: "Weekend",
        hints: ["or richiede almeno una condizione True", "Devi confrontare due volte"],
        explanation: "or restituisce True se almeno una condizione è True.",
        brokenCode: "giorno = 'Sabato'\nif giorno == 'Sabato' or 'Domenica':\n    print('Weekend')",
        debugHint: "Devi scrivere giorno == per entrambi i confronti."
      },
      {
        titleTemplate: "Elif",
        descTemplate: "Se x < 0 'Neg', se x == 0 'Zero', altrimenti 'Pos'.",
        starterCode: "x = 0\n",
        solutionCode: "x = 0\nif x < 0:\n    print('Neg')\nelif x == 0:\n    print('Zero')\nelse:\n    print('Pos')",
        expectedOutput: "Zero",
        hints: ["Usa elif per la condizione intermedia", "elif x == 0:"],
        explanation: "elif permette di concatenare più condizioni esclusive.",
        brokenCode: "x = 0\nif x < 0:\n    print('Neg')\nelse if x == 0:\n    print('Zero')",
        debugHint: "In Python si scrive 'elif', non 'else if'."
      },
      {
        titleTemplate: "Ternario",
        descTemplate: "Assegna 'Pari' o 'Dispari' a res in una riga.",
        starterCode: "n = 10\n# res = 'Pari' if ... else ...\n",
        solutionCode: "n = 10\nres = 'Pari' if n % 2 == 0 else 'Dispari'\nprint(res)",
        expectedOutput: "Pari",
        hints: ["valore_se_vero if cond else valore_se_falso", "Operatore ternario"],
        explanation: "Espressione condizionale inline.",
        brokenCode: "n = 10\nres = n % 2 == 0 ? 'Pari' : 'Dispari'",
        debugHint: "Python non usa ? :, ma if else inline."
      },
      {
        titleTemplate: "If shorthand",
        descTemplate: "Usa if su una riga: stampa 'OK' se status == 200.",
        starterCode: "status = 200\n",
        solutionCode: "status = 200\nif status == 200: print('OK')",
        expectedOutput: "OK",
        hints: ["if condizione: azione", "Tutto su una riga"],
        explanation: "Per istruzioni semplici, if può stare su una riga.",
        brokenCode: "status = 200\nif status == 200 print('OK')",
        debugHint: "Servono i due punti : prima di print."
      },
      {
        titleTemplate: "Ternary operator",
        descTemplate: "Assegna 'pari' o 'dispari' a result con operatore ternario.",
        starterCode: "n = 4\n",
        solutionCode: "n = 4\nresult = 'pari' if n % 2 == 0 else 'dispari'\nprint(result)",
        expectedOutput: "pari",
        hints: ["valore_se_true if condizione else valore_se_false", "È un'espressione, non uno statement"],
        explanation: "L'operatore ternario permette if-else in una espressione.",
        brokenCode: "n = 4\nresult = n % 2 == 0 ? 'pari' : 'dispari'\nprint(result)",
        debugHint: "Python non usa ?: come C, usa if-else inline."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "If annidati",
        descTemplate: "Verifica: se x > 0, poi se x è pari, stampa 'Positivo pari'.",
        starterCode: "x = 8\n",
        solutionCode: "x = 8\nif x > 0:\n    if x % 2 == 0:\n        print('Positivo pari')",
        expectedOutput: "Positivo pari",
        hints: ["Il secondo if va indentato dentro il primo", "Due livelli di indentazione"],
        explanation: "Gli if annidati permettono verifiche gerarchiche.",
        brokenCode: "x = 8\nif x > 0:\nif x % 2 == 0:\n    print('Positivo pari')",
        debugHint: "Il secondo if deve essere indentato dentro il primo."
      },
      {
        titleTemplate: "Nested If",
        descTemplate: "Se x > 0 e, al suo interno, se x è pari stampa 'PosPari'.",
        starterCode: "x = 4\n",
        solutionCode: "x = 4\nif x > 0:\n    if x % 2 == 0:\n        print('PosPari')",
        expectedOutput: "PosPari",
        hints: ["Indenta il secondo if dentro il primo", "Due livelli di indentazione"],
        explanation: "Gli if possono essere annidati quanto serve.",
        brokenCode: "x = 4\nif x > 0:\nif x % 2 == 0:\n    print('PosPari')",
        debugHint: "Il secondo if deve essere indentato rispetto al primo."
      },
      {
        titleTemplate: "In Range Catena",
        descTemplate: "Verifica se x è tra 1 e 10 usando catena (1 < x < 10).",
        starterCode: "x = 5\n",
        solutionCode: "x = 5\nif 1 < x < 10:\n    print('Si')",
        expectedOutput: "Si",
        hints: ["Python permette 1 < x < 10", "Senza and esplicito"],
        explanation: "Python supporta confronti concatenati matematicamente.",
        brokenCode: "x = 5\nif 1 < x and < 10:\n    print('Si')",
        debugHint: "Sintassi errata. O usi '1 < x and x < 10' o '1 < x < 10'."
      },
      {
        titleTemplate: "Any",
        descTemplate: "Se almeno un valore in [0, False, 5] è vero, stampa 'Ok'.",
        starterCode: "lst = [0, False, 5]\n",
        solutionCode: "lst = [0, False, 5]\nif any(lst):\n    print('Ok')",
        expectedOutput: "Ok",
        hints: ["La funzione any() restituisce True se almeno un elemento è True", "5 è truthy"],
        explanation: "any() è un 'OR' su tutti gli elementi dell'iterabile.",
        brokenCode: "lst = [0, False, 5]\nif any(lst) == 5:\n    print('Ok')",
        debugHint: "any() restituisce True/False, non l'elemento."
      },
      {
        titleTemplate: "All",
        descTemplate: "Se tutti i valori in [1, 2, 3] sono veri, stampa 'Tutti'.",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nif all(lst):\n    print('Tutti')",
        expectedOutput: "Tutti",
        hints: ["La funzione all() richiede che TUTTI siano True", "all(lst)"],
        explanation: "all() è un 'AND' su tutti gli elementi.",
        brokenCode: "lst = [1, 0, 3]\nif all(lst):\n    print('Tutti')",
        debugHint: "Qui 0 è False, quindi all() restituirebbe False."
      },
      {
        titleTemplate: "Is None",
        descTemplate: "Controlla se x è None usando 'is'.",
        starterCode: "x = None\n",
        solutionCode: "x = None\nif x is None:\n    print('Nullo')",
        expectedOutput: "Nullo",
        hints: ["Per None usa sempre 'is', non ==", "if x is None:"],
        explanation: "None è un singoletto, il confronto di identità 'is' è best practice.",
        brokenCode: "x = None\nif x == None:\n    print('Nullo')",
        debugHint: "Funziona, ma la convenzione Pythonica (e PEP8) impone 'is None'."
      },
      {
        titleTemplate: "Is Type",
        descTemplate: "Se x è un intero, stampa 'Intero'.",
        starterCode: "x = 10\n",
        solutionCode: "x = 10\nif type(x) is int:\n    print('Intero')",
        expectedOutput: "Intero",
        hints: ["type(x) is int", "Meglio: isinstance(x, int)"],
        explanation: "Controlliamo il tipo della variabile.",
        brokenCode: "x = 10\nif type(x) == 'int':\n    print('Intero')",
        debugHint: "type(x) restituisce la classe int, non la stringa 'int'."
      },
      {
        titleTemplate: "Not In",
        descTemplate: "Se 'a' non è in 'banana', stampa 'Manca', altrimenti 'C'è'.",
        starterCode: "s = 'banana'\n",
        solutionCode: "s = 'banana'\nif 'z' not in s:\n    print('Manca')",
        expectedOutput: "Manca",
        hints: ["Usa 'not in'", "if 'z' not in s:"],
        explanation: "not in inverte il controllo di appartenenza.",
        brokenCode: "s = 'banana'\nif not 'z' in s:\n    print('Manca')",
        debugHint: "Funziona, ma 'z' not in s è più idiomatico."
      },
      {
        titleTemplate: "De Morgan",
        descTemplate: "Applica De Morgan: not (A and B).",
        starterCode: "A = True\nB = False\n",
        solutionCode: "A = True\nB = False\nprint(not (A and B))",
        expectedOutput: "True",
        hints: ["not (A and B) equivale a (not A) or (not B)", "Qui stampa True"],
        explanation: "Legge di De Morgan sulla negazione dell'AND.",
        brokenCode: "A = True\nB = False\nprint(not A and B)",
        debugHint: "Senza parentesi il not si applica solo ad A. Risultato diverso."
      },
      {
        titleTemplate: "Match Case (Simulato)",
        descTemplate: "Simula switch case con if/elif su 'stato'.",
        starterCode: "stato = 'start'\n",
        solutionCode: "stato = 'start'\nif stato == 'start':\n    print('go')\nelif stato == 'stop':\n    print('halt')",
        expectedOutput: "go",
        hints: ["Serie di if/elif", "Controlla il valore"],
        explanation: "Prima di Python 3.10 si usavano if/elif a cascata.",
        brokenCode: "stato = 'start'\ncase 'start':\n    print('go')",
        debugHint: "La sintassi case richiede un blocco match prima (Python 3.10+) o if/elif."
      },
      {
        titleTemplate: "Truthiness",
        descTemplate: "Verifica se 'False' (stringa) è vero.",
        starterCode: "s = 'False'\n",
        solutionCode: "s = 'False'\nif s:\n    print('Vero')",
        expectedOutput: "Vero",
        hints: ["Una stringa non vuota è sempre True", "Anche se contiene 'False'"],
        explanation: "Solo stringhe vuote '' sono False.",
        brokenCode: "s = 'False'\nif s == True:\n    print('Vero')",
        debugHint: "Non confrontare con True. Usa 'if s:'. s non è uguale al booleano True."
      },
      {
        titleTemplate: "Identity vs Equality",
        descTemplate: "Confronta due liste uguali: == True, is False.",
        starterCode: "a = [1]\nb = [1]\n# Stampa (a==b) e (a is b)\n",
        solutionCode: "a = [1]\nb = [1]\nprint(a == b)\nprint(a is b)",
        expectedOutput: "True\nFalse",
        hints: ["== controlla il valore", "is controlla l'oggetto in memoria"],
        explanation: "Due liste distinte con stesso contenuto sono uguali ma non identiche.",
        brokenCode: "a = [1]\nprint(a is [1])",
        debugHint: "Stai creando una nuova lista al volo, non sarà mai 'is' a."
      },
      {
        titleTemplate: "Short Circuit",
        descTemplate: "Sfrutta short circuit: 1 or print('No').",
        starterCode: "",
        solutionCode: "print(1 or print('No'))",
        expectedOutput: "1",
        hints: ["OR si ferma al primo True", "1 è True, quindi non valuta il resto"],
        explanation: "Se il primo operando di OR è vero, il secondo non viene eseguito.",
        brokenCode: "print(0 or print('No'))",
        debugHint: "Se primo è False, esegue il secondo (che stampa No e ritorna None)."
      },
      {
        titleTemplate: "Walrus intro",
        descTemplate: "Usa walrus := per assegnare e controllare in if.",
        starterCode: "# if (n := 5) > 3:\n",
        solutionCode: "if (n := 5) > 3:\n    print(n)",
        expectedOutput: "5",
        hints: [":= assegna e ritorna il valore", "Richiede parentesi a volte"],
        explanation: "Assignment expression (operator walrus) introdotto in Py3.8.",
        brokenCode: "if n = 5 > 3:\n    print(n)",
        debugHint: "Non puoi usare = normale dentro if. Usa :=."
      },
      {
        titleTemplate: "Validazione multipla",
        descTemplate: "Password valida se: len >= 8 AND contiene almeno un numero.",
        starterCode: "pwd = 'secret123'\nhas_num = any(c.isdigit() for c in pwd)\n",
        solutionCode: "pwd = 'secret123'\nhas_num = any(c.isdigit() for c in pwd)\nif len(pwd) >= 8 and has_num:\n    print('Valida')",
        expectedOutput: "Valida",
        hints: ["len() restituisce la lunghezza", "has_num è già calcolato"],
        explanation: "Combina multiple condizioni con and per validazioni complesse.",
        brokenCode: "pwd = 'secret123'\nif pwd.length >= 8:\n    print('Valida')",
        debugHint: "In Python è len(pwd), non pwd.length."
      },
      {
        titleTemplate: "Chained comparison",
        descTemplate: "Verifica se x è tra 1 e 10 (inclusi) con confronto concatenato.",
        starterCode: "x = 5\n# Verifica 1 <= x <= 10\n",
        solutionCode: "x = 5\nif 1 <= x <= 10:\n    print('Nel range')",
        expectedOutput: "Nel range",
        hints: ["Python permette 1 <= x <= 10", "È più leggibile di x >= 1 and x <= 10"],
        explanation: "Python supporta confronti concatenati come in matematica.",
        brokenCode: "x = 5\nif 1 <= x and x <= 10:\n    print('Nel range')",
        debugHint: "Funziona, ma Python permette la forma più elegante 1 <= x <= 10."
      },
      {
        titleTemplate: "In con liste",
        descTemplate: "Verifica se frutto è in una lista di frutti consentiti.",
        starterCode: "frutto = 'mela'\nconsentiti = ['mela', 'pera', 'banana']\n",
        solutionCode: "frutto = 'mela'\nconsentiti = ['mela', 'pera', 'banana']\nif frutto in consentiti:\n    print('Consentito')",
        expectedOutput: "Consentito",
        hints: ["in verifica appartenenza", "Funziona con liste, tuple, stringhe"],
        explanation: "L'operatore in verifica se un elemento è presente in una sequenza.",
        brokenCode: "frutto = 'mela'\nconsentiti = ['mela', 'pera', 'banana']\nif consentiti.contains(frutto):\n    print('Consentito')",
        debugHint: "Python usa 'in', non .contains() come Java."
      },
      {
        titleTemplate: "Falsy values",
        descTemplate: "Stampa 'Vuoto' solo se la lista è vuota.",
        starterCode: "lista = []\n",
        solutionCode: "lista = []\nif not lista:\n    print('Vuoto')",
        expectedOutput: "Vuoto",
        hints: ["Le liste vuote sono 'falsy'", "not [] == True"],
        explanation: "In Python, contenitori vuoti sono considerati False.",
        brokenCode: "lista = []\nif lista == None:\n    print('Vuoto')",
        debugHint: "[] non è None, ma è falsy. Usa 'not lista' o 'len(lista) == 0'."
      }
    ]
  },

  // ==================== LOOPS ====================
  [PythonTopicId.Loops]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "For range base",
        descTemplate: "Stampa i numeri da 0 a 4 usando for e range().",
        starterCode: "",
        solutionCode: "for i in range(5):\n    print(i)",
        expectedOutput: "0\n1\n2\n3\n4",
        hints: ["range(5) genera 0,1,2,3,4", "for i in range(n) itera n volte"],
        explanation: "range(n) genera numeri da 0 a n-1.",
        brokenCode: "for i in range(5)\n    print(i)",
        debugHint: "Mancano i due punti : dopo range(5)."
      },
      {
        titleTemplate: "For su lista",
        descTemplate: "Stampa ogni elemento della lista frutti.",
        starterCode: "frutti = ['mela', 'pera', 'banana']\n",
        solutionCode: "frutti = ['mela', 'pera', 'banana']\nfor f in frutti:\n    print(f)",
        expectedOutput: "mela\npera\nbanana",
        hints: ["for elemento in lista:", "Ogni iterazione assegna un elemento a f"],
        explanation: "for itera direttamente sugli elementi di una lista.",
        brokenCode: "frutti = ['mela', 'pera', 'banana']\nfor f in frutti\n    print(f)",
        debugHint: "Servono i due punti : alla fine della riga for."
      },
      {
        titleTemplate: "While semplice",
        descTemplate: "Stampa i numeri da 1 a 3 usando while.",
        starterCode: "",
        solutionCode: "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1",
        expectedOutput: "1\n2\n3",
        hints: ["Inizializza i prima del ciclo", "Incrementa i dentro il ciclo"],
        explanation: "while continua finché la condizione è True.",
        brokenCode: "i = 1\nwhile i <= 3:\n    print(i)",
        debugHint: "Manca i += 1, il ciclo è infinito!"
      },
      {
        titleTemplate: "Range con start",
        descTemplate: "Stampa i numeri da 5 a 9 usando range con due argomenti.",
        starterCode: "",
        solutionCode: "for i in range(5, 10):\n    print(i)",
        expectedOutput: "5\n6\n7\n8\n9",
        hints: ["range(start, stop)", "stop è escluso"],
        explanation: "range(a, b) genera numeri da a a b-1.",
        brokenCode: "for i in range(5, 9):\n    print(i)",
        debugHint: "range(5,9) arriva solo a 8, usa range(5,10)."
      },
      {
        titleTemplate: "Somma con for",
        descTemplate: "Calcola la somma dei numeri da 1 a 5.",
        starterCode: "",
        solutionCode: "somma = 0\nfor i in range(1, 6):\n    somma += i\nprint(somma)",
        expectedOutput: "15",
        hints: ["Inizializza somma a 0", "Aggiungi ogni i a somma"],
        explanation: "Accumula valori iterando con for.",
        brokenCode: "for i in range(1, 6):\n    somma += i\nprint(somma)",
        debugHint: "somma non è definita prima del ciclo."
      },
      {
        titleTemplate: "Range simple",
        descTemplate: "tampa i numeri da 0 a 4 usando range(5).",
        starterCode: "",
        solutionCode: "for i in range(5):\n    print(i)",
        expectedOutput: "0\n1\n2\n3\n4",
        hints: ["range(5) genera 0,1,2,3,4", "Ricorda i due punti :"],
        explanation: "range(n) genera n numeri partendo da 0.",
        brokenCode: "for i in range(5)\n    print(i)",
        debugHint: "Mancano i due punti dopo range(5)."
      },
      {
        titleTemplate: "Range start stop",
        descTemplate: "Stampa numeri da 1 a 5 (inclusi).",
        starterCode: "",
        solutionCode: "for i in range(1, 6):\n    print(i)",
        expectedOutput: "1\n2\n3\n4\n5",
        hints: ["range(start, stop)", "stop è escluso, quindi usa 6"],
        explanation: "range(a, b) va da a fino a b-1.",
        brokenCode: "for i in range(1, 5):\n    print(i)",
        debugHint: "Questo stampa solo fino a 4. Usa 6 per includere il 5."
      },
      {
        titleTemplate: "String Loop",
        descTemplate: "Stampa ogni lettera di 'Ciao'.",
        starterCode: "s = 'Ciao'\n",
        solutionCode: "s = 'Ciao'\nfor char in s:\n    print(char)",
        expectedOutput: "C\ni\na\no",
        hints: ["Le stringhe sono iterabili", "for c in s:"],
        explanation: "Il ciclo for scorre i caratteri della stringa uno alla volta.",
        brokenCode: "s = 'Ciao'\nfor char in range(s):\n    print(char)",
        debugHint: "range() vuole numeri, non stringhe. Usa direttamente 'in s'."
      },
      {
        titleTemplate: "Range Step",
        descTemplate: "Stampa i numeri pari da 0 a 8 usando range con step.",
        starterCode: "",
        solutionCode: "for i in range(0, 10, 2):\n    print(i)",
        expectedOutput: "0\n2\n4\n6\n8",
        hints: ["range(start, stop, step)", "step=2"],
        explanation: "Il terzo argomento di range è il passo di incremento.",
        brokenCode: "for i in range(0, 9, 2):\n    print(i)",
        debugHint: "Il range deve arrivare almeno a 9 per includere l'8. range(0, 9, 2) va bene, anche (0, 10, 2)."
      },
      {
        titleTemplate: "Sum accumulator",
        descTemplate: "Calcola la somma dei numeri in [10, 20, 30].",
        starterCode: "lst = [10, 20, 30]\ntotale = 0\n# for x in lst: totale += x\nprint(totale)",
        solutionCode: "lst = [10, 20, 30]\ntotale = 0\nfor x in lst:\n    totale += x\nprint(totale)",
        expectedOutput: "60",
        hints: ["Inizializza totale a 0", "Aggiungi x a totale nel loop"],
        explanation: "Pattern accumulatore classico.",
        brokenCode: "lst = [10, 20, 30]\nfor x in lst:\n    totale += x\nprint(totale)",
        debugHint: "Hai dimenticato di inizializzare 'totale = 0' prima del ciclo."
      },
      {
        titleTemplate: "While < 5",
        descTemplate: "Stampa i numeri finché x è minore di 3 (x parte da 0).",
        starterCode: "x = 0\n",
        solutionCode: "x = 0\nwhile x < 3:\n    print(x)\n    x += 1",
        expectedOutput: "0\n1\n2",
        hints: ["Metti la condizione nel while", "Incrementa x dentro il loop"],
        explanation: "Il ciclo while continua finché la condizione è vera.",
        brokenCode: "x = 0\nwhile x < 3:\n    print(x)",
        debugHint: "Ciclo infinito! Devi incrementare x (x += 1)."
      },
      {
        titleTemplate: "Count elements",
        descTemplate: "Conta quanti numeri nella lista [1, 5, 2, 8] sono > 3.",
        starterCode: "lst = [1, 5, 2, 8]\ncount = 0\nprint(count)",
        solutionCode: "lst = [1, 5, 2, 8]\ncount = 0\nfor x in lst:\n    if x > 3:\n        count += 1\nprint(count)",
        expectedOutput: "2",
        hints: ["Incrementa count solo se x > 3", "if x > 3: count += 1"],
        explanation: "Contatore condizionale.",
        brokenCode: "lst = [1, 5, 2, 8]\ncount = 0\nfor x in lst:\n    count += 1\nprint(count)",
        debugHint: "Questo conta tutti gli elementi, non solo i > 3."
      },
      {
        titleTemplate: "Break Simple",
        descTemplate: "Stampa numeri da 0 a 5, ma fermati (break) se i diventa 3.",
        starterCode: "for i in range(6):\n    # if i == 3: break\n    print(i)",
        solutionCode: "for i in range(6):\n    if i == 3:\n        break\n    print(i)",
        expectedOutput: "0\n1\n2",
        hints: ["break esce dal loop", "Metti l break prima del print"],
        explanation: "break interrompe immediatamente il ciclo.",
        brokenCode: "for i in range(6):\n    print(i)\n    if i == 3: break",
        debugHint: "Se stampi prima del break, vedrai anche il 3."
      },
      {
        titleTemplate: "Continue Simple",
        descTemplate: "Stampa numeri da 0 a 3 saltando il 2 con continue.",
        starterCode: "for i in range(4):\n    # if i == 2: continue\n    print(i)",
        solutionCode: "for i in range(4):\n    if i == 2:\n        continue\n    print(i)",
        expectedOutput: "0\n1\n3",
        hints: ["continue salta il resto del corpo", "Passa alla prossima iterazione"],
        explanation: "continue salta direttamente al prossimo ciclo.",
        brokenCode: "for i in range(4):\n    print(i)\n    if i == 2: continue",
        debugHint: "Il continue alla fine del loop non serve a niente."
      },
      {
        titleTemplate: "Moltiplicazione Loop",
        descTemplate: "Moltiplica tutti i numeri in [2, 3, 4] (2*3*4).",
        starterCode: "lst = [2, 3, 4]\nprod = 1\nprint(prod)",
        solutionCode: "lst = [2, 3, 4]\nprod = 1\nfor x in lst:\n    prod *= x\nprint(prod)",
        expectedOutput: "24",
        hints: ["Parti da prod = 1 (elemento neutro)", "prod *= x"],
        explanation: "Per la produttoria si inizializza a 1.",
        brokenCode: "lst = [2, 3, 4]\nprod = 0\nfor x in lst:\n    prod *= x\nprint(prod)",
        debugHint: "Se part da 0, il prodotto sarà sempre 0."
      },
      {
        titleTemplate: "Loop Dict Keys",
        descTemplate: "Stampa le chiavi del dizionario {'a': 1, 'b': 2}.",
        starterCode: "d = {'a': 1, 'b': 2}\n",
        solutionCode: "d = {'a': 1, 'b': 2}\nfor k in d:\n    print(k)",
        expectedOutput: "a\nb",
        hints: ["Iterare un dict restituisce le chiavi", "for k in d:"],
        explanation: "Il ciclo for sui dizionari percorre le chiavi.",
        brokenCode: "d = {'a': 1, 'b': 2}\nfor k in d.values():\n    print(k)",
        debugHint: "Quello itera sui valori (1, 2), l'esercizio chiede le chiavi."
      },
      {
        titleTemplate: "Repeat action",
        descTemplate: "Stampa 'Ciao' 3 volte usando underscore _.",
        starterCode: "",
        solutionCode: "for _ in range(3):\n    print('Ciao')",
        expectedOutput: "Ciao\nCiao\nCiao",
        hints: ["_ è convenzione per variabile non usata", "range(3)"],
        explanation: "Usiamo _ quando l'indice del ciclo non serve.",
        brokenCode: "for i in 3:\n    print('Ciao')",
        debugHint: "L'oggetto 'int' non è iterabile. Usa range(3)."
      },
      {
        titleTemplate: "List from Range",
        descTemplate: "Crea una lista [0, 1, 2] usando list(range(...)).",
        starterCode: "",
        solutionCode: "print(list(range(3)))",
        expectedOutput: "[0, 1, 2]",
        hints: ["list() converte il range in lista reale", "range(3)"],
        explanation: "range è 'lazy', list() lo espande in memoria.",
        brokenCode: "print(range(3))",
        debugHint: "Stampa solo 'range(0, 3)' perché è un oggetto lazy."
      },
      {
        titleTemplate: "Countdown",
        descTemplate: "Stampa 3 2 1 usando range inverso.",
        starterCode: "",
        solutionCode: "for i in range(3, 0, -1):\n    print(i)",
        expectedOutput: "3\n2\n1",
        hints: ["Step negativo -1", "Start > Stop"],
        explanation: "range(Start, Stop, -1) conta all'indietro.",
        brokenCode: "for i in range(3, 0):\n    print(i)",
        debugHint: "Senza step -1, range(3, 0) è vuoto."
      },
      {
        titleTemplate: "While True Intro",
        descTemplate: "Usa while True con break per stampare solo 'A' una volta.",
        starterCode: "while True:\n    print('A')\n",
        solutionCode: "while True:\n    print('A')\n    break",
        expectedOutput: "A",
        hints: ["break ferma il ciclo infinito", "Mettilo dopo il print"],
        explanation: "Pattern comune: ciclo infinito controllato da break interno.",
        brokenCode: "while True:\n    print('A')",
        debugHint: "Loop infinito! Manca il break."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Break",
        descTemplate: "Cerca il numero 3 nella lista e fermati quando lo trovi.",
        starterCode: "numeri = [1, 5, 3, 7, 3, 9]\n",
        solutionCode: "numeri = [1, 5, 3, 7, 3, 9]\nfor n in numeri:\n    if n == 3:\n        print('Trovato!')\n        break",
        expectedOutput: "Trovato!",
        hints: ["break esce dal ciclo immediatamente", "Usa if per controllare"],
        explanation: "break interrompe il ciclo quando la condizione è soddisfatta.",
        brokenCode: "numeri = [1, 5, 3, 7, 3, 9]\nfor n in numeri:\n    if n == 3:\n        print('Trovato!')\n        stop",
        debugHint: "La keyword è break, non stop."
      },
      {
        titleTemplate: "Continue",
        descTemplate: "Stampa solo i numeri pari da 1 a 10 usando continue.",
        starterCode: "",
        solutionCode: "for i in range(1, 11):\n    if i % 2 != 0:\n        continue\n    print(i)",
        expectedOutput: "2\n4\n6\n8\n10",
        hints: ["continue salta all'iterazione successiva", "Salta i dispari"],
        explanation: "continue salta il resto del corpo del ciclo per questa iterazione.",
        brokenCode: "for i in range(1, 11):\n    if i % 2 != 0:\n        pass\n    print(i)",
        debugHint: "pass non fa nulla, continue salta all'iterazione successiva."
      },
      {
        titleTemplate: "Range con step",
        descTemplate: "Stampa i numeri pari da 2 a 10 usando range con step.",
        starterCode: "",
        solutionCode: "for i in range(2, 11, 2):\n    print(i)",
        expectedOutput: "2\n4\n6\n8\n10",
        hints: ["range(start, stop, step)", "step=2 salta di 2 in 2"],
        explanation: "Il terzo argomento di range è il passo (step).",
        brokenCode: "for i in range(2, 10, 2):\n    print(i)",
        debugHint: "range(2,10,2) arriva solo a 8, usa 11."
      },
      {
        titleTemplate: "Enumerate",
        descTemplate: "Stampa indice e valore di ogni elemento nella lista.",
        starterCode: "colori = ['rosso', 'verde', 'blu']\n",
        solutionCode: "colori = ['rosso', 'verde', 'blu']\nfor i, c in enumerate(colori):\n    print(f'{i}: {c}')",
        expectedOutput: "0: rosso\n1: verde\n2: blu",
        hints: ["enumerate restituisce (indice, valore)", "Usa unpacking: for i, c in ..."],
        explanation: "enumerate aggiunge un contatore automatico all'iterazione.",
        brokenCode: "colori = ['rosso', 'verde', 'blu']\nfor i, c in colori:\n    print(f'{i}: {c}')",
        debugHint: "Per avere l'indice devi usare enumerate()."
      },
      {
        titleTemplate: "While con condizione",
        descTemplate: "Continua a dimezzare n finché è > 1.",
        starterCode: "n = 16\n",
        solutionCode: "n = 16\nwhile n > 1:\n    print(n)\n    n = n // 2\nprint(n)",
        expectedOutput: "16\n8\n4\n2\n1",
        hints: ["// è divisione intera", "Stampa prima di dimezzare"],
        explanation: "while con condizione variabile controlla il flusso dinamicamente.",
        brokenCode: "n = 16\nwhile n > 1:\n    n = n // 2\n    print(n)",
        debugHint: "L'ordine conta: stampa prima, poi dimezza. Altrimenti perdi il 16."
      },
      {
        titleTemplate: "Tavola Pitagorica",
        descTemplate: "Stampa le coppie i,j per i in 0-1 e j in 0-1 (nested).",
        starterCode: "",
        solutionCode: "for i in range(2):\n    for j in range(2):\n        print(f'{i},{j}')",
        expectedOutput: "0,0\n0,1\n1,0\n1,1",
        hints: ["Due cicli indentati", "f-string"],
        explanation: "Cicli annidati generano il prodotto cartesiano.",
        brokenCode: "for i in range(2):\nfor j in range(2):\n    print(i, j)",
        debugHint: "Il secondo for deve essere dentro il primo (indentato)."
      },
      {
        titleTemplate: "While List Pop",
        descTemplate: "Svuota la lista [1, 2] stampando e rimuovendo (pop) elementi.",
        starterCode: "lst = [1, 2]\nwhile lst:\n",
        solutionCode: "lst = [1, 2]\nwhile lst:\n    print(lst.pop(0))",
        expectedOutput: "1\n2",
        hints: ["'while lst:' è True se lista non vuota", "pop(0) rimuove dall'inizio"],
        explanation: "Pattern 'svuota lista' con while.",
        brokenCode: "lst = [1, 2]\nwhile lst:\n    print(lst[0])",
        debugHint: "Non stai rimuovendo elementi, ciclo infinito!"
      },
      {
        titleTemplate: "For Else",
        descTemplate: "Cerca 5 in [1, 2, 3]. Se non trovi, stampa 'Assente' (usa for-else).",
        starterCode: "lst = [1, 2, 3]\nfor x in lst:\n    if x == 5: break\n",
        solutionCode: "lst = [1, 2, 3]\nfor x in lst:\n    if x == 5:\n        break\nelse:\n    print('Assente')",
        expectedOutput: "Assente",
        hints: ["else allineato con for", "Esegue se loop finisce normalmente (no break)"],
        explanation: "Il blocco else del for viene eseguito se non si incontra un break.",
        brokenCode: "lst = [1, 2, 3]\nfor x in lst:\n    if x == 5: break\n    else: print('Assente')",
        debugHint: "Questo else è dell'if, non del for. Indenta indietro l'else."
      },
      {
        titleTemplate: "List Comp Filter",
        descTemplate: "Crea lista di solo numeri pari da range(5).",
        starterCode: "",
        solutionCode: "print([x for x in range(5) if x % 2 == 0])",
        expectedOutput: "[0, 2, 4]",
        hints: ["Comprehension con if finale", "x % 2 == 0"],
        explanation: "Filtrare in una list comprehension è rapido e leggibile.",
        brokenCode: "print([x for x in range(5) while x % 2 == 0])",
        debugHint: "List comp usa 'if', non 'while'."
      },
      {
        titleTemplate: "Enumerate",
        descTemplate: "Stampa indice e valore di ['a', 'b']: '0: a', '1: b'.",
        starterCode: "lst = ['a', 'b']\n",
        solutionCode: "lst = ['a', 'b']\nfor i, v in enumerate(lst):\n    print(f'{i}: {v}')",
        expectedOutput: "0: a\n1: b",
        hints: ["enumerate() restituisce coppie (indice, valore)", "for i, v in ..."],
        explanation: "enumerate è il modo Pythonico per avere l'indice nel loop.",
        brokenCode: "lst = ['a', 'b']\nfor v in lst:\n    print(lst.index(v), v)",
        debugHint: ".index() è lento e non gestisce duplicati correttamente. Usa enumerate."
      },
      {
        titleTemplate: "Zip Loop",
        descTemplate: "Itera su due liste [1,2] e ['a','b'] parallelamente.",
        starterCode: "l1 = [1, 2]\nl2 = ['a', 'b']\n",
        solutionCode: "l1 = [1, 2]\nl2 = ['a', 'b']\nfor n, l in zip(l1, l2):\n    print(n, l)",
        expectedOutput: "1 a\n2 b",
        hints: ["zip(list1, list2) crea coppie", "Unisce elemento per elemento"],
        explanation: "zip() permette di scorrere più iterabili in parallelo.",
        brokenCode: "for n in l1 and l in l2:\n    print(n, l)",
        debugHint: "Sintassi inventata. Usa zip(l1, l2)."
      },
      {
        titleTemplate: "Reverse Loop",
        descTemplate: "Itera su [1, 2, 3] al contrario con reversed().",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nfor x in reversed(lst):\n    print(x)",
        expectedOutput: "3\n2\n1",
        hints: ["reversed(lst)", "Non modifica la lista originale"],
        explanation: "reversed() restituisce un iteratore inverso.",
        brokenCode: "lst = [1, 2, 3]\nfor x in lst.reverse():\n    print(x)",
        debugHint: "lst.reverse() modifica in place e ritorna None. Usa reversed(lst)."
      },
      {
        titleTemplate: "Fibonacci Loop",
        descTemplate: "Calcola il 5° numero di Fibonacci (sequenza 1, 1, 2, 3, 5).",
        starterCode: "a, b = 1, 1\nprint(b)",
        solutionCode: "a, b = 1, 1\nfor _ in range(3):\n    a, b = b, a + b\nprint(b)",
        expectedOutput: "5",
        hints: ["In ogni step: a diventa b, b diventa a+b", "Scambio multiplo"],
        explanation: "Algoritmo iterativo classico per Fibonacci.",
        brokenCode: "a, b = 1, 1\nfor _ in range(3):\n    a = b\n    b = a + b\nprint(b)",
        debugHint: "Stai aggiornando 'a' prima di usarlo per 'b'. Usa a, b = b, a + b."
      },
      {
        titleTemplate: "Prime Check",
        descTemplate: "Verifica se n=7 è primo (nessun divisore tra 2 e 6).",
        starterCode: "n = 7\n# for i in range(2, n): if n % i == 0: break\n",
        solutionCode: "n = 7\nfor i in range(2, n):\n    if n % i == 0:\n        break\nelse:\n    print('Primo')",
        expectedOutput: "Primo",
        hints: ["Se trovi divisore, break", "else del for se nessuno trovato"],
        explanation: "Pattern for-else perfetto per ricerche di controesempi (divisori).",
        brokenCode: "n = 7\nfor i in range(2, n):\n    if n % i == 0:\n        print('Non primo')\nprint('Primo')",
        debugHint: "Stamperai 'Primo' comunque. Usa for-else o un flag."
      },
      {
        titleTemplate: "Nested List Flat",
        descTemplate: "Appiattisci [[1, 2], [3, 4]] in [1, 2, 3, 4].",
        starterCode: "mat = [[1, 2], [3, 4]]\nflat = []\nprint(flat)",
        solutionCode: "mat = [[1, 2], [3, 4]]\nflat = []\nfor row in mat:\n    for x in row:\n        flat.append(x)\nprint(flat)",
        expectedOutput: "[1, 2, 3, 4]",
        hints: ["Outer loop su liste interne", "Inner loop su elementi"],
        explanation: "Scorrere strutture annidate richiede loop annidati.",
        brokenCode: "flat = [x for x in mat]",
        debugHint: "Questo copia le liste interne, non le appiattisce."
      },
      {
        titleTemplate: "Dict Items",
        descTemplate: "Stampa 'k=v' per ogni elemento di {'x': 10, 'y': 20}.",
        starterCode: "d = {'x': 10, 'y': 20}\n",
        solutionCode: "d = {'x': 10, 'y': 20}\nfor k, v in d.items():\n    print(f'{k}={v}')",
        expectedOutput: "x=10\ny=20",
        hints: [".items() restituisce tuple (chiave, valore)", "Unpacking nel for"],
        explanation: ".items() è essenziale per scorrere chiavi e valori insieme.",
        brokenCode: "for k, v in d:\n    print(k, v)",
        debugHint: "Iterare su d restituisce solo chiavi, errore di unpacking."
      },
      {
        titleTemplate: "Triangle Pattern",
        descTemplate: "Stampa un triangolo di asterischi alto 3.",
        starterCode: "for i in range(1, 4): ...",
        solutionCode: "for i in range(1, 4):\n    print('*' * i)",
        expectedOutput: "*\n**\n***",
        hints: ["Moltiplica stringa '*' per i", "range da 1 a 4"],
        explanation: "Combinazione di loop e moltiplicazione stringhe.",
        brokenCode: "for i in range(1, 4):\n    print('*' + i)",
        debugHint: "Non puoi sommare stringa e numero."
      },
      {
        titleTemplate: "While Complex",
        descTemplate: "Cicla finché n > 0, stampando n e sottraendo 2.",
        starterCode: "n = 5\n",
        solutionCode: "n = 5\nwhile n > 0:\n    print(n)\n    n -= 2",
        expectedOutput: "5\n3\n1",
        hints: ["n -= 2 decrementa", "Condizione n > 0"],
        explanation: "While con step diverso da 1.",
        brokenCode: "n = 5\nwhile n > 0:\n    print(n)\n    n - 2",
        debugHint: "n - 2 non modifica n. Usa n -= 2 o ciclo infinito."
      },
      {
        titleTemplate: "Sum of Squares",
        descTemplate: "Calcola somma quadrati da 0 a 2 (0^2 + 1^2 + 2^2).",
        starterCode: "",
        solutionCode: "tot = 0\nfor i in range(3):\n    tot += i*i\nprint(tot)",
        expectedOutput: "5",
        hints: ["Accumulatore tot", "Aggiungi i*i"],
        explanation: "Accumulo di valori calcolati.",
        brokenCode: "print(sum(range(3))**2)",
        debugHint: "Questo è il quadrato della somma, non la somma dei quadrati."
      },
      {
        titleTemplate: "Max in List",
        descTemplate: "Trova il massimo in [2, 9, 4] usando un loop (no max()).",
        starterCode: "lst = [2, 9, 4]\nm = lst[0]\nprint(m)",
        solutionCode: "lst = [2, 9, 4]\nm = lst[0]\nfor x in lst:\n    if x > m:\n        m = x\nprint(m)",
        expectedOutput: "9",
        hints: ["Confronta ogni x con m", "Se x > m, aggiorna m"],
        explanation: "Algoritmo base di ricerca massimo.",
        brokenCode: "lst = [2, 9, 4]\nfor x in lst:\n    m = x",
        debugHint: "Così m diventa l'ultimo elemento. Devi usare if x > m."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Cicli annidati",
        descTemplate: "Stampa una griglia 3x3 di asterischi.",
        starterCode: "",
        solutionCode: "for i in range(3):\n    for j in range(3):\n        print('*', end=' ')\n    print()",
        expectedOutput: "* * * \n* * * \n* * * ",
        hints: ["Ciclo esterno per righe", "Ciclo interno per colonne"],
        explanation: "I cicli annidati permettono di iterare su strutture bidimensionali.",
        brokenCode: "for i in range(3):\n    for j in range(3):\n        print('*')",
        debugHint: "Stampi ogni * su una riga nuova, usa end=' ' e print() per andare a capo."
      },
      {
        titleTemplate: "Else in for",
        descTemplate: "Cerca un numero nella lista, stampa 'Non trovato' se assente.",
        starterCode: "numeri = [1, 2, 4, 5]\ntarget = 3\n",
        solutionCode: "numeri = [1, 2, 4, 5]\ntarget = 3\nfor n in numeri:\n    if n == target:\n        print('Trovato')\n        break\nelse:\n    print('Non trovato')",
        expectedOutput: "Non trovato",
        hints: ["else del for esegue se non c'è break", "È una feature unica di Python"],
        explanation: "L'else di un for esegue solo se il ciclo termina senza break.",
        brokenCode: "numeri = [1, 2, 4, 5]\ntarget = 3\nfor n in numeri:\n    if n == target:\n        print('Trovato')\nprint('Non trovato')",
        debugHint: "Così stampa sempre 'Non trovato', usa else del for."
      },
      {
        titleTemplate: "List comprehension",
        descTemplate: "Crea una lista dei quadrati da 1 a 5 con list comprehension.",
        starterCode: "",
        solutionCode: "quadrati = [x**2 for x in range(1, 6)]\nprint(quadrati)",
        expectedOutput: "[1, 4, 9, 16, 25]",
        hints: ["[espressione for var in sequenza]", "x**2 è x al quadrato"],
        explanation: "List comprehension è un modo conciso per creare liste.",
        brokenCode: "quadrati = [x**2 in range(1, 6)]\nprint(quadrati)",
        debugHint: "Manca 'for x' prima di 'in range'."
      },
      {
        titleTemplate: "Zip",
        descTemplate: "Combina due liste in coppie e stampale.",
        starterCode: "nomi = ['Mario', 'Luigi']\neta = [30, 28]\n",
        solutionCode: "nomi = ['Mario', 'Luigi']\neta = [30, 28]\nfor n, e in zip(nomi, eta):\n    print(f'{n}: {e}')",
        expectedOutput: "Mario: 30\nLuigi: 28",
        hints: ["zip combina liste elemento per elemento", "Usa unpacking nel for"],
        explanation: "zip itera su multiple sequenze in parallelo.",
        brokenCode: "nomi = ['Mario', 'Luigi']\neta = [30, 28]\nfor n, e in nomi, eta:\n    print(f'{n}: {e}')",
        debugHint: "Devi usare zip() per combinare le liste."
      },
      {
        titleTemplate: "Countdown",
        descTemplate: "Conta alla rovescia da 5 a 1, poi stampa 'Via!'.",
        starterCode: "",
        solutionCode: "for i in range(5, 0, -1):\n    print(i)\nprint('Via!')",
        expectedOutput: "5\n4\n3\n2\n1\nVia!",
        hints: ["range(start, stop, step) con step negativo", "range(5, 0, -1) conta all'indietro"],
        explanation: "Con step -1, range conta all'indietro.",
        brokenCode: "for i in range(5, 1, -1):\n    print(i)\nprint('Via!')",
        debugHint: "range(5,1,-1) arriva solo a 2, usa range(5,0,-1)."
      },
      {
        titleTemplate: "Dict Comp",
        descTemplate: "Crea dizionario {i: i^2} per i in 0-2.",
        starterCode: "",
        solutionCode: "print({x: x*x for x in range(3)})",
        expectedOutput: "{0: 0, 1: 1, 2: 4}",
        hints: ["Dictionary comprehension {k: v for ...}", "range(3)"],
        explanation: "Comprehension per creare dizionari in modo conciso.",
        brokenCode: "print([x: x*x for x in range(3)])",
        debugHint: "Le parentesi quadre [] sono per liste, graffe {} per dict."
      },
      {
        titleTemplate: "Set Comp",
        descTemplate: "Crea set di numeri unici da [1, 2, 2, 3] al quadrato.",
        starterCode: "lst = [1, 2, 2, 3]\n",
        solutionCode: "lst = [1, 2, 2, 3]\nprint({x*x for x in lst})",
        expectedOutput: "{1, 4, 9}",
        hints: ["Set comprehension usa {}", "Elimina duplicati automaticamente"],
        explanation: "Set comprehension crea un insieme di valori unici.",
        brokenCode: "print((x*x for x in lst))",
        debugHint: "Le tonde () creano un generatore, non un set."
      },
      {
        titleTemplate: "Generator Expression",
        descTemplate: "Stampa somma di quadrati 0-4 usando generatore in sum().",
        starterCode: "",
        solutionCode: "print(sum(x*x for x in range(5)))",
        expectedOutput: "30",
        hints: ["Passa la comprehension senza parentesi a sum()", "range(5)"],
        explanation: "Le generator expression sono memory-efficient per aggregazioni.",
        brokenCode: "print(sum([x*x for x in range(5)]))",
        debugHint: "Funziona, ma crea una lista inutile in memoria. Meglio senza []."
      },
      {
        titleTemplate: "Iter e Next",
        descTemplate: "Usa iter() e next() per scorrere [10, 20].",
        starterCode: "lst = [10, 20]\nit = iter(lst)\n",
        solutionCode: "lst = [10, 20]\nit = iter(lst)\nprint(next(it))\nprint(next(it))",
        expectedOutput: "10\n20",
        hints: ["iter(obj) crea iteratore", "next(it) prende elemento"],
        explanation: "Sotto il cofano, i loop for usano iter() e next().",
        brokenCode: "it = list([10, 20])\nprint(it.next())",
        debugHint: "Le liste non hanno .next(). Devi creare un iteratore con iter()."
      },
      {
        titleTemplate: "Matrix Mult (Manual)",
        descTemplate: "Moltiplica [2] per [[3], [4]] (prodotto scalare simulato).",
        starterCode: "row = [2, 3]\ncol = [4, 5]\n",
        solutionCode: "row = [2, 3]\ncol = [4, 5]\nres = 0\nfor i in range(len(row)):\n    res += row[i] * col[i]\nprint(res)",
        expectedOutput: "23",
        hints: ["Loop per indice", "res += row[i]*col[i]"],
        explanation: "Prodotto scalare (dot product): 2*4 + 3*5 = 8 + 15 = 23.",
        brokenCode: "print(row * col)",
        debugHint: "Le liste non supportano moltiplicazione vettoriale diretta in Python base."
      },
      {
        titleTemplate: "Transpose Matrix",
        descTemplate: "Trasponi [[1, 2], [3, 4]] -> [[1, 3], [2, 4]] con nested comp.",
        starterCode: "m = [[1, 2], [3, 4]]\n",
        solutionCode: "m = [[1, 2], [3, 4]]\nprint([[row[i] for row in m] for i in range(2)])",
        expectedOutput: "[[1, 3], [2, 4]]",
        hints: ["Doppia list comprehension", "i è indice colonna"],
        explanation: "Trasposizione matrice in una riga.",
        brokenCode: "m.transpose()",
        debugHint: "Le liste base non hanno .transpose() (serve NumPy)."
      },
      {
        titleTemplate: "While Else",
        descTemplate: "Cerca 5 con while. Usa else per stampare 'No'. (Lista senza 5).",
        starterCode: "i = 0\n",
        solutionCode: "i = 0\nwhile i < 3:\n    if i == 5: break\n    i += 1\nelse:\n    print('No')",
        expectedOutput: "No",
        hints: ["else su while funziona come su for", "Solo se no break"],
        explanation: "While supporta il blocco else.",
        brokenCode: "while i < 3:\n    ...\nprint('No')",
        debugHint: "Così stampa 'No' sempre, anche se trovi 5."
      },
      {
        titleTemplate: "Cycle Logic",
        descTemplate: "Simula itertools.cycle su [1, 2] per 3 step.",
        starterCode: "lst = [1, 2]\n",
        solutionCode: "lst = [1, 2]\nfor i in range(3):\n    print(lst[i % len(lst)])",
        expectedOutput: "1\n2\n1",
        hints: ["Indice i % len(lst)", "Cicla indefinitamente"],
        explanation: "L'operatore modulo permette di ciclare su una lista.",
        brokenCode: "for i in range(3):\n    print(lst[i])",
        debugHint: "IndexError quando i=2 (lista lunga 2). Usa modulo."
      },
      {
        titleTemplate: "Bubble Sort",
        descTemplate: "Ordina [3, 1, 2] con bubble sort manuale.",
        starterCode: "l = [3, 1, 2]\nprint(l)",
        solutionCode: "l = [3, 1, 2]\nfor i in range(len(l)):\n    for j in range(len(l)-1):\n        if l[j] > l[j+1]:\n            l[j], l[j+1] = l[j+1], l[j]\nprint(l)",
        expectedOutput: "[1, 2, 3]",
        hints: ["Confronta adiacenti", "Swap se disordinati"],
        explanation: "Algoritmo di ordinamento base O(n^2).",
        brokenCode: "l.sort()",
        debugHint: "Funziona, ma l'esercizio chiedeva algoritmo manuale."
      },
      {
        titleTemplate: "All Pairs",
        descTemplate: "Genera tutte le coppie uniche (i < j) da range(3).",
        starterCode: "",
        solutionCode: "for i in range(3):\n    for j in range(i+1, 3):\n        print(f'{i},{j}')",
        expectedOutput: "0,1\n0,2\n1,2",
        hints: ["Inner range parte da i+1", "Evita duplicati e auto-coppie"],
        explanation: "Pattern 'Handshake problem' o combinazioni semplici.",
        brokenCode: "for j in range(3):",
        debugHint: "Se j parte da 0 hai tutte le coppie (permutazioni), qui chiediamo uniche (combinazioni)."
      },
      {
        titleTemplate: "Walrus While",
        descTemplate: "Usa (n := n-1) nel while condition.",
        starterCode: "n = 3\n# while (n := n-1) >= 0:\n",
        solutionCode: "n = 3\nwhile (n := n - 1) >= 0:\n    print(n)",
        expectedOutput: "2\n1\n0",
        hints: ["Decrementa e controlla insieme", "n parte da 3, primo check n diventa 2"],
        explanation: "Loop con side-effect nella condizione.",
        brokenCode: "while n -= 1:",
        debugHint: "-= non ritorna valore in Python, non usabile in condition."
      },
      {
        titleTemplate: "Filter None",
        descTemplate: "Filtra None da [1, None, 2] con list comp.",
        starterCode: "lst = [1, None, 2]\n",
        solutionCode: "lst = [1, None, 2]\nprint([x for x in lst if x is not None])",
        expectedOutput: "[1, 2]",
        hints: ["if x is not None", "Rimuove valori nulli"],
        explanation: "Pulizia dati classica.",
        brokenCode: "[x for x in lst if x]",
        debugHint: "Attento: rimuoverebbe anche 0 o False. Usa 'is not None'."
      },
      {
        titleTemplate: "Map Simulation",
        descTemplate: "Simula map(str, [1, 2]) con list comp.",
        starterCode: "",
        solutionCode: "print([str(x) for x in [1, 2]])",
        expectedOutput: "['1', '2']",
        hints: ["Applica str(x) a ogni elemento", "Risultato lista"],
        explanation: "Comprehension sostituisce spesso map().",
        brokenCode: "print(list(map(str, [1, 2])))",
        debugHint: "Corretto, ma esercizio chiedeva list comp."
      },
      {
        titleTemplate: "Product Accumulator",
        descTemplate: "Prodotto cumulativo lista (reduce) manuale.",
        starterCode: "l = [2, 3, 4]\nacc = 1\n",
        solutionCode: "l = [2, 3, 4]\nacc = 1\nfor x in l:\n    acc *= x\nprint(acc)",
        expectedOutput: "24",
        hints: ["Start a 1", "accumula moltiplicando"],
        explanation: "Implementazione manuale di reduce *.",
        brokenCode: "acc = 0",
        debugHint: "Accumulatore prodotto deve partire da 1."
      },
      {
        titleTemplate: "Custom Range",
        descTemplate: "Implementa generatore my_range(3) con yield.",
        starterCode: "def my_range(n):\n    i = 0\nfor x in my_range(3): print(x)",
        solutionCode: "def my_range(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\nfor x in my_range(3):\n    print(x)",
        expectedOutput: "0\n1\n2",
        hints: ["yield restituisce valore e pausa", "while i < n"],
        explanation: "I generatori con yield creano iteratori custom.",
        brokenCode: "return i",
        debugHint: "return termina la funzione, yield la mette in pausa (generatore)."
      }
    ]
  },

  // ==================== LISTS ====================
  [PythonTopicId.Lists]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Creazione lista",
        descTemplate: "Crea una lista con i numeri 1, 2, 3 e stampala.",
        starterCode: "",
        solutionCode: "numeri = [1, 2, 3]\nprint(numeri)",
        expectedOutput: "[1, 2, 3]",
        hints: ["Usa le parentesi quadre []", "Separa gli elementi con virgole"],
        explanation: "Le liste si creano con parentesi quadre [].",
        brokenCode: "numeri = (1, 2, 3)\nprint(numeri)",
        debugHint: "[] crea una lista, () crea una tupla."
      },
      {
        titleTemplate: "Accesso per indice",
        descTemplate: "Stampa il primo elemento della lista.",
        starterCode: "frutti = ['mela', 'pera', 'banana']\n",
        solutionCode: "frutti = ['mela', 'pera', 'banana']\nprint(frutti[0])",
        expectedOutput: "mela",
        hints: ["Gli indici partono da 0", "lista[0] è il primo elemento"],
        explanation: "In Python gli indici delle liste partono da 0.",
        brokenCode: "frutti = ['mela', 'pera', 'banana']\nprint(frutti[1])",
        debugHint: "frutti[1] è 'pera', il primo è frutti[0]."
      },
      {
        titleTemplate: "Indice negativo",
        descTemplate: "Stampa l'ultimo elemento usando un indice negativo.",
        starterCode: "numeri = [10, 20, 30, 40]\n",
        solutionCode: "numeri = [10, 20, 30, 40]\nprint(numeri[-1])",
        expectedOutput: "40",
        hints: ["-1 è l'ultimo elemento", "-2 è il penultimo"],
        explanation: "Gli indici negativi contano dalla fine.",
        brokenCode: "numeri = [10, 20, 30, 40]\nprint(numeri[4])",
        debugHint: "IndexError! La lista ha 4 elementi, indici 0-3."
      },
      {
        titleTemplate: "Append",
        descTemplate: "Aggiungi 4 alla lista e stampala.",
        starterCode: "numeri = [1, 2, 3]\n",
        solutionCode: "numeri = [1, 2, 3]\nnumeri.append(4)\nprint(numeri)",
        expectedOutput: "[1, 2, 3, 4]",
        hints: ["append() aggiunge alla fine", "Modifica la lista originale"],
        explanation: "append() aggiunge un elemento alla fine della lista.",
        brokenCode: "numeri = [1, 2, 3]\nprint(numeri.append(4))",
        debugHint: "append() restituisce None, stampa numeri dopo."
      },
      {
        titleTemplate: "Lunghezza lista",
        descTemplate: "Stampa il numero di elementi nella lista.",
        starterCode: "colori = ['rosso', 'verde', 'blu', 'giallo']\n",
        solutionCode: "colori = ['rosso', 'verde', 'blu', 'giallo']\nprint(len(colori))",
        expectedOutput: "4",
        hints: ["Usa len()", "Conta gli elementi"],
        explanation: "len() restituisce il numero di elementi in una sequenza.",
        brokenCode: "colori = ['rosso', 'verde', 'blu', 'giallo']\nprint(colori.length)",
        debugHint: "In Python è len(lista), non lista.length."
      },
      {
        titleTemplate: "Lista vuota",
        descTemplate: "Crea una lista vuota.",
        starterCode: "",
        solutionCode: "lst = []\nprint(lst)",
        expectedOutput: "[]",
        hints: ["Usa solo []", "Oppure list()"],
        explanation: "Una lista senza elementi si indica con [].",
        brokenCode: "lst = empty\nprint(lst)",
        debugHint: "empty non è una parola chiave, usa []."
      },
      {
        titleTemplate: "Somma lista",
        descTemplate: "Calcola la somma degli elementi di [10, 20, 30].",
        starterCode: "numeri = [10, 20, 30]\n",
        solutionCode: "numeri = [10, 20, 30]\nprint(sum(numeri))",
        expectedOutput: "60",
        hints: ["Usa la funzione sum()", "sum(numeri)"],
        explanation: "sum() somma tutti gli elementi di una lista numerica.",
        brokenCode: "numeri = [10, 20, 30]\nprint(numeri.sum())",
        debugHint: "Le liste non hanno il metodo .sum(), usa la funzione globale sum()."
      },
      {
        titleTemplate: "Minimo e Massimo",
        descTemplate: "Trova min e max di [5, 1, 8].",
        starterCode: "numeri = [5, 1, 8]\n",
        solutionCode: "numeri = [5, 1, 8]\nprint(min(numeri))\nprint(max(numeri))",
        expectedOutput: "1\n8",
        hints: ["min() triva il minimo", "max() trova il massimo"],
        explanation: "min() e max() sono built-in functions utili per le collezioni.",
        brokenCode: "numeri = [5, 1, 8]\nprint(numeri.min())",
        debugHint: "Usa min(numeri) invece di numeri.min()."
      },
      {
        titleTemplate: "Sostituzione",
        descTemplate: "Cambia il primo elemento di [1, 2, 3] in 100.",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nlst[0] = 100\nprint(lst)",
        expectedOutput: "[100, 2, 3]",
        hints: ["Usa l'assegnazione all'indice", "lst[0] = ..."],
        explanation: "Le liste sono mutabili, puoi cambiare i valori degli indici.",
        brokenCode: "lst = [1, 2, 3]\nlst(0) = 100",
        debugHint: "Usa parentesi quadre per l'indice: lst[0]."
      },
      {
        titleTemplate: "Clear lista",
        descTemplate: "Svuota la lista [1, 2, 3].",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nlst.clear()\nprint(lst)",
        expectedOutput: "[]",
        hints: [".clear() rimuove tutto", "Equivale a del lst[:]"],
        explanation: "clear() rimuove tutti gli elementi in-place.",
        brokenCode: "lst = [1, 2, 3]\nlst = []\nprint(lst)",
        debugHint: "Questo riassegna la variabile, non svuota la lista originale (importante se ci sono altri riferimenti)."
      },
      {
        titleTemplate: "Concatenazione",
        descTemplate: "Unisci [1] e [2] con l'operatore +.",
        starterCode: "a = [1]\nb = [2]\n",
        solutionCode: "a = [1]\nb = [2]\nprint(a + b)",
        expectedOutput: "[1, 2]",
        hints: ["+ crea una nuova lista unita", "Non modifica le originali"],
        explanation: "L'operatore + concatena due liste.",
        brokenCode: "a = [1]\nb = [2]\nprint(a .add b)",
        debugHint: "Usa + per concatenare liste."
      },
      {
        titleTemplate: "Ripetizione",
        descTemplate: "Crea lista [0, 0, 0] usando *.",
        starterCode: "",
        solutionCode: "zeros = [0] * 3\nprint(zeros)",
        expectedOutput: "[0, 0, 0]",
        hints: ["lista * n ripete n volte", "[0] * 3"],
        explanation: "L'operatore * ripete il contenuto della lista.",
        brokenCode: "zeros = [0] * [3]",
        debugHint: "Moltiplica per un intero, non per una lista."
      },
      {
        titleTemplate: "Conta occorrenze",
        descTemplate: "Conta quanti 1 ci sono in [1, 1, 2].",
        starterCode: "lst = [1, 1, 2]\n",
        solutionCode: "lst = [1, 1, 2]\nprint(lst.count(1))",
        expectedOutput: "2",
        hints: [".count(valore)", "Restituisce integer"],
        explanation: "count() restituisce il numero di volte che un valore appare.",
        brokenCode: "lst = [1, 1, 2]\nprint(lst.count())",
        debugHint: "count() richiede l'argomento da cercare."
      },
      {
        titleTemplate: "Check presenza",
        descTemplate: "Stampa True se 5 è in [1, 5, 10].",
        starterCode: "lst = [1, 5, 10]\n",
        solutionCode: "lst = [1, 5, 10]\nprint(5 in lst)",
        expectedOutput: "True",
        hints: ["Usa 'in'", "valore in lista"],
        explanation: "'in' verifica l'appartenenza in modo efficiente.",
        brokenCode: "lst = [1, 5, 10]\nprint(lst.contains(5))",
        debugHint: "In Python usa 'in', non .contains()."
      },
      {
        titleTemplate: "Check vuota (not)",
        descTemplate: "Controlla se la lista è vuota con 'not'.",
        starterCode: "lst = []\n",
        solutionCode: "lst = []\nif not lst:\n    print('Vuota')",
        expectedOutput: "Vuota",
        hints: ["Le liste vuote sono falsy", "if not lst:"],
        explanation: "È il modo pythonico per controllare se una lista è vuota.",
        brokenCode: "lst = []\nif lst.isEmpty():\n    print('Vuota')",
        debugHint: "isEmpty() non esiste, usa 'not lst'."
      },
      {
        titleTemplate: "Sort decrescente",
        descTemplate: "Ordina [1, 3, 2] in modo decrescente.",
        starterCode: "lst = [1, 3, 2]\n",
        solutionCode: "lst = [1, 3, 2]\nlst.sort(reverse=True)\nprint(lst)",
        expectedOutput: "[3, 2, 1]",
        hints: ["sort(reverse=True)", "Parametro keyword"],
        explanation: "sort accetta reverse=True per invertire l'ordine.",
        brokenCode: "lst = [1, 3, 2]\nlst.sort(-1)",
        debugHint: "Usa reverse=True, non -1."
      },
      {
        titleTemplate: "Slice inizio",
        descTemplate: "Prendi dall'inizio fino all'indice 2 (escluso).",
        starterCode: "lst = [10, 20, 30, 40]\n",
        solutionCode: "lst = [10, 20, 30, 40]\nprint(lst[:2])",
        expectedOutput: "[10, 20]",
        hints: ["Ommetti start", "[:stop]"],
        explanation: "Se start è omesso, parte da 0.",
        brokenCode: "lst = [10, 20, 30, 40]\nprint(lst[0:2])",
        debugHint: "Corretto, ma [:2] è più conciso."
      },
      {
        titleTemplate: "Slice fine",
        descTemplate: "Prendi dall'indice 1 fino alla fine.",
        starterCode: "lst = [10, 20, 30]\n",
        solutionCode: "lst = [10, 20, 30]\nprint(lst[1:])",
        expectedOutput: "[20, 30]",
        hints: ["Ommetti stop", "[start:]"],
        explanation: "Se stop è omesso, va fino alla fine.",
        brokenCode: "lst = [10, 20, 30]\nprint(lst[1:end])",
        debugHint: "end non è definito, lascia vuoto dopo i due punti."
      },
      {
        titleTemplate: "Copia slice",
        descTemplate: "Crea una copia con slicing totale [:].",
        starterCode: "a = [1, 2]\n# b = a[:]\n",
        solutionCode: "a = [1, 2]\nb = a[:]\nprint(b)",
        expectedOutput: "[1, 2]",
        hints: ["[:] copia tutta la lista", "Genera nuova lista"],
        explanation: "[:] è un idioma comune per copiare liste (shallow copy).",
        brokenCode: "a = [1, 2]\nb = a[]",
        debugHint: "Sintassi errata, serve [:] con i due punti."
      },
      {
        titleTemplate: "Del item",
        descTemplate: "Cancella il primo elemento con del.",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\ndel lst[0]\nprint(lst)",
        expectedOutput: "[2, 3]",
        hints: ["del lista[indice]", "Modifica in-place"],
        explanation: "del è un'istruzione che rimuove elementi o variabili.",
        brokenCode: "lst = [1, 2, 3]\ndelete lst[0]",
        debugHint: "In Python è 'del', non 'delete'."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Slicing base",
        descTemplate: "Estrai i primi 3 elementi della lista.",
        starterCode: "numeri = [1, 2, 3, 4, 5]\n",
        solutionCode: "numeri = [1, 2, 3, 4, 5]\nprint(numeri[:3])",
        expectedOutput: "[1, 2, 3]",
        hints: ["[:3] prende gli elementi 0, 1, 2", "L'indice finale è escluso"],
        explanation: "Lo slicing estrae una porzione della lista.",
        brokenCode: "numeri = [1, 2, 3, 4, 5]\nprint(numeri[3])",
        debugHint: "numeri[3] è un singolo elemento, usa [:3] per slice."
      },
      {
        titleTemplate: "Insert",
        descTemplate: "Inserisci 'X' in posizione 1.",
        starterCode: "lettere = ['A', 'B', 'C']\n",
        solutionCode: "lettere = ['A', 'B', 'C']\nlettere.insert(1, 'X')\nprint(lettere)",
        expectedOutput: "['A', 'X', 'B', 'C']",
        hints: ["insert(posizione, elemento)", "Gli altri elementi slittano"],
        explanation: "insert() inserisce in una posizione specifica.",
        brokenCode: "lettere = ['A', 'B', 'C']\nlettere.insert('X', 1)\nprint(lettere)",
        debugHint: "L'ordine è insert(indice, valore), non insert(valore, indice)."
      },
      {
        titleTemplate: "Remove",
        descTemplate: "Rimuovi 'banana' dalla lista.",
        starterCode: "frutti = ['mela', 'banana', 'pera']\n",
        solutionCode: "frutti = ['mela', 'banana', 'pera']\nfrutti.remove('banana')\nprint(frutti)",
        expectedOutput: "['mela', 'pera']",
        hints: ["remove() rimuove per valore", "Rimuove solo la prima occorrenza"],
        explanation: "remove() trova e rimuove il primo elemento uguale.",
        brokenCode: "frutti = ['mela', 'banana', 'pera']\nfrutti.delete('banana')\nprint(frutti)",
        debugHint: "Il metodo si chiama remove(), non delete()."
      },
      {
        titleTemplate: "Pop",
        descTemplate: "Rimuovi e stampa l'ultimo elemento.",
        starterCode: "stack = [1, 2, 3]\n",
        solutionCode: "stack = [1, 2, 3]\nultimo = stack.pop()\nprint(ultimo)",
        expectedOutput: "3",
        hints: ["pop() rimuove e restituisce l'ultimo", "Senza argomento prende l'ultimo"],
        explanation: "pop() rimuove e restituisce l'elemento (default: ultimo).",
        brokenCode: "stack = [1, 2, 3]\nprint(stack.remove())",
        debugHint: "remove() richiede un argomento, usa pop()."
      },
      {
        titleTemplate: "Sort",
        descTemplate: "Ordina la lista in ordine crescente.",
        starterCode: "numeri = [3, 1, 4, 1, 5]\n",
        solutionCode: "numeri = [3, 1, 4, 1, 5]\nnumeri.sort()\nprint(numeri)",
        expectedOutput: "[1, 1, 3, 4, 5]",
        hints: ["sort() modifica la lista originale", "Ordina in place"],
        explanation: "sort() ordina la lista sul posto (in-place).",
        brokenCode: "numeri = [3, 1, 4, 1, 5]\nprint(numeri.sort())",
        debugHint: "sort() restituisce None, stampa numeri dopo."
      },
      {
        titleTemplate: "Lista da Stringa",
        descTemplate: "Converti 'abc' in lista ['a', 'b', 'c'].",
        starterCode: "s = 'abc'\n",
        solutionCode: "s = 'abc'\nprint(list(s))",
        expectedOutput: "['a', 'b', 'c']",
        hints: ["list() spacchetta la stringa", "Ogni carattere diventa elemento"],
        explanation: "Il costruttore list() accetta qualsiasi iterabile.",
        brokenCode: "s = 'abc'\nprint([s])",
        debugHint: "Questo crea ['abc'], non ['a', 'b', 'c']. Usa list(s)."
      },
      {
        titleTemplate: "Split Stringa",
        descTemplate: "Dividi '1 2 3' in lista di stringhe.",
        starterCode: "s = '1 2 3'\n",
        solutionCode: "s = '1 2 3'\nprint(s.split())",
        expectedOutput: "['1', '2', '3']",
        hints: [".split() senza argomenti usa spazi", "Restituisce lista"],
        explanation: "split() divide una stringa in base a un separatore.",
        brokenCode: "s = '1 2 3'\nprint(list(s))",
        debugHint: "list(s) include anche gli spazi. split() divide per parola."
      },
      {
        titleTemplate: "Join Elements",
        descTemplate: "Unisci ['a', 'b'] in 'a-b'.",
        starterCode: "lst = ['a', 'b']\n",
        solutionCode: "lst = ['a', 'b']\nprint('-'.join(lst))",
        expectedOutput: "a-b",
        hints: ["separatore.join(lista)", "'-'.join(...)"],
        explanation: "join è il contrario di split.",
        brokenCode: "lst = ['a', 'b']\nprint(lst.join('-'))",
        debugHint: "join è metodo delle stringhe, non delle liste."
      },
      {
        titleTemplate: "Range to List",
        descTemplate: "Crea lista [0, 1, 2, 3, 4] da range.",
        starterCode: "",
        solutionCode: "print(list(range(5)))",
        expectedOutput: "[0, 1, 2, 3, 4]",
        hints: ["range(5) crea generatore", "list() lo consuma"],
        explanation: "Per vedere i numeri di un range, convertilo in lista.",
        brokenCode: "print(range(5))",
        debugHint: "Stampa solo 'range(0, 5)', serve list()."
      },
      {
        titleTemplate: "Slicing Step",
        descTemplate: "Prendi elementi a saltare (step 2) da [0..4].",
        starterCode: "lst = [0, 1, 2, 3, 4]\n",
        solutionCode: "lst = [0, 1, 2, 3, 4]\nprint(lst[::2])",
        expectedOutput: "[0, 2, 4]",
        hints: ["[start:stop:step]", "[::2] prende tutto con passo 2"],
        explanation: "Lo step permette di saltare elementi.",
        brokenCode: "lst = [0, 1, 2, 3, 4]\nprint(lst[:2])",
        debugHint: "[:2] prende i primi due, [::2] prende alternati."
      },
      {
        titleTemplate: "Slicing Reverse",
        descTemplate: "Inverti lista con slicing [::-1].",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nprint(lst[::-1])",
        expectedOutput: "[3, 2, 1]",
        hints: ["Step negativo inverte", "[::-1]"],
        explanation: "Modo idiomatico per invertire e copiare una lista.",
        brokenCode: "lst = [1, 2, 3]\nprint(lst[-1])",
        debugHint: "[-1] è solo l'ultimo elemento, [::-1] è tutta la lista invertita."
      },
      {
        titleTemplate: "Sorted Function",
        descTemplate: "Stampa versione ordinata di [3, 1, 2] senza modificare l'originale.",
        starterCode: "lst = [3, 1, 2]\n",
        solutionCode: "lst = [3, 1, 2]\nprint(sorted(lst))",
        expectedOutput: "[1, 2, 3]",
        hints: ["sorted(lst) restituisce nuova lista", "Non modifica lst"],
        explanation: "sorted() vs .sort(): sorted crea nuova lista, sort ordina in-place.",
        brokenCode: "lst = [3, 1, 2]\nprint(lst.sort())",
        debugHint: ".sort() ritorna None. sorted() ritorna la lista ordinata."
      },
      {
        titleTemplate: "Insert Start",
        descTemplate: "Inserisci 0 all'inizio della lista.",
        starterCode: "lst = [1, 2]\n",
        solutionCode: "lst = [1, 2]\nlst.insert(0, 0)\nprint(lst)",
        expectedOutput: "[0, 1, 2]",
        hints: ["insert(0, val)", "Sposta tutto a destra"],
        explanation: "Inserire all'inizio ha costo O(n).",
        brokenCode: "lst = [1, 2]\nlst[0] = 0",
        debugHint: "Questo sostituisce il primo elemento, non inserisce."
      },
      {
        titleTemplate: "Pop Index",
        descTemplate: "Rimuovi e stampa il primo elemento (indice 0).",
        starterCode: "lst = [10, 20, 30]\n",
        solutionCode: "lst = [10, 20, 30]\nprint(lst.pop(0))",
        expectedOutput: "10",
        hints: ["pop prende l'indice opzionale", "pop(0)"],
        explanation: "pop(0) rimuove la testa della lista.",
        brokenCode: "lst = [10, 20, 30]\nprint(lst.pop(10))",
        debugHint: "Pop prende un indice, non il valore (10 non è indice)."
      },
      {
        titleTemplate: "Try Remove",
        descTemplate: "Prova a rimuovere 5, gestendo l'errore se manca.",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\ntry:\n    lst.remove(5)\nexcept ValueError:\n    print('Assente')",
        expectedOutput: "Assente",
        hints: ["remove solleva ValueError", "Cattura l'eccezione"],
        explanation: "Gestire le eccezioni è robusto.",
        brokenCode: "lst = [1, 2, 3]\nlst.remove(5)",
        debugHint: "Senza try-except il programma crasha."
      },
      {
        titleTemplate: "Extend Simple",
        descTemplate: "Estendi [1] con [2, 3] (non append).",
        starterCode: "a = [1]\nb = [2, 3]\n",
        solutionCode: "a = [1]\nb = [2, 3]\na.extend(b)\nprint(a)",
        expectedOutput: "[1, 2, 3]",
        hints: ["extend unisce gli elementi", "append unirebbe la lista come oggetto"],
        explanation: "extend appiattisce l'iterabile aggiunto.",
        brokenCode: "a = [1]\nb = [2, 3]\na.append(b)\nprint(a)",
        debugHint: "append darebbe [1, [2, 3]]."
      },
      {
        titleTemplate: "Comp Math",
        descTemplate: "Crea lista dei doppi [2, 4, 6] da [1, 2, 3] con comprehension.",
        starterCode: "lst = [1, 2, 3]\n",
        solutionCode: "lst = [1, 2, 3]\nprint([x*2 for x in lst])",
        expectedOutput: "[2, 4, 6]",
        hints: ["Moltiplica x*2", "for x in lst"],
        explanation: "Le comprehension sono potenti per trasformare dati.",
        brokenCode: "lst = [1, 2, 3]\nprint(lst * 2)",
        debugHint: "lst * 2 concatena [1,2,3,1,2,3], non moltiplica gli elementi."
      },
      {
        titleTemplate: "Nested Access",
        descTemplate: "Accedi al 'X' nella lista annidata [[1, 'X']].",
        starterCode: "m = [[1, 'X']]\n",
        solutionCode: "m = [[1, 'X']]\nprint(m[0][1])",
        expectedOutput: "X",
        hints: ["Primo indice seleziona la sotto-lista", "Secondo indice seleziona elemento"],
        explanation: "Accesso multidimensionale: m[riga][colonna].",
        brokenCode: "m = [[1, 'X']]\nprint(m[1][0])",
        debugHint: "Indici errati. m[0] è la lista inner."
      },
      {
        titleTemplate: "Index Range",
        descTemplate: "Trova indice di 2 cercando solo dopo l'indice 2.",
        starterCode: "lst = [1, 2, 1, 2, 1]\n",
        solutionCode: "lst = [1, 2, 1, 2, 1]\nprint(lst.index(2, 2))",
        expectedOutput: "3",
        hints: ["index(val, start)", "Salta le prime occorrenze"],
        explanation: "index supporta argomenti opzionali start e stop.",
        brokenCode: "lst = [1, 2, 1, 2, 1]\nprint(lst.index(2))",
        debugHint: "Questo trova il primo 2 (indice 1)."
      },
      {
        titleTemplate: "Reversed Function",
        descTemplate: "Itera su [1, 2] al contrario con reversed().",
        starterCode: "lst = [1, 2]\n",
        solutionCode: "lst = [1, 2]\nfor x in reversed(lst):\n    print(x)",
        expectedOutput: "2\n1",
        hints: ["reversed() restituisce iteratore", "Non crea lista copiata subito"],
        explanation: "Efficiente per iterare al contrario.",
        brokenCode: "lst = [1, 2]\nfor x in lst.reverse():\n    print(x)",
        debugHint: "lst.reverse() ritorna None (modifica in-place)."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "List comprehension con if",
        descTemplate: "Crea una lista dei soli numeri positivi.",
        starterCode: "numeri = [-2, 3, -1, 5, 0, -4, 8]\n",
        solutionCode: "numeri = [-2, 3, -1, 5, 0, -4, 8]\npositivi = [n for n in numeri if n > 0]\nprint(positivi)",
        expectedOutput: "[3, 5, 8]",
        hints: ["[expr for x in lista if condizione]", "> 0 filtra i positivi"],
        explanation: "List comprehension con if filtra gli elementi.",
        brokenCode: "numeri = [-2, 3, -1, 5, 0, -4, 8]\npositivi = [n if n > 0 for n in numeri]\nprint(positivi)",
        debugHint: "Il `for` va prima dell'`if` nel filtering."
      },
      {
        titleTemplate: "Extend",
        descTemplate: "Unisci due liste usando extend.",
        starterCode: "a = [1, 2]\nb = [3, 4]\n",
        solutionCode: "a = [1, 2]\nb = [3, 4]\na.extend(b)\nprint(a)",
        expectedOutput: "[1, 2, 3, 4]",
        hints: ["extend() aggiunge tutti gli elementi", "Modifica a in-place"],
        explanation: "extend() aggiunge ogni elemento di una lista a un'altra.",
        brokenCode: "a = [1, 2]\nb = [3, 4]\na.append(b)\nprint(a)",
        debugHint: "append() aggiunge b come singolo elemento: [1,2,[3,4]]."
      },
      {
        titleTemplate: "Reverse",
        descTemplate: "Inverti la lista sul posto.",
        starterCode: "numeri = [1, 2, 3, 4, 5]\n",
        solutionCode: "numeri = [1, 2, 3, 4, 5]\nnumeri.reverse()\nprint(numeri)",
        expectedOutput: "[5, 4, 3, 2, 1]",
        hints: ["reverse() modifica in-place", "Oppure usa slicing [::-1]"],
        explanation: "reverse() inverte l'ordine degli elementi.",
        brokenCode: "numeri = [1, 2, 3, 4, 5]\nprint(numeri.reverse())",
        debugHint: "reverse() restituisce None, stampa numeri dopo."
      },
      {
        titleTemplate: "Copia lista",
        descTemplate: "Crea una copia indipendente della lista.",
        starterCode: "originale = [1, 2, 3]\n",
        solutionCode: "originale = [1, 2, 3]\ncopia = originale.copy()\ncopia.append(4)\nprint(originale)\nprint(copia)",
        expectedOutput: "[1, 2, 3]\n[1, 2, 3, 4]",
        hints: [".copy() crea una copia", "Modifiche alla copia non toccano l'originale"],
        explanation: "copy() crea una shallow copy indipendente.",
        brokenCode: "originale = [1, 2, 3]\ncopia = originale\ncopia.append(4)\nprint(originale)",
        debugHint: "Senza copy(), modifichi anche l'originale!"
      },
      {
        titleTemplate: "Index e count",
        descTemplate: "Trova la posizione di 'x' e conta le occorrenze.",
        starterCode: "lettere = ['a', 'x', 'b', 'x', 'c', 'x']\n",
        solutionCode: "lettere = ['a', 'x', 'b', 'x', 'c', 'x']\nprint(lettere.index('x'))\nprint(lettere.count('x'))",
        expectedOutput: "1\n3",
        hints: ["index() trova la prima occorrenza", "count() conta tutte le occorrenze"],
        explanation: "index() trova posizione, count() conta occorrenze.",
        brokenCode: "lettere = ['a', 'x', 'b', 'x', 'c', 'x']\nprint(lettere.find('x'))",
        debugHint: "Le liste non hanno find(), usa index()."
      },
      {
        titleTemplate: "Matrix Build",
        descTemplate: "Crea matrice 2x2 [[0,0], [0,0]] con nested comp.",
        starterCode: "",
        solutionCode: "print([[0 for col in range(2)] for row in range(2)])",
        expectedOutput: "[[0, 0], [0, 0]]",
        hints: ["Comp interna crea riga", "Comp esterna ripete righe"],
        explanation: "Evita duplicazione di riferimenti con *.",
        brokenCode: "row = [0, 0]\nprint([row] * 2)",
        debugHint: "Attento! Crea 2 riferimenti alla STESSA riga. Se ne cambi una, cambiano entrambe."
      },
      {
        titleTemplate: "Flatten List",
        descTemplate: "Appiattisci [[1, 2], [3, 4]] in [1, 2, 3, 4].",
        starterCode: "m = [[1, 2], [3, 4]]\n",
        solutionCode: "m = [[1, 2], [3, 4]]\nprint([x for row in m for x in row])",
        expectedOutput: "[1, 2, 3, 4]",
        hints: ["Doppio for nella comprehension", "Ordine: for row in m -> for x in row"],
        explanation: "Pattern utile per linearizzare strutture dati.",
        brokenCode: "m = [[1, 2], [3, 4]]\nprint([x for x in row for row in m])",
        debugHint: "Ordine dei for invertito. Prima il loop esterno, poi quello interno."
      },
      {
        titleTemplate: "Deepcopy",
        descTemplate: "Usa deepcopy per copiare lista annidata.",
        starterCode: "import copy\nm = [[1]]\n",
        solutionCode: "import copy\nm = [[1]]\nc = copy.deepcopy(m)\nc[0][0] = 9\nprint(m[0][0])",
        expectedOutput: "1",
        hints: ["copy.deepcopy()", "Evita shared reference"],
        explanation: "copy() normale fa solo shallow copy (i riferimenti annidati restano condivisi).",
        brokenCode: "m = [[1]]\nc = m.copy()\nc[0][0] = 9\nprint(m[0][0])",
        debugHint: "Con shallow copy, m[0] è condiviso -> stampa 9."
      },
      {
        titleTemplate: "Zip Lists",
        descTemplate: "Combina [1, 2] e ['a', 'b'] in [(1,'a'), (2,'b')].",
        starterCode: "n = [1, 2]\nl = ['a', 'b']\n",
        solutionCode: "n = [1, 2]\nl = ['a', 'b']\nprint(list(zip(n, l)))",
        expectedOutput: "[(1, 'a'), (2, 'b')]",
        hints: ["zip() accoppia elementi", "Converti in list"],
        explanation: "zip() crea iteratore di tuple accoppiate.",
        brokenCode: "n = [1, 2]\nl = ['a', 'b']\nprint(zip(n, l))",
        debugHint: "Stampa oggetto zip, serve list()."
      },
      {
        titleTemplate: "Unzip",
        descTemplate: "Separa [(1,'a'), (2,'b')] in due liste orig.",
        starterCode: "z = [(1, 'a'), (2, 'b')]\n",
        solutionCode: "z = [(1, 'a'), (2, 'b')]\nn, l = zip(*z)\nprint(n)\nprint(l)",
        expectedOutput: "(1, 2)\n('a', 'b')",
        hints: ["*z spacchetta la lista di tuple", "zip(*z) traspone"],
        explanation: "zip(*zipped) inverte loperazione zip.",
        brokenCode: "z = [(1, 'a'), (2, 'b')]\nn, l = zip(z)",
        debugHint: "Manca l'asterisco per l'unpacking."
      },
      {
        titleTemplate: "Stack Operations",
        descTemplate: "Simula LIFO: push 1, push 2, pop.",
        starterCode: "stack = []\n",
        solutionCode: "stack = []\nstack.append(1)\nstack.append(2)\nprint(stack.pop())",
        expectedOutput: "2",
        hints: ["LIFO = Last In First Out", "append/pop end"],
        explanation: "Le liste sono ottimi stack LIFO.",
        brokenCode: "stack = []\nstack.push(1)",
        debugHint: "push non esiste, usa append."
      },
      {
        titleTemplate: "Queue Deque",
        descTemplate: "Importa deque e usala come coda FIFO.",
        starterCode: "from collections import deque\nq = deque()\n",
        solutionCode: "from collections import deque\nq = deque()\nq.append(1)\nprint(q.popleft())",
        expectedOutput: "1",
        hints: ["deque è ottimizzata per code", "popleft()"],
        explanation: "List pop(0) è lento (O(n)), deque popleft() è veloce (O(1)).",
        brokenCode: "q = deque()\nq.pop(0)",
        debugHint: "deque non supporta pop(indice), usa pop() o popleft()."
      },
      {
        titleTemplate: "Filter Function",
        descTemplate: "Usa filter() per tenere i pari da [1, 2, 3, 4].",
        starterCode: "lst = [1, 2, 3, 4]\n",
        solutionCode: "lst = [1, 2, 3, 4]\nprint(list(filter(lambda x: x % 2 == 0, lst)))",
        expectedOutput: "[2, 4]",
        hints: ["filter(func, iterable)", "lambda x: condizione"],
        explanation: "filter applica una funzione booleana.",
        brokenCode: "print(filter(lambda x: x % 2 == 0, lst))",
        debugHint: "filter ritorna iteratore, usa list()."
      },
      {
        titleTemplate: "Map Function",
        descTemplate: "Usa map() per raddoppiare [1, 2].",
        starterCode: "lst = [1, 2]\n",
        solutionCode: "lst = [1, 2]\nprint(list(map(lambda x: x * 2, lst)))",
        expectedOutput: "[2, 4]",
        hints: ["map(func, iterable)", "lambda x: x*2"],
        explanation: "map trasforma ogni elemento.",
        brokenCode: "lst = [1, 2]\nprint(lst.map(lambda x: x*2))",
        debugHint: "Le liste non hanno metodo .map()."
      },
      {
        titleTemplate: "Reduce Sum",
        descTemplate: "Usa functools.reduce per sommare [1, 2, 3].",
        starterCode: "from functools import reduce\nlst = [1, 2, 3]\n",
        solutionCode: "from functools import reduce\nlst = [1, 2, 3]\nprint(reduce(lambda x, y: x + y, lst))",
        expectedOutput: "6",
        hints: ["reduce accumula risultato", "lambda x, y: x+y"],
        explanation: "reduce applica cumulativamente la funzione agli elementi.",
        brokenCode: "reduce([1, 2, 3])",
        debugHint: "reduce richiede funzione e iterabile."
      },
      {
        titleTemplate: "Iterator Manual",
        descTemplate: "Ottieni iteratore da lista e chiama next().",
        starterCode: "lst = [10]\n# it = iter(lst), next(it)\n",
        solutionCode: "lst = [10]\nit = iter(lst)\nprint(next(it))",
        expectedOutput: "10",
        hints: ["iter() crea iteratore", "next() avanza"],
        explanation: "Protocollo iteratore di base.",
        brokenCode: "lst = [10]\nprint(next(lst))",
        debugHint: "La lista non è iteratore, devi chiamare iter(lst)."
      },
      {
        titleTemplate: "Any Check",
        descTemplate: "Controlla se c'è almeno un pari in [1, 3, 4].",
        starterCode: "lst = [1, 3, 4]\n",
        solutionCode: "lst = [1, 3, 4]\nprint(any(x % 2 == 0 for x in lst))",
        expectedOutput: "True",
        hints: ["Generator expression dentro any", "Short-circuit"],
        explanation: "any() accetta un generatore.",
        brokenCode: "lst = [1, 3, 4]\nprint(any(lst % 2 == 0))",
        debugHint: "Non puoi fare modulo su lista intera."
      },
      {
        titleTemplate: "Sort Key",
        descTemplate: "Ordina parole per lunghezza: ['aaa', 'b', 'cc'].",
        starterCode: "lst = ['aaa', 'b', 'cc']\n# sort key=len\n",
        solutionCode: "lst = ['aaa', 'b', 'cc']\nlst.sort(key=len)\nprint(lst)",
        expectedOutput: "['b', 'cc', 'aaa']",
        hints: ["key=len", "Ordina in base al valore ritornato dalla key function"],
        explanation: "Il parametro key personalizza l'ordinamento.",
        brokenCode: "lst.sort(len)",
        debugHint: "Parametro key deve essere nominativo: key=len."
      },
      {
        titleTemplate: "Binary Search",
        descTemplate: "Usa bisect per trovare dove inserire 2.5 in [1, 2, 3].",
        starterCode: "import bisect\nlst = [1, 2, 3]\n",
        solutionCode: "import bisect\nlst = [1, 2, 3]\nprint(bisect.bisect(lst, 2.5))",
        expectedOutput: "2",
        hints: ["bisect mantiene ordine", "Restituisce indice inserimento"],
        explanation: "Modulo per ricerca binaria e inserimento ordinato.",
        brokenCode: "lst.bisect(2.5)",
        debugHint: "Non è metodo di lista, è nel modulo bisect."
      },
      {
        titleTemplate: "Sys GetSizeOf",
        descTemplate: "Confronta size di lista vs tupla (solo stampa 'OK').",
        starterCode: "import sys\n",
        solutionCode: "import sys\nl = [1, 2, 3]\nt = (1, 2, 3)\nif sys.getsizeof(l) > sys.getsizeof(t):\n    print('OK')",
        expectedOutput: "OK",
        hints: ["Le liste occupano più memoria", "sys.getsizeof()"],
        explanation: "Le liste allocano memoria extra per resize dinamico.",
        brokenCode: "sys.sizeof(l)",
        debugHint: "Funzione corretta è sys.getsizeof()."
      }
    ],
  },

  // ==================== TUPLES ====================
  [PythonTopicId.Tuples]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Creare una tupla",
        descTemplate: "Crea una tupla con i valori 1, 2, 3 e stampala.",
        starterCode: "",
        solutionCode: "numeri = (1, 2, 3)\nprint(numeri)",
        expectedOutput: "(1, 2, 3)",
        hints: ["Usa le parentesi tonde ()", "Le tuple sono immutabili"],
        explanation: "Le tuple si creano con parentesi tonde ().",
        brokenCode: "numeri = [1, 2, 3]\nprint(numeri)",
        debugHint: "[] crea una lista, () crea una tupla."
      },
      {
        titleTemplate: "Accesso elementi tupla",
        descTemplate: "Stampa il secondo elemento della tupla.",
        starterCode: "colori = ('rosso', 'verde', 'blu')\n",
        solutionCode: "colori = ('rosso', 'verde', 'blu')\nprint(colori[1])",
        expectedOutput: "verde",
        hints: ["Indice 1 = secondo elemento", "Stesso accesso delle liste"],
        explanation: "L'accesso per indice funziona come per le liste.",
        brokenCode: "colori = ('rosso', 'verde', 'blu')\nprint(colori[2])",
        debugHint: "colori[2] è 'blu', il secondo è colori[1]."
      },
      {
        titleTemplate: "Lunghezza tupla",
        descTemplate: "Stampa quanti elementi ha la tupla.",
        starterCode: "dati = (10, 20, 30, 40)\n",
        solutionCode: "dati = (10, 20, 30, 40)\nprint(len(dati))",
        expectedOutput: "4",
        hints: ["len() funziona anche con tuple", "Conta gli elementi"],
        explanation: "len() restituisce il numero di elementi.",
        brokenCode: "dati = (10, 20, 30, 40)\nprint(dati.length)",
        debugHint: "In Python è len(tupla), non tupla.length."
      },
      {
        titleTemplate: "Tupla vuota",
        descTemplate: "Crea una tupla vuota.",
        starterCode: "",
        solutionCode: "t = ()\nprint(t)",
        expectedOutput: "()",
        hints: ["Usa () senza elementi", "tuple()"],
        explanation: "Una tupla vuota si indica con ().",
        brokenCode: "t = tuple[]\nprint(t)",
        debugHint: "tuple[] non è sintassi valida."
      },
      {
        titleTemplate: "Tupla singola",
        descTemplate: "Crea una tupla con un solo elemento 'ok'.",
        starterCode: "",
        solutionCode: "t = ('ok',)\nprint(t)",
        expectedOutput: "('ok',)",
        hints: ["Serve la virgola finale", "('ok',)"],
        explanation: "Senza virgola, ('ok') è solo una stringa tra parentesi.",
        brokenCode: "t = ('ok')\nprint(type(t))",
        debugHint: "Questo stampa <class 'str'>, aggiungi la virgola: ('ok',)."
      },
      {
        titleTemplate: "Concatenazione Tuple",
        descTemplate: "Unisci (1,) e (2,).",
        starterCode: "t1 = (1,)\nt2 = (2,)\n",
        solutionCode: "t1 = (1,)\nt2 = (2,)\nprint(t1 + t2)",
        expectedOutput: "(1, 2)",
        hints: ["Usa +", "Crea nuova tupla"],
        explanation: "Le tuple supportano la concatenazione con +.",
        brokenCode: "t1 = (1)\nt2 = (2)\nprint(t1 + t2)",
        debugHint: "Questi sono interi, somma fa 3. Servono virgole per tuple."
      },
      {
        titleTemplate: "Ripetizione Tuple",
        descTemplate: "Ripeti ('a',) 3 volte.",
        starterCode: "t = ('a',)\n",
        solutionCode: "t = ('a',)\nprint(t * 3)",
        expectedOutput: "('a', 'a', 'a')",
        hints: ["operatore *", "t * n"],
        explanation: "L'operatore * ripete gli elementi della tupla.",
        brokenCode: "t = ('a') * 3\nprint(t)",
        debugHint: "Risultato 'aaa' (stringa), manca virgola nella tupla."
      },
      {
        titleTemplate: "Indice elemento",
        descTemplate: "Trova l'indice di 'b' in ('a', 'b', 'c').",
        starterCode: "t = ('a', 'b', 'c')\n",
        solutionCode: "t = ('a', 'b', 'c')\nprint(t.index('b'))",
        expectedOutput: "1",
        hints: [".index(valore)", "Restituisce posizione"],
        explanation: "index funziona come per le liste.",
        brokenCode: "t = ('a', 'b')\nprint(t.find('b'))",
        debugHint: "Le tuple non hanno .find(), usa .index()."
      },
      {
        titleTemplate: "Conta elementi",
        descTemplate: "Conta quanti 2 ci sono in (1, 2, 2).",
        starterCode: "t = (1, 2, 2)\n",
        solutionCode: "t = (1, 2, 2)\nprint(t.count(2))",
        expectedOutput: "2",
        hints: [".count(val)", "Quante volte appare"],
        explanation: "count conta le occorrenze di un valore.",
        brokenCode: "t = (1, 2, 2)\nprint(count(t, 2))",
        debugHint: "count è un metodo: t.count(2)."
      },
      {
        titleTemplate: "In operator",
        descTemplate: "Verifica se 3 è in (1, 2, 3).",
        starterCode: "t = (1, 2, 3)\n",
        solutionCode: "t = (1, 2, 3)\nprint(3 in t)",
        expectedOutput: "True",
        hints: ["Usa 'in'", "3 in t"],
        explanation: "'in' verifica appartenenza.",
        brokenCode: "t = (1, 2, 3)\nprint(t.contains(3))",
        debugHint: "Usa 'in', non contains."
      },
      {
        titleTemplate: "Not in",
        descTemplate: "Verifica che 4 NON sia in (1, 2, 3).",
        starterCode: "t = (1, 2, 3)\n",
        solutionCode: "t = (1, 2, 3)\nprint(4 not in t)",
        expectedOutput: "True",
        hints: ["not in", "Restituisce True se manca"],
        explanation: "'not in' inverte il controllo di appartenenza.",
        brokenCode: "t = (1, 2, 3)\nprint(not 4 in t)",
        debugHint: "Corretto anche così, ma '4 not in t' è più idiomatico."
      },
      {
        titleTemplate: "Iterazione Tuple",
        descTemplate: "Stampa ogni elemento della tupla.",
        starterCode: "t = (1, 2)\n",
        solutionCode: "t = (1, 2)\nfor x in t:\n    print(x)",
        expectedOutput: "1\n2",
        hints: ["for x in t:", "Le tuple sono iterabili"],
        explanation: "Si può iterare su una tupla con for.",
        brokenCode: "t = (1, 2)\nfor i in range(t):\n    print(i)",
        debugHint: "range vuole un intero (len(t)), non la tupla."
      },
      {
        titleTemplate: "List to Tuple",
        descTemplate: "Converti [1, 2] in tupla.",
        starterCode: "l = [1, 2]\n",
        solutionCode: "l = [1, 2]\nprint(tuple(l))",
        expectedOutput: "(1, 2)",
        hints: ["tuple()", "Costruttore"],
        explanation: "tuple() converte lista in tupla.",
        brokenCode: "l = [1, 2]\nprint((l))",
        debugHint: "(l) lascia l come lista tra parentesi. Serve tuple(l)."
      },
      {
        titleTemplate: "Tuple to List",
        descTemplate: "Converti (1, 2) in lista.",
        starterCode: "t = (1, 2)\n",
        solutionCode: "t = (1, 2)\nprint(list(t))",
        expectedOutput: "[1, 2]",
        hints: ["list()", "Costruttore"],
        explanation: "list() converte tupla in lista modificabile.",
        brokenCode: "t = (1, 2)\nprint([t])",
        debugHint: "[t] crea una lista contenente la tupla: [(1, 2)]."
      },
      {
        titleTemplate: "Type Check",
        descTemplate: "Stampa il tipo di (1,).",
        starterCode: "t = (1,)\n",
        solutionCode: "t = (1,)\nprint(type(t))",
        expectedOutput: "<class 'tuple'>",
        hints: ["type()", "Verifica se è tuple"],
        explanation: "type() rivela il tipo di dato.",
        brokenCode: "t = (1)\nprint(type(t))",
        debugHint: "Questo stampa int, manca la virgola."
      },
      {
        titleTemplate: "Min Max Tuple",
        descTemplate: "Trova min e max di (10, 5, 20).",
        starterCode: "t = (10, 5, 20)\n",
        solutionCode: "t = (10, 5, 20)\nprint(min(t))\nprint(max(t))",
        expectedOutput: "5\n20",
        hints: ["min() e max() funzionano su tuple", "Analizzano valori"],
        explanation: "Funzioni built-in agiscono su sequenze.",
        brokenCode: "t.min()",
        debugHint: "Le tuple non hanno metodo .min(), usa min(t)."
      },
      {
        titleTemplate: "Sum Tuple",
        descTemplate: "Somma elementi di (1, 2, 3).",
        starterCode: "t = (1, 2, 3)\n",
        solutionCode: "t = (1, 2, 3)\nprint(sum(t))",
        expectedOutput: "6",
        hints: ["sum()", "Somma totale"],
        explanation: "sum() funziona su qualsiasi iterabile numerico.",
        brokenCode: "sum(1, 2, 3)",
        debugHint: "sum() vuole un iterabile, non argomenti separati: sum((1, 2, 3))."
      },
      {
        titleTemplate: "Sorted Tuple",
        descTemplate: "Ordina (3, 1, 2) (ritorna lista).",
        starterCode: "t = (3, 1, 2)\n",
        solutionCode: "t = (3, 1, 2)\nprint(sorted(t))",
        expectedOutput: "[1, 2, 3]",
        hints: ["sorted() accetta tupla", "Restituisce SEMPRE lista"],
        explanation: "Le tuple non hanno .sort() in-place, usa sorted().",
        brokenCode: "t.sort()",
        debugHint: "AttributeError: tuple has no attribute 'sort'."
      },
      {
        titleTemplate: "Confronto Tuple",
        descTemplate: "Verifica se (1, 2) < (1, 3).",
        starterCode: "t1 = (1, 2)\nt2 = (1, 3)\n",
        solutionCode: "t1 = (1, 2)\nt2 = (1, 3)\nprint(t1 < t2)",
        expectedOutput: "True",
        hints: ["Confronto lessicografico", "Elemento per elemento"],
        explanation: "Python confronta le tuple elemento per elemento.",
        brokenCode: "t1 = (1, 2)\nt2 = (1, '3')\nprint(t1 < t2)",
        debugHint: "TypeError se i tipi non sono confrontabili (int vs str)."
      },
      {
        titleTemplate: "Nested Access Tuple",
        descTemplate: "Accedi a 'X' in ((1, 2), ('X', 'Y')).",
        starterCode: "t = ((1, 2), ('X', 'Y'))\n",
        solutionCode: "t = ((1, 2), ('X', 'Y'))\nprint(t[1][0])",
        expectedOutput: "X",
        hints: ["t[1] è ('X', 'Y')", "Poi [0] è 'X'"],
        explanation: "Accesso multidimensionale funziona come liste.",
        brokenCode: "t[1, 0]",
        debugHint: "Sintassi numpy errata in Python standard. Usa t[1][0]."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Tuple unpacking",
        descTemplate: "Estrai i tre valori dalla tupla in variabili separate.",
        starterCode: "punto = (10, 20, 30)\n",
        solutionCode: "punto = (10, 20, 30)\nx, y, z = punto\nprint(x)\nprint(y)\nprint(z)",
        expectedOutput: "10\n20\n30",
        hints: ["a, b, c = tupla assegna i valori", "Il numero di variabili deve corrispondere"],
        explanation: "L'unpacking assegna ogni elemento a una variabile.",
        brokenCode: "punto = (10, 20, 30)\nx, y = punto\nprint(x, y)",
        debugHint: "Servono 3 variabili per una tupla di 3 elementi."
      },
      {
        titleTemplate: "Tupla come ritorno",
        descTemplate: "Crea una tupla coordinate e stampala.",
        starterCode: "x = 5\ny = 10\n",
        solutionCode: "x = 5\ny = 10\ncoords = (x, y)\nprint(coords)",
        expectedOutput: "(5, 10)",
        hints: ["(a, b) crea una tupla", "Utile per ritornare più valori"],
        explanation: "Le tuple sono perfette per raggruppare valori correlati.",
        brokenCode: "x = 5\ny = 10\ncoords = x, y\nprint(coords)",
        debugHint: "Funziona anche senza (), ma è meno leggibile."
      },
      {
        titleTemplate: "Slicing tupla",
        descTemplate: "Estrai i primi due elementi della tupla.",
        starterCode: "numeri = (1, 2, 3, 4, 5)\n",
        solutionCode: "numeri = (1, 2, 3, 4, 5)\nprint(numeri[:2])",
        expectedOutput: "(1, 2)",
        hints: ["[:2] prende indici 0 e 1", "Lo slicing funziona come per le liste"],
        explanation: "Lo slicing di una tupla restituisce una tupla.",
        brokenCode: "numeri = (1, 2, 3, 4, 5)\nprint(numeri[2])",
        debugHint: "numeri[2] è un singolo elemento, usa [:2] per slice."
      },
      {
        titleTemplate: "Swap Variables",
        descTemplate: "Scambia valori di a e b usando tuple packing.",
        starterCode: "a = 1\nb = 2\n",
        solutionCode: "a = 1\nb = 2\na, b = b, a\nprint(a, b)",
        expectedOutput: "2 1",
        hints: ["a, b = b, a", "Pack e Unpack implicito"],
        explanation: "Idiom Pythonico per scambiare variabili senza temp.",
        brokenCode: "a = b\nb = a",
        debugHint: "Così b diventa a, ma a era già diventato b. Perdi il vecchio a."
      },
      {
        titleTemplate: "Ignored Value",
        descTemplate: "Ignora il secondo valore (1, 2, 3) usando _.",
        starterCode: "t = (1, 2, 3)\n",
        solutionCode: "t = (1, 2, 3)\na, _, c = t\nprint(a, c)",
        expectedOutput: "1 3",
        hints: ["_ è variabile 'dummy'", "Usa per valori non necessari"],
        explanation: "_ convenzionalmente indica variabile ignorata.",
        brokenCode: "a, c = t",
        debugHint: "ValueError: too many values (3) to unpack (2)."
      },
      {
        titleTemplate: "Nested Unpacking",
        descTemplate: "Estrai x da (1, (2, 3)).",
        starterCode: "t = (1, (2, 3))\n# a, (x, y) = t\n",
        solutionCode: "t = (1, (2, 3))\na, (x, y) = t\nprint(x)",
        expectedOutput: "2",
        hints: ["Struttura variabile deve specchiare tupla", "(x, y) annidato"],
        explanation: "Unpacking supporta strutture annidate.",
        brokenCode: "a, x, y = t",
        debugHint: "t ha 2 elementi (int, tuple), non 3 flat."
      },
      {
        titleTemplate: "Zip to Tuple",
        descTemplate: "Crea tupla di coppie da [1] e ['a'].",
        starterCode: "n = [1]\nl = ['a']\n",
        solutionCode: "n = [1]\nl = ['a']\nprint(tuple(zip(n, l)))",
        expectedOutput: "((1, 'a'),)",
        hints: ["zip crea iteratore", "tuple() converte in tupla"],
        explanation: "Utile per convertire zip in struttura statica.",
        brokenCode: "print(zip(n, l))",
        debugHint: "Stampa oggetto zip, serve tuple()."
      },
      {
        titleTemplate: "Enumerate to Tuple",
        descTemplate: "Crea tupla di (indice, val) da 'ab'.",
        starterCode: "s = 'ab'\n",
        solutionCode: "s = 'ab'\nprint(tuple(enumerate(s)))",
        expectedOutput: "((0, 'a'), (1, 'b'))",
        hints: ["enumerate restituisce coppie", "tuple() le raccoglie"],
        explanation: "Salva lo stato dell'enumerazione.",
        brokenCode: "enumerate(s)",
        debugHint: "Stampa oggetto enumerate."
      },
      {
        titleTemplate: "Tuple Index Range",
        descTemplate: "Trova indice di 1 cercando dopo indice 1 in (1, 2, 1).",
        starterCode: "t = (1, 2, 1)\n",
        solutionCode: "t = (1, 2, 1)\nprint(t.index(1, 1))",
        expectedOutput: "2",
        hints: ["index(val, start)", "Salta il primo 1"],
        explanation: "index supporta start point.",
        brokenCode: "t.index(1)",
        debugHint: "Trova il primo (indice 0)."
      },
      {
        titleTemplate: "Count vs Len",
        descTemplate: "Stampa len(t) e t.count(1) per (1, 1, 2).",
        starterCode: "t = (1, 1, 2)\n",
        solutionCode: "t = (1, 1, 2)\nprint(len(t))\nprint(t.count(1))",
        expectedOutput: "3\n2",
        hints: ["len è totale elementi", "count è occorrenze di valore"],
        explanation: "Differenza tra lunghezza totale e conteggio specifico.",
        brokenCode: "t.len()",
        debugHint: "len() è funzione, non metodo."
      },
      {
        titleTemplate: "Return Tuple",
        descTemplate: "Funzione che ritorna 1, 2 (tupla implicita).",
        starterCode: "def get_nums():\n    return 1, 2\n",
        solutionCode: "def get_nums():\n    return 1, 2\nprint(type(get_nums()))",
        expectedOutput: "<class 'tuple'>",
        hints: ["return a, b crea tupla", "Non servono ()"],
        explanation: "Python impacchetta ritorni multipli in tupla.",
        brokenCode: "eturn [1, 2]",
        debugHint: "Questo ritorna una lista esplicita."
      },
      {
        titleTemplate: "NamedTuple Intro",
        descTemplate: "Crea Point(x=1, y=2) usando namedtuple.",
        starterCode: "from collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])\n# p = Point(1, 2)\n",
        solutionCode: "from collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])\np = Point(1, 2)\nprint(p.x, p.y)",
        expectedOutput: "1 2",
        hints: ["Accesso per nome p.x", "Più leggibile di p[0]"],
        explanation: "namedtuple dà nomi ai campi della tupla.",
        brokenCode: "p = (1, 2)\nprint(p.x)",
        debugHint: "Tuple standard non ha attributo .x"
      },
      {
        titleTemplate: "Slicing Defaults",
        descTemplate: "Copia tupla con slicing [:]",
        starterCode: "t = (1, 2)\n",
        solutionCode: "t = (1, 2)\nprint(t[:])",
        expectedOutput: "(1, 2)",
        hints: ["[:] prende tutto", "Tupla è immutabile, copia è se stessa (spesso)"],
        explanation: "Slicing completo.",
        brokenCode: "t[]",
        debugHint: "Sintassi errata, serve [:]"
      },
      {
        titleTemplate: "Slicing Step Tuple",
        descTemplate: "Inverti tupla (1, 2, 3) con step -1.",
        starterCode: "t = (1, 2, 3)\n",
        solutionCode: "t = (1, 2, 3)\nprint(t[::-1])",
        expectedOutput: "(3, 2, 1)",
        hints: ["Step -1 inverte", "Ritorna nuova tupla"],
        explanation: "Funziona come per le liste.",
        brokenCode: "t.reverse()",
        debugHint: "Tuple non ha reverse() (in-place)."
      },
      {
        titleTemplate: "Slicing Range",
        descTemplate: "Prendi da indice 1 a 3 (escluso) di (0,1,2,3).",
        starterCode: "t = (0, 1, 2, 3)\n",
        solutionCode: "t = (0, 1, 2, 3)\nprint(t[1:3])",
        expectedOutput: "(1, 2)",
        hints: ["Start 1", "Stop 3"],
        explanation: "Estrae sotto-tupla.",
        brokenCode: "t(1:3)",
        debugHint: "Slicing usa [], non ()."
      },
      {
        titleTemplate: "Hash Tuple",
        descTemplate: "Stampa hash di (1, 2).",
        starterCode: "t = (1, 2)\n",
        solutionCode: "t = (1, 2)\nprint(isinstance(hash(t), int))",
        expectedOutput: "True",
        hints: ["Le tuple sono hashable", "hash() ritorna int"],
        explanation: "Essendo immutabili, le tuple hanno un hash fisso.",
        brokenCode: "hash([1, 2])",
        debugHint: "Liste non hashable -> TypeError."
      },
      {
        titleTemplate: "Sizeof Tuple",
        descTemplate: "Tuple occupa meno RAM di List? Stampa True.",
        starterCode: "import sys\n",
        solutionCode: "import sys\nprint(sys.getsizeof((1,2)) < sys.getsizeof([1,2]))",
        expectedOutput: "True",
        hints: ["sys.getsizeof", "Tuple ottimizzate"],
        explanation: "Tuple più leggere delle liste.",
        brokenCode: "False",
        debugHint: "Dovrebbe essere True."
      },
      {
        titleTemplate: "Tuple Constructor",
        descTemplate: "Crea tupla da stringa 'ab'.",
        starterCode: "",
        solutionCode: "print(tuple('ab'))",
        expectedOutput: "('a', 'b')",
        hints: ["Itera caratteri", "Crea tupla"],
        explanation: "Costruttore converte iterabile.",
        brokenCode: "('ab')",
        debugHint: "Crea stringa ('ab')."
      },
      {
        titleTemplate: "Gen Exp to Tuple",
        descTemplate: "Crea tupla quadrati (0, 1, 4) da range(3).",
        starterCode: "",
        solutionCode: "print(tuple(x**2 for x in range(3)))",
        expectedOutput: "(0, 1, 4)",
        hints: ["Generator expression", "Passa a tuple()"],
        explanation: "Efficiente per grandi sequenze.",
        brokenCode: "(x**2 for x in range(3))",
        debugHint: "Questo crea un oggetto generatore. Serve tuple(...)."
      },
      {
        titleTemplate: "Try Change Tuple",
        descTemplate: "Prova a cambiare elemento 0, cattura TypeError.",
        starterCode: "t = (1, 2)\n# try t[0]=0 except TypeError\n",
        solutionCode: "t = (1, 2)\ntry:\n    t[0] = 0\nexcept TypeError:\n    print('Non modificabile')",
        expectedOutput: "Non modificabile",
        hints: ["Immutabile", "Genera errore"],
        explanation: "Dimostrazione immutabilità.",
        brokenCode: "t[0] = 0",
        debugHint: "Crash senza try-except."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Tupla con * unpacking",
        descTemplate: "Usa * per catturare elementi centrali.",
        starterCode: "numeri = (1, 2, 3, 4, 5)\n",
        solutionCode: "numeri = (1, 2, 3, 4, 5)\nprimo, *resto, ultimo = numeri\nprint(primo)\nprint(resto)\nprint(ultimo)",
        expectedOutput: "1\n[2, 3, 4]\n5",
        hints: ["*var cattura elementi multipli in lista", "Funziona con tuple e liste"],
        explanation: "L'operatore * cattura più elementi in una lista.",
        brokenCode: "numeri = (1, 2, 3, 4, 5)\nprimo, resto, ultimo = numeri",
        debugHint: "Senza * non puoi catturare più elementi."
      },
      {
        titleTemplate: "Tupla immutabile",
        descTemplate: "Dimostra che le tuple sono immutabili stampando un errore.",
        starterCode: "t = (1, 2, 3)\ntry:\n    t[0] = 10\nexcept TypeError as e:\n    print('Errore: tupla immutabile')\n",
        solutionCode: "t = (1, 2, 3)\ntry:\n    t[0] = 10\nexcept TypeError as e:\n    print('Errore: tupla immutabile')",
        expectedOutput: "Errore: tupla immutabile",
        hints: ["Le tuple non supportano assegnazione", "Usa try/except per catturare l'errore"],
        explanation: "Le tuple sono immutabili: non puoi modificarle.",
        brokenCode: "t = (1, 2, 3)\nt[0] = 10\nprint(t)",
        debugHint: "Questo solleva TypeError perché le tuple sono immutabili."
      },
      {
        titleTemplate: "Tupla in dizionario",
        descTemplate: "Usa una tupla come chiave di dizionario.",
        starterCode: "",
        solutionCode: "posizioni = {}\nposizioni[(0, 0)] = 'origine'\nposizioni[(1, 2)] = 'punto A'\nprint(posizioni[(0, 0)])",
        expectedOutput: "origine",
        hints: ["Le tuple sono hashable", "Le liste NON possono essere chiavi"],
        explanation: "Le tuple possono essere chiavi di dizionario perché immutabili.",
        brokenCode: "posizioni = {}\nposizioni[[0, 0]] = 'origine'\nprint(posizioni[[0, 0]])",
        debugHint: "Le liste non sono hashable, usa tuple come chiavi."
      },
      {
        titleTemplate: "Star Unpacking Head",
        descTemplate: "Estrai *head e tail da (1, 2, 3).",
        starterCode: "t = (1, 2, 3)\n",
        solutionCode: "t = (1, 2, 3)\n*head, tail = t\nprint(head)\nprint(tail)",
        expectedOutput: "[1, 2]\n3",
        hints: ["* cattura tutto tranne l'ultimo", "head sarà lista"],
        explanation: "Extended iterable unpacking (Python 3).",
        brokenCode: "head, tail = t",
        debugHint: "Too many values to unpack (3->2)."
      },
      {
        titleTemplate: "Star Unpacking Middle",
        descTemplate: "Estrai head, *mid, tail da (1, 2, 3, 4).",
        starterCode: "t = (1, 2, 3, 4)\n",
        solutionCode: "t = (1, 2, 3, 4)\nh, *m, t_val = t\nprint(m)",
        expectedOutput: "[2, 3]",
        hints: ["*mid cattura centro", "h e t_val prendono estremi"],
        explanation: "Unpacking flessibile.",
        brokenCode: "*mid = t",
        debugHint: "SyntaxError: starred assignment target must be in a list or tuple usage context (es. *m, = t)."
      },
      {
        titleTemplate: "Args Unpacking",
        descTemplate: "Passa tupla (1, 2) a func(a, b) con *.",
        starterCode: "def f(a, b): print(a+b)\nt = (1, 2)\n",
        solutionCode: "def f(a, b): print(a+b)\nt = (1, 2)\nf(*t)",
        expectedOutput: "3",
        hints: ["*t esplode tupla in argomenti", "f(1, 2)"],
        explanation: "Unpacking argomento funzione.",
        brokenCode: "f(t)",
        debugHint: "f() mancano argomenti (passi 1 tupla invece di 2 interi)."
      },
      {
        titleTemplate: "Empty Tuple Size",
        descTemplate: "Confronta size di () e [].",
        starterCode: "import sys\n",
        solutionCode: "import sys\nprint(sys.getsizeof(()) < sys.getsizeof([]))",
        expectedOutput: "True",
        hints: ["Tuple vuota è minuscola", "Lista ha overhead"],
        explanation: "Tuple ottimizzate per spazio.",
        brokenCode: "False",
        debugHint: "Dovrebbe essere True."
      },
      {
        titleTemplate: "Tuple in Set",
        descTemplate: "Aggiungi (1, 2) a un set.",
        starterCode: "s = set()\n",
        solutionCode: "s = set()\ns.add((1, 2))\nprint(s)",
        expectedOutput: "{(1, 2)}",
        hints: ["Tuple è hashable -> ok in set", "Lista no"],
        explanation: "Set accetta solo elementi hashable/immutabili.",
        brokenCode: "s.add([1, 2])",
        debugHint: "TypeError: unhashable type: 'list'."
      },
      {
        titleTemplate: "Sort List Tuples",
        descTemplate: "Ordina [(1, 3), (1, 2)] per secondo elemento.",
        starterCode: "l = [(1, 3), (1, 2)]\n# key=lambda x: x[1]\n",
        solutionCode: "l = [(1, 3), (1, 2)]\nl.sort(key=lambda x: x[1])\nprint(l)",
        expectedOutput: "[(1, 2), (1, 3)]",
        hints: ["lambda x: x[1]", "ordina per secondo valore"],
        explanation: "Ordinamento custom di tuple.",
        brokenCode: "l.sort()",
        debugHint: "Ordina per primo elemento (1, 2) viene dopo (1, 3)? No, (1,2)<(1,3). Default order ok qui, ma key forzato per sicurezza."
      },
      {
        titleTemplate: "Deepcopy Tuple",
        descTemplate: "Deepcopy di tupla di interi restituisce lo stesso oggetto (ottimizzazione).",
        starterCode: "import copy\nt = (1, 2)\n",
        solutionCode: "import copy\nt = (1, 2)\nprint(t is copy.deepcopy(t))",
        expectedOutput: "True",
        hints: ["Essendo immutabile, non serve copiarla", "Python ottimizza"],
        explanation: "Copia di immutabile può restituire l'originale.",
        brokenCode: "False",
        debugHint: "In Python CPython è True."
      },
      {
        titleTemplate: "Singleton Optimization",
        descTemplate: "Verifica se tuple() is tuple().",
        starterCode: "",
        solutionCode: "print(tuple() is tuple())",
        expectedOutput: "True",
        hints: ["Empty tuple è singleton", "Stesso oggetto in memoria"],
        explanation: "Ottimizzazione memoria.",
        brokenCode: "[] is []",
        debugHint: "Per le liste è False."
      },
      {
        titleTemplate: "Modify Workaround",
        descTemplate: "Aggiungi 3 a (1, 2) convertendo in lista.",
        starterCode: "t = (1, 2)\n",
        solutionCode: "t = (1, 2)\nl = list(t)\nl.append(3)\nt = tuple(l)\nprint(t)",
        expectedOutput: "(1, 2, 3)",
        hints: ["Converti, modifica, riconverti", "Workaround immutabilità"],
        explanation: "Standard way to 'modify' tuples.",
        brokenCode: "t += (3)",
        debugHint: "Funziona se scrivi t += (3,) (nuova tupla), ma qui volevamo conversione esplicita."
      },
      {
        titleTemplate: "Tuple Comparison",
        descTemplate: "Ordina (1, 20) vs (2, 1).",
        starterCode: "",
        solutionCode: "print((1, 20) < (2, 1))",
        expectedOutput: "True",
        hints: ["1 < 2, basta il primo elemento", "Il secondo non conta"],
        explanation: "Confronto short-circuit.",
        brokenCode: "False",
        debugHint: "True."
      },
      {
        titleTemplate: "Contains Perf",
        descTemplate: "Misura tempo 'in' tuple vs list (concettuale).",
        starterCode: "",
        solutionCode: "print('Tuple OK')",
        expectedOutput: "Tuple OK",
        hints: ["Tuple leggermente più veloce", "Meno overhead"],
        explanation: "Tuple più veloci in iterazione e lookup.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Tuple Comprehension",
        descTemplate: "Non esiste! Crea generatore.",
        starterCode: "g = (x for x in range(3))\n",
        solutionCode: "g = (x for x in range(3))\nprint(type(g))",
        expectedOutput: "<class 'generator'>",
        hints: ["() crea generatore, non tupla", "Serve tuple()"],
        explanation: "Le parentesi tonde in comprehension creano generatori.",
        brokenCode: "type(tuple)",
        debugHint: ""
      },
      {
        titleTemplate: "Unpack Error",
        descTemplate: "Gestisci ValueError su unpacking errato.",
        starterCode: "t = (1,)\n# try a,b = t\n",
        solutionCode: "t = (1,)\ntry:\n    a, b = t\nexcept ValueError:\n    print('Errore')",
        expectedOutput: "Errore",
        hints: ["Unpacking richiede numero esatto", "ValueError"],
        explanation: "Errore comune.",
        brokenCode: "a, b = t",
        debugHint: "Crash."
      },
      {
        titleTemplate: "Lexicographical Sort",
        descTemplate: "Quale viene prima? (1, 1) o (1, 0, 100).",
        starterCode: "",
        solutionCode: "print((1, 0, 100) < (1, 1))",
        expectedOutput: "True",
        hints: ["1==1, 0<1", "Lunghezza conta solo se prefisso uguale"],
        explanation: "Confronto lessicografico.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Mutable inside Tuple",
        descTemplate: "Modifica lista dentro tupla (es. ([1],)).",
        starterCode: "t = ([1],)\n",
        solutionCode: "t = ([1],)\nt[0].append(2)\nprint(t)",
        expectedOutput: "([1, 2],)",
        hints: ["La tupla è immutabile", "Ma gli elementi possono essere mutabili"],
        explanation: "Contenitore immutabile di oggetti mutabili.",
        brokenCode: "t[0] = [1, 2]",
        debugHint: "TypeError: assegnazione vietata, modifica in-place ok."
      },
      {
        titleTemplate: "Timeit Create",
        descTemplate: "Più veloce creare [1,2] o (1,2)?",
        starterCode: "",
        solutionCode: "print('Tuple')",
        expectedOutput: "Tuple",
        hints: ["Costante bytecode per tuple", "Allocazione statica"],
        explanation: "Tuple letterali sono costanti nel bytecode.",
        brokenCode: "",
        debugHint: ""
      }
    ],
  },

  // ==================== SETS ====================
  [PythonTopicId.Sets]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Creare un set",
        descTemplate: "Crea un set con i numeri 1, 2, 3.",
        starterCode: "",
        solutionCode: "numeri = {1, 2, 3}\nprint(sorted(numeri))",
        expectedOutput: "[1, 2, 3]",
        hints: ["Usa le parentesi graffe {}", "I set non hanno duplicati"],
        explanation: "I set si creano con {} o set().",
        brokenCode: "numeri = [1, 2, 3]\nprint(numeri)",
        debugHint: "[] crea una lista, {} crea un set."
      },
      {
        titleTemplate: "Set elimina duplicati",
        descTemplate: "Crea un set da una lista con duplicati.",
        starterCode: "lista = [1, 2, 2, 3, 3, 3]\n",
        solutionCode: "lista = [1, 2, 2, 3, 3, 3]\ns = set(lista)\nprint(sorted(s))",
        expectedOutput: "[1, 2, 3]",
        hints: ["set() converte in set", "I duplicati vengono eliminati"],
        explanation: "I set contengono solo valori unici.",
        brokenCode: "lista = [1, 2, 2, 3, 3, 3]\ns = {lista}\nprint(s)",
        debugHint: "Non puoi mettere una lista in un set, usa set(lista)."
      },
      {
        titleTemplate: "Aggiungere a set",
        descTemplate: "Aggiungi il numero 4 al set.",
        starterCode: "numeri = {1, 2, 3}\n",
        solutionCode: "numeri = {1, 2, 3}\nnumeri.add(4)\nprint(sorted(numeri))",
        expectedOutput: "[1, 2, 3, 4]",
        hints: ["add() aggiunge un elemento", "Non append() come le liste"],
        explanation: "I set usano add(), non append().",
        brokenCode: "numeri = {1, 2, 3}\nnumeri.append(4)\nprint(numeri)",
        debugHint: "I set non hanno append(), usa add()."
      },
      {
        titleTemplate: "Check presenza",
        descTemplate: "Verifica se 1 è nel set {1, 2}.",
        starterCode: "s = {1, 2}\n",
        solutionCode: "s = {1, 2}\nprint(1 in s)",
        expectedOutput: "True",
        hints: ["Usa 'in'", "Ricerca è molto veloce (O(1))"],
        explanation: "Set è ottimizzato per controlli di appartenenza.",
        brokenCode: "s.contains(1)",
        debugHint: "Usa 'in', non contains."
      },
      {
        titleTemplate: "Check assenza",
        descTemplate: "Verifica se 3 NON è nel set {1, 2}.",
        starterCode: "s = {1, 2}\n",
        solutionCode: "s = {1, 2}\nprint(3 not in s)",
        expectedOutput: "True",
        hints: ["not in", "True se manca"],
        explanation: "Operatore inverso di in.",
        brokenCode: "not (3 in s)",
        debugHint: "Corretto, ma '3 not in s' è preferibile."
      },
      {
        titleTemplate: "Remove Element",
        descTemplate: "Rimuovi 1 dal set {1, 2} (sicuro che c'è).",
        starterCode: "s = {1, 2}\n",
        solutionCode: "s = {1, 2}\ns.remove(1)\nprint(sorted(s))",
        expectedOutput: "[2]",
        hints: ["remove()", "Modifica in-place"],
        explanation: "remove toglie l'elemento o dà errore se manca.",
        brokenCode: "s.delete(1)",
        debugHint: "Non esiste delete, usa remove."
      },
      {
        titleTemplate: "Pop Random",
        descTemplate: "Rimuovi un elemento a caso con pop().",
        starterCode: "s = {1}\n",
        solutionCode: "s = {1}\nprint(s.pop())",
        expectedOutput: "1",
        hints: ["pop() rimuove e restituisce", "Non accetta argomenti"],
        explanation: "I set non sono ordinati, pop rimuove un elemento arbitrario.",
        brokenCode: "s.pop(0)",
        debugHint: "pop() di set non accetta indice."
      },
      {
        titleTemplate: "Clear Set",
        descTemplate: "Svuota il set {1, 2}.",
        starterCode: "s = {1, 2}\n",
        solutionCode: "s = {1, 2}\ns.clear()\nprint(s)",
        expectedOutput: "set()",
        hints: ["clear() rimuove tutto", "Diventa set vuoto"],
        explanation: "clear() svuota il set in-place.",
        brokenCode: "s = {}",
        debugHint: "Questo crea un nuovo DIZIONARIO vuoto, non svuota il set."
      },
      {
        titleTemplate: "Copy Set",
        descTemplate: "Crea una copia di {1, 2}.",
        starterCode: "s = {1, 2}\n",
        solutionCode: "s = {1, 2}\nc = s.copy()\nprint(sorted(c))",
        expectedOutput: "[1, 2]",
        hints: ["copy() crea shallow copy", "Nuovo oggetto set"],
        explanation: "Utile per modificare copia senza toccare originale.",
        brokenCode: "c = s",
        debugHint: "Senza copy(), c è solo un riferimento allo stesso set."
      },
      {
        titleTemplate: "Set Length",
        descTemplate: "Conta elementi in {1, 2, 3}.",
        starterCode: "s = {1, 2, 3}\n",
        solutionCode: "s = {1, 2, 3}\nprint(len(s))",
        expectedOutput: "3",
        hints: ["len(s)", "Numero elementi unici"],
        explanation: "len() restituisce la cardinalità del set.",
        brokenCode: "s.size()",
        debugHint: "Usa len(s)."
      },
      {
        titleTemplate: "Set from String",
        descTemplate: "Crea set caratteri unici da 'aba'.",
        starterCode: "text = 'aba'\n",
        solutionCode: "text = 'aba'\nprint(len(set(text)))",
        expectedOutput: "2",
        hints: ["set('aba') -> {'a', 'b'}", "Conta unici"],
        explanation: "Modo veloce per trovare caratteri unici.",
        brokenCode: "{text}",
        debugHint: "Crea {'aba'}, serve set(text)."
      },
      {
        titleTemplate: "Set from Tuple",
        descTemplate: "Crea set da (1, 1, 2).",
        starterCode: "t = (1, 1, 2)\n",
        solutionCode: "t = (1, 1, 2)\nprint(sorted(set(t)))",
        expectedOutput: "[1, 2]",
        hints: ["Elimina duplicati", "Conversione"],
        explanation: "set() accetta qualsiasi iterabile.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Update Set",
        descTemplate: "Aggiungi [3, 4] a {1, 2} usando update.",
        starterCode: "s = {1, 2}\n",
        solutionCode: "s = {1, 2}\ns.update([3, 4])\nprint(len(s))",
        expectedOutput: "4",
        hints: ["update() aggiunge più elementi", "Accetta iterabile"],
        explanation: "add() per singolo, update() per molti.",
        brokenCode: "s.add([3, 4])",
        debugHint: "TypeError: list non hashable. Usa update."
      },
      {
        titleTemplate: "Iterate Set",
        descTemplate: "Itera su {1} e stampa.",
        starterCode: "s = {1}\n",
        solutionCode: "s = {1}\nfor x in s:\n    print(x)",
        expectedOutput: "1",
        hints: ["for x in s:", "Ordine non garantito"],
        explanation: "Si può iterare sui set.",
        brokenCode: "s[0]",
        debugHint: "Set non supporta indicizzazione."
      },
      {
        titleTemplate: "Empty Set Syntax",
        descTemplate: "Crea set vuoto e stampa type.",
        starterCode: "# s = ...\n",
        solutionCode: "s = set()\nprint(type(s))",
        expectedOutput: "<class 'set'>",
        hints: ["Usa set()", "{} è dict"],
        explanation: "{} crea un dizionario vuoto, per un set vuoto serve set().",
        brokenCode: "s = {}\nprint(type(s))",
        debugHint: "Stampa <class 'dict'>."
      },
      {
        titleTemplate: "Set Equality",
        descTemplate: "Verifica se {1, 2} == {2, 1}.",
        starterCode: "s1 = {1, 2}\ns2 = {2, 1}\n# ==\n",
        solutionCode: "s1 = {1, 2}\ns2 = {2, 1}\nprint(s1 == s2)",
        expectedOutput: "True",
        hints: ["Ordine non conta", "Contano gli elementi"],
        explanation: "Due set sono uguali se hanno gli stessi elementi.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Difference Operator",
        descTemplate: "Usa - per trovare diff tra {1, 2} e {2}.",
        starterCode: "s1 = {1, 2}\ns2 = {2}\n",
        solutionCode: "s1 = {1, 2}\ns2 = {2}\nprint(sorted(s1 - s2))",
        expectedOutput: "[1]",
        hints: ["- sottrae elementi", "Equivale a difference()"],
        explanation: "Operatore comodo per differenza.",
        brokenCode: "s1.sub(s2)",
        debugHint: "Non esiste .sub(), usa - o .difference()."
      },
      {
        titleTemplate: "Union Operator",
        descTemplate: "Usa | per unire {1} e {2}.",
        starterCode: "s1 = {1}\ns2 = {2}\n",
        solutionCode: "s1 = {1}\ns2 = {2}\nprint(sorted(s1 | s2))",
        expectedOutput: "[1, 2]",
        hints: ["| (pipe) unisce", "Equivale a union()"],
        explanation: "Operatore bitwise OR usato per unione logica.",
        brokenCode: "s1 + s2",
        debugHint: "Set non supporta +, usa |."
      },
      {
        titleTemplate: "Intersection Operator",
        descTemplate: "Usa & per intersecare {1, 2} e {2, 3}.",
        starterCode: "s1 = {1, 2}\ns2 = {2, 3}\n",
        solutionCode: "s1 = {1, 2}\ns2 = {2, 3}\nprint(sorted(s1 & s2))",
        expectedOutput: "[2]",
        hints: ["& (ampersand)", "Equivale a intersection()"],
        explanation: "Operatore bitwise AND usato per intersezione.",
        brokenCode: "s1 and s2",
        debugHint: "and è logico booleano, non intersezione di set."
      },
      {
        titleTemplate: "Symmetric Diff Op",
        descTemplate: "Usa ^ per diff simmetrica {1, 2} ^ {2, 3}.",
        starterCode: "s1 = {1, 2}\ns2 = {2, 3}\n",
        solutionCode: "s1 = {1, 2}\ns2 = {2, 3}\nprint(sorted(s1 ^ s2))",
        expectedOutput: "[1, 3]",
        hints: ["^ (xor)", "Elementi non comuni"],
        explanation: "Restituisce elementi in uno o nell'altro, ma non in entrambi.",
        brokenCode: "s1 xor s2",
        debugHint: "xor non è parola chiave, usa ^."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Unione di set",
        descTemplate: "Unisci due set e stampa il risultato.",
        starterCode: "a = {1, 2, 3}\nb = {3, 4, 5}\n",
        solutionCode: "a = {1, 2, 3}\nb = {3, 4, 5}\nprint(sorted(a.union(b)))",
        expectedOutput: "[1, 2, 3, 4, 5]",
        hints: ["union() combina i set", "I duplicati vengono rimossi"],
        explanation: "union() restituisce tutti gli elementi unici di entrambi.",
        brokenCode: "a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a + b)",
        debugHint: "I set non supportano +, usa union() o |."
      },
      {
        titleTemplate: "Intersezione",
        descTemplate: "Trova gli elementi comuni a entrambi i set.",
        starterCode: "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n",
        solutionCode: "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(sorted(a.intersection(b)))",
        expectedOutput: "[3, 4]",
        hints: ["intersection() trova elementi comuni", "Oppure usa &"],
        explanation: "intersection() restituisce elementi presenti in entrambi.",
        brokenCode: "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a and b)",
        debugHint: "'and' è operatore booleano, usa intersection() o &."
      },
      {
        titleTemplate: "Differenza",
        descTemplate: "Trova elementi in a ma non in b.",
        starterCode: "a = {1, 2, 3, 4}\nb = {3, 4, 5}\n",
        solutionCode: "a = {1, 2, 3, 4}\nb = {3, 4, 5}\nprint(sorted(a.difference(b)))",
        expectedOutput: "[1, 2]",
        hints: ["difference() trova elementi solo in a", "Oppure usa -"],
        explanation: "difference() restituisce elementi di a non in b.",
        brokenCode: "a = {1, 2, 3, 4}\nb = {3, 4, 5}\nprint(a - b)",
        debugHint: "Questo funziona! a - b è equivalente a a.difference(b)."
      },
      {
        titleTemplate: "Rimuovere da set",
        descTemplate: "Rimuovi il numero 2 dal set.",
        starterCode: "numeri = {1, 2, 3}\n",
        solutionCode: "numeri = {1, 2, 3}\nnumeri.discard(2)\nprint(sorted(numeri))",
        expectedOutput: "[1, 3]",
        hints: ["discard() rimuove senza errore", "remove() solleva errore se non esiste"],
        explanation: "discard() è più sicuro di remove().",
        brokenCode: "numeri = {1, 2, 3}\nnumeri.remove(5)\nprint(numeri)",
        debugHint: "remove() solleva KeyError se l'elemento non esiste."
      },
      {
        titleTemplate: "Symmetric Difference",
        descTemplate: "Usa symmetric_difference() tra {1, 2} e {2, 3}.",
        starterCode: "a = {1, 2}\nb = {2, 3}\n",
        solutionCode: "a = {1, 2}\nb = {2, 3}\nprint(sorted(a.symmetric_difference(b)))",
        expectedOutput: "[1, 3]",
        hints: ["Elementi unici di a uniti a unici di b", "Oppure a ^ b"],
        explanation: "Tutto tranne l'intersezione.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Is Disjoint",
        descTemplate: "Verifica se {1, 2} e {3, 4} sono disgiunti.",
        starterCode: "a = {1, 2}\nb = {3, 4}\n",
        solutionCode: "a = {1, 2}\nb = {3, 4}\nprint(a.isdisjoint(b))",
        expectedOutput: "True",
        hints: ["isdisjoint()", "True se intersezione vuota"],
        explanation: "Set disgiunti non hanno elementi in comune.",
        brokenCode: "not (a & b)",
        debugHint: "Funziona (set vuoto è False), ma isdisjoint() è più leggibile."
      },
      {
        titleTemplate: "Is Superset",
        descTemplate: "Verifica se {1, 2, 3} contiene {1, 2}.",
        starterCode: "a = {1, 2, 3}\nb = {1, 2}\n",
        solutionCode: "a = {1, 2, 3}\nb = {1, 2}\nprint(a.issuperset(b))",
        expectedOutput: "True",
        hints: ["issuperset()", "Oppure a >= b"],
        explanation: "Controlla se a contiene tutti gli elementi di b.",
        brokenCode: "a > b",
        debugHint: "Corretto (superset stretto), ma >= o issuperset include uguaglianza."
      },
      {
        titleTemplate: "Update |= operator",
        descTemplate: "Aggiorna set a unendo b in-place con |=.",
        starterCode: "a = {1}\nb = {2}\n# a |= b\n",
        solutionCode: "a = {1}\nb = {2}\na |= b\nprint(sorted(a))",
        expectedOutput: "[1, 2]",
        hints: ["|= aggiorna", "Equivale a update()"],
        explanation: "Operatore di assegnazione aumentata per unione.",
        brokenCode: "a = a | b",
        debugHint: "Funziona, ma crea nuovo set. |= modifica in-place."
      },
      {
        titleTemplate: "Intersection Update &=",
        descTemplate: "Mantieni solo elementi comuni con &=.",
        starterCode: "a = {1, 2}\nb = {2, 3}\n# a &= b\n",
        solutionCode: "a = {1, 2}\nb = {2, 3}\na &= b\nprint(sorted(a))",
        expectedOutput: "[2]",
        hints: ["&= intersezione in-place", "intersection_update()"],
        explanation: "Riduce il set alla sola intersezione.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Difference Update -=",
        descTemplate: "Rimuovi elementi di b da a con -=.",
        starterCode: "a = {1, 2}\nb = {2}\n# a -= b\n",
        solutionCode: "a = {1, 2}\nb = {2}\na -= b\nprint(sorted(a))",
        expectedOutput: "[1]",
        hints: ["-= differenza in-place", "difference_update()"],
        explanation: "Rimuove gli elementi presenti nell'altro set.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Sym Diff Update ^=",
        descTemplate: "Aggiorna a con diff simmetrica ^=",
        starterCode: "a = {1, 2}\nb = {2, 3}\n# a ^= b\n",
        solutionCode: "a = {1, 2}\nb = {2, 3}\na ^= b\nprint(sorted(a))",
        expectedOutput: "[1, 3]",
        hints: ["^= in-place", "symmetric_difference_update()"],
        explanation: "Modifica a per contenere la diff simmetrica.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Conditional Remove",
        descTemplate: "Rimuovi 5 solo se presente (senza try/error).",
        starterCode: "s = {1}\n",
        solutionCode: "s = {1}\nif 5 in s:\n    s.remove(5)\nprint(sorted(s))",
        expectedOutput: "[1]",
        hints: ["Controlla con 'in' prima", "Oppure usa discard"],
        explanation: "Pattern safe removal se non si usa discard.",
        brokenCode: "s.remove(5)",
        debugHint: "KeyError."
      },
      {
        titleTemplate: "Filter Set Comp",
        descTemplate: "Filtra pari da {1, 2, 3, 4} con comprehension.",
        starterCode: "s = {1, 2, 3, 4}\n",
        solutionCode: "s = {1, 2, 3, 4}\nprint(sorted({x for x in s if x % 2 == 0}))",
        expectedOutput: "[2, 4]",
        hints: ["Set comprehension ha {} come i set", "if x % 2 == 0"],
        explanation: "Crea nuovo set filtrato.",
        brokenCode: "[x for ...]",
        debugHint: "Crea lista, non set."
      },
      {
        titleTemplate: "FrozenSet Basic",
        descTemplate: "Crea frozenset e prova ad aggiungere (fallendo).",
        starterCode: "fs = frozenset([1])\n",
        solutionCode: "fs = frozenset([1])\ntry:\n    fs.add(2)\nexcept AttributeError:\n    print('Immutable')",
        expectedOutput: "Immutable",
        hints: ["frozenset non ha add()", "AttributeError"],
        explanation: "Il frozenset è immutabile.",
        brokenCode: "fs.add(2)",
        debugHint: "Crash, metodo inesistente."
      },
      {
        titleTemplate: "Set of Tuples",
        descTemplate: "Crea set di tuple {(1, 2)}.",
        starterCode: "",
        solutionCode: "s = {(1, 2)}\nprint(sorted(s))",
        expectedOutput: "[(1, 2)]",
        hints: ["Tuple è hashable", "Parentesi graffe esterne, tonde interne"],
        explanation: "Set può contenere tuple.",
        brokenCode: "s = {[1, 2]}",
        debugHint: "List not hashable."
      },
      {
        titleTemplate: "Min Max Sum Set",
        descTemplate: "Calcola somma di {1, 2, 3}.",
        starterCode: "s = {1, 2, 3}\n",
        solutionCode: "s = {1, 2, 3}\nprint(sum(s))",
        expectedOutput: "6",
        hints: ["Funziona come liste", "Itera elementi"],
        explanation: "Aggregation functions funzionano su set.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Sorted Set",
        descTemplate: "Ottieni lista ordinata da {3, 1, 2}.",
        starterCode: "s = {3, 1, 2}\n",
        solutionCode: "s = {3, 1, 2}\nprint(sorted(s))",
        expectedOutput: "[1, 2, 3]",
        hints: ["Restituisce lista", "Elementi ordinati"],
        explanation: "Modo standard per 'ordinare' un set (convertendolo).",
        brokenCode: "s.sort()",
        debugHint: "Set non ha sort()."
      },
      {
        titleTemplate: "Unique Chars",
        descTemplate: "Quanti caratteri unici in 'banana'?",
        starterCode: "s = 'banana'\n",
        solutionCode: "s = 'banana'\nprint(len(set(s)))",
        expectedOutput: "3",
        hints: ["b, a, n", "set() rimuove duplicati"],
        explanation: "Idiom frequente.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Common in 3",
        descTemplate: "Trova elementi comuni a 3 set.",
        starterCode: "s1={1,2}; s2={2,3}; s3={2,4}\n",
        solutionCode: "s1={1,2}; s2={2,3}; s3={2,4}\nprint(s1 & s2 & s3)",
        expectedOutput: "{2}",
        hints: ["Chaining di &", "s1 & s2 & s3"],
        explanation: "L'intersezione accetta più operandi.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "List Uniq Preserve",
        descTemplate: "Rimuovi duplicati da lista [1, 2, 1] preservando ordine (usa dict).",
        starterCode: "l = [1, 2, 1]\n",
        solutionCode: "l = [1, 2, 1]\nprint(list(dict.fromkeys(l)))",
        expectedOutput: "[1, 2]",
        hints: ["dict keys preservano ordine (Py3.7+)", "set() non garantisce ordine"],
        explanation: "Trick moderno per unicità ordinata.",
        brokenCode: "list(set(l))",
        debugHint: "Perde l'ordine."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Verifica sottoinsieme",
        descTemplate: "Verifica se a è sottoinsieme di b.",
        starterCode: "a = {1, 2}\nb = {1, 2, 3, 4}\n",
        solutionCode: "a = {1, 2}\nb = {1, 2, 3, 4}\nprint(a.issubset(b))",
        expectedOutput: "True",
        hints: ["issubset() verifica contenimento", "a <= b è equivalente"],
        explanation: "issubset() verifica se tutti gli elementi di a sono in b.",
        brokenCode: "a = {1, 2}\nb = {1, 2, 3, 4}\nprint(a in b)",
        debugHint: "'in' verifica appartenenza di elemento, non di set."
      },
      {
        titleTemplate: "Set comprehension",
        descTemplate: "Crea un set dei quadrati da 1 a 5.",
        starterCode: "",
        solutionCode: "quadrati = {x**2 for x in range(1, 6)}\nprint(sorted(quadrati))",
        expectedOutput: "[1, 4, 9, 16, 25]",
        hints: ["{espressione for x in seq}", "Come list comprehension ma con {}"],
        explanation: "Set comprehension crea set con sintassi concisa.",
        brokenCode: "quadrati = [x**2 for x in range(1, 6)]\nprint(quadrati)",
        debugHint: "[] crea lista, {} crea set."
      },
      {
        titleTemplate: "Frozen set",
        descTemplate: "Crea un frozenset immutabile.",
        starterCode: "",
        solutionCode: "fs = frozenset([1, 2, 3])\nprint(fs)\nprint(type(fs).__name__)",
        expectedOutput: "frozenset({1, 2, 3})\nfrozenset",
        hints: ["frozenset() crea set immutabile", "Può essere chiave di dizionario"],
        explanation: "frozenset è la versione immutabile di set.",
        brokenCode: "fs = {1, 2, 3}\nfs.add(4)\nprint(fs)",
        debugHint: "Questo è un set normale, non frozen."
      },
      {
        titleTemplate: "Mutate while Iterating",
        descTemplate: "Prova a rimuovere elemento durante for loop (RuntimeError).",
        starterCode: "s = {1, 2}\ntry:\n    for x in s: s.remove(x)\nexcept RuntimeError:\n    print('Errore')\n",
        solutionCode: "s = {1, 2}\ntry:\n    for x in s:\n        s.remove(x)\nexcept RuntimeError:\n    print('Errore')",
        expectedOutput: "Errore",
        hints: ["Non modificare dimensione durante iterazione", "Itera su copia o list(s)"],
        explanation: "I set non permettono modifiche strutturali durante iterazione.",
        brokenCode: "for x in s: s.remove(x)",
        debugHint: "RuntimeError: Set changed size during iteration."
      },
      {
        titleTemplate: "Cartesian Product",
        descTemplate: "Simula prodotto cartesiano {1,2} x {3,4}.",
        starterCode: "a={1,2}; b={3,4}\n",
        solutionCode: "a={1,2}; b={3,4}\nprint(sorted({(x,y) for x in a for y in b}))",
        expectedOutput: "[(1, 3), (1, 4), (2, 3), (2, 4)]",
        hints: ["Doppio ciclo", "Tupla (x,y)"],
        explanation: "Set comprehension annidata.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Power Set Idea",
        descTemplate: "Concetto: Insieme parti. Stampa 2^len per {1, 2, 3}.",
        starterCode: "s = {1, 2, 3}\n",
        solutionCode: "s = {1, 2, 3}\nprint(2**len(s))",
        expectedOutput: "8",
        hints: ["Cardinalità Power Set è 2^n", "Combina tutti i sottoinsiemi"],
        explanation: "Teoria degli insiemi.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "FrozenSet Dict Key",
        descTemplate: "Usa frozenset come chiave di dizionario.",
        starterCode: "key = frozenset([1])\nd = {key: 'val'}\n",
        solutionCode: "key = frozenset([1])\nd = {key: 'val'}\nprint(d[key])",
        expectedOutput: "val",
        hints: ["Frozenset è hashable", "Set normale no"],
        explanation: "Utile per mappare insiemi di caratteristiche.",
        brokenCode: "d = {set([1]): 'val'}",
        debugHint: "TypeError."
      },
      {
        titleTemplate: "FrozenSet in Set",
        descTemplate: "Metti frozenset dentro set.",
        starterCode: "nested = {frozenset([1]), frozenset([2])}\n",
        solutionCode: "nested = {frozenset([1])}\nprint(type(list(nested)[0]))",
        expectedOutput: "<class 'frozenset'>",
        hints: ["Elementi di set devono essere hashable", "Frozenset lo è"],
        explanation: "Insieme di insiemi richiede immutabilità interna.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Set vs List Search",
        descTemplate: "Stampa 'Set' se ricerca O(1) è meglio di O(n).",
        starterCode: "",
        solutionCode: "print('Set')",
        expectedOutput: "Set",
        hints: ["Hash table vs Sequential scan", "Velocità"],
        explanation: "Set è enormemente più veloce per lookup.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "De Morgan Laws",
        descTemplate: "Verifica (A | B)' == A' & B' (usando universal set U).",
        starterCode: "U={1,2,3}; A={1}; B={2}\n# not (A|B) == (not A) & (not B) in U\n",
        solutionCode: "U={1,2,3}; A={1}; B={2}\nprint(U-(A|B) == (U-A) & (U-B))",
        expectedOutput: "True",
        hints: ["Complemento è U - set", "Logica insiemistica"],
        explanation: "Leggi di De Morgan sui set.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Discard vs Remove",
        descTemplate: "Dimostra che discard non lancia errore se manca.",
        starterCode: "s={1}\n",
        solutionCode: "s={1}\ns.discard(2)\nprint('Ok')",
        expectedOutput: "Ok",
        hints: ["discard è safe", "Nessuna eccezione"],
        explanation: "Discard è utile quando l'esistenza è incerta.",
        brokenCode: "s.remove(2)",
        debugHint: "KeyError."
      },
      {
        titleTemplate: "Pop Empty",
        descTemplate: "Gestisci KeyError pop set vuoto.",
        starterCode: "s=set()\n",
        solutionCode: "s=set()\ntry:\n    s.pop()\nexcept KeyError:\n    print('Empty')",
        expectedOutput: "Empty",
        hints: ["Pop su vuoto lancia errore", "Try/Except"],
        explanation: "Necessario controllare lista vuota o usare try.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Update Mixed",
        descTemplate: "Aggiorna set con lista e tupla insieme.",
        starterCode: "s={1}\n",
        solutionCode: "s={1}\ns.update([2], (3,))\nprint(len(s))",
        expectedOutput: "3",
        hints: ["update accetta multipli iterabili", "Variadic arguments"],
        explanation: "Flessibilità di update.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Set Comp Value",
        descTemplate: "Crea set {x se x pari else -x} da range(3).",
        starterCode: "# {x if x%2==0 else -x...}\n",
        solutionCode: "print(sorted({x if x%2==0 else -x for x in range(3)}))",
        expectedOutput: "[-1, 0, 2]",
        hints: ["Operatore ternario", "All'inizio della comprehension"],
        explanation: "Logica condizionale sul valore.",
        brokenCode: "{x for x in range(3) if ... else ...}",
        debugHint: "Else non esiste nel filtro finale, solo nell'espressione iniziale."
      },
      {
        titleTemplate: "List vs Set Memory",
        descTemplate: "Set ha overhead rispetto list? (True)",
        starterCode: "import sys\n",
        solutionCode: "import sys\nprint(sys.getsizeof({1,2}) > sys.getsizeof([1,2]))",
        expectedOutput: "True",
        hints: ["Hash table richiede spazio vuoto", "Sparsity"],
        explanation: "Set è veloce ma consuma più RAM.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Hash Manual",
        descTemplate: "Stampa hash('a') (è un intero).",
        starterCode: "",
        solutionCode: "print(isinstance(hash('a'), int))",
        expectedOutput: "True",
        hints: ["Funzione hash()", "Base dei set"],
        explanation: "I set usano l'hash per posizionare gli elementi.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Custom Obj Set",
        descTemplate: "Set usa hash o eq? (Concettuale: Entrambi).",
        starterCode: "",
        solutionCode: "print('Both')",
        expectedOutput: "Both",
        hints: ["Prima hash", "Poi eq per collisioni"],
        explanation: "Due oggetti sono distinti nel set se hash diverso o eq False.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Union Manual",
        descTemplate: "Implementa unione manualmente con loop.",
        starterCode: "a={1}; b={2}\n",
        solutionCode: "a={1}; b={2}\nres = a.copy()\nfor x in b:\n    res.add(x)\nprint(len(res))",
        expectedOutput: "2",
        hints: ["Copia a", "Itera b aggiungendo"],
        explanation: "Logica interna dell'unione.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Frozen In-Place Error",
        descTemplate: "Frozenset non supporta |= (assegnazione ok, ma non in-place reale).",
        starterCode: "# fs |= {2} crea nuovo oggetto?\n",
        solutionCode: "fs = frozenset([1])\nold_id = id(fs)\nfs |= {2}\nprint(old_id != id(fs))",
        expectedOutput: "True",
        hints: ["Immutabile -> non modificabile in place", "Variabile viene riassegnata"],
        explanation: "Per immutabili, |= crea nuovo oggetto e riassegna.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Copy Deep Ambiguity",
        descTemplate: "Set di tuple mutabili? No. Deepcopy serve?",
        starterCode: "",
        solutionCode: "import copy\ns = {1}\nprint(s == copy.deepcopy(s))",
        expectedOutput: "True",
        hints: ["Contenuto immutabile", "Deepcopy funzionale"],
        explanation: "Deepcopy clona la struttura.",
        brokenCode: "",
        debugHint: ""
      }
    ],
  },

  // ==================== DICTIONARIES ====================
  [PythonTopicId.Dictionaries]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Creare dizionario",
        descTemplate: "Crea un dizionario con nome='Mario' e età=30.",
        starterCode: "",
        solutionCode: "persona = {'nome': 'Mario', 'eta': 30}\nprint(persona)",
        expectedOutput: "{'nome': 'Mario', 'eta': 30}",
        hints: ["chiave: valore", "Usa {} con coppie chiave-valore"],
        explanation: "I dizionari mappano chiavi a valori.",
        brokenCode: "persona = ['nome': 'Mario', 'eta': 30]\nprint(persona)",
        debugHint: "[] è per liste, {} per dizionari."
      },
      {
        titleTemplate: "Accesso valore",
        descTemplate: "Stampa il valore associato alla chiave 'nome'.",
        starterCode: "persona = {'nome': 'Luigi', 'eta': 25}\n",
        solutionCode: "persona = {'nome': 'Luigi', 'eta': 25}\nprint(persona['nome'])",
        expectedOutput: "Luigi",
        hints: ["dict[chiave] restituisce il valore", "La chiave va tra virgolette"],
        explanation: "L'accesso per chiave restituisce il valore associato.",
        brokenCode: "persona = {'nome': 'Luigi', 'eta': 25}\nprint(persona[nome])",
        debugHint: "La chiave 'nome' deve essere stringa: persona['nome']."
      },
      {
        titleTemplate: "Aggiungere chiave",
        descTemplate: "Aggiungi città='Roma' al dizionario.",
        starterCode: "persona = {'nome': 'Anna'}\n",
        solutionCode: "persona = {'nome': 'Anna'}\npersona['citta'] = 'Roma'\nprint(persona)",
        expectedOutput: "{'nome': 'Anna', 'citta': 'Roma'}",
        hints: ["dict[nuova_chiave] = valore", "Come assegnazione normale"],
        explanation: "Assegnare a una nuova chiave la aggiunge al dizionario.",
        brokenCode: "persona = {'nome': 'Anna'}\npersona.add('citta', 'Roma')\nprint(persona)",
        debugHint: "I dizionari non hanno add(), usa dict[key] = value."
      },
      {
        titleTemplate: "Empty Dict",
        descTemplate: "Crea dizionario vuoto.",
        starterCode: "# d = ...\n",
        solutionCode: "d = {}\nprint(d)",
        expectedOutput: "{}",
        hints: ["{}", "dict()"],
        explanation: "{} inizializza un dizionario vuoto.",
        brokenCode: "d = set()",
        debugHint: "Questo crea un set."
      },
      {
        titleTemplate: "Update Value",
        descTemplate: "Cambia valore di 'a' in 2.",
        starterCode: "d = {'a': 1}\n# d['a'] = 2\n",
        solutionCode: "d = {'a': 1}\nd['a'] = 2\nprint(d['a'])",
        expectedOutput: "2",
        hints: ["Accesso per chiave", "Riassegnazione"],
        explanation: "Sovrascrittura valore esistente.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Delete Key",
        descTemplate: "Elimina chiave 'a'.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\ndel d['a']\nprint(d)",
        expectedOutput: "{}",
        hints: ["del d['a']", "Rimuove item"],
        explanation: "del rimuove la coppia chiave-valore.",
        brokenCode: "d.delete('a')",
        debugHint: "Usa del d['a'] o pop()."
      },
      {
        titleTemplate: "Pop Key",
        descTemplate: "Usa pop per rimuovere 'a'.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nd.pop('a')\nprint(d)",
        expectedOutput: "{}",
        hints: ["pop restituisce valore", "Rimuove chiave"],
        explanation: "Metodo alternativo a del.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Check Key Not In",
        descTemplate: "Verifica che 'z' non sia in d.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nprint('z' not in d)",
        expectedOutput: "True",
        hints: ["not in", "Controlla chiavi"],
        explanation: "Verifica assenza chiave.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Valid Keys",
        descTemplate: "Prova a usare lista come chiave (Errore).",
        starterCode: "# d = {[1]: 1}\n",
        solutionCode: "try:\n    d = {[1]: 1}\nexcept TypeError:\n    print('Error')",
        expectedOutput: "Error",
        hints: ["Chiavi devono essere hashable", "Liste no"],
        explanation: "Solo immutabili possono essere chiavi.",
        brokenCode: "d = {[1]: 1}",
        debugHint: "TypeError: unhashable type: 'list'."
      },
      {
        titleTemplate: "Dict Length",
        descTemplate: "Conta coppie in {'a': 1, 'b': 2}.",
        starterCode: "d = {'a': 1, 'b': 2}\n",
        solutionCode: "d = {'a': 1, 'b': 2}\nprint(len(d))",
        expectedOutput: "2",
        hints: ["len()", "Numero chiavi"],
        explanation: "Restituisce numero di item.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Copy Dict",
        descTemplate: "Copia dizionario.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nprint(d.copy())",
        expectedOutput: "{'a': 1}",
        hints: ["Shallow copy", ".copy()"],
        explanation: "Crea nuovo dizionario clone.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Clear Dict",
        descTemplate: "Svuota dizionario.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nd.clear()\nprint(d)",
        expectedOutput: "{}",
        hints: ["clear()", "In-place"],
        explanation: "Rimuove tutto.",
        brokenCode: "d = {}",
        debugHint: "Crea nuovo dict, non svuota il precedente se referenziato altrove."
      },
      {
        titleTemplate: "Values List",
        descTemplate: "Ottieni lista valori.",
        starterCode: "d = {'a': 1, 'b': 2}\n",
        solutionCode: "d = {'a': 1, 'b': 2}\nprint(list(d.values()))",
        expectedOutput: "[1, 2]",
        hints: ["values()", "list()"],
        explanation: "Estrae solo i valori.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Iterate Keys",
        descTemplate: "Stampa chiavi iterando.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nfor k in d:\n    print(k)",
        expectedOutput: "a",
        hints: ["Iterazione default è sulle chiavi", "for k in d"],
        explanation: "Loop semplice sul dizionario.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Dict from List",
        descTemplate: "Crea dict da lista di tuple [('a', 1)].",
        starterCode: "l = [('a', 1)]\n",
        solutionCode: "l = [('a', 1)]\nprint(dict(l))",
        expectedOutput: "{'a': 1}",
        hints: ["Costruttore dict", "Iterabile di coppie"],
        explanation: "Trasforma lista 2D in mappa.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Setdefault Intro",
        descTemplate: "Usa setdefault per 'a' (già esiste).",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nprint(d.setdefault('a', 2))",
        expectedOutput: "1",
        hints: ["Non sovrascrive", "Ritorna valore esistente"],
        explanation: "Se chiave c'è, restituisce valore e non tocca nulla.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Popitem",
        descTemplate: "Rimuovi ultimo ITEM inserito.",
        starterCode: "d = {'a': 1, 'b': 2}\n",
        solutionCode: "d = {'a': 1, 'b': 2}\nprint(d.popitem())",
        expectedOutput: "('b', 2)",
        hints: ["LIFO removal", "Restituisce tupla"],
        explanation: "Da Python 3.7 dict sono ordinati, popitem rimuove ultimo.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Merge Operator",
        descTemplate: "Usa | per unire {'a':1} e {'b':2}.",
        starterCode: "d1={'a':1}; d2={'b':2}\n",
        solutionCode: "d1={'a':1}; d2={'b':2}\nprint(d1 | d2)",
        expectedOutput: "{'a': 1, 'b': 2}",
        hints: ["Op | (pipe)", "Python 3.9+"],
        explanation: "Syntactic sugar per merge.",
        brokenCode: "d1 + d2",
        debugHint: "TypeError."
      },
      {
        titleTemplate: "Get none",
        descTemplate: "Get di chiave mancante ritorna None.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nprint(d.get('b'))",
        expectedOutput: "None",
        hints: ["Default è None", "Nessun errore"],
        explanation: "Safe access.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Check Value in Values",
        descTemplate: "Verifica se 1 è nei valori.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nprint(1 in d.values())",
        expectedOutput: "True",
        hints: ["Bisogna chiamare .values()", "Default 'in' cerca keys"],
        explanation: "Ricerca nei valori è O(n).",
        brokenCode: "1 in d",
        debugHint: "Cerca nelle chiavi, False."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Get con default",
        descTemplate: "Usa get() per accedere con valore default.",
        starterCode: "persona = {'nome': 'Marco'}\n",
        solutionCode: "persona = {'nome': 'Marco'}\nprint(persona.get('eta', 0))",
        expectedOutput: "0",
        hints: ["get(chiave, default)", "Non solleva errore se la chiave non esiste"],
        explanation: "get() restituisce default se la chiave non esiste.",
        brokenCode: "persona = {'nome': 'Marco'}\nprint(persona['eta'])",
        debugHint: "Questo solleva KeyError, usa get() con default."
      },
      {
        titleTemplate: "Keys, values, items",
        descTemplate: "Stampa tutte le chiavi del dizionario.",
        starterCode: "dati = {'a': 1, 'b': 2, 'c': 3}\n",
        solutionCode: "dati = {'a': 1, 'b': 2, 'c': 3}\nprint(list(dati.keys()))",
        expectedOutput: "['a', 'b', 'c']",
        hints: ["keys() restituisce le chiavi", "Converti in lista per stampare"],
        explanation: "keys(), values(), items() accedono a parti del dizionario.",
        brokenCode: "dati = {'a': 1, 'b': 2, 'c': 3}\nprint(dati.keys)",
        debugHint: "keys() è un metodo, servono le parentesi ()."
      },
      {
        titleTemplate: "Iterare su dizionario",
        descTemplate: "Stampa chiave e valore per ogni elemento.",
        starterCode: "voti = {'Mario': 8, 'Luigi': 7}\n",
        solutionCode: "voti = {'Mario': 8, 'Luigi': 7}\nfor nome, voto in voti.items():\n    print(f'{nome}: {voto}')",
        expectedOutput: "Mario: 8\nLuigi: 7",
        hints: ["items() restituisce coppie (chiave, valore)", "Usa unpacking nel for"],
        explanation: "items() permette di iterare su chiavi e valori insieme.",
        brokenCode: "voti = {'Mario': 8, 'Luigi': 7}\nfor v in voti:\n    print(v)",
        debugHint: "Iterando sul dict ottieni solo le chiavi, usa items()."
      },
      {
        titleTemplate: "Verifica chiave",
        descTemplate: "Verifica se 'email' è una chiave del dizionario.",
        starterCode: "utente = {'nome': 'Test', 'id': 1}\n",
        solutionCode: "utente = {'nome': 'Test', 'id': 1}\nprint('email' in utente)",
        expectedOutput: "False",
        hints: ["chiave in dict verifica esistenza", "in controlla le chiavi"],
        explanation: "'in' verifica se una chiave esiste nel dizionario.",
        brokenCode: "utente = {'nome': 'Test', 'id': 1}\nprint(utente.contains('email'))",
        debugHint: "I dizionari non hanno contains(), usa 'in'."
      },
      {
        titleTemplate: "Dict Comprehension",
        descTemplate: "Crea {x: x*2} per x in (1, 2).",
        starterCode: "",
        solutionCode: "print({x: x*2 for x in (1, 2)})",
        expectedOutput: "{1: 2, 2: 4}",
        hints: ["Chiave:Valore", "Simile a set comp"],
        explanation: "Costruzione rapida.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Invert Dict",
        descTemplate: "Swap keys e values di {'a': 1}.",
        starterCode: "d = {'a': 1}\n",
        solutionCode: "d = {'a': 1}\nprint({v: k for k, v in d.items()})",
        expectedOutput: "{1: 'a'}",
        hints: ["Unpacking items", "v: k"],
        explanation: "Inversione via comprehension.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Multiple Update",
        descTemplate: "Update d con più chiavi.",
        starterCode: "d = {'a': 1}\n# update(b=2, c=3)\n",
        solutionCode: "d = {'a': 1}\nd.update(b=2, c=3)\nprint(d)",
        expectedOutput: "{'a': 1, 'b': 2, 'c': 3}",
        hints: ["Keyword args in update", "b=2"],
        explanation: "update accetta kwargs.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Merge In-Place |=",
        descTemplate: "Merge d1 |= d2.",
        starterCode: "d1={'a':1}; d2={'a':2}\n# |=\n",
        solutionCode: "d1={'a':1}; d2={'a':2}\nd1 |= d2\nprint(d1)",
        expectedOutput: "{'a': 2}",
        hints: ["Aggiorna d1", "Vince d2 su conflitti"],
        explanation: "Operatore IOR (In-place OR).",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Fromkeys",
        descTemplate: "Crea dict con chiavi ['a', 'b'] e val 0.",
        starterCode: "keys = ['a', 'b']\n",
        solutionCode: "keys = ['a', 'b']\nprint(dict.fromkeys(keys, 0))",
        expectedOutput: "{'a': 0, 'b': 0}",
        hints: ["Metodo di classe dict", "Valore default condiviso"],
        explanation: "Inizializzazione bulk.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "DefaultDict Int",
        descTemplate: "Usa defaultdict(int) per contare.",
        starterCode: "from collections import defaultdict\nd = defaultdict(int)\n# d['a'] += 1\n",
        solutionCode: "from collections import defaultdict\nd = defaultdict(int)\nd['a'] += 1\nprint(d['a'])",
        expectedOutput: "1",
        hints: ["Auto-inizializza a 0", "Nessun KeyError"],
        explanation: "Semplifica conteggi.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "DefaultDict List",
        descTemplate: "Raggruppa: d['pari'].append(2).",
        starterCode: "from collections import defaultdict\nd = defaultdict(list)\n",
        solutionCode: "from collections import defaultdict\nd = defaultdict(list)\nd['pari'].append(2)\nprint(d['pari'])",
        expectedOutput: "[2]",
        hints: ["Auto-init a []", "Non serve check esistenza"],
        explanation: "Utile per grouping.",
        brokenCode: "d = {}\nd['k'].append(1)",
        debugHint: "KeyError su d normale."
      },
      {
        titleTemplate: "Counter Basic",
        descTemplate: "Conta char in 'aba'.",
        starterCode: "from collections import Counter\n",
        solutionCode: "from collections import Counter\nprint(Counter('aba'))",
        expectedOutput: "Counter({'a': 2, 'b': 1})",
        hints: ["Oggetto Counter", "Dizionario specializzato"],
        explanation: "Conta iterabili automaticamente.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Counter Most Common",
        descTemplate: "Trova il più comune in 'aba'.",
        starterCode: "from collections import Counter\nc = Counter('aba')\n",
        solutionCode: "from collections import Counter\nc = Counter('aba')\nprint(c.most_common(1))",
        expectedOutput: "[('a', 2)]",
        hints: ["Ritorna lista di tuple", "Top k"],
        explanation: "Metodo potente per statistiche.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Sort Check Keys",
        descTemplate: "Ordina dict per chiavi.",
        starterCode: "d = {'b': 2, 'a': 1}\n",
        solutionCode: "d = {'b': 2, 'a': 1}\nprint(dict(sorted(d.items())))",
        expectedOutput: "{'a': 1, 'b': 2}",
        hints: ["sorted() su items", "Ricostruisci dict"],
        explanation: "Dizionari moderni mantengono ordine inserimento.",
        brokenCode: "d.sort()",
        debugHint: "Non ha sort()."
      },
      {
        titleTemplate: "Sort Check Values",
        descTemplate: "Ordina per valori.",
        starterCode: "d = {'a': 10, 'b': 1}\n# key=lambda item: item[1]\n",
        solutionCode: "d = {'a': 10, 'b': 1}\nprint(dict(sorted(d.items(), key=lambda item: item[1])))",
        expectedOutput: "{'b': 1, 'a': 10}",
        hints: ["Lambda su tuple (k, v)", "v è indice 1"],
        explanation: "Ordinamento flessibile.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Nested Access",
        descTemplate: "Accedi a 'x': d = {'a': {'b': 'x'}}.",
        starterCode: "d = {'a': {'b': 'x'}}\n",
        solutionCode: "d = {'a': {'b': 'x'}}\nprint(d['a']['b'])",
        expectedOutput: "x",
        hints: ["Indice a catena", "Primo dict, poi secondo"],
        explanation: "Strutture dati annidate.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Safe Nested Get",
        descTemplate: "Get sicuro annidato (simulato).",
        starterCode: "d = {}\n",
        solutionCode: "d = {}\nprint(d.get('a', {}).get('b'))",
        expectedOutput: "None",
        hints: ["Chain di get", "Default {} intermedio"],
        explanation: "Evita errori su path mancanti.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Try Except Key",
        descTemplate: "Gestisci KeyError.",
        starterCode: "d = {}\n",
        solutionCode: "d = {}\ntry:\n    print(d['a'])\nexcept KeyError:\n    print('Manca')",
        expectedOutput: "Manca",
        hints: ["Blocco try-except", "Cattura errore"],
        explanation: "Gestione eccezioni standard.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Dict vs List Lookup",
        descTemplate: "Dict è più veloce di List per search? (True)",
        starterCode: "",
        solutionCode: "print('True')",
        expectedOutput: "True",
        hints: ["Hashing vs Scansione", "Performance"],
        explanation: "Dict usa hash table.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Keys Set Operations",
        descTemplate: "Intersezione chiavi tra due dict.",
        starterCode: "d1={'a':1, 'b':2}; d2={'a':3}\n",
        solutionCode: "d1={'a':1, 'b':2}; d2={'a':3}\nprint(d1.keys() & d2.keys())",
        expectedOutput: "{'a'}",
        hints: ["View objects agiscono come set", "Ampersand"],
        explanation: "Le view delle chiavi supportano operazioni sui set.",
        brokenCode: "",
        debugHint: ""
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Dict comprehension",
        descTemplate: "Crea un dizionario dei quadrati da 1 a 5.",
        starterCode: "",
        solutionCode: "quadrati = {x: x**2 for x in range(1, 6)}\nprint(quadrati)",
        expectedOutput: "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}",
        hints: ["{chiave: valore for x in seq}", "chiave: valore separati da :"],
        explanation: "Dict comprehension crea dizionari con sintassi concisa.",
        brokenCode: "quadrati = {x**2 for x in range(1, 6)}\nprint(quadrati)",
        debugHint: "Senza : crei un set, non un dizionario."
      },
      {
        titleTemplate: "Update dizionario",
        descTemplate: "Unisci due dizionari.",
        starterCode: "a = {'x': 1}\nb = {'y': 2}\n",
        solutionCode: "a = {'x': 1}\nb = {'y': 2}\na.update(b)\nprint(a)",
        expectedOutput: "{'x': 1, 'y': 2}",
        hints: ["update() aggiunge coppie da altro dict", "Modifica il primo dizionario"],
        explanation: "update() aggiunge tutte le coppie di un altro dizionario.",
        brokenCode: "a = {'x': 1}\nb = {'y': 2}\nprint(a + b)",
        debugHint: "I dizionari non supportano +, usa update() o |."
      },
      {
        titleTemplate: "Pop con default",
        descTemplate: "Rimuovi 'temp' se esiste, altrimenti restituisci None.",
        starterCode: "config = {'debug': True}\n",
        solutionCode: "config = {'debug': True}\nresult = config.pop('temp', None)\nprint(result)\nprint(config)",
        expectedOutput: "None\n{'debug': True}",
        hints: ["pop(chiave, default) rimuove e restituisce", "Non solleva errore con default"],
        explanation: "pop() con default è sicuro per chiavi inesistenti.",
        brokenCode: "config = {'debug': True}\nresult = config.pop('temp')\nprint(result)",
        debugHint: "Senza default, pop() solleva KeyError se la chiave non esiste."
      },
      {
        titleTemplate: "Setdefault",
        descTemplate: "Imposta un default per una nuova chiave.",
        starterCode: "conteggi = {'a': 1}\n",
        solutionCode: "conteggi = {'a': 1}\nconteggi.setdefault('b', 0)\nconteggi['b'] += 1\nprint(conteggi)",
        expectedOutput: "{'a': 1, 'b': 1}",
        hints: ["setdefault() imposta solo se non esiste", "Utile per inizializzare contatori"],
        explanation: "setdefault() imposta un valore solo se la chiave non esiste.",
        brokenCode: "conteggi = {'a': 1}\nconteggi['b'] += 1\nprint(conteggi)",
        debugHint: "KeyError! 'b' non esiste, usa setdefault() prima."
      },
      {
        titleTemplate: "ChainMap",
        descTemplate: "Usa ChainMap per cercare in due dict.",
        starterCode: "from collections import ChainMap\nd1={'a':1}; d2={'b':2}\n",
        solutionCode: "from collections import ChainMap\nd1={'a':1}; d2={'b':2}\ncm = ChainMap(d1, d2)\nprint(cm['a'], cm['b'])",
        expectedOutput: "1 2",
        hints: ["Crea vista unificata", "Cerca in ordine"],
        explanation: "Non copia dati, linka i dizionari.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "OrderedDict",
        descTemplate: "Move to end 'a' in OrderedDict.",
        starterCode: "from collections import OrderedDict\nod = OrderedDict.fromkeys('abc')\n",
        solutionCode: "from collections import OrderedDict\nod = OrderedDict.fromkeys('abc')\nod.move_to_end('a')\nprint(list(od.keys())[-1])",
        expectedOutput: "a",
        hints: ["Sposta elemento in fondo", "Metodo specifico OD"],
        explanation: "Utile per cache LRU.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "UserDict",
        descTemplate: "Subclassa UserDict e modifica setitem.",
        starterCode: "from collections import UserDict\nclass D(UserDict):\n    def __setitem__(self, k, v):\n        super().__setitem__(k, v*2)\n# d['x'] = 1\n",
        solutionCode: "from collections import UserDict\nclass D(UserDict):\n    def __setitem__(self, k, v):\n        super().__setitem__(k, v*2)\nd = D()\nd['x'] = 1\nprint(d['x'])",
        expectedOutput: "2",
        hints: ["Eredita da UserDict", "Override __setitem__"],
        explanation: "Meglio che ereditare da dict direttamente.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Missing Key",
        descTemplate: "Implementa __missing__ per ritornare 'DEFAULT'.",
        starterCode: "class D(dict):\n    def __missing__(self, key):\n        return 'DEFAULT'\n",
        solutionCode: "class D(dict):\n    def __missing__(self, key):\n        return 'DEFAULT'\nd = D()\nprint(d['x'])",
        expectedOutput: "DEFAULT",
        hints: ["Metodo hook per chiavi mancanti", "Solo su subclass dict"],
        explanation: "Base per defaultdict.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Dynamic View",
        descTemplate: "Mostra che keys() si aggiorna live.",
        starterCode: "d = {'a': 1}\nk = d.keys()\nd['b'] = 2\n",
        solutionCode: "d = {'a': 1}\nk = d.keys()\nd['b'] = 2\nprint('b' in k)",
        expectedOutput: "True",
        hints: ["View è dinamica", "Non è lista statica"],
        explanation: "Riflette modifiche sottostanti.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Complex Comp",
        descTemplate: "Dict {x: 'pari'/'dispari'} comprehension.",
        starterCode: "",
        solutionCode: "print({x: 'pari' if x%2==0 else 'dispari' for x in range(2)})",
        expectedOutput: "{0: 'pari', 1: 'dispari'}",
        hints: ["Conditional value", "Ternary operator"],
        explanation: "Logica complessa in una riga.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Merge Overlap",
        descTemplate: "Chi vince in {'a':1} | {'a':2}?",
        starterCode: "",
        solutionCode: "print(({'a': 1} | {'a': 2})['a'])",
        expectedOutput: "2",
        hints: ["Ultimo vince", "Destra sovrascrive sinistra"],
        explanation: "Regola base del merge.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Compact Dict",
        descTemplate: "Dict consuma meno RAM di prima (concetto).",
        starterCode: "",
        solutionCode: "print('Compact')",
        expectedOutput: "Compact",
        hints: ["Py3.6+ optimization", "Ordine + Memoria"],
        explanation: "Nuova implementazione hash map.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Obj Key",
        descTemplate: "Usa oggetto custom come chiave (default hash id).",
        starterCode: "class O: pass\no = O()\n# d[o] = 1\n",
        solutionCode: "class O: pass\no = O()\nd = {o: 1}\nprint(d[o])",
        expectedOutput: "1",
        hints: ["Oggetti sono hashable per id di default", "Funziona"],
        explanation: "L'istanza è unica, quindi valida come chiave.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Deepcopy Dict",
        descTemplate: "Deepcopy dict annidato.",
        starterCode: "import copy\nd = {'a': [1]}\n",
        solutionCode: "import copy\nd = {'a': [1]}\nc = copy.deepcopy(d)\nc['a'].append(2)\nprint(len(d['a']))",
        expectedOutput: "1",
        hints: ["Isola le strutture interne", "Shallow copy modificherebbe d"],
        explanation: "Evita effetti collaterali su annidati.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "JSON Dump",
        descTemplate: "Serialize dict a stringa JSON.",
        starterCode: "import json\nd = {'a': 1}\n",
        solutionCode: "import json\nd = {'a': 1}\nprint(json.dumps(d))",
        expectedOutput: "{\"a\": 1}",
        hints: ["json.dumps()", "Stringa valida"],
        explanation: "Standard exchange format.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Query String Parse",
        descTemplate: "Parse 'a=1&b=2' a dict.",
        starterCode: "qs = 'a=1&b=2'\n",
        solutionCode: "qs = 'a=1&b=2'\nprint({k:v for k,v in [pair.split('=') for pair in qs.split('&')]})",
        expectedOutput: "{'a': '1', 'b': '2'}",
        hints: ["Split & poi split =", "Nested comprehension"],
        explanation: "Parsing manuale semplice.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Switch Case Dict",
        descTemplate: "Simula switch case con dict di funzioni.",
        starterCode: "ops = {'inc': lambda x: x+1}\n",
        solutionCode: "ops = {'inc': lambda x: x+1}\nprint(ops['inc'](1))",
        expectedOutput: "2",
        hints: ["Mappa stringa -> funzione", "Dispatch table"],
        explanation: "Pattern comune in Python.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Sparse Matrix",
        descTemplate: "Rappresenta matrice sparsa con dict.",
        starterCode: "m = {(0, 0): 1, (9, 9): 1}\n",
        solutionCode: "m = {(0, 0): 1, (9, 9): 1}\nprint(m.get((0, 1), 0))",
        expectedOutput: "0",
        hints: ["Usa tuple come chiavi", "Default 0"],
        explanation: "Risparmia memoria per tanti zeri.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Memoization",
        descTemplate: "Cache fattoriale manuale.",
        starterCode: "cache = {}\ndef fact(n):\n    if n in cache: return cache[n]\n    return 1\n",
        solutionCode: "cache = {}\ndef fact(n):\n    if n in cache: return cache[n]\n    if n == 0: res = 1\n    else: res = n * fact(n-1)\n    cache[n] = res\n    return res\nprint(fact(3))",
        expectedOutput: "6",
        hints: ["Salva risultato prima di return", "Check chiavi cache"],
        explanation: "Ottimizzazione ricorsiva.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "Counter Arithmetic",
        descTemplate: "Somma due Counter.",
        starterCode: "from collections import Counter\nc1=Counter(a=1); c2=Counter(a=2)\n",
        solutionCode: "from collections import Counter\nc1=Counter(a=1); c2=Counter(a=2)\nprint((c1 + c2)['a'])",
        expectedOutput: "3",
        hints: ["Counter supportano +", "Somma valori"],
        explanation: "Multiset arithmetic.",
        brokenCode: "",
        debugHint: ""
      },
      {
        titleTemplate: "ReadOnly Proxy",
        descTemplate: "Crea vista read-only di dict.",
        starterCode: "from types import MappingProxyType\nd={'a':1}\n",
        solutionCode: "from types import MappingProxyType\nd={'a':1}\np = MappingProxyType(d)\nprint(p['a'])",
        expectedOutput: "1",
        hints: ["MappingProxyType", "Immutabile view"],
        explanation: "Protegge il dizionario originale.",
        brokenCode: "p['a'] = 2",
        debugHint: "TypeError: object does not support item assignment."
      }
    ],
  },

  // ==================== COLLECTIONS (Theory) ====================
  [PythonTopicId.Collections]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Tipi di collezioni",
        descTemplate: "Stampa il tipo di ogni collezione.",
        starterCode: "lista = [1, 2, 3]\ntupla = (1, 2, 3)\nset_example = {1, 2, 3}\ndict_example = {'a': 1}\n",
        solutionCode: "lista = [1, 2, 3]\ntupla = (1, 2, 3)\nset_example = {1, 2, 3}\ndict_example = {'a': 1}\nprint(type(lista).__name__)\nprint(type(tupla).__name__)\nprint(type(set_example).__name__)\nprint(type(dict_example).__name__)",
        expectedOutput: "list\ntuple\nset\ndict",
        hints: ["type() restituisce il tipo", "__name__ dà il nome come stringa"],
        explanation: "Python ha 4 tipi di collezioni principali.",
        brokenCode: "lista = [1, 2, 3]\nprint(lista.type)",
        debugHint: "Usa type(lista), non lista.type."
      },
      {
        titleTemplate: "Mutabile vs Immutabile",
        descTemplate: "Dimostra che le liste sono mutabili.",
        starterCode: "lista = [1, 2, 3]\n",
        solutionCode: "lista = [1, 2, 3]\nlista[0] = 99\nprint(lista)",
        expectedOutput: "[99, 2, 3]",
        hints: ["Le liste sono mutabili", "Puoi modificare elementi sul posto"],
        explanation: "Liste e dict sono mutabili, tuple e frozenset no.",
        brokenCode: "tupla = (1, 2, 3)\ntupla[0] = 99\nprint(tupla)",
        debugHint: "Le tuple sono immutabili, non puoi modificarle."
      },
      {
        titleTemplate: "Conversione tra tipi",
        descTemplate: "Converti una lista in tupla.",
        starterCode: "numeri = [1, 2, 3]\n",
        solutionCode: "numeri = [1, 2, 3]\nt = tuple(numeri)\nprint(t)\nprint(type(t).__name__)",
        expectedOutput: "(1, 2, 3)\ntuple",
        hints: ["tuple() converte in tupla", "list(), set(), dict() per altri tipi"],
        explanation: "Puoi convertire tra tipi di collezione.",
        brokenCode: "numeri = [1, 2, 3]\nt = (numeri)\nprint(t)",
        debugHint: "(numeri) mette parentesi ma resta lista, usa tuple()."
      }
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Quando usare cosa",
        descTemplate: "Crea un esempio dove un set è migliore di una lista.",
        starterCode: "lista_duplicati = [1, 2, 2, 3, 3, 3, 4]\n",
        solutionCode: "lista_duplicati = [1, 2, 2, 3, 3, 3, 4]\nunici = set(lista_duplicati)\nprint(unici)\nprint(len(unici))",
        expectedOutput: "{1, 2, 3, 4}\n4",
        hints: ["I set eliminano duplicati automaticamente", "Anche più veloci per 'in' check"],
        explanation: "Usa set quando hai bisogno di valori unici.",
        brokenCode: "lista = [1, 2, 2, 3]\nunici = []\nfor x in lista:\n    if x not in unici:\n        unici.append(x)\nprint(unici)",
        debugHint: "Funziona ma è lento. set() è O(1) per membership."
      },
      {
        titleTemplate: "Nested collections",
        descTemplate: "Accedi a un elemento in una struttura annidata.",
        starterCode: "dati = {'utenti': [{'nome': 'Mario', 'eta': 30}]}\n",
        solutionCode: "dati = {'utenti': [{'nome': 'Mario', 'eta': 30}]}\nprint(dati['utenti'][0]['nome'])",
        expectedOutput: "Mario",
        hints: ["Accedi livello per livello", "['utenti'] poi [0] poi ['nome']"],
        explanation: "Le collezioni possono essere annidate a qualsiasi profondità.",
        brokenCode: "dati = {'utenti': [{'nome': 'Mario', 'eta': 30}]}\nprint(dati.utenti[0].nome)",
        debugHint: "Python usa [] per accesso, non . come JavaScript."
      },
      {
        titleTemplate: "Ordinabile vs non ordinabile",
        descTemplate: "Ordina una lista ma mostra che i set non hanno ordine.",
        starterCode: "lista = [3, 1, 2]\nset_esempio = {3, 1, 2}\n",
        solutionCode: "lista = [3, 1, 2]\nset_esempio = {3, 1, 2}\nlista.sort()\nprint(lista)\nprint(sorted(set_esempio))",
        expectedOutput: "[1, 2, 3]\n[1, 2, 3]",
        hints: ["sort() modifica liste in-place", "sorted() funziona con qualsiasi iterabile"],
        explanation: "I set non hanno ordine, ma sorted() li converte in lista ordinata.",
        brokenCode: "s = {3, 1, 2}\ns.sort()\nprint(s)",
        debugHint: "I set non hanno sort(), usa sorted()."
      }
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Counter",
        descTemplate: "Usa Counter per contare occorrenze.",
        starterCode: "from collections import Counter\nparole = ['ciao', 'mondo', 'ciao', 'ciao']\n",
        solutionCode: "from collections import Counter\nparole = ['ciao', 'mondo', 'ciao', 'ciao']\nconteggio = Counter(parole)\nprint(conteggio['ciao'])",
        expectedOutput: "3",
        hints: ["Counter() conta automaticamente", "È un dizionario specializzato"],
        explanation: "Counter è perfetto per contare elementi.",
        brokenCode: "parole = ['ciao', 'mondo', 'ciao']\nconteggio = {}\nfor p in parole:\n    conteggio[p] += 1\nprint(conteggio)",
        debugHint: "KeyError! Devi inizializzare le chiavi o usare Counter."
      },
      {
        titleTemplate: "DefaultDict",
        descTemplate: "Usa defaultdict per evitare KeyError.",
        starterCode: "from collections import defaultdict\n",
        solutionCode: "from collections import defaultdict\ngruppi = defaultdict(list)\ngruppi['frutta'].append('mela')\ngruppi['frutta'].append('pera')\nprint(gruppi['frutta'])",
        expectedOutput: "['mela', 'pera']",
        hints: ["defaultdict(tipo) crea valori default", "list come factory crea liste vuote"],
        explanation: "defaultdict crea automaticamente valori quando accedi a chiavi inesistenti.",
        brokenCode: "gruppi = {}\ngruppi['frutta'].append('mela')",
        debugHint: "KeyError! 'frutta' non esiste, usa defaultdict."
      },
      {
        titleTemplate: "Deque",
        descTemplate: "Usa deque per operazioni efficienti alle estremità.",
        starterCode: "from collections import deque\n",
        solutionCode: "from collections import deque\nd = deque([1, 2, 3])\nd.appendleft(0)\nd.append(4)\nprint(list(d))",
        expectedOutput: "[0, 1, 2, 3, 4]",
        hints: ["appendleft() aggiunge a sinistra", "deque è ottimizzato per entrambi i lati"],
        explanation: "deque è O(1) per operazioni su entrambe le estremità.",
        brokenCode: "d = [1, 2, 3]\nd.appendleft(0)",
        debugHint: "Le liste non hanno appendleft(), usa insert(0, x) o deque."
      }
    ]
  }
};

// Generate exercises function
export const generatePythonExercises = (
  topicId: PythonTopicId,
  difficulty: Difficulty,
  count: number = 10
): PythonExercise[] => {
  const topicExercises = PYTHON_QUESTION_DATABASE[topicId];
  if (!topicExercises) {
    console.warn(`No exercises found for topic: ${topicId}`);
    return [];
  }

  const difficultyBlueprints = topicExercises[difficulty];
  if (!difficultyBlueprints || difficultyBlueprints.length === 0) {
    console.warn(`No exercises found for ${topicId} - ${difficulty}`);
    return [];
  }

  // Shuffle and take requested count
  const shuffled = shuffleArray(difficultyBlueprints);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Convert blueprints to exercises
  return selected.map((blueprint, index) => ({
    id: `${topicId}-${difficulty}-${index}-${Date.now()}`,
    topicId,
    difficulty,
    title: blueprint.titleTemplate,
    description: blueprint.descTemplate,
    starterCode: blueprint.starterCode,
    solutionCode: blueprint.solutionCode,
    expectedOutput: blueprint.expectedOutput,
    hints: blueprint.hints,
    explanation: blueprint.explanation,
    brokenCode: blueprint.brokenCode,
    debugHint: blueprint.debugHint
  }));
};

export { PYTHON_QUESTION_DATABASE };
