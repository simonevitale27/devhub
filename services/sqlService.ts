
import alasql from 'alasql';
import { Difficulty, QueryResult } from '../types';

// ==========================================
// MOCK DATA GENERATORS
// ==========================================

const firstNames = [
  'Marco', 'Giulia', 'Luca', 'Sofia', 'Alessandro', 'Francesca', 'Matteo', 'Chiara', 'Andrea', 'Elena',
  'Davide', 'Sara', 'Lorenzo', 'Alice', 'Simone', 'Martina', 'Federico', 'Valentina', 'Gabriele', 'Elisa',
  'Antonio', 'Silvia', 'Giuseppe', 'Beatrice', 'Riccardo', 'Giorgia', 'Tommaso', 'Ludovica', 'Edoardo', 'Vittoria',
  'Roberto', 'Daniela', 'Stefano', 'Monica', 'Paolo', 'Laura', 'Giovanni', 'Serena', 'Fabio', 'Marta',
  'Luigi', 'Cristina', 'Nicola', 'Eleonora', 'Mario', 'Anna', 'Luigi', 'Maria', 'Pietro', 'Giovanna'
];

const lastNames = [
  'Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti',
  'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro',
  'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone', 'Longo', 'Gentile', 'Martinelli',
  'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Santis', 'D\'Angelo', 'Marchetti', 'Parisi', 'Villa', 'Conte',
  'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina', 'Sala', 'De Angelis'
];

const countries = ['Italy', 'France', 'Germany', 'Spain', 'USA', 'UK', 'Netherlands', 'Japan', 'Canada', 'Australia'];
const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'libero.it', 'techstore.com'];

const categories = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
const productAdjectives = ['Pro', 'Ultra', 'Max', 'Lite', 'S', 'X', 'Air', 'Mini', 'Plus', 'Elite'];
const productNouns = ['Book', 'Phone', 'Pad', 'Watch', 'Buds', 'Cam', 'Station', 'Hub', 'Drive', 'Screen'];

const departments = ['Executive', 'Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Support', 'Legal', 'Product', 'Operations'];
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

// Utils
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (startYear: number, endYear: number = 2024): string => {
  const start = new Date(`${startYear}-01-01`).getTime();
  const end = new Date(`${endYear}-12-31`).getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toISOString().split('T')[0];
};

