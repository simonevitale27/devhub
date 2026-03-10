const alasql = require('alasql');

function testCases() {
  alasql('CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, country VARCHAR, is_premium BOOLEAN, created_at DATE)');
  alasql('CREATE TABLE Products (id INT PRIMARY KEY, name VARCHAR, category VARCHAR, price DECIMAL, stock INT)');
  alasql('CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT, order_date DATE, status VARCHAR, order_total DECIMAL)');
  alasql('CREATE TABLE OrderItems (id INT PRIMARY KEY, order_id INT, product_id INT, quantity INT, unit_price DECIMAL)');
  alasql('CREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR, email VARCHAR, department VARCHAR, hire_date DATE, manager_id INT, salary DECIMAL)');
  
  alasql(`INSERT INTO Users VALUES 
    (1, 'Alice', 'alice@example.com', 'Italy', true, '2023-01-15'),
    (2, 'Bob', NULL, 'USA', false, '2023-02-20')`);
    
  alasql(`INSERT INTO Products VALUES 
    (1, 'Laptop Pro', 'Electronics', 1200.00, 50),
    (2, 'Wireless Mouse', 'Electronics', 25.50, 150),
    (3, 'Desk Chair', 'Furniture', 199.99, 5),
    (4, 'Coffee Mug', 'Accessories', 12.00, 0),
    (5, 'Monitor 4K', 'Electronics', 350.00, 2)`);
    
  alasql(`INSERT INTO Orders VALUES 
    (101, 1, '2023-11-01', 'Delivered', 1225.50),
    (102, 2, '2023-11-05', 'Shipped', 25.50),
    (103, 3, '2023-11-10', 'Processing', 199.99)`);

  const easyQueries = [
    // 1. Priorità di Rifornimento (Products)
    "SELECT name, stock, CASE WHEN stock = 0 THEN 'Critico' WHEN stock <= 10 THEN 'Riordino' ELSE 'Ottimale' END as livello_scorte FROM Products",
    // 2. Classificazione Clienti (Users)
    "SELECT name, CASE WHEN is_premium = true THEN 'Cliente VIP' ELSE 'Cliente Standard' END as tipo_cliente FROM Users",
    // 3. Segmentazione Spedizioni (Orders)
    "SELECT id as order_id, order_total, CASE WHEN order_total >= 1000 THEN 'Spedizione Omaggio' ELSE 'Spedizione Standard' END as tipo_spedizione FROM Orders",
    // 4. Traduzione Stati Ordine (Orders)
    "SELECT id, status, CASE WHEN status = 'Delivered' THEN 'Consegnato' WHEN status = 'Shipped' THEN 'Spedito' ELSE 'In Lavorazione' END as stato_it FROM Orders",
    // 5. Categorizzazione Prodotti (Products)
    "SELECT name, category, CASE WHEN category = 'Electronics' THEN 'Dipartimento Tech' ELSE 'Dipartimento Generico' END as dipartimento FROM Products",
    // 6. Report Manager (Employees)
    "SELECT name, CASE WHEN manager_id IS NULL THEN 'Dirigente' ELSE 'Dipendente' END as ruolo_aziendale FROM Employees",
    // 7. Screening Contatti (Users)
    "SELECT name, email, CASE WHEN email LIKE '%.com' THEN 'Internazionale' ELSE 'Locale' END as origine_contatto FROM Users",
    // 8. Controllo Integrità Email (Users)
    "SELECT name, CASE WHEN email IS NULL THEN 'Dati Incompleti' ELSE 'Profilo Valido' END as stato_profilo FROM Users",
    // 9. Analisi Inventario (Products)
    "SELECT name, price, stock, CASE WHEN price * stock > 5000 THEN 'Asset Primario' ELSE 'Asset Secondario' END as importanza_asset FROM Products",
    // 10. Valutazione Sconti (OrderItems)
    "SELECT order_id, product_id, CASE WHEN quantity >= 10 THEN 'Sconto Quantità Applicabile' ELSE 'Prezzo Pieno' END as promo_status FROM OrderItems"
  ];

  const mediumQueries = [
    // 1. Analisi Redditività (Products)
    "SELECT name, price, CASE WHEN price < 50 THEN 'High Volume' WHEN price <= 500 THEN 'Core Business' ELSE 'Premium' END as segmento_vendita FROM Products",
    // 2. Ordinamento per Priorità Operativa (Orders)
    "SELECT id, status, order_date FROM Orders ORDER BY CASE WHEN status = 'Processing' THEN 1 WHEN status = 'Shipped' THEN 2 ELSE 3 END, order_date ASC",
    // 3. Sistema di Coalescenza Referenti (Employees)
    "SELECT name, COALESCE(manager_id, id) as referente_operativo FROM Employees",
    // 4. Prevenzione Errori Calcolo (Products)
    "SELECT name, price / NULLIF(stock, 0) as valore_unitario_reale FROM Products",
    // 5. Raggruppamento Fasi Operative (Orders)
    "SELECT id, CASE WHEN status IN ('Processing', 'Shipped') THEN 'In Corso' ELSE 'Completato' END as macro_fase FROM Orders",
    // 6. Calcolo Tariffario Spedizioni (Orders)
    "SELECT id, order_total, CASE WHEN order_total >= 1000 THEN 0 WHEN order_total >= 100 THEN 15.50 ELSE 25.00 END as costo_spedizione FROM Orders",
    // 7. Dashboard Seniority (Users)
    "SELECT name, CASE WHEN created_at < '2023-01-01' THEN 'Legacy User' WHEN created_at < '2024-01-01' THEN 'Established User' ELSE 'New User' END as cohort FROM Users",
    // 8. Dynamic Pricing Simulator (Products)
    "SELECT name, price as current_price, CASE WHEN category = 'Electronics' THEN price * 1.15 WHEN category = 'Furniture' THEN price * 1.05 ELSE price END as projected_price FROM Products",
    // 9. Aggregatore di Nomi (Users)
    "SELECT CASE WHEN name IS NOT NULL THEN 'Utente: ' || name ELSE 'Utente Anonimo (' || id || ')' END as display_name FROM Users",
    // 10. Bonus Produzione (Employees)
    "SELECT name, salary, CASE WHEN department = 'Sales' AND hire_date < '2022-01-01' THEN salary * 1.10 WHEN department = 'IT' THEN salary * 1.05 ELSE salary END as nuovo_stipendio FROM Employees"
  ];

  let errors = 0;
  for (const q of [...easyQueries, ...mediumQueries]) {
      try {
          alasql(q);
      } catch (e) {
         console.error("FAIL:", q);
         console.error(e.message);
         errors++;
      }
  }
  if (errors === 0) console.log("All custom queries passed syntax check.");
}
testCases();
