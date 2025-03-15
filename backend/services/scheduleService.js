// services/scheduleService.js
const { dbClient } = require('../config/connectDb');

exports.fetchSchedules = async (year, week, dept, train_prog, groupe ) => {
  const db = dbClient.db("flopStudent");
  const tdGroup = extractGroupe(groupe)
  const query = {
    'date.week': parseInt(week),
    'date.year': parseInt(year),
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
  };
  

  return await db.collection(dept.toLocaleLowerCase()).find(query).toArray();
};


function extractGroupe(str) {
  const match = str.match(/\d+/); // \d+ correspond à un ou plusieurs chiffres
  return match ? match[0] : null;
}

