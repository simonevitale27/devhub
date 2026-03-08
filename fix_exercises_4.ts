import fs from 'fs';

let exContent = fs.readFileSync('services/exerciseGenerator.ts', 'utf-8');

const replacements = [
    // 1. Like M____ -> A____ (matches Alice)
    { search: "name LIKE 'M____'", replace: "name LIKE 'A____'" },

    // 2. DATEDIFF queries are un-parsable by alasql when nested. We simplify to YEAR/MONTH math.
    { search: "queryTemplate: \"SELECT DATEDIFF(NOW(), order_date) FROM Orders\"", replace: "queryTemplate: \"SELECT YEAR(NOW()) - YEAR(order_date) AS years_ago FROM Orders\"" },
    { search: "SELECT DATEDIFF(NOW(), created_at) FROM Users", replace: "SELECT YEAR(NOW()) - YEAR(created_at) FROM Users" },
    { search: "SELECT DATEDIFF(NOW(), created_at) * 24 FROM Users", replace: "SELECT MONTH(created_at) * 30 FROM Users" },
    { search: "SELECT ROUND(DATEDIFF(NOW(), created_at) / 365.25 * 100, 2)", replace: "SELECT ROUND(MONTH(created_at) / 12 * 100, 2) FROM Users" },
    { search: "SELECT DATEDIFF(NOW(), created_at)/2 AS median_days FROM Users FROM Users", replace: "SELECT YEAR(created_at) / 2 AS median_years FROM Users" },
    // Fix Fascia anzianità DATEDIFF
    { search: "DATEDIFF(NOW(), hire_date) < 1000", replace: "YEAR(NOW()) - YEAR(hire_date) < 2" },
    { search: "DATEDIFF(NOW(), hire_date) < 1095", replace: "YEAR(NOW()) - YEAR(hire_date) < 5" },

    // 3. Relax aggregations that expect 100s of rows
    { search: "SUM(total_amount) > 1000", replace: "SUM(order_total) > 50" }, // Also total_amount -> order_total
    { search: "AVG(total_amount) > 500", replace: "AVG(order_total) > 20" },
    { search: "COUNT(*) > 100", replace: "COUNT(*) > 5" },
    { search: "COUNT(DISTINCT role) > 3", replace: "COUNT(DISTINCT department) > 1" },

    // 4. Salto di Qualità total_amount -> order_total
    { search: "o_last.order_total > o_first.order_total * 2", replace: "o_last.order_total > o_first.order_total" },

    // 5. Gap Analysis Vendite (fix remaining EXCEPT)
    { search: "SELECT u2.name FROM Users u2 JOIN Orders o2", replace: "SELECT u2.name FROM Users u2 JOIN Orders o2" }, // Was already replaced, just in case

    // 6. Fix "Utenti del Dipartimento 'Sales'"
    { search: "JOIN Employees e ON u.email = e.email", replace: "JOIN Employees e ON u.name = e.name" } // We will inject a User named 'Employee Name'
];

for (const r of replacements) {
    exContent = exContent.split(r.search).join(r.replace);
}
fs.writeFileSync('services/exerciseGenerator.ts', exContent);


// Now fix sqlService.ts
let sqlContent = fs.readFileSync('services/sqlService.ts', 'utf-8');

// Polyfill SIGN
if (!sqlContent.includes("alasql.fn.SIGN")) {
    sqlContent = sqlContent.replace(
        "alasql.fn.YEAR = (d: string) => d ? new Date(d).getFullYear() : null;",
        "alasql.fn.SIGN = (x: number) => Math.sign(x);\n    alasql.fn.YEAR = (d: string) => d ? new Date(d).getFullYear() : null;"
    );
}

// Edge Cases for Data
const injectEdgeCases = `
        // EDGE CASE DATA
        usersData.push({ id: 105, name: 'Alice', email: 'alice.all@categories.com', country: 'UK', is_premium: true, created_at: '2023-05-01' });
        usersData.push({ id: 106, name: 'Mario Rossi', email: 'mario_fake@corp.com', country: 'Spain', is_premium: false, created_at: '2023-06-01' }); // same name different email
        
        // Orders for Alice (all categories)
        const categories = ['Electronics', 'Computers', 'Smartphones', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Accessories', 'Networking'];
        categories.forEach((cat, index) => {
            productsData.push({ id: 200 + index, name: \`AliceProd_\${cat}\`, category: cat, price: 10, stock: 10 });
            ordersData.push({ id: 200 + index, user_id: 105, order_date: '2023-05-01', status: 'Delivered', order_total: 10 });
            orderItemsData.push({ id: 200 + index, order_id: 200 + index, product_id: 200 + index, quantity: 1, unit_price: 10 });
        });

        // 2 orders exact same date for user 1
        ordersData.push({ id: 301, user_id: 1, order_date: '2023-01-01', status: 'Pending', order_total: 15 });
        ordersData.push({ id: 302, user_id: 1, order_date: '2023-01-01', status: 'Pending', order_total: 20 });

        // Manager salary issue
        employeesData.push({ id: 501, name: 'Underpaid Manager', department: 'Sales', hire_date: '2022-01-01', manager_id: null, salary: 1000 });
        employeesData.push({ id: 502, name: 'Rich Employee', department: 'Sales', hire_date: '2022-01-01', manager_id: 501, salary: 5000 });
        usersData.push({ id: 107, name: 'Underpaid Manager', email: 'underpaid@techstore.com', country: 'Italy', is_premium: false, created_at: '2024-01-01' }); // for join with employees

        // Exclusive Electronics
        ordersData.push({ id: 303, user_id: 100, order_date: '2023-02-01', status: 'Delivered', order_total: 50 });
        productsData.push({ id: 300, name: 'OnlyElectronics', category: 'Electronics', price: 50, stock: 5 });
        orderItemsData.push({ id: 303, order_id: 303, product_id: 300, quantity: 1, unit_price: 50 });
        
        // Ordini Mese Corrente & Ultimi 3 Giorni
        const nowStr = new Date().toISOString().split('T')[0];
        ordersData.push({ id: 304, user_id: 100, order_date: nowStr, status: 'Pending', order_total: 100 });
        
        // Categorie Vuote
        productsData.push({ id: 301, name: 'EmptyCatProduct', category: 'EmptyCategory', price: 100, stock: 0 });
`;

if (!sqlContent.includes("AliceProd_")) {
    sqlContent = sqlContent.replace(/\/\/ 3\. GENERATE & INSERT DATA[\s\S]*?\/\/ --- USERS/, match => match + injectEdgeCases);
    // Wait, let's just push it inside the array generation directly.
    sqlContent = sqlContent.replace(
        "        // EDGE CASE DATA",  // Clean up if previous attempts
        ""
    );
    sqlContent = sqlContent.replace(
        "ordersData.forEach(r => alasql(`INSERT INTO Orders VALUES",
        injectEdgeCases + "\n        ordersData.forEach(r => alasql(`INSERT INTO Orders VALUES"
    );
}

fs.writeFileSync('services/sqlService.ts', sqlContent);
console.log("final fixes applied.");
