const Role = require('../model/roleModel');

const roleController = {
  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = roleController;
