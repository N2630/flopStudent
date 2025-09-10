const express = require('express');
const { connectToDatabase } = require('./config/connectDb');
const { fetchAndStoreSchedules } = require('./utils/fetchAndStoreSchedules');
const { updateSchedulesAndClean } = require('./utils/scheduleTasks'); // Importation des fonctions groupées
const { getWeekAndYear } = require("./utils/dateUtils")
const cron = require('node-cron');
const apiRoutes = require("./routes/api");
const cors = require('cors');
const wait = require('node:timers/promises').setTimeout;

require('dotenv').config(); // Charger les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

//Définition de la route de l'API
app.use('/api', apiRoutes)

// Connexion à MongoDB
connectToDatabase();

// Tâche planifiée pour récupérer, valider et stocker les 4 prochaines semaines de l'EDT
// Tous les vendredis à 17h00
cron.schedule('*/60 10-17 * * 0-5', async () => {
    console.log('Exécution de la tâche planifiée de récupération et nettoyage des emplois du temps.');
    try {
        await updateSchedulesAndClean();
        console.log('Tâche de récupération et nettoyage des emplois du temps terminée.');
    } catch (error) {
        console.error('Erreur lors de la tâche planifiée de récupération et nettoyage des emplois du temps :', error);
    }
}, {
    scheduled: true,
    timezone: "Europe/Paris" 
});

// Tâche planifiée pour récupérer et vérifier la validiter de l'EDT de la semaine actuel
// Toutes les 10min entre 8h et 18h59 du lundi au vendredi
cron.schedule('*/10 8-18 * * 1-5', async () => {
  console.log('Exécution de la tâche planifiée de récupération et nettoyage des emplois du temps.');
  try {
    const now = new Date();
    const { week, year } = getWeekAndYear(now);

    await fetchAndStoreSchedules(week, year);
    console.log('Tâche de récupération et nettoyage des emplois du temps terminée.');
  } catch (error) {
      console.error('Erreur lors de la tâche planifiée de récupération et nettoyage des emplois du temps :', error);
  }
}, {
  scheduled: true,
  timezone: "Europe/Paris" 
});


app.listen(PORT, "0.0.0.0", async () => {
  await console.log(`Serveur démarré sur le port ${PORT}`);
});

initializeServer();

// Fonction d'initialisation
async function initializeServer() {
  await wait(1000)
  try {
    console.log("Récupération initiale des données...");
    await updateSchedulesAndClean(); 

    console.log("Initialisation du serveur terminée avec succès.");
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    return
  }
}