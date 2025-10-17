const axios = require("axios");
const { storeGroupsStructure } = require("../DB/storeInfo");
const { logBox } = require("./logUtils");

async function fetchData(dept) {
  const [structRes, trainProgRes] = await Promise.all([
    axios.get(`https://flopedt.iut-blagnac.fr/fr/api/groups/structural/?dept=${dept}`),
    axios.get(`https://flopedt.iut-blagnac.fr/fr/api/fetch/idgroup/?dept=${dept}`)
  ]);

  return {
    structuralData: structRes.data,
    idGroupData: trainProgRes.data
  };
}

function buildLookupMaps(idGroupData) {
  const idToName = {};
  const idToTrainProg = {};

  idGroupData.forEach(({ id, name, train_prog }) => {
    idToName[id] = name;
    idToTrainProg[id] = train_prog;
  });

  return { idToName, idToTrainProg };
}

function extractSuperParents(structuralData) {
  return structuralData
    .filter(group => group.parent_groups.length === 0)
    .map(group => group.name);
}

function buildGroupMap(structuralData, idToName, idToTrainProg, dept) {
  const groupMap = new Map();

  structuralData.forEach(parent => {
    const key = `${idToName[parent.id]}::${idToTrainProg[parent.id]}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        _id: parent.id,
        dept,
        tdGroup: idToName[parent.id],
        subGroups: [],
        train_prog: idToTrainProg[parent.id] || null
      });
    }

    const subGroups = structuralData
      .filter(g => g.parent_groups.includes(parent.id))
      .map(g => idToName[g.id])
      .filter(Boolean);

    const groupObj = groupMap.get(key);
    subGroups.forEach(sub => {
      if (!groupObj.subGroups.includes(sub)) groupObj.subGroups.push(sub);
    });
  });

  return Array.from(groupMap.values());
}

function cleanGroupData(groupData, superParents) {
  return groupData.filter(g => !superParents.includes(g.tdGroup) && g.subGroups.length > 0);
}

async function formatGroups(dept) {
  try {
    const { structuralData, idGroupData } = await fetchData(dept);
    const { idToName, idToTrainProg } = buildLookupMaps(idGroupData);
    const superParents = extractSuperParents(structuralData);
    const groupData = buildGroupMap(structuralData, idToName, idToTrainProg, dept);
    const cleanData = cleanGroupData(groupData, superParents);

    return cleanData;
  } catch (error) {
    console.error("Erreur dans formatGroups:", error.message);
    throw error;
  }
}

async function fetchAndStoreGroups() {
    const depts = ['INFO', 'CS', 'RT', 'GIM', 'LPMA'];

    logBox(`Début de la récupération et du stockage des groupes`);
    for (const dept of depts){
        const data = await formatGroups(dept);
        await storeGroupsStructure(data)
        console.log(`Groupes du dept ${dept} stocker.`)
    }
    logBox(`Fin de la récupération et du stockage des groupes`);
}

module.exports = {
    fetchAndStoreGroups
}
