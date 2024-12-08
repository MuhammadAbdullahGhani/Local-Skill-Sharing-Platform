const express = require('express');
const router = express.Router();
const skillController = require('../controller/skillController');

// Routes for skill management
router.get('/', skillController.getSkills);
router.post('/', skillController.createSkill);
router.put('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;
