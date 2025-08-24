const scheduleService = require('../services/scheduleService');

const getSchedules = async (req, res) => {
  try {
    const { year, week, dept, train_prog, groupe } = req.query;
    
    // Validation des paramètres requis
    if (!year || !week || !dept || !train_prog || !groupe) {
      return res.status(400).json({ 
        message: 'Paramètres manquants', 
        required: ['year', 'week', 'dept', 'train_prog', 'groupe'],
        received: { year, week, dept, train_prog, groupe }
      });
    }
    
    const schedules = await scheduleService.fetchSchedules(year, week, dept, train_prog, groupe);
    res.json(schedules);
  } catch (error) {
    console.error('Erreur dans getSchedules:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

module.exports = {
    getSchedules
};
