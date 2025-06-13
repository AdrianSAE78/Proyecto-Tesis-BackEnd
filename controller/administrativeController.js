const Administrative = require('../model/administrativeModel');

exports.getAllAdministratives = async (req, res) => {
    try {
        let administratives = await Administrative.findAll();
        res.status(200).json(administratives);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAdministrativeById = async (req, res) => {
    try {
        let administrative = await Administrative.findByPk(req.params.id);
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
        const { firstName, lastName, email, phone, role } = req.body;
        let newAdministrative = await Administrative.create({ firstName, lastName, email, phone });
        res.status(201).json(newAdministrative);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateAdministrative = async (req, res) => {
    try {
        let administrative = await Administrative.findByPk(req.params.id);
        if (!administrative) {
            return res.status(404).json({ error: 'Administrative not found' });
        }
        const { firstName, lastName, email, phone, role } = req.body;
        await administrative.update({ firstName, lastName, email, phone, role });
        res.status(200).json(administrative);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAdministrative = async (req, res) => {
    try {
        let administrative = await Administrative.findByPk(req.params.id);
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
      },
      include: [firstName, lastName, identityCard]
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