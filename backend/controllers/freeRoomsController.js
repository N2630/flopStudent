const freeRoomsService = require('../services/freeRoomsService');

const getFreeRoomsByWeek = async (req, res) => {
  try {
    const { year, week, dept } = req.query;

    if (!year || !week || !dept) {
      return res.status(400).json({ message: 'Année, semaine et département sont requis.' });
    }
    
    const freeRooms = await freeRoomsService.fetchFreeRooms(year, week, dept);
    res.json(freeRooms);
  } catch (error) {
    console.error('Erreur dans getFreeRoomsByWeek:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

module.exports = {
  getFreeRoomsByWeek
};
