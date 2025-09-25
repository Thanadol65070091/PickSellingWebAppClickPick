const db = require('../config/db.js');

const Order = {
    getAll: async () => {
         const [rows] = await db.query('SELECT * FROM orders');
         return rows;
    },

    getById: async (id) => {
       const [result] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        return result[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO orders (user_id, status, total) VALUES (?, ?, ?)',
            [data.user_id, data.status, data.total],
        );
         return result.insertId; 
    },

    update: async (id, data) => {
        await db.query(
            'UPDATE orders SET user_id=?, status=?, total=? WHERE id=?',
            [data.user_id, data.status, data.total, id],
        );
        return true;
    },

    delete: async (id) => {
        await db.query('DELETE FROM orders WHERE id=?', [id] );
        return true;
    }
};

module.exports = Order;
