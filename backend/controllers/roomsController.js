const roomScheduleService = require('../services/roomScheduleService');
const roomsDetailsService = require('../services/roomsDetailsService');


/**
 * Contrôleur HTTP: retourne les l'emplois du temps d'un professeur pour une année/semaine et ses initiales
 * Lit les paramètres depuis req.query et gère les erreurs/validations.
 *
 * @param {import('express').Request} req - Requête Express (query: year, week, profDet)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getRoomSchedule = async (req, res) => {
  try {
    const { year, week, room } = req.query;

    if (!year || !week || !room) {
      return res.status(400).json({ message: 'Année, semaine et salle sont requis.' });
    }
    
    const roomSchedule = await roomScheduleService.fetchRoomSchedules(year, week, room);
    res.json(roomSchedule);
  } catch (error) {
    console.error('Erreur dans getRoomSchedule:', error);
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
const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomsDetailsService.fetchAllRooms();
    res.json(rooms);
  } catch (error) {
    console.error('Erreur dans getAllRooms:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

module.exports = {
  getRoomSchedule,
  getAllRooms
};
