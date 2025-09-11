const { db } = require('../config/connectDb');
const { getWeekAndYear } = require('./dateUtils'); 

/**
 * Supprime de la base les emplois du temps trop anciens pour chaque département.
 * - Conserve 3 semaines d’historique sur l’année courante.
 * - Supprime tout ce qui est antérieur à l’année courante.
 *
 * @returns {Promise<void>}
 */
async function cleanOldSchedules() {
    try {
        console.log("Début du nettoyage des anciennes semaines d'emplois du temps.");

        const now = new Date();
        const { week: currentWeek, year } = getWeekAndYear(now);

        // La semaine limite est (semaine actuelle - 3) semaines d'historique
        const limitWeek = currentWeek - 3;

        const depts = ['info', 'cs', 'rt', 'gim', 'lpma'];

        for (const dept of depts) {
            const collection = db.collection(dept);
            
            // Supprimer les documents dont l'année est inférieure à l'année actuelle
            // ou dont l'année est l'année actuelle et la semaine est inférieure à la semaine limite.
            const deleteResult = await collection.deleteMany({
                $or: [
                    { "date.year": { $lt: year } },
                    { "date.year": year, "date.week": { $lt: limitWeek } }
                ]
            });
            console.log(`Nettoyage pour le département ${dept} : ${deleteResult.deletedCount} anciens emplois du temps supprimés.`);
        }
        console.log("Nettoyage des anciennes semaines terminé.");

    } catch (error) {
        console.error("Erreur lors du nettoyage des anciennes semaines d'emplois du temps :", error);
    }
}

module.exports = {
    cleanOldSchedules
}; 