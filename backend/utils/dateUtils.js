// backend/utils/dateUtils.js

function getWeekAndYear(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const week = Math.ceil(diff / oneWeek);
    const year = date.getFullYear();
    return { week, year };
}

module.exports = {
    getWeekAndYear
}; 