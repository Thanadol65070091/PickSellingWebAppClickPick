const db = require('../config/db.js');

const Customization = {
    getAll: (callback) => {
        db.query('SELECT * FROM customizations', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM customizations WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        db.query(
            'INSERT INTO customizations (order_item_id, color, logo, text) VALUES (?, ?, ?, ?)',
            [data.order_item_id, data.color, data.logo, data],
            callback
        );
    },

    update: (id, data, callback) => {
        db.query(
            'UPDATE customizations SET order_item_id=?, color=?, logo=?, text=? WHERE id=?',
            [data.order_item_id, data.color, data.logo, data, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM customizations WHERE id=?', [id], callback);
    }
};

module.exports = Customization;
