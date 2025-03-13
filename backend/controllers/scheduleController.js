const scheduleService = require('../services/scheduleService');

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.fetchSchedules();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
};
