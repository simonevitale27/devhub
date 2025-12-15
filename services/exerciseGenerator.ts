import { Difficulty, Exercise, TopicId } from "../types";

// --- UTILS ---
const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Shuffle array function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- DATA LISTS (TechStore Schema) ---
const DATA = {
  tables: [
    "Users",
    "Products",
    "Orders",
    "OrderItems",
    "Employees",
  ],
  columns_users: ["name", "email", "country", "is_premium", "created_at"],
  columns_products: ["name", "category", "price", "stock"],
  columns_orders: ["user_id", "order_date", "status", "order_total"],
  columns_orderitems: ["order_id", "product_id", "quantity", "unit_price"],
  columns_employees: ["name", "department", "hire_date", "manager_id"],
  countries: [
    "Italy",
    "France",
    "Germany",
    "Spain",
    "USA",
    "Netherlands",
    "UK",
    "Japan",
    "Canada",
  ],
  names: [
    "Mario Rossi",
    "Luigi Verdi",
    "John Doe",
    "Sophie Martin",
    "Marco Bianchi",
    "Giulia Neri",
    "Luca Ferrari",
    "Alice Chen",
  ],
  categories: [
    "Electronics",
    "Home",
    "Clothing",
    "Books",
    "Garden",
    "Sports",
    "Beauty",
  ],
  departments: [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
  ],
  order_statuses: ["Pending", "Shipped", "Delivered", "Cancelled"],
  product_names: [
    "Laptop Pro",
    "Smartphone X",
    "Monitor 4K",
    "T-Shirt Basic",
    "Modern Sofa",
    "Wireless Mouse",
    "Headphones Pro",
  ],
  prices_min: [10, 20, 50, 100, 150],
  prices_max: [200, 300, 500, 1000, 2000],
  years: [2022, 2023, 2024],
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  percentages: [1.1, 1.22, 0.9, 0.8, 1.5],
  stock_thresholds: [5, 10, 20, 50],
};


// --- BLUEPRINT INTERFACE ---
interface ExerciseBlueprint {
  titleTemplate: string;
  descTemplate: string;
  queryTemplate: string;
  hints: string[];
  explanation: string;
  replacements?: Record<string, (string | number)[]>;
  brokenCode?: string; // For Debug Mode: query with intentional error
  debugHint?: string; // For Debug Mode: hint about the error
}

