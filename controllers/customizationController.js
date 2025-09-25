const Customization = require('../models/customizationModel.js');

exports.getAllCustomizations = async (req, res) => {
    try {
        const customizations = await Customization.getAll(); 
        res.json(customizations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomizationById = async (req, res) => {
    try {
        const results = await Customization.getById(req.params.id);
        res.json(results || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCustomization = async (req, res) => {
    try {
        const results = await Customization.create(req.body);
        res.status(201).json({ id: results.insertId, message: 'Customization created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCustomization = async (req, res) => {
    try {
        await Customization.update(req.params.id, req.body);
        res.json({ message: 'Customization updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCustomization = async (req, res) => {
    try {
        await Customization.delete(req.params.id);
        res.json({ message: 'Customization deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
