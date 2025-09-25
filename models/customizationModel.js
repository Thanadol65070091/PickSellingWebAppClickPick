const db = require('../config/db.js');

const Customization = {
    getAll: async() => {
         const [rows] = await db.query('SELECT * FROM customizations');
         return rows;
    },

    getById: async(id) => {
         const [result] = await db.query('SELECT * FROM customizations WHERE id = ?', [id]);
         return result[0]; 
    },

    create: async(data) => {
        const [result] = await db.query(
            'INSERT INTO customizations (order_item_id, color, logo, text) VALUES (?, ?, ?, ?)',
            [data.order_item_id, data.color, data.logo, data.text],
        );
        return result.insertId; 
    },

    update: async(id, data) => {
        await  db.query(
            'UPDATE customizations SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?',
            [data.name, data.description, data.price, data.category, data.image_url, id],
            
        );
        return true;
    },

    delete: async(id) => {
         await db.query('DELETE FROM customizations WHERE id=?', [id] );
         return 
    }
};

module.exports = Customization;
