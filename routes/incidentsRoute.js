const express = require('express');
const router = express.Router();

const incidentController = require('../controller/incidentsController');

router.get('/students-follow', incidentController.getStudentsInFollowUp);
router.get('/incidents', incidentController.getAllIncidents);
router.get('/incidents/:id', incidentController.getIncidentById);
router.post('/incidents', incidentController.createIncident);
router.put('/incidents/:id', incidentController.updateIncident);
router.delete('/incidents/:id', incidentController.deleteIncident);

module.exports = router;