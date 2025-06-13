const express = require('express');
const router = express.Router();

const legalRepresentativeController = require('../controller/legalRepresentativeController');

// No poner /legal-representatives aquí, solo usar /
router.get('/', legalRepresentativeController.getAllLegalRepresentatives);
router.get('/:id', legalRepresentativeController.getLegalRepresentativeById);
router.post('/', legalRepresentativeController.createLegalRepresentative);
router.put('/:id', legalRepresentativeController.updateLegalRepresentative);
router.delete('/:id', legalRepresentativeController.deleteLegalRepresentative);

module.exports = router;
