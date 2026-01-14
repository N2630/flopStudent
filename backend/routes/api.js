// routes/api.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const freeRoomsController = require('../controllers/freeRoomsController')
const profsController = require('../controllers/profsController');
const settingsController = require('../controllers/settingsController');
const roomsController = require('../controllers/roomsController');

router.get('/get-schedules', scheduleController.getSchedules);
router.get('/get-last-schedules-update', scheduleController.getSchedulesLastUpdate);
router.get('/get-free-rooms', freeRoomsController.getFreeRoomsByWeek);

// Routes pour les info professeurs
router.get('/get-prof-schedule', profsController.getProfSchedule);
router.get('/get-all-profs', profsController.getAllProfs);

// Routes pour les info salles
router.get('/get-room-schedule', roomsController.getRoomSchedule);
router.get('/get-all-rooms', roomsController.getAllRooms);

// Routes pour les paramètres
router.get('/get-departments', settingsController.getDepartments);
router.get('/get-train-progs', settingsController.getTrainProgs);
router.get('/get-groups', settingsController.getGroups);

module.exports = router;

