const { db } = require("../config/connectDb");
const { getWeekAndYear } = require("../utils/dateUtils")

/**
 * Supprime les cours obsolètes en base pour une semaine/année/collection
 * en se basant sur la nouvelle liste récupérée (diff sur les IDs).
 *
 * @param {Array<Object>} newSchedules - Nouvelle liste de cours (contient les IDs à conserver)
 * @param {string} collectionName - Nom de la collection MongoDB (département)
 * @param {number|string} week - Semaine ISO
 * @param {number|string} year - Année
 * @returns {Promise<void>}
 */
async function cleanUnSchedulesCourse(newSchedules, collectionName, week, year) {
    try {
        console.log(`Début du nettoyage des cours non programmés pour ${collectionName}, semaine ${week}, année ${year}.`);

        // 1. Récupérer tous les IDs des cours de la nouvelle liste
        const newScheduleIds = new Set(newSchedules.map(schedule => schedule.id));

        // 2. Récupérer tous les cours existants dans la base de données pour cette semaine/année/collection
        const existingSchedules = await db.collection(collectionName).find({
            "date.week": parseInt(week),
            "date.year": parseInt(year),
        }).toArray();

        // 3. Identifier les cours à supprimer (ceux qui sont dans la DB mais pas dans la nouvelle liste)
        const coursesToDelete = existingSchedules.filter(existingSchedule =>
            !newScheduleIds.has(existingSchedule.id)
        );

        if (coursesToDelete.length > 0) {
            const deleteIds = coursesToDelete.map(course => course.id);
            await db.collection(collectionName).deleteMany({
                id: { $in: deleteIds }
            });
        } else {
            console.log(`Nettoyage pour ${collectionName}, semaine ${week}, année ${year} : Aucun cours non programmé à supprimer.`);
        }

    } catch (error) {
        console.error("Erreur lors du nettoyage des cours non programmés :", error);
        throw error; // Propager l'erreur
    }
}

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

async function cleanMissingProfs(profsUsernames) {
    try {
        const profCollection = db.collection("profListe");
        await profCollection.deleteMany({
            username: { $in: profsUsernames }
        });

        console.log(`${profsUsernames.length} profs nettoyés de la base avec succès.`);
    } catch (error) {
        console.error("Erreur lors du nettoyage des professeurs manquants :", error);
    }
}
module.exports = {
    cleanUnSchedulesCourse,
    cleanOldSchedules,
    cleanMissingProfs
};