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

exports.createAsistance = async (req, res) => {
  try {
    const {
      id_student,
      id_professor,
      status,
      justification,
      news
    } = req.body;

    if (!id_student || !id_professor || !status) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const validStatuses = ["present", "absent", "late"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado de asistencia no válido" });
    }

    const student = await Student.findByPk(id_student);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const yaRegistrado = await Asistance.findOne({
      where: {
        id_student,
        date: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    if (yaRegistrado) {
      return res.status(409).json({
        message: "Ya se registró asistencia para este estudiante hoy.",
      });
    }

    const nuevaAsistencia = await Asistance.create({
      id_student,
      id_professor,
      status,
      justification,
      news,
      date: new Date()
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
    const { id_student, id_professor, status, justification, news } = req.body;

    const asistance = await Asistance.findByPk(id);
    if (!asistance) {
      return res.status(404).json({ message: "Asistencia no encontrada" });
    }

    const validStatuses = ['present', 'absent', 'late'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado de asistencia no válido" });
    }

    await asistance.update({
      id_student,
      id_professor,
      status,
      justification,
      news
    });

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

exports.getInasistenciasByProfessorCourse = async (req, res) => {
  try {
    const { id_professor, id_course } = req.params;

    const estudiantesCurso = await Student.findAll({ where: { id_course } });
    const idsEstudiantes = estudiantesCurso.map(e => e.id_student);

    const asistencias = await Asistance.findAll({
      where: {
        id_professor,
        id_student: { [Op.in]: idsEstudiantes },
        status: 'absent'
      },
      include: [{ model: Student }],
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

    const estudiantesCurso = await Student.findAll({ where: { id_course } });
    const idsEstudiantes = estudiantesCurso.map(e => e.id_student);

    const atrasos = await Asistance.findAll({
      where: {
        id_professor,
        id_student: { [Op.in]: idsEstudiantes },
        status: 'late'
      },
      include: [{ model: Student }],
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
    const { id_professor, id_course } = req.params;

    const estudiantesCurso = await Student.findAll({ where: { id_course } });
    const idsEstudiantes = estudiantesCurso.map(e => e.id_student);

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const asistencia = await Asistance.findOne({
      where: {
        id_professor,
        id_student: { [Op.in]: idsEstudiantes },
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    res.json(!!asistencia);
  } catch (error) {
    console.error("Error al verificar asistencia diaria:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

exports.getAsistancesByCourseAndStatus = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const status = req.query.status;

    const estudiantesCurso = await Student.findAll({ where: { id_course: courseId } });
    const idsEstudiantes = estudiantesCurso.map(e => e.id_student);

    const asistances = await Asistance.findAll({
      where: {
        id_student: { [Op.in]: idsEstudiantes },
        status
      },
      include: [{ model: Student }]
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

exports.getTodayAsistancesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { statuses } = req.query; 

    if (!statuses) {
      return res.status(400).json({ message: "Debes proporcionar al menos un status" });
    }

    const statusArray = statuses.split(',');

    const estudiantesCurso = await Student.findAll({ where: { courseId } });
    const idsEstudiantes = estudiantesCurso.map(e => e.id_student);

    const hoyInicio = moment().startOf('day').toDate();
    const hoyFin = moment().endOf('day').toDate();

    const asistencias = await Asistance.findAll({
      where: {
        id_student: { [Op.in]: idsEstudiantes },
        status: { [Op.in]: statusArray },
        date: {
          [Op.between]: [hoyInicio, hoyFin]
        }
      },
      include: [{ model: Student }]
    });

    res.status(200).json(asistencias);
  } catch (error) {
    console.error("Error al obtener asistencias del día:", error);
    res.status(500).json({ message: "Error al obtener asistencias del día", error: error.message });
  }
};

