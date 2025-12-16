
/**
 * Permet d'extraire la durée d'un cours à partir de son type.
 * @param {string} courseType le type de cours (ex: "TP180", "CM60", "TD", etc.)
 * @returns {number} Durée en minutes (ex: 180, 60, 90 par défaut)
 */
function extractDuration(courseType) {
    // Cas par défaut : 90 minutes (1h30)
    let duration = 90; 

    // Recherche d'un nombre (la durée) dans la chaîne de type (ex: "TP180", "CM60")
    // Le regex /\d+/g cherche un ou plusieurs chiffres.
    const matches = courseType.match(/\d+/g);

    if (matches && matches.length > 0) {
        // Le premier nombre trouvé est la durée en minutes.
        duration = parseInt(matches[0], 10);
    }
    
    return duration;
}

module.exports = {
    extractDuration
};