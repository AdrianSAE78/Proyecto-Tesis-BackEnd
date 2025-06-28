const { Asistance, Student } = require('../model/tableRelations');
const { Op } = require("sequelize");
const moment = require('moment');

exports.getAllAsistances = async (req, res) => {
    try {
        const asistances = await Asistance.findAll();
        res.status(200).json(asistances);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener asistencias", error: error.message });
    }
};

exports.getAsistanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const asistance = await Asistance.findByPk(id);

        if (!asistance) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        res.status(200).json(asistance);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener asistencia", error: error.message });
    }
};

exports.getInasistenciasByCourse = async (req, res) => {
  try {
    const { id_course } = req.params;
    const { status } = req.query;

    const asistances = await Asistance.findAll({
      where: { id_course, status },
      include: [
        { model: Student, attributes: ['firstName', 'lastName'] }
      ]
    });

    res.status(200).json(asistances);
  } catch (error) {
    console.error("Error al obtener asistencias", error);
    res.status(500).json({ message: "Error al obtener asistencias", error: error.message });
  }
};

exports.createAsistance = async (req, res) => {
  try {
    const {
      id_student,
      id_professor,
      id_course,
      status,
      justification,
      news,
    } = req.body;

    if (!id_student || !id_professor || !id_course || !status) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const validStatuses = ["present", "absent", "late"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado de asistencia no válido" });
    }

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    // Verificar si ya existe asistencia registrada hoy para ese estudiante en ese curso
    const yaRegistrado = await Asistance.findOne({
      where: {
        id_student,
        id_course,
        date: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    if (yaRegistrado) {
      return res.status(409).json({
        message: "Ya se registró asistencia para este estudiante hoy en este curso.",
      });
    }

    const nuevaAsistencia = await Asistance.create({
      id_student,
      id_professor: id_professor,
      id_course,
      status,
      justification,
      news,
      date: new Date(), // registramos la hora actual
    });

    res.status(201).json({
      message: "✅ Asistencia registrada exitosamente.",
      asistance: nuevaAsistencia,
    });
  } catch (error) {
    console.error("Error al crear asistencia:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

exports.updateAsistance = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_student, id_professor, date, status, justification, news } = req.body;

        const asistance = await Asistance.findByPk(id);
        if (!asistance) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        await asistance.update({
            id_student,
            id_professor,
            status,
            justification,
            news
        });

        const validStatuses = ['present', 'absent', 'late'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Estado de asistencia no válido" });
        }

        res.status(200).json({ message: "Asistencia actualizada exitosamente", asistance });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar asistencia", error: error.message });
    }
};

exports.deleteAsistance = async (req, res) => {
    try {
        const { id } = req.params;
        const asistance = await Asistance.findByPk(id);

        if (!asistance) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        await asistance.destroy();
        res.status(200).json({ message: "Asistencia eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar asistencia", error: error.message });
    }
};

exports.getAsistancesByCourseAndStatus = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const status = req.query.status;

        const asistances = await Asistance.findAll({
            where: {
                id_course: courseId,
                status: status
            },
            include: [
                {
                    model: Student,
                    attributes: ['id_student', 'firstName', 'lastName']
                }
            ]
        });

        res.status(200).json(asistances);
    } catch (error) {
        console.error("Error al obtener asistencias:", error);
        res.status(500).json({
            message: "Error al obtener asistencias",
            error: error.message
        });
    }
};

exports.getInasistenciasByProfessorCourse = async (req, res) => {
  try {
    const { id_professor, id_course } = req.params;

    const asistencias = await Asistance.findAll({
      where: {
        id_professor: id_professor,
        id_course: id_course,
        status: 'absent'
      },
      include: [{
        model: Student,
        foreignKey: 'id_student'
      }],
      order: [['date', 'DESC']]
    });

    res.status(200).json(asistencias);
  } catch (error) {
    console.error("Error al obtener inasistencias: ", error);
    res.status(500).json({ message: "Error al obtener inasistencias", error: error.message });
  }
};

exports.getAtrazosByProfessorCourse = async (req, res) => {
  try {
    const { id_professor, id_course } = req.params;

    const atrasos = await Asistance.findAll({
      where: {
        id_professor: id_professor,
        id_course: id_course,
        status: 'late'
      },
      include: [
        {
          model: Student,
          foreignKey: 'id_student'
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json(atrasos);
  } catch (error) {
    console.error("Error al obtener atrasos: ", error);
    res.status(500).json({ message: "Error al obtener atrasos", error: error.message });
  }
};

exports.checkAsistenciaDiaria = async (req, res) => {
  try {
    const { id_course, id_professor } = req.params;

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const asistencia = await Asistance.findOne({
      where: {
        id_course,
        id_professor,
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    if (asistencia) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    console.error("Error al verificar asistencia diaria:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
