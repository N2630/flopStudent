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

/**
 * Établit la connexion au cluster MongoDB en utilisant l'URI d'environnement.
 * Loggue le succès ou l'erreur ; à appeler au démarrage du serveur.
 *
 * @returns {Promise<void>}
 */
async function connectToDatabase() {
  try {
    await dbClient.connect();
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
  }
}

/**
 * Instance de base de données MongoDB (db "flopStudent").
 * À utiliser pour effectuer les opérations CRUD dans les modules DB.
 * @type {import('mongodb').Db}
 */
const db = dbClient.db("flopStudent");

module.exports = {
    connectToDatabase,
    db
}
