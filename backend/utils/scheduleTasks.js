const { getWeekAndYear } = require('./dateUtils'); 
const { fetchAndStoreSchedules } = require('./fetchAndStoreSchedules');
const { cleanOldSchedules } = require('./cleanOldSchedules');
const clearSchedule = process.env.CLEAR_SCHEDULE_OPTION || true;

/**
 * Met à jour les emplois du temps pour les 4 prochaines semaines (à partir d’aujourd’hui),
 * puis lance un nettoyage des anciennes semaines.
 *
 * @returns {Promise<void>}
 * @throws {Error} - Propage l’erreur afin que l’appelant puisse la gérer
 */
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
        if(clearSchedule) {
            await cleanOldSchedules();
        }
        

        console.log("Mise à jour des emplois du temps et nettoyage terminés.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des emplois du temps et du nettoyage :", error);
        throw error; // Propager l'erreur pour que le gestionnaire d'appels puisse la traiter
    }
}

module.exports = {
    updateSchedulesAndClean,
}; 