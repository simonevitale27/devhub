import fs from 'fs';

let content = fs.readFileSync('services/sqlService.ts', 'utf-8');

const polyfillBlock = `
// ==========================================
// ADDITIONAL ALASQL POLYFILLS
// ==========================================
alasql.fn.MOD = (a, b) => a % b;
alasql.fn.REVERSE = (s) => String(s).split('').reverse().join('');
alasql.fn.REPEAT = (s, n) => String(s).repeat(n);
alasql.fn.RAND = () => Math.random();
alasql.fn.PI = () => Math.PI;
alasql.fn.LOG = (n) => Math.log(n);
alasql.fn.EXP = (n) => Math.exp(n);
alasql.fn.RADIANS = (d) => d * Math.PI / 180;
alasql.fn.DEGREES = (r) => r * 180 / Math.PI;
alasql.fn.BIT_LENGTH = (s) => String(s).length * 8;
alasql.fn.LPAD = (s, n, p) => String(s).padStart(n, p || ' ');
alasql.fn.RPAD = (s, n, p) => String(s).padEnd(n, p || ' ');
alasql.fn.ASCII = (s) => String(s).charCodeAt(0);
alasql.fn.DAYOFYEAR = (d) => {
    const date = new Date(d);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / 86400000);
};
alasql.fn.WEEK = (d) => alasql.fn.DAYOFYEAR(d) ? Math.ceil(alasql.fn.DAYOFYEAR(d) / 7) : 0;
alasql.fn.QUARTER = (d) => {
    const temp = new Date(d);
    if(isNaN(temp.getTime())) return 1;
    return Math.floor(temp.getMonth() / 3) + 1;
};
alasql.fn.SYSDATE = () => alasql.fn.NOW();
alasql.options.mysql = true;
`;

if (!content.includes('ADDITIONAL ALASQL POLYFILLS')) {
    content = content.replace('alasql.options.mysql = true;', polyfillBlock);
}

// Ensure Alice, Mario, IT department, etc exist
const edgeCasesUser = `
        usersData.push({
            id: 102,
            name: 'Alice',
            email: 'alice@corp.com',
            country: 'USA',
            is_premium: false,
            created_at: '2023-01-01'
        });
        usersData.push({
            id: 103,
            name: 'Mario Rossi',
            email: 'mario@example.com',
            country: 'Italy',
            is_premium: true,
            created_at: '2023-12-31'
        });
        usersData.push({
            id: 104,
            name: 'No Country',
            email: null,
            country: null,
            is_premium: false,
            created_at: '2023-01-01'
        });
`;

if (!content.includes("name: 'Alice'")) {
    content = content.replace("console.log(`✅ Users inserted", edgeCasesUser + "\n        console.log(`✅ Users inserted");
}

const edgeCasesProducts = `
        productsData.push({ id: 80, name: 'Laptop', category: 'Tech', price: 50, stock: 0 });
        productsData.push({ id: 81, name: 'Toys Special', category: 'Toys', price: 5, stock: 150 });
        productsData.push({ id: 82, name: 'Smartphone', category: 'Electronics', price: 10, stock: 5 });
        productsData.push({ id: 83, name: 'Cover', category: 'Accessories', price: 5, stock: 100 });
`;

if (!content.includes("name: 'Laptop'")) {
    content = content.replace("console.log(`✅ Products inserted", edgeCasesProducts + "\n        console.log(`✅ Products inserted");
}

const edgeCasesOrders = `
        ordersData.push({ id: 70, user_id: 102, order_date: '2023-01-01', status: 'Pending', order_total: 600 });
        ordersData.push({ id: 71, user_id: 103, order_date: '2023-12-31', status: 'Shipped', order_total: 10 });
        ordersData.push({ id: 72, user_id: 102, order_date: '2021-01-01', status: 'Shipped', order_total: 10 });
`;

if (!content.includes("order_date: '2023-01-01'")) {
    content = content.replace("console.log(`✅ Orders inserted", edgeCasesOrders + "\n        console.log(`✅ Orders inserted");
}

const edgeCasesOrderItems = `
        orderItemsData.push({ id: 200, order_id: 70, product_id: 80, quantity: 20, unit_price: 50 }); // > 10 and Laptop
        orderItemsData.push({ id: 201, order_id: 70, product_id: 82, quantity: 5, unit_price: 10 }); // Smartphone
        orderItemsData.push({ id: 202, order_id: 70, product_id: 83, quantity: 5, unit_price: 5 }); // Cover
        orderItemsData.push({ id: 203, order_id: 71, product_id: 81, quantity: 1, unit_price: 5 }); 
`;

if (!content.includes("quantity: 20")) {
    content = content.replace("console.log(`✅ OrderItems inserted", edgeCasesOrderItems + "\n        console.log(`✅ OrderItems inserted");
}

const edgeCasesEmployees = `
        employeesData.push({ id: 20, name: 'Alice IT', department: 'IT', hire_date: '2020-01-01', manager_id: null, salary: 50000 });
        employeesData.push({ id: 21, name: 'Bob HR', department: 'HR', hire_date: '2021-05-01', manager_id: 20, salary: 40000 });
`;

if (!content.includes("department: 'IT'")) {
    content = content.replace("console.log(`✅ Employees inserted", edgeCasesEmployees + "\n        console.log(`✅ Employees inserted");
}

fs.writeFileSync('services/sqlService.ts', content);
console.log("Polyfills and Edge Cases added.");
