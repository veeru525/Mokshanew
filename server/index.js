const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001; // Running on port 3001 to avoid conflict with React (5173) and json-server (3000)

app.use(cors());
app.use(express.json());

// Initialize Database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

// Create Tables
function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            display_name TEXT,
            created_at TEXT
        )`);

        // Cart Items Table
        // We store the full product details as JSON string to simplify the demo
        // In a real relational DB, you'd normalize this with a 'products' table.
        db.run(`CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            product_details TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        console.log('Database tables initialized');
    });
}

// Routes

// Register
app.post('/api/register', (req, res) => {
    const { email, password, displayName } = req.body;
    const createdAt = new Date().toISOString();

    const sql = `INSERT INTO users (email, password, display_name, created_at) VALUES (?, ?, ?, ?)`;

    db.run(sql, [email, password, displayName, createdAt], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'User already exists' });
            }
            return res.status(500).json({ error: err.message });
        }

        // Return created user (without password)
        res.json({
            id: this.lastID,
            email,
            displayName,
            createdAt
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.get(sql, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { password: _, ...user } = row;
        res.json(user);
    });
});

// Google Sign In (Mock/Simulated)
app.post('/api/google-login', (req, res) => {
    const { email, displayName, photoURL, uid } = req.body;

    // Check if user exists
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            // Login existing
            const { password: _, ...user } = row;
            res.json(user);
        } else {
            // Register new
            const createdAt = new Date().toISOString();
            const sql = `INSERT INTO users (email, display_name, created_at) VALUES (?, ?, ?)`; // Password null for google users

            db.run(sql, [email, displayName, createdAt], function (err) {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    id: this.lastID,
                    email,
                    displayName,
                    createdAt
                });
            });
        }
    });
});

// Get Cart
app.get('/api/cart/:userId', (req, res) => {
    const sql = `SELECT * FROM cart_items WHERE user_id = ?`;

    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Transform back to expected format
        const cartItems = rows.map(row => {
            const product = JSON.parse(row.product_details);
            return {
                ...product,
                quantity: row.quantity
                // We don't need row.id (cart item id) for the simplified frontend logic, 
                // but strictly speaking we should use it. For now, matching frontend expectations.
            };
        });

        res.json(cartItems);
    });
});

// Sync Cart (Replace entire cart - simplest for this demo transition)
app.post('/api/cart/:userId', (req, res) => {
    const { cart } = req.body;
    const userId = req.params.userId;

    // Use transaction to delete old items and add new ones
    db.serialize(() => {
        db.run(`DELETE FROM cart_items WHERE user_id = ?`, [userId], (err) => {
            if (err) {
                console.error(err);
                // Continue anyway...
            }
        });

        const stmt = db.prepare(`INSERT INTO cart_items (user_id, product_id, quantity, product_details) VALUES (?, ?, ?, ?)`);

        cart.forEach(item => {
            const { quantity, ...productDetails } = item;
            stmt.run(userId, item.id, quantity, JSON.stringify(productDetails));
        });

        stmt.finalize((err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
