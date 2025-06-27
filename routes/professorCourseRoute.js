const express = require('express');
const router = express.Router();
const professorCourseController = require('../controller/professorCourseController');

// Obtener TODAS las asignaciones
router.get('/', professorCourseController.getAllAssignments);

// Obtener asignaciones por ID de profesor
router.get('/:id_professor', professorCourseController.getAssignmentsByProfessorId);

// Asignar un curso a un profesor
router.post('/', professorCourseController.assignCourseToProfessor);

module.exports = router;
