const { db } = require('../config/connectDb');

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

async function getUsedRoom(year, week, dept, slot) {
  const query = {
      $and: [
        {'date.week': parseInt(week)},
        {'date.year': parseInt(year)},
        {'start_time': slot},
        { // Utilisation de $nor pour l'exclusion des salles
          $nor :[
            {'room': { $regex: "Amphi" }},
            {'room': { $regex: "A011" }},
            {'room': { $regex: "Labo" }}
          ]
        }
      ]
    };
  return await db.collection(dept.toLowerCase()).find(query).toArray();
}

const getFreeRooms = async (year, week) => {
  const query = {
    $and: [
      {'week': parseInt(week)},
      {'year': parseInt(year)}
    ]
  }
  
  return await db.collection("freeRooms").find(query).toArray();
}

module.exports = {
    getFreeRooms,
    getSchedule,
    getUsedRoom
};