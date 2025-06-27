const bcrypt = require('bcrypt');
const Professor = require('../model/professorModel');
const User = require('../model/userModel');
const { sendCredentialsEmail } = require('../services/emailService');

exports.getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.findAll();
    res.status(200).json(professors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id);
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

    // 1. Crear al profesor
    const newProfessor = await Professor.create({
      firstName,
      lastName,
      identification,
      email,
      phone
    });

    // 2. Preparar datos para usuario
    const userName = email.split('@')[0];  // Ej: "victor.umatambo"
    const roleId = 2; // ID del rol 'professor'
    const hashedPassword = await bcrypt.hash(identification, 10); // Contraseña hasheada

    // 3. Crear usuario asociado
    const newUser = await User.create({
      user_name: userName,
      password: hashedPassword,
      id_role: roleId,
      id_professor: newProfessor.id
    });

    // 4. Enviar correo con credenciales
    await sendCredentialsEmail(
      email,
      `${firstName} ${lastName}`,
      userName,
      identification // Mostramos la contraseña original
    );

    res.status(201).json({ professor: newProfessor, user: newUser });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id);
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
    const professor = await Professor.findByPk(req.params.id);
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
