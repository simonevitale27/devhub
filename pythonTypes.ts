// Python-specific types for Python Lab exercises

import { Difficulty } from "./types";

// Python Topic IDs
export enum PythonTopicId {
  Operators = "operators",
  InputOutput = "input_output",
  Conditions = "conditions",
  Loops = "loops",
  Collections = "collections",
  Lists = "lists",
  Tuples = "tuples",
  Sets = "sets",
  Dictionaries = "dictionaries",
}

// Python Topic metadata
export interface PythonTopic {
  id: PythonTopicId;
  label: string;
  subtitle?: string;
  description?: string;
  icon?: string;
}

// Test case for validating Python output
export interface PythonTestCase {
  input?: string; // Input to provide to the program
  expectedOutput: string; // Expected stdout
  description?: string; // Description of what this test checks
}

// Python Exercise structure
export interface PythonExercise {
  id: string;
  topicId: PythonTopicId;
  difficulty: Difficulty;
  title: string;
  description: string;
  starterCode: string; // Initial code shown to user
  solutionCode: string; // Correct solution
  expectedOutput: string; // Expected program output
  testCases?: PythonTestCase[]; // Additional test cases
  hints: string[];
  explanation: string;
  brokenCode?: string; // For Debug Mode: code with error
  debugHint?: string; // For Debug Mode: hint about error
}

// Result from running Python code
export interface PythonResult {
  success: boolean;
  output: string; // stdout
  error?: string; // stderr or exception
  executionTime?: number; // ms
}

// Validation result for exercise
export interface PythonValidationResult {
  isCorrect: boolean;
  message: string;
  userOutput: string;
  expectedOutput: string;
  hints?: string[];
}

// Python exercise blueprint for generator
export interface PythonExerciseBlueprint {
  titleTemplate: string;
  descTemplate: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hints: string[];
  explanation: string;
  brokenCode?: string;
  debugHint?: string;
}

// Topics configuration
export const PYTHON_TOPICS: PythonTopic[] = [
  {
    id: PythonTopicId.Operators,
    label: "Operatori",
    subtitle: "+, -, *, /, //, %, **",
    description: "Operatori aritmetici, precedenza e funzioni matematiche",
  },
  {
    id: PythonTopicId.InputOutput,
    label: "Input/Output",
    subtitle: "input(), print()",
    description: "Input utente e output formattato",
  },
  {
    id: PythonTopicId.Conditions,
    label: "Condizioni",
    subtitle: "if, elif, else",
    description: "Strutture condizionali e operatori logici",
  },
  {
    id: PythonTopicId.Loops,
    label: "Cicli",
    subtitle: "for, while, range()",
    description: "Cicli, iterazione e controllo flusso",
  },
  {
    id: PythonTopicId.Collections,
    label: "Collezioni",
    subtitle: "Teoria",
    description: "Concetti: ordinato, indicizzato, modificabile",
  },
  {
    id: PythonTopicId.Lists,
    label: "Liste",
    subtitle: "list[], append, slice",
    description: "Creazione, modifica e iterazione su liste",
  },
  {
    id: PythonTopicId.Tuples,
    label: "Tuple",
    subtitle: "tuple(), immutabili",
    description: "Tuple, unpacking e immutabilità",
  },
  {
    id: PythonTopicId.Sets,
    label: "Set",
    subtitle: "set{}, union, intersection",
    description: "Insiemi e operazioni insiemistiche",
  },
  {
    id: PythonTopicId.Dictionaries,
    label: "Dizionari",
    subtitle: "dict{}, keys, values",
    description: "Coppie chiave-valore e accesso dati",
  },
];
