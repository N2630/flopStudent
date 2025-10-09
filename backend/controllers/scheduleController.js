const scheduleService = require('../services/scheduleService');

/**
 * Contrôleur HTTP: retourne les emplois du temps filtrés par année, semaine, département, formation et groupe.
 * Valide les paramètres requis et délègue au service.
 *
 * @param {import('express').Request} req - Requête Express (query: year, week, dept, train_prog, groupe)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
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

/**
 * Contrôleur HTTP: retourne la date/heure de dernière mise à jour des emplois du temps pour une année/semaine.
 *
 * @param {import('express').Request} req - Requête Express (query: year, week)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getSchedulesLastUpdate = async (req, res) => {
  try {
    const { year, week} = req.query;

    if(!year || !week){
      return res.status(400).json({ 
        message: 'Paramètres manquants', 
        required: ['year', 'week'],
        received: { year, week}
      });
    }

    const lastUpdated = await scheduleService.fetchLastScheduleUpdate(year, week);
    res.json(lastUpdated);
  } catch (error) {
    console.error('Erreur dans getSchedules:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
}
module.exports = {
    getSchedules,
    getSchedulesLastUpdate
};
