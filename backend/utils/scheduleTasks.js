const { getWeekAndYear } = require('./dateUtils'); 
const { fetchAndStoreSchedules } = require('./fetchAndStoreSchedules');
const { fetchAndStoreFreeRooms } = require('./fetchAndStoreFreeRooms');
const { cleanOldSchedules } = require('./cleanOldSchedules');

async function updateSchedulesAndClean() {
    console.log("Début de la mise à jour des emplois du temps et du nettoyage.");
    try {
        const now = new Date();

        // Récupérer les 4 prochaines semaines d'emplois du temps
        for (let i = 0; i < 4; i++) {
            const targetDate = new Date(now);
            targetDate.setDate(now.getDate() + (i * 7));
            const { week, year } = getWeekAndYear(targetDate);
            console.log(`Récupération des emplois du temps pour la semaine ${week} de l'année ${year}...`);
            await fetchAndStoreSchedules(week, year);
        }

        // Nettoyer les anciennes semaines
        await cleanOldSchedules();

        console.log("Mise à jour des emplois du temps et nettoyage terminés.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des emplois du temps et du nettoyage :", error);
        throw error; // Propager l'erreur pour que le gestionnaire d'appels puisse la traiter
    }
}

async function updateFreeRooms() {
    console.log("Début de la mise à jour des salles libres.");
    try {
        const now = new Date();
        const { week, year } = getWeekAndYear(now);
        await fetchAndStoreFreeRooms(year, week);
        console.log("Mise à jour des salles libres terminée.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des salles libres :", error);
        throw error; // Propager l'erreur
    }
}

module.exports = {
    updateSchedulesAndClean,
    updateFreeRooms
}; 