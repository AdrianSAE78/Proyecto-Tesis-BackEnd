const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../model/userModel');
const Role = require('../model/roleModel');
const Administrative = require('../model/administrativeModel');
const Professor = require('../model/professorModel');
const LegalRepresentative = require('../model/legalRepresentativeModel');

const SECRET_KEY = process.env.SECRET_KEY;

// LOGIN
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

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    let roleId = null;
    let firstName = null;
    let lastName = null;
    let email = null;

    switch (user.role.role_name) {
      case 'administrative':
        const admin = await Administrative.findByPk(user.id_administrative);
        if (admin) {
          roleId = admin.id_administrative;
          firstName = admin.firstName;
          lastName = admin.lastName;
          email = admin.email;
        }
        break;
      case 'professor':
        const prof = await Professor.findByPk(user.id_professor);
        if (prof) {
          roleId = prof.id_professor;
          firstName = prof.firstName;
          lastName = prof.lastName;
          email = prof.email;
        }
        break;
      case 'legalRepresentative':
        const parent = await LegalRepresentative.findByPk(user.id_representative);
        if (parent) {
          roleId = parent.id_representative;
          firstName = parent.firstName;
          lastName = parent.lastName;
          email = parent.email;
        }
        break;
    }

    const tokenPayload = {
      id_user: user.id_user,
      user_name: user.user_name,
      role: user.role.role_name,
      roleId,
      firstName,
      lastName,
      email
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '2h' });

    return res.json({ token, user: tokenPayload });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

// REGISTER (usando id_role directamente)
const register = async (req, res) => {
  const {
    user_name,
    password,
    id_role,
    id_administrative,
    id_professor,
    id_representative
  } = req.body;

  try {
    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await Role.findOne({ where: { id_role } });
    if (!role) return res.status(400).json({ message: 'Rol no válido' });

    const userPayload = {
      user_name,
      password: hashedPassword,
      id_role,
      id_administrative: null,
      id_professor: null,
      id_representative: null
    };

    switch (role.role_name) {
      case 'administrative':
        userPayload.id_administrative = id_administrative;
        break;
      case 'professor':
        userPayload.id_professor = id_professor;
        break;
      case 'legalRepresentative':
        userPayload.id_representative = id_representative;
        break;
      default:
        return res.status(400).json({ message: 'Rol no reconocido' });
    }

    const newUser = await User.create(userPayload);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { login, register };
