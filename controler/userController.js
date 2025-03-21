const User = require('../model/userModel'); 
// const tableRelations = require('../model/tableRelations');

exports.getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        let { user_name, password, rol, id_administrative, id_professor, id_legal_representative } = req.body;

        if ((rol === 'administrador' && !id_administrative) ||
            (rol === 'profesor' && !id_professor) ||
            (rol === 'representante' && !id_legal_representative)) {
            return res.status(400).json({ message: "Debe proporcionar un ID válido según el rol seleccionado." });
        }

        let newUser = await User.create({
            user_name,
            password,
            rol,
            id_administrative,
            id_professor,
            id_legal_representative
        });

        res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let { user_name, password, rol, id_administrative, id_professor, id_legal_representative } = req.body;

        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({
            user_name,
            password,
            rol,
            id_administrative,
            id_professor,
            id_legal_representative
        });

        res.status(200).json({ message: "Usuario actualizado exitosamente", user });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.destroy();
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
};