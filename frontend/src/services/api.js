import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

export const fetchSchedules = async (year, week) => {
  const dept = localStorage.getItem('dept');
  const train_prog = localStorage.getItem('train_prog');
  const groupe = localStorage.getItem('group');

  // Vérification des paramètres requis
  if (!dept || !train_prog || !groupe) {
    console.warn('Paramètres manquants dans le localStorage. Retourne un tableau vide.');
    return []; // Retourne un tableau vide au lieu de undefined
  }

  // Les paramètres year et week sont maintenant passés directement
  try {    
    console.log(`${API_BASE_URL}/api/get-schedules?year=${year}&week=${week}&dept=${dept}&train_prog=${train_prog}&groupe=${groupe}`)                             
    const response = await axios.get(`${API_BASE_URL}/api/get-schedules?year=${year}&week=${week}&dept=${dept}&train_prog=${train_prog}&groupe=${groupe}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    if (error.response?.status === 400) {
      throw new Error('Paramètres API invalides. Veuillez vérifier votre configuration ou les données.');
    }
    throw error;
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