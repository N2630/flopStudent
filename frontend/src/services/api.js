import axios from 'axios';
import { isDateCurrent } from './utils';
import { updateConnectionStatus } from './connectionStore';
import { getDept, getTrainProg, getGroup,setLastSchedulesUpdate, getSchedule, setSchedule } from '../utils/storageUtils';

/**
 * URL de base de l’API backend.
 * @constant
 * @type {string}
 */
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

/**
 * Récupère la date de dernière mise à jour des emplois du temps pour une année/semaine.
 *
 * @param {string|number} year - Année (ex: "2025" ou 2025)
 * @param {string|number} week - Semaine ISO sur 2 chiffres (ex: "03" ou 3)
 * @returns {Promise<import('axios').AxiosResponse>} Réponse Axios contenant la date dans `data`
 */
const fetchLastSchedulesUpdate = async (year, week) => {
  if (!year || !week) {
    console.warn('Paramètres manquants. Retourne null.');
    return null;
  }
  return await axios.get(`${API_BASE_URL}/api/get-last-schedules-update?year=${year}&week=${week}`);
}

/**
 * Récupère les emplois du temps pour une année/semaine.
 * - Si le backend est joignable, tente un fetch distant et met à jour le cache local.
 * - Si hors-ligne ou incohérence, retombe sur le cache local si valide (même année/semaine).
 * - Met à jour l'état de connexion (affiche/masque la bannière hors-ligne).
 *
 * @param {string|number} year - Année (ex: "2025" ou 2025)
 * @param {string|number} week - Semaine ISO sur 2 chiffres (ex: "03" ou 3)
 * @returns {Promise<Array<Object>>} Tableau de cours (éventuellement vide)
 */
export const fetchSchedules = async (year, week) => {
  const dept = getDept();
  const train_prog = getTrainProg();
  const groupe = getGroup();
  let backendJoinable = true;
  let remoteLastSchedulesUpdate;

  // Vérification des paramètres requis
  if (!dept || !train_prog || !groupe) {
    console.warn('Paramètres manquants. Retourne un tableau vide.');
    return [];
  }

  try {
    remoteLastSchedulesUpdate = await fetchLastSchedulesUpdate(year, week);
    backendJoinable = true;
  } catch(error) {
    console.log(error);
    backendJoinable = false;
  }

  try {
    // 1. Tenter de récupérer les données complètes directement depuis le backend
    const remoteResponse = await axios.get(`${API_BASE_URL}/api/get-schedules?year=${year}&week=${week}&dept=${dept}&train_prog=${train_prog}&groupe=${groupe}`);
    updateConnectionStatus(); // Connexion réussie, masque le bandeau

    // Si on a des données distantes et qu'on est bien sur la semaine courante, les stocker localement
    if (await isDateCurrent(year, week)) {
      setLastSchedulesUpdate(remoteLastSchedulesUpdate ? remoteLastSchedulesUpdate.data : null);
      setSchedule(remoteResponse.data);
    }

    if (backendJoinable) {
      return remoteResponse.data;
    } else {
      return []
    }

  } catch (error) {
    console.error(`Erreur lors de la récupération des données de l'emploi du temps pour la semaine ${week}-${year} depuis le backend :`, error);
    updateConnectionStatus(error);

    const localSchedule = getSchedule();
    if (localSchedule) {
      if (await isDateCurrent(year, week)) {
        return localSchedule;
      } else {
        return [];
      }
    }

    console.log(`Aucune donnée d'emploi du temps disponible pour la semaine ${week}-${year} (ni backend, ni cache valide).`);
    return [];
  }
};

/**
 * Récupère les salles libres pour une année/semaine et le département courant.
 *
 * @param {string|number} year - Année (ex: "2025" ou 2025)
 * @param {string|number} week - Semaine ISO sur 2 chiffres (ex: "03" ou 3)
 * @returns {Promise<Object>} Données des salles libres (structure renvoyée par l’API)
 * @throws {Error} Si l’API renvoie une 400 (paramètres invalides) ou autre erreur réseau
 */
export const fetchFreeRooms = async (year, week) => {
  try {
    const dept = getDept();
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

export const fetchProfSchedules = async (year, week, profDet) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-prof-schedule?year=${year}&week=${week}&profDet=${profDet}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    if (error.response?.status === 400) {
      throw new Error('Paramètres API invalides. Veuillez vérifier votre configuration ou les données.');
    }
    throw error;
  }
}

export const fetchProfsDetails = async (dept) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-profs?dept=${dept}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    if (error.response?.status === 400) {
      throw new Error('Paramètres API invalides. Veuillez vérifier votre configuration ou les données.');
    }
    throw error;
  }
}

export const fetchAllRooms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-all-rooms`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    if (error.response?.status === 400) {
      throw new Error('Paramètres API invalides. Veuillez vérifier votre configuration ou les données.');
    }
    throw error;
  }
}

export const fetchRoomSchedules = async (year, week, room) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-room-schedule?year=${year}&week=${week}&room=${room}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    if (error.response?.status === 400) {
      throw new Error('Paramètres API invalides. Veuillez vérifier votre configuration ou les données.');
    }
    throw error;
  }
}

/**
 * Paramètres: récupère départements, années, groupes
 */
export async function fetchDepartments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-departments`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error);
    throw error;
  }
}

export async function fetchTrainProgs(dept) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-train-progs`, {
      params: { dept }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des années:', error);
    throw error;
  }
}

export async function fetchGroups(dept, trainProg) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-groups`, {
      params: { dept, train_prog: trainProg }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    throw error;
  }
}