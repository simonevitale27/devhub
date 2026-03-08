/**
 * Exhaustive Template Variable Tester
 * 
 * For each exercise with template variables:
 * 1. Tries EVERY possible replacement value
 * 2. Reports which values produce 0 rows (BAD - exercise breaks)
 * 3. Reports which values produce errors (CRITICAL - SQL crash)
 * 
 * Also checks: does each replacement value actually exist in the database?
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
alasql.fn.BIT_LENGTH = (s) => s ? Buffer.from(s).length * 8 : 0;
alasql.fn.LPAD = (s, len, pad) => s ? String(s).padStart(len, pad || ' ') : null;
alasql.fn.RPAD = (s, len, pad) => s ? String(s).padEnd(len, pad || ' ') : null;
alasql.fn.ASCII = (s) => s ? s.charCodeAt(0) : null;
alasql.fn.SIGN = (x) => Math.sign(x);
alasql.fn.LENGTH = (s) => s ? s.length : null;
alasql.fn.DAYOFYEAR = (d) => { if (!d) return null; const date = new Date(d); const start = new Date(date.getFullYear(), 0, 0); return Math.floor((date.getTime() - start.getTime()) / 86400000); };
alasql.fn.WEEK = (d) => { if (!d) return null; return Math.ceil((alasql.fn.DAYOFYEAR(d) + new Date(new Date(d).getFullYear(), 0, 1).getDay()) / 7); };
alasql.fn.QUARTER = (d) => d ? Math.ceil((new Date(d).getMonth() + 1) / 3) : null;
alasql.fn.SYSDATE = () => new Date().toISOString().replace('T', ' ').substring(0, 19);
alasql.fn.YEAR = (d) => d ? new Date(d).getFullYear() : null;
alasql.fn.TO_DAYS = (d) => d ? Math.floor(new Date(d).getTime() / 86400000) : null;
alasql.fn.NOW = () => new Date().toISOString().replace('T', ' ').substring(0, 19);
alasql.fn.MONTHNAME = (d) => { if (!d) return null; return new Date(d).toLocaleString('en-US', { month: 'long' }); };
alasql.fn.DAYNAME = (d) => { if (!d) return null; return new Date(d).toLocaleString('en-US', { weekday: 'long' }); };
alasql.fn.STR_TO_DATE = (s, f) => { if (!s) return null; if (f === '%d/%m/%Y') { const [d, m, y] = s.split(/[-/]/).map(Number); return new Date(y, m - 1, d); } return new Date(s); };
alasql.fn.DATE_FORMAT = (d, f) => { if (!d) return null; const dt = new Date(d); if (isNaN(dt.getTime())) return null; return f.replace('%Y', dt.getFullYear().toString()).replace('%m', (dt.getMonth()+1).toString().padStart(2,'0')).replace('%d', dt.getDate().toString().padStart(2,'0')).replace('%H', dt.getHours().toString().padStart(2,'0')).replace('%i', dt.getMinutes().toString().padStart(2,'0')).replace('%s', dt.getSeconds().toString().padStart(2,'0')).replace('%W', dt.toLocaleString('en-US',{weekday:'long'})).replace('%M', dt.toLocaleString('en-US',{month:'long'})).replace('%T', dt.toTimeString().split(' ')[0]); };
alasql.fn.TIMESTAMPDIFF = (u, s, e) => { const d1=new Date(s), d2=new Date(e), ms=d2.getTime()-d1.getTime(); switch((u||'').toUpperCase()){case 'SECOND':return Math.floor(ms/1000);case 'MINUTE':return Math.floor(ms/60000);case 'HOUR':return Math.floor(ms/3600000);case 'DAY':return Math.floor(ms/86400000);case 'MONTH':return(d2.getFullYear()-d1.getFullYear())*12+(d2.getMonth()-d1.getMonth());case 'YEAR':return d2.getFullYear()-d1.getFullYear();default:return null;} };
alasql.fn.DATEDIFF = (d1, d2) => { return Math.ceil((new Date(d1).getTime() - new Date(d2).getTime()) / 86400000); };
alasql.fn.LAST_DAY = (d) => new Date(new Date(d).getFullYear(), new Date(d).getMonth() + 1, 0);
alasql.fn.TIME = (d) => { if (!d) return null; try { return new Date(d).toISOString().split('T')[1].split('.')[0]; } catch { return null; } };
alasql.fn.TIME_TO_SEC = (t) => { if (!t) return 0; const [h,m,s]= t.split(':').map(Number); return (h||0)*3600+(m||0)*60+(s||0); };
alasql.fn.TIMEDIFF = (t1, t2) => { const s1=alasql.fn.TIME_TO_SEC(t1), s2=alasql.fn.TIME_TO_SEC(t2), diff=s1-s2, abs=Math.abs(diff); return (diff<0?'-':'') + Math.floor(abs/3600).toString().padStart(2,'0') + ':' + Math.floor((abs%3600)/60).toString().padStart(2,'0') + ':' + (abs%60).toString().padStart(2,'0'); };
alasql.fn.MAKEDATE = (y, d) => new Date(y, 0, d);
alasql.fn.PERIOD_DIFF = (p1, p2) => { const y1=Math.floor(p1/100),m1=p1%100,y2=Math.floor(p2/100),m2=p2%100; return (y1*12+m1)-(y2*12+m2); };
alasql.fn.UNIX_TIMESTAMP = (d) => Math.floor((d?new Date(d):new Date()).getTime()/1000);
alasql.fn.FROM_UNIXTIME = (ts) => new Date(ts*1000).toISOString().replace('T',' ').split('.')[0];

// ================================
// INIT DATABASE (same as sqlService.ts — copied from validate script)
// ================================
// Standalone - no imports from other scripts

// Database initialization is inline below
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

  ['OrderItems', 'Orders', 'Products', 'Users', 'Employees'].forEach(t => {
    try { alasql(`DROP TABLE IF EXISTS ${t}`); } catch (e) {}
  });

  alasql('CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, country VARCHAR, is_premium BOOLEAN, created_at DATE)');
  alasql('CREATE TABLE Products (id INT PRIMARY KEY, name VARCHAR, category VARCHAR, price DECIMAL, stock INT)');
  alasql('CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR, order_total DECIMAL)');
  alasql('CREATE TABLE OrderItems (id INT PRIMARY KEY, order_id INT, product_id INT, quantity INT, unit_price DECIMAL)');
  alasql('CREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, department VARCHAR, hire_date DATE, manager_id INT, salary DECIMAL)');

  // Users
  for (let i = 1; i <= 99; i++) {
    const fn = getRandom(firstNames), ln = getRandom(lastNames);
    const name = `${fn} ${ln}`.replace(/'/g, "''");
    const emailAddr = `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[' ]/g, '')}@${getRandom(domains)}`;
    alasql(`INSERT INTO Users VALUES (${i}, '${name}', '${emailAddr}', '${getRandom(countries)}', ${Math.random() > 0.8}, '${getRandomDate(2022, 2023)}')`);
  }
  alasql("INSERT INTO Users VALUES (100, 'Ghost User', 'ghost@nowhere.com', 'Antarctica', false, '2024-01-01')");
  alasql("INSERT INTO Users VALUES (101, 'Dormant User', 'dormant@sleepy.com', 'Italy', true, '2020-01-01')");
  alasql("INSERT INTO Users VALUES (102, 'Alice', 'alice@corp.com', 'USA', false, '2023-01-01')");
  alasql("INSERT INTO Users VALUES (103, 'Mario Rossi', 'mario@example.com', 'Italy', true, '2023-12-31')");
  alasql("INSERT INTO Users VALUES (104, 'No Country', NULL, NULL, false, '2022-01-01')");
  alasql("INSERT INTO Users VALUES (105, 'Alice', 'alice.all@categories.com', 'UK', true, '2023-05-01')");
  alasql("INSERT INTO Users VALUES (106, 'Mario Rossi', 'mario_fake@corp.com', 'Spain', false, '2023-06-01')");
  alasql("INSERT INTO Users VALUES (107, 'Underpaid Manager', 'underpaid@techstore.com', 'Italy', false, '2024-01-01')");

  // Products
  for (let i = 1; i <= 48; i++) {
    const cat = getRandom(categories);
    alasql(`INSERT INTO Products VALUES (${i}, '${cat} ${getRandom(productAdjectives)} ${getRandom(productNouns)} ${getRandomInt(100,900)}', '${cat}', ${(getRandomInt(20,2000)-0.01).toFixed(2)}, ${getRandomInt(0,150)})`);
  }
  alasql("INSERT INTO Products VALUES (49, 'Monitor 4K', 'Electronics', 399.99, 10)");
  alasql("INSERT INTO Products VALUES (50, 'Lampada Smart', 'Home', 49.99, 25)");
  alasql("INSERT INTO Products VALUES (99, 'Quantum Computer Prototype', 'R&D', 99999.99, 1)");
  alasql("INSERT INTO Products VALUES (51, 'Keyboard', 'Electronics', 29.99, 50)");
  alasql("INSERT INTO Products VALUES (52, 'Smartphone', 'Electronics', 599.99, 30)");
  alasql("INSERT INTO Products VALUES (53, 'Divano Luxury', 'Home', 1500.00, 5)");
  for (let k=0;k<5;k++) alasql(`INSERT INTO Products VALUES (${300+k}, 'Pro Server ${k}', 'Servers', 2000.00, 50)`);
  for (let j=0;j<15;j++) alasql(`INSERT INTO Products VALUES (${200+j}, 'Bulk Item ${j}', 'Accessories', 15.00, 100)`);
  alasql("INSERT INTO Products VALUES (9080, 'Laptop', 'Tech', 50, 0)");
  alasql("INSERT INTO Products VALUES (9081, 'Smartphone', 'Category2', 100, 10)");
  alasql("INSERT INTO Products VALUES (9082, 'Cover', 'Category3', 10, 50)");
  alasql("INSERT INTO Products VALUES (9300, 'OnlyElectronics', 'Electronics', 50, 5)");
  alasql("INSERT INTO Products VALUES (9301, 'EmptyCatProduct', 'EmptyCategory', 100, 0)");
  categories.forEach((cat, i) => alasql(`INSERT INTO Products VALUES (${9200+i}, 'AliceProd_${cat}', '${cat}', 10, 10)`));

  // Orders
  for (let i = 1; i <= 60; i++) {
    let oDate;
    if (i <= 10) oDate = getRandomDate(2021, 2021);
    else if (i <= 50) oDate = getRandomDate(2023, 2024);
    else oDate = getRandomDate(2025, 2025);
    let uid = getRandomInt(1, 99);
    if (i === 1) uid = 2; if (i === 2) uid = 3; if (i === 3) uid = 4; if (i === 4) uid = 5;
    if (i > 4 && uid === 5) uid = 6;
    let total = Number((getRandomInt(50,3000)+0.99).toFixed(2));
    if (i === 10) { uid=6; total=500; } if (i === 11) { uid=6; total=400; }
    alasql(`INSERT INTO Orders VALUES (${i}, ${uid}, '${oDate}', '${getRandom(statuses)}', ${total})`);
  }
  alasql("INSERT INTO Orders VALUES (9062, 102, '2023-01-01', 'Delivered', 10)");
  alasql("INSERT INTO Orders VALUES (9063, 103, '2023-06-15', 'Shipped', 100)");
  alasql("INSERT INTO Orders VALUES (9001, 9999, '2023-01-01', 'Pending', 0)");
  alasql("INSERT INTO Orders VALUES (9301, 1, '2023-01-01', 'Pending', 15)");
  alasql("INSERT INTO Orders VALUES (9302, 1, '2023-01-01', 'Pending', 20)");
  alasql("INSERT INTO Orders VALUES (9303, 100, '2023-02-01', 'Delivered', 50)");
  const nowStr = new Date().toISOString().split('T')[0];
  alasql(`INSERT INTO Orders VALUES (9304, 100, '${nowStr}', 'Pending', 100)`);
  categories.forEach((cat, i) => alasql(`INSERT INTO Orders VALUES (${9200+i}, 105, '2023-05-01', 'Delivered', 10)`));

  // OrderItems
  let itemId = 1;
  alasql(`INSERT INTO OrderItems VALUES (${itemId++}, 1, 49, 1, 399.99)`);
  alasql(`INSERT INTO OrderItems VALUES (${itemId++}, 2, 49, 1, 399.99)`);
  alasql(`INSERT INTO OrderItems VALUES (${itemId++}, 2, 51, 1, 29.99)`);
  alasql(`INSERT INTO OrderItems VALUES (${itemId++}, 3, 51, 1, 29.99)`);
  for (let oid=4; oid<=60; oid++) {
    const numItems = getRandomInt(1, 4);
    for (let k=0; k<numItems; k++) {
      const pid = getRandomInt(1, 48);
      alasql(`INSERT INTO OrderItems VALUES (${itemId++}, ${oid}, ${pid}, ${getRandomInt(1,3)}, ${(getRandomInt(20,2000)-0.01).toFixed(2)})`);
    }
  }
  alasql("INSERT INTO OrderItems VALUES (9151, 9062, 9080, 1, 50)");
  alasql("INSERT INTO OrderItems VALUES (9152, 9063, 9081, 2, 100)");
  alasql("INSERT INTO OrderItems VALUES (9153, 9063, 9082, 1, 10)");
  alasql("INSERT INTO OrderItems VALUES (9303, 9303, 9300, 1, 50)");
  categories.forEach((cat, i) => alasql(`INSERT INTO OrderItems VALUES (${9200+i}, ${9200+i}, ${9200+i}, 1, 10)`));

  // Employees (fixed data)
  const emps = [
    [1,'Alessandro Romano','Executive','2015-03-01',null,120000],
    [2,'Giulia Bianchi','Sales','2016-05-15',1,70000],
    [3,'Marco Rossi','Engineering','2017-02-20',1,95000],
    [4,'Sofia Verdi','Marketing','2018-07-10',1,80000],
    [5,'Luca Esposito','Sales','2019-01-10',2,75000],
    [6,'Francesca Ricci','Sales','2019-04-25',2,60000],
    [7,'Matteo Gallo','Engineering','2020-03-12',3,85000],
    [8,'Chiara Conti','Engineering','2020-08-01',3,88000],
    [9,'Andrea Bruno','Engineering','2021-01-15',3,82000],
    [10,'Elena Marino','Marketing','2021-05-20',4,65000],
    [11,'Davide Greco','Support','2022-02-10',6,40000],
    [12,'Sara Barbieri','Support','2022-06-30',6,42000],
    [13,'Lorenzo Fontana','Engineering','2023-01-01',7,60000],
    [14,'Alice Santoro','HR','2019-11-01',1,70000],
    [15,'Simone Rinaldi','Finance','2018-09-15',1,75000],
    [501,'Underpaid Manager','Sales','2022-01-01',null,1000],
    [502,'Rich Employee','Sales','2022-01-01',501,5000],
  ];
  emps.forEach(e => {
    const email = `${e[1].split(' ')[0].toLowerCase()}.${(e[1].split(' ')[1]||'').toLowerCase()}@techstore.com`;
    alasql(`INSERT INTO Employees VALUES (${e[0]}, '${e[1]}', '${email}', '${e[2]}', '${e[3]}', ${e[4]===null?'NULL':e[4]}, ${e[5]})`);
  });
}

// ================================
// STEP 1: Determine what's ACTUALLY in the database
// ================================
initDatabase();

console.log('📊 ACTUAL DATABASE VALUES:');
console.log('-'.repeat(50));

const actualCountries = alasql('SELECT DISTINCT country FROM Users WHERE country IS NOT NULL').map(r => r.country).sort();
console.log(`Countries (${actualCountries.length}): ${actualCountries.join(', ')}`);

const actualCategories = alasql('SELECT DISTINCT category FROM Products').map(r => r.category).sort();
console.log(`Categories (${actualCategories.length}): ${actualCategories.join(', ')}`);

const actualStatuses = alasql('SELECT DISTINCT status FROM Orders').map(r => r.status).sort();
console.log(`Statuses (${actualStatuses.length}): ${actualStatuses.join(', ')}`);

const actualDepartments = alasql('SELECT DISTINCT department FROM Employees').map(r => r.department).sort();
console.log(`Departments (${actualDepartments.length}): ${actualDepartments.join(', ')}`);

const actualNames = alasql('SELECT DISTINCT name FROM Users').map(r => r.name).sort();

// ================================
// STEP 2: Read DATA object from exerciseGenerator.ts
// ================================
const genContent = fs.readFileSync(path.join(__dirname, '..', 'services', 'exerciseGenerator.ts'), 'utf-8');

// Extract DATA arrays
const extractArray = (name) => {
  const regex = new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\]`);
  const match = genContent.match(regex);
  if (!match) return [];
  return match[1].match(/"([^"]*)"|(\d+(?:\.\d+)?)/g)?.map(s => s.replace(/"/g, '')) || [];
};

const DATA_countries = extractArray('countries');
const DATA_categories = extractArray('categories');
const DATA_departments = extractArray('departments');
const DATA_statuses = extractArray('order_statuses');
const DATA_names = extractArray('names');

console.log('\n📋 DATA REPLACEMENT VALUES (from exerciseGenerator):');
console.log('-'.repeat(50));
console.log(`Countries: ${DATA_countries.join(', ')}`);
console.log(`Categories: ${DATA_categories.join(', ')}`);
console.log(`Departments: ${DATA_departments.join(', ')}`);
console.log(`Statuses: ${DATA_statuses.join(', ')}`);
console.log(`Names: ${DATA_names.join(', ')}`);

// ================================
// STEP 3: Find mismatches
// ================================
console.log('\n🔍 MISMATCHES (values in DATA but NOT in database):');
console.log('-'.repeat(50));

const missingCountries = DATA_countries.filter(c => !actualCountries.includes(c));
if (missingCountries.length) console.log(`❌ Countries NOT in DB: ${missingCountries.join(', ')}`);
else console.log('✅ All countries exist in DB');

const missingCats = DATA_categories.filter(c => !actualCategories.includes(c));
if (missingCats.length) console.log(`❌ Categories NOT in DB: ${missingCats.join(', ')}`);
else console.log('✅ All categories exist in DB');

const missingDepts = DATA_departments.filter(d => !actualDepartments.includes(d));
if (missingDepts.length) console.log(`❌ Departments NOT in DB: ${missingDepts.join(', ')}`);
else console.log('✅ All departments exist in DB');

const missingStatuses = DATA_statuses.filter(s => !actualStatuses.includes(s));
if (missingStatuses.length) console.log(`❌ Statuses NOT in DB: ${missingStatuses.join(', ')}`);
else console.log('✅ All statuses exist in DB');

const missingNames = DATA_names.filter(n => !actualNames.includes(n));
if (missingNames.length) console.log(`❌ Names NOT in DB: ${missingNames.join(', ')}`);
else console.log('✅ All names exist in DB');

// Also check the reverse: values in DB not in DATA
const extraCountries = actualCountries.filter(c => !DATA_countries.includes(c));
if (extraCountries.length) console.log(`ℹ️  Countries in DB but not in DATA: ${extraCountries.join(', ')}`);

const extraCats = actualCategories.filter(c => !DATA_categories.includes(c));
if (extraCats.length) console.log(`ℹ️  Categories in DB but not in DATA: ${extraCats.join(', ')}`);

const extraDepts = actualDepartments.filter(d => !DATA_departments.includes(d));
if (extraDepts.length) console.log(`ℹ️  Departments in DB but not in DATA: ${extraDepts.join(', ')}`);

const extraStatuses = actualStatuses.filter(s => !DATA_statuses.includes(s));
if (extraStatuses.length) console.log(`ℹ️  Statuses in DB but not in DATA: ${extraStatuses.join(', ')}`);

// ================================
// STEP 4: Test exercises with ALL replacement values
// ================================
console.log('\n' + '='.repeat(70));
console.log('📊 EXHAUSTIVE EXERCISE TESTING');
console.log('='.repeat(70));

// Parse exercises with replacements
const topicMap = { 'TopicId.Basics': 'Basics', 'TopicId.Filtering': 'Filtering', 'TopicId.Sorting': 'Sorting', 'TopicId.Aggregation': 'Aggregation', 'TopicId.Functions': 'Functions', 'TopicId.Dates': 'Dates', 'TopicId.Case': 'Case', 'TopicId.Joins': 'Joins', 'TopicId.Advanced': 'Advanced' };
const diffMap = { 'Difficulty.Easy': 'Easy', 'Difficulty.Medium': 'Medium', 'Difficulty.Hard': 'Hard' };
const lines = genContent.split('\n');

let currentTopic = null, currentDifficulty = null;
const exercises = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  for (const [k,v] of Object.entries(topicMap)) { if (line.includes(`[${k}]:`)) currentTopic = v; }
  for (const [k,v] of Object.entries(diffMap)) { if (line.includes(`[${k}]:`)) currentDifficulty = v; }
  
  const queryMatch = line.match(/queryTemplate:\s*"((?:[^"\\]|\\.)*)"/);
  if (queryMatch && currentTopic && currentDifficulty) {
    const query = queryMatch[1].replace(/\\"/g, '"').replace(/\\'/g, "'");
    let title = '';
    for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
      const tm = lines[j].match(/titleTemplate:\s*"([^"]*)"/);
      if (tm) { title = tm[1]; break; }
    }
    
    // Check if query has template variables
    const vars = query.match(/\{([a-z_]+)\}/g);
    if (vars) {
      exercises.push({ topic: currentTopic, difficulty: currentDifficulty, title, query, vars: [...new Set(vars)], line: i + 1 });
    }
  }
}

console.log(`\n📊 Found ${exercises.length} exercises with template variables\n`);

// Map of variable name to all possible values
const varValues = {
  '{cat}': DATA_categories,
  '{category}': DATA_categories,
  '{country}': DATA_countries,
  '{status}': DATA_statuses,
  '{order_status}': DATA_statuses,
  '{dept}': DATA_departments,
  '{dep}': DATA_departments,
  '{department}': DATA_departments,
  '{name}': DATA_names,
  '{year}': ['2022', '2023', '2024'],
  '{month}': ['1', '3', '6', '9', '12'],
  '{price_min}': ['10', '50', '100'],
  '{price_max}': ['200', '500', '1000'],
  '{stock}': ['5', '10', '20', '50'],
  '{n}': ['3', '5', '10'],
  '{limit}': ['3', '5', '10'],
  '{pct}': ['1.1', '1.22', '0.9'],
  '{perc}': ['1.1', '1.22'],
  '{percentage}': ['1.22'],
  '{threshold}': ['50', '100', '200'],
  '{min}': ['50', '100'],
  '{max}': ['500', '1000'],
  '{email}': ['alice@corp.com'],
  '{product}': ['Monitor 4K'],
  '{table}': ['Users'],
  '{col}': ['name'],
  '{domain}': ['gmail.com'],
  '{letter}': ['A', 'M'],
  '{prefix}': ['Mar', 'Al'],
  '{suffix}': ['com', 'it'],
  '{salary_min}': ['40000', '50000'],
  '{salary_max}': ['80000', '100000'],
  '{salary}': ['50000', '70000'],
  '{val}': ['100'],
  '{value}': ['100'],
  '{len}': ['5', '10'],
  '{qty}': ['2', '3'],
  '{quantity}': ['2'],
  '{date}': ['2023-01-01'],
  '{start_date}': ['2023-01-01'],
  '{end_date}': ['2024-01-01'],
  '{day}': ['15'],
  '{manager_id}': ['1', '3'],
};

let emptyCount = 0;
let errorCount = 0;
const problems = [];

exercises.forEach(ex => {
  // Generate all combinations of variable values
  const varsList = ex.vars;
  
  // For simplicity, test each variable independently with all its values
  // (full cartesian product would be too many)
  varsList.forEach(varName => {
    const values = varValues[varName];
    if (!values) {
      problems.push({ type: 'UNKNOWN_VAR', exercise: `[${ex.topic}/${ex.difficulty}] "${ex.title}" (L${ex.line})`, detail: `Unknown variable: ${varName}` });
      return;
    }
    
    values.forEach(val => {
      // Replace all vars with default values, then this specific var with test value
      let testQuery = ex.query;
      for (const [v, vals] of Object.entries(varValues)) {
        if (v === varName) {
          testQuery = testQuery.replace(new RegExp(v.replace(/[{}]/g, '\\$&'), 'g'), val);
        } else if (vals && vals.length > 0) {
          testQuery = testQuery.replace(new RegExp(v.replace(/[{}]/g, '\\$&'), 'g'), vals[0]);
        }
      }
      
      // Skip if still has unresolved vars
      if (/\{[a-z_]+\}/.test(testQuery)) return;
      
      try {
        const result = alasql(testQuery);
        if (testQuery.toUpperCase().trim().startsWith('SELECT') && Array.isArray(result) && result.length === 0) {
          emptyCount++;
          problems.push({
            type: 'EMPTY_RESULT',
            exercise: `[${ex.topic}/${ex.difficulty}] "${ex.title}" (L${ex.line})`,
            detail: `${varName}=${val} → 0 rows`,
            query: testQuery.substring(0, 100)
          });
        }
      } catch (e) {
        errorCount++;
        problems.push({
          type: 'SQL_ERROR',
          exercise: `[${ex.topic}/${ex.difficulty}] "${ex.title}" (L${ex.line})`,
          detail: `${varName}=${val} → ${e.message}`,
          query: testQuery.substring(0, 100)
        });
      }
    });
  });
});

// Report
if (problems.length > 0) {
  const grouped = {};
  problems.forEach(p => { grouped[p.type] = (grouped[p.type] || 0) + 1; });
  
  console.log('📈 Problem Summary:');
  Object.entries(grouped).forEach(([t, c]) => console.log(`  ${c} × ${t}`));
  
  console.log(`\n❌ PROBLEMS (${problems.length}):`);
  console.log('-'.repeat(60));
  problems.forEach((p, i) => {
    console.log(`  ${i+1}. [${p.type}] ${p.exercise}`);
    console.log(`     ${p.detail}`);
    if (p.query) console.log(`     Query: ${p.query}`);
  });
} else {
  console.log('\n✅ All exercises produce results with all replacement values!');
}

console.log(`\n${'='.repeat(70)}`);
console.log(`📊 SUMMARY: ${problems.length} problems (${errorCount} errors, ${emptyCount} empty results)`);

fs.writeFileSync(path.join(__dirname, '..', 'template_report.json'), JSON.stringify({ problems, missingCountries, missingCats, missingDepts, missingStatuses, missingNames }, null, 2));
console.log('💾 Saved to template_report.json');
