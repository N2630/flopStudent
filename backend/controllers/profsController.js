const profScheduleService = require('../services/profScheduleService');
const profsDetailsService = require('../services/profsDetailsService');


/**
 * Contrôleur HTTP: retourne les l'emplois du temps d'un professeur pour une année/semaine et ses initiales
 * Lit les paramètres depuis req.query et gère les erreurs/validations.
 *
 * @param {import('express').Request} req - Requête Express (query: year, week, profDet)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getProfSchedule = async (req, res) => {
  try {
    const { year, week, profDet } = req.query;

    if (!year || !week || !profDet) {
      return res.status(400).json({ message: 'Année, semaine et initiales du professeur sont requis.' });
    }
    
    const profSchedule = await profScheduleService.fetchProfSchedules(year, week, profDet);
    res.json(profSchedule);
  } catch (error) {
    console.error('Erreur dans getProfSchedule:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

/**
 * Contrôleur HTTP: retourne les l'emplois du temps d'un professeur pour une année/semaine et ses initiales
 * Lit les paramètres depuis req.query et gère les erreurs/validations.
 *
 * @param {import('express').Request} req - Requête Express (query: year, week, profDet)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getAllProfs = async (req, res) => {
  try {
    const { dept } = req.query;

    const profs = await profsDetailsService.fetchAllProfs(dept);
    res.json(profs);
  } catch (error) {
    console.error('Erreur dans getAllProfs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

module.exports = {
  getProfSchedule,
  getAllProfs
};
