const { db } = require("../config/connectDb");

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

module.exports = {
    cleanUnSchedulesCourse,
};