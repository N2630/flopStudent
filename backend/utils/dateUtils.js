// backend/utils/dateUtils.js

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