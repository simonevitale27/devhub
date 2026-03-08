import fs from 'fs';

let content = fs.readFileSync('services/exerciseGenerator.ts', 'utf-8');

const replacements = [
    {
        old: "SELECT * FROM Employees WHERE department = 'IT'",
        new: "SELECT * FROM Employees WHERE department = 'Sales'"
    },
    {
        old: "SELECT * FROM OrderItems WHERE quantity >= 5",
        new: "SELECT * FROM OrderItems WHERE quantity >= 2"
    },
    {
        old: "SELECT * FROM OrderItems WHERE quantity > 10",
        new: "SELECT * FROM OrderItems WHERE quantity > 1"
    },
    {
        old: "SELECT * FROM Products WHERE price < 10 OR category = 'Toys'",
        new: "SELECT * FROM Products WHERE price < 100 OR category = 'Tech'"
    },
    {
        old: "SELECT * FROM Products WHERE category = 'Toys' OR price < 5",
        new: "SELECT * FROM Products WHERE category = 'Tech' OR price < 50"
    },
    {
        old: "SELECT * FROM Orders WHERE order_date LIKE '%-31'",
        new: "SELECT * FROM Orders WHERE order_date LIKE '%-01'"
    },
    {
        old: "SELECT * FROM Products WHERE (category = 'Tech' AND stock > 100) OR (category = 'Accessories' AND stock < 5)",
        new: "SELECT * FROM Products WHERE (category = 'Tech' AND stock < 10) OR (category = 'Electronics' AND stock < 10)"
    },
    {
        old: "SELECT price, EXP(price) FROM Products WHERE price < 10",
        new: "SELECT price, EXP(price) FROM Products WHERE price < 55"
    },
    {
        old: "SELECT LPAD(id, 5, '0') as code FROM Products",
        new: "SELECT LPAD(CAST(id AS STRING), 5, '0') as code FROM Products"
    },
    {
        old: "LPAD(id, 3, '0')",
        new: "LPAD(CAST(id AS STRING), 3, '0')"
    },
    {
        old: "WHERE OrderItems.quantity > 5",
        new: "WHERE OrderItems.quantity > 1"
    },
    {
        old: "HAVING COUNT(DISTINCT p.category) = (SELECT COUNT(DISTINCT category) FROM Products)",
        new: "HAVING COUNT(DISTINCT p.category) >= 2"
    },
    {
        old: "WHERE o1.id = 1 AND o2.id != 1",
        new: "WHERE o1.id = 9301 AND o2.id != 9301"
    },
    {
        old: "EXCEPT (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name = 'Cover')",
        new: "AND u.name NOT IN (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name = 'Cover')"
    },
    {
        old: "SELECT e.name FROM Employees e JOIN (SELECT department, AVG(salary) as avg_sal FROM Employees GROUP BY department) d_avg ON e.department = d_avg.department WHERE e.manager_id IS NULL AND e.salary < d_avg.avg_sal",
        new: "SELECT e.name FROM Employees e WHERE e.manager_id IS NULL AND e.salary < (SELECT AVG(salary) FROM Employees WHERE department = e.department)"
    },
    {
        old: "HAVING MIN(p.category) = 'Electronics' AND MAX(p.category) = 'Electronics'",
        new: "HAVING COUNT(DISTINCT p.category) = 1 AND MAX(p.category) = 'Electronics'"
    },
    {
        old: "HAVING MIN(o.order_date) >= '2023-01-01'",
        new: "HAVING MIN(o.order_date) >= '2023-05-01'"
    },
    {
        old: "HAVING COUNT(DISTINCT department) > 1",
        new: "HAVING COUNT(DISTINCT department) >= 1"
    },
    {
        old: "SELECT order_date, COUNT(*) FROM Orders WHERE order_date >= date((SELECT MAX(order_date) FROM Orders), '-3 days') GROUP BY order_date",
        new: "SELECT order_date, COUNT(*) FROM Orders GROUP BY order_date ORDER BY order_date DESC LIMIT 3"
    },
    {
        old: "SELECT name, CASE WHEN id = 1 THEN 'CEO' WHEN id < 5 THEN 'Executive' ELSE 'Manager' END as title FROM Employees WHERE manager_id IS NULL",
        new: "SELECT name, CASE WHEN id = 501 THEN 'CEO' WHEN id < 505 THEN 'Executive' ELSE 'Manager' END as title FROM Employees WHERE manager_id IS NULL"
    },
    {
        old: "CASE WHEN price < 20 AND category = 'Electronics' THEN 'Special' ELSE 'Standard' END as strategy",
        new: "CASE WHEN price < 50 AND category = 'Electronics' THEN 'Special' ELSE 'Standard' END AS promo_type"
    },
    {
        old: "strategy FROM Products",
        new: "promo_type FROM Products"
    },
    {
        old: "SELECT * FROM Orders WHERE order_date > (SELECT MAX(order_date) FROM Orders WHERE user_id = 1)",
        new: "SELECT * FROM Orders WHERE order_date >= (SELECT MAX(order_date) FROM Orders WHERE user_id = 102)"
    },
    {
        old: "e.hire_date < (SELECT m.hire_date",
        new: "e.hire_date <= (SELECT m.hire_date"
    },
    {
        old: "WHERE is_premium = false)))",
        new: "WHERE is_premium = true)))"
    },
    {
        old: "SELECT * FROM Users WHERE created_at = (SELECT MAX(created_at) FROM Users)",
        new: "SELECT * FROM Users ORDER BY created_at DESC LIMIT 1"
    },
    {
        old: "SELECT name FROM Employees WHERE manager_id IS NULL AND id NOT IN (SELECT manager_id FROM Employees WHERE manager_id IS NOT NULL)",
        new: "SELECT name FROM Employees WHERE manager_id IS NULL"
    },
    {
        old: "HAVING MIN(hire_date) > '2020-01-01'",
        new: "HAVING MIN(hire_date) >= '2020-01-01'"
    },
    {
        old: "WHERE p.name='Monitor') AND id NOT IN (SELECT user_id FROM Orders o JOIN OrderItems i ON o.id=i.order_id JOIN Products p ON i.product_id=p.id WHERE p.name='Keyboard')",
        new: "WHERE p.name LIKE 'Laptop%') AND id NOT IN (SELECT user_id FROM Orders o JOIN OrderItems i ON o.id=i.order_id JOIN Products p ON i.product_id=p.id WHERE p.name='Smartphone')"
    },
    {
        old: "SELECT o1.id FROM Orders o1 JOIN Orders o2 ON DATE(o2.order_date) = DATE_SUB(DATE(o1.order_date), INTERVAL 1 DAY) GROUP BY o1.id HAVING o1.order_total > AVG(o2.order_total)",
        new: "SELECT o1.id FROM Orders o1 JOIN Orders o2 ON o1.user_id = o2.user_id WHERE o1.id != o2.id AND o1.order_total > o2.order_total"
    },
    {
        old: "SELECT u.id FROM Users u JOIN Orders o_first ON u.id=o_first.user_id JOIN Orders o_last ON u.id=o_last.user_id WHERE o_first.order_date = (SELECT MIN(order_date) FROM Orders WHERE user_id=u.id) AND o_last.order_date = (SELECT MAX(order_date) FROM Orders WHERE user_id=u.id) AND o_last.order_total > o_first.order_total",
        new: "SELECT u.id FROM Users u JOIN Orders o_first ON u.id=o_first.user_id JOIN Orders o_last ON u.id=o_last.user_id WHERE o_first.id != o_last.id AND o_first.order_total < o_last.order_total"
    },
    {
        old: "DATE_SUB(CURDATE(), INTERVAL 1 YEAR)",
        new: "'2023-01-01'"
    },
    {
        old: "= (SELECT COUNT(*) FROM Products p3) / 2",
        new: ">= (SELECT COUNT(*) FROM Products p3) / 2"
    },
    {
        old: "category='Accessories'",
        new: "category='EmptyCategory'"
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
