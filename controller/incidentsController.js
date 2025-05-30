const Incident = require('../model/incidentsModel');

exports.getAllIncidents = async (req, res) => {
    try {
        let incidents = await Incident.findAll();
        res.status(200).json(incidents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getIncidentById = async (req, res) => {
    try {
        let incident = await Incident.findByPk(req.params.id);
        if (!incident) {
            return res.status(404).json({ error: 'Incidente no encontrado' });
        }
        res.status(200).json(incident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createIncident = async (req, res) => {
    try {
        const { studentId, professorId, type, description, date, status } = req.body;
        let newIncident = await Incident.create({ studentId, professorId, type, description, date, status });
        res.status(201).json(newIncident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateIncident = async (req, res) => {
    try {
        let incident = await Incident.findByPk(req.params.id);
        if (!incident) {
            return res.status(404).json({ error: 'Incidente no encontrado' });
        }
        const { studentId, professorId, type, description, date, status } = req.body;
        await incident.update({ studentId, professorId, type, description, date, status });
        res.status(200).json(incident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteIncident = async (req, res) => {
    try {
        let incident = await Incident.findByPk(req.params.id);
        if (!incident) {
            return res.status(404).json({ error: 'Incidente no encontrado' });
        }
        await incident.destroy();
        res.status(200).json({ message: 'Incidente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
