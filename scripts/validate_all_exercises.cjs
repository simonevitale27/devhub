/**
 * Comprehensive SQL Exercise Validator
 * 
 * Initializes the same alasql database as the app, then parses and executes
 * ALL exercise queries from exerciseGenerator.ts to verify they:
 * 1. Execute without SQL errors
 * 2. Return at least 1 row (for SELECT queries)
 * 3. Have proper Italian text (no obvious typos/issues)
 */

const fs = require('fs');
const path = require('path');
const alasql = require('alasql');

// ================================
// POLYFILLS (same as sqlService.ts)
// ================================
alasql.options.mysql = true;
alasql.fn.MOD = (n, m) => n % m;
alasql.fn.REVERSE = (s) => s ? s.split('').reverse().join('') : null;
alasql.fn.RAND = () => Math.random();
alasql.fn.PI = () => Math.PI;
alasql.fn.LOG = (x) => Math.log(x);
alasql.fn.EXP = (x) => Math.exp(x);
alasql.fn.RADIANS = (x) => x * Math.PI / 180;
alasql.fn.DEGREES = (x) => x * 180 / Math.PI;
alasql.fn.LPAD = (s, len, pad) => s ? String(s).padStart(len, pad || ' ') : null;
alasql.fn.RPAD = (s, len, pad) => s ? String(s).padEnd(len, pad || ' ') : null;
alasql.fn.ASCII = (s) => s ? s.charCodeAt(0) : null;
alasql.fn.BIT_LENGTH = (s) => s ? Buffer.from(s).length * 8 : 0;
alasql.fn.SIGN = (x) => Math.sign(x);
alasql.fn.LENGTH = (s) => s ? s.length : null;

alasql.fn.DAYOFYEAR = (d) => {
  if (!d) return null;
  const date = new Date(d);
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
};

alasql.fn.WEEK = (d) => {
  if (!d) return null;
  return Math.ceil((alasql.fn.DAYOFYEAR(d) + new Date(new Date(d).getFullYear(), 0, 1).getDay()) / 7);
};

alasql.fn.QUARTER = (d) => d ? Math.ceil((new Date(d).getMonth() + 1) / 3) : null;
alasql.fn.SYSDATE = () => new Date().toISOString().replace('T', ' ').substring(0, 19);
alasql.fn.YEAR = (d) => d ? new Date(d).getFullYear() : null;
alasql.fn.TO_DAYS = (d) => d ? Math.floor(new Date(d).getTime() / 86400000) : null;
alasql.fn.NOW = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

alasql.fn.MONTHNAME = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString('en-US', { month: 'long' });
};

alasql.fn.DAYNAME = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString('en-US', { weekday: 'long' });
};

alasql.fn.STR_TO_DATE = (str, format) => {
  if (!str) return null;
  if (format === '%d/%m/%Y') {
    const [d, m, y] = str.split(/[-/]/).map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(str);
};

alasql.fn.DATE_FORMAT = (date, format) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return format
    .replace('%Y', d.getFullYear().toString())
    .replace('%m', (d.getMonth() + 1).toString().padStart(2, '0'))
    .replace('%d', d.getDate().toString().padStart(2, '0'))
    .replace('%H', d.getHours().toString().padStart(2, '0'))
    .replace('%i', d.getMinutes().toString().padStart(2, '0'))
    .replace('%s', d.getSeconds().toString().padStart(2, '0'))
    .replace('%W', d.toLocaleString('en-US', { weekday: 'long' }))
    .replace('%M', d.toLocaleString('en-US', { month: 'long' }))
    .replace('%T', d.toTimeString().split(' ')[0]);
};

alasql.fn.TIMESTAMPDIFF = (unit, start, end) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const msDiff = d2.getTime() - d1.getTime();
  switch ((unit || '').toUpperCase()) {
    case 'SECOND': return Math.floor(msDiff / 1000);
    case 'MINUTE': return Math.floor(msDiff / 60000);
    case 'HOUR': return Math.floor(msDiff / 3600000);
    case 'DAY': return Math.floor(msDiff / 86400000);
    case 'MONTH': return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    case 'YEAR': return d2.getFullYear() - d1.getFullYear();
    default: return null;
  }
};

alasql.fn.DATEDIFF = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return Math.ceil((date1.getTime() - date2.getTime()) / 86400000);
};

alasql.fn.LAST_DAY = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

