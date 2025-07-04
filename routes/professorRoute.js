const express = require('express');
const router = express.Router();
const professorController = require('../controller/professorController');

// ✅ Solo definimos rutas relativas
router.get('/', professorController.getAllProfessors);
router.get('/:id', professorController.getProfessorById);
router.post('/', professorController.createProfessor);
router.put('/:id', professorController.updateProfessor);
router.put('/:id/phone', professorController.updateProfessorPhone);
router.delete('/:id', professorController.deleteProfessor);

module.exports = router;
