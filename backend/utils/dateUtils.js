// backend/utils/dateUtils.js

/**
 * Calcule la semaine ISO (1-53) et l'année pour une date donnée.
 *
 * @param {Date|string|number} [dateToAnalyse] - Date à analyser (par défaut: maintenant)
 * @returns {{week: number, year: number}} - Numéro de semaine et année
 */
function getWeekAndYear(dateToAnalyse) {
    const date = dateToAnalyse ? new Date(dateToAnalyse) : new Date();
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week = new Date(date.getFullYear(), 0,4);
    const weekToReturn = Number(('0' + (1 + Math.round(((date.getTime() - week.getTime()) / 86400000 - 3 + (week.getDay() + 6) % 7) / 7))).slice(-2));
    const year = date.getFullYear();
    return { week: weekToReturn, year };
}

module.exports = {
    getWeekAndYear
}; 