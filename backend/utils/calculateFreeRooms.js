const { getUsedRoom } = require("../DB/getInfo");
const freeRoomsData = require('../config/freeRooms.json');
const { logBox } = require('./logUtils');
const fs = require('fs/promises'); // Importation du module fs

/**
 * Calcule les salles libres par jour et créneau pour un département donné.
 *
 * @param {number|string} year - Année ciblée
 * @param {number|string} week - Semaine ISO ciblée
 * @param {string} targetDept - Département (clé de config/freeRooms.json)
 * @returns {Promise<Record<string, Record<string, string[]>>>} Objet: { [dayLetter]: { [slotMinutes]: string[] } }
 */
async function calculateFreeRooms(year, week, targetDept) {


    const timeSlots = [480, 570, 665, 755, 855, 945];
    const days = ['m', 'tu', 'w', 'th', 'f'];

    const result = {};

    for (const day of days) {
        result[day] = {};

        for (const slot of timeSlots) {
            result[day][slot] = {};
            let allOccupiedRoomsInSlot = new Set();

            const occupiedRooms = await getUsedRoom(year, week, slot, day);
            
            occupiedRooms.forEach(item => {
                if (item && item.room) {
                    allOccupiedRoomsInSlot.add(item.room);
                }
            });

            if (freeRoomsData[targetDept]) {
                const allRoomsForDept = freeRoomsData[targetDept];
                const sallesLibres = allRoomsForDept.filter(
                    room => !allOccupiedRoomsInSlot.has(room)
                );

                result[day][slot] = sallesLibres;
            } else {
                console.warn(`Aucune donnée de salle trouvée pour le département ${targetDept}.`);
                result[day][slot] = [];
            }
        }
    }

    return result;
}

module.exports = {
    calculateFreeRooms
}; 