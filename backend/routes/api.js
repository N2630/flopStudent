// routes/api.js
// routes/api.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Pas besoin de définir les paramètres dans la route ici
router.get('/get-schedules', scheduleController.getSchedules);

module.exports = router;

