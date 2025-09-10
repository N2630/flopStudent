const { calculateFreeRooms } = require('../utils/calculateFreeRooms');

const fetchFreeRooms = async (year, week, dept) => {
    try {
        const result = await calculateFreeRooms(year, week, dept);
        return { salles: result, lastUpdated: new Date() };
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        throw error;
    }
};

module.exports = {
    fetchFreeRooms
};