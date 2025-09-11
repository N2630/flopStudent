const { calculateFreeRooms } = require('../utils/calculateFreeRooms');

/**
 * Récupère les salles libres pour une année/semaine et un département,
 * en s'appuyant sur le calcul utilitaire.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {string} dept - Département (clé dans config/freeRooms.json)
 * @returns {Promise<{salles: Record<string, Record<string, string[]>>, lastUpdated: Date}>}
 */
const fetchFreeRooms = async (year, week, dept) => {
    try {
        const result = await calculateFreeRooms(year, week, dept);
        return { salles: result, lastUpdated: new Date() };
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        throw error;
    }
};

module.exports = {
    fetchFreeRooms
};