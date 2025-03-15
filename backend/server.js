const express = require('express');
const { connectToDatabase, dbClient } = require('./config/connectDb');
const axios = require('axios');
const cron = require('node-cron');
const apiRoutes = require("./routes/api");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

//Définition de la route de l'API
app.use('/api', apiRoutes)
// Connexion à MongoDB
connectToDatabase();

// Fonction pour récupérer et stocker les données
async function fetchAndStoreSchedules() {
  try {
    const response = await axios.get('https://flopedt.iut-blagnac.fr/fr/api/fetch/scheduledcourses/?week=12&year=2025&dept=INFO');
    const schedules = response.data;

    
    await storeInfo(schedules, "info");

    console.log('Données récupérées et stockées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la récupération ou du stockage des données :', error);
  }
}

// Planifier la tâche pour s'exécuter toutes les semaines (par exemple, tous les dimanches à minuit)
//cron.schedule('0 0 * * 0', fetchAndStoreSchedules);

// Exécuter une fois au démarrage pour s'assurer que les données sont à jour
fetchAndStoreSchedules();

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

async function storeInfo(schedulList, collectionName) {
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
        prof: schedule.tutor
      }

      const existingSchedul = await dbClient.db("flopStudent").collection("info").findOne({id: schedule.id})

      if(!existingSchedul){
        await dbClient.db("flopStudent").collection(collectionName).insertOne(formatedData)
      } else {
        await dbClient.db("flopStudent").collection(collectionName).updateOne({id: schedule.id}, {$set: formatedData})
      }
      
    }
  }catch(error) {
    console.error("Erreur lors de la sauvegarde des données :", error)
  }
}