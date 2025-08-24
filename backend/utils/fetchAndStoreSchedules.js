const axios = require('axios');
const { storeSchedule } = require('../DB/storeInfo');

async function fetchAndStoreSchedules(week, year){
    try { // Réactivation du try-catch externe
        const depts = ['INFO', 'CS', 'RT', 'GIM', 'LPMA']
    
        for (const dept of depts) {
            console.log(`Récupération des données pour ${dept}, semaine ${week}, année ${year}`);
            let response
            try {
                response = await axios.get(`https://flopedt.iut-blagnac.fr/fr/api/fetch/scheduledcourses/?week=${week}&year=${year}&dept=${dept}`)
            } catch (error) {
                console.error(`Erreur lors de la récupération des données pour ${dept}:`, error);
                continue; // Passe au département suivant en cas d'erreur
            }
            const schedules = response.data;
            console.log(`Données récupérées pour ${dept}, semaine ${week}, année ${year}. Nombre de cours: ${schedules.length}`);
            await storeSchedule(schedules, dept.toLowerCase())
        }
    } catch (error) {
        console.error('Erreur globale lors de la récupération et du stockage des données des emplois du temps :', error);
    }
}

module.exports = {
    fetchAndStoreSchedules
};