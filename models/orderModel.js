const db = require('../config/db.js');

const Order = {
    getAll: (callback) => {
        db.query('SELECT * FROM orders', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM orders WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        db.query(
            'INSERT INTO orders (user_id, status, total) VALUES (?, ?, ?)',
            [data.user_id, data.status, data.total],
            callback
        );
    },

    update: (id, data, callback) => {
        db.query(
            'UPDATE orders SET user_id=?, status=?, total=? WHERE id=?',
            [data.user_id, data.status, data.total, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM orders WHERE id=?', [id], callback);
    }
};

module.exports = Order;
