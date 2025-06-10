const Asistance = require('../model/asistanceModel');

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
        const { id_student, id_professor, date, status, justification, news } = req.body;

        // Validación básica de campos requeridos
        if (!id_student || !id_professor || !status) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }

        const validStatuses = ['present', 'absent', 'late'];
        if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Estado de asistencia no válido" });
        }

        const newAsistance = await Asistance.create({
            id_student,
            id_professor,
            status,
            justification,
            news
        });

        

        res.status(201).json({ message: "Asistencia creada exitosamente", asistance: newAsistance });
    } catch (error) {
        res.status(500).json({ message: "Error al crear asistencia", error: error.message });
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
