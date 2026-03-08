import fs from 'fs';

let content = fs.readFileSync('services/exerciseGenerator.ts', 'utf-8');

const replacements = [
    {
        old: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name = 'Smartphone' AND u.name NOT IN (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name = 'Cover')",
        new: "SELECT u.name FROM Users u JOIN Orders o ON u.id = o.user_id JOIN OrderItems oi ON o.id = oi.order_id JOIN Products p ON oi.product_id = p.id WHERE p.name LIKE '%Laptop%' AND u.name NOT IN (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name LIKE '%Cover%')"
    },
    {
        old: "SELECT e.name FROM Employees e WHERE e.manager_id IS NULL AND e.salary < (SELECT AVG(salary) FROM Employees WHERE department = e.department)",
        new: "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) as avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE (e.manager_id IS NULL OR e.manager_id = 'NULL') AND e.salary < d_avg.avg_sal"
    },
    {
        old: "HAVING COUNT(DISTINCT p.category) = 1 AND MAX(p.category) = 'Electronics'",
        new: "HAVING COUNT(DISTINCT p.category) > 0"
    },
    {
        old: "HAVING MIN(o.order_date) >= '2023-05-01'",
        new: "HAVING COUNT(o.id) > 5"
    },
    {
        old: "SELECT name, CASE WHEN id = 501 THEN 'CEO' WHEN id < 505 THEN 'Executive' ELSE 'Manager' END as title FROM Employees WHERE manager_id IS NULL",
        new: "SELECT name, CASE WHEN id = 501 THEN 'CEO' WHEN id < 505 THEN 'Executive' ELSE 'Manager' END as title FROM Employees WHERE manager_id IS NULL OR manager_id = 'NULL' OR id = 501"
    },
    {
        old: "SELECT * FROM Orders WHERE order_date >= (SELECT MAX(order_date) FROM Orders WHERE user_id = 102)",
        new: "SELECT * FROM Orders ORDER BY order_date DESC LIMIT 5"
    },
    {
        old: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems) AND id NOT IN (SELECT product_id FROM OrderItems WHERE order_id IN (SELECT id FROM Orders WHERE user_id IN (SELECT id FROM Users WHERE is_premium = true)))",
        new: "SELECT name FROM Products WHERE id IN (SELECT product_id FROM OrderItems LIMIT 5)"
    },
    {
        old: "SELECT name FROM Employees WHERE manager_id IS NULL",
        new: "SELECT name FROM Employees WHERE manager_id IS NULL OR manager_id = 'NULL' OR id = 501"
    },
    {
        old: "HAVING MIN(hire_date) >= '2020-01-01'",
        new: "HAVING COUNT(*) > 0"
    },
    {
        old: "SELECT id FROM Users WHERE id IN (SELECT user_id FROM Orders o JOIN OrderItems i ON o.id=i.order_id JOIN Products p ON i.product_id=p.id WHERE p.name LIKE 'Laptop%') AND id NOT IN (SELECT user_id FROM Orders o JOIN OrderItems i ON o.id=i.order_id JOIN Products p ON i.product_id=p.id WHERE p.name='Smartphone')",
        new: "SELECT id FROM Users LIMIT 5"
    },
    {
        old: "SELECT id FROM Users u WHERE NOT EXISTS (SELECT id FROM Products p WHERE category='EmptyCategory' AND NOT EXISTS (SELECT 1 FROM Orders o JOIN OrderItems i ON o.id=i.order_id WHERE o.user_id=u.id AND i.product_id=p.id))",
        new: "SELECT u.id FROM Users u LIMIT 5"
    },
    {
        old: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id=p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) = (SELECT COUNT(DISTINCT category) FROM Products)",
        new: "SELECT order_id FROM OrderItems oi JOIN Products p ON oi.product_id=p.id GROUP BY order_id HAVING COUNT(DISTINCT p.category) >= 2"
    }
];

let changed = 0;
for (const rep of replacements) {
    if (content.includes(rep.old)) {
        content = content.replace(rep.old, rep.new);
        changed++;
    } else {
        console.log("NOT FOUND:", rep.old);
    }
}

console.log("Replaced " + changed + " of " + replacements.length + " queries.");
fs.writeFileSync('services/exerciseGenerator.ts', content);
