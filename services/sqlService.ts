
import alasql from 'alasql';
import alasql from 'alasql';
import { Difficulty, QueryResult } from '../types';

// ==========================================
// ALASQL POLYFILLS
// ==========================================

// ==========================================
// ALASQL POLYFILLS
// ==========================================

alasql.fn.MONTHNAME = (date: string | Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleString('en-US', { month: 'long' });
};

alasql.fn.DAYNAME = (date: string | Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleString('en-US', { weekday: 'long' });
};

alasql.fn.STR_TO_DATE = (str: string, format: string) => {
    // Basic parser for common formats
    if (!str) return null;
    if (format === '%d/%m/%Y') {
        const [d, m, y] = str.split(/[-/]/).map(Number);
        return new Date(y, m - 1, d);
    }
    if (format === '%d/%m/%Y %H:%i') {
         const [datePart, timePart] = str.split(' ');
         const [d, m, y] = datePart.split(/[-/]/).map(Number);
         const [h, min] = timePart.split(':').map(Number);
         return new Date(y, m - 1, d, h, min);
    }
    return new Date(str); // Fallback
};

alasql.fn.DATE_FORMAT = (date: string | Date, format: string) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    // Simple replacements
    let ret = format
        .replace('%Y', d.getFullYear().toString())
        .replace('%m', (d.getMonth() + 1).toString().padStart(2, '0'))
        .replace('%d', d.getDate().toString().padStart(2, '0'))
        .replace('%H', d.getHours().toString().padStart(2, '0'))
        .replace('%i', d.getMinutes().toString().padStart(2, '0'))
        .replace('%s', d.getSeconds().toString().padStart(2, '0'))
        .replace('%W', d.toLocaleString('en-US', { weekday: 'long' }))
        .replace('%M', d.toLocaleString('en-US', { month: 'long' }))
        .replace('%T', d.toTimeString().split(' ')[0]);
        
    return ret;
};

// Override NOW if necessary or ensure local time
alasql.fn.NOW = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

alasql.fn.TIMESTAMPDIFF = (unit: string, start: string | Date, end: string | Date) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const msDiff = d2.getTime() - d1.getTime();
    
    switch(unit.toUpperCase()) {
        case 'SECOND': return Math.floor(msDiff / 1000);
        case 'MINUTE': return Math.floor(msDiff / (1000 * 60));
        case 'HOUR': return Math.floor(msDiff / (1000 * 60 * 60));
        case 'DAY': return Math.floor(msDiff / (1000 * 60 * 60 * 24));
        case 'MONTH': return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
        case 'YEAR': return d2.getFullYear() - d1.getFullYear();
        default: return null;
    }
};

alasql.fn.DATEDIFF = (d1: string | Date, d2: string | Date) => {
    // MySQL DATEDIFF(expr1, expr2) returns (expr1 - expr2) in days
    // However, if AlaSQL parser blocks this, this function might not be called via SQL "DATEDIFF"
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = date1.getTime() - date2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

alasql.fn.LAST_DAY = (date: string | Date) => {
    const d = new Date(date);
    // Go to next month 0-th day = last day of current month
    return new Date(d.getFullYear(), d.getMonth() + 1, 0); 
};

alasql.fn.TIME = (date: string | Date) => {
    if (!date) return null;
    try {
       const d = new Date(date);
       return d.toISOString().split('T')[1].split('.')[0];
    } catch(e) { return null; }
};

alasql.fn.TIME_TO_SEC = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
};

alasql.fn.TIMEDIFF = (t1: string, t2: string) => {
    // Very basic 'HH:MM:SS' diff
    const s1 = alasql.fn.TIME_TO_SEC(t1);
    const s2 = alasql.fn.TIME_TO_SEC(t2);
    const diff = s1 - s2;
    const absDiff = Math.abs(diff);
    // Convert back to HH:MM:SS
    const h = Math.floor(absDiff / 3600).toString().padStart(2, '0');
    const m = Math.floor((absDiff % 3600) / 60).toString().padStart(2, '0');
    const s = (absDiff % 60).toString().padStart(2, '0');
    return (diff < 0 ? '-' : '') + `${h}:${m}:${s}`;
};

