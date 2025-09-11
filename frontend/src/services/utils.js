import { getWeekNumber, getYearNumber } from './scheduleService';

/**
 * Vérifie si l'année et la semaine passées en paramètres correspondent à l'année et la semaine courantes.
 *
 * @param {string|number} year - Année à tester (ex : "2024" ou 2024)
 * @param {string|number} week - Numéro de semaine à tester (ex : "17" ou 17)
 * @returns {Promise<boolean>} - true si l'année et la semaine correspondent à la semaine courante, false sinon
 */
export const isDateCurrent = async (year, week) => {
    const currentDate = new Date();
  
    const currentWeek = await getWeekNumber(currentDate);
    const currentYear = await getYearNumber(currentDate);
  
    const numericYear = parseInt(year, 10);
    const numericWeek = parseInt(week, 10);
  
    return numericWeek === Number(currentWeek) && numericYear === Number(currentYear);

};
  