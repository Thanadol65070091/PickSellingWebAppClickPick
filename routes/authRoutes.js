const authController = require("../controllers/authController.js");
const express = require('express');
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;