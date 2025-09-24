const Order = require('../models/orderModel');

module.exports.getAllOrders = (req, res) => {
    Order.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports.getOrderById = (req, res) => {
    Order.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
};

module.exports.createOrder = (req, res) => {
    Order.create(req.body, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, message: 'Order created' });
    });
};

module.exports.updateOrder = (req, res) => {
    Order.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order updated' });
    });
};

module.exports.deleteOrder = (req, res) => {
    Order.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order deleted' });
    });
};