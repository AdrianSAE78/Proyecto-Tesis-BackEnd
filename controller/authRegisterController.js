const bcrypt = require('bcrypt');
const { User, Role, Administrative, Professor, LegalRepresentative } = require('../model/tableRelations');
require('dotenv').config();

const register = async (req, res) => {
  const { user_name, password, role_name, id_administrative, id_professor, id_representative } = req.body;
  
  try {
    // Verificar si el nombre de usuario ya existe
    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el rol existe
    const role = await Role.findOne({ where: { role_name } });
    if (!role) return res.status(400).json({ message: 'Rol no válido' });

    // Crear el nuevo usuario
    const newUser = await User.create({
      user_name,
      password: hashedPassword,
      id_role: role.id_role,
    });

    // Asociar el usuario con el modelo correspondiente según el rol
    if (role_name === 'administrative') {
      await Administrative.create({
        id_user: newUser.id_user,
        id_administrative,
      });
    } else if (role_name === 'professor') {
      await Professor.create({
        id_user: newUser.id_user,
        id_professor,
      });
    } else if (role_name === 'legalRepresentative') {
      await LegalRepresentative.create({
        id_user: newUser.id_user,
        id_representative,
      });
    }

    return res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });

  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { register };
