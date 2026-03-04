// init-db.js
db = db.getSiblingDB('flopStudent');

// Création des collections physiques
const collections = ["info", "cs", "rt", "gim", "lpma", "groupsStructure", "lastUpdates", "profListe"];
collections.forEach(name => {
    db.createCollection(name);
    db[name].createIndex({ "_id": 1 });
});

// Création de la vue all_courses (union des départements)
db.createView("all_courses", "info", [
    { "$unionWith": { "coll": "cs" } },
    { "$unionWith": { "coll": "rt" } },
    { "$unionWith": { "coll": "gim" } },
    { "$unionWith": { "coll": "lpma" } }
]);

print("Initialisation de la BD terminée avec succès.");