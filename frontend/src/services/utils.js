import { getWeekNumber, getYearNumber } from './scheduleService';

export const isDateCurrent = async (year, week) => {
    const currentDate = new Date('2025-09-01T12:34:56.789Z');
  
    const currentWeek = await getWeekNumber(currentDate);
    const currentYear = await getYearNumber(currentDate);
  
    const numericYear = parseInt(year, 10);
    const numericWeek = parseInt(week, 10);
  
    console.log("year =", numericYear, "week =", numericWeek);
    console.log("currentYear =", currentYear, "currentWeek =", currentWeek);
    console.log(numericWeek === Number(currentWeek) && numericYear === Number(currentYear))
    return numericWeek === Number(currentWeek) && numericYear === Number(currentYear);

};
  