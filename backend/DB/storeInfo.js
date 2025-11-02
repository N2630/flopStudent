const { db} = require('../config/connectDb');

/**
 * Insère ou met à jour les cours d'une collection à partir d'une liste récupérée à distance.
 * Formate les données pour stockage (jours, heures, groupe, affichage, etc.).
 *
 * @param {Array<Object>} schedulList - Liste brute des cours (API flop!EDT)
 * @param {string} collectionName - Nom de la collection MongoDB cible (département)
 * @returns {Promise<void>}
 */
async function storeSchedule(schedulList, collectionName) {
    try{
      for(const schedule of schedulList) {
  
        const formatedData = {
          id: schedule.id,
          room: schedule.room.name,
          date:{
            day: schedule.day,
            week: schedule.course.week,
            year: schedule.course.year,
          },
          start_time: schedule.start_time,
          course:{
            type: schedule.course.type,
            name: schedule.course.module.name,
            abbrev: schedule.course.module.abbrev,
            is_graded: schedule.course.is_graded
          },
          groupe: {
            name: schedule.course.groups[0].name,
            train_prog: schedule.course.groups[0].train_prog,
          },
          prof: schedule.tutor,
          display: {
            color_bg: schedule.course.module.display.color_bg,
            color_txt: schedule.course.module.display.color_txt
          }
          
        }
  
        const existingSchedul = await db.collection(collectionName).findOne({id: schedule.id})
  
        if(!existingSchedul){
          await db.collection(collectionName).insertOne(formatedData)
        } else {
          await db.collection(collectionName).updateOne({id: schedule.id}, {$set: formatedData})
        }
        
      }
    }catch(error) {
        console.error("Erreur lors de la sauvegarde des données :", error)
        return
    }
}

/**
 * Enregistre le timestamp de dernière mise à jour pour une année/semaine d'EDT.
 *
 * @param {number|string} year - Année
 * @param {number|string} week - Semaine ISO
 * @returns {Promise<void>}
 */
async function storeLastScheduleUpdate(year, week) {
  try {
    const collection = db.collection("lastUpdates");
    const updateKey = `schedules_${year}_${week}`;
    const now = new Date();

    await collection.updateOne(
      { _id: updateKey },
      { $set: { lastUpdated: now } },
      { upsert: true } // Crée le document s'il n'existe pas
    );
    console.log(`Timestamp de mise à jour des emplois du temps enregistré pour la semaine ${week}, année ${year}.`);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du timestamp de mise à jour des emplois du temps :", error);
    throw error;
  }
}

async function storeGroupsStructure(groupList) {
  try{
    const collection = db.collection("groupsStructure");
    
    for(group of groupList) {
      await collection.updateOne(
        { _id: group._id },
        { $set: group },
        { upsert: true }
      );      
    }

    console.log(`Maj des groups effectué.`);
  }catch(error) {
      console.error("Erreur lors de la sauvegarde des données :", error)
      return
  }
}

async function storeProfs(profList) {
  try{
    const collection = db.collection("profListe");

    for (const prof of profList) {
      await collection.updateOne(
        { username: prof.username },
        { $set: {
          first_name: prof.first_name,
          last_name: prof.last_name,
          email: prof.email,
          departments: prof.departments
        }},
        { upsert: true }
      );
    }

    console.log(`${profList.length} mis à jour/ajouté à la base avec succès.`);
  }catch(error) {
      console.error("Erreur lors de la sauvegarde des données :", error)
      return
  }
}

module.exports = {
    storeSchedule,
    storeLastScheduleUpdate,
    storeGroupsStructure,
    storeProfs
};