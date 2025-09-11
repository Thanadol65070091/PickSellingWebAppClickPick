
require('dotenv').config();
const express = require('express')
const mysql = require('mysql2')
const app = express()
app.use(express.json());
const hostname = 'localhost';
const port = 3000;
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        console.error('❌ DB connection failed:', err.message);
        console.log({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
});
        process.exit(1); // stop the server
    }
    console.log('✅ DB connected as ID', db.threadId);
});

app.get('/', (req, res) => {
    if (db && db.state === 'authenticated') {
        res.send("db connected");
    } else {
        res.send("db not connected");
    }
});

app.get('/products', (req, res) =>{
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(results);
    });
});

app.get('/products/:id', (req, res) =>{
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(results[0] || {});
    });
});

app.post('/products', (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    db.query(
        'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, category, image_url],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, message: 'Product created' });
        }
    );
});


app.put('/products/:id', (req, res) => {
    const { name, description, price, category, image_url} = req.body;
    db.query(
        'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
        [name, description, price, category, image_url, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({error: err.message});
            res.json({message: 'Product updated'});
        }
    );
});

app.delete('/products/:id', (req, res) => {
    db.query(
        'DELETE FROM products WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product deleted' });
        }
    );
});

app.listen(port, hostname, () => {
          console.log(`Server running at http://${hostname}:${port}/`);
});
 