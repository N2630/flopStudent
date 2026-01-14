const { getAllRooms } = require("../DB/getInfo") // Importation

/**
 * Récupère les emplois du temps pour une année/semaine et un professeur donné.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {string} profDet - Initiales du professeur (ex: "TA")
 * @returns {Promise<Array<Object>>} - Tableau des cours
 */
const fetchAllRooms = async () => {
    try {

        const rooms = await getAllRooms();
        return rooms;
    } catch (error) {
      console.error('Erreur dans fetchSchedules: ', error);
      throw error;
    }
};

module.exports = {
  fetchAllRooms,
};