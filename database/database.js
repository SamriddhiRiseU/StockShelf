const Database = require("better-sqlite3");

const db = new Database("database/inventory.db");

console.log("Database connected successfully!");

db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        minimum_stock INTEGER DEFAULT 0,
        rack TEXT,
        shelf TEXT,
        price REAL DEFAULT 0
    )
`).run();

console.log("Products table is ready!");

module.exports = db;

// STOCK HISTORY TABLE

db.prepare(`
    CREATE TABLE IF NOT EXISTS stock_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
`).run();

console.log("Stock history table is ready!");