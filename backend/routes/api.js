// routes/api.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Correction ici : passez la référence de la fonction sans l'appeler
router.get('/get-schedules', scheduleController.getSchedules);

module.exports = router;
