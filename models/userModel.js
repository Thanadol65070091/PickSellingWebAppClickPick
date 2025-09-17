const db = require('../config/db.js');

const User = {
    getAll: (callback) => {
        db.query('SELECT * FROM users', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [data.name, data.email, data.password, data.role],
            callback
        );
    },

    update: (id, data, callback) => {
        db.query(
            'UPDATE users SET name=?, email=?, password=?, role=? WHERE id=?',
            [data.name, data.email, data.password, data.role, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id=?', [id], callback);
    }
};

module.exports = User;
