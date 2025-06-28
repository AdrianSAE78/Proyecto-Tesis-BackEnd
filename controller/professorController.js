const bcrypt = require('bcrypt');
const { Professor, User, ProfessorCourse } = require('../model/tableRelations');
const { sendCredentialsEmail } = require('../services/emailService');

exports.getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.findAll({
      include: [
        {
          model: User,  // Incluir User sin alias
          attributes: ['user_name']  // Si necesitas los datos del usuario
        }
      ]
    });
    res.status(200).json(professors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id, {
      include: [
        {
          model: User,  // Incluir User sin alias
          attributes: ['user_name']  // Si necesitas los datos del usuario
        }
      ]
    });
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
    const { firstName, lastName, identification, email, phone, courseIds } = req.body;

    // 1. Crear al profesor
    const newProfessor = await Professor.create({
      firstName,
      lastName,
      identification,
      email,
      phone
    });

    // 2. Preparar datos para el usuario
    const userName = email.split('@')[0];  // Ej: "victor.umatambo"
    const roleId = 2; // ID del rol 'professor'
    const hashedPassword = await bcrypt.hash(identification, 10); // Contraseña hasheada

    // 3. Crear usuario asociado
    const newUser = await User.create({
      user_name: userName,
      password: hashedPassword,
      id_role: roleId,
    });

    // 4. Relacionar el User con el Professor (Actualizar el id_user en el profesor)
    await newProfessor.update({ id_user: newUser.id_user });

    // 4.1 Asignar cursos si se proporcionan
    if (Array.isArray(courseIds)) {
      const assignments = courseIds.map(id_course => ({
        id_professor: newProfessor.id_professor,
        id_course
      }));
      await ProfessorCourse.bulkCreate(assignments);
    }

    // 5. Enviar correo con credenciales
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

    // 6. Actualizar los datos del usuario asociado
    const user = await User.findByPk(professor.id_user);
    if (user) {
      await user.update({
        user_name: email.split('@')[0], // Actualiza el nombre de usuario (por ejemplo, con el email)
        password: user.password, // Mantener la misma contraseña
      });
    }

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
