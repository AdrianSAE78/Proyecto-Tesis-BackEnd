const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const newsController = require('../controller/newsController');

router.post('/', newsController.createNews);
router.get('/', newsController.getAllNews);
router.get('/active/:role', newsController.getActiveNewsByRole);
router.get('/:id', newsController.getNewsById);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.DeleteNews);

module.exports = router;