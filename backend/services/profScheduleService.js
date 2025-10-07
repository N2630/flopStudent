const { getProfSchedule } = require("../DB/getInfo") // Importation

/**
 * Récupère les emplois du temps pour une année/semaine et un professeur donné.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {string} profDet - Initiales du professeur (ex: "TA")
 * @returns {Promise<Array<Object>>} - Tableau des cours
 */
const fetchProfSchedules = async (year, week, profDet ) => {
    try {
      // Validation des paramètres
      if (!year || !week || !profDet) {
        throw new Error('Année, semaine et initiales du professeur sont requis.');
      }
    
      const profEdt = await getProfSchedule(year, week, profDet);
  
      return  profEdt; // Renvoie les deux informations
    } catch (error) {
      console.error('Erreur dans fetchSchedules: ', error);
      throw error;
    }
};

module.exports = {
  fetchProfSchedules
};