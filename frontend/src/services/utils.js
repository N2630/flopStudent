import { getWeekNumber, getYearNumber } from './scheduleService';

export const isDateCurrent = async (year, week) => {
    const currentDate = new Date();
  
    const currentWeek = await getWeekNumber(currentDate);
    const currentYear = await getYearNumber(currentDate);
  
    const numericYear = parseInt(year, 10);
    const numericWeek = parseInt(week, 10);
  
    return numericWeek === Number(currentWeek) && numericYear === Number(currentYear);

};
  