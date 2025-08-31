const axios = require('axios');
const { storeFreeRooms } = require('../DB/storeInfo');
const { getUsedRoom } = require("../DB/getInfo")
const freeRoomsData = require('../config/freeRooms.json');
const { logBox } = require('./logUtils'); // Importation

async function fetchAndStoreFreeRooms(year, week) {
    logBox(`Début du calcul et du stockage des salles libres`, week, year);
    const depts = Object.keys(freeRoomsData);
    const timeSlots = [480, 570, 665, 755, 855, 945];
    const days = ['m', 'tu', 'w', 'th', 'f'];

    const result = {};

    for (const day of days) {
        result[day] = {};

        for (const slot of timeSlots) { 
            result[day][slot] = {};
            let allOccupiedRoomsInSlot = new Set();

            // Récupérer toutes les salles occupées pour ce jour et ce créneau, pour tous les départements
            for (const deptIter of depts) {

                // getUsedRoom est appelée avec un seul deptIter pour chaque département
                const occupiedRoomsForDept = await getUsedRoom(year, week, deptIter, slot);
                occupiedRoomsForDept.forEach(item => {
                    if (item && item.room) {
                        allOccupiedRoomsInSlot.add(item.room);
                    }
                });
            }

            // Pour chaque département, déterminer les salles libres pour ce jour et ce créneau
            for (const dept of depts) {
                const sallesLibres = freeRoomsData[dept].filter(room => !allOccupiedRoomsInSlot.has(room));
                result[day][slot][dept] = sallesLibres;
            }
        }
    }
    console.log("Calcul des salles libres terminé.");
    await storeFreeRooms(year, week, result)
    logBox(`Fin du calcul et du stockage des salles libres`, week, year);
}

module.exports = {
    fetchAndStoreFreeRooms
};