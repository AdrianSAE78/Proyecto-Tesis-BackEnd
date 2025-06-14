const LegalRepresentative = require("../model/legalRepresentativeModel");
const {
  Student,
  Asistance,
  Incident,
  Professor,
} = require("../model/tableRelations");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");

exports.getAllLegalRepresentatives = async (req, res) => {
  try {
    const reps = await LegalRepresentative.findAll();
    console.log("✅ Representantes encontrados:", reps);
    res.status(200).json(reps);
  } catch (error) {
    console.error("❌ ERROR EN GET ALL REPRESENTATIVES:", error);
    res.status(500).json({
      message: "Error al obtener representantes",
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.getLegalRepresentativeById = async (req, res) => {
  try {
    let representative = await LegalRepresentative.findByPk(req.params.id);
    if (!representative) {
      return res
        .status(404)
        .json({ error: "Representante legal no encontrado" });
    }
    res.status(200).json(representative);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.createLegalRepresentative = async (req, res) => {
  try {
    console.log("📥 Datos recibidos para representante legal:", req.body);
    const { firstName, lastName, identification, phone, email, address } =
      req.body;
    let newRepresentative = await LegalRepresentative.create({
      firstName,
      lastName,
      identification,
      phone,
      email,
      address,
    });
    res.status(201).json(newRepresentative);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLegalRepresentative = async (req, res) => {
  try {
    let representative = await LegalRepresentative.findByPk(req.params.id);
    if (!representative) {
      return res
        .status(404)
        .json({ error: "Representante legal no encontrado" });
    }
    const { firstName, lastName, identification, phone, email, address } =
      req.body;
    await representative.update({
      firstName,
      lastName,
      identification,
      phone,
      email,
      address,
    });
    res.status(200).json(representative);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLegalRepresentative = async (req, res) => {
  try {
    let representative = await LegalRepresentative.findByPk(req.params.id);
    if (!representative) {
      return res
        .status(404)
        .json({ error: "Representante legal no encontrado" });
    }
    await representative.destroy();
    res
      .status(200)
      .json({ message: "Representante legal eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentsByRepresentative = async (req, res) => {
  try {
    const { id } = req.params;

    const representative = await LegalRepresentative.findByPk(id);
    if (!representative) {
      return res.status(404).json({
        message: "Representante legal no encontrado",
        searchedId: id,
      });
    }

    const students = await Student.findAll({
      where: { id_legal_representative: id },
      raw: false,
    });

    const formattedStudents = students.map((student) => ({
      id_student: student.id_student,
      id: student.id_student,
      first_name: student.firstName,
      last_name: student.lastName,
      grade: student.id_course,
      identification: student.identityCard,
      birth_date: student.birthDate,
      id_legal_representative: student.id_legal_representative,
    }));

    return res.status(200).json(formattedStudents);
  } catch (error) {
    console.error("ERROR en getStudentsByRepresentative:", error);
    return res.status(500).json({
      message: "Error al obtener estudiantes",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

exports.generateQR = async (req, res) => {
  try {
    const { id, idEst } = req.params;

    const estudiante = await Student.findOne({
      where: { id_student: idEst, id_legal_representative: id },
    });

    if (!estudiante) {
      return res
        .status(404)
        .json({ message: "Estudiante no asociado a este representante" });
    }

    const token = jwt.sign(
      { idEst, parentId: id, timestamp: Date.now() },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );

    const url = `${process.env.FRONTEND_URL}/retirar-estudiante/${idEst}?token=${token}`;
    const qr = await QRCode.toDataURL(url);

    console.log("QR generado exitosamente");

    return res.json({ qr, url });
  } catch (err) {
    console.error("Error generando QR:", err);
    return res
      .status(500)
      .json({ message: "Error generando el QR", error: err.message });
  }
};

exports.getAsistance = async (req, res) => {
  try {
    const { id, idEst } = req.params;

    const estudiante = await Student.findOne({
      where: { id_student: idEst, id_legal_representative: id },
    });

    if (!estudiante) {
      return res
        .status(404)
        .json({ message: "Estudiante no asociado a este representante" });
    }

    const asistencias = await Asistance.findAll({
      where: { id_student: idEst },
      include: [
        {
          model: Student,
          as: "asistedStudent",
          attributes: ["firstName", "lastName", "id_course"],
        },
        {
          model: Professor,
          as: "asistanceProfessor",
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [["date", "DESC"]],
    });

    const formatted = asistencias.map((a) => ({
      id: a.id_asistance,
      date: a.date,
      status: a.status,
      notes: a.news || "",
      justification: a.justification || "",
      studentName: `${a.student?.firstName || ""} ${
        a.student?.lastName || ""
      }`.trim(),
      grade: a.student?.id_course || "",
      professor: a.professor
        ? `${a.professor.firstName} ${a.professor.lastName}`
        : "N/A",
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error obteniendo asistencias:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener asistencias", error: error.message });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const { id, idEst } = req.params;

    const estudiante = await Student.findOne({
      where: { id_student: idEst, id_legal_representative: id },
    });

    if (!estudiante) {
      return res
        .status(404)
        .json({ message: "Estudiante no asociado a este representante" });
    }

    const incidencias = await Incident.findAll({
      where: { id_student: idEst },
    });
    return res.json(incidencias);
  } catch (error) {
    console.error("Error obteniendo incidencias:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener incidencias", error: error.message });
  }
};
