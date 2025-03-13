const { dbClient } = require('../config/connectDb');

exports.fetchSchedules = async () => {
  const db = dbClient.db("flopStudent");
  return await db.collection("info").find({}).toArray();
};
