// services/scheduleService.js
const { getSchedule, getLastScheduleUpdate } = require("../DB/getInfo") // Importation

/**
 * Récupère les emplois du temps pour une année/semaine et un groupe donné,
 * après validation des paramètres et extraction du groupe TD.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {string} dept - Département (ex: "info")
 * @param {string} train_prog - Année de formation (ex: "BUT1")
 * @param {string} groupe - Groupe complet (ex: "1A")
 * @returns {Promise<Array<Object>>} - Tableau des cours
 */
const fetchSchedules = async (year, week, dept, train_prog, groupe ) => {
  try {
    // Validation des paramètres
    if (!year || !week || !dept || !train_prog || !groupe) {
      throw new Error('Tous les paramètres sont requis');
    }
  
    const tdGroup = extractGroupe(groupe);
    
    if (!tdGroup) {
      throw new Error('Impossible d\'extraire le groupe du paramètre groupe');
    }
    
    const schedules = await getSchedule(year, week, dept, train_prog, groupe, tdGroup);

    return  schedules; // Renvoie les deux informations
  } catch (error) {
    console.error('Erreur dans fetchSchedules: ', error);
    throw error;
  }
};

/**
 * Récupère la date/heure de dernière mise à jour des cours pour une année/semaine.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @returns {Promise<any>} - Valeur renvoyée par la couche DB
 */
const fetchLastScheduleUpdate = async (year, week) => {
  try {
    if(!year || !week) {
      throw new Error('Tous les paramètres sont requis');
    }

    const lastUpdated = await getLastScheduleUpdate(year, week);

    return lastUpdated;
  } catch (error) {
    console.error('Erreur dans fetLastScheduleUpdate: ', error);
    throw error
  }
}

/**
 * Extrait le numéro de groupe (TD) d'une chaîne.
 *
 * @param {string} str - Chaîne source (ex: "1A")
 * @returns {string|null} - Numéro trouvé (ex: "1") ou null si introuvable
 */
function extractGroupe(str) {
  if (!str) return null;
  const match = str.match(/\d+/); // \d+ correspond à un ou plusieurs chiffres
  return match ? match[0] : null;
}

module.exports = {
    fetchSchedules,
    fetchLastScheduleUpdate
};
