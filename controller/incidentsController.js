const Incident = require('../model/incidentsModel');
const Student = require('../model/studentModel')

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
    const { type, description, id_student, id_professor } = req.body;

    if (!id_student || !id_professor) {
      return res.status(400).json({ error: "Id necesario" });
    }
    const newIncident = await Incident.create({type, description, id_student, id_professor,});
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

exports.getStudentsInFollowUp = async (req, res) => {
    try {
        const incidents = await Incident.findAll({
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id_student', 'lastName', 'firstName']
                }
            ]
        });

        const students = incidents.map(inc => inc.student);

        const uniqueStudents = [];
        const seen = new Set();

        students.forEach(student => {
            if (student && !seen.has(student.id_student)) {
                seen.add(student.id_student);
                uniqueStudents.push(student);
            }
        });

        res.status(200).json(uniqueStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
