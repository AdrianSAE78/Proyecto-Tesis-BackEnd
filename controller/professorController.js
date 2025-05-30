const Professor = require('../model/professorModel');

exports.getAllProfessors = async (req, res) => {
    try {
        let professors = await Professor.findAll();
        res.status(200).json(professors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProfessorById = async (req, res) => {
    try {
        let professor = await Professor.findByPk(req.params.id);
        if (!professor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        res.status(200).json(professor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createProfessor = async (req, res) => {
    try {
        const { firstName, lastName, identification, email, phone } = req.body;
        let newProfessor = await Professor.create({ firstName, lastName, identification, email, phone });
        res.status(201).json(newProfessor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfessor = async (req, res) => {
    try {
        let professor = await Professor.findByPk(req.params.id);
        if (!professor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        const { firstName, lastName, identification, email, phone } = req.body;
        await professor.update({ firstName, lastName, identification, email, phone });
        res.status(200).json(professor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProfessor = async (req, res) => {
    try {
        let professor = await Professor.findByPk(req.params.id);
        if (!professor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        await professor.destroy();
        res.status(200).json({ message: 'Profesor eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
