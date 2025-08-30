const { getFreeRooms } = require('../DB/getInfo');

const fetchFreeRooms = async (year, week, dept) => {
    try {
        const result = await getFreeRooms(year, week) || [];
        const weekFreeRooms = result[0] || {}; // Prend le premier élément du tableau
        const data = weekFreeRooms.data || {};
        const lastUpdated = weekFreeRooms.lastUpdated || null; // Récupère le timestamp
        const jours = ['m', 'tu', 'w', 'th', 'f'];
        const timeSlots = [480, 570, 665, 755, 855, 945];
        const sallesDept = {};

        jours.forEach(jour => {
            // Initialiser l'objet pour chaque jour
            sallesDept[jour] = {};
        
            timeSlots.forEach(slot => {
                // Convertir le slot en string si nécessaire (car les clés sont souvent des strings)
                const slotKey = slot.toString();
                sallesDept[jour][slotKey] = data[jour]?.[slotKey]?.[dept] || [];
            });
        });

        return { salles: sallesDept, lastUpdated: lastUpdated }; // Renvoie les deux informations
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        throw error;
    }
};

module.exports = {
    fetchFreeRooms
};