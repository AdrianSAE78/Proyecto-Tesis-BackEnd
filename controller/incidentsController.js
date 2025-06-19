const Incident = require('../model/incidentsModel');
const Student = require('../model/studentModel');
const Professor = require('../model/professorModel');

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

exports.getIncidentsByStudentId = async (req, res) => {
  try {
    const { id } = req.params;

    const incidents = await Incident.findAll({
      where: { id_student: id },
      include: [
        {
          model: Student,
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json(incidents);
  } catch (error) {
    console.error("Error al obtener incidentes:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getIncidentsByCourse = async (req, res) => {
    try {
        let { courseId } = req.params;

        let incidents = await Incident.findAll({
            include: [
                {
                    model: Student,
                    as: 'student',
                    where: { id_course: courseId },
                    attributes: ['firstName', 'lastName']
                }
            ],
            order: [['date', 'DESC']]
        });

        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener incidentes", error: error.message });
    }
};


exports.createIncident = async (req, res) => {
  try {
    let { type, description, resolution, id_student, id_professor } = req.body;

    if (!id_student || !id_professor) {
      return res.status(400).json({ error: "Id necesario" });
    }
    let newIncident = await Incident.create({type, description, resolution:null, id_student, id_professor,});
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
        let { studentId, professorId, type, description,resolution, date, status } = req.body;
        await incident.update({ studentId, professorId, type, description, resolution, date, status });
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
      where: { status: 'pending' },
      include: [
        {
          model: Student,
          as: 'incidentStudent',
          attributes: ['id_student', 'firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']]
    });

    const uniqueStudents = [];
    const seen = new Set();

    for (const inc of incidents) {
      const student = inc.incidentStudent;
      if (student && !seen.has(student.id_student)) {
        seen.add(student.id_student);
        uniqueStudents.push(student);
      }
    }

    res.status(200).json(uniqueStudents);
  } catch (error) {
    console.error("Error al obtener estudiantes en seguimiento:", error);
    res.status(500).json({ error: error.message });
  }
};

