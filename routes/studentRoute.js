const express = require('express');
const router = express.Router();

const studentController = require('../controller/studentController');

router.get('/by_course/:courseId', studentController.getStudentsByCourseId);
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

module.exports = router;
