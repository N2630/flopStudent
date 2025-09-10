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