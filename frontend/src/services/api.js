import axios from 'axios';
import { getWeekNumber, getYearNumber } from './scheduleService';

export const fetchSchedules = async () => {
  const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:3000';
  const dept = localStorage.getItem('dept');
  const train_prog = localStorage.getItem('train_prog');
  const groupe = localStorage.getItem('group');

  const date = new Date("2025-06-18T00:00:00Z"); // Date de référence pour la récupération des horaires
  const year = await getYearNumber(date);
  const week = await getWeekNumber(date);



  try {    
    console.log(`${apiUrl}/api/get-schedules?year=${year}&week=${week}&dept=${dept}&train_prog=${train_prog}&groupe=${groupe}`)                             
    const response = await axios.get(`${apiUrl}/api/get-schedules?year=${year}&week=${week}&dept=${dept}&train_prog=${train_prog}&groupe=${groupe}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    throw error;
  }
};

