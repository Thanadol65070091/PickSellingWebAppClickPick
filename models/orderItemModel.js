const db = require('../config/db.js');

const orderItem = {
    getAll: (callback) => {
        db.query('SELECT * FROM order_items', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM order_items WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        db.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [data.order_id, data.product_id, data.quantity, data.price],
            callback
        );
    },

    update: (id, data, callback) => {
        db.query(
            'UPDATE order_items SET order_id=?, product_id=?, quantity=?, price=? WHERE id=?',
            [data.order_id, data.product_id, data.quantity, data.price, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM order_items WHERE id=?', [id], callback);
    }
};

module.exports = orderItem;
