import alasql from 'alasql';

// Mock data generators
const firstNames = ['Marco', 'Giulia', 'Luca'];
const lastNames = ['Rossi', 'Bianchi', 'Ferrari'];
const categories = ['Electronics', 'Computers'];
const statuses = ['Pending', 'Shipped'];
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const initDatabase = () => {
    console.log('🚀 initDatabase STARTING (Test Mode)...');

    try {
        // DROP
        const tablesToDrop = ['OrderItems', 'Orders', 'Products', 'Users', 'Employees'];
        tablesToDrop.forEach(t => {
            try { alasql(`DROP TABLE IF EXISTS ${t}`); } catch(e) { /* ignore */ }
        });

        // CREATE
        alasql('CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, country VARCHAR, is_premium BOOLEAN, created_at DATE)');
        alasql('CREATE TABLE Products (id INT PRIMARY KEY, name VARCHAR, category VARCHAR, price DECIMAL, stock INT)');
        alasql('CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR, order_total DECIMAL)');
        alasql('CREATE TABLE OrderItems (id INT PRIMARY KEY, order_id INT, product_id INT, quantity INT, unit_price DECIMAL)');
        alasql('CREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR, department VARCHAR, hire_date DATE, manager_id INT)');
        
        console.log('✅ Tables created');

        // INSERT USERS
        const usersData = [];
        for (let i = 1; i <= 5; i++) {
            usersData.push({
                id: i,
                name: 'User ' + i,
                email: 'test@example.com',
                country: 'Italy',
                is_premium: false,
                created_at: '2023-01-01'
            });
        }
        usersData.forEach(r => alasql(`INSERT INTO Users VALUES (${r.id}, '${r.name}', '${r.email}', '${r.country}', ${r.is_premium}, '${r.created_at}')`));
        console.log(`✅ Users inserted`);

        // INSERT PRODUCTS
        const productsData = [];
        for (let i = 1; i <= 5; i++) {
            productsData.push({
                id: i,
                name: 'Product ' + i,
                category: getRandom(categories),
                price: Number((getRandomInt(20, 2000) - 0.01).toFixed(2)),
                stock: getRandomInt(0, 150)
            });
        }
        productsData.forEach(r => alasql(`INSERT INTO Products VALUES (${r.id}, '${r.name}', '${r.category}', ${r.price}, ${r.stock})`));
        console.log(`✅ Products inserted`);

        // INSERT ORDERS
        const ordersData = [];
        for (let i = 1; i <= 5; i++) {
            ordersData.push({
                id: i,
                user_id: getRandomInt(1, 5),
                order_date: '2023-01-01',
                status: getRandom(statuses),
                order_total: Number((getRandomInt(50, 3000) + 0.99).toFixed(2))
            });
        }
        ordersData.forEach(r => alasql(`INSERT INTO Orders VALUES (${r.id}, ${r.user_id}, '${r.order_date}', '${r.status}', ${r.order_total})`));
        console.log(`✅ Orders inserted`);

        // INSERT ORDER ITEMS
        // Skipping detailed loop for brevity as logic is simple loops

        // INSERT EMPLOYEES
        const employeesData = [
            {id: 1, name: 'Alessandro Romano', department: 'Executive', hire_date: '2015-03-01', manager_id: null},
            {id: 2, name: 'Giulia Bianchi', department: 'Sales', hire_date: '2016-05-15', manager_id: 1},
        ];

        employeesData.forEach(r => {
            alasql(`INSERT INTO Employees VALUES (${r.id}, '${r.name}', '${r.department}', '${r.hire_date}', ${r.manager_id})`);
        });
        console.log(`✅ Employees inserted`);

    } catch (e) {
        console.error('❌ initDatabase FAILED:', e);
    }
};

initDatabase();

// Check tables
const tables = ['Users', 'Products', 'Orders', 'Employees'];
tables.forEach(t => {
    try {
        const res = alasql(`SELECT count(*) as cnt FROM ${t}`);
        console.log(`${t} count:`, res[0].cnt);
    } catch(e) {
        console.log(`${t} check failed:`, e.message);
    }
});
