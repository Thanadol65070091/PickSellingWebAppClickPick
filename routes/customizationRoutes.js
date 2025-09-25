const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');

router.get('/', customizationController.getAllCustomizations);
router.get('/:id', customizationController.getCustomizationById);
router.post('/', customizationController.createCustomization);
router.put('/:id', customizationController.updateCustomization);
router.delete('/:id', customizationController.deleteCustomization);

module.exports = router;