// --- QUESTION DATABASE ---
const QUESTION_DATABASE: Record<string, Record<string, ExerciseBlueprint[]>> = {
  [TopicId.Basics]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Tutti i dati di Users",
        descTemplate: "Seleziona tutte le colonne dalla tabella Users.",
        queryTemplate: "SELECT * FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Users FROM *",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Tutti i dati di Products",
        descTemplate: "Seleziona tutte le colonne dalla tabella Products.",
        queryTemplate: "SELECT * FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Products FROM *",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Tutti i dati di Orders",
        descTemplate: "Seleziona tutte le colonne dalla tabella Orders.",
        queryTemplate: "SELECT * FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Orders FROM *",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Tutti i dati di OrderItems",
        descTemplate: "Seleziona tutte le colonne dalla tabella OrderItems.",
        queryTemplate: "SELECT * FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT OrderItems FROM *",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Tutti i dati di Employees",
        descTemplate: "Seleziona tutte le colonne dalla tabella Employees.",
        queryTemplate: "SELECT * FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Employees FROM *",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna name di Users",
        descTemplate: "Seleziona solo la colonna name dalla tabella Users.",
        queryTemplate: "SELECT name FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Users FROM name",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna email di Users",
        descTemplate: "Seleziona solo la colonna email dalla tabella Users.",
        queryTemplate: "SELECT email FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Users FROM email",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna country di Users",
        descTemplate: "Seleziona solo la colonna country dalla tabella Users.",
        queryTemplate: "SELECT country FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Users FROM country",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna name di Products",
        descTemplate: "Seleziona solo la colonna name dalla tabella Products.",
        queryTemplate: "SELECT name FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Products FROM name",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna category di Products",
        descTemplate: "Seleziona solo la colonna category dalla tabella Products.",
        queryTemplate: "SELECT category FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Products FROM category",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna price di Products",
        descTemplate: "Seleziona solo la colonna price dalla tabella Products.",
        queryTemplate: "SELECT price FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Products FROM price",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna id di Orders",
        descTemplate: "Seleziona solo la colonna id dalla tabella Orders.",
        queryTemplate: "SELECT id FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Orders FROM id",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna user_id di Orders",
        descTemplate: "Seleziona solo la colonna user_id dalla tabella Orders.",
        queryTemplate: "SELECT user_id FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Orders FROM user_id",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna order_date di Orders",
        descTemplate: "Seleziona solo la colonna order_date dalla tabella Orders.",
        queryTemplate: "SELECT order_date FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Orders FROM order_date",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna id di OrderItems",
        descTemplate: "Seleziona solo la colonna id dalla tabella OrderItems.",
        queryTemplate: "SELECT id FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT OrderItems FROM id",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna order_id di OrderItems",
        descTemplate: "Seleziona solo la colonna order_id dalla tabella OrderItems.",
        queryTemplate: "SELECT order_id FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT OrderItems FROM order_id",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna product_id di OrderItems",
        descTemplate: "Seleziona solo la colonna product_id dalla tabella OrderItems.",
        queryTemplate: "SELECT product_id FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT OrderItems FROM product_id",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna name di Employees",
        descTemplate: "Seleziona solo la colonna name dalla tabella Employees.",
        queryTemplate: "SELECT name FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Employees FROM name",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna department di Employees",
        descTemplate: "Seleziona solo la colonna department dalla tabella Employees.",
        queryTemplate: "SELECT department FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Employees FROM department",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Colonna hire_date di Employees",
        descTemplate: "Seleziona solo la colonna hire_date dalla tabella Employees.",
        queryTemplate: "SELECT hire_date FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT Employees FROM hire_date",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Due colonne di Users",
        descTemplate: "Seleziona name e email da Users.",
        queryTemplate: "SELECT name, email FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name email FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Altra coppia di Users",
        descTemplate: "Seleziona email e name da Users.",
        queryTemplate: "SELECT email, name FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT email AND name FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Due colonne di Products",
        descTemplate: "Seleziona name e category da Products.",
        queryTemplate: "SELECT name, category FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name category FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Altra coppia di Products",
        descTemplate: "Seleziona category e name da Products.",
        queryTemplate: "SELECT category, name FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT category AND name FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Due colonne di Orders",
        descTemplate: "Seleziona id e user_id da Orders.",
        queryTemplate: "SELECT id, user_id FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id user_id FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Altra coppia di Orders",
        descTemplate: "Seleziona user_id e id da Orders.",
        queryTemplate: "SELECT user_id, id FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT user_id AND id FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Due colonne di OrderItems",
        descTemplate: "Seleziona id e order_id da OrderItems.",
        queryTemplate: "SELECT id, order_id FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id order_id FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Altra coppia di OrderItems",
        descTemplate: "Seleziona order_id e id da OrderItems.",
        queryTemplate: "SELECT order_id, id FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT order_id AND id FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Due colonne di Employees",
        descTemplate: "Seleziona name e department da Employees.",
        queryTemplate: "SELECT name, department FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name department FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Altra coppia di Employees",
        descTemplate: "Seleziona department e name da Employees.",
        queryTemplate: "SELECT department, name FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT department AND name FROM Employees",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Alias per name",
        descTemplate: "Seleziona name renaming it as 'Valore'.",
        queryTemplate: "SELECT name AS Valore FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name IS Valore FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Distinct name",
        descTemplate: "Seleziona valori unici di name.",
        queryTemplate: "SELECT DISTINCT name FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT UNIQUE name FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias per name",
        descTemplate: "Seleziona name renaming it as 'Valore'.",
        queryTemplate: "SELECT name AS Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name IS Valore FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Distinct name",
        descTemplate: "Seleziona valori unici di name.",
        queryTemplate: "SELECT DISTINCT name FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT UNIQUE name FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias per id",
        descTemplate: "Seleziona id renaming it as 'Valore'.",
        queryTemplate: "SELECT id AS Valore FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id IS Valore FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Distinct id",
        descTemplate: "Seleziona valori unici di id.",
        queryTemplate: "SELECT DISTINCT id FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT UNIQUE id FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias per id",
        descTemplate: "Seleziona id renaming it as 'Valore'.",
        queryTemplate: "SELECT id AS Valore FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id IS Valore FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Distinct id",
        descTemplate: "Seleziona valori unici di id.",
        queryTemplate: "SELECT DISTINCT id FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT UNIQUE id FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias per name",
        descTemplate: "Seleziona name renaming it as 'Valore'.",
        queryTemplate: "SELECT name AS Valore FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name IS Valore FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Distinct name",
        descTemplate: "Seleziona valori unici di name.",
        queryTemplate: "SELECT DISTINCT name FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT UNIQUE name FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo su price",
        descTemplate: "Seleziona price moltiplicato per 2.",
        queryTemplate: "SELECT price * 2 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT price x 2 FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo IVA price",
        descTemplate: "Seleziona price e il valore con IVA (1.22).",
        queryTemplate: "SELECT price, price * 1.22 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT price + 22% FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo su stock",
        descTemplate: "Seleziona stock moltiplicato per 2.",
        queryTemplate: "SELECT stock * 2 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT stock x 2 FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo IVA stock",
        descTemplate: "Seleziona stock e il valore con IVA (1.22).",
        queryTemplate: "SELECT stock, stock * 1.22 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT stock + 22% FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo su order_total",
        descTemplate: "Seleziona order_total moltiplicato per 2.",
        queryTemplate: "SELECT order_total * 2 FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT order_total x 2 FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo IVA order_total",
        descTemplate: "Seleziona order_total e il valore con IVA (1.22).",
        queryTemplate: "SELECT order_total, order_total * 1.22 FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT order_total + 22% FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo su quantity",
        descTemplate: "Seleziona quantity moltiplicato per 2.",
        queryTemplate: "SELECT quantity * 2 FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT quantity x 2 FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Calcolo IVA quantity",
        descTemplate: "Seleziona quantity e il valore con IVA (1.22).",
        queryTemplate: "SELECT quantity, quantity * 1.22 FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT quantity + 22% FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 0",
        descTemplate: "Seleziona name come 'Colonna_0'.",
        queryTemplate: "SELECT name AS Colonna_0 FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_0 FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 1",
        descTemplate: "Seleziona name come 'Colonna_1'.",
        queryTemplate: "SELECT name AS Colonna_1 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_1 FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 2",
        descTemplate: "Seleziona id come 'Colonna_2'.",
        queryTemplate: "SELECT id AS Colonna_2 FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id = Colonna_2 FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 3",
        descTemplate: "Seleziona id come 'Colonna_3'.",
        queryTemplate: "SELECT id AS Colonna_3 FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id = Colonna_3 FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 4",
        descTemplate: "Seleziona name come 'Colonna_4'.",
        queryTemplate: "SELECT name AS Colonna_4 FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_4 FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 5",
        descTemplate: "Seleziona name come 'Colonna_5'.",
        queryTemplate: "SELECT name AS Colonna_5 FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_5 FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 6",
        descTemplate: "Seleziona name come 'Colonna_6'.",
        queryTemplate: "SELECT name AS Colonna_6 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_6 FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 7",
        descTemplate: "Seleziona id come 'Colonna_7'.",
        queryTemplate: "SELECT id AS Colonna_7 FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id = Colonna_7 FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 8",
        descTemplate: "Seleziona id come 'Colonna_8'.",
        queryTemplate: "SELECT id AS Colonna_8 FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT id = Colonna_8 FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 9",
        descTemplate: "Seleziona name come 'Colonna_9'.",
        queryTemplate: "SELECT name AS Colonna_9 FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_9 FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 10",
        descTemplate: "Seleziona name come 'Colonna_10'.",
        queryTemplate: "SELECT name AS Colonna_10 FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_10 FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Alias Misto 11",
        descTemplate: "Seleziona name come 'Colonna_11'.",
        queryTemplate: "SELECT name AS Colonna_11 FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name = Colonna_11 FROM Products",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Costante per Users",
        descTemplate: "Seleziona tutte le colonne di Users e una colonna fissa 'Test'.",
        queryTemplate: "SELECT *, 'Test' as Label FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT *, Test FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Costante per Products",
        descTemplate: "Seleziona tutte le colonne di Products e una colonna fissa 'Test'.",
        queryTemplate: "SELECT *, 'Test' as Label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT *, Test FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Costante per Orders",
        descTemplate: "Seleziona tutte le colonne di Orders e una colonna fissa 'Test'.",
        queryTemplate: "SELECT *, 'Test' as Label FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT *, Test FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Costante per OrderItems",
        descTemplate: "Seleziona tutte le colonne di OrderItems e una colonna fissa 'Test'.",
        queryTemplate: "SELECT *, 'Test' as Label FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT *, Test FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Costante per Employees",
        descTemplate: "Seleziona tutte le colonne di Employees e una colonna fissa 'Test'.",
        queryTemplate: "SELECT *, 'Test' as Label FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT *, Test FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Primi 3 Users",
        descTemplate: "Seleziona le prime 3 righe da Users.",
        queryTemplate: "SELECT * FROM Users LIMIT 3",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT TOP 3 * FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Offset Users",
        descTemplate: "Seleziona 2 righe da Users saltando la prima.",
        queryTemplate: "SELECT * FROM Users LIMIT 2 OFFSET 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users SKIP 1 LIMIT 2",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Primi 3 Products",
        descTemplate: "Seleziona le prime 3 righe da Products.",
        queryTemplate: "SELECT * FROM Products LIMIT 3",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT TOP 3 * FROM Products",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Offset Products",
        descTemplate: "Seleziona 2 righe da Products saltando la prima.",
        queryTemplate: "SELECT * FROM Products LIMIT 2 OFFSET 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products SKIP 1 LIMIT 2",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Primi 3 Orders",
        descTemplate: "Seleziona le prime 3 righe da Orders.",
        queryTemplate: "SELECT * FROM Orders LIMIT 3",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT TOP 3 * FROM Orders",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Offset Orders",
        descTemplate: "Seleziona 2 righe da Orders saltando la prima.",
        queryTemplate: "SELECT * FROM Orders LIMIT 2 OFFSET 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders SKIP 1 LIMIT 2",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Primi 3 OrderItems",
        descTemplate: "Seleziona le prime 3 righe da OrderItems.",
        queryTemplate: "SELECT * FROM OrderItems LIMIT 3",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT TOP 3 * FROM OrderItems",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Offset OrderItems",
        descTemplate: "Seleziona 2 righe da OrderItems saltando la prima.",
        queryTemplate: "SELECT * FROM OrderItems LIMIT 2 OFFSET 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems SKIP 1 LIMIT 2",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Primi 3 Employees",
        descTemplate: "Seleziona le prime 3 righe da Employees.",
        queryTemplate: "SELECT * FROM Employees LIMIT 3",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT TOP 3 * FROM Employees",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Offset Employees",
        descTemplate: "Seleziona 2 righe da Employees saltando la prima.",
        queryTemplate: "SELECT * FROM Employees LIMIT 2 OFFSET 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees SKIP 1 LIMIT 2",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 15",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 16",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 17",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 18",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 19",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 20",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 21",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 22",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 23",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 24",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 25",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 26",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 27",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 28",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Select Complex 29",
        descTemplate: "Seleziona nome e email con alias specifici.",
        queryTemplate: "SELECT name as N, email as E FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT name N, email E FROM Users",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Filtering]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Filtra ID Users",
        descTemplate: "Seleziona da Users dove id = 1.",
        queryTemplate: "SELECT * FROM Users WHERE id = 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users IF id = 1",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra ID Products",
        descTemplate: "Seleziona da Products dove id = 1.",
        queryTemplate: "SELECT * FROM Products WHERE id = 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products IF id = 1",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra ID Orders",
        descTemplate: "Seleziona da Orders dove id = 1.",
        queryTemplate: "SELECT * FROM Orders WHERE id = 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders IF id = 1",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra ID OrderItems",
        descTemplate: "Seleziona da OrderItems dove id = 1.",
        queryTemplate: "SELECT * FROM OrderItems WHERE id = 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM OrderItems IF id = 1",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra ID Employees",
        descTemplate: "Seleziona da Employees dove id = 1.",
        queryTemplate: "SELECT * FROM Employees WHERE id = 1",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Employees IF id = 1",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra country 0",
        descTemplate: "Seleziona da Users dove country è 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra country 1",
        descTemplate: "Seleziona da Users dove country è 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra country 2",
        descTemplate: "Seleziona da Users dove country è 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra country 3",
        descTemplate: "Seleziona da Users dove country è 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra country 4",
        descTemplate: "Seleziona da Users dove country è 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Users WHERE country IS 'Italy'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra category 0",
        descTemplate: "Seleziona da Products dove category è 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category IS 'Electronics'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra category 1",
        descTemplate: "Seleziona da Products dove category è 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category IS 'Electronics'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra category 2",
        descTemplate: "Seleziona da Products dove category è 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category IS 'Electronics'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra category 3",
        descTemplate: "Seleziona da Products dove category è 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category IS 'Electronics'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra category 4",
        descTemplate: "Seleziona da Products dove category è 'Electronics'.",
        queryTemplate: "SELECT * FROM Products WHERE category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE category IS 'Electronics'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra status 0",
        descTemplate: "Seleziona da Orders dove status è 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status IS 'Shipped'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra status 1",
        descTemplate: "Seleziona da Orders dove status è 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status IS 'Shipped'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra status 2",
        descTemplate: "Seleziona da Orders dove status è 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status IS 'Shipped'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra status 3",
        descTemplate: "Seleziona da Orders dove status è 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status IS 'Shipped'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra status 4",
        descTemplate: "Seleziona da Orders dove status è 'Shipped'.",
        queryTemplate: "SELECT * FROM Orders WHERE status = 'Shipped'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE status IS 'Shipped'",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra price > 10",
        descTemplate: "Seleziona da Products dove price > 10.",
        queryTemplate: "SELECT * FROM Products WHERE price > 10",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price BIGGER 10",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra price > 10",
        descTemplate: "Seleziona da Products dove price > 10.",
        queryTemplate: "SELECT * FROM Products WHERE price > 10",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price BIGGER 10",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra price > 10",
        descTemplate: "Seleziona da Products dove price > 10.",
        queryTemplate: "SELECT * FROM Products WHERE price > 10",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price BIGGER 10",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra price > 10",
        descTemplate: "Seleziona da Products dove price > 10.",
        queryTemplate: "SELECT * FROM Products WHERE price > 10",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE price BIGGER 10",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra stock > 5",
        descTemplate: "Seleziona da Products dove stock > 5.",
        queryTemplate: "SELECT * FROM Products WHERE stock > 5",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock BIGGER 5",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra stock > 5",
        descTemplate: "Seleziona da Products dove stock > 5.",
        queryTemplate: "SELECT * FROM Products WHERE stock > 5",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock BIGGER 5",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra stock > 5",
        descTemplate: "Seleziona da Products dove stock > 5.",
        queryTemplate: "SELECT * FROM Products WHERE stock > 5",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock BIGGER 5",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra stock > 5",
        descTemplate: "Seleziona da Products dove stock > 5.",
        queryTemplate: "SELECT * FROM Products WHERE stock > 5",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Products WHERE stock BIGGER 5",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra order_total > 100",
        descTemplate: "Seleziona da Orders dove order_total > 100.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > 100",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_total BIGGER 100",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Filtra order_total > 100",
        descTemplate: "Seleziona da Orders dove order_total > 100.",
        queryTemplate: "SELECT * FROM Orders WHERE order_total > 100",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "SELECT * FROM Orders WHERE order_total BIGGER 100",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Logica AND 0",
        descTemplate: "Filtra Users con id > 0 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 0 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 1",
        descTemplate: "Filtra Users con id > 1 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 1 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 2",
        descTemplate: "Filtra Users con id > 2 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 2 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 3",
        descTemplate: "Filtra Users con id > 3 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 3 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 4",
        descTemplate: "Filtra Users con id > 4 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 4 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 5",
        descTemplate: "Filtra Users con id > 5 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 5 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 6",
        descTemplate: "Filtra Users con id > 6 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 6 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 7",
        descTemplate: "Filtra Users con id > 7 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 7 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 8",
        descTemplate: "Filtra Users con id > 8 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 8 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 9",
        descTemplate: "Filtra Users con id > 9 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 9 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 10",
        descTemplate: "Filtra Users con id > 10 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 10 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 11",
        descTemplate: "Filtra Users con id > 11 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 11 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 12",
        descTemplate: "Filtra Users con id > 12 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 12 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 13",
        descTemplate: "Filtra Users con id > 13 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 13 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 14",
        descTemplate: "Filtra Users con id > 14 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 14 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 15",
        descTemplate: "Filtra Users con id > 15 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 15 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 16",
        descTemplate: "Filtra Users con id > 16 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 16 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 17",
        descTemplate: "Filtra Users con id > 17 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 17 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 18",
        descTemplate: "Filtra Users con id > 18 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 18 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 19",
        descTemplate: "Filtra Users con id > 19 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 19 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 20",
        descTemplate: "Filtra Users con id > 20 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 20 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 21",
        descTemplate: "Filtra Users con id > 21 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 21 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 22",
        descTemplate: "Filtra Users con id > 22 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 22 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 23",
        descTemplate: "Filtra Users con id > 23 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 23 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 24",
        descTemplate: "Filtra Users con id > 24 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 24 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 25",
        descTemplate: "Filtra Users con id > 25 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 25 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 26",
        descTemplate: "Filtra Users con id > 26 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 26 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 27",
        descTemplate: "Filtra Users con id > 27 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 27 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica AND 28",
        descTemplate: "Filtra Users con id > 28 AND country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 28 AND country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Logica OR 29",
        descTemplate: "Filtra Users con id > 29 OR country = 'Italy'.",
        queryTemplate: "SELECT * FROM Users WHERE id > 29 OR country = 'Italy'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Like 0",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 1",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 2",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 3",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 4",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 5",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 6",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 7",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 8",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Like 9",
        descTemplate: "Email contains '@gmail'.",
        queryTemplate: "SELECT * FROM Users WHERE email LIKE '%@gmail%'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 0",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 1",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 2",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 3",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 4",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 5",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 6",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 7",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 8",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Null Check 9",
        descTemplate: "Manager IS NULL",
        queryTemplate: "SELECT * FROM Employees WHERE manager_id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 0",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 1",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 2",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 3",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 4",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 5",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 6",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 7",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 8",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex 9",
        descTemplate: "AND + OR usage.",
        queryTemplate: "SELECT * FROM Products WHERE (price < 10 OR stock > 50) AND category = 'Electronics'",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Sorting]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Ordina Users name",
        descTemplate: "Ordina Users per name crescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY name ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Users name DESC",
        descTemplate: "Ordina Users per name decrescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Users email",
        descTemplate: "Ordina Users per email crescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY email ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Users email DESC",
        descTemplate: "Ordina Users per email decrescente.",
        queryTemplate: "SELECT * FROM Users ORDER BY email DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Products name",
        descTemplate: "Ordina Products per name crescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY name ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Products name DESC",
        descTemplate: "Ordina Products per name decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Products category",
        descTemplate: "Ordina Products per category crescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY category ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Products category DESC",
        descTemplate: "Ordina Products per category decrescente.",
        queryTemplate: "SELECT * FROM Products ORDER BY category DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Orders id",
        descTemplate: "Ordina Orders per id crescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY id ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Orders id DESC",
        descTemplate: "Ordina Orders per id decrescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY id DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Orders user_id",
        descTemplate: "Ordina Orders per user_id crescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY user_id ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Orders user_id DESC",
        descTemplate: "Ordina Orders per user_id decrescente.",
        queryTemplate: "SELECT * FROM Orders ORDER BY user_id DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina OrderItems id",
        descTemplate: "Ordina OrderItems per id crescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY id ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina OrderItems id DESC",
        descTemplate: "Ordina OrderItems per id decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY id DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina OrderItems order_id",
        descTemplate: "Ordina OrderItems per order_id crescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY order_id ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina OrderItems order_id DESC",
        descTemplate: "Ordina OrderItems per order_id decrescente.",
        queryTemplate: "SELECT * FROM OrderItems ORDER BY order_id DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Employees name",
        descTemplate: "Ordina Employees per name crescente.",
        queryTemplate: "SELECT * FROM Employees ORDER BY name ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Employees name DESC",
        descTemplate: "Ordina Employees per name decrescente.",
        queryTemplate: "SELECT * FROM Employees ORDER BY name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Employees department",
        descTemplate: "Ordina Employees per department crescente.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department ASC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Ordina Employees department DESC",
        descTemplate: "Ordina Employees per department decrescente.",
        queryTemplate: "SELECT * FROM Employees ORDER BY department DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Sort Multi 0",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 1",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 2",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 3",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 4",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 5",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 6",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 7",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 8",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 9",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 10",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 11",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 12",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 13",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 14",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 15",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 16",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 17",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 18",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 19",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 20",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 21",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 22",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 23",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 24",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 25",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 26",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 27",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 28",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Multi 29",
        descTemplate: "Sort by Country ASC, Name DESC",
        queryTemplate: "SELECT * FROM Users ORDER BY country ASC, name DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Sort Calc 0",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 1",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 2",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 3",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 4",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 5",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 6",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 7",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 8",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 9",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 10",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 11",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 12",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 13",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 14",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 15",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 16",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 17",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 18",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 19",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 20",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 21",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 22",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 23",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 24",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 25",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 26",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 27",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 28",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Calc 29",
        descTemplate: "Sort by price * stock",
        queryTemplate: "SELECT *, price * stock as val FROM Products ORDER BY price * stock DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Aggregation]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Conta totale Users",
        descTemplate: "Conta quante righe ci sono in Users.",
        queryTemplate: "SELECT COUNT(*) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Conta totale Products",
        descTemplate: "Conta quante righe ci sono in Products.",
        queryTemplate: "SELECT COUNT(*) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Conta totale Orders",
        descTemplate: "Conta quante righe ci sono in Orders.",
        queryTemplate: "SELECT COUNT(*) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Conta totale OrderItems",
        descTemplate: "Conta quante righe ci sono in OrderItems.",
        queryTemplate: "SELECT COUNT(*) FROM OrderItems",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Conta totale Employees",
        descTemplate: "Conta quante righe ci sono in Employees.",
        queryTemplate: "SELECT COUNT(*) FROM Employees",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "SUM di price",
        descTemplate: "Calcola SUM della colonna price in Products.",
        queryTemplate: "SELECT SUM(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "SUM price Alias",
        descTemplate: "Calcola SUM di price come 'Valore'.",
        queryTemplate: "SELECT SUM(price) as Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "SUM di stock",
        descTemplate: "Calcola SUM della colonna stock in Products.",
        queryTemplate: "SELECT SUM(stock) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "SUM stock Alias",
        descTemplate: "Calcola SUM di stock come 'Valore'.",
        queryTemplate: "SELECT SUM(stock) as Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "SUM di order_total",
        descTemplate: "Calcola SUM della colonna order_total in Orders.",
        queryTemplate: "SELECT SUM(order_total) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "SUM order_total Alias",
        descTemplate: "Calcola SUM di order_total come 'Valore'.",
        queryTemplate: "SELECT SUM(order_total) as Valore FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "AVG di price",
        descTemplate: "Calcola AVG della colonna price in Products.",
        queryTemplate: "SELECT AVG(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "AVG price Alias",
        descTemplate: "Calcola AVG di price come 'Valore'.",
        queryTemplate: "SELECT AVG(price) as Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "AVG di stock",
        descTemplate: "Calcola AVG della colonna stock in Products.",
        queryTemplate: "SELECT AVG(stock) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "AVG stock Alias",
        descTemplate: "Calcola AVG di stock come 'Valore'.",
        queryTemplate: "SELECT AVG(stock) as Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "AVG di order_total",
        descTemplate: "Calcola AVG della colonna order_total in Orders.",
        queryTemplate: "SELECT AVG(order_total) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "AVG order_total Alias",
        descTemplate: "Calcola AVG di order_total come 'Valore'.",
        queryTemplate: "SELECT AVG(order_total) as Valore FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MIN di price",
        descTemplate: "Calcola MIN della colonna price in Products.",
        queryTemplate: "SELECT MIN(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MIN price Alias",
        descTemplate: "Calcola MIN di price come 'Valore'.",
        queryTemplate: "SELECT MIN(price) as Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MIN di order_total",
        descTemplate: "Calcola MIN della colonna order_total in Orders.",
        queryTemplate: "SELECT MIN(order_total) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MIN order_total Alias",
        descTemplate: "Calcola MIN di order_total come 'Valore'.",
        queryTemplate: "SELECT MIN(order_total) as Valore FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MIN di created_at",
        descTemplate: "Calcola MIN della colonna created_at in Users.",
        queryTemplate: "SELECT MIN(created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MIN created_at Alias",
        descTemplate: "Calcola MIN di created_at come 'Valore'.",
        queryTemplate: "SELECT MIN(created_at) as Valore FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MAX di price",
        descTemplate: "Calcola MAX della colonna price in Products.",
        queryTemplate: "SELECT MAX(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MAX price Alias",
        descTemplate: "Calcola MAX di price come 'Valore'.",
        queryTemplate: "SELECT MAX(price) as Valore FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MAX di order_total",
        descTemplate: "Calcola MAX della colonna order_total in Orders.",
        queryTemplate: "SELECT MAX(order_total) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MAX order_total Alias",
        descTemplate: "Calcola MAX di order_total come 'Valore'.",
        queryTemplate: "SELECT MAX(order_total) as Valore FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MAX di created_at",
        descTemplate: "Calcola MAX della colonna created_at in Users.",
        queryTemplate: "SELECT MAX(created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MAX created_at Alias",
        descTemplate: "Calcola MAX di created_at come 'Valore'.",
        queryTemplate: "SELECT MAX(created_at) as Valore FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Aggregazione Extra",
        descTemplate: "...",
        queryTemplate: "SELECT COUNT(*) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Group by country",
        descTemplate: "Conta righe per country.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Avg per country",
        descTemplate: "Media per country.",
        queryTemplate: "SELECT country, AVG(id) FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group by category",
        descTemplate: "Conta righe per category.",
        queryTemplate: "SELECT category, COUNT(*) FROM Products GROUP BY category",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Avg per category",
        descTemplate: "Media per category.",
        queryTemplate: "SELECT category, AVG(id) FROM Products GROUP BY category",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group by status",
        descTemplate: "Conta righe per status.",
        queryTemplate: "SELECT status, COUNT(*) FROM Orders GROUP BY status",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Avg per status",
        descTemplate: "Media per status.",
        queryTemplate: "SELECT status, AVG(id) FROM Orders GROUP BY status",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group by department",
        descTemplate: "Conta righe per department.",
        queryTemplate: "SELECT department, COUNT(*) FROM Employees GROUP BY department",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Avg per department",
        descTemplate: "Media per department.",
        queryTemplate: "SELECT department, AVG(id) FROM Employees GROUP BY department",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Media Prezzo per Categoria",
        descTemplate: "...",
        queryTemplate: "SELECT category, AVG(price) FROM Products GROUP BY category",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Totale Ordini per Status",
        descTemplate: "...",
        queryTemplate: "SELECT status, SUM(order_total) FROM Orders GROUP BY status",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 0",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_0 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 1",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_1 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 2",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_2 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 3",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_3 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 4",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_4 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 5",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_5 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 6",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_6 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 7",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_7 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 8",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_8 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 9",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_9 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 10",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_10 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 11",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_11 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 12",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_12 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 13",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_13 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 14",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_14 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 15",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_15 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 16",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_16 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 17",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_17 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 18",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_18 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Group By Variation 19",
        descTemplate: "...",
        queryTemplate: "SELECT country, COUNT(*) as cnt_19 FROM Users GROUP BY country",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Having Count > 0",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 0.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 0",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 10",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 10.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 10",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 20",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 20.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 20",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 30",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 30.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 30",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 40",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 40.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 40",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 50",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 50.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 50",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 60",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 60.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 60",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 70",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 70.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 70",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 80",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 80.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 80",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 90",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 90.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 90",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 100",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 100.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 100",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 110",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 110.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 110",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 120",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 120.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 120",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 130",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 130.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 130",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 140",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 140.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 140",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 150",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 150.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 150",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 160",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 160.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 160",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 170",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 170.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 170",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 180",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 180.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 180",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 190",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 190.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 190",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 200",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 200.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 200",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 210",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 210.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 210",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 220",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 220.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 220",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 230",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 230.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 230",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 240",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 240.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 240",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 250",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 250.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 250",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 260",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 260.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 260",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 270",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 270.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 270",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 280",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 280.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 280",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Having Count > 290",
        descTemplate: "Raggruppa per country e mostra solo quelli con count > 290.",
        queryTemplate: "SELECT country, COUNT(*) FROM Users GROUP BY country HAVING COUNT(*) > 290",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Functions]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Upper Users name",
        descTemplate: "Maiuscolo",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lower Users name",
        descTemplate: "Minuscolo",
        queryTemplate: "SELECT LOWER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Length Users name",
        descTemplate: "Lunghezza",
        queryTemplate: "SELECT LENGTH(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Upper Products name",
        descTemplate: "Maiuscolo",
        queryTemplate: "SELECT UPPER(name) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lower Products name",
        descTemplate: "Minuscolo",
        queryTemplate: "SELECT LOWER(name) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Length Products name",
        descTemplate: "Lunghezza",
        queryTemplate: "SELECT LENGTH(name) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "ROUND Price",
        descTemplate: "...",
        queryTemplate: "SELECT ROUND(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CEIL Price",
        descTemplate: "...",
        queryTemplate: "SELECT CEIL(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "FLOOR Price",
        descTemplate: "...",
        queryTemplate: "SELECT FLOOR(price) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 0",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 1",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 2",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 3",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 4",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 5",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 6",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 7",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 8",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 9",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 10",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 11",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 12",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 13",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 14",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 15",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 16",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 17",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 18",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Func Extra 19",
        descTemplate: "...",
        queryTemplate: "SELECT UPPER(name) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Concat 0",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 1",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 2",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 3",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 4",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 5",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 6",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 7",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 8",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 9",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 10",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 11",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 12",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 13",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Concat 14",
        descTemplate: "Name + Email",
        queryTemplate: "SELECT CONCAT(name, email) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 0",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 1",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 2",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 3",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 4",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 5",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 6",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 7",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 8",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 9",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 10",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 11",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 12",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 13",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Substr 14",
        descTemplate: "First 3 chars",
        queryTemplate: "SELECT SUBSTR(name, 1, 3) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Nested 0",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 1",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 2",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 3",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 4",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 5",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 6",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 7",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 8",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 9",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 10",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 11",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 12",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 13",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 14",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 15",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 16",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 17",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 18",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 19",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 20",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 21",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 22",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 23",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 24",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 25",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 26",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 27",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 28",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Nested 29",
        descTemplate: "Length of Upper",
        queryTemplate: "SELECT LENGTH(UPPER(name)) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Dates]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "YEAR OrderDate",
        descTemplate: "...",
        queryTemplate: "SELECT YEAR(order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "MONTH OrderDate",
        descTemplate: "...",
        queryTemplate: "SELECT MONTH(order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DAY OrderDate",
        descTemplate: "...",
        queryTemplate: "SELECT DAY(order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "HOUR OrderDate",
        descTemplate: "...",
        queryTemplate: "SELECT HOUR(order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 0",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 1",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 2",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 3",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 4",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 5",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 6",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 7",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 8",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 9",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 10",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 11",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 12",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 13",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 14",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 15",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 16",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 17",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 18",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 19",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 20",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 21",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 22",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 23",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Date Func 24",
        descTemplate: "...",
        queryTemplate: "SELECT NOW()",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "DateDiff 0",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 1",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 2",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 3",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 4",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 5",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 6",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 7",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 8",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 9",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 10",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 11",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 12",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 13",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateDiff 14",
        descTemplate: "Diff Now - Created",
        queryTemplate: "SELECT DATEDIFF(NOW(), created_at) FROM Users",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 0",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 0 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 1",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 1 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 2",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 2 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 3",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 3 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 4",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 4 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 5",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 5 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 6",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 6 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 7",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 7 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 8",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 8 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 9",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 9 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 10",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 10 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 11",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 11 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 12",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 12 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 13",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 13 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "DateAdd 14",
        descTemplate: "Add days",
        queryTemplate: "SELECT DATE_ADD(order_date, INTERVAL 14 DAY) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Format Date 0",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 1",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 2",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 3",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 4",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 5",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 6",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 7",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 8",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 9",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 10",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 11",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 12",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 13",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 14",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 15",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 16",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 17",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 18",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 19",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 20",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 21",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 22",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 23",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 24",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 25",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 26",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 27",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 28",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Format Date 29",
        descTemplate: "Format YYYY-MM",
        queryTemplate: "SELECT DATE_FORMAT(order_date, '%Y-%m') FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Case]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Prezzo Alto 10",
        descTemplate: "Se prezzo > 10 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 10 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 20",
        descTemplate: "Se prezzo > 20 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 20 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 30",
        descTemplate: "Se prezzo > 30 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 30 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 40",
        descTemplate: "Se prezzo > 40 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 40 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 50",
        descTemplate: "Se prezzo > 50 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 50 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 60",
        descTemplate: "Se prezzo > 60 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 60 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 70",
        descTemplate: "Se prezzo > 70 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 70 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 80",
        descTemplate: "Se prezzo > 80 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 80 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 90",
        descTemplate: "Se prezzo > 90 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 90 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Prezzo Alto 100",
        descTemplate: "Se prezzo > 100 allora 'Caro' else 'Economico'.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 THEN 'Caro' ELSE 'Economico' END as label FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 0",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 1",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 2",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 3",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 4",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 5",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 6",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 7",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 8",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Status Label 9",
        descTemplate: "...",
        queryTemplate: "SELECT id, CASE WHEN status = 'Shipped' THEN 'OK' ELSE 'Wait' END FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 0",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 1",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 2",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 3",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 4",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 5",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 6",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 7",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 8",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Stock Label 9",
        descTemplate: "...",
        queryTemplate: "SELECT name, CASE WHEN stock > 0 THEN 'Available' ELSE 'OOS' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Categories Case 0",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 1",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 2",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 3",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 4",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 5",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 6",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 7",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 8",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 9",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 10",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 11",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 12",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 13",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Categories Case 14",
        descTemplate: "Categoria A, B o C in base al prezzo.",
        queryTemplate: "SELECT name, CASE WHEN price < 10 THEN 'C' WHEN price < 50 THEN 'B' ELSE 'A' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 0",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 1",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 2",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 3",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 4",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 5",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 6",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 7",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 8",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 9",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 10",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 11",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 12",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 13",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Pivot Count 14",
        descTemplate: "Conta ordini Shipped vs Pending.",
        queryTemplate: "SELECT SUM(CASE WHEN status='Shipped' THEN 1 ELSE 0 END) as shipped_count FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Complex Logic 0",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 1",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 2",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 3",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 4",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 5",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 6",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 7",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 8",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 9",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 10",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 11",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 12",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 13",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Complex Logic 14",
        descTemplate: "AND/OR in Case.",
        queryTemplate: "SELECT name, CASE WHEN price > 100 AND stock < 5 THEN 'Urgent Restock' ELSE 'Normal' END FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 0",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 1",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 2",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 3",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 4",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 5",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 6",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 7",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 8",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 9",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 10",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 11",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 12",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 13",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sort Custom 14",
        descTemplate: "Ordina: Stock=0 first.",
        queryTemplate: "SELECT * FROM Products ORDER BY CASE WHEN stock = 0 THEN 0 ELSE 1 END, price DESC",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Joins]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "User name and Order",
        descTemplate: "Join Users-Orders select name.",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User name and Order",
        descTemplate: "Join Users-Orders select name.",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User name and Order",
        descTemplate: "Join Users-Orders select name.",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User name and Order",
        descTemplate: "Join Users-Orders select name.",
        queryTemplate: "SELECT Users.name, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User email and Order",
        descTemplate: "Join Users-Orders select email.",
        queryTemplate: "SELECT Users.email, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User email and Order",
        descTemplate: "Join Users-Orders select email.",
        queryTemplate: "SELECT Users.email, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User email and Order",
        descTemplate: "Join Users-Orders select email.",
        queryTemplate: "SELECT Users.email, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User email and Order",
        descTemplate: "Join Users-Orders select email.",
        queryTemplate: "SELECT Users.email, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User country and Order",
        descTemplate: "Join Users-Orders select country.",
        queryTemplate: "SELECT Users.country, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User country and Order",
        descTemplate: "Join Users-Orders select country.",
        queryTemplate: "SELECT Users.country, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User country and Order",
        descTemplate: "Join Users-Orders select country.",
        queryTemplate: "SELECT Users.country, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "User country and Order",
        descTemplate: "Join Users-Orders select country.",
        queryTemplate: "SELECT Users.country, Orders.id FROM Users JOIN Orders ON Users.id = Orders.user_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product name",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product name",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product name",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product name",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.name FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product price",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product price",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product price",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product price",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.price FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product category",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product category",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product category",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Item Product category",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Products.category FROM OrderItems JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Order Date Item 0",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Order Date Item 1",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Order Date Item 2",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Order Date Item 3",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Order Date Item 4",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Order Date Item 5",
        descTemplate: "...",
        queryTemplate: "SELECT OrderItems.id, Orders.order_date FROM OrderItems JOIN Orders ON OrderItems.order_id = Orders.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users No Orders",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id WHERE Orders.id IS NULL",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Sum Spent",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, SUM(Orders.order_total) FROM Users JOIN Orders ON Users.id = Orders.user_id GROUP BY Users.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Count Sold",
        descTemplate: "...",
        queryTemplate: "SELECT Products.name, SUM(OrderItems.quantity) FROM Products JOIN OrderItems ON Products.id = OrderItems.product_id GROUP BY Products.name",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "3-Table Chain 0",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 1",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 2",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 3",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 4",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 5",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 6",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 7",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 8",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "3-Table Chain 9",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, OrderItems.quantity FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 0",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 1",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 2",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 3",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 4",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 5",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 6",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 7",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 8",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "4-Table Chain 9",
        descTemplate: "...",
        queryTemplate: "SELECT Users.name, Products.name FROM Users JOIN Orders ON Users.id = Orders.user_id JOIN OrderItems ON Orders.id = OrderItems.order_id JOIN Products ON OrderItems.product_id = Products.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 0",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 1",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 2",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 3",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 4",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 5",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 6",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 7",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 8",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Self Join 9",
        descTemplate: "Dipendente e Manager",
        queryTemplate: "SELECT E.name, M.name FROM Employees E JOIN Employees M ON E.manager_id = M.id",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
  [TopicId.Advanced]: {
    [Difficulty.Easy]: [
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Users in Orders",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE id IN (SELECT user_id FROM Orders)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Price > Avg",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Exists Users",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Users WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.user_id = Users.id)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Medium]: [
      {
        titleTemplate: "CTE Basic 0",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 1",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 2",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 3",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 4",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 5",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 6",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 7",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 8",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 9",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 10",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 11",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 12",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 13",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "CTE Basic 14",
        descTemplate: "...",
        queryTemplate: "WITH tmp AS (SELECT * FROM Products WHERE price > 50) SELECT * FROM tmp",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 0",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 1",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 2",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 3",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 4",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 5",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 6",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 7",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 8",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 9",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 10",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 11",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 12",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 13",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Correlated Max 14",
        descTemplate: "...",
        queryTemplate: "SELECT * FROM Products p1 WHERE price = (SELECT MAX(price) FROM Products p2 WHERE p2.category = p1.category)",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ],
    [Difficulty.Hard]: [
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Rank Price",
        descTemplate: "...",
        queryTemplate: "SELECT name, RANK() OVER (ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Row Number Cat",
        descTemplate: "...",
        queryTemplate: "SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) FROM Products",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
      {
        titleTemplate: "Lag Order",
        descTemplate: "...",
        queryTemplate: "SELECT id, LAG(order_total) OVER (ORDER BY order_date) FROM Orders",
        hints: ["Hint generico"],
        explanation: "Spiegazione generata.",
        replacements: {},
        brokenCode: "...",
        debugHint: "Controlla la sintassi."
      },
    ]
  },
};