alasql.fn.TIME = (date) => {
  if (!date) return null;
  try { return new Date(date).toISOString().split('T')[1].split('.')[0]; } catch { return null; }
};

alasql.fn.TIME_TO_SEC = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(':').map(Number);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
};

alasql.fn.TIMEDIFF = (t1, t2) => {
  const s1 = alasql.fn.TIME_TO_SEC(t1);
  const s2 = alasql.fn.TIME_TO_SEC(t2);
  const diff = s1 - s2;
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3600).toString().padStart(2, '0');
  const m = Math.floor((abs % 3600) / 60).toString().padStart(2, '0');
  const s = (abs % 60).toString().padStart(2, '0');
  return (diff < 0 ? '-' : '') + `${h}:${m}:${s}`;
};

alasql.fn.MAKEDATE = (year, dayOfYear) => new Date(year, 0, dayOfYear);
alasql.fn.PERIOD_DIFF = (p1, p2) => {
  const y1 = Math.floor(p1 / 100), m1 = p1 % 100;
  const y2 = Math.floor(p2 / 100), m2 = p2 % 100;
  return (y1 * 12 + m1) - (y2 * 12 + m2);
};

alasql.fn.UNIX_TIMESTAMP = (date) => Math.floor((date ? new Date(date) : new Date()).getTime() / 1000);
alasql.fn.FROM_UNIXTIME = (ts) => new Date(ts * 1000).toISOString().replace('T', ' ').split('.')[0];

