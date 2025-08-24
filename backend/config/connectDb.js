const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI
const dbClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

async function connectToDatabase() {
  try {
    await dbClient.connect();
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
  }
}

const db = dbClient.db("flopStudent");

module.exports = {
    dbClient,
    connectToDatabase,
    db
}
