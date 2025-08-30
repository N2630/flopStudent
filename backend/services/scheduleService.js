// services/scheduleService.js
const { getSchedule, getLastScheduleUpdate } = require("../DB/getInfo") // Importation

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
    const lastUpdated = await getLastScheduleUpdate(year, week); // Récupérer le timestamp

    return { schedules: schedules, lastUpdated: lastUpdated }; // Renvoie les deux informations
  } catch (error) {
    console.error('Erreur dans fetchSchedules: ', error);
    throw error;
  }
};

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

function extractGroupe(str) {
  if (!str) return null;
  const match = str.match(/\d+/); // \d+ correspond à un ou plusieurs chiffres
  return match ? match[0] : null;
}

module.exports = {
    fetchSchedules,
    fetchLastScheduleUpdate
};
