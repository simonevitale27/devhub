
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export enum TopicId {
  Basics = 'basics',
  Filtering = 'filtering',
  Sorting = 'sorting',
  Functions = 'functions',
  Dates = 'dates',
  Joins = 'joins',
  Aggregation = 'aggregation',
  Case = 'case',
  Advanced = 'advanced'
}

export enum Page {
  Home = 'home',
  SqlGym = 'sql_gym',
  CodeChecker = 'code_checker',
  PythonGym = 'python_gym',
  AngularGym = 'angular_gym'
}

export enum PracticeMode {
  Solve = 'solve', // Standard problem solving
  Type = 'type'    // Copy code / Typing Dojo
}

export interface TableColumn {
  name: string;
  type: string;
}

export interface TableSchema {
  tableName: string;
  columns: TableColumn[];
}

export interface Exercise {
  id: string;
  topicId: TopicId;
  difficulty: Difficulty;
  title: string;
  description: string;
  initialQuery: string;
  solutionQuery: string;
  hints: string[];
  explanation: string;
}

export interface Topic {
  id: TopicId;
  label: string;
  subtitle?: string; // SQL Keywords like SELECT, WHERE...
  description?: string;
  icon?: any;
}

export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isCorrect: boolean;
  userRowCount: number;
  expectedRowCount: number;
  message: string;
}

export interface DiffResult {
  missingRows: any[];
  extraRows: any[];
  differentCells: { rowIndex: number; column: string }[];
}

export interface ChartConfig {
  type: 'bar' | 'pie' | 'kpi' | 'none';
  xKey: string;
  yKey: string;
}