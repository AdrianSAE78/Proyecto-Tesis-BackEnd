const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');

router.get('/roles', roleController.getAllRoles);

module.exports = router;
