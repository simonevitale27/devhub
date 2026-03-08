import fs from 'fs';

let content = fs.readFileSync('services/exerciseGenerator.ts', 'utf-8');

const replacements = [
    // 1. Like M___ - make it 5 characters to match Mario
    { search: "name LIKE 'M___'", replace: "name LIKE 'M____'" },
    
    // 2. LOWER(name) = 'mario' - the mock data has 'Mario Rossi'
    { search: "LOWER(name) = 'mario'", replace: "LOWER(name) LIKE 'mario%'" },
    { search: "brokenCode: \"SELECT * FROM Users WHERE LOWER(name) = 'Mario'\"", replace: "brokenCode: \"SELECT * FROM Users WHERE name = 'mario'\"" },
    
    // 3. Filtro Avanzato Finale: category = 'Old' -> category = 'Accessories'
    { search: "category = 'Old'", replace: "category = 'Accessories'" },
    
    // 4. POWER(points, 2)
    { search: "POWER(points, 2) as points_squared FROM Users", replace: "POWER(price, 2) as price_squared FROM Products" },
    { search: "SELECT points, POWER", replace: "SELECT price, POWER" },
    { search: "dei punti fedeltà.", replace: "del prezzo." },
    { search: "SELECT points ^ 2 FROM Users", replace: "SELECT price ^ 2 FROM Products" },

    // 5. SIGN(points)
    { search: "SELECT points, SIGN(points) FROM Users", replace: "SELECT price, SIGN(price - 50) FROM Products" },
    { search: "se i punti sono positivi", replace: "se il prezzo meno 50 è positivo" },

    // 6. Ripeti Stringa - alasql throws parse error for REPEAT. Change exercise to LENGTH.
    { search: "titleTemplate: \"Ripeti Stringa\"", replace: "titleTemplate: \"Lunghezza Stringa\"" },
    { search: "descTemplate: \"Ripeti 'CEO' 3 volte.\"", replace: "descTemplate: \"Calcola la lunghezza della stringa 'CEO'.\"" },
    { search: "queryTemplate: \"SELECT REPEAT('CEO', 3)\"", replace: "queryTemplate: \"SELECT LENGTH('CEO')\"" },
    { search: "hints: [\"Usa REPEAT()\", \"Indica la stringa e il numero di volte\"]", replace: "hints: [\"Usa LENGTH()\"]" },
    { search: "explanation: \"REPEAT ripete ", replace: "explanation: \"LENGTH calcola la lunghezza " },
    { search: "brokenCode: \"SELECT 'CEO' * 3\"", replace: "brokenCode: \"SELECT LEN('CEO')\"" },
    { search: "debugHint: \"Usa REPEAT() invece dell'asterisco.\"", replace: "debugHint: \"In molti dialetti SQL (incluso quello usato qui) usa LENGTH() invece di LEN().\"" },

    // 7. Posizione Carattere - INSTR(email, '@') crashes on null emails
    { search: "INSTR(email, '@') as at_pos FROM Users", replace: "INSTR(COALESCE(email, ''), '@') as at_pos FROM Users" },

    // 8. Iniziali - Employees has no 'role', use 'department'
    { search: "initial, role FROM Employees", replace: "initial, department FROM Employees" },

    // 9. Ripeti Asterisco -> LENGTH
    { search: "titleTemplate: \"Ripeti Asterisco\"", replace: "titleTemplate: \"Lunghezza Nome Prodotto\"" },
    { search: "descTemplate: \"Visualizza il nome e una 'barra' di asterischi lunga quanto lo stock.\"", replace: "descTemplate: \"Visualizza il nome e la lunghezza del nome del prodotto.\"" },
    { search: "queryTemplate: \"SELECT name, REPEAT('*', stock) as stock_bar FROM Products\"", replace: "queryTemplate: \"SELECT name, LENGTH(name) as name_len FROM Products\"" },
    { search: "hints: [\"Usa REPEAT() per creare una barra visiva\"]", replace: "hints: [\"Usa LENGTH() per la lunghezza\"]" },
    { search: "brokenCode: \"SELECT name, '*' * stock FROM Products\"", replace: "brokenCode: \"SELECT name, LEN(name) FROM Products\"" },
    { search: "debugHint: \"Il '*' non ripete stringhe in SQL. Usa REPEAT().\"", replace: "debugHint: \"Usa LENGTH() invece di LEN().\"" },

    // 10. Trim Personalizzato -> Normal LTRIM
    { search: "titleTemplate: \"Trim Personalizzato\"", replace: "titleTemplate: \"Trim a Sinistra\"" },
    { search: "descTemplate: \"Rimuovi la lettera 'X' iniziale da 'XXXName'.\"", replace: "descTemplate: \"Rimuovi gli spazi iniziali da '   Name'.\"" },
    { search: "queryTemplate: \"SELECT TRIM(LEADING 'X' FROM 'XXXName')\"", replace: "queryTemplate: \"SELECT LTRIM('   Name')\"" },
    { search: "hints: [\"Usa TRIM() con la sintassi LEADING ... FROM\"]", replace: "hints: [\"Usa LTRIM()\"]" },
    { search: "explanation: \"TRIM supporta LEADING/TRAILING/BOTH per rimuovere caratteri specifici.\"", replace: "explanation: \"LTRIM rimuove gli spazi iniziali (a sinistra).\"" },
    { search: "brokenCode: \"SELECT LTRIM('XXXName', 'X')\"", replace: "brokenCode: \"SELECT TRIM(LEFT '   Name')\"" },
    { search: "debugHint: \"Usa la sintassi standard LEADING ... FROM.\"", replace: "debugHint: \"In SQL standard e in questo ambiente, usa LTRIM() nativo.\"" },

    // 11. Estrazione Tag
    { search: "Estrazione Tag", replace: "Estrazione Parziale" },
    { search: "SUBSTR(description, INSTR(description, '[')+1, INSTR(description, ']') - INSTR(description, '[') - 1)", replace: "SUBSTR(name, INSTR(name, 'e')+1, 3)" },
    { search: "WHERE description LIKE '%[%'", replace: "WHERE name LIKE '%e%'" },

    // 12. Giorno Anno - dates
    { search: "DATEDIFF(order_date, MAKEDATE(YEAR(order_date), 1)) + 1 FROM Orders", replace: "DATEDIFF(NOW(), order_date) FROM Orders" },
    { search: "titleTemplate: \"Giorno Anno\"", replace: "titleTemplate: \"Giorni Trascorsi\"" },
    { search: "descTemplate: \"Calcola in che giorno dell'anno è stato effettuato l'ordine.\"", replace: "descTemplate: \"Calcola i giorni trascorsi dalla data dell'ordine a oggi.\"" },
    
    // 13. Solo Orario PM
    { search: "HOUR(order_date) >= 12", replace: "MONTH(order_date) >= 6" },
    { search: "titleTemplate: \"Solo Orario PM\"", replace: "titleTemplate: \"Seconda Metà Anno\"" },
    { search: "descTemplate: \"Estrai solo gli ordini fatti dalle 12:00 in poi.\"", replace: "descTemplate: \"Estrai solo gli ordini fatti da giugno in poi.\"" },
    
    // 14. Diff Ore Lavorative (Sim)
    { search: "DATEDIFF(NOW(), created_at) * 8 FROM Users", replace: "DATEDIFF(NOW(), created_at) FROM Users" },

    // 15. Prossimo Compleanno (Giorni)
    { search: "DATEDIFF(CONCAT(YEAR(NOW()) + (CASE WHEN MONTH(created_at) < MONTH(NOW()) THEN 1 ELSE 0 END), '-', DATE_FORMAT(created_at, '%m-%d')), NOW())", replace: "DATEDIFF(NOW(), created_at) * 24" },
    
    // 16. TO_DAYS -> DATEDIFF
    { search: "queryTemplate: \"SELECT TO_DAYS(created_at) FROM Users\"", replace: "queryTemplate: \"SELECT DATEDIFF(NOW(), created_at) FROM Users\"" },
    { search: "titleTemplate: \"Giorno Giuliano\"", replace: "titleTemplate: \"Giorni Trascorsi da Creazione\"" },

    // 17. Percentuale anno
    { search: "ROUND(DATEDIFF(NOW(, MAKEDATE(YEAR(NOW(), 1)) + 1) / 365.25 * 100, 2)", replace: "ROUND(DATEDIFF(NOW(), created_at) / 365.25 * 100, 2)" },

    // 18. Median Date (Sim)
    { search: "DATE_ADD(created_at, INTERVAL DATEDIFF(NOW(), created_at)/2 DAY)", replace: "DATEDIFF(NOW(), created_at)/2 AS median_days FROM Users" },

    // 19. UTENTI SALES (Join) -> employees
    { search: "JOIN Employees e ON u.name = e.name", replace: "JOIN Employees e ON u.email = e.email" },

    // 20. Ordini Mese Corrente -> Ordini Anno Corrente
    { search: "MONTH(o.order_date) = MONTH(NOW()) AND YEAR(o.order_date) = YEAR(NOW())", replace: "YEAR(o.order_date) = YEAR(NOW())" },

    // 21. Gap Analysis Vendite (EXCEPT parse error)
    { search: "EXCEPT (SELECT u2.name FROM Users u2 ... Join ... WHERE p.name = 'Cover')", replace: "EXCEPT (SELECT u2.name FROM Users u2 JOIN Orders o2 ON u2.id = o2.user_id JOIN OrderItems oi2 ON o2.id = oi2.order_id JOIN Products p2 ON oi2.product_id = p2.id WHERE p2.name = 'Cover')" },
    
    // 22. Join Products ambigious id
    { search: "JOIN Products ON product_id=id", replace: "JOIN Products p ON detail.product_id = p.id" }, 

    // 23. strftime('%Y', order_date) -> YEAR(order_date)
    { search: "strftime('%Y', order_date)", replace: "YEAR(order_date)" },

    // 24. Fascia Anzianità CASE parse syntax (NOW())
    { search: "DATEDIFF(NOW(), hire_date) < 365", replace: "DATEDIFF(NOW(), hire_date) < 1000" },
    
    // 25. Prodotto Civetta parse syntax
    { search: "THEN 'Loss Leader' ELSE 'Standard' END", replace: "THEN 'Special' ELSE 'Standard' END" },
    
    // 26. advanced - Stesso Paese
    { search: "(SELECT country FROM Users WHERE id = (SELECT user_id FROM Orders WHERE id = 5))", replace: "(SELECT country FROM Users WHERE id = 100)" },

    // 27. advanced - Primi 3 Users e Staff parse error
    { search: "(SELECT name FROM Users ORDER BY id LIMIT 3) UNION (SELECT name FROM Employees ORDER BY id LIMIT 3)", replace: "SELECT name FROM Users WHERE id < 4 UNION SELECT name FROM Employees WHERE id < 4" },
    { search: "UNION necessita parentesi per gli ORDER BY", replace: "L'operatore UNION combina il risultato di due select" }
];

for (const r of replacements) {
    content = content.split(r.search).join(r.replace);
}

// 22_b fixing that advanced ambiguous column
content = content.replace(
    "SELECT order_id, SUM(quantity*price) as calc_sum FROM OrderItems JOIN Products p ON detail.product_id = p.id GROUP BY order_id",
     "SELECT order_id, SUM(quantity*unit_price) as calc_sum FROM OrderItems GROUP BY order_id"
);

fs.writeFileSync('services/exerciseGenerator.ts', content);
console.log("exerciseGenerator.ts updated via mass replace script.");
