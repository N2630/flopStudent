const express = require('express');
const {connectToDatabase, dbClient} = require('./connectDb');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// URL de connexion à MongoDB (remplacez par votre URL MongoDB Atlas)
connectToDatabase();

// Endpoint pour récupérer les données de Flop!EDT
app.get('/api/schedules', async (req, res) => {
  try {
    // Exemple de requête avec Axios (remplacez l'URL par celle de Flop!EDT)
    const responseInfo = await axios.get('https://flopedt.iut-blagnac.fr/fr/api/fetch/scheduledcourses/?week=11&year=2025&dept=INFO');
    const schedulesInfo = responseInfo.data;

    storeInfo(schedulesInfo, "info")

    res.json(schedulesInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

async function storeInfo(schedulList, collectionName) {
    try{
        for(const schedule of schedulList) {

            const formatedData = {
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
                    name: schedule.course.groups.name,
                    train_prog: schedule.course.groups.train_prog,
               },
               prof: schedule.tutor
            }
            console.log(formatedData)
            //await dbClient.db("flopStudent").collection(collectionName).insertOne(formatedData)
        }
    }catch(error) {
        console.error("Erreur lors de la sauvegarde des données :", error)
    }
}