const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/professor/:professorId', courseController.getCoursesByProfessor);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.post('/assign', courseController.assignCourseToProfessor);

module.exports = router;
