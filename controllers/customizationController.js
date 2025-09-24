const Customization = require('../models/customizationModel');

module.exports.getAllCustomizations = (req, res) => {
    Customization.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports.getCustomizationById = (req, res) => {
    Customization.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
};

module.exports.createCustomization = (req, res) => {
    Customization.create(req.body, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, message: 'Customization created' });
    });
};

module.exports.updateCustomization = (req, res) => {
    Customization.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customization updated' });
    });
};

module.exports.deleteCustomization = (req, res) => {
    Customization.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Customization deleted' });
    });
};