// ================================
// DATABASE INITIALIZATION (same as sqlService.ts)
// ================================
function initDatabase() {
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomDate = (startYear, endYear = 2024) => {
    const start = new Date(`${startYear}-01-01`).getTime();
    const end = new Date(`${endYear}-12-31`).getTime();
    return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
  };

  const firstNames = ['Marco', 'Giulia', 'Luca', 'Sofia', 'Alessandro', 'Francesca', 'Matteo', 'Chiara', 'Andrea', 'Elena', 'Davide', 'Sara', 'Lorenzo', 'Alice', 'Simone', 'Martina', 'Federico', 'Valentina', 'Gabriele', 'Elisa', 'Antonio', 'Silvia', 'Giuseppe', 'Beatrice', 'Riccardo', 'Giorgia', 'Tommaso', 'Ludovica', 'Edoardo', 'Vittoria', 'Roberto', 'Daniela', 'Stefano', 'Monica', 'Paolo', 'Laura', 'Giovanni', 'Serena', 'Fabio', 'Marta', 'Luigi', 'Cristina', 'Nicola', 'Eleonora', 'Mario', 'Anna', 'Luigi', 'Maria', 'Pietro', 'Giovanna'];
  const lastNames = ['Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Santis', "D'Angelo", 'Marchetti', 'Parisi', 'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina', 'Sala', 'De Angelis'];
  const countries = ['Italy', 'France', 'Germany', 'Spain', 'USA', 'UK', 'Netherlands', 'Japan', 'Canada', 'Australia'];
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'libero.it', 'techstore.com'];
  const categories = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
  const productAdjectives = ['Pro', 'Ultra', 'Max', 'Lite', 'S', 'X', 'Air', 'Mini', 'Plus', 'Elite'];
  const productNouns = ['Book', 'Phone', 'Pad', 'Watch', 'Buds', 'Cam', 'Station', 'Hub', 'Drive', 'Screen'];
  const departments = ['Executive', 'Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Support', 'Legal', 'Product', 'Operations'];
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  // Drop old tables
  ['OrderItems', 'Orders', 'Products', 'Users', 'Employees'].forEach(t => {
    try { alasql(`DROP TABLE IF EXISTS ${t}`); } catch (e) {}
  });

  // Create tables
  alasql('CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, country VARCHAR, is_premium BOOLEAN, created_at DATE)');
  alasql('CREATE TABLE Products (id INT PRIMARY KEY, name VARCHAR, category VARCHAR, price DECIMAL, stock INT)');
  alasql('CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR, order_total DECIMAL)');
  alasql('CREATE TABLE OrderItems (id INT PRIMARY KEY, order_id INT, product_id INT, quantity INT, unit_price DECIMAL)');
  alasql('CREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, department VARCHAR, hire_date DATE, manager_id INT, salary DECIMAL)');

  // --- USERS ---
  const usersData = [];
  for (let i = 1; i <= 99; i++) {
    const fname = getRandom(firstNames);
    const lname = getRandom(lastNames);
    usersData.push({
      id: i, name: `${fname} ${lname}`,
      email: `${fname.toLowerCase()}.${lname.toLowerCase()}@${getRandom(domains)}`,
      country: getRandom(countries), is_premium: Math.random() > 0.8,
      created_at: getRandomDate(2022, 2023)
    });
  }
  usersData.push({ id: 100, name: 'Ghost User', email: 'ghost@nowhere.com', country: 'Antarctica', is_premium: false, created_at: '2024-01-01' });
  usersData.push({ id: 101, name: 'Dormant User', email: 'dormant@sleepy.com', country: 'Italy', is_premium: true, created_at: '2020-01-01' });
  usersData.push({ id: 102, name: 'Alice', email: 'alice@corp.com', country: 'USA', is_premium: false, created_at: '2023-01-01' });
  usersData.push({ id: 103, name: 'Mario Rossi', email: 'mario@example.com', country: 'Italy', is_premium: true, created_at: '2023-12-31' });
  usersData.push({ id: 104, name: 'No Country', email: null, country: null, is_premium: false, created_at: '2022-01-01' });
  usersData.push({ id: 105, name: 'Alice', email: 'alice.all@categories.com', country: 'UK', is_premium: true, created_at: '2023-05-01' });
  usersData.push({ id: 106, name: 'Mario Rossi', email: 'mario_fake@corp.com', country: 'Spain', is_premium: false, created_at: '2023-06-01' });
  usersData.push({ id: 107, name: 'Underpaid Manager', email: 'underpaid@techstore.com', country: 'Italy', is_premium: false, created_at: '2024-01-01' });

  usersData.forEach(r => {
    const emailVal = r.email ? `'${r.email.replace(/'/g, "''")}'` : 'NULL';
    const countryVal = r.country ? `'${r.country.replace(/'/g, "''")}'` : 'NULL';
    alasql(`INSERT INTO Users VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', ${emailVal}, ${countryVal}, ${r.is_premium}, '${r.created_at}')`);
  });

  // --- PRODUCTS ---
  const productsData = [];
  for (let i = 1; i <= 48; i++) {
    const cat = getRandom(categories);
    productsData.push({ id: i, name: `${cat} ${getRandom(productAdjectives)} ${getRandom(productNouns)} ${getRandomInt(100, 900)}`, category: cat, price: Number((getRandomInt(20, 2000) - 0.01).toFixed(2)), stock: getRandomInt(0, 150) });
  }
  productsData.push({ id: 49, name: 'Monitor 4K', category: 'Electronics', price: 399.99, stock: 10 });
  productsData.push({ id: 50, name: 'Lampada Smart', category: 'Home', price: 49.99, stock: 25 });
  productsData.push({ id: 99, name: 'Quantum Computer Prototype', category: 'R&D', price: 99999.99, stock: 1 });
  productsData.push({ id: 51, name: 'Keyboard', category: 'Electronics', price: 29.99, stock: 50 });
  productsData.push({ id: 52, name: 'Smartphone', category: 'Electronics', price: 599.99, stock: 30 });
  productsData.push({ id: 53, name: 'Divano Luxury', category: 'Home', price: 1500.00, stock: 5 });

  for (let k = 0; k < 5; k++) {
    productsData.push({ id: 300 + k, name: `Pro Server ${k}`, category: 'Servers', price: 2000.00, stock: 50 });
  }
  for (let j = 0; j < 15; j++) {
    productsData.push({ id: 200 + j, name: `Bulk Item ${j}`, category: 'Accessories', price: 15.00, stock: 100 });
  }
  productsData.push({ id: 9080, name: 'Laptop', category: 'Tech', price: 50, stock: 0 });
  productsData.push({ id: 9081, name: 'Smartphone', category: 'Category2', price: 100, stock: 10 });
  productsData.push({ id: 9082, name: 'Cover', category: 'Category3', price: 10, stock: 50 });
  productsData.push({ id: 9300, name: 'OnlyElectronics', category: 'Electronics', price: 50, stock: 5 });
  productsData.push({ id: 9301, name: 'EmptyCatProduct', category: 'EmptyCategory', price: 100, stock: 0 });

  const myCats = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
  myCats.forEach((cat, index) => {
    productsData.push({ id: 9200 + index, name: `AliceProd_${cat}`, category: cat, price: 10, stock: 10 });
  });

  productsData.forEach(r => alasql(`INSERT INTO Products VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${r.category.replace(/'/g, "''")}', ${r.price}, ${r.stock})`));

  // --- ORDERS ---
  const ordersData = [];
  for (let i = 1; i <= 60; i++) {
    let oDate;
    if (i <= 10) oDate = getRandomDate(2021, 2021);
    else if (i <= 50) oDate = getRandomDate(2023, 2024);
    else oDate = getRandomDate(2025, 2025);

    let uid = getRandomInt(1, 99);
    if (i === 1) uid = 2;
    if (i === 2) uid = 3;
    if (i === 3) uid = 4;
    if (i === 4) uid = 5;
    if (i > 4 && uid === 5) uid = 6;

    let currentTotal = Number((getRandomInt(50, 3000) + 0.99).toFixed(2));
    if (i === 10) { uid = 6; currentTotal = 500.00; }
    if (i === 11) { uid = 6; currentTotal = 400.00; }

    ordersData.push({ id: i, user_id: uid, order_date: oDate, status: getRandom(statuses), order_total: currentTotal });
  }
  ordersData.push({ id: 9062, user_id: 102, order_date: '2023-01-01', status: 'Delivered', order_total: 10 });
  ordersData.push({ id: 9063, user_id: 103, order_date: '2023-06-15', status: 'Shipped', order_total: 100 });
  ordersData.push({ id: 9001, user_id: 9999, order_date: '2023-01-01', status: 'Pending', order_total: 0 });
  ordersData.push({ id: 9301, user_id: 1, order_date: '2023-01-01', status: 'Pending', order_total: 15 });
  ordersData.push({ id: 9302, user_id: 1, order_date: '2023-01-01', status: 'Pending', order_total: 20 });
  ordersData.push({ id: 9303, user_id: 100, order_date: '2023-02-01', status: 'Delivered', order_total: 50 });
  const nowStr = new Date().toISOString().split('T')[0];
  ordersData.push({ id: 9304, user_id: 100, order_date: nowStr, status: 'Pending', order_total: 100 });

  myCats.forEach((cat, index) => {
    ordersData.push({ id: 9200 + index, user_id: 105, order_date: '2023-05-01', status: 'Delivered', order_total: 10 });
  });

  ordersData.forEach(r => alasql(`INSERT INTO Orders VALUES (${r.id}, ${r.user_id}, '${r.order_date}', '${r.status.replace(/'/g, "''")}', ${r.order_total})`));

  // --- ORDER ITEMS ---
  const orderItemsData = [];
  let itemId = 1;
  for (let oid = 1; oid <= 60; oid++) {
    if (oid === 1) { orderItemsData.push({ id: itemId++, order_id: oid, product_id: 49, quantity: 1, unit_price: 399.99 }); continue; }
    if (oid === 2) { orderItemsData.push({ id: itemId++, order_id: oid, product_id: 49, quantity: 1, unit_price: 399.99 }); orderItemsData.push({ id: itemId++, order_id: oid, product_id: 51, quantity: 1, unit_price: 29.99 }); continue; }
    if (oid === 3) { orderItemsData.push({ id: itemId++, order_id: oid, product_id: 51, quantity: 1, unit_price: 29.99 }); continue; }

    const numItems = getRandomInt(1, 4);
    for (let k = 0; k < numItems; k++) {
      if (productsData.length > 0) {
        const prod = productsData[getRandomInt(0, Math.min(48, productsData.length - 1))];
        if (prod) orderItemsData.push({ id: itemId++, order_id: oid, product_id: prod.id, quantity: getRandomInt(1, 3), unit_price: prod.price });
      }
    }
  }
  orderItemsData.push({ id: 9151, order_id: 9062, product_id: 9080, quantity: 1, unit_price: 50 });
  orderItemsData.push({ id: 9152, order_id: 9063, product_id: 9081, quantity: 2, unit_price: 100 });
  orderItemsData.push({ id: 9153, order_id: 9063, product_id: 9082, quantity: 1, unit_price: 10 });
  orderItemsData.push({ id: 9303, order_id: 9303, product_id: 9300, quantity: 1, unit_price: 50 });

  myCats.forEach((cat, index) => {
    orderItemsData.push({ id: 9200 + index, order_id: 9200 + index, product_id: 9200 + index, quantity: 1, unit_price: 10 });
  });

  orderItemsData.forEach(r => alasql(`INSERT INTO OrderItems VALUES (${r.id}, ${r.order_id}, ${r.product_id}, ${r.quantity}, ${r.unit_price})`));

  // --- EMPLOYEES ---
  const employeesData = [
    { id: 1, name: 'Alessandro Romano', department: 'Executive', hire_date: '2015-03-01', manager_id: null, salary: 120000 },
    { id: 2, name: 'Giulia Bianchi', department: 'Sales', hire_date: '2016-05-15', manager_id: 1, salary: 70000 },
    { id: 3, name: 'Marco Rossi', department: 'Engineering', hire_date: '2017-02-20', manager_id: 1, salary: 95000 },
    { id: 4, name: 'Sofia Verdi', department: 'Marketing', hire_date: '2018-07-10', manager_id: 1, salary: 80000 },
    { id: 5, name: 'Luca Esposito', department: 'Sales', hire_date: '2019-01-10', manager_id: 2, salary: 75000 },
    { id: 6, name: 'Francesca Ricci', department: 'Sales', hire_date: '2019-04-25', manager_id: 2, salary: 60000 },
    { id: 7, name: 'Matteo Gallo', department: 'Engineering', hire_date: '2020-03-12', manager_id: 3, salary: 85000 },
    { id: 8, name: 'Chiara Conti', department: 'Engineering', hire_date: '2020-08-01', manager_id: 3, salary: 88000 },
    { id: 9, name: 'Andrea Bruno', department: 'Engineering', hire_date: '2021-01-15', manager_id: 3, salary: 82000 },
    { id: 10, name: 'Elena Marino', department: 'Marketing', hire_date: '2021-05-20', manager_id: 4, salary: 65000 },
    { id: 11, name: 'Davide Greco', department: 'Support', hire_date: '2022-02-10', manager_id: 6, salary: 40000 },
    { id: 12, name: 'Sara Barbieri', department: 'Support', hire_date: '2022-06-30', manager_id: 6, salary: 42000 },
    { id: 13, name: 'Lorenzo Fontana', department: 'Engineering', hire_date: '2023-01-01', manager_id: 7, salary: 60000 },
    { id: 14, name: 'Alice Santoro', department: 'HR', hire_date: '2019-11-01', manager_id: 1, salary: 70000 },
    { id: 15, name: 'Simone Rinaldi', department: 'Finance', hire_date: '2018-09-15', manager_id: 1, salary: 75000 },
    { id: 501, name: 'Underpaid Manager', department: 'Sales', hire_date: '2022-01-01', manager_id: null, salary: 1000 },
    { id: 502, name: 'Rich Employee', department: 'Sales', hire_date: '2022-01-01', manager_id: 501, salary: 5000 },
  ];

  employeesData.forEach(r => {
    const email = `${r.name.split(' ')[0].toLowerCase()}.${(r.name.split(' ')[1] || '').toLowerCase()}@techstore.com`;
    const managerVal = r.manager_id === null ? 'NULL' : r.manager_id;
    alasql(`INSERT INTO Employees VALUES (${r.id}, '${r.name.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${r.department.replace(/'/g, "''")}', '${r.hire_date}', ${managerVal}, ${r.salary})`);
  });
}

