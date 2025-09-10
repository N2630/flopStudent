const { getUsedRoom } = require("../DB/getInfo");
const freeRoomsData = require('../config/freeRooms.json');
const { logBox } = require('./logUtils');
const fs = require('fs/promises'); // Importation du module fs

async function calculateFreeRooms(year, week, targetDept) {
    logBox(`Début du calcul des salles libres pour le département ${targetDept}`, week, year);

    const timeSlots = [480, 570, 665, 755, 855, 945];
    const days = ['m', 'tu', 'w', 'th', 'f'];

    const result = {};

    for (const day of days) {
        result[day] = {};

        for (const slot of timeSlots) {
            result[day][slot] = {};
            let allOccupiedRoomsInSlot = new Set();

            const occupiedRooms = await getUsedRoom(year, week, slot, day);

            // Écrire les salles occupées dans result_used_rooms.json
            

            occupiedRooms.forEach(item => {
                if (item && item.room) {
                    allOccupiedRoomsInSlot.add(item.room);
                }
            });

            await fs.writeFile(
                './result_used_rooms.json',
                JSON.stringify(Array.from(allOccupiedRoomsInSlot), null, 2)
            );

            if (freeRoomsData[targetDept]) {
                const allRoomsForDept = freeRoomsData[targetDept];
                const sallesLibres = allRoomsForDept.filter(
                    room => !allOccupiedRoomsInSlot.has(room)
                );
                result[day][slot][targetDept] = sallesLibres;
            } else {
                console.warn(`Aucune donnée de salle trouvée pour le département ${targetDept}.`);
                result[day][slot][targetDept] = [];
            }
        }
    }

    console.log(`✅ Calcul des salles libres terminé pour le département ${targetDept}.`);
    console.log(result)
    logBox(`Fin du calcul des salles libres pour le département ${targetDept}`, week, year);

    // Écrire les salles libres dans result_free_rooms.json
    await fs.writeFile(
        './result_free_rooms.json',
        JSON.stringify(result, null, 2)
    );

    return result;
}

module.exports = {
    calculateFreeRooms
}; 