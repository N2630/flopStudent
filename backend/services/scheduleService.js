// services/scheduleService.js
const { getSchedule } = require("../DB/getInfo")

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
    
    return await getSchedule(year, week, dept, train_prog, groupe, tdGroup);
  } catch (error) {
    console.error('Erreur dans fetchSchedules:', error);
    throw error;
  }
};

function extractGroupe(str) {
  if (!str) return null;
  const match = str.match(/\d+/); // \d+ correspond à un ou plusieurs chiffres
  return match ? match[0] : null;
}

module.exports = {
    fetchSchedules
};
