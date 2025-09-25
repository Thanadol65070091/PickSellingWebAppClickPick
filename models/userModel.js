const db = require('../config/db.js');

const User = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },

    getById: async (id) => {
        const [result] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return result[0]; 
    },

    getByEmail: async (id) => {
        const [result] = await db.query('SELECT * FROM users WHERE email = ?', [id]);
        return result[0]; 
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [data.name, data.email, data.password, data.role]
        );
        return result.insertId; 
    },

    update: async (id, data) => {
        await db.query(
            'UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?',
            [data.name, data.email, data.password, data.role, id]
        );
        return true;
    },

    delete: async (id) => {
        await db.query('DELETE FROM users WHERE id=?', [id]);
        return true;
    }
};

module.exports = User;
