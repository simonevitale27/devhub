import fs from 'fs';

let content = fs.readFileSync('services/sqlService.ts', 'utf-8');

// 1. Polyfills
const polyfills = `
alasql.options.mysql = true;

alasql.fn.MOD = (n: number, m: number) => n % m;
alasql.fn.REVERSE = (s: string) => s.split('').reverse().join('');
alasql.fn.RAND = () => Math.random();
alasql.fn.PI = () => Math.PI;
alasql.fn.LOG = (x: number) => Math.log(x);
alasql.fn.EXP = (x: number) => Math.exp(x);
alasql.fn.RADIANS = (x: number) => x * Math.PI / 180;
alasql.fn.DEGREES = (x: number) => x * 180 / Math.PI;
alasql.fn.BIT_LENGTH = (s: string) => Buffer.from(s).length * 8;
alasql.fn.LPAD = (s: string, len: number, pad: string) => s.padStart(len, pad);
alasql.fn.RPAD = (s: string, len: number, pad: string) => s.padEnd(len, pad);
alasql.fn.ASCII = (s: string) => s.charCodeAt(0);
alasql.fn.DAYOFYEAR = (d: string) => d ? Math.floor((new Date(d).getTime() - new Date(new Date(d).getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24) : null;
alasql.fn.WEEK = (d: string) => d ? Math.ceil((alasql.fn.DAYOFYEAR(d) + new Date(new Date(d).getFullYear(), 0, 1).getDay()) / 7) : null;
alasql.fn.QUARTER = (d: string) => d ? Math.ceil((new Date(d).getMonth() + 1) / 3) : null;
alasql.fn.SYSDATE = () => new Date().toISOString().replace('T', ' ').substring(0, 19);
alasql.fn.YEAR = (d: string) => d ? new Date(d).getFullYear() : null;
alasql.fn.SIGN = (x: number) => Math.sign(x);
alasql.fn.LENGTH = (s: string) => s ? s.length : null;
alasql.fn.TO_DAYS = (d: string) => d ? Math.floor(new Date(d).getTime() / 86400000) : null;
`;
if (!content.includes('alasql.fn.MOD')) {
    content = content.replace("alasql.fn.MONTHNAME = ", polyfills + "\nalasql.fn.MONTHNAME = ");
}

// Helper to replace everything between a start string and end string
function replaceBlock(source: string, startMarker: string, endMarker: string, replacement: string) {
    const startIdx = source.indexOf(startMarker);
    if (startIdx === -1) return source;
    const endIdx = source.indexOf(endMarker, startIdx);
    if (endIdx === -1) return source;
    return source.substring(0, startIdx) + replacement + source.substring(endIdx + endMarker.length);
}

// 2. Users Edge Cases & Insertion Fix
const userEdgeCases = `
        usersData.push({ id: 102, name: 'Alice', email: 'alice@corp.com', country: 'USA', is_premium: false, created_at: '2023-01-01' });
        usersData.push({ id: 103, name: 'Mario Rossi', email: 'mario@example.com', country: 'Italy', is_premium: true, created_at: '2023-12-31' });
        usersData.push({ id: 104, name: 'No Country', email: null, country: null, is_premium: false, created_at: '2022-01-01' });
        usersData.push({ id: 105, name: 'Alice', email: 'alice.all@categories.com', country: 'UK', is_premium: true, created_at: '2023-05-01' });
        usersData.push({ id: 106, name: 'Mario Rossi', email: 'mario_fake@corp.com', country: 'Spain', is_premium: false, created_at: '2023-06-01' });
        usersData.push({ id: 107, name: 'Underpaid Manager', email: 'underpaid@techstore.com', country: 'Italy', is_premium: false, created_at: '2024-01-01' });

        usersData.forEach(r => {
            const emailVal = r.email ? \`'\${r.email.replace(/'/g, "''")}'\` : 'NULL';
            const countryVal = r.country ? \`'\${r.country.replace(/'/g, "''")}'\` : 'NULL';
            alasql(\`INSERT INTO Users VALUES (\${r.id}, '\${r.name.replace(/'/g, "''")}', \${emailVal}, \${countryVal}, \${r.is_premium}, '\${r.created_at}')\`);
        });
`;
content = replaceBlock(content, "usersData.forEach(r => alasql(`INSERT INTO Users", "`));", userEdgeCases);


