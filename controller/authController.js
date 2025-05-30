const User = require('../model/userModel');
const Role = require('../model/roleModel');

const login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const user = await User.findOne({
      where: { user_name},
      include: {
        model: Role,
        as: 'role',
        attributes: ['role_name']
      }
    });

    // Si no existe
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseña (sin encriptar aún)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Todo correcto: devolver usuario
    return res.json({
      id_user: user.id_user,
      user_name: user.user_name,
      role: user.role.role_name
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { login };
