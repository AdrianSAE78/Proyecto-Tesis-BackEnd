const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const administrativeController = require('../controller/administrativeController');

// ✅ PROTEGIDAS
router.get('/administratives', administrativeController.getAllAdministratives);
router.get('/administratives/:id', administrativeController.getAdministrativeById);
router.post('/administratives', administrativeController.createAdministrative);
router.put('/administratives/:id', administrativeController.updateAdministrative);
router.delete('/administratives/:id', administrativeController.deleteAdministrative);

// ❗️Solo valida el token del QR, también usa el middleware por seguridad
router.get('/administratives/qr-token/:token/validate', authenticateToken, administrativeController.validateQRToken);

module.exports = router;
