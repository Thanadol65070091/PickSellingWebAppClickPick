const db = require('../config/db.js');

const Product = {
    getAll: async() => {
         const [rows] = await db.query('SELECT * FROM products');
         return rows;
    },

    getById: async(id) => {
         const [result] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
         return result[0]; 
    },

    create: async(data) => {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [data.name, data.description, data.price, data.category, data.image_url],
        );
        return result.insertId; 
    },

    update: async(id, data) => {
        await  db.query(
            'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?',
            [data.name, data.description, data.price, data.category, data.image_url, id],
            
        );
        return true;
    },

    delete: async(id) => {
         await db.query('DELETE FROM products WHERE id=?', [id] );
         return 
    }
};

module.exports = Product;