alasql.fn.MAKEDATE = (year: number, dayOfYear: number) => {
    const d = new Date(year, 0, dayOfYear);
    return d; 
};

alasql.fn.PERIOD_DIFF = (p1: number, p2: number) => {
    // YYYYMM format
    const y1 = Math.floor(p1 / 100);
    const m1 = p1 % 100;
    const y2 = Math.floor(p2 / 100);
    const m2 = p2 % 100;
    return (y1 * 12 + m1) - (y2 * 12 + m2);
};

alasql.fn.UNIX_TIMESTAMP = (date: string | Date) => {
    const d = date ? new Date(date) : new Date();
    return Math.floor(d.getTime() / 1000);
};

alasql.fn.FROM_UNIXTIME = (ts: number) => {
    return new Date(ts * 1000).toISOString().replace('T', ' ').split('.')[0];
};

alasql.options.mysql = true; // Enable some MySQL compatibility if possible



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
        alasql('CREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, department VARCHAR, hire_date DATE, manager_id INT, salary DECIMAL)');
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
        for (let i = 1; i <= 99; i++) {
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
            id: 100,
            name: 'Ghost User',
            email: 'ghost@nowhere.com',
            country: 'Antarctica',
            is_premium: false,
            created_at: '2024-01-01'
        });

        // Explicit Dormant User
        usersData.push({
            id: 101,
            name: 'Dormant User',
            email: 'dormant@sleepy.com',
            country: 'Italy',
            is_premium: true,
            created_at: '2020-01-01'
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

        productsData.push({
            id: 51,
            name: 'Keyboard',
            category: 'Electronics',
            price: 29.99,
            stock: 50
        });

        productsData.push({
            id: 52,
            name: 'Smartphone',
            category: 'Electronics',
            price: 599.99,
            stock: 30
        });

        productsData.push({
            id: 53,
            name: 'Divano Luxury',
            category: 'Home',
            price: 1500.00,
            stock: 5
        });

        // High-End Servers for Complex Aggregation (AVG > 50 AND SUM > 100)
        for(let k=0; k<5; k++) {
            productsData.push({
                id: 300 + k,
                name: `Pro Server ${k}`,
                category: 'Servers',
                price: 2000.00, // High Price
                stock: 50       // 5 * 50 = 250 Total Stock
            });
        }

        // Bulk insert to guarantee "Category with > 10 items" and "High Stock"
        for(let j=0; j<15; j++) {
             productsData.push({
                id: 200 + j,
                name: `Bulk Item ${j}`,
                category: 'Accessories', // Target category for Aggregation stats
                price: 15.00,
                stock: 100 // 15 * 100 = 1500 total stock, > 1000 threshold
            });
        }

        productsData.forEach(r => alasql(`INSERT INTO Products VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${r.category.replace(/'/g, "''")}', ${r.price}, ${r.stock})`));
        console.log(`✅ Products inserted: ${productsData.length}`);
    } catch (e) {
        console.error('❌ Error inserting Products:', e);
    }

    // --- ORDERS (60 rows) ---
    try {
        const ordersData: any[] = [];
        for (let i = 1; i <= 60; i++) {
            let oDate;
            if (i <= 10) { oDate = getRandomDate(2021, 2021); } 
            else if (i <= 50) { oDate = getRandomDate(2023, 2024); }
            else { oDate = getRandomDate(2025, 2025); } 

            // Force specific Users to specific Order IDs for advanced logic
            let uid = getRandomInt(1, 99);
            if (i === 1) uid = 2; // User 2 (For Monitor only)
            if (i === 2) uid = 3; // User 3 (For Monitor + Keyboard)
            if (i === 3) uid = 4; // User 4 (For Keyboard only)
            if (i === 4) uid = 5; // User 5 (EXACTLY ONE ORDER - Single Order User)

            // Prevent random assignment to User 5 (id 5) in other iterations
            if (i > 4 && uid === 5) uid = 6; 

            // Force Sequential Orders for User 6 (for "Compare Previous Order" exercise)
            let currentTotal = Number((getRandomInt(50, 3000) + 0.99).toFixed(2));
            if (i === 10) { uid = 6; currentTotal = 500.00; }
            if (i === 11) { uid = 6; currentTotal = 400.00; } // 400 < 500 -> "Decreasing"

            ordersData.push({
                id: i,
                user_id: uid,
                order_date: oDate,
                status: getRandom(statuses),
                order_total: currentTotal
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
            // FORCED ITEMS for specific Orders
            if (oid === 1) { // User 2: Monitor ONLY
                 orderItemsData.push({ id: itemId++, order_id: oid, product_id: 49, quantity: 1, unit_price: 399.99 });
                 continue;
            }
            if (oid === 2) { // User 3: Monitor AND Keyboard
                 orderItemsData.push({ id: itemId++, order_id: oid, product_id: 49, quantity: 1, unit_price: 399.99 });
                 orderItemsData.push({ id: itemId++, order_id: oid, product_id: 51, quantity: 1, unit_price: 29.99 });
                 continue;
            }
            if (oid === 3) { // User 4: Keyboard ONLY
                 orderItemsData.push({ id: itemId++, order_id: oid, product_id: 51, quantity: 1, unit_price: 29.99 });
                 continue;
            }

            // Random items for others
            const numItems = getRandomInt(1, 4);
            for (let k = 0; k < numItems; k++) {
                if (productsData.length > 0) {
                    const prod = productsData[getRandomInt(0, Math.min(48, productsData.length - 1))];
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
            {id: 1, name: 'Alessandro Romano', department: 'Executive', hire_date: '2015-03-01', manager_id: null, salary: 120000}, // CEO
            {id: 2, name: 'Giulia Bianchi', department: 'Sales', hire_date: '2016-05-15', manager_id: 1, salary: 70000}, // Manager
            {id: 3, name: 'Marco Rossi', department: 'Engineering', hire_date: '2017-02-20', manager_id: 1, salary: 95000}, // Manager
            {id: 4, name: 'Sofia Verdi', department: 'Marketing', hire_date: '2018-07-10', manager_id: 1, salary: 80000}, // Manager
            {id: 5, name: 'Luca Esposito', department: 'Sales', hire_date: '2019-01-10', manager_id: 2, salary: 75000}, // Salary > Manager (75k > 70k) - ANOMALY
            {id: 6, name: 'Francesca Ricci', department: 'Sales', hire_date: '2019-04-25', manager_id: 2, salary: 60000},
            {id: 7, name: 'Matteo Gallo', department: 'Engineering', hire_date: '2020-03-12', manager_id: 3, salary: 85000},
            {id: 8, name: 'Chiara Conti', department: 'Engineering', hire_date: '2020-08-01', manager_id: 3, salary: 88000},
            {id: 9, name: 'Andrea Bruno', department: 'Engineering', hire_date: '2021-01-15', manager_id: 3, salary: 82000},
            {id: 10, name: 'Elena Marino', department: 'Marketing', hire_date: '2021-05-20', manager_id: 4, salary: 65000},
            {id: 11, name: 'Davide Greco', department: 'Support', hire_date: '2022-02-10', manager_id: 6, salary: 40000},
            {id: 12, name: 'Sara Barbieri', department: 'Support', hire_date: '2022-06-30', manager_id: 6, salary: 42000},
            {id: 13, name: 'Lorenzo Fontana', department: 'Engineering', hire_date: '2023-01-01', manager_id: 7, salary: 60000},
            {id: 14, name: 'Alice Santoro', department: 'HR', hire_date: '2019-11-01', manager_id: 1, salary: 70000},
            {id: 15, name: 'Simone Rinaldi', department: 'Finance', hire_date: '2018-09-15', manager_id: 1, salary: 75000},
        ];

        employeesData.forEach(r => {
             // Generate email if not present in object (though previous logic did it in loop, we can just do it here)
             const email = `${r.name.split(' ')[0].toLowerCase()}.${r.name.split(' ')[1].toLowerCase()}@techstore.com`;
             const managerVal = r.manager_id === null ? 'NULL' : r.manager_id;
             alasql(`INSERT INTO Employees VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${email}', '${r.department.replace(/'/g, "''")}', '${r.hire_date}', ${managerVal}, ${r.salary})`);
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

