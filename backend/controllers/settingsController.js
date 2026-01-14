const { getAllDepartments, getDeptTrainProgs, getDeptTrainGroups } = require('../DB/getInfo');

/**
 * Contrôleur HTTP: retourne tous les départements disponibles.
 *
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await getAllDepartments();
    res.json(departments);
  } catch (error) {
    console.error('Erreur dans getDepartments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des départements', error: error.message });
  }
};

/**
 * Contrôleur HTTP: retourne toutes les années de formation disponibles pour un département.
 *
 * @param {import('express').Request} req - Requête Express (query: dept)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getTrainProgs = async (req, res) => {
  try {
    const { dept } = req.query;
    
    if (!dept) {
      return res.status(400).json({ message: 'Département requis' });
    }
    
    const trainProgs = await getDeptTrainProgs(dept);
    res.json(trainProgs);
  } catch (error) {
    console.error('Erreur dans getTrainProgs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des années', error: error.message });
  }
};

/**
 * Contrôleur HTTP: retourne tous les groupes disponibles pour un département et une année.
 *
 * @param {import('express').Request} req - Requête Express (query: dept, train_prog)
 * @param {import('express').Response} res - Réponse Express
 * @returns {Promise<void>}
 */
const getGroups = async (req, res) => {
  try {
    const { dept, train_prog } = req.query;
    
    if (!dept || !train_prog) {
      return res.status(400).json({ message: 'Département et année requis' });
    }
    
    const groups = await getDeptTrainGroups(dept, train_prog);
    res.json(groups);
  } catch (error) {
    console.error('Erreur dans getGroups:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des groupes', error: error.message });
  }
};

module.exports = {
  getDepartments,
  getTrainProgs,
  getGroups
};
