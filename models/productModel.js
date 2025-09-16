const db = require('../config/db.js');

const Product = {
    getAll: (callback) => {
        db.query('SELECT * FROM products', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM products WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        db.query(
            'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [data.name, data.description, data.price, data.category, data.image_url],
            callback
        );
    },

    update: (id, data, callback) => {
        db.query(
            'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?',
            [data.name, data.description, data.price, data.category, data.image_url, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM products WHERE id=?', [id], callback);
    }
};

module.exports = Product;
