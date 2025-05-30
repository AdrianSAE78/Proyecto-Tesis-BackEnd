const express = require('express');
const router = express.Router();

const administrativeController = require('../controller/administrativeController');

router.get('/administratives', administrativeController.getAllAdministratives);
router.get('/administratives/:id', administrativeController.getAdministrativeById);
router.post('/administratives', administrativeController.createAdministrative);
router.put('/administratives/:id', administrativeController.updateAdministrative);
router.delete('/administratives/:id', administrativeController.deleteAdministrative);

module.exports = router;
