const OrderItem = require('../models/orderItemModel');

exports.getAllOrderItems = async (req, res) => {
    try {
        const order_items = await OrderItem.getAll(); 
        res.json(order_items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderItemById = async (req, res) => {
    try {
        const results = await OrderItem.getById(req.params.id);
        res.json(results || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrderItem = async (req, res) => {
    try {
        const results = await OrderItem.create(req.body);
        res.status(201).json({ id: results.insertId, message: 'Order Item created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrderItem = async (req, res) => {
    try {
        await OrderItem.update(req.params.id, req.body);
        res.json({ message: 'Order Item updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrderItem = async (req, res) => {
    try {
        await OrderItem.delete(req.params.id);
        res.json({ message: 'Order Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};