// --- GENERATOR FUNCTION ---
export const generateExercises = (
  topicId: TopicId,
  difficulty: Difficulty,
  count: number = 30
): Exercise[] => {
  const topicData = QUESTION_DATABASE[topicId];
  if (!topicData) return [];

  const blueprints = topicData[difficulty] || [];
  if (blueprints.length === 0) return [];

  // Shuffle and pick
  const selectedBlueprints = shuffleArray(blueprints).slice(0, count);

  return selectedBlueprints.map((bp, index) => {
    let title = bp.titleTemplate;
    let description = bp.descTemplate;
    let query = bp.queryTemplate;
    let brokenCode = bp.brokenCode;
    let explanation = bp.explanation;
    let debugHint = bp.debugHint;

    // Perform replacements if any
    if (bp.replacements) {
      Object.entries(bp.replacements).forEach(([key, values]) => {
        const replacement = getRandomItem(values);
        const regex = new RegExp(`{${key}}`, "g");
        const replacementStr = String(replacement);
        title = title.replace(regex, replacementStr);
        description = description.replace(regex, replacementStr);
        query = query.replace(regex, replacementStr);
        brokenCode = brokenCode.replace(regex, replacementStr);
      });
    }

    return {
      id: `${topicId}-${difficulty}-${index}-${Date.now()}`,
      topicId,
      difficulty,
      title,
      description,
      initialQuery: brokenCode,
      solutionQuery: query,
      hints: bp.hints,
      explanation,
      debugHint
    };
  });
};
