const express = require('express');
const router = express.Router();
const { login, register } = require('../controller/authController'); // Asegúrate de importar register

router.post('/login', login);
router.post('/register', register); // Nuevo endpoint para registrar usuarios

module.exports = router;
