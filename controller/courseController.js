const { Professor, Course } = require('../model/tableRelations');
const ProfessorCourse = require('../model/professorCourseModel');

exports.getAllCourses = async (req, res) => {
    try {
        let courses = await Course.findAll();
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCoursesByProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;

    const professor = await Professor.findByPk(professorId, {
      include: {
        model: Course,
        as: 'courses',
        through: { attributes: [] }
      }
    });

    if (!professor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    res.status(200).json(professor.courses);
  } catch (error) {
    console.error('Error al obtener cursos por profesor:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.assignCourseToProfessor = async (req, res) => {
  try {
    const { professorId, courseId } = req.body;

    if (!professorId || !courseId) {
      return res.status(400).json({ message: "Faltan parámetros necesarios" });
    }

    const exists = await ProfessorCourse.findOne({
      where: { id_professor: professorId, id_course: courseId }
    });

    if (exists) {
      return res.status(409).json({ message: "Este curso ya está asignado al profesor" });
    }

    const assignment = await ProfessorCourse.create({
      id_professor: professorId,
      id_course: courseId
    });

    res.status(201).json({ message: "Curso asignado al profesor exitosamente", assignment });
  } catch (error) {
    console.error("Error al asignar curso:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
    try {
        let { courseName, level, description } = req.body;
        let newCourse = await Course.create({ courseName, level, description });
        res.status(201).json(newCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const { courseName, level, description } = req.body;
        await course.update({ courseName, level, description });
        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        await course.destroy();
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
