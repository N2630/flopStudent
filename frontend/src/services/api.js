import axios from 'axios';
import { isDateCurrent } from './utils';
import { updateConnectionStatus } from './connectionStore';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://flopstudent-api.belucraft.fr';

const fetchLastSchedulesUpdate = async (year, week) => {

  if (!year || !week) {
    console.warn('Paramètres manquants dans le localStorage. Retourne un tableau vide.');
    return null; // Retourne un tableau vide au lieu de undefined
  }

  return await axios.get(`${API_BASE_URL}/api/get-last-schedules-update?year=${year}&week=${week}`);
}

export const fetchSchedules = async (year, week) => {
  const dept = localStorage.getItem('dept');
  const train_prog = localStorage.getItem('train_prog');
  const groupe = localStorage.getItem('group');
  let localLastUpdate = localStorage.getItem('lastSchedulesUpdate') || null;
  let backendJoinable = true;
  let remoteLastSchedulesUpdate;
  // Vérification des paramètres requis
  if (!dept || !train_prog || !groupe) {
    console.warn('Paramètres manquants dans le localStorage. Retourne un tableau vide.');
    return []; // Retourne un tableau vide au lieu de undefined
  }

  try {
    remoteLastSchedulesUpdate = await fetchLastSchedulesUpdate(year, week);
    backendJoinable = true;
  } catch(error) {
    console.log(error);
    backendJoinable = false;
  }

  if(remoteLastSchedulesUpdate === localLastUpdate && await isDateCurrent(year, week)) {
    const localSchedule = localStorage.getItem('schedule');
    return localSchedule ? JSON.parse(localSchedule) : [];
  }

  // Les paramètres year et week sont maintenant passés directement
  try {
    // 1. Tenter de récupérer les données complètes directement depuis le backend
    const remoteResponse = await axios.get(`${API_BASE_URL}/api/get-schedules?year=${year}&week=${week}&dept=${dept}&train_prog=${train_prog}&groupe=${groupe}`);
    updateConnectionStatus(); // Connexion réussie, masque le bandeau

    // Si on a des données distantes, les stocker localement
    if ( await isDateCurrent(year, week) ) {
      localStorage.setItem('lastSchedulesUpdate', JSON.stringify(remoteLastSchedulesUpdate.data));
      localStorage.setItem('schedule', JSON.stringify(remoteResponse.data));
    }
    
    if(backendJoinable) {
      return remoteResponse.data;
    } else {
      return []
    }
    

  } catch (error) {
    console.error(`Erreur lors de la récupération des données de l'emploi du temps pour la semaine ${week}-${year} depuis le backend :`, error);
    updateConnectionStatus(error);
  
    const localSchedule = localStorage.getItem('schedule');
    if (localSchedule) {
      if ( await isDateCurrent(year, week) ) {
        return JSON.parse(localSchedule); 
      } else {
        return [];
      }
    }
  
    console.log(`Aucune donnée d'emploi du temps disponible pour la semaine ${week}-${year} (ni backend, ni cache valide).`);
    return [];
  }
  
};

export const fetchFreeRooms = async (year, week) => {
  try {
    const dept = localStorage.getItem('dept');
    const response = await axios.get(`${API_BASE_URL}/api/get-free-rooms?year=${year}&week=${week}&dept=${dept}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    if (error.response?.status === 400) {
      throw new Error('Paramètres API invalides. Veuillez vérifier votre configuration ou les données.');
    }
    throw error;
  }
}