// ================================
// EXERCISE PARSER
// ================================
function parseExercises() {
  const filePath = path.join(__dirname, '..', 'services', 'exerciseGenerator.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find topic blocks
  const topicNames = {
    'TopicId.Basics': 'basics',
    'TopicId.Filtering': 'filtering',
    'TopicId.Sorting': 'sorting',
    'TopicId.Aggregation': 'aggregation',
    'TopicId.Functions': 'functions',
    'TopicId.Dates': 'dates',
    'TopicId.Case': 'case',
    'TopicId.Joins': 'joins',
    'TopicId.Advanced': 'advanced'
  };
  
  const difficultyNames = {
    'Difficulty.Easy': 'Easy',
    'Difficulty.Medium': 'Medium',
    'Difficulty.Hard': 'Hard'
  };

  const exercises = [];
  
  // Extract all exercise objects using regex
  // Find queryTemplate, titleTemplate, descTemplate values
  const exerciseRegex = /\{[^{}]*titleTemplate\s*:\s*"([^"]*)"[^{}]*descTemplate\s*:\s*"([^"]*)"[^{}]*queryTemplate\s*:\s*"((?:[^"\\]|\\.)*)"[^{}]*hints\s*:\s*\[((?:[^\[\]])*)\][^{}]*explanation\s*:\s*"([^"]*)"[^{}]*\}/gs;
  
  // Simpler approach: parse line by line to extract exercises within known topic/difficulty blocks
  const lines = content.split('\n');
  let currentTopic = null;
  let currentDifficulty = null;
  let currentExercise = {};
  let exerciseIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect topic changes
    for (const [key, val] of Object.entries(topicNames)) {
      if (line.includes(`[${key}]:`)) {
        currentTopic = val;
        exerciseIndex = 0;
      }
    }
    
    // Detect difficulty changes
    for (const [key, val] of Object.entries(difficultyNames)) {
      if (line.includes(`[${key}]:`)) {
        currentDifficulty = val;
        exerciseIndex = 0;
      }
    }
    
    // Extract queryTemplate 
    const queryMatch = line.match(/queryTemplate\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (queryMatch && currentTopic && currentDifficulty) {
      const query = queryMatch[1].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
      
      // Look back for titleTemplate and descTemplate
      let title = '';
      let desc = '';
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        const prevLine = lines[j].trim();
        const titleMatch = prevLine.match(/titleTemplate\s*:\s*"([^"]*)"/);
        if (titleMatch) title = titleMatch[1];
        const descMatch = prevLine.match(/descTemplate\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (descMatch) desc = descMatch[1];
      }
      
      // Look for replacements
      let hasReplacements = false;
      for (let j = i; j < Math.min(lines.length, i + 10); j++) {
        if (lines[j].includes('replacements:') && !lines[j].includes('{}')) {
          hasReplacements = true;
          break;
        }
        if (lines[j].includes('replacements: {}') || lines[j].includes('replacements:{}')) {
          break;
        }
      }
      
      // Find replacement values for template variables
      let resolvedQuery = query;
      if (hasReplacements || query.includes('{')) {
        // Simple replacements: {cat} -> first category, {country} -> first country, etc.
        resolvedQuery = query
          .replace(/\{cat\}/g, 'Electronics')
          .replace(/\{country\}/g, 'Italy')
          .replace(/\{status\}/g, 'Shipped')
          .replace(/\{name\}/g, 'Mario Rossi')
          .replace(/\{dept\}/g, 'Engineering')
          .replace(/\{dep\}/g, 'Engineering')
          .replace(/\{department\}/g, 'Engineering')
          .replace(/\{year\}/g, '2023')
          .replace(/\{month\}/g, '6')
          .replace(/\{price_min\}/g, '50')
          .replace(/\{price_max\}/g, '500')
          .replace(/\{stock\}/g, '10')
          .replace(/\{min\}/g, '50')
          .replace(/\{max\}/g, '500')
          .replace(/\{n\}/g, '5')
          .replace(/\{limit\}/g, '5')
          .replace(/\{pct\}/g, '1.22')
          .replace(/\{perc\}/g, '1.22')
          .replace(/\{percentage\}/g, '1.22')
          .replace(/\{threshold\}/g, '100')
          .replace(/\{email\}/g, 'alice@corp.com')
          .replace(/\{product\}/g, 'Monitor 4K')
          .replace(/\{table\}/g, 'Users')
          .replace(/\{col\}/g, 'name')
          .replace(/\{domain\}/g, 'gmail.com')
          .replace(/\{letter\}/g, 'A')
          .replace(/\{prefix\}/g, 'Mar')
          .replace(/\{suffix\}/g, 'com')
          .replace(/\{salary_min\}/g, '50000')
          .replace(/\{salary_max\}/g, '100000')
          .replace(/\{salary\}/g, '50000')
          .replace(/\{val\}/g, '100')
          .replace(/\{value\}/g, '100')
          .replace(/\{len\}/g, '5')
          .replace(/\{order_status\}/g, 'Shipped')
          .replace(/\{qty\}/g, '2')
          .replace(/\{quantity\}/g, '2')
          .replace(/\{date\}/g, '2023-01-01')
          .replace(/\{start_date\}/g, '2023-01-01')
          .replace(/\{end_date\}/g, '2024-01-01')
          .replace(/\{day\}/g, '15')
          .replace(/\{category\}/g, 'Electronics')
          .replace(/\{manager_id\}/g, '1');
      }
      
      exercises.push({
        topic: currentTopic,
        difficulty: currentDifficulty,
        index: exerciseIndex++,
        title,
        description: desc,
        query: resolvedQuery,
        originalQuery: query,
        line: i + 1
      });
    }
  }
  
  return exercises;
}

