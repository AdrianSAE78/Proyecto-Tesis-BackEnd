const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const Role = require('../model/roleModel');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const user = await User.findOne({
      where: { user_name },
      include: {
        model: Role,
        as: 'role',
        attributes: ['role_name']
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    let roleId = null;

    switch (user.role.role_name) {
      case 'administrative':
        roleId = user.id_administrative;
        break;
      case 'professor':
        roleId = user.id_professor;
        break;
      case 'legalRepresentative':
        roleId = user.id_representative;
        break;
    }

    const tokenPayload = {
      id_user: user.id_user,
      user_name: user.user_name,
      role: user.role.role_name,
      roleId
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '2h' });

    return res.json({
      token,
      user: tokenPayload
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { login };
