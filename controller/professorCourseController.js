const ProfessorCourse = require('../model/professorCourseModel');
const { Professor, Course } = require('../model/tableRelations');

// Obtener todas las asignaciones
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await ProfessorCourse.findAll({
      include: [
        { model: Professor, as: 'professor' },
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
        { model: Professor, as: 'professor' },
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

    const newAssignment = await ProfessorCourse.create({ id_professor, id_course });

    res.status(201).json({ message: 'Curso asignado correctamente', data: newAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al asignar curso', error: error.message });
  }
};
