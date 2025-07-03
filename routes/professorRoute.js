/*const express = require('express');
const router = express.Router();

const professorController = require('../controller/professorController');

router.get('/professors', professorController.getAllProfessors);
router.get('/professors/:id', professorController.getProfessorById);
router.post('/professors', professorController.createProfessor);
router.put('/professors/:id', professorController.updateProfessor);
router.delete('/professors/:id', professorController.deleteProfessor);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const professorController = require('../controller/professorController');

// ✅ Solo definimos rutas relativas
router.get('/', professorController.getAllProfessors);
router.get('/:id', professorController.getProfessorById);
router.post('/', professorController.createProfessor);
router.put('/:id', professorController.updateProfessor);
router.delete('/:id', professorController.deleteProfessor);

module.exports = router;
