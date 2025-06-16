const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Role = require('../model/roleModel');
require('dotenv').config();

const register = async (req, res) => {
    const { user_name, password, role_name, id_administrative, id_professor, id_representative } = req.body;
  
    try {
      const existingUser = await User.findOne({ where: { user_name } });
      if (existingUser) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const role = await Role.findOne({ where: { role_name } });
      if (!role) return res.status(400).json({ message: 'Rol no válido' });
  
      const newUser = await User.create({
        user_name,
        password: hashedPassword,
        id_role: role.id_role,
        id_administrative: role_name === 'administrative' ? id_administrative : null,
        id_professor: role_name === 'professor' ? id_professor : null,
        id_representative: role_name === 'legalRepresentative' ? id_representative : null
      });
  
      return res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  };
  

module.exports = { register };
