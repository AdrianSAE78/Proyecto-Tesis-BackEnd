const express = require('express');
const router = express.Router();

const incidentController = require('../controller/incidentsController');

router.get('/students-follow', incidentController.getStudentsInFollowUp);
router.get('/', incidentController.getAllIncidents);
router.get('/:id', incidentController.getIncidentById);
router.post('/', incidentController.createIncident);
router.put('/:id', incidentController.updateIncident);
router.delete('/:id', incidentController.deleteIncident);

module.exports = router;