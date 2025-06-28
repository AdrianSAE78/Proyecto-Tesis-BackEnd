const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Administrative, User, Student } = require('../model/tableRelations');
const { sendCredentialsEmail } = require('../services/emailService');

exports.getAllAdministratives = async (req, res) => {
  try {
    const administratives = await Administrative.findAll();
    res.status(200).json(administratives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAdministrativeById = async (req, res) => {
  try {
    const administrative = await Administrative.findByPk(req.params.id);
    if (!administrative) {
      return res.status(404).json({ error: 'Administrative not found' });
    }
    res.status(200).json(administrative);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.createAdministrative = async (req, res) => {
  try {
    const { firstName, lastName, identification, email, phone } = req.body;

    // 1. Crear al administrativo
    const newAdministrative = await Administrative.create({
      firstName,
      lastName,
      identification,
      email,
      phone
    });

    // 2. Preparar datos para el usuario
    const userName = email.split('@')[0];
    const roleId = 1; // ID del rol 'administrative'
    const hashedPassword = await bcrypt.hash(identification, 10);

    // 3. Crear usuario
    const newUser = await User.create({
      user_name: userName,
      password: hashedPassword,
      id_role: roleId,
    });

    // 4. Asociar el administrativo con el usuario
    await newAdministrative.update({ id_user: newUser.id_user });

    // 5. Enviar correo con credenciales
    await sendCredentialsEmail(
      email,
      `${firstName} ${lastName}`,
      userName,
      identification
    );

    res.status(201).json({ administrative: newAdministrative, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdministrative = async (req, res) => {
  try {
    const administrative = await Administrative.findByPk(req.params.id);
    if (!administrative) {
      return res.status(404).json({ error: 'Administrative not found' });
    }

    const { firstName, lastName, identification, email, phone } = req.body;
    await administrative.update({ firstName, lastName, identification, email, phone });

    // 6. Actualizar los datos del usuario asociado
    const user = await User.findByPk(administrative.id_user);
    if (user) {
      await user.update({
        user_name: email.split('@')[0], // Actualiza el nombre de usuario (por ejemplo, con el email)
        password: user.password, // Mantener la misma contraseña
      });
    }

    res.status(200).json(administrative);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdministrative = async (req, res) => {
  try {
    const administrative = await Administrative.findByPk(req.params.id);
    if (!administrative) {
      return res.status(404).json({ error: 'Administrative not found' });
    }

    await administrative.destroy();
    res.status(200).json({ message: 'Administrative deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.validateQRToken = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const estudiante = await Student.findOne({
      where: {
        id_student: decoded.idEst,
        id_legal_representative: decoded.parentId
      }
    });

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    return res.json({
      valid: true,
      student: estudiante,
      parentId: decoded.parentId
    });
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
