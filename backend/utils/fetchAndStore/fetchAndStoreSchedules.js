const axios = require('axios');
const { storeSchedule, storeLastScheduleUpdate } = require('../../DB/storeInfo'); // Importation
const { cleanUnSchedulesCourse } = require('../../DB/deleteInfo');
const { logBox } = require('../logUtils'); // Importation

/**
 * Récupère les cours depuis l’API flop!EDT pour chaque département,
 * nettoie les cours obsolètes, stocke les nouveaux cours et enregistre la date de dernière mise à jour.
 *
 * @param {number} week - Semaine ISO
 * @param {number} year - Année
 * @returns {Promise<void>}
 */
async function fetchAndStoreSchedules(week, year){
    try { // Réactivation du try-catch externe
        const depts = ['INFO', 'CS', 'RT', 'GIM', 'LPMA']
    
        for (const dept of depts) {
            logBox(`Début de la récupération et du stockage des emplois du temps`, week, year, dept);
            let response
            try {
                response = await axios.get(`https://flopedt.iut-blagnac.fr/fr/api/fetch/scheduledcourses/?week=${week}&year=${year}&dept=${dept}`)
            } catch (error) {
                console.error(`Erreur lors de la récupération des données pour ${dept}:`, error);
                logBox(`Fin de la récupération et du stockage (avec erreurs) des emplois du temps`, week, year, dept);
                continue; // Passe au département suivant en cas d'erreur
            }
            const schedules = response.data;
            console.log(`Données récupérées pour ${dept}, semaine ${week}, année ${year}. Nombre de cours: ${schedules.length}`);
            
            await cleanUnSchedulesCourse(schedules, dept.toLowerCase(), week, year);
            await storeSchedule(schedules, dept.toLowerCase());
            await storeLastScheduleUpdate(year, week); // Enregistrer le timestamp après la mise à jour des cours
            logBox(`Fin de la récupération et du stockage des emplois du temps`, week, year, dept);
        }
    } catch (error) {
        console.error('Erreur globale lors de la récupération et du stockage des données des emplois du temps :', error);
    }
}

module.exports = {
    fetchAndStoreSchedules
};