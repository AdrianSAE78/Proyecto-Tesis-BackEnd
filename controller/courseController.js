const Course = require('../model/courseModel');

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
    let { professorId } = req.params;

    let courses = await Course.findAll({
      where: { id_professor: professorId }
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cursos del profesor', error: error.message });
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