// 3. Products
const prodEdgeCases = `
        productsData.push({ id: 9080, name: 'Laptop', category: 'Tech', price: 50, stock: 0 });
        productsData.push({ id: 9081, name: 'Smartphone', category: 'Category2', price: 100, stock: 10 });
        productsData.push({ id: 9082, name: 'Cover', category: 'Category3', price: 10, stock: 50 });
        productsData.push({ id: 9300, name: 'OnlyElectronics', category: 'Electronics', price: 50, stock: 5 });
        productsData.push({ id: 9301, name: 'EmptyCatProduct', category: 'EmptyCategory', price: 100, stock: 0 });
        
        const myCats = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
        myCats.forEach((cat, index) => {
            productsData.push({ id: 9200 + index, name: \`AliceProd_\${cat}\`, category: cat, price: 10, stock: 10 });
        });

        productsData.forEach(r => alasql(\`INSERT INTO Products VALUES (\${r.id}, '\${r.name.replace(/'/g, "''")}', '\${r.category.replace(/'/g, "''")}', \${r.price}, \${r.stock})\`));
`;
content = replaceBlock(content, "productsData.forEach(r => alasql(`INSERT INTO Products", "`));", prodEdgeCases);

// 4. Orders
const orderEdgeCases = `
        ordersData.push({ id: 9062, user_id: 102, order_date: '2023-01-01', status: 'Delivered', order_total: 10 });
        ordersData.push({ id: 9063, user_id: 103, order_date: '2023-06-15', status: 'Shipped', order_total: 100 });
        ordersData.push({ id: 9001, user_id: 9999, order_date: '2023-01-01', status: 'Pending', order_total: 0});
        ordersData.push({ id: 9301, user_id: 1, order_date: '2023-01-01', status: 'Pending', order_total: 15 });
        ordersData.push({ id: 9302, user_id: 1, order_date: '2023-01-01', status: 'Pending', order_total: 20 });
        ordersData.push({ id: 9303, user_id: 100, order_date: '2023-02-01', status: 'Delivered', order_total: 50 });
        const nowStr = new Date().toISOString().split('T')[0];
        ordersData.push({ id: 9304, user_id: 100, order_date: nowStr, status: 'Pending', order_total: 100 });
        
        const myCatsForOrders = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
        myCatsForOrders.forEach((cat, index) => {
            ordersData.push({ id: 9200 + index, user_id: 105, order_date: '2023-05-01', status: 'Delivered', order_total: 10 });
        });

        ordersData.forEach(r => alasql(\`INSERT INTO Orders VALUES (\${r.id}, \${r.user_id}, '\${r.order_date}', '\${r.status.replace(/'/g, "''")}', \${r.order_total})\`));
`;
content = replaceBlock(content, "ordersData.forEach(r => alasql(`INSERT INTO Orders", "`));", orderEdgeCases);

// 5. OrderItems
const orderItemsEdgeCases = `
        orderItemsData.push({ id: 9151, order_id: 9062, product_id: 9080, quantity: 1, unit_price: 50 });
        orderItemsData.push({ id: 9152, order_id: 9063, product_id: 9081, quantity: 2, unit_price: 100 });
        orderItemsData.push({ id: 9153, order_id: 9063, product_id: 9082, quantity: 1, unit_price: 10 });
        orderItemsData.push({ id: 9303, order_id: 9303, product_id: 9300, quantity: 1, unit_price: 50 });
        
        const myCatsForItems = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
        myCatsForItems.forEach((cat, index) => {
            orderItemsData.push({ id: 9200 + index, order_id: 9200 + index, product_id: 9200 + index, quantity: 1, unit_price: 10 });
        });

        orderItemsData.forEach(r => alasql(\`INSERT INTO OrderItems VALUES (\${r.id}, \${r.order_id}, \${r.product_id}, \${r.quantity}, \${r.unit_price})\`));
`;
content = replaceBlock(content, "orderItemsData.forEach(r => alasql(`INSERT INTO OrderItems", "`));", orderItemsEdgeCases);


// 6. Employees
const employeesEdgeCases = `
        employeesData.push({ id: 501, name: 'Underpaid Manager', department: 'Sales', hire_date: '2022-01-01', manager_id: null, salary: 1000 });
        employeesData.push({ id: 502, name: 'Rich Employee', department: 'Sales', hire_date: '2022-01-01', manager_id: 501, salary: 5000 });
        
        employeesData.forEach(r => {
             const email = r.email || \`\${r.name.split(' ')[0].toLowerCase()}.\${r.name.split(' ')[1] ? r.name.split(' ')[1].toLowerCase() : ''}@techstore.com\`;
             const managerVal = r.manager_id === null ? 'NULL' : r.manager_id;
             alasql(\`INSERT INTO Employees VALUES (\${r.id}, '\${r.name.replace(/'/g, "''")}', '\${email.replace(/'/g, "''")}', '\${r.department.replace(/'/g, "''")}', '\${r.hire_date}', \${managerVal}, \${r.salary})\`);
        });
`;
content = replaceBlock(content, "employeesData.forEach(r => {", "});", employeesEdgeCases);

if (!content.includes('Underpaid Manager') || !content.includes('alasql.fn.SIGN')) {
    console.log("FAILED REPLACEMENTS");
} else {
    fs.writeFileSync('services/sqlService.ts', content);
    console.log("sqlService.ts successfully patched via safe string splits");
}
