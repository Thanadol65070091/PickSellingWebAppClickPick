const User = require('../models/userModel.js');

module.exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports.getUserById = (req, res) => {
    User.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
};

module.exports.createUser = (req, res) => {
    User.create(req.body, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, message: 'User created' });
    });
};

module.exports.updateUser = (req, res) => {
    User.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated' });
    });
};

module.exports.deleteUser = (req, res) => {
    User.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted' });
    });
};
