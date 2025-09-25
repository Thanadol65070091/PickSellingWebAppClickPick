const db = require('../config/db.js');

const orderItem = {
    getAll: async() => {
         const [rows] = await db.query('SELECT * FROM order_items');
         return rows;
    },

    getById: async (id) => {
         const [rows] = await db.query('SELECT * FROM order_items WHERE id = ?', [id]);
         return rows[0];
    },

    create: async(data) => {
         const [result] = await db.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [data.order_id, data.product_id, data.quantity, data.price],
            
        );
        return result.insertId; 
    },

    update: async(id, data) => {
         const [rows] = await db.query(
            'UPDATE order_items SET order_id=?, product_id=?, quantity=?, price=? WHERE id=?',
            [data.order_id, data.product_id, data.quantity, data.price, id],
            
        );
        return true;
    },

    delete: async(id) => {
        await db.query('DELETE FROM order_items WHERE id=?', [id]);
        return true;
    }
};

module.exports = orderItem;
