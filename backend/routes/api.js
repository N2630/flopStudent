// routes/api.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const freeRoomsController = require('../controllers/freeRoomsController')
const profScheduleController = require('../controllers/profScheduleController');

router.get('/get-schedules', scheduleController.getSchedules);
router.get('/get-last-schedules-update', scheduleController.getSchedulesLastUpdate);
router.get('/get-free-rooms', freeRoomsController.getFreeRoomsByWeek);
router.get('/get-prof-schedule', profScheduleController.getProfSchedule);

module.exports = router;

