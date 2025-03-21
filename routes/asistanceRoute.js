const express = require('express');
const router = express.Router();
const asistanceController = require('../controler/asistanceController');

router.get('/', asistanceController.getAllAsistances);
router.get('/:id', asistanceController.getAsistanceById);
router.post('/', asistanceController.createAsistance);
router.put('/:id', asistanceController.updateAsistance);
router.delete('/:id', asistanceController.deleteAsistance);

module.exports = router;
