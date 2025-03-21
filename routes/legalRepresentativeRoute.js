const express = require('express');
const router = express.Router();

const legalRepresentativeController = require('../controller/legalRepresentativeController');

router.get('/legal-representatives', legalRepresentativeController.getAllLegalRepresentatives);
router.get('/legal-representatives/:id', legalRepresentativeController.getLegalRepresentativeById);
router.post('/legal-representatives', legalRepresentativeController.createLegalRepresentative);
router.put('/legal-representatives/:id', legalRepresentativeController.updateLegalRepresentative);
router.delete('/legal-representatives/:id', legalRepresentativeController.deleteLegalRepresentative);

module.exports = router;