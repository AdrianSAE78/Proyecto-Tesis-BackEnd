const express = require('express');
const router = express.Router();

const studentController = require('../controller/studentController');

// CRUD principal
router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Consultas personalizadas
router.get('/by_course/:courseId', studentController.getStudentsByCourseId);
router.get('/search/:apellido/:id_professor', studentController.searchStudentsByLastNameAndProfessor);

module.exports = router;
