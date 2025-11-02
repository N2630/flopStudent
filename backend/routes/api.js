// routes/api.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const freeRoomsController = require('../controllers/freeRoomsController')
const profsController = require('../controllers/profsController');
const settingsController = require('../controllers/settingsController');

router.get('/get-schedules', scheduleController.getSchedules);
router.get('/get-last-schedules-update', scheduleController.getSchedulesLastUpdate);
router.get('/get-free-rooms', freeRoomsController.getFreeRoomsByWeek);
router.get('/get-prof-schedule', profsController.getProfSchedule);
router.get('/get-profs', profsController.getAllProfs);

// Routes pour les paramètres
router.get('/get-departments', settingsController.getDepartments);
router.get('/get-train-progs', settingsController.getTrainProgs);
router.get('/get-groups', settingsController.getGroups);

module.exports = router;