// ================================
// VALIDATION
// ================================
function validate() {
  console.log('🔧 Initializing database...');
  initDatabase();
  
  console.log('📖 Parsing exercises...');
  const exercises = parseExercises();
  console.log(`📊 Found ${exercises.length} exercises\n`);
  
  const errors = [];
  const warnings = [];
  let passed = 0;
  
  // Group by topic/difficulty for reporting
  const stats = {};
  
  exercises.forEach((ex, i) => {
    const key = `${ex.topic}/${ex.difficulty}`;
    if (!stats[key]) stats[key] = { total: 0, passed: 0, errors: 0, warnings: 0 };
    stats[key].total++;
    
    // Skip if query still has unresolved template variables
    if (ex.query.includes('{') && ex.query.includes('}')) {
      warnings.push({
        type: 'UNRESOLVED_TEMPLATE',
        topic: ex.topic,
        difficulty: ex.difficulty,
        index: ex.index,
        title: ex.title,
        query: ex.query,
        line: ex.line,
        message: 'Query contains unresolved template variables'
      });
      stats[key].warnings++;
      return;
    }
    
    try {
      const result = alasql(ex.query);
      
      if (ex.query.toUpperCase().trim().startsWith('SELECT') || ex.query.toUpperCase().trim().startsWith('(SELECT')) {
        if (!result || (Array.isArray(result) && result.length === 0)) {
          warnings.push({
            type: 'EMPTY_RESULT',
            topic: ex.topic,
            difficulty: ex.difficulty,
            index: ex.index,
            title: ex.title,
            query: ex.query,
            line: ex.line,
            message: 'Query returned 0 rows'
          });
          stats[key].warnings++;
          return;
        }
      }
      
      passed++;
      stats[key].passed++;
    } catch (e) {
      errors.push({
        type: 'SQL_ERROR',
        topic: ex.topic,
        difficulty: ex.difficulty,
        index: ex.index,
        title: ex.title,
        query: ex.query,
        line: ex.line,
        error: e.message
      });
      stats[key].errors++;
    }
  });
  
  // ================================
  // REPORT
  // ================================
  console.log('=' .repeat(70));
  console.log('📊 VALIDATION REPORT');
  console.log('=' .repeat(70));
  
  // Stats table
  console.log('\n📈 Per Topic/Difficulty:');
  console.log('-'.repeat(60));
  Object.entries(stats).sort().forEach(([key, s]) => {
    const status = s.errors > 0 ? '❌' : s.warnings > 0 ? '⚠️' : '✅';
    console.log(`  ${status} ${key.padEnd(25)} ${s.passed}/${s.total} passed  (${s.errors} errors, ${s.warnings} warnings)`);
  });
  
  // Errors
  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    console.log('-'.repeat(60));
    errors.forEach((err, i) => {
      console.log(`  ${i + 1}. [${err.topic}/${err.difficulty}] "${err.title}" (line ${err.line})`);
      console.log(`     Query: ${err.query.substring(0, 100)}${err.query.length > 100 ? '...' : ''}`);
      console.log(`     Error: ${err.error}`);
      console.log();
    });
  }
  
  // Warnings
  if (warnings.length > 0) {
    console.log(`\n⚠️ WARNINGS (${warnings.length}):`);
    console.log('-'.repeat(60));
    warnings.forEach((warn, i) => {
      console.log(`  ${i + 1}. [${warn.topic}/${warn.difficulty}] "${warn.title}" (line ${warn.line})`);
      console.log(`     ${warn.message}`);
      if (warn.query) console.log(`     Query: ${warn.query.substring(0, 100)}${warn.query.length > 100 ? '...' : ''}`);
      console.log();
    });
  }
  
  // Summary  
  console.log('=' .repeat(70));
  console.log(`📊 SUMMARY: ${passed}/${exercises.length} passed | ${errors.length} errors | ${warnings.length} warnings`);
  console.log('=' .repeat(70));
  
  // Write results to JSON
  const report = {
    timestamp: new Date().toISOString(),
    total: exercises.length,
    passed,
    errors: errors.length,
    warnings: warnings.length,
    errorDetails: errors,
    warningDetails: warnings,
    stats
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'validation_report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('\n💾 Full report saved to validation_report.json');
  
  return errors.length;
}

const errorCount = validate();
process.exit(errorCount > 0 ? 1 : 0);
