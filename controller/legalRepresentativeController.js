const LegalRepresentative = require('../model/legalRepresentativeModel');

exports.getAllLegalRepresentatives = async (req, res) => {
    try {
      const reps = await LegalRepresentative.findAll();
      console.log('✅ Representantes encontrados:', reps); // Debug
      res.status(200).json(reps);
    } catch (error) {
      console.error('❌ ERROR EN GET ALL REPRESENTATIVES:', error); // Debug fuerte
      res.status(500).json({
        message: 'Error al obtener representantes',
        error: error.message,
        stack: error.stack,
      });
    }
  };
  


exports.getLegalRepresentativeById = async (req, res) => {
    try {
        let representative = await LegalRepresentative.findByPk(req.params.id);
        if (!representative) {
            return res.status(404).json({ error: 'Representante legal no encontrado' });
        }
        res.status(200).json(representative);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createLegalRepresentative = async (req, res) => {
    try {
        console.log('📥 Datos recibidos para representante legal:', req.body); 
        const { firstName, lastName, identification, phone, email, address } = req.body;
        let newRepresentative = await LegalRepresentative.create({ firstName, lastName, identification, phone, email, address });
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
            return res.status(404).json({ error: 'Representante legal no encontrado' });
        }
        const { firstName, lastName, identification, phone, email, address } = req.body;
        await representative.update({ firstName, lastName, identification, phone, email, address });
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
            return res.status(404).json({ error: 'Representante legal no encontrado' });
        }
        await representative.destroy();
        res.status(200).json({ message: 'Representante legal eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