export const initDatabase = (_difficulty: Difficulty) => {
  console.log('🚀 initDatabase STARTING (Realistic Data)...');
  
  try {
    // 1. Drop old tables
    const tablesToDrop = ['OrderItems', 'Orders', 'Products', 'Users', 'Employees', 
      'recensioni', 'spedizioni', 'ordini', 'prodotti', 'fornitori', 'categorie', 'utenti'];
    tablesToDrop.forEach(t => {
      try { alasql(`DROP TABLE IF EXISTS ${t}`); } catch(e) { /* ignore */ }
    });

    // 2. Create Tables (Standard SQL Types)
    try {
        alasql('CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, country VARCHAR, is_premium BOOLEAN, created_at DATE)');
        alasql('CREATE TABLE Products (id INT PRIMARY KEY, name VARCHAR, category VARCHAR, price DECIMAL, stock INT)');
        alasql('CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR, order_total DECIMAL)'); // Renamed total -> order_total
        alasql('CREATE TABLE OrderItems (id INT PRIMARY KEY, order_id INT, product_id INT, quantity INT, unit_price DECIMAL)');
        alasql('CREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR, department VARCHAR, hire_date DATE, manager_id INT)');
        console.log('✅ Tables created');
    } catch (e) {
        console.error('❌ Error creating tables:', e);
    }

    // ==========================================
    // 3. GENERATE & INSERT DATA
    // ==========================================

    // --- USERS (50 rows) ---
    try {
        const usersData: any[] = [];
        for (let i = 1; i <= 49; i++) {
            const fname = getRandom(firstNames);
            const lname = getRandom(lastNames);
            usersData.push({
                id: i,
                name: `${fname} ${lname}`,
                email: `${fname.toLowerCase()}.${lname.toLowerCase()}@${getRandom(domains)}`,
                country: getRandom(countries),
                is_premium: Math.random() > 0.8, // 20% premium
                created_at: getRandomDate(2022, 2023)
            });
        }
        usersData.push({
            id: 50,
            name: 'Ghost User',
            email: 'ghost@nowhere.com',
            country: 'Antarctica',
            is_premium: false,
            created_at: '2024-01-01'
        });

        usersData.forEach(r => alasql(`INSERT INTO Users VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${r.email}', '${r.country}', ${r.is_premium}, '${r.created_at}')`));
        console.log(`✅ Users inserted: ${usersData.length}`);
    } catch (e) {
        console.error('❌ Error inserting Users:', e);
    }

    // --- PRODUCTS (50 rows + Specific Items) ---
    let productsData: any[] = [];
    try {
        for (let i = 1; i <= 48; i++) { // Generate 48 random
            const cat = getRandom(categories);
            const name = `${cat} ${getRandom(productAdjectives)} ${getRandom(productNouns)} ${getRandomInt(100, 900)}`;
            productsData.push({
                id: i,
                name: name,
                category: cat,
                price: Number((getRandomInt(20, 2000) - 0.01).toFixed(2)),
                stock: getRandomInt(0, 150)
            });
        }
        
        // Specific items for Exercises
        productsData.push({
            id: 49,
            name: 'Monitor 4K', // For "Stessa Categoria" exercise
            category: 'Electronics',
            price: 399.99,
            stock: 10
        });
        
        productsData.push({
            id: 50,
            name: 'Lampada Smart',
            category: 'Home', // For "Concorrenza Interna" and "Concorrenza Home" exercises
            price: 49.99,
            stock: 25
        });

        productsData.push({
            id: 99,
            name: 'Quantum Computer Prototype',
            category: 'R&D',
            price: 99999.99,
            stock: 1
        });

        productsData.forEach(r => alasql(`INSERT INTO Products VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${r.category.replace(/'/g, "''")}', ${r.price}, ${r.stock})`));
        console.log(`✅ Products inserted: ${productsData.length}`);
    } catch (e) {
        console.error('❌ Error inserting Products:', e);
    }

    // --- ORDERS (60 rows) ---
    try {
        const ordersData: any[] = [];
        for (let i = 1; i <= 60; i++) {
            ordersData.push({
                id: i,
                user_id: getRandomInt(1, 49),
                order_date: getRandomDate(2023, 2024),
                status: getRandom(statuses),
                order_total: Number((getRandomInt(50, 3000) + 0.99).toFixed(2))
            });
        }
        ordersData.forEach(r => alasql(`INSERT INTO Orders VALUES (${r.id}, ${r.user_id}, '${r.order_date}', '${r.status.replace(/'/g, "''")}', ${r.order_total})`));
        console.log(`✅ Orders inserted: ${ordersData.length}`);
    } catch (e) {
        console.error('❌ Error inserting Orders:', e);
    }

    // --- ORDER ITEMS (150 rows) ---
    try {
        const orderItemsData: any[] = [];
        let itemId = 1;
        for (let oid = 1; oid <= 60; oid++) {
            const numItems = getRandomInt(1, 4);
            for (let k = 0; k < numItems; k++) {
                if (productsData.length > 0) {
                    const prod = productsData[getRandomInt(0, Math.min(48, productsData.length - 1))]; // Ensure safe index
                    if (prod) {
                        orderItemsData.push({
                            id: itemId++,
                            order_id: oid,
                            product_id: prod.id,
                            quantity: getRandomInt(1, 3),
                            unit_price: prod.price
                        });
                    }
                }
            }
        }
        orderItemsData.forEach(r => alasql(`INSERT INTO OrderItems VALUES (${r.id}, ${r.order_id}, ${r.product_id}, ${r.quantity}, ${r.unit_price})`));
        console.log(`✅ OrderItems inserted: ${orderItemsData.length}`);
    } catch (e) {
        console.error('❌ Error inserting OrderItems:', e);
    }

    // --- EMPLOYEES (15 rows) ---
    try {
        const employeesData = [
            {id: 1, name: 'Alessandro Romano', department: 'Executive', hire_date: '2015-03-01', manager_id: null}, // CEO
            {id: 2, name: 'Giulia Bianchi', department: 'Sales', hire_date: '2016-05-15', manager_id: 1},
            {id: 3, name: 'Marco Rossi', department: 'Engineering', hire_date: '2017-02-20', manager_id: 1},
            {id: 4, name: 'Sofia Verdi', department: 'Marketing', hire_date: '2018-07-10', manager_id: 1},
            {id: 5, name: 'Luca Esposito', department: 'Sales', hire_date: '2019-01-10', manager_id: 2},
            {id: 6, name: 'Francesca Ricci', department: 'Sales', hire_date: '2019-04-25', manager_id: 2},
            {id: 7, name: 'Matteo Gallo', department: 'Engineering', hire_date: '2020-03-12', manager_id: 3},
            {id: 8, name: 'Chiara Conti', department: 'Engineering', hire_date: '2020-08-01', manager_id: 3},
            {id: 9, name: 'Andrea Bruno', department: 'Engineering', hire_date: '2021-01-15', manager_id: 3},
            {id: 10, name: 'Elena Marino', department: 'Marketing', hire_date: '2021-05-20', manager_id: 4},
            {id: 11, name: 'Davide Greco', department: 'Support', hire_date: '2022-02-10', manager_id: 6},
            {id: 12, name: 'Sara Barbieri', department: 'Support', hire_date: '2022-06-30', manager_id: 6},
            {id: 13, name: 'Lorenzo Fontana', department: 'Engineering', hire_date: '2023-01-01', manager_id: 7},
            {id: 14, name: 'Alice Santoro', department: 'HR', hire_date: '2019-11-01', manager_id: 1},
            {id: 15, name: 'Simone Rinaldi', department: 'Finance', hire_date: '2018-09-15', manager_id: 1},
        ];

        employeesData.forEach(r => {
             const managerVal = r.manager_id === null ? 'NULL' : r.manager_id;
             alasql(`INSERT INTO Employees VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${r.department.replace(/'/g, "''")}', '${r.hire_date}', ${managerVal})`);
        });
        console.log(`✅ Employees inserted: ${employeesData.length}`);
    } catch (e) {
        console.error('❌ Error inserting Employees:', e);
    }

    console.log('🎉 initDatabase COMPLETE!');
  } catch (e) {
    console.error('❌ initDatabase FAILED:', e);
  }
};

export const runQuery = (sql: string): QueryResult => {
  try {
    const result = alasql(sql);
    return {
      success: true,
      data: result,
      message: `Query eseguita.`
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || "Errore SQL",
      message: "Errore"
    };
  }
};

export const getTablePreview = (tableName: string): any[] => {
  try {
    return alasql(`SELECT * FROM ${tableName} LIMIT 5`);
  } catch (e) {
    return [];
  }
}

export const getAllTableData = (tableName: string): any[] => {
  try {
    return alasql(`SELECT * FROM ${tableName}`);
  } catch (e) {
    return [];
  }
}

export const translateSqlError = (errorMsg: string): string => {
  const err = errorMsg.toLowerCase();
  if (err.includes("parse error") || err.includes("syntax")) return "C'è un errore di sintassi. Controlla di aver scritto correttamente i comandi (SELECT, FROM...);";
  if (err.includes("table") && err.includes("exist")) return "Tabella non trovata. Controlla il nome nello schema.";
  return "Query non valida.";
};

// =====================================================
// AUTO-INIT
// =====================================================
console.log('📦 sqlService module loaded');
initDatabase('Easy' as Difficulty);

