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
async function getSchedule(year, week, dept, train_prog, groupe) {
  const query = [
    {
      // Trouver le groupe cible (ex: "1")
      "$match": {
        "dept": dept,
        "train_prog": train_prog,
        "$or": [
          { "tdGroup": groupe },              // Si c'est un TD
          { "subGroups": { "$in": [groupe] } } // Si c'est déjà un sous-groupe d'un parent
        ]
      }
    },
    {
      // Trouver dynamiquement tous les "parents" (ici, potentiellement "12") du groupe de TD
      "$graphLookup": {
        "from": "groupsStructure",
        "startWith": groupe,
        "connectFromField": "tdGroup",
        "connectToField": "subGroups",
        "as": "parents",
        "restrictSearchWithMatch": {
          "dept": dept,
          "train_prog": train_prog
        }
      }
    },
    {
      // Définir dynamiquement la liste des groupes à utiliser pour la recherche des cours
      "$addFields": {
        "allGroups": {
          "$concatArrays": [
            [groupe],
            { "$map": { "input": "$parents", "as": "p", "in": "$$p.tdGroup" } }
          ]
        }
      }
    },
    {
      // Lookup dans info avec tous les groupes trouvés (le TD et les parents englobants potentiels)
      "$lookup": {
        "from": dept.toLowerCase(),
        "let": {
          "groups": "$allGroups",
          "train_prog": "$train_prog"
        },
        "pipeline": [
          {
            "$match": {
              "$expr": {
                "$and": [
                  { "$eq": [ { "$getField": { "field": "week", "input": "$date" } }, parseInt(week) ] },
                  { "$eq": [ { "$getField": { "field": "year", "input": "$date" } }, parseInt(year) ] },
                  { "$eq": [ "$groupe.train_prog", "$$train_prog" ] },
                  { "$or": [
                    { "$in": [ "$groupe.name", "$$groups" ] },
                    { "$in": [ "$groupe.name", ["CE", train_prog] ] }
                  ]},
                ]
              }
            }
          }
        ],
        "as": "courses"
      }
    }
  ];
  
  const schedule = await db.collection("groupsStructure").aggregate(query).toArray();
  return schedule[0].courses;
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

async function getProfSchedule(year, week, profDet) {
  const query = {
    $and: [
      {'date.week': parseInt(week)},
      {'date.year': parseInt(year)},
      {'prof':profDet}
    ]
  };
  return await db.collection("all_courses").find(query).toArray();
}

async function getAllDepartments() {
  try {
    const docs = await db.collection('groupsStructure').aggregate([
      { $group: { _id: "$dept" } },
      { $sort: { _id: 1 } }
    ]).toArray();
    return docs.map(d => d._id).filter(Boolean);
  } catch (error) {
    console.error('Erreur DB getAllDepartments:', error);
    throw error;
  }
}

async function getDeptTrainProgs(dept) {
  try {
    const docs = await db.collection('groupsStructure').aggregate([
      { $match: { dept } },
      { $group: { _id: "$train_prog" } },
      { $sort: { _id: 1 } }
    ]).toArray();
    return docs.map(d => d._id).filter(Boolean);
  } catch (error) {
    console.error('Erreur DB getDeptTrainProgs:', error);
    throw error;
  }
}

async function getDeptTrainGroups(dept, train_prog) {
  try {
    const result = await db.collection("groupsStructure").aggregate([
      { $match: { dept: dept, train_prog: train_prog } },
      {
        $group: {
          _id: null,
          allParents: { $addToSet: "$tdGroup" },
          allSubGroups: { $push: "$subGroups" }
        }
      },
      {
        $project: {
          subGroupsFlattened: {
            $reduce: {
              input: "$allSubGroups",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          allParents: 1
        }
      },
      {
        $project: {
          finalGroups: {
            $filter: {
              input: "$subGroupsFlattened",
              as: "sg",
              cond: { $not: { $in: ["$$sg", "$allParents"] } }
            }
          }
        }
      }
    ]).toArray();
    
    // Retourner directement le tableau de groupes finaux
    return result.length > 0 ? result[0].finalGroups : [];
  } catch (error) {
    console.error('Erreur DB getDeptTrainGroups:', error);
    throw error;
  }
}

async function getAllProfs(dept) {
  try {
    const query = dept ? { departments: { $in: [dept] } } : {};
    const profs = await db.collection('profListe').find(query).toArray();
    return profs;
  } catch (error) {
    console.error('Erreur DB getAllProf:', error);
    throw error;
  }
}

module.exports = {
    getSchedule,
    getUsedRoom,
    getLastScheduleUpdate,
    getProfSchedule,
    getAllDepartments,
    getDeptTrainProgs,
    getDeptTrainGroups,
    getAllProfs
};