// routes/api.js
// routes/api.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const freeRoomsController = require('../controllers/freeRoomsController')

// Pas besoin de définir les paramètres dans la route ici
router.get('/get-schedules', scheduleController.getSchedules);
router.get('/get-free-rooms', freeRoomsController.getFreeRoomsByWeek)

module.exports = router;

