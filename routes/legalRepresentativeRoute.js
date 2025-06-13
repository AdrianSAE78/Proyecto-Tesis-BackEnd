const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const legalRepresentativeController = require('../controller/legalRepresentativeController');

// No poner /legal-representatives aquí, solo usar /
router.get('/', legalRepresentativeController.getAllLegalRepresentatives);
router.get('/:id', legalRepresentativeController.getLegalRepresentativeById);
router.post('/', legalRepresentativeController.createLegalRepresentative);
router.put('/:id', legalRepresentativeController.updateLegalRepresentative);
router.delete('/:id', legalRepresentativeController.deleteLegalRepresentative);
router.get('/:id/students', authenticateToken, legalRepresentativeController.getStudentsByRepresentative);
router.get('/:id/estudiantes/:idEst/qr', authenticateToken, legalRepresentativeController.generateQR);
router.get('/:id/estudiantes/:idEst/asistencias', authenticateToken, legalRepresentativeController.getAsistance);
router.get('/:id/estudiantes/:idEst/incidencias', authenticateToken, legalRepresentativeController.getIncidents);

module.exports = router;
