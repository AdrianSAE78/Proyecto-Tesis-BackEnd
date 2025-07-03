const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const asistanceController = require('../controller/asistanceController');

router.use(authenticateToken);

// ✅ Ruta para verificar si ya se tomó asistencia hoy
router.get('/check/:id_course/:id_professor', asistanceController.checkAsistenciaDiaria);

router.get('/', asistanceController.getAllAsistances);
router.get('/:id', asistanceController.getAsistanceById);
router.get('/course/:courseId', asistanceController.getAsistancesByCourseAndStatus);
router.get('/professor/:id_professor/courses/:id_course/inasistencias', asistanceController.getInasistenciasByProfessorCourse);
router.get('/professor/:id_professor/courses/:id_course/atrasos', asistanceController.getAtrazosByProfessorCourse);
router.post('/', asistanceController.createAsistance);
router.put('/:id', asistanceController.updateAsistance);
router.delete('/:id', asistanceController.deleteAsistance);

module.exports = router;
