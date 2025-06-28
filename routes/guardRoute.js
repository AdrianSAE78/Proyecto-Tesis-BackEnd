const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const guardController = require('../controller/guardController');

// No poner /legal-representatives aquí, solo usar /
router.get('/', guardController.getAllGuards);
router.get('/:id', guardController.getGuardById);
router.post('/', guardController.createGuard);
router.put('/:id', guardController.updateGuard);
router.delete('/:id', guardController.deleteGuard);

module.exports = router;
