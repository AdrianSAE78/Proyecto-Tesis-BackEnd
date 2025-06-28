const bcrypt = require('bcrypt');
const { User, Role, Administrative, Professor, LegalRepresentative } = require('../model/tableRelations');

exports.getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll({
            include: {
                model: Role,
                as: 'role',
                attributes: ['role_name']
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findByPk(id, {
            include: {
                model: Role,
                as: 'role',
                attributes: ['role_name']
            }
        });
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

        // Verificar que el rol es válido
        const role = await Role.findOne({ where: { role_name: rol } });
        if (!role) return res.status(400).json({ message: "Rol no válido" });

        if ((rol === 'administrative' && !id_administrative) ||
            (rol === 'professor' && !id_professor) ||
            (rol === 'legalRepresentative' && !id_legal_representative)) {
            return res.status(400).json({ message: "Debe proporcionar un ID válido según el rol seleccionado." });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await User.create({
            user_name,
            password: hashedPassword,
            id_role: role.id_role,
        });

        // Asociar el usuario con el modelo correspondiente según el rol
        if (rol === 'administrative') {
            await Administrative.create({
                id_user: newUser.id_user, // Asociamos al administrativo con el usuario
                id_administrative
            });
        } else if (rol === 'professor') {
            await Professor.create({
                id_user: newUser.id_user, // Asociamos al profesor con el usuario
                id_professor
            });
        } else if (rol === 'legalRepresentative') {
            await LegalRepresentative.create({
                id_user: newUser.id_user, // Asociamos al representante legal con el usuario
                id_representative: id_legal_representative
            });
        }

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

        const role = await Role.findOne({ where: { role_name: rol } });
        if (!role) return res.status(400).json({ message: "Rol no válido" });

        await user.update({
            user_name,
            password: password ? await bcrypt.hash(password, 10) : user.password,
            id_role: role.id_role,
        });

        // Actualizar la relación con el modelo correspondiente según el rol
        if (rol === 'administrative') {
            await Administrative.update(
                { id_administrative },
                { where: { id_user: user.id_user } }
            );
        } else if (rol === 'professor') {
            await Professor.update(
                { id_professor },
                { where: { id_user: user.id_user } }
            );
        } else if (rol === 'legalRepresentative') {
            await LegalRepresentative.update(
                { id_representative: id_legal_representative },
                { where: { id_user: user.id_user } }
            );
        }

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
