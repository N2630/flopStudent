const axios = require("axios");
const { storeProfs } = require("../../DB/storeInfo");
const { getAllProfs } = require("../../DB/getInfo");
const { cleanMissingProfs } = require("../../DB/deleteInfo");
const professeurs = {}; // objet clé username => prof

async function fetchProfs(dept) {
    try {
        const response = await axios.get(`https://flopedt.iut-blagnac.fr/fr/api/user/tutor/?dept=${dept}`);
        return response.data; // retourne tableau de profs
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${dept}:`, error);
        return []; // retourne tableau vide en cas d'erreur
    }
}

function addOrUpdateProf(prof, dept) {
    if (professeurs[prof.username]) {
        // fusionner départements en évitant doublons
        const existingDepts = new Set(professeurs[prof.username].departments);
        existingDepts.add(dept);
        professeurs[prof.username].departments = Array.from(existingDepts);
    } else {
        prof.departments = [dept];
        professeurs[prof.username] = prof;
    }
}

async function fetchAndStoreProfs() {
    const depts = ['INFO', 'CS', 'RT', 'GIM', 'LPMA'];
    for (const dept of depts) {
        const deptProfs = await fetchProfs(dept);
        for (const prof of deptProfs) {
            addOrUpdateProf(prof, dept);
        }
    }
    
    const profsEnBase = await getAllProfs();
    const usernamesEnBase = profsEnBase.map(p => p.username);
    const usernamesActuels = new Set(Object.keys(professeurs));
    const usernamesASupprimer = usernamesEnBase.filter(u => !usernamesActuels.has(u));

    if (usernamesASupprimer.length > 0) {
        await cleanMissingProfs(usernamesASupprimer);
    }

    await storeProfs(Object.values(professeurs));
}

module.exports = {
    fetchAndStoreProfs
}
