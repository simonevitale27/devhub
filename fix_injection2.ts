import fs from 'fs';

let content = fs.readFileSync('services/sqlService.ts', 'utf-8');

// The tricky part: some values in the edge cases are literal nulls (like email: null, country: null).
// We need to handle nulls in the alasql insert templates so it inserts proper NULL instead of string 'null'.

content = content.replace(/usersData\.forEach\(r \=\> ([^\n]+)\);\n([\s\S]*?)(?=\s*console\.log\(`✅ Users inserted)/g, (match, insertBody, injected) => {
    return injected + `\n        usersData.forEach(r => {
            const emailVal = r.email ? \`'\${r.email.replace(/'/g, "''")}'\` : 'NULL';
            const countryVal = r.country ? \`'\${r.country.replace(/'/g, "''")}'\` : 'NULL';
            alasql(\`INSERT INTO Users VALUES (\${r.id}, '\${r.name.replace(/'/g, "''")}', \${emailVal}, \${countryVal}, \${r.is_premium}, '\${r.created_at}')\`);
        });\n`;
});

content = content.replace(/productsData\.forEach\(r \=\> ([^\n]+)\);\n([\s\S]*?)(?=\s*console\.log\(`✅ Products inserted)/g, (match, insertBody, injected) => {
    return injected + "\n        productsData.forEach(r => alasql(`INSERT INTO Products VALUES (${r.id}, '${r.name.replace(/'/g, \"''\")}', '${r.category.replace(/'/g, \"''\")}', ${r.price}, ${r.stock})`));\n";
});

content = content.replace(/ordersData\.forEach\(r \=\> ([^\n]+)\);\n([\s\S]*?)(?=\s*console\.log\(`✅ Orders inserted)/g, (match, insertBody, injected) => {
    return injected + "\n        ordersData.forEach(r => alasql(`INSERT INTO Orders VALUES (${r.id}, ${r.user_id}, '${r.order_date}', '${r.status.replace(/'/g, \"''\")}', ${r.order_total})`));\n";
});

content = content.replace(/orderItemsData\.forEach\(r \=\> ([^\n]+)\);\n([\s\S]*?)(?=\s*console\.log\(`✅ OrderItems inserted)/g, (match, insertBody, injected) => {
    return injected + "\n        orderItemsData.forEach(r => alasql(`INSERT INTO OrderItems VALUES (${r.id}, ${r.order_id}, ${r.product_id}, ${r.quantity}, ${r.unit_price})`));\n";
});

content = content.replace(/employeesData\.forEach\(r \=\> \{[\s\S]*?\}\);\n([\s\S]*?)(?=\s*console\.log\(`✅ Employees inserted)/g, (match, injected) => {
    return injected + `\n        employeesData.forEach(r => {
             const email = r.email || \`\${r.name.split(' ')[0].toLowerCase()}.\${r.name.split(' ')[1] ? r.name.split(' ')[1].toLowerCase() : ''}@techstore.com\`;
             const managerVal = r.manager_id === null ? 'NULL' : r.manager_id;
             alasql(\`INSERT INTO Employees VALUES (\${r.id}, '\${r.name.replace(/'/g, "''")}', '\${email.replace(/'/g, "''")}', '\${r.department.replace(/'/g, "''")}', '\${r.hire_date}', \${managerVal}, \${r.salary})\`);
        });\n`;
});

fs.writeFileSync('services/sqlService.ts', content);
console.log("SQL Service injection order fixed.");
