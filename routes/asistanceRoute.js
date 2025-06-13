const express = require('express');
const router = express.Router();
const asistanceController = require('../controller/asistanceController');

router.get('/', asistanceController.getAllAsistances);
router.get('/:id', asistanceController.getAsistanceById);
router.get('/course/:courseId', asistanceController.getAsistancesByCourseAndStatus);
router.get('/professor/:id_professor/courses/:id_course/inasistencias', asistanceController.getInasistenciasByProfessorCourse);
router.post('/', asistanceController.createAsistance);
router.put('/:id', asistanceController.updateAsistance);
router.delete('/:id', asistanceController.deleteAsistance);

module.exports = router;
