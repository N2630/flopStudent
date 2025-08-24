const { db} = require('../config/connectDb');

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
            abbrev: schedule.course.module.abbrev
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
  
        const existingSchedul = await db.collection("info").findOne({id: schedule.id})
  
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

async function storeFreeRooms(year, week, freeRoomsData) {
  try {

    const collection = db.collection("freeRooms"); 
    const documentToStore = {
      year: year,
      week: week,
      data: freeRoomsData, 
      lastUpdated: new Date() 
    };


    const existingDocument = await collection.findOne({ year: year, week: week });

    if (existingDocument) {
      await collection.updateOne(
        { _id: existingDocument._id },
        { $set: documentToStore }
      );
      console.log(`Données des salles libres mises à jour pour la semaine ${week}, année ${year}.`);

    } else {
      await collection.insertOne(documentToStore);
      console.log(`Nouvelles données des salles libres stockées pour la semaine ${week}, année ${year}.`);
    }
  } catch (error) {
    console.error("Erreur lors du stockage des salles libres calculées :", error);
    throw error;
  }
}

module.exports = {
    storeSchedule,
    storeFreeRooms
}