const Product = require('../models/productModel');

module.exports.getAllProducts = (req, res) => {
    Product.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports.getProductById = (req, res) => {
    Product.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
};

module.exports.createProduct = (req, res) => {
    Product.create(req.body, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, message: 'Product created' });
    });
};

module.exports.updateProduct = (req, res) => {
    Product.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product updated' });
    });
};

module.exports.deleteProduct = (req, res) => {
    Product.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted' });
    });
};
