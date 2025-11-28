
import alasql from 'alasql';
import { Difficulty, QueryResult } from '../types';

// --- Mock Data Arrays ---
const firstNames = ['Marco', 'Giulia', 'Luca', 'Sofia', 'Alessandro', 'Francesca', 'Matteo', 'Chiara'];
const lastNames = ['Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno'];
const countries = ['Italia', 'Francia', 'Germania', 'Spagna', 'USA', 'Regno Unito', 'Olanda'];
const companies = ['TechSolutions', 'SoftWareHouse', 'LogisticaVelocissima', 'FreshFoods'];
const categoriesList = [
  { id: 1, nome: 'Elettronica', desc: 'Gadget' },
  { id: 2, nome: 'Abbigliamento', desc: 'Moda' },
  { id: 3, nome: 'Casa', desc: 'Arredo' }
];

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const initDatabase = (difficulty: Difficulty) => {
  try {
    // Safety cleanup
    alasql('DROP TABLE IF EXISTS recensioni');
    alasql('DROP TABLE IF EXISTS spedizioni');
    alasql('DROP TABLE IF EXISTS ordini');
    alasql('DROP TABLE IF EXISTS prodotti');
    alasql('DROP TABLE IF EXISTS fornitori');
    alasql('DROP TABLE IF EXISTS categorie');
    alasql('DROP TABLE IF EXISTS utenti');

    // Create Tables
    alasql('CREATE TABLE utenti (id INT, nome VARCHAR, email VARCHAR, paese VARCHAR, premium BOOLEAN)');
    alasql('CREATE TABLE categorie (id INT, nome VARCHAR, descrizione VARCHAR)');
    alasql('CREATE TABLE prodotti (id INT, nome VARCHAR, categoria_id INT, prezzo DECIMAL, stock INT, fornitore_id INT)');
    alasql('CREATE TABLE ordini (id INT, utente_id INT, prodotto_id INT, data_ordine DATE, quantita INT)');
    alasql('CREATE TABLE spedizioni (id INT, ordine_id INT, data_spedizione DATE, corriere VARCHAR, codice_tracking VARCHAR)');
    alasql('CREATE TABLE fornitori (id INT, azienda VARCHAR, contatto VARCHAR, nazione VARCHAR)');
    alasql('CREATE TABLE recensioni (id INT, prodotto_id INT, utente_id INT, voto INT, commento VARCHAR)');

    // Seed Data (Expanded for better realism)
    alasql('INSERT INTO categorie SELECT * FROM ?', [categoriesList]);

    // Hardcoded Users
    const fixedUsers = [
      { id: 101, nome: 'Mario Rossi', email: 'mario.rossi@example.com', paese: 'Italia', premium: true },
      { id: 102, nome: 'Luigi Verdi', email: 'luigi.verdi@example.com', paese: 'Italia', premium: false },
      { id: 103, nome: 'John Doe', email: 'john.doe@example.com', paese: 'USA', premium: true },
      { id: 104, nome: 'Sophie Martin', email: 'sophie.martin@example.com', paese: 'Francia', premium: false }
    ];
    alasql('INSERT INTO utenti SELECT * FROM ?', [fixedUsers]);

    const users = [];
    for (let i = 1; i <= 35; i++) users.push({
      id: i, nome: getRandom(firstNames), email: 'user' + i + '@mail.com', paese: getRandom(countries), premium: Math.random() > 0.5
    });
    alasql('INSERT INTO utenti SELECT * FROM ?', [users]);

    // Hardcoded Suppliers
    const fixedSuppliers = [
      { id: 101, azienda: 'TechSolutions', contatto: 'Elon Musk', nazione: 'USA' },
      { id: 102, azienda: 'GlobalTrade', contatto: 'Jack Ma', nazione: 'Cina' },
      { id: 103, azienda: 'LogisticaVelocissima', contatto: 'Mario Draghi', nazione: 'Italia' }
    ];
    alasql('INSERT INTO fornitori SELECT * FROM ?', [fixedSuppliers]);

    const suppliers = [];
    for (let i = 1; i <= 10; i++) suppliers.push({
      id: i, azienda: getRandom(companies) + ' ' + i, contatto: getRandom(firstNames) + ' ' + getRandom(lastNames), nazione: getRandom(countries)
    });
    alasql('INSERT INTO fornitori SELECT * FROM ?', [suppliers]);

    // Hardcoded Products
    const fixedProducts = [
      { id: 101, nome: 'Laptop Pro', categoria_id: 1, prezzo: 1200, stock: 50, fornitore_id: 101 },
      { id: 102, nome: 'Smartphone X', categoria_id: 1, prezzo: 800, stock: 20, fornitore_id: 101 },
      { id: 103, nome: 'Monitor 4K', categoria_id: 1, prezzo: 400, stock: 10, fornitore_id: 102 },
      { id: 104, nome: 'T-Shirt Basic', categoria_id: 2, prezzo: 20, stock: 100, fornitore_id: 102 },
      { id: 105, nome: 'Divano Moderno', categoria_id: 3, prezzo: 500, stock: 5, fornitore_id: 103 }
    ];
    alasql('INSERT INTO prodotti SELECT * FROM ?', [fixedProducts]);

    const products = [];
    for (let i = 1; i <= 40; i++) products.push({
      id: i, nome: 'Prodotto ' + String.fromCharCode(65 + (i % 26)) + i, categoria_id: getRandomInt(1, 3), prezzo: getRandomInt(10, 500), stock: getRandomInt(0, 100), fornitore_id: getRandomInt(1, 10)
    });
    alasql('INSERT INTO prodotti SELECT * FROM ?', [products]);

    // Seed Orders
    // Hardcoded Orders for Date Consistency
    const fixedOrders = [
        { id: 1001, utente_id: 101, prodotto_id: 101, data_ordine: '2023-01-01', quantita: 1 }, // New Year Order
        { id: 1002, utente_id: 101, prodotto_id: 102, data_ordine: '2023-01-15', quantita: 2 },
        { id: 1003, utente_id: 102, prodotto_id: 104, data_ordine: '2023-06-01', quantita: 5 }, // Summer Start
        { id: 1004, utente_id: 103, prodotto_id: 103, data_ordine: '2023-12-25', quantita: 1 }  // Christmas
    ];
    alasql('INSERT INTO ordini SELECT * FROM ?', [fixedOrders]);

    const orders = [];
    for (let i = 1; i <= 60; i++) orders.push({
      id: i, utente_id: getRandomInt(1, 35), prodotto_id: getRandomInt(1, 40), data_ordine: `2023-${getRandomInt(1, 12)}-${getRandomInt(1, 28)}`, quantita: getRandomInt(1, 10)
    });
    alasql('INSERT INTO ordini SELECT * FROM ?', [orders]);

    // Seed Shipments - Fixed: garantiamo sempre valori validi, mai undefined
    const shipments = [];
    for (let i = 1; i <= 40; i++) {
      shipments.push({
        id: i,
        ordine_id: getRandomInt(1, 60),
        data_spedizione: `2023-${getRandomInt(1, 12)}-${getRandomInt(1, 28)}`,
        corriere: getRandom(['DHL', 'UPS', 'FedEx', 'GLS']),
        codice_tracking: 'TRK' + getRandomInt(10000, 99999)
      });
    }
    alasql('INSERT INTO spedizioni SELECT * FROM ?', [shipments]);

    // Seed Reviews
    const reviews = [];
    for (let i = 1; i <= 45; i++) reviews.push({
      id: i,
      prodotto_id: getRandomInt(1, 40),
      utente_id: getRandomInt(1, 35),
      voto: getRandomInt(1, 5),
      commento: getRandom(['Ottimo!', 'Buono', 'Pessimo', 'Consigliato', 'Non male', 'Eccellente', 'Da evitare'])
    });
    alasql('INSERT INTO recensioni SELECT * FROM ?', [reviews]);

  } catch (e) {
    console.error("DB Init Failed", e);
  }
};

export const runQuery = (sql: string): QueryResult => {
  try {
    const result = alasql(sql);
    return {
      success: true,
      data: result,
      message: `Query eseguita.`
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || "Errore SQL",
      message: "Errore"
    };
  }
};

export const getTablePreview = (tableName: string): any[] => {
  try {
    return alasql(`SELECT * FROM ${tableName} LIMIT 5`);
  } catch (e) {
    return [];
  }
}

export const getAllTableData = (tableName: string): any[] => {
  try {
    return alasql(`SELECT * FROM ${tableName}`);
  } catch (e) {
    return [];
  }
}

// Helper to interpret SQL errors for the user
export const translateSqlError = (errorMsg: string): string => {
  const err = errorMsg.toLowerCase();
  if (err.includes("parse error") || err.includes("syntax")) return "C'è un errore di sintassi. Controlla di aver scritto correttamente i comandi (SELECT, FROM...) e verifica virgole o parentesi mancanti.";
  if (err.includes("table") && err.includes("exist")) return "Hai provato a selezionare una tabella che non esiste. Controlla il nome nello schema a sinistra.";
  if (err.includes("column") && err.includes("exist")) return "Una colonna specificata non esiste in questa tabella. Verifica i nomi esatti nello schema.";
  if (err.includes("ambiguous")) return "Nome colonna ambiguo. Esiste in più tabelle unite? Usa 'tabella.colonna' per specificare.";
  if (err.includes("group by")) return "Errore di aggregazione. Se usi COUNT/SUM, le altre colonne devono essere nel GROUP BY.";
  return "La query non è valida. Verifica la logica e la sintassi SQL.";
};
