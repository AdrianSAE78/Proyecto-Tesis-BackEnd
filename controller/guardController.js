const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

const { sendCredentialsEmail } = require("../services/emailService");

const {
  Guard,
  User,
  Student
} = require("../model/tableRelations");

exports.getAllGuards = async (req, res) => {
  try {
    const reps = await Guard.findAll();
    console.log("✅ Guardias encontrados:", reps);
    res.status(200).json(reps);
  } catch (error) {
    console.error("❌ ERROR EN GET ALL GUARDS:", error);
    res.status(500).json({
      message: "Error al obtener guardias",
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.getGuardById = async (req, res) => {
  try {
    const guard = await Guard.findByPk(req.params.id);
    if (!guard) {
      return res
        .status(404)
        .json({ error: "guardia no encontrado" });
    }
    res.status(200).json(guard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.createGuard = async (req, res) => {
  try {
    console.log("📥 Datos recibidos para guardia:", req.body);
    const { firstName, lastName, identification, phone, email } = req.body;

    // 1. Crear representante
    const newGuard = await Guard.create({
      firstName,
      lastName,
      identification,
      phone,
      email
    });

    // 2. Preparar credenciales de usuario
    const userName = email.split('@')[0];
    const hashedPassword = await bcrypt.hash(identification, 10);
    const roleId = 4;

    // 3. Crear usuario asociado
    const newUser = await User.create({
      user_name: userName,
      password: hashedPassword,
      id_role: roleId,
    });

    // 4. Asociar el representante legal con el usuario (usando id_user)
    await newGuard.update({ id_user: newUser.id_user });

    // 5. Enviar correo con credenciales
    await sendCredentialsEmail(
      email,
      `${firstName} ${lastName}`,
      userName,
      identification
    );

    console.log("📤 Enviando al frontend:", {
      id_guard: newGuard.id_guard,
      guard: newGuard,
      user: newUser
    });

    res.status(201).json({
      id_guard: newGuard.id_guard,
      guard: newGuard,
      user: newUser
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateGuard = async (req, res) => {
  try {
    const guard = await Guard.findByPk(req.params.id);
    if (!guard) {
      return res
        .status(404)
        .json({ error: "Guardia no encontrado" });
    }
    const { firstName, lastName, identification, phone, email } = req.body;
    await guard.update({
      firstName,
      lastName,
      identification,
      phone,
      email
    });

    // 6. Actualizar los datos del usuario asociado
    const user = await User.findByPk(guard.id_user);
    if (user) {
      await user.update({
        user_name: email.split('@')[0], // Actualiza el nombre de usuario (por ejemplo, con el email)
        password: user.password, // Mantener la misma contraseña
      });
    }

    res.status(200).json(guard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGuard = async (req, res) => {
  try {
    const guard = await Guard.findByPk(req.params.id);
    if (!guard) {
      return res
        .status(404)
        .json({ error: "Guardia no encontrado" });
    }
    await guard.destroy();
    res
      .status(200)
      .json({ message: "Guardia eliminado correctamente" });
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