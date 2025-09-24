const orderItem = require('../models/orderItemModel');

module.exports.getAllOrderItems = (req, res) => {
    orderItem.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports.getOrderItemById = (req, res) => {
    orderItem.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
};

module.exports.createOrderItem = (req, res) => {
    orderItem.create(req.body, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, message: 'Order Item created' });
    });
};

module.exports.updateOrderItem = (req, res) => {
    orderItem.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order Item updated' });
    });
};

module.exports.deleteOrderItem = (req, res) => {
    orderItem.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order Item deleted' });
    });
};