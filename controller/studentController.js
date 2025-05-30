const Student = require('../model/studentModel');

exports.getAllStudents = async (req, res) => {
    try {
        let students = await Student.findAll();
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        let student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { firstName, lastName, birthDate, identityCard, status, id_course, id_representative } = req.body;
        let newStudent = await Student.create({ firstName, lastName, birthDate, identityCard, status, id_course, id_representative });
        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        let student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const { firstName, lastName, birthDate, identityCard, status, id_course, id_representative } = req.body;
        await student.update({ firstName, lastName, birthDate, identityCard, status, id_course, id_representative });
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        let student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        await student.destroy();
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
