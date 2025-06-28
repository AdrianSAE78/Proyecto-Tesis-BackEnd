const { ProfessorCourse, Professor, Course, User } = require('../model/tableRelations');

// Obtener todas las asignaciones
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await ProfessorCourse.findAll({
      include: [
        {
          model: Professor,
          include: { model: User, attributes: ['user_name'] } // Incluir User sin alias
        },
        { model: Course, as: 'course' }
      ]
    });
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener asignaciones', error: error.message });
  }
};

// Obtener asignaciones por ID de profesor
exports.getAssignmentsByProfessorId = async (req, res) => {
  try {
    const { id_professor } = req.params;

    const assignments = await ProfessorCourse.findAll({
      where: { id_professor },
      include: [
        {
          model: Professor,
          as: 'professor',
          include: { model: User, attributes: ['user_name'] }
        },
        { model: Course, as: 'course' }
      ]
    });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron asignaciones para este profesor' });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener asignaciones del profesor', error: error.message });
  }
};


// Asignar curso a profesor
exports.assignCourseToProfessor = async (req, res) => {
  try {
    const { id_professor, id_course } = req.body;

    // Verificar si el profesor existe
    const professor = await Professor.findByPk(id_professor);
    if (!professor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    // Crear la asignación del curso al profesor
    const newAssignment = await ProfessorCourse.create({ id_professor, id_course });

    res.status(201).json({ message: 'Curso asignado correctamente', data: newAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al asignar curso', error: error.message });
  }
};
