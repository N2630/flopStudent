const { db } = require('../config/connectDb');

/**
 * Récupère les cours filtrés par année/semaine et groupe (avec logique TD/CM) pour un département.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {string} dept - Département (ex: "info")
 * @param {string} train_prog - Année de formation (ex: "BUT1")
 * @param {string} groupe - Groupe complet (ex: "1A")
 * @param {string} tdGroup - Numéro de groupe extrait (ex: "1")
 * @returns {Promise<Array<Object>>} - Tableau des cours
 */
async function getSchedule(year, week, dept, train_prog, groupe, tdGroup) {
    const query = {
      $and: [
        {'date.week': parseInt(week)},
        {'date.year': parseInt(year)},
        {
          $or: [
            {
              $and: [
                { 'groupe.name': groupe },
                { 'groupe.train_prog': train_prog }
              ]
            },
            {
              $and: [
                { 'groupe.name': tdGroup },
                { 'groupe.train_prog': train_prog }
              ]
            },
            {
              $and: [
                {
                  $or: [
                    { 'groupe.name': { $regex: tdGroup } },
                    { 'groupe.name': "CE" }
                  ]
                },
                { 'course.type': "CM" },
                { 'groupe.train_prog': train_prog }
              ]
            }
          ]
        }
      ]
    };
    return await db.collection(dept.toLowerCase()).find(query).toArray();
}

/**
 * Récupère les salles utilisées pour un créneau/ jour / semaine / année,
 * en excluant certains types de salles (Amphi, A011, Labo).
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @param {number} slot - Début du créneau (en minutes depuis minuit)
 * @param {"m"|"tu"|"w"|"th"|"f"} day - Jour (lettre)
 * @returns {Promise<Array<Object>>} - Cours trouvés au créneau
 */
async function getUsedRoom(year, week, slot, day) {
  const query = {
    $and: [
      { "date.week": parseInt(week) },
      { "date.year": parseInt(year) },
      { "date.day": day },              
      { "start_time": slot },
      {
        $nor: [
          { "room": { $regex: "Amphi" } },
          { "room": { $regex: "A011" } },
          { "room": { $regex: "Labo" } }
        ]
      }
    ]
  };

  return await db.collection("all_courses").find(query).toArray();
}

/**
 * Récupère la date/heure de dernière mise à jour pour une semaine/année.
 *
 * @param {number|string} year - Année (ex: 2025)
 * @param {number|string} week - Semaine ISO (ex: 17)
 * @returns {Promise<Date|null>} - Timestamp ou null si non trouvé
 */
async function getLastScheduleUpdate(year, week) {
  try {
    const updateKey = `schedules_${year}_${week}`;
    const document = await db.collection("lastUpdates").findOne({ _id: updateKey });
    return document ? document.lastUpdated : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du timestamp de mise à jour des emplois du temps :", error);
    throw error;
  }
}

module.exports = {
    getSchedule,
    getUsedRoom,
    getLastScheduleUpdate
};