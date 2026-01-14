const { getRoomSchedule } = require("../DB/getInfo") // Importation

/**
 * Récupère les emplois du temps pour une année/semaine et un professeur donné.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {string} room - Nom de la salle (ex: "B104")
 * @returns {Promise<Array<Object>>} - Tableau des cours
 */
const fetchRoomSchedules = async (year, week, room ) => {
    try {
      // Validation des paramètres
      if (!year || !week || !room) {
        throw new Error('Année, semaine et salle sont requis.');
      }
    
      const roomEdt = await getRoomSchedule(year, week, room);
  
      return  roomEdt; // Renvoie les deux informations
    } catch (error) {
      console.error('Erreur dans fetchSchedules: ', error);
      throw error;
    }
};

module.exports = {
  fetchRoomSchedules
};