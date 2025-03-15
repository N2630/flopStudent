// controllers/scheduleController.js
const scheduleService = require('../services/scheduleService');

exports.getSchedules = async (req, res) => {
  try {
    const { year, week, dept, train_prog, groupe } = req.query;
    const schedules = await scheduleService.fetchSchedules(year, week, dept, train_prog, groupe);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
};
