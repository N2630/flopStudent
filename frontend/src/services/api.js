import axios from 'axios';

export const fetchSchedules = async () => {
  const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:3000';
  try {
    const response = await axios.get(`${apiUrl}/api/get-schedules`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    throw error;
  